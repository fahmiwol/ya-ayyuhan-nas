import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Ya Ayyuhan Nas — Muslim & Islamic Archive Library",
  description:
    "Arsip Islam: Al-Qur'an (rasm Uthmani, Hafs) terverifikasi kriptografis, word-by-word, audio multi-qari, terjemahan. Tiap ayat ber-identitas & bisa dianotasi. Offline-first, sumber terbuka.",
  manifest: "/manifest.webmanifest",
  applicationName: "Ya Ayyuhan Nas",
};

export const viewport: Viewport = {
  themeColor: "#0e1411",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
