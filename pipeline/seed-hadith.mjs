// pipeline/seed-hadith.mjs
// Kumpulkan hadits dari sumber TERBUKA (fawazahmed0/hadith-api, LISENSI: public domain/Unlicense).
// "Built own": tarik build-time -> simpan sendiri di app. Tiap hadits bawa GRADE + provenance.
// Increment awal: koleksi kecil & lengkap (Arba'in Nawawi, 40 Hadith Qudsi) — fondasi belajar.
// Skala berikutnya: Kutub as-Sittah (bukhari/muslim/dst) tinggal tambah ke COLLECTIONS.
//
// ⚠️ Teks terjemahan turunan sebaiknya diaudit sumber aslinya; dataset ini dirilis public domain.

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getJSON } from './lib/sources.mjs';

const OUT = new URL('../apps/web/public/data/hadith/', import.meta.url);
mkdirSync(fileURLToPath(OUT), { recursive: true });

const CDN = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';
const PROVENANCE = {
  name: 'fawazahmed0/hadith-api',
  license: 'Public Domain (Unlicense)',
  url: 'https://github.com/fawazahmed0/hadith-api',
  note: 'Dataset public domain; audit ulang sumber asli tiap terjemahan bila perlu.',
};

// koleksi awal. Lengkap (fondasi) + 1 contoh ber-grade. Scale: tambah key + limit:null.
// Kutub as-Sittah penuh (bukhari/muslim/tirmidhi/nasai/ibnmajah + malik) = sprint skala berikut.
const COLLECTIONS = [
  { key: 'nawawi', label_id: 'Arba\'in Nawawi (42 Hadits)', limit: null },
  { key: 'qudsi', label_id: '40 Hadits Qudsi', limit: null },
  { key: 'bukhari', label_id: 'Sahih Bukhari (contoh, Indonesia)', limit: 100 },
  { key: 'muslim', label_id: 'Sahih Muslim (contoh, Indonesia)', limit: 100 },
  { key: 'abudawud', label_id: 'Sunan Abu Dawud (contoh ber-grade)', limit: 80 },
];
const LANGS = ['ara', 'eng', 'ind']; // arab wajib; en/id opsional

async function fetchEdition(lang, key) {
  try {
    return await getJSON(`${CDN}/${lang}-${key}.json`, { timeoutMs: 45000 });
  } catch {
    return null; // edisi bahasa tak tersedia -> skip
  }
}

function pickGrades(h) {
  // grades: [{name, grade}] -> normalisasi
  if (!Array.isArray(h.grades)) return [];
  return h.grades.filter((g) => g && g.grade).map((g) => ({ by: g.name ?? null, grade: g.grade }));
}

console.log('MUSHAF seed-hadith — kumpulkan hadits ber-grade + sumber\n');

const index = { builtAt: new Date().toISOString(), provenance: PROVENANCE, collections: [] };

for (const col of COLLECTIONS) {
  const ara = await fetchEdition('ara', col.key);
  if (!ara) { console.warn(`  ! ${col.key}: edisi Arab tak ada, skip`); continue; }
  const eng = await fetchEdition('eng', col.key);
  const ind = await fetchEdition('ind', col.key);

  const trEn = new Map((eng?.hadiths ?? []).map((h) => [h.hadithnumber, h.text]));
  const trId = new Map((ind?.hadiths ?? []).map((h) => [h.hadithnumber, h.text]));

  const total = ara.hadiths.length;
  const slice = col.limit ? ara.hadiths.slice(0, col.limit) : ara.hadiths;
  const partial = !!col.limit && total > col.limit;
  const hadiths = slice.map((h) => ({
    number: h.hadithnumber,
    arabicNumber: h.arabicnumber ?? h.hadithnumber,
    arabic: (h.text || '').trim(),
    tr: { en: trEn.get(h.hadithnumber) ?? null, id: trId.get(h.hadithnumber) ?? null },
    grades: pickGrades(h),
  }));

  // sections (opsional)
  const sections = ara.metadata?.sections ?? {};

  const out = {
    key: col.key,
    name: ara.metadata?.name ?? col.key,
    name_id: col.label_id,
    count: hadiths.length,
    total,
    partial,
    langs: ['ar', eng ? 'en' : null, ind ? 'id' : null].filter(Boolean),
    provenance: PROVENANCE,
    sections,
    hadiths,
  };
  writeFileSync(fileURLToPath(new URL(`${col.key}.json`, OUT)), JSON.stringify(out));

  const graded = hadiths.filter((h) => h.grades.length).length;
  index.collections.push({ key: col.key, name: out.name, name_id: col.label_id, count: hadiths.length, total, partial, langs: out.langs, graded });
  console.log(`  ✓ ${col.key}: ${hadiths.length}${partial ? '/' + total : ''} hadits (grade: ${graded}, en:${!!eng}, id:${!!ind})`);
}

writeFileSync(fileURLToPath(new URL('index.json', OUT)), JSON.stringify(index, null, 2));

if (index.collections.length === 0) { console.error('\n✗ FAIL: tak ada koleksi terkumpul.'); process.exit(1); }
const total = index.collections.reduce((n, c) => n + c.count, 0);
console.log(`\n✓ seed-hadith OK — ${index.collections.length} koleksi, ${total} hadits -> apps/web/public/data/hadith/`);
