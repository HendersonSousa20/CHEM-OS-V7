// Regenera o <style id="critical-css"> do index.html a partir de css/fonts.css + styles.css + ui-v10/v11/v17.css.
// Uso: node build-inline.js            (grava o index.html)
//      node build-inline.js --check    (sai com código 1 se o index.html estiver desatualizado; usado pelos testes)
const fs = require("fs"), r = f => fs.readFileSync(f, "utf8");
const LAYERS = ["css/styles.css", "css/ui-v10.css", "css/ui-v11.css", "css/ui-v17.css"];
const css = r("css/fonts.css").replace(/url\('\.\.\/fonts\//g, "url('fonts/") + "\n" + LAYERS.map(r).join("\n");
const block = '<style id="critical-css">\n/* GERADO por build-inline.js — edite css/*.css e rode: node build-inline.js */\n' + css + "\n    </style>";
const before = r("index.html"), after = before.replace(/<style id="critical-css">[\s\S]*?<\/style>/, () => block);
if (process.argv.includes("--check")) {
  if (before !== after) { console.error("index.html está desatualizado em relação a css/*.css. Rode: node build-inline.js"); process.exit(1); }
  console.log("ok: CSS embutido está em dia"); process.exit(0);
}
fs.writeFileSync("index.html", after); console.log("ok", css.length, "bytes");
