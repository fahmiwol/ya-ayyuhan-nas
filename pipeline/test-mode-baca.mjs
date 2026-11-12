// pipeline/test-mode-baca.mjs — read-only mode contract (D-001, EPIC-001 S2).
// Runs against a live server: node pipeline/test-mode-baca.mjs <baseUrl>
// e.g. node pipeline/test-mode-baca.mjs http://127.0.0.1:3120
//      node pipeline/test-mode-baca.mjs https://quran.migancore.com
// Exit 0 = all checks pass. Used before deploy (local) and after deploy (live).

const base = (process.argv[2] || "http://127.0.0.1:3120").replace(/\/$/, "");

const checks = [
  // Core pages must stay readable.
  { name: "beranda", path: "/", status: 200 },
  { name: "surah 1", path: "/surah/1", status: 200 },
  { name: "integritas", path: "/integritas", status: 200 },
  { name: "lab", path: "/lab", status: 200 },
  { name: "lab sintesis", path: "/lab/sintesis", status: 200 },
  { name: "satu kajian", path: "/lab/abasa-80-18-22", status: 200 },
  // Account, admin and review surfaces are closed.
  { name: "halaman akun", path: "/akun", status: 404 },
  { name: "halaman moderasi", path: "/admin/moderasi", status: 404 },
  { name: "halaman tinjau", path: "/tinjau", status: 404 },
  // Write APIs are closed (no personal data collected).
  { name: "daftar akun", path: "/api/auth/signup", method: "POST", body: { name: "t", email: "t@example.invalid", password: "x".repeat(12) }, status: 404 },
  { name: "masuk", path: "/api/auth/signin", method: "POST", body: { email: "t@example.invalid", password: "x" }, status: 404 },
  { name: "keluar", path: "/api/auth/signout", method: "POST", status: 404 },
  { name: "catatan server", path: "/api/notes", status: 404 },
  { name: "migrasi catatan", path: "/api/notes/migrate", method: "POST", body: { notes: [] }, status: 404 },
  { name: "tulis tinjauan", path: "/api/v1/reviews", method: "POST", body: {}, status: 404 },
  // Read endpoints the UI calls on every page answer harmlessly.
  { name: "auth/me kosong", path: "/api/auth/me", status: 200, json: (j) => j && j.user === null },
  { name: "tinjauan kosong", path: "/api/v1/reviews", status: 200, json: (j) => Array.isArray(j?.reviews) && j.reviews.length === 0 },
];

let fail = 0;
for (const c of checks) {
  // Mimic the nginx proxy in production (it sends X-Forwarded-Proto: https); without it a local
  // run missed a 500 that only appeared behind the proxy (13 Nov 2026).
  const init = { method: c.method || "GET", redirect: "manual", headers: { "X-Forwarded-Proto": "https" } };
  if (c.body) { init.headers["Content-Type"] = "application/json"; init.body = JSON.stringify(c.body); }
  let got = "ERR", ok = false, why = "";
  try {
    const r = await fetch(base + c.path, init);
    got = r.status;
    ok = r.status === c.status;
    if (ok && c.json) {
      const j = await r.json().catch(() => null);
      ok = !!c.json(j);
      if (!ok) why = ` body=${JSON.stringify(j).slice(0, 80)}`;
    }
  } catch (e) { why = ` ${e.message}`; }
  console.log(`${ok ? "✓" : "✗"} ${c.name.padEnd(18)} ${(c.method || "GET").padEnd(4)} ${c.path} → ${got} (harap ${c.status})${why}`);
  if (!ok) fail++;
}
console.log(fail ? `\n✗ ${fail} gagal dari ${checks.length}` : `\n✓ SEMUA LULUS — ${checks.length} cek`);
process.exit(fail ? 1 : 0);
