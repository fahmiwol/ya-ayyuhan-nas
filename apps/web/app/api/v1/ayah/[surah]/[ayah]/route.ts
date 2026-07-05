import { NextResponse } from "next/server";
import { getSurah } from "@/lib/mushaf";

// GET /api/v1/ayah/:surah/:ayah -> satu ayat (teks Arab + terjemahan + hash).
export async function GET(_req: Request, { params }: { params: Promise<{ surah: string; ayah: string }> }) {
  const { surah, ayah } = await params;
  const s = await getSurah(Number(surah));
  if (!s) return NextResponse.json({ error: "surah tidak ditemukan (1..114)" }, { status: 404 });
  const a = s.ayahs.find((x) => x.ayah === Number(ayah));
  if (!a) return NextResponse.json({ error: `ayat tidak ditemukan (1..${s.ayah_count})` }, { status: 404 });
  return NextResponse.json({ surah: s.number, surah_name: s.name_latin, ...a });
}
