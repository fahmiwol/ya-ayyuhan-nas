# AGENTS.md — Konteks Proyek untuk AI Builder

> File ini dibaca **pertama** oleh Codex / AI coding agent. Isinya konteks, aturan main, dan guardrail yang WAJIB dipatuhi.

---

## 0. Mulai sesi (Standar Proyek Tiranyx v1)
- Baca `docs/09-log/HANDOFF.md` (lokal, tidak di-commit) → `docs/00-NORTH-STAR.md` → `docs/INDEX.md` → dokumen yang relevan.
- Rencana aktif: `docs/04-prd/PRD-001` (Lab hidup lagi + ritme harian), rute live `docs/07-keputusan/D-001` (disetujui Fahmi 13 Nov 2026; tiap langkah yang mengubah VPS-2 tetap dilaporkan), gerbang `docs/06-fungsi/FUNGSI-gerbang-tinjauan-kajian.md`.
- Kajian Lab: skill `.agents/skills/tadabbur-lab/SKILL.md`. Dokumen baru lewat `node C:/tiranyx-rnd/standar-proyek/buat.mjs tambah …`, lalu `indeks` + `cek`.

---

## 1. Apa yang dibangun

**MUSHAF** — aplikasi Al-Quran digital ber-AI. Dibangun **bertahap** (Fase 1 → 4). **Jangan lompat fase.** Fase 1 harus solid dulu.

**Fase 1 (fokus sekarang):** Digital mushaf yang **menyalin Al-Quran secara harfiah** — teks Arab (rasm Uthmani, riwayat Hafs), terjemahan multi-bahasa, audio tilawah, dengan **verifikasi keaslian** teknis.

---

## 2. HUKUM BESI (non-negotiable)

1. **TEKS QURAN IMMUTABLE.** Tidak ada satu pun jalur kode yang boleh `UPDATE`/`INSERT`/`ALTER` teks Arab kanonik setelah proses seeding+verifikasi. Storage teks kanonik = **read-only**. Kalau butuh koreksi, itu lewat proses *re-seed + re-verify + version bump* yang eksplisit, bukan mutasi runtime.
2. **Satu huruf pun tidak berubah.** Sebelum teks dianggap valid: hash SHA-256 per ayah → Merkle tree → root hash dicocokkan dengan nilai yang di-pin di config. Kalau mismatch → **app refuse to boot** (fail-closed), jangan silent.
3. **Netral teologis.** Jangan menulis komentar/keputusan yang memihak mazhab. Kalau ada perbedaan pandangan (mis. jumlah ayat per tradisi qira'at, status hadits), **tandai sebagai metadata**, jangan hardcode satu opini sebagai "kebenaran".
4. **Provenance wajib.** Setiap terjemahan/tafsir/hadits/audio HARUS punya field sumber + lisensi + versi. Tidak ada data "yatim" tanpa atribusi.
5. **Anti vendor-lock.** Utamakan MIT/Apache/CC-BY, self-hosted, offline-capable. Hindari ketergantungan runtime ke API komersial berbayar untuk **teks inti**. LLM/embedding = provider-agnostic (bisa di-swap).
6. **Audit lisensi sebelum pakai data.** Lihat `04_DATA_SOURCES.md`. Ada aset ND/NC/GPL yang berbahaya untuk komersial — jangan asal tarik.

---

## 3. Tech stack (SUDAH DIPUTUSKAN — jangan tanya ulang)

Detail & alasan di `02_ARCHITECTURE.md`. Ringkas:

- **App:** Next.js 15 (App Router) + TypeScript strict, PWA (offline-first).
- **Styling:** Tailwind CSS.
- **Teks Quran kanonik:** **SQLite bundled, read-only, checksummed** (`mushaf-core.db`). Ikut dikirim bareng app. TIDAK ada fetch teks inti dari API live saat runtime.
- **App DB:** PostgreSQL 15 (terjemahan, tafsir, hadits, user data, bookmark).
- **RAG/vector:** `pgvector` di Postgres yang sama (lean, self-hosted). Naik ke Qdrant hanya kalau scale menuntut.
- **Embeddings:** `BAAI/bge-m3` (multilingual: Arab+Indo+Inggris) via microservice Python/FastAPI atau Ollama.
- **STT/Tajwid (Fase 3):** Whisper fine-tuned (tarteel-ai) + Wav2Vec2 + Montreal Forced Aligner. Microservice Python terpisah.
- **Search:** Postgres FTS + pgvector (hybrid). Meilisearch opsional untuk search terjemahan super cepat.
- **Audio files:** per-ayah MP3 (EveryAyah) → self-host di Cloudflare R2.
- **Deploy:** Hetzner VPS + Coolify + Docker.

---

## 4. Mandatory loop (disiplin kerja)

Setiap unit kerja WAJIB:
```
action → catat (episodic) → test → iterasi → review → push → deploy → catat
```
Setiap sprint selesai → append ke `07_EPISODIC.md`. Commit message harus jelas **WHY**, bukan cuma WHAT.

---

## 5. Angka acuan (jangan salah)

- **Surah:** 114.
- **Ayat:** **6236** (hitungan Kufi/Hafs — dipakai King Fahd & Kemenag). *Catatan: jumlah ayat berbeda antar tradisi penghitungan (Basri, Syami, dll) karena beda cara menghitung basmalah & pemisah ayat — teks tetap sama, penomoran beda. Simpan `count_method` sebagai metadata.*
- **Kata:** ~77.430 (basis word-by-word).
- **Juz:** 30, **Hizb:** 60, **Ruku/Manzil/Sajdah:** simpan sebagai metadata ayat.
- **Riwayat default:** **Hafs 'an 'Asim**, **rasm Uthmani**. Qira'at lain = layer opsional (Fase 2+), bukan mengganti default.

---

## 6. Yang TIDAK dilakukan (non-goals Fase 1)

- ❌ Bikin varian/edisi teks Quran baru.
- ❌ Fitur AI yang "menafsir sendiri" tanpa grounding ke sumber ber-atribusi (halusinasi = dilarang keras di domain ini).
- ❌ Social feed, gamifikasi berat, monetisasi agresif — nanti.
- ❌ Klaim "mukjizat numerik" sebagai fitur inti.

---

## 7. Definisi selesai (Definition of Done) — Fase 1

Sebuah fitur Fase 1 "selesai" jika:
- [ ] Teks lolos verifikasi Merkle (root match).
- [ ] Semua data punya provenance (sumber+lisensi+versi).
- [ ] Ada test (unit/integration) yang lulus.
- [ ] Offline mode jalan (PWA).
- [ ] Ter-catat di `07_EPISODIC.md`.
- [ ] Lisensi aset sudah diaudit & aman untuk penggunaan yang dituju.
