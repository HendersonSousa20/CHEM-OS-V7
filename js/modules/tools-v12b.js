/* v12.1 — Módulos 39 pH universal · 40 Estatística e calibração · 41 Gases reais · 42 Radioatividade. */
(function () {
  const $ = id => document.getElementById(id), NUM = id => parseFloat(String($(id).value).replace(",", "."));
  const fmt = (x, d) => !isFinite(x) ? "—" : (x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 1e-3) ? x.toExponential(3) : String(+x.toPrecision(d || 4))).replace(".", ",");
  const fld = (id, l, v, ph) => `<label class="text-sm">${l}<input id="${id}" type="text" inputmode="decimal" value="${v}" placeholder="${ph || ""}" class="dos-input w-full p-1"></label>`;
  const page = (t, b) => { $("screen-content").innerHTML = `<div class="text-xl font-bold border-b border-current pb-1 mb-3">${t}</div>${b}`; };
  const grid = h => `<div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">${h}</div>`;
  const out = id => `<div id="${id}" class="dos-border p-3 text-sm" aria-live="polite"></div>`;
  const sel = (id, opts) => `<select id="${id}" class="dos-input w-full p-1">${opts.map(o => `<option value="${o[0]}">${o[1]}</option>`).join("")}</select>`;
  const KW = 1e-14, R = 0.082057, NA = 6.02214076e23;

  /* ---------- 39: pH universal (balanço de carga exato) ---------- */
  function phSolve(type, C, pKa1, pKa2) {
    const K1 = Math.pow(10, -pKa1), K2 = Math.pow(10, -pKa2);
    const g = h => { // cargas positivas − negativas
      switch (type) {
        case "sa": return h - KW / h - C;
        case "sb": return h + C - KW / h;
        case "wa": return h - KW / h - C * K1 / (h + K1);
        case "wb": return h + C * h / (h + K1) - KW / h;                 // B com ácido conjugado pKa1
        case "salA": return h + C - KW / h - C * K1 / (h + K1);           // Na⁺A⁻
        case "salB": return h + C * h / (h + K1) - KW / h - C;            // BH⁺Cl⁻
        default: return h - KW / h - C * (K1 * h + 2 * K1 * K2) / (h * h + K1 * h + K1 * K2); // H₂A
      }
    };
    let lo = -16, hi = 2; // log10 h (pH -2 a 16)
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(Math.pow(10, m)) > 0) hi = m; else lo = m; }
    return -(lo + hi) / 2;
  }
  function r39() {
    page("39. pH UNIVERSAL (SOLUÇÃO EXATA)", `<p class="text-sm mb-2">Resolve o balanço de carga completo, sem aproximações: vale para soluções muito diluídas, ácidos moderados e sais.</p>
      <label class="text-sm block mb-2">Tipo de solução ${sel("p-t", [["sa", "Ácido forte (HCl, HNO₃)"], ["sb", "Base forte (NaOH)"], ["wa", "Ácido fraco HA"], ["wb", "Base fraca B (informe o pKa de BH⁺)"], ["salA", "Sal de ácido fraco (NaA)"], ["salB", "Sal de base fraca (BHCl)"], ["da", "Ácido diprótico H₂A"]])}</label>
      ${grid(fld("p-C", "Concentração (mol/L)", "0.10") + fld("p-k1", "pKa₁ (do ácido HA, de BH⁺ ou de H₂A)", "4.76") + fld("p-k2", "pKa₂ (só diprótico)", "10.33"))}
      <p class="text-xs mb-2">Base fraca: pKa(BH⁺) = 14 − pKb (a 25 °C). Ex.: NH₃ tem pKb 4,75, logo pKa 9,25. Ignorado para ácido ou base forte.</p>
      <button class="dos-btn mb-3" onclick="runPh12()">CALCULAR pH</button>${out("p-res")}`);
    runPh12();
  }
  window.runPh12 = function () {
    const C = NUM("p-C"), k1 = NUM("p-k1"), k2 = NUM("p-k2"), t = $("p-t").value, box = $("p-res");
    if (!(C > 0) || ((t !== "sa" && t !== "sb") && !isFinite(k1)) || (t === "da" && !isFinite(k2))) { box.textContent = "Informe a concentração (> 0) e os pKa necessários."; return; }
    const pH = phSolve(t, C, k1, k2), h = Math.pow(10, -pH);
    let extra = "";
    if (t === "wa" || t === "salA") { const K = Math.pow(10, -k1); extra = `<br>Fração desprotonada A⁻ = ${fmt(100 * K / (h + K))} %`; }
    if (t === "da") { const K1 = Math.pow(10, -k1), K2 = Math.pow(10, -k2), D = h * h + K1 * h + K1 * K2; extra = `<br>H₂A ${fmt(100 * h * h / D)} % · HA⁻ ${fmt(100 * K1 * h / D)} % · A²⁻ ${fmt(100 * K1 * K2 / D)} %`; }
    box.innerHTML = `pH = <strong>${fmt(pH)}</strong> · pOH = ${fmt(14 - pH)} · [H⁺] = ${fmt(h)} mol/L${extra}<br><span class="text-xs opacity-80">Considera 25 °C (Kw = 1,0×10⁻¹⁴) e comportamento ideal (atividades = concentrações).</span>`;
  };

  /* ---------- 40: estatística e calibração ---------- */
  const T95 = [0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145, 2.131, 2.120, 2.110, 2.101, 2.093, 2.086];
  const tcrit = df => df <= 20 ? T95[df] : df <= 30 ? 2.04 : df <= 60 ? 2.00 : 1.98;
  const nums = s => String(s).split(/[\s;]+/).map(x => parseFloat(x.replace(",", "."))).filter(isFinite); // vírgula = decimal; separe valores por espaço ou ;
  function r40() {
    page("40. ESTATÍSTICA E CURVA DE CALIBRAÇÃO", `
      <div class="font-bold mb-1">Réplicas (média, desvio, intervalo de confiança)</div>
      <label class="text-sm block mb-2">Medidas (separe por espaço; vírgula é decimal)<input id="s-d" class="dos-input w-full p-1" value="10.1 10.3 10.2 10.0"></label>
      <button class="dos-btn mb-3" onclick="runStat12()">CALCULAR</button>${out("s-res")}
      <div class="font-bold mt-4 mb-1">Curva de calibração (ex.: absorbância × concentração)</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2"><label class="text-sm">x (concentrações)<input id="c-x" class="dos-input w-full p-1" value="0 2 4 6 8 10"></label><label class="text-sm">y (sinais)<input id="c-y" class="dos-input w-full p-1" value="0.002 0.101 0.205 0.297 0.404 0.498"></label></div>
      <div class="mb-2" style="max-width:16rem">${fld("c-u", "Sinal da amostra desconhecida (y)", "0.250")}</div>
      <button class="dos-btn mb-3" onclick="runCal12()">AJUSTAR E QUANTIFICAR</button>${out("c-res")}
      <p class="text-xs opacity-80 mt-2">Não extrapole: use amostras dentro da faixa da curva. LOD = 3,3·s/m e LOQ = 10·s/m, com s o desvio-padrão dos resíduos (critério ICH).</p>`);
    runStat12(); runCal12();
  }
  window.runStat12 = function () {
    const a = nums($("s-d").value), n = a.length, box = $("s-res");
    if (n < 2) { box.textContent = "Informe pelo menos 2 medidas."; return; }
    const m = a.reduce((x, y) => x + y, 0) / n, s = Math.sqrt(a.reduce((x, y) => x + (y - m) * (y - m), 0) / (n - 1)), ci = tcrit(n - 1) * s / Math.sqrt(n);
    box.innerHTML = `n = ${n} · média = <strong>${fmt(m)}</strong> · s = ${fmt(s)} · RSD = ${fmt(100 * s / Math.abs(m))} %<br>IC 95 %: ${fmt(m)} ± ${fmt(ci)} (t = ${String(tcrit(n - 1)).replace(".", ",")}, ${n - 1} graus de liberdade) · amplitude = ${fmt(Math.max(...a) - Math.min(...a))}`;
  };
  window.runCal12 = function () {
    const x = nums($("c-x").value), y = nums($("c-y").value), u = NUM("c-u"), box = $("c-res"), n = x.length;
    if (n < 3 || n !== y.length) { box.textContent = "Informe pelo menos 3 pares, com o mesmo número de valores em x e y."; return; }
    const mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n;
    let sxx = 0, sxy = 0, syy = 0; x.forEach((xi, i) => { sxx += (xi - mx) ** 2; sxy += (xi - mx) * (y[i] - my); syy += (y[i] - my) ** 2; });
    if (sxx === 0) { box.textContent = "Os valores de x não podem ser todos iguais."; return; }
    const m = sxy / sxx, b = my - m * mx, r2 = syy === 0 ? 1 : sxy * sxy / (sxx * syy);
    const sr = Math.sqrt(y.reduce((a, yi, i) => a + (yi - (m * x[i] + b)) ** 2, 0) / (n - 2));
    let h = `y = <strong>${fmt(m)}</strong>·x ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))} · R² = <strong>${fmt(r2, 5)}</strong> · s(resíduos) = ${fmt(sr)}<br>LOD = ${fmt(3.3 * sr / m)} · LOQ = ${fmt(10 * sr / m)} (unidades de x)`;
    if (isFinite(u)) { const xu = (u - b) / m, out = xu < Math.min(...x) || xu > Math.max(...x); h += `<br>Amostra: x = <strong>${fmt(xu)}</strong>${out ? ' <span class="text-yellow-300">(fora da faixa da curva: extrapolação, não confiável)</span>' : ""}`; }
    box.innerHTML = h + (r2 < 0.99 ? '<br><span class="text-yellow-300">R² abaixo de 0,99: verifique pontos discrepantes ou a faixa linear (lei de Beer).</span>' : "");
  };

  /* ---------- 41: gases reais (van der Waals) ---------- */
  const VDW = [["He", 0.0346, 0.0238], ["H₂", 0.2476, 0.02661], ["N₂", 1.370, 0.0387], ["O₂", 1.382, 0.03186], ["CH₄", 2.303, 0.04301], ["CO₂", 3.658, 0.04286], ["NH₃", 4.225, 0.03713], ["H₂O", 5.537, 0.03049]];
  function r41() {
    page("41. GASES REAIS (VAN DER WAALS) E PRESSÃO DE VAPOR", `
      <p class="text-sm mb-2">Compara o gás ideal com van der Waals, (P + a·n²/V²)(V − nb) = nRT, e calcula o fator de compressibilidade Z.</p>
      <label class="text-sm block mb-2">Gás ${sel("g-s", VDW.map((v, i) => [i, `${v[0]} (a = ${v[1]}, b = ${v[2]})`]))}</label>
      ${grid(fld("g-n", "n (mol)", "1") + fld("g-V", "V (L)", "0.5") + fld("g-T", "T (K)", "300"))}
      <button class="dos-btn mb-3" onclick="runVdw12()">CALCULAR</button>${out("g-res")}
      <div class="font-bold mt-4 mb-1">Clausius-Clapeyron: pressão de vapor em outra temperatura</div>
      ${grid(fld("v-H", "ΔHvap (kJ/mol)", "40.7") + fld("v-P1", "P₁ (atm)", "1") + fld("v-T1", "T₁ (K)", "373.15") + fld("v-T2", "T₂ (K)", "363.15"))}
      <button class="dos-btn mb-3" onclick="runCC12()">CALCULAR</button>${out("v-res")}
      <p class="text-xs opacity-80 mt-2">a em L²·atm/mol² e b em L/mol (valores de tabela, 25 °C). vdW falha perto do ponto crítico e em líquidos.</p>`);
    runVdw12(); runCC12();
  }
  window.runVdw12 = function () {
    const g = VDW[$("g-s").value], n = NUM("g-n"), V = NUM("g-V"), T = NUM("g-T"), box = $("g-res");
    if (!(n > 0 && V > n * g[2] && T > 0)) { box.textContent = `Informe n, V e T positivos, com V maior que n·b = ${fmt(n * g[2])} L.`; return; }
    const Pi = n * R * T / V, Pv = n * R * T / (V - n * g[2]) - g[1] * n * n / (V * V), Zi = Pv * V / (n * R * T);
    box.innerHTML = `P ideal = ${fmt(Pi)} atm · P van der Waals = <strong>${fmt(Pv)} atm</strong> (${fmt(100 * (Pv - Pi) / Pi)} %)<br>Z = PV/nRT = <strong>${fmt(Zi)}</strong> — ${Zi < 0.98 ? "predomina a atração (Z &lt; 1)" : Zi > 1.02 ? "predomina o volume das moléculas (Z &gt; 1)" : "comportamento próximo do ideal"}`;
  };
  window.runCC12 = function () {
    const H = NUM("v-H") * 1000, P1 = NUM("v-P1"), T1 = NUM("v-T1"), T2 = NUM("v-T2"), box = $("v-res");
    if (!(H > 0 && P1 > 0 && T1 > 0 && T2 > 0)) { box.textContent = "Informe ΔHvap, P₁, T₁ e T₂ positivos."; return; }
    box.innerHTML = `P₂ = P₁·exp[−(ΔHvap/R)(1/T₂ − 1/T₁)] = <strong>${fmt(P1 * Math.exp(-H / 8.314462618 * (1 / T2 - 1 / T1)))}</strong> (mesma unidade de P₁)`;
  };

  /* ---------- 42: radioatividade ---------- */
  const UT = { s: 1, min: 60, h: 3600, d: 86400, a: 3.15576e7 };
  function r42() {
    page("42. RADIOATIVIDADE: DECAIMENTO, IDADE E ENERGIA", `
      <label class="text-sm block mb-2">O que calcular ${sel("n-m", [["rest", "Quantidade restante após um tempo"], ["age", "Tempo decorrido (datação)"], ["act", "Atividade (Bq) de uma amostra"], ["en", "Energia de Δm (defeito de massa)"]])}</label>
      ${grid(fld("n-a", "Quantidade inicial (N₀, g ou nº)", "100") + fld("n-h", "Meia-vida t½", "8.02") + fld("n-t", "Tempo t / fração restante (%) / massa (g) / Δm (u)", "24") + `<label class="text-sm">Unidade de tempo ${sel("n-u", [["d", "dias"], ["s", "segundos"], ["min", "minutos"], ["h", "horas"], ["a", "anos"]])}</label>` + fld("n-M", "Massa molar (g/mol), só atividade", "131"))}
      <button class="dos-btn mb-3" onclick="runNuc12()">CALCULAR</button>${out("n-res")}
      <p class="text-xs opacity-80 mt-2">Exemplos: ¹³¹I t½ = 8,02 d · ¹⁴C t½ = 5730 a · ²³⁸U t½ = 4,47×10⁹ a. 1 u = 931,494 MeV/c²; 1 Ci = 3,7×10¹⁰ Bq.</p>`);
    runNuc12();
  }
  window.runNuc12 = function () {
    const m = $("n-m").value, N0 = NUM("n-a"), th = NUM("n-h"), x = NUM("n-t"), M = NUM("n-M"), u = $("n-u").value, box = $("n-res");
    if (m === "en") { if (!isFinite(x)) { box.textContent = "Informe Δm (em u) no campo do meio."; return; } box.innerHTML = `E = Δm·c² = <strong>${fmt(x * 931.494)} MeV</strong> = ${fmt(x * 931.494 * 1.602176634e-13)} J (por núcleo) = ${fmt(x * 931.494 * 1.602176634e-13 * NA / 1000)} kJ/mol`; return; }
    if (!(th > 0)) { box.textContent = "Informe uma meia-vida positiva."; return; }
    const lam = Math.LN2 / th;
    if (m === "rest") { if (!(N0 > 0 && x >= 0)) { box.textContent = "Informe N₀ > 0 e t ≥ 0."; return; } const f = Math.pow(2, -x / th); box.innerHTML = `Restam <strong>${fmt(N0 * f)}</strong> (${fmt(100 * f)} %) após ${fmt(x / th)} meias-vidas · λ = ${fmt(lam)} por unidade de tempo`; }
    else if (m === "age") { if (!(x > 0 && x <= 100)) { box.textContent = "Informe a fração restante entre 0 e 100 % (no campo de tempo)."; return; } box.innerHTML = `t = t½·log₂(100/%) = <strong>${fmt(th * Math.log2(100 / x))}</strong> (mesma unidade de t½) = ${fmt(Math.log2(100 / x))} meias-vidas`; }
    else { if (!(x > 0 && M > 0)) { box.textContent = "Informe a massa (g) no campo do meio e a massa molar."; return; } const N = x / M * NA, A = N * Math.LN2 / (th * UT[u]); box.innerHTML = `N = ${fmt(N)} núcleos · A = λN = <strong>${fmt(A)} Bq</strong> = ${fmt(A / 3.7e10)} Ci`; }
  };

  const R2 = { 39: r39, 40: r40, 41: r41, 42: r42 }, orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    const n = parseInt(id);
    if (R2[n]) { if (typeof playBeep === "function") playBeep(700, 0.04); R2[n](); if (typeof screenAnimateIn === "function") screenAnimateIn(); return; }
    orig(id);
  };
  window.ChemTools12b = { phSolve, tcrit };
})();
