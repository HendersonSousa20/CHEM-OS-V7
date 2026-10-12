/* AUDITORIA (v10.3): casos de resposta conhecida em todos os módulos de cálculo, conferência de amostras das tabelas de dados vs. valores de referência padrão, integridade do banco de perguntas e busca. Uso: servidor em localhost:8080 e `node tests/audit.js` */
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
  const report = (good, name, extra) => { good ? ok++ : fail++; console.log(good ? "OK   " : "FALHA", name, good ? "" : extra || ""); };
  const T = "[➔→>-]+";
  const X = t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const EP = (m, c, an, el = "inert") => ({ "elp-medium": m, "elp-cat": c, "elp-an": an, "elp-el": el });
  // [módulo, nome, campos, função, esperados (número ou RegExp)]
  const CASES = [
    [3, "Massa molar K4[Fe(CN)6] = 368,35", { "molar-input": "K4[Fe(CN)6]" }, "runMolarMass", [368.35]],
    [3, "Massa molar Ca3(PO4)2 = 310,18", { "molar-input": "Ca3(PO4)2" }, "runMolarMass", [310.18]],
    [3, "Massa molar CuSO4·5H2O = 249,68", { "molar-input": "CuSO4·5H2O" }, "runMolarMass", [249.68]],
    [1, "Balanceador C3H8 + 5O2 → 3CO2 + 4H2O", { "eq-input": "C3H8 + O2 -> CO2 + H2O" }, "runBalancer", [new RegExp("C3H8\\s*\\+\\s*5\\s*O2\\s*" + T + "\\s*3\\s*CO2\\s*\\+\\s*4\\s*H2O")]],
    [1, "Balanceador redox grande (10,122,299,162,5,60,188)", { "eq-input": "K4[Fe(CN)6] + KMnO4 + H2SO4 -> KHSO4 + Fe2(SO4)3 + MnSO4 + HNO3 + CO2 + H2O" }, "runBalancer", [10, 122, 299, 162, 5, 60, 188]],
    [1, "Balanceador 4Fe + 3O2 → 2Fe2O3", { "eq-input": "Fe + O2 -> Fe2O3" }, "runBalancer", [new RegExp("4\\s*Fe\\s*\\+\\s*3\\s*O2\\s*" + T + "\\s*2\\s*Fe2O3")]],
    [5, "Diluição: V1 = 25", { "d-c1": "2", "d-v1": "", "d-c2": "0.5", "d-v2": "100" }, "runDilution", [25]],
    [6, "pH ácido fraco 0,1 M, Ka 1,8e-5 = 2,87", { "wa-conc": "0.1", "wa-ka": "1.8e-5" }, "runWeakAcidPH", [2.87]],
    [8, "Estequiometria: 22,52 g de H2O, O2 limitante", { "stoich-eq": "2H2 + O2 -> 2H2O", "stoich-masses": "4,20", "stoich-actual": "" }, "runStoichiometry", [22.52, /LIMITANTE:\s*O2/]],
    [9, "Termoquímica CH4: ΔH −890, ΔG −818", { "thermo-eq": "CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)", "thermo-temp": "298.15" }, "runThermochemistry", [-890.4, -818]],
    [9, "Termoquímica C3H8: ΔH −2219,9", { "thermo-eq": "C3H8(g) + 5O2(g) -> 3CO2(g) + 4H2O(l)", "thermo-temp": "298.15" }, "runThermochemistry", [-2219.9]],
    [11, "Gás combinado: P2 = 2,198 atm", { "g-p1": "1", "g-v1": "10", "g-t1": "273", "g-p2": "", "g-v2": "5", "g-t2": "300" }, "runCombinedGasLaw", [2.198]],
    [11, "Gás ideal: 1 mol, 1 atm, 273,15 K → 22,41 L", { "gi-p": "1", "gi-v": "", "gi-n": "1", "gi-t": "273.15" }, "runIdealGasLaw", [22.41]],
    [12, "Nernst: E = 1,109 V", { "ner-e0": "1.10", "ner-n": "2", "ner-q": "0.5", "ner-t": "298.15" }, "runNernst", [1.109]],
    [14, "Cinética 1ª ordem: t½ = 13,86", { "kin-order": "1", "kin-k": "0.05", "kin-a0": "1.0", "kin-t": "" }, "runKinetics", [13.86]],
    [14, "Cinética 2ª ordem: t½ = 1,0", { "kin-order": "2", "kin-k": "0.5", "kin-a0": "2", "kin-t": "" }, "runKinetics", [1.0]],
    [14, "Cinética ordem 0: t½ = 10", { "kin-order": "0", "kin-k": "0.1", "kin-a0": "2", "kin-t": "" }, "runKinetics", [10]],
    [15, "Kc da amônia = 0,0237", { "eq-kc-eq": "N2 + 3H2 -> 2NH3", "eq-kc-concs": "0.5, 1.5, 0.2" }, "runEquilibriumKc", [0.0237]],
    [16, "Titulação forte: equivalência 25 mL, pH 7", { "tit-ca": "0.1", "tit-va": "25", "tit-cb": "0.1", "tit-vmax": "50" }, "runTitrationCurve", [25, 7]],
    [18, "Titulação fraca: equivalência 25 mL, pH 8,72", { "tf-ca": "0.1", "tf-va": "25", "tf-ka": "1.8e-5", "tf-cb": "0.1", "tf-vmax": "50" }, "runWeakTitrationCurve", [25, 8.72]],
    [19, "Ksp 1:2 (1,6e-5): s = 0,01587", { "ksp-p": "1", "ksp-q": "2", "ksp-value": "1.6e-5", "ksp-common": "0", "ksp-common-target": "cation" }, "runSolubility", [0.01587]],
    [17, "Beer-Lambert: A = 1,5", { "bl-a": "", "bl-eps": "15000", "bl-b": "1", "bl-c": "0.0001" }, "runBeerLambert", [1.5]],
    [17, "Espectroscopia: 500 nm = 2,48 eV", { "spec-lambda": "500" }, "runSpectroConvert", [2.48]],
    [27, "Fórmula empírica CH₂O e molecular C₆H₁₂O₆", { "fm-input": "C 40,0\nH 6,71\nO 53,29", "fm-mm": "180" }, "runFormula", [/CH₂O/, /C₆H₁₂O₆/]],
    [29, "Mol: 10 g de Ca3(PO4)2 = 0,0322 mol", { "mol-formula": "Ca3(PO4)2", "mol-mass": "10", "mol-n": "" }, "runMole", [0.03224]],
    [30, "NOX do Mn no KMnO4 = +7", { "ox-formula": "KMnO4", "ox-charge": "0", "ox-target": "" }, "runOxid", [/Mn[^\n]{0,40}\+?7/]],
    [30, "NOX do Cr no K2Cr2O7 = +6", { "ox-formula": "K2Cr2O7", "ox-charge": "0", "ox-target": "" }, "runOxid", [/Cr[^\n]{0,40}\+?6/]],
    [30, "NOX do O no H2O2 = −1", { "ox-formula": "H2O2", "ox-charge": "0", "ox-target": "" }, "runOxid", [/O[^\n]{0,40}[−-]\s?1/]],
    [31, "Ligação Na–Cl: ΔEN 2,23, iônica", { "bd-a": "Na", "bd-b": "Cl" }, "runBond", [2.23, /[Ii]ônic/]],
    [31, "Ligação O–H: ΔEN 1,24, polar", { "bd-a": "O", "bd-b": "H" }, "runBond", [1.24, /[Pp]olar/]],
    [32, "Pilha de Daniell: E° +1,10 V e ΔG° −212,3 kJ/mol", { "pil-cat": "cu", "pil-an": "zn", "pil-q": "1", "pil-t": "298.15" }, "runCell", [1.10, -212.3, /1,54 × 10³⁷/]],
    [32, "Pilha Zn–Ag: E° +1,56 V, n = 2", { "pil-cat": "ag", "pil-an": "zn", "pil-q": "1", "pil-t": "298.15" }, "runCell", [1.56, -301.0, /n = 2/]],
    [32, "Pilha H₂–O₂: E° +1,23 V, n = 4", { "pil-cat": "o2", "pil-an": "h2", "pil-q": "1", "pil-t": "298.15" }, "runCell", [1.23, -474.7, /n = 4/]],
    [32, "Pilha Li–F₂: E° +5,91 V e ΔG° −1140,5 kJ/mol (sem separador de milhar)", { "pil-cat": "f2", "pil-an": "li", "pil-q": "1", "pil-t": "298.15" }, "runCell", [5.91, /−1140,5 kJ\/mol/]],
    [33, "Eletrólise Cu 2 A × 1 h: 2,371 g, Q = 7200 C", { "ele-sub": "cu", "ele-i": "2", "ele-t": "1", "ele-tu": "h", "ele-m": "", "ele-eff": "100", "ele-temp": "298.15", "ele-p": "1" }, "runElectrolysis", [2.371, /7200 C/]],
    [33, "Eletrólise Ag 1,5 A × 30 min: 3,019 g", { "ele-sub": "ag", "ele-i": "1.5", "ele-t": "30", "ele-tu": "min", "ele-m": "", "ele-eff": "100", "ele-temp": "298.15", "ele-p": "1" }, "runElectrolysis", [3.019, /2700 C/]],
    [33, "Eletrólise Al: 10 g com 50 A → 35,76 min (2146 s)", { "ele-sub": "al", "ele-i": "50", "ele-t": "", "ele-tu": "min", "ele-m": "10", "ele-eff": "100", "ele-temp": "298.15", "ele-p": "1" }, "runElectrolysis", [35.76, 2146, /107300 C/]],
    [33, "Eletrólise Zn: 1 g em 30 min → 1,640 A", { "ele-sub": "zn", "ele-i": "", "ele-t": "30", "ele-tu": "min", "ele-m": "1", "ele-eff": "100", "ele-temp": "298.15", "ele-p": "1" }, "runElectrolysis", [1.640]],
    [33, "Eletrólise da água: H₂ com 1 A × 1 h → 0,4565 L", { "ele-sub": "h2", "ele-i": "1", "ele-t": "1", "ele-tu": "h", "ele-m": "", "ele-eff": "100", "ele-temp": "298.15", "ele-p": "1" }, "runElectrolysis", [0.4565, 0.03761]],
    [33, "Eletrólise Cu com rendimento de 80 %: 1,897 g", { "ele-sub": "cu", "ele-i": "2", "ele-t": "1", "ele-tu": "h", "ele-m": "", "ele-eff": "80", "ele-temp": "298.15", "ele-p": "1" }, "runElectrolysis", [1.897]],
    [33, "Eletrólise: mais de um campo em branco gera aviso", { "ele-sub": "cu", "ele-i": "", "ele-t": "", "ele-tu": "h", "ele-m": "", "ele-eff": "100", "ele-temp": "298.15", "ele-p": "1" }, "runElectrolysis", [/exatamente UM campo/]],
    [32, "Daniell com Q = 10 (Nernst): E = 1,070 V", { "pil-cat": "cu", "pil-an": "zn", "pil-q": "10", "pil-t": "298.15" }, "runCell", [1.070]],
    [32, "Bateria de chumbo-ácido: E° +2,05 V", { "pil-cat": "pbo2", "pil-an": "pbso4", "pil-q": "1", "pil-t": "298.15" }, "runCell", [2.05, -395.6]],
    [32, "Célula alcalina H₂–O₂ (meio básico): E° +1,23 V", { "pil-cat": "o2b", "pil-an": "h2o", "pil-q": "1", "pil-t": "298.15" }, "runCell", [1.23, -474.7, /n = 4/]],
    [32, "Pilha invertida: E° −1,10 V, não espontânea", { "pil-cat": "zn", "pil-an": "cu", "pil-q": "1", "pil-t": "298.15" }, "runCell", [-1.10, /NÃO espontânea/]],
    [32, "Mesmo par nos dois lados: mensagem de erro", { "pil-cat": "cu", "pil-an": "cu", "pil-q": "1", "pil-t": "298.15" }, "runCell", [/mesma semirreação/]],
    [34, "Previsão: NaCl fundido → 2 NaCl → 2 Na + Cl₂", EP("molten", "na", "cl"), "runElectroPredict", [X("2 NaCl → 2 Na + Cl₂")]],
    [34, "Previsão: NaCl aquoso → H₂ + Cl₂ + NaOH", EP("aq", "na", "cl"), "runElectroPredict", [X("2 H₂O + 2 Cl⁻ → H₂ + 2 OH⁻ + Cl₂"), /NaOH/, /básica/]],
    [34, "Previsão: CuSO₄ aquoso → Cu + O₂ + H₂SO₄", EP("aq", "cu", "so4"), "runElectroPredict", [X("2 Cu²⁺ + 2 H₂O → 2 Cu + O₂ + 4 H⁺"), /H₂SO₄/]],
    [34, "Previsão: CuSO₄ com ânodo de cobre → refino", EP("aq", "cu", "so4", "active"), "runElectroPredict", [/refino eletrolítico/, /Cu\(ânodo\) → Cu\(cátodo\)/]],
    [34, "Previsão: Na₂SO₄ aquoso → eletrólise da água", EP("aq", "na", "so4"), "runElectroPredict", [X("2 H₂O → 2 H₂ + O₂")]],
    [34, "Previsão: KI aquoso → H₂ + I₂ + KOH", EP("aq", "k", "i"), "runElectroPredict", [/H₂ \+ 2 OH⁻/, /I₂/, /KOH/]],
    [34, "Previsão: AgNO₃ aquoso → Ag + O₂ + HNO₃", EP("aq", "ag", "no3"), "runElectroPredict", [X("4 Ag⁺ + 2 H₂O → 4 Ag + O₂ + 4 H⁺"), /HNO₃/]],
    [34, "Previsão: Al₂O₃ fundido → 2 Al₂O₃ → 4 Al + 3 O₂", EP("molten", "al", "o"), "runElectroPredict", [X("2 Al₂O₃ → 4 Al + 3 O₂")]],
    [34, "Previsão: H₂SO₄ aquoso → eletrólise da água", EP("aq", "h", "so4"), "runElectroPredict", [X("2 H₂O → 2 H₂ + O₂")]],
    [34, "Previsão: NaOH aquoso → eletrólise da água", EP("aq", "na", "oh"), "runElectroPredict", [X("2 H₂O → 2 H₂ + O₂")]],
    [34, "Previsão: CuCl₂ aquoso → Cu + Cl₂", EP("aq", "cu", "cl"), "runElectroPredict", [X("Cu²⁺ + 2 Cl⁻ → Cu + Cl₂")]],
    [34, "Previsão: NaOH fundido → 4 Na + O₂ + 2 H₂O", EP("molten", "na", "oh"), "runElectroPredict", [X("4 NaOH → 4 Na + O₂ + 2 H₂O")]],
    [34, "Previsão: H⁺ com OH⁻ gera aviso", EP("aq", "h", "oh"), "runElectroPredict", [/não existe/]],
    [34, "Previsão: AgCl em água gera aviso de solubilidade", EP("aq", "ag", "cl"), "runElectroPredict", [/pouco solúvel/]],
    [34, "Previsão: nitrato fundido gera aviso", EP("molten", "na", "no3"), "runElectroPredict", [/decompõem/]],
  ];
  for (const [mod, name, vals, fn, exp] of CASES) {
    try {
      w.localStorage.clear(); w.renderTool(mod);
      for (const [k, v] of Object.entries(vals)) { const el = d.getElementById(k); if (!el) throw new Error("sem campo " + k); el.value = v; }
      await w[fn](); await sleep(250);
      const text = d.getElementById("screen-content").textContent.replace(/\s+/g, " "), ns = nums(text.replace(/\u2212/g, "-"));
      const miss = exp.filter(x => x instanceof RegExp ? !x.test(text) : !ns.some(n => Math.abs(n - x) <= Math.max(0.015 * Math.abs(x), 0.011)));
      report(!miss.length, name, `faltou ${miss} | números lidos: ${ns.slice(0, 14).join(" ")} | texto: ${text.slice(0, 260)}`);
    } catch (e) { report(false, name, e.message); }
  }
  // Tabelas de dados vs. referências (CRC/NIST/IUPAC)
  const REF = {
    ATOMIC_WEIGHTS: [{ H: 1.008, C: 12.011, N: 14.007, O: 15.999, Na: 22.99, Mg: 24.305, Al: 26.982, S: 32.06, Cl: 35.45, K: 39.098, Ca: 40.078, Fe: 55.845, Cu: 63.546, Zn: 65.38, Ag: 107.87, Au: 196.97, Pb: 207.2 }, 0.005, true],
    PAULING: [{ H: 2.2, C: 2.55, N: 3.04, O: 3.44, F: 3.98, Na: 0.93, Mg: 1.31, Al: 1.61, Si: 1.9, P: 2.19, S: 2.58, Cl: 3.16, K: 0.82, Ca: 1.0, Fe: 1.83, Cu: 1.9, Br: 2.96, I: 2.66, Cs: 0.79, Au: 2.54 }, 0.03, false],
    IONIZATION: [{ H: 13.598, He: 24.587, Li: 5.392, C: 11.26, N: 14.534, O: 13.618, F: 17.423, Ne: 21.565, Na: 5.139, Mg: 7.646, Al: 5.986, Cl: 12.968, K: 4.341, Fe: 7.902, Cu: 7.726, Cs: 3.894, Tc: 7.119 }, 0.05, false],
  };
  for (const [tbl, [ref, tol, rel]] of Object.entries(REF)) {
    const t = w.eval(tbl), bad = Object.entries(ref).filter(([k, v]) => t[k] == null || Math.abs(t[k] - v) > (rel ? tol * v : tol));
    report(!bad.length, `Tabela ${tbl}: ${Object.keys(ref).length} valores conferem`, JSON.stringify(bad));
  }
  const TH = w.eval("THERMO_DB"), THREF = { "H2O(l)": [-285.8, 69.9], "CO2(g)": [-393.5, 213.7], "CH4(g)": [-74.8, 186.3], "NH3(g)": [-45.9, 192.8], "NaCl(s)": [-411.2, 72.1], "C2H5OH(l)": [-277.7, 160.7], "SO2(g)": [-296.8, 248.2], "CaCO3(s)": [-1206.9, 92.9], "C3H8(g)": [-103.8, 270.3], "HF(g)": [-273.3, 173.8] };
  const badT = Object.entries(THREF).filter(([k, [h, s]]) => !TH[k] || Math.abs(TH[k].dHf - h) > 2.5 || Math.abs(TH[k].S - s) > 2.5);
  report(!badT.length, "Tabela THERMO_DB: ΔHf° e S° conferem", JSON.stringify(badT.map(x => x[0])));
  // Tabela de potenciais-padrão de redução (módulo 32) vs. valores publicados (CRC/LibreTexts), tolerância 0,02 V
  const E0 = w.eval("GALVANIC_E0"), E0REF = { li: -3.04, na: -2.71, al: -1.66, zn: -0.76, fe: -0.44, cd: -0.40, sn: -0.14, pb: -0.13, h2: 0, cu: 0.34, i2: 0.54, fe3: 0.77, ag: 0.80, cr2o7: 1.33, cl2: 1.36, mno4: 1.51, f2: 2.87, pbso4: -0.36, pbo2: 1.69, agcl: 0.22, o2b: 0.40, h2o: -0.83, h2o2: 1.77, no3: 0.96, ce: 1.61 };
  const badE = Object.entries(E0REF).filter(([k, v]) => E0[k] == null || Math.abs(E0[k] - v) > 0.02);
  const ev = Object.values(E0), sorted = ev.every((v, i) => i === 0 || v >= ev[i - 1]);
  report(!badE.length && sorted && ev.length >= 36, "Tabela GALVANIC_E0: " + ev.length + " semirreações em ordem crescente de E°, valores conferem", JSON.stringify(badE) + " ordenada=" + sorted);
  // Tabela periódica completa: 118 elementos coerentes
  const EL = w.eval("ELEMENTS_DB"), cnt = {}; EL.forEach(e => cnt[e.cat] = (cnt[e.cat] || 0) + 1);
  const wantCat = { "Não-Metal": 7, "Gás Nobre": 7, "Alcalino": 6, "Alcalino-Térreo": 6, "Metalóide": 6, "Halogênio": 6, "Pós-Transição": 12, "Transição": 38, "Lantanídeo": 15, "Actinídeo": 15 };
  const okEL = EL.length === 118 && EL.every((e, i) => e.num === i + 1) && new Set(EL.map(e => e.sym)).size === 118 && Object.entries(wantCat).every(([k, v]) => cnt[k] === v) && EL.every(e => e.period >= 1 && e.period <= 7);
  report(okEL, "118 elementos: números 1–118, símbolos únicos, categorias e períodos coerentes", JSON.stringify(cnt));
  // Painel GHS (segurança): pictogramas por código H, ordem de gravidade, "sem dados" nunca vira "seguro"
  const gk = (h, p, g) => w.ghsAnalyze({ hazards: h, pictograms: p || [], signal: g }).keys.join(",");
  const ghsChecks = [
    ["H318 → corrosão", gk(["H318 (50%): Causes serious eye damage [Danger]"]) === "corrosivo"],
    ["H304 → saúde (e NÃO caveira)", gk(["H304: May be fatal if swallowed and enters airways [Danger]"]) === "saude"],
    ["H340 + H360 + H372 → saúde", gk(["H340: a", "H360: b", "H372: c"]) === "saude"],
    ["H300 → caveira", gk(["H300: Fatal if swallowed [Danger]"]) === "toxico"],
    ["H335/H336 → exclamação", gk(["H335: a", "H336: b"]) === "irritante"],
    ["H410 → ambiente", gk(["H410: Very toxic to aquatic life"]) === "ambiental"],
    ["pictogramas oficiais do PubChem são usados", gk(["H302: Harmful"], ["Corrosive", "Health Hazard"]).includes("corrosivo") && gk(["H302: Harmful"], ["Corrosive", "Health Hazard"]).includes("saude")],
    ["ordem: fatal antes de inflamável", w.ghsAnalyze({ hazards: ["H225 (80%): x [Danger]", "H302 (95%): y [Warning]", "H300 (40%): z [Danger]"] }).items.map(i => i.code).join(",") === "300,225,302"],
    ["palavra de advertência PERIGO", w.ghsAnalyze({ hazards: ["H314: x [Danger]"], signal: "Danger" }).signal === "PERIGO"],
    ["palavra de advertência ATENÇÃO", w.ghsAnalyze({ hazards: ["H302: y [Warning]"], signal: "Warning" }).signal === "ATENÇÃO"],
    ["sem frases: avisa que NÃO é seguro", /NÃO significa|não significa/.test(w.ghsPanelHTML({ hazards: [] })) && /sem classificação/i.test(w.ghsPanelHTML({ hazards: [] }))],
    ["falha de rede (null): avisa que não é seguro", /indispon/i.test(w.ghsPanelHTML(null)) && /não significa/i.test(w.ghsPanelHTML(null))],
    ["mais de 6 frases: nenhuma é escondida", (() => { const h = ["H300: a", "H301: b", "H302: c", "H310: d", "H311: e", "H312: f", "H314: g", "H318: h"], html = w.ghsPanelHTML({ hazards: h }); return h.every(x => html.includes("H" + x.slice(1, 4))) && /\+ 2 frase/.test(html); })()],
    ["texto da frase é escapado (sem HTML injetado)", !/<script/i.test(w.ghsPanelHTML({ hazards: ["H302: <script>alert(1)</script>"] }))],
  ];
  ghsChecks.forEach(([n, good]) => report(!!good, "GHS: " + n));
  // Regressão (v11.4): variáveis derivadas do tema precisam ser recalculadas no <body>, onde os temas definem --text-color
  const css = (d.getElementById("critical-css") || {}).textContent || "";
  report(/\bbody\s*\{\s*--glow:[^}]*var\(--text-color\)[^}]*--tint:/.test(css), "Tema: --glow e --tint são recalculados no body (não ficam presos ao verde)");
  // Gráficos e canvases nítidos em telas de alta densidade (v11.5)
  const cv = d.createElement("canvas"); cv.setAttribute("height", "280"); Object.defineProperty(cv, "clientWidth", { value: 346, configurable: true });
  w.devicePixelRatio = 3; const stt = {}; w.hidpiFit(cv, stt); w.hidpiFit(cv, stt);
  report(cv.width === 1038 && cv.height === 840 && stt.lw === 346 && stt.lh === 280 && cv.style.height === "280px" && cv.style.width === "100%", "HiDPI: buffer = 3× o tamanho lógico (e idempotente ao refazer)", `${cv.width}x${cv.height} lw=${stt.lw} lh=${stt.lh}`);
  w.devicePixelRatio = 1; const st1 = {}, cv1 = d.createElement("canvas"); cv1.setAttribute("height", "300"); Object.defineProperty(cv1, "clientWidth", { value: 500, configurable: true }); w.hidpiFit(cv1, st1);
  report(cv1.width === 500 && cv1.height === 300, "HiDPI: em tela 1× o tamanho não muda");
  // Tabela periódica com rótulos e posições oficiais (7)
  w.renderTool(7); await sleep(800);
  const grid = [...d.querySelectorAll("#screen-content .grid")].find(g => g.dataset.ptLayout);
  const at = z => { const c = grid && [...grid.children].find(c => !c.classList.contains("pt-label") && !c.classList.contains("pt-marker") && parseInt(c.textContent) === z); return c ? c.style.gridRow + "," + c.style.gridColumn : "?"; };
  report(!!grid && at(1) === "3,2" && at(2) === "3,19" && at(26) === "6,9" && at(79) === "8,12" && at(57) === "11,4" && at(71) === "11,18" && at(118) === "9,19", "Tabela periódica: posições oficiais (H, He, Fe, Au, La, Lu, Og)", [1, 2, 26, 79, 57, 71, 118].map(at).join(" "));
  report(grid && grid.querySelectorAll(".pt-label").length === 30 && grid.querySelectorAll(".pt-group").length === 18 && grid.querySelectorAll(".pt-block").length === 3, "Tabela periódica: 18 grupos, 7+2 períodos e 3 blocos (s, d, p) rotulados");
  w.renderHome();
  // Espaço de tela no celular: regra que esconde a barra de comando e o rodapé de temas só em toque + tela estreita
  const css2 = (d.getElementById("critical-css") || {}).textContent || "";
  report(/@media \(max-width: 640px\) and \(pointer: coarse\)\s*\{[^}]*footer\[role=contentinfo\][^}]*display: none/.test(css2) && /scroll-padding-bottom/.test(css2), "Layout: no celular o rodapé de temas e a barra de comando saem da frente; foco não fica coberto");
  // Estrutura visual da tela inicial e das telas de módulo (v11.4)
  w.renderHome(); await sleep(500);
  const cards = [...d.querySelectorAll(".menu-item")], counts = [...d.querySelectorAll(".menu-count")].reduce((t, e) => t + (+e.textContent || 0), 0);
  report(!!d.querySelector(".hero-ribbon") && d.querySelectorAll(".hero-actions .dos-btn").length === 3, "Visual: herói com faixa de números e 3 atalhos");
  report(cards.length >= 34 && counts === cards.length, `Visual: contagem por seção soma os ${cards.length} cartões (soma ${counts})`);
  report(cards.every(b => b.querySelector(".menu-num") && b.querySelector(".menu-title")), "Visual: todo cartão tem selo numérico e título");
  report(!cards.some(b => /—\s*NOVO/.test(b.textContent)), "Visual: a marca '— NOVO' virou etiqueta (sem texto solto)");
  w.renderTool(33); await sleep(700);
  report(/FÍSICO-QUÍMICA E ANÁLISE/.test((d.querySelector(".crumb") || {}).textContent || "") && /MÓDULO 33/.test((d.querySelector(".crumb") || {}).textContent || ""), "Visual: caminho de navegação no módulo 33");
  w.renderHome();
  // Banco de perguntas do módulo 24: 10 por tópico, 4 alternativas distintas, índice válido, sem repetição
  const badQ = w.eval(`GC_TOPICS.flatMap(t => { const a = [...GC_QUIZZES[t.key], ...GC_EXTRA[t.key].q], seen = new Set(); const e = a.length !== 10 ? [t.key + " tem " + a.length] : []; a.forEach((q, i) => { if (q.options.length !== 4 || new Set(q.options).size !== 4 || q.correct < 0 || q.correct > 3 || !q.explain || seen.has(q.q)) e.push(t.key + "#" + i); seen.add(q.q); }); return e; })`);
  report(!badQ.length, "Módulo 24: 160 perguntas íntegras (10 por tópico, 16 tópicos)", JSON.stringify(badQ));
  // Busca sem acento e tolerante a plural
  const M = [["Ligações Químicas", "ligacao", true], ["Ligação covalente", "ligacoes", true], ["Ácido forte", "acidos", true], ["Titulação", "titulacoes", true], ["Mol", "reacao", false], ["Termoquímica", "TERMOQUIMICA", true]];
  const badM = M.filter(([h, q, e]) => w.chemMatch(h, q) !== e);
  report(!badM.length, "Busca sem acento e com plural", JSON.stringify(badM));
  console.log(`\n${ok} passaram, ${fail} falharam`); process.exit(fail ? 1 : 0);
})();
