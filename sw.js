const CACHE='realms-v09-blood-alpha6';
const SHELL=[
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './src-v09/styles.css',
  './src-v09/cards.js',
  './src-v09/game.js'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(SHELL))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const req=event.request;
  const url=new URL(req.url);

  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req)
        .then(response=>{
          if(response.ok){
            const copy=response.clone();
            caches.open(CACHE).then(cache=>cache.put('./index.html',copy));
          }
          return response;
        })
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    fetch(req)
      .then(response=>{
        if(response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(req,copy));
        }
        return response;
      })
      .catch(async()=>{
        const exact=await caches.match(req);
        if(exact)return exact;
        const clean=new Request(url.origin+url.pathname);
        const cached=await caches.match(clean);
        return cached||Response.error();
      })
  );
});
