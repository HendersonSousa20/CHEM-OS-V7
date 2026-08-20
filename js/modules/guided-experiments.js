        /* ==========================================================================
           14. MÓDULO 23 — EXPERIMENTOS GUIADOS (LABORATÓRIO VIRTUAL)
           Primeiro experimento do laboratório: Titulação Ácido Forte + Base Forte,
           com bureta e frasco virtuais, indicador que muda de cor em tempo real,
           curva de pH construída ponto a ponto pelo próprio aluno, e relatório
           final imprimível comparando o "ponto de viragem" observado (indicador)
           contra o ponto de equivalência teórico (calculado).

           Nota de implementação: o "molde" (shell) da bancada é construído UMA
           ÚNICA VEZ (geRenderBenchShell), e cada ação do aluno (adicionar volume,
           registrar ponto etc.) apenas atualiza elementos específicos via id
           (geUpdateBenchDisplay) — nunca recria o <canvas> do gráfico. Isso evita
           recriar o objeto do gráfico interativo a cada clique, o que vazaria
           listeners acumulados em `window` (mouseup) a cada recriação.
           ========================================================================== */

        const GE_INDICATORS = {
            fenolftaleina: { label: "Fenolftaleína", lowPH: 8.2, highPH: 10.0, colorBelow: [245, 240, 230], colorAbove: [216, 27, 130] },
            metilaranjado: { label: "Alaranjado de Metila", lowPH: 3.1, highPH: 4.4, colorBelow: [224, 60, 49], colorAbove: [242, 199, 68] },
            bromotimol: { label: "Azul de Bromotimol", lowPH: 6.0, highPH: 7.6, colorBelow: [242, 199, 68], colorAbove: [46, 134, 222] },
            metilvermelho: { label: "Vermelho de Metila", lowPH: 4.4, highPH: 6.2, colorBelow: [224, 60, 49], colorAbove: [242, 199, 68] }
        };

        let geState = null;
        let geChart = null;

        function geInit() {
            geState = {
                step: 0,
                ca: 0, va: 0, cb: 0, indicatorKey: "fenolftaleina",
                molesAcid: 0, equivVol: 0, vMax: 0,
                volAdded: 0,
                dataLog: [],
                viragemPoint: null,
                nextId: 1
            };
            geChart = null;
            geRenderSetup();
        }

        function geLerp(a, b, t) { return a + (b - a) * t; }

        function geColorForPH(indicatorKey, pH) {
            const ind = GE_INDICATORS[indicatorKey];
            let t = (pH - ind.lowPH) / (ind.highPH - ind.lowPH);
            t = Math.max(0, Math.min(1, t));
            const c = [0, 1, 2].map(i => Math.round(geLerp(ind.colorBelow[i], ind.colorAbove[i], t)));
            return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
        }

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

        function geContainer() {
            return document.getElementById("ge-content");
        }

        function geRenderSetup() {
            const c = geContainer();
            if (!c) return;
            const indicatorOptions = Object.keys(GE_INDICATORS)
                .map(k => `<option value="${k}">${GE_INDICATORS[k].label} (viragem: pH ${GE_INDICATORS[k].lowPH}–${GE_INDICATORS[k].highPH})</option>`)
                .join('');

            c.innerHTML = `
                <div class="text-sm font-bold mb-2 opacity-90">EXPERIMENTO 1: TITULAÇÃO ÁCIDO FORTE + BASE FORTE</div>
                <p class="text-xs mb-3 opacity-80">Configure a bancada abaixo. Depois, você mesmo vai adicionar a base gota a gota (virtualmente) e decidir, observando a cor do indicador, qual é o ponto de viragem — exatamente como numa titulação real de bancada.</p>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                        <label class="block opacity-80 mb-1">[Ácido] (mol/L)</label>
                        <input id="ge-ca" type="number" step="any" value="0.1" class="dos-input p-1 w-full">
                    </div>
                    <div>
                        <label class="block opacity-80 mb-1">Volume do ácido (mL)</label>
                        <input id="ge-va" type="number" step="any" value="25" class="dos-input p-1 w-full">
                    </div>
                    <div>
                        <label class="block opacity-80 mb-1">[Base titulante] (mol/L)</label>
                        <input id="ge-cb" type="number" step="any" value="0.1" class="dos-input p-1 w-full">
                    </div>
                    <div>
                        <label class="block opacity-80 mb-1">Indicador</label>
                        <select id="ge-indicator" class="dos-input p-1 w-full bg-black">${indicatorOptions}</select>
                    </div>
                </div>
                <button onclick="geStartBench()" class="dos-btn mt-3">PREPARAR BANCADA →</button>
                <div class="text-[10px] opacity-50 mt-2">Modelo: ácido forte monoprótico + base forte monoprótica, diluição ideal, 25°C. O volume de equivalência não é revelado antecipadamente — você o descobre pela mudança de cor, como em uma titulação real.</div>
            `;
        }

        function geStartBench() {
            const ca = parseFloat(document.getElementById("ge-ca").value);
            const va = parseFloat(document.getElementById("ge-va").value);
            const cb = parseFloat(document.getElementById("ge-cb").value);
            const indicatorKey = document.getElementById("ge-indicator").value;

            if (!ca || !va || !cb || ca <= 0 || va <= 0 || cb <= 0) {
                alert("Preencha todos os campos com valores positivos.");
                return;
            }

            const molesAcid = ca * (va / 1000);
            const equivVol = (molesAcid / cb) * 1000;

            geState.ca = ca; geState.va = va; geState.cb = cb;
            geState.indicatorKey = indicatorKey;
            geState.molesAcid = molesAcid;
            geState.equivVol = equivVol;
            geState.vMax = Math.max(equivVol * 2.5, equivVol + 20);
            geState.volAdded = 0;
            geState.dataLog = [];
            geState.viragemPoint = null;
            geState.step = 1;

            geRenderBenchShell();
            playBeep(700, 0.03);
        }

        function geCurrentPH() {
            const molesBase = geState.cb * (geState.volAdded / 1000);
            const totalVolL = (geState.va + geState.volAdded) / 1000;
            return geComputePH(geState.molesAcid, molesBase, totalVolL);
        }

        // Constrói o HTML da bancada UMA VEZ (inclui o <canvas> do gráfico, criado
        // uma única vez aqui). Ações subsequentes usam geUpdateBenchDisplay().
        function geRenderBenchShell() {
            const c = geContainer();
            if (!c) return;
            const ind = GE_INDICATORS[geState.indicatorKey];

            c.innerHTML = `
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-shrink-0 flex flex-col items-center">
                        <div class="text-xs font-bold mb-1 opacity-80">BANCADA VIRTUAL</div>
                        <div class="dos-border p-3 flex flex-col items-center" style="width:180px;">
                            <div id="ge-buret-label" class="text-[10px] opacity-70 mb-1">Bureta: 0,0 / ${geState.vMax.toFixed(0)} mL</div>
                            <div class="dos-border" style="width:24px; height:100px; position:relative; overflow:hidden; background:#111;">
                                <div id="ge-buret-fill" style="position:absolute; bottom:0; left:0; width:100%; background: var(--text-color); opacity:0.5; height:0%;"></div>
                            </div>
                            <div class="text-[10px] opacity-70 mt-3 mb-1">Erlenmeyer (indicador: ${ind.label})</div>
                            <svg width="90" height="90" viewBox="0 0 90 90">
                                <path id="ge-flask-fill" d="M 35 10 L 35 35 L 15 80 Q 15 88 25 88 L 65 88 Q 75 88 75 80 L 55 35 L 55 10 Z"
                                      fill="rgb(245,240,230)" stroke="var(--text-color)" stroke-width="2" />
                            </svg>
                        </div>
                        <div class="text-[10px] opacity-60 mt-2 text-center">pHmetro (simulado): <strong id="ge-ph-readout" class="text-sm">7.00</strong></div>
                    </div>

                    <div class="flex-grow">
                        <div class="text-xs font-bold mb-1 opacity-80">ADICIONAR BASE (TITULANTE)</div>
                        <div class="flex gap-1 flex-wrap mb-2">
                            <button onclick="geAddVolume(0.1)" class="dos-btn text-xs">+ 0,1 mL</button>
                            <button onclick="geAddVolume(0.5)" class="dos-btn text-xs">+ 0,5 mL</button>
                            <button onclick="geAddVolume(1)" class="dos-btn text-xs">+ 1 mL</button>
                            <button onclick="geAddVolume(5)" class="dos-btn text-xs">+ 5 mL</button>
                            <button onclick="geUndoVolume()" class="dos-btn text-xs">DESFAZER ÚLTIMA ADIÇÃO</button>
                        </div>
                        <div class="flex gap-1 flex-wrap mb-3">
                            <button onclick="geRegisterPoint()" class="dos-btn text-xs">📋 REGISTRAR PONTO NO GRÁFICO</button>
                            <button id="ge-btn-viragem" onclick="geMarkViragem()" class="dos-btn text-xs">🎯 MARCAR PONTO DE VIRAGEM AGORA</button>
                            <button onclick="geFinish()" class="dos-btn text-xs">✔ FINALIZAR E GERAR RELATÓRIO</button>
                        </div>
                        <div id="ge-viragem-status" class="text-xs text-yellow-400 mb-2">Adicione base aos poucos e observe a cor do frasco. Quando ela mudar visivelmente, clique em "MARCAR PONTO DE VIRAGEM AGORA".</div>

                        <canvas id="ge-chart-canvas" class="dos-border w-full" height="220"></canvas>

                        <div class="text-xs font-bold mt-3 mb-1 opacity-80">TABELA DE DADOS (<span id="ge-count">0</span> pontos registrados)</div>
                        <div class="dos-border p-1 max-h-32 overflow-y-auto text-[11px]">
                            <table class="w-full">
                                <thead><tr class="opacity-70"><th class="text-left px-1">#</th><th class="text-left px-1">Volume (mL)</th><th class="text-left px-1">pH</th></tr></thead>
                                <tbody id="ge-table-body"><tr><td class="px-1 opacity-50" colspan="3">Nenhum ponto registrado ainda.</td></tr></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

            geChart = createInteractiveChart("ge-chart-canvas", { xLabel: "Volume de base (mL)", yLabel: "pH", yClampMin: 0, yClampMax: 14 });
            geUpdateBenchDisplay();
        }

        // Atualiza SOMENTE os elementos que mudam a cada ação — não toca no <canvas>,
        // preservando o objeto do gráfico (evita recriar listeners a cada clique).
        function geUpdateBenchDisplay() {
            const ph = geCurrentPH();
            const color = geColorForPH(geState.indicatorKey, ph);

            const buretLabel = document.getElementById("ge-buret-label");
            if (buretLabel) buretLabel.textContent = `Bureta: ${geState.volAdded.toFixed(1)} / ${geState.vMax.toFixed(0)} mL`;

            const buretFill = document.getElementById("ge-buret-fill");
            if (buretFill) buretFill.style.height = `${Math.min(100, (geState.volAdded / geState.vMax) * 100)}%`;

            const flask = document.getElementById("ge-flask-fill");
            if (flask) flask.setAttribute("fill", color);

            const phReadout = document.getElementById("ge-ph-readout");
            if (phReadout) phReadout.textContent = ph.toFixed(2);

            const viragemStatus = document.getElementById("ge-viragem-status");
            if (viragemStatus) {
                viragemStatus.className = geState.viragemPoint ? "text-xs text-green-400 mb-2" : "text-xs text-yellow-400 mb-2";
                viragemStatus.textContent = geState.viragemPoint
                    ? `✓ Viragem marcada em ${geState.viragemPoint.vol.toFixed(2)} mL (pH ${geState.viragemPoint.ph.toFixed(2)}).`
                    : 'Adicione base aos poucos e observe a cor do frasco. Quando ela mudar visivelmente, clique em "MARCAR PONTO DE VIRAGEM AGORA".';
            }

            const viragemBtn = document.getElementById("ge-btn-viragem");
            if (viragemBtn) viragemBtn.classList.toggle("opacity-50", !!geState.viragemPoint);

            const count = document.getElementById("ge-count");
            if (count) count.textContent = geState.dataLog.length;

            const tbody = document.getElementById("ge-table-body");
            if (tbody) {
                tbody.innerHTML = geState.dataLog.length
                    ? geState.dataLog.map((d, i) => `<tr><td class="px-1">${i + 1}</td><td class="px-1">${d.vol.toFixed(2)}</td><td class="px-1">${d.ph.toFixed(2)}</td></tr>`).join('')
                    : '<tr><td class="px-1 opacity-50" colspan="3">Nenhum ponto registrado ainda.</td></tr>';
            }

            geUpdateChart();
        }

        function geUpdateChart() {
            if (!geChart) return;
            const points = geState.dataLog.map(d => ({ x: d.vol, y: d.ph }));
            const markers = [];
            if (geState.viragemPoint) {
                markers.push({ x: geState.viragemPoint.vol, color: "#FF4444", label: "viragem observada" });
            }
            geChart.setData([{ label: "pH observado", points }], markers);
        }

        function geAddVolume(mL) {
            geState.volAdded = Math.min(geState.vMax, geState.volAdded + mL);
            geUpdateBenchDisplay();
            playBeep(500, 0.015);
        }

        function geUndoVolume() {
            // Sem histórico detalhado de cada micro-adição: apenas volta ao último
            // valor registrado, permitindo corrigir rapidamente um erro do usuário.
            geState.volAdded = geState.dataLog.length ? geState.dataLog[geState.dataLog.length - 1].vol : 0;
            geUpdateBenchDisplay();
        }

        function geRegisterPoint() {
            const ph = geCurrentPH();
            geState.dataLog.push({ vol: geState.volAdded, ph, id: geState.nextId++ });
            geUpdateBenchDisplay();
            playBeep(650, 0.02);
        }

        function geMarkViragem() {
            geState.viragemPoint = { vol: geState.volAdded, ph: geCurrentPH() };
            geUpdateBenchDisplay();
            playBeep(900, 0.05);
        }

        function geFinish() {
            geState.step = 2;
            geRenderReport();
            playBeep(800, 0.04);
        }

        function geRenderReport() {
            const c = geContainer();
            if (!c) return;
            const ind = GE_INDICATORS[geState.indicatorKey];
            const now = new Date().toLocaleString('pt-BR');

            let comparisonHTML = `<div class="text-yellow-400 text-xs">Nenhum ponto de viragem foi marcado — o relatório mostra apenas o ponto de equivalência teórico.</div>`;
            if (geState.viragemPoint) {
                const erroAbs = Math.abs(geState.viragemPoint.vol - geState.equivVol);
                const erroPct = (erroAbs / geState.equivVol) * 100;
                comparisonHTML = `
                    <table class="w-full text-xs">
                        <tr><td class="pr-3 opacity-70">Ponto de equivalência (teórico, calculado):</td><td><strong>${geState.equivVol.toFixed(2)} mL</strong> (pH = 7,00)</td></tr>
                        <tr><td class="pr-3 opacity-70">Ponto de viragem (observado, indicador):</td><td><strong>${geState.viragemPoint.vol.toFixed(2)} mL</strong> (pH ≈ ${geState.viragemPoint.ph.toFixed(2)})</td></tr>
                        <tr><td class="pr-3 opacity-70">Erro experimental:</td><td><strong>${erroAbs.toFixed(2)} mL (${erroPct.toFixed(1)}%)</strong></td></tr>
                    </table>
                    <div class="text-[10px] opacity-60 mt-1">Esse erro existe porque o indicador muda de cor numa faixa de pH (${ind.lowPH}–${ind.highPH}) que não coincide exatamente com pH = 7 — por isso a escolha do indicador certo para cada titulação importa.</div>
                `;
            }

            c.innerHTML = `
                <div id="ge-report-print">
                    <div class="text-sm font-bold mb-1">RELATÓRIO DE EXPERIMENTO — TITULAÇÃO ÁCIDO FORTE + BASE FORTE</div>
                    <div class="text-[10px] opacity-60 mb-3">Gerado em: ${now} · CHEM.OS Laboratório Virtual — Módulo 23</div>

                    <div class="dos-border p-2 text-xs mb-2">
                        <div class="font-bold mb-1 opacity-80">PARÂMETROS</div>
                        <div>[Ácido] = ${geState.ca} mol/L · Volume de ácido = ${geState.va} mL</div>
                        <div>[Base titulante] = ${geState.cb} mol/L · Indicador: ${ind.label}</div>
                    </div>

                    <div class="dos-border p-2 text-xs mb-2">
                        <div class="font-bold mb-1 opacity-80">RESULTADO: VIRAGEM OBSERVADA × EQUIVALÊNCIA TEÓRICA</div>
                        ${comparisonHTML}
                    </div>

                    <div class="dos-border p-2 mb-2">
                        <div class="font-bold text-xs mb-1 opacity-80">CURVA DE TITULAÇÃO (pontos registrados pelo aluno)</div>
                        <canvas id="ge-report-chart" class="w-full" height="200"></canvas>
                    </div>

                    <div class="dos-border p-2 text-xs mb-2">
                        <div class="font-bold mb-1 opacity-80">TABELA DE DADOS</div>
                        <table class="w-full">
                            <thead><tr class="opacity-70"><th class="text-left px-1">#</th><th class="text-left px-1">Volume (mL)</th><th class="text-left px-1">pH</th></tr></thead>
                            <tbody>${geState.dataLog.map((d, i) => `<tr><td class="px-1">${i + 1}</td><td class="px-1">${d.vol.toFixed(2)}</td><td class="px-1">${d.ph.toFixed(2)}</td></tr>`).join('') || '<tr><td colspan="3" class="opacity-50 px-1">Nenhum dado registrado.</td></tr>'}</tbody>
                        </table>
                    </div>

                    <div class="dos-border p-2 text-xs">
                        <div class="font-bold mb-1 opacity-80">OBSERVAÇÕES E CONCLUSÃO DO ALUNO</div>
                        <textarea id="ge-conclusion" rows="4" class="dos-input w-full p-1" placeholder="Descreva o que você observou durante o experimento e sua conclusão..."></textarea>
                    </div>
                </div>

                <div class="flex gap-2 mt-3">
                    <button onclick="gePrint()" class="dos-btn">🖨 IMPRIMIR / SALVAR PDF</button>
                    <button onclick="geInit()" class="dos-btn">↺ NOVO EXPERIMENTO</button>
                </div>
            `;

            // Gráfico estático (usa o mesmo motor) só para o relatório/impressão.
            const reportCanvas = document.getElementById("ge-report-chart");
            if (reportCanvas) {
                const reportChart = createInteractiveChart("ge-report-chart", { xLabel: "Volume de base (mL)", yLabel: "pH", yClampMin: 0, yClampMax: 14 });
                const points = geState.dataLog.map(d => ({ x: d.vol, y: d.ph }));
                const markers = geState.viragemPoint ? [{ x: geState.viragemPoint.vol, color: "#FF4444", label: "viragem observada" }] : [];
                reportChart.setData([{ label: "pH observado", points }], markers);
            }
        }

        function gePrint() {
            window.print();
        }
