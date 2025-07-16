const CACHE_NAME = 'grafamara-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/history.html',
    '/services.html',
    '/partners.html',
    '/contact.html',
    '/style.css',
    '/script.js',
    '/languages.js',
    '/manifest.json',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});