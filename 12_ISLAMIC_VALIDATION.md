# 12 — Riset: Validasi Kebenaran ala Islam + Latar Doa

> **Tujuan dokumen.** Menyediakan (A) rubrik "Eval-Gate" — cara ilmu Islam mengautentikasi pengetahuan yang ditransmisikan, yang bisa kita kodekan sebagai gerbang validasi sebelum aplikasi mempublikasi konten bernarasi; (B) latar & sanad 8 doa harian di aplikasi; (C) catatan doa Qur'ani.
>
> **Aturan netralitas.** Di mana ulama / mazhab berbeda, perbedaan dicatat sebagai *metadata* ("menurut X… / menurut Y…"), bukan memilih pemenang. Setiap klaim disertai sumber (lihat `## D. Sumber`). Kutipan hanya pendek & beratribut; selebihnya parafrase.
>
> **Status:** riset awal, level referensi. Untuk keputusan produksi (menandai satu hadits "sahih/da'if" secara final di DB) tetap wajib takhrij dari kitab primer + rujukan ahli hadits kontemporer. Ini *bukan* fatwa.

---

## A. Eval-Gate: metode validasi (rubrik)

### A.1 Kerangka klasik: dua sumbu penilaian

Ilmu hadits menilai riwayat pada **dua sumbu independen** yang keduanya harus lolos:

1. **Kritik Sanad (isnad)** — memeriksa *rantai penutur*: kesinambungan (ittishal), integritas moral tiap perawi ('adalah), dan ketepatan hafalan/dokumentasi (dhabt). Alatnya: **ilm al-rijal** (biografi perawi) dan **al-jarh wa al-ta'dil** (mencela/menguatkan perawi). [1][2][5]
2. **Kritik Matn (teks)** — memeriksa *isi*: bebas dari kejanggalan (syadz) dan cacat tersembunyi ('illah); tidak bertentangan dengan Qur'an, hadits yang lebih kuat, akal sehat, atau fakta sejarah. Kritik matn sudah dipakai sejak periode awal, bukan hal modern. [4][5]

> Catatan netralitas: sebagian pengkritik menuduh *ulum al-hadith* klasik hanya peduli isnad; literatur akademik menunjukkan kritik matn juga berperan sejak dini — ini perdebatan metodologis, dicatat sebagai metadata. [4][5]

### A.2 Kriteria per-tingkat (grading)

Ringkasan kriteria (dari sumber ulum al-hadith [3][8][9]):

| Tingkat | Kriteria inti | Konsekuensi praktis |
|---|---|---|
| **Sahih** | 5 syarat: (1) sanad **muttasil** (bersambung tanpa putus), (2) tiap perawi **'adl** (integritas), (3) tiap perawi **dhabt** (hafalan kuat/tepat), (4) **tidak syadz** (tak menyelisihi yg lebih kuat), (5) **tidak ada 'illah** (cacat tersembunyi). [8][9] | Hujjah kuat |
| **Hasan** | Semua syarat sahih terpenuhi *kecuali* dhabt perawi sedikit di bawah standar; atau ada perawi lebih lemah tetapi didukung jalur lain. [3][8] | Umumnya diterima sbg hujjah oleh mayoritas |
| **Da'if** | Gagal memenuhi syarat sahih/hasan: rantai terputus, atau perawi tercela/lalai/pelupa. [3][9] | Tidak jadi dasar hukum; sebagian ulama membolehkan utk *fadha'il a'mal* dgn syarat — **ini titik khilaf, catat sbg metadata** |
| **Maudhu'** | Palsu/dibuat-buat & dinisbatkan dusta kepada Nabi; dikenali via pengakuan pemalsu atau kemustahilan kronologis/tekstual. [3][9] | **Dilarang** disebar sbg hadits |

Sumbu **cara transmisi** (terpisah dari tingkat di atas): [8][9]
- **Mutawatir** — diriwayatkan oleh *sejumlah besar* perawi di tiap lapis, sehingga mustahil bersepakat dusta → memberi *ilm yaqin* (pengetahuan pasti). Contoh klasik: tata cara shalat 5 waktu. [3]
- **Ahad** — hanya satu/sedikit jalur pada satu lapis; bergantung pada keandalan individu. Mayoritas isi kitab hadits masuk kategori ini; memberi *dzann* (dugaan kuat), bisa sahih/hasan/da'if. [3]

### A.3 Korroborasi & konsensus

- **Ijma' (konsensus)** — dalam usul fiqh Sunni, ketika sesuatu yang *probabilistik* didukung ijma', hukumnya menjadi *definitif*. Ijma' berfungsi sebagai dalil ketiga setelah Qur'an & Sunnah, karena mustahilnya kesalahan sinkron seluruh generasi ahli. [6][7] (Definisi & lingkup ijma' sendiri diperdebatkan antar mazhab — catat sbg metadata.)
- **Tawatur** ≈ multi-sumber independen: kekuatan datang dari *jumlah jalur independen*, bukan otoritas satu titik.

### A.4 Pemetaan ke konsep integritas data modern (ringkas)

| Konsep Islam klasik | Analog data-integrity | Implikasi engineering |
|---|---|---|
| Isnad (rantai perawi) | **Provenance / lineage** | Setiap record punya field sumber→sumber |
| 'Adl & dhabt perawi | **Source trust score** | Skor keandalan sumber, dapat diaudit |
| Ittishal (kesinambungan) | **Chain-of-custody / no gaps** | Tak boleh ada mata rantai "yatim" |
| Mutawatir / tawatur | **Multi-source corroboration** | Butuh ≥N sumber independen utk status "pasti" |
| Kritik matn (anti-syadz) | **Cross-validation / anomaly check** | Tolak yg kontradiktif dgn korpus tepercaya |
| Ijma' | **Consensus verification** | Naikkan status jika sumber-sumber otoritatif sepakat |
| Merkle root pin (proyek ini) | **Immutability + tamper-evidence** | (sudah ada di HUKUM BESI #2) |

### A.5 Rubrik "Eval-Gate" (checklist pass/fail)

Terapkan **sebelum** aplikasi mempublikasi konten bernarasi apa pun (hadits, doa berdalil, tafsir). Gate = fail-closed: jika satu langkah wajib gagal → konten **tidak** dipublikasi sbg "berdalil", maksimal ditandai "perlu verifikasi".

**Langkah 1 — Provenance (WAJIB / hard-fail).** Ada sumber lengkap? kitab/koleksi + nomor + perawi (sahabi) + editor/rujukan. Tanpa ini → REJECT (aturan "tidak ada data yatim").

**Langkah 2 — Sanad check.** Rantai bersambung (muttasil)? Ada perawi bermasalah yang diketahui (via rujukan rijal/jarh-ta'dil)? Jika ada cacat → turunkan grade, jangan klaim "sahih".

**Langkah 3 — Grade resmi.** Ambil grade dari rujukan ahli (mis. penilaian al-Tirmidzi, atau muhaqqiq kontemporer). Simpan enum: `mutawatir | sahih | hasan | da'if | maudhu | mixed/disputed`.

**Langkah 4 — Matn / cross-check.** Isi tidak kontradiktif dgn Qur'an atau hadits lebih kuat? Tidak syadz? Jika kontradiktif → flag `matn_conflict`.

**Langkah 5 — Korroborasi.** Berapa jalur/koleksi independen meriwayatkan? (Bukhari + Muslim + …). Isi field `corroboration_count`. Naikkan confidence bila banyak & independen.

**Langkah 6 — Konsensus / khilaf.** Apakah ada perbedaan penilaian antar ulama? Jika ya → **jangan pilih pemenang**; simpan sebagai metadata `scholarly_notes[]` (menurut X sahih, menurut Y da'if).

**Langkah 7 — Label transparan (WAJIB).** Publikasikan grade + sumber terlihat oleh user; jika `da'if`/`disputed`, tampilkan disclaimer, jangan sembunyikan.

**Gerbang lulus:** L1 pass (hard) DAN grade ∈ {mutawatir, sahih, hasan} DAN tidak ada `matn_conflict` yang belum di-catat → boleh label "berdalil kuat". Selain itu → label sesuai grade + catatan khilaf, tak pernah di-upgrade diam-diam.

---

## B. Latar & sanad 8 doa harian

> Peringatan takhrij: nomor hadits bervariasi antar cetakan kitab; treat nomor sbg indikatif, verifikasi ulang ke kitab primer sebelum "dikunci" di DB. Beberapa lafaz populer di Nusantara ternyata **lemah** — ini justru contoh nyata kenapa Eval-Gate diperlukan.

### (a) Sebelum makan
- **Lafaz sunnah paling kuat:** cukup **"Bismillah"**. Nabi mengajarkan menyebut nama Allah sebelum makan. [10][11]
- **Lafaz populer "Allahumma barik lana fima razaqtana wa qina 'adzaban-nar":** diriwayatkan lewat jalur 'Abdullah bin 'Amr (al-Thabrani dalam *al-Du'a'*, Ibn al-Sunni, Ibn 'Adi). **Bermasalah**: sanadnya memuat perawi **Muhammad bin Abi al-Zu'aizi'ah** yang dikritik (a.l. oleh al-Bukhari). Kesimpulan sumber: boleh diamalkan sebagai doa, **tetapi tidak sah dinisbatkan sebagai sabda Nabi** karena sanadnya bermasalah. [10]
- **Grade:** "Bismillah" = **sahih**; "Allahumma barik lana…" = **da'if** (sbg marfu' kpd Nabi). [10]
- **Metadata Eval-Gate:** kasus L2/L7 — jangan labeli lafaz kedua sbg "hadits sahih dari Nabi".

### (b) Sesudah makan
- **Prinsip berdalil:** Nabi menyukai hamba yang mengucap **tahmid (alhamdulillah)** sesudah makan/minum — diriwayatkan **Muslim**. [10]
- **Lafaz panjang** ("Alhamdulillahilladzi ath'amana wa saqana wa ja'alana muslimin", dll.) punya riwayat tersendiri (Abu Dawud/Tirmidzi) — verifikasi grade per-lafaz saat seeding.
- **Narator:** (untuk prinsip tahmid) riwayat Anas bin Malik. **Grade:** prinsip tahmid **sahih (Muslim)**. [10]

### (c) Sebelum tidur
- **Lafaz:** "Bismika Allahumma amutu wa ahya" (Dengan nama-Mu ya Allah aku mati dan hidup).
- **Narator:** **Hudzaifah bin al-Yaman** (juga jalur lain). **Sumber:** **Sahih al-Bukhari** (kitab ad-Da'awat, sekitar no. 6324). [12][14]
- **Grade:** **sahih (Bukhari)**. [12][14]

### (d) Bangun tidur
- **Lafaz:** "Alhamdulillahilladzi ahyana ba'da ma amatana wa ilaihin-nusyur" (Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami, dan kepada-Nya kebangkitan).
- **Narator:** **Hudzaifah bin al-Yaman**. **Sumber:** **Sahih al-Bukhari** (kitab ad-Da'awat, sekitar no. 6312). [14]
- **Grade:** **sahih (Bukhari)**. [14]

### (e) Masuk kamar mandi / WC
- **Lafaz:** "(Bismillah) Allahumma inni a'udzu bika minal khubutsi wal khaba'its" (Ya Allah aku berlindung kepada-Mu dari setan jantan & betina).
- **Narator:** **Anas bin Malik**. **Sumber:** **Bukhari** (≈142) & **Muslim** (≈375). [13]
- **Grade:** **sahih (muttafaq 'alaih)**. [13] (Tambahan "Bismillah" di awal punya riwayat pendukung.)

### (f) Keluar kamar mandi / WC
- **Lafaz:** **"Ghufranaka"** (aku memohon ampunan-Mu).
- **Narator:** **'Aisyah RA**. **Sumber:** **Abu Dawud (≈30), al-Tirmidzi (≈7), Ibn Majah (≈300)**, juga Ahmad. [13][15]
- **Grade:** **hasan** (al-Tirmidzi: *hasan gharib*; dikuatkan al-Hafizh Abu Thahir). [15]
- **Metadata:** lafaz panjang "Alhamdulillahilladzi adzhaba 'annil adza…" dinilai **lemah** rantainya (al-Bushiri) — jangan gabung diam-diam dgn "Ghufranaka" yang hasan. [15]

### (g) Keluar rumah
- **Lafaz:** "Bismillahi tawakkaltu 'alallah, la hawla wa la quwwata illa billah".
- **Narator:** **Anas bin Malik**. **Sumber:** **Abu Dawud, al-Tirmidzi (≈3348), an-Nasa'i**. [16]
- **Grade:** al-Tirmidzi menilai **hasan**; **al-Albani menilai sahih**. Fadhilah dlm riwayat: dikatakan padanya "engkau diberi petunjuk, dicukupi, & dilindungi", dan setan menjauh. [16] (Perbedaan penilaian hasan vs sahih = metadata, jangan pilih pemenang.)

### (h) Naik kendaraan
- **Lafaz:** "Subhanalladzi sakhkhara lana hadza wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun" — **kutipan Qur'an QS az-Zukhruf 43:13–14**, dipraktikkan Nabi saat safar.
- **Narator/riwayat:** dari **'Ali bin Abi Thalib** (via 'Ali bin Rabi'ah) — **Abu Dawud, al-Tirmidzi, an-Nasa'i** dgn sanad kuat; juga riwayat **Ibn 'Umar dalam Sahih Muslim** (Nabi bertakbir 3x lalu membaca doa ini saat menaiki tunggangan). [17]
- **Grade:** **sahih** (jalur Muslim untuk konteks safar; jalur 'Ali dinilai kuat). [17]

**Ringkas grade (untuk seeding DB):**

| Doa | Narator | Sumber utama | Grade |
|---|---|---|---|
| a. Sebelum makan | — (Bismillah) | Sunnah mutawatir 'amali | sahih |
| a'. "Allahumma barik lana" | 'Abdullah bin 'Amr | Thabrani/Ibn Sunni/Ibn 'Adi | **da'if (marfu')** |
| b. Sesudah makan (tahmid) | Anas | Muslim | sahih |
| c. Sebelum tidur | Hudzaifah | Bukhari ~6324 | sahih |
| d. Bangun tidur | Hudzaifah | Bukhari ~6312 | sahih |
| e. Masuk WC | Anas | Bukhari 142 / Muslim 375 | sahih |
| f. Keluar WC | 'Aisyah | Abu Dawud 30 / Tirmidzi 7 / Ibn Majah 300 | hasan |
| g. Keluar rumah | Anas | Abu Dawud / Tirmidzi 3348 / Nasa'i | hasan (Albani: sahih) |
| h. Naik kendaraan | 'Ali; Ibn 'Umar | Muslim; Abu Dawud/Tirmidzi/Nasa'i | sahih |

---

## C. Doa Qur'ani — catatan

Doa yang **teks-nya bagian dari Al-Qur'an** memiliki status unik: keotentikan teks = keotentikan mushaf itu sendiri (mutawatir), sehingga *tidak perlu* gerbang sanad hadits untuk teksnya — cukup validasi ayat via jalur mushaf (Merkle di proyek ini). Yang divalidasi via hadits hanyalah *praktik pengamalannya*.

- **"Rabbana atina fid-dunya hasanah, wa fil-akhirati hasanah, wa qina 'adzaban-nar"** — **QS al-Baqarah 2:201**. Konteks (siyaq/"asbab" tekstual): ayat 2:200 mencela yang hanya minta dunia; 2:201 memuji mukmin yang minta kebaikan dunia **dan** akhirat. Kata *hasanah* bersifat komprehensif (Tafsir Ibn Katsir: mencakup ilmu, keluarga, kesehatan, iman, rezeki). Diriwayatkan (Anas) bahwa ini doa yang **paling sering** dibaca Nabi. [18]
- **Doa Nabi Yunus: "La ilaha illa Anta, subhanaka, inni kuntu minazh-zhalimin"** — **QS al-Anbiya 21:87**. Konteks: doa Yunus di dalam perut ikan; ia *tidak* menuntut, melainkan menegaskan tauhid + tasbih + pengakuan salah, lalu Allah melapangkannya (21:88). Ada hadits (Tirmidzi) tentang keutamaannya: tidaklah seorang muslim berdoa dengannya kecuali Allah kabulkan. [19]

**Implikasi Eval-Gate untuk doa Qur'ani:** teks → validasi lewat gerbang mushaf (bukan sanad hadits); *fadhilah/konteks pengamalan* → tetap lewat Eval-Gate hadits (Langkah 1–7) dan cantumkan sumber tafsir + status hadits keutamaannya.

---

## D. Sumber

1. [Metodologi Hadits Modern: Kritik Sanad dan Matan (Sujud Journal)](https://ojs.indopublishing.or.id/index.php/sujud/article/view/998)
2. [Al-Jarh Wa Al-Ta'dil — Mohd Arif Nazri (Academia.edu)](https://www.academia.edu/31924477/Al_Jarh_Wa_Al_Tadil_Criticism_and_Praise_Its_Significant_in_the_Science_of_Hadith_Mohd_Arif_Nazri_2)
3. [Hadith terminology — Wikipedia](https://en.wikipedia.org/wiki/Hadith_terminology)
4. [Sanad and Matan Criticism in the Framework of Hadith Studies (ResearchGate)](https://www.researchgate.net/publication/378407830_SANAD_AND_MATAN_CRITICISM_IN_THE_FRAMEWORK_OF_HADITH_STUDIES)
5. [Hadith sciences — Wikipedia](https://en.wikipedia.org/wiki/Hadith_sciences)
6. [Ijma constitutes definitive proof — IslamQA](https://islamqa.info/en/answers/197937)
7. [Ijma — Wikipedia](https://en.wikipedia.org/wiki/Ijma)
8. [An Introduction to the Science of Hadith — Classification (Islamic Awareness)](https://www.islamic-awareness.org/hadith/ulum/asb7)
9. [Difference Between Sahih, Hasan, and Da'if — SeekersGuidance](https://seekersguidance.org/answers/hadith/difference-sahih-hasan-daif-hadith/)
10. [IRSYAD AL-HADITH Siri 575: Doa Sebelum & Selepas Makan — Mufti Wilayah Persekutuan](https://muftiwp.gov.my/ms/artikel/irsyad-al-hadith/5508-irsyad-al-hadith-siri-ke-575-adakah-doa-sebelum-dan-selepas-makan-bersumberkan-hadis-yang-sahih)
11. [Sebelum Makan, Bacalah "Bismillah" — Rumaysho](https://rumaysho.com/1114-sebelum-makan-bacalah-bismillah.html)
12. [Sahih al-Bukhari 6324 — Sunnah.com](https://sunnah.com/bukhari:6324)
13. [Doa Masuk & Keluar Kamar Mandi (CNN Indonesia)](https://www.cnnindonesia.com/edukasi/20230714114914-569-973396/doa-masuk-dan-keluar-kamar-mandi-serta-adabnya-dalam-islam)
14. [Sahih al-Bukhari 6312 — Sunnah.com](https://sunnah.com/bukhari:6312)
15. [Bacaan "Ghufranaka" Apabila Keluar Tandas — SemakHadis](https://semakhadis.com/bacaan-ghufranaka-apabila-keluar-tandas)
16. [Riyad as-Salihin 83 — Sunnah.com](https://sunnah.com/riyadussalihin:83)
17. [Doa Naik Kendaraan Berdasar Ayat Al-Qur'an — NU Jatim](https://jatim.nu.or.id/keislaman/doa-naik-kendaraan-berdasar-ayat-al-qur-an--S4Qnv)
18. [Rabbana Atina Fid Dunya Hasanah — MyIslam](https://myislam.org/rabbana-atina-fid-dunya-hasanah/)
19. [Dua of Yunus (Surah al-Anbiya 21:87) — MyIslam](https://myislam.org/dua-of-yunus/)
20. [Classification and Types of Hadith — Greentech Apps Foundation](https://gtaf.org/blog/classification-types-of-hadith/)

---

*Disclaimer: Dokumen riset teknis untuk membangun gerbang validasi aplikasi, bukan fatwa. Untuk penetapan status hadits final wajib merujuk kitab primer + ahli hadits kontemporer. Perbedaan penilaian antar ulama disimpan sebagai metadata, bukan diputuskan sepihak.*
