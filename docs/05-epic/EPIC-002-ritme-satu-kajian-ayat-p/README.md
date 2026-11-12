---
id: EPIC-002
jenis: epic
judul: Ritme satu kajian ayat per hari
status: draft
cluster: inti
terkait: [PRD-001, FUNGSI-gerbang-tinjauan-kajian]
dibuat: 2026-11-12
diubah: 2026-11-13
---

# EPIC-002 · Ritme satu kajian ayat per hari

## Tujuan
Setiap hari satu kajian baru dibuat dengan metode yang sekarang (skill `tadabbur-lab`, skema
`lab-study-v2`), lalu terbit **hanya** setelah lolos gerbang tinjauan. Tidak ada metode baru; yang baru
hanya ritme, urutan pilih ayat, dan gerbangnya.

## PRD sumber
PRD-001 · gerbang: `FUNGSI-gerbang-tinjauan-kajian`.

## Alur satu hari
```
05:30 WIB (usulan)  pilih ayat ─► ground ─► tulis draf ─► G1 mesin ─► G2 peninjau AI ─► PR draf
                                                                                   │
                         Fahmi baca kartu + draf ──► G3 setuju ─► terbit (rilis data) ─► verifikasi live ─► catat
                                                 └─► minta revisi ─► penulis revisi (maks. 1x) ─► G1 ─► G2 ─► G3
```

1. **Cek antrean.** Bila ≥3 draf menunggu G3, hari ini **tidak** menulis draf baru (catat "lewati: antrean penuh").
2. **Pilih ayat** (`pipeline/lab-next.mjs`, deterministik, bisa diulang):
   1. prinsip di `synthesis.json` yang baru punya 1 bukti (`note_single`) → ayat kandidat penguatnya (13 Nov: tidak ada);
   2. selain itu, tema backlog `15_TADABBUR_BACKLOG.md` dengan persentase selesai terendah (lihat `coverage.json`);
   3. di tema itu, kandidat `[ ]` pertama yang belum tersentuh kajian lain.
   Kandidat = sinyal awal. Penulis boleh menolak kandidat dengan alasan tertulis lalu ambil berikutnya.
3. **Ground dulu** (wajib, skill langkah 2): baca terjemahan + tafsir Kemenag/Jalalain dari data app, dan
   asbabun nuzul bila ada. Tanpa grounding → berhenti.
4. **Tulis draf** di cabang `kajian/<YYYY-MM-DD>-<id>`: `lab-scaffold.mjs` lalu isi skema `lab-study-v2`
   dengan `status: "draft"`, `history` v1, entri `index.json`. Ikuti semua rambu skill (tanzih, ghaib,
   rambu isyari 6, bahasa pelunakan). Tulis langsung oleh satu penulis (konsistensi suara, sesuai skill).
5. **G1–G2** sesuai fungsi gerbang. Gagal → perbaiki sekali; gagal lagi → draf ditandai "butuh manusia", tidak diajukan.
6. **Ajukan**: PR berisi ringkasan (ref ayat, inti `inference`, lensa yang dipakai) + kartu G2.
7. **G3 Fahmi** setuju → `status: "published"`, `review` tetap `pending` → bangkitkan ulang `coverage`,
   `lab-graph`, `lab-corpus` → `lab-validate` → merge → rilis data (DEPLOY.md) → cek kajian 200 di live.
8. **Catat**: backlog `[x]`, `07_EPISODIC.md` (nomor F1.x berikutnya), `CHANGELOG.md`.

**Mingguan (Jumat):** `node pipeline/lab-mine.mjs` → `18_MINED_PATTERNS.md` (usulan). Fahmi memilih pola
yang layak jadi prinsip (≥2 bukti); agen tidak menulis prinsip baru tanpa pilihan itu.

## Pembagian model (skill `router-model-agen`)
| Peran | Model | Alasan |
|---|---|---|
| Penulis kajian | opus / high | domain agama, adab dan batas tanzih; kualitas suara |
| Peninjau G2 (bukan penulis) | opus / medium | gerbang mutu konten sensitif |
| Bangkitkan ulang turunan, catatan | haiku / low | mekanis |

## Tempat jalan
Usulan awal: tugas terjadwal di aplikasi Claude (laptop) karena tidak butuh infra baru. Laptop mati =
hari itu dilewati, tidak menumpuk. Pindah ke Bmax/antrean VPS (MiganExp D-049) bila ritme sudah stabil.
**Dipasang hanya setelah Fahmi setuju** (PRD-001 pertanyaan 3).

## Story
| # | Story | Uji terima |
|---|---|---|
| S1 | `pipeline/lab-next.mjs` (urutan di atas) | dua kali jalan → kandidat sama; tes dengan backlog contoh |
| S2 | G1 tambahan di `lab-validate`: tolak teks Arab panjang di data Lab (indikasi ayat tersalin), tolak `review` selain `pending` bila tidak ada atribusi manusia | tes merah dengan berkas contoh, lalu hijau |
| S3 | Templat kartu G2 + prompt peninjau di `.agents/skills/tadabbur-lab/` | dipakai di kajian harian pertama |
| S4 | Kajian harian pertama lewat G1–G3 dan live | bukti per gerbang di PR + `curl` live |
| S5 | Tugas terjadwal (setelah izin) | satu jalan terjadwal menghasilkan PR draf |

## Definition of Done
Kajian harian pertama terbit lewat G1–G3 dan terverifikasi live; tugas terjadwal (bila disetujui) menghasilkan
satu PR draf; skill `tadabbur-lab` diperbarui (langkah deploy lama `sidix-vps` diganti DEPLOY.md);
CHANGELOG + `07_EPISODIC.md` + `brain_learn`.
