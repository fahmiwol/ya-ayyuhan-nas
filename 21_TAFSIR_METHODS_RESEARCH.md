# 21 — Riset Metodologi Tafsir & Ulum al-Qur'an (untuk Lab Tadabbur)

> **Tujuan:** basis metodologis + guardrail untuk "Lab Tadabbur" (playground interpretasi rekayasa Al-Qur'an).
> **Sifat proyek:** netral teologis, semua klaim WAJIB beratribusi. Beda pendapat = "menurut X" (metadata), **bukan** vonis benar/salah.
> **Aturan mushaf:** ayat mana pun yang dikutip di Lab = **klaim sumber → verifikasi mushaf** (SQLite kanonik + Merkle). Riset ini TIDAK memuat teks Arab kanonik; hanya metodologi.
> **Penanda kualitas sumber:**
> - `[TIER-A]` = kitab klasik/turats primer ATAU jurnal peer-review/ensiklopedia akademik (Britannica, Encyclopedia.com, penerbit universitas).
> - `[TIER-B]` = ringkasan populer, blog kajian, situs lembaga non-peer-review, SlideShare (dipakai hanya sebagai penunjuk, bukan otoritas).
>
> Tanggal riset: 2026-07-07. Riset web global (WebSearch + WebFetch).

---

## 0. Peta Besar (kerangka klasifikasi)

Dalam Ulum al-Qur'an, cara membicarakan tafsir dibagi pada **dua sumbu berbeda** yang sering tercampur — Lab harus memisahkan keduanya:

| Sumbu | Pertanyaan | Kategori |
|---|---|---|
| **A. METODE (cara/teknik penyajian)** | *Bagaimana* ayat dibahas? | Tahlili, Ijmali, Muqaran, Maudhu'i |
| **B. CORAK / SUMBER (dari mana makna diambil)** | *Dari mana* penafsir mengambil dasar? | bil-Ma'tsur (riwayat), bir-Ra'y (nalar), bil-Isyari (isyarat/batin) |

> Catatan netralitas: pembagian ini adalah kerangka yang **umum dipakai** di literatur Ulum al-Qur'an modern (mis. adz-Dzahabi, az-Zarqani, al-Farmawi). Ada penulis yang menyusun kategori berbeda; kerangka ini dipilih karena paling luas dipakai, bukan karena "paling benar". `[TIER-A]` Britannica/Encyclopedia.com; adz-Dzahabi *at-Tafsir wal-Mufassirun*.

---

## 1. METODE TAFSIR (cara/teknik) — Sumbu A

Kerangka empat metode (al-Farmawi, *al-Bidayah fi at-Tafsir al-Maudhu'i*, populer di dunia akademik Indonesia & Timur Tengah).

### 1.1 Tahlili (Analitis / التحليلي)
- **Definisi:** menafsirkan ayat **berurutan** sesuai tertib mushaf (surah demi surah, ayat demi ayat), membahas tiap ayat secara rinci: asbab an-nuzul, kosakata (mufradat), i'rab/gramatika, munasabah (kaitan antar-ayat), makna hukum/teologis/sosial. `[TIER-A]` SeekersGuidance; ResearchGate (Metode Tafsir al-Tahlili…).
- **Kitab representatif:** *Jami' al-Bayan* (ath-Thabari), *Mafatih al-Ghayb* (ar-Razi), *al-Muharrar al-Wajiz* (Ibn 'Athiyyah), *Ruh al-Ma'ani* (al-Alusi), *Fath al-Qadir* (asy-Syaukani). `[TIER-A]` SeekersGuidance; Wikipedia *Tafsir*.
- **Kelebihan:** paling kaya/mendalam; cocok untuk analisis mendalam per ayat.
- **Kekurangan:** cenderung berulang, bertele-tele; tema yang tersebar sulit dilihat utuh; rawan memuat riwayat israiliyyat tanpa saringan (kritik klasik terhadap tafsir tahlili panjang).

### 1.2 Ijmali (Global/Ringkas / الإجمالي)
- **Definisi:** penjelasan **global/singkat**, mengikuti tertib mushaf tetapi tanpa perincian panjang; bahasa dekat dengan gaya Al-Qur'an. Ideal untuk pemula/orang awam. `[TIER-B]` JMIA; `[TIER-A]` ResearchGate (al-Ijmali).
- **Kitab representatif:** *Tafsir al-Jalalayn* (al-Mahalli & as-Suyuthi), *Tafsir al-Qur'an al-Karim* (kalangan al-Azhar), *Shafwat al-Bayan* (asy-Syaikh Hasanain Makhluf).
- **Kelebihan:** ringkas, mudah dicerna, minim perdebatan.
- **Kekurangan:** miskin analisis; tidak memadai untuk isu rumit/khilafiyah.

### 1.3 Muqaran (Komparatif / المقارن)
- **Definisi:** **membandingkan**: (a) ayat dengan ayat yang tampak mirip/berbeda, (b) ayat dengan hadis yang tampak bertentangan, atau (c) pendapat para mufassir atas satu ayat — lalu menimbang. `[TIER-A]` Academia (Muqaran Tafsir Method); ResearchGate.
- **Kitab representatif:** karya-karya perbandingan modern (mis. studi komparatif antar-mufassir); metode ini lebih sebagai *pendekatan studi* daripada satu kitab tunggal masyhur.
- **Kelebihan:** menampilkan keragaman pandangan (cocok untuk netralitas Lab!); melatih sikap kritis; memperlihatkan "peta khilaf".
- **Kekurangan:** butuh keahlian tinggi; berisiko berhenti pada "membandingkan" tanpa kesimpulan; bisa membingungkan awam.

### 1.4 Maudhu'i (Tematik / الموضوعي)
- **Definisi:** mengumpulkan **semua ayat** bertema sama lintas surah, menyusunnya, lalu membangun gambaran utuh Al-Qur'an tentang tema itu (iman, riba, sabar, air, dst). Relatif **modern**; jarang berdiri sendiri di era klasik. `[TIER-A]` SeekersGuidance; al-Farmawi.
- **Dua model:** (a) tematik **satu surah** (menggali tujuan/maqashid surah); (b) tematik **satu konsep lintas-Qur'an**.
- **Kitab/tokoh representatif:** al-Farmawi (*al-Bidayah fi at-Tafsir al-Maudhu'i*), Abbas Mahmud al-'Aqqad, Ustadz Abdul Hamid Thahmaz, serta proyek *Tafsir Center for Quranic Studies* (36 jilid). `[TIER-A]` SeekersGuidance.
- **Kelebihan:** relevan dengan problem kontemporer; menyajikan pandangan Qur'an secara sistemik; **paling cocok jadi tulang punggung Lab Tadabbur** (Lab bekerja per-tema/konsep).
- **Kekurangan:** rawan **"cherry-picking"** ayat untuk mendukung tesis penulis (bias konfirmasi); butuh disiplin agar tidak memaksakan tema modern ke teks.

> **Implikasi Lab:** Lab Tadabbur secara struktur = **Maudhu'i** (tematik/konsep) dipadu **Muqaran** (menampilkan >1 pandangan tafsir). Ini konsisten dengan mandat netralitas. Bahaya bawaan maudhu'i (cherry-picking) HARUS dijawab dengan guardrail grounding di §4.

---

## 2. CORAK / SUMBER PENAFSIRAN — Sumbu B

Klasifikasi klasik menurut **sumber** pengambilan makna (adz-Dzahabi, *at-Tafsir wal-Mufassirun*; az-Zarqani, *Manahil al-'Irfan*). `[TIER-A]`

### 2.1 Tafsir bil-Ma'tsur (Riwayat / بالمأثور)
- **Definisi:** menafsirkan berbasis **yang diriwayatkan/dinukil**, bukan opini pribadi. Empat sumbernya berjenjang:
  1. **Al-Qur'an menafsirkan Al-Qur'an** (ayat dengan ayat).
  2. **Sunnah/hadis Nabi** yang menjelaskan ayat.
  3. **Atsar sahabat** (mereka menyaksikan turunnya wahyu).
  4. **Perkataan tabi'in** (murid sahabat).
  `[TIER-A]` Wikipedia *Tafsir*; ARJICC (Tafseer bil-Ma'thur & bil-Ra'y).
- **Kitab representatif:** *Jami' al-Bayan* (ath-Thabari) `[TIER-A]`, *Tafsir al-Qur'an al-'Azhim* (Ibn Katsir), *ad-Durr al-Mantsur* (as-Suyuthi), *Bahr al-'Ulum* (as-Samarqandi).
- **Kelebihan:** paling otoritatif; "aman" karena bersandar nukilan; dekat pemahaman generasi awal (salaf).
- **Kekurangan (kritik ulama sendiri):** tercampur riwayat **lemah/palsu** dan **israiliyyat**; tidak semua nukilan sahih. Maka verifikasi sanad wajib.

### 2.2 Tafsir bir-Ra'y / bid-Dirayah (Nalar / بالرأي)
- **Definisi:** menafsirkan dengan **ijtihad & penalaran** (linguistik, konteks, ushul, logika), setelah menguasai perangkatnya. `[TIER-A]` Wikipedia *Tafsir*; Britannica.
- **DUA JENIS (kunci netralitas — jangan digebyah-uyah):**
  - **Ra'y Mahmud (terpuji/diterima):** ijtihad oleh yang **kompeten**, berbasis kaidah bahasa & ushul, **tidak melanggar** nash/ijma', dan mufassir sadar batas. Disandarkan pada isyarat Al-Qur'an sendiri untuk *tadabbur* (mis. QS Shad 38:29 — *klaim sumber, verifikasi mushaf*). `[TIER-A]` Wikipedia; ARJICC.
  - **Ra'y Madzmum (tercela/ditolak):** menafsirkan **tanpa ilmu**, mengikuti hawa nafsu/kepentingan mazhab, memaksakan makna. Diperingatkan hadis masyhur: *"Barangsiapa berkata tentang Al-Qur'an dengan tanpa ilmu, hendaklah ia menyiapkan tempat duduknya di neraka."* `[TIER-A]` Wikipedia *Tafsir* (mengutip hadis).
- **Kitab representatif (ra'y mahmud):** *Mafatih al-Ghayb* (Fakhr ad-Din ar-Razi), *Anwar at-Tanzil* (al-Baydhawi), *al-Kasysyaf* (az-Zamakhsyari — dicatat bercorak i'tizal, contoh mengapa corak = metadata), *Ruh al-Ma'ani* (al-Alusi). `[TIER-A]` Wikipedia.
- **Implikasi Lab:** interpretasi rekayasa Lab **secara jenis = bir-Ra'y**. Maka Lab HARUS memenuhi syarat ra'y **mahmud** (kompetensi perangkat + grounding + tak melanggar nash + sadar batas), kalau tidak ia jatuh ke ra'y **madzmum**.

### 2.3 Tafsir bil-Isyari / bil-Isyarah (Isyarat/Batin / بالإشاري)
- **Definisi:** menakwil ayat pada makna **selain zahir** karena ada **isyarat batin** yang tersingkap bagi sebagian ahli (umumnya sufi/ahli suluk), **tanpa menafikan makna zahir**. `[TIER-A]` Britannica; Encyclopedia.com; SeekersGuidance.
- **Kitab representatif:** *Tafsir al-Qur'an al-'Azhim* (at-Tustari), *Haqa'iq at-Tafsir* (as-Sulami), *Lata'if al-Isyarat* (al-Qusyairi), *al-Bahr al-Madid* (Ibn 'Ajibah). `[TIER-A]` Wikipedia; Mutawatir (UINSA).
- **Posisi ulama (netral, sebagai metadata):**
  - **Diterima bersyarat** oleh mayoritas selama memenuhi rambu (§3) — adz-Dzahabi menilai isyari **sah** bila metodis, tak menafikan zahir, sejalan bahasa Arab, dan didukung dalil. `[TIER-A]` adz-Dzahabi; Al-Shamela Journal (Pandangan al-Dzahabi thd tafsir sufistik al-Sulami).
  - **Ditolak** bila tak bersyarat → membuka pintu **Batiniyyah** (mengganti makna zahir, merusak teks). `[TIER-A]` SeekersGuidance.
  - **Batas tegas:** isyari (isyarat, tetap hormati zahir) ≠ tafsir **Batini** (klaim makna batin **menggantikan/membatalkan** zahir → ditolak keras).

---

## 3. RAMBU TAFSIR ISYARI YANG SAH (paling penting untuk Lab)

> Lab Tadabbur — karena menawarkan "lensa" & pembacaan reflektif/rekayasa — paling dekat dengan wilayah **isyari + ra'y**. Maka rambu ini = **guardrail inti** Lab.

**Empat syarat baku** (dirumuskan mayoritas imam; diringkas al-Zarqani *Manahil al-'Irfan*, adz-Dzahabi *at-Tafsir wal-Mufassirun*, dan diajarkan luas): `[TIER-A]` SeekersGuidance (mengutip rumusan imam); adz-Dzahabi; az-Zarqani.

1. **Tidak menetapkan hukum/akidah hanya dari isyarat.** Tafsir isyari tidak boleh jadi dasar penetapan hukum syar'i atau keyakinan. (i)
2. **Tidak bertentangan dengan makna zahir ayat.** Makna batin dibangun **di atas** zahir, bukan meniadakannya (Ibn 'Ajibah: zahir adalah **basis awal** lahirnya makna isyari). (ii) `[TIER-A]` SeekersGuidance; Mutawatir/al-Bahr al-Madid.
3. **Tidak bertentangan dengan nash lain (Qur'an/hadis) maupun ijma'.** (iii)
4. **Tidak diklaim sebagai satu-satunya / makna utama**, apalagi diwajibkan diyakini. Ia ditawarkan sebagai *kemungkinan renungan*, bukan kepastian. (iv) `[TIER-A]` SeekersGuidance.

**Syarat tambahan yang sering disebut** (adz-Dzahabi & lainnya): `[TIER-A]`
5. **Ada syahid/dalil pendukung** (dari ayat/hadis lain) — makna isyari tak boleh "menggantung" tanpa penopang.
6. **Sejalan kaidah bahasa Arab** — tidak memaksa lafaz keluar dari kemungkinan maknanya.
7. **Tidak bertentangan dengan akal sehat & syariat**.

**Sandaran ushul yang lebih dalam (untuk audit Lab):**
- **asy-Syathibi, *al-Muwafaqat*:** makna batin diterima **hanya** bila dibenarkan/ditopang oleh makna zahir bahasa Arab dan ada bukti pendukung; tanpa itu = klaim batil. (asy-Syathibi umumnya membatasi ketat, dipakai sebagai rem terhadap kesewenangan takwil.) `[TIER-A]` (rujukan *al-Muwafaqat*; lihat juga pembahasan i'jaz ilmi di §5 yang memakai argumen sama).
- **al-Ghazali, *Ihya'* / *Jawahir al-Qur'an*:** membuka ruang makna batin (isyari) bagi ahlinya, **tetapi** tetap menegaskan zahir tak boleh dibatalkan — kalau tidak, jatuh ke Batiniyyah (yang beliau bantah keras dalam *Fadha'ih al-Batiniyyah*). `[TIER-A]` (posisi umum al-Ghazali; verifikasi kutipan tepat sebelum dipublikasikan Lab).
- **Ibn Qayyim (& Ibn Taimiyah):** membedakan **isyarat sahih** (i'tibar/qiyas makna yang selaras zahir — dibolehkan) dari **tahrif** (memalingkan makna secara batil — terlarang). `[TIER-A]` (posisi umum; verifikasi kutipan).

> **Kartu guardrail Lab (ringkas untuk kode/validator):** sebuah "lensa/tadabbur" Lab **hanya boleh tayang** bila lulus checklist: (a) tidak menetapkan hukum/akidah; (b) tidak menabrak zahir; (c) tidak menabrak nash/ijma'; (d) disajikan sebagai *kemungkinan renungan*, bukan kepastian/tunggal; (e) punya syahid pendukung; (f) tidak melanggar bahasa/akal/syariat. Gagal salah satu → **fail-closed** (blokir/tandai "butuh tinjauan").

---

## 4. HIERARKI GROUNDING ("sebaik-baik tafsir") — untuk pipeline Lab

**Kaidah masyhur** (Ibn Taimiyah, *Muqaddimah fi Ushul at-Tafsir*): urutan mencari tafsir yang benar. `[TIER-A]` Ibn Taimiyah *Muqaddimah*; MCL Portal (ringkasan akademik); abdurrahman.org (kutipan Dawud Burbank).

> **Urutan (dari paling kuat):**
> 1. **Al-Qur'an dengan Al-Qur'an** — "sesuatu yang global di satu tempat, dijelaskan di tempat lain."
> 2. **Al-Qur'an dengan as-Sunnah** — "Sunnah menjelaskan & merinci Al-Qur'an."
> 3. **Perkataan sahabat** — "mereka paling tahu karena menyaksikan konteks turunnya."
> 4. **Perkataan tabi'in** — dirujuk banyak imam bila tak didapat pada 1–3.
> 5. **Ijtihad bir-Ra'y** — nalar berkaidah, **baru** setelah 1–4, dan tunduk pada rambu §2.2 & §3.

**Implikasi pipeline Lab (WAJIB):**
- Setiap kajian Lab menampilkan **grounding berjenjang**: kutip dulu ayat-penjelas (1) → hadis sahih (2) → atsar sahabat/tabi'in (3–4) → **baru** "lensa rekayasa" sebagai lapis (5) yang **eksplisit ditandai** sebagai ijtihad/renungan, bukan tafsir otoritatif.
- Lapis 5 (lensa Lab) **tidak boleh** disajikan setara/di atas lapis 1–4. UI harus memisahkan visual "sumber otoritatif" vs "renungan Lab".
- Semua lapis 1–4 = **klaim sumber → verifikasi mushaf/kitab + provenance** (sumber+lisensi+versi), sesuai HUKUM BESI proyek.

---

## 5. I'JAZ AL-QUR'AN & BATAS TAFSIR ILMIAH

### 5.1 Aspek-aspek i'jaz (kemukjizatan)
- **I'jaz balaghi/lughawi (bahasa & retorika)** — aspek yang **paling disepakati** klasik. Teori **nazm** (susunan): al-Jahiz, ar-Rummani, al-Khaththabi, **al-Baqillani** (*I'jaz al-Qur'an*), dan puncaknya **'Abd al-Qahir al-Jurjani** (*Dala'il al-I'jaz* & *Asrar al-Balaghah*) — i'jaz terletak pada **relasi sintaksis antar-kata**, bukan kata terpisah. `[TIER-A]` Ulumuna/ResearchGate (Al-Nazm & al-Jurjani); Grokipedia *I'jaz*.
- **I'jaz tasyri'i (hukum/legislasi):** kesempurnaan & keseimbangan syariat.
- **I'jaz ghaibi (berita gaib):** informasi masa lalu/depan.
- **I'jaz 'ilmi (ilmiah):** klaim kesesuaian dengan sains — **KONTROVERSIAL** (lihat 5.2).

### 5.2 DEBAT tafsir ilmiah (al-tafsir al-'ilmi) — batas untuk Lab
Netral: sajikan **dua kubu** sebagai metadata, jangan vonis.

**Kubu PRO (mendukung):** `[TIER-A]` islamicreligious.com; sunnirazvi (mengutip); Tantawi-Jauhari.net.
- **Tanthawi Jauhari** (w. 1940), *al-Jawahir fi Tafsir al-Qur'an al-Karim* — berpendapat semua penemuan sains bisa ditunjukkan telah diisyaratkan Al-Qur'an; menggeser fokus dari retorika ke sains.
- Sebagian menyandarkan pada **al-Ghazali, al-Fakhr ar-Razi, as-Suyuthi** yang membuka pintu bahwa Al-Qur'an memuat pokok segala ilmu. `[TIER-A]` sunnirazvi.
- **Argumen:** memperkuat iman, menjembatani sains–agama, mengajak tadabbur ayat kauniyah.

**Kubu KONTRA (menolak/hati-hati):** `[TIER-A]` adz-Dzahabi (mengutip asy-Syathibi); sunnirazvi; islamicreligious.com.
- **asy-Syathibi** (*al-Muwafaqat*): Al-Qur'an turun sebagai **hidayah**, **bukan** ensiklopedia kedokteran/astronomi/geometri/kimia — memaksakan sains ke ayat = menyimpang dari maksud diturunkannya. `[TIER-A]` (dikutip adz-Dzahabi via sunnirazvi).
- **Argumen "sains berubah":** sains (bahkan paradigmanya) **usang seiring waktu**; mengikat makna Qur'an yang tetap pada teori yang berubah **membahayakan** kesucian & kredibilitas teks. `[TIER-A]` sunnirazvi.
- **Kritik metodologis:** banyak pelaku i'jaz ilmi **bukan ahli tafsir**; kerjanya mencocok-cocokkan (concordism), bukan tafsir berkaidah. `[TIER-A]` islamicreligious.com; sunnirazvi.
- Tokoh modern yang mengkritik/membatasi corak ini kerap disebut: **Amin al-Khuli**, **Mahmud Syaltut**, **Abbas Mahmud al-'Aqqad** (perlu verifikasi kutipan spesifik sebelum dipublikasikan — sumber sekunder belum memuat teks persisnya).

> **Batas untuk Lab (WAJIB):** klaim ilmiah/sains atas ayat = **wilayah paling rawan**. Aturan Lab:
> - **Jangan** menyajikan kecocokan sains sebagai "bukti kemukjizatan" atau kebenaran final (larangan CLAUDE.md: "klaim mukjizat numerik/ilmiah sebagai fitur inti" = non-goal).
> - Bila menyentuh sains, sajikan sebagai **analogi/renungan** ("ayat ini *mengajak merenungkan* fenomena X"), **bukan** "Al-Qur'an *menyatakan* teori X".
> - Wajib disertai **disclaimer**: sains berubah; ini pembacaan reflektif, bukan tafsir otoritatif; ada ulama yang menolak pendekatan ini (asy-Syathibi dll).
> - Tandai `kontroversi: tinggi` + tampilkan **kedua kubu** (pro/kontra) sebagai metadata.

---

## 6. RINGKAS → 5 GUARDRAIL ACTIONABLE UNTUK LAB

 Diletakkan di sini agar bisa langsung dijadikan aturan validator/kode.

1. **Klasifikasi diri Lab = Maudhu'i×Muqaran, jenis = bir-Ra'y, wilayah = isyari.** → Karena itu Lab **wajib** tunduk syarat *ra'y mahmud* + *rambu isyari*. Simpan tiap kajian dengan field `metode`, `corak`, `tingkat_grounding`, `kontroversi`.
2. **Validator "Kartu Rambu Isyari" (fail-closed):** kajian hanya tayang bila lulus 6 cek — (a) tak menetapkan hukum/akidah, (b) tak menabrak zahir, (c) tak menabrak nash/ijma', (d) disajikan sebagai kemungkinan (bukan tunggal/pasti), (e) ada syahid pendukung, (f) tak langgar bahasa/akal/syariat. Gagal 1 → status `needs_review`.
3. **Grounding berjenjang wajib (kaidah Ibn Taimiyah):** UI & data model **memisahkan** lapis otoritatif (ayat→ayat, sunnah, atsar sahabat/tabi'in) dari lapis "lensa Lab" (ra'y/renungan). Lensa Lab tak boleh tampil setara/di atas sumber otoritatif. Semua lapis = provenance + verifikasi mushaf.
4. **Rem tafsir ilmiah:** klaim sains = `kontroversi:tinggi`, wajib disclaimer "sains berubah + ada ulama menolak (asy-Syathibi)", sajikan sebagai analogi/ajakan renung — **bukan** bukti mukjizat (selaras non-goal CLAUDE.md).
5. **Netralitas sebagai data, bukan opini:** setiap beda pendapat disimpan sebagai `pendapat[] = {tokoh, kitab, posisi, sumber_url}`. Lab **tidak menyimpulkan "yang benar"**; ia menampilkan peta khilaf (semangat metode Muqaran). Setiap klaim tafsir = "klaim sumber X", ayat = "verifikasi mushaf".

---

## 7. Daftar Sumber (dengan tier)

**Kitab/turats primer & ensiklopedia akademik `[TIER-A]`:**
- adz-Dzahabi, *at-Tafsir wal-Mufassirun* (rujukan induk klasifikasi corak & syarat isyari).
- az-Zarqani, *Manahil al-'Irfan fi 'Ulum al-Qur'an* — https://archive.org/details/ManahilAlirfanFiulumAlQuran
- Ibn Taimiyah, *Muqaddimah fi Ushul at-Tafsir* — ringkasan: https://www.mclportal.com/courses/al-muqadimah-fi-usul-al-tafsir/ ; kutipan: https://abdurrahman.org/2018/06/28/excerpts-from-muqaddimah-fee-usoolit-tafseer-of-ibn-taymiyyah/
- asy-Syathibi, *al-Muwafaqat* (batas takwil & kritik tafsir ilmi — dikutip via adz-Dzahabi).
- al-Ghazali, *Jawahir al-Qur'an* / *Ihya'* / *Fadha'ih al-Batiniyyah* (posisi isyari vs Batiniyyah — verifikasi kutipan).
- al-Jurjani, *Dala'il al-I'jaz* & *Asrar al-Balaghah*; al-Baqillani, *I'jaz al-Qur'an* (i'jaz balaghi/nazm).
- al-Farmawi, *al-Bidayah fi at-Tafsir al-Maudhu'i* (empat metode).
- Britannica — https://www.britannica.com/topic/tafsir ; Encyclopedia.com — https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/tafsir
- Wikipedia *Tafsir* — https://en.wikipedia.org/wiki/Tafsir
- SeekersGuidance (tahlili vs maudhu'i) — https://seekersguidance.org/answers/quran/what-is-the-difference-between-thematic-and-analytical-tafsir-of-the-quran/
- SeekersGuidance (makna & syarat tafsir ishari) — https://seekersguidance.org/answers/general-answers-feeds/what-does-tafsir-ishari-esoteric-interpretation-mean/

**Jurnal peer-review / academia `[TIER-A/B]`:**
- "Muqaran Tafsir Method: History, Basis and Implications" — https://www.academia.edu/129572155/
- "Al-Nazm Stylistic Discourse in I'jaz al-Qur'an (al-Jurjani)", Ulumuna/UIN Mataram — https://ulumuna.or.id/index.php/ujis/article/view/425
- "Exploring Scientific Exegesis (al-Tafsir al-'Ilmi): Merits, Challenges, Boundaries", J. of Religion & Society — https://islamicreligious.com/index.php/Journal/article/view/150
- "The Qur'an and Science: Debate on Validity of Scientific Interpretations", ResearchGate — https://www.researchgate.net/publication/269469181
- Tafseer bil-Ma'thur & bil-Ra'y: A Research Study, ARJICC — http://arjicc.com/index.php/arjicc/article/view/434
- "Dialektika Zahir-Batin & Produksi Makna Ishari dalam al-Bahr al-Madid", Mutawatir UINSA — https://jurnalfuf.uinsa.ac.id/index.php/mutawatir/article/view/1732
- "Metode Tafsir al-Tahlili, al-Ijmali, al-Muqaran, al-Mawdu'i", ResearchGate — https://www.researchgate.net/publication/360767497

**Populer/lembaga (penunjuk, bukan otoritas) `[TIER-B]`:**
- Riwaq al-Quran, Types of Tafsir — https://riwaqalquran.com/blog/types-of-tafsir-with-examples/
- Quran Grace, 6 Types of Tafsir — https://qurangrace.com/types-of-tafsir/
- Scientific Exegesis — a Viable Project? (sunnirazvi) — http://sunnirazvi.net/library/scientific.htm
- "Tantawi Jawhari and the Qur'an" (Routledge, ringkasan) — https://www.tantawi-jauhari.net/wp-content/uploads/2021/03/Tantawi-Jawhari-and-the-Quran.pdf

---

## 8. Catatan verifikasi & keterbatasan riset

- Sumber peringkat `[TIER-A]` yang berupa **kitab turats** (adz-Dzahabi, az-Zarqani, asy-Syathibi, al-Ghazali, Ibn Qayyim) di riset ini banyak diakses **via sumber sekunder** (jurnal/ensiklopedia/ringkasan). **Sebelum dipublikasikan Lab**, kutipan spesifik (halaman/redaksi Arab) WAJIB diverifikasi ke kitab aslinya — jangan publikasikan "kata asy-Syathibi/al-Ghazali/Ibn Qayyim" persis tanpa cek matan.
- Tokoh kubu-kontra tafsir ilmi (Amin al-Khuli, Mahmud Syaltut) **disebut** di literatur tetapi teks kutipan persisnya belum ditemukan di sumber yang diakses → tandai `perlu_verifikasi` sebelum dikutip sebagai pernyataan langsung.
- Semua ayat yang nanti dipakai kajian = **klaim sumber → verifikasi mushaf** (Merkle root) sesuai HUKUM BESI proyek. Riset ini sengaja **tidak** memuat teks Arab kanonik.
