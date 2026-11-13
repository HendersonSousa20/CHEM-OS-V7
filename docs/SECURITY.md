# Segurança e privacidade

## Princípios

- Sem contas, anúncios, análise de uso ou envio de telemetria. Tudo fica no navegador.
- Sem dependências de execução de terceiros em CDN: fontes e bibliotecas são hospedadas junto do app.
- Entradas do usuário nunca vão para `innerHTML` sem escape; a varredura `tests/xss.js` confere isso em todos os módulos.

## Política de segurança de conteúdo (CSP)

Injetada pelo build (meta no HTML e `_headers`):

| Diretiva | Valor | Motivo |
|---|---|---|
| `default-src` | `'self'` | base restritiva |
| `script-src` | `'self' 'unsafe-inline'` | os templates usam `onclick="…"` em linha (ver dívida técnica em ARCHITECTURE.md) |
| `style-src` | `'self' 'unsafe-inline'` | CSS embutido e atributos `style` |
| `img-src` | `'self' data: blob: https://pubchem.ncbi.nlm.nih.gov` | imagens de estrutura do PubChem, canvas e PDF |
| `connect-src` | `'self'` + PubChem, OPSIN, CACTUS, Wikipédia | consultas de nome/propriedades |
| `object-src` / `base-uri` / `form-action` | `'none'` / `'self'` / `'self'` | fecham vetores clássicos |
| `frame-ancestors` | `'none'` (só no cabeçalho HTTP) | impede embutir o app em outro site |

## Dados guardados no navegador (localStorage)

Nada sai do dispositivo. Os dados podem ser apagados pelo navegador (limpar dados do site).

| Chave | Conteúdo |
|---|---|
| `chemos_prefs_v1` | tema, preferências e progresso do guia de estudos |
| `chemos-fontscale`, `chemos-reading`, `chemos-live`, `chemos-dec`, `chemos-sep` | escala de fonte, modo leitura, cálculo ao vivo, casas decimais, separador |
| `chemos-fav`, `chemos-recent`, `chemos-history`, `chemos-last`, `chemos-visited`, `chemos-welcome` | favoritos, recentes, histórico de comandos, último módulo, visitados, boas-vindas vistas |
| `chemos-inputs-<módulo>` | últimos valores digitados em cada módulo |
| `chemos13-notebook` | caderno de laboratório (resultados guardados pelo usuário) |
| `chemos14-review-errors`, `chemos14-review-hist` | erros e desempenho da revisão inteligente |
| `chemos-quiz-best`, `chemos-quiz-wrong` | resultados do quiz |
| `chemos_ge_autosave_v1` | rascunho do laboratório virtual |
| `chemos_cache_v1:*` | cache de respostas das consultas online |
| `chemos-diag` | últimos 30 erros não tratados (para o comando `diagnostico`) |

## Serviços externos

| Serviço | Para quê | O que é enviado |
|---|---|---|
| PubChem (`pubchem.ncbi.nlm.nih.gov`) | propriedades, GHS e imagens | nome ou identificador digitado |
| OPSIN (`opsin.ch.cam.ac.uk`) | nome IUPAC → estrutura | nome digitado |
| CACTUS (`cactus.nci.nih.gov`) | resolução de nomes | nome digitado |
| Wikipédia (`en.wikipedia.org`) | resumo do composto | nome digitado |

Só os módulos de consulta online fazem essas requisições, e só quando o usuário aciona a busca. Em caso de falha de rede o app avisa e não usa dados incertos.

## Dependências

- **Execução:** nenhuma de terceiros em CDN. jsPDF (MIT) é hospedado em `vendor/` e carregado sob demanda para o PDF do laboratório virtual.
- **Desenvolvimento:** `npm audit` roda no CI (nível alto). Atualize o jsPDF com `npm run vendor` depois de mudar a versão.

## Diagnóstico

Erros não tratados são guardados localmente (`chemos-diag`). O comando `diagnostico` copia um relatório (versão, navegador, tela e últimos erros) para a área de transferência, para o usuário anexar a um relato de problema. Nada é enviado automaticamente.

## Relatar uma vulnerabilidade

Abra uma issue privada ou escreva ao mantenedor do repositório com os passos para reproduzir e a versão (`build-info.json`).
