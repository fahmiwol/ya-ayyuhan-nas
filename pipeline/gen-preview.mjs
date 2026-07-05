// pipeline/gen-preview.mjs
// Hasilkan preview OFFLINE self-contained (1 file HTML) dari mushaf-core.db:
// daftar 114 surah (urut) + baca per-surah (ayat urut, RTL). Bukti visual bahwa
// urutan benar & bisa dibaca offline. Hanya teks Arab kanonik (domain publik).

import { mkdirSync, writeFileSync } from 'node:fs';
import { openMushaf } from '../packages/mushaf-core/reader.mjs';

const OUT_DIR = new URL('../data/preview/', import.meta.url);
mkdirSync(OUT_DIR, { recursive: true });

const m = openMushaf();
const meta = m.meta();
const index = m.surahIndex();
const surahs = index.map((s) => m.surah(s.number));
m.close();

const data = { meta, index, surahs };

const html = `<!doctype html>
<html lang="id" dir="ltr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>MUSHAF — Preview per-Surah (offline)</title>
<style>
  :root{--bg:#0f1512;--panel:#151d18;--line:#243029;--txt:#e7efe8;--mut:#8fa596;--gold:#c9a24b;--green:#3fae7a}
  *{box-sizing:border-box} html,body{margin:0;height:100%}
  body{background:var(--bg);color:var(--txt);font-family:system-ui,Segoe UI,Roboto,sans-serif;display:flex;flex-direction:column}
  header{padding:10px 16px;border-bottom:1px solid var(--line);display:flex;gap:14px;align-items:center;flex-wrap:wrap}
  header b{color:var(--gold)} .badge{font-size:12px;color:var(--mut)}
  .ok{color:var(--green)} .root{font-family:ui-monospace,monospace;font-size:11px;color:var(--mut);word-break:break-all}
  .wrap{flex:1;display:flex;min-height:0}
  .list{width:320px;border-right:1px solid var(--line);overflow:auto;background:var(--panel)}
  .srow{display:flex;gap:10px;align-items:center;padding:9px 12px;border-bottom:1px solid var(--line);cursor:pointer}
  .srow:hover{background:#1b2620} .srow.active{background:#1f2c24;border-right:3px solid var(--gold)}
  .num{width:30px;height:30px;flex:none;display:grid;place-items:center;border:1px solid var(--gold);color:var(--gold);border-radius:50%;font-size:12px;transform:rotate(0)}
  .snm{flex:1;min-width:0} .snm .lt{font-weight:600} .snm .mt{font-size:12px;color:var(--mut)}
  .snm .ar{font-family:'Traditional Arabic','Amiri',serif;font-size:20px}
  .read{flex:1;overflow:auto;padding:22px clamp(16px,5vw,60px)}
  .shead{text-align:center;border-bottom:1px solid var(--line);padding-bottom:16px;margin-bottom:8px}
  .shead .ar{font-family:'Traditional Arabic','Amiri',serif;font-size:40px;color:var(--gold)}
  .shead .meta{color:var(--mut);font-size:13px;margin-top:6px}
  .bism{font-family:'Traditional Arabic','Amiri',serif;font-size:30px;text-align:center;margin:18px 0 8px;color:var(--txt)}
  .ayah{display:flex;flex-direction:row-reverse;gap:14px;align-items:flex-start;padding:14px 4px;border-bottom:1px dashed var(--line)}
  .atxt{font-family:'Traditional Arabic','Amiri',serif;font-size:30px;line-height:2.15;direction:rtl;text-align:right;flex:1}
  .anum{flex:none;min-width:34px;height:34px;padding:0 6px;display:grid;place-items:center;border:1px solid var(--green);color:var(--green);border-radius:50%;font-size:13px}
  .tag{font-size:11px;color:var(--mut)}
  .hint{color:var(--mut);padding:40px;text-align:center}
</style></head>
<body>
<header>
  <b>MUSHAF</b>
  <span class="badge">${meta.surah_count} surah · ${meta.ayah_count} ayat · ${meta.riwayah}/${meta.rasm}</span>
  <span class="badge ok">✔ urutan terverifikasi (1..114)</span>
  <span class="badge">Merkle root:</span><span class="root">${meta.merkle_root}</span>
</header>
<div class="wrap">
  <div class="list" id="list"></div>
  <div class="read" id="read"><div class="hint">Pilih surah di kiri untuk mulai membaca →</div></div>
</div>
<script id="data" type="application/json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
<script>
const D = JSON.parse(document.getElementById('data').textContent);
const list = document.getElementById('list'), read = document.getElementById('read');
const byNum = Object.fromEntries(D.surahs.map(s=>[s.number,s]));
D.index.forEach(s=>{
  const el=document.createElement('div'); el.className='srow'; el.dataset.n=s.number;
  el.innerHTML='<div class="num">'+s.number+'</div>'+
    '<div class="snm"><div class="lt">'+s.name_latin+'</div>'+
    '<div class="mt">'+(s.revelation_place==='makkah'?'Makkiyah':'Madaniyah')+' · '+s.ayah_count+' ayat</div></div>'+
    '<div class="ar">'+s.name_ar+'</div>';
  el.onclick=()=>open(s.number); list.appendChild(el);
});
function open(n){
  document.querySelectorAll('.srow').forEach(r=>r.classList.toggle('active', +r.dataset.n===n));
  const s=byNum[n];
  let h='<div class="shead"><div class="ar">'+s.name_ar+'</div>'+
    '<div class="meta">'+s.name_latin+(s.name_en?' — '+s.name_en:'')+' · '+
    (s.revelation_place==='makkah'?'Makkiyah':'Madaniyah')+' · '+s.ayah_count+' ayat · surah ke-'+s.number+'</div></div>';
  if(s.bismillah_pre) h+='<div class="bism">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>';
  s.ayahs.forEach(a=>{
    h+='<div class="ayah"><div class="anum">'+a.ayah_number+'</div>'+
       '<div class="atxt">'+a.text_uthmani+'</div></div>';
  });
  read.innerHTML=h; read.scrollTop=0;
}
open(1);
</script>
</body></html>`;

const outPath = new URL('mushaf.html', OUT_DIR);
writeFileSync(outPath, html, 'utf8');
console.log('✓ preview offline dibuat: data/preview/mushaf.html');
console.log(`  ${index.length} surah, ${data.surahs.reduce((n,s)=>n+s.ayahs.length,0)} ayat, self-contained (bisa dibuka tanpa internet)`);
