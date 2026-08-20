        /* ==========================================================================
           6. EXECUÇÃO — FUNÇÕES ORIGINAIS
           ========================================================================== */
        function runBalancer() {
            const resDiv = document.getElementById("eq-result");
            try {
                const balanced = balanceChemicalEquation(document.getElementById("eq-input").value);
                resDiv.innerHTML = `<div class="text-base font-bold text-green-400 mb-1">BALANCEADA COM SUCESSO:</div><div>${escapeHTML(balanced.text)}</div>`;
            } catch(err) {
                resDiv.innerHTML = `<div class="text-red-500">ERRO NO BALANCEAMENTO: ${escapeHTML(err.message)}</div>`;
            }
        }

        function runMolarMass() {
            const input = document.getElementById("molar-input").value;
            const resDiv = document.getElementById("molar-result");
            const res = parseFormula(input);

            if (!res.totalMass) {
                resDiv.innerHTML = "<span class='text-red-500'>Fórmula inválida.</span>";
                return;
            }
            resDiv.innerHTML = `<div class="text-base font-bold">Massa Molar Total: ${res.totalMass.toFixed(4)} g/mol</div>`;
        }

        async function runPubChemSearch() {
            const query = document.getElementById("pubchem-input").value;
            const resDiv = document.getElementById("pubchem-result");
            resDiv.innerHTML = "<span class='animate-pulse'>Conectando aos servidores PubChem...</span>";

            try {
                const data = await fetchPubChemData(query);
                const pugView = await fetchPubChemPugView(data.CID);
                // CORRIGIDO: CID agora é URL-encoded por consistência de higienização
                const imgUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${encodeURIComponent(data.CID)}/PNG?image_size=250x250`;
                const queryTimestamp = new Date().toLocaleString('pt-BR');

                let hazardsHTML = "";
                if (pugView && pugView.hazards && pugView.hazards.length > 0) {
                    hazardsHTML = `<div class="mt-2 pt-2 border-t border-current"><strong class="text-red-400">ALERTAS GHS:</strong><ul class="list-disc pl-4 text-xs opacity-90">` +
                        pugView.hazards.slice(0, 4).map(h => `<li>${escapeHTML(h)}</li>`).join('') + `</ul>
                        <div class="text-[10px] text-yellow-400 mt-1">⚠ Fonte: PubChem GHS Classification. NÃO substitui a FISPQ/SDS oficial do fabricante — consulte-a antes de manusear qualquer substância.</div>
                        </div>`;
                }

                let physHTML = "";
                if (pugView) {
                    physHTML = `
                        <div class="mt-2 pt-1 border-t border-current text-xs">
                            <strong>PROPRIEDADES FÍSICAS:</strong>
                            <div>• Densidade: ${escapeHTML(pugView.density || 'N/A')}</div>
                            <div>• Fusão: ${escapeHTML(pugView.meltingPoint || 'N/A')} | Ebulição: ${escapeHTML(pugView.boilingPoint || 'N/A')}</div>
                        </div>
                    `;
                }

                let wikiHTML = "";
                const wikiSummary = await fetchWikiSummary(data.Title);
                if (wikiSummary) {
                    wikiHTML = `<div class="mt-2 pt-2 border-t border-current text-xs">
                        <strong>CONTEXTO (WIKIPEDIA):</strong>
                        <div class="opacity-90 mt-1">${escapeHTML(wikiSummary)}</div>
                    </div>`;
                }

                resDiv.innerHTML = `
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <div class="dos-border p-1 bg-black flex-shrink-0">
                            <img src="${imgUrl}" alt="Estrutura 2D" class="chem-img w-48 h-48 object-contain">
                        </div>
                        <div class="flex-grow space-y-1">
                            <div class="text-base font-bold underline mb-1">${escapeHTML(data.Title)} (CID #${data.CID})</div>
                            <div>• <strong>Fórmula:</strong> ${escapeHTML(data.MolecularFormula || 'N/A')}</div>
                            <div>• <strong>Massa Molar:</strong> ${escapeHTML(data.MolecularWeight || 'N/A')} g/mol</div>
                            <div>• <strong>SMILES:</strong> <span class="font-mono text-[10px] break-all">${escapeHTML(data.CanonicalSMILES || 'N/A')}</span></div>
                            ${physHTML}
                            ${hazardsHTML}
                        </div>
                    </div>
                    ${wikiHTML}
                    <div class="text-[10px] opacity-50 mt-2 border-t border-current pt-1">Consultado em: ${queryTimestamp} via PubChem PUG REST API (CID #${data.CID})${data._fromCache ? ' · <span class="text-cyan-400">⚡ resposta em cache local (mais rápida, sem nova requisição ao servidor)</span>' : ''}</div>
                `;
            } catch(err) {
                resDiv.innerHTML = `<div class="text-red-500">FALHA API: ${escapeHTML(err.message)}</div>`;
            }
        }

        async function autoFetchSoluteProps() {
            const soluteName = document.getElementById("p-solute").value;
            const resDiv = document.getElementById("prep-result");
            resDiv.innerHTML = "Buscando massa/densidade via API...";
            try {
                const data = await fetchPubChemData(soluteName);
                if (data.MolecularWeight) {
                    document.getElementById("p-mm").value = data.MolecularWeight;
                    resDiv.innerHTML = `<div class="text-xs text-green-400">Massa atualizada: ${data.MolecularWeight} g/mol</div>`;
                }
                const pugView = await fetchPubChemPugView(data.CID);
                if (pugView && pugView.density) {
                    const match = pugView.density.match(/(\d+(\.\d+)?)/);
                    if (match) {
                        document.getElementById("p-density").value = match[1];
                        resDiv.innerHTML += `<div class="text-xs text-green-400">Densidade obtida: ${match[1]} g/mL</div>`;
                    }
                }
            } catch(e) {
                resDiv.innerHTML = `<div class="text-xs text-red-400">${escapeHTML(e.message || "Falha ao localizar soluto.")}</div>`;
            }
        }

        function runPrep() {
            const mm = parseFloat(document.getElementById("p-mm").value);
            const conc = parseFloat(document.getElementById("p-conc").value);
            const volmL = parseFloat(document.getElementById("p-vol").value);
            const purity = parseFloat(document.getElementById("p-purity").value) || 100;
            const density = parseFloat(document.getElementById("p-density").value);

            if (!mm) return;
            const realMass = ((conc * (volmL / 1000) * mm) / (purity / 100));

            let liquidVolHTML = "";
            if (density && density > 0) {
                const volLiquid = realMass / density;
                liquidVolHTML = `<div class="text-xs text-yellow-300 mt-1">Como é líquido (ρ=${density} g/mL), meça exatamente <strong>${volLiquid.toFixed(3)} mL</strong>.</div>`;
            }

            document.getElementById("prep-result").innerHTML = `
                <div class="text-xs">Massa Necessária:</div>
                <div class="text-xl font-bold my-1">${realMass.toFixed(4)} g</div>
                ${liquidVolHTML}
            `;
        }

        function runDilution() {
            let c1 = parseFloat(document.getElementById("d-c1").value);
            let v1 = parseFloat(document.getElementById("d-v1").value);
            let c2 = parseFloat(document.getElementById("d-c2").value);
            let v2 = parseFloat(document.getElementById("d-v2").value);
            const out = document.getElementById("dilution-result");

            if (isNaN(v1)) out.innerHTML = `V1 = <strong>${((c2 * v2) / c1).toFixed(3)} mL</strong>`;
            else if (isNaN(c1)) out.innerHTML = `C1 = <strong>${((c2 * v2) / v1).toFixed(3)}</strong>`;
            else if (isNaN(c2)) out.innerHTML = `C2 = <strong>${((c1 * v1) / v2).toFixed(3)}</strong>`;
            else if (isNaN(v2)) out.innerHTML = `V2 = <strong>${((c1 * v1) / c2).toFixed(3)} mL</strong>`;
            else out.innerHTML = `<span class="text-yellow-400">Deixe exatamente um campo vazio.</span>`;
        }

        async function autoFetchPka() {
            const resDiv = document.getElementById("ph-result");
            resDiv.innerHTML = "Buscando pKa na base PUG-VIEW...";
            try {
                const data = await fetchPubChemData(document.getElementById("wa-name").value);
                const pugView = await fetchPubChemPugView(data.CID);

                if (pugView && pugView.pka) {
                    const match = pugView.pka.match(/(\d+(\.\d+)?)/);
                    if (match) {
                        const pkaVal = parseFloat(match[1]);
                        const kaVal = Math.pow(10, -pkaVal);
                        document.getElementById("wa-ka").value = kaVal.toExponential(4);
                        resDiv.innerHTML = `pKa localizado: <strong>${pkaVal}</strong> (Ka = ${kaVal.toExponential(3)})`;
                        return;
                    }
                }
                resDiv.innerHTML = "pKa não localizado. Digite manualmente.";
            } catch(e) {
                resDiv.innerHTML = `<span class="text-red-400">${escapeHTML(e.message || "Erro ao conectar à API.")}</span> Digite o pKa manualmente.`;
            }
        }

        function runWeakAcidPH() {
            const c = parseFloat(document.getElementById("wa-conc").value);
            const ka = parseFloat(document.getElementById("wa-ka").value);
            const h = (-ka + Math.sqrt(ka * ka + 4 * ka * c)) / 2;
            document.getElementById("ph-result").innerHTML = `pH = <strong>${(-Math.log10(h)).toFixed(2)}</strong>
                <div class="text-[10px] opacity-50 mt-2 font-normal">Aproximação válida para soluções não muito diluídas (autoionização da água desprezada). Em concentrações muito baixas (&lt;10⁻⁶ mol/L), esse modelo perde precisão.</div>`;
        }
