// pipeline/lab-next.mjs — pick the next ayah for the daily kajian (EPIC-002 S1).
// Deterministic and model-free: the daily "ask first" check runs this, so it costs no LLM tokens.
//
// Order:
//   1. a principle in synthesis.json with only one piece of evidence (note_single) → needs a 2nd kajian
//   2. otherwise the backlog theme (15_TADABBUR_BACKLOG.md) with the lowest done/total ratio
//      (ties: larger theme first, then file order)
//   3. inside that theme: the first "- [ ]" ayah not already covered by an existing kajian
//
// Usage: node pipeline/lab-next.mjs          → one human line + JSON
//        node pipeline/lab-next.mjs --json   → JSON only
// Output is a CANDIDATE (signal), not a decision; the writer may reject it with a written reason.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p) => readFileSync(root(p), "utf8");

// --- covered ayahs from existing kajian refs ("QS 80:18-22", "QS 2:30, 2:31") ---
const index = JSON.parse(read("apps/web/public/data/lab/index.json"));
const covered = new Set();
for (const s of index.studies) {
  for (const m of String(s.ref || "").matchAll(/(\d+):(\d+)(?:-(\d+))?/g)) {
    const surah = +m[1], from = +m[2], to = m[3] ? +m[3] : from;
    for (let a = from; a <= to; a++) covered.add(`${surah}:${a}`);
  }
}

// --- 1. single-evidence principles ---
const syn = JSON.parse(read("apps/web/public/data/lab/synthesis.json"));
const single = (syn.principles || []).filter((p) => p.note_single);

// --- 2./3. backlog themes ---
const themes = [];
let cur = null;
for (const line of read("15_TADABBUR_BACKLOG.md").split(/\r?\n/)) {
  const h = line.match(/^## (.+?)\s*\((\d+)\)\s*$/);
  if (h) { cur = { theme: h[1], items: [] }; themes.push(cur); continue; }
  const it = line.match(/^\s*- \[( |x)\] (\d+):(\d+)/);
  if (it && cur) cur.items.push({ done: it[1] === "x", ref: `${it[2]}:${it[3]}` });
}
const ranked = themes
  .map((t, order) => {
    const done = t.items.filter((i) => i.done).length;
    const open = t.items.filter((i) => !i.done && !covered.has(i.ref));
    return { ...t, order, done, total: t.items.length, open };
  })
  .filter((t) => t.open.length)
  .sort((a, b) => a.done / a.total - b.done / b.total || b.total - a.total || a.order - b.order);

let pick;
if (single.length) {
  const p = single[0];
  pick = { reason: "prinsip baru punya 1 bukti", principle: p.id || p.title, candidates: p.candidates || p.note_single };
} else if (ranked.length) {
  const t = ranked[0];
  const [surah, ayah] = t.open[0].ref.split(":").map(Number);
  pick = {
    reason: "tema backlog dengan persentase selesai terendah",
    theme: t.theme, theme_done: t.done, theme_total: t.total,
    surah, ayah, ref: `QS ${surah}:${ayah}`,
    alternatives: t.open.slice(1, 4).map((i) => `QS ${i.ref}`),
    ground: { surah: `apps/web/public/data/surah/${surah}.json`, tafsir: `apps/web/public/data/tafsir/${surah}.json` },
  };
} else {
  pick = { reason: "backlog habis", note: "jalankan ulang sweep backlog (07_EPISODIC F1.33)" };
}

const out = { generated: new Date().toISOString(), studies: index.studies.length, covered_ayahs: covered.size, pick };
if (!process.argv.includes("--json")) {
  const p = pick.ref ? `${pick.ref} · tema "${pick.theme}" (${pick.theme_done}/${pick.theme_total}) · cadangan: ${pick.alternatives.join(", ")}` : pick.reason;
  console.log(`Kandidat kajian berikutnya: ${p}`);
}
console.log(JSON.stringify(out, null, 2));
