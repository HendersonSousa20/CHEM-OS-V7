        /* ==========================================================================
           11. MÓDULO 21 — EDITOR DE ESTRUTURAS QUÍMICAS (2D)
           ========================================================================== */
        const SE_PALETTE = ["C", "H", "O", "N", "S", "P", "F", "Cl", "Br", "I"];
        const SE_VALENCE = { C: 4, N: 3, O: 2, S: 2, P: 3, F: 1, Cl: 1, Br: 1, I: 1, B: 3, Si: 4, H: 1 };
        const SE_ATOM_R = 16;       // raio desenhado do átomo (px)
        const SE_HIT_R = 22;        // raio de detecção de toque/clique (maior que o desenhado, facilita o dedo em telas de toque)
        const SE_BOND_HIT_THRESH = 10; // tolerância para tocar/clicar numa ligação

        const SEC = {};

        let seCanvas = null, seCtx = null;
        let seAtoms = [];              // { id, x, y, el }
        let seBonds = [];              // { id, a, b, order }
        let seNextId = 1;
        let seTool = "atom";           // 'atom' | 'bond' | 'erase'
        let seSelectedElement = "C";
        let sePendingBondAtom = null;  // id of first atom clicked while in 'bond' mode
        let seHistory = [];

        function initStructureEditor() {
            seCanvas = document.getElementById("structure-canvas");
            if (!seCanvas) return;
            seCtx = seCanvas.getContext("2d");

            // Cada abertura do módulo começa com uma tela em branco.
            seAtoms = []; seBonds = []; seNextId = 1; sePendingBondAtom = null; seHistory = [];
            seTool = "atom"; seSelectedElement = "C";

            hidpiFit(seCanvas, SEC);
            seCanvas.onclick = handleEditorClick;
            seCanvas.addEventListener("touchend", handleEditorTouch, { passive: false });
            window.addEventListener("resize", seResizeHandler);

            renderElementPalette();
            updateToolButtons();
            drawEditor();
            updateFormulaDisplay();
        }

        function seResizeHandler() {
            if (!seCanvas || !document.body.contains(seCanvas)) {
                window.removeEventListener("resize", seResizeHandler);
                return;
            }
            hidpiFit(seCanvas, SEC);
            drawEditor();
        }

        function renderElementPalette() {
            const el = document.getElementById("se-element-palette");
            if (!el) return;
            el.innerHTML = SE_PALETTE.map(sym =>
                `<button onclick="selectElement('${sym}')" id="se-el-${sym}" class="dos-btn px-2 py-1.5">${sym}</button>`
            ).join('');
            highlightSelectedElement();
        }

        function selectElement(sym) {
            seSelectedElement = sym;
            seTool = "atom";
            updateToolButtons();
            highlightSelectedElement();
        }

        function setCustomElement() {
            const inp = document.getElementById("se-custom-el");
            const errEl = document.getElementById("se-custom-el-error");
            const raw = (inp.value || "").trim();
            if (errEl) errEl.textContent = "";
            if (!raw) return;
            const sym = raw[0].toUpperCase() + raw.slice(1).toLowerCase();
            if (!ATOMIC_WEIGHTS[sym]) {
                if (errEl) { errEl.textContent = "Símbolo de elemento desconhecido: " + sym; pulseElement("se-custom-el-error", "field-error-flash"); }
                return;
            }
            seSelectedElement = sym;
            seTool = "atom";
            updateToolButtons();
            highlightSelectedElement();
        }

        function highlightSelectedElement() {
            SE_PALETTE.forEach(sym => {
                const btn = document.getElementById("se-el-" + sym);
                if (!btn) return;
                const active = sym === seSelectedElement;
                btn.style.backgroundColor = active ? "var(--text-color)" : "transparent";
                btn.style.color = active ? "var(--bg-color)" : "var(--text-color)";
            });
        }

        function setEditorTool(tool) {
            seTool = tool;
            sePendingBondAtom = null;
            updateToolButtons();
            drawEditor();
        }

        function updateToolButtons() {
            ["atom", "bond", "erase"].forEach(t => {
                const btn = document.getElementById("se-tool-" + t);
                if (!btn) return;
                const active = t === seTool;
                btn.style.backgroundColor = active ? "var(--text-color)" : "transparent";
                btn.style.color = active ? "var(--bg-color)" : "var(--text-color)";
            });
        }

        function pushEditorHistory() {
            seHistory.push(JSON.stringify({ atoms: seAtoms, bonds: seBonds, nextId: seNextId }));
            if (seHistory.length > 50) seHistory.shift();
        }

        function undoEditor() {
            if (!seHistory.length) return;
            const snap = JSON.parse(seHistory.pop());
            seAtoms = snap.atoms; seBonds = snap.bonds; seNextId = snap.nextId;
            sePendingBondAtom = null;
            drawEditor();
            updateFormulaDisplay();
            playBeep(500, 0.03);
        }

        function clearEditor() {
            if (!seAtoms.length && !seBonds.length) return;
            pushEditorHistory();
            seAtoms = []; seBonds = []; seNextId = 1; sePendingBondAtom = null;
            drawEditor();
            updateFormulaDisplay();
            playBeep(300, 0.05);
        }

        function findAtomAt(x, y) {
            return seAtoms.find(a => Math.hypot(a.x - x, a.y - y) <= SE_HIT_R);
        }

        function distToSegment(px, py, x1, y1, x2, y2) {
            const dx = x2 - x1, dy = y2 - y1;
            const lenSq = dx * dx + dy * dy;
            let t = lenSq ? ((px - x1) * dx + (py - y1) * dy) / lenSq : 0;
            t = Math.max(0, Math.min(1, t));
            const cx = x1 + t * dx, cy = y1 + t * dy;
            return Math.hypot(px - cx, py - cy);
        }

        function findBondAt(x, y) {
            return seBonds.find(b => {
                const a1 = seAtoms.find(a => a.id === b.a);
                const a2 = seAtoms.find(a => a.id === b.b);
                if (!a1 || !a2) return false;
                return distToSegment(x, y, a1.x, a1.y, a2.x, a2.y) <= SE_BOND_HIT_THRESH;
            });
        }

        function handleEditorClick(e) {
            const rect = seCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            handleEditorInteraction(x, y);
        }

        function handleEditorTouch(e) {
            // Evita rolar/zoom a página enquanto o usuário desenha, e suprime o
            // "clique fantasma" que o navegador dispararia logo após o toque.
            e.preventDefault();
            const touch = e.changedTouches[0];
            if (!touch) return;
            const rect = seCanvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            handleEditorInteraction(x, y);
        }

        function handleEditorInteraction(x, y) {
            if (seTool === "atom") {
                const hit = findAtomAt(x, y);
                pushEditorHistory();
                if (hit) { hit.el = seSelectedElement; }
                else { seAtoms.push({ id: seNextId++, x, y, el: seSelectedElement }); }
            } else if (seTool === "bond") {
                const hit = findAtomAt(x, y);
                if (!hit) return; // tocar em espaço vazio não faz nada no modo Ligação
                if (sePendingBondAtom === null) {
                    sePendingBondAtom = hit.id;
                } else if (sePendingBondAtom === hit.id) {
                    sePendingBondAtom = null; // tocou duas vezes no mesmo átomo: cancela seleção
                } else {
                    pushEditorHistory();
                    let bond = seBonds.find(b =>
                        (b.a === sePendingBondAtom && b.b === hit.id) ||
                        (b.a === hit.id && b.b === sePendingBondAtom));
                    if (bond) { bond.order = bond.order >= 3 ? 1 : bond.order + 1; }
                    else { seBonds.push({ id: seNextId++, a: sePendingBondAtom, b: hit.id, order: 1 }); }
                    sePendingBondAtom = null;
                }
            } else if (seTool === "erase") {
                const hitAtom = findAtomAt(x, y);
                if (hitAtom) {
                    pushEditorHistory();
                    seBonds = seBonds.filter(b => b.a !== hitAtom.id && b.b !== hitAtom.id);
                    seAtoms = seAtoms.filter(a => a.id !== hitAtom.id);
                } else {
                    const hitBond = findBondAt(x, y);
                    if (hitBond) { pushEditorHistory(); seBonds = seBonds.filter(b => b.id !== hitBond.id); }
                }
            }

            drawEditor();
            updateFormulaDisplay();
            playBeep(seTool === "erase" ? 250 : 650, 0.02);
        }

        function drawBondLine(a1, a2, order, color) {
            const dx = a2.x - a1.x, dy = a2.y - a1.y;
            const len = Math.hypot(dx, dy) || 1;
            const px = -(dy / len), py = dx / len; // vetor perpendicular unitário
            const gap = 4;
            seCtx.strokeStyle = color;
            seCtx.lineWidth = 2;
            const offsets = order === 1 ? [0] : order === 2 ? [-gap / 2, gap / 2] : [-gap, 0, gap];
            offsets.forEach(off => {
                seCtx.beginPath();
                seCtx.moveTo(a1.x + px * off, a1.y + py * off);
                seCtx.lineTo(a2.x + px * off, a2.y + py * off);
                seCtx.stroke();
            });
        }

        function drawEditor() {
            if (!seCtx) return;
            const w = SEC.lw, h = SEC.lh;
            seCtx.setTransform(SEC.dpr || 1, 0, 0, SEC.dpr || 1, 0, 0);
            const styles = getComputedStyle(document.body);
            const textColor = styles.getPropertyValue('--text-color').trim() || '#00FF66';
            const bgColor = styles.getPropertyValue('--bg-color').trim() || '#000000';

            seCtx.clearRect(0, 0, w, h);
            seCtx.fillStyle = bgColor;
            seCtx.fillRect(0, 0, w, h);

            seCtx.fillStyle = textColor;
            seCtx.globalAlpha = 0.15;
            for (let gx = 20; gx < w; gx += 20) {
                for (let gy = 20; gy < h; gy += 20) { seCtx.fillRect(gx, gy, 1, 1); }
            }
            seCtx.globalAlpha = 1;

            seBonds.forEach(b => {
                const a1 = seAtoms.find(a => a.id === b.a);
                const a2 = seAtoms.find(a => a.id === b.b);
                if (a1 && a2) drawBondLine(a1, a2, b.order, textColor);
            });

            seAtoms.forEach(a => {
                seCtx.beginPath();
                seCtx.arc(a.x, a.y, SE_ATOM_R, 0, Math.PI * 2);
                seCtx.fillStyle = bgColor;
                seCtx.fill();
                seCtx.lineWidth = (seTool === "bond" && sePendingBondAtom === a.id) ? 3 : 1.5;
                seCtx.strokeStyle = textColor;
                seCtx.stroke();
                seCtx.fillStyle = textColor;
                seCtx.font = "bold 14px 'IBM Plex Mono', monospace";
                seCtx.textAlign = "center";
                seCtx.textBaseline = "middle";
                seCtx.fillText(a.el, a.x, a.y + 1);
            });
        }

        function computeEditorFormula() {
            const counts = {};
            seAtoms.forEach(a => {
                counts[a.el] = (counts[a.el] || 0) + 1;
                const valence = SE_VALENCE[a.el];
                if (valence && a.el !== "H") {
                    const used = seBonds
                        .filter(b => b.a === a.id || b.b === a.id)
                        .reduce((s, b) => s + b.order, 0);
                    const implicitH = Math.max(0, valence - used);
                    counts["H"] = (counts["H"] || 0) + implicitH;
                }
            });
            return counts;
        }

        function formulaCountsToString(counts) {
            let str = "";
            if (counts["C"]) { str += "C" + (counts["C"] > 1 ? counts["C"] : ""); }
            if (counts["H"]) { str += "H" + (counts["H"] > 1 ? counts["H"] : ""); }
            Object.keys(counts).sort().forEach(el => {
                if (el === "C" || el === "H") return;
                str += el + (counts[el] > 1 ? counts[el] : "");
            });
            return str || "—";
        }

        function updateFormulaDisplay() {
            const formulaEl = document.getElementById("se-formula");
            const massEl = document.getElementById("se-mass");
            if (!formulaEl || !massEl) return;
            const counts = computeEditorFormula();
            const formulaStr = formulaCountsToString(counts);
            formulaEl.textContent = formulaStr;
            if (Object.keys(counts).length) {
                const parsed = parseFormula(formulaStr);
                massEl.textContent = parsed.totalMass ? parsed.totalMass.toFixed(3) : "0.000";
            } else {
                massEl.textContent = "—";
            }
        }

        function sendEditorFormulaToMolarMass() {
            const counts = computeEditorFormula();
            const formulaStr = formulaCountsToString(counts);
            if (formulaStr === "—") return;
            renderTool(3);
            document.getElementById("molar-input").value = formulaStr;
            runMolarMass();
        }

        function exportEditorPNG() {
            if (!seCanvas) return;
            const link = document.createElement("a");
            link.download = "estrutura-chemos.png";
            link.href = seCanvas.toDataURL("image/png");
            link.click();
        }
