// pipeline/build-core-db.mjs
// Bangun mushaf-core.db (SQLite) = ZONA KANONIK immutable (surah/ayah/hash/meta).
// Terjemahan (zona keilmuan) ditulis TERPISAH ke data/app-content.json agar DB
// kanonik tetap murni (Hukum Besi #1: teks kanonik immutable & terpisah).
//
// Di akhir: recompute Merkle root DARI DB -> harus == config/integrity.json.

import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { skeleton, nfc } from './lib/text.mjs';
import { leafHash, merkleRoot } from './lib/merkle.mjs';

const DATA_DIR = new URL('../data/', import.meta.url);
const CFG_DIR = new URL('../config/', import.meta.url);
mkdirSync(DATA_DIR, { recursive: true });

const normalized = JSON.parse(readFileSync(new URL('normalized.json', DATA_DIR), 'utf8'));
const integrity = JSON.parse(readFileSync(new URL('integrity.json', CFG_DIR), 'utf8'));
const report = JSON.parse(readFileSync(new URL('verify-report.json', DATA_DIR), 'utf8'));
const { surahs, ayahs } = normalized;

const matchedByGlobal = new Map(report.perAyah.map((p) => [p.global, p.sources_matched.join(',')]));

const dbPath = fileURLToPath(new URL('mushaf-core.db', DATA_DIR));
if (existsSync(dbPath)) rmSync(dbPath); // rebuild bersih (re-seed eksplisit, bukan mutasi runtime)

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE surah (
  number            INTEGER PRIMARY KEY,   -- 1..114
  name_ar           TEXT NOT NULL,
  name_latin        TEXT NOT NULL,
  name_en           TEXT,
  revelation_place  TEXT NOT NULL,         -- makkah|madinah
  ayah_count        INTEGER NOT NULL,
  order_revelation  INTEGER NOT NULL,
  bismillah_pre     INTEGER NOT NULL       -- 1 = diawali basmalah (semua kecuali 9)
);

CREATE TABLE ayah (
  id            INTEGER PRIMARY KEY,        -- global 1..6236 (urutan Hafs)
  surah_number  INTEGER NOT NULL REFERENCES surah(number),
  ayah_number   INTEGER NOT NULL,           -- nomor dalam surah
  text_uthmani  TEXT NOT NULL,              -- IMMUTABLE (NFC, rasm Uthmani, Hafs)
  text_skeleton TEXT NOT NULL,              -- rasm tanpa tanda (untuk search/verify)
  juz           INTEGER, hizb INTEGER, ruku INTEGER, manzil INTEGER,
  page_madani   INTEGER,
  sajdah        INTEGER NOT NULL DEFAULT 0,
  count_method  TEXT NOT NULL DEFAULT 'kufi',
  UNIQUE (surah_number, ayah_number)
);

CREATE TABLE ayah_hash (
  ayah_id         INTEGER PRIMARY KEY REFERENCES ayah(id),
  algo            TEXT NOT NULL,            -- sha-256
  hash_hex        TEXT NOT NULL,            -- SHA256(utf8(NFC(text_uthmani)))
  sources_matched TEXT NOT NULL            -- csv: quran_com,tanzil,kemenag
);

CREATE TABLE mushaf_meta (
  merkle_root   TEXT PRIMARY KEY,
  algo          TEXT NOT NULL,
  riwayah       TEXT NOT NULL,             -- hafs
  rasm          TEXT NOT NULL,             -- uthmani
  count_method  TEXT NOT NULL,             -- kufi
  surah_count   INTEGER NOT NULL,
  ayah_count    INTEGER NOT NULL,
  build_version TEXT NOT NULL,
  built_at      TEXT NOT NULL
);

CREATE INDEX idx_ayah_surah ON ayah(surah_number, ayah_number);
CREATE INDEX idx_ayah_juz   ON ayah(juz);
CREATE INDEX idx_ayah_page  ON ayah(page_madani);
`);

const insSurah = db.prepare(
  `INSERT INTO surah (number,name_ar,name_latin,name_en,revelation_place,ayah_count,order_revelation,bismillah_pre)
   VALUES (?,?,?,?,?,?,?,?)`
);
for (const s of surahs) {
  insSurah.run(s.number, s.name_ar, s.name_latin, s.name_en, s.revelation_place,
    s.ayah_count, s.order_revelation, s.bismillah_pre ? 1 : 0);
}

const insAyah = db.prepare(
  `INSERT INTO ayah (id,surah_number,ayah_number,text_uthmani,text_skeleton,juz,hizb,ruku,manzil,page_madani,sajdah,count_method)
   VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
);
const insHash = db.prepare(
  `INSERT INTO ayah_hash (ayah_id,algo,hash_hex,sources_matched) VALUES (?,?,?,?)`
);

for (const a of ayahs) {
  const text = nfc(a.arabic_canonical);
  const skel = skeleton(text);
  const m = a.meta ?? {};
  insAyah.run(a.global, a.surah, a.ayah, text, skel,
    m.juz ?? null, m.hizbQuarter ?? null, m.ruku ?? null, m.manzil ?? null, m.page ?? null,
    m.sajda ? 1 : 0, 'kufi');
  insHash.run(a.global, 'sha-256', leafHash(text).toString('hex'), matchedByGlobal.get(a.global) ?? 'quran_com');
}

db.prepare(
  `INSERT INTO mushaf_meta (merkle_root,algo,riwayah,rasm,count_method,surah_count,ayah_count,build_version,built_at)
   VALUES (?,?,?,?,?,?,?,?,?)`
).run(integrity.merkle_root, 'sha-256', 'hafs', 'uthmani', 'kufi', surahs.length, ayahs.length,
  integrity.build_version, integrity.built_at);

// --- Trigger penjaga immutability (tolak UPDATE/DELETE teks kanonik) ---------
db.exec(`
CREATE TRIGGER ayah_no_update BEFORE UPDATE ON ayah
BEGIN SELECT RAISE(ABORT, 'Teks kanonik immutable — UPDATE ditolak'); END;
CREATE TRIGGER ayah_no_delete BEFORE DELETE ON ayah
BEGIN SELECT RAISE(ABORT, 'Teks kanonik immutable — DELETE ditolak'); END;
CREATE TRIGGER surah_no_update BEFORE UPDATE ON surah
BEGIN SELECT RAISE(ABORT, 'Metadata surah immutable — UPDATE ditolak'); END;
CREATE TRIGGER hash_no_update BEFORE UPDATE ON ayah_hash
BEGIN SELECT RAISE(ABORT, 'Hash kanonik immutable — UPDATE ditolak'); END;
`);

// --- Recompute Merkle DARI DB -> harus cocok config -------------------------
const rows = db.prepare('SELECT id,text_uthmani FROM ayah ORDER BY id').all();
const rebuilt = merkleRoot(rows.map((r) => leafHash(r.text_uthmani)));
db.close();

// --- Terjemahan (zona keilmuan) ke file terpisah ----------------------------
const content = {
  builtAt: integrity.built_at,
  provenance: {
    id: normalized.sources.translation_id_kemenag,
    en: normalized.sources.translation_en_sahih,
  },
  translations: ayahs.map((a) => ({ global: a.global, surah: a.surah, ayah: a.ayah, id: a.translations.id, en: a.translations.en })),
};
writeFileSync(new URL('app-content.json', DATA_DIR), JSON.stringify(content), 'utf8');

// --- Report -----------------------------------------------------------------
console.log('MUSHAF build-core-db\n');
console.log(`surah rows : ${surahs.length}`);
console.log(`ayah rows  : ${ayahs.length}`);
console.log(`DB file    : data/mushaf-core.db`);
console.log(`terjemahan : data/app-content.json (id+en, zona keilmuan terpisah)`);
console.log(`\nMerkle root (config) : ${integrity.merkle_root}`);
console.log(`Merkle root (DB)     : ${rebuilt}`);

if (rebuilt !== integrity.merkle_root) {
  console.error('\n✗ FAIL: root DB != config. Build ditolak.');
  process.exit(1);
}
console.log('\n✓ BUILD OK — root DB cocok config. Teks kanonik immutable (trigger + read-only runtime).');
