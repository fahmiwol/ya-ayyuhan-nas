// lib/lab.ts — Lab Tadabbur: kajian interpretasi rekayasa per-ayat (SERVER only).
//
// PRINSIP (tak bisa ditawar):
//  - Teks ayat TIDAK PERNAH disalin ke data Lab — hanya referensi (surah:ayah).
//    Render selalu menarik teks dari mushaf kanonik ber-Merkle (immutability terjaga).
//  - Semua isi kajian = tier "interpretation" (BUKAN tafsir/dalil) via Eval-Gate.
//  - Makna religius dirujuk ke tafsir bersumber (panel tafsir app), bukan ditulis ulang di sini.
//
// TUMBUH TERUS: kajian baru = 1 file JSON di public/data/lab/ + 1 entri di index.json.
// Skema di bawah = kontrak; jangan ubah field lama tanpa version bump (schema).

import { promises as fs } from "node:fs";
import path from "node:path";

const LAB_DIR = path.join(process.cwd(), "public", "data", "lab");

export interface LabLensReading {
  lens: string; // key lensa (lihat taxonomy.json → lenses)
  reading: string; // pembacaan rekayasa (analogi struktural)
  quranic_term?: string; // istilah kognitif Qur'ani terkait (mis. "tadabbur")
  analogy?: string; // padanan teknis singkat (mis. "READ → ENCODE → LEARN")
}

// Riwayat tadabbur: SETIAP interpretasi direkam. Re-tadabbur = version bump +
// arsip versi lama (archive/<id>.v<N>.json — tetap bisa dibaca) + entri history.
// Tooling: pipeline/lab-scaffold.mjs (buat kajian baru), lab-rev.mjs (re-tadabbur),
// lab-validate.mjs (validasi skema + rujukan vs mushaf — jalankan sebelum commit).
export interface LabRevision { version: number; date: string; note: string; authors: string[] }

export interface LabStudy {
  schema: string; // "lab-study-v2"
  id: string;
  version: number; // versi tadabbur saat ini (mulai 1)
  title: string;
  subtitle?: string;
  ref: { surah: number; from: number; to: number }; // rujukan ayat (teks ditarik dari mushaf)
  surah_name?: string;
  theme: string; // tema besar kajian
  sourced_meaning: { summary: string; sources: string[] }; // ringkas makna BERSUMBER + atribusi
  qca: { layer: string; note: string }[]; // pemetaan ke Qur'anic Cognitive Architecture
  lenses: LabLensReading[];
  inference: string; // inferensi/temuan utama kajian
  authors: string[];
  status: "draft" | "published";
  created: string;
  history: LabRevision[]; // riwayat tadabbur (terbaru terakhir)
}

export interface LabIndexEntry {
  id: string; title: string; ref: string; theme: string; lenses: number; created: string;
}
export interface LabIndex { schema: string; title: string; note: string; studies: LabIndexEntry[] }

export interface LabTaxonomy {
  schema: string;
  lenses: { key: string; title: string; icon: string; desc: string }[];
  cognitive_terms: { term: string; arabic: string; meaning: string; operation: string; ayat_claimed: string; note?: string }[];
  provenance: { name: string; note: string }[];
}

async function readJson<T>(rel: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(LAB_DIR, rel), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// Kompat mundur: file lama (lab-study-v1) tanpa version/history → default v1.
function normalize(s: LabStudy | null): LabStudy | null {
  if (!s) return null;
  return { ...s, version: s.version ?? 1, history: s.history ?? [{ version: 1, date: s.created, note: "Tadabbur perdana.", authors: s.authors }] };
}

export async function getLabIndex(): Promise<LabIndex | null> {
  return readJson<LabIndex>("index.json");
}
export async function getLabStudy(id: string): Promise<LabStudy | null> {
  if (!/^[a-z0-9-]+$/.test(id)) return null; // sanitasi id (anti path traversal)
  return normalize(await readJson<LabStudy>(`${id}.json`));
}
// Baca versi ARSIP (tadabbur lama tetap terekam & bisa dibaca).
export async function getLabStudyVersion(id: string, version: number): Promise<LabStudy | null> {
  if (!/^[a-z0-9-]+$/.test(id) || !Number.isInteger(version) || version < 1) return null;
  return normalize(await readJson<LabStudy>(path.join("archive", `${id}.v${version}.json`)));
}
export async function getLabTaxonomy(): Promise<LabTaxonomy | null> {
  return readJson<LabTaxonomy>("taxonomy.json");
}

// Sintesis lintas-kajian — memanen pola berulang antar-ayat jadi prinsip desain.
export interface SynthEvidence { ref: string; id: string; note: string }
export interface SynthPrinciple {
  id: string; cluster: string; title: string; statement: string;
  evidence: SynthEvidence[]; implication: string; note_single?: string;
}
export interface SynthCluster { key: string; title: string; icon: string; desc: string }
export interface SynthBlueprintLayer {
  n: number; layer: string; quranic: string; principle: string; reading: string; refs: string[];
}
export interface LabSynthesis {
  schema: string; title: string; note: string;
  clusters: SynthCluster[];
  principles: SynthPrinciple[];
  blueprint: { title: string; note: string; layers: SynthBlueprintLayer[] };
}
export async function getLabSynthesis(): Promise<LabSynthesis | null> {
  return readJson<LabSynthesis>("synthesis.json");
}
