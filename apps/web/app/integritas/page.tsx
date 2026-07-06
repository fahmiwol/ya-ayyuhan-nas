import { getIntegrity, getTrustStats } from "@/lib/mushaf";
import { IntegrityCheck } from "@/components/IntegrityCheck";

const TIER_META: Record<string, { label: string; color: string }> = {
  mutawatir: { label: "Mutawatir", color: "#16a34a" },
  sahih: { label: "Sahih", color: "#16a34a" },
  hasan: { label: "Hasan", color: "#65a30d" },
  sourced: { label: "Bersumber", color: "#0891b2" },
  disputed: { label: "Khilaf", color: "#7c3aed" },
  daif: { label: "Da'if", color: "#d97706" },
  maudhu: { label: "Maudhu'", color: "#dc2626" },
  unreviewed: { label: "Perlu tinjau", color: "#64748b" },
};
const TIER_ORDER = ["mutawatir", "sahih", "hasan", "sourced", "disputed", "daif", "maudhu", "unreviewed"];

interface SourceInfo { name?: string; provider?: string; url?: string; license?: string; version?: string }

export const metadata = { title: "Integritas — MUSHAF" };

export default async function IntegrityPage() {
  const it = (await getIntegrity()) as Record<string, unknown>;
  const cc = it.crosscheck_result as { tanzil?: Record<string, number>; kemenag?: Record<string, number>; documented_conventions?: Record<string, string>; note?: string };
  const canonical = it.canonical_source as SourceInfo;
  const crosscheck = (it.crosscheck_sources as SourceInfo[]) ?? [];
  const translations = it.translations as Record<string, SourceInfo>;
  const trust = await getTrustStats();
  const pct = (n?: number, d?: number) => (d ? ((n! / d) * 100).toFixed(3) : "0") + "%";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Integritas &amp; Keaslian</h1>
      <p className="mut mt-2 text-sm">
        Teks disalin harfiah lalu diverifikasi kriptografis. Setiap ayah di-hash (SHA-256), disusun jadi
        Merkle tree, dan root-nya di-pin. Ubah satu huruf pun → root berubah → terdeteksi.
      </p>

      <div className="card mt-6 p-5">
        <div className="mut text-xs">MERKLE ROOT ({String(it.algo)})</div>
        <div className="break-all font-mono text-sm gold">{String(it.merkle_root)}</div>
        <div className="mut mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <div><b className="text-[var(--txt)]">{String(it.surah_count)}</b> surah</div>
          <div><b className="text-[var(--txt)]">{String(it.ayah_count)}</b> ayat</div>
          <div>riwayat <b className="text-[var(--txt)]">{String(it.riwayah)}</b></div>
          <div>rasm <b className="text-[var(--txt)]">{String(it.rasm)}</b></div>
        </div>
        <div className="mt-4">
          <IntegrityCheck pinnedRoot={String(it.merkle_root)} ayahCount={Number(it.ayah_count)} />
        </div>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Verifikasi lintas-sumber (rasm)</h2>
      <p className="mut mt-1 text-sm">{cc?.note}</p>
      <div className="card mt-3 overflow-x-auto p-4 text-sm">
        <table className="w-full text-left">
          <thead className="mut">
            <tr><th className="py-1">Sumber</th><th>Tersedia</th><th>Akar konsonan (L3)</th></tr>
          </thead>
          <tbody>
            <tr><td className="py-1">Tanzil (CC BY 3.0)</td><td>{cc?.tanzil?.avail}</td><td className="green">{pct(cc?.tanzil?.L3, cc?.tanzil?.avail)}</td></tr>
            <tr><td className="py-1">Kemenag MSI</td><td>{cc?.kemenag?.avail}</td><td className="green">{pct(cc?.kemenag?.L3, cc?.kemenag?.avail)}</td></tr>
          </tbody>
        </table>
        {cc?.documented_conventions && Object.keys(cc.documented_conventions).length > 0 && (
          <div className="mut mt-3 text-xs">
            Beda konvensi ortografi terdokumentasi (bukan beda teks):{" "}
            {Object.entries(cc.documented_conventions).map(([k, v]) => (
              <div key={k} className="mt-1">• <b>{k}</b> — {v}</div>
            ))}
          </div>
        )}
      </div>

      {trust && (
        <>
          <h2 className="mt-8 text-lg font-semibold">Lapisan Kepercayaan Konten (Eval-Gate)</h2>
          <p className="mut mt-1 text-sm">
            Selain keaslian <i>teks Qur'an</i> (Merkle di atas), konten bernarasi (hadits, tafsir, doa) melewati gerbang
            validasi ala <b>isnad</b> (7 langkah). Status diturunkan dari sumber &amp; penilaian ulama; yang belum bisa
            dinilai otomatis <b>tidak</b> dianggap lulus (fail-closed). Perbedaan penilaian = <b>khilaf</b>, bukan dipilih sepihak.
          </p>

          {(() => {
            const t = trust.hadith;
            const segs = TIER_ORDER.filter((k) => t.byTier[k]).map((k) => ({ k, n: t.byTier[k], ...TIER_META[k] }));
            return (
              <div className="card mt-3 p-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <b className="text-sm">Hadits — {t.total} riwayat</b>
                  <span className="mut text-xs">{t.collections} koleksi</span>
                </div>
                <div className="flex h-4 w-full overflow-hidden rounded-full" style={{ background: "var(--bg-soft)" }}>
                  {segs.map((s) => (
                    <div key={s.k} title={`${s.label}: ${s.n}`} style={{ width: `${(s.n / t.total) * 100}%`, background: s.color }} />
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  {segs.map((s) => (
                    <span key={s.k} className="inline-flex items-center gap-1.5">
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                      {s.label} <b>{s.n}</b> <span className="mut">({Math.round((s.n / t.total) * 100)}%)</span>
                    </span>
                  ))}
                </div>
                <p className="mut mt-3 text-[11px]">
                  Jujur apa adanya: <b>{t.byTier.unreviewed ?? 0}</b> riwayat belum bergrade (perlu takhrij ke kitab primer),
                  {" "}<b>{t.byTier.disputed ?? 0}</b> khilaf. Grade otomatis dari string rujukan sumber — bukan fatwa.
                </p>
              </div>
            );
          })()}

          <div className="mut mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="card p-4">
              <b className="text-[var(--txt)]">Tafsir</b>
              <div className="mt-1">{trust.tafsir.machineArti.toLocaleString("id")} arti Indonesia = <span style={{ color: "#d97706" }}>🌐 terjemahan mesin</span> (belum ditinjau ahli). Edisi: {trust.tafsir.editions.join(", ")}.</div>
            </div>
            <div className="card p-4">
              <b className="text-[var(--txt)]">Doa</b>
              <div className="mt-1">{trust.doa.total} doa — {trust.doa.quranic} Qur'ani (teks mutawatir), {trust.doa.graded} bergrade hadits. Detail sanad per doa.</div>
            </div>
          </div>
        </>
      )}

      <h2 className="mt-8 text-lg font-semibold">Provenance &amp; lisensi</h2>
      <div className="card mt-3 p-4 text-sm">
        <SrcRow label="Teks kanonik (disimpan)" s={canonical} />
        {crosscheck.map((s, i) => <SrcRow key={i} label="Cross-check" s={s} />)}
        {translations && Object.entries(translations).map(([lang, s]) => <SrcRow key={lang} label={`Terjemahan ${lang.toUpperCase()}`} s={s} />)}
        <p className="mut mt-3 text-xs">⚠ Teks Arab domain publik; terjemahan berlisensi — audit ulang sebelum penggunaan komersial.</p>
      </div>
    </div>
  );
}

function SrcRow({ label, s }: { label: string; s: SourceInfo }) {
  if (!s) return null;
  return (
    <div className="border-b py-2 last:border-0" style={{ borderColor: "var(--line)" }}>
      <div className="mut text-xs">{label}</div>
      <div className="font-medium">{s.name ?? s.provider}</div>
      <div className="mut text-xs">{s.license}{s.version ? ` · ${s.version}` : ""}</div>
    </div>
  );
}
