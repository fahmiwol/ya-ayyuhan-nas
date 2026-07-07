// pipeline/gen-search-index.mjs — index pencarian terjemahan (full-text ringan).
// Baca semua surah/*.json → search-index.json = daftar [surah, ayah, teks-id, teks-en].
// Dipakai API /api/v1/search/ayah (server-side; klien tak memuat file besar ini).
// Pakai: node pipeline/gen-search-index.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SURAH = new URL("../apps/web/public/data/surah/", import.meta.url);
const idx = JSON.parse(readFileSync(fileURLToPath(new URL("../apps/web/public/data/index.json", import.meta.url)), "utf8"));
const names = {};
for (const s of idx.surahs || idx.data?.surahs || []) names[s.number] = s.name_latin;

const rows = [];
for (let s = 1; s <= 114; s++) {
  const su = JSON.parse(readFileSync(fileURLToPath(new URL(`${s}.json`, SURAH)), "utf8"));
  if (!names[s]) names[s] = su.name_latin;
  for (const a of su.ayahs) {
    rows.push([s, a.ayah, a.tr?.id ?? "", a.tr?.en ?? ""]);
  }
}
const out = { v: 1, count: rows.length, names, rows };
writeFileSync(fileURLToPath(new URL("../apps/web/public/data/search-index.json", import.meta.url)), JSON.stringify(out));
console.log(`search-index: ${rows.length} ayat terindeks (id+en).`);
