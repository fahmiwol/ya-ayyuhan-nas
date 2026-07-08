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

### [BUG-RESOLVED ✅] Menu nav hilang di live = nginx proxy_cache + SW basi — 2026-07-06 19:1x

**AKAR SEBENARNYA (bukan build/header):** container `:3100` langsung serve HTML BENAR (7 menu), tapi via nginx `:443` basi. Sebab: **aaPanel punya `proxy_cache cache_one` GLOBAL** + Next.js kirim `cache-control: s-maxage=31536000` (1 thn) utk halaman statis → nginx cache home lama ~setahun, abaikan tiap redeploy. (`--no-cache` docker rebuild TAK ngefek krn bukan build cache.)
**FIX:** tambah `proxy_cache off; proxy_no_cache 1; proxy_cache_bypass 1;` di `location /` vhost **quran saja** (`/www/server/panel/vhost/nginx/quran.migancore.com.conf`) → nginx -t → reload. **Menu langsung muncul lengkap** (Belajar/Catatan/Doa/Hadits/Integritas/Kisah/Kitab/Surah). App lain tetap 301. Next punya cache sendiri (x-nextjs-cache HIT = normal, itu di container).
**FIX #2 (SW):** `public/sw.js` cache-first→**network-first** + `skipWaiting` + CACHE v2 → browser tak basi tiap deploy. Perlu deploy + owner hard-reload/unregister SW sekali.
**PELAJARAN (penting utk continuity):** deploy ke server aaPanel → **selalu matikan proxy_cache utk vhost app dinamis** (Next/SSR), krn s-maxage tinggi bikin nginx cache ~permanen. Sudah masuk `deploy/README.md`.
**Status:** ✅ RESOLVED (menu live). Sisa: deploy SW v2 + owner clear cache browser sekali.

### [BUG-history] Menu nav baru HILANG di live (header build basi) — 2026-07-06 ~19:00

**Gejala:** Di https://quran.migancore.com header cuma **Surah · Catatan · Integritas**. Menu baru (Hadits/Belajar/Doa/Kitab/Kisah) TIDAK muncul — PADAHAL halamannya hidup (`/hadits`,`/kisah` dst = HTTP 200) & `apps/web/components/Header.tsx` sudah berisi semua `<Link>` + `t("nav.*")`.
**Diagnosa (bukan cache browser):** `curl 127.0.0.1` langsung ke container → HTML nav hanya "Catatan Integritas Surah". Jadi **image/build header yang di-serve basi** (bukan SW/browser). Aneh: page baru ADA tapi header LAMA → curiga **Docker build cache** (layer `RUN npm run build` reuse lama) ATAU Next route/full-route cache di standalone ATAU `git pull` header tak ter-apply padahal file data ter-pull.
**RENCANA FIX (jam 19.10):**
1. Server: `cd /opt/yaayyuhannas && git log --oneline -3` + `git show HEAD:apps/web/components/Header.tsx | grep nav` → pastikan Header.tsx di server SUDAH berisi Hadits/Kisah.
2. Kalau file server sudah benar → **rebuild bersih**: `docker compose build --no-cache web && docker compose up -d web`.
3. Verify: `curl --resolve quran.migancore.com:443:127.0.0.1 https://quran.migancore.com/ | grep -oE "Hadits|Kisah"` harus muncul.
4. Cek SW juga: `public/sw.js` cache-first bisa bikin browser basi → pertimbangkan versi cache/skipWaiting atau network-first utk navigasi.
5. Setelah live benar → verify app lain (ixonomic/emiga/miganpro) tetap 301.
**Catatan:** SW (`sw.js`) cache-first app-shell → SETELAH fix, minta owner hard-reload / unregister SW (browser mereka mungkin masih simpan versi lama).
**Status:** OPEN — lanjut ~19:10 (owner kena limit sesi 5-jam, reset 19:09).

---

### [F1.42] Metode tafsir klasik jadi kerangka sintesis Lab + rambu isyari — 2026-07-07

Owner kirim 4 peta-konsep Ulumul Qur'an (pengertian/keotentikan Qur'an; Qur'an-Hadits; hadis sbg sumber syariah/fungsi bayan/inkar sunnah; **Pendekatan & Metode Penafsiran**) → "jadikan metode kamu dalam mensintesis; pahami peta lain; cari sumber lain".
**Action:**
- **`20_TAFSIR_METHODS.md`** (metode formal Lab): metode CARA (tahlili/ijmali/muqaran/maudhu'i) dipetakan ke cara kerja Lab (maudhu'i=sweep/wave, tahlili=per-lensa, muqaran=sintesis, ijmali=inferensi). Corak SUMBER (bil-ma'tsur/bir-ra'y/isyari) + **hierarki grounding** (ayat→sunnah→atsar sahabat→tabi'in→ra'y). Identitas Lab = "isyari-rekayasa" yang di-ground bil-ma'tsur dulu.
- **Rambu tafsir isyari klasik → guardrail keras** (masuk skill checklist): tak menyalahi zahir; ada sandaran (analogi lemah=bounded); bukan klaim maksud tunggal; tak simpulkan hukum/netral; batas tafsir ilmiah (sains=analogi BUKAN bukti; "resonansi bukan mukjizat numerik"). Ini menutup celah "melantur".
- **SKILL tadabbur-lab diperbarui**: tambah bagian "Metode formal" + 5 rambu isyari sbg checklist mutu wajib. Hukum Besi #2 ditegaskan = disiplin bil-ma'tsur.
- **Riset (agen background):** `21_TAFSIR_METHODS_RESEARCH.md` — metodologi tafsir global (adz-Dzahabi, Ibn Taimiyah muqaddimah, asy-Syathibi, i'jaz & debat tafsir ilmiah) + rambu isyari + batas scientific exegesis. ⏳ menyusul.
**Test:** —(dokumen+skill, tak ada kode/deploy). **Status:** ✅ dicatat & di-commit.

### [F1.43] Ilmu Hadis + Asbabun Nuzul jadi arsitektur + riset tafsir selesai — 2026-07-07
- **Riset 21 selesai** (`21_TAFSIR_METHODS_RESEARCH.md`): metode vs corak, rambu isyari 6-syarat (adz-Dzahabi/az-Zarqani/asy-Syathibi/al-Ghazali/Ibn Qayyim), hierarki grounding (Ibn Taimiyah), i'jaz + debat tafsir ilmiah (Tanthawi pro vs asy-Syathibi kontra), khilaf=metadata, sumber ber-tier + §8 keterbatasan (turats via sekunder → verifikasi matan). **5 actionable:** (1) metadata tipologi per kajian, (2) validator fail-closed "Kartu Rambu Isyari" 6-cek, (3) pisah lapis otoritatif vs lensa Lab, (4) rem tafsir ilmiah (kontroversi:tinggi+disclaimer), (5) khilaf sbg array pendapat.
- **PDF Peta Ilmu Hadis** (owner, image) + 2 rujukan asbabun nuzul (Walisongo 2025, Google Books) → **`22_ILMU_HADIS_ASBAB_ARCH.md`**: peta mustalah (riwayah/dirayah, sanad-matn-rawi, mutawatir/ahad, maqbul[sahih/hasan]/mardud[da'if→jenis], jarh-ta'dil, qudsi/marfu'/mauquf/maqtu') **dipetakan ke arsitektur Eval-Gate** (sanad=auditable chain, jarh-ta'dil=source reputation, klasifikasi=evidence quality, ma'mul-bih=gating verified→actionable). Asbabun nuzul = **lapisan grounding historis** (fitur Riwayat/asbab.json) → prinsip "konteks sebelum generalisasi" (padanan AI: provenance-before-inference, distribution-shift awareness).
- **SKILL diperbarui:** +rambu #6 cek asbabun nuzul; rujuk 21/22; catat rencana validator "Kartu Rambu Isyari" + metadata tipologi.
**Status:** ✅ dicatat & commit. **Next (saat digarap):** kodekan validator Kartu Rambu Isyari (fail-closed 6-cek) + field tipologi per kajian (non-breaking: default utk 63 kajian lama); perluas Eval-Gate tier Ahad + jarh-ta'dil saat modul hadis/sahabat.

---

### [BACKLOG-DICATAT] Modul Mazhab + Kitab per-mazhab + Catatan Sahabat — 2026-07-07

Owner minta (catat dulu, belum bangun): (1) **4 mazhab fikih** (Hanafi/Maliki/Syafi'i/Hanbali) + manhaj; (2) **kitab/buku tiap mazhab** (dari ulama/perawi mazhab) → nyambung fitur Kitab; (3) **catatan para sahabat** (profil + peran periwayatan, nyambung isnad). Owner tegas: "jangan sampe ada yang melantur" → validasi+verifikasi ketat.
**Rencana + aturan validasi lengkap → `19_MAZHAB_SAHABAT_PLAN.md`.** Inti guardrail: provenance wajib (≥2 sumber utk klaim kontroversial), netral (Sunni/Syiah & khilaf = metadata viewpoint, bukan vonis), anti-fabrikasi (atribusi kitab↔penulis & angka riwayat wajib cross-check; screenshot owner = sekunder, jangan disalin), kandidat kitab (al-Umm/Hidayah/Mudawwanah/al-Mughni dll) BELUM diverifikasi + audit lisensi turats/tahqiq, sahabat = deskriptif bersumber (hindari isu keutamaan/fitnah). Masuk fitur Belajar+Kitab; jalur tinjauan ahli utk naik status. Opsional: ushul fikih sbg bahan Lab (rule-engine inferensi hukum, tier interpretasi terpisah).
**Status:** 📝 dicatat, belum dibangun. Menunggu instruksi urutan owner.

---

### [F1.58] Konsolidasi — 8 prinsip baru dari 123 kajian (Mesin Temuan → 33) — 2026-07-08

Bukan wave baru: panen pola berulang (lab-mine sorot invariant×41, pipeline×22, audit×17, alignment×17, constraint×15, drift×10) jadi prinsip eksplisit. +8 prinsip (masing2 ≥2 bukti):
- **lifecycle-reinstantiation** (2:28,36:78-79,75:3-4): busur penuh init→run→shutdown→re-instantiate; kuasa cipta pertama=reproducibility (CATATAN TANZIH).
- **hard-inviolable-bounds** (2:229,65:1,55:5-9): hudud=hard guardrail fail-closed; langgar=corrupt state + penalti terinternalisasi.
- **deliberate-then-commit** (3:159,42:38,16:68-69): syura=deliberasi terdistribusi lalu commit/tawakal.
- **objective-driven-run** (67:2,18:7,21:35): objektif eksplisit + eval kualitas (aḥsan) bukan kuantitas.
- **beware-proxy-reward** (3:185,18:7): dunia=reward memperdaya=Goodhart/reward-hacking.
- **everything-quantized** (54:49,25:2,15:21): qadar=kuantisasi/quota/precision; khazanah dirilis terukur.
- **audience-adaptive-comms** (16:125,20:44): register komunikasi disesuaikan penerima; low-friction.
- **canonical-guidance-spec** (6:153,2:2,16:89): satu jalur kanonik + guidance-spec lengkap→aqwam.
Sintesis 33 prinsip valid; graph 159 node/230 edge (lebih padat); corpus regen; coverage 12.1% kandidat. lab-validate 123/123. LIVE.

---

### [F1.57] Wave 11 — PEDOMAN/ATURAN/WASILAH/SYARIAT (cakupan khalifah), +15 (total 123) — 2026-07-08

Selaras cakupan luas F1.55. 3 agen paralel; **syariat DIBACA STRUKTURNYA, bukan fatwa**; tiap ayat sebut Allah → CATATAN TANZIH; khilaf dicatat (4:59 lingkup ulil amri, 42:38 sifat mengikat syura).
- **Pedoman/petunjuk:** 2:2 (hudan=guidance-spec bagi muttaqin/opt-in), 6:153 (jalur kanonik tunggal vs fragmentasi), 17:9 (aqwam=optimum+reward-shaping), 16:89 (tibyan=reference-spec, scope bounded), 42:52-53 (nur=sinyal navigasi dari prior kosong).
- **Aturan/batas/tata-kelola:** 2:229 & 65:1 (hududullah=hard constraint/invariant+penalti terinternalisasi), 4:59 (hierarki otoritas+resolusi konflik=eskalasi ke source-of-truth), 3:159 & 42:38 (syura=konsensus terdistribusi lalu commit/tawakal; netral, bukan fiqh politik).
- **Wasilah/metode/komunikasi:** 16:125 (strategi komunikasi 3-tingkat adaptif-audiens), 5:35 (wasilah=pathway ke objective), 41:34 (adversary→ally/de-escalation), 3:104 (dedicated monitor+correction service), 20:44 (tone lembut/low-friction bahkan ke pihak keras).
coverage **123 kajian·229 ayat/11.9% kandidat** (backlog 72 [x]); graph 151 node/208 edge; corpus regen; mine 46 konsep. lab-validate 123/123, tanzih-lint bersih. LIVE.

---

### [F1.56] Wave 10 — BUSUR KOSMIK (init→run→shutdown→re-instantiate), +15 (total 108) — 2026-07-08

Wave selaras cakupan luas F1.55 + rambu GHAIB. 3 agen paralel, tiap kajian CATATAN TANZIH + (utk akhirat) CATATAN GHAIB; adab dijaga (istiwa tanpa takyif; 56:7 golongan=hak Allah; 75 pakai asbabun nuzul).
- **Awal/penciptaan kosmos (init):** 2:117 (badi+kun=spec→wujud bertahap), 25:59 (6 masa→istiwa=init→fase kendali), 7:54 (khalq/amr, subsistem terjadwal), 79:27-33 (build→provisioning), 41:9-10 (capacity/kuota rezeki).
- **Hidup-mati-ujian (run/eval):** 67:2 (lifecycle ber-objektif: menguji amal terbaik=objective function, kualitas vs Goodhart), 2:28 (state transitions/re-instansiasi), 3:185 (dunia=reward memperdaya/reward hacking), 21:35 (uji dua-sisi), 18:7 (sandbox+distractor reward/honeypot).
- **Kiamat-kebangkitan (shutdown→re-instantiate):** 81 & 82 (shutdown terurut + flush log amal), 36:78-79 & 75:3-4 (Yang mencipta pertama kuasa mengulang=reproducibility/restore presisi; CATATAN TANZIH kuasa Allah=landasan iman bukan analog), 56:1-7 (klasifikasi final 3 golongan).
coverage **108 kajian·213 ayat/11.4% kandidat** (backlog 71 [x]); graph 136 node/188 edge; corpus regen; mine 46 konsep. lab-validate 108/108, tanzih-lint bersih. Milestone: >100 kajian, busur kosmik penuh. LIVE.

---

### [F1.55] Cakupan tadabbur diperluas + rambu GHAIB — 2026-07-08

Owner memperluas visi: Al-Qur'an memuat pola ciptaan + **pedoman/aturan/wasilah/tata cara/syariat** (panduan khalifah) + **busur kosmik penuh** (kekosongan→cipta→hidup→mati→kiamat→kebangkitan). Konteks wahyu: Nabi ummi via Jibril = bagian keotentikan. → `24_MISSION_PHILOSOPHY.md` diperluas (cakupan + konteks wahyu + rambu GHAIB). **Rambu GHAIB baru (mirip tanzih):** perkara akhirat/ghaib dibaca DESKRIPTIF dari tafsir bersumber sbg pola, BUKAN spekulasi/klaim di luar teks; perkara iman; wajib CATATAN GHAIB. Syariat: baca struktur, JANGAN tetapkan fatwa. Ditanam di skill. Doc-only.

---

### [F1.54] Wave 9 — POLA PENCIPTAAN (north-star), +15 kajian (total 93) — 2026-07-08

Wave selaras north-star (F1.53): sintesis CARA/POLA penciptaan. 3 agen paralel, semua **CATATAN TANZIH** eksplisit (subjek=perbuatan Allah → baca pola pada PROSES/ciptaan, bukan Sang Pencipta; 0 tanzih-lint warning baru).
- **Penciptaan manusia:** 22:5 (tahapan tanah→nutfah→alaqah→mudghah=staged pipeline+checkpoint), 32:7-9 & 76:2 (sensor+evaluator di-provision saat init; nutfah amsyaj=merge dua sumber), 86:5-8 (provenance/reproducibility), 16:78 (blank-slate→bootstrap).
- **Penyembuhan & siklus:** 26:80 (self-healing/homeostasis tertanam pada tubuh), 17:82 & 10:57 (syifa=perbaikan state internal, efek bergantung penerima), 78:9-11 (tidur/malam=duty-cycle rest-recovery), 91:1-4 (jam kosmik/fasa).
- **Pertumbuhan/rezeki:** 80:24-32 (supply chain pangan), 6:95 (belah biji/hidup-dari-mati=transformasi generatif), 50:9-11 (air→panen→revival), 71:14-17 (tumbuh bottom-up bertahap), 16:11 (satu air→beragam buah).
Banyak 10 lensa (maks-dimensi). coverage **93 kajian·166 ayat/8.4% kandidat** (backlog 68 [x]); graph 121 node; corpus regen; mine 45 konsep. lab-validate 93/93. LIVE.

---

### [F1.53] North Star ditajamkan — sintesis POLA PENCIPTAAN, bukan Pencipta — 2026-07-08

Owner merumuskan inti niat (mempertajam pasca-tanzih F1.50): kita belajar dari Al-Qur'an & menyintesis POLA/CARA PENCIPTAAN (āyāt kauniyah/sunnatullah) — manusia dicipta-dikembangbiakkan, akal berpikir, siklus siang-malam, penyembuhan, pertumbuhan, autonomy → interpretasi-rekayasa → artificial. Yang dipelajari = "bagaimana Ia mencipta" (pola ciptaan) BUKAN "siapa Diri-Nya". Peran = khalifah/sub-creator yang MENIRU pola (lapisan sebab), bukan mencipta dari ketiadaan/menyekutukan. → `24_MISSION_PHILOSOPHY.md` (north star); ditanam di skill (di atas tanzih) + framing publik /lab intro. Tanzih tetap mutlak. Build ok, LIVE.

---

### [F1.52] Doa diperkaya — +22 doa (total 35) — 2026-07-08

Lanjut isi halaman non-Lab (Doa paling tipis, 13→35, paling sering dipakai harian). Agen sumberkan 11 doa Qur'ani (deret rabbana: 2:286, 3:8/16/193, 7:23/126, 14:40-41, 20:25-28, 25:74, 40:7, 46:15 dst) + 11 doa harian sunnah (masuk/keluar masjid, setelah wudhu, setelah adzan, sayyidul istighfar, pagi-petang, hujan, berbuka, masuk pasar, memakai pakaian, susah/gundah, sakit) dgn skema penuh (text_ar/translit/meaning/source/grade/detail{penjelasan,riwayat,sanad}). Merge: **+22 (0 dupe, 0 bad-ref) → 35** (quran:16, harian:19). **Doa Qur'ani href diverifikasi vs mushaf.** Grade konservatif, tanzih dijaga. Data-only, LIVE.

---

### [F1.51] Kisah diperkaya — +20 kisah Qur'ani (total 32) — 2026-07-08

Lanjut isi halaman non-Lab. Agen sumberkan 20 kisah Qur'ani terkenal (Hud/Shaleh/Luth/Musa-Khidr/Dzulqarnain/Luqman/Ashabul Fil/Qarun/Ashabul Ukhdud/Zakariya/sapi betina/Talut-Dawud-Jalut/Syuaib/Habil-Qabil/mukjizat Isa/3 utusan/2 kebun/2:259/Idris) → `kisah-add.json`; aku merge ke kategori qurani, dedup, **verifikasi related refs vs mushaf (0 bad-ref, 0 dupe)** → 32 total. Tanzih dijaga (mukjizat=peristiwa "dengan izin Allah", bukan gambarkan Dzat). Data-only, LIVE.

---

### [F1.50] ⛔ KOREKSI TANZIH — Allah tak boleh dianalogikan sbg sistem — 2026-07-08

**Koreksi teologis penting dari owner:** ide "silang Asma'ul Husna ↔ Lab (atribut Allah sbg lensa)" SALAH & DIBATALKAN. Allah = Dzat ghaib & transenden; Sifat/Asma-Nya TIDAK boleh ditafsirkan/digambarkan/dibayangkan/dianalogikan sebagai atribut/komponen sistem (tanzih).
**Action:**
- **Aturan TANZIH jadi guardrail paling utama di skill** (di atas Hukum Besi): analogi HANYA pada sisi makhluk/manusia/teks/alam; Allah tak pernah jadi objek/peran/analog; bila ayat sebut Sifat Allah → landasan iman dgn ta'zhim, wajib "CATATAN TANZIH".
- **Audit & perbaikan 3 spot yang terlanjur melewati batas:** (1) fatihah-1-1-7 — Allah dicasting "Principal"/"interaksi agen dgn Principal-nya" → reframe ke DISIPLIN MANUSIA (pengabdian/kalibrasi diri); (2) hasyr-59-18 — "khabīr = observabilitas total/auditor tertinggi" → reframe: iman bahwa Allah Maha Mengetahui = landasan kejujuran muhasabah, sifat Allah TAK dianalogikan; (3) kerangka Pohon Din (ihsan) — "khabīr=observability layer" → reframe ke postur pelaku + catatan tanzih.
- **`lab-validate` +soft tanzih-lint** (WARN, tak menggagalkan): sorot frasa "Principal", "khabīr=observ", "Allah=", "sifat/asma…=sistem/lensa" untuk tinjauan manual. (1 false-positive furqan-25-53 "sifat AIR" — aman.)
- Scrub rencana silang-Asma dari 23_STRATEGY + memory.
**Sikap:** Asma'ul Husna tetap sbg materi Belajar (dikenal/dihafal), TIDAK jadi lensa rekayasa. Prinsip: Lab menafsir-rekayasa POLA di makhluk/teks, Allah selalu di luar jangkauan analogi.
**Test:** lab-validate 78/78 (+lint); corpus regen. **Status:** ✅ deploy.

---

### [F1.49] Riwayat diperkaya — +17 asbabun nuzul dari al-Wahidi (total 32) — 2026-07-08

Mapping dokumen owner (al-Wahidi PDF) → modul **Riwayat**. Agen ekstrak 25 asbabun nuzul dari `Asbab Al-Nuzul by Al-Wahidi.pdf` (terjemahan Guezzou, Royal Aal al-Bayt 2008) via python pypdf → `asbab-add.json`; aku merge+dedup ke asbab.json (schema {surah,ayah,title,narrative,source,grade}). Hasil: **+17 baru** (8 dupe di-skip, 0 ref invalid vs mushaf, 0 incomplete) → **32 entri** (2× lipat). Perawi dikutip di source (Ka'b ibn 'Ujrah, Sa'd ibn Abi Waqqash, 'A'ishah, Ibn 'Abbas, al-Bara', Ubay, Jundub); grade konservatif "riwayat (al-Wahidi)" (tak mengarang derajat). Banyak surah pendek (93,96,97,102,106-113) + 2:104/158/187/196, 5:90 dll. Riwayat tab (panel Identitas) otomatis surface — API /ayah/111/1/riwayat verified live (Abu Lahab). Data-only, LIVE, app lain 301.
**Next:** Rukun Iman/Islam detail; Kisah perluas; silang Asma↔Lab; sisa asbab bertahap.

---

### [F1.48] Belajar: Sifat-sifat Allah (20 wajib + jaiz) — netralitas mazhab akidah — 2026-07-08

Lanjutan otonom "isi halaman lain". Data bersumber (agen): `belajar/sifat.json` — kerangka **sifat 20** (Asy'ari/Maturidi; urutan Wujud→Mutakalliman) + jaiz 1. **Netralitas kritis dijaga:** field `note_neutralitas` eksplisit (pendekatan Atsari/Salafi menetapkan sifat sesuai nash tanpa enumerasi & takwil = metadata, BUKAN vonis; keduanya arus Sunni). Agen taat: jaiz `mustahil`="—" (tak ada lawan wajib), 7 sifat ma'nawiyyah pakai dalil konsisten. **21 dalil valid vs mushaf (0 invalid).** UI: `/belajar/sifat-allah` (catatan netralitas paling atas) + Belajar hub jadi 4 kartu. Status kandidat-perlu tinjauan. TSC+build ok, LIVE, app lain 301.
**Next mapping:** asbabun nuzul (al-Wahidi)→Riwayat; Rukun Iman/Islam detail; Kisah perluas; silang Asma↔Lab.

---

### [F1.47] Belajar diperluas — Asma'ul Husna + 25 Nabi + Malaikat (bukan cuma Lab) — 2026-07-08

**North Star:** owner "AI-brain arch DITAHAN (dia revisi SIDIX sendiri); otonom; jangan cuma isi Lab, halaman lain juga isi & optimasi; setiap referensi kamu yg mapping". → garap fitur **Belajar** (domain yg sudah kupetakan di 23).
**Action:**
- Data **bersumber** (agen, prinsip "sumber dulu bukan generate"): `public/data/belajar/` → **asma.json (99 Asma'ul Husna**, enumerasi Tirmidhi 3507, khilaf=metadata), **nabi.json (25 Nabi**, Ulul Azmi 5, tiap nabi 2-3 ayat_ref), **malaikat.json (10**, dalil "—" utk nama dari hadits agar tak mengarang rujukan Qur'ani). Semua `status: kandidat — perlu tinjauan ahli`.
- `lib/belajar.ts` (loader getAsma/getNabi/getMalaikat + ayahHref) + 3 halaman `/belajar/{asma-ul-husna,nabi,malaikat}` (Asma searchable via AsmaGrid client) + kartu domain di /belajar.
- **Integritas terverifikasi:** 99/25/10 ✓; **semua ayat_ref nabi valid vs mushaf kanonik (0 invalid)**; Ulul Azmi = Nuh/Ibrahim/Musa/Isa/Muhammad ✓; nama sesuai daftar masyhur.
**Test:** TSC clean; next build 4 halaman /belajar sukses. **Status:** ✅ deploy. **Next (mapping dokumen — sesuai arahan):** asbabun nuzul (al-Wahidi PDF) → modul Riwayat; Sifat Allah (sifat 20/wajib-mustahil) + Rukun Iman/Islam detail; Kisah perluas; kajian Lab silang ke Asma (atribut=kapabilitas sistem).

---

### [F1.46] Wave 8 — 3 agen paralel, +15 kajian maks-dimensi (total 78) — 2026-07-08

**North Star:** owner "gas otonom, kamu tentukan" → kupilih Wave 8 (misi inti + pola teraman) dgn arahan baru MAKSIMALKAN DIMENSI.
**15 kajian (3 tema):**
- **Kadar/takdir/ukuran:** 54:49 (qadar=kuantisasi/typing/quota — 11L), 25:2 (construct→configure presisi — 10L), 87:1-5 (init→configure→guide lifecycle — 11L), 15:21 (khazanah+qadar=lazy-loading/backpressure — 10L), 65:3 (bounded delegation/timeout+fallback — 10L).
- **Kosmos lanjutan:** 41:11 (dukhan→struktur=bootstrapping), 21:104 (gulung langit=serialization/teardown), 78:6-7 (gunung-pasak=stabilizer/damper anti-osilasi), 16:15 (rawasi+routing), 51:20-21 (āyāt di bumi&diri=observabilitas).
- **Manusia/sosial/kapasitas:** 49:13 (li-ta'arafu=handshake/diversity, trust-by-alignment-not-origin — 10L), 13:11 (ubah dari state internal=self-modification bottom-up — 10L), 2:286 (wus'=rate-limit/graceful degradation), 30:21 (pairing komplementer=restoring force), 4:1 (fan-out dari base tunggal+lineage).
- **Maks-dimensi berhasil:** beberapa kajian 10-11 lensa (bukan 9 kaku). Klaim sains dukhan/gunung-pasak dibingkai "resonansi bounded, BUKAN mukjizat numerik".
**Derived:** coverage 78 kajian·128 ayat (7.4% kandidat, backlog 50 [x]); graph 106 node/128 edge; corpus **884 chunk**; lab-mine 45 konsep berulang.
**Test:** lab-validate 78/78; spot-check 54:49 & 49:13 tajam. **Status:** ✅ deploy. **Next:** integrasi analogi baru→prinsip (qadar=quantization, li-ta'arafu=interop, wus'=capacity-limit); domain Belajar (Nabi/Malaikat/Sifat); governance sisa.

---

### [F1.44] Umpan balik GPT/Gemini + domain baru + governance — 2026-07-08

Owner (sambil sesi limit): diskusi /lab dgn GPT-5 & Gemini (dinilai 9/10 konsep, "beta research platform bukan tafsir AI"); minta baca 2 PDF asbabun nuzul + URL; tambah domain 25 Nabi/Malaikat/Sifat Allah/dasar Islam/Kisah ("kelompokan sendiri"); tegaskan filosofi: sintesis tiap ayat jadi SEBANYAK mungkin dimensi (ia temukan 37 tafsir dari 1 ayat 2:2).
**Rekam lengkap → `23_STRATEGY_DOMAINS_FEEDBACK.md`:**
- **Kritik GPT diadopsi:** bahasa terlalu afirmatif utk status analogi → pelunakan framing (Mesin Temuan=+"Peta Hipotesis Pola"; Blueprint=+"Kerangka ANALOGI"; "diturunkan"→"diinspirasi pola"). Governance: badge status 3-tingkat, "Mulai dari sini", 3 pintu masuk, panel sumber per klaim, kanal kritik.
- **Domain baru → penempatan diputuskan:** dasar Islam/Sifat Allah(Asma'ul Husna 99)/Malaikat/25 Nabi → fitur **Belajar** (perluas deen.json); Kisah → fitur **Kisah**. Semua provenance+dalil, angka masyhur=metadata khilaf, netral, silang ke Lab sbg bahan tadabbur.
- **Asbabun nuzul sumber primer:** al-Wahidi *Asbab an-Nuzul* (PDF 184hlm) + as-Suyuti Lubab + PDF 653hlm + URL Walisongo/UINSGD (tanjim=incremental deployment). Perkuat modul Riwayat/asbab.json.
- **Metode:** "maksimalkan dimensi per ayat" masuk skill (lensa sebanyak relevan, lintas-disiplin) TETAP di bawah rambu isyari.
- **Arsitektur AI-brain (dari Gemini + rencana kita):** QCA→ Dhikr(RAG+tamper-ledger+cache), Tafakkur(multi-agen Ollama/LoRA), Eval-Gate(agen evaluator burhan), Muhasabah(self-audit→dataset LoRA). Spec organisme digital, dibingkai ANALOGI.
**Turn ini kerjakan:** badge status 3-tingkat + "Mulai dari sini" + framing pelunakan (F1.45). Sisanya menyusul.
**Status:** ✅ dicatat & commit (checkpoint aman).

---

### [CHECKPOINT] Berhenti — 2026-07-07 (pasca F1.41)

**Kondisi:** SEMUA LIVE & sehat di quran.migancore.com. HEAD master = Wave 7. App lain di server 301 (aman, dicek tiap deploy).
**Yang berdiri (ringkas):**
- **Fase 1 inti:** mushaf ber-Merkle (root eb13d58a…) · reader cursor-mode · audio · word-by-word · notebook · auth/RBAC · i18n · hadits/belajar/doa/kitab/kisah · tafsir Kemenag+Jalalain+translit+arti mesin · asbabun nuzul · **search terjemahan full-text** (ketik kata→ayat).
- **Lapisan Kepercayaan:** Eval-Gate (tier isnad) · antrean tinjau /tinjau (RBAC) · Integritas.
- **Lab Tadabbur (Poin 4):** 63 kajian · 16 lensa · 24 prinsip · 3 Kerangka Besar (Pohon Din, Aql-Qalb, Naqli-Aqli) · Mesin Temuan /lab/sintesis · **Peta Pengetahuan /lab/graph** (second-brain, 90 node) · riwayat tadabbur (versi+arsip) · jalur tinjauan ahli · **korpus siap-ML lab-corpus.jsonl (710 chunk)** · panel cakupan jujur (107 ayat/6% kandidat). Skill: `.claude/skills/tadabbur-lab`. Tools: scaffold/rev/validate/mine/coverage/graph/corpus. Riset: 14/16/17_*.md.
**TITIK LANJUT (tinggal "gas"):**
1. **Wave 8+** tadabbur: tema besar backlog belum tuntas (pikir/akal ~120, ilmu/ajar, air, hitung/ukuran) via 3 agen paralel — kejar 554 kandidat bertahap.
2. **Embedding** bge-m3 → pgvector atas lab-corpus.jsonl (SAAT korpus tebal) → query semantik + fondasi AI brain.
3. Integrasi analogi agen kuat jadi prinsip baru (single-source-of-truth, knowledge-grounding, sensor-fusion) via lab-mine → skill.
4. Onboard peninjau ahli nyata (naikkan status kajian dari "menunggu tinjauan").
**Terbuka:** chip task_61880c3d (fix tafsir 49:12 — sumber equran.id sendiri salah, perlu sumber Kemenag alternatif).
**Rutinitas deploy:** commit→push→ssh sidix-vps→git pull --ff-only→docker compose up -d --build web→cek /lab 200 + app lain 301. Pra-commit kajian WAJIB: node pipeline/lab-validate.mjs (+ coverage/graph/corpus regen bila kajian nambah).
**Status:** ⏸ berhenti atas permintaan owner. Konteks aman: episodic + memory (lab-tadabbur, evalgate-trust-layer, mushaf-pipeline-f1) + dokumen 12-17.

---

### [F1.41] Wave 7 — 3 agen paralel, +15 kajian (total 63); pilih tadabbur dulu drpd embedding — 2026-07-07

**North Star check:** ya — owner tanya "embedding dulu atau lanjut tadabbur?". Rekomendasiku: tadabbur dulu (nilai marginal kajian tinggi; embedding = investasi sekali, lebih hemat saat korpus tebal; korpus sudah .jsonl jadi menunda tak rugi). Owner setuju arah.
**Wave 7 — 3 agen paralel (@5, patuh skill, ground tafsir, gate fail-closed):**
- Batch D tafakkur: 2:164 (sensor-fusion: banyak sinyal→satu kesimpulan), 30:8 (introspeksi-dulu+TTL), 45:13 (tool/affordance catalog), 59:21 (kapasitas≠eksekusi), 16:12 (shared clock/landmark grounding).
- Batch E ilmu/bahasa: 2:31-32 (al-asma=knowledge grounding/tokenizer/refuse-when-ungrounded — KUAT), 20:114 (continual learning), 18:66 (apprenticeship/distillation), 55:1-4 (al-bayan=NLG di atas korpus grounded), 12:76 (anti-overconfidence/deferral).
- Batch F bukti/hujjah: 2:111 & 27:64 (burden of proof=Eval-Gate burhan), 21:22 (reductio→single-source-of-truth/one arbiter — KUAT), 17:81 (ground truth geser noise), 52:35-36 (argumen kausal/proof-by-exhaustion).
**Derived regen:** coverage 63 kajian·107 ayat langsung (6% kandidat, backlog 44 [x]); graph 90 node/111 edge; corpus **710 chunk**; lab-mine 41 konsep berulang.
**Test:** lab-validate 63/63; preview: kajian render (Inferensi+badge+konten), graph 90 node, 0 server error. Spot-check mutu: 2:31-32 & 21:22 tajam & on-theme.
**Status:** ✅ deploy. **Next:** wave lagi (pikir/akal 120 masih banyak, ilmu/ajar, air) sampai kandidat besar tergarap; BARU embedding bge-m3→pgvector saat korpus tebal; integrasi analogi agen kuat ke prinsip (single-source-of-truth, knowledge-grounding, sensor-fusion).

---

### [F1.40] Search terjemahan + Peta Pengetahuan (second-brain) + korpus siap-ML — 2026-07-07

**North Star check:** ya — 3 permintaan owner: (1) fix error, (2) search bar cari via kata terjemahan, (3) Lab jadi peta pengetahuan/linkage ala Obsidian+second-brain, "biar riset bisa dipakai ML/LLM/corpus/inference".
**(1) Error 49:12:** dicek — equran.id (sumber Kemenag) SENDIRI mengembalikan teks salah utk 49:12 (bukan bug pipeline kita). Chip re-seed dipertahankan (perlu sumber Kemenag alternatif). Kajian hujurat-49-12 sudah grounding jujur ke terjemah + catat diskrepansi.
**(2) Search terjemahan full-text:**
- `pipeline/gen-search-index.mjs` → search-index.json (6236 ayat, id+en, 2MB).
- API `/api/v1/search/ayah?q=&lang=&limit=` (index cache module-scope; klien tak unduh 2MB) → snippet + surah:ayah.
- SurahList: input diperluas — ketik kata (≥3, bukan angka) → debounced fetch → seksi "Ayat mengandung ..." dgn highlight + link ke /surah/N#ayah-A. i18n id/en/ar. (uji: "hujan" → 47 ayat, pertama 2:19 ✓).
**(3) Peta Pengetahuan (second brain) + korpus ML:**
- `pipeline/lab-graph.mjs` → lab-graph.json: node kajian/prinsip/kerangka + edge (evidence + framework + tautan istilah Qur'ani bersama) + `related` (backlink per kajian). 75 node, 104 edge.
- `/lab/graph`: graf gaya-terarah interaktif (SVG, layout deterministik client-only utk hindari hydration mismatch, tanpa lib eksternal/CSP-safe), warna per-cluster, klik node kajian → buka; zoom; hover highlight tetangga.
- Backlink "🔗 Kajian terkait" di tiap halaman kajian (via istilah/prinsip bersama) — rasa wikilink/Obsidian.
- `pipeline/lab-corpus.mjs` → **lab-corpus.jsonl (545 chunk)**: tiap chunk = unit reasoning (lens/inference/makna/prinsip/kerangka) + metadata kaya (ref ayat, cluster, prinsip, istilah, analogi, provenance, tier=interpretation) → siap embed/RAG/fine-tune. Tombol unduh di /lab/graph (jsonl + graph.json + synthesis.json).
- +Prinsip "decay-without-maintenance" (drift×6 dari lab-mine) → 24 prinsip. Link Peta+Sintesis dari /lab.
**Test:** next build sukses (191 halaman, /lab/graph 2.09kB); TSC clean; lab-validate 48/48; preview: search "hujan"=47, graf 75 node/104 edge render, korpus jsonl reachable, backlink tampil; hydration mismatch beres (client-only mount); 0 error nyata.
**Status:** ✅ deploy. **Next:** search: fuzzy/normalisasi diakritik + cari teks Arab; graf: cluster-collapse & pencarian node; korpus: endpoint embedding (bge-m3) → vektor pgvector (nyambung ke rencana RAG Fase awal).

---

### [F1.39] Peta cakupan jujur + Wave 6 (3 agen paralel, +15 kajian → total 48) — 2026-07-07

**North Star check:** ya — owner nyadar "dari ribuan ayat baru sedikit ditadabburi". Jujur: sebelumnya 67 ayat langsung (1.1%). Respons: percepat + buat progres TERLACAK.
**(a) Peta cakupan (`pipeline/lab-coverage.mjs` → coverage.json → panel /lab):** hitung jujur — studi langsung, dikutip-bukti, tersentuh, per-tema dari backlog. Denominator jujur = 596 kandidat bertema (bukan 6236, krn ayat naratif/hukum berulang tak dipaksa jadi kajian). Panel tampilkan angka + progress bar + disclaimer "maraton bukan sprint".
**(b) Wave 6 — 3 AGEN PARALEL (@5 kajian, patuh skill tadabbur-lab, ground tafsir, gerbang fail-closed):**
- Batch A air/substrat: 25:53 (barzakh=context-isolation/anti prompt-injection!), 24:45, 6:99, 56:68-70 (provenance data), 67:30 (SPOF/dependency).
- Batch B astronomi/determinisme: 21:33, 36:38-40 (safety-invariant/phase-planning), 15:19 (kalibrasi/quota), 51:47 (elastic scaling/headroom), 55:33 (least-privilege/authz!).
- Batch C nalar-kritis: 2:170 (taklid=RAG wajib sitasi, tolak parametric memory!), 17:36 (audit fakultas), 10:36 (zhann vs bukti), 49:12 (higiene prior+privasi), 3:190-191 (integrasi dzikir+pikir=naqli-aqli).
- **Prinsip baru "decay-without-maintenance"** (dari lab-mine, drift×6): tanpa pemeliharaan sistem meluruh → 24 prinsip.
- Mutu di-spot-check: pembacaan tajam & on-theme; guardrail (resonansi bukan mukjizat) terjaga; semua `menunggu tinjauan` (tak ada endorse palsu).
**(c) Bug data ditemukan agen C:** tafsir Kemenag QS 49:12 salah-tempel (isi soal neraka, bukan prasangka) — di-flag spawn_task task_61880c3d utk re-seed; kajian hujurat-49-12 grounding jujur ke terjemah + catat diskrepansi.
**Hasil cakupan:** 48 kajian · 87 ayat langsung · 87 tersentuh (1.4% total, 6% kandidat). Naik dari 33/67.
**Test:** lab-validate 48/48 + sintesis (24 prinsip/8 lapis/3 kerangka) valid; TSC clean; preview: panel cakupan render + 3 kajian agen + prinsip drift; 49 link; 0 error konsol.
**Status:** ✅ deploy. **Next:** wave paralel lagi (tema besar backlog: pikir/akal 120, saksi/bukti sisa, ilmu/ajar); integrasikan analogi agen ke sintesis (barzakh→isolation, authz→least-privilege bisa jadi prinsip); onboard peninjau nyata.

---

### [F1.38] Wave 5 attestation + generator prinsip + jalur tinjauan ahli (total 33) — 2026-07-07

**North Star check:** ya — 3 arah yang owner konfirmasi "lanjut aja": (1) cluster saksi/bukti, (2) generator prinsip semi-otomatis, (3) jalur tinjauan ahli.
**(1) Cluster ATTESTATION (5 kajian saksi/bukti):**
- **nisa-4-135** syuhadāʾ lillāh walau atas diri → evaluator/judge tak-bias; self-critique jujur; guard bias afiliasi+status.
- **nur-24-4** 4 saksi utk tuduhan berat → confidence threshold BERSKALA dgn harm; biaya asimetris klaim palsu high-stakes.
- **qaf-50-17-18** raqīb ʿatīd → audit logging always-on + redundan + kategori-di-titik-tulis; zero untracked actions.
- **fussilat-41-20-22** kulit bersaksi → self-attestation/non-repudiation; tamper-evident telemetry terdistribusi.
- **zalzalah-99-1-8** sebesar dzarrah → audit no-threshold + immutable ledger + deterministic replay; audit berlapis (diri+komponen+substrat).
- Synthesis: cluster ke-8 "attestation" 📿 + 3 prinsip baru (unbiased-attestation, harm-scaled-evidence, complete-immutable-audit) → total 23 prinsip.
**(2) `pipeline/lab-mine.mjs`:** baca semua kajian → glosarium konsep rekayasa → pola berulang ≥2 kajian → `18_MINED_PATTERNS.md` (USULAN utk ditinjau, tak menulis synthesis). Hasil: audit×8, alignment×8, drift×6, verifikasi×5, redundansi/threshold/homeostasis/invariant/pipeline×4 — memvalidasi cluster & menyorot 'drift' (6) sbg kandidat pola.
**(3) Jalur tinjauan ahli:** skema +`review{verdict,by,role,credential,date,note}` (opsional); `pipeline/lab-review.mjs` stempel (endorsed→status published); UI badge status tinjauan (default "🕵️ menunggu tinjauan ahli"); validasi atribusi wajib. **Integritas: TIDAK ada endorsement palsu** — AI hanya boleh `pending`; hanya peninjau berkelas nyata yang mengesahkan. SKILL diperbarui (lab-mine + lab-review).
**Test:** lab-validate 33/33 + sintesis (23 prinsip/8 lapis/3 kerangka) valid; TSC clean; preview: 41:20-22 render 3 ayat+non-repudiation+badge tinjauan; cluster attestation di /lab/sintesis; 34 link; 0 error. Backlog: 31 [x].
**Status:** ✅ deploy. **Next:** tinjau 18_MINED_PATTERNS.md (pola 'drift' → mungkin prinsip eksplisit); tema backlog: cahaya/optik sisa, air, berpasangan; onboard peninjau nyata via antrean /tinjau.

---

### [F1.37] Skill + Kerangka Besar (Pohon Din, Aql-Qalb, Naqli-Aqli) + 4 lensa domain + riset global — 2026-07-07

**North Star check:** ya — owner minta 5 hal: (1) jadi SKILL, (2) artefak/aplikasi, (3) metode, (4) playground riset, (5) syntax/script/inference — plus domain baru (biologi/matematika/geologi/astronomi/kimia/sejarah), kerangka Iman-Islam-Ihsan/tauhid (diagram pohon), anatomi kognisi Aql-Qalb, dan riset global tercanggih.
**Action:**
- **(1)+(3) SKILL:** `.claude/skills/tadabbur-lab/SKILL.md` — seluruh metode dikodifikasi (hukum besi → alur produksi 9 langkah → re-tadabbur → sintesis prinsip → framework → deploy). Sesi mana pun kini bisa memproduksi kajian dgn disiplin identik.
- **(4) Lensa domain +4:** biology-medicine 🧬, earth-cosmos 🌌, chemistry-process ⚗️, history-ummah 📜 (total 16 lensa).
- **(2) KERANGKA BESAR di /lab/sintesis** (synthesis.json.frameworks + tipe + render + validasi fail-closed):
  - **Pohon Din** (basis: hadits Jibril Sahih Muslim 8, bersumber di app): Iman=akar=VALUES/world-model → Islam=batang=PROTOCOL/interface → Ihsan=buah=QUALITY-UNDER-OBSERVATION. Temuan tajam: *sistem yang baik hanya saat diawasi = kebalikan persis ihsan (deceptive alignment)*.
  - **Aql–Qalb** (basis riset 14+17): reasoning engine (aql) + value-evaluator (qalb); pemahaman = keduanya. Mode gagal terparah: SEGEL (khatm/rān) = evaluator corruption — *reward hacking = rān versi mesin*. Kandidat kajian: 22:46 (prioritas), 2:6-7, 83:14.
  - **Naqli–Aqli**: dual corpus (qauliyah+kauniyah) + tauhid = CONSISTENCY AXIOM (konflik tampak = bug pembacaan, bukan kontradiksi sumber) — kerangka integrasi SEMUA domain ilmu.
- **(5) Riset global (2 agent):** ✅ `17_AQL_QALB_EPISTEMOLOGY.md` selesai — sumber ber-tier (Ibrahim Kalin; Religions/MDPI 2025 qalb↔batas AI; al-Farabi Iḥṣāʾ al-ʿUlūm; Ibn Khaldun; al-Attas/al-Faruqi; maqāṣid sbg guardrail AI) + checklist ayat "klaim sumber wajib verifikasi mushaf" + disclaimer jujur (kaitan segel↔bias kognitif belum ada paper tier-A). ⏳ Agent PDF (16_IMAN_ISLAM_IHSAN_RESEARCH.md) masih jalan — menyusul.
**Test:** lab-validate 28/28 + sintesis (20 prinsip, 8 lapis, 3 kerangka) valid; TSC clean; preview: 3 kerangka render (basis atribusi tampil, layer engineering tampil); 0 error.
**Status:** ✅ deploy. **Next:** kajian 22:46 & 2:6-7 & 3:190-191 (penguat kerangka); serap temuan 5-actionable dari riset 17 (maqāṣid guardrail, taksonomi al-Farabi sbg ontologi) ke blueprint; commit 16_*.md saat agent selesai.

---

### [F1.36] Wave 4 — 5 kajian penguat: SEMUA prinsip kini ≥2 bukti (total 28) — 2026-07-07

**North Star check:** ya — "ok gas" otonom; menutup kelemahan yang kucatat sendiri di F1.35 (5 prinsip note_single = baru 1 kajian).
**5 kajian penguat (di-ground tafsir dulu):**
- **furqan-25-67** qawām (tak boros tak kikir) → memperkuat *median-stable-fair*: invariant DUA SISI, U-shaped loss, overfit vs underfit.
- **maidah-5-1** awfū bil-ʿuqūd → memperkuat *ledger-audit-trail*: catat (2:282) DAN tunaikan (5:1); commitment binding utk orkestrasi agen; penyimpangan wajib eksplisit.
- **munafiqun-63-9-10** deadline tak bisa dinegosiasi → memperkuat *time-as-capital*: anytime commits (kecil & sering), objective guarding dari distraksi, feedback pra-cutoff.
- **nahl-16-65** bumi hidup lagi oleh air → memperkuat *shared-substrate*: revival via re-injeksi substrat (model stale + data segar), dormansi bukan mati.
- **zumar-39-6** tiga kegelapan → memperkuat *stage-aware-care*: defense-in-depth 3 lapis; sandbox berlapis utk fase rapuh; "kemampuan penuh diekspos terakhir".
**Sintesis diperbarui:** 5 prinsip naik ke ≥2 bukti, SEMUA note_single dicabut → 20/20 prinsip kini berbasis pola berulang. lab-validate 28/28 + integritas sintesis ✓.
**Test:** preview 2 kajian baru ok; sintesis menampilkan evidence baru & ⚠ hilang; /lab 29 link; 0 error.
**Status:** ✅ deploy. **Next:** tema backlog belum tergarap (saksi/bukti 115, cahaya, besi/material sisa); generator prinsip semi-otomatis; tinjauan ahli utk naikkan status kajian.

---

### [F1.35] Mesin Temuan — sintesis lintas-kajian + Blueprint Organisme Digital — 2026-07-07

**North Star check:** ya — owner minta jadikan pola-pola ini "dasar pengembangan AI/ML/Agentic; utamanya teknologi, komputasi, cara kerja otak, kehidupan→logika makhluk digital, AI autonomous, organisme digital"; "clusterin sendiri"; sekunder sosial/keuangan/bisnis/kedokteran/mesin. Lab berpindah dari kumpulan kajian per-ayat → MESIN TEMUAN.
**Action:**
- `public/data/lab/synthesis.json` (schema lab-synthesis-v1): **20 prinsip** hasil harvest pola berulang, di-cluster 7 (utama **ai-core**🤖 + cognition🧠/learning📈/systems🕸️/epistemics🔍/society💰/life🧬). Tiap prinsip: statement + evidence (≥2 kajian, kecuali ditandai note_single) + **implikasi rekayasa** (fokus AI/ML). + **Blueprint Organisme Digital / Agen Autonom** = 8 lapis (Persepsi→Memori→Penalaran→Pembelajaran→Aksi→Umpan-balik→Alignment→Multi-agen), tiap lapis dipetakan ke istilah Qur'ani + prinsip + ayat.
- `lib/lab.ts` getLabSynthesis + tipe. `components/LabSynthesisView.tsx` (blueprint flagship + prinsip filter-by-cluster + evidence chip → link ke kajian). `app/lab/sintesis/page.tsx`. Banner menonjol di /lab.
- `lab-validate` diperluas: integritas sintesis (tiap evidence.id → kajian nyata; cluster & blueprint.principle terdaftar) — fail-closed.
**Temuan flagship (prinsip inti AI):** align-before-scale, verify-before-act (dalil Eval-Gate), alignment-is-process, distributed-intelligence, staged-construction→emergensi, epistemic-ladder, dual-drive self-regulation, declarative-arc, learn-by-moving(OOD), invariant+feedback, self-audit prospektif, falsify-to-trust. Guardrail: bukan tafsir; note_single menandai prinsip yg baru 1 kajian (kandidat penguatan dicatat).
**Test:** lab-validate: 20 prinsip+8 lapis valid, 23 kajian 23/23; TSC clean; preview: blueprint render, 20 prinsip, filter cluster AI→4, 40 evidence-link, banner /lab, 0 error.
**Status:** ✅ deploy. **Next:** perkuat prinsip note_single (Wave 4 tematik: saksi/bukti, air, nafkah-pertengahan); kelak generate prinsip semi-otomatis dari korpus.

---

### [F1.34] Wave 3 — lensa non-teknis + 6 kajian lintas domain (total 23) — 2026-07-07

**North Star check:** ya — owner "lanjut otonom"; ini lanjutan sintesis + membuka "turunan ilmu non-teknis" yang diminta sejak visi awal.
**Taxonomy diperluas:** +3 lensa non-teknis → **psychology (🧠)**, **economy (💰)**, **pedagogy (📚)**. Total 12 lensa. Kajian lama tetap valid (lab-validate cek key terdaftar; kajian pakai subset lensa relevan — tak dipaksa semua).
**6 kajian Wave 3 (dari backlog, ground tafsir dulu):**
- **nur-24-35** (cahaya/optik, 10 lensa) representasi berlapis "nūrun ʿalā nūr"; sumber≠perantara (model=kaca bukan cahaya); output dibatasi perantara terlemah.
- **shams-91-7-10** (psikologi, debut 🧠) nafs dua-potensi (fujūr/taqwā)+agensi; tazkiyah=continuous alignment vs drift; kesehatan mental = regulasi bukan penghapusan dorongan.
- **asr-103-1-3** (waktu/ekonomi) default=rugi (entropi); exit konjungtif 4 syarat; 2 syarat SOSIAL (tawāṣī) = koreksi butuh peer; waktu=kapital menyusut.
- **baqarah-2-143** (tata kelola) wasaṭ=median robust thd outlier → syarat jadi saksi adil; relevan AI-judge tak-bias; ujian kiblat=config-change eval.
- **dzariyat-51-49** (dualitas) berpasangan=biner basis informasi + adversarial pairs (GAN/actor-critic/proposer-verifier) sbg mesin peningkatan.
- **hasyr-59-18** (muhasabah) audit-diri prospektif (bukan ruminasi)=agent self-reflection (Reflexion)+forward credit assignment+observabilitas (khabīr).
**Temuan lintas-korpus menguat:** "align & ukur SEBELUM skalakan daya" kini muncul di 55:8, 30:41, 57:25; "koreksi butuh peer/jaringan" di 103:3 & 59:6-lensa. Pola berulang lintas surah = sinyal struktural, dicatat sbg inferensi tingkat-korpus.
**Guardrail:** resonansi sains ditandai "bukan mukjizat numerik"; makna dari tafsir bersumber; tier interpretasi.
**Test:** lab-validate 23/23; TSC clean; preview: lensa 🧠 Psikologi render + filter; ekonomi/pedagogi aktif; taxonomy 12 lensa; index 23; 0 error. Backlog: 25 kandidat ditandai [x].
**Status:** ✅ deploy. **Next:** lanjut backlog (tema saksi/bukti 115, air 48, penciptaan-bertahap belum tuntas); pertimbangkan halaman "sintesis lintas-kajian" (pola berulang antar ayat).

---

### [F1.33] Sweep korpus 6236 ayat → backlog tematik + Wave 2 (7 kajian, total 17) — 2026-07-07

**North Star check:** ya — owner minta "baca lagi SEMUA ayat (terjemahan+tafsir), jadikan interpretasi Lab; temuan utk teknologi, kesehatan, dll; terus reasoning & inference cari kemungkinan baru".
**Metode baru — sweep sistematis (agar cakupan berbasis data, bukan tebakan):**
- Script scan SELURUH 6236 terjemahan Kemenag (id) dgn 16 regex tema konsep → **596 ayat kandidat** → `15_TADABBUR_BACKLOG.md` (checklist, kajian selesai ditandai [x]). Regenerate: rerun sweep. Ini jadi BACKLOG resmi sintesis massal.
**7 kajian Wave 2 (dari backlog, di-ground tafsir Kemenag dulu; 9 lensa masing2):**
- **mujadilah-58-11** ilmu=sumbu elevasi; compaction+yield resource; ranking alignment×kapabilitas.
- **zumar-39-9** asimetri tahu vs tak-tahu = kelas ekuivalensi; knowledge-weighted, capability≠arsitektur.
- **anbiya-21-30** ratq→fatq (foundation→spesialisasi) + air=substrat (data); resonansi kosmologi DIBATASI (bukan klaim mukjizat numerik).
- **ankabut-29-20** sīrū fil-arḍ = OOD sampling + reverse-engineering asal-usul + active info gathering.
- **rum-30-41** fasād = pelanggaran invariant (definisi Kemenag!) + feedback korektif PARSIAL (bukan terminasi); ekologi/AI-harm.
- **muminun-23-12-14** (KESEHATAN) embriologi = pipeline bertahap + ordering constraint + emergensi (khalq ākhar = emergent abilities); sandbox rahim.
- **hadid-57-25** (MATERIAL/dual-use) kitab+mīzān+ḥadīd = spec+metric+hardware; kekuatan diletakkan TERAKHIR sesudah nilai+ukur = "align & ukur dulu, baru skalakan daya".
**Guardrail dijaga:** klaim sains ditandai "resonansi struktural, bukan mukjizat numerik"; makna religius selalu dari tafsir bersumber; tier "interpretasi — bukan tafsir".
**Test:** lab-validate 17/17; preview muminun render 3 ayat+pipeline+emergensi+badge+riwayat; index 17 link; 0 error konsol.
**Status:** ✅ deploy. **Next:** lanjut backlog (596 kandidat) per gelombang; kelak lensa non-teknis (psikologi/ekonomi/tata-kelola).

---

### [CHECKPOINT] Berhenti di sini — 2026-07-07 (pasca F1.32)

**Kondisi:** SEMUA LIVE & SEHAT di quran.migancore.com. HEAD master = Wave 1 kajian. App lain di server tetap 301 (terverifikasi tiap deploy).
**Yang sudah berdiri (ringkas rantai):**
- **Fase 1 inti:** mushaf ber-Merkle (root `eb13d58a…`) · reader cursor-mode · audio · word-by-word · notebook · auth/RBAC · i18n · hadits/belajar/doa/kitab/kisah · tafsir Kemenag+Jalalain + transliterasi + arti mesin (6010) · asbabun nuzul.
- **Lapisan Kepercayaan:** Eval-Gate (tier ala isnad + khilaf + muttafaq) · antrean tinjau /tinjau (RBAC) · dashboard Integritas.
- **Lab Tadabbur (Poin 4):** 10 kajian live, 9 lensa, QCA, riwayat tadabbur (versioning+arsip ?v=N), tooling scaffold/rev/validate. Riset: 14_TADABBUR_LAB_RESEARCH.md.
**TITIK LANJUT BERIKUTNYA (sudah dipetakan, tinggal "gas"):**
1. **Wave 2 tematik:** 58:11 (ilmu & derajat), 39:9, 21:30 (ratq-fatq), 29:20 (eksplorasi empiris), 30:41 (feedback kerusakan). Alur: ground tafsir → tulis kajian (9 lensa, LANGSUNG bukan agent) → lab-validate → index → deploy.
2. Lalu **Juz 30** (cakupan massal, pakai lab-scaffold).
3. Lalu **lensa turunan non-teknis** (psikologi/tata-kelola/ekonomi/akhlak — extend taxonomy.json).
**Rutinitas deploy:** commit → push → ssh sidix-vps → git pull --ff-only → docker compose up -d --build web → cek /lab 200 + app lain 301. Gerbang WAJIB pra-commit kajian: `node pipeline/lab-validate.mjs`.
**Status:** ⏸ berhenti atas permintaan owner. Konteks aman: episodic ini + memory (lab-tadabbur, evalgate-trust-layer, mushaf-pipeline-f1) + dokumen 12/13/14.

---

### [F1.32] Sintesis Wave 1 — 6 kajian tematik "ayat teknologi" (total 10 live) — 2026-07-07

**North Star check:** ya — owner serahkan urutan padaku; kupilih Batch B (tematik computational/AI/agentic — bahan terkuat visi "AI brain") sebelum cakupan Juz 30. Ditulis langsung (bukan agent) demi konsistensi suara & guardrail. Tiap kajian di-ground ke tafsir Kemenag (ditarik dari data app) sebelum ditulis.
**6 kajian baru (masing2 9 lensa + QCA + inferensi, lolos lab-validate):**
- **hujurat-49-6** Fatabayyanū → input validation di trust boundary; quarantine-then-commit; dalil Eval-Gate app ini sendiri.
- **nahl-16-43** Ahl adz-dzikr → RAG/expert-routing; guard "jika tak tahu → tanya, bukan mengarang" = anti-halusinasi 14 abad lalu.
- **nahl-16-68-69** Lebah → swarm intelligence; aturan lokal minimal → emergensi; honeycomb = tessellasi optimal (terbukti 1999); penutup ayat "li-qawmin yatafakkarūn" = undangan eksplisit tafakkur.
- **fussilat-41-53** Āfāq wa anfus → verifikasi dua kanal independen (world-model + self-monitoring); "ḥattā yatabayyana" = loop dgn kondisi konvergensi; bukti progresif (sanurīhim, future tense).
- **baqarah-2-282** Āyat ad-dayn (ayat TERPANJANG) → skema record transaksi; replikasi saksi + recovery ("yang satu mengingatkan yang lain"); segregation of duties; leluhur ledger ber-audit.
- **mulk-67-3-4** Farjiʿil-baṣar → red-teaming/falsifikasi: klaim integritas + undangan audit berulang + prediksi hasil; taxonomy cacat (tafāwut/fuṭūr).
**Test:** lab-validate 10/10 (skema, sumber, ref-vs-mushaf, riwayat); preview: nahl-16-68-69 render 2 ayat + lensa + badge + riwayat; index 10 link; 0 error konsol.
**Status:** ✅ deploy. **Next wave:** Juz 30 (cakupan) / lensa non-teknis / lanjut tematik (58:11, 39:9, 21:30, 29:20, 30:41…).

---

### [F1.31] Lab Tadabbur: riwayat tadabbur (versioning) + tooling sintesis + pilot Al-Fatihah — 2026-07-07

**North Star check:** ya — permintaan owner: "setiap interpretasi harus DIREKAM; seiring waktu di-tadabburi ulang" + mulai sintesis massal. Interpretasi = artefak hidup ber-versi; tak ada yang ditimpa diam-diam (sejalan prinsip immutability & transparansi proyek).
**Action:**
- **Skema lab-study-v2**: + `version` + `history[]` (riwayat tadabbur). Kompat mundur (v1 → default). 3 kajian lama di-upgrade.
- **Arsip rekaman**: re-tadabbur → versi lama DIREKAM ke `public/data/lab/archive/<id>.v<N>.json` (immutable, tak boleh ditimpa) & tetap terbaca di app via `/lab/<id>?v=N` (banner "📼 Rekaman lama" + link versi terkini). UI: badge 📼 v{n} + section "Riwayat tadabbur" (semua versi, klik buka arsip).
- **Tooling pipeline** (fondasi sintesis SEMUA ayat): `lab-scaffold.mjs` (kerangka kajian baru: tarik ayat+tafsir kanonik, verifikasi ref fail-closed, template 9 lensa TODO) · `lab-rev.mjs` (re-tadabbur: arsip → bump → entri history) · `lab-validate.mjs` (GERBANG wajib pra-commit: skema, sourced_meaning wajib, lensa terdaftar, ref vs mushaf, arsip lengkap; exit≠0 bila gagal).
- **Pilot sintesis per-surah: Al-Fatihah (1:1-7)** — kajian "protokol pembuka & loop kalibrasi harian": 9 lensa (protokol sesi; spec by example + negative examples di 1:6-7; heartbeat ≥17×/hari = spaced repetition; sinkronisasi terdistribusi 14 abad; core-context reload = anti-drift). Status basmalah = metadata antar-mazhab (netral, Kufi/Hafs). Total kajian live: 4.
- **Uji re-tadabbur end-to-end**: iqra-96-1-5 v1→v2 (lensa AI dipertajam: talaqqī = supervised chain ber-sanad yang auditable); v1 terarsip & terbaca via ?v=1.
**Test:** lab-validate 4/4 lolos; TSC clean; preview: badge v2 + riwayat + link v1 → banner arsip + isi v1 asli; Fatihah 7 ayat + 9 lensa + netralitas basmalah; 0 error konsol.
**Status:** ✅ selesai + deploy. **Next:** sintesis massal bertahap (per surah/juz — scaffold→isi→validate→tinjau), lalu lensa turunan ilmu non-teknis.

---

### [F1.30] MVP Lab Tadabbur — playground interpretasi rekayasa (Poin 4 dimulai) — 2026-07-07

**North Star check:** ya — ini eksekusi Poin 4 visi awal owner: "sintesis isi Al-Qur'an → komputasional, algorithm, AI system, agentic". Guardrail dijaga penuh (netral teologis; bukan tafsir; makna bersumber).
**Riset dulu (2 agent):** 5 PDF + 6 URL owner → `14_TADABBUR_LAB_RESEARCH.md`: taksonomi kognitif Qur'ani (Badi/IIUM: taʿaqqul, tafakkur, tadabbur, tadhakkur, tafaqquh, tabaṣṣur, iʿtibār…), metode penalaran (bukti/burhān, qiyās, sebab-akibat, anti-taklid — Urology Annals), rezim belajar (talaqqī→taṣḥīḥ→tasmīʿ→murājaʿah; 16:125). Sintesis → **QCA (Qur'anic Cognitive Architecture)**: peta istilah→komponen agen (grounding=dhikr, epistemik=zhann→yaqīn=Eval-Gate, alignment=mīzān, dst).
**Action (MVP):**
- Eval-Gate: tier baru **"interpretation"** (🧪 biru, ORDER=0 terbawah) + kind "lab" → SELALU berlabel "Interpretasi — bukan tafsir" + disclaimer keras.
- `lib/lab.ts` (skema lab-study-v1, loader, sanitasi id) — **teks ayat TIDAK pernah disalin ke Lab**: hanya ref (surah:from-to); render tarik dari mushaf kanonik ber-Merkle (immutability!). Ref invalid → notFound (fail-closed).
- Data: `public/data/lab/` — taxonomy.json (9 lensa + 12 istilah kognitif + provenance riset; ayat=source_claimed) + index.json + **3 kajian perdana**: iqra-96-1-5 (READ→ENCODE→LEARN), mizan-55-5-9 (ḥusbān/mīzān = komputasi+alignment), kun-36-82 (instansiasi deklaratif). Tiap kajian: makna BERSUMBER (tafsir Kemenag/Jalalain) + 9 lensa (amal/komputasional/logika/algoritma/inferensi/mat-fis/sistem/AI-agentic/artefak) + pemetaan QCA + inferensi.
- Halaman `/lab` (guardrail paling atas + daftar kajian + tabel QCA + taksonomi istilah) + `/lab/[id]` (Lapis-1 ayat kanonik+hash+makna bersumber+toggle transliterasi; Lapis-2 matriks lensa **interaktif filterable**; badge 🧪 + refId `lab:<id>` → bisa ditinjau reviewer di antrean yang sama). Nav 🧪 Lab (i18n id/en/ar).
- **Tumbuh terus:** kajian baru = 1 JSON + 1 entri index (skema terdokumentasi di lib/lab.ts).
**Test:** rujukan 3 kajian diverifikasi vs mushaf (5/5, 5/5, 1/1 ✓); TSC clean; preview: guardrail+QCA+taksonomi render, filter lensa menyaring benar, transliterasi toggle, badge 🧪, 0 error konsol.
**Next (per owner):** sintesis SEMUA ayat → script/metode/temuan/inferensi/tools (utamanya komputasional, AI brain, agentic) → lalu turunan ilmu non-teknis. Arsitektur data Lab sudah siap menampungnya (drop-in JSON per kajian; kelak digenerate pipeline).
**Status:** ✅ MVP selesai + deploy.

---

### [CHECKPOINT] Berhenti di sini → mulai Poin 4 (Lab/Playground interpretasi) — 2026-07-07

**Status Fase 1:** SOLID & LIVE. Selesai s/d F1.29. Yang sudah jalan di quran.migancore.com:
mushaf terverifikasi (Merkle) · reader cursor-mode · audio · word-by-word · notebook · auth/RBAC ·
i18n · hadits/belajar/doa/kitab/kisah · tafsir Kemenag+Jalalain (+translit+arti mesin) · asbabun nuzul ·
**Eval-Gate/Lapisan Kepercayaan** (status ala isnad + provenance + korroborasi/muttafaq) · **Antrean Tinjau** (moderasi RBAC).
**Permintaan owner (belok ke Poin 4 dari visi awal):** interpretasi Al-Qur'an SEBAGAI teknologi — berdasar
metode/pedoman berpikir yang DIAJARKAN Al-Qur'an sendiri (tafakkur/tadabbur/ta'aqqul/dll). BUKAN menguji
kebenaran Qur'an (owner muslim, tak meragukan); BUKAN tafsir baru. Demonstrasi multi-dimensi pada 1-3 ayat →
lalu rancang "Lab/Playground". Referensi: 5 PDF lokal + ~6 URL (thinking terminologies, critical thinking, memorization).
**GUARDRAIL WAJIB (Hukum Besi #3 & non-goal):** netral teologis; makna religius tetap BERSUMBER (eval-gate);
lapisan komputasional = "interpretasi rekayasa / eksperimen berpikir", DITANDAI jelas BUKAN tafsir/wahyu.
**Next:** riset referensi → demonstrasi → desain Lab (nama, arsitektur, cara nyambung ke eval-gate).

---

### [F1.29] Antrean Tinjau (moderasi RBAC) + korroborasi otomatis + badge Kisah — 2026-07-06

**North Star check:** ya — melengkapi Eval-Gate: dari "menilai otomatis + jujur" → "manusia (reviewer/admin) bisa mengesahkan". Ini pintu menuju kontributor (yang owner taruh paling akhir). "gas semua, hati-hati": deploy bertahap, app lain dijaga, RBAC & fail-closed.
**FASE A (deploy #1):**
- Korroborasi otomatis: `deriveCorroboration()` parse nama koleksi dari teks grade → `corroboration_count` + **muttafaq 'alaih** (Bukhari+Muslim) chip. Terdeteksi 11 hadits muttafaq.
- Badge kepercayaan diperluas ke **Kisah** (asStatic di card, panel di slider).
**FASE B (deploy #2):**
- Store: tipe `ContentReview` + `listReviews`/`upsertReview` di PgStore (tabel `content_review` IF NOT EXISTS, PK ref) & FileStore (dev). Terisolasi, tak sentuh app_user/user_note.
- API `POST /api/v1/reviews` (RBAC reviewer/admin via `getSessionUser`, validasi decision/tier) + `GET` (baca publik → badge tampilkan status tervalidasi).
- Engine `applyReview()`: validated→override tier + step 8 "Tinjauan ahli"; rejected→maudhu; needs_work→ditandai. Selalu transparan (👤 Ditinjau: nama).
- Klien: `lib/reviews.tsx` (ReviewProvider fetch sekali) + `TrustBadge refId` → override otomatis. Wire refId di hadits/tafsir/doa/kisah.
- Halaman **/tinjau** (server-gated reviewer/admin) + `ReviewQueue` (filter perlu-tinjau/sudah/semua, form Sahkan/Perlu-perbaikan/Tolak + override + catatan). Link nav "⚖️ Tinjau" hanya utk reviewer/admin.
- **Fix konsistensi:** hadits tanpa grade = "unreviewed" (bukan "sourced") — grade itu inti hadits; sejalan dgn dashboard. Antrean: **312 perlu tinjau**.
**Test:** engine muttafaq (11), TSC clean berulang. Preview end-to-end sbg admin: /tinjau 312 todo; POST validated→sahih; badge hadits nawawi#1 override → ✅Sahih + "👤 Ditinjau: Fahmi Ghani" + step "Tinjauan ahli: disahkan" + catatan. 0 error konsol. `.data/` gitignored (tak bocor).
**Provenance/aman:** reviewer decision tersimpan + reviewer name transparan ke pembaca; khilaf → "Perlu perbaikan", tak dipaksakan. App lain (ixonomic/miganpro/emiga) 301 tiap deploy.
**Status:** ✅ selesai. Lanjutan alami: kontributor (usul konten → antrean sama), matn cross-check otomatis, ekspansi data hadits penuh.

---

### [F1.28] Eval-Gate jadi NYATA: "Lapisan Kepercayaan" (status + provenance seragam) — 2026-07-06

**North Star check:** ya — ini prinsip paling ditekankan owner ("jadikan cara Islam memvalidasi kebenaran sebagai eval gate", "tak boleh kontaminasi/kontradiksi"). Mengubah metodologi 12_ISLAMIC_VALIDATION.md dari DOKUMEN → KODE yang menggerbang konten. Fondasi wajib sebelum kontributor.
**Action:**
- `lib/evalgate.ts` — ENGINE. `canonicalGrade()` normalkan string grade heterogen ("Hasan Sahih"→sahih, "Shadh/Munkar"→daif, dst). `aggregate()` multi-ulama: melintasi garis terima/tolak → **"disputed" (khilaf)**, selain itu ambil terendah (konservatif). `assess()` → TrustAssessment {tier, label, warna, ikon, machine, scholars, **7 langkah gate**, provenance, disclaimer}. Fail-closed: langkah tak-bisa-otomatis = "na" (TAK dianggap lulus). Teks Qur'an → mutawatir (jalur mushaf, bukan sanad hadits).
- `components/TrustBadge.tsx` (badge pill, klik→panel; mode `asStatic` utk hindari button bersarang) + `components/ProvenancePanel.tsx` (7 langkah + penilaian ulama apa adanya + provenance + "bukan fatwa").
- Wire seragam: **HadithReader** (badge ganti pill mentah), **IdentityPanel/tafsir** (badge + overlay 🌐 mesin), **DoaBrowser** (card `asStatic` + slider penuh).
- `pipeline/gen-trust-stats.mjs` → `public/data/trust.json`; **halaman Integritas** dapat section "Lapisan Kepercayaan Konten": bar distribusi tier hadits + ringkasan tafsir/doa.
**Test:** engine diuji data nyata — distribusi hadits **34 sahih / 21 hasan / 8 da'if / 17 khilaf / 282 perlu-tinjau** (jujur 78% belum bergrade). Preview: bar distribusi warna benar; 80 badge hadits (✅Hasan/🔀Khilaf/⚠️Da'if, 🌐 overlay); panel 7-langkah lengkap; doa Qur'ani→🔒Mutawatir. Fix hydration button-in-button (asStatic). TSC clean.
**Provenance:** grade dari string rujukan sumber (fawazahmed0/hadith-api dll); khilaf tak diputus sepihak; disclaimer "bukan fatwa" + "belum otomatis" transparan.
**Catatan pipeline:** logika grade DISALIN evalgate.ts↔gen-trust-stats.mjs (TS/mjs split) — ubah dua-duanya bila aturan berubah.
**Status:** ✅ selesai (kode). Deploy menyusul. Lanjutan: antrean tinjau (promosi mesin→tervalidasi via RBAC reviewer), matn cross-check otomatis, korroborasi antar-koleksi.

---

### [F1.27] Tafsir Arab bisa dibaca: transliterasi Latin + arti (mesin) — 2026-07-06

**North Star check:** ya. App untuk BELAJAR agama & baca Qur'an; anggap user belum bisa baca Arab. Tafsir Arab (Jalalain/al-Muyassar) yang "plek-plekan" Arab tak berguna bagi pemula. Netralitas & immutability tetap: teks Arab TIDAK disentuh; transliterasi = turunan hitung di klien; terjemahan = mesin, DITANDAI belum ditinjau ahli (eval-gate: status MT = belum tervalidasi).
**Action:**
- `apps/web/lib/translit.ts` — transliterator Arab→Latin (client, konvensi Indonesia: ts/kh/dz/sy/sh/dh/th/zh/'/gh/q, vokal panjang aa/ii/uu, syaddah=konsonan ganda). Berbasis-klaster: kumpulkan semua tanda (harakat+syaddah+dagger-alif) setelah tiap huruf apa pun urutannya → gemination benar. Ditandai jelas "bantuan baca otomatis, BUKAN baku".
- `components/IdentityPanel.tsx` — tab Tafsir: utk edisi `lang==="ar"` kini tampil **Arab → Cara baca (transliterasi) → Arti (Indonesia)**. Arti dari `texts[key+"_id"]` (mesin, label "🌐 terjemahan mesin — belum ditinjau ahli"); bila belum ada → placeholder + arahkan ke Tafsir Kemenag (id) di atas.
- `pipeline/auto-translate-tafsir.mjs` — MT AR→ID utk edisi Arab, simpan `${edisi}_id` per ayat. Resumable, per-surah write-back, Google gtx→MyMemory. Jalan di background utk 114 surah (~6010 entri Jalalain).
**Test:** transliterator diuji di Al-Fatihah → "alhamdu lillahi rabbi al'aalamiina", "maaliki yawmi alddiini", "'iyyaka na'budu wa'iyyaka nasta'iinu" (gemination & madd benar; dagger-alif tak bocor). TSC clean. Preview: tab Tafsir Jalalain render Arab + "CARA BACA · TRANSLITERASI OTOMATIS" (suurah alfatihah…) + Arti Indonesia (mesin). ✓
**Deploy:** 2 tahap — (1) KODE (translit client, jalan di SEMUA surah seketika) push+deploy dulu; (2) DATA `_id` (arti) commit+redeploy setelah job MT selesai.
**Provenance:** transliterasi=turunan otomatis (bukan sumber); arti Jalalain/Muyassar=Google MT (belum ditinjau) di atas teks Jalaluddin al-Mahalli & as-Suyuti (domain publik) / al-Muyassar (KFGQPC).
**Status:** ✅ SELESAI & LIVE. KODE (translit) deploy dulu; job MT rampung → **6010 arti Jalalain (114 surah, 0 kosong)** commit+redeploy. Spot-check Ayat Kursi/Yasin/Al-Ikhlas/An-Nas OK. App lain tetap 301.
**Berikut (opsional):** peningkatan mutu — sun-letter assimilation di translit (alrr→ar-r), tinjau ahli utk naikkan arti dari "mesin" ke tervalidasi, al-Muyassar juga (belum ada teksnya di data), transliterasi utk konten Arab lain (hadits/doa).

---

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
