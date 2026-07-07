// pipeline/lab-validate.mjs — GERBANG WAJIB sebelum commit kajian Lab Tadabbur.
// Validasi fail-closed: skema + rujukan ayat vs MUSHAF KANONIK + guardrail label.
// Pakai: node pipeline/lab-validate.mjs            → validasi semua kajian di index
//        node pipeline/lab-validate.mjs <id>       → validasi satu kajian
// Exit code != 0 bila ada pelanggaran (jangan commit).

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const LAB = new URL('../apps/web/public/data/lab/', import.meta.url);
const SURAH = new URL('../apps/web/public/data/surah/', import.meta.url);
const read = (u) => JSON.parse(readFileSync(fileURLToPath(u), 'utf8'));

const LENS_KEYS = new Set(read(new URL('taxonomy.json', LAB)).lenses.map((l) => l.key));
const errs = [];
const err = (id, m) => errs.push(`  ✗ [${id}] ${m}`);

function validate(id) {
  const fp = new URL(`${id}.json`, LAB);
  if (!existsSync(fileURLToPath(fp))) { err(id, 'file kajian tidak ada'); return; }
  const s = read(fp);

  // Skema dasar
  if (!/^lab-study-v\d+$/.test(s.schema ?? '')) err(id, `schema tak dikenal: ${s.schema}`);
  if (s.id !== id) err(id, `id di file (${s.id}) != nama file`);
  for (const f of ['title', 'theme', 'inference', 'created']) if (!s[f]) err(id, `field wajib kosong: ${f}`);
  if (!Array.isArray(s.lenses) || s.lenses.length === 0) err(id, 'lenses kosong');
  if (!Array.isArray(s.authors) || s.authors.length === 0) err(id, 'authors kosong');
  if (!Number.isInteger(s.version) || s.version < 1) err(id, 'version wajib integer >= 1 (skema v2)');
  if (!Array.isArray(s.history) || s.history.length === 0) err(id, 'history kosong — setiap tadabbur DIREKAM');
  else if (s.history[s.history.length - 1].version !== s.version) err(id, 'history terakhir != version saat ini');

  // Guardrail: makna bersumber wajib ada (interpretasi tak boleh yatim dari tafsir)
  if (!s.sourced_meaning?.summary || !(s.sourced_meaning?.sources ?? []).length)
    err(id, 'sourced_meaning wajib (ringkas makna + sumber tafsir) — Hukum Besi provenance');

  // Lensa: key terdaftar di taxonomy, reading terisi
  for (const l of s.lenses ?? []) {
    if (!LENS_KEYS.has(l.lens)) err(id, `lensa tak terdaftar di taxonomy: ${l.lens}`);
    if (!l.reading || l.reading.length < 30) err(id, `reading lensa ${l.lens} kosong/terlalu pendek`);
  }

  // RUJUKAN vs MUSHAF KANONIK (fail-closed — teks tak pernah disalin, ref harus valid)
  const r = s.ref ?? {};
  const sfp = new URL(`${r.surah}.json`, SURAH);
  if (!Number.isInteger(r.surah) || !existsSync(fileURLToPath(sfp))) { err(id, `surah tak valid: ${r.surah}`); return; }
  const su = read(sfp);
  const found = su.ayahs.filter((a) => a.ayah >= r.from && a.ayah <= r.to).length;
  const expect = r.to - r.from + 1;
  if (expect < 1 || found !== expect) err(id, `rujukan ${r.surah}:${r.from}-${r.to} → ${found}/${expect} ayat di mushaf`);

  // Arsip: semua versi < current harus terekam
  for (let v = 1; v < s.version; v++) {
    if (!existsSync(fileURLToPath(new URL(`archive/${id}.v${v}.json`, LAB))))
      err(id, `arsip v${v} hilang — riwayat tadabbur wajib terekam (archive/${id}.v${v}.json)`);
  }
}

const only = process.argv[2];
const idx = read(new URL('index.json', LAB));
const targets = only ? [only] : idx.studies.map((s) => s.id);
for (const id of targets) validate(id);

// Index konsisten
if (!only) for (const e of idx.studies) {
  const fp = fileURLToPath(new URL(`${e.id}.json`, LAB));
  if (existsSync(fp)) { const s = JSON.parse(readFileSync(fp, 'utf8')); if (s.lenses?.length !== e.lenses) err(e.id, `index.lenses (${e.lenses}) != file (${s.lenses?.length})`); }
}

// Integritas SINTESIS (bila ada & validasi penuh): tiap evidence.id & principle → kajian/prinsip nyata.
if (!only && existsSync(fileURLToPath(new URL('synthesis.json', LAB)))) {
  const syn = read(new URL('synthesis.json', LAB));
  const studyIds = new Set(idx.studies.map((s) => s.id));
  const clusterKeys = new Set((syn.clusters ?? []).map((c) => c.key));
  const prinIds = new Set((syn.principles ?? []).map((p) => p.id));
  for (const p of syn.principles ?? []) {
    if (!clusterKeys.has(p.cluster)) err('synthesis', `prinsip ${p.id}: cluster tak terdaftar (${p.cluster})`);
    if (!(p.evidence ?? []).length) err('synthesis', `prinsip ${p.id}: tanpa evidence`);
    for (const e of p.evidence ?? []) if (!studyIds.has(e.id)) err('synthesis', `prinsip ${p.id}: evidence.id bukan kajian (${e.id})`);
  }
  for (const L of syn.blueprint?.layers ?? []) {
    if (!prinIds.has(L.principle)) err('synthesis', `blueprint lapis ${L.n}: principle tak dikenal (${L.principle})`);
  }
  if (!errs.length) console.log(`✓ sintesis: ${syn.principles.length} prinsip, ${syn.blueprint.layers.length} lapis blueprint — evidence & prinsip valid.`);
}

if (errs.length) { console.error(`LAB VALIDATE: ${errs.length} pelanggaran\n` + errs.join('\n')); process.exit(1); }
console.log(`✓ lab-validate: ${targets.length} kajian lolos (skema, sumber, rujukan mushaf, riwayat).`);
