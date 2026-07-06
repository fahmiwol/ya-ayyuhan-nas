import Link from "next/link";
import { getSessionUser } from "@/lib/auth-server";
import { getHadithIndex, getHadithCollection } from "@/lib/hadith";
import { getStore } from "@/lib/store";
import { ReviewQueue, type QueueItem } from "@/components/ReviewQueue";

export const metadata = { title: "Antrean Tinjau — MUSHAF" };
export const dynamic = "force-dynamic"; // gated by session

export default async function TinjauPage() {
  const user = await getSessionUser();
  if (!user || (user.role !== "reviewer" && user.role !== "admin")) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Antrean Tinjau</h1>
        <p className="mut mt-3">Halaman ini khusus <b>reviewer/admin</b> — untuk menilai &amp; mengesahkan konten (Eval-Gate).</p>
        <p className="mut mt-1 text-sm">{user ? `Akun kamu berperan "${user.role}".` : "Kamu belum masuk."}</p>
        <Link href="/" className="green mt-4 inline-block text-sm">← Beranda</Link>
      </div>
    );
  }

  const idx = await getHadithIndex();
  const items: QueueItem[] = [];
  for (const c of idx?.collections ?? []) {
    const coll = await getHadithCollection(c.key);
    if (!coll) continue;
    for (const h of coll.hadiths) {
      items.push({
        ref: `hadith:${c.key}:${h.number}`,
        kind: "hadith",
        collection: c.name_id,
        number: h.number,
        arabic: h.arabic,
        text: h.tr?.id ?? h.tr?.id_auto ?? h.tr?.en ?? null,
        machine: !h.tr?.id && !!h.tr?.id_auto,
        grades: h.grades ?? [],
        provenance: { source: coll.provenance?.name, license: coll.provenance?.license, url: coll.provenance?.url, note: coll.provenance?.note },
      });
    }
  }
  const reviews = await (await getStore()).listReviews();
  return <ReviewQueue items={items} reviews={reviews} reviewer={user.name} />;
}
