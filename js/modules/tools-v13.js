/* v13 — Módulos 43 Incerteza · 44 Cromatografia · 45 Configuração eletrônica · 46 Energia de ligação · 47 Receitas de tampão · 48 Caderno de laboratório. */
(function () {
  const $ = id => document.getElementById(id), NUM = id => parseFloat(String($(id).value).replace(",", "."));
  const fmt = (x, d) => !isFinite(x) ? "—" : (x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 1e-3) ? x.toExponential(3) : String(+x.toPrecision(d || 4))).replace(".", ",");
  const fld = (id, l, v) => `<label class="text-sm">${l}<input id="${id}" type="text" inputmode="decimal" value="${v}" class="dos-input w-full p-1"></label>`;
  const page = (t, b) => { $("screen-content").innerHTML = `<div class="text-xl font-bold border-b border-current pb-1 mb-3">${t}</div>${b}`; };
  const grid = (h, c) => `<div class="grid grid-cols-1 md:grid-cols-${c || 3} gap-2 mb-3">${h}</div>`;
  const out = id => `<div id="${id}" class="dos-border p-3 text-sm" aria-live="polite"></div>`;
  const sel = (id, o, on) => `<select id="${id}" ${on ? `onchange="${on}"` : ""} class="dos-input w-full p-1">${o.map(x => `<option value="${x[0]}">${x[1]}</option>`).join("")}</select>`;

  /* ---------- 43: incerteza propagada ---------- */
  function rounded(z, u) {
    if (!(u > 0) || !isFinite(z)) return fmt(z);
    const e = Math.floor(Math.log10(u)), lead = Math.floor(u / Math.pow(10, e) + 1e-9), dec = lead === 1 ? 1 - e : -e;
    const p = Math.pow(10, dec), zr = Math.round(z * p) / p, ur = Math.round(u * p) / p;
    const s = v => (dec > 0 ? v.toFixed(dec) : String(Math.round(v))).replace(".", ",");
    return `${s(zr)} ± ${s(ur)}`;
  }
  function r43() {
    page("43. PROPAGAÇÃO DE INCERTEZAS", `<p class="text-sm mb-2">Combina medidas independentes (cada uma com sua incerteza padrão) e dá o resultado com o número correto de algarismos.</p>
      <label class="text-sm block mb-2">Operação ${sel("u-op", [["add", "z = x + y"], ["sub", "z = x − y"], ["mul", "z = x · y"], ["div", "z = x / y"], ["pow", "z = xⁿ (use o campo n)"], ["log", "z = log₁₀(x)"]])}</label>
      ${grid(fld("u-x", "x", "25.00") + fld("u-ux", "incerteza de x", "0.03") + fld("u-y", "y", "0.1000") + fld("u-uy", "incerteza de y", "0.0002") + fld("u-n", "n (potência)", "2"))}
      <button class="dos-btn mb-3" onclick="runUnc13()">CALCULAR</button>${out("u-res")}
      <p class="text-xs opacity-80 mt-2">Soma e subtração somam as incertezas absolutas em quadratura; produto e quociente somam as relativas em quadratura. Vale para erros aleatórios independentes. A incerteza expandida (k = 2) cobre cerca de 95 %.</p>`);
    runUnc13();
  }
  window.runUnc13 = function () {
    const op = $("u-op").value, x = NUM("u-x"), ux = Math.abs(NUM("u-ux")), y = NUM("u-y"), uy = Math.abs(NUM("u-uy")), n = NUM("u-n"), box = $("u-res");
    if (!isFinite(x) || !isFinite(ux) || (op !== "log" && op !== "pow" && (!isFinite(y) || !isFinite(uy)))) { box.textContent = "Preencha os valores e as incertezas."; return; }
    let z, u;
    if (op === "add" || op === "sub") { z = op === "add" ? x + y : x - y; u = Math.hypot(ux, uy); }
    else if (op === "mul" || op === "div") { if (!x || !y) { box.textContent = "x e y devem ser diferentes de zero."; return; } z = op === "mul" ? x * y : x / y; u = Math.abs(z) * Math.hypot(ux / x, uy / y); }
    else if (op === "pow") { if (!x || !isFinite(n)) { box.textContent = "Informe x ≠ 0 e n."; return; } z = Math.pow(x, n); u = Math.abs(z * n * ux / x); }
    else { if (!(x > 0)) { box.textContent = "x deve ser positivo."; return; } z = Math.log10(x); u = 0.4342944819 * ux / x; }
    box.innerHTML = `z = <strong>${rounded(z, u)}</strong> (incerteza padrão)<br>Incerteza relativa = ${fmt(100 * u / Math.abs(z))} % · expandida (k = 2): ± ${fmt(2 * u)}<br>Valor sem arredondar: ${fmt(z, 6)} ± ${fmt(u, 3)}`;
  };

  /* ---------- 44: cromatografia ---------- */
  function r44() {
    page("44. CROMATOGRAFIA: RETENÇÃO, EFICIÊNCIA E RESOLUÇÃO", `<p class="text-sm mb-2">Tempos em minutos (ou qualquer unidade igual). w = largura do pico na base.</p>
      ${grid(fld("h-tm", "t₀ (tempo morto)", "1.0") + fld("h-t1", "t_R do pico 1", "5.0") + fld("h-w1", "w do pico 1", "0.40") + fld("h-t2", "t_R do pico 2", "5.6") + fld("h-w2", "w do pico 2", "0.40") + fld("h-L", "Comprimento da coluna (cm)", "15"))}
      <button class="dos-btn mb-3" onclick="runChr13()">CALCULAR</button>${out("h-res")}
      <div class="font-bold mt-4 mb-1">Cromatografia em camada delgada (CCD)</div>
      ${grid(fld("h-d", "Distância do soluto (cm)", "3.0") + fld("h-s", "Distância da frente do solvente (cm)", "6.0"), 2)}
      <button class="dos-btn mb-3" onclick="runRf13()">CALCULAR Rf</button>${out("h-rf")}
      <p class="text-xs opacity-80 mt-2">k = (t_R − t₀)/t₀ · α = k₂/k₁ · N = 16(t_R/w)² · H = L/N · R_s = 2(t_R2 − t_R1)/(w₁ + w₂). R_s ≥ 1,5 indica separação até a linha de base.</p>`);
    runChr13(); runRf13();
  }
  window.runChr13 = function () {
    const t0 = NUM("h-tm"), a = NUM("h-t1"), wa = NUM("h-w1"), b = NUM("h-t2"), wb = NUM("h-w2"), L = NUM("h-L"), box = $("h-res");
    if (!(t0 > 0 && a > t0 && b > t0 && wa > 0 && wb > 0)) { box.textContent = "Os t_R devem ser maiores que t₀, e as larguras positivas."; return; }
    const k1 = (a - t0) / t0, k2 = (b - t0) / t0, N1 = 16 * (a / wa) ** 2, N2 = 16 * (b / wb) ** 2, Rs = +(2 * (b - a) / (wa + wb)).toFixed(6);
    box.innerHTML = `k₁ = ${fmt(k1)} · k₂ = ${fmt(k2)} · α = <strong>${fmt(k2 / k1)}</strong><br>N₁ = ${fmt(N1)} · N₂ = ${fmt(N2)}${L > 0 ? ` · H ≈ ${fmt(L * 10 / ((N1 + N2) / 2))} mm por prato` : ""}<br>R<sub>s</sub> = <strong>${fmt(Rs)}</strong> — ${Rs >= 1.5 ? "separação completa (linha de base)" : Rs >= 1 ? "separação parcial; sobreposição pequena" : "picos sobrepostos"}${k1 < 1 || k1 > 10 ? '<br><span class="text-yellow-300">k fora de 1–10: ajuste a fase móvel para melhorar a retenção.</span>' : ""}`;
  };
  window.runRf13 = function () {
    const d = NUM("h-d"), s = NUM("h-s"), box = $("h-rf");
    if (!(d >= 0 && s > 0 && d <= s)) { box.textContent = "A distância do soluto deve estar entre 0 e a da frente do solvente."; return; }
    box.innerHTML = `R<sub>f</sub> = ${fmt(d)} ÷ ${fmt(s)} = <strong>${fmt(d / s, 3)}</strong>${d / s < 0.1 || d / s > 0.9 ? " (ideal: 0,2 a 0,8; ajuste a polaridade do eluente)" : ""}`;
  };

  /* ---------- 45: configuração eletrônica ---------- */
  const ORD = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p"];
  const LN = { s: 0, p: 1, d: 2, f: 3 }, capOf = o => 2 * (2 * LN[o[1]] + 1);
  const EXC = { 24: { "4s": 1, "3d": 5 }, 29: { "4s": 1, "3d": 10 }, 41: { "5s": 1, "4d": 4 }, 42: { "5s": 1, "4d": 5 }, 44: { "5s": 1, "4d": 7 }, 45: { "5s": 1, "4d": 8 }, 46: { "5s": 0, "4d": 10 }, 47: { "5s": 1, "4d": 10 },
    57: { "4f": 0, "5d": 1 }, 58: { "4f": 1, "5d": 1 }, 64: { "4f": 7, "5d": 1 }, 78: { "6s": 1, "5d": 9 }, 79: { "6s": 1, "5d": 10 }, 89: { "5f": 0, "6d": 1 }, 90: { "5f": 0, "6d": 2 }, 91: { "5f": 2, "6d": 1 }, 92: { "5f": 3, "6d": 1 }, 93: { "5f": 4, "6d": 1 }, 96: { "5f": 7, "6d": 1 }, 103: { "6d": 0, "7p": 1 } };
  const madelung = e => { const c = {}; let r = e; ORD.forEach(o => { const k = Math.min(r, capOf(o)); if (k > 0) c[o] = k; r -= k; }); return c; };
  const byN = (a, b) => (+a[0] - +b[0]) || (LN[a[1]] - LN[b[1]]);
  const show = c => Object.keys(c).filter(o => c[o] > 0).sort(byN).map(o => o + "<sup>" + c[o] + "</sup>").join(" ");
  function config(Z, q) {
    const c = madelung(Z); if (EXC[Z]) Object.assign(c, EXC[Z]);
    for (let i = 0; i < q; i++) { const o = Object.keys(c).filter(k => c[k] > 0).sort((a, b) => (+b[0] - +a[0]) || (LN[b[1]] - LN[a[1]]))[0]; c[o]--; }
    for (let i = 0; i < -q; i++) { const o = ORD.find(k => (c[k] || 0) < capOf(k)); c[o] = (c[o] || 0) + 1; }
    return c;
  }
  function r45() {
    page("45. CONFIGURAÇÃO ELETRÔNICA E NÚMEROS QUÂNTICOS", `<p class="text-sm mb-2">Digite o símbolo (Fe) ou o número atômico (26) e, se quiser, a carga do íon.</p>
      ${grid(fld("e-el", "Elemento", "Fe") + fld("e-q", "Carga do íon (ex.: 2 para Fe²⁺, −1 para Cl⁻)", "0"), 2)}
      <button class="dos-btn mb-3" onclick="runCfg13()">CALCULAR</button>${out("e-res")}
      <p class="text-xs opacity-80 mt-2">Segue a regra de Madelung (n + l), Pauli e Hund, com as exceções experimentais (Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag, La, Ce, Gd, Pt, Au e actinídeos). Cátions perdem elétrons primeiro da camada de maior n (4s antes de 3d).</p>`);
    runCfg13();
  }
  window.runCfg13 = function () {
    const raw = String($("e-el").value).trim(), q = parseInt(NUM("e-q")) || 0, box = $("e-res");
    if (typeof RAW_ELEMENTS === "undefined") { box.textContent = "Dados dos elementos indisponíveis."; return; }
    const el = RAW_ELEMENTS.find(e => String(e[0]) === raw || e[1].toLowerCase() === raw.toLowerCase() || e[2].toLowerCase() === raw.toLowerCase());
    if (!el) { box.textContent = "Elemento não encontrado: use o símbolo, o nome ou o número atômico (1–118)."; return; }
    const Z = el[0], n = Z - q;
    if (n < 0 || n > 120) { box.textContent = "Carga incompatível com o número atômico."; return; }
    const c = config(Z, q), occ = Object.keys(c).filter(o => c[o] > 0);
    let core = null; [[86, "Rn"], [54, "Xe"], [36, "Kr"], [18, "Ar"], [10, "Ne"], [2, "He"]].some(g => { if (g[0] < n) { core = g; return true; } });
    let abbr = show(c);
    if (core) { const cc = madelung(core[0]), rest = {}; occ.forEach(o => { const d = c[o] - (cc[o] || 0); if (d > 0) rest[o] = d; }); abbr = `[${core[1]}] ${show(rest)}`; }
    let unp = 0; occ.forEach(o => { const m = 2 * LN[o[1]] + 1; unp += c[o] <= m ? c[o] : 2 * m - c[o]; });
    const top = occ.sort((a, b) => ((+b[0] + LN[b[1]]) - (+a[0] + LN[a[1]])) || (+b[0] - +a[0]))[0], l = LN[top[1]], m = 2 * l + 1, k = c[top];
    const ml = k <= m ? -l + k - 1 : -l + (k - m) - 1, ms = k <= m ? "+½" : "−½", nmax = Math.max(...occ.map(o => +o[0]));
    const val = occ.filter(o => +o[0] === nmax).reduce((s, o) => s + c[o], 0);
    box.innerHTML = `<strong>${el[2]} (${el[1]}${q ? (q > 0 ? (q > 1 ? q : "") + "⁺" : (q < -1 ? -q : "") + "⁻") : ""}), Z = ${Z}, ${n} elétrons</strong><br>Completa: ${show(c)}<br>Abreviada: ${abbr}${EXC[Z] && !q ? ' <span class="opacity-70">(exceção experimental à regra de Madelung)</span>' : ""}<br>Elétrons na camada n = ${nmax}: ${val} · desemparelhados: <strong>${unp}</strong> (${unp ? "paramagnético" : "diamagnético"})<br>Elétron de maior energia (${top}): n = ${top[0]}, ℓ = ${l}, mℓ = ${ml}, mₛ = ${ms}`;
  };

  /* ---------- 46: energia de ligação ---------- */
  const BND = [["H–H", 436], ["C–H", 413], ["C–C", 347], ["C=C", 614], ["C≡C", 839], ["C–O", 358], ["C=O", 799], ["C–N", 305], ["C≡N", 891], ["O–H", 467], ["N–H", 391], ["O=O", 498], ["N≡N", 945], ["O–O", 146], ["Cl–Cl", 243], ["H–Cl", 431], ["H–F", 567], ["F–F", 159], ["H–Br", 366], ["Br–Br", 193], ["C–Cl", 328]];
  const PRE = { ch4: [{ "C–H": 4, "O=O": 2 }, { "C=O": 2, "O–H": 4 }], hcl: [{ "H–H": 1, "Cl–Cl": 1 }, { "H–Cl": 2 }], nh3: [{ "N≡N": 1, "H–H": 3 }, { "N–H": 6 }], eteno: [{ "C=C": 1, "H–H": 1 }, { "C–C": 1, "C–H": 2 }] };
  function r46() {
    page("46. ENTALPIA DE REAÇÃO POR ENERGIAS DE LIGAÇÃO", `<p class="text-sm mb-2">ΔH ≈ Σ(ligações quebradas) − Σ(ligações formadas). Estimativa para fase gasosa, com energias médias.</p>
      <label class="text-sm block mb-2">Exemplo pronto ${sel("b-p", [["", "— personalizado —"], ["ch4", "CH₄ + 2 O₂ → CO₂ + 2 H₂O (combustão)"], ["hcl", "H₂ + Cl₂ → 2 HCl"], ["nh3", "N₂ + 3 H₂ → 2 NH₃ (Haber)"], ["eteno", "C₂H₄ + H₂ → C₂H₆ (hidrogenação)"]], "setBond13()")}</label>
      <div class="overflow-x-auto mb-3"><table class="w-full text-sm"><thead><tr><th class="text-left p-1">Ligação</th><th class="text-left p-1">kJ/mol</th><th class="text-left p-1">Quebradas</th><th class="text-left p-1">Formadas</th></tr></thead><tbody>${BND.map((b, i) => `<tr><td class="p-1">${b[0]}</td><td class="p-1">${b[1]}</td><td class="p-1"><input id="bq${i}" type="number" min="0" value="0" class="dos-input w-16 p-1"></td><td class="p-1"><input id="bf${i}" type="number" min="0" value="0" class="dos-input w-16 p-1"></td></tr>`).join("")}</tbody></table></div>
      <button class="dos-btn mb-3" onclick="runBond13()">CALCULAR ΔH</button>${out("b-res")}
      <p class="text-xs opacity-80 mt-2">Valores médios de tabela: o resultado difere do ΔH real em cerca de 5–15 %, e mais ainda se houver líquidos ou sólidos.</p>`);
    $("b-p").value = "ch4"; setBond13();
  }
  window.setBond13 = function () {
    const p = PRE[$("b-p").value]; BND.forEach((b, i) => { $("bq" + i).value = p ? (p[0][b[0]] || 0) : 0; $("bf" + i).value = p ? (p[1][b[0]] || 0) : 0; }); runBond13();
  };
  window.runBond13 = function () {
    let q = 0, f = 0; BND.forEach((b, i) => { q += b[1] * (parseInt($("bq" + i).value) || 0); f += b[1] * (parseInt($("bf" + i).value) || 0); });
    $("b-res").innerHTML = (q || f) ? `Quebradas: ${q} kJ · formadas: ${f} kJ<br>ΔH ≈ <strong>${q - f} kJ/mol</strong> — ${q - f < 0 ? "exotérmica" : q - f > 0 ? "endotérmica" : "termoneutra"}` : "Informe as ligações quebradas e formadas, ou escolha um exemplo.";
  };

  /* ---------- 47: receitas de tampão ---------- */
  const BUF = { ac: ["Acetato", 4.76, "ácido acético glacial", 60.05, "acetato de sódio anidro", 82.03], ph: ["Fosfato", 7.20, "NaH₂PO₄ anidro", 119.98, "Na₂HPO₄ anidro", 141.96], tris: ["TRIS", 8.07, "TRIS·HCl", 157.60, "TRIS base", 121.14], bic: ["Carbonato", 10.33, "NaHCO₃", 84.01, "Na₂CO₃ anidro", 105.99] };
  function r47() {
    page("47. RECEITAS DE TAMPÃO (QUANTO PESAR)", `<p class="text-sm mb-2">Escolha o sistema, o pH, a concentração total e o volume. O módulo usa Henderson-Hasselbalch e calcula as massas das duas formas.</p>
      <label class="text-sm block mb-2">Sistema ${sel("t-s", Object.keys(BUF).map(k => [k, `${BUF[k][0]} (pKa ${BUF[k][1]})`]))}</label>
      ${grid(fld("t-ph", "pH desejado", "7.40") + fld("t-c", "Concentração total (mol/L)", "0.05") + fld("t-v", "Volume (mL)", "500"))}
      <button class="dos-btn mb-3" onclick="runBuf13()">CALCULAR RECEITA</button>${out("t-res")}
      <p class="text-xs opacity-80 mt-2">Dissolva em ≈ 80 % do volume, confira o pH com o pHmetro (ajuste com ácido ou base forte) e complete o volume no balão. Se usar sais hidratados, corrija a massa molar. O pKa do TRIS cai cerca de 0,03 por °C.</p>`);
    $("t-s").value = "ph"; runBuf13();
  }
  window.runBuf13 = function () {
    const s = BUF[$("t-s").value], ph = NUM("t-ph"), C = NUM("t-c"), V = NUM("t-v"), box = $("t-res");
    if (!(isFinite(ph) && C > 0 && V > 0)) { box.textContent = "Informe pH, concentração e volume positivos."; return; }
    const r = Math.pow(10, ph - s[1]), fb = r / (1 + r), n = C * V / 1000, nb = n * fb, na = n - nb;
    box.innerHTML = `Razão base/ácido = ${fmt(r)} (${fmt(100 * fb)} % na forma básica)<br><strong>${fmt(na * s[3])} g</strong> de ${s[2]} (${fmt(na * 1000)} mmol)<br><strong>${fmt(nb * s[5])} g</strong> de ${s[4]} (${fmt(nb * 1000)} mmol)` + (Math.abs(ph - s[1]) > 1 ? '<br><span class="text-yellow-300">pH fora de pKa ± 1: a capacidade tamponante é baixa. Escolha outro sistema.</span>' : "");
  };

  /* ---------- 48: caderno de laboratório ---------- */
  const KEY = "chemos13-notebook";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } };
  const save = a => { try { localStorage.setItem(KEY, JSON.stringify(a.slice(0, 200))); return true; } catch (e) { return false; } };
  const plain = el => { const d = document.createElement("div"); d.innerHTML = el.innerHTML.replace(/<br\s*\/?>/gi, "\n"); return d.textContent.trim(); };
  function toast(m) { if (typeof showToast === "function") showToast(m); }
  const lbl = e => { const l = e.closest("label"); if (l) { const k = l.cloneNode(true); k.querySelectorAll("select,input,textarea").forEach(x => x.remove()); return k.textContent.replace(/\s+/g, " ").trim().slice(0, 40); } return e.getAttribute("aria-label") || e.id; };
  function snapshot(sc) {
    const c = sc.cloneNode(true); c.querySelectorAll("details,button,script,style,svg,canvas,select,input,textarea,.mod-desc,.crumb").forEach(e => e.remove());
    const v = [...sc.querySelectorAll("input,select,textarea")].filter(e => e.id !== "cli-input" && e.type !== "hidden" && e.type !== "range" && e.value !== "").slice(0, 10).map(e => lbl(e) + " = " + (e.tagName === "SELECT" ? e.options[e.selectedIndex].text : e.value));
    return (v.length ? "Entradas: " + v.join("; ") + "\n" : "") + c.textContent.replace(/\s+/g, " ").trim().slice(0, 1200);
  }
  function addButtons() {
    const sc = $("screen-content"); if (!sc) return;
    sc.querySelectorAll('[id$="-result"]').forEach(e => { if (!e.hasAttribute("aria-live")) e.setAttribute("aria-live", "polite"); }); // anuncia resultados e habilita + CADERNO
    const fav = sc.querySelector("#fav-toggle"), cur = sc.querySelector(".text-xl");
    if (fav && !fav.dataset.nb && cur && !/^48\./.test(cur.textContent.trim())) {
      fav.dataset.nb = "1"; const b = document.createElement("button"); b.className = "dos-btn"; b.textContent = "+ CADERNO"; b.setAttribute("aria-label", "Guardar esta tela no caderno");
      b.onclick = () => { const a = load(); a.unshift({ t: cur.textContent.trim(), x: snapshot(sc), d: Date.now() }); toast(save(a) ? "Tela guardada no caderno" : "Não foi possível guardar (armazenamento bloqueado)"); };
      fav.insertAdjacentElement("afterend", b);
    }
    sc.querySelectorAll('[aria-live="polite"]').forEach(box => {
      if (box.dataset.nb || !box.id || box.closest("#nb-list")) return; box.dataset.nb = "1";
      const b = document.createElement("button"); b.className = "dos-btn text-xs mt-1"; b.textContent = "+ CADERNO"; b.setAttribute("aria-label", "Guardar este resultado no caderno");
      b.onclick = () => { const t = plain(box).slice(0, 1500); if (!t || t.length < 4) return; const h = sc.querySelector(".text-xl"), a = load(); a.unshift({ t: h ? h.textContent.trim() : "Resultado", x: t, d: Date.now() }); toast(save(a) ? "Guardado no caderno" : "Não foi possível guardar (armazenamento bloqueado)"); };
      box.insertAdjacentElement("afterend", b);
    });
  }
  function r48() {
    const a = load(); page("48. CADERNO DE LABORATÓRIO", `<p class="text-sm mb-2">Guarde resultados com o botão <strong>+ CADERNO</strong> (barra superior de qualquer módulo e abaixo dos resultados dos módulos 35–47) e consulte tudo aqui. Os dados ficam só neste navegador.</p>
      <div class="flex flex-wrap gap-2 mb-3"><button class="dos-btn" id="nb-dl">BAIXAR .TXT</button><button class="dos-btn" id="nb-pdf">IMPRIMIR / SALVAR PDF</button><button class="dos-btn" id="nb-clr">LIMPAR TUDO</button></div><div id="nb-list"></div>`);
    const L = $("nb-list");
    if (!a.length) L.textContent = "Caderno vazio. Faça um cálculo e use + CADERNO.";
    a.forEach((e, i) => { const w = document.createElement("div"); w.className = "dos-border p-2 mb-2"; const h = document.createElement("div"); h.className = "text-xs opacity-70"; h.textContent = new Date(e.d).toLocaleString("pt-BR") + " · " + e.t; const p = document.createElement("div"); p.className = "text-sm whitespace-pre-wrap"; p.textContent = e.x; const r = document.createElement("button"); r.className = "dos-btn text-xs mt-1"; r.textContent = "remover"; r.onclick = () => { const z = load(); z.splice(i, 1); save(z); r48(); }; w.append(h, p, r); L.append(w); });
    $("nb-dl").onclick = () => { const z = load(); if (!z.length) return; const u = URL.createObjectURL(new Blob([z.map(e => `[${new Date(e.d).toLocaleString("pt-BR")}] ${e.t}\n${e.x}`).join("\n\n---\n\n")], { type: "text/plain;charset=utf-8" })), l = document.createElement("a"); l.href = u; l.download = "caderno-chemos.txt"; l.click(); setTimeout(() => URL.revokeObjectURL(u), 1000); };
    $("nb-pdf").onclick = () => {
      const z = load(); if (!z.length) return;
      const w = window.open("", "_blank"); if (!w) { toast("Permita pop-ups para exportar o PDF"); return; }
      const esc = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      w.document.write('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Caderno CHEM.OS</title><style>body{font:14px/1.5 system-ui,sans-serif;margin:24px;color:#111}h1{font-size:20px}.e{border:1px solid #999;border-radius:6px;padding:8px 10px;margin:0 0 10px;page-break-inside:avoid}.m{font-size:11px;color:#555}pre{white-space:pre-wrap;font:13px/1.45 ui-monospace,monospace;margin:4px 0 0}</style><h1>Caderno de laboratório — CHEM.OS</h1>' + z.map(e => '<div class="e"><div class="m">' + esc(new Date(e.d).toLocaleString("pt-BR")) + " · " + esc(e.t) + "</div><pre>" + esc(e.x) + "</pre></div>").join("") + "<script>setTimeout(function(){window.print()},300)<\/script></html>");
      w.document.close();
    };
    $("nb-clr").onclick = () => { if (load().length && confirm("Apagar todo o caderno?")) { save([]); r48(); } };
  }
  let nbT; new MutationObserver(() => { clearTimeout(nbT); nbT = setTimeout(addButtons, 60); }).observe(document.body, { childList: true, subtree: true });

  const R3 = { 43: r43, 44: r44, 45: r45, 46: r46, 47: r47, 48: r48 }, orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    const n = parseInt(id);
    if (R3[n]) { if (typeof playBeep === "function") playBeep(700, 0.04); R3[n](); if (typeof screenAnimateIn === "function") screenAnimateIn(); return; }
    orig(id);
  };
  window.ChemTools13 = { config, rounded };
})();
