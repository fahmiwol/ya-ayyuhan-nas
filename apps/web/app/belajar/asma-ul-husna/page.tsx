import Link from "next/link";
import { getAsma } from "@/lib/belajar";
import { AsmaGrid } from "@/components/AsmaGrid";

export const metadata = { title: "Asma'ul Husna — Belajar" };

export default async function AsmaPage() {
  const asma = await getAsma();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mut text-xs"><Link href="/belajar" className="hover:underline">Belajar</Link> / Asma&apos;ul Husna</div>
      <h1 className="mt-1 text-2xl font-bold">{asma?.title ?? "Asma'ul Husna"} <span className="text-base">✨</span></h1>
      {asma?.subtitle && <p className="mut mt-1 text-sm">{asma.subtitle}</p>}
      {!asma ? (
        <div className="card mt-6 p-8 text-center mut">Data sedang disiapkan (bersumber).</div>
      ) : (
        <>
          <div className="mut mt-3 rounded-lg border p-3 text-xs" style={{ borderColor: "var(--line)" }}>
            <b>Sumber:</b> {asma.source.name}. {asma.source.note} {asma.status && <span className="gold">· Status: {asma.status}</span>}
          </div>
          <div className="mt-4"><AsmaGrid items={asma.items} /></div>
        </>
      )}
    </div>
  );
}
