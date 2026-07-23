
# DOCUMENTAÇÃO TÉCNICA E FUNCIONAL — CHEM.OS v7.0
**Enterprise Laboratory Engine & Chemical Computation Suite**

---

## 1. VISÃO GERAL DO SISTEMA

O **CHEM.OS v7.0** é uma suíte computacional completa para laboratórios químicos, ensino universitário e pesquisa, desenvolvida em arquitetura *Single-File Web Application* (SWA) com interface retrô estilo *CRT Terminal/DOS*. 

O sistema integra **20 módulos numéricos e analíticos**, cobrindo desde a estequiometria clássica até o equilíbrio iônico complexo, eletroquímica, cinética, termodinâmica e espectroscopia. Além do motor interno de simulação e cálculo algébrico exato, a aplicação faz integrações assíncronas em tempo real com APIs internacionais de dados químicos de alto nível (PubChem REST, PUG View, OPSIN, CACTUS e Wikipedia API).

---

## 2. ARQUITETURA TÉCNICA & STACK TECNOLÓGICO

### 2.1 Stack Tecnológico
* **Linguagem Base:** HTML5 / CSS3 / JavaScript Vanilla (ES6+ assíncrono com `async/await` e `fetch`).
* **Framework de Estilização:** Tailwind CSS (via CDN) com extensão de temas customizados e *CSS Custom Properties* (`var(--text-color)`, `var(--bg-color)`, `var(--border-color)`).
* **Tipografia:** Google Fonts (`VT323` para sensação de terminal CRT e `IBM Plex Mono` para legibilidade de dados numéricos).
* **Renderização Gráfica:** HTML5 Canvas API para plotagem vetorial e em tempo real de curvas de titulação e pH.
* **Sintetizador de Áudio:** Web Audio API (`AudioContext`) para geração de *beeps* e *feedbacks* sonoros programáticos através de osciladores de onda quadrada sem dependência de arquivos de áudio externos.

### 2.2 Estrutura da Interface e UX
* **Efeito CRT e Scanlines:** Controlado via a classe `.crt` com gradiente fixo e efeito de pulso, podendo ser ativado/desativado instantaneamente.
* **Temas de Cor Dinâmicos:** Suporte alternável via footer entre **Verde Fosforoso** (Clássico), **Âmbar** (VT100), **Azul DOS** e **Monocromático**.
* **Linha de Comando (CLI):** Prompt interativo `<input id="cli-input">` presente de forma fixa no rodapé da viewport para entrada direta de números de módulos, comandos expressos ou parâmetros de cálculo.
* **Sistema de Modais:** Janela flutuante (`#modal`) centralizada para exibição de ajudas, termos, tabelas e avisos sem perda de estado do módulo ativo.

---

## 3. ESPECIFICAÇÃO DOS MÓDULOS (1 AO 20)

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

* `1` a `20`: Navegação direta para o módulo correspondente.
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

* **Ambiente Hospedado:** Qualquer servidor estático (GitHub Pages, Vercel, Netlify, Apache, Nginx) ou abertura direta local no navegador (`file:///caminho/index.html`).
* **Conectividade:** Requer conexão ativa com a internet para requisições externas de APIs (PubChem, OPSIN, CACTUS, Wikipedia, Google Fonts, Tailwind CDN). Os módulos puramente numéricos (1, 3, 5, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20) funcionam de forma **offline**.
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
