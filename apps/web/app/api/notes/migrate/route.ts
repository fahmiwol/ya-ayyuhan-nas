import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";
import { getStore, type StoreNote } from "@/lib/store";

export const dynamic = "force-dynamic";

// POST /api/notes/migrate  body: { notes: [...] }
// Migrasi catatan lokal (localStorage) -> akun. Idempoten (upsert by id).
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "belum masuk" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const incoming: Array<Record<string, unknown>> = Array.isArray(body?.notes) ? body.notes : [];
  const store = await getStore();
  let migrated = 0;
  for (const b of incoming) {
    if (!b?.id) continue;
    const now = new Date().toISOString();
    const n: StoreNote = {
      id: String(b.id), userId: user.id,
      surah: Number(b.surah), ayah: Number(b.ayah), word: b.word == null ? null : Number(b.word),
      color: String(b.color ?? "#f4e06a"), type: String(b.type ?? "refleksi"), note: String(b.note ?? ""),
      source: b.source ?? null, ayahHash: String(b.ayahHash ?? ""),
      createdAt: String(b.createdAt ?? now), updatedAt: String(b.updatedAt ?? now),
    };
    await store.upsertNote(n);
    migrated++;
  }
  const notes = await store.listNotes(user.id);
  return NextResponse.json({ migrated, notes });
}
