#!/usr/bin/env node
/* Copia as bibliotecas de terceiros hospedadas localmente (vendor/) a partir do node_modules, de forma reprodutível. */
"use strict";
const fs = require("fs"), path = require("path"), root = path.join(__dirname, "..");
const lib = require("jspdf/package.json");
fs.mkdirSync(path.join(root, "vendor"), { recursive: true });
fs.copyFileSync(path.join(root, "node_modules/jspdf/dist/jspdf.umd.min.js"), path.join(root, "vendor/jspdf.umd.min.js"));
fs.writeFileSync(path.join(root, "vendor/README.md"), `# Bibliotecas de terceiros

Hospedadas junto do app (sem CDN): funcionam offline e não dependem de servidores externos.
Atualize com \`npm run vendor\` depois de mudar a versão no package.json.

| Arquivo | Biblioteca | Versão | Licença | Uso |
|---|---|---|---|---|
| jspdf.umd.min.js | [jsPDF](https://github.com/parallax/jsPDF) | ${lib.version} | MIT | Exportar o relatório do laboratório virtual em PDF (carregado sob demanda por \`js/core/lazy-libs.js\`) |
`);
console.log("jsPDF", lib.version, "copiado para vendor/");
