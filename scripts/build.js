#!/usr/bin/env node
/* Build de produção → dist/
   - empacota e minifica os scripts na ordem do index.html (com mapa de fontes), nome com hash do conteúdo
   - minifica o CSS (embutido e tailwind.css)
   - injeta política de segurança de conteúdo (CSP), preload das fontes e referrer-policy
   - gera o service worker (cache versionado + lista de pré-cache calculada, nunca escrita à mão)
   - gera _headers (cache e segurança), robots.txt e build-info.json
   - confere orçamento de tamanho e imprime um relatório
   Uso: npm run build   (variáveis opcionais: BUDGET_APP_KB, BUDGET_CSS_KB — tamanhos gzip) */
"use strict";
const fs = require("fs"), path = require("path"), crypto = require("crypto"), zlib = require("zlib"), cp = require("child_process");
const { minify } = require("terser"), esbuild = require("esbuild"), acorn = require("acorn");

const ROOT = path.join(__dirname, ".."), DIST = path.join(ROOT, "dist"), pkg = require("../package.json"), major = parseInt(pkg.version.split(".")[0], 10);
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");
const sha = (data, n = 10) => crypto.createHash("sha256").update(data).digest("hex").slice(0, n);
const gz = b => zlib.gzipSync(b, { level: 9 }).length, br = b => zlib.brotliCompressSync(b).length;
const kb = n => (n / 1024).toFixed(1).padStart(7) + " KB";
const fail = m => { console.error("\n✘ " + m); process.exit(1); };
function put(rel, data) { const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); return Buffer.byteLength(data); }
function copyDir(rel) { for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) { const r = path.posix.join(rel, e.name); if (e.isDirectory()) copyDir(r); else if (!e.name.endsWith(".md")) { fs.mkdirSync(path.dirname(path.join(DIST, r)), { recursive: true }); fs.copyFileSync(path.join(ROOT, r), path.join(DIST, r)); } } }

// Política de segurança de conteúdo. 'unsafe-inline' em script é necessário porque os templates usam onclick="..." em linha;
// o restante limita o que a página pode carregar e para onde pode enviar requisições.
const API_HOSTS = ["https://pubchem.ncbi.nlm.nih.gov", "https://opsin.ch.cam.ac.uk", "https://cactus.nci.nih.gov", "https://en.wikipedia.org"];
const CSP = ["default-src 'self'", "script-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob: https://pubchem.ncbi.nlm.nih.gov", "font-src 'self'",
  "connect-src 'self' " + API_HOSTS.join(" "), "worker-src 'self'", "manifest-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'"];

(async () => {
  const t0 = Date.now();
  // 1) pré-condições
  try { cp.execFileSync(process.execPath, [path.join(ROOT, "build-inline.js"), "--check"], { cwd: ROOT, stdio: "pipe" }); } catch (e) { fail("O CSS embutido no index.html está desatualizado. Rode: node build-inline.js"); }
  const ver = /CHEMOS_VERSION = "([^"]+)"/.exec(read("js/core/version.js"));
  if (!ver || ver[1] !== pkg.version) fail(`js/core/version.js (${ver && ver[1]}) difere do package.json (${pkg.version}). Rode: npm run version:sync`);

  fs.rmSync(DIST, { recursive: true, force: true }); fs.mkdirSync(DIST, { recursive: true });
  let html = read("index.html");

  // 2) scripts na ordem do index.html
  const re = /<script src="(js\/[^"]+)"><\/script>[ \t]*\n?/g, srcs = [...html.matchAll(re)].map(m => m[1]);
  if (!srcs.length) fail("Nenhum <script src=\"js/...\"> encontrado no index.html.");
  const files = {}, seen = {};
  for (const s of srcs) {
    if (!fs.existsSync(path.join(ROOT, s))) fail("Script ausente: " + s);
    const code = read(s); files[s] = code;
    // guarda: declarações globais duplicadas mudam de significado ao concatenar (a última função içada vence)
    for (const n of acorn.parse(code, { ecmaVersion: "latest", sourceType: "script", allowHashBang: true }).body) {
      const names = n.type === "FunctionDeclaration" || n.type === "ClassDeclaration" ? [n.id.name] : n.type === "VariableDeclaration" ? n.declarations.filter(d => d.id.type === "Identifier").map(d => d.id.name) : [];
      for (const name of names) { if (seen[name]) fail(`Declaração global duplicada "${name}" em ${seen[name]} e ${s}. Empacotar mudaria o comportamento.`); seen[name] = s; }
    }
  }
  const rawBytes = Object.values(files).reduce((a, c) => a + Buffer.byteLength(c), 0);
  const out = await minify(files, { ecma: 2020, compress: { passes: 2, ecma: 2020, toplevel: false }, mangle: { toplevel: false }, format: { comments: false }, sourceMap: { filename: "app.js", includeSources: true } });
  if (!out.code) fail("A minificação não gerou código.");
  const appHash = sha(out.code), appName = `app.${appHash}.js`;
  put(`assets/${appName}`, out.code + `\n//# sourceMappingURL=${appName}.map\n`);
  put(`assets/${appName}.map`, out.map);
  let first = true; html = html.replace(re, (m, s) => { if (!first) return ""; first = false; return `<script src="assets/${appName}"></script>\n    `; });

  // 3) CSS
  const crit = /<style id="critical-css">([\s\S]*?)<\/style>/.exec(html); if (!crit) fail("Bloco <style id=\"critical-css\"> não encontrado.");
  const critMin = (await esbuild.transform(crit[1], { loader: "css", minify: true })).code;
  html = html.replace(crit[0], () => `<style id="critical-css">${critMin}</style>`);
  const tw = await esbuild.transform(read("css/tailwind.css"), { loader: "css", minify: true }), twName = `tailwind.${sha(tw.code)}.css`;
  put(`assets/${twName}`, tw.code);
  if (!/href="css\/tailwind\.css"/.test(html)) fail("Link para css/tailwind.css não encontrado.");
  html = html.replace(/href="css\/tailwind\.css"/, `href="assets/${twName}"`);

  // 4) cabeçalho do HTML: versão, CSP, referrer e preload das fontes principais
  html = html.replace(/CHEM\.OS v\d+/g, "CHEM.OS v" + major);
  const head = `\n    <meta http-equiv="Content-Security-Policy" content="${CSP.join("; ")}">\n    <meta name="referrer" content="strict-origin-when-cross-origin">` +
    ["vt323-latin-400-normal", "ibm-plex-mono-latin-400-normal"].map(f => `\n    <link rel="preload" href="fonts/${f}.woff2" as="font" type="font/woff2" crossorigin>`).join("");
  html = html.replace(/(<meta charset[^>]*>)/i, (m, a) => a + head);
  if (!html.includes("Content-Security-Policy")) fail("Não foi possível inserir a CSP (meta charset ausente).");
  put("index.html", html);

  // 5) arquivos estáticos
  copyDir("fonts"); copyDir("icons"); copyDir("vendor"); fs.copyFileSync(path.join(ROOT, "manifest.webmanifest"), path.join(DIST, "manifest.webmanifest")); fs.copyFileSync(path.join(ROOT, "robots.txt"), path.join(DIST, "robots.txt"));

  // 6) service worker com lista de pré-cache calculada
  const pre = []; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else { const rel = path.relative(DIST, f).split(path.sep).join("/"); if (!/\.map$|^robots\.txt$|^_headers$|^build-info\.json$/.test(rel)) pre.push(rel); } } })(DIST);
  pre.sort(); const cacheId = sha(pre.map(f => f + ":" + sha(fs.readFileSync(path.join(DIST, f)), 8)).join("|"), 8);
  const swSrc = read("scripts/sw.template.js").replace("__CACHE__", `chemos-v${pkg.version}-${cacheId}`).replace("__PRECACHE__", JSON.stringify(["./"].concat(pre), null, 2));
  put("sw.js", swSrc);

  // 7) cabeçalhos HTTP para hospedagem estática (Netlify/Cloudflare Pages); veja docs/DEPLOY.md para nginx
  put("_headers", `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()\n  Cross-Origin-Opener-Policy: same-origin\n  Content-Security-Policy: ${CSP.concat(["frame-ancestors 'none'"]).join("; ")}\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n/icons/*\n  Cache-Control: public, max-age=604800\n/vendor/*\n  Cache-Control: public, max-age=604800\n/index.html\n  Cache-Control: no-cache\n/sw.js\n  Cache-Control: no-cache\n/manifest.webmanifest\n  Cache-Control: no-cache\n`);
  put("build-info.json", JSON.stringify({ name: pkg.name, version: pkg.version, builtAt: new Date().toISOString(), cache: `chemos-v${pkg.version}-${cacheId}`, app: appName, css: twName, scripts: srcs.length, precache: pre.length }, null, 2) + "\n");

  // 8) relatório e orçamento
  const app = Buffer.from(fs.readFileSync(path.join(DIST, "assets", appName))), css = fs.readFileSync(path.join(DIST, "assets", twName)), idx = fs.readFileSync(path.join(DIST, "index.html"));
  const B = { app: +(process.env.BUDGET_APP_KB || 240) * 1024, css: +(process.env.BUDGET_CSS_KB || 40) * 1024, html: +(process.env.BUDGET_HTML_KB || 60) * 1024 };
  console.log(`\nCHEM.OS ${pkg.version} → dist/  (${((Date.now() - t0) / 1000).toFixed(1)} s)\n`);
  console.log(`                       fonte  minificado      gzip    brotli  orçamento(gzip)`);
  console.log(`scripts (${String(srcs.length).padStart(2)} → 1)  ${kb(rawBytes)} ${kb(app.length)} ${kb(gz(app))} ${kb(br(app))}  ${(B.app / 1024).toFixed(0)} KB`);
  console.log(`tailwind.css        ${kb(read("css/tailwind.css").length)} ${kb(css.length)} ${kb(gz(css))} ${kb(br(css))}  ${(B.css / 1024).toFixed(0)} KB`);
  console.log(`index.html          ${kb(read("index.html").length)} ${kb(idx.length)} ${kb(gz(idx))} ${kb(br(idx))}  ${(B.html / 1024).toFixed(0)} KB`);
  console.log(`\nRequisições da primeira carga: ${srcs.length + 3} → 3 (HTML, JS, CSS) + fontes   | pré-cache: ${pre.length} arquivos | cache: chemos-v${pkg.version}-${cacheId}`);
  const over = [["scripts", gz(app), B.app], ["tailwind.css", gz(css), B.css], ["index.html", gz(idx), B.html]].filter(([, a, b]) => a > b);
  if (over.length) fail("Orçamento de tamanho excedido: " + over.map(([n, a, b]) => `${n} ${(a / 1024).toFixed(1)} KB > ${(b / 1024).toFixed(0)} KB`).join("; "));
  console.log("\n✔ Build concluído dentro do orçamento.");
})().catch(e => fail(e && e.stack || String(e)));
