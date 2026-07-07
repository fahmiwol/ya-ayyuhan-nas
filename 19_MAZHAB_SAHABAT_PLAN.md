# 19_MAZHAB_SAHABAT_PLAN — Rencana Modul Mazhab, Kitab, & Catatan Sahabat

> Dicatat 2026-07-07 atas permintaan owner. Ini **RENCANA + kandidat**, BUKAN data final.
> ⚠️ Semua isi WAJIB lewat Eval-Gate sebelum masuk app. Topik ini rawan melantur & sensitif
> (Sunni/Syiah, khilaf antar-mazhab) → **netralitas & provenance mutlak**.

---

## ATURAN VALIDASI (wajib, sebelum satu baris pun ditayangkan)

Turunan HUKUM BESI (CLAUDE.md) + Eval-Gate (12_ISLAMIC_VALIDATION.md):
1. **Provenance wajib** — tiap entri (mazhab, kitab, sahabat, atribusi) punya `sumber + penulis + tahun/edisi + lisensi`. Tak ada data yatim.
2. **Netral teologis** — JANGAN hardcode satu pandangan sebagai "kebenaran". Perbedaan (jumlah mazhab, penilaian tokoh, atribusi kitab) = **metadata `viewpoint`**, tampilkan semua sisi. Sunni ada 4 mazhab masyhur; ADA madzhab lain historis (Zahiri, Awza'i, Thabari) & Syiah (Ja'fari, Zaidi) & Ibadi — sebut sebagai fakta sejarah, bukan menilai benar/salah.
3. **Anti-fabrikasi (jangan melantur)** — atribusi kitab↔penulis, tahun wafat, jumlah riwayat sahabat, dll: **cross-check ≥2 sumber otoritatif** sebelum dinyatakan pasti. Yang belum terverifikasi → status `unreviewed`/`kandidat`, jangan tampil sebagai fakta.
4. **Sumber screenshot owner = SEKUNDER** (jawaban AI/search bersitasi kampus) — TIDAK boleh disalin sebagai fakta; hanya petunjuk awal. Verifikasi ke sumber primer/akademik.
5. **Machine-translation** apa pun → dilabeli, tier tak dinaikkan tanpa tinjauan ahli.
6. **Tinjauan ahli** (ulama/sejarawan) via jalur /tinjau untuk menaikkan status dari kandidat → tervalidasi (mekanisme sudah ada: lab-review pattern / eval-gate RBAC).

---

## MODUL A — Mazhab Fikih (fiqh)

Struktur data per mazhab (kandidat field):
`{ key, nama, pendiri{nama, lahir_wafat_H, wilayah}, manhaj/ushul[], wilayah_sebaran[], ciri, kitab_ushul[], kitab_furu[], viewpoint_notes, sources[] }`

**4 mazhab Sunni masyhur** (kandidat — WAJIB verifikasi tiap klaim):
- **Hanafi** — Abu Hanifah an-Nu'man (w. 150 H, Kufah/Irak). Ciri: ra'y/qiyas + istihsan. Sebaran: Turki, Asia Tengah, anak benua India, Balkan.
- **Maliki** — Malik bin Anas (w. 179 H, Madinah). Ciri: amal ahli Madinah + maslahah mursalah. Sebaran: Afrika Utara & Barat, sebagian Teluk.
- **Syafi'i** — Muhammad bin Idris asy-Syafi'i (w. 204 H). Ciri: kodifikasi ushul fikih (ar-Risalah); hadis+qiyas. Sebaran: Asia Tenggara (termasuk Indonesia), Mesir, Kurdi, Yaman, Afrika Timur.
- **Hanbali** — Ahmad bin Hanbal (w. 241 H). Ciri: kuat ke nash/atsar, hati-hati pada ra'y. Sebaran: Jazirah Arab (Saudi).

> Catatan netral: penomoran "4" = tradisi Sunni yang bertahan; historis ada lebih banyak. Syiah & Ibadi punya fikih sendiri → modul terpisah/metadata, jangan dilebur.

---

## MODUL B — Kitab per Mazhab (perpustakaan; nyambung ke fitur Kitab)

Tiap mazhab punya lapisan kitab lintas generasi. **Kandidat (WAJIB verifikasi atribusi+penulis+tahun sebelum tampil):**
- **Hanafi:** al-Mabsuth (as-Sarakhsi), al-Hidayah (al-Marghinani), Badai' ash-Shanai' (al-Kasani), Radd al-Muhtar/Hasyiyah Ibn Abidin.
- **Maliki:** al-Muwaththa' (Malik — sekaligus kitab hadis), al-Mudawwanah (Sahnun), Bidayat al-Mujtahid (Ibn Rusyd), Mukhtashar Khalil.
- **Syafi'i:** ar-Risalah & al-Umm (asy-Syafi'i), Minhaj ath-Thalibin (an-Nawawi), Tuhfah al-Muhtaj (Ibn Hajar al-Haitami), Fath al-Mu'in.
- **Hanbali:** Musnad Ahmad (hadis), al-Mughni (Ibn Qudamah), Zad al-Mustaqni', ar-Raudh al-Murbi'.

> ⚠️ Daftar di atas = kandidat dari pengetahuan umum — **belum diverifikasi**. Sebelum ingest: cek edisi, penerbit, status domain publik/lisensi (banyak turats domain publik, tapi tahqiq/edisi modern bisa berhak cipta → audit lisensi seperti aset lain).

Struktur data kitab (kandidat): `{ judul, penulis, wafat_penulis_H, mazhab, kategori(ushul/furu/hadis/tafsir), abad, bahasa, lisensi, sumber_teks_url?, status }`.

---

## MODUL C — Catatan Para Sahabat (Sahabah)

Tujuan: profil sahabat + peran periwayatan/keilmuan, tersambung ke isnad hadis (jarh wa ta'dil sudah jadi kerangka Eval-Gate).

Struktur data (kandidat): `{ nama, kunyah, wafat_H, peran[], jml_riwayat?, keutamaan_bersumber[], viewpoint_notes, sources[] }`.

Kandidat tokoh (WAJIB verifikasi angka & klaim):
- Khulafa Rasyidin: Abu Bakr, Umar, Utsman, Ali.
- Perawi terbanyak (klaim umum, verifikasi): Abu Hurairah, Ibn Umar, Anas bin Malik, Aisyah, Ibn Abbas, Jabir, Abu Sa'id al-Khudri.
- Ahli bidang: Ibn Mas'ud & Ubay bin Ka'b & Zaid bin Tsabit (Qur'an/qira'at), Mu'adz bin Jabal (fikih), dll.

> ⚠️ SANGAT sensitif: keutamaan/urutan sahabat & peristiwa fitnah (perang antar-sahabat) = beda tajam Sunni/Syiah. Sikap app: **deskriptif + bersumber + tandai viewpoint**, TIDAK menghakimi, TIDAK memihak. Jumlah riwayat (mis. "Abu Hurairah 5374") = klaim sumber, cantumkan sumbernya, jangan sebut angka telanjang.

---

## RENCANA EKSEKUSI (saat digarap nanti)

1. Riset bersumber (agen) → kumpulkan atribusi terverifikasi ≥2 sumber/entri → dokumen ber-provenance.
2. Seed data (mazhab.json, kitab per-mazhab, sahabat.json) dengan Eval-Gate tier + status kandidat/unreviewed.
3. UI: masuk ke fitur **Belajar** (mazhab, sahabat) & **Kitab** (perpustakaan per-mazhab). Netralitas + tombol sumber di tiap kartu.
4. Jalur tinjauan ahli untuk naikkan status.
5. **Opsional Lab:** kitab & manhaj mazhab bisa jadi bahan tadabbur "metode inferensi hukum" (ushul fikih = sistem inferензi ber-aturan — analogi rule engine / logika) — TETAP tier interpretasi, terpisah dari data faktual mazhab.

**Status:** 📝 DICATAT (belum dibangun). Prioritas & urutan menyusul instruksi owner.
