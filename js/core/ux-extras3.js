/* v7.3: vírgula decimal, Enter executa, paleta Ctrl+K, copiar/baixar/imprimir resultados. */
(function () {
  // 1) Vírgula decimal: "0,1" passa a ser lido como 0.1 em todos os módulos (parseFloat global).
  const pf = window.parseFloat;
  window.parseFloat = s => pf(typeof s === "string" ? s.replace(/^(\s*[-+]?\d*),(\d)/, "$1.$2") : s);

  // 2) Enter dentro de um campo executa o botão de cálculo mais próximo (run*, calc*, balancear...).
  document.addEventListener("keydown", e => {
    if (e.key !== "Enter" || e.shiftKey || e.isComposing) return;
    const t = e.target;
    if (!t.matches || !t.matches("#screen-content input:not([type=checkbox]):not([type=radio]):not([type=range]):not(#menu-filter)")) return;
    let node = t.parentElement;
    while (node && node.id !== "screen-content") {
      const btn = [...node.querySelectorAll("button")].find(b => /^\s*(run|calc|solve|resolve|balance|search|gerar|start)/i.test(b.getAttribute("onclick") || ""));
      if (btn) { e.preventDefault(); btn.click(); return; }
      node = node.parentElement;
    }
    // o botão de cálculo pode estar fora do bloco do campo (direto na tela do módulo)
    const any = [...document.querySelectorAll("#screen-content button")].find(b => /^\s*(run|calc|solve|resolve|balance|search|gerar|start)/i.test(b.getAttribute("onclick") || ""));
    if (any) { e.preventDefault(); any.click(); }
  });

  // 3) Paleta de comandos (Ctrl/Cmd+K)
  window.__modNames = window.__modNames || {};
  const origHome = window.renderHomeInner;
  window.renderHomeInner = function () {
    origHome();
    document.querySelectorAll("#menu-groups .menu-item").forEach(b => {
      const n = +b.getAttribute("onclick").match(/\d+/)[0];
      window.__modNames[n] = b.textContent.replace(/^\s*\d+\s*/, "").trim();
    });
  };
  const ACTIONS = window.__palActions = [
    ["Tema: verde", () => setTheme("green")], ["Tema: âmbar", () => setTheme("amber")],
    ["Tema: azul", () => setTheme("blue")], ["Tema: mono", () => setTheme("mono")],
    ["Alternar efeito CRT", () => toggleCRT()], ["Alternar som", () => toggleSound()],
    ["Abrir ajuda", () => showHelp()], ["Voltar ao menu", () => renderHome()]
  ];
  function openPalette() {
    const items = [
      ...Object.entries(window.__modNames).map(([n, t]) => ({ label: `${String(n).padStart(2, "0")}  ${t}`, run: () => renderTool(+n) })),
      ...ACTIONS.map(([label, run]) => ({ label: `> ${label}`, run }))
    ];
    openModal("PALETA DE COMANDOS", `<input id="pal-q" class="dos-input w-full mb-2 text-lg" autocomplete="off" aria-label="Buscar módulo ou comando" placeholder="Digite para buscar…"><div id="pal-list" role="listbox" class="space-y-1"></div>`);
    const q = document.getElementById("pal-q"), list = document.getElementById("pal-list");
    let sel = 0, shown = [];
    const draw = () => {
      const k = q.value.trim().toLowerCase();
      shown = items.filter(i => i.label.toLowerCase().includes(k)).slice(0, 8);
      sel = Math.min(sel, Math.max(0, shown.length - 1));
      list.innerHTML = shown.map((i, x) => `<button role="option" aria-selected="${x === sel}" data-i="${x}" class="menu-item w-full ${x === sel ? "pal-sel" : ""}">${i.label.replace(/</g, "&lt;")}</button>`).join("") || "<div class='opacity-70'>Nada encontrado.</div>";
    };
    const go = i => { if (!shown[i]) return; closeModal(); shown[i].run(); };
    q.addEventListener("input", () => { sel = 0; draw(); });
    q.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); draw(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); draw(); }
      else if (e.key === "Enter") { e.preventDefault(); go(sel); }
    });
    list.addEventListener("click", e => { const b = e.target.closest("button"); if (b) go(+b.dataset.i); });
    draw(); q.focus();
  }
  window.openPalette = openPalette;
  window.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); }
  });

  // 4) Copiar / baixar TXT / imprimir (PDF) o conteúdo do módulo, incluindo valores dos campos
  function snapshot() {
    const sc = document.getElementById("screen-content");
    const body = sc.innerText.replace(/^.*\[?← MENU.*\n?/m, "").replace(/\n{3,}/g, "\n\n").trim();
    const ins = [...sc.querySelectorAll("input,select,textarea")].filter(el => el.value && el.type !== "button" && el.id !== "menu-filter")
      .map(el => `${(el.getAttribute("aria-label") || el.placeholder || el.id || el.name || "campo").trim()}: ${el.value}`);
    return `${document.title}\n${new Date().toLocaleString("pt-BR")}\n${"=".repeat(40)}\n${ins.length ? "ENTRADAS\n" + ins.join("\n") + "\n\nRESULTADO\n" : ""}${body}\n`;
  }
  const origTool = window.renderToolInner;
  window.renderToolInner = function (id) {
    origTool(id);
    const bar = document.querySelector("#screen-content > div.mb-2");
    if (!bar) return;
    bar.insertAdjacentHTML("beforeend", ` <button class="dos-btn" data-x="copy" title="Copiar entradas e resultado">COPIAR</button> <button class="dos-btn" data-x="txt" title="Baixar como .txt">TXT</button> <button class="dos-btn" data-x="print" title="Imprimir ou salvar em PDF">PDF</button>`);
    bar.addEventListener("click", e => {
      const x = e.target.dataset && e.target.dataset.x; if (!x) return;
      const text = snapshot();
      if (x === "copy") {
        (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => showToast("Copiado para a área de transferência."))
          .catch(() => { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); showToast("Copiado."); });
      } else if (x === "txt") {
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
        a.download = `chemos-modulo-${parseInt(id)}.txt`; a.click(); URL.revokeObjectURL(a.href);
      } else window.print();
    });
  };

  const foot = document.querySelector("footer .flex");
  if (foot) foot.insertAdjacentHTML("beforeend", `<span><strong class="px-1 border border-current cursor-pointer" onclick="openPalette()" role="button" tabindex="0" onkeydown="if(event.key==='Enter')openPalette()">CTRL+K</strong> Buscar</span>`);
})();
