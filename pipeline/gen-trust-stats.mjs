// pipeline/gen-trust-stats.mjs
// Hitung distribusi TIER kepercayaan (Eval-Gate) di seluruh konten bernarasi → public/data/trust.json.
// Dipakai halaman Integritas utk transparansi jujur ("berapa yang berdalil kuat vs perlu tinjau").
// CATATAN: logika canonicalGrade/aggregate DISALIN dari apps/web/lib/evalgate.ts (TS↔mjs split).
// Jika mengubah aturan grade di sana, ubah juga di sini agar tak melenceng.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DATA = new URL('../apps/web/public/data/', import.meta.url);

const ORDER = { mutawatir: 6, sahih: 5, hasan: 4, sourced: 3, daif: 2, disputed: 2, maudhu: 1, unreviewed: 0 };
function canonicalGrade(s) {
  const t = (s || '').toLowerCase(); if (!t) return null;
  if (/maudhu|maudu|mawdu|fabricat|palsu|matruk|batil/.test(t)) return 'maudhu';
  if (/da'?if|dha'?if|dhaif|daif|weak|lemah|munkar|sha(dh|adh|azd)|syadz|mursal|munqati|mu'?dal/.test(t)) return 'daif';
  if (/mutawatir/.test(t)) return 'mutawatir';
  if (/sahih|shahih|sohih|authentic/.test(t)) return 'sahih';
  if (/hasan|good/.test(t)) return 'hasan';
  return null;
}
function aggregate(grades) {
  const tiers = (grades || []).map((g) => canonicalGrade(g.grade)).filter(Boolean);
  if (!tiers.length) return null;
  const strong = tiers.filter((t) => ORDER[t] >= ORDER.hasan);
  const weak = tiers.filter((t) => ORDER[t] <= ORDER.daif);
  if (strong.length && weak.length) return 'disputed';
  if (strong.length) return strong.reduce((a, b) => (ORDER[a] <= ORDER[b] ? a : b));
  return weak.reduce((a, b) => (ORDER[a] <= ORDER[b] ? a : b));
}

// ── Hadits ──
const hadithDir = fileURLToPath(new URL('hadith/', DATA));
const hadith = { total: 0, byTier: {}, machine: 0, collections: 0 };
for (const f of readdirSync(hadithDir)) {
  if (!/\.json$/.test(f) || f === 'index.json') continue;
  const d = JSON.parse(readFileSync(fileURLToPath(new URL(`hadith/${f}`, DATA)), 'utf8'));
  hadith.collections++;
  for (const h of d.hadiths) {
    hadith.total++;
    const tier = (h.grades && h.grades.length) ? aggregate(h.grades) : 'unreviewed';
    hadith.byTier[tier] = (hadith.byTier[tier] || 0) + 1;
    if (h.tr?.id_auto && !h.tr?.id) hadith.machine++;
  }
}

// ── Tafsir (edisi Arab + arti mesin) ──
const tafsirDir = fileURLToPath(new URL('tafsir/', DATA));
const tafsir = { entries: 0, machineArti: 0, editions: new Set() };
if (existsSync(tafsirDir)) {
  for (let s = 1; s <= 114; s++) {
    const fp = fileURLToPath(new URL(`tafsir/${s}.json`, DATA));
    if (!existsSync(fp)) continue;
    const d = JSON.parse(readFileSync(fp, 'utf8'));
    (d.editions || []).forEach((e) => tafsir.editions.add(e.key));
    const arKeys = (d.editions || []).filter((e) => e.lang === 'ar').map((e) => e.key);
    for (const a of Object.values(d.ayahs)) {
      for (const k of arKeys) { if (a[k]) { tafsir.entries++; if (a[`${k}_id`]) tafsir.machineArti++; } }
    }
  }
}

// ── Doa ──
const doa = { total: 0, quranic: 0, graded: 0 };
const doaFp = fileURLToPath(new URL('doa.json', DATA));
if (existsSync(doaFp)) {
  const d = JSON.parse(readFileSync(doaFp, 'utf8'));
  for (const cat of d.categories || []) for (const x of cat.duas || []) {
    doa.total++;
    if (x.ref && /^QS/i.test(x.ref)) doa.quranic++;
    if (x.grade) doa.graded++;
  }
}

const out = {
  built_at: new Date().toISOString(),
  methodology: '12_ISLAMIC_VALIDATION.md',
  note: 'Distribusi status Eval-Gate. Langkah yang belum bisa dinilai otomatis TIDAK dianggap lulus (fail-closed). Grade dari rujukan sumber; perbedaan penilaian = "khilaf".',
  hadith,
  tafsir: { entries: tafsir.entries, machineArti: tafsir.machineArti, editions: [...tafsir.editions] },
  doa,
};
writeFileSync(fileURLToPath(new URL('trust.json', DATA)), JSON.stringify(out, null, 2));
console.log('✓ trust.json ditulis');
console.log('  hadits:', hadith.total, JSON.stringify(hadith.byTier));
console.log('  tafsir arti mesin:', tafsir.machineArti, '/', tafsir.entries);
console.log('  doa:', doa.total, `(qur'ani ${doa.quranic}, bergrade ${doa.graded})`);
