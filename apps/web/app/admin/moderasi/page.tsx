import Link from "next/link";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { getUserById, readSessionValue, SESSION_COOKIE } from "@/lib/auth-server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Moderasi — Ya Ayyuhan Nas" };

interface Contribution {
  id: string; type: string; target: { surah: number; ayah: number; word: number | null };
  lang: string; title: string; body: string; source: { name: string }; status: string; author: string; createdAt: string;
}

async function getQueue(): Promise<Contribution[]> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "public", "data", "contributions.json"), "utf8");
    const j = JSON.parse(raw);
    return (j.contributions as Contribution[]).filter((c) => c.status !== "published" && c.status !== "rejected");
  } catch { return []; }
}

export default async function ModerasiPage() {
  const jar = await cookies();
  const user = await getUserById(readSessionValue(jar.get(SESSION_COOKIE)?.value));

  // RBAC — hanya reviewer/admin
  if (!user || (user.role !== "admin" && user.role !== "reviewer")) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Akses terbatas 🔒</h1>
        <p className="mut mt-2">Halaman moderasi hanya untuk <b>reviewer / admin</b>.
          {user ? ` Peranmu: ${user.role}.` : " Kamu belum masuk."}</p>
        <Link href="/" className="gold mt-4 inline-block text-sm">← Beranda</Link>
      </div>
    );
  }

  const queue = await getQueue();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Moderasi Kontribusi</h1>
        <span className="rounded-full border px-3 py-1 text-xs gold" style={{ borderColor: "var(--gold)" }}>{user.role}</span>
      </div>
      <p className="mut mt-2 text-sm">
        Antrian kontribusi menunggu tinjauan. Guardrail: <b>wajib sumber + sanad + grade</b>; konten kontradiktif
        ditandai/ditolak; teks kanonik tak bisa diubah. Lihat <code>10_CONTRIBUTION_MODERATION.md</code>.
      </p>

      <div className="mut mt-4 text-sm">Menunggu: <b className="text-[var(--txt)]">{queue.length}</b></div>

      <div className="mt-4 space-y-3">
        {queue.length === 0 && <div className="card p-6 text-center mut">Antrian kosong.</div>}
        {queue.map((c) => (
          <div key={c.id} className="card p-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded px-1.5 py-0.5 uppercase" style={{ background: "var(--bg-soft)", color: "var(--gold)" }}>{c.type}</span>
              <span className="rounded px-1.5 py-0.5" style={{ background: "var(--bg-soft)" }}>{c.status}</span>
              <span className="mut">{c.lang}</span>
              <span className="mut ml-auto">{c.target.surah}:{c.target.ayah}</span>
            </div>
            <div className="mt-2 font-semibold">{c.title}</div>
            <p className="mut mt-1 text-sm">{c.body}</p>
            <div className="mut mt-2 text-xs">Sumber: {c.source.name} · oleh {c.author}</div>
            <div className="mt-3 flex gap-2 text-xs">
              <button className="rounded-lg px-3 py-1.5 font-semibold" style={{ background: "var(--green)", color: "#08120c" }}>✓ Approve</button>
              <button className="rounded-lg border px-3 py-1.5" style={{ borderColor: "var(--line)" }}>↩ Minta revisi</button>
              <button className="rounded-lg border px-3 py-1.5" style={{ borderColor: "var(--line)", color: "#e0664f" }}>✕ Reject</button>
            </div>
          </div>
        ))}
      </div>

      <p className="mut mt-6 text-xs">
        Skeleton: aksi approve/reject &amp; multi-reviewer (ijma) + tulis status ke DB = Fase 2 (butuh auth+DB penuh).
        Yang aktif sekarang: <b>RBAC</b> (halaman ini terkunci untuk non-reviewer).
      </p>
    </div>
  );
}
