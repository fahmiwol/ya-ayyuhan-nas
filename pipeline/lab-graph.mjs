// pipeline/lab-graph.mjs — PETA PENGETAHUAN Lab (second-brain / Obsidian-style).
// Bangun graf: node = kajian, prinsip, kerangka; edge = keanggotaan-bukti + tautan
// asosiatif (istilah Qur'ani & lensa bersama). Juga hitung "related" (backlink) per kajian.
// Output: lab-graph.json. Pakai: node pipeline/lab-graph.mjs

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const LAB = new URL("../apps/web/public/data/lab/", import.meta.url);
const rd = (f) => JSON.parse(readFileSync(fileURLToPath(new URL(f, LAB)), "utf8"));
const SKIP = new Set(["index.json", "taxonomy.json", "synthesis.json", "coverage.json", "lab-graph.json"]);

const studies = readdirSync(fileURLToPath(LAB))
  .filter((f) => f.endsWith(".json") && !SKIP.has(f))
  .map((f) => rd(f));
const syn = rd("synthesis.json");

const norm = (t) => t.toLowerCase().replace(/[()]/g, "").split(/[/·]/)[0].trim();

// index istilah & lensa per kajian
const termsOf = {}, lensOf = {};
for (const s of studies) {
  termsOf[s.id] = new Set((s.lenses || []).map((l) => l.quranic_term).filter(Boolean).map(norm).filter((x) => x.length > 2));
  lensOf[s.id] = new Set((s.lenses || []).map((l) => l.lens));
}

const nodes = [];
const edges = [];
const clusterOf = {}; // studyId → cluster (dari prinsip yang paling banyak menautkannya)
const clusterVote = {};

// node prinsip + edge kajian→prinsip
for (const p of syn.principles || []) {
  nodes.push({ id: "p:" + p.id, type: "principle", label: p.title, cluster: p.cluster });
  for (const e of p.evidence || []) {
    edges.push({ s: e.id, t: "p:" + p.id, rel: "evidence", w: 3 });
    (clusterVote[e.id] ??= {})[p.cluster] = (clusterVote[e.id]?.[p.cluster] || 0) + 1;
  }
}
// node kerangka + edge kajian→kerangka
for (const f of syn.frameworks || []) {
  nodes.push({ id: "f:" + f.id, type: "framework", label: f.title, cluster: "framework" });
  for (const e of f.refs || []) edges.push({ s: e.id, t: "f:" + f.id, rel: "framework", w: 2 });
}
// node kajian
for (const s of studies) {
  const votes = clusterVote[s.id] || {};
  const cluster = Object.entries(votes).sort((a, b) => b[1] - a[1])[0]?.[0] || "misc";
  clusterOf[s.id] = cluster;
  nodes.push({ id: s.id, type: "study", label: s.title, ref: `${s.ref.surah}:${s.ref.from}${s.ref.to !== s.ref.from ? "-" + s.ref.to : ""}`, cluster });
}

// edge asosiatif kajian↔kajian via istilah Qur'ani bersama (tautan "wikilink")
const related = {};
for (let i = 0; i < studies.length; i++) {
  for (let j = i + 1; j < studies.length; j++) {
    const a = studies[i].id, b = studies[j].id;
    const shared = [...termsOf[a]].filter((x) => termsOf[b].has(x));
    const sharedLens = [...lensOf[a]].filter((x) => lensOf[b].has(x)).length;
    if (shared.length >= 1) {
      edges.push({ s: a, t: b, rel: "term", w: 1, via: shared.slice(0, 3).join(", ") });
      (related[a] ??= []).push({ id: b, title: studies[j].title, via: shared.join(", ") });
      (related[b] ??= []).push({ id: a, title: studies[i].title, via: shared.join(", ") });
    }
    void sharedLens;
  }
}
// related juga via prinsip bersama
const prinStudies = {};
for (const p of syn.principles || []) for (const e of p.evidence || []) (prinStudies[p.id] ??= []).push(e.id);
for (const p of syn.principles || []) {
  const ids = prinStudies[p.id] || [];
  for (const a of ids) for (const b of ids) if (a !== b) {
    (related[a] ??= []); if (!related[a].find((r) => r.id === b)) related[a].push({ id: b, title: studies.find((s) => s.id === b)?.title || b, via: "prinsip: " + p.title });
  }
}

const graph = {
  updated: process.env.GRAPH_DATE || "2026-07-07",
  stats: { studies: studies.length, principles: (syn.principles || []).length, frameworks: (syn.frameworks || []).length, nodes: nodes.length, edges: edges.length },
  clusters: syn.clusters,
  nodes, edges,
  related: Object.fromEntries(Object.entries(related).map(([k, v]) => [k, v.slice(0, 8)])),
};
writeFileSync(fileURLToPath(new URL("lab-graph.json", LAB)), JSON.stringify(graph));
console.log(`lab-graph: ${nodes.length} node, ${edges.length} edge (evidence+framework+term). related utk ${Object.keys(related).length} kajian.`);
