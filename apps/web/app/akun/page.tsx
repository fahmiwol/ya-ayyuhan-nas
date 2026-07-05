"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useNotes } from "@/lib/notes";

const ROLE_LABEL: Record<string, string> = { user: "Pengguna", contributor: "Kontributor", reviewer: "Reviewer", admin: "Admin" };

export default function AkunPage() {
  const { user, loading, signOut } = useAuth();
  const { notes } = useNotes();

  if (loading) return <div className="mx-auto max-w-2xl px-4 py-10 mut">Memuat…</div>;

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <h1 className="text-2xl font-bold">Akun</h1>
        <p className="mut mt-2">Kamu belum masuk. Klik <b>Masuk</b> di kanan atas untuk membuat akun / masuk.</p>
        <Link href="/" className="gold mt-4 inline-block text-sm">← Beranda</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Akun</h1>

      <div className="card mt-5 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full text-lg font-bold" style={{ background: "var(--gold)", color: "#1a130a" }}>
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <div className="font-semibold">{user.name}</div>
            <div className="mut text-sm">{user.email}</div>
          </div>
          <span className="ml-auto rounded-full border px-3 py-1 text-xs uppercase gold" style={{ borderColor: "var(--gold)" }}>{ROLE_LABEL[user.role] ?? user.role}</span>
        </div>
        <div className="mut mt-4 grid grid-cols-2 gap-3 text-sm">
          <div><b className="text-[var(--txt)]">{notes.length}</b> catatan (perangkat ini)</div>
          <div>bergabung {new Date(user.createdAt).toLocaleDateString("id-ID")}</div>
        </div>
      </div>

      {/* Jalur kontributor — gating ketat */}
      {user.role === "user" && (
        <div className="card mt-4 p-5">
          <h2 className="font-semibold">Ingin jadi Kontributor?</h2>
          <p className="mut mt-1 text-sm">
            Kontributor menambah konten publik (tafsir, hikayat, terjemah) yang <b>dimoderasi</b>. Karena
            ini menyangkut firman Allah, gating sangat ketat — perlu verifikasi kredensial (ulama / mufassir /
            sejarawan / hafidz / qari bersanad) &amp; setiap kontribusi <b>wajib bersumber + sanad</b>.
          </p>
          <button className="mt-3 rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
            onClick={() => alert("Pengajuan kontributor akan diverifikasi manual oleh admin (jalur moderasi — Fase 2).")}>
            Ajukan &amp; kirim bukti kredensial
          </button>
        </div>
      )}

      {(user.role === "admin" || user.role === "reviewer") && (
        <Link href="/admin/moderasi" className="card mt-4 block p-5 hover:opacity-90">
          <h2 className="font-semibold gold">→ Halaman Moderasi</h2>
          <p className="mut mt-1 text-sm">Tinjau antrian kontribusi (approve / reject).</p>
        </Link>
      )}

      <div className="mt-6 flex gap-2">
        <button onClick={signOut} className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--line)", color: "#e0664f" }}>Keluar</button>
        <Link href="/catatan" className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "var(--line)" }}>Buku Catatan</Link>
      </div>

      <p className="mut mt-6 text-xs">
        Catatan tersimpan lokal di perangkat ini. Sinkron antar-perangkat (server self-hosted) menyusul —
        akun ini fondasinya. Password ter-hash (scrypt); sesi cookie httpOnly ter-tanda-tangan.
      </p>
    </div>
  );
}
