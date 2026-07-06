import Link from "next/link";
import { getDoa } from "@/lib/doa";

export const metadata = { title: "Doa — Ya Ayyuhan Nas" };

function gradeColor(g?: string): string {
  if (!g) return "var(--mut)";
  const s = g.toLowerCase();
  if (s.includes("sahih") || s.includes("shahih")) return "var(--green)";
  if (s.includes("hasan")) return "var(--gold)";
  if (s.includes("da")) return "#e0664f";
  return "var(--mut)";
}

export default async function DoaPage() {
  const d = await getDoa();
  if (!d) return <div className="mx-auto max-w-3xl px-4 py-10 mut">Data doa belum tersedia.</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Kumpulan <span className="gold">Doa</span></h1>
      <p className="mut mt-2 text-sm">{d.subtitle}. Netral & ber-sumber.</p>

      {d.categories.map((cat) => (
        <section key={cat.key} className="mt-8">
          <h2 className="text-lg font-semibold">{cat.title}</h2>
          {cat.note && <p className="mut mt-1 text-xs">{cat.note}</p>}
          <div className="mt-3 space-y-3">
            {cat.duas.map((doa, i) => (
              <div key={i} className="card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{doa.title}</span>
                  <span className="mut rounded px-1.5 py-0.5 text-[10px]" style={{ background: "var(--bg-soft)" }}>{doa.occasion}</span>
                  {doa.grade && <span className="rounded px-1.5 py-0.5 text-[10px]" style={{ border: `1px solid ${gradeColor(doa.grade)}`, color: gradeColor(doa.grade) }}>{doa.grade}</span>}
                </div>

                {doa.text_ar && <p className="arabic mt-3" style={{ fontSize: "1.7rem", lineHeight: 2 }}>{doa.text_ar}</p>}
                {doa.translit && <p className="mut mt-2 text-sm italic">{doa.translit}</p>}
                <p className="mt-2 text-[0.95rem] leading-relaxed">{doa.meaning}</p>

                <div className="mut mt-2 flex flex-wrap items-center gap-2 text-xs">
                  {doa.href && doa.ref && (
                    <Link href={doa.href} className="rounded px-2 py-0.5" style={{ border: "1px solid var(--green)", color: "var(--green)" }}>📖 {doa.ref}</Link>
                  )}
                  {doa.source && <span>📎 {doa.source}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="card mt-8 p-4 text-xs mut">Sumber: {d.source.name} · {d.source.license}. {d.source.note}</div>
    </div>
  );
}
