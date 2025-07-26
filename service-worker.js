const CACHE_NAME = 'exdev-cache-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/hire-us.html',
    '/quote.html',
    '/pricing.html',
    '/terms-of-service.html',
    '/privacy-policy.html',
    '/style.css',
    '/style-responsive.css',
    '/script.js',
    '/script-responsive.js',
    '/counter.js',
    '/public/images/logo.png',
    '/public/images/favicon-32x32.png',
    '/public/images/favicon-16x16.png',
    '/public/images/apple-touch-icon.png',
    '/public/fonts/inter-var.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});



// Update Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Handle offline fallback
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Handle offline scenarios
    if (!navigator.onLine) {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    return caches.match('/offline.html');
                })
                .catch(() => {
                    return caches.match('/offline.html');
                })
        );
        return;
    }

    // Handle online requests with cache-first strategy
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then((response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            })
                            .catch((error) => {
                                console.error('Error caching response:', error);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.error('Fetch failed:', error);
                        // Return offline page for navigation requests
                        if (event.request.destination === 'document') {
                            return caches.match('/offline.html');
                        }
                        return new Response('Network error', { status: 503 });
                    });
            })
    );
}); 