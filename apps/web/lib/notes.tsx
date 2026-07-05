"use client";
// Buku catatan user (zona USER). Login → tersinkron ke akun (server); logout → lokal (localStorage).
// Login pertama: migrasi catatan lokal → akun (idempoten). TERPISAH dari teks kanonik.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./auth";
import type { UserNote } from "./types";

interface NotesApi {
  notes: UserNote[];
  forAyah: (surah: number, ayah: number) => UserNote[];
  upsert: (n: Omit<UserNote, "id" | "createdAt" | "updatedAt"> & { id?: string }) => UserNote;
  remove: (id: string) => void;
  loaded: boolean;
  synced: boolean; // true bila tersimpan di akun (server)
}

const Ctx = createContext<NotesApi | null>(null);
const KEY = "mushaf.notes.v1";
const genId = () => "note-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [loaded, setLoaded] = useState(false);
  const synced = !!user;

  const persistLocal = (next: UserNote[]) => { try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {} };
  const readLocal = (): UserNote[] => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };

  // Muat: login → migrasi lokal (sekali) lalu ambil dari server; logout → lokal.
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoaded(false);
      if (user) {
        const migFlag = `mushaf.migrated.${user.id}`;
        try {
          const local = readLocal();
          let done = false;
          if (local.length && !localStorage.getItem(migFlag)) {
            const r = await fetch("/api/notes/migrate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes: local }) });
            const j = await r.json();
            if (r.ok) { if (alive) setNotes(j.notes ?? []); localStorage.setItem(migFlag, "1"); done = true; }
          }
          if (!done) {
            const r = await fetch("/api/notes", { cache: "no-store" });
            const j = await r.json();
            if (alive) setNotes(r.ok ? (j.notes ?? []) : []);
          }
        } catch { if (alive) setNotes([]); }
      } else {
        if (alive) setNotes(readLocal());
      }
      if (alive) setLoaded(true);
    })();
    return () => { alive = false; };
  }, [user]);

  const api: NotesApi = {
    notes, loaded, synced,
    forAyah: (surah, ayah) => notes.filter((n) => n.surah === surah && n.ayah === ayah),
    upsert: (input) => {
      const now = new Date().toISOString();
      const prev = input.id ? notes.find((n) => n.id === input.id) : undefined;
      const saved: UserNote = { ...(prev ?? {}), ...input, id: input.id ?? genId(), createdAt: prev?.createdAt ?? now, updatedAt: now } as UserNote;
      const next = input.id && prev ? notes.map((n) => (n.id === saved.id ? saved : n)) : [saved, ...notes];
      setNotes(next);
      if (user) {
        fetch("/api/notes", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(saved) }).catch(() => {});
      } else {
        persistLocal(next);
      }
      return saved;
    },
    remove: (id) => {
      const next = notes.filter((n) => n.id !== id);
      setNotes(next);
      if (user) fetch(`/api/notes?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
      else persistLocal(next);
    },
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useNotes(): NotesApi {
  const c = useContext(Ctx);
  if (!c) throw new Error("useNotes must be used within NotesProvider");
  return c;
}
