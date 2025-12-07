
const CACHE_NAME = 'password-gen-v4';
const BASE_SCOPE = '/Password-GEN/';

// Lista de archivos vitales para que la app funcione offline
const INITIAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Cacheando assets iniciales');
      return cache.addAll(INITIAL_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Estrategia Network First para navegación (HTML)
  // Esto arregla el error 404 en GitHub Pages al refrescar
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // Si no hay red, devolvemos index.html del caché
          // Usamos la ruta relativa ./index.html que funciona dentro del scope
          return caches.match('./index.html') || caches.match('index.html');
        })
    );
    return;
  }

  // Estrategia Stale-While-Revalidate para recursos estáticos (JS, CSS, Imágenes)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallo silencioso en fetch de fondo
        });

      return cachedResponse || fetchPromise;
    })
  );
});
