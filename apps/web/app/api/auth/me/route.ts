import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserById, readSessionValue, SESSION_COOKIE } from "@/lib/auth-server";

export async function GET() {
  const jar = await cookies();
  const userId = readSessionValue(jar.get(SESSION_COOKIE)?.value);
  const user = await getUserById(userId);
  return NextResponse.json({ user });
}
