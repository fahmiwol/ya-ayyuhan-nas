# 04 — Sumber Data, Audit Lisensi & Strategi Immutability

> Ini jantung "keaslian". Dua bagian: (A) **bukti keaslian teks** [KONSEP], (B) **sumber corpus konkret + lisensi** [TEKNIS], (C) **strategi immutability teknis** [TEKNIS].

---

## A. [KONSEP] Kenapa teks bisa dianggap autentik & "sama tiap barisnya"

Ini fondasi framing app kamu. Ringkas & netral:

1. **Rasm Uthmani (skeleton konsonan standar).** Pada era Khalifah Utsman, dibuat mushaf standar & disebar ke beberapa kota. Semua mushaf cetak modern arus utama mengikuti kerangka konsonan (rasm) yang sama.
2. **Riwayat/Qira'at.** Ada beberapa cara baca *mutawatir* (ditransmisikan massal). Yang paling luas dipakai (Indonesia, Timur Tengah mayoritas) = **Hafs 'an 'Asim**. Perbedaan antar-qira'at umumnya soal harakat/pelafalan minor, **bukan** mengubah kerangka teks. → **Default app = Hafs.**
3. **Tawatur (transmisi massal) + Hifz (hafalan).** Teks dijaga bukan hanya lewat tulisan tapi lewat **jutaan penghafal** lintas generasi — mekanisme redundansi yang, dari sudut *engineering*, mirip **replikasi + error-correction terdistribusi**.
4. **Bukti manuskrip.** Beberapa manuskrip sangat tua (mis. **Birmingham/Mingana folios**, **Sana'a/DAM 01-27.1**, **Topkapi**, **Samarkand/Tashkent codex**) — penanggalan radiokarbon menempatkan sebagian di abad-abad paling awal, dan teks intinya konsisten dengan mushaf standar. *(Catatan netral: interpretasi detail manuskrip masih jadi bahan kajian akademik; app cukup menyajikan fakta keberadaan & konsistensi rasm, tanpa klaim berlebihan.)*

**Framing UI yang jujur:** yang bisa diklaim kuat = **kerangka teks (rasm) identik** & terverifikasi lintas sumber. Yang **tidak** diklaim = "semua penerbit meng-encode setiap diakritik/tanda persis sama byte-nya" (itu beda konvensi, lihat bagian C).

---

## B. [TEKNIS] Sumber corpus — inventaris & audit lisensi

> ⚠️ **WAJIB audit ulang lisensi saat implementasi** — lisensi bisa berubah & tergantung penggunaan (komersial vs non-komersial). Tabel ini titik-awal, bukan nasihat hukum.

### B.1 Teks Arab (rasm Uthmani, Hafs)

| Sumber | Isi | Format | Lisensi (perlu re-cek) | Offline | Catatan |
|--------|-----|--------|------------------------|---------|---------|
| **Tanzil.net** | Uthmani, Simple, Clean; multi versi | XML/TXT/SQL | Non-commercial-ish; **baca terms** & minta izin bila perlu | ✅ download | Sangat rapi & jadi rujukan banyak app |
| **KFGQPC / King Fahd (QURANCOMPLEX)** | Teks resmi + **font Uthmani** | teks + font | Terms khusus (font & teks) — **baca lisensi** | ✅ | Ground-truth kuat untuk rasm |
| **Quran.com / Quran Foundation (QUL — Quran Universal Library)** | Teks, word-by-word, resources | API + export | Umumnya open/terbuka — cek per-resource | ✅ export | Ekosistem terlengkap |
| **AlQuran Cloud (alquran.cloud)** | Teks + banyak edisi + audio | REST API | Terbuka (cek) | via API | Enak buat prototyping cepat |
| **Kemenag RI (Quran Kemenag)** | Teks + terjemahan resmi Indonesia | API/data | Milik Kemenag — **izin untuk redistribusi** | tergantung | Standar Indonesia (penting untuk pasar ID) |
| **equran.id** | Teks + terjemahan + tafsir Indonesia | REST API | Terbuka (cek) | via API | Praktis untuk ID |
| **risan/quran-json (GitHub)** | Teks + terjemahan JSON | JSON | Open (cek repo) | ✅ | Enak untuk seed cepat |

**Rekomendasi ground-truth teks:** **KFGQPC atau Tanzil Uthmani** sebagai *canonical base*, lalu **cross-check** dengan Kemenag + Quran.com/QUL untuk rasm.

### B.2 Word-by-word & morfologi

| Sumber | Isi | Lisensi | Catatan |
|--------|-----|---------|---------|
| **Quranic Arabic Corpus (corpus.quran.com)** | Morfologi, sintaksis, POS, root, word-by-word | **GNU-ish / academic — cek** (ada batasan) | Standar de-facto untuk word-level. **Audit lisensi sebelum komersial.** |
| **QUL word-by-word** | Word translations multi-lang | Terbuka (cek) | Alternatif/pelengkap |

### B.3 Terjemahan (multi-bahasa)

| Terjemahan | Bahasa | Lisensi | Catatan |
|-----------|--------|---------|---------|
| **Kemenag** | ID | Milik Kemenag (izin) | Wajib untuk pasar ID |
| **Sahih International** | EN | Umumnya boleh redistribusi (cek) | Paling umum di app EN |
| **Tanzil translations set** | banyak | per-terjemahan beda | Beberapa CC, beberapa restricted |
| **fawazahmed0/quran-api** | 90+ terjemahan | Open-ish (cek) | Praktis multi-bahasa |

> ⚠️ **Jebakan umum:** beberapa terjemahan populer **berhak cipta & tidak boleh diredistribusi**. Utamakan public-domain / CC-BY, atau minta izin resmi.

### B.4 Audio tilawah

| Sumber | Isi | Catatan |
|--------|-----|---------|
| **EveryAyah.com** | MP3 per-ayat, banyak qari, beberapa dengan **word timing** | Standar de-facto; self-host ke R2 |
| **Quran.com / QUL audio** | Recitations + timing | Alternatif |
| **AlQuran Cloud audio** | Via API | Prototyping |

### B.5 (Fase 2) Tafsir, asbabun nuzul, hadits, rijal

| Sumber | Isi | Lisensi | Catatan |
|--------|-----|---------|---------|
| **spa5k/tafsir_api (GitHub)** | Multi tafsir (Ibn Kathir, Jalalayn, dll) | Open (cek) | Enak untuk multi-tafsir |
| **Tafsir Kemenag / equran.id** | Tafsir ID | izin/terbuka | Pasar ID |
| **Asbab al-Nuzul (al-Wahidi, al-Suyuti)** | Occasions of revelation | teks klasik (public domain) + terjemahan (cek) | Butuh digitalisasi/pemetaan ayat |
| **fawazahmed0/hadith-api** | Kutub al-Sittah + | Open (cek) | Multi-koleksi |
| **sunnah.com API** | 9 koleksi kanonik | Terms khusus — **baca** | Rujukan utama |
| **HadeethEnc** | Hadits + grading EN | cek | Bagus untuk grading |
| **Rijal / narrator data** | Biografi perawi, jarh wa ta'dil | jarang open — sering perlu digitalisasi | Untuk isnad graph (F2/F4) |

> **Catatan netral (Sunni/Syiah):** koleksi hadits kanonik berbeda antar mazhab. App menyimpan `source` + `grade` sebagai **metadata**, tidak menghakimi. Bisa filter per-tradisi.

---

## C. [TEKNIS] Strategi Immutability & Verifikasi (WAJIB)

### C.1 Masalah sebenarnya (jujur)

- **Rasm (kerangka konsonan) → identik** lintas sumber arus utama. ✅ bisa diverifikasi ketat.
- **Encoding Unicode diakritik/tanda** (waqf, sajdah, small alef, dll) → **bisa berbeda** antar penerbit (Tanzil vs KFGQPC vs Kemenag). Ini **bukan** perbedaan teks, tapi perbedaan konvensi encoding.

**Konsekuensi:** jangan janji "byte-identical semua sumber". Yang benar:
1. Pilih **satu ground-truth** (KFGQPC/Tanzil Uthmani).
2. **NFC-normalize** semua.
3. Verifikasi **rasm/skeleton** identik lintas sumber (strip tanda opsional → banding).
4. Hash & Merkle atas **ground-truth yang sudah dinormalisasi**.

### C.2 Pipeline verifikasi (langkah)

```
1. Ambil teks per-ayat dari ground-truth (KFGQPC/Tanzil).
2. Unicode NFC normalize.
3. Buat 2 varian:
   - text_uthmani     (lengkap, dgn tanda)
   - text_skeleton    (rasm saja: strip harakat/tanda waqf/sajdah)
4. Cross-source check:
   for each ayah:
     assert skeleton(KFGQPC) == skeleton(Tanzil) == skeleton(Kemenag)   # rasm identik
   -> catat sources_matched
5. Hash: leaf = SHA-256( NFC(text_uthmani) )   # 6236 leaves
6. Merkle tree -> ROOT HASH
7. Simpan ke mushaf-core.db (read-only) + PIN root hash di config app.
```

### C.3 Enforcement di app

```
- SQLite dibuka READ-ONLY (PRAGMA query_only=ON) + tidak ada kode mutasi tabel kanonik.
- Boot-time: hitung ulang Merkle root dari DB -> bandingkan dgn root yg di-pin.
    match  -> app lanjut.
    mismatch -> FAIL-CLOSED (app menolak tampil teks; log alert).
- Setiap ayah bisa tampilkan hash + sources_matched (fitur "Integritas").
- Update teks HANYA lewat: re-seed -> re-verify -> version bump -> rebuild -> review manual -> release baru.
```

### C.4 Kenapa ini keren (dan nyambung ke Fase 4)

**[KONSEP]** Strategi ini adalah versi teknis dari **sanad + hifz**:
- **Sanad** → *provenance chain* (sources_matched, atribusi).
- **Hifz** → *integrity/redundancy* (multi-sumber + checksum).
- **Merkle root** → *tawatur* dalam bentuk kriptografis (satu titik verifikasi untuk keseluruhan).

Jadi verifikasi Fase 1 bukan cuma fitur — dia **prototype konseptual** untuk reasoning framework Fase 4.

---

## D. Shortlist keputusan (biar Claude Code langsung gas)

| Kebutuhan | Pakai ini dulu |
|-----------|----------------|
| Teks Arab ground-truth | **KFGQPC** atau **Tanzil Uthmani** |
| Cross-check rasm | **Kemenag** + **Quran.com/QUL** |
| Word-by-word | **Quranic Arabic Corpus** (⚠️ audit lisensi) |
| Terjemahan ID | **Kemenag** |
| Terjemahan EN | **Sahih International** |
| Audio + timing | **EveryAyah** → self-host R2 |
| Prototyping cepat | **AlQuran Cloud** / **equran.id** |

**Aksi pertama pipeline:** tarik 1 surah kecil (mis. Al-Ikhlas / Al-Fatihah) dari 3 sumber → jalankan verifier → buktikan skeleton identik + hasilkan root hash mini. Itu "hello world" keaslian.
