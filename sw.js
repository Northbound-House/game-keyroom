/* ============================================================
   THE KEY ROOM — service worker
   Same Workbox approach as app-waypoint, adapted for a static,
   no-build, no-API site: an app shell that installs to the home
   screen and plays offline once it's been opened online.

   Bump VERSION when you change any precached file to bust caches.
   ============================================================ */
/* eslint-disable no-restricted-globals */
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);

const VERSION = "v1";
const { precacheAndRoute } = workbox.precaching;
const { registerRoute } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

/* --- precache the whole game shell (same-origin) so it works offline --- */
precacheAndRoute(
  [
    "/",
    "/index.html",
    "/manifest.webmanifest",
    "/favicon.svg",
    "/assets/theme.css",
    "/assets/engine.js",
    "/assets/easter-eggs.js",
    "/assets/pwa.js",
    "/assets/palette-meridian.css",
    "/assets/palette-redeye.css",
    "/assets/palette-waypoint.css",
    "/assets/redeye-components.css",
    "/assets/redeye.js",
    "/assets/waypoint-components.css",
    "/assets/waypoint.js",
    "/games/level-1-stateroom-77.html",
    "/games/level-2-chart-room.html",
    "/games/level-3-the-lantern.html",
    "/games/redeye-1-the-terminal.html",
    "/games/redeye-2-the-red-eye.html",
    "/games/redeye-3-arrivals.html",
    "/games/waypoint-1-the-station.html",
    "/games/waypoint-2-the-approach.html",
    "/games/waypoint-3-the-threshold.html",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/apple-touch-icon.png",
  ].map((url) => ({ url, revision: VERSION }))
);

/* --- navigations: cached page loads instantly, refreshes in the background --- */
registerRoute(
  ({ request }) => request.mode === "navigate",
  new StaleWhileRevalidate({
    cacheName: "pages-" + VERSION,
    plugins: [new CacheableResponsePlugin({ statuses: [200] })],
  })
);

/* --- our CSS/JS/icons: cache-first --- */
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/icons/")),
  new CacheFirst({
    cacheName: "static-" + VERSION,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

/* --- Google Fonts stylesheet: stale-while-revalidate --- */
registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new StaleWhileRevalidate({ cacheName: "google-fonts-css" })
);

/* --- Google Fonts files: cache-first, long expiry --- */
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

/* --- activate new SW immediately --- */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
