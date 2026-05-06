// Auto-unregistering service worker — cleans up old PWA installs from previous versions.
// Also stops `/sw.js` from being routed through Next.js dynamic [lang] segment.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        await self.registration.unregister();
        const clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach((client) => client.navigate(client.url));
      } catch (_) {
        // ignore
      }
    })()
  );
});
