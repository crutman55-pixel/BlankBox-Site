/* BLANKBOX ENTERTAINMENT — interactions. No dependencies. */
(() => {
  "use strict";

  const doc = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const store = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };

  /* ---------------------------------------------------------- Opening sequence */
  // The home page opens on a gateway: the BLANKBOX logo, then a choice between
  // Film & Entertainment (stay on this page) and Brands & Commercial (go to /brands/).
  // It shows once per visit; after that the site navigates normally.
  function intro(done) {
    const el = $("[data-intro]");
    if (!el || store.get("bb-gate")) {
      el?.classList.add("is-done");
      return done();
    }
    document.body.style.overflow = "hidden";
    el.classList.add("is-open");
    const film = $('[data-gate="film"]', el);
    const brands = $('[data-gate="brands"]', el);
    const opts = [film, brands];
    el.focus({ preventScroll: true });

    const close = () => {
      store.set("bb-gate", "1");
      el.classList.add("is-leaving");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      setTimeout(done, reduced.matches ? 0 : 450);
      setTimeout(() => el.classList.add("is-done"), reduced.matches ? 0 : 1400);
      $("#main")?.focus({ preventScroll: true });
    };
    const onKey = (e) => {
      if (e.key === "Escape") return close();
      if (e.key === "Tab") {
        e.preventDefault();
        const i = opts.indexOf(document.activeElement);
        opts[i < 0 ? (e.shiftKey ? 1 : 0) : (i + (e.shiftKey ? -1 : 1) + opts.length) % opts.length].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    film.addEventListener("click", (e) => { e.preventDefault(); close(); });
    brands.addEventListener("click", () => store.set("bb-gate", "1"));
  }

  /* ---------------------------------------------------------- Header */
  function header() {
    const el = $("[data-header]");
    if (!el) return;
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      el.classList.toggle("is-scrolled", y > 24);
      const menuOpen = document.body.classList.contains("menu-open");
      el.classList.toggle("is-hidden", !menuOpen && y > 400 && y > last + 4);
      if (y < last - 4 || y < 400) el.classList.remove("is-hidden");
      last = y;
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    el.addEventListener("focusin", () => el.classList.remove("is-hidden"));
    update();
  }

  /* ---------------------------------------------------------- Mobile menu */
  function menu() {
    const btn = $("[data-menu-toggle]");
    const panel = $("[data-menu]");
    if (!btn || !panel) return;
    const label = $(".menu-toggle-label", btn);
    const focusables = () => [btn, ...$$("a", panel)];

    const open = () => {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add("is-open"));
      btn.setAttribute("aria-expanded", "true");
      label.textContent = "Close";
      document.body.classList.add("menu-open");
      setTimeout(() => $("a", panel)?.focus({ preventScroll: true }), 200);
    };
    const close = (returnFocus = true) => {
      panel.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      label.textContent = "Menu";
      document.body.classList.remove("menu-open");
      setTimeout(() => { if (btn.getAttribute("aria-expanded") === "false") panel.hidden = true; }, reduced.matches ? 0 : 800);
      if (returnFocus) btn.focus({ preventScroll: true });
    };
    btn.addEventListener("click", () => (btn.getAttribute("aria-expanded") === "true" ? close() : open()));
    panel.addEventListener("click", (e) => { if (e.target.closest("a")) close(false); });
    document.addEventListener("keydown", (e) => {
      if (btn.getAttribute("aria-expanded") !== "true") return;
      if (e.key === "Escape") return close();
      if (e.key === "Tab") {
        const f = focusables();
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => e.matches && btn.getAttribute("aria-expanded") === "true" && close(false));
  }

  /* ---------------------------------------------------------- Scroll reveals */
  function reveals() {
    const items = $$(".reveal, .reveal-frame, main .line");
    if (!("IntersectionObserver" in window)) return items.forEach((el) => el.classList.add("is-in"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    items.forEach((el) => io.observe(el));
    const sweep = () =>
      items.forEach((el) => {
        if (!el.classList.contains("is-in") && el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
      });
    window.addEventListener("scroll", () => requestAnimationFrame(sweep), { passive: true });
    setTimeout(sweep, 1200);
  }

  /* Statements light up word by word as they cross the viewport. */
  function words() {
    $$("[data-words]").forEach((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(part);
          const s = document.createElement("span");
          s.className = "w";
          s.textContent = part;
          frag.append(s);
        });
        node.replaceWith(frag);
      });
      const ws = $$(".w", el);
      if (reduced.matches) return ws.forEach((w) => w.classList.add("is-lit"));
      let ticking = false;
      const update = () => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
        const n = Math.round(p * ws.length);
        ws.forEach((w, i) => w.classList.toggle("is-lit", i < n));
        ticking = false;
      };
      window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      update();
    });
  }

  /* ---------------------------------------------------------- Hero timecode */
  function timecode() {
    const el = $("[data-timecode]");
    if (!el || reduced.matches) return;
    const start = performance.now();
    const p = (n) => String(n).padStart(2, "0");
    let lastFrame = -1;
    const tick = (now) => {
      const frames = Math.floor(((now - start) / 1000) * 24);
      if (frames !== lastFrame) {
        lastFrame = frames;
        const s = Math.floor(frames / 24);
        el.textContent = `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(frames % 24)}`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------- Reel (home) */
  function reel() {
    const el = $("[data-reel]");
    if (!el) return;
    const prev = $("[data-reel-prev]");
    const next = $("[data-reel-next]");
    const step = () => (el.querySelector(".reel-item")?.getBoundingClientRect().width || 300) + 24;
    const sync = () => {
      prev.disabled = el.scrollLeft < 8;
      next.disabled = el.scrollLeft + el.clientWidth > el.scrollWidth - 8;
    };
    const behavior = () => (reduced.matches ? "auto" : "smooth");
    prev.addEventListener("click", () => el.scrollBy({ left: -step(), behavior: behavior() }));
    next.addEventListener("click", () => el.scrollBy({ left: step(), behavior: behavior() }));
    const bar = $("[data-svc-progress]");
    el.addEventListener("scroll", () => {
      sync();
      if (bar) bar.style.transform = `scaleX(${Math.max(0.12, (el.scrollLeft + el.clientWidth) / el.scrollWidth)})`;
    }, { passive: true });
    el.addEventListener("keydown", (e) => {
      if (e.target !== el) return;
      if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev.click(); }
    });
    window.addEventListener("resize", sync);
    sync();

    // Drag to scroll with a mouse; touch uses native scrolling.
    let down = false, moved = false, x0 = 0, s0 = 0;
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = false; x0 = e.clientX; s0 = el.scrollLeft;
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 6) { moved = true; el.classList.add("is-dragging"); }
      if (moved) el.scrollLeft = s0 - dx;
    });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      if (moved) {
        el.classList.remove("is-dragging");
        const w = step();
        el.scrollTo({ left: Math.round(el.scrollLeft / w) * w, behavior: behavior() });
      }
    });
  }

  /* ---------------------------------------------------------- Featured film: autoplay in view, click for sound */
  function featureVideo() {
    $$("[data-autoplay-video]").forEach((wrap) => {
      const v = $("video", wrap);
      const btn = $("[data-sound]", wrap);
      const label = $(".sound-label", wrap);
      const sync = () => {
        btn.setAttribute("aria-pressed", String(!v.muted));
        label.textContent = v.muted ? "Sound off" : "Sound on";
      };
      const toggle = () => { v.muted = !v.muted; v.dataset.userSound = v.muted ? "" : "1"; if (v.paused) v.play().catch(() => {}); sync(); };
      wrap.addEventListener("click", (e) => { if (!e.target.closest("[data-sound]")) toggle(); });
      btn.addEventListener("click", (e) => { e.stopPropagation(); toggle(); });
      if ("IntersectionObserver" in window) {
        // Start buffering well before the clip is reached, so it is already running on arrival.
        new IntersectionObserver(([e]) => {
          if (e.isIntersecting) { if (v.preload !== "auto" && v.paused && v.readyState < 3) { v.preload = "auto"; v.load(); } v.play().catch(() => {}); }
          else v.pause();
        }, { rootMargin: "800px 0px", threshold: 0 }).observe(wrap);
      }
      sync();
      // A thin playback line, where the wrapper provides one.
      const bar = $(".aerial-progress i", wrap);
      if (bar) {
        const draw = () => {
          if (v.duration) bar.style.transform = `scaleX(${(v.currentTime / v.duration).toFixed(4)})`;
          if (!v.paused) requestAnimationFrame(draw);
        };
        v.addEventListener("play", () => requestAnimationFrame(draw));
      }
    });
    // Phone mockups: play while on screen; the stack tilts toward the pointer.
    $$("[data-inview-play]").forEach((v) => {
      if (!("IntersectionObserver" in window)) return;
      v.muted = true;
      // Start loading well before the row is reached, so it is already playing on arrival.
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { if (v.preload !== "auto") { v.preload = "auto"; v.load(); } v.play().catch(() => {}); }
        else v.pause();
      }, { rootMargin: "900px 0px", threshold: 0 }).observe(v);
    });
    const phones = $("[data-phones]");
    if (phones && fine.matches && !reduced.matches) {
      phones.addEventListener("pointermove", (e) => {
        const r = phones.getBoundingClientRect();
        phones.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -8}deg`);
        phones.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`);
      });
      phones.addEventListener("pointerleave", () => { phones.style.setProperty("--rx", "0deg"); phones.style.setProperty("--ry", "0deg"); });
    }
    // Background loop in the Brands hero respects reduced motion.
    $$(".bhero-media video").forEach((v) => {
      v.muted = true;
      const reveal = () => v.classList.add("is-playing");
      v.addEventListener("playing", reveal, { once: true });
      v.addEventListener("timeupdate", () => v.currentTime > 0 && reveal(), { once: true });
      if (!v.paused && v.currentTime > 0) reveal();
      v.play().catch(() => {});
    });
    // Floating brief button appears once the visitor scrolls past the hero.
    const fab = $(".brief-fab");
    const hero = $(".bhero");
    if (fab && hero && "IntersectionObserver" in window) {
      fab.classList.add("is-hidden");
      new IntersectionObserver(([e]) => fab.classList.toggle("is-hidden", e.intersectionRatio > 0.35), { threshold: [0, 0.35, 1] }).observe(hero);
    }
  }

  /* ---------------------------------------------------------- Mobile: nudge muted videos to start */
  // Muted loops are part of the content, so they play regardless of reduced-motion settings.
  // Browsers that hold autoplay back (iOS Low Power Mode, data saver) get another try on
  // every touch, scroll and return to the tab, for each paused loop that is on screen.
  function kickVideos() {
    const onScreen = (v) => { const r = v.getBoundingClientRect(); return r.bottom > -200 && r.top < innerHeight + 200; };
    const go = () => $$("video[autoplay]").forEach((v) => {
      if (!v.paused || !onScreen(v)) return;
      if (!v.closest("[data-autoplay-video]") || !v.dataset.userSound) v.muted = true;
      v.play().catch(() => {});
    });
    let ticking = false;
    const soon = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; go(); }); } };
    go();
    ["touchstart", "touchend", "scroll"].forEach((ev) => window.addEventListener(ev, soon, { passive: true }));
    document.addEventListener("visibilitychange", () => { if (!document.hidden) go(); });
    window.addEventListener("pageshow", go);
  }

  /* ---------------------------------------------------------- Hook / Narrative / Impact / Recall */
  function method() {
    const list = $("[data-method]");
    if (!list) return;
    const items = $$(".method-item", list);
    const ms = 4200;
    let i = 0, timer = 0, auto = !reduced.matches, visible = false;
    const set = (n) => {
      i = (n + items.length) % items.length;
      items.forEach((it, k) => {
        it.classList.toggle("is-active", k === i);
        $(".method-btn", it).setAttribute("aria-expanded", String(k === i));
      });
      list.style.setProperty("--method-ms", `${ms}ms`);
      items[i].classList.remove("is-timing"); void items[i].offsetWidth;
      if (auto && visible) items[i].classList.add("is-timing");
      clearTimeout(timer);
      if (auto && visible) timer = setTimeout(() => set(i + 1), ms);
    };
    const stop = () => { auto = false; clearTimeout(timer); items.forEach((it) => it.classList.remove("is-timing")); };
    items.forEach((it, k) => {
      const btn = $(".method-btn", it);
      btn.addEventListener("click", () => { stop(); set(k); });
      if (fine.matches) it.addEventListener("pointerenter", () => { stop(); set(k); });
      btn.addEventListener("focus", () => { stop(); set(k); });
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; set(i); }, { threshold: 0.4 }).observe(list);
    }
    // A soft spotlight follows the pointer across the panels.
    if (fine.matches) {
      items.forEach((it) => it.addEventListener("pointermove", (e) => {
        const r = it.getBoundingClientRect();
        it.style.setProperty("--mx", `${e.clientX - r.left}px`);
        it.style.setProperty("--my", `${e.clientY - r.top}px`);
      }));
    }
    set(0);
  }

  /* ------------------------------------------------ Widescreen HUD: a running 24fps timecode while in view */
  function timecode() {
    const el = $("[data-timecode]");
    if (!el || reduced.matches) return;
    const p2 = (n) => String(n).padStart(2, "0");
    let frames = ((1 * 60 + 12) * 60 + 4) * 24 + 18, timer = 0;
    const tick = () => {
      frames++;
      const f = frames % 24, s = Math.floor(frames / 24);
      el.textContent = `${p2(Math.floor(s / 3600))}:${p2(Math.floor(s / 60) % 60)}:${p2(s % 60)}:${p2(f)}`;
    };
    new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = setInterval(tick, 1000 / 24);
    }).observe(el);
  }

  // The same scroll-linked fill as the beats line, for other lines on the page.
  function fillLine(el) {
    if (reduced.matches) return el.style.setProperty("--p", 1);
    let ticking = false;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      el.style.setProperty("--p", Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.35))).toFixed(3));
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------------------------------------------------------- Four beats: draw the line in view */
  function beats() {
    $$("[data-fill]").forEach(fillLine);
    const el = $("[data-beats]");
    if (!el) return;
    const items = $$(".beat", el);
    if (reduced.matches) { el.style.setProperty("--p", 1); items.forEach((it) => it.classList.add("is-lit")); return; }
    // The line fills in step with the visitor's scroll; each beat lights as the fill reaches it.
    let ticking = false;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.35)));
      el.style.setProperty("--p", p.toFixed(3));
      items.forEach((it, i) => it.classList.toggle("is-lit", p >= i / items.length + 0.02));
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------------------------------------------------------- Count-up numbers (Brands) */
  function counters() {
    const els = $$("[data-count]");
    if (!els.length) return;
    const run = (el) => {
      const target = Number(el.dataset.count);
      if (reduced.matches) return (el.textContent = target);
      const dur = 3600, t0 = performance.now();
      const decimals = target < 10 ? 1 : 0;
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        const eased = 0.5 - Math.cos(Math.PI * t) / 2; // steady climb, gentle start and finish
        el.textContent = t < 1 ? (target * eased).toFixed(decimals) : String(target);
        if (t < 1) requestAnimationFrame(step);
      };
      el.textContent = (0).toFixed(decimals);
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) return;
    els.forEach((el) => (el.textContent = reduced.matches ? el.dataset.count : "0"));
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    }), { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------- Home slideshow */
  function showcase() {
    const el = $("[data-showcase]");
    if (!el) return;
    const slides = $$(".show-slide", el);
    const tabs = $$("[data-show-go]", el);
    const pauseBtn = $("[data-show-pause]", el);
    const ms = 5000;
    el.style.setProperty("--show-ms", `${ms}ms`);
    let i = 0, timer = 0, paused = reduced.matches, visible = true;

    const go = (n) => {
      n = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        const on = k === n;
        s.classList.toggle("is-active", on);
        on ? s.removeAttribute("aria-hidden") : s.setAttribute("aria-hidden", "true");
        $$("a.btn", s).forEach((a) => (on ? a.removeAttribute("tabindex") : a.setAttribute("tabindex", "-1")));
        $$("img[loading='lazy']", s).forEach((img) => k === (n + 1) % slides.length && (img.loading = "eager"));
      });
      tabs.forEach((t, k) => {
        t.classList.toggle("is-done", k < n);
        t.classList.remove("is-active");
        t.toggleAttribute("aria-current", k === n);
      });
      void tabs[n].offsetWidth; // restart the progress bar animation
      tabs[n].classList.add("is-active");
      i = n;
      schedule();
    };
    const schedule = () => {
      clearTimeout(timer);
      if (!paused && visible) timer = setTimeout(() => go(i + 1), ms);
    };
    const setPaused = (p) => {
      paused = p;
      el.classList.toggle("is-paused", p);
      pauseBtn.setAttribute("aria-label", p ? "Play slideshow" : "Pause slideshow");
      pauseBtn.textContent = p ? "▶" : "❚❚";
      schedule();
    };

    tabs.forEach((t) => t.addEventListener("click", () => go(Number(t.dataset.showGo))));
    $("[data-show-prev]", el).addEventListener("click", () => go(i - 1));
    $("[data-show-next]", el).addEventListener("click", () => go(i + 1));
    pauseBtn.addEventListener("click", () => setPaused(!paused));
    // Keeps rolling every 5 seconds; only the pause button (or reduced-motion settings) stops it.
    el.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    });
    // Swipe on touch screens.
    let x0 = null;
    el.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1);
      x0 = null;
    });
    // Only run while on screen.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; schedule(); }).observe(el);
    }
    setPaused(paused);
    go(0);
  }

  /* ---------------------------------------------------------- Work index preview */
  function preview() {
    const wrap = $("[data-preview-wrap]");
    if (!wrap || !fine.matches) return;
    const cards = new Map($$("[data-preview-card]").map((c) => [c.dataset.previewCard, c]));
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      wrap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e) => {
      tx = e.clientX + 32;
      ty = e.clientY - wrap.offsetHeight / 2;
      if (reduced.matches) { x = tx; y = ty; wrap.style.transform = `translate3d(${x}px, ${y}px, 0)`; }
      else if (!raf) raf = requestAnimationFrame(loop);
    };
    $$("[data-preview]").forEach((a) => {
      a.addEventListener("pointerenter", (e) => {
        if (!wrap.classList.contains("is-on")) { x = e.clientX + 32; y = e.clientY - wrap.offsetHeight / 2; }
        cards.forEach((c, k) => c.classList.toggle("is-on", k === a.dataset.preview));
        wrap.classList.add("is-on");
        move(e);
      });
      a.addEventListener("pointermove", move);
      a.addEventListener("pointerleave", () => wrap.classList.remove("is-on"));
    });
  }

  /* ---------------------------------------------------------- Trailer embeds (click to load) */
  function videos() {
    $$("[data-video]").forEach((el) => {
      $(".video-play", el)?.addEventListener("click", () => {
        const id = encodeURIComponent(el.dataset.video);
        const f = document.createElement("iframe");
        f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&start=${Number(el.dataset.start) || 0}`;
        f.title = "Trailer";
        f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        f.allowFullscreen = true;
        el.replaceChildren(f);
      });
    });
  }

  /* ---------------------------------------------------------- Contact form → email */
  function contact() {
    const form = $("[data-contact]");
    if (!form) return;
    const status = $("[data-status]", form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let firstBad = null;
      $$("[required]", form).forEach((f) => {
        const bad = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        f.setAttribute("aria-invalid", bad ? "true" : "false");
        if (bad && !firstBad) firstBad = f;
      });
      if (firstBad) {
        status.textContent = "Please complete the highlighted fields.";
        firstBad.focus();
        return;
      }
      const d = Object.fromEntries(new FormData(form));
      const subject = `${d.topic} — ${d.name}${d.organization ? ` (${d.organization})` : ""}`;
      const body = `${d.message}\n\n— ${d.name}\n${d.email}${d.organization ? `\n${d.organization}` : ""}`;
      window.location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Opening your email app…";
    });
    form.addEventListener("input", (e) => e.target.getAttribute("aria-invalid") === "true" && e.target.value.trim() && e.target.setAttribute("aria-invalid", "false"));
  }

  /* ---------------------------------------------------------- Work with us form → email */
  function workForm() {
    const form = $("[data-work-form]");
    if (!form) return;
    const status = $("[data-status]", form);
    const btn = $("button[type=submit]", form);
    form.addEventListener("input", (e) => e.target.getAttribute("aria-invalid") === "true" && e.target.value.trim() && e.target.setAttribute("aria-invalid", "false"));
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let bad = null;
      $$("[required]", form).forEach((f) => {
        const no = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        f.setAttribute("aria-invalid", no ? "true" : "false");
        if (no && !bad) bad = f;
      });
      if (bad) { status.textContent = "Please complete the highlighted fields."; bad.focus(); return; }
      const d = Object.fromEntries(new FormData(form));
      if (d._honey) return;
      btn.disabled = true; status.textContent = "Sending…";
      try {
        const res = await fetch(form.dataset.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: `New enquiry: ${d.company} (${d.budget})`,
            _template: "table",
            _captcha: "false",
            _replyto: d.email,
            Name: d.name, Company: d.company, Email: d.email, Phone: d.phone || "—", Budget: d.budget, "How can we help": d.message,
          }),
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        form.classList.add("is-sent");
        status.textContent = "Thank you. We'll be in touch shortly.";
      } catch {
        status.textContent = "Something went wrong. Please try again in a moment.";
      } finally { btn.disabled = false; }
    });
  }

  /* ---------------------------------------------------------- Images: graceful fallback */
  function images() {
    $$("img").forEach((img) => {
      const fail = () => img.closest(".poster-frame, .reel-poster, .spotlight-poster, .portrait, .preview-card, .film-hero-bg")?.classList.add("img-failed");
      if (img.complete && img.naturalWidth === 0) fail();
      else img.addEventListener("error", fail, { once: true });
    });
  }

  /* ---------------------------------------------------------- Boot */
  function start() {
    document.body.classList.add("is-ready");
    reveals();
  }

  header();
  menu();
  words();
  timecode();
  reel();
  showcase();
  counters();
  beats();
  timecode();
  method();
  featureVideo();
  kickVideos();
  preview();
  videos();
  contact();
  images();
  $("[data-to-top]")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduced.matches ? "auto" : "smooth" });
    $("#main")?.focus({ preventScroll: true });
  });
  intro(start);
  doc.classList.add("is-booted");
})();
