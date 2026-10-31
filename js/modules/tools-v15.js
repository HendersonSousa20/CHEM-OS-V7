/* v15 — Módulos 52 Diluições e padrões · 53 Padronização (teste Q) · 54 Massa atômica média e padrão isotópico · 55 Lei de Hess · 56 Cristais e Bragg. */
(function () {
  const $ = id => document.getElementById(id), NUM = id => parseFloat(String($(id).value).replace(",", "."));
  const fmt = (x, d) => !isFinite(x) ? "—" : (x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 1e-3) ? x.toExponential(3) : String(+x.toPrecision(d || 4))).replace(".", ",");
  const fld = (id, l, v) => `<label class="text-sm">${l}<input id="${id}" type="text" inputmode="decimal" value="${v}" class="dos-input w-full p-1"></label>`;
  const lst = (id, l, v) => `<label class="text-sm">${l}<input id="${id}" class="dos-input w-full p-1" value="${v}"></label>`;
  const page = (t, b) => { $("screen-content").innerHTML = `<div class="text-xl font-bold border-b border-current pb-1 mb-3">${t}</div>${b}`; };
  const grid = (h, c) => `<div class="grid grid-cols-1 md:grid-cols-${c || 3} gap-2 mb-3">${h}</div>`;
  const out = id => `<div id="${id}" class="dos-border p-3 text-sm" aria-live="polite"></div>`;
  const sel = (id, o, on) => `<select id="${id}" ${on ? `onchange="${on}"` : ""} class="dos-input w-full p-1">${o.map(x => `<option value="${x[0]}">${x[1]}</option>`).join("")}</select>`;
  const nums = s => String(s).split(/[\s;]+/).map(x => parseFloat(x.replace(",", "."))).filter(isFinite);
  const T95 = [0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228];
  const tcrit = df => df <= 10 ? T95[df] : df <= 20 ? 2.1 : df <= 30 ? 2.04 : 1.98;

  /* ---------- 52: diluições e padrões ---------- */
  function r52() {
    page("52. DILUIÇÕES E PADRÕES DE CALIBRAÇÃO", `<p class="text-sm mb-2">Quanto pipetar de uma solução-estoque para cada padrão (C₁V₁ = C₂V₂), ou as concentrações de uma diluição seriada.</p>
      <div class="font-bold mb-1">Padrões a partir do estoque</div>
      ${grid(fld("d-c0", "Concentração do estoque", "1000") + fld("d-vf", "Volume final de cada padrão (mL)", "50") + lst("d-t", "Concentrações desejadas (mesma unidade; espaço ou ;)", "5 10 20 50 100"))}
      <button class="dos-btn mb-3" onclick="runStd15()">CALCULAR PADRÕES</button>${out("d-res")}
      <div class="font-bold mt-4 mb-1">Diluição seriada</div>
      ${grid(fld("s-c0", "Concentração inicial", "100") + fld("s-f", "Fator de diluição por etapa", "10") + fld("s-n", "Número de etapas", "5") + fld("s-v", "Volume final por tubo (mL)", "10"))}
      <button class="dos-btn mb-3" onclick="runSer15()">CALCULAR SÉRIE</button>${out("s-res")}
      <p class="text-xs opacity-80 mt-2">Volumes abaixo de 100 µL têm erro relativo alto: prefira uma diluição intermediária. Use balão volumétrico para os padrões.</p>`);
    runStd15(); runSer15();
  }
  window.runStd15 = function () {
    const C0 = NUM("d-c0"), Vf = NUM("d-vf"), T = nums($("d-t").value), box = $("d-res");
    if (!(C0 > 0 && Vf > 0 && T.length)) { box.textContent = "Informe estoque, volume final e ao menos uma concentração."; return; }
    box.innerHTML = T.map(c => {
      if (!(c > 0)) return `${fmt(c)}: valor inválido`;
      if (c > C0) return `${fmt(c)}: <span class="text-yellow-300">impossível (maior que o estoque)</span>`;
      const v = c * Vf / C0, warn = v < 0.1 ? ' <span class="text-yellow-300">(&lt; 100 µL: use diluição intermediária)</span>' : "";
      return `${fmt(c)} → pipetar <strong>${fmt(v)} mL</strong> do estoque e completar a ${fmt(Vf)} mL (${fmt(Vf - v)} mL de diluente)${warn}`;
    }).join("<br>");
  };
  window.runSer15 = function () {
    const C0 = NUM("s-c0"), F = NUM("s-f"), n = parseInt(NUM("s-n")), V = NUM("s-v"), box = $("s-res");
    if (!(C0 > 0 && F > 1 && n >= 1 && n <= 20 && V > 0)) { box.textContent = "Informe C₀ > 0, fator > 1, 1 a 20 etapas e volume > 0."; return; }
    const vt = V / F; let h = `Em cada etapa: transferir <strong>${fmt(vt)} mL</strong> e adicionar <strong>${fmt(V - vt)} mL</strong> de diluente (volume final ${fmt(V)} mL).<br>`;
    for (let i = 1; i <= n; i++) h += `<br>Tubo ${i}: ${fmt(C0 / Math.pow(F, i))} (diluição ${fmt(Math.pow(F, i))}×)`;
    box.innerHTML = h;
  };

  /* ---------- 53: padronização com teste Q ---------- */
  const STD = { khp: ["NaOH com biftalato de potássio (KHP, M = 204,22 g/mol, 1:1)", 204.22, 1], na2co3: ["HCl com Na₂CO₃ (M = 105,99 g/mol, 1 Na₂CO₃ : 2 HCl)", 105.99, 2], oxal: ["KMnO₄ com oxalato de sódio (M = 134,00 g/mol, 2 MnO₄⁻ : 5 C₂O₄²⁻)", 134.00, 0.4] };
  const QC = { 3: [0.941, 0.970], 4: [0.765, 0.829], 5: [0.642, 0.710], 6: [0.560, 0.625], 7: [0.507, 0.568], 8: [0.468, 0.526], 9: [0.437, 0.493], 10: [0.412, 0.466] };
  function r53() {
    page("53. PADRONIZAÇÃO DE SOLUÇÕES (COM TESTE Q)", `<p class="text-sm mb-2">Calcula a concentração a partir de padrão primário em réplicas, com média, desvio, IC 95 % e teste Q de Dixon para valor discrepante.</p>
      <label class="text-sm block mb-2">Padronização ${sel("z-s", Object.keys(STD).map(k => [k, STD[k][0]]))}</label>
      ${grid(lst("z-m", "Massas do padrão (g), uma por réplica", "0.5105 0.5230 0.5071") + lst("z-v", "Volumes gastos do titulante (mL)", "25.02 25.60 24.88"), 2)}
      <button class="dos-btn mb-3" onclick="runStdz15()">CALCULAR</button>${out("z-res")}
      <p class="text-xs opacity-80 mt-2">c = (m/M)·ν ÷ V, com ν = 1 (KHP), 2 (Na₂CO₃) ou 0,4 (oxalato). Seque o padrão primário antes de pesar. RSD acima de cerca de 0,5 % pede repetição.</p>`);
    runStdz15();
  }
  window.runStdz15 = function () {
    const s = STD[$("z-s").value], m = nums($("z-m").value), v = nums($("z-v").value), box = $("z-res");
    if (m.length < 2 || m.length !== v.length) { box.textContent = "Informe ao menos 2 réplicas, com o mesmo número de massas e volumes."; return; }
    if (m.some(x => !(x > 0)) || v.some(x => !(x > 0))) { box.textContent = "Massas e volumes devem ser positivos."; return; }
    const c = m.map((mi, i) => (mi / s[1]) * s[2] / (v[i] / 1000)), n = c.length, mean = c.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(c.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)), ci = tcrit(n - 1) * sd / Math.sqrt(n), rsd = 100 * sd / mean;
    let h = c.map((x, i) => `Réplica ${i + 1}: ${fmt(x, 5)} mol/L`).join("<br>") + `<br><br>Média = <strong>${fmt(mean, 5)} mol/L</strong> · s = ${fmt(sd)} · RSD = ${fmt(rsd)} % · IC 95 %: ± ${fmt(ci)}`;
    if (rsd > 0.5) h += '<br><span class="text-yellow-300">RSD acima de 0,5 %: repita a padronização ou procure erro de técnica.</span>';
    if (n >= 3 && n <= 10) {
      const o = c.slice().sort((a, b) => a - b), range = o[n - 1] - o[0];
      if (range > 0) {
        const qLow = (o[1] - o[0]) / range, qHigh = (o[n - 1] - o[n - 2]) / range, q = Math.max(qLow, qHigh), sus = qHigh >= qLow ? o[n - 1] : o[0], crit = QC[n];
        h += `<br>Teste Q (suspeito: ${fmt(sus, 5)}): Q = ${fmt(q, 3)} · crítico 90 % = ${fmt(crit[0], 3)}, 95 % = ${fmt(crit[1], 3)} — ${q > crit[1] ? "discrepante a 95 %" : q > crit[0] ? "discrepante a 90 %, não a 95 %" : "não é discrepante"}`;
      }
    }
    box.innerHTML = h;
  };

  /* ---------- 54: massa atômica média e padrão isotópico ---------- */
  function r54() {
    const row = i => `${fld("i-m" + i, "Massa do isótopo " + (i + 1) + " (u)", ["34.96885", "36.96590", "", ""][i])}${fld("i-a" + i, "Abundância (%)", ["75.76", "24.24", "", ""][i])}`;
    page("54. MASSA ATÔMICA MÉDIA E PADRÃO ISOTÓPICO", `<p class="text-sm mb-2">Média ponderada das massas isotópicas (exemplo: cloro) e o padrão de picos M, M+2, M+4… de moléculas com Cl e Br.</p>
      ${grid([0, 1, 2, 3].map(row).join(""), 2)}
      <button class="dos-btn mb-3" onclick="runIso15()">CALCULAR MASSA MÉDIA</button>${out("i-res")}
      <div class="font-bold mt-4 mb-1">Padrão isotópico (espectrometria de massas)</div>
      ${grid(fld("p-cl", "Átomos de Cl", "2") + fld("p-br", "Átomos de Br", "0"))}
      <button class="dos-btn mb-3" onclick="runPat15()">CALCULAR PADRÃO</button>${out("p-res")}
      <p class="text-xs opacity-80 mt-2">O padrão considera só ³⁵Cl/³⁷Cl (75,76/24,24 %) e ⁷⁹Br/⁸¹Br (50,69/49,31 %); ignora ¹³C e outros isótopos, que acrescentam picos pequenos.</p>`);
    runIso15(); runPat15();
  }
  window.runIso15 = function () {
    let s = 0, w = 0, k = 0; for (let i = 0; i < 4; i++) { const m = parseFloat(String($("i-m" + i).value).replace(",", ".")), a = parseFloat(String($("i-a" + i).value).replace(",", ".")); if (isFinite(m) && isFinite(a) && a > 0) { s += m * a; w += a; k++; } }
    const box = $("i-res"); if (!k) { box.textContent = "Informe ao menos um isótopo com massa e abundância."; return; }
    box.innerHTML = `Massa atômica média = <strong>${fmt(s / w, 6)} u</strong> (${k} isótopo(s))${Math.abs(w - 100) > 0.5 ? `<br><span class="text-yellow-300">A soma das abundâncias é ${fmt(w)} %, não 100 %; o resultado foi normalizado.</span>` : ""}`;
  };
  window.runPat15 = function () {
    const nCl = parseInt(NUM("p-cl")), nBr = parseInt(NUM("p-br")), box = $("p-res");
    if (!(nCl >= 0 && nBr >= 0 && nCl + nBr >= 1 && nCl + nBr <= 12)) { box.textContent = "Informe 0 a 12 átomos de Cl e Br (ao menos 1 átomo no total)."; return; }
    let dist = [1]; const conv = (d, p) => { const r = new Array(d.length + 2).fill(0); d.forEach((x, i) => { r[i] += x * p[0]; r[i + 2] += x * p[1]; }); return r; }; // índice = deslocamento em u
    for (let i = 0; i < nCl; i++) dist = conv(dist, [0.7576, 0.2424]);
    for (let i = 0; i < nBr; i++) dist = conv(dist, [0.5069, 0.4931]);
    const mx = Math.max(...dist); let h = "";
    dist.forEach((x, i) => { if (x / mx > 0.0005) h += `M${i ? "+" + i : ""}: ${fmt(100 * x / mx, 3)} % ${"█".repeat(Math.round(20 * x / mx))}<br>`; });
    box.innerHTML = h;
  };

  /* ---------- 55: Lei de Hess ---------- */
  function r55() {
    const row = i => `${fld("h-h" + i, "ΔH da etapa " + (i + 1) + " (kJ)", [-393.5, -283.0, "", "", ""][i])}${fld("h-k" + i, "Multiplicador", [1, -1, "", "", ""][i])}`;
    page("55. LEI DE HESS (SOMA DE ETAPAS)", `<p class="text-sm mb-2">Cada etapa entra com seu ΔH e um multiplicador: <strong>−1</strong> inverte a reação, <strong>2</strong> a dobra, <strong>0,5</strong> a divide. O ΔH total é a soma de multiplicador × ΔH.</p>
      ${grid([0, 1, 2, 3, 4].map(row).join(""), 2)}
      <button class="dos-btn mb-3" onclick="runHess15()">SOMAR</button>${out("h-res")}
      <p class="text-xs opacity-80 mt-2">Exemplo pronto: C + O₂ → CO₂ (−393,5) menos CO + ½O₂ → CO₂ (−283,0) dá C + ½O₂ → CO, ΔH = −110,5 kJ. Confira se os estados físicos e as espécies intermediárias se cancelam.</p>`);
    runHess15();
  }
  window.runHess15 = function () {
    let tot = 0, k = 0, h = "";
    for (let i = 0; i < 5; i++) { const d = parseFloat(String($("h-h" + i).value).replace(",", ".")), m = parseFloat(String($("h-k" + i).value).replace(",", ".")); if (isFinite(d) && isFinite(m)) { tot += d * m; k++; h += `Etapa ${i + 1}: ${fmt(m)} × (${fmt(d)}) = ${fmt(d * m)} kJ<br>`; } }
    $("h-res").innerHTML = k ? `${h}<strong>ΔH total = ${fmt(tot)} kJ</strong> — ${tot < 0 ? "exotérmica" : tot > 0 ? "endotérmica" : "termoneutra"}` : "Informe ao menos uma etapa com ΔH e multiplicador.";
  };

  /* ---------- 56: cristais e Bragg ---------- */
  const CUB = { cs: ["Cúbica simples", 1, 1, 0.5236], ccc: ["Cúbica de corpo centrado (CCC)", 2, Math.sqrt(3) / 4, 0.6802], cfc: ["Cúbica de face centrada (CFC)", 4, Math.SQRT2 / 4, 0.7405] };
  function r56() {
    page("56. CRISTAIS CÚBICOS E DIFRAÇÃO DE BRAGG", `<label class="text-sm block mb-2">Estrutura ${sel("k-s", Object.keys(CUB).map(k => [k, CUB[k][0]]))}</label>
      ${grid(fld("k-M", "Massa molar (g/mol)", "63.55") + fld("k-a", "Aresta a (pm); deixe vazio para calcular", "361") + fld("k-d", "Densidade (g/cm³); deixe vazio para calcular", ""))}
      <button class="dos-btn mb-3" onclick="runCub15()">CALCULAR</button>${out("k-res")}
      <div class="font-bold mt-4 mb-1">Lei de Bragg: nλ = 2d·senθ</div>
      ${grid(fld("b-l", "λ (pm)", "154") + fld("b-t", "θ (graus)", "22") + fld("b-n", "Ordem n", "1"))}
      <button class="dos-btn mb-3" onclick="runBragg15()">CALCULAR d</button>${out("b-res")}
      <p class="text-xs opacity-80 mt-2">ρ = Z·M/(N_A·a³), com Z = 1, 2 ou 4. Raios: a/2 (simples), √3·a/4 (CCC), √2·a/4 (CFC). Preencha só a aresta ou só a densidade.</p>`);
    $("k-s").value = "cfc"; runCub15(); runBragg15();
  }
  window.runCub15 = function () {
    const c = CUB[$("k-s").value], M = NUM("k-M"), a = NUM("k-a"), d = NUM("k-d"), NA = 6.02214076e23, box = $("k-res");
    if (!(M > 0)) { box.textContent = "Informe a massa molar."; return; }
    let aa = a, rho = d;
    if (isFinite(a) && a > 0) rho = c[1] * M / (NA * Math.pow(a * 1e-10, 3));
    else if (isFinite(d) && d > 0) aa = Math.cbrt(c[1] * M / (NA * d)) * 1e10;
    else { box.textContent = "Informe a aresta ou a densidade."; return; }
    box.innerHTML = `${c[0]}: Z = ${c[1]} átomos por cela<br>Aresta a = <strong>${fmt(aa)} pm</strong> · densidade = <strong>${fmt(rho)} g/cm³</strong><br>Raio atômico = <strong>${fmt(c[2] * aa)} pm</strong> · fração de empacotamento = ${fmt(100 * c[3])} %`;
  };
  window.runBragg15 = function () {
    const l = NUM("b-l"), t = NUM("b-t"), n = NUM("b-n"), box = $("b-res");
    if (!(l > 0 && n >= 1 && t > 0 && t < 90)) { box.textContent = "Informe λ > 0, n ≥ 1 e θ entre 0 e 90°."; return; }
    const s = Math.sin(t * Math.PI / 180), dd = n * l / (2 * s);
    box.innerHTML = `d = nλ/(2·senθ) = <strong>${fmt(dd)} pm</strong> (${fmt(dd / 100)} Å)`;
  };

  const R5 = { 52: r52, 53: r53, 54: r54, 55: r55, 56: r56 }, orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    const n = parseInt(id);
    if (R5[n]) { if (typeof playBeep === "function") playBeep(700, 0.04); R5[n](); if (typeof screenAnimateIn === "function") screenAnimateIn(); return; }
    orig(id);
  };
  window.ChemTools15 = { tcrit };
})();
