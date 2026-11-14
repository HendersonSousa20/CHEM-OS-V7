        /* ==========================================================================
           16. MÓDULO 25 — DETETIVE QUÍMICO (IDENTIFICAÇÃO DE CÁTIONS)
           Jogo de investigação baseado em química analítica qualitativa real:
           o aluno recebe uma amostra "desconhecida" contendo um único cátion
           metálico e precisa identificá-lo usando testes de bancada genuínos
           (cor da solução, teste de chama, e reações de precipitação com quatro
           reagentes clássicos) — a mesma lógica da "marcha analítica" ensinada em
           química analítica qualitativa, simplificada para uso didático.

           As cores de chama e as reações de precipitação usadas aqui são fatos
           científicos padrão (não texto de nenhuma fonte específica) — os mesmos
           encontrados em qualquer livro-texto de química analítica.
           ========================================================================== */

        const CD_CATIONS = [
            {
                key: "na", symbol: "Na⁺", name: "Sódio",
                flame: { hex: "#FFD54A", desc: "amarelo intenso, muito característico e persistente" },
                solution: { hex: null, desc: "incolor" },
                tests: {
                    naoh: { ppt: false, hex: null, desc: "Nenhuma turbidez — hidróxido de sódio é solúvel." },
                    na2co3: { ppt: false, hex: null, desc: "Nenhum precipitado — carbonato de sódio é solúvel." },
                    h2so4: { ppt: false, hex: null, desc: "Nenhum precipitado — sulfato de sódio é solúvel." },
                    hcl: { ppt: false, hex: null, desc: "Nenhum precipitado — cloreto de sódio é solúvel." }
                },
                keyClue: "Nenhum reagente forma precipitado (praticamente todos os sais de sódio são solúveis), e a chama amarela intensa e persistente é um dos testes mais confiáveis e conhecidos em química analítica."
            },
            {
                key: "k", symbol: "K⁺", name: "Potássio",
                flame: { hex: "#C9A0FF", desc: "violeta/lilás, geralmente fraca — mais fácil de ver através de um vidro azul de cobalto" },
                solution: { hex: null, desc: "incolor" },
                tests: {
                    naoh: { ppt: false, hex: null, desc: "Nenhuma turbidez — hidróxido de potássio é solúvel." },
                    na2co3: { ppt: false, hex: null, desc: "Nenhum precipitado — carbonato de potássio é solúvel." },
                    h2so4: { ppt: false, hex: null, desc: "Nenhum precipitado — sulfato de potássio é solúvel." },
                    hcl: { ppt: false, hex: null, desc: "Nenhum precipitado — cloreto de potássio é solúvel." }
                },
                keyClue: "Assim como o sódio, quase todos os sais de potássio são solúveis (nenhum precipitado). A chama violeta/lilás, embora mais fraca que a do sódio, é o teste definitivo."
            },
            {
                key: "ca", symbol: "Ca²⁺", name: "Cálcio",
                flame: { hex: "#FF8A50", desc: "laranja-avermelhada (\"laranja-tijolo\")" },
                solution: { hex: null, desc: "incolor" },
                tests: {
                    naoh: { ppt: true, hex: "#F2F2E8", desc: "Turbidez branca fraca — Ca(OH)₂ é apenas parcialmente solúvel." },
                    na2co3: { ppt: true, hex: "#FFFFFF", desc: "Precipitado branco — CaCO₃, praticamente insolúvel." },
                    h2so4: { ppt: true, hex: "#F5F5EE", desc: "Turbidez/precipitado branco fraco — CaSO₄ é pouco solúvel." },
                    hcl: { ppt: false, hex: null, desc: "Nenhum precipitado — cloreto de cálcio é solúvel." }
                },
                keyClue: "Precipitado branco com carbonato de sódio (CaCO₃) combinado com a chama laranja-tijolo característica confirma o cálcio."
            },
            {
                key: "sr", symbol: "Sr²⁺", name: "Estrôncio",
                flame: { hex: "#FF3B3B", desc: "vermelho-carmim intenso" },
                solution: { hex: null, desc: "incolor" },
                tests: {
                    naoh: { ppt: false, hex: null, desc: "Nenhum precipitado significativo — Sr(OH)₂ é moderadamente solúvel." },
                    na2co3: { ppt: true, hex: "#FFFFFF", desc: "Precipitado branco — SrCO₃, insolúvel." },
                    h2so4: { ppt: true, hex: "#FFFFFF", desc: "Precipitado branco — SrSO₄, pouco solúvel." },
                    hcl: { ppt: false, hex: null, desc: "Nenhum precipitado — cloreto de estrôncio é solúvel." }
                },
                keyClue: "A chama vermelho-carmim intensa é a marca registrada do estrôncio (usada até em fogos de artifício vermelhos), reforçada pelos precipitados brancos com carbonato e sulfato."
            },
            {
                key: "ba", symbol: "Ba²⁺", name: "Bário",
                flame: { hex: "#8BE38B", desc: "verde-amarelada" },
                solution: { hex: null, desc: "incolor" },
                tests: {
                    naoh: { ppt: false, hex: null, desc: "Nenhum precipitado significativo — Ba(OH)₂ é razoavelmente solúvel." },
                    na2co3: { ppt: true, hex: "#FFFFFF", desc: "Precipitado branco — BaCO₃, insolúvel." },
                    h2so4: { ppt: true, hex: "#FFFFFF", desc: "Precipitado branco denso, imediato — BaSO₄, extremamente insolúvel (teste clássico e muito confiável)." },
                    hcl: { ppt: false, hex: null, desc: "Nenhum precipitado — cloreto de bário é solúvel." }
                },
                keyClue: "O precipitado branco denso e imediato com ácido sulfúrico (BaSO₄) é um dos testes mais característicos e confiáveis de toda a química analítica qualitativa — combinado com a chama verde-amarelada, identifica o bário com segurança."
            },
            {
                key: "cu", symbol: "Cu²⁺", name: "Cobre(II)",
                flame: { hex: "#3DBFA0", desc: "verde-azulada" },
                solution: { hex: "#3B7FD1", desc: "azul (cor característica dos íons Cu²⁺ hidratados em solução)" },
                tests: {
                    naoh: { ppt: true, hex: "#2E6FD6", desc: "Precipitado azul gelatinoso — Cu(OH)₂." },
                    na2co3: { ppt: true, hex: "#2FA48A", desc: "Precipitado azul-esverdeado — carbonato básico de cobre." },
                    h2so4: { ppt: false, hex: null, desc: "Nenhum precipitado — sulfato de cobre é solúvel." },
                    hcl: { ppt: false, hex: null, desc: "Nenhum precipitado — cloreto de cobre(II) é solúvel." }
                },
                keyClue: "A própria cor azul da solução já é um forte indício — poucos cátions comuns dão soluções coloridas. O precipitado azul gelatinoso com NaOH confirma o cobre(II)."
            },
            {
                key: "fe3", symbol: "Fe³⁺", name: "Ferro(III)",
                flame: { hex: null, desc: "sem cor de chama característica/confiável — não é um bom teste para este cátion" },
                solution: { hex: "#C8801A", desc: "amarelo-alaranjada (por hidrólise do íon Fe³⁺ em água)" },
                tests: {
                    naoh: { ppt: true, hex: "#8B4A2B", desc: "Precipitado marrom-avermelhado gelatinoso — Fe(OH)₃ (teste muito característico)." },
                    na2co3: { ppt: true, hex: "#8B4A2B", desc: "Precipitado marrom (hidróxido, com liberação de CO₂ — o carbonato de ferro(III) não é estável em água)." },
                    h2so4: { ppt: false, hex: null, desc: "Nenhum precipitado — sulfato de ferro(III) é solúvel." },
                    hcl: { ppt: false, hex: null, desc: "Nenhum precipitado — cloreto de ferro(III) é solúvel." }
                },
                keyClue: "A cor amarelo-alaranjada da própria solução, somada ao precipitado marrom-avermelhado gelatinoso característico com NaOH, identifica o ferro(III) com segurança — sem precisar do teste de chama, que não é confiável para este íon."
            },
            {
                key: "pb", symbol: "Pb²⁺", name: "Chumbo(II)",
                flame: { hex: "#A9B4C0", desc: "azulada muito pálida, pouco confiável como teste isolado" },
                solution: { hex: null, desc: "incolor" },
                tests: {
                    naoh: { ppt: true, hex: "#FFFFFF", desc: "Precipitado branco (Pb(OH)₂) que se redissolve em excesso de NaOH — comportamento anfótero." },
                    na2co3: { ppt: true, hex: "#FFFFFF", desc: "Precipitado branco — PbCO₃, insolúvel." },
                    h2so4: { ppt: true, hex: "#FFFFFF", desc: "Precipitado branco — PbSO₄, insolúvel." },
                    hcl: { ppt: true, hex: "#FFFFFF", desc: "Precipitado branco — PbCl₂ (parcialmente solúvel a quente, mas precipita a frio)." }
                },
                keyClue: "É o único cátion desta lista que forma precipitado branco com TODOS os quatro reagentes, incluindo o HCl (PbCl₂) — esse padrão \"positivo em tudo\" é a marca registrada do chumbo(II)."
            }
        ];

        const CD_REAGENTS = [
            { key: "naoh", label: "Hidróxido de sódio (NaOH)" },
            { key: "na2co3", label: "Carbonato de sódio (Na₂CO₃)" },
            { key: "h2so4", label: "Ácido sulfúrico diluído (H₂SO₄)" },
            { key: "hcl", label: "Ácido clorídrico diluído (HCl)" }
        ];

        let cdCase = null; // { cation, testsRun: {naoh:bool,...}, flameRun: bool, log: [...] }

        function cdContainer() { return document.getElementById("cd-content"); }

        function cdGetStats() {
            return loadPrefs().cdStats || { solved: 0, total: 0 };
        }

        function cdSaveStats(correct) {
            const stats = cdGetStats();
            stats.total += 1;
            if (correct) stats.solved += 1;
            savePrefs({ cdStats: stats });
            return stats;
        }

        function cdRank(stats) {
            if (stats.solved >= 8) return "Detetive Mestre";
            if (stats.solved >= 3) return "Detetive Experiente";
            if (stats.solved >= 1) return "Detetive Novato";
            return "Estagiário(a)";
        }

        function cdInit() {
            cdCase = null;
            cdRenderIntro();
        }

        function cdRenderIntro() {
            const c = cdContainer();
            if (!c) return;
            const stats = cdGetStats();
            c.innerHTML = `
                <div class="dos-border p-3 text-xs mb-3">
                    <div class="font-bold mb-1">[CASO] Uma amostra desconhecida chegou ao laboratório.</div>
                    <div>Ela contém um único cátion metálico, e cabe a você identificá-lo. Você tem à disposição a cor da solução, o teste de chama e quatro reagentes clássicos de precipitação — os mesmos usados na "marcha analítica" da química qualitativa de verdade. Use o mínimo de testes necessários para ter certeza antes de registrar sua conclusão.</div>
                </div>
                <div class="text-xs opacity-70 mb-3">Reputação atual: <strong>${cdRank(stats)}</strong> (${stats.solved} de ${stats.total} casos resolvidos corretamente)</div>
                <button onclick="cdNewCase()" class="dos-btn">[NOVO CASO] RECEBER AMOSTRA</button>
            `;
        }

        function cdNewCase() {
            const cation = CD_CATIONS[Math.floor(Math.random() * CD_CATIONS.length)];
            cdCase = {
                cation,
                flameRun: false,
                testsRun: {},
                log: [`Amostra recebida. Cor da solução observada: ${cation.solution.desc}.`]
            };
            cdRenderBench();
            playBeep(600, 0.03);
        }

        function cdSwatchHTML(hex, size) {
            const s = size || 22;
            const style = hex
                ? `width:${s}px;height:${s}px;background:${hex};border:1px solid var(--text-color);flex-shrink:0;`
                : `width:${s}px;height:${s}px;background:transparent;border:1px dashed var(--text-color);opacity:0.5;flex-shrink:0;`;
            return `<div style="${style}"></div>`;
        }

        function cdRenderBench() {
            const c = cdContainer();
            if (!c) return;
            const cation = cdCase.cation;

            const reagentButtons = CD_REAGENTS.map(r => {
                const done = cdCase.testsRun[r.key];
                return `<button onclick="cdRunReagent('${r.key}')" ${done ? 'disabled' : ''} class="dos-btn text-xs ${done ? 'opacity-40' : ''}">${done ? '[OK] ' : '[+] '}${r.label}</button>`;
            }).join('');

            const optionsHTML = CD_CATIONS.map(c2 => `<option value="${c2.key}">${c2.symbol} — ${c2.name}</option>`).join('');

            c.innerHTML = `
                <button onclick="cdInit()" class="dos-btn text-xs mb-3">[←] ENCERRAR CASO SEM CONCLUIR</button>

                <div class="flex flex-wrap gap-4 items-start mb-3">
                    <div class="dos-border p-2 flex items-center gap-2">
                        <div class="text-xs">
                            <div class="opacity-70">Cor da solução:</div>
                            <div class="font-bold">${cation.solution.desc}</div>
                        </div>
                        ${cdSwatchHTML(cation.solution.hex, 28)}
                    </div>
                    <div class="dos-border p-2">
                        <button onclick="cdRunFlame()" ${cdCase.flameRun ? 'disabled' : ''} class="dos-btn text-xs ${cdCase.flameRun ? 'opacity-40' : ''}">${cdCase.flameRun ? '[OK] ' : '[+] '}TESTE DE CHAMA</button>
                        <div id="cd-flame-result" class="mt-2"></div>
                    </div>
                </div>

                <div class="text-xs font-bold mb-1 opacity-80">REAGENTES DISPONÍVEIS</div>
                <div class="flex flex-wrap gap-1 mb-3">${reagentButtons}</div>

                <div class="text-xs font-bold mb-1 opacity-80">LOG DE OBSERVAÇÕES</div>
                <div id="cd-log" class="dos-border p-2 text-xs mb-3 max-h-40 overflow-y-auto space-y-2"></div>

                <div class="dos-border p-2">
                    <div class="text-xs font-bold mb-1 opacity-80">REGISTRAR CONCLUSÃO</div>
                    <div class="flex gap-2 flex-wrap items-center">
                        <select id="cd-guess" class="dos-input p-1 bg-black text-xs">${optionsHTML}</select>
                        <button onclick="cdSubmitGuess()" class="dos-btn text-xs">[VEREDITO] ESTE É O CÁTION</button>
                    </div>
                </div>
            `;
            cdRenderLog();
        }

        function cdRenderLog() {
            const log = document.getElementById("cd-log");
            if (!log) return;
            log.innerHTML = cdCase.log.map(entry => `<div>• ${entry}</div>`).join('');
            log.scrollTop = log.scrollHeight;
        }

        function cdRunFlame() {
            if (cdCase.flameRun) return;
            cdCase.flameRun = true;
            const cation = cdCase.cation;
            const resultDiv = document.getElementById("cd-flame-result");
            if (resultDiv) {
                resultDiv.innerHTML = `<div class="flex items-center gap-2 text-xs">${cdSwatchHTML(cation.flame.hex, 24)}<span>${cation.flame.desc}</span></div>`;
            }
            cdCase.log.push(`Teste de chama: ${cation.flame.desc}.`);
            cdRenderLog();
            cdRenderBench(); // atualiza estado do botão (desabilitado)
            playBeep(700, 0.02);
        }

        function cdRunReagent(key) {
            if (cdCase.testsRun[key]) return;
            cdCase.testsRun[key] = true;
            const cation = cdCase.cation;
            const result = cation.tests[key];
            const reagent = CD_REAGENTS.find(r => r.key === key);
            cdCase.log.push(`+ ${reagent.label}: ${result.desc}`);
            cdRenderBench();
            playBeep(result.ppt ? 750 : 450, 0.02);
        }

        function cdSubmitGuess() {
            const guess = document.getElementById("cd-guess").value;
            const correct = guess === cdCase.cation.key;
            const stats = cdSaveStats(correct);
            cdRenderVerdict(correct, stats);
            playBeep(correct ? 900 : 250, correct ? 0.05 : 0.08);
        }

        function cdRenderVerdict(correct, stats) {
            const c = cdContainer();
            if (!c) return;
            const cation = cdCase.cation;
            const guessedKey = document.getElementById("cd-guess") ? document.getElementById("cd-guess").value : null;
            const guessed = CD_CATIONS.find(x => x.key === guessedKey);

            const testsHTML = [
                `<div>• Cor da solução: ${cation.solution.desc}</div>`,
                cdCase.flameRun ? `<div>• Teste de chama: ${cation.flame.desc}</div>` : `<div class="opacity-50">• Teste de chama: não realizado</div>`,
                ...CD_REAGENTS.map(r => cdCase.testsRun[r.key]
                    ? `<div>• ${r.label}: ${cation.tests[r.key].desc}</div>`
                    : `<div class="opacity-50">• ${r.label}: não realizado</div>`)
            ].join('');

            c.innerHTML = `
                <div id="cd-report-print">
                    <div class="text-sm font-bold mb-1">${correct ? '[CASO RESOLVIDO]' : '[CONCLUSÃO INCORRETA]'} FICHA DO CASO</div>
                    <div class="text-[10px] opacity-60 mb-3">CHEM.OS — Detetive Químico (Módulo 25)</div>

                    <div class="dos-border p-2 text-xs mb-2 ${correct ? 'text-green-400' : 'text-red-400'}">
                        ${correct
                            ? `Correto! A amostra era realmente <strong>${cation.symbol} (${cation.name})</strong>.`
                            : `Não foi dessa vez. Você apontou <strong>${guessed ? guessed.symbol + ' (' + guessed.name + ')' : '—'}</strong>, mas a amostra era <strong>${cation.symbol} (${cation.name})</strong>.`}
                    </div>

                    <div class="dos-border p-2 text-xs mb-2">
                        <div class="font-bold mb-1 opacity-80">TESTES REALIZADOS NESTE CASO</div>
                        ${testsHTML}
                    </div>

                    <div class="dos-border p-2 text-xs mb-2">
                        <div class="font-bold mb-1 opacity-80">COMO IDENTIFICAR ${cation.symbol} COM SEGURANÇA</div>
                        <div>${cation.keyClue}</div>
                    </div>

                    <div class="text-xs opacity-70">Reputação atual: <strong>${cdRank(stats)}</strong> (${stats.solved} de ${stats.total} casos resolvidos corretamente)</div>
                </div>

                <div class="flex gap-2 mt-3">
                    <button onclick="window.print()" class="dos-btn">[PRN] IMPRIMIR FICHA</button>
                    <button onclick="cdInit()" class="dos-btn">[NOVO] PRÓXIMO CASO</button>
                </div>
            `;
        }
