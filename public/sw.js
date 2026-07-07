const CACHE_NAME = "treino-diario-v10";
const SCOPE_URL = self.registration.scope;
const SCOPE_PATH = new URL(SCOPE_URL).pathname;
const createScopedUrl = (path) => new URL(path, SCOPE_URL).toString();
const APP_SHELL = [
  "",
  "index.html",
  "manifest.json",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-icon.svg",
].map(createScopedUrl);

const cacheViteAssets = async (cache) => {
  const indexUrl = createScopedUrl("index.html");
  const indexResponse = await fetch(indexUrl, { cache: "reload" });

  if (!indexResponse.ok) {
    return;
  }

  await cache.put(indexUrl, indexResponse.clone());

  const indexHtml = await indexResponse.text();
  const assetMatches = indexHtml.matchAll(/(?:href|src)="([^"]*\/assets\/[^"]+)"/g);
  const assetUrls = [...assetMatches].map((match) => {
    return new URL(match[1], SCOPE_URL).toString();
  });

  await cache.addAll([...new Set(assetUrls)]);
};

const cacheAppShell = async () => {
  const cache = await caches.open(CACHE_NAME);

  await cache.addAll(APP_SHELL);
  await cacheViteAssets(cache);
};

const shouldCacheResponse = (request, response) => {
  const requestUrl = new URL(request.url);

  return (
    requestUrl.origin === self.location.origin &&
    requestUrl.pathname.startsWith(SCOPE_PATH) &&
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
      const fallbackResponse = await caches.match(createScopedUrl("index.html"));

      if (fallbackResponse) {
        return fallbackResponse;
      }
    }

    throw error;
  }
};

const getNavigationResponse = async (request) => {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.ok) {
      await cache.put(createScopedUrl("index.html"), networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const fallbackResponse = await caches.match(createScopedUrl("index.html"));

    if (fallbackResponse) {
      return fallbackResponse;
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

  if (event.request.mode === "navigate") {
    event.respondWith(getNavigationResponse(event.request));
    return;
  }

  event.respondWith(getCachedOrNetworkResponse(event.request));
});
