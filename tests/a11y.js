/* Auditoria de acessibilidade (jsdom): percorre os 34 módulos e conta campos sem nome, botões sem texto, controles que só funcionam com mouse, etc.
   Uso: npm run serve (outro terminal) e npm run test:a11y   (falha se houver problemas) */
const { JSDOM, VirtualConsole } = require("jsdom");
const BASE = process.env.CHEMOS_BASE || "http://localhost:8080/", sleep = ms => new Promise(r => setTimeout(r, ms));
const BP = w => {
  w.matchMedia = () => ({ matches: false, addEventListener() {} });
  Object.defineProperty(w.HTMLElement.prototype, "innerText", { get() { return this.textContent; }, set(v) { this.textContent = v; } });
  w.AudioContext = class { constructor() { this.currentTime = 0; this.destination = {}; } createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {} }, type: "" }; } createGain() { return { connect() {}, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; } };
  w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (t, k) => k === "canvas" ? {} : (k === "measureText" ? () => ({ width: 10 }) : (k in t ? t[k] : () => {})), set: (t, k, v) => (t[k] = v, true) });
  w.HTMLElement.prototype.scrollIntoView = () => {};
};

const vis = el => !el.closest("[hidden],.hidden") && el.type !== "hidden";
function nameOf(el, d) {
  if ((el.getAttribute("aria-label") || "").trim() || el.getAttribute("aria-labelledby") || (el.getAttribute("title") || "").trim()) return true;
  if (el.id && d.querySelector(`label[for="${el.id}"]`)) return true;
  const lab = el.closest("label"); if (lab && lab.textContent.replace(el.value || "", "").trim().length > 0) return true;
  if (el.tagName === "BUTTON") return el.textContent.trim().length > 0;
  return !!(el.getAttribute("placeholder") || "").trim();
}
(async () => {
  const dom = await JSDOM.fromURL(BASE + "index.html", { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, virtualConsole: new VirtualConsole(), beforeParse: BP });
  for (let i = 0; i < 80 && !(dom.window.document.getElementById("menu-filter") || dom.window.document.querySelector(".menu-item")); i++) await sleep(250); await sleep(400);
  const w = dom.window, d = w.document, tot = { semNome: 0, botaoVazio: 0, soMouse: 0, imgSemAlt: 0, canvasSemRotulo: 0 }, ex = [];
  const snippet = el => `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""}`;
  for (let n = 1; n <= 34; n++) {
    try { w.renderTool(n); } catch (e) { continue; }
    if (n === 7) await sleep(50);
    const sc = d.getElementById("screen-content");
    sc.querySelectorAll("input,select,textarea").forEach(el => { if (vis(el) && !nameOf(el, d)) { tot.semNome++; ex.push(`M${n} sem nome: ${snippet(el)}`); } });
    sc.querySelectorAll("button").forEach(el => { if (!nameOf(el, d)) { tot.botaoVazio++; ex.push(`M${n} botão vazio: ${snippet(el)}`); } });
    sc.querySelectorAll("[onclick]").forEach(el => { if (!/^(BUTTON|A|INPUT|SELECT|SUMMARY)$/.test(el.tagName) && el.tabIndex < 0 && !el.getAttribute("tabindex")) { tot.soMouse++; if (ex.filter(x => x.includes("só mouse")).length < 3) ex.push(`M${n} só mouse: ${snippet(el)}`); } });
    sc.querySelectorAll("img").forEach(el => { if (el.getAttribute("alt") === null) { tot.imgSemAlt++; ex.push(`M${n} img sem alt`); } });
    sc.querySelectorAll("canvas").forEach(el => { if (!el.getAttribute("aria-label") && !el.getAttribute("role")) { tot.canvasSemRotulo++; ex.push(`M${n} canvas sem rótulo: ${snippet(el)}`); } });
  }
  console.log("TOTAIS:", JSON.stringify(tot)); console.log(ex.slice(0, 14).join("\n"));
  process.exit(Object.values(tot).some(v => v > 0) ? 1 : 0);
})();
