/* v11.3 — Painel GHS do módulo 2 (PubChem), reescrito para segurança:
   • usa os pictogramas e a palavra de advertência OFICIAIS do PubChem quando existem; senão mapeia pelo CÓDIGO H (Anexo 3 do GHS), não por palavra-chave;
   • mostra TODAS as frases (as mais graves primeiro; o restante em "ver mais"), com tradução em português;
   • "sem dados" ou falha de rede nunca é exibido como "seguro". */
(function () {
  "use strict";
  const E = s => (typeof escapeHTML === "function" ? escapeHTML(s) : String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])));
  const ICON = { explosivo: ["GHS01", "Explosivo"], inflamavel: ["GHS02", "Inflamável"], oxidante: ["GHS03", "Oxidante"], gas_pressao: ["GHS04", "Gás sob pressão"], corrosivo: ["GHS05", "Corrosivo"], toxico: ["GHS06", "Toxicidade aguda"], irritante: ["GHS07", "Irritante / nocivo"], saude: ["GHS08", "Perigo à saúde"], ambiental: ["GHS09", "Perigo ao ambiente aquático"] };
  // Código H → pictograma(s) (GHS, Anexo 3). H304/H334/H340…H373 = GHS08; H318 = GHS05; H302/H312/H332/H315/H317/H319/H335/H336 = GHS07.
  const RANGES = [[200, 205, "explosivo"], [240, 241, "explosivo"], [220, 228, "inflamavel"], [241, 242, "inflamavel"], [250, 252, "inflamavel"], [260, 261, "inflamavel"], [270, 272, "oxidante"], [280, 281, "gas_pressao"],
    [290, 290, "corrosivo"], [314, 314, "corrosivo"], [318, 318, "corrosivo"], [300, 301, "toxico"], [310, 311, "toxico"], [330, 331, "toxico"],
    [302, 302, "irritante"], [312, 312, "irritante"], [315, 315, "irritante"], [317, 317, "irritante"], [319, 319, "irritante"], [332, 332, "irritante"], [335, 336, "irritante"],
    [304, 304, "saude"], [334, 334, "saude"], [340, 341, "saude"], [350, 351, "saude"], [360, 361, "saude"], [370, 373, "saude"], [400, 400, "ambiental"], [410, 411, "ambiental"]];
  const iconsForCode = n => RANGES.filter(r => n >= r[0] && n <= r[1]).map(r => r[2]);
  const PT = { 200: "Explosivo instável.", 201: "Explosivo; perigo de explosão em massa.", 202: "Explosivo; perigo grave de projeção.", 203: "Explosivo; perigo de incêndio, de sopro ou de projeção.", 204: "Perigo de incêndio ou de projeção.", 205: "Perigo de explosão em massa em caso de incêndio.",
    220: "Gás extremamente inflamável.", 221: "Gás inflamável.", 222: "Aerossol extremamente inflamável.", 223: "Aerossol inflamável.", 224: "Líquido e vapores extremamente inflamáveis.", 225: "Líquido e vapores altamente inflamáveis.", 226: "Líquido e vapores inflamáveis.", 228: "Sólido inflamável.",
    240: "Risco de explosão sob ação do calor.", 241: "Risco de incêndio ou explosão sob ação do calor.", 242: "Risco de incêndio sob ação do calor.", 250: "Inflama-se espontaneamente em contato com o ar.", 251: "Auto-aquecimento; pode inflamar.", 252: "Auto-aquecimento em grandes quantidades; pode inflamar.",
    260: "Em contato com a água libera gases inflamáveis que podem inflamar-se espontaneamente.", 261: "Em contato com a água libera gases inflamáveis.", 270: "Pode provocar ou agravar um incêndio; comburente.", 271: "Pode provocar incêndio ou explosão; comburente forte.", 272: "Pode agravar um incêndio; comburente.",
    280: "Contém gás sob pressão; risco de explosão sob ação do calor.", 281: "Contém gás refrigerado; pode provocar queimaduras ou lesões criogênicas.", 290: "Pode ser corrosivo para os metais.",
    300: "Fatal se ingerido.", 301: "Tóxico se ingerido.", 302: "Nocivo se ingerido.", 304: "Pode ser fatal se ingerido e penetrar nas vias respiratórias.", 310: "Fatal em contato com a pele.", 311: "Tóxico em contato com a pele.", 312: "Nocivo em contato com a pele.",
    314: "Provoca queimaduras graves na pele e lesões oculares graves.", 315: "Provoca irritação à pele.", 317: "Pode provocar reação alérgica na pele.", 318: "Provoca lesões oculares graves.", 319: "Provoca irritação ocular grave.", 330: "Fatal se inalado.", 331: "Tóxico se inalado.", 332: "Nocivo se inalado.",
    334: "Pode provocar sintomas de alergia ou asma ou dificuldades respiratórias se inalado.", 335: "Pode provocar irritação das vias respiratórias.", 336: "Pode provocar sonolência ou vertigem.", 340: "Pode provocar defeitos genéticos.", 341: "Suspeito de provocar defeitos genéticos.", 350: "Pode provocar câncer.", 351: "Suspeito de provocar câncer.",
    360: "Pode prejudicar a fertilidade ou o feto.", 361: "Suspeito de prejudicar a fertilidade ou o feto.", 362: "Pode prejudicar bebês alimentados com leite materno.", 370: "Provoca danos aos órgãos.", 371: "Pode provocar danos aos órgãos.", 372: "Provoca danos aos órgãos após exposição prolongada ou repetida.", 373: "Pode provocar danos aos órgãos após exposição prolongada ou repetida.",
    400: "Muito tóxico para os organismos aquáticos.", 410: "Muito tóxico para os organismos aquáticos, com efeitos prolongados.", 411: "Tóxico para os organismos aquáticos, com efeitos prolongados.", 412: "Nocivo para os organismos aquáticos, com efeitos prolongados.", 413: "Pode provocar efeitos nocivos prolongados para os organismos aquáticos.", 420: "Prejudica a saúde pública e o ambiente ao destruir o ozônio na atmosfera superior." };
  const parse = h => { const m = /^\s*(?:H|EUH)?(\d{3})\b/.exec(h) && /^\s*H(\d{3})\b/.exec(h); return m ? { code: +m[1], pct: (/\((\d+(?:[.,]\d+)?)%\)/.exec(h) || [])[1] || "", danger: /\[\s*Danger/i.test(h) } : { code: null, pct: "", danger: /\[\s*Danger/i.test(h) }; };
  // gravidade para ordenar: fatal/tóxico agudo > corrosivo/CMR/órgãos > físicos graves > demais
  const sev = c => c == null ? 9 : [300, 310, 330].includes(c) ? 0 : [301, 311, 331, 314, 318, 340, 350, 360, 370, 372, 304, 334, 200, 201, 202, 203, 224, 220, 222, 250, 260, 270, 271].includes(c) ? 1 : [341, 351, 361, 371, 373, 225, 226, 228, 280, 290, 400, 410].includes(c) ? 2 : 3;
  const fromOfficial = names => { const out = []; (names || []).forEach(n => { const t = String(n).toLowerCase(); const k = /explos/.test(t) ? "explosivo" : /flamm/.test(t) ? "inflamavel" : /oxid/.test(t) ? "oxidante" : /gas|compress|cylinder/.test(t) ? "gas_pressao" : /corros/.test(t) ? "corrosivo" : /acute|toxic|skull/.test(t) ? "toxico" : /health/.test(t) ? "saude" : /irrit|exclam/.test(t) ? "irritante" : /environ/.test(t) ? "ambiental" : null; if (k && !out.includes(k)) out.push(k); }); return out; };

  window.ghsAnalyze = function (pv) {
    const hz = (pv && pv.hazards) || [], items = hz.map(h => ({ raw: h, ...parse(h) })), keys = [];
    fromOfficial(pv && pv.pictograms).forEach(k => keys.includes(k) || keys.push(k));
    items.forEach(it => it.code != null && iconsForCode(it.code).forEach(k => keys.includes(k) || keys.push(k)));
    const order = Object.keys(ICON); keys.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    const sig = /danger|perigo/i.test((pv && pv.signal) || "") || items.some(i => i.danger) ? "PERIGO" : (pv && pv.signal) || items.length ? "ATENÇÃO" : "";
    items.sort((a, b) => sev(a.code) - sev(b.code) || (a.code || 999) - (b.code || 999));
    return { items, keys, signal: sig };
  };

  window.ghsPanelHTML = function (pv) {
    if (pv === null || pv === undefined) return `<div class="mt-2 pt-2 border-t border-current text-xs"><strong class="text-yellow-400">GHS: classificação indisponível.</strong> Não foi possível obter os dados de segurança agora (rede ou servidor). <strong>Isso não significa que a substância seja segura</strong>: consulte a FISPQ/SDS do fabricante.</div>`;
    const a = ghsAnalyze(pv);
    if (!a.items.length) return `<div class="mt-2 pt-2 border-t border-current text-xs"><strong class="text-yellow-400">GHS: sem classificação no PubChem.</strong> O PubChem não devolveu frases de perigo para este composto. <strong>Isso não significa que ele seja seguro</strong> (pode apenas não ter sido classificado): consulte a FISPQ/SDS antes de manusear.</div>`;
    const svg = k => (typeof GHS_ICON_SVG !== "undefined" && GHS_ICON_SVG[k]) || "";
    const icons = a.keys.map(k => `<div class="ghs-pictogram" title="${E(ICON[k][0] + " — " + ICON[k][1])}"><span>${svg(k)}</span></div>`).join("");
    const li = it => { const c = it.code, pt = c != null && PT[c] ? PT[c] : "", en = it.raw.replace(/\s*\[[^\]]*\]\s*$/, "");
      return `<li title="${E(it.raw)}">${c != null ? `<strong>H${c}</strong> — ` : ""}${E(pt || en)}${it.pct ? ` <span class="opacity-70">(${E(it.pct)}% dos notificantes)</span>` : ""}</li>`; };
    const first = a.items.slice(0, 6), rest = a.items.slice(6);
    return `<div class="mt-2 pt-2 border-t border-current"><div class="flex flex-wrap items-center gap-2 mb-1"><strong class="text-red-400">ALERTAS GHS:</strong>${a.signal ? `<span class="font-bold border border-current px-1">${a.signal}</span>` : ""}</div>
      ${icons ? `<div class="flex gap-2 flex-wrap items-center mb-2" role="img" aria-label="Pictogramas de perigo GHS: ${E(a.keys.map(k => ICON[k][1]).join(", "))}">${icons}</div>` : ""}
      <ul class="list-disc pl-4 text-xs opacity-90">${first.map(li).join("")}</ul>
      ${rest.length ? `<details class="text-xs mt-1"><summary class="cursor-pointer">+ ${rest.length} frase(s) de perigo</summary><ul class="list-disc pl-4 opacity-90">${rest.map(li).join("")}</ul></details>` : ""}
      <div class="text-[10px] text-yellow-400 mt-1">[!] Fonte: PubChem (classificações GHS notificadas por fornecedores; o percentual indica quantos notificantes citaram a frase). Frases em português são traduções do código H. NÃO substitui a FISPQ/SDS oficial — consulte-a antes de manusear qualquer substância.</div></div>`;
  };
})();
