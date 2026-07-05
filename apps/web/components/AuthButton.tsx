"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

const ROLE_LABEL: Record<string, string> = { user: "Pengguna", contributor: "Kontributor", reviewer: "Reviewer", admin: "Admin" };

export function AuthButton() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  if (loading) return <span className="mut text-xs">…</span>;

  if (user) {
    return (
      <div className="relative">
        <button onClick={() => setMenu((m) => !m)} className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm" style={{ borderColor: "var(--line)" }}>
          <span className="grid h-6 w-6 place-items-center rounded-full text-xs" style={{ background: "var(--gold)", color: "#1a130a" }}>
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
        </button>
        {menu && (
          <div className="card absolute right-0 z-30 mt-2 w-52 p-2 text-sm" onMouseLeave={() => setMenu(false)}>
            <div className="border-b p-2" style={{ borderColor: "var(--line)" }}>
              <div className="font-medium">{user.name}</div>
              <div className="mut text-xs">{user.email}</div>
              <div className="gold mt-1 text-[11px] uppercase">{ROLE_LABEL[user.role] ?? user.role}</div>
            </div>
            <Link href="/akun" onClick={() => setMenu(false)} className="block rounded-md px-2 py-1.5 hover:bg-[var(--bg-soft)]">Akun</Link>
            <Link href="/catatan" onClick={() => setMenu(false)} className="block rounded-md px-2 py-1.5 hover:bg-[var(--bg-soft)]">Buku Catatan</Link>
            {(user.role === "admin" || user.role === "reviewer") && (
              <Link href="/admin/moderasi" onClick={() => setMenu(false)} className="block rounded-md px-2 py-1.5 hover:bg-[var(--bg-soft)]">Moderasi</Link>
            )}
            <button onClick={() => { setMenu(false); signOut(); }} className="mt-1 block w-full rounded-md px-2 py-1.5 text-left" style={{ color: "#e0664f" }}>Keluar</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-lg border px-3 py-1.5 text-sm" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>Masuk</button>
      {open && <AuthModal onClose={() => setOpen(false)} signIn={signIn} signUp={signUp} />}
    </>
  );
}

function AuthModal({ onClose, signIn, signUp }: { onClose: () => void; signIn: (e: string, p: string) => Promise<string | null>; signUp: (n: string, e: string, p: string) => Promise<string | null> }) {
  const [tab, setTab] = useState<"in" | "up">("in");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true); setErr("");
    const error = tab === "in" ? await signIn(email, pw) : await signUp(name, email, pw);
    setBusy(false);
    if (error) setErr(error); else onClose();
  }

  const inp = { background: "var(--panel)", borderColor: "var(--line)", color: "var(--txt)" } as const;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.6)" }} onClick={onClose}>
      <div className="card w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex gap-2 text-sm">
          <button onClick={() => setTab("in")} className="flex-1 rounded-lg border py-2" style={{ borderColor: tab === "in" ? "var(--gold)" : "var(--line)", color: tab === "in" ? "var(--gold)" : "var(--mut)" }}>Masuk</button>
          <button onClick={() => setTab("up")} className="flex-1 rounded-lg border py-2" style={{ borderColor: tab === "up" ? "var(--gold)" : "var(--line)", color: tab === "up" ? "var(--gold)" : "var(--mut)" }}>Daftar</button>
        </div>
        {tab === "up" && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" className="mb-2 w-full rounded-md border px-3 py-2 text-sm" style={inp} />}
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="mb-2 w-full rounded-md border px-3 py-2 text-sm" style={inp} />
        <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="Password (min 8)" className="mb-2 w-full rounded-md border px-3 py-2 text-sm" style={inp} />
        {err && <p className="mb-2 text-xs" style={{ color: "#e0664f" }}>{err}</p>}
        <button onClick={submit} disabled={busy} className="w-full rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: "var(--gold)", color: "#1a130a" }}>
          {busy ? "…" : tab === "in" ? "Masuk" : "Buat akun"}
        </button>
        <p className="mut mt-3 text-center text-[11px]">Akun untuk sinkron catatan &amp; (nanti) jalur kontributor. Password ter-hash (scrypt), sesi cookie ter-tanda-tangan.</p>
      </div>
    </div>
  );
}
