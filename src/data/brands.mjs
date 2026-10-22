// Commercial and branded work. Edit this file, then run `npm run build`.
//
// reel: a YouTube video ID for the commercial reel (e.g. "X3jv-9FzKEU"), or null to show the
//       "coming soon" slate.
// credits: one object per commercial credit, newest first:
//   {
//     brand: "Brand name",
//     title: "Campaign or spot title",
//     year: 2026,
//     role: "Production",            // BlankBox's role on the job
//     agency: "Agency name",         // optional
//     image: "brands/my-spot.webp",  // optional, a still in src/assets/brands/
//     video: "YOUTUBE_ID",           // optional
//     link: "https://...",           // optional
//   }
// Only list work BlankBox (or its team) actually produced, with permission to show it.

export const brands = {
  // Headline numbers. `value` counts up from zero; `suffix` follows it ("M", "+").
  stats: [
    { value: 2, suffix: "M", label: "Views generated to date" },
    { value: 15, suffix: "+", label: "Professional creatives" },
  ],
  // Client logos: transparent PNGs in src/assets/clients/.
  clients: [
    { name: "Toronto Regional Real Estate Board", logo: "clients/trreb.png" },
    { name: "Pickleplex Social Club", logo: "clients/pickleplex.png" },
    { name: "TEDx", logo: "clients/tedx.png" },
    { name: "LUG", logo: "clients/lug.png" },
    { name: "Western Mustangs", logo: "clients/western-mustangs.png", knockout: true },
  ],
  reel: null,
  credits: [],
};
