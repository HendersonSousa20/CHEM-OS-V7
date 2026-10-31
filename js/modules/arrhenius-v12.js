/* v12 — Módulo 38: Arrhenius (k × T) e Van't Hoff (K × T). */
(function () {
  const $ = id => document.getElementById(id), R = 8.314462618;
  const num = id => parseFloat(String($(id).value).replace(",", "."));
  const f = x => isFinite(x) ? (Math.abs(x) >= 1e5 || (x !== 0 && Math.abs(x) < 1e-3) ? x.toExponential(3) : String(+x.toPrecision(4))).replace(".", ",") : "—";
  const fld = (id, l, v) => `<label class="text-sm">${l}<input id="${id}" type="text" inputmode="decimal" value="${v}" class="dos-input w-full p-1"></label>`;
  const calc = {
    Ea: (k1, T1, k2, T2) => R * Math.log(k2 / k1) / (1 / T1 - 1 / T2),            // J/mol
    k2: (k1, T1, T2, Ea) => k1 * Math.exp(Ea / R * (1 / T1 - 1 / T2)),             // Ea em J/mol
    K2: (K1, T1, T2, dH) => K1 * Math.exp(-dH / R * (1 / T2 - 1 / T1))             // dH em J/mol
  };
  function render() {
    $("screen-content").innerHTML = `<div class="text-xl font-bold border-b border-current pb-1 mb-3">38. ARRHENIUS E VAN'T HOFF (EFEITO DA TEMPERATURA)</div>
      <label class="text-sm block mb-2">O que calcular<select id="a-mode" class="dos-input w-full p-1"><option value="Ea">Energia de ativação Ea (a partir de k₁, T₁, k₂, T₂)</option><option value="k2">Constante de velocidade k₂ numa nova temperatura</option><option value="K2">Constante de equilíbrio K₂ numa nova temperatura (Van't Hoff)</option></select></label>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">${fld("a-1", "k₁ (ou K₁)", "0.0231")}${fld("a-T1", "T₁ (K)", "300")}${fld("a-2", "k₂ (só no modo Ea)", "0.0462")}${fld("a-T2", "T₂ (K)", "310")}${fld("a-E", "Ea ou ΔH° (kJ/mol)", "53.6")}</div>
      <button class="dos-btn mb-3" onclick="runArrh12()">CALCULAR</button>
      <div id="a-res" class="dos-border p-3 text-sm" aria-live="polite"></div>
      <p class="text-xs opacity-80 mt-2">Use temperaturas em kelvin (K = °C + 273,15). Supõe Ea e ΔH° constantes no intervalo. Ea sempre positiva; ΔH° positivo (endotérmica) aumenta K com T.</p>`;
    runArrh12();
  }
  window.runArrh12 = function () {
    const m = $("a-mode").value, a = num("a-1"), T1 = num("a-T1"), b = num("a-2"), T2 = num("a-T2"), E = num("a-E") * 1000, box = $("a-res");
    if (!(a > 0 && T1 > 0 && T2 > 0)) { box.textContent = "Informe valores positivos de k (ou K) e temperaturas em kelvin."; return; }
    if (m === "Ea") { if (!(b > 0) || T1 === T2) { box.textContent = "Informe k₂ > 0 e duas temperaturas diferentes."; return; }
      box.innerHTML = `Ea = R·ln(k₂/k₁) ÷ (1/T₁ − 1/T₂) = <strong>${f(calc.Ea(a, T1, b, T2) / 1000)} kJ/mol</strong><br>k₂/k₁ = ${f(b / a)}`; }
    else if (m === "k2") { if (!isFinite(E)) { box.textContent = "Informe Ea."; return; } const k = calc.k2(a, T1, T2, E); box.innerHTML = `k₂ = k₁·exp[(Ea/R)(1/T₁ − 1/T₂)] = <strong>${f(k)}</strong> &nbsp; (k₂/k₁ = ${f(k / a)})`; }
    else { if (!isFinite(E)) { box.textContent = "Informe ΔH°."; return; } const K = calc.K2(a, T1, T2, E); box.innerHTML = `K₂ = K₁·exp[−(ΔH°/R)(1/T₂ − 1/T₁)] = <strong>${f(K)}</strong> &nbsp; (${K > a ? "K aumentou" : K < a ? "K diminuiu" : "K igual"} com a temperatura)`; }
  };
  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    if (parseInt(id) === 38) { if (typeof playBeep === "function") playBeep(700, 0.04); render(); if (typeof screenAnimateIn === "function") screenAnimateIn(); return; }
    orig(id);
  };
  window.ChemArrh12 = calc;
})();
