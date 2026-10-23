import { site, nav } from "../config.mjs";
import { esc } from "./util.mjs";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

export function createLayout({ base, version }) {
  const href = (p) => `${base}${p}`;
  // Version each asset by its contents, so a deploy only invalidates files that actually changed.
  const hashes = new Map();
  const hash = (p) => {
    if (!hashes.has(p)) {
      let h = version;
      try { h = createHash("md5").update(readFileSync(new URL(`../assets/${p}`, import.meta.url))).digest("hex").slice(0, 10); } catch {}
      hashes.set(p, h);
    }
    return hashes.get(p);
  };
  const asset = (p) => `${base}/assets/${p}?v=${hash(p)}`;

  const mark = (cls = "mark") => `<img class="${cls}" src="${asset("img/logo-mark.webp")}" alt="" width="240" height="207" decoding="async">`;

  const brand = (current) => `<a class="brand" href="${href("/")}" aria-label="${esc(site.name)}, home">
    ${mark()}
    <span class="brand-word">BLANKBOX</span>
    <span class="brand-sub">${current === "/brands/" ? "Media" : "Entertainment"}</span>
  </a>`;

  const navList = (current, cls) =>
    `<ul class="${cls}">${nav
      .map(
        (n, i) =>
          `<li><a href="${href(n.href)}"${current === n.href ? ' aria-current="page"' : ""}><span class="nav-i">0${i + 1}</span><span class="nav-l">${esc(n.label)}</span></a></li>`,
      )
      .join("")}</ul>`;

  const header = (current) => `<a class="skip" href="#main">Skip to content</a>
<header class="site-header" data-header>
  ${brand(current)}
  <nav class="nav" aria-label="Primary">${navList(current, "nav-list")}</nav>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle>
    <span class="menu-toggle-label">Menu</span><span class="menu-toggle-icon" aria-hidden="true"><i></i><i></i></span>
  </button>
</header>
<div class="menu" id="menu" data-menu hidden>
  <nav aria-label="Mobile">${navList(current, "menu-list")}</nav>
  <div class="menu-foot">
    ${site.social.map((s) => `<a href="${s.href}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("")}
  </div>
</div>`;

  const footer = () => `<footer class="site-footer">
  <div class="footer-top">
    <p class="footer-kicker mono">End of reel</p>
    <a class="footer-cta" href="${href("/contact/")}"><span>Start a conversation</span><span class="arrow" aria-hidden="true">→</span></a>
  </div>
  <div class="footer-grid">
    <div class="footer-brand">
      <img class="footer-lockup" src="${asset("img/logo-lockup.webp")}" alt="${esc(site.name)}" width="503" height="230" decoding="async">
    </div>
    <div>
      <p class="footer-h mono">Navigate</p>
      <ul class="footer-list">${nav.map((n) => `<li><a href="${href(n.href)}">${esc(n.label)}</a></li>`).join("")}</ul>
    </div>
    <div>
      <p class="footer-h mono">Follow</p>
      <ul class="footer-list">${site.social
        .map((s) => `<li><a href="${s.href}" target="_blank" rel="noopener">${esc(s.label)} <span aria-hidden="true">↗</span></a></li>`)
        .join("")}</ul>
    </div>
    <div>
      <p class="footer-h mono">Contact</p>
      <ul class="footer-list">
        ${site.contactEmail ? `<li><a href="mailto:${esc(site.contactEmail)}">${esc(site.contactEmail)}</a></li>` : `<li><a href="${href("/contact/")}">Get in touch</a></li>`}
        <li class="muted">${esc(site.location)}</li>
      </ul>
    </div>
  </div>
  <div class="footer-base mono">
    <span>© <span data-year>${new Date().getFullYear()}</span> ${esc(site.name)}</span>
    <span>Film &amp; Television Development</span>
    <a href="#top" data-to-top>Back to top ↑</a>
  </div>
</footer>`;

  function page({ path, title, description = site.description, body, current, bodyClass = "", jsonLd = null, image = "og.png" }) {
    const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — Film & Television`;
    const canonical = `${site.url}${path}`;
    const ogImage = `${site.url}/assets/img/${image}`;
    return `<!doctype html>
<html lang="en-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#070707">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="${base}/favicon.png" type="image/png" sizes="64x64">
<link rel="apple-touch-icon" href="${base}/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="${asset("css/main.css")}">
<script>document.documentElement.classList.add("js");setTimeout(function(){var d=document.documentElement;if(!d.classList.contains("is-booted"))d.classList.remove("js")},3000)</script>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
<script src="${asset("js/main.js")}" defer></script>
${["page-brands", "page-contact"].includes(bodyClass) && site.formEndpoint ? `<script src="${asset("js/brief.js")}" data-endpoint="${esc(site.formEndpoint)}" data-mailto="${esc(site.formEndpoint.split("/").pop())}" data-web3="${esc(site.web3formsKey || "")}" defer></script>` : ""}
</head>
<body class="${bodyClass}" id="top">
${header(current)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
${bodyClass === "page-brands" && site.formEndpoint ? `<button class="brief-fab" type="button" data-brief-open aria-label="Start your project brief"><span class="brief-fab-ring" aria-hidden="true"></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v10H9l-5 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="9" cy="10" r="1.1" fill="currentColor"/><circle cx="12" cy="10" r="1.1" fill="currentColor"/><circle cx="15" cy="10" r="1.1" fill="currentColor"/></svg><span class="brief-fab-label">Work with us</span></button>` : ""}
<div class="grain" aria-hidden="true"></div>
</body>
</html>
`;
  }

  return { page, href, asset };
}
