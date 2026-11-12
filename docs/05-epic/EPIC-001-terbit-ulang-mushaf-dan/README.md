---
id: EPIC-001
jenis: epic
judul: Terbit ulang mushaf dan Lab mode baca-saja
status: draft
cluster: inti
terkait: [PRD-001, D-001]
dibuat: 2026-11-12
diubah: 2026-11-13
---

# EPIC-001 · Terbit ulang mushaf + Lab, mode baca-saja

## Tujuan
`https://quran.migancore.com` hidup lagi di VPS-2 dengan mushaf terverifikasi dan Lab Tadabbur, tanpa akun dan tanpa Postgres.

## PRD sumber
PRD-001 · rute: D-001.

## Story
| # | Story | Uji terima |
|---|---|---|
| S1 | Buka arsip repo GitHub (Fahmi) | `gh repo view --json isArchived` → `false` |
| S2 | Flag `NEXT_PUBLIC_MODE_BACA=1`: sembunyikan menu akun/catatan/admin/tinjau; API `auth/*`, `notes/*`, tulis `v1/reviews` → 404 | tes merah dulu, lalu hijau; `curl` API tulis → 404 |
| S3 | Build standalone + uji lokal 6 halaman inti di 375 px dan 1280 px | tangkapan layar + tidak ada galat konsol |
| S4 | VPS-2: pengguna `quran`, `/srv/migancore/quran/{rilis/<sha>,kini}`, `quran-web.service` di `127.0.0.1:3120` | `curl -I 127.0.0.1:3120` → 200 |
| S5 | Vhost baru + `nginx -t` + reload + certbot | `curl -I https://quran.migancore.com` → 200, sertifikat sah |
| S6 | Verifikasi live + app lain tidak berubah | tabel kode status sebelum → sesudah semua vhost VPS-2 |
| S7 | Runbook `docs/08-ops/DEPLOY.md` (terbit, rilis data, rollback) | dibaca dan dicoba sekali oleh rilis data pertama |

Langkah S4–S6 mengubah server live: masing-masing butuh izin Fahmi (MiganExp D-049 §5).

## Definition of Done
Kriteria terima PRD-001 untuk bagian live terpenuhi dan terverifikasi di URL publik; `CHANGELOG.md`,
`07_EPISODIC.md`, `HANDOFF.md` diperbarui; `deploy/README.md` lama ditandai digantikan oleh `docs/08-ops/DEPLOY.md`.
