        /* ==========================================================================
           4. AUDIO, TEMAS, MODAL E UI
           ========================================================================== */
        let soundEnabled = false;
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        function playBeep(freq = 800, duration = 0.03) {
            if (!soundEnabled) return;
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "square";
                osc.frequency.value = freq;
                gain.gain.value = 0.02;
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + duration);
            } catch(e) {}
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            document.getElementById("sound-btn").innerText = soundEnabled ? "[ON]" : "[OFF]";
            if (soundEnabled) playBeep(1000, 0.05);
        }

        function toggleCRT() { document.getElementById("app-body").classList.toggle("no-crt"); }

        function setTheme(theme) {
            document.body.className = `h-full flex flex-col crt p-2 md:p-3 select-text theme-${theme}`;
            if(theme === 'green') document.body.className = `h-full flex flex-col crt p-2 md:p-3 select-text`;
            playBeep(600, 0.04);
        }

        setInterval(() => {
            document.getElementById("clock").innerText = new Date().toLocaleTimeString('pt-BR');
        }, 1000);

        document.addEventListener("click", (e) => {
            const isInput = ["INPUT", "TEXTAREA", "BUTTON", "A", "SELECT"].includes(e.target.tagName);
            if (!isInput && !window.getSelection().toString()) {
                document.getElementById("cli-input").focus();
            }
        });

        function openModal(title, bodyHTML) {
            document.getElementById("modal-title").innerText = title;
            document.getElementById("modal-body").innerHTML = bodyHTML;
            document.getElementById("modal").classList.remove("hidden");
            playBeep(850, 0.04);
        }

        function closeModal() {
            document.getElementById("modal").classList.add("hidden");
            document.getElementById("cli-input").focus();
            playBeep(500, 0.03);
        }

        function isModalOpen() {
            return !document.getElementById("modal").classList.contains("hidden");
        }

        function showHelp() {
            const body = `
                <div class="mb-3">
                    <div class="font-bold underline mb-1">NAVEGAÇÃO</div>
                    <div>• Digite um número de <strong>1 a 23</strong> no CLI e pressione ENTER para abrir um módulo direto.</div>
                    <div>• Digite <strong>home</strong>, <strong>menu</strong>, <strong>cls</strong> ou <strong>exit</strong> para voltar ao início.</div>
                    <div>• Digite <strong>test</strong> para rodar a suíte de testes automatizados (módulo 20).</div>
                    <div>• Tecla <strong>ESC</strong> fecha este modal ou volta ao menu principal.</div>
                </div>
                <div class="mb-3">
                    <div class="font-bold underline mb-1">COMANDOS RÁPIDOS DO CLI</div>
                    <div>• <strong>pubchem &lt;nome&gt;</strong> — ex: <em>pubchem caffeine</em>.</div>
                    <div>• <strong>balance &lt;equação&gt;</strong> — ex: <em>balance H2+O2=H2O</em>.</div>
                    <div>• <strong>resolve &lt;nome&gt;</strong> — ex: <em>resolve ethanoic acid</em>.</div>
                    <div>• <strong>estrutura</strong> | <strong>editor</strong> — abre o editor de estruturas químicas (módulo 21).</div>
                    <div>• <strong>simulacao</strong> | <strong>md</strong> — abre a simulação molecular de teoria cinética dos gases (módulo 22).</div>
                    <div>• <strong>experimento</strong> | <strong>lab</strong> — abre o laboratório virtual de experimentos guiados (módulo 23).</div>
                    <div>• <strong>test</strong> — roda a suíte de validação de todos os motores de cálculo.</div>
                </div>
                <div class="mb-3">
                    <div class="font-bold underline mb-1">MÓDULOS DISPONÍVEIS</div>
                    <div class="grid grid-cols-1 gap-1 text-xs">
                        <div><strong>1.</strong> Balanciador de equações — aceita coeficientes, parênteses/colchetes, hidratos (ex: CuSO4.5H2O).</div>
                        <div><strong>2.</strong> Consulta PubChem — digite nome em inglês. Traz estrutura, GHS e resumo.</div>
                        <div><strong>3.</strong> Massa molar.</div>
                        <div><strong>4.</strong> Preparo de solução — "BUSCAR API" preenche massa molar e densidade.</div>
                        <div><strong>5.</strong> Diluição C1V1=C2V2 — deixe exatamente 1 campo vazio.</div>
                        <div><strong>6.</strong> pH de ácido fraco — busque o pKa pela API ou informe o Ka.</div>
                        <div><strong>7.</strong> Tabela periódica.</div>
                        <div><strong>8.</strong> Estequiometria — reagente limitante e rendimento.</div>
                        <div><strong>9.</strong> Termoquímica — sempre inclua o estado físico, ex: CO2(g).</div>
                        <div><strong>10.</strong> Tampão (Henderson-Hasselbalch).</div>
                        <div><strong>11.</strong> Lei dos gases — combinada ou ideal.</div>
                        <div><strong>12.</strong> Nernst.</div>
                        <div><strong>13.</strong> Nomenclatura (OPSIN + CACTUS).</div>
                        <div><strong>14.</strong> Cinética química.</div>
                        <div><strong>15.</strong> Equilíbrio (Kc).</div>
                        <div><strong>16.</strong> Titulação forte-forte.</div>
                        <div><strong>17.</strong> Espectroscopia (Beer-Lambert + conversões).</div>
                        <div><strong>18.</strong> Titulação fraco-forte (solução exata).</div>
                        <div><strong>19.</strong> Solubilidade/Kps.</div>
                        <div><strong>20.</strong> <strong class="text-yellow-300">Suíte de testes</strong> — valida todos os motores contra valores conhecidos.</div>
                        <div><strong>21.</strong> Editor de estruturas químicas — desenhe átomos e ligações em uma tela 2D; a fórmula e a massa molar são calculadas automaticamente.</div>
                        <div><strong>22.</strong> Simulação molecular — teoria cinética dos gases: partículas em movimento amostradas da distribuição de Maxwell-Boltzmann, com histograma de velocidades em tempo real.</div>
                        <div><strong>23.</strong> <strong class="text-cyan-300">Experimentos guiados (laboratório virtual)</strong> — conduza uma titulação passo a passo numa bancada virtual (bureta, frasco com indicador que muda de cor), registre seus próprios dados e gere um relatório imprimível comparando o que você observou com o valor teórico.</div>
                    </div>
                </div>
                <div class="text-xs opacity-70 border-t border-current pt-2">
                    <strong>Sobre a precisão dos dados:</strong> este software usa APIs públicas gratuitas e uma base termodinâmica local limitada. Não substitui uma FISPQ/SDS oficial nem validação em laboratório. Use para fins didáticos.
                </div>
            `;
            openModal("AJUDA — CHEM.OS v7.0", body);
        }
