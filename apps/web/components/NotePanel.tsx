"use client";

import { useEffect, useState } from "react";
import { useNotes } from "@/lib/notes";
import { KNOWLEDGE_TYPES, type Ayah, type NoteType, type UserNote, type Annotation } from "@/lib/types";

export const HIGHLIGHT_COLORS = [
  { name: "Kuning", val: "#f4e06a" },
  { name: "Hijau", val: "#7ee0a3" },
  { name: "Biru", val: "#7ec8e0" },
  { name: "Merah muda", val: "#e58bb0" },
  { name: "Ungu", val: "#bd93e0" },
];
const TYPES: NoteType[] = ["tafsir", "asbab", "tajwid", "kosakata", "hadith", "refleksi", "lainnya"];

export interface NoteTarget { surah: number; ayah: Ayah }

const blank = (color: string) => ({ type: "refleksi" as NoteType, note: "", color, srcTitle: "", srcAuthor: "", srcUrl: "" });

export function NotePanel({ target, onClose }: { target: NoteTarget | null; onClose: () => void }) {
  const { forAyah, upsert, remove } = useNotes();
  const [form, setForm] = useState(blank(HIGHLIGHT_COLORS[0].val));
  const [editing, setEditing] = useState<string | null>(null);
  const [refs, setRefs] = useState<Annotation[]>([]);
  const [err, setErr] = useState("");

  const surah = target?.surah;
  const ayah = target?.ayah;
  const existing = surah && ayah ? forAyah(surah, ayah.ayah) : [];

  useEffect(() => {
    setForm(blank(HIGHLIGHT_COLORS[0].val)); setEditing(null); setErr(""); setRefs([]);
    if (!surah || !ayah) return;
    fetch(`/api/v1/annotations/${surah}/${ayah.ayah}`).then((r) => r.json()).then((j) => setRefs(j.annotations ?? [])).catch(() => {});
  }, [surah, ayah]);

  function loadForEdit(n: UserNote) {
    setEditing(n.id);
    setForm({ type: n.type, note: n.note, color: n.color, srcTitle: n.source?.title ?? "", srcAuthor: n.source?.author ?? "", srcUrl: n.source?.url ?? "" });
  }

  function save() {
    if (!surah || !ayah) return;
    setErr("");
    if (!form.note.trim()) { setErr("Catatan tidak boleh kosong."); return; }
    const needSource = KNOWLEDGE_TYPES.includes(form.type);
    if (needSource && !form.srcTitle.trim()) { setErr(`Jenis "${form.type}" WAJIB sumber (judul minimal) — biar jelas & akurat.`); return; }
    upsert({
      id: editing ?? undefined,
      surah, ayah: ayah.ayah, color: form.color, type: form.type, note: form.note.trim(),
      source: form.srcTitle.trim() ? { title: form.srcTitle.trim(), author: form.srcAuthor.trim() || undefined, url: form.srcUrl.trim() || undefined } : null,
      ayahHash: ayah.hash,
    });
    setForm(blank(form.color)); setEditing(null);
  }

  const open = !!target;
  const needSource = KNOWLEDGE_TYPES.includes(form.type);

  return (
    <>
      <div className={`id-scrim ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`id-panel card ${open ? "open" : ""}`} aria-hidden={!open}>
        {ayah && surah && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-4" style={{ borderColor: "var(--line)" }}>
              <div>
                <div className="mut text-xs">Catatan pribadi (privat)</div>
                <h3 className="font-semibold">Ayat {surah}:{ayah.ayah}</h3>
              </div>
              <button onClick={onClose} className="mut text-lg" aria-label="Tutup">✕</button>
            </div>

            <div className="flex-1 overflow-auto p-4 text-sm">
              <div className="arabic mb-3" style={{ fontSize: "1.5rem", textAlign: "right" }}>{ayah.arabic}</div>

              {/* Sumber rujukan (biar semua sumber ada, jelas & akurat) */}
              <div className="mb-4 rounded-lg border p-2" style={{ borderColor: "var(--line)" }}>
                <div className="mut mb-1 text-[11px] uppercase tracking-wide">Sumber &amp; rujukan</div>
                <div className="mut break-all font-mono text-[10px]">identitas ayat: {ayah.hash.slice(0, 20)}…</div>
                {refs.length > 0 ? refs.map((r) => (
                  <div key={r.id} className="mt-1 text-xs">• <b>{r.title}</b> <span className="mut">({r.type})</span> — <span className="mut">{r.source.name} · {r.source.license}</span></div>
                )) : <div className="mut mt-1 text-xs">Belum ada anotasi publik untuk ayat ini.</div>}
              </div>

              {/* Catatan tersimpan */}
              {existing.length > 0 && (
                <div className="mb-4">
                  <div className="mut mb-2 text-[11px] uppercase tracking-wide">Catatanku ({existing.length})</div>
                  {existing.map((n) => (
                    <div key={n.id} className="mb-2 rounded-lg border p-2" style={{ borderColor: "var(--line)", borderLeft: `4px solid ${n.color}` }}>
                      <div className="flex items-center gap-2">
                        <span className="rounded px-1.5 py-0.5 text-[10px] uppercase" style={{ background: "var(--bg-soft)", color: "var(--gold)" }}>{n.type}</span>
                        <div className="ml-auto flex gap-2 text-xs">
                          <button className="mut" onClick={() => loadForEdit(n)}>edit</button>
                          <button style={{ color: "#e0664f" }} onClick={() => remove(n.id)}>hapus</button>
                        </div>
                      </div>
                      <p className="mt-1">{n.note}</p>
                      {n.source && <div className="mut mt-1 text-[11px]">📎 {n.source.title}{n.source.author ? ` — ${n.source.author}` : ""}{n.source.url ? " · ada tautan" : ""}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Editor */}
              <div className="rounded-lg border p-3" style={{ borderColor: "var(--gold)" }}>
                <div className="mut mb-2 text-[11px] uppercase tracking-wide">{editing ? "Edit catatan" : "Catatan baru"}</div>
                <div className="mb-2 flex items-center gap-2">
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button key={c.val} onClick={() => setForm({ ...form, color: c.val })} title={c.name}
                      style={{ width: 22, height: 22, borderRadius: 6, background: c.val, outline: form.color === c.val ? "2px solid var(--txt)" : "1px solid var(--line)" }} />
                  ))}
                </div>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as NoteType })}
                  className="mb-2 w-full rounded-md border px-2 py-1" style={{ background: "var(--panel)", borderColor: "var(--line)", color: "var(--txt)" }}>
                  {TYPES.map((t) => <option key={t} value={t}>{t}{KNOWLEDGE_TYPES.includes(t) ? " (perlu sumber)" : ""}</option>)}
                </select>
                <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Tulis catatanmu…" rows={3}
                  className="mb-2 w-full rounded-md border px-2 py-1" style={{ background: "var(--panel)", borderColor: "var(--line)", color: "var(--txt)" }} />
                <input value={form.srcTitle} onChange={(e) => setForm({ ...form, srcTitle: e.target.value })}
                  placeholder={needSource ? "Sumber / kitab (WAJIB)" : "Sumber / kitab (opsional)"}
                  className="mb-2 w-full rounded-md border px-2 py-1" style={{ background: "var(--panel)", borderColor: needSource ? "var(--gold)" : "var(--line)", color: "var(--txt)" }} />
                <div className="flex gap-2">
                  <input value={form.srcAuthor} onChange={(e) => setForm({ ...form, srcAuthor: e.target.value })} placeholder="Penulis (opsional)"
                    className="mb-2 w-1/2 rounded-md border px-2 py-1" style={{ background: "var(--panel)", borderColor: "var(--line)", color: "var(--txt)" }} />
                  <input value={form.srcUrl} onChange={(e) => setForm({ ...form, srcUrl: e.target.value })} placeholder="Tautan (opsional)"
                    className="mb-2 w-1/2 rounded-md border px-2 py-1" style={{ background: "var(--panel)", borderColor: "var(--line)", color: "var(--txt)" }} />
                </div>
                {err && <p className="mb-2 text-xs" style={{ color: "#e0664f" }}>{err}</p>}
                <div className="flex gap-2">
                  <button onClick={save} className="flex-1 rounded-lg px-3 py-2 text-xs font-semibold" style={{ background: "var(--gold)", color: "#1a130a" }}>{editing ? "Simpan perubahan" : "Simpan catatan"}</button>
                  {editing && <button onClick={() => { setEditing(null); setForm(blank(form.color)); }} className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--line)" }}>Batal</button>}
                </div>
              </div>
            </div>

            <div className="border-t p-3 text-center text-[11px] mut" style={{ borderColor: "var(--line)" }}>
              Catatan ini <b>privat</b> & tersimpan di perangkatmu · lihat semua di <a href="/catatan" className="gold">Buku Catatan</a>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
