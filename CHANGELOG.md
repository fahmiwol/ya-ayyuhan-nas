# Changelog — Ya Ayyuhan Nas

Format: semver, tiap entri menulis WHY. Riwayat sebelum Nov 2026 ada di `07_EPISODIC.md` dan `git log`.

## 0.4.1 - 2026-11-13 — antrean hati-hati
- `pipeline/lab-hati-hati.json` + `lab-next.mjs --hati-hati`: ayat rawan tanzih/ghaib/fiqih masuk antrean terlihat
  (5 ayat dari batch10), jalur biasa tidak pernah mengusulkannya, jumlahnya selalu dicetak. WHY: keputusan pilot atas
  delegasi Fahmi 13 Nov: jangan dilewati diam-diam; penulis opus, G2 diperketat (butir H1–H5), G3 Fahmi per kajian.
- Juga memperbaiki `lab-next` yang mengusulkan ulang ayat yang sudah ditolak.

## 0.4.0 - 2026-11-13 — batch ramping 10 kajian (181 kajian)
- +10 kajian lewat G1, G2 (5 revisi satu putaran) dan G3 Fahmi ("Terbit"). WHY: menguji cara hemat
  (sesi baru, Sonnet, satu G2 per batch) untuk menjawab "300 ayat cukup dengan 4 %?". Biaya < 1 % mingguan.
- Cakupan 317 ayat, kandidat backlog 14,9 %.

## 0.3.0 - 2026-11-13 — kajian harian pertama terbit (171 kajian)
- +3 kajian: QS 2:11-12, QS 6:11, QS 34:10-11. WHY: Fahmi minta tiga ayat yang berguna diproses dengan
  metode yang ada; ketiganya lolos G1, G2 (setelah satu revisi) dan G3 (Fahmi: "Terbit").
- coverage/graph/corpus dibangkitkan ulang; backlog dicentang. Cakupan 307 ayat.

## 0.2.1 - 2026-11-13 — ritme harian "izin dulu"
- `pipeline/lab-next.mjs`: pilih ayat berikutnya tanpa model (deterministik; kandidat pertama QS 2:11).
  WHY: langkah pagi harus murah; model besar baru dipakai setelah Fahmi menjawab "tulis".
- EPIC-002: alur izin dulu + pembagian model hemat (tanya: haiku; tulis: opus/medium; G2: sonnet/medium; turunan: skrip).
  WHY: Fahmi 13 Nov: "minta izin saya, yg hemat usage jadinya". Tugas terjadwal 05:30 WIB hanya bertanya.

## 0.2.0 - 2026-11-13 — hidup lagi di quran.migancore.com
- **Live** di `https://quran.migancore.com`, mode baca-saja (rilis `6ef967a`). WHY: Fahmi menyetujui D-001
  ("Setuju, jalankan"); app mati sejak server lamanya mati (Agu 2026).
- `apps/web/middleware.ts`: build `NEXT_PUBLIC_MODE_BACA=1` menutup akun/admin/tinjau + API tulis (404).
  WHY: tidak mengumpulkan data pribadi dan tidak butuh Postgres di server bersama.
- Fix: halaman tertutup menjawab 404 langsung, bukan rewrite. WHY: di balik nginx, rewrite memakai
  `X-Forwarded-Proto: https` lalu gagal memproksi ke https://localhost (500). Tes kontrak kini meniru header proxy.
- `docs/08-ops/DEPLOY.md` menggantikan `deploy/README.md` (jalur Docker di server lama).

## 0.1.1 - 2026-11-13
- **Rencana menghidupkan lagi Lab Tadabbur** (PRD-001, D-001, EPIC-001, EPIC-002, fungsi gerbang tinjauan).
  WHY: Fahmi 13 Nov minta app di-live-kan lagi di ekosistem MiganExp (migancore.com) dan ditambah satu
  interpretasi ayat per hari dengan metode yang sekarang. Semua dokumen berstatus `draft` sampai Fahmi setuju.
- D-001 (disetujui): `quran.migancore.com` di VPS-2, mode baca-saja (tanpa akun/Postgres), systemd port 3120.
  WHY: DNS sudah mengarah ke VPS-2; vhost belum ada sehingga alamat itu kini menampilkan situs lain dengan
  sertifikat salah; mode baca-saja menghindari pengumpulan data pribadi.
- Skill `tadabbur-lab`: frontmatter SPT + peringatan bahwa jalur deploy `sidix-vps` sudah mati.
  WHY: agen berikutnya jangan mengikuti langkah deploy ke server yang sudah tidak ada.
- `CLAUDE.md` = `@AGENTS.md` (isi sama, satu sumber); `AGENTS.md` mendapat bagian "Mulai sesi".

## 0.1.0 - 2026-11-12
- Proyek dipasangi Standar Proyek Tiranyx v1 (profil web). HANDOFF dan LIVING_LOG masuk `.gitignore` (repo publik).
