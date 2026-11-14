/* v8.6 — Tabela Periódica (Módulo 7): cores por família, filtro por categoria e dados locais offline
   (massa, grupo, período, bloco e configuração eletrônica calculada por Madelung + exceções). */
(function () {
  const $ = id => document.getElementById(id);
  const ORDER = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p"];
  const CAP = { s: 2, p: 6, d: 10, f: 14 }, NG = [[86, "Rn"], [54, "Xe"], [36, "Kr"], [18, "Ar"], [10, "Ne"], [2, "He"]];
  const EXC = { 24: { "4s": 1, "3d": 5 }, 29: { "4s": 1, "3d": 10 }, 41: { "5s": 1, "4d": 4 }, 42: { "5s": 1, "4d": 5 }, 44: { "5s": 1, "4d": 7 }, 45: { "5s": 1, "4d": 8 },
    46: { "5s": 0, "4d": 10 }, 47: { "5s": 1, "4d": 10 }, 57: { "6s": 2, "4f": 0, "5d": 1 }, 58: { "6s": 2, "4f": 1, "5d": 1 }, 64: { "6s": 2, "4f": 7, "5d": 1 },
    78: { "6s": 1, "4f": 14, "5d": 9 }, 79: { "6s": 1, "4f": 14, "5d": 10 }, 89: { "7s": 2, "5f": 0, "6d": 1 }, 90: { "7s": 2, "5f": 0, "6d": 2 },
    91: { "7s": 2, "5f": 2, "6d": 1 }, 92: { "7s": 2, "5f": 3, "6d": 1 }, 93: { "7s": 2, "5f": 4, "6d": 1 }, 96: { "7s": 2, "5f": 7, "6d": 1 } };
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", sup = n => String(n).replace(/\d/g, d => SUP[d]);
  const key = k => k[0] * 10 + "spdf".indexOf(k[1]);

  function fill(Z, exc) {
    const occ = {}; let left = Z, last = "1s";
    for (const o of ORDER) { if (left <= 0) break; const k = Math.min(CAP[o[1]], left); occ[o] = k; left -= k; last = o; }
    if (exc && EXC[Z]) Object.assign(occ, EXC[Z]);
    return { occ, block: last[1] };
  }
  function config(Z) {
    const { occ } = fill(Z, true), core = NG.find(([n]) => n < Z), coreOcc = core ? fill(core[0], false).occ : {};
    const parts = Object.keys(occ).filter(k => occ[k] > 0 && (occ[k] !== (coreOcc[k] || 0))).sort((a, b) => key(a) - key(b));
    const total = Object.values(occ).reduce((a, b) => a + b, 0);
    return { text: (core ? `[${core[1]}] ` : "") + parts.map(k => k + occ[k]).join(" "), sup: (core ? `[${core[1]}] ` : "") + parts.map(k => k + sup(occ[k])).join(" "), total, block: fill(Z, false).block };
  }
  window.ChemConfig = { config };

  let cat = "", mode = "cat", HUE = {}, BY = {}, MASS = [0, 1], CATS = [];
  const BLK = { s: 200, p: 140, d: 40, f: 300 };
  function init() {
    CATS = [...new Set(RAW_ELEMENTS.map(e => e[6]))];
    CATS.forEach((c, i) => HUE[c] = Math.round(i * 360 / CATS.length)); RAW_ELEMENTS.forEach(e => BY[e[0]] = e);
    const m = RAW_ELEMENTS.map(e => parseFloat(e[3])).filter(isFinite); MASS = [Math.min(...m), Math.max(...m)];
  }
  const PROPS = { en: ["PAULING", 0.7, 3.98, "", "EN"], ie: ["IONIZATION", 3.8, 24.6, " eV", "1ª ionização"], rad: ["RADIUS", 25, 260, " pm", "raio atômico"] };
  const enOf = e => mode in PROPS ? (window[PROPS[mode][0]] || {})[e[1]] : undefined;
  const enHue = e => { const v = enOf(e); return v == null ? null : Math.round(220 - 220 * (v - PROPS[mode][1]) / (PROPS[mode][2] - PROPS[mode][1])); };
  const hueOf = e => mode in PROPS ? enHue(e) : mode === "mass" ? Math.round(220 - 220 * (parseFloat(e[3]) - MASS[0]) / ((MASS[1] - MASS[0]) || 1))
    : mode === "period" ? Math.round((e[5] - 1) * 300 / 6) : mode === "block" ? BLK[config(e[0]).block] : HUE[e[6]];
  const tip = e => mode in PROPS ? `${e[2]} — ${PROPS[mode][4]}: ${enOf(e) ?? "n/d"}${enOf(e) != null ? PROPS[mode][3] : ""}` : mode === "mass" ? `${e[2]} — ${e[3]} u` : mode === "period" ? `${e[2]} — período ${e[5]}` : mode === "block" ? `${e[2]} — bloco ${config(e[0]).block}` : `${e[2]} — ${e[6]}`;
  function decorate() {
    const g = $("ptable-grid"); if (!g) return;
    g.querySelectorAll("[onclick^='showElementDetails']").forEach(c => {
      const e = BY[+c.getAttribute("onclick").match(/\d+/)[0]]; if (!e) return;
      const h = hueOf(e); c.style.backgroundColor = h === null ? "rgba(128,128,128,.15)" : `hsl(${h} 70% 50% / ${mode === "cat" ? 0.22 : 0.3})`; c.title = tip(e);
      if (mode === "cat" && cat) c.style.opacity = e[6] === cat ? "1" : ".15";
    });
  }
  const og = window.renderPTableGrid;
  window.renderPTableGrid = function (f) { og(f); decorate(); };
  const sw = (h, t) => `<span class="px-1" style="border-left:10px solid hsl(${h} 70% 50%)">${t}</span>`;
  function drawLegend() {
    const L = $("pt-legend"); if (!L) return;
    if (mode === "cat") {
      L.innerHTML = CATS.map(c => `<button class="dos-btn" data-cat="${c}" aria-pressed="${c === cat}" style="border-left:10px solid hsl(${HUE[c]} 70% 50%)">${c} (${RAW_ELEMENTS.filter(e => e[6] === c).length})</button>`).join("");
      L.onclick = ev => { const b = ev.target.closest("button"); if (!b) return; cat = cat === b.dataset.cat ? "" : b.dataset.cat; drawLegend(); filterPTable(); };
    } else {
      L.onclick = null;
      L.innerHTML = mode in PROPS ? `<span>${PROPS[mode][1]}${PROPS[mode][3]}</span><span style="display:inline-block;width:180px;height:12px;background:linear-gradient(90deg,hsl(220 70% 50%),hsl(110 70% 50%),hsl(0 70% 50%))"></span><span>${PROPS[mode][2]}${PROPS[mode][3]}</span><span class="opacity-70">cinza = sem dado</span>` : mode === "mass" ? `<span>${MASS[0]} u</span><span style="display:inline-block;width:180px;height:12px;background:linear-gradient(90deg,hsl(220 70% 50%),hsl(110 70% 50%),hsl(0 70% 50%))"></span><span>${MASS[1].toFixed(0)} u</span>`
        : mode === "period" ? [1, 2, 3, 4, 5, 6, 7].map(p => sw(Math.round((p - 1) * 300 / 6), "Período " + p)).join("")
        : Object.keys(BLK).map(b => sw(BLK[b], "Bloco " + b)).join("");
    }
  }
  const od = window.showElementDetails;
  window.showElementDetails = async function (n) {
    await od(n);
    const box = $("elem-detail"), e = BY[n]; if (!box || !e) return;
    const c = config(n);
    box.insertAdjacentHTML("beforeend", `<div class="mt-2 pt-2 border-t border-current text-xs"><strong>DADOS LOCAIS (funcionam offline)</strong>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1"><div>${e[2]} (${e[1]}), Z = ${e[0]}</div><div>Massa atômica: <strong>${e[3]}</strong></div>
      <div>Grupo ${e[4]} · Período ${e[5]}</div><div>Bloco: <strong>${c.block}</strong></div></div>
      <div class="mt-1">Categoria: <strong>${e[6]}</strong> · Eletronegatividade (Pauling): <strong>${(window.PAULING || {})[e[1]] ?? "n/d"}</strong></div><div>1ª ionização: <strong>${(window.IONIZATION || {})[e[1]] ?? "n/d"} eV</strong> · Raio atômico: <strong>${(window.RADIUS || {})[e[1]] ?? "n/d"} pm</strong></div><div>Configuração: <strong>${c.sup}</strong></div></div>`);
  };

  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    orig(id);
    if (parseInt(id) !== 7 || !$("ptable-grid")) return;
    cat = ""; mode = "cat"; init();
    $("ptable-grid").insertAdjacentHTML("beforebegin", `<div class="flex flex-wrap items-center gap-2 mb-2 text-xs"><label for="pt-mode">Colorir por</label>
      <select id="pt-mode" class="dos-input p-1"><option value="cat">Categoria</option><option value="mass">Massa atômica</option><option value="period">Período</option><option value="block">Bloco (s, p, d, f)</option><option value="en">Eletronegatividade (Pauling)</option><option value="ie">1ª energia de ionização (eV)</option><option value="rad">Raio atômico (pm)</option></select></div>
      <div id="pt-legend" class="flex flex-wrap items-center gap-1 mb-2 text-xs" role="group" aria-label="Legenda da tabela periódica"></div>`);
    $("pt-mode").onchange = ev => { mode = ev.target.value; cat = ""; drawLegend(); filterPTable(); };
    drawLegend(); decorate(); if ($("ptable-search").value) filterPTable();
  };
})();
