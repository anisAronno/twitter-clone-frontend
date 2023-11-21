const cacheName = "twitter-clone-v4";
const staticAssets = [
  "/",
  "./offline.html", 
];

self.addEventListener("install", async (e) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  self.clients.claim();
});

self.addEventListener("fetch", async (e) => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(req);
  return cachedResponse || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (error) {
    const cachedResponse = await cache.match(req);
    if (cachedResponse) {
      return cachedResponse;
    } else {
       const offlineResponse = await caches.match("./offline.html");
      if (offlineResponse) {
        return new Response(offlineResponse.body, {
          headers: { "Content-Type": "text/html" },  
        });
      }
      return new Response("Offline page not found", {
        status: 404,
        statusText: "Not Found",
      });
    }
  }
}
