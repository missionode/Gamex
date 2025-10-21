/**
 * Service Worker for Gamex PWA
 * Handles offline caching and install prompt
 */

const CACHE_NAME = 'gamex-v1.0.0';
const urlsToCache = [
    './',
    './index.html',
    './lobby.html',
    './game.html',
    './results.html',
    './styles/main.css',
    './js/audio.js',
    './js/animations.js',
    './js/bluetooth.js',
    './js/game-logic.js',
    './manifest.json'
];

/**
 * Install event - cache resources
 */
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Activation complete');
            return self.clients.claim();
        })
    );
});

/**
 * Fetch event - serve from cache, fallback to network
 */
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    console.log('[Service Worker] Serving from cache:', event.request.url);
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(error => {
                    console.error('[Service Worker] Fetch failed:', error);

                    // Return offline page if available
                    return caches.match('./index.html');
                });
            })
    );
});

/**
 * Message event - handle messages from clients
 */
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

/**
 * Sync event - background sync for game data (future enhancement)
 */
self.addEventListener('sync', event => {
    if (event.tag === 'sync-game-data') {
        event.waitUntil(syncGameData());
    }
});

/**
 * Sync game data with server (future enhancement)
 */
async function syncGameData() {
    console.log('[Service Worker] Syncing game data...');
    // Placeholder for future server sync
    return Promise.resolve();
}

/**
 * Periodic sync (future enhancement)
 */
self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-game-stats') {
        event.waitUntil(updateGameStats());
    }
});

/**
 * Update game stats (future enhancement)
 */
async function updateGameStats() {
    console.log('[Service Worker] Updating game stats...');
    // Placeholder for future analytics sync
    return Promise.resolve();
}

/**
 * Push notification (optional - not implemented per requirements)
 */
self.addEventListener('push', event => {
    console.log('[Service Worker] Push notification received');
    // Not implemented - per requirements
});

/**
 * Notification click (optional - not implemented per requirements)
 */
self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] Notification clicked');
    // Not implemented - per requirements
});

/**
 * Handle errors
 */
self.addEventListener('error', event => {
    console.error('[Service Worker] Error:', event.error);
});

/**
 * Handle unhandled rejections
 */
self.addEventListener('unhandledrejection', event => {
    console.error('[Service Worker] Unhandled rejection:', event.reason);
});

console.log('[Service Worker] Script loaded');
