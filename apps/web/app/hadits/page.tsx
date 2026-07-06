import Link from "next/link";
import { getHadithIndex } from "@/lib/hadith";

export const metadata = { title: "Hadits — Ya Ayyuhan Nas" };

export default async function HaditsPage() {
  const idx = await getHadithIndex();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Kumpulan <span className="gold">Hadits</span></h1>
      <p className="mut mt-2 text-sm">
        Koleksi hadits dengan <b>status/derajat</b> (shahih · hasan · dha'if) &amp; <b>sumber</b> yang jelas.
        Netral: derajat = metadata ber-sumber, bukan penghakiman.
      </p>

      {!idx || idx.collections.length === 0 ? (
        <div className="card mt-6 p-8 text-center mut">Belum ada data hadits.</div>
      ) : (
        <>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {idx.collections.map((c) => (
              <li key={c.key}>
                <Link href={`/hadits/${c.key}`} className="card block p-4 transition hover:opacity-90">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{c.name_id}</span>
                    {c.partial && <span className="mut rounded px-1.5 py-0.5 text-[10px]" style={{ background: "var(--bg-soft)" }}>sebagian</span>}
                  </div>
                  <div className="mut mt-1 text-xs">{c.name}</div>
                  <div className="mut mt-2 text-xs">
                    {c.partial ? `${c.count} dari ${c.total}` : `${c.count}`} hadits
                    {c.graded > 0 && <> · <span className="green">{c.graded} ber-grade</span></>}
                    · bahasa: {c.langs.join("/")}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="card mt-5 p-4 text-xs mut">
            Sumber: <b>{idx.provenance.name}</b> · {idx.provenance.license} ·{" "}
            <a href={idx.provenance.url} target="_blank" rel="noreferrer" className="gold">tautan</a>.
            {idx.provenance.note && <> {idx.provenance.note}</>} Koleksi penuh Kutub as-Sittah = langkah skala berikutnya.
          </div>
        </>
      )}
    </div>
  );
}
