"use client";
// i18n ringan (global). UI multi-bahasa; konten (Quran/terjemah) sudah multi-bahasa via data.
// Locale disimpan di localStorage; set <html lang/dir> (RTL utk Arab).

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "id" | "en" | "ar";
export const LOCALES: { code: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "id", label: "Indonesia", dir: "ltr" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

type Dict = Record<string, string>;
const DICT: Record<Locale, Dict> = {
  id: {
    "nav.surah": "Surah", "nav.hadith": "Hadits", "nav.learn": "Belajar", "nav.dua": "Doa", "nav.kitab": "Kitab", "nav.story": "Kisah", "nav.lab": "Lab", "nav.notes": "Catatan", "nav.integrity": "Integritas",
    "brand.tagline": "Muslim & Islamic Archive",
    "home.title": "Al-Qur'an Digital",
    "home.subtitle": "{surah} surah · {ayah} ayat · riwayat {riwayah} · rasm {rasm}. Teks disalin harfiah & terverifikasi kriptografis (satu huruf pun tidak berubah).",
    "home.verified": "Terverifikasi",
    "search.surah": "Cari surah… (nama / nomor)",
    "mode.baca": "Baca", "mode.identitas": "Identitas", "mode.tilawah": "Tilawah", "mode.catat": "Catat",
    "mode.baca.hint": "Baca biasa",
    "mode.identitas.hint": "Klik ayat/kata → identitas & bukti",
    "mode.tilawah.hint": "Klik ayat → Qari bacakan",
    "mode.catat.hint": "Stabilo + catatan pribadi",
    "hint.baca": "Mode Baca — pilih mode (Identitas / Tilawah / Catat) di ikon.",
    "hint.identitas": "Mode Identitas — klik ayat/kata untuk lihat identitas & bukti.",
    "hint.tilawah": "Mode Tilawah — klik ayat, Qari membacakan.",
    "hint.catat": "Mode Catat — klik ayat untuk stabilo + catatan pribadi (bersumber).",
    "reader.translation": "Terjemahan", "reader.perWord": "Per-kata",
    "reader.continuous": "Putar terus", "reader.playSurah": "Putar surah", "reader.stop": "Stop",
    "reader.surahList": "Daftar surah",
    "catatan.title": "Buku Catatan Pribadi",
    "catatan.subtitle": "Catatan & stabilo-mu, dikelompokkan per jenis. Privat — tersimpan di perangkat ini.",
  },
  en: {
    "nav.surah": "Surahs", "nav.hadith": "Hadith", "nav.learn": "Learn", "nav.dua": "Du'a", "nav.kitab": "Library", "nav.story": "Stories", "nav.lab": "Lab", "nav.notes": "Notes", "nav.integrity": "Integrity",
    "brand.tagline": "Muslim & Islamic Archive",
    "home.title": "Digital Qur'an",
    "home.subtitle": "{surah} surahs · {ayah} verses · {riwayah} narration · {rasm} script. Text copied verbatim & cryptographically verified (not one letter changed).",
    "home.verified": "Verified",
    "search.surah": "Search surah… (name / number)",
    "mode.baca": "Read", "mode.identitas": "Identity", "mode.tilawah": "Recite", "mode.catat": "Note",
    "mode.baca.hint": "Plain reading",
    "mode.identitas.hint": "Click verse/word → identity & proof",
    "mode.tilawah.hint": "Click verse → reciter plays",
    "mode.catat.hint": "Highlight + private notes",
    "hint.baca": "Read mode — pick a mode (Identity / Recite / Note) from the icons.",
    "hint.identitas": "Identity mode — click a verse/word to see its identity & proof.",
    "hint.tilawah": "Recite mode — click a verse, the reciter plays it.",
    "hint.catat": "Note mode — click a verse to highlight + write a private (sourced) note.",
    "reader.translation": "Translation", "reader.perWord": "Per-word",
    "reader.continuous": "Autoplay", "reader.playSurah": "Play surah", "reader.stop": "Stop",
    "reader.surahList": "Surah list",
    "catatan.title": "Personal Notebook",
    "catatan.subtitle": "Your notes & highlights, grouped by type. Private — stored on this device.",
  },
  ar: {
    "nav.surah": "السور", "nav.hadith": "الحديث", "nav.learn": "تعلَّم", "nav.dua": "الأدعية", "nav.kitab": "المكتبة", "nav.story": "القصص", "nav.lab": "المختبر", "nav.notes": "الملاحظات", "nav.integrity": "الأصالة",
    "brand.tagline": "أرشيف إسلامي",
    "home.title": "القرآن الرقمي",
    "home.subtitle": "{surah} سورة · {ayah} آية · رواية {riwayah} · رسم {rasm}. نص منسوخ حرفيًا ومُتحقَّق منه تشفيريًا (لا يتغير حرف واحد).",
    "home.verified": "مُتحقَّق",
    "search.surah": "ابحث عن سورة… (اسم / رقم)",
    "mode.baca": "قراءة", "mode.identitas": "الهوية", "mode.tilawah": "تلاوة", "mode.catat": "تدوين",
    "mode.baca.hint": "قراءة عادية",
    "mode.identitas.hint": "انقر آية/كلمة ← الهوية والإثبات",
    "mode.tilawah.hint": "انقر آية ← يتلو القارئ",
    "mode.catat.hint": "تظليل + ملاحظات خاصة",
    "hint.baca": "وضع القراءة — اختر وضعًا (الهوية / تلاوة / تدوين) من الأيقونات.",
    "hint.identitas": "وضع الهوية — انقر آية/كلمة لعرض هويتها وإثباتها.",
    "hint.tilawah": "وضع التلاوة — انقر آية ليتلوها القارئ.",
    "hint.catat": "وضع التدوين — انقر آية للتظليل وكتابة ملاحظة خاصة (بمصدر).",
    "reader.translation": "الترجمة", "reader.perWord": "كلمة بكلمة",
    "reader.continuous": "تشغيل متتابع", "reader.playSurah": "تشغيل السورة", "reader.stop": "إيقاف",
    "reader.surahList": "قائمة السور",
    "catatan.title": "دفتر الملاحظات الخاص",
    "catatan.subtitle": "ملاحظاتك وتظليلاتك، مُصنَّفة حسب النوع. خاصة — محفوظة على هذا الجهاز.",
  },
};

interface I18n {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}
const Ctx = createContext<I18n | null>(null);
const KEY = "mushaf.locale.v1";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Locale | null;
      if (saved && DICT[saved]) setLocaleState(saved);
    } catch {}
  }, []);

  const dir = LOCALES.find((l) => l.code === locale)?.dir ?? "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem(KEY, l); } catch {}
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    let s = DICT[locale][key] ?? DICT.id[key] ?? key;
    if (params) for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };

  return <Ctx.Provider value={{ locale, dir, setLocale, t }}>{children}</Ctx.Provider>;
}

export function useT(): I18n {
  const c = useContext(Ctx);
  if (!c) throw new Error("useT must be used within LocaleProvider");
  return c;
}
