import Link from "next/link";
import { getLabGraph } from "@/lib/lab";
import { LabGraphView } from "@/components/LabGraphView";

export const metadata = { title: "Peta Pengetahuan — Lab Tadabbur" };

export default async function LabGraphPage() {
  const graph = await getLabGraph();
  if (!graph) return <div className="mx-auto max-w-3xl px-4 py-8 mut">Peta belum tersedia.</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mut text-xs"><Link href="/lab" className="hover:underline">🧪 Lab Tadabbur</Link> / peta</div>
      <h1 className="mt-1 text-2xl font-bold">🕸️ Peta Pengetahuan</h1>
      <p className="mut mt-2 text-sm">
        Jaringan kajian ↔ prinsip ↔ kerangka yang saling tertaut (via istilah Qur&apos;ani & keanggotaan bukti) —
        ala <i>second brain</i> / Obsidian. Titik besar = kerangka, sedang = prinsip, kecil = kajian (klik → buka).
        Garis emas = tautan istilah bersama.
      </p>
      <div className="mut mt-1 text-xs">{graph.stats.nodes} node · {graph.stats.edges} tautan · {graph.stats.studies} kajian · {graph.stats.principles} prinsip · {graph.stats.frameworks} kerangka</div>

      <div className="mt-4"><LabGraphView graph={graph} /></div>

      {/* Ekspor korpus siap-ML */}
      <div className="card mt-6 p-4" style={{ borderColor: "#3b82f6" }}>
        <b className="text-sm" style={{ color: "#3b82f6" }}>🧠 Korpus siap-ML (untuk interpretasi jadi model)</b>
        <p className="mut mt-1 text-sm">
          Seluruh kajian diekspor sebagai <b>chunk ber-metadata</b> (ref ayat, cluster, prinsip, istilah, analogi) —
          siap di-<i>embed</i> / index vektor / RAG / fine-tune. Tiap baris = satu unit reasoning + provenance.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <a href="/data/lab/lab-corpus.jsonl" download className="rounded border px-3 py-1.5" style={{ borderColor: "var(--green)", color: "var(--green)" }}>⬇ lab-corpus.jsonl</a>
          <a href="/data/lab/lab-graph.json" download className="rounded border px-3 py-1.5" style={{ borderColor: "var(--line)" }}>⬇ lab-graph.json</a>
          <a href="/data/lab/synthesis.json" download className="rounded border px-3 py-1.5" style={{ borderColor: "var(--line)" }}>⬇ synthesis.json</a>
        </div>
        <p className="mut mt-2 text-[10px]">Semua chunk bertier <code>interpretation</code> (bukan tafsir/dalil); teks ayat tak disertakan (ambil dari mushaf via <code>ref</code>). Provenance & sumber tafsir tersimpan per chunk.</p>
      </div>
    </div>
  );
}
