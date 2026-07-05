# 01 — PRD (Product Requirements Document)

**Produk:** MUSHAF — Digital Quran (AI-powered)
**Fokus dokumen ini:** Fase 1 (Mushaf Core) detail; Fase 2–4 ringkas (detail di roadmap).

---

## 1. Problem & Tujuan

**[KONSEP]** Aplikasi Quran digital banyak, tapi:
- Sumber teks sering tidak jelas provenance-nya / tidak bisa diverifikasi keasliannya.
- Terjemahan & tafsir sering single-source, tidak bisa dibandingkan.
- Tidak dirancang jadi **fondasi** yang bisa ditumbuhi (tools → olah → sintesis).

**Tujuan MUSHAF:**
1. **Autentik & terverifikasi** — teks bisa dibuktikan identik dengan mushaf standar, immutable by design.
2. **Multi-sumber** — terjemahan & (nanti) tafsir dari banyak sumber, side-by-side, ber-atribusi.
3. **Multi-bahasa** — Indonesia dulu, lalu Inggris, Arab, dan lainnya.
4. **Fondasi yang bisa tumbuh** — arsitektur data & RAG dirancang agar Fase 2–4 tinggal nambah layer, bukan rombak.

---

## 2. Target user

| Persona | Kebutuhan |
|---------|-----------|
| Pembaca harian | Baca, terjemahan, audio, bookmark, offline |
| Pembelajar | Word-by-word, transliterasi, (Fase 3) koreksi bacaan |
| Peneliti / builder | Data ber-atribusi, API/export, (Fase 4) knowledge graph |

Primary market: **Indonesia/SEA**. Secondary: English/Mandarin.

---

## 3. Scope Fase 1 — Fitur

### 3.1 [TEKNIS] Teks & tampilan
- [ ] Tampilkan 114 surah, 6236 ayat (Hafs/Uthmani).
- [ ] Teks Arab dengan font Uthmani proper (KFGQPC / mushaf font).
- [ ] Navigasi: per-surah, per-juz, per-halaman (mushaf madinah page mapping), per-ayat, lompat "Surah:Ayat".
- [ ] Word-by-word (kata Arab + transliterasi + arti kata) — dari Quranic Arabic Corpus.
- [ ] Metadata ayat: juz, hizb, ruku, halaman, sajdah, makki/madani.

### 3.2 [TEKNIS] Terjemahan multi-bahasa
- [ ] Minimal Fase 1: **Indonesia (Kemenag)** + **English (Sahih International)**.
- [ ] Arsitektur mendukung N bahasa & N versi per bahasa (bisa pilih/bandingkan).
- [ ] Transliterasi latin (untuk yang belum bisa baca Arab).
- [ ] Setiap terjemahan tampilkan atribusi sumber + lisensi.

### 3.3 [TEKNIS] Audio tilawah
- [ ] Audio per-ayat, multi-qari (minimal 2–3 qari).
- [ ] Play per-ayat, per-surah, continuous, repeat (untuk hafalan).
- [ ] **Ayat highlighting sinkron audio** (word-level timing kalau data tersedia; ayah-level minimum).
- [ ] Download audio untuk offline.

### 3.4 [TEKNIS] Verifikasi keaslian (fitur pembeda utama)
- [ ] Halaman "Integritas": tampilkan root hash mushaf + status verifikasi (✅ verified).
- [ ] Per-ayat: bisa lihat hash + daftar sumber yang cocok (cross-source verification).
- [ ] Boot-time integrity check (fail-closed kalau mismatch).

### 3.5 [TEKNIS] UX dasar
- [ ] Offline-first (PWA) — teks & terjemahan tersimpan lokal.
- [ ] Bookmark, last-read, catatan pribadi (data user terpisah dari teks kanonik).
- [ ] Dark/light, ukuran font Arab & terjemahan.
- [ ] Search: cari di terjemahan (Fase 1), cari di teks Arab (hybrid, Fase 1.5).

### 3.6 [TEKNIS] AI dasar (soft launch, grounded only)
- [ ] "Tanya ayat" — RAG sederhana: user tanya tema → sistem tarik ayat + terjemahan relevan **dengan sitasi**. **Tanpa** tafsir bebas (itu Fase 2).
- [ ] Guardrail: jawaban selalu menunjuk sumber; kalau tidak yakin → bilang tidak yakin. Lihat `05_RAG_DESIGN.md`.

---

## 4. Non-goals Fase 1

- ❌ Tafsir panjang multi-ulama (→ Fase 2).
- ❌ Asbabun nuzul, hadits, isnad (→ Fase 2).
- ❌ Koreksi bacaan/tajwid STT (→ Fase 3).
- ❌ Knowledge graph / reasoning engine (→ Fase 4).
- ❌ Membuat varian teks / "Quran versi baru" — **selamanya non-goal**.

---

## 5. Requirement non-fungsional

| Aspek | Target |
|-------|--------|
| Integritas | 100% ayat lolos Merkle verify sebelum rilis |
| Offline | Teks+terjemahan+metadata full offline; audio downloadable |
| Performa | First paint < 2s, navigasi ayat instan (data lokal) |
| Aksesibilitas | Font scalable, kontras cukup, screen-reader untuk terjemahan |
| Privasi | Data user (bookmark/catatan) lokal-first; kalau sync, self-hosted |
| Lisensi | Semua aset teraudit (lihat `04_DATA_SOURCES.md`) |

---

## 6. Metrik sukses (Fase 1)

- ✅ Root hash mushaf reproducible & match di 3+ sumber (untuk rasm/skeleton).
- ✅ ≥ 2 bahasa terjemahan + ≥ 2 qari audio.
- ✅ Offline mode lulus test (airplane mode).
- ✅ Semua data ada provenance.
- ✅ Zero mutasi teks kanonik (dibuktikan test).

---

## 7. Risiko & mitigasi

| Risiko | Mitigasi |
|--------|----------|
| Sumber beda encoding Unicode (mark waqf/sajdah beda) | Pilih 1 sumber ground-truth (KFGQPC/Tanzil Uthmani), NFC-normalize, sumber lain = spot-check rasm saja (lihat `04`) |
| Lisensi terjemahan/tafsir restriktif | Audit per-aset dulu; pakai yang CC-BY / public domain; simpan izin |
| Over-claim "otentik 100% identik semua sumber" | Jujur: yang identik = **rasm/skeleton**; encoding diakritik bisa beda antar-penerbit. Framing hati-hati di UI |
| Audio timing tidak tersedia semua qari | Ayah-level highlight sebagai fallback; word-level kalau ada |
| Halusinasi AI di domain suci | Grounded-RAG only + sitasi wajib + "tidak yakin" path |
