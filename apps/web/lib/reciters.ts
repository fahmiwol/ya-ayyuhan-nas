// apps/web/lib/reciters.ts
// Router suara Qari — registry modular. Sumber audio SWAPPABLE:
// default EveryAyah (per-ayat MP3, redistribusi bebas), nanti bisa di-mirror ke R2.
// Ganti AUDIO_BASE (atau per-reciter base) tanpa ubah kode UI.

export interface Reciter {
  id: string;
  name: string;
  style: "murattal" | "mujawwad";
  riwayah: "hafs";
  folder: string; // folder EveryAyah
  bitrate?: string;
}

// Sumber default. Bisa dioverride via env NEXT_PUBLIC_AUDIO_BASE (mis. R2 CDN).
export const AUDIO_BASE =
  process.env.NEXT_PUBLIC_AUDIO_BASE?.replace(/\/$/, "") || "https://everyayah.com/data";

export const AUDIO_PROVENANCE = {
  provider: "EveryAyah.com",
  note: "Audio per-ayat, redistribusi bebas. Produksi: mirror ke Cloudflare R2 (anti vendor-lock).",
  url: "https://everyayah.com",
};

export const RECITERS: Reciter[] = [
  { id: "alafasy", name: "Mishary Rashid Alafasy", style: "murattal", riwayah: "hafs", folder: "Alafasy_128kbps" },
  { id: "sudais", name: "Abdurrahman As-Sudais", style: "murattal", riwayah: "hafs", folder: "Abdurrahmaan_As-Sudais_192kbps" },
  { id: "abdulbasit", name: "Abdul Basit (Murattal)", style: "murattal", riwayah: "hafs", folder: "Abdul_Basit_Murattal_192kbps" },
  { id: "husary", name: "Mahmoud Al-Husary", style: "murattal", riwayah: "hafs", folder: "Husary_128kbps" },
  { id: "minshawi", name: "Muhammad Al-Minshawi", style: "murattal", riwayah: "hafs", folder: "Minshawy_Murattal_128kbps" },
  { id: "ghamdi", name: "Saad Al-Ghamdi", style: "murattal", riwayah: "hafs", folder: "Ghamadi_40kbps" },
];

export function getReciter(id: string): Reciter {
  return RECITERS.find((r) => r.id === id) ?? RECITERS[0];
}

/** URL audio per-ayat. surah:ayah -> mp3 (EveryAyah pola: {sss}{aaa}.mp3). */
export function ayahAudioUrl(reciter: Reciter, surah: number, ayah: number): string {
  const s = String(surah).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");
  return `${AUDIO_BASE}/${reciter.folder}/${s}${a}.mp3`;
}
