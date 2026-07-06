import { NextResponse } from "next/server";
import { getRiwayat } from "@/lib/ulum";

// GET /api/v1/ayah/:surah/:ayah/riwayat -> asbabun nuzul / riwayat utk ayat.
export async function GET(_req: Request, { params }: { params: Promise<{ surah: string; ayah: string }> }) {
  const { surah, ayah } = await params;
  const r = await getRiwayat(Number(surah), Number(ayah));
  return NextResponse.json(r);
}
