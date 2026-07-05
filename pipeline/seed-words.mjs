// pipeline/seed-words.mjs
// Tarik word-by-word (kata demi kata) dari Quran.com (QUL) untuk 114 surah.
// Kata Arab = domain publik; terjemahan/transliterasi kata = QUL (provenance dicatat).
// Output: data/raw/words/<n>.json (cache) + data/words.json (gabungan).

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getJSON } from './lib/sources.mjs';

const RAW = new URL('../data/raw/words/', import.meta.url);
mkdirSync(fileURLToPath(RAW), { recursive: true });
const DATA = new URL('../data/', import.meta.url);

const WORD_LANG = 'id'; // terjemahan kata (Indonesia); fallback null kalau kosong

async function fetchChapterWords(n) {
  // paginate (per_page besar) — sebagian surah > 286 ayat? maksimal Al-Baqarah 286.
  const url =
    `https://api.quran.com/api/v4/verses/by_chapter/${n}` +
    `?words=true&per_page=300&fields=text_uthmani` +
    `&word_fields=text_uthmani,transliteration,char_type_name,position` +
    `&word_translation_language=${WORD_LANG}`;
  const j = await getJSON(url, { timeoutMs: 60000 });
  return j.verses;
}

const cachePath = (n) => new URL(`${n}.json`, RAW);

console.log(`MUSHAF seed-words — word-by-word 114 surah (word lang: ${WORD_LANG})\n`);

const byGlobal = {};
let totalWords = 0;
let okCh = 0;
let global0 = 0; // pointer verifikasi urutan global tak dipakai di sini

for (let n = 1; n <= 114; n++) {
  let verses;
  const cp = cachePath(n);
  if (existsSync(cp)) {
    verses = JSON.parse(readFileSync(cp, 'utf8'));
  } else {
    try {
      verses = await fetchChapterWords(n);
      writeFileSync(cp, JSON.stringify(verses), 'utf8');
    } catch (e) {
      console.error(`  ! surah ${n} gagal: ${e.message}`);
      continue;
    }
  }
  okCh++;
  for (const v of verses) {
    const [surah, ayah] = v.verse_key.split(':').map(Number);
    // hanya char_type 'word' (buang penanda 'end' = nomor ayat)
    const words = v.words
      .filter((w) => w.char_type_name === 'word')
      .map((w) => ({
        p: w.position,
        ar: (w.text_uthmani || w.text || '').normalize('NFC').trim(),
        tl: w.transliteration?.text ?? null,
        tr: w.translation?.text ?? null,
      }));
    byGlobal[`${surah}:${ayah}`] = words;
    totalWords += words.length;
  }
  if (n % 20 === 0) console.log(`  ...${n}/114 (words so far: ${totalWords})`);
}

const out = {
  builtAt: new Date().toISOString(),
  provenance: {
    words_arabic: { name: 'Quran.com / QUL — QPC word segmentation', license: 'teks Arab domain publik', url: 'https://api.quran.com/api/v4' },
    words_translation: { name: `QUL word translation (${WORD_LANG})`, license: 'QUL — audit ulang', lang: WORD_LANG },
    words_transliteration: { name: 'QUL transliteration', license: 'QUL — audit ulang' },
  },
  word_lang: WORD_LANG,
  chapters_ok: okCh,
  total_words: totalWords,
  byKey: byGlobal,
};
writeFileSync(new URL('words.json', DATA), JSON.stringify(out), 'utf8');

console.log(`\n✓ seed-words: ${okCh}/114 surah, ${totalWords} kata -> data/words.json`);
if (okCh !== 114) { console.error('✗ ada surah gagal, ulangi seed-words (cache akan dipakai).'); process.exit(1); }
