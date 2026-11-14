/* v22 — Módulos de bancada: 35 Concentrações e reagentes concentrados · 36 Referência rápida · 37 Propriedades coligativas. */
(function () {
  const $ = id => document.getElementById(id);
  const num = id => parseFloat(String($(id).value).replace(",", "."));
  const f = (x, d) => (isFinite(x) ? x.toLocaleString("pt-BR", { useGrouping: false, maximumSignificantDigits: d || 4 }) : "—");
  const head = t => `<div class="text-xl font-bold border-b border-current pb-1 mb-3">${t}</div>`;
  const field = (id, label, val, ph) => `<label class="text-sm">${label}<input id="${id}" type="text" inputmode="decimal" value="${val}" placeholder="${ph || ""}" class="dos-input w-full p-1"></label>`;

  // Reagentes comerciais típicos: [nome, M g/mol, % m/m, d g/mL]. Valores de rótulo variam por lote e fabricante.
  const REAG = [["HCl 37 %", 36.46, 37, 1.19], ["HNO₃ 65 %", 63.01, 65, 1.39], ["H₂SO₄ 98 %", 98.08, 98, 1.84], ["H₃PO₄ 85 %", 98.00, 85, 1.69],
    ["NH₃ 25 % (amônia)", 17.03, 25, 0.91], ["CH₃COOH 99,8 % (glacial)", 60.05, 99.8, 1.05], ["NaOH 50 %", 40.00, 50, 1.52], ["H₂O₂ 30 %", 34.01, 30, 1.11]];

  /* ---------- 35 ---------- */
  function conc(w, d, M) { // w em % m/m
    const molL = 10 * w * d / M, kg = (100 - w) / 1000;
    return { molL, gL: molL * M, molal: (w / M) / kg, xs: (w / M) / (w / M + (100 - w) / 18.015) };
  }
  function r35() {
    $("screen-content").innerHTML = head("35. CONCENTRAÇÕES E REAGENTES CONCENTRADOS") + `
      <p class="text-sm mb-2">Reagente do frasco: converte % m/m e densidade em mol/L e diz quanto pipetar para preparar uma solução.</p>
      <label class="text-sm block mb-2">Reagente comum<select id="u-rg" class="dos-input w-full p-1"><option value="">— personalizado —</option>${REAG.map((r, i) => `<option value="${i}">${r[0]}</option>`).join("")}</select></label>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">${field("u-M", "Massa molar (g/mol)", "36.46")}${field("u-w", "Teor (% m/m)", "37")}${field("u-d", "Densidade (g/mL)", "1.19")}</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">${field("u-C", "Quero preparar (mol/L)", "1")}${field("u-V", "Volume final (mL)", "500")}</div>
      <button class="dos-btn mb-3" onclick="runConc22()">CALCULAR</button>
      <div id="u-res" class="dos-border p-3 text-sm" aria-live="polite"></div>
      <div class="text-lg font-bold border-b border-current pb-1 my-3">Conversor de unidades de concentração</div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">${field("u-cv", "Valor", "0.1")}
        <label class="text-sm">Unidade<select id="u-cu" class="dos-input w-full p-1"><option value="molL">mol/L</option><option value="gL">g/L</option><option value="pv">% m/v</option><option value="ppm">ppm (mg/L)</option></select></label>
        ${field("u-cM", "Massa molar (g/mol)", "58.44")}</div>
      <button class="dos-btn mb-3" onclick="runConv22()">CONVERTER</button>
      <div id="u-cres" class="dos-border p-3 text-sm" aria-live="polite"></div>
      <p class="text-xs opacity-80 mt-2">Teores e densidades são valores típicos de rótulo; confira o do seu frasco. ppm = mg/L vale para soluções aquosas diluídas.</p>`;
    $("u-rg").onchange = e => { const r = REAG[e.target.value]; if (r) { $("u-M").value = r[1]; $("u-w").value = r[2]; $("u-d").value = r[3]; } };
    runConc22(); runConv22();
  }
  window.runConc22 = function () {
    const M = num("u-M"), w = num("u-w"), d = num("u-d"), C = num("u-C"), V = num("u-V"), box = $("u-res");
    if (!(M > 0 && w > 0 && w <= 100 && d > 0)) { box.textContent = "Informe massa molar, teor (0–100 %) e densidade positivos."; return; }
    const r = conc(w, d, M); let out = `Concentração: <strong>${f(r.molL)} mol/L</strong> = ${f(r.gL)} g/L<br>Molalidade: ${f(r.molal)} mol/kg · fração molar do soluto (base água): ${f(r.xs)}`;
    if (C > 0 && V > 0) {
      const v = C * V / r.molL;
      out += v > V ? `<br><span class="text-yellow-300">Impossível: o reagente (${f(r.molL)} mol/L) é mais diluído que o pedido (${f(C)} mol/L).</span>`
        : `<br><br>Para <strong>${f(V)} mL de ${f(C)} mol/L</strong>: pipetar <strong>${f(v)} mL</strong> do reagente (${f(v * d)} g) e completar com água até ${f(V)} mL (C₁V₁ = C₂V₂).<br>Ao diluir ácido forte, adicione o ácido à água, nunca o contrário.`;
    }
    box.innerHTML = out;
  };
  window.runConv22 = function () {
    const v = num("u-cv"), M = num("u-cM"), u = $("u-cu").value, box = $("u-cres");
    if (!(v >= 0 && M > 0)) { box.textContent = "Informe um valor e a massa molar."; return; }
    const gL = u === "molL" ? v * M : u === "gL" ? v : u === "pv" ? v * 10 : v / 1000;
    box.innerHTML = `<strong>${f(gL / M)} mol/L</strong> · ${f(gL)} g/L · ${f(gL / 10)} % m/v · ${f(gL * 1000)} ppm (mg/L) · ${f(gL / M * 1000)} mmol/L`;
  };

  /* ---------- 36 ---------- */
  const IND = [["Violeta de metila", 0.0, 1.6, "amarelo", "violeta"], ["Azul de timol (1ª)", 1.2, 2.8, "vermelho", "amarelo"], ["Alaranjado de metila", 3.1, 4.4, "vermelho", "amarelo"],
    ["Verde de bromocresol", 3.8, 5.4, "amarelo", "azul"], ["Vermelho de metila", 4.4, 6.2, "vermelho", "amarelo"], ["Azul de bromotimol", 6.0, 7.6, "amarelo", "azul"],
    ["Vermelho de fenol", 6.6, 8.0, "amarelo", "vermelho"], ["Fenolftaleína", 8.2, 10.0, "incolor", "rosa"], ["Timolftaleína", 9.3, 10.5, "incolor", "azul"], ["Amarelo de alizarina", 10.1, 12.0, "amarelo", "vermelho"]];
  const PKA = [["Ácido oxálico", "1,25 · 4,27"], ["Ácido fosfórico", "2,15 · 7,20 · 12,32"], ["Ácido fluorídrico (HF)", "3,17"], ["Ácido cítrico", "3,13 · 4,76 · 6,40"], ["Ácido fórmico", "3,75"],
    ["Ácido lático", "3,86"], ["Ácido benzoico", "4,20"], ["Ácido acético", "4,76"], ["Ácido carbônico", "6,35 · 10,33"], ["HClO", "7,54"], ["HEPES", "7,48"], ["TRIS-H⁺", "8,07"], ["HCN", "9,21"], ["NH₄⁺", "9,25"], ["Fenol", "9,99"]];
  const SOL = [["Nitratos (NO₃⁻), acetatos, cloratos", "solúveis", ""], ["Sais de Na⁺, K⁺, NH₄⁺", "solúveis", ""], ["Cloretos, brometos, iodetos", "solúveis", "exceto Ag⁺, Pb²⁺, Hg₂²⁺ (PbCl₂ e PbBr₂ são pouco solúveis a frio)"],
    ["Sulfatos (SO₄²⁻)", "solúveis", "exceto Ba²⁺, Sr²⁺, Pb²⁺ (Ca²⁺ e Ag⁺ são pouco solúveis)"], ["Hidróxidos (OH⁻)", "insolúveis", "exceto alcalinos, NH₄⁺, Ba²⁺ (Ca²⁺ e Sr²⁺ são pouco solúveis)"],
    ["Carbonatos, fosfatos, sulfetos, sulfitos", "insolúveis", "exceto alcalinos e NH₄⁺ (sulfetos de alcalinos-terrosos reagem com água)"]];
  const tbl = (hd, rows) => `<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr>${hd.map(h => `<th class="text-left p-1 border-b border-current">${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td class="p-1 align-top">${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  function r36() {
    const sec = (t, b) => `<details class="dos-border p-2 mb-2" open><summary class="font-bold cursor-pointer">${t}</summary><div class="mt-2">${b}</div></details>`;
    $("screen-content").innerHTML = head("36. REFERÊNCIA RÁPIDA DE BANCADA") +
      `<label class="text-sm block mb-3">Escolher indicador para um pH<input id="r-ph" type="text" inputmode="decimal" value="8.5" class="dos-input w-full p-1"></label><div id="r-ind" class="dos-border p-3 text-sm mb-3" aria-live="polite"></div>` +
      sec("Indicadores ácido-base (25 °C)", tbl(["Indicador", "Faixa de pH", "Ácido → Básico"], IND.map(i => [i[0], f(i[1]) + " – " + f(i[2]), i[3] + " → " + i[4]]))) +
      sec("pKa de ácidos e tampões comuns (25 °C)", tbl(["Espécie", "pKa"], PKA)) +
      sec("Regras gerais de solubilidade em água", tbl(["Sal", "Regra", "Exceções"], SOL)) +
      `<p class="text-xs opacity-80">Faixas de transição e pKa variam um pouco entre fontes e com a temperatura. Para dados exatos de uma substância, use o módulo 2 (PubChem).</p>`;
    $("r-ph").oninput = runInd22; runInd22();
  }
  function runInd22() {
    const p = num("r-ph"), box = $("r-ind");
    if (!(p >= 0 && p <= 14)) { box.textContent = "Digite um pH entre 0 e 14."; return; }
    const ok = IND.filter(i => p >= i[1] && p <= i[2]).map(i => i[0]);
    const near = IND.filter(i => !ok.includes(i[0])).sort((a, b) => Math.abs(p - (a[1] + a[2]) / 2) - Math.abs(p - (b[1] + b[2]) / 2)).slice(0, 2).map(i => i[0]);
    box.innerHTML = ok.length ? `pH ${f(p)} está na faixa de virada de: <strong>${ok.join(", ")}</strong>.` : `Nenhum indicador da lista vira em pH ${f(p)}. Mais próximos: ${near.join(", ")}.`;
    box.innerHTML += `<br>Numa titulação, escolha o indicador cuja faixa contém o pH do ponto de equivalência.`;
  }

  /* ---------- 37 ---------- */
  const SOLV = [["Água", 1.86, 0.512], ["Benzeno", 5.12, 2.53], ["Ácido acético", 3.90, 3.07]];
  function r37() {
    $("screen-content").innerHTML = head("37. PROPRIEDADES COLIGATIVAS") + `
      <p class="text-sm mb-2">Abaixamento do ponto de congelamento, elevação do ponto de ebulição e pressão osmótica de uma solução diluída.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <label class="text-sm">Solvente<select id="c-s" class="dos-input w-full p-1">${SOLV.map((s, i) => `<option value="${i}">${s[0]} (Kf ${f(s[1])}, Kb ${f(s[2])})</option>`).join("")}</select></label>
        ${field("c-m", "Massa do soluto (g)", "10")}${field("c-M", "Massa molar do soluto (g/mol)", "180.16")}
        ${field("c-ms", "Massa do solvente (g)", "200")}${field("c-i", "Fator de van't Hoff i", "1")}${field("c-V", "Volume da solução (mL) p/ osmose", "205")}
        ${field("c-T", "Temperatura (°C) p/ osmose", "25")}</div>
      <p class="text-xs mb-2">i: 1 para não eletrólitos (glicose, ureia); ≈ 2 para NaCl, ≈ 3 para CaCl₂ (ideal; na prática é menor).</p>
      <button class="dos-btn mb-3" onclick="runColig22()">CALCULAR</button>
      <div id="c-res" class="dos-border p-3 text-sm" aria-live="polite"></div>`;
    runColig22();
  }
  window.runColig22 = function () {
    const s = SOLV[$("c-s").value], m = num("c-m"), M = num("c-M"), ms = num("c-ms"), i = num("c-i"), V = num("c-V"), T = num("c-T"), box = $("c-res");
    if (!(m > 0 && M > 0 && ms > 0 && i > 0)) { box.textContent = "Informe massas e massa molar positivas e i > 0."; return; }
    const n = m / M, mol = n / (ms / 1000), dTf = s[1] * mol * i, dTb = s[2] * mol * i;
    let out = `Molalidade: <strong>${f(mol)} mol/kg</strong><br>ΔT<sub>f</sub> = K<sub>f</sub>·m·i = <strong>${f(dTf)} °C</strong><br>ΔT<sub>b</sub> = K<sub>b</sub>·m·i = <strong>${f(dTb)} °C</strong>`;
    if (V > 0 && T > -273.15) out += `<br>Π = i·(n/V)·R·T = <strong>${f(i * n / (V / 1000) * 0.082057 * (T + 273.15))} atm</strong> (R = 0,082057 atm·L/(mol·K))`;
    box.innerHTML = out + `<br><span class="text-xs opacity-80">Vale para soluções diluídas e ideais; em concentrações altas ou com íons o valor real se afasta.</span>`;
  };

  const orig = window.renderToolInner, R = { 35: r35, 36: r36, 37: r37 };
  window.renderToolInner = function (id) {
    const n = parseInt(id);
    if (R[n]) { if (typeof playBeep === "function") playBeep(700, 0.04); R[n](); if (typeof screenAnimateIn === "function") screenAnimateIn(); return; }
    orig(id);
  };
  window.ChemUtil22 = { conc, REAG, IND };
})();
