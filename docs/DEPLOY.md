# Implantação

O resultado de `npm run build` (`dist/`) é um site **100 % estático**: qualquer hospedagem de arquivos serve (Netlify, Cloudflare Pages, GitHub Pages, S3 + CDN, nginx).

## Requisitos

- **HTTPS** (o service worker e a instalação como app exigem; `localhost` também vale).
- Servir `dist/` na **raiz** do domínio ou de um subcaminho fixo; os caminhos do app são relativos.
- Cabeçalhos de cache e segurança abaixo.

## Cabeçalhos

O build gera `dist/_headers` (formato Netlify/Cloudflare Pages) com:

| Caminho | Cabeçalho |
|---|---|
| `/assets/*`, `/fonts/*` | `Cache-Control: public, max-age=31536000, immutable` (nomes com hash) |
| `/icons/*`, `/vendor/*` | `Cache-Control: public, max-age=604800` |
| `/index.html`, `/sw.js`, `/manifest.webmanifest` | `Cache-Control: no-cache` (sempre revalidar) |
| `/*` | `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, **CSP** com `frame-ancestors 'none'` |

### nginx

```nginx
server {
  root /var/www/chemos;                       # conteúdo de dist/
  gzip on; gzip_types text/css text/javascript application/json image/svg+xml;
  add_header X-Content-Type-Options nosniff always;
  add_header Referrer-Policy strict-origin-when-cross-origin always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;
  add_header Cross-Origin-Opener-Policy same-origin always;
  add_header Content-Security-Policy "<copie a linha Content-Security-Policy de dist/_headers>" always;
  location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
  location /fonts/  { add_header Cache-Control "public, max-age=31536000, immutable"; }
  location ~ ^/(index\.html|sw\.js|manifest\.webmanifest)$ { add_header Cache-Control "no-cache"; }
}
```

(No nginx, `add_header` em um `location` substitui os do nível acima: repita os de segurança ali se necessário.)

## Atualização para os usuários

1. O build muda o nome do cache do service worker (`chemos-v<versão>-<hash>`) sempre que algo muda.
2. O navegador detecta o novo `sw.js` (servido com `no-cache`), instala em segundo plano e ativa; o app mostra o aviso "Nova versão disponível — recarregue".
3. Caches antigos (`chemos-*`) são apagados na ativação.

## Verificação pós-deploy

- `https://seu-dominio/build-info.json` mostra versão e hash do build publicado.
- No DevTools ▸ Application ▸ Service Workers, confira o cache ativo e teste **Offline**.
- No console não deve haver violações de CSP.

## Ao adicionar uma API externa

Inclua o host em `API_HOSTS` de `scripts/build.js` (CSP `connect-src`) e registre-o em `docs/SECURITY.md`.
