import { NextResponse } from "next/server";
import { getAnnotations } from "@/lib/mushaf";

// GET /api/v1/annotations/:surah/:ayah -> anotasi (tafsir/remark/note) untuk ayat.
export async function GET(_req: Request, { params }: { params: Promise<{ surah: string; ayah: string }> }) {
  const { surah, ayah } = await params;
  const anns = await getAnnotations(Number(surah), Number(ayah));
  return NextResponse.json({ surah: Number(surah), ayah: Number(ayah), count: anns.length, annotations: anns });
}
