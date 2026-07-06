import Link from "next/link";
import { notFound } from "next/navigation";
import { getLabIndex, getLabStudy, getLabTaxonomy } from "@/lib/lab";
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

export default async function LabStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [study, tax] = await Promise.all([getLabStudy(id), getLabTaxonomy()]);
  if (!study) notFound();

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
      <LabStudyView study={study} ayat={ayat} lenses={tax?.lenses ?? []} surahName={surah.name_latin} />
    </div>
  );
}
