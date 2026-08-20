        /* ==========================================================================
           13. MOTOR DE GRÁFICOS INTERATIVOS (CRT CHART ENGINE)
           Reutilizado pelos módulos 14 (Cinética), 16 e 18 (Titulação).
           Zoom (roda do mouse), pan (arrastar), crosshair + tooltip com valores
           exatos, marcadores verticais e exportação em PNG — tudo em canvas puro,
           sem bibliotecas externas, respeitando as cores do tema ativo.
           ========================================================================== */
        let titrationChart = null, titrationWeakChart = null, kineticsChart = null;

        function chartNiceNum(range, round) {
            if (range === 0) return 1;
            const exponent = Math.floor(Math.log10(range));
            const fraction = range / Math.pow(10, exponent);
            let niceFraction;
            if (round) {
                if (fraction < 1.5) niceFraction = 1;
                else if (fraction < 3) niceFraction = 2;
                else if (fraction < 7) niceFraction = 5;
                else niceFraction = 10;
            } else {
                if (fraction <= 1) niceFraction = 1;
                else if (fraction <= 2) niceFraction = 2;
                else if (fraction <= 5) niceFraction = 5;
                else niceFraction = 10;
            }
            return niceFraction * Math.pow(10, exponent);
        }

        function chartGetTicks(min, max, maxTicks) {
            maxTicks = maxTicks || 6;
            if (min === max) { min -= 1; max += 1; }
            const range = chartNiceNum(max - min, false);
            const step = chartNiceNum(range / (maxTicks - 1), true);
            const niceMin = Math.floor(min / step) * step;
            const niceMax = Math.ceil(max / step) * step;
            const ticks = [];
            for (let v = niceMin; v <= niceMax + step * 1e-9; v += step) ticks.push(Math.round(v / step) * step);
            return ticks;
        }

        function chartFormatNum(v) {
            if (v === 0) return "0";
            if (Math.abs(v) >= 10000 || Math.abs(v) < 0.001) return v.toExponential(2);
            if (Number.isInteger(v)) return String(v);
            return v.toFixed(Math.abs(v) < 10 ? 2 : 1);
        }

        function createInteractiveChart(canvasId, options) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return null;
            const ctx = canvas.getContext("2d");

            const chart = {
                canvas, ctx,
                series: (options && options.series) || [],
                xLabel: (options && options.xLabel) || "X",
                yLabel: (options && options.yLabel) || "Y",
                title: (options && options.title) || "",
                yClampMin: options ? options.yClampMin : undefined,
                yClampMax: options ? options.yClampMax : undefined,
                markers: (options && options.markers) || [],
                view: null, fullDomain: null,
                mouse: null, dragging: false, dragStart: null,
                padding: { left: 54, right: 14, top: (options && options.title) ? 26 : 10, bottom: 34 }
            };

            function computeFullDomain() {
                let xs = [], ys = [];
                chart.series.forEach(s => s.points.forEach(p => { xs.push(p.x); ys.push(p.y); }));
                if (!xs.length) { chart.fullDomain = { xMin: 0, xMax: 1, yMin: 0, yMax: 1 }; return; }
                let xMin = Math.min(...xs), xMax = Math.max(...xs);
                let yMinRaw = Math.min(...ys), yMaxRaw = Math.max(...ys);
                if (xMin === xMax) { xMin -= 1; xMax += 1; }
                if (yMinRaw === yMaxRaw) { yMinRaw -= 1; yMaxRaw += 1; }
                const xPad = (xMax - xMin) * 0.03;
                const yPad = (yMaxRaw - yMinRaw) * 0.08;
                chart.fullDomain = {
                    xMin: xMin - xPad, xMax: xMax + xPad,
                    yMin: chart.yClampMin !== undefined ? chart.yClampMin : yMinRaw - yPad,
                    yMax: chart.yClampMax !== undefined ? chart.yClampMax : yMaxRaw + yPad
                };
            }

            function toPx(x, y) {
                const w = canvas.width, h = canvas.height;
                const { left, right, top, bottom } = chart.padding;
                const plotW = w - left - right, plotH = h - top - bottom;
                const { xMin, xMax, yMin, yMax } = chart.view;
                return [
                    left + (x - xMin) / (xMax - xMin) * plotW,
                    top + (1 - (y - yMin) / (yMax - yMin)) * plotH
                ];
            }

            function toData(px, py) {
                const w = canvas.width, h = canvas.height;
                const { left, right, top, bottom } = chart.padding;
                const plotW = w - left - right, plotH = h - top - bottom;
                const { xMin, xMax, yMin, yMax } = chart.view;
                return [
                    xMin + (px - left) / plotW * (xMax - xMin),
                    yMax - (py - top) / plotH * (yMax - yMin)
                ];
            }

            function resetView() {
                canvas.width = canvas.clientWidth;
                computeFullDomain();
                chart.view = Object.assign({}, chart.fullDomain);
                render();
            }

            function render() {
                if (!chart.view) return;
                const w = canvas.width, h = canvas.height;
                const styles = getComputedStyle(document.body);
                const textColor = styles.getPropertyValue("--text-color").trim() || "#00FF66";
                const bgColor = styles.getPropertyValue("--bg-color").trim() || "#000000";
                const { left, right, top, bottom } = chart.padding;
                const plotW = w - left - right, plotH = h - top - bottom;
                const { xMin, xMax, yMin, yMax } = chart.view;

                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, w, h);

                ctx.font = "11px 'IBM Plex Mono', monospace";
                const xTicks = chartGetTicks(xMin, xMax, 7).filter(v => v >= xMin && v <= xMax);
                const yTicks = chartGetTicks(yMin, yMax, 6).filter(v => v >= yMin && v <= yMax);

                ctx.strokeStyle = textColor;
                ctx.globalAlpha = 0.18;
                ctx.lineWidth = 1;
                xTicks.forEach(v => {
                    const px = toPx(v, 0)[0];
                    ctx.beginPath(); ctx.moveTo(px, top); ctx.lineTo(px, top + plotH); ctx.stroke();
                });
                yTicks.forEach(v => {
                    const py = toPx(0, v)[1];
                    ctx.beginPath(); ctx.moveTo(left, py); ctx.lineTo(left + plotW, py); ctx.stroke();
                });
                ctx.globalAlpha = 1;

                ctx.lineWidth = 1.5;
                ctx.strokeStyle = textColor;
                ctx.beginPath();
                ctx.moveTo(left, top); ctx.lineTo(left, top + plotH); ctx.lineTo(left + plotW, top + plotH);
                ctx.stroke();

                ctx.fillStyle = textColor;
                ctx.textAlign = "right"; ctx.textBaseline = "middle";
                yTicks.forEach(v => { ctx.fillText(chartFormatNum(v), left - 6, toPx(0, v)[1]); });
                ctx.textAlign = "center"; ctx.textBaseline = "top";
                xTicks.forEach(v => { ctx.fillText(chartFormatNum(v), toPx(v, 0)[0], top + plotH + 6); });

                ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
                ctx.fillText(chart.xLabel, left + plotW / 2, h - 6);
                ctx.save();
                ctx.translate(12, top + plotH / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.textAlign = "center";
                ctx.fillText(chart.yLabel, 0, 0);
                ctx.restore();
                if (chart.title) {
                    ctx.textAlign = "left"; ctx.textBaseline = "top";
                    ctx.fillText(chart.title, left, 2);
                }

                chart.markers.forEach(m => {
                    if (m.x < xMin || m.x > xMax) return;
                    const px = toPx(m.x, 0)[0];
                    ctx.strokeStyle = m.color || "#FF4444";
                    ctx.setLineDash([4, 4]);
                    ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(px, top); ctx.lineTo(px, top + plotH); ctx.stroke();
                    ctx.setLineDash([]);
                    if (m.label) {
                        ctx.fillStyle = m.color || "#FF4444";
                        ctx.textAlign = "left"; ctx.textBaseline = "bottom";
                        ctx.fillText(m.label, px + 4, top + plotH - 3);
                    }
                });

                ctx.save();
                ctx.beginPath();
                ctx.rect(left, top, plotW, plotH);
                ctx.clip();
                chart.series.forEach(s => {
                    ctx.strokeStyle = s.color || textColor;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    s.points.forEach((p, i) => {
                        const [px, py] = toPx(p.x, p.y);
                        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                    });
                    ctx.stroke();
                });
                ctx.restore();

                if (chart.series.length > 1) {
                    let ly = top + 6;
                    ctx.font = "10px 'IBM Plex Mono', monospace";
                    ctx.textAlign = "right"; ctx.textBaseline = "top";
                    chart.series.forEach((s, i) => {
                        ctx.fillStyle = s.color || textColor;
                        ctx.fillText("● " + (s.label || `série ${i + 1}`), left + plotW - 8, ly);
                        ly += 13;
                    });
                }

                if (chart.mouse && chart.mouse.x >= left && chart.mouse.x <= left + plotW &&
                    chart.mouse.y >= top && chart.mouse.y <= top + plotH) {
                    const dataX = toData(chart.mouse.x, chart.mouse.y)[0];

                    ctx.strokeStyle = textColor;
                    ctx.globalAlpha = 0.5;
                    ctx.setLineDash([2, 3]);
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(chart.mouse.x, top); ctx.lineTo(chart.mouse.x, top + plotH);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.globalAlpha = 1;

                    const tooltipLines = [];
                    chart.series.forEach(s => {
                        if (!s.points.length) return;
                        let nearest = s.points[0], bestDist = Infinity;
                        s.points.forEach(p => {
                            const d = Math.abs(p.x - dataX);
                            if (d < bestDist) { bestDist = d; nearest = p; }
                        });
                        const [npx, npy] = toPx(nearest.x, nearest.y);
                        ctx.fillStyle = s.color || textColor;
                        ctx.beginPath();
                        ctx.arc(npx, npy, 3.5, 0, Math.PI * 2);
                        ctx.fill();
                        tooltipLines.push(`${s.label ? s.label + ": " : ""}x=${chartFormatNum(nearest.x)}  y=${chartFormatNum(nearest.y)}`);
                    });

                    if (tooltipLines.length) {
                        ctx.font = "11px 'IBM Plex Mono', monospace";
                        const boxW = Math.max(...tooltipLines.map(t => ctx.measureText(t).width)) + 14;
                        const boxH = tooltipLines.length * 14 + 10;
                        let bx = chart.mouse.x + 12, by = chart.mouse.y - boxH - 8;
                        if (bx + boxW > w) bx = chart.mouse.x - boxW - 12;
                        if (by < 0) by = chart.mouse.y + 12;
                        ctx.fillStyle = bgColor;
                        ctx.strokeStyle = textColor;
                        ctx.lineWidth = 1;
                        ctx.fillRect(bx, by, boxW, boxH);
                        ctx.strokeRect(bx, by, boxW, boxH);
                        ctx.fillStyle = textColor;
                        ctx.textAlign = "left"; ctx.textBaseline = "top";
                        tooltipLines.forEach((line, i) => ctx.fillText(line, bx + 6, by + 5 + i * 14));
                    }
                }
            }

            function onMouseMove(e) {
                const rect = canvas.getBoundingClientRect();
                chart.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
                if (chart.dragging) {
                    const dx = chart.mouse.x - chart.dragStart.px;
                    const dy = chart.mouse.y - chart.dragStart.py;
                    const { left, right, top, bottom } = chart.padding;
                    const plotW = canvas.width - left - right, plotH = canvas.height - top - bottom;
                    const { xMin, xMax, yMin, yMax } = chart.dragStart.view;
                    const dxData = -dx / plotW * (xMax - xMin);
                    const dyData = dy / plotH * (yMax - yMin);
                    chart.view = { xMin: xMin + dxData, xMax: xMax + dxData, yMin: yMin + dyData, yMax: yMax + dyData };
                }
                render();
            }
            function onMouseDown(e) {
                const rect = canvas.getBoundingClientRect();
                chart.dragging = true;
                chart.dragStart = { px: e.clientX - rect.left, py: e.clientY - rect.top, view: Object.assign({}, chart.view) };
                canvas.style.cursor = "grabbing";
            }
            function onMouseUp() { chart.dragging = false; canvas.style.cursor = "crosshair"; }
            function onMouseLeave() { chart.mouse = null; chart.dragging = false; canvas.style.cursor = "crosshair"; render(); }
            function onWheel(e) {
                e.preventDefault();
                const rect = canvas.getBoundingClientRect();
                const mx = e.clientX - rect.left, my = e.clientY - rect.top;
                const [dataX, dataY] = toData(mx, my);
                const zoomFactor = e.deltaY < 0 ? 0.85 : 1 / 0.85;
                const { xMin, xMax, yMin, yMax } = chart.view;
                chart.view = {
                    xMin: dataX - (dataX - xMin) * zoomFactor,
                    xMax: dataX + (xMax - dataX) * zoomFactor,
                    yMin: dataY - (dataY - yMin) * zoomFactor,
                    yMax: dataY + (yMax - dataY) * zoomFactor
                };
                render();
            }

            canvas.style.cursor = "crosshair";
            canvas.addEventListener("mousemove", onMouseMove);
            canvas.addEventListener("mousedown", onMouseDown);
            window.addEventListener("mouseup", onMouseUp);
            canvas.addEventListener("mouseleave", onMouseLeave);
            canvas.addEventListener("wheel", onWheel, { passive: false });

            chart.setData = function (series, markers) {
                chart.series = series;
                if (markers) chart.markers = markers;
                resetView();
            };
            chart.resetView = resetView;
            chart.exportPNG = function (filename) {
                const link = document.createElement("a");
                link.download = filename || "grafico-chemos.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
            };

            resetView();
            return chart;
        }
