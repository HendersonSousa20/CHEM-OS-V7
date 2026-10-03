/* v9.0 — Consultas à internet (PubChem, OPSIN, CACTUS, Wikipédia): indicador de carregamento, botão CANCELAR e aviso claro quando está offline. */
(function () {
  if (typeof window.fetch !== "function") return;
  const orig = window.fetch.bind(window), pending = new Set(); let bar = null;
  function show() {
    if (!bar) {
      bar = document.createElement("div"); bar.id = "net-bar"; bar.setAttribute("role", "status"); bar.setAttribute("aria-live", "polite");
      bar.innerHTML = `<span id="net-msg"></span> <button class="dos-btn" id="net-cancel">CANCELAR</button>`; document.body.appendChild(bar);
      bar.querySelector("#net-cancel").onclick = () => api.cancel();
    }
    const n = pending.size; bar.style.display = n ? "flex" : "none";
    bar.querySelector("#net-msg").textContent = n ? `⏳ Consultando servidor externo${n > 1 ? "s (" + n + ")" : ""}…` : "";
  }
  const api = window.ChemNet = { get pending() { return pending.size; }, cancel() { [...pending].forEach(a => a.abort()); } };
  window.fetch = function (input, init) {
    let cross = false; const url = typeof input === "string" ? input : (input && input.url) || "";
    try { cross = new URL(url, location.href).origin !== location.origin; } catch (e) {}
    if (!cross) return orig(input, init);
    if (navigator.onLine === false) return Promise.reject(new TypeError("Sem conexão com a internet. Este módulo precisa de rede (PubChem, OPSIN, CACTUS ou Wikipédia)."));
    const ac = new AbortController(), own = init && init.signal;
    if (own) { if (own.aborted) ac.abort(); else own.addEventListener("abort", () => ac.abort()); }
    pending.add(ac); show();
    return orig(input, Object.assign({}, init || {}, { signal: ac.signal })).finally(() => { pending.delete(ac); show(); });
  };
})();
