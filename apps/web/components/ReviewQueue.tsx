"use client";
// Antrean tinjau (reviewer/admin): nilai & sahkan konten (Eval-Gate). Keputusan → POST /api/v1/reviews.
import { useMemo, useState } from "react";
import { assess, applyReview, type Provenance } from "@/lib/evalgate";
import { TrustBadge } from "./TrustBadge";
import type { ContentReview, ReviewDecision } from "@/lib/store";

export interface QueueItem {
  ref: string; kind: string; collection: string; number: number;
  arabic: string; text: string | null; machine: boolean;
  grades: { by?: string | null; grade: string }[]; provenance: Provenance;
}
type Filter = "todo" | "done" | "all";
const TIERS = ["", "sahih", "hasan", "daif", "maudhu", "disputed", "sourced", "mutawatir"];

export function ReviewQueue({ items, reviews, reviewer }: { items: QueueItem[]; reviews: ContentReview[]; reviewer: string }) {
  const [map, setMap] = useState<Record<string, ContentReview>>(() => Object.fromEntries(reviews.map((r) => [r.ref, r])));
  const [filter, setFilter] = useState<Filter>("todo");

  const enriched = useMemo(() => items.map((it) => {
    const base = assess({ kind: "hadith", grades: it.grades, hasProvenance: true, machine: it.machine, source: it.provenance });
    const rv = map[it.ref];
    const a = rv ? applyReview(base, { decision: rv.decision, statusOverride: rv.statusOverride, note: rv.note, reviewerName: rv.reviewerName }) : base;
    const actionable = !rv && (base.tier === "unreviewed" || base.tier === "disputed" || base.tier === "daif" || base.machine);
    return { it, a, rv, actionable };
  }), [items, map]);

  const shown = enriched.filter((e) => (filter === "todo" ? e.actionable : filter === "done" ? !!e.rv : true));
  const counts = { todo: enriched.filter((e) => e.actionable).length, done: enriched.filter((e) => e.rv).length, all: enriched.length };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Antrean Tinjau <span className="gold">(Eval-Gate)</span></h1>
      <p className="mut mt-2 text-sm">Nilai &amp; sahkan status konten. Keputusanmu menimpa status otomatis dan tampil transparan ke pembaca (👤 ditinjau: {reviewer}). Netral: bila khilaf, pilih "Perlu perbaikan" + catat, jangan paksakan.</p>

      <div className="mt-4 flex gap-2 text-sm">
        {(["todo", "done", "all"] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="rounded-full border px-3 py-1"
            style={{ borderColor: filter === f ? "var(--gold)" : "var(--line)", color: filter === f ? "var(--gold)" : "var(--mut)" }}>
            {f === "todo" ? "Perlu tinjau" : f === "done" ? "Sudah ditinjau" : "Semua"} ({counts[f]})
          </button>
        ))}
      </div>

      <ol className="mt-5 space-y-4">
        {shown.length === 0 && <li className="card p-8 text-center mut">Tidak ada item di filter ini. 🎉</li>}
        {shown.map((e) => (
          <ReviewRow key={e.it.ref} it={e.it} auto={e.a} existing={e.rv} reviewer={reviewer}
            onSaved={(rv) => setMap((m) => ({ ...m, [rv.ref]: rv }))} />
        ))}
      </ol>
    </div>
  );
}

function ReviewRow({ it, auto, existing, reviewer, onSaved }: {
  it: QueueItem; auto: ReturnType<typeof assess>; existing?: ContentReview; reviewer: string;
  onSaved: (r: ContentReview) => void;
}) {
  const [note, setNote] = useState(existing?.note ?? "");
  const [override, setOverride] = useState(existing?.statusOverride ?? "");
  const [busy, setBusy] = useState<ReviewDecision | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(decision: ReviewDecision) {
    setBusy(decision); setErr(null);
    try {
      const res = await fetch("/api/v1/reviews", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: it.ref, kind: it.kind, decision, statusOverride: decision === "validated" ? override || null : null, note: note || null }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Gagal");
      onSaved(j.review as ContentReview);
    } catch (e) { setErr(e instanceof Error ? e.message : "Gagal"); }
    finally { setBusy(null); }
  }

  return (
    <li className="card p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="grid place-items-center rounded-full" style={{ minWidth: 26, height: 26, border: "1px solid var(--gold)", color: "var(--gold)" }}>{it.number}</span>
        <span className="mut">{it.collection}</span>
        <TrustBadge a={auto} />
      </div>
      <p className="arabic" style={{ fontSize: "1.3rem", lineHeight: 1.9 }}>{it.arabic}</p>
      {it.text && <p className="mut mt-2 text-sm leading-relaxed">{it.text}{it.machine && <span className="ml-1 text-[10px]">🌐 mesin</span>}</p>}

      <div className="mt-3 rounded-lg border p-3" style={{ borderColor: "var(--line)" }}>
        <div className="flex flex-wrap items-center gap-2">
          <label className="mut text-xs">Status (utk sahkan):</label>
          <select value={override} onChange={(e) => setOverride(e.target.value)} className="rounded border px-2 py-1 text-xs" style={{ background: "var(--panel)", borderColor: "var(--line)", color: "var(--txt)" }}>
            {TIERS.map((t) => <option key={t} value={t}>{t || "(pakai otomatis)"}</option>)}
          </select>
        </div>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan tinjauan (opsional, tampil ke pembaca)"
          className="mt-2 w-full rounded border px-2 py-1 text-sm" style={{ background: "var(--panel)", borderColor: "var(--line)", color: "var(--txt)" }} />
        <div className="mt-2 flex flex-wrap gap-2">
          <button disabled={!!busy} onClick={() => submit("validated")} className="rounded px-3 py-1 text-xs font-medium" style={{ background: "#16a34a", color: "#fff", opacity: busy ? 0.6 : 1 }}>{busy === "validated" ? "…" : "✓ Sahkan"}</button>
          <button disabled={!!busy} onClick={() => submit("needs_work")} className="rounded px-3 py-1 text-xs font-medium" style={{ background: "#d97706", color: "#fff", opacity: busy ? 0.6 : 1 }}>! Perlu perbaikan</button>
          <button disabled={!!busy} onClick={() => submit("rejected")} className="rounded px-3 py-1 text-xs font-medium" style={{ background: "#dc2626", color: "#fff", opacity: busy ? 0.6 : 1 }}>✗ Tolak</button>
          {existing && <span className="mut self-center text-[11px]">terakhir: {existing.decision} · {existing.reviewerName}</span>}
        </div>
        {err && <p className="mt-1 text-[11px]" style={{ color: "#dc2626" }}>{err}</p>}
      </div>
    </li>
  );
}
