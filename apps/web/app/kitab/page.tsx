import Link from "next/link";
import { getKitab } from "@/lib/kitab";

export const metadata = { title: "Kitab — Ya Ayyuhan Nas" };

export default async function KitabPage() {
  const k = await getKitab();
  if (!k) return <div className="mx-auto max-w-3xl px-4 py-10 mut">Data kitab belum tersedia.</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">{k.title.split(" ")[0]} <span className="gold">{k.title.split(" ").slice(1).join(" ")}</span></h1>
      <p className="mut mt-2 text-sm">{k.subtitle}. Netral & ber-sumber.</p>

      {k.fields.map((f) => (
        <section key={f.key} className="mt-8">
          <h2 className="text-lg font-semibold gold">{f.title}</h2>
          <div className="mt-3 space-y-2">
            {f.works.map((w, i) => (
              <div key={i} className="card p-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-semibold">{w.title}</span>
                  {w.title_ar && w.title_ar !== "—" && <span className="arabic-title gold" style={{ fontSize: "1.15rem" }}>{w.title_ar}</span>}
                </div>
                <div className="mut mt-1 text-xs">{w.author} · {w.era}</div>
                {w.note && <p className="mut mt-1 text-sm">{w.note}</p>}
                {w.in_app && <Link href={w.in_app} className="green mt-1 inline-block text-xs">→ tersedia di app</Link>}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="card mt-8 p-4 text-xs mut">Sumber: {k.source.name} · {k.source.license}. {k.source.note}</div>
    </div>
  );
}
