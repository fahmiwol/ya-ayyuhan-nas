import Link from "next/link";
import { getMalaikat, ayahHref } from "@/lib/belajar";

export const metadata = { title: "Malaikat — Belajar" };

export default async function MalaikatPage() {
  const mal = await getMalaikat();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mut text-xs"><Link href="/belajar" className="hover:underline">Belajar</Link> / Malaikat</div>
      <h1 className="mt-1 text-2xl font-bold">{mal?.title ?? "Malaikat"} <span className="text-base">👼</span></h1>
      {!mal ? (
        <div className="card mt-6 p-8 text-center mut">Data sedang disiapkan (bersumber).</div>
      ) : (
        <>
          <div className="mut mt-3 rounded-lg border p-3 text-xs" style={{ borderColor: "var(--line)" }}>
            <b>Sumber:</b> {mal.source.name}. {mal.source.note} {mal.status && <span className="gold">· {mal.status}</span>}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {mal.items.map((m) => (
              <div key={m.nama} className="card p-3">
                <div className="flex items-center justify-between gap-2">
                  <b>{m.nama}</b>
                  <span className="arabic-title gold" style={{ fontSize: "1.3rem" }}>{m.nama_arab}</span>
                </div>
                <p className="mut mt-1 text-sm">{m.tugas}</p>
                {m.dalil && <Link href={ayahHref(m.dalil)} className="mt-1 inline-block rounded px-1.5 py-0.5 text-[11px]" style={{ border: "1px solid var(--line)", color: "var(--green)" }}>📖 QS {m.dalil}</Link>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
