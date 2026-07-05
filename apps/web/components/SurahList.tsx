"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SurahSummary } from "@/lib/types";
import { useT } from "@/lib/i18n";

export function SurahList({ surahs }: { surahs: SurahSummary[] }) {
  const { t } = useT();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return surahs;
    return surahs.filter(
      (s) =>
        String(s.number) === t ||
        s.name_latin.toLowerCase().includes(t) ||
        (s.name_en ?? "").toLowerCase().includes(t) ||
        s.name_ar.includes(q.trim())
    );
  }, [q, surahs]);

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("search.surah")}
        className="mb-5 w-full rounded-xl border px-4 py-3 outline-none"
        style={{ background: "var(--panel)", borderColor: "var(--line)", color: "var(--txt)" }}
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <li key={s.number}>
            <Link
              href={`/surah/${s.number}`}
              className="card flex items-center gap-3 p-3 transition hover:opacity-90"
              style={{ display: "flex" }}
            >
              <span
                className="grid h-10 w-10 flex-none place-items-center rounded-lg text-sm font-semibold"
                style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}
              >
                {s.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{s.name_latin}</span>
                <span className="mut block text-xs">
                  {s.revelation_place === "makkah" ? "Makkiyah" : "Madaniyah"} · {s.ayah_count} ayat
                </span>
              </span>
              <span className="arabic-title text-2xl gold" style={{ fontSize: "1.6rem" }}>
                {s.name_ar}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p className="mut mt-8 text-center">Tidak ada surah cocok "{q}".</p>}
    </div>
  );
}
