// apps/web/lib/store.ts
// Store abstraksi (SERVER only). Dua backend:
//   - Postgres (PgStore)  → dipakai bila DATABASE_URL di-set (produksi/Docker, scalable)
//   - File JSON (FileStore) → fallback dev lokal (tanpa Postgres)
// Kode aplikasi (auth + notes) hanya bicara ke interface ini → mudah di-swap.

export type Role = "user" | "contributor" | "reviewer" | "admin";

export interface StoreUser {
  id: string; name: string; email: string; passwordHash: string; role: Role; createdAt: string;
}
export interface StoreNote {
  id: string; userId: string; surah: number; ayah: number; word: number | null;
  color: string; type: string; note: string; source: unknown; ayahHash: string;
  createdAt: string; updatedAt: string;
}
// Keputusan tinjauan editorial (Eval-Gate) atas satu konten bernarasi.
// Satu keputusan "berlaku" per ref (PRIMARY KEY ref) — upsert menimpa.
export type ReviewDecision = "validated" | "rejected" | "needs_work";
export interface ContentReview {
  ref: string; // mis. "hadith:abudawud:42"
  kind: string; // hadith|tafsir|doa|kisah
  decision: ReviewDecision;
  statusOverride: string | null; // tier override (sahih|hasan|daif|maudhu|disputed|sourced) | null
  note: string | null;
  reviewerId: string;
  reviewerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  init(): Promise<void>;
  getUserByEmail(email: string): Promise<StoreUser | null>;
  getUserById(id: string): Promise<StoreUser | null>;
  countUsers(): Promise<number>;
  createUser(u: StoreUser): Promise<void>;
  listNotes(userId: string): Promise<StoreNote[]>;
  upsertNote(n: StoreNote): Promise<void>;
  deleteNote(userId: string, id: string): Promise<void>;
  listReviews(): Promise<ContentReview[]>;
  upsertReview(r: ContentReview): Promise<void>;
}

let cached: Store | null = null;
let initPromise: Promise<Store> | null = null;

export async function getStore(): Promise<Store> {
  if (cached) return cached;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    let store: Store;
    if (process.env.DATABASE_URL) {
      const { PgStore } = await import("./store-pg");
      store = new PgStore(process.env.DATABASE_URL);
    } else {
      const { FileStore } = await import("./store-file");
      store = new FileStore();
    }
    await store.init();
    cached = store;
    return store;
  })();
  return initPromise;
}

export function backendName(): string {
  return process.env.DATABASE_URL ? "postgres" : "file";
}
