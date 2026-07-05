"use client";
// Preferensi baca (client): tampil terjemahan?, bahasa, ukuran Arab, tema.
// Disimpan di localStorage. Zona USER — terpisah total dari teks kanonik.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./types";

export type Mode = "baca" | "identitas" | "tilawah" | "catat";

interface SettingsState {
  showTranslation: boolean;
  lang: Lang;
  arabicSize: number; // rem
  theme: "dark" | "light";
  wordByWord: boolean;
  reciter: string; // id qari
  mode: Mode; // mode interaksi (cursor-mode)
}
interface Settings extends SettingsState {
  set: (patch: Partial<SettingsState>) => void;
}

const DEFAULT: SettingsState = {
  showTranslation: true, lang: "id", arabicSize: 1.9, theme: "dark",
  wordByWord: false, reciter: "alafasy", mode: "baca",
};
const Ctx = createContext<Settings | null>(null);
const KEY = "mushaf.settings.v1";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<SettingsState>(DEFAULT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = s.theme;
    document.documentElement.style.setProperty("--arabic-size", `${s.arabicSize}rem`);
  }, [s.theme, s.arabicSize]);

  const set: Settings["set"] = (patch) =>
    setS((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });

  return <Ctx.Provider value={{ ...s, set }}>{children}</Ctx.Provider>;
}

export function useSettings(): Settings {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSettings must be used within SettingsProvider");
  return c;
}
