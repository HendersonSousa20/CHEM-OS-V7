/* Testes numéricos dos módulos de cálculo, pela interface (jsdom). Uso: npm run serve (outro terminal) e npm run test:calc */
const { JSDOM, VirtualConsole } = require("jsdom");
const BASE = process.env.CHEMOS_BASE || "http://localhost:8080/", sleep = ms => new Promise(r => setTimeout(r, ms));
const BP = w => {
  w.matchMedia = () => ({ matches: false, addEventListener() {} });
  Object.defineProperty(w.HTMLElement.prototype, "innerText", { get() { return this.textContent; }, set(v) { this.textContent = v; } });
  w.AudioContext = class { constructor() { this.currentTime = 0; this.destination = {}; } createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {} }, type: "" }; } createGain() { return { connect() {}, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; } };
  w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (t, k) => k === "canvas" ? {} : (k === "measureText" ? () => ({ width: 10 }) : (k in t ? t[k] : () => {})), set: (t, k, v) => (t[k] = v, true) });
  w.HTMLElement.prototype.scrollIntoView = () => {};
};
const nums = t => (t.replace(/(\d),(\d)/g, "$1.$2").match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi) || []).map(Number);
(async () => {
  const dom = await JSDOM.fromURL(BASE + "index.html", { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, virtualConsole: new VirtualConsole(), beforeParse: BP });
  for (let i = 0; i < 80 && !(dom.window.document.getElementById("menu-filter") || dom.window.document.querySelector(".menu-item")); i++) await sleep(250); await sleep(400);
  const w = dom.window, d = w.document; let ok = 0, fail = 0;
  const find = id => { for (let n = 1; n <= 19; n++) { w.renderTool(n); if (d.getElementById(id)) return n; } throw new Error("campo não encontrado: " + id); };
  async function t(name, field, vals, run, expected, tol) {
    try {
      find(field); w.localStorage.clear();
      Object.entries(vals).forEach(([k, v]) => { const el = d.getElementById(k); if (!el) throw new Error("sem campo " + k); el.value = v; });
      await w[run](); await sleep(200);
      const text = [...d.querySelectorAll('[id$="-result"]')].map(e => e.textContent).join(" ").replace(/\s+/g, " ");
      const hit = nums(text).some(x => Math.abs(x - expected) <= tol);
      hit ? ok++ : fail++; console.log(hit ? "OK   " : "FALHA", name, hit ? "" : `(esperado ≈ ${expected}) → ${text.slice(0, 140)}`);
    } catch (e) { fail++; console.log("FALHA", name, "—", e.message); }
  }
  await t("pH de ácido fraco 0,1 M, Ka 1,8e-5 = 2,87", "wa-conc", { "wa-conc": "0.1", "wa-ka": "1.8e-5" }, "runWeakAcidPH", 2.87, 0.02);
  await t("Tampão pKa 4,76, 1:1 → pH 4,76", "buf-pka", { "buf-pka": "4.76", "buf-base": "0.1", "buf-acid": "0.1" }, "runBufferCalc", 4.76, 0.01);
  await t("Tampão pKa 4,76, base:ácido 2:1 → pH 5,06", "buf-pka", { "buf-pka": "4.76", "buf-base": "0.2", "buf-acid": "0.1" }, "runBufferCalc", 5.06, 0.02);
  await t("Diluição: C1 2, C2 0,5, V2 100 → V1 = 25", "d-c1", { "d-c1": "2", "d-v1": "", "d-c2": "0.5", "d-v2": "100" }, "runDilution", 25, 0.01);
  await t("Gás ideal: 1 atm, 1 mol, 273,15 K → V ≈ 22,41 L", "gi-p", { "gi-p": "1", "gi-v": "", "gi-n": "1", "gi-t": "273.15" }, "runIdealGasLaw", 22.41, 0.05);
  await t("Preparo: 58,44 g/mol, 0,5 M, 250 mL → 7,305 g", "p-mm", { "p-mm": "58.44", "p-conc": "0.5", "p-vol": "250", "p-purity": "100" }, "runPrep", 7.305, 0.01);
  await t("Titulação ácido forte/base forte: ponto de equivalência 25 mL", "tit-ca", { "tit-ca": "0.1", "tit-va": "25", "tit-cb": "0.1", "tit-vmax": "50" }, "runTitrationCurve", 25, 0.01);
  await t("Nernst: E° 1,10 V, n 2, Q 1 → E = 1,10 V", "ner-e0", { "ner-e0": "1.10", "ner-n": "2", "ner-q": "1", "ner-t": "298.15" }, "runNernst", 1.10, 0.005);
  console.log(`\n${ok} passaram, ${fail} falharam`); process.exit(fail ? 1 : 0);
})();
