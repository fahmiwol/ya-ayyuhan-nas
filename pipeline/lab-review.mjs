// pipeline/lab-review.mjs — stempel TINJAUAN AHLI pada kajian (jalur naik-status).
// HANYA untuk peninjau berkelas nyata (ulama/mufassir/sejarawan/hafizh/akademisi)
// yang benar-benar meninjau. JANGAN dipakai mengesahkan tanpa tinjauan nyata
// (melanggar eval-gate & netralitas — atribusi palsu = kontaminasi).
//
// Pakai: node pipeline/lab-review.mjs <id> <verdict> "<by>" "<role>" "<catatan>" ["<credential>"]
//   verdict: endorsed | revise | rejected  (pending = default, tak perlu stempel)
// Contoh: node pipeline/lab-review.mjs iqra-96-1-5 endorsed "Dr. X" "akademisi" "Analogi sahih; bukan tafsir." "UIN Y"

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const [id, verdict, by, role, note, credential] = process.argv.slice(2);
const VALID = ["endorsed", "revise", "rejected"];
if (!id || !VALID.includes(verdict) || !by || !role) {
  console.error('Pakai: node pipeline/lab-review.mjs <id> <endorsed|revise|rejected> "<by>" "<role>" "<catatan>" ["<credential>"]');
  process.exit(1);
}
const fp = fileURLToPath(new URL(`../apps/web/public/data/lab/${id}.json`, import.meta.url));
if (!existsSync(fp)) { console.error(`✗ kajian ${id} tidak ada`); process.exit(1); }
const s = JSON.parse(readFileSync(fp, "utf8"));

// tanggal WAJIB dari argumen/lingkungan (Date.now tak dipakai agar deterministik/auditable)
const date = process.env.REVIEW_DATE || new Date().toISOString().slice(0, 10);
s.review = { verdict, by, role, date, ...(credential ? { credential } : {}), ...(note ? { note } : {}) };
// endorsed → status naik ke published bila belum; verdict lain biarkan status apa adanya
if (verdict === "endorsed" && s.status !== "published") s.status = "published";

writeFileSync(fp, JSON.stringify(s, null, 2));
console.log(`✓ ${id}: tinjauan '${verdict}' oleh ${by} (${role}) ${date}.`);
console.log("  Jalankan: node pipeline/lab-validate.mjs " + id + " → commit.");
