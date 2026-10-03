/* v9.6 — "Sobre e limitações": de onde vêm os dados, o que é aproximado e o que não foi revisado por um professor. */
(function () {
  window.showAbout = function () {
    openModal("SOBRE O CHEM.OS E SUAS LIMITAÇÕES", `<div class="space-y-3 text-sm">
      <p><strong>CHEM.OS v9.6</strong> é uma ferramenta de estudo de química que roda inteira no navegador (funciona offline depois da primeira visita). Foi feita para <strong>aprender e conferir cálculos</strong>, não para decisões de segurança ou trabalho em laboratório real.</p>
      <div><div class="font-bold">De onde vêm os dados</div><ul class="list-disc pl-5 space-y-1">
        <li><strong>Massas atômicas, grupos e períodos:</strong> tabela local do projeto.</li>
        <li><strong>Eletronegatividade (Pauling), 1ª energia de ionização e raio atômico:</strong> valores de livros-texto digitados à mão (Z = 1–92 para eletronegatividade; sem dado para alguns elementos). Confira numa fonte oficial antes de usar em avaliações.</li>
        <li><strong>Termoquímica:</strong> ΔHf° e S° tabelados a 298,15 K e 1 atm; não são consultados em tempo real.</li>
        <li><strong>PubChem, OPSIN, CACTUS e Wikipédia:</strong> consultados pela internet (módulos 2 e 13 e alguns campos automáticos); podem falhar ou demorar. Use CANCELAR se necessário.</li>
        <li><strong>Fontes tipográficas:</strong> VT323 e IBM Plex Mono (licença OFL), hospedadas no próprio projeto.</li></ul></div>
      <div><div class="font-bold">Aproximações dos cálculos</div><ul class="list-disc pl-5 space-y-1">
        <li>Soluções e gases são tratados como <strong>ideais</strong> (atividade ≈ concentração; sem complexação ou hidrólise secundária).</li>
        <li>Previsão de tipo de ligação por ΔEN (0,4 e 1,7) e NOX por regras são <strong>regras práticas</strong>, com exceções.</li>
        <li>A simulação molecular é um modelo 2D simplificado de esferas rígidas; mostra tendências, não valores quantitativos de laboratório.</li>
        <li>O passo a passo é recalculado de forma independente e só aparece quando concorda (±1 %) com o resultado do módulo.</li></ul></div>
      <div><div class="font-bold">O que ainda não foi revisado</div><p>As descrições, fórmulas-chave e textos de teoria dos módulos foram escritos sem revisão de um professor de química. Se encontrar um erro, trate o resultado com cautela e confira num livro.</p></div>
      <div><button class="dos-btn" onclick="closeModal();showHelp()">ATALHOS E COMANDOS</button></div></div>`);
  };
  if (window.__palActions) window.__palActions.push(["Sobre e limitações", () => showAbout()]);
})();
