
const CACHE = 'mgd-v1';
const ASSETS = ["/index.html", "/.nojekyll", "/README.md", "/README_MERGE.md", "/service-worker.js", "/manifest.webmanifest", "/assets/audio/whisper_loop.wav", "/data/memory.json", "/_from_prodpack/index.html", "/_from_prodpack/.nojekyll", "/_from_prodpack/README.md", "/_from_prodpack/assets/audio/whisper_loop.wav", "/_from_prodpack/data/memory.json", "/app/config.js", "/app/teaching.js", "/app/sigil.js"] || ['/index.html'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(res => res || fetch(req).then(net => {
      const copy = net.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
      return net;
    }).catch(()=>caches.match('/index.html')))
  );
});
