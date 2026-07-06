// lib/evalgate.ts — "Lapisan Kepercayaan" (Eval-Gate ala isnad) sebagai KODE.
// Mengubah metadata provenance/grade yang berserakan menjadi SATU sinyal kepercayaan
// yang jujur, sadar-khilaf, dan fail-closed. Metodologi: 12_ISLAMIC_VALIDATION.md (7 langkah).
//
// Prinsip:
//  - Netral: bila ulama beda nilai → status "khilaf", TAMPILKAN semua, tak pilih pemenang.
//  - Fail-closed: yang tak bisa dinilai otomatis ditandai "na/perlu tinjau", TAK di-upgrade diam2.
//  - Transparan: teks mesin/lemah tetap ditampilkan apa adanya + label, tak disembunyikan.
//  - Teks Qur'an = mutawatir (diverifikasi jalur mushaf/Merkle), bukan lewat sanad hadits.

export type TrustTier =
  | "mutawatir" // teks Qur'an / transmisi massal → pasti
  | "sahih"
  | "hasan"
  | "daif"
  | "maudhu"
  | "disputed" // khilaf: penilaian ulama melintasi garis terima/tolak
  | "sourced" // beratribusi sumber, tanpa grade hadits (mis. tafsir, editorial)
  | "unreviewed"; // tanpa grade & belum diaudit → perlu tinjau

export interface ScholarGrade { by: string | null; grade: string; canonical: TrustTier | null }
export type StepStatus = "pass" | "warn" | "fail" | "na";
export interface EvalStep { n: number; name: string; status: StepStatus; note?: string }
export interface Provenance { source?: string; license?: string; url?: string; note?: string }

export interface TrustAssessment {
  tier: TrustTier;
  label: string;
  short: string; // label pendek utk badge
  color: string; // warna status (hex, ramah tema gelap/terang)
  icon: string;
  machine: boolean; // ada terjemahan mesin (overlay)
  quranic: boolean;
  scholars: ScholarGrade[];
  steps: EvalStep[]; // hasil 7-langkah gate
  provenance?: Provenance;
  disclaimer?: string;
  corroboration: number; // jumlah koleksi/jalur independen terdeteksi
  collections: string[]; // nama koleksi yang meriwayatkan (dari teks grade)
  muttafaq: boolean; // Bukhari & Muslim sepakat (muttafaq 'alaih) → korroborasi tertinggi
  reviewedBy?: string; // ditinjau manusia (reviewer/admin) — override
}

export interface EvalInput {
  kind: "quran" | "hadith" | "tafsir" | "doa" | "kisah";
  quranic?: boolean; // teks/rujukan adalah ayat Al-Qur'an
  grades?: { by?: string | null; grade: string }[]; // penilaian ulama (hadits)
  hasProvenance?: boolean; // ada sumber lengkap (kitab/koleksi + nomor / rujukan)
  corroboration?: number; // jumlah jalur/koleksi/ulama independen
  machine?: boolean; // konten memuat terjemahan mesin
  source?: Provenance;
}

const ORDER: Record<TrustTier, number> = { mutawatir: 6, sahih: 5, hasan: 4, sourced: 3, daif: 2, disputed: 2, maudhu: 1, unreviewed: 0 };

// Normalisasi string grade bebas (mis. "Hasan Sahih", "Sahih Lighairihi", "Shadh", "Munkar")
// → tier kanonik. Konservatif: istilah bermasalah (syadz/munkar/matruk) diperlakukan lemah.
export function canonicalGrade(s: string): TrustTier | null {
  const t = (s || "").toLowerCase();
  if (!t) return null;
  if (/maudhu|maudu|mawdu|fabricat|palsu|matruk|batil/.test(t)) return "maudhu";
  if (/da'?if|dha'?if|dhaif|daif|weak|lemah|munkar|sha(dh|adh|azd)|syadz|mursal|munqati|mu'?dal/.test(t)) return "daif";
  if (/mutawatir/.test(t)) return "mutawatir";
  if (/sahih|shahih|sohih|authentic/.test(t)) return "sahih"; // "hasan sahih"/"sahih lighairihi" → sahih
  if (/hasan|good/.test(t)) return "hasan";
  return null;
}

// Deteksi korroborasi (tawatur ≈ multi-sumber) dari teks grade/rujukan.
// Contoh: "Sahih Bukhari (142) Sahih Muslim (375)" → 2 koleksi, muttafaq 'alaih.
const COLLECTIONS: { re: RegExp; name: string }[] = [
  { re: /bukhari|bukhori/i, name: "Bukhari" },
  { re: /muslim/i, name: "Muslim" },
  { re: /abu ?daw|abi ?daw|dawud|dawood/i, name: "Abu Dawud" },
  { re: /tirmid[hz]?i|tirmizi/i, name: "Tirmidzi" },
  { re: /nasa'?i|nasai|nasa-?i/i, name: "an-Nasa'i" },
  { re: /ibn ?ma?jah|ibnu ?majah/i, name: "Ibn Majah" },
  { re: /ahmad|musnad/i, name: "Ahmad" },
  { re: /darimi/i, name: "ad-Darimi" },
  { re: /malik|muwatta/i, name: "Malik" },
  { re: /baihaqi|bayhaqi/i, name: "al-Baihaqi" },
  { re: /hakim/i, name: "al-Hakim" },
  { re: /t[ha]?abr?ani/i, name: "ath-Thabrani" },
  { re: /ibn ?hibban/i, name: "Ibn Hibban" },
];
export function deriveCorroboration(grades?: { grade: string }[]): { count: number; collections: string[]; muttafaq: boolean } {
  const blob = (grades ?? []).map((g) => g.grade || "").join(" ");
  const found = COLLECTIONS.filter((c) => c.re.test(blob)).map((c) => c.name);
  const muttafaq = found.includes("Bukhari") && found.includes("Muslim");
  // korroborasi minimal = jumlah koleksi; bila tak ada nama koleksi, pakai jumlah penilaian ulama sbg proksi
  const count = found.length || (grades?.length ?? 0);
  return { count, collections: found, muttafaq };
}

// Agregasi banyak penilaian ulama → satu tier.
// Melintasi garis (ada yg kuat & ada yg lemah) → "disputed" (khilaf nyata).
function aggregateGrades(scholars: ScholarGrade[]): TrustTier | null {
  const tiers = scholars.map((s) => s.canonical).filter((x): x is TrustTier => !!x);
  if (tiers.length === 0) return null;
  const strong = tiers.filter((t) => ORDER[t] >= ORDER.hasan); // sahih/hasan/mutawatir
  const weak = tiers.filter((t) => ORDER[t] <= ORDER.daif); // daif/maudhu
  if (strong.length && weak.length) return "disputed"; // khilaf melintasi garis
  if (strong.length) return strong.reduce((a, b) => (ORDER[a] <= ORDER[b] ? a : b)); // konservatif: ambil terendah yg kuat
  return weak.reduce((a, b) => (ORDER[a] <= ORDER[b] ? a : b)); // maudhu bila ada, selain itu daif
}

const META: Record<TrustTier, { label: string; short: string; color: string; icon: string }> = {
  mutawatir: { label: "Mutawatir — pasti (jalur mushaf)", short: "Mutawatir", color: "#16a34a", icon: "🔒" },
  sahih: { label: "Sahih — berdalil kuat", short: "Sahih", color: "#16a34a", icon: "✅" },
  hasan: { label: "Hasan — diterima sebagai hujjah", short: "Hasan", color: "#65a30d", icon: "✅" },
  sourced: { label: "Bersumber — beratribusi, tanpa grade hadits", short: "Bersumber", color: "#0891b2", icon: "📚" },
  daif: { label: "Da'if — lemah, bukan dasar hukum", short: "Da'if", color: "#d97706", icon: "⚠️" },
  disputed: { label: "Khilaf — ulama berbeda penilaian", short: "Khilaf", color: "#7c3aed", icon: "🔀" },
  maudhu: { label: "Maudhu' — palsu, tidak disebar sbg hadits", short: "Maudhu'", color: "#dc2626", icon: "⛔" },
  unreviewed: { label: "Perlu tinjau — belum bergrade / belum diaudit", short: "Perlu tinjau", color: "#64748b", icon: "🕵️" },
};

export function assess(input: EvalInput): TrustAssessment {
  const scholars: ScholarGrade[] = (input.grades ?? []).map((g) => ({ by: g.by ?? null, grade: g.grade, canonical: canonicalGrade(g.grade) }));
  const machine = !!input.machine;
  const quranic = !!input.quranic;
  const corr = deriveCorroboration(input.grades);
  const corroboration = input.corroboration ?? corr.count;
  const muttafaq = corr.muttafaq;

  // Tentukan tier
  let tier: TrustTier;
  if (quranic && input.kind !== "hadith") tier = "mutawatir"; // teks/ayat Qur'an
  else {
    const agg = aggregateGrades(scholars);
    if (agg) tier = agg;
    else if (input.hasProvenance || input.source) tier = "sourced"; // ada sumber tapi belum bergrade
    else tier = "unreviewed";
  }

  // 7 langkah gate (yang tak bisa dinilai otomatis = "na", TAK dianggap lulus)
  const gradeTier = aggregateGrades(scholars);
  const steps: EvalStep[] = [
    { n: 1, name: "Provenance", status: input.hasProvenance || input.source || quranic ? "pass" : "fail", note: quranic ? "Ayat Al-Qur'an (jalur mushaf)" : (input.source?.source ?? (input.hasProvenance ? "Sumber tercantum" : "Tidak ada sumber lengkap")) },
    { n: 2, name: "Sanad (isnad)", status: quranic ? "na" : scholars.length ? "warn" : "na", note: quranic ? "Tak perlu sanad hadits (teks mutawatir)" : "Rantai perawi belum dinilai otomatis — rujuk kitab primer" },
    { n: 3, name: "Grade resmi", status: quranic ? "pass" : gradeTier ? (ORDER[gradeTier] >= ORDER.hasan ? "pass" : gradeTier === "maudhu" ? "fail" : gradeTier === "disputed" ? "warn" : "warn") : "na", note: quranic ? "Mutawatir" : gradeTier ? META[gradeTier].short : "Belum ada grade" },
    { n: 4, name: "Matn / cross-check", status: "na", note: "Pemeriksaan isi (anti-syadz) belum otomatis" },
    { n: 5, name: "Korroborasi", status: muttafaq || corroboration >= 2 ? "pass" : corroboration === 1 ? "warn" : "na", note: muttafaq ? "Muttafaq 'alaih — Bukhari & Muslim sepakat" : corr.collections.length ? `${corr.collections.length} koleksi: ${corr.collections.join(", ")}` : corroboration ? `${corroboration} rujukan` : "Jumlah jalur belum dihitung" },
    { n: 6, name: "Khilaf (konsensus)", status: tier === "disputed" ? "warn" : scholars.length > 1 ? "pass" : "na", note: tier === "disputed" ? "Ada perbedaan penilaian — dicatat, tak dipilih pemenang" : scholars.length > 1 ? "Beberapa ulama sepakat" : "—" },
    { n: 7, name: "Label transparan", status: "pass", note: "Status & sumber ditampilkan ke pembaca" },
  ];

  const m = META[tier];
  let disclaimer: string | undefined;
  if (tier === "daif") disclaimer = "Riwayat lemah — sebagian ulama membolehkan untuk fadha'il a'mal dengan syarat (titik khilaf). Bukan dasar hukum.";
  else if (tier === "maudhu") disclaimer = "Dinilai palsu — tidak boleh disebarkan sebagai sabda Nabi ﷺ.";
  else if (tier === "disputed") disclaimer = "Ulama berbeda menilai — lihat rincian tiap penilaian; tidak diputuskan sepihak.";
  else if (tier === "unreviewed") disclaimer = "Belum bergrade/ditinjau. Perlakukan sebagai indikatif hingga diverifikasi ke sumber primer.";
  if (machine) disclaimer = `${disclaimer ? disclaimer + " " : ""}Memuat terjemahan mesin — belum ditinjau ahli.`;

  return { tier, label: m.label, short: m.short, color: m.color, icon: m.icon, machine, quranic, scholars, steps, provenance: input.source, disclaimer, corroboration, collections: corr.collections, muttafaq };
}
