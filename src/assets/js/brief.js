/* BLANKBOX — project brief assistant.
   A guided, conversational intake that collects a brief and emails it to the
   production manager. Opens from any [data-brief-open] element. No dependencies. */
(() => {
  "use strict";

  const script = document.currentScript;
  const endpoint = script?.dataset.endpoint;
  const MAILTO = script?.dataset.mailto || "";
  const WEB3 = script?.dataset.web3 || "";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const GOALS = [
    "I'm launching a new product",
    "Trying to drive sales",
    "Looking to market my brand and gain exposure",
    "Hoping to level up my social media content",
    "Cover an event",
    "Produce a professional corporate video or commercial",
  ];
  const SERVICES = ["Commercials", "Social-native content", "Events & coverage", "Retainer video production"];
  // Which services each goal points toward, used to pre-select a recommendation.
  const GOAL_TO_SERVICE = {
    0: ["Commercials", "Social-native content"],
    1: ["Commercials", "Social-native content"],
    2: ["Social-native content", "Retainer video production"],
    3: ["Social-native content", "Retainer video production"],
    4: ["Events & coverage"],
    5: ["Commercials"],
  };
  const TOTAL = 9;

  const BACK = Symbol("back");
  const RESTART = Symbol("restart");
  let root, log, dock, bar, stepLabel, lastFocus, started = false, busy = false, stepIdx = 0;
  const data = {};

  /* ------------------------------------------------------------------ shell */
  function build() {
    root = el("div", "brief");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Project brief assistant");
    root.hidden = true;
    root.innerHTML = `
      <div class="brief-backdrop" data-brief-close></div>
      <section class="brief-panel">
        <header class="brief-head">
          <div class="brief-id">
            <span class="brief-avatar" aria-hidden="true"><i></i></span>
            <div><p class="brief-name">BLANKBOX Studio</p><p class="brief-status mono"><span class="brief-dot"></span>Project assistant</p></div>
          </div>
          <div class="brief-progress" aria-hidden="true"><i></i></div>
          <p class="brief-step mono" aria-live="polite"></p>
          <button class="brief-close" type="button" data-brief-close aria-label="Close">✕</button>
        </header>
        <div class="brief-log" aria-live="polite"></div>
        <div class="brief-dock"></div>
      </section>`;
    document.body.append(root);
    log = root.querySelector(".brief-log");
    dock = root.querySelector(".brief-dock");
    bar = root.querySelector(".brief-progress i");
    stepLabel = root.querySelector(".brief-step");
    root.querySelectorAll("[data-brief-close]").forEach((b) => b.addEventListener("click", close));
    root.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") trap(e);
    });
  }

  function trap(e) {
    const f = [...root.querySelectorAll("button, input, textarea, [tabindex='0']")].filter((n) => !n.disabled && n.offsetParent);
    if (!f.length) return;
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
  }

  function open() {
    if (!root) build();
    lastFocus = document.activeElement;
    root.hidden = false;
    document.body.classList.add("brief-open");
    requestAnimationFrame(() => root.classList.add("is-open"));
    if (!started) { started = true; run(); }
    else setTimeout(() => dock.querySelector("input, textarea, button")?.focus(), 300);
  }
  function close() {
    root.classList.remove("is-open");
    document.body.classList.remove("brief-open");
    setTimeout(() => { root.hidden = true; }, reduced ? 0 : 400);
    lastFocus?.focus?.();
  }

  function progress(step) {
    const p = Math.min(1, step / TOTAL);
    bar.style.transform = `scaleX(${p})`;
    stepLabel.textContent = step >= TOTAL ? "Brief complete" : `Step ${Math.min(step + 1, TOTAL)} of ${TOTAL}`;
  }

  /* --------------------------------------------------------------- messages */
  const scroll = () => log.scrollTo({ top: log.scrollHeight, behavior: reduced ? "auto" : "smooth" });

  async function say(text, { delay } = {}) {
    const typing = el("div", "msg msg--bot msg--typing");
    typing.innerHTML = "<span></span><span></span><span></span>";
    log.append(typing); scroll();
    await wait(delay ?? Math.min(1400, 450 + text.length * 12));
    typing.remove();
    const m = el("div", "msg msg--bot");
    m.textContent = text;
    log.append(m); scroll();
    await wait(180);
    return m;
  }
  function you(text) {
    const m = el("div", "msg msg--you");
    m.textContent = text;
    log.append(m); scroll();
  }
  function clearDock() { dock.replaceChildren(); }
  // "Back" link under every answer box after the first question.
  function backButton(reject) {
    if (stepIdx === 0) return;
    const b = el("button", "dock-back mono", "← Back");
    b.type = "button";
    b.addEventListener("click", () => { clearDock(); reject(BACK); });
    dock.append(b);
  }

  /* ----------------------------------------------------------------- inputs */
  function ask({ type = "text", placeholder = "", optional = false, validate, autocomplete, value = "" }) {
    return new Promise((resolve, reject) => {
      clearDock();
      const form = el("form", "dock-form");
      const input = type === "textarea" ? el("textarea", "dock-input") : el("input", "dock-input");
      if (type !== "textarea") input.type = type;
      if (type === "textarea") input.rows = 3;
      input.placeholder = placeholder;
      input.value = value;
      if (autocomplete) input.autocomplete = autocomplete;
      input.setAttribute("aria-label", placeholder);
      const send = el("button", "dock-send");
      send.type = "submit"; send.setAttribute("aria-label", "Send"); send.innerHTML = "<span aria-hidden='true'>↑</span>";
      const err = el("p", "dock-err mono");
      form.append(input, send);
      dock.append(form);
      if (optional) {
        const skip = el("button", "dock-skip mono", "Skip");
        skip.type = "button";
        skip.addEventListener("click", () => { clearDock(); resolve(""); });
        dock.append(skip);
      }
      dock.append(err);
      backButton(reject);
      if (type === "textarea") input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const v = input.value.trim();
        if (!v && optional) { clearDock(); return resolve(""); }
        const problem = !v ? "Please type an answer." : validate?.(v);
        if (problem) { err.textContent = problem; input.focus(); return; }
        clearDock(); you(v); resolve(v);
      });
      setTimeout(() => input.focus({ preventScroll: true }), 50);
    });
  }

  function choose(options, { multi = false, other = false, preselect = [], cta = "Continue" } = {}) {
    return new Promise((resolve, reject) => {
      clearDock();
      const wrap = el("div", "dock-choices");
      const prevOther = preselect.find((o) => o.startsWith("Other: "));
      const picked = new Set(preselect.filter((o) => options.includes(o)));
      const chips = options.map((o) => {
        const b = el("button", "dock-chip", o);
        b.type = "button";
        b.setAttribute("aria-pressed", String(picked.has(o)));
        b.addEventListener("click", () => {
          if (!multi) { clearDock(); you(o); return resolve([o]); }
          picked.has(o) ? picked.delete(o) : picked.add(o);
          b.setAttribute("aria-pressed", String(picked.has(o)));
          go.disabled = !picked.size && !otherInput?.value.trim();
        });
        return b;
      });
      wrap.append(...chips);
      let otherInput;
      if (other) {
        const ob = el("button", "dock-chip dock-chip--other", "Other");
        ob.type = "button"; ob.setAttribute("aria-pressed", "false");
        otherInput = el("input", "dock-input dock-other");
        otherInput.placeholder = "Please describe";
        otherInput.hidden = !prevOther;
        if (prevOther) { otherInput.value = prevOther.slice(7); ob.setAttribute("aria-pressed", "true"); }
        ob.addEventListener("click", () => {
          const on = otherInput.hidden;
          otherInput.hidden = !on; ob.setAttribute("aria-pressed", String(on));
          if (on) otherInput.focus(); else otherInput.value = "";
          go.disabled = !picked.size && !otherInput.value.trim();
        });
        otherInput.addEventListener("input", () => { go.disabled = !picked.size && !otherInput.value.trim(); });
        wrap.append(ob);
        dock.append(wrap, otherInput);
      } else dock.append(wrap);
      const go = el("button", "dock-go", cta);
      go.type = "button"; go.disabled = multi && !picked.size && !prevOther;
      if (multi) dock.append(go);
      backButton(reject);
      go.addEventListener("click", () => {
        const out = [...picked];
        const o = otherInput?.value.trim();
        if (o) out.push(`Other: ${o}`);
        if (!out.length) return;
        clearDock(); you(out.join(" · ")); resolve(out);
      });
      setTimeout(() => chips[0]?.focus({ preventScroll: true }), 50);
    });
  }

  function pickDate(value = "") {
    return new Promise((resolve, reject) => {
      clearDock();
      const form = el("form", "dock-form");
      const input = el("input", "dock-input");
      input.type = "date";
      input.min = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      input.setAttribute("aria-label", "Delivery date");
      input.value = value;
      const send = el("button", "dock-send"); send.type = "submit"; send.setAttribute("aria-label", "Send"); send.innerHTML = "<span aria-hidden='true'>↑</span>";
      const err = el("p", "dock-err mono");
      form.append(input, send); dock.append(form, err);
      backButton(reject);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!input.value) { err.textContent = "Pick a date, or close and come back later."; return; }
        const d = new Date(input.value + "T12:00:00");
        const nice = d.toLocaleDateString(undefined, { weekday: "short", month: "long", day: "numeric", year: "numeric" });
        clearDock(); you(nice); resolve({ iso: input.value, nice, days: Math.round((d - Date.now()) / 86400000) });
      });
      setTimeout(() => input.focus({ preventScroll: true }), 50);
    });
  }

  async function scan(url) {
    const card = el("div", "msg msg--bot scan");
    const host = url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    card.innerHTML = `<p class="scan-host mono"></p><ol class="scan-steps"></ol><span class="scan-bar"><i></i></span>`;
    card.querySelector(".scan-host").textContent = host;
    log.append(card); scroll();
    const steps = card.querySelector(".scan-steps");
    for (const s of ["Scanning site", "Learning about your offering", "Analyzing customer positioning"]) {
      const li = el("li", "", s);
      steps.append(li); scroll();
      await wait(1100);
      li.classList.add("is-done");
    }
    card.classList.add("is-done");
    await wait(300);
  }

  /* ------------------------------------------------------------------- flow */
  const first = () => (data.name || "").split(/\s+/)[0];

  // One entry per question. Going back trims the chat to where that step began and re-asks it,
  // with the previous answer filled in.
  const STEPS = [
    async () => {
      await say("Let's start with you. What's your first and last name?");
      data.name = await ask({ placeholder: "First and last name", autocomplete: "name", value: data.name, validate: (v) => (v.split(/\s+/).length < 2 ? "Please include your first and last name." : null) });
    },
    async () => {
      await say(`Nice to meet you, ${first()}. What's the best email to reach you?`);
      data.email = await ask({ type: "email", placeholder: "you@company.com", autocomplete: "email", value: data.email, validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "That email doesn't look quite right.") });
      await say(`Got it: ${data.email}. That's where we'll follow up.`);
    },
    async () => {
      await say("And a phone number, if you'd like a call? This one's optional.");
      data.phone = await ask({ type: "tel", placeholder: "Phone number", optional: true, autocomplete: "tel", value: data.phone });
      await say(data.phone ? `Thanks. I've noted ${data.phone}.` : "No problem, email works.");
    },
    async () => {
      await say("What's the name of your company or brand?");
      data.company = await ask({ placeholder: "Company name", autocomplete: "organization", value: data.company });
    },
    async () => {
      await say(`Great. Does ${data.company} have a website or social media page you'd like us to look at? (Optional)`);
      data.website = await ask({ type: "text", placeholder: "Website or @handle", optional: true, autocomplete: "url", value: data.website });
      if (data.website) {
        await scan(data.website);
        await say(`Thanks. That gives the team useful context on ${data.company} before you meet.`);
      } else await say("All good, we'll learn about you in the meeting.");
    },
    async () => {
      await say("Which of these best describes what you're after? Pick as many as apply.");
      data.goals = await choose(GOALS, { multi: true, other: true, preselect: data.goals || [] });
      await say(
        data.goals.length > 1
          ? "That's a strong mix. A story-led approach is how we tie those goals together."
          : `Understood: ${data.goals[0].replace(/^Other: /, "")}.`,
      );
    },
    async () => {
      const recommended = [...new Set(data.goals.flatMap((g) => GOAL_TO_SERVICE[GOALS.indexOf(g)] || []))];
      await say(
        recommended.length
          ? `Based on that, I'd start with ${recommended.join(" and ")}. I've pre-selected ${recommended.length > 1 ? "them" : "it"}. Adjust as you like.`
          : "Which of our services are you most interested in? Pick as many as apply.",
      );
      data.services = await choose(SERVICES, { multi: true, other: true, preselect: data.services || recommended });
    },
    async () => {
      await say("Do you have a timeline for delivery?");
      const [hasDate] = await choose(["Yes, I have a date", "Not yet"]);
      if (hasDate.startsWith("Yes")) {
        await say("When do you need it delivered?");
        const d = await pickDate(data.deadlineIso);
        data.deadline = d.nice; data.deadlineIso = d.iso;
        await say(
          d.days < 21
            ? `${d.nice}. That's a tight turnaround, so I'll flag it as a priority for the team.`
            : `${d.nice}. That gives us around ${Math.round(d.days / 7)} weeks to do it properly.`,
        );
      } else {
        data.deadline = "Flexible / not set"; data.deadlineIso = "";
        await say("That's fine, we can map out a schedule together.");
      }
    },
    async () => {
      await say("Last one. Anything else you'd like us to know?");
      data.notes = await ask({ type: "textarea", placeholder: "Budget, references, ideas…", optional: true, value: data.notes });
    },
    async () => {
      await say("Here's your brief. Does everything look right?");
      const card = el("div", "msg msg--bot summary");
      const dl = el("dl");
      briefRows().forEach(([k, v]) => { dl.append(el("dt", "mono", k), el("dd", "", v)); });
      card.append(dl); log.append(card); scroll();
      const [ans] = await choose(["Looks good, send it", "Start over"]);
      if (ans === "Start over") throw RESTART;
    },
  ];

  const briefRows = () => [
    ["Name", data.name], ["Email", data.email], ["Phone", data.phone || "—"], ["Company", data.company],
    ["Website / social", data.website || "—"], ["Goals", data.goals.join(" · ")], ["Services", data.services.join(" · ")],
    ["Delivery", data.deadline], ["Notes", data.notes || "—"],
  ];

  async function run() {
    progress(0);
    await say("Hi there, tell us a bit about your project so we can find you the right service.", { delay: 700 });
    const marks = [];
    stepIdx = 0;
    while (stepIdx < STEPS.length) {
      marks[stepIdx] = log.children.length;
      progress(stepIdx);
      try {
        await STEPS[stepIdx]();
        stepIdx++;
      } catch (e) {
        if (e === RESTART) { log.replaceChildren(); Object.keys(data).forEach((k) => delete data[k]); return run(); }
        if (e !== BACK) throw e;
        stepIdx--;
        while (log.children.length > marks[stepIdx]) log.lastElementChild.remove();
      }
    }
    await deliver();
  }

  // Sends to every configured service; the brief counts as sent once any of them accepts it.
  async function post(url, body, json = true) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    try {
      const res = await fetch(url, { method: "POST", headers: { Accept: "application/json", ...(json ? { "Content-Type": "application/json" } : {}) }, body: json ? JSON.stringify(body) : form(body), signal: ctrl.signal });
      const out = await res.json().catch(() => ({}));
      return { ok: res.ok && String(out.success) !== "false", message: out.message || `HTTP ${res.status}` };
    } catch (e) {
      return { ok: false, message: e.name === "AbortError" ? "No response after 10 seconds" : `Network error (${e.message})` };
    } finally { clearTimeout(timer); }
  }
  function form(fields) { const f = new FormData(); Object.entries(fields).forEach(([k, v]) => f.append(k, v)); return f; }

  async function send(fields) {
    const errors = [];
    if (WEB3) {
      const r = await post("https://api.web3forms.com/submit", { access_key: WEB3, subject: fields._subject, from_name: "BLANKBOX brief", replyto: fields._replyto, ...fields });
      if (r.ok) return { outcome: "sent" };
      errors.push(`Web3Forms: ${r.message}`);
    }
    if (endpoint) {
      const r = await post(endpoint, fields, false);
      if (r.ok) return { outcome: "sent" };
      errors.push(`FormSubmit: ${r.message}`);
      if (/activat/i.test(r.message)) return { outcome: "activate", errors };
    }
    return { outcome: "error", errors };
  }

  async function deliver() {
    const sending = el("div", "msg msg--bot msg--sending");
    sending.innerHTML = '<span class="send-spin" aria-hidden="true"></span>Sending your brief…';
    log.append(sending); scroll();
    clearDock();
    const rows = briefRows();
    const subject = `New project brief: ${data.company} (${data.name})`;
    const { outcome, errors = [] } = await send({ _subject: subject, _template: "table", _captcha: "false", _replyto: data.email, ...Object.fromEntries(rows) });
    sending.remove();

    if (outcome === "sent") return success();
    if (outcome === "activate") {
      await say("Your brief is ready, but this inbox is still being activated on our side. Please send it by email for now so nothing gets missed.");
    } else {
      await say("That didn't go through, so let's make sure your brief still reaches us.");
    }
    if (errors.length) { const d = el("p", "send-why mono", errors.join(" · ")); log.append(d); scroll(); }
    clearDock();
    const mail = el("a", "dock-go", "Email my brief");
    const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
    mail.href = `mailto:${MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    mail.addEventListener("click", () => setTimeout(success, 600));
    const retry = el("button", "dock-chip", "Try sending again");
    retry.type = "button";
    retry.addEventListener("click", () => { clearDock(); deliver(); });
    const row = el("div", "dock-choices"); row.append(retry, mail);
    dock.append(row); mail.focus();
  }

  async function success() {
    clearDock();
    bar.style.transform = "scaleX(1)";
    stepLabel.textContent = "Brief sent";
    root.classList.add("is-sent");
    const card = el("div", "msg msg--bot sent-card");
    card.innerHTML = `<span class="sent-check" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg></span><p class="sent-title display">Sent!</p><p class="sent-sub mono">Your brief is with our production manager</p>`;
    log.append(card); scroll();
    await wait(900);
    await say(`Thank you, ${first()}. I have sent your brief to the production manager. They will be in touch soon to book a meeting with you and discuss next steps. We look forward to helping you bring your vision to life!`);
    const done = el("button", "dock-go", "Close");
    done.type = "button"; done.addEventListener("click", close);
    dock.append(done); done.focus();
  }

  /* ---------------------------------------------------------------- launch */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-brief-open]");
    if (!t) return;
    e.preventDefault();
    open();
  });
  if (location.hash === "#brief") open();
})();
