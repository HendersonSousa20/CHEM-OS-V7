        /* ==========================================================================
           3A. UTILITÁRIOS DE API — CACHE LEVE (sessionStorage) + TIMEOUT + ERROS
           Camada compartilhada usada por pubchem-api.js e name-resolver-api.js.
           Objetivo: (1) evitar repetir requisições idênticas na mesma sessão do
           navegador (útil em sala de aula, quando vários alunos consultam a mesma
           substância), e (2) garantir que a interface NUNCA fique "travada"
           esperando uma resposta que nunca chega — toda chamada tem um tempo
           limite, após o qual uma mensagem de erro clara é exibida ao usuário.
           ========================================================================== */
        const API_CACHE_PREFIX = "chemos_cache_v1:";
        const API_CACHE_TTL_MS = 30 * 60 * 1000;   // 30 minutos
        const API_FETCH_TIMEOUT_MS = 15000;        // 15 segundos

        function apiCacheGet(key) {
            try {
                const raw = sessionStorage.getItem(API_CACHE_PREFIX + key);
                if (!raw) return null;
                const entry = JSON.parse(raw);
                if (!entry || (Date.now() - entry.t) > API_CACHE_TTL_MS) {
                    sessionStorage.removeItem(API_CACHE_PREFIX + key);
                    return null;
                }
                return entry.v;
            } catch (e) {
                return null; // sessionStorage indisponível (modo privado, quota excedida, etc.) — segue sem cache
            }
        }

        function apiCacheSet(key, value) {
            try {
                sessionStorage.setItem(API_CACHE_PREFIX + key, JSON.stringify({ t: Date.now(), v: value }));
            } catch (e) {
                // Cache é apenas uma otimização — uma falha aqui nunca deve quebrar a funcionalidade.
            }
        }

        function clearApiCache() {
            try {
                Object.keys(sessionStorage)
                    .filter(k => k.startsWith(API_CACHE_PREFIX))
                    .forEach(k => sessionStorage.removeItem(k));
            } catch (e) { /* noop */ }
        }

        /**
         * fetch() com tempo limite e mensagens de erro amigáveis em PT-BR.
         * Nunca deixa uma requisição pendurada indefinidamente.
         */
        async function fetchWithTimeout(url, options, timeoutMs = API_FETCH_TIMEOUT_MS) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const res = await fetch(url, { ...(options || {}), signal: controller.signal });
                return res;
            } catch (err) {
                if (err.name === "AbortError") {
                    const e = new Error("Tempo limite excedido — o servidor não respondeu a tempo. Verifique sua conexão ou tente novamente em instantes.");
                    e.isTimeout = true;
                    throw e;
                }
                const e = new Error("Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.");
                e.isNetworkError = true;
                e.cause = err;
                throw e;
            } finally {
                clearTimeout(timer);
            }
        }

        /**
         * Busca JSON com cache leve (sessionStorage) + timeout.
         * Retorna { ok, status, data, fromCache }. Não lança em respostas HTTP de
         * erro (o chamador decide como tratar) — só lança em falha de rede/timeout.
         */
        async function cachedFetchJSON(url, options) {
            const cached = apiCacheGet(url);
            if (cached !== null) return { ok: true, status: 200, data: cached, fromCache: true };

            const res = await fetchWithTimeout(url, options);
            if (!res.ok) return { ok: false, status: res.status, data: null, fromCache: false };

            const data = await res.json();
            apiCacheSet(url, data);
            return { ok: true, status: res.status, data, fromCache: false };
        }

        /**
         * Igual a cachedFetchJSON, mas para respostas de texto puro (ex: CACTUS).
         */
        async function cachedFetchText(url, options) {
            const cached = apiCacheGet(url);
            if (cached !== null) return { ok: true, status: 200, data: cached, fromCache: true };

            const res = await fetchWithTimeout(url, options);
            if (!res.ok) return { ok: false, status: res.status, data: null, fromCache: false };

            const text = await res.text();
            apiCacheSet(url, text);
            return { ok: true, status: res.status, data: text, fromCache: false };
        }
