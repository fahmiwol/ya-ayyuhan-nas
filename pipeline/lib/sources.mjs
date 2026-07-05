// pipeline/lib/sources.mjs
// Definisi sumber + fetcher. Setiap sumber punya PROVENANCE (nama, url, lisensi, versi).
// Aturan CLAUDE.md #4: tidak ada data yatim tanpa atribusi.

export const SOURCES = {
  // === TEKS ARAB (rasm Uthmani, Hafs) ===

  // GROUND-TRUTH kanonik yang DISIMPAN. Teks QPC (King Fahd Complex) via Quran.com.
  // Basmalah terpisah dari ayat 1 (bersih per-ayah).
  quran_com: {
    id: 'quran_com_qpc_uthmani',
    name: 'Quran.com — QPC Uthmani (Hafs)',
    role: 'arabic-canonical',
    provider: 'Quran.Foundation / QUL (King Fahd Complex text)',
    url: 'https://api.quran.com/api/v4/quran/verses/uthmani',
    license: 'KFGQPC text — free use; audit ulang untuk komersial',
    version: 'QUL v4 / QPC Hafs',
    lang: 'ar',
  },

  // Cross-check #1: Tanzil Uthmani (CC BY 3.0) via AlQuran Cloud.
  // CATATAN: edisi ini menempelkan basmalah ke ayat 1 (kecuali Al-Fatihah & At-Taubah).
  alquran_cloud: {
    id: 'tanzil_uthmani_alqurancloud',
    name: 'Tanzil Uthmani (via AlQuran Cloud)',
    role: 'arabic-crosscheck',
    provider: 'Tanzil.net',
    url: 'https://api.alquran.cloud/v1/quran/quran-uthmani',
    license: 'CC BY 3.0 (verbatim OK, mengubah TIDAK boleh)',
    version: 'Tanzil 1.1',
    lang: 'ar',
  },

  // Cross-check #2: Kemenag RI — Mushaf Standar Indonesia (via equran.id).
  equran_id: {
    id: 'kemenag_msi_equran',
    name: 'Kemenag RI — Mushaf Standar Indonesia (via equran.id)',
    role: 'arabic-crosscheck',
    provider: 'Kemenag LPMQ / equran.id',
    url: 'https://equran.id/api/v2/surat/{n}',
    license: 'Kemenag (redistribusi perlu izin resmi) — audit',
    version: 'equran.id v2',
    lang: 'ar',
  },

  // === TERJEMAHAN ===
  translation_id_kemenag: {
    id: 'kemenag_translation_id',
    name: 'Terjemahan Kemenag (Indonesia)',
    role: 'translation',
    provider: 'Kemenag RI (via AlQuran Cloud id.indonesian)',
    url: 'https://api.alquran.cloud/v1/quran/id.indonesian',
    license: 'Kemenag (izin untuk redistribusi) — audit',
    version: 'AlQuran Cloud id.indonesian',
    lang: 'id',
  },
  translation_en_sahih: {
    id: 'sahih_international_en',
    name: 'Sahih International (English)',
    role: 'translation',
    provider: 'Sahih International (via AlQuran Cloud en.sahih)',
    url: 'https://api.alquran.cloud/v1/quran/en.sahih',
    license: 'Umumnya boleh redistribusi — audit',
    version: 'AlQuran Cloud en.sahih',
    lang: 'en',
  },
};

const UA = { 'User-Agent': 'MUSHAF-pipeline/0.1 (verification build)', Accept: 'application/json' };

/** fetch JSON dengan retry sederhana + timeout. */
export async function getJSON(url, { tries = 3, timeoutMs = 60000 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= tries; attempt++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { headers: UA, signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return await res.json();
    } catch (err) {
      clearTimeout(t);
      lastErr = err;
      if (attempt < tries) await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw new Error(`gagal fetch ${url}: ${lastErr?.message}`);
}
