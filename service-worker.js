const CACHE_NAME = 'empatia-cache-v1';
const urlsToCache = [
    '/', // Página principal
    '/index.html', // Página inicial
    '/styles.css', // Archivo de estilos
    '/script.js', // Archivo principal de JavaScript
    '/buscador.js', // Script de búsqueda
    '/mapa.js', // Script del mapa interactivo
    '/reseñas.js', // Script para gestionar reseñas
    '/assets/icons/empatia-icon-192x192.png', // Ícono 192x192
    '/assets/icons/empatia-icon-512x512.png', // Ícono 512x512
    '/chat.js', // Script del chat
    '/assets/fonts/custom-font.woff2', // Fuente personalizada si tienes
    '/assets/images/background.jpg', // Fondo de la página
    '/twitch-integration.js', // Script para integrar Twitch
    '/assets/videos/intro.mp4' // Video introductorio si lo necesitas
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Archivos en caché correctamente');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Caché obsoleta eliminada:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log('Respuesta desde caché:', event.request.url);
                return response;
            }
            console.log('Archivo no encontrado en caché, solicitando:', event.request.url);
            return fetch(event.request);
        })
    );
});
