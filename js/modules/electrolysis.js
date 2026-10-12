/* v11.2 — Módulo 33: Eletrólise e Leis de Faraday.
   m = M·I·t·η / (z·F), F = 96 485,33 C/mol. Deixe UM dos campos (corrente, tempo ou massa) em branco para resolvê-lo.
   Gases: volume por gás ideal à T e P informadas. Massas atômicas vêm de ATOMIC_WEIGHTS (mesma tabela do restante do site). */
(function () {
  "use strict";
  const $ = id => document.getElementById(id), F = 96485.33212, RG = 0.082057366;
  const W = s => (typeof ATOMIC_WEIGHTS !== "undefined" && ATOMIC_WEIGHTS[s]) || ({ H: 1.008, O: 15.999, Cl: 35.45 })[s];
  // id, rótulo, z (elétrons por unidade de produto), massa molar, tipo, semirreação
  const S = [
    ["cu", "Cobre (Cu²⁺ → Cu)", 2, () => W("Cu"), "s", "Cu²⁺ + 2 e⁻ → Cu   (cátodo)"], ["ag", "Prata (Ag⁺ → Ag)", 1, () => W("Ag"), "s", "Ag⁺ + e⁻ → Ag   (cátodo)"],
    ["zn", "Zinco (Zn²⁺ → Zn)", 2, () => W("Zn"), "s", "Zn²⁺ + 2 e⁻ → Zn   (cátodo)"], ["ni", "Níquel (Ni²⁺ → Ni)", 2, () => W("Ni"), "s", "Ni²⁺ + 2 e⁻ → Ni   (cátodo)"],
    ["cr", "Cromo (Cr³⁺ → Cr)", 3, () => W("Cr"), "s", "Cr³⁺ + 3 e⁻ → Cr   (cátodo)"], ["sn", "Estanho (Sn²⁺ → Sn)", 2, () => W("Sn"), "s", "Sn²⁺ + 2 e⁻ → Sn   (cátodo)"],
    ["pb", "Chumbo (Pb²⁺ → Pb)", 2, () => W("Pb"), "s", "Pb²⁺ + 2 e⁻ → Pb   (cátodo)"], ["au", "Ouro (Au³⁺ → Au)", 3, () => W("Au"), "s", "Au³⁺ + 3 e⁻ → Au   (cátodo)"],
    ["al", "Alumínio (Al³⁺ → Al, Al₂O₃ fundido)", 3, () => W("Al"), "s", "Al³⁺ + 3 e⁻ → Al   (cátodo)"], ["na", "Sódio (Na⁺ → Na, NaCl fundido)", 1, () => W("Na"), "s", "Na⁺ + e⁻ → Na   (cátodo)"],
    ["h2", "Hidrogênio gasoso (H₂)", 2, () => 2 * W("H"), "g", "2 H⁺ + 2 e⁻ → H₂   (cátodo)"], ["o2", "Oxigênio gasoso (O₂)", 4, () => 2 * W("O"), "g", "2 H₂O → O₂ + 4 H⁺ + 4 e⁻   (ânodo)"],
    ["cl2", "Cloro gasoso (Cl₂)", 2, () => 2 * W("Cl"), "g", "2 Cl⁻ → Cl₂ + 2 e⁻   (ânodo)"]
  ].map(a => ({ id: a[0], label: a[1], z: a[2], M: a[3], kind: a[4], rx: a[5] }));
  const byId = Object.fromEntries(S.map(s => [s.id, s])), UN = { s: 1, min: 60, h: 3600 };
  const num = id => { const v = String($(id).value).trim().replace(",", "."); return v === "" ? null : parseFloat(v); };
  /* Sem separador de milhar: o pós-processador de resultados (ux-v9) trataria "3.600" como decimal e o exibiria como "3,600". */
  const fmt = (x, d = 2) => x.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: false });
  const sig = (x, n = 4) => Number(x.toPrecision(n)).toLocaleString("pt-BR", { maximumSignificantDigits: n, useGrouping: false });
  const hms = s => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = Math.round(s % 60); return `${h ? h + " h " : ""}${m || h ? m + " min " : ""}${r} s`; };

  window.runElectrolysis = function () {
    const box = $("ele-result"); if (!box) return;
    try {
      const sp = byId[$("ele-sub").value], I = num("ele-i"), tIn = num("ele-t"), m = num("ele-m"), eta = (num("ele-eff") ?? 100) / 100, T = num("ele-temp") ?? 298.15, P = num("ele-p") ?? 1, u = UN[$("ele-tu").value] || 1;
      const blanks = [I, tIn, m].filter(x => x === null).length;
      if (blanks !== 1) throw new Error("Deixe exatamente UM campo em branco (corrente, tempo ou massa): é ele que será calculado.");
      if ([I, tIn, m].some(x => x !== null && !(x > 0))) throw new Error("Corrente, tempo e massa devem ser maiores que zero.");
      if (!(eta > 0 && eta <= 1)) throw new Error("O rendimento deve estar entre 0 e 100 %."); if (!(T > 0) || !(P > 0)) throw new Error("T e P devem ser maiores que zero.");
      const M = sp.M(), k = M * eta / (sp.z * F);                   // g por coulomb
      let i = I, t = tIn === null ? null : tIn * u, mass = m;
      if (mass === null) mass = k * i * t; else if (t === null) t = mass / (k * i); else i = mass / (k * t);
      const Q = i * t, ne = Q / F, mol = ne / sp.z * eta, V = sp.kind === "g" ? mol * RG * T / P : null;
      const what = m === null ? `Massa obtida: <strong>${sig(mass)} g</strong>` : tIn === null ? `Tempo necessário: <strong>${hms(t)}</strong> (${sig(t)} s = ${sig(t / 60)} min = ${sig(t / 3600)} h)` : `Corrente necessária: <strong>${sig(i)} A</strong>`;
      box.innerHTML = `<div class="text-lg mb-1">${what}</div>
        <div class="text-sm mb-2"><span class="font-bold">Semirreação:</span> ${sp.rx}</div>
        <div class="text-sm space-y-1"><div>Carga: Q = I·t = ${sig(i)} A × ${sig(t)} s = <strong>${sig(Q)} C</strong></div>
        <div>Elétrons: n(e⁻) = Q/F = ${sig(Q)} ÷ 96 485 = <strong>${sig(ne)} mol</strong></div>
        <div>${sp.kind === "g" ? "Gás" : "Metal"} formado: n = n(e⁻) ÷ ${sp.z}${eta < 1 ? " × " + fmt(eta * 100, 0) + " %" : ""} = <strong>${sig(mol)} mol</strong> (M = ${fmt(M, 3)} g/mol)</div>
        ${V !== null ? `<div>Volume do gás (ideal, ${fmt(T, 2)} K e ${fmt(P, 2)} atm): <strong>${sig(V)} L</strong></div>` : ""}</div>
        <div class="text-xs opacity-70 mt-2">1ª lei de Faraday: m ∝ Q. 2ª lei: para a mesma carga, m ∝ M/z. Rendimento 100 % = só o processo desejado ocorre; na prática reações paralelas reduzem a massa depositada.</div>`;
    } catch (e) { box.innerHTML = `<span class="test-fail">${e.message}</span>`; }
  };
  window.setEle = (sub, i, t, tu, m) => { $("ele-sub").value = sub; $("ele-i").value = i; $("ele-t").value = t; $("ele-tu").value = tu; $("ele-m").value = m; runElectrolysis(); };

  function render() {
    const ex = [["cu", "2", "1", "h", "", "Cobreação 2 A · 1 h"], ["ag", "1.5", "30", "min", "", "Prateação 1,5 A · 30 min"], ["al", "50", "", "min", "10", "Alumínio: 10 g com 50 A"], ["zn", "", "30", "min", "1", "Zinco: 1 g em 30 min"], ["h2", "1", "1", "h", "", "Água: H₂ com 1 A · 1 h"], ["cl2", "5", "2", "h", "", "Cloro 5 A · 2 h"]];
    $("screen-content").innerHTML = `
      <div class="text-xl font-bold border-b border-current pb-1 mb-3">33. ELETRÓLISE E LEIS DE FARADAY</div>
      <div class="text-xs opacity-80 mb-2">Deixe <strong>um</strong> campo em branco (corrente, tempo ou massa): é o que será calculado.</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 text-sm">
        <label class="md:col-span-2">Substância formada<select id="ele-sub" class="dos-input w-full p-1">${S.map(s => `<option value="${s.id}">${s.label}</option>`).join("")}</select></label>
        <label>Corrente (A)<input id="ele-i" type="text" inputmode="decimal" value="2" class="dos-input w-full p-1"></label>
        <label>Tempo<span class="flex gap-1"><input id="ele-t" type="text" inputmode="decimal" value="1" class="dos-input w-full p-1"><select id="ele-tu" class="dos-input p-1" aria-label="Unidade do tempo"><option value="s">s</option><option value="min">min</option><option value="h" selected>h</option></select></span></label>
        <label>Massa (g)<input id="ele-m" type="text" inputmode="decimal" value="" placeholder="(em branco = calcular)" class="dos-input w-full p-1"></label>
        <label>Rendimento da corrente (%)<input id="ele-eff" type="text" inputmode="decimal" value="100" class="dos-input w-full p-1"></label>
        <label>Temperatura do gás (K)<input id="ele-temp" type="text" inputmode="decimal" value="298.15" class="dos-input w-full p-1"></label>
        <label>Pressão do gás (atm)<input id="ele-p" type="text" inputmode="decimal" value="1" class="dos-input w-full p-1"></label>
      </div>
      <div class="flex flex-wrap gap-1 mb-3 text-xs">${ex.map(e => `<button class="dos-btn" onclick="setEle('${e[0]}','${e[1]}','${e[2]}','${e[3]}','${e[4]}')">${e[5]}</button>`).join("")}</div>
      <button class="dos-btn mb-3" onclick="runElectrolysis()">CALCULAR</button>
      <div id="ele-result" class="dos-border p-3 text-sm" aria-live="polite">Escolha a substância, preencha dois campos e clique em CALCULAR.</div>
      <details class="mt-3 text-sm"><summary class="font-bold">Como funciona</summary><ul class="list-disc pl-5 text-xs mt-2 space-y-1">
        <li>Q = I·t (carga em coulombs). 1 mol de elétrons carrega F ≈ 96 485 C.</li><li>Mols do produto = n(e⁻) ÷ z, em que z é o número de elétrons por unidade formada (Cu²⁺: 2; Al³⁺: 3; H₂: 2; O₂: 4).</li>
        <li>m = M·I·t / (z·F). Na eletrólise o cátodo é o polo (−) e recebe a redução; o ânodo é (+) e recebe a oxidação.</li><li>Em solução aquosa a água também pode reagir: por isso metais muito ativos (Na, Al) são obtidos de sais <em>fundidos</em>.</li></ul></details>`;
  }
  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    if (parseInt(id) !== 33) return orig(id);
    if (typeof playBeep === "function") playBeep(700, 0.04);
    render(); if (typeof screenAnimateIn === "function") screenAnimateIn();
  };
})();
