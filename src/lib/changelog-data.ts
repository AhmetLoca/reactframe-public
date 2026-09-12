export interface ChangelogEntry {
  date: string; // YYYY-MM-DD
  title: string;
  items: string[];
}

// Newest entry first. Add a new entry at the top whenever components ship or
// the site changes in a way users would notice — this is what powers the
// /changelog page and signals that the catalog is actively maintained.
export const changelog: ChangelogEntry[] = [
  {
    date: "2026-08-30",
    title: "App Store, eBay, Etsy & Facebook Reviews: rebuilt with theming, fractional ratings, and a demo panel",
    items: [
      "Rebuilt all 4 components with a richer feature set — light/dark/custom theming with per-color overrides, per-text font overrides, fractional star ratings, schema.org markup for SEO, and a responsive arrow offset with a light-theme shadow.",
      "Added a live demo control panel (theme, rating, review count, cards-per-view, arrows) in the Preview for each, matching the rest of the catalog's convention.",
      "All 4 now have complete code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, joining Google Reviews and Airbnb Reviews as the full social-proof carousel family.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Airbnb Reviews: rebuilt with theming, fractional ratings, and a demo panel",
    items: [
      "Rebuilt the component with a richer feature set — light/dark/custom theming with per-color overrides, per-text font overrides, fractional star ratings, schema.org markup for SEO, and a responsive arrow offset with a subtle shadow in light theme.",
      "Added a live demo control panel (theme, rating, review count, cards-per-view, arrows) in the Preview, matching the rest of the catalog's convention.",
      "Airbnb Reviews now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example.",
      "Also backported the light-theme arrow shadow to Google Reviews for consistency between the two sibling components.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Google Reviews: rebuilt with theming, fractional ratings, and a demo panel",
    items: [
      "Rebuilt the component with a richer feature set — light/dark/custom theming with per-color overrides, per-text font overrides, fractional star ratings, schema.org markup for SEO, and a responsive arrow offset.",
      "Added a live demo control panel (theme, rating, review count, cards-per-view, arrows) in the Preview, matching the rest of the catalog's convention.",
      "Google Reviews now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and an updated Usage example.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Tilt Text: rebuilt to match the latest Framer source",
    items: [
      "Rebuilt the component to match the current Framer source — dropped the shine highlight, layered shadow extrusion, and idle float/breathe animations that had drifted from it, keeping just the 3D tilt + scale-on-hover.",
      "Restored the live demo control panel (tilt strength) in the Preview, matching the Framer source, and removed the now-redundant separate Idle playground control.",
      "Tilt Text now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Particle Text: full Code tab treatment",
    items: [
      "Particle Text now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Hover Gallery: mobile layout fix, take two",
    items: [
      "The previous mobile fix shrank individual items and relied on horizontal scroll, but images could still end up clipped at the edges with no visible way to scroll.",
      "Replaced that with a single scale transform on the whole strip — below its resting width, the strip now scales down as a unit to fit the container exactly, with no cropping and no scrolling required.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Profile Flip Card: fixed hover not flipping the card",
    items: [
      "Hover was gated on the card's container width being over 480px, so it silently did nothing in the Preview's 340px-wide card — even with the demo panel's Hover switch set to On.",
      "Hover now checks actual input capability instead, so mouse users get hover-to-flip regardless of container width, while touch devices still use tap without getting stuck mid-hover.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Profile Flip Card: demo panel restored + full Code tab treatment",
    items: [
      "Restored the live demo control panel (transition style, flip on hover, tag) in the Preview, matching the original Framer source.",
      "Profile Flip Card now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Hover Gallery: fixed mobile layout",
    items: [
      "Below ~560px wide, the coverflow strip now shrinks its items and scrolls horizontally instead of clipping most of the images off-screen.",
      "The demo control panel is more compact on narrow screens so it no longer overlaps the strip.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Hover Gallery: demo panel restored + full Code tab treatment",
    items: [
      "Restored the live demo control panel (radius, gap, parallax) in the Preview, matching the original Framer source.",
      "Replaced the placeholder preview images with a real 12-photo set (equestrian, rowing, weightlifting, F1 pit crew, cycling, hiking, HYROX, sprinting, swimming, skiing, football) with titles, tags, and descriptions.",
      "Hover Gallery now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Text Scramble Pro: demo panel restored + full Code tab treatment",
    items: [
      "Restored the live demo control panel (reveal mode, loop, text color) in the Preview, matching the original Framer source, and removed the now-redundant separate playground control.",
      "Text Scramble Pro now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Accordion Cards: full Code tab treatment",
    items: [
      "Accordion Cards now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Rating Stars: demo panel restored + full Code tab treatment",
    items: [
      "Restored the live demo control panel (size, glow, label style, bar, animation, wave, theme) in the Preview, matching the original Framer source.",
      "Rating Stars now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Shooting Stars: full Code tab treatment + preview fix",
    items: [
      "Shooting Stars now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
      "Fixed the live theme/meteor-style playground in the Preview tab forcing an internal scrollbar — the preview box now fits within the iframe's height cap.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Logo Spin: full Code tab treatment",
    items: [
      "Logo Spin now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
      "Dropped the Marquee mode and switched the default to Orbit — Logo Spin is now Flat or Orbit only.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Soft Background: full Code tab treatment + live demo panel",
    items: [
      "Soft Background now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching Animated Stats and Countdown Timer.",
      "Restored the live customization panel (preset, orb count, noise, vignette) in the Preview so visitors can see the full range of the component in action.",
    ],
  },
  {
    date: "2026-08-29",
    title: "Countdown Timer: full Code tab treatment",
    items: [
      "Countdown Timer now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching Animated Stats.",
    ],
  },
  {
    date: "2026-08-29",
    title: "Usage examples on the Code tab",
    items: [
      "Added a Usage card between Install and Code showing a minimal, realistic call site for a component — separate from its full source. Starting with Animated Stats.",
    ],
  },
  {
    date: "2026-08-29",
    title: "Language and style switcher on the Code tab",
    items: [
      "The Code tab now supports switching between TypeScript/JavaScript and Tailwind/CSS variants for components that have them — starting with Animated Stats.",
      "All remaining Turkish copy across the site (paywall, install command, premium page) has been translated to English.",
    ],
  },
  {
    date: "2026-08-29",
    title: "Rebrand: Loca UI is now ReactFrame",
    items: ["New name, new logo, new domain (reactframe.com) — same library, same catalog, nothing else changes."],
  },
  {
    date: "2026-08-19",
    title: "All-Access pricing section",
    items: [
      "Added an All-Access pricing panel above the Kind Words section, flanked by scrolling columns of real component thumbnails — links through to the Premium page.",
    ],
  },
  {
    date: "2026-08-19",
    title: "Kind Words testimonial wall",
    items: [
      "Added a horizontally scrolling testimonial section right above the footer, with edge fade masks and two rows animating in opposite directions.",
    ],
  },
  {
    date: "2026-08-19",
    title: "Cookie consent, footer overhaul, and legal pages",
    items: [
      "Added a cookie consent card and Privacy Policy, Terms, Refund Policy, Accessibility, and Cookie Policy pages.",
      "Rebuilt the site footer with a 4-column layout — Products, Resources, and Legal links alongside the logo and GitHub link.",
    ],
  },
  {
    date: "2026-08-18",
    title: "Blog and Support pages",
    items: [
      "Added a Blog with markdown-rendered posts, and a Support page with a contact form (component picker, category, and direct email) backed by a Resend-powered API route.",
    ],
  },
  {
    date: "2026-08-18",
    title: "Search, price filter, and 78 new components",
    items: [
      "Migrated 78 additional components into the catalog — games (Snake, Tower Blocks, Maze Runner, Space Invaders, and more), WebGL/Three.js effects (Globe Studio, bubble cursor, cursor reveal), platform review carousels, and dozens of sections and layouts.",
      "Added a search box and a Free/Premium price filter to the components page, alongside the existing category filters.",
      "Category tabs now scroll the page back to the top when switched.",
    ],
  },
];
