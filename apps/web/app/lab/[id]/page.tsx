import Link from "next/link";
import { notFound } from "next/navigation";
import { getLabIndex, getLabStudy, getLabStudyVersion, getLabTaxonomy, getRelated } from "@/lib/lab";
import { getSurah } from "@/lib/mushaf";
import { LabStudyView, type StudyAyah } from "@/components/LabStudyView";

export async function generateStaticParams() {
  const idx = await getLabIndex();
  return (idx?.studies ?? []).map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getLabStudy(id);
  return { title: s ? `${s.title} — Lab Tadabbur` : "Lab Tadabbur — MUSHAF" };
}

export default async function LabStudyPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ v?: string }> }) {
  const { id } = await params;
  const { v } = await searchParams;
  const current = await getLabStudy(id);
  if (!current) notFound();
  // Riwayat tadabbur: ?v=N membuka versi ARSIP (rekaman lama tetap bisa dibaca).
  const wantV = v ? Number(v) : null;
  const archived = wantV && wantV !== current.version ? await getLabStudyVersion(id, wantV) : null;
  if (wantV && wantV !== current.version && !archived) notFound();
  const study = archived ?? current;
  const tax = await getLabTaxonomy();

  // Teks ayat SELALU dari mushaf kanonik ber-Merkle (Lab tak pernah menyimpan teks Qur'an).
  const surah = await getSurah(study.ref.surah);
  if (!surah) notFound();
  const ayat: StudyAyah[] = surah.ayahs
    .filter((a) => a.ayah >= study.ref.from && a.ayah <= study.ref.to)
    .map((a) => ({ ayah: a.ayah, arabic: a.arabic, tr_id: a.tr?.id ?? null, hash: a.hash }));
  if (ayat.length === 0) notFound(); // rujukan tak valid → fail-closed

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mut text-xs"><Link href="/lab" className="hover:underline">🧪 Lab Tadabbur</Link> / {study.id}</div>
      {archived && (
        <div className="mt-3 rounded-lg border p-3 text-sm" style={{ borderColor: "#d97706", background: "#d9770614" }}>
          <b style={{ color: "#d97706" }}>📼 Rekaman lama — versi {study.version}.</b>{" "}
          <span className="mut">Tadabbur ini sudah diperbarui. </span>
          <Link href={`/lab/${study.id}`} className="underline" style={{ color: "#d97706" }}>Lihat versi terkini (v{current.version}) →</Link>
        </div>
      )}
      <LabStudyView study={study} ayat={ayat} lenses={tax?.lenses ?? []} surahName={surah.name_latin} isArchived={!!archived} />
      {/* Kajian terkait (backlink ala wikilink / second-brain) */}
      <RelatedStudies id={study.id} />
    </div>
  );
}

async function RelatedStudies({ id }: { id: string }) {
  const related = await getRelated(id);
  if (related.length === 0) return null;
  return (
    <div className="card mt-4 p-4">
      <b className="text-sm gold">🔗 Kajian terkait</b>
      <p className="mut mt-1 text-xs">Tertaut lewat istilah Qur&apos;ani / prinsip bersama. <Link href="/lab/graph" className="underline">Lihat peta pengetahuan →</Link></p>
      <ul className="mt-2 space-y-1.5">
        {related.map((r) => (
          <li key={r.id} className="text-sm">
            <Link href={`/lab/${r.id}`} className="hover:underline" style={{ color: "var(--green)" }}>{r.title}</Link>
            <span className="mut text-[11px]"> — {r.via}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
