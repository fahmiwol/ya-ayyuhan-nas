// Service worker — network-first utk navigasi & data (biar update selalu kebaca),
// fallback cache saat offline. Ganti CACHE version tiap kali strategi berubah.
const CACHE = "mushaf-v2";

self.addEventListener("install", (e) => {
  self.skipWaiting(); // SW baru langsung ambil alih (hindari basi setelah deploy)
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isData = url.pathname.startsWith("/data/");
  if (!(isData || request.mode === "navigate")) return;

  // NETWORK-FIRST: coba jaringan (selalu fresh); simpan ke cache; fallback cache saat offline.
  e.respondWith(
    fetch(request)
      .then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});
