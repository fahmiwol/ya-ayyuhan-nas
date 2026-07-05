# 10 — Kontribusi Ter-moderasi & Admin (Close Development)

> Owner (2026-07-06): aplikasi **close-development**. Kontributor boleh menambah (tafsir baru,
> hikayat/kisah, terjemah, catatan) **TAPI wajib lewat halaman admin untuk dimoderasi**.
> Karena Al-Qur'an **tak terbatas** (1 kata/ayat bisa jutaan makna), konten keilmuan tumbuh terus —
> maka otentisitas dijaga lewat **moderasi berlapis** (padanan digital *jarh wa ta'dil* / sanad).

---

## 1. Prinsip garis keras

1. **Teks kanonik TIDAK bisa dikontribusi.** Zona kanonik (surah/ayah/word/hash/merkle) tetap
   **immutable & read-only** (Hukum Besi #1). Kontribusi HANYA di **zona keilmuan** (tafsir, asbab,
   hikayat, terjemah, catatan leksikal, sanad, dll).
2. **Tidak ada publish langsung.** Semua kontribusi masuk **antrian moderasi** → baru tampil publik.
3. **Provenance wajib.** Tiap kontribusi punya `source` + `license` + `author` + (opsional) `isnad/sanad`
   + `grade`. Tidak ada konten yatim.
4. **Netral teologis.** Perbedaan pandangan/mazhab = **metadata**, bukan penghakiman. Bisa difilter.
5. **Versioned & append-only.** Edit = versi baru; riwayat tak dihapus (audit trail).
6. **Auditable.** Tiap konten ter-approve tertaut ke **identitas ayat** (hash) + punya identitasnya
   sendiri (hash konten + author + timestamp) → arsip terverifikasi (nyambung ke F1 mint/identitas).

---

## 2. "Tak terbatas tapi terjaga" — model konten

- 1 ayat / 1 kata → **banyak** (0..N tak terbatas) tafsir, asbab, hikayat, terjemah — berlapis,
  multi-bahasa, multi-sumber (lihat `09`).
- Setiap item = **kontribusi** yang harus **lolos moderasi**. Ini menjaga keistimewaan Al-Qur'an:
  tumbuh kaya makna **tanpa** kehilangan otentisitas/atribusi (analog fungsi sanad menjaga dari pemalsuan).

---

## 3. Peran (RBAC)

| Peran | Hak |
|-------|-----|
| **Reader** (publik) | baca konten yang sudah *published* |
| **Contributor** | ajukan kontribusi (draft→submit); lihat status miliknya |
| **Reviewer/Moderator** (berilmu, ber-kredensial) | tinjau, minta revisi, approve/reject + alasan |
| **Admin** | kelola peran, sumber, kebijakan; override; kelola antrian |
| **Scholar-verifier** (opsional, Fase lanjut) | tanda-tangan sanad/ijazah untuk konten sensitif |

Auth: email/OAuth; kredensial reviewer dicatat (siapa, sanad/afiliasi) → transparansi.

---

## 4. Alur & status (state machine)

```
draft ──submit──▶ submitted ──assign──▶ in_review
   ▲                                   │
   │            needs_changes ◀────────┤ (reviewer minta revisi)
   └──── (author revisi) ──────────────┘
                                        ├──approve──▶ approved ──publish──▶ published (v1)
                                        └──reject───▶ rejected (dgn alasan, terarsip)
published ──edit──▶ (draft versi baru) ... ──▶ published (v2)   // versioned, v1 tetap tersimpan
published ──takedown──▶ archived (audit)
```
- **Multi-reviewer opsional** (padanan *ijma*): butuh ≥N approve untuk konten sensitif.
- Semua transisi ter-**log** (siapa, kapan, alasan).

---

## 5. Model data (zona keilmuan — Postgres, versioned)

Perluas skema anotasi (`data/annotations.json` → tabel Postgres saat produksi):

```sql
-- KONTRIBUSI (tafsir/asbab/hikayat/terjemah/catatan/sanad)
contribution(
  id, type,               -- tafsir|asbab|hikayat|translation|lexical|note|sanad|qiraat
  target_surah, target_ayah, target_word,   -- se-ayat / se-kata (word nullable)
  lang, title, body,
  source_name, source_author, source_url, license,
  isnad JSONB, grade,     -- sanad digital + derajat (opsional)
  tradition,              -- metadata mazhab/aliran (netral, bukan hakim)
  status,                 -- draft|submitted|in_review|needs_changes|approved|published|rejected|archived
  author_id, reviewer_id,
  version, supersedes_id, -- versioning (append-only)
  content_hash,           -- SHA-256(body+meta) = identitas kontribusi
  ayah_identity_hash,     -- tautan ke hash ayat kanonik (F1)
  created_at, updated_at, published_at
)
moderation_log(id, contribution_id, actor_id, action, reason, at)  -- audit trail
user_role(user_id, role, credential JSONB)                          -- RBAC + kredensial reviewer
```

- **Draft** disimpan tapi **tak** tampil publik. Query publik = `status='published'` saja.
- `content_hash` + `ayah_identity_hash` → tiap kontribusi ter-approve = **arsip ber-identitas**
  (bisa di-mint / dibuktikan, seperti ayat).

---

## 6. Sanad untuk kontribusi (bukan cuma ayat)

Tiap tafsir/hikayat bawa **rantai sumber**: `kitab → penulis → penerjemah → pengunggah`, plus
`grade` + `isnad`. Ini "**sanad digital**" konten keilmuan — moderasi = padanan *jarh wa ta'dil*
(menilai kontinuitas + kredibilitas sumber). Reviewer ber-kredensial menandatangani (attestation).

---

## 7. Halaman Admin / Moderasi (desain)

- **Antrian moderasi**: filter status/type/lang/target; prioritas.
- **Panel tinjau**: konten + **diff versi** + provenance + isnad; tombol **Approve / Needs-changes / Reject** (wajib alasan); assign reviewer.
- **Kelola sumber & lisensi**, **kelola peran**, **log audit** (semua aksi tercatat).
- **Dashboard**: jumlah pending, laju, kontributor teratas, cakupan (ayat ter-tafsir per bahasa).
- Akses: hanya reviewer/admin (RBAC), rute terlindungi.

---

## 8. Anti-abuse & netralitas

- Provenance **wajib**; tanpa sumber → tak bisa submit.
- **Multi-reviewer** (ijma) untuk konten sensitif; rate-limit; no anonymous publish.
- Perbedaan mazhab = **metadata `tradition`** + filter, bukan hakim.
- Deteksi duplikat/plagiarisme; cek lisensi (tolak sumber ND/berhak-cipta tanpa izin).
- Fitur AI (mis. saran ringkas) = **draft untuk reviewer manusia**, bukan auto-publish (anti-halusinasi domain suci).

---

## 9. Integrasi dengan yang sudah ada

- Extends **lapisan anotasi** F1.3 (`data/annotations.json` + API `/api/v1/annotations/...`) →
  tambah `status`, hanya `published` yang tampil di reader; contributor UI + admin UI baru.
- Tertaut ke **identitas ayat** (proofs/hash) → konten ter-approve jadi arsip ber-identitas.
- **Global/i18n** (`09` §0): tiap kontribusi ber-`lang`; moderasi per bahasa.

---

## 10. Pemetaan fase

| Bagian | Fase | Catatan |
|--------|------|---------|
| Model data + status + API (read `published`) | **1.10** | perluas anotasi; JSON→Postgres |
| Auth + RBAC + halaman kontributor + **admin moderasi** | **2.0** | close-dev inti |
| Sanad konten + multi-reviewer (ijma) + attestation | **2.x** | jarh wa ta'dil digital |
| Scholar-verifier / ijazah-linked sign | **3+** | otoritas manusia |
| Mint identitas kontribusi (chain) | **4+** | arsip terverifikasi |

> **Ringkas:** close-development = **baca terbuka, tulis ter-moderasi**. Teks kanonik immutable;
> keilmuan tumbuh tak terbatas tapi setiap tambahan **ber-sanad, ber-provenance, ter-moderasi**.

---

## 11. USER ≠ KONTRIBUTOR (dua jalur berbeda) — owner 2026-07-06

Dua hal **berbeda tegas**:

### 11A. USER (pengguna) — catatan PRIVAT
- Siapa pun. Punya **buku catatan pribadi** (dashboard user, **zona USER**, tidak publik, tidak dimoderasi).
- Bisa **stabilo/highlight** ayat/kata → buat catatan (tafsir/asbabun nuzul/tajwid/kosakata/refleksi/…).
- Catatan **tidak** menjadi konten publik. Tidak mengubah teks kanonik. Milik user.
- **TAPI: setiap catatan berjenis-ilmu WAJIB bersumber** (tafsir/asbab/hadits/tajwid → isi `source`
  jelas & akurat). Refleksi pribadi boleh tanpa sumber eksternal (sumber = diri sendiri, ditandai).
- Tujuan: **memudahkan user belajar Islam** (termasuk belajar baca) — arsip belajar pribadi.
- Implementasi awal: lokal (localStorage). Saat ada akun: sinkron **self-hosted** (privasi).

### 11B. KONTRIBUTOR — konten PUBLIK (gating SANGAT ketat)
> "Ini firman Allah — tidak boleh ada kontaminasi & kontradiksi." → verifikasi **berbasis & bersumber**.

- **Bukan** pengguna biasa. Harus **tervalidasi identitas & kredensial**:
  kelas **ulama / mufassir / sejarawan / hafidz / qari bersanad**, dengan bukti (ijazah, sanad,
  afiliasi lembaga, karya). Verifikasi **manual** oleh admin/scholar-verifier sebelum status kontributor aktif.
- **Tingkat kredensial** (RBAC + `credential JSONB`): unverified → verified-contributor →
  reviewer (berilmu) → scholar-verifier. Naik tingkat = butuh bukti + persetujuan.
- **Anti kontaminasi/kontradiksi (guardrail keras):**
  1. **Setiap kontribusi WAJIB `source` + `isnad/sanad` + `grade`** — tanpa sumber = ditolak otomatis.
  2. **Konten yang bertentangan** dengan yang mapan → ditandai `tradition` (metadata mazhab) atau ditolak; **tidak** dibiarkan mengklaim kebenaran tunggal.
  3. **Multi-reviewer (ijma)** untuk konten sensitif; keputusan ter-log + beralasan.
  4. **Teks kanonik tak pernah** bisa diubah kontributor (Hukum Besi #1).
  5. AI hanya bantu draft/deteksi anomali — **tidak** auto-publish (anti-halusinasi domain suci).
- Alur & model = §4–§8 (draft→moderasi→published, versioned, auditable).

**Jembatan:** catatan USER yang bagus & bersumber **bisa diajukan** jadi kontribusi publik →
masuk jalur moderasi kontributor (opt-in). Tapi defaultnya catatan user tetap privat.
