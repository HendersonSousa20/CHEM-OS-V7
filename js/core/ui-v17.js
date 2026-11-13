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
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function homeMap() {
    var G = window.CHEM_GROUPS, H = window.MODULE_HELP;
    if (!G || !H || !sc.querySelector(".hero-title") || sc.querySelector("#mod-map")) return;
    var tr = sc.querySelector(".track"); if (!tr) return;
    var host = tr.parentElement, sec = document.createElement("section"), i = 0;
    sec.id = "mod-map"; sec.setAttribute("aria-label", "Todos os módulos");
    sec.innerHTML = '<div class="menu-heading">▣ TODOS OS MÓDULOS</div>' + G.map(function (g) {
      return '<div class="map-group"><div class="map-name">' + esc(g[0]) + '</div><div class="map-grid">' + g[1].map(function (n) {
        var nm = (H[n] && H[n][3]) || ("Módulo " + n);
        return '<button type="button" class="map-tile" style="--i:' + (i++) + '" onclick="renderTool(' + n + ')" aria-label="Módulo ' + n + ': ' + esc(nm) + '"><span class="map-n" aria-hidden="true">' + n + '</span><span class="map-t">' + esc(nm) + '</span></button>';
      }).join("") + "</div></div>";
    }).join("");
    host.after(sec);
  }
  function heroMol() {
    var h = sc.querySelector(".hero-title"); if (!h || sc.querySelector("#hero-mol")) return;
    var host = h.parentElement; if (!host) return; host.style.position = "relative";
    var cx = 95, cy = 118, r = 34, V = [], k = 0, g = "";
    for (var i = 0; i < 6; i++) { var a = (-90 + 60 * i) * Math.PI / 180; V.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    function L(x1, y1, x2, y2) { return '<line class="b" pathLength="1" style="--k:' + (k++) + '" x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>'; }
    function T(x, y, t) { return '<text style="--k:' + k + '" x="' + x + '" y="' + y + '">' + t + '</text>'; }
    for (i = 0; i < 6; i++) { var p = V[i], q = V[(i + 1) % 6]; g += L(p[0], p[1], q[0], q[1]); }
    [1, 3, 5].forEach(function (i) { var p = V[i], q = V[(i + 1) % 6], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = cx - mx, dy = cy - my, d = Math.hypot(dx, dy), ox = dx / d * 6, oy = dy / d * 6, sx = (q[0] - p[0]) * .16, sy = (q[1] - p[1]) * .16;
      g += L(p[0] + ox + sx, p[1] + oy + sy, q[0] + ox - sx, q[1] + oy - sy); });
    g += L(V[0][0], V[0][1], 95, 62) + T(95, 52, "OH");
    g += L(V[3][0], V[3][1], 95, 172) + T(95, 192, "NH");
    g += L(103, 180, 121, 199);
    g += L(118, 201, 118, 226) + L(124, 201, 124, 226) + T(121, 246, "O");
    g += L(121, 199, 147, 184) + T(168, 190, "CH₃");
    g += '<text class="cap" style="--k:0" x="110" y="276">paracetamol</text>';
    var d = document.createElement("div"); d.id = "hero-mol"; d.className = "hero-mol"; d.setAttribute("aria-hidden", "true");
    d.innerHTML = '<svg viewBox="0 0 230 285" xmlns="http://www.w3.org/2000/svg" focusable="false">' + g + "</svg>";
    host.insertBefore(d, host.firstChild);
  }
  function flash(list) {
    list.forEach(function (m) {
      var t = m.target.nodeType === 1 ? m.target : m.target.parentElement, box = t && t.closest && t.closest('[aria-live="polite"].dos-border');
      if (!box || !box.isConnected) return;
      box.classList.remove("res-flash"); void box.offsetWidth; box.classList.add("res-flash");
      box.addEventListener("animationend", function h() { box.classList.remove("res-flash"); box.removeEventListener("animationend", h); });
    });
  }
  new MutationObserver(flash).observe(sc, { childList: true, subtree: true, characterData: true });
  function syncStatic() {
    var M = window.CHEMOS_MAJOR, N = window.MODULE_MAX;
    if (M) { document.title = document.title.replace(/CHEM\.OS v\d+/, "CHEM.OS v" + M);
      var hb = document.querySelector("header[role=banner]"); if (hb) hb.querySelectorAll("div").forEach(function (d) { d.childNodes.forEach(function (n) { if (n.nodeType === 3 && /CHEM\.OS v\d+/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/CHEM\.OS v\d+/, "CHEM.OS v" + M); }); }); }
    if (N) { var cli = document.getElementById("cli-input"); if (cli) cli.placeholder = cli.placeholder.replace(/\(1-\d+\)/, "(1-" + N + ")");
      var lb = document.querySelector('label[for="cli-input"]'); if (lb) lb.textContent = lb.textContent.replace(/\(1 a \d+\)/, "(1 a " + N + ")"); }
  }
  syncStatic();
  var timer; function run() { clearTimeout(timer); timer = setTimeout(function () { tile(); primary(); homeMap(); heroMol(); }, 30); }
  new MutationObserver(run).observe(sc, { childList: true, subtree: true }); run();
})();
