import { NextResponse } from "next/server";
import { getAyahProof } from "@/lib/mushaf";

// GET /api/v1/ayah/:surah/:ayah/proof -> identitas + bukti inklusi Merkle (mint-ready).
export async function GET(_req: Request, { params }: { params: Promise<{ surah: string; ayah: string }> }) {
  const { surah, ayah } = await params;
  const p = await getAyahProof(Number(surah), Number(ayah));
  if (!p) return NextResponse.json({ error: "ayat tidak ditemukan" }, { status: 404 });
  return NextResponse.json(p);
}
