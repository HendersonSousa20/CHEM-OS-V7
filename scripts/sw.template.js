/* Service worker de produção — GERADO por scripts/build.js (edite scripts/sw.template.js).
   Estratégia: pré-cache de todo o app; navegação e arquivos sem hash em rede primeiro; assets/fontes/ícones/vendor em cache primeiro.
   Chamadas a APIs externas (PubChem etc.) não são interceptadas. */
"use strict";
const CACHE = "__CACHE__";
const PRECACHE = __PRECACHE__;
const STATIC = /\/(assets|fonts|vendor|icons)\//;

self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("chemos-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
function remember(req, res) { if (res && res.ok && res.type === "basic") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; }
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate") { e.respondWith(fetch(req).then(r => remember(req, r)).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("index.html")))); return; }
  if (STATIC.test(url.pathname)) { e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => remember(req, r)))); return; }
  e.respondWith(fetch(req).then(r => remember(req, r)).catch(() => caches.match(req)));
});
