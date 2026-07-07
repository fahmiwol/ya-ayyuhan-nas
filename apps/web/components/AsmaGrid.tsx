"use client";
import { useMemo, useState } from "react";
import type { AsmaItem } from "@/lib/belajar";

export function AsmaGrid({ items }: { items: AsmaItem[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((x) => x.latin.toLowerCase().includes(s) || x.arti.toLowerCase().includes(s) || String(x.n) === s || x.arab.includes(q.trim()));
  }, [q, items]);

  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama… (mis. rahman / pengasih / 55)"
        className="mb-4 w-full rounded-xl border px-4 py-2.5 outline-none" style={{ background: "var(--panel)", borderColor: "var(--line)", color: "var(--txt)" }} />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((x) => (
          <div key={x.n} className="card flex items-center gap-3 p-3">
            <span className="grid h-8 w-8 flex-none place-items-center rounded-lg text-xs font-semibold" style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}>{x.n}</span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{x.latin}</div>
              <div className="mut text-xs">{x.arti}</div>
            </div>
            <div className="arabic-title gold flex-none" style={{ fontSize: "1.5rem" }}>{x.arab}</div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="mut mt-6 text-center">Tak ada nama cocok &quot;{q}&quot;.</p>}
    </div>
  );
}
