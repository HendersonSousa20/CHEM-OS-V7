/* v8.1: validação visual (não bloqueante) dos campos numéricos, com mensagem acessível. */
(function () {
  const POS = "p-mm p-conc p-vol p-density d-c1 d-v1 d-c2 d-v2 wa-conc wa-ka buf-base buf-acid g-p1 g-v1 g-p2 g-v2 gi-p gi-v gi-n kin-k kin-a0 tit-ca tit-va tit-cb tit-vmax tf-ca tf-va tf-ka tf-cb tf-vmax ksp-p ksp-q ksp-value spec-lambda ner-n ner-q".split(" ");
  const NONNEG = "stoich-actual kin-t bl-a bl-eps bl-b bl-c ksp-common".split(" ");
  const RULES = {};
  POS.forEach(id => RULES[id] = [v => v > 0, "Use um valor maior que zero."]);
  NONNEG.forEach(id => RULES[id] = [v => v >= 0, "Use um valor igual ou maior que zero."]);
  RULES["p-purity"] = [v => v > 0 && v <= 100, "A pureza deve estar entre 0 e 100 %."];
  RULES["ner-n"] = [v => v >= 1 && Number.isInteger(v), "O número de elétrons deve ser um inteiro ≥ 1."];

  function check(el) {
    const r = RULES[el.id]; if (!r) return;
    const raw = String(el.value).trim().replace(",", ".");
    const bad = raw !== "" && isFinite(+raw) && !r[0](+raw);
    let w = document.getElementById(el.id + "-warn");
    el.setAttribute("aria-invalid", bad ? "true" : "false");
    if (bad && !w) { w = document.createElement("span"); w.id = el.id + "-warn"; w.className = "field-warn"; w.setAttribute("role", "alert"); el.insertAdjacentElement("afterend", w); el.setAttribute("aria-describedby", w.id); }
    if (w) { w.textContent = bad ? "⚠ " + r[1] : ""; if (!bad) w.remove(); }
  }
  document.addEventListener("input", e => { if (e.target.id in RULES) check(e.target); });
  const orig = window.renderToolInner;
  window.renderToolInner = function (id) {
    orig(id);
    document.querySelectorAll("#screen-content input[type=number]").forEach(el => { if (el.id in RULES) check(el); });
  };
})();
