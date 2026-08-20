        /* ==========================================================================
           12. MÓDULO 22 — SIMULAÇÃO MOLECULAR (TEORIA CINÉTICA DOS GASES)
           ========================================================================== */
        const SIM_K_B = 1.380649e-23;      // Constante de Boltzmann (J/K)
        const SIM_R = 8.314;               // Constante dos gases (J/(mol·K))
        const SIM_N_A = 6.02214076e23;     // Constante de Avogadro (1/mol)
        const SIM_SCALE = 0.005;           // fator de escala visual: px por (m/s), fixo para todas as configurações
        const SIM_RADIUS = 5;              // raio de desenho das partículas (px)

        let simCanvas = null, simCtx = null, simHistCanvas = null, simHistCtx = null;
        let simParticles = [];             // { x, y, vx, vy }  (vx, vy em px/frame, unidades de tela)
        let simRunning = true;
        let simRafId = null;
        let simMolarMass = 28.01;          // g/mol (padrão: N2)
        let simTempK = 298;

        function simRandNormal() {
            // Transformação de Box-Muller para amostra gaussiana padrão N(0,1)
            let u = 1 - Math.random();
            let v = Math.random();
            return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        }

        function initMolSim() {
            simCanvas = document.getElementById("sim-canvas");
            simHistCanvas = document.getElementById("sim-hist-canvas");
            if (!simCanvas || !simHistCanvas) return;
            simCtx = simCanvas.getContext("2d");
            simHistCtx = simHistCanvas.getContext("2d");
            simCanvas.width = simCanvas.clientWidth;
            simHistCanvas.width = simHistCanvas.clientWidth;

            document.getElementById("sim-gas").addEventListener("change", simOnGasChange);
            document.getElementById("sim-gas-custom").addEventListener("change", resetSim);
            document.getElementById("sim-temp").addEventListener("input", simOnTempInput);
            document.getElementById("sim-temp").addEventListener("change", resetSim);
            document.getElementById("sim-n").addEventListener("input", simOnNInput);
            document.getElementById("sim-n").addEventListener("change", resetSim);

            window.addEventListener("resize", simResizeHandler);

            simRunning = true;
            document.getElementById("sim-toggle-btn").textContent = "PAUSAR";
            resetSim();
            if (simRafId) cancelAnimationFrame(simRafId);
            simRafId = requestAnimationFrame(simLoop);
        }

        function simResizeHandler() {
            if (!simCanvas || !document.body.contains(simCanvas)) {
                window.removeEventListener("resize", simResizeHandler);
                return;
            }
            simCanvas.width = simCanvas.clientWidth;
            simHistCanvas.width = simHistCanvas.clientWidth;
        }

        function simOnGasChange() {
            const sel = document.getElementById("sim-gas");
            const customInput = document.getElementById("sim-gas-custom");
            if (sel.value === "custom") {
                customInput.classList.remove("hidden");
                if (!customInput.value) customInput.value = "28.01";
            } else {
                customInput.classList.add("hidden");
            }
            resetSim();
        }

        function simOnTempInput() {
            document.getElementById("sim-temp-label").textContent = document.getElementById("sim-temp").value + " K";
        }

        function simOnNInput() {
            document.getElementById("sim-n-label").textContent = document.getElementById("sim-n").value;
        }

        function getSimMolarMass() {
            const sel = document.getElementById("sim-gas");
            if (sel.value === "custom") {
                const v = parseFloat(document.getElementById("sim-gas-custom").value);
                return (v && v > 0) ? v : 28.01;
            }
            return parseFloat(sel.value);
        }

        function resetSim() {
            if (!simCanvas) return;
            simMolarMass = getSimMolarMass();
            simTempK = parseFloat(document.getElementById("sim-temp").value);
            document.getElementById("sim-temp-label").textContent = simTempK + " K";
            const n = parseInt(document.getElementById("sim-n").value);
            document.getElementById("sim-n-label").textContent = n;

            const massKg = (simMolarMass * 1e-3) / SIM_N_A;
            const sigma = Math.sqrt(SIM_K_B * simTempK / massKg); // desvio-padrão de velocidade por dimensão (m/s)

            const w = simCanvas.width, h = simCanvas.height;
            simParticles = [];
            for (let i = 0; i < n; i++) {
                const vxReal = sigma * simRandNormal();
                const vyReal = sigma * simRandNormal();
                simParticles.push({
                    x: SIM_RADIUS + Math.random() * (w - 2 * SIM_RADIUS),
                    y: SIM_RADIUS + Math.random() * (h - 2 * SIM_RADIUS),
                    vx: vxReal * SIM_SCALE,
                    vy: vyReal * SIM_SCALE
                });
            }
            simDrawFrame();
            simUpdateStats();
        }

        function toggleSim() {
            simRunning = !simRunning;
            document.getElementById("sim-toggle-btn").textContent = simRunning ? "PAUSAR" : "CONTINUAR";
            if (simRunning && !simRafId) simRafId = requestAnimationFrame(simLoop);
        }

        function simLoop() {
            if (!simCanvas || !document.body.contains(simCanvas)) { simRafId = null; return; }
            if (simRunning) {
                simStep();
                simDrawFrame();
                if (simFrameCounter % 6 === 0) simUpdateStats();
                simFrameCounter++;
            }
            simRafId = requestAnimationFrame(simLoop);
        }
        let simFrameCounter = 0;

        function simStep() {
            const w = simCanvas.width, h = simCanvas.height;
            const r = SIM_RADIUS;

            // Movimento + colisão elástica com as paredes (reflexão especular, sem perda de energia)
            simParticles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < r) { p.x = r; p.vx = Math.abs(p.vx); }
                if (p.x > w - r) { p.x = w - r; p.vx = -Math.abs(p.vx); }
                if (p.y < r) { p.y = r; p.vy = Math.abs(p.vy); }
                if (p.y > h - r) { p.y = h - r; p.vy = -Math.abs(p.vy); }
            });

            // Colisões elásticas partícula-partícula (esferas rígidas de massa igual)
            for (let i = 0; i < simParticles.length; i++) {
                for (let j = i + 1; j < simParticles.length; j++) {
                    const a = simParticles[i], b = simParticles[j];
                    const dx = b.x - a.x, dy = b.y - a.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist > 0 && dist < 2 * r) {
                        const nx = dx / dist, ny = dy / dist;
                        const relVx = a.vx - b.vx, relVy = a.vy - b.vy;
                        const approach = relVx * nx + relVy * ny;
                        if (approach > 0) {
                            // Massas iguais: troca-se a componente normal da velocidade (colisão elástica 1D ao longo da normal)
                            a.vx -= approach * nx; a.vy -= approach * ny;
                            b.vx += approach * nx; b.vy += approach * ny;
                        }
                        // Correção posicional para evitar sobreposição persistente
                        const overlap = (2 * r - dist) / 2;
                        a.x -= nx * overlap; a.y -= ny * overlap;
                        b.x += nx * overlap; b.y += ny * overlap;
                    }
                }
            }
        }

        function simDrawFrame() {
            if (!simCtx) return;
            const w = simCanvas.width, h = simCanvas.height;
            const styles = getComputedStyle(document.body);
            const textColor = styles.getPropertyValue('--text-color').trim() || '#00FF66';
            const bgColor = styles.getPropertyValue('--bg-color').trim() || '#000000';

            simCtx.fillStyle = bgColor;
            simCtx.fillRect(0, 0, w, h);
            simCtx.fillStyle = textColor;
            simParticles.forEach(p => {
                simCtx.beginPath();
                simCtx.arc(p.x, p.y, SIM_RADIUS, 0, Math.PI * 2);
                simCtx.fill();
            });
        }

        function simUpdateStats() {
            if (!simParticles.length) return;

            // v_rms real (m/s), obtido convertendo a velocidade de tela de volta pela escala fixa
            let sumSq = 0;
            const speedsReal = simParticles.map(p => {
                const speed = Math.hypot(p.vx, p.vy) / SIM_SCALE;
                sumSq += speed * speed;
                return speed;
            });
            const vrmsSim = Math.sqrt(sumSq / simParticles.length);

            const mKg = simMolarMass * 1e-3;
            const vrmsTheory = Math.sqrt(3 * SIM_R * simTempK / mKg); // fórmula clássica 3D: v_rms = sqrt(3RT/M)

            // Temperatura instantânea a partir da energia cinética média (equipartição em 2D: <KE> = kB*T)
            const massKg = (simMolarMass * 1e-3) / SIM_N_A;
            const meanKE = 0.5 * massKg * (sumSq / simParticles.length);
            const tInst = meanKE / SIM_K_B;

            document.getElementById("sim-vrms-sim").textContent = vrmsSim.toFixed(1);
            document.getElementById("sim-vrms-theory").textContent = vrmsTheory.toFixed(1);
            document.getElementById("sim-tinst").textContent = tInst.toFixed(0);

            simDrawHistogram(speedsReal, mKg);
        }

        function simDrawHistogram(speedsReal, mKg) {
            if (!simHistCtx) return;
            const w = simHistCanvas.width, h = simHistCanvas.height;
            const styles = getComputedStyle(document.body);
            const textColor = styles.getPropertyValue('--text-color').trim() || '#00FF66';
            const bgColor = styles.getPropertyValue('--bg-color').trim() || '#000000';

            simHistCtx.fillStyle = bgColor;
            simHistCtx.fillRect(0, 0, w, h);

            const sigma = Math.sqrt(SIM_K_B * simTempK / mKg);
            const maxSpeed = Math.max(...speedsReal, sigma * 4) * 1.05;
            const bins = 24;
            const binWidth = maxSpeed / bins;
            const counts = new Array(bins).fill(0);
            speedsReal.forEach(s => {
                const idx = Math.min(bins - 1, Math.floor(s / binWidth));
                counts[idx]++;
            });
            const maxCount = Math.max(...counts, 1);

            // Barras: distribuição simulada
            simHistCtx.fillStyle = textColor;
            simHistCtx.globalAlpha = 0.55;
            const barW = w / bins;
            counts.forEach((c, i) => {
                const barH = (c / maxCount) * (h - 4);
                simHistCtx.fillRect(i * barW, h - barH, barW - 1, barH);
            });
            simHistCtx.globalAlpha = 1;

            // Curva teórica: distribuição de Maxwell-Boltzmann de velocidades em 2D (Rayleigh), f(v) = (v/σ²)·exp(-v²/(2σ²))
            let maxF = 0;
            const fVals = [];
            for (let i = 0; i <= bins; i++) {
                const v = i * binWidth;
                const f = (v / (sigma * sigma)) * Math.exp(-(v * v) / (2 * sigma * sigma));
                fVals.push(f);
                if (f > maxF) maxF = f;
            }
            simHistCtx.strokeStyle = textColor;
            simHistCtx.lineWidth = 2;
            simHistCtx.beginPath();
            fVals.forEach((f, i) => {
                const x = i * binWidth / maxSpeed * w;
                const y = h - (f / maxF) * (h - 4);
                if (i === 0) simHistCtx.moveTo(x, y); else simHistCtx.lineTo(x, y);
            });
            simHistCtx.stroke();
        }
