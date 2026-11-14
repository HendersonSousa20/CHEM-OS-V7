/* v8.12 — Laboratório virtual (Módulo 23): análise por derivada no relatório, exportação CSV e atalhos de teclado na bancada. */
(function () {
  const $ = id => document.getElementById(id);
  const fmt = (x, d = 2) => (+x).toFixed(d).replace(".", ",");

  // Estima o ponto de equivalência pelo máximo da 1ª derivada (ΔLeitura/ΔV), refinado pela média ponderada dos 3 maiores vizinhos.
  function derivative(points) {
    const byVol = new Map(); points.forEach(p => { if (isFinite(p.vol) && isFinite(p.reading)) byVol.set(+p.vol.toFixed(6), p.reading); });
    const pts = [...byVol.entries()].map(([vol, reading]) => ({ vol, reading })).sort((a, b) => a.vol - b.vol);
    if (pts.length < 3) return null;
    const seg = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const dv = pts[i + 1].vol - pts[i].vol; if (dv <= 0) continue;
      seg.push({ mid: (pts[i].vol + pts[i + 1].vol) / 2, lo: pts[i].vol, hi: pts[i + 1].vol, slope: Math.abs(pts[i + 1].reading - pts[i].reading) / dv });
    }
    if (!seg.length) return null;
    let k = 0; seg.forEach((s, i) => { if (s.slope > seg[k].slope) k = i; });
    const nb = seg.slice(Math.max(0, k - 1), k + 2), w = nb.reduce((a, s) => a + s.slope, 0);
    const est = w > 0 ? nb.reduce((a, s) => a + s.slope * s.mid, 0) / w : seg[k].mid;
    return { est, lo: seg[k].lo, hi: seg[k].hi, slope: seg[k].slope, gap: seg[k].hi - seg[k].lo, n: pts.length, seg };
  }
  window.ChemLab = { derivative };

  function plot(d, equiv) {
    const W = 400, H = 130, L = 34, B = 18, T = 8, R = 8, xs = d.seg.map(s => s.mid), ys = d.seg.map(s => s.slope);
    const x0 = Math.min(...xs), x1 = Math.max(...xs, equiv || -Infinity), y1 = Math.max(...ys) || 1, sx = v => L + (v - x0) / ((x1 - x0) || 1) * (W - L - R), sy = v => H - B - v / y1 * (H - B - T);
    const line = d.seg.map(s => `${sx(s.mid).toFixed(1)},${sy(s.slope).toFixed(1)}`).join(" ");
    return `<svg viewBox="0 0 ${W} ${H}" class="w-full mt-2" role="img" aria-label="Curva da derivada: inclinação em função do volume" style="max-width:520px;color:inherit">
      <line x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}" stroke="currentColor" opacity=".5"/><line x1="${L}" y1="${T}" x2="${L}" y2="${H - B}" stroke="currentColor" opacity=".5"/>
      <polyline points="${line}" fill="none" stroke="currentColor" stroke-width="1.5"/>${d.seg.map(s => `<circle cx="${sx(s.mid).toFixed(1)}" cy="${sy(s.slope).toFixed(1)}" r="2.5" fill="currentColor"/>`).join("")}
      <line x1="${sx(d.est).toFixed(1)}" y1="${T}" x2="${sx(d.est).toFixed(1)}" y2="${H - B}" stroke="currentColor" stroke-dasharray="4 3"/><text x="${(sx(d.est) + 3).toFixed(1)}" y="${T + 8}" font-size="9" fill="currentColor">estimado ${fmt(d.est)} mL</text>
      ${equiv > 0 ? `<line x1="${sx(equiv).toFixed(1)}" y1="${T}" x2="${sx(equiv).toFixed(1)}" y2="${H - B}" stroke="currentColor" stroke-dasharray="1 3" opacity=".7"/>` : ""}
      <text x="${L}" y="${H - 4}" font-size="9" fill="currentColor">volume (mL) →  | eixo y: ΔLeitura/ΔV | tracejado longo: estimado, pontilhado: teórico</text></svg>`;
  }

  function csv() {
    const rows = [...geState.dataLog].sort((a, b) => a.vol - b.vol).map(p => `${fmt(p.vol, 3)};${fmt(p.reading, 4)}`);
    return "\ufeffvolume_adicionado_mL;leitura\n" + rows.join("\n") + "\n";
  }

  const oReport = window.geRenderReport;
  window.geRenderReport = function () {
    oReport.apply(this, arguments);
    const c = geContainer(); if (!c || !geState || !geState.dataLog) return;
    const d = derivative(geState.dataLog);
    let body;
    if (!d) body = `<div class="opacity-80">Registre pelo menos 3 pontos na tabela para analisar a curva pela derivada.</div>`;
    else {
      const err = geState.equivVol > 0 ? Math.abs(d.est - geState.equivVol) : null;
      body = `<div>Maior inclinação (ΔLeitura/ΔV ≈ <strong>${fmt(d.slope, 2)}</strong> por mL) entre <strong>${fmt(d.lo)}</strong> e <strong>${fmt(d.hi)} mL</strong>.</div>
        <div>Ponto de equivalência estimado pela derivada: <strong>${fmt(d.est)} mL</strong>${err !== null ? ` · valor teórico ${fmt(geState.equivVol)} mL · diferença <strong>${fmt(err)} mL (${fmt(100 * err / geState.equivVol, 1)} %)</strong>` : ""}</div>
        ${d.gap > 1 ? `<div class="text-yellow-300 mt-1">⚠ Seus pontos estão ${fmt(d.gap)} mL distantes ali: registre mais pontos perto do salto para estimar melhor.</div>` : '<div class="opacity-70 mt-1">Boa densidade de pontos na região do salto.</div>'}`;
    }
    c.insertAdjacentHTML("beforeend", `<div id="ge-deriv" class="dos-border p-3 mt-3 text-xs"><div class="font-bold mb-1">ANÁLISE PELA 1ª DERIVADA (método do ponto de inflexão)</div>${body}
      ${d ? plot(d, geState.equivVol) : ""}
      <div class="mt-2"><button class="dos-btn" id="ge-csv-btn">BAIXAR DADOS (CSV)</button></div></div>`);
    $("ge-csv-btn").onclick = () => {
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv()], { type: "text/csv;charset=utf-8" }));
      a.download = `chemos-lab-${geState.type}.csv`; a.click(); URL.revokeObjectURL(a.href);
    };
  };

  const oBench = window.geRenderBenchShell;
  window.geRenderBenchShell = function () {
    oBench.apply(this, arguments);
    const c = geContainer();
    if (c) c.insertAdjacentHTML("beforeend", `<div class="text-[10px] opacity-60 mt-2">Atalhos: <strong>A</strong> +1 mL · <strong>S</strong> +0,1 mL · <strong>D</strong> +0,05 mL · <strong>Z</strong> desfazer · <strong>R</strong> registrar ponto · <strong>V</strong> marcar viragem</div>`);
  };

  document.addEventListener("keydown", e => {
    if (e.ctrlKey || e.metaKey || e.altKey || !/^#\/m\/23/.test(location.hash) || /INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName)) return;
    if (typeof geState === "undefined" || !geState || geState.step !== 1) return;
    const k = e.key.toLowerCase(), acts = { a: () => geAddVolume(1), s: () => geAddVolume(0.1), d: () => geAddVolume(0.05), z: () => geUndoVolume(), r: () => geRegisterPoint(), v: () => geMarkViragem() };
    if (acts[k]) { e.preventDefault(); acts[k](); }
  });
})();
