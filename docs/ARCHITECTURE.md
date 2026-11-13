# Arquitetura

## Modelo de execução

O app é estático e usa **scripts clássicos** (não módulos ES): todos os arquivos de `js/` compartilham o escopo global e se conhecem por nome (`renderTool`, `showToast`, `GC_TOPICS`…). Os templates HTML geram `onclick="funcao()"` em linha, então as funções chamadas por eles precisam ser globais.

Consequências que o projeto respeita:

- **A ordem em `index.html` é o contrato.** É a lista de scripts, de cima para baixo: `version` → `diagnostics` → `lazy-libs` → núcleo e motores → dados → módulos → telas → camadas de UX → `app.js` → `ready.js`. O build lê essa lista para montar o pacote.
- **Não pode haver declaração global duplicada** entre arquivos. Em scripts separados a última vence depois do carregamento; num pacote único ela vence desde o início do script. O build falha se encontrar duplicatas.
- **Nada de `"use strict"` no topo de arquivo** (ele passaria a valer para o pacote inteiro). Usa-se dentro de IIFEs.
- `window.CHEMOS_READY` fica `true` depois de todos os scripts e handlers de `DOMContentLoaded`. Testes e varreduras esperam por ele.

## Registro de módulos

A navegação central é `renderTool(n)` → `renderToolInner(n)`. Cada família de módulos novos **encadeia** a função anterior:

```js
const R = { 43: r43, 44: r44 }, orig = window.renderToolInner;
window.renderToolInner = function (id) { const n = parseInt(id); if (R[n]) { R[n](); return; } orig(id); };
```

Fontes únicas (não repita números à mão):

| O quê | Onde | Observação |
|---|---|---|
| Número de módulos | `window.MODULE_MAX` (`js/data/module-help.js`) | calculado a partir das chaves da ajuda |
| Validação de número | `window.parseModuleNumber(texto)` | usada pelo terminal, pelas rotas e pelos testes |
| Versão | `js/core/version.js` | sincronizada do `package.json` por `npm run version:sync` |
| Grupos do menu | `window.CHEM_GROUPS` (`js/core/ux-extras.js`) | usados pelo menu, pelo caminho de navegação e pelo mapa da tela inicial |
| Descrição, fórmula, dica, nome curto | `window.MODULE_HELP[n]` | `[descrição, fórmula, dica, nome curto]` |

## Camadas de CSS

1. `css/fonts.css` (VT323 e IBM Plex Mono, locais, licença OFL) → `styles.css` (temas por variáveis) → `ui-v10.css` → `ui-v11.css` → `ui-v17.css` (tokens derivados por `color-mix`, tipografia, componentes).
2. Essas camadas são **embutidas** no `index.html` (`<style id="critical-css">`) por `build-inline.js`, para a primeira pintura sem requisição extra. O bloco é gerado: edite `css/*.css` e rode `npm run css:inline`. O build e a auditoria falham se ele estiver desatualizado.
3. Temas (`verde`, `âmbar`, `azul`, `mono`, `papel`) redefinem `--bg-color`, `--text-color` etc. na classe do `body`; os tokens derivados (`--surface`, `--line`, `--dim`) são calculados no `body` para herdar as cores do tema ativo.
4. `css/tailwind.css` é gerado (`npm run css:tailwind`) e só contém as utilitárias que existem no código; classes novas precisam estar nesse arquivo.

Tipografia: **VT323** para título, rótulos e controles; **IBM Plex Mono** para leitura, campos, resultados e tabelas.

## Camadas de UX

Os arquivos `ux-*.js`, `ui-*.js` e `v8-extras.js` **pós-processam** as telas já renderizadas (arredondamento, atalhos, favoritos, modo leitura, cálculo ao vivo). Eles observam `#screen-content` com `MutationObserver`; ao adicionar um observador novo, use *debounce* e cheque se o nó ainda está na tela (o cálculo ao vivo já teve uma corrida por causa disso).

## Build de produção (`scripts/build.js`)

1. Confere pré-condições (CSS embutido em dia, versão sincronizada, sem declarações globais duplicadas).
2. Minifica os scripts na ordem do `index.html` com Terser (**sem renomear nomes de topo**) e gera `assets/app.<hash>.js` + mapa de fontes.
3. Minifica o CSS (`esbuild`), insere CSP, `referrer` e *preload* das fontes principais.
4. Gera `sw.js` a partir de `scripts/sw.template.js` com o pré-cache **calculado** e o nome do cache derivado do conteúdo.
5. Gera `_headers` (cache e segurança), `robots.txt` e `build-info.json`; confere o orçamento de tamanho (gzip: scripts 240 KB, CSS 40 KB, HTML 60 KB).

O service worker da raiz (`sw.js`) é **só de desenvolvimento**: não guarda nada em cache.

## Testes

Todas as suítes usam jsdom e leem a URL de `CHEMOS_BASE`. `scripts/test.js` sobe um servidor em porta livre e executa tudo (`--dist` aponta para o build). `tests/fuzz.js` (entradas extremas) e `tests/xss.js` (injeção de HTML) são as varreduras longas (`--full`). `tests/dist.js` verifica a integridade do build. O teste de auditoria também confere o registro de módulos, a versão e se o CSS embutido está em dia.

## Dívidas conhecidas

- O guia de estudos (`js/data/gc-*.js`, ~80 KB gzip) poderia ser carregado sob demanda; hoje faz parte do pacote inicial.
- `index.html` mistura marcação e o bloco de CSS gerado.
- Muitos templates usam `onclick` em linha, o que obriga a CSP a manter `'unsafe-inline'` em `script-src`.
