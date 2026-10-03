/* v8.10 — Módulo 22 (simulação molecular): velocidade (câmera lenta), cor por velocidade e pressão relativa nas paredes. */
(function () {
  const $ = id => document.getElementById(id);
  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    orig(id);
    if (parseInt(id) !== 22 || !$("sim-toggle-btn")) return;
    simSpeed = 1; simBoxFrac = 1; simLast = null; simAcc = 0; simColorBySpeed = true; simPressAvg = 0; simWallImpulse = 0; simStatFrames = 0;
    $("sim-toggle-btn").parentElement.insertAdjacentHTML("afterend", `<div class="flex flex-wrap gap-4 items-end text-xs my-2">
      <label>VELOCIDADE DA SIMULAÇÃO<br><select id="sim-speed" class="dos-input p-1"><option value="0.25">0,25× (câmera lenta)</option><option value="0.5">0,5×</option><option value="1" selected>1×</option></select></label>
      <label>VOLUME DA CAIXA: <span id="sim-vol-label" class="font-bold">100 %</span><br><input id="sim-vol" type="range" min="30" max="100" step="1" value="100" class="w-40"></label>
      <label class="flex items-center gap-1"><input id="sim-color" type="checkbox" checked> colorir por velocidade (azul = lenta, vermelha = rápida)</label></div>`);
    const gsel = $("sim-gas"), cust = gsel && gsel.querySelector('option[value="custom"]');
    [["He (4,00)", 4.00], ["Ne (20,18)", 20.18], ["Ar (39,95)", 39.95], ["CH₄ (16,04)", 16.04], ["CO₂ (44,01)", 44.01], ["Cl₂ (70,90)", 70.90], ["Kr (83,80)", 83.80], ["Xe (131,29)", 131.29]].forEach(([l, m]) => {
      if (gsel && ![...gsel.options].some(o => Math.abs(parseFloat(o.value) - m) < 0.05)) { const o = document.createElement("option"); o.value = String(m); o.textContent = l; gsel.insertBefore(o, cust || null); }
    });
    $("sim-speed").onchange = e => { simSpeed = parseFloat(e.target.value); simPressAvg = 0; };
    $("sim-vol").oninput = e => { simBoxFrac = e.target.value / 100; $("sim-vol-label").textContent = e.target.value + " %"; simPressAvg = 0; simDrawFrame(); };
    $("sim-color").onchange = e => { simColorBySpeed = e.target.checked; if (!simColorBySpeed) simDrawFrame(); };
    const t = $("sim-tinst"); if (t && t.parentElement) t.parentElement.insertAdjacentHTML("afterend",
      `<div>Pressão relativa nas paredes: <span id="sim-press" class="font-bold">—</span> u.a. <span class="opacity-70">(dobrar N ou T deve dobrar a pressão: P ∝ N·T)</span></div>
       <div>P × A (u.a.): <span id="sim-pa" class="font-bold">—</span> <span class="opacity-70">— reduza o volume: a pressão sobe e P × A fica ≈ constante (lei de Boyle, a T e N fixos)</span></div>`);
  };
})();
