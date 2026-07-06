"use client";

import Link from "next/link";
import { useSettings } from "@/lib/settings";
import { useT, LOCALES, type Locale } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { AuthButton } from "./AuthButton";

export function Header() {
  const { theme, set } = useSettings();
  const { t, locale, setLocale } = useT();
  const { user } = useAuth();
  const canReview = user?.role === "reviewer" || user?.role === "admin";
  return (
    <header
      style={{ borderColor: "var(--line)", background: "var(--bg-soft)" }}
      className="sticky top-0 z-20 flex items-center gap-4 border-b px-4 py-3"
    >
      <Link href="/" className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--gold)", color: "#1a130a" }}>
          ﷽
        </span>
        <span className="leading-tight">
          <span className="arabic-title block text-base font-bold gold" style={{ direction: "rtl" }}>يَا أَيُّهَا النَّاس</span>
          <span className="mut block text-[10px] tracking-wide">{t("brand.tagline")}</span>
        </span>
      </Link>
      <nav className="mut ml-2 hidden gap-4 text-sm sm:flex">
        <Link href="/" className="hover:opacity-80">{t("nav.surah")}</Link>
        <Link href="/hadits" className="hover:opacity-80">{t("nav.hadith")}</Link>
        <Link href="/belajar" className="hover:opacity-80">{t("nav.learn")}</Link>
        <Link href="/doa" className="hover:opacity-80">{t("nav.dua")}</Link>
        <Link href="/kitab" className="hover:opacity-80">{t("nav.kitab")}</Link>
        <Link href="/kisah" className="hover:opacity-80">{t("nav.story")}</Link>
        <Link href="/lab" className="hover:opacity-80">🧪 {t("nav.lab")}</Link>
        <Link href="/catatan" className="hover:opacity-80">{t("nav.notes")}</Link>
        <Link href="/integritas" className="hover:opacity-80">{t("nav.integrity")}</Link>
        {canReview && <Link href="/tinjau" className="gold hover:opacity-80">⚖️ Tinjau</Link>}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          aria-label="Bahasa / Language"
          className="rounded-lg border px-2 py-1.5 text-sm"
          style={{ background: "var(--panel)", borderColor: "var(--line)", color: "var(--txt)" }}
        >
          {LOCALES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
        <AuthButton />
        <button
          onClick={() => set({ theme: theme === "dark" ? "light" : "dark" })}
          className="rounded-lg border px-3 py-1.5 text-sm"
          style={{ borderColor: "var(--line)" }}
          aria-label="Tema"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
