"use client";
// Badge status kepercayaan (Eval-Gate). Konsisten di seluruh konten bernarasi.
import { useState } from "react";
import type { TrustAssessment } from "@/lib/evalgate";
import { ProvenancePanel } from "./ProvenancePanel";

export function TrustBadge({ a, compact, asStatic }: { a: TrustAssessment; compact?: boolean; asStatic?: boolean }) {
  const [open, setOpen] = useState(false);
  const inner = (
    <>
      <span>{a.icon}</span>
      <span>{a.short}</span>
      {a.machine && <span title="memuat terjemahan mesin">🌐</span>}
    </>
  );
  const cls = "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition";
  const style = { borderColor: a.color, color: a.color, background: `${a.color}14` };

  // asStatic → render <span> (mis. ketika berada di dalam elemen <button> lain: hindari button bersarang)
  if (asStatic) return <span className={cls} style={style}>{inner}</span>;

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Lihat rincian Eval-Gate (sumber, sanad, penilaian ulama)"
        className={cls}
        style={style}
      >
        {inner}
        {!compact && <span style={{ opacity: 0.7 }}>{open ? "▲" : "▾"}</span>}
      </button>
      {open && <ProvenancePanel a={a} onClose={() => setOpen(false)} />}
    </>
  );
}
