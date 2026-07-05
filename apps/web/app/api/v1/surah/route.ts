import { NextResponse } from "next/server";
import { getIndex } from "@/lib/mushaf";

// GET /api/v1/surah -> daftar 114 surah (urut) + meta integritas.
export async function GET() {
  const { meta, surahs } = await getIndex();
  return NextResponse.json({ meta, surahs });
}
