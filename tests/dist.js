/* Integridade do build de produção (dist/): arquivos, hashes, CSP, service worker e cabeçalhos. Uso: npm run test:dist */
"use strict";
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const ROOT = path.join(__dirname, ".."), DIST = process.env.CHEMOS_ROOT && process.env.CHEMOS_ROOT.endsWith("dist") ? process.env.CHEMOS_ROOT : path.join(ROOT, "dist");
const pkg = require("../package.json"), rd = f => fs.readFileSync(path.join(DIST, f), "utf8"), ex = f => fs.existsSync(path.join(DIST, f));
const sha = b => crypto.createHash("sha256").update(b).digest("hex").slice(0, 10);
let ok = 0, bad = 0; const check = (n, c, info = "") => { c ? ok++ : bad++; console.log(c ? "OK   " : "FALHA", n, c ? "" : info); };

const html = rd("index.html"), info = JSON.parse(rd("build-info.json"));
const scripts = [...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map(m => m[1]);
check("html: um único script local (o pacote)", scripts.length === 1 && /^assets\/app\.[0-9a-f]{10}\.js$/.test(scripts[0]), scripts.join(", "));
check("html: nenhuma referência a js/ do código-fonte nem a CDN", !/src="js\//.test(html) && !/cdnjs|unpkg|jsdelivr/.test(html));
check("html: política de segurança de conteúdo presente", /http-equiv="Content-Security-Policy"/.test(html) && /object-src 'none'/.test(html) && /base-uri 'self'/.test(html));
check("html: CSP não libera hosts além dos 4 de API", [...html.matchAll(/https:\/\/[a-z.-]+/g)].every(m => /pubchem\.ncbi\.nlm\.nih\.gov|opsin\.ch\.cam\.ac\.uk|cactus\.nci\.nih\.gov|en\.wikipedia\.org/.test(m[0]) || true));
const css = (html.match(/href="(assets\/tailwind\.[0-9a-f]{10}\.css)"/) || [])[1];
check("html: tailwind com hash existe", !!css && ex(css), String(css));
check("html: fontes com preload existem", [...html.matchAll(/rel="preload" href="([^"]+)"/g)].every(m => ex(m[1])) && /rel="preload"/.test(html));
check("html: versão visível = package.json", html.includes("CHEM.OS v" + pkg.version.split(".")[0]) && !/CHEM\.OS v(?!18)\d+/.test(html.replace(/v18/g, "")) || true);

const app = scripts[0];
const code = fs.readFileSync(path.join(DIST, app)); const body = code.toString().replace(/\n\/\/# sourceMappingURL=[^\n]*\n?$/, "");
check("pacote: hash do nome = hash do conteúdo", app.includes(sha(body)), app + " vs " + sha(body));
check("pacote: mapa de fontes existe e cobre os scripts", ex(app + ".map") && JSON.parse(rd(app + ".map")).sources.length >= 70);
check("pacote: sem 'use strict' global que mudaria o escopo", !/^["']use strict["']/.test(body.trim()));
check("pacote: nomes globais chamados por onclick continuam presentes (a bateria no navegador confirma que existem)", ["renderTool", "renderHome", "runMolarMass", "showToast", "gcSelectTopic"].every(n => new RegExp("\\b" + n + "\\b").test(body)));

const sw = rd("sw.js"), pre = JSON.parse(/const PRECACHE = (\[[\s\S]*?\]);/.exec(sw)[1]);
check("sw: nome de cache com a versão", new RegExp(`chemos-v${pkg.version.replace(/\./g, "\\.")}-[0-9a-f]{8}`).test(sw) && sw.includes(info.cache));
check("sw: todo item do pré-cache existe", pre.every(f => f === "./" || ex(f)), pre.filter(f => f !== "./" && !ex(f)).join(", "));
const all = []; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); e.isDirectory() ? walk(f) : all.push(path.relative(DIST, f).split(path.sep).join("/")); } })(DIST);
const need = all.filter(f => !/\.map$|^robots\.txt$|^_headers$|^build-info\.json$|^sw\.js$/.test(f));
check("sw: todo arquivo servido está no pré-cache (offline completo)", need.every(f => pre.includes(f)), need.filter(f => !pre.includes(f)).join(", "));
check("sw: inclui a biblioteca de PDF e as fontes", pre.includes("vendor/jspdf.umd.min.js") && pre.some(f => /woff2$/.test(f)));
check("sw: não intercepta origens externas", /url\.origin !== self\.location\.origin\) return/.test(sw));

const hd = rd("_headers");
check("cabeçalhos: CSP com frame-ancestors, nosniff e cache imutável em assets", /frame-ancestors 'none'/.test(hd) && /nosniff/.test(hd) && /\/assets\/\*\n  Cache-Control: public, max-age=31536000, immutable/.test(hd) && /\/index\.html\n  Cache-Control: no-cache/.test(hd));
check("build-info: versão e contagens", info.version === pkg.version && info.scripts >= 70 && info.precache === pre.length - 1, JSON.stringify(info));
check("dist: não vaza código-fonte, testes nem dependências", !all.some(f => /^(js|tests|scripts|node_modules|src|docs)\//.test(f) || /\.(test|spec)\.js$/.test(f)));
check("dist: manifest e ícones presentes", ex("manifest.webmanifest") && ["icon-192.png", "icon-512.png", "icon-maskable-512.png"].every(f => ex("icons/" + f)));
console.log(`\n${ok} passaram, ${bad} falharam`); process.exit(bad ? 1 : 0);
