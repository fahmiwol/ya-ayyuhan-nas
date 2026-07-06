// apps/web/lib/kisah.ts — akses kumpulan kisah (public/data/kisah.json).
import { promises as fs } from "node:fs";
import path from "node:path";

export interface StoryRef { label: string; href: string }
export interface Story { title: string; type: string; narrative: string; related: StoryRef[]; source: string; grade?: string }
export interface KisahCategory { key: string; title: string; stories: Story[] }
export interface KisahData {
  title: string; subtitle: string;
  source: { name: string; license: string; note?: string };
  categories: KisahCategory[];
}

export async function getKisah(): Promise<KisahData | null> {
  try {
    return JSON.parse(await fs.readFile(path.join(process.cwd(), "public", "data", "kisah.json"), "utf8")) as KisahData;
  } catch {
    return null;
  }
}
