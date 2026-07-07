# 18_MINED_PATTERNS — Usulan Pola (semi-otomatis, WAJIB ditinjau)

> Dihasilkan `pipeline/lab-mine.mjs` dari 49 kajian. Ini USULAN mentah — bukan prinsip.
> Peninjau (skill tadabbur-lab) memutуskan mana yang layak jadi prinsip di synthesis.json.

## A. Konsep rekayasa berulang lintas kajian (≥2)
Konsep yang muncul di banyak ayat berbeda = kandidat kuat pola struktural. Bandingkan dgn prinsip eksisting; yang tebal-sebaran tapi belum jadi prinsip = usulan.

| konsep | #kajian | kajian |
|---|---|---|
| verifikasi | 11 | anam-6-99, anbiya-21-30, baqarah-2-170, fussilat-41-53, hujurat-49-12, hujurat-49-6, kun-36-82, nur-24-4, rahman-55-33, yasin-36-38-40, yunus-10-36 |
| audit | 11 | asr-103-1-3, baqarah-2-170, baqarah-2-282, fussilat-41-20-22, hasyr-59-18, isra-17-36, mulk-67-3-4, nisa-4-135, qaf-50-17-18, waqiah-56-68-70, zalzalah-99-1-8 |
| bia | 10 | ankabut-29-20, baqarah-2-143, baqarah-2-170, hujurat-49-12, munafiqun-63-9-10, nisa-4-135, nur-24-45, rum-30-41, waqiah-56-68-70, zalzalah-99-1-8 |
| alignm | 9 | ali-imran-3-190-191, asr-103-1-3, fatihah-1-1-7, hadid-57-25, mizan-55-5-9, mujadilah-58-11, muminun-23-12-14, nur-24-35, shams-91-7-10 |
| invari | 8 | anbiya-21-33, furqan-25-53, furqan-25-67, mizan-55-5-9, nur-24-45, qaf-50-17-18, rum-30-41, yasin-36-38-40 |
| provenance | 7 | ankabut-29-20, baqarah-2-170, furqan-25-53, fussilat-41-20-22, iqra-96-1-5, isra-17-36, waqiah-56-68-70 |
| drift | 6 | asr-103-1-3, fatihah-1-1-7, nahl-16-65, rum-30-41, shams-91-7-10, zalzalah-99-1-8 |
| threshold | 6 | baqarah-2-282, nur-24-35, nur-24-4, rahman-55-33, yunus-10-36, zalzalah-99-1-8 |
| pipeline | 5 | anam-6-99, hujurat-49-6, iqra-96-1-5, muminun-23-12-14, nur-24-35 |
| substrate | 5 | anbiya-21-30, nahl-16-65, nur-24-45, waqiah-56-68-70, zalzalah-99-1-8 |
| constraint | 5 | asr-103-1-3, furqan-25-67, mizan-55-5-9, muminun-23-12-14, yasin-36-38-40 |
| memory | 5 | baqarah-2-170, baqarah-2-282, hasyr-59-18, isra-17-36, mujadilah-58-11 |
| homeostasi | 5 | dzariyat-51-49, furqan-25-67, hijr-15-19, mizan-55-5-9, shams-91-7-10 |
| ground | 4 | ali-imran-3-190-191, baqarah-2-170, hujurat-49-6, zumar-39-9 |
| feedback | 4 | asr-103-1-3, mizan-55-5-9, munafiqun-63-9-10, rum-30-41 |
| verify | 4 | baqarah-2-170, hujurat-49-6, isra-17-36, zumar-39-9 |
| redundansi | 4 | baqarah-2-282, fussilat-41-20-22, qaf-50-17-18, zumar-39-6 |
| sandbox | 4 | furqan-25-53, muminun-23-12-14, rahman-55-33, zumar-39-6 |
| log | 4 | fussilat-41-20-22, isra-17-36, qaf-50-17-18, zalzalah-99-1-8 |
| reason | 3 | ali-imran-3-190-191, nisa-4-135, waqiah-56-68-70 |
| deterministic | 3 | anbiya-21-33, mizan-55-5-9, zalzalah-99-1-8 |
| retrieval | 3 | ankabut-29-20, hujurat-49-6, nahl-16-43 |
| equilibrium | 3 | baqarah-2-143, mizan-55-5-9, waqiah-56-68-70 |
| attestat | 3 | baqarah-2-282, fussilat-41-20-22, zalzalah-99-1-8 |
| logg | 3 | fussilat-41-20-22, hasyr-59-18, qaf-50-17-18 |
| rout | 3 | nahl-16-43, nahl-16-68-69, zumar-39-9 |
| redundan | 2 | ali-imran-3-190-191, mulk-67-30 |
| verifikasinya | 2 | anbiya-21-30, fussilat-41-53 |
| calibrat | 2 | baqarah-2-143, hijr-15-19 |
| validat | 2 | baqarah-2-170, hujurat-49-6 |
| ledger | 2 | baqarah-2-282, zalzalah-99-1-8 |
| adversarial | 2 | dzariyat-51-49, mulk-67-3-4 |
| verifier | 2 | dzariyat-51-49, nisa-4-135 |
| isolat | 2 | furqan-25-53, zumar-39-6 |
| budget | 2 | furqan-25-67, hijr-15-19 |
| replay | 2 | fussilat-41-20-22, zalzalah-99-1-8 |
| observability | 2 | fussilat-41-53, hasyr-59-18 |
| reflect | 2 | hasyr-59-18, nur-24-35 |
| emergen | 2 | kun-36-82, muminun-23-12-14 |

## B. Istilah/konsep berulang ≥3 kajian (yang BELUM tercakup prinsip)

| term | #kajian | kajian |
|---|---|---|
| rekayasa | 20 | anam-6-99, anbiya-21-33, asr-103-1-3, baqarah-2-143, baqarah-2-170, dzariyat-51-49, furqan-25-53, fussilat-41-53, hasyr-59-18, hijr-15-19, iqra-96-1-5, kun-36-82, maidah-5-1, mizan-55-5-9, muminun-23-12-14, nur-24-35, qaf-50-17-18, rahman-55-33, waqiah-56-68-70, yasin-36-38-40 |
| pelajaran | 12 | anbiya-21-30, anbiya-21-33, dzariyat-51-47, dzariyat-51-49, hadid-57-25, nahl-16-65, nahl-16-68-69, nur-24-35, nur-24-45, rum-30-41, waqiah-56-68-70, zumar-39-9 |
| dibaca | 11 | anbiya-21-33, baqarah-2-143, dzariyat-51-49, fatihah-1-1-7, hijr-15-19, maidah-5-1, muminun-23-12-14, nur-24-35, qaf-50-17-18, rahman-55-33, yasin-36-38-40 |
| manusia | 11 | asr-103-1-3, fatihah-1-1-7, fussilat-41-53, hasyr-59-18, kun-36-82, mujadilah-58-11, muminun-23-12-14, munafiqun-63-9-10, nahl-16-43, nahl-16-68-69, rum-30-41 |
| desain | 9 | anbiya-21-33, baqarah-2-282, dzariyat-51-47, fatihah-1-1-7, hadid-57-25, hijr-15-19, nur-24-4, rahman-55-33, rum-30-41 |
| memberi | 7 | baqarah-2-143, furqan-25-53, kun-36-82, mujadilah-58-11, nur-24-45, rum-30-41, yasin-36-38-40 |
| sekaligus | 6 | ali-imran-3-190-191, hujurat-49-12, kun-36-82, mizan-55-5-9, nur-24-4, shams-91-7-10 |
| struktur | 6 | anam-6-99, ankabut-29-20, dzariyat-51-49, furqan-25-67, mujadilah-58-11, mulk-67-3-4 |
| ketika | 6 | anam-6-99, baqarah-2-143, nahl-16-43, nahl-16-68-69, nisa-4-135, yunus-10-36 |
| rekayasanya | 6 | anbiya-21-30, dzariyat-51-47, mulk-67-30, nahl-16-65, nur-24-45, zumar-39-6 |
| protokol | 6 | baqarah-2-282, fatihah-1-1-7, fussilat-41-53, hujurat-49-12, maidah-5-1, mujadilah-58-11 |
| termasuk | 5 | anam-6-99, baqarah-2-143, baqarah-2-282, mulk-67-30, zumar-39-6 |
| gerbang | 5 | anam-6-99, baqarah-2-170, hujurat-49-6, iqra-96-1-5, yunus-10-36 |
| iʿtibār | 5 | anbiya-21-30, baqarah-2-282, fatihah-1-1-7, nahl-16-68-69, rum-30-41 |
| tentang | 5 | anbiya-21-30, anbiya-21-33, ankabut-29-20, fussilat-41-20-22, rahman-55-33 |
| banyak | 5 | dzariyat-51-49, furqan-25-67, kun-36-82, yasin-36-38-40, zumar-39-9 |
| menutup | 5 | dzariyat-51-49, muminun-23-12-14, nahl-16-68-69, rum-30-41, zalzalah-99-1-8 |
| komputasi | 5 | hijr-15-19, mizan-55-5-9, mulk-67-30, rahman-55-33, waqiah-56-68-70 |
| pelajarannya | 5 | hijr-15-19, mulk-67-3-4, mulk-67-30, rahman-55-33, shams-91-7-10 |
| terbaik | 4 | ali-imran-3-190-191, nahl-16-68-69, qaf-50-17-18, rum-30-41 |
| pernyataan | 4 | anbiya-21-30, anbiya-21-33, nur-24-45, rahman-55-33 |
| modern | 4 | ankabut-29-20, baqarah-2-282, nahl-16-43, qaf-50-17-18 |
| sebuah | 4 | baqarah-2-170, fussilat-41-53, mulk-67-30, nur-24-45 |
| qisṭ | 4 | baqarah-2-282, hadid-57-25, mizan-55-5-9, nisa-4-135 |
| tadhakkur | 4 | baqarah-2-282, dzariyat-51-49, fatihah-1-1-7, iqra-96-1-5 |
| rancang | 4 | dzariyat-51-47, nahl-16-65, waqiah-56-68-70, yunus-10-36 |
| logika | 4 | dzariyat-51-49, fussilat-41-20-22, mizan-55-5-9, nur-24-45 |
| taʿaqqul | 4 | fatihah-1-1-7, hujurat-49-6, iqra-96-1-5, zumar-39-9 |
| melengkapi | 4 | maidah-5-1, munafiqun-63-9-10, nur-24-4, zumar-39-6 |
| teramati | 3 | ali-imran-3-190-191, qaf-50-17-18, rum-30-41 |
| keselamatan | 3 | ali-imran-3-190-191, asr-103-1-3, yasin-36-38-40 |
| keluaran | 3 | anam-6-99, nahl-16-68-69, nur-24-35 |
| penutup | 3 | anam-6-99, nur-24-35, zumar-39-9 |
| pertanyaan | 3 | anbiya-21-30, nahl-16-43, zumar-39-9 |
| menegaskan | 3 | asr-103-1-3, nur-24-35, qaf-50-17-18 |
| berilmu | 3 | baqarah-2-170, isra-17-36, mujadilah-58-11 |
| teknis | 3 | baqarah-2-282, furqan-25-67, nahl-16-43 |
| tumbuh | 3 | dzariyat-51-47, iqra-96-1-5, zalzalah-99-1-8 |
| beresonansi | 3 | dzariyat-51-49, hijr-15-19, rahman-55-33 |
| desainnya | 3 | dzariyat-51-49, munafiqun-63-9-10, nahl-16-68-69 |

## C. Ringkasan
- Kajian dibaca: 49
- Analogy berulang (≥2): 39
- Term baru berulang (≥3, di luar prinsip): 50
- Prinsip eksisting: 24 · Kerangka: 3

> Langkah peninjau: pilih baris A/B yang menyiratkan POLA desain lintas-ayat yang belum jadi prinsip → tulis prinsip (≥2 evidence) via skill.
