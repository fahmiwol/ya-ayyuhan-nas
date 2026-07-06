"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useSettings } from "@/lib/settings";
import { useNotes } from "@/lib/notes";
import { useT } from "@/lib/i18n";
import { RECITERS, getReciter, ayahAudioUrl } from "@/lib/reciters";
import type { Surah, Ayah, Word } from "@/lib/types";
import { ModeDock } from "./ModeDock";
import { IdentityPanel, type IdentityTarget } from "./IdentityPanel";
import { NotePanel, type NoteTarget } from "./NotePanel";

const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

export function Reader({ surah }: { surah: Surah }) {
  const { showTranslation, arabicSize, wordByWord, reciter, mode, set } = useSettings();
  const { forAyah } = useNotes();
  const { t, locale } = useT();
  const transLang: "id" | "en" = locale === "en" ? "en" : "id"; // terjemahan ikut toggle bahasa global
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const [continuous, setContinuous] = useState(false);
  const [target, setTarget] = useState<IdentityTarget | null>(null);
  const [noteTarget, setNoteTarget] = useState<NoteTarget | null>(null);

  const rc = getReciter(reciter);
  const openIdentity = (a: Ayah, word?: Word) => { setNoteTarget(null); setTarget({ surah: surah.number, ayah: a, word }); };
  const openNote = (a: Ayah) => { setTarget(null); setNoteTarget({ surah: surah.number, ayah: a }); };

  function playAyah(n: number) {
    const el = audioRef.current;
    if (!el) return;
    el.src = ayahAudioUrl(rc, surah.number, n);
    el.play().then(() => setPlaying(n)).catch(() => setPlaying(null));
    document.getElementById(`ayah-${n}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function stop() { audioRef.current?.pause(); setPlaying(null); }
  function onEnded() {
    if (!continuous || playing == null) { setPlaying(null); return; }
    const next = playing + 1;
    if (next <= surah.ayah_count) playAyah(next); else setPlaying(null);
  }

  // Aksi klik bergantung MODE aktif.
  function onAyah(a: Ayah) {
    if (mode === "identitas") openIdentity(a);
    else if (mode === "tilawah") (playing === a.ayah ? stop() : playAyah(a.ayah));
    else if (mode === "catat") openNote(a);
  }
  function onWord(a: Ayah, w: Word, e: React.MouseEvent) {
    if (mode === "baca") return;
    e.stopPropagation();
    if (mode === "identitas") openIdentity(a, w);
    else if (mode === "tilawah") (playing === a.ayah ? stop() : playAyah(a.ayah));
    else if (mode === "catat") openNote(a);
  }

  const modeHint = t(`hint.${mode}`);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <audio ref={audioRef} onEnded={onEnded} preload="none" />
      <ModeDock />

      {/* Header surah */}
      <div className="card mb-3 p-5 text-center">
        <div className="arabic-title gold" style={{ fontSize: "2.4rem" }}>{surah.name_ar}</div>
        <div className="mt-1 font-semibold">{surah.name_latin}{surah.name_en ? ` — ${surah.name_en}` : ""}</div>
        <div className="mut mt-1 text-xs">
          Surah ke-{surah.number} · {surah.revelation_place === "makkah" ? "Makkiyah" : "Madaniyah"} · {surah.ayah_count} ayat
        </div>
      </div>

      <p className="mut mb-3 text-center text-xs">{modeHint}</p>

      {/* Kontrol */}
      <div className="card mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 p-3 text-sm">
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={showTranslation} onChange={(e) => set({ showTranslation: e.target.checked })} /> {t("reader.translation")} <span className="mut text-[10px]">({transLang})</span>
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={wordByWord} onChange={(e) => set({ wordByWord: e.target.checked })} /> {t("reader.perWord")}
        </label>
        <span className="mut">🎙️</span>
        <select value={reciter} onChange={(e) => set({ reciter: e.target.value })}
          className="rounded-md border px-2 py-1" style={{ background: "var(--panel)", borderColor: "var(--line)", color: "var(--txt)" }}>
          {RECITERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={continuous} onChange={(e) => setContinuous(e.target.checked)} /> {t("reader.continuous")}
        </label>
        <button onClick={() => (playing ? stop() : playAyah(1))} className="rounded-md border px-2 py-1" style={{ borderColor: "var(--green)", color: "var(--green)" }}>
          {playing ? `⏹ ${t("reader.stop")}` : `▶ ${t("reader.playSurah")}`}
        </button>
        <div className="mut ml-auto flex items-center gap-2">
          <span>Aa</span>
          <button onClick={() => set({ arabicSize: Math.max(1.2, +(arabicSize - 0.2).toFixed(1)) })} className="rounded-md border px-2" style={{ borderColor: "var(--line)" }}>−</button>
          <button onClick={() => set({ arabicSize: Math.min(3.4, +(arabicSize + 0.2).toFixed(1)) })} className="rounded-md border px-2" style={{ borderColor: "var(--line)" }}>+</button>
        </div>
      </div>

      {surah.bismillah_pre && (
        <div className="arabic mb-6" style={{ textAlign: "center", fontSize: "calc(var(--arabic-size) * 1.05)" }}>{BISMILLAH}</div>
      )}

      {/* Ayat — permukaan reader dgn kursor per-mode */}
      <ol className={`reader-surface mode-${mode} space-y-1`}>
        {surah.ayahs.map((a) => {
          const ns = forAyah(surah.number, a.ayah);
          const hl = ns[0]?.color;
          const bg = playing === a.ayah ? "rgba(67,180,131,.10)" : hl ? `${hl}22` : undefined;
          return (
          <li key={a.global} id={`ayah-${a.ayah}`} className="border-b py-5" style={{ borderColor: "var(--line)", background: bg, borderLeft: hl ? `4px solid ${hl}` : undefined, paddingLeft: hl ? 10 : undefined, borderRadius: hl ? 8 : undefined }}>
            <div className="mut mb-2 flex items-center gap-3 text-xs">
              <span className="grid place-items-center rounded-full" style={{ minWidth: 26, height: 26, border: "1px solid var(--green)", color: "var(--green)" }}>{a.ayah}</span>
              <button onClick={() => (playing === a.ayah ? stop() : playAyah(a.ayah))} title="Putar ayat" className="touch-tgt">{playing === a.ayah ? "⏸" : "▶"}</button>
              <button onClick={() => openIdentity(a)} title="Identitas" className="touch-tgt">🔗</button>
              <button onClick={() => openNote(a)} title="Catat (stabilo)" className="touch-tgt">🖊️</button>
              {a.ann > 0 && <button onClick={() => openIdentity(a)} title="Anotasi" className="touch-tgt">📝 {a.ann}</button>}
              {ns.length > 0 && <button onClick={() => openNote(a)} title="Catatanku" className="touch-tgt">📓 {ns.length}</button>}
              <span className="ml-auto opacity-60">juz {a.juz}{a.sajdah ? " · ۩" : ""}</span>
            </div>

            {wordByWord && a.words.length > 0 ? (
              <div className="arabic ayah-tap flex flex-wrap justify-end gap-x-4 gap-y-3" style={{ direction: "rtl" }} onClick={() => onAyah(a)}>
                {a.words.map((w) => (
                  <span key={w.p} className="word-tap inline-flex flex-col items-center text-center" onClick={(e) => onWord(a, w, e)}>
                    <span style={{ fontSize: "var(--arabic-size)", lineHeight: 1.6 }}>{w.ar}</span>
                    {w.tl && <span className="mut" style={{ fontSize: ".7rem", direction: "ltr" }}>{w.tl}</span>}
                    {w.tr && <span className="gold" style={{ fontSize: ".72rem", direction: "ltr" }}>{w.tr}</span>}
                  </span>
                ))}
              </div>
            ) : (
              <p className="arabic ayah-tap" onClick={() => onAyah(a)}>{a.arabic}</p>
            )}

            {showTranslation && a.tr[transLang] && (
              <p className="mut mt-3 text-[0.95rem] leading-relaxed"><span className="gold mr-1">{a.ayah}.</span>{a.tr[transLang]}</p>
            )}
          </li>
        ); })}
      </ol>

      <div className="mt-8 flex items-center justify-between text-sm">
        {surah.number > 1 ? <Link href={`/surah/${surah.number - 1}`} className="rounded-lg border px-4 py-2" style={{ borderColor: "var(--line)" }}>← Surah {surah.number - 1}</Link> : <span />}
        <Link href="/" className="mut">{t("reader.surahList")}</Link>
        {surah.number < 114 ? <Link href={`/surah/${surah.number + 1}`} className="rounded-lg border px-4 py-2" style={{ borderColor: "var(--line)" }}>Surah {surah.number + 1} →</Link> : <span />}
      </div>

      <IdentityPanel target={target} onClose={() => setTarget(null)} />
      <NotePanel target={noteTarget} onClose={() => setNoteTarget(null)} />
    </div>
  );
}
