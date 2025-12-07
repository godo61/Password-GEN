
const CACHE_NAME = 'password-gen-v3';
const INITIAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  // Forzar al SW a activarse inmediatamente
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Abriendo caché y guardando assets iniciales');
      return cache.addAll(INITIAL_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Tomar control de todos los clientes inmediatamente
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Borrando caché antigua:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET (como POST a APIs, aunque aquí no hay)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Estrategia para Navegación (HTML): Network First, Fallback to Cache
  // Esto soluciona el error 404 al recargar o abrir la app instalada
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
          // Si falla la red (offline), devolver siempre index.html
          console.log('Offline: Sirviendo index.html para navegación');
          return caches.match('./index.html');
        })
    );
    return;
  }

  // Estrategia para Recursos (JS, CSS, Imágenes): Cache First, Fallback to Network & Cache
  // Dado que Vite genera nombres con hash, cacheamos dinámicamente lo que se pida.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          // Validar respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Si falla imagen u otro recurso, podría devolverse un placeholder aquí si se quisiera
          return new Response('Offline resource not available');
        });
    })
  );
});
