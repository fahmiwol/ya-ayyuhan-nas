// apps/web/lib/mushaf.ts
// Akses data KANONIK yang di-bundle (public/data). Dibaca server-side (SSG + API).
// TIDAK ada panggilan API pihak-ketiga — "built own", offline-capable.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { MushafIndex, Surah, SurahSummary } from "./types";

const DATA_DIR = path.join(process.cwd(), "public", "data");

async function readJson<T>(rel: string): Promise<T> {
  const raw = await fs.readFile(path.join(DATA_DIR, rel), "utf8");
  return JSON.parse(raw) as T;
}

export async function getIndex(): Promise<MushafIndex> {
  return readJson<MushafIndex>("index.json");
}

export async function getSurahList(): Promise<SurahSummary[]> {
  return (await getIndex()).surahs;
}

export async function getSurah(n: number): Promise<Surah | null> {
  if (!Number.isInteger(n) || n < 1 || n > 114) return null;
  try {
    return await readJson<Surah>(path.join("surah", `${n}.json`));
  } catch {
    return null;
  }
}

export async function getIntegrity(): Promise<Record<string, unknown>> {
  return readJson<Record<string, unknown>>("integrity.json");
}

// Bukti inklusi Merkle (identitas) untuk satu ayat. proofs.json besar -> baca sekali, cache.
type ProofsFile = { merkle_root: string; scheme: string; byGlobal: Record<string, unknown> };
let proofsCache: ProofsFile | null = null;
async function loadProofs(): Promise<ProofsFile> {
  if (!proofsCache) proofsCache = await readJson<ProofsFile>("proofs.json");
  return proofsCache;
}
export async function getAyahProof(surah: number, ayah: number) {
  const cache = await loadProofs();
  const s = await getSurah(surah);
  const a = s?.ayahs.find((x) => x.ayah === ayah);
  if (!a) return null;
  const identity = cache.byGlobal[String(a.global)] ?? null;
  if (!identity) return null;
  return { scheme: cache.scheme, merkle_root: cache.merkle_root, identity };
}

// Anotasi (tafsir/remark/note) untuk satu ayat.
type AnnFile = { annotations: Array<{ target: { surah: number; ayah: number; word: number | null } }> };
let annCache: AnnFile | null = null;
async function loadAnnotations(): Promise<AnnFile> {
  if (!annCache) annCache = await readJson<AnnFile>("annotations.json");
  return annCache;
}
export async function getAnnotations(surah: number, ayah: number) {
  const cache = await loadAnnotations();
  return cache.annotations.filter((x) => x.target.surah === surah && x.target.ayah === ayah);
}
