"use client";

import Link from "next/link";
import { useState } from "react";
import type { KisahCategory, Story } from "@/lib/kisah";

export function KisahBrowser({ categories }: { categories: KisahCategory[] }) {
  const [sel, setSel] = useState<Story | null>(null);
  const open = !!sel;

  return (
    <>
      {categories.map((cat) => (
        <section key={cat.key} className="mt-8">
          <h2 className="text-lg font-semibold gold">{cat.title}</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {cat.stories.map((s, i) => (
              <button key={i} onClick={() => setSel(s)} className="card p-4 text-left transition hover:opacity-90">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{s.title}</span>
                  <span className="mut rounded px-1.5 py-0.5 text-[10px] uppercase" style={{ background: "var(--bg-soft)" }}>{s.type}</span>
                </div>
                <p className="mut mt-1 line-clamp-2 text-sm">{s.narrative}</p>
                <div className="mut mt-1 text-xs opacity-70">Klik untuk baca →</div>
              </button>
            ))}
          </div>
        </section>
      ))}

      <div className={`id-scrim ${open ? "open" : ""}`} onClick={() => setSel(null)} />
      <aside className={`id-panel card ${open ? "open" : ""}`} aria-hidden={!open}>
        {sel && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-4" style={{ borderColor: "var(--line)" }}>
              <div>
                <div className="mut text-xs uppercase">{sel.type}</div>
                <h3 className="font-semibold">{sel.title}</h3>
              </div>
              <button onClick={() => setSel(null)} className="mut text-lg" aria-label="Tutup">✕</button>
            </div>
            <div className="flex-1 overflow-auto p-4 text-sm">
              <p className="leading-relaxed">{sel.narrative}</p>
              {sel.related.length > 0 && (
                <div className="mt-4">
                  <div className="mut mb-1 text-xs uppercase tracking-wide">Rujukan ayat</div>
                  <div className="flex flex-wrap gap-1.5">
                    {sel.related.map((r, i) => (
                      <Link key={i} href={r.href} className="rounded px-2 py-0.5 text-[11px]" style={{ border: "1px solid var(--green)", color: "var(--green)" }}>📖 {r.label}</Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 rounded-lg border p-3" style={{ borderColor: "var(--line)" }}>
                <div className="mut text-xs uppercase tracking-wide">Sumber</div>
                <p className="mt-1 text-xs">📎 {sel.source}{sel.grade ? ` · ${sel.grade}` : ""}</p>
              </div>
            </div>
            <div className="border-t p-3 text-center text-[11px] mut" style={{ borderColor: "var(--line)" }}>Ringkasan editorial — dilengkapi & ditinjau bertahap.</div>
          </div>
        )}
      </aside>
    </>
  );
}
