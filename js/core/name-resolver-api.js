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

        // Cadeia de fallback para nome → estrutura. O OPSIN é o parser dedicado a
        // nomenclatura IUPAC sistemática e o mais confiável para isso, mas é um
        // serviço acadêmico único (sem réplica) que costuma ficar indisponível
        // ou lento — sem alternativa, qualquer instabilidade dele derruba todo o
        // Módulo 13. Se o OPSIN falhar (rede, timeout ou não reconhecer o nome),
        // tenta o CACTUS e, por fim, o buscador de sinônimos do PubChem — ambos
        // resolvem uma fração razoável dos mesmos nomes, mesmo não sendo parsers
        // de IUPAC dedicados. Sempre retorna qual fonte respondeu, para que a
        // interface seja transparente sobre a procedência do resultado.
        async function resolveNameToStructure(name) {
            // Checagem única e antecipada: sem isso, as 3 tentativas abaixo ainda
            // falhariam rápido (graças ao fetchWithTimeout), mas o aluno veria a
            // mesma mensagem "sem conexão" repetida três vezes na lista de erros.
            if (typeof navigator !== "undefined" && navigator.onLine === false) {
                const err = new Error("Sem conexão com a internet — verifique sua rede e tente novamente.");
                err.isOffline = true;
                err.attempts = [{ source: "Conexão", message: err.message }];
                throw err;
            }

            const attempts = [];

            try {
                const opsin = await fetchOpsinData(name);
                return { source: "OPSIN", smiles: opsin.smiles, inchikey: opsin.inchikey, inchi: opsin.inchi };
            } catch (e) {
                attempts.push({ source: "OPSIN", message: e.message });
            }

            try {
                const smilesRaw = await fetchCactusData(name, "smiles");
                let inchikey = null;
                try {
                    const inchikeyRaw = await fetchCactusData(name, "stdinchikey");
                    inchikey = inchikeyRaw.split('\n')[0].replace(/^InChIKey=/, '');
                } catch (e2) { /* InChIKey é complementar — segue sem ele se falhar */ }
                return { source: "CACTUS", smiles: smilesRaw.split('\n')[0], inchikey, inchi: null };
            } catch (e) {
                attempts.push({ source: "CACTUS", message: e.message });
            }

            try {
                const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/CanonicalSMILES,InChIKey/JSON`;
                const result = await cachedFetchJSON(url);
                if (!result.ok) throw new Error(`PubChem retornou HTTP ${result.status}.`);
                const props = result.data.PropertyTable.Properties[0];
                return { source: "PubChem", smiles: props.CanonicalSMILES || null, inchikey: props.InChIKey || null, inchi: null };
            } catch (e) {
                attempts.push({ source: "PubChem", message: e.message });
            }

            const err = new Error("Nenhum dos três serviços disponíveis (OPSIN, CACTUS, PubChem) conseguiu interpretar este nome.");
            err.attempts = attempts;
            throw err;
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
