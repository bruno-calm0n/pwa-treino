const CACHE_NAME = "treino-diario-v3";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-icon.svg",
];

const cacheViteAssets = async (cache) => {
  const indexResponse = await fetch("/index.html", { cache: "reload" });

  if (!indexResponse.ok) {
    return;
  }

  await cache.put("/index.html", indexResponse.clone());

  const indexHtml = await indexResponse.text();
  const assetMatches = indexHtml.matchAll(/(?:href|src)="([^"]*\/assets\/[^"]+)"/g);
  const assetUrls = [...assetMatches].map((match) => {
    return new URL(match[1], self.location.origin).pathname;
  });

  await cache.addAll([...new Set(assetUrls)]);
};

const cacheAppShell = async () => {
  const cache = await caches.open(CACHE_NAME);

  await cache.addAll(APP_SHELL);
  await cacheViteAssets(cache);
};

const shouldCacheResponse = (request, response) => {
  return (
    new URL(request.url).origin === self.location.origin &&
    response &&
    response.status === 200 &&
    response.type === "basic"
  );
};

const getCachedOrNetworkResponse = async (request) => {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (shouldCacheResponse(request, networkResponse)) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    if (request.mode === "navigate") {
      const fallbackResponse = await caches.match("/index.html");

      if (fallbackResponse) {
        return fallbackResponse;
      }
    }

    throw error;
  }
};

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAppShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(getCachedOrNetworkResponse(event.request));
});
