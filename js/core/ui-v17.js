/* CHEM.OS v17 — acabamento visual: marcador de célula no título do módulo e destaque da ação principal. */
(function () {
  "use strict";
  var sc = document.getElementById("screen-content"); if (!sc || !window.MutationObserver) return;
  var PRIMARY = /^\s*(CALCULAR|COMEÇAR|ANALISAR|SOMAR|CONVERTER|BALANCEAR|AJUSTAR|SIMULAR|GERAR|RESOLVER|PREVER|VERIFICAR|PESQUISAR)\b/i;
  function tile() {
    var h = sc.querySelector(".text-xl.font-bold, h2.text-xl"); if (!h || h.dataset.v17) return;
    var n = h.firstChild; if (!n || n.nodeType !== 3) return;
    var m = n.nodeValue.match(/^\s*(\d{1,2})\.\s*(?:\[([A-Z0-9]{2,4})\]\s*)?/); if (!m) return;
    h.dataset.v17 = "1";
    var t = document.createElement("span"); t.className = "mod-tile"; t.setAttribute("aria-hidden", "true"); t.dataset.n = m[1]; if (m[2]) t.dataset.tag = m[2];
    var sr = document.createElement("span"); sr.className = "sr-only"; sr.textContent = m[0];
    var rest = document.createElement("span"); rest.className = "mod-title-text";
    n.nodeValue = n.nodeValue.slice(m[0].length);
    while (n) { var next = n.nextSibling; rest.appendChild(n); n = next; }
    h.classList.add("mod-title"); h.append(t, sr, rest);
  }
  function primary() {
    sc.querySelectorAll(".dos-btn:not([data-v17])").forEach(function (b) {
      b.dataset.v17 = "1";
      if (!b.closest(".crumb, .hero-actions") && PRIMARY.test(b.textContent)) b.classList.add("btn-primary");
    });
  }
  var timer; function run() { clearTimeout(timer); timer = setTimeout(function () { tile(); primary(); }, 30); }
  new MutationObserver(run).observe(sc, { childList: true, subtree: true }); run();
})();
