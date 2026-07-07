// apps/web/lib/belajar.ts — akses data tambahan fitur Belajar (Asma'ul Husna, Nabi, Malaikat).
// Data bersumber (public/data/belajar/*.json), status "kandidat — perlu tinjauan ahli".
import { promises as fs } from "node:fs";
import path from "node:path";

interface Sourced { name: string; note?: string; license?: string }

export interface AsmaItem { n: number; arab: string; latin: string; arti: string }
export interface Asma { schema: string; title: string; subtitle?: string; source: Sourced; status?: string; items: AsmaItem[] }

export interface NabiItem { n: number; nama: string; nama_arab: string; ulul_azmi?: boolean; ringkas: string; ayat_ref?: string[]; kaum?: string }
export interface Nabi { schema: string; title: string; source: Sourced; status?: string; items: NabiItem[] }

export interface MalaikatItem { nama: string; nama_arab: string; tugas: string; dalil?: string }
export interface Malaikat { schema: string; title: string; source: Sourced; status?: string; items: MalaikatItem[] }

async function read<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "public", "data", "belajar", file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export const getAsma = () => read<Asma>("asma.json");
export const getNabi = () => read<Nabi>("nabi.json");
export const getMalaikat = () => read<Malaikat>("malaikat.json");

// Ubah "s:a" → href ke ayat di mushaf.
export function ayahHref(ref: string): string {
  const m = ref.match(/^(\d+):(\d+)/);
  return m ? `/surah/${m[1]}#ayah-${m[2]}` : "#";
}
