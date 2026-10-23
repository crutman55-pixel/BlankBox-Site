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
    { value: 4.5, suffix: "M", label: "Views generated to date" },
    { value: 15, suffix: "+", label: "Professional creatives enlisted" },
  ],
  // Client logos: transparent PNGs in src/assets/clients/.
  clients: [
    { name: "Toronto Regional Real Estate Board", logo: "clients/trreb.webp" },
    { name: "Pickleplex Social Club", logo: "clients/pickleplex.webp" },
    { name: "TEDx", logo: "clients/tedx.png" },
    { name: "LUG", logo: "clients/lug.webp" },
    { name: "Western Mustangs", logo: "clients/western-mustangs.webp", knockout: true },
    { name: "EZE Entertainment", logo: "clients/eze.png" },
    { name: "Post City Magazines", logo: "clients/post-city.webp", knockout: true, large: true },
    { name: "Moonlight Studio", logo: "clients/moonlight-studio.png", large: true },
  ],
  // YouTube videos shown in the "See it in motion" section (id from the watch URL; start in seconds).
  youtube: [{ id: "EnVp_KTusrA", start: 7, label: "TEDxWesternU", cover: "img/tedx-cover.webp", logo: "clients/tedx.png" }],
  reel: null,
  credits: [],
};
