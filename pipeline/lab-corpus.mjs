// pipeline/lab-corpus.mjs — EKSPOR KORPUS siap-ML dari Lab Tadabbur.
// Setiap "chunk" = unit bermakna (lensa / inferensi / makna-bersumber) + metadata kaya
// (ref ayat, cluster, prinsip, istilah, analogi) → siap di-embed / index vektor / fine-tune / RAG.
// Output: lab-corpus.jsonl (satu objek JSON per baris). Pakai: node pipeline/lab-corpus.mjs
//
// CATATAN: chunk = interpretasi rekayasa (tier "interpretation" — BUKAN tafsir/dalil).
// Teks AYAT tidak disertakan (immutable, ambil dari mushaf via ref). Provenance disertakan.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const LAB = new URL("../apps/web/public/data/lab/", import.meta.url);
const rd = (f) => JSON.parse(readFileSync(fileURLToPath(new URL(f, LAB)), "utf8"));
const SKIP = new Set(["index.json", "taxonomy.json", "synthesis.json", "coverage.json", "lab-graph.json"]);

const syn = rd("synthesis.json");
// peta kajian→prinsip
const studyPrinciples = {};
for (const p of syn.principles || []) for (const e of p.evidence || []) (studyPrinciples[e.id] ??= []).push(p.id);

const studies = readdirSync(fileURLToPath(LAB)).filter((f) => f.endsWith(".json") && !SKIP.has(f));
const lines = [];
let n = 0;
const push = (o) => { lines.push(JSON.stringify({ ...o, tier: "interpretation", disclaimer: "Interpretasi rekayasa Lab Tadabbur — BUKAN tafsir/dalil." })); n++; };

for (const f of studies) {
  const s = rd(f);
  const ref = `${s.ref.surah}:${s.ref.from}${s.ref.to !== s.ref.from ? "-" + s.ref.to : ""}`;
  const base = { study: s.id, ref, surah: s.ref.surah, ayah_from: s.ref.from, ayah_to: s.ref.to, theme: s.theme, principles: studyPrinciples[s.id] || [], sources: s.sourced_meaning?.sources || [] };
  // chunk makna bersumber (untuk grounding)
  if (s.sourced_meaning?.summary) push({ id: `${s.id}#meaning`, kind: "sourced_meaning", text: s.sourced_meaning.summary, ...base });
  // chunk per lensa (unit reasoning terkecil)
  for (const l of s.lenses || []) push({ id: `${s.id}#${l.lens}`, kind: "lens", lens: l.lens, analogy: l.analogy || null, quranic_term: l.quranic_term || null, text: l.reading, ...base });
  // chunk inferensi (temuan utama)
  if (s.inference) push({ id: `${s.id}#inference`, kind: "inference", text: s.inference, ...base });
}
// chunk prinsip (pola lintas-ayat)
for (const p of syn.principles || []) push({ id: `principle:${p.id}`, kind: "principle", cluster: p.cluster, text: `${p.title}. ${p.statement} Implikasi: ${p.implication}`, evidence: (p.evidence || []).map((e) => e.ref) });
// chunk kerangka
for (const fr of syn.frameworks || []) push({ id: `framework:${fr.id}`, kind: "framework", text: `${fr.title}. ${fr.reading}`, basis: fr.basis, refs: (fr.refs || []).map((e) => e.ref) });

writeFileSync(fileURLToPath(new URL("lab-corpus.jsonl", LAB)), lines.join("\n") + "\n");
console.log(`lab-corpus: ${n} chunk → lab-corpus.jsonl (siap embed/RAG/fine-tune).`);
