import Link from "next/link";
import { getLabIndex, getLabTaxonomy } from "@/lib/lab";

export const metadata = { title: "Lab Tadabbur — MUSHAF" };

// QCA ringkas utk overview (statis; rinci di 14_TADABBUR_LAB_RESEARCH.md)
const QCA = [
  { layer: "Persepsi", term: "naẓar · tawassum", tech: "baca āyāt qauliyah (teks) + kauniyah (alam)" },
  { layer: "Memori & grounding", term: "dhikr · tadhakkur", tech: "retrieval ke korpus terverifikasi (anti-halusinasi)" },
  { layer: "Penalaran", term: "taʿaqqul · tafakkur · tadabbur · tafaqquh", tech: "reasoning + deliberasi kolektif (shūrā)" },
  { layer: "Tangga epistemik", term: "zhann → burhān → yaqīn", tech: "klaim butuh bukti = Eval-Gate" },
  { layer: "Aksi & transfer", term: "iʿtibār · qiyās", tech: "bertindak; transfer learning" },
  { layer: "Umpan balik", term: "muhāsabah", tech: "self-reflection; credit assignment presisi" },
  { layer: "Pelatihan", term: "talaqqī → taṣḥīḥ → tasmīʿ → murājaʿah", tech: "supervised → validasi → recall → spaced repetition" },
  { layer: "Alignment", term: "mīzān · qisṭ · ḥikmah", tech: "constraint pada optimisasi; fairness" },
];

export default async function LabPage() {
  const [idx, tax] = await Promise.all([getLabIndex(), getLabTaxonomy()]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Lab <span className="gold">Tadabbur</span> <span className="text-base">🧪</span></h1>
      <p className="mut mt-2 text-sm">
        Playground <b>interpretasi rekayasa</b>: membaca ayat lewat lensa komputasional, algoritmik, AI/agentic,
        dan lintas-domain — memakai metode berpikir yang Al-Qur&apos;an sendiri ajarkan (<i>tadabbur</i>, QS 4:82).
      </p>

      {/* GUARDRAIL — selalu paling atas */}
      <div className="mt-4 rounded-lg border p-3 text-sm" style={{ borderColor: "#3b82f6", background: "#3b82f614" }}>
        <b style={{ color: "#3b82f6" }}>🧪 Bukan tafsir.</b>{" "}
        <span className="mut">Seluruh isi Lab = analogi struktural / eksperimen berpikir — <b>bukan</b> tafsir, <b>bukan</b> dalil,
        <b> bukan</b> klaim atas maksud Ilahi. Teks ayat selalu ditarik dari mushaf kanonik terverifikasi (Merkle);
        makna religius dirujuk ke tafsir bersumber. Netral: tidak menguji kebenaran Al-Qur&apos;an.</span>
      </div>

      {/* Daftar kajian */}
      <h2 className="mt-8 text-lg font-semibold">Kajian</h2>
      <div className="mt-3 grid grid-cols-1 gap-3">
        {(idx?.studies ?? []).map((s) => (
          <Link key={s.id} href={`/lab/${s.id}`} className="card block p-4 transition hover:opacity-90">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{s.title}</span>
              <span className="rounded px-1.5 py-0.5 text-[10px]" style={{ border: "1px solid var(--green)", color: "var(--green)" }}>📖 {s.ref}</span>
            </div>
            <div className="mut mt-1 text-xs">{s.theme}</div>
            <div className="mut mt-1 text-xs opacity-70">{s.lenses} lensa · Buka kajian →</div>
          </Link>
        ))}
        {(!idx || idx.studies.length === 0) && <div className="card p-8 text-center mut">Belum ada kajian.</div>}
      </div>

      {/* QCA overview */}
      <h2 className="mt-10 text-lg font-semibold">QCA — Qur&apos;anic Cognitive Architecture</h2>
      <p className="mut mt-1 text-sm">Peta istilah kognitif Qur&apos;ani → komponen arsitektur agen. Dasar sintesis Lab ini (riset: <code>14_TADABBUR_LAB_RESEARCH.md</code>).</p>
      <div className="card mt-3 overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead className="mut text-xs uppercase tracking-wide">
            <tr><th className="py-1 pr-3">Lapisan</th><th className="pr-3">Istilah Qur&apos;ani</th><th>Analogi teknis</th></tr>
          </thead>
          <tbody>
            {QCA.map((r) => (
              <tr key={r.layer} className="border-t" style={{ borderColor: "var(--line)" }}>
                <td className="py-1.5 pr-3 font-medium">{r.layer}</td>
                <td className="gold pr-3">{r.term}</td>
                <td className="mut">{r.tech}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Taksonomi istilah kognitif */}
      {tax && (
        <>
          <h2 className="mt-10 text-lg font-semibold">Istilah kognitif Qur&apos;ani (rujukan lensa)</h2>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {tax.cognitive_terms.map((t) => (
              <div key={t.term} className="card p-3 text-sm">
                <div className="flex items-baseline justify-between gap-2">
                  <b className="gold">{t.term}</b>
                  <span className="arabic" style={{ fontSize: "1.1rem" }}>{t.arabic}</span>
                </div>
                <div className="mut mt-1 text-xs">{t.meaning} — {t.operation}</div>
                <div className="mut mt-1 text-[10px]">ayat (klaim sumber): {t.ayat_claimed}</div>
              </div>
            ))}
          </div>
          <div className="card mt-4 p-3 text-xs mut">
            <b>Provenance riset:</b> {tax.provenance.map((p) => p.name).join(" · ")}. Nomor ayat pada istilah = klaim sumber riset (<i>source_claimed</i>) — verifikasi silang ke mushaf sebelum dikutip sebagai dalil.
          </div>
        </>
      )}
    </div>
  );
}
