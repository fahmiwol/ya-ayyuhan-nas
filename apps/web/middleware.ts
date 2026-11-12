// apps/web/middleware.ts — read-only mode (D-001, EPIC-001 S2).
// When the build is made with NEXT_PUBLIC_MODE_BACA=1 the public deployment collects
// no personal data: account/admin/review pages and every write API answer 404, while
// the two read endpoints the UI calls on every page answer harmlessly.
// The flag is inlined at build time, so the shipped artifact itself is read-only.
import { NextResponse, type NextRequest } from "next/server";

const MODE_BACA = process.env.NEXT_PUBLIC_MODE_BACA === "1";

const CLOSED_PAGES = [/^\/akun(\/|$)/, /^\/admin(\/|$)/, /^\/tinjau(\/|$)/];

const notFoundJson = () => NextResponse.json({ error: "not_found" }, { status: 404 });

export function middleware(req: NextRequest) {
  if (!MODE_BACA) return NextResponse.next();
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();

  // UI asks "who am I" on every page: answer "nobody" without touching any store.
  if (pathname === "/api/auth/me") return NextResponse.json({ user: null });
  // Review badges are read on every page: no reviews in read-only mode.
  if (pathname === "/api/v1/reviews" && (method === "GET" || method === "HEAD")) {
    return NextResponse.json({ reviews: [] });
  }
  if (pathname.startsWith("/api/auth/") || pathname === "/api/notes" || pathname.startsWith("/api/notes/") || pathname === "/api/v1/reviews") {
    return notFoundJson();
  }
  if (CLOSED_PAGES.some((re) => re.test(pathname))) {
    // Render the app's own 404 page with a real 404 status.
    return NextResponse.rewrite(new URL("/__mode-baca-tidak-ada", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*", "/api/notes", "/api/notes/:path*", "/api/v1/reviews", "/akun/:path*", "/admin/:path*", "/tinjau/:path*"],
};
