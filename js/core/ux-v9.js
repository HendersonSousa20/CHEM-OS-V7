/* v9.0 — UX: trilhas e descrições na home, ajuda por módulo, cálculo ao vivo, casas decimais, modo leitura,
   barra inferior no celular, ações recolhidas, ajustes e painel de progresso. */
(function () {
  const $ = id => document.getElementById(id), sc = () => $("screen-content");
  const H = window.MODULE_HELP || {}, G = window.GLOSSARY || {};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const S = { live: ls.get("chemos-live", true), dec: ls.get("chemos-dec", "auto"), sep: ls.get("chemos-sep", "comma"), read: ls.get("chemos-reading", false) };
  const applyRead = () => document.documentElement.classList.toggle("reading-mode", !!S.read); applyRead();
  const LIVE = new Set([3, 5, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 27, 29, 30, 31]), INITIAL = new Set([3, 5, 9, 10, 12, 14, 16, 18, 19, 27, 29, 30, 31]);
  let cur = 0, quiet = false, liveT = null;
  const ob = window.playBeep; if (ob) window.playBeep = function () { if (!quiet) return ob.apply(this, arguments); };

  // ---------- Casas decimais nos resultados ----------
  const seen = new WeakMap();
  const RE = /(?<![\d.,])(-?\d+)([.,])(\d+)(?!\d|[eE][+-]?\d)/g;
  // Separador decimal: em "vírgula" (padrão pt-BR) troca o ponto decimal por vírgula nos resultados dos cálculos.
  // Não mexe em fórmulas (CuSO4.5H2O) nem em números colados a letras; PubChem e nomes IUPAC (localizadores 2,2-) ficam de fora.
  const RE2 = /(?<![\w.,])(-?\d+)\.(\d+)(?=[eE][+-]?\d|(?![\w.,]))/g;
  const sepText = (t, sep) => sep === "comma" ? t.replace(RE2, "$1,$2") : t;
  function roundResults() {
    const N = S.dec === "auto" ? null : +S.dec;
    document.querySelectorAll('#screen-content [id$="-result"]:not(#pubchem-result):not(#resolver-result)').forEach(box => {
      const w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const info = seen.get(n), base = info && n.nodeValue === info.out ? info.orig : n.nodeValue;
        const r = N === null ? base : base.replace(RE, (m, i, sep, f) => f.length > N ? (+(i + "." + f)).toFixed(N).replace(".", sep) : m), out = sepText(r, S.sep);
        if (out !== n.nodeValue) n.nodeValue = out;
        seen.set(n, { orig: base, out });
      }
    });
  }
  window.ChemRound = { sepText, roundText: (t, N) => t.replace(RE, (m, i, sep, f) => f.length > N ? (+(i + "." + f)).toFixed(N).replace(".", sep) : m) };
  let rt = null; const scEl = sc();
  if (scEl) new MutationObserver(() => { clearTimeout(rt); rt = setTimeout(roundResults, 0); }).observe(scEl, { childList: true, subtree: true, characterData: true });

  window.ChemUX = { S, get cur() { return cur; }, LIVE, INITIAL }; // estado exposto para testes

  // ---------- Cálculo ao vivo ----------
  const RUN = /^\s*(run|calc|solve|resolve|balance|gerar)/i;
  const runnerFor = el => { for (let n = el.parentElement; n && n.id !== "screen-content"; n = n.parentElement) { const b = [...n.querySelectorAll("button")].find(x => RUN.test(x.getAttribute("onclick") || "")); if (b) return b; } return [...scEl.querySelectorAll("button")].find(x => RUN.test(x.getAttribute("onclick") || "")) || null; };
  const quietRun = b => { quiet = true; try { b.click(); } finally { quiet = false; } };
  ["input", "change"].forEach(ev => document.addEventListener(ev, e => {
    if (!S.live || !LIVE.has(cur) || !scEl.contains(e.target) || e.target.closest('[id$="-result"]') || (ev === "input" && e.target.tagName === "SELECT")) return;
    clearTimeout(liveT); liveT = setTimeout(() => { if (scEl.querySelector('[aria-invalid="true"]')) return; const b = runnerFor(e.target); if (b) quietRun(b); }, 700);
  }));

  // ---------- Módulo: descrição, teoria e barra de ações ----------
  const termRe = new RegExp("(?<![\\wÀ-ÿ])(" + Object.keys(G).sort((a, b) => b.length - a.length).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")(?![\\wÀ-ÿ])", "g");
  const withTips = t => esc(t).replace(termRe, (m) => G[m.replace(/&amp;/g, "&")] ? `<abbr title="${esc(G[m])}" class="gloss">${m}</abbr>` : m);
  const visitedAdd = n => { const v = ls.get("chemos-visited", []); if (!v.includes(n)) ls.set("chemos-visited", [...v, n]); ls.set("chemos-last", n); };

  const oTool = window.renderToolInner;
  window.renderToolInner = function (id) {
    oTool(id); const n = parseInt(id); cur = n; visitedAdd(n);
    const s = sc(), head = s.querySelector(".text-xl"), info = H[n];
    if (head && info) head.insertAdjacentHTML("afterend", `<div class="mod-desc text-sm mb-2">${esc(info[0])}${S.live && LIVE.has(n) ? ' <span class="live-flag" title="O resultado atualiza enquanto você digita">⚡ ao vivo</span>' : ""}</div>
      <details class="mod-help mb-3 text-sm"><summary>Teoria, fórmula e glossário</summary><div class="mt-2"><div class="font-bold">Fórmula-chave</div><div class="dos-border p-2 my-1">${esc(info[1])}</div><div>${withTips(info[2])}</div></div></details>`);
    const bar = s.querySelector("div.mb-2");
    if (bar && !bar.querySelector(".bar-more")) {
      const keep = b => /MENU/.test(b.textContent) || b.id === "fav-toggle", more = document.createElement("span"); more.className = "bar-more";
      [...bar.querySelectorAll("button")].filter(b => !keep(b)).forEach(b => more.appendChild(b));
      bar.appendChild(more); bar.insertAdjacentHTML("beforeend", ` <button class="dos-btn bar-more-toggle" aria-expanded="false" aria-label="Mais ações">⋯ MAIS</button>`);
      bar.querySelector(".bar-more-toggle").onclick = e => { const o = more.classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", o); };
    }
    if (INITIAL.has(n) && S.live) { const b = [...s.querySelectorAll("button")].find(x => RUN.test(x.getAttribute("onclick") || "")); if (b) quietRun(b); }
  };

  // ---------- Home: boas-vindas, trilhas e descrições ----------
  const short = n => (H[n] && H[n][3]) || "Módulo " + n;
  const oHome = window.renderHomeInner;
  window.renderHomeInner = function () {
    oHome(); cur = 0;
    const box = $("menu-groups"); if (!box) return;
    box.querySelectorAll(".menu-item").forEach(b => {
      const n = +(b.getAttribute("onclick").match(/\d+/) || [0])[0], d = H[n]; if (!d || b.querySelector(".menu-desc")) return;
      b.insertAdjacentHTML("beforeend", `<small class="menu-desc block">${esc(d[0])}</small>`); b.dataset.search = (b.dataset.search || "") + " " + d[0].toLowerCase() + " " + d[3].toLowerCase(); b.title = d[0];
    });
    const seenSet = new Set(ls.get("chemos-visited", [])), last = ls.get("chemos-last", 0);
    const tracks = (window.TRACKS || []).map(([name, ids]) => `<div class="track"><strong>${esc(name)}</strong> ${ids.map((n, i) => `${i ? '<span aria-hidden="true">→</span>' : ""}<button class="dos-btn track-step" onclick="renderTool(${n})">${seenSet.has(n) ? "✓ " : ""}${esc(short(n))}</button>`).join(" ")}</div>`).join("");
    const welcome = ls.get("chemos-welcome", false) ? "" : `<div class="dos-border p-3 mb-3 text-sm" id="welcome-box"><strong>Bem-vindo ao CHEM.OS!</strong> São ${Object.keys(H).length} módulos de química. Não sabe por onde começar? Siga uma trilha abaixo, use a busca (ou <kbd>Ctrl</kbd>+<kbd>K</kbd>) e abra <em>Teoria, fórmula e glossário</em> dentro de cada módulo.
      <div class="mt-2"><button class="dos-btn" onclick="localStorage.setItem('chemos-welcome','true');this.closest('#welcome-box').remove()">ENTENDI</button></div></div>`;
    $("menu-groups").parentElement.insertAdjacentHTML("afterbegin", `${welcome}<section class="mb-3" aria-label="Trilhas sugeridas"><h2 class="menu-heading">TRILHAS SUGERIDAS${last && H[last] ? ` · <button class="dos-btn" onclick="renderTool(${last})">CONTINUAR: ${esc(short(last))}</button>` : ""}</h2>${tracks}</section>`);
  };

  // ---------- Ajustes e progresso ----------
  const toggleBtn = (act, on, label) => `<button class="dos-btn" data-act="${act}" aria-pressed="${on}">${label}: ${on ? "ligado" : "desligado"}</button>`;
  window.showSettings = function () {
    openModal("AJUSTES", `<div class="space-y-3 text-sm" id="settings-body">
      <div><div class="font-bold mb-1">Tema</div>${["green:Verde", "amber:Âmbar", "blue:Azul", "mono:Mono", "paper:Papel"].map(t => `<button class="dos-btn" data-act="theme" data-v="${t.split(":")[0]}">${t.split(":")[1]}</button>`).join(" ")}</div>
      <div><div class="font-bold mb-1">Texto</div><button class="dos-btn" data-act="font" data-v="-0.1">A−</button> <button class="dos-btn" data-act="font" data-v="0.1">A+</button> ${toggleBtn("read", S.read, "Modo leitura")}</div>
      <div><div class="font-bold mb-1">Efeitos</div><button class="dos-btn" data-act="crt">Efeito CRT</button> <button class="dos-btn" data-act="sound">Som</button></div>
      <div><div class="font-bold mb-1">Cálculos</div>${toggleBtn("live", S.live, "Cálculo ao vivo")} <label>Separador decimal <select id="set-sep" class="dos-input p-1"><option value="comma"${S.sep === "comma" ? " selected" : ""}>vírgula (1,5)</option><option value="auto"${S.sep === "auto" ? " selected" : ""}>como vem do módulo</option></select></label> <label>Casas decimais <select id="set-dec" class="dos-input p-1">${["auto", "2", "3", "4", "6"].map(v => `<option value="${v}"${String(S.dec) === v ? " selected" : ""}>${v === "auto" ? "automático" : v}</option>`).join("")}</select></label></div>
      <div><div class="font-bold mb-1">Seus dados</div><button class="dos-btn" data-act="progress">Favoritos e progresso</button> <button class="dos-btn" data-act="export">Exportar backup</button> <button class="dos-btn" data-act="import">Importar backup</button> <button class="dos-btn" data-act="help">Ajuda</button> <button class="dos-btn" data-act="about">Sobre e limitações</button></div></div>`);
    const body = $("modal-body");
    body.onclick = e => {
      const b = e.target.closest("button[data-act]"); if (!b) return; const a = b.dataset.act, v = b.dataset.v;
      if (a === "theme") setTheme(v); else if (a === "font") chemosFont(+v); else if (a === "crt" && typeof toggleCRT === "function") toggleCRT(); else if (a === "sound" && typeof toggleSound === "function") toggleSound();
      else if (a === "read") { S.read = !S.read; ls.set("chemos-reading", S.read); applyRead(); showSettings(); }
      else if (a === "live") { S.live = !S.live; ls.set("chemos-live", S.live); showSettings(); }
      else if (a === "progress") showProgress(); else if (a === "export") exportData(); else if (a === "import") importData(); else if (a === "help") { closeModal(); showHelp(); } else if (a === "about") { closeModal(); showAbout(); }
    };
    body.onchange = e => { if (e.target.id === "set-dec") { S.dec = e.target.value; ls.set("chemos-dec", S.dec); roundResults(); } else if (e.target.id === "set-sep") { S.sep = e.target.value; ls.set("chemos-sep", S.sep); roundResults(); } };
  };
  window.showProgress = function () {
    const vis = ls.get("chemos-visited", []), fav = ls.get("chemos-fav", []), rec = ls.get("chemos-recent", []), hist = ls.get("chemos-history", []), last = ls.get("chemos-last", 0);
    const total = Object.keys(H).length, list = a => a.length ? a.filter(n => H[n]).map(n => `<button class="dos-btn" data-open="${n}">${esc(short(n))}</button>`).join(" ") : '<span class="opacity-70">nenhum ainda</span>';
    let best = 0, wrong = 0; try { best = +localStorage.getItem("chemos-quiz-best") || 0; wrong = (JSON.parse(localStorage.getItem("chemos-quiz-wrong")) || []).length; } catch (e) {}
    openModal("FAVORITOS E PROGRESSO", `<div class="space-y-3 text-sm"><div class="font-bold">Módulos visitados: ${vis.filter(n => H[n]).length} de ${total}</div>
      <div class="dos-border" style="height:10px" role="img" aria-label="Progresso"><div style="height:100%;width:${Math.round(100 * vis.filter(n => H[n]).length / total)}%;background:var(--text-color)"></div></div>
      ${last && H[last] ? `<div>Continuar de onde parou: <button class="dos-btn" data-open="${last}">${esc(short(last))}</button></div>` : ""}
      <div><div class="font-bold mb-1">★ Favoritos</div>${list(fav)}</div><div><div class="font-bold mb-1">Recentes</div>${list(rec)}</div>
      <div>Cálculos no histórico: <strong>${hist.length}</strong> <button class="dos-btn" data-hist="1">ABRIR HISTÓRICO</button></div>
      <div>Quiz: melhor <strong>${best}/10</strong> · ${wrong} elemento(s) para revisar</div></div>`);
    $("modal-body").onclick = e => { const b = e.target.closest("button"); if (!b) return; if (b.dataset.open) { closeModal(); renderTool(+b.dataset.open); } else if (b.dataset.hist) { closeModal(); showHistory(); } };
  };
  if (window.__palActions) window.__palActions.push(["Ajustes", () => showSettings()], ["Favoritos e progresso", () => showProgress()], ["Modo leitura (ligar/desligar)", () => { S.read = !S.read; ls.set("chemos-reading", S.read); applyRead(); }],
    ["Cálculo ao vivo (ligar/desligar)", () => { S.live = !S.live; ls.set("chemos-live", S.live); showToast("Cálculo ao vivo: " + (S.live ? "ligado" : "desligado")); }]);

  // ---------- Barra inferior (celular) ----------
  const nav = document.createElement("nav"); nav.id = "mobile-nav"; nav.setAttribute("aria-label", "Navegação principal");
  nav.innerHTML = `<button onclick="renderHome()">☰<span>MENU</span></button><button onclick="openPalette()">⌕<span>BUSCAR</span></button><button onclick="showProgress()">★<span>FAVORITOS</span></button><button onclick="showSettings()">⚙<span>AJUSTES</span></button>`;
  document.body.appendChild(nav);
})();
