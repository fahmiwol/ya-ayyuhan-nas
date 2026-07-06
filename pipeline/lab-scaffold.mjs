// pipeline/lab-scaffold.mjs — buat KERANGKA kajian baru (utk sintesis massal).
// Menarik ayat + ringkas tafsir dari data kanonik → template JSON dgn lensa kosong,
// siap diisi (oleh AI/manusia), lalu WAJIB lolos lab-validate sebelum masuk index.
// Pakai: node pipeline/lab-scaffold.mjs <id> <surah> <from> <to> "<judul>"
// Contoh: node pipeline/lab-scaffold.mjs fatihah-1-1-7 1 1 7 "Al-Fatihah — protokol pembuka"

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const [id, surahArg, fromArg, toArg, title] = process.argv.slice(2);
const surah = Number(surahArg), from = Number(fromArg), to = Number(toArg);
if (!id || !/^[a-z0-9-]+$/.test(id) || !surah || !from || !to || !title) {
  console.error('Pakai: node pipeline/lab-scaffold.mjs <id> <surah> <from> <to> "<judul>"');
  process.exit(1);
}

const LAB = new URL('../apps/web/public/data/lab/', import.meta.url);
const outFp = fileURLToPath(new URL(`${id}.json`, LAB));
if (existsSync(outFp)) { console.error(`✗ ${id}.json sudah ada — utk re-tadabbur pakai lab-rev.mjs`); process.exit(1); }

// Verifikasi rujukan vs mushaf kanonik SEBELUM scaffold dibuat (fail-closed)
const su = JSON.parse(readFileSync(fileURLToPath(new URL(`../apps/web/public/data/surah/${surah}.json`, import.meta.url)), 'utf8'));
const ayat = su.ayahs.filter((a) => a.ayah >= from && a.ayah <= to);
if (ayat.length !== to - from + 1) { console.error(`✗ rujukan ${surah}:${from}-${to} tak valid di mushaf (${ayat.length} ayat)`); process.exit(1); }

// Ringkas tafsir Kemenag sbg konteks pengisi (sumber makna)
let tafsirHint = '';
try {
  const t = JSON.parse(readFileSync(fileURLToPath(new URL(`../apps/web/public/data/tafsir/${surah}.json`, import.meta.url)), 'utf8'));
  tafsirHint = (t.ayahs?.[String(from)]?.kemenag ?? '').slice(0, 300);
} catch { /* tafsir belum ada utk surah ini */ }

const taxonomy = JSON.parse(readFileSync(fileURLToPath(new URL('taxonomy.json', LAB)), 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const scaffold = {
  schema: 'lab-study-v2',
  id,
  version: 1,
  title,
  subtitle: 'TODO',
  ref: { surah, from, to },
  surah_name: su.name_latin,
  theme: 'TODO',
  sourced_meaning: {
    summary: `TODO — ringkas dari tafsir bersumber. Petikan Kemenag ${surah}:${from}: "${tafsirHint}…"`,
    sources: [`Tafsir Kemenag QS ${surah}:${from}-${to} (via panel Tafsir app ini)`, `Tafsir Jalalain QS ${surah}:${from}-${to}`],
  },
  qca: [{ layer: 'TODO', note: 'TODO' }],
  lenses: taxonomy.lenses.map((l) => ({ lens: l.key, reading: 'TODO', quranic_term: '', analogy: '' })),
  inference: 'TODO',
  authors: ['Draft AI (Claude) — interpretasi rekayasa, menunggu tinjauan'],
  status: 'draft',
  created: today,
  history: [{ version: 1, date: today, note: 'Tadabbur perdana (scaffold).', authors: ['Draft AI (Claude)'] }],
};

writeFileSync(outFp, JSON.stringify(scaffold, null, 2));
console.log(`✓ scaffold ${id}.json dibuat (${ayat.length} ayat, ${taxonomy.lenses.length} lensa TODO).`);
console.log(`  Ayat: ${ayat.map((a) => `${surah}:${a.ayah}`).join(', ')}`);
console.log('  Isi lensa → set status "published" → tambah entri index.json → node pipeline/lab-validate.mjs ' + id);
