import { site } from "./config.mjs";
import { esc } from "./lib/util.mjs";

const pad = (n) => String(n).padStart(2, "0");
const arrow = `<span class="arrow" aria-hidden="true">→</span>`;
const ext = `<span aria-hidden="true">↗</span>`;

const viewfinder = `<span class="vf" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;

export function createPages({ films, href, asset, poster, portrait, stills, keyArt }) {
  const filmUrl = (f) => href(`/work/${f.slug}/`);
  const metaLine = (f) => [f.year, f.format, f.runtime].filter(Boolean).join(" · ");

  /* ---------------------------------------------------------------- HOME */
  function home() {
    const slides = films
      .map((f, i) => {
        const bg = stills(f)[0];
        return `<article class="show-slide${i === 0 ? " is-active" : ""}" style="--accent:${f.theme.accent}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${films.length}: ${esc(f.title)}"${i ? " aria-hidden=\"true\"" : ""}>
        <div class="show-bg${bg ? "" : " show-bg--poster"}" aria-hidden="true">${bg ? `<img src="${bg}" alt="" decoding="async"${i ? ' loading="lazy"' : ""}>` : poster(f, `sb-${f.slug}`)}</div>
        <div class="show-inner wrap">
          <div class="show-copy">
            <p class="mono show-num"><span>${pad(i + 1)}</span> / ${pad(films.length)} — ${esc([f.year, f.format].filter(Boolean).join(" · "))}</p>
            <h3 class="show-title display">${esc(f.title)}</h3>
            <p class="mono show-by">A film by ${esc(f.filmmaker)}</p>
            ${f.logline ? `<p class="show-logline">${esc(f.logline)}</p>` : ""}
            <a class="btn btn--solid" href="${filmUrl(f)}"${i ? ' tabindex="-1"' : ""}>View project ${arrow}</a>
          </div>
          <a class="show-poster" href="${filmUrl(f)}" tabindex="-1" aria-hidden="true">${poster(f, `sp-${f.slug}`)}</a>
        </div>
      </article>`;
      })
      .join("");
    const tabs = films
      .map(
        (f, i) => `<button class="show-tab${i === 0 ? " is-active" : ""}" type="button" data-show-go="${i}" aria-label="Show ${esc(f.title)}"${i === 0 ? ' aria-current="true"' : ""}>
        <span class="show-tab-bar"><i></i></span><span class="mono">${pad(i + 1)}</span><span class="show-tab-t">${esc(f.title)}</span>
      </button>`,
      )
      .join("");

    return `
<div class="intro" data-intro aria-hidden="true">
  <div class="intro-bar intro-bar--top"></div>
  <div class="intro-bar intro-bar--bottom"></div>
  <div class="intro-center">
    <img class="intro-logo" src="${asset("img/logo-lockup.webp")}" alt="" width="503" height="230" fetchpriority="high">
  </div>
</div>

<section class="hero" aria-labelledby="hero-title">
  <div class="hero-stage" aria-hidden="true">
    <div class="portal">
      <div class="portal-glow"></div>
      <img class="portal-img" src="${asset("img/box.webp")}" alt="" width="1600" height="1600" decoding="async" fetchpriority="high">
    </div>
    <div class="hero-sweep"></div>
  </div>
  <div class="hero-frame" aria-hidden="true">
    ${viewfinder}
    <span class="hero-tc mono"><span class="rec"></span><span data-timecode>00:00:00:00</span></span>
    <span class="hero-ratio mono">2.39 : 1</span>
  </div>
  <div class="hero-inner wrap">
    <p class="eyebrow mono reveal">Film &amp; Television Development</p>
    <h1 class="hero-title display" id="hero-title">
      <span class="line"><span>Every story</span></span>
      <span class="line"><span>begins as a</span></span>
      <span class="line"><span><em>blank box.</em></span></span>
    </h1>
    <div class="hero-foot">
      <p class="hero-lede reveal">BLANKBOX ENTERTAINMENT develops film and television for a new generation, combining bold concepts, micro-series, and compelling storytelling for the evolving entertainment landscape.</p>
      <div class="hero-actions reveal">
        <a class="btn btn--solid" href="${href("/work/")}">Explore our work ${arrow}</a>
        <a class="btn btn--ghost" href="${href("/about/")}">About Us</a>
      </div>
    </div>
  </div>
  <a class="scroll-cue mono" href="#selected"><span>Scroll</span><i aria-hidden="true"></i></a>
</section>


<section class="showcase" id="selected" data-showcase aria-roledescription="carousel" aria-label="The slate">
  <div class="show-track">${slides}</div>
  <div class="show-ui wrap">
    <div class="show-tabs">${tabs}</div>
    <div class="show-ctrl">
      <button class="icon-btn" type="button" data-show-prev aria-label="Previous film">←</button>
      <button class="icon-btn" type="button" data-show-pause aria-label="Pause slideshow">❚❚</button>
      <button class="icon-btn" type="button" data-show-next aria-label="Next film">→</button>
    </div>
  </div>
</section>


<section class="approach wrap" aria-labelledby="approach-title">
  <div class="section-head">
    <div>
      <p class="mono section-label reveal">Scene 01 — How we develop</p>
      <h2 class="section-title display reveal" id="approach-title">Ideas first.<br><em>Then everything else.</em></h2>
    </div>
  </div>
  <ol class="approach-list">
    <li class="reveal"><span class="mono">01</span><h3>The concept carries the weight</h3><p>Every project starts with an idea strong enough to hold an audience in a single sentence. If it can't, we keep working until it can.</p></li>
    <li class="reveal"><span class="mono">02</span><h3>Built to be discovered</h3><p>We think about how people will find a story before they ever sit down to watch it. Short pieces on social media are written as entry points, built to hook viewers and carry them into the longer series or film behind them.</p></li>
    <li class="reveal"><span class="mono">03</span><h3>Made for every screen</h3><p>We believe audiences are changing, so we develop entertainment suited to viewers everywhere: social media, TV and movie screens.</p></li>
    <li class="reveal"><span class="mono">04</span><h3>Room to grow</h3><p>We develop worlds with more story in them than a single runtime can hold, so a short can become the proof of something larger.</p></li>
  </ol>
</section>

<section class="enter" aria-label="Full portfolio">
  <a class="enter-link" href="${href("/work/")}">
    <span class="mono enter-label">Scene 02 — The full slate</span>
    <span class="enter-title display"><span>View our slate</span> ${arrow}</span>
  </a>
</section>`;
  }

  /* ---------------------------------------------------------------- WORK */
  function work() {
    const index = films
      .map(
        (f, i) => `<li style="--accent:${f.theme.accent}">
        <a href="#${f.slug}" data-preview="${f.slug}">
          <span class="mono idx">${pad(i + 1)}</span>
          <span class="t">${esc(f.title)}</span>
          <span class="mono by">${esc(f.filmmaker)}</span>
          <span class="mono yr">${f.year ?? "TBA"}</span>
        </a>
      </li>`,
      )
      .join("");

    const previews = films
      .map((f) => `<div class="preview-card" data-preview-card="${f.slug}">${poster(f, `pv-${f.slug}`)}</div>`)
      .join("");

    const chapters = films
      .map(
        (f, i) => `<article class="chapter${i % 2 ? " chapter--alt" : ""}" id="${f.slug}" style="--accent:${f.theme.accent};--ink:${f.theme.ink}" aria-labelledby="t-${f.slug}">
        <div class="chapter-poster">
          <a class="poster-frame reveal-frame" href="${filmUrl(f)}" tabindex="-1" aria-hidden="true">${poster(f, `ch-${f.slug}`)}</a>
        </div>
        <div class="chapter-copy">
          <p class="chapter-num mono reveal"><span>${pad(i + 1)}</span> / ${pad(films.length)}</p>
          <h2 class="chapter-title display reveal" id="t-${f.slug}">${esc(f.title)}</h2>
          <p class="chapter-by mono reveal">A film by ${esc(f.filmmaker)}</p>
          ${metaLine(f) ? `<p class="chapter-meta mono reveal">${esc(metaLine(f))}${f.genres.filter((g) => g !== f.format).length ? ` · ${esc(f.genres.filter((g) => g !== f.format).slice(0, 2).join(" / "))}` : ""}</p>` : ""}
          ${f.logline ? `<p class="chapter-logline reveal">${esc(f.logline)}</p>` : `<p class="chapter-logline chapter-logline--tba reveal">Synopsis coming soon.</p>`}
          <a class="btn btn--ghost reveal" href="${filmUrl(f)}">View project ${arrow}</a>
        </div>
      </article>`,
      )
      .join("");

    return `
<section class="page-hero wrap" aria-labelledby="work-title">
  <p class="mono section-label reveal">Our Work</p>
  <h1 class="page-title display" id="work-title"><span class="line"><span>The slate.</span></span></h1>
  <p class="page-lede reveal">Each project is its own world, built from the same conviction: start with an idea that won't leave you alone.</p>
</section>

<section class="work-index wrap" aria-label="Index of films">
  <ol class="index-list">${index}</ol>
  <div class="preview" data-preview-wrap aria-hidden="true">${previews}</div>
</section>

<div class="chapters">${chapters}</div>`;
  }

  /* ---------------------------------------------------------------- FILM */
  function film(f, i) {
    const prev = films[(i - 1 + films.length) % films.length];
    const next = films[(i + 1) % films.length];
    const tba = !f.logline;

    const credits = f.credits
      .map((c) => `<div class="kv"><dt class="mono">${esc(c.role)}</dt><dd>${esc(c.name)}</dd></div>`)
      .join("");
    const cast = f.cast
      .map((c) => `<li><span>${esc(c.name)}</span>${c.character ? `<span class="mono">${esc(c.character)}</span>` : ""}</li>`)
      .join("");
    const facts = [
      f.year && { label: "Year", value: f.year },
      f.format && { label: "Format", value: f.format },
      f.runtime && { label: "Runtime", value: f.runtime },
      f.genres.length && { label: "Genre", value: f.genres.join(", ") },
      ...f.facts,
    ]
      .filter(Boolean)
      .map((x) => `<div class="kv"><dt class="mono">${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`)
      .join("");

    const shots = stills(f);
    const videoLabel = f.videoLabel || "Trailer";
    const trailer = f.trailer
      ? `<section class="film-trailer wrap" aria-label="Trailer">
          <p class="mono section-label">${esc(videoLabel)}</p>
          <div class="video" data-video="${esc(f.trailer)}">
            <img class="video-cover" src="${shots[0] || `https://i.ytimg.com/vi/${encodeURIComponent(f.trailer)}/hqdefault.jpg`}" alt="" loading="lazy" decoding="async">
            <button class="video-play" type="button" aria-label="${esc(videoLabel)}: ${esc(f.title)}">
              <span class="video-play-icon" aria-hidden="true"></span><span class="mono">${esc(videoLabel)}</span>
            </button>
          </div>
        </section>`
      : "";

    const gallery = shots.length
      ? `<section class="film-stills wrap" aria-label="Production stills">
          <p class="mono section-label reveal">Stills</p>
          <ul class="stills${shots.length === 1 ? " stills--single" : ""}">${shots
            .map(
              (src, n) => `<li class="still reveal-frame"><img src="${src}" alt="Still ${n + 1} from ${esc(f.title)}" loading="lazy" decoding="async"></li>`,
            )
            .join("")}</ul>
        </section>`
      : "";

    const alts = keyArt(f);
    const keyArtSection = alts.length
      ? `<section class="film-keyart wrap" aria-label="Alternate key art">
          <p class="mono section-label reveal">Key art</p>
          <ul class="keyart">${alts
            .map((src, n) => `<li class="poster-frame reveal-frame"><img src="${src}" alt="Alternate poster ${n + 1} for ${esc(f.title)}" loading="lazy" decoding="async"></li>`)
            .join("")}</ul>
        </section>`
      : "";

    return `
<article class="film" style="--accent:${f.theme.accent};--ink:${f.theme.ink}">
  <header class="film-hero">
    <div class="film-hero-bg${shots[0] ? " film-hero-bg--still" : ""}" aria-hidden="true">${shots[0] ? `<img src="${shots[0]}" alt="" decoding="async" fetchpriority="high">` : poster(f, `bg-${f.slug}`)}</div>
    <div class="film-hero-inner wrap">
      <a class="back mono" href="${href("/work/")}">← All work</a>
      <p class="mono section-label">${pad(i + 1)} / ${pad(films.length)}${metaLine(f) ? ` — ${esc(metaLine(f))}` : ""}</p>
      <h1 class="film-title display"><span class="line"><span>${esc(f.title)}</span></span></h1>
      <p class="film-by mono">A film by ${esc(f.filmmaker)}</p>
      ${f.tagline ? `<p class="film-tagline display reveal"><em>${esc(f.tagline)}</em></p>` : ""}
    </div>
  </header>

  <div class="film-body wrap">
    <div class="film-poster">
      <div class="poster-frame reveal-frame">${poster(f, `pd-${f.slug}`)}</div>
    </div>
    <div class="film-info">
      ${
        tba
          ? `<section class="film-section reveal"><h2 class="mono section-label">Synopsis</h2><p class="film-synopsis chapter-logline--tba">Synopsis coming soon.</p></section>`
          : `<section class="film-section reveal"><h2 class="mono section-label">Synopsis</h2>${f.synopsis.map((p) => `<p class="film-synopsis">${esc(p)}</p>`).join("")}</section>`
      }
      <section class="film-section reveal"><h2 class="mono section-label">Credits</h2><dl class="kv-list">${credits}</dl></section>
      ${cast ? `<section class="film-section reveal"><h2 class="mono section-label">Cast</h2><ul class="cast-list">${cast}</ul></section>` : ""}
      <section class="film-section reveal"><h2 class="mono section-label">Details</h2><dl class="kv-list">${facts}</dl></section>
      ${
        f.links.length
          ? `<section class="film-section reveal"><h2 class="mono section-label">Elsewhere</h2><ul class="link-list">${f.links
              .map((l) => `<li><a href="${l.href}" target="_blank" rel="noopener">${esc(l.label)} ${ext}</a></li>`)
              .join("")}</ul></section>`
          : ""
      }
    </div>
  </div>
  ${gallery}
  ${keyArtSection}
  ${trailer}

  <nav class="film-nav wrap" aria-label="More films">
    <a class="film-nav-link" href="${filmUrl(prev)}"><span class="mono">← Previous</span><span class="display">${esc(prev.title)}</span></a>
    <a class="film-nav-link film-nav-link--next" href="${filmUrl(next)}"><span class="mono">Next →</span><span class="display">${esc(next.title)}</span></a>
  </nav>
</article>`;
  }

  /* --------------------------------------------------------------- ABOUT */
  function about() {
    const filmography = [
      { title: "Voices", year: 2023, slug: "voices", note: "Documentary" },
      { title: "Before Us. After Us.", year: 2024, slug: "before-us-after-us", note: "" },
      { title: "Where We Lie", year: 2024, slug: "where-we-lie", note: "" },
      { title: "BlankBox", year: 2026, slug: "blankbox", note: "" },
      { title: "Archival: The Hampton Inheritance", year: 2026, note: "" },
    ]
      .map(
        (x) => `<li class="reveal">${
          x.slug
            ? `<a href="${href(`/work/${x.slug}/`)}"><span class="mono">${x.year}</span><span class="t">${esc(x.title)}</span><span class="mono n">${x.note}</span>${arrow}</a>`
            : `<div><span class="mono">${x.year}</span><span class="t">${esc(x.title)}</span><span class="mono n">${x.note}</span><span></span></div>`
        }</li>`,
      )
      .join("");

    return `
<section class="about-hero wrap" aria-labelledby="about-title">
  <div class="about-hero-copy">
    <p class="mono section-label reveal">About — Producer &amp; Filmmaker</p>
    <h1 class="page-title display" id="about-title"><span class="line"><span>Cole</span></span><span class="line"><span><em>Rutman</em></span></span></h1>
    <p class="about-role mono reveal">The creative lead behind BLANKBOX ENTERTAINMENT</p>
  </div>
  <figure class="portrait reveal-frame">
    ${portrait}
  </figure>
</section>

<section class="about-lede wrap">
  <p class="display reveal" data-words>Cole Rutman is a Canadian producer and entertainment industry manager. Recognized as one of North America's young filmmakers to watch, he has balanced a career in independent cinema with leadership roles and business studies at Western University's Ivey Business School <span class="nowrap">(HBA ’26).</span></p>
</section>

<section class="about-quote wrap" aria-label="Signature">
  <p class="mono section-label reveal">The signature</p>
  <blockquote class="reveal">
    <p class="display">Rutman's cinematic work often highlights <em>high-concept plots</em>, <em>complex storylines</em>, and <em>dark twists</em>.</p>
  </blockquote>
</section>

<figure class="about-onset wrap">
  <div class="about-onset-img reveal-frame"><img src="${asset("img/cole-rutman-on-set.webp")}" alt="Cole Rutman directing an actor on a rocky shoreline" width="724" height="1086" loading="lazy" decoding="async"></div>
  <figcaption class="reveal"><span class="mono section-label">Behind the camera</span><span class="display">On set, directing.</span><a class="btn btn--ghost about-imdb" href="https://www.imdb.com/name/nm16290719/" target="_blank" rel="noopener">View IMDb <span aria-hidden="true">↗</span></a></figcaption>
</figure>

<section class="about-grid wrap">
  <div class="about-col">
    <p class="mono section-label reveal">Filmography</p>
    <p class="about-body reveal">He has written, directed, and produced several films, including Voices (2023), Before Us. After Us. (2024), Where We Lie (2024), BlankBox (2026), and Archival: The Hampton Inheritance (2026).</p>
    <ol class="filmography">${filmography}</ol>
  </div>
  <div class="about-col">
    <p class="mono section-label reveal">Recognition</p>
    <p class="stat reveal"><span class="stat-n display" data-count="18">18</span><span class="stat-l mono">Film festival selections</span></p>
    <ul class="honours">
      <li class="reveal"><span class="mono">Semi-finalist</span><span>Flickers’ Rhode Island International Film Festival <span class="muted">(Oscar-qualifying)</span></span></li>
      <li class="reveal"><span class="mono">Two-time finalist</span><span>LA Student Film Festival</span></li>
      <li class="reveal"><span class="mono">Nominee</span><span>Canadian Screen Awards</span></li>
      <li class="reveal"><span class="mono">Gold Key</span><span>Scholastic Art &amp; Writing Awards</span></li>
    </ul>
    <p class="about-body reveal">His projects have accumulated 18 film festival selections. He was a semi-finalist at the Oscar-qualifying Flickers Rhode Island International Film Festival, a two-time finalist at the LA Student Film Festival, and a nominee for the Canadian Screen Awards. He also received a Gold Key from the Scholastic Art &amp; Writing Awards.</p>
  </div>
</section>

<section class="enter" aria-label="Portfolio">
  <a class="enter-link" href="${href("/work/")}">
    <span class="mono enter-label">Continue</span>
    <span class="enter-title display"><span>See the work</span> ${arrow}</span>
  </a>
</section>`;
  }

  /* ------------------------------------------------------------- CONTACT */
  function contact() {
    const linkedin = site.social.find((s) => s.label === "LinkedIn");
    const form = site.contactEmail
      ? `<form class="contact-form" data-contact data-to="${esc(site.contactEmail)}" novalidate>
          <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" autocomplete="name" required></div>
          <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="c-org">Company <span class="muted">(optional)</span></label><input id="c-org" name="organization" autocomplete="organization"></div>
          <div class="field"><label for="c-topic">Regarding</label>
            <select id="c-topic" name="topic">
              <option>A project or development opportunity</option>
              <option>Collaboration</option>
              <option>Press</option>
              <option>Something else</option>
            </select>
          </div>
          <div class="field field--wide"><label for="c-msg">Message</label><textarea id="c-msg" name="message" rows="6" required></textarea></div>
          <div class="form-foot field--wide">
            <button class="btn btn--solid" type="submit">Send message ${arrow}</button>
            <p class="form-status mono" role="status" aria-live="polite" data-status></p>
          </div>
        </form>`
      : "";

    return `
<section class="page-hero wrap" aria-labelledby="contact-title">
  <p class="mono section-label reveal">Contact</p>
  <h1 class="page-title display" id="contact-title"><span class="line"><span>Start with</span></span><span class="line"><span class="blank-word">Blank</span></span></h1>
  <p class="page-lede reveal">For projects, collaboration, screenings or press, we'd like to hear from you.</p>
</section>

<section class="contact wrap">
  <div class="contact-channels">
    ${
      site.contactEmail
        ? `<a class="channel reveal" href="mailto:${esc(site.contactEmail)}"><span class="mono">Email</span><span class="channel-v">${esc(site.contactEmail)}</span>${arrow}</a>`
        : ""
    }
    ${
      linkedin
        ? `<a class="channel reveal" href="${linkedin.href}" target="_blank" rel="noopener"><span class="mono">LinkedIn</span><span class="channel-v">Message Cole Rutman</span>${ext}</a>`
        : ""
    }
    ${site.social
      .filter((s) => s !== linkedin)
      .map((s) => `<a class="channel reveal" href="${s.href}" target="_blank" rel="noopener"><span class="mono">${esc(s.label)}</span><span class="channel-v">Filmography</span>${ext}</a>`)
      .join("")}
    <div class="channel channel--static reveal"><span class="mono">Based in</span><span class="channel-v">${esc(site.location)}</span></div>
  </div>
  ${form}
</section>`;
  }

  /* ----------------------------------------------------------------- 404 */
  function notFound() {
    return `
<section class="nf wrap">
  <p class="mono section-label">Error 404 — Missing reel</p>
  <h1 class="page-title display"><span class="line"><span>This box is</span></span><span class="line"><span><em>empty.</em></span></span></h1>
  <p class="page-lede">The page you were looking for isn't here. It may have moved, or it may never have existed.</p>
  <div class="hero-actions">
    <a class="btn btn--solid" href="${href("/")}">Return home ${arrow}</a>
    <a class="btn btn--ghost" href="${href("/work/")}">Our work</a>
  </div>
</section>`;
  }

  return { home, work, film, about, contact, notFound };
}
