import { getIntegrity } from "@/lib/mushaf";
import { IntegrityCheck } from "@/components/IntegrityCheck";

interface SourceInfo { name?: string; provider?: string; url?: string; license?: string; version?: string }

export const metadata = { title: "Integritas — MUSHAF" };

export default async function IntegrityPage() {
  const it = (await getIntegrity()) as Record<string, unknown>;
  const cc = it.crosscheck_result as { tanzil?: Record<string, number>; kemenag?: Record<string, number>; documented_conventions?: Record<string, string>; note?: string };
  const canonical = it.canonical_source as SourceInfo;
  const crosscheck = (it.crosscheck_sources as SourceInfo[]) ?? [];
  const translations = it.translations as Record<string, SourceInfo>;
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
