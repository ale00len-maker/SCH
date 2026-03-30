/* ═══════════════════════════════════════════
   Start Crypto Hub — Service Worker v1.0
   Strategia: Cache-first per assets statici,
   Network-first per API/RSS (dati live)
═══════════════════════════════════════════ */

const CACHE_NAME = 'sch-v1';

// Assets da mettere in cache al primo avvio
const STATIC_ASSETS = [
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// URL che NON vanno in cache (sempre freschi)
const NETWORK_ONLY = [
  'api.coingecko.com',
  'api.rss2json.com',
  's3.tradingview.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

/* ── INSTALL: pre-cacha assets statici ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Pre-cache parziale:', err);
      });
    })
  );
  self.skipWaiting();
});

/* ── ACTIVATE: rimuove cache vecchie ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ── FETCH: strategia ibrida ── */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Richieste non-GET: passa direttamente
  if (event.request.method !== 'GET') return;

  // Network-only per dati live
  const isLive = NETWORK_ONLY.some(domain => url.hostname.includes(domain));
  if (isLive) {
    event.respondWith(fetch(event.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // Cache-first per assets statici, fallback network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // Offline fallback: serve index.html per navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
