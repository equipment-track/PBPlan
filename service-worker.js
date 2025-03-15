const cacheName = 'budget-calculator-v1';
const assets = [
    './',
    './index.html',
    './style.css',
    './transaction.js',
    './records.js',
    './dashboard.js',
    './settings.js',
    './tabs.js',
    './manifest.json',
    './icon-192x192.png',
    './icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll(assets))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('push', event => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: './icon-192x192.png'
    });
});
