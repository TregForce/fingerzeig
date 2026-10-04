// Friddle: speichert die App auf dem Gerät, damit sie ohne Internet startet. Eine neue Fassung (anderer Stempel) ersetzt die alte beim nächsten Start.
const CACHE = 'friddle-475c937e49';
const FILES = ["index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];
// beim Einrichten immer frisch vom Server holen (nicht aus dem Zwischenspeicher des Browsers)
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./'].concat(FILES).map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).catch(() => caches.match('./'))));
});
