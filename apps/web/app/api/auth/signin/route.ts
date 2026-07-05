import { NextResponse } from "next/server";
import { authenticate, makeSessionValue, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth-server";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const { user, error } = await authenticate(String(email ?? ""), String(password ?? ""));
  if (error || !user) return NextResponse.json({ error: error ?? "gagal" }, { status: 401 });
  const res = NextResponse.json({ user });
  res.cookies.set(SESSION_COOKIE, makeSessionValue(user.id), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_MAX_AGE,
  });
  return res;
}
