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
                else if (cmd === "nox" || cmd === "oxidacao" || cmd === "oxidação") { renderTool(30); }
                else if (cmd === "mol") { renderTool(29); }
                else if (cmd === "quiz") { renderTool(28); }
                else if (cmd === "conversor" || cmd === "conv") { renderTool(26); }
                else if (cmd === "detetive" || cmd === "caso") { renderTool(25); }
                else if (!isNaN(cmd) && cmd >= 1 && cmd <= 31) renderTool(parseInt(cmd));
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
