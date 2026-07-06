// apps/web/lib/ulum.ts — akses lapisan keilmuan per-ayat: Tafsir & Riwayat (asbabun nuzul).
import { promises as fs } from "node:fs";
import path from "node:path";

const DATA = path.join(process.cwd(), "public", "data");

export interface TafsirEdition { key: string; name: string; lang: string; source: string; license: string }
export interface AyahTafsir { editions: TafsirEdition[]; texts: Record<string, string> }

export async function getTafsir(surah: number, ayah: number): Promise<AyahTafsir | null> {
  if (!Number.isInteger(surah) || surah < 1 || surah > 114) return null;
  try {
    const raw = await fs.readFile(path.join(DATA, "tafsir", `${surah}.json`), "utf8");
    const j = JSON.parse(raw) as { editions: TafsirEdition[]; ayahs: Record<string, Record<string, string>> };
    const texts = j.ayahs?.[String(ayah)] ?? {};
    // hanya edisi yang punya teks untuk ayat ini
    const editions = (j.editions ?? []).filter((e) => texts[e.key]);
    return { editions, texts };
  } catch {
    return null;
  }
}

export interface AsbabItem { surah: number; ayah: number; title: string; narrative: string; source: string; grade?: string }
type AsbabFile = { items: AsbabItem[]; source: { name: string; license: string; note?: string } };
let asbabCache: AsbabFile | null = null;

async function loadAsbab(): Promise<AsbabFile> {
  if (asbabCache) return asbabCache;
  let data: AsbabFile;
  try { data = JSON.parse(await fs.readFile(path.join(DATA, "asbab.json"), "utf8")) as AsbabFile; }
  catch { data = { items: [], source: { name: "", license: "" } }; }
  asbabCache = data;
  return data;
}

export async function getRiwayat(surah: number, ayah: number) {
  const cache = await loadAsbab();
  const items = cache.items.filter((x) => x.surah === surah && x.ayah === ayah);
  return { items, source: cache.source };
}
