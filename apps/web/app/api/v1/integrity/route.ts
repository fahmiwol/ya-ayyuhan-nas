import { NextResponse } from "next/server";
import { getIntegrity } from "@/lib/mushaf";

// GET /api/v1/integrity -> manifest keaslian (root hash, sumber, lisensi, hasil cross-check).
export async function GET() {
  return NextResponse.json(await getIntegrity());
}
