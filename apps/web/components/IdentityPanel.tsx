"use client";

import { useEffect, useState } from "react";
import type { Ayah, Word, AyahProof, Annotation } from "@/lib/types";

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

export interface IdentityTarget {
  surah: number;
  ayah: Ayah;
  word?: Word | null;
}

export function IdentityPanel({ target, onClose }: { target: IdentityTarget | null; onClose: () => void }) {
  const [proof, setProof] = useState<AyahProof | null>(null);
  const [root, setRoot] = useState("");
  const [verify, setVerify] = useState<"idle" | "loading" | "ok" | "fail">("idle");
  const [anns, setAnns] = useState<Annotation[]>([]);
  const [copied, setCopied] = useState(false);

  const surah = target?.surah;
  const ayah = target?.ayah;

  // reset + load bukti & anotasi tiap target berubah
  useEffect(() => {
    setProof(null); setRoot(""); setVerify("idle"); setAnns([]); setCopied(false);
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

  async function runVerify() {
    if (!proof || !ayah) return;
    setVerify("loading");
    let acc = ayah.hash;
    for (const step of proof.proof) acc = step.dir === "L" ? await sha256Hex(step.h, acc) : await sha256Hex(acc, step.h);
    setVerify(acc === root ? "ok" : "fail");
  }

  function copyAyah() {
    if (!ayah || !surah) return;
    const txt = `${ayah.arabic}\n(${surah}:${ayah.ayah}) — id:${ayah.hash}`;
    navigator.clipboard?.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  }

  const open = !!target;
  const w = target?.word;

  return (
    <>
      <div className={`id-scrim ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`id-panel card ${open ? "open" : ""}`} aria-hidden={!open}>
        {ayah && surah && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-4" style={{ borderColor: "var(--line)" }}>
              <div>
                <div className="mut text-xs">Identitas</div>
                <h3 className="font-semibold">{w ? `Kata (${surah}:${ayah.ayah}·${w.p})` : `Ayat ${surah}:${ayah.ayah}`}</h3>
              </div>
              <button onClick={onClose} className="mut text-lg" aria-label="Tutup">✕</button>
            </div>

            <div className="flex-1 overflow-auto p-4 text-sm">
              {/* teks */}
              <div className="arabic mb-3" style={{ fontSize: w ? "2rem" : "1.6rem", textAlign: "right" }}>
                {w ? w.ar : ayah.arabic}
              </div>
              {w && (
                <div className="mb-3">
                  {w.tl && <div className="mut text-xs">translit: <span style={{ color: "var(--txt)" }}>{w.tl}</span></div>}
                  {w.tr && <div className="mut text-xs">arti: <span className="gold">{w.tr}</span></div>}
                </div>
              )}

              {/* hash / token-id */}
              <div className="mt-2">
                <div className="mut text-xs">Hash konten (token-ID) — identitas ayat</div>
                <div className="break-all font-mono text-[11px] gold">{ayah.hash}</div>
                {ayah.word_root && <div className="mut mt-1 break-all font-mono text-[10px]">merkle-kata: {ayah.word_root.slice(0, 24)}…</div>}
              </div>

              {/* bukti inklusi */}
              <div className="mt-4">
                {verify === "idle" && (
                  <button onClick={runVerify} disabled={!proof} className="rounded-lg border px-3 py-1.5 text-xs" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>
                    Verifikasi bukti inklusi (Merkle)
                  </button>
                )}
                {verify === "loading" && <p className="mut text-xs">Memverifikasi…</p>}
                {proof && verify !== "idle" && (
                  <div className="text-xs">
                    <div className="mut">Bukti inklusi ({proof.proof.length} langkah) → root</div>
                    {verify === "ok" && <p className="green mt-1">✔ Sah bagian dari mushaf (root cocok). Aman untuk mint.</p>}
                    {verify === "fail" && <p className="mt-1" style={{ color: "#e0664f" }}>✗ Tidak cocok root.</p>}
                    <div className="mut mt-1 break-all font-mono text-[10px]">root: {root.slice(0, 32)}…</div>
                  </div>
                )}
              </div>

              {/* anotasi */}
              {anns.length > 0 && (
                <div className="mt-5">
                  <div className="mut mb-2 text-xs uppercase tracking-wide">Anotasi</div>
                  {anns.map((an) => (
                    <div key={an.id} className="mb-2 rounded-lg border p-2" style={{ borderColor: "var(--line)" }}>
                      <div className="flex items-center gap-2">
                        <span className="rounded px-1.5 py-0.5 text-[10px] uppercase" style={{ background: "var(--bg-soft)", color: "var(--gold)" }}>{an.type}</span>
                        <b className="text-sm">{an.title}</b>
                      </div>
                      <p className="mt-1">{an.body}</p>
                      <div className="mut mt-1 text-[10px]">{an.source.name} · {an.source.license}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* aksi */}
            <div className="flex gap-2 border-t p-3" style={{ borderColor: "var(--line)" }}>
              <button onClick={copyAyah} className="flex-1 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--line)" }}>
                {copied ? "✓ Tersalin" : "🔗 Salin + ID"}
              </button>
              <button title="Mint identitas ayat (integrasi chain menyusul)" className="flex-1 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--line)", color: "var(--mut)" }}>
                🔖 Mint (segera)
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
