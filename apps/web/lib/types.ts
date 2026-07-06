// apps/web/lib/types.ts — tipe bersama (modular, dipakai UI + API)

export type RevelationPlace = "makkah" | "madinah";
export type Lang = "id" | "en";

// ===== Hadits (lapisan keilmuan; ber-grade + provenance) =====
export interface HadithGrade { by: string | null; grade: string }
export interface Hadith {
  number: number;
  arabicNumber: number;
  arabic: string;
  tr: { en: string | null; id: string | null; id_auto?: string | null };
  grades: HadithGrade[];
}
export interface HadithProvenance { name: string; license: string; url: string; note?: string }
export interface HadithCollectionMeta {
  key: string;
  name: string;
  name_id: string;
  count: number;
  total: number;
  partial: boolean;
  langs: string[];
  graded: number;
}
export interface HadithCollection extends HadithCollectionMeta {
  provenance: HadithProvenance;
  sections: Record<string, string>;
  hadiths: Hadith[];
}
export interface HadithIndex {
  builtAt: string;
  provenance: HadithProvenance;
  collections: HadithCollectionMeta[];
}

export interface MushafMeta {
  merkle_root: string;
  algo: string;
  riwayah: string;
  rasm: string;
  count_method: string;
  surah_count: number;
  ayah_count: number;
  build_version: string;
  built_at: string;
}

export interface SurahSummary {
  number: number;
  name_ar: string;
  name_latin: string;
  name_en: string | null;
  revelation_place: RevelationPlace;
  ayah_count: number;
  order_revelation: number;
  bismillah_pre: boolean;
}

export interface Word {
  p: number;           // posisi
  ar: string;          // teks Arab (Uthmani)
  tl: string | null;   // transliterasi
  tr: string | null;   // arti kata
}

export interface Ayah {
  global: number;
  ayah: number;
  arabic: string;
  skeleton: string;
  juz: number | null;
  page: number | null;
  sajdah: boolean;
  hash: string;
  word_root: string | null; // Merkle-kata (lapisan validasi bawah)
  sources: string[];
  tr: Record<Lang, string | null>;
  words: Word[];
  ann: number;              // jumlah anotasi
}

export interface ProofStep { h: string; dir: "L" | "R" }
export interface AyahProof { key: string; surah: number; ayah: number; hash: string; proof: ProofStep[] }

// Catatan PRIBADI user (zona USER, lokal, tidak dimoderasi). Beda dari Annotation publik.
export type NoteType = "tafsir" | "asbab" | "tajwid" | "kosakata" | "hadith" | "refleksi" | "lainnya";

// Tipe berjenis-ilmu → WAJIB sumber (jelas & akurat).
export const KNOWLEDGE_TYPES: NoteType[] = ["tafsir", "asbab", "tajwid", "kosakata", "hadith"];

export interface NoteSource {
  title: string;
  author?: string;
  url?: string;
}

export interface UserNote {
  id: string;
  surah: number;
  ayah: number;
  word?: number | null;
  color: string;      // warna stabilo
  type: NoteType;
  note: string;       // catatan user sendiri
  source: NoteSource | null; // wajib utk KNOWLEDGE_TYPES
  ayahHash: string;   // tautan ke identitas ayat
  createdAt: string;
  updatedAt: string;
}

export interface Annotation {
  id: string;
  target: { surah: number; ayah: number; word: number | null };
  type: "tafsir" | "remark" | "note" | "asbab" | "lexical";
  lang: string;
  title: string;
  body: string;
  source: { name: string; license: string; url: string | null };
  version: number;
  created_at: string;
}

export interface Surah extends Omit<SurahSummary, "order_revelation"> {
  ayahs: Ayah[];
}

export interface MushafIndex {
  meta: MushafMeta;
  surahs: SurahSummary[];
}
