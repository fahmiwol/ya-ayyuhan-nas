import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

// GET /api/v1/search/ayah?q=hujan&lang=id&limit=40
// Cari ayat yang terjemahannya mengandung kata kunci (full-text ringan).
// Index dimuat sekali (cache module-scope); klien tak mengunduh file 2MB.

type Row = [number, number, string, string]; // [surah, ayah, id, en]
interface Index { v: number; count: number; names: Record<string, string>; rows: Row[] }

let CACHE: Index | null = null;
async function loadIndex(): Promise<Index> {
  if (CACHE) return CACHE;
  const p = path.join(process.cwd(), "public", "data", "search-index.json");
  CACHE = JSON.parse(await fs.readFile(p, "utf8")) as Index;
  return CACHE;
}

function snippet(text: string, q: string): string {
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return text.slice(0, 140);
  const start = Math.max(0, i - 40);
  return (start > 0 ? "…" : "") + text.slice(start, i + q.length + 90) + (i + q.length + 90 < text.length ? "…" : "");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const lang = url.searchParams.get("lang") === "en" ? "en" : "id";
  const limit = Math.min(80, Math.max(1, Number(url.searchParams.get("limit") ?? 40)));
  if (q.length < 2) return NextResponse.json({ q, count: 0, results: [] });

  const idx = await loadIndex();
  const col = lang === "en" ? 3 : 2;
  const results: { surah: number; ayah: number; surahName: string; snippet: string }[] = [];
  let total = 0;
  for (const r of idx.rows) {
    const text = r[col] as string;
    if (text && text.toLowerCase().includes(q)) {
      total++;
      if (results.length < limit) {
        results.push({ surah: r[0], ayah: r[1], surahName: idx.names[String(r[0])] ?? `Surah ${r[0]}`, snippet: snippet(text, q) });
      }
    }
  }
  return NextResponse.json({ q, count: total, shown: results.length, results });
}
