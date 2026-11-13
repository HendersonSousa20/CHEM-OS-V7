# Contribuindo

## Ambiente

```bash
npm ci && npm run dev      # http://127.0.0.1:8080
```

Antes de abrir um pull request: `npm run verify`. Mudanças em módulos de cálculo precisam de um teste com valor de referência (veja `tests/calc.js` e `tests/audit.js`).

## Criar um módulo novo (checklist)

O número do módulo é o próximo inteiro livre; `MODULE_MAX` e os intervalos dos testes se ajustam sozinhos.

1. **Código.** Crie o arquivo em `js/modules/` seguindo o padrão de encadeamento de `renderToolInner` (veja `docs/ARCHITECTURE.md`). Prefira uma IIFE e exponha só o que os `onclick` precisam.
2. **Carregamento.** Acrescente o `<script src>` em `index.html`, depois dos módulos existentes e antes de `js/render/screens.js`.
3. **Ajuda.** Entrada em `js/data/module-help.js`: `[descrição, fórmula, dica, nome curto]`. Sem ela o módulo não aparece na busca nem na descrição.
4. **Menu.** Botão em `js/render/screens.js` e inclusão no grupo certo de `GROUPS` em `js/core/ux-extras.js`. (Módulos fora dos grupos ficam ocultos de propósito: 20, 25 e 28.)
5. **Comando.** Se houver atalho por nome: `js/app.js` e a lista de comandos conhecidos em `js/core/ux-extras.js`.
6. **Testes.** `npm test`. O teste de auditoria falha se o módulo não tiver ajuda ou grupo; a varredura `npm run test:full` abre o módulo com entradas extremas e com cargas de injeção de HTML.

## Convenções

- **Números:** vírgula decimal, sem separador de milhar (`7200`, não `7.200`); sinal negativo "−" (U+2212) na exibição. Campos numéricos aceitam vírgula: troque `,` por `.` antes de `parseFloat`. Listas de valores se separam por espaço ou `;` (a vírgula é decimal).
- **Saída HTML:** nunca insira texto do usuário em `innerHTML`. Use `textContent`, ou escape (`esc()`), ou monte nós com `createElement`.
- **Resultados:** coloque-os em um container com `id` terminado em `-result` (ou `-res`) e a classe `dos-border`; assim recebem o anúncio para leitores de tela e o botão **+ CADERNO**.
- **Botão principal:** rótulos que começam com CALCULAR, ANALISAR, CONVERTER etc. ganham o estilo de ação principal automaticamente.
- **Canvas:** use `hidpiFit(canvas, estado)` e desenhe com `ctx.setTransform(estado.dpr, 0, 0, estado.dpr, 0, 0)`.
- **Temporizadores e observadores:** ao agendar algo para depois, cheque se o nó ainda está na tela antes de agir.
- **Sem estado global novo sem necessidade.** Se persistir algo, use uma chave `chemos…` e registre-a em `docs/SECURITY.md`.
- **CSS:** edite `css/*.css` e rode `npm run css:inline`. Use os tokens (`--surface`, `--line`, `--dim`, `--font-ui`, `--font-read`) em vez de cores fixas; o contraste mínimo de 4,5:1 é testado nos 5 temas.
- **Textos:** português do Brasil, sem números fixos de módulos/tópicos (use `MODULE_MAX`).

## Versões

A versão vive no `package.json`. Depois de alterá-la rode `npm run version:sync` e registre a mudança no `CHANGELOG.md`.
