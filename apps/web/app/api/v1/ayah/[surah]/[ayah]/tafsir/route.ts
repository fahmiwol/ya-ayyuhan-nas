import { NextResponse } from "next/server";
import { getTafsir } from "@/lib/ulum";

// GET /api/v1/ayah/:surah/:ayah/tafsir -> tafsir multi-edisi utk ayat.
export async function GET(_req: Request, { params }: { params: Promise<{ surah: string; ayah: string }> }) {
  const { surah, ayah } = await params;
  const t = await getTafsir(Number(surah), Number(ayah));
  if (!t) return NextResponse.json({ editions: [], texts: {} });
  return NextResponse.json(t);
}
