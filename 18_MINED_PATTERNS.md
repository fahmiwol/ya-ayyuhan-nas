# 18_MINED_PATTERNS — Usulan Pola (semi-otomatis, WAJIB ditinjau)

> Dihasilkan `pipeline/lab-mine.mjs` dari 93 kajian. Ini USULAN mentah — bukan prinsip.
> Peninjau (skill tadabbur-lab) memutуskan mana yang layak jadi prinsip di synthesis.json.

## A. Konsep rekayasa berulang lintas kajian (≥2)
Konsep yang muncul di banyak ayat berbeda = kandidat kuat pola struktural. Bandingkan dgn prinsip eksisting; yang tebal-sebaran tapi belum jadi prinsip = usulan.

| konsep | #kajian | kajian |
|---|---|---|
| invari | 24 | ala-87-1-5, anam-6-95-95, anbiya-21-22, anbiya-21-33, baqarah-2-286, furqan-25-53, furqan-25-67, hijr-15-21-21, hujurat-49-13, isra-17-81, isra-17-82, mizan-55-5-9, naba-78-6-7, nahl-16-15, nisa-4-1, nur-24-45, qaf-50-17-18, qamar-54-49-49, rad-13-11, rum-30-41, rum-30-8-8, syuara-26-80, yasin-36-38-40, yunus-10-57 |
| pipeline | 16 | abasa-80-24-32, ala-87-1-5, anam-6-99, baqarah-2-164-164, dzariyat-51-20-21, furqan-25-2-2, hajj-22-5-5, hujurat-49-6, iqra-96-1-5, kahf-18-66-66, muminun-23-12-14, nahl-16-15, nur-24-35, rum-30-8-8, tariq-86-5-8, yunus-10-57 |
| audit | 14 | abasa-80-24-32, asr-103-1-3, baqarah-2-170, baqarah-2-282, fussilat-41-20-22, hasyr-59-18, isra-17-36, mulk-67-3-4, nisa-4-1, nisa-4-135, qaf-50-17-18, tariq-86-5-8, waqiah-56-68-70, zalzalah-99-1-8 |
| verifikasi | 14 | anam-6-99, anbiya-21-30, baqarah-2-111, baqarah-2-170, fussilat-41-53, hujurat-49-12, hujurat-49-6, isra-17-81, kun-36-82, nur-24-4, rahman-55-33, tariq-86-5-8, yasin-36-38-40, yunus-10-36 |
| provenance | 13 | abasa-80-24-32, ankabut-29-20, baqarah-2-111, baqarah-2-170, furqan-25-53, fussilat-41-20-22, iqra-96-1-5, isra-17-36, naml-27-64, nisa-4-1, tariq-86-5-8, tur-52-35-36, waqiah-56-68-70 |
| alignm | 12 | ali-imran-3-190-191, asr-103-1-3, fatihah-1-1-7, fussilat-41-11, hadid-57-25, hujurat-49-13, mizan-55-5-9, mujadilah-58-11, muminun-23-12-14, nur-24-35, sajdah-32-7-9, shams-91-7-10 |
| ground | 12 | ali-imran-3-190-191, ar-rahman-55-1-4, baqarah-2-111, baqarah-2-170, baqarah-2-31-32, hujurat-49-6, isra-17-81, isra-17-82, nahl-16-12-12, naml-27-64, nuh-71-14-17, zumar-39-9 |
| substrate | 11 | anbiya-21-30, ar-rahman-55-1-4, fussilat-41-11, hajj-22-5-5, jatsiyah-45-13-13, nahl-16-65, nuh-71-14-17, nur-24-45, qaf-50-9-11, waqiah-56-68-70, zalzalah-99-1-8 |
| bia | 11 | ankabut-29-20, baqarah-2-143, baqarah-2-170, hujurat-49-12, munafiqun-63-9-10, nisa-4-135, nur-24-45, rum-30-41, rum-30-8-8, waqiah-56-68-70, zalzalah-99-1-8 |
| constraint | 10 | ala-87-1-5, asr-103-1-3, furqan-25-67, fussilat-41-11, mizan-55-5-9, muminun-23-12-14, naba-78-6-7, nisa-4-1, qamar-54-49-49, yasin-36-38-40 |
| reason | 9 | ali-imran-3-190-191, baqarah-2-111, furqan-25-2-2, hasyr-59-21-21, nisa-4-135, nuh-71-14-17, qaf-50-9-11, rum-30-8-8, waqiah-56-68-70 |
| homeostasi | 9 | dzariyat-51-49, furqan-25-67, hijr-15-19, hijr-15-21-21, mizan-55-5-9, qamar-54-49-49, rum-30-21, shams-91-7-10, syuara-26-80 |
| drift | 8 | asr-103-1-3, fatihah-1-1-7, naba-78-9-11, nahl-16-65, rum-30-41, shams-91-7-10, syuara-26-80, zalzalah-99-1-8 |
| threshold | 8 | baqarah-2-282, furqan-25-2-2, nahl-16-12-12, nur-24-35, nur-24-4, rahman-55-33, yunus-10-36, zalzalah-99-1-8 |
| feedback | 7 | ala-87-1-5, asr-103-1-3, mizan-55-5-9, munafiqun-63-9-10, nuh-71-14-17, rum-30-41, syuara-26-80 |
| redundansi | 7 | baqarah-2-282, fussilat-41-20-22, isra-17-81, qaf-50-17-18, syuara-26-80, yusuf-12-76-76, zumar-39-6 |
| log | 7 | dzariyat-51-20-21, fussilat-41-20-22, isra-17-36, naba-78-9-11, qaf-50-17-18, taha-20-114-114, zalzalah-99-1-8 |
| checkpoint | 6 | anam-6-95-95, anbiya-21-104, hajj-22-5-5, muminun-23-12-14, naba-78-9-11, syuara-26-80 |
| memory | 6 | baqarah-2-170, baqarah-2-282, hajj-22-5-5, hasyr-59-18, isra-17-36, mujadilah-58-11 |
| verify | 5 | baqarah-2-111, baqarah-2-170, hujurat-49-6, isra-17-36, zumar-39-9 |
| calibrat | 5 | baqarah-2-143, furqan-25-2-2, hijr-15-19, sajdah-32-7-9, yusuf-12-76-76 |
| budget | 5 | baqarah-2-286, furqan-25-67, hijr-15-19, hijr-15-21-21, qamar-54-49-49 |
| observability | 5 | dzariyat-51-20-21, fussilat-41-53, hasyr-59-18, nisa-4-1, rum-30-8-8 |
| deterministic | 4 | anam-6-95-95, anbiya-21-33, mizan-55-5-9, zalzalah-99-1-8 |
| retrieval | 4 | ankabut-29-20, hujurat-49-6, isra-17-81, nahl-16-43 |
| isolat | 4 | ar-rahman-55-1-4, furqan-25-53, naba-78-9-11, zumar-39-6 |
| verifier | 4 | baqarah-2-111, dzariyat-51-49, nisa-4-135, yusuf-12-76-76 |
| equilibrium | 4 | baqarah-2-143, mizan-55-5-9, rum-30-21, waqiah-56-68-70 |
| sandbox | 4 | furqan-25-53, muminun-23-12-14, rahman-55-33, zumar-39-6 |
| rout | 4 | nahl-16-15, nahl-16-43, nahl-16-68-69, zumar-39-9 |
| redundan | 3 | ali-imran-3-190-191, mulk-67-30, rum-30-21 |
| validat | 3 | baqarah-2-170, hajj-22-5-5, hujurat-49-6 |
| attestat | 3 | baqarah-2-282, fussilat-41-20-22, zalzalah-99-1-8 |
| adversarial | 3 | dzariyat-51-49, isra-17-82, mulk-67-3-4 |
| logg | 3 | fussilat-41-20-22, hasyr-59-18, qaf-50-17-18 |
| replay | 3 | fussilat-41-20-22, tariq-86-5-8, zalzalah-99-1-8 |
| reflect | 3 | hasyr-59-18, nur-24-35, tariq-86-5-8 |
| verifikasinya | 2 | anbiya-21-30, fussilat-41-53 |
| verifiable | 2 | baqarah-2-111, naml-27-64 |
| ledger | 2 | baqarah-2-282, zalzalah-99-1-8 |
| verificat | 2 | hujurat-49-6, isra-17-81 |
| emergen | 2 | kun-36-82, muminun-23-12-14 |
| commitm | 2 | maidah-5-1, rum-30-21 |
| emerg | 2 | muminun-23-12-14, rum-30-21 |
| emergence | 2 | muminun-23-12-14, rad-13-11 |

## B. Istilah/konsep berulang ≥3 kajian (yang BELUM tercakup prinsip)

| term | #kajian | kajian |
|---|---|---|
| rekayasa | 58 | ala-87-1-5, anam-6-95-95, anam-6-99, anbiya-21-104, anbiya-21-22, anbiya-21-33, ar-rahman-55-1-4, asr-103-1-3, baqarah-2-143, baqarah-2-164-164, baqarah-2-170, baqarah-2-286, baqarah-2-31-32, dzariyat-51-20-21, dzariyat-51-49, furqan-25-2-2, furqan-25-53, fussilat-41-11, fussilat-41-53, hajj-22-5-5, hasyr-59-21-21, hijr-15-19, hijr-15-21-21, hujurat-49-13, iqra-96-1-5, isra-17-81, isra-17-82, jatsiyah-45-13-13, kahf-18-66-66, kun-36-82, maidah-5-1, mizan-55-5-9, muminun-23-12-14, naba-78-6-7, naba-78-9-11, nahl-16-11-11, nahl-16-12-12, nahl-16-15, nisa-4-1, nuh-71-14-17, nur-24-35, qaf-50-17-18, qaf-50-9-11, qamar-54-49-49, rad-13-11, rahman-55-33, rum-30-21, rum-30-8-8, shams-91-1-4, syuara-26-80, taha-20-114-114, talaq-65-3-3, tariq-86-5-8, tur-52-35-36, waqiah-56-68-70, yasin-36-38-40, yunus-10-57, yusuf-12-76-76 |
| dibaca | 35 | abasa-80-24-32, ala-87-1-5, anam-6-95-95, anbiya-21-104, anbiya-21-33, baqarah-2-143, baqarah-2-164-164, dzariyat-51-20-21, dzariyat-51-49, fatihah-1-1-7, furqan-25-2-2, fussilat-41-11, hasyr-59-18, hasyr-59-21-21, hijr-15-19, hijr-15-21-21, insan-76-2-2, jatsiyah-45-13-13, maidah-5-1, muminun-23-12-14, naba-78-6-7, nahl-16-11-11, nahl-16-12-12, nahl-16-15, nuh-71-14-17, nur-24-35, qaf-50-17-18, qaf-50-9-11, rahman-55-33, rum-30-8-8, syuara-26-80, talaq-65-3-3, tariq-86-5-8, yasin-36-38-40, yunus-10-57 |
| struktural | 33 | abasa-80-24-32, anam-6-95-95, anbiya-21-104, baqarah-2-143, baqarah-2-164-164, baqarah-2-286, dzariyat-51-20-21, dzariyat-51-47, fussilat-41-11, hajj-22-5-5, hasyr-59-21-21, hujurat-49-13, insan-76-2-2, isra-17-81, isra-17-82, jatsiyah-45-13-13, naba-78-6-7, naba-78-9-11, nahl-16-11-11, nahl-16-12-12, nahl-16-15, nahl-16-78-78, nisa-4-1, nuh-71-14-17, qaf-50-9-11, rad-13-11, rum-30-21, rum-30-8-8, sajdah-32-7-9, shams-91-1-4, syuara-26-80, tariq-86-5-8, yunus-10-57 |
| mukjizat | 30 | abasa-80-24-32, anam-6-95-95, anbiya-21-104, baqarah-2-164-164, baqarah-2-286, dzariyat-51-20-21, dzariyat-51-47, fussilat-41-11, hajj-22-5-5, hasyr-59-21-21, hujurat-49-13, insan-76-2-2, isra-17-82, jatsiyah-45-13-13, naba-78-6-7, naba-78-9-11, nahl-16-11-11, nahl-16-12-12, nahl-16-15, nahl-16-78-78, nisa-4-1, nuh-71-14-17, qaf-50-9-11, rum-30-21, rum-30-8-8, sajdah-32-7-9, shams-91-1-4, syuara-26-80, tariq-86-5-8, yunus-10-57 |
| numerik | 30 | abasa-80-24-32, anam-6-95-95, anbiya-21-104, baqarah-2-164-164, baqarah-2-286, dzariyat-51-20-21, dzariyat-51-47, fussilat-41-11, hajj-22-5-5, hasyr-59-21-21, hujurat-49-13, insan-76-2-2, isra-17-82, jatsiyah-45-13-13, naba-78-6-7, naba-78-9-11, nahl-16-11-11, nahl-16-12-12, nahl-16-15, nahl-16-78-78, nisa-4-1, nuh-71-14-17, qaf-50-9-11, rum-30-21, rum-30-8-8, sajdah-32-7-9, shams-91-1-4, syuara-26-80, tariq-86-5-8, yunus-10-57 |
| analogi | 28 | abasa-80-24-32, ala-87-1-5, anam-6-95-95, anbiya-21-104, baqarah-2-164-164, baqarah-2-286, dzariyat-51-20-21, furqan-25-2-2, fussilat-41-11, hasyr-59-21-21, hijr-15-21-21, hujurat-49-13, isra-17-82, jatsiyah-45-13-13, naba-78-6-7, naba-78-9-11, nahl-16-12-12, nahl-16-15, nisa-4-1, qamar-54-49-49, rad-13-11, rum-30-21, rum-30-8-8, shams-91-1-4, syuara-26-80, talaq-65-3-3, tariq-86-5-8, yunus-10-57 |
| maksud | 27 | abasa-80-24-32, ala-87-1-5, anam-6-95-95, anbiya-21-104, baqarah-2-286, dzariyat-51-20-21, furqan-25-2-2, fussilat-41-11, hijr-15-21-21, hujurat-49-13, isra-17-82, naba-78-6-7, naba-78-9-11, nahl-16-11-11, nahl-16-15, nisa-4-1, nuh-71-14-17, qaf-50-9-11, qamar-54-49-49, rad-13-11, rum-30-21, sajdah-32-7-9, shams-91-1-4, syuara-26-80, talaq-65-3-3, yunus-10-57, yusuf-12-76-76 |
| resonansi | 25 | abasa-80-24-32, anam-6-95-95, anbiya-21-104, dzariyat-51-20-21, dzariyat-51-47, fussilat-41-11, hajj-22-5-5, hasyr-59-21-21, insan-76-2-2, isra-17-82, jatsiyah-45-13-13, naba-78-6-7, naba-78-9-11, nahl-16-11-11, nahl-16-12-12, nahl-16-15, nahl-16-78-78, nuh-71-14-17, qaf-50-9-11, rum-30-8-8, sajdah-32-7-9, shams-91-1-4, syuara-26-80, tariq-86-5-8, yunus-10-57 |
| desain | 25 | ala-87-1-5, anbiya-21-33, baqarah-2-164-164, baqarah-2-282, baqarah-2-286, dzariyat-51-47, furqan-25-2-2, hadid-57-25, hasyr-59-21-21, hijr-15-19, hujurat-49-13, insan-76-2-2, jatsiyah-45-13-13, naba-78-6-7, nahl-16-12-12, nahl-16-78-78, nur-24-4, rad-13-11, rahman-55-33, rum-30-21, rum-30-41, rum-30-8-8, sajdah-32-7-9, syuara-26-80, yunus-10-57 |
| pembacaan | 24 | ala-87-1-5, anam-6-95-95, anbiya-21-104, baqarah-2-286, dzariyat-51-20-21, furqan-25-2-2, fussilat-41-11, hijr-15-21-21, hujurat-49-13, isra-17-82, naba-78-6-7, naba-78-9-11, nahl-16-11-11, nahl-16-15, nahl-16-78-78, nisa-4-1, nuh-71-14-17, qaf-50-9-11, qamar-54-49-49, rad-13-11, rum-30-21, shams-91-1-4, talaq-65-3-3, yunus-10-57 |
| pelajaran | 22 | abasa-80-24-32, ala-87-1-5, anbiya-21-104, anbiya-21-30, anbiya-21-33, baqarah-2-31-32, dzariyat-51-47, dzariyat-51-49, fatihah-1-1-7, fussilat-41-11, hadid-57-25, hajj-22-5-5, nahl-16-65, nahl-16-68-69, nuh-71-14-17, nur-24-35, nur-24-45, qamar-54-49-49, rum-30-41, waqiah-56-68-70, yunus-10-57, zumar-39-9 |
| manusia | 19 | abasa-80-24-32, asr-103-1-3, baqarah-2-31-32, fatihah-1-1-7, fussilat-41-53, hasyr-59-18, hasyr-59-21-21, insan-76-2-2, kun-36-82, mujadilah-58-11, muminun-23-12-14, munafiqun-63-9-10, nahl-16-43, nahl-16-68-69, nahl-16-78-78, nisa-4-1, nuh-71-14-17, rum-30-41, tariq-86-5-8 |
| bounded | 15 | anbiya-21-104, baqarah-2-164-164, dzariyat-51-20-21, fussilat-41-11, hasyr-59-21-21, jatsiyah-45-13-13, naba-78-6-7, naba-78-9-11, nahl-16-12-12, nahl-16-15, rum-30-8-8, shams-91-1-4, syuara-26-80, talaq-65-3-3, yunus-10-57 |
| catatan | 14 | abasa-80-24-32, anam-6-95-95, fatihah-1-1-7, hajj-22-5-5, hasyr-59-18, insan-76-2-2, nahl-16-11-11, nahl-16-78-78, nuh-71-14-17, qaf-50-9-11, sajdah-32-7-9, shams-91-1-4, syuara-26-80, tariq-86-5-8 |
| tanzih | 14 | abasa-80-24-32, anam-6-95-95, fatihah-1-1-7, hajj-22-5-5, hasyr-59-18, insan-76-2-2, nahl-16-11-11, nahl-16-78-78, nuh-71-14-17, qaf-50-9-11, sajdah-32-7-9, shams-91-1-4, syuara-26-80, tariq-86-5-8 |
| membangun | 13 | anam-6-95-95, anbiya-21-104, baqarah-2-286, furqan-25-2-2, hajj-22-5-5, hujurat-49-13, nahl-16-11-11, nahl-16-65, nisa-4-1, nur-24-45, qaf-50-9-11, rad-13-11, rum-30-21 |
| kemenag | 13 | hajj-22-5-5, hijr-15-21-21, insan-76-2-2, isra-17-82, naba-78-9-11, nahl-16-78-78, qamar-54-49-49, sajdah-32-7-9, shams-91-1-4, syuara-26-80, talaq-65-3-3, tariq-86-5-8, yunus-10-57 |
| sebuah | 12 | ala-87-1-5, anbiya-21-22, baqarah-2-170, fussilat-41-11, fussilat-41-53, hujurat-49-13, isra-17-82, mulk-67-30, nahl-16-15, nur-24-45, tariq-86-5-8, yunus-10-57 |
| struktur | 12 | anam-6-95-95, anam-6-99, ankabut-29-20, dzariyat-51-49, fatihah-1-1-7, furqan-25-67, fussilat-41-11, mujadilah-58-11, mulk-67-3-4, naml-27-64, nisa-4-1, nuh-71-14-17 |
| ciptaan | 11 | abasa-80-24-32, anam-6-95-95, hajj-22-5-5, hijr-15-19, mulk-67-3-4, nahl-16-11-11, nuh-71-14-17, qaf-50-9-11, rum-30-8-8, syuara-26-80, tariq-86-5-8 |
| dimodelkan | 11 | abasa-80-24-32, anam-6-95-95, anbiya-21-33, fatihah-1-1-7, nahl-16-11-11, nuh-71-14-17, qaf-50-9-11, sajdah-32-7-9, shams-91-1-4, syuara-26-80, talaq-65-3-3 |
| bersumber | 11 | anbiya-21-104, dzariyat-51-20-21, dzariyat-51-47, fussilat-41-11, isra-17-82, naba-78-6-7, naba-78-9-11, nahl-16-15, shams-91-1-4, syuara-26-80, yunus-10-57 |
| keluaran | 10 | abasa-80-24-32, anam-6-99, ar-rahman-55-1-4, hajj-22-5-5, nahl-16-11-11, nahl-16-68-69, nur-24-35, qaf-50-9-11, rad-13-11, tariq-86-5-8 |
| pertama | 10 | anam-6-95-95, baqarah-2-31-32, hujurat-49-13, insan-76-2-2, iqra-96-1-5, naml-27-64, nur-24-35, qaf-50-9-11, tariq-86-5-8, waqiah-56-68-70 |
| menegaskan | 10 | ar-rahman-55-1-4, asr-103-1-3, kahf-18-66-66, naba-78-9-11, nahl-16-11-11, nuh-71-14-17, nur-24-35, qaf-50-17-18, sajdah-32-7-9, talaq-65-3-3 |
| pelajarannya | 10 | hijr-15-19, mulk-67-3-4, mulk-67-30, naba-78-6-7, naba-78-9-11, nahl-16-15, rahman-55-33, shams-91-1-4, shams-91-7-10, syuara-26-80 |
| rekayasanya | 9 | abasa-80-24-32, anbiya-21-30, dzariyat-51-47, mulk-67-30, nahl-16-65, nur-24-45, sajdah-32-7-9, yunus-10-57, zumar-39-6 |
| sekaligus | 9 | ali-imran-3-190-191, hujurat-49-12, insan-76-2-2, kun-36-82, mizan-55-5-9, nur-24-4, rad-13-11, rum-30-21, shams-91-7-10 |
| landasan | 9 | anam-6-95-95, fatihah-1-1-7, isra-17-81, naba-78-6-7, nahl-16-11-11, naml-27-64, shams-91-1-4, syuara-26-80, tariq-86-5-8 |
| disiplin | 9 | baqarah-2-111, fatihah-1-1-7, hasyr-59-18, mulk-67-30, naml-27-64, qaf-50-9-11, rad-13-11, taha-20-114-114, talaq-65-3-3 |
| memberi | 9 | baqarah-2-143, furqan-25-53, kun-36-82, mujadilah-58-11, nahl-16-78-78, naml-27-64, nur-24-45, rum-30-41, yasin-36-38-40 |
| dianalogikan | 8 | abasa-80-24-32, anam-6-95-95, hasyr-59-18, nahl-16-11-11, nuh-71-14-17, qaf-50-9-11, shams-91-1-4, syuara-26-80 |
| hanyalah | 8 | anam-6-95-95, fatihah-1-1-7, hasyr-59-18, maidah-5-1, nahl-16-11-11, nuh-71-14-17, qaf-50-9-11, tariq-86-5-8 |
| seperti | 8 | anbiya-21-104, baqarah-2-286, hijr-15-19, isra-17-81, naml-27-64, nuh-71-14-17, qamar-54-49-49, yasin-36-38-40 |
| tafsir | 8 | dzariyat-51-20-21, dzariyat-51-47, fussilat-41-11, naba-78-6-7, nahl-16-15, qaf-50-17-18, sajdah-32-7-9, syuara-26-80 |
| melengkapi | 8 | insan-76-2-2, maidah-5-1, munafiqun-63-9-10, nahl-16-11-11, nur-24-4, rum-30-21, taha-20-114-114, zumar-39-6 |
| dibaca-rekayasa | 7 | abasa-80-24-32, anam-6-95-95, fatihah-1-1-7, hasyr-59-18, nahl-16-11-11, nuh-71-14-17, qaf-50-9-11 |
| dibingkai | 7 | ala-87-1-5, isra-17-82, naba-78-9-11, naml-27-64, shams-91-1-4, syuara-26-80, yunus-10-57 |
| rancang | 7 | anam-6-95-95, anbiya-21-104, dzariyat-51-47, nahl-16-65, nuh-71-14-17, waqiah-56-68-70, yunus-10-36 |
| termasuk | 7 | anam-6-99, baqarah-2-143, baqarah-2-282, hajj-22-5-5, mulk-67-30, nisa-4-1, zumar-39-6 |

## C. Ringkasan
- Kajian dibaca: 93
- Analogy berulang (≥2): 45
- Term baru berulang (≥3, di luar prinsip): 194
- Prinsip eksisting: 25 · Kerangka: 3

> Langkah peninjau: pilih baris A/B yang menyiratkan POLA desain lintas-ayat yang belum jadi prinsip → tulis prinsip (≥2 evidence) via skill.
