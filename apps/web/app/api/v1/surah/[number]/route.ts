import { NextResponse } from "next/server";
import { getSurah } from "@/lib/mushaf";

// GET /api/v1/surah/:number -> satu surah lengkap (ayat urut + terjemahan + hash).
export async function GET(_req: Request, { params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const surah = await getSurah(Number(number));
  if (!surah) return NextResponse.json({ error: "surah tidak ditemukan (1..114)" }, { status: 404 });
  return NextResponse.json(surah);
}
