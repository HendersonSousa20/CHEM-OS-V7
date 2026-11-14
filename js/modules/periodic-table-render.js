        /* ==========================================================================
           7. TABELA PERIÓDICA — RENDER RESPONSIVO
           ========================================================================== */
        function renderPTableGrid(filter = "") {
            const grid = document.getElementById("ptable-grid");
            if (!grid) return;
            const isMobile = window.innerWidth < 640;

            if (isMobile) {
                const matches = ELEMENTS_DB.filter(e =>
                    !filter || chemMatch(e.name, filter) || e.sym.toLowerCase().includes(filter) || String(e.num) === filter
                );
                const list = filter ? matches : ELEMENTS_DB.slice(0, 20);

                let html = '<div class="grid grid-cols-4 gap-2 text-center text-xs">';
                list.forEach(e => {
                    html += `<div onclick="showElementDetails(${e.num})" class="dos-border p-2 cursor-pointer hover:bg-current hover:text-black">
                        <div class="text-[10px] opacity-75">${e.num}</div>
                        <div class="font-bold text-base">${e.sym}</div>
                    </div>`;
                });
                html += '</div>';
                if (!filter) html += `<div class="text-[10px] opacity-60 mt-2">Mostrando 20 de 118. Use o filtro para buscar um elemento específico.</div>`;
                else if (list.length === 0) html = `<div class="text-xs text-yellow-400">Nenhum elemento encontrado para "${escapeHTML(filter)}".</div>`;
                grid.innerHTML = html;
                return;
            }

            let html = '<div class="grid grid-cols-18 gap-1 min-w-[700px] text-center text-xs">';
            ELEMENTS_DB.forEach(e => {
                const match = !filter || chemMatch(e.name, filter) || e.sym.toLowerCase().includes(filter) || String(e.num) === filter;
                const opacity = match ? 'opacity-100' : 'opacity-20';
                html += `<div onclick="showElementDetails(${e.num})" class="dos-border p-1 cursor-pointer hover:bg-current hover:text-black ${opacity}">
                    <div class="text-[10px] opacity-75">${e.num}</div>
                    <div class="font-bold text-sm">${e.sym}</div>
                </div>`;
            });
            html += '</div>';
            grid.innerHTML = html;
        }

        function filterPTable() {
            renderPTableGrid(document.getElementById("ptable-search").value.toLowerCase().trim());
        }

        let ptableResizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(ptableResizeTimeout);
            ptableResizeTimeout = setTimeout(() => {
                const searchEl = document.getElementById("ptable-search");
                if (searchEl) renderPTableGrid(searchEl.value.toLowerCase().trim());
            }, 200);
        });

        async function showElementDetails(num) {
            const el = ELEMENTS_DB.find(e => e.num === num);
            if (!el) return;

            const detailDiv = document.getElementById("elem-detail");
            detailDiv.innerHTML = `<span class="animate-pulse">Baixando matriz JSON da Tabela Periódica PubChem...</span>`;
            playBeep(900, 0.03);

            const apiData = await fetchElementApiData(num);

            let ext = "";
            if (apiData) {
                ext = `
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 pt-2 border-t border-current text-xs">
                        <div>Eletronegatividade: <strong>${apiData.Electronegativity || 'N/A'}</strong></div>
                        <div>Raio Atômico: <strong>${apiData.AtomicRadius || 'N/A'} pm</strong></div>
                        <div>Config. Elétrons: <strong>${apiData.ElectronConfiguration || 'N/A'}</strong></div>
                        <div>Ionização: <strong>${apiData.IonizationEnergy || 'N/A'} eV</strong></div>
                        <div>Oxidação: <strong>${apiData.OxidationStates || 'N/A'}</strong></div>
                        <div>Densidade: <strong>${apiData.Density || 'N/A'}</strong></div>
                    </div>
                `;
            } else {
                ext = `<div class="mt-2 text-yellow-400 text-xs">Não foi possível baixar os dados avançados (eletronegatividade, raio atômico etc.) agora — verifique sua conexão com a internet e tente novamente. Os dados básicos acima (massa, grupo, período) vêm da base local e continuam disponíveis offline.</div>`;
            }

            detailDiv.innerHTML = `
                <div class="text-sm font-bold border-b border-current pb-1 mb-1">${el.name} (${el.sym}) — Atômico #${el.num}</div>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div>Massa: ${el.mass} u</div><div>Grupo: ${el.group} | Período: ${el.period}</div><div>Categoria: ${el.cat}</div>
                </div>
                ${ext}
            `;
        }
