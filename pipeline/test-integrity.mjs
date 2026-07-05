// pipeline/test-integrity.mjs
// Bukti (bukan klaim) bahwa jaminan immutability & fail-closed benar-benar bekerja.
// Test di atas SALINAN DB (data/_test-copy.db) — DB kanonik tidak disentuh.

import { copyFileSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { leafHash, merkleRoot } from './lib/merkle.mjs';

const src = fileURLToPath(new URL('../data/mushaf-core.db', import.meta.url));
const copy = fileURLToPath(new URL('../data/_test-copy.db', import.meta.url));

let passed = 0, failed = 0;
const ok = (name) => { console.log(`  ✓ ${name}`); passed++; };
const no = (name, detail) => { console.log(`  ✗ ${name} — ${detail}`); failed++; };

function freshCopy() {
  if (existsSync(copy)) rmSync(copy);
  copyFileSync(src, copy);
  return new DatabaseSync(copy);
}

console.log('TEST integritas & immutability\n');

// 1) Trigger menolak UPDATE teks kanonik
{
  const db = freshCopy();
  try {
    db.prepare("UPDATE ayah SET text_uthmani = 'x' WHERE id = 1").run();
    no('UPDATE ayah ditolak trigger', 'mutasi malah lolos');
  } catch (e) {
    if (/immutable/i.test(e.message)) ok('UPDATE ayah ditolak trigger'); else no('UPDATE ayah', e.message);
  }
  db.close();
}

// 2) Trigger menolak DELETE ayat
{
  const db = freshCopy();
  try {
    db.prepare('DELETE FROM ayah WHERE id = 1').run();
    no('DELETE ayah ditolak trigger', 'delete malah lolos');
  } catch (e) {
    if (/immutable/i.test(e.message)) ok('DELETE ayah ditolak trigger'); else no('DELETE ayah', e.message);
  }
  db.close();
}

// 3) Buka read-only -> tulis harus gagal
{
  copyFileSync(src, copy);
  const db = new DatabaseSync(copy, { readOnly: true });
  try {
    db.prepare("INSERT INTO ayah (id,surah_number,ayah_number,text_uthmani,text_skeleton) VALUES (99999,1,1,'x','x')").run();
    no('read-only menolak tulis', 'insert malah lolos');
  } catch (e) {
    ok('read-only menolak tulis');
  }
  db.close();
}

// 4) Tamper 1 huruf -> Merkle root berubah (deteksi lewat recompute)
{
  const db = freshCopy();
  const before = merkleRoot(db.prepare('SELECT text_uthmani FROM ayah ORDER BY id').all().map((r) => leafHash(r.text_uthmani)));
  db.exec('DROP TRIGGER ayah_no_update;'); // simulasikan penyerang yg buang proteksi
  const row = db.prepare('SELECT text_uthmani FROM ayah WHERE id = 1').get();
  const tampered = row.text_uthmani + 'ـ'; // sisipkan 1 karakter (tatweel)
  db.prepare('UPDATE ayah SET text_uthmani = ? WHERE id = 1').run(tampered);
  const after = merkleRoot(db.prepare('SELECT text_uthmani FROM ayah ORDER BY id').all().map((r) => leafHash(r.text_uthmani)));
  if (before !== after) ok('tamper 1 huruf -> root berubah (terdeteksi)');
  else no('tamper 1 huruf terdeteksi', 'root tidak berubah');
  db.close();
}

// 5) Jumlah & urutan kanonik benar
{
  const db = new DatabaseSync(src, { readOnly: true });
  const nS = db.prepare('SELECT COUNT(*) n FROM surah').get().n;
  const nA = db.prepare('SELECT COUNT(*) n FROM ayah').get().n;
  const contiguous = db.prepare('SELECT COUNT(*) n FROM ayah WHERE id BETWEEN 1 AND 6236').get().n;
  const sumAyah = db.prepare('SELECT SUM(ayah_count) s FROM surah').get().s;
  if (nS === 114) ok('114 surah'); else no('114 surah', nS);
  if (nA === 6236) ok('6236 ayat'); else no('6236 ayat', nA);
  if (contiguous === 6236) ok('urutan global 1..6236 kontigu'); else no('kontigu', contiguous);
  if (sumAyah === 6236) ok('Σ ayah_count surah == 6236'); else no('Σ ayah_count', sumAyah);
  db.close();
}

if (existsSync(copy)) rmSync(copy);
console.log(`\n${failed === 0 ? '✓ SEMUA LULUS' : '✗ ADA GAGAL'} — ${passed} lulus, ${failed} gagal`);
process.exit(failed === 0 ? 0 : 1);
