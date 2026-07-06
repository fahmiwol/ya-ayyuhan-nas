"use client";

import Link from "next/link";
import { useState } from "react";
import type { DoaCategory, Doa } from "@/lib/doa";

function gradeColor(g?: string): string {
  if (!g) return "var(--mut)";
  const s = g.toLowerCase();
  if (s.includes("sahih") || s.includes("shahih")) return "var(--green)";
  if (s.includes("hasan")) return "var(--gold)";
  if (s.includes("da")) return "#e0664f";
  return "var(--mut)";
}

export function DoaBrowser({ categories }: { categories: DoaCategory[] }) {
  const [sel, setSel] = useState<Doa | null>(null);
  const open = !!sel;

  return (
    <>
      {categories.map((cat) => (
        <section key={cat.key} className="mt-8">
          <h2 className="text-lg font-semibold">{cat.title}</h2>
          {cat.note && <p className="mut mt-1 text-xs">{cat.note}</p>}
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {cat.duas.map((doa, i) => (
              <button key={i} onClick={() => setSel(doa)} className="card p-4 text-left transition hover:opacity-90">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{doa.title}</span>
                  {doa.grade && <span className="rounded px-1.5 py-0.5 text-[10px]" style={{ border: `1px solid ${gradeColor(doa.grade)}`, color: gradeColor(doa.grade) }}>{doa.grade}</span>}
                </div>
                <div className="mut mt-1 text-xs">{doa.occasion}{doa.ref ? ` · ${doa.ref}` : ""}</div>
                <div className="mut mt-1 text-xs opacity-70">Klik untuk detail →</div>
              </button>
            ))}
          </div>
        </section>
      ))}

      {/* Slider detail */}
      <div className={`id-scrim ${open ? "open" : ""}`} onClick={() => setSel(null)} />
      <aside className={`id-panel card ${open ? "open" : ""}`} aria-hidden={!open}>
        {sel && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-4" style={{ borderColor: "var(--line)" }}>
              <div>
                <div className="mut text-xs">Doa · {sel.occasion}</div>
                <h3 className="font-semibold">{sel.title}</h3>
              </div>
              <button onClick={() => setSel(null)} className="mut text-lg" aria-label="Tutup">✕</button>
            </div>

            <div className="flex-1 overflow-auto p-4 text-sm">
              {sel.text_ar && <p className="arabic mb-2" style={{ fontSize: "1.9rem", lineHeight: 2, textAlign: "right" }}>{sel.text_ar}</p>}
              {sel.translit && <p className="mut mb-1 italic">{sel.translit}</p>}
              <p className="leading-relaxed">{sel.meaning}</p>
              {sel.grade && <div className="mt-2"><span className="rounded px-2 py-0.5 text-[11px]" style={{ border: `1px solid ${gradeColor(sel.grade)}`, color: gradeColor(sel.grade) }}>{sel.grade}</span></div>}

              {sel.detail?.penjelasan && (
                <div className="mt-5"><div className="mut mb-1 text-xs uppercase tracking-wide">Penjelasan</div><p className="leading-relaxed">{sel.detail.penjelasan}</p></div>
              )}
              {sel.detail?.riwayat && (
                <div className="mt-4"><div className="mut mb-1 text-xs uppercase tracking-wide">Riwayat / kisah di baliknya</div><p className="leading-relaxed">{sel.detail.riwayat}</p></div>
              )}
              {(sel.detail?.sanad || sel.detail?.sumber || sel.source) && (
                <div className="mt-4 rounded-lg border p-3" style={{ borderColor: "var(--line)" }}>
                  <div className="mut mb-1 text-xs uppercase tracking-wide">Perawi &amp; sumber (sanad)</div>
                  <p className="text-xs leading-relaxed">📎 {sel.detail?.sanad || sel.detail?.sumber || sel.source}</p>
                </div>
              )}
              {sel.href && sel.ref && (
                <Link href={sel.href} className="green mt-4 inline-block text-xs">📖 Buka ayat {sel.ref} →</Link>
              )}
            </div>

            <div className="border-t p-3 text-center text-[11px] mut" style={{ borderColor: "var(--line)" }}>
              Riwayat &amp; sanad diverifikasi bertahap (eval-gate ala isnad).
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
