import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getSessionUser } from "@/lib/auth-server";
import type { ContentReview, ReviewDecision } from "@/lib/store";

const DECISIONS: ReviewDecision[] = ["validated", "rejected", "needs_work"];
const TIERS = new Set(["mutawatir", "sahih", "hasan", "sourced", "disputed", "daif", "maudhu"]);

// GET /api/v1/reviews → semua keputusan tinjauan (baca publik: badge menampilkan status tervalidasi).
export async function GET() {
  const store = await getStore();
  const reviews = await store.listReviews();
  return NextResponse.json({ reviews });
}

// POST /api/v1/reviews → catat/timpa keputusan (RBAC: reviewer/admin saja).
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Perlu masuk." }, { status: 401 });
  if (user.role !== "reviewer" && user.role !== "admin")
    return NextResponse.json({ error: "Hanya reviewer/admin yang boleh meninjau." }, { status: 403 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Body tak valid." }, { status: 400 }); }

  const ref = String(body.ref ?? "").trim();
  const kind = String(body.kind ?? "").trim();
  const decision = String(body.decision ?? "") as ReviewDecision;
  const statusOverride = body.statusOverride ? String(body.statusOverride) : null;
  const note = body.note ? String(body.note).slice(0, 2000) : null;

  if (!ref || !kind) return NextResponse.json({ error: "ref & kind wajib." }, { status: 400 });
  if (!DECISIONS.includes(decision)) return NextResponse.json({ error: "decision tak valid." }, { status: 400 });
  if (statusOverride && !TIERS.has(statusOverride)) return NextResponse.json({ error: "statusOverride tak valid." }, { status: 400 });

  const now = new Date().toISOString();
  const review: ContentReview = {
    ref, kind, decision, statusOverride, note,
    reviewerId: user.id, reviewerName: user.name, createdAt: now, updatedAt: now,
  };
  const store = await getStore();
  await store.upsertReview(review);
  return NextResponse.json({ ok: true, review });
}
