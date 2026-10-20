// Portfolio data. Every fact here is drawn from a source listed in `sources`.
// Do not add synopsis text, credits or festival claims without a source.
// See ASSETS.md for poster/still status and attribution.
//
// Posters: drop an approved image at src/assets/posters/<slug>.jpg (or .webp/.png)
// and the build uses it automatically. Until then a typographic title card is shown.
// Trailers: set `trailer` to a YouTube video ID once a verified link is available.

export const films = [
  {
    slug: "blankbox",
    title: "BlankBox",
    year: 2026,
    format: "Short film",
    runtime: "30 min",
    genres: ["Drama", "Science fiction", "Romance", "Fantasy"],
    filmmaker: "Cole Rutman",
    tagline: "A world without pain. A world without love.",
    logline:
      "In a near future where an AI promises a painless existence, a teenager named Noah Price must protect the one thing BlankBox is designed to erase: love.",
    synopsis: [
      "An artificial intelligence called BlankBox promises humanity a perfect existence by eliminating every hardship. Inside that promise, a teenager named Noah Price tries to hold on to love, the one thing BlankBox is built to erase.",
    ],
    credits: [
      { role: "Written, directed & produced by", name: "Cole Rutman" },
      { role: "Cinematography", name: "Cole Rutman" },
      { role: "Executive producer", name: "Ben Naroditsky" },
      { role: "Production company", name: "RMN Media" },
    ],
    cast: [
      { name: "Natan Halili", character: "Noah Price" },
      { name: "Pherroz Ansari" },
      { name: "Don Ku" },
      { name: "Agasti Kulkarni" },
    ],
    facts: [
      { label: "Release", value: "17 February 2026 (Canada)" },
      { label: "Country", value: "Canada" },
    ],
    links: [
      { label: "IMDb", href: "https://www.imdb.com/title/tt38279534/" },
      { label: "Letterboxd", href: "https://letterboxd.com/film/blankbox/" },
    ],
    trailer: null,
    theme: { accent: "#c9d2d8", ink: "#0b0d0f", motif: "square" },
    sources: [
      "https://www.imdb.com/title/tt38279534/",
      "https://letterboxd.com/film/blankbox/",
    ],
  },
  {
    slug: "before-us-after-us",
    title: "Before Us. After Us.",
    year: 2024,
    format: "Short film",
    runtime: "15 min",
    genres: ["Drama", "Thriller"],
    filmmaker: "Cole Rutman",
    tagline: "Some memories don't want to be found.",
    logline:
      "After an accident takes her memory, a young woman pieces together the events that led her there.",
    synopsis: [
      "After an accident leaves her without her memory, Jersey begins to reconstruct, piece by piece, the events that led to it.",
    ],
    credits: [
      { role: "Written & directed by", name: "Cole Rutman" },
      { role: "Producer", name: "Jack Kukolic" },
      { role: "Executive producer", name: "Cole Rutman" },
      { role: "Director of photography", name: "Michal Kedzierski" },
      { role: "Editor", name: "Amanda Hacksel" },
      { role: "Music", name: "David Han" },
      { role: "Assistant directors", name: "Emily Lindgreen, Eden Wassermann" },
      { role: "Studio", name: "Oakwood Films" },
    ],
    cast: [
      { name: "Sofia Farahani", character: "Jersey" },
      { name: "LJ Beaupré", character: "Benji" },
      { name: "Samantha Cox", character: "Nessa" },
      { name: "Natan Halili", character: "Adam" },
    ],
    facts: [
      { label: "Digital release", value: "15 September 2024 (YouTube)" },
      { label: "Festival", value: "WUFS Film Festival, March 2025" },
      { label: "Country", value: "Canada" },
    ],
    links: [
      { label: "IMDb", href: "https://www.imdb.com/title/tt32744669/" },
      { label: "Letterboxd", href: "https://letterboxd.com/film/before-us-after-us/" },
      { label: "Oakwood Films", href: "https://www.oakwoodfilms.ca/before-us-after-us" },
    ],
    trailer: null,
    theme: { accent: "#c8a690", ink: "#100c0b", motif: "mirror" },
    sources: [
      "https://letterboxd.com/film/before-us-after-us/",
      "https://www.oakwoodfilms.ca/before-us-after-us",
      "https://www.imdb.com/title/tt32744669/",
      "Official poster (supplied by Cole Rutman)",
    ],
  },
  {
    slug: "where-we-lie",
    title: "Where We Lie",
    year: 2024,
    format: "Short film",
    runtime: null,
    genres: [],
    filmmaker: "Cole Rutman",
    tagline: "Two brothers. No one else.",
    logline:
      "James and Lyle Boyd are brothers living alone in the south end of Detroit, Michigan, and Lyle, still a teenager, is facing possible prison time for theft.",
    synopsis: [
      "James and Lyle Boyd are brothers who live alone in the south end of Detroit, Michigan. Lyle, a teenager, is facing possible prison time for theft.",
    ],
    credits: [{ role: "Written, directed & produced by", name: "Cole Rutman" }],
    cast: [],
    facts: [
      { label: "Setting", value: "Detroit, Michigan" },
      { label: "Watch", value: "Full film on YouTube" },
    ],
    links: [{ label: "Watch on YouTube", href: "https://www.youtube.com/watch?v=X3jv-9FzKEU" }],
    trailer: "X3jv-9FzKEU",
    videoLabel: "Watch the film",
    theme: { accent: "#c08a5a", ink: "#0b0a0a", motif: "bridge" },
    sources: ["https://www.youtube.com/watch?v=X3jv-9FzKEU", "Biography and poster supplied by Cole Rutman"],
  },
  {
    slug: "voices",
    title: "Voices",
    year: 2023,
    format: "Documentary",
    runtime: null,
    genres: ["Documentary"],
    filmmaker: "Cole Rutman",
    tagline: "The war, in the words of those who left it.",
    logline:
      "Ukrainian newcomers to Canada share, in their own words, how the war has changed their lives.",
    synopsis: [
      "Voices brings together interviews with Ukrainian refugees, from children to adults, who describe the impact the war has had on their lives.",
      "Cole Rutman began the project after the full-scale invasion in February 2022. He pitched it to Western University's Arts and Humanities Student Donation Fund and recruited a crew of 25 students through the faculty's internship program. Its first screening, in Toronto, drew about 100 people, and it was later shown in Western's McKellar Room to an audience that included Ukrainian newcomers.",
    ],
    credits: [
      { role: "Directed & produced by", name: "Cole Rutman" },
      { role: "Crew", name: "25 Western University students" },
    ],
    cast: [],
    facts: [
      { label: "Full title", value: "A Voices Documentary: Ukrainians Finding Safety in Canada" },
      { label: "Premiere", value: "Toronto, 2023 (about 100 attendees)" },
      { label: "Screenings", value: "McKellar Room, Western University, November 2023" },
      { label: "Official selection", value: "Toronto International Nollywood Film Festival, 2024" },
      { label: "Official selection", value: "Fort Langley Film Festival, 2024" },
      { label: "Funding", value: "Western Arts and Humanities Student Donation Fund" },
      { label: "Country", value: "Canada" },
    ],
    links: [
      { label: "Western News", href: "https://news.westernu.ca/2023/11/voices-documentary-ukraine-western/" },
      {
        label: "Western Gazette",
        href: "https://westerngazette.ca/culture/movies_tv/western-students-create-documentary-highlighting-ukrainian-resiliency/article_669bed38-83d7-11ee-a8ae-67e54a86a315.html",
      },
    ],
    trailer: null,
    theme: { accent: "#d6c7a1", ink: "#0c0d10", motif: "wave" },
    sources: [
      "https://news.westernu.ca/2023/11/voices-documentary-ukraine-western/",
      "https://westerngazette.ca/culture/movies_tv/western-students-create-documentary-highlighting-ukrainian-resiliency/article_669bed38-83d7-11ee-a8ae-67e54a86a315.html",
    ],
  },
  {
    slug: "twos-a-party",
    title: "Two's a Party",
    year: 2025,
    format: "Short film",
    runtime: null,
    genres: ["Horror", "Thriller", "Action"],
    filmmaker: "Coen Leung",
    tagline: "The party's over. Someone stayed behind.",
    logline:
      "After a party, a young woman comes home to find it wrecked, and discovers she isn't alone.",
    synopsis: [
      "A young woman returns from a party to find her home wrecked, and comes face to face with an unexpected intruder.",
    ],
    credits: [
      { role: "Written & directed by", name: "Coen Leung" },
    ],
    cast: [
      { name: "Rachel Davis", character: "Predator" },
      { name: "Jenn Tan", character: "Prey" },
    ],
    facts: [
      { label: "Filmed in", value: "Toronto" },
      { label: "Country", value: "Canada" },
    ],
    links: [{ label: "IMDb", href: "https://www.imdb.com/title/tt37610798/" }],
    trailer: null,
    theme: { accent: "#b0322c", ink: "#0d0909", motif: "pair" },
    sources: ["https://www.imdb.com/title/tt37610798/"],
  },
];
