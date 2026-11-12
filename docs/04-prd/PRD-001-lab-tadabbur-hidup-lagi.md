---
id: PRD-001
jenis: prd
judul: Lab Tadabbur hidup lagi dan ritme kajian harian
status: draft
cluster: inti
terkait: [NORTH-STAR, D-001, EPIC-001, EPIC-002, FUNGSI-gerbang-tinjauan-kajian]
dibuat: 2026-11-12
diubah: 2026-11-13
---

# PRD-001 · Lab Tadabbur hidup lagi + ritme kajian harian

## Masalah
- `quran.migancore.com` mati sejak VPS-1 mati (Agu 2026). Hari ini alamat itu malah menampilkan situs
  lain yang menumpang di server yang sama, dengan sertifikat salah (lihat D-001 § Konteks).
- Lab berhenti di 168 kajian (Wave 16, Jul 2026). Cakupan: 302 ayat tersentuh dari 6.236 (4,8 %);
  72 dari 596 kandidat backlog (12,1 %). Arahan Fahmi 13 Nov 2026: hidupkan lagi sebagai aplikasi dan
  tambah interpretasi ayat **setiap hari** dengan cara yang sekarang.

## Pengguna & skenario
1. **Pembaca** membuka `quran.migancore.com`, membaca surah, memeriksa halaman Integritas (Merkle root cocok).
2. **Peneliti/insinyur AI** membuka `/lab`, membaca satu kajian (ayat dari mushaf kanonik, makna dari tafsir
   bersumber, lensa rekayasa berlabel "Interpretasi — bukan tafsir"), lalu `/lab/sintesis` (33 prinsip, kerangka 8 lapis).
3. **Fahmi (penyetuju)** menerima satu draf kajian per hari beserta kartu tinjauan, lalu menyetujui atau meminta revisi.

## Sasaran & metrik keberhasilan
| Metrik | Sebelum (13 Nov) | Sasaran |
|---|---|---|
| `https://quran.migancore.com` | sertifikat salah, isi situs lain | 200, sertifikat sah, isi Ya Ayyuhan Nas |
| Halaman inti live (beranda, surah, integritas, lab, sintesis, 1 kajian) | 0/6 | 6/6 |
| Jumlah kajian | 168 | +1 per hari yang lolos gerbang (≈30/bulan) |
| Kajian terbit tanpa lolos gerbang | — | 0 |
| `lab-validate` | 0 pelanggaran | tetap 0 |

## Ruang lingkup / di luar lingkup
**Dalam:** terbit ulang mode baca-saja (EPIC-001); ritme satu kajian/hari dengan gerbang tinjauan (EPIC-002);
alat bantu pilih-ayat-berikutnya; dokumentasi + catatan.
**Di luar:** akun pengguna, catatan pribadi, admin, `/tinjau` (dibuka lewat keputusan baru + tinjauan
keamanan); Fase 2–4 roadmap lama (RAG, tajwid); pengesahan kajian oleh AI; perbaikan umum vhost bawaan VPS-2.

## Kebutuhan fungsional
1. App jalan tanpa Postgres; flag mode baca-saja menyembunyikan menu akun/catatan/admin/tinjau dan API tulis menjawab 404.
2. Boot gagal tertutup bila Merkle root tidak cocok (Hukum Besi #2; perilaku yang sudah ada dipertahankan).
3. Alat `pipeline/lab-next.mjs` mengusulkan ayat berikutnya secara terurut dan bisa diulang (EPIC-002 §Pilih ayat).
4. Kajian baru masuk sebagai `status: "draft"` di cabang sendiri; hanya berubah `published` setelah gerbang G1–G3 lolos.
5. Setiap kajian terbit tetap berlabel "menunggu tinjauan ahli"; AI tidak pernah mengisi `review` selain `pending`.
6. Setelah terbit: `lab-coverage`, `lab-graph`, `lab-corpus` dibangkitkan ulang; backlog `[x]`; `07_EPISODIC.md` + `CHANGELOG.md`.

## Kebutuhan non-fungsional (keamanan, performa, biaya)
- Tidak mengumpulkan data pribadi (mode baca-saja).
- Bind `127.0.0.1`; hanya nginx yang terbuka; vhost baru tanpa menyentuh vhost app lain.
- Biaya server tambahan Rp0 (VPS-2 yang ada). Biaya model: satu sesi penulis + satu sesi peninjau per hari.
- Teks pengguna mengikuti skill `bahasa-lazim`.

## Kriteria terima
- [ ] 6/6 halaman inti 200 di URL publik, sertifikat sah, Integritas menunjukkan root cocok.
- [ ] App lain di VPS-2 menjawab sama seperti sebelum deploy (daftar kode status sebelum → sesudah).
- [ ] Kajian harian pertama: lolos G1 (keluaran perintah), G2 (kartu tertulis), G3 (persetujuan Fahmi tercatat), lalu tampil live.
- [ ] `docs/09-log/HANDOFF.md`, `CHANGELOG.md`, `07_EPISODIC.md` diperbarui; `brain_learn` tercatat.

## Risiko & asumsi
| Risiko | Penanganan |
|---|---|
| Kajian dibaca sebagai tafsir atau klaim "Qur'an mendesain AI" | Label tetap di tiap halaman; bahasa pelunakan (`23_STRATEGY_DOMAINS_FEEDBACK.md` §A); G2 memeriksa |
| Pelanggaran tanzih/ghaib lolos | `lab-validate` tanzih-lint + G2 + G3 manusia; satu sorotan lama (`furqan-25-53`) ditinjau di G3 pertama |
| Draf menumpuk bila Fahmi sibuk | Penulis berhenti bila ≥3 draf menunggu G3 |
| Kualitas turun karena ritme | Satu kajian/hari, bukan target lensa; boleh lewati hari tanpa draf |
| Repo masih diarsipkan | Fahmi membuka arsip (D-001 langkah 1) |

## Pertanyaan terbuka (keputusan Fahmi)
1. Setuju rute D-001 (`quran.migancore.com`, VPS-2, mode baca-saja, systemd port 3120)?
2. Boleh buka arsip repo GitHub `fahmiwol/ya-ayyuhan-nas`?
3. Ritme harian: boleh dipasang sebagai tugas terjadwal? Jam berapa (usul 05:30 WIB, draf siap dibaca pagi)?
4. Persetujuan G3 lewat apa: menyetujui PR di GitHub (usulan), atau balasan di sesi Claude?
5. Persetujuan G3 sekaligus izin terbit rilis data ke VPS-2 (tanpa izin terpisah per hari)? Rilis kode tetap izin terpisah.
