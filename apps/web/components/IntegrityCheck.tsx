"use client";

import { useState } from "react";

// Recompute Merkle root DI BROWSER dari data yang di-bundle -> bandingkan root pin.
// leaf = SHA256(utf8(NFC(text))), node = SHA256(left||right), promote node ganjil.
async function sha256(bytes: Uint8Array): Promise<Uint8Array> {
  // salin ke ArrayBuffer-backed Uint8Array agar cocok tipe BufferSource (TS strict)
  const buf = new Uint8Array(bytes);
  const d = await crypto.subtle.digest("SHA-256", buf);
  return new Uint8Array(d);
}
function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}
function toHex(b: Uint8Array): string {
  return Array.from(b).map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function IntegrityCheck({ pinnedRoot, ayahCount }: { pinnedRoot: string; ayahCount: number }) {
  const [state, setState] = useState<"idle" | "running" | "ok" | "fail">("idle");
  const [progress, setProgress] = useState(0);
  const [computed, setComputed] = useState<string>("");

  async function run() {
    setState("running");
    setProgress(0);
    const enc = new TextEncoder();
    const leaves: Uint8Array[] = [];
    for (let n = 1; n <= 114; n++) {
      const res = await fetch(`/data/surah/${n}.json`);
      const s = await res.json();
      for (const a of s.ayahs) {
        leaves.push(await sha256(enc.encode(a.arabic.normalize("NFC"))));
      }
      setProgress(Math.round((n / 114) * 100));
    }
    let level = leaves;
    while (level.length > 1) {
      const next: Uint8Array[] = [];
      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = i + 1 < level.length ? level[i + 1] : level[i];
        next.push(await sha256(concat(left, right)));
      }
      level = next;
    }
    const root = toHex(level[0]);
    setComputed(root);
    setState(root === pinnedRoot && leaves.length === ayahCount ? "ok" : "fail");
  }

  return (
    <div>
      <button
        onClick={run}
        disabled={state === "running"}
        className="rounded-lg border px-4 py-2 text-sm"
        style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
      >
        {state === "running" ? `Menghitung… ${progress}%` : "Verifikasi ulang di perangkat ini"}
      </button>

      {state === "ok" && (
        <p className="green mt-3 text-sm">
          ✔ Cocok. {ayahCount} ayat, Merkle root identik dengan yang di-pin. Satu huruf pun tidak berubah.
        </p>
      )}
      {state === "fail" && (
        <p className="mt-3 text-sm" style={{ color: "#e0664f" }}>
          ✗ TIDAK COCOK. Data mungkin rusak/berubah. Root hitung: <code className="break-all">{computed}</code>
        </p>
      )}
    </div>
  );
}
