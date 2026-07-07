---
name: tadabbur-lab
description: Metode lengkap memproduksi kajian Lab Tadabbur (interpretasi rekayasa ayat Al-Qur'an) untuk quran.migancore.com — dari pemilihan ayat, grounding tafsir, penulisan multi-lensa, validasi fail-closed, sampai sintesis prinsip & deploy. Pakai saat: menambah kajian baru, re-tadabbur (revisi), menambah lensa/prinsip/framework, atau menjalankan wave sintesis massal.
---

# Skill: Tadabbur Lab — Metode Interpretasi Rekayasa

Metode memproduksi kajian di Lab Tadabbur (`apps/web/public/data/lab/`). Interpretasi = analogi struktural rekayasa — **BUKAN tafsir, BUKAN dalil**. Tujuan: dasar pengembangan teknologi (utama: AI/ML/agentic), sekunder: sosial/keuangan/kedokteran/mesin.

## 🎯 Niat inti (North Star — `24_MISSION_PHILOSOPHY.md`)
Lab menyintesis **POLA/CARA PENCIPTAAN** (āyāt kauniyah / sunnatullah): bagaimana Allah merancang manusia dicipta-dikembangbiakkan-dilahirkan, akal untuk berpikir, siklus pagi-siang-sore, penyembuhan, pertumbuhan, kemandirian — lalu **interpretasi-rekayasa → artificial** (teknologi/sistem/AI). Yang dipelajari = **"bagaimana Ia mencipta" (pola pada ciptaan)**, BUKAN "siapa Diri-Nya". Peran = **khalifah/sub-creator** yang MENIRU pola ciptaan (bekerja di lapisan sebab), bukan mencipta dari ketiadaan & bukan menyekutukan. Tiap kajian berjangkar ke sini.

## ⛔ TANZIH — batas mutlak (paling utama)
**Allah (Dzat & Sifat-Nya) TIDAK PERNAH ditafsirkan, digambarkan, dibayangkan, didefinisikan, atau dianalogikan.** Allah adalah Dzat yang ghaib & transenden — bukan objek/komponen/peran dalam analogi rekayasa. DILARANG: mencasting Allah sebagai "Principal/agen/sistem", menyamakan Sifat Allah (mis. khabīr, qudrah, ilmu) dengan properti teknis ("observability", "compute", dll), atau menjadikan Asma'ul Husna sebagai "lensa/atribut sistem". Analogi HANYA boleh pada sisi **makhluk/manusia/teks/alam** (amal, sikap hati, struktur ibadah, pola ciptaan). Bila ayat menyebut Sifat Allah, sebut dengan ta'zhim sebagai LANDASAN iman — bukan sebagai bahan analogi. Setiap kajian yang menyentuh ini WAJIB beri "CATATAN TANZIH".

## Hukum Besi (tidak bisa ditawar)
1. **Teks ayat TIDAK PERNAH disalin** ke data Lab — hanya ref `{surah, from, to}`; render menarik dari mushaf kanonik ber-Merkle. Ref invalid → fail-closed.
2. **Makna religius SELALU dari tafsir bersumber** (Kemenag/Jalalain di data app) — field `sourced_meaning` wajib. Ini disiplin **bil-ma'tsur**: ground ke riwayat DULU sebelum menalar.
3. **Tier "interpretation"** — semua output berlabel "🧪 Interpretasi — bukan tafsir".
4. **Netral teologis** — khilaf ditandai metadata; klaim sains ditulis "resonansi struktural, BUKAN mukjizat numerik" (non-goal #4 CLAUDE.md).
5. **Setiap interpretasi DIREKAM** — revisi lewat version bump + arsip (jangan menimpa).
6. **Gerbang wajib pra-commit:** `node pipeline/lab-validate.mjs` harus exit 0.

## Metode formal (kerangka Ulumul Qur'an — lihat `20_TAFSIR_METHODS.md`)
Lab = **maudhu'i** (pilih tema dari backlog) + **tahlili** (bedah per-lensa) + **muqaran** (sintesis prinsip lintas-ayat) + **ijmali** (inferensi ringkas). Grounding **bil-ma'tsur** (sourced_meaning), penalaran **bir-ra'y mahmud** (berbasis ilmu, bukan hawa), disajikan sebagai **isyari-rekayasa**.
### Rambu isyari (WAJIB tiap kajian — jadi checklist mutu):
1. Pembacaan rekayasa **tak menyalahi makna zahir** / makna bersumber — ia lapisan di ATAS, bukan pengganti.
2. Idealnya ada **sandaran** (ayat lain / istilah Qur'ani / prinsip); analogi lemah ditandai `bounded`.
3. **Bukan klaim maksud tunggal** ayat — eksplisit "salah satu pembacaan", bukan maksud Ilahi.
4. **Tak menyimpulkan hukum**, tak menghina, netral.
5. **Batas tafsir ilmiah:** sains = analogi pemahaman, BUKAN bukti kebenaran teks → wajib frasa "resonansi struktural, bukan mukjizat numerik".
6. **Cek konteks (asbabun nuzul):** bila ayat punya asbabun nuzul (tab Riwayat / `asbab.json`), pahami konteksnya dulu — pembacaan rekayasa tak boleh melantur dari sebab/konteks turunnya (grounding historis; lihat `22_ILMU_HADIS_ASBAB_ARCH.md`).
> Riset pendukung lengkap: `21_TAFSIR_METHODS_RESEARCH.md` (rambu isyari 6-syarat + hierarki grounding + batas tafsir ilmiah), `22_ILMU_HADIS_ASBAB_ARCH.md` (mustalah → Eval-Gate). RENCANA: validator fail-closed "Kartu Rambu Isyari" + metadata tipologi per kajian (metode/corak/tingkat_grounding/kontroversi) — belum dikodekan.

## Alur produksi kajian baru
1. **Pilih ayat** dari backlog `15_TADABBUR_BACKLOG.md` (hasil sweep 6236 ayat; regenerate = rerun sweep di episodic F1.33). Kandidat = sinyal awal, bukan keputusan.
2. **Ground dulu** — WAJIB sebelum menulis:
   ```bash
   node -e "const fs=require('fs');const s=SURAH,a=AYAH;const su=JSON.parse(fs.readFileSync('./apps/web/public/data/surah/'+s+'.json','utf8'));const tf=JSON.parse(fs.readFileSync('./apps/web/public/data/tafsir/'+s+'.json','utf8'));console.log(su.ayahs.find(x=>x.ayah===a)?.tr?.id);console.log(tf.ayahs[String(a)]?.kemenag?.slice(0,400));"
   ```
3. **Scaffold** (opsional, utk kerangka): `node pipeline/lab-scaffold.mjs <id> <surah> <from> <to> "<judul>"` — id format `<namasurah>-<s>-<f>-<t>` kebab-case.
4. **Tulis kajian** (skema `lab-study-v2`, lihat `lib/lab.ts`): `sourced_meaning` (ringkas dari tafsir + sources), `qca[]` (peta ke Qur'anic Cognitive Architecture), `lenses[]` (pilih lensa RELEVAN dari `taxonomy.json` — tak wajib semua; tiap reading ≥30 char, sertakan `analogy` teknis & `quranic_term`), `inference` (temuan utama), `history[]` v1.
   - **Mutu:** tulis LANGSUNG (bukan delegasi agent) demi konsistensi suara; lensa ai-agentic harus actionable utk desain sistem; hindari klaim berlebihan — tandai analogi yang dibatasi ("bounded").
   - **MAKSIMALKAN DIMENSI (arahan owner):** sintesis sebanyak mungkin sudut pandang/analogi/logika/metode yang RELEVAN & bernas — lintas disiplin (teknis & non-teknis, teori & praktik). Bukan target 9 lensa kaku; tambah lensa/analogi bila membuka wawasan baru (teknologi/kedokteran/pendidikan/fisika/mat/astronomi). TETAP di bawah rambu isyari (bukan maksud tunggal; sains=analogi bukan bukti).
   - **BAHASA (pelunakan — hindari terkesan mengklaim):** framing "hipotesis/analogi/diinspirasi pola pembacaan ayat", BUKAN "diturunkan dari ayat / temuan / Qur'an mendesain X". Lihat `23_STRATEGY_DOMAINS_FEEDBACK.md`.
5. **Index**: tambah entri di `index.json` (field `lenses` = jumlah lensa aktual file).
6. **Validasi**: `node pipeline/lab-validate.mjs` → 0 pelanggaran.
7. **Preview** (`preview_start` mushaf-web) → cek halaman kajian render (ayat+badge+riwayat), lalu stop.
8. **Deploy**: commit (pesan WHY) → push → ssh `sidix-vps` → `/opt/yaayyuhannas` pull --ff-only → `docker compose up -d --build web` → curl kajian 200 + app lain (ixonomic/miganpro) tetap 301.
9. **Catat**: `07_EPISODIC.md` (nomor F1.x berikutnya) + update `15_TADABBUR_BACKLOG.md` ([x]) + memory `lab-tadabbur.md`.

## Re-tadabbur (revisi kajian)
`node pipeline/lab-rev.mjs <id> "<catatan>"` → arsipkan versi lama → edit isi → validate → deploy. Versi lama tetap terbaca via `/lab/<id>?v=N`.

## Sintesis prinsip (Mesin Temuan — `/lab/sintesis`)
- Prinsip = POLA yang berulang di **≥2 kajian** (evidence.id wajib = id kajian nyata). Baru 1 bukti → boleh masuk dengan `note_single` + kandidat penguatan, lalu prioritaskan wave penguat.
- Edit `synthesis.json`: `principles[]` (statement + evidence + implication rekayasa) & `blueprint.layers` (8 lapis arsitektur agen). Validasi ikut lab-validate.
- Cari pola: baca ulang `inference` semua kajian; pola lintas-surah yang muncul independen = sinyal struktural.

## Generator prinsip (semi-otomatis)
`node pipeline/lab-mine.mjs` → baca semua kajian, ekstrak konsep rekayasa berulang (≥2 kajian) & istilah baru → tulis `18_MINED_PATTERNS.md`. Ini USULAN, bukan keputusan: peninjau memilih pola yang layak jadi prinsip (≥2 evidence) lalu tulis ke synthesis.json. Jalankan tiap kali korpus kajian bertambah signifikan.

## Jalur tinjauan ahli (naik status)
Kajian default "🕵️ menunggu tinjauan". Peninjau BERKELAS NYATA (ulama/mufassir/sejarawan/hafizh/akademisi) yang benar-benar meninjau menstempel via:
`node pipeline/lab-review.mjs <id> <endorsed|revise|rejected> "<by>" "<role>" "<catatan>" ["<credential>"]`
→ field `review` terisi (atribusi wajib), `endorsed` menaikkan status→published, tampil badge di UI. **JANGAN mengesahkan tanpa tinjauan nyata** (atribusi palsu = kontaminasi, langgar eval-gate & netralitas). AI hanya boleh menandai `pending`.

## Menambah lensa / framework
- Lensa baru → `taxonomy.json.lenses` (key kebab, icon, desc). Kajian lama tak perlu diubah.
- Framework (struktur besar spt Pohon Din, Aql-Qalb) → `synthesis.json.frameworks` (basis wajib beratribusi; hadits → rujuk data hadits app / sumber, bukan tanpa sanad).

## Konteks & dokumen rujukan
- Riset metode: `14_TADABBUR_LAB_RESEARCH.md` (QCA, istilah kognitif), `16_IMAN_ISLAM_IHSAN_RESEARCH.md`, `17_AQL_QALB_EPISTEMOLOGY.md`.
- Eval-Gate/validasi: `12_ISLAMIC_VALIDATION.md`; sumber global: `13_GLOBAL_SOURCES.md`.
- Server bersama — JANGAN ganggu app lain; detail deploy: `deploy/README.md` (nginx aaPanel: proxy_cache off utk vhost quran).
