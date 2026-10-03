/* v9.1 — "Passo a passo" dos resultados (módulos 1, 3, 4, 5, 6, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18 e 19).
   Refaz o cálculo de forma independente a partir dos campos, mostra a fórmula, a substituição e as unidades,
   e só aparece se o resultado independente concordar (±1 %) com o que o módulo exibiu. */
(function () {
  const $ = id => document.getElementById(id);
  const v = id => { const el = $(id); const s = el ? String(el.value).trim().replace(",", ".") : ""; return s === "" ? NaN : parseFloat(s); };
  const f = x => { if (!isFinite(x)) return "—"; const a = Math.abs(x); return (a >= 1e5 || (a > 0 && a < 1e-3) ? x.toExponential(3) : String(+x.toPrecision(5))).replace(".", (window.ChemUX && window.ChemUX.S.sep === "auto") ? "." : ","); };
  const R_ATM = 0.082057, R_J = 8.314462618, F = 96485.33212;

  const STEPS = {
    5: () => { // C1·V1 = C2·V2
      const k = ["d-c1", "d-v1", "d-c2", "d-v2"], x = k.map(v), blank = x.map((a, i) => isNaN(a) ? i : -1).filter(i => i >= 0);
      if (blank.length !== 1 || x.some(a => !isNaN(a) && a <= 0)) return null;
      const [c1, v1, c2, v2] = x, names = ["C₁", "V₁", "C₂", "V₂"], units = ["mol/L", "mL", "mol/L", "mL"], i = blank[0];
      const calc = [c2 * v2 / v1, c2 * v2 / c1, c1 * v1 / v2, c1 * v1 / c2][i];
      const form = ["C₁ = (C₂ · V₂) ÷ V₁", "V₁ = (C₂ · V₂) ÷ C₁", "C₂ = (C₁ · V₁) ÷ V₂", "V₂ = (C₁ · V₁) ÷ C₂"][i];
      const sub = [`(${f(c2)} × ${f(v2)}) ÷ ${f(v1)}`, `(${f(c2)} × ${f(v2)}) ÷ ${f(c1)}`, `(${f(c1)} × ${f(v1)}) ÷ ${f(v2)}`, `(${f(c1)} × ${f(v1)}) ÷ ${f(c2)}`][i];
      return { results: [calc], steps: ["Na diluição o número de mols do soluto não muda: <strong>C₁ · V₁ = C₂ · V₂</strong>.", `A incógnita é <strong>${names[i]}</strong> (campo vazio).`, `Isole: ${form}.`, `Substitua: ${names[i]} = ${sub} = <strong>${f(calc)} ${units[i]}</strong>.`] };
    },
    4: () => { // m = C·V·M ÷ pureza
      const M = v("p-mm"), C = v("p-conc"), V = v("p-vol"); let p = v("p-purity"); if (isNaN(p)) p = 100;
      if ([M, C, V].some(a => !(a > 0)) || !(p > 0 && p <= 100)) return null;
      const L = V / 1000, n = C * L, m = n * M, mr = m / (p / 100);
      return { results: [mr, m], steps: [`Converta o volume: V = ${f(V)} mL ÷ 1000 = <strong>${f(L)} L</strong>.`, `Mols de soluto: n = C · V = ${f(C)} × ${f(L)} = <strong>${f(n)} mol</strong>.`, `Massa pura: m = n · M = ${f(n)} × ${f(M)} = <strong>${f(m)} g</strong>.`, p < 100 ? `Corrija pela pureza: m<sub>real</sub> = ${f(m)} ÷ ${f(p / 100)} = <strong>${f(mr)} g</strong>.` : "Pureza de 100 %: não há correção. Pese <strong>" + f(m) + " g</strong>."] };
    },
    6: () => { // ácido fraco
      const C = v("wa-conc"), Ka = v("wa-ka"); if (!(C > 0 && Ka > 0)) return null;
      const d = Ka * Ka + 4 * Ka * C, x = (-Ka + Math.sqrt(d)) / 2, pH = -Math.log10(x);
      return { results: [pH, x], steps: ["Equilíbrio: HA ⇌ H⁺ + A⁻, com <strong>Ka = x² ÷ (C − x)</strong>, em que x = [H⁺].", "Rearranjando: x² + Ka·x − Ka·C = 0.", `Discriminante: Δ = Ka² + 4·Ka·C = ${f(d)}.`, `x = (−Ka + √Δ) ÷ 2 = <strong>${f(x)} mol/L</strong>.`, `pH = −log x = <strong>${f(pH)}</strong>. Ionização: α = x ÷ C = ${f(100 * x / C)} %.`] };
    },
    10: () => { // tampão
      const pKa = v("buf-pka"), b = v("buf-base"), a = v("buf-acid"); if (isNaN(pKa) || !(b > 0 && a > 0)) return null;
      const r = b / a, pH = pKa + Math.log10(r);
      return { results: [pH, r], steps: ["Equação de Henderson-Hasselbalch: <strong>pH = pKa + log([base] ÷ [ácido])</strong>.", `Razão: [base] ÷ [ácido] = ${f(b)} ÷ ${f(a)} = <strong>${f(r)}</strong>.`, `log(${f(r)}) = ${f(Math.log10(r))}.`, `pH = ${f(pKa)} + ${f(Math.log10(r))} = <strong>${f(pH)}</strong>.`] };
    },
    11: () => { // PV = nRT
      const ids = ["gi-p", "gi-v", "gi-n", "gi-t"], x = ids.map(v), blank = x.map((a, i) => isNaN(a) ? i : -1).filter(i => i >= 0);
      if (blank.length !== 1 || x.some(a => !isNaN(a) && a <= 0)) return null;
      const [P, V, n, T] = x, i = blank[0], R = R_ATM;
      const calc = [n * R * T / V, n * R * T / P, P * V / (R * T), P * V / (n * R)][i];
      const nm = ["P", "V", "n", "T"][i], un = ["atm", "L", "mol", "K"][i];
      const form = ["P = nRT ÷ V", "V = nRT ÷ P", "n = PV ÷ RT", "T = PV ÷ nR"][i];
      const sub = [`${f(n)} × ${R} × ${f(T)} ÷ ${f(V)}`, `${f(n)} × ${R} × ${f(T)} ÷ ${f(P)}`, `${f(P)} × ${f(V)} ÷ (${R} × ${f(T)})`, `${f(P)} × ${f(V)} ÷ (${f(n)} × ${R})`][i];
      return { results: [calc], steps: ["Lei dos gases ideais: <strong>PV = nRT</strong>, com R = 0,082057 L·atm/(mol·K) e T em kelvin.", `A incógnita é <strong>${nm}</strong> (campo vazio).`, `Isole: ${form}.`, `Substitua: ${nm} = ${sub} = <strong>${f(calc)} ${un}</strong>.`] };
    },
    12: () => { // Nernst
      const E0 = v("ner-e0"), n = v("ner-n"), Q = v("ner-q"), T = v("ner-t"); if (isNaN(E0) || !(n > 0 && Q > 0 && T > 0)) return null;
      const k = R_J * T / (n * F), lnQ = Math.log(Q), E = E0 - k * lnQ;
      return { results: [E], steps: ["Equação de Nernst: <strong>E = E° − (R·T ÷ n·F) · ln Q</strong>, com R = 8,314 J/(mol·K) e F = 96485 C/mol.", `R·T ÷ (n·F) = (8,314 × ${f(T)}) ÷ (${f(n)} × 96485) = ${f(k)} V.`, `ln Q = ln(${f(Q)}) = ${f(lnQ)}.`, `E = ${f(E0)} − ${f(k)} × ${f(lnQ)} = <strong>${f(E)} V</strong>.`] };
    }
  };
  Object.assign(STEPS, {
    14: () => { // cinética de ordem 0, 1 ou 2
      const o = v("kin-order"), k = v("kin-k"), A0 = v("kin-a0"), t = v("kin-t"); if (![0, 1, 2].includes(o) || !(k > 0 && A0 > 0)) return null;
      const th = [A0 / (2 * k), Math.LN2 / k, 1 / (k * A0)][o], thF = ["t½ = [A]₀ ÷ (2k)", "t½ = ln 2 ÷ k", "t½ = 1 ÷ (k · [A]₀)"][o];
      const thS = [`${f(A0)} ÷ (2 × ${f(k)})`, `0,6931 ÷ ${f(k)}`, `1 ÷ (${f(k)} × ${f(A0)})`][o];
      const steps = [`Ordem ${o}: ${["[A] = [A]₀ − k·t", "ln[A] = ln[A]₀ − k·t, ou seja, [A] = [A]₀ · e^(−k·t)", "1/[A] = 1/[A]₀ + k·t"][o]}.`, `Meia-vida: ${thF} = ${thS} = <strong>${f(th)}</strong>.`], res = [th];
      if (t >= 0) { const A = [A0 - k * t, A0 * Math.exp(-k * t), 1 / (1 / A0 + k * t)][o]; res.push(A); steps.push(`Concentração em t = ${f(t)}: [A] = <strong>${f(A)} mol/L</strong> (substituindo k = ${f(k)} e [A]₀ = ${f(A0)}).`); }
      return { results: res, steps };
    },
    17: () => { // Beer-Lambert: A = ε·b·c
      const ids = ["bl-a", "bl-eps", "bl-b", "bl-c"], x = ids.map(v), blank = x.map((a, i) => isNaN(a) ? i : -1).filter(i => i >= 0);
      if (blank.length !== 1 || x.some(a => !isNaN(a) && a < 0)) return null;
      const [A, e, b, c] = x, i = blank[0]; if (i !== 0 && A === 0) return null;
      const calc = [e * b * c, A / (b * c), A / (e * c), A / (e * b)][i], nm = ["A", "ε", "b", "c"][i], un = ["(adimensional)", "L/(mol·cm)", "cm", "mol/L"][i];
      const form = ["A = ε · b · c", "ε = A ÷ (b · c)", "b = A ÷ (ε · c)", "c = A ÷ (ε · b)"][i];
      const sub = [`${f(e)} × ${f(b)} × ${f(c)}`, `${f(A)} ÷ (${f(b)} × ${f(c)})`, `${f(A)} ÷ (${f(e)} × ${f(c)})`, `${f(A)} ÷ (${f(e)} × ${f(b)})`][i];
      return { results: [calc], steps: ["Lei de Beer-Lambert: <strong>A = ε · b · c</strong> (ε em L/(mol·cm), b em cm, c em mol/L).", `A incógnita é <strong>${nm}</strong> (campo vazio).`, `Fórmula: ${form}.`, `Substitua: ${nm} = ${sub} = <strong>${f(calc)} ${un}</strong>.`] };
    },
    19: () => { // solubilidade a partir do Kps (sem íon comum)
      const p = v("ksp-p"), q = v("ksp-q"), K = v("ksp-value"), cm = v("ksp-common"); if (!(p >= 1 && q >= 1 && K > 0) || (cm > 0)) return null;
      const den = Math.pow(p, p) * Math.pow(q, q), s = Math.pow(K / den, 1 / (p + q));
      return { results: [s], steps: [`Dissociação: AₚBq com p = ${f(p)} e q = ${f(q)}. Em água pura: [A] = ${f(p)}·s e [B] = ${f(q)}·s.`, `Kps = [A]ᵖ · [B]ᵠ = (${f(p)}s)^${f(p)} · (${f(q)}s)^${f(q)} = ${f(den)} · s^${f(p + q)}.`, `Isole s: s = (Kps ÷ ${f(den)})^(1 ÷ ${f(p + q)}) = (${f(K)} ÷ ${f(den)})^(1/${f(p + q)}).`, `Resultado: s = <strong>${f(s)} mol/L</strong>.`] };
    },
    16: () => { // titulação forte-forte: equivalência
      const ca = v("tit-ca"), va = v("tit-va"), cb = v("tit-cb"); if (![ca, va, cb].every(a => a > 0)) return null;
      const n = ca * va / 1000, ve = n / cb * 1000;
      return { results: [ve], steps: [`Mols de ácido: n = C · V = ${f(ca)} × ${f(va)} mL ÷ 1000 = ${f(n)} mol.`, "No equivalente, n(ácido) = n(base), com 1:1 de proporção.", `V<sub>eq</sub> = n ÷ C<sub>base</sub> = ${f(n)} ÷ ${f(cb)} × 1000 = <strong>${f(ve)} mL</strong>.`, "Ácido forte + base forte: no equivalente só há sal neutro e água, então pH = 7,00 (25 °C)."] };
    },
    18: () => { // titulação de ácido fraco: equivalência e pH no equivalente
      const ca = v("tf-ca"), va = v("tf-va"), Ka = v("tf-ka"), cb = v("tf-cb"); if (![ca, va, Ka, cb].every(a => a > 0)) return null;
      const n = ca * va / 1000, ve = n / cb * 1000, A = n / ((va + ve) / 1000), Kb = 1e-14 / Ka, OH = Math.sqrt(Kb * A), pH = 14 + Math.log10(OH);
      return { results: [ve, pH], steps: [`Mols de ácido: n = ${f(ca)} × ${f(va)} ÷ 1000 = ${f(n)} mol; V<sub>eq</sub> = n ÷ C<sub>base</sub> = <strong>${f(ve)} mL</strong>.`, `No equivalente só resta a base conjugada A⁻: [A⁻] = n ÷ (V<sub>ácido</sub> + V<sub>eq</sub>) = ${f(A)} mol/L.`, `Kb = Kw ÷ Ka = 1×10⁻¹⁴ ÷ ${f(Ka)} = ${f(Kb)}.`, `[OH⁻] = √(Kb · [A⁻]) = ${f(OH)} mol/L, logo pOH = ${f(-Math.log10(OH))}.`, `pH = 14 − pOH = <strong>${f(pH)}</strong> (básico). Na metade do caminho (${f(ve / 2)} mL), pH = pKa = ${f(-Math.log10(Ka))}.`] };
    }
  });
  Object.assign(STEPS, {
    3: () => { // massa molar
      const el = $("molar-input"); if (!el || typeof parseFormula !== "function" || typeof ATOMIC_WEIGHTS === "undefined") return null;
      const r = parseFormula(String(el.value).trim()); if (!r || !r.counts || !Object.keys(r.counts).length) return null;
      const rows = Object.entries(r.counts).map(([e, n]) => ({ e, n, w: ATOMIC_WEIGHTS[e], t: n * ATOMIC_WEIGHTS[e] })); if (rows.some(x => !x.w)) return null;
      const total = rows.reduce((a, x) => a + x.t, 0);
      return { results: [total], steps: ["Conte os átomos de cada elemento na fórmula (parênteses e hidratos multiplicam as quantidades).", ...rows.map(x => `${x.e}: ${f(x.n)} × ${f(x.w)} g/mol = ${f(x.t)} g/mol`), `Some tudo: M = ${rows.map(x => f(x.t)).join(" + ")} = <strong>${f(total)} g/mol</strong>.`] };
    },
    9: () => { // ΔG = ΔH − T·ΔS, a partir de ΔH° e ΔS° mostrados no resultado
      const box = $("thermo-result"), T = v("thermo-temp"); if (!box || !(T > 0)) return null;
      const t = box.textContent, num = re => { const m = t.match(re); return m ? parseFloat(m[1].replace("−", "-").replace(",", ".")) : NaN; };
      const H = num(/ΔH°[^=]*=\s*([-−]?[\d.,]+)/), S = num(/ΔS°[^=]*=\s*([-−]?[\d.,]+)/); // aceita vírgula ou ponto (ajuste de separador decimal) if (isNaN(H) || isNaN(S)) return null;
      const G = H - T * S / 1000;
      return { results: [G], steps: ["ΔH° = Σ ΔHf°(produtos) − Σ ΔHf°(reagentes) e ΔS° = Σ S°(produtos) − Σ S°(reagentes), com valores tabelados (mostrados acima).", `Converta ΔS° para kJ: ${f(S)} J/(mol·K) ÷ 1000 = ${f(S / 1000)} kJ/(mol·K).`, `ΔG° = ΔH° − T · ΔS° = ${f(H)} − (${f(T)} × ${f(S / 1000)}) = <strong>${f(G)} kJ/mol</strong>.`, G < 0 ? "ΔG° < 0: a reação é espontânea nessa temperatura (nas condições padrão)." : "ΔG° > 0: a reação não é espontânea nessa temperatura (nas condições padrão)."] };
    },
    15: () => { // Kc
      const eq = $("eq-kc-eq"), cs = $("eq-kc-concs"); if (!eq || !cs || /\((s|l)\)/i.test(eq.value)) return null;
      const sides = eq.value.split(/->|→|⇌|<->|=/); if (sides.length !== 2) return null;
      const parse = s => s.split("+").map(x => { const m = x.trim().match(/^(\d*)\s*(.+)$/); return m ? { c: m[1] ? +m[1] : 1, sp: m[2].trim() } : null; });
      const R = parse(sides[0]), P = parse(sides[1]), conc = cs.value.split(/[,;]/).map(x => parseFloat(x.trim().replace(",", ".")));
      if (R.concat(P).some(x => !x) || conc.length !== R.length + P.length || conc.some(x => !(x > 0))) return null;
      R.forEach((x, i) => x.v = conc[i]); P.forEach((x, i) => x.v = conc[R.length + i]);
      const pw = x => x.c === 1 ? `[${x.sp}]` : `[${x.sp}]^${x.c}`, num = P.reduce((a, x) => a * Math.pow(x.v, x.c), 1), den = R.reduce((a, x) => a * Math.pow(x.v, x.c), 1), K = num / den;
      return { results: [K], steps: [`Expressão: <strong>Kc = ${P.map(pw).join("·")} ÷ (${R.map(pw).join("·")})</strong> (produtos no numerador, reagentes no denominador, coeficientes como expoentes).`, `Substitua: Kc = ${P.map(x => `${f(x.v)}^${x.c}`).join(" × ")} ÷ (${R.map(x => `${f(x.v)}^${x.c}`).join(" × ")}) = ${f(num)} ÷ ${f(den)}.`, `Kc = <strong>${f(K)}</strong>.`, K > 1 ? "Kc > 1: no equilíbrio há mais produtos que reagentes." : "Kc < 1: no equilíbrio há mais reagentes que produtos."] };
    }
  });
  Object.assign(STEPS, {
    8: () => { // estequiometria: reagente limitante e massa teórica
      const eq = $("stoich-eq"), ms = $("stoich-masses"); if (!eq || !ms || typeof parseFormula !== "function") return null;
      const sides = eq.value.split(/->|→|⇌|<->|=/); if (sides.length !== 2) return null;
      const parse = s => s.split("+").map(x => { const m = x.trim().match(/^(\d*)\s*(.+)$/); if (!m) return null; const sp = m[2].replace(/\((g|l|s|aq)\)/gi, "").trim(), r = parseFormula(sp); return r && r.totalMass > 0 ? { c: m[1] ? +m[1] : 1, sp, M: r.totalMass } : null; });
      const R = parse(sides[0]), P = parse(sides[1]), m = ms.value.split(/[,;]/).map(x => parseFloat(x.trim().replace(",", ".")));
      if (R.concat(P).some(x => !x) || m.length !== R.length || m.some(x => !(x > 0))) return null;
      R.forEach((x, i) => { x.m = m[i]; x.n = x.m / x.M; x.r = x.n / x.c; });
      const lim = R.reduce((a, x) => x.r < a.r ? x : a, R[0]);
      const prods = P.map(p => ({ ...p, mass: lim.r * p.c * p.M }));
      return { results: R.map(x => x.n).concat(prods.map(p => p.mass)), steps: ["Converta cada massa em mols: <strong>n = m ÷ M</strong>.", ...R.map(x => `${x.sp}: ${f(x.m)} g ÷ ${f(x.M)} g/mol = ${f(x.n)} mol`),
        "Divida pelo coeficiente da equação balanceada: o menor valor indica o <strong>reagente limitante</strong>.", ...R.map(x => `${x.sp}: ${f(x.n)} ÷ ${x.c} = ${f(x.r)}${x === lim ? " ← menor" : ""}`),
        `Reagente limitante: <strong>${lim.sp}</strong>.`, ...prods.map(p => `Massa teórica de ${p.sp}: ${f(lim.r)} × ${p.c} × ${f(p.M)} g/mol = <strong>${f(p.mass)} g</strong>`)] };
    }
  });
  Object.assign(STEPS, {
    1: () => { // balanceador: conferência da conservação dos átomos
      const box = $("eq-result"); if (!box || typeof parseFormula !== "function") return null;
      const line = [...box.querySelectorAll("div")].find(d => d.textContent.includes("➔")); if (!line) return null;
      const sub = "₀₁₂₃₄₅₆₇₈₉", norm = t => t.replace(/[₀-₉]/g, c => sub.indexOf(c)), sides = norm(line.textContent).split("➔"); if (sides.length !== 2) return null;
      const parse = s => s.split("+").map(x => { const m = x.trim().match(/^(\d*)\s*(.+)$/); const r = m && parseFormula(m[2].replace(/\((g|l|s|aq)\)/gi, "").trim()); return r && r.counts ? { c: m[1] ? +m[1] : 1, sp: m[2].trim(), counts: r.counts } : null; });
      const L = parse(sides[0]), R = parse(sides[1]); if (L.concat(R).some(x => !x)) return null;
      const els = [...new Set(L.concat(R).flatMap(x => Object.keys(x.counts)))], tot = side => e => side.reduce((a, x) => a + x.c * (x.counts[e] || 0), 0);
      const expr = (side, e) => side.filter(x => x.counts[e]).map(x => `${x.c} × ${x.counts[e]}`).join(" + ") || "0";
      const rows = els.map(e => ({ e, l: tot(L)(e), r: tot(R)(e) })); if (rows.some(x => x.l !== x.r)) return null;
      return { skipCheck: true, results: [], steps: ["O balanceamento conserva a massa: cada elemento precisa ter a <strong>mesma quantidade de átomos</strong> dos dois lados. Multiplique o coeficiente pelo número de átomos em cada fórmula.",
        ...els.map((e, i) => `${e}: esquerda ${expr(L, e)} = ${rows[i].l} · direita ${expr(R, e)} = ${rows[i].r} ✓`), "Todos os elementos conferem: a equação está <strong>balanceada</strong>."] };
    }
  });
  const RES = { 11: "gas-ideal-result" }; // módulos com mais de um resultado: qual deles recebe o passo a passo
  window.ChemSteps = { STEPS };

  const nums = t => (t.replace(/(\d),(\d)/g, "$1.$2").match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi) || []).map(Number);
  let cur = 0, sig = "", timer = null;
  const oTool = window.renderToolInner; window.renderToolInner = function (id) { oTool(id); cur = parseInt(id); sig = ""; schedule(); };
  const oHome = window.renderHomeInner; window.renderHomeInner = function () { oHome(); cur = 0; };

  function update() {
    document.querySelectorAll("#screen-content .steps-panel").forEach(p => p.remove());
    const build = STEPS[cur], box = RES[cur] ? $(RES[cur]) : document.querySelector('#screen-content [id$="-result"]'); if (!build || !box) return;
    const text = box.textContent.replace(/\s+/g, " ").trim(); if (!text || /^(clique|digite|aguardando|preencha)/i.test(text)) return;
    let r = null; try { r = build(); } catch (e) {} if (!r) return;
    const shown = nums(text);
    // só mostra se o cálculo independente concordar com o resultado exibido (tolerância de 1 %)
    if (!r.skipCheck && !r.results.some(x => shown.some(s => Math.abs(s - x) <= 0.01 * Math.max(Math.abs(x), 1e-12) + 1e-9))) return;
    box.insertAdjacentHTML("afterend", `<details class="steps-panel text-sm mt-2"><summary>Ver passo a passo do cálculo</summary><ol class="mt-2 pl-5 space-y-1" style="list-style:decimal">${r.steps.map(s => `<li>${s}</li>`).join("")}</ol></details>`);
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(() => { const box = RES[cur] ? $(RES[cur]) : document.querySelector('#screen-content [id$="-result"]'); const s = cur + "|" + (box ? box.textContent : "") + "|" + [...document.querySelectorAll("#screen-content input,#screen-content select")].map(e => e.value).join(","); if (s === sig && document.querySelector(".steps-panel")) return; sig = s; update(); }, 120); }
  const sc = $("screen-content"); if (sc) new MutationObserver(schedule).observe(sc, { childList: true, subtree: true, characterData: true });
  document.addEventListener("input", schedule);
})();
