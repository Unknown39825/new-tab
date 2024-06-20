// Cache name
const cacheName = "v1";

// Files to cache
const cacheAssets = [
  "/index.html",
  "/manifest.json",
  "/js/components.js",
  "/js/script.js",
  "/components/column.js",
  "/components/form.js",
  "/components/item.js",
  "/changelog/updates.json",
];

// cache will provide offline access to the app

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// activate the service worker
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// fetch the files from the cache if no internet connection

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
