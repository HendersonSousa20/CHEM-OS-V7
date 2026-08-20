        /* ==========================================================================
           10. EVENTOS GLOBAIS E CLI
           ========================================================================== */
        document.getElementById("cli-input").addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const cmd = e.target.value.trim().toLowerCase();
                if (["exit", "home", "menu", "cls", "clear"].includes(cmd)) renderHome();
                else if (["help", "ajuda", "?"].includes(cmd)) showHelp();
                else if (cmd === "test" || cmd === "testes") { renderTool(20); runTestSuite(); }
                else if (cmd === "estrutura" || cmd === "editor") { renderTool(21); }
                else if (cmd === "simulacao" || cmd === "simulação" || cmd === "md") { renderTool(22); }
                else if (cmd === "experimento" || cmd === "laboratorio" || cmd === "lab") { renderTool(23); }
                else if (!isNaN(cmd) && cmd >= 1 && cmd <= 23) renderTool(parseInt(cmd));
                else if (cmd.startsWith("pubchem ")) { renderTool(2); document.getElementById("pubchem-input").value = cmd.substring(8); runPubChemSearch(); }
                else if (cmd.startsWith("balance ")) { renderTool(1); document.getElementById("eq-input").value = e.target.value.trim().substring(8); runBalancer(); }
                else if (cmd.startsWith("resolve ")) { renderTool(13); document.getElementById("resolver-input").value = e.target.value.trim().substring(8); runNameResolver(); }
                e.target.value = "";
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

        // Boot Start
        renderHome();
