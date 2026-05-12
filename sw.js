// Team Olivera CRM - Service Worker
// Cambiar este número en cada deploy para forzar actualización
const CACHE_VERSION = '2026-05-12-v2';
const CACHE_NAME = 'crm-olivera-' + CACHE_VERSION;

self.addEventListener('install', function(e) {
  // Activar inmediatamente sin esperar
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  // Eliminar todos los caches viejos
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    }).then(function() {
      // Tomar control de todas las pestañas abiertas
      return self.clients.claim();
    }).then(function() {
      // Notificar a todas las pestañas que recarguen
      return self.clients.matchAll({type: 'window'}).then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({type: 'RELOAD'});
        });
      });
    })
  );
});

// Siempre ir a la red, nunca usar cache
self.addEventListener('fetch', function(e) {
  if(e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      fetch(e.request, {cache: 'no-store'}).catch(function() {
        return caches.match(e.request);
      })
    );
  }
});
