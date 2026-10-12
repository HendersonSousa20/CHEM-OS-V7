/* Teste de fumaça (jsdom): 30 módulos, quiz, validação, CLI, NOX, links com valores e deep link. Uso: npm run serve (outro terminal) e npm run test:smoke */
/* Teste de fumaça (jsdom): renderiza os 29 módulos, quiz, validação, CLI. Uso: npm run serve (outro terminal) e npm run test:smoke */
const { JSDOM, VirtualConsole } = require("jsdom");
const errs = []; const vc = new VirtualConsole(); vc.on("jsdomError", e => errs.push(String(e.message).slice(0, 120)));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const BP = function (w) {
      w.matchMedia = () => ({ matches: false, addEventListener() {} });
      Object.defineProperty(w.HTMLElement.prototype, "innerText", { get() { return this.textContent; }, set(v) { this.textContent = v; } });
      w.AudioContext = class { constructor() { this.currentTime = 0; this.destination = {}; } createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {} }, type: "" }; } createGain() { return { connect() {}, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; } };
      w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (t, k) => k === "canvas" ? {} : (k === "measureText" ? () => ({ width: 10 }) : (k in t ? t[k] : () => {})), set: (t, k, v) => (t[k] = v, true) });
      w.HTMLElement.prototype.scrollIntoView = () => {};
};
(async () => {
  const dom = await JSDOM.fromURL(""+(process.env.CHEMOS_URL||""+(process.env.CHEMOS_BASE||"http://localhost:8080/")+"index.html")+"", { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, virtualConsole: vc,
    beforeParse: BP });
  for (let i = 0; i < 80 && !(dom.window.document.getElementById("menu-filter") || dom.window.document.querySelector(".menu-item")); i++) await sleep(250); await sleep(400);
  const w = dom.window, d = w.document, sc = () => d.getElementById("screen-content"), bad = [];
  for (let n = 1; n <= 34; n++) { try { w.renderTool(n); if (sc().textContent.trim().length < 40) bad.push(n + ":vazio"); } catch (e) { bad.push(n + ":" + e.message); } }
  console.log("módulos 1-34 com problema:", bad.join(", ") || "nenhum");
  // quiz: errar de propósito
  w.renderTool(28); d.getElementById("qz-mode").value = "0"; d.getElementById("qz-pool").value = "20"; w.startQuiz();
  let wrongSaved = "[]";
  for (let i = 0; i < 8 && wrongSaved === "[]"; i++) { d.querySelectorAll("#quiz-area button")[0].click(); await sleep(60); wrongSaved = w.localStorage.getItem("chemos-quiz-wrong") || "[]"; if (wrongSaved === "[]") await sleep(800); }
  console.log("erros salvos:", wrongSaved);
  w.renderTool(28); const opt = [...d.querySelectorAll("#qz-mode option")].pop().textContent; console.log("opção de revisão:", opt);
  d.getElementById("qz-mode").value = "4"; w.startQuiz(); console.log("revisão:", d.querySelector("#screen-content div.text-sm").textContent.trim().slice(0, 30));
  // validação
  w.renderTool(4); const c = d.getElementById("p-conc"); c.value = "-1"; c.dispatchEvent(new w.Event("input", { bubbles: true })); console.log("aviso de validação:", (d.getElementById("p-conc-warn") || {}).textContent);
  // CLI desconhecido e histórico
  const cli = d.getElementById("cli-input"); cli.value = "xyz"; cli.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Enter", bubbles: true })); console.log("toast:", (d.getElementById("toast") || {}).textContent);
  // vírgula decimal global
  console.log("parseFloat('0,25') =", w.parseFloat("0,25"));

  // módulo 30 e links compartilháveis
  w.renderTool(30); w.runOxid(); console.log("M30:", d.getElementById("oxid-result").textContent.replace(/\s+/g, " ").slice(-40));
  w.renderTool(4); d.getElementById("p-conc").value = "0.77"; d.getElementById("p-conc").dispatchEvent(new w.Event("input", { bubbles: true }));
  const url = w.chemosShareLink(4); console.log("link:", url.slice(0, 90) + "…");
  const dom2 = await JSDOM.fromURL(url, { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, virtualConsole: vc, beforeParse: BP });
  await sleep(3000);
  const w2 = dom2.window, d2 = w2.document;
  console.log("DEBUG hash:", w2.location.hash.slice(0,40), "| tela:", d2.getElementById("screen-content").textContent.trim().slice(0,60).replace(/\s+/g," "));
  console.log("link reaberto → p-conc =", (d2.getElementById("p-conc") || {}).value, "| resultado:", ((d2.getElementById("prep-result") || {}).textContent || "—").replace(/\s+/g, " ").slice(0, 50));
  const w3 = new JSDOM("").window; void w3;
  const dom3 = await JSDOM.fromURL((process.env.CHEMOS_BASE||"http://localhost:8080/")+"index.html#/m/26", { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, virtualConsole: vc, beforeParse: BP });
  await sleep(3000);
  console.log("deep link #/m/26 →", dom3.window.document.getElementById("screen-content").textContent.trim().slice(0, 40).replace(/\s+/g, " "));
  console.log("ajuda tem atalhos v8:", (w.showHelp(), d.getElementById("modal-body").textContent.includes("ATALHOS v8")));

  // tabela periódica: legenda, cores, filtro por categoria e dados locais
  w.renderTool(7); await sleep(100);
  const chips = d.querySelectorAll("#pt-legend button"), cells = d.querySelectorAll("#ptable-grid [onclick^='showElementDetails']");
  console.log("M7 legenda:", chips.length, "categorias | células coloridas:", [...cells].filter(c => c.style.backgroundColor).length + "/" + cells.length);
  chips[0].click(); await sleep(50);
  const dim = [...d.querySelectorAll("#ptable-grid [onclick^='showElementDetails']")].filter(c => parseFloat(c.style.opacity) === 0.15).length;
  console.log("M7 filtro ativo → células esmaecidas:", dim, "| chip pressionado:", d.querySelector("#pt-legend button").getAttribute("aria-pressed"));
  const sel7 = d.getElementById("pt-mode"); sel7.value = "mass"; sel7.dispatchEvent(new w.Event("change")); await sleep(50);
  const cs = d.querySelectorAll("#ptable-grid [onclick^='showElementDetails']");
  console.log("M7 modo massa → H:", cs[0].style.backgroundColor, "| Og:", cs[cs.length - 1].style.backgroundColor, "| gradiente na legenda:", d.getElementById("pt-legend").innerHTML.includes("gradient"));
  sel7.value = "block"; sel7.dispatchEvent(new w.Event("change")); await sleep(50);
  console.log("M7 modo bloco → cores distintas:", new Set([...d.querySelectorAll("#ptable-grid [onclick^='showElementDetails']")].map(c => c.style.backgroundColor)).size);
  sel7.value = "cat"; sel7.dispatchEvent(new w.Event("change"));
  sel7.value = "en"; sel7.dispatchEvent(new w.Event("change")); await sleep(50);
  const cs2 = d.querySelectorAll("#ptable-grid [onclick^='showElementDetails']");
  console.log("M7 modo EN → F:", cs2[8].style.backgroundColor, "| He (sem dado):", cs2[1].style.backgroundColor);
  sel7.value = "cat"; sel7.dispatchEvent(new w.Event("change"));
  for (const m of ["ie", "rad"]) { sel7.value = m; sel7.dispatchEvent(new w.Event("change")); await sleep(50);
    const c3 = d.querySelectorAll("#ptable-grid [onclick^='showElementDetails']");
    console.log(`M7 modo ${m} → F: ${c3[8].style.backgroundColor} | Cs: ${c3[54].style.backgroundColor} | He: ${c3[1].style.backgroundColor} | legenda: ${d.getElementById("pt-legend").textContent.slice(0, 22)}`); }
  sel7.value = "cat"; sel7.dispatchEvent(new w.Event("change"));
  w.renderTool(22); await sleep(300);
  console.log("M22 controles:", !!d.getElementById("sim-speed"), !!d.getElementById("sim-color"), !!d.getElementById("sim-press"), !!d.getElementById("sim-vol"), "| pressão exibida:", d.getElementById("sim-press") && d.getElementById("sim-press").textContent);
  d.getElementById("sim-speed").value = "0.25"; d.getElementById("sim-speed").dispatchEvent(new w.Event("change")); d.getElementById("sim-color").click();
  // laboratório virtual: fluxo completo (setup → bancada → atalhos → relatório com derivada e CSV)
  w.renderTool(23); w.geSelectExperiment("forte-forte"); w.geStartBench();
  const volOf = () => w.eval("geState.volAdded");
  const hintOk = d.getElementById("ge-content").textContent.includes("Atalhos:");
  d.dispatchEvent(new w.KeyboardEvent("keydown", { key: "a", bubbles: true })); const v1 = volOf();
  d.dispatchEvent(new w.KeyboardEvent("keydown", { key: "s", bubbles: true })); const v2 = volOf();
  d.dispatchEvent(new w.KeyboardEvent("keydown", { key: "z", bubbles: true })); const v3 = volOf();
  for (const v of [5, 10, 15, 20, 24, 24.5, 25, 25.5, 26, 30]) { w.eval(`geState.volAdded = ${v}`); w.geRegisterPoint(); }
  w.geFinish(); await sleep(100);
  console.log("M23 bancada: atalhos na tela:", hintOk, "| A→", v1, "S→", v2, "Z→", v3, "| derivada:", (d.getElementById("ge-deriv") || {}).textContent.replace(/\s+/g, " ").slice(0, 150), "| CSV:", !!d.getElementById("ge-csv-btn"));
  console.log("M23 gráfico da derivada (forte-forte):", !!d.querySelector("#ge-deriv svg"));
  for (const id of ["fraco-forte", "base-fraca", "solubilidade"]) {
    try {
      w.renderTool(23); w.geSelectExperiment(id); w.geStartBench();
      const st = w.eval("geState.step"); if (st !== 1) { console.log(`M23 ${id}: bancada não iniciou (step=${st}) →`, (d.getElementById("ge-content").textContent.match(/Preencha[^.]*\./) || ["?"])[0].slice(0, 90)); continue; }
      const vmax = w.eval("geState.vMax"), eq = w.eval("geState.equivVol");
      for (const f of [0.1, 0.3, 0.5, 0.7, 0.85, 0.95, 1.0, 1.05, 1.15, 1.4, 1.8]) { w.eval(`geState.volAdded = Math.min(${(f * eq).toFixed(4)}, geState.vMax)`); w.geRegisterPoint(); }
      w.geFinish(); await sleep(80);
      const dv = d.getElementById("ge-deriv");
      console.log(`M23 ${id}: equiv. teórico ${(+eq).toFixed(2)} mL | vMax ${(+vmax).toFixed(1)} | derivada:`, dv ? dv.textContent.replace(/\s+/g, " ").match(/estimado pela derivada: [^·]*/)?.[0] || dv.textContent.slice(60, 140).replace(/\s+/g, " ") : "SEM SEÇÃO", "| svg:", !!(dv && dv.querySelector("svg")));
    } catch (e) { console.log(`M23 ${id}: ERRO`, e.message); }
  }
  w.renderTool(22); await sleep(100); console.log("M22 gases na lista:", d.getElementById("sim-gas").options.length);
  // editor de estruturas: modelos, DBE, valência, desfazer/refazer
  w.renderTool(21); await sleep(100);
  const ed = n => { w.loadEditorTemplate(n); return [d.getElementById("se-formula").textContent, d.getElementById("se-mass").textContent, (d.getElementById("se-extra") || {}).textContent.replace(/\s+/g, " ")]; };
  console.log("M21 benzeno:", ed("Benzeno (C₆H₆)").join(" | "));
  console.log("M21 ácido acético:", ed("Ácido acético (C₂H₄O₂)").slice(0, 2).join(" | "), "| DBE:", w.ChemEditor.dbe({ C: 2, H: 4, O: 2 }));
  console.log("M21 DBE etanol/eteno/etino/CO2:", [{ C: 2, H: 6, O: 1 }, { C: 2, H: 4 }, { C: 2, H: 2 }, { C: 1, O: 2 }].map(c => w.ChemEditor.dbe(c)).join("/"));
  w.loadEditorTemplate("Etino (C₂H₂)"); w.eval("seBonds[0].order = 5"); w.updateFormulaDisplay();
  console.log("M21 valência excedida:", d.getElementById("se-extra").textContent.replace(/\s+/g, " ").slice(0, 60));
  w.loadEditorTemplate("Metano (CH₄)"); const n1 = w.eval("seAtoms.length"); w.undoEditor(); const n2 = w.eval("seAtoms.length"); w.redoEditor(); const n3 = w.eval("seAtoms.length");
  console.log("M21 desfazer/refazer (átomos): carregou", n1, "→ desfez", n2, "→ refez", n3);
  w.eval("seAtoms.push({ id: 99, x: 10, y: 10, el: 'O' })"); w.updateFormulaDisplay();
  console.log("M21 partes desconectadas:", d.getElementById("se-extra").textContent.replace(/\s+/g, " ").slice(0, 60));
  // ferramenta MOVER
  w.renderTool(21); await sleep(80); w.eval("seCanvas.width = 600; seCanvas.height = 300"); w.loadEditorTemplate("Etano (C₂H₆)"); w.setEditorTool("move");
  const cv = d.getElementById("se-canvas") || w.eval("seCanvas"), a0 = w.eval("({x: seAtoms[0].x, y: seAtoms[0].y})"), mk = (t, x, y) => new w.MouseEvent(t, { clientX: x, clientY: y, bubbles: true });
  cv.dispatchEvent(mk("pointerdown", a0.x, a0.y)); cv.dispatchEvent(mk("pointermove", a0.x + 40, a0.y + 25)); cv.dispatchEvent(mk("pointerup", a0.x + 40, a0.y + 25));
  const a1 = w.eval("({x: seAtoms[0].x, y: seAtoms[0].y})"); w.undoEditor(); const a2 = w.eval("({x: seAtoms[0].x, y: seAtoms[0].y})");
  console.log("M21 MOVER: arrastou", Math.round(a1.x - a0.x), Math.round(a1.y - a0.y), "px | desfazer volta ao ponto inicial:", Math.abs(a2.x - a0.x) < 0.01 && Math.abs(a2.y - a0.y) < 0.01, "| ligações preservadas:", w.eval("seBonds.length"));
  w.renderTool(31); w.runBond(); console.log("M31:", d.getElementById("bond-result").textContent.replace(/\s+/g, " ").slice(0, 70));
  w.renderTool(7); await w.showElementDetails(26); console.log("M7 detalhe Fe:", d.getElementById("elem-detail").textContent.replace(/\s+/g, " ").match(/Configuração:[^]{0,22}/)[0]);
  console.log("ERROS DE EXECUÇÃO:", errs.filter(e => !/cdnjs|jspdf|Could not load|ECONN|ENOTFOUND|getaddrinfo/i.test(e)).join(" | ") || "nenhum");
  process.exit(0);
})();
