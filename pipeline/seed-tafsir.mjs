// pipeline/seed-tafsir.mjs
// Kumpulkan TAFSIR multi-edisi (multi-ulama) per ayat -> simpan per-surah.
// Edisi: Kemenag (id, via equran.id) + al-Muyassar (ar, via Quran.com/KFGQPC).
// "Built own": tarik build-time. Arsitektur multi-edisi → tambah edisi lain kapan saja.
// ⚠️ Audit lisensi tiap edisi (Kemenag: izin redistribusi; al-Muyassar: KFGQPC bebas pakai).

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getJSON } from './lib/sources.mjs';

const OUT = new URL('../apps/web/public/data/tafsir/', import.meta.url);
mkdirSync(fileURLToPath(OUT), { recursive: true });

const EDITIONS = [
  { key: 'kemenag', name: 'Tafsir Kemenag', lang: 'id', source: 'Kemenag RI (via equran.id)', license: 'Kemenag — izin redistribusi (audit)' },
  { key: 'muyassar', name: 'Tafsir al-Muyassar', lang: 'ar', source: 'Majma\' King Fahd (via Quran.com)', license: 'KFGQPC — bebas pakai (audit)' },
];

// per-surah bucket: { [ayah]: { kemenag, muyassar } }
const bySurah = new Map(); // n -> Map(ayah -> {edition:text})
function put(surah, ayah, edition, text) {
  if (!bySurah.has(surah)) bySurah.set(surah, new Map());
  const m = bySurah.get(surah);
  if (!m.has(ayah)) m.set(ayah, {});
  m.get(ayah)[edition] = (text || '').trim();
}

console.log('MUSHAF seed-tafsir — tafsir multi-edisi per ayat\n');

// 1) Kemenag (id) — per surah (114 panggilan)
let kemOk = 0;
for (let n = 1; n <= 114; n++) {
  try {
    const j = await getJSON(`https://equran.id/api/v2/tafsir/${n}`, { timeoutMs: 45000 });
    for (const t of j.data.tafsir) put(n, t.ayat, 'kemenag', t.teks);
    kemOk++;
    if (n % 30 === 0) console.log(`  kemenag ...${n}/114`);
  } catch (e) {
    console.warn(`  ! kemenag surah ${n} gagal: ${e.message}`);
  }
}
console.log(`  kemenag selesai: ${kemOk}/114`);

// 2) al-Muyassar (ar) — satu edisi penuh (Quran.com id=16)
let muyCount = 0;
try {
  const j = await getJSON('https://api.quran.com/api/v4/quran/tafsirs/16', { timeoutMs: 90000 });
  for (const t of (j.tafsirs || [])) {
    if (!t.verse_key) continue;
    const [s, a] = t.verse_key.split(':').map(Number);
    put(s, a, 'muyassar', t.text);
    muyCount++;
  }
  console.log(`  muyassar selesai: ${muyCount} entri`);
} catch (e) {
  console.warn(`  ! muyassar gagal: ${e.message} (lanjut tanpa edisi ar)`);
}

// 3) Tulis per-surah
let totalAyah = 0;
for (let n = 1; n <= 114; n++) {
  const m = bySurah.get(n);
  if (!m) continue;
  const ayahs = {};
  for (const [ayah, editions] of [...m.entries()].sort((a, b) => a[0] - b[0])) { ayahs[ayah] = editions; totalAyah++; }
  writeFileSync(fileURLToPath(new URL(`${n}.json`, OUT)), JSON.stringify({ surah: n, editions: EDITIONS, ayahs }));
}

writeFileSync(fileURLToPath(new URL('_editions.json', OUT)), JSON.stringify({ editions: EDITIONS, kemenag_surah: kemOk, muyassar_entri: muyCount }, null, 2));

if (kemOk === 0 && muyCount === 0) { console.error('\n✗ FAIL: tak ada tafsir terkumpul.'); process.exit(1); }
console.log(`\n✓ seed-tafsir OK — ${totalAyah} ayat ber-tafsir (edisi: ${EDITIONS.map((e) => e.key).join(', ')}) -> apps/web/public/data/tafsir/`);
