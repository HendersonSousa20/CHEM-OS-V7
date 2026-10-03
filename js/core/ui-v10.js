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
