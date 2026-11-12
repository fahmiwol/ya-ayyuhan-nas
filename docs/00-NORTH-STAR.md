---
id: NORTH-STAR
jenis: north-star
judul: Ya Ayyuhan Nas
status: draft
cluster: inti
terkait: [PRD-001, D-001]
dibuat: 2026-11-12
diubah: 2026-11-13
---

# North Star — Ya Ayyuhan Nas

> LOCK: ubah hanya lewat dokumen keputusan (`tambah keputusan`).
> Disusun ulang dari dokumen yang sudah ada (`01_PRD.md`, `24_MISSION_PHILOSOPHY.md`, `CLAUDE.md`),
> bukan arah baru. Bila bertentangan, `24_MISSION_PHILOSOPHY.md` dan Hukum Besi `CLAUDE.md` menang.

## Visi (2–3 tahun)
Mushaf digital yang keasliannya bisa dibuktikan (114 surah, 6.236 ayat, hash per ayat, satu Merkle
root), dan di atasnya **Lab Tadabbur**: arsip terbuka interpretasi rekayasa yang membaca **pola
ciptaan** (āyāt kauniyah) lalu menurunkannya menjadi prinsip desain sistem, terutama AI/agen.
Lab tumbuh pelan tapi tetap: **satu kajian ayat per hari**, tiap kajian lewat gerbang tinjauan.

## Masalah yang diselesaikan
1. Pengguna aplikasi Qur'an tidak bisa memeriksa sendiri bahwa teksnya utuh.
2. Pola yang ditunjuk Al-Qur'an jarang dibaca secara sistematis sebagai bahan rekayasa, dan bila
   dibaca, sering tercampur klaim "mukjizat numerik" atau tafsir tanpa sumber.

## Sasaran & metrik (angka, kapan)
| Sasaran | Angka | Kapan |
|---|---|---|
| App hidup lagi di URL publik | `https://quran.migancore.com` 200, Merkle root cocok | setelah D-001 disetujui |
| Kajian bertambah | 168 → ≥198 kajian (≈30/bulan) | 30 hari setelah ritme jalan |
| Mutu | 0 pelanggaran `lab-validate`, 0 kajian terbit tanpa lolos gerbang | terus-menerus |
| Cakupan tema | 72/596 kandidat backlog (12,1 %) → ≥100/596 | 30 hari setelah ritme jalan |

## Non-goal (sengaja tidak dikerjakan)
- Menafsir atau menetapkan hukum/fatwa. Lab = interpretasi rekayasa, **bukan tafsir, bukan dalil**.
- Memodelkan Allah (Dzat dan Sifat-Nya) dalam bentuk apa pun (batas tanzih).
- Spekulasi perkara ghaib di luar teks (kiamat, ruh, akhirat hanya dibaca deskriptif dari tafsir bersumber).
- Menyalin teks ayat ke data Lab; mengubah teks kanonik.
- Klaim "mukjizat numerik"; monetisasi agresif; feed sosial.

## Batasan (dana, waktu, infra, lisensi)
- Tanpa biaya server baru: menumpang VPS-2 ekosistem MiganExp (migancore.com).
- Kode MIT; teks Al-Qur'an bukan milik siapa pun; terjemahan/tafsir mengikuti lisensi sumbernya (`NOTICE.md`).
- Satu orang pemilik (Fahmi) sebagai penyetuju terbit; peninjau ahli nyata belum ada.

## Pengguna utama
- Pembaca Muslim Indonesia yang ingin membaca mushaf dan memeriksa keasliannya.
- Insinyur/peneliti AI yang mencari prinsip desain dari pola ciptaan (Lab, sintesis 33 prinsip, blueprint 8 lapis).
