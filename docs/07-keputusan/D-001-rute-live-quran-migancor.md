---
id: D-001
jenis: keputusan
judul: Rute live quran.migancore.com di VPS-2 mode baca-saja
status: aktif
cluster: inti
terkait: [PRD-001, EPIC-001]
dibuat: 2026-11-12
diubah: 2026-11-13
---

# D-001 · Rute live quran.migancore.com di VPS-2, mode baca-saja

> **Status: DISETUJUI Fahmi 13 Nov 2026** ("Setuju, jalankan"). Pertanyaan 3–5 PRD-001 (jadwal, jalur G3, izin rilis data harian) belum dijawab.

## Konteks
- Fahmi, 13 Nov 2026: ya-ayyuhan-nas boleh diterbitkan di MiganExp (migancore.com) dan di-live-kan lagi
  sebagai aplikasi, sambil menambah interpretasi ayat setiap hari dengan cara yang sekarang.
- Dulu hidup di `quran.migancore.com`, container `yan_web` + `yan_db` di VPS-1 (`sidix-vps`,
  `/opt/yaayyuhannas`). **Mati ikut VPS-1** (Omiga `L0a9634aeb3`, Agu 2026). Repo GitHub kemudian
  diarsipkan (diperiksa 13 Nov: `isArchived: true`, publik).
- Keadaan 13 Nov (diperiksa langsung, baca-saja):
  - DNS `quran.migancore.com` → VPS-2 **sudah ada**; begitu juga `migancore.com`.
  - VPS-2 tidak punya vhost untuk `quran.migancore.com`. Host tak dikenal di 443 jatuh ke vhost pertama,
    sehingga `https://quran.migancore.com` menampilkan **situs lain yang menumpang di server yang sama**
    dengan sertifikat salah. Ini membocorkan ekosistem yang wajib terisolasi (MiganExp D-027 §5).
  - VPS-2: disk 64 % (70 GB sisa), RAM 15 GB, 4 CPU, Node 20.20 di host. Beberapa port lokal
    sudah dipakai container lain.
  - `migancore.com` = situs statis MiganExp (`/srv/migancore/web/kini`); path `/lab/` sudah dipakai halaman "Lab Migan".
  - Kode: data mushaf + Lab statis (`apps/web/public/data`, 39 MB). Postgres hanya untuk akun, catatan,
    dan tinjauan (`lib/store.ts`; tanpa `DATABASE_URL` jatuh ke berkas JSON).
  - `lab-validate`: 168 kajian + 33 prinsip + 8 lapis + 3 kerangka lolos; 1 sorotan tanzih-lint
    (`furqan-25-53`, untuk ditinjau). `test-integrity`: 8/8 lulus (6.236 ayat).

## Keputusan (usulan)
| Hal | Pilihan | Alasan singkat |
|---|---|---|
| Domain | **`quran.migancore.com`** (subdomain) | DNS sudah ada, sama dengan tautan di README/GitHub/skill, dan tidak menyentuh vhost `migancore.com` yang hidup. Path `/lab/` sudah dipakai, dan Next.js di bawah path butuh `basePath` + proxy di vhost utama. |
| Server | **VPS-2**, kelompok `/srv/migancore/quran` | MiganExp D-031: VPS-2 untuk layanan hidup MiganExp; pola `rilis/<sha>` + `kini`. Tanpa biaya server baru. |
| Runtime | Next.js `standalone`, **systemd** `quran-web.service`, pengguna Linux sendiri `quran`, bind `127.0.0.1:3120` | Lebih ringan dari Docker + Postgres; sama dengan pola rilis app lain; port lain sudah terpakai. |
| Mode | **Baca-saja**: mushaf, integritas, Lab, sintesis, graf. Akun, catatan, admin, `/tinjau` dimatikan lewat flag | Tidak mengumpulkan data pribadi, tidak perlu Postgres, permukaan serangan kecil. Akun bisa dibuka nanti lewat keputusan baru + tinjauan keamanan. |
| Build | Di laptop/Bmax, bukan di VPS; tarball + sha256 → `rilis/<sha>` | CPU VPS-2 dipakai bersama dan steal-nya tinggi (MiganExp D-049). |
| nginx | Vhost **baru** `quran.migancore.com` → `127.0.0.1:3120`, `nginx -t`, `reload`, `certbot -d quran.migancore.com` | Hanya menambah; tidak menyunting vhost app lain. |
| Yang deploy | Agen pelaksana, **dengan izin Fahmi per langkah** yang mengubah server live | MiganExp D-049 §5. (Bukan jalur Arjuna; itu khusus ekosistem KoraMo.) |
| Repo | Buka arsip `fahmiwol/ya-ayyuhan-nas` | Repo diarsipkan, jadi push dan PR kajian harian tidak bisa. |
| Etalase | Kartu di migancore.com menaut ke `quran.migancore.com` | Tugas terpisah di repo MiganExp, setelah app hidup. |

## Langkah terbit (setelah disetujui)
1. Fahmi membuka arsip repo GitHub (atau mengizinkan agen: `gh repo unarchive`).
2. Kode: flag `NEXT_PUBLIC_MODE_BACA=1` menyembunyikan menu akun/catatan/admin/tinjau dan membuat API
   `auth`, `notes`, `v1/reviews` (tulis) menjawab 404. Tes merah dulu. `lab-validate` + `test-integrity` lulus.
3. Build standalone, uji lokal (preview) per halaman inti di 375 px dan 1280 px.
4. VPS-2 (izin per langkah): buat pengguna `quran` + `/srv/migancore/quran/{rilis,kini}`, salin rilis,
   systemd, cek `curl 127.0.0.1:3120`.
5. Vhost baru + `nginx -t` + reload + certbot.
6. Verifikasi live: `https://quran.migancore.com`, `/integritas` (root cocok), `/lab`, `/lab/sintesis`,
   satu kajian, dan app lain di VPS-2 tetap 200/301 seperti sebelumnya.

## Konsekuensi / batas
- Selama belum disetujui, `quran.migancore.com` tetap menampilkan situs lain dengan sertifikat salah.
  **Perbaikan umum** (server bawaan `default_server` yang menjawab 444 untuk host tak dikenal) menyentuh
  semua domain di VPS-2, jadi diajukan sebagai tugas terpisah, bukan bagian D-001.
- Akun pengguna lama di DB `pg_yan_ALL` (cadangan) tidak dipulihkan pada mode baca-saja.

## Cara membatalkan
`systemctl disable --now quran-web`, hapus symlink vhost, `nginx -t && reload`. Rilis lama tetap di
`rilis/`. DNS tidak perlu diubah.
