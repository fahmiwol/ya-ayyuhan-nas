"use client";
// Mesin Temuan — sintesis lintas-kajian. Cluster prinsip (filterable) + Blueprint Organisme Digital.
import Link from "next/link";
import { useMemo, useState } from "react";
import type { LabSynthesis } from "@/lib/lab";

export function LabSynthesisView({ syn }: { syn: LabSynthesis }) {
  const [active, setActive] = useState<string | null>(null); // cluster filter
  const cl = useMemo(() => Object.fromEntries(syn.clusters.map((c) => [c.key, c])), [syn.clusters]);
  const prinById = useMemo(() => Object.fromEntries(syn.principles.map((p) => [p.id, p])), [syn.principles]);
  const shown = active ? syn.principles.filter((p) => p.cluster === active) : syn.principles;
  const count = (k: string) => syn.principles.filter((p) => p.cluster === k).length;

  return (
    <div>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">🧬 {syn.title}</h1>
        <span className="rounded-full px-2 py-0.5 text-[10px]" style={{ border: "1px solid #3b82f6", color: "#3b82f6" }}>Mesin Temuan</span>
      </div>
      <p className="mut mt-2 text-sm">{syn.note}</p>
      <div className="mt-3 rounded-lg border p-3 text-xs" style={{ borderColor: "#3b82f6", background: "#3b82f610" }}>
        <b style={{ color: "#3b82f6" }}>🧪 Interpretasi rekayasa, bukan tafsir.</b>{" "}
        <span className="mut">Prinsip = pola yang berulang di ≥2 kajian. Sebuah pola yang muncul independen di banyak surah = sinyal struktural. Untuk dasar riset teknologi/AI — bukan dalil agama.</span>
      </div>

      {/* BLUEPRINT — flagship */}
      <div className="card mt-6 p-4" style={{ borderColor: "#3b82f6" }}>
        <b className="text-lg" style={{ color: "#3b82f6" }}>🤖 {syn.blueprint.title}</b>
        <p className="mut mt-1 text-xs">{syn.blueprint.note}</p>
        <div className="mt-3 space-y-2">
          {syn.blueprint.layers.map((L) => {
            const p = prinById[L.principle];
            return (
              <div key={L.n} className="rounded-lg border p-3" style={{ borderColor: "var(--line)" }}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold" style={{ background: "#3b82f620", color: "#3b82f6" }}>{L.n}</span>
                  <b className="text-sm">{L.layer}</b>
                  <span className="arabic mut text-sm" style={{ fontSize: "0.95rem" }}>{L.quranic}</span>
                </div>
                <p className="mt-1.5 text-sm">{L.reading}</p>
                <div className="mut mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px]">
                  {p && <a href={`#p-${p.id}`} className="rounded px-1.5 py-0.5" style={{ background: "var(--bg-soft)", color: "#3b82f6" }}>prinsip: {p.title}</a>}
                  {L.refs.map((r) => <span key={r} className="rounded px-1.5 py-0.5" style={{ border: "1px solid var(--green)", color: "var(--green)" }}>📖 {r}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FRAMEWORKS — struktur besar (Pohon Din, Aql-Qalb, Naqli-Aqli) */}
      {(syn.frameworks ?? []).length > 0 && (
        <>
          <h2 className="mt-8 text-lg font-semibold">🌳 Kerangka Besar</h2>
          <p className="mut mt-1 text-xs">Struktur ajaran (ber-basis sumber) dibaca sebagai arsitektur — jembatan antara ilmu keislaman dan rekayasa.</p>
          <div className="mt-3 space-y-4">
            {(syn.frameworks ?? []).map((f) => (
              <div key={f.id} className="card p-4">
                <b className="text-sm gold">{f.title}</b>
                <div className="mut mt-1 text-[11px]">Basis: {f.basis}</div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {f.layers.map((L, i) => (
                    <div key={L.name} className="rounded-lg border p-3" style={{ borderColor: "var(--line)" }}>
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: "#3b82f620", color: "#3b82f6" }}>{i + 1}</span>
                        <b className="text-xs">{L.name}</b>
                      </div>
                      <p className="mut mt-1 text-[11px]">{L.concept}</p>
                      <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: "#3b82f6" }}>{L.engineering}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed">{f.reading}</p>
                <div className="mut mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="uppercase tracking-wide">Kajian terkait:</span>
                  {f.refs.map((e) => (
                    <Link key={e.id} href={`/lab/${e.id}`} title={e.note} className="rounded px-1.5 py-0.5 hover:opacity-80" style={{ border: "1px solid var(--green)", color: "var(--green)" }}>📖 {e.ref} →</Link>
                  ))}
                </div>
                {f.candidates && <div className="mut mt-1.5 text-[10px] italic">→ {f.candidates}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {/* CLUSTER FILTER */}
      <h2 className="mt-8 text-lg font-semibold">Prinsip berulang ({syn.principles.length})</h2>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button onClick={() => setActive(null)} className="rounded-full border px-2.5 py-1 text-xs"
          style={{ borderColor: active === null ? "#3b82f6" : "var(--line)", color: active === null ? "#3b82f6" : "var(--mut)" }}>
          Semua ({syn.principles.length})
        </button>
        {syn.clusters.map((c) => (
          <button key={c.key} onClick={() => setActive(active === c.key ? null : c.key)} title={c.desc}
            className="rounded-full border px-2.5 py-1 text-xs"
            style={{ borderColor: active === c.key ? "#3b82f6" : "var(--line)", color: active === c.key ? "#3b82f6" : "var(--mut)" }}>
            {c.icon} {c.title.replace(/^Inti: /, "")} ({count(c.key)})
          </button>
        ))}
      </div>

      {/* PRINCIPLES */}
      <div className="mt-4 space-y-3">
        {shown.map((p) => (
          <div key={p.id} id={`p-${p.id}`} className="card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm">{cl[p.cluster]?.icon}</span>
              <b className="text-sm gold">{p.title}</b>
              <span className="mut rounded px-1.5 py-0.5 text-[10px]" style={{ border: "1px solid var(--line)" }}>{cl[p.cluster]?.title.replace(/^Inti: /, "")}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed">{p.statement}</p>
            <div className="mt-2 rounded-md p-2.5 text-sm" style={{ background: "#3b82f610" }}>
              <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#3b82f6" }}>Implikasi rekayasa</span>
              <p className="mt-0.5">{p.implication}</p>
            </div>
            <div className="mut mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="uppercase tracking-wide">Bukti:</span>
              {p.evidence.map((e) => (
                <Link key={e.id} href={`/lab/${e.id}`} title={e.note} className="rounded px-1.5 py-0.5 hover:opacity-80" style={{ border: "1px solid var(--green)", color: "var(--green)" }}>📖 {e.ref} →</Link>
              ))}
            </div>
            {p.note_single && <div className="mut mt-1.5 text-[10px] italic">⚠ {p.note_single}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
