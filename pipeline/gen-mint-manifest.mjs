// pipeline/gen-mint-manifest.mjs
// IDENTITAS TIAP AYAT (siap di-mint). Untuk tiap ayat: hash konten + BUKTI INKLUSI
// Merkle (audit path leaf->root). Ini "paspor kriptografis" ayat:
//   tokenId  = hash ayat (SHA-256 dari NFC teks Uthmani)
//   proof    = daftar sibling hash + arah -> bisa dibuktikan bagian sah dari mushaf
//   root     = akar Merkle (jangkar identitas seluruh 6236 ayat)
// Chain-agnostic: bisa dipakai untuk mint di chain manapun, atau sekadar verifikasi.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { sha256, leafHash, merkleRoot } from './lib/merkle.mjs';

const DATA = new URL('../data/', import.meta.url);
const integrity = JSON.parse(readFileSync(new URL('../config/integrity.json', import.meta.url), 'utf8'));

const db = new DatabaseSync(fileURLToPath(new URL('mushaf-core.db', DATA)), { readOnly: true });
const rows = db.prepare('SELECT id AS global, surah_number AS surah, ayah_number AS ayah, text_uthmani FROM ayah ORDER BY id').all();
db.close();

const leaves = rows.map((r) => leafHash(r.text_uthmani));
const root = merkleRoot(leaves);

// Bangun semua level Merkle sekali (efisien untuk ekstrak proof).
const levels = [leaves];
while (levels[levels.length - 1].length > 1) {
  const cur = levels[levels.length - 1];
  const next = [];
  for (let i = 0; i < cur.length; i += 2) {
    const l = cur[i];
    const r = i + 1 < cur.length ? cur[i + 1] : cur[i]; // promosi node ganjil
    next.push(sha256(Buffer.concat([l, r])));
  }
  levels.push(next);
}

function proofFor(index) {
  let idx = index;
  const proof = [];
  for (let lvl = 0; lvl < levels.length - 1; lvl++) {
    const level = levels[lvl];
    const isRight = idx % 2 === 1;                 // node kita di kanan?
    const sibIdx = isRight ? idx - 1 : idx + 1;
    const sibling = sibIdx < level.length ? level[sibIdx] : level[idx]; // promosi diri
    proof.push({ h: sibling.toString('hex'), dir: isRight ? 'L' : 'R' }); // arah SIBLING
    idx = idx >> 1;
  }
  return proof;
}

// verifikator lokal untuk self-check
function verify(leafHex, proof, expectRoot) {
  let acc = Buffer.from(leafHex, 'hex');
  for (const step of proof) {
    const sib = Buffer.from(step.h, 'hex');
    acc = step.dir === 'L' ? sha256(Buffer.concat([sib, acc])) : sha256(Buffer.concat([acc, sib]));
  }
  return acc.toString('hex') === expectRoot;
}

const byGlobal = {};
let verified = 0;
for (let i = 0; i < rows.length; i++) {
  const r = rows[i];
  const hash = leaves[i].toString('hex');
  const proof = proofFor(i);
  if (verify(hash, proof, root)) verified++;
  byGlobal[r.global] = { key: `${r.surah}:${r.ayah}`, surah: r.surah, ayah: r.ayah, hash, proof };
}

const manifest = {
  scheme: 'mushaf-ayah-identity-v1',
  algo: 'sha-256',
  leaf_spec: integrity.leaf_spec,
  node_spec: integrity.node_spec,
  merkle_root: root,
  riwayah: integrity.riwayah,
  rasm: integrity.rasm,
  ayah_count: rows.length,
  built_at: integrity.built_at,
  byGlobal,
};
writeFileSync(new URL('proofs.json', DATA), JSON.stringify(manifest));

console.log('MUSHAF gen-mint-manifest — identitas & bukti inklusi per ayat\n');
console.log(`ayat            : ${rows.length}`);
console.log(`merkle root     : ${root}`);
console.log(`proof terverif. : ${verified}/${rows.length}`);
console.log(`kedalaman proof : ${levels.length - 1} hash/ayat`);

if (root !== integrity.merkle_root) { console.error('\n✗ FAIL: root != config.'); process.exit(1); }
if (verified !== rows.length) { console.error('\n✗ FAIL: ada proof yang tidak merekonstruksi root.'); process.exit(1); }
console.log('\n✓ MINT MANIFEST OK — tiap ayat punya identitas + bukti inklusi yang tervalidasi.');
console.log('  -> data/proofs.json');
