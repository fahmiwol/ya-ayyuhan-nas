// apps/web/lib/doa.ts — akses kumpulan doa (public/data/doa.json).
import { promises as fs } from "node:fs";
import path from "node:path";

export interface DoaDetail { penjelasan?: string; riwayat?: string; sanad?: string; sumber?: string }
export interface Doa {
  title: string; occasion: string; meaning: string;
  ref?: string; href?: string;              // doa Qur'ani -> link ke ayat
  text_ar?: string; translit?: string;      // doa harian (sunnah)
  source?: string; grade?: string;
  detail?: DoaDetail;                        // penjelasan/riwayat/sanad utk slider
}
export interface DoaCategory { key: string; title: string; note?: string; duas: Doa[] }
export interface DoaData {
  title: string; subtitle: string;
  source: { name: string; license: string; note?: string };
  categories: DoaCategory[];
}

export async function getDoa(): Promise<DoaData | null> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "public", "data", "doa.json"), "utf8");
    return JSON.parse(raw) as DoaData;
  } catch {
    return null;
  }
}
