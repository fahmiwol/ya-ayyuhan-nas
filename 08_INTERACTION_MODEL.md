# 08 — Model Interaksi (Cursor Modes) & Tilawah-Eval

> Sumber ide: **owner (Fahmi)**, sesi 2026-07-06. Dokumen ini menangkap SEMUA masukan
> agar tidak menguap (continuity). Status: **DESIGN LOCKED**, implementasi bertahap
> (lihat pemetaan fase di §7 & `06_ROADMAP.md`).

---

## 1. Konsep inti — interaksi berbasis MODE

Aplikasi punya **mode aktif**. **Kursor = alat/mode yang sedang dipakai.** Ganti kursor →
ganti perilaku hover/klik pada kata & ayat. Hanya **satu mode aktif** dalam satu waktu.
Default = **Baca**. Setiap mode punya: (a) ikon kursor sendiri (desktop), (b) perilaku
hover/klik, (c) padanan perilaku di **mobile** (touch tidak punya hover → §6).

Prinsip: **non-destruktif** (mode tidak mengubah teks kanonik), **auditable**, dapat
diakses via mouse + touch + keyboard.

---

## 2. Katalog Mode Kursor

> Legenda status: ✅ sudah ada sebagian · 🔨 buildable sekarang (Fase 1.x) · 🎙️ Fase 3 (AI/audio) · 🧠 Fase 4 (KG/chain)

### 2A. Tiga mode inti (ide owner)

| Mode | Kursor | Desktop (hover/klik) | Mobile | Data | Fase |
|------|--------|----------------------|--------|------|------|
| **Baca** (default) | pointer biasa | tidak ada interaksi khusus; hanya baca & scroll | scroll biasa | — | 🔨 |
| **Identitas** | **kaca pembesar (magnifier)** | hover kata/ayat → elemen ter-*highlight* (yang punya identitas); klik → **modal SLIDE dari samping** (buka/tutup) berisi identitas: hash (token-ID), bukti inklusi Merkle, info kata (akar/translit), anotasi | tap kata/ayat → **bottom-sheet** | `proofs.json`, words, annotations (sudah ada) | 🔨 |
| **Tilawah (Qari)** | **senter / flashlight** | klik ayat → **Qari membacakan** ayat itu (audio); "sorotan senter" = ayat yang dibacakan | tap ayat → putar | audio EveryAyah/R2 (sudah ada router qari) | ✅🔨 |

### 2B. Mode Latih — Tilawah-Eval / "Karaoke" (ide owner, Fase 3)

| Mode | Kursor | Perilaku | Data | Fase |
|------|--------|----------|------|------|
| **Latih Baca** | mikrofon | Nyalakan mic. Ayat aktif ditampilkan **gaya karaoke** (kata ter-highlight mengikuti bacaan). **AI mendengarkan** bacaan user → **kasih nilai** + **feedback**: bagian mana kurang tepat (kata salah, makhraj, madd, ghunnah…). User bisa **iterasi & optimasi**. | STT (Whisper/Wav2Vec2) + forced align (MFA) + MDD | 🎙️ Fase 3 |

Detail teknis & alur → §4.

### 2C. Tambahan yang direkomendasikan ("adapalagi?")

| Mode | Kursor | Perilaku | Fase |
|------|--------|----------|------|
| **Tafsir/Anotasi** | pena / kitab | klik ayat/kata → panel tafsir + remark + note (lapisan anotasi sudah ada; multi-tafsir = Fase 2) | 🔨→📚 |
| **Leksikon kata** | kamus | hover kata → tooltip akar (r-b-b…), morfologi, transliterasi, arti | 🔨 (punya word-by-word) |
| **Terjemah/Bandingkan** | globe | hover → tooltip terjemah; klik → bandingkan terjemah multi-sumber berdampingan | 🔨 |
| **Tandai/Bookmark** | bintang/pita | klik ayat → simpan bookmark + catatan pribadi (zona USER, terpisah dari kanonik) | 🔨 |
| **Salin/Bagikan** | rantai/link | klik → salin teks ayat + **hash identitas** + tautan; share | 🔨 |
| **Hafalan/Muraja'ah** | mata tertutup | sembunyikan teks bertahap (per kata/ayat) untuk uji hafalan; ketuk untuk intip | 🔨→🎙️ |
| **Tajwid (warna)** | kuas | highlight hukum tajwid berwarna (idgham/ikhfa/madd/qalqalah…) | 🎙️ (butuh data tajwid) |
| **Tema/Akar (graph)** | jaring | klik kata → tampilkan semua ayat se-akar / se-tema (knowledge graph) | 🧠 Fase 4 |
| **Mint (arsip)** | stempel/segel | klik ayat → aksi *mint* identitas ayat ke chain (identitas kriptografis sudah siap) | 🧠 lanjutan |

---

## 3. Panel Identitas — perilaku UI

- **Desktop:** **slide-in dari samping kanan** (drawer), lebar ~380–440px, **non-blocking**
  (teks tetap terbaca), tombol **buka/tutup**, bisa di-*pin*.
- **Mobile:** **bottom-sheet** yang bisa **di-drag** (½ layar → full), tutup dengan swipe-down.
- **Isi:** identitas ayat/kata → hash (token-ID) · bukti inklusi Merkle (verifikasi di browser) ·
  info kata (akar/translit/arti) · anotasi/tafsir · aksi (salin, bagikan, mint).
- Highlight elemen aktif tetap terlihat selama panel terbuka.

---

## 4. Mode Tilawah-Eval (Latih Baca) — spesifikasi (Fase 3)

**Alur:**
```
[Mic ON] → ayat aktif tampil KARAOKE (kata mengikuti bacaan)
   → rekam bacaan user
   → STT (Whisper/Wav2Vec2 fine-tuned Quran)
   → forced-align ke teks kanonik (MFA) — cocokkan per kata/fonem
   → MDD (deteksi kesalahan) + fitur tajwid (madd/ghunnah/qalqalah…)
   → NILAI + FEEDBACK per kata: benar / kurang tepat + saran + contoh audio Qari
   → user ITERASI (ulangi) → OPTIMASI
```

**Yang realistis dideteksi:** kata salah / lompat ayat (tinggi), makhraj kasar (sedang),
madd/durasi (sedang-tinggi), ghunnah/qalqalah (sedang), idgham/ikhfa halus (sulit).
→ **Framing: coach + feedback, bukan hakim mutlak.** Approksimasi *talaqqi*, bukan pengganti guru.

**Privasi:** mic hanya saat mode aktif + **izin eksplisit**; proses **self-hosted** (microservice
Python, bukan API komersial); audio user = zona USER, tidak dicampur teks kanonik.

**Skema data (Fase 3):**
`RECITATION_ATTEMPT(user, ayah_ref, audio, transcript, score, created_at)`
`TAJWID_FEEDBACK(attempt, rule, word_position, verdict, note)`

---

## 5. Responsif / Mobile — WAJIB diperhatikan

> Owner menekankan: **perhatikan responsif saat di mobile.**

- **Touch tidak punya hover** → kursor kustom **hanya desktop**. Di mobile, mode dipilih via
  **toolbar/mode-switcher** (tap pilih mode → tap elemen menjalankan aksi mode itu).
- **Indikator mode** selalu tampil (chip/ikon aktif) supaya user tahu mode sekarang.
- **Modal samping → bottom-sheet** (drag & swipe-to-dismiss).
- **Sidebar daftar surah → drawer** (hamburger) di mobile.
- **Kontrol reader** (terjemah, qari, font, per-kata) → **collapse** ke sheet/menu, bukan bar penuh.
- **Target sentuh ≥ 44px**; teks Arab tetap *scalable*; word-by-word **wrap** rapi.
- Uji di 3 breakpoint: mobile (≤480), tablet (≤768), desktop. Layout **mobile-first**.

---

## 6. Mode Switcher (UI kontrol mode)

- **Dock mode** mengambang (kiri di desktop / bawah di mobile) berisi ikon tiap mode.
- **Keyboard shortcut** per mode (mis. R=baca, I=identitas, Q=tilawah, L=latih).
- Saat mode aktif: **ikon kursor berubah** (desktop) + chip mode menyala.
- Ganti mode = instan, tidak reload.

---

## 7. Pemetaan ke Roadmap (fase & prioritas)

| Kelompok | Mode | Fase | Catatan |
|----------|------|------|---------|
| **Sekarang (Fase 1.x)** | Baca, Identitas (magnifier+side panel), Tilawah (senter+audio), Leksikon, Anotasi, Terjemah/Bandingkan, Bookmark, Salin/Bagikan, **responsive** | 1.8–1.9 | data sudah ada (proofs, words, annotations, audio) |
| **Fase 2** | Tafsir mode → penuh multi-ulama | 2 | butuh corpus tafsir |
| **Fase 3** | **Latih Baca (mic+AI eval)**, Tajwid warna, Hafalan | 3 | butuh STT/MFA microservice |
| **Fase 4 / lanjutan** | Tema/Akar (graph), **Mint** ke chain | 4 | KG + integrasi chain |

---

## 8. Prinsip desain (dijaga)

1. Satu mode aktif; default **Baca**; ganti mode non-destruktif & instan.
2. Teks kanonik **tak pernah** berubah oleh mode apa pun (Hukum Besi #1).
3. Aksesibel: mouse + touch + keyboard + screen-reader; kontras & target sentuh cukup.
4. Mobile-first & responsif (wajib).
5. Semua aksi yang menampilkan sumber/identitas = **auditable** (hash, provenance).
6. Fitur AI (Latih Baca) = **coach**, jujur soal ketidakpastian, bukan hakim.
