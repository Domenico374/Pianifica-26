const CACHE_NAME = 'pianifica-26-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// Installazione del Service Worker
self.addEventListener('install', (event) => {
  console.log('✅ Service Worker: Installazione in corso...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache aperta');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.error('❌ Errore cache:', err))
  );
  self.skipWaiting();
});

// Attivazione del Service Worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Attivazione in corso...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminazione cache vecchia:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Strategia di caching: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clona la risposta prima di metterla in cache
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        // Se la rete fallisce, usa la cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // Pagina offline di fallback
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Gestione messaggi dal client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
