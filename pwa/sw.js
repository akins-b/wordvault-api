const CACHE_NAME = 'wordvault-v2';
const STATIC_ASSETS = [
  '/index.html',
  '/popup.html',
  '/dashboard.html',
  '/lookup.html',
  '/vault.html',
  '/settings.html',
  '/styles.css',
  '/popup.js',
  '/dashboard.js',
  '/lookup.js',
  '/vault.js',
  '/settings.js',
  '/shared.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Exclude Clerk completely from SW to prevent auth breakage and caching issues
  if (url.hostname.includes('clerk')) {
    return;
  }

  if (event.request.method === 'GET' && url.pathname.match(/^\/(entry|book|user)/)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (response.ok || response.type === 'opaque') {
          if (event.request.url.startsWith('http')) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(console.error);
          }
        }
        return response;
      });
    })
  );
});