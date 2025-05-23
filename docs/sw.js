/**
 * Service Worker for Ralph Website
 * Provides caching strategies for better performance and offline functionality
 */

const CACHE_NAME = 'ralph-v1.0.0';
const STATIC_CACHE = 'ralph-static-v1.0.0';
const DYNAMIC_CACHE = 'ralph-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/privacy-policy.html',
    '/terms-of-service.html',
    '/site.webmanifest',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(error => {
                console.error('Failed to cache static assets:', error);
            })
    );
    
    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName.startsWith('ralph-') && 
                                   cacheName !== STATIC_CACHE && 
                                   cacheName !== DYNAMIC_CACHE;
                        })
                        .map(cacheName => {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
    );
    
    // Take control of all pages immediately
    self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests with appropriate strategies
    if (isStaticAsset(request)) {
        // Cache First strategy for static assets
        event.respondWith(cacheFirst(request));
    } else if (isAPIRequest(request)) {
        // Network First strategy for API requests
        event.respondWith(networkFirst(request));
    } else if (isNavigationRequest(request)) {
        // Stale While Revalidate for navigation
        event.respondWith(staleWhileRevalidate(request));
    } else {
        // Default: try network, fallback to cache
        event.respondWith(networkFirst(request));
    }
});

/**
 * Cache First Strategy - good for static assets
 */
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache first failed:', error);
        return new Response('Network error', { status: 503 });
    }
}

/**
 * Network First Strategy - good for API requests and dynamic content
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Content not available offline', { 
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

/**
 * Stale While Revalidate - good for frequently updated content
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(error => {
        console.log('Network failed for stale-while-revalidate:', error);
        return cachedResponse;
    });
    
    return cachedResponse || fetchPromise;
}

/**
 * Helper functions to categorize requests
 */
function isStaticAsset(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|webp|woff|woff2|ttf|ico)$/);
}

function isAPIRequest(request) {
    const url = new URL(request.url);
    return url.pathname.includes('/api/') || 
           url.hostname.includes('forms.google.com') ||
           url.hostname.includes('analytics.google.com');
}

function isNavigationRequest(request) {
    return request.mode === 'navigate' || 
           (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

// Handle background sync for form submissions when offline
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync-forms') {
        event.waitUntil(syncFormData());
    }
});

/**
 * Sync form data when connection is restored
 */
async function syncFormData() {
    // Implementation for syncing cached form submissions
    // This would retrieve form data from IndexedDB and submit when online
    console.log('Background sync for forms triggered');
}

// Handle push notifications (for future use)
self.addEventListener('push', event => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body || 'New update from Ralph',
        icon: '/android-chrome-192x192.png',
        badge: '/android-chrome-192x192.png',
        data: data.url || '/',
        actions: [
            {
                action: 'open',
                title: 'Open',
                icon: '/android-chrome-192x192.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Ralph Update', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        const url = event.notification.data || '/';
        event.waitUntil(
            clients.openWindow(url)
        );
    }
});