/* Uhr lernen – Offline-Cache
   Nach jeder Änderung an index.html: VERSION hochzählen (uhr-v2, uhr-v3 …). */
var VERSION = "uhr-v1";
var FILES = ["./", "./index.html"];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(VERSION)
      .then(function(c){ return c.addAll(FILES); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k.indexOf("uhr-") === 0 && k !== VERSION) return caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function(hit){
      return hit || fetch(e.request).catch(function(){ return caches.match("./index.html"); });
    })
  );
});
