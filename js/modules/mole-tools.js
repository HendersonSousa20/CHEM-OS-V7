/* v8.4 — Módulo 29: Mol, massa, partículas e composição percentual. + exemplos no Balanceador (Módulo 1). */
(function () {
  const NA = 6.02214076e23, $ = id => document.getElementById(id);
  const sci = x => x === 0 ? "0" : (Math.abs(x) >= 1e5 || Math.abs(x) < 1e-3) ? x.toExponential(4) : String(+x.toPrecision(5));

  function compute(formula, mass, mols) {
    const f = parseFormula(formula);
    if (!f || !(f.totalMass > 0) || !Object.keys(f.counts).length) throw new Error("Fórmula inválida. Exemplos: H2O, Ca3(PO4)2, CuSO4.5H2O");
    const M = f.totalMass;
    if (mass > 0) mols = mass / M; else if (mols > 0) mass = mols * M; else throw new Error("Informe a massa (g) ou a quantidade (mol).");
    const rows = Object.entries(f.counts).map(([el, n]) => ({ el, n, pct: 100 * n * (ATOMIC_WEIGHTS[el] || 0) / M, atoms: mols * n * NA }));
    return { M, mass, mols, units: mols * NA, rows };
  }

  function render() {
    $("screen-content").innerHTML = `
      <div class="text-xl font-bold border-b border-current pb-1 mb-3">29. MOL, MASSA, PARTÍCULAS E COMPOSIÇÃO PERCENTUAL</div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 text-sm">
        <label>Fórmula<input id="mol-formula" type="text" value="Ca3(PO4)2" class="dos-input w-full p-1" spellcheck="false"></label>
        <label>Massa (g)<input id="mol-mass" type="text" inputmode="decimal" value="10" class="dos-input w-full p-1"></label>
        <label>ou Quantidade (mol)<input id="mol-n" type="text" inputmode="decimal" value="" class="dos-input w-full p-1" placeholder="se a massa estiver vazia"></label>
      </div>
      <button class="dos-btn mb-3" onclick="runMole()">CALCULAR</button>
      <div id="mole-result" class="dos-border p-3 text-sm" aria-live="polite">Clique em CALCULAR. Exemplo: 10 g de Ca₃(PO₄)₂.</div>`;
  }
  window.runMole = function () {
    const box = $("mole-result"), num = id => parseFloat($(id).value.replace(",", "."));
    try {
      const r = compute($("mol-formula").value, num("mol-mass"), num("mol-n"));
      const bars = r.rows.map(x => `${x.el.padEnd(3)} ${x.pct.toFixed(2).padStart(6)} %  ${"█".repeat(Math.round(x.pct / 4))}  (${sci(x.atoms)} átomos)`).join("\n");
      box.innerHTML = `<div>Massa molar: <strong>${r.M.toFixed(3)} g/mol</strong></div>
        <div>Massa: <strong>${sci(r.mass)} g</strong> &nbsp; Quantidade: <strong>${sci(r.mols)} mol</strong></div>
        <div class="mb-2">Unidades-fórmula: <strong>${sci(r.units)}</strong></div>
        <pre class="whitespace-pre-wrap">${bars}</pre>`;
    } catch (e) { box.innerHTML = `<span class="test-fail">${e.message}</span>`; }
  };
  window.ChemMole = { compute };

  const EXAMPLES = ["H2 + O2 -> H2O", "C3H8 + O2 -> CO2 + H2O", "Fe + O2 -> Fe2O3", "Al + HCl -> AlCl3 + H2", "C6H12O6 + O2 -> CO2 + H2O",
    "Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O", "KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O", "Cu + HNO3 -> Cu(NO3)2 + NO + H2O"];
  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    const n = parseInt(id);
    if (n === 29) { if (typeof playBeep === "function") playBeep(700, 0.04); render(); if (typeof screenAnimateIn === "function") screenAnimateIn(); return; }
    orig(id);
    if (n === 1 && $("eq-input")) {
      $("eq-input").parentElement.insertAdjacentHTML("beforebegin", `<label class="block text-sm mb-2">Exemplos prontos
        <select id="eq-examples" class="dos-input w-full p-1"><option value="">— escolha uma reação —</option>${EXAMPLES.map(e => `<option>${e}</option>`).join("")}</select></label>`);
      $("eq-examples").onchange = ev => { if (!ev.target.value) return; $("eq-input").value = ev.target.value; $("eq-input").dispatchEvent(new Event("input", { bubbles: true })); runBalancer(); };
    }
  };
})();
