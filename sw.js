/* Service worker: app shell offline. Chamadas de API (PubChem etc.) não são interceptadas. */
const CACHE = "chemos-v11.5";
const SHELL = ["./", "index.html", "css/fonts.css", "css/styles.css","fonts/ibm-plex-mono-latin-400-normal.woff2", "fonts/ibm-plex-mono-latin-600-normal.woff2", "fonts/ibm-plex-mono-latin-700-normal.woff2", "fonts/ibm-plex-mono-latin-ext-400-normal.woff2", "fonts/ibm-plex-mono-latin-ext-600-normal.woff2", "fonts/ibm-plex-mono-latin-ext-700-normal.woff2", "fonts/vt323-latin-400-normal.woff2", "fonts/vt323-latin-ext-400-normal.woff2", "css/tailwind.css", "js/core/validation.js", "manifest.webmanifest",
  "js/app.js", "js/core/ux-extras.js", "js/core/ux-extras2.js", "js/core/ux-extras3.js", "js/core/ux-extras4.js", "js/core/v8-extras.js", "js/modules/unit-converter.js", "js/modules/extra-tools.js", "js/modules/mole-tools.js", "js/data/periodic-properties.js", "js/modules/structure-plus.js", "js/modules/sim-plus.js", "js/modules/lab-plus.js", "js/modules/oxidation.js", "js/modules/bond-type.js", "js/core/ghs-v11.js", "js/modules/galvanic-cells.js", "js/modules/electrolysis.js", "js/modules/electro-predict.js", "js/modules/ptable-plus.js", "js/core/share.js", "js/core/a11y.js", "js/core/net-ui.js", "js/core/ux-v9.js", "js/modules/step-by-step.js", "js/core/about.js", "js/core/ux-v96.js", "js/core/ui-v10.js", "js/core/hidpi.js", "js/core/ui-v11.js", "css/ui-v11.css", "icons/icon-192.png", "icons/icon-512.png", "icons/favicon.svg", "js/data/gc-extra.js", "js/data/gc-extra2.js", "js/data/gc-eletro.js", "js/modules/gc-plus.js", "css/ui-v10.css", "js/data/module-help.js", "js/core/api-utils.js", "js/core/chart-engine.js",
  "js/core/formula-engine.js", "js/core/name-resolver-api.js", "js/core/pubchem-api.js", "js/core/ui-system.js",
  "js/data/periodic-table-data.js", "js/render/screens.js", "js/modules/advanced-tools.js", "js/modules/basic-tools.js",
  "js/modules/chemistry-detective.js", "js/modules/general-chemistry-guide.js", "js/modules/guided-experiments.js",
  "js/modules/molecular-simulation.js", "js/modules/periodic-table-render.js", "js/modules/structure-editor.js", "js/modules/test-suite.js"];
const CDN = ["cdnjs.cloudflare.com"];

self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || (u.origin !== location.origin && !CDN.includes(u.hostname))) return;
  // Rede primeiro (pega sempre a versão nova do HTML/CSS/JS); cache só se estiver offline.
  e.respondWith(caches.open(CACHE).then(async c => {
    try {
      const r = await fetch(e.request);
      if (r && (r.ok || r.type === "opaque")) c.put(e.request, r.clone());
      return r;
    } catch (err) {
      const hit = await c.match(e.request);
      if (hit) return hit;
      throw err;
    }
  }));
});
