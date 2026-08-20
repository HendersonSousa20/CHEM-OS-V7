        /* ==========================================================================
           2. MOTOR DE ÁLGEBRA LINEAR / BALANCIADOR DE EQUAÇÕES
           ========================================================================== */
        function parseFormula(formula) {
            let clean = formula.replace(/[\[\{]/g, '(').replace(/[\]\}]/g, ')').replace(/\s+/g, '').replace(/[*·]/g, '.');
            let parts = clean.split('.');
            let counts = {};
            let totalMass = 0;

            function parseSub(str, multiplier = 1) {
                let stack = [{}];
                let i = 0;
                while (i < str.length) {
                    if (str[i] === '(') {
                        stack.push({});
                        i++;
                    } else if (str[i] === ')') {
                        i++;
                        let matchNum = str.slice(i).match(/^(\d+(\.\d+)?)/);
                        let mult = matchNum ? parseFloat(matchNum[1]) : 1;
                        if (matchNum) i += matchNum[1].length;
                        let top = stack.pop();
                        let curr = stack[stack.length - 1];
                        for (let el in top) { curr[el] = (curr[el] || 0) + top[el] * mult; }
                    } else {
                        let matchElem = str.slice(i).match(/^([A-Z][a-z]?)/);
                        if (!matchElem) { i++; continue; }
                        let el = matchElem[1];
                        i += el.length;
                        let matchCnt = str.slice(i).match(/^(\d+(\.\d+)?)/);
                        let cnt = matchCnt ? parseFloat(matchCnt[1]) : 1;
                        if (matchCnt) i += matchCnt[1].length;
                        let curr = stack[stack.length - 1];
                        curr[el] = (curr[el] || 0) + cnt;
                    }
                }
                let res = stack[0];
                for (let el in res) { counts[el] = (counts[el] || 0) + res[el] * multiplier; }
            }

            parseSub(parts[0], 1);
            if (parts.length > 1) {
                for (let p = 1; p < parts.length; p++) {
                    let hMatch = parts[p].match(/^(\d*)(\D.*)?$/);
                    let hMult = hMatch && hMatch[1] ? parseFloat(hMatch[1]) : 1;
                    let hFormula = hMatch && hMatch[2] ? hMatch[2] : parts[p];
                    parseSub(hFormula, hMult);
                }
            }

            for (let el in counts) {
                if (ATOMIC_WEIGHTS[el]) { totalMass += ATOMIC_WEIGHTS[el] * counts[el]; }
            }
            return { totalMass, counts };
        }

        function gcd(a, b) {
            a = Math.abs(a); b = Math.abs(b);
            while (b) { let t = b; b = a % b; a = t; }
            return a;
        }

        function ratCreate(num, den = 1) {
            if (den === 0) return [0, 1];
            if (num === 0) return [0, 1];
            if (den < 0) { num = -num; den = -den; }
            let g = gcd(num, den);
            return [num / g, den / g];
        }

        function ratSub(a, b) { return ratCreate(a[0]*b[1] - b[0]*a[1], a[1]*b[1]); }
        function ratMul(a, b) { return ratCreate(a[0]*b[0], a[1]*b[1]); }
        function ratDiv(a, b) { return ratCreate(a[0]*b[1], a[1]*b[0]); }
        function ratIsZero(a) { return a[0] === 0; }

        function solveLinearSystem(matrix) {
            let m = matrix.length;
            let n = matrix[0].length;
            let k = n - 1;

            let M = matrix.map(row => row.map(cell => [...cell]));
            let lead = 0;

            for (let r = 0; r < m; r++) {
                if (k <= lead) break;
                let i = r;
                while (i < m && ratIsZero(M[i][lead])) { i++; }
                if (i === m) { lead++; r--; continue; }

                let temp = M[r]; M[r] = M[i]; M[i] = temp;

                let val = M[r][lead];
                for (let j = lead; j < n; j++) { M[r][j] = ratDiv(M[r][j], val); }

                for (let j = 0; j < m; j++) {
                    if (j !== r && !ratIsZero(M[j][lead])) {
                        let mult = M[j][lead];
                        for (let c = lead; c < n; c++) { M[j][c] = ratSub(M[j][c], ratMul(mult, M[r][c])); }
                    }
                }
                lead++;
            }

            let solution = new Array(k).fill(null);
            for (let r = 0; r < m; r++) {
                let firstLead = -1;
                for (let c = 0; c < k; c++) {
                    if (!ratIsZero(M[r][c])) { firstLead = c; break; }
                }
                if (firstLead !== -1) {
                    let allZero = true;
                    for (let c = firstLead + 1; c < k; c++) {
                        if (!ratIsZero(M[r][c])) { allZero = false; break; }
                    }
                    if (allZero) { solution[firstLead] = M[r][k]; }
                }
            }

            for (let i = 0; i < k; i++) { if (solution[i] === null) return null; }
            return solution;
        }

        function balanceChemicalEquation(equationStr) {
            let eq = equationStr.replace(/\s+/g, '');
            let sides = eq.split(/->|=/);
            if (sides.length !== 2) throw new Error("A equação deve conter '->' ou '='.");

            let leftComps = sides[0].split('+').filter(Boolean);
            let rightComps = sides[1].split('+').filter(Boolean);
            let allComps = [...leftComps, ...rightComps];
            let numReactants = leftComps.length;
            let n = allComps.length;

            let parsedComps = allComps.map(c => parseFormula(c).counts);
            let elements = Array.from(new Set(parsedComps.flatMap(c => Object.keys(c))));
            let m = elements.length;

            let A = elements.map(elem => parsedComps.map((comp, j) => {
                let cnt = comp[elem] || 0;
                return j < numReactants ? cnt : -cnt;
            }));

            let bestCoeffs = null;

            for (let refCol = 0; refCol < n; refCol++) {
                let augmented = elements.map((_, rIdx) => {
                    let row = [];
                    for (let cIdx = 0; cIdx < n; cIdx++) {
                        if (cIdx === refCol) continue;
                        row.push(ratCreate(A[rIdx][cIdx]));
                    }
                    row.push(ratCreate(-A[rIdx][refCol]));
                    return row;
                });

                let sol = solveLinearSystem(augmented);
                if (!sol) continue;

                let fullSol = [];
                let solIdx = 0;
                for (let cIdx = 0; cIdx < n; cIdx++) {
                    if (cIdx === refCol) { fullSol.push(ratCreate(1)); }
                    else { fullSol.push(sol[solIdx++]); }
                }

                let currentLcm = 1;
                for (let cIdx = 0; cIdx < n; cIdx++) {
                    let den = fullSol[cIdx][1];
                    currentLcm = (currentLcm * den) / gcd(currentLcm, den);
                }

                let candidate = fullSol.map(rat => Math.round((rat[0] * currentLcm) / rat[1]));

                if (candidate.some(v => v <= 0)) continue;

                let verified = true;
                for (let elemIdx = 0; elemIdx < m; elemIdx++) {
                    let leftSum = 0, rightSum = 0;
                    for (let j = 0; j < n; j++) {
                        let cnt = parsedComps[j][elements[elemIdx]] || 0;
                        if (j < numReactants) leftSum += cnt * candidate[j];
                        else rightSum += cnt * candidate[j];
                    }
                    if (leftSum !== rightSum) { verified = false; break; }
                }

                if (verified) { bestCoeffs = candidate; break; }
            }

            if (!bestCoeffs) throw new Error("Não foi possível balancear a reação com esta combinação.");

            let balancedLeft = leftComps.map((c, i) => (bestCoeffs[i] > 1 ? bestCoeffs[i] : '') + c).join(' + ');
            let balancedRight = rightComps.map((c, i) => (bestCoeffs[numReactants + i] > 1 ? bestCoeffs[numReactants + i] : '') + c).join(' + ');

            return { text: `${balancedLeft} ➔ ${balancedRight}`, coeffs: bestCoeffs, leftComps, rightComps, numReactants };
        }
