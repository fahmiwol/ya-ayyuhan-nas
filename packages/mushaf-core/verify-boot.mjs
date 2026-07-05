// packages/mushaf-core/verify-boot.mjs
// Boot-time integrity check (fail-closed). Dipanggil app sebelum menampilkan teks.
//   1. Buka mushaf-core.db READ-ONLY.
//   2. Recompute Merkle root dari 6236 ayat.
//   3. Bandingkan dgn root yg DI-PIN di config/integrity.json.
//   match  -> boot lanjut (exit 0).
//   mismatch / jumlah salah -> REFUSE (exit 1) — jangan tampilkan teks.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { leafHash, merkleRoot } from '../../pipeline/lib/merkle.mjs';

const CFG = JSON.parse(readFileSync(new URL('../../config/integrity.json', import.meta.url), 'utf8'));
const dbPath = fileURLToPath(new URL('../../data/mushaf-core.db', import.meta.url));

const EXPECTED_SURAH = 114;
const EXPECTED_AYAH = 6236;

function fail(msg) {
  console.error(`\n✗ BOOT FAIL-CLOSED: ${msg}`);
  console.error('  App menolak menampilkan teks (integritas tidak terverifikasi).');
  process.exit(1);
}

let db;
try {
  db = new DatabaseSync(dbPath, { readOnly: true }); // READ-ONLY
} catch (e) {
  fail(`tidak bisa buka DB read-only: ${e.message}`);
}

const meta = db.prepare('SELECT * FROM mushaf_meta LIMIT 1').get();
const nSurah = db.prepare('SELECT COUNT(*) n FROM surah').get().n;
const nAyah = db.prepare('SELECT COUNT(*) n FROM ayah').get().n;

if (nSurah !== EXPECTED_SURAH) fail(`jumlah surah ${nSurah} != ${EXPECTED_SURAH}`);
if (nAyah !== EXPECTED_AYAH) fail(`jumlah ayah ${nAyah} != ${EXPECTED_AYAH}`);
if (!meta) fail('mushaf_meta kosong');
if (meta.merkle_root !== CFG.merkle_root) fail('root di DB != root di config');

// buktikan tidak ada lompatan urutan (harus 1..6236 kontigu)
const gaps = db.prepare('SELECT COUNT(*) n FROM ayah a WHERE a.id BETWEEN 1 AND ? ').get(EXPECTED_AYAH).n;
if (gaps !== EXPECTED_AYAH) fail('ada ayat hilang / urutan tidak kontigu');

const rows = db.prepare('SELECT id, text_uthmani FROM ayah ORDER BY id').all();
db.close();

const root = merkleRoot(rows.map((r) => leafHash(r.text_uthmani)));

console.log('MUSHAF boot integrity check\n');
console.log(`surah/ayah   : ${nSurah}/${nAyah}  (urut 1..${EXPECTED_AYAH} kontigu)`);
console.log(`riwayah/rasm : ${meta.riwayah}/${meta.rasm}  (${meta.count_method})`);
console.log(`root (pin)   : ${CFG.merkle_root}`);
console.log(`root (DB)    : ${root}`);

if (root !== CFG.merkle_root) fail('recompute root != pinned root (teks berubah!)');

console.log('\n✓ BOOT OK — integritas terverifikasi, satu huruf pun tidak berubah.');
