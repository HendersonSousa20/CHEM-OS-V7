        /* ==========================================================================
           15. MÓDULO 24 — FUNDAMENTOS DE QUÍMICA GERAL (GUIA DE ESTUDOS)
           Guia de referência com conteúdo ORIGINAL (redigido para o CHEM.OS, não
           copiado de nenhum livro específico), no formato "caderno de estudos":
           notas resumidas, fórmula-chave, mnemônico, dois exemplos resolvidos e
           um mini-quiz de 5 perguntas (ordem embaralhada a cada tentativa) por
           tópico — cobrindo os fundamentos que os módulos 1 a 23 pressupõem.
           Cada tópico linka direto para o módulo prático correspondente, tem um
           mini-glossário próprio (agregado num glossário geral pesquisável) e o
           progresso de revisão fica salvo em localStorage entre sessões.

           Convenção visual: ícones são tags entre colchetes (ex: "[MOL]"), no
           mesmo espírito retrô do resto do app — nunca emoji colorido.
           ========================================================================== */

        const GC_SVG = {
            estados: `<svg viewBox="0 0 300 90" class="w-full" style="max-width:340px" height="90">
                <rect x="4" y="4" width="88" height="82" fill="none" stroke="var(--text-color)" stroke-width="1.5"/>
                <text x="48" y="16" text-anchor="middle" font-size="9" fill="var(--text-color)">SÓLIDO</text>
                ${[0,1,2].map(r => [0,1,2].map(c => `<circle cx="${20+c*28}" cy="${34+r*20}" r="4" fill="var(--text-color)"/>`).join('')).join('')}
                <rect x="106" y="4" width="88" height="82" fill="none" stroke="var(--text-color)" stroke-width="1.5"/>
                <text x="150" y="16" text-anchor="middle" font-size="9" fill="var(--text-color)">LÍQUIDO</text>
                <circle cx="128" cy="36" r="4" fill="var(--text-color)"/><circle cx="140" cy="44" r="4" fill="var(--text-color)"/><circle cx="122" cy="52" r="4" fill="var(--text-color)"/>
                <circle cx="152" cy="30" r="4" fill="var(--text-color)"/><circle cx="160" cy="50" r="4" fill="var(--text-color)"/><circle cx="138" cy="62" r="4" fill="var(--text-color)"/>
                <circle cx="170" cy="40" r="4" fill="var(--text-color)"/><circle cx="126" cy="68" r="4" fill="var(--text-color)"/><circle cx="158" cy="70" r="4" fill="var(--text-color)"/>
                <rect x="208" y="4" width="88" height="82" fill="none" stroke="var(--text-color)" stroke-width="1.5"/>
                <text x="252" y="16" text-anchor="middle" font-size="9" fill="var(--text-color)">GÁS</text>
                <circle cx="222" cy="28" r="3.5" fill="var(--text-color)"/><circle cx="270" cy="22" r="3.5" fill="var(--text-color)"/><circle cx="290" cy="55" r="3.5" fill="var(--text-color)"/>
                <circle cx="240" cy="70" r="3.5" fill="var(--text-color)"/><circle cx="216" cy="60" r="3.5" fill="var(--text-color)"/><circle cx="260" cy="45" r="3.5" fill="var(--text-color)"/>
                <circle cx="284" cy="78" r="3.5" fill="var(--text-color)"/><circle cx="248" cy="30" r="3.5" fill="var(--text-color)"/>
            </svg>`,
            atomo: `<svg viewBox="0 0 200 130" class="w-full" style="max-width:260px" height="130">
                <circle cx="100" cy="65" r="45" fill="none" stroke="var(--text-color)" stroke-width="1" opacity="0.5"/>
                <ellipse cx="100" cy="65" rx="80" ry="30" fill="none" stroke="var(--text-color)" stroke-width="1" opacity="0.5" transform="rotate(20 100 65)"/>
                <ellipse cx="100" cy="65" rx="80" ry="30" fill="none" stroke="var(--text-color)" stroke-width="1" opacity="0.5" transform="rotate(-20 100 65)"/>
                <circle cx="100" cy="65" r="10" fill="var(--text-color)"/>
                <text x="100" y="68" text-anchor="middle" font-size="7" fill="var(--bg-color)">p+n</text>
                <circle cx="145" cy="65" r="3.2" fill="var(--text-color)"/>
                <circle cx="55" cy="65" r="3.2" fill="var(--text-color)"/>
                <circle cx="128" cy="34" r="3.2" fill="var(--text-color)"/>
                <circle cx="72" cy="96" r="3.2" fill="var(--text-color)"/>
                <text x="100" y="122" text-anchor="middle" font-size="8" fill="var(--text-color)">núcleo (prótons+nêutrons) + elétrons nas camadas</text>
            </svg>`,
            tendencias: `<svg viewBox="0 0 220 130" class="w-full" style="max-width:260px" height="130">
                ${[0,1,2,3].map(r => [0,1,2,3,4,5].map(c => `<rect x="${10+c*33}" y="${10+r*24}" width="30" height="21" fill="none" stroke="var(--text-color)" stroke-width="1" opacity="0.6"/>`).join('')).join('')}
                <line x1="10" y1="118" x2="208" y2="10" stroke="var(--text-color)" stroke-width="1.5" marker-end="url(#gcArrow)"/>
                <defs><marker id="gcArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--text-color)"/></marker></defs>
                <text x="130" y="20" font-size="9" fill="var(--text-color)">eletronegatividade ↑</text>
                <text x="15" y="112" font-size="9" fill="var(--text-color)">raio atômico ↑</text>
            </svg>`
        };

        const GC_TOPICS = [
            {
                key: "materia", icon: "[MED]", title: "1. Matéria e Medidas",
                diagram: GC_SVG.estados,
                notes: [
                    "Matéria é tudo que tem massa e ocupa espaço. Classifica-se em <strong>substância pura</strong> (elemento ou composto) ou <strong>mistura</strong> (homogênea ou heterogênea).",
                    "Estados físicos: <strong>sólido</strong> (forma e volume fixos), <strong>líquido</strong> (volume fixo, forma variável), <strong>gasoso</strong> (forma e volume variáveis) — a diferença está na energia cinética média das partículas e nas forças entre elas.",
                    "<strong>Densidade</strong> é uma propriedade intensiva (não muda com o tamanho da amostra) — por isso serve para identificar substâncias.",
                    "Algarismos significativos indicam a precisão de uma medida: o resultado de um cálculo nunca pode ser \"mais preciso\" que o dado menos preciso usado nele."
                ],
                formula: "d = m / V",
                mnemonic: "\"Sólido segura a forma, líquido só segura o volume, gás não segura nada.\"",
                glossary: [
                    { term: "Propriedade intensiva", def: "Não depende da quantidade de amostra (ex: densidade, temperatura de fusão)." },
                    { term: "Propriedade extensiva", def: "Depende da quantidade de amostra (ex: massa, volume)." }
                ],
                examples: [
                    { problem: "Um bloco de metal tem massa 54 g e volume 20 cm³. Ele é provavelmente alumínio (densidade ≈ 2,7 g/cm³)?", solution: "d = 54 ÷ 20 = 2,7 g/cm³ → sim, bate com a densidade típica do alumínio." },
                    { problem: "Uma medida registrada como 2,50 g tem quantos algarismos significativos?", solution: "3 algarismos significativos (2, 5, 0) — o zero final após a vírgula é significativo porque foi deliberadamente medido, indicando uma balança com precisão de centésimos de grama." }
                ],
                links: [{ id: 3, label: "Módulo 3 · Massa Molar" }, { id: 7, label: "Módulo 7 · Tabela Periódica" }]
            },
            {
                key: "atomo", icon: "[ATM]", title: "2. Estrutura Atômica",
                diagram: GC_SVG.atomo,
                notes: [
                    "O átomo tem um <strong>núcleo</strong> (prótons + nêutrons) cercado por <strong>elétrons</strong> em regiões de probabilidade (orbitais).",
                    "<strong>Número atômico (Z)</strong> = nº de prótons — define o elemento. <strong>Número de massa (A)</strong> = prótons + nêutrons.",
                    "<strong>Isótopos</strong>: mesmo elemento (mesmo Z), número de nêutrons diferente → massa atômica diferente.",
                    "Os <strong>elétrons de valência</strong> (camada mais externa) determinam o comportamento químico — é por isso que elementos do mesmo grupo se parecem."
                ],
                formula: "A = Z + nêutrons",
                mnemonic: "\"PEN\": Prótons (+), Elétrons (−), Nêutrons (neutro).",
                glossary: [
                    { term: "Íon", def: "Átomo (ou grupo de átomos) que ganhou ou perdeu elétrons, ficando com carga elétrica." },
                    { term: "Isótopo", def: "Átomos do mesmo elemento com números diferentes de nêutrons." }
                ],
                examples: [
                    { problem: "O cloro-37 tem número atômico 17. Quantos prótons, elétrons e nêutrons tem esse átomo neutro?", solution: "Prótons = 17, elétrons = 17 (átomo neutro), nêutrons = 37 − 17 = 20." },
                    { problem: "O cloro tem massa atômica média 35,45 (não um número inteiro). Por quê, se prótons e nêutrons têm massa aproximadamente inteira?", solution: "A massa atômica da tabela periódica é uma MÉDIA PONDERADA dos isótopos naturais (Cl-35 e Cl-37), ponderada pela abundância de cada um na natureza — por isso não é um número inteiro." }
                ],
                links: [{ id: 7, label: "Módulo 7 · Tabela Periódica" }]
            },
            {
                key: "periodica", icon: "[TAB]", title: "3. Tabela Periódica e Tendências",
                diagram: GC_SVG.tendencias,
                notes: [
                    "Os elementos são organizados por número atômico crescente, em linhas (<strong>períodos</strong>) e colunas (<strong>grupos/famílias</strong>).",
                    "Elementos do mesmo grupo têm o mesmo número de elétrons de valência → propriedades químicas parecidas (ex: metais alcalinos, grupo 1, todos muito reativos).",
                    "Tendências periódicas: <strong>raio atômico</strong> diminui da esquerda p/ direita e aumenta de cima p/ baixo; <strong>eletronegatividade</strong> e <strong>energia de ionização</strong> fazem o oposto.",
                    "Metais (maioria à esquerda/centro) tendem a <em>perder</em> elétrons; não metais (à direita) tendem a <em>ganhar</em> elétrons."
                ],
                mnemonic: "Eletronegatividade \"sobe e vai pra direita\" — quanto mais perto do flúor, mais eletronegativo.",
                glossary: [
                    { term: "Período", def: "Linha horizontal da tabela periódica." },
                    { term: "Grupo/Família", def: "Coluna vertical da tabela periódica; mesmo nº de elétrons de valência." }
                ],
                examples: [
                    { problem: "Entre sódio (Na) e cloro (Cl), qual tem maior eletronegatividade?", solution: "Cloro — está mais à direita na tabela, no mesmo período do sódio." },
                    { problem: "Os gases nobres (grupo 18) são extremamente pouco reativos. Por quê?", solution: "Já têm a camada de valência completamente preenchida (configuração estável) — não precisam ganhar, perder ou compartilhar elétrons, por isso quase não formam compostos." }
                ],
                links: [{ id: 7, label: "Módulo 7 · Tabela Periódica Interativa" }]
            },
            {
                key: "ligacoes", icon: "[LIG]", title: "4. Ligações Químicas",
                notes: [
                    "<strong>Ligação iônica</strong>: transferência de elétrons, geralmente metal + não metal — forma íons que se atraem eletrostaticamente.",
                    "<strong>Ligação covalente</strong>: compartilhamento de elétrons, geralmente entre não metais. Pode ser polar (compartilhamento desigual) ou apolar (igual).",
                    "<strong>Ligação metálica</strong>: \"mar de elétrons\" deslocalizados entre cátions metálicos — explica condutividade elétrica e maleabilidade dos metais.",
                    "Estruturas de Lewis ajudam a visualizar elétrons de valência e prever a geometria molecular."
                ],
                mnemonic: "Regra prática (não é absoluta): \"metal + não metal = iônica; não metal + não metal = covalente\".",
                glossary: [
                    { term: "Eletronegatividade", def: "Tendência de um átomo atrair elétrons compartilhados numa ligação química." },
                    { term: "Estrutura de Lewis", def: "Diagrama que mostra os elétrons de valência e como são compartilhados/transferidos." }
                ],
                examples: [
                    { problem: "NaCl é formado por um metal (Na) e um não metal (Cl). Que tipo de ligação se espera?", solution: "Ligação iônica." },
                    { problem: "A ligação O-H na água é polar ou apolar? Por quê?", solution: "Polar — o oxigênio é bem mais eletronegativo que o hidrogênio, então os elétrons compartilhados ficam mais \"puxados\" para o lado do oxigênio, criando distribuição desigual de carga." }
                ],
                links: [{ id: 21, label: "Módulo 21 · Editor de Estruturas" }]
            },
            {
                key: "reacoes", icon: "[REA]", title: "5. Reações Químicas e Equações",
                notes: [
                    "Uma equação balanceada respeita a <strong>Lei da Conservação da Massa</strong>: o número de átomos de cada elemento deve ser igual nos reagentes e nos produtos.",
                    "Tipos comuns: <strong>síntese</strong> (A+B→AB), <strong>decomposição</strong> (AB→A+B), <strong>deslocamento simples</strong> (A+BC→AC+B), <strong>dupla troca</strong> (AB+CD→AD+CB), <strong>combustão</strong> (hidrocarboneto + O₂ → CO₂ + H₂O).",
                    "Os coeficientes de uma equação balanceada representam a proporção em <strong>MOLS</strong> entre as substâncias — não em massa ou volume diretamente."
                ],
                mnemonic: "\"SDDC\": Síntese, Decomposição, Deslocamento, dupla-troCa — mais Combustão como um quinto tipo especial.",
                glossary: [
                    { term: "Reagente", def: "Substância consumida numa reação química (fica do lado esquerdo da equação)." },
                    { term: "Produto", def: "Substância formada numa reação química (fica do lado direito da equação)." }
                ],
                examples: [
                    { problem: "Classifique: 2 H₂ + O₂ → 2 H₂O", solution: "Síntese (dois reagentes formam um único produto) — também é uma reação de combustão do hidrogênio." },
                    { problem: "Classifique: Zn + 2HCl → ZnCl₂ + H₂", solution: "Deslocamento simples — o zinco \"desloca\" o hidrogênio do ácido clorídrico, tomando seu lugar no composto." }
                ],
                links: [{ id: 1, label: "Módulo 1 · Balanciador de Equações" }]
            },
            {
                key: "mol", icon: "[MOL]", title: "6. O Mol e Estequiometria",
                notes: [
                    "Um <strong>mol</strong> é uma quantidade fixa de \"coisas\" (átomos, moléculas, íons) — o número de Avogadro, aproximadamente 6,022 × 10²³.",
                    "<strong>Massa molar</strong> (g/mol) conecta massa (o que se pesa na balança) com número de mols (o que entra nas proporções da equação balanceada).",
                    "<strong>Estequiometria</strong> = usar a equação balanceada como uma \"receita\" para calcular quantas mols/gramas de um reagente ou produto correspondem a outro.",
                    "<strong>Reagente limitante</strong>: o reagente que acaba primeiro e, por isso, determina a quantidade máxima de produto possível."
                ],
                formula: "n (mol) = massa (g) ÷ massa molar (g/mol)",
                mnemonic: "A equação balanceada é a receita de bolo da química: os coeficientes são as \"xícaras\" de cada ingrediente, sempre em mols.",
                glossary: [
                    { term: "Número de Avogadro", def: "6,022 × 10²³ — quantidade de entidades em exatamente 1 mol de qualquer substância." },
                    { term: "Rendimento", def: "Razão entre a quantidade de produto realmente obtida e a quantidade teoricamente prevista." }
                ],
                examples: [
                    { problem: "Quantos mols há em 36 g de água (H₂O, massa molar ≈ 18 g/mol)?", solution: "n = 36 ÷ 18 = 2 mol." },
                    { problem: "Quantas moléculas há em 0,5 mol de CO₂?", solution: "0,5 × 6,022×10²³ ≈ 3,011×10²³ moléculas." }
                ],
                links: [{ id: 3, label: "Módulo 3 · Massa Molar" }, { id: 8, label: "Módulo 8 · Estequiometria" }]
            },
            {
                key: "gases", icon: "[GAS]", title: "7. Gases e Estados da Matéria",
                notes: [
                    "A <strong>Teoria Cinética dos Gases</strong> modela um gás ideal como partículas puntiformes em movimento aleatório constante, com colisões perfeitamente elásticas.",
                    "<strong>Lei dos gases ideais</strong>: PV = nRT relaciona pressão, volume, quantidade de mols e temperatura — sempre em <strong>Kelvin</strong>.",
                    "Mudanças de estado (fusão, vaporização, condensação, solidificação, sublimação) envolvem troca de energia sem mudança de temperatura durante a transição (calor latente).",
                    "Temperatura em Kelvin nunca é negativa nos cálculos de gases — sempre converta °C + 273,15 antes de usar nas fórmulas."
                ],
                formula: "PV = nRT",
                mnemonic: "\"PV = nRT\": pense em cada letra como um ingrediente que precisa estar nas unidades certas antes de calcular.",
                glossary: [
                    { term: "STP", def: "Condições padrão de temperatura e pressão (0°C / 273,15 K e 1 atm)." },
                    { term: "Calor latente", def: "Energia trocada numa mudança de estado, sem variação de temperatura." }
                ],
                examples: [
                    { problem: "Que temperatura em Kelvin corresponde a 25°C (temperatura ambiente)?", solution: "25 + 273,15 = 298,15 K." },
                    { problem: "Se você aquece um gás em um recipiente de volume fixo (rígido), o que acontece com a pressão?", solution: "A pressão aumenta — mais energia térmica significa colisões mais frequentes e intensas contra as paredes, já que o volume não pode se expandir para compensar." }
                ],
                links: [{ id: 11, label: "Módulo 11 · Lei dos Gases" }, { id: 22, label: "Módulo 22 · Simulação Molecular" }]
            },
            {
                key: "solucoes", icon: "[SOL]", title: "8. Soluções e Concentração",
                notes: [
                    "<strong>Solução</strong> = mistura homogênea de <strong>soluto</strong> (o que se dissolve, em menor quantidade) e <strong>solvente</strong> (o que dissolve, em maior quantidade).",
                    "<strong>Molaridade</strong> (mol/L) é a forma mais comum de concentração em química: mols de soluto por litro de solução.",
                    "\"Semelhante dissolve semelhante\": substâncias polares tendem a se dissolver em solventes polares (como água); apolares dissolvem melhor em solventes apolares.",
                    "Diluir uma solução não muda a quantidade de mols de soluto, só o volume — por isso C₁V₁ = C₂V₂ funciona."
                ],
                formula: "C = n ÷ V   ·   C₁V₁ = C₂V₂ (diluição)",
                mnemonic: "\"Diluir é só adicionar água — o soluto que já está lá não desaparece, só fica mais espalhado.\"",
                glossary: [
                    { term: "Solução saturada", def: "Contém a quantidade máxima de soluto dissolvido naquela temperatura — o excesso não dissolve." },
                    { term: "Molaridade", def: "Concentração expressa em mols de soluto por litro de solução (mol/L)." }
                ],
                examples: [
                    { problem: "100 mL de uma solução 2 mol/L são diluídos para 0,5 mol/L. Qual o volume final?", solution: "C₁V₁=C₂V₂ → 2×100 = 0,5×V₂ → V₂ = 400 mL." },
                    { problem: "Quantos mols de NaCl há em 250 mL de uma solução 0,4 mol/L?", solution: "n = C × V = 0,4 × 0,250 = 0,1 mol." }
                ],
                links: [{ id: 4, label: "Módulo 4 · Preparo de Solução" }, { id: 5, label: "Módulo 5 · Diluição" }]
            },
            {
                key: "acidosbases", icon: "[PH]", title: "9. Ácidos, Bases e pH",
                notes: [
                    "Ácidos liberam H⁺ (ou aceitam pares de elétrons, na definição de Lewis); bases liberam OH⁻ (ou doam pares de elétrons).",
                    "A escala de <strong>pH</strong> vai de 0 a 14: pH &lt; 7 é ácido, pH = 7 é neutro, pH &gt; 7 é básico. Cada unidade de pH representa uma mudança de <strong>10×</strong> na concentração de H⁺.",
                    "Ácidos/bases <strong>fortes</strong> se ionizam completamente em água; <strong>fracos</strong> se ionizam só parcialmente (por isso têm uma constante de equilíbrio, Ka ou Kb).",
                    "Um <strong>indicador</strong> ácido-base muda de cor numa faixa específica de pH — é assim que se percebe visualmente quando uma titulação chega perto do ponto de equivalência."
                ],
                formula: "pH = −log[H⁺]",
                mnemonic: "\"pH baixo, ácido dá show\" — quanto menor o pH, mais forte o caráter ácido.",
                glossary: [
                    { term: "Ka", def: "Constante de dissociação de um ácido fraco — quanto maior, mais forte o ácido." },
                    { term: "Indicador ácido-base", def: "Substância que muda de cor numa faixa específica de pH." }
                ],
                examples: [
                    { problem: "Uma solução tem [H⁺] = 1 × 10⁻³ mol/L. Qual o pH?", solution: "pH = −log(10⁻³) = 3 → ácido." },
                    { problem: "A água pura, a 25°C, tem pH = 7. Qual o pOH dela nessa condição?", solution: "Como pH + pOH = 14 (a 25°C), pOH = 14 − 7 = 7 — água pura é neutra em ambas as escalas." }
                ],
                links: [{ id: 6, label: "Módulo 6 · pH de Ácido Fraco" }, { id: 23, label: "Módulo 23 · Laboratório Virtual" }]
            },
            {
                key: "termo", icon: "[TER]", title: "10. Termoquímica",
                notes: [
                    "Termoquímica estuda as trocas de calor que acompanham reações químicas e mudanças físicas.",
                    "Reação <strong>exotérmica</strong>: libera calor para o ambiente (ΔH negativo). Reação <strong>endotérmica</strong>: absorve calor do ambiente (ΔH positivo).",
                    "<strong>Entalpia (H)</strong> mede a energia de um sistema à pressão constante — não se mede H diretamente, só a variação ΔH de uma reação.",
                    "A <strong>Lei de Hess</strong> permite calcular o ΔH de uma reação somando os ΔH de outras reações conhecidas, já que a entalpia não depende do \"caminho\" percorrido."
                ],
                formula: "ΔH = H(produtos) − H(reagentes)",
                mnemonic: "\"EXOtérmico EXpulsa calor; ENDOtérmico ENgole calor.\"",
                glossary: [
                    { term: "Entalpia (H)", def: "Medida da energia de um sistema à pressão constante." },
                    { term: "Lei de Hess", def: "O ΔH total de uma reação não depende do caminho, só dos estados inicial e final." }
                ],
                examples: [
                    { problem: "Acender um palito de fósforo libera calor visivelmente. Essa reação é exotérmica ou endotérmica?", solution: "Exotérmica (libera calor, ΔH negativo)." },
                    { problem: "Ao formar novas ligações químicas (nos produtos), energia é liberada ou absorvida?", solution: "Liberada — formar ligações libera energia (o oposto de quebrá-las, que sempre absorve energia). O ΔH final é o saldo entre essas duas etapas." }
                ],
                links: [{ id: 9, label: "Módulo 9 · Termoquímica" }]
            },
            {
                key: "eletronica", icon: "[ELE]", title: "11. Configuração Eletrônica e Orbitais",
                notes: [
                    "Elétrons ocupam níveis de energia (camadas) e subníveis (orbitais s, p, d, f), cada um com capacidade máxima de elétrons.",
                    "A ordem de preenchimento segue o diagrama das diagonais (Linus Pauling): 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p...",
                    "<strong>Princípio de Exclusão de Pauli</strong>: cada orbital comporta no máximo 2 elétrons, com spins opostos.",
                    "<strong>Regra de Hund</strong>: elétrons ocupam orbitais de mesma energia um de cada vez (spins paralelos) antes de emparelhar."
                ],
                formula: "capacidade máxima por subnível: s=2, p=6, d=10, f=14",
                mnemonic: "\"SPDF\": a ordem crescente de subníveis — cada um \"cabe mais\" elétrons que o anterior.",
                glossary: [
                    { term: "Orbital", def: "Região do espaço com alta probabilidade de encontrar um elétron." },
                    { term: "Camada de valência", def: "O nível de energia mais externo ocupado por elétrons." }
                ],
                examples: [
                    { problem: "Escreva a configuração eletrônica do sódio (Z=11).", solution: "1s² 2s² 2p⁶ 3s¹ (2+2+6+1 = 11 elétrons)." },
                    { problem: "Quantos elétrons desemparelhados tem o átomo de nitrogênio (Z=7, configuração 1s²2s²2p³)?", solution: "No subnível 2p há 3 orbitais; pela regra de Hund, os 3 elétrons do 2p³ ocupam cada um um orbital diferente antes de emparelhar → 3 elétrons desemparelhados." }
                ],
                links: [{ id: 7, label: "Módulo 7 · Tabela Periódica" }]
            },
            {
                key: "nomenclatura", icon: "[NOM]", title: "12. Nomenclatura Química",
                notes: [
                    "Compostos iônicos binários: nome do ânion (terminação \"-eto\") + \"de\" + nome do cátion. Ex: NaCl = cloreto de sódio.",
                    "Para metais de valência variável (metais de transição), indica-se a carga do cátion com algarismo romano. Ex: Fe²⁺ = ferro(II); Fe³⁺ = ferro(III).",
                    "Ácidos sem oxigênio terminam em \"-ídrico\" (HCl = ácido clorídrico); ácidos com oxigênio terminam em \"-ico\" (maior nox) ou \"-oso\" (menor nox).",
                    "Compostos moleculares (entre não metais) usam prefixos gregos: mono, di, tri, tetra... Ex: CO₂ = dióxido de carbono."
                ],
                mnemonic: "\"Metal de carga variável leva número romano; não metal com não metal leva prefixo grego.\"",
                glossary: [
                    { term: "Cátion", def: "Íon com carga positiva (perdeu elétrons)." },
                    { term: "Ânion", def: "Íon com carga negativa (ganhou elétrons)." },
                    { term: "Nox", def: "Número de oxidação — carga que um átomo teria se a ligação fosse 100% iônica." }
                ],
                examples: [
                    { problem: "Qual o nome do composto formado por Ca²⁺ e Cl⁻ (CaCl₂)?", solution: "Cloreto de cálcio (cálcio não é metal de transição, não precisa de número romano)." },
                    { problem: "Qual a fórmula do óxido de ferro(III)?", solution: "Fe³⁺ com O²⁻ → para balancear as cargas: Fe₂O₃ (2×3+ = 6+, 3×2− = 6−)." }
                ],
                links: [{ id: 1, label: "Módulo 1 · Balanciador" }, { id: 13, label: "Módulo 13 · Nomenclatura IUPAC" }]
            },
            {
                key: "redox", icon: "[RED]", title: "13. Oxirredução (Redox)",
                notes: [
                    "<strong>Oxidação</strong> = perda de elétrons (aumento do nox). <strong>Redução</strong> = ganho de elétrons (diminuição do nox).",
                    "Agente <strong>oxidante</strong> causa a oxidação de outra espécie (e, ao fazer isso, ele mesmo se reduz). Agente <strong>redutor</strong> faz o oposto.",
                    "Numa reação redox, o número de elétrons perdidos pelo agente redutor é igual ao número de elétrons ganhos pelo agente oxidante.",
                    "Reações redox são a base de pilhas e baterias — o Módulo 12 usa a equação de Nernst para calcular o potencial dessas reações."
                ],
                mnemonic: "\"PERDEU = OXIDOU, GANHOU = REDUZIU.\"",
                glossary: [
                    { term: "Nox", def: "Número de oxidação — indica quantos elétrons um átomo \"ganhou\" ou \"perdeu\" em relação ao átomo neutro." },
                    { term: "Semirreação", def: "Metade de uma reação redox, mostrando só a oxidação ou só a redução separadamente." }
                ],
                examples: [
                    { problem: "No Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s), quem é oxidado e quem é reduzido?", solution: "Zn perde 2 elétrons (0→+2): é oxidado. Cu²⁺ ganha 2 elétrons (+2→0): é reduzido." },
                    { problem: "No mesmo exemplo, qual é o agente oxidante?", solution: "Cu²⁺ — é quem \"rouba\" os elétrons do zinco, causando sua oxidação (e, nesse processo, ele mesmo se reduz)." }
                ],
                links: [{ id: 12, label: "Módulo 12 · Nernst" }]
            },
            {
                key: "equilibrio", icon: "[EQL]", title: "14. Equilíbrio Químico e Le Chatelier",
                notes: [
                    "Muitas reações são reversíveis. O equilíbrio químico é atingido quando a velocidade da reação direta se iguala à da inversa (as concentrações param de mudar, mas não são necessariamente iguais).",
                    "A constante de equilíbrio (Kc) relaciona concentrações de produtos e reagentes no equilíbrio — Kc grande favorece produtos, Kc pequeno favorece reagentes.",
                    "<strong>Princípio de Le Chatelier</strong>: se um sistema em equilíbrio sofre uma perturbação, ele se desloca no sentido de minimizar essa perturbação.",
                    "Aumentar a concentração de um reagente desloca o equilíbrio para a direita; aumentar a temperatura desloca o equilíbrio no sentido endotérmico."
                ],
                formula: "Kc = [produtos] / [reagentes], cada um elevado ao seu coeficiente",
                mnemonic: "\"O sistema em equilíbrio é preguiçoso: sempre reage para ANULAR a mudança que você fez, nunca para reforçá-la.\"",
                glossary: [
                    { term: "Reação reversível", def: "Ocorre nos dois sentidos (direto e inverso) simultaneamente." },
                    { term: "Kc", def: "Constante de equilíbrio em termos de concentração molar." }
                ],
                examples: [
                    { problem: "Na reação N₂ + 3H₂ ⇌ 2NH₃ (exotérmica), o que acontece se você aumentar a temperatura?", solution: "O equilíbrio se desloca no sentido endotérmico (para a esquerda, menos NH₃) para \"absorver\" o excesso de energia." },
                    { problem: "Se você aumentar a pressão comprimindo o volume dessa mesma reação, para que lado o equilíbrio se desloca?", solution: "Para o lado com MENOS mols de gás (4 mols de reagentes → 2 mols de produto), ou seja, para a direita, formando mais NH₃." }
                ],
                links: [{ id: 15, label: "Módulo 15 · Equilíbrio Kc" }, { id: 19, label: "Módulo 19 · Kps" }]
            },
            {
                key: "intermolecular", icon: "[FIM]", title: "15. Forças Intermoleculares",
                notes: [
                    "Forças intermoleculares são atrações entre moléculas (diferente das ligações químicas, que unem átomos DENTRO de uma molécula).",
                    "Da mais fraca para a mais forte (entre moléculas neutras): forças de London (presentes em TODAS as moléculas) < dipolo-dipolo < ligações de hidrogênio.",
                    "Ligação de hidrogênio ocorre quando H está ligado diretamente a N, O ou F — explica por que a água tem ponto de ebulição anormalmente alto para seu tamanho.",
                    "Quanto mais fortes as forças intermoleculares, maiores o ponto de fusão, o ponto de ebulição e a viscosidade da substância."
                ],
                mnemonic: "\"FON\": quando Flúor, Oxigênio ou Nitrogênio está ligado a H, espere ligação de hidrogênio.",
                glossary: [
                    { term: "Forças de London", def: "Atração fraca e temporária causada por flutuações momentâneas na distribuição de elétrons — presente em toda molécula." },
                    { term: "Dipolo", def: "Separação de cargas parcial numa molécula polar (um lado levemente +, outro levemente −)." }
                ],
                examples: [
                    { problem: "Por que a água (massa molar 18) ferve a 100°C, muito mais alto que o metano (massa molar 16, ferve a −162°C)?", solution: "A água faz ligações de hidrogênio (H ligado a O), muito mais fortes que as forças de London do metano — por isso precisa de muito mais energia para separar as moléculas de água." },
                    { problem: "Entre um gás nobre pequeno (He) e um grande (Xe), qual tem forças de London mais fortes?", solution: "Xe — átomos maiores têm mais elétrons e nuvens eletrônicas mais polarizáveis, gerando forças de London mais intensas." }
                ],
                links: [{ id: 11, label: "Módulo 11 · Lei dos Gases" }, { id: 9, label: "Módulo 9 · Termoquímica" }]
            }
        ];

        // Bancos de perguntas — 5 por tópico. A ordem é embaralhada a cada tentativa.
        const GC_QUIZZES = {
            materia: [
                { q: "Qual propriedade NÃO muda dependendo do tamanho da amostra?", options: ["Massa", "Volume", "Densidade", "Peso"], correct: 2, explain: "Densidade é uma propriedade intensiva: 1 g ou 1 kg da mesma substância pura têm a mesma densidade." },
                { q: "Em qual estado físico as partículas têm forma E volume variáveis?", options: ["Sólido", "Líquido", "Gasoso", "Plasma"], correct: 2, explain: "No estado gasoso, as partículas se movem livremente e ocupam todo o espaço disponível." },
                { q: "Uma mistura de água e óleo (que se separam visivelmente) é uma mistura...", options: ["Homogênea", "Heterogênea", "Substância pura", "Composto"], correct: 1, explain: "Como dá para distinguir as duas fases a olho nu, é uma mistura heterogênea." },
                { q: "O zero em \"2,50 g\" é significativo porque:", options: ["Todo zero é sempre significativo", "Foi medido/registrado deliberadamente", "Está no início do número", "Nunca é significativo"], correct: 1, explain: "Um zero final após a vírgula, quando registrado, indica precisão real do instrumento." },
                { q: "Uma substância pura formada por dois ou mais elementos diferentes é chamada de:", options: ["Elemento", "Composto", "Mistura homogênea", "Mistura heterogênea"], correct: 1, explain: "Composto é uma substância pura com átomos de mais de um elemento, numa proporção fixa." }
            ],
            atomo: [
                { q: "O que define QUAL elemento químico um átomo é?", options: ["Número de nêutrons", "Número de prótons", "Número de elétrons", "Massa atômica"], correct: 1, explain: "O número atômico (Z), isto é, o número de prótons, é a identidade do elemento." },
                { q: "Dois átomos do mesmo elemento com números de nêutrons diferentes são chamados de...", options: ["Íons", "Isótopos", "Isômeros", "Alótropos"], correct: 1, explain: "Isótopos têm o mesmo Z (prótons) mas número de massa (A) diferente." },
                { q: "Um átomo neutro de sódio (Z=11) tem quantos elétrons?", options: ["10", "11", "12", "23"], correct: 1, explain: "Em um átomo neutro, nº de elétrons = nº de prótons = Z." },
                { q: "A massa atômica listada na tabela periódica é:", options: ["Sempre um número inteiro", "Uma média ponderada dos isótopos naturais", "Só do isótopo mais leve", "Igual ao número de prótons"], correct: 1, explain: "É a média das massas dos isótopos naturais, ponderada pela abundância de cada um." },
                { q: "Um cátion (íon positivo) se forma quando um átomo:", options: ["Ganha elétrons", "Perde elétrons", "Ganha prótons", "Perde nêutrons"], correct: 1, explain: "Perder elétrons deixa mais prótons que elétrons, resultando em carga positiva." }
            ],
            periodica: [
                { q: "Elementos do mesmo GRUPO (coluna) da tabela periódica têm em comum...", options: ["O mesmo número de nêutrons", "O mesmo número de elétrons de valência", "A mesma massa atômica", "O mesmo número de prótons"], correct: 1, explain: "É o número de elétrons de valência igual que causa propriedades químicas parecidas dentro de um grupo." },
                { q: "Ao andar da esquerda para a direita num período, o raio atômico geralmente...", options: ["Aumenta", "Diminui", "Não muda", "Vira zero"], correct: 1, explain: "O aumento da carga nuclear puxa os elétrons mais para perto, reduzindo o raio." },
                { q: "Qual região da tabela periódica reúne os elementos mais eletronegativos?", options: ["Canto inferior esquerdo", "Canto superior direito (perto do flúor)", "Centro (metais de transição)", "Gases nobres"], correct: 1, explain: "Eletronegatividade aumenta para a direita e para cima — o flúor é o mais eletronegativo de todos." },
                { q: "O grupo 1 da tabela periódica (metais alcalinos) é conhecido por ser:", options: ["Muito pouco reativo", "Extremamente reativo", "Formado só por não metais", "Formado só por gases"], correct: 1, explain: "Metais alcalinos têm 1 elétron de valência fácil de perder, o que os torna muito reativos." },
                { q: "Elementos de um mesmo PERÍODO (linha) têm em comum:", options: ["O mesmo número de camadas eletrônicas ocupadas", "O mesmo número de elétrons de valência", "A mesma massa atômica", "O mesmo estado físico"], correct: 0, explain: "Um período corresponde a um mesmo número de camadas (níveis de energia) ocupadas." }
            ],
            ligacoes: [
                { q: "Uma ligação entre um metal e um não metal costuma ser...", options: ["Covalente apolar", "Covalente polar", "Iônica", "Metálica"], correct: 2, explain: "A grande diferença de eletronegatividade entre metal e não metal favorece a transferência completa de elétrons (ligação iônica)." },
                { q: "O que explica a condutividade elétrica dos metais?", options: ["Elétrons deslocalizados ('mar de elétrons')", "Prótons livres", "Ligações covalentes polares", "Ausência de nêutrons"], correct: 0, explain: "Na ligação metálica, os elétrons de valência circulam livremente entre os cátions metálicos, conduzindo corrente elétrica." },
                { q: "Numa ligação covalente APOLAR, o compartilhamento de elétrons é...", options: ["Totalmente desigual", "Igual (ou quase igual)", "Inexistente", "Só de prótons"], correct: 1, explain: "Ligação apolar ocorre quando os átomos têm eletronegatividades parecidas (ex: O₂, N₂)." },
                { q: "Uma ligação covalente entre dois átomos IDÊNTICOS (ex: Cl-Cl) é:", options: ["Sempre iônica", "Sempre polar", "Apolar", "Metálica"], correct: 2, explain: "Átomos idênticos têm eletronegatividade igual, então compartilham elétrons igualmente (apolar)." },
                { q: "O que uma estrutura de Lewis representa?", options: ["Só os prótons do átomo", "Os elétrons de valência e como são compartilhados/transferidos", "A massa molar do composto", "O estado físico da substância"], correct: 1, explain: "Estruturas de Lewis mostram os elétrons de valência ao redor dos átomos numa molécula ou íon." }
            ],
            reacoes: [
                { q: "Qual lei justifica por que uma equação química precisa estar balanceada?", options: ["Lei de Hess", "Lei da Conservação da Massa", "Lei de Avogadro", "Lei de Boyle"], correct: 1, explain: "A massa não pode ser criada nem destruída — os átomos só se rearranjam." },
                { q: "A reação AB → A + B é um exemplo de...", options: ["Síntese", "Decomposição", "Dupla troca", "Combustão"], correct: 1, explain: "Um único reagente se quebra em dois ou mais produtos: decomposição." },
                { q: "Numa equação balanceada, os coeficientes representam a proporção em...", options: ["Gramas", "Litros", "Mols", "Mililitros"], correct: 2, explain: "Coeficientes estequiométricos são sempre proporções de MOLS entre as substâncias." },
                { q: "Zn + 2HCl → ZnCl₂ + H₂ é um exemplo de reação de:", options: ["Síntese", "Decomposição", "Deslocamento simples", "Dupla troca"], correct: 2, explain: "O zinco desloca o hidrogênio do ácido, ocupando seu lugar no composto." },
                { q: "Numa reação de combustão completa de um hidrocarboneto, os produtos são sempre:", options: ["H₂ e O₂", "CO₂ e H₂O", "Só CO₂", "Só H₂O"], correct: 1, explain: "Combustão completa de hidrocarbonetos com O₂ suficiente sempre produz dióxido de carbono e água." }
            ],
            mol: [
                { q: "O número de Avogadro (~6,022×10²³) representa...", options: ["A massa de 1 mol de qualquer substância", "Quantas 'coisas' (átomos/moléculas) há em 1 mol", "O volume de 1 mol de gás", "A carga de um elétron"], correct: 1, explain: "É a quantidade de entidades (átomos, moléculas, íons) que define exatamente 1 mol." },
                { q: "Para converter gramas em mols, você precisa dividir pela...", options: ["Densidade", "Massa molar", "Constante de Avogadro", "Temperatura"], correct: 1, explain: "n = massa ÷ massa molar." },
                { q: "O 'reagente limitante' de uma reação é aquele que...", options: ["Está em maior quantidade", "Acaba primeiro e limita o produto formado", "Não participa da reação", "Tem a maior massa molar"], correct: 1, explain: "Quando o reagente limitante acaba, a reação para, mesmo sobrando outros reagentes." },
                { q: "Quantas 'entidades' há em exatamente 1 mol de qualquer substância?", options: ["6,022×10²²", "6,022×10²³", "22,4", "1000"], correct: 1, explain: "Essa é a definição do número de Avogadro." },
                { q: "Se um composto tem massa molar 44 g/mol, quantos gramas correspondem a 0,25 mol?", options: ["11 g", "44 g", "176 g", "4,4 g"], correct: 0, explain: "massa = n × M = 0,25 × 44 = 11 g." }
            ],
            gases: [
                { q: "Na equação PV = nRT, a temperatura T deve estar em qual unidade?", options: ["Celsius", "Fahrenheit", "Kelvin", "Qualquer uma, tanto faz"], correct: 2, explain: "A lei dos gases ideais exige temperatura absoluta (Kelvin), nunca Celsius ou Fahrenheit diretamente." },
                { q: "Segundo a Teoria Cinética dos Gases, as colisões entre partículas de um gás ideal são...", options: ["Perfeitamente elásticas (sem perda de energia)", "Sempre inelásticas", "Inexistentes", "Só acontecem em altas pressões"], correct: 0, explain: "Colisões elásticas conservam a energia cinética total do sistema — uma das premissas do modelo de gás ideal." },
                { q: "25°C corresponde a quantos Kelvin?", options: ["25 K", "248 K", "298 K", "398 K"], correct: 2, explain: "K = °C + 273,15 → 25 + 273,15 ≈ 298 K." },
                { q: "Se o volume de um gás é mantido fixo e a temperatura aumenta, a pressão tende a:", options: ["Diminuir", "Aumentar", "Permanecer igual", "Virar zero"], correct: 1, explain: "Mais energia térmica gera colisões mais frequentes e intensas, aumentando a pressão." },
                { q: "A Teoria Cinética dos Gases assume que o volume próprio das partículas de gás é:", options: ["Igual ao volume do recipiente", "Desprezível comparado ao volume do recipiente", "Sempre maior que o do recipiente", "Irrelevante para a pressão"], correct: 1, explain: "Um gás ideal é modelado como partículas puntiformes — o volume delas é desprezado." }
            ],
            solucoes: [
                { q: "Numa solução, o SOLVENTE é...", options: ["O componente em menor quantidade", "O componente em maior quantidade, que dissolve o resto", "Sempre a água", "Sempre um sólido"], correct: 1, explain: "Solvente é o meio que dissolve o soluto — geralmente (mas não sempre) em maior quantidade." },
                { q: "Ao diluir uma solução adicionando água, o que acontece com o número de MOLS de soluto?", options: ["Aumenta", "Diminui", "Permanece o mesmo", "Vira zero"], correct: 2, explain: "Diluir só aumenta o volume — a quantidade de soluto (em mols) não muda, só fica mais espalhada." },
                { q: "\"Semelhante dissolve semelhante\" quer dizer que...", options: ["Substâncias polares dissolvem melhor em solventes polares", "Só a água dissolve qualquer coisa", "Sólidos só dissolvem outros sólidos", "Todo soluto dissolve em qualquer solvente"], correct: 0, explain: "Substâncias com polaridades parecidas interagem melhor entre si (ex: sal em água, óleo em hexano)." },
                { q: "Qual a molaridade de uma solução com 2 mols de soluto dissolvidos em 4 litros de solução?", options: ["0,5 mol/L", "2 mol/L", "8 mol/L", "4 mol/L"], correct: 0, explain: "C = n/V = 2/4 = 0,5 mol/L." },
                { q: "Numa solução saturada, adicionar mais soluto além do limite de solubilidade resulta em:", options: ["Ele se dissolve totalmente mesmo assim", "Ele fica sem se dissolver (precipita/sedimenta)", "A solução vira um gás", "A água evapora imediatamente"], correct: 1, explain: "Acima do limite de solubilidade, o excesso de soluto permanece como fase sólida separada." }
            ],
            acidosbases: [
                { q: "Uma solução com pH = 3 é...", options: ["Básica", "Neutra", "Ácida", "Impossível de existir"], correct: 2, explain: "pH abaixo de 7 indica caráter ácido." },
                { q: "Um ácido FORTE, em água, se ioniza...", options: ["Completamente", "Parcialmente", "Nunca", "Só em altas temperaturas"], correct: 0, explain: "Ácidos fortes (como HCl) se dissociam quase 100% em solução aquosa." },
                { q: "Se o pH de uma solução cai de 5 para 4, a concentração de H⁺...", options: ["Dobra", "Aumenta 10 vezes", "Diminui 10 vezes", "Não muda"], correct: 1, explain: "A escala de pH é logarítmica: cada unidade a menos representa 10× mais H⁺." },
                { q: "A soma de pH + pOH de uma solução aquosa a 25°C é sempre:", options: ["7", "10", "14", "0"], correct: 2, explain: "A 25°C, Kw = 10⁻¹⁴, então pH + pOH = 14." },
                { q: "Um ácido fraco, comparado a um ácido forte de mesma concentração, apresenta pH:", options: ["Mais baixo (mais ácido)", "Mais alto (menos ácido)", "Exatamente igual", "Sempre 7"], correct: 1, explain: "Como o ácido fraco se ioniza só parcialmente, gera menos H⁺, resultando em pH mais alto (menos ácido)." }
            ],
            termo: [
                { q: "Numa reação EXOTÉRMICA, o ΔH é...", options: ["Positivo", "Negativo", "Sempre zero", "Não tem ΔH"], correct: 1, explain: "Reações exotérmicas liberam energia para o ambiente, por isso o ΔH é negativo." },
                { q: "Gelo derretendo (absorvendo calor do ambiente) é um processo...", options: ["Exotérmico", "Endotérmico", "Neutro", "Catalítico"], correct: 1, explain: "Fusão do gelo absorve energia do ambiente — processo endotérmico." },
                { q: "A Lei de Hess é útil porque a entalpia é uma função de...", options: ["Tempo", "Estado (não depende do caminho)", "Pressão apenas", "Velocidade da reação"], correct: 1, explain: "Como ΔH só depende dos estados inicial e final, dá para somar etapas conhecidas." },
                { q: "Quebrar uma ligação química sempre:", options: ["Libera energia", "Absorve energia", "Não envolve energia", "Depende só da temperatura"], correct: 1, explain: "Quebrar ligações é sempre um processo que consome (absorve) energia." },
                { q: "Se a energia liberada ao formar as ligações dos produtos é MAIOR que a energia gasta para quebrar as ligações dos reagentes, a reação é:", options: ["Endotérmica", "Exotérmica", "Não espontânea", "Impossível"], correct: 1, explain: "Mais energia liberada do que consumida resulta em saldo negativo de ΔH: exotérmica." }
            ],
            eletronica: [
                { q: "Quantos elétrons cabem, no máximo, em um subnível p?", options: ["2", "6", "10", "14"], correct: 1, explain: "O subnível p tem 3 orbitais, cada um com até 2 elétrons: 3×2 = 6." },
                { q: "O Princípio de Exclusão de Pauli diz que cada orbital pode ter no máximo quantos elétrons?", options: ["1", "2", "3", "4"], correct: 1, explain: "Cada orbital comporta no máximo 2 elétrons, com spins opostos." },
                { q: "Segundo a regra de Hund, elétrons em orbitais de mesma energia preferem...", options: ["Emparelhar imediatamente", "Ocupar orbitais separados antes de emparelhar", "Ficar todos no mesmo orbital", "Sair do átomo"], correct: 1, explain: "Isso minimiza a repulsão entre elétrons, sendo energeticamente mais favorável." },
                { q: "A configuração eletrônica 1s²2s²2p⁶3s² pertence a qual elemento (Z=12)?", options: ["Sódio", "Magnésio", "Alumínio", "Silício"], correct: 1, explain: "Contando os elétrons: 2+2+6+2 = 12, que é o número atômico do magnésio." },
                { q: "Quantos elétrons de valência tem um elemento com configuração terminando em 3s²3p⁴?", options: ["2", "4", "6", "8"], correct: 2, explain: "Na camada de valência n=3: 3s² + 3p⁴ = 6 elétrons." }
            ],
            nomenclatura: [
                { q: "Qual o nome do composto KBr?", options: ["Brometo de potássio", "Bromato de potássio", "Boreto de potássio", "Óxido de potássio"], correct: 0, explain: "K⁺ (potássio) + Br⁻ (brometo, terminação -eto do ânion bromo)." },
                { q: "HCl (sem oxigênio) é chamado de ácido...", options: ["clórico", "clorídrico", "cloroso", "hipocloroso"], correct: 1, explain: "Ácidos sem oxigênio recebem a terminação '-ídrico'." },
                { q: "O prefixo 'tri' em compostos moleculares indica quantos átomos?", options: ["1", "2", "3", "4"], correct: 2, explain: "Prefixos gregos indicam quantidade: mono=1, di=2, tri=3, tetra=4." },
                { q: "Fe³⁺ é chamado de:", options: ["ferro(I)", "ferro(II)", "ferro(III)", "ferro trivalente apenas em inglês"], correct: 2, explain: "O algarismo romano indica a carga do cátion: +3 = ferro(III)." },
                { q: "A fórmula do dióxido de enxofre é:", options: ["SO", "SO₂", "SO₃", "S₂O"], correct: 1, explain: "'Dióxido' indica 2 átomos de oxigênio ligados a 1 de enxofre: SO₂." }
            ],
            redox: [
                { q: "Perder elétrons é chamado de:", options: ["Redução", "Oxidação", "Neutralização", "Hidrólise"], correct: 1, explain: "Oxidação = perda de elétrons (aumento do nox)." },
                { q: "O agente redutor, na reação, é a espécie que:", options: ["Ganha elétrons e se reduz", "Perde elétrons e se oxida", "Não participa da reação", "Sempre é um gás"], correct: 1, explain: "O agente redutor \"doa\" elétrons para outra espécie, oxidando-se no processo." },
                { q: "Se o nox de um átomo diminui numa reação, ele foi:", options: ["Oxidado", "Reduzido", "Ionizado", "Neutralizado"], correct: 1, explain: "Diminuição do nox = ganho de elétrons = redução." },
                { q: "Numa pilha, os elétrons perdidos pelo agente redutor são:", options: ["Destruídos", "Transferidos para o agente oxidante", "Convertidos em prótons", "Ignorados"], correct: 1, explain: "Os elétrons fluem do agente redutor para o oxidante através do circuito externo, gerando corrente." },
                { q: "O nox de um elemento no estado neutro (não combinado) é sempre:", options: ["+1", "-1", "0", "variável"], correct: 2, explain: "Átomos em sua forma elementar (ex: Fe, O₂, N₂) sempre têm nox igual a zero." }
            ],
            equilibrio: [
                { q: "No equilíbrio químico, a velocidade da reação direta e da inversa são:", options: ["Sempre zero", "Iguais entre si", "Sempre crescentes", "Independentes uma da outra"], correct: 1, explain: "No equilíbrio dinâmico, as duas velocidades se igualam, embora as reações continuem ocorrendo." },
                { q: "Um valor de Kc muito grande (>>1) indica que, no equilíbrio, predominam:", options: ["Reagentes", "Produtos", "Nem reagentes nem produtos", "Só catalisadores"], correct: 1, explain: "Kc grande significa que [produtos] é muito maior que [reagentes] no equilíbrio." },
                { q: "Segundo Le Chatelier, aumentar a concentração de um reagente desloca o equilíbrio para:", options: ["Esquerda (mais reagente)", "Direita (mais produto)", "Não desloca", "Depende só da temperatura"], correct: 1, explain: "O sistema reage consumindo parte do reagente extra, formando mais produto." },
                { q: "Aumentar a temperatura de um equilíbrio EXOTÉRMICO desloca a reação no sentido:", options: ["Exotérmico (direto)", "Endotérmico (inverso)", "Não afeta o equilíbrio", "Só afeta gases"], correct: 1, explain: "O sistema se desloca para \"absorver\" o calor extra, no sentido endotérmico." },
                { q: "Um catalisador, ao ser adicionado a um sistema em equilíbrio:", options: ["Desloca o equilíbrio para os produtos", "Desloca o equilíbrio para os reagentes", "Acelera as duas reações igualmente, sem deslocar o equilíbrio", "Impede o equilíbrio de ser atingido"], correct: 2, explain: "Catalisadores aceleram a reação direta e a inversa igualmente — o equilíbrio é atingido mais rápido, mas Kc não muda." }
            ],
            intermolecular: [
                { q: "Qual força intermolecular está presente em TODAS as moléculas, mesmo as apolares?", options: ["Ligação de hidrogênio", "Dipolo-dipolo", "Forças de London", "Ligação iônica"], correct: 2, explain: "Forças de London surgem de flutuações momentâneas de elétrons, presentes em qualquer molécula." },
                { q: "Ligação de hidrogênio ocorre quando H está ligado diretamente a quais elementos?", options: ["C, S, P", "F, O, N", "Todos os metais", "Apenas carbono"], correct: 1, explain: "F, O e N são pequenos e muito eletronegativos, criando ligações de hidrogênio fortes com H." },
                { q: "Quanto mais fortes as forças intermoleculares, o ponto de ebulição tende a ser:", options: ["Mais baixo", "Mais alto", "Não muda", "Sempre 100°C"], correct: 1, explain: "Forças mais fortes exigem mais energia (temperatura) para separar as moléculas." },
                { q: "Por que a água tem ponto de ebulição muito mais alto que o metano?", options: ["Água é mais pesada", "Água faz ligações de hidrogênio", "Metano é um metal", "Água não tem forças intermoleculares"], correct: 1, explain: "As ligações de hidrogênio da água são muito mais fortes que as forças de London do metano." },
                { q: "Forças intermoleculares atuam:", options: ["Dentro da mesma molécula, unindo átomos", "Entre moléculas diferentes", "Só em sólidos", "Só em gases nobres"], correct: 1, explain: "Por definição, são atrações ENTRE moléculas, não dentro delas." }
            ]
        };

        let gcActiveTopic = null;
        let gcQuizAnswers = {};
        let gcQuizOrder = [];
        let gcGlossaryFilter = "";

        function gcContainer() { return document.getElementById("gc-content"); }

        function gcShuffle(arr) {
            const a = arr.slice();
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        function gcGetProgress() {
            return (loadPrefs().gcProgress) || {};
        }

        function gcSaveProgress(topicKey, score, total) {
            const progress = gcGetProgress();
            progress[topicKey] = { done: true, score, total, at: Date.now() };
            savePrefs({ gcProgress: progress });
        }

        function gcInit() {
            gcActiveTopic = null;
            gcQuizAnswers = {};
            gcRenderMenu();
        }

        function gcRenderMenu() {
            const c = gcContainer();
            if (!c) return;
            const progress = gcGetProgress();
            const doneCount = GC_TOPICS.filter(t => progress[t.key] && progress[t.key].done).length;

            const cards = GC_TOPICS.map(t => {
                const p = progress[t.key];
                const badge = p ? `<span class="text-green-400 text-[10px]">[OK ${p.score}/${p.total}]</span>` : `<span class="text-[10px] opacity-40">[não revisado]</span>`;
                return `
                <button onclick="gcSelectTopic('${t.key}')" class="dos-border p-3 text-left w-full hover:bg-current hover:text-black transition-colors">
                    <div class="font-bold text-sm flex justify-between items-center gap-2"><span>${t.icon} ${t.title}</span> ${badge}</div>
                </button>`;
            }).join('');

            c.innerHTML = `
                <div class="text-[10px] opacity-60 mb-3 dos-border p-2">
                    [i] Conteúdo de referência <strong>original</strong>, escrito para o CHEM.OS no formato de caderno de estudos (notas + fórmula-chave + mnemônico + exemplos resolvidos + mini-quiz) — cobrindo os fundamentos que os demais módulos pressupõem. Não é uma cópia de nenhum livro específico; é só um jeito rápido de revisar antes de usar as ferramentas mais avançadas do site.
                </div>
                <div class="flex justify-between items-center mb-2">
                    <div class="text-sm font-bold opacity-90">ESCOLHA UM TÓPICO PARA REVISAR</div>
                    <button onclick="gcRenderGlossary()" class="dos-btn text-xs">[GLOSSÁRIO GERAL]</button>
                </div>
                <div class="text-xs opacity-70 mb-2">Progresso: ${doneCount} de ${GC_TOPICS.length} tópicos revisados.</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">${cards}</div>
            `;
        }

        function gcSelectTopic(key) {
            gcActiveTopic = key;
            gcQuizAnswers = {};
            gcRenderTopic();
            playBeep(600, 0.03);
        }

        function gcRenderTopic() {
            const c = gcContainer();
            if (!c) return;
            const t = GC_TOPICS.find(x => x.key === gcActiveTopic);
            if (!t) { gcRenderMenu(); return; }

            const notesHTML = t.notes.map(n => `<li class="mb-1">${n}</li>`).join('');
            const diagramHTML = t.diagram ? `<div class="dos-border p-2 mb-3 flex justify-center">${t.diagram}</div>` : '';
            const formulaHTML = t.formula ? `<div class="dos-border p-2 text-center text-sm font-bold mb-3">${t.formula}</div>` : '';
            const mnemonicHTML = t.mnemonic ? `<div class="dos-border p-2 text-xs mb-3"><strong class="opacity-80">[DICA] MACETE PARA LEMBRAR:</strong><br>${t.mnemonic}</div>` : '';
            const examplesHTML = (t.examples || []).map((ex, i) => `
                <div class="dos-border p-2 text-xs mb-2">
                    <strong class="opacity-80">[EX ${i + 1}] EXEMPLO RESOLVIDO:</strong>
                    <div class="mt-1"><em>${ex.problem}</em></div>
                    <div class="mt-1 text-green-400">${ex.solution}</div>
                </div>`).join('');
            const glossaryHTML = (t.glossary || []).length ? `
                <div class="dos-border p-2 text-xs mb-3">
                    <strong class="opacity-80">[GLOSS] TERMOS-CHAVE:</strong>
                    <ul class="list-disc pl-4 mt-1">${t.glossary.map(g => `<li><strong>${g.term}:</strong> ${g.def}</li>`).join('')}</ul>
                </div>` : '';
            const linksHTML = (t.links || []).map(l => `<button onclick="renderTool(${l.id})" class="dos-btn text-xs">[→] Praticar: ${l.label}</button>`).join(' ');

            c.innerHTML = `
                <button onclick="gcInit()" class="dos-btn text-xs mb-3">[←] VOLTAR AOS TÓPICOS</button>
                <div class="text-sm font-bold mb-2">${t.icon} ${t.title}</div>
                ${diagramHTML}
                <ul class="text-xs list-disc pl-4 mb-3 opacity-90">${notesHTML}</ul>
                ${formulaHTML}
                ${mnemonicHTML}
                ${examplesHTML}
                ${glossaryHTML}
                <div class="flex gap-2 flex-wrap mb-3">${linksHTML}</div>
                <button onclick="gcRenderQuiz()" class="dos-btn">[QUIZ] TESTAR MEUS CONHECIMENTOS (5 PERGUNTAS)</button>
                <div id="gc-quiz-area" class="mt-3"></div>
            `;
        }

        function gcRenderQuiz() {
            const quizArea = document.getElementById("gc-quiz-area");
            if (!quizArea) return;
            const bank = GC_QUIZZES[gcActiveTopic] || [];
            gcQuizAnswers = {};
            gcQuizOrder = gcShuffle(bank.map((_, i) => i)); // ordem embaralhada a cada tentativa

            quizArea.innerHTML = gcQuizOrder.map((qi, displayIdx) => {
                const q = bank[qi];
                return `
                <div class="dos-border p-2 mb-2 text-xs" id="gc-q-${displayIdx}">
                    <div class="font-bold mb-1">${displayIdx + 1}. ${q.q}</div>
                    <div class="space-y-1">
                        ${q.options.map((opt, oi) => `
                            <button onclick="gcAnswerQuestion(${displayIdx}, ${qi}, ${oi})" id="gc-q${displayIdx}-opt${oi}" class="dos-btn text-xs block w-full text-left">${opt}</button>
                        `).join('')}
                    </div>
                    <div id="gc-q${displayIdx}-feedback" class="mt-1"></div>
                </div>`;
            }).join('') + `<div id="gc-quiz-score" class="text-sm font-bold mt-2"></div>`;
        }

        function gcAnswerQuestion(displayIdx, bankIdx, oi) {
            if (gcQuizAnswers[displayIdx] !== undefined) return; // já respondida, não deixa trocar
            gcQuizAnswers[displayIdx] = oi;
            const bank = GC_QUIZZES[gcActiveTopic] || [];
            const q = bank[bankIdx];
            const correct = oi === q.correct;

            for (let i = 0; i < q.options.length; i++) {
                const btn = document.getElementById(`gc-q${displayIdx}-opt${i}`);
                if (!btn) continue;
                btn.classList.add("opacity-60");
                if (i === q.correct) btn.classList.add("text-green-400", "border-green-400");
                else if (i === oi) btn.classList.add("text-red-400", "border-red-400");
            }

            const feedback = document.getElementById(`gc-q${displayIdx}-feedback`);
            if (feedback) {
                feedback.innerHTML = `<span class="${correct ? 'text-green-400' : 'text-red-400'}">${correct ? '[OK] Correto!' : '[X] Não foi dessa vez.'}</span> ${q.explain}`;
            }

            playBeep(correct ? 800 : 300, 0.03);

            if (Object.keys(gcQuizAnswers).length === gcQuizOrder.length) {
                const score = gcQuizOrder.reduce((s, qi, di) => s + (gcQuizAnswers[di] === bank[qi].correct ? 1 : 0), 0);
                const scoreEl = document.getElementById("gc-quiz-score");
                if (scoreEl) scoreEl.textContent = `Resultado: ${score} de ${gcQuizOrder.length} corretas.`;
                gcSaveProgress(gcActiveTopic, score, gcQuizOrder.length);
            }
        }

        function gcRenderGlossary() {
            const c = gcContainer();
            if (!c) return;
            gcGlossaryFilter = "";
            const allTerms = [];
            GC_TOPICS.forEach(t => (t.glossary || []).forEach(g => allTerms.push({ ...g, topic: t.title, topicKey: t.key })));
            allTerms.sort((a, b) => a.term.localeCompare(b.term, 'pt-BR'));

            c.innerHTML = `
                <button onclick="gcInit()" class="dos-btn text-xs mb-3">[←] VOLTAR AOS TÓPICOS</button>
                <div class="text-sm font-bold mb-2">[GLOSSÁRIO GERAL] — ${allTerms.length} TERMOS</div>
                <input id="gc-glossary-search" type="text" placeholder="Pesquisar termo..." class="dos-input p-1 w-full mb-3" oninput="gcFilterGlossary(this.value)">
                <div id="gc-glossary-list"></div>
            `;
            gcRenderGlossaryList(allTerms);
        }

        function gcRenderGlossaryList(allTerms) {
            const list = document.getElementById("gc-glossary-list");
            if (!list) return;
            const filtered = allTerms.filter(g =>
                !gcGlossaryFilter || g.term.toLowerCase().includes(gcGlossaryFilter) || g.def.toLowerCase().includes(gcGlossaryFilter)
            );
            list.innerHTML = filtered.length
                ? filtered.map(g => `
                    <div class="dos-border p-2 text-xs mb-1">
                        <button onclick="gcSelectTopic('${g.topicKey}')" class="font-bold hover:underline">${g.term}</button>
                        <span class="opacity-50"> — ${g.topic}</span>
                        <div class="mt-1">${g.def}</div>
                    </div>`).join('')
                : `<div class="text-xs opacity-50">Nenhum termo encontrado.</div>`;
        }

        function gcFilterGlossary(value) {
            gcGlossaryFilter = (value || "").toLowerCase();
            const allTerms = [];
            GC_TOPICS.forEach(t => (t.glossary || []).forEach(g => allTerms.push({ ...g, topic: t.title, topicKey: t.key })));
            allTerms.sort((a, b) => a.term.localeCompare(b.term, 'pt-BR'));
            gcRenderGlossaryList(allTerms);
        }
