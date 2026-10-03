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
            document.getElementById("sound-btn").setAttribute("aria-pressed", String(soundEnabled));
            if (soundEnabled) playBeep(1000, 0.05);
            savePrefs({ sound: soundEnabled });
        }

        function toggleCRT() {
            const isNoCrt = document.getElementById("app-body").classList.toggle("no-crt");
            savePrefs({ noCrt: isNoCrt });
        }

        // Reinicia a animação de entrada de #screen-content — como o elemento nunca
        // é removido do DOM (só seu innerHTML muda), é preciso remover a classe,
        // forçar um reflow e reaplicá-la para o keyframe rodar de novo a cada troca
        // de tela/módulo.
        function screenAnimateIn() {
            const el = document.getElementById("screen-content");
            if (!el) return;
            el.classList.remove("screen-fade-in");
            void el.offsetWidth; // força reflow
            el.classList.add("screen-fade-in");
        }

        // Retrigger genérico de uma animação CSS em qualquer elemento por id
        // (usado para pulsos, ticks numéricos e destaques pontuais).
        function pulseElement(id, className) {
            const el = document.getElementById(id);
            if (!el) return;
            el.classList.remove(className);
            void el.offsetWidth;
            el.classList.add(className);
        }

        function setTheme(theme, silent) {
            document.body.className = `h-full flex flex-col crt p-2 md:p-3 select-text theme-${theme}`;
            if(theme === 'green') document.body.className = `h-full flex flex-col crt p-2 md:p-3 select-text`;
            if (!silent) playBeep(600, 0.04);
            savePrefs({ theme });
        }

        /* ---------- Indicador de conectividade (cabeçalho) ---------- */
        // Reflete o estado real de conexão do navegador (navigator.onLine), em
        // vez do "ONLINE" decorativo fixo de antes. Não é 100% infalível (uma
        // rede local sem internet ainda conta como "online" para o navegador),
        // mas já avisa o caso mais comum: sem rede nenhuma, os módulos que
        // dependem de PubChem/OPSIN/CACTUS/Wikipédia não vão responder — e sem
        // esse aviso, o aluno só descobre isso tentando e vendo um erro solto.
        function updateConnectivityBadge() {
            const el = document.getElementById("sys-status");
            if (!el) return;
            if (navigator.onLine) {
                el.textContent = "ONLINE";
                el.className = "animate-pulse text-green-400";
                el.removeAttribute("title");
            } else {
                el.textContent = "OFFLINE";
                el.className = "text-red-500";
                el.title = "Sem conexão detectada — módulos que dependem de PubChem, OPSIN, CACTUS ou Wikipédia não vão responder até a conexão voltar.";
            }
        }
        window.addEventListener("online", updateConnectivityBadge);
        window.addEventListener("offline", updateConnectivityBadge);
        const CHEMOS_PREFS_KEY = "chemos_prefs_v1";

        function loadPrefs() {
            try {
                const raw = localStorage.getItem(CHEMOS_PREFS_KEY);
                return raw ? JSON.parse(raw) : {};
            } catch (e) { return {}; }
        }

        function savePrefs(partial) {
            try {
                const current = loadPrefs();
                localStorage.setItem(CHEMOS_PREFS_KEY, JSON.stringify({ ...current, ...partial }));
            } catch (e) { /* localStorage indisponível (modo privado, quota etc.) — falha silenciosa */ }
        }

        // Chamado uma vez no boot (antes de renderHome) para restaurar tema, som e
        // CRT da sessão anterior, evitando que o app sempre volte ao padrão de
        // fábrica a cada F5 — útil para quem usa isso em toda aula/lab.
        function applyStoredPrefs() {
            const prefs = loadPrefs();
            if (prefs.theme) setTheme(prefs.theme, true);
            if (prefs.sound) {
                soundEnabled = true;
                const btn = document.getElementById("sound-btn");
                if (btn) { btn.innerText = "[ON]"; btn.setAttribute("aria-pressed", "true"); }
            }
            if (prefs.noCrt) document.getElementById("app-body").classList.add("no-crt");
        }

        // Tour de boas-vindas simples, mostrado apenas na primeira visita (marcado
        // em localStorage). Sugere por onde começar em vez de largar o aluno
        // direto num menu de 23 módulos sem contexto.
        function maybeShowOnboardingTour() {
            const prefs = loadPrefs();
            if (prefs.onboardingSeen) return;
            openModal("BEM-VINDO AO CHEM.OS v10", `
                <div class="text-sm mb-3">Este é um laboratório de química com 31 módulos — de calculadoras rápidas a um laboratório virtual guiado. Não sabe por onde começar? Algumas sugestões:</div>
                <div class="space-y-2 text-xs mb-3">
                    <div class="dos-border p-2"><strong>Precisa revisar a base primeiro?</strong> O módulo <strong>24 — Guia de Estudos</strong> resume os fundamentos de Química Geral (mol, pH, ligações, gases...) com mnemônicos e mini-quiz.</div>
                    <div class="dos-border p-2"><strong>Novo por aqui?</strong> Comece pelo módulo <strong>3</strong> (massa molar) ou <strong>1</strong> (balanciador) — são os mais diretos.</div>
                    <div class="dos-border p-2"><strong>Quer algo mais imersivo?</strong> O módulo <strong>23 — Laboratório Virtual</strong> te coloca para conduzir uma titulação de verdade, com bureta, indicador e relatório final.</div>
                    <div class="dos-border p-2"><strong>Professor(a) preparando aula?</strong> Pressione <strong>F1</strong> a qualquer momento para ver a lista completa de módulos e comandos.</div>
                </div>
                <div class="flex justify-end">
                    <button onclick="closeModal()" class="dos-btn">ENTENDI, VAMOS COMEÇAR</button>
                </div>
            `);
            savePrefs({ onboardingSeen: true });
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
            const modalEl = document.getElementById("modal");
            modalEl.classList.remove("hidden");
            modalEl.setAttribute("aria-hidden", "false");
            playBeep(850, 0.04);
            // Move o foco para dentro do modal (primeiro botão focável) — importante
            // para quem navega por teclado/leitor de tela não perder o contexto.
            const firstBtn = document.querySelector("#modal-body button, #modal-body input, #modal-body textarea");
            (firstBtn || document.querySelector('#modal button[onclick="closeModal()"]'))?.focus();
        }

        function closeModal() {
            const modalEl = document.getElementById("modal");
            modalEl.classList.add("hidden");
            modalEl.setAttribute("aria-hidden", "true");
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
                    <div>• Digite um número de <strong>1 a 25</strong> no CLI e pressione ENTER para abrir um módulo direto.</div>
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
                    <div>• <strong>estudar</strong> | <strong>guia</strong> — abre o guia de estudos de Química Geral (módulo 24).</div>
                    <div>• <strong>detetive</strong> | <strong>caso</strong> — abre o Detetive Químico, identificação de cátions (módulo 25).</div>
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
                        <div><strong>24.</strong> Fundamentos de Química Geral (guia de estudos) — 15 tópicos (matéria, átomos, tabela periódica, ligações, reações, mol, gases, soluções, ácidos/bases, termoquímica, config. eletrônica, nomenclatura, redox, equilíbrio/Le Chatelier, forças intermoleculares), cada um com diagrama, mnemônico, 2 exemplos resolvidos e mini-quiz de 5 perguntas. Inclui glossário geral pesquisável e progresso salvo entre sessões.</div>
                        <div><strong>25.</strong> <strong class="text-cyan-300">Detetive Químico</strong> — identifique um cátion metálico desconhecido usando cor da solução, teste de chama e reações de precipitação com 4 reagentes clássicos (química analítica qualitativa de verdade). Gera uma ficha do caso imprimível, mesmo quando você erra.</div>
                    </div>
                </div>
                <div class="text-xs opacity-70 border-t border-current pt-2">
                    <strong>Sobre a precisão dos dados:</strong> este software usa APIs públicas gratuitas e uma base termodinâmica local limitada. Não substitui uma FISPQ/SDS oficial nem validação em laboratório. Use para fins didáticos.
                </div>
            `;
            openModal("AJUDA — CHEM.OS v10", body);
        }
