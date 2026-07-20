/* Beard's Home Services — Service Worker
   Bump CACHE_VERSION whenever core assets change to force an update. */
const CACHE_VERSION = 'bhs-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const OFFLINE_URL = '/offline.html';

/* App shell — precached on install so the site opens instantly and works offline. */
const PRECACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/shared-styles.css',
  '/site.js',
  '/manifest.webmanifest',
  '/LOGO.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => {}) // never block install on a single failed asset
  );
});

self.addEventListener('activate', (event) => {
  const keep = [STATIC_CACHE, PAGE_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Allow the page to trigger an immediate update. */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

function isImage(request) {
  return request.destination === 'image' || /\.(?:png|jpe?g|gif|webp|svg|avif)$/i.test(new URL(request.url).pathname);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin GET requests. Let the browser deal with the rest
  // (analytics, POST form submits, cross-origin fonts, etc.).
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Page navigations: network-first so content stays fresh, with an offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Images: cache-first (they rarely change), fall back to network, then a tiny placeholder.
  if (isImage(request)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached);
      })
    );
    return;
  }

  // CSS / JS / everything else same-origin: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
