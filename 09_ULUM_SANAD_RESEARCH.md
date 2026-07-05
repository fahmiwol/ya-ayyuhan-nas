# 09 — Ulum al-Qur'an: Sanad, Tafsir, Asbab, Qira'at, Hifz (Riset + Konsep)

> Riset & konsep untuk lapisan **keilmuan** di atas teks kanonik. Sumber ide owner
> (sesi 2026-07-06) + riset sumber konkret. **Scope: GLOBAL/dunia — multi-bahasa (i18n) WAJIB.**
> Prinsip dijaga: teks kanonik **immutable**; keilmuan = lapisan ber-provenance, ter-moderasi
> (lihat `10_CONTRIBUTION_MODERATION.md`). Netral teologis (perbedaan = metadata, bukan hakim).

---

## 0. Scope global & i18n (owner: "bukan cuma Indonesia, tapi dunia")

- **UI multi-locale** (id/en/ar + lainnya) — arsitektur i18n (mis. `next-intl`), RTL/LTR aware.
- **Konten multi-bahasa**: terjemahan, tafsir, kisah, tiap record bawa `lang`. Bisa N bahasa/ayat.
- **Sumber multi-bahasa konkret:** QuranEnc (King Fahd, **80+ bahasa**), fawazahmed0 (**90+ bahasa, 400+ terjemahan**), IslamHouse API hub (Quran+Hadith+tafsir resmi multi-bahasa), QUL (qul.tarteel.ai).
- Angka acuan tetap: 114 surah / 6236 ayat / Hafs — universal.

---

## 1. Sanad · Talaqqi · Ijazah (inti keaslian bacaan)

**Konsep (dari owner):** Sanad Al-Qur'an = mata rantai silsilah **guru→murid (talaqqi)** yang
bersambung bacaan/hafalan **mulut ke mulut** sampai Rasulullah ﷺ, dari Jibril, dari Allah.
Menjamin keaslian **bacaan** (bukan hanya teks): makhraj, mad, sifat huruf terjaga persis.
- **Talaqqi:** setor bacaan/hafalan langsung ke guru bersanad (bukan otodidak).
- **Ijazah:** sertifikat sanad setelah khatam + diuji — mencantumkan rantai guru sampai Nabi.
- Dua jenis ijazah: **Qira'ah** (bacaan) & **Hifz** (hafalan). Ada juga Muqaddimah (dasar).
- Tradisi *talaqqi* butuh hadir fisik; sebagian ulama kini terima **talaqqi via video**.

**Padanan teknis (nyambung ke yang sudah dibangun di F1):**
| Tradisi | Fungsi | Padanan di app |
|---------|--------|----------------|
| Sanad/isnad | rantai transmisi terverifikasi | **provenance chain / data lineage** (sudah: sources_matched, proofs) |
| Hifz | penjagaan via hafalan redundan | **checksum/Merkle/multi-source** (sudah: F1) |
| Ijazah | kredensial berjenjang | **credential/attestation** ber-tanda-tangan (rencana) |
| Talaqqi | verifikasi lisan guru | **coach + human-in-loop** (Fase 3 + moderasi) |

**Fitur turunan:**
- **Graf sanad** (guru↔murih↔qari) — visualisasi rantai. Data: paper genealogi sanad qira'at
  Arab-Indonesia (dominasi Hafs); struktur graf mirip **MIS** (2092 node / 77.797 edge) & **Sanadset 650K** (untuk hadits, jadi acuan skema).
- **Ijazah digital** (Fase 3+): setelah lulus uji bacaan (AI-assisted + verifikasi guru manusia) → sertifikat ber-rantai. **AI = pembantu, bukan pemberi ijazah** (ijazah tetap otoritas guru bersanad).

---

## 2. Hafidz / Hafidzah & Muroja'ah

**Konsep (owner):** Hafidz (lk) / Hafidzah (pr) = hafal seluruh **30 juz**. Bukan sekadar hafal
teks — tapi **menjaga (muroja'ah)** & **mengamalkan** isinya.

**Fitur turunan:**
- **Mode Hafalan** (sudah di roadmap `08` §2C): sembunyikan teks bertahap, uji per kata/ayat.
- **Muroja'ah scheduler**: spaced-repetition (SRS) untuk menjaga hafalan; target harian, progres per juz/hizb.
- **Tracking hafalan** (zona USER, privat): status per ayat (baru/proses/mutqin), streak.
- **Latih Baca (Fase 3)**: mic + AI eval (karaoke) — bantu muroja'ah mandiri.
- Framing: alat **muroja'ah & latihan**, bukan pengganti guru/talaqqi.

---

## 3. Asbabun Nuzul (tiap ayat punya kisah)

**Konsep (owner):** tiap ayat bisa punya **kisah/sebab turun** berbeda-beda.
**Sumber klasik & digital:**
- **al-Wahidi**, *Kitab Asbab al-Nuzul* (~**570 ayat**) — terjemahan EN (Mokrane Guezzou) di **altafsir.com**.
- **al-Suyuti**, *Lubab al-Nuqul*.
- **tafsircenter/tafsir-mcp** — asbab al-nuzul + **isnad penuh untuk 201 ayat** (offline, validasi Pydantic).
- **altafsir.com** — portal tafsir/asbab besar.

**Model data:** asbab = **banyak per ayat** (0..N), tiap record: `narrative`, `grade`
(shahih/hasan/…), `isnad`, `source`, `lang`, `version`. Netral: tampilkan grade + sumber, tak menghakimi.

---

## 4. Multi-Tafsir (1 kata/ayat bisa jutaan makna)

**Konsep (owner):** Al-Qur'an tak terbatas — 1 kata/ayat bisa punya **banyak tafsir/makna**.
**Sumber konkret:**
- **spa5k/tafsir_api** — **~122 tafsir** multi-bahasa (Ibn Kathir, Jalalayn, Tabari, al-Sa'di, Baghawi, Qurtubi, al-Muyassar…), bisa **self-host**.
- **altafsir.com**, **QuranEnc** (multi-bahasa resmi King Fahd), **IslamHouse API hub**, **QUL**.
- Indonesia: Tafsir Kemenag, Quraish Shihab, Jalalain (equran.id / renomureza).

**Model data:** tafsir = **unlimited per ayat & per kata** (many), berlapis (ringkas→panjang),
multi-bahasa, tiap record: `body`, `source`, `author`, `madzhab/tradition` (metadata), `range`
(per-ayat / per-kata / per-range), `lang`, `version`, `grade`. **Semua lewat moderasi** (`10`).
→ Ini alasan utama sistem kontribusi ter-moderasi: konten keilmuan tumbuh tak terbatas, tapi
otentisitas dijaga (analog **jarh wa ta'dil**).

---

## 5. Qira'at & Perawi (cara baca)

**Konsep:** **10 qira'at mutawatir** (masing-masing 2 riwayat = 20 transmisi). Syarat Ibn al-Jazari:
sesuai (1) bahasa Arab, (2) rasm Uthmani, (3) sanad mutawatir. **Default app = Hafs 'an 'Asim**;
qira'at lain = **layer opsional (Fase 2+)**, bukan pengganti default.
**Sumber:**
- **AQQD v1.0** (2026) — Annotated Quranic Qiraat Dataset, 10 qira'at (untuk ML/audio).
- **KFGQPC** — teks + font 8 qiraat (Warsh, Qaloon, Doori, Soosi, Bazzi, Qunbul, Shu'bah…).
- Paper genealogi **sanad qira'at** (jaringan transmisi).

**Model data:** qira'at = layer teks alternatif + **sanad per qari/riwayat** (graf). Tidak menyentuh
default Hafs kanonik.

---

## 6. Validator / Cara Baca (tajwid) — realistis & jujur

Ringkas (detail di `06_ROADMAP.md` Fase 3 & `08` §4):
- **ASR:** Whisper fine-tuned (tarteel-ai), **Wav2Vec2**; **forced align** (MFA, MIT); **MDD** fonem.
- **Dataset:** EveryAyah (ber-timing), **AQQD** (qiraat), QDAT (tajwid labels).
- **Bisa dideteksi:** kata salah/lompat (tinggi), makhraj kasar (sedang), mad/durasi (sedang-tinggi), ghunnah/qalqalah (sedang), idgham/ikhfa halus (sulit).
- **Jujur:** tajwid halus tak 100% otomatis. **Coach + feedback**, bukan hakim. Approksimasi *talaqqi*, **bukan pengganti guru/ijazah**.

---

## 7. Cara Mengamalkan (how to practice) & hal penting lain

- **Tadabbur/amal:** catatan reflektif pribadi (zona USER), tema/maudhu'i, pengingat.
- **Tematik/maudhu'i:** kumpulan ayat per tema (pintu ke knowledge graph Fase 4).
- **Adab & fadhilah:** metadata ber-sumber (Fase 2).
- Semua **netral**, ber-provenance, tak menghakimi mazhab.

---

## 8. Sumber konkret (inventaris — audit lisensi sebelum pakai)

| Area | Sumber | Catatan |
|------|--------|---------|
| Teks/terjemah multi-bahasa | QuranEnc (80+), fawazahmed0 (90+/400+), IslamHouse hub, QUL, AlQuran Cloud | resmi/terbuka — cek terms |
| Tafsir | spa5k/tafsir_api (122), altafsir.com, Kemenag/equran.id | self-host tafsir_api |
| Asbabun nuzul | al-Wahidi (altafsir.com), al-Suyuti, tafsircenter/tafsir-mcp (201 isnad) | klasik = domain publik; terjemahan cek |
| Qira'at | AQQD v1.0, KFGQPC | audit; Hafs default |
| Isnad/sanad (skema) | MIS (2092/77.797), Sanadset 650K | hadits — acuan skema graf |
| Tajwid/ASR | tarteel-ai, EveryAyah, MFA, QDAT | Fase 3 |
| Ijazah/talaqqi | platform ijazah online (rujukan konsep) | otoritas guru = manusia |

> ⚠️ Kode boleh MIT; **data/model sering tidak** (GPL/CC-BY-NC/terms). Audit per-aset.

---

## 9. Pemetaan ke fase

| Area | Fase | Catatan |
|------|------|---------|
| i18n UI + konten multi-bahasa | **1.10+** | arsitektur global |
| Multi-tafsir, asbabun nuzul (data + tampil) | **2** | + moderasi (`10`) |
| Qira'at layer + graf sanad | **2** | Hafs tetap default |
| Latih Baca (mic+AI), tajwid, ijazah-assist | **3** | coach, bukan hakim |
| Muroja'ah SRS + hafalan tracking | **2–3** | zona user |
| Knowledge graph tematik/isnad | **4** | GraphRAG |

**Sources (riset 2026-07-06):**
[AQQD v1.0](https://www.researchsquare.com/article/rs-8804884/v1) ·
[MIS isnad](https://www.sciencedirect.com/science/article/pii/S2352340924004086) ·
[Sanadset 650K](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9440281/) ·
[genealogi sanad qira'at](https://www.researchgate.net/publication/403236008) ·
[al-Wahidi Asbab (altafsir)](https://www.altafsir.com/Books/Asbab%20Al-Nuzul%20by%20Al-Wahidi.pdf) ·
[Asbab al-Nuzul (Wikipedia)](https://en.wikipedia.org/wiki/Asbab_al-Nuzul) ·
[spa5k/tafsir_api](https://github.com/spa5k/tafsir_api) ·
[QuranEnc API](https://quranenc.com/en/home/api/) ·
[IslamHouse API hub](https://github.com/IslamHouse-API/multilingual-quran-hadith-islamic-content-database-api-hub) ·
[fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api) ·
[QUL](https://qul.tarteel.ai/) ·
[Ijazah & Sanad explained](https://ilmify.app/blog/ijazah-and-sanad-the-quranic-certification-system-explained/)
