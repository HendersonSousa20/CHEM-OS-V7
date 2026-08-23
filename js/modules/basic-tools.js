        /* ==========================================================================
           GHS — mapeamento simplificado de frases de perigo para pictogramas
           (aproximação visual didática, baseada em palavras-chave comuns nas
           GHS Hazard Statements do PubChem — não substitui a leitura da FISPQ).
           Os ícones são SVG vetoriais monocromáticos (preto), desenhados no
           mesmo espírito dos pictogramas GHS reais — nunca emoji colorido — e
           renderizados dentro do losango branco/vermelho já usado por .ghs-pictogram.
           ========================================================================== */
        const GHS_ICON_SVG = {
            explosivo: `<svg viewBox="0 0 40 40" width="20" height="20"><circle cx="20" cy="22" r="6" fill="none" stroke="#111" stroke-width="2"/>${[0,45,90,135,180,225,270,315].map(a=>{const r1=9,r2=14,rad=a*Math.PI/180;const x1=20+r1*Math.cos(rad),y1=22+r1*Math.sin(rad),x2=20+r2*Math.cos(rad),y2=22+r2*Math.sin(rad);return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#111" stroke-width="2" stroke-linecap="round"/>`;}).join('')}</svg>`,
            inflamavel: `<svg viewBox="0 0 40 40" width="20" height="20"><path d="M20 6 C13 15 13 23 18 28 C16 24 17 20 20 18 C21 22 24 23 24 27 C24 29 22.5 30 20 30 C26 30 29 26 27 20 C26 22 25 22.5 24.5 21 C27 15 24 9 20 6 Z" fill="#111"/></svg>`,
            oxidante: `<svg viewBox="0 0 40 40" width="20" height="20"><circle cx="20" cy="27" r="5" fill="none" stroke="#111" stroke-width="2"/><path d="M20 6 C15 13 15 20 20 25 C25 20 25 13 20 6 Z" fill="#111"/></svg>`,
            gas_pressao: `<svg viewBox="0 0 40 40" width="20" height="20"><rect x="14" y="15" width="12" height="17" rx="2" fill="none" stroke="#111" stroke-width="2"/><rect x="17" y="9" width="6" height="6" fill="none" stroke="#111" stroke-width="2"/><line x1="14" y1="22" x2="26" y2="22" stroke="#111" stroke-width="1.2"/></svg>`,
            corrosivo: `<svg viewBox="0 0 40 40" width="20" height="20"><line x1="12" y1="8" x2="20" y2="16" stroke="#111" stroke-width="2"/><line x1="8" y1="12" x2="16" y2="20" stroke="#111" stroke-width="2"/><path d="M14 18 L22 26 C23.5 27.5 23.5 29.5 22 31 C20.5 32.5 18.5 32.5 17 31 L9 23 Z" fill="none" stroke="#111" stroke-width="1.8"/><line x1="10" y1="34" x2="30" y2="34" stroke="#111" stroke-width="2"/><circle cx="24" cy="30" r="1.4" fill="#111"/><circle cx="27" cy="33" r="1.1" fill="#111"/></svg>`,
            toxico: `<svg viewBox="0 0 40 40" width="20" height="20"><circle cx="20" cy="17" r="8" fill="none" stroke="#111" stroke-width="2"/><circle cx="16.5" cy="16" r="1.6" fill="#111"/><circle cx="23.5" cy="16" r="1.6" fill="#111"/><path d="M16 21 Q20 24 24 21" fill="none" stroke="#111" stroke-width="1.4"/><line x1="11" y1="28" x2="29" y2="35" stroke="#111" stroke-width="2"/><line x1="29" y1="28" x2="11" y2="35" stroke="#111" stroke-width="2"/></svg>`,
            irritante: `<svg viewBox="0 0 40 40" width="20" height="20"><line x1="20" y1="8" x2="20" y2="24" stroke="#111" stroke-width="3.5" stroke-linecap="round"/><circle cx="20" cy="30" r="2.1" fill="#111"/></svg>`,
            saude: `<svg viewBox="0 0 40 40" width="20" height="20"><circle cx="20" cy="12" r="4.5" fill="none" stroke="#111" stroke-width="2"/><path d="M13 32 L15.5 20 L24.5 20 L27 32 Z" fill="none" stroke="#111" stroke-width="2"/><path d="M20 17 L22.5 21.5 L20 26 L17.5 21.5 Z" fill="#111"/></svg>`,
            ambiental: `<svg viewBox="0 0 40 40" width="20" height="20"><circle cx="16" cy="13" r="4.5" fill="none" stroke="#111" stroke-width="2"/><line x1="16" y1="17.5" x2="16" y2="25" stroke="#111" stroke-width="2"/><path d="M8 30 Q11.5 26.5 15 30 T22 30 T29 30" fill="none" stroke="#111" stroke-width="2"/><path d="M24 18 L28 12 L28 20 Z" fill="#111"/></svg>`
        };

        const GHS_KEYWORD_MAP = [
            { re: /explosiv/i, icon: GHS_ICON_SVG.explosivo, label: "Explosivo" },
            { re: /flamm[aá]vel|flammable/i, icon: GHS_ICON_SVG.inflamavel, label: "Inflamável" },
            { re: /oxidiz|oxidante|comburente/i, icon: GHS_ICON_SVG.oxidante, label: "Oxidante" },
            { re: /gas under pressure|compressed gas|g[aá]s (sob press[aã]o|comprimido)/i, icon: GHS_ICON_SVG.gas_pressao, label: "Gás sob pressão" },
            { re: /corrosion|corrosive|corrosiv|severe skin burns|queimadura/i, icon: GHS_ICON_SVG.corrosivo, label: "Corrosivo" },
            { re: /fatal if|toxic if|t[oó]xico se|life-threatening/i, icon: GHS_ICON_SVG.toxico, label: "Toxicidade aguda" },
            { re: /carcinogen|mutagen|reproductive toxicity|respiratory sensiti|aspiration hazard|specific target organ|cancer/i, icon: GHS_ICON_SVG.saude, label: "Perigo à saúde" },
            { re: /irritation|irrita[cç][aã]o|harmful if|nociv/i, icon: GHS_ICON_SVG.irritante, label: "Irritante / nocivo" },
            { re: /aquatic life|environment|ambiente aqu[aá]tico/i, icon: GHS_ICON_SVG.ambiental, label: "Perigo ambiental" }
        ];

        function ghsPictogramsHTML(hazards) {
            if (!hazards || !hazards.length) return "";
            const matched = new Map();
            hazards.forEach(h => {
                GHS_KEYWORD_MAP.forEach(entry => {
                    if (entry.re.test(h) && !matched.has(entry.label)) matched.set(entry.label, entry);
                });
            });
            if (!matched.size) return "";
            const icons = Array.from(matched.values()).map(entry =>
                `<div class="ghs-pictogram" title="${escapeHTML(entry.label)}"><span>${entry.icon}</span></div>`
            ).join('');
            return `<div class="flex gap-2 flex-wrap items-center mb-2" role="img" aria-label="Pictogramas de perigo GHS identificados: ${escapeHTML(Array.from(matched.keys()).join(', '))}">${icons}</div>`;
        }

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
                    hazardsHTML = `<div class="mt-2 pt-2 border-t border-current"><strong class="text-red-400">ALERTAS GHS:</strong>
                        ${ghsPictogramsHTML(pugView.hazards)}
                        <ul class="list-disc pl-4 text-xs opacity-90">` +
                        pugView.hazards.slice(0, 4).map(h => `<li>${escapeHTML(h)}</li>`).join('') + `</ul>
                        <div class="text-[10px] text-yellow-400 mt-1">[!] Fonte: PubChem GHS Classification. Pictogramas são uma aproximação didática por palavra-chave. NÃO substitui a FISPQ/SDS oficial do fabricante — consulte-a antes de manusear qualquer substância.</div>
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
                    <div class="text-[10px] opacity-50 mt-2 border-t border-current pt-1">Consultado em: ${queryTimestamp} via PubChem PUG REST API (CID #${data.CID})${data._fromCache ? ' · <span class="text-cyan-400">[CACHE] resposta em cache local (mais rápida, sem nova requisição ao servidor)</span>' : ''}</div>
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
