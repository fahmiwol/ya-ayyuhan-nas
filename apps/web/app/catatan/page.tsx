"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useNotes } from "@/lib/notes";
import { useT } from "@/lib/i18n";
import type { NoteType, UserNote } from "@/lib/types";

const TYPE_LABEL: Record<NoteType, string> = {
  tafsir: "Tafsir", asbab: "Asbabun Nuzul", tajwid: "Tajwid", kosakata: "Kosakata",
  hadith: "Hadits", refleksi: "Refleksi", lainnya: "Lainnya",
};

export default function CatatanPage() {
  const { notes, loaded, remove } = useNotes();
  const { t } = useT();
  const [filter, setFilter] = useState<NoteType | "all">("all");

  const groups = useMemo(() => {
    const g = new Map<NoteType, UserNote[]>();
    for (const n of notes) {
      if (filter !== "all" && n.type !== filter) continue;
      if (!g.has(n.type)) g.set(n.type, []);
      g.get(n.type)!.push(n);
    }
    return g;
  }, [notes, filter]);

  const types = Array.from(new Set(notes.map((n) => n.type)));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold gold">{t("catatan.title")}</h1>
      <p className="mut mt-2 text-sm">{t("catatan.subtitle")}</p>

      {!loaded ? (
        <p className="mut mt-8">Memuat…</p>
      ) : notes.length === 0 ? (
        <div className="card mt-6 p-8 text-center">
          <p className="mut">Belum ada catatan.</p>
          <p className="mut mt-1 text-sm">Buka sebuah surah → mode <b>🖊️ Catat</b> → klik ayat untuk menyorot &amp; menulis catatan.</p>
          <Link href="/" className="gold mt-3 inline-block text-sm">→ Pilih surah</Link>
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <button onClick={() => setFilter("all")} className="rounded-full border px-3 py-1" style={{ borderColor: filter === "all" ? "var(--gold)" : "var(--line)", color: filter === "all" ? "var(--gold)" : "var(--mut)" }}>Semua ({notes.length})</button>
            {types.map((t) => (
              <button key={t} onClick={() => setFilter(t)} className="rounded-full border px-3 py-1" style={{ borderColor: filter === t ? "var(--gold)" : "var(--line)", color: filter === t ? "var(--gold)" : "var(--mut)" }}>
                {TYPE_LABEL[t]} ({notes.filter((n) => n.type === t).length})
              </button>
            ))}
          </div>

          {Array.from(groups.entries()).map(([type, list]) => (
            <section key={type} className="mt-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide gold">{TYPE_LABEL[type]}</h2>
              <div className="space-y-3">
                {list.map((n) => (
                  <div key={n.id} className="card p-4" style={{ borderLeft: `4px solid ${n.color}` }}>
                    <div className="flex items-center gap-2 text-xs">
                      <Link href={`/surah/${n.surah}#ayah-${n.ayah}`} className="rounded px-1.5 py-0.5" style={{ background: "var(--bg-soft)", color: "var(--gold)" }}>
                        {n.surah}:{n.ayah}
                      </Link>
                      <span className="mut">{new Date(n.updatedAt).toLocaleDateString("id-ID")}</span>
                      <button onClick={() => remove(n.id)} className="ml-auto" style={{ color: "#e0664f" }}>hapus</button>
                    </div>
                    <p className="mt-2">{n.note}</p>
                    {n.source ? (
                      <div className="mut mt-2 text-xs">
                        📎 <b>{n.source.title}</b>{n.source.author ? ` — ${n.source.author}` : ""}
                        {n.source.url && <> · <a href={n.source.url} target="_blank" rel="noreferrer" className="gold">tautan</a></>}
                      </div>
                    ) : (
                      <div className="mut mt-2 text-xs">📎 refleksi pribadi (tanpa sumber eksternal)</div>
                    )}
                    <div className="mut mt-1 break-all font-mono text-[10px]">id ayat: {n.ayahHash.slice(0, 18)}…</div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
