const CACHE_VERSION = 'mathquest-v4';
const APP_SHELL_CACHE = `${CACHE_VERSION}-app-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const DEPENDENCY_CACHE = `${CACHE_VERSION}-dependencies`;

const APP_SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

const EXTERNAL_DEPENDENCIES = [
  'https://cdn.tailwindcss.com/',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap'
];

const STATIC_ASSET_HOSTS = new Set([
  'cdn.tailwindcss.com',
  'unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'www.gstatic.com'
]);

/*
 * Stores optional CDN files without blocking the install.
 */
function cacheExternalDependencies() {
  return caches.open(DEPENDENCY_CACHE)
    .then(cache => Promise.allSettled(
      EXTERNAL_DEPENDENCIES.map(asset => cache.add(asset))
    ));
}

/*
 * Installs the app shell and warms dependency caches for offline launches.
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then(cache => cache.addAll(APP_SHELL_ASSETS))
      .then(() => cacheExternalDependencies())
      .then(() => self.skipWaiting())
  );
});

/*
 * Removes old caches and takes control of existing tabs after activation.
 */
self.addEventListener('activate', event => {
  const currentCaches = new Set([APP_SHELL_CACHE, RUNTIME_CACHE, DEPENDENCY_CACHE]);

  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(cacheName => !currentCaches.has(cacheName))
          .map(cacheName => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

/*
 * Serves navigations from the network first, then falls back to the cached app shell.
 */
function handleNavigation(request) {
  return fetch(request)
    .then(response => {
      if (!response || response.status >= 400) {
        throw new Error(`Navigation failed with status ${response ? response.status : 'unknown'}`);
      }

      const responseCopy = response.clone();

      caches.open(APP_SHELL_CACHE)
        .then(cache => cache.put('./index.html', responseCopy));

      return response;
    })
    .catch(() => caches.match('./index.html'));
}

/*
 * Uses cache first for same-origin files and trusted static CDN assets.
 */
function handleStaticAsset(request) {
  return caches.match(request, { ignoreSearch: true })
    .then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then(response => {
          if (!response || response.status >= 400) {
            return response;
          }

          const responseCopy = response.clone();

          caches.open(RUNTIME_CACHE)
            .then(cache => cache.put(request, responseCopy));

          return response;
        });
    })
    .catch(() => {
      if (request.destination === 'style') {
        return new Response('', {
          headers: { 'Content-Type': 'text/css' }
        });
      }

      return new Response('', {
        status: 504,
        statusText: 'Offline asset unavailable'
      });
    });
}

/*
 * Routes only safe GET requests through the offline cache layer.
 */
self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (
    requestUrl.origin === self.location.origin ||
    STATIC_ASSET_HOSTS.has(requestUrl.hostname)
  ) {
    event.respondWith(handleStaticAsset(request));
  }
});
