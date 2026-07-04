const CACHE_NAME = 'domino-v1';
const urlsToCache = [
    '/domino-profesional/',
    '/domino-profesional/index.html',
    '/domino-profesional/style.css',
    '/domino-profesional/app.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});