# CHEM.OS v10 — Refinamento de UI/UX

* **Início sem "pulo":** focar a linha de comando não rola mais a página para o fim; cada troca de tela volta ao topo.
* **Cartões de módulo** com realce, brilho e barra lateral ao passar o mouse/focar; botões com estado pressionado e foco bem visível.
* **Campos** com brilho ao focar; **resultados** piscam suavemente quando mudam; tabelas largas rolam dentro do próprio bloco.
* **Cabeçalho e linha de comando fixos** (com desfoque), botão **↑ voltar ao topo**.
* **Celular:** cabeçalho enxuto, alvos de toque de 44 px, rodapé sem atalhos de teclado.
* **Enter calcula:** em qualquer módulo, Enter num campo aciona o botão da própria linha (ex.: BUSCAR) ou o botão principal (CALCULAR...).
* **Foco automático** no primeiro campo ao abrir um módulo (computador) e **seleção do valor** ao focar, para digitar por cima.
* **Legibilidade:** textos pequenos têm tamanho mínimo maior; resultados ganham barra lateral e fundo próprio.
* Textos desatualizados corrigidos (boas-vindas "v7.0 / 24 módulos" → v10 / 31 módulos).

* Estilos novos em `css/ui-v10.css` e `js/core/ui-v10.js`. Depois de editar qualquer `css/*.css`, rode `node build-inline.js` (ou `npm run build:inline`) para atualizar o CSS embutido no `index.html`.

# CHEM.OS v9.6 — Novidades

* **Conversor de unidade ao lado dos campos (⇄):** 30 campos (volume em mL ou L, pressão em atm, temperatura em K, concentração em mol/L) têm um botão que converte de outra unidade (mmHg, kPa, °C, °F, mL, µL, mmol/L...) e escreve o valor no campo.
* **Trilhas:** no fim de cada módulo, botões para o módulo anterior e o próximo da trilha.
* **Balanceador:** passo a passo com a conferência de átomos de cada elemento nos dois lados.
* Atalho **?** abre a ajuda.

## v9.5 — Novidades

* **Vírgula decimal padronizada:** os resultados dos cálculos agora aparecem com vírgula (pt-BR), igual ao passo a passo. Em Ajustes dá para voltar a "como vem do módulo". Fórmulas (CuSO4.5H2O), nomes IUPAC e os módulos PubChem/Nomenclatura não são alterados.

## v9.4 — Novidades

* **Passo a passo na estequiometria (módulo 8):** mols de cada reagente, divisão pelos coeficientes, reagente limitante e massa teórica dos produtos — 15 módulos no total.
* **"Sobre e limitações"** (Ajustes → Sobre, ou Ctrl+K): de onde vêm os dados, o que é aproximado e o que ainda não foi revisado por um professor.

## v9.3 — Novidades

* **Passo a passo em mais três módulos:** massa molar (3), termoquímica (9, o passo ΔG° = ΔH° − T·ΔS°) e constante de equilíbrio Kc (15) — agora são 14 módulos.
* **Roteiro de teste de usabilidade** em `docs/ROTEIRO-TESTE-USABILIDADE.md`: tarefas, folha de registro, perguntas finais e questionário SUS.

## v9.2 — Novidades

* **Passo a passo em mais cinco módulos:** cinética (14), titulação forte-forte (16), Beer-Lambert (17), titulação de ácido fraco (18) e solubilidade/Kps (19) — agora são 11 módulos com passo a passo conferido contra o resultado do módulo.

## v9.1 — Novidades

* **Passo a passo dos resultados** nos módulos 4 (preparo), 5 (diluição), 6 (ácido fraco), 10 (tampão), 11 (gases) e 12 (Nernst): fórmula, substituição com os seus números e unidades. O passo a passo é recalculado de forma independente e **só aparece se concordar (±1 %) com o resultado do módulo**.

## v9.0 — Novidades (UX)

* **Início:** descrição de uma linha em cada módulo (também pesquisável), **trilhas sugeridas** com ✓ nos módulos já visitados, botão "Continuar" e caixa de boas-vindas na primeira visita.
* **Em cada módulo:** descrição + painel "Teoria, fórmula e glossário" (com termos como Ka, pKa e Kps explicados ao passar o mouse).
* **Cálculo ao vivo** (⚡) em 17 módulos: o resultado aparece ao abrir e atualiza ao digitar; liga/desliga em Ajustes. **Casas decimais** configuráveis (2, 3, 4, 6 ou automático).
* **Celular:** barra inferior (Menu, Buscar, Favoritos, Ajustes), ações do módulo recolhidas em "⋯ MAIS" e painel de **Ajustes** com tema, texto, efeitos e backup.
* **Modo leitura:** fonte mais legível, espaçamento maior e sem efeito CRT.
* **Internet:** indicador "Consultando servidor…", botão **CANCELAR** e mensagem clara quando está offline.
* **Favoritos e progresso:** painel único com módulos visitados, favoritos, recentes, histórico e quiz.
* Botões e campos padronizados em todos os módulos.

## v8.17

* **Editor de estruturas:** nova ferramenta **MOVER** — arraste átomos com mouse, toque ou caneta para reposicionar a estrutura (o desfazer/refazer acompanha cada movimento).
* **Tabela periódica:** o contraste do texto sobre as cores de fundo das células agora é verificado nos 5 temas e 4 famílias de modos de cor (`npm run test:contrast`); a intensidade da cor nos modos de propriedade foi reduzida de 40 % para 30 % para o tema âmbar passar de 4,5:1.

## v8.16

* **Editor de estruturas (Módulo 21):** botão e atalho **Refazer** (Ctrl+Y ou Ctrl+Shift+Z), **11 modelos prontos** (água, amônia, metano, etano, eteno, etino, metanol, etanol, CO₂, ácido acético, benzeno), **aviso de valência excedida** (anel vermelho no átomo e mensagem), aviso de **partes desconectadas** e **grau de insaturação** calculado a partir da fórmula.

## v8.15

* **Contraste WCAG nos 5 temas** (verde, âmbar, azul, mono, papel), conferido por `npm run test:contrast`: texto base, textos esmaecidos, cores de OK/erro/aviso e as cores Tailwind de texto usadas. Corrigidos: erros e avisos ilegíveis no tema PAPEL (verde-limão e vermelho claro sobre fundo creme), vermelho no tema AZUL e texto auxiliar muito apagado.

## v8.14

* **Acessibilidade (auditada em todos os módulos com `npm run test:a11y`):** todos os campos têm nome para leitores de tela; os controles clicáveis (como as células da tabela periódica) funcionam com Tab, Enter e Espaço; os gráficos têm rótulo; a troca de módulo é anunciada; o diálogo modal prende o foco, devolve o foco ao fechar e tem papel de diálogo; animações e o efeito CRT são desligados para quem pede "reduzir movimento" no sistema.

## v8.13

* **Simulação molecular:** sub-passos automáticos quando as partículas são rápidas (evita que atravessem umas às outras) e **8 gases novos** (He, Ne, Ar, CH₄, CO₂, Cl₂, Kr, Xe).
* **Laboratório virtual:** o relatório agora desenha o **gráfico da derivada** (inclinação × volume) com o ponto estimado e o teórico.

## v8.12

* **Laboratório virtual (Módulo 23):** o relatório ganhou a **análise pela 1ª derivada** (estima o ponto de equivalência pelo máximo de ΔLeitura/ΔV, compara com o valor teórico e avisa se faltam pontos perto do salto) e **exportação CSV** dos dados (separador `;`, vírgula decimal, abre direto no Excel pt-BR).
* **Atalhos na bancada:** A (+1 mL), S (+0,1 mL), D (+0,05 mL), Z (desfazer), R (registrar ponto), V (marcar viragem).
* `npm run test:lab` confere a derivada com uma curva de titulação calculada.

## v8.11

* **Simulação molecular:** passo de tempo fixo (1/60 s) — a velocidade agora é a mesma em monitores de 60, 120 ou 144 Hz. Novo controle de **volume da caixa** (pistão): reduzir o volume aumenta a pressão e **P × A fica ≈ constante** (lei de Boyle). O teste `npm run test:sim` verifica essa relação.

## v8.10

* **Simulação molecular (Módulo 22):** velocidade 0,25×/0,5×/1× (câmera lenta), partículas coloridas pela velocidade (azul lenta → vermelha rápida) e **pressão relativa nas paredes**, medida pelo impulso das colisões — dobrar N ou T dobra a pressão (P ∝ N·T). `npm run test:sim` verifica isso.

## v8.9

* **Tabela Periódica:** novos modos de cor **1ª energia de ionização (eV)** e **raio atômico (pm)**, com legenda e valores no painel de detalhes (dados em `js/data/periodic-properties.js`).
* **Editor de estruturas (Módulo 21):** Ctrl/Cmd+Z desfaz a última ação.
* **Testes numéricos dos módulos de cálculo:** `npm run test:calc` confere pH de ácido fraco, tampão, diluição, gás ideal, preparo de solução, titulação e Nernst pela própria interface.

## v8.8

* **Módulo 31 — Eletronegatividade e tipo de ligação:** ΔEN de Pauling entre dois elementos → apolar / polar / iônica, caráter iônico percentual, direção do dipolo (δ+ → δ−) e exemplos prontos. Dados locais (Z = 1–92, sem He, Ne, Ar). Comando: `ligacao`.
* **Tabela Periódica:** novo modo de cor "Eletronegatividade (Pauling)" e o valor no painel de detalhes.

## v8.7

* **Tabela Periódica — modos de cor:** além de Categoria, agora dá para colorir por **massa atômica** (gradiente), **período** ou **bloco s/p/d/f**, com legenda própria. A impressão (botão PDF) mantém as cores.

## v8.6

* **Tabela Periódica (Módulo 7):** células coloridas por categoria, legenda clicável que destaca uma família (combina com a busca) e bloco "DADOS LOCAIS" ao clicar num elemento — massa, grupo, período, bloco e **configuração eletrônica calculada** (Madelung + 19 exceções), tudo offline. A busca salva também é reaplicada ao reabrir o módulo.

## v8.5

* **Módulo 30 — Número de oxidação (NOX):** calcula o NOX do elemento sem regra fixa (KMnO4 → Mn +7; Cr2O7 com carga 2- → Cr +6; Fe3O4 → +8/3), aceita íons e mostra a tabela de regras aplicadas. Comando: `nox`.
* **Links com valores:** o botão LINK copia um endereço (`#/m/4?p-conc=0.5&...`) que reabre o módulo com os campos preenchidos e já calcula.
* **Ajuda (F1):** nova seção com os atalhos e comandos da v8.

## v8.4

* **Módulo 29 — Mol, massa e composição percentual:** fórmula + massa (ou mols) → massa molar, mols, unidades-fórmula, átomos de cada elemento e % em massa com barras. Comando: `mol`.
* **Balanceador (Módulo 1):** lista de 8 reações prontas para carregar e balancear com um clique.
* **Quiz:** modo "Revisar meus erros" — os elementos errados ficam salvos e voltam até você acertar.

## v8.3

* **Módulo 27 — Fórmula empírica e molecular:** a partir de % em massa (ou gramas) de cada elemento, mostra mols, razões, fórmula empírica e, se informada a massa molar, a molecular. Comando: `formula`.
* **Módulo 28 — Quiz da Tabela Periódica:** 10 perguntas em 4 modos (símbolo, nome, nº atômico, família) e 3 faixas de elementos, com teclas 1–4 e recorde salvo. Comando: `quiz`.

## v8.2

* **Fontes locais:** VT323 e IBM Plex Mono agora ficam em `fonts/` (licença OFL) e são carregadas por `css/fonts.css`. O Google Fonts foi removido: sem conexões externas para o visual, sem atraso de fonte e 100 % offline.
* **Suíte de testes ampliada (Módulo 20):** casos para o conversor de unidades e para a leitura de vírgula decimal.

## v8.1

* **CSS compilado:** o Tailwind via CDN foi removido. O visual agora vem de `css/tailwind.css` (local), então carrega mais rápido e funciona 100% offline. Para regerar após mudar classes: `npm install && npm run build:css`.
* **Validação de campos:** valores impossíveis (negativos, pureza > 100 %, nº de elétrons não inteiro) são sinalizados na hora, sem bloquear o cálculo.

## v8.0

* **Módulo 26 — Conversor de unidades** (pressão, energia, volume, massa, temperatura), ao vivo, com vírgula ou ponto decimal.
* **Tema PAPEL (claro)** e controle de tamanho do texto (A− / A+), lembrados entre sessões.
* **Backup e restauração** de favoritos, histórico, campos e progresso (paleta Ctrl+K → "Exportar backup").
* Menu categorizado com busca, paleta de comandos (Ctrl+K), links por módulo (`#/m/N`), favoritos e recentes.
* Campos lembrados por módulo, histórico de cálculos (`historico`), copiar/TXT/PDF dos resultados, vírgula decimal global.
* Instalável e offline (PWA) em https ou localhost. Código das melhorias em `js/core/ux-extras*.js`, `v8-extras.js` e `js/modules/unit-converter.js`.

---

# DOCUMENTAÇÃO TÉCNICA E FUNCIONAL — CHEM.OS v7.0
**Enterprise Laboratory Engine & Chemical Computation Suite**

---

## 1. VISÃO GERAL DO SISTEMA

O **CHEM.OS v7.0** é uma suíte computacional completa para laboratórios químicos, ensino universitário e pesquisa, desenvolvida em arquitetura *Multi-File Web Application* (MFA, sem bundler/build step) com interface retrô estilo *CRT Terminal/DOS* — ver seção 2.0 para a estrutura de arquivos. 

O sistema integra **25 módulos numéricos, analíticos, de simulação, de experimentação guiada, de estudo e de investigação**, cobrindo desde a estequiometria clássica até o equilíbrio iônico complexo, eletroquímica, cinética, termodinâmica e espectroscopia. Além do motor interno de simulação e cálculo algébrico exato, a aplicação faz integrações assíncronas em tempo real com APIs internacionais de dados químicos de alto nível (PubChem REST, PUG View, OPSIN, CACTUS e Wikipedia API).

**Convenção visual de ícones:** para manter a estética retrô/CRT coerente em toda a interface, nenhum ícone da aplicação usa emoji colorido — todos são tags textuais entre colchetes (ex: `[LAB]`, `[EDT]`, `[MOL]`) ou pequenos SVG vetoriais monocromáticos desenhados sob medida (caso dos pictogramas de perigo GHS no Módulo 2, que seguem a convenção real de símbolo preto sobre fundo branco/losango vermelho). Símbolos tipográficos simples (→, ←, ✓, ✗) são mantidos por serem glifos de texto monocromáticos, não emoji.

---

## 2. ARQUITETURA TÉCNICA & STACK TECNOLÓGICO

### 2.0 Estrutura de Arquivos do Projeto

A partir desta versão, o CHEM.OS deixou de ser um único arquivo monolítico e passou a seguir uma **arquitetura modular por responsabilidade** (*separation of concerns*), sem build step e sem dependências de bundler — continua sendo Vanilla JS puro, apenas organizado em múltiplos arquivos carregados via `<script src="...">` em ordem de dependência. Isso facilita manutenção, revisão de código (*code review*), controle de versão granular (diffs por módulo) e onboarding de novos colaboradores.

```
CHEM-OS-V7-main/
├── index.html                        # Shell da aplicação: <head>, layout (header/main/footer/modal)
│                                      # e a lista ordenada de <script src> — sem lógica de negócio.
├── README.md                         # Esta documentação.
├── css/
│   └── styles.css                    # Todo o CSS customizado (temas CRT, .dos-border, .dos-btn, scrollbar, etc.)
└── js/
    ├── data/
    │   └── periodic-table-data.js    # RAW_ELEMENTS (1–118) + ATOMIC_WEIGHTS (dados puros, sem lógica).
    ├── core/                         # Motores e integrações reutilizados por múltiplos módulos.
    │   ├── formula-engine.js         # parseFormula() + balanceChemicalEquation() (álgebra linear racional).
    │   ├── api-utils.js              # Cache leve (sessionStorage, 30 min) + timeout (15s) para chamadas de API.
    │   ├── pubchem-api.js            # Integração PubChem PUG-REST / PUG-VIEW / Periodic Table JSON.
    │   ├── name-resolver-api.js      # Integração OPSIN (Cambridge) + CACTUS (NCI) + Wikipedia REST.
    │   ├── ui-system.js              # Áudio (Web Audio API), temas, modal, CRT toggle, helpers de UI.
    │   └── chart-engine.js           # Motor de gráficos em Canvas puro (zoom, pan, crosshair, export PNG).
    ├── render/
    │   └── screens.js                # renderHome() e renderTool() — monta o HTML de cada uma das 22 telas.
    └── modules/                      # Lógica de execução específica de cada grupo de módulos.
        ├── basic-tools.js            # Módulos 1–7 e núcleo dos módulos numéricos originais.
        ├── periodic-table-render.js  # Renderização responsiva da grade da Tabela Periódica (Módulo 7).
        ├── advanced-tools.js         # Módulos científicos avançados (cinética, titulação, eletroquímica...).
        ├── test-suite.js             # Módulo 20 — suíte de testes automatizados (QA).
        ├── structure-editor.js       # Módulo 21 — editor de estruturas químicas 2D.
        ├── molecular-simulation.js   # Módulo 22 — simulação molecular (teoria cinética dos gases).
        ├── guided-experiments.js     # Módulo 23 — laboratório virtual de experimentos guiados.
        ├── general-chemistry-guide.js # Módulo 24 — guia de estudos de Química Geral (conteúdo original).
        └── chemistry-detective.js    # Módulo 25 — jogo de identificação de cátions (química analítica qualitativa).
```

**Ordem de carregamento:** os `<script>` em `index.html` seguem estritamente a ordem de dependência (dados → motores centrais → renderização → módulos de execução → `js/app.js` por último, que registra os eventos globais do CLI e dispara `renderHome()` ao final do boot). Como são scripts clássicos (não ES Modules), todos compartilham o mesmo escopo global — o comportamento é **idêntico** ao arquivo único anterior, apenas fisicamente separado em arquivos menores e coesos.

**Executar o projeto:** por ser HTML/CSS/JS puro sem bundler, basta abrir `index.html` diretamente no navegador (`file:///.../index.html`) — os `<script src>` locais carregam normalmente por esse protocolo. Para desenvolvimento é recomendável usar um servidor estático simples (evita eventuais restrições de cache/CORS do navegador e facilita hot-reload manual), por exemplo:
```bash
# Python (já vem instalado na maioria dos sistemas)
python3 -m http.server 8080 --directory CHEM-OS-V7-main

# ou Node.js
npx http-server CHEM-OS-V7-main -p 8080
```
Depois é só acessar `http://localhost:8080`.

### 2.1 Stack Tecnológico
* **Linguagem Base:** HTML5 / CSS3 / JavaScript Vanilla (ES6+ assíncrono com `async/await` e `fetch`), organizado em múltiplos arquivos por responsabilidade (ver seção 2.0).
* **Framework de Estilização:** Tailwind CSS (via CDN) com extensão de temas customizados e *CSS Custom Properties* (`var(--text-color)`, `var(--bg-color)`, `var(--border-color)`), complementado por `css/styles.css` para as classes específicas do tema CRT/DOS.
* **Tipografia:** Google Fonts (`VT323` para sensação de terminal CRT e `IBM Plex Mono` para legibilidade de dados numéricos).
* **Renderização Gráfica:** HTML5 Canvas API para plotagem vetorial e em tempo real de curvas de titulação, pH, histogramas de velocidade molecular e desenho de estruturas 2D.
* **Sintetizador de Áudio:** Web Audio API (`AudioContext`) para geração de *beeps* e *feedbacks* sonoros programáticos através de osciladores de onda quadrada sem dependência de arquivos de áudio externos.

### 2.2 Estrutura da Interface e UX
* **Efeito CRT e Scanlines:** Controlado via a classe `.crt` com gradiente fixo e efeito de pulso, podendo ser ativado/desativado instantaneamente.
* **Temas de Cor Dinâmicos:** Suporte alternável via footer entre **Verde Fosforoso** (Clássico), **Âmbar** (VT100), **Azul DOS** e **Monocromático**.
* **Linha de Comando (CLI):** Prompt interativo `<input id="cli-input">` presente de forma fixa no rodapé da viewport para entrada direta de números de módulos, comandos expressos ou parâmetros de cálculo.
* **Sistema de Modais:** Janela flutuante (`#modal`) centralizada para exibição de ajudas, termos, tabelas e avisos sem perda de estado do módulo ativo.

---

## 3. ESPECIFICAÇÃO DOS MÓDULOS (1 AO 25)

### Módulo 1: Balanciador Real de Equações Químicas (Álgebra Linear)
* **Função:** Determinar os coeficientes estequiométricos inteiros mínimos para equações químicas complexas.
* **Características:** Aceita parênteses `()`, colchetes `[]`, chaves `{}` e hidratos marcados por ponto (ex: `CuSO4.5H2O` ou `K4[Fe(CN)6] + KMnO4 + H2SO4 -> KHSO4 + Fe2(SO4)3 + MnSO4 + HNO3 + CO2 + H2O`).
* **Algoritmo:** Converte a reação química em um sistema de equações lineares homogêneas $A \cdot x = 0$, resolvido por Eliminação Gaussiana sob Aritmética de Números Racionais exatos para evitar erros de ponto flutuante.

### Módulo 2: Consulta PubChem API + GHS Safety + Wikipedia
* **Função:** Busca avançada de substâncias por nome comum ou sistemático.
* **Saída:** 
  * Estrutura química 2D renderizada em alta definição.
  * Identificadores universais (CID, Fórmula Molecular, Massa Molar, SMILES Canônico).
  * Informações físico-químicas (Ponto de Fusão, Ponto de Ebulição, Densidade, $pK_a$).
  * **Alertas de Segurança GHS (*Hazard Statements*):** Exibição de frases de risco H (ex: H301, H314).
  * Contexto científico extraído dinamicamente da REST API da Wikipedia.

### Módulo 3: Calculadora de Massa Molar Avançada
* **Função:** Processa fórmulas moleculares complexas com múltiplos níveis de agrupamento (`()`, `[]`, `{}`) e moléculas de solvatação/hidratação (`.`).
* **Saída:** Massa molar exata em $\text{g/mol}$ calculada com base na Tabela IUPAC integrada.

### Módulo 4: Preparo de Soluções com Auto-Busca de Densidade
* **Função:** Calcula a massa exata de soluto necessária para preparar um volume definido em uma dada molaridade ($\text{mol/L}$), ajustando por **pureza (%)**.
* **Diferencial:** Integração com botão **"BUSCAR API"**, que preenche automaticamente a Massa Molar e a Densidade ($\text{g/mL}$) diretamente do banco de dados PubChem, informando também o volume líquido a ser pipetado caso o soluto seja um reagente líquido.

### Módulo 5: Calculadora de Diluição Interativa ($C_1 \cdot V_1 = C_2 \cdot V_2$)
* **Função:** Resolve qualquer variável desconhecida na equação de diluição clássica.
* **Funcionamento:** O usuário preenche três dos quatro campos ($C_1$, $V_1$, $C_2$, $V_2$) e deixa a incógnita desejada em branco. O sistema detecta automaticamente o campo ausente e efetua o cálculo.

### Módulo 6: pH de Ácidos Fracos + Auto-Busca de $pK_a$
* **Função:** Determinação do pH de ácidos fracos monopróticos em qualquer concentração.
* **Mecanismo:** Executa a solução exata da equação do segundo grau derivada do equilíbrio de ionização $K_a = \frac{[H^+][A^-]}{[HA]}$:

$$
[H^+] = \frac{-K_a + \sqrt{K_a^2 + 4 \cdot K_a \cdot C}}{2}
$$

* **API:** Botão para consulta automática do $pK_a$ da substância via PUG-VIEW REST API.

### Módulo 7: Tabela Periódica IUPAC com Caching Local
* **Função:** Exibição interativa da Tabela Periódica dos Elementos (1 a 118 - Hidrogênio ao Oganessônio).
* **Recursos:** Filtro dinâmico por nome, símbolo ou número atômico, visualização responsiva e detalhamento de dados avançados (Configuração Eletrônica, Raio Atômico, Eletronegatividade de Pauling, Energias de Ionização, Estados de Oxidação) obtidos via PubChem PeriodicTable JSON API.

### Módulo 8: Estequiometria (Reagente Limitante e Rendimento)
* **Função:** Processa reações químicas para determinar o reagente limitante, reagentes em excesso, massa teórica de produtos formados e rendimento percentual de reação com base em uma massa real obtida no laboratório.

### Módulo 9: Termoquímica ($\Delta H^\circ$, $\Delta S^\circ$, $\Delta G^\circ$)
* **Função:** Cálculo do Enthalpy ($\Delta H^\circ$), Entropy ($\Delta S^\circ$) e Energia Livre de Gibbs ($\Delta G^\circ$) de uma reação a qualquer temperatura em Kelvin.
* **Base de Dados:** Contém um banco de dados termodinâmico local com parâmetros padrão ($\Delta H_f^\circ$ e $S^\circ$) para cerca de 30 compostos comuns em fases sólida $(s)$, líquida $(l)$, gasosa $(g)$ e aquosa $(aq)$.
* **Análise:** Indica se a reação é exotérmica/endotérmica e avalia a espontaneidade da reação ($\Delta G < 0$).

### Módulo 10: Tampões (Equação de Henderson-Hasselbalch)
* **Função:** Cálculo do pH de soluções tampão compostas por um ácido fraco e sua base conjugada:

$$
\text{pH} = pK_a + \log_{10}\left(\frac{[\text{Base Conjugada}]}{[\text{Ácido Fraco}]}\right)
$$

* **Análise:** Avalia a razão molar e informa a proximidade da capacidade tamponante máxima.

### Módulo 11: Lei dos Gases (Ideal e Combinada)
* **Função Dupla:**
  1. **Lei Combinada dos Gases:** Resolve estados iniciais e finais ($\frac{P_1 V_1}{T_1} = \frac{P_2 V_2}{T_2}$) deixando uma das seis variáveis como incógnita.
  2. **Lei dos Gases Ideais ($P \cdot V = n \cdot R \cdot T$):** Resolve qualquer uma das quatro variáveis usando a constante universal de CODATA $R = 0{,}08206 \text{ atm}\cdot\text{L}/(\text{mol}\cdot\text{K})$.

### Módulo 12: Eletroquímica (Equação de Nernst)
* **Função:** Calcula o potencial elétrico real ($E$) de uma célula eletroquímica/pilha fora das condições padrão:

$$
E = E^\circ - \frac{R \cdot T}{n \cdot F} \ln(Q)
$$

* **Parâmetros:** Considera a constante dos gases $R = 8{,}314 \text{ J/(mol}\cdot\text{K)}$, constante de Faraday $F = 96485 \text{ C/mol}$, temperatura em Kelvin, número de elétrons transferidos ($n$) e quociente de reação ($Q$).

### Módulo 13: Resolvedor de Nomenclatura (OPSIN + CACTUS)
* **Função:** Traduz nomes IUPAC sistemáticos em estruturas químicas e identificadores universais.
* **Integração:** Conecta-se à API OPSIN (Universidade de Cambridge) e ao resolvedor CACTUS (National Cancer Institute - NCI) para retornar SMILES, InChIKey, Número CAS e Fórmula Estrutural.

### Módulo 14: Cinética Química (Ordens 0, 1 e 2)
* **Função:** Aplica as leis de velocidade integradas para reações de ordem zero, primeira ordem e segunda ordem.
* **Cálculos:** Determina o tempo de meia-vida ($t_{1/2}$) e a concentração restante do reagente $[A]$ em um tempo $t$ específico.

### Módulo 15: Equilíbrio Químico (Constante $K_c$)
* **Função:** Determina a constante de equilíbrio em termos de concentração ($K_c$) a partir da equação química balanceada e das concentrações das espécies no estado de equilíbrio:

$$
K_c = \frac{\prod [\text{Produtos}]^{\nu_p}}{\prod [\text{Reagentes}]^{\nu_r}}
$$

### Módulo 16: Curva de Titulação Ácido Forte + Base Forte
* **Função:** Simulação rigorosa de titulação volumétrica forte-forte (ex: $\text{HCl} + \text{NaOH}$).
* **Interface Gráfica:** Plota em tempo real via HTML5 Canvas o gráfico completo do pH em função do volume de titulante adicionado, destacando o ponto de equivalência em $\text{pH} = 7{,}00$.

### Módulo 17: Espectroscopia (Beer-Lambert + Conversões $\lambda/\nu/E$)
* **Funções Integradas:**
  1. **Lei de Beer-Lambert ($A = \varepsilon \cdot b \cdot c$):** Calcula Absorbância, Absortividade Molar, Caminho Óptico ou Concentração.
  2. **Conversão Quântica de Fótons:** Converte o comprimento de onda ($\lambda$ em $\text{nm}$) para Frequência ($\nu$ em $\text{Hz}$), Energia por fóton ($\text{J}$ e $\text{eV}$) e Energia por mol de fótons ($\text{kJ/mol}$), identificando a região do espectro eletromagnético.

### Módulo 18: Titulação Ácido Fraco + Base Forte (Solução Exata)
* **Função:** Simulação avançada de titulação de ácidos fracos (ex: Ácido Acético com $\text{NaOH}$).
* **Precisão Matemática:** Divide a curva de titulação em 4 regiões físico-químicas distintas:
  1. *Início:* pH do ácido fraco puro via equação quadrática.
  2. *Região Tampão:* Equação de Henderson-Hasselbalch.
  3. *Ponto de Equivalência:* Hidrólise do sal (ânion básico) via $K_b = \frac{K_w}{K_a}$.
  4. *Pós-Equivalência:* Excesso de base forte $[OH^-]$.
* **Gráfico:** Plotagem gráfica interativa com indicação visual do ponto de equivalência.

### Módulo 19: Solubilidade e Produto de Solubilidade ($K_{ps}$)
* **Função:** Determina a solubilidade molar ($s$, em $\text{mol/L}$) para sais levemente solúveis $A_p B_q \rightleftharpoons p A^{z+} + q B^{z-}$.
* **Efeito do Íon Comum:** Permite inserir a concentração pré-existente de um dos íons na solução, calculando a redução drástica da solubilidade pelo Princípio de Le Chatelier.

### Módulo 20: ⚙ Suíte de Testes Automatizados (QA Engine)
* **Função:** Módulo de garantia de qualidade e integridade do código (*Unit Testing Framework* interno).
* **Mecanismo:** Executa bateria de testes automatizados validados contra a literatura internacional para certificar a precisão dos motores de cálculo.

### Módulo 21: ✏ Editor de Estruturas Químicas (2D)
* **Função:** Editor gráfico de conectividade molecular em Canvas — inserção de átomos, criação/ciclagem de ligações (simples/dupla/tripla) e remoção, com ferramentas dedicadas (Átomo, Ligação, Apagar).
* **Cálculo Automático:** Fórmula molecular (sistema de Hill) e massa molar calculadas em tempo real, com preenchimento automático de hidrogênios implícitos por valência padrão (C=4, N=3, O=2, S=2, P=3, halogênios=1, B=3, Si=4).
* **Integração:** Botão de envio direto da fórmula gerada para o Módulo 3 (Massa Molar). Suporta desfazer, limpar e exportação da estrutura como PNG.

### Módulo 22: ⚛ Simulação Molecular (Teoria Cinética dos Gases)
* **Função:** Simulação de partículas em 2D com colisões elásticas (esferas rígidas), onde as velocidades iniciais são amostradas da **distribuição de Maxwell-Boltzmann** real (via transformação de Box-Muller) a partir da temperatura e massa molar escolhidas.
* **Parâmetros:** Seleção de gás (H₂, He, CH₄, H₂O, N₂, O₂, Ar, CO₂, Cl₂ ou massa molar personalizada), temperatura (K) e número de partículas.
* **Leituras em Tempo Real:** $v_{rms}$ simulado, $v_{rms}$ teórico clássico ($\\sqrt{3RT/M}$), temperatura instantânea (via energia cinética média) e histograma de velocidades com a curva teórica de Maxwell-Boltzmann 2D sobreposta.
* **Nota de Escala:** A energia cinética total do sistema é conservada exatamente nas colisões (validado numericamente); a velocidade de deslocamento na tela usa uma escala visual fixa para permanecer perceptível, mas os valores numéricos de $v_{rms}$ exibidos são sempre os reais, em m/s.

### Módulo 23: 🧪 Experimentos Guiados (Laboratório Virtual)
* **Função:** Primeiro experimento do laboratório virtual — diferente das calculadoras, aqui o aluno *conduz* o experimento: configura a bancada (concentrações, volumes, indicador), adiciona titulante em incrementos escolhidos por ele mesmo (bureta virtual), observa o frasco mudar de cor em tempo real e decide quando marcar o "ponto de viragem".
* **Modelo Químico:** Titulação de ácido forte monoprótico com base forte monoprótica, com cálculo de pH em cada volume adicionado (antes, no e após o ponto de equivalência).
* **Indicadores disponíveis:** Fenolftaleína, Alaranjado de Metila, Azul de Bromotimol e Vermelho de Metila — cada um com sua própria faixa de viragem de pH; a cor do frasco é interpolada continuamente dentro dessa faixa.
* **Pedagogia:** O volume de equivalência teórico **não é revelado** de antemão — o aluno só descobre comparando, ao final, o ponto de viragem que ele mesmo observou (limitado pela faixa de cor do indicador escolhido) contra o valor calculado, com erro absoluto e percentual explicitados. Isso ilustra de forma concreta por que a escolha do indicador certo importa em Química Analítica.
* **Saída:** Gráfico de titulação construído ponto a ponto pelos dados que o próprio aluno registrou (reaproveitando o motor de gráficos interativos do Módulo 16/18), tabela de dados, campo de conclusão livre, e relatório formatado para impressão/exportação em PDF (via impressão nativa do navegador).

### Módulo 24: [LIV] Fundamentos de Química Geral (Guia de Estudos)
* **Função:** Revisão de base para quem precisa relembrar os fundamentos de Química Geral antes de usar os módulos mais avançados do site — **15 tópicos**: Matéria e Medidas, Estrutura Atômica, Tabela Periódica, Ligações Químicas, Reações Químicas, O Mol e Estequiometria, Gases, Soluções, Ácidos/Bases, Termoquímica, Configuração Eletrônica e Orbitais, Nomenclatura Química, Oxirredução (Redox), Equilíbrio Químico e Le Chatelier, e Forças Intermoleculares.
* **Formato por tópico:** diagrama SVG (nos tópicos mais visuais — estados da matéria, estrutura atômica, tendências periódicas), notas resumidas, fórmula-chave (quando aplicável), um mnemônico, **dois exemplos resolvidos** (crescente em dificuldade), um mini-glossário de termos-chave, links diretos ("Praticar") para o módulo prático correspondente, e um **mini-quiz de 5 perguntas** de múltipla escolha com feedback imediato — a ordem das perguntas é embaralhada a cada tentativa.
* **Glossário geral:** agrega todos os termos-chave de todos os tópicos numa lista única, pesquisável por palavra.
* **Progresso salvo:** ao completar o quiz de um tópico, a pontuação fica salva em `localStorage` (mesmo mecanismo de preferências já usado para tema/som) e reaparece como selo no menu do módulo em sessões futuras.
* **Sobre o conteúdo:** Todo o texto deste módulo é **material original**, escrito especificamente para o CHEM.OS. Não é uma transcrição nem paráfrase de nenhum livro-texto específico — o formato de "caderno de estudos" (notas + mnemônico + exemplos + quiz) é um estilo pedagógico comum a vários guias de estudo, mas o conteúdo, os mnemônicos, os exemplos e as perguntas aqui foram redigidos para este projeto.

### Módulo 25: [DET] Detetive Químico (Identificação de Cátions)
* **Função:** Jogo de investigação baseado em **química analítica qualitativa real** (a "marcha analítica" simplificada). O aluno recebe uma amostra com um cátion metálico desconhecido — sorteado entre 8 opções (Na⁺, K⁺, Ca²⁺, Sr²⁺, Ba²⁺, Cu²⁺, Fe³⁺, Pb²⁺) — e precisa identificá-lo usando testes de bancada genuínos: cor da solução, teste de chama (cores reais: sódio = amarelo intenso, estrôncio = vermelho-carmim, bário = verde-amarelada etc.) e reações de precipitação com quatro reagentes clássicos (NaOH, Na₂CO₃, H₂SO₄ diluído, HCl diluído).
* **Jogabilidade:** Cada teste só pode ser rodado uma vez por caso (como na bancada real, onde repetir o mesmo teste não traz informação nova), incentivando o aluno a pensar em qual teste é mais diagnóstico antes de gastar reagente. Ao registrar o veredito, uma ficha do caso é gerada — mostrando quais testes foram (e não foram) realizados, e uma explicação de como identificar aquele cátion com segurança, mesmo quando o palpite está errado.
* **Progresso:** taxa de acerto e "reputação de detetive" (Estagiário → Novato → Experiente → Mestre) salvas em `localStorage`, acumulando entre sessões.
* **Validação:** os 8 cátions foram desenhados para serem sempre distinguíveis de forma única a partir apenas da cor da solução + reações de precipitação, mesmo sem o teste de chama (que, de propósito, não é confiável para todo cátion — ex: Fe³⁺ não tem cor de chama característica, um fato real que o próprio jogo ensina).
* **Impressão:** a ficha do caso pode ser impressa/exportada em PDF pelo mesmo mecanismo de impressão nativa usado no Módulo 23.

---

## 4. INTEGRAÇÃO DE APIs EXTERNAS

O CHEM.OS v7.0 utiliza comunicação assíncrona baseada em Promises e Fetch API para interagir com 5 ecossistemas de dados abertos:


```

              +-----------------------------------+
              |        CHEM.OS v7.0 ENGINE        |
              +-----------------------------------+
                 /        |        |        \       \
                /         |        |         \       \
               v          v        v          v       v
        +----------+ +--------+ +------+ +--------+ +-----------+
        | PubChem  | | PubChem| |OPSIN | | CACTUS | | Wikipedia |
        | PUG-REST | |PUG-VIEW| | (CAM)| | (NCI)  | | REST API  |
        +----------+ +--------+ +------+ +--------+ +-----------+

```


| Serviço / API | Endpoint Utilizado | Dados Extraídos / Finalidade |
| :--- | :--- | :--- |
| **PubChem PUG REST** | `.../compound/name/{query}/cids/JSON`<br>`.../compound/cid/{cid}/property/.../JSON` | CID, Título IUPAC, Fórmula Molecular, Massa Molar, SMILES Canônico, InChIKey, Imagem 2D PNG. |
| **PubChem PUG VIEW** | `.../pug_view/data/compound/{cid}/JSON` | Frases de Perigo GHS Classification, Densidade, Ponto de Fusão, Ponto de Ebulição, $pK_a$. |
| **PubChem Periodic Table** | `.../periodictable/JSON` | Raio atômico, eletronegatividade, energia de ionização, estados de oxidação e config. eletrônica. |
| **OPSIN Cambridge** | `https://opsin.ch.cam.ac.uk/opsin/{name}.json` | Conversão de nomes IUPAC para SMILES e InChI. |
| **CACTUS NCI/CADD** | `https://cactus.nci.nih.gov/chemical/structure/...` | Obtenção de Número CAS, fórmulas e nomes alternativos. |
| **Wikipedia REST API** | `https://en.wikipedia.org/api/rest_v1/page/summary/...` | Resumos conceituais e contexto histórico/científico das substâncias. |

### 4.1 Resiliência: Cache e Timeout (`js/core/api-utils.js`)
Todas as chamadas às 5 APIs acima passam por uma camada compartilhada de resiliência:
* **Cache leve em `sessionStorage`** (30 minutos de validade): se dois alunos (ou o mesmo aluno duas vezes) buscarem a mesma substância na mesma sessão do navegador, a segunda busca é respondida instantaneamente a partir do cache local, sem nova requisição ao servidor — reduz a carga nas APIs públicas gratuitas em uso simultâneo de sala de aula. Um pequeno indicador "⚡ resposta em cache local" aparece no resultado do Módulo 2 (PubChem) quando isso ocorre.
* **Timeout de 15 segundos** (`AbortController`) em toda requisição: garante que a interface nunca fique "travada" esperando indefinidamente uma resposta que não chega (ex: serviço fora do ar, rede instável).
* **Mensagens de erro específicas em PT-BR**, diferenciando três causas: composto/nome não encontrado (HTTP 404), erro do servidor (outros códigos HTTP) e falha de conectividade/timeout — em vez de uma mensagem genérica única.


## 5. MOTORES DE CÁLCULO E ALGORITMOS INTERNOS

### 5.1 Parser Sintático de Fórmulas Químicas (`parseFormula`)
O parser lê uma string de fórmula e constrói uma árvore sintática baseada em pilha (*Stack-based Parser*):
1. Normaliza agrupamentos substituindo `[` e `{` por `(`.
2. Identifica fragmentos de hidratação separados por ponto (`.`), como `5H2O`.
3. Percorre a cadeia de caracteres: ao encontrar `(`, empilha um novo mapa de elementos; ao encontrar `)`, desempilha o mapa multiplicando a contagem pelo índice numérico adjacente.
4. Associa cada símbolo atômico à massa atômica padrão do array `RAW_ELEMENTS` para retornar a massa molar total acumulada.

### 5.2 Motor de Balanciamento por Eliminação Gaussiana Racional (`balanceChemicalEquation`)
Dada uma equação com $R$ reagentes e $P$ produtos:
1. Constrói-se uma matriz estequiométrica $A$ de tamanho $M \times N$, onde $M$ é o número de elementos únicos e $N = R + P$ é o número de compostos.
2. Para reagentes, os coeficientes dos elementos entram com sinal positivo ($+n$); para produtos, entram com sinal negativo ($-n$).
3. A matriz aumentada é submetida à redução por escalonamento de linhas usando **Aritmética de Racionais Exatos** (estruturas de pares `[numerador, denominador]`) para eliminar erros de arredondamento.
4. Calcula-se o Mínimo Múltiplo Comum (MMC) dos denominadores para converter a solução em inteiros positivos mínimos ($c_1, c_2, \dots, c_N$).

---

## 6. INTERFACE CLI (COMMAND LINE INTERFACE)

Além dos botões interativos, o painel do CLI (`#cli-input`) aceita comandos diretos:

```bash
> [comando]

```

### Comandos Suportados:

* `1` a `25`: Navegação direta para o módulo correspondente.
* `estrutura` | `editor`: Abre o editor de estruturas químicas (Módulo 21).
* `simulacao` | `md`: Abre a simulação molecular de teoria cinética dos gases (Módulo 22).
* `experimento` | `lab`: Abre o laboratório virtual de experimentos guiados (Módulo 23).
* `estudar` | `guia`: Abre o guia de estudos de Química Geral (Módulo 24).
* `detetive` | `caso`: Abre o Detetive Químico (Módulo 25).
* `home` | `menu` | `cls` | `exit`: Retorna à tela inicial / limpa visualização.
* `ajuda` | `help`: Abre o modal interativo com instruções detalhadas.
* `test`: Executa imediatamente a suíte de testes automatizados (Módulo 20).
* `pubchem <nome>`: Executa busca direta no Módulo 2 (ex: `pubchem caffeine`).
* `balance <equacao>`: Executa balanciamento direto no Módulo 1 (ex: `balance H2+O2=H2O`).
* `resolve <nome>`: Consulta o resolvedor de nomenclatura no Módulo 13 (ex: `resolve ethanoic acid`).

---

## 7. SUÍTE DE TESTES AUTOMATIZADOS (QUALITY ASSURANCE)

O Módulo 20 inclui um *framework* autônomo para garantir que nenhuma alteração no código corrompa a precisão dos cálculos. Ao clicar em **"RODAR TODOS OS TESTES"**, o sistema executa validações internas:

```javascript
// Exemplo de teste executado pela suíte interna
const result = parseFormula("H2O");
assert(Math.abs(result.totalMass - 18.015) < 0.01);

```

### Bateria de Testes Coberta:

1. **Massa Molar:** Validação com $\text{H}_2\text{O}$ ($\approx 18{,}015 \text{ g/mol}$) e $\text{C}_6\text{H}_{12}\text{O}_6$ ($\approx 180{,}16 \text{ g/mol}$).
2. **Balanciamento:** Teste estequiométrico da combustão do metano ($\text{CH}_4 + 2\text{O}_2 \rightarrow \text{CO}_2 + 2\text{H}_2\text{O}$).
3. **pH de Ácido Fraco:** Verificação para ácido acético $0{,}1\text{ M}$ ($pK_a = 4{,}76 \rightarrow \text{pH} \approx 2{,}88$).
4. **Gases Ideais:** Verificação das condições CNTP ($1\text{ mol de gás a } 1\text{ atm e } 273{,}15\text{ K} \rightarrow V \approx 22{,}41 \text{ L}$).
5. **Nernst:** Pilha de Daniell padrão ($E^\circ = 1{,}10\text{ V} \rightarrow E \approx 1{,}10\text{ V}$ para $Q=1$).
6. **Espectroscopia:** Energia do fóton em $500\text{ nm}$ ($\approx 2{,}48\text{ eV}$).
7. **Solubilidade:** Solubilidade do $\text{PbCl}_2$ a partir do $K_{ps}$.

---

## 8. DEPLOY E MANUTENÇÃO

### 8.1 Requisitos de Execução

* **Ambiente Hospedado:** Qualquer servidor estático (GitHub Pages, Vercel, Netlify, Apache, Nginx) ou abertura direta local no navegador (`file:///caminho/index.html`). Ao publicar, envie a pasta inteira (`index.html`, `css/` e `js/`), preservando a hierarquia de diretórios — os caminhos dos `<script src>` são relativos.
* **Conectividade:** Requer conexão ativa com a internet para requisições externas de APIs (PubChem, OPSIN, CACTUS, Wikipedia, Google Fonts, Tailwind CDN). Os módulos puramente numéricos (1, 3, 5, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23) funcionam de forma **offline**.
* **Navegadores Suportados:** Chrome/Chromium 80+, Firefox 75+, Edge 80+, Safari 13.1+.

### 8.2 Guia de Manutenção

* **Inclusão de Espécies na Termoquímica:** Para adicionar novas substâncias ao Módulo 9, insira os dados no objeto `THERMO_DB`:
```javascript
"COMPOSICAO(estado)": { dHf: valor_kJ_mol, S: valor_J_molK }

```


* **Atualização de Massas Atômicas:** A matriz `RAW_ELEMENTS` contém os pesos atômicos IUPAC oficiais. Atualizações de novas medições da IUPAC podem ser feitas alterando o índice 3 de cada elemento no array.

---

## 9. ISENÇÃO DE RESPONSABILIDADE E SEGURANÇA (DISCLAIMER)

1. **Uso Laboratorial:** Os dados e alertas GHS exibidos via PubChem API têm caráter prioritariamente **educacional e didático**. Não substituem a **FISPQ / SDS (Ficha de Informações de Segurança de Produtos Químicos)** oficial fornecida pelo fabricante do reagente.
2. **Precisão Numérica:** Os cálculos de titulação e pH consideram comportamento ideal de soluções (coeficientes de atividade $\gamma \approx 1$). Em concentrações elevadas ($\ge 1\text{ M}$), desvios da idealidade devem ser corrigidos através de modelos de Pitzer ou Debye-Hückel estendido.
