#!/usr/bin/env node
/* Servidor estático sem dependências (desenvolvimento e testes).
   Uso: node scripts/serve.js [--root .] [--port 8080]      Também exporta start(root, port). */
"use strict";
const http = require("http"), fs = require("fs"), path = require("path");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2", ".map": "application/json", ".txt": "text/plain; charset=utf-8" };

function start(root, port = 0) {
  root = path.resolve(root);
  const server = http.createServer((req, res) => {
    let rel;
    try { rel = decodeURIComponent(new URL(req.url, "http://x").pathname); } catch { res.writeHead(400).end("Bad request"); return; }
    if (rel.endsWith("/")) rel += "index.html";
    const file = path.join(root, path.normalize(rel));
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end("Forbidden"); return; } // bloqueia ../
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Não encontrado"); return; }
      res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream", "Content-Length": st.size, "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff" });
      if (req.method === "HEAD") res.end(); else fs.createReadStream(file).pipe(res);
    });
  });
  return new Promise((resolve, reject) => { server.once("error", reject); server.listen(port, "127.0.0.1", () => resolve({ server, port: server.address().port, close: () => new Promise(r => server.close(r)) })); });
}
module.exports = { start };

if (require.main === module) {
  const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
  start(arg("--root", "."), +arg("--port", 8080)).then(s => console.log(`Servindo ${path.resolve(arg("--root", "."))} em http://127.0.0.1:${s.port}/`), e => { console.error(e.message); process.exit(1); });
}
