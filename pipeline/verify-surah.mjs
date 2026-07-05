// pipeline/verify-surah.mjs
// GUARD URUTAN SURAH (fokus: "urutan sesuai semua, jangan salah").
// Membuktikan urutan & jumlah tidak salah dengan MEMBANDINGKAN mushaf-core.db
// (sumber: Quran.com QPC) terhadap REFERENSI KANONIK INDEPENDEN yang di-hardcode
// di bawah (jumlah ayat Hafs/Kufi standar + tempat turun). Dua sumber independen
// harus SETUJU di setiap surah — kalau beda 1 pun -> fail-closed.

import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

// === REFERENSI KANONIK INDEPENDEN (hitungan Hafs/Kufi, dipakai King Fahd & Kemenag) ===
// [nomor, nama_latin, jumlah_ayat, tempat_turun]  — urut WAJIB 1..114.
const REF = [
  [1,'Al-Fatihah',7,'makkah'],[2,'Al-Baqarah',286,'madinah'],[3,'Ali \'Imran',200,'madinah'],
  [4,'An-Nisa',176,'madinah'],[5,'Al-Ma\'idah',120,'madinah'],[6,'Al-An\'am',165,'makkah'],
  [7,'Al-A\'raf',206,'makkah'],[8,'Al-Anfal',75,'madinah'],[9,'At-Tawbah',129,'madinah'],
  [10,'Yunus',109,'makkah'],[11,'Hud',123,'makkah'],[12,'Yusuf',111,'makkah'],
  [13,'Ar-Ra\'d',43,'madinah'],[14,'Ibrahim',52,'makkah'],[15,'Al-Hijr',99,'makkah'],
  [16,'An-Nahl',128,'makkah'],[17,'Al-Isra',111,'makkah'],[18,'Al-Kahf',110,'makkah'],
  [19,'Maryam',98,'makkah'],[20,'Taha',135,'makkah'],[21,'Al-Anbya',112,'makkah'],
  [22,'Al-Hajj',78,'madinah'],[23,'Al-Mu\'minun',118,'makkah'],[24,'An-Nur',64,'madinah'],
  [25,'Al-Furqan',77,'makkah'],[26,'Ash-Shu\'ara',227,'makkah'],[27,'An-Naml',93,'makkah'],
  [28,'Al-Qasas',88,'makkah'],[29,'Al-\'Ankabut',69,'makkah'],[30,'Ar-Rum',60,'makkah'],
  [31,'Luqman',34,'makkah'],[32,'As-Sajdah',30,'makkah'],[33,'Al-Ahzab',73,'madinah'],
  [34,'Saba',54,'makkah'],[35,'Fatir',45,'makkah'],[36,'Ya-Sin',83,'makkah'],
  [37,'As-Saffat',182,'makkah'],[38,'Sad',88,'makkah'],[39,'Az-Zumar',75,'makkah'],
  [40,'Ghafir',85,'makkah'],[41,'Fussilat',54,'makkah'],[42,'Ash-Shura',53,'makkah'],
  [43,'Az-Zukhruf',89,'makkah'],[44,'Ad-Dukhan',59,'makkah'],[45,'Al-Jathiyah',37,'makkah'],
  [46,'Al-Ahqaf',35,'makkah'],[47,'Muhammad',38,'madinah'],[48,'Al-Fath',29,'madinah'],
  [49,'Al-Hujurat',18,'madinah'],[50,'Qaf',45,'makkah'],[51,'Adh-Dhariyat',60,'makkah'],
  [52,'At-Tur',49,'makkah'],[53,'An-Najm',62,'makkah'],[54,'Al-Qamar',55,'makkah'],
  [55,'Ar-Rahman',78,'madinah'],[56,'Al-Waqi\'ah',96,'makkah'],[57,'Al-Hadid',29,'madinah'],
  [58,'Al-Mujadila',22,'madinah'],[59,'Al-Hashr',24,'madinah'],[60,'Al-Mumtahanah',13,'madinah'],
  [61,'As-Saff',14,'madinah'],[62,'Al-Jumu\'ah',11,'madinah'],[63,'Al-Munafiqun',11,'madinah'],
  [64,'At-Taghabun',18,'madinah'],[65,'At-Talaq',12,'madinah'],[66,'At-Tahrim',12,'madinah'],
  [67,'Al-Mulk',30,'makkah'],[68,'Al-Qalam',52,'makkah'],[69,'Al-Haqqah',52,'makkah'],
  [70,'Al-Ma\'arij',44,'makkah'],[71,'Nuh',28,'makkah'],[72,'Al-Jinn',28,'makkah'],
  [73,'Al-Muzzammil',20,'makkah'],[74,'Al-Muddaththir',56,'makkah'],[75,'Al-Qiyamah',40,'makkah'],
  [76,'Al-Insan',31,'madinah'],[77,'Al-Mursalat',50,'makkah'],[78,'An-Naba',40,'makkah'],
  [79,'An-Nazi\'at',46,'makkah'],[80,'\'Abasa',42,'makkah'],[81,'At-Takwir',29,'makkah'],
  [82,'Al-Infitar',19,'makkah'],[83,'Al-Mutaffifin',36,'makkah'],[84,'Al-Inshiqaq',25,'makkah'],
  [85,'Al-Buruj',22,'makkah'],[86,'At-Tariq',17,'makkah'],[87,'Al-A\'la',19,'makkah'],
  [88,'Al-Ghashiyah',26,'makkah'],[89,'Al-Fajr',30,'makkah'],[90,'Al-Balad',20,'makkah'],
  [91,'Ash-Shams',15,'makkah'],[92,'Al-Layl',21,'makkah'],[93,'Ad-Duha',11,'makkah'],
  [94,'Ash-Sharh',8,'makkah'],[95,'At-Tin',8,'makkah'],[96,'Al-\'Alaq',19,'makkah'],
  [97,'Al-Qadr',5,'makkah'],[98,'Al-Bayyinah',8,'madinah'],[99,'Az-Zalzalah',8,'madinah'],
  [100,'Al-\'Adiyat',11,'makkah'],[101,'Al-Qari\'ah',11,'makkah'],[102,'At-Takathur',8,'makkah'],
  [103,'Al-\'Asr',3,'makkah'],[104,'Al-Humazah',9,'makkah'],[105,'Al-Fil',5,'makkah'],
  [106,'Quraysh',4,'makkah'],[107,'Al-Ma\'un',7,'makkah'],[108,'Al-Kawthar',3,'makkah'],
  [109,'Al-Kafirun',6,'makkah'],[110,'An-Nasr',3,'madinah'],[111,'Al-Masad',5,'makkah'],
  [112,'Al-Ikhlas',4,'makkah'],[113,'Al-Falaq',5,'makkah'],[114,'An-Nas',6,'makkah'],
];

const dbPath = fileURLToPath(new URL('../data/mushaf-core.db', import.meta.url));
const db = new DatabaseSync(dbPath, { readOnly: true });

let fail = 0;
const problems = [];
const P = (msg) => { problems.push(msg); fail++; };

console.log('MUSHAF verify-surah — GUARD URUTAN (2 sumber independen harus setuju)\n');

// 0) Referensi sendiri harus konsisten (1..114 & Σ=6236)
const refSum = REF.reduce((s, r) => s + r[2], 0);
if (REF.length !== 114) P(`REF bukan 114 baris (${REF.length})`);
REF.forEach((r, i) => { if (r[0] !== i + 1) P(`REF urutan rusak di indeks ${i}: nomor ${r[0]}`); });
if (refSum !== 6236) P(`REF Σ ayat = ${refSum} != 6236 (referensi salah ketik)`);
console.log(`Referensi independen: 114 surah, Σ ayat = ${refSum} ${refSum === 6236 ? '✓' : '✗'}`);

// 1) Ambil surah DB, urut nomor
const surahDb = db.prepare('SELECT number,name_ar,name_latin,revelation_place,ayah_count,order_revelation FROM surah ORDER BY number').all();
if (surahDb.length !== 114) P(`DB punya ${surahDb.length} surah (harap 114)`);

// 2) Bandingkan tiap surah: nomor urut, jumlah ayat (HARD), tempat turun (report)
let countMismatch = 0, placeMismatch = 0;
for (let i = 0; i < 114; i++) {
  const ref = REF[i];
  const s = surahDb[i];
  if (!s) { P(`surah #${i + 1} hilang di DB`); continue; }
  if (s.number !== ref[0]) P(`urutan salah di posisi ${i + 1}: DB nomor ${s.number} != ${ref[0]}`);
  if (s.ayah_count !== ref[2]) { P(`Surah ${ref[0]} (${ref[1]}): jumlah ayat DB ${s.ayah_count} != referensi ${ref[2]}`); countMismatch++; }
  // tempat turun: metadata (bisa beda pandangan minor) -> laporkan, tidak fail
  if (s.revelation_place !== ref[3]) { placeMismatch++; }
}
console.log(`Cocok jumlah ayat per-surah : ${114 - countMismatch}/114 ${countMismatch === 0 ? '✓' : '✗'}`);
console.log(`Cocok tempat turun (metadata): ${114 - placeMismatch}/114 ${placeMismatch === 0 ? '✓' : '(beda pandangan minor, non-fatal)'}`);

// 3) order_revelation harus permutasi 1..114 (valid, tanpa asумsi tradisi tertentu)
const revs = surahDb.map((s) => s.order_revelation).sort((a, b) => a - b);
const validPerm = revs.every((v, i) => v === i + 1);
if (!validPerm) P('order_revelation bukan permutasi 1..114 yang valid');
console.log(`Urutan pewahyuan valid (permutasi 1..114): ${validPerm ? '✓' : '✗'}`);

// 4) URUTAN AYAT GLOBAL: tiap surah kontigu, berurutan, dan surah k sebelum k+1
let prevMaxGlobal = 0, ayahOrderOK = true;
for (let n = 1; n <= 114; n++) {
  const rows = db.prepare('SELECT id,ayah_number FROM ayah WHERE surah_number=? ORDER BY id').all(n);
  const ref = REF[n - 1];
  // jumlah ayat sesuai referensi
  if (rows.length !== ref[2]) { P(`Surah ${n}: baris ayat ${rows.length} != referensi ${ref[2]}`); ayahOrderOK = false; }
  // ayah_number 1..count berurutan
  for (let k = 0; k < rows.length; k++) {
    if (rows[k].ayah_number !== k + 1) { P(`Surah ${n}: ayah_number ke-${k + 1} = ${rows[k].ayah_number}`); ayahOrderOK = false; break; }
  }
  // global id berurutan naik & mulai tepat setelah surah sebelumnya
  if (rows.length) {
    if (rows[0].id !== prevMaxGlobal + 1) { P(`Surah ${n}: global mulai ${rows[0].id}, harusnya ${prevMaxGlobal + 1}`); ayahOrderOK = false; }
    for (let k = 1; k < rows.length; k++) if (rows[k].id !== rows[k - 1].id + 1) { P(`Surah ${n}: global tidak kontigu di ${rows[k].id}`); ayahOrderOK = false; break; }
    prevMaxGlobal = rows[rows.length - 1].id;
  }
}
if (prevMaxGlobal !== 6236) P(`global ayat terakhir = ${prevMaxGlobal} != 6236`);
console.log(`Ayat per-surah kontigu & berurutan (1..6236): ${ayahOrderOK && prevMaxGlobal === 6236 ? '✓' : '✗'}`);

db.close();

// --- Hasil ------------------------------------------------------------------
if (fail) {
  console.error(`\n✗ GAGAL — ${fail} masalah urutan/jumlah:`);
  for (const p of problems.slice(0, 50)) console.error(`   · ${p}`);
  process.exit(1);
}
console.log('\n✓ URUTAN BENAR SEMUA — 114 surah urut 1..114, jumlah ayat cocok referensi independen,');
console.log('  tiap ayat kontigu 1..6236, tidak ada yang salah/tertukar. (2 sumber setuju penuh)');
