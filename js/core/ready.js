/* Sinal de "app pronto": definido depois que todos os scripts rodaram e os handlers de DOMContentLoaded terminaram.
   Os testes e as varreduras esperam por ele em vez de usar pausas fixas. */
(function () {
  "use strict";
  function ready() { window.CHEMOS_READY = true; document.dispatchEvent(new CustomEvent("chemos:ready")); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(ready, 0); }); else setTimeout(ready, 0);
})();
