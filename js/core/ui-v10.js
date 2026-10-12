/* Busca sem acento e sem diferença de maiúsculas: "titulacao" encontra "Titulação". */
window.chemFold = function (s) { try { return String(s == null ? "" : s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); } catch (e) { return String(s).toLowerCase(); } };

/* Casamento de busca tolerante a plural: "ligacao" acha "ligações", "acidos" acha "ácido", "gases" acha "gás". */
window.chemMatch = function (hay, q) {
  var h = chemFold(hay), s = chemFold(q).trim(); if (!s) return true; if (h.indexOf(s) > -1) return true;
  var m = s.match(/^(.*?)(\S+)$/), pre = m ? m[1] : "", w = m ? m[2] : s, v = [];
  if (/oes$/.test(w)) v.push(w.replace(/oes$/, "ao"), w.replace(/oes$/, "oes").slice(0, -1));
  if (/aes$/.test(w)) v.push(w.replace(/aes$/, "ao"));
  if (/ao$/.test(w)) v.push(w.replace(/ao$/, "oes"), w.replace(/ao$/, "aes"));
  if (/(r|s|z)es$/.test(w)) v.push(w.slice(0, -2));
  if (/s$/.test(w)) v.push(w.slice(0, -1));
  if (w.length > 2) v.push(w + "s", w + "es");
  return v.some(function (x) { return h.indexOf(pre + x) > -1; });
};

/* CHEM.OS v10 — refinamentos de UX: sem saltos de rolagem, voltar ao topo, realce de resultados */
(function () {
  "use strict";
  // 1) Focar a linha de comando não deve rolar a página para o fim (bug de "pulo" ao abrir o menu).
  var cli = document.getElementById("cli-input");
  if (cli) { var nativeFocus = cli.focus; cli.focus = function (o) { return nativeFocus.call(cli, Object.assign({ preventScroll: true }, o || {})); }; }

  // 2) Ao trocar de tela, volta ao topo (suave, respeitando "menos movimento").
  function toTop() { var v = document.getElementById("viewport"); if (v) v.scrollTop = 0; document.documentElement.scrollTop = 0; document.body.scrollTop = 0; }
  ["renderHome", "renderTool"].forEach(function (n) {
    var f = window[n]; if (typeof f !== "function") return;
    window[n] = function () { var r = f.apply(this, arguments); toTop(); return r; };
  });

  // 3) Botão "voltar ao topo" aparece depois de rolar.
  var b = document.createElement("button");
  b.id = "to-top"; b.type = "button"; b.textContent = "↑"; b.setAttribute("aria-label", "Voltar ao topo");
  b.onclick = function () { var v = document.getElementById("viewport"); if (v && v.scrollTo) v.scrollTo({ top: 0, behavior: "smooth" }); if (window.scrollTo) { try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {} } };
  document.body.appendChild(b);
  function onScroll() { var v = document.getElementById("viewport"); var y = Math.max(window.scrollY, v ? v.scrollTop : 0); b.classList.toggle("show", y > 500); }
  window.addEventListener("scroll", onScroll, { passive: true });
  var vp = document.getElementById("viewport"); if (vp) vp.addEventListener("scroll", onScroll, { passive: true });

  // 4) Realça (flash) a caixa de resultado quando o texto muda, para o olho achar a resposta.
  var sc = document.getElementById("screen-content");
  if (sc && window.MutationObserver) {
    var t;
    new MutationObserver(function (ms) {
      clearTimeout(t);
      t = setTimeout(function () {
        ms.forEach(function (m) {
          var el = m.target.nodeType === 3 ? m.target.parentElement : m.target;
          var box = el && el.closest && el.closest('[id^="res"],[id$="-result"],[id$="-res"],[id$="-out"]');
          if (box && box !== sc) { box.classList.remove("result-flash"); void box.offsetWidth; box.classList.add("result-flash"); }
        });
      }, 60);
    }).observe(sc, { childList: true, subtree: true, characterData: true });
  }
})();

/* ===== Rodada 2: Enter calcula, foco automático e seleção ao focar ===== */
(function () {
  "use strict";
  var sc = document.getElementById("screen-content"); if (!sc) return;
  var touch = window.matchMedia && matchMedia("(hover: none)").matches;
  var SKIP = /^(\s*(←|→|☆|★|⋯|⇄)|.*(MENU|FAVORIT|MAIS|CANCELAR|LIMPAR|VOLTAR|FECHAR))/i;

  // Enter dentro de um campo aciona o botão principal do mesmo bloco (CALCULAR, BUSCAR, CONVERTER...).
  sc.addEventListener("keydown", function (e) {
    var t = e.target;
    if (e.key !== "Enter" || e.shiftKey || e.ctrlKey || e.altKey || e.isComposing) return;
    if (!t || t.tagName !== "INPUT" || /^(button|checkbox|radio|submit|range|file)$/.test(t.type)) return;
    var ok = function (x) { return !x.disabled && !x.classList.contains("unit-btn") && !SKIP.test((x.textContent || "").trim()); };
    var MAIN = /^\s*(CALC|RESOLV|CONVERT|BALANC|GER|EXECUT|SIMUL|CONSULT|TITUL|PLOT|IDENTIF|ANALIS|ENCONTR|OK)/i;
    var btn = null, row = t.parentElement;
    // 1) botão na própria linha do campo (ex.: nome + BUSCAR); 2) verbo principal do bloco; 3) primeiro botão útil.
    if (row && row !== sc) btn = Array.prototype.find.call(row.querySelectorAll("button"), ok);
    var box = t.closest(".dos-border") || row;
    while (box && box !== sc && !btn) {
      var all = Array.prototype.filter.call(box.querySelectorAll("button"), ok);
      btn = all.find(function (x) { return MAIN.test(x.textContent); }) || all[0] || null;
      if (!btn) box = box.parentElement;
    }
    if (btn) { e.preventDefault(); btn.click(); }
  });

  // Ao focar um campo numérico/texto curto, seleciona tudo para digitar por cima.
  sc.addEventListener("focusin", function (e) {
    var t = e.target;
    if (t && t.tagName === "INPUT" && /^(text|number|)$/.test(t.type) && !t.readOnly) { try { t.select(); } catch (x) {} }
  });

  // Em computador, abrir um módulo já foca o primeiro campo (sem rolar a página).
  var rt = window.renderTool;
  if (typeof rt === "function" && !touch) {
    window.renderTool = function () {
      var r = rt.apply(this, arguments);
      setTimeout(function () {
        var f = sc.querySelector(".dos-border input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([readonly]), .dos-border select");
        if (f && !document.querySelector("#modal:not(.hidden)")) f.focus({ preventScroll: true });
      }, 120);
      return r;
    };
  }

  // Dica discreta sob os formulários.
  if (!touch && window.MutationObserver) {
    new MutationObserver(function () {
      sc.querySelectorAll(".dos-border").forEach(function (b) {
        if (b.dataset.hint || !b.querySelector("input:not([type=checkbox]):not([type=radio]):not([type=range])")) return;
        if (!Array.prototype.some.call(b.querySelectorAll("button"), function (x) { return !SKIP.test(x.textContent.trim()); })) return;
        b.dataset.hint = "1"; var h = document.createElement("div"); h.className = "enter-hint"; h.textContent = "Enter ↵ para calcular"; b.appendChild(h);
      });
    }).observe(sc, { childList: true, subtree: true });
  }
})();

/* ===== Rodada 3: navegação por setas nos cartões ===== */
(function () {
  "use strict";
  var sc = document.getElementById("screen-content"); if (!sc) return;
  // Setas: navegam entre os cartões do início (e ↓ no filtro entra na lista).
  sc.addEventListener("keydown", function (e) {
    if (!/^Arrow(Up|Down|Left|Right)$/.test(e.key) || e.altKey || e.ctrlKey || e.metaKey) return;
    var cards = Array.prototype.filter.call(sc.querySelectorAll(".menu-item"), function (c) { return c.offsetParent !== null; });
    if (!cards.length) return;
    var t = e.target, i = cards.indexOf(t.closest ? t.closest(".menu-item") : null);
    if (i < 0) {
      if (t.tagName === "INPUT" && e.key === "ArrowDown" && /filtr/i.test(t.placeholder || "")) { e.preventDefault(); cards[0].focus(); }
      return;
    }
    e.preventDefault();
    var cur = cards[i].getBoundingClientRect(), best = null, bd = 1e9;
    cards.forEach(function (c, j) {
      if (j === i) return; var r = c.getBoundingClientRect(), dx = r.left - cur.left, dy = r.top - cur.top, ok, d;
      if (e.key === "ArrowDown") { ok = dy > 8; d = dy * 4 + Math.abs(dx); }
      else if (e.key === "ArrowUp") { ok = dy < -8; d = -dy * 4 + Math.abs(dx); }
      else if (e.key === "ArrowRight") { ok = Math.abs(dy) < 8 && dx > 8; d = dx; }
      else { ok = Math.abs(dy) < 8 && dx < -8; d = -dx; }
      if (ok && d < bd) { bd = d; best = c; }
    });
    if (best) { best.focus(); best.scrollIntoView({ block: "nearest" }); }
  });
})();

/* ===== Rodada 4: carregamento nos botões, instalar app, erros amigáveis, acessibilidade ===== */
(function () {
  "use strict";
  var sc = document.getElementById("screen-content"); if (!sc) return;
  var toast = function (m) { if (typeof window.showToast === "function") window.showToast(m); };

  // 1) Botões que consultam a internet mostram "carregando" até a tela se estabilizar (máx. 8 s).
  var NET = /BUSCAR|CONSULT|RESOLV|PUBCHEM|WIKI|CARREGAR|\bAPI\b|IDENTIFIC.*NOME/i;
  sc.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("button"); if (!b || b.classList.contains("is-busy") || !NET.test(b.textContent || "")) return;
    var t0 = Date.now(), quiet, mo, done = function () { b.classList.remove("is-busy"); b.removeAttribute("aria-busy"); if (mo) mo.disconnect(); clearTimeout(quiet); clearTimeout(cap); };
    var cap = setTimeout(done, 8000);
    b.classList.add("is-busy"); b.setAttribute("aria-busy", "true");
    if (!window.MutationObserver) return;
    mo = new MutationObserver(function () { if (Date.now() - t0 < 150) return; clearTimeout(quiet); quiet = setTimeout(done, 450); });
    mo.observe(sc, { childList: true, subtree: true, characterData: true });
  }, true);

  // 2) Botão [INSTALAR] aparece no cabeçalho quando o navegador permite instalar o app (PWA).
  var deferred = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferred = e;
    var clock = document.getElementById("clock"); if (!clock || document.getElementById("pwa-install")) return;
    var b = document.createElement("button"); b.id = "pwa-install"; b.type = "button"; b.className = "dos-btn text-xs"; b.textContent = "[INSTALAR]";
    b.title = "Instalar o CHEM.OS como aplicativo (funciona offline)";
    b.onclick = function () { if (!deferred) return; deferred.prompt(); deferred.userChoice.then(function () { deferred = null; b.remove(); }); };
    clock.parentNode.insertBefore(b, clock);
  });
  window.addEventListener("appinstalled", function () { var b = document.getElementById("pwa-install"); if (b) b.remove(); toast("CHEM.OS instalado!"); });

  // 3) Erros inesperados viram um aviso claro (sem expor stack trace), no máx. 1 a cada 6 s.
  var last = 0;
  function oops(msg) { if (Date.now() - last < 6000) return; last = Date.now(); toast("Algo deu errado neste módulo. Tente de novo ou volte ao menu (ESC)."); if (window.console) console.warn("[CHEM.OS]", msg); }
  window.addEventListener("error", function (e) { if (e.target === window && e.error) oops(e.message); });
  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason, m = String((r && r.message) || r || "");
    if ((r && r.name === "AbortError") || /Failed to fetch|NetworkError|Load failed/i.test(m)) return;
    oops(m);
  });

  // 4) Aviso de nova versão (service worker atualizado).
  if ("serviceWorker" in navigator) navigator.serviceWorker.getRegistration().then(function (reg) {
    if (!reg) return;
    reg.addEventListener("updatefound", function () {
      var w = reg.installing; if (!w) return;
      w.addEventListener("statechange", function () { if (w.state === "installed" && navigator.serviceWorker.controller) toast("Nova versão disponível — recarregue a página (Ctrl+R) para atualizar."); });
    });
  });

  // 5) Leitores de tela anunciam automaticamente os resultados.
  var SEL = '[id^="res"],[id$="-result"],[id$="-res"],[id$="-out"]';
  function mark() { sc.querySelectorAll(SEL).forEach(function (el) { if (!el.hasAttribute("aria-live")) { el.setAttribute("aria-live", "polite"); el.setAttribute("role", "status"); } }); }
  if (window.MutationObserver) new MutationObserver(mark).observe(sc, { childList: true, subtree: true }); mark();
})();

/* ===== Rodada 5: Tabela Periódica (módulo 7) no formato oficial (grupos 1–18, períodos 1–7, bloco f abaixo) ===== */
(function () {
  "use strict";
  var sc = document.getElementById("screen-content"); if (!sc || !window.MutationObserver) return;
  // Z → [linha, coluna]. Linhas 1–7 = períodos; linha 8 = espaço; 9 = lantanídeos; 10 = actinídeos.
  function pos(z) {
    if (z === 1) return [1, 1]; if (z === 2) return [1, 18];
    if (z <= 4) return [2, z - 2]; if (z <= 10) return [2, z + 8];
    if (z <= 12) return [3, z - 10]; if (z <= 18) return [3, z];
    if (z <= 36) return [4, z - 18]; if (z <= 54) return [5, z - 36];
    if (z <= 56) return [6, z - 54]; if (z <= 71) return [9, z - 54];       // La–Lu em 3..17
    if (z <= 86) return [6, z - 68];
    if (z <= 88) return [7, z - 86]; if (z <= 103) return [10, z - 86];      // Ac–Lr em 3..17
    return [7, z - 100];                                                     // Rf–Og em 4..18
  }
  function apply() {
    sc.querySelectorAll(".grid, [style*='grid']").forEach(function (g) {
      if (g.dataset.ptLayout || g.children.length < 100) return;
      var cells = Array.prototype.slice.call(g.children), ok = true, zs = [];
      cells.forEach(function (c) { var z = parseInt((c.textContent || "").trim(), 10); if (!(z >= 1 && z <= 118)) ok = false; zs.push(z); });
      if (!ok) return;
      g.dataset.ptLayout = "1";
      g.style.gridTemplateRows = "auto auto repeat(7, auto) 14px auto auto"; g.style.gridTemplateColumns = "2.2rem repeat(18, minmax(0, 1fr))";
      g.style.minWidth = "800px"; if (g.parentElement) g.parentElement.style.overflowX = "auto";
      cells.forEach(function (c, i) { var p = pos(zs[i]); c.style.gridRow = p[0] + 2; c.style.gridColumn = p[1] + 1; });
      var L = function (txt, cls, row, c1, c2) { var e = document.createElement("div"); e.className = "pt-label " + cls; e.textContent = txt; e.setAttribute("aria-hidden", "true"); e.style.gridRow = row; e.style.gridColumn = c2 ? c1 + " / " + c2 : c1; g.appendChild(e); };
      L("s", "pt-block", 1, 2, 4); L("d", "pt-block", 1, 4, 14); L("p", "pt-block", 1, 14, 20);
      for (var gi = 1; gi <= 18; gi++) L(String(gi), "pt-group", 2, gi + 1);
      for (var pi = 1; pi <= 7; pi++) L(String(pi), "pt-period", pi + 2, 1);
      L("6", "pt-period", 11, 1); L("7", "pt-period", 12, 1);
      [["57–71", 8], ["89–103", 9]].forEach(function (m) {
        var d = document.createElement("div"); d.className = "pt-marker"; d.textContent = m[0]; d.setAttribute("aria-hidden", "true");
        d.style.gridRow = m[1]; d.style.gridColumn = 4; g.appendChild(d);
      });
    });
  }
  new MutationObserver(apply).observe(sc, { childList: true, subtree: true }); apply();
})();
