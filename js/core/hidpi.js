/* v11.5 — Canvas nítido em telas de alta densidade (celulares 2x/3x).
   O módulo guarda o tamanho LÓGICO (px CSS) em `state` e o buffer do canvas é multiplicado pela densidade da tela;
   no desenho, aplique ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0). */
window.hidpiFit = function (canvas, state) {
  var dpr = Math.min(window.devicePixelRatio || 1, 3);
  if (!state.lh) { state.lh = +canvas.dataset.lh || canvas.height; canvas.dataset.lh = state.lh; }
  state.lw = canvas.clientWidth || state.lw || canvas.width; state.dpr = dpr;
  canvas.width = Math.round(state.lw * dpr); canvas.height = Math.round(state.lh * dpr);
  canvas.style.width = "100%"; canvas.style.height = state.lh + "px";
  return state;
};
