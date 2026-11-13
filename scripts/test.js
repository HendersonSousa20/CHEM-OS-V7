#!/usr/bin/env node
/* Executor único dos testes: sobe um servidor estático em porta livre, roda cada suíte e resume o resultado.
   Uso: node scripts/test.js [--dist] [--full] [--only smoke,audit]
     --dist  testa a pasta dist/ (build de produção) em vez do código-fonte
     --full  inclui as varreduras longas (fuzz de entradas extremas e injeção de HTML) */
"use strict";
const { spawn } = require("child_process"), path = require("path"), fs = require("fs");
const { start } = require("./serve");
const args = process.argv.slice(2), has = f => args.includes(f), val = k => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
const ROOT = path.join(__dirname, ".."), TARGET = has("--dist") ? path.join(ROOT, "dist") : ROOT;
const FAST = ["smoke", "audit", "ux", "a11y", "calc", "lab", "contrast", "sim"], SLOW = ["fuzz", "xss"], DIST_ONLY = ["dist"];
let suites = val("--only") ? val("--only").split(",") : FAST.concat(has("--full") ? SLOW : []);
if (has("--dist") && !val("--only")) suites = DIST_ONLY.concat(suites);
if (!has("--dist")) suites = suites.filter(s => !DIST_ONLY.includes(s));

function run(name, base) {
  return new Promise(resolve => {
    const t0 = Date.now(), file = path.join(ROOT, "tests", name + ".js");
    if (!fs.existsSync(file)) return resolve({ name, code: 1, out: "arquivo de teste não encontrado: " + file, ms: 0 });
    const p = spawn(process.execPath, [file], { cwd: ROOT, env: { ...process.env, CHEMOS_BASE: base, CHEMOS_ROOT: TARGET } });
    let out = ""; p.stdout.on("data", d => out += d); p.stderr.on("data", d => out += d);
    const timer = setTimeout(() => { out += "\nTEMPO ESGOTADO"; p.kill("SIGKILL"); }, (name === "fuzz" || name === "xss" ? 1500 : 300) * 1000);
    p.on("close", code => { clearTimeout(timer); resolve({ name, code: code === null ? 1 : code, out, ms: Date.now() - t0 }); });
  });
}
(async () => {
  if (!fs.existsSync(path.join(TARGET, "index.html"))) { console.error(`Não há index.html em ${TARGET}${has("--dist") ? " (rode npm run build antes)" : ""}.`); process.exit(2); }
  const srv = await start(TARGET, 0), base = `http://127.0.0.1:${srv.port}/`;
  console.log(`Testando ${has("--dist") ? "dist/ (produção)" : "código-fonte"} em ${base}\n`);
  const results = [];
  for (const s of suites) {
    const r = await run(s, base); results.push(r);
    const summary = (r.out.match(/(\d+ passaram, \d+ falharam|ERROS DE EXECUÇÃO: [^\n]*|\d+ de \d+ passaram|TOTAIS: [^\n]*|OK — [^\n]*|CAUSAS DISTINTAS: \d+|POSSÍVEIS INJEÇÕES: \d+|[^\n]*dist[^\n]*)/g) || []).slice(-1)[0] || "";
    console.log(`${r.code === 0 ? "✔" : "✘"} ${s.padEnd(9)} ${(r.ms / 1000).toFixed(1).padStart(6)} s  ${summary.slice(0, 110)}`);
    if (r.code !== 0) console.log(r.out.split("\n").filter(l => /FALHA|Error|erro|ERRO|TEMPO/i.test(l)).slice(0, 12).map(l => "    " + l.slice(0, 220)).join("\n"));
  }
  await srv.close();
  const bad = results.filter(r => r.code !== 0);
  console.log(`\n${bad.length ? "FALHOU: " + bad.map(b => b.name).join(", ") : "Todos os " + results.length + " conjuntos passaram."}`);
  process.exit(bad.length ? 1 : 0);
})();
