# Changelog

## 17.0 — Nova camada visual
- **Bug de CSS corrigido (antigo):** em `ui-v11.css` havia um `@media (prefers-reduced-motion: reduce) { @media print { … }` com uma chave sem fechar. Todo o CSS seguinte ficava preso dentro da regra de movimento reduzido e só valia para quem pede isso no sistema. Com a correção, voltam a valer os rótulos de grupo, período e bloco da tabela periódica, a rolagem sob a barra de comando e, no celular, o ocultamento do rodapé de temas e da barra de comando (que já existe na navegação inferior). A auditoria passou a verificar que as chaves de todos os `css/*.css` estão balanceadas.
- **Tipografia com papéis claros:** VT323 para título, rótulos e controles; IBM Plex Mono para texto, campos, resultados e tabelas (antes tudo era VT323 em tamanho muito pequeno). Texto de leitura com 78 caracteres no máximo por linha e entrelinha de 1,6.
- **Marcador de célula nos módulos:** o título de cada módulo abre com o número em um bloco no formato das células da tabela periódica (a etiqueta [TAG], quando existe, aparece como símbolo). O número continua no texto para leitores de tela.
- **Hierarquia de ações:** a ação principal de cada tela (CALCULAR, COMEÇAR, ANALISAR etc.) é preenchida; as demais ficam vazadas. Campos, listas e áreas de texto ganham fundo próprio, borda, foco visível e seta nas listas.
- **Resultados legíveis:** valores-chave em destaque, entrelinha maior e fundo próprio; tabelas com cabeçalho em fonte de pixel, linhas finas e realce ao passar o mouse.
- **Início:** subtítulo sem repetir o título; etiquetas e botões de atalho refinados; trilhas mais compactas.
- **Barra de comando opaca:** deixa de sobrepor o conteúdo (cortava o fim das telas).
- **Temas:** superfícies, linhas e texto atenuado derivados de cada tema (verde, âmbar, azul, mono e papel) por mistura de cores. O texto atenuado mantém contraste mínimo de 5,3:1 em todos os temas (WCAG AA exige 4,5:1). No tema papel, os avisos usam âmbar-escuro.
- **Celular:** cabeçalho em uma linha, rodapé oculto, botões com altura mínima de 42 px e título proporcional.
- **Textos corrigidos:** o caminho de navegação ainda mostrava "LABORATÓRIO, ESTUDO E JOGOS" e agora usa os grupos atuais do menu; a descrição do módulo 24 deixou de ser uma lista de 41 nomes.
- Verificação: os 8 conjuntos de testes passam (auditoria 95/95, UX 50/50, acessibilidade, cálculo 8/8, laboratório 5/5, contraste, simulação e fumaça), a varredura de entradas extremas nos 58 módulos segue sem erros, e as telas foram conferidas em capturas de um navegador real (Chromium) nos 5 temas, em desktop e celular.

## 16.0 — Caderno em todos os módulos, dois módulos novos e três tópicos
- **Módulo 57 — Carga e pI de Aminoácidos:** carga líquida de 11 aminoácidos em qualquer pH (Henderson-Hasselbalch por grupo ionizável) e pI calculado pelo ponto de carga zero (glicina 5,97; lisina 9,74; glutamato 3,22; histidina 7,59).
- **Módulo 58 — Velocidades Moleculares:** v_mp, v_méd e v_rms de 8 gases, fração de moléculas acima de uma velocidade (distribuição de Maxwell-Boltzmann, com função erro) e razão de efusão de Graham. N₂ a 298 K: 420,7 / 474,7 / 515,2 m/s.
- **Guia (módulo 24) de 38 para 41 tópicos:** **39 Termodinâmica estatística** (Boltzmann, partição, equipartição, entropia de mistura), **40 Organometálica e catálise homogênea** (regra dos 18 elétrons, adição oxidativa, ciclos catalíticos) e **41 Eletroquímica aplicada** (baterias, corrosão, proteção catódica, Tafel, Hall-Héroult), com 10 perguntas cada. Banco total: 410.
- **Caderno em todos os módulos:** os resultados dos módulos 1–34 passam a ser anunciados por leitores de tela (`aria-live`) e ganham o botão **+ CADERNO** ao lado do resultado.
- Comandos novos: `aminoacidos`, `maxwell`, `velocidades`. Menu com 55 módulos; trilhas atualizadas.
- **Bugs corrigidos durante o desenvolvimento:** na lista de pKa do módulo 57, `map(fmt)` passava o índice como número de algarismos e mostrava "10" no lugar de 9,6; e a regra "média dos dois menores pKa" dava pI errado para a tirosina (6,14 em vez de 5,6), corrigido com o cálculo pelo ponto de carga zero.
- Verificação: os 8 conjuntos de testes passam (fumaça, auditoria 94/94, UX 50/50, acessibilidade, cálculo 8/8, laboratório 5/5, contraste e simulação) e a varredura de entradas extremas nos 58 módulos não achou erro nem `NaN`/`Infinity`/`undefined`.

## 15.0 — Cinco ferramentas de bancada, três tópicos, caderno em PDF e histórico de revisão
- **Módulo 52 — Diluições e Padrões de Calibração:** volumes de estoque para cada padrão (C₁V₁ = C₂V₂) com aviso para pipetagens abaixo de 100 µL, e concentrações, volumes de transferência e diluente de uma diluição seriada.
- **Módulo 53 — Padronização de Soluções:** NaOH com biftalato, HCl com Na₂CO₃ e KMnO₄ com oxalato; concentração por réplica, média, desvio, RSD, IC 95 % e **teste Q de Dixon** (90 % e 95 %) para valores discrepantes.
- **Módulo 54 — Massa Atômica Média e Padrão Isotópico:** média ponderada de até 4 isótopos e padrão de picos M, M+2, M+4… para moléculas com Cl e Br (Cl₂ dá 100:64:10; Br₂, 51:100:49).
- **Módulo 55 — Lei de Hess:** soma até 5 etapas com multiplicadores (inverter = −1) e mostra cada contribuição.
- **Módulo 56 — Cristais Cúbicos e Bragg:** cela simples, CCC e CFC; densidade a partir da aresta (ou o contrário), raio atômico, fração de empacotamento e espaçamento d pela lei de Bragg (cobre: 8,97 g/cm³ e 127,6 pm).
- **Guia (módulo 24) de 35 para 38 tópicos:** **36 Sólidos cristalinos** (cela unitária, difração, bandas, defeitos), **37 Soluções reais** (Raoult, azeótropos, Henry, força iônica) e **38 Estereoquímica** (R/S, Fischer, conformações, ciclo-hexano), com 10 perguntas cada. Banco total: 380.
- **Caderno de laboratório:** novo botão **IMPRIMIR / SALVAR PDF**, que abre uma página formatada e a janela de impressão do navegador.
- **Revisão inteligente:** a tela inicial mostra o desempenho das últimas 8 rodadas, com barras e a média geral.
- Comandos novos: `diluicoes`, `padroes`, `padronizacao`, `isotopos`, `hess`, `cristal`. Menu com 53 módulos; trilhas atualizadas.
- Verificação: os 8 conjuntos de testes passam (fumaça, auditoria 94/94, UX 50/50, acessibilidade, cálculo 8/8, laboratório 5/5, contraste e simulação) e a varredura automática de entradas extremas nos 56 módulos não achou erro nem `NaN`/`Infinity`/`undefined`.

## 14.1 — Correção de bugs
- **Cálculo ao vivo disparava no módulo errado:** 700 ms depois de digitar, o recálculo automático (`ux-v9.js`) usava o campo que já tinha saído da tela, achava o botão CALCULAR antigo e o acionava no módulo seguinte, gerando erro no console (`runMolarMass` lendo campo `null`). Agora o recálculo é cancelado se o módulo mudou ou o campo não está mais na tela.
- **Funções frágeis:** `runMolarMass` e `runNameResolver` passam a ignorar a chamada quando a tela mudou, em vez de lançar exceção.
- **Janela de ajuda (F1) desatualizada:** listava só os módulos 1–25 e dizia "1 a 25". Agora diz 1 a 51, lista os módulos 26–51 (gerados dos dados de ajuda) e os atalhos por nome; os títulos das janelas de ajuda e de boas-vindas diziam "v11" e agora mostram v14.
- **Terminal aceitava números inválidos:** `3.5` e `1e1` eram tratados como módulo 3 e 10. Agora só inteiros de 1 a 51 são aceitos (`07` continua abrindo o 7).
- **Vírgula decimal nas listas (módulos 40 e 41):** valores como `0,5 1,0` eram partidos na vírgula e davam média e regressão erradas. Agora a vírgula é decimal e os valores se separam por espaço ou `;`.
- **Cache offline incompleto:** `favicon-32.png` e `apple-touch-icon.png` não estavam no cache do service worker (cache `chemos-v14.1`).
- **Desempenho:** o observador que coloca o botão + CADERNO agora roda no máximo uma vez a cada 60 ms (antes rodava a cada atualização da tela, inclusive durante a simulação molecular).
- **Testes:** `tests/sim.js` calculava pressão NaN porque não preenchia as dimensões HiDPI (`SIMC`/`SIMH`) que a simulação passou a usar; corrigido. O teste de temperatura instantânea falhava por acaso (20 % de tolerância com amostras de 120 partículas) e agora usa a média de 5 execuções (±12 %).
- Verificação: os 8 conjuntos de testes passam (fumaça, auditoria 94/94, UX 50/50, acessibilidade, cálculo 8/8, laboratório 5/5, contraste e simulação 7/7 em 6 execuções seguidas). Uma varredura automática abriu os 51 módulos com entradas vazias, 0, negativas, texto, 1e400 e só espaços, acionando todos os botões e selecionando todas as opções, sem erro de execução nem `NaN`/`Infinity`/`undefined` nas telas.

## 14.0 — Revisão inteligente, três ferramentas novas e guia com 35 tópicos
- **Módulo 49 — Revisão Inteligente:** sorteia perguntas dos 35 tópicos do guia (ou de um só), com peso maior nas que você já errou; mostra os tópicos mais errados, tem modo **SÓ OS QUE ERREI**, explicação após cada resposta, resultado final com os tópicos a rever e botão para zerar o histórico. Histórico apenas no navegador.
- **Módulo 50 — Ordem de Reação por Regressão:** a partir de tempos e concentrações, ajusta [A], ln[A] e 1/[A] contra t, compara os R², indica a ordem, o k e o t½, e avisa quando os dados não distinguem as ordens.
- **Módulo 51 — Calibração do Eletrodo de pH:** calibração em 2 pontos com correção pela temperatura: inclinação, eficiência frente a 59,16 mV/pH, potencial de assimetria e pH da amostra, com avisos de extrapolação.
- **Guia (módulo 24) de 32 para 35 tópicos:** **33 Eletroanalítica** (potenciometria, condutimetria, voltametria, coulometria), **34 Catálise e química de superfícies** (fisissorção e quimissorção, Langmuir, BET, Eley-Rideal, TOF) e **35 Química orgânica II** (carbonila, Grignard, saponificação, aldólica, aromaticidade e SEAr). 10 perguntas cada; banco total: 350.
- Comandos novos: `revisao`, `ordem`, `eletrodo`. Menu com 48 módulos; trilhas atualizadas ("Estudar e praticar" inclui a revisão).
- Verificação: auditoria 94/94 (inclui 10 perguntas íntegras em cada um dos 35 tópicos), UX 50/50, cálculo 8/8, laboratório 5/5, acessibilidade sem pendências, contraste ok e fumaça sem erros. O teste de simulação molecular (`tests/sim.js`) continua acusando falhas no ambiente de teste, como antes.

## 13.1 — Caderno em todos os módulos e 10 perguntas por tópico
- **Caderno de Laboratório (módulo 48) em todos os 47 módulos:** além do botão **+ CADERNO** em cada resultado dos módulos 35–47, a barra superior de qualquer módulo ganhou **+ CADERNO**, que guarda uma captura da tela (entradas e resultados, até 1200 caracteres).
- **Banco de perguntas completo:** os tópicos 17–32 passam de 8 para 10 perguntas cada (+32), com 4 alternativas distintas e explicação. Total: 320 perguntas em 32 tópicos. O teste de auditoria voltou a exigir 10 por tópico em todos.
- Verificação: auditoria 94/94, UX 50/50, cálculo 8/8, laboratório 5/5, acessibilidade sem pendências e fumaça sem erros.

## 13.0 — Maior atualização: 6 módulos, 6 tópicos, caderno e correções
- **Guia (módulo 24) de 26 para 32 tópicos:** **27 Mecânica quântica do átomo** (Bohr, Rydberg, de Broglie, orbitais, números quânticos, Pauli, Hund), **28 Mecanismos orgânicos** (SN1, SN2, E1, E2), **29 Métodos de separação e cromatografia**, **30 Polímeros e materiais**, **31 Bioquímica essencial** (aminoácidos, pI, enzimas, ATP, DNA) e **32 Química ambiental e verde** (efeito estufa, ozônio, chuva ácida, DBO/DQO, economia atômica). Cada um com notas, mnemônico, glossário, 3 exemplos resolvidos, erros comuns, aplicação real, aprofundamento e 8 perguntas (banco total: 280, depois 320 na 13.1).
- **Módulo 43 — Propagação de Incertezas:** soma, subtração, produto, quociente, potência e log, com arredondamento correto e incerteza expandida (k = 2).
- **Módulo 44 — Cromatografia:** k, α, N, H, R_s e R_f, com avisos de retenção e resolução.
- **Módulo 45 — Configuração Eletrônica:** átomos e íons (símbolo, nome ou Z), configuração completa e abreviada, desemparelhados, paramagnetismo e números quânticos do último elétron, com as exceções experimentais.
- **Módulo 46 — Entalpia por Energias de Ligação:** tabela com 21 ligações e 4 exemplos prontos (combustão do metano, HCl, Haber, hidrogenação).
- **Módulo 47 — Receitas de Tampão:** massas a pesar para acetato, fosfato, TRIS e carbonato em qualquer pH, concentração e volume.
- **Módulo 48 — Caderno de Laboratório:** botão **+ CADERNO** em todos os resultados dos módulos 35–47; lista, remoção e download em .txt. Dados só no navegador (localStorage).
- **Correção:** os comandos do terminal adicionados nas versões 22 e 12 (`concentracao`, `ph`, `nuclear` etc.) mostravam "comando desconhecido"; agora todos funcionam. Comandos novos: `incerteza`, `cromatografia`, `hplc`, `configuracao`, `cfg`, `receita`, `caderno`.
- Menu com 45 módulos em 6 grupos; trilhas novas "Laboratório analítico" e "Estrutura da matéria" (9 trilhas no total). Testes antigos ajustados para ler os dados reais (faixa de módulos 1–48, nº de trilhas, perguntas por tópico).
- Verificação: auditoria 94/94, UX 50/50, cálculo 8/8, laboratório 5/5, acessibilidade sem pendências, contraste ok e fumaça sem erros. O `tests/sim.js` (simulação molecular) acusa 5 falhas no ambiente de teste (jsdom), as mesmas que já ocorriam na v22.

## 12.1 — Mais ferramentas de bancada e guia com 26 tópicos
- **Guia (módulo 24) de 21 para 26 tópicos:** **22 Espectroscopia** (UV-Vis, IV, RMN, MS), **23 Gases reais, fases e pressão de vapor**, **24 Química analítica** (erros, volumetria, gravimetria, calibração), **25 Química nuclear** e **26 Inorgânica descritiva e compostos de coordenação** (campo cristalino, série espectroquímica, nomenclatura). Cada um com notas, mnemônico, glossário, 3 exemplos resolvidos, erros comuns, aplicação real, aprofundamento e 8 perguntas (banco total: 232).
- **Módulo 39 — pH Universal:** resolve o balanço de carga completo para ácido/base forte, ácido/base fraca, sais e ácido diprótico, correto também em soluções muito diluídas (HCl 10⁻⁸ mol/L → pH 6,98), com frações das espécies.
- **Módulo 40 — Estatística e Calibração:** média, desvio-padrão, RSD e IC 95 % (t de Student); regressão linear, R², LOD/LOQ e concentração da amostra, com alerta de extrapolação e de R² baixo.
- **Módulo 41 — Gases Reais e Pressão de Vapor:** gás ideal × van der Waals (8 gases), fator Z e Clausius-Clapeyron.
- **Módulo 42 — Radioatividade:** quantidade restante, datação, atividade (Bq, Ci) e energia de Δm (MeV).
- Comandos novos: `ph`, `calibracao`, `estatistica`, `vdw`, `vapor`, `radioatividade`, `decaimento`, `nuclear`. Faixa numérica 1–42; menu com 39 módulos e trilhas atualizadas.

## 12.0 — Guia de fundamentos aprofundado e Arrhenius/Van't Hoff
- **Módulo 24 com 21 tópicos (eram 16):** novos tópicos **17 Orgânica** (funções, IUPAC, isomeria, acidez, reações), **18 Termodinâmica** (Hess, entropia, ΔG, K, Van't Hoff), **19 Cinética** (leis integradas, Arrhenius, mecanismos, catálise), **20 Equilíbrio iônico** (ácidos fracos, tampões, hidrólise, polipróticos, Kps) e **21 Estrutura molecular** (VSEPR, hibridização, polaridade, orbitais moleculares). Cada um tem notas em 6 níveis, mnemônico, glossário, 3 exemplos resolvidos, erros comuns, aplicação real, aprofundamento e 8 perguntas com explicação (banco total: 192).
- **Módulo 38 — Arrhenius e Van't Hoff:** calcula Ea a partir de dois pontos (k, T), prevê k em outra temperatura e K em outra temperatura a partir de ΔH°. Comandos `arrhenius`, `vanthoff`. Entra na trilha "Gases e energia".
- Versão v12 construída sobre a v22 (todos os módulos anteriores mantidos); faixa de comandos 1–38; menu com 35 módulos.

## 22.0 — Química pura e ferramentas de bancada
- **Foco em química:** Quiz da Tabela Periódica (28), Detetive Químico (25) e Suíte de Testes (20) saíram do menu; continuam acessíveis pelos comandos `quiz`, `detetive` e `test`. Removidos o cursor piscante do título e o pulso da etiqueta NOVO. Menu reorganizado em seis grupos, com o novo "Soluções e bancada".
- **Módulo 35 — Concentrações e Reagentes Concentrados:** de HCl 37 %, HNO₃ 65 %, H₂SO₄ 98 % e outros (ou valores próprios), calcula mol/L, g/L, molalidade e fração molar, e diz quantos mL pipetar para preparar um volume e uma concentração desejados. Conversor entre mol/L, g/L, % m/v e ppm. Comandos `concentracao`, `reagente`.
- **Módulo 36 — Referência Rápida:** 10 indicadores ácido-base (com busca por pH), pKa de 15 ácidos e tampões e regras gerais de solubilidade. Comandos `referencia`, `indicador`.
- **Módulo 37 — Propriedades Coligativas:** ΔTf, ΔTb e pressão osmótica (água, benzeno, ácido acético; fator de van't Hoff). Comandos `coligativas`, `crioscopia`.
- Versão unificada v22 (cabeçalho, título, manifesto, `package.json`, cache `chemos-v22.0`). Faixa de comandos numéricos 1–37; novas trilhas "Propriedades das soluções" e Soluções e pH com o módulo 35.
- Conferido: HCl 37 % (d = 1,19) dá 12,08 mol/L e 41,4 mL para 500 mL de 1 mol/L.

## 11.5 — Espaço de tela, gráficos nítidos e tabela periódica rotulada
- **Gráficos nítidos em celular:** o motor de gráficos (cinética, titulações e laboratório) e os canvases da simulação molecular e do editor de estruturas agora compensam a densidade da tela (2x/3x). Antes eram desenhados em baixa resolução e esticados, ficando borrados. Também redesenham ao girar o celular ou redimensionar a janela, e a exportação PNG sai em resolução maior. Novo auxiliar `js/core/hidpi.js`.
- **Toque nos gráficos:** tocar na curva mostra o valor exato (antes só havia mouse); a dica na tela muda conforme o dispositivo.
- **Tabela periódica (módulo 7):** rótulos dos blocos **s, d e p**, dos **grupos 1–18** e dos **períodos 1–7** (inclusive 6 e 7 nas linhas do bloco f).
- **Mais espaço no celular:** a barra de comando e a linha de temas do rodapé saem da frente em telas de toque estreitas (a busca é o ícone da navegação inferior; os temas ficam em Ajustes). A área útil subiu de ≈ 588 para ≈ 664 px. No desktop, o foco do teclado não fica mais coberto pela barra de comando fixa.
- Cantos de painel restritos às caixas grandes (nas células da tabela ficavam pesados).
- `tests/audit.js` com **94 verificações** (inclui alta densidade, posições e rótulos da tabela periódica e as regras de layout).

## 11.4 — Acabamento visual
- **Início redesenhado:** título com brilho e cursor piscando, faixa de números (34 módulos, 16 tópicos de estudo, 100% no navegador, offline, sem cadastro), atalhos clicáveis (Buscar Ctrl+K, Ajuda F1, Testes F4), boas-vindas com acento lateral e trilhas em formato de sequência.
- **Cartões de módulo** com selo numérico, título e descrição alinhados; **seções** com ícone, linha tracejada e contagem; a marca "— NOVO" virou etiqueta.
- **Molduras com cantos de painel** nas caixas de conteúdo e fundo com malha de pontos discreta.
- **Caminho de navegação** nas telas de módulo (CHEM.OS ▸ grupo ▸ módulo), com retorno ao início.
- **Correção (desde a v10):** `--glow`, `--tint` e `--tint2` eram calculadas no `:root` e ficavam presas ao verde nos temas âmbar, azul, mono e papel; agora seguem o tema. Há teste de regressão.
- `tests/audit.js` com **89 verificações** (inclui estrutura visual e o teste do tema). Auditoria mobile (360 e 390 px) sem problemas.

## 11.3 — Módulo 34 e auditoria de segurança do GHS
- **Novo módulo 34 — Previsão do Produto na Eletrólise:** escolha o meio (aquoso ou fundido), o cátion, o ânion e o tipo de eletrodo; o módulo prevê o que se forma no cátodo e no ânodo, monta a **equação global** somando as semirreações e descreve a solução final (básica, ácida, consumida ou só água). Cobre Li⁺…Al³⁺, metais de transição, Ag⁺ e H⁺ com 11 ânions; avisa sobre sais pouco solúveis e combinações impossíveis. Comandos `previsao` e `descarga`.
- **Auditoria do GHS (módulo 2, PubChem) — correções de segurança:**
  - ausência de dados ou falha de rede agora avisa explicitamente que **isso não significa que a substância seja segura** (antes, a tela ficava em branco);
  - todas as frases de perigo aparecem, **as mais graves primeiro** (antes só as 4 primeiras, e as de perigo físico vinham antes das de saúde);
  - pictogramas pelo **código H** (Anexo 3 do GHS) e pelos pictogramas oficiais do PubChem, em vez de palavras-chave: corrige H318 (corrosão), H334/H340/H360/H370/H372 (saúde), que não eram reconhecidos, e H304, que era marcado errado como caveira;
  - **palavra de advertência** (Perigo/Atenção) e **tradução em português** das frases de perigo (H2xx–H4xx mais comuns); texto escapado contra HTML.
- `tests/audit.js` com **83 verificações** (15 de eletrólise e 14 de GHS); smoke e acessibilidade cobrem os 34 módulos; auditoria mobile (360 e 390 px) sem problemas.

## 11.2 — Módulo 33 (Eletrólise) e tópico 16 do guia
- **Novo módulo 33 — Eletrólise e Leis de Faraday:** deixe um campo em branco (corrente, tempo ou massa) e ele calcula; 13 substâncias (metais, e H₂, O₂ e Cl₂ com volume do gás ideal em T e P informadas), rendimento da corrente ajustável, exemplos prontos. Comando `eletrolise` ou `faraday`; entra na trilha Eletroquímica.
- **Guia de estudos, tópico 16 — Eletroquímica: pilhas e eletrólise** (notas, mnemônico, glossário, 2 exemplos resolvidos, "Aprofunde-se" e 10 perguntas). O banco do módulo 24 chega a **160 perguntas** (10 por tópico, 16 tópicos).
- **Correção importante de formato:** o pós-processador de resultados (`ux-v9`) reescreve "3.600" como decimal ("3,600"). Os módulos 32 e 33 deixaram de usar separador de milhar (ex.: `7200 C`, `−1140,5 kJ/mol`), seguindo o padrão do site. Há testes que travam isso.
- `tests/audit.js` com **54 verificações**; smoke, acessibilidade e UX cobrem os 33 módulos; auditoria mobile (360 e 390 px) sem problemas.

## 11.1 — Pilhas ampliadas e termodinâmica conferida
- **Módulo 32 com 36 semirreações (eram 28):** meio básico (O₂/OH⁻, H₂O/H₂), AgCl/Ag, H₂O₂, NO₃⁻/NO, Ce⁴⁺/Ce³⁺ e a **bateria de chumbo-ácido** (PbO₂/PbSO₄ e PbSO₄/Pb → 2,05 V). Novos exemplos: chumbo-ácido e célula alcalina H₂–O₂ (1,23 V, o mesmo valor do meio ácido, como deve ser).
- **Termodinâmica (módulo 9) conferida por inteiro:** as 37 entradas de ΔHf° e S° comparadas com a biblioteca *chemicals*; nenhuma divergência acima da tolerância (glicose por livros-texto; CO₂ aquoso não reconfirmado).
- Tópico Redox do módulo 24 agora aponta para os módulos 30 (NOX), 32 (Pilhas) e 12 (Nernst).
- `tests/audit.js` com 47 verificações (inclui a ordem crescente da série eletroquímica).

## 11.0 — Módulo 32 e versão unificada
- **Novo módulo 32 — Pilhas e Potenciais-Padrão:** escolha cátodo e ânodo entre 28 semirreações; calcula E°pilha, o número de elétrons (com os multiplicadores das semirreações), a notação da pilha, ΔG°, K e a equação de Nernst (com Q e T). Inclui exemplos prontos (Daniell, Zn–Ag, Fe–Cu, Al–Cu, H₂–O₂, Li–F₂), a série eletroquímica em tabela e um guia "Como ler uma pilha".
- **Dados conferidos em fontes externas:** as tabelas publicadas divergem em alguns pares (Fe²⁺/Fe −0,44 ou −0,41 V; Ca²⁺/Ca −2,87 ou −2,76 V; MnO₄⁻/Mn²⁺ +1,49 a +1,52 V). O módulo usa valores modernos (CRC/LibreTexts, 2 casas) e avisa disso na tela.
- Comando `pilha` (também `galvanica`, `eletroquimica`); trilha **Eletroquímica** (NOX → Pilhas → Nernst); contagens, textos e ajuda atualizados para 32 módulos.
- Versão unificada **v11** (cabeçalho, título, sobre, manifesto, `package.json`, cache `chemos-v11.0`).
- Testes: smoke, acessibilidade e UX cobrem os 32 módulos; `tests/audit.js` com **45 verificações** (7 casos de pilhas e a tabela de E°). Auditoria mobile (360 e 390 px) sem problemas nos 32 módulos.

## 10.4 — Revisão completa dos dados e do módulo 24
- **118 elementos conferidos** contra os conjuntos de referência *mendeleev* e *periodictable*: símbolos, números atômicos, períodos, grupos e categorias corretos; massas corretas (exceto convenções de isótopo nos superpesados, que seguem as listas atuais).
- **Correção:** energia de ionização do Tc de 7,28 eV (dado dos anos 1950) para **7,119 eV** (medida de 2010, Phys. Rev. A 81, 052513).
- Eletronegatividade: 11 diferenças em relação à biblioteca de referência, todas por uso da escala de Pauling revisada (W 2,36, Pb 2,33, Au 2,54…), confirmadas em Wikipedia (página de dados), WebElements e handbook KnowledgeDoor. Mantidas.
- **Módulo 24, teoria e 75 perguntas originais revisadas** (nenhuma resposta errada): 5 ajustes de redação (pergunta com alternativa "Plasma" ambígua; "ferro trivalente apenas em inglês" falso; mnemônico confundindo força do ácido com acidez; nota de grupos limitada aos grupos principais; faixa usual do pH).
- `tests/audit.js` agora com 37 verificações (inclui coerência dos 118 elementos e o valor do Tc).

## 10.3 — Auditoria de precisão, mais ensino e mobile
- **Auditoria dos 31 módulos:** nenhum erro de console, botão sem função ou estouro lateral; mais de 30 casos de resposta conhecida conferidos (todos corretos). Tabelas de dados comparadas com valores de tabelas de referência padrão (amostras de 24 a 55 itens por tabela): massas atômicas 55/55, Pauling 45/45, ionização 31/31, termodinâmica 24/24.
- **`tests/audit.js` (36 verificações):** casos numéricos, tabelas, banco de perguntas e busca; rode com `npm run test:audit`.
- **Termoquímica:** adicionados C₃H₈(g), H₂O₂(l), HF(g) e NH₄Cl(s).
- **Módulo 24:** banco de perguntas de 105 para **150** (10 por tópico, todas com explicação).
- **Busca tolerante a plural e sem acento:** "ligacao" acha "Ligações", "acidos" acha "ácido", "gases" acha "gás".
- **Celular:** alvos de toque ≥ 40 px (títulos "Teoria…", botões ⇄ de unidade, editor de estruturas); verificado em 360 px e 390 px.
- Seção "Verificação" em Sobre e limitações.
- Testes agora esperam a tela inicial carregar de verdade (antes esperavam 3 s fixos e falhavam na primeira execução com servidor frio).

## 10.2 — Busca sem acento
- **Correção:** os filtros não ignoravam acentos ("titulacao" e "equilibrio" retornavam 0 resultados). Agora a busca ignora acentos e maiúsculas no filtro do início, na paleta Ctrl+K, no filtro da Tabela Periódica ("helio" → Hélio, "cesio" → Césio), no glossário e no filtro do módulo 24.

## 10.1 — Acabamento profissional
- Ícones PNG (192/512/maskable), favicon SVG e apple-touch-icon locais (antes dependia de imagem externa); manifesto completo.
- Metadados de compartilhamento (Open Graph/Twitter), `noscript` claro e tela de carregamento.
- Seção **Privacidade** em "Sobre"; versões unificadas em v10.
- **Tabela Periódica (módulo 7) no formato oficial** (grupos 1–18, períodos 1–7, lantanídeos/actinídeos abaixo); antes os 118 elementos apareciam em fileiras sequenciais de 18.
- Tabelas, links, impressão e medida de leitura padronizados.

## 10.0 — UI/UX, ensino e robustez
- Camada de refinamento visual e de teclado (`ui-v10`): sem pulo de rolagem, Enter calcula, setas nos cartões, voltar ao topo.
- Módulo 24 PLUS: progresso, sequência, simulado, revisão do dia, flashcards, "Aprofunde-se" e 105 perguntas.
- Carregamento em botões de rede, avisos de erro, instalação PWA, `aria-live` nos resultados.
- Correção do carregamento de estilos (CSS crítico embutido e service worker rede-primeiro).
