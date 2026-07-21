/* ============================================================
   THE KEY ROOM — service worker
   Same Workbox approach as app-waypoint, adapted for a static
   site. While the anthology is in active testing, PAGES and CODE
   are network-first so testers always get the latest deploy; only
   stable branding is precached. Still installable, still works
   offline (falls back to the last-seen copy).

   Bump VERSION on any deploy you want to force-refresh.
   ============================================================ */
/* eslint-disable no-restricted-globals */
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);

const VERSION = "v3";
const { precacheAndRoute, cleanupOutdatedCaches } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { NetworkFirst, StaleWhileRevalidate, CacheFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

/* precache only stable branding — never the HTML or the CSS/JS, so
   content changes during testing are never masked by the cache */
cleanupOutdatedCaches();
precacheAndRoute(
  [
    "/manifest.webmanifest",
    "/favicon.svg",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/apple-touch-icon.png",
  ].map((url) => ({ url, revision: VERSION }))
);

/* pages (navigations): network-first — latest deploy wins online,
   last-seen copy serves offline */
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages-" + VERSION,
    networkTimeoutSeconds: 4,
    plugins: [new CacheableResponsePlugin({ statuses: [200] })],
  })
);

/* our CSS/JS: stale-while-revalidate — instant, and self-heals to
   the latest within one reload */
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.startsWith("/assets/"),
  new StaleWhileRevalidate({
    cacheName: "assets-" + VERSION,
    plugins: [new CacheableResponsePlugin({ statuses: [200] })],
  })
);

/* icons: cache-first (they rarely change; VERSION bump busts them) */
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.startsWith("/icons/"),
  new CacheFirst({
    cacheName: "icons-" + VERSION,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

/* Google Fonts */
registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new StaleWhileRevalidate({ cacheName: "google-fonts-css" })
);
registerRoute(
  ({ url }) => url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts-files",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 }),
    ],
  })
);

/* take over immediately, and purge caches from older versions */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => /-v\d+$/.test(k) && !k.endsWith(VERSION))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});
