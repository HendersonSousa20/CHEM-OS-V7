// Regenera o <style id="critical-css"> do index.html a partir de css/fonts.css + styles.css + ui-v10.css.  Uso: node build-inline.js
const fs = require("fs"), r = f => fs.readFileSync(f, "utf8");
const css = r("css/fonts.css").replace(/url\('\.\.\/fonts\//g, "url('fonts/") + "\n" + r("css/styles.css") + "\n" + r("css/ui-v10.css");
let h = r("index.html");
h = h.replace(/<style id="critical-css">[\s\S]*?<\/style>/, () => '<style id="critical-css">\n/* GERADO por build-inline.js — edite css/*.css e rode: node build-inline.js */\n' + css + "\n    </style>");
fs.writeFileSync("index.html", h); console.log("ok", css.length, "bytes");
