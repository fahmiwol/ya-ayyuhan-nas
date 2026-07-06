# Deploy Ya Ayyuhan Nas — aman di server bersama (migancore)

> **Prinsip #1: JANGAN ganggu app lain.** Semua resource stack ini ber-prefix `yan_`
> (container/volume/network unik), DB tidak diekspos ke host, web hanya bind `127.0.0.1`.
> Kita **hanya menambah** — tidak menyentuh container/nginx/pm2 milik miganpro atau app lain.

Isolasi yang menjaga keamanan:
- Container: `yan_web`, `yan_db` (nama unik).
- Volume: `yan_pgdata`. Network: `yan_net`. Project: `yaayyuhannas`.
- Postgres: **tanpa `ports:`** → hanya jaringan internal (tak tabrakan 5432 host).
- Web: `127.0.0.1:3100:3000` → tak tabrakan port publik; nginx yang mem-proxy.

---

## 0. Pra-terbang (WAJIB — cek dulu, jangan asal)

```bash
# Di server. Pastikan tidak bentrok dengan app lain.
docker ps --format '{{.Names}}\t{{.Ports}}'         # tak ada yang bernama yan_* / tak pakai 3100
sudo ss -ltnp | grep -E ':3100|:5432' || echo "3100 & 5432 host bebas"
docker network ls | grep yan_net || echo "network bebas"
docker volume ls | grep yan_pgdata || echo "volume bebas"
```
- Kalau **3100 sudah dipakai** → set `WEB_PORT` lain di `.env` (mis. 3110).
- Jangan lanjut kalau ada resource `yan_*` tak dikenal.

## 1. Ambil kode & konfigurasi

```bash
sudo mkdir -p /opt/yaayyuhannas && cd /opt/yaayyuhannas   # DIR TERPISAH dari /opt/miganpro
# taruh repo di sini (git clone / rsync). Lalu:
cp .env.example .env
# isi .env:
#   POSTGRES_PASSWORD  → password kuat
#   AUTH_SECRET        → openssl rand -hex 32
#   WEB_PORT           → 3100 (atau lain bila bentrok)
openssl rand -hex 32   # tempel ke AUTH_SECRET
```

## 2. Build & jalankan (terisolasi)

```bash
cd /opt/yaayyuhannas
docker compose up -d --build
docker compose ps                      # yan_db (healthy) + yan_web (up)
docker compose logs -f web             # cek "Ready"
curl -s http://127.0.0.1:3100/api/auth/me   # {"user":null} = jalan
```
> Postgres skema dibuat OTOMATIS saat pertama konek (CREATE TABLE IF NOT EXISTS).

## 3. Nginx — TAMBAH server block baru (jangan edit punya app lain)

Buat file BARU `/etc/nginx/sites-available/yaayyuhannas` (subdomain sendiri, mis. `quran.migancore.com`):

```nginx
server {
    server_name quran.migancore.com;
    location / {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    listen 80;
}
```
```bash
sudo ln -s /etc/nginx/sites-available/yaayyuhannas /etc/nginx/sites-enabled/
sudo nginx -t          # WAJIB lolos sebelum reload
sudo systemctl reload nginx   # reload (bukan restart) → koneksi app lain tak putus
# TLS:
sudo certbot --nginx -d quran.migancore.com
```
> Pointing DNS `quran.migancore.com` → IP server dulu. **Tidak** menyentuh block miganpro.

## 4. Verifikasi

- `https://quran.migancore.com` tampil; daftar/masuk → catatan tersinkron ke akun.
- App lain (miganpro dll) **tetap normal**: `docker ps` semua up, situsnya jalan.

## 5. Update (rilis baru)

```bash
cd /opt/yaayyuhannas && git pull      # atau rsync
docker compose up -d --build web      # rebuild web saja; db tetap (data aman di volume)
```

## 6. Backup & rollback

```bash
# Backup DB (rutin/cron):
docker exec yan_db pg_dump -U yan yan | gzip > yan_$(date +%F).sql.gz
# Rollback rilis: checkout commit lama → docker compose up -d --build web
# Restore DB: gunzip -c yan_YYYY-MM-DD.sql.gz | docker exec -i yan_db psql -U yan -d yan
```

## 7. Cabut TOTAL (kalau perlu) — tanpa sentuh app lain

```bash
cd /opt/yaayyuhannas && docker compose down          # hentikan yan_web + yan_db
# data tetap di volume yan_pgdata. Hapus TOTAL termasuk data:
# docker compose down -v
sudo rm /etc/nginx/sites-enabled/yaayyuhannas && sudo nginx -t && sudo systemctl reload nginx
```

---

## DEPLOY AKTUAL — server `mix` (72.62.125.6), 2026-07-06 ✅

Live: **https://quran.migancore.com** (TLS Let's Encrypt). Catatan penting server ini:
- **nginx = aaPanel/BT** di `/www/server/nginx` (BUKAN `/etc/nginx`; `systemctl nginx` inactive).
  - vhost: `/www/server/panel/vhost/nginx/quran.migancore.com.conf`
  - test/reload: `/www/server/nginx/sbin/nginx -t` lalu `... -s reload`
  - nginx **1.24.0** → pakai `listen 443 ssl http2;` (BUKAN `http2 on;` yg 1.25+).
- **App kita:** `/opt/yaayyuhannas` · `docker compose` (yan_web+yan_db) · web `127.0.0.1:3100` · Postgres internal.
- **Repo akses:** deploy key read-only `~/.ssh/yan_deploy` (terdaftar di GitHub). Update: `cd /opt/yaayyuhannas && GIT_SSH_COMMAND="ssh -i ~/.ssh/yan_deploy -o IdentitiesOnly=yes" git pull && docker compose up -d --build web`.
- **TLS:** `certbot certonly --webroot -w /var/www/html -d quran.migancore.com` (acme location sudah di vhost) → auto-renew ikut certbot yg ada.
- **Isolasi terbukti:** 8 app lain (ixonomic*, emiga, miganpro, ado-*, hermes) tetap 301/healthy sebelum & sesudah.
- **⚠ WAJIB: matikan proxy_cache utk vhost ini.** aaPanel punya `proxy_cache cache_one` GLOBAL. Next.js kirim `cache-control: s-maxage=31536000` utk halaman statis → nginx cache HTML lama ~SETAHUN & abaikan tiap redeploy (gejala: menu/perubahan tak muncul walau container benar). Vhost quran WAJIB ada di `location /`:
  `proxy_cache off; proxy_no_cache 1; proxy_cache_bypass 1;`
  (Diagnosa: `curl 127.0.0.1:3100` = benar tapi via `:443` basi → itu nginx cache, bukan build.)

## Checklist keamanan (sebelum & sesudah)

- [ ] Port 3100 (atau WEB_PORT) & 5432 host tidak bentrok.
- [ ] `.env` diisi (AUTH_SECRET kuat, POSTGRES_PASSWORD kuat), TIDAK di-commit.
- [ ] `docker compose ps` → yan_db healthy, yan_web up.
- [ ] `nginx -t` lolos; pakai `reload` bukan `restart`.
- [ ] App lain (miganpro dll) dicek MASIH jalan setelah deploy.
- [ ] Backup DB terjadwal.
- [ ] Produksi: HTTPS aktif; pertimbangkan rate-limit + fail2ban.
