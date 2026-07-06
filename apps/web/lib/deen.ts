// apps/web/lib/deen.ts — akses kurikulum "Dasar Keislaman" (public/data/deen.json).
import { promises as fs } from "node:fs";
import path from "node:path";

export interface Dalil { type: "ayah" | "hadith"; label: string; href: string }
export interface DeenItem { title: string; body?: string; dalil?: Dalil[]; n?: number }
export interface DeenTrack { title: string; subtitle?: string; body?: string; items?: DeenItem[]; dalil?: Dalil[] }
export interface Deen {
  title: string; subtitle: string; intro: string;
  source: { name: string; license: string; note?: string };
  roadmap: { title: string; steps: DeenItem[] };
  tracks: { islam: DeenTrack; iman: DeenTrack; ihsan: DeenTrack };
  shalat: { title: string; note: string; waktu: { name: string; rakaat: number }[]; rukun: string[]; dalil?: Dalil[] };
  glossary: { term: string; def: string }[];
}

export async function getDeen(): Promise<Deen | null> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "public", "data", "deen.json"), "utf8");
    return JSON.parse(raw) as Deen;
  } catch {
    return null;
  }
}
