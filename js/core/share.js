/* v8.5: links compartilháveis com os valores dos campos (#/m/N?campo=valor) + atalhos na ajuda. */
(function () {
  const RUN = /^\s*(run|calc|solve|resolve|balance|search|gerar|start)/i;
  const $sc = () => document.getElementById("screen-content");
  const fields = () => [...$sc().querySelectorAll("input[id],select[id],textarea[id]")].filter(el => el.value && !el.closest('[id$="-result"]') && !["button", "file", "checkbox", "radio", "range"].includes(el.type) && el.id !== "menu-filter");
  function link(n) {
    const p = new URLSearchParams(); fields().forEach(el => p.set(el.id, el.value));
    return `${location.origin}${location.pathname}#/m/${n}?${p.toString()}`;
  }
  window.chemosShareLink = link;
  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    const n = parseInt(id), entry = window.__bootHash || location.hash, m = entry.match(/^#\/m\/(\d+)\?(.*)$/);
    window.__bootHash = null;
    orig(id);
    const bar = $sc().querySelector("div.mb-2");
    if (bar) {
      bar.insertAdjacentHTML("beforeend", ` <button class="dos-btn" data-share title="Copiar link com os valores atuais">LINK</button>`);
      bar.querySelector("[data-share]").onclick = () => {
        const url = link(n);
        (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => showToast("Link copiado — abre este módulo com os mesmos valores."), () => prompt("Copie o link:", url));
      };
    }
    if (m && +m[1] === n) {
      const q = new URLSearchParams(m[2]); let any = false;
      q.forEach((v, k) => { const el = document.getElementById(k); if (el && $sc().contains(el) && !el.closest('[id$="-result"]')) { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); if (el.tagName === "SELECT") el.dispatchEvent(new Event("change", { bubbles: true })); any = true; } });
      if (any) { const b = [...$sc().querySelectorAll("button")].find(x => RUN.test(x.getAttribute("onclick") || "")); if (b) try { b.click(); } catch (e) {} }
    }
  };
  const oh = window.showHelp;
  window.showHelp = function () {
    oh.apply(this, arguments);
    const b = document.getElementById("modal-body");
    if (b) b.insertAdjacentHTML("beforeend", `<div class="border-t border-current pt-2 mt-3 text-sm"><strong>ATALHOS v8</strong>
      <div>Ctrl+K — paleta de comandos · / — foca a linha de comando · Enter — executa o cálculo no campo</div>
      <div>Comandos: historico · conversor · formula · quiz · mol · ? ajuda · nox · ligacao · 1–31</div>
      <div>Cada módulo tem link próprio (#/m/N). O botão LINK copia o endereço com os valores preenchidos.</div></div>`);
  };
})();
