/* v7.2: rotas por URL (#/m/N), favoritos, recentes, barra de retorno, título dinâmico, PWA. */
(function () {
  const K_FAV = "chemos-fav", K_REC = "chemos-recent";
  const get = k => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } };
  const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const BASE = "CHEM.OS v9.6 — Laboratório Químico no Navegador";
  let route = "";
  window.__bootHash = location.hash; // o boot chama renderHome() e apagaria o hash antes do evento load

  function setRoute(r, title) {
    route = r; document.title = title ? `${title} · CHEM.OS` : BASE;
    if (location.hash !== r) history.pushState(null, "", r || location.pathname + location.search);
  }

  const origTool = window.renderToolInner;
  window.renderToolInner = function (id) {
    origTool(id);
    const n = parseInt(id), sc = document.getElementById("screen-content");
    const head = sc.querySelector(".text-xl");
    setRoute(`#/m/${n}`, head ? head.textContent.trim().replace(/\s+/g, " ").slice(0, 70) : "");
    set(K_REC, [n, ...get(K_REC).filter(x => x !== n)].slice(0, 5));
    const bar = document.createElement("div");
    bar.className = "mb-2 text-sm";
    bar.innerHTML = `<button class="dos-btn" onclick="renderHome()" aria-label="Voltar ao menu">← MENU</button>
      <button class="dos-btn" id="fav-toggle" aria-pressed="false"></button>`;
    sc.prepend(bar);
    const fb = bar.querySelector("#fav-toggle");
    const paint = () => { const on = get(K_FAV).includes(n); fb.textContent = on ? "★ FAVORITO" : "☆ FAVORITAR"; fb.setAttribute("aria-pressed", on); };
    fb.onclick = () => { const f = get(K_FAV); set(K_FAV, f.includes(n) ? f.filter(x => x !== n) : [...f, n]); paint(); };
    paint();
  };

  const origHome = window.renderHomeInner;
  window.renderHomeInner = function () {
    origHome(); setRoute("", "");
    const box = document.getElementById("menu-groups");
    if (!box) return;
    const byNum = {};
    box.querySelectorAll(".menu-item").forEach(b => { byNum[+b.getAttribute("onclick").match(/\d+/)[0]] = b; });
    const sections = [["★ FAVORITOS", get(K_FAV)], ["RECENTES", get(K_REC).filter(n => !get(K_FAV).includes(n))]];
    const html = sections.filter(([, l]) => l.length).map(([t, l]) => `<section class="menu-group mb-3"><h2 class="menu-heading">${t}</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">${
      l.filter(n => byNum[n]).map(n => `<button onclick="renderTool(${n})" data-search="${byNum[n].dataset.search}" class="menu-item ${byNum[n].className.replace("menu-item", "").trim()}">${byNum[n].innerHTML}</button>`).join("")}</div></section>`).join("");
    if (html) box.insertAdjacentHTML("afterbegin", html);
  };

  window.addEventListener("hashchange", () => {
    if (location.hash === route) return;
    const m = location.hash.match(/^#\/m\/(\d+)(?:\?.*)?$/);
    if (m && +m[1] >= 1 && +m[1] <= 31) renderTool(+m[1]); else renderHome();
  });
  window.addEventListener("load", () => {
    const m = (window.__bootHash || location.hash).match(/^#\/m\/(\d+)(?:\?.*)?$/);
    if (m && +m[1] >= 1 && +m[1] <= 31) renderTool(+m[1]);
  });

  // Instalação como app (PWA)
  let deferred;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault(); deferred = e;
    const g = document.querySelector('[aria-label="Escolha de tema de cor"]');
    if (!g || document.getElementById("install-btn")) return;
    const b = document.createElement("button");
    b.id = "install-btn"; b.className = "px-1 border border-current hover:bg-current hover:text-black"; b.textContent = "INSTALAR";
    b.onclick = () => { deferred.prompt(); deferred = null; b.remove(); };
    g.appendChild(b);
  });
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost"))
    navigator.serviceWorker.register("sw.js").catch(() => {});
})();
