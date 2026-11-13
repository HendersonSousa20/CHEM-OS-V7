/* Service worker de DESENVOLVIMENTO: não guarda nada em cache, para que o servidor local sempre entregue os arquivos atuais.
   O service worker de produção (com pré-cache) é gerado por `npm run build` a partir de scripts/sw.template.js. */
"use strict";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("chemos-")).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
