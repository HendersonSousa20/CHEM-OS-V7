/* Bibliotecas pesadas carregadas sob demanda (a partir de vendor/, hospedadas junto do app; funcionam offline). */
(function () {
  "use strict";
  var pending = {};
  function loadScript(src) {
    if (!pending[src]) pending[src] = new Promise(function (resolve, reject) {
      var s = document.createElement("script"); s.src = src; s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { delete pending[src]; s.remove(); reject(new Error("Falha ao carregar " + src)); };
      document.head.appendChild(s);
    });
    return pending[src];
  }
  window.loadJsPdf = function () { return window.jspdf && window.jspdf.jsPDF ? Promise.resolve(window.jspdf) : loadScript("vendor/jspdf.umd.min.js").then(function () { return window.jspdf; }); };
})();
