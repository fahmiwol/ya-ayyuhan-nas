# 22_ILMU_HADIS_ASBAB_ARCH — Ilmu Hadis & Asbabun Nuzul sebagai Arsitektur

> Dicatat 2026-07-07 dari `PETA_ILMU_HADIS.pdf` (owner — peta konsep, berupa gambar) + 2 rujukan
> asbabun nuzul. Melengkapi `20_TAFSIR_METHODS.md`. **Semua klasifikasi di bawah = struktur baku
> Ulumul Hadis; angka/atribusi spesifik WAJIB verifikasi ke sumber primer sebelum jadi data app.**
> Ini sudah SEBAGIAN terbangun: Eval-Gate (`lib/evalgate.ts`) + tab Riwayat/asbab.json.

---

## A. Peta Ilmu Hadis (mustalah) — struktur

**Ilmu Hadis = Riwayah (transmisi teks) + Dirayah/Mustalah (kaidah menilai).**

1. **Unsur hadis:** `Sanad` (rantai perawi) · `Matn` (isi) · `Rawi` (periwayat) · `Mukharrij` (yang membukukan).
2. **Berdasar jumlah jalur:**
   - **Mutawatir** (banyak jalur mustahil sepakat dusta) → lafzi / ma'nawi. *Qath'i.*
   - **Ahad** → **Masyhur** (≥3 jalur) · **Aziz** (2) · **Gharib** (1).
3. **Berdasar diterima/ditolak (inti):**
   - **Maqbul** (diterima): **Sahih li-dzatihi** → **Sahih li-ghairihi**; **Hasan li-dzatihi** → **Hasan li-ghairihi**. Lalu ma'mul bih / ghairu ma'mul bih (mis. nasikh-mansukh, muhkam-mukhtalif).
   - **Mardud** (ditolak): **Da'if** karena —
     - *gugur sanad:* Mu'allaq, Mursal, Mu'dal, Munqati', Mudallas.
     - *cacat perawi:* Maudhu' (palsu), Matruk, Munkar, Mu'allal, Mudraj, Maqlub, Mudhtharib, Syadz.
4. **Kritik perawi:** **Jarh wa Ta'dil** (menilai cacat/kredibilitas rawi) — dasar penilaian sanad.
5. **Berdasar sumber ucapan:** **Qudsi** (makna dari Allah, lafaz Nabi) · **Marfu'** (kpd Nabi) · **Mauquf** (kpd sahabat) · **Maqtu'** (kpd tabi'in).
6. **Inkar Sunnah** (menolak hadis) = golongan + argumen + bantahan → ditangani sebagai *metadata pandangan*, tidak dihakimi.

---

## B. Ilmu Hadis → ARSITEKTUR Eval-Gate (pemetaan)

Ilmu Hadis adalah **spesifikasi asli** dari "Lapisan Kepercayaan" app (yang sudah dibangun):

| Ilmu Hadis | Komponen app | Padanan rekayasa |
|---|---|---|
| Sanad (rantai perawi) | provenance chain / isnad | **auditable supply chain** tiap klaim |
| Jarh wa ta'dil | reputasi sumber di Eval-Gate | **source reputation / trust score** |
| Mutawatir → Ahad | tier `mutawatir` (Qur'an) … | tingkat keyakinan by corroboration |
| Sahih/Hasan/Da'if/Maudhu' | `TrustTier` di `evalgate.ts` | **classification of evidence quality** |
| Ma'mul bih (boleh diamalkan) | keputusan tampil/pakai | **gating: verified → actionable** |
| Qudsi/Marfu'/Mauquf/Maqtu' | field atribusi sumber | **attribution level metadata** |

→ **Arsitektur klaim app:** setiap konten (hadis/tafsir/kisah/kajian Lab) melewati gerbang bertingkat persis mustalah: cek sanad/provenance → nilai perawi/sumber → klasifikasi kualitas → baru "boleh diamalkan/ditampilkan sebagai apa". Ini juga pola untuk **AI**: verify-before-act + tiered trust + auditable chain (bandingkan kajian Lab 49:6, 16:43, 96:1-5 talaqqī, 50:17 audit).

---

## C. Asbabun Nuzul → lapisan GROUNDING HISTORIS

Rujukan: [S2 IAT Walisongo — Asbabun Nuzul (2025)](https://s2iat.walisongo.ac.id/index.php/2025/08/05/asbab-al-nuzul-latar-historis-turunnya-ayat-al-quran/) · [Google Books (frontcover)](https://books.google.co.id/books?id=8RJku3YafpMC) · klasik: al-Wahidi *Asbab an-Nuzul*, as-Suyuti *al-Itqan* & *Lubab an-Nuqul*. (Fitur app: tab **Riwayat** + `asbab.json`.)

Kaidah inti (verifikasi ke sumber):
1. **Definisi:** peristiwa/pertanyaan yang melatari turunnya ayat.
2. **Kaidah cakupan:** *"al-'ibrah bi 'umum al-lafzh la bi khusus as-sabab"* (pelajaran diambil dari keumuman lafaz, bukan kekhususan sebab) — vs pendapat sebaliknya = **khilaf, tandai metadata**.
3. **Ragam:** ta'addud (banyak) riwayat sebab utk satu ayat; atau satu sebab utk banyak ayat.
4. **Fungsi:** memahami maksud, menghindari salah paham, tahu hikmah tasyri' bertahap.

**Prinsip arsitektur (untuk Lab & sistem):** *konteks historis sebelum generalisasi* — jangan menyimpulkan makna umum tanpa tahu sebab/konteks turunnya. Padanan AI: **context/provenance-before-inference; distribution shift awareness** (aturan yang benar di konteks A bisa keliru dipukul-rata ke konteks B). Ini memperkuat kajian rum-30-41 (atribusi kausal) & ankabut-29-20 (OOD).

---

## D. Integrasi ke metode & arsitektur (ringkas)

1. **Metode Lab** (lihat 20): grounding **bil-ma'tsur** kini eksplisit bertingkat mustalah — makna dari riwayat yang kualitasnya sadar-tier; asbabun nuzul jadi konteks sebelum inferensi.
2. **Eval-Gate** = implementasi mustalah; perluasan berikutnya (saat modul hadis/sahabat digarap): tier Ahad (masyhur/aziz/gharib) + label jenis da'if + field jarh-ta'dil per rawi.
3. **Guardrail baru untuk Lab:** kajian yang menyentuh ayat ber-asbabun-nuzul WAJIB cek konteksnya (tab Riwayat) agar pembacaan rekayasa tak melantur dari sebab/konteks. Masuk checklist skill.
4. **Sumber:** kitab mustalah klasik utk verifikasi = Ibn ash-Shalah *Muqaddimah*, an-Nawawi *at-Taqrib*, as-Suyuti *Tadrib ar-Rawi*, Mahmud ath-Thahhan *Taisir Mustalah al-Hadith*. (Audit lisensi turats saat ingest.)

**Status:** 📝 dicatat + jadi acuan arsitektur. Perluasan data (tier Ahad, jarh-ta'dil) menyusul saat modul hadis/sahabat dibangun.
