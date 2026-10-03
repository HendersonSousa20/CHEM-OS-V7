/* v8.3 — Módulo 27: Fórmula empírica e molecular. Módulo 28: Quiz da Tabela Periódica. */
(function () {
  const SUB = "₀₁₂₃₄₅₆₇₈₉";
  const sub = n => n === 1 ? "" : String(n).replace(/\d/g, d => SUB[d]);
  const $ = id => document.getElementById(id);

  /* ---------- 27: Fórmula empírica / molecular ---------- */
  function empirical(text, molarMass) {
    const rows = [];
    text.split(/\n|;/).forEach(l => {
      if (!l.trim()) return;
      const m = l.trim().match(/^([A-Z][a-z]?)\s*[:=\s]\s*([\d.,]+)\s*(%|g)?$/);
      if (!m) throw new Error(`Linha inválida: "${l.trim()}". Use o formato "C 40,0".`);
      const w = ATOMIC_WEIGHTS[m[1]]; if (!w) throw new Error(`Elemento desconhecido: ${m[1]}`);
      const v = parseFloat(m[2].replace(",", ".")); if (!(v > 0)) throw new Error(`Valor inválido para ${m[1]}.`);
      rows.push({ s: m[1], w, mol: v / w });
    });
    if (rows.length < 2) throw new Error("Informe pelo menos dois elementos.");
    const min = Math.min(...rows.map(r => r.mol));
    rows.forEach(r => r.ratio = r.mol / min);
    let k = 0;
    for (let i = 1; i <= 12 && !k; i++) if (rows.every(r => Math.abs(r.ratio * i - Math.round(r.ratio * i)) < 0.12)) k = i;
    const exact = k > 0; if (!exact) k = 1;
    rows.forEach(r => r.n = Math.max(1, Math.round(r.ratio * k)));
    const fmt = (mult = 1) => rows.map(r => r.s + (r.n * mult === 1 ? "" : r.n * mult)).join("");
    const fmtSub = (mult = 1) => rows.map(r => r.s + sub(r.n * mult)).join("");
    const mass = rows.reduce((a, r) => a + r.n * r.w, 0);
    const out = { rows, exact, empirical: fmt(), empiricalSub: fmtSub(), empiricalMass: mass, molecular: null };
    if (molarMass > 0) {
      const f = molarMass / mass, n = Math.round(f);
      if (n >= 1 && Math.abs(f - n) < 0.1) { out.factor = n; out.molecular = fmt(n); out.molecularSub = fmtSub(n); }
      else out.factorWarn = f;
    }
    return out;
  }

  function renderFormula() {
    $("screen-content").innerHTML = `
      <div class="text-xl font-bold border-b border-current pb-1 mb-3">27. FÓRMULA EMPÍRICA E MOLECULAR (A PARTIR DA COMPOSIÇÃO)</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
        <label>Composição (um elemento por linha: símbolo e % ou massa em g)
          <textarea id="fm-input" rows="5" class="dos-input w-full p-1" spellcheck="false">C 40,0\nH 6,71\nO 53,29</textarea></label>
        <label>Massa molar do composto (g/mol) — opcional, para a fórmula molecular
          <input id="fm-mm" type="text" inputmode="decimal" value="180" class="dos-input w-full p-1"></label>
      </div>
      <button class="dos-btn mb-3" onclick="runFormula()">CALCULAR FÓRMULA</button>
      <div id="formula-result" class="dos-border p-3 text-sm" aria-live="polite">Clique em CALCULAR FÓRMULA. Exemplo carregado: glicose (C 40 %, H 6,71 %, O 53,29 %).</div>`;
  }
  window.runFormula = function () {
    const box = $("formula-result");
    try {
      const mm = parseFloat($("fm-mm").value.replace(",", ".")) || 0;
      const r = empirical($("fm-input").value, mm);
      const steps = r.rows.map(x => `${x.s.padEnd(3)} mol = ${x.mol.toFixed(4)}   razão = ${x.ratio.toFixed(3)}   → ${x.n}`).join("\n");
      box.innerHTML = `<pre class="whitespace-pre-wrap mb-2">${steps}</pre>
        ${r.exact ? "" : `<div class="text-yellow-300 mb-2">⚠ A razão não ficou próxima de inteiros: confira as porcentagens.</div>`}
        <div class="text-lg font-bold">Fórmula empírica: ${r.empiricalSub} <span class="opacity-70 text-sm">(${r.empiricalMass.toFixed(3)} g/mol)</span></div>
        ${r.molecular ? `<div class="text-lg font-bold">Fórmula molecular: ${r.molecularSub} <span class="opacity-70 text-sm">(fator n = ${r.factor})</span></div>`
          : r.factorWarn ? `<div class="text-yellow-300">⚠ A massa molar informada não é múltiplo inteiro da empírica (razão ${r.factorWarn.toFixed(2)}).</div>` : ""}`;
    } catch (e) { box.innerHTML = `<span class="test-fail">${e.message}</span>`; }
  };

  /* ---------- 28: Quiz da Tabela Periódica ---------- */
  const BEST = "chemos-quiz-best";
  const best = () => { try { return +localStorage.getItem(BEST) || 0; } catch (e) { return 0; } };
  const WK = "chemos-quiz-wrong";
  const getWrong = () => { try { return JSON.parse(localStorage.getItem(WK)) || []; } catch (e) { return []; } };
  const setWrong = a => { try { localStorage.setItem(WK, JSON.stringify([...new Set(a)])); } catch (e) {} };
  let Q = null;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const MODES = [["Símbolo → nome", e => [e[1], e[2]]], ["Nome → símbolo", e => [e[2], e[1]]], ["Nº atômico → símbolo", e => ["Elemento nº " + e[0], e[1]]], ["Símbolo → família", e => [e[1], e[6]]], ["Revisar meus erros", e => [e[1], e[2]]]];

  function renderQuizMenu() {
    Q = null;
    $("screen-content").innerHTML = `
      <div class="text-xl font-bold border-b border-current pb-1 mb-3">28. [QUIZ] TABELA PERIÓDICA — 10 PERGUNTAS</div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 text-sm">
        <label>Modo<select id="qz-mode" class="dos-input w-full p-1">${MODES.map((m, i) => `<option value="${i}">${m[0]}${i === 4 ? " (" + getWrong().length + ")" : ""}</option>`).join("")}</select></label>
        <label>Elementos<select id="qz-pool" class="dos-input w-full p-1"><option value="20">1 a 20</option><option value="54">1 a 54</option><option value="118">1 a 118</option></select></label>
        <div class="flex items-end"><button class="dos-btn w-full" onclick="startQuiz()">INICIAR</button></div>
      </div>
      <div class="text-sm opacity-80">Melhor pontuação: <strong>${best()}/10</strong>. Durante o jogo, use as teclas 1 a 4. Os elementos que você errar ficam salvos para o modo "Revisar meus erros".</div>`;
  }
  window.startQuiz = function () {
    const mode = +$("qz-mode").value;
    let pool = RAW_ELEMENTS.slice(0, +$("qz-pool").value);
    if (mode === 4) { const w = getWrong(); pool = RAW_ELEMENTS.filter(e => w.includes(e[0])); if (!pool.length) { showToast("Você ainda não tem erros para revisar."); return; } }
    Q = { mode, pool, qs: shuffle(pool.slice()).slice(0, 10), i: 0, score: 0, lock: false };
    nextQ();
  };
  function nextQ() {
    if (Q.i >= Q.qs.length) return endQuiz();
    const e = Q.qs[Q.i], mi = Q.mode === 4 ? (Q.cur = Math.floor(Math.random() * 4)) : Q.mode, [q, ans] = MODES[mi][1](e);
    const all = [...new Set(RAW_ELEMENTS.map(x => MODES[mi][1](x)[1]))].filter(a => a !== ans);
    Q.ans = ans; Q.opts = shuffle([ans, ...shuffle(all).slice(0, 3)]); Q.lock = false;
    $("screen-content").innerHTML = `
      <div class="text-xl font-bold border-b border-current pb-1 mb-3">28. [QUIZ] ${MODES[Q.mode][0].toUpperCase()}</div>
      <div class="text-sm mb-2 opacity-80">Pergunta ${Q.i + 1}/${Q.qs.length} · Acertos: ${Q.score}</div>
      <div class="text-4xl font-bold my-4" id="qz-q">${q}</div>
      <div id="quiz-area" class="grid grid-cols-1 md:grid-cols-2 gap-2">${Q.opts.map((o, i) => `<button class="dos-btn text-left p-2" data-o="${i}"><strong>${i + 1}.</strong> ${o}</button>`).join("")}</div>
      <div id="qz-fb" class="mt-3 text-lg" aria-live="polite"></div>`;
    $("quiz-area").onclick = ev => { const b = ev.target.closest("button"); if (b) answer(+b.dataset.o); };
  }
  function answer(i) {
    if (!Q || Q.lock) return; Q.lock = true;
    const ok = Q.opts[i] === Q.ans; if (ok) Q.score++;
    const z = Q.qs[Q.i][0]; setWrong(ok ? getWrong().filter(x => x !== z) : [...getWrong(), z]);
    document.querySelectorAll("#quiz-area button").forEach((b, x) => { if (Q.opts[x] === Q.ans) b.style.outline = "3px solid currentColor"; });
    $("qz-fb").innerHTML = ok ? '<span class="test-pass">✓ Correto!</span>' : `<span class="test-fail">✗ Era: ${Q.ans}</span>`;
    setTimeout(() => { if (Q) { Q.i++; nextQ(); } }, ok ? 700 : 1500);
  }
  function endQuiz() {
    const s = Q.score, tot = Q.qs.length, prev = best(), rec = s > prev && Q.mode !== 4 && tot === 10;
    if (rec) try { localStorage.setItem(BEST, s); } catch (e) {}
    $("screen-content").innerHTML = `
      <div class="text-xl font-bold border-b border-current pb-1 mb-3">28. [QUIZ] RESULTADO</div>
      <div class="text-5xl font-bold my-4">${s}/${tot}</div>
      <div class="mb-3">${rec ? "★ Novo recorde!" : `Melhor pontuação: ${prev}/10`} ${s === tot ? "Perfeito!" : s >= tot * 0.7 ? "Muito bom!" : "Continue praticando."}</div>
      <button class="dos-btn" onclick="renderTool(28)">JOGAR DE NOVO</button>`;
    Q = null;
  }
  document.addEventListener("keydown", e => {
    if (Q && !Q.lock && /^[1-4]$/.test(e.key) && $("quiz-area") && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) answer(+e.key - 1);
  });

  window.ChemTools = { empirical };
  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    const n = parseInt(id);
    if (n !== 27 && n !== 28) return orig(id);
    if (typeof playBeep === "function") playBeep(700, 0.04);
    n === 27 ? renderFormula() : renderQuizMenu();
    if (typeof screenAnimateIn === "function") screenAnimateIn();
  };
})();
