/* v8.5 — Módulo 30: Número de oxidação (NOX) por regras. */
(function () {
  const G1 = ["Li", "Na", "K", "Rb", "Cs"], G2 = ["Be", "Mg", "Ca", "Sr", "Ba"], HAL = ["Cl", "Br", "I"];
  const PEROX = new Set(["H2O2", "Na2O2", "K2O2", "Li2O2", "BaO2", "CaO2", "SrO2", "MgO2"]);
  const $ = id => document.getElementById(id);

  function parseCharge(s) {
    s = (s || "").replace(/\s/g, ""); if (!s) return 0;
    const m = s.match(/^([+-])?(\d*)([+-])?$/); if (!m) throw new Error("Carga inválida. Exemplos: 2-, -2, +1, 0.");
    const sign = m[1] || m[3] || "+", n = m[2] === "" ? ((m[1] || m[3]) ? 1 : 0) : +m[2];
    return sign === "-" ? -n : n;
  }
  function rule(el, names, key) {
    const has = k => names.includes(k), metal12 = names.some(e => G1.includes(e) || G2.includes(e));
    if (el === "F") return -1;
    if (G1.includes(el)) return 1; if (G2.includes(el)) return 2; if (el === "Al") return 3;
    if (el === "H") return metal12 ? -1 : 1;
    if (el === "O") return PEROX.has(key) ? -1 : has("F") ? null : -2;
    if (HAL.includes(el) && !has("O") && !has("F") && names.filter(e => HAL.includes(e)).length === 1) return -1;
    if (el === "S" && !has("O") && (metal12 || has("H"))) return -2;
    return null;
  }
  function analyze(formula, chargeText, target) {
    const key = formula.replace(/\s/g, ""), f = parseFormula(key);
    const counts = f && f.counts ? f.counts : {}, names = Object.keys(counts), charge = parseCharge(chargeText);
    if (!names.length) throw new Error("Fórmula inválida. Exemplos: KMnO4, H2SO4, Cr2O7, NH3.");
    if (names.length === 1) return { rows: [{ el: names[0], n: counts[names[0]], ox: charge / counts[names[0]] }], target: names[0], value: charge / counts[names[0]], balanced: true };
    target = (target || "").trim(); if (target && !counts[target]) throw new Error(`O elemento ${target} não está na fórmula.`);
    const rows = names.map(el => ({ el, n: counts[el], ox: el === target ? null : rule(el, names, key) }));
    const unk = rows.filter(r => r.ox === null);
    if (unk.length > 1) throw new Error(`Não dá para resolver só com as regras: ${unk.map(r => r.el).join(", ")} não têm NOX fixo. Escolha um alvo e use outra fórmula/carga.`);
    if (unk.length === 1) {
      const rest = rows.reduce((a, r) => a + (r.ox === null ? 0 : r.ox * r.n), 0);
      unk[0].ox = (charge - rest) / unk[0].n;
      return { rows, target: unk[0].el, value: unk[0].ox, balanced: true };
    }
    return { rows, target: null, value: null, balanced: rows.reduce((a, r) => a + r.ox * r.n, 0) === charge };
  }
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  function show(x) {
    const sg = x < 0 ? "−" : x > 0 ? "+" : "", a = Math.abs(x);
    if (Math.abs(a - Math.round(a)) < 1e-9) return sg + Math.round(a);
    for (let d = 2; d <= 12; d++) if (Math.abs(a * d - Math.round(a * d)) < 1e-9) { const n = Math.round(a * d), g = gcd(n, d); return `${sg}${n / g}/${d / g} (≈ ${sg}${a.toFixed(2)})`; }
    return sg + a.toFixed(3);
  }
  window.ChemOx = { analyze, parseCharge };

  window.runOxid = function () {
    const box = $("oxid-result");
    try {
      const r = analyze($("ox-formula").value, $("ox-charge").value, $("ox-target").value);
      const lines = r.rows.map(x => `${x.el.padEnd(3)} ×${String(x.n).padEnd(2)} NOX = ${show(x.ox)}${x.el === r.target ? "   ← calculado" : ""}`).join("\n");
      box.innerHTML = `<pre class="whitespace-pre-wrap mb-2">${lines}</pre>` + (r.target
        ? `<div class="text-lg font-bold">NOX do ${r.target}: ${show(r.value)}</div>${Number.isInteger(r.value) ? "" : '<div class="opacity-80">Valor fracionário = estado de oxidação médio (ex.: Fe₃O₄ mistura Fe²⁺ e Fe³⁺).</div>'}`
        : `<div>${r.balanced ? '<span class="test-pass">✓ A soma dos NOX bate com a carga.</span>' : '<span class="test-fail">✗ A soma não bate com a carga: o composto pode ter ligações especiais.</span>'}</div>`);
    } catch (e) { box.innerHTML = `<span class="test-fail">${e.message}</span>`; }
  };
  function render() {
    $("screen-content").innerHTML = `
      <div class="text-xl font-bold border-b border-current pb-1 mb-3">30. NÚMERO DE OXIDAÇÃO (NOX) — REGRAS E CÁLCULO</div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 text-sm">
        <label>Fórmula<input id="ox-formula" type="text" value="KMnO4" class="dos-input w-full p-1" spellcheck="false"></label>
        <label>Carga do íon (0 se neutro)<input id="ox-charge" type="text" value="0" class="dos-input w-full p-1" placeholder="ex.: 2-, +1"></label>
        <label>Elemento alvo (opcional)<input id="ox-target" type="text" value="" class="dos-input w-full p-1" placeholder="automático"></label>
      </div>
      <button class="dos-btn mb-3" onclick="runOxid()">CALCULAR NOX</button>
      <div id="oxid-result" class="dos-border p-3 text-sm" aria-live="polite">Clique em CALCULAR NOX. Exemplos: KMnO4 · H2SO4 · Cr2O7 com carga 2- · NH3 · Fe3O4 · H2O2.</div>
      <div class="text-xs opacity-70 mt-2">Regras: F = −1; grupo 1 = +1; grupo 2 = +2; Al = +3; H = +1 (−1 em hidretos); O = −2 (−1 em peróxidos); a soma dos NOX é igual à carga.</div>`;
  }
  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    if (parseInt(id) !== 30) return orig(id);
    if (typeof playBeep === "function") playBeep(700, 0.04);
    render(); if (typeof screenAnimateIn === "function") screenAnimateIn();
  };
})();
