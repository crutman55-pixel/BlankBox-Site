# Assets, sources and attribution

This file records where every fact and image on the site comes from, and what is still missing.
Only add posters, stills or photos you have permission to use (from the filmmaker, the
production company or the rights holder). Don't copy images from IMDb or Letterboxd, because
those sites don't grant reuse rights.

## How to add images

| What | Where to put it | Notes |
|---|---|---|
| Poster | `src/assets/posters/<slug>.jpg` (`.webp` / `.png` also work) | 2:3 ratio, about 1200×1800 px. Replaces the typographic title card everywhere. |
| Production stills | `src/assets/stills/<slug>/01.jpg`, `02.jpg`, … | Wide, about 16:9 and 2000 px across. Shown in a gallery on the film page in filename order. |
| Portrait of Cole Rutman | `src/assets/img/cole-rutman.webp` (supplied), plus `cole-rutman-on-set.webp` | Portrait and on-set photo on the About page. |
| Logo | `src/assets/img/logo-mark.webp`, `logo-lockup.webp` | Official BLANKBOX logo, supplied by owner. Blacks are crushed to pure black so it blends into the page. |

Slugs: `blankbox`, `before-us-after-us`, `where-we-lie`, `voices`, `twos-a-party`.

Run `npm run build` afterwards. The build lists any assets that are still missing.

## Status by title

| Title | Facts | Poster | Stills | Trailer |
|---|---|---|---|---|
| BlankBox (2026) | Verified | Official poster (uploaded by owner) | 1 (supplied by owner) | Not found |
| Before Us. After Us. (2024) | Verified | Official poster plus an alternate (supplied by owner) | 2 (supplied by owner) | Released on YouTube on 15 Sep 2024, but no link verified yet |
| Where We Lie (2024) | From the owner's biography only. No public listing found (IMDb's "Where We Lie" is a different 2022 UK short) | Supplied by owner | Missing | Full film embedded: https://www.youtube.com/watch?v=X3jv-9FzKEU (premise taken from its YouTube description). View count not added: YouTube isn't reachable from the build environment |
| Voices (2023) | Verified, plus the full title from the screening photo | Official poster with festival laurels (uploaded by owner) | 1: screening photo (supplied by owner) | Not found |
| Two's a Party (2025) | Verified | **Missing** | Missing | Not found |

## Sources

### BlankBox
- IMDb: https://www.imdb.com/title/tt38279534/ (credits, 17 Feb 2026 Canadian release, RMN Media)
- Letterboxd: https://letterboxd.com/film/blankbox/ (premise, 30 min runtime, genres, cast)

### Before Us. After Us.
- Letterboxd: https://letterboxd.com/film/before-us-after-us/ (premise, cast, credits, release)
- Oakwood Films: https://www.oakwoodfilms.ca/before-us-after-us
- IMDb: https://www.imdb.com/title/tt32744669/

### Voices
- Western News, 9 Nov 2023: https://news.westernu.ca/2023/11/voices-documentary-ukraine-western/
- Western Gazette: https://westerngazette.ca/culture/movies_tv/western-students-create-documentary-highlighting-ukrainian-resiliency/article_669bed38-83d7-11ee-a8ae-67e54a86a315.html

### Two's a Party
- IMDb: https://www.imdb.com/title/tt37610798/ (2025 short, written and directed by Coen Leung, cast, Toronto)

### About page biography
- The biography text was supplied by the site owner. Public searches could not independently
  confirm these claims: the 18 festival selections, the Flickers' Rhode Island semi-final, the
  LA Student Film Festival finals, the Canadian Screen Awards nomination and the Scholastic Gold Key.
  Keep documentation (laurels, letters, festival pages) on file before launch.

## Original artwork
The typographic title cards (`src/lib/titlecards.mjs`), the wordmark and the favicon were
made for this site. They don't reproduce any official key art.
