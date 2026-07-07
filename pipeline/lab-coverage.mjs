// pipeline/lab-coverage.mjs — hitung CAKUPAN Lab secara jujur → coverage.json.
// Dipakai halaman /lab untuk menampilkan progres (bukan menyembunyikan bahwa masih sedikit).
// Denominator jujur: total 6236 + kandidat backlog (ayat bertema, dari sweep) + tema.
// Pakai: node pipeline/lab-coverage.mjs  (jalankan tiap kali kajian bertambah)

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ROOT = new URL("../", import.meta.url);
const LAB = new URL("apps/web/public/data/lab/", ROOT);
const rd = (u) => readFileSync(fileURLToPath(u), "utf8");
const SKIP = new Set(["index.json", "taxonomy.json", "synthesis.json", "coverage.json"]);

const expand = (r, set) => { const m = String(r).match(/(\d+):(\d+)(?:-(\d+))?/); if (!m) return; const s = +m[1], f = +m[2], t = m[3] ? +m[3] : f; for (let a = f; a <= t; a++) set.add(s + ":" + a); };

// 1. ayat studi langsung
const direct = new Set();
const files = readdirSync(fileURLToPath(LAB)).filter((f) => f.endsWith(".json") && !SKIP.has(f));
for (const f of files) { const s = JSON.parse(rd(new URL(f, LAB))); if (s.ref) expand(`${s.ref.surah}:${s.ref.from}-${s.ref.to}`, direct); }

// 2. ayat dikutip sbg bukti (prinsip + kerangka)
const syn = JSON.parse(rd(new URL("synthesis.json", LAB)));
const cited = new Set();
for (const p of syn.principles || []) for (const e of p.evidence || []) expand(e.ref, cited);
for (const fr of syn.frameworks || []) for (const e of fr.refs || []) expand(e.ref, cited);

// 3. union tersentuh (langsung + dikutip)
const touched = new Set([...direct, ...cited]);

// 4. per-tema dari backlog md (kandidat total + selesai)
let byTheme = [];
let candTotal = 0, candDone = 0;
try {
  const md = rd(new URL("15_TADABBUR_BACKLOG.md", ROOT));
  const blocks = md.split(/^## /m).slice(1);
  for (const b of blocks) {
    const title = b.split("\n")[0].replace(/\s*\(\d+ ayat\)/, "").trim();
    const total = (b.match(/^- \[[ x]\]/gm) || []).length;
    const done = (b.match(/^- \[x\]/gm) || []).length;
    if (total) { byTheme.push({ theme: title, total, done }); candTotal += total; candDone += done; }
  }
} catch { /* backlog belum ada */ }

const coverage = {
  updated: process.env.COVERAGE_DATE || "2026-07-07",
  total_ayat: 6236,
  studies: files.length,
  principles: (syn.principles || []).length,
  frameworks: (syn.frameworks || []).length,
  direct_ayat: direct.size,
  cited_ayat: cited.size,
  touched_ayat: touched.size,
  candidates_total: candTotal,
  candidates_done: candDone,
  pct_of_total: +(100 * touched.size / 6236).toFixed(2),
  pct_of_candidates: candTotal ? +(100 * candDone / candTotal).toFixed(1) : 0,
  by_theme: byTheme.sort((a, b) => b.total - a.total),
};
writeFileSync(fileURLToPath(new URL("coverage.json", LAB)), JSON.stringify(coverage, null, 2));
console.log(`coverage: ${coverage.studies} kajian · ${direct.size} ayat langsung · ${touched.size} tersentuh (${coverage.pct_of_total}% total, ${coverage.pct_of_candidates}% kandidat)`);
