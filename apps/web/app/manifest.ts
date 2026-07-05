import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MUSHAF — Al-Qur'an Digital",
    short_name: "MUSHAF",
    description: "Al-Qur'an digital terverifikasi, Arab + terjemahan, offline-first.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e1411",
    theme_color: "#0e1411",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
