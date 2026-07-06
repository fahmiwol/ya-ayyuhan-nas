// pipeline/seed-tafsir-jalalain.mjs
// Tambah edisi tafsir JALALAIN (ringkas, klasik) dari spa5k/tafsir_api (per-ayat).
// MERGE ke apps/web/public/data/tafsir/{n}.json (tambah key 'jalalain' + ke daftar editions).
// Klasik = domain publik; provenance dicatat. Resilient + concurrency.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getJSON } from './lib/sources.mjs';

const DIR = new URL('../apps/web/public/data/tafsir/', import.meta.url);
const EDITION = { key: 'jalalain', name: 'Tafsir Jalalain', lang: 'ar', source: 'Jalaluddin al-Mahalli & as-Suyuti (via spa5k/tafsir_api)', license: 'Klasik — domain publik (audit)' };
const CDN = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/ar-tafsir-al-jalalayn';
const CONC = 14;

async function pool(items, worker, conc) {
  let i = 0; const results = [];
  const runners = Array.from({ length: conc }, async () => {
    while (i < items.length) { const idx = i++; results[idx] = await worker(items[idx], idx); }
  });
  await Promise.all(runners);
  return results;
}

console.log('MUSHAF seed-tafsir-jalalain — merge edisi Jalalain\n');
let totalOk = 0, totalMiss = 0;

for (let n = 1; n <= 114; n++) {
  const fp = fileURLToPath(new URL(`${n}.json`, DIR));
  if (!existsSync(fp)) continue;
  const data = JSON.parse(readFileSync(fp, 'utf8'));
  const ayahNums = Object.keys(data.ayahs).map(Number).sort((a, b) => a - b);

  const texts = await pool(ayahNums, async (a) => {
    try { const j = await getJSON(`${CDN}/${n}/${a}.json`, { tries: 2, timeoutMs: 20000 }); return (j.text || '').trim(); }
    catch { return null; }
  }, CONC);

  ayahNums.forEach((a, k) => {
    const t = texts[k];
    if (t) { data.ayahs[a].jalalain = t; totalOk++; } else { totalMiss++; }
  });
  if (!data.editions.some((e) => e.key === 'jalalain')) data.editions.push(EDITION);
  writeFileSync(fp, JSON.stringify(data));
  if (n % 20 === 0) console.log(`  ...surah ${n}/114 (ok ${totalOk}, miss ${totalMiss})`);
}

console.log(`\n✓ jalalain merge selesai: ${totalOk} ayat (miss ${totalMiss}) -> tafsir/{n}.json`);
if (totalOk === 0) { console.error('✗ tak ada jalalain terkumpul.'); process.exit(1); }
