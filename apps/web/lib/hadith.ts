// apps/web/lib/hadith.ts — akses data hadits yang di-bundle (public/data/hadith).
// Built own: dibaca server-side, tak ada panggilan API pihak-ketiga saat runtime.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { HadithIndex, HadithCollection } from "./types";

const DIR = path.join(process.cwd(), "public", "data", "hadith");

async function readJson<T>(rel: string): Promise<T> {
  return JSON.parse(await fs.readFile(path.join(DIR, rel), "utf8")) as T;
}

export async function getHadithIndex(): Promise<HadithIndex | null> {
  try {
    return await readJson<HadithIndex>("index.json");
  } catch {
    return null;
  }
}

export async function getHadithCollection(key: string): Promise<HadithCollection | null> {
  if (!/^[a-z0-9]+$/i.test(key)) return null;
  try {
    return await readJson<HadithCollection>(`${key}.json`);
  } catch {
    return null;
  }
}
