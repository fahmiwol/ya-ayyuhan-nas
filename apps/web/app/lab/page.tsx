import Link from "next/link";
import { getLabIndex, getLabTaxonomy, getLabCoverage } from "@/lib/lab";

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
  const [idx, tax, cov] = await Promise.all([getLabIndex(), getLabTaxonomy(), getLabCoverage()]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Lab <span className="gold">Tadabbur</span> <span className="text-base">🧪</span></h1>
      <p className="mut mt-2 text-sm">
        Kita belajar dari Al-Qur&apos;an & menyintesis <b>pola/cara penciptaan</b> (āyāt kauniyah): bagaimana manusia
        dicipta, akal dibuat berpikir, siklus siang-malam, penyembuhan, pertumbuhan, kemandirian — lalu
        di-<b>interpretasi rekayasa</b> lewat lensa komputasional/AI/lintas-domain, untuk diwujudkan <i>artificial</i>.
        Yang dibaca adalah <b>pola pada ciptaan</b>, bukan Sang Pencipta — Allah tetap di luar segala interpretasi (<i>tanzih</i>).
      </p>

      {/* GUARDRAIL — selalu paling atas */}
      <div className="mt-4 rounded-lg border p-3 text-sm" style={{ borderColor: "#3b82f6", background: "#3b82f614" }}>
        <b style={{ color: "#3b82f6" }}>🧪 Bukan tafsir.</b>{" "}
        <span className="mut">Seluruh isi Lab = analogi struktural / eksperimen berpikir — <b>bukan</b> tafsir, <b>bukan</b> dalil,
        <b> bukan</b> klaim atas maksud Ilahi. Teks ayat selalu ditarik dari mushaf kanonik terverifikasi (Merkle);
        makna religius dirujuk ke tafsir bersumber. Netral: tidak menguji kebenaran Al-Qur&apos;an.</span>
      </div>

      {/* Peta cakupan — jujur, terlacak */}
      {cov && (
        <div className="card mt-5 p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <b className="text-sm">📊 Cakupan tadabbur</b>
            <span className="mut text-[10px]">diperbarui {cov.updated}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { n: cov.studies, l: "kajian" },
              { n: cov.direct_ayat, l: "ayat distudi langsung" },
              { n: cov.touched_ayat, l: "ayat tersentuh (+bukti)" },
              { n: cov.principles, l: "prinsip temuan" },
            ].map((x) => (
              <div key={x.l}><div className="text-xl font-bold gold">{x.n}</div><div className="mut text-[11px]">{x.l}</div></div>
            ))}
          </div>
          {/* progress bar terhadap kandidat backlog (denominator jujur) */}
          <div className="mt-3">
            <div className="mut mb-1 flex justify-between text-[11px]">
              <span>Progres atas {cov.candidates_total} ayat kandidat (bertema, hasil sweep 6236 ayat)</span>
              <span>{cov.candidates_done}/{cov.candidates_total} · {cov.pct_of_candidates}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--bg-soft)" }}>
              <div className="h-full rounded-full" style={{ width: `${Math.max(2, cov.pct_of_candidates)}%`, background: "var(--gold)" }} />
            </div>
            <div className="mut mt-1 text-[10px]">Ini maraton, bukan sprint: {cov.touched_ayat} dari 6236 ayat ({cov.pct_of_total}%). Denominator jujur = kandidat bertema; ayat naratif/hukum berulang tak dipaksa jadi kajian. Tumbuh tiap wave.</div>
          </div>
        </div>
      )}

      {/* Mesin Temuan + Peta Pengetahuan */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link href="/lab/sintesis" className="card block p-4 transition hover:opacity-90" style={{ borderColor: "#3b82f6" }}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold" style={{ color: "#3b82f6" }}>🧬 Sintesis Lintas-Kajian</span>
            <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ border: "1px solid #3b82f6", color: "#3b82f6" }}>Peta Hipotesis Pola</span>
          </div>
          <div className="mut mt-1 text-xs">Pola lintas-kajian yang dicatat <b>untuk diuji & ditinjau</b> → prinsip desain + <b>Kerangka Analogi Agen Digital</b> (bukan klaim Qur&apos;an mendesain AI). Buka →</div>
        </Link>
        <Link href="/lab/graph" className="card block p-4 transition hover:opacity-90" style={{ borderColor: "var(--gold)" }}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold gold">🕸️ Peta Pengetahuan</span>
            <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}>Second Brain</span>
          </div>
          <div className="mut mt-1 text-xs">Graf kajian ↔ prinsip ↔ kerangka yang saling tertaut + <b>ekspor korpus siap-ML</b> (embed/RAG/fine-tune). Buka →</div>
        </Link>
      </div>

      {/* Mulai dari sini — 5 kajian awal (onboarding pengguna baru) */}
      {(() => {
        const starters = [
          { id: "fatihah-1-1-7", t: "Al-Fatihah", d: "protokol pembuka & kalibrasi" },
          { id: "iqra-96-1-5", t: "Iqra'", d: "READ → ENCODE → LEARN" },
          { id: "hujurat-49-6", t: "Fatabayyanū", d: "verifikasi sebelum bertindak" },
          { id: "nahl-16-43", t: "Ahl adz-Dzikr", d: "tanya ahli, jangan mengarang" },
          { id: "mizan-55-5-9", t: "Mīzān", d: "hitung & keseimbangan" },
        ].filter((s) => (idx?.studies ?? []).some((x) => x.id === s.id));
        return starters.length ? (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">▶️ Mulai dari sini</h2>
            <p className="mut mt-1 text-xs">Baru pertama? Lima kajian ini paket pengantar yang enak diikuti.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {starters.map((s, i) => (
                <Link key={s.id} href={`/lab/${s.id}`} className="card px-3 py-2 text-sm transition hover:opacity-90">
                  <b className="gold">{i + 1}. {s.t}</b> <span className="mut text-xs">— {s.d}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null;
      })()}

      {/* Daftar kajian */}
      <h2 className="mt-8 text-lg font-semibold">Semua kajian ({(idx?.studies ?? []).length})</h2>
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
