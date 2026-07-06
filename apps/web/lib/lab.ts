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

export interface LabStudy {
  schema: string; // "lab-study-v1"
  id: string;
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

export async function getLabIndex(): Promise<LabIndex | null> {
  return readJson<LabIndex>("index.json");
}
export async function getLabStudy(id: string): Promise<LabStudy | null> {
  if (!/^[a-z0-9-]+$/.test(id)) return null; // sanitasi id (anti path traversal)
  return readJson<LabStudy>(`${id}.json`);
}
export async function getLabTaxonomy(): Promise<LabTaxonomy | null> {
  return readJson<LabTaxonomy>("taxonomy.json");
}
