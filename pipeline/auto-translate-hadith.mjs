// pipeline/auto-translate-hadith.mjs
// AUTO-TRANSLATE EN->ID utk hadits yang belum punya terjemahan Indonesia (Nawawi/Qudsi).
// Hasil disimpan di field TERPISAH `tr.id_auto` + flag → di UI ditandai "terjemahan mesin
// (belum ditinjau ahli)". Tidak menimpa terjemahan manusia (tr.id). Eval-gate: status MT = belum tervalidasi.
// Mesin: Google (gtx, gratis) → fallback MyMemory. Klasik/teks = domain publik.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getJSON } from './lib/sources.mjs';

const DIR = new URL('../apps/web/public/data/hadith/', import.meta.url);

async function translate(text) {
  const t = (text || '').trim();
  if (!t) return null;
  // Google unofficial (batas ~5000 char; hadits umumnya pendek)
  try {
    const j = await getJSON(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=id&dt=t&q=${encodeURIComponent(t.slice(0, 4500))}`, { tries: 2, timeoutMs: 20000 });
    const out = j[0].map((x) => x[0]).join('');
    if (out) return out;
  } catch { /* fallback */ }
  try {
    const email = process.env.MYMEMORY_EMAIL;
    const j = await getJSON(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(t.slice(0, 480))}&langpair=en|id${email ? `&de=${encodeURIComponent(email)}` : ''}`, { tries: 2, timeoutMs: 20000 });
    return j.responseData?.translatedText ?? null;
  } catch { return null; }
}

async function pool(items, worker, conc) {
  let i = 0; const out = [];
  await Promise.all(Array.from({ length: conc }, async () => { while (i < items.length) { const k = i++; out[k] = await worker(items[k]); } }));
  return out;
}

console.log('MUSHAF auto-translate-hadith — EN->ID (bertanda mesin)\n');
let totalMt = 0;

const files = readdirSync(fileURLToPath(DIR)).filter((f) => /^[a-z0-9]+\.json$/i.test(f) && f !== 'index.json' && f !== '_editions.json');
for (const f of files) {
  const fp = fileURLToPath(new URL(f, DIR));
  const data = JSON.parse(readFileSync(fp, 'utf8'));
  // hanya yang perlu: ada en, belum ada id (manusia) & belum ada id_auto
  const need = data.hadiths.filter((h) => h.tr?.en && !h.tr?.id && !h.tr?.id_auto);
  if (need.length === 0) continue;
  console.log(`  ${data.key}: menerjemah ${need.length} hadits…`);
  const results = await pool(need, async (h) => ({ n: h.number, id: await translate(h.tr.en) }), 5);
  const map = new Map(results.map((r) => [r.n, r.id]));
  let mt = 0;
  for (const h of data.hadiths) {
    const tid = map.get(h.number);
    if (tid) { h.tr.id_auto = tid; mt++; }
  }
  if (mt > 0) {
    if (!data.langs.includes('id-auto')) data.langs.push('id-auto');
    writeFileSync(fp, JSON.stringify(data));
    totalMt += mt;
    console.log(`  ✓ ${data.key}: ${mt} terjemahan mesin ditambahkan`);
  }
}

// tandai di index juga
const idxPath = fileURLToPath(new URL('index.json', DIR));
if (existsSync(idxPath)) {
  const idx = JSON.parse(readFileSync(idxPath, 'utf8'));
  for (const c of idx.collections) {
    const cf = fileURLToPath(new URL(`${c.key}.json`, DIR));
    if (existsSync(cf)) { const cd = JSON.parse(readFileSync(cf, 'utf8')); c.langs = cd.langs; }
  }
  writeFileSync(idxPath, JSON.stringify(idx, null, 2));
}

console.log(`\n✓ auto-translate selesai: ${totalMt} hadits dapat terjemahan mesin (id_auto).`);
