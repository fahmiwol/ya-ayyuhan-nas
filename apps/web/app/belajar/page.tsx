import Link from "next/link";
import { getDeen, type Dalil, type DeenTrack } from "@/lib/deen";

export const metadata = { title: "Dasar Keislaman — Ya Ayyuhan Nas" };

function DalilChips({ dalil }: { dalil?: Dalil[] }) {
  if (!dalil || dalil.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {dalil.map((d, i) => (
        <Link key={i} href={d.href} className="rounded px-2 py-0.5 text-[11px]"
          style={{ border: `1px solid ${d.type === "ayah" ? "var(--green)" : "var(--gold)"}`, color: d.type === "ayah" ? "var(--green)" : "var(--gold)" }}>
          {d.type === "ayah" ? "📖" : "🗒️"} {d.label}
        </Link>
      ))}
    </div>
  );
}

function Track({ t, color }: { t: DeenTrack; color: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-baseline gap-2">
        <h3 className="font-semibold" style={{ color }}>{t.title}</h3>
        {t.subtitle && <span className="mut text-xs">{t.subtitle}</span>}
      </div>
      {t.body && <p className="mut mt-2 text-sm leading-relaxed">{t.body}</p>}
      {t.items && (
        <ol className="mt-3 space-y-2">
          {t.items.map((it, i) => (
            <li key={i} className="text-sm">
              <span className="font-medium">{i + 1}. {it.title}</span>
              {it.body && <span className="mut"> — {it.body}</span>}
            </li>
          ))}
        </ol>
      )}
      <DalilChips dalil={t.dalil} />
    </div>
  );
}

export default async function BelajarPage() {
  const d = await getDeen();
  if (!d) return <div className="mx-auto max-w-3xl px-4 py-10 mut">Materi belum tersedia.</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">{d.title} <span className="gold">{d.subtitle}</span></h1>
      <p className="mut mt-2 text-sm leading-relaxed">{d.intro}</p>

      {/* Jelajahi — domain dasar keislaman */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { href: "/belajar/asma-ul-husna", icon: "✨", t: "Asma'ul Husna", d: "99 nama Allah" },
          { href: "/belajar/nabi", icon: "☝️", t: "25 Nabi & Rasul", d: "para utusan Allah" },
          { href: "/belajar/malaikat", icon: "👼", t: "Malaikat", d: "nama & tugas" },
        ].map((x) => (
          <Link key={x.href} href={x.href} className="card p-4 transition hover:opacity-90">
            <div className="text-2xl">{x.icon}</div>
            <div className="mt-1 font-semibold">{x.t}</div>
            <div className="mut text-xs">{x.d} →</div>
          </Link>
        ))}
      </div>

      {/* Roadmap */}
      <h2 className="mt-8 text-lg font-semibold">{d.roadmap.title}</h2>
      <ol className="mt-3 space-y-3">
        {d.roadmap.steps.map((s) => (
          <li key={s.n} className="card flex gap-3 p-4">
            <span className="grid h-8 w-8 flex-none place-items-center rounded-full text-sm font-semibold" style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}>{s.n}</span>
            <div className="min-w-0">
              <div className="font-semibold">{s.title}</div>
              {s.body && <p className="mut mt-0.5 text-sm leading-relaxed">{s.body}</p>}
              <DalilChips dalil={s.dalil} />
            </div>
          </li>
        ))}
      </ol>

      {/* Iman / Islam / Ihsan */}
      <h2 className="mt-8 text-lg font-semibold">Iman · Islam · Ihsan</h2>
      <div className="mt-3 grid grid-cols-1 gap-3">
        <Track t={d.tracks.islam} color="var(--green)" />
        <Track t={d.tracks.iman} color="var(--gold)" />
        <Track t={d.tracks.ihsan} color="var(--txt)" />
      </div>

      {/* Shalat */}
      <h2 className="mt-8 text-lg font-semibold">{d.shalat.title}</h2>
      <div className="card mt-3 p-4">
        <div className="flex flex-wrap gap-2">
          {d.shalat.waktu.map((w) => (
            <span key={w.name} className="rounded-lg border px-3 py-1.5 text-sm" style={{ borderColor: "var(--line)" }}>
              {w.name} <b className="gold">{w.rakaat}</b> rakaat
            </span>
          ))}
        </div>
        <div className="mut mt-4 text-xs uppercase tracking-wide">Rukun shalat (garis besar)</div>
        <ol className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {d.shalat.rukun.map((r, i) => <li key={i}>{i + 1}. {r}</li>)}
        </ol>
        <p className="mut mt-3 text-[11px] leading-relaxed">⚠ {d.shalat.note}</p>
        <DalilChips dalil={d.shalat.dalil} />
      </div>

      {/* Glossary */}
      <h2 className="mt-8 text-lg font-semibold">Glossary Istilah</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {d.glossary.map((g) => (
          <div key={g.term} className="card p-3 text-sm">
            <b className="gold">{g.term}</b> <span className="mut">— {g.def}</span>
          </div>
        ))}
      </div>

      <div className="card mt-8 p-4 text-xs mut">
        Sumber: {d.source.name} · {d.source.license}. {d.source.note}
      </div>
    </div>
  );
}
