/* v16 — Módulos 57 Carga e pI de aminoácidos · 58 Velocidades moleculares (Maxwell-Boltzmann). */
(function () {
  const $ = id => document.getElementById(id), NUM = id => parseFloat(String($(id).value).replace(",", "."));
  const fmt = (x, d) => !isFinite(x) ? "—" : (x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 1e-3) ? x.toExponential(3) : String(+x.toPrecision(d || 4))).replace(".", ",");
  const fld = (id, l, v) => `<label class="text-sm">${l}<input id="${id}" type="text" inputmode="decimal" value="${v}" class="dos-input w-full p-1"></label>`;
  const page = (t, b) => { $("screen-content").innerHTML = `<div class="text-xl font-bold border-b border-current pb-1 mb-3">${t}</div>${b}`; };
  const grid = (h, c) => `<div class="grid grid-cols-1 md:grid-cols-${c || 3} gap-2 mb-3">${h}</div>`;
  const out = id => `<div id="${id}" class="dos-border p-3 text-sm" aria-live="polite"></div>`;
  const sel = (id, o) => `<select id="${id}" class="dos-input w-full p-1">${o.map(x => `<option value="${x[0]}">${x[1]}</option>`).join("")}</select>`;

  /* ---------- 57: aminoácidos (pKa de tabela, ≈ 25 °C) ---------- */
  // [nome, pKa α-COOH, pKa α-NH3⁺, pKa da cadeia lateral ou null, tipo: "a" ácida, "b" básica, "n" neutra]
  const AA = {
    gly: ["Glicina", 2.34, 9.60, null, "n"], ala: ["Alanina", 2.34, 9.69, null, "n"], leu: ["Leucina", 2.36, 9.60, null, "n"], ser: ["Serina", 2.21, 9.15, null, "n"],
    asp: ["Ácido aspártico", 1.88, 9.60, 3.65, "a"], glu: ["Ácido glutâmico", 2.19, 9.67, 4.25, "a"], cys: ["Cisteína", 1.96, 10.28, 8.18, "a"], tyr: ["Tirosina", 2.20, 9.11, 10.07, "a"],
    his: ["Histidina", 1.82, 9.17, 6.00, "b"], lys: ["Lisina", 2.18, 8.95, 10.53, "b"], arg: ["Arginina", 2.17, 9.04, 12.48, "b"]
  };
  function charge(a, pH) {
    let q = -1 / (1 + Math.pow(10, a[1] - pH)) + 1 / (1 + Math.pow(10, pH - a[2]));
    if (a[3] !== null) q += a[4] === "b" ? 1 / (1 + Math.pow(10, pH - a[3])) : -1 / (1 + Math.pow(10, a[3] - pH));
    return q;
  }
  // pI = pH em que a carga líquida é zero (bisseção; a carga decresce com o pH)
  function pI(a) { let lo = 0, hi = 14; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (charge(a, m) > 0) lo = m; else hi = m; } return (lo + hi) / 2; }
  function r57() {
    page("57. CARGA E PONTO ISOELÉTRICO DE AMINOÁCIDOS", `<p class="text-sm mb-2">Calcula a carga líquida de um aminoácido em qualquer pH e o seu pI, com pKa de tabela (aproximadamente 25 °C).</p>
      <label class="text-sm block mb-2">Aminoácido ${sel("a-s", Object.keys(AA).map(k => [k, AA[k][0]]))}</label>
      ${grid(fld("a-ph", "pH da solução", "7.0"), 2)}
      <button class="dos-btn mb-3" onclick="runAA16()">CALCULAR</button>${out("a-res")}
      <p class="text-xs opacity-80 mt-2">O pI é o pH em que a carga líquida se anula (para neutros, (pKa₁ + pKa₂)/2; para Asp e Glu, a média dos dois menores pKa; para Lys e Arg, a dos dois maiores). Em um peptídeo ou proteína os pKa se deslocam pelo ambiente: use o resultado como estimativa.</p>`);
    runAA16();
  }
  window.runAA16 = function () {
    const a = AA[$("a-s").value], pH = NUM("a-ph"), box = $("a-res");
    if (!(pH >= 0 && pH <= 14)) { box.textContent = "Informe um pH entre 0 e 14."; return; }
    const q = charge(a, pH), p = pI(a), pk = [a[1], a[2]].concat(a[3] !== null ? [a[3]] : []).map(x => fmt(x)).join(" · ");
    box.innerHTML = `<strong>${a[0]}</strong> · pKa: ${pk}<br>Carga líquida em pH ${fmt(pH)}: <strong>${q > 0 ? "+" : ""}${fmt(q, 3)}</strong> — ${q > 0.05 ? "predomina o cátion (migra para o cátodo, −)" : q < -0.05 ? "predomina o ânion (migra para o ânodo, +)" : "próximo da neutralidade (zwitteríon)"}<br>Ponto isoelétrico pI = <strong>${fmt(p, 3)}</strong> `;
  };

  /* ---------- 58: velocidades moleculares ---------- */
  const GAS = { h2: ["H₂", 2.016], he: ["He", 4.0026], ch4: ["CH₄", 16.043], n2: ["N₂", 28.014], o2: ["O₂", 31.998], ar: ["Ar", 39.948], co2: ["CO₂", 44.010], so2: ["SO₂", 64.066] };
  const erf = x => { const s = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)); };
  const fracAbove = (v, vmp) => { const x = v / vmp; return 1 - (erf(x) - 2 / Math.sqrt(Math.PI) * x * Math.exp(-x * x)); };
  function r58() {
    page("58. VELOCIDADES MOLECULARES (MAXWELL-BOLTZMANN)", `<p class="text-sm mb-2">Velocidade mais provável, média e quadrática média de um gás ideal, a fração de moléculas acima de uma velocidade e a razão de efusão entre dois gases.</p>
      ${grid(`<label class="text-sm">Gás ${sel("m-g", Object.keys(GAS).map(k => [k, `${GAS[k][0]} (${GAS[k][1]} g/mol)`]))}</label>` + fld("m-T", "Temperatura (K)", "298.15") + fld("m-v", "Velocidade limite v₀ (m/s)", "1000"))}
      <label class="text-sm block mb-2">Gás de comparação (efusão de Graham) ${sel("m-g2", Object.keys(GAS).map(k => [k, GAS[k][0]]))}</label>
      <button class="dos-btn mb-3" onclick="runMB16()">CALCULAR</button>${out("m-res")}
      <p class="text-xs opacity-80 mt-2">v<sub>mp</sub> = √(2RT/M) &lt; v<sub>méd</sub> = √(8RT/πM) &lt; v<sub>rms</sub> = √(3RT/M). Graham: v₁/v₂ = √(M₂/M₁). A fração acima de v₀ usa a distribuição de Maxwell-Boltzmann em 3D.</p>`);
    $("m-g").value = "n2"; $("m-g2").value = "h2"; runMB16();
  }
  window.runMB16 = function () {
    const g = GAS[$("m-g").value], g2 = GAS[$("m-g2").value], T = NUM("m-T"), v0 = NUM("m-v"), box = $("m-res"), R = 8.314462618;
    if (!(T > 0)) { box.textContent = "Informe a temperatura em kelvin (> 0)."; return; }
    const M = g[1] / 1000, vmp = Math.sqrt(2 * R * T / M), vav = Math.sqrt(8 * R * T / (Math.PI * M)), vrms = Math.sqrt(3 * R * T / M);
    let h = `${g[0]} a ${fmt(T)} K: v<sub>mp</sub> = <strong>${fmt(vmp)} m/s</strong> · v<sub>méd</sub> = ${fmt(vav)} m/s · v<sub>rms</sub> = ${fmt(vrms)} m/s<br>Energia cinética média de translação = (3/2)kT = ${fmt(1.5 * 1.380649e-23 * T)} J por molécula = ${fmt(1.5 * R * T / 1000)} kJ/mol`;
    if (v0 > 0) h += `<br>Fração das moléculas com v &gt; ${fmt(v0)} m/s: <strong>${fmt(100 * Math.max(0, fracAbove(v0, vmp)), 3)} %</strong>`;
    h += `<br>Efusão: ${g[0]} / ${g2[0]} = √(${fmt(g2[1])}/${fmt(g[1])}) = <strong>${fmt(Math.sqrt(g2[1] / g[1]))}</strong>`;
    box.innerHTML = h;
  };

  const R6 = { 57: r57, 58: r58 }, orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    const n = parseInt(id);
    if (R6[n]) { if (typeof playBeep === "function") playBeep(700, 0.04); R6[n](); if (typeof screenAnimateIn === "function") screenAnimateIn(); return; }
    orig(id);
  };
  window.ChemTools16 = { charge, pI, AA, erf, fracAbove };
})();
