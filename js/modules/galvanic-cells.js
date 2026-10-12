/* v11 — Módulo 32: Pilhas e potenciais-padrão (série eletroquímica).
   E° de redução a 25 °C (36 semirreações, inclusive meio básico e a bateria de chumbo), 1 mol/L, 1 atm, valores arredondados em 2 casas (CRC/LibreTexts). Livros diferentes divergem em ±0,02–0,05 V
   em alguns pares (ex.: Fe²⁺/Fe −0,44 ou −0,41; Ca²⁺/Ca −2,87 ou −2,76): o módulo avisa isso. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id), F = 96485.33212, R = 8.314462618;
  // id, L (oxidante, sem e⁻), R (redutor), n, E°, ox/rd (notação de pilha), inert = precisa de eletrodo inerte (Pt)
  const H = [
    ["li", "Li⁺", "Li", 1, -3.04, "Li⁺(aq)", "Li(s)"], ["k", "K⁺", "K", 1, -2.93, "K⁺(aq)", "K(s)"], ["ca", "Ca²⁺", "Ca", 2, -2.87, "Ca²⁺(aq)", "Ca(s)"],
    ["na", "Na⁺", "Na", 1, -2.71, "Na⁺(aq)", "Na(s)"], ["mg", "Mg²⁺", "Mg", 2, -2.37, "Mg²⁺(aq)", "Mg(s)"], ["al", "Al³⁺", "Al", 3, -1.66, "Al³⁺(aq)", "Al(s)"],
    ["h2o", "2 H₂O", "H₂ + 2 OH⁻", 2, -0.83, "H₂O(l)", "H₂(g), OH⁻(aq)", 1], ["zn", "Zn²⁺", "Zn", 2, -0.76, "Zn²⁺(aq)", "Zn(s)"], ["cr", "Cr³⁺", "Cr", 3, -0.74, "Cr³⁺(aq)", "Cr(s)"], ["fe", "Fe²⁺", "Fe", 2, -0.44, "Fe²⁺(aq)", "Fe(s)"],
    ["cd", "Cd²⁺", "Cd", 2, -0.40, "Cd²⁺(aq)", "Cd(s)"], ["pbso4", "PbSO₄", "Pb + SO₄²⁻", 2, -0.36, "PbSO₄(s), SO₄²⁻(aq)", "Pb(s)"], ["ni", "Ni²⁺", "Ni", 2, -0.26, "Ni²⁺(aq)", "Ni(s)"], ["sn", "Sn²⁺", "Sn", 2, -0.14, "Sn²⁺(aq)", "Sn(s)"],
    ["pb", "Pb²⁺", "Pb", 2, -0.13, "Pb²⁺(aq)", "Pb(s)"], ["h2", "2 H⁺", "H₂", 2, 0.00, "H⁺(aq)", "H₂(g)", 1], ["sn4", "Sn⁴⁺", "Sn²⁺", 2, 0.15, "Sn⁴⁺(aq)", "Sn²⁺(aq)", 1],
    ["cu1", "Cu²⁺", "Cu⁺", 1, 0.15, "Cu²⁺(aq)", "Cu⁺(aq)", 1], ["agcl", "AgCl", "Ag + Cl⁻", 1, 0.22, "AgCl(s)", "Ag(s), Cl⁻(aq)"], ["cu", "Cu²⁺", "Cu", 2, 0.34, "Cu²⁺(aq)", "Cu(s)"], ["o2b", "O₂ + 2 H₂O", "4 OH⁻", 4, 0.40, "O₂(g), H₂O(l)", "OH⁻(aq)", 1], ["i2", "I₂", "2 I⁻", 2, 0.54, "I₂(s)", "I⁻(aq)", 1],
    ["fe3", "Fe³⁺", "Fe²⁺", 1, 0.77, "Fe³⁺(aq)", "Fe²⁺(aq)", 1], ["ag", "Ag⁺", "Ag", 1, 0.80, "Ag⁺(aq)", "Ag(s)"], ["hg", "Hg²⁺", "Hg", 2, 0.85, "Hg²⁺(aq)", "Hg(l)"],
    ["no3", "NO₃⁻ + 4 H⁺", "NO + 2 H₂O", 3, 0.96, "NO₃⁻(aq), H⁺(aq)", "NO(g)", 1], ["br2", "Br₂", "2 Br⁻", 2, 1.07, "Br₂(l)", "Br⁻(aq)", 1], ["o2", "O₂ + 4 H⁺", "2 H₂O", 4, 1.23, "O₂(g), H⁺(aq)", "H₂O(l)", 1], ["cr2o7", "Cr₂O₇²⁻ + 14 H⁺", "2 Cr³⁺ + 7 H₂O", 6, 1.33, "Cr₂O₇²⁻(aq), H⁺(aq)", "Cr³⁺(aq)", 1],
    ["cl2", "Cl₂", "2 Cl⁻", 2, 1.36, "Cl₂(g)", "Cl⁻(aq)", 1], ["au", "Au³⁺", "Au", 3, 1.50, "Au³⁺(aq)", "Au(s)"], ["mno4", "MnO₄⁻ + 8 H⁺", "Mn²⁺ + 4 H₂O", 5, 1.51, "MnO₄⁻(aq), H⁺(aq)", "Mn²⁺(aq)", 1],
    ["ce", "Ce⁴⁺", "Ce³⁺", 1, 1.61, "Ce⁴⁺(aq)", "Ce³⁺(aq)", 1], ["pbo2", "PbO₂ + 4 H⁺ + SO₄²⁻", "PbSO₄ + 2 H₂O", 2, 1.69, "PbO₂(s), H⁺(aq), SO₄²⁻(aq)", "PbSO₄(s)"], ["h2o2", "H₂O₂ + 2 H⁺", "2 H₂O", 2, 1.77, "H₂O₂(aq), H⁺(aq)", "H₂O(l)", 1], ["f2", "F₂", "2 F⁻", 2, 2.87, "F₂(g)", "F⁻(aq)", 1]
  ].map(a => ({ id: a[0], L: a[1], R: a[2], n: a[3], E: a[4], ox: a[5], rd: a[6], inert: !!a[7] }));
  const byId = Object.fromEntries(H.map(h => [h.id, h]));
  window.GALVANIC_E0 = Object.fromEntries(H.map(h => [h.id, h.E]));
  const gcd = (a, b) => b ? gcd(b, a % b) : a, lcm = (a, b) => a * b / gcd(a, b);
  /* Sem separador de milhar (ver ux-v9: "1.140" seria reescrito como decimal). */
  const fmt = (x, d = 2) => x.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: false });
  const sg = x => (x < 0 ? "−" : "") + fmt(Math.abs(x));
  const qs = q => (q >= 1e-3 && q < 1e4) ? q.toLocaleString("pt-BR", { maximumSignificantDigits: 3, useGrouping: false }) : q.toExponential(2).replace(".", ",").replace("e", " × 10^");
  const sup = n => String(n).replace(/-/g, "⁻").replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
  const red = h => `${h.L} + ${h.n} e⁻ → ${h.R}`, oxi = h => `${h.R} → ${h.L} + ${h.n} e⁻`, mult = (s, m) => m > 1 ? `${m} × (${s})` : s;
  const lab = h => `${h.L.replace(/ \+.*/, "")}/${h.R.replace(/ \+.*/, "")}  (${h.E >= 0 ? "+" : "−"}${fmt(Math.abs(h.E))} V)`;
  const opts = sel => H.map(h => `<option value="${h.id}"${h.id === sel ? " selected" : ""}>${lab(h)}</option>`).join("");
  function sciK(l10) { if (Math.abs(l10) > 300) return `≈ 10${sup(Math.round(l10))}`; const e = Math.floor(l10), m = Math.pow(10, l10 - e); return `${fmt(m, 2)} × 10${sup(e)}`; }

  window.runCell = function () {
    const box = $("cell-result"); if (!box) return;
    try {
      const c = byId[$("pil-cat").value], a = byId[$("pil-an").value], T = parseFloat(String($("pil-t").value).replace(",", ".")), Q = parseFloat(String($("pil-q").value).replace(",", "."));
      if (!c || !a) throw new Error("Escolha as duas semirreações.");
      if (c === a) throw new Error("Cátodo e ânodo são a mesma semirreação. Escolha pares diferentes.");
      if (!(T > 0)) throw new Error("A temperatura deve ser maior que 0 K."); if (!(Q > 0)) throw new Error("Q deve ser maior que 0.");
      const E0 = c.E - a.E, n = lcm(c.n, a.n), mc = n / c.n, ma = n / a.n, dG = -n * F * E0 / 1000, l10 = n * F * E0 / (R * T * Math.LN10), E = E0 - (R * T / (n * F)) * Math.log(Q);
      const an = a.inert ? `Pt(s) | ${a.rd} | ${a.ox}` : `${a.rd} | ${a.ox}`, ca = c.inert ? `${c.ox} | ${c.rd} | Pt(s)` : `${c.ox} | ${c.rd}`;
      const spont = E0 > 0 ? `<span class="font-bold">ESPONTÂNEA como escrita</span>: gera corrente (pilha galvânica).` : E0 < 0 ? `<span class="font-bold">NÃO espontânea</span> nessa direção: precisaria de energia externa (eletrólise). A pilha espontânea seria a inversa — use ⇄ INVERTER.` : `Em equilíbrio (E° = 0).`;
      box.innerHTML = `<div class="font-bold text-lg mb-1">E°<sub>pilha</sub> = ${E0 >= 0 ? "+" : "−"}${fmt(Math.abs(E0))} V</div>
        <div class="text-xs opacity-80 mb-2">E°cátodo − E°ânodo = (${sg(c.E)}) − (${sg(a.E)})</div><div class="mb-2">${spont}</div>
        <div class="text-sm mb-2"><div><span class="font-bold">Cátodo (+), redução:</span> ${mult(red(c), mc)}</div><div><span class="font-bold">Ânodo (−), oxidação:</span> ${mult(oxi(a), ma)}</div>
        <div class="opacity-80">Elétrons transferidos: n = ${n}. Fluem do ânodo para o cátodo; a ponte salina fecha o circuito.</div></div>
        <div class="text-sm mb-2"><span class="font-bold">Notação:</span> ${an} ∥ ${ca}</div>
        <div class="text-sm">ΔG° = −nFE° = <strong>${dG < 0 ? "−" : ""}${fmt(Math.abs(dG), 1)} kJ/mol</strong> · K = <strong>${sciK(l10)}</strong> (a ${fmt(T, 2)} K)${Math.abs(Q - 1) > 1e-12 ? `<br>Com Q = ${qs(Q)}: <strong>E = ${E >= 0 ? "" : "−"}${fmt(Math.abs(E), 3)} V</strong> (Nernst)` : ""}</div>
        <div class="text-xs opacity-70 mt-2">Os valores de E° são a 25 °C, 1 mol/L e 1 atm. Fora dessas condições, use Q (e T) para corrigir.</div>`;
    } catch (e) { box.innerHTML = `<span class="test-fail">${e.message}</span>`; }
  };
  window.setCell = (c, a) => { $("pil-cat").value = c; $("pil-an").value = a; runCell(); };
  window.swapCell = () => { const c = $("pil-cat").value; $("pil-cat").value = $("pil-an").value; $("pil-an").value = c; runCell(); };

  function render() {
    const rows = H.slice().reverse().map(h => `<tr><td>${red(h)}</td><td class="whitespace-nowrap">${h.E >= 0 ? "+" : "−"}${fmt(Math.abs(h.E))}</td></tr>`).join("");
    $("screen-content").innerHTML = `
      <div class="text-xl font-bold border-b border-current pb-1 mb-3">32. PILHAS E POTENCIAIS-PADRÃO (SÉRIE ELETROQUÍMICA)</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 text-sm">
        <label>Cátodo (+) — onde ocorre a REDUÇÃO<select id="pil-cat" class="dos-input w-full p-1">${opts("cu")}</select></label>
        <label>Ânodo (−) — onde ocorre a OXIDAÇÃO<select id="pil-an" class="dos-input w-full p-1">${opts("zn")}</select></label>
        <label>Q (quociente de reação; 1 = condições padrão)<input id="pil-q" type="text" inputmode="decimal" value="1" class="dos-input w-full p-1"></label>
        <label>Temperatura (K)<input id="pil-t" type="text" inputmode="decimal" value="298.15" class="dos-input w-full p-1"></label>
      </div>
      <div class="flex flex-wrap gap-1 mb-3 text-xs">${[["cu", "zn", "Daniell (Zn–Cu)"], ["ag", "zn", "Zn–Ag"], ["cu", "fe", "Fe–Cu"], ["cu", "al", "Al–Cu"], ["o2", "h2", "H₂–O₂ (célula a combustível)"], ["f2", "li", "Li–F₂ (máximo)"], ["pbo2", "pbso4", "Bateria de chumbo-ácido"], ["o2b", "h2o", "Célula alcalina H₂–O₂ (meio básico)"]].map(p => `<button class="dos-btn" onclick="setCell('${p[0]}','${p[1]}')">${p[2]}</button>`).join("")}</div>
      <div class="flex flex-wrap gap-2 mb-3"><button class="dos-btn" onclick="runCell()">CALCULAR PILHA</button><button class="dos-btn" onclick="swapCell()">⇄ INVERTER</button></div>
      <div id="cell-result" class="dos-border p-3 text-sm" aria-live="polite">Escolha cátodo e ânodo e clique em CALCULAR PILHA.</div>
      <details class="mt-3 text-sm"><summary class="font-bold">Série eletroquímica (E° de redução, V, 25 °C)</summary>
        <div class="text-xs opacity-80 my-2">Mais positivo = melhor oxidante (tende a ser o cátodo). Mais negativo = melhor redutor (tende a ser o ânodo).</div>
        <div class="overflow-x-auto"><table><thead><tr><th>Semirreação de redução</th><th>E° (V)</th></tr></thead><tbody>${rows}</tbody></table></div>
        <div class="text-xs opacity-70 mt-2">Atenção: livros e sites diferem em ±0,02 a 0,05 V em alguns pares (ex.: Fe²⁺/Fe aparece como −0,44 ou −0,41 V; Ca²⁺/Ca como −2,87 ou −2,76 V; MnO₄⁻/Mn²⁺ como +1,49 a +1,52 V). Aqui usamos valores modernos (CRC), com 2 casas decimais. Confira com o seu livro-texto.</div></details>
      <details class="mt-2 text-sm"><summary class="font-bold">Como ler uma pilha</summary>
        <ul class="list-disc pl-5 text-xs mt-2 space-y-1"><li>O par com <strong>maior E°</strong> reduz (cátodo); o outro oxida (ânodo).</li><li>E°<sub>pilha</sub> = E°<sub>cátodo</sub> − E°<sub>ânodo</sub>. Não se multiplica E° pelos coeficientes (é grandeza intensiva).</li><li>ΔG° = −nFE° e ln K = nFE°/RT: E° positivo ⇒ ΔG° negativo e K &gt; 1.</li><li>Notação: ânodo | solução ∥ solução | cátodo (∥ é a ponte salina).</li></ul></details>`;
  }
  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    if (parseInt(id) !== 32) return orig(id);
    if (typeof playBeep === "function") playBeep(700, 0.04);
    render(); if (typeof screenAnimateIn === "function") screenAnimateIn();
  };
})();
