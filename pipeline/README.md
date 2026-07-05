# Pipeline — Duplikasi & Verifikasi Mushaf (Fase 1)

Menyalin Al-Quran **harfiah** (114 surah / 6236 ayat, rasm Uthmani, riwayat Hafs) dari
multi-sumber tepercaya, lalu **membuktikan keasliannya** secara kriptografis. Tanpa dependency
eksternal — pakai Node.js ≥ 22.5 (`node:sqlite`, `node:crypto`, `fetch` bawaan).

## Jalankan

```bash
npm run seed        # tarik multi-sumber -> data/raw/*.json + data/normalized.json
npm run verify      # rasm cross-source + SHA-256 + Merkle -> config/integrity.json
npm run build:db    # bangun data/mushaf-core.db (kanonik, read-only) + app-content.json
npm test            # 8 test immutability & tamper-detection
npm run boot:check  # verifikasi boot-time (fail-closed)
# atau sekaligus:
npm run all
```

## Alur & jaminan

```
seed ─▶ verify ─▶ build-core-db ─▶ test ─▶ boot:check
        │              │
        │              └─ mushaf-core.db: trigger tolak UPDATE/DELETE, runtime read-only
        └─ integrity.json: Merkle ROOT di-PIN (boot fail-closed kalau mismatch)
```

**TIER 1 — integritas keras:** `leaf = SHA256(utf8(NFC(text_uthmani)))` untuk 6236 ayat →
Merkle tree → **root hash**. Ubah 1 huruf pun → root berubah → boot menolak (fail-closed).

**TIER 2 — bukti lintas-sumber (rasm berjenjang):**

| Level | Normalisasi | Guna |
|-------|-------------|------|
| L0 | buang semua tanda (harakat/waqf/sajdah) | skeleton byte-level |
| L1 | + samakan dudukan hamza & alef-wasla | Tanzil ≈ QPC |
| L2 | + samakan ejaan panjang **alef** (imla'i vs uthmani) | fold plene/defektif |
| L3 | + buang semua huruf mad (ا و ي) + segmentasi kata | **akar konsonan** |

L3 100% = "satu Quran, satu rasm" terbukti. Sisa beda di L0–L2 = **konvensi encoding
antar-penerbit**, bukan beda teks (jujur, sesuai `04_DATA_SOURCES.md` §C).

## Sumber (provenance)

| Peran | Sumber | Lisensi (audit ulang) |
|-------|--------|------------------------|
| Teks kanonik (disimpan) | Quran.com — QPC Uthmani (teks King Fahd) | bebas pakai; cek komersial |
| Cross-check rasm | Tanzil (via AlQuran Cloud) | CC BY 3.0 |
| Cross-check rasm | Kemenag MSI (via equran.id) | Kemenag — izin redistribusi |
| Terjemahan ID | Kemenag | izin |
| Terjemahan EN | Sahih International | umumnya boleh — cek |

## Hasil build terakhir

- **Merkle root:** `eb13d58a3d2c94684c7d8dadf5ae757321cec3d766d828f9d4b910fc8cba7e56`
- **Cross-source L3:** Tanzil 100% · Kemenag 99.984% (1 konvensi terdokumentasi: 72:16 nun-idgham)
- **Test:** 8/8 lulus · **Boot:** ✅

## Catatan penting

- **`mushaf-core.db` immutable.** Koreksi teks HANYA lewat: re-seed → re-verify → version bump →
  rebuild → review owner. Tidak ada mutasi runtime (Hukum Besi #1).
- Terjemahan ada di `data/app-content.json` **terpisah** dari DB kanonik (pemisahan zona).
- `data/raw/*` = cache mentah tiap sumber untuk audit. Hapus untuk fetch ulang.
