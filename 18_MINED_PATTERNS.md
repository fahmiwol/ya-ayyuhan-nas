# 18_MINED_PATTERNS — Usulan Pola (semi-otomatis, WAJIB ditinjau)

> Dihasilkan `pipeline/lab-mine.mjs` dari 33 kajian. Ini USULAN mentah — bukan prinsip.
> Peninjau (skill tadabbur-lab) memutуskan mana yang layak jadi prinsip di synthesis.json.

## A. Konsep rekayasa berulang lintas kajian (≥2)
Konsep yang muncul di banyak ayat berbeda = kandidat kuat pola struktural. Bandingkan dgn prinsip eksisting; yang tebal-sebaran tapi belum jadi prinsip = usulan.

| konsep | #kajian | kajian |
|---|---|---|
| audit | 8 | asr-103-1-3, baqarah-2-282, fussilat-41-20-22, hasyr-59-18, mulk-67-3-4, nisa-4-135, qaf-50-17-18, zalzalah-99-1-8 |
| alignm | 8 | asr-103-1-3, fatihah-1-1-7, hadid-57-25, mizan-55-5-9, mujadilah-58-11, muminun-23-12-14, nur-24-35, shams-91-7-10 |
| bia | 6 | ankabut-29-20, baqarah-2-143, munafiqun-63-9-10, nisa-4-135, rum-30-41, zalzalah-99-1-8 |
| drift | 6 | asr-103-1-3, fatihah-1-1-7, nahl-16-65, rum-30-41, shams-91-7-10, zalzalah-99-1-8 |
| verifikasi | 5 | anbiya-21-30, fussilat-41-53, hujurat-49-6, kun-36-82, nur-24-4 |
| constraint | 4 | asr-103-1-3, furqan-25-67, mizan-55-5-9, muminun-23-12-14 |
| feedback | 4 | asr-103-1-3, mizan-55-5-9, munafiqun-63-9-10, rum-30-41 |
| redundansi | 4 | baqarah-2-282, fussilat-41-20-22, qaf-50-17-18, zumar-39-6 |
| threshold | 4 | baqarah-2-282, nur-24-35, nur-24-4, zalzalah-99-1-8 |
| homeostasi | 4 | dzariyat-51-49, furqan-25-67, mizan-55-5-9, shams-91-7-10 |
| invari | 4 | furqan-25-67, mizan-55-5-9, qaf-50-17-18, rum-30-41 |
| pipeline | 4 | hujurat-49-6, iqra-96-1-5, muminun-23-12-14, nur-24-35 |
| substrate | 3 | anbiya-21-30, nahl-16-65, zalzalah-99-1-8 |
| provenance | 3 | ankabut-29-20, fussilat-41-20-22, iqra-96-1-5 |
| retrieval | 3 | ankabut-29-20, hujurat-49-6, nahl-16-43 |
| memory | 3 | baqarah-2-282, hasyr-59-18, mujadilah-58-11 |
| attestat | 3 | baqarah-2-282, fussilat-41-20-22, zalzalah-99-1-8 |
| logg | 3 | fussilat-41-20-22, hasyr-59-18, qaf-50-17-18 |
| log | 3 | fussilat-41-20-22, qaf-50-17-18, zalzalah-99-1-8 |
| rout | 3 | nahl-16-43, nahl-16-68-69, zumar-39-9 |
| verifikasinya | 2 | anbiya-21-30, fussilat-41-53 |
| equilibrium | 2 | baqarah-2-143, mizan-55-5-9 |
| ledger | 2 | baqarah-2-282, zalzalah-99-1-8 |
| adversarial | 2 | dzariyat-51-49, mulk-67-3-4 |
| verifier | 2 | dzariyat-51-49, nisa-4-135 |
| replay | 2 | fussilat-41-20-22, zalzalah-99-1-8 |
| observability | 2 | fussilat-41-53, hasyr-59-18 |
| reflect | 2 | hasyr-59-18, nur-24-35 |
| verify | 2 | hujurat-49-6, zumar-39-9 |
| ground | 2 | hujurat-49-6, zumar-39-9 |
| emergen | 2 | kun-36-82, muminun-23-12-14 |
| deterministic | 2 | mizan-55-5-9, zalzalah-99-1-8 |
| sandbox | 2 | muminun-23-12-14, zumar-39-6 |

## B. Istilah/konsep berulang ≥3 kajian (yang BELUM tercakup prinsip)

| term | #kajian | kajian |
|---|---|---|
| rekayasa | 12 | asr-103-1-3, baqarah-2-143, dzariyat-51-49, fussilat-41-53, hasyr-59-18, iqra-96-1-5, kun-36-82, maidah-5-1, mizan-55-5-9, muminun-23-12-14, nur-24-35, qaf-50-17-18 |
| manusia | 11 | asr-103-1-3, fatihah-1-1-7, fussilat-41-53, hasyr-59-18, kun-36-82, mujadilah-58-11, muminun-23-12-14, munafiqun-63-9-10, nahl-16-43, nahl-16-68-69, rum-30-41 |
| pelajaran | 8 | anbiya-21-30, dzariyat-51-49, hadid-57-25, nahl-16-65, nahl-16-68-69, nur-24-35, rum-30-41, zumar-39-9 |
| prinsip | 8 | dzariyat-51-49, furqan-25-67, hadid-57-25, hasyr-59-18, nahl-16-65, nur-24-4, zalzalah-99-1-8, zumar-39-6 |
| dibaca | 7 | baqarah-2-143, dzariyat-51-49, fatihah-1-1-7, maidah-5-1, muminun-23-12-14, nur-24-35, qaf-50-17-18 |
| iʿtibār | 5 | anbiya-21-30, baqarah-2-282, fatihah-1-1-7, nahl-16-68-69, rum-30-41 |
| struktur | 5 | ankabut-29-20, dzariyat-51-49, furqan-25-67, mujadilah-58-11, mulk-67-3-4 |
| protokol | 5 | baqarah-2-282, fatihah-1-1-7, fussilat-41-53, maidah-5-1, mujadilah-58-11 |
| desain | 5 | baqarah-2-282, fatihah-1-1-7, hadid-57-25, nur-24-4, rum-30-41 |
| menutup | 5 | dzariyat-51-49, muminun-23-12-14, nahl-16-68-69, rum-30-41, zalzalah-99-1-8 |
| modern | 4 | ankabut-29-20, baqarah-2-282, nahl-16-43, qaf-50-17-18 |
| ketika | 4 | baqarah-2-143, nahl-16-43, nahl-16-68-69, nisa-4-135 |
| memberi | 4 | baqarah-2-143, kun-36-82, mujadilah-58-11, rum-30-41 |
| qisṭ | 4 | baqarah-2-282, hadid-57-25, mizan-55-5-9, nisa-4-135 |
| tadhakkur | 4 | baqarah-2-282, dzariyat-51-49, fatihah-1-1-7, iqra-96-1-5 |
| banyak | 4 | dzariyat-51-49, furqan-25-67, kun-36-82, zumar-39-9 |
| taʿaqqul | 4 | fatihah-1-1-7, hujurat-49-6, iqra-96-1-5, zumar-39-9 |
| sekaligus | 4 | kun-36-82, mizan-55-5-9, nur-24-4, shams-91-7-10 |
| melengkapi | 4 | maidah-5-1, munafiqun-63-9-10, nur-24-4, zumar-39-6 |
| tentang | 3 | anbiya-21-30, ankabut-29-20, fussilat-41-20-22 |
| pertanyaan | 3 | anbiya-21-30, nahl-16-43, zumar-39-9 |
| rekayasanya | 3 | anbiya-21-30, nahl-16-65, zumar-39-6 |
| menegaskan | 3 | asr-103-1-3, nur-24-35, qaf-50-17-18 |
| termasuk | 3 | baqarah-2-143, baqarah-2-282, zumar-39-6 |
| teknis | 3 | baqarah-2-282, furqan-25-67, nahl-16-43 |
| logika | 3 | dzariyat-51-49, fussilat-41-20-22, mizan-55-5-9 |
| desainnya | 3 | dzariyat-51-49, munafiqun-63-9-10, nahl-16-68-69 |
| memuat | 3 | fatihah-1-1-7, hujurat-49-6, mizan-55-5-9 |
| dinamai | 3 | furqan-25-67, nahl-16-68-69, nisa-4-135 |
| keduanya | 3 | furqan-25-67, hadid-57-25, mizan-55-5-9 |
| blueprint | 3 | fussilat-41-20-22, iqra-96-1-5, nisa-4-135 |
| mengikat | 3 | hadid-57-25, maidah-5-1, qaf-50-17-18 |
| tafaqquh | 3 | iqra-96-1-5, mujadilah-58-11, nahl-16-43 |
| menariknya | 3 | mizan-55-5-9, nisa-4-135, nur-24-35 |
| terbaik | 3 | nahl-16-68-69, qaf-50-17-18, rum-30-41 |

## C. Ringkasan
- Kajian dibaca: 33
- Analogy berulang (≥2): 33
- Term baru berulang (≥3, di luar prinsip): 35
- Prinsip eksisting: 23 · Kerangka: 3

> Langkah peninjau: pilih baris A/B yang menyiratkan POLA desain lintas-ayat yang belum jadi prinsip → tulis prinsip (≥2 evidence) via skill.
