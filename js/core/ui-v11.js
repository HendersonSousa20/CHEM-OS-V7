/* CHEM.OS v11.4 — acabamento visual: herói, faixa de números, atalhos, contagem por seção, etiqueta NOVO e caminho de navegação. */
(function () {
  "use strict";
  var sc = document.getElementById("screen-content"); if (!sc || !window.MutationObserver) return;
  var GROUPS = [["CÁLCULOS BÁSICOS", [1, 3, 4, 5, 8, 11, 26, 27, 29]], ["ÁCIDO-BASE E EQUILÍBRIO", [6, 10, 15, 16, 18, 19]], ["FÍSICO-QUÍMICA E ANÁLISE", [9, 12, 14, 17, 30, 31, 32, 33, 34]], ["DADOS E REFERÊNCIA", [2, 7, 13]], ["LABORATÓRIO, ESTUDO E JOGOS", [23, 24, 25, 28, 21, 22]], ["SISTEMA", [20]]];
  var groupOf = function (n) { for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i][1].indexOf(n) > -1) return GROUPS[i][0]; return ""; };
  var key = function (k, o) { document.dispatchEvent(new KeyboardEvent("keydown", Object.assign({ key: k, bubbles: true, cancelable: true }, o || {}))); };

  function enhanceHome() {
    var hero = sc.querySelector(".font-bold.leading-none"); if (!hero || hero.dataset.v11) return;
    hero.dataset.v11 = "1"; hero.classList.add("hero-title");
    var items = sc.querySelectorAll(".menu-item"), topics = typeof GC_TOPICS !== "undefined" ? GC_TOPICS.length : 16;
    var sub = hero.nextElementSibling;
    var rib = document.createElement("div"); rib.className = "hero-ribbon";
    ["" + items.length + " módulos", topics + " tópicos de estudo", "100% no navegador", "funciona offline", "sem cadastro"].forEach(function (t) { var s = document.createElement("span"); s.textContent = t; rib.appendChild(s); });
    var act = document.createElement("div"); act.className = "hero-actions";
    [["BUSCAR", "Ctrl+K", function () { key("k", { ctrlKey: true }); }], ["AJUDA", "F1", function () { key("F1"); }], ["TESTES", "F4", function () { key("F4"); }]].forEach(function (a) {
      var b = document.createElement("button"); b.type = "button"; b.className = "dos-btn"; b.innerHTML = a[0] + "<kbd>" + a[1] + "</kbd>"; b.onclick = a[2]; act.appendChild(b);
    });
    (sub || hero).insertAdjacentElement("afterend", act); (sub || hero).insertAdjacentElement("afterend", rib);
  }
  function enhanceCards() {
    sc.querySelectorAll("h2.menu-heading:not([data-v11])").forEach(function (h) {
      var n = 0, e = h.nextElementSibling; while (e && !e.matches("h2.menu-heading")) { n += e.matches(".menu-item") ? 1 : e.querySelectorAll(".menu-item").length; e = e.nextElementSibling; }
      h.dataset.v11 = "1"; if (n) { var c = document.createElement("span"); c.className = "menu-count"; c.textContent = n; c.setAttribute("aria-label", n + " módulos"); h.appendChild(c); }
    });
    sc.querySelectorAll(".menu-item:not([data-v11])").forEach(function (b) {
      b.dataset.v11 = "1";
      // agrupa o texto do título (nós de texto) num <span> para ocupar uma única célula da grade
      var small = b.querySelector("small"), title = document.createElement("span"); title.className = "menu-title";
      Array.prototype.slice.call(b.childNodes).forEach(function (nd) { if (nd.nodeType === 3) title.appendChild(nd); });
      b.insertBefore(title, small || null);
      var t = title.firstChild; if (t && /\s—\s*NOVO\s*$/.test(t.nodeValue)) { t.nodeValue = t.nodeValue.replace(/\s—\s*NOVO\s*$/, ""); var c = document.createElement("span"); c.className = "chip-new"; c.textContent = "NOVO"; title.appendChild(c); }
    });
  }
  function crumb(n) {
    if (sc.querySelector(".crumb")) return; var re = new RegExp("^\\s*" + n + "\\."), t = Array.prototype.find.call(sc.querySelectorAll(".font-bold"), function (e) { return re.test(e.textContent); });
    if (!t) return; var d = document.createElement("div"); d.className = "crumb"; d.setAttribute("aria-label", "Caminho de navegação");
    var home = document.createElement("button"); home.type = "button"; home.textContent = "CHEM.OS"; home.onclick = function () { if (window.renderHome) window.renderHome(); };
    d.appendChild(home); var g = groupOf(n);
    if (g) { var s1 = document.createElement("span"); s1.className = "sep"; s1.textContent = "▸"; var gs = document.createElement("span"); gs.textContent = g; d.appendChild(s1); d.appendChild(gs); }
    var s2 = document.createElement("span"); s2.className = "sep"; s2.textContent = "▸"; var h = document.createElement("span"); h.className = "here"; h.textContent = "MÓDULO " + String(n).padStart(2, "0"); d.appendChild(s2); d.appendChild(h);
    t.parentNode.insertBefore(d, t);
  }
  var rt = window.renderTool;
  if (typeof rt === "function") window.renderTool = function (n) { var r = rt.apply(this, arguments); var k = parseInt(n); if (k) { setTimeout(function () { crumb(k); }, 60); setTimeout(function () { crumb(k); }, 400); } return r; };
  var raf; new MutationObserver(function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { enhanceHome(); enhanceCards(); }); }).observe(sc, { childList: true, subtree: true });
  enhanceHome(); enhanceCards();
})();
