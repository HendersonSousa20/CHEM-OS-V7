        /* ==========================================================================
           3B. NOVAS APIs — OPSIN (nomenclatura IUPAC), CACTUS (identificadores),
                WIKIPEDIA (contexto científico)
           Usa cachedFetchJSON/cachedFetchText (js/core/api-utils.js): cache leve
           em sessionStorage + timeout de 15s em toda chamada.
           ========================================================================== */
        async function fetchOpsinData(name) {
            const url = `https://opsin.ch.cam.ac.uk/opsin/${encodeURIComponent(name)}.json`;
            const result = await cachedFetchJSON(url);
            if (!result.ok) throw new Error("OPSIN não respondeu (serviço fora do ar ou nome inválido).");
            const data = result.data;
            if (data.status !== "SUCCESS") throw new Error(data.message || "OPSIN não interpretou este nome IUPAC.");
            return {
                smiles: data.smiles || null,
                inchi: data.stdinchi || null,
                inchikey: data.stdinchikey || null
            };
        }

        async function fetchCactusData(identifier, representation) {
            const url = `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(identifier)}/${representation}`;
            const result = await cachedFetchText(url);
            if (!result.ok) throw new Error(`CACTUS: '${representation}' não encontrado para este identificador.`);
            return result.data.trim();
        }

        async function fetchWikiSummary(title) {
            try {
                const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
                const result = await cachedFetchJSON(url);
                if (!result.ok) return null;
                return result.data.extract || null;
            } catch(e) { return null; }
        }
