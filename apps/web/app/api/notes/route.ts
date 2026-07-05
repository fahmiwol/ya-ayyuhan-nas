import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";
import { getStore, type StoreNote } from "@/lib/store";

export const dynamic = "force-dynamic";

function toStoreNote(userId: string, b: Record<string, unknown>): StoreNote {
  const now = new Date().toISOString();
  return {
    id: String(b.id),
    userId,
    surah: Number(b.surah), ayah: Number(b.ayah), word: b.word == null ? null : Number(b.word),
    color: String(b.color ?? "#f4e06a"), type: String(b.type ?? "refleksi"), note: String(b.note ?? ""),
    source: b.source ?? null, ayahHash: String(b.ayahHash ?? ""),
    createdAt: String(b.createdAt ?? now), updatedAt: String(b.updatedAt ?? now),
  };
}

// GET /api/notes -> catatan milik user (server).
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "belum masuk" }, { status: 401 });
  const store = await getStore();
  return NextResponse.json({ notes: await store.listNotes(user.id) });
}

// PUT /api/notes -> upsert satu catatan.
export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "belum masuk" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (!body?.id) return NextResponse.json({ error: "id wajib" }, { status: 400 });
  const store = await getStore();
  const n = toStoreNote(user.id, body);
  await store.upsertNote(n);
  return NextResponse.json({ note: n });
}

// DELETE /api/notes?id=... -> hapus catatan.
export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "belum masuk" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id wajib" }, { status: 400 });
  const store = await getStore();
  await store.deleteNote(user.id, id);
  return NextResponse.json({ ok: true });
}
