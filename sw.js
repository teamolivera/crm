// Team Olivera CRM - Service Worker
const CACHE_NAME = 'crm-olivera-v' + Date.now();
const CACHE_FILES = ['/'];

// Al instalar: no cachear nada, siempre ir a la red
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

// Al activar: limpiar caches viejos
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch: siempre ir a la red primero, sin cache
self.addEventListener('fetch', function(e) {
  // Solo interceptar requests al mismo origen
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(function() {
          // Si falla la red, intentar cache como fallback
          return caches.match(e.request);
        })
    );
  }
});
