# BLANKBOX ENTERTAINMENT — website

A fast, static website for BLANKBOX ENTERTAINMENT. It has no frameworks and no npm dependencies,
just a small Node build script that turns the content in `src/` into plain HTML in `dist/`.

## Pages
- `/`: home, with the opening sequence, positioning, selected work, the namesake spotlight and the approach
- `/work/`: the portfolio index plus a chapter for each film
- `/work/<slug>/`: a detail page for each film (synopsis, credits, cast, details, stills, trailer, links)
- `/about/`: Cole Rutman
- `/contact/`
- `404.html`

## Editing content
| To change | Edit |
|---|---|
| Film details, synopsis, credits, links, trailer | `src/data/films.mjs` |
| Site name, URL, contact email, social links, custom domain | `src/config.mjs` |
| Posters, stills, portrait | See [ASSETS.md](ASSETS.md) |
| Page copy and layout | `src/pages.mjs` |
| Header, footer, `<head>` metadata | `src/lib/layout.mjs` |
| Styling | `src/assets/css/main.css` |
| Interactions | `src/assets/js/main.js` |

Trailers: set `trailer: "YOUTUBE_VIDEO_ID"` on a film. The video only loads when a visitor presses play.

## Running locally
Requires Node 18 or newer.

```sh
npm run dev      # build, then preview at http://localhost:4173
npm run build    # build only → dist/
```

## Deploying (GitHub Pages)
Every push to `main` builds and deploys the site through `.github/workflows/pages.yml`.
To set this up once: in the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.

## Custom domain
1. In `src/config.mjs`, set `domain: "yourdomain.com"` and `url: "https://yourdomain.com"`, then push.
2. In **Settings → Pages → Custom domain**, enter the same domain.
3. At your domain registrar, add these DNS records:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - a `CNAME` record for `www` → `crutman55-pixel.github.io`
4. Once the DNS check passes, tick **Enforce HTTPS**.
