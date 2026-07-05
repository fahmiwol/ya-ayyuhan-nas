"use client";

import { useEffect } from "react";
import { useSettings, type Mode } from "@/lib/settings";
import { useT } from "@/lib/i18n";

const MODES: { id: Mode; icon: string; key: string }[] = [
  { id: "baca", icon: "📖", key: "r" },
  { id: "identitas", icon: "🔍", key: "i" },
  { id: "tilawah", icon: "🔦", key: "q" },
  { id: "catat", icon: "🖊️", key: "c" },
];

export function ModeDock() {
  const { mode, set } = useSettings();
  const { t } = useT();

  // keyboard shortcut per mode (abaikan saat mengetik di input)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
      const m = MODES.find((x) => x.key === e.key.toLowerCase());
      if (m) set({ mode: m.id });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [set]);

  return (
    <div
      className="mode-dock card"
      role="toolbar"
      aria-label="Mode interaksi"
    >
      {MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => set({ mode: m.id })}
            title={`${t(`mode.${m.id}`)} — ${t(`mode.${m.id}.hint`)} (${m.key.toUpperCase()})`}
            aria-pressed={active}
            className="mode-btn"
            style={{
              borderColor: active ? "var(--gold)" : "transparent",
              background: active ? "var(--bg-soft)" : "transparent",
              color: active ? "var(--gold)" : "var(--mut)",
            }}
          >
            <span className="mode-ico" aria-hidden>{m.icon}</span>
            <span className="mode-lbl">{t(`mode.${m.id}`)}</span>
          </button>
        );
      })}
    </div>
  );
}
