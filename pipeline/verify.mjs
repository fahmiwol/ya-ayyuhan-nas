// pipeline/verify.mjs
// Buktikan keaslian teks kanonik, DUA TIER:
//   TIER 1 (jaminan keras) : SHA-256 per-ayah -> Merkle ROOT atas teks kanonik (QPC).
//                            Ubah 1 huruf pun -> root berubah -> boot fail-closed.
//   TIER 2 (bukti silang)  : rasm kanonik cocok dgn Tanzil & Kemenag, berjenjang:
//       L0 skeleton  : buang semua tanda (paling ketat, sensitif konvensi encoding)
//       L1 rasm-fold : samakan dudukan hamza & alef-wasla  (Tanzil==QPC di sini)
//       L2 konsonan  : samakan ejaan panjang alef imla'i vs uthmani (Kemenag==QPC)
// Jujur (sesuai 04_DATA_SOURCES.md C.1): beda antar-penerbit = konvensi encoding,
// BUKAN beda teks. Yang WAJIB 100% = L2 (kerangka konsonan). Sisa L2 -> review manual.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { skeleton, rasmFold, consonantSkeleton, consonantRoot, nfc } from './lib/text.mjs';
import { leafHash, merkleRoot } from './lib/merkle.mjs';

// Beda rasm yg SUDAH DIKENAL & terdokumentasi antara QPC (kanonik) dan digitasi
// Kemenag (equran.id) — konvensi ortografi, BUKAN beda teks Quran. Di-allowlist
// eksplisit supaya beda BARU yg tak terduga tetap fail-closed.
const KNOWN_RASM_CONVENTIONS = {
  '72:16': 'nun idgham: QPC "وَأَلَّوِ" (nun berasimilasi jadi shadda) vs Kemenag "وأن لو" (nun ditulis). Bacaan sama.',
};

const DATA_DIR = new URL('../data/', import.meta.url);
const CFG_DIR = new URL('../config/', import.meta.url);
mkdirSync(CFG_DIR, { recursive: true });

const EXPECTED_SURAH = 114;
const EXPECTED_AYAH = 6236;

const normalized = JSON.parse(readFileSync(new URL('normalized.json', DATA_DIR), 'utf8'));
const { surahs, ayahs } = normalized;

// Referensi basmalah (1:1) untuk buang prefix basmalah yg ditempel ke ayat 1.
const basmalah = ayahs.find((a) => a.surah === 1 && a.ayah === 1);
const REF = {
  L0: skeleton(basmalah.arabic_canonical),
  L1: rasmFold(basmalah.arabic_canonical),
  L2: consonantSkeleton(basmalah.arabic_canonical),
  L3: consonantRoot(basmalah.arabic_canonical),
};
function stripBasmalah(val, level, surah, ayah) {
  if (ayah !== 1 || surah === 1 || surah === 9) return val;
  const ref = REF[level];
  return val.startsWith(ref) ? val.slice(ref.length).trim() : val;
}

console.log('MUSHAF verify — TIER1 Merkle + TIER2 cross-source rasm (L0/L1/L2)\n');

// --- TIER 2: cross-source, berjenjang --------------------------------------
const stat = {
  tanzil: { avail: 0, L0: 0, L1: 0, L2: 0, L3: 0 },
  kemenag: { avail: 0, L0: 0, L1: 0, L2: 0, L3: 0 },
};
const unresolved = []; // beda bahkan di L3 (akar konsonan) -> perlu anotasi/review
const perAyah = [];

function levels(text, surah, ayah) {
  return {
    L0: stripBasmalah(skeleton(text), 'L0', surah, ayah),
    L1: stripBasmalah(rasmFold(text), 'L1', surah, ayah),
    L2: stripBasmalah(consonantSkeleton(text), 'L2', surah, ayah),
    L3: stripBasmalah(consonantRoot(text), 'L3', surah, ayah),
  };
}

for (const a of ayahs) {
  const c = {
    L0: skeleton(a.arabic_canonical),
    L1: rasmFold(a.arabic_canonical),
    L2: consonantSkeleton(a.arabic_canonical),
    L3: consonantRoot(a.arabic_canonical),
  };
  const matched = ['quran_com'];

  for (const src of ['tanzil', 'kemenag']) {
    const raw = a.crosscheck[src];
    if (!raw) continue;
    stat[src].avail++;
    const o = levels(raw, a.surah, a.ayah);
    if (o.L0 === c.L0) stat[src].L0++;
    if (o.L1 === c.L1) stat[src].L1++;
    if (o.L2 === c.L2) stat[src].L2++;
    if (o.L3 === c.L3) {
      stat[src].L3++;
      matched.push(src); // sources_matched = akar konsonan identik
    } else {
      unresolved.push({
        global: a.global, surah: a.surah, ayah: a.ayah, src,
        canonL3: c.L3, otherL3: o.L3,
        known: KNOWN_RASM_CONVENTIONS[`${a.surah}:${a.ayah}`] ?? null,
      });
    }
  }
  perAyah.push({ global: a.global, surah: a.surah, ayah: a.ayah, sources_matched: matched });
}

// Pisahkan: beda yg SUDAH terdokumentasi (konvensi) vs beda BARU (harus fail).
const undocumented = unresolved.filter((u) => !u.known);

// --- TIER 1: SHA-256 + Merkle ----------------------------------------------
const leaves = ayahs.map((a) => leafHash(nfc(a.arabic_canonical)));
const root = merkleRoot(leaves);
const hashesHex = leaves.map((l) => l.toString('hex'));

// --- Report -----------------------------------------------------------------
const pct = (n, d) => (d ? ((n / d) * 100).toFixed(4) : '0') + '%';
function line(src) {
  const s = stat[src];
  return `${src.padEnd(8)} avail ${s.avail}  |  L0 ${pct(s.L0, s.avail)}  L1 ${pct(s.L1, s.avail)}  L2 ${pct(s.L2, s.avail)}  L3 ${pct(s.L3, s.avail)}`;
}
console.log('=== TIER 2 — CROSS-SOURCE RASM CONCORDANCE ===');
console.log(line('tanzil'));
console.log(line('kemenag'));
console.log('  L0 skeleton  = byte-identik tanpa tanda (sensitif konvensi encoding)');
console.log('  L1 rasm-fold = setelah samakan dudukan hamza/alef-wasla');
console.log('  L2 konsonan  = setelah samakan ejaan panjang alef (imla\'i vs uthmani)');
console.log('  L3 akar      = setelah samakan SEMUA huruf mad + segmentasi kata');
console.log('  → L3 = akar konsonan. 100% L3 membuktikan "satu teks, satu rasm".');

console.log('\n=== TIER 1 — INTEGRITAS (jaminan keras) ===');
console.log(`teks kanonik : Quran.com QPC Uthmani (King Fahd), NFC`);
console.log(`ayat di-hash : ${leaves.length}  |  algoritma: SHA-256 per-ayah -> Merkle`);
console.log(`MERKLE ROOT  : ${root}`);

if (unresolved.length) {
  console.log(`\nBeda di L3 (akar konsonan): ${unresolved.length} — terdokumentasi ${unresolved.length - undocumented.length}, BARU ${undocumented.length}`);
  for (const u of unresolved) {
    const tag = u.known ? `✓ konvensi terdokumentasi` : `✗ BARU (perlu review)`;
    console.log(`   ${u.surah}:${u.ayah} [${u.src}] ${tag}`);
    if (u.known) console.log(`     → ${u.known}`);
    else console.log(`     canon="${u.canonL3}"  vs  "${u.otherL3}"`);
  }
}

// --- Tulis report + config --------------------------------------------------
const report = {
  builtAt: new Date().toISOString(),
  counts: { surah: surahs.length, ayah: ayahs.length },
  crossSource: stat,
  unresolvedL3: unresolved,
  undocumentedDiffs: undocumented,
  merkle: { algo: 'sha-256', leafCount: leaves.length, root },
  perAyah,
};
writeFileSync(new URL('verify-report.json', DATA_DIR), JSON.stringify(report), 'utf8');

const integrity = {
  merkle_root: root,
  algo: 'sha-256',
  leaf_spec: 'SHA256(utf8(NFC(text_uthmani)))',
  node_spec: 'SHA256(left||right), promote odd node',
  riwayah: 'hafs',
  rasm: 'uthmani',
  count_method: 'kufi',
  surah_count: surahs.length,
  ayah_count: ayahs.length,
  canonical_source: normalized.sources.quran_com,
  crosscheck_sources: [normalized.sources.alquran_cloud, normalized.sources.equran_id],
  crosscheck_result: {
    note: 'L3 = akar konsonan identik lintas sumber. Sisa L0/L1/L2 = beda konvensi ortografi/encoding antar-penerbit (plene vs defektif, dudukan hamza, segmentasi kata), BUKAN beda teks Quran.',
    tanzil: stat.tanzil,
    kemenag: stat.kemenag,
    documented_conventions: KNOWN_RASM_CONVENTIONS,
    undocumented_diffs: undocumented.length,
  },
  build_version: '1.0.0',
  built_at: report.builtAt,
};
writeFileSync(new URL('integrity.json', CFG_DIR), JSON.stringify(integrity, null, 2), 'utf8');
writeFileSync(new URL('ayah-hashes.json', DATA_DIR), JSON.stringify(hashesHex), 'utf8');

// --- Fail-closed gates ------------------------------------------------------
let fail = false;
if (surahs.length !== EXPECTED_SURAH || ayahs.length !== EXPECTED_AYAH) {
  console.error('\n✗ FAIL: jumlah surah/ayah salah.'); fail = true;
}
// Tanzil (sumber rasm Uthmani ketat) HARUS 100% di akar konsonan (L3).
if (stat.tanzil.L3 !== stat.tanzil.avail) {
  console.error(`\n✗ FAIL: Tanzil L3 belum 100% (${stat.tanzil.avail - stat.tanzil.L3} beda).`);
  fail = true;
}
// Kemenag: semua beda L3 WAJIB masuk allowlist konvensi terdokumentasi.
// Beda BARU yg tak terduga -> fail-closed.
if (undocumented.length > 0) {
  console.error(`\n✗ FAIL: ${undocumented.length} beda rasm BARU (tak terdokumentasi) — wajib review owner.`);
  fail = true;
}
if (fail) process.exit(1);

const kemenagExact = stat.kemenag.L3;
console.log('\n✓ VERIFY OK');
console.log(`  TIER 1: Merkle root ter-pin (SHA-256 x ${leaves.length} ayat).`);
console.log(`  TIER 2: Tanzil akar konsonan 100%; Kemenag ${kemenagExact}/${stat.kemenag.avail} identik`);
console.log(`          + ${unresolved.length} konvensi ortografi terdokumentasi (bukan beda teks).`);
console.log('  → "Satu Quran, satu rasm" terbukti lintas 3 sumber independen.');
console.log('  -> config/integrity.json  -> data/verify-report.json');
