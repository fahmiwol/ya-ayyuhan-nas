# Changelog — Ya Ayyuhan Nas

Format: semver, tiap entri menulis WHY. Riwayat sebelum Nov 2026 ada di `07_EPISODIC.md` dan `git log`.

## 0.1.1 - 2026-11-13 (cabang `rencana/lab-tadabbur-live`, belum di-merge)
- **Rencana menghidupkan lagi Lab Tadabbur** (PRD-001, D-001, EPIC-001, EPIC-002, fungsi gerbang tinjauan).
  WHY: Fahmi 13 Nov minta app di-live-kan lagi di ekosistem MiganExp (migancore.com) dan ditambah satu
  interpretasi ayat per hari dengan metode yang sekarang. Semua dokumen berstatus `draft` sampai Fahmi setuju.
- D-001 mengusulkan `quran.migancore.com` di VPS-2, mode baca-saja (tanpa akun/Postgres), systemd port 3120.
  WHY: DNS sudah mengarah ke VPS-2; vhost belum ada sehingga alamat itu kini menampilkan situs ABRA dengan
  sertifikat salah; mode baca-saja menghindari pengumpulan data pribadi.
- Skill `tadabbur-lab`: frontmatter SPT + peringatan bahwa jalur deploy `sidix-vps` sudah mati.
  WHY: agen berikutnya jangan mengikuti langkah deploy ke server yang sudah tidak ada.
- `CLAUDE.md` = `@AGENTS.md` (isi sama, satu sumber); `AGENTS.md` mendapat bagian "Mulai sesi".

## 0.1.0 - 2026-11-12
- Proyek dipasangi Standar Proyek Tiranyx v1 (profil web). HANDOFF dan LIVING_LOG masuk `.gitignore` (repo publik).
