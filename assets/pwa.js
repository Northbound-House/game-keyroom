/* Register The Key Room service worker (offline + install-to-home-screen).
   Only meaningful over https on the live site; the catch keeps local
   file:// and http testing quiet. */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js").catch(function (err) {
      console.warn("Key Room service worker did not register:", err);
    });
  });
}
