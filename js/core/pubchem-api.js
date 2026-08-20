        /* ==========================================================================
           3. INTEGRAÇÃO DE APIs — PUBCHEM (composto + elementos)
           Usa cachedFetchJSON (js/core/api-utils.js): respostas ficam em cache
           por 30 min em sessionStorage, e toda chamada tem timeout de 15s.
           ========================================================================== */
        async function fetchPubChemData(query) {
            try {
                const urlCID = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/cids/JSON`;
                const cidResult = await cachedFetchJSON(urlCID);
                if (!cidResult.ok) {
                    if (cidResult.status === 404) {
                        throw new Error(`Composto "${query}" não encontrado no banco de dados PubChem. Verifique a grafia do nome (em inglês costuma funcionar melhor).`);
                    }
                    throw new Error(`PubChem retornou um erro (HTTP ${cidResult.status}). Tente novamente em instantes.`);
                }
                const cid = cidResult.data.IdentifierList.CID[0];

                const safeProps = "Title,MolecularFormula,MolecularWeight,CanonicalSMILES,InChIKey";
                const urlProps = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/${safeProps}/JSON`;
                const propsResult = await cachedFetchJSON(urlProps);

                let compoundData = { CID: cid, Title: query.toUpperCase() };
                if (propsResult.ok) {
                    compoundData = { ...propsResult.data.PropertyTable.Properties[0], CID: cid, _fromCache: propsResult.fromCache };
                }
                return compoundData;
            } catch(error) {
                console.error("PubChem Fetch Error:", error);
                throw error;
            }
        }

        async function fetchPubChemPugView(cid) {
            try {
                const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON`;
                const result = await cachedFetchJSON(url);
                if (!result.ok) return null;
                const json = result.data;

                let results = { hazards: [], density: null, meltingPoint: null, boilingPoint: null, pka: null };

                function searchSections(section) {
                    if (!section) return;
                    const heading = section.TOCHeading || '';

                    if (heading === 'GHS Classification' && section.Information) {
                        section.Information.forEach(info => {
                            if (info.Name === 'GHS Hazard Statements' && info.Value && info.Value.StringWithMarkup) {
                                info.Value.StringWithMarkup.forEach(s => {
                                    if(s.String && !results.hazards.includes(s.String)) results.hazards.push(s.String);
                                });
                            }
                        });
                    }
                    if (heading.includes('Density') && section.Information) {
                        let val = section.Information[0]?.Value?.StringWithMarkup?.[0]?.String;
                        if (val && !results.density) results.density = val;
                    }
                    if (heading.includes('Melting Point') && section.Information) {
                        let val = section.Information[0]?.Value?.StringWithMarkup?.[0]?.String;
                        if(val && !results.meltingPoint) results.meltingPoint = val;
                    }
                    if (heading.includes('Boiling Point') && section.Information) {
                        let val = section.Information[0]?.Value?.StringWithMarkup?.[0]?.String;
                        if(val && !results.boilingPoint) results.boilingPoint = val;
                    }
                    if ((heading.includes('pKa') || heading.includes('Dissociation Constants')) && section.Information) {
                        let val = section.Information[0]?.Value?.StringWithMarkup?.[0]?.String;
                        if(val && !results.pka) results.pka = val;
                    }
                    if (section.Section) section.Section.forEach(searchSections);
                }

                if (json.Record && json.Record.Section) { json.Record.Section.forEach(searchSections); }
                return results;
            } catch(e) {
                console.error("PUG-VIEW Error:", e);
                return null;
            }
        }

        async function fetchElementApiData(atomicNum) {
            try {
                const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON`;
                const result = await cachedFetchJSON(url);
                if (!result.ok) throw new Error("Falha ao baixar tabela periódica do servidor.");

                const cols = result.data.Table.Columns.Column;
                const rows = result.data.Table.Row;
                const elementRow = rows.find(r => String(r.Cell[0]) === String(atomicNum));
                if (!elementRow) return null;

                let data = {};
                cols.forEach((colName, idx) => { data[colName] = elementRow.Cell[idx]; });
                return data;
            } catch(e) {
                console.error("Elements API Error:", e);
                return null;
            }
        }
