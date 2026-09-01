/**
 * Registers the generated service worker so the app opens with the wifi off.
 *
 * Only in a production build -- dist/sw.js does not exist during `npm run dev`,
 * and a stale worker caching dev modules is a miserable thing to debug.
 */
export function registerServiceWorker() {
  if (!import.meta.env.PROD) return
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    // Captured before registering: on a first install there is no controller and
    // nothing to reload, but on an update there is, and the page is still
    // running the previous build.
    const hadController = Boolean(navigator.serviceWorker.controller)
    let reloading = false

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || reloading) return
      reloading = true
      location.reload()
    })

    // A failed registration must not take the app down with it.
    navigator.serviceWorker.register('./sw.js').catch(() => {})
  })
}
