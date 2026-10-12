/* Testes de UX (jsdom): trilhas/descrições, ajuda por módulo, cálculo ao vivo, casas decimais, ajustes/modo leitura, barra inferior, progresso e camada de rede.
   Uso: npm run serve (outro terminal) e npm run test:ux */
const { JSDOM, VirtualConsole } = require("jsdom");
const BASE = process.env.CHEMOS_BASE || "http://localhost:8080/", sleep = ms => new Promise(r => setTimeout(r, ms));
const BP = w => {
  w.matchMedia = () => ({ matches: false, addEventListener() {} });
  Object.defineProperty(w.HTMLElement.prototype, "innerText", { get() { return this.textContent; }, set(v) { this.textContent = v; } });
  w.AudioContext = class { constructor() { this.currentTime = 0; this.destination = {}; } createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {} }, type: "" }; } createGain() { return { connect() {}, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; } };
  w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: (t, k) => k === "canvas" ? {} : (k === "measureText" ? () => ({ width: 10 }) : (k in t ? t[k] : () => {})), set: (t, k, v) => (t[k] = v, true) });
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.fetch = (u, o = {}) => new Promise((res, rej) => { if (o.signal) o.signal.addEventListener("abort", () => rej(Object.assign(new Error("abort"), { name: "AbortError" }))); if (String(u).includes("ok")) setTimeout(() => res({ ok: true }), 20); });
};

let ok = 0, bad = 0; const check = (n, c, info = "") => { c ? ok++ : bad++; console.log(c ? "OK   " : "FALHA", n, info); };
(async () => {
  const dom = await JSDOM.fromURL(BASE + "index.html", { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, virtualConsole: new VirtualConsole(), beforeParse: BP });
  for (let i = 0; i < 80 && !(dom.window.document.getElementById("menu-filter") || dom.window.document.querySelector(".menu-item")); i++) await sleep(250); await sleep(400);
  const w = dom.window, d = w.document, sc = () => d.getElementById("screen-content"), txt = id => ((d.getElementById(id) || {}).textContent || "").replace(/\s+/g, " ").trim();
  // início
  w.renderHome(); await sleep(50);
  check("home: trilhas", d.querySelectorAll(".track").length === 5, d.querySelectorAll(".track").length + " trilhas");
  check("home: descrição em todos os módulos", d.querySelectorAll("#menu-groups .menu-desc").length >= 34, d.querySelectorAll("#menu-groups .menu-desc").length + " descrições");
  check("home: boas-vindas na primeira visita", !!d.getElementById("welcome-box"));
  const f = d.getElementById("menu-filter"); f.value = "equilíbrio químico"; f.dispatchEvent(new w.Event("input", { bubbles: true }));
  check("busca encontra por descrição (ex.: 'constante de equilíbrio')", (f.value = "constante de equilíbrio", f.dispatchEvent(new w.Event("input", { bubbles: true })), d.querySelectorAll("#menu-groups .menu-item:not(.hidden)").length >= 1));
  // ajuda por módulo
  let missing = []; for (let n = 1; n <= 34; n++) { w.renderTool(n); if (!sc().querySelector(".mod-desc") || !sc().querySelector(".mod-help")) missing.push(n); }
  check("ajuda (descrição + teoria) em todos os 34 módulos", !missing.length, missing.join(",") || "");
  w.renderTool(6); check("glossário: Ka com dica", !!sc().querySelector("abbr.gloss"));
  // cálculo ao vivo: resultado ao abrir
  const init = {}; for (const n of [3, 5, 9, 10, 12, 14, 16, 18, 19, 27, 29, 30, 31]) { w.renderTool(n); await sleep(120); const r = [...d.querySelectorAll('#screen-content [id$="-result"]')].map(e => e.textContent).join(" ").replace(/\s+/g, " ").trim(); init[n] = r; }
  const weak = Object.entries(init).filter(([n, r]) => !r || /^(clique|digite|aguardando|preencha)/i.test(r) || (/inv[áa]lid|erro|informe/i.test(r.slice(0, 120)) || /\bNaN\b|\bundefined\b/.test(r)));
  check("ao vivo: resultado inicial válido nos módulos listados", !weak.length, weak.map(([n, r]) => n + ":" + r.slice(0, 40)).join(" | "));
  // ao vivo: atualiza ao digitar
  w.renderTool(5); await sleep(150); const before = [...d.querySelectorAll('#screen-content [id$="-result"]')].map(e => e.textContent).join("|");
  const c1 = d.getElementById("d-c1"); c1.value = String(parseFloat(c1.value || "1") * 2); c1.dispatchEvent(new w.Event("input", { bubbles: true })); await sleep(1000);
  const after = [...d.querySelectorAll('#screen-content [id$="-result"]')].map(e => e.textContent).join("|");
  check("ao vivo: diluição atualiza ao digitar", before !== after, before.slice(0, 40) + " → " + after.slice(0, 40));
  // casas decimais
  check("casas decimais: arredondamento de texto", w.ChemRound.roundText("pH = 2,872345 e 3.14159265 e 1.8e-5", 3) === "pH = 2,872 e 3.142 e 1.8e-5", w.ChemRound.roundText("pH = 2,872345 e 3.14159265 e 1.8e-5", 3));
  w.renderTool(6); await sleep(150); w.showSettings(); const sel = d.getElementById("set-dec"); sel.value = "2"; sel.dispatchEvent(new w.Event("change", { bubbles: true })); w.closeModal(); await sleep(50);
  const longNum = [...d.querySelectorAll('#screen-content [id$="-result"]')].map(e => e.textContent).join(" ").match(/\d+[.,]\d{3,}(?![\d]|[eE])/);
  check("casas decimais: resultados com no máximo 2 casas", !longNum, longNum ? longNum[0] : "");
  w.showSettings(); d.getElementById("set-dec").value = "auto"; d.getElementById("set-dec").dispatchEvent(new w.Event("change", { bubbles: true })); w.closeModal();
  // modo leitura sobrevive à troca de tema
  w.showSettings(); d.querySelector('#settings-body [data-act="read"]').click(); w.setTheme("amber");
  check("modo leitura persiste após trocar de tema", d.documentElement.classList.contains("reading-mode"));
  w.showSettings(); d.querySelector('#settings-body [data-act="read"]').click(); w.closeModal(); w.setTheme("green");
  check("modo leitura desligável", !d.documentElement.classList.contains("reading-mode"));
  // barra inferior, ações recolhidas, progresso
  check("barra inferior com 4 botões", d.querySelectorAll("#mobile-nav button").length === 4);
  w.renderTool(4); const bar = sc().querySelector("div.mb-2"); check("ações recolhidas em 'MAIS'", !!bar.querySelector(".bar-more .dos-btn") && !!bar.querySelector(".bar-more-toggle"), bar.querySelectorAll(".bar-more .dos-btn").length + " botões agrupados");
  bar.querySelector(".bar-more-toggle").click(); check("botão MAIS abre o grupo", bar.querySelector(".bar-more").classList.contains("open"));
  w.showProgress(); check("painel de progresso", /visitados/.test(txt("modal-body")), txt("modal-body").slice(0, 60)); w.closeModal();
  // conversor de unidade por campo, trilha, balanceador, atalho ?
  w.renderTool(11); await sleep(100);
  const gp = d.getElementById("gi-p"), ub = gp.nextElementSibling; check("campo de pressão tem botão ⇄ atm", !!ub && ub.classList.contains("unit-btn") && /atm/.test(ub.textContent), ub && ub.textContent);
  ub.click(); const uv = d.getElementById("uc-val"), uf = d.getElementById("uc-from"); uf.value = "mmHg"; uv.value = "760"; uv.dispatchEvent(new w.Event("input", { bubbles: true }));
  check("conversão 760 mmHg → 1 atm", /760 mmHg = 1 atm/.test(txt("uc-out")), txt("uc-out"));
  d.getElementById("uc-use").click(); await sleep(30); check("USAR NO CAMPO escreve o valor convertido", d.getElementById("gi-p").value === "1" && d.getElementById("modal").classList.contains("hidden"), d.getElementById("gi-p").value);
  const kt = d.getElementById("gi-t"); kt.nextElementSibling.click(); d.getElementById("uc-from").value = "°C"; d.getElementById("uc-val").value = "25"; d.getElementById("uc-val").dispatchEvent(new w.Event("input", { bubbles: true }));
  check("conversão 25 °C → 298,15 K", /25 °C = 298,15 K/.test(txt("uc-out")), txt("uc-out")); w.closeModal();
  w.renderTool(4); await sleep(50); d.getElementById("p-conc").nextElementSibling.click(); d.getElementById("uc-from").value = "mmol/L"; d.getElementById("uc-val").value = "500"; d.getElementById("uc-val").dispatchEvent(new w.Event("input", { bubbles: true }));
  check("conversão 500 mmol/L → 0,5 mol/L", /500 mmol\/L = 0,5 mol\/L/.test(txt("uc-out")), txt("uc-out")); w.closeModal();
  w.renderTool(3); await sleep(50); const tn = sc().querySelector(".track-nav"); check("trilha: módulo 3 tem próximo (Mol e massa)", !!tn && /Mol e massa/.test(tn.textContent) && !/←/.test(tn.textContent), tn && tn.textContent.slice(0, 80));
  w.renderTool(1); await sleep(50); check("trilha: último módulo da trilha mostra o fim", /fim da trilha/.test(sc().querySelector(".track-nav").textContent));
  w.renderTool(1); await sleep(100); d.getElementById("eq-input").value = "C3H8 + O2 -> CO2 + H2O"; w.runBalancer(); await sleep(500); const bp = d.querySelector(".steps-panel");
  check("passo a passo do balanceador (conferência de átomos)", !!bp && /C: esquerda 1 × 3 = 3 · direita 3 × 1 = 3 ✓/.test(bp.textContent) && /H: esquerda 1 × 8 = 8 · direita 4 × 2 = 8 ✓/.test(bp.textContent), bp ? bp.textContent.replace(/\s+/g, " ").slice(60, 200) : "painel ausente");
  d.getElementById("eq-input").value = "Fe3+ + e- -> Fe2+"; w.runBalancer(); await sleep(500); check("balanceador: sem painel quando a reação falha", !d.querySelector(".steps-panel"));
  let helped = false; const oh = w.showHelp; w.showHelp = () => { helped = true; }; d.dispatchEvent(new w.KeyboardEvent("keydown", { key: "?", bubbles: true })); w.showHelp = oh; check("atalho ? abre a ajuda", helped);
  // separador decimal
  const sp = w.ChemRound.sepText("pH 2.87; 1.8e-5; CuSO4.5H2O; 2,2-dimetil; 1.2.3; v1.5H", "comma");
  check("vírgula decimal: converte números e preserva fórmulas, localizadores e versões", sp === "pH 2,87; 1,8e-5; CuSO4.5H2O; 2,2-dimetil; 1.2.3; v1.5H", sp);
  w.renderTool(10); await sleep(300); const t10 = txt("buffer-result");
  check("vírgula decimal: resultado do tampão com vírgula", /pH = 4,94/.test(t10) && !/\d\.\d/.test(t10.replace(/\[|\]/g, "")), t10.slice(0, 60));
  w.showSettings(); d.getElementById("set-sep").value = "auto"; d.getElementById("set-sep").dispatchEvent(new w.Event("change", { bubbles: true })); w.closeModal(); w.renderTool(10); await sleep(300);
  check("separador 'como vem do módulo' mantém o ponto", /pH = 4\.94/.test(txt("buffer-result")), txt("buffer-result").slice(0, 60));
  w.showSettings(); d.getElementById("set-sep").value = "comma"; d.getElementById("set-sep").dispatchEvent(new w.Event("change", { bubbles: true })); w.closeModal();
  // passo a passo
  const stepCase = async (name, n, vals, run, expect) => {
    w.renderTool(n); await sleep(100); Object.entries(vals).forEach(([k, val]) => { d.getElementById(k).value = val; }); w[run](); await sleep(500);
    const p = d.querySelector(".steps-panel"); check(`passo a passo: ${name}`, !!p && p.textContent.includes(expect), p ? p.textContent.replace(/\s+/g, " ").slice(0, 110) : "painel ausente");
  };
  await stepCase("diluição (V₁ = 250 × 1 ÷ 18 = 13,889 mL)", 5, { "d-c1": "18", "d-v1": "", "d-c2": "1", "d-v2": "250" }, "runDilution", "13,889");
  await stepCase("preparo (7,305 g)", 4, { "p-mm": "58.44", "p-conc": "0.5", "p-vol": "250", "p-purity": "100" }, "runPrep", "7,305");
  await stepCase("ácido fraco (pH ≈ 2,87)", 6, { "wa-conc": "0.1", "wa-ka": "1.8e-5" }, "runWeakAcidPH", "2,875");
  await stepCase("tampão (pH 5,06)", 10, { "buf-pka": "4.76", "buf-base": "0.2", "buf-acid": "0.1" }, "runBufferCalc", "5,061");
  await stepCase("gás ideal (22,41 L)", 11, { "gi-p": "1", "gi-v": "", "gi-n": "1", "gi-t": "273.15" }, "runIdealGasLaw", "22,41");
  await stepCase("Nernst (E = 1,1 V)", 12, { "ner-e0": "1.10", "ner-n": "2", "ner-q": "1", "ner-t": "298.15" }, "runNernst", "1,1");
  await stepCase("cinética ordem 1 (t½ = 13,863; [A] = 0,6065)", 14, { "kin-order": "1", "kin-k": "0.05", "kin-a0": "1", "kin-t": "10" }, "runKinetics", "0,6065");
  await stepCase("Beer-Lambert (A = 1,5)", 17, { "bl-a": "", "bl-eps": "15000", "bl-b": "1", "bl-c": "0.0001" }, "runBeerLambert", "1,5");
  await stepCase("Kps 1:2 (s = 0,015874 mol/L)", 19, { "ksp-p": "1", "ksp-q": "2", "ksp-value": "1.6e-5", "ksp-common": "0" }, "runSolubility", "0,015874");
  await stepCase("titulação forte-forte (25 mL)", 16, { "tit-ca": "0.1", "tit-va": "25", "tit-cb": "0.1", "tit-vmax": "50" }, "runTitrationCurve", "25 mL");
  await stepCase("titulação ácido fraco (pH 8,72 no equivalente)", 18, { "tf-ca": "0.1", "tf-va": "25", "tf-ka": "1.8e-5", "tf-cb": "0.1", "tf-vmax": "50" }, "runWeakTitrationCurve", "8,72");
  await stepCase("massa molar (K₄[Fe(CN)₆] = 368,3)", 3, { "molar-input": "K4[Fe(CN)6]" }, "runMolarMass", "368,3");
  await stepCase("termoquímica (ΔG° = −817,8 kJ/mol)", 9, { "thermo-eq": "CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)", "thermo-temp": "298.15" }, "runThermochemistry", "817,8");
  await stepCase("Kc (N₂ + 3H₂ ⇌ 2NH₃ → 0,023704)", 15, { "eq-kc-eq": "N2 + 3H2 -> 2NH3", "eq-kc-concs": "0.5, 1.5, 0.2" }, "runEquilibriumKc", "0,023704");
  await stepCase("estequiometria (H₂ + O₂ → H₂O; limitante O₂; 22,52 g)", 8, { "stoich-eq": "2H2 + O2 -> 2H2O", "stoich-masses": "4,20", "stoich-actual": "" }, "runStoichiometry", "Reagente limitante: O2");
  w.showAbout(); check("sobre e limitações abre com fontes e avisos", /Pauling/.test(txt("modal-body")) && /OPSIN/.test(txt("modal-body")) && /revis/.test(txt("modal-body"))); w.closeModal();
  w.showSettings(); check("ajustes tem botão Sobre", !!d.querySelector('#settings-body [data-act="about"]')); w.closeModal();
  w.renderTool(5); await sleep(100); ["d-c1", "d-v1", "d-c2", "d-v2"].forEach(k => d.getElementById(k).value = ""); w.runDilution(); await sleep(400);
  check("passo a passo some quando os campos são inválidos", !d.querySelector(".steps-panel"));
  // rede: indicador, cancelar, offline
  const p = w.fetch("http://example.org/hang").then(() => "resolvido", e => e.name); await sleep(30);
  check("rede: indicador aparece durante a consulta", d.getElementById("net-bar") && d.getElementById("net-bar").style.display === "flex" && w.ChemNet.pending === 1);
  d.getElementById("net-cancel").click(); const r1 = await p; await sleep(20);
  check("rede: CANCELAR aborta a consulta e esconde o indicador", r1 === "AbortError" && d.getElementById("net-bar").style.display === "none", r1);
  Object.defineProperty(w.navigator, "onLine", { value: false, configurable: true });
  const off = await w.fetch("http://example.org/x").then(() => "ok", e => e.message);
  check("rede: mensagem clara quando está offline", /Sem conexão/.test(off), off.slice(0, 50));
  console.log(`\n${ok} passaram, ${bad} falharam`); process.exit(bad ? 1 : 0);
})();
