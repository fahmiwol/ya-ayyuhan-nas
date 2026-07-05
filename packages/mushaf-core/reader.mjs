// packages/mushaf-core/reader.mjs
// API baca per-surah di atas mushaf-core.db (READ-ONLY). Ini lapisan yg dipakai
// app (Next.js) nanti. Tidak ada jalur tulis — murni query zona kanonik.

import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const dbPath = fileURLToPath(new URL('../../data/mushaf-core.db', import.meta.url));

export function openMushaf() {
  const db = new DatabaseSync(dbPath, { readOnly: true });

  const qIndex = db.prepare(
    `SELECT number, name_ar, name_latin, name_en, revelation_place, ayah_count, order_revelation, bismillah_pre
     FROM surah ORDER BY number`
  );
  const qSurah = db.prepare(
    `SELECT number, name_ar, name_latin, name_en, revelation_place, ayah_count, order_revelation, bismillah_pre
     FROM surah WHERE number = ?`
  );
  const qAyahs = db.prepare(
    `SELECT id AS global, ayah_number, text_uthmani, juz, hizb, page_madani, sajdah
     FROM ayah WHERE surah_number = ? ORDER BY ayah_number`
  );
  const qMeta = db.prepare('SELECT * FROM mushaf_meta LIMIT 1');

  return {
    meta: () => qMeta.get(),
    /** Daftar 114 surah, URUT 1..114. */
    surahIndex: () => qIndex.all(),
    /** Satu surah + semua ayatnya, URUT ayah_number 1..N. */
    surah(n) {
      const s = qSurah.get(n);
      if (!s) return null;
      return { ...s, ayahs: qAyahs.all(n) };
    },
    /** Navigasi antar surah (null di ujung). */
    neighbors(n) {
      return { prev: n > 1 ? n - 1 : null, next: n < 114 ? n + 1 : null };
    },
    close: () => db.close(),
  };
}
