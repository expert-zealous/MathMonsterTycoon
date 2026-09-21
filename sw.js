const CACHE='mmt-v8-20250920';
const ASSETS=[
  './',
  './index.html',
  './manifest.json',
  './assets/logo.png',
  './assets/egg-basic.png',
  './assets/egg-lucky.png',
  './assets/egg-legend.png',
  './favicon.ico'
];
self.addEventListener('install', e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{})));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))) );
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  const req=e.request;
  // only GET
  if(req.method!=='GET') return;
  e.respondWith(
    caches.match(req).then(cached=>{
      const fetched = fetch(req).then(res=>{
        // cache successful
        if(res && res.status===200 && res.type==='basic'){
          const clone=res.clone();
          caches.open(CACHE).then(c=>c.put(req, clone));
        }
        return res;
      }).catch(()=>cached);
      return cached || fetched;
    })
  );
});
