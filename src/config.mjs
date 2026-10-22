// Site-wide settings. Edit these values, then run `npm run build`.

export const site = {
  name: "BLANKBOX ENTERTAINMENT",
  shortName: "BlankBox",
  // Full public URL once a domain is connected (no trailing slash).
  // Used for canonical links, sitemap and social previews.
  url: "https://crutman55-pixel.github.io/BlankBox-Site",
  // Set to your custom domain (e.g. "blankbox.com") to have the build write a CNAME file.
  domain: "",
  description:
    "BLANKBOX ENTERTAINMENT is a film and television company built for the evolving entertainment landscape. We focus on bold concepts and IP with compelling stories.",
  // Contact email shown on the Contact page and used by the contact form.
  // Leave empty to hide the form and route visitors to LinkedIn instead.
  contactEmail: "",
  // Work-with-us form: enquiries are emailed via FormSubmit.co.
  formEndpoint: "https://formsubmit.co/ajax/crutman55@gmail.com",
  location: "Canada",
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/cole-rutman-b57327254/" },
    { label: "IMDb", href: "https://www.imdb.com/name/nm16290719/" },
  ],
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Our Work", href: "/work/" },
  { label: "Brands", href: "/brands/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];
