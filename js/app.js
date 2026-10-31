        /* ==========================================================================
           10. EVENTOS GLOBAIS E CLI
           ========================================================================== */
        let cliHistory = [];
        let cliHistoryIndex = -1;

        document.getElementById("cli-input").addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const raw = e.target.value.trim();
                const cmd = raw.toLowerCase();
                if (raw) { cliHistory.push(raw); cliHistoryIndex = cliHistory.length; }

                if (["exit", "home", "menu", "cls", "clear"].includes(cmd)) renderHome();
                else if (["help", "ajuda", "?"].includes(cmd)) showHelp();
                else if (cmd === "test" || cmd === "testes") { renderTool(20); runTestSuite(); }
                else if (cmd === "estrutura" || cmd === "editor") { renderTool(21); }
                else if (cmd === "simulacao" || cmd === "simulação" || cmd === "md") { renderTool(22); }
                else if (cmd === "experimento" || cmd === "laboratorio" || cmd === "lab") { renderTool(23); }
                else if (cmd === "estudar" || cmd === "guia") { renderTool(24); }
                else if (cmd === "formula" || cmd === "fórmula") { renderTool(27); }
                else if (cmd === "ligacao" || cmd === "ligação" || cmd === "en") { renderTool(31); }
                else if (cmd === "pilha" || cmd === "pilhas" || cmd === "galvanica" || cmd === "galvânica" || cmd === "eletroquimica" || cmd === "eletroquímica") { renderTool(32); }
                else if (cmd === "eletrolise" || cmd === "eletrólise" || cmd === "faraday") { renderTool(33); }
                else if (cmd === "previsao" || cmd === "previsão" || cmd === "descarga") { renderTool(34); }
                else if (cmd === "concentracao" || cmd === "concentração" || cmd === "reagente") { renderTool(35); }
                else if (cmd === "referencia" || cmd === "referência" || cmd === "indicador") { renderTool(36); }
                else if (cmd === "coligativas" || cmd === "crioscopia") { renderTool(37); }
                else if (cmd === "arrhenius" || cmd === "vanthoff" || cmd === "temperatura") { renderTool(38); }
                else if (cmd === "ph" || cmd === "phuniversal" || cmd === "ph-universal") { renderTool(39); }
                else if (cmd === "calibracao" || cmd === "calibração" || cmd === "estatistica" || cmd === "estatística") { renderTool(40); }
                else if (cmd === "vdw" || cmd === "gasesreais" || cmd === "vapor") { renderTool(41); }
                else if (cmd === "radioatividade" || cmd === "decaimento" || cmd === "nuclear") { renderTool(42); }
                else if (cmd === "incerteza") { renderTool(43); }
                else if (cmd === "cromatografia" || cmd === "hplc") { renderTool(44); }
                else if (cmd === "configuracao" || cmd === "configuração" || cmd === "cfg") { renderTool(45); }
                else if (cmd === "energialigacao") { renderTool(46); }
                else if (cmd === "receita") { renderTool(47); }
                else if (cmd === "caderno") { renderTool(48); }
                else if (cmd === "revisao" || cmd === "revisão") { renderTool(49); }
                else if (cmd === "ordem") { renderTool(50); }
                else if (cmd === "eletrodo") { renderTool(51); }
                else if (cmd === "diluicoes" || cmd === "diluições" || cmd === "padroes" || cmd === "padrões") { renderTool(52); }
                else if (cmd === "padronizacao" || cmd === "padronização") { renderTool(53); }
                else if (cmd === "isotopos" || cmd === "isótopos") { renderTool(54); }
                else if (cmd === "hess") { renderTool(55); }
                else if (cmd === "cristal" || cmd === "cristais") { renderTool(56); }
                else if (cmd === "aminoacido" || cmd === "aminoácido" || cmd === "aminoacidos" || cmd === "aminoácidos") { renderTool(57); }
                else if (cmd === "maxwell" || cmd === "velocidades") { renderTool(58); }
                else if (cmd === "nox" || cmd === "oxidacao" || cmd === "oxidação") { renderTool(30); }
                else if (cmd === "mol") { renderTool(29); }
                else if (cmd === "quiz") { renderTool(28); }
                else if (cmd === "conversor" || cmd === "conv") { renderTool(26); }
                else if (cmd === "detetive" || cmd === "caso") { renderTool(25); }
                else if (/^\d+$/.test(cmd) && +cmd >= 1 && +cmd <= 58) renderTool(parseInt(cmd, 10));
                else if (cmd.startsWith("pubchem ")) { renderTool(2); document.getElementById("pubchem-input").value = cmd.substring(8); runPubChemSearch(); }
                else if (cmd.startsWith("balance ")) { renderTool(1); document.getElementById("eq-input").value = raw.substring(8); runBalancer(); }
                else if (cmd.startsWith("resolve ")) { renderTool(13); document.getElementById("resolver-input").value = raw.substring(8); runNameResolver(); }
                e.target.value = "";
                return;
            }

            // Histórico de comandos (como um shell real): ↑/↓ navegam comandos
            // anteriores digitados nesta sessão, sem precisar redigitar tudo.
            if (e.key === "ArrowUp") {
                if (!cliHistory.length) return;
                e.preventDefault();
                cliHistoryIndex = Math.max(0, cliHistoryIndex - 1);
                e.target.value = cliHistory[cliHistoryIndex] || "";
                requestAnimationFrame(() => e.target.setSelectionRange(e.target.value.length, e.target.value.length));
            } else if (e.key === "ArrowDown") {
                if (!cliHistory.length) return;
                e.preventDefault();
                cliHistoryIndex = Math.min(cliHistory.length, cliHistoryIndex + 1);
                e.target.value = cliHistory[cliHistoryIndex] || "";
            }
        });

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                if (isModalOpen()) closeModal();
                else renderHome();
            }
            if (e.key === "F1") { e.preventDefault(); showHelp(); }
            if (e.key === "F2") { e.preventDefault(); renderTool(2); }
            if (e.key === "F3") { e.preventDefault(); renderTool(1); }
            if (e.key === "F4") { e.preventDefault(); renderTool(20); runTestSuite(); }
        });

        // Boot Start — restaura tema/som/CRT salvos ANTES de desenhar a tela
        // inicial, para não haver "flash" do tema padrão seguido de troca.
        if (typeof applyStoredPrefs === "function") applyStoredPrefs();
        if (typeof updateConnectivityBadge === "function") updateConnectivityBadge();
        renderHome();
        if (typeof maybeShowOnboardingTour === "function") maybeShowOnboardingTour();
