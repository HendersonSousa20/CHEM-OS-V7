/* Verifica contraste WCAG (texto normal ≥ 4,5:1) dos 5 temas: texto base, texto esmaecido (opacity-60/70/80), cores de status e as cores Tailwind de texto usadas no projeto.
   Uso: npm run test:contrast */
const fs = require("fs"), path = require("path"), root = path.join(__dirname, "..");
const css = fs.readFileSync(path.join(root, "css/styles.css"), "utf8"), tw = fs.readFileSync(path.join(root, "css/tailwind.css"), "utf8");
const hex = h => { h = h.replace("#", ""); if (h.length === 3) h = [...h].map(c => c + c).join(""); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const mix = (fg, bg, a) => fg.map((v, i) => Math.round(v * a + bg[i] * (1 - a)));
const themes = {};
for (const m of css.matchAll(/(:root|\.theme-(\w+))\s*\{([^}]*)\}/g)) { const v = n => (m[3].match(new RegExp("--" + n + ":\\s*(#[0-9a-fA-F]{3,6})")) || [])[1]; if (v("bg-color")) themes[m[2] || "green"] = { bg: v("bg-color"), text: v("text-color"), border: v("border-color"), ok: v("ok-color") || "#00FF66", err: v("err-color") || "#FF4444", warn: v("warn-color") || "#FF6B6B" }; }
// cores Tailwind de texto realmente usadas
const used = new Set(); (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) { if (!/node_modules|tests|fonts/.test(f)) walk(p); } else if (/\.(js|html)$/.test(f)) for (const m of fs.readFileSync(p, "utf8").matchAll(/\btext-([a-z]+)-(\d{2,3})\b/g)) used.add(`text-${m[1]}-${m[2]}`); } })(root);
const twc = {}; for (const m of tw.matchAll(/\.(text-[a-z]+-\d+)\{[^}]*color:rgb\((\d+) (\d+) (\d+)/g)) twc[m[1]] = [+m[2], +m[3], +m[4]];
// sobrescritas por tema lidas do próprio styles.css (ex.: ".theme-paper .text-red-500 { color: #b00020 }")
const overrides = {};
for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) { const c = (m[2].match(/(?:^|;|\s)color:\s*(#[0-9a-fA-F]{3,6})/) || [])[1]; if (!c) continue;
  m[1].split(",").forEach(s => { const k = s.trim().match(/^\.theme-(\w+)\s+\.(text-[a-z]+-\d+)$/); if (k) (overrides[k[1]] = overrides[k[1]] || {})[k[2]] = c; }); }
// Nota: "body .opacity-60" vale 0,72 em styles.css (v8.15), por isso o teste usa 0,72 em vez de 0,6.
// Observação: textos desativados/esmaecidos de propósito (opacity-20/50, estados disabled) são isentos pela WCAG e não entram aqui.
let fails = 0;
for (const [name, t] of Object.entries(themes)) {
  const bg = hex(t.bg), rows = [];
  rows.push(["texto base", hex(t.text)]); [0.8, 0.72, 0.7].forEach(a => rows.push([`texto com opacidade ${a}`, mix(hex(t.text), bg, a)]));
  rows.push(["status OK", hex(t.ok)], ["status erro", hex(t.err)], ["aviso de campo", hex(t.warn)]);
  used.forEach(c => { if (twc[c]) rows.push([c, overrides[name] && overrides[name][c] ? hex(overrides[name][c]) : twc[c]]); });
  rows.forEach(([label, fg]) => { const r = ratio(fg, bg); if (r < 4.5) { fails++; console.log(`FALHA ${name.padEnd(6)} ${label.padEnd(26)} ${r.toFixed(2)}:1`); } });
  const rb = ratio(hex(t.border), bg); if (rb < 3) { fails++; console.log(`FALHA ${name} borda ${rb.toFixed(2)}:1 (mín. 3:1)`); }
}

// Células da tabela periódica (Módulo 7): texto do tema sobre hsl(h 70% 50% / alfa) composto sobre o fundo. Os alfas vêm de ptable-plus.js.
const pp = fs.readFileSync(path.join(root, "js/modules/ptable-plus.js"), "utf8"), am = pp.match(/mode === "cat" \? ([\d.]+) : ([\d.]+)/), A = { cat: +am[1], other: +am[2] };
const hsl = (h, s, l) => { s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [f(0), f(8), f(4)].map(v => Math.round(255 * v)); };
const modes = { "categoria": [Array.from({ length: 10 }, (_, i) => Math.round(i * 360 / 10)), A.cat], "massa/EN/ionização/raio": [Array.from({ length: 12 }, (_, i) => Math.round(220 - 220 * i / 11)), A.other], "período": [[0, 50, 100, 150, 200, 250, 300], A.other], "bloco": [[200, 140, 40, 300], A.other] };
for (const [name, t] of Object.entries(themes)) for (const [m, [hues, a]] of Object.entries(modes)) hues.forEach(h => { const r = ratio(hex(t.text), mix(hsl(h, 70, 50), hex(t.bg), a)); if (r < 4.5) { fails++; console.log(`FALHA ${name.padEnd(6)} tabela periódica, cor por ${m} (matiz ${h}°) ${r.toFixed(2)}:1`); } });
console.log(fails ? `\n${fails} combinações abaixo do mínimo` : `OK — ${Object.keys(themes).length} temas (${Object.keys(themes).join(", ")}) e ${used.size} cores Tailwind verificadas, todas ≥ 4,5:1`);
process.exit(fails ? 1 : 0);
