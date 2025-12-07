
const CACHE_NAME = 'password-gen-v12';

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

  const url = new URL(event.request.url);

  // Estrategia Network First para navegación (HTML)
  // CRÍTICO: Si la red falla O devuelve 404, servimos index.html del caché
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si la respuesta es válida (200 OK), la actualizamos en caché y la devolvemos
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return response;
          }
          // Si el servidor devuelve 404 o error, forzamos el caché
          return caches.match('./index.html');
        })
        .catch(() => {
          // Si no hay red (offline), devolvemos index.html del caché
          return caches.match('./index.html');
        })
    );
    return;
  }

  // Estrategia Stale-While-Revalidate para recursos estáticos (JS, CSS, Imágenes)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Lanzamos fetch en segundo plano para actualizar caché futura
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

      // Devolvemos caché si existe, si no esperamos a la red
      return cachedResponse || fetchPromise;
    })
  );
});
