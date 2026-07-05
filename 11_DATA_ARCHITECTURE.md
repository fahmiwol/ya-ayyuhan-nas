# 11 — Arsitektur Data Keilmuan & Lab Riset (Roadmap Pengumpulan)

> Sumber ide owner (2026-07-06). Rencana **pengumpulan data terstruktur** untuk lapisan
> keilmuan di atas Al-Qur'an, + visi **lab riset tersembunyi** (sintesis → penalaran komputasional).
> **Aturan mutlak (berlaku untuk SEMUA):** setiap item **wajib bersumber** (kitab/penulis/penerjemah
> + lisensi + versi) & (bila relevan) **grade/derajat + sanad**. Teks kanonik Qur'an tetap **immutable**.
> Konten publik lewat **moderasi** (`10`); netral teologis (perbedaan = metadata). ⚠️ **Audit lisensi**
> tiap aset (banyak terjemahan/kitab berhak cipta) — lihat `04` & `09`.

---

## A. Menu & domain data (jadi menu baru di app)

### 1. Hadits — koleksi ber-grade
- **Menu "Hadits"**: telusuri per koleksi & per tema; tiap hadits tampilkan **status/derajat**
  (shahih / hasan / dha'if / maudhu'…) + **perawi/sanad** + **sumber**.
- Netral lintas-mazhab: koleksi Sunni (Kutub as-Sittah + Ahmad, Malik, Darimi) & — bila menargetkan
  lintas-tradisi — koleksi lain ditandai `tradition`. Tidak menghakimi; grade = metadata ber-sumber.
- **Sumber (audit):** `fawazahmed0/hadith-api` (⚠️ CC BY-NC), `sunnah.com` (terms), HadeethEnc, `gadingnst` (ID).
- **Model:** `hadith(id, collection, ref_no, text_ar, text_tr[lang], grade, grader, isnad[], tema[], source, license, version)`.

### 2. Dasar Keislaman — Iman · Islam · Ihsan
Kerangka: **Iman (akidah) → Islam (syariat/amal) → Ihsan (akhlak/ihsan)**. Sub-menu:
- **Islamic Roadmap "How to be Muslim"** — jalur bertahap dari **syahadat** → rukun Islam → seterusnya.
- **Sunnah & tata cara** — adab & sunnah harian ber-dalil.
- **Shalat & amalan** — rukun/tata cara/bacaan; **penjelasan shalat** (makna tiap gerakan/bacaan).
- **Glossary istilah Islam** — kamus istilah (fiqh/ushul/tasawuf/hadits…) ber-definisi & sumber.
- **Kajian-kajian Islam** — kurasi materi kajian (tema, ustadz/sumber, ringkasan, tautan).
- **Model:** `lesson(id, track:iman|islam|ihsan, topic, level, body, dalil[](ayah/hadith ref), source, license, lang, order)`;
  `glossary(term, translit, definition, field, source, lang)`.

### 3. Kumpulan Doa
- **Menu "Doa"**: per situasi/tema (harian, setelah shalat, dll); teks Arab + translit + arti + **sumber** + grade (bila dari hadits).
- **Model:** `dua(id, title, text_ar, translit, meaning[lang], occasion, source, grade, lang)`.

### 4. Keilmuan Islam lintas-bidang (kitab/buku turunan) — **inti riset (poin 4)**
- **Menu "Perpustakaan/Keilmuan"**: kumpulan riset & keilmuan Islam dari **segala bidang** — kitab
  klasik, buku turunan, makalah — **selalu dengan sumber**.
- Bidang: tafsir, ushul, fiqh, akidah, tasawuf, sirah, sains-dalam-Qur'an, sejarah, bahasa, dll.
- **Model:** `work(id, title, author, era, field[], type:kitab|buku|paper, lang, source_url, license, summary, refs[])`;
  tautkan ke ayat/tema (many-to-many) untuk cross-reference.
- **Sumber (audit):** altafsir.com, spa5k/tafsir_api (122 tafsir), QuranEnc/IslamHouse, arsip domain-publik (kitab klasik), repositori akademik. ⚠️ karya modern sering berhak cipta.

### 5. Kisah · Hikayat · Riwayat
- **Menu "Kisah"**: kisah Qur'ani (nabi, umat terdahulu), hikayat, riwayat — ber-sumber & (bila perlu) grade.
- **Model:** `story(id, title, narrative[lang], type:qurani|hikayat|riwayat, related_ayah[], source, grade, lang)`.

**Semua domain**: multi-bahasa (i18n), ber-provenance, ter-moderasi (kontributor = paling akhir), dan
tertaut ke **identitas ayat** (hash) bila merujuk ayat → arsip auditable.

---

## B. Prinsip data (dijaga ketat)

1. **Wajib sumber** — tak ada data yatim. Grade/sanad bila relevan.
2. **Teks kanonik immutable** — data keilmuan = lapisan terpisah (zona keilmuan, Postgres/versioned).
3. **Netral** — `tradition`/mazhab = metadata + filter, bukan hakim.
4. **Lisensi diaudit** — utamakan domain-publik/CC-BY; karya berhak cipta perlu izin.
5. **Bisa tumbuh tak terbatas** tapi **ter-moderasi** (analog jarh wa ta'dil). Kontributor = fase akhir;
   sementara ini kumpulkan dari **sumber terbuka** yang teraudit.

---

## C. Lab Riset Tersembunyi (Synthesis Engine) — poin sesudah data

> Owner: setelah data terkumpul → **riset & eksperimen TERPISAH dari app utama** ("riset tersembunyi,
> lab experiment"). Tujuan: sintesis isi Al-Qur'an + keilmuan Islam menjadi **dasar penalaran
> komputasional** — multi cross-domain reasoning, algoritma, metode, agentic/AI system, prompt, logic,
> fragment, episodic — untuk jadi **dasar membangun sistem apa pun**, bahan belajar AI, & riset keilmuan lain.

**Ini = FASE 4 (Synthesis Engine)** di `06_ROADMAP.md` — sekarang punya konteks data konkret (§A).

### Framing & guardrail (WAJIB — jujur)
- **Ekstraksi POLA penalaran** dari tradisi keilmuan (provenance, integritas, analogi, konsensus,
  refleksi, evaluasi-nilai) → **pola rekayasa epistemologis**. **BUKAN** klaim "AI = wahyu / tahu kebenaran ilahi".
- **Provenance-first**: tiap output punya **sanad digital** (sumber + hash + rantai transformasi) — auditable.
- **Bukan** mukjizat numerik ("kode 19" = contested → tidak jadi fondasi). Nilai/objektif (maqashid) =
  pilihan desain manusia yang eksplisit.
- **"Tak terbatas tafsir"** (owner) = ditangani sbg **multi-resolution + uncertainty** (muhkam/mutashabih →
  confidence/abstention), tergantung ruang/waktu/kondisi = konteks retrieval. Bukan klaim kepastian mutlak.

### Peta sintesis (ringkas — detail di `06_ROADMAP.md` Fase 4)
| Struktur tradisi | Padanan komputasi | Wujud |
|---|---|---|
| Sanad/isnad | provenance / data lineage | signed chain, source graph |
| Hifz | integrity / checksum | Merkle (sudah di F1) |
| Tawatur | consensus / BFT | quorum, ensemble |
| Ijtihad | reasoning under uncertainty | agentic loop + confidence |
| Qiyas | analogical / case-based | vector + structural retrieval |
| Ijma | multi-agent consensus | ensemble voting |
| Tafsir berlapis | multi-resolution RAG | layered retrieval |
| Muhkam/mutashabih | confidence/ambiguity | calibrated uncertainty, abstain |
| Tadabbur | chain-of-thought / reflection | reflection passes |
| Maqashid | objective / eval layer | reward/eval alignment |
| Cross-ref tematik | knowledge graph | Neo4j + embeddings (GraphRAG) |

### Wujud produk (salah satu / kombinasi)
1. **Reasoning framework/library** (pola nalar provenance-first, analogical, consensus, reflection) — dasar sistem AI apa pun.
2. **Grounded knowledge engine** (GraphRAG di atas korpus Qur'an+tafsir+hadits) — tanya-jawab **auditable** (tiap klaim ber-sumber).
3. **Agentic + governance** (retrieve → analogize → consensus → reflect → **maqashid check** → output ber-provenance).
4. **Dataset/benchmark** — bahan riset epistemologi AI / alignment / provenance.

### Isolasi (penting — "riset tersembunyi")
- **Repo/DB TERPISAH** dari app utama (bukan di container publik). Akses terbatas.
- App utama (arsip publik) = konsumen data yang sudah tervalidasi; lab = eksperimen.
- Substrat: teks kanonik (F1) + KG (F4) + embeddings (pgvector/Qdrant).

---

## D. Urutan (locked)
1. **Kumpulkan data terbuka teraudit** (§A poin 1–5), terstruktur + ber-sumber → isi menu baru bertahap.
2. **Kontributor** (moderasi manusia ketat) = **paling akhir** (`10`).
3. **Lab riset (Fase 4)** = setelah data cukup; **terpisah** dari app utama.

> Pointer: `06_ROADMAP.md` (Fase 2 data, Fase 4 sintesis), `09` (ulum/sanad), `10` (moderasi), `04` (sumber/lisensi).
