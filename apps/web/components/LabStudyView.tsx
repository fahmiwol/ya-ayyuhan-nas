"use client";
// Lab Tadabbur — tampilan kajian interaktif.
// Lapis-1: ayat kanonik (dari mushaf ber-Merkle) + makna BERSUMBER.
// Lapis-2: matriks lensa interpretasi rekayasa (filterable) — tier "interpretasi — bukan tafsir".
import Link from "next/link";
import { useMemo, useState } from "react";
import type { LabStudy } from "@/lib/lab";
import { assess } from "@/lib/evalgate";
import { TrustBadge } from "./TrustBadge";
import { transliterateArabic } from "@/lib/translit";

export interface StudyAyah { ayah: number; arabic: string; tr_id: string | null; hash: string }
interface LensMeta { key: string; title: string; icon: string; desc: string }

export function LabStudyView({ study, ayat, lenses, surahName, isArchived }: { study: LabStudy; ayat: StudyAyah[]; lenses: LensMeta[]; surahName: string; isArchived?: boolean }) {
  const [activeLens, setActiveLens] = useState<string | null>(null); // null = semua
  const [showTranslit, setShowTranslit] = useState(false);

  const lensMeta = useMemo(() => Object.fromEntries(lenses.map((l) => [l.key, l])), [lenses]);
  const shown = activeLens ? study.lenses.filter((l) => l.lens === activeLens) : study.lenses;

  const labTrust = assess({
    kind: "lab",
    hasProvenance: true,
    source: { source: study.sourced_meaning.sources.join(" · "), note: "Interpretasi rekayasa Lab Tadabbur — bukan tafsir" },
  });

  return (
    <div>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold">{study.title}</h1>
        <TrustBadge a={labTrust} refId={`lab:${study.id}`} />
        <span className="mut rounded-full border px-2 py-0.5 text-[10px]" style={{ borderColor: "var(--line)" }} title="versi tadabbur — setiap interpretasi direkam & bisa di-tadabburi ulang">📼 v{study.version}</span>
        {(() => {
          const v = study.review?.verdict ?? "pending";
          const M: Record<string, { l: string; c: string }> = {
            endorsed: { l: "✅ Disahkan peninjau", c: "var(--green)" },
            revise: { l: "✏️ Perlu perbaikan", c: "#d97706" },
            rejected: { l: "⛔ Ditolak peninjau", c: "#dc2626" },
            pending: { l: "🕵️ Menunggu tinjauan ahli", c: "var(--mut)" },
          };
          const m = M[v];
          return <span className="rounded-full border px-2 py-0.5 text-[10px]" style={{ borderColor: m.c, color: m.c }}
            title={study.review ? `${study.review.by} (${study.review.role}) · ${study.review.date}${study.review.note ? " — " + study.review.note : ""}` : "Interpretasi rekayasa; belum ditinjau peninjau berkelas (ulama/mufassir/sejarawan/hafizh)"}>{m.l}</span>;
        })()}
      </div>
      {study.review && study.review.verdict !== "pending" && (
        <div className="mut mt-2 rounded-lg border p-2 text-xs" style={{ borderColor: "var(--line)" }}>
          <b>Tinjauan:</b> {study.review.by} — {study.review.role}{study.review.credential ? ` (${study.review.credential})` : ""} · {study.review.date}
          {study.review.note && <div className="mt-1">{study.review.note}</div>}
        </div>
      )}
      {/* Badge status 3-tingkat — pisahkan status teks / makna / analogi (transparansi) */}
      <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
        <span className="rounded border px-2 py-0.5" style={{ borderColor: "var(--green)", color: "var(--green)" }} title="Teks Arab ditarik dari mushaf kanonik ber-Merkle">📖 Teks Qur&apos;an: <b>Terverifikasi</b></span>
        <span className="rounded border px-2 py-0.5" style={{ borderColor: "var(--gold)", color: "var(--gold)" }} title="Makna diringkas dari tafsir bersumber (Kemenag/Jalalain)">📚 Makna/Tafsir: <b>Bersumber</b></span>
        <span className="rounded border px-2 py-0.5" style={{ borderColor: "#3b82f6", color: "#3b82f6" }} title="Pembacaan rekayasa = hipotesis pola untuk diuji/ditinjau — bukan tafsir/dalil">🧪 Analogi Rekayasa: <b>{study.review?.verdict === "endorsed" ? "Sudah Ditinjau" : "Draft — Menunggu Reviewer"}</b></span>
      </div>
      {study.subtitle && <p className="mut mt-2 text-sm">{study.subtitle}</p>}

      {/* LAPIS 1 — Ayat kanonik + makna bersumber */}
      <div className="card mt-5 p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <b className="gold text-sm">Lapis 1 — Ayat & makna bersumber</b>
          <div className="flex items-center gap-2 text-xs">
            <button onClick={() => setShowTranslit((v) => !v)} className="rounded border px-2 py-0.5" style={{ borderColor: "var(--line)", color: showTranslit ? "var(--gold)" : "var(--mut)" }}>
              Aa cara baca
            </button>
            <Link href={`/surah/${study.ref.surah}#ayah-${study.ref.from}`} className="green">📖 Buka di mushaf →</Link>
          </div>
        </div>
        {ayat.map((a) => (
          <div key={a.ayah} className="border-t py-3 first:border-0" style={{ borderColor: "var(--line)" }}>
            <p className="arabic" dir="rtl" style={{ fontSize: "1.6rem", lineHeight: 2 }}>{a.arabic} <span className="mut text-sm">({study.ref.surah}:{a.ayah})</span></p>
            {showTranslit && <p className="mut mt-1 text-sm italic">{transliterateArabic(a.arabic)}</p>}
            {a.tr_id && <p className="mut mt-1 text-sm">{a.tr_id}</p>}
            <div className="mut mt-1 break-all font-mono text-[9px] opacity-60" title="SHA-256 ayat (identitas kriptografis — lihat halaman Integritas)">#{a.hash.slice(0, 24)}…</div>
          </div>
        ))}
        <div className="mt-3 rounded-md p-3 text-sm" style={{ background: "var(--bg-soft)" }}>
          <div className="mut mb-1 text-[10px] uppercase tracking-wide">Makna bersumber (ringkas)</div>
          <p className="leading-relaxed">{study.sourced_meaning.summary}</p>
          <div className="mut mt-2 text-[11px]">Sumber: {study.sourced_meaning.sources.join(" · ")} — makna lengkap: mode 🔍 Identitas → tab Tafsir.</div>
        </div>
      </div>

      {/* LAPIS 2 — Matriks lensa */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <b className="text-sm" style={{ color: "#3b82f6" }}>Lapis 2 — Interpretasi rekayasa 🧪</b>
          <span className="mut text-[11px]">(analogi struktural — bukan tafsir)</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button onClick={() => setActiveLens(null)} className="rounded-full border px-2.5 py-1 text-xs"
            style={{ borderColor: activeLens === null ? "#3b82f6" : "var(--line)", color: activeLens === null ? "#3b82f6" : "var(--mut)" }}>
            Semua ({study.lenses.length})
          </button>
          {study.lenses.map((l) => {
            const m = lensMeta[l.lens];
            return (
              <button key={l.lens} onClick={() => setActiveLens(activeLens === l.lens ? null : l.lens)}
                title={m?.desc} className="rounded-full border px-2.5 py-1 text-xs"
                style={{ borderColor: activeLens === l.lens ? "#3b82f6" : "var(--line)", color: activeLens === l.lens ? "#3b82f6" : "var(--mut)" }}>
                {m?.icon} {m?.title ?? l.lens}
              </button>
            );
          })}
        </div>
        <div className="mt-3 space-y-3">
          {shown.map((l) => {
            const m = lensMeta[l.lens];
            return (
              <div key={l.lens} className="card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <b className="text-sm">{m?.icon} {m?.title ?? l.lens}</b>
                  {l.analogy && <span className="rounded px-1.5 py-0.5 font-mono text-[10px]" style={{ background: "var(--bg-soft)", color: "#3b82f6" }}>{l.analogy}</span>}
                  {l.quranic_term && <span className="mut rounded px-1.5 py-0.5 text-[10px]" style={{ border: "1px solid var(--line)" }} title="istilah kognitif Qur'ani terkait (lihat taksonomi di halaman Lab)">☪ {l.quranic_term}</span>}
                </div>
                <p className="mt-2 text-sm leading-relaxed">{l.reading}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* QCA + inferensi */}
      {study.qca.length > 0 && (
        <div className="card mt-6 p-4">
          <b className="text-sm gold">Pemetaan QCA</b>
          <ul className="mt-2 space-y-1 text-sm">
            {study.qca.map((q) => (
              <li key={q.layer}><b>{q.layer}:</b> <span className="mut">{q.note}</span></li>
            ))}
          </ul>
        </div>
      )}
      <div className="card mt-4 p-4" style={{ borderColor: "#3b82f6" }}>
        <b className="text-sm" style={{ color: "#3b82f6" }}>Inferensi kajian</b>
        <p className="mt-2 text-sm leading-relaxed">{study.inference}</p>
      </div>

      {/* RIWAYAT TADABBUR — setiap interpretasi direkam; versi lama tetap terbaca */}
      <div className="card mt-6 p-4">
        <b className="text-sm gold">📼 Riwayat tadabbur</b>
        <p className="mut mt-1 text-xs">Interpretasi hidup: seiring waktu di-tadabburi ulang. Setiap versi direkam & tetap bisa dibaca — tak ada yang ditimpa diam-diam.</p>
        <ol className="mt-2 space-y-1.5 text-sm">
          {[...study.history].reverse().map((h) => (
            <li key={h.version} className="flex flex-wrap items-baseline gap-2">
              {h.version === study.version && !isArchived ? (
                <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: "#3b82f614", color: "#3b82f6" }}>v{h.version} · terkini</span>
              ) : (
                <Link href={`/lab/${study.id}?v=${h.version}`} className="rounded border px-1.5 py-0.5 text-[10px] underline" style={{ borderColor: "var(--line)" }}>v{h.version}</Link>
              )}
              <span className="mut text-xs">{h.date}</span>
              <span className="text-xs">{h.note}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mut mt-4 text-xs">
        {study.authors.join(" · ")} · {study.created} · Surah {surahName} · status: {study.status}.
        Masukan/koreksi reviewer → antrean tinjau (ref <code>lab:{study.id}</code>).
      </div>
    </div>
  );
}
