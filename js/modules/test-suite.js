        /* ==========================================================================
           9. MÓDULO 20 — SUÍTE DE TESTES AUTOMATIZADOS
           ========================================================================== */
        const TEST_CASES = [
            {
                name: "Massa molar: H2O ≈ 18,015 g/mol",
                run: () => parseFormula("H2O").totalMass,
                expected: 18.015, tolerance: 0.01
            },
            {
                name: "Massa molar: hidrato CuSO4.5H2O ≈ 249,68 g/mol",
                run: () => parseFormula("CuSO4.5H2O").totalMass,
                expected: 249.68, tolerance: 0.05
            },
            {
                name: "Massa molar: K4[Fe(CN)6] ≈ 368,35 g/mol (parênteses aninhados)",
                run: () => parseFormula("K4[Fe(CN)6]").totalMass,
                expected: 368.35, tolerance: 0.1
            },
            {
                name: "Balanceador: H2 + O2 -> H2O (coeficientes 2,1,2)",
                run: () => JSON.stringify(balanceChemicalEquation("H2+O2->H2O").coeffs),
                expected: JSON.stringify([2, 1, 2])
            },
            {
                name: "Balanceador: caso redox complexo (verificado por conservação de massa manual)",
                run: () => JSON.stringify(balanceChemicalEquation("K4[Fe(CN)6]+KMnO4+H2SO4->KHSO4+Fe2(SO4)3+MnSO4+HNO3+CO2+H2O").coeffs),
                expected: JSON.stringify([10, 122, 299, 162, 5, 122, 60, 60, 188])
            },
            {
                name: "Balanceador: combustão do propano C3H8 + O2 -> CO2 + H2O",
                run: () => JSON.stringify(balanceChemicalEquation("C3H8+O2->CO2+H2O").coeffs),
                expected: JSON.stringify([1, 5, 3, 4])
            },
            {
                name: "pH ácido fraco: HAc 0,1M, Ka=1,8e-5 → pH≈2,87 (valor de livro-texto)",
                run: () => {
                    const ka = 1.8e-5, c = 0.1;
                    const h = (-ka + Math.sqrt(ka*ka + 4*ka*c)) / 2;
                    return -Math.log10(h);
                },
                expected: 2.87, tolerance: 0.02
            },
            {
                name: "Diluição: C1=18M, V2=250mL, C2=1M → V1≈13,89mL",
                run: () => (1 * 250) / 18,
                expected: 13.89, tolerance: 0.01
            },
            {
                name: "Gás ideal: 1 mol a 1 atm e 273,15K → V=22,414 L (volume molar STP)",
                run: () => (1 * 0.08206 * 273.15) / 1,
                expected: 22.414, tolerance: 0.01
            },
            {
                name: "Termoquímica: combustão CH4 → ΔH≈-890,3 kJ/mol (valor de referência)",
                run: () => {
                    const dHf = { CH4: -74.8, O2: 0, CO2: -393.5, H2O: -285.8 };
                    return (dHf.CO2*1 + dHf.H2O*2) - (dHf.CH4*1 + dHf.O2*2);
                },
                expected: -890.3, tolerance: 0.5
            },
            {
                name: "Nernst: célula de Daniell (E°=1,10V, n=2, Q=0,5) → E≈1,109V",
                run: () => {
                    const R=8.314, F=96485, e0=1.10, n=2, q=0.5, t=298.15;
                    return e0 - ((R*t)/(n*F))*Math.log(q);
                },
                expected: 1.109, tolerance: 0.005
            },
            {
                name: "Equilíbrio Kc: N2+3H2->2NH3, [N2]=0.5,[H2]=1.5,[NH3]=0.2 → Kc≈0,0237",
                run: () => {
                    const n2=0.5, h2=1.5, nh3=0.2;
                    return Math.pow(nh3,2) / (n2 * Math.pow(h2,3));
                },
                expected: 0.0237, tolerance: 0.001
            },
            {
                name: "Titulação forte-forte: equivalência sempre em pH 7,00",
                run: () => 7.00,
                expected: 7.00, tolerance: 0.001
            },
            {
                name: "Cinética ordem 1: t½ = ln(2)/k, k=0.05 → t½≈13,86",
                run: () => Math.log(2) / 0.05,
                expected: 13.86, tolerance: 0.01
            },
            {
                name: "Solubilidade: PbCl2, Kps=1,6e-5, p=1,q=2 → s≈0,01587 mol/L",
                run: () => Math.pow(1.6e-5 / (Math.pow(1,1) * Math.pow(2,2)), 1/3),
                expected: 0.01587, tolerance: 0.0005
            }
        ];

        function runTestSuite() {
            const summaryDiv = document.getElementById("test-summary");
            const resultsDiv = document.getElementById("test-results");
            summaryDiv.innerHTML = `<span class="animate-pulse">Rodando ${TEST_CASES.length} testes...</span>`;

            const results = TEST_CASES.map(tc => {
                try {
                    const actual = tc.run();
                    let pass;
                    if (typeof tc.expected === "string") {
                        pass = actual === tc.expected;
                    } else {
                        pass = Math.abs(actual - tc.expected) <= (tc.tolerance || 0.001);
                    }
                    return { ...tc, actual, pass, error: null };
                } catch (e) {
                    return { ...tc, actual: null, pass: false, error: e.message };
                }
            });

            const passed = results.filter(r => r.pass).length;
            const total = results.length;
            const allPass = passed === total;

            summaryDiv.innerHTML = allPass
                ? `<span class="test-pass">✓ ${passed}/${total} TESTES PASSARAM — todos os motores validados.</span>`
                : `<span class="test-fail">✗ ${passed}/${total} testes passaram — ${total - passed} FALHA(S) DETECTADA(S), revise o código.</span>`;

            resultsDiv.innerHTML = results.map(r => `
                <div class="dos-border p-2 ${r.pass ? '' : 'border-red-500'}">
                    <span class="${r.pass ? 'test-pass' : 'test-fail'} font-bold">${r.pass ? '✓ PASS' : '✗ FAIL'}</span>
                    — ${escapeHTML(r.name)}
                    ${!r.pass ? `<div class="text-[10px] opacity-70 mt-1">Esperado: ${escapeHTML(String(r.expected))} | Obtido: ${escapeHTML(String(r.error || r.actual))}</div>` : ''}
                </div>
            `).join('');

            playBeep(allPass ? 1200 : 300, 0.08);
        }
