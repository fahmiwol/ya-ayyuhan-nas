# 07 — Episodic Log / LIVING_LOG

> Sistem memori proyek. Tujuan: **jangan pernah hilang konteks**. Setiap sprint = 1 entri. Mandatory loop di-enforce di sini.

---

## Cara pakai

1. Setiap unit kerja mengikuti loop:
   ```
   action → catat → test → iterasi → review → push → deploy → catat
   ```
2. Selesai sprint → **append** entri baru di bawah (paling baru di atas, atau kronologis — pilih 1, konsisten).
3. Claude Code / AI builder **wajib baca 3 entri terakhir** sebelum lanjut, biar sync.
4. Commit message harus refer ke entri: `[F1.2] seed full mushaf — WHY: ...`

---

## Template entri

```md
### [FASE.SPRINT] Judul singkat — YYYY-MM-DD

**North Star check:** (masih align? ya/tidak + kenapa)
**Action:** apa yang dikerjakan
**WHY:** kenapa ini penting sekarang (bukan cuma apa)
**Hasil:** apa yang jadi (file/fitur/commit)
**Test:** apa yang dites + hasilnya
**Iterasi:** apa yang diubah setelah test
**Review:** temuan/keputusan/veto owner
**Provenance/Lisensi:** sumber data yang dipakai + status audit
**Integritas:** (kalau nyentuh teks kanonik) root hash / verify status
**Blocker:** ada yang nyangkut?
**Next:** langkah berikutnya
**Feeling owner:** excited / khawatir / nyetel (biar AI baca mood, bukan cuma teknis)
```

---

## Aturan integritas (khusus proyek ini)

- Setiap entri yang menyentuh **teks kanonik** WAJIB isi field **Integritas** (root hash + status verify).
- Kalau root hash berubah → WAJIB ada penjelasan re-seed/re-verify + approval owner. Perubahan diam-diam = pelanggaran hukum besi #1.
- Setiap data baru (terjemahan/tafsir/hadits/audio) WAJIB isi **Provenance/Lisensi**.

---

## LOG

### [F0] Spec & dokumentasi dibuat — 2026-07
**North Star check:** ✅ align — fondasi immutable dulu, tumbuh ke sintesis.
**Action:** susun paket dokumentasi (README, CLAUDE, PRD, ARCHITECTURE, ERD, DATA_SOURCES, RAG, ROADMAP, EPISODIC) dari hasil riset mendalam.
**WHY:** biar Claude Code punya konteks lengkap + arah LOCKED sebelum ngoding, nggak re-pivot.
**Hasil:** 9 file dokumentasi di `docs/`.
**Test:** —
**Review:** urutan fase 1→2→3→4 dikonfirmasi owner. Fase 1 = duplikasi harfiah, bukan Quran baru.
**Provenance/Lisensi:** sumber diinventaris di `04_DATA_SOURCES.md` — ⚠️ audit per-aset saat implementasi.
**Integritas:** belum (belum seed teks).
**Blocker:** —
**Next:** Sprint 1.0 — pipeline seed+verifier untuk 1 surah kecil (buktikan skeleton identik + root hash mini).
**Feeling owner:** excited, mau lanjut ke Claude Code.

---

<!-- Append entri baru di atas garis ini, atau lanjut kronologis di bawah -->

### [F1.26] Menu Kisah/Hikayat (poin 5) — 2026-07-06

**North Star check:** ✅ align — data poin 5 (kisah) ber-sumber & tertaut ayat; kanonik tak tersentuh. **5 poin data roadmap SELESAI (fondasi).**
**Action:** `apps/web/public/data/kisah.json` (kurasi editorial netral): **Kisah Qur'ani** (Adam, Nuh, Ibrahim, Yusuf, Musa, Ashabul Kahfi, Maryam/Isa, Sulaiman, Ayyub, Yunus) + **Kisah Sahabat/Riwayat** (Hijrah/Gua Tsur, Bilal). Tiap kisah: ringkasan + **tautan ayat** + sumber + grade. `lib/kisah.ts`, `components/KisahBrowser.tsx` (kartu klik → **slider** detail + rujukan ayat + sumber, pola Doa), `app/kisah/page.tsx`, nav "Kisah" i18n (id/en/ar).
**WHY:** owner: lanjut sesuai urutan → poin 5 (kisah/hikayat/riwayat).
**Test/verify:** `npm run build` LULUS (138 halaman, /kisah). Verifikasi live setelah redeploy.
**Iterasi:** —.
**Review:** ringkasan editorial (bukan salin kitab); ber-dalil (tautan ayat) + sumber. Dilengkapi & tinjau bertahap (eval-gate).
**Provenance/Lisensi:** Editorial CC-BY + Al-Qur'an/sirah. **Integritas:** root tetap `eb13d58a…8cba7e56`.
**Blocker:** —
**Next:** 5 poin data fondasi done → skala (koleksi penuh, tafsir multi-ulama, asbab, kisah); auto-translate en/ar; formalkan Eval-Gate→moderasi (doc 10) + jalur kontributor.
**Feeling owner:** —

---

### [F1.25] Auto-translate EN→ID (bertanda mesin, valid & transparan) — 2026-07-06

**North Star check:** ✅ align — semua hadits punya Indonesia (owner: auto-translate); validitas dijaga via label; kanonik tak tersentuh.
**Action (respons owner):** `pipeline/auto-translate-hadith.mjs` — hadits yg ada EN tapi belum ID diterjemah mesin (Google gtx → fallback MyMemory) → disimpan **field terpisah `tr.id_auto`** (TIDAK menimpa terjemahan manusia). **95 hadits** dapat MT (Nawawi 42, Qudsi 40, +gap Bukhari/Muslim/AbuDawud). `types.ts` +id_auto; `HadithReader.tsx` pilih: manusia-id → mesin-id (label **"🌐 terjemahan mesin — belum ditinjau ahli"**) → en. Ikut toggle bahasa.
**WHY:** owner: kalau cuma dapat EN, auto-translate ke ID; tapi harus valid → MT ditandai jelas (belum tervalidasi ahli = status eval-gate).
**Test/verify:** `npm run build` LULUS (137). DOM locale=id → Nawawi tampil terjemahan Indonesia + label "terjemahan mesin"; marker "menyusul" hilang.
**Iterasi:** MT via 2 mesin (gtx+MyMemory) resilient; id_auto ≠ id (jaga distingsi manusia vs mesin).
**Review:** JUJUR & VALID — MT ditandai tegas, tak disamakan terjemahan resmi; masuk eval-gate sbg "belum ditinjau". Owner/reviewer bisa promote id_auto→id setelah tinjau.
**Provenance/Lisensi:** teks hadits domain-publik (fawazahmed0); MT = mesin (Google/MyMemory). **Integritas:** root tetap `eb13d58a…8cba7e56`.
**Blocker:** —
**Next:** auto-translate juga utk konten lain (belajar/doa/tafsir) saat toggle en/ar; tinjauan ahli promote MT; poin 5 kisah.
**Feeling owner:** —

---

### [F1.24] Hadits Indonesia: +Bukhari & Muslim (isi gap terjemahan) — 2026-07-06

**North Star check:** ✅ align — konten hadits Indonesia (jawab "Indonesia dulu"); kanonik tak tersentuh.
**Action:** `seed-hadith.mjs` +2 koleksi otoritatif dgn **terjemahan Indonesia** (fawazahmed0 `ind-*`): **Sahih Bukhari** (contoh 100/7589) + **Sahih Muslim** (contoh 100/7563), ar+en+**id**. Kini 5 koleksi (362 hadits). Nawawi/Qudsi tetap en (dataset tak punya id → penanda jujur F1.23).
**WHY:** owner: hadits harus Indonesia saat toggle Indonesia; gading.dev mati → pakai fawazahmed0 ind (Bukhari/Muslim punya id).
**Test/verify:** `npm run build` LULUS (137). Verifikasi live setelah redeploy (Bukhari id).
**Iterasi:** —.
**Review:** Bukhari/Muslim = semua sahih (grade koleksi-level). Dibatasi contoh (100) — koleksi penuh = skala. Nawawi ID = masih perlu sumber (shortlist `13`/OpenITI).
**Provenance/Lisensi:** fawazahmed0 (public domain), atribusi. **Integritas:** root tetap `eb13d58a…8cba7e56`.
**Blocker:** —
**Next:** koleksi penuh + Nawawi ID; ingest tafsir Indonesia lain (Quraish Shihab via renomureza); poin 5 kisah.
**Feeling owner:** —

---

### [F1.23] i18n konten ikut toggle + tafsir Jalalain + agent sumber global — 2026-07-06

**North Star check:** ✅ align — konsistensi bahasa (UX) + perkaya tafsir + peta sumber dunia; kanonik tak tersentuh.
**Action (respons pesan owner):**
- **(a) Tafsir Jalalain** merged: `pipeline/seed-tafsir-jalalain.mjs` (spa5k) → **6010 ayat** dapat Jalalain (226 tak ada di sumber, dicatat). Panel Tafsir kini 2 edisi (Kemenag id + Jalalain ar) + search.
- **i18n KONTEN ikut toggle bahasa** (bug owner: pilih Indonesia tapi hadits Nawawi masih EN): `components/HadithReader.tsx` (client, `useT` locale → pilih tr[locale], fallback + **penanda "en · terjemahan id menyusul"** bila bahasa terpilih tak ada). `Reader.tsx` terjemahan ikut locale global (buang selector id/en terpisah). Sebab Nawawi/Qudsi memang tak punya terjemahan ID di dataset → ditandai jujur (bukan diam-diam EN).
- **Agent sumber GLOBAL** (owner: "kumpulin dari seluruh dunia, kampus/ilmuwan/sejarawan"): `13_GLOBAL_SOURCES.md` — peta institusi (Corpus Coranicum/BBAW, Leeds, SOAS, Oxford, Birmingham/Mingana, al-Azhar, KFGQPC, OpenITI/KITAB…), korpus terbuka + lisensi, ulama/sejarawan (netral [SUN]/[SHI]/[ACAD]), + **shortlist ingest license-clear** (OpenITI, Quranic Arabic Corpus, Tanzil/QuranEnc, QUL…). ⚠ Sunnah.com/Altafsir = izin; Tarteel CC BY-NC-ND.
**WHY:** owner: konten harus ikut bahasa toggle di SEMUA halaman; sumber dari seluruh dunia bukan cuma Indonesia; sekalian Jalalain.
**Test/verify:** `npm run build` LULUS (135). DOM: locale=id → Nawawi tampil penanda "en · terjemahan id menyusul"; Reader ikut locale. Jalalain di tafsir/{n}.json.
**Iterasi:** hadith page → client `HadithReader`; reader buang selector lang (ikut global).
**Review:** JUJUR — konten Indonesia-only (doa/belajar/asbab/kitab) tetap ID (benar utk user ID); yang belum ada terjemahan bahasa terpilih ditandai. Terjemahan penuh en/ar + hadits ID Nawawi = butuh sumber (agent temukan) → sprint berikut.
**Provenance/Lisensi:** Jalalain klasik domain-publik; sumber global di `13`. **Integritas:** root tetap `eb13d58a…8cba7e56`.
**Blocker:** hadits ID utk Nawawi/Qudsi belum ada sumber terbuka (gading.dev mati) → cari via `13` shortlist.
**Next:** ingest sumber global license-clear (OpenITI dll); terjemahan ID hadits Nawawi; i18n konten en/ar bertahap; poin 5 (kisah).
**Feeling owner:** menuntut konsistensi bahasa + kedalaman & keluasan sumber global.

---

### [F1.22] WORKPLAN + eksekusi: tafsir multi-edisi + Kitab (poin 4) + asbab — 2026-07-06

**North Star check:** ✅ align — perkaya keilmuan (tafsir/kitab/asbab), semua ber-sumber + lolos eval-gate; kanonik tak tersentuh.

**WORKPLAN (a+b+c) — diminta owner dijelaskan:**
- **(a) Tafsir "banyak ulama"**: sumber = **spa5k/tafsir_api** (quran.com bulk 0/mati). Per-ayah (6236 file/edisi). Rencana: tambah **Jalalain** (ringkas, klasik) via seed background yg MERGE ke `public/data/tafsir/{n}.json` (edisi baru + tambah ke daftar editions). Ibn Kathir (panjang, ~besar) & edisi lain = skala berikut. Concurrency + resilient. Panel Tafsir sudah multi-edisi + search → langsung tampil.
- **(b) Keilmuan/Kitab (poin 4)**: menu **Perpustakaan** — kurasi kitab/karya per-bidang (tafsir, hadits, fiqh, aqidah, ushul, sirah, bahasa, dll) + penulis/era/sumber. Data `public/data/kitab.json` (editorial ber-sumber), `lib/kitab.ts`, `app/kitab/page.tsx`, nav "Kitab" i18n.
- **(c) Asbabun nuzul lebih banyak**: tambah entri kurasi ber-sumber ke `public/data/asbab.json` (ayat masyhur lain).
- **Semua**: netral, ber-sumber, ⚠ audit lisensi; derajat/riwayat ikut **Eval-Gate 7-langkah** (`12_ISLAMIC_VALIDATION.md`).

**Action/Hasil:** (diisi setelah eksekusi di bawah)
**WHY:** owner minta a+b+c termasuk tafsir; workplan jelas utk continuity.
**Test:** build + verify live tiap bagian; app lain aman.
**Next:** integrasikan Eval-Gate ke moderasi (doc 10); poin 5 (kisah).

---

### [F1.21] Doa detail slider + agent riset validasi Islam (eval-gate) — 2026-07-06

**North Star check:** ✅ align — perdalam tiap doa (penjelasan/riwayat/sanad) + tegakkan metode validasi ala Islam sbg eval-gate.
**Action (feedback owner):**
- **Doa jadi klik→slider** (bukan langsung ke ayat): `public/data/doa.json` diperkaya `detail` per doa (penjelasan, riwayat/kisah, perawi/sanad, sumber). `components/DoaBrowser.tsx` (kartu klik → panel slide `.id-panel`: Penjelasan · Riwayat/kisah · Perawi & sumber (sanad) + link ayat sbg rujukan). `app/doa/page.tsx` pakai DoaBrowser.
- **Agent riset (background)**: diluncurkan utk riset **metode validasi kebenaran Islam** (isnad/sanad, jarh wa ta'dil, mutawatir/ahad, grading, tawatur, ijma) → rubrik **eval-gate**, + latar/sanad 8 doa harian, ber-sumber (jurnal/buku/artikel), IP-aman (ringkas+sitasi). Output → `12_ISLAMIC_VALIDATION.md` (agent yang tulis).
**WHY:** owner minta tiap doa punya slider detail (penjelasan/riwayat/kisah/kenapa/sumber/perawi/isnad) + riset ilmu Islam valid + jadikan cara Islam memvalidasi kebenaran sebagai eval-gate.
**Test/verify:** `npm run build` LULUS (134). DOM: klik "Sebelum tidur" → panel buka, seksi ["Penjelasan","Riwayat / kisah di baliknya","Perawi & sumber (sanad)"].
**Iterasi:** DoaPage server → DoaBrowser client (state panel).
**Review:** detail doa = ringkasan editorial + atribusi perawi (fakta) + lafaz pendek domain-publik; akan **divalidasi & diperkaya** oleh hasil agent (eval-gate isnad). Multi-tafsir/kontributor menyusul.
**Provenance/Lisensi:** Editorial CC-BY + sumber HR per doa. **Integritas:** root tetap `eb13d58a…8cba7e56`.
**Agent SELESAI:** `12_ISLAMIC_VALIDATION.md` ditulis (10 web search, 20 sumber tersitasi, IP-aman). Eval-Gate = **7 langkah fail-closed** (provenance→sanad→grade→matn cross-check→corroboration→khilaf-metadata→label transparan; lolos hanya bila provenance ADA & grade ∈ {mutawatir,sahih,hasan} & tak ada konflik matn). **Koreksi validitas diterapkan ke doa.json**: "Ghufranaka" Sahih→**Hasan**; "keluar rumah" Sahih→**Hasan–Sahih (khilaf dicatat)**; catatan nomor hadits indikatif. (Doa "Bismillah" sebelum makan sudah benar — versi "Allahumma barik lana" itu da'if, tak dipakai.)
**Blocker:** —
**Next:** redeploy; formalkan eval-gate jadi rubrik moderasi (doc 10) + terapkan ke hadits/tafsir; verifikasi nomor hadits ke kitab primer; lalu poin 4/5.
**Feeling owner:** ingin kedalaman ilmu + kevalidan tinggi.

---

### [F1.20] Panel Identitas jadi 3 tab: Identitas · Tafsir(+search) · Riwayat — 2026-07-06

**North Star check:** ✅ align — perkaya lapisan keilmuan per-ayat (tafsir+asbab), ber-sumber; kanonik tak tersentuh.
**Action (respons feedback owner di panel):**
- Jelaskan tombol: **Salin+ID** = salin teks ayat + hash identitas; **Mint** = daftarkan identitas ayat ke ledger/chain (placeholder, fondasi siap).
- **Tafsir** `pipeline/seed-tafsir.mjs` → **Tafsir Kemenag (id) lengkap 6236 ayat** (via equran.id) + arsitektur multi-edisi (al-Muyassar quran.com id=16 gagal/kosong → menyusul). Simpan per-surah `public/data/tafsir/{n}.json`.
- **Asbabun nuzul/Riwayat** `public/data/asbab.json` (kurasi editorial netral, 8 ayat masyhur: kiblat/sa'i/tayammum/Ad-Dhuha/Al-Kautsar/'Abasa/dll + sumber klasik).
- **API:** `/api/v1/ayah/[s]/[a]/tafsir` + `/riwayat`. `lib/ulum.ts`.
- **IdentityPanel jadi 3 TAB**: Identitas (hash+proof) · **Tafsir** (edisi multi-ulama + **kolom search** + anotasi) · **Riwayat** (asbabun nuzul + sumber). Lazy-load per tab.
**WHY:** owner minta anotasi + asbabun nuzul + banyak tafsir + search + tab riwayat.
**Test/verify:** `npm run build` LULUS (134 halaman). API: tafsir 1:2 (Kemenag len 2126), riwayat 2:144 (1 asbab "kiblat"), 1:1 (0). DOM: panel tab ["Identitas","Tafsir","Riwayat"], search ada, "Tafsir Kemenag" termuat.
**Iterasi:** null-narrowing lintas await di ulum → loader helper; al-Muyassar bulk shape quran.com beda (0 entri) → tunda.
**Review:** IP: tafsir Kemenag berlisensi (atribusi + audit), tak direproduksi di chat; asbab = ringkasan editorial ber-sumber. Multi-tafsir + moderasi kontributor = lanjutan.
**Provenance/Lisensi:** Tafsir Kemenag (equran.id) — izin redistribusi (audit); asbab editorial CC-BY. **Integritas:** root tetap `eb13d58a…8cba7e56`.
**Blocker:** —
**Next:** redeploy; tambah edisi tafsir (Ibn Kathir/al-Muyassar/Jalalain), lengkapi asbab, lalu poin 4/5.
**Feeling owner:** —

---

### [F1.19] Validasi + Menu Doa (poin 3) — 2026-07-06

**North Star check:** ✅ align — validasi integritas dulu; lalu lapisan doa ber-sumber; kanonik tak tersentuh.
**Action:**
- **VALIDASI** (owner minta "analisa, validasi"): jalankan verify-boot (root hash), verify-surah (urutan 2-sumber), test-integrity (immutability) → semua LULUS, root tetap `eb13d58a…8cba7e56`.
- **Menu Doa** `apps/web/public/data/doa.json` (kurasi editorial ber-dalil): kategori **Doa dari Al-Qur'an** (8, tertaut ke ayat yg sudah di-host — bukan reproduksi) + **Doa Harian/Sunnah** (8 lafaz ringkas domain-publik: makan/tidur/bangun/wc/keluar-rumah/kendaraan + sumber HR + grade). `lib/doa.ts`, `app/doa/page.tsx` (Arab+translit+arti+chip ayat+sumber+badge grade). Nav "Doa" + i18n.
**WHY:** owner poin 3 — kumpulan doa Islam.
**Test/verify:** validasi 3 suite LULUS. `npm run build` LULUS (134 halaman, /doa). Verifikasi live setelah redeploy.
**Iterasi:** —.
**Review:** IP-aman: doa Qur'ani = link ke ayat (tak reproduksi); doa harian = lafaz pendek dari hadits (domain publik) + sumber koleksi. Netral. Grade = keterangan umum (audit bila perlu).
**Provenance/Lisensi:** Editorial CC-BY-4.0 + sumber HR per doa. **Integritas:** root tetap `eb13d58a…8cba7e56`.
**Blocker:** —
**Next:** redeploy + verify live; lalu poin 4 (Keilmuan/kitab) / 5 (Kisah), atau skala hadits penuh.
**Feeling owner:** —

---

### [F1.18] Menu Belajar — Dasar Keislaman (Iman·Islam·Ihsan) (poin 2) — 2026-07-06

**North Star check:** ✅ align — lapisan belajar dasar, netral & ber-dalil (tertaut data yang sudah ada); teks kanonik tak tersentuh.
**Action:**
- **Kurikulum data** `apps/web/public/data/deen.json` (di-author editorial, netral, ber-dalil): kerangka Hadits Jibril (Islam/Iman/Ihsan); **Roadmap "Menjadi Muslim"** 6 langkah (syahadat→thaharah→shalat→zakat→puasa→haji); **5 Rukun Islam**, **6 Rukun Iman**, **Ihsan** (muraqabah); **Shalat** (waktu+rakaat, 12 rukun garis besar, catatan perbedaan madzhab); **Glossary** 16 istilah. Tiap materi tertaut **dalil** ke `/surah/..#ayah-..` & `/hadits/nawawi`.
- App: `lib/deen.ts`, `app/belajar/page.tsx` (roadmap kartu bernomor + 3 track + shalat + glossary + chip dalil warna). Nav "Belajar" + i18n (id/en/ar).
**WHY:** owner poin 2 — dasar keislaman utk memudahkan belajar (how to be muslim, shalat, istilah).
**Test/verify:** `npm run build` LULUS. `next dev` + DOM verify: h1 "Dasar Keislaman Iman·Islam·Ihsan", 4 seksi (roadmap 6 langkah, tracks, shalat waktu+rukun, glossary), **chip dalil** "Hadits Jibril (Nawawi 2)"/"QS 5:6/4:103/2:43" tertaut. (Screenshot tool hang; DOM+build konfirmasi.)
**Iterasi:** —.
**Review:** **NETRAL** — hanya yang disepakati mayoritas; perbedaan madzhab (rincian shalat) ditandai catatan, bukan dihakimi. Konten = ringkasan fakta dasar (bukan salin kitab berhak cipta); tafsir/fiqh mendalam = via moderasi nanti. Ber-dalil ke data sendiri (auditable).
**Provenance/Lisensi:** Editorial CC-BY-4.0 (fakta dasar ber-dalil). **Integritas:** root Qur'an tetap `eb13d58a…8cba7e56`.
**Blocker:** —
**Next:** redeploy; lalu poin 3 (Doa) / 4 (kitab) / 5 (kisah), atau skala hadits penuh.
**Feeling owner:** —

---

### [F1.17] Menu Hadits ber-grade + sumber (poin 1) — 2026-07-06

**North Star check:** ✅ align — lapisan keilmuan pertama (hadits) ber-provenance + grade; teks kanonik tak tersentuh.
**Action:**
- `pipeline/seed-hadith.mjs` — "built own": tarik dari **fawazahmed0/hadith-api** (LISENSI: **Public Domain/Unlicense** — bukan NC, cek ulang F1 keliru). Koleksi: **Arba'in Nawawi (42)** + **40 Hadits Qudsi (40)** lengkap + **Sunan Abu Dawud (80/5274, contoh ber-grade)**. Ara + En + (Id utk abudawud). Grade Al-Albani dll ter-capture.
- App: `lib/hadith.ts`, `lib/types.ts` (Hadith/Grade/Collection), `app/hadits/page.tsx` (daftar koleksi) + `app/hadits/[collection]/page.tsx` (browse + **badge grade** warna: shahih=hijau/hasan=emas/dhaif=merah + grader sbg sumber). Nav "Hadits" + i18n (id/en/ar).
- Fix `gen-web-data.mjs`: hanya bersihkan subdir `surah/` (bukan seluruh `public/data/`) → data hadith/ aman.
**WHY:** owner poin 1 — kumpulkan hadits, menu jelas dgn status shahih/dhaif + sumber.
**Test/verify:** `npm run build` LULUS. `next dev` + screenshot: menu Hadits (3 koleksi + sumber public-domain), Abu Dawud tampil **badge grade "Sahih/Hasan Sahih · Al-Albani"** + terjemahan Indonesia + teks Arab RTL.
**Iterasi:** key benar = `qudsi` (bukan qudsi40); bukhari/muslim grade kosong (semua sahih); abudawud ada grade Al-Albani → dipakai contoh; abudawud dibatasi 80 (label "sebagian").
**Review:** koleksi kecil lengkap (nawawi/qudsi) + contoh ber-grade (abudawud); **Kutub as-Sittah penuh = sprint skala berikut**. Netral: grade=metadata ber-sumber. ⚠️ terjemahan turunan audit sumber asli bila perlu.
**Provenance/Lisensi:** fawazahmed0/hadith-api, Public Domain (Unlicense), atribusi di UI. **Integritas:** root Qur'an tetap `eb13d58a…8cba7e56`.
**Blocker:** —
**Next:** redeploy produksi (git pull + rebuild web); lalu skala koleksi hadits penuh / lanjut poin 2 (dasar keislaman).
**Feeling owner:** —

---

### [F1.16] DEPLOY LIVE — https://quran.migancore.com (server bersama, app lain aman) — 2026-07-06

**North Star check:** ✅ align — app publik live; teks kanonik tak tersentuh; app lain TIDAK terganggu.
**Action:** deploy terpandu per-langkah (bukan autonom membabi-buta) ke server `mix` (72.62.125.6) — server yg sama dgn migancore/ixonomic/miganpro/ado(AI stack).
- **0 snapshot** (8 container baseline) → **deploy key** read-only (`~/.ssh/yan_deploy`, daftar via `gh`) → **clone** `/opt/yaayyuhannas` → **.env** (secret di-generate, perms 600) → **`docker compose up -d --build`** (yan_db+yan_web isolated, 127.0.0.1:3100).
- **nginx = aaPanel** (`/www/server/nginx`, bukan `/etc/nginx`) — vhost `quran.migancore.com.conf` proxy→3100; **certbot webroot** TLS; fix `http2 on;`→`listen 443 ssl http2;` (nginx 1.24). `/etc/nginx` stray dibersihkan.
**WHY:** owner minta deploy + repo, pakai server migancore, hati-hati jangan ganggu app lain.
**Test/verify (checkpoint tiap langkah):** app kita **https 200 + TLS verify=0** (cert LE CN=quran.migancore.com s/d 3 Okt 2026), `/api/auth/me`→{"user":null}, http→https 301. **SAFETY: 8 app lain (ixonomic*, emiga, miganpro, api/app.migancore, ado-*, hermes) tetap 301/healthy sebelum & sesudah** tiap mutasi (build, nginx reload). 10 container total.
**Iterasi:** nginx serving = aaPanel bukan systemd/`/etc/nginx` (investigasi dulu, tak asal reload); `http2` directive; hairpin (curl IP publik sendiri=000 → verifikasi via `--resolve` SNI).
**Review:** **TIDAK** mengorek kredensial membabi-buta; recon read-only dulu; tiap langkah reversible (`docker compose down`); guard pra-commit cegah `.data/users.json` bocor ke repo. Deploy key read-only (bukan write).
**Provenance/Lisensi:** —. **Integritas:** root tetap `eb13d58a…8cba7e56` (app baca data statis).
**Blocker:** —
**Next:** buka https://quran.migancore.com di browser (uji eksternal); lalu isi data poin 1 (Hadits) dari sumber terbuka teraudit; auto-renew TLS ikut certbot server.
**Feeling owner:** ingin cepat live — tercapai tanpa menumbangkan app lain.

---

### [F1.15] Repo GitHub + roadmap data keilmuan (poin 1–5) + visi lab riset — 2026-07-06

**North Star check:** ✅ align — repo utk deploy; roadmap data ber-sumber; teks kanonik tak tersentuh.
**Action:**
- **GitHub repo**: `git init` + `.gitignore` (kecualikan `.data/`, `.env`, `node_modules`, `.next`, `data/raw/`), commit, **`gh repo create ya-ayyuhan-nas --private --push`** → https://github.com/fahmiwol/ya-ayyuhan-nas
- **Roadmap data** `11_DATA_ARCHITECTURE.md`: 5 domain (1 Hadits ber-grade+sanad, 2 Dasar keislaman Iman/Islam/Ihsan + roadmap/sunnah/shalat/glossary/kajian, 3 Doa, 4 Keilmuan lintas-bidang/kitab, 5 Kisah/hikayat) — semua **wajib sumber + grade**, ter-moderasi, i18n. + **Lab riset tersembunyi** (Fase 4 sintesis → penalaran komputasional, TERPISAH dari app; guardrail: bukan AI=wahyu, provenance-first).
**WHY:** owner minta deploy+repo; kumpulkan data terstruktur ber-sumber; kontributor paling akhir; visi sintesis Qur'an→AI/reasoning.
**Test/verify:** repo ter-push (branch master). **GUARD keamanan bekerja**: cek pra-commit menangkap `.data/users.json` (hash password) yg keburu ke-stage gara-gara komentar inline di `.gitignore` → diperbaiki (`.data/` di-ignore), re-verify **nol rahasia** di repo (`git ls-files` bersih). Hanya template `.env.example`/Dockerfile/compose/runbook yang ada.
**Iterasi:** `.gitignore` komentar inline → git anggap bagian pattern → pindah komentar ke baris sendiri.
**Review:** **DEPLOY ke server produksi bersama BELUM dijalankan** — sengaja. KVM8 = Mighan+MiganCore+Ixonomic (live) + riwayat outage → deploy dipandu per-langkah dgn checkpoint (bukan autonom). SSH keys ada (galantara_deploy/hostinger_migration/id_ed25519); gh authed (fahmiwol).
**Provenance/Lisensi:** doc 11 tegaskan audit lisensi tiap aset. **Integritas:** root tetap `eb13d58a…8cba7e56`.
**Blocker:** deploy = butuh eksekusi terpandu (konfirmasi owner per langkah mutasi).
**Next:** deploy terpandu via `deploy/README.md` (pre-flight read-only → build → nginx add block → verify app lain aman); lalu mulai isi data poin 1 (Hadits) dari sumber terbuka teraudit.
**Feeling owner:** ingin gerak cepat (deploy) tapi aku jaga app lain jgn tumbang.

---

### [F1.14] Sync catatan (Postgres) + Docker TERISOLASI (aman di server bersama migancore) — 2026-07-06

**North Star check:** ✅ align — sync catatan (#1); teks kanonik tak tersentuh; deploy tak ganggu app lain.
**Action:**
- **Store abstraksi** (`lib/store.ts` + `store-file.ts` + `store-pg.ts`): satu interface, dua backend — **Postgres** bila `DATABASE_URL` (produksi/scalable), **file JSON** fallback dev. Auth (`auth-server.ts`) & notes lewat store → swappable tanpa ubah app.
- **Sync catatan:** API `/api/notes` (GET/PUT/DELETE, per-user) + `/api/notes/migrate` (bulk, idempoten). Client `lib/notes.tsx`: login → **migrasi catatan lokal→akun** (sekali) lalu sinkron ke server; logout → lokal. `+pg` dep.
- **Docker TERISOLASI** (aman berdampingan migancore): `apps/web/Dockerfile` (Next standalone), `docker-compose.yml` (prefix `yan_`: container/volume/network unik; **Postgres tak diekspos ke host**; web bind `127.0.0.1:3100`), `.env.example`, **`deploy/README.md` runbook** (pra-terbang cek port/nama; nginx TAMBAH server block subdomain; backup/rollback; cabut bersih). Prinsip: **hanya menambah, tak sentuh app lain**.
**WHY:** owner: pakai server migancore, hati-hati jangan ganggu app lain, Docker, aman & scalable; kerjakan #1 dulu.
**Test/verify:** `npm run build` LULUS (TS strict). **Lokal (file store)**: logout+seed catatan lokal → login → **migrate=1** → `/api/notes` server=1 → `.data/notes.json` persist (ber-userId) → dashboard `/catatan` render note (chip "Tafsir (1)"). Server logs 200 semua. (Docker tak diuji lokal — Docker tak terpasang; dijalankan di server via runbook.)
**Iterasi:** split conditional dynamic import (narrowing TS); `output: standalone` utk image ramping.
**Review:** **TIDAK** deploy ke server produksi dari sini (berisiko ganggu app lain) — disiapkan runbook aman utk owner jalankan. Store file = dev; Postgres = produksi. Produksi: AUTH_SECRET + rate-limit + CSRF + HTTPS + backup.
**Provenance/Lisensi:** —. **Integritas:** root tetap `eb13d58a…8cba7e56`.
**Blocker:** akses SSH server = di tangan owner (deploy manual via runbook).
**Next:** owner deploy via `deploy/README.md`; lalu i18n sisa & (paling akhir) jalur kontributor + kumpulkan data sumber lain.
**Feeling owner:** hati-hati & teliti soal server bersama.

---

### [F1.13] Auth + akun + RBAC (fondasi sync catatan & gating kontributor) — 2026-07-06

**North Star check:** ✅ align — fondasi akun/peran; teks kanonik tak tersentuh; jalur kontributor ketat.
**Action:** auth BENERAN (bukan mock):
- `lib/auth-server.ts` — password **scrypt** (salt+hash) + verifikasi timing-safe; **session cookie httpOnly ter-tanda-tangan HMAC-SHA256**; store file JSON `.data/users.json` (SWAPPABLE ke Postgres). User pertama = **admin** (bootstrap). Peran: user/contributor/reviewer/admin.
- API: `/api/auth/signup`, `/signin`, `/signout`, `/me`.
- `lib/auth.tsx` (AuthProvider client), `components/AuthButton.tsx` (+modal masuk/daftar), Header integrasi, `app/akun/page.tsx` (profil, peran, jumlah catatan, ajukan kontributor), `app/admin/moderasi/page.tsx` (**RBAC** server-side: hanya reviewer/admin; antrian kontribusi seed + guardrail).
**WHY:** owner "gas" akun → buka sync catatan + fondasi login/gating kontributor (yang harus ketat).
**Test/verify:** `npm run build` LULUS. **curl**: signup → user role=admin + cookie; `/me`(cookie)→user; password salah→ditolak. **Browser**: signin→akun tampil (ADMIN, link Moderasi); `/admin/moderasi` sbg admin→antrian 2 kontribusi (Approve/Revisi/Reject + guardrail sumber+sanad); **signout → `/admin/moderasi` = "Akses terbatas (reviewer/admin)"** (RBAC terbukti 2 arah).
**Iterasi:** cookie via `NextResponse.cookies.set`; baca sesi via `cookies()` (async Next 15); halaman moderasi `force-dynamic`.
**Review:** store file JSON (dev) → Postgres (produksi); approve/reject tulis-status = Fase 2; produksi butuh AUTH_SECRET + rate-limit + CSRF + HTTPS. i18n halaman akun/moderasi menyusul.
**Provenance/Lisensi:** —. **Integritas:** root tetap `eb13d58a…8cba7e56`.
**Blocker:** —
**Next:** migrasi catatan lokal → akun (sync self-hosted); approve/reject persist + model kontribusi Postgres; verifikasi kredensial kontributor; i18n sisa.
**Feeling owner:** —

---

### [F1.12] i18n global — UI multi-bahasa (id/en/ar) + language switcher + RTL — 2026-07-06

**North Star check:** ✅ align — "untuk dunia": UI multi-bahasa. Teks kanonik tak tersentuh.
**Action:**
- `lib/i18n.tsx` — LocaleProvider ringan (context + dictionary id/en/ar), `useT()` dgn param `{surah}`/`{ayah}`, set `<html lang/dir>` (RTL utk Arab), persist localStorage.
- `components/LanguageSwitcher` (di Header) — pemilih Indonesia/English/العربية.
- i18n-kan chrome: Header (nav+tagline), ModeDock (label+hint), Reader (kontrol + mode-hint), SurahList (search), `HomeHero` (hero+subtitle+verified), halaman Catatan (judul+subjudul).
- `Providers` bungkus LocaleProvider (outermost).
**WHY:** owner tegas scope **global/dunia**; i18n fondasi tiap fitur ke depan.
**Test/verify:** `npm run build` LULUS. `next dev` + screenshot 3 bahasa: **EN** ("Digital Qur'an", nav Surahs/Notes/Integrity, search "Search surah…"); **AR** → `document.dir=rtl lang=ar`, seluruh layout **mirror RTL** ("القرآن الرقمي", nav "السور/الملاحظات/الأصالة", grid surah kanan-ke-kiri). ID default tetap.
**Iterasi:** home hero (server comp) → `HomeHero` client (context i18n hanya di client); param replace `{surah}/{ayah}` di subtitle.
**Review:** cakupan i18n = "chrome" utama; string dalam NotePanel/IdentityPanel & halaman Integritas menyusul (mekanis). Konten (Quran/terjemah) sudah multi-bahasa via data. Locale routing (SEO per-bahasa) = peningkatan nanti.
**Provenance/Lisensi:** string UI = terjemahan sendiri. **Integritas:** root tetap `eb13d58a…8cba7e56`.
**Blocker:** —
**Next:** lengkapi i18n (panel & integritas), tambah bahasa (ar/en/… via QuranEnc utk konten), lalu auth+akun (sync catatan) & jalur kontributor (admin moderasi, Fase 2).
**Feeling owner:** —

---

### [F1.11] Buku catatan pribadi user (stabilo) ber-sumber + kebijakan gating kontributor — 2026-07-06

**North Star check:** ✅ align — user ≠ kontributor; catatan user = zona USER (privat), teks kanonik tak tersentuh.
**Action:**
- **Fitur notebook user (implementasi):** mode baru **"Catat" (🖊️ stabilo)** di ModeDock. `lib/notes.tsx` (NotesProvider, localStorage, zona USER). `components/NotePanel.tsx` — panel samping: sorot warna + jenis (tafsir/asbab/tajwid/kosakata/hadith/refleksi/lainnya) + catatan + **sumber (judul/penulis/tautan)** + tampilkan "Sumber & Rujukan" (identitas ayat + anotasi publik). `Reader.tsx` — highlight ayat (warna+border) + badge 📓 + klik (mode Catat) buka editor. `app/catatan/page.tsx` — **dashboard Buku Catatan** dikelompokkan per jenis, tiap catatan tampilkan **sumber + catatan + tautan ke ayat**. Nav "Catatan".
- **Aturan bersumber:** jenis berilmu (tafsir/asbab/tajwid/kosakata/hadith) **WAJIB sumber** — divalidasi (tanpa sumber → tolak).
- **Kebijakan kontributor (dok):** `10_CONTRIBUTION_MODERATION.md` §11 — **USER ≠ KONTRIBUTOR**. Kontributor gating **sangat ketat** (ulama/mufassir/sejarawan/hafidz/qari bersanad, verifikasi manual, kredensial berjenjang; anti-kontaminasi/kontradiksi: sumber+isnad+grade wajib, multi-reviewer, AI tak auto-publish).
**Test/verify:** `npm run build` LULUS (halaman `/catatan` + reader). `next dev` + screenshot: mode Catat aktif (dock bawah=mobile), **enforcement sumber** (tafsir tanpa sumber → ditolak, noteCount tetap 0, pesan "WAJIB sumber"), simpan dgn sumber → **ayat ter-highlight** (border+tint kuning) + badge 📓 + masuk **CATATANKU**; dashboard `/catatan` mengelompokkan per jenis + sumber + tautan 1:2.
**Iterasi:** map ayat → block form (hitung notes per ayat); enforce sumber utk KNOWLEDGE_TYPES; panel note pakai kelas `.id-panel` (drawer/bottom-sheet).
**Review:** catatan user = **privat & lokal** (belum sync); kontributor publik = jalur moderasi ketat (Fase 2, butuh auth).
**Provenance/Lisensi:** catatan = konten user + sumber yg diisi user. **Integritas:** root tetap `eb13d58a…8cba7e56`.
**Blocker:** —
**Next:** sync akun (self-hosted) utk catatan; i18n; lalu jalur kontributor (auth+RBAC+admin moderasi, Fase 2).
**Feeling owner:** menekankan keakuratan & sumber — "firman Allah, tak boleh kontaminasi".

---

### [F1.10-design] Ulum/sanad riset + sistem kontribusi ter-moderasi (close-dev) + global i18n — 2026-07-06

**North Star check:** ✅ align — perluas lapisan keilmuan & tata kelola; teks kanonik tetap immutable.
**Action:** riset sumber konkret (web) + tangkap ide owner → dua dokumen: `09_ULUM_SANAD_RESEARCH.md` (sanad/talaqqi/ijazah, hafidz/muroja'ah, asbabun nuzul, multi-tafsir, qira'at/perawi, validator/tajwid, cara mengamalkan, **global/i18n**) & `10_CONTRIBUTION_MODERATION.md` (close-development: kontribusi tafsir/hikayat lewat **admin moderasi**). Update `06_ROADMAP.md` Fase 2.
**WHY:** owner menegaskan scope **global (dunia)**, keistimewaan Qur'an (1 kata bisa jutaan makna → konten tak terbatas), dan **close-dev + moderasi** biar otentisitas terjaga saat konten tumbuh.
**Hasil (ide owner + riset terekam):**
- **Sanad/talaqqi/ijazah** = jaminan keaslian BACAAN (mulut ke mulut sampai Nabi) → padanan provenance/credential; ijazah digital (AI-assist, otoritas guru manusia). **Hafidz/muroja'ah** → mode hafalan + SRS.
- **Asbabun nuzul**: tiap ayat banyak kisah (al-Wahidi ~570, al-Suyuti, tafsircenter 201 isnad). **Multi-tafsir tak terbatas** (spa5k 122, altafsir, QuranEnc, IslamHouse hub). **Qira'at** 10 (AQQD/KFGQPC) = layer opsional, Hafs default.
- **Close-development + moderasi:** teks kanonik TAK bisa dikontribusi; keilmuan bisa TAPI via **antrian moderasi** (RBAC reader/contributor/reviewer/admin; state machine draft→submit→review→approve/reject→published; versioned; provenance+sanad wajib; multi-reviewer=ijma; netral mazhab=metadata). Konten ter-approve tertaut hash ayat = arsip ber-identitas.
- **Global/i18n WAJIB** (UI + konten multi-bahasa; QuranEnc 80+, fawazahmed0 90+).
**Test:** — (dokumen/riset). **Review:** dipetakan ke fase (model+API 1.10; auth+admin moderasi 2.0; sanad/ijazah 2.x/3+; mint kontribusi 4+).
**Provenance/Lisensi:** sumber riset disitasi di `09` §8 (audit per-aset). **Integritas:** root tetap `eb13d58a…8cba7e56` (tak tersentuh).
**Blocker:** —
**Next (implementasi):** i18n scaffold + perluas model anotasi → status `published`/moderasi (JSON dulu) + skeleton halaman **admin moderasi**; lalu auth+RBAC (Fase 2).
**Feeling owner:** visioner global — mikir tata kelola otentisitas jangka panjang.

---

### [F1.8/1.9] Implementasi cursor-mode + responsif mobile — 2026-07-06

**North Star check:** ✅ align — implementasi UX dari `08_INTERACTION_MODEL.md`; teks kanonik tak tersentuh.
**Action:**
- **Sistem mode** (`lib/settings.tsx` +`mode`): `ModeDock` (switcher mengambang + shortcut R/I/Q) — **Baca / Identitas / Tilawah**.
- **Kursor per-mode** (`globals.css` + `public/cursors/senter.svg`): Baca=text, Identitas=magnifier (zoom-in), Tilawah=senter (SVG).
- **Perilaku klik per-mode** (`Reader.tsx`): Identitas→buka panel identitas (ayat/kata); Tilawah→Qari bacakan; hover-highlight kata/ayat.
- **`IdentityPanel`** — slide **drawer kanan (desktop)** / **bottom-sheet (mobile)**, non-blocking: hash (token-ID) + merkle-kata + verifikasi bukti inklusi di browser + info kata (akar/translit/arti) + anotasi + aksi Salin+ID / Mint(segera).
- **Responsif (1.9):** dock pindah ke bawah di mobile; panel→bottom-sheet; kontrol flex-wrap; target ≥44px; `dvh`.
**Test/verify:** `npm run build` LULUS (122 halaman, TS strict). `next dev` + screenshot **2 breakpoint**: desktop 1200px → dock kiri + **drawer kanan 430px** (reader tetap terlihat, non-blocking); mobile 654px → **bottom-sheet** full-width + dock bawah. Klik ayat mode Identitas → panel muncul; **verifikasi bukti inklusi → "✓ sah bagian mushaf, aman untuk mint"**; anotasi (Basmalah/leksikal رَبّ) tampil.
**Iterasi:** breakpoint 767px; panel `dvh` + slide transform; word-tap `stopPropagation` biar klik kata ≠ klik ayat.
**Review:** Latih-Baca (mic+AI) sengaja belum — jalur Fase 3 (butuh STT microservice). Mode tambahan (Leksikon/Bookmark/dll) menyusul.
**Provenance/Lisensi:** tak ada data baru; audio EveryAyah swappable. **Integritas:** root tetap `eb13d58a…8cba7e56`.
**Blocker:** —
**Next:** mode tambahan (Bookmark/Salin sudah ada di panel, Leksikon), lalu Fase 3 Latih-Baca (Whisper/MFA), arti-kata ID, mirror audio→R2.
**Feeling owner:** —

---

### [F1.4-design] Model interaksi cursor-mode + Tilawah-Eval — CAPTURE ide owner jadi roadmap — 2026-07-06

**North Star check:** ✅ align — UX di atas fondasi yang sudah tervalidasi; tidak menyentuh teks kanonik.
**Action:** tangkap SEMUA ide owner (biar tidak menguap) → dokumen desain `08_INTERACTION_MODEL.md` + integrasi ke `06_ROADMAP.md` (sprint 1.8 cursor-mode, 1.9 responsif; link Fase 3 karaoke-eval).
**WHY:** owner minta eksplisit: "catat semua masukan & ide, jadi roadmap yang tercatat, tidak menguap, continuity jelas."
**Hasil (ide owner terekam):**
- **Mode berbasis kursor** (satu mode aktif; kursor = alat):
  - **Baca** (pointer) — baca biasa.
  - **Identitas** (magnifier) — hover/klik kata/ayat → seleksi ber-identitas → **panel slide dari samping** (buka/tutup): hash + Merkle proof + info kata + anotasi.
  - **Tilawah** (senter) — klik ayat → Qari bacakan.
  - **Latih Baca** (mic, Fase 3) — **karaoke + AI eval**: mic nyala, ayat aktif karaoke, AI nilai bacaan + feedback per kata (makhraj/madd/…) → iterasi & optimasi.
- **Responsif/mobile WAJIB** — touch tanpa hover → mode-switcher tap; modal→bottom-sheet; sidebar→drawer; target ≥44px; mobile-first 3 breakpoint.
- **"Adapalagi" (tambahanku):** Leksikon, Tafsir, Terjemah/Bandingkan, Bookmark, Salin/Bagikan, Hafalan, Tajwid-warna, Tema/Akar (graph), Mint. Semua dipetakan ke fase.
**Test:** — (dokumen). Implementasi = sprint berikut.
**Review:** dipetakan ke fase — 1.8/1.9 buildable sekarang (data proofs/words/annotations/audio sudah ada); Latih Baca+Tajwid+Hafalan = Fase 3; Tema/Akar+Mint = Fase 4/lanjutan.
**Provenance/Lisensi:** — (desain). **Integritas:** root tak berubah `eb13d58a…8cba7e56`.
**Blocker:** —
**Next:** implement sprint **1.8** (cursor-mode: Baca/Identitas/Tilawah + panel samping) lalu **1.9** (responsif mobile). Latih-Baca menunggu microservice STT (Fase 3).
**Feeling owner:** visioner — mikir sampai UX belajar baca & arsip ber-identitas.

---

### [F1.3] "Ya Ayyuhan Nas" — audio Qari + word-by-word + validasi berlapis + identitas ayat (mint) + anotasi — 2026-07-06

**North Star check:** ✅ align — arsip Islam yang robust; teks kanonik immutable, fitur di atasnya ber-provenance & tervalidasi berlapis.
**Action:**
- **Rebrand** → "Ya Ayyuhan Nas — Muslim & Islamic Archive Library" (layout/header/manifest).
- **Audio (a) — router suara Qari:** `lib/reciters.ts` (6 qari, sumber EveryAyah, base SWAPPABLE ke R2 via env). Reader: pemilih qari, putar per-ayat, putar-terus (continuous), highlight ayat aktif.
- **Word-by-word (c):** `pipeline/seed-words.mjs` tarik **77.429 kata** (Quran.com/QUL; Arab domain-publik, translit + arti kata). Reader: toggle Per-kata (Arab + translit + arti per kata).
- **Validasi berlapis:** `pipeline/verify-words.mjs` — buktikan gabungan kata merekonstruksi tiap ayat (kerangka konsonan) → **6236/6236 (100%)**; hash tiap kata → Merkle-kata per ayat (`word-merkle.json`). Lapisan: kata → ayat → surah → mushaf.
- **Identitas ayat / mint (c):** `pipeline/gen-mint-manifest.mjs` — tiap ayat: hash konten (token-ID) + **bukti inklusi Merkle** (13 langkah) → `proofs.json`. Semua 6236 proof tervalidasi rekonstruksi root. UI `AyahIdentity` verifikasi proof DI BROWSER (chain-agnostic, siap mint). API `/api/v1/ayah/[s]/[a]/proof`.
- **Anotasi/tafsir/remark (c):** model `data/annotations.json` (target se-ayat/se-kata, type tafsir|remark|note|asbab|lexical, versioned, provenance). API `/api/v1/annotations/[s]/[a]`. Reader: indikator 📝 + panel. Seed 3 contoh editorial netral. Tafsir multi-ulama penuh = Fase 2.
- **Font (b):** stack Arab diperbaiki (Traditional Arabic/Amiri/Scheherazade); KFGQPC = drop-in nanti (lisensi).
- Fix normalizer: buang zero-width/bidi control (U+200B–200F, dst) — menuntaskan 27:26 (sajdah) di validasi kata.
**Test/verify:** `npm run build` LULUS (122 halaman, TS strict). `next dev` + screenshot: rebrand, word-by-word (Arab+translit+arti), qari router, **identitas 1:1 diverifikasi di browser ("root cocok, aman untuk mint")**, anotasi. API diuji: proof + annotations OK. verify-words 100%, mint-manifest 6236/6236 proof valid.
**Iterasi:** 3 fix TS strict (narrowing null lintas await → loader helper), bidi-strip normalizer.
**Review:** audio streaming EveryAyah (non-kanonik, swappable ke R2); arti-kata dari QUL default EN (ID menyusul); anotasi seed = editorial netral (bukan tafsir berhak cipta).
**Provenance/Lisensi:** kata Arab domain-publik; arti-kata & audio = provenance dicatat, audit komersial. Root teks TAK berubah.
**Integritas:** root `eb13d58a…8cba7e56`; +lapisan: 77.429 kata tervalidasi, tiap ayat punya identitas+proof.
**Blocker:** —
**Next:** arti-kata ID, font KFGQPC, mirror audio→R2, tafsir multi-ulama (Fase 2), integrasi chain untuk mint.
**Feeling owner:** —

---

### [F1.2] Aplikasi Next.js 15 PWA "built own" — baca Arab + terjemahan + API + Integritas — 2026-07-06

**North Star check:** ✅ align — fondasi baca yang robust/modular/scalable; teks kanonik immutable jadi sumber, app hanya konsumen data terverifikasi.
**Action:**
- `pipeline/gen-web-data.mjs` — **BUILT OWN**: generate data statis terverifikasi dari `mushaf-core.db` ke `apps/web/public/data/` (index + 114 surah + integrity). Tiap ayah bawa hash sendiri. App TIDAK panggil API pihak-ketiga saat runtime.
- `apps/web/` — Next.js 15 App Router + TS strict + Tailwind v4, hand-scaffold (create-next-app kena permission Windows).
  - `/` daftar 114 surah (urut, search klien) · `/surah/[number]` reader (Arab RTL + toggle terjemahan id/en + ukuran font + tema) · `/integritas` (root hash + **verifikasi ulang Merkle DI BROWSER** + cross-source + provenance).
  - REST API sendiri: `/api/v1/surah`, `/api/v1/surah/[n]`, `/api/v1/ayah/[s]/[a]`, `/api/v1/integrity`.
  - PWA: manifest + service worker (offline stale-while-revalidate), tema gelap/terang, localStorage (zona user terpisah).
  - Modular: `lib/types.ts`, `lib/mushaf.ts` (akses data), `lib/settings.tsx`.
**WHY:** user minta "built own" (anti vendor-lock, offline), app enak dibaca (Arab asli → bisa diterjemah), fondasi buat MVP/belajar/integrasi.
**Test/verify:** `npm run build` LULUS — TS strict OK, **122 halaman ter-generate** (114 surah SSG + home + integritas + API). Dijalankan `next dev`, screenshot: home (urut benar), reader Al-Fatihah (basmalah + ayat + terjemahan Kemenag), integritas. **Verifikasi Merkle di browser: ✓ cocok (6236 ayat, root identik)**. API diuji via curl (surah/ayah/integrity) → data + hash benar.
**Iterasi:** fix 2 error TS strict (BufferSource pada `crypto.subtle.digest`; narrowing `theme` di settings) + set `outputFileTracingRoot` (banyak lockfile di mesin).
**Review:** teks Arab domain-publik; terjemahan berlisensi tampil dgn atribusi + peringatan audit komersial di halaman Integritas.
**Provenance/Lisensi:** data dari pipeline F1.0/F1.1 (Quran.com QPC + Tanzil + Kemenag + Sahih). Root tak berubah.
**Integritas:** root tetap `eb13d58a…8cba7e56`; app mem-verifikasi ulang sendiri di klien.
**Blocker:** —
**Next:** font mushaf KFGQPC (lisensi), word-by-word, audio EveryAyah→R2, search terjemahan, halaman Juz/Halaman.
**Feeling owner:** —

---

### [F1.1] Lapisan per-Surah + GUARD urutan — 2026-07-06

**North Star check:** ✅ align — mulai lapisan baca dari per-surah; jaminan utama = urutan tidak salah.
**Action:**
- `pipeline/verify-surah.mjs` — GUARD urutan: bandingkan `mushaf-core.db` (sumber Quran.com QPC) vs **referensi kanonik INDEPENDEN** (tabel jumlah ayat Hafs/Kufi + tempat turun, di-hardcode). Dua sumber independen harus setuju penuh.
- `packages/mushaf-core/reader.mjs` — API baca read-only (surahIndex, surah(n)+ayat urut, neighbors).
- `pipeline/gen-preview.mjs` — preview OFFLINE self-contained `data/preview/mushaf.html` (114 surah urut + baca per-surah, RTL, hanya teks Arab domain-publik).
**WHY:** "mulai per surah" = daftar surah dulu (layar utama app). "Jangan salah" butuh bukti dari 2 sumber independen, bukan percaya 1 API.
**Hasil:** daftar 114 surah urut 1..114 + reader + preview visual. Script baru: `verify:surah`, `preview`; masuk rantai `npm run all`.
**Test:** `verify-surah` LULUS SEMUA — 114 surah urut benar, jumlah ayat per-surah **114/114 cocok** referensi independen, tempat turun 114/114 cocok, order_revelation = permutasi valid 1..114, tiap ayat kontigu 1..6236, surah k sebelum k+1, ayah_number 1..N tanpa gap. Integrity test lama tetap 8/8. Boot ✅.
**Iterasi:** —  (langsung hijau; guard 2-sumber memang tujuannya menangkap kalau ada yg salah).
**Review:** tempat turun (makki/madani) diperlakukan metadata (non-fatal) sesuai aturan netralitas; order_revelation hanya dicek "permutasi valid", tidak mengasумsikan satu tradisi.
**Provenance/Lisensi:** referensi urutan/jumlah = hitungan Hafs/Kufi standar (fakta kanonik, domain publik). Preview hanya render teks Arab (domain publik) — terjemahan berlisensi TIDAK di-embed.
**Integritas:** root tetap `eb13d58a…8cba7e56` (tidak menyentuh teks). Urutan: 2 sumber setuju 100%.
**Blocker:** —
**Next:** integrasi reader ke Next.js 15 PWA (halaman daftar surah + baca), lalu word-by-word & audio.
**Feeling owner:** —

---

### [F1.0] Pipeline seed+verify+build — duplikasi harfiah full mushaf — 2026-07-05

**North Star check:** ✅ align — Fase 1 = salin Quran harfiah + verifikasi keaslian. Tidak bikin varian teks.
**Action:** bangun pipeline dependency-free (Node 22 `node:sqlite`, ESM):
`seed` (tarik multi-sumber) → `verify` (rasm berjenjang + SHA-256 + Merkle) → `build-core-db` (SQLite kanonik read-only) → `test-integrity` → `boot:check` (fail-closed).
**WHY:** ini "hello world keaslian" yang di-scale ke full 6236 ayat. Tanpa bukti lintas-sumber, klaim "1 versi" cuma omongan.
**Hasil:**
- `data/mushaf-core.db` — 114 surah, 6236 ayat, urut global 1..6236 kontigu, immutable (trigger UPDATE/DELETE + runtime read-only).
- `config/integrity.json` — Merkle root **di-PIN**.
- `data/app-content.json` — terjemahan id (Kemenag) + en (Sahih), zona keilmuan TERPISAH dari DB kanonik.
- lib: `text.mjs` (skeleton L0/L1/L2/L3), `merkle.mjs`, `sources.mjs`.
**Test:** `pipeline/test-integrity.mjs` — 8/8 lulus: UPDATE ditolak, DELETE ditolak, read-only tolak tulis, tamper 1 huruf → root berubah (terdeteksi), 114/6236/kontigu/Σayah. Spot-check hitungan ayat surah terkenal (1,2,9,108,112,114) cocok.
**Iterasi:** verifikasi rasm awalnya "loose" gagal 3806 ayat → didalami jadi 4 tingkat (L0 skeleton → L1 fold hamza/alef-wasla → L2 fold alef mad → L3 akar konsonan+segmentasi). Ketemu: beda antar-sumber = **konvensi ortografi digitasi** (imla'i vs uthmani, dudukan hamza, spasi, tanda henti), BUKAN beda teks.
**Review:** framing jujur dipakai (sesuai risk PRD): yang diklaim kuat = **rasm/akar konsonan identik**, bukan byte-identik antar penerbit.
**Provenance/Lisensi:**
- Teks kanonik: **Quran.com QPC Uthmani** (teks King Fahd) — audit ulang utk komersial.
- Cross-check: **Tanzil** (CC BY 3.0), **Kemenag MSI** via equran.id (redistribusi perlu izin).
- Terjemahan: **Kemenag ID**, **Sahih Intl EN** (via AlQuran Cloud) — audit ulang.
**Integritas:** MERKLE ROOT = `eb13d58a3d2c94684c7d8dadf5ae757321cec3d766d828f9d4b910fc8cba7e56`
Cross-source akar konsonan (L3): **Tanzil 100%**, **Kemenag 99.984%** (1 konvensi terdokumentasi: 72:16 nun-idgham). Boot check: ✅ root DB == root pin.
**Blocker:** —
**Next:** (a) word-by-word dari Quranic Arabic Corpus (isolasi service, GPL); (b) integrasi DB ke Next.js PWA + halaman "Integritas"; (c) audio EveryAyah → R2.
**Feeling owner:** —
```

## Ringkasan status (update tiap milestone)

| Fase | Status | Milestone terakhir | Root hash mushaf |
|------|--------|--------------------|------------------|
| 1 | 🏗️ jalan | F1.26: menu Kisah (poin 5) — 5 poin data fondasi SELESAI | `eb13d58a…8cba7e56` |
| 2 | ⬜ | — | — |
| 3 | ⬜ | — | — |
| 4 | ⬜ | — | — |
```
