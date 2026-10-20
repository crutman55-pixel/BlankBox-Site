// Typographic title cards, used wherever a verified poster has not been supplied yet.
// They are brand artwork, not stand-ins for official key art: each one only shows
// the title, the filmmaker credit and a motif drawn from the film's premise.

import { esc } from "./util.mjs";

const W = 600;
const H = 900;

const motifs = {
  // BlankBox: the box itself. A perfect square holding a single point of light.
  square: (a, id) => `
    <rect x="150" y="200" width="300" height="300" fill="none" stroke="${a}" stroke-width="1.5"/>
    <rect x="150" y="200" width="300" height="300" fill="url(#lift-${id})" opacity=".5"/>
    <circle cx="300" cy="350" r="3" fill="${a}"/>
    <circle cx="300" cy="350" r="40" fill="${a}" opacity=".06"/>
    <line x1="60" y1="350" x2="140" y2="350" stroke="${a}" stroke-width=".75" opacity=".35"/>
    <line x1="460" y1="350" x2="540" y2="350" stroke="${a}" stroke-width=".75" opacity=".35"/>`,

  // Before Us. After Us.: a memory split down the middle and mirrored.
  mirror: (a) => `
    <g opacity=".9">
      <rect x="120" y="170" width="170" height="360" fill="none" stroke="${a}" stroke-width="1.25"/>
      <rect x="310" y="170" width="170" height="360" fill="none" stroke="${a}" stroke-width="1.25" opacity=".35" stroke-dasharray="3 6"/>
      <circle cx="205" cy="350" r="56" fill="${a}" opacity=".18"/>
      <circle cx="395" cy="350" r="56" fill="none" stroke="${a}" stroke-width="1" opacity=".35"/>
    </g>
    <line x1="300" y1="130" x2="300" y2="570" stroke="${a}" stroke-width=".75" opacity=".5"/>`,

  // Voices: a waveform built from many single lines.
  wave: (a) => {
    let out = "";
    const n = 61;
    for (let i = 0; i < n; i++) {
      const x = 90 + i * (420 / (n - 1));
      const t = i / (n - 1);
      const env = Math.sin(Math.PI * t);
      const h = 12 + env * (150 + 70 * Math.sin(i * 1.7) * Math.cos(i * 0.6));
      out += `<line x1="${x.toFixed(1)}" y1="${(350 - h / 2).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(350 + h / 2).toFixed(1)}" stroke="${a}" stroke-width="1.6" stroke-linecap="round" opacity="${(0.35 + env * 0.65).toFixed(2)}"/>`;
    }
    return out;
  },

  // Two's a Party: two figures. One of them shouldn't be there.
  pair: (a) => `
    <circle cx="230" cy="350" r="70" fill="none" stroke="#ece8e0" stroke-width="1.25" opacity=".55"/>
    <circle cx="370" cy="350" r="70" fill="${a}"/>
    <circle cx="370" cy="350" r="120" fill="${a}" opacity=".08"/>
    <line x1="80" y1="520" x2="520" y2="520" stroke="#ece8e0" stroke-width=".75" opacity=".2"/>`,
};

function splitTitle(title) {
  // Break long titles onto two lines, preferring sentence breaks ("Before Us. / After Us.").
  if (title.length <= 12) return [title];
  const dot = title.indexOf(". ");
  if (dot > 0) return [title.slice(0, dot + 1), title.slice(dot + 2)];
  const words = title.split(" ");
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export function titleCard(film, { id = film.slug } = {}) {
  const a = film.theme.accent;
  const ink = film.theme.ink;
  const lines = splitTitle(film.title);
  const size = lines.length > 1 ? 64 : 84;
  const y0 = lines.length > 1 ? 676 : 712;
  const meta = [film.year, film.format].filter(Boolean).join(" · ");
  const titleText = lines
    .map((l, i) => `<tspan x="300" y="${y0 + i * (size * 1.02)}">${esc(l)}</tspan>`)
    .join("");

  return `<svg class="titlecard" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(film.title)}, a film by ${esc(film.filmmaker)}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow-${id}" cx="50%" cy="38%" r="70%">
      <stop offset="0" stop-color="${a}" stop-opacity=".16"/>
      <stop offset=".55" stop-color="${ink}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="lift-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${a}" stop-opacity=".12"/>
      <stop offset="1" stop-color="${a}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${ink}"/>
  <rect width="${W}" height="${H}" fill="url(#glow-${id})"/>
  ${motifs[film.theme.motif](a, id)}
  <text x="300" y="86" text-anchor="middle" class="tc-mono" fill="#ece8e0" opacity=".6" font-size="13" letter-spacing="5">A ${esc(film.filmmaker.toUpperCase())} FILM</text>
  <text text-anchor="middle" class="tc-serif" fill="#ece8e0" font-size="${size}">${titleText}</text>
  ${meta ? `<text x="300" y="838" text-anchor="middle" class="tc-mono" fill="${a}" font-size="12" letter-spacing="4">${esc(meta.toUpperCase())}</text>` : ""}
  <g stroke="#ece8e0" stroke-width="1" opacity=".35" fill="none">
    <path d="M24 48 V24 H48"/><path d="M552 24 H576 V48"/><path d="M24 852 V876 H48"/><path d="M552 876 H576 V852"/>
  </g>
</svg>`;
}
