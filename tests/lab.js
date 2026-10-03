/* Testa a análise pela derivada (Módulo 23) com curvas de titulação calculadas analiticamente. Uso: node tests/lab.js */
const vm = require("vm"), fs = require("fs");
const ctx = { window: {}, document: { addEventListener() {} }, location: { hash: "" } }; vm.createContext(ctx);
new vm.Script(fs.readFileSync(__dirname + "/../js/modules/guided-experiments.js", "utf8") + "\n;" + fs.readFileSync(__dirname + "/../js/modules/lab-plus.js", "utf8")).runInContext(ctx);
const D = ctx.window.ChemLab.derivative;
// Ácido forte + base forte: 25 mL de HCl 0,1 mol/L titulados com NaOH 0,1 mol/L (equivalência em 25 mL)
const pH = V => { const n = 0.1 * 25 - 0.1 * V, t = 25 + V; if (Math.abs(n) < 1e-12) return 7; return n > 0 ? -Math.log10(n / t) : 14 + Math.log10(-n / t); };
const mk = vs => vs.map(v => ({ vol: v, reading: pH(v) }));
const cases = [
  ["pontos esparsos + ao redor de 25 mL", mk([0, 5, 10, 15, 20, 24, 24.5, 25, 25.5, 26, 30, 40]), 25, 0.15],
  ["pontos assimétricos (24, 24,9, 25,2, 26)", mk([0, 10, 20, 24, 24.9, 25.2, 26, 35]), 25, 0.35],
  ["curva densa (passo 0,1 de 23 a 27)", mk(Array.from({ length: 41 }, (_, i) => +(23 + i * 0.1).toFixed(1))), 25, 0.06]
];
let ok = 0;
cases.forEach(([n, pts, exp, tol]) => { const r = D(pts), good = r && Math.abs(r.est - exp) <= tol; ok += good ? 1 : 0; console.log(good ? "OK   " : "FALHA", n, r ? `→ estimado ${r.est.toFixed(2)} mL (esperado ${exp})` : "→ sem resultado"); });
const few = D(mk([0, 10])), dup = D([{ vol: 1, reading: 3 }, { vol: 1, reading: 3 }, { vol: 2, reading: 4 }]);
const g1 = few === null, g2 = dup === null; ok += g1 + g2; console.log(g1 ? "OK   " : "FALHA", "menos de 3 pontos → null"); console.log(g2 ? "OK   " : "FALHA", "pontos duplicados no mesmo volume contam como 1");
console.log(`\n${ok} de ${cases.length + 2} passaram`); process.exit(ok === cases.length + 2 ? 0 : 1);
