// pipeline/lab-mine.mjs — GENERATOR PRINSIP semi-otomatis (usulan, bukan keputusan).
// Membaca SEMUA kajian → ekstrak sinyal (analogy, quranic_term, kata kunci inference)
// → kelompokkan yang berulang lintas ≥2 kajian → usulkan pola yang BELUM jadi prinsip
// di synthesis.json. Output = laporan utk DITINJAU MANUSIA (tak menulis synthesis).
//
// Pakai: node pipeline/lab-mine.mjs        → cetak laporan + tulis 18_MINED_PATTERNS.md
// Prinsip: alat ini MENGUSULKAN; keputusan tetap di tangan peninjau (skill tadabbur-lab).

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const LAB = new URL("../apps/web/public/data/lab/", import.meta.url);
const read = (f) => JSON.parse(readFileSync(fileURLToPath(new URL(f, LAB)), "utf8"));
const SKIP = new Set(["index.json", "taxonomy.json", "synthesis.json", "coverage.json", "lab-graph.json"]);

const studies = readdirSync(fileURLToPath(LAB))
  .filter((f) => f.endsWith(".json") && !SKIP.has(f))
  .map((f) => read(f));

const syn = read("synthesis.json");
// kata kunci yang SUDAH tercakup prinsip (agar usulan = yang baru)
const covered = (syn.principles.map((p) => p.title + " " + p.statement + " " + p.implication).join(" ")).toLowerCase();

// stopword ringan (ID+EN) — supaya token bermakna yang tersaring
const STOP = new Set("yang dan di ke dari untuk pada dengan atau ini itu adalah tak tidak bukan bisa akan juga sbg = the a an of to in is are be as by on for and or not with this that it its into than then over under about via per — → = & + -- ( ) : ; , . ' \" ".split(/\s+/));

// 1. hitung frekuensi 'analogy' (padanan teknis) lintas kajian
const analogyHits = {};
// 2. hitung frekuensi bigram/term dari analogy + quranic_term
const termHits = {};
const push = (map, key, ev) => { (map[key] ??= new Set()).add(ev); };

// glosarium konsep rekayasa (EN) — token bermakna yang kita cari lintas kajian
const CONCEPT = /\b(audit|log|logging|ledger|feedback|constraint|invariant|verif\w*|validation|attestation|alignment|entropy|homeostasis|substrate|threshold|redundan\w*|replay|provenance|repudiat\w*|grounding|retrieval|adversarial|swarm|emergen\w*|pipeline|checkpoint|sandbox|isolation|median|equilibrium|calibration|drift|reflection|reasoning|memory|declarative|observability|deterministic|bias|commitment|budget|dormancy|routing)\b/g;

for (const s of studies) {
  const ev = s.id;
  for (const l of s.lenses ?? []) {
    const blob = ((l.analogy ?? "") + " " + (l.reading ?? "")).toLowerCase();
    for (const m of blob.matchAll(CONCEPT)) push(analogyHits, m[1].replace(/(ing|s|ed|ion|ant|ent)$/, ""), ev);
    if (l.quranic_term) {
      for (const t of l.quranic_term.split(/[/·]/).map((x) => x.trim().toLowerCase()).filter(Boolean)) {
        if (t.length > 2) push(termHits, t, ev);
      }
    }
  }
  const infl = (s.inference ?? "").toLowerCase();
  for (const m of infl.matchAll(CONCEPT)) push(analogyHits, m[1].replace(/(ing|s|ed|ion|ant|ent)$/, ""), ev);
  for (const w of infl.split(/[^a-zāīūḥṣḍṭẓʿʾñ0-9-]+/)) {
    if (w.length > 5 && !STOP.has(w)) push(termHits, w, ev);
  }
}

// helper: entri yang muncul di >=2 kajian, urut desc, filter yang belum tercakup
const rank = (map, min = 2) =>
  Object.entries(map)
    .map(([k, set]) => ({ k, ids: [...set], n: set.size }))
    .filter((x) => x.n >= min)
    .sort((a, b) => b.n - a.n);

const analogies = rank(analogyHits, 2);
const terms = rank(termHits, 3).filter((x) => !covered.includes(x.k)); // term baru saja

let md = "# 18_MINED_PATTERNS — Usulan Pola (semi-otomatis, WAJIB ditinjau)\n\n";
md += "> Dihasilkan `pipeline/lab-mine.mjs` dari " + studies.length + " kajian. Ini USULAN mentah — bukan prinsip.\n";
md += "> Peninjau (skill tadabbur-lab) memutуskan mana yang layak jadi prinsip di synthesis.json.\n\n";

md += "## A. Konsep rekayasa berulang lintas kajian (≥2)\n";
md += "Konsep yang muncul di banyak ayat berbeda = kandidat kuat pola struktural. Bandingkan dgn prinsip eksisting; yang tebal-sebaran tapi belum jadi prinsip = usulan.\n\n";
md += "| konsep | #kajian | kajian |\n|---|---|---|\n";
for (const a of analogies) md += `| ${a.k} | ${a.n} | ${a.ids.join(", ")} |\n`;

md += "\n## B. Istilah/konsep berulang ≥3 kajian (yang BELUM tercakup prinsip)\n\n";
md += "| term | #kajian | kajian |\n|---|---|---|\n";
for (const t of terms.slice(0, 40)) md += `| ${t.k} | ${t.n} | ${t.ids.join(", ")} |\n`;

md += "\n## C. Ringkasan\n";
md += `- Kajian dibaca: ${studies.length}\n`;
md += `- Analogy berulang (≥2): ${analogies.length}\n`;
md += `- Term baru berulang (≥3, di luar prinsip): ${terms.length}\n`;
md += `- Prinsip eksisting: ${syn.principles.length} · Kerangka: ${(syn.frameworks ?? []).length}\n`;
md += "\n> Langkah peninjau: pilih baris A/B yang menyiratkan POLA desain lintas-ayat yang belum jadi prinsip → tulis prinsip (≥2 evidence) via skill.\n";

writeFileSync(fileURLToPath(new URL("../18_MINED_PATTERNS.md", import.meta.url)), md); // → workspace root

console.log(`lab-mine: ${studies.length} kajian → ${analogies.length} analogy berulang, ${terms.length} term baru.`);
console.log("Top analogy berulang:");
for (const a of analogies.slice(0, 12)) console.log(`  [${a.n}] ${a.k}  (${a.ids.join(", ")})`);
console.log("→ laporan lengkap: 18_MINED_PATTERNS.md");
