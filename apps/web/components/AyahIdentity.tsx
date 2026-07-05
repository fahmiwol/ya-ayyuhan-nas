"use client";

import { useState } from "react";
import type { AyahProof } from "@/lib/types";

// Verifikasi bukti inklusi Merkle DI BROWSER: leaf + proof -> root.
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

export function AyahIdentity({ surah, ayah, hash, onClose }: { surah: number; ayah: number; hash: string; onClose: () => void }) {
  const [proof, setProof] = useState<AyahProof | null>(null);
  const [root, setRoot] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "fail">("idle");

  async function verify() {
    setStatus("loading");
    const res = await fetch(`/api/v1/ayah/${surah}/${ayah}/proof`);
    const data = await res.json();
    setProof(data.identity as AyahProof);
    setRoot(data.merkle_root as string);
    let acc = data.identity.hash as string;
    for (const step of data.identity.proof as AyahProof["proof"]) {
      acc = step.dir === "L" ? await sha256Hex(step.h, acc) : await sha256Hex(acc, step.h);
    }
    setStatus(acc === data.merkle_root ? "ok" : "fail");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.6)" }} onClick={onClose}>
      <div className="card w-full max-w-lg p-5" style={{ background: "var(--panel)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Identitas Ayat {surah}:{ayah}</h3>
          <button onClick={onClose} className="mut" aria-label="Tutup">✕</button>
        </div>
        <p className="mut mt-1 text-xs">
          Paspor kriptografis ayat — siap di-mint (chain-agnostic). Token-ID = hash konten; bukti inklusi
          membuktikan ayat ini bagian sah dari mushaf (root).
        </p>

        <div className="mt-3 text-sm">
          <div className="mut text-xs">Hash konten (token-ID)</div>
          <div className="break-all font-mono text-xs gold">{hash}</div>
        </div>

        {status === "idle" && (
          <button onClick={verify} className="mt-4 rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>
            Muat &amp; verifikasi bukti inklusi
          </button>
        )}
        {status === "loading" && <p className="mut mt-4 text-sm">Memverifikasi…</p>}
        {proof && status !== "loading" && (
          <div className="mt-4 text-sm">
            <div className="mut text-xs">Bukti inklusi Merkle ({proof.proof.length} langkah) → root</div>
            <div className="break-all font-mono text-[11px]" style={{ color: "var(--mut)" }}>
              {proof.proof.map((s, i) => (
                <span key={i} title={s.h}>{s.dir}·{s.h.slice(0, 6)} </span>
              ))}
            </div>
            <div className="mt-2 break-all font-mono text-[11px] mut">root: {root}</div>
            {status === "ok" && <p className="green mt-3">✔ Terverifikasi — ayat ini sah bagian dari mushaf (root cocok). Aman untuk mint.</p>}
            {status === "fail" && <p className="mt-3" style={{ color: "#e0664f" }}>✗ Bukti tidak cocok root.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
