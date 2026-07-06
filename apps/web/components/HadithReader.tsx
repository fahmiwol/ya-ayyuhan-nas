"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import type { HadithCollection } from "@/lib/types";
import { assess } from "@/lib/evalgate";
import { TrustBadge } from "./TrustBadge";

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
          const a = assess({
            kind: "hadith",
            grades: h.grades,
            hasProvenance: true, // koleksi + nomor hadits tercantum
            corroboration: h.grades.length, // proksi: jumlah penilaian/rujukan
            machine: mt,
            source: { source: c.provenance.name, license: c.provenance.license, url: c.provenance.url, note: c.provenance.note },
          });
          return (
            <li key={h.number} className="card p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="grid place-items-center rounded-full" style={{ minWidth: 26, height: 26, border: "1px solid var(--gold)", color: "var(--gold)" }}>{h.number}</span>
                <TrustBadge a={a} />
              </div>
              <p className="arabic" style={{ fontSize: "1.5rem", lineHeight: 2 }}>{h.arabic}</p>
              {text && (
                <div className="mt-3">
                  <p className="mut text-[0.95rem] leading-relaxed">{text}</p>
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
