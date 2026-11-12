---
id: DEPLOY
jenis: runbook
judul: Deploy quran.migancore.com
status: aktif
cluster: inti
terkait: [D-001, EPIC-001]
dibuat: 2026-11-12
diubah: 2026-11-13
---

# Deploy — Ya Ayyuhan Nas (`quran.migancore.com`)

> Menggantikan `deploy/README.md` (jalur Docker + Postgres di VPS-1, server itu sudah mati).
> Setiap langkah yang mengubah server live: laporkan ke Fahmi dan minta izin (D-001, MiganExp D-049 §5).
> Detail akses server (alias SSH, IP) ada di catatan privat, tidak di repo publik ini.

## Target
| | |
|---|---|
| Domain | `https://quran.migancore.com` (sertifikat Let's Encrypt lewat certbot, perpanjang otomatis) |
| Server | VPS-2 ekosistem MiganExp |
| App | `quran-web.service` (systemd), pengguna `quran`, `127.0.0.1:3120`, `MemoryMax=600M` |
| Rilis | `/srv/migancore/quran/rilis/<sha>`; yang aktif = symlink `/srv/migancore/quran/kini` |
| nginx | `/etc/nginx/sites-available/quran.migancore.com` (vhost sendiri; tidak menyentuh vhost lain) |
| Mode | baca-saja: build dengan `NEXT_PUBLIC_MODE_BACA=1` (lihat `apps/web/middleware.ts`) |

## Build (di laptop/Bmax, bukan di server)
```bash
node pipeline/lab-validate.mjs && node pipeline/test-integrity.mjs      # gerbang data
cd apps/web && rm -rf .next && NEXT_PUBLIC_MODE_BACA=1 npm run build
cd .next/standalone && cp -r ../../public ./ && mkdir -p .next && cp -r ../static .next/
rm -rf node_modules/@img/sharp-win32* node_modules/@next/swc-win32*      # biner Windows tidak dipakai (app tidak memakai next/image)
PORT=3459 HOSTNAME=127.0.0.1 node server.js &                             # uji lokal
node ../../../../pipeline/test-mode-baca.mjs http://127.0.0.1:3459        # harus 17/17
tar --force-local -czf quran-<sha>.tgz . && sha256sum quran-<sha>.tgz     # <sha> = git rev-parse --short HEAD (sudah di-commit)
```
Catatan: jalankan perintah build dari luar folder `.next/standalone`; shell yang berdiri di dalamnya mengunci folder di Windows.

## Rilis & verifikasi live
```bash
scp quran-<sha>.tgz <alias-vps2>:/tmp/
ssh <alias-vps2> '
  echo "<sha256>  /tmp/quran-<sha>.tgz" | sha256sum -c &&
  R=/srv/migancore/quran/rilis/<sha> && mkdir -p $R && tar -xzf /tmp/quran-<sha>.tgz -C $R &&
  chown -R root:root $R && chmod -R a+rX $R &&
  ln -sfn $R /srv/migancore/quran/kini && systemctl restart quran-web && systemctl is-active quran-web &&
  rm /tmp/quran-<sha>.tgz'
node pipeline/test-mode-baca.mjs https://quran.migancore.com             # harus 17/17
```
Untuk rilis yang menyentuh nginx: potret kode status semua vhost sebelum dan sesudah, lalu `diff` (harus kosong).

## Rollback
```bash
ssh <alias-vps2> 'ls /srv/migancore/quran/rilis; ln -sfn /srv/migancore/quran/rilis/<sha-lama> /srv/migancore/quran/kini && systemctl restart quran-web'
```
Mematikan total: `systemctl disable --now quran-web`, hapus symlink vhost di `sites-enabled`, `nginx -t && systemctl reload nginx`.
Simpan paling banyak 3 rilis di `rilis/`; hapus yang lebih lama setelah rilis baru terverifikasi live.

## Riwayat rilis
| Tanggal | sha | Isi | Hasil live |
|---|---|---|---|
| 13 Nov 2026 | `e76c293` | terbit ulang mode baca-saja | 14/17 (3 halaman tertutup 500 di balik nginx) |
| 13 Nov 2026 | `6ef967a` | halaman tertutup jawab 404 langsung | 17/17; 70 vhost lain tidak berubah |
