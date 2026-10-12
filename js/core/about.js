/* v10 — "Sobre e limitações": de onde vêm os dados, o que é aproximado e o que não foi revisado por um professor. */
(function () {
  window.showAbout = function () {
    openModal("SOBRE O CHEM.OS E SUAS LIMITAÇÕES", `<div class="space-y-3 text-sm">
      <p><strong>CHEM.OS v11</strong> é uma ferramenta de estudo de química que roda inteira no navegador (funciona offline depois da primeira visita). Foi feita para <strong>aprender e conferir cálculos</strong>, não para decisões de segurança ou trabalho em laboratório real.</p>
      <div><div class="font-bold">De onde vêm os dados</div><ul class="list-disc pl-5 space-y-1">
        <li><strong>Massas atômicas, grupos e períodos:</strong> tabela local do projeto.</li>
        <li><strong>Eletronegatividade (Pauling), 1ª energia de ionização e raio atômico:</strong> valores de livros-texto digitados à mão (Z = 1–92 para eletronegatividade; sem dado para alguns elementos). Confira numa fonte oficial antes de usar em avaliações.</li>
        <li><strong>Termoquímica:</strong> ΔHf° e S° tabelados a 298,15 K e 1 atm; não são consultados em tempo real.</li>
        <li><strong>PubChem, OPSIN, CACTUS e Wikipédia:</strong> consultados pela internet (módulos 2 e 13 e alguns campos automáticos); podem falhar ou demorar. Use CANCELAR se necessário.</li>
        <li><strong>Fontes tipográficas:</strong> VT323 e IBM Plex Mono (licença OFL), hospedadas no próprio projeto.</li></ul></div>
      <div><div class="font-bold">Verificação (v10.3)</div><ul class="list-disc pl-5 space-y-1">
        <li>Os módulos de cálculo foram conferidos com mais de 30 casos de resposta conhecida (massa molar, balanceamento, pH, tampões, titulações, gases, Nernst, cinética, Kc, Ksp, Beer-Lambert, termoquímica, NOX, ligações).</li>
        <li>Os 118 elementos (símbolo, número atômico, massa, período e grupo) foram comparados com os conjuntos de dados de referência <em>mendeleev</em> e <em>periodictable</em>; eletronegatividade e ionização foram conferidas elemento a elemento, e os valores em disputa foram checados em fontes externas. as 37 entradas de ΔHf° e S° foram comparadas com a biblioteca de referência <em>chemicals</em> (a glicose por fontes de livros-texto; o CO₂ aquoso segue o valor de livro-texto e não foi reconfirmado).</li>
        <li>Escalas e fontes variam: a eletronegatividade segue a escala de Pauling revisada (ex.: W 2,36 e Pb 2,33), a energia de ionização do Tc usa a medida de 2010 (7,119 eV) e as massas dos elementos superpesados são as do isótopo mais estável.</li>
        <li>A teoria, os exemplos e as perguntas do módulo 24 passaram por revisão de conteúdo.</li>
        <li>Segurança (GHS, módulo 2): os pictogramas vêm do PubChem ou do código H de cada frase (Anexo 3 do GHS), a palavra Perigo/Atenção é exibida, todas as frases aparecem (as mais graves primeiro) e a ausência de dados ou a falha de rede <strong>nunca</strong> é exibida como "seguro". É material educativo e não substitui a FISPQ/SDS do fabricante.</li>
        <li>Módulo 34 (previsão na eletrólise): aplica regras didáticas de facilidade de descarga; na prática, concentração, eletrodos e sobretensão podem mudar os produtos.</li>
        <li>Módulo 33 (eletrólise): usa F = 96 485,33 C/mol e as massas atômicas da tabela do site; assume 100 % de rendimento da corrente, salvo ajuste, e gases ideais. As fórmulas foram conferidas por contas independentes (ex.: 2 A por 1 h depositam 2,371 g de Cu).</li>
        <li>Módulo 32 (pilhas): a tabela de potenciais-padrão de redução foi conferida em tabelas publicadas. Livros diferem em ±0,02 a 0,05 V em alguns pares (ex.: Fe²⁺/Fe −0,44 ou −0,41 V); o módulo usa valores modernos arredondados em 2 casas e avisa disso.</li>
        <li>Valores de tabelas são de 25 °C e podem diferir na 3ª ou 4ª casa decimal conforme a fonte consultada. Para trabalho técnico, confira sempre com a literatura primária.</li></ul></div>
      <div><div class="font-bold">Privacidade</div><ul class="list-disc pl-5 space-y-1">
        <li>Não há conta, cadastro, anúncios nem rastreamento. Seu progresso, favoritos e preferências ficam <strong>apenas neste navegador</strong> (armazenamento local) e podem ser exportados ou apagados nas configurações.</li>
        <li>Só os módulos de consulta online (PubChem, OPSIN, CACTUS, Wikipédia) enviam à internet o nome do composto que você digitar. Os demais cálculos acontecem no seu dispositivo.</li></ul></div>
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
