// pipeline/lab-rev.mjs — RE-TADABBUR sebuah kajian: rekam versi lama, buka versi baru.
// Setiap interpretasi DIREKAM: versi saat ini diarsip ke archive/<id>.v<N>.json
// (tetap bisa dibaca di app via ?v=N), lalu version di-bump + entri history baru.
// Pakai: node pipeline/lab-rev.mjs <id> "<catatan revisi>"

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const [id, note] = process.argv.slice(2);
if (!id || !/^[a-z0-9-]+$/.test(id) || !note) {
  console.error('Pakai: node pipeline/lab-rev.mjs <id> "<catatan revisi>"');
  process.exit(1);
}

const LAB = new URL('../apps/web/public/data/lab/', import.meta.url);
const fp = fileURLToPath(new URL(`${id}.json`, LAB));
if (!existsSync(fp)) { console.error(`✗ kajian ${id} tidak ada`); process.exit(1); }
const s = JSON.parse(readFileSync(fp, 'utf8'));

// 1. REKAM versi berjalan ke arsip (immutable record — jangan pernah ditimpa)
const arcDir = fileURLToPath(new URL('archive/', LAB));
mkdirSync(arcDir, { recursive: true });
const arcFp = fileURLToPath(new URL(`archive/${id}.v${s.version}.json`, LAB));
if (existsSync(arcFp)) { console.error(`✗ arsip v${s.version} sudah ada — jangan menimpa rekaman`); process.exit(1); }
writeFileSync(arcFp, JSON.stringify(s, null, 2));

// 2. Bump versi + entri riwayat; penulis mengedit isi SETELAH ini, lalu lab-validate.
const today = new Date().toISOString().slice(0, 10);
s.version += 1;
s.schema = 'lab-study-v2';
s.history = [...(s.history ?? []), { version: s.version, date: today, note, authors: s.authors }];
writeFileSync(fp, JSON.stringify(s, null, 2));

console.log(`✓ re-tadabbur ${id}: v${s.version - 1} DIREKAM ke archive/, sekarang mengedit v${s.version}.`);
console.log('  Edit isi kajian → node pipeline/lab-validate.mjs ' + id + ' → commit.');
