import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSurah, getSurahList } from "@/lib/mushaf";
import { Reader } from "@/components/Reader";

// Pre-render 114 surah -> statis, cepat, offline-friendly.
export async function generateStaticParams() {
  const list = await getSurahList();
  return list.map((s) => ({ number: String(s.number) }));
}

export async function generateMetadata({ params }: { params: Promise<{ number: string }> }): Promise<Metadata> {
  const { number } = await params;
  const s = await getSurah(Number(number));
  if (!s) return { title: "Surah tidak ditemukan — MUSHAF" };
  return { title: `${s.number}. ${s.name_latin} — MUSHAF`, description: `Baca Surah ${s.name_latin} (${s.ayah_count} ayat).` };
}

export default async function SurahPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const n = Number(number);
  const surah = await getSurah(n);
  if (!surah) notFound();
  return <Reader surah={surah} />;
}
