import { getDoa } from "@/lib/doa";
import { DoaBrowser } from "@/components/DoaBrowser";

export const metadata = { title: "Doa — Ya Ayyuhan Nas" };

export default async function DoaPage() {
  const d = await getDoa();
  if (!d) return <div className="mx-auto max-w-3xl px-4 py-10 mut">Data doa belum tersedia.</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Kumpulan <span className="gold">Doa</span></h1>
      <p className="mut mt-2 text-sm">{d.subtitle}. Klik tiap doa untuk penjelasan, riwayat &amp; sanad.</p>

      <DoaBrowser categories={d.categories} />

      <div className="card mt-8 p-4 text-xs mut">Sumber: {d.source.name} · {d.source.license}. {d.source.note}</div>
    </div>
  );
}
