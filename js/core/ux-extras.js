/* UX extras: menu categorizado com busca, toast, atalhos, feedback de comando inválido. */
(function () {
  const GROUPS = [
    ["CÁLCULOS BÁSICOS", [1, 3, 4, 5, 8, 11, 26, 27, 29]],
    ["ÁCIDO-BASE E EQUILÍBRIO", [6, 10, 15, 16, 18, 19]],
    ["FÍSICO-QUÍMICA E ANÁLISE", [9, 12, 14, 17, 30, 31]],
    ["DADOS E REFERÊNCIA (ONLINE)", [2, 7, 13]],
    ["LABORATÓRIO, ESTUDO E JOGOS", [23, 24, 25, 28, 21, 22]],
    ["SISTEMA", [20]]
  ];

  window.showToast = function (msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
  };

  const origHome = window.renderHomeInner;
  window.renderHomeInner = function () {
    origHome();
    const grid = document.querySelector("#screen-content .grid");
    if (!grid) return;
    const items = {};
    grid.querySelectorAll("button").forEach(b => {
      const n = +(b.getAttribute("onclick").match(/\d+/) || [0])[0];
      items[n] = { n, text: b.textContent.replace(/^\d+\.\s*/, "").trim(), cls: b.className.includes("yellow") ? "yellow" : b.className.includes("cyan") ? "cyan" : "" };
    });
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <label for="menu-filter" class="sr-only">Filtrar módulos</label>
      <input id="menu-filter" type="search" class="dos-input w-full mb-3 text-lg" autocomplete="off"
             placeholder="Filtrar módulos… (ex: ph, gases, titulação)  ·  tecla / foca o comando">
      <div id="menu-groups">${GROUPS.map(([title, ids]) => `
        <section class="menu-group mb-3">
          <h2 class="menu-heading">${title}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">${ids.filter(i => items[i]).map(i => `
            <button onclick="renderTool(${i})" data-search="${items[i].text.toLowerCase()} ${i}" class="menu-item ${items[i].cls}"><span class="menu-num">${String(i).padStart(2, "0")}</span> ${items[i].text}</button>`).join("")}
          </div>
        </section>`).join("")}
      </div>
      <p id="menu-empty" class="hidden opacity-80">Nenhum módulo encontrado.</p>`;
    grid.replaceWith(wrap);
    const f = wrap.querySelector("#menu-filter");
    f.addEventListener("input", () => {
      const q = f.value.trim().toLowerCase(); let any = false;
      wrap.querySelectorAll(".menu-item").forEach(b => { const ok = !q || b.dataset.search.includes(q); b.classList.toggle("hidden", !ok); any = any || ok; });
      wrap.querySelectorAll(".menu-group").forEach(g => g.classList.toggle("hidden", !g.querySelector(".menu-item:not(.hidden)")));
      document.getElementById("menu-empty").classList.toggle("hidden", any);
    });
    f.addEventListener("keydown", e => { if (e.key === "Enter") { const b = wrap.querySelector(".menu-item:not(.hidden)"); if (b) b.click(); } });
  };

  window.addEventListener("keydown", e => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "/" && tag !== "input" && tag !== "textarea" && tag !== "select") { e.preventDefault(); document.getElementById("cli-input").focus(); }
  });

  const cli = document.getElementById("cli-input");
  if (cli) {
    cli.removeAttribute("autofocus");
    if (window.matchMedia && window.matchMedia("(pointer:fine)").matches) cli.focus(); // evita abrir o teclado no celular
    cli.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      const raw = cli.value.trim(), c = raw.toLowerCase();
      const known = /^(exit|home|menu|cls|clear|help|ajuda|\?|test|testes|estrutura|editor|simulacao|simulação|md|experimento|laboratorio|lab|estudar|guia|detetive|caso|conversor|conv|formula|fórmula|quiz|mol|nox|ligacao|ligação|en|oxidacao|oxidação|hist|histórico|historico)$/;
      const pref = /^(pubchem|balance|resolve) /;
      if (raw && !known.test(c) && !pref.test(c) && !(!isNaN(c) && c >= 1 && c <= 31))
        showToast(`Comando "${raw}" não reconhecido. Digite "ajuda" ou um número de 1 a 31.`);
    }, true);
  }
})();
