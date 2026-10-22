import { site } from "./config.mjs";
import { esc } from "./lib/util.mjs";

const pad = (n) => String(n).padStart(2, "0");
const arrow = `<span class="arrow" aria-hidden="true">→</span>`;
const ext = `<span aria-hidden="true">↗</span>`;

const viewfinder = `<span class="vf" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;

export function createPages({ films, brands, href, asset, poster, portrait, stills, keyArt }) {
  const filmUrl = (f) => href(`/work/${f.slug}/`);
  const metaLine = (f) => [f.year, f.format, f.runtime].filter(Boolean).join(" · ");
  const byline = (f) => f.byline || `A film by ${f.filmmaker}`;
  const logoNames = { netflix: "Netflix", appletv: "Apple TV+" };
  const netLogo = (f, cls = "") =>
    f.platformLogo && !(f.posterHasLogo && !cls.includes("corner") && !cls.includes("above")) && !(cls.includes("above") && (!f.posterHasLogo || f.hideLogoAbovePoster)) ? `<img class="net-logo net-logo--${f.platformLogo} ${cls}" src="${asset(`img/platforms/${f.platformLogo}.svg`)}" alt="${logoNames[f.platformLogo]}" width="96" height="96" decoding="async">` : "";
  const platformBadge = (f, cls = "") =>
    f.platform ? `<p class="platform mono ${cls}"><span class="platform-dot" aria-hidden="true"></span>${f.kind === "series" ? "On" : "Seen at"} ${esc(f.platform)}</p>` : "";
  const teamLine = (f, cls = "") =>
    f.team?.length ? `<p class="team-credit mono ${cls}">${f.team.map((t) => `${esc(t.name)} — ${esc(t.role)}`).join(" · ")}</p>` : "";

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
            <p class="mono show-by">${esc(byline(f))}</p>
            ${f.logline ? `<p class="show-logline">${esc(f.logline)}</p>` : ""}
            <a class="btn btn--solid" href="${filmUrl(f)}"${i ? ' tabindex="-1"' : ""}>View project ${arrow}</a>
          </div>
          <div class="show-art">${netLogo(f, "net-logo--above")}<a class="show-poster" href="${filmUrl(f)}" tabindex="-1" aria-hidden="true">${poster(f, `sp-${f.slug}`)}${netLogo(f)}</a></div>
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
<div class="intro" data-intro role="dialog" aria-modal="true" aria-labelledby="gate-title" tabindex="-1">
  <div class="intro-bar intro-bar--top"></div>
  <div class="intro-bar intro-bar--bottom"></div>
  <div class="intro-center">
    <h2 class="sr-only" id="gate-title">BLANKBOX: choose where to go</h2>
    <img class="intro-logo" src="${asset("img/logo-lockup-blankbox.webp")}" alt="BLANKBOX" width="1006" height="400" fetchpriority="high">
    <nav class="gate" aria-label="Choose a division">
      <a class="gate-option" href="${href("/")}" data-gate="film">
        <span class="gate-label">Film &amp; Entertainment</span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>
      <a class="gate-option" href="${href("/brands/")}" data-gate="brands">
        <span class="gate-label">Brands &amp; Commercial</span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>
    </nav>
  </div>
</div>

<section class="hero" aria-labelledby="hero-title">
  <div class="hero-stage" aria-hidden="true">
    <div class="portal">
      <div class="portal-glow"></div>
      <img class="portal-img portal-img--mark" src="${asset("img/box-mark.webp")}" alt="" width="1400" height="1400" decoding="async" fetchpriority="high">
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
      <span class="line"><span>Every great</span></span>
      <span class="line"><span>story begins</span></span>
      <span class="line"><span>as a <em>blank box.</em></span></span>
    </h1>
    <div class="hero-foot">
      <p class="hero-lede reveal">BLANKBOX ENTERTAINMENT is a film and television company built for the evolving entertainment landscape. We focus on bold concepts and IP with compelling stories.</p>
      <div class="hero-actions reveal">
        <a class="btn btn--solid" href="${href("/work/")}">Explore our work ${arrow}</a>
        <a class="btn btn--ghost" href="${href("/about/")}">About Us</a>
        <span class="hero-brands-row"><a class="hero-brands" href="${href("/brands/")}">Our work with brands ${arrow}</a></span>
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


<section class="mission wrap" aria-labelledby="mission-title">
  <p class="mono section-label reveal">Our mission</p>
  <div class="mission-grid">
    <h2 class="mission-statement display reveal" id="mission-title">Our mission is to make great entertainment <em>reach further, connect deeper,</em> and find the audience it deserves.</h2>
    <div class="mission-body">
      <p class="reveal">BLANKBOX is a new-age entertainment company that brings stories to audiences around the world. From film and television to digital-first series, we focus on the connection between great content and the people who watch it.</p>
      <p class="reveal">We believe the future of entertainment lies in understanding audiences, finding stories that resonate with them, and bringing those stories to the platforms where they belong.</p>
    </div>
  </div>
</section>

<section class="enter" aria-label="Full portfolio">
  <a class="enter-link" href="${href("/work/")}">
    <span class="enter-title display"><span>View our credits</span> ${arrow}</span>
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
          <span class="mono by">${esc(f.platform || f.filmmaker)}</span>
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
          <a class="poster-frame reveal-frame" href="${filmUrl(f)}" tabindex="-1" aria-hidden="true">${poster(f, `ch-${f.slug}`)}${netLogo(f)}</a>
        </div>
        <div class="chapter-copy">
          <p class="chapter-num mono reveal"><span>${pad(i + 1)}</span> / ${pad(films.length)}</p>
          <h2 class="chapter-title display reveal" id="t-${f.slug}">${esc(f.title)}</h2>
          <p class="chapter-by mono reveal">${esc(byline(f))}</p>
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
  <h1 class="page-title display" id="work-title"><span class="line"><span>Selected credits.</span></span></h1>
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
    ${netLogo(f, "net-logo--corner")}
    <div class="film-hero-inner wrap">
      <a class="back mono" href="${href("/work/")}">← All work</a>
      <p class="mono section-label">${pad(i + 1)} / ${pad(films.length)}${metaLine(f) ? ` — ${esc(metaLine(f))}` : ""}</p>
      <h1 class="film-title display"><span class="line"><span>${esc(f.title)}</span></span></h1>
      <p class="film-by mono">${esc(byline(f))}</p>
      ${f.tagline ? `<p class="film-tagline display reveal"><em>${esc(f.tagline)}</em></p>` : ""}
    </div>
  </header>

  <div class="film-body wrap">
    <div class="film-poster">
      <div class="poster-frame reveal-frame">${poster(f, `pd-${f.slug}`)}${netLogo(f)}</div>
    </div>
    <div class="film-info">
      ${
        tba
          ? `<section class="film-section reveal"><h2 class="mono section-label">Synopsis</h2><p class="film-synopsis chapter-logline--tba">Synopsis coming soon.</p></section>`
          : `<section class="film-section reveal"><h2 class="mono section-label">Synopsis</h2>${f.synopsis.map((p) => `<p class="film-synopsis">${esc(p)}</p>`).join("")}</section>`
      }
      ${credits ? `<section class="film-section reveal"><h2 class="mono section-label">Credits</h2><dl class="kv-list">${credits}</dl></section>` : ""}
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
    <p class="mono section-label reveal">About — Producer &amp; CEO</p>
    <h1 class="page-title display" id="about-title"><span class="line"><span>Cole</span></span><span class="line"><span><em>Rutman</em></span></span></h1>
    <p class="about-role mono reveal">The creative lead behind BLANKBOX ENTERTAINMENT</p>
  </div>
  <figure class="portrait reveal-frame">
    ${portrait}
  </figure>
</section>

<section class="about-lede wrap">
  <p class="display reveal" data-words>Cole Rutman is a Canadian producer and entertainment industry manager.</p>
  <div class="about-lede-body">
    <p class="reveal">A graduate of Ivey Business School at Western University, Cole has worked as an executive producer and creative director at TED conferences, and founded and scaled a mobile app through Canada's number one accelerator, DMZ Toronto.</p>
    <p class="reveal">In his creative work, he has more than six years of experience producing numerous short films, plays and documentaries. With experience running multiple commercial shoots and creative projects from start to finish, he leads BLANKBOX ENTERTAINMENT with the vision to become a major distributor of new-age content for audiences around the world.</p>
  </div>
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

<section class="team wrap" aria-label="The team">
  <p class="mono section-label reveal">The team</p>
  <article class="member">
    <div class="member-card member-card--photo reveal-frame"><img src="${asset("img/ben-naroditsky.webp")}" alt="Portrait of Ben Naroditsky" width="720" height="960" loading="lazy" decoding="async"></div>
    <div class="member-copy">
      <p class="mono member-role reveal">Co-founder · Post-production &amp; Operations</p>
      <h3 class="member-name display reveal">Ben Naroditsky</h3>
      <p class="member-bio reveal">Ben Naroditsky is a co-founder of BLANKBOX ENTERTAINMENT, where he leads post-production and operations. He oversees projects end to end, from schedules and deliverables through final audio post, and co-produced <em>BlankBox</em>, the AI-themed short film the studio takes its name from, which reached over 25,000 views on Instagram during its campaign.</p>
      <p class="member-bio reveal">He holds a Master of Professional Communication and a BA with Distinction in Media Production, both from Toronto Metropolitan University, and an advanced diploma in Business Administration and Marketing from Seneca College. Outside the studio he serves as Director of Awards with IABC Toronto and has worked in corporate communications and design for the City of Pickering. He works in English and Russian.</p>
    </div>
  </article>
  <article class="member">
    <div class="member-card reveal-frame" aria-hidden="true">
      <span class="vf"><i></i><i></i><i></i><i></i></span>
      <span class="display">L<em>C</em></span>
    </div>
    <div class="member-copy">
      <p class="mono member-role reveal">Creative Specialist</p>
      <h3 class="member-name display reveal">Levi Considine</h3>
      <p class="member-bio reveal">Levi Considine is a Toronto-based sound designer and editor whose work has reached audiences on Netflix and Apple TV+. He has worked on Spin Master's animated series <em>Unicorn Academy</em> and <em>Mighty Express</em> for Netflix and on <em>Sago Mini Friends</em> for Apple TV+, and created the Foley and sound design for Michael Greco's festival-selected animated short <em>Green Grass</em>. His sound team on <em>Unicorn Academy</em> was nominated for the Canadian Screen Award for Best Sound, Animation.</p>
      <p class="member-bio reveal">Earlier in his career he worked on the sound of <em>Violent</em>, the Canadian-Norwegian drama that won Best Canadian Feature at the Vancouver International Film Festival. As Creative Specialist at BLANKBOX ENTERTAINMENT, he brings that experience across animation, television and features to the company's productions, starting with the sound design of <em>Two's a Party</em>.</p>
      <div class="member-links reveal">
        <a class="btn btn--ghost" href="https://www.imdb.com/name/nm6346683/" target="_blank" rel="noopener">View IMDb <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </article>
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
    const form = site.formEndpoint
      ? `<div class="brief-launch">
          <p class="mono section-label">Work with us</p>
          <h2 class="work-title display">Tell us about <em class="glow">your project.</em></h2>
          <p class="brief-launch-copy">Answer a few quick questions with our project assistant. It takes about two minutes, and your brief goes straight to our production manager.</p>
          <ol class="brief-launch-steps mono"><li>You</li><li>Your goals</li><li>Services</li><li>Timeline</li></ol>
          <button class="btn btn--solid" type="button" data-brief-open>Start your brief ${arrow}</button>
        </div>`
      : "";

    return `
<section class="page-hero contact-hero wrap" aria-labelledby="contact-title">
  <div class="contact-box" aria-hidden="true"><img src="${asset("img/box.webp")}" alt="" width="1600" height="1600" decoding="async"></div>
  <p class="mono section-label reveal">Contact</p>
  <h1 class="page-title display" id="contact-title"><span class="line"><span>Start</span></span><span class="line"><span class="blank-word">Blank</span></span></h1>
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
      site.formEndpoint
        ? `<a class="channel reveal" href="#brief" data-brief-open><span class="mono">Brands</span><span class="channel-v">Work with us</span>${arrow}</a>`
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

  /* -------------------------------------------------------------- BRANDS */
  function brandsPage() {
    const services = [
      // [title, description, tags, image]. Replace images in src/assets/img/services/ with your own photos.
      ["Commercials", "Story-led spots that captivate your audience and move them to act, built to drive results and sales.", ["Concept", "Script", "Production", "Post"], "img/services/commercials.webp"],
      ["Social-native content", "Vertical-first stories made for the feed, with hooks that stop the scroll and formats each platform rewards.", ["Reels", "TikTok", "Shorts"], "img/services/social.webp"],
      ["Events & coverage", "Launches, openings and live moments captured as stories, not just footage, and turned around fast.", ["Recaps", "Highlights", "Interviews"], "img/services/events.webp"],
      ["Retainer video production", "An embedded creative team on call every month, keeping your channels full of content that performs.", ["Monthly", "Always-on", "Scalable"], "img/services/retainer.webp"],
    ];
    const method = [
      ["Hook", "The first three seconds decide everything. We open on an image, a question or a turn that stops the scroll."],
      ["Narrative", "A story people want to finish. Characters, tension and payoff, built around your brand instead of bolted on."],
      ["Impact", "Craft that lands. Cinema-grade picture, sound and edit, so the feeling arrives exactly where it should."],
      ["Recall", "The part your customers carry with them. A moment, a line or an image that keeps your brand in mind long after it ends."],
    ];
    const logos = (k) =>
      brands.clients
        .map((c) => `<li${k ? ' aria-hidden="true"' : ""}><img${c.knockout || c.large ? ` class="${[c.knockout && "logo-knockout", c.large && "logo-lg"].filter(Boolean).join(" ")}"` : ""} src="${asset(c.logo)}" alt="${k ? "" : esc(c.name)}" loading="lazy" decoding="async" height="80"></li>`)
        .join("");

    return `
<section class="bhero" aria-labelledby="brands-title">
  <div class="bhero-media" aria-hidden="true" style="--hero-poster:url('${asset("video/hero-loop-poster.webp")}')">
    <video autoplay muted loop playsinline webkit-playsinline preload="auto" poster="${asset("video/hero-loop-poster.webp")}">
      <source src="${asset("video/hero-loop-sm.mp4")}" type="video/mp4" media="(max-width: 860px)">
      <source src="${asset("video/hero-loop.mp4")}" type="video/mp4">
      <source src="${asset("video/hero-loop.webm")}" type="video/webm">
    </video>
  </div>
  <div class="bhero-shade" aria-hidden="true"></div>
  <div class="bhero-inner wrap">
    <img class="media-lockup reveal" src="${asset("img/logo-lockup-media.webp")}" alt="BLANKBOX MEDIA" width="1006" height="460" fetchpriority="high">
    <h1 class="bhero-title display" id="brands-title">
      <span class="line"><span>Everyone has a story.</span></span>
      <span class="line"><span>What about <em class="glow">your brand?</em></span></span>
    </h1>
    <div class="bhero-foot">
      <div class="pitch">
        <p class="pitch-line display reveal"><span>People skip ads.</span> <em>They finish stories.</em></p>
        <p class="pitch-sub reveal">Our creative production team is made up of professional filmmakers and storytellers who create campaigns, branded content and commercials that people choose to watch, and remember.</p>
        <div class="hero-actions reveal">
          <a class="btn btn--accent" href="${href("/contact/#brief")}" data-brief-open>Start a project ${arrow}</a>
          <a class="btn btn--ghost" href="#services">Our services</a>
        </div>
      </div>
      <dl class="bstats reveal" aria-label="By the numbers">
        ${brands.stats
          .map((x) => `<div><dt class="mono">${esc(x.label)}</dt><dd class="display" aria-label="${x.value}${esc(x.suffix)}"><span data-count="${x.value}" aria-hidden="true">${x.value}</span><span class="stat-suffix" aria-hidden="true">${esc(x.suffix)}</span></dd></div>`)
          .join("")}
      </dl>
    </div>
  </div>
</section>

<section class="clients" aria-labelledby="clients-title">
  <div class="wrap"><h2 class="mono section-label reveal" id="clients-title">Trusted by</h2></div>
  <div class="marquee" data-marquee><ul class="marquee-track">${[0, 1, 2, 3].map(logos).join("")}</ul></div>
</section>

<section class="feed wrap" aria-labelledby="feed-title">
  <div class="feed-copy">
    <p class="mono section-label reveal">Content creation</p>
    <h2 class="section-title display reveal" id="feed-title">Made for <em class="glow">the feed.</em></h2>
    <p class="feed-lede reveal">Short-form built like cinema: shot, cut and sound-designed for the platforms where your audience actually spends its time.</p>
    <ul class="feed-points">
      <li class="reveal"><span class="mono">0–3s</span>A hook in the first frame</li>
      <li class="reveal"><span class="mono">9:16</span>Native vertical, not cropped widescreen</li>
      <li class="reveal"><span class="mono">CC</span>Captioned for sound-off viewing</li>
    </ul>
    <ul class="feed-platforms reveal" aria-label="Platforms">${["Instagram", "TikTok", "YouTube Shorts", "LinkedIn"].map((x) => `<li class="mono">${x}</li>`).join("")}</ul>
  </div>
  ${[["screens", "", " phones--c"], ["eze", "@eze.entertainment", " phones--b"], ["feed", "@pickleplex", " phones--b phones--a"]]
    .map(
      ([key, handle, cls]) => `<div class="phones${cls}" data-phones aria-hidden="true">
    ${[1, 2, 3]
      .map(
        (n) => `<div class="phone phone--${n}">
        <div class="phone-screen">
          <video muted loop playsinline webkit-playsinline preload="none" poster="${asset(`video/${key}-${n}.webp`)}" data-inview-play>
            <source src="${asset(`video/${key}-${n}.mp4`)}" type="video/mp4">
            <source src="${asset(`video/${key}-${n}.webm`)}" type="video/webm">
          </video>
          <div class="phone-ui">
            <span class="phone-progress"><i></i></span>
            ${handle ? `<span class="phone-handle mono">${handle}</span>` : ""}
            <span class="phone-actions"><i class="pa-heart"></i><i class="pa-chat"></i><i class="pa-share"></i></span>
          </div>
        </div>
      </div>`,
      )
      .join("")}
  </div>`,
    )
    .join("")}
</section>

<section class="beats wrap" aria-labelledby="beats-title">
  <div class="beats-head">
    <p class="mono section-label reveal">Our philosophy</p>
    <h2 class="beats-title display reveal" id="beats-title">Every piece is built on <em class="glow">four beats.</em></h2>
  </div>
  <ol class="beats-line" data-beats>
    ${[
      ["Hook", "Stop the scroll in the first three seconds."],
      ["Narrative", "Give people a story they want to finish."],
      ["Impact", "Cinema-grade craft so the feeling lands."],
      ["Recall", "Leave a message your customers carry with them."],
    ]
      .map(
        ([t, d], i) => `<li class="beat" style="--i:${i}">
        <span class="beat-dot" aria-hidden="true"></span>
        <span class="beat-no mono">${pad(i + 1)}</span>
        <h3 class="beat-name display">${t}</h3>
        <p class="beat-desc">${d}</p>
      </li>`,
      )
      .join("")}
  </ol>
</section>

<section class="services" id="services" aria-labelledby="services-title">
  <div class="wrap section-head">
    <div>
      <p class="mono section-label reveal">Services</p>
      <h2 class="section-title display reveal" id="services-title">What we <em>make.</em></h2>
    </div>
    <div class="reel-controls reveal">
      <button class="icon-btn" type="button" data-reel-prev aria-label="Previous service">←</button>
      <button class="icon-btn" type="button" data-reel-next aria-label="Next service">→</button>
    </div>
  </div>
  <ol class="reel svc-slider" data-reel tabindex="0" aria-label="Services, scroll horizontally">
    ${services
      .map(
        ([t, d, tags], i) => `<li class="reel-item svc-card">
        <span class="svc-no mono">${pad(i + 1)} / ${pad(services.length)}</span>
        <h3 class="svc-title display">${esc(t)}</h3>
        <p class="svc-desc">${esc(d)}</p>
        <ul class="service-tags">${tags.map((x) => `<li class="mono">${esc(x)}</li>`).join("")}</ul>
        <a class="svc-link mono" href="${href("/contact/#brief")}" data-brief-open>Enquire ${arrow}</a>
      </li>`,
      )
      .join("")}
  </ol>
  <div class="wrap"><div class="svc-progress" aria-hidden="true"><i data-svc-progress></i></div></div>
</section>


<section class="showcase2 wrap" aria-labelledby="sc2-title">
  <div class="section-head">
    <div>
      <p class="mono section-label reveal">Featured work</p>
      <h2 class="section-title display reveal" id="sc2-title">Highlighted <em>Work</em></h2>
    </div>
  </div>
  <div class="sc2-grid">
    <figure class="sc2-item reveal">
      <div class="sc2-media feature-player" data-autoplay-video>
        <video muted playsinline webkit-playsinline loop preload="metadata" poster="${asset("video/reel-poster.webp")}">
          <source src="${asset("video/reel.mp4")}" type="video/mp4">
          <source src="${asset("video/reel.webm")}" type="video/webm">
        </video>
        <button class="sound-btn" type="button" aria-pressed="false" data-sound>
          <span class="sound-icon" aria-hidden="true"><i></i><i></i><i></i></span><span class="sound-label mono">Sound off</span>
        </button>
      </div>
      <figcaption><span class="mono">Brand film</span><span class="sc2-name">Pickleplex Social Club</span></figcaption>
    </figure>
    ${brands.youtube
      .map(
        (v) => `<figure class="sc2-item reveal" style="--d:.1s">
      <a class="sc2-media watch-card" href="https://www.youtube.com/watch?v=${esc(v.id)}${v.start ? `&t=${v.start}s` : ""}" target="_blank" rel="noopener" aria-label="Watch ${esc(v.label)} on YouTube">
        <img class="watch-cover" src="${asset(v.cover)}" alt="" loading="lazy" decoding="async">
        <img class="watch-logo" src="${asset(v.logo)}" alt="${esc(v.label)}" loading="lazy" decoding="async">
        <span class="watch-play" aria-hidden="true"><span class="video-play-icon"></span></span>
      </a>
      <figcaption><span class="mono">Event coverage</span><a class="sc2-name" href="https://www.youtube.com/watch?v=${esc(v.id)}${v.start ? `&t=${v.start}s` : ""}" target="_blank" rel="noopener">${esc(v.label)} <span aria-hidden="true">↗</span></a></figcaption>
    </figure>`,
      )
      .join("")}
  </div>
</section>

<section class="enter" aria-label="Contact">
  <a class="enter-link" href="${href("/contact/#brief")}" data-brief-open>
    <span class="mono enter-label">Brand partnerships</span>
    <span class="enter-title display"><span>Start a project</span> ${arrow}</span>
  </a>
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

  return { home, work, film, about, contact, brands: brandsPage, notFound };
}
