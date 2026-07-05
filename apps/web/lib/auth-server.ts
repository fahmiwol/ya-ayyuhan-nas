// apps/web/lib/auth-server.ts
// Auth server-side: password scrypt + session cookie ber-tanda-tangan HMAC.
// Persistence via Store (Postgres bila DATABASE_URL, else file) — lihat store.ts.
// Produksi: set AUTH_SECRET; tambah rate-limit + CSRF + HTTPS.

import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "node:crypto";
import { getStore, type Role, type StoreUser } from "./store";

export type { Role };
export type PublicUser = { id: string; name: string; email: string; role: Role; createdAt: string };

const SECRET = process.env.AUTH_SECRET || "dev-only-secret-change-me";
const COOKIE = "mushaf_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 hari

export const publicUser = (u: StoreUser): PublicUser => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt });

// --- password (scrypt) ---
export function hashPassword(pw: string): string {
  const salt = randomBytes(16);
  return `${salt.toString("hex")}:${scryptSync(pw, salt, 64).toString("hex")}`;
}
export function verifyPassword(pw: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const hash = scryptSync(pw, Buffer.from(saltHex, "hex"), 64);
  const a = Buffer.from(hashHex, "hex");
  return a.length === hash.length && timingSafeEqual(a, hash);
}

// --- session cookie (signed) ---
function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}
export function makeSessionValue(userId: string): string {
  const body = `${userId}.${Math.floor(Date.now() / 1000) + MAX_AGE}`;
  return `${body}.${sign(body)}`;
}
export function readSessionValue(token: string | undefined): string | null {
  if (!token) return null;
  const [userId, exp, mac] = token.split(".");
  if (!userId || !exp || !mac) return null;
  if (sign(`${userId}.${exp}`) !== mac) return null;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return null;
  return userId;
}
export const SESSION_COOKIE = COOKIE;
export const SESSION_MAX_AGE = MAX_AGE;

// --- operations ---
export async function createUser(name: string, email: string, password: string): Promise<{ user?: PublicUser; error?: string }> {
  name = name.trim(); email = email.trim().toLowerCase();
  if (name.length < 2) return { error: "Nama minimal 2 karakter." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Email tidak valid." };
  if (password.length < 8) return { error: "Password minimal 8 karakter." };
  const store = await getStore();
  if (await store.getUserByEmail(email)) return { error: "Email sudah terdaftar." };
  const first = (await store.countUsers()) === 0; // user pertama = admin (bootstrap)
  const user: StoreUser = {
    id: "u_" + randomBytes(8).toString("hex"),
    name, email, passwordHash: hashPassword(password),
    role: first ? "admin" : "user",
    createdAt: new Date().toISOString(),
  };
  await store.createUser(user);
  return { user: publicUser(user) };
}

export async function authenticate(email: string, password: string): Promise<{ user?: PublicUser; error?: string }> {
  email = email.trim().toLowerCase();
  const store = await getStore();
  const u = await store.getUserByEmail(email);
  if (!u || !verifyPassword(password, u.passwordHash)) return { error: "Email atau password salah." };
  return { user: publicUser(u) };
}

export async function getUserById(id: string | null): Promise<PublicUser | null> {
  if (!id) return null;
  const store = await getStore();
  const u = await store.getUserById(id);
  return u ? publicUser(u) : null;
}

// User dari cookie sesi (dipakai route handler & server component).
export async function getSessionUser(): Promise<PublicUser | null> {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  return getUserById(readSessionValue(jar.get(COOKIE)?.value));
}
