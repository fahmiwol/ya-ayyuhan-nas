"use client";

import { useEffect, useState } from "react";
import type { Ayah, Word, AyahProof, Annotation } from "@/lib/types";
import { transliterateArabic } from "@/lib/translit";
import { assess } from "@/lib/evalgate";
import { TrustBadge } from "./TrustBadge";

async function sha256Hex(hex1: string, hex2: string): Promise<string> {
  const a = hexToBytes(hex1), b = hexToBytes(hex2);
  const buf = new Uint8Array(a.length + b.length);
  buf.set(a, 0); buf.set(b, a.length);
  const d = await crypto.subtle.digest("SHA-256", buf);
  return bytesToHex(new Uint8Array(d));
}
function hexToBytes(h: string): Uint8Array {
  const out = new Uint8Array(h.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16);
  return out;
}
function bytesToHex(b: Uint8Array): string {
  return Array.from(b).map((x) => x.toString(16).padStart(2, "0")).join("");
}

export interface IdentityTarget { surah: number; ayah: Ayah; word?: Word | null }
type Tab = "identitas" | "tafsir" | "riwayat";
interface TafsirEd { key: string; name: string; lang: string; source: string; license: string }
interface AsbabItem { title: string; narrative: string; source: string; grade?: string }

export function IdentityPanel({ target, onClose }: { target: IdentityTarget | null; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("identitas");
  const [proof, setProof] = useState<AyahProof | null>(null);
  const [root, setRoot] = useState("");
  const [verify, setVerify] = useState<"idle" | "loading" | "ok" | "fail">("idle");
  const [anns, setAnns] = useState<Annotation[]>([]);
  const [copied, setCopied] = useState(false);
  const [tafsir, setTafsir] = useState<{ editions: TafsirEd[]; texts: Record<string, string> } | null>(null);
  const [tq, setTq] = useState("");
  const [riwayat, setRiwayat] = useState<{ items: AsbabItem[]; source: { name: string; license: string; note?: string } } | null>(null);

  const surah = target?.surah;
  const ayah = target?.ayah;

  useEffect(() => {
    setTab("identitas"); setProof(null); setRoot(""); setVerify("idle"); setAnns([]); setCopied(false);
    setTafsir(null); setTq(""); setRiwayat(null);
    if (!surah || !ayah) return;
    let alive = true;
    (async () => {
      const [p, a] = await Promise.all([
        fetch(`/api/v1/ayah/${surah}/${ayah.ayah}/proof`).then((r) => r.json()),
        fetch(`/api/v1/annotations/${surah}/${ayah.ayah}`).then((r) => r.json()),
      ]);
      if (!alive) return;
      setProof(p.identity); setRoot(p.merkle_root); setAnns(a.annotations ?? []);
    })();
    return () => { alive = false; };
  }, [surah, ayah]);

  useEffect(() => {
    if (!surah || !ayah) return;
    if (tab === "tafsir" && tafsir === null)
      fetch(`/api/v1/ayah/${surah}/${ayah.ayah}/tafsir`).then((r) => r.json()).then(setTafsir).catch(() => setTafsir({ editions: [], texts: {} }));
    if (tab === "riwayat" && riwayat === null)
      fetch(`/api/v1/ayah/${surah}/${ayah.ayah}/riwayat`).then((r) => r.json()).then(setRiwayat).catch(() => setRiwayat({ items: [], source: { name: "", license: "" } }));
  }, [tab, surah, ayah, tafsir, riwayat]);

  async function runVerify() {
    if (!proof || !ayah) return;
    setVerify("loading");
    let acc = ayah.hash;
    for (const step of proof.proof) acc = step.dir === "L" ? await sha256Hex(step.h, acc) : await sha256Hex(acc, step.h);
    setVerify(acc === root ? "ok" : "fail");
  }
  function copyAyah() {
    if (!ayah || !surah) return;
    navigator.clipboard?.writeText(`${ayah.arabic}\n(${surah}:${ayah.ayah}) — id:${ayah.hash}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  }

  const open = !!target;
  const w = target?.word;
  const editions = (tafsir?.editions ?? []).filter((e) => {
    const q = tq.trim().toLowerCase();
    if (!q) return true;
    return e.name.toLowerCase().includes(q) || (tafsir?.texts[e.key] ?? "").toLowerCase().includes(q);
  });

  const TabBtn = ({ id, label }: { id: Tab; label: string }) => (
    <button onClick={() => setTab(id)} className="flex-1 border-b-2 py-2 text-sm"
      style={{ borderColor: tab === id ? "var(--gold)" : "transparent", color: tab === id ? "var(--gold)" : "var(--mut)" }}>{label}</button>
  );

  return (
    <>
      <div className={`id-scrim ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`id-panel card ${open ? "open" : ""}`} aria-hidden={!open}>
        {ayah && surah && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-4 pb-2" style={{ borderColor: "var(--line)" }}>
              <h3 className="font-semibold">{w ? `Kata (${surah}:${ayah.ayah}·${w.p})` : `Ayat ${surah}:${ayah.ayah}`}</h3>
              <button onClick={onClose} className="mut text-lg" aria-label="Tutup">✕</button>
            </div>
            <div className="flex border-b px-2" style={{ borderColor: "var(--line)" }}>
              <TabBtn id="identitas" label="Identitas" />
              <TabBtn id="tafsir" label="Tafsir" />
              <TabBtn id="riwayat" label="Riwayat" />
            </div>

            <div className="flex-1 overflow-auto p-4 text-sm">
              {/* ===== IDENTITAS ===== */}
              {tab === "identitas" && (
                <>
                  <div className="arabic mb-3" style={{ fontSize: w ? "2rem" : "1.6rem", textAlign: "right" }}>{w ? w.ar : ayah.arabic}</div>
                  {w && (
                    <div className="mb-3">
                      {w.tl && <div className="mut text-xs">translit: <span style={{ color: "var(--txt)" }}>{w.tl}</span></div>}
                      {w.tr && <div className="mut text-xs">arti: <span className="gold">{w.tr}</span></div>}
                    </div>
                  )}
                  <div className="mut text-xs">Hash konten (token-ID)</div>
                  <div className="break-all font-mono text-[11px] gold">{ayah.hash}</div>
                  {ayah.word_root && <div className="mut mt-1 break-all font-mono text-[10px]">merkle-kata: {ayah.word_root.slice(0, 24)}…</div>}
                  <div className="mt-4">
                    {verify === "idle" && <button onClick={runVerify} disabled={!proof} className="rounded-lg border px-3 py-1.5 text-xs" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>Verifikasi bukti inklusi (Merkle)</button>}
                    {verify === "loading" && <p className="mut text-xs">Memverifikasi…</p>}
                    {proof && verify !== "idle" && (
                      <div className="text-xs">
                        <div className="mut">Bukti inklusi ({proof.proof.length} langkah) → root</div>
                        {verify === "ok" && <p className="green mt-1">✔ Sah bagian dari mushaf (root cocok). Aman untuk mint.</p>}
                        {verify === "fail" && <p className="mt-1" style={{ color: "#e0664f" }}>✗ Tidak cocok root.</p>}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ===== TAFSIR ===== */}
              {tab === "tafsir" && (
                <>
                  <input value={tq} onChange={(e) => setTq(e.target.value)} placeholder="Cari di tafsir / nama ulama…"
                    className="mb-3 w-full rounded-md border px-3 py-2 text-sm" style={{ background: "var(--panel)", borderColor: "var(--line)", color: "var(--txt)" }} />
                  {tafsir === null && <p className="mut">Memuat tafsir…</p>}
                  {tafsir && editions.length === 0 && <p className="mut">{tq ? "Tak ada yang cocok." : "Belum ada tafsir untuk ayat ini."}</p>}
                  {editions.map((e) => {
                    const body = tafsir?.texts[e.key] ?? "";
                    const isAr = e.lang === "ar";
                    const idTrans = tafsir?.texts[`${e.key}_id`]; // terjemahan mesin (jika ada)
                    const ta = assess({ kind: "tafsir", hasProvenance: true, machine: isAr && !!idTrans, source: { source: e.source, license: e.license } });
                    return (
                    <div key={e.key} className="mb-3 rounded-lg border p-3" style={{ borderColor: "var(--line)" }}>
                      <div className="flex flex-wrap items-center gap-2">
                        <b className="text-sm gold">{e.name}</b>
                        <span className="mut rounded px-1.5 py-0.5 text-[10px]" style={{ background: "var(--bg-soft)" }}>{e.lang}</span>
                        <TrustBadge a={ta} compact />
                      </div>
                      <p className="mt-1 leading-relaxed" dir={isAr ? "rtl" : "ltr"} style={isAr ? { fontSize: "1.2rem" } : undefined}>{body}</p>
                      {isAr && (
                        <div className="mt-2 rounded-md p-2" style={{ background: "var(--bg-soft)" }}>
                          <div className="mut mb-0.5 text-[10px] uppercase tracking-wide">Cara baca · transliterasi otomatis</div>
                          <p className="text-sm italic leading-relaxed" dir="ltr" style={{ color: "var(--txt)" }}>{transliterateArabic(body)}</p>
                        </div>
                      )}
                      {isAr && (
                        <div className="mt-2">
                          <div className="mut mb-0.5 text-[10px] uppercase tracking-wide">Arti (Indonesia)</div>
                          {idTrans ? (
                            <p className="text-sm leading-relaxed">{idTrans} <span className="mut">🌐 terjemahan mesin — belum ditinjau ahli</span></p>
                          ) : (
                            <p className="mut text-sm">Terjemahan sedang disiapkan. Sementara, lihat <b>Tafsir Kemenag</b> (Indonesia) di atas untuk memahami maksud ayat.</p>
                          )}
                        </div>
                      )}
                      <div className="mut mt-2 text-[10px]">Sumber: {e.source} · {e.license}</div>
                    </div>
                  );})}
                  {/* Anotasi (catatan editorial) di bawah tafsir */}
                  {anns.length > 0 && (
                    <div className="mt-4">
                      <div className="mut mb-2 text-xs uppercase tracking-wide">Anotasi</div>
                      {anns.map((an) => (
                        <div key={an.id} className="mb-2 rounded-lg border p-2" style={{ borderColor: "var(--line)" }}>
                          <div className="flex items-center gap-2"><span className="rounded px-1.5 py-0.5 text-[10px] uppercase" style={{ background: "var(--bg-soft)", color: "var(--gold)" }}>{an.type}</span><b className="text-sm">{an.title}</b></div>
                          <p className="mt-1">{an.body}</p>
                          <div className="mut mt-1 text-[10px]">{an.source.name} · {an.source.license}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="mut mt-3 text-[10px]">Edisi ulama lain (Ibn Kathir, al-Muyassar, Jalalain) ditambah bertahap.</p>
                </>
              )}

              {/* ===== RIWAYAT ===== */}
              {tab === "riwayat" && (
                <>
                  {riwayat === null && <p className="mut">Memuat riwayat…</p>}
                  {riwayat && riwayat.items.length === 0 && <p className="mut">Belum ada asbabun nuzul/riwayat khusus untuk ayat ini. Tidak semua ayat memilikinya; sedang dilengkapi.</p>}
                  {riwayat?.items.map((it, i) => (
                    <div key={i} className="mb-3 rounded-lg border p-3" style={{ borderColor: "var(--gold)" }}>
                      <div className="flex items-center gap-2">
                        <span className="rounded px-1.5 py-0.5 text-[10px] uppercase" style={{ background: "var(--bg-soft)", color: "var(--gold)" }}>asbabun nuzul</span>
                        <b className="text-sm">{it.title}</b>
                        {it.grade && <span className="mut text-[10px]">· {it.grade}</span>}
                      </div>
                      <p className="mt-1 leading-relaxed">{it.narrative}</p>
                      <div className="mut mt-1 text-[10px]">📎 {it.source}</div>
                    </div>
                  ))}
                  {riwayat && riwayat.source?.note && <p className="mut mt-2 text-[10px]">{riwayat.source.note}</p>}
                </>
              )}
            </div>

            <div className="flex gap-2 border-t p-3" style={{ borderColor: "var(--line)" }}>
              <button onClick={copyAyah} className="flex-1 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--line)" }} title="Salin teks ayat + hash identitasnya">
                {copied ? "✓ Tersalin" : "🔗 Salin + ID"}
              </button>
              <button title="Daftarkan identitas ayat (hash+bukti) ke ledger/chain — integrasi menyusul" className="flex-1 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--line)", color: "var(--mut)" }}>
                🔖 Mint (segera)
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
