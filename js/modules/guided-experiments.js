        /* ==========================================================================
           14. MÓDULO 23 — EXPERIMENTOS GUIADOS (LABORATÓRIO VIRTUAL)
           Três experimentos disponíveis (o aluno escolhe): duas titulações
           ácido-base (Forte+Forte e Fraco+Forte) e um experimento de
           precipitação/efeito do íon comum (titulação turbidimétrica). Em
           todos, diferente das calculadoras, o aluno CONDUZ o experimento:
           configura a bancada, adiciona titulante em incrementos escolhidos por
           ele mesmo (bureta virtual), observa uma grandeza física mudar em
           tempo real (cor do indicador OU turbidez) e decide quando marcar o
           "ponto de virada" — só depois compara contra o valor teórico.

           ARQUITETURA: cada experimento é descrito por um objeto de configuração
           em GE_EXPERIMENTS (rótulos, se precisa de indicador/Ka/parâmetros de
           solubilidade, e como calcular a "leitura" e a cor do frasco). Isso
           permite que geRenderBenchShell/geUpdateBenchDisplay/geRenderReport
           sejam escritos UMA VEZ, genericamente, em vez de duplicados por tipo
           de experimento — importante para manter os 3 experimentos coerentes
           conforme mais forem adicionados no futuro.

           Nota de implementação: o "molde" (shell) da bancada é construído UMA
           ÚNICA VEZ (geRenderBenchShell), e cada ação do aluno apenas atualiza
           elementos específicos via id (geUpdateBenchDisplay) — nunca recria o
           <canvas> do gráfico, o que vazaria listeners acumulados em `window`.
           ========================================================================== */

        const GE_INDICATORS = {
            fenolftaleina: { label: "Fenolftaleína", lowPH: 8.2, highPH: 10.0, colorBelow: [245, 240, 230], colorAbove: [216, 27, 130] },
            metilaranjado: { label: "Alaranjado de Metila", lowPH: 3.1, highPH: 4.4, colorBelow: [224, 60, 49], colorAbove: [242, 199, 68] },
            bromotimol: { label: "Azul de Bromotimol", lowPH: 6.0, highPH: 7.6, colorBelow: [242, 199, 68], colorAbove: [46, 134, 222] },
            metilvermelho: { label: "Vermelho de Metila", lowPH: 4.4, highPH: 6.2, colorBelow: [224, 60, 49], colorAbove: [242, 199, 68] }
        };

        const GE_KA_PRESETS = [
            { value: "custom", label: "Personalizado (usar campo abaixo)" },
            { value: "0.000018", label: "Ácido acético — Ka ≈ 1,8×10⁻⁵" },
            { value: "0.00018", label: "Ácido fórmico — Ka ≈ 1,8×10⁻⁴" },
            { value: "0.000063", label: "Ácido benzoico — Ka ≈ 6,3×10⁻⁵" },
            { value: "0.00072", label: "Ácido fluorídrico — Ka ≈ 7,2×10⁻⁴" }
        ];

        const GE_KB_PRESETS = [
            { value: "custom", label: "Personalizado (usar campo abaixo)" },
            { value: "0.000018", label: "Amônia — Kb ≈ 1,8×10⁻⁵" },
            { value: "0.00044", label: "Metilamina — Kb ≈ 4,4×10⁻⁴" },
            { value: "0.000003", label: "Hidrazina — Kb ≈ 3,0×10⁻⁶" },
            { value: "0.0000000017", label: "Piridina — Kb ≈ 1,7×10⁻⁹" }
        ];

        // Sais pouco solúveis pré-configurados para o experimento de precipitação.
        // "commonTarget" é o íon fornecido pelo titulante em cada demonstração
        // clássica (ex.: NaCl fornecendo Cl⁻ para precipitar AgCl ou PbCl2).
        const GE_SALT_PRESETS = [
            { value: "PbCl2", label: "Cloreto de chumbo(II), PbCl₂ — Kps ≈ 1,6×10⁻⁵ (recomendado para começar)", p: 1, q: 2, ksp: 1.6e-5, commonTarget: "anion" },
            { value: "CaF2", label: "Fluoreto de cálcio, CaF₂ — Kps ≈ 3,9×10⁻¹¹", p: 1, q: 2, ksp: 3.9e-11, commonTarget: "anion" },
            { value: "BaSO4", label: "Sulfato de bário, BaSO₄ — Kps ≈ 1,1×10⁻¹⁰", p: 1, q: 1, ksp: 1.1e-10, commonTarget: "anion" },
            { value: "AgCl", label: "Cloreto de prata, AgCl — Kps ≈ 1,8×10⁻¹⁰", p: 1, q: 1, ksp: 1.8e-10, commonTarget: "anion" },
            { value: "MgOH2", label: "Hidróxido de magnésio, Mg(OH)₂ — Kps ≈ 5,6×10⁻¹²", p: 1, q: 2, ksp: 5.6e-12, commonTarget: "anion" },
            { value: "custom", label: "Personalizado (usar campos abaixo)", p: 1, q: 1, ksp: null, commonTarget: "anion" }
        ];

        // Janela de opacidade (%) em que a turvação passa a ser perceptível a
        // olho nu — o análogo, no experimento de precipitação, da faixa de
        // viragem de um indicador ácido-base.
        const GE_TURBIDITY_ZONE = { low: 2, high: 12 };

        // Registro dos experimentos disponíveis no laboratório. Cada um reaproveita
        // o motor de cálculo já validado nos módulos de calculadora (6, 18 e 19).
        const GE_EXPERIMENTS = {
            "forte-forte": {
                id: "forte-forte",
                title: "Titulação Ácido Forte + Base Forte",
                icon: "[F+F]",
                blurb: "Ponto de equivalência sempre em pH 7,00. O experimento mais simples para começar.",
                needsKa: false, needsSolubilityParams: false,
                caLabel: "[Ácido] (mol/L)", vaLabel: "Volume do ácido (mL)", cbLabel: "[Base titulante] (mol/L)",
                titrantNoun: "base", turningPointLabel: "ponto de viragem",
                instructionObserve: "observe a cor do frasco",
                readoutLabel: "pHmetro (simulado)", readingLabel: "pH", readingUnit: "", readingDecimals: 2,
                scaleMin: 0, scaleMax: 14,
                theoreticalNote: () => "pH = 7,00 (neutro)",
                defaultIndicator: "bromotimol",
                indicatorHint: "A equivalência de uma titulação forte+forte é neutra (pH 7,00) — um indicador com faixa de viragem próxima de 7, como o azul de bromotimol, tende a funcionar bem aqui."
            },
            "fraco-forte": {
                id: "fraco-forte",
                title: "Titulação Ácido Fraco + Base Forte",
                icon: "[A+F]",
                blurb: "Equivalência básica (pH > 7) por hidrólise da base conjugada. Requer o Ka do ácido.",
                needsKa: true, needsSolubilityParams: false,
                caLabel: "[Ácido] (mol/L)", vaLabel: "Volume do ácido (mL)", cbLabel: "[Base titulante] (mol/L)",
                titrantNoun: "base", turningPointLabel: "ponto de viragem",
                instructionObserve: "observe a cor do frasco",
                readoutLabel: "pHmetro (simulado)", readingLabel: "pH", readingUnit: "", readingDecimals: 2,
                scaleMin: 0, scaleMax: 14,
                theoreticalNote: () => "básico, por hidrólise da base conjugada — não é pH 7,00 como numa titulação forte-forte",
                defaultIndicator: "fenolftaleina",
                indicatorHint: "A equivalência de ácido fraco + base forte é básica (pH > 7) — a fenolftaleína (viragem 8,2–10,0) costuma ser a escolha mais adequada."
            },
            "base-fraca": {
                id: "base-fraca",
                title: "Titulação Base Fraca + Ácido Forte",
                icon: "[B+F]",
                blurb: "O espelho do experimento anterior: uma base fraca (ex.: amônia) titulada com ácido forte. Equivalência ácida (pH < 7), por hidrólise do cátion conjugado. Requer o Kb da base.",
                needsKb: true, needsSolubilityParams: false,
                caLabel: "[Base] (mol/L)", vaLabel: "Volume da base (mL)", cbLabel: "[Ácido titulante] (mol/L)",
                titrantNoun: "ácido", turningPointLabel: "ponto de viragem",
                instructionObserve: "observe a cor do frasco",
                readoutLabel: "pHmetro (simulado)", readingLabel: "pH", readingUnit: "", readingDecimals: 2,
                scaleMin: 0, scaleMax: 14,
                theoreticalNote: () => "ácido, por hidrólise do cátion conjugado — não é pH 7,00 como numa titulação forte-forte",
                defaultIndicator: "metilvermelho",
                indicatorHint: "A equivalência de base fraca + ácido forte é ácida (pH < 7) — indicadores como o vermelho de metila ou o alaranjado de metila costumam ser mais adequados aqui do que a fenolftaleína (que só muda de cor em pH acima de 8)."
            },
            "solubilidade": {
                id: "solubilidade",
                title: "Efeito do Íon Comum (Titulação Turbidimétrica)",
                icon: "[ÍON]",
                blurb: "Adicione um reagente com íon comum a uma solução não saturada e descubra, pela turbidez, o volume em que o sal começa a precipitar.",
                needsKa: false, needsSolubilityParams: true,
                caLabel: "Concentração inicial do sal dissolvido, c₀ (mol/L)", vaLabel: "Volume da solução no frasco (mL)", cbLabel: "[Reagente titulante] — fornece o íon comum (mol/L)",
                titrantNoun: "reagente com íon comum", turningPointLabel: "ponto de turvação",
                instructionObserve: "observe a turbidez (transparência) do frasco",
                readoutLabel: "Turbidímetro (simulado)", readingLabel: "Turbidez", readingUnit: "%", readingDecimals: 1,
                scaleMin: 0, scaleMax: 100,
                theoreticalNote: () => "início teórico da turvação — abaixo desse volume a solução permanece clara (subsaturada)"
            }
        };

        let geState = null;
        let geChart = null;

        // Chave de autosave: salva o estado da bancada em localStorage a cada
        // ação do aluno, para sobreviver a fechar a aba / recarregar a página —
        // a proteção de navegação (geGuardNavigation) só cobria trocar de módulo
        // DENTRO do app, não fechar o navegador.
        const GE_AUTOSAVE_KEY = "chemos_ge_autosave_v1";

        function geSaveAutosave() {
            try {
                if (geHasUnsavedProgress()) localStorage.setItem(GE_AUTOSAVE_KEY, JSON.stringify(geState));
            } catch (e) { /* localStorage indisponível — autosave apenas não funciona */ }
        }

        function geClearAutosave() {
            try { localStorage.removeItem(GE_AUTOSAVE_KEY); } catch (e) { /* idem */ }
        }

        function geLoadAutosave() {
            try {
                const raw = localStorage.getItem(GE_AUTOSAVE_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch (e) { return null; }
        }

        function geContainer() {
            return document.getElementById("ge-content");
        }

        function geExp() {
            return GE_EXPERIMENTS[geState.type];
        }

        // Ponto de entrada do módulo: se houver um experimento salvo automaticamente
        // (sobrevivente a um fechamento de aba ou recarregamento), oferece retomar
        // antes de mostrar a tela de escolha. Caso contrário, vai direto ao menu.
        function geInit() {
            geState = null;
            geChart = null;
            geRenderExperimentMenu();
            const saved = geLoadAutosave();
            if (saved && saved.step === 1) geOfferResume(saved);
            pulseElement("ge-content", "screen-fade-in");
        }

        function geOfferResume(saved) {
            const exp = GE_EXPERIMENTS[saved.type];
            openModal("EXPERIMENTO EM ANDAMENTO ENCONTRADO", `
                <div class="text-sm mb-3">Encontramos um experimento salvo automaticamente que não foi finalizado: <strong>${exp ? exp.title : saved.type}</strong> (${saved.dataLog.length} ponto(s) registrado(s), ${saved.volAdded.toFixed(1)} mL de titulante já adicionados).</div>
                <div class="flex gap-2 justify-end">
                    <button id="ge-discard-autosave-btn" class="dos-btn">DESCARTAR</button>
                    <button id="ge-resume-autosave-btn" class="dos-btn">CONTINUAR DE ONDE PAREI</button>
                </div>
            `);
            const resumeBtn = document.getElementById("ge-resume-autosave-btn");
            const discardBtn = document.getElementById("ge-discard-autosave-btn");
            if (resumeBtn) resumeBtn.onclick = () => {
                closeModal();
                geState = saved;
                geState.volHistory = geState.volHistory || [];
                geRenderBenchShell();
                pulseElement("ge-content", "screen-fade-in");
                playBeep(700, 0.03);
            };
            if (discardBtn) discardBtn.onclick = () => { geClearAutosave(); closeModal(); };
        }

        function geRenderExperimentMenu() {
            const c = geContainer();
            if (!c) return;
            const cards = Object.values(GE_EXPERIMENTS).map(exp => `
                <button onclick="geSelectExperiment('${exp.id}')" class="dos-border p-3 text-left w-full">
                    <div class="font-bold text-sm mb-1">${exp.icon} ${exp.title}</div>
                    <div class="text-[10px] opacity-70">${exp.blurb}</div>
                </button>
            `).join('');

            c.innerHTML = `
                <div class="text-sm font-bold mb-2 opacity-90">ESCOLHA O EXPERIMENTO</div>
                <p class="text-xs mb-3 opacity-80">Diferente das calculadoras dos outros módulos, aqui você conduz o experimento passo a passo: prepara a bancada, adiciona titulante aos poucos, observa a mudança e só depois descobre o quanto sua leitura experimental chegou perto do valor teórico.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${cards}</div>
            `;
        }

        function geSelectExperiment(type) {
            geState = {
                type,
                step: 0,
                ca: 0, va: 0, cb: 0, ka: null, kb: null, indicatorKey: "fenolftaleina",
                p: null, q: null, ksp: null, commonTarget: "anion", s0: null,
                molesAcid: 0, equivVol: 0, vMax: 0,
                volAdded: 0,
                volHistory: [],
                dataLog: [],
                viragemPoint: null,
                nextId: 1
            };
            geRenderSetup();
            playBeep(700, 0.03);
            pulseElement("ge-content", "screen-fade-in");
        }

        function geLerp(a, b, t) { return a + (b - a) * t; }

        /* ---------- Motores de cálculo (reaproveitados dos módulos de calculadora) ---------- */

        function geColorForPH(indicatorKey, pH) {
            const ind = GE_INDICATORS[indicatorKey];
            let t = (pH - ind.lowPH) / (ind.highPH - ind.lowPH);
            t = Math.max(0, Math.min(1, t));
            const c = [0, 1, 2].map(i => Math.round(geLerp(ind.colorBelow[i], ind.colorAbove[i], t)));
            return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
        }

        function geColorForTurbidity(opacity) {
            opacity = Math.max(0, Math.min(1, opacity));
            const clear = [205, 230, 250];   // água clara, levemente azulada
            const cloudy = [232, 232, 228];  // suspensão leitosa/turva
            const c = [0, 1, 2].map(i => Math.round(geLerp(clear[i], cloudy[i], opacity)));
            return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
        }

        // Ácido forte + base forte: neutralização direta, pH = 7 na equivalência.
        function geComputePH(molesAcid, molesBase, totalVolL) {
            const excessMoles = molesBase - molesAcid;
            if (Math.abs(excessMoles) < 1e-12) return 7.0;
            if (excessMoles < 0) {
                const hConc = -excessMoles / totalVolL;
                return -Math.log10(hConc);
            }
            const ohConc = excessMoles / totalVolL;
            const pOH = -Math.log10(ohConc);
            return 14 - pOH;
        }

        // Ácido fraco + base forte: mesma lógica de 3 regiões já validada no
        // Módulo 18 (runWeakTitrationCurve), aqui aplicada a um único ponto por vez.
        function geComputePHWeakStrong(molesAcid0, molesOH, totalVolL, Ka) {
            const Kw = 1e-14;
            const Kb = Kw / Ka;
            const molesA = Math.min(molesOH, molesAcid0);
            const molesHAremain = molesAcid0 - molesA;
            const tolerance = molesAcid0 * 1e-6;

            if (Math.abs(molesOH - molesAcid0) < tolerance) {
                const cSalt = molesA / totalVolL;
                const x = (-Kb + Math.sqrt(Kb * Kb + 4 * Kb * cSalt)) / 2;
                return 14 - (-Math.log10(x));
            } else if (molesOH < molesAcid0) {
                const cHA = molesHAremain / totalVolL;
                const cA = molesA / totalVolL;
                const A = 1, B = Ka + cA, C = -Ka * cHA;
                const x = (-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A);
                return -Math.log10(x);
            } else {
                const excessOH = molesOH - molesAcid0;
                const ohConc = excessOH / totalVolL;
                return 14 - (-Math.log10(ohConc));
            }
        }

        // Base fraca + ácido forte: o espelho exato do caso anterior — aqui o
        // TITULANTE é o ácido forte, e a base fraca fica no frasco. Mesma
        // abordagem de 3 regiões (quadrática exata na região tampão, hidrólise
        // do cátion conjugado na equivalência, excesso de ácido forte depois).
        function geComputePHWeakBaseStrongAcid(molesBase0, molesH, totalVolL, Kb) {
            const Kw = 1e-14;
            const KaConj = Kw / Kb; // Ka da base conjugada protonada (BH+)
            const molesBH = Math.min(molesH, molesBase0);
            const molesBremain = molesBase0 - molesBH;
            const tolerance = molesBase0 * 1e-6;

            if (Math.abs(molesH - molesBase0) < tolerance) {
                // Equivalência: toda a base virou BH+ — hidrólise ácida do BH+.
                const cSalt = molesBH / totalVolL;
                const x = (-KaConj + Math.sqrt(KaConj * KaConj + 4 * KaConj * cSalt)) / 2;
                return -Math.log10(x);
            } else if (molesH < molesBase0) {
                // Região tampão B/BH+ — também cobre o ponto inicial (cBH+=0,
                // reduzindo-se à base fraca pura, mesma quadrática do Módulo 6).
                const cB = molesBremain / totalVolL;
                const cBH = molesBH / totalVolL;
                const A = 1, B = Kb + cBH, C = -Kb * cB;
                const y = (-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A); // [OH-]
                return 14 - (-Math.log10(y));
            } else {
                // Pós-equivalência: excesso de ácido forte domina o pH.
                const excessH = molesH - molesBase0;
                return -Math.log10(excessH / totalVolL);
            }
        }

        // Solubilidade em água pura (sem íon comum) — mesma fórmula fechada do
        // Módulo 19 (runSolubility, ramo commonConc === 0).
        function geSolubilityPureWater(p, q, ksp) {
            return Math.pow(ksp / (Math.pow(p, p) * Math.pow(q, q)), 1 / (p + q));
        }

        // Solubilidade molar na presença de um íon comum — mesmo método de
        // Newton-Raphson (com passo relativo) do Módulo 19 (runSolubility),
        // isolado aqui como função pura para ser chamada ponto a ponto.
        function geComputeSolubility(p, q, ksp, commonConc, commonTarget) {
            if (commonConc <= 0) return geSolubilityPureWater(p, q, ksp);
            function f(s) {
                const catConc = p * s + (commonTarget === "cation" ? commonConc : 0);
                const anConc = q * s + (commonTarget === "anion" ? commonConc : 0);
                return Math.pow(catConc, p) * Math.pow(anConc, q) - ksp;
            }
            function fPrime(s) {
                const h = Math.max(Math.abs(s) * 1e-6, 1e-15);
                return (f(s + h) - f(s - h)) / (2 * h);
            }
            let s = geSolubilityPureWater(p, q, ksp);
            for (let iter = 0; iter < 100; iter++) {
                const fVal = f(s);
                const fPrimeVal = fPrime(s);
                if (Math.abs(fPrimeVal) < 1e-30) break;
                const sNext = s - fVal / fPrimeVal;
                if (sNext < 0 || !isFinite(sNext)) break;
                if (Math.abs(sNext - s) < Math.abs(s) * 1e-9) { s = sNext; break; }
                s = sNext;
            }
            return s;
        }

        /* ---------- Configuração/validação da bancada ---------- */

        function geShowSetupError(msg) {
            const el = document.getElementById("ge-setup-error");
            if (!el) return;
            el.textContent = msg;
            pulseElement("ge-setup-error", "field-error-flash");
        }

        function geApplyKaPreset() {
            const preset = document.getElementById("ge-ka-preset");
            const kaField = document.getElementById("ge-ka");
            if (!preset || !kaField || preset.value === "custom") return;
            kaField.value = preset.value;
        }

        function geApplyKbPreset() {
            const preset = document.getElementById("ge-kb-preset");
            const kbField = document.getElementById("ge-kb");
            if (!preset || !kbField || preset.value === "custom") return;
            kbField.value = preset.value;
        }

        // Ao trocar o sal pré-configurado, preenche p/q/Kps/alvo do íon comum E
        // sugere uma concentração inicial (c0) e um titulante que resultem num
        // experimento com uma faixa de volume "navegável" — sem isso, o valor
        // padrão genérico quase sempre violaria a validação c0 < s0, ou (para
        // sais muito insolúveis) faria a turvação aparecer instantaneamente.
        function geApplySaltPreset() {
            const sel = document.getElementById("ge-sol-preset");
            if (!sel) return;
            const preset = GE_SALT_PRESETS.find(p => p.value === sel.value);
            if (!preset || preset.value === "custom") return;
            document.getElementById("ge-sol-p").value = preset.p;
            document.getElementById("ge-sol-q").value = preset.q;
            document.getElementById("ge-sol-ksp").value = preset.ksp;
            document.getElementById("ge-sol-target").value = preset.commonTarget;
            const s0 = geSolubilityPureWater(preset.p, preset.q, preset.ksp);
            const caField = document.getElementById("ge-ca");
            if (caField) caField.value = (s0 * 0.5).toExponential(3);
            const cbField = document.getElementById("ge-cb");
            if (cbField) cbField.value = "0.5";
        }

        function geRenderSetup() {
            const c = geContainer();
            if (!c) return;
            const exp = geExp();
            const indicatorOptions = Object.keys(GE_INDICATORS)
                .map(k => `<option value="${k}"${k === (exp.defaultIndicator || "fenolftaleina") ? " selected" : ""}>${GE_INDICATORS[k].label} (viragem: pH ${GE_INDICATORS[k].lowPH}–${GE_INDICATORS[k].highPH})</option>`)
                .join('');

            let extraFieldsHTML = '';
            if (exp.needsKa) {
                extraFieldsHTML = `
                    <div>
                        <label class="block opacity-80 mb-1">Ka do ácido fraco</label>
                        <select id="ge-ka-preset" class="dos-input p-1 w-full bg-black mb-1" onchange="geApplyKaPreset()">
                            ${GE_KA_PRESETS.map(p => `<option value="${p.value}"${p.value === "0.000018" ? " selected" : ""}>${p.label}</option>`).join('')}
                        </select>
                        <input id="ge-ka" type="number" step="any" value="0.000018" class="dos-input p-1 w-full">
                    </div>`;
            } else if (exp.needsKb) {
                extraFieldsHTML = `
                    <div>
                        <label class="block opacity-80 mb-1">Kb da base fraca</label>
                        <select id="ge-kb-preset" class="dos-input p-1 w-full bg-black mb-1" onchange="geApplyKbPreset()">
                            ${GE_KB_PRESETS.map(p => `<option value="${p.value}"${p.value === "0.000018" ? " selected" : ""}>${p.label}</option>`).join('')}
                        </select>
                        <input id="ge-kb" type="number" step="any" value="0.000018" class="dos-input p-1 w-full">
                    </div>`;
            } else if (exp.needsSolubilityParams) {
                extraFieldsHTML = `
                    <div class="md:col-span-2">
                        <label class="block opacity-80 mb-1">Sal pouco solúvel</label>
                        <select id="ge-sol-preset" class="dos-input p-1 w-full bg-black mb-1" onchange="geApplySaltPreset()">
                            ${GE_SALT_PRESETS.map(p => `<option value="${p.value}"${p.value === "PbCl2" ? " selected" : ""}>${p.label}</option>`).join('')}
                        </select>
                        <div class="grid grid-cols-3 gap-2 mb-1">
                            <div><label class="block opacity-70 text-[10px]">p (cátions/fórmula)</label><input id="ge-sol-p" type="number" step="1" value="1" class="dos-input p-1 w-full"></div>
                            <div><label class="block opacity-70 text-[10px]">q (ânions/fórmula)</label><input id="ge-sol-q" type="number" step="1" value="2" class="dos-input p-1 w-full"></div>
                            <div><label class="block opacity-70 text-[10px]">Kps</label><input id="ge-sol-ksp" type="number" step="any" value="1.6e-5" class="dos-input p-1 w-full"></div>
                        </div>
                        <label class="block opacity-80 mb-1">Íon comum fornecido pelo titulante</label>
                        <select id="ge-sol-target" class="dos-input p-1 w-full bg-black">
                            <option value="cation">Cátion</option>
                            <option value="anion" selected>Ânion</option>
                        </select>
                    </div>`;
            }

            const indicatorFieldHTML = !exp.needsSolubilityParams ? `
                    <div>
                        <label class="block opacity-80 mb-1">Indicador</label>
                        <select id="ge-indicator" class="dos-input p-1 w-full bg-black">${indicatorOptions}</select>
                    </div>` : '';

            const solubilityHint = exp.needsSolubilityParams
                ? `<div class="text-[10px] opacity-60 mt-2">Dica: comece pelo PbCl₂ (padrão) — é solúvel o bastante para a turvação aparecer aos poucos, conforme você adiciona o titulante. Sais muito insolúveis (AgCl, BaSO₄) podem turvar quase instantaneamente já na primeira gota — isso é quimicamente correto e mostra o quão baixa é a solubilidade deles.</div>`
                : '';

            const indicatorHintHTML = (!exp.needsSolubilityParams && exp.indicatorHint)
                ? `<div class="text-[10px] opacity-60 mt-2">Dica: ${exp.indicatorHint}</div>`
                : '';

            c.innerHTML = `
                <div class="text-sm font-bold mb-2 opacity-90">${exp.icon} ${exp.title.toUpperCase()}</div>
                <p class="text-xs mb-3 opacity-80">Configure a bancada abaixo. Depois, você mesmo vai adicionar o titulante gota a gota (virtualmente) e decidir, ${exp.instructionObserve}, qual é o ${exp.turningPointLabel} — exatamente como numa bancada real.</p>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                        <label class="block opacity-80 mb-1">${exp.caLabel}</label>
                        <input id="ge-ca" type="number" step="any" value="0.1" class="dos-input p-1 w-full">
                    </div>
                    <div>
                        <label class="block opacity-80 mb-1">${exp.vaLabel}</label>
                        <input id="ge-va" type="number" step="any" value="25" class="dos-input p-1 w-full">
                    </div>
                    ${extraFieldsHTML}
                    <div>
                        <label class="block opacity-80 mb-1">${exp.cbLabel}</label>
                        <input id="ge-cb" type="number" step="any" value="0.1" class="dos-input p-1 w-full">
                    </div>
                    ${indicatorFieldHTML}
                </div>
                <div class="flex gap-2 mt-3">
                    <button onclick="geStartBench()" class="dos-btn">PREPARAR BANCADA →</button>
                    <button onclick="geInit()" class="dos-btn">← TROCAR EXPERIMENTO</button>
                </div>
                <div id="ge-setup-error" class="text-red-500 text-xs mt-2" role="alert" aria-live="polite"></div>
                ${solubilityHint}
                ${indicatorHintHTML}
                <div class="text-[10px] opacity-50 mt-2">O valor teórico do ${exp.turningPointLabel} não é revelado antecipadamente — você o descobre pela mudança observada, como em um experimento real.</div>
            `;

            // Para o experimento de solubilidade, os campos c0/titulante genéricos
            // (0,1 mol/L) quase certamente violariam c0 < s0 — aplica o preset
            // padrão (PbCl2) imediatamente para já deixar valores coerentes.
            if (exp.needsSolubilityParams) geApplySaltPreset();
        }

        // Busca por bisseção o menor volume de titulante em que a solubilidade
        // cai ao nível da concentração inicial (início teórico da turvação).
        // Assume s(volume) monotonicamente decrescente, válido para os sais e
        // faixas de concentração usados neste experimento.
        function geSolveTurbidVol() {
            function sAtVol(vol) {
                const totalVolL = (geState.va + vol) / 1000;
                const commonConc = (geState.cb * (vol / 1000)) / totalVolL;
                return geComputeSolubility(geState.p, geState.q, geState.ksp, commonConc, geState.commonTarget);
            }
            let lo = 0, hi = Math.max(geState.va, 10), guard = 0;
            while (sAtVol(hi) > geState.ca && guard < 50) { hi *= 2; guard++; }
            if (sAtVol(hi) > geState.ca) return Infinity;
            for (let i = 0; i < 80; i++) {
                const mid = (lo + hi) / 2;
                if (sAtVol(mid) > geState.ca) lo = mid; else hi = mid;
            }
            return hi;
        }

        function geStartBench() {
            const exp = geExp();
            const ca = parseFloat(document.getElementById("ge-ca").value);
            const va = parseFloat(document.getElementById("ge-va").value);
            const cb = parseFloat(document.getElementById("ge-cb").value);

            if (!ca || !va || !cb || ca <= 0 || va <= 0 || cb <= 0) {
                geShowSetupError(`Preencha "${exp.caLabel}", "${exp.vaLabel}" e "${exp.cbLabel}" com valores positivos.`);
                return;
            }

            geState.ca = ca; geState.va = va; geState.cb = cb;
            geState.volAdded = 0; geState.volHistory = []; geState.dataLog = []; geState.viragemPoint = null; geState.step = 1;

            if (exp.needsKa) {
                const ka = parseFloat(document.getElementById("ge-ka").value);
                if (!ka || ka <= 0) { geShowSetupError("Informe um Ka positivo (escolha um preset ou digite o valor)."); return; }
                geState.ka = ka;
                geState.indicatorKey = document.getElementById("ge-indicator").value;
                geState.molesAcid = ca * (va / 1000);
                geState.equivVol = (geState.molesAcid / cb) * 1000;
            } else if (exp.needsKb) {
                const kb = parseFloat(document.getElementById("ge-kb").value);
                if (!kb || kb <= 0) { geShowSetupError("Informe um Kb positivo (escolha um preset ou digite o valor)."); return; }
                geState.kb = kb;
                geState.indicatorKey = document.getElementById("ge-indicator").value;
                // "molesAcid" aqui é usado genericamente como "moles da espécie
                // que está inicialmente no frasco" — neste experimento, é a base.
                geState.molesAcid = ca * (va / 1000);
                geState.equivVol = (geState.molesAcid / cb) * 1000;
            } else if (exp.needsSolubilityParams) {
                const p = parseInt(document.getElementById("ge-sol-p").value);
                const q = parseInt(document.getElementById("ge-sol-q").value);
                const ksp = parseFloat(document.getElementById("ge-sol-ksp").value);
                const commonTarget = document.getElementById("ge-sol-target").value;
                if (!p || !q || p <= 0 || q <= 0 || !ksp || ksp <= 0) { geShowSetupError("Informe p, q e Kps positivos."); return; }
                const s0 = geSolubilityPureWater(p, q, ksp);
                if (ca >= s0) {
                    geShowSetupError(`A concentração inicial (${ca} mol/L) precisa ser MENOR que a solubilidade em água pura (s₀ ≈ ${s0.toExponential(2)} mol/L) — senão a solução já começaria turva, sem precisar de titulante.`);
                    return;
                }
                geState.p = p; geState.q = q; geState.ksp = ksp; geState.commonTarget = commonTarget; geState.s0 = s0;
                const turbidVol = geSolveTurbidVol();
                if (!isFinite(turbidVol) || turbidVol > 1e6) {
                    geShowSetupError("Com esses parâmetros, seria necessário um volume irreal de titulante. Aumente a concentração do titulante ou reduza a concentração inicial.");
                    return;
                }
                geState.equivVol = turbidVol;
            } else {
                geState.indicatorKey = document.getElementById("ge-indicator").value;
                geState.molesAcid = ca * (va / 1000);
                geState.equivVol = (geState.molesAcid / cb) * 1000;
            }

            geState.vMax = Math.max(geState.equivVol * 2.5, geState.equivVol + 20);
            geRenderBenchShell();
            playBeep(700, 0.03);
            pulseElement("ge-content", "screen-fade-in");
        }

        /* ---------- Leitura ao vivo (genérica: pH ou turbidez, conforme o experimento) ---------- */

        function geCurrentReading() {
            const exp = geExp();
            if (exp.needsSolubilityParams) {
                const totalVolL = (geState.va + geState.volAdded) / 1000;
                const commonConc = (geState.cb * (geState.volAdded / 1000)) / totalVolL;
                const s = geComputeSolubility(geState.p, geState.q, geState.ksp, commonConc, geState.commonTarget);
                const precipitate = Math.max(0, geState.ca - s);
                const opacity = geState.ca > 0 ? Math.min(1, precipitate / geState.ca) : 0;
                return opacity * 100;
            }
            // "molesBase" aqui é genérico: moles de titulante adicionados até agora
            // (podem ser de um ácido ou de uma base, dependendo do experimento).
            const molesBase = geState.cb * (geState.volAdded / 1000);
            const totalVolL = (geState.va + geState.volAdded) / 1000;
            if (geState.type === "fraco-forte") {
                return geComputePHWeakStrong(geState.molesAcid, molesBase, totalVolL, geState.ka);
            }
            if (geState.type === "base-fraca") {
                return geComputePHWeakBaseStrongAcid(geState.molesAcid, molesBase, totalVolL, geState.kb);
            }
            return geComputePH(geState.molesAcid, molesBase, totalVolL);
        }

        function geColorForReading(value) {
            const exp = geExp();
            if (exp.needsSolubilityParams) return geColorForTurbidity(value / 100);
            return geColorForPH(geState.indicatorKey, value);
        }

        // Faixa destacada na régua da bancada: janela de viragem do indicador
        // escolhido (titulações) ou janela fixa de detecção visual de turvação.
        function geGetZone() {
            const exp = geExp();
            if (exp.needsSolubilityParams) return { start: GE_TURBIDITY_ZONE.low, width: GE_TURBIDITY_ZONE.high - GE_TURBIDITY_ZONE.low };
            const ind = GE_INDICATORS[geState.indicatorKey];
            return { start: ind.lowPH, width: ind.highPH - ind.lowPH };
        }

        /* ---------- Bancada (shell construído uma vez, depois só atualizado) ---------- */

        function geRenderBenchShell() {
            const c = geContainer();
            if (!c) return;
            const exp = geExp();
            const flaskLabel = exp.needsSolubilityParams
                ? "Erlenmeyer (turbidímetro)"
                : `Erlenmeyer (indicador: ${GE_INDICATORS[geState.indicatorKey].label})`;
            const infoLine = exp.needsKa
                ? `<div class="text-[10px] opacity-60 mt-1">Ka = ${geState.ka.toExponential(2)} (pKa ≈ ${(-Math.log10(geState.ka)).toFixed(2)})</div>`
                : exp.needsKb
                    ? `<div class="text-[10px] opacity-60 mt-1">Kb = ${geState.kb.toExponential(2)} (pKb ≈ ${(-Math.log10(geState.kb)).toFixed(2)})</div>`
                    : exp.needsSolubilityParams
                        ? `<div class="text-[10px] opacity-60 mt-1">Kps = ${geState.ksp.toExponential(2)} · s₀ (água pura) = ${geState.s0.toExponential(2)} mol/L</div>`
                        : '';
            const scaleMid = (exp.scaleMin + exp.scaleMax) / 2;

            c.innerHTML = `
                <div class="text-xs font-bold mb-2 opacity-70">${exp.icon} ${exp.title}</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-shrink-0 flex flex-col items-center">
                        <div class="text-xs font-bold mb-1 opacity-80">BANCADA VIRTUAL</div>
                        <div id="ge-drop-zone" class="dos-border p-3 flex flex-col items-center" style="width:180px; position:relative;">
                            <div id="ge-buret-label" class="text-[10px] opacity-70 mb-1">Bureta: 0,0 / ${geState.vMax.toFixed(0)} mL</div>
                            <div class="dos-border" style="width:24px; height:100px; position:relative; overflow:hidden; background:#111;">
                                <div id="ge-buret-fill" style="position:absolute; bottom:0; left:0; width:100%; background: var(--text-color); opacity:0.5; height:0%;"></div>
                            </div>
                            <div class="text-[10px] opacity-70 mt-3 mb-1">${flaskLabel}</div>
                            <svg id="ge-flask-svg" width="90" height="90" viewBox="0 0 90 90">
                                <path id="ge-flask-fill" d="M 35 10 L 35 35 L 15 80 Q 15 88 25 88 L 65 88 Q 75 88 75 80 L 55 35 L 55 10 Z"
                                      fill="rgb(245,240,230)" stroke="var(--text-color)" stroke-width="2" />
                            </svg>
                        </div>
                        <div class="text-[10px] opacity-60 mt-2 text-center">${exp.readoutLabel}: <strong id="ge-reading-readout" class="text-sm">0,00</strong>${exp.readingUnit}</div>
                        ${infoLine}
                        <div class="w-full mt-2">
                            <div class="text-[9px] opacity-60 mb-1">Escala de ${exp.readingLabel.toLowerCase()} (faixa destacada = janela de detecção)</div>
                            <div class="ge-ph-track dos-border">
                                <div id="ge-ph-zone" class="ge-ph-zone"></div>
                                <div id="ge-ph-marker" class="ge-ph-marker"></div>
                            </div>
                            <div class="flex justify-between text-[9px] opacity-50"><span>${exp.scaleMin}</span><span>${scaleMid}</span><span>${exp.scaleMax}${exp.readingUnit}</span></div>
                        </div>
                    </div>

                    <div class="flex-grow">
                        <div class="text-xs font-bold mb-1 opacity-80">ADICIONAR ${exp.titrantNoun.toUpperCase()} (TITULANTE)</div>
                        <div class="flex gap-1 flex-wrap mb-2">
                            <button onclick="geAddVolume(0.1)" class="dos-btn text-xs">+ 0,1 mL</button>
                            <button onclick="geAddVolume(0.5)" class="dos-btn text-xs">+ 0,5 mL</button>
                            <button onclick="geAddVolume(1)" class="dos-btn text-xs">+ 1 mL</button>
                            <button onclick="geAddVolume(5)" class="dos-btn text-xs">+ 5 mL</button>
                            <button onclick="geUndoVolume()" class="dos-btn text-xs">DESFAZER ÚLTIMA ADIÇÃO</button>
                        </div>
                        <div class="flex gap-1 flex-wrap mb-3">
                            <button onclick="geRegisterPoint()" class="dos-btn text-xs">[REG] REGISTRAR PONTO NO GRÁFICO</button>
                            <button id="ge-btn-viragem" onclick="geMarkViragem()" class="dos-btn text-xs">[!] MARCAR ${exp.turningPointLabel.toUpperCase()} AGORA</button>
                            <button onclick="geFinish()" class="dos-btn text-xs">✔ FINALIZAR E GERAR RELATÓRIO</button>
                        </div>
                        <div id="ge-viragem-status" class="text-xs text-yellow-400 mb-2" role="status" aria-live="polite">Adicione ${exp.titrantNoun} aos poucos e ${exp.instructionObserve}. Quando perceber a mudança, clique em "MARCAR ${exp.turningPointLabel.toUpperCase()} AGORA".</div>

                        <canvas id="ge-chart-canvas" class="dos-border w-full" height="220"></canvas>

                        <div class="text-xs font-bold mt-3 mb-1 opacity-80">TABELA DE DADOS (<span id="ge-count">0</span> pontos registrados)</div>
                        <div class="dos-border p-1 max-h-32 overflow-y-auto text-[11px]">
                            <table class="w-full">
                                <thead><tr class="opacity-70"><th class="text-left px-1">#</th><th class="text-left px-1">Volume (mL)</th><th class="text-left px-1">${exp.readingLabel}${exp.readingUnit ? ' (' + exp.readingUnit.trim() + ')' : ''}</th></tr></thead>
                                <tbody id="ge-table-body"><tr><td class="px-1 opacity-50" colspan="3">Nenhum ponto registrado ainda.</td></tr></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

            geChart = createInteractiveChart("ge-chart-canvas", { xLabel: "Volume de titulante (mL)", yLabel: exp.readingLabel, yClampMin: exp.scaleMin, yClampMax: exp.scaleMax });

            // Posiciona uma única vez a faixa destacada da escala (não muda
            // durante o experimento — depende só do indicador/janela escolhida).
            const zone = geGetZone();
            const zoneEl = document.getElementById("ge-ph-zone");
            if (zoneEl) {
                zoneEl.style.left = `${(zone.start / exp.scaleMax) * 100}%`;
                zoneEl.style.width = `${(zone.width / exp.scaleMax) * 100}%`;
            }

            geUpdateBenchDisplay();
        }

        // Atualiza SOMENTE os elementos que mudam a cada ação — não toca no <canvas>,
        // preservando o objeto do gráfico (evita recriar listeners a cada clique).
        function geUpdateBenchDisplay() {
            const exp = geExp();
            const reading = geCurrentReading();
            const color = geColorForReading(reading);

            const buretLabel = document.getElementById("ge-buret-label");
            if (buretLabel) buretLabel.textContent = `Bureta: ${geState.volAdded.toFixed(1)} / ${geState.vMax.toFixed(0)} mL`;

            const buretFill = document.getElementById("ge-buret-fill");
            if (buretFill) buretFill.style.height = `${Math.min(100, (geState.volAdded / geState.vMax) * 100)}%`;

            const flask = document.getElementById("ge-flask-fill");
            if (flask) flask.setAttribute("fill", color);

            const readout = document.getElementById("ge-reading-readout");
            const readingText = reading.toFixed(exp.readingDecimals);
            if (readout && readout.textContent !== readingText) {
                readout.textContent = readingText;
                pulseElement("ge-reading-readout", "value-tick");
            }

            const marker = document.getElementById("ge-ph-marker");
            if (marker) {
                marker.style.left = `calc(${Math.max(0, Math.min(100, (reading / exp.scaleMax) * 100))}% - 1px)`;
                marker.style.backgroundColor = color;
                marker.style.boxShadow = `0 0 7px ${color}`;
            }

            const viragemStatus = document.getElementById("ge-viragem-status");
            if (viragemStatus) {
                viragemStatus.className = geState.viragemPoint ? "text-xs text-green-400 mb-2" : "text-xs text-yellow-400 mb-2";
                viragemStatus.textContent = geState.viragemPoint
                    ? `✓ ${exp.turningPointLabel[0].toUpperCase()}${exp.turningPointLabel.slice(1)} marcado(a) em ${geState.viragemPoint.vol.toFixed(2)} mL (leitura: ${geState.viragemPoint.reading.toFixed(exp.readingDecimals)}${exp.readingUnit}).`
                    : `Adicione ${exp.titrantNoun} aos poucos e ${exp.instructionObserve}. Quando perceber a mudança, clique em "MARCAR ${exp.turningPointLabel.toUpperCase()} AGORA".`;
            }

            const viragemBtn = document.getElementById("ge-btn-viragem");
            if (viragemBtn) viragemBtn.classList.toggle("opacity-50", !!geState.viragemPoint);

            const count = document.getElementById("ge-count");
            if (count) count.textContent = geState.dataLog.length;

            const tbody = document.getElementById("ge-table-body");
            if (tbody) {
                tbody.innerHTML = geState.dataLog.length
                    ? geState.dataLog.map((d, i) => {
                        const isNewest = i === geState.dataLog.length - 1;
                        return `<tr class="${isNewest ? 'ge-row-new' : ''}"><td class="px-1">${i + 1}</td><td class="px-1">${d.vol.toFixed(2)}</td><td class="px-1">${d.reading.toFixed(exp.readingDecimals)}</td></tr>`;
                    }).join('')
                    : '<tr><td class="px-1 opacity-50" colspan="3">Nenhum ponto registrado ainda.</td></tr>';
            }

            geUpdateChart();
            geSaveAutosave();
        }

        function geUpdateChart() {
            if (!geChart) return;
            const exp = geExp();
            const points = geState.dataLog.map(d => ({ x: d.vol, y: d.reading }));
            const markers = [];
            if (geState.viragemPoint) {
                markers.push({ x: geState.viragemPoint.vol, color: "#FF4444", label: `${exp.turningPointLabel} observado` });
            }
            geChart.setData([{ label: `${exp.readingLabel} observado`, points }], markers);
        }

        /* ---------- Ações do aluno na bancada ---------- */

        // Cria um pequeno elemento "gota" que cai visualmente da bureta até o
        // frasco (puramente decorativo) e se autodestrói ao fim da animação CSS.
        function geSpawnDrop() {
            const zone = document.getElementById("ge-drop-zone");
            if (!zone) return;
            const drop = document.createElement("div");
            drop.className = "ge-drop";
            zone.appendChild(drop);
            setTimeout(() => drop.remove(), 600);
        }

        function geAddVolume(mL) {
            geState.volHistory = geState.volHistory || [];
            geState.volHistory.push(geState.volAdded);
            geState.volAdded = Math.min(geState.vMax, geState.volAdded + mL);
            geUpdateBenchDisplay();
            geSpawnDrop();
            pulseElement("ge-flask-svg", "ge-flask-hit");
            playBeep(500, 0.015);
        }

        function geUndoVolume() {
            // Pilha real de adições: cada clique em "desfazer" volta exatamente
            // uma adição, não apenas para o último ponto registrado na tabela.
            if (geState.volHistory && geState.volHistory.length) {
                geState.volAdded = geState.volHistory.pop();
            } else {
                geState.volAdded = 0;
            }
            geUpdateBenchDisplay();
            playBeep(450, 0.02);
        }

        function geRegisterPoint() {
            const reading = geCurrentReading();
            geState.dataLog.push({ vol: geState.volAdded, reading, id: geState.nextId++ });
            geUpdateBenchDisplay();
            playBeep(650, 0.02);
        }

        function geMarkViragem() {
            geState.viragemPoint = { vol: geState.volAdded, reading: geCurrentReading() };
            geUpdateBenchDisplay();
            pulseElement("ge-drop-zone", "ge-viragem-hit");
            playBeep(900, 0.05);
        }

        function geFinish() {
            geState.step = 2;
            geClearAutosave();
            geRenderReport();
            playBeep(800, 0.04);
            pulseElement("ge-content", "screen-fade-in");
        }

        /* ---------- Relatório final ---------- */

        function geRenderReport() {
            const c = geContainer();
            if (!c) return;
            const exp = geExp();
            const now = new Date().toLocaleString('pt-BR');
            const turningLabelUpper = exp.turningPointLabel[0].toUpperCase() + exp.turningPointLabel.slice(1);

            let comparisonHTML = `<div class="text-yellow-400 text-xs">Nenhum ${exp.turningPointLabel} foi marcado — o relatório mostra apenas o valor teórico.</div>`;
            if (geState.viragemPoint) {
                const erroAbs = Math.abs(geState.viragemPoint.vol - geState.equivVol);
                const erroPct = (erroAbs / geState.equivVol) * 100;
                const zoneNote = exp.needsSolubilityParams
                    ? `A olho nu, a turvação só é percebida quando a fração precipitada ultrapassa uma janela de detecção (aqui, ${GE_TURBIDITY_ZONE.low}%–${GE_TURBIDITY_ZONE.high}% de opacidade) — por isso o ponto observado tende a vir um pouco depois do início teórico da precipitação.`
                    : `Esse erro existe porque o indicador muda de cor numa faixa de pH que não coincide exatamente com o pH de equivalência — por isso a escolha do indicador certo para cada titulação importa.`;
                comparisonHTML = `
                    <table class="w-full text-xs">
                        <tr><td class="pr-3 opacity-70">Valor teórico (calculado):</td><td><strong>${geState.equivVol.toFixed(2)} mL</strong> (${exp.theoreticalNote()})</td></tr>
                        <tr><td class="pr-3 opacity-70">${turningLabelUpper} observado:</td><td><strong>${geState.viragemPoint.vol.toFixed(2)} mL</strong> (leitura ≈ ${geState.viragemPoint.reading.toFixed(exp.readingDecimals)}${exp.readingUnit})</td></tr>
                        <tr><td class="pr-3 opacity-70">Erro experimental:</td><td><strong>${erroAbs.toFixed(2)} mL (${erroPct.toFixed(1)}%)</strong></td></tr>
                    </table>
                    <div class="text-[10px] opacity-60 mt-1">${zoneNote}</div>
                `;
            }

            const paramsLine2 = exp.needsKa ? ` · Ka = ${geState.ka.toExponential(2)}`
                : exp.needsKb ? ` · Kb = ${geState.kb.toExponential(2)}`
                    : exp.needsSolubilityParams ? ` · Kps = ${geState.ksp.toExponential(2)} (p=${geState.p}, q=${geState.q})`
                        : '';
            const paramsLine3 = !exp.needsSolubilityParams
                ? `<div>[Titulante] = ${geState.cb} mol/L · Indicador: ${GE_INDICATORS[geState.indicatorKey].label}</div>`
                : `<div>[Titulante] = ${geState.cb} mol/L · Íon comum fornecido: ${geState.commonTarget === "cation" ? "cátion" : "ânion"}</div>`;

            c.innerHTML = `
                <div id="ge-report-print">
                    <div class="ge-fade-item text-sm font-bold mb-1">RELATÓRIO DE EXPERIMENTO — ${exp.title.toUpperCase()}</div>
                    <div class="ge-fade-item text-[10px] opacity-60 mb-3">Gerado em: ${now} · CHEM.OS Laboratório Virtual — Módulo 23</div>

                    <div class="ge-fade-item dos-border p-2 text-xs mb-2">
                        <div class="font-bold mb-1 opacity-80">PARÂMETROS</div>
                        <div>${exp.caLabel.split('(')[0].trim()} = ${geState.ca} mol/L · ${exp.vaLabel.split('(')[0].trim()} = ${geState.va} mL${paramsLine2}</div>
                        ${paramsLine3}
                    </div>

                    <div class="ge-fade-item dos-border p-2 text-xs mb-2">
                        <div class="font-bold mb-1 opacity-80">RESULTADO: ${exp.turningPointLabel.toUpperCase()} OBSERVADO × VALOR TEÓRICO</div>
                        ${comparisonHTML}
                    </div>

                    <div class="ge-fade-item dos-border p-2 mb-2">
                        <div class="font-bold text-xs mb-1 opacity-80">CURVA DO EXPERIMENTO (pontos registrados pelo aluno)</div>
                        <canvas id="ge-report-chart" class="w-full" height="200"></canvas>
                    </div>

                    <div class="ge-fade-item dos-border p-2 text-xs mb-2">
                        <div class="font-bold mb-1 opacity-80">TABELA DE DADOS</div>
                        <table class="w-full">
                            <thead><tr class="opacity-70"><th class="text-left px-1">#</th><th class="text-left px-1">Volume (mL)</th><th class="text-left px-1">${exp.readingLabel}${exp.readingUnit ? ' (' + exp.readingUnit.trim() + ')' : ''}</th></tr></thead>
                            <tbody>${geState.dataLog.map((d, i) => `<tr><td class="px-1">${i + 1}</td><td class="px-1">${d.vol.toFixed(2)}</td><td class="px-1">${d.reading.toFixed(exp.readingDecimals)}</td></tr>`).join('') || '<tr><td colspan="3" class="opacity-50 px-1">Nenhum dado registrado.</td></tr>'}</tbody>
                        </table>
                    </div>

                    <div class="ge-fade-item dos-border p-2 text-xs">
                        <div class="font-bold mb-1 opacity-80">OBSERVAÇÕES E CONCLUSÃO DO ALUNO</div>
                        <textarea id="ge-conclusion" rows="4" class="dos-input w-full p-1" placeholder="Descreva o que você observou durante o experimento e sua conclusão..."></textarea>
                    </div>
                </div>

                <div class="ge-fade-item flex gap-2 mt-3 flex-wrap">
                    <button onclick="gePrint()" class="dos-btn">[PRN] IMPRIMIR</button>
                    <button onclick="geExportPDF()" class="dos-btn">⬇ EXPORTAR PDF</button>
                    <button onclick="geInit()" class="dos-btn">[NOVO] EXPERIMENTO</button>
                </div>
            `;

            // Gráfico estático (usa o mesmo motor) só para o relatório/impressão.
            const reportCanvas = document.getElementById("ge-report-chart");
            if (reportCanvas) {
                const reportChart = createInteractiveChart("ge-report-chart", { xLabel: "Volume de titulante (mL)", yLabel: exp.readingLabel, yClampMin: exp.scaleMin, yClampMax: exp.scaleMax });
                const points = geState.dataLog.map(d => ({ x: d.vol, y: d.reading }));
                const markers = geState.viragemPoint ? [{ x: geState.viragemPoint.vol, color: "#FF4444", label: `${exp.turningPointLabel} observado` }] : [];
                reportChart.setData([{ label: `${exp.readingLabel} observado`, points }], markers);
            }
        }

        function gePrint() {
            window.print();
        }

        // Exportação em PDF real (via jsPDF, carregado no index.html), sem depender
        // do diálogo de impressão do navegador. Reaproveita os mesmos dados do
        // relatório em tela; o gráfico é embutido como imagem a partir do canvas.
        function geExportPDF() {
            if (!window.jspdf || !window.jspdf.jsPDF) {
                geShowSetupError && geShowSetupError("Biblioteca de PDF não carregou (sem internet?). Use IMPRIMIR como alternativa.");
                return;
            }
            const exp = geExp();
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ unit: "mm", format: "a4" });
            const marginX = 16;
            let y = 18;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("RELATÓRIO DE EXPERIMENTO — CHEM.OS LABORATÓRIO VIRTUAL", marginX, y);
            y += 6;
            doc.setFontSize(11);
            doc.text(exp.title, marginX, y);
            y += 5;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')} · Módulo 23`, marginX, y);
            y += 8;

            doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text("Parâmetros", marginX, y); y += 5;
            doc.setFont("helvetica", "normal"); doc.setFontSize(10);
            const kaPart = exp.needsKa ? `    Ka = ${geState.ka.toExponential(2)}` : '';
            const kbPart = exp.needsKb ? `    Kb = ${geState.kb.toExponential(2)}` : '';
            const kspPart = exp.needsSolubilityParams ? `    Kps = ${geState.ksp.toExponential(2)} (p=${geState.p}, q=${geState.q})` : '';
            doc.text(`${exp.caLabel.split('(')[0].trim()} = ${geState.ca} mol/L    ${exp.vaLabel.split('(')[0].trim()} = ${geState.va} mL${kaPart}${kbPart}${kspPart}`, marginX, y); y += 5;
            doc.text(`[Titulante] = ${geState.cb} mol/L` + (!exp.needsSolubilityParams ? `    Indicador: ${GE_INDICATORS[geState.indicatorKey].label}` : `    Íon comum: ${geState.commonTarget === "cation" ? "cátion" : "ânion"}`), marginX, y); y += 8;

            doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(`${exp.turningPointLabel[0].toUpperCase()}${exp.turningPointLabel.slice(1)} observado × valor teórico`, marginX, y); y += 5;
            doc.setFont("helvetica", "normal"); doc.setFontSize(10);
            doc.text(`Valor teórico: ${geState.equivVol.toFixed(2)} mL (${exp.theoreticalNote()})`, marginX, y); y += 5;
            if (geState.viragemPoint) {
                const erroAbs = Math.abs(geState.viragemPoint.vol - geState.equivVol);
                const erroPct = (erroAbs / geState.equivVol) * 100;
                doc.text(`Observado: ${geState.viragemPoint.vol.toFixed(2)} mL (leitura ~ ${geState.viragemPoint.reading.toFixed(exp.readingDecimals)}${exp.readingUnit})`, marginX, y); y += 5;
                doc.text(`Erro experimental: ${erroAbs.toFixed(2)} mL (${erroPct.toFixed(1)}%)`, marginX, y); y += 5;
            } else {
                doc.text(`Nenhum ${exp.turningPointLabel} foi marcado pelo aluno.`, marginX, y); y += 5;
            }
            y += 4;

            const reportCanvas = document.getElementById("ge-report-chart");
            if (reportCanvas) {
                try {
                    const imgData = reportCanvas.toDataURL("image/png");
                    const pageWidth = doc.internal.pageSize.getWidth();
                    const imgWidth = pageWidth - marginX * 2;
                    const imgHeight = imgWidth * (reportCanvas.height / reportCanvas.width);
                    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text("Curva do experimento", marginX, y); y += 4;
                    doc.addImage(imgData, "PNG", marginX, y, imgWidth, imgHeight);
                    y += imgHeight + 8;
                } catch (e) { /* canvas pode falhar por CORS em ambientes atípicos — segue sem o gráfico */ }
            }

            if (y > 250) { doc.addPage(); y = 18; }
            doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text("Tabela de dados", marginX, y); y += 5;
            doc.setFont("helvetica", "normal"); doc.setFontSize(9);
            geState.dataLog.forEach((d, i) => {
                if (y > 280) { doc.addPage(); y = 18; }
                doc.text(`${i + 1}.  Volume = ${d.vol.toFixed(2)} mL   ${exp.readingLabel} = ${d.reading.toFixed(exp.readingDecimals)}${exp.readingUnit}`, marginX, y);
                y += 4.5;
            });
            y += 4;

            if (y > 250) { doc.addPage(); y = 18; }
            const conclusionEl = document.getElementById("ge-conclusion");
            const conclusion = (conclusionEl && conclusionEl.value.trim()) || "(sem observações registradas)";
            doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text("Observações e conclusão do aluno", marginX, y); y += 5;
            doc.setFont("helvetica", "normal"); doc.setFontSize(10);
            const wrapped = doc.splitTextToSize(conclusion, doc.internal.pageSize.getWidth() - marginX * 2);
            doc.text(wrapped, marginX, y);

            doc.save(`chemos-relatorio-${geState.type}-${Date.now()}.pdf`);
            playBeep(800, 0.03);
        }

        /* ---------- Proteção contra perda acidental de progresso ---------- */

        // Verdadeiro apenas enquanto a bancada do experimento está de fato na
        // tela E o aluno já fez algo que valha a pena não perder (adicionou
        // titulante ou registrou pontos). O relatório final (step 2) não conta
        // como "em risco" — nesse ponto o experimento já está concluído.
        function geHasUnsavedProgress() {
            return !!(
                geState &&
                geState.step === 1 &&
                document.getElementById("ge-content") &&
                (geState.volAdded > 0 || geState.dataLog.length > 0)
            );
        }

        // Executa `proceedFn` imediatamente, a menos que haja progresso não salvo
        // no laboratório guiado — nesse caso, confirma antes via modal. Como o
        // estado já fica salvo automaticamente (geSaveAutosave), o aviso aqui é
        // apenas para evitar sair sem querer no meio de um raciocínio — não é
        // mais sobre perder dados de verdade, já que dá pra retomar depois.
        function geGuardNavigation(proceedFn) {
            if (!geHasUnsavedProgress()) { proceedFn(); return; }
            openModal("SAIR DO EXPERIMENTO?", `
                <div class="text-sm mb-3">Você tem um experimento em andamento na bancada (${geState.dataLog.length} ponto(s) registrado(s)). Ele fica salvo automaticamente — da próxima vez que abrir o Módulo 23, será possível continuar de onde parou. Mas o relatório final desta sessão só é gerado se você finalizar agora.</div>
                <div class="flex gap-2 justify-end">
                    <button onclick="closeModal()" class="dos-btn">CANCELAR</button>
                    <button id="ge-confirm-leave-btn" class="dos-btn">SAIR (fica salvo)</button>
                </div>
            `);
            const btn = document.getElementById("ge-confirm-leave-btn");
            if (btn) btn.onclick = () => { closeModal(); proceedFn(); };
        }
