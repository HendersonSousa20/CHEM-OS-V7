/* v8.8 — Módulo 31: Eletronegatividade (Pauling) e tipo de ligação. Dados locais para Z = 1–92 (sem He, Ne, Ar). */
(function () {
  const PAULING = { H: 2.20, Li: 0.98, Be: 1.57, B: 2.04, C: 2.55, N: 3.04, O: 3.44, F: 3.98, Na: 0.93, Mg: 1.31, Al: 1.61, Si: 1.90, P: 2.19, S: 2.58, Cl: 3.16,
    K: 0.82, Ca: 1.00, Sc: 1.36, Ti: 1.54, V: 1.63, Cr: 1.66, Mn: 1.55, Fe: 1.83, Co: 1.88, Ni: 1.91, Cu: 1.90, Zn: 1.65, Ga: 1.81, Ge: 2.01, As: 2.18, Se: 2.55, Br: 2.96, Kr: 3.00,
    Rb: 0.82, Sr: 0.95, Y: 1.22, Zr: 1.33, Nb: 1.6, Mo: 2.16, Tc: 1.9, Ru: 2.2, Rh: 2.28, Pd: 2.20, Ag: 1.93, Cd: 1.69, In: 1.78, Sn: 1.96, Sb: 2.05, Te: 2.1, I: 2.66, Xe: 2.6,
    Cs: 0.79, Ba: 0.89, La: 1.10, Ce: 1.12, Pr: 1.13, Nd: 1.14, Pm: 1.13, Sm: 1.17, Eu: 1.2, Gd: 1.2, Tb: 1.1, Dy: 1.22, Ho: 1.23, Er: 1.24, Tm: 1.25, Yb: 1.1, Lu: 1.27,
    Hf: 1.3, Ta: 1.5, W: 2.36, Re: 1.9, Os: 2.2, Ir: 2.20, Pt: 2.28, Au: 2.54, Hg: 2.00, Tl: 1.62, Pb: 2.33, Bi: 2.02, Po: 2.0, At: 2.2, Rn: 2.2,
    Fr: 0.79, Ra: 0.9, Ac: 1.1, Th: 1.3, Pa: 1.5, U: 1.38 };
  window.PAULING = PAULING;
  const $ = id => document.getElementById(id);
  const norm = s => { s = (s || "").trim(); return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); };

  function analyze(a, b) {
    a = norm(a); b = norm(b);
    for (const x of [a, b]) {
      if (!x) throw new Error("Informe dois símbolos de elementos (ex.: Na e Cl).");
      if (!(x in PAULING)) throw new Error(`Sem eletronegatividade de Pauling para "${x}" (símbolo inválido, gás nobre leve ou elemento sem dado).`);
    }
    const ea = PAULING[a], eb = PAULING[b], d = Math.abs(ea - eb);
    const type = d < 0.4 ? "Covalente apolar" : d < 1.7 ? "Covalente polar" : "Iônica (caráter predominante)";
    const ionic = 100 * (1 - Math.exp(-0.25 * d * d));
    const [hi, lo] = ea >= eb ? [a, b] : [b, a];
    return { a, b, ea, eb, delta: d, type, ionic, dipole: d >= 0.4 ? { plus: lo, minus: hi } : null, lowBoth: ea <= 1.9 && eb <= 1.9 };
  }
  window.ChemBond = { analyze };

  window.runBond = function () {
    const box = $("bond-result");
    try {
      const r = analyze($("bd-a").value, $("bd-b").value);
      const bar = "█".repeat(Math.round(r.ionic / 5)) + "░".repeat(20 - Math.round(r.ionic / 5));
      box.innerHTML = `<div>${r.a}: <strong>${r.ea}</strong> &nbsp; ${r.b}: <strong>${r.eb}</strong> &nbsp; ΔEN = <strong>${r.delta.toFixed(2)}</strong></div>
        <div class="text-lg font-bold my-1">${r.type}</div>
        <pre class="whitespace-pre-wrap">Caráter iônico (Pauling): ${r.ionic.toFixed(1)} %\n${bar}</pre>
        ${r.dipole ? `<div>Dipolo: δ+ em <strong>${r.dipole.plus}</strong> → δ− em <strong>${r.dipole.minus}</strong></div>` : "<div>Sem dipolo na ligação (elétrons compartilhados quase igualmente).</div>"}
        ${r.lowBoth && r.delta < 1.7 ? '<div class="text-yellow-300 mt-1">⚠ Dois elementos de baixa eletronegatividade: se ambos forem metais, a ligação é metálica e o ΔEN não se aplica.</div>' : ""}
        <div class="text-xs opacity-70 mt-2">Critério usado: ΔEN &lt; 0,4 apolar · 0,4 a 1,7 polar · &gt; 1,7 iônica. É uma regra prática, não um limite rígido.</div>`;
    } catch (e) { box.innerHTML = `<span class="test-fail">${e.message}</span>`; }
  };
  window.setBond = (a, b) => { $("bd-a").value = a; $("bd-b").value = b; runBond(); };

  function render() {
    $("screen-content").innerHTML = `
      <div class="text-xl font-bold border-b border-current pb-1 mb-3">31. ELETRONEGATIVIDADE (PAULING) E TIPO DE LIGAÇÃO</div>
      <div class="grid grid-cols-2 gap-2 mb-2 text-sm">
        <label>Elemento A (símbolo)<input id="bd-a" type="text" value="Na" maxlength="2" class="dos-input w-full p-1" spellcheck="false"></label>
        <label>Elemento B (símbolo)<input id="bd-b" type="text" value="Cl" maxlength="2" class="dos-input w-full p-1" spellcheck="false"></label>
      </div>
      <div class="flex flex-wrap gap-1 mb-3 text-xs">${[["Na", "Cl", "NaCl"], ["H", "Cl", "HCl"], ["H", "O", "H–O (água)"], ["C", "O", "C=O (CO₂)"], ["O", "O", "O₂"], ["C", "H", "C–H"]].map(p => `<button class="dos-btn" onclick="setBond('${p[0]}','${p[1]}')">${p[2]}</button>`).join("")}</div>
      <button class="dos-btn mb-3" onclick="runBond()">CALCULAR ΔEN</button>
      <div id="bond-result" class="dos-border p-3 text-sm" aria-live="polite">Clique em CALCULAR ΔEN ou escolha um exemplo.</div>`;
  }
  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    if (parseInt(id) !== 31) return orig(id);
    if (typeof playBeep === "function") playBeep(700, 0.04);
    render(); if (typeof screenAnimateIn === "function") screenAnimateIn();
  };
})();
