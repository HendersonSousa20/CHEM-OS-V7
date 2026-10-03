/* v7.4: campos lembrados por módulo, histórico de cálculos, alerta de NaN, resultados anunciados a leitores de tela. */
(function () {
  const jget = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const jset = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const H_KEY = "chemos-history", PERSIST = n => n >= 1 && n <= 19;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let cur = 0, interacted = false, timer = null, lastKey = "";
  const sc = () => document.getElementById("screen-content");
  const fields = () => [...sc().querySelectorAll("input[id],select[id],textarea[id]")].filter(el => !el.closest('[id$="-result"]') && el.type !== "button" && el.id !== "menu-filter");

  const origTool = window.renderToolInner;
  window.renderToolInner = function (id) {
    origTool(id);
    cur = parseInt(id); interacted = false;
    sc().querySelectorAll('[id$="-result"]').forEach(el => el.setAttribute("aria-live", "polite"));
    if (!PERSIST(cur)) return;
    const saved = jget("chemos-inputs-" + cur, {});
    fields().forEach(el => {
      if (!(el.id in saved) || el.type === "file") return;
      if (el.type === "checkbox" || el.type === "radio") el.checked = !!saved[el.id]; else el.value = saved[el.id];
      if (el.tagName === "SELECT") el.dispatchEvent(new Event("change", { bubbles: true }));
    });
    const bar = sc().querySelector("div.mb-2");
    if (bar && Object.keys(saved).length) {
      bar.insertAdjacentHTML("beforeend", ` <button class="dos-btn" data-x="reset" title="Restaurar valores de exemplo deste módulo">↺ PADRÃO</button>`);
      bar.querySelector('[data-x="reset"]').onclick = () => { try { localStorage.removeItem("chemos-inputs-" + cur); } catch (e) {} showToast("Valores padrão restaurados."); window.renderToolInner(cur); };
    }
  };

  const save = e => {
    if (!PERSIST(cur) || !e.target.id || !sc().contains(e.target) || e.target.closest('[id$="-result"]')) return;
    const data = jget("chemos-inputs-" + cur, {});
    data[e.target.id] = (e.target.type === "checkbox" || e.target.type === "radio") ? e.target.checked : e.target.value;
    jset("chemos-inputs-" + cur, data);
  };
  document.addEventListener("input", save); document.addEventListener("change", save);
  ["click", "keydown"].forEach(t => document.addEventListener(t, e => { if (sc().contains(e.target) && (t === "click" || e.key === "Enter")) interacted = true; }, true));

  // Histórico + alerta de valores inválidos
  const record = el => {
    const text = el.innerText.replace(/\s+\n/g, "\n").trim();
    if (!text || /^(clique|digite|aguardando|preencha|selecione)/i.test(text)) return;
    if (/\b(NaN|Infinity|undefined)\b/.test(text)) { el.classList.add("field-error-flash"); setTimeout(() => el.classList.remove("field-error-flash"), 700); showToast("Algum campo está vazio ou inválido. Confira os valores."); return; }
    if (!interacted || !PERSIST(cur) || el.id === "pubchem-result" || el.id === "resolver-result") return;
    const key = cur + "|" + text; if (key === lastKey) return; lastKey = key;
    const head = sc().querySelector(".text-xl");
    const ins = fields().filter(f => f.value && f.type !== "button").slice(0, 6).map(f => `${f.id}=${f.value}`.slice(0, 40)).join(", ");
    const h = jget(H_KEY, []);
    h.unshift({ t: Date.now(), m: cur, title: head ? head.textContent.trim().slice(0, 60) : "Módulo " + cur, ins, out: text.slice(0, 400) });
    jset(H_KEY, h.slice(0, 40));
  };
  new MutationObserver(muts => {
    const els = new Set();
    muts.forEach(m => { const n = m.target.nodeType === 3 ? m.target.parentElement : m.target; const r = n && n.closest && n.closest('[id$="-result"]'); if (r) els.add(r); });
    if (!els.size) return;
    clearTimeout(timer); timer = setTimeout(() => els.forEach(record), 350);
  }).observe(document.getElementById("screen-content"), { childList: true, subtree: true, characterData: true });

  window.showHistory = function () {
    const h = jget(H_KEY, []);
    openModal("HISTÓRICO DE CÁLCULOS", h.length ? `<div class="space-y-2">${h.map((x, i) => `
      <div class="border border-current p-2"><div class="flex justify-between gap-2 text-xs opacity-80"><span>${new Date(x.t).toLocaleString("pt-BR")}</span><span>${esc(x.title)}</span></div>
      ${x.ins ? `<div class="text-xs opacity-70 break-words">${esc(x.ins)}</div>` : ""}
      <pre class="whitespace-pre-wrap text-sm my-1">${esc(x.out)}</pre>
      <button class="dos-btn" data-open="${x.m}">ABRIR MÓDULO</button> <button class="dos-btn" data-copy="${i}">COPIAR</button></div>`).join("")}
      <button class="dos-btn" id="hist-clear">LIMPAR HISTÓRICO</button></div>` : "<div>Nenhum cálculo registrado ainda. Faça um cálculo em qualquer módulo de 1 a 19.</div>");
    const body = document.getElementById("modal-body");
    body.onclick = e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.open) { closeModal(); renderTool(+b.dataset.open); }
      else if (b.dataset.copy) { const x = jget(H_KEY, [])[+b.dataset.copy]; navigator.clipboard && navigator.clipboard.writeText(`${x.title}\n${x.ins}\n${x.out}`).then(() => showToast("Copiado.")); }
      else if (b.id === "hist-clear") { jset(H_KEY, []); showHistory(); }
    };
  };

  const cli = document.getElementById("cli-input");
  cli.addEventListener("keydown", e => {
    if (e.key === "Enter" && /^hist(o|ó)rico$|^hist$/i.test(cli.value.trim())) { e.stopImmediatePropagation(); cli.value = ""; showHistory(); }
  }, true);
  const foot = document.querySelector("footer .flex");
  if (foot) foot.insertAdjacentHTML("beforeend", `<span><strong class="px-1 border border-current cursor-pointer" onclick="showHistory()" role="button" tabindex="0" onkeydown="if(event.key==='Enter')showHistory()">HIST</strong> Histórico</span>`);
})();
