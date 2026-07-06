# 13 — Sumber Global Keilmuan Islam

> Peta sumber keilmuan Islam **global, ilmiah, lintas-budaya** untuk arsip "Ya Ayyuhan Nas" — bukan cuma Indonesia.
> **Aturan file ini:** setiap item punya URL; **netral** (Sunni/Syiah/akademik ditandai sebagai metadata, bukan vonis); **IP-safe** (parafrase + kutipan pendek ber-atribusi, **tanpa** salinan panjang berhak cipta); tiap sumber diberi flag **lisensi/akses + reliabilitas**.
> Dibuat mengikuti HUKUM BESI di `CLAUDE.md` (teks kanonik immutable, provenance wajib, anti vendor-lock, audit lisensi sebelum ingest). Selaras dengan `04_DATA_SOURCES.md`.
> Tanggal riset: 2026-07-06.

**Legenda flag:**
- **Reliabilitas:** ⭐⭐⭐ tinggi (institusi/akademik ter-review) · ⭐⭐ sedang (komunitas terkurasi) · ⭐ hati-hati (perlu verifikasi manual).
- **Akses:** 🟢 lisensi terbuka jelas · 🟡 gratis tapi lisensi/atribusi bersyarat · 🔴 hak cipta ketat / butuh izin / jangan scrape.
- **Perspektif (metadata, netral):** [SUN]=arus utama Sunni, [SHI]=Syiah, [ACAD]=akademik/kritis (termasuk aliran "revisionis"/orientalis), [MULTI]=multi-tradisi.

---

## A. Institusi & pusat riset

### A.1 Barat / akademik sekuler

| Institusi | Yang ditawarkan | Flag |
|---|---|---|
| **Corpus Coranicum** — Berlin-Brandenburg Academy of Sciences (BBAW), kini Corpus Coranicum e.V. | Database >2500 **manuskrip Quran** (~650 M–kini), bacaan varian (qira'at) dari sumber Muslim awal, jaringan intertekstual Quran–teks Antik Akhir, komentar literer-kronologis. Data TEI. | ⭐⭐⭐ · 🟡/🟢 · [ACAD] |
| **University of Leeds — School of Computing** | Rumah **Quranic Arabic Corpus** (lihat §B). Riset komputasional bahasa Quran. | ⭐⭐⭐ · [ACAD] |
| **SOAS, University of London — Centre of Islamic Studies** (est. 1995) | Kajian Quran & hadith dari teks Arab; penerbit **Journal of Qur'anic Studies**. | ⭐⭐⭐ · [ACAD] |
| **University of Oxford** | Lab radiokarbon (mendata manuskrip Birmingham); *Oxford Handbook of Qur'anic Studies*; open.conted.ox.ac.uk (materi al-Tafsir terbuka). | ⭐⭐⭐ · [ACAD] |
| **University of Birmingham — Cadbury Research Library** | **Mingana Collection** (>3.000 manuskrip Timur Tengah); manuskrip Quran Birmingham (radiokarbon 568–645 M). Katalog + citra digital. | ⭐⭐⭐ · 🟡 · [ACAD] |
| **Princeton University** | **Digital Library of Islamic Manuscripts** (theologi, hadith, fiqh); tradisi kuat kajian Islam. | ⭐⭐⭐ · 🟡 · [ACAD/MULTI] |
| **Stanford University** | Basis riset Behnam Sadeghi atas **palimpsest Sana'a** (San'a 1) & metode dating tradisi. | ⭐⭐⭐ · [ACAD] |
| **Georgetown University** | Program Arab & Islamic Studies; panduan riset & koleksi. | ⭐⭐⭐ · [ACAD/MULTI] |
| **University of Chicago / Leiden** | Pusat klasik filologi Arab-Islam & penerbitan (Brill di Leiden). | ⭐⭐⭐ · [ACAD] |
| **Aga Khan University — ISMC (London)** + **Univ. Hamburg** + **Roshan Institute, Univ. Maryland** | Pengelola **KITAB / OpenITI** (lihat §B), didanai ERC Horizon 2020. | ⭐⭐⭐ · 🟢 · [ACAD] |

### A.2 Dunia Muslim

| Institusi | Yang ditawarkan | Flag |
|---|---|---|
| **Royal Aal al-Bayt Institute for Islamic Thought** (Amman, Yordania) | Menjalankan **Altafsir.com**: >110 kitab tafsir Arab, asbab al-nuzul, tajwid, hadith; sebagian dari manuskrip belum pernah terbit. | ⭐⭐⭐ · 🟡/🔴 · [MULTI] |
| **King Fahd Complex for Printing of the Holy Quran** (Madinah) | Standar rasm Uthmani (mushaf Uthman Taha), font QPC; rujukan hitungan ayat Kufi/Hafs. | ⭐⭐⭐ · 🟡 · [SUN] |
| **Al-Azhar University** (Kairo, est. 970) | Otoritas kurikulum klasik: tafsir, hadith, fiqh, bahasa Arab; fatwa & penerbitan. | ⭐⭐⭐ · [SUN] |
| **Islamic University of Madinah — Faculty of Quran & Islamic Studies** | Qira'at, ulum al-Quran, hadith; publikasi & tesis. | ⭐⭐⭐ · [SUN] |
| **Zaytuna** (dua entitas berbeda — tandai jelas): **Univ. Ez-Zitouna** (Tunis, historis) & **Zaytuna College** (Berkeley, AS) | Pendidikan Islam tradisional + liberal arts (Zaytuna College AS). | ⭐⭐⭐ · [SUN] |
| **Islamic Research Institute, Islamabad** | Penerbit jurnal **Islamic Studies** (sejak 1962; Quran, hadith, tafsir, sirah). | ⭐⭐⭐ · [SUN] |

> Catatan netralitas: institusi Syiah utama (mis. **al-Mustafa International Univ.**, Qom; Ahlul Bayt Digital Islamic Library **al-islam.org**) sebaiknya dimasukkan sebagai layer [SHI] terpisah agar perbedaan qira'at/hadith/tafsir tampil sebagai metadata, bukan diperlakukan sebagai satu "kebenaran".

---

## B. Korpus / dataset / API terbuka (+lisensi)

| Sumber | Isi | Lisensi / akses | Flag |
|---|---|---|---|
| **Quranic Arabic Corpus** (Leeds, `corpus.quran.com`) | Anotasi morfologi + sintaksis (i'rab) word-by-word, 77.430 kata. | **GNU public license** + terms of use (open source; wajib atribusi). | ⭐⭐⭐ · 🟡 · [SUN/ACAD] |
| **Tanzil Project** (`tanzil.net`) | Teks Quran Unicode terverifikasi (Uthmani/Simple), banyak terjemahan. | Salin verbatim **boleh**; **ubah teks dilarang**; wajib sebut "Tanzil Project" + link tanzil.net. | ⭐⭐⭐ · 🟡 · [SUN] |
| **QuranEnc** (`quranenc.com`, "Encyclopedia of the Noble Quran", proyek terkait King Fahd Complex) | Terjemahan resmi multi-bahasa + API (list & per-sura/aya). | Gratis via API; cek atribusi per-terjemahan. | ⭐⭐⭐ · 🟡 · [SUN] |
| **Quran.Foundation API** (`api-docs.quran.foundation`, ex-Quran.com) | Teks, terjemahan, tafsir, audio, metadata; API developer. | Gratis, butuh kredensial; lisensi per-resource bervariasi. | ⭐⭐⭐ · 🟡 · [SUN] |
| **QUL — Quranic Universal Library** (`qul.tarteel.ai`, oleh Tarteel AI) | Script Uthmani/IndoPak/Madani (teks+glyph), metadata (surah/ayah/juz/hizb), terjemahan, tafsir, audio ber-timestamp; kode di GitHub. | **Open-source, community-driven**; lisensi **per-resource bervariasi — audit tiap aset**. | ⭐⭐⭐ · 🟡 · [MULTI] |
| **Corpus Coranicum — data TEI** (`github.com/telota/corpus-coranicum-tei`) | Data XML/TEI manuskrip & varian. | Repo publik; cek lisensi repo per-rilis. | ⭐⭐⭐ · 🟡 · [ACAD] |
| **OpenITI / KITAB** (Zenodo + GitHub) | ~1,5 miliar kata teks Arab/Persia Islamicate machine-readable; data reuse teks. | **Open access** (Zenodo/GitHub); versi ber-DOI; **verifikasi lisensi rilis** (bukan CC0 seragam). | ⭐⭐⭐ · 🟢 · [ACAD/MULTI] |
| **Sunnah.com API** (`sunnah.com/developers`, repo `sunnah-com/api`) | Koleksi hadith kanonik + terjemahan; API key via GitHub issue. | **Jangan scrape**; reproduksi hadith individual utk didaktik boleh; mass-repro dilarang. | ⭐⭐⭐ · 🔴 · [SUN] |
| **Altafsir.com** (Aal al-Bayt) | >110 kitab tafsir Arab, asbab al-nuzul, tajwid (banyak PDF). | Baca gratis; **bukan lisensi terbuka** — ingest butuh izin tertulis. | ⭐⭐⭐ · 🔴 · [MULTI] |
| **Al-Maktaba al-Shamela** (`shamela.ws`) | Perpustakaan digital raksasa turats Arab (sumber utama OpenITI). | Teks turats (banyak public-domain klasik) tapi **kualitas edisi bervariasi**; verifikasi vs cetakan. | ⭐⭐ · 🟡 · [SUN] |
| **Sanadset 650K** (Mendeley Data) | 650K baris data perawi + rantai sanad hadith. | Dataset riset (cek lisensi Mendeley). | ⭐⭐ · 🟡 · [SUN/ACAD] |
| **isnad-datasets** (`github.com/muhaddithat/isnad-datasets`) | CSV hadith + isnad; data perawi perempuan. | Repo publik; cek lisensi. | ⭐⭐ · 🟡 · [SUN/ACAD] |
| **EveryAyah** (audio) | ~1.310 jam tilawah 44 qari, verse-aligned ke teks Uthmani, diakritik penuh. | Per-file MP3 self-host; **cek hak reciter/penerbit** per suara. | ⭐⭐⭐ · 🟡 · [SUN] |
| **Tarteel crowd-sourced dataset** (HuggingFace / OpenReview) | ~67 jam, 25K klip, 1.200+ individu — utk ASR/tajwid. | **CC BY-NC-ND 4.0** → **NC/ND: TIDAK untuk komersial & tidak boleh diturunkan.** | ⭐⭐ · 🔴 · [SUN] |
| **Manuskrip Birmingham (Mingana)** & **Palimpsest Sana'a** | Citra + edisi ilmiah manuskrip Quran tertua. | Citra hak library; **untuk verifikasi/riset, bukan teks kanonik app**. | ⭐⭐⭐ · 🟡/🔴 · [ACAD] |

> ⚠️ **Guardrail teks kanonik:** untuk Fase 1, teks Arab kanonik app tetap dari **satu** sumber terverifikasi (Tanzil/QuranEnc/King Fahd) yang di-Merkle-pin. Korpus lain di §B adalah **layer metadata/riset**, **bukan** pengganti teks inti (sesuai HUKUM BESI #1–#2).

---

## C. Ulama & sejarawan (klasik + modern, netral)

Catatan 1 baris = **deskriptif netral**, bukan endorsement. Pandangan yang bertentangan disajikan sebagai metadata.

### Klasik (rujukan tafsir/hadith/qira'at)
- **al-Tabari** (w. 923) [SUN] — *Jami' al-bayan*, tafsir riwayat mani standar; tersedia di Altafsir.
- **al-Zamakhshari** (w. 1144) [SUN, corak Mu'tazili] — *al-Kashshaf*, tafsir balaghah.
- **Ibn Kathir** (w. 1373) [SUN] — tafsir bi'l-ma'thur populer.
- **al-Qurtubi**, **al-Razi**, **al-Suyuti** [SUN] — hukum, kalam, ulum al-Quran.
- **al-Bukhari & Muslim** (abad 9) [SUN] — dua Sahih, inti kanon hadith Sunni.
- **al-Kulayni** (*al-Kafi*) [SHI] — kanon hadith utama Syiah Imamiyah (tandai sebagai layer terpisah).
- **Ibn al-Jazari** [SUN] — otoritas ilmu qira'at (bacaan mutawatir).

### Modern — dunia Muslim
- **Muhammad Abduh / Rashid Rida** (*al-Manar*) [SUN, modernis] — tafsir reformis.
- **Sayyid Qutb** (*Fi Zilal*) & **Mawdudi** (*Tafhim*) [SUN, Islamis] — tafsir bercorak ideologis (tandai).
- **Fazlur Rahman** [ACAD/Muslim] — hermeneutika "double movement".
- **M.A.S. Abdel Haleem** (Oxford) [SUN/ACAD] — penerjemah & editor *Oxford Handbook of Qur'anic Studies*.

### Modern — akademik / kritis (termasuk revisionis; sajikan sebagai metadata, bukan vonis)
- **Theodor Nöldeke** — *Geschichte des Qorāns*, fondasi kronologi surah akademik.
- **Angelika Neuwirth** [ACAD] — pendiri arah Corpus Coranicum; Quran dalam konteks Antik Akhir.
- **Harald Motzki** [ACAD] — metode **isnad-cum-matn** untuk *dating* hadith (menantang skeptisisme total maupun penerimaan naif).
- **Behnam Sadeghi** (Stanford) [ACAD] — analisis palimpsest Sana'a & "travelling tradition test".
- **John Wansbrough / Patricia Crone / Michael Cook** [ACAD, revisionis] — hipotesis asal-usul Quran/Islam yang **kontroversial & dikritik** banyak akademisi (Muslim & non); wajib ditandai sebagai posisi minoritas yang diperdebatkan.
- **Fred Donner** (Chicago) [ACAD] — pendekatan sejarah "believers", lebih menerima sumber tradisional secara kritis.
- **Nicolai Sinai** (Oxford) [ACAD] — kronologi Quran, jembatan tradisi-akademik.

> Prinsip penyajian di app: setiap klaim "berbeda pandangan" (jumlah ayat antar-tradisi, status suatu hadith, dating manuskrip) disimpan sebagai **field metadata bercabang** dengan sumber, bukan di-hardcode satu opini (HUKUM BESI #3).

---

## D. Metode validasi (akademik + tradisional) — kaitan ke Eval-Gate

Dua tradisi validasi **saling melengkapi**, bukan menggantikan:

**Tradisional (ilmu Muslim klasik):**
1. **Isnad** — telaah rantai periwayat (bersambung/terputus, tsiqah/dha'if).
2. **Jarh wa ta'dil** — kritik/penilaian keadilan & ke-dhabit-an perawi (basis dataset Sanadset/isnad-datasets).
3. **'Ilm al-qira'at** — verifikasi bacaan mutawatir (Hafs 'an 'Asim = default app).
4. **Rasm & dabt** — konvensi tulisan Uthmani (rujukan King Fahd Complex).

**Akademik (filologi & sains material):**
1. **Radiokarbon & paleografi** — dating fisik parchment (Birmingham 568–645 M; Oxford lab).
2. **Kritik teks / textual criticism** — kolasi varian (palimpsest Sana'a: lower vs upper text).
3. **Isnad-cum-matn analysis** (Motzki/Sadeghi) — silang antara struktur isnad & variasi matn untuk memperkirakan "common link" & tanggal.
4. **Filologi intertekstual** (Corpus Coranicum/Neuwirth) — hubungan dengan teks Antik Akhir.

**Kaitan ke Eval-Gate (`CLAUDE.md` #2 & Definition of Done):**
- **Layer teks kanonik** → gate teknis: SHA-256 per ayah → Merkle root cocok dengan pin. Fail-closed. (Ini analog "isnad digital": integritas byte).
- **Layer terjemahan/tafsir/hadith** → gate provenance: tiap entri **wajib** sumber+lisensi+versi (parallel ke jarh wa ta'dil: tak ada data "yatim" tanpa atribusi).
- **Layer klaim historis/varian** → gate netralitas: perbedaan pandangan (Sunni/Syiah/akademik) disimpan sebagai metadata bercabang, ditampilkan berdampingan, tidak divonis.
- **Layer audio/tajwid (Fase 3)** → forced alignment (mis. MFA) memvalidasi audio↔teks Uthmani, sejalan verifikasi verse-level EveryAyah.

---

## E. Shortlist ingest (ranked, license-clear)

Diurut dari **paling aman & bernilai** untuk ekspansi global. (⚠️ = butuh langkah lisensi ekstra.)

1. **OpenITI / KITAB** (turats Arab-Persia machine-readable, open access, ber-DOI) — **terbaik untuk ekspansi kitab/tafsir/sejarah global**. Ingest per-versi Zenodo, catat DOI+lisensi rilis. 🟢 [ACAD/MULTI]
2. **Quranic Arabic Corpus** (Leeds) — morfologi/i'rab word-by-word untuk fitur linguistik. Atribusi GNU/terms. 🟡 [SUN/ACAD]
3. **Tanzil + QuranEnc** — teks Quran & terjemahan multi-bahasa terverifikasi. Verbatim + atribusi; **tetap kandidat sumber kanonik yang di-Merkle-pin**. 🟡 [SUN]
4. **QUL (Tarteel)** — bundel script+metadata+audio-timestamp; open-source. **Audit lisensi per-resource** sebelum tiap ingest. 🟡 [MULTI]
5. **Corpus Coranicum (TEI, GitHub)** — metadata manuskrip & varian qira'at untuk fitur "textual history" akademik. Cek lisensi repo. 🟡 [ACAD]
6. **Sanadset 650K + isnad-datasets** — graf perawi/isnad untuk fitur jarh-wa-ta'dil & visualisasi sanad. Cek lisensi dataset. 🟡 [SUN/ACAD]
7. **EveryAyah** (audio) — tilawah per-ayah self-host (R2), sesuai `04_DATA_SOURCES.md`. **Cek hak per-qari.** 🟡 [SUN]
8. **⚠️ Sunnah.com** — via **API resmi + izin** saja (jangan scrape; mass-repro dilarang). Idealnya minta offline dump resmi. 🔴 [SUN]
9. **⚠️ Altafsir.com** — kaya tafsir tapi **bukan lisensi terbuka**: butuh izin tertulis Aal al-Bayt. Jangan scrape. 🔴 [MULTI]

**JANGAN ingest untuk produk komersial tanpa izin/negosiasi:**
- **Tarteel crowd-sourced dataset** — **CC BY-NC-ND 4.0** (NC = non-komersial, ND = no-derivatives). Untuk riset internal saja.
- **Citra manuskrip Birmingham/Sana'a** — hak library/penerbit; pakai untuk **referensi/verifikasi**, bukan redistribusi.

---

## F. Sumber (URLs)

**Institusi & pusat riset**
- Corpus Coranicum — About: https://corpuscoranicum.org/en/about
- Corpus Coranicum — BBAW: https://www.bbaw.de/en/research/corpus-coranicum
- Leeds / Quranic Arabic Corpus (kontak & kredit): https://corpus.quran.com/contact.jsp
- SOAS Centre of Islamic Studies: https://www.soas.ac.uk/research/centres-and-institutes/centre-islamic-studies
- Birmingham — Cadbury / Quran Mingana: https://www.birmingham.ac.uk/facilities/cadbury/birmingham-quran-mingana-collection/birmingham-quran
- Birmingham news (dating): https://www.birmingham.ac.uk/news-archive/2015/birmingham-quran-manuscript-dated-among-the-oldest-in-the-world
- Georgetown — Islamic Studies guide: https://guides.library.georgetown.edu/c.php?g=75620&p=489538
- Oxford — al-Tafsir open resource: https://open.conted.ox.ac.uk/resources/link/al-tafsir
- Aal al-Bayt / Altafsir: https://www.aalalbayt.org/altafsir/
- Al-Azhar University (Wikipedia ringkas): https://en.wikipedia.org/wiki/Al-Azhar_University
- Islamic University of Madinah — Faculty of Quran & Islamic Studies: https://iu.edu.sa/en-us/FacultyofQuranandIslamicStudies
- Islamic Research Institute — jurnal *Islamic Studies* (JSTOR): https://www.jstor.org/journal/islamicstudies
- Daftar pusat riset Islam (Maydan): https://themaydan.com/2020/06/islamic-research-centers-us-canada-middle-east-north-africa/

**Korpus / dataset / API**
- Quranic Arabic Corpus (word-by-word): https://corpus.quran.com/wordbyword.jsp
- Quranic Arabic Corpus (Wikipedia, lisensi GNU): https://en.wikipedia.org/wiki/Quranic_Arabic_Corpus
- Tanzil download & lisensi: https://tanzil.net/download/
- Tanzil translations: https://tanzil.net/trans/
- QuranEnc API: https://quranenc.com/en/home/api/
- Quran.Foundation API docs: https://api-docs.quran.foundation/
- QUL (Tarteel): https://qul.tarteel.ai/ · GitHub: https://github.com/TarteelAI/quranic-universal-library
- Corpus Coranicum TEI (GitHub): https://github.com/telota/corpus-coranicum-tei
- OpenITI corpus (Zenodo): https://zenodo.org/records/17767721 · KITAB: https://kitab-project.org/docs/openITI · OpenITI.org: https://openiti.org/projects/OpenITI%20Corpus.html
- Sunnah.com developers/API: https://sunnah.com/developers · repo: https://github.com/sunnah-com/api
- Altafsir (Aal al-Bayt): https://www.aalalbayt.org/altafsir/
- Al-Maktaba al-Shamela (verifikasi sumber, analisis): https://arabic-for-nerds.com/guest-articles/sources-of-sunnah-com-and-shamela-ws/
- Shamela corpus (paper): https://arxiv.org/pdf/1612.08989
- Sanadset 650K: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9440281/
- isnad-datasets (GitHub): https://github.com/muhaddithat/isnad-datasets
- EveryAyah / Tarteel everyayah dataset: https://huggingface.co/datasets/tarteel-ai/everyayah
- Tarteel Dataset (lisensi CC BY-NC-ND): https://openreview.net/pdf?id=TAdzPkgnnV8

**Metode validasi & manuskrip**
- Palimpsest Sana'a (Wikipedia): https://en.wikipedia.org/wiki/Sanaa_manuscript
- Sadeghi & Goudarzi, "San'a 1 and the Origins of the Qur'an" (PDF publik): https://answersforchrist.com/wp-content/uploads/2025/04/Sadeghi-Goudarzi-sana-Origins-of-the-Quran-1.pdf
- Isnad-cum-matn / Motzki (kajian, batas metode): https://journal.equinoxpub.com/CIS/article/view/28882
- Birmingham Quran (Wikipedia, radiokarbon): https://en.wikipedia.org/wiki/Birmingham_Quran_manuscript

**Rujukan umum**
- *Oxford Handbook of Qur'anic Studies* (Shah & Abdel Haleem, PDF): https://almuslih.org/wp-content/uploads/2024/12/Shah-M-and-Abdel-Haleem-M-edd-%E2%80%93-The-Oxford-Handbook-of-Quranic-Studies-.pdf

---
*Disclaimer netralitas: penandaan [SUN]/[SHI]/[ACAD] adalah metadata deskriptif untuk transparansi provenance, bukan penilaian kebenaran. Perbedaan pandangan disajikan berdampingan sesuai HUKUM BESI #3.*
