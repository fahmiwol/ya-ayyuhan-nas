import { getKisah } from "@/lib/kisah";
import { KisahBrowser } from "@/components/KisahBrowser";

export const metadata = { title: "Kisah — Ya Ayyuhan Nas" };

export default async function KisahPage() {
  const k = await getKisah();
  if (!k) return <div className="mx-auto max-w-3xl px-4 py-10 mut">Data kisah belum tersedia.</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">{k.title.split(" ")[0]} <span className="gold">{k.title.split(" ").slice(1).join(" ")}</span></h1>
      <p className="mut mt-2 text-sm">{k.subtitle}. Klik untuk baca &amp; lihat rujukan.</p>

      <KisahBrowser categories={k.categories} />

      <div className="card mt-8 p-4 text-xs mut">Sumber: {k.source.name} · {k.source.license}. {k.source.note}</div>
    </div>
  );
}
