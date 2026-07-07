# 18_MINED_PATTERNS — Usulan Pola (semi-otomatis, WAJIB ditinjau)

> Dihasilkan `pipeline/lab-mine.mjs` dari 78 kajian. Ini USULAN mentah — bukan prinsip.
> Peninjau (skill tadabbur-lab) memutуskan mana yang layak jadi prinsip di synthesis.json.

## A. Konsep rekayasa berulang lintas kajian (≥2)
Konsep yang muncul di banyak ayat berbeda = kandidat kuat pola struktural. Bandingkan dgn prinsip eksisting; yang tebal-sebaran tapi belum jadi prinsip = usulan.

| konsep | #kajian | kajian |
|---|---|---|
| invari | 20 | ala-87-1-5, anbiya-21-22, anbiya-21-33, baqarah-2-286, furqan-25-53, furqan-25-67, hijr-15-21-21, hujurat-49-13, isra-17-81, mizan-55-5-9, naba-78-6-7, nahl-16-15, nisa-4-1, nur-24-45, qaf-50-17-18, qamar-54-49-49, rad-13-11, rum-30-41, rum-30-8-8, yasin-36-38-40 |
| verifikasi | 13 | anam-6-99, anbiya-21-30, baqarah-2-111, baqarah-2-170, fussilat-41-53, hujurat-49-12, hujurat-49-6, isra-17-81, kun-36-82, nur-24-4, rahman-55-33, yasin-36-38-40, yunus-10-36 |
| pipeline | 12 | ala-87-1-5, anam-6-99, baqarah-2-164-164, dzariyat-51-20-21, furqan-25-2-2, hujurat-49-6, iqra-96-1-5, kahf-18-66-66, muminun-23-12-14, nahl-16-15, nur-24-35, rum-30-8-8 |
| audit | 12 | asr-103-1-3, baqarah-2-170, baqarah-2-282, fussilat-41-20-22, hasyr-59-18, isra-17-36, mulk-67-3-4, nisa-4-1, nisa-4-135, qaf-50-17-18, waqiah-56-68-70, zalzalah-99-1-8 |
| alignm | 11 | ali-imran-3-190-191, asr-103-1-3, fatihah-1-1-7, fussilat-41-11, hadid-57-25, hujurat-49-13, mizan-55-5-9, mujadilah-58-11, muminun-23-12-14, nur-24-35, shams-91-7-10 |
| bia | 11 | ankabut-29-20, baqarah-2-143, baqarah-2-170, hujurat-49-12, munafiqun-63-9-10, nisa-4-135, nur-24-45, rum-30-41, rum-30-8-8, waqiah-56-68-70, zalzalah-99-1-8 |
| provenance | 11 | ankabut-29-20, baqarah-2-111, baqarah-2-170, furqan-25-53, fussilat-41-20-22, iqra-96-1-5, isra-17-36, naml-27-64, nisa-4-1, tur-52-35-36, waqiah-56-68-70 |
| constraint | 10 | ala-87-1-5, asr-103-1-3, furqan-25-67, fussilat-41-11, mizan-55-5-9, muminun-23-12-14, naba-78-6-7, nisa-4-1, qamar-54-49-49, yasin-36-38-40 |
| ground | 10 | ali-imran-3-190-191, ar-rahman-55-1-4, baqarah-2-111, baqarah-2-170, baqarah-2-31-32, hujurat-49-6, isra-17-81, nahl-16-12-12, naml-27-64, zumar-39-9 |
| substrate | 8 | anbiya-21-30, ar-rahman-55-1-4, fussilat-41-11, jatsiyah-45-13-13, nahl-16-65, nur-24-45, waqiah-56-68-70, zalzalah-99-1-8 |
| threshold | 8 | baqarah-2-282, furqan-25-2-2, nahl-16-12-12, nur-24-35, nur-24-4, rahman-55-33, yunus-10-36, zalzalah-99-1-8 |
| homeostasi | 8 | dzariyat-51-49, furqan-25-67, hijr-15-19, hijr-15-21-21, mizan-55-5-9, qamar-54-49-49, rum-30-21, shams-91-7-10 |
| reason | 7 | ali-imran-3-190-191, baqarah-2-111, furqan-25-2-2, hasyr-59-21-21, nisa-4-135, rum-30-8-8, waqiah-56-68-70 |
| drift | 6 | asr-103-1-3, fatihah-1-1-7, nahl-16-65, rum-30-41, shams-91-7-10, zalzalah-99-1-8 |
| redundansi | 6 | baqarah-2-282, fussilat-41-20-22, isra-17-81, qaf-50-17-18, yusuf-12-76-76, zumar-39-6 |
| log | 6 | dzariyat-51-20-21, fussilat-41-20-22, isra-17-36, qaf-50-17-18, taha-20-114-114, zalzalah-99-1-8 |
| feedback | 5 | ala-87-1-5, asr-103-1-3, mizan-55-5-9, munafiqun-63-9-10, rum-30-41 |
| verify | 5 | baqarah-2-111, baqarah-2-170, hujurat-49-6, isra-17-36, zumar-39-9 |
| memory | 5 | baqarah-2-170, baqarah-2-282, hasyr-59-18, isra-17-36, mujadilah-58-11 |
| budget | 5 | baqarah-2-286, furqan-25-67, hijr-15-19, hijr-15-21-21, qamar-54-49-49 |
| observability | 5 | dzariyat-51-20-21, fussilat-41-53, hasyr-59-18, nisa-4-1, rum-30-8-8 |
| retrieval | 4 | ankabut-29-20, hujurat-49-6, isra-17-81, nahl-16-43 |
| verifier | 4 | baqarah-2-111, dzariyat-51-49, nisa-4-135, yusuf-12-76-76 |
| equilibrium | 4 | baqarah-2-143, mizan-55-5-9, rum-30-21, waqiah-56-68-70 |
| calibrat | 4 | baqarah-2-143, furqan-25-2-2, hijr-15-19, yusuf-12-76-76 |
| sandbox | 4 | furqan-25-53, muminun-23-12-14, rahman-55-33, zumar-39-6 |
| rout | 4 | nahl-16-15, nahl-16-43, nahl-16-68-69, zumar-39-9 |
| redundan | 3 | ali-imran-3-190-191, mulk-67-30, rum-30-21 |
| deterministic | 3 | anbiya-21-33, mizan-55-5-9, zalzalah-99-1-8 |
| isolat | 3 | ar-rahman-55-1-4, furqan-25-53, zumar-39-6 |
| attestat | 3 | baqarah-2-282, fussilat-41-20-22, zalzalah-99-1-8 |
| logg | 3 | fussilat-41-20-22, hasyr-59-18, qaf-50-17-18 |
| checkpoint | 2 | anbiya-21-104, muminun-23-12-14 |
| verifikasinya | 2 | anbiya-21-30, fussilat-41-53 |
| verifiable | 2 | baqarah-2-111, naml-27-64 |
| validat | 2 | baqarah-2-170, hujurat-49-6 |
| ledger | 2 | baqarah-2-282, zalzalah-99-1-8 |
| adversarial | 2 | dzariyat-51-49, mulk-67-3-4 |
| replay | 2 | fussilat-41-20-22, zalzalah-99-1-8 |
| reflect | 2 | hasyr-59-18, nur-24-35 |
| verificat | 2 | hujurat-49-6, isra-17-81 |
| emergen | 2 | kun-36-82, muminun-23-12-14 |
| commitm | 2 | maidah-5-1, rum-30-21 |
| emerg | 2 | muminun-23-12-14, rum-30-21 |
| emergence | 2 | muminun-23-12-14, rad-13-11 |

## B. Istilah/konsep berulang ≥3 kajian (yang BELUM tercakup prinsip)

| term | #kajian | kajian |
|---|---|---|
| rekayasa | 48 | ala-87-1-5, anam-6-99, anbiya-21-104, anbiya-21-22, anbiya-21-33, ar-rahman-55-1-4, asr-103-1-3, baqarah-2-143, baqarah-2-164-164, baqarah-2-170, baqarah-2-286, baqarah-2-31-32, dzariyat-51-20-21, dzariyat-51-49, furqan-25-2-2, furqan-25-53, fussilat-41-11, fussilat-41-53, hasyr-59-18, hasyr-59-21-21, hijr-15-19, hijr-15-21-21, hujurat-49-13, iqra-96-1-5, isra-17-81, jatsiyah-45-13-13, kahf-18-66-66, kun-36-82, maidah-5-1, mizan-55-5-9, muminun-23-12-14, naba-78-6-7, nahl-16-12-12, nahl-16-15, nisa-4-1, nur-24-35, qaf-50-17-18, qamar-54-49-49, rad-13-11, rahman-55-33, rum-30-21, rum-30-8-8, taha-20-114-114, talaq-65-3-3, tur-52-35-36, waqiah-56-68-70, yasin-36-38-40, yusuf-12-76-76 |
| dibaca | 25 | ala-87-1-5, anbiya-21-104, anbiya-21-33, baqarah-2-143, baqarah-2-164-164, dzariyat-51-20-21, dzariyat-51-49, fatihah-1-1-7, furqan-25-2-2, fussilat-41-11, hasyr-59-21-21, hijr-15-19, hijr-15-21-21, jatsiyah-45-13-13, maidah-5-1, muminun-23-12-14, naba-78-6-7, nahl-16-12-12, nahl-16-15, nur-24-35, qaf-50-17-18, rahman-55-33, rum-30-8-8, talaq-65-3-3, yasin-36-38-40 |
| desain | 21 | ala-87-1-5, anbiya-21-33, baqarah-2-164-164, baqarah-2-282, baqarah-2-286, dzariyat-51-47, fatihah-1-1-7, furqan-25-2-2, hadid-57-25, hasyr-59-21-21, hijr-15-19, hujurat-49-13, jatsiyah-45-13-13, naba-78-6-7, nahl-16-12-12, nur-24-4, rad-13-11, rahman-55-33, rum-30-21, rum-30-41, rum-30-8-8 |
| analogi | 20 | ala-87-1-5, anbiya-21-104, baqarah-2-164-164, baqarah-2-286, dzariyat-51-20-21, furqan-25-2-2, fussilat-41-11, hasyr-59-21-21, hijr-15-21-21, hujurat-49-13, jatsiyah-45-13-13, naba-78-6-7, nahl-16-12-12, nahl-16-15, nisa-4-1, qamar-54-49-49, rad-13-11, rum-30-21, rum-30-8-8, talaq-65-3-3 |
| struktural | 18 | anbiya-21-104, baqarah-2-143, baqarah-2-164-164, baqarah-2-286, dzariyat-51-20-21, dzariyat-51-47, fussilat-41-11, hasyr-59-21-21, hujurat-49-13, isra-17-81, jatsiyah-45-13-13, naba-78-6-7, nahl-16-12-12, nahl-16-15, nisa-4-1, rad-13-11, rum-30-21, rum-30-8-8 |
| pelajaran | 17 | ala-87-1-5, anbiya-21-104, anbiya-21-30, anbiya-21-33, baqarah-2-31-32, dzariyat-51-47, dzariyat-51-49, fussilat-41-11, hadid-57-25, nahl-16-65, nahl-16-68-69, nur-24-35, nur-24-45, qamar-54-49-49, rum-30-41, waqiah-56-68-70, zumar-39-9 |
| maksud | 16 | ala-87-1-5, anbiya-21-104, baqarah-2-286, dzariyat-51-20-21, furqan-25-2-2, fussilat-41-11, hijr-15-21-21, hujurat-49-13, naba-78-6-7, nahl-16-15, nisa-4-1, qamar-54-49-49, rad-13-11, rum-30-21, talaq-65-3-3, yusuf-12-76-76 |
| pembacaan | 15 | ala-87-1-5, anbiya-21-104, baqarah-2-286, dzariyat-51-20-21, furqan-25-2-2, fussilat-41-11, hijr-15-21-21, hujurat-49-13, naba-78-6-7, nahl-16-15, nisa-4-1, qamar-54-49-49, rad-13-11, rum-30-21, talaq-65-3-3 |
| mukjizat | 15 | anbiya-21-104, baqarah-2-164-164, baqarah-2-286, dzariyat-51-20-21, dzariyat-51-47, fussilat-41-11, hasyr-59-21-21, hujurat-49-13, jatsiyah-45-13-13, naba-78-6-7, nahl-16-12-12, nahl-16-15, nisa-4-1, rum-30-21, rum-30-8-8 |
| numerik | 15 | anbiya-21-104, baqarah-2-164-164, baqarah-2-286, dzariyat-51-20-21, dzariyat-51-47, fussilat-41-11, hasyr-59-21-21, hujurat-49-13, jatsiyah-45-13-13, naba-78-6-7, nahl-16-12-12, nahl-16-15, nisa-4-1, rum-30-21, rum-30-8-8 |
| manusia | 14 | asr-103-1-3, baqarah-2-31-32, fatihah-1-1-7, fussilat-41-53, hasyr-59-18, hasyr-59-21-21, kun-36-82, mujadilah-58-11, muminun-23-12-14, munafiqun-63-9-10, nahl-16-43, nahl-16-68-69, nisa-4-1, rum-30-41 |
| bounded | 11 | anbiya-21-104, baqarah-2-164-164, dzariyat-51-20-21, fussilat-41-11, hasyr-59-21-21, jatsiyah-45-13-13, naba-78-6-7, nahl-16-12-12, nahl-16-15, rum-30-8-8, talaq-65-3-3 |
| resonansi | 10 | anbiya-21-104, dzariyat-51-20-21, dzariyat-51-47, fussilat-41-11, hasyr-59-21-21, jatsiyah-45-13-13, naba-78-6-7, nahl-16-12-12, nahl-16-15, rum-30-8-8 |
| sebuah | 9 | ala-87-1-5, anbiya-21-22, baqarah-2-170, fussilat-41-11, fussilat-41-53, hujurat-49-13, mulk-67-30, nahl-16-15, nur-24-45 |
| struktur | 9 | anam-6-99, ankabut-29-20, dzariyat-51-49, furqan-25-67, fussilat-41-11, mujadilah-58-11, mulk-67-3-4, naml-27-64, nisa-4-1 |
| membangun | 9 | anbiya-21-104, baqarah-2-286, furqan-25-2-2, hujurat-49-13, nahl-16-65, nisa-4-1, nur-24-45, rad-13-11, rum-30-21 |
| sekaligus | 8 | ali-imran-3-190-191, hujurat-49-12, kun-36-82, mizan-55-5-9, nur-24-4, rad-13-11, rum-30-21, shams-91-7-10 |
| memberi | 8 | baqarah-2-143, furqan-25-53, kun-36-82, mujadilah-58-11, naml-27-64, nur-24-45, rum-30-41, yasin-36-38-40 |
| gerbang | 7 | anam-6-99, baqarah-2-164-164, baqarah-2-170, hujurat-49-6, iqra-96-1-5, kahf-18-66-66, yunus-10-36 |
| seperti | 7 | anbiya-21-104, baqarah-2-286, hijr-15-19, isra-17-81, naml-27-64, qamar-54-49-49, yasin-36-38-40 |
| protokol | 7 | baqarah-2-282, fatihah-1-1-7, fussilat-41-53, hujurat-49-12, hujurat-49-13, maidah-5-1, mujadilah-58-11 |
| pelajarannya | 7 | hijr-15-19, mulk-67-3-4, mulk-67-30, naba-78-6-7, nahl-16-15, rahman-55-33, shams-91-7-10 |
| ketika | 6 | anam-6-99, baqarah-2-143, nahl-16-43, nahl-16-68-69, nisa-4-135, yunus-10-36 |
| termasuk | 6 | anam-6-99, baqarah-2-143, baqarah-2-282, mulk-67-30, nisa-4-1, zumar-39-6 |
| bersumber | 6 | anbiya-21-104, dzariyat-51-20-21, dzariyat-51-47, fussilat-41-11, naba-78-6-7, nahl-16-15 |
| rekayasanya | 6 | anbiya-21-30, dzariyat-51-47, mulk-67-30, nahl-16-65, nur-24-45, zumar-39-6 |
| menegaskan | 6 | ar-rahman-55-1-4, asr-103-1-3, kahf-18-66-66, nur-24-35, qaf-50-17-18, talaq-65-3-3 |
| blueprint | 6 | ar-rahman-55-1-4, baqarah-2-31-32, fussilat-41-20-22, iqra-96-1-5, nisa-4-135, taha-20-114-114 |
| disiplin | 6 | baqarah-2-111, mulk-67-30, naml-27-64, rad-13-11, taha-20-114-114, talaq-65-3-3 |
| pertama | 6 | baqarah-2-31-32, hujurat-49-13, iqra-96-1-5, naml-27-64, nur-24-35, waqiah-56-68-70 |
| keduanya | 6 | dzariyat-51-20-21, furqan-25-67, hadid-57-25, mizan-55-5-9, nahl-16-12-12, taha-20-114-114 |
| tafsir | 6 | dzariyat-51-20-21, dzariyat-51-47, fussilat-41-11, naba-78-6-7, nahl-16-15, qaf-50-17-18 |
| banyak | 6 | dzariyat-51-49, furqan-25-67, fussilat-41-11, kun-36-82, yasin-36-38-40, zumar-39-9 |
| komputasi | 6 | hijr-15-19, jatsiyah-45-13-13, mizan-55-5-9, mulk-67-30, rahman-55-33, waqiah-56-68-70 |
| melengkapi | 6 | maidah-5-1, munafiqun-63-9-10, nur-24-4, rum-30-21, taha-20-114-114, zumar-39-6 |
| keluaran | 5 | anam-6-99, ar-rahman-55-1-4, nahl-16-68-69, nur-24-35, rad-13-11 |
| āyāt kauniyah | 5 | anbiya-21-104, anbiya-21-30, fussilat-41-11, naba-78-6-7, nahl-16-15 |
| perancang | 5 | anbiya-21-104, dzariyat-51-20-21, fussilat-41-11, naba-78-6-7, nahl-16-15 |
| rancang | 5 | anbiya-21-104, dzariyat-51-47, nahl-16-65, waqiah-56-68-70, yunus-10-36 |
| pernyataan | 5 | anbiya-21-22, anbiya-21-30, anbiya-21-33, nur-24-45, rahman-55-33 |

## C. Ringkasan
- Kajian dibaca: 78
- Analogy berulang (≥2): 45
- Term baru berulang (≥3, di luar prinsip): 131
- Prinsip eksisting: 25 · Kerangka: 3

> Langkah peninjau: pilih baris A/B yang menyiratkan POLA desain lintas-ayat yang belum jadi prinsip → tulis prinsip (≥2 evidence) via skill.
