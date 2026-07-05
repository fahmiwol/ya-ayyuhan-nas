// pipeline/lib/text.mjs
// Utilitas teks Arab untuk verifikasi keaslian.
// - NFC normalize (Unicode canonical composition)
// - skeleton(): rasm/kerangka konsonan (buang semua harakat & tanda)
// - skeletonLoose(): skeleton + fold varian alef/hamza (untuk membedakan
//   perbedaan ENCODING dari perbedaan RASM yang sebenarnya)
//
// Rujukan aturan: 04_DATA_SOURCES.md bagian C (strip harakat/tanda waqf/sajdah).

// Semua titik-kode "tanda" (bukan huruf rasm) yang harus dibuang untuk skeleton.
// Mencakup: harakat, tanwin, shadda, sukun, maddah, dagger alef, hamza gabung,
// tanda-tanda kecil mushaf (waqf, sajdah, ruku', end-of-ayah, rub-el-hizb), tatweel.
const MARK_RANGES = [
  [0x0610, 0x061a], // Arabic signs (honorifics) above/below
  [0x064b, 0x065f], // harakat, tanwin, shadda, sukun, + combining marks (incl. 0x0654/0x0655 hamza above/below)
  [0x0670, 0x0670], // dagger / superscript alef
  [0x06d4, 0x06d4], // Arabic full stop (punctuation, dipakai sbg tanda henti di sebagian digitasi)
  [0x06d6, 0x06ed], // seluruh tanda Quran: waqf, sajdah, rub-el-hizb, end-of-ayah, small high/low signs
  [0x08d3, 0x08ff], // Arabic extended-A combining marks
  [0x0640, 0x0640], // tatweel (kashida)
  [0x200b, 0x200f], // zero-width & bidi controls (ZWSP/ZWNJ/ZWJ/LRM/RLM) — bukan rasm
  [0x2060, 0x2060], // word joiner
  [0xfeff, 0xfeff], // BOM / zero-width no-break space
];

const isMark = (cp) => MARK_RANGES.some(([lo, hi]) => cp >= lo && cp <= hi);

/** NFC normalize + rapikan whitespace jadi satu spasi, trim. */
export function nfc(text) {
  return text.normalize('NFC').replace(/\s+/g, ' ').trim();
}

/**
 * Skeleton rasm: buang semua tanda, sisakan huruf konsonan.
 * Perbandingan ini yang WAJIB identik lintas sumber (kerangka teks sama).
 */
export function skeleton(text) {
  const s = text.normalize('NFC');
  let out = '';
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (isMark(cp)) continue;
    out += ch;
  }
  return out.replace(/\s+/g, ' ').trim();
}

/**
 * L1 — rasm-fold: skeleton + fold varian huruf yg murni konvensi encoding penerbit
 * (dudukan hamza & alef wasla). Ini menyamakan Tanzil vs QPC yang sama-sama rasm
 * Uthmani tapi beda cara meng-encode hamza:
 *  - alef wasla ٱ -> ا ; alef+hamza/madda أ إ آ -> ا
 *  - dudukan hamza: ؤ -> و ; ئ -> ي ; hamza berdiri ء dibuang
 *  - alef maksura ى -> ي ; ta marbuta ة -> ه (opsional, konvensi)
 *  - buang tanda pause huruf ە (U+06D5) yg dipakai sbg waqf di mushaf Kemenag
 * Kalau L0 beda tapi L1 sama -> murni beda encoding, BUKAN beda rasm.
 */
export function rasmFold(text) {
  return skeleton(text)
    .replace(/ە/g, '')     // ە tanda waqf (Kemenag)
    .replace(/[ٱأإآ]/g, 'ا')    // varian alef -> ا
    .replace(/ؤ/g, 'و')         // hamza on waw -> و
    .replace(/ئ/g, 'ي')         // hamza on ya  -> ي
    .replace(/ء/g, '')          // hamza berdiri dibuang
    .replace(/ى/g, 'ي')         // alef maksura -> ya
    .replace(/ة/g, 'ه')         // ta marbuta -> ha
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * L2 — kerangka konsonan (alef): rasmFold + buang SEMUA alef (ا).
 * Menyamakan perbedaan ejaan panjang-pendek alef (imla'i vs uthmani), mis.
 * الصرط (QPC, defektif) vs الصراط (Kemenag, plene) -> sama-sama صرط.
 */
export function consonantSkeleton(text) {
  return rasmFold(text)
    .replace(/ا/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * L3 — akar konsonan murni: samakan SEMUA konvensi ortografi long-vowel + spasi.
 * Dibangun ulang dari skeleton (bukan dari rasmFold) supaya bisa fold ta-marbuta
 * ke ta (ة->ت, sama-sama fonem /t/) sebelum info hilang.
 *  - buang tanda pause huruf (ە), punctuation
 *  - dudukan hamza: أإآٱ->ا ; ؤ->و ; ئ->ي ; ء dibuang
 *  - ى->ي ; ة->ت
 *  - buang SEMUA huruf mad (ا و ي) — netralkan ejaan plene vs defektif
 *  - buang semua spasi — netralkan beda segmentasi kata antar-digitasi
 * Kalau L3 pun beda -> benar-benar beda huruf konsonan (perlu review/anotasi).
 */
export function consonantRoot(text) {
  return skeleton(text)
    .replace(/ە/g, '')
    .replace(/[ٱأإآ]/g, 'ا')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ء/g, '')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ت')
    .replace(/[اوي]/g, '') // buang huruf mad
    .replace(/\s+/g, '')   // buang spasi
    .trim();
}
