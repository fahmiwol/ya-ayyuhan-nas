"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import type { HadithCollection } from "@/lib/types";

function gradeColor(g: string): string {
  const s = g.toLowerCase();
  if (s.includes("sahih") || s.includes("shahih")) return "var(--green)";
  if (s.includes("hasan")) return "var(--gold)";
  if (s.includes("da") && (s.includes("if") || s.includes("eef") || s.includes("'if"))) return "#e0664f";
  return "var(--mut)";
}

// pilih terjemahan sesuai locale toggle; utamakan manusia, lalu mesin (bertanda), lalu bahasa lain
function pickTr(tr: { en: string | null; id: string | null; id_auto?: string | null }, locale: string): { text: string | null; lang: string | null; mt: boolean } {
  const order = locale === "en" ? ["en", "id", "id_auto"] : ["id", "id_auto", "en"];
  for (const l of order) {
    const t = (tr as Record<string, string | null | undefined>)[l];
    if (t) return { text: t, lang: l === "id_auto" ? "id" : l, mt: l === "id_auto" };
  }
  return { text: null, lang: null, mt: false };
}

export function HadithReader({ c }: { c: HadithCollection }) {
  const { locale } = useT();
  const wantLang = locale === "en" ? "en" : "id";

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="card mb-5 p-5 text-center">
        <div className="arabic-title gold" style={{ fontSize: "1.8rem" }}>{c.name}</div>
        <div className="mt-1 font-semibold">{c.name_id}</div>
        <div className="mut mt-1 text-xs">
          {c.partial ? `${c.count} / ${c.total}` : c.count} hadits{c.graded > 0 && <> · {c.graded} ber-grade</>} · {c.langs.join("/")}
        </div>
        {c.partial && <div className="mut mt-2 text-[11px]">Menampilkan sebagian ({c.count}/{c.total}) — koleksi penuh menyusul.</div>}
      </div>

      <ol className="space-y-4">
        {c.hadiths.map((h) => {
          const { text, lang, mt } = pickTr(h.tr, locale);
          return (
            <li key={h.number} className="card p-4">
              <div className="mut mb-2 flex items-center gap-2 text-xs">
                <span className="grid place-items-center rounded-full" style={{ minWidth: 26, height: 26, border: "1px solid var(--gold)", color: "var(--gold)" }}>{h.number}</span>
                {h.grades.length > 0 ? h.grades.slice(0, 2).map((g, i) => (
                  <span key={i} className="rounded px-2 py-0.5 text-[11px]" style={{ border: `1px solid ${gradeColor(g.grade)}`, color: gradeColor(g.grade) }} title={g.by ?? undefined}>{g.grade}{g.by ? ` · ${g.by}` : ""}</span>
                )) : <span className="mut text-[11px]">derajat: —</span>}
              </div>
              <p className="arabic" style={{ fontSize: "1.5rem", lineHeight: 2 }}>{h.arabic}</p>
              {text && (
                <div className="mt-3">
                  <p className="mut text-[0.95rem] leading-relaxed">{text}</p>
                  {mt && <span className="mt-1 inline-block rounded px-1.5 py-0.5 text-[10px]" style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}>🌐 terjemahan mesin — belum ditinjau ahli</span>}
                  {!mt && lang && lang !== wantLang && <span className="ml-2 rounded px-1 py-0.5 text-[10px] uppercase" style={{ border: "1px solid var(--line)" }}>{lang}</span>}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="card mt-6 p-4 text-xs mut">Sumber: <b>{c.provenance.name}</b> · {c.provenance.license} · <a href={c.provenance.url} target="_blank" rel="noreferrer" className="gold">tautan</a>.</div>
      <div className="mt-6 text-center"><Link href="/hadits" className="mut text-sm">← Semua koleksi hadits</Link></div>
    </div>
  );
}
