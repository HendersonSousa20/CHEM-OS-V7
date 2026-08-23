        /* ==========================================================================
           8. EXECUÇÃO — MÓDULOS CIENTÍFICOS AVANÇADOS
           ========================================================================== */
        function runStoichiometry() {
            const eqStr = document.getElementById("stoich-eq").value;
            const massesRaw = document.getElementById("stoich-masses").value;
            const actualYield = parseFloat(document.getElementById("stoich-actual").value) || null;
            const resDiv = document.getElementById("stoich-result");

            try {
                const eq = eqStr.replace(/\s+/g, '');
                const sides = eq.split(/->|=|➔/);
                if (sides.length !== 2) throw new Error("Equação deve conter '->' ou '='.");

                const leftComps = sides[0].split('+').filter(Boolean);
                const rightComps = sides[1].split('+').filter(Boolean);

                function splitCoeff(comp) {
                    const m = comp.match(/^(\d*)(.+)$/);
                    return { coeff: m[1] ? parseInt(m[1]) : 1, formula: m[2] };
                }

                const reactants = leftComps.map(splitCoeff);
                const products = rightComps.map(splitCoeff);
                const masses = massesRaw.split(',').map(s => parseFloat(s.trim()));

                if (masses.length !== reactants.length) {
                    throw new Error(`Forneça ${reactants.length} massa(s), uma para cada reagente.`);
                }

                let moles = reactants.map((r, i) => {
                    const mm = parseFormula(r.formula).totalMass;
                    if (!mm) throw new Error(`Fórmula inválida: ${r.formula}`);
                    return { ...r, mm, mass: masses[i], mols: masses[i] / mm };
                });

                let limiting = moles.reduce((min, cur) => (cur.mols / cur.coeff) < (min.mols / min.coeff) ? cur : min);
                const extentOfReaction = limiting.mols / limiting.coeff;

                let reactantsHTML = moles.map(r =>
                    `<div>• ${escapeHTML(r.formula)}: ${r.mass} g → ${r.mols.toFixed(4)} mol (MM=${r.mm.toFixed(2)} g/mol)</div>`
                ).join('');

                let productsHTML = products.map((p, idx) => {
                    const mm = parseFormula(p.formula).totalMass;
                    const theoreticalMass = extentOfReaction * p.coeff * mm;
                    let yieldHTML = "";
                    if (actualYield && idx === 0) {
                        const percent = (actualYield / theoreticalMass) * 100;
                        yieldHTML = ` — Rendimento real: ${actualYield} g (<strong>${percent.toFixed(1)}%</strong>)`;
                    }
                    return `<div>• <strong>${escapeHTML(p.formula)}</strong>: ${theoreticalMass.toFixed(3)} g teóricos${yieldHTML}</div>`;
                }).join('');

                resDiv.innerHTML = `
                    <div class="text-xs opacity-80 mb-2">${reactantsHTML}</div>
                    <div class="text-yellow-300 font-bold mb-2 border-t border-current pt-2">REAGENTE LIMITANTE: ${escapeHTML(limiting.formula)}</div>
                    <div class="border-t border-current pt-2">${productsHTML}</div>
                `;
            } catch (e) {
                resDiv.innerHTML = `<div class="text-red-500">Erro: ${escapeHTML(e.message)}</div>`;
            }
        }

        const THERMO_DB = {
            "H2O(l)": { dHf: -285.8, S: 69.9 }, "H2O(g)": { dHf: -241.8, S: 188.8 },
            "CO2(g)": { dHf: -393.5, S: 213.8 }, "CO(g)": { dHf: -110.5, S: 197.7 },
            "O2(g)": { dHf: 0, S: 205.2 }, "H2(g)": { dHf: 0, S: 130.7 }, "N2(g)": { dHf: 0, S: 191.6 },
            "NH3(g)": { dHf: -46.1, S: 192.5 }, "CH4(g)": { dHf: -74.8, S: 186.3 },
            "C2H6(g)": { dHf: -84.7, S: 229.6 }, "C2H4(g)": { dHf: 52.4, S: 219.3 }, "C2H2(g)": { dHf: 226.7, S: 200.9 },
            "NaCl(s)": { dHf: -411.2, S: 72.1 }, "CaCO3(s)": { dHf: -1206.9, S: 92.9 }, "CaO(s)": { dHf: -635.1, S: 38.1 },
            "HCl(g)": { dHf: -92.3, S: 186.9 }, "SO2(g)": { dHf: -296.8, S: 248.2 }, "SO3(g)": { dHf: -395.7, S: 256.8 },
            "NO(g)": { dHf: 90.2, S: 210.8 }, "NO2(g)": { dHf: 33.2, S: 240.1 },
            "C(s)": { dHf: 0, S: 5.7 }, "Fe2O3(s)": { dHf: -824.2, S: 87.4 }, "Fe(s)": { dHf: 0, S: 27.3 },
            "Al2O3(s)": { dHf: -1675.7, S: 50.9 }, "Al(s)": { dHf: 0, S: 28.3 },
            "CH3OH(l)": { dHf: -238.7, S: 126.8 }, "C2H5OH(l)": { dHf: -277.7, S: 160.7 },
            "C6H12O6(s)": { dHf: -1273.3, S: 212.1 }, "NaOH(s)": { dHf: -425.6, S: 64.5 },
            "KCl(s)": { dHf: -436.5, S: 82.6 }, "N2O(g)": { dHf: 82.1, S: 219.9 }, "CH3COOH(l)": { dHf: -484.5, S: 159.8 },
            "CO2(aq)": { dHf: -413.8, S: 117.6 }, "H2O2(l)": { dHf: -187.8, S: 109.6 }
        };

        function runThermochemistry() {
            const eqStr = document.getElementById("thermo-eq").value.replace(/\s+/g, '');
            const T = parseFloat(document.getElementById("thermo-temp").value) || 298.15;
            const resDiv = document.getElementById("thermo-result");

            try {
                const sides = eqStr.split(/->|=|➔/);
                if (sides.length !== 2) throw new Error("Equação deve conter '->' ou '=' e estados físicos, ex: H2O(l).");

                const leftComps = sides[0].split('+').filter(Boolean);
                const rightComps = sides[1].split('+').filter(Boolean);

                function splitCoeff(comp) {
                    const m = comp.match(/^(\d*)(.+)$/);
                    return { coeff: m[1] ? parseInt(m[1]) : 1, key: m[2] };
                }

                const reactants = leftComps.map(splitCoeff);
                const products = rightComps.map(splitCoeff);
                const missing = [...reactants, ...products].filter(c => !THERMO_DB[c.key]);

                if (missing.length > 0) {
                    throw new Error(`Espécie(s) sem dados na base local: ${missing.map(m => m.key).join(', ')}. Inclua o estado físico, ex: CO2(g).`);
                }

                let dH = 0, dS = 0;
                products.forEach(p => { dH += p.coeff * THERMO_DB[p.key].dHf; dS += p.coeff * THERMO_DB[p.key].S; });
                reactants.forEach(r => { dH -= r.coeff * THERMO_DB[r.key].dHf; dS -= r.coeff * THERMO_DB[r.key].S; });

                const dG = dH - (T * dS / 1000);
                const spontaneity = dG < 0 ? "ESPONTÂNEA (favorável)" : "NÃO-ESPONTÂNEA nesta temperatura";

                resDiv.innerHTML = `
                    <div>ΔH° reação = <strong>${dH.toFixed(2)} kJ/mol</strong> (${dH < 0 ? 'exotérmica' : 'endotérmica'})</div>
                    <div>ΔS° reação = <strong>${dS.toFixed(2)} J/(mol·K)</strong></div>
                    <div class="mt-1 pt-1 border-t border-current">ΔG° (${T} K) = <strong>${dG.toFixed(2)} kJ/mol</strong></div>
                    <div class="text-yellow-300 font-bold mt-1">${spontaneity}</div>
                    <div class="text-[10px] opacity-50 mt-2">Valores de ΔHf° e S° a 298,15 K e 1 atm, estado padrão. Fonte: valores tabelados clássicos de físico-química, não consultados em tempo real.</div>
                `;
            } catch (e) {
                resDiv.innerHTML = `<div class="text-red-500">Erro: ${escapeHTML(e.message)}</div>`;
            }
        }

        function runBufferCalc() {
            const pka = parseFloat(document.getElementById("buf-pka").value);
            const base = parseFloat(document.getElementById("buf-base").value);
            const acid = parseFloat(document.getElementById("buf-acid").value);
            const resDiv = document.getElementById("buffer-result");

            if (!pka || !base || !acid || base <= 0 || acid <= 0) {
                resDiv.innerHTML = `<span class="text-red-500">Preencha pKa, [A⁻] e [HA] com valores positivos.</span>`;
                return;
            }

            const pH = pka + Math.log10(base / acid);
            const ratio = base / acid;

            resDiv.innerHTML = `
                <div>pH = pKa + log([A⁻]/[HA]) = ${pka} + log(${ratio.toFixed(3)})</div>
                <div class="text-xl font-bold my-1">pH = ${pH.toFixed(2)}</div>
                <div class="text-xs opacity-70">Razão base/ácido: ${ratio.toFixed(3)} — Capacidade tamponante máxima ocorre quando a razão está entre 0.1 e 10 (pH próximo do pKa).</div>
            `;
        }

        function runCombinedGasLaw() {
            let p1 = parseFloat(document.getElementById("g-p1").value);
            let v1 = parseFloat(document.getElementById("g-v1").value);
            let t1 = parseFloat(document.getElementById("g-t1").value);
            let p2 = parseFloat(document.getElementById("g-p2").value);
            let v2 = parseFloat(document.getElementById("g-v2").value);
            let t2 = parseFloat(document.getElementById("g-t2").value);
            const out = document.getElementById("gas-combined-result");

            const blanks = [isNaN(p1), isNaN(v1), isNaN(t1), isNaN(p2), isNaN(v2), isNaN(t2)].filter(Boolean).length;
            if (blanks !== 1) {
                out.innerHTML = `<span class="text-yellow-400">Deixe exatamente um dos 6 campos vazio.</span>`;
                return;
            }

            if (isNaN(p1)) p1 = (p2 * v2 * t1) / (t2 * v1);
            else if (isNaN(v1)) v1 = (p2 * v2 * t1) / (t2 * p1);
            else if (isNaN(t1)) t1 = (p1 * v1 * t2) / (p2 * v2);
            else if (isNaN(p2)) p2 = (p1 * v1 * t2) / (t1 * v2);
            else if (isNaN(v2)) v2 = (p1 * v1 * t2) / (t1 * p2);
            else if (isNaN(t2)) t2 = (p2 * v2 * t1) / (p1 * v1);

            out.innerHTML = `Resultado: P1=${p1.toFixed(3)} atm, V1=${v1.toFixed(3)} L, T1=${t1.toFixed(2)} K, P2=${p2.toFixed(3)} atm, V2=${v2.toFixed(3)} L, T2=${t2.toFixed(2)} K
                <div class="text-[10px] opacity-50 mt-2">Assume comportamento de gás ideal (desvios reais ocorrem a alta pressão/baixa temperatura).</div>`;
        }

        function runIdealGasLaw() {
            let p = parseFloat(document.getElementById("gi-p").value);
            let v = parseFloat(document.getElementById("gi-v").value);
            let n = parseFloat(document.getElementById("gi-n").value);
            let t = parseFloat(document.getElementById("gi-t").value);
            const R = 0.08206;
            const out = document.getElementById("gas-ideal-result");

            const blanks = [isNaN(p), isNaN(v), isNaN(n), isNaN(t)].filter(Boolean).length;
            if (blanks !== 1) {
                out.innerHTML = `<span class="text-yellow-400">Deixe exatamente um dos 4 campos (P, V, n, T) vazio.</span>`;
                return;
            }

            if (isNaN(p)) { p = (n * R * t) / v; out.innerHTML = `P = <strong>${p.toFixed(4)} atm</strong>`; }
            else if (isNaN(v)) { v = (n * R * t) / p; out.innerHTML = `V = <strong>${v.toFixed(4)} L</strong>`; }
            else if (isNaN(n)) { n = (p * v) / (R * t); out.innerHTML = `n = <strong>${n.toFixed(4)} mol</strong>`; }
            else if (isNaN(t)) { t = (p * v) / (R * n); out.innerHTML = `T = <strong>${t.toFixed(2)} K</strong>`; }

            out.innerHTML += `<div class="text-[10px] opacity-50 mt-2">Assume comportamento de gás ideal. R = 0,08206 atm·L/(mol·K) (CODATA).</div>`;
        }

        function runNernst() {
            const e0 = parseFloat(document.getElementById("ner-e0").value);
            const n = parseFloat(document.getElementById("ner-n").value);
            const q = parseFloat(document.getElementById("ner-q").value);
            const t = parseFloat(document.getElementById("ner-t").value);
            const resDiv = document.getElementById("nernst-result");

            if (!n || n <= 0 || q <= 0) {
                resDiv.innerHTML = `<span class="text-red-500">n deve ser > 0 e Q deve ser positivo.</span>`;
                return;
            }

            const R = 8.314, F = 96485;
            const e = e0 - ((R * t) / (n * F)) * Math.log(q);

            resDiv.innerHTML = `
                <div>E = E° − (RT/nF)·ln(Q)</div>
                <div>E = ${e0} − (${R}×${t}/(${n}×${F}))×ln(${q})</div>
                <div class="text-xl font-bold my-1">E = ${e.toFixed(4)} V</div>
                <div class="text-xs ${e > 0 ? 'text-green-400' : 'text-red-400'}">${e > 0 ? 'Reação espontânea nestas condições (E > 0)' : 'Reação não-espontânea nestas condições (E < 0)'}</div>
                <div class="text-[10px] opacity-50 mt-2">Assume atividades ≈ concentrações (solução ideal). R=8,314 J/(mol·K), F=96485 C/mol (CODATA).</div>
            `;
        }

        async function runNameResolver() {
            const query = document.getElementById("resolver-input").value;
            const resDiv = document.getElementById("resolver-result");
            resDiv.innerHTML = "<span class='animate-pulse'>Consultando OPSIN (com fallback automático) e CACTUS...</span>";

            let html = "";

            try {
                const structure = await resolveNameToStructure(query);
                const sourceLabel = structure.source === "OPSIN"
                    ? "OPSIN (nome IUPAC → estrutura)"
                    : `${structure.source} (nome → estrutura)`;
                html += `<div class="mb-2 pb-2 border-b border-current"><strong class="text-green-400">${sourceLabel}:</strong>`;
                html += `<div>• SMILES: <span class="font-mono text-[11px] break-all">${escapeHTML(structure.smiles || 'N/A')}</span></div>`;
                html += `<div>• InChIKey: ${escapeHTML(structure.inchikey || 'N/A')}</div>`;
                if (structure.source !== "OPSIN") {
                    html += `<div class="text-[10px] text-yellow-400 mt-1">[!] O OPSIN não respondeu agora (serviço fora do ar ou tempo limite excedido) — este resultado veio de ${escapeHTML(structure.source)} como alternativa automática. Para nomenclatura IUPAC muito específica, o resultado do OPSIN costuma ser mais confiável; tente novamente mais tarde se precisar confirmar.</div>`;
                }
                html += `</div>`;
            } catch (e) {
                const detail = (e.attempts || []).map(a => `${a.source}: ${a.message}`).join(' · ');
                html += `<div class="mb-2 pb-2 border-b border-current text-yellow-400">Nenhum serviço de nome → estrutura conseguiu resolver esta entrada agora (tentamos OPSIN, CACTUS e PubChem).${detail ? `<div class="text-[10px] opacity-70 mt-1">${escapeHTML(detail)}</div>` : ''}</div>`;
            }

            let cactusHTML = `<strong class="text-green-400">CACTUS (identificadores complementares):</strong>`;
            let anyCactus = false;
            let anyConnectivityIssue = false;

            try {
                const cas = await fetchCactusData(query, "cas");
                cactusHTML += `<div>• CAS Number: ${escapeHTML(cas.split('\n')[0])}</div>`;
                anyCactus = true;
            } catch (e) { if (e.isTimeout || e.isNetworkError) anyConnectivityIssue = true; }

            try {
                const iupac = await fetchCactusData(query, "iupac_name");
                cactusHTML += `<div>• Nome IUPAC (CACTUS): ${escapeHTML(iupac.split('\n')[0])}</div>`;
                anyCactus = true;
            } catch (e) { if (e.isTimeout || e.isNetworkError) anyConnectivityIssue = true; }

            try {
                const formula = await fetchCactusData(query, "formula");
                cactusHTML += `<div>• Fórmula Molecular: ${escapeHTML(formula.split('\n')[0])}</div>`;
                anyCactus = true;
            } catch (e) { if (e.isTimeout || e.isNetworkError) anyConnectivityIssue = true; }

            if (!anyCactus && anyConnectivityIssue) {
                cactusHTML += `<div class="text-red-400 text-xs">Não foi possível conectar ao CACTUS (tempo limite excedido ou sem conexão). Tente novamente em instantes.</div>`;
            } else if (!anyCactus) {
                cactusHTML += `<div class="text-yellow-400 text-xs">Nenhum identificador CACTUS localizado para esta entrada.</div>`;
            }

            html += `<div>${cactusHTML}</div>`;
            resDiv.innerHTML = html;
        }

        function runKinetics() {
            const order = parseInt(document.getElementById("kin-order").value);
            const k = parseFloat(document.getElementById("kin-k").value);
            const a0 = parseFloat(document.getElementById("kin-a0").value);
            const tInput = document.getElementById("kin-t").value;
            const t = tInput === "" ? null : parseFloat(tInput);
            const resDiv = document.getElementById("kinetics-result");

            if (!k || k <= 0 || !a0 || a0 <= 0) {
                resDiv.innerHTML = `<span class="text-red-500">k e [A]₀ devem ser positivos.</span>`;
                return;
            }

            let halfLife, atText = "";

            if (order === 0) {
                halfLife = a0 / (2 * k);
                if (t !== null) {
                    const at = a0 - k * t;
                    atText = `<div>[A] em t=${t}: <strong>${at > 0 ? at.toFixed(4) : '0 (reagente consumido)'} mol/L</strong></div>`;
                }
            } else if (order === 1) {
                halfLife = Math.log(2) / k;
                if (t !== null) {
                    const at = a0 * Math.exp(-k * t);
                    atText = `<div>[A] em t=${t}: <strong>${at.toFixed(4)} mol/L</strong></div>`;
                }
            } else {
                halfLife = 1 / (k * a0);
                if (t !== null) {
                    const at = 1 / (1 / a0 + k * t);
                    atText = `<div>[A] em t=${t}: <strong>${at.toFixed(4)} mol/L</strong></div>`;
                }
            }

            resDiv.innerHTML = `
                <div>Ordem: <strong>${order}</strong></div>
                <div>Meia-vida (t₁/₂): <strong>${halfLife.toFixed(4)}</strong></div>
                ${atText}
            `;

            const tFull = order === 0 ? a0 / k : 5 * halfLife;
            const tMaxPlot = (t !== null && t > tFull) ? t * 1.1 : tFull;
            const curvePoints = [];
            const steps = 150;
            for (let i = 0; i <= steps; i++) {
                const tt = (tMaxPlot / steps) * i;
                let at;
                if (order === 0) at = Math.max(0, a0 - k * tt);
                else if (order === 1) at = a0 * Math.exp(-k * tt);
                else at = 1 / (1 / a0 + k * tt);
                curvePoints.push({ x: tt, y: at });
            }
            const markers = [{ x: halfLife, color: "#FFB000", label: "t½" }];
            if (t !== null) markers.push({ x: t, color: "#00FFFF", label: "t consultado" });

            if (!kineticsChart) {
                kineticsChart = createInteractiveChart("kinetics-canvas", { xLabel: "tempo", yLabel: "[A] (mol/L)", yClampMin: 0 });
            }
            kineticsChart.setData([{ label: `[A], ordem ${order}`, points: curvePoints }], markers);
        }

        function runEquilibriumKc() {
            const eqStr = document.getElementById("eq-kc-eq").value.replace(/\s+/g, '');
            const concsRaw = document.getElementById("eq-kc-concs").value;
            const resDiv = document.getElementById("kc-result");

            try {
                const sides = eqStr.split(/->|=|➔/);
                if (sides.length !== 2) throw new Error("Equação deve conter '->' ou '='.");

                const leftComps = sides[0].split('+').filter(Boolean);
                const rightComps = sides[1].split('+').filter(Boolean);

                function splitCoeff(comp) {
                    const m = comp.match(/^(\d*)(.+)$/);
                    return { coeff: m[1] ? parseInt(m[1]) : 1, formula: m[2] };
                }

                const reactants = leftComps.map(splitCoeff);
                const products = rightComps.map(splitCoeff);
                const all = [...reactants, ...products];
                const concs = concsRaw.split(',').map(s => parseFloat(s.trim()));

                if (concs.length !== all.length) {
                    throw new Error(`Forneça ${all.length} concentração(ões), na ordem: ${all.map(c => c.formula).join(', ')}.`);
                }

                let numerator = 1, denominator = 1;
                let detailsProd = [], detailsReag = [];

                reactants.forEach((r, i) => {
                    denominator *= Math.pow(concs[i], r.coeff);
                    detailsReag.push(`[${r.formula}]^${r.coeff}`);
                });
                products.forEach((p, i) => {
                    const idx = reactants.length + i;
                    numerator *= Math.pow(concs[idx], p.coeff);
                    detailsProd.push(`[${p.formula}]^${p.coeff}`);
                });

                const kc = numerator / denominator;

                resDiv.innerHTML = `
                    <div class="text-xs opacity-80 mb-1">Kc = (${detailsProd.join('·')}) / (${detailsReag.join('·')})</div>
                    <div class="text-xl font-bold my-1">Kc = ${kc.toExponential(4)}</div>
                    <div class="text-xs mt-1">${kc > 1 ? 'Kc > 1: equilíbrio favorece os produtos.' : 'Kc < 1: equilíbrio favorece os reagentes.'}</div>
                `;
            } catch (e) {
                resDiv.innerHTML = `<div class="text-red-500">Erro: ${escapeHTML(e.message)}</div>`;
            }
        }

        function runTitrationCurve() {
            const ca = parseFloat(document.getElementById("tit-ca").value);
            const va = parseFloat(document.getElementById("tit-va").value);
            const cb = parseFloat(document.getElementById("tit-cb").value);
            const vMax = parseFloat(document.getElementById("tit-vmax").value);
            const resDiv = document.getElementById("titration-result");

            if (!ca || !va || !cb || !vMax || ca <= 0 || va <= 0 || cb <= 0 || vMax <= 0) {
                resDiv.innerHTML = `<span class="text-red-500">Todos os valores devem ser positivos.</span>`;
                return;
            }

            const molesAcid = ca * (va / 1000);
            const equivVol = (molesAcid / cb) * 1000;

            const points = [];
            const steps = 200;
            for (let i = 0; i <= steps; i++) {
                const vb = (vMax / steps) * i;
                const molesBase = cb * (vb / 1000);
                const totalVolL = (va + vb) / 1000;
                const excessMoles = molesBase - molesAcid;

                let pH;
                if (Math.abs(excessMoles) < 1e-12) {
                    pH = 7.0;
                } else if (excessMoles < 0) {
                    const hConc = -excessMoles / totalVolL;
                    pH = -Math.log10(hConc);
                } else {
                    const ohConc = excessMoles / totalVolL;
                    const pOH = -Math.log10(ohConc);
                    pH = 14 - pOH;
                }
                points.push({ x: vb, y: Math.max(0, Math.min(14, pH)) });
            }

            if (!titrationChart) {
                titrationChart = createInteractiveChart("titration-canvas", { xLabel: "Volume de base (mL)", yLabel: "pH", yClampMin: 0, yClampMax: 14 });
            }
            const markers = equivVol <= vMax ? [{ x: equivVol, color: "#FF4444", label: "equivalência" }] : [];
            titrationChart.setData([{ label: "pH", points }], markers);

            resDiv.innerHTML = `
                <div>Ponto de equivalência: <strong>${equivVol.toFixed(2)} mL</strong> de base (linha vermelha tracejada)</div>
                <div class="text-xs opacity-70">pH no ponto de equivalência = 7,00 (ácido forte + base forte neutralizam completamente).</div>
            `;
        }

        function runBeerLambert() {
            let a = parseFloat(document.getElementById("bl-a").value);
            let eps = parseFloat(document.getElementById("bl-eps").value);
            let b = parseFloat(document.getElementById("bl-b").value);
            let c = parseFloat(document.getElementById("bl-c").value);
            const out = document.getElementById("bl-result");

            const blanks = [isNaN(a), isNaN(eps), isNaN(b), isNaN(c)].filter(Boolean).length;
            if (blanks !== 1) {
                out.innerHTML = `<span class="text-yellow-400">Deixe exatamente um campo (A, ε, b ou c) vazio.</span>`;
                return;
            }

            if (isNaN(a)) { a = eps * b * c; out.innerHTML = `A = <strong>${a.toFixed(4)}</strong> (adimensional)`; }
            else if (isNaN(eps)) { eps = a / (b * c); out.innerHTML = `ε = <strong>${eps.toFixed(2)} L/(mol·cm)</strong>`; }
            else if (isNaN(b)) { b = a / (eps * c); out.innerHTML = `b = <strong>${b.toFixed(4)} cm</strong>`; }
            else if (isNaN(c)) { c = a / (eps * b); out.innerHTML = `c = <strong>${c.toExponential(4)} mol/L</strong>`; }

            out.innerHTML += `<div class="text-[10px] opacity-50 mt-1">Válido apenas na faixa de resposta linear do instrumento (tipicamente A entre 0,1 e 1,0).</div>`;
        }

        function runSpectroConvert() {
            const lambdaNm = parseFloat(document.getElementById("spec-lambda").value);
            const out = document.getElementById("spec-result");
            if (!lambdaNm || lambdaNm <= 0) {
                out.innerHTML = `<span class="text-red-500">Informe um comprimento de onda positivo.</span>`;
                return;
            }

            const c = 2.998e8;
            const h = 6.626e-34;
            const NA = 6.022e23;

            const lambdaM = lambdaNm * 1e-9;
            const freq = c / lambdaM;
            const energyJ = h * freq;
            const energyEv = energyJ / 1.602e-19;
            const energyMolar = energyJ * NA / 1000;

            let region = "Raio-X / UV extremo";
            if (lambdaNm >= 10 && lambdaNm < 400) region = "Ultravioleta (UV)";
            else if (lambdaNm >= 400 && lambdaNm < 700) region = "Visível";
            else if (lambdaNm >= 700 && lambdaNm < 1e6) region = "Infravermelho (IV)";
            else if (lambdaNm >= 1e6) region = "Micro-ondas / Rádio";

            out.innerHTML = `
                <div>Frequência (ν): <strong>${freq.toExponential(4)} Hz</strong></div>
                <div>Energia por fóton: <strong>${energyJ.toExponential(4)} J</strong> (${energyEv.toFixed(4)} eV)</div>
                <div>Energia por mol de fótons: <strong>${energyMolar.toFixed(2)} kJ/mol</strong></div>
                <div class="mt-1 pt-1 border-t border-current">Região do espectro: <strong>${region}</strong></div>
                <div class="text-[10px] opacity-50 mt-1">c=2,998×10⁸ m/s, h=6,626×10⁻³⁴ J·s, Nₐ=6,022×10²³ /mol (CODATA, arredondados).</div>
            `;
        }

        function runWeakTitrationCurve() {
            const ca = parseFloat(document.getElementById("tf-ca").value);
            const va = parseFloat(document.getElementById("tf-va").value);
            const ka = parseFloat(document.getElementById("tf-ka").value);
            const cb = parseFloat(document.getElementById("tf-cb").value);
            const vMax = parseFloat(document.getElementById("tf-vmax").value);
            const resDiv = document.getElementById("titration-weak-result");

            if (!ca || !va || !ka || !cb || !vMax || [ca,va,ka,cb,vMax].some(v => v <= 0)) {
                resDiv.innerHTML = `<span class="text-red-500">Todos os valores devem ser positivos.</span>`;
                return;
            }

            const Kw = 1e-14;
            const Kb = Kw / ka;
            const molesHA0 = ca * (va / 1000);
            const equivVol = (molesHA0 / cb) * 1000;

            const points = [];
            const steps = 250;
            for (let i = 0; i <= steps; i++) {
                const vb = (vMax / steps) * i;
                const molesOH = cb * (vb / 1000);
                const totalVolL = (va + vb) / 1000;
                const molesA = Math.min(molesOH, molesHA0);
                const molesHAremain = molesHA0 - molesA;
                const tolerance = molesHA0 * 1e-6;

                let pH;
                if (Math.abs(molesOH - molesHA0) < tolerance) {
                    const cSalt = molesA / totalVolL;
                    const x = (-Kb + Math.sqrt(Kb*Kb + 4*Kb*cSalt)) / 2;
                    const pOH = -Math.log10(x);
                    pH = 14 - pOH;
                } else if (molesOH < molesHA0) {
                    const cHA = molesHAremain / totalVolL;
                    const cA = molesA / totalVolL;
                    const A = 1, B = ka + cA, C = -ka * cHA;
                    const x = (-B + Math.sqrt(B*B - 4*A*C)) / (2*A);
                    pH = -Math.log10(x);
                } else {
                    const excessOH = molesOH - molesHA0;
                    const ohConc = excessOH / totalVolL;
                    const pOH = -Math.log10(ohConc);
                    pH = 14 - pOH;
                }
                points.push({ x: vb, y: Math.max(0, Math.min(14, pH)) });
            }

            if (!titrationWeakChart) {
                titrationWeakChart = createInteractiveChart("titration-weak-canvas", { xLabel: "Volume de base (mL)", yLabel: "pH", yClampMin: 0, yClampMax: 14 });
            }
            const markers = equivVol <= vMax ? [{ x: equivVol, color: "#FF4444", label: "equivalência" }] : [];
            titrationWeakChart.setData([{ label: "pH", points }], markers);

            const cSaltAtEq = molesHA0 / ((va + equivVol) / 1000);
            const xEqOH = (-Kb + Math.sqrt(Kb*Kb + 4*Kb*cSaltAtEq)) / 2;
            const pHatEquiv = 14 - (-Math.log10(xEqOH));

            resDiv.innerHTML = `
                <div>Ponto de equivalência: <strong>${equivVol.toFixed(2)} mL</strong> — pH ≈ <strong>${pHatEquiv.toFixed(2)}</strong> (básico, devido à hidrólise da base conjugada)</div>
                <div class="text-[10px] opacity-50 mt-1">Diferente da titulação forte-forte: aqui o ponto de equivalência não é pH 7, pois a base conjugada A⁻ hidrolisa a água.</div>
            `;
        }

        function runSolubility() {
            const p = parseInt(document.getElementById("ksp-p").value);
            const q = parseInt(document.getElementById("ksp-q").value);
            const ksp = parseFloat(document.getElementById("ksp-value").value);
            const commonConc = parseFloat(document.getElementById("ksp-common").value) || 0;
            const commonTarget = document.getElementById("ksp-common-target").value;
            const resDiv = document.getElementById("ksp-result");

            if (!p || !q || !ksp || p <= 0 || q <= 0 || ksp <= 0) {
                resDiv.innerHTML = `<span class="text-red-500">p, q e Kps devem ser positivos.</span>`;
                return;
            }

            let s;

            if (commonConc === 0) {
                s = Math.pow(ksp / (Math.pow(p, p) * Math.pow(q, q)), 1 / (p + q));
            } else {
                function f(s) {
                    const catConc = p * s + (commonTarget === "cation" ? commonConc : 0);
                    const anConc = q * s + (commonTarget === "anion" ? commonConc : 0);
                    return Math.pow(catConc, p) * Math.pow(anConc, q) - ksp;
                }
                // CORRIGIDO: passo relativo em vez de fixo — evita perda de precisão
                // quando s é muito pequeno (Ksp muito baixos).
                function fPrime(s) {
                    const h = Math.max(Math.abs(s) * 1e-6, 1e-15);
                    return (f(s + h) - f(s - h)) / (2 * h);
                }

                s = Math.pow(ksp / (Math.pow(p, p) * Math.pow(q, q)), 1 / (p + q));
                for (let iter = 0; iter < 100; iter++) {
                    const fVal = f(s);
                    const fPrimeVal = fPrime(s);
                    if (Math.abs(fPrimeVal) < 1e-30) break;
                    const sNext = s - fVal / fPrimeVal;
                    if (sNext < 0 || !isFinite(sNext)) break;
                    if (Math.abs(sNext - s) < Math.abs(s) * 1e-9) { s = sNext; break; }
                    s = sNext;
                }
            }

            resDiv.innerHTML = `
                <div>Solubilidade molar (s): <strong>${s.toExponential(4)} mol/L</strong></div>
                <div class="text-xs opacity-70 mt-1">[Cátion] = ${(p*s + (commonTarget==="cation"?commonConc:0)).toExponential(3)} mol/L | [Ânion] = ${(q*s + (commonTarget==="anion"?commonConc:0)).toExponential(3)} mol/L</div>
                ${commonConc > 0 ? `<div class="text-yellow-300 text-xs mt-1">Efeito do íon comum reduziu a solubilidade em relação ao valor sem íon comum.</div>` : ''}
                <div class="text-[10px] opacity-50 mt-2">Assume solução ideal (atividade ≈ concentração) e ausência de complexação/hidrólise secundária.</div>
            `;
        }
