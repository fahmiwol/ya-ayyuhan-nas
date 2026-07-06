"use client";
// Panel rincian Eval-Gate: 7 langkah gerbang + penilaian ulama (khilaf apa adanya) + provenance.
import type { TrustAssessment, StepStatus } from "@/lib/evalgate";

const STEP_ICON: Record<StepStatus, string> = { pass: "✓", warn: "!", fail: "✗", na: "–" };
const STEP_COLOR: Record<StepStatus, string> = { pass: "#16a34a", warn: "#d97706", fail: "#dc2626", na: "#64748b" };

export function ProvenancePanel({ a, onClose }: { a: TrustAssessment; onClose?: () => void }) {
  return (
    <div className="mt-2 rounded-lg border p-3 text-sm" style={{ borderColor: "var(--line)", background: "var(--bg-soft)" }}>
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: a.color }}>
          <span>{a.icon}</span> {a.label}
        </span>
        {onClose && <button onClick={onClose} className="mut text-xs hover:underline">tutup ✕</button>}
      </div>

      {a.muttafaq && (
        <p className="mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: "#16a34a14", color: "#16a34a" }}>🤝 Muttafaq 'alaih — Bukhari &amp; Muslim sepakat</p>
      )}
      {a.reviewedBy && (
        <p className="mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: "#0891b214", color: "#0891b2" }}>👤 Ditinjau: {a.reviewedBy}</p>
      )}
      {a.disclaimer && (
        <p className="mb-2 rounded-md px-2 py-1 text-[12px]" style={{ background: `${a.color}14`, color: a.color }}>{a.disclaimer}</p>
      )}

      {/* Penilaian ulama — khilaf ditampilkan apa adanya, tak pilih pemenang */}
      {a.scholars.length > 0 && (
        <div className="mb-2">
          <div className="mut mb-1 text-[10px] uppercase tracking-wide">Penilaian ulama</div>
          <div className="flex flex-wrap gap-1.5">
            {a.scholars.map((s, i) => (
              <span key={i} className="rounded border px-1.5 py-0.5 text-[11px]" style={{ borderColor: "var(--line)" }}>
                <b>{s.grade}</b>{s.by ? <span className="mut"> — {s.by}</span> : null}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 7 langkah Eval-Gate */}
      <div className="mb-2">
        <div className="mut mb-1 text-[10px] uppercase tracking-wide">Gerbang validasi (ala isnad · 7 langkah)</div>
        <ol className="space-y-0.5">
          {a.steps.map((st) => (
            <li key={st.n} className="flex items-start gap-2 text-[12px]">
              <span className="mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: STEP_COLOR[st.status] }}>{STEP_ICON[st.status]}</span>
              <span><b>{st.name}.</b> <span className="mut">{st.note}</span></span>
            </li>
          ))}
        </ol>
      </div>

      {/* Provenance sumber */}
      {a.provenance && (a.provenance.source || a.provenance.license) && (
        <div className="mut text-[11px]">
          Sumber: {a.provenance.source}
          {a.provenance.license ? ` · ${a.provenance.license}` : ""}
          {a.provenance.url ? <> · <a href={a.provenance.url} target="_blank" rel="noopener noreferrer" className="underline">tautan</a></> : null}
          {a.provenance.note ? <div className="mt-0.5 italic">{a.provenance.note}</div> : null}
        </div>
      )}

      <p className="mut mt-2 text-[10px]">Metodologi: langkah yang belum bisa dinilai otomatis ditandai "–" (tidak dianggap lulus). Rincian: 12_ISLAMIC_VALIDATION.md. Bukan fatwa.</p>
    </div>
  );
}
