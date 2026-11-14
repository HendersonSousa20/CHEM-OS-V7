/* v14 — Módulos 49 Revisão inteligente · 50 Ordem de reação por regressão · 51 Calibração do eletrodo de pH. */
(function () {
  const $ = id => document.getElementById(id), NUM = id => parseFloat(String($(id).value).replace(",", "."));
  const fmt = (x, d) => !isFinite(x) ? "—" : (x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 1e-3) ? x.toExponential(3) : String(+x.toPrecision(d || 4))).replace(".", ",");
  const fld = (id, l, v) => `<label class="text-sm">${l}<input id="${id}" type="text" inputmode="decimal" value="${v}" class="dos-input w-full p-1"></label>`;
  const page = (t, b) => { $("screen-content").innerHTML = `<div class="text-xl font-bold border-b border-current pb-1 mb-3">${t}</div>${b}`; };
  const grid = (h, c) => `<div class="grid grid-cols-1 md:grid-cols-${c || 3} gap-2 mb-3">${h}</div>`;
  const out = id => `<div id="${id}" class="dos-border p-3 text-sm" aria-live="polite"></div>`;
  const nums = s => String(s).split(/[\s;]+/).map(x => parseFloat(x.replace(",", "."))).filter(isFinite);
  const KE = "chemos14-review-errors", KH = "chemos14-review-hist";
  const getE = () => { try { return JSON.parse(localStorage.getItem(KE) || "{}"); } catch (e) { return {}; } };
  const setE = o => { try { localStorage.setItem(KE, JSON.stringify(o)); } catch (e) { /* armazenamento bloqueado */ } };

  /* ---------- 49: revisão inteligente ---------- */
  let session = null;
  const topicsList = () => (typeof GC_TOPICS !== "undefined" ? GC_TOPICS : []);
  const allQ = key => { const t = topicsList().find(x => x.key === key); return t ? [...(GC_QUIZZES[key] || []), ...((GC_EXTRA[key] || {}).q || [])].map((q, i) => ({ id: key + "#" + i, key, title: t.title, q })) : []; };
  function sample(pool, n, errs) {
    const p = pool.map(x => ({ x, w: 1 + 3 * Math.min(errs[x.id] || 0, 4) })), res = [];
    while (res.length < n && p.length) { let tot = p.reduce((s, e) => s + e.w, 0), r = Math.random() * tot, i = 0; for (; i < p.length - 1; i++) { r -= p[i].w; if (r <= 0) break; } res.push(p.splice(i, 1)[0].x); }
    return res;
  }
  function histHtml() {
    let h = []; try { h = JSON.parse(localStorage.getItem(KH) || "[]"); } catch (e) { h = []; }
    if (!h.length) return "";
    const last = h.slice(-8), avg = Math.round(100 * h.reduce((a, x) => a + x.ok, 0) / h.reduce((a, x) => a + x.n, 0));
    return `<div class="dos-border p-2 mb-3 text-sm"><div class="font-bold mb-1">Desempenho nas últimas ${last.length} rodadas (média geral ${avg} %)</div>` + last.map(x => { const p = Math.round(100 * x.ok / x.n), d = new Date(x.d); return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} · ${x.ok}/${x.n} ${"█".repeat(Math.round(p / 5))}${"░".repeat(20 - Math.round(p / 5))} ${p} %`; }).join("<br>") + "</div>";
  }
  function r49() {
    const errs = getE(), byTopic = {}; Object.keys(errs).forEach(id => { if (errs[id] > 0) { const k = id.split("#")[0]; byTopic[k] = (byTopic[k] || 0) + errs[id]; } });
    const worst = Object.keys(byTopic).sort((a, b) => byTopic[b] - byTopic[a]).slice(0, 3).map(k => { const t = topicsList().find(x => x.key === k); return t ? `${t.title.replace(/^\d+\.\s*/, "")} (${byTopic[k]})` : ""; }).filter(Boolean);
    page("49. REVISÃO INTELIGENTE", `<p class="text-sm mb-2">Sorteia perguntas dos tópicos do guia (módulo 24), dando mais peso às que você já errou. Os erros ficam só neste navegador.</p>
      <div class="dos-border p-2 mb-3 text-sm">${worst.length ? "Mais errados: " + worst.join("; ") : "Sem histórico de erros ainda. Comece uma rodada."}</div>${histHtml()}
      ${grid(`<label class="text-sm">Escopo<select id="v-s" class="dos-input w-full p-1"><option value="">Todos os tópicos (${topicsList().length})</option>${topicsList().map(t => `<option value="${t.key}">${t.title}</option>`).join("")}</select></label>
        <label class="text-sm">Perguntas<select id="v-n" class="dos-input w-full p-1"><option>5</option><option selected>10</option><option>20</option></select></label>`, 2)}
      <div class="flex flex-wrap gap-2 mb-3"><button class="dos-btn" onclick="startRev14(false)">COMEÇAR</button><button class="dos-btn" onclick="startRev14(true)">SÓ OS QUE ERREI</button><button class="dos-btn" onclick="clearRev14()">ZERAR HISTÓRICO</button></div><div id="v-area" role="region" aria-label="Rodada de revisão"></div>`);
  }
  window.clearRev14 = function () { if (confirm("Apagar o histórico de erros da revisão?")) { setE({}); r49(); } };
  window.startRev14 = function (onlyWrong) {
    const key = $("v-s").value, n = parseInt($("v-n").value), errs = getE();
    let pool = key ? allQ(key) : topicsList().flatMap(t => allQ(t.key));
    if (onlyWrong) pool = pool.filter(x => errs[x.id] > 0);
    if (!pool.length) { $("v-area").textContent = onlyWrong ? "Nenhum erro registrado neste escopo. Faça uma rodada normal." : "Sem perguntas neste escopo."; return; }
    session = { qs: sample(pool, n, errs), i: 0, ok: 0, wrong: [] }; showQ();
  };
  function showQ() {
    const a = $("v-area"), s = session; a.innerHTML = "";
    if (s.i >= s.qs.length) {
      const pct = Math.round(100 * s.ok / s.qs.length);
      a.innerHTML = `<div class="dos-border p-3"><div class="font-bold mb-1">Resultado: ${s.ok} de ${s.qs.length} (${pct} %)</div>${s.wrong.length ? "<div class=\"text-sm\">Para rever:<ul class=\"list-disc ml-5\">" + [...new Set(s.wrong)].map(t => `<li>${t}</li>`).join("") + "</ul></div>" : "<div class=\"text-sm\">Sem erros nesta rodada.</div>"}</div>`;
      try { const h = JSON.parse(localStorage.getItem(KH) || "[]"); h.push({ d: Date.now(), ok: s.ok, n: s.qs.length }); localStorage.setItem(KH, JSON.stringify(h.slice(-30))); } catch (e) { /* armazenamento bloqueado */ }
      return;
    }
    const it = s.qs[s.i], opts = it.q.options.map((t, k) => ({ t, k })).sort(() => Math.random() - 0.5);
    const card = document.createElement("div"); card.className = "dos-border p-3";
    const meta = document.createElement("div"); meta.className = "text-xs opacity-70 mb-1"; meta.textContent = `Pergunta ${s.i + 1}/${s.qs.length} · ${it.title}`;
    const qq = document.createElement("div"); qq.className = "font-bold mb-2"; qq.innerHTML = it.q.q;
    const fb = document.createElement("div"); fb.className = "text-sm mt-2"; fb.setAttribute("aria-live", "polite");
    card.append(meta, qq);
    opts.forEach(o => {
      const b = document.createElement("button"); b.className = "dos-btn block w-full text-left mb-1"; b.innerHTML = o.t;
      b.onclick = () => {
        card.querySelectorAll("button").forEach(x => x.disabled = true);
        const e = getE(), good = o.k === it.q.correct;
        if (good) { s.ok++; if (e[it.id]) e[it.id]--; b.textContent = "✔ " + b.textContent; } else { e[it.id] = (e[it.id] || 0) + 1; s.wrong.push(it.title); b.textContent = "✘ " + b.textContent; }
        setE(e); fb.innerHTML = (good ? "Correto. " : "Incorreto. ") + (it.q.explain || "");
        const nx = document.createElement("button"); nx.className = "dos-btn mt-2"; nx.textContent = s.i + 1 < s.qs.length ? "PRÓXIMA" : "VER RESULTADO"; nx.onclick = () => { s.i++; showQ(); }; fb.append(document.createElement("br"), nx); nx.focus();
      };
      card.append(b);
    });
    card.append(fb); a.append(card);
  }

  /* ---------- 50: ordem de reação por regressão ---------- */
  function lin(x, y) {
    const n = x.length, mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n; let sxx = 0, sxy = 0, syy = 0;
    x.forEach((xi, i) => { sxx += (xi - mx) ** 2; sxy += (xi - mx) * (y[i] - my); syy += (y[i] - my) ** 2; });
    return { m: sxy / sxx, b: my - sxy / sxx * mx, r2: syy === 0 ? 1 : sxy * sxy / (sxx * syy) };
  }
  function r50() {
    page("50. ORDEM DE REAÇÃO POR REGRESSÃO", `<p class="text-sm mb-2">Informe tempos e concentrações de um reagente. O módulo testa [A], ln[A] e 1/[A] contra t e indica a ordem cuja reta é melhor.</p>
      ${grid(`<label class="text-sm">Tempos t (separe por espaço)<input id="o-t" class="dos-input w-full p-1" value="0 10 20 30 40 50"></label><label class="text-sm">Concentrações [A] (mol/L)<input id="o-a" class="dos-input w-full p-1" value="1.000 0.607 0.368 0.223 0.135 0.082"></label>`, 2)}
      <button class="dos-btn mb-3" onclick="runOrd14()">ANALISAR</button>${out("o-res")}
      <p class="text-xs opacity-80 mt-2">Ordem 0: [A] = [A]₀ − kt · ordem 1: ln[A] = ln[A]₀ − kt · ordem 2: 1/[A] = 1/[A]₀ + kt. Com poucos pontos ou erro grande, R² próximos não permitem decidir: colete mais pontos ao longo de 2–3 meias-vidas.</p>`);
    runOrd14();
  }
  window.runOrd14 = function () {
    const t = nums($("o-t").value), A = nums($("o-a").value), box = $("o-res");
    if (t.length < 3 || t.length !== A.length) { box.textContent = "Informe pelo menos 3 pares, com o mesmo número de tempos e concentrações."; return; }
    if (A.some(v => v <= 0)) { box.textContent = "As concentrações devem ser positivas."; return; }
    if (new Set(t).size < 2) { box.textContent = "Os tempos precisam variar."; return; }
    const f0 = lin(t, A), f1 = lin(t, A.map(Math.log)), f2 = lin(t, A.map(v => 1 / v));
    const fits = [[0, f0, -f0.m, A[0] / (2 * -f0.m)], [1, f1, -f1.m, Math.LN2 / -f1.m], [2, f2, f2.m, 1 / (f2.m * A[0])]];
    const best = fits.slice().sort((a, b) => b[1].r2 - a[1].r2)[0], second = fits.slice().sort((a, b) => b[1].r2 - a[1].r2)[1];
    const un = { 0: "mol/(L·t)", 1: "1/t", 2: "L/(mol·t)" };
    box.innerHTML = fits.map(f => `Ordem ${f[0]}: R² = ${fmt(f[1].r2, 5)}${f === best ? " ← melhor" : ""}`).join("<br>") +
      `<br><br>Melhor ajuste: <strong>ordem ${best[0]}</strong> · k = <strong>${fmt(best[2])}</strong> ${un[best[0]]} · t½ (a partir de [A]₀ = ${fmt(A[0])}) ≈ ${fmt(best[3])}` +
      (best[2] <= 0 ? '<br><span class="text-yellow-300">k negativo: os dados não decaem com o tempo; confira a entrada.</span>' : "") +
      (best[1].r2 - second[1].r2 < 0.005 ? '<br><span class="text-yellow-300">Diferença de R² pequena: o ajuste não distingue bem as ordens. Colete mais pontos.</span>' : "");
  };

  /* ---------- 51: calibração do eletrodo de pH ---------- */
  function r51() {
    page("51. CALIBRAÇÃO DO ELETRODO DE pH (2 PONTOS)", `<p class="text-sm mb-2">Com dois tampões e as leituras em mV, calcula a inclinação, a eficiência frente ao valor de Nernst, o potencial de assimetria e o pH de uma amostra.</p>
      ${grid(fld("e-pa", "pH do tampão A", "4.00") + fld("e-ea", "Leitura em A (mV)", "172") + fld("e-pb", "pH do tampão B", "7.00") + fld("e-eb", "Leitura em B (mV)", "3") + fld("e-T", "Temperatura (°C)", "25") + fld("e-es", "Leitura da amostra (mV)", "-45"))}
      <button class="dos-btn mb-3" onclick="runEl14()">CALCULAR</button>${out("e-res")}
      <p class="text-xs opacity-80 mt-2">Inclinação teórica = 2,303·R·T/F ≈ 59,16 mV/pH a 25 °C. Em geral aceita-se eficiência entre 95 e 102 % e potencial em pH 7 próximo de 0 ± 30 mV. Calibre com tampões que cercam o pH da amostra.</p>`);
    runEl14();
  }
  window.runEl14 = function () {
    const pa = NUM("e-pa"), ea = NUM("e-ea"), pb = NUM("e-pb"), eb = NUM("e-eb"), T = NUM("e-T"), es = NUM("e-es"), box = $("e-res");
    if (![pa, ea, pb, eb, T].every(isFinite) || pa === pb || T < -20 || T > 120) { box.textContent = "Informe pH diferentes nos dois tampões, as leituras e uma temperatura plausível."; return; }
    const m = (ea - eb) / (pa - pb), S = 0.198411 * (T + 273.15), eff = 100 * Math.abs(m) / S, off = eb - m * (pb - 7);
    let h = `Inclinação = <strong>${fmt(m)} mV/pH</strong> (teórica ${fmt(-S)} a ${fmt(T)} °C)<br>Eficiência = <strong>${fmt(eff)} %</strong> — ${eff >= 95 && eff <= 102 ? "boa" : eff >= 90 && eff < 95 ? "aceitável, mas o eletrodo está envelhecendo" : eff > 102 ? "acima do esperado: confira a temperatura e os tampões" : "ruim: limpe ou troque o eletrodo"}<br>Potencial em pH 7 = ${fmt(off)} mV${Math.abs(off) > 30 ? ' <span class="text-yellow-300">(fora de ± 30 mV)</span>' : ""}`;
    if (m >= 0) h += '<br><span class="text-yellow-300">Inclinação positiva: o eletrodo de vidro deve dar leitura que diminui com o pH. Confira as leituras.</span>';
    if (isFinite(es) && m !== 0) { const ph = pb + (es - eb) / m; h += `<br>pH da amostra = <strong>${fmt(ph, 4)}</strong>${ph < Math.min(pa, pb) - 0.5 || ph > Math.max(pa, pb) + 0.5 ? ' <span class="text-yellow-300">(fora da faixa dos tampões: extrapolação)</span>' : ""}`; }
    box.innerHTML = h;
  };

  const R4 = { 49: r49, 50: r50, 51: r51 }, orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    const n = parseInt(id);
    if (R4[n]) { if (typeof playBeep === "function") playBeep(700, 0.04); R4[n](); if (typeof screenAnimateIn === "function") screenAnimateIn(); return; }
    orig(id);
  };
  window.ChemTools14 = { lin };
})();
