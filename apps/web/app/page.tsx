import { getIndex } from "@/lib/mushaf";
import { SurahList } from "@/components/SurahList";
import { HomeHero } from "@/components/HomeHero";

export default async function HomePage() {
  const { meta, surahs } = await getIndex();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <HomeHero meta={meta} />
      <SurahList surahs={surahs} />
    </div>
  );
}
