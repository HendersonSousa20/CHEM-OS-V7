/* Diagnóstico de erros: guarda os últimos erros não tratados no próprio navegador (anel de 30 entradas),
   avisa uma vez por sessão e permite copiar um relatório (comando "diagnostico"). Nada é enviado a servidores. */
(function () {
  "use strict";
  var KEY = "chemos-diag", MAX = 30, warned = false;
  var NOISE = /ResizeObserver loop|Script error\.?$|chrome-extension:|moz-extension:/;
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list.slice(-MAX))); } catch (e) { /* armazenamento indisponível */ } }
  function clip(s, n) { s = String(s == null ? "" : s); return s.length > n ? s.slice(0, n) + "…" : s; }
  function record(kind, msg, where, stack) {
    if (NOISE.test(String(msg)) || NOISE.test(String(where))) return;
    var list = load(); list.push({ t: new Date().toISOString(), k: kind, m: clip(msg, 300), w: clip(where, 160), s: clip(stack, 600), h: clip(location.hash, 80) });
    save(list);
    if (!warned && typeof window.showToast === "function") { warned = true; window.showToast('Ocorreu um erro inesperado. Digite "diagnostico" para copiar o relatório.'); }
  }
  window.addEventListener("error", function (e) { record("error", e.message, (e.filename || "") + ":" + (e.lineno || 0) + ":" + (e.colno || 0), e.error && e.error.stack); });
  window.addEventListener("unhandledrejection", function (e) { var r = e.reason; record("promise", r && r.message ? r.message : r, "", r && r.stack); });
  function report() {
    var list = load();
    return ["CHEM.OS " + (window.CHEMOS_VERSION || "?"), "Data: " + new Date().toISOString(), "Navegador: " + navigator.userAgent, "Tela: " + innerWidth + "x" + innerHeight + " @" + (window.devicePixelRatio || 1) + "x",
      "Módulos: " + (window.MODULE_MAX || "?"), "Erros registrados: " + list.length, ""].concat(list.map(function (x) { return "[" + x.t + "] " + x.k + " " + x.m + (x.w ? " (" + x.w + ")" : "") + (x.s ? "\n    " + x.s.split("\n").slice(0, 3).join("\n    ") : ""); })).join("\n");
  }
  function copy() {
    var text = report(), done = function () { if (typeof window.showToast === "function") window.showToast("Relatório de diagnóstico copiado."); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    function fallback() { var t = document.createElement("textarea"); t.value = text; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (e) { /* sem permissão */ } t.remove(); }
    return text;
  }
  window.ChemDiag = { entries: load, report: report, copy: copy, clear: function () { save([]); } };
})();
