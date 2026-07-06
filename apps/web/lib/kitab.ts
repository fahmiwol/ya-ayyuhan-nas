// apps/web/lib/kitab.ts — akses perpustakaan keilmuan (public/data/kitab.json).
import { promises as fs } from "node:fs";
import path from "node:path";

export interface Work { title: string; title_ar?: string; author: string; era: string; note?: string; in_app?: string }
export interface KitabField { key: string; title: string; works: Work[] }
export interface KitabData {
  title: string; subtitle: string;
  source: { name: string; license: string; note?: string };
  fields: KitabField[];
}

export async function getKitab(): Promise<KitabData | null> {
  try {
    return JSON.parse(await fs.readFile(path.join(process.cwd(), "public", "data", "kitab.json"), "utf8")) as KitabData;
  } catch {
    return null;
  }
}
