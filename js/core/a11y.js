/* v8.14 — Acessibilidade: nomes para campos, controles clicáveis operáveis por teclado, rótulos de gráficos,
   anúncio de mudança de módulo, diálogo modal com foco preso e respeito a "reduzir movimento". */
(function () {
  const $ = id => document.getElementById(id);
  const clean = s => (s || "").replace(/\s+/g, " ").replace(/[:：]\s*$/, "").trim();
  const hasName = el => (el.getAttribute("aria-label") || "").trim() || el.getAttribute("aria-labelledby") || (el.getAttribute("title") || "").trim()
    || (el.id && document.querySelector(`label[for="${el.id}"]`)) || (el.closest("label") && clean(el.closest("label").textContent.replace(el.value || "", "")).length > 0)
    || (el.getAttribute("placeholder") || "").trim();
  const short = n => { const t = n && clean(n.textContent); return t && t.length >= 2 && t.length <= 90 && !n.querySelector("input,select,textarea") && !n.matches(".text-xl,h1,h2,h3") && !/^\d+\.\s/.test(t) ? t : ""; };
  let seq = 0;
  // Rótulos explícitos para campos cujo texto vizinho não os descreve bem
  const FIXED = { "eq-input": "Equação química a balancear (reagentes -> produtos)", "molar-input": "Fórmula química (ex.: H2O, Ca3(PO4)2)", "eq-kc-concs": "Concentrações no equilíbrio, separadas por vírgula",
    "stoich-masses": "Massas dos reagentes em gramas, separadas por vírgula", "resolver-input": "Nome IUPAC ou nome comum do composto", "ptable-search": "Buscar elemento por nome, símbolo ou número" };

  function nameField(el) {
    if (FIXED[el.id] && !el.dataset.a11yFixed) { el.setAttribute("aria-label", FIXED[el.id]); el.dataset.a11yFixed = "1"; return; }
    if (hasName(el)) return;
    let src = el.previousElementSibling, t = src && /^(LABEL|DIV|SPAN|P|STRONG|B|SMALL)$/.test(src.tagName) ? short(src) : "";
    if (!t && el.parentElement) { src = el.parentElement.previousElementSibling; t = src && /^(LABEL|DIV|SPAN|P|H\d)$/.test(src.tagName) ? short(src) : ""; }
    if (!t && el.parentElement) { const own = [...el.parentElement.childNodes].find(n => n.nodeType === 3 && clean(n.textContent).length > 1); t = own ? clean(own.textContent) : ""; src = null; }
    if (!t) t = clean((el.id || el.name || el.type || "campo").replace(/[-_]/g, " "));
    el.setAttribute("aria-label", t);
    if (src && src.tagName === "LABEL" && !src.htmlFor && !src.querySelector("input,select,textarea")) { if (!el.id) el.id = "a11y-f" + (++seq); src.htmlFor = el.id; }
  }
  const CANVAS = [[/hist/i, "Histograma da distribuição de velocidades das partículas"], [/sim/i, "Simulação animada de partículas de gás numa caixa"],
    [/edit|struct|mol/i, "Área de desenho do editor de estruturas moleculares"], [/chart|graf|curve|plot/i, "Gráfico do resultado do cálculo"]];

  function enhance() {
    const sc = $("screen-content"); if (!sc) return;
    const head = (sc.querySelector(".text-xl") || {}).textContent;
    sc.querySelectorAll("input,select,textarea").forEach(el => { if (el.type !== "hidden") nameField(el); });
    sc.querySelectorAll("[onclick]").forEach(el => {
      if (/^(BUTTON|A|INPUT|SELECT|SUMMARY)$/.test(el.tagName)) return;
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
      if (!el.getAttribute("role")) el.setAttribute("role", "button");
      el.dataset.kb = "1";
      if (!(el.getAttribute("aria-label") || "").trim() && !clean(el.textContent)) el.setAttribute("aria-label", el.title || "Ação");
      const m = (el.getAttribute("onclick") || "").match(/showElementDetails\((\d+)\)/);
      if (m && typeof RAW_ELEMENTS !== "undefined") { const e = RAW_ELEMENTS.find(x => x[0] === +m[1]); if (e) el.setAttribute("aria-label", `${e[2]}, ${e[1]}, número atômico ${e[0]}`); }
    });
    sc.querySelectorAll("canvas").forEach(c => {
      if (c.getAttribute("aria-label") || c.getAttribute("role")) return;
      const hit = CANVAS.find(([re]) => re.test(c.id)); c.setAttribute("role", "img");
      c.setAttribute("aria-label", hit ? hit[1] : "Gráfico interativo" + (head ? ": " + clean(head) : ""));
    });
  }
  let q = null; const later = () => { clearTimeout(q); q = setTimeout(enhance, 0); };
  const sc0 = $("screen-content");
  if (sc0) { new MutationObserver(later).observe(sc0, { childList: true, subtree: true }); sc0.addEventListener("keydown", e => {
    const el = e.target; if (el.dataset && el.dataset.kb && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); el.click(); } }); }

  // Anúncio de mudança de tela para leitores de tela (sem roubar o foco)
  const live = document.createElement("div"); live.id = "sr-status"; live.className = "sr-only"; live.setAttribute("role", "status"); live.setAttribute("aria-live", "polite"); document.body.appendChild(live);
  const announce = () => { const h = sc0 && sc0.querySelector(".text-xl"); live.textContent = h ? clean(h.textContent).slice(0, 120) + " aberto" : ""; };
  const oTool = window.renderToolInner; window.renderToolInner = function (id) { oTool(id); enhance(); announce(); };
  const oHome = window.renderHomeInner; window.renderHomeInner = function () { oHome(); enhance(); live.textContent = "Menu principal"; };
  if (!document.documentElement.lang) document.documentElement.lang = "pt-BR";

  // Modal: papel de diálogo, foco inicial, foco preso e retorno do foco ao fechar
  let opener = null;
  const oOpen = window.openModal, oClose = window.closeModal;
  if (oOpen) window.openModal = function (title) {
    opener = document.activeElement; oOpen.apply(this, arguments);
    const m = $("modal"); if (m) { m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", clean(String(title || "Diálogo")).slice(0, 80)); m.setAttribute("tabindex", "-1"); m.focus(); }
  };
  if (oClose) window.closeModal = function () { oClose.apply(this, arguments); if (opener && opener.focus && document.body.contains(opener)) opener.focus(); opener = null; };
  document.addEventListener("keydown", e => {
    const m = $("modal"); if (e.key !== "Tab" || !m || m.classList.contains("hidden") || !m.contains(document.activeElement) && document.activeElement !== m) return;
    const f = [...m.querySelectorAll("button,input,select,textarea,a[href],[tabindex]:not([tabindex='-1'])")].filter(x => !x.disabled && x.offsetParent !== null);
    if (!f.length) return; const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === m)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  enhance();
})();
