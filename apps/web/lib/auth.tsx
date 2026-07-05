"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type Role = "user" | "contributor" | "reviewer" | "admin";
export interface Account { id: string; name: string; email: string; role: Role; createdAt: string }

interface AuthApi {
  user: Account | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>; // return error|null
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthApi | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/me", { cache: "no-store" });
      const j = await r.json();
      setUser(j.user ?? null);
    } catch { setUser(null); }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const signIn = async (email: string, password: string) => {
    const r = await fetch("/api/auth/signin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const j = await r.json();
    if (!r.ok) return j.error ?? "Gagal masuk.";
    setUser(j.user); return null;
  };
  const signUp = async (name: string, email: string, password: string) => {
    const r = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    const j = await r.json();
    if (!r.ok) return j.error ?? "Gagal daftar.";
    setUser(j.user); return null;
  };
  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthApi {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
