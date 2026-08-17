/* קופת הנהג — Service Worker: עבודה מלאה אופליין */
var CACHE = 'kupa-v3-3';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
  './icon-maskable.png',
  './guide.html'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){ return c.addAll(ASSETS); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys()
      .then(function(keys){
        return Promise.all(keys.map(function(k){
          if(k !== CACHE) return caches.delete(k);
        }));
      })
      .then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  var url = new URL(req.url);

  /* גופנים — stale-while-revalidate */
  if(url.hostname.indexOf('fonts.g') > -1){
    e.respondWith(
      caches.match(req).then(function(hit){
        var net = fetch(req).then(function(r){
          var copy = r.clone();
          caches.open(CACHE).then(function(c){ c.put(req, copy); });
          return r;
        }).catch(function(){ return hit; });
        return hit || net;
      })
    );
    return;
  }

  /* cache-first + רשת כגיבוי */
  e.respondWith(
    caches.match(req).then(function(hit){
      if(hit) return hit;
      return fetch(req).then(function(r){
        if(r.ok && url.origin === location.origin){
          var copy = r.clone();
          caches.open(CACHE).then(function(c){ c.put(req, copy); });
        }
        return r;
      }).catch(function(){
        if(req.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
