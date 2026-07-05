// pipeline/lib/merkle.mjs
// SHA-256 per-ayah + Merkle tree -> root hash.
// Spesifikasi (dibekukan agar reproducible & bisa diaudit siapa pun):
//   leaf_i = SHA256( utf8( NFC(text_uthmani_i) ) )          // 6236 leaf, urut global 1..6236
//   node   = SHA256( leftDigest || rightDigest )            // konkat 32-byte digest
//   odd    = node ganjil terakhir dipromosikan (dihash dgn dirinya sendiri)
//   root   = hex(lower) dari digest paling atas
// Perubahan 1 huruf pun -> leaf berubah -> root berubah (fail-closed di boot).

import { createHash } from 'node:crypto';

/** SHA-256 -> Buffer (32 byte). */
export function sha256(buf) {
  return createHash('sha256').update(buf).digest();
}

/** leaf hash dari teks ayah (sudah/otomatis di-NFC-kan sebelum hash). */
export function leafHash(nfcText) {
  return sha256(Buffer.from(nfcText, 'utf8'));
}

/**
 * Bangun Merkle root dari daftar leaf digest (Buffer[]), urut sesuai global_number.
 * @returns {string} root hex (64 char)
 */
export function merkleRoot(leaves) {
  if (leaves.length === 0) throw new Error('merkleRoot: tidak ada leaf');
  let level = leaves;
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = i + 1 < level.length ? level[i + 1] : level[i]; // promosikan node ganjil
      next.push(sha256(Buffer.concat([left, right])));
    }
    level = next;
  }
  return level[0].toString('hex');
}
