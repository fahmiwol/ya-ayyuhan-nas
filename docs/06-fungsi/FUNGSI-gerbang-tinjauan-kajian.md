---
id: FUNGSI-gerbang-tinjauan-kajian
jenis: fungsi
judul: Gerbang tinjauan kajian sebelum terbit
status: draft
cluster: inti
terkait: [PRD-001, EPIC-002]
dibuat: 2026-11-12
diubah: 2026-11-13
---

# Fungsi — Gerbang tinjauan kajian sebelum terbit

## Tujuan (satu kalimat)
Memastikan tidak ada kajian Lab yang terbit sebelum lolos pemeriksaan mesin, tinjauan AI independen,
dan persetujuan manusia, sehingga setiap kajian tetap interpretasi rekayasa beratribusi, bukan tafsir.

## Input
Satu berkas kajian `apps/web/public/data/lab/<id>.json` berstatus `draft` + entri `index.json`, di cabang `kajian/…`.

## Output
- **G1** keluaran perintah (exit code) · **G2** kartu tinjauan (LULUS / REVISI + alasan per butir) ·
  **G3** persetujuan Fahmi tercatat (PR disetujui atau pesan bertanggal).
- Hanya bila ketiganya lolos: `status: "published"`; `review` tetap `pending` ("menunggu tinjauan ahli").

## Tiga gerbang
**G1 · Mesin (fail-closed, harus exit 0)**
1. `node pipeline/lab-validate.mjs` — skema, sumber, rujukan ayat valid di mushaf kanonik, riwayat.
2. Tanzih-lint: tidak ada sorotan baru, atau setiap sorotan dijawab dengan "CATATAN TANZIH" di kajian.
3. `node pipeline/test-integrity.mjs` — 6.236 ayat, Merkle root cocok.
4. (EPIC-002 S2) tidak ada teks Arab panjang tersalin; `review` hanya `pending` tanpa atribusi manusia.

**G2 · Peninjau AI independen (bukan penulis) — kartu rambu**
| # | Butir | Lolos bila |
|---|---|---|
| 1 | Tanzih | Allah (Dzat/Sifat/Asma'ul Husna) tidak dijadikan komponen, peran, properti, atau analogi |
| 2 | Ghaib | tema akhirat/ruh/malaikat dibaca deskriptif dari tafsir bersumber, ada "CATATAN GHAIB", analogi bertanda `bounded` |
| 3 | Grounding | `sourced_meaning` ringkas dari tafsir di data app + sumber tercantum; asbabun nuzul dicek bila ada |
| 4 | Tak menyalahi zahir | lensa = lapisan di atas makna bersumber, tidak menggantikannya |
| 5 | Bukan maksud tunggal | ditulis "salah satu pembacaan", tidak mengklaim maksud Ilahi |
| 6 | Tanpa hukum/fatwa | tidak menetapkan hukum; netral mazhab; khilaf ditandai |
| 7 | Sains | "resonansi struktural, bukan mukjizat numerik"; sains = analogi, bukan bukti |
| 8 | Bahasa pelunakan | "hipotesis/analogi/diinspirasi pola pembacaan ayat", bukan "diturunkan dari ayat" |
| 9 | Mutu lensa | lensa relevan, `analogy` teknis yang bisa dipakai, tidak berlebihan |
| 10 | Bahasa Lazim | kalimat pendek, istilah konsisten (skill `bahasa-lazim`) |

Vonis: semua lolos → LULUS. Ada yang gagal → REVISI dengan kutipan baris. Maksimal satu putaran revisi.

**G3 · Fahmi** membaca ringkasan + kartu G2 + draf, lalu setuju atau minta revisi. Agen tidak pernah
menganggap diam sebagai setuju.

## Jalur hati-hati (ayat di `pipeline/lab-hati-hati.json`)
Tambahan wajib di atas kartu 10 butir; satu saja GAGAL = REVISI, dua kali REVISI = tidak diajukan.
| # | Butir wajib | Lolos bila |
|---|---|---|
| H1 | Tanzih eksplisit | ada CATATAN TANZIH; setiap kalimat lensa diperiksa: Allah tidak menjadi subjek, objek, atau padanan analogi mana pun |
| H2 | Ghaib deskriptif | ada CATATAN GHAIB bila menyentuh ghaib; tidak ada detail di luar tafsir bersumber; tidak ada "mekanisme" ghaib |
| H3 | Fiqih | tidak ada kalimat yang bisa dibaca sebagai hukum, anjuran ibadah, atau fatwa |
| H4 | Bukti ganda | `sourced_meaning` dicek kalimat per kalimat terhadap Kemenag DAN Jalalain |
| H5 | Layak dikaji | peninjau boleh menyarankan `lewati-lensa` bila analogi rekayasa tidak bisa dibuat tanpa melanggar H1–H3 |
Penulis opus/high; peninjau G2 model lain dari penulis, effort high. G3 Fahmi per kajian, tidak pernah dalam batch.

## Dependensi
Skill `tadabbur-lab`; data mushaf + tafsir di `apps/web/public/data`; GitHub (PR) setelah repo dibuka dari arsip.

## Error & batas
- Draf gagal G1/G2 dua kali → "butuh manusia", tidak diajukan.
- Gerbang ini **bukan tinjauan ahli**. Status `endorsed` hanya lewat `pipeline/lab-review.mjs` oleh
  peninjau nyata (ulama/mufassir/akademisi) dengan atribusi. AI dan Fahmi-sebagai-penyetuju tidak mengisi `endorsed`.

## Lokasi kode
`pipeline/lab-validate.mjs`, `pipeline/test-integrity.mjs`, (baru) `pipeline/lab-next.mjs`; kartu G2 di
`.agents/skills/tadabbur-lab/`.

## Test
EPIC-002 S2 (tes merah dulu). Kajian harian pertama = uji ujung ke ujung.

## Contoh pemakaian
```bash
node pipeline/lab-validate.mjs && node pipeline/test-integrity.mjs   # G1
# G2: sesi peninjau membaca draf + kartu di atas, menulis kartu ke deskripsi PR
# G3: Fahmi menyetujui PR → status published → rilis data → curl kajian di live
```
