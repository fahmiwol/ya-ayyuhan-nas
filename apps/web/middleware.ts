// apps/web/middleware.ts — read-only mode (D-001, EPIC-001 S2).
// When the build is made with NEXT_PUBLIC_MODE_BACA=1 the public deployment collects
// no personal data: account/admin/review pages and every write API answer 404, while
// the two read endpoints the UI calls on every page answer harmlessly.
// The flag is inlined at build time, so the shipped artifact itself is read-only.
import { NextResponse, type NextRequest } from "next/server";

const MODE_BACA = process.env.NEXT_PUBLIC_MODE_BACA === "1";

const CLOSED_PAGES = [/^\/akun(\/|$)/, /^\/admin(\/|$)/, /^\/tinjau(\/|$)/];

// User-facing text follows bahasa-lazim: short, plain, one action.
const CLOSED_PAGE_HTML = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Halaman tidak tersedia — Ya Ayyuhan Nas</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0e1411;color:#e8e4d8;font:16px/1.6 system-ui,sans-serif;padding:16px}main{max-width:420px;text-align:center}a{color:#d4a64a}</style></head><body><main><h1>Halaman ini tidak tersedia</h1><p>Situs ini sedang dalam mode baca. Akun dan catatan di server belum dibuka.</p><p><a href="/">Kembali ke beranda</a></p></main></body></html>`;

const notFoundJson =() => NextResponse.json({ error: "not_found" }, { status: 404 });

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
    // Answer directly. A rewrite built from req.url breaks behind nginx: X-Forwarded-Proto
    // turns it into https://localhost:<port>, which Next then fails to proxy (500).
    return new NextResponse(CLOSED_PAGE_HTML, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*", "/api/notes", "/api/notes/:path*", "/api/v1/reviews", "/akun/:path*", "/admin/:path*", "/tinjau/:path*"],
};
