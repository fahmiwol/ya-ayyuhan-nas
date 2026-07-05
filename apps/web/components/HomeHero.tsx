"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import type { MushafMeta } from "@/lib/types";

export function HomeHero({ meta }: { meta: MushafMeta }) {
  const { t } = useT();
  return (
    <section className="card mb-8 p-6 text-center">
      <h1 className="text-2xl font-bold">{t("home.title")}</h1>
      <p className="mut mx-auto mt-2 max-w-2xl text-sm">
        {t("home.subtitle", { surah: meta.surah_count, ayah: meta.ayah_count, riwayah: meta.riwayah, rasm: meta.rasm })}
      </p>
      <Link href="/integritas" className="green mt-3 inline-block text-xs" title={meta.merkle_root}>
        ✔ {t("home.verified")} — Merkle root {meta.merkle_root.slice(0, 10)}…
      </Link>
    </section>
  );
}
