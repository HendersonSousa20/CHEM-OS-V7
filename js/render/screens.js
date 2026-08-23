        /* ==========================================================================
           5. RENDERIZAÇÃO DAS TELAS
           ========================================================================== */
        function renderHome() {
            if (typeof geGuardNavigation === "function") { geGuardNavigation(renderHomeInner); }
            else { renderHomeInner(); }
        }

        function renderHomeInner() {
            const screen = document.getElementById("screen-content");
            screen.innerHTML = `
<pre class="font-bold leading-none text-xs md:text-sm mb-3 hidden sm:block">
 ██████╗██╗  ██╗███████╗███╗   ███╗  ██████╗ ███████╗   ██╗   ██╗██████╗ 
██╔════╝██║  ██║██╔════╝████╗ ████║  ██╔══██╗██╔════╝   ██║   ██║██╔══██╗
██║     ███████║█████╗  ██╔████╔██║  ██║  ██║███████╗   ██║   ██║██████╔╝
██║     ██╔══██║██╔══╝  ██║╚██╔╝██║  ██║  ██║╚════██║   ╚██╗ ██╔╝██╔═══╝ 
╚██████╗██║  ██║███████╗██║ ╚═╝ ██║  ██████╔╝███████║    ╚████╔╝ ██║     
 ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═════╝ ╚══════╝     ╚═══╝  ╚═╝     
</pre>
<div class="border-b border-current pb-2 mb-3">
    <div class="text-xl font-bold">CHEM.OS v7.0 Enterprise Laboratory Engine [25 MÓDULOS]</div>
    <div class="text-xs opacity-80">Pressione F1 para o guia de uso, ou F4 / digite "test" para validar todos os motores de cálculo.</div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
    <button onclick="renderTool(1)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">1. Balanciador Real de Equações (Álgebra Linear)</button>
    <button onclick="renderTool(2)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">2. Consulta PubChem API + GHS Safety + Wikipedia</button>
    <button onclick="renderTool(3)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">3. Calculadora de Massa Molar () [] {}</button>
    <button onclick="renderTool(4)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">4. Preparo de Soluções + Auto-Busca de Densidade</button>
    <button onclick="renderTool(5)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">5. Diluição Interativa (C1V1 = C2V2)</button>
    <button onclick="renderTool(6)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">6. pH Ácido Fraco + Auto-Busca pKa</button>
    <button onclick="renderTool(7)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">7. Tabela Periódica IUPAC (+ Elements API Cache)</button>
    <button onclick="renderTool(8)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">8. Estequiometria (Reagente Limitante + Rendimento)</button>
    <button onclick="renderTool(9)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">9. Termoquímica (ΔH, ΔS, ΔG de Reação)</button>
    <button onclick="renderTool(10)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">10. Tampões (Henderson-Hasselbalch)</button>
    <button onclick="renderTool(11)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">11. Lei dos Gases (Ideal e Combinada)</button>
    <button onclick="renderTool(12)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">12. Eletroquímica (Equação de Nernst)</button>
    <button onclick="renderTool(13)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">13. Resolvedor de Nomenclatura (OPSIN + CACTUS)</button>
    <button onclick="renderTool(14)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">14. Cinética Química (Ordem 0, 1, 2 + Meia-Vida)</button>
    <button onclick="renderTool(15)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">15. Equilíbrio Químico (Cálculo de Kc)</button>
    <button onclick="renderTool(16)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">16. Curva de Titulação Forte-Forte</button>
    <button onclick="renderTool(17)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">17. Espectroscopia (Beer-Lambert + Conversões λ/ν/E)</button>
    <button onclick="renderTool(18)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">18. Titulação Ácido Fraco + Base Forte (Solução Exata)</button>
    <button onclick="renderTool(19)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">19. Solubilidade / Kps (+ Efeito do Íon Comum)</button>
    <button onclick="renderTool(20)" class="text-left p-1 border border-yellow-400 hover:bg-yellow-400 hover:text-black text-yellow-300 font-bold">20. [TST] SUÍTE DE TESTES — Validação dos Motores de Cálculo</button>
    <button onclick="renderTool(21)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">21. [EDT] Editor de Estruturas Químicas (2D)</button>
    <button onclick="renderTool(22)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">22. [SIM] Simulação Molecular (Teoria Cinética dos Gases)</button>
    <button onclick="renderTool(23)" class="text-left p-1 border border-cyan-400 hover:bg-cyan-400 hover:text-black text-cyan-300 font-bold">23. [LAB] Experimentos Guiados (Laboratório Virtual — 4 experimentos)</button>
    <button onclick="renderTool(24)" class="text-left p-1 border border-transparent hover:border-current hover:bg-current hover:text-black">24. [LIV] Fundamentos de Química Geral (Guia de Estudos)</button>
    <button onclick="renderTool(25)" class="text-left p-1 border border-cyan-400 hover:bg-cyan-400 hover:text-black text-cyan-300 font-bold">25. [DET] Detetive Químico (Identificação de Cátions) — NOVO</button>
</div>
`;
            screenAnimateIn();
        }

        function renderTool(toolId) {
            if (typeof geGuardNavigation === "function") { geGuardNavigation(() => renderToolInner(toolId)); }
            else { renderToolInner(toolId); }
        }

        function renderToolInner(toolId) {
            playBeep(700, 0.04);
            const screen = document.getElementById("screen-content");

            switch(parseInt(toolId)) {
                case 1:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">1. BALANCIADOR DE EQUAÇÕES QUÍMICAS (ÁLGEBRA LINEAR)</div>
                        <div class="flex gap-2 mb-3">
                            <input id="eq-input" type="text" class="dos-input flex-grow p-1 text-sm" value="K4[Fe(CN)6] + KMnO4 + H2SO4 -> KHSO4 + Fe2(SO4)3 + MnSO4 + HNO3 + CO2 + H2O">
                            <button onclick="runBalancer()" class="dos-btn">BALANCIAR</button>
                        </div>
                        <div id="eq-result" class="dos-border p-3 text-sm">Clique em BALANCIAR para processar a matriz estequiométrica...</div>
                    `;
                    break;
                case 2:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">2. CONSULTA PUBCHEM + ESTRUTURA 2D + SEGURANÇA GHS + WIKIPEDIA</div>
                        <div class="flex gap-2 mb-3">
                            <input id="pubchem-input" type="text" class="dos-input flex-grow p-1 text-sm" placeholder="Ex: aspirin, benzene, caffeine" value="aspirin">
                            <button onclick="runPubChemSearch()" class="dos-btn">PESQUISAR API</button>
                        </div>
                        <div id="pubchem-result" class="dos-border p-3 text-sm">Aguardando busca...</div>
                    `;
                    break;
                case 3:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">3. CALCULADORA DE MASSA MOLAR</div>
                        <div class="flex gap-2 mb-3">
                            <input id="molar-input" type="text" class="dos-input flex-grow p-1 text-sm" value="K4[Fe(CN)6]">
                            <button onclick="runMolarMass()" class="dos-btn">CALCULAR</button>
                        </div>
                        <div id="molar-result" class="dos-border p-3 text-sm"></div>
                    `;
                    runMolarMass();
                    break;
                case 4:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">4. PREPARO DE SOLUÇÃO & AUTO-BUSCA DENSIDADE VIA API</div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div class="space-y-2">
                                <div class="flex gap-1 items-end">
                                    <div class="flex-grow"><label>Soluto:</label><input id="p-solute" type="text" value="sulfuric acid" class="dos-input w-full p-1"></div>
                                    <button onclick="autoFetchSoluteProps()" class="dos-btn text-[10px] h-7">BUSCAR API</button>
                                </div>
                                <div><label>Massa Molar (g/mol):</label><input id="p-mm" type="number" step="any" value="98.08" class="dos-input w-full p-1"></div>
                                <div><label>Concentração Desejada (mol/L):</label><input id="p-conc" type="number" step="any" value="0.5" class="dos-input w-full p-1"></div>
                                <div><label>Volume Balão (mL):</label><input id="p-vol" type="number" step="any" value="500" class="dos-input w-full p-1"></div>
                                <div><label>Pureza (%):</label><input id="p-purity" type="number" step="any" value="98" class="dos-input w-full p-1"></div>
                                <div><label>Densidade (g/mL):</label><input id="p-density" type="number" step="any" placeholder="1.84" class="dos-input w-full p-1"></div>
                                <button onclick="runPrep()" class="dos-btn w-full mt-2">CALCULAR</button>
                            </div>
                            <div id="prep-result" class="dos-border p-3 flex flex-col justify-center">Aguardando dados...</div>
                        </div>
                    `;
                    break;
                case 5:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">5. CALCULADORA DE DILUIÇÃO (C1·V1 = C2·V2)</div>
                        <p class="text-xs mb-3">Deixe exatamente UM campo em branco:</p>
                        <div class="grid grid-cols-2 gap-3 max-w-md text-xs mb-3">
                            <div><label>C1 (Inicial):</label><input id="d-c1" type="number" step="any" value="18" class="dos-input w-full p-1"></div>
                            <div><label>V1 (Inicial mL):</label><input id="d-v1" type="number" step="any" placeholder="?" class="dos-input w-full p-1"></div>
                            <div><label>C2 (Final):</label><input id="d-c2" type="number" step="any" value="1" class="dos-input w-full p-1"></div>
                            <div><label>V2 (Final mL):</label><input id="d-v2" type="number" step="any" value="250" class="dos-input w-full p-1"></div>
                        </div>
                        <button onclick="runDilution()" class="dos-btn mb-3">CALCULAR INCÓGNITA</button>
                        <div id="dilution-result" class="dos-border p-3 text-sm"></div>
                    `;
                    break;
                case 6:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">6. pH DE ÁCIDOS FRACOS & AUTO-BUSCA DE pKa VIA API</div>
                        <div class="space-y-3 text-xs">
                            <div class="dos-border p-3">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                    <div><label>Nome do Ácido (p/ API):</label>
                                        <div class="flex gap-1">
                                            <input id="wa-name" type="text" value="acetic acid" class="dos-input flex-grow p-1">
                                            <button onclick="autoFetchPka()" class="dos-btn">BUSCAR pKa</button>
                                        </div>
                                    </div>
                                    <div><label>Concentração (mol/L):</label><input id="wa-conc" type="number" step="any" value="0.1" class="dos-input w-full p-1"></div>
                                    <div><label>Ka (Constante Acidez):</label><input id="wa-ka" type="number" step="any" value="0.000018" class="dos-input w-full p-1"></div>
                                </div>
                                <button onclick="runWeakAcidPH()" class="dos-btn">CALCULAR pH</button>
                            </div>
                            <div id="ph-result" class="dos-border p-3 text-sm font-bold">Aguardando entrada...</div>
                        </div>
                    `;
                    break;
                case 7:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-2">7. TABELA PERIÓDICA IUPAC + ELEMENTS API INTEGRADA</div>
                        <div class="flex gap-2 mb-2 text-xs">
                            <input id="ptable-search" type="text" class="dos-input flex-grow p-1" placeholder="Filtrar elemento (ex: Ouro, Au, 79)..." oninput="filterPTable()">
                        </div>
                        <div id="ptable-grid" class="overflow-x-auto mb-2"></div>
                        <div id="elem-detail" class="dos-border p-3 text-xs">Clique em um elemento para consulta de dados da API da PubChem.</div>
                    `;
                    renderPTableGrid();
                    break;
                case 8:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">8. ESTEQUIOMETRIA — REAGENTE LIMITANTE E RENDIMENTO</div>
                        <div class="text-xs mb-1">Equação balanceada:</div>
                        <input id="stoich-eq" type="text" class="dos-input w-full p-1 mb-2 text-sm" value="2H2 + O2 -> 2H2O">
                        <div class="text-xs mb-1">Massas dos reagentes em gramas, na ordem da equação, separadas por vírgula:</div>
                        <input id="stoich-masses" type="text" class="dos-input w-full p-1 mb-2 text-sm" value="4,20">
                        <div class="text-xs mb-1">Rendimento real obtido (g) — opcional, referente ao 1º produto:</div>
                        <input id="stoich-actual" type="number" step="any" class="dos-input w-full p-1 mb-2 text-sm">
                        <button onclick="runStoichiometry()" class="dos-btn mb-3">CALCULAR</button>
                        <div id="stoich-result" class="dos-border p-3 text-sm">Aguardando cálculo...</div>
                    `;
                    break;
                case 9:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">9. TERMOQUÍMICA — ΔH, ΔS, ΔG DE REAÇÃO (BASE LOCAL 25°C/298K)</div>
                        <div class="text-xs mb-1">Equação balanceada (use estados: (s), (l), (g), (aq)):</div>
                        <input id="thermo-eq" type="text" class="dos-input w-full p-1 mb-2 text-sm" value="CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)">
                        <div class="text-xs mb-1">Temperatura (K) — para cálculo de ΔG:</div>
                        <input id="thermo-temp" type="number" step="any" value="298.15" class="dos-input w-full p-1 mb-2 text-sm">
                        <button onclick="runThermochemistry()" class="dos-btn mb-3">CALCULAR</button>
                        <div id="thermo-result" class="dos-border p-3 text-sm">Aguardando cálculo...</div>
                        <div class="text-xs opacity-60 mt-2">Base de dados local com ~30 substâncias comuns. Se uma espécie não estiver na base, o cálculo é interrompido e ela é listada.</div>
                    `;
                    break;
                case 10:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">10. TAMPÕES — EQUAÇÃO DE HENDERSON-HASSELBALCH</div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs max-w-xl">
                            <div><label>pKa do ácido fraco:</label><input id="buf-pka" type="number" step="any" value="4.76" class="dos-input w-full p-1"></div>
                            <div><label>[Base conjugada] mol/L (A⁻):</label><input id="buf-base" type="number" step="any" value="0.15" class="dos-input w-full p-1"></div>
                            <div><label>[Ácido fraco] mol/L (HA):</label><input id="buf-acid" type="number" step="any" value="0.10" class="dos-input w-full p-1"></div>
                        </div>
                        <button onclick="runBufferCalc()" class="dos-btn my-3">CALCULAR pH DO TAMPÃO</button>
                        <div id="buffer-result" class="dos-border p-3 text-sm">Aguardando cálculo...</div>
                    `;
                    break;
                case 11:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">11. LEI DOS GASES — IDEAL E COMBINADA</div>
                        <p class="text-xs mb-2">Para lei combinada, preencha os 6 campos de estado 1 e 2 (deixe 1 em branco para resolver). Para lei ideal (PV=nRT), preencha P, V, n, T e deixe UM em branco.</p>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs max-w-2xl mb-2">
                            <div><label>P1 (atm):</label><input id="g-p1" type="number" step="any" value="1" class="dos-input w-full p-1"></div>
                            <div><label>V1 (L):</label><input id="g-v1" type="number" step="any" value="10" class="dos-input w-full p-1"></div>
                            <div><label>T1 (K):</label><input id="g-t1" type="number" step="any" value="273" class="dos-input w-full p-1"></div>
                            <div><label>P2 (atm):</label><input id="g-p2" type="number" step="any" placeholder="?" class="dos-input w-full p-1"></div>
                            <div><label>V2 (L):</label><input id="g-v2" type="number" step="any" value="5" class="dos-input w-full p-1"></div>
                            <div><label>T2 (K):</label><input id="g-t2" type="number" step="any" value="300" class="dos-input w-full p-1"></div>
                        </div>
                        <button onclick="runCombinedGasLaw()" class="dos-btn mb-2">RESOLVER LEI COMBINADA</button>
                        <div id="gas-combined-result" class="dos-border p-3 text-sm mb-3">Aguardando cálculo...</div>

                        <div class="border-t border-current pt-2 mb-2 text-xs">Lei dos Gases Ideais (PV = nRT) — R = 0.08206 atm·L/(mol·K):</div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs max-w-2xl mb-2">
                            <div><label>P (atm):</label><input id="gi-p" type="number" step="any" value="1" class="dos-input w-full p-1"></div>
                            <div><label>V (L):</label><input id="gi-v" type="number" step="any" placeholder="?" class="dos-input w-full p-1"></div>
                            <div><label>n (mol):</label><input id="gi-n" type="number" step="any" value="1" class="dos-input w-full p-1"></div>
                            <div><label>T (K):</label><input id="gi-t" type="number" step="any" value="273.15" class="dos-input w-full p-1"></div>
                        </div>
                        <button onclick="runIdealGasLaw()" class="dos-btn mb-2">RESOLVER LEI IDEAL</button>
                        <div id="gas-ideal-result" class="dos-border p-3 text-sm">Aguardando cálculo...</div>
                    `;
                    break;
                case 12:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">12. ELETROQUÍMICA — EQUAÇÃO DE NERNST</div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs max-w-xl">
                            <div><label>E° da célula (V):</label><input id="ner-e0" type="number" step="any" value="1.10" class="dos-input w-full p-1"></div>
                            <div><label>Número de elétrons transferidos (n):</label><input id="ner-n" type="number" step="1" value="2" class="dos-input w-full p-1"></div>
                            <div><label>Quociente de reação (Q):</label><input id="ner-q" type="number" step="any" value="0.5" class="dos-input w-full p-1"></div>
                            <div><label>Temperatura (K):</label><input id="ner-t" type="number" step="any" value="298.15" class="dos-input w-full p-1"></div>
                        </div>
                        <button onclick="runNernst()" class="dos-btn my-3">CALCULAR E DA CÉLULA</button>
                        <div id="nernst-result" class="dos-border p-3 text-sm">Aguardando cálculo...</div>
                    `;
                    break;
                case 13:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">13. RESOLVEDOR DE NOMENCLATURA (OPSIN + CACTUS)</div>
                        <p class="text-xs mb-2">Digite um nome IUPAC sistemático (para OPSIN) ou um nome comum/CAS/SMILES (para CACTUS).</p>
                        <div class="flex gap-2 mb-3">
                            <input id="resolver-input" type="text" class="dos-input flex-grow p-1 text-sm" value="ethanoic acid">
                            <button onclick="runNameResolver()" class="dos-btn">RESOLVER</button>
                        </div>
                        <div id="resolver-result" class="dos-border p-3 text-sm">Aguardando consulta...</div>
                    `;
                    break;
                case 14:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">14. CINÉTICA QUÍMICA — LEIS DE VELOCIDADE INTEGRADAS</div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs max-w-2xl mb-2">
                            <div>
                                <label>Ordem da reação:</label>
                                <select id="kin-order" class="dos-input w-full p-1 bg-black">
                                    <option value="0">Ordem 0</option>
                                    <option value="1" selected>Ordem 1</option>
                                    <option value="2">Ordem 2</option>
                                </select>
                            </div>
                            <div><label>k (constante de velocidade):</label><input id="kin-k" type="number" step="any" value="0.05" class="dos-input w-full p-1"></div>
                            <div><label>[A]₀ (concentração inicial, mol/L):</label><input id="kin-a0" type="number" step="any" value="1.0" class="dos-input w-full p-1"></div>
                            <div><label>t (tempo) — deixe em branco para calcular meia-vida:</label><input id="kin-t" type="number" step="any" placeholder="?" class="dos-input w-full p-1"></div>
                        </div>
                        <button onclick="runKinetics()" class="dos-btn mb-3">CALCULAR</button>
                        <div id="kinetics-result" class="dos-border p-3 text-sm mb-2">Aguardando cálculo...</div>
                        <canvas id="kinetics-canvas" class="dos-border w-full" height="260"></canvas>
                        <div class="flex flex-wrap items-center gap-2 mt-1 text-[10px] opacity-70">
                            <button onclick="kineticsChart && kineticsChart.resetView()" class="dos-btn text-xs">RESETAR ZOOM</button>
                            <button onclick="kineticsChart && kineticsChart.exportPNG('cinetica.png')" class="dos-btn text-xs">EXPORTAR PNG</button>
                            <span>Arraste para mover • roda do mouse para zoom • passe o cursor para ver [A] exata em cada instante</span>
                        </div>
                        <div class="text-xs opacity-60 mt-2">Unidades de k variam com a ordem: ordem 0 → mol/(L·s); ordem 1 → 1/s; ordem 2 → L/(mol·s). Ajuste conforme sua unidade de tempo.</div>
                    `;
                    kineticsChart = createInteractiveChart("kinetics-canvas", { xLabel: "tempo", yLabel: "[A] (mol/L)", yClampMin: 0 });
                    break;
                case 15:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">15. EQUILÍBRIO QUÍMICO — CÁLCULO DE Kc</div>
                        <div class="text-xs mb-1">Equação balanceada (sem estados físicos, ex: N2 + 3H2 -> 2NH3):</div>
                        <input id="eq-kc-eq" type="text" class="dos-input w-full p-1 mb-2 text-sm" value="N2 + 3H2 -> 2NH3">
                        <div class="text-xs mb-1">Concentrações no EQUILÍBRIO (mol/L), na ordem dos reagentes depois produtos, separadas por vírgula:</div>
                        <input id="eq-kc-concs" type="text" class="dos-input w-full p-1 mb-2 text-sm" value="0.5, 1.5, 0.2">
                        <button onclick="runEquilibriumKc()" class="dos-btn mb-3">CALCULAR Kc</button>
                        <div id="kc-result" class="dos-border p-3 text-sm">Aguardando cálculo...</div>
                        <div class="text-xs opacity-60 mt-2">Kc = Π[produtos]^coef / Π[reagentes]^coef. Informe as concentrações na mesma ordem em que os componentes aparecem na equação.</div>
                    `;
                    break;
                case 16:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">16. CURVA DE TITULAÇÃO — ÁCIDO FORTE + BASE FORTE</div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs max-w-2xl mb-2">
                            <div><label>Concentração do ácido (mol/L):</label><input id="tit-ca" type="number" step="any" value="0.1" class="dos-input w-full p-1"></div>
                            <div><label>Volume inicial do ácido (mL):</label><input id="tit-va" type="number" step="any" value="25" class="dos-input w-full p-1"></div>
                            <div><label>Concentração da base titulante (mol/L):</label><input id="tit-cb" type="number" step="any" value="0.1" class="dos-input w-full p-1"></div>
                            <div><label>Volume final de base a simular (mL):</label><input id="tit-vmax" type="number" step="any" value="50" class="dos-input w-full p-1"></div>
                        </div>
                        <button onclick="runTitrationCurve()" class="dos-btn mb-3">GERAR CURVA</button>
                        <canvas id="titration-canvas" class="dos-border w-full" height="280"></canvas>
                        <div class="flex flex-wrap items-center gap-2 mt-1 text-[10px] opacity-70">
                            <button onclick="titrationChart && titrationChart.resetView()" class="dos-btn text-xs">RESETAR ZOOM</button>
                            <button onclick="titrationChart && titrationChart.exportPNG('titulacao-forte-forte.png')" class="dos-btn text-xs">EXPORTAR PNG</button>
                            <span>Arraste para mover • roda do mouse para zoom • passe o cursor sobre a curva para ver pH exato</span>
                        </div>
                        <div id="titration-result" class="dos-border p-3 text-sm mt-2">Aguardando cálculo...</div>
                    `;
                    titrationChart = createInteractiveChart("titration-canvas", { xLabel: "Volume de base (mL)", yLabel: "pH", yClampMin: 0, yClampMax: 14 });
                    break;
                case 17:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">17. ESPECTROSCOPIA — LEI DE BEER-LAMBERT + CONVERSÕES</div>
                        <div class="dos-border p-3 mb-3">
                            <div class="text-sm font-bold mb-2">Lei de Beer-Lambert (A = ε·b·c)</div>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                <div><label>Absorbância A:</label><input id="bl-a" type="number" step="any" placeholder="?" class="dos-input w-full p-1"></div>
                                <div><label>ε (L/(mol·cm)):</label><input id="bl-eps" type="number" step="any" value="15000" class="dos-input w-full p-1"></div>
                                <div><label>b — caminho óptico (cm):</label><input id="bl-b" type="number" step="any" value="1" class="dos-input w-full p-1"></div>
                                <div><label>c — concentração (mol/L):</label><input id="bl-c" type="number" step="any" value="0.0001" class="dos-input w-full p-1"></div>
                            </div>
                            <button onclick="runBeerLambert()" class="dos-btn mt-2">CALCULAR (deixe 1 campo vazio)</button>
                            <div id="bl-result" class="dos-border p-2 text-sm mt-2">Aguardando cálculo...</div>
                        </div>
                        <div class="dos-border p-3">
                            <div class="text-sm font-bold mb-2">Conversão Comprimento de Onda ⇄ Frequência ⇄ Energia</div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-2">
                                <div><label>Comprimento de onda λ (nm):</label><input id="spec-lambda" type="number" step="any" value="500" class="dos-input w-full p-1"></div>
                            </div>
                            <button onclick="runSpectroConvert()" class="dos-btn">CONVERTER</button>
                            <div id="spec-result" class="dos-border p-2 text-sm mt-2">Aguardando cálculo...</div>
                        </div>
                    `;
                    break;
                case 18:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">18. TITULAÇÃO — ÁCIDO FRACO + BASE FORTE (SOLUÇÃO EXATA POR REGIÃO)</div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs max-w-2xl mb-2">
                            <div><label>Concentração do ácido fraco (mol/L):</label><input id="tf-ca" type="number" step="any" value="0.1" class="dos-input w-full p-1"></div>
                            <div><label>Volume inicial do ácido (mL):</label><input id="tf-va" type="number" step="any" value="25" class="dos-input w-full p-1"></div>
                            <div><label>Ka do ácido fraco:</label><input id="tf-ka" type="number" step="any" value="0.0000018" class="dos-input w-full p-1"></div>
                            <div><label>Concentração da base forte titulante (mol/L):</label><input id="tf-cb" type="number" step="any" value="0.1" class="dos-input w-full p-1"></div>
                            <div><label>Volume final de base a simular (mL):</label><input id="tf-vmax" type="number" step="any" value="50" class="dos-input w-full p-1"></div>
                        </div>
                        <button onclick="runWeakTitrationCurve()" class="dos-btn mb-3">GERAR CURVA</button>
                        <canvas id="titration-weak-canvas" class="dos-border w-full" height="280"></canvas>
                        <div class="flex flex-wrap items-center gap-2 mt-1 text-[10px] opacity-70">
                            <button onclick="titrationWeakChart && titrationWeakChart.resetView()" class="dos-btn text-xs">RESETAR ZOOM</button>
                            <button onclick="titrationWeakChart && titrationWeakChart.exportPNG('titulacao-fraco-forte.png')" class="dos-btn text-xs">EXPORTAR PNG</button>
                            <span>Arraste para mover • roda do mouse para zoom • passe o cursor sobre a curva para ver pH exato</span>
                        </div>
                        <div id="titration-weak-result" class="dos-border p-3 text-sm mt-2">Aguardando cálculo...</div>
                        <div class="text-[10px] opacity-50 mt-2">Modelo: reação de neutralização completa por região + equilíbrio ácido/base fraco via equação quadrática (Kw desprezado exceto no ponto de equivalência, onde a hidrólise de A⁻ é calculada via Kb=Kw/Ka).</div>
                    `;
                    titrationWeakChart = createInteractiveChart("titration-weak-canvas", { xLabel: "Volume de base (mL)", yLabel: "pH", yClampMin: 0, yClampMax: 14 });
                    break;
                case 19:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">19. SOLUBILIDADE — PRODUTO DE SOLUBILIDADE (Kps)</div>
                        <p class="text-xs mb-2">Sal genérico A<sub>p</sub>B<sub>q</sub> → p·A + q·B. Informe p e q (ex: PbCl₂ → p=1, q=2).</p>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs max-w-2xl mb-2">
                            <div><label>p (cátions/fórmula):</label><input id="ksp-p" type="number" step="1" value="1" class="dos-input w-full p-1"></div>
                            <div><label>q (ânions/fórmula):</label><input id="ksp-q" type="number" step="1" value="2" class="dos-input w-full p-1"></div>
                            <div><label>Kps:</label><input id="ksp-value" type="number" step="any" value="1.6e-5" class="dos-input w-full p-1"></div>
                            <div><label>Íon comum já presente (mol/L, 0 se nenhum):</label><input id="ksp-common" type="number" step="any" value="0" class="dos-input w-full p-1"></div>
                        </div>
                        <div class="text-xs mb-2">Íon comum afeta:
                            <select id="ksp-common-target" class="dos-input p-1 bg-black">
                                <option value="cation">Cátion (A)</option>
                                <option value="anion">Ânion (B)</option>
                            </select>
                        </div>
                        <button onclick="runSolubility()" class="dos-btn mb-3">CALCULAR SOLUBILIDADE MOLAR (s)</button>
                        <div id="ksp-result" class="dos-border p-3 text-sm">Aguardando cálculo...</div>
                    `;
                    break;
                case 20:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3 text-yellow-300">20. [TST] SUÍTE DE TESTES — VALIDAÇÃO DOS MOTORES DE CÁLCULO</div>
                        <p class="text-xs mb-3">Cada teste compara a saída de uma função do sistema contra um valor de referência conhecido (literatura de físico-química ou cálculo à mão verificado). Um teste falhando indica regressão introduzida por edição futura do código.</p>
                        <button onclick="runTestSuite()" class="dos-btn mb-3">RODAR TODOS OS TESTES</button>
                        <div id="test-summary" class="dos-border p-3 text-sm mb-3 font-bold">Aguardando execução...</div>
                        <div id="test-results" class="space-y-1 text-xs"></div>
                    `;
                    break;
                case 21:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">21. [EDT] EDITOR DE ESTRUTURAS QUÍMICAS (2D)</div>
                        <p class="text-xs mb-2 opacity-80">
                            <strong>Átomo:</strong> clique na tela vazia para inserir; clique num átomo existente para trocar o elemento.
                            <strong>Ligação:</strong> clique em dois átomos para conectar (clicar de novo no mesmo par aumenta a ordem: simples → dupla → tripla → simples).
                            <strong>Apagar:</strong> clique num átomo ou sobre uma ligação para remover.
                        </p>

                        <div class="flex flex-wrap gap-3 mb-3 items-start text-xs">
                            <div class="dos-border p-2">
                                <div class="font-bold mb-1 opacity-80">FERRAMENTA</div>
                                <div class="flex gap-1">
                                    <button id="se-tool-atom" onclick="setEditorTool('atom')" class="dos-btn py-1.5">ÁTOMO</button>
                                    <button id="se-tool-bond" onclick="setEditorTool('bond')" class="dos-btn py-1.5">LIGAÇÃO</button>
                                    <button id="se-tool-erase" onclick="setEditorTool('erase')" class="dos-btn py-1.5">APAGAR</button>
                                </div>
                            </div>
                            <div class="dos-border p-2">
                                <div class="font-bold mb-1 opacity-80">ELEMENTO</div>
                                <div id="se-element-palette" class="flex flex-wrap gap-1 max-w-[220px]"></div>
                                <div class="flex gap-1 mt-1">
                                    <input id="se-custom-el" type="text" placeholder="Outro (ex: Na)" class="dos-input p-1 w-24">
                                    <button onclick="setCustomElement()" class="dos-btn py-1.5">USAR</button>
                                </div>
                                <div id="se-custom-el-error" class="text-red-500 text-[10px] mt-1" role="alert" aria-live="polite"></div>
                            </div>
                            <div class="dos-border p-2">
                                <div class="font-bold mb-1 opacity-80">AÇÕES</div>
                                <div class="flex gap-1 flex-wrap">
                                    <button onclick="undoEditor()" class="dos-btn py-1.5">DESFAZER</button>
                                    <button onclick="clearEditor()" class="dos-btn py-1.5">LIMPAR</button>
                                    <button onclick="exportEditorPNG()" class="dos-btn py-1.5">EXPORTAR PNG</button>
                                </div>
                            </div>
                        </div>

                        <canvas id="structure-canvas" class="dos-border w-full" height="380" style="cursor:crosshair; touch-action:none;"></canvas>

                        <div class="dos-border p-3 text-sm mt-2 flex flex-wrap gap-4 justify-between items-center">
                            <div>
                                <div>Fórmula molecular (Hill): <span id="se-formula" class="font-bold text-base">—</span></div>
                                <div>Massa molar estimada: <span id="se-mass" class="font-bold">—</span> g/mol</div>
                            </div>
                            <button onclick="sendEditorFormulaToMolarMass()" class="dos-btn">→ ENVIAR PARA MÓDULO 3 (MASSA MOLAR)</button>
                        </div>
                        <div class="text-[10px] opacity-50 mt-2">Os hidrogênios implícitos são calculados por valência padrão (C=4, N=3, O=2, S=2, P=3, halogênios=1, B=3, Si=4). É possível também inserir átomos de H explicitamente. Esta ferramenta desenha um esboço estrutural simplificado (grafo de conectividade 2D) para fins didáticos — não é um editor certificado de química nem substitui software profissional para submissão de dados de pesquisa.</div>
                    `;
                    initStructureEditor();
                    break;
                case 22:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">22. [SIM] SIMULAÇÃO MOLECULAR — TEORIA CINÉTICA DOS GASES</div>
                        <p class="text-xs mb-2 opacity-80">Simulação de partículas em 2D: as velocidades iniciais de cada molécula são amostradas da <strong>distribuição de Maxwell-Boltzmann</strong> a partir da temperatura e da massa molar escolhidas. As colisões entre partículas (e com as paredes) são perfeitamente elásticas, conservando a energia cinética total do sistema — por isso a "temperatura instantânea" calculada a partir da energia cinética média deve permanecer próxima do valor definido, oscilando apenas pela flutuação estatística natural de um número finito de partículas.</p>

                        <div class="flex flex-wrap gap-3 mb-3 items-end text-xs">
                            <div class="dos-border p-2">
                                <label class="block opacity-80 mb-1">GÁS</label>
                                <select id="sim-gas" class="dos-input p-1 bg-black">
                                    <option value="2.016">H₂ — Hidrogênio (2,02 g/mol)</option>
                                    <option value="4.003">He — Hélio (4,00 g/mol)</option>
                                    <option value="16.04">CH₄ — Metano (16,04 g/mol)</option>
                                    <option value="18.02">H₂O — Vapor d'água (18,02 g/mol)</option>
                                    <option value="28.01" selected>N₂ — Nitrogênio (28,01 g/mol)</option>
                                    <option value="32.00">O₂ — Oxigênio (32,00 g/mol)</option>
                                    <option value="39.95">Ar — Argônio (39,95 g/mol)</option>
                                    <option value="44.01">CO₂ — Dióxido de carbono (44,01 g/mol)</option>
                                    <option value="70.90">Cl₂ — Cloro (70,90 g/mol)</option>
                                    <option value="custom">Personalizado...</option>
                                </select>
                                <input id="sim-gas-custom" type="number" step="any" min="1" max="300" placeholder="g/mol" class="dos-input p-1 w-20 mt-1 hidden">
                            </div>
                            <div class="dos-border p-2">
                                <label class="block opacity-80 mb-1">TEMPERATURA: <span id="sim-temp-label" class="font-bold">298 K</span></label>
                                <input id="sim-temp" type="range" min="50" max="1500" step="1" value="298" class="w-40">
                            </div>
                            <div class="dos-border p-2">
                                <label class="block opacity-80 mb-1">Nº DE PARTÍCULAS: <span id="sim-n-label" class="font-bold">60</span></label>
                                <input id="sim-n" type="range" min="10" max="120" step="1" value="60" class="w-40">
                            </div>
                            <div class="dos-border p-2 flex gap-1">
                                <button id="sim-toggle-btn" onclick="toggleSim()" class="dos-btn">PAUSAR</button>
                                <button onclick="resetSim()" class="dos-btn">REINICIAR</button>
                            </div>
                        </div>

                        <canvas id="sim-canvas" class="dos-border w-full" height="300"></canvas>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            <div class="dos-border p-3 text-sm">
                                <div class="font-bold mb-1 opacity-90">LEITURAS EM TEMPO REAL</div>
                                <div>v<sub>rms</sub> (simulação, 2D): <span id="sim-vrms-sim" class="font-bold">—</span> m/s</div>
                                <div>v<sub>rms</sub> (fórmula clássica 3D, √(3RT/M)): <span id="sim-vrms-theory" class="font-bold">—</span> m/s</div>
                                <div>Temperatura instantânea (via energia cinética): <span id="sim-tinst" class="font-bold">—</span> K</div>
                            </div>
                            <div>
                                <div class="text-[10px] opacity-70 mb-1">Histograma de velocidades (barras = simulação, linha = distribuição de Maxwell-Boltzmann 2D teórica)</div>
                                <canvas id="sim-hist-canvas" class="dos-border w-full" height="110"></canvas>
                            </div>
                        </div>
                        <div class="text-[10px] opacity-50 mt-2">Nota: por limitação de tela, a velocidade de deslocamento exibida na animação usa uma escala visual fixa (não é 1:1 com metros/segundo reais) — moléculas mais pesadas ou mais frias sempre aparecerão proporcionalmente mais lentas que moléculas mais leves ou mais quentes, mas para o valor numérico real use os campos de v<sub>rms</sub> acima. Simulação 2D simplificada (esferas rígidas, colisões elásticas) para fins didáticos.</div>
                    `;
                    initMolSim();
                    break;
                case 23:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">23. [LAB] EXPERIMENTOS GUIADOS (LABORATÓRIO VIRTUAL)</div>
                        <p class="text-xs mb-3 opacity-80">Diferente das calculadoras dos outros módulos, aqui você conduz um experimento passo a passo: prepara a bancada, adiciona reagente aos poucos, observa e registra o que acontece — e só no final descobre o quanto sua leitura experimental chegou perto do valor teórico. No fim, um relatório pronto para imprimir ou salvar como PDF.</p>
                        <div id="ge-content"></div>
                    `;
                    geInit();
                    break;
                case 24:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">24. [LIV] FUNDAMENTOS DE QUÍMICA GERAL (GUIA DE ESTUDOS)</div>
                        <p class="text-xs mb-3 opacity-80">15 tópicos de Química Geral, no formato de caderno de estudos: diagrama, notas resumidas, fórmula-chave, macete para lembrar, dois exemplos resolvidos, glossário e um mini-quiz de 5 perguntas (ordem embaralhada a cada tentativa) — para aproveitar melhor as ferramentas mais avançadas do site. Seu progresso fica salvo entre sessões.</p>
                        <div id="gc-content"></div>
                    `;
                    gcInit();
                    break;
                case 25:
                    screen.innerHTML = `
                        <div class="text-xl font-bold border-b border-current pb-1 mb-3">25. [DET] DETETIVE QUÍMICO — IDENTIFICAÇÃO DE CÁTIONS</div>
                        <p class="text-xs mb-3 opacity-80">Baseado em química analítica qualitativa de verdade: cor da solução, teste de chama e reações de precipitação com quatro reagentes clássicos (NaOH, Na₂CO₃, H₂SO₄ diluído, HCl diluído). Rode o mínimo de testes necessário, registre sua conclusão, e veja a ficha completa do caso — inclusive quando erra.</p>
                        <div id="cd-content"></div>
                    `;
                    cdInit();
                    break;
            }
            screenAnimateIn();
        }
