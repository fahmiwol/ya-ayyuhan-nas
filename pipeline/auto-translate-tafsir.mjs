// pipeline/auto-translate-tafsir.mjs
// AUTO-TRANSLATE AR->ID utk tafsir berbahasa Arab (Jalalain, al-Muyassar) yang belum
// punya terjemahan Indonesia. Hasil disimpan di key TERPISAH `${edisi}_id` di tiap ayat →
// di UI ditandai "terjemahan mesin (belum ditinjau ahli)". Tidak menyentuh teks Arab asli.
// Resumable: melewati yang sudah ada. Per-surah write-back (progres aman walau dihentikan).
// Eval-gate: status MT = BELUM tervalidasi ahli; transliterasi/arti = bantuan baca, bukan baku.
// Mesin: Google (gtx, gratis) → fallback MyMemory.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getJSON } from './lib/sources.mjs';

const DIR = new URL('../apps/web/public/data/tafsir/', import.meta.url);

async function translate(text) {
  const t = (text || '').trim();
  if (!t) return null;
  try {
    const j = await getJSON(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=id&dt=t&q=${encodeURIComponent(t.slice(0, 4500))}`, { tries: 2, timeoutMs: 25000 });
    const out = j[0].map((x) => x[0]).join('');
    if (out) return out;
  } catch { /* fallback */ }
  try {
    const email = process.env.MYMEMORY_EMAIL;
    const j = await getJSON(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(t.slice(0, 480))}&langpair=ar|id${email ? `&de=${encodeURIComponent(email)}` : ''}`, { tries: 2, timeoutMs: 25000 });
    return j.responseData?.translatedText ?? null;
  } catch { return null; }
}

async function pool(items, worker, conc) {
  let i = 0; const out = [];
  await Promise.all(Array.from({ length: conc }, async () => { while (i < items.length) { const k = i++; out[k] = await worker(items[k]); } }));
  return out;
}

const onlySurah = process.argv[2] ? Number(process.argv[2]) : null; // opsional: 1 surah utk uji
console.log(`MUSHAF auto-translate-tafsir — AR->ID (bertanda mesin)${onlySurah ? ` [surah ${onlySurah} saja]` : ''}\n`);
let grandTotal = 0;

for (let s = onlySurah ?? 1; s <= (onlySurah ?? 114); s++) {
  const fp = fileURLToPath(new URL(`${s}.json`, DIR));
  if (!existsSync(fp)) continue;
  const data = JSON.parse(readFileSync(fp, 'utf8'));
  const arKeys = (data.editions ?? []).filter((e) => e.lang === 'ar').map((e) => e.key);
  if (arKeys.length === 0) continue;

  // kumpulkan tugas: (ayah, edisiKey) yang punya teks Arab tapi belum punya `${key}_id`
  const tasks = [];
  for (const [ayah, obj] of Object.entries(data.ayahs)) {
    for (const k of arKeys) {
      if (obj[k] && !obj[`${k}_id`]) tasks.push({ ayah, k, text: obj[k] });
    }
  }
  if (tasks.length === 0) continue;
  process.stdout.write(`  surah ${s}: ${tasks.length} entri… `);
  const results = await pool(tasks, async (t) => ({ ...t, id: await translate(t.text) }), 4);
  let mt = 0;
  for (const r of results) if (r.id) { data.ayahs[r.ayah][`${r.k}_id`] = r.id; mt++; }
  if (mt > 0) { writeFileSync(fp, JSON.stringify(data)); grandTotal += mt; }
  console.log(`✓ ${mt} terjemahan mesin`);
  if (onlySurah) break;
}

console.log(`\n✓ selesai: ${grandTotal} entri tafsir Arab dapat terjemahan mesin (${'{edisi}'}_id).`);
