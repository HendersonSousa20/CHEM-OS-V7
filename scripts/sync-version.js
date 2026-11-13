#!/usr/bin/env node
/* Sincroniza a versão do package.json com js/core/version.js e com o texto estático do index.html. */
"use strict";
const fs = require("fs"), path = require("path"), root = path.join(__dirname, "..");
const pkg = require("../package.json"), major = parseInt(pkg.version.split(".")[0], 10);
fs.writeFileSync(path.join(root, "js/core/version.js"), `/* Fonte única da versão em tempo de execução. É sincronizada com package.json por \`npm run version:sync\`
   e verificada pelo teste de auditoria. */
window.CHEMOS_VERSION = "${pkg.version}";
window.CHEMOS_MAJOR = ${major};
`);
const f = path.join(root, "index.html"); let h = fs.readFileSync(f, "utf8");
h = h.replace(/CHEM\.OS v\d+/g, "CHEM.OS v" + major); fs.writeFileSync(f, h);
console.log("versão", pkg.version, "(v" + major + ") sincronizada");
