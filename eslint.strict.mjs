// Regras extras (mais ruidosas) para revisão periódica: npm run lint:strict
import js from "@eslint/js";
import cfg from "./eslint.config.mjs";
const base = cfg.find(c => c.files && c.files[0] === "js/**/*.js");
export default [{ files: ["js/**/*.js"], languageOptions: base.languageOptions, rules: { ...js.configs.recommended.rules, "no-redeclare": "off", "no-empty": ["error", { allowEmptyCatch: true }],
  eqeqeq: ["warn", "smart"], "array-callback-return": "warn", "no-loss-of-precision": "error", "no-unsafe-optional-chaining": "error", "no-template-curly-in-string": "warn", "no-unreachable-loop": "warn",
  "no-self-compare": "warn", "no-sparse-arrays": "error", "no-async-promise-executor": "error", "no-constant-binary-expression": "error", "no-useless-catch": "warn", "no-prototype-builtins": "warn",
  "no-fallthrough": "warn", "no-case-declarations": "warn", "no-unused-vars": ["warn", { args: "none", caughtErrors: "none", vars: "all" }] } }];
