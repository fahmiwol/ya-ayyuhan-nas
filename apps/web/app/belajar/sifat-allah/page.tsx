import Link from "next/link";
import { getSifat, ayahHref } from "@/lib/belajar";

export const metadata = { title: "Sifat-sifat Allah — Belajar" };

export default async function SifatPage() {
  const s = await getSifat();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mut text-xs"><Link href="/belajar" className="hover:underline">Belajar</Link> / Sifat-sifat Allah</div>
      <h1 className="mt-1 text-2xl font-bold">{s?.title ?? "Sifat-sifat Allah"} <span className="text-base">☝️</span></h1>
      {s?.subtitle && <p className="mut mt-1 text-sm">{s.subtitle}</p>}
      {!s ? (
        <div className="card mt-6 p-8 text-center mut">Data sedang disiapkan (bersumber).</div>
      ) : (
        <>
          {/* Netralitas — paling atas, sensitif */}
          {s.note_neutralitas && (
            <div className="mt-3 rounded-lg border p-3 text-xs" style={{ borderColor: "var(--gold)", background: "var(--bg-soft)" }}>
              <b className="gold">⚖️ Catatan netralitas.</b> <span className="mut">{s.note_neutralitas}</span>
            </div>
          )}
          <div className="mut mt-2 rounded-lg border p-3 text-xs" style={{ borderColor: "var(--line)" }}>
            <b>Sumber:</b> {s.source.name}. {s.source.note} {s.status && <span className="gold">· {s.status}</span>}
          </div>
          {s.kelompok.map((g) => (
            <div key={g.key} className="mt-6">
              <h2 className="text-lg font-semibold">{g.title}</h2>
              {g.desc && <p className="mut mt-0.5 text-sm">{g.desc}</p>}
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {g.items.map((it) => (
                  <div key={it.n} className="card p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <b>{it.n}. {it.latin}</b>
                        <div className="mut text-xs">{it.arti}</div>
                      </div>
                      <span className="arabic-title gold flex-none" style={{ fontSize: "1.4rem" }}>{it.arab}</span>
                    </div>
                    <div className="mut mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                      {it.mustahil && <span>Mustahil: <b>{it.mustahil}</b></span>}
                      {it.dalil && it.dalil !== "—" && <Link href={ayahHref(it.dalil)} className="rounded px-1.5 py-0.5" style={{ border: "1px solid var(--line)", color: "var(--green)" }}>📖 QS {it.dalil}</Link>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
