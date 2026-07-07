"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SurahSummary } from "@/lib/types";
import { useT } from "@/lib/i18n";

interface AyahHit { surah: number; ayah: number; surahName: string; snippet: string }

export function SurahList({ surahs }: { surahs: SurahSummary[] }) {
  const { t, locale } = useT();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return surahs;
    return surahs.filter(
      (x) =>
        String(x.number) === s ||
        x.name_latin.toLowerCase().includes(s) ||
        (x.name_en ?? "").toLowerCase().includes(s) ||
        x.name_ar.includes(q.trim())
    );
  }, [q, surahs]);

  // Pencarian ayat via terjemahan (API, debounced). Aktif bila query = kata (bukan angka murni, >=3 char).
  const [hits, setHits] = useState<AyahHit[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const lang = locale === "en" ? "en" : "id";
  const term = q.trim();
  const wantAyah = term.length >= 3 && !/^\d+$/.test(term);

  useEffect(() => {
    if (!wantAyah) { setHits(null); setTotal(0); return; }
    setLoading(true);
    const ctrl = new AbortController();
    const id = setTimeout(() => {
      fetch(`/api/v1/search/ayah?q=${encodeURIComponent(term)}&lang=${lang}&limit=40`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => { setHits(d.results ?? []); setTotal(d.count ?? 0); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 280);
    return () => { clearTimeout(id); ctrl.abort(); };
  }, [term, lang, wantAyah]);

  const hl = (text: string) => {
    const i = text.toLowerCase().indexOf(term.toLowerCase());
    if (i < 0) return text;
    return (<>{text.slice(0, i)}<mark style={{ background: "var(--gold)", color: "#1a1a1a", padding: "0 2px", borderRadius: 3 }}>{text.slice(i, i + term.length)}</mark>{text.slice(i + term.length)}</>);
  };

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("search.any")}
        className="mb-5 w-full rounded-xl border px-4 py-3 outline-none"
        style={{ background: "var(--panel)", borderColor: "var(--line)", color: "var(--txt)" }}
      />

      {/* Hasil pencarian AYAT (berdasarkan terjemahan) */}
      {wantAyah && (
        <div className="mb-6">
          <div className="mut mb-2 text-xs uppercase tracking-wide">
            {t("search.ayahResults")} · {loading ? "…" : `${total}`} {t("search.ayahFound")} "{term}"
            {total > (hits?.length ?? 0) && <span> ({t("search.showingTop")} {hits?.length})</span>}
          </div>
          {hits && hits.length > 0 && (
            <ul className="grid grid-cols-1 gap-2">
              {hits.map((h) => (
                <li key={`${h.surah}:${h.ayah}`}>
                  <Link href={`/surah/${h.surah}#ayah-${h.ayah}`} className="card block p-3 transition hover:opacity-90">
                    <div className="flex items-baseline gap-2">
                      <span className="rounded px-1.5 py-0.5 text-[10px]" style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}>{h.surahName} {h.surah}:{h.ayah}</span>
                    </div>
                    <p className="mut mt-1 text-sm leading-relaxed">{hl(h.snippet)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {hits && hits.length === 0 && !loading && <p className="mut text-sm">{t("search.ayahNone")} "{term}".</p>}
        </div>
      )}

      {/* Daftar surah */}
      {(filtered.length > 0 || !wantAyah) && (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <li key={s.number}>
              <Link href={`/surah/${s.number}`} className="card flex items-center gap-3 p-3 transition hover:opacity-90" style={{ display: "flex" }}>
                <span className="grid h-10 w-10 flex-none place-items-center rounded-lg text-sm font-semibold" style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}>{s.number}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{s.name_latin}</span>
                  <span className="mut block text-xs">{s.revelation_place === "makkah" ? "Makkiyah" : "Madaniyah"} · {s.ayah_count} ayat</span>
                </span>
                <span className="arabic-title text-2xl gold" style={{ fontSize: "1.6rem" }}>{s.name_ar}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {filtered.length === 0 && !wantAyah && <p className="mut mt-8 text-center">Tidak ada surah cocok "{q}".</p>}
    </div>
  );
}
