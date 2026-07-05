// pipeline/verify-words.mjs
// VALIDASI BERLAPIS (kata -> ayat). Buktikan bahwa gabungan kata-kata word-by-word
// merekonstruksi teks ayat kanonik (kerangka konsonan sama). Menangkap salah tokenisasi
// / kata hilang. Juga hitung hash tiap kata + Merkle-kata per ayat (lapisan bawah).

import { readFileSync, writeFileSync } from 'node:fs';
import { consonantRoot, nfc } from './lib/text.mjs';
import { leafHash, merkleRoot } from './lib/merkle.mjs';

const DATA = new URL('../data/', import.meta.url);
const words = JSON.parse(readFileSync(new URL('words.json', DATA), 'utf8'));
const normalized = JSON.parse(readFileSync(new URL('normalized.json', DATA), 'utf8'));

let checked = 0, match = 0, wordCount = 0;
const mismatches = [];
const wordMerkleByGlobal = {};

for (const a of normalized.ayahs) {
  const key = `${a.surah}:${a.ayah}`;
  const ws = words.byKey[key];
  if (!ws || ws.length === 0) { mismatches.push({ key, reason: 'kata kosong' }); continue; }
  checked++;
  wordCount += ws.length;

  // rekonstruksi: gabung kata -> bandingkan akar konsonan dgn teks kanonik
  const joined = ws.map((w) => w.ar).join(' ');
  if (consonantRoot(joined) === consonantRoot(a.arabic_canonical)) match++;
  else mismatches.push({ key, reason: 'rekonstruksi != kanonik', canon: consonantRoot(a.arabic_canonical), joined: consonantRoot(joined) });

  // hash tiap kata -> Merkle-kata per ayat (identitas lapisan kata)
  const leaves = ws.map((w) => leafHash(nfc(w.ar)));
  wordMerkleByGlobal[a.global] = merkleRoot(leaves);
}

const pct = ((match / checked) * 100).toFixed(4);
console.log('MUSHAF verify-words — VALIDASI BERLAPIS (kata -> ayat)\n');
console.log(`ayat dicek     : ${checked}/${normalized.ayahs.length}`);
console.log(`total kata     : ${wordCount} (harap ~77.430)`);
console.log(`rekonstruksi OK: ${match}/${checked} (${pct}%)`);

writeFileSync(new URL('word-merkle.json', DATA), JSON.stringify(wordMerkleByGlobal));

if (mismatches.length) {
  console.log(`\n⚠ ${mismatches.length} ayat perlu tinjau (kata != rekonstruksi kanonik):`);
  for (const m of mismatches.slice(0, 20)) console.log(`   ${m.key} — ${m.reason}`);
}

if (checked !== normalized.ayahs.length || match !== checked) {
  console.error(`\n✗ FAIL: validasi kata->ayat belum 100% (${mismatches.length} isu).`);
  process.exit(1);
}
console.log('\n✓ VERIFY-WORDS OK — tiap ayat tersusun benar dari kata-katanya (lapisan kata tervalidasi).');
