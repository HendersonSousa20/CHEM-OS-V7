# Changelog

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
