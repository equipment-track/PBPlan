const CACHE_NAME = 'budget-pwa-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/transactions.html',
    '/settings.html',
    '/style.css',
    '/script.js',
    '/manifest.json'
];

// Install service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch data from cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                return cachedResponse || fetch(event.request);
            })
    );
});