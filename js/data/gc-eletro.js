/* v11.2 — Tópico 16 do guia (Eletroquímica: pilhas e eletrólise) + 10 perguntas (5 base + 5 extras). Conteúdo original. */
(function () {
  if (typeof GC_TOPICS === "undefined" || GC_TOPICS.some(t => t.key === "eletroquimica")) return;
  GC_TOPICS.push({
    key: "eletroquimica", icon: "[ELQ]", title: "16. Eletroquímica: Pilhas e Eletrólise",
    notes: [
      "Eletroquímica estuda a conversão entre energia química e elétrica por reações redox. Numa <strong>pilha</strong> (célula galvânica) a reação é espontânea e gera corrente; na <strong>eletrólise</strong> uma fonte externa força uma reação não espontânea.",
      "Em qualquer célula, a <strong>oxidação ocorre no ânodo</strong> e a <strong>redução no cátodo</strong>; os elétrons vão do ânodo para o cátodo pelo fio. Na pilha o cátodo é o polo (+); na eletrólise os sinais se invertem (cátodo −, ânodo +).",
      "O potencial padrão da pilha é E°pilha = E°cátodo − E°ânodo (potenciais de redução). E° &gt; 0 indica reação espontânea, e ΔG° = −nFE°.",
      "Na eletrólise, a Lei de Faraday liga carga e quantidade de substância: m = (M · I · t) / (z · F), com F ≈ 96 485 C por mol de elétrons.",
      "Os módulos 32 (Pilhas) e 33 (Eletrólise) fazem esses cálculos."
    ],
    mnemonic: "\"ÂNODO e OXIDAÇÃO começam com vogal; CÁTODO e REDUÇÃO, com consoante.\"",
    glossary: [
      { term: "Ponte salina", def: "Tubo ou membrana com íons que fecha o circuito da pilha e mantém cada semicélula eletricamente neutra." },
      { term: "Constante de Faraday (F)", def: "Carga de 1 mol de elétrons: ≈ 96 485 C/mol." },
      { term: "Eletrólise", def: "Processo em que uma corrente elétrica externa provoca uma reação redox não espontânea." }
    ],
    examples: [
      { problem: "Numa pilha Zn|Zn²⁺∥Cu²⁺|Cu, E°(Cu²⁺/Cu) = +0,34 V e E°(Zn²⁺/Zn) = −0,76 V. Qual é o E° da pilha?", solution: "E°pilha = 0,34 − (−0,76) = +1,10 V. Positivo: espontânea (Zn oxida no ânodo; Cu²⁺ reduz no cátodo)." },
      { problem: "Qual massa de cobre se deposita com 2,0 A durante 1 hora (Cu²⁺; M = 63,5 g/mol)?", solution: "Q = 2,0 × 3600 = 7200 C → n(e⁻) = 7200 ÷ 96 485 ≈ 0,0746 mol → Cu = 0,0373 mol (2 e⁻ por Cu) → m ≈ 0,0373 × 63,5 ≈ 2,37 g." }
    ],
    links: [{ id: 32, label: "Módulo 32 · Pilhas" }, { id: 33, label: "Módulo 33 · Eletrólise" }, { id: 12, label: "Módulo 12 · Nernst" }]
  });
  const Q = (q, options, correct, explain) => ({ q, options, correct, explain });
  GC_QUIZZES.eletroquimica = [
    Q("Em qualquer célula eletroquímica, a oxidação ocorre no:", ["Cátodo", "Ânodo", "Eletrólito", "Fio condutor"], 1, "Ânodo = oxidação; cátodo = redução, tanto em pilhas quanto em eletrólises."),
    Q("Uma pilha com E°pilha = +0,80 V tem reação:", ["Espontânea", "Não espontânea", "Impossível", "Em equilíbrio"], 0, "E° positivo ⇒ ΔG° negativo ⇒ espontânea."),
    Q("Na eletrólise, o cátodo é o polo:", ["Positivo", "Negativo", "Neutro", "Alternado"], 1, "Na eletrólise o cátodo liga-se ao polo negativo da fonte (ao contrário da pilha)."),
    Q("Quantos mols de elétrons correspondem a 96 485 C?", ["0,5", "1", "2", "96 485"], 1, "Essa é a constante de Faraday: carga de 1 mol de elétrons."),
    Q("Para depositar 1 mol de Al a partir de Al³⁺ são necessários:", ["1 mol de elétrons", "2 mol de elétrons", "3 mol de elétrons", "6 mol de elétrons"], 2, "Al³⁺ + 3 e⁻ → Al: 3 mol de elétrons por mol de alumínio.")
  ];
  GC_EXTRA.eletroquimica = {
    pit: ["<b>Cátodo é sempre positivo?</b> Só na pilha. Na eletrólise o cátodo é o polo negativo; o que não muda é a redução no cátodo.", "<b>E° depende da quantidade de substância?</b> Não: E° é intensivo e não se multiplica pelos coeficientes (já o ΔG° depende de n)."],
    real: "A galvanoplastia deposita camadas finas de metal (cromo, níquel, prata) por eletrólise; o alumínio é obtido por eletrólise de Al₂O₃ fundido, processo que consome muita energia elétrica.",
    deep: "O potencial real depende das concentrações: E = E° − (RT/nF)·ln Q (Nernst). Ao descarregar, Q aumenta até Q = K e E = 0: a pilha \"acaba\".",
    q: [
      Q("O potencial padrão de uma pilha é calculado por:", ["E°ânodo − E°cátodo", "E°cátodo − E°ânodo", "E°cátodo + E°ânodo", "E°cátodo × n"], 1, "Usa-se sempre potenciais de redução: cátodo menos ânodo."),
      Q("Uma pilha deixa de fornecer corrente quando:", ["Q = K (E = 0)", "Q = 0", "E° = 1 V", "n = 0"], 0, "No equilíbrio químico não há mais tensão para gerar corrente."),
      Q("A ponte salina serve para:", ["Gerar elétrons", "Fechar o circuito e manter a neutralidade das soluções", "Aumentar o E°", "Evitar a oxidação"], 1, "Permite o fluxo de íons e evita acúmulo de carga nas semicélulas."),
      Q("Cerca de 1930 C passam por uma solução de Ag⁺ (M = 108 g/mol). A massa de prata depositada é:", ["1,08 g", "2,16 g", "0,54 g", "4,32 g"], 1, "n(e⁻) = 1930 ÷ 96 485 = 0,02 mol → 0,02 × 108 = 2,16 g (Ag⁺ + e⁻ → Ag)."),
      Q("Qual destes processos exige energia elétrica externa?", ["Pilha de Daniell", "Eletrólise", "Corrosão do ferro", "Respiração celular"], 1, "Eletrólise força reações não espontâneas; os demais são espontâneos.")
    ]
  };
})();
