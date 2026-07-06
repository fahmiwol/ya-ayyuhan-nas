// Transliterasi Arab → Latin (bantuan baca utk yang belum bisa baca Arab).
// CATATAN PENTING: ini alat BANTU BACA otomatis, BUKAN transliterasi baku/ilmiah.
// Teks kanonik Al-Qur'an TETAP hanya yang Arab (immutable). Transliterasi = turunan,
// dihitung di sisi klien (tidak disimpan, tidak mengubah data apa pun).
// Konvensi Indonesia: ث=ts, ج=j, ح=h, خ=kh, ذ=dz, ش=sy, ص=sh, ض=dh, ط=th, ظ=zh,
// ع='(ain), غ=gh, ق=q. Vokal panjang → aa/ii/uu. Syaddah → konsonan ganda.

const CONS: Record<string, string> = {
  "ء": "'", "أ": "'", "إ": "'", "ؤ": "'", "ئ": "'", // hamzah & variannya
  "ب": "b", "ت": "t", "ة": "h", "ث": "ts", "ج": "j", "ح": "h", "خ": "kh",
  "د": "d", "ذ": "dz", "ر": "r", "ز": "z", "س": "s", "ش": "sy", "ص": "sh",
  "ض": "dh", "ط": "th", "ظ": "zh", "ع": "'", "غ": "gh", "ف": "f", "ق": "q",
  "ك": "k", "ل": "l", "م": "m", "ن": "n", "ه": "h",
};
// Harakat (tanda vokal). Sukun & dagger-alif ditangani khusus.
const FATHA = "َ", KASRA = "ِ", DAMMA = "ُ";
const FATHATAN = "ً", KASRATAN = "ٍ", DAMMATAN = "ٌ";
const SUKUN = "ْ", SHADDA = "ّ", DAGGER_ALIF = "ٰ";
const MADDA_ALIF = "آ"; // آ
const TATWEEL = "ـ";
const VOWEL: Record<string, string> = {
  [FATHA]: "a", [KASRA]: "i", [DAMMA]: "u",
  [FATHATAN]: "an", [KASRATAN]: "in", [DAMMATAN]: "un",
};
const MARKS = new Set([FATHA, KASRA, DAMMA, FATHATAN, KASRATAN, DAMMATAN, SUKUN, SHADDA, DAGGER_ALIF]);

function lastVowel(s: string): string {
  const m = s.match(/[aiu]$/);
  return m ? m[0] : "";
}

export function transliterateArabic(text: string): string {
  if (!text) return "";
  const chars = Array.from(text);
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (c === TATWEEL) continue;
    // Tanda berdiri sendiri (mis. dagger-alif terpisah oleh tatweel) → nilai vokalnya.
    if (c === DAGGER_ALIF) { if (lastVowel(out) !== "a") out += "a"; continue; }
    if (c in VOWEL) { out += VOWEL[c]; continue; }
    if (c === SUKUN || c === SHADDA) continue;

    // Kumpulkan semua tanda yang mengikuti huruf ini (urutan syaddah/harakat bisa acak;
    // tatweel di antara tanda diabaikan tapi tidak memutus klaster).
    const marks: string[] = [];
    let j = i + 1;
    while (j < chars.length && (MARKS.has(chars[j]) || chars[j] === TATWEEL)) {
      if (chars[j] !== TATWEEL) marks.push(chars[j]);
      j++;
    }
    const shadda = marks.includes(SHADDA);
    const dagger = marks.includes(DAGGER_ALIF);
    const vMark = marks.find((m) => m in VOWEL);
    const vowel = vMark ? VOWEL[vMark] : "";
    const sukun = marks.includes(SUKUN);
    const consumeMarks = () => { i = j - 1; };

    // Alif (madd / hamzah-kursi): panjang bila sebelumnya sudah 'a', selain itu 'a'.
    if (c === "ا" || c === "ٱ") { if (lastVowel(out) !== "a") out += "a"; out += vowel; consumeMarks(); continue; }
    if (c === MADDA_ALIF) { out += lastVowel(out) === "a" ? "a" : "aa"; consumeMarks(); continue; }
    if (c === "ى") { if (lastVowel(out) !== "a") out += "a"; consumeMarks(); continue; }

    // Waw / Ya: madd panjang (uu/ii) bila tak berharakat & vokal sebelumnya cocok; selain itu konsonan.
    if (c === "و") {
      if (!vMark && (sukun || marks.length === 0) && lastVowel(out) === "u") out += "u";
      else { out += "w"; if (shadda) out += "w"; out += vowel; }
      if (dagger) out += "a"; consumeMarks(); continue;
    }
    if (c === "ي") {
      if (!vMark && (sukun || marks.length === 0) && lastVowel(out) === "i") out += "i";
      else { out += "y"; if (shadda) out += "y"; out += vowel; }
      if (dagger) out += "a"; consumeMarks(); continue;
    }

    if (c in CONS) {
      const base = CONS[c];
      out += base;
      if (shadda) out += base; // gemination (syaddah)
      out += vowel;
      if (dagger) out += "a"; // alif khanjariyah, mis. lafz Allah
      consumeMarks();
      continue;
    }
    out += c; // spasi, tanda baca, angka, latin → apa adanya
  }
  return out
    .replace(/([a-z'])\1\1+/g, "$1$1") // 3+ huruf sama → 2
    .replace(/ {2,}/g, " ")
    .trim();
}
