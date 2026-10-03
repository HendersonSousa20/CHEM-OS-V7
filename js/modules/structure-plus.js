/* v8.16 — Editor de estruturas (Módulo 21): refazer, modelos prontos, aviso de valência excedida (anel vermelho),
   partes desconectadas e grau de insaturação (DBE). */
(function () {
  const $ = id => document.getElementById(id);
  let redo = [];
  const snap = () => JSON.stringify({ atoms: seAtoms, bonds: seBonds, nextId: seNextId });

  const oPush = window.pushEditorHistory; window.pushEditorHistory = function () { redo = []; oPush.apply(this, arguments); };
  const oUndo = window.undoEditor; window.undoEditor = function () { if (!seHistory.length) return; const cur = snap(); oUndo.apply(this, arguments); redo.push(cur); };
  window.redoEditor = function () {
    if (!redo.length) return;
    seHistory.push(snap()); const s = JSON.parse(redo.pop());
    seAtoms = s.atoms; seBonds = s.bonds; seNextId = s.nextId; sePendingBondAtom = null;
    drawEditor(); updateFormulaDisplay(); if (typeof playBeep === "function") playBeep(550, 0.03);
  };

  function analyze(atoms, bonds) {
    const used = {}; bonds.forEach(b => { used[b.a] = (used[b.a] || 0) + b.order; used[b.b] = (used[b.b] || 0) + b.order; });
    const over = atoms.filter(a => SE_VALENCE[a.el] && (used[a.id] || 0) > SE_VALENCE[a.el]).map(a => ({ id: a.id, el: a.el, used: used[a.id], max: SE_VALENCE[a.el] }));
    const parent = {}; atoms.forEach(a => parent[a.id] = a.id);
    const find = x => parent[x] === x ? x : (parent[x] = find(parent[x]));
    bonds.forEach(b => { if (parent[b.a] !== undefined && parent[b.b] !== undefined) parent[find(b.a)] = find(b.b); });
    return { over, parts: new Set(atoms.map(a => find(a.id))).size };
  }
  // Grau de insaturação (anéis + ligações π). Só definido para C, H, N, O, S, P e halogênios.
  function dbe(c) {
    const ok = Object.keys(c).every(e => ["C", "H", "N", "O", "S", "P", "F", "Cl", "Br", "I"].includes(e));
    if (!ok || !c.C) return null;
    const x = (2 * c.C + 2 + (c.N || 0) + (c.P || 0) - (c.H || 0) - (c.F || 0) - (c.Cl || 0) - (c.Br || 0) - (c.I || 0)) / 2;
    return x;
  }
  window.ChemEditor = { analyze, dbe };

  const oDraw = window.drawEditor;
  window.drawEditor = function () {
    oDraw.apply(this, arguments);
    if (!seCtx) return; const { over } = analyze(seAtoms, seBonds);
    over.forEach(o => { const a = seAtoms.find(x => x.id === o.id); seCtx.save(); seCtx.strokeStyle = "#ff4444"; seCtx.lineWidth = 3; seCtx.beginPath(); seCtx.arc(a.x, a.y, SE_ATOM_R + 5, 0, Math.PI * 2); seCtx.stroke(); seCtx.restore(); });
  };

  const oFormula = window.updateFormulaDisplay;
  window.updateFormulaDisplay = function () {
    oFormula.apply(this, arguments);
    const f = $("se-formula"); if (!f) return;
    let ex = $("se-extra"); if (!ex) { f.parentElement.insertAdjacentHTML("afterend", '<div id="se-extra" class="text-xs mt-1" aria-live="polite"></div>'); ex = $("se-extra"); }
    if (!seAtoms.length) { ex.textContent = ""; return; }
    const { over, parts } = analyze(seAtoms, seBonds), d = dbe(computeEditorFormula()), msg = [];
    if (!over.length && d !== null && Number.isInteger(d) && d >= 0) msg.push(`Grau de insaturação: <strong>${d}</strong> (anéis + ligações π)`);
    over.forEach(o => msg.push(`<span class="test-fail">⚠ ${o.el} com ${o.used} ligações (máximo ${o.max}).</span>`));
    if (parts > 1) msg.push(`<span class="text-yellow-300">⚠ ${parts} partes desconectadas na estrutura.</span>`);
    if (!over.length && parts === 1) msg.push('<span class="test-pass">✓ Valências respeitadas.</span>');
    ex.innerHTML = msg.join("<br>");
  };

  // Modelos prontos: [elemento, x, y] em unidades de ~1 px; ligações [i, j, ordem]. Os H são implícitos (calculados pela valência).
  const R = 60, hex = Array.from({ length: 6 }, (_, k) => ["C", Math.round(R * Math.cos(k * Math.PI / 3)), Math.round(R * Math.sin(k * Math.PI / 3))]);
  const TPL = {
    "Água (H₂O)": { a: [["O", 0, 0]], b: [] }, "Amônia (NH₃)": { a: [["N", 0, 0]], b: [] }, "Metano (CH₄)": { a: [["C", 0, 0]], b: [] },
    "Etano (C₂H₆)": { a: [["C", 0, 0], ["C", 70, 0]], b: [[0, 1, 1]] }, "Eteno (C₂H₄)": { a: [["C", 0, 0], ["C", 70, 0]], b: [[0, 1, 2]] }, "Etino (C₂H₂)": { a: [["C", 0, 0], ["C", 70, 0]], b: [[0, 1, 3]] },
    "Metanol (CH₃OH)": { a: [["C", 0, 0], ["O", 70, 0]], b: [[0, 1, 1]] }, "Etanol (C₂H₆O)": { a: [["C", 0, 0], ["C", 60, -35], ["O", 120, 0]], b: [[0, 1, 1], [1, 2, 1]] },
    "Dióxido de carbono (CO₂)": { a: [["O", 0, 0], ["C", 70, 0], ["O", 140, 0]], b: [[0, 1, 2], [1, 2, 2]] },
    "Ácido acético (C₂H₄O₂)": { a: [["C", 0, 0], ["C", 65, 0], ["O", 65, -65], ["O", 130, 35]], b: [[0, 1, 1], [1, 2, 2], [1, 3, 1]] },
    "Benzeno (C₆H₆)": { a: hex, b: [[0, 1, 2], [1, 2, 1], [2, 3, 2], [3, 4, 1], [4, 5, 2], [5, 0, 1]] }
  };
  function load(name) {
    const t = TPL[name]; if (!t || !seCanvas) return;
    pushEditorHistory();
    const xs = t.a.map(p => p[1]), ys = t.a.map(p => p[2]), cx = seCanvas.width / 2 - (Math.min(...xs) + Math.max(...xs)) / 2, cy = seCanvas.height / 2 - (Math.min(...ys) + Math.max(...ys)) / 2;
    seAtoms = []; seBonds = []; seNextId = 1; sePendingBondAtom = null;
    const ids = t.a.map(p => { const id = seNextId++; seAtoms.push({ id, x: p[1] + cx, y: p[2] + cy, el: p[0] }); return id; });
    t.b.forEach(([i, j, o]) => seBonds.push({ id: seNextId++, a: ids[i], b: ids[j], order: o }));
    drawEditor(); updateFormulaDisplay();
  }
  window.loadEditorTemplate = load;

  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    orig(id);
    if (parseInt(id) !== 21 || !seCanvas) return;
    redo = [];
    seCanvas.parentElement.insertAdjacentHTML("beforebegin", `<div class="flex flex-wrap items-end gap-2 mb-2 text-xs">
      <label>MODELOS PRONTOS<br><select id="se-tpl" class="dos-input p-1"><option value="">— escolha uma molécula —</option>${Object.keys(TPL).map(n => `<option>${n}</option>`).join("")}</select></label>
      <button class="dos-btn" id="se-redo" title="Refazer (Ctrl+Y)">↷ REFAZER</button></div>`);
    $("se-tpl").onchange = e => { load(e.target.value); e.target.value = ""; };
    $("se-redo").onclick = () => redoEditor();
    const erase = $("se-tool-erase"); if (erase && !$("se-tool-move")) { erase.insertAdjacentHTML("afterend", `<button id="se-tool-move" onclick="setEditorTool('move')" class="dos-btn py-1.5" title="Arrastar átomos para reposicioná-los">MOVER</button>`); }
    enableDrag(seCanvas); updateToolButtons();
  };
  // Ferramenta MOVER: arrasta átomos (mouse, toque ou caneta). Usa eventos de ponteiro e não interfere nas outras ferramentas.
  const oBtns = window.updateToolButtons; window.updateToolButtons = function () {
    oBtns.apply(this, arguments); const b = $("se-tool-move"); if (!b) return; const on = seTool === "move";
    b.style.backgroundColor = on ? "var(--text-color)" : "transparent"; b.style.color = on ? "var(--bg-color)" : "var(--text-color)"; b.setAttribute("aria-pressed", on);
    if (seCanvas) seCanvas.style.touchAction = on ? "none" : "";
  };
  const oInter = window.handleEditorInteraction; window.handleEditorInteraction = function (x, y) { if (seTool === "move") return; return oInter.apply(this, arguments); };
  function enableDrag(c) {
    let drag = null;
    const pos = e => { const r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    c.addEventListener("pointerdown", e => {
      if (seTool !== "move") return; const p = pos(e), a = findAtomAt(p.x, p.y); if (!a) return;
      drag = { id: a.id, moved: false, dx: a.x - p.x, dy: a.y - p.y }; try { c.setPointerCapture(e.pointerId); } catch (_) {} e.preventDefault();
    });
    c.addEventListener("pointermove", e => {
      if (!drag) return; const a = seAtoms.find(x => x.id === drag.id); if (!a) return; const p = pos(e);
      if (!drag.moved) { if (Math.hypot(p.x + drag.dx - a.x, p.y + drag.dy - a.y) < 3) return; pushEditorHistory(); drag.moved = true; }
      a.x = Math.max(SE_ATOM_R, Math.min(c.width - SE_ATOM_R, p.x + drag.dx)); a.y = Math.max(SE_ATOM_R, Math.min(c.height - SE_ATOM_R, p.y + drag.dy)); drawEditor();
    });
    const end = () => { drag = null; }; c.addEventListener("pointerup", end); c.addEventListener("pointercancel", end);
  }

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && /^#\/m\/21/.test(location.hash) && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) { e.preventDefault(); redoEditor(); }
  });
})();
