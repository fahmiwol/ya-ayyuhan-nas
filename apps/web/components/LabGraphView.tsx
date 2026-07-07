"use client";
// Peta pengetahuan Lab (second-brain). Graf gaya-terarah ringan (tanpa lib eksternal):
// layout dihitung deterministik saat mount, lalu SVG statis + hover/klik + zoom.
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LabGraph, GraphNode } from "@/lib/lab";

const CLUSTER_COLOR: Record<string, string> = {
  "ai-core": "#3b82f6", cognition: "#a855f7", learning: "#22c55e", systems: "#14b8a6",
  epistemics: "#eab308", society: "#f97316", life: "#ec4899", attestation: "#06b6d4",
  framework: "#f59e0b", misc: "#64748b",
};
const color = (c: string) => CLUSTER_COLOR[c] ?? "#64748b";

export function LabGraphView({ graph }: { graph: LabGraph }) {
  const router = useRouter();
  const [hover, setHover] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [mounted, setMounted] = useState(false); // graf gaya-terarah = klien saja (hindari hydration mismatch)
  useEffect(() => setMounted(true), []);
  const svgRef = useRef<SVGSVGElement>(null);

  // === layout gaya-terarah (deterministik) ===
  const pos = useMemo(() => {
    const W = 1000, H = 700;
    const N = graph.nodes;
    const P: Record<string, { x: number; y: number }> = {};
    // seed melingkar per-cluster (deterministik — tanpa random)
    const clusters = [...new Set(N.map((n) => n.cluster))];
    N.forEach((n, i) => {
      const ci = clusters.indexOf(n.cluster);
      const ca = (ci / clusters.length) * Math.PI * 2;
      const cx = W / 2 + Math.cos(ca) * 260, cy = H / 2 + Math.sin(ca) * 200;
      const a = (i * 2.399963); // golden angle
      P[n.id] = { x: cx + Math.cos(a) * (30 + (i % 7) * 9), y: cy + Math.sin(a) * (30 + (i % 7) * 9) };
    });
    const idx = Object.fromEntries(N.map((n) => [n.id, n]));
    const adj = graph.edges.filter((e) => idx[e.s] && idx[e.t]);
    for (let it = 0; it < 320; it++) {
      // repulsi
      for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) {
        const a = P[N[i].id], b = P[N[j].id];
        let dx = a.x - b.x, dy = a.y - b.y; let d2 = dx * dx + dy * dy || 1;
        const f = 2600 / d2; const d = Math.sqrt(d2);
        dx /= d; dy /= d; a.x += dx * f; a.y += dy * f; b.x -= dx * f; b.y -= dy * f;
      }
      // tarikan sepanjang edge
      for (const e of adj) {
        const a = P[e.s], b = P[e.t];
        let dx = b.x - a.x, dy = b.y - a.y; const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const rest = e.rel === "term" ? 130 : 70; const f = (d - rest) * 0.012 * (e.w || 1);
        dx /= d; dy /= d; a.x += dx * f; a.y += dy * f; b.x -= dx * f; b.y -= dy * f;
      }
      // tarik ke pusat
      for (const n of N) { P[n.id].x += (W / 2 - P[n.id].x) * 0.004; P[n.id].y += (H / 2 - P[n.id].y) * 0.004; }
    }
    return P;
  }, [graph]);

  const idx = useMemo(() => Object.fromEntries(graph.nodes.map((n) => [n.id, n])), [graph]);
  // node yang tersorot: node aktif + tetangganya
  const neighbors = useMemo(() => {
    const sel = active ?? hover; if (!sel) return null;
    const s = new Set<string>([sel]);
    for (const e of graph.edges) { if (e.s === sel) s.add(e.t); if (e.t === sel) s.add(e.s); }
    return s;
  }, [active, hover, graph.edges]);

  const nodeR = (n: GraphNode) => (n.type === "framework" ? 11 : n.type === "principle" ? 8 : 5);
  const onClick = (n: GraphNode) => {
    if (n.type === "study") router.push(`/lab/${n.id}`);
    else setActive(active === n.id ? null : n.id);
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="mut">Zoom</span>
        <button onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))} className="rounded border px-2" style={{ borderColor: "var(--line)" }}>+</button>
        <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))} className="rounded border px-2" style={{ borderColor: "var(--line)" }}>−</button>
        {(graph.clusters ?? []).map((c) => (
          <span key={c.key} className="inline-flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color(c.key) }} />{c.title.split(/[ ,&]/)[0]}</span>
        ))}
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color("framework") }} />Kerangka</span>
      </div>
      <div className="card overflow-hidden p-0" style={{ background: "var(--panel)" }}>
        {!mounted ? (
          <div className="grid place-items-center mut text-sm" style={{ height: "min(70vh,640px)" }}>Menyusun peta…</div>
        ) : (
        <svg ref={svgRef} viewBox={`0 0 1000 700`} width="100%" style={{ display: "block", height: "min(70vh,640px)", cursor: "grab" }}>
          <g transform={`translate(500,350) scale(${zoom}) translate(-500,-350)`}>
            {graph.edges.map((e, i) => {
              const a = pos[e.s], b = pos[e.t]; if (!a || !b) return null;
              const dim = neighbors && !(neighbors.has(e.s) && neighbors.has(e.t));
              return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={e.rel === "term" ? "var(--gold)" : "var(--line)"}
                strokeWidth={e.rel === "term" ? 0.5 : e.w * 0.5} strokeOpacity={dim ? 0.05 : e.rel === "term" ? 0.25 : 0.5} />;
            })}
            {graph.nodes.map((n) => {
              const p = pos[n.id]; if (!p) return null;
              const dim = neighbors && !neighbors.has(n.id);
              const sel = (active ?? hover) === n.id;
              return (
                <g key={n.id} transform={`translate(${p.x},${p.y})`} style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} onClick={() => onClick(n)}>
                  <circle r={nodeR(n) + (sel ? 3 : 0)} fill={color(n.cluster)} fillOpacity={dim ? 0.15 : 1}
                    stroke={n.type === "study" ? "none" : "#0006"} strokeWidth={0.5} />
                  {(sel || n.type === "framework" || (!neighbors && n.type === "principle")) && (
                    <text x={nodeR(n) + 3} y={3} fontSize={n.type === "framework" ? 10 : 8} fill="var(--txt)" fillOpacity={dim ? 0.3 : 0.9}
                      style={{ pointerEvents: "none" }}>{n.label.length > 34 ? n.label.slice(0, 32) + "…" : n.label}</text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
        )}
      </div>
      {(active ?? hover) && idx[active ?? hover ?? ""] && (
        <div className="mut mt-2 text-xs">
          <b style={{ color: color(idx[(active ?? hover)!].cluster) }}>{idx[(active ?? hover)!].label}</b>
          {" "}· {idx[(active ?? hover)!].type}{idx[(active ?? hover)!].ref ? ` · QS ${idx[(active ?? hover)!].ref}` : ""}
          {idx[(active ?? hover)!].type === "study" && <span> — klik untuk buka kajian</span>}
        </div>
      )}
    </div>
  );
}
