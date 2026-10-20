// Zero-dependency static site build.
//   node build.mjs            → writes the site to dist/
//   BASE_PATH=/repo node build.mjs  → for hosting under a sub-path (GitHub Pages project sites)

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "./src/config.mjs";
import { brands } from "./src/data/brands.mjs";
import { films } from "./src/data/films.mjs";
import { createLayout } from "./src/lib/layout.mjs";
import { titleCard } from "./src/lib/titlecards.mjs";
import { esc } from "./src/lib/util.mjs";
import { createPages } from "./src/pages.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, "src");
const out = join(root, "dist");
const base = (process.env.BASE_PATH || "").replace(/\/$/, "");
const version = Date.now().toString(36);

const { page, href, asset } = createLayout({ base, version });

// --- Assets: use a supplied image when it exists, otherwise fall back gracefully.
const imageExts = ["webp", "jpg", "jpeg", "png", "avif"];
// Alternate posters: src/assets/posters/<slug>-alt.webp, <slug>-alt-2.jpg, …
const keyArt = (film) =>
  readdirSync(join(src, "assets", "posters"))
    .filter((f) => f.startsWith(`${film.slug}-alt`) && imageExts.includes(f.split(".").pop().toLowerCase()))
    .sort()
    .map((f) => `${base}/assets/posters/${f}`);

const findImage = (dir, name) => {
  for (const e of imageExts) if (existsSync(join(src, "assets", dir, `${name}.${e}`))) return `${dir}/${name}.${e}`;
  return null;
};

const missing = [];
const poster = (film, id) => {
  const file = findImage("posters", film.slug);
  if (!file) return titleCard(film, { id });
  // Show the whole poster whatever its shape; a blurred copy fills any space around it.
  const src = `${base}/assets/${file}`;
  return `<span class="poster-fit" style="--poster:url('${src}')"><img class="poster-img" src="${src}" alt="Poster for ${esc(film.title)}" loading="lazy" decoding="async"></span>`;
};
films.forEach((f) => !findImage("posters", f.slug) && missing.push(`poster: src/assets/posters/${f.slug}.jpg (${f.title})`));

const portraitFile = findImage("img", "cole-rutman");
if (!portraitFile) missing.push("portrait: src/assets/img/cole-rutman.jpg (About page)");
const portrait = portraitFile
  ? `<img src="${base}/assets/${portraitFile}" alt="Portrait of Cole Rutman" width="359" height="452" decoding="async">`
  : `<div class="portrait-mono" role="img" aria-label="Cole Rutman monogram"><span class="vf" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="display">C<em>R</em></span><span class="mono">Cole Rutman — Producer &amp; Filmmaker</span></div>`;

// Production stills: any images in src/assets/stills/<slug>/ appear in a gallery on that film's page.
const stills = (film) => {
  const dir = join(src, "assets", "stills", film.slug);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => imageExts.includes(f.split(".").pop().toLowerCase()))
    .sort()
    .map((f) => `${base}/assets/stills/${film.slug}/${f}`);
};

const pages = createPages({ films, brands, href, asset, poster, portrait, stills, keyArt });

// --- Structured data
const org = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/assets/img/logo-lockup.png`,
  description: site.description,
  sameAs: site.social.map((s) => s.href),
};
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Cole Rutman",
  nationality: "Canadian",
  jobTitle: "Producer and filmmaker",
  alumniOf: "Ivey Business School, Western University",
  sameAs: ["https://www.linkedin.com/in/cole-rutman-b57327254/", "https://www.imdb.com/name/nm16290719/"],
};
const movie = (f) => ({
  "@context": "https://schema.org",
  "@type": f.kind === "series" ? "TVSeries" : "Movie",
  name: f.title,
  ...(f.year && { dateCreated: String(f.year) }),
  ...(f.logline && { description: f.logline }),
  ...(f.kind !== "series" && { director: { "@type": "Person", name: f.filmmaker } }),
  ...(f.genres.length && { genre: f.genres }),
  ...(f.cast.length && { actor: f.cast.map((c) => ({ "@type": "Person", name: c.name })) }),
  ...(f.links.length && { sameAs: f.links.map((l) => l.href) }),
});

// --- Write
rmSync(out, { recursive: true, force: true });
const write = (rel, content) => {
  const file = join(out, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
};

const routes = [];
const emit = (path, opts) => {
  routes.push(path);
  write(join(path, "index.html"), page({ path, ...opts }));
};

emit("/", { title: "", body: pages.home(), current: "/", bodyClass: "page-home", jsonLd: org });
emit("/work/", {
  title: "Our Work",
  description: `The BLANKBOX ENTERTAINMENT slate: ${films.map((f) => f.title).join(", ")}.`,
  body: pages.work(),
  current: "/work/",
  bodyClass: "page-work",
});
films.forEach((f, i) =>
  emit(`/work/${f.slug}/`, {
    title: f.title,
    description: `${f.title}${f.platform ? ` (${f.platform})` : ""}. ${f.logline || (f.byline || `A film by ${f.filmmaker}`)}`,
    body: pages.film(f, i),
    current: "/work/",
    bodyClass: "page-film",
    jsonLd: movie(f),
  }),
);
emit("/brands/", {
  title: "Our Work with Brands",
  description: "BLANKBOX ENTERTAINMENT commercial production: our reel and selected credits with brands.",
  body: pages.brands(),
  current: "/brands/",
  bodyClass: "page-brands",
});
emit("/about/", {
  title: "About Cole Rutman",
  description: "Cole Rutman is a Canadian producer and entertainment industry manager who leads BLANKBOX ENTERTAINMENT.",
  body: pages.about(),
  current: "/about/",
  bodyClass: "page-about",
  jsonLd: person,
});
emit("/contact/", {
  title: "Contact",
  description: "Get in touch with BLANKBOX ENTERTAINMENT about projects, collaboration, screenings or press.",
  body: pages.contact(),
  current: "/contact/",
  bodyClass: "page-contact",
});
write("404.html", page({ path: "/404.html", title: "Page not found", body: pages.notFound(), bodyClass: "page-404" }));

cpSync(join(src, "assets"), join(out, "assets"), { recursive: true });
for (const f of ["favicon.png", "apple-touch-icon.png"]) cpSync(join(src, f), join(out, f));
write(".nojekyll", "");
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map((r) => `  <url><loc>${site.url}${r}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
);
if (site.domain) write("CNAME", `${site.domain}\n`);

const count = readdirSync(out, { recursive: true }).filter((f) => String(f).endsWith(".html")).length;
console.log(`Built ${count} pages → dist/${base ? ` (base path ${base})` : ""}`);
if (missing.length) console.log(`\nAssets still using fallbacks (see ASSETS.md):\n  - ${missing.join("\n  - ")}`);
if (!site.contactEmail) console.log("\nNote: site.contactEmail is empty, so the contact form is hidden.");
