// pipeline/seed.mjs
// Tarik teks Quran + metadata + terjemahan dari multi-sumber -> cache mentah + model ternormalisasi.
// TIDAK memodifikasi teks. Hanya menyalin + menyusun. Verifikasi ada di verify.mjs.
//
// Output:
//   data/raw/<source>.json     (cache mentah tiap sumber, untuk audit)
//   data/normalized.json       (model gabungan keyed global 1..6236)

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { SOURCES, getJSON } from './lib/sources.mjs';

const RAW_DIR = new URL('../data/raw/', import.meta.url);
const DATA_DIR = new URL('../data/', import.meta.url);
mkdirSync(RAW_DIR, { recursive: true });

const EXPECTED_SURAH = 114;
const EXPECTED_AYAH = 6236;

function cachePath(name) {
  return new URL(`${name}.json`, RAW_DIR);
}
function saveRaw(name, obj) {
  writeFileSync(cachePath(name), JSON.stringify(obj), 'utf8');
}
function loadRawIfFresh(name) {
  const p = cachePath(name);
  if (existsSync(p)) {
    try {
      return JSON.parse(readFileSync(p, 'utf8'));
    } catch {
      return null;
    }
  }
  return null;
}

async function cached(name, fetcher) {
  const hit = loadRawIfFresh(name);
  if (hit) {
    console.log(`  · cache HIT   ${name}`);
    return hit;
  }
  console.log(`  · fetching    ${name} ...`);
  const data = await fetcher();
  saveRaw(name, data);
  return data;
}

// --- Fetchers ---------------------------------------------------------------

async function fetchQuranComChapters() {
  const j = await getJSON('https://api.quran.com/api/v4/chapters?language=en');
  return j.chapters;
}

async function fetchQuranComUthmani() {
  // Satu panggilan -> seluruh 6236 ayat (tanpa filter chapter).
  const j = await getJSON('https://api.quran.com/api/v4/quran/verses/uthmani');
  return j.verses; // [{id, verse_key:"s:a", text_uthmani}]
}

async function fetchAlquranEdition(edition) {
  const j = await getJSON(`https://api.alquran.cloud/v1/quran/${edition}`);
  return j.data; // {surahs:[{number, ..., ayahs:[{number, numberInSurah, text, juz, page, ...}]}]}
}

async function fetchEquranSurah(n) {
  const j = await getJSON(`https://equran.id/api/v2/surat/${n}`);
  return j.data; // {nomor, ayat:[{nomorAyat, teksArab, teksLatin, teksIndonesia}]}
}

// --- Main -------------------------------------------------------------------

console.log('MUSHAF seed — tarik multi-sumber (build-time)\n');

// 1) Surah metadata (dari Quran.com — konsisten dgn teks kanonik)
const chapters = await cached('quran_com_chapters', fetchQuranComChapters);

// 2) Teks Arab kanonik (Quran.com QPC Uthmani)
const qcVerses = await cached('quran_com_qpc_uthmani', fetchQuranComUthmani);

// 3) Cross-check Tanzil (AlQuran Cloud) + metadata ayat
const acUthmani = await cached('tanzil_uthmani_alqurancloud', () => fetchAlquranEdition('quran-uthmani'));

// 4) Terjemahan ID (Kemenag) & EN (Sahih)
const acId = await cached('kemenag_translation_id', () => fetchAlquranEdition('id.indonesian'));
const acEn = await cached('sahih_international_en', () => fetchAlquranEdition('en.sahih'));

// 5) Cross-check Kemenag MSI (equran.id) — 114 panggilan, resilient
let equran = loadRawIfFresh('kemenag_msi_equran');
if (!equran) {
  console.log('  · fetching    kemenag_msi_equran (114 surah) ...');
  equran = {};
  let ok = 0;
  for (let n = 1; n <= 114; n++) {
    try {
      const s = await fetchEquranSurah(n);
      equran[n] = s.ayat.map((a) => ({ ayah: a.nomorAyat, arabic: a.teksArab, id: a.teksIndonesia }));
      ok++;
      if (n % 20 === 0) console.log(`      ...${n}/114`);
    } catch (e) {
      console.warn(`      ! surah ${n} gagal: ${e.message}`);
      equran[n] = null;
    }
  }
  saveRaw('kemenag_msi_equran', equran);
  console.log(`      equran selesai: ${ok}/114 surah`);
} else {
  console.log('  · cache HIT   kemenag_msi_equran');
}

// --- Susun model ternormalisasi (keyed by surah:ayah) -----------------------

// index AlQuran Cloud (Tanzil) per "s:a"
const acIndex = new Map();
const acMeta = new Map();
for (const s of acUthmani.surahs) {
  for (const a of s.ayahs) {
    const key = `${s.number}:${a.numberInSurah}`;
    acIndex.set(key, a.text);
    acMeta.set(key, {
      juz: a.juz, page: a.page, hizbQuarter: a.hizbQuarter,
      manzil: a.manzil, ruku: a.ruku, sajda: !!a.sajda,
    });
  }
}
const idIndex = new Map();
for (const s of acId.surahs) for (const a of s.ayahs) idIndex.set(`${s.number}:${a.numberInSurah}`, a.text);
const enIndex = new Map();
for (const s of acEn.surahs) for (const a of s.ayahs) enIndex.set(`${s.number}:${a.numberInSurah}`, a.text);

const equranIndex = new Map();
for (let n = 1; n <= 114; n++) {
  const arr = equran[n];
  if (!arr) continue;
  for (const a of arr) equranIndex.set(`${n}:${a.ayah}`, a.arabic);
}

// surah meta
const surahs = chapters.map((c) => ({
  number: c.id,
  name_ar: c.name_arabic,
  name_latin: c.name_simple,
  name_en: c.translated_name?.name ?? null,
  revelation_place: c.revelation_place, // makkah|madinah
  ayah_count: c.verses_count,
  order_revelation: c.revelation_order,
  bismillah_pre: c.bismillah_pre, // apakah surah diawali basmalah (semua kecuali 9)
}));

// ayat: urut global mengikuti Quran.com (id = global 1..6236)
const qcSorted = [...qcVerses].sort((a, b) => a.id - b.id);
const ayahs = qcSorted.map((v, i) => {
  const [surah, ayah] = v.verse_key.split(':').map(Number);
  const key = v.verse_key;
  return {
    global: i + 1,
    surah,
    ayah,
    arabic_canonical: v.text_uthmani.normalize('NFC').replace(/\s+/g, ' ').trim(),
    crosscheck: {
      tanzil: acIndex.get(key) ?? null,
      kemenag: equranIndex.get(key) ?? null,
    },
    meta: acMeta.get(key) ?? {},
    translations: {
      id: idIndex.get(key) ?? null,
      en: enIndex.get(key) ?? null,
    },
  };
});

const normalized = {
  builtAt: new Date().toISOString(),
  expected: { surah: EXPECTED_SURAH, ayah: EXPECTED_AYAH },
  counts: { surah: surahs.length, ayah: ayahs.length },
  sources: SOURCES,
  surahs,
  ayahs,
};

writeFileSync(new URL('normalized.json', DATA_DIR), JSON.stringify(normalized), 'utf8');

// --- Ringkas & sanity ------------------------------------------------------
console.log('\n=== SEED RINGKAS ===');
console.log(`surah   : ${surahs.length} (harap ${EXPECTED_SURAH})`);
console.log(`ayah    : ${ayahs.length} (harap ${EXPECTED_AYAH})`);
const missTanzil = ayahs.filter((a) => !a.crosscheck.tanzil).length;
const missKemenag = ayahs.filter((a) => !a.crosscheck.kemenag).length;
const missId = ayahs.filter((a) => !a.translations.id).length;
const missEn = ayahs.filter((a) => !a.translations.en).length;
console.log(`cross-check Tanzil  : ${ayahs.length - missTanzil}/${ayahs.length}`);
console.log(`cross-check Kemenag : ${ayahs.length - missKemenag}/${ayahs.length}`);
console.log(`terjemahan ID       : ${ayahs.length - missId}/${ayahs.length}`);
console.log(`terjemahan EN       : ${ayahs.length - missEn}/${ayahs.length}`);

if (surahs.length !== EXPECTED_SURAH || ayahs.length !== EXPECTED_AYAH) {
  console.error('\n✗ FAIL: jumlah surah/ayah tidak sesuai. Hentikan sebelum verify.');
  process.exit(1);
}
console.log('\n✓ seed OK -> data/normalized.json');
