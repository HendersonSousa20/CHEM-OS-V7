/* v11.3 — Módulo 34: Previsão do produto na eletrólise (qual íon descarrega).
   Regras didáticas de "facilidade de descarga": cátions de Li, Na, K, Ca, Mg, Ba e Al NÃO se depositam em água (a água se reduz);
   ânions não oxigenados (Cl⁻, Br⁻, I⁻, S²⁻) descarregam antes da água; F⁻, OH⁻ (descarrega como O₂) e oxoânions: a água/OH⁻ se oxida.
   Em sais fundidos descarregam o cátion e o ânion. As equações globais são montadas por soma de semirreações. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const SUB = "₀₁₂₃₄₅₆₇₈₉", SUP = { 1: "⁺", 2: "²⁺", 3: "³⁺" }, sb = n => n > 1 ? String(n).replace(/\d/g, d => SUB[d]) : "";
  const gcd = (a, b) => b ? gcd(b, a % b) : a, lcm = (a, b) => a * b / gcd(a, b);
  // id, rótulo, símbolo, carga, "ativo em água" (água se reduz no lugar), id na tabela de E°
  const CAT = [["li", "Li⁺", "Li", 1, 1, "li"], ["na", "Na⁺", "Na", 1, 1, "na"], ["k", "K⁺", "K", 1, 1, "k"], ["ca", "Ca²⁺", "Ca", 2, 1, "ca"], ["mg", "Mg²⁺", "Mg", 2, 1, "mg"], ["ba", "Ba²⁺", "Ba", 2, 1, null], ["al", "Al³⁺", "Al", 3, 1, "al"],
    ["zn", "Zn²⁺", "Zn", 2, 0, "zn"], ["fe", "Fe²⁺", "Fe", 2, 0, "fe"], ["ni", "Ni²⁺", "Ni", 2, 0, "ni"], ["sn", "Sn²⁺", "Sn", 2, 0, "sn"], ["pb", "Pb²⁺", "Pb", 2, 0, "pb"], ["cu", "Cu²⁺", "Cu", 2, 0, "cu"], ["ag", "Ag⁺", "Ag", 1, 0, "ag"], ["h", "H⁺ (ácido)", "H", 1, 0, "h2"]]
    .map(a => ({ id: a[0], lab: a[1], sym: a[2], z: a[3], active: !!a[4], e: a[5] }));
  // id, rótulo, fórmula do ânion, carga, tipo: nox = não oxigenado (descarrega), oxo = oxoânion/F⁻ (a água se oxida), oh, o = O²⁻
  const AN = [["cl", "Cl⁻", "Cl", 1, "nox", "Cl₂", 2], ["br", "Br⁻", "Br", 1, "nox", "Br₂", 2], ["i", "I⁻", "I", 1, "nox", "I₂", 2], ["s", "S²⁻", "S", 2, "nox", "S", 1], ["f", "F⁻", "F", 1, "oxo", "F₂", 2], ["oh", "OH⁻", "OH", 1, "oh"], ["o", "O²⁻ (só fundido)", "O", 2, "o"],
    ["no3", "NO₃⁻", "NO₃", 1, "oxo"], ["so4", "SO₄²⁻", "SO₄", 2, "oxo"], ["po4", "PO₄³⁻", "PO₄", 3, "oxo"], ["co3", "CO₃²⁻", "CO₃", 2, "oxo"]]
    .map(a => ({ id: a[0], lab: a[1], f: a[2], z: a[3], t: a[4], prod: a[5], pn: a[6] }));
  const cb = Object.fromEntries(CAT.map(c => [c.id, c])), ab = Object.fromEntries(AN.map(a => [a.id, a]));
  const ion = c => c.id === "h" ? "H⁺" : c.sym + SUP[c.z];
  const aionF = a => a.f + ({ 1: "", 2: "²", 3: "³" })[a.z] + "⁻";
  const poly = a => /[₂₃]|OH/.test(a.f) && a.f !== "S" && a.f !== "O";
  function salt(c, a) { const g = gcd(c.z, a.z), x = a.z / g, y = c.z / g; return (c.sym === "H" ? "H" + sb(x) : c.sym + sb(x)) + (y > 1 && poly(a) ? `(${a.f})${sb(y)}` : a.f + sb(y)); }
  // semirreações como {l:{espécie:coef}, r:{...}, n}
  const H2O = "H₂O", Hp = "H⁺", OHm = "OH⁻";
  const hrx = (l, r, n, text) => ({ l, r, n, text });
  const eq = (side) => Object.entries(side).filter(([, v]) => v > 0).map(([k, v]) => (v > 1 ? v + " " : "") + k).join(" + ");
  function addTo(t, s, m) { Object.entries(s).forEach(([k, v]) => t[k] = (t[k] || 0) + v * m); }
  function sumHalf(c, a) {
    const L = lcm(c.n, a.n), L1 = {}, R1 = {}; addTo(L1, c.l, L / c.n); addTo(L1, a.l, L / a.n); addTo(R1, c.r, L / c.n); addTo(R1, a.r, L / a.n);
    const cancel = () => Object.keys(L1).forEach(k => { if (R1[k]) { const m = Math.min(L1[k], R1[k]); L1[k] -= m; R1[k] -= m; } });
    cancel(); [L1, R1].forEach(S => { const k = Math.min(S[Hp] || 0, S[OHm] || 0); if (k) { S[Hp] -= k; S[OHm] -= k; S[H2O] = (S[H2O] || 0) + k; } }); cancel();
    return { L: L1, R: R1, n: L, mc: L / c.n, ma: L / a.n };
  }
  window.runElectroPredict = function () {
    const box = $("elp-result"); if (!box) return;
    try {
      const molten = $("elp-medium").value === "molten", c = cb[$("elp-cat").value], a = ab[$("elp-an").value], activeEl = $("elp-el").value === "active";
      const warns = [], notes = [];
      if (c.id === "h" && (a.t === "oh" || a.id === "co3" || a.id === "o")) throw new Error(`O composto H⁺ com ${aionF(a)} não existe como ácido estável em água. Escolha outro ânion.`);
      if (molten) { if (c.id === "h") throw new Error("Ácidos não são sais iônicos fundidos. Escolha um sal metálico."); if (a.t === "oxo" && a.id !== "f") throw new Error("Sais fundidos de oxoânions (nitrato, sulfato, fosfato, carbonato) se decompõem ao aquecer. Escolha um haleto, sulfeto, óxido ou hidróxido."); }
      else if (a.id === "o") throw new Error("O²⁻ só existe em óxidos fundidos (ex.: Al₂O₃). Em água forma OH⁻.");
      if (!molten) {
        const g1 = ["na", "k", "li"], bad = c.id !== "h" && (((a.id === "co3" || a.id === "po4") && !g1.includes(c.id)) || ((a.id === "s" || a.id === "oh") && ![...g1, "ba"].includes(c.id))
          || (c.id === "ag" && ["cl", "br", "i", "so4"].includes(a.id)) || (["pb", "ba", "ca"].includes(c.id) && a.id === "so4") || (c.id === "pb" && a.id === "i"));
        if (bad) warns.push(`${salt(c, a)} é pouco solúvel em água: na prática não há eletrólito dissolvido. Use-o <em>fundido</em> ou escolha outro sal; o resultado abaixo segue a regra didática.`);
      }
      // cátodo
      let ca; const metal = molten || !c.active;
      if (c.id === "h") ca = hrx({ [Hp]: 2 }, { "H₂": 1 }, 2, "2 H⁺ + 2 e⁻ → H₂");
      else if (metal) ca = hrx({ [ion(c)]: 1 }, { [c.sym]: 1 }, c.z, `${ion(c)} + ${c.z > 1 ? c.z + " " : ""}e⁻ → ${c.sym}`);
      else ca = hrx({ [H2O]: 2 }, { "H₂": 1, [OHm]: 2 }, 2, "2 H₂O + 2 e⁻ → H₂ + 2 OH⁻");
      // ânodo
      let an, activeUsed = false;
      if (activeEl && !molten && metal && c.id !== "h") { activeUsed = true; an = hrx({ [c.sym]: 1 }, { [ion(c)]: 1 }, c.z, `${c.sym} → ${ion(c)} + ${c.z > 1 ? c.z + " " : ""}e⁻   (o próprio eletrodo se dissolve)`); }
      else {
        if (activeEl) notes.push("Ânodo ativo só faz sentido com o metal do cátion que se deposita; foi tratado como eletrodo inerte.");
        if (a.t === "nox" || (molten && a.id === "f")) { const pn = a.pn; an = hrx({ [aionF(a)]: pn }, { [a.prod]: 1 }, pn, `${pn > 1 ? pn + " " : ""}${aionF(a)} → ${a.prod} + ${pn > 1 ? pn + " " : ""}e⁻`); }
        else if (a.id === "o") an = hrx({ "O²⁻": 2 }, { "O₂": 1 }, 4, "2 O²⁻ → O₂ + 4 e⁻");
        else if (a.t === "oh") an = hrx({ [OHm]: 4 }, { "O₂": 1, [H2O]: 2 }, 4, "4 OH⁻ → O₂ + 2 H₂O + 4 e⁻");
        else an = hrx({ [H2O]: 2 }, { "O₂": 1, [Hp]: 4 }, 4, "2 H₂O → O₂ + 4 H⁺ + 4 e⁻");
      }
      const S = sumHalf(ca, an), s = salt(c, a);
      let ovr;
      if (activeUsed) ovr = `${c.sym}(ânodo) → ${c.sym}(cátodo)   — o metal passa do ânodo para o cátodo (refino eletrolítico / galvanoplastia); a concentração de ${ion(c)} praticamente não muda.`;
      else if (molten) { const k = (S.L[ion(c)] || 0) / (c.id === "h" ? 1 : (a.z / gcd(c.z, a.z))); ovr = `${k > 1 ? k + " " : ""}${s} → ${eq(S.R)}`; ovr += `<div class="text-xs opacity-70">forma iônica: ${eq(S.L)} → ${eq(S.R)}</div>`; }
      else ovr = `${eq(S.L)} → ${eq(S.R)}`;
      let sol = "";
      const acidF = "H" + sb(a.z) + a.f, baseF = c.z > 1 ? c.sym + "(OH)" + sb(c.z) : c.sym + "OH";
      if (!molten && !activeUsed) {
        if (c.id === "h") sol = a.t === "nox" ? `O ácido é consumido (${acidF} → H₂ + ${a.prod}).` : "Só a <strong>água</strong> é consumida (H₂ + O₂): o ácido fica mais concentrado.";
        else if (a.t === "oh") sol = "Só a <strong>água</strong> é consumida (H₂ + O₂): a base fica mais concentrada.";
        else if (c.active && a.t === "oxo") sol = "Só a <strong>água</strong> é consumida (H₂ + O₂): o sal apenas fica mais concentrado. É a eletrólise da água.";
        else if (c.active) sol = `A solução fica <strong>básica</strong> (forma-se ${baseF}).`;
        else if (a.t === "oxo") sol = `A solução fica <strong>ácida</strong> (forma-se ${acidF}).`;
        else sol = `O sal dissolvido é <strong>consumido</strong>: a solução se empobrece em ${s}.`;
      }
      const E0 = typeof GALVANIC_E0 !== "undefined" && c.e && GALVANIC_E0[c.e] !== undefined ? GALVANIC_E0[c.e] : null;
      if (!molten && E0 !== null && c.id !== "h") notes.push(`E°(${ion(c)}/${c.sym}) = ${E0 >= 0 ? "+" : "−"}${Math.abs(E0).toFixed(2).replace(".", ",")} V. ${c.active ? "Metais ativos (potencial muito negativo) não se depositam em água: a água se reduz antes." : "Potencial maior que o da água: o metal se deposita (regra didática; na prática a sobretensão do H₂ também ajuda no Zn e no Fe)."}`);
      if (!molten && a.t === "nox" && a.id !== "s") notes.push(`${aionF(a)} descarrega antes da água (no caso do Cl⁻, apesar de E°(O₂/H₂O) ser menor que E°(Cl₂/Cl⁻), a sobretensão do O₂ favorece o Cl₂).`);
      if (!molten && a.t === "oxo") notes.push(`${aionF(a)} não descarrega em solução aquosa: quem se oxida é a água (libera O₂ e H⁺).`);
      box.innerHTML = `<div class="font-bold mb-1">${molten ? "Sal fundido" : "Solução aquosa"} de ${s} — eletrodos ${activeEl ? "(ânodo ativo)" : "inertes (Pt ou grafite)"}</div>
        <div class="text-sm space-y-1 mb-2"><div><span class="font-bold">Cátodo (−), redução:</span> ${ca.text} <span class="opacity-80">(produto: <strong>${eq(ca.r)}</strong>)</span></div>
        <div><span class="font-bold">Ânodo (+), oxidação:</span> ${an.text} <span class="opacity-80">(produto: <strong>${eq(an.r)}</strong>)</span></div>
        <div><span class="font-bold">Equação global:</span> <strong>${ovr}</strong></div>${sol ? `<div>${sol}</div>` : ""}</div>
        ${warns.map(w => `<div class="text-xs text-yellow-400 mb-1">[!] ${w}</div>`).join("")}
        ${notes.length ? `<ul class="list-disc pl-4 text-xs opacity-80">${notes.map(n => `<li>${n}</li>`).join("")}</ul>` : ""}
        <div class="text-xs opacity-70 mt-2">Regras didáticas de facilidade de descarga; na prática, concentração, eletrodos e sobretensão podem alterar os produtos.</div>`;
    } catch (e) { box.innerHTML = `<span class="test-fail">${e.message}</span>`; }
  };
  window.setElp = (m, c, a, el) => { $("elp-medium").value = m; $("elp-cat").value = c; $("elp-an").value = a; $("elp-el").value = el || "inert"; runElectroPredict(); };
  function render() {
    const ex = [["aq", "na", "cl", "", "NaCl (aq) — cloro-soda"], ["molten", "na", "cl", "", "NaCl fundido"], ["aq", "cu", "so4", "", "CuSO₄ (aq)"], ["aq", "cu", "so4", "active", "CuSO₄ com ânodo de Cu"], ["aq", "na", "so4", "", "Na₂SO₄ (aq)"], ["aq", "k", "i", "", "KI (aq)"], ["aq", "ag", "no3", "", "AgNO₃ (aq)"], ["molten", "al", "o", "", "Al₂O₃ fundido"], ["aq", "h", "so4", "", "H₂SO₄ (aq)"], ["aq", "na", "oh", "", "NaOH (aq)"]];
    $("screen-content").innerHTML = `
      <div class="text-xl font-bold border-b border-current pb-1 mb-3">34. PREVISÃO DO PRODUTO NA ELETRÓLISE</div>
      <div class="text-xs opacity-80 mb-2">Escolha o meio, o cátion e o ânion do eletrólito: o módulo diz o que se forma em cada eletrodo e escreve a equação global.</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 text-sm">
        <label>Meio<select id="elp-medium" class="dos-input w-full p-1"><option value="aq">Solução aquosa</option><option value="molten">Sal fundido (ígnea)</option></select></label>
        <label>Eletrodos<select id="elp-el" class="dos-input w-full p-1"><option value="inert">Inertes (platina ou grafite)</option><option value="active">Ânodo ativo (metal do cátion)</option></select></label>
        <label>Cátion<select id="elp-cat" class="dos-input w-full p-1">${CAT.map(c => `<option value="${c.id}"${c.id === "na" ? " selected" : ""}>${c.lab}</option>`).join("")}</select></label>
        <label>Ânion<select id="elp-an" class="dos-input w-full p-1">${AN.map(a => `<option value="${a.id}"${a.id === "cl" ? " selected" : ""}>${a.lab}</option>`).join("")}</select></label>
      </div>
      <div class="flex flex-wrap gap-1 mb-3 text-xs">${ex.map(e => `<button class="dos-btn" onclick="setElp('${e[0]}','${e[1]}','${e[2]}','${e[3]}')">${e[4]}</button>`).join("")}</div>
      <button class="dos-btn mb-3" onclick="runElectroPredict()">PREVER PRODUTOS</button>
      <div id="elp-result" class="dos-border p-3 text-sm" aria-live="polite">Escolha o eletrólito e clique em PREVER PRODUTOS.</div>
      <details class="mt-3 text-sm"><summary class="font-bold">Regras de descarga (ordem de facilidade)</summary><ul class="list-disc pl-5 text-xs mt-2 space-y-1">
        <li><strong>Cátodo (aquoso):</strong> Ag⁺, Cu²⁺, Pb²⁺, Sn²⁺, Ni²⁺, Fe²⁺, Zn²⁺ descarregam antes da água (depositam metal). Li⁺, Na⁺, K⁺, Ca²⁺, Mg²⁺, Ba²⁺ e Al³⁺ <em>não</em>: a água se reduz (H₂ + OH⁻). Num ácido, H⁺ vira H₂.</li>
        <li><strong>Ânodo (aquoso, inerte):</strong> Cl⁻, Br⁻, I⁻ e S²⁻ descarregam antes da água; OH⁻ forma O₂; F⁻ e oxoânions (NO₃⁻, SO₄²⁻, PO₄³⁻, CO₃²⁻) não descarregam: a água se oxida (O₂ + H⁺).</li>
        <li><strong>Sal fundido:</strong> não há água; o cátion vira metal no cátodo e o ânion se oxida no ânodo.</li>
        <li><strong>Ânodo ativo:</strong> se for do mesmo metal do cátion que se deposita (ex.: Cu em CuSO₄), é o próprio eletrodo que se oxida.</li></ul></details>`;
  }
  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    if (parseInt(id) !== 34) return orig(id);
    if (typeof playBeep === "function") playBeep(700, 0.04);
    render(); if (typeof screenAnimateIn === "function") screenAnimateIn();
  };
})();
