import Link from "next/link";
import { getNabi, ayahHref } from "@/lib/belajar";

export const metadata = { title: "25 Nabi & Rasul — Belajar" };

export default async function NabiPage() {
  const nabi = await getNabi();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mut text-xs"><Link href="/belajar" className="hover:underline">Belajar</Link> / 25 Nabi &amp; Rasul</div>
      <h1 className="mt-1 text-2xl font-bold">{nabi?.title ?? "25 Nabi & Rasul"} <span className="text-base">☝️</span></h1>
      {!nabi ? (
        <div className="card mt-6 p-8 text-center mut">Data sedang disiapkan (bersumber).</div>
      ) : (
        <>
          <div className="mut mt-3 rounded-lg border p-3 text-xs" style={{ borderColor: "var(--line)" }}>
            <b>Sumber:</b> {nabi.source.name}. {nabi.source.note} {nabi.status && <span className="gold">· {nabi.status}</span>}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3">
            {nabi.items.map((n) => (
              <div key={n.n} className="card p-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-lg text-xs font-semibold" style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}>{n.n}</span>
                  <b className="text-lg">{n.nama}</b>
                  <span className="arabic-title gold" style={{ fontSize: "1.4rem" }}>{n.nama_arab}</span>
                  {n.ulul_azmi && <span className="rounded-full px-2 py-0.5 text-[10px]" style={{ border: "1px solid var(--green)", color: "var(--green)" }}>Ulul Azmi</span>}
                </div>
                <p className="mut mt-1.5 text-sm">{n.ringkas}</p>
                {(n.ayat_ref ?? []).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                    {n.ayat_ref!.map((r) => (
                      <Link key={r} href={ayahHref(r)} className="rounded px-1.5 py-0.5" style={{ border: "1px solid var(--line)", color: "var(--green)" }}>📖 QS {r}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
