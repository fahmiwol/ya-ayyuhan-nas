"use client";

import { useEffect, type ReactNode } from "react";
import { SettingsProvider } from "@/lib/settings";
import { NotesProvider } from "@/lib/notes";
import { LocaleProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { ReviewProvider } from "@/lib/reviews";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Daftarkan service worker hanya di produksi (hindari cache di dev).
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return (
    <LocaleProvider>
      <AuthProvider>
        <SettingsProvider>
          <ReviewProvider>
            <NotesProvider>{children}</NotesProvider>
          </ReviewProvider>
        </SettingsProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}
