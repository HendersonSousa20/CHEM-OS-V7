/* v9.6 — Conversor de unidade ao lado dos campos (⇄), "próximo na trilha" no fim de cada módulo e atalho "?" para a ajuda. */
(function () {
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const H = window.MODULE_HELP || {};

  // ---------- Conversor de unidade por campo ----------
  const FIELDS = { "mL": ["p-vol", "d-v1", "d-v2", "tit-va", "tit-vmax", "tf-va", "tf-vmax"], "L": ["gi-v", "g-v1", "g-v2"], "atm": ["gi-p", "g-p1", "g-p2"],
    "K": ["gi-t", "g-t1", "g-t2", "ner-t", "thermo-temp"], "mol/L": ["p-conc", "d-c1", "d-c2", "wa-conc", "tit-ca", "tit-cb", "tf-ca", "tf-cb", "buf-base", "buf-acid"] };
  const CONC = { "mol/L": 1, "mmol/L": 1e-3, "µmol/L": 1e-6, "mol/m³": 1e-3 };
  const CAT = { "mL": "Volume", "L": "Volume", "atm": "Pressão", "K": "Temperatura" }, DEF = { "mL": "L", "L": "mL", "atm": "mmHg", "K": "°C", "mol/L": "mmol/L" };
  const BASE_OF = {}; Object.entries(FIELDS).forEach(([u, ids]) => ids.forEach(id => BASE_OF[id] = u));
  const unitsFor = base => base === "mol/L" ? Object.keys(CONC) : Object.keys(ChemUnits.CATS[CAT[base]].u);
  const conv = (base, v, from) => base === "mol/L" ? v * CONC[from] / CONC[base] : ChemUnits.convert(CAT[base], v, from, base);
  const fmt = x => { const s = String(+x.toPrecision(8)); return (window.ChemUX && window.ChemUX.S.sep === "auto") ? s : s.replace(".", ","); };
  window.ChemFieldUnits = { BASE_OF, conv, unitsFor };

  function openConverter(field) {
    const base = BASE_OF[field.id]; if (!base || typeof ChemUnits === "undefined") return;
    const opts = unitsFor(base).filter(u => u !== base);
    openModal("CONVERTER PARA " + base, `<div class="space-y-2 text-sm"><label>Valor<input id="uc-val" class="dos-input w-full p-1" inputmode="decimal" autocomplete="off"></label>
      <label>Unidade de origem<select id="uc-from" class="dos-input w-full p-1">${opts.map(u => `<option${u === DEF[base] ? " selected" : ""}>${esc(u)}</option>`).join("")}</select></label>
      <div id="uc-out" class="dos-border p-2" aria-live="polite">Digite um valor.</div><div><button class="dos-btn" id="uc-use" disabled>USAR NO CAMPO</button> <button class="dos-btn" id="uc-cancel">CANCELAR</button></div></div>`);
    let res = null;
    const upd = () => {
      const x = parseFloat(String($("uc-val").value).trim().replace(",", ".")); res = isFinite(x) ? conv(base, x, $("uc-from").value) : null;
      $("uc-out").textContent = res === null ? "Digite um número válido." : `${fmt(x)} ${$("uc-from").value} = ${fmt(res)} ${base}`; $("uc-use").disabled = res === null || !isFinite(res);
    };
    const body = $("modal-body"); body.oninput = upd; body.onchange = upd;
    body.onclick = e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.id === "uc-use" && res !== null) { field.value = String(+res.toPrecision(8)); field.dispatchEvent(new Event("input", { bubbles: true })); field.dispatchEvent(new Event("change", { bubbles: true })); closeModal(); field.focus(); }
      else if (b.id === "uc-cancel") closeModal();
    };
    $("uc-val").focus();
  }
  window.openFieldConverter = id => { const f = $(id); if (f) openConverter(f); };

  function addUnitButtons() {
    document.querySelectorAll("#screen-content input").forEach(el => {
      const base = BASE_OF[el.id]; if (!base || el.nextElementSibling && el.nextElementSibling.classList.contains("unit-btn")) return;
      const b = document.createElement("button"); b.type = "button"; b.className = "unit-btn dos-btn"; b.textContent = "⇄ " + base;
      b.title = `Converter outra unidade para ${base}`; b.setAttribute("aria-label", `Converter outra unidade para ${base} neste campo`); b.onclick = () => openConverter(el);
      el.insertAdjacentElement("afterend", b);
    });
  }

  // ---------- Próximo na trilha ----------
  const short = n => (H[n] && H[n][3]) || "Módulo " + n;
  function addTrackNav(n) {
    const tr = (window.TRACKS || []).find(([, ids]) => ids.includes(n)); if (!tr) return;
    const ids = tr[1], i = ids.indexOf(n), prev = ids[i - 1], next = ids[i + 1];
    $("screen-content").insertAdjacentHTML("beforeend", `<nav class="track-nav" aria-label="Trilha ${esc(tr[0])}"><span class="opacity-80">Trilha <strong>${esc(tr[0])}</strong> (${i + 1}/${ids.length}):</span>
      ${prev ? `<button class="dos-btn" onclick="renderTool(${prev})">← ${esc(short(prev))}</button>` : ""}${next ? `<button class="dos-btn" onclick="renderTool(${next})">${esc(short(next))} →</button>` : '<span class="test-pass">✓ fim da trilha</span>'}</nav>`);
  }

  const orig = window.renderToolInner;
  window.renderToolInner = function (id) { orig(id); const n = parseInt(id); addUnitButtons(); addTrackNav(n); };

  document.addEventListener("keydown", e => {
    if (e.key === "?" && !e.ctrlKey && !e.metaKey && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) && typeof showHelp === "function") { e.preventDefault(); showHelp(); }
  });
})();
