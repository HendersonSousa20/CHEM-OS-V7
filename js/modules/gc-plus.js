/* ==========================================================================
   MÓDULO 24 PLUS (v10) — camada de estudo sobre o guia de Química Geral:
   painel de progresso + sequência (streak), próximo tópico recomendado,
   revisão espaçada, SIMULADO GERAL com diagnóstico por tópico, FLASHCARDS
   dos termos-chave e navegação anterior/próximo. Reaproveita GC_TOPICS e
   GC_QUIZZES; não altera o conteúdo original.
   ========================================================================== */
(function () {
  "use strict";
  if (typeof GC_TOPICS === "undefined" || typeof gcRenderMenu !== "function") return;
  var DAY = 864e5, EX_N = 20;
  var $c = function () { return document.getElementById("gc-content"); };
  var pct = function (p) { return p && p.total ? Math.round(100 * p.score / p.total) : 0; };
  var bar = function (v) { return '<div class="gcp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + v + '"><i style="width:' + v + '%"></i></div>'; };
  var stats = function () { return (loadPrefs().gcStats) || {}; };
  var topic = function (k) { return GC_TOPICS.find(function (t) { return t.key === k; }); };

  /* ---- sequência diária (streak) ---- */
  function touchStreak() {
    var s = stats(), today = new Date().toDateString(), y = new Date(Date.now() - DAY).toDateString();
    if (s.last === today) return;
    s.n = s.last === y ? (s.n || 0) + 1 : 1; s.last = today; s.best = Math.max(s.best || 0, s.n);
    savePrefs({ gcStats: s });
  }
  /* ---- registra tentativas e melhor nota ao salvar progresso ---- */
  var origSave = gcSaveProgress;
  gcSaveProgress = function (key, score, total) {
    origSave(key, score, total); touchStreak();
    var s = stats(); s.tries = s.tries || {}; s.best = s.best || 0;
    var t = s.tries[key] || { n: 0, best: 0 }; t.n++; t.best = Math.max(t.best, score); s.tries[key] = t;
    savePrefs({ gcStats: s });
  };

  function status(p) {
    if (!p) return { l: "NOVO", c: "opacity-60" };
    var old = Date.now() - (p.at || 0) > 14 * DAY;
    if (pct(p) >= 80 && !old) return { l: "DOMINADO", c: "text-green-400" };
    if (old) return { l: "REVISAR (esquecendo)", c: "text-yellow-300" };
    return { l: "REFORÇAR", c: "text-yellow-300" };
  }
  function recommended() {
    var pr = gcGetProgress(), t = GC_TOPICS.find(function (x) { return !pr[x.key]; });
    if (t) return { t: t, why: "próximo na trilha" };
    var w = GC_TOPICS.slice().sort(function (a, b) { return pct(pr[a.key]) - pct(pr[b.key]); })[0];
    return { t: w, why: "seu ponto mais fraco (" + pct(pr[w.key]) + "%)" };
  }

  /* ---- MENU ---- */
  gcRenderMenu = function () {
    var c = $c(); if (!c) return;
    var pr = gcGetProgress(), st = stats(), done = GC_TOPICS.filter(function (t) { return pr[t.key]; });
    var avg = done.length ? Math.round(done.reduce(function (a, t) { return a + pct(pr[t.key]); }, 0) / done.length) : 0;
    var mastered = GC_TOPICS.filter(function (t) { return status(pr[t.key]).l === "DOMINADO"; }).length;
    var overall = Math.round(100 * mastered / GC_TOPICS.length), rec = recommended();
    var live = st.last && (st.last === new Date().toDateString() || st.last === new Date(Date.now() - DAY).toDateString());
    var cards = GC_TOPICS.map(function (t, i) {
      var p = pr[t.key], s = status(p);
      return '<button onclick="gcSelectTopic(\'' + t.key + '\')" data-t="' + (t.title + " " + t.key).toLowerCase() + '" class="gcp-card dos-border p-3 text-left w-full">' +
        '<div class="font-bold text-sm flex justify-between items-center gap-2"><span>' + t.icon + " " + t.title + '</span></div>' +
        '<div class="text-xs mt-1 flex justify-between"><span class="' + s.c + '">[' + s.l + ']</span><span>' + (p ? pct(p) + "% · " + p.score + "/" + p.total : "—") + '</span></div>' + bar(pct(p)) + '</button>';
    }).join("");
    c.innerHTML =
      '<div class="dos-border p-3 mb-3"><div class="flex flex-wrap justify-between gap-2 text-sm font-bold"><span>DOMÍNIO GERAL: ' + mastered + "/" + GC_TOPICS.length + ' tópicos dominados</span>' +
      '<span>SEQUÊNCIA: ' + (live ? st.n : 0) + ' dia(s)' + (st.best ? ' · recorde ' + st.best : '') + '</span></div>' + bar(overall) +
      '<div class="text-xs opacity-80 mt-1">Média nos quizzes: ' + (done.length ? avg + "%" : "—") + ' · Revisados: ' + done.length + "/" + GC_TOPICS.length + ' · Dominado = 80%+ nos últimos 14 dias.</div></div>' +
      '<div class="dos-border p-3 mb-3 flex flex-wrap items-center justify-between gap-2"><div class="text-sm"><strong>[PRÓXIMO]</strong> ' + rec.t.icon + " " + rec.t.title + ' <span class="opacity-70">— ' + rec.why + '</span></div>' +
      '<button class="dos-btn" onclick="gcSelectTopic(\'' + rec.t.key + '\')">[→] CONTINUAR</button></div>' +
      '<div class="flex flex-wrap gap-2 mb-3"><button class="dos-btn" onclick="gcExamStart(\'review\')">[REVISÃO DO DIA] 10 QUESTÕES FOCADAS</button><button class="dos-btn" onclick="gcExamStart()">[SIMULADO] ' + EX_N + ' QUESTÕES MISTAS</button><button class="dos-btn" onclick="gcFcStart()">[FLASHCARDS] TERMOS-CHAVE</button><button class="dos-btn" onclick="gcRenderGlossary()">[GLOSSÁRIO GERAL]</button></div>' +
      '<input id="gcp-filter" type="search" placeholder="Filtrar tópicos… (ex: gases, ligação, ácidos)" aria-label="Filtrar tópicos" class="w-full mb-2" oninput="gcpFilter(this.value)">' +
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-2" id="gcp-grid">' + cards + '</div><div id="gcp-empty" class="text-xs opacity-70 hidden mt-2">Nenhum tópico encontrado.</div>';
  };
  window.gcpFilter = function (v) {
    v = (v || "").trim(); var n = 0;
    document.querySelectorAll("#gcp-grid .gcp-card").forEach(function (b) { var ok = !v || chemMatch(b.dataset.t, v); b.style.display = ok ? "" : "none"; if (ok) n++; });
    var e = document.getElementById("gcp-empty"); if (e) e.classList.toggle("hidden", n > 0);
  };

  /* ---- TÓPICO: tempo de leitura + navegação anterior/próximo ---- */
  var origTopic = gcRenderTopic;
  gcRenderTopic = function () {
    origTopic(); var c = $c(); if (!c) return;
    var i = GC_TOPICS.findIndex(function (t) { return t.key === gcActiveTopic; }); if (i < 0) return;
    var min = Math.max(1, Math.round(c.innerText.length / 900)), pr = gcGetProgress()[gcActiveTopic];
    var head = c.querySelector(".font-bold");
    if (head) head.insertAdjacentHTML("afterend", '<div class="text-xs opacity-70 mb-2">Tópico ' + (i + 1) + " de " + GC_TOPICS.length + " · leitura ≈ " + min + " min" + (pr ? " · último quiz: " + pct(pr) + "%" : "") + "</div>");
    var X = typeof GC_EXTRA !== "undefined" && GC_EXTRA[gcActiveTopic];
    if (X) c.insertAdjacentHTML("beforeend", '<div class="dos-border p-3 mt-4"><div class="font-bold text-sm mb-2">[+] APROFUNDE-SE</div>' +
      '<div class="text-xs mb-1 opacity-80">ERROS COMUNS</div><ul class="list-disc pl-4 text-xs mb-3">' + X.pit.map(function (x) { return "<li class=\"mb-1\">" + x + "</li>"; }).join("") + "</ul>" +
      '<div class="text-xs mb-1 opacity-80">NO MUNDO REAL</div><p class="text-xs mb-3">' + X.real + "</p>" +
      '<div class="text-xs mb-1 opacity-80">PARA IR ALÉM</div><p class="text-xs">' + X.deep + "</p></div>");
    var prev = GC_TOPICS[i - 1], next = GC_TOPICS[i + 1];
    c.insertAdjacentHTML("beforeend", '<div class="flex justify-between gap-2 mt-4 pt-3 border-t border-current">' +
      (prev ? '<button class="dos-btn text-xs" onclick="gcSelectTopic(\'' + prev.key + '\')">← ' + prev.title + "</button>" : "<span></span>") +
      (next ? '<button class="dos-btn text-xs" onclick="gcSelectTopic(\'' + next.key + '\')">' + next.title + " →</button>" : '<button class="dos-btn text-xs" onclick="gcExamStart()">[SIMULADO] fechar com chave de ouro →</button>') + "</div>");
    c.scrollIntoView && c.scrollIntoView({ block: "start" });
  };

  /* ---- SIMULADO GERAL ---- */
  var ex = null;
  window.gcExamStart = function (mode) {
    var pool = [], pr = gcGetProgress(), n = EX_N, title = "SIMULADO";
    var keys = GC_TOPICS.map(function (t) { return t.key; });
    if (mode === "review") {
      var weak = keys.filter(function (k) { return status(pr[k]).l !== "DOMINADO"; });
      if (weak.length) keys = weak.sort(function (a, b) { return pct(pr[a]) - pct(pr[b]); });
      n = 10; title = "REVISÃO DO DIA";
    }
    keys.forEach(function (k) { (GC_QUIZZES[k] || []).concat(typeof GC_EXTRA !== "undefined" && GC_EXTRA[k] ? GC_EXTRA[k].q : []).forEach(function (q) { pool.push({ k: k, q: q }); }); });
    ex = { title: title, i: 0, ans: [], qs: gcShuffle(pool).slice(0, n).map(function (x) {
      var idx = gcShuffle(x.q.options.map(function (_, j) { return j; }));
      return { k: x.k, q: x.q.q, opts: idx.map(function (j) { return x.q.options[j]; }), ok: idx.indexOf(x.q.correct), why: x.q.explain };
    }) };
    playBeep(600, 0.03); examRender();
  };
  function examRender() {
    var c = $c(); if (!c || !ex) return;
    if (ex.i >= ex.qs.length) return examReport();
    var q = ex.qs[ex.i], a = ex.ans[ex.i];
    var opts = q.opts.map(function (o, j) {
      var cls = "dos-btn text-left w-full text-sm mb-2";
      if (a !== undefined) cls += j === q.ok ? " gcp-ok" : (j === a ? " gcp-bad" : "");
      return '<button class="' + cls + '" ' + (a !== undefined ? "disabled" : 'onclick="gcExamAnswer(' + j + ')"') + ">" + "ABCD"[j] + ") " + o + "</button>";
    }).join("");
    c.innerHTML = '<div class="flex justify-between text-xs mb-1"><span>' + ex.title + ' — questão ' + (ex.i + 1) + "/" + ex.qs.length + '</span><button class="underline" onclick="gcInit()">sair</button></div>' + bar(Math.round(100 * ex.i / ex.qs.length)) +
      '<div class="text-xs opacity-70 mt-2">' + topic(q.k).title + '</div><div class="font-bold my-2">' + q.q + "</div>" + opts +
      (a !== undefined ? '<div class="dos-border p-2 text-xs mb-2"><strong>' + (a === q.ok ? "[CERTO]" : "[ERRADO]") + "</strong> " + q.why + '</div><button class="dos-btn" onclick="gcExamNext()">' + (ex.i + 1 < ex.qs.length ? "PRÓXIMA →" : "VER RESULTADO →") + "</button>" : "");
  }
  window.gcExamAnswer = function (j) { if (!ex || ex.ans[ex.i] !== undefined) return; ex.ans[ex.i] = j; playBeep(j === ex.qs[ex.i].ok ? 880 : 220, 0.05); examRender(); };
  window.gcExamNext = function () { ex.i++; examRender(); };
  window.gcExamAgain = function () { gcExamStart(ex && ex.title !== "SIMULADO" ? "review" : undefined); };
  function examReport() {
    var c = $c(), by = {}, right = 0;
    ex.qs.forEach(function (q, i) { var b = by[q.k] = by[q.k] || { r: 0, t: 0 }; b.t++; if (ex.ans[i] === q.ok) { b.r++; right++; } });
    touchStreak(); var s = stats(); s.exams = (s.exams || []).concat([{ at: Date.now(), r: right, t: ex.qs.length }]).slice(-10); savePrefs({ gcStats: s });
    var p = Math.round(100 * right / ex.qs.length), weak = Object.keys(by).filter(function (k) { return by[k].r < by[k].t; }).sort(function (a, b) { return by[a].r / by[a].t - by[b].r / by[b].t; });
    var verdict = p >= 90 ? "Excelente! Base sólida." : p >= 70 ? "Bom. Reforce os pontos abaixo." : p >= 50 ? "Razoável — vale revisar os tópicos fracos." : "Comece pelos tópicos abaixo, um de cada vez.";
    var prev = (s.exams.length > 1) ? s.exams[s.exams.length - 2] : null;
    c.innerHTML = '<div class="dos-border p-3 mb-3"><div class="text-lg font-bold">RESULTADO: ' + right + "/" + ex.qs.length + " (" + p + "%)</div>" + bar(p) + '<div class="text-sm mt-1">' + verdict + (prev ? " Simulado anterior: " + Math.round(100 * prev.r / prev.t) + "%." : "") + "</div></div>" +
      '<div class="text-sm font-bold mb-1">DIAGNÓSTICO POR TÓPICO</div>' + Object.keys(by).map(function (k) { var v = by[k], pp = Math.round(100 * v.r / v.t); return '<div class="text-xs mb-1 flex justify-between gap-2"><span>' + topic(k).title + "</span><span>" + v.r + "/" + v.t + "</span></div>" + bar(pp); }).join("") +
      (weak.length ? '<div class="text-sm font-bold mt-3 mb-1">REVISAR AGORA</div><div class="flex flex-wrap gap-2">' + weak.slice(0, 4).map(function (k) { return '<button class="dos-btn text-xs" onclick="gcSelectTopic(\'' + k + '\')">' + topic(k).title + "</button>"; }).join("") + "</div>" : "") +
      '<div class="flex flex-wrap gap-2 mt-4"><button class="dos-btn" onclick="gcExamAgain()">REFAZER</button><button class="dos-btn" onclick="gcInit()">← TÓPICOS</button></div>';
  }

  /* ---- FLASHCARDS ---- */
  var fc = null;
  window.gcFcStart = function () {
    var known = stats().cards || {}, all = [];
    GC_TOPICS.forEach(function (t) { (t.glossary || []).forEach(function (g) { all.push({ k: t.key, term: g.term, def: g.def }); }); });
    var todo = all.filter(function (x) { return !known[x.term]; });
    fc = { deck: gcShuffle(todo.length ? todo : all), i: 0, flip: false, total: all.length, knownN: all.length - todo.length, again: todo.length === 0 };
    fcRender();
  };
  function fcRender() {
    var c = $c(); if (!c || !fc) return;
    if (fc.i >= fc.deck.length) { c.innerHTML = '<div class="dos-border p-3 mb-3 font-bold">Rodada concluída! Termos que você marcou como "sei": ' + (stats().cards ? Object.keys(stats().cards).length : 0) + "/" + fc.total + '.</div><div class="flex gap-2 flex-wrap"><button class="dos-btn" onclick="gcFcStart()">NOVA RODADA</button><button class="dos-btn" onclick="gcInit()">← TÓPICOS</button></div>'; return; }
    var x = fc.deck[fc.i];
    c.innerHTML = '<div class="flex justify-between text-xs mb-1"><span>FLASHCARD ' + (fc.i + 1) + "/" + fc.deck.length + (fc.again ? " (revisão total)" : "") + '</span><button class="underline" onclick="gcInit()">sair</button></div>' + bar(Math.round(100 * fc.i / fc.deck.length)) +
      '<button class="gcp-flash dos-border w-full p-6 my-3 text-center" onclick="gcFcFlip()" aria-live="polite"><div class="text-xs opacity-70 mb-2">' + topic(x.k).title + "</div>" +
      (fc.flip ? '<div class="text-sm">' + x.def + "</div>" : '<div class="text-xl font-bold">' + x.term + '</div><div class="text-xs opacity-60 mt-3">toque ou Espaço para virar · depois → (sei) ou ← (ainda não)</div>') + "</button>" +
      (fc.flip ? '<div class="flex gap-2"><button class="dos-btn flex-1" onclick="gcFcRate(false)">AINDA NÃO SEI</button><button class="dos-btn flex-1" onclick="gcFcRate(true)">SEI ✓</button></div>' : "");
  }
  window.gcFcFlip = function () { fc.flip = !fc.flip; fcRender(); };
  window.gcFcRate = function (ok) {
    var x = fc.deck[fc.i], s = stats(); s.cards = s.cards || {};
    if (ok) s.cards[x.term] = 1; else { delete s.cards[x.term]; fc.deck.push(x); }
    savePrefs({ gcStats: s }); touchStreak(); fc.i++; fc.flip = false; fcRender();
  };
  document.addEventListener("keydown", function (e) {
    var tg = e.target; if (!fc || !$c() || !document.querySelector(".gcp-flash")) return;
    if (tg.tagName === "INPUT" && !(tg.id === "cli-input" && !tg.value)) return;
    if (e.key === " ") { e.preventDefault(); gcFcFlip(); }
    else if (fc.flip && (e.key === "ArrowRight" || e.key === "ArrowLeft")) gcFcRate(e.key === "ArrowRight");
  });
})();
