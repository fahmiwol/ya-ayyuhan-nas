# MUSHAF — Digital Quran (AI-powered)

> **Codename:** `MUSHAF` (bisa diganti). Mushaf = salinan tertulis Al-Quran.
> Nama ini dipilih karena Phase 1 **secara harfiah adalah menyalin (duplikasi) Al-Quran** ke bentuk digital — bukan membuat jenis Quran baru.

**Owner:** Fahmi Ghani — PT Tiranyx Digitalis Nusantara
**Status:** Spec / Pre-build (siap dibawa ke Claude Code)
**Tanggal spec:** 2026-07

---

## ⛰️ North Star (jangan pernah di-re-pivot)

> Membangun **fondasi Al-Quran digital yang autentik & immutable**, lalu menumbuhkan lapisan ilmu di atasnya (tafsir → hadits → cara baca), dan akhirnya **mensintesis struktur Al-Quran menjadi kerangka penalaran komputasional / AI**.
>
> Metafora inti: *Quran static-but-generative* — dari **seed terbatas** (teks yang tidak berubah) tumbuh **output tak terbatas** tergantung lens (ruang, waktu, kondisi).

**Prinsip #1 — IMMUTABILITY:** Teks Al-Quran (rasm + tashkil) **tidak boleh berubah satu huruf pun**. Semua fitur AI dibangun *di sekeliling* teks, tidak pernah *mengubah* teks. Ini di-enforce secara teknis (checksum + Merkle tree + read-only), bukan cuma janji.

---

## 🗺️ 4 Fase (URUTAN LOCKED)

| Fase | Nama | Inti | Status |
|------|------|------|--------|
| **1** | **Mushaf Core** | Duplikasi harfiah Al-Quran digital + terjemahan multi-bahasa + audio + verifikasi keaslian | 🎯 BUILD DULU |
| **2** | **Ulum Layer** | Asbabun nuzul, kisah, perawi/isnad, riwayat, hadits pendukung, tafsir multi-sumber | Next |
| **3** | **Tilawah Coach** | STT tajwid — belajar baca, cek benar/salah, makhraj & hukum bacaan | After 2 |
| **4** | **Synthesis Engine** | Sintesis struktur Quran → knowledge graph → reasoning framework / AI brain (proyek riset baru) | Vision |

Detail lengkap ada di [`06_ROADMAP.md`](./06_ROADMAP.md).

---

## 📚 Isi Dokumentasi

| File | Isi | Untuk |
|------|-----|-------|
| [`CLAUDE.md`](./CLAUDE.md) | Konteks proyek + aturan main untuk AI builder | **Baca pertama di Claude Code** |
| [`01_PRD.md`](./01_PRD.md) | Product Requirements — apa yang dibangun, fitur, scope, non-goals | Product |
| [`02_ARCHITECTURE.md`](./02_ARCHITECTURE.md) | Tech stack (sudah diputuskan) + arsitektur sistem | Engineering |
| [`03_ERD.md`](./03_ERD.md) | Data model + ERD diagram + schema DDL | Database |
| [`04_DATA_SOURCES.md`](./04_DATA_SOURCES.md) | Sumber corpus tervalidasi + audit lisensi + strategi immutability | Data / Legal |
| [`05_RAG_DESIGN.md`](./05_RAG_DESIGN.md) | Arsitektur RAG untuk fitur AI (tumbuh dari Fase 1 → Fase 4) | AI |
| [`06_ROADMAP.md`](./06_ROADMAP.md) | Roadmap bertahap 1→4 + milestone + sprint | Planning |
| [`07_EPISODIC.md`](./07_EPISODIC.md) | Sistem episodic log / LIVING_LOG (disiplin dokumentasi) | Continuity |

---

## 🚀 Cara pakai di Claude Code

1. Copy folder ini ke root repo baru.
2. Di Claude Code, mulai dengan: *"Baca `CLAUDE.md` dan `01_PRD.md`, lalu scaffold Fase 1 sesuai `02_ARCHITECTURE.md`."*
3. Setiap sprint selesai → update [`07_EPISODIC.md`](./07_EPISODIC.md) (mandatory loop: action → catat → test → iterasi → review → push → deploy → catat).

---

## 🏷️ Penanda

Sepanjang dokumen dipakai penanda:
- **[TEKNIS]** = actionable engineering (bisa langsung dibangun)
- **[KONSEP]** = fondasi pemikiran / filosofis (arah, bukan kode)

---

## ⚠️ Catatan sikap (penting)

- Dokumen ini **netral secara teologis**. Menyajikan konsensus keilmuan dan menandai di mana pandangan berbeda (mis. Sunni/Syiah soal hadits).
- **Tidak** memakai klaim kontroversial (mis. "kode 19") sebagai fondasi teknis — ditandai sebagai *contested* bila muncul.
- Fase 4 ("Quran → AI brain") = **ekstraksi POLA penalaran** dari tradisi keilmuan (sanad, hifz, ijtihad, qiyas), **bukan** klaim bahwa AI = wahyu. Framing ini dijaga ketat biar nggak over-claim.
