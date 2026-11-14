/* v8: tema PAPEL (claro), tamanho de fonte, backup/restauração dos dados locais. */
(function () {
  const FS = "chemos-fontscale";
  const applyScale = s => { document.body.style.fontSize = s === 1 ? "" : (1.2 * s).toFixed(2) + "rem"; };
  const scale = () => { try { return parseFloat(localStorage.getItem(FS)) || 1; } catch (e) { return 1; } };
  const bump = d => { const s = Math.min(1.6, Math.max(0.8, +(scale() + d).toFixed(2))); try { localStorage.setItem(FS, s); } catch (e) {} applyScale(s); showToast("Tamanho do texto: " + Math.round(s * 100) + "%"); };
  window.chemosFont = bump; applyScale(scale());

  window.exportData = function () {
    const out = {}; try { Object.keys(localStorage).filter(k => /chem/i.test(k)).forEach(k => out[k] = localStorage.getItem(k)); } catch (e) {}
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ app: "CHEM.OS", v: 8, data: out }, null, 1)], { type: "application/json" }));
    a.download = `chemos-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(a.href);
    showToast(`Backup salvo (${Object.keys(out).length} itens).`);
  };
  window.importData = function () {
    const f = document.createElement("input"); f.type = "file"; f.accept = "application/json,.json";
    f.onchange = () => f.files[0] && f.files[0].text().then(t => {
      try {
        const j = JSON.parse(t); if (j.app !== "CHEM.OS" || typeof j.data !== "object") throw 0;
        let n = 0; Object.entries(j.data).forEach(([k, v]) => { if (/chem/i.test(k) && typeof v === "string") { localStorage.setItem(k, v); n++; } });
        showToast(`${n} itens restaurados. Recarregando…`); setTimeout(() => location.reload(), 900);
      } catch (e) { showToast("Arquivo de backup inválido."); }
    });
    f.click();
  };

  if (window.__palActions) window.__palActions.push(["Tema: papel (claro)", () => setTheme("paper")], ["Texto maior", () => bump(0.1)], ["Texto menor", () => bump(-0.1)],
    ["Exportar backup dos meus dados", () => exportData()], ["Importar backup", () => importData()], ["Conversor de unidades", () => renderTool(26)]);

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z" && /^#\/m\/21/.test(location.hash) && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) && typeof undoEditor === "function") { e.preventDefault(); undoEditor(); }
  });

  const g = document.querySelector('[aria-label="Escolha de tema de cor"]');
  if (g) {
    g.insertAdjacentHTML("beforeend", `<button onclick="setTheme('paper')" class="px-1 border border-current hover:bg-current hover:text-black">PAPEL</button>
      <button onclick="chemosFont(-0.1)" class="px-1 border border-current" aria-label="Diminuir texto">A−</button>
      <button onclick="chemosFont(0.1)" class="px-1 border border-current" aria-label="Aumentar texto">A+</button>`);
  }
})();
