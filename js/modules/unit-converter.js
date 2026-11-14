/* Módulo 26 (v8): Conversor de unidades químicas. Aceita vírgula ou ponto decimal; converte ao vivo. */
(function () {
  const CATS = {
    "Pressão": { base: "Pa", u: { Pa: 1, kPa: 1e3, bar: 1e5, atm: 101325, mmHg: 101325 / 760, torr: 101325 / 760, psi: 6894.757293168 } },
    "Energia": { base: "J", u: { J: 1, kJ: 1e3, cal: 4.184, kcal: 4184, eV: 1.602176634e-19, kWh: 3.6e6 } },
    "Volume": { base: "L", u: { L: 1, mL: 1e-3, "µL": 1e-6, "cm³": 1e-3, "dm³": 1, "m³": 1e3 } },
    "Massa": { base: "g", u: { g: 1, mg: 1e-3, "µg": 1e-6, kg: 1e3, lb: 453.59237 } },
    "Temperatura": { temp: true, u: { "°C": 1, K: 1, "°F": 1 } }
  };
  const toC = (v, u) => u === "K" ? v - 273.15 : u === "°F" ? (v - 32) * 5 / 9 : v;
  const fromC = (c, u) => u === "K" ? c + 273.15 : u === "°F" ? c * 9 / 5 + 32 : c;
  function convert(cat, v, from, to) {
    const c = CATS[cat];
    return c.temp ? fromC(toC(v, from), to) : v * c.u[from] / c.u[to];
  }
  const fmt = x => !isFinite(x) ? "—" : (x !== 0 && (Math.abs(x) < 1e-4 || Math.abs(x) >= 1e9)) ? x.toExponential(6) : String(+x.toPrecision(10));
  window.ChemUnits = { convert, CATS };

  function render() {
    const sc = document.getElementById("screen-content");
    const opts = a => a.map(k => `<option>${k}</option>`).join("");
    sc.innerHTML = `
      <div class="text-xl font-bold border-b border-current pb-1 mb-3">26. CONVERSOR DE UNIDADES (PRESSÃO, ENERGIA, VOLUME, MASSA, TEMPERATURA)</div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3 text-sm">
        <label>Grandeza<select id="conv-cat" class="dos-input w-full p-1 bg-black text-current">${opts(Object.keys(CATS))}</select></label>
        <label>Valor<input id="conv-val" type="text" inputmode="decimal" value="1" class="dos-input w-full p-1"></label>
        <label>De<select id="conv-from" class="dos-input w-full p-1 bg-black text-current"></select></label>
        <label>Para<select id="conv-to" class="dos-input w-full p-1 bg-black text-current"></select></label>
      </div>
      <div id="conv-result" class="dos-border p-3 text-sm" aria-live="polite"></div>
      <div class="text-xs opacity-70 mt-2">Aceita vírgula ou ponto. 1 atm = 101325 Pa = 760 mmHg. Para gases (Módulo 11), use pressão em atm e volume em L com R = 0,082057.</div>`;
    const $ = id => document.getElementById(id);
    const fill = () => {
      const ks = Object.keys(CATS[$("conv-cat").value].u);
      $("conv-from").innerHTML = opts(ks); $("conv-to").innerHTML = opts(ks);
      $("conv-to").selectedIndex = Math.min(1, ks.length - 1); update();
    };
    const update = () => {
      const cat = $("conv-cat").value, from = $("conv-from").value, to = $("conv-to").value;
      const v = parseFloat($("conv-val").value.replace(",", "."));
      if (!isFinite(v)) { $("conv-result").textContent = "Digite um número válido."; return; }
      const all = Object.keys(CATS[cat].u).filter(u => u !== from).map(u => `${fmt(convert(cat, v, from, u)).padStart(16)}  ${u}`).join("\n");
      $("conv-result").innerHTML = `<div class="text-lg font-bold mb-2">${fmt(v)} ${from} = ${fmt(convert(cat, v, from, to))} ${to}</div><pre class="whitespace-pre-wrap">${all}</pre>`;
    };
    $("conv-cat").onchange = fill; $("conv-from").onchange = update; $("conv-to").onchange = update; $("conv-val").oninput = update;
    fill(); $("conv-val").focus();
  }
  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    if (parseInt(id) !== 26) return orig(id);
    if (typeof playBeep === "function") playBeep(700, 0.04);
    render(); if (typeof screenAnimateIn === "function") screenAnimateIn();
  };
})();
