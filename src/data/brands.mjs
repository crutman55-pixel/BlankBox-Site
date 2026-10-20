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
  reel: null,
  credits: [],
};
