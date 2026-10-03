/* Verifica a física da simulação (Módulo 22) sem navegador: a pressão relativa deve crescer ∝ N e ∝ T; v_rms e T instantânea devem bater com a teoria. Uso: node tests/sim.js */
const vm = require("vm"), fs = require("fs");
const els = {}; const el = id => els[id] || (els[id] = { value: "", textContent: "", classList: { add() {}, remove() {} }, addEventListener() {} });
const ctx = { window: { addEventListener() {}, removeEventListener() {} }, document: { getElementById: el, body: { contains: () => true } }, getComputedStyle: () => ({ getPropertyValue: () => "" }), requestAnimationFrame: () => 0, cancelAnimationFrame() {}, Math };
vm.createContext(ctx);
new vm.Script(fs.readFileSync(__dirname + "/../js/modules/molecular-simulation.js", "utf8") + `
function __run(T, N, steps, frac) {
  simCanvas = { width: 600, height: 300, clientWidth: 600 }; simHistCanvas = { width: 600, height: 110 };
  simCtx = new Proxy({}, { get: (t, k) => () => {}, set: () => true }); simHistCtx = simCtx;
  document.getElementById("sim-gas").value = "28.01"; document.getElementById("sim-temp").value = String(T); document.getElementById("sim-n").value = String(N);
  simSpeed = 1; simBoxFrac = frac || 1; simPressAvg = 0; simWallImpulse = 0; simStatFrames = 0; resetSim(); simPressAvg = 0; simWallImpulse = 0; simStatFrames = 0;
  let acc = 0, cnt = 0;
  for (let i = 0; i < steps; i++) { simStep(); if (i % 6 === 5) { simUpdateStats(); if (i > steps / 3) { acc += simPressAvg; cnt++; } } }
  return { p: acc / cnt, vrms: +document.getElementById("sim-vrms-sim").textContent, tinst: +document.getElementById("sim-tinst").textContent };
}`).runInContext(ctx);
// A amostra inicial de velocidades varia entre execuções (N pequeno => T real ≈ T nominal ± ~15 %), e a energia se conserva nas colisões elásticas.
// Por isso a pressão é normalizada pela temperatura real medida e por N: P/(N·T_real) deve ser ≈ constante.
const r = (T, N, f) => ctx.__run(T, N, 1800, f);
const norm = (x, N) => x.p / (N * x.tinst);
const base = r(298, 40), dT = r(596, 40), dN = r(298, 80), half = r(298, 40, 0.5), big = r(298, 120);
const ratioT = norm(dT, 40) / norm(base, 40), ratioN = norm(dN, 80) / norm(base, 40);
const ratioP = half.p / (base.p * half.tinst / base.tinst), ratioPA = ratioP * 0.5;
const check = (name, ok, info) => { console.log(ok ? "OK   " : "FALHA", name, info); return ok; };
const vth = T => Math.sqrt(2 * 1.380649e-23 * T / (28.01e-3 / 6.02214076e23));
const res = [
  check("P/(N·T) constante ao dobrar T (razão ≈ 1)", ratioT > 0.8 && ratioT < 1.25, ratioT.toFixed(2)),
  check("P/(N·T) constante ao dobrar N (razão ≈ 1)", ratioN > 0.8 && ratioN < 1.25, ratioN.toFixed(2)),
  check("Boyle: volume pela metade → pressão ≈ 2× (a mesma T)", ratioP > 1.6 && ratioP < 2.8, ratioP.toFixed(2)),
  check("Boyle: P × A ≈ constante (±30 %)", Math.abs(ratioPA - 1) < 0.3, ratioPA.toFixed(2)),
  check("T instantânea ≈ 298 K com 120 partículas (±20 %)", Math.abs(big.tinst - 298) / 298 < 0.2, big.tinst + " K"),
  check("v_rms 2D ≈ √(2kT/m) para a T real medida (±8 %)", Math.abs(big.vrms - vth(big.tinst)) / big.vrms < 0.08, big.vrms + " m/s")
];
// Sub-passos: com H2 a 1500 K (partículas rápidas), simAdvance deve reduzir sobreposições profundas em relação a simStep puro
new vm.Script(`function __deep(useAdv) {
  simCanvas = { width: 300, height: 200, clientWidth: 300 }; simHistCanvas = { width: 300, height: 110 };
  simCtx = new Proxy({}, { get: () => () => {}, set: () => true }); simHistCtx = simCtx;
  document.getElementById("sim-gas").value = "2.016"; document.getElementById("sim-temp").value = "1500"; document.getElementById("sim-n").value = "120";
  simSpeed = 1; simBoxFrac = 1; resetSim(); let deep = 0;
  for (let i = 0; i < 600; i++) { useAdv ? simAdvance() : simStep(); for (let a = 0; a < simParticles.length; a++) for (let b = a + 1; b < simParticles.length; b++) if (Math.hypot(simParticles[a].x - simParticles[b].x, simParticles[a].y - simParticles[b].y) < SIM_RADIUS * 1.2) deep++; }
  return deep;
}`).runInContext(ctx);
const dPlain = ctx.__deep(false), dAdv = ctx.__deep(true);
res.push(check("sub-passos reduzem sobreposição profunda (H2, 1500 K)", dAdv < dPlain, `${dAdv} vs ${dPlain} (com/sem sub-passos)`));
process.exit(res.every(Boolean) ? 0 : 1);
