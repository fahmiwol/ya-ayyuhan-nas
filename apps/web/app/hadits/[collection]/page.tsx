import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getHadithCollection, getHadithIndex } from "@/lib/hadith";
import { HadithReader } from "@/components/HadithReader";

export async function generateStaticParams() {
  const idx = await getHadithIndex();
  return (idx?.collections ?? []).map((c) => ({ collection: c.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params;
  const c = await getHadithCollection(collection);
  return { title: c ? `${c.name_id} — Hadits` : "Hadits" };
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const c = await getHadithCollection(collection);
  if (!c) notFound();
  return <HadithReader c={c} />;
}
