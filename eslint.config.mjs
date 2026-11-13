// ESLint (flat config). Os scripts do app são "classic scripts" que compartilham o escopo global,
// então os globais entre arquivos são detectados automaticamente (declarações de topo e window.X = ...).
import js from "@eslint/js";
import globals from "globals";
import * as acorn from "acorn";
import fs from "node:fs";
import path from "node:path";

function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith(".js") ? [path.join(dir, e.name)] : []); }
function shared() {
  const names = new Set();
  const visit = (n) => { if (!n || typeof n.type !== "string") return;
    if (n.type === "AssignmentExpression" && n.left.type === "MemberExpression" && n.left.object.name === "window") {
      if (n.left.property.type === "Identifier" && !n.left.computed) names.add(n.left.property.name);
      else if (n.left.property.type === "Literal") names.add(String(n.left.property.value)); }
    for (const k in n) { const v = n[k]; if (Array.isArray(v)) v.forEach(visit); else if (v && typeof v.type === "string") visit(v); } };
  for (const f of walk("js")) {
    let ast; try { ast = acorn.parse(fs.readFileSync(f, "utf8"), { ecmaVersion: "latest", sourceType: "script", allowHashBang: true }); } catch { continue; }
    for (const s of ast.body) {
      if (s.type === "FunctionDeclaration" || s.type === "ClassDeclaration") names.add(s.id.name);
      else if (s.type === "VariableDeclaration") s.declarations.forEach(d => { if (d.id.type === "Identifier") names.add(d.id.name); });
    }
    visit(ast);
  }
  return Object.fromEntries([...names].map(n => [n, "writable"]));
}

export default [
  { ignores: ["node_modules/**", "dist/**", "css/**", "fonts/**", "icons/**", "vendor/**"] },
  js.configs.recommended,
  { files: ["js/**/*.js"], languageOptions: { ecmaVersion: "latest", sourceType: "script", globals: { ...globals.browser, ...shared() } },
    rules: { "no-unused-vars": ["warn", { args: "none", caughtErrors: "none", vars: "local" }], "no-empty": ["error", { allowEmptyCatch: true }], "no-redeclare": "off" } },
  { files: ["tests/**/*.js", "scripts/**/*.js", "*.js", "sw.js"], languageOptions: { ecmaVersion: "latest", sourceType: "commonjs", globals: { ...globals.node, ...globals.browser, ...globals.serviceworker } },
    rules: { "no-unused-vars": "off", "no-empty": ["error", { allowEmptyCatch: true }], "no-undef": "off" } }
];
