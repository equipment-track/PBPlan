const cacheName = 'budget-calculator-v1';
const assets = [
    './',
    './index.html',
    './style.css',
    './transaction.js',
    './records.js',
    './dashboard.js',
    './
    './manifest.json',
    './icon-192x192.png',
    './icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(assets);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});