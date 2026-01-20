// Service Worker for Equity Loan Portal PWA
const CACHE_NAME = 'equity-loan-portal-v1.0.0'
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    // Add other critical assets here
]

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching app shell')
                return cache.addAll(urlsToCache)
            })
            .then(() => self.skipWaiting())
    )
})

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName)
                        return caches.delete(cacheName)
                    }
                })
            )
        }).then(() => self.clients.claim())
    )
})

// Fetch event
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return

    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) return

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found
                if (response) {
                    return response
                }

                // Clone the request
                const fetchRequest = event.request.clone()

                // Make network request
                return fetch(fetchRequest)
                    .then(response => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response
                        }

                        // Clone the response
                        const responseToCache = response.clone()

                        // Cache the response
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache)
                            })

                        return response
                    })
                    .catch(error => {
                        console.error('Fetch failed:', error)

                        // Return offline page or cached data
                        if (event.request.destination === 'document') {
                            return caches.match('/')
                        }

                        return new Response('Network error occurred', {
                            status: 408,
                            headers: { 'Content-Type': 'text/plain' }
                        })
                    })
            })
    )
})

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'submit-application') {
        event.waitUntil(submitPendingApplications())
    }
})

// Periodic sync for updates
self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-content') {
        event.waitUntil(updateCachedContent())
    }
})

// Push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data?.text() || 'New update from Equity Bank',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        },
        actions: [
            {
                action: 'open',
                title: 'Open Application'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ]
    }

    event.waitUntil(
        self.registration.showNotification('Equity Bank', options)
    )
})

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close()

    if (event.action === 'open') {
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(clientList => {
                for (const client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus()
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('/')
                }
            })
        )
    }
})

// Helper functions
async function submitPendingApplications() {
    // Retrieve pending applications from IndexedDB
    const pending = await getPendingApplications()

    for (const application of pending) {
        try {
            const response = await fetch('/api/submit-application', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(application)
            })

            if (response.ok) {
                await removePendingApplication(application.id)
            }
        } catch (error) {
            console.error('Failed to submit application:', error)
        }
    }
}

async function updateCachedContent() {
    const cache = await caches.open(CACHE_NAME)
    const requests = await cache.keys()

    for (const request of requests) {
        try {
            const response = await fetch(request)
            if (response.ok) {
                await cache.put(request, response)
            }
        } catch (error) {
            console.warn('Failed to update:', request.url)
        }
    }
}

// IndexedDB helpers (simplified)
function getPendingApplications() {
    return new Promise(resolve => {
        // Implementation would use IndexedDB
        resolve([])
    })
}

function removePendingApplication(id) {
    return new Promise(resolve => {
        // Implementation would use IndexedDB
        resolve()
    })
}

// Message handler
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }
})