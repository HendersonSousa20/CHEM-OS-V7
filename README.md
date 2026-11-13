# CHEM.OS

Laboratório de química no navegador: **55 módulos** no menu (58 no total) com balanceador de equações, massa molar, soluções e pH, titulações, termoquímica, cinética, equilíbrio, eletroquímica, espectroscopia, cromatografia, calibração, estatística analítica, simulação molecular, laboratório virtual guiado e um guia de estudos com **41 tópicos e 410 perguntas**. Funciona **offline**, sem conta, sem anúncios e sem rastreamento.

## Início rápido

```bash
npm ci                 # instala as ferramentas de desenvolvimento
npm run dev            # servidor de desenvolvimento em http://127.0.0.1:8080 (usa o código-fonte)
npm run verify         # lint + testes + build de produção + testes do build
npm run build          # gera dist/ (pronto para hospedar)
npm run serve          # serve dist/ em http://127.0.0.1:8080
```

Requer Node 20 ou superior (`.nvmrc` indica a versão de referência). O app em si não tem dependências de execução: são arquivos estáticos.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | serve o código-fonte (sem cache, service worker de desenvolvimento) |
| `npm run build` | empacota e minifica em `dist/` (1 script, 1 CSS, hashes, CSP, service worker e cabeçalhos HTTP) |
| `npm test` | 8 conjuntos de testes (fumaça, auditoria, UX, acessibilidade, cálculos, laboratório, contraste, simulação) |
| `npm run test:dist` | os mesmos testes contra `dist/` mais a verificação de integridade do build |
| `npm run test:full` | inclui as varreduras longas: entradas extremas e injeção de HTML em todos os módulos |
| `npm run lint` · `lint:strict` | ESLint (globais entre arquivos detectados automaticamente) |
| `npm run verify` | `lint` → `test` → `build` → `test:dist` (o que o CI executa) |
| `npm run css:inline` | regenera o CSS embutido no `index.html` a partir de `css/*.css` (rode após editar CSS) |
| `npm run css:tailwind` | recompila `css/tailwind.css` |
| `npm run version:sync` | propaga a versão do `package.json` para `js/core/version.js` e para o `index.html` |
| `npm run vendor` | copia as bibliotecas de terceiros para `vendor/` |

## Estrutura

```
index.html            página única; lista os scripts na ordem de carregamento (fonte da verdade para o build)
css/                  fonts.css, styles.css, ui-v10/v11/v17.css (camadas) e tailwind.css (gerado)
js/core/              sistema, UX, motores (fórmulas, API), diagnóstico, versão, sinal de pronto
js/data/              dados: tabela periódica, ajuda dos módulos, tópicos e perguntas do guia
js/modules/           um arquivo (ou família) por módulo
js/render/            telas e menu
vendor/               bibliotecas de terceiros hospedadas localmente (jsPDF, sob demanda)
scripts/              build, servidor estático, executor de testes, sincronização de versão
tests/                suítes de teste (jsdom) e varreduras (fuzz, xss)
dist/                 saída do build (não versionada)
docs/                 arquitetura, contribuição, implantação, segurança e privacidade
```

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md): modelo de execução, ordem dos scripts, camadas de CSS, como os módulos se registram.
- [Contribuição](docs/CONTRIBUTING.md): checklist para criar um módulo, convenções e como rodar os testes.
- [Implantação](docs/DEPLOY.md): hospedagem estática, cabeçalhos HTTP, nginx, cache e atualização.
- [Segurança e privacidade](docs/SECURITY.md): CSP, dados guardados no navegador, serviços externos.
- [Histórico de versões](CHANGELOG.md).

## Privacidade em uma frase

Tudo fica no navegador. Apenas os módulos de consulta online enviam o **nome do composto digitado** a PubChem, OPSIN, CACTUS e Wikipédia; veja [docs/SECURITY.md](docs/SECURITY.md).

## Limitações

Os valores de referência (termodinâmica, pKa, constantes) são de tabelas de livro-texto e servem para estudo e estimativa; não substituem a FISPQ/SDS oficial nem a validação em laboratório. Os módulos de consulta online dependem dos serviços externos.
