# 18_MINED_PATTERNS — Usulan Pola (semi-otomatis, WAJIB ditinjau)

> Dihasilkan `pipeline/lab-mine.mjs` dari 63 kajian. Ini USULAN mentah — bukan prinsip.
> Peninjau (skill tadabbur-lab) memutуskan mana yang layak jadi prinsip di synthesis.json.

## A. Konsep rekayasa berulang lintas kajian (≥2)
Konsep yang muncul di banyak ayat berbeda = kandidat kuat pola struktural. Bandingkan dgn prinsip eksisting; yang tebal-sebaran tapi belum jadi prinsip = usulan.

| konsep | #kajian | kajian |
|---|---|---|
| verifikasi | 13 | anam-6-99, anbiya-21-30, baqarah-2-111, baqarah-2-170, fussilat-41-53, hujurat-49-12, hujurat-49-6, isra-17-81, kun-36-82, nur-24-4, rahman-55-33, yasin-36-38-40, yunus-10-36 |
| invari | 11 | anbiya-21-22, anbiya-21-33, furqan-25-53, furqan-25-67, isra-17-81, mizan-55-5-9, nur-24-45, qaf-50-17-18, rum-30-41, rum-30-8-8, yasin-36-38-40 |
| bia | 11 | ankabut-29-20, baqarah-2-143, baqarah-2-170, hujurat-49-12, munafiqun-63-9-10, nisa-4-135, nur-24-45, rum-30-41, rum-30-8-8, waqiah-56-68-70, zalzalah-99-1-8 |
| audit | 11 | asr-103-1-3, baqarah-2-170, baqarah-2-282, fussilat-41-20-22, hasyr-59-18, isra-17-36, mulk-67-3-4, nisa-4-135, qaf-50-17-18, waqiah-56-68-70, zalzalah-99-1-8 |
| ground | 10 | ali-imran-3-190-191, ar-rahman-55-1-4, baqarah-2-111, baqarah-2-170, baqarah-2-31-32, hujurat-49-6, isra-17-81, nahl-16-12-12, naml-27-64, zumar-39-9 |
| provenance | 10 | ankabut-29-20, baqarah-2-111, baqarah-2-170, furqan-25-53, fussilat-41-20-22, iqra-96-1-5, isra-17-36, naml-27-64, tur-52-35-36, waqiah-56-68-70 |
| alignm | 9 | ali-imran-3-190-191, asr-103-1-3, fatihah-1-1-7, hadid-57-25, mizan-55-5-9, mujadilah-58-11, muminun-23-12-14, nur-24-35, shams-91-7-10 |
| pipeline | 8 | anam-6-99, baqarah-2-164-164, hujurat-49-6, iqra-96-1-5, kahf-18-66-66, muminun-23-12-14, nur-24-35, rum-30-8-8 |
| substrate | 7 | anbiya-21-30, ar-rahman-55-1-4, jatsiyah-45-13-13, nahl-16-65, nur-24-45, waqiah-56-68-70, zalzalah-99-1-8 |
| threshold | 7 | baqarah-2-282, nahl-16-12-12, nur-24-35, nur-24-4, rahman-55-33, yunus-10-36, zalzalah-99-1-8 |
| reason | 6 | ali-imran-3-190-191, baqarah-2-111, hasyr-59-21-21, nisa-4-135, rum-30-8-8, waqiah-56-68-70 |
| drift | 6 | asr-103-1-3, fatihah-1-1-7, nahl-16-65, rum-30-41, shams-91-7-10, zalzalah-99-1-8 |
| redundansi | 6 | baqarah-2-282, fussilat-41-20-22, isra-17-81, qaf-50-17-18, yusuf-12-76-76, zumar-39-6 |
| constraint | 5 | asr-103-1-3, furqan-25-67, mizan-55-5-9, muminun-23-12-14, yasin-36-38-40 |
| verify | 5 | baqarah-2-111, baqarah-2-170, hujurat-49-6, isra-17-36, zumar-39-9 |
| memory | 5 | baqarah-2-170, baqarah-2-282, hasyr-59-18, isra-17-36, mujadilah-58-11 |
| homeostasi | 5 | dzariyat-51-49, furqan-25-67, hijr-15-19, mizan-55-5-9, shams-91-7-10 |
| log | 5 | fussilat-41-20-22, isra-17-36, qaf-50-17-18, taha-20-114-114, zalzalah-99-1-8 |
| retrieval | 4 | ankabut-29-20, hujurat-49-6, isra-17-81, nahl-16-43 |
| feedback | 4 | asr-103-1-3, mizan-55-5-9, munafiqun-63-9-10, rum-30-41 |
| verifier | 4 | baqarah-2-111, dzariyat-51-49, nisa-4-135, yusuf-12-76-76 |
| sandbox | 4 | furqan-25-53, muminun-23-12-14, rahman-55-33, zumar-39-6 |
| deterministic | 3 | anbiya-21-33, mizan-55-5-9, zalzalah-99-1-8 |
| isolat | 3 | ar-rahman-55-1-4, furqan-25-53, zumar-39-6 |
| equilibrium | 3 | baqarah-2-143, mizan-55-5-9, waqiah-56-68-70 |
| calibrat | 3 | baqarah-2-143, hijr-15-19, yusuf-12-76-76 |
| attestat | 3 | baqarah-2-282, fussilat-41-20-22, zalzalah-99-1-8 |
| logg | 3 | fussilat-41-20-22, hasyr-59-18, qaf-50-17-18 |
| observability | 3 | fussilat-41-53, hasyr-59-18, rum-30-8-8 |
| rout | 3 | nahl-16-43, nahl-16-68-69, zumar-39-9 |
| redundan | 2 | ali-imran-3-190-191, mulk-67-30 |
| verifikasinya | 2 | anbiya-21-30, fussilat-41-53 |
| verifiable | 2 | baqarah-2-111, naml-27-64 |
| validat | 2 | baqarah-2-170, hujurat-49-6 |
| ledger | 2 | baqarah-2-282, zalzalah-99-1-8 |
| adversarial | 2 | dzariyat-51-49, mulk-67-3-4 |
| budget | 2 | furqan-25-67, hijr-15-19 |
| replay | 2 | fussilat-41-20-22, zalzalah-99-1-8 |
| reflect | 2 | hasyr-59-18, nur-24-35 |
| verificat | 2 | hujurat-49-6, isra-17-81 |
| emergen | 2 | kun-36-82, muminun-23-12-14 |

## B. Istilah/konsep berulang ≥3 kajian (yang BELUM tercakup prinsip)

| term | #kajian | kajian |
|---|---|---|
| rekayasa | 33 | anam-6-99, anbiya-21-22, anbiya-21-33, ar-rahman-55-1-4, asr-103-1-3, baqarah-2-143, baqarah-2-164-164, baqarah-2-170, baqarah-2-31-32, dzariyat-51-49, furqan-25-53, fussilat-41-53, hasyr-59-18, hasyr-59-21-21, hijr-15-19, iqra-96-1-5, isra-17-81, jatsiyah-45-13-13, kahf-18-66-66, kun-36-82, maidah-5-1, mizan-55-5-9, muminun-23-12-14, nahl-16-12-12, nur-24-35, qaf-50-17-18, rahman-55-33, rum-30-8-8, taha-20-114-114, tur-52-35-36, waqiah-56-68-70, yasin-36-38-40, yusuf-12-76-76 |
| dibaca | 16 | anbiya-21-33, baqarah-2-143, baqarah-2-164-164, dzariyat-51-49, fatihah-1-1-7, hasyr-59-21-21, hijr-15-19, jatsiyah-45-13-13, maidah-5-1, muminun-23-12-14, nahl-16-12-12, nur-24-35, qaf-50-17-18, rahman-55-33, rum-30-8-8, yasin-36-38-40 |
| desain | 14 | anbiya-21-33, baqarah-2-164-164, baqarah-2-282, dzariyat-51-47, fatihah-1-1-7, hadid-57-25, hasyr-59-21-21, hijr-15-19, jatsiyah-45-13-13, nahl-16-12-12, nur-24-4, rahman-55-33, rum-30-41, rum-30-8-8 |
| pelajaran | 13 | anbiya-21-30, anbiya-21-33, baqarah-2-31-32, dzariyat-51-47, dzariyat-51-49, hadid-57-25, nahl-16-65, nahl-16-68-69, nur-24-35, nur-24-45, rum-30-41, waqiah-56-68-70, zumar-39-9 |
| manusia | 13 | asr-103-1-3, baqarah-2-31-32, fatihah-1-1-7, fussilat-41-53, hasyr-59-18, hasyr-59-21-21, kun-36-82, mujadilah-58-11, muminun-23-12-14, munafiqun-63-9-10, nahl-16-43, nahl-16-68-69, rum-30-41 |
| struktural | 8 | baqarah-2-143, baqarah-2-164-164, dzariyat-51-47, hasyr-59-21-21, isra-17-81, jatsiyah-45-13-13, nahl-16-12-12, rum-30-8-8 |
| memberi | 8 | baqarah-2-143, furqan-25-53, kun-36-82, mujadilah-58-11, naml-27-64, nur-24-45, rum-30-41, yasin-36-38-40 |
| struktur | 7 | anam-6-99, ankabut-29-20, dzariyat-51-49, furqan-25-67, mujadilah-58-11, mulk-67-3-4, naml-27-64 |
| gerbang | 7 | anam-6-99, baqarah-2-164-164, baqarah-2-170, hujurat-49-6, iqra-96-1-5, kahf-18-66-66, yunus-10-36 |
| sekaligus | 6 | ali-imran-3-190-191, hujurat-49-12, kun-36-82, mizan-55-5-9, nur-24-4, shams-91-7-10 |
| ketika | 6 | anam-6-99, baqarah-2-143, nahl-16-43, nahl-16-68-69, nisa-4-135, yunus-10-36 |
| rekayasanya | 6 | anbiya-21-30, dzariyat-51-47, mulk-67-30, nahl-16-65, nur-24-45, zumar-39-6 |
| blueprint | 6 | ar-rahman-55-1-4, baqarah-2-31-32, fussilat-41-20-22, iqra-96-1-5, nisa-4-135, taha-20-114-114 |
| mukjizat | 6 | baqarah-2-164-164, dzariyat-51-47, hasyr-59-21-21, jatsiyah-45-13-13, nahl-16-12-12, rum-30-8-8 |
| numerik | 6 | baqarah-2-164-164, dzariyat-51-47, hasyr-59-21-21, jatsiyah-45-13-13, nahl-16-12-12, rum-30-8-8 |
| protokol | 6 | baqarah-2-282, fatihah-1-1-7, fussilat-41-53, hujurat-49-12, maidah-5-1, mujadilah-58-11 |
| komputasi | 6 | hijr-15-19, jatsiyah-45-13-13, mizan-55-5-9, mulk-67-30, rahman-55-33, waqiah-56-68-70 |
| termasuk | 5 | anam-6-99, baqarah-2-143, baqarah-2-282, mulk-67-30, zumar-39-6 |
| pernyataan | 5 | anbiya-21-22, anbiya-21-30, anbiya-21-33, nur-24-45, rahman-55-33 |
| sebuah | 5 | anbiya-21-22, baqarah-2-170, fussilat-41-53, mulk-67-30, nur-24-45 |
| iʿtibār | 5 | anbiya-21-30, baqarah-2-282, fatihah-1-1-7, nahl-16-68-69, rum-30-41 |
| tentang | 5 | anbiya-21-30, anbiya-21-33, ankabut-29-20, fussilat-41-20-22, rahman-55-33 |
| menegaskan | 5 | ar-rahman-55-1-4, asr-103-1-3, kahf-18-66-66, nur-24-35, qaf-50-17-18 |
| analogi | 5 | baqarah-2-164-164, hasyr-59-21-21, jatsiyah-45-13-13, nahl-16-12-12, rum-30-8-8 |
| bounded | 5 | baqarah-2-164-164, hasyr-59-21-21, jatsiyah-45-13-13, nahl-16-12-12, rum-30-8-8 |
| pertama | 5 | baqarah-2-31-32, iqra-96-1-5, naml-27-64, nur-24-35, waqiah-56-68-70 |
| resonansi | 5 | dzariyat-51-47, hasyr-59-21-21, jatsiyah-45-13-13, nahl-16-12-12, rum-30-8-8 |
| banyak | 5 | dzariyat-51-49, furqan-25-67, kun-36-82, yasin-36-38-40, zumar-39-9 |
| menutup | 5 | dzariyat-51-49, muminun-23-12-14, nahl-16-68-69, rum-30-41, zalzalah-99-1-8 |
| keduanya | 5 | furqan-25-67, hadid-57-25, mizan-55-5-9, nahl-16-12-12, taha-20-114-114 |
| pelajarannya | 5 | hijr-15-19, mulk-67-3-4, mulk-67-30, rahman-55-33, shams-91-7-10 |
| melengkapi | 5 | maidah-5-1, munafiqun-63-9-10, nur-24-4, taha-20-114-114, zumar-39-6 |
| terbaik | 4 | ali-imran-3-190-191, nahl-16-68-69, qaf-50-17-18, rum-30-41 |
| penalaran | 4 | ali-imran-3-190-191, baqarah-2-31-32, hasyr-59-21-21, rum-30-8-8 |
| keluaran | 4 | anam-6-99, ar-rahman-55-1-4, nahl-16-68-69, nur-24-35 |
| penutup | 4 | anam-6-99, nur-24-35, yusuf-12-76-76, zumar-39-9 |
| kepada | 4 | anbiya-21-30, baqarah-2-31-32, kahf-18-66-66, rum-30-41 |
| modern | 4 | ankabut-29-20, baqarah-2-282, nahl-16-43, qaf-50-17-18 |
| disiplin | 4 | baqarah-2-111, mulk-67-30, naml-27-64, taha-20-114-114 |
| pembuktian | 4 | baqarah-2-111, fussilat-41-53, naml-27-64, tur-52-35-36 |

## C. Ringkasan
- Kajian dibaca: 63
- Analogy berulang (≥2): 41
- Term baru berulang (≥3, di luar prinsip): 84
- Prinsip eksisting: 24 · Kerangka: 3

> Langkah peninjau: pilih baris A/B yang menyiratkan POLA desain lintas-ayat yang belum jadi prinsip → tulis prinsip (≥2 evidence) via skill.
