export interface ComponentMeta {
  slug: string;
  name: string;
  description: string;
  category: string;
  free: boolean;
  /** Omitted = a regular component. "element" and "block" tag catalog
   *  entries that also show up on /elements and /blocks respectively —
   *  they're still real /components/[slug] pages, just cross-listed. */
  type?: "element" | "block";
  /** Unpublish without deleting anything: the entry disappears from every listing, page, the sitemap,
   *  llms.txt and the search palette, and the public registry file / public mirror copy are dropped
   *  on the next build / `publish:public`. The source, previews and code variants stay in the repo —
   *  remove this flag to bring the component back. */
  hidden?: boolean;
  /** Free-components trial: a prompt describing how to build this component from
   *  scratch with an AI coding assistant, copyable from a button on its detail
   *  page in place of the (absent, since it's free) Buy button. */
  prompt?: string;
}

// One entry per registry item — grows as components are migrated from the
// Frameze library into shadcn-compatible registry format. Keep in sync with
// registry.json (name/description) and the preview map in
// src/registry-preview/index.tsx.
export const allComponents: ComponentMeta[] = [
  {
    slug: "animated-stats",
    name: "Animated Stats",
    description:
      "A stat/metric row with count-up number animation, four entrance styles, and 1x4 / 2x2 / 4x1 grid layouts.",
    category: "Data",
    free: false,
  },
  {
    slug: "countdown-timer",
    name: "Countdown Timer",
    description:
      "Counts down to a duration or an absolute end date, with flip-cell digit transitions, a compact text mode, and an optional loop.",
    category: "Countdown",
    free: true,
  },
  {
    slug: "soft-background",
    name: "Soft Background",
    description:
      "An ambient animated background of drifting blurred color orbs, with mouse parallax, film grain and vignette options.",
    category: "Background",
    free: false,
  },
  {
    slug: "logo-spin",
    name: "Logo Spin",
    description:
      "A rotating logo showcase, a tilted 3D orbit or a flat 2D wheel, with hover tooltips, per-logo links, and a center title.",
    category: "Logo",
    free: false,
  },
  {
    slug: "shooting-stars",
    name: "Shooting Stars",
    description:
      "A canvas starfield with 4 color themes, twinkling multi-layer stars, mouse parallax, an optional nebula glow, and shooting stars/meteor showers in 5 tail styles.",
    category: "Background",
    free: false,
  },
  {
    slug: "cosmic-background",
    name: "Cosmic Background",
    description:
      "A canvas-powered animated night-sky background with rotating star rings, a breathing cone light, mouse parallax and film grain.",
    category: "Background",
    free: true,
  },
  {
    slug: "announcement-banner",
    name: "Announcement Banner",
    description:
      "A drop-in announcement bar with a flip-digit countdown, one-click coupon copy, a seamless ticker mode, and light/dark themes.",
    category: "Banner",
    free: false,
  },
  {
    slug: "progress-timeline",
    name: "Progress Timeline",
    description:
      "A numbered process timeline with staggered scroll-in animations, an auto-highlighting connector line, and vertical or horizontal orientation.",
    category: "Timeline",
    free: false,
  },
  {
    slug: "toggle-pro",
    name: "Toggle Pro",
    description:
      "An accessible switch with a springy squish animation on the thumb, an optional label + helper text, and a focus ring.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a controlled/uncontrolled React + Motion (Framer Motion) toggle switch component (checked, defaultChecked, onCheckedChange props) with a pill-shaped track that crossfades between an on-color and off-color background, and a round thumb that slides across using a spring animation. As the thumb slides, squish it horizontally (scale it wider and shorter mid-transition, like a springy blob) before it settles back to a circle, driven by Motion's spring physics, not a linear ease. Support an optional label positioned left or right of the switch (clicking the label toggles it), helper text below, a disabled state that dims the whole control, and a visible focus ring for keyboard users. Expose track-on-color, track-off-color, thumb-color, and ring-color as props so it's easy to re-theme.",
  },
  {
    slug: "badges-kit",
    name: "Badges Kit",
    description:
      "A status badge with 8 tone presets, light/dark variants, 3 sizes, 6 icon styles, and an optional dismiss button.",
    category: "Badge",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS status badge component with a `tone` prop offering 8 semantic color presets (neutral, success, error, warning, info, purple, orange, indigo) plus a `custom` tone that accepts caller-supplied colors, each with distinct light and dark palettes (background, text, border/dot colors tuned per tone, not just opacity tricks on one base color). Support a `size` prop with at least 3 steps (small/medium/large) that scale padding, font size, and icon size together. Add an `icon` prop with several built-in styles, check, cross, minus, dot, and a spinning loader, rendered as small inline SVGs before the label, plus a `none` option and support for a fully custom icon node. Add an optional dismiss (×) button on the right that fires an onDismiss callback. Keep the whole thing a single inline-flex pill that never wraps its content.",
  },
  {
    slug: "rating-stars",
    name: "Rating Stars",
    description:
      "An animated star rating input with half-star precision, keyboard support, a dynamic color range, and an optional progress bar.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS star rating input called RatingStars using motion (motion/react), clsx and tailwind-merge. Requirements: `maxStars` (default 5), controlled (`value`) or uncontrolled (`defaultValue`, default 3) with an `onRatingChange(value)` callback; `allowHalf` (default true) so hovering or clicking the left half of a star gives x.5 and the right half gives a full star; `readOnly` mode with no hover or click; live hover preview that reverts on mouse leave. Star sizes via `sizePreset` (xs 20, sm 28, md 40 default, lg 56, xl 72, custom uses `starSize`) plus `gap` (default 8), `strokeWidth` (default 1.5), `fillColor` (default #F5C518) and `emptyColor` (default #9CA3AF); half stars are drawn with a 50% linear-gradient fill. Optional `colorRange` that interpolates the fill color between `colorLow` (#EF4444), `colorMid` (#F5C518) and `colorHigh` (#22C55E) based on rating / maxStars; optional glow (`showGlow`, `glowSize` default 8) via drop-shadow. A label (`showLabel`, `labelPosition` right | left | top | bottom, `labelStyle` score \"3.5\" | fraction \"3.5 / 5\" | percent | label (Terrible, Poor, Fair, Good, Excellent), `fontSize`, `textColor`) and optional review count in parentheses (`showReviewCount`, `reviewCount` default 1284). An optional progress bar under the stars (`showBar`, `barHeight`, `barRadius`, `barTrackColor`) that fills to the current rating. Animations (`animated` default true): stars spring-scale on hover (1.2) and tap (0.9), pop with a small scale/rotate wiggle when filled, and clicking emits a burst of 8 small dots; `animStyle` instant | wave (wave staggers each star by 70 ms). Accessibility: the star row is role=\"slider\" with aria-valuemin/max/now and aria-valuetext (\"3 out of 5 stars\"), focusable, and supports ArrowLeft/Down and ArrowRight/Up (step 0.5 or 1), Home and End; each star has role=\"radio\" with an aria-label. Fully typed in TypeScript, accept className.",
  },
  {
    slug: "image-deck-3d",
    name: "Image Deck 3D",
    description:
      "A single image split into a stacked deck of shape-clipped layers (rectangle, circle, hexagon, star, blob and more) that fans out on hover, with optional 3D cursor tilt, parallax, grayscale grading, and ambient idle rotation.",
    category: "Effect",
    free: true,
  },
  {
    slug: "glare-card",
    name: "Glare Card",
    description:
      "A 3D tilt card that reacts to the cursor with animated conic-gradient reflections, diamond, holographic or aurora reflex styles.",
    category: "Card",
    free: true,
  },
  {
    slug: "linear-progress",
    name: "Linear Progress",
    description:
      "A labeled progress bar with a gradient fill, shimmer sweep, milestone ticks, and glow/dot/line cap styles.",
    category: "Data",
    type: "element",
    free: true,
    hidden: true,
    prompt:
      "Build a React + Tailwind CSS single linear progress bar component called LinearProgress using motion (motion/react), clsx and tailwind-merge, designed for a dark background (light text #f5f4f1, track #1a1a1a). Requirements: required `value` (0-100, clamped); optional `label`, `labelSub` (muted text beside the label), `valueLabel` (custom right-side text) and an `icon` ReactNode; `colorStart`/`colorEnd` (both default #0A0A0A; a gradient only when they differ); `height` (default 8); a pill track with a subtle top-highlight gradient on the fill; `capStyle` at the fill's leading edge (none default | glow | dot | line); `shimmer` (default false) a looping white sweep across the fill; `milestones` = N draws N-1 thin tick marks on the track; a `subtitle` line below; `inline` layout (label, bar, value and icon on one row); `duration` (default 1.2s) with ease [0.25, 0.46, 0.45, 0.94]. `revealOnScroll` (default true) keeps the fill at 0% until the bar enters the viewport (useInView, once, amount 0.15). `valueStyle`: side (percentage text next to the label, default) | chip (a floating rounded pill with a small pointer that tracks the fill's leading edge above the bar) | none; `countUp` (default true) animates the displayed percentage from 0 with easeOutCubic over `duration`. Optional `thresholds` ({ lowMax, lowColor, midMax, midColor, highColor }) that overrides the colors by value (below lowMax, below midMax, otherwise high). Optional `completionPulse` that plays a fading pulsing ring around the track once, shortly after the fill reaches 100%. Accessible: the track has role=\"progressbar\" with aria-valuenow/min/max and aria-label. Extends div props, accepts className, fully typed in TypeScript.",
  },
  {
    slug: "world-map-arc",
    name: "World Map Arc",
    description:
      "An animated world map with flight-path arcs between cities, hover route cards, dot/flat map styles, bracket/glow pins, and 7 theme presets.",
    category: "Data",
    free: false,
  },
  {
    slug: "infinite-marquee",
    name: "Infinite Marquee",
    description:
      "A seamless scrolling text marquee with solid/gradient/outline text styles, a separator, double-row mode, and edge fade.",
    category: "Marquee",
    free: true,
  },
  {
    slug: "whatsapp-widget",
    name: "WhatsApp Widget",
    description:
      "A WhatsApp-style chat bubble widget with a typing simulation, quick replies, a notification popup, and availability status.",
    category: "Social Media Widget",
    free: false,
  },
  {
    slug: "discord-chat-widget",
    name: "Discord Chat Widget",
    description:
      "A Discord-style chat bubble widget with a typing simulation, quick replies, member/online counts, and a launch-invite send flow.",
    category: "Social Media Widget",
    free: true,
  },
  {
    slug: "telegram-widget",
    name: "Telegram Widget",
    description:
      "A Telegram-style chat bubble widget with a typing simulation, quick replies, a notification popup, and availability status.",
    category: "Social Media Widget",
    free: true,
  },
  {
    slug: "messenger-widget",
    name: "Messenger Widget",
    description:
      "A Facebook Messenger-style chat bubble widget with a typing simulation, quick replies, a notification popup, and availability status.",
    category: "Social Media Widget",
    free: true,
  },
  {
    slug: "instagram-widget",
    name: "Instagram Widget",
    description:
      "An Instagram Direct-style chat bubble widget with a story-ring avatar, typing simulation, quick replies, and a notification popup.",
    category: "Social Media Widget",
    free: false,
  },
  {
    slug: "x-twitter-widget",
    name: "X (Twitter) Widget",
    description:
      "An X (Twitter)-style DM chat bubble widget with a typing simulation, quick replies, a follows-you badge, availability status, and a notification popup.",
    category: "Social Media Widget",
    free: true,
  },
  {
    slug: "footer-premium",
    name: "Footer Premium",
    description:
      "A responsive site footer with a logo, description, social links, multi-column link groups, dark/light theming, and a copyright line.",
    category: "Footer",
    type: "block",
    free: true,
  },
  {
    slug: "footer-section",
    name: "Footer Section",
    description:
      "A minimal site footer with up to 4 link columns, a hover-underline link style, dark/light/custom theming, and a copyright bar.",
    category: "Footer",
    type: "block",
    free: true,
  },
  {
    slug: "footer-columns",
    name: "Footer Columns",
    description:
      "A logo + description footer with social icons, up to 4 link columns, a secondary bottom bar, and a back-to-top button.",
    category: "Footer",
    type: "block",
    free: false,
  },
  {
    slug: "footer-cta",
    name: "Footer CTA",
    description:
      "A call-to-action panel, abstract mark, two-tone headline, subtext and pill button, combined with a minimal link footer and copyright bar.",
    category: "Footer",
    type: "block",
    free: false,
  },
  {
    slug: "footer-wordmark",
    name: "Footer Wordmark",
    description:
      "A premium site footer with a giant brand wordmark that auto-fits the width and bleeds off the bottom edge, plus logo, social links, and up to 4 columns.",
    category: "Footer",
    type: "block",
    free: false,
  },
  {
    slug: "testimonial-slider",
    name: "Testimonial Slider",
    description:
      "A refined split-panel testimonial slider, light/dark, 3 transition effects, a giant decorative quote mark, and autoplay progress.",
    category: "Testimonial",
    free: false,
  },
  {
    slug: "team-drawer",
    name: "Team Drawer",
    description:
      "A team grid where clicking a card opens a full-bio side or bottom drawer with tags, socials, and keyboard navigation between members.",
    category: "Team",
    free: false,
  },
  {
    slug: "hover-scan-card",
    name: "Hover Scan Card",
    description:
      "A product card that renders as a halftone dot pattern until a laser-sweep animation reveals the real photo and content on hover.",
    category: "Card",
    free: true,
    hidden: true,
  },
  {
    slug: "accordion-cards",
    name: "Accordion Cards",
    description:
      "An interactive card accordion, hover to expand, with a cursor-tracked glow, image parallax, and staggered content reveal.",
    category: "Card",
    free: false,
  },
  {
    slug: "compare-slider",
    name: "Compare Slider",
    description:
      "A theme-aware before/after image comparison slider with horizontal or vertical drag direction, keyboard support, and before/after labels.",
    category: "Card",
    free: true,
  },
  {
    slug: "glow-card",
    name: "Glow Card",
    description:
      "A card with an animated rotating conic-gradient glow border, customizable colors, text position, and an optional background image.",
    category: "Card",
    free: true,
  },
  {
    slug: "image-showcase",
    name: "Image Showcase",
    description:
      "A product-style image viewer, a large main frame with prev/next arrows and an image counter, backed by a click-to-jump thumbnail strip and a reset-to-first button.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "gallery-lightbox",
    name: "Gallery Lightbox",
    description:
      "A theme-aware image gallery grid with a fullscreen lightbox, click-to-zoom, arrow-key navigation, Escape to close, and body scroll lock.",
    category: "Card",
    free: false,
  },
  {
    slug: "eternal-glow-card",
    name: "Eternal Glow Card",
    description:
      "A hover-reveal product card with a blurred gradient overlay, staggered title/price/description reveal, a badge, and 5 color themes.",
    category: "Card",
    free: true,
  },
  {
    slug: "card-carousel",
    name: "Card Carousel",
    description:
      "A cinematic featured-card carousel, one wide active card with a filmstrip of neighbor slivers, staggered text reveal, hover parallax, autoplay, and touch/keyboard navigation.",
    category: "Card",
    free: false,
  },
  {
    slug: "hover-gallery",
    name: "Hover Gallery",
    description:
      "A 3D coverflow-style image gallery, hovering tilts neighboring images into a perspective fan around the highlighted one, with click-to-expand or a fullscreen lightbox.",
    category: "Card",
    free: false,
  },
  {
    slug: "flowing-menu",
    name: "Flowing Menu",
    description:
      "A full-bleed nav menu where hovering a row slides a colored panel in from the nearest edge, revealing a horizontally scrolling marquee of the item's label (and optional image chips).",
    category: "Menu",
    free: false,
  },
  {
    slug: "glass-navigation",
    name: "Navbar 02",
    description:
      "A pill navbar that expands into a full panel of large nav links, a tagline, and social links, with a CTA button, badges, active-page highlight, and light/dark theming.",
    category: "Navbar",
    free: true,
  },
  {
    slug: "header-simple",
    name: "Navbar 01",
    description:
      "A responsive site header, centered nav links on desktop, a tablet CTA-only view, and a mobile hamburger dropdown panel, with active-page highlighting and optional sticky positioning.",
    category: "Navbar",
    free: true,
  },
  {
    slug: "navbar-menu",
    name: "Navbar Menu",
    description:
      "A floating pill navbar with spring-animated dropdown menus, simple link lists or product card grids, in paper/glass/custom theming.",
    category: "Navbar",
    free: false,
  },
  {
    slug: "testimonial-wall",
    name: "Testimonial Wall",
    description:
      "A multi-row flowing testimonial wall with 1 to 3 independently-paced tracks, horizontal or vertical flow, edge masking, and pause-on-hover.",
    category: "Testimonial",
    type: "block",
    free: false,
  },
  {
    slug: "testimonial-spotlight",
    name: "Testimonial Spotlight",
    description:
      "A full-bleed photo testimonial slider with crossfade, slide or iris transitions, a thumbnail strip, progress lines, star ratings, and autoplay.",
    category: "Testimonial",
    free: true,
  },
  {
    slug: "testimonial-pills",
    name: "Testimonial Pills",
    description:
      "Avatar-and-pill testimonial marquee rows with dual-direction scrolling, a depth effect, cursor spotlight glow, and scroll-in reveal.",
    category: "Testimonial",
    free: true,
  },
  {
    slug: "testimonial-video-wall",
    name: "Testimonial Video Wall",
    description:
      "A masonry wall mixing text and video testimonial cards, with a full custom video player supporting native, YouTube and Vimeo sources.",
    category: "Testimonial",
    type: "block",
    free: true,
    hidden: true,
  },
  {
    slug: "team-list",
    name: "Team List",
    description:
      "A numbered team list with expandable bios, a ghost-reveal name animation, an optional portrait, and social links.",
    category: "Team",
    free: false,
  },
  {
    slug: "profile-flip-card",
    name: "Profile Flip Card",
    description:
      "A profile card that flips from a photo front to a bio back on click or hover, with flip Y, flip X, spring, or fade transitions.",
    category: "Team",
    free: true,
  },
  {
    slug: "team-carousel",
    name: "Team Carousel",
    description:
      "A centered coverflow-style team carousel with scaled/faded side cards, drag, keyboard navigation, autoplay, and dot/counter indicators.",
    category: "Team",
    free: false,
  },
  {
    slug: "phone-marquee-showcase",
    name: "Phone Marquee Showcase",
    description:
      "A blurred, dimmed marquee of scrolling image/video rows fills the background, a sharp iPhone frame in front shows the exact same rows in perfect focus through its screen, with 3D cursor tilt and ambient glow.",
    category: "Mockup",
    free: false,
  },
  {
    slug: "phone-mockup",
    name: "Phone Mockup",
    description:
      "A realistic iPhone frame with 3D cursor tilt, a tilt-tracking screen glare, ambient glow, and a story-style video/image player with swipe navigation.",
    category: "Mockup",
    free: true,
  },
  {
    slug: "browser-mockup",
    name: "Browser Mockup",
    description:
      "A realistic browser chrome frame in macOS, Windows, or mobile Safari style, with tabs, a URL bar, and a content area for an image, video, or arbitrary children.",
    category: "Mockup",
    free: true,
  },
  {
    slug: "instagram-post-mockup",
    name: "Instagram Post Mockup",
    description:
      "A realistic Instagram post with a swipeable multi-photo carousel, double-tap-to-like heart burst, and like/comment/repost/share/save actions.",
    category: "Mockup",
    free: true,
  },
  {
    slug: "x-post-mockup",
    name: "X Post Mockup",
    description:
      "A realistic X (Twitter) post with a verified badge, media image, and interactive like/retweet/bookmark actions with live counts.",
    category: "Mockup",
    free: true,
  },
  {
    slug: "tiktok-post-mockup",
    name: "TikTok Post Mockup",
    description:
      "A full-bleed 9:16 TikTok feed mockup with a side action rail, caption overlay, sound pill, and bottom navigation.",
    category: "Mockup",
    free: true,
  },
  {
    slug: "linkedin-post-mockup",
    name: "LinkedIn Post Mockup",
    description:
      "A realistic LinkedIn post with a headline, media image, a reaction summary, and interactive like/repost actions with live counts.",
    category: "Mockup",
    free: true,
  },
  {
    slug: "cylinder-gallery",
    name: "Cylinder Gallery",
    description:
      "A 3D image gallery arranged around an auto-rotating cylinder, with configurable rows/columns, tilt angle, and rotation speed.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "gallery-expand",
    name: "Gallery Expand",
    description:
      "A grayscale-to-color image gallery where hovering expands a card and its neighbors, with cursor-tracked 3D tilt and a click-to-open detail modal.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "mood-gallery",
    name: "Mood Gallery",
    description:
      "A cinematic multi-column vertical marquee gallery with 4 moods, 11 3D perspective presets, film grain, chromatic aberration, and a click-to-open lightbox.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "gallery-flow",
    name: "Gallery Flow",
    description:
      "A gallery of scattered, gently drifting image cards with random rotation, cursor repel/attract mode, and a click-to-open lightbox.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "gallery-curve",
    name: "Gallery Curve",
    description:
      "A coverflow-style gallery arranged along a 3D curve, driven by wheel or drag, with line-indicator navigation and a keyboard-accessible lightbox.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "gallery-reveal",
    name: "Gallery Reveal",
    description:
      "A theme-aware portfolio grid where hovering reveals the title, category, year and description through a circular clip-path opening from the cursor.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "youtube-gallery",
    name: "YouTube Gallery",
    description:
      "A YouTube-style video grid with hover-scale thumbnails, a pulsing play button, channel avatar and verified badge, and a click-to-open modal player.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "skew-scroll-gallery",
    name: "Skew Scroll Gallery",
    description:
      "A 3-column masonry image gallery that skews in response to scroll velocity, the faster you scroll, the more it tilts, settling back with a spring.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "carousel-3d",
    name: "3D Carousel",
    description:
      "A 3D curved carousel with a center-focused active card, reflection effect, cursor tilt, image/video media, and drag/swipe/keyboard navigation.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "hotspot-carousel",
    name: "Hotspot Carousel",
    description:
      "A product image carousel with clickable annotated hotspots, thumbnail strip, captions, autoplay, and a keyboard-accessible fullscreen lightbox.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "rotate-carousel",
    name: "Rotate Carousel",
    description:
      "A scroll-driven radial text carousel, items curve along an invisible circle and rotate into focus as you scroll, with an optional center image, title, and CTA.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "tilted-carousel",
    name: "Tilted Carousel",
    description:
      "A 3D book-flow carousel where cards tilt around the active slide, with paper/glass themes and 3 title alignment styles.",
    category: "Carousel",
    free: true,
  },
  {
    slug: "animated-carousel",
    name: "Animated Carousel",
    description:
      "An ambient auto-rotating 3D cylinder carousel with edge fade masking, pausable on hover or spacebar, and paper/glass themes.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "diagonal-carousel",
    name: "Diagonal Carousel",
    description:
      "Square cards fan out diagonally into a stacked deck, each inactive card rotates and offsets away from the active one, with paper/glass themes.",
    category: "Carousel",
    free: true,
  },
  {
    slug: "hero-slider-carousel",
    name: "Hero Slider Carousel",
    description:
      "An e-commerce hero slider with split and full-width slide layouts, badges, CTA buttons, Ken Burns effect, ring-progress indicators, and swipe/keyboard navigation.",
    category: "eCommerce",
    type: "block",
    free: false,
  },
  {
    slug: "comparison-table",
    name: "Comparison Table",
    description:
      "A theme-aware pricing/feature comparison matrix, plan headers with a highlighted column, category-grouped rows with tooltips, a sticky header, and a stacked card layout on mobile.",
    category: "Table",
    free: false,
  },
  {
    slug: "hover-media-cards",
    name: "Hover Media Cards",
    description:
      "A row of image/video cards that expand on hover to reveal a title, staggered subtitle list, and CTA arrow, with badges, per-card overlay colors, and a tap-to-toggle accordion on mobile.",
    category: "Card",
    free: false,
  },
  {
    slug: "particle-text",
    name: "Particle Text",
    description:
      "Text rendered as a field of canvas particles that repel, attract, or swirl away from the cursor and burst apart on click, then spring back into formation.",
    category: "Background",
    free: false,
  },
  {
    slug: "tilt-text",
    name: "Tilt Text",
    description: "Large display text that tilts and scales in 3D toward the cursor, with smoothed spring-like motion and optional gradient fill.",
    category: "Typography",
    free: true,
  },
  {
    slug: "orbit-logo-wheel",
    name: "Orbit Logo Wheel",
    description:
      "A 3D carousel of client/partner logos orbiting a tilted ring, with cursor-pause, hover tooltips, depth fade for far-side logos, and a center badge.",
    category: "Logo",
    free: false,
  },
  {
    slug: "progress-circle-bars",
    name: "Progress Circle Bars",
    description:
      "A circular progress indicator with ring, gauge, and dashes arc styles, scroll-triggered count-up animation, color thresholds, a comparison target marker, and a completion pulse.",
    category: "Progress",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS circular progress component called ProgressCircleBars using motion (motion/react), clsx and tailwind-merge. Requirements: an SVG circular indicator with three arc styles via an `arcStyle` prop whose default is \"dashes\" (ring: continuous stroke, gauge: 270° open arc, dashes: N radial tick marks, default 60 via `dashCount`); size presets (2xl, xl, lg, md, sm, xs, 2xs, custom) that map to circleSize and strokeWidth, with manual `circleSize`/`strokeWidth` overrides; `percentage` (0-100, default 75) and a `label` shown above or below; `valueStyle` (center | badge | none) with `prefix`/`suffix` (default \"%\") and an optional badge with custom background/text colors; a `colorStart`/`colorEnd` gradient for the filled arc (both default to the same solid #F39C12, so the default look is a single flat color; the gradient only shows when they differ); optional color thresholds (low/mid/high with configurable max values and colors, e.g. red under 40, amber under 70, green above) that override the gradient; a customizable track (color, border width, border color); typography props for label and percentage (color, size, font family) and a `spacing` prop; `scrollReveal` that starts the animation only when the component enters the viewport (useInView, once), animating the arc fill and a count-up number over `duration` seconds after `delay`; an optional comparison marker (`comparisonEnabled`, `comparisonValue`, `comparisonColor`, thinner stroke via `comparisonStrokeScale`) drawn as a target tick/arc; and a `completionPulse` that plays a subtle pulse when the value reaches 100%. Make it accessible with role=\"img\" and an aria-label like \"Label: 75%\" (SVG marked aria-hidden), forward className and extra div props, and keep everything fully typed in TypeScript.",
  },
  {
    slug: "linear-progress-bars",
    name: "Linear Progress Bars",
    description:
      "A card of linear progress rows, plain ratio bars, file-upload rows with icons/subtitles/shimmer, milestone ticks, and an inline variant, with scroll-triggered fill animation.",
    category: "Progress",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS card of linear progress rows called LinearProgressBars using motion (motion/react), clsx and tailwind-merge. Requirements: a rounded card (props: cardBg default #ffffff, cardRadius default 20, cardBorderWidth default 0 with cardBorderColor, cardShadow default medium (none | soft | medium | strong), cardPaddingX default 32 and cardPaddingY default 28) with a `theme` prop (light | dark) and thin dividers between rows; a `rows` prop (array, with a rich default set) supporting two row kinds. (1) kind \"ratio\": label on the left, numeric value on the right, and a bar whose fill is value / maxValue, with colorStart/colorEnd gradient and height. (2) kind \"bar\": a file-upload / usage style row with optional label, labelSub (muted text after the label), labelRight (e.g. \"67%\" or \"24.8 GB / 100 GB\"), an optional info icon after the label (a small circled \"i\", not a plain dot; `showInfo`), a right-side icon (spinner that rotates while animating, check, x, close, none), `pct` (0-100), colorStart/colorEnd gradient, height, a subtitle line (with optional subtitleColor for errors), an optional shimmer sweep that loops across the fill, milestone tick marks (`milestones` = N segments), a `capStyle` at the fill's leading edge (glow | dot | line | none, with optional capColor), an `inline` layout (label, bar, value and icon on one line), and a per-row `duration`. Bars have a soft pill track (#f0f0f8 light / #1e1e1e dark) and a subtle top-highlight gradient on the fill. `scrollReveal` (default true) starts all fills from 0% and animates them to their targets only once the card enters the viewport (useInView, once) over `animationDuration` seconds (default 1.2) with an ease-out curve. Ship default rows demonstrating progress A/B/C ratio bars, an uploading file with spinner and shimmer, a completed file, a failed upload, storage usage with milestones, a task-generation bar with a dot cap, an inline bandwidth bar and a monthly transfer bar with a line cap. Accessible: each bar has role=\"progressbar\" with aria-valuenow/min/max and an aria-label. Forward className and extra div props, and keep everything fully typed in TypeScript.",
  },
  {
    slug: "meet-the-team",
    name: "Meet the Team",
    description:
      "A wrapping grid of team member photo cards with edge blur masks, a bottom gradient scrim for name/title legibility, hover shimmer sweep, and staggered entrance.",
    category: "Team",
    type: "block",
    free: false,
  },
  {
    slug: "text-scramble-pro",
    name: "Text Scramble Pro",
    description:
      "Cycling phrases that decrypt from scrambled characters into readable text, left-to-right, right-to-left, or random reveal order, with a scramble-out transition and blinking cursor.",
    category: "Typography",
    free: true,
  },
  {
    slug: "noise-background",
    name: "Noise Background",
    description:
      "A canvas background with animated film-grain noise, soft color blob gradients, 7 built-in themes (or fully custom colors), drifting blob animation, and a vignette.",
    category: "Background",
    free: true,
  },
  {
    slug: "scroll-card-stack",
    name: "Scroll Card Stack",
    description:
      "A scroll-driven feature card stack, each card flies away with a rotation/scale as the next one peeks up from behind, self-scrolling within its own container so it can be embedded anywhere.",
    category: "Card",
    free: false,
  },
  {
    slug: "dot-image-slider",
    name: "Dot Image Slider",
    description:
      "A before/after image reveal, a luminance-mapped halftone dot rendering on one side, the real photo on the other, dragged apart by a glowing lightsaber-style divider handle.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "diamond-scroll-gallery",
    name: "Diamond Scroll Gallery",
    description:
      "A rotated grid of diamond-cropped images that drift at different parallax speeds per column as you scroll, self-scrolling within its own container.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "blog-card-horizontal",
    name: "Blog Card Horizontal",
    description:
      "A horizontal article card, image/video media panel, category and read-time badges, tags, author row, and a themed read button. Dark, light, and glass presets.",
    category: "Blog",
    free: false,
  },
  {
    slug: "blog-card-vertical",
    name: "Blog Card Vertical",
    description:
      "A vertical article card with a configurable image aspect ratio, category and read-time badges, tags, author row, and a themed read button. Dark, light, and glass presets.",
    category: "Blog",
    free: false,
  },
  {
    slug: "animated-loader",
    name: "Animated Loader",
    description:
      "A loading spinner kit with 4 variants, rotating lines, ring, dual counter-rotating ring, and bouncing dots, sharing a common color/size/speed API.",
    category: "Loader",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS loading spinner kit called AnimatedLoader using motion (motion/react), clsx and tailwind-merge. One component with a `variant` prop: \"lines\" (8 or 12 bars via `lineCount`, arranged radially with opacity fading from 1 down to about 0.18 around the circle, the whole group rotating), \"ring\" (a faint track circle plus a rounded arc covering about 26% of the circumference rotating), \"dual-ring\" (an outer arc rotating clockwise and a smaller inner arc at 35% opacity rotating counter-clockwise about 25% faster, each covering about 28%), and \"dots\" (default: three dots that bounce up and fade between 0.35 and 1 opacity, staggered by a third of the cycle). Shared API: `color` (default #F39C12), `trackColor` (default color-mix(in srgb, currentColor 15%, transparent), used by ring), `background` (default transparent), `size` in px (default 56), `thickness` in px (default 4; drives bar width, stroke width and dot size at 2.4x), and `speed` in seconds per rotation (default 1.2, dots use 0.6x). All animations loop forever with linear easing for rotations and easeInOut for the dots. Render inside an inline-flex centered div that extends div props and accepts className and style. Fully typed in TypeScript.",
  },
  {
    slug: "animated-checkbox",
    name: "Animated Checkbox",
    description:
      "An accessible checkbox with an animated draw-in checkmark, focus ring, and optional label, helper text, required marker, and info tooltip.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a controlled React + Tailwind CSS checkbox component (checked, onChange props) that replaces the native input with a custom-styled box. When checked, animate an SVG checkmark drawing in with stroke-dashoffset rather than just appearing. Add a visible keyboard focus ring, and support an optional label (clicking it toggles the checkbox), helper text below the label, a required-field asterisk, and an info icon that shows a tooltip on hover. Keep it fully accessible: proper aria-checked/role, associated label via htmlFor or wrapping, and a click target that covers the whole label row, not just the box.",
  },
  {
    slug: "radio-button",
    name: "Radio Button",
    description:
      "An accessible, animated radio group with a springy dot, a ripple on select, focus ring, optional descriptions and a selectable card variant.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) radio group component. Props: options ({ value, label, description?, disabled? }[]), value / defaultValue / onValueChange (controlled or uncontrolled), name, label (group label), direction (\"vertical\" | \"horizontal\"), variant (\"default\" | \"card\"), disabled, size (px, default 20) and colours (accentColor, dotColor, borderColor, labelColor, helperColor, ringColor). Use real hidden <input type=\"radio\"> elements sharing one name so arrow-key navigation and screen readers work natively, inside a role=\"radiogroup\". Each radio is a circle whose border and fill transition to the accent colour when selected, with an inner dot that springs in (scale 0 to 1), a one-shot ripple ring that expands and fades on select, a whileTap press scale, and a keyboard-only focus ring (focus-visible). The card variant wraps each option in a bordered rounded card that tints its background and border with the accent colour when selected. Show the label with an optional muted description underneath.",
  },
  {
    slug: "select",
    name: "Select",
    description:
      "An accessible, animated custom select with a springy chevron, keyboard navigation, type-ahead, option descriptions, disabled options and a focus ring.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) custom Select (dropdown) component. Props: options ({ value, label, description?, disabled? }[]), value / defaultValue / onValueChange (controlled or uncontrolled), placeholder, label, helperText, theme (\"dark\" | \"light\"), disabled, size, radius, width, accentColor and maxMenuHeight. The trigger is a button with role=\"combobox\" (aria-expanded, aria-haspopup=\"listbox\", aria-controls, aria-activedescendant) showing the selected label or the placeholder plus a chevron that springs 180 degrees when open; its border turns to the accent colour on open and a keyboard-only focus ring appears via focus-visible. The menu is a role=\"listbox\" popover under the trigger that animates in (fade + slight slide/scale) and out with AnimatePresence, closes on outside mousedown, Escape or Tab, and lists role=\"option\" rows with a hover/active highlight, an optional muted description, a disabled state and an animated draw-in checkmark on the selected row. Support full keyboard control: ArrowUp/ArrowDown (skipping disabled options, wrapping), Home/End, Enter/Space to select, and first-letter type-ahead.",
  },
  {
    slug: "slider",
    name: "Slider",
    description:
      "An accessible single or range slider with a draggable thumb, a value tooltip, optional step marks, keyboard control and a focus ring.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Slider component. Props: min, max, step, value / defaultValue / onValueChange (a number, or a [low, high] tuple when range is true), range, label, unit (suffix for displayed values), showValue, showTooltip, showMarks (small tick dots per step when there are 20 or fewer), theme (\"dark\" | \"light\"), disabled, width, trackHeight, thumbSize and accentColor. Render a rounded track with an accent-coloured fill (from the start, or between the two thumbs in range mode) and circular thumbs with role=\"slider\" and aria-valuemin/max/now/valuetext. Use pointer events with setPointerCapture on the whole track area so clicking anywhere jumps the nearest thumb and dragging works with mouse, touch and pen (touch-action: none). Snap values to step, and in range mode never let the thumbs cross. Support keyboard control (Arrow keys change by step, PageUp/PageDown by 10 steps, Home/End jump to min/max), scale the thumb up and show a focus ring while dragging or keyboard-focused, and animate a small value tooltip above the active thumb with AnimatePresence.",
  },
  {
    slug: "search-bar",
    name: "Search Bar",
    description:
      "An accessible animated search field with a live suggestions menu, keyboard navigation, a clear button, a loading spinner and a Cmd/Ctrl+K shortcut.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) SearchBar component. Props: value / defaultValue / onValueChange (controlled or uncontrolled), onSearch (fired on Enter or when a suggestion is picked), placeholder, suggestions (string[]), maxSuggestions, shortcut (label such as \"⌘K\", hidden when empty), enableShortcut (global Cmd/Ctrl+K focuses the input), loading, disabled, theme (\"dark\" | \"light\"), size, radius, width and accentColor. Render a rounded field with a search icon that turns accent-coloured on focus (and becomes a spinning arc while loading), the text input, an animated clear button that scales in when there is text, and a small keyboard-hint badge shown only when the field is empty and unfocused. The border turns to the accent colour on focus with a soft ring. Below it show an animated suggestions listbox (role=\"listbox\", input has role=\"combobox\" with aria-activedescendant) filtered by the typed text with the matching part highlighted in the accent colour; support ArrowUp/ArrowDown (wrapping), Enter to pick, Escape to close the menu then clear the text then blur, and close on outside mousedown.",
  },
  {
    slug: "tag",
    name: "Tag",
    description:
      "A compact label tag with soft, solid and outline variants, 6 colors, 3 sizes, an optional pulsing dot, icon, count, selectable toggle state and an animated remove button.",
    category: "Tag",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Tag (chip/label) component. Props: children, variant (\"soft\" | \"solid\" | \"outline\"), color (neutral, amber, mint, coral, blue, lavender), size (sm, md, lg), theme (\"dark\" | \"light\"), dot, pulse (a ring that expands and fades from the dot), icon (ReactNode), count (small pill number), selected / defaultSelected / onSelectedChange (when provided the tag becomes a toggle button with role=\"button\", aria-pressed, keyboard Enter/Space and a solid filled selected state), removable / onRemove, disabled and radius. Soft uses a translucent tint of the colour with a faint border, solid fills with the colour and auto-picks black or white text by luminance, outline is transparent with a coloured border. Each theme has its own colour set (bright on dark, deeper on light). Animate mount with a spring scale/opacity, give interactive tags a whileTap press scale, and when the remove button is clicked animate the tag out (scale + fade) with AnimatePresence before calling onRemove.",
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    description:
      "An accessible tooltip with 4 placements, auto-flip near the screen edge, a hover delay, keyboard-focus support, an arrow and an optional shortcut badge.",
    category: "Tooltip",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Tooltip component that wraps any trigger element. Props: content (ReactNode), children, placement (\"top\" | \"bottom\" | \"left\" | \"right\"), delay (ms before showing on hover, default 20), offset (px gap, default 10), arrow, shortcut (small keyboard badge, e.g. \"⌘K\"), theme (\"dark\" | \"light\"), maxWidth, disabled. Render the tooltip through createPortal into document.body with position: fixed, computed from the trigger's getBoundingClientRect, so parent overflow:hidden never clips it; flip to the opposite side when there is not enough room, and recompute on scroll and resize. Show on mouse enter (after the delay) and on keyboard focus-visible (instantly), hide on mouse leave, blur, mousedown and Escape. Give the tooltip role=\"tooltip\" and link it to the trigger with aria-describedby only while open. Animate with AnimatePresence (fade + slight scale from the side facing the trigger), style it as a small rounded card with a border, shadow and a rotated-square arrow that points at the trigger. Only mount the portal after the first open so it is SSR/hydration safe.",
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    description:
      "A loading placeholder with rect, text, circle and card presets, a shimmer or pulse animation, reduced-motion support and a built-in swap to real content when loading ends.",
    category: "Skeleton",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Skeleton loading-placeholder component. Props: variant (\"rect\" | \"text\" | \"circle\" | \"card\"), width, height, lines (for text and the card body), radius, animation (\"shimmer\" | \"pulse\" | \"none\"), theme (\"dark\" | \"light\"), accentColor (optional tint for the shimmer highlight), loading (default true) and children. Each placeholder block is a rounded div with a translucent base colour; shimmer sweeps a soft diagonal gradient across it with a motion x animation from -100% to 100% on repeat (overflow hidden), pulse fades opacity 1 to 0.5 to 1, and none is static. Stagger the delay per line, make the last text line shorter (about 60%), and disable movement when useReducedMotion() is true. The card variant composes an avatar circle with two short lines, a media block and a few text lines inside a bordered rounded container. While loading, wrap everything in role=\"status\" with aria-busy and a visually hidden \"Loading…\" label; when loading is false render the children with a short fade-in so the skeleton can be swapped for the real content.",
  },
  {
    slug: "tabs",
    name: "Tabs",
    description:
      "An accessible tab set with underline, pill and segmented variants, a sliding animated indicator, icons, counts, arrow-key navigation and animated content panels.",
    category: "Tabs",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Tabs component. Props: items ({ value, label, icon?, count?, disabled?, content? }[]), value / defaultValue / onValueChange (controlled or uncontrolled), variant (\"underline\" | \"pill\" | \"segmented\"), size (sm, md, lg), theme (\"dark\" | \"light\"), accentColor and fullWidth. Render a role=\"tablist\" of role=\"tab\" buttons (aria-selected, aria-controls, roving tabIndex so only the active tab is in the tab order). The active indicator is a single motion element with a shared layoutId per instance (use React.useId) so it springs between tabs: a 2px accent underline for underline, a tinted accent pill for pill, and a raised light thumb inside a tinted rounded track for segmented. Support optional icons and small count badges, disabled tabs, and keyboard navigation on the tablist (ArrowLeft/ArrowRight wrapping and skipping disabled tabs, Home/End) with automatic activation that also moves focus. If items have content, render a role=\"tabpanel\" below labelled by the active tab and swap it with AnimatePresence mode=\"wait\" (short fade + slight vertical slide).",
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    description:
      "An accessible breadcrumb trail with 4 separator styles, an optional home icon, animated collapse of long paths behind an expandable ellipsis, and hover tint.",
    category: "Breadcrumb",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Breadcrumb component. Props: items ({ label, href?, onClick?, icon? }[]), separator (\"chevron\" | \"slash\" | \"dot\" | \"arrow\" or any ReactNode), maxItems (collapse long trails), showHomeIcon (adds a home icon to the first item), size (sm, md, lg), theme (\"dark\" | \"light\") and accentColor. Render <nav aria-label=\"Breadcrumb\"> with an <ol>; each item is a link (<a> when it has href, otherwise a <button>) that tints its background and turns the accent colour on hover and shows a focus-visible ring, separated by aria-hidden separators. The last item is the current page: a non-interactive span with aria-current=\"page\" and heavier weight. When items.length > maxItems, show the first item, an ellipsis button (aria-label \"Show hidden pages\") and the last maxItems-1 items; clicking the ellipsis expands the full trail. Animate items in and out with AnimatePresence (mode popLayout, layout on each li) so expanding slides the hidden crumbs in smoothly.",
  },
  {
    slug: "pagination",
    name: "Pagination",
    description:
      "An accessible pagination control with smart ellipsis ranges, a sliding animated active page, solid, soft and compact variants, previous/next buttons and optional labels.",
    category: "Pagination",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Pagination component. Props: totalPages, page / defaultPage / onPageChange (controlled or uncontrolled), siblingCount (default 1), boundaryCount (default 1), variant (\"solid\" | \"soft\" | \"compact\"), size (sm, md, lg), theme (\"dark\" | \"light\"), accentColor, showLabels (adds \"Previous\"/\"Next\" text to the arrow buttons) and disabled. Render <nav aria-label=\"Pagination\"> with previous and next buttons (disabled at the ends) and, between them, the page numbers computed with a MUI-style algorithm: always show the first and last boundaryCount pages, siblingCount pages either side of the current page, and replace skipped ranges with a non-interactive ellipsis, while never changing the total number of slots when you move between pages. Each number is a button with aria-label \"Page N\" and aria-current=\"page\" on the active one. The active highlight is a single motion element with a shared layoutId (React.useId) that springs between pages: filled accent with auto black/white text for solid, an accent-tinted pill with accent text for soft. The compact variant replaces the numbers with \"Page X of Y\" (aria-live polite). Add hover tint and a focus-visible ring.",
  },
  {
    slug: "stepper",
    name: "Stepper",
    description:
      "An accessible step indicator with horizontal and vertical layouts, numbered and minimal variants, animated progress connectors, draw-in checkmarks, an error state and optional clickable steps.",
    category: "Stepper",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Stepper component. Props: steps ({ label, description?, error? }[]), currentStep / defaultStep / onStepChange (zero-based, controlled or uncontrolled), orientation (\"horizontal\" | \"vertical\"), variant (\"numbered\" | \"minimal\"), size (sm, md, lg), theme (\"dark\" | \"light\"), accentColor and clickable. Render an <ol> of <li> steps. Each step has a circle in one of three states: complete (filled accent with a checkmark that draws in via a motion pathLength animation and auto black/white contrast), current (accent border, tinted fill, accent number and a soft ring, in the minimal variant a small dot with a pulsing ring) and upcoming (neutral outline, muted number); an error step turns coral with a \"!\". Between steps draw a 2px connector track whose accent fill animates with scaleX (horizontal) or scaleY (vertical) as steps complete. Horizontal steps share the width equally with labels centered under the circles; vertical steps stack with labels on the right. Mark the current step with aria-current=\"step\"; when clickable, render each step as a focusable button that calls onStepChange.",
  },
  {
    slug: "modal",
    name: "Modal",
    description:
      "An accessible modal dialog with a blurred backdrop, focus trap, Escape and backdrop close, scroll lock, focus restore, 3 sizes and scale, slide-up and fade animations.",
    category: "Modal",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Modal (dialog) component. Props: open / defaultOpen / onOpenChange (controlled or uncontrolled), title, description, children, footer (ReactNode for action buttons), size (sm 380px, md 480px, lg 640px), animation (\"scale\" | \"slide-up\" | \"fade\"), theme (\"dark\" | \"light\"), closeOnBackdrop, closeOnEscape, showCloseButton, blur (backdrop blur) and contained (render absolutely inside the nearest positioned parent instead of a fixed portal, for previews and embedded panels). Render through createPortal into document.body only after the first open (SSR/hydration safe) with a fixed full-screen overlay (dim background plus optional backdrop-filter blur); close on mousedown directly on the overlay (not on drags that end there). The panel is role=\"dialog\" aria-modal=\"true\" with aria-labelledby/aria-describedby wired to the title and description, a rounded bordered card with a soft shadow and a round close button. Animate overlay and panel with AnimatePresence and a spring. On open, remember document.activeElement, move focus to the first focusable element inside (or the panel), trap Tab / Shift+Tab within the panel, lock body scroll (unless contained), close on Escape via a document keydown listener, and on close restore scroll and return focus to the previously focused element.",
  },
  {
    slug: "popover",
    name: "Popover",
    description:
      "An accessible popover for interactive content with click or hover triggers, 4 placements and 3 alignments, auto-flip, outside-click and Escape close, an arrow and a spring open animation.",
    category: "Popover",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Popover component that anchors a floating panel of interactive content to any trigger. Props: children (the trigger element), content (ReactNode), open / defaultOpen / onOpenChange (controlled or uncontrolled), trigger (\"click\" | \"hover\"), placement (\"top\" | \"bottom\" | \"left\" | \"right\"), align (\"start\" | \"center\" | \"end\"), offset, arrow, width, theme (\"dark\" | \"light\"). Render the panel through createPortal into document.body with position: fixed, positioned from the trigger's getBoundingClientRect (use motion x/y percentages for the alignment translate), flipping to the opposite side when there is not enough room and recomputing on scroll and resize. Click mode toggles on trigger click; hover mode opens on mouse enter and closes after a short grace delay that is cancelled when the pointer enters the panel, so the content stays clickable. Close on outside mousedown and on Escape (returning focus to the trigger). Give the panel role=\"dialog\" and inject aria-haspopup, aria-expanded and aria-controls onto the trigger element with cloneElement. Animate with AnimatePresence (fade + slight scale from the side facing the trigger) and add a rotated-square arrow that points at the trigger and follows the alignment. Only mount the portal after the first open so it is SSR/hydration safe.",
  },
  {
    slug: "drawer",
    name: "Drawer",
    description:
      "An accessible slide-in drawer from any of 4 sides with a backdrop, focus trap, Escape and backdrop close, scroll lock, focus restore and drag-to-dismiss.",
    category: "Drawer",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Drawer (side sheet) component. Props: open / defaultOpen / onOpenChange (controlled or uncontrolled), title, description, children, footer, side (\"left\" | \"right\" | \"top\" | \"bottom\"), size (sm, md, lg), theme (\"dark\" | \"light\"), closeOnBackdrop, closeOnEscape, showCloseButton, swipeToClose, blur and contained (render absolutely inside the nearest positioned parent instead of a fixed portal). Render through createPortal into document.body only after the first open (SSR safe) with a dimmed full-screen overlay; the panel is role=\"dialog\" aria-modal=\"true\" with aria-labelledby/aria-describedby, laid out as a flex column: header (title + description), a scrollable body and a footer separated by a border; a round close button sits top-right. The panel slides in from its side with a spring (initial/exit translate 100% or -100% on x or y) and has rounded corners on the inner edge. With swipeToClose, use useDragControls so only the header (and a grab handle for top/bottom drawers) starts a drag along the drawer's axis, elastic only in the closing direction, and close when dragged past ~90px or flicked fast. Trap focus (Tab/Shift+Tab cycle), move focus inside on open, close on Escape via a document keydown listener, lock body scroll (unless contained) and restore focus to the previously focused element on close.",
  },
  {
    slug: "avatar",
    name: "Avatar",
    description:
      "A user avatar with image, initials or icon fallback, 5 sizes, circle, rounded and square shapes, a presence status dot with pulse, an accent ring and an optional click state.",
    category: "Avatar",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Avatar component. Props: src, alt, name, size (\"xs\" 24 | \"sm\" 32 | \"md\" 44 | \"lg\" 56 | \"xl\" 80, or a number of px), shape (\"circle\" | \"rounded\" | \"square\"), status (\"online\" | \"offline\" | \"busy\" | \"away\"), pulse (expanding ring on the online dot), ring (a two-layer ring: a gap in the surface colour then an accent-coloured outline), ringColor, theme (\"dark\" | \"light\"), color (override the fallback background) and onClick. Render the photo with an <img> that fades in on load and falls back when it errors or when no src is given: show the initials (first letter of the first and last word, uppercase) on a pastel background picked deterministically from the name with a hash, or a person icon on a neutral background when there is no name. Reset the loaded/failed state whenever src changes. Draw the status dot at the bottom-right with a cut-out border in the surface colour so it separates from the image, and scale it to about 27% of the avatar size. When onClick is provided render a motion.button with a spring hover/tap scale and a focus-visible ring; otherwise render a span with role=\"img\" and an aria-label from alt or name.",
  },
  {
    slug: "avatar-group",
    name: "Avatar Group",
    description:
      "A stacked group of avatars with photo or initials, an overflow +N bubble, hover lift with name tooltips, a spread-on-hover animation, 5 sizes and adjustable overlap.",
    category: "Avatar",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) AvatarGroup component. Props: users ({ name, src? }[]), max (how many avatars to show before collapsing the rest into a \"+N\" bubble), size (\"xs\" 24 | \"sm\" 32 | \"md\" 44 | \"lg\" 56 | \"xl\" 72, or a number), shape (\"circle\" | \"rounded\"), overlap (fraction of the avatar size that neighbours overlap, e.g. 0.3), expandOnHover, showTooltip, theme (\"dark\" | \"light\") and onOverflowClick. Render a role=\"group\" flex row where each avatar overlaps the previous with a negative margin, earlier avatars stacked above later ones, and every avatar wrapped in a ring of the surface colour so the overlap reads cleanly. Each avatar shows its photo (fading in on load, robust to images that finish loading before hydration by checking img.complete in a ref callback) or falls back to initials on a pastel background chosen by hashing the name. Animate with springs: when the group is hovered and expandOnHover is on, the negative margin shrinks so the avatars spread apart; the individually hovered avatar lifts 4px, scales to 1.08, jumps to the top of the stack and shows a small name tooltip above it via AnimatePresence. The overflow bubble is a button labelled \"N more\" and calls onOverflowClick.",
  },
  {
    slug: "divider",
    name: "Divider",
    description:
      "A horizontal or vertical divider with solid, dashed, dotted and gradient styles, an optional label with start, center or end position, an accent color and a draw-in animation on scroll.",
    category: "Divider",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Divider component. Props: orientation (\"horizontal\" | \"vertical\"), variant (\"solid\" | \"dashed\" | \"dotted\" | \"gradient\"), label (ReactNode shown in the middle of the line), labelPosition (\"start\" | \"center\" | \"end\"), thickness, spacing (margin around it), accent (use accentColor instead of the neutral line colour), accentColor, animated and theme (\"dark\" | \"light\"). Render a role=\"separator\" element with aria-orientation; without a label it is a single line, with a label it is line + text + line where the label position shrinks one of the two lines (flex 0.12). Solid is a flat colour, dashed uses a repeating-linear-gradient, dotted a repeating radial-gradient of small dots, and gradient fades from transparent to a stronger colour (mirrored on the two sides of a label, or transparent-solid-transparent for a single line). When animated, each line starts at scaleX(0) (scaleY for vertical) with its transform-origin at the end nearest the label and grows to 1 with whileInView once (viewport amount 0.6) using an easeOut curve. Keep the line elements created by a render helper, not a nested component, so re-renders do not restart the animation.",
  },
  {
    slug: "accordion",
    name: "Accordion",
    description:
      "An accessible accordion with single or multiple open panels, default, card and filled variants, chevron or plus indicators, smooth height animation and full keyboard navigation.",
    category: "Accordion",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Accordion component. Props: items ({ value, title, content, icon?, disabled? }[]), type (\"single\" | \"multiple\"), value / defaultValue / onValueChange (always a string[] of open values, controlled or uncontrolled), collapsible (single mode can close the open item), variant (\"default\" hairline rows | \"card\" separate bordered rounded cards | \"filled\" tinted rounded rows), size (sm, md, lg), indicator (\"chevron\" | \"plus\"), theme (\"dark\" | \"light\") and width (default 870px, capped at 100% of the parent). Each row is a heading containing a full-width button with aria-expanded and aria-controls, followed by a role=\"region\" panel labelled by that button. Animate open/close with AnimatePresence: the panel goes from height 0 / opacity 0 to height auto / opacity 1 (overflow hidden) with an easeOut curve; the chevron rotates 180 degrees with a spring, the plus indicator hides its vertical stroke via scaleY; the active title icon and indicator go from muted to full text colour and in the card variant the open card gets a stronger border (the design is strictly black and white, with no accent colour). Support keyboard navigation between headers with ArrowDown/ArrowUp (wrapping, skipping disabled rows) and Home/End, and show a focus-visible ring.",
  },
  {
    slug: "card",
    name: "Card",
    description:
      "A flexible content card with media, badge, title, description, action and footer slots, default, elevated, outline and filled variants, vertical or horizontal layout, and interactive hover lift with an optional cursor spotlight.",
    category: "Card",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Card component. Props: title, description, media (image URL), mediaAlt, mediaRatio (CSS aspect-ratio, default \"16 / 10\"), badge (small pill over the image), action (ReactNode top-right of the header), children (body), footer (ReactNode row pinned to the bottom), variant (\"default\" | \"elevated\" | \"outline\" | \"filled\"), orientation (\"vertical\" | \"horizontal\", horizontal puts a 38%-wide image on the left), interactive, spotlight, href, onClick, radius, padding, width, theme (\"dark\" | \"light\") and accentColor. Render a rounded, overflow-hidden surface with a 1px border (elevated adds a deep shadow, outline is transparent, filled is a tinted background with no border). When clickable (interactive, href or onClick) make it a motion.a (href) or a motion.div with role=\"button\", tabIndex and Enter/Space handling (onClick), lift it with whileHover y: -3 and a small whileTap scale, tint the border with the accent colour and zoom the image 5% on hover, and show a focus-visible ring. With spotlight, track the pointer by writing --mx/--my CSS variables on the element in onPointerMove (no re-render) and draw a radial-gradient accent glow overlay that fades in while hovered. Keep content above the overlay with z-index.",
  },
  {
    slug: "kbd",
    name: "Kbd",
    description:
      "A keyboard key cap for showing shortcuts, with raised, flat and outline styles, 3 sizes, automatic Mac or Windows symbols, key combinations and a live press animation.",
    category: "Kbd",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS Kbd component that renders keyboard shortcuts with semantic <kbd> elements. Props: combo (a string such as \"mod+shift+p\", split on \"+\" into one key cap per token), children (a single custom cap when no combo is given), variant (\"raised\" 3D key cap with a 2px bottom shadow | \"flat\" tinted | \"outline\"), size (sm 22px, md 26px, lg 32px), theme (\"dark\" | \"light\"), separator (show a muted \"+\" between caps) and listen. Map token aliases to symbols: mod -> ⌘ on Apple platforms and Ctrl elsewhere, cmd/command -> ⌘, ctrl -> ⌃ (Mac) or Ctrl, shift -> ⇧, alt/option -> ⌥ (Mac) or Alt, enter -> ↵, esc -> Esc, tab -> ⇥, backspace -> ⌫, space -> Space, up/down/left/right -> arrows; single letters are uppercased. Detect the platform hydration-safely with React.useSyncExternalStore (server snapshot false, client snapshot from navigator.platform). When listen is true, add window keydown/keyup/blur listeners that keep a Set of currently pressed normalized keys (Meta -> cmd, Control -> ctrl, Escape -> esc, ArrowUp -> up, \" \" -> space) and animate the matching cap down: translateY(2px), the bottom shadow collapses and the background brightens, with a fast 80ms transition. Wrap combos in an outer span with aria-label of the combo joined by \" + \".",
  },
  {
    slug: "empty-state",
    name: "Empty State",
    description:
      "A friendly empty, no-results or error placeholder with 5 icon presets, a floating icon tile, title, description and actions, in plain, card and dashed styles with a staggered entrance.",
    category: "Empty State",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) EmptyState component for empty lists, no search results and error screens. Props: preset (\"inbox\" | \"search\" | \"folder\" | \"cart\" | \"error\", each with its own line-icon SVG and default title and description copy), icon (custom ReactNode overriding the preset icon), title, description (pass an empty string or null to hide), action and secondaryAction (ReactNodes such as buttons), variant (\"plain\" | \"card\" bordered rounded card | \"dashed\" dashed outline), size (sm, md, lg scaling the icon tile, type and padding), theme (\"dark\" | \"light\") and float. Centre everything in a column with role=\"status\". The icon sits in a rounded-square tile with a subtle border; when float is true (and useReducedMotion() is false) the tile bobs up and down 5px on an infinite easeInOut loop. Stagger a mount animation for the icon block, text block and actions (opacity 0 to 1 and y 10 to 0, delays 0, 0.08 and 0.16 seconds). Keep it strictly black and white.",
  },
  {
    slug: "tag-input",
    name: "Tag Input",
    description:
      "A multi-value input that turns text into removable tags on Enter, comma or paste, with suggestions, duplicate and max limits, custom validation and an animated add and remove.",
    category: "Tag Input",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) TagInput component. Props: value / defaultValue / onValueChange (string[], controlled or uncontrolled), placeholder, label, helperText, suggestions (string[]), maxTags, allowDuplicates, addOnBlur, delimiters (default [\",\", \";\"]), validate ((tag) => error message or null), size (sm, md, lg), theme (\"dark\" | \"light\"), width and disabled. Render a bordered, rounded, wrapping field that contains a chip per tag (pill with a remove button, aria-label \"Remove <tag>\") followed by a flexible text input; clicking anywhere in the field focuses the input. Enter or a delimiter key commits the trimmed draft as a tag; Backspace on an empty draft removes the last tag; pasting text containing delimiters or newlines splits it into several tags; blur commits the pending draft when addOnBlur is true. Reject empty, duplicate (case-insensitive unless allowDuplicates), over-limit and validate() failures and show the reason as an inline error (role=\"alert\", coral text and border) that clears when the user types. With maxTags show a \"n/max\" counter and disable the input when full. With suggestions, filter them by the draft (excluding tags already added), show an animated listbox under the field (input becomes role=\"combobox\" with aria-activedescendant) with ArrowUp/ArrowDown and Enter to pick, using onMouseDown preventDefault so clicks do not blur. Animate chips in and out with AnimatePresence + layout springs. Keep it strictly black and white apart from the error colour.",
  },
  {
    slug: "combobox",
    name: "Combobox",
    description:
      "A searchable select where you type to filter options, with match highlighting, option descriptions, disabled options, a clear button, an empty state and full keyboard navigation.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Combobox (searchable select) component. Props: options ({ value, label, description?, disabled? }[]), value / defaultValue / onValueChange (string | null, controlled or uncontrolled), placeholder, label, helperText, emptyText, clearable, size (sm, md, lg), theme (\"dark\" | \"light\"), width, maxMenuHeight and disabled. The field is a bordered rounded row containing a real <input role=\"combobox\"> (aria-expanded, aria-controls, aria-autocomplete=\"list\", aria-activedescendant), an optional clear button and a chevron that springs 180 degrees when open. When closed the input shows the selected option's label; when the user types it switches to a separate query state, filters options by label (case-insensitive), highlights the matching text (bold + underline) and always resets to the selected label on close. Opening happens on focus, click, typing or ArrowDown. The menu is an absolutely positioned role=\"listbox\" under the field animated with AnimatePresence (fade + slight slide/scale) with hover/keyboard highlight, an animated draw-in checkmark on the selected row, disabled rows that are skipped, and an emptyText row when nothing matches. Keyboard: ArrowUp/ArrowDown (wrapping, skipping disabled), Home/End, Enter to pick, Escape to close, Tab to close, and scroll the active option into view. Use onMouseDown preventDefault on options and the clear button so the input keeps focus, close on outside mousedown, and keep the design strictly black and white.",
  },
  {
    slug: "multi-select",
    name: "Multi Select",
    description:
      "A searchable multi-select that shows the chosen options as removable chips, with checkbox rows, select all, a selection limit, a +N overflow chip, an empty state and full keyboard navigation.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) MultiSelect component. Props: options ({ value, label, description?, disabled? }[]), value / defaultValue / onValueChange (string[], controlled or uncontrolled), placeholder, label, helperText, emptyText, maxSelected, maxVisibleTags (default 3), showSelectAll, clearable, size (sm, md, lg), theme (\"dark\" | \"light\"), width, maxMenuHeight and disabled. The field is a bordered rounded wrapping row containing a chip per selected option (pill with an x button, aria-label \"Remove <label>\"), a flexible <input role=\"combobox\"> for searching, an optional clear-all button and a chevron that springs 180 degrees when open. When the menu is closed only the first maxVisibleTags chips are shown followed by a \"+N more\" label; when it is open all chips show. Typing filters options by label (case-insensitive) and highlights the match. The menu is a role=\"listbox\" with aria-multiselectable=\"true\" under the field, animated with AnimatePresence, with a header row showing \"n selected\" (or \"n/max selected\") and a Select all / Clear action that affects only the currently filtered, enabled options and respects maxSelected. Each row has a custom checkbox (animated pathLength checkmark on a filled box), the label, an optional description, disabled styling, and rows that cannot be added because the limit is reached are blocked. Picking an option toggles it, clears the query and keeps the menu open and focus in the input. Keyboard: ArrowUp/ArrowDown (wrapping, skipping disabled), Enter toggles the active row, Backspace on an empty query removes the last chip, Escape and Tab close. Keep it strictly black and white.",
  },
  {
    slug: "date-picker",
    name: "Date Picker",
    description:
      "A date picker with a popover calendar: single date or range selection, month navigation, min/max and disabled dates, Today and Clear shortcuts, localized labels and full keyboard support.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) DatePicker component. Props: mode (\"single\" | \"range\"), value / defaultValue / onValueChange (Date | null) for single mode, range / defaultRange / onRangeChange ({ from?, to? }) for range mode, placeholder, label, helperText, minDate, maxDate, isDateDisabled(date), weekStartsOn (0 | 1), locale (Intl, default en-US), clearable, closeOnSelect, size (sm, md, lg), theme (\"dark\" | \"light\"), width and disabled. The trigger is a bordered rounded button with a calendar icon, the formatted date (or a muted placeholder) and a small clear (x) button; its border brightens on hover and gets a soft ring while open. Clicking opens a popover under the trigger (AnimatePresence, fade + slight scale) containing a header with previous/next month buttons and an animated month-year title that slides in the direction of navigation, a weekday row, and a 6-week grid of round day buttons (role=grid / gridcell, aria-label with the full date, aria-current for today). Selected day is a filled circle (white on dark, black on light), today gets an inset ring, days outside the current month are faded, disabled days (outside min/max or isDateDisabled) are dimmed and not clickable. In range mode the first click sets the start, moving the mouse previews the band up to the hovered day, the second click sets the end (swapping if earlier), and the band between is a soft tinted strip with rounded selected ends. Footer has Today (jumps to and focuses today) and Clear. Keyboard: the grid uses roving tabindex; ArrowLeft/Right move by a day, ArrowUp/Down by a week, PageUp/PageDown by a month (Shift = year), Home/End to week start/end, Enter/Space selects, Escape closes and returns focus to the trigger, and clicking outside closes. Keep it strictly black and white.",
  },
  {
    slug: "time-picker",
    name: "Time Picker",
    description:
      "A time picker with a popover of scrollable hour, minute and AM/PM columns: 12 or 24-hour clock, minute steps, min/max times, a Now shortcut and full keyboard support.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) TimePicker component. Props: value / defaultValue / onValueChange (a 24-hour \"HH:mm\" string or null, controlled or uncontrolled), hourCycle (12 | 24, default 12), minuteStep (default 5), minTime and maxTime (\"HH:mm\"), placeholder, label, helperText, clearable, size (sm, md, lg), theme (\"dark\" | \"light\"), width and disabled. The trigger is a bordered rounded button with a clock icon, the formatted time (\"9:30 AM\" or \"09:30\", tabular numbers) or a muted placeholder, and a small clear (x) button; its border brightens on hover and gets a soft ring while open. Clicking opens a popover under the trigger (AnimatePresence, fade + slight scale) with side-by-side columns for hours, minutes and (in 12-hour mode) AM/PM. Each column is a role=\"listbox\" showing five rows with the edges faded by a gradient mask and no visible scrollbar; the selected row is a filled pill (white on dark, black on light) that slides between rows with a shared layoutId spring, and each column scrolls its selected row to the centre, instantly on open and smoothly afterwards. Times outside minTime/maxTime are dimmed and not selectable; picking an hour keeps the minute when it is still allowed and otherwise snaps to the nearest allowed minute. A controlled value that is off the minute step still gets its own row. Footer has Now (current time rounded down to the step, clamped to min/max) and Clear. Keyboard: the hour column is focused on open, Tab moves between columns, ArrowUp/ArrowDown step through the enabled rows (wrapping), Home/End jump to the first/last, Enter or Escape closes and Escape returns focus to the trigger, and clicking outside closes. Keep it strictly black and white.",
  },
  {
    slug: "phone-input",
    name: "Phone Input",
    description:
      "A phone number input with a searchable country menu: flags and calling codes, as-you-type formatting per country, paste detection for +codes, an E.164 value and a length check.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) PhoneInput component. Props: value / defaultValue / onValueChange(value, { country, nationalNumber, isValid }) where value is an E.164 string like \"+14155550123\" (\"\" when empty), country / defaultCountry (ISO code, default \"US\") / onCountryChange, countries (limit the list), preferredCountries (pinned to the top), label, placeholder, helperText, errorText, invalidText (default \"Enter a valid phone number\"), name (adds a hidden input with the E.164 value), size (sm, md, lg), theme (\"dark\" | \"light\"), width and disabled. Ship a list of about 50 countries, each with code, name, calling code and a national mask where # is a digit (US \"(###) ###-####\", UK \"#### ######\", T\u00fcrkiye \"### ### ## ##\") plus an optional minimum length for variable-length countries. The field is one bordered rounded row: a country button (emoji flag from the ISO code, \"+dial\" and a chevron that springs 180 degrees when open), a thin divider, then an <input type=\"tel\"> that formats the digits into the mask as you type, keeps the caret after the same digit, drops a typed trunk 0, and makes Backspace after a separator delete the digit before it. Typing or pasting a number that starts with + switches the country by the longest matching calling code. When the digit count is valid for the country an animated check (pathLength) appears on the right; after the field loses focus with an incomplete number the border and message turn a soft red and show invalidText. The country menu opens under the field (AnimatePresence, fade + slight scale) with a search box (matches name, ISO code or calling code, with or without +), preferred countries above a divider, and rows of flag, name, muted +code and an animated check on the selected one; ArrowUp/ArrowDown, Home/End, Enter to pick, Escape closes and returns focus to the number input, clicking outside closes. Keep it black and white apart from the error colour.",
  },
  {
    slug: "credit-card-input",
    name: "Credit Card Input",
    description:
      "A grouped card number, expiry and CVC field: brand detection with an animated mark, 4-4-4-4 or Amex 4-6-5 spacing, Luhn and expiry checks, and focus that moves on as each part is complete.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) CreditCardInput component. Props: value / defaultValue / onValueChange ({ number, expiry \"MM/YY\", cvc, name, brand, isComplete }), showName (adds a cardholder name row), label, helperText, size (sm, md, lg), theme (\"dark\" | \"light\"), width and disabled. Render one bordered rounded group with thin dividers: an optional name row, a card number row and a split row with expiry (MM / YY) and CVC. The group border brightens on hover, gets a soft ring while any part is focused, and turns a soft red with a message under it when a part is invalid. Detect the brand from the number prefix (Visa 4, Mastercard 51-55 and 2221-2720, Amex 34/37, Discover 6011/644-649/65, Troy 9792) and show it in a small chip at the start of the number row as a monochrome mark that swaps with a flip-in animation (AnimatePresence, rotateX); while the CVC is focused the chip shows a card-back icon instead. Format the number in groups of four (Amex 4-6-5), cap it at the brand's longest length, and validate it with the Luhn check. The expiry auto-pads a single month digit above 1 (\"4\" becomes \"04\"), rejects months over 12, shows \"MM / YY\" and is invalid if it is in the past. CVC is 3 digits, 4 for Amex. Focus moves from the number to the expiry when the number is complete and valid, and from the expiry to the CVC when the date is complete; Backspace in an empty field returns to the end of the previous one. Show errors only after a field loses focus (Card number is incomplete / invalid, Expiry date is incomplete / in the past, Security code is incomplete), set autoComplete cc-number, cc-exp, cc-csc and cc-name, and use inputMode numeric. Keep it black and white apart from the error colour.",
  },
  {
    slug: "currency-input",
    name: "Currency Input",
    description:
      "A money input with a currency picker: live thousands separators for any locale, the right number of decimals per currency, an animated symbol, arrow-key steps and min/max, returning a plain number.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) CurrencyInput component. Props: value / defaultValue / onValueChange(value: number | null, currency), currency / defaultCurrency (ISO 4217, default \"USD\") / onCurrencyChange, currencies (codes in the menu), showCurrencySelect, locale (default \"en-US\"), min, max, step (ArrowUp/ArrowDown, Shift x10), allowNegative, label, placeholder, helperText, size (sm, md, lg), theme (\"dark\" | \"light\"), width and disabled. Get each currency's narrow symbol, decimals and display name from Intl (NumberFormat formatToParts, resolvedOptions and Intl.DisplayNames), so JPY has no decimals and the names are localized. The field is a bordered rounded row: the currency symbol on the left (slides vertically to the new symbol when the currency changes, AnimatePresence), an <input inputMode=\"decimal\"> and, on the right, a small chip with the currency code and a spring-rotating chevron that opens the currency menu. While typing, keep a clean draft (digits, one decimal point, fraction capped at the currency's decimals), show it with the locale's group and decimal separators (keeping a trailing decimal the person typed), and restore the caret after the same number of digits. On blur, clamp to min/max and show the full formatted amount with fixed decimals. The menu is a role=\"listbox\" under the field aligned right (fade + slight scale) with rows of a symbol chip, the bold code, the muted localized name and an animated check on the selected one; the chip is a select-only combobox (role=\"combobox\", aria-activedescendant) with ArrowUp/ArrowDown, Enter/Space to pick, Escape to close, and clicking outside closes. Changing currency re-rounds the amount to the new currency's decimals. Keep it strictly black and white.",
  },
  {
    slug: "form-field",
    name: "Form Field",
    description:
      "A form field wrapper with label, description, required or optional marker, info tooltip, character counter and animated helper, error and success messages, with sync or async validation and aria wiring for any control.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) FormField component. Props: label, description, info (tooltip text), required, optional, helperText, errorText (forced error), successText, validate(value) returning a message or null (sync or async), maxLength, a built-in control's value / defaultValue / onValueChange, type, placeholder, multiline, name, autoComplete, children (your own control: a single element gets id, aria-describedby, aria-invalid and aria-required cloned in, or a function receives those props), size (sm, md, lg), theme (\"dark\" | \"light\"), width and disabled. Header row: the label (a red * when required, a muted \"(optional)\" otherwise when optional), an info icon button that shows a small tooltip on hover or focus (AnimatePresence), and, when maxLength is set, a right-aligned n/max counter that brightens near the limit and turns red at it, with a screen-reader \"n of max characters\" text. An optional description sits under the label. Without children render a bordered rounded input or textarea in the same style as the other form elements (border brightens on hover, soft ring on focus, soft red when invalid). Validation follows reward early, punish late: check on blur; once an error is showing, re-check on every change so it clears as soon as the value is fixed; required fields report \"<label> is required\" when empty. Async validators show a spinning indicator in the field and ignore stale results; a passing value with successText shows an animated check in the field and the success message. The first blur error shakes the field (x keyframes). The message line under the field swaps between helper, error (with an alert icon, role=\"alert\") and success (with a drawn check) with a short fade and slide (AnimatePresence mode=\"wait\") and keeps its height so the layout doesn't jump. Keep it black and white apart from the error colour.",
  },
  {
    slug: "rich-text-editor",
    name: "Rich Text Editor",
    description:
      "A rich text editor with a formatting toolbar, headings, lists, quotes, inline code and links, Markdown-style shortcuts, clean pasting from Docs and Word, and a word count, with no editor library.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) RichTextEditor component on contentEditable with document.execCommand, with no editor library. Props: value / defaultValue / onValueChange(html, text), placeholder, label, helperText, tools (ordered subset of bold, italic, underline, strike, h2, h3, bulletList, orderedList, quote, code, link, undo, redo), showCount, maxLength (soft limit), minHeight, maxHeight, size (sm, md, lg), theme (\"dark\" | \"light\"), width and disabled. The editor is one bordered rounded box (border brightens on hover, soft ring on focus): a toolbar row of icon buttons split into groups by thin dividers, the editable area, and a small word and character count in the bottom right that turns red past maxLength. Active formats (from queryCommandState / queryCommandValue on selectionchange) show as a filled pill behind the icon with a small spring; buttons keep the selection with onMouseDown preventDefault and expose aria-pressed. Headings and quotes toggle with formatBlock (back to p), lists with insertUnorderedList / insertOrderedList, inline code wraps the selection in <code> and unwraps when inside one. Link (and Cmd/Ctrl+K) opens a small inline popover with a URL field, Apply and Remove, restoring the saved selection, adding https:// when missing and rel=\"noopener noreferrer nofollow\" target=\"_blank\". Markdown shortcuts at the start of a line on Space: ## and ### for headings, - or * for bullets, 1. for numbers, > for a quote. Pasting runs through a sanitizer (DOMParser) that keeps only p, br, strong, em, u, s, h2, h3, ul, ol, li, blockquote, code and a with a safe http(s)/mailto href, maps b/i/div/h1 and Google Docs bold and italic spans to the allowed tags, and drops scripts, styles and all other attributes; export the sanitizer too. A placeholder shows while empty, new lines are p elements, and scoped CSS styles headings, lists, quotes (left rule, muted), inline code (monospace, tinted) and underlined links. Keep it black and white apart from the error colour.",
  },
  {
    slug: "signature-pad",
    name: "Signature Pad",
    description:
      "A signature field that draws smooth, pressure-aware ink, with undo, clear, a typed-signature option for people who can't draw, and PNG and SVG export in a paper-ready ink colour.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) SignaturePad component on a canvas. Props: onChange({ isEmpty, dataUrl, svg, mode, typedName }), label, helperText, placeholder (\"Sign here\"), allowTyping, penColor (defaults to the theme text colour), exportColor (default #0A0A0A so exports show on white paper), minWidth, maxWidth, height, size (sm, md, lg), theme (\"dark\" | \"light\"), width and disabled. The pad is a bordered rounded area with a faint signing line near the bottom starting with an \u00d7, and a centered muted placeholder that fades out on the first stroke. The canvas is sized to its container with devicePixelRatio (ResizeObserver) and strokes are stored in CSS pixels and redrawn on resize. Drawing uses pointer events with pointer capture and touch-action none, reads coalesced events, and sets each point's width from speed (faster is thinner, between minWidth and maxWidth, smoothed) and pen pressure when the pointer is a pen; strokes are drawn as quadratic curves through the midpoints. Undo removes the last stroke and Clear removes everything; both are small buttons in the pad's top-right corner. A Draw / Type segmented control (sliding pill with layoutId) switches to typing: a name field below the pad renders the name in a script font on the signing line, scaled to fit. onChange fires after each stroke, undo, clear and typed change, with a transparent PNG data URL (drawn at 2x in exportColor) and standalone SVG markup (quadratic paths or a text element). Keep it strictly black and white.",
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    description:
      "An image cropper with a draggable, resizable crop box, aspect presets or a circle mask for avatars, keyboard nudging, drag-and-drop upload and the cropped image returned as a data URL.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) ImageCropper component with no cropping library. Props: src, onChange({ area: { x, y, width, height } in natural pixels, dataUrl }), onFileChange(file), aspectOptions ({ label, value: number | null }[], default Free, 1:1, 4:3, 16:9), defaultAspect, shape (\"rect\" | \"circle\", circle forces 1:1), maxOutputSize (default 2048), outputType (png, jpeg, webp), label, helperText, height, size (sm, md, lg), theme (\"dark\" | \"light\"), width and disabled. The stage is a bordered rounded area that shows the image with object-fit contain (compute its rect from the natural size and the stage size, kept current with a ResizeObserver). Store the crop box as fractions of the image so it survives resizes. Shade everything outside the box with one huge box-shadow around it (round for circle), draw a white 1px border, rule-of-thirds lines that fade in while dragging, and eight small white handles (corners only in circle mode). Dragging the box moves it and dragging a handle resizes it with pointer capture (one handler reading the handle from a data attribute), clamped to the image and to a 40px minimum; a locked aspect follows the dragged dimension and shrinks to fit the image. Arrow keys move the focused box (Shift for 10px steps) and Alt+arrows resize it. The initial box is the largest centred box of the aspect covering 80% of the image. Below the stage: an aspect segmented control with a sliding pill (layoutId), a live 'W \u00d7 H px' readout, Reset and Replace. With no image the stage is a drop zone and button that reads a file with FileReader; dropping an image on the stage replaces it. On every settled change, draw the crop to a canvas (clipped to a circle in circle mode, scaled down to maxOutputSize) and pass its data URL, or null if the canvas is tainted by a cross-origin image; load remote images with crossOrigin anonymous. Keep it strictly black and white.",
  },
  {
    slug: "input-otp",
    name: "Input OTP",
    description:
      "A one-time-code input with individual animated cells, paste and autofill support, numeric or alphanumeric mode, masking, grouped cells, error shake and success states.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) InputOTP (one-time code) component. Props: length (default 6), value / defaultValue / onValueChange (string, controlled or uncontrolled), onComplete(value), type (\"numeric\" | \"alphanumeric\"), mask (show dots instead of characters), groupSize (renders a small dash separator between groups, e.g. 3 for 123-456), status (\"idle\" | \"error\" | \"success\"), label, helperText, errorText, size (sm, md, lg), theme (\"dark\" | \"light\"), autoFocus and disabled. Render one rounded bordered cell per digit, but drive them from a single transparent <input> stretched over the cells (autoComplete=\"one-time-code\", inputMode numeric for numeric type) so typing, Backspace, paste, mobile autofill and screen readers all work natively; the caret is always kept at the end. Input is sanitized (digits only for numeric, letters and digits for alphanumeric) and pasted text longer than length is truncated. The next empty cell shows a blinking caret and the active cell has a bright border and soft ring; hovering brightens the border; filled cells have a slightly lighter background and each character springs in (scale 0.4 to 1) and out. Clicking anywhere on the cells focuses the input. When status becomes \"error\" the cells turn coral, the row shakes horizontally and errorText appears below with role=\"alert\"; \"success\" gives every cell a solid bright border. Keep it black and white apart from the error color.",
  },
  {
    slug: "number-input",
    name: "Number Input",
    description:
      "A numeric field with minus/plus steppers, press-and-hold auto repeat, min/max clamping, decimal precision, prefix and suffix, thousand separators and full keyboard support.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) NumberInput component. Props: value / defaultValue / onValueChange (number | null, controlled or uncontrolled), min, max, step (default 1), precision (defaults to the decimals of step), prefix, suffix (muted text such as $ or kg), thousandSeparator, locale, layout (\"split\" | \"stacked\"), allowEmpty, placeholder, label, helperText, size (sm, md, lg), theme (\"dark\" | \"light\"), width and disabled. Split layout: a rounded bordered field with a square minus button on the left, a centered text <input role=\"spinbutton\" inputMode numeric or decimal, tabular numbers, aria-valuenow/min/max> in the middle and a plus button on the right. Stacked layout: left-aligned input with two small up/down chevron buttons stacked on the right. Buttons spring-scale on press, are disabled and dimmed at min/max, and support press-and-hold: one step immediately, then after a short delay repeat every ~65ms and accelerate to 10x steps. The user can type freely; the draft is parsed on blur or Enter (commas stripped, invalid text reverts, empty becomes null when allowEmpty) and then clamped to min/max and rounded to precision. Keyboard: ArrowUp/ArrowDown step, Shift = 10x, Alt = 0.1x, PageUp/PageDown = 10 steps, Home/End jump to min/max, Enter commits, Escape discards the draft. Border brightens on hover and gets a soft ring while focused. Keep it strictly black and white.",
  },
  {
    slug: "password-input",
    name: "Password Input",
    description:
      "A password field with an animated show/hide eye toggle, a four-segment strength meter, a live requirements checklist and a Caps Lock warning.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) PasswordInput component. Props: value / defaultValue / onValueChange (string, controlled or uncontrolled), placeholder, label, helperText, minLength (default 8), showStrength, showRequirements, size (sm, md, lg), theme (\"dark\" | \"light\"), width, name, autoComplete, autoFocus and disabled. The field is a rounded bordered row with a borderless <input> (type password, letter-spaced dots while hidden) and, on the right, an icon button (aria-label \"Show password\" / \"Hide password\", aria-pressed) with an eye icon whose diagonal slash draws in with an animated pathLength when the password is revealed; pressing it must not steal focus from the input. Border brightens on hover and gets a soft ring on focus. Below the field, once the user has typed something, animate in (height + opacity via AnimatePresence) a strength meter made of four segments that fill from the left with a spring and a label (Weak, Fair, Good, Strong) plus a role=\"meter\" with aria-valuenow, and a checklist of requirements: at least minLength characters, upper and lower case letters, a number, a symbol. Each requirement has a small circle that fills and draws an animated checkmark when met, and the text brightens. Score = number of met rules (minus one while shorter than minLength, plus one for 14+ characters with 3+ rules), clamped to 1-4. Detect Caps Lock with getModifierState on keydown/keyup and show an amber \"Caps Lock is on\" hint with an icon while focused. Export a checkPassword(pw, minLength) helper returning { rules, score }. Keep it black and white apart from the amber caps-lock hint.",
  },
  {
    slug: "segmented-control",
    name: "Segmented Control",
    description:
      "A compact radio-style switch between a few options with a sliding animated thumb, solid or soft styles, icons, icon-only mode, vertical orientation and arrow-key navigation.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) SegmentedControl component. Props: options ({ value, label, icon?, disabled? }[]), value / defaultValue / onValueChange (string, controlled or uncontrolled), variant (\"solid\" | \"soft\"), orientation (\"horizontal\" | \"vertical\"), fullWidth, iconOnly (hide labels, keep them as aria-label and title), label, size (sm, md, lg), theme (\"dark\" | \"light\"), disabled. Render a rounded track (4px padding, subtle border, faint fill) containing one button per option. The selected option owns an absolutely positioned thumb with a Motion layoutId so it glides between options with a stiff spring; in the solid variant the thumb is filled white on dark (black on light) with inverted label color and a soft shadow, in the soft variant it is a translucent lighter pill with a thin border and normal label color. Unselected labels are muted and brighten on hover. Use radiogroup semantics: role=\"radiogroup\" with aria-orientation, buttons with role=\"radio\" and aria-checked, roving tabIndex on the selected (or first enabled) option; arrow keys (both axes) move focus to the next enabled option and select it, wrapping around, Home/End jump to first/last enabled. Disabled options are dimmed and skipped. Keep it strictly black and white.",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    description:
      "A color picker with a draggable saturation/brightness area, hue and opacity sliders, hex input, preset swatches and an optional screen eyedropper, all keyboard accessible.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) ColorPicker component. Props: value / defaultValue / onValueChange (hex string, #RRGGBB or #RRGGBBAA, controlled or uncontrolled), showAlpha, showEyeDropper, presets (string[]), label, helperText, size (sm, md, lg), theme (\"dark\" | \"light\"), width and disabled. The trigger is a rounded bordered button with a color swatch (checkerboard behind it so transparency is visible), the current hex in a mono font and a chevron that flips when open. It opens a popover (AnimatePresence, fade + slight scale, closes on outside click and Escape) containing: a 150px saturation/brightness area (white-to-hue gradient horizontally, transparent-to-black vertically) with a draggable round thumb using pointer capture; a hue slider with a rainbow gradient; an optional opacity slider over a checkerboard; an eyedropper button that uses the browser EyeDropper API and is only rendered when supported (detect with useSyncExternalStore so SSR does not mismatch); a hex text input (accepts 3, 4, 6 or 8 digits, commits on Enter or blur, invalid text reverts); and a row of preset swatches with a ring on the active one. Keep the state internally as HSVA so hue is not lost when saturation is zero, and resync from the value prop only when its hex differs. Accessibility: the area and sliders have role=\"slider\" with aria-valuetext; arrow keys nudge by 1% (Shift = 10%), Home/End on sliders. Export nothing else. Keep it strictly black and white apart from the colors being picked.",
  },
  {
    slug: "file-upload",
    name: "File Upload",
    description:
      "A drag-and-drop file dropzone with click-to-browse, type/size/count validation, image previews, animated progress bars, retry and remove actions.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) FileUpload component. Props: accept (input accept string, e.g. \"image/*,.pdf\"), multiple, maxSize (bytes), maxFiles, upload(file, onProgress(percent)) => Promise<void> (optional; when given every accepted file starts uploading automatically), onFilesChange(files: File[]), title, description, label, size (sm, md, lg), theme (\"dark\" | \"light\"), width, disabled. The dropzone is a role=\"button\" tabIndex=0 area with a dashed rounded border, a round upload icon, a title (\"Drop files here or click to browse\") and a muted hint built from accept, maxSize and maxFiles. Clicking it or pressing Enter/Space opens a hidden <input type=\"file\">. Support drag and drop with a dragenter/dragleave depth counter so nested children do not flicker: while dragging the dashed border brightens, the background lightens, the zone scales up slightly with a spring, the icon lifts and the title becomes \"Drop to upload\". Validate every file on both drop and browse (accept rules incl. extensions and wildcards like image/*, maxSize, maxFiles); rejected files still appear in the list with a coral border and the reason (\"File type not allowed\", \"Larger than 5 MB\", \"Limit of N files reached\"). Below the zone render an animated list (AnimatePresence + layout) of rows: a thumbnail (object URL for images, revoked on remove/unmount; otherwise an extension badge such as PDF), the truncated file name, the size or status text (percentage while uploading, \"Uploaded\" when done), a thin progress bar with role=\"progressbar\" that animates its width, a retry button for failed uploads and a remove (x) button. With multiple=false a new file replaces the previous one. Keep it strictly black and white apart from the error color.",
  },
  {
    slug: "callout",
    name: "Callout",
    description:
      "An inline message block with info, success, warning, danger and neutral variants, three appearances, self-drawing icons, an optional action link and an animated dismiss.",
    category: "Alert",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Callout component (an inline message block). Props: variant (\"info\" | \"success\" | \"warning\" | \"danger\" | \"neutral\"), appearance (\"soft\" | \"outline\" | \"bar\"), title, children (body text), icon (custom node), dismissible, open / defaultOpen / onOpenChange (controlled or uncontrolled visibility), action ({ label, onClick }), size (sm, md, lg), theme (\"dark\" | \"light\"), width and className. Each variant has an accent color (info #8FB8FF, success #87FFE3, warning #F2A841, danger #FF7A6B, neutral off-white; darker equivalents on light). Appearances: soft = accent-tinted background (about 9% mix) with a tinted border, outline = solid card background with an accent border, bar = neutral card with a 3px accent bar on the left that scales in from the top. The default icon is drawn with SVG paths that animate pathLength on mount (a circle or warning triangle first, then the glyph strokes: i, check, !, x or plus). Title is semibold in the main text color, body in a muted color, and the optional action is an accent-colored text button with an arrow that nudges right and an underline on hover. Use role=\"alert\" for warning and danger and role=\"status\" otherwise. The dismiss (x) button collapses the callout with an AnimatePresence exit (height to 0, fade, slight upward slide) and calls onOpenChange(false). Accent colors are the only color; everything else stays black and white.",
  },
  {
    slug: "meter",
    name: "Meter",
    description:
      "A meter for a value within a known range: bar, semicircle gauge or segmented variants with threshold zones, animated counting numbers and proper meter semantics.",
    category: "Progress",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Meter component (a scalar value within a known range, like the HTML meter element). Props: value, min (0), max (100), low, high (threshold values), goodDirection (\"up\" = high is good, \"down\" = high is bad, e.g. disk usage), variant (\"bar\" | \"gauge\" | \"segments\"), segments (count, default 12), label, description, unit, showValue, formatValue(value) => string, size (sm, md, lg), theme (\"dark\" | \"light\"), width. Zone logic: with no low/high the fill is neutral off-white (black on light); otherwise a value below low, between, or above high maps to bad (coral), mid (amber) or good (mint) depending on goodDirection, and the fill color transitions smoothly between zones. The displayed number counts to the new value with a Motion spring (useMotionValue + animate, mirrored into state through useMotionValueEvent) and starts from min on mount. Bar variant: rounded track with a fill whose width springs, plus thin tick marks at the low and high thresholds, label on the left and value on the right above it. Gauge variant: a 200x118 SVG semicircle arc (stroke 14, round caps) whose pathLength animates with a spring over a faint track, with the big value centered under the arc and the label below it. Segments variant: N equal segments that light up left to right with a small stagger and spring scale. Accessibility: root has role=\"meter\" with aria-valuemin, aria-valuemax, aria-valuenow (clamped) and aria-valuetext of the final formatted value. Colors only come from the zone accents; everything else is black and white.",
  },
  {
    slug: "command-palette",
    name: "Command Palette",
    description:
      "A Cmd/Ctrl+K command palette with fuzzy search and match highlighting, grouped results, keyboard navigation, shortcuts and a portal overlay.",
    category: "Overlay",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) CommandPalette component, portaled to document.body. Props: items ({ id, label, group?, icon?, shortcut?: string[], keywords?: string[], disabled?, onSelect? }[]), open / defaultOpen / onOpenChange (controlled or uncontrolled), onSelectItem(item), placeholder, emptyText, hotkey (a single key combined with Cmd on Mac / Ctrl elsewhere to toggle the palette globally, or false to disable), closeOnSelect, theme (\"dark\" | \"light\"), contained (render inline with position absolute for a demo instead of a fixed document.body portal) and className. Detect the platform for the footer hint (\"⌘K\" vs \"Ctrl K\") with useSyncExternalStore reading navigator.platform so SSR does not mismatch. The overlay is a blurred backdrop (AnimatePresence fade) with a centered panel that springs in (scale + slight y). The panel has a search input with a search icon and an Esc kbd on the right, a scrollable listbox grouped by item.group with uppercase muted group labels, and a footer with ↑↓ navigate / ↵ select hints and the hotkey reminder. Filtering is fuzzy: an exact substring match scores highest (bonus at the start of the string or after a space), otherwise an in-order subsequence match with a bonus for consecutive characters; non-matches are dropped, matches are grouped in their original group order and, only while searching, sorted by score, and matched characters in the label are bold-highlighted. Keyboard: ArrowUp/Down move a roving highlight (a Motion layoutId pill glides between rows) skipping disabled rows and wrapping, Home/End jump to the first/last enabled row, Enter runs the highlighted item's onSelect and calls onSelectItem, Escape closes, Tab does nothing (focus stays in the input). Hovering the mouse over a row also highlights it. Body scroll is locked and focus returns to the previously focused element on close, unless contained. Keep it strictly black and white; kbd chips are a subtle bordered pill.",
  },
  {
    slug: "menubar",
    name: "Menubar",
    description:
      "A desktop-style app menubar with File/Edit/View-style dropdown menus, checkbox and radio items, submenus and full arrow-key navigation between and within menus.",
    category: "Navigation",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Menubar component (a desktop-app-style horizontal menu bar, e.g. File / Edit / View). Props: menus ({ id, label, items, disabled? }[]) where each item is { id, kind: \"item\" | \"checkbox\" | \"radio\" | \"separator\" | \"label\" | \"submenu\", label?, shortcut?, checked?, disabled?, danger?, items? (nested items for a submenu) }, onSelect(menuId, item), size (sm, md, lg), theme (\"dark\" | \"light\") and className. The bar is a rounded bordered pill (role=\"menubar\") containing one trigger button per top-level menu; the active trigger gets a filled background. Clicking a trigger opens its dropdown (AnimatePresence, fade + slight scale/slide) below it; while any menu is open, hovering a different trigger switches straight to that menu. Rows render checkboxes (filled square with an animated checkmark), radios (filled dot), a shortcut kbd chip on the right, a chevron for submenu rows, dimmed disabled rows and a coral danger color. Submenus open as a flyout to the right of their row on hover/click/ArrowRight and close on ArrowLeft/Escape/moving away, nested to any depth via the same panel logic. Keyboard: with no menu open, ArrowLeft/ArrowRight move focus between top-level triggers (wrapping) and ArrowDown/Enter/Space opens the focused one; inside an open panel, ArrowUp/Down move a roving highlight (skipping separators/labels/disabled rows, wrapping), ArrowRight opens a focused submenu, ArrowLeft closes the current submenu back to its parent or (in a top-level panel) switches to the previous top-level menu, ArrowRight in a top-level panel switches to the next one, Home/End jump to the first/last row, Enter/Space activates, Escape closes everything and returns focus to the trigger. Any activation of an item/checkbox/radio calls onSelect and closes every open menu; the component does not manage checked state itself, so the consumer flips checked/radio values in the items it passes back in. Outside clicks close the open menu. Keep it strictly black and white apart from the danger color.",
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    description:
      "A collapsible app sidebar with grouped nav sections, a sliding active-item indicator, badges, an icon-only rail mode with hover tooltips, a user footer and full keyboard navigation.",
    category: "Navigation",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Sidebar component (a collapsible app navigation rail). Props: sections ({ id, label?, items: { id, label, icon?, badge?, disabled?, onClick? }[] }[]), activeId / defaultActiveId / onActiveChange, collapsed / defaultCollapsed / onCollapsedChange, collapsible, header (a node for the logo/title, hidden while collapsed), user ({ name, subtitle?, initials?, onClick? }, an optional footer row), width (default 240), collapsedWidth (default 72), height, size (sm, md, lg), theme (\"dark\" | \"light\"). The whole panel is a rounded bordered card whose width animates with a spring between width and collapsedWidth. A header row holds the header slot and a collapse toggle (a small book/panel icon whose inner chevron flips); below it, a scrollable nav lists each section's uppercase label (fades out via AnimatePresence height+opacity when collapsing) followed by its item buttons. The active item owns a shared Motion layoutId pill that glides between buttons (even across sections) with a spring, inverting the label/icon/badge color while it's under them. Each button shows an icon, a truncated label and an optional numeric/text badge pill; collapsing hides the label and badge text but turns the badge into a small dot on the icon's corner, and wraps the button in a small self-contained portal tooltip (own mount-delay timer, no dependency on a separate Tooltip component) that shows the label to the right on hover/focus after a short delay. An optional user row is pinned at the bottom with an avatar-initials circle, name and subtitle (subtitle/name hidden while collapsed, leaving just the avatar centered). Keyboard: the nav uses a roving tabIndex over every enabled item across all sections; ArrowUp/Down move and refocus (wrapping), Home/End jump to the first/last enabled item, and Enter/native click activates a button (role=\"navigation\" on the root, aria-current=\"page\" on the active item). Keep it strictly black and white.",
  },
  {
    slug: "dock",
    name: "Dock",
    description:
      "A macOS-style app dock with cursor-proximity magnification, running-app indicator dots, hover tooltips, separators and full keyboard navigation.",
    category: "Navigation",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Dock component (a macOS-style app dock). Props: items ({ id, kind: \\\"item\\\" | \\\"separator\\\", label?, icon?, active?, disabled?, onClick? }[]), onSelect(item), size (sm, md, lg - base icon size 40/48/56), magnification (max scale multiplier, default 1.7), distance (px falloff radius the effect reaches, default 140), theme (\\\"dark\\\" | \\\"light\\\"). Render a translucent, backdrop-blurred rounded bar (role=\\\"toolbar\\\") of icon tiles bottom-aligned, tracking the mouse x position on the container with a Motion useMotionValue; each icon computes its distance from the cursor (via its own measured center) and maps that through useTransform into a size between the base size and base*magnification, smoothed with a light spring, so hovering the dock magnifies the icon under the cursor and falls off smoothly into neighbors, resetting to base size when the mouse leaves (set the motion value to Infinity). A separator entry renders as a thin vertical divider instead of a tile. Each tile shows the icon centered, an aria-pressed state and active items get a slightly brighter fill plus a small dot underneath; hovering or focusing a tile shows a small portal-based tooltip with its label above it, positioned from a measured rect (recomputed on hover/focus), matching its own mount timing rather than depending on a separate Tooltip component so the file stays self-contained. Do not use Next.js-specific styled-jsx or any framework-specific styling API, everything is inline style objects or Tailwind classes so the component drops into any React + Tailwind project. Keyboard: a roving tabIndex across enabled items (skipping separators and disabled ones); ArrowLeft/ArrowRight move and refocus (wrapping), Home/End jump to the first/last enabled item, and a focused item is magnified the same as a hovered one (independent of the mouse position) so keyboard use gets the same visual feedback. Keep it strictly black and white.",
  },
  {
    slug: "confirm-dialog",
    name: "Confirm Dialog",
    description:
      "A focused alert dialog for confirming an action, with default/warning/danger variants, an async-aware confirm button with a spinner and inline error, and a safety-first default focus.",
    category: "Overlay",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) ConfirmDialog component, portaled to document.body (an alert dialog focused purely on confirming or cancelling one action, unlike a general-purpose Modal). Props: open / defaultOpen / onOpenChange (controlled or uncontrolled), title (default \\\"Are you sure?\\\"), description, variant (\\\"default\\\" | \\\"warning\\\" | \\\"danger\\\"), icon (custom override), confirmLabel (\\\"Confirm\\\"), cancelLabel (\\\"Cancel\\\"), onConfirm() => void | Promise<void>, onCancel, closeOnBackdrop, closeOnEscape, theme (\\\"dark\\\" | \\\"light\\\"), contained (render inline with position absolute for a demo instead of a fixed portal). A blurred backdrop (AnimatePresence fade) centers a small card (max-width 400) that springs in (scale + slight y). At the top, a soft tinted circle holds a self-drawn icon whose color is the variant's accent (neutral off-white/black for default, amber for warning, coral for danger): a circle+exclamation for default, a triangle+exclamation for warning, a circle+X for danger. Title and description follow, then a footer with a bordered ghost Cancel button and a solid Confirm button colored with the variant accent. If onConfirm returns a promise, the buttons disable and the confirm button shows a spinning ring in place of nothing while it's pending, closing the dialog only once it resolves; if it rejects, both buttons re-enable and the caught error's message appears as an inline coral line above the footer (role=\\\"alert\\\"), clearing itself the next time the dialog opens. Accessibility: role=\\\"alertdialog\\\", aria-labelledby/aria-describedby, a focus trap (Tab/Shift+Tab cycle within the card, matching a plain Modal's), body scroll lock while open (skipped when contained), and Escape/backdrop-click both cancel (not just close). For a safer default, autofocus the Cancel button when variant is warning or danger, and the Confirm button otherwise. Keep it strictly black and white apart from the per-variant accent.",
  },
  {
    slug: "hover-card",
    name: "Hover Card",
    description:
      "A hover-triggered rich preview card with open/close delays, a hover bridge so moving into the card keeps it open, placement with collision flip, an optional arrow and keyboard support.",
    category: "Overlay",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) HoverCard component, portaled to document.body (a richer, slower cousin of a tooltip meant for a preview like a user profile card, not a plain text hint). Props: children (the trigger, inline), content (any rich node), open / defaultOpen / onOpenChange (controlled or uncontrolled), openDelay (default 300ms), closeDelay (default 150ms), placement (\\\"top\\\" | \\\"bottom\\\" | \\\"left\\\" | \\\"right\\\"), align (\\\"start\\\" | \\\"center\\\" | \\\"end\\\"), offset, arrow, width (default 300), theme (\\\"dark\\\" | \\\"light\\\"), disabled. The trigger is a focusable inline span (role=\\\"button\\\", tabIndex=0, aria-haspopup=\\\"dialog\\\", aria-expanded); hovering it schedules opening after openDelay, leaving it schedules closing after closeDelay, and focusing it opens immediately (delay 0) so keyboard users are not penalized. The portaled card itself also has hover handlers: entering it cancels any pending close (bridging the visual gap to the trigger) and leaving it schedules the same closeDelay, so users can move the pointer into the card to interact with its content without it disappearing. Position is measured from the trigger's rect with the same edge-aware placement flip used by a Popover (top flips to bottom near the top edge, etc.), animated in with a spring (fade + scale) from the correct transform-origin per side, with an optional rotated-square arrow whose two border sides are shown depending on placement. Escape closes it and returns focus to the trigger. Blurring the trigger only schedules a close if the newly focused element (relatedTarget) is not inside the trigger or the card, so tabbing from the trigger into a focusable element inside the card does not close it. Unmount the portal only after the exit animation completes (AnimatePresence onExitComplete). Keep it strictly black and white.",
  },
  {
    slug: "context-menu",
    name: "Context Menu",
    description:
      "A right-click context menu with checkbox and radio items, nested submenus, viewport edge clamping and full keyboard navigation.",
    category: "Overlay",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) ContextMenu component that wraps its children and opens a right-click menu, portaled to document.body. Props: items ({ id, kind: \\\"item\\\" | \\\"checkbox\\\" | \\\"radio\\\" | \\\"separator\\\" | \\\"label\\\" | \\\"submenu\\\", label?, shortcut?, checked?, disabled?, danger?, items? (nested items for a submenu) }[]), children (the area that right-click opens the menu over, wrapped in a display:contents div so it doesn't affect layout), onSelect(item), disabled, size (sm, md, lg), width (default 220), theme (\\\"dark\\\" | \\\"light\\\"). On contextmenu, preventDefault and open a small rounded bordered panel (AnimatePresence, fade + scale) at the raw click point; measure its own rendered size with a layout effect (before paint) and nudge it left/up if it would overflow the right or bottom edge of the viewport, clamped with an 8px margin. Rows render checkboxes (filled square, animated checkmark), radios (filled dot), a shortcut kbd chip, a chevron for submenu rows, dimmed disabled rows and a coral danger color, matching a Menubar's row styling. Nested submenus open as their own flyout, portaled to the body and positioned in fixed viewport coordinates measured from their trigger row's rect (not CSS-relative positioning inside the parent, since that panel scrolls and a browser can't leave one axis of overflow visible while clipping the other), on hover or ArrowRight, closing on ArrowLeft/Escape/moving elsewhere, to any nesting depth via the same panel logic. The whole menu is keyboard navigable once open (focus moves into it immediately): ArrowUp/Down roving highlight skipping separators/labels/disabled rows and wrapping, ArrowRight opens a focused submenu, ArrowLeft in a flyout closes it back to its parent, Home/End jump to the first/last row, Enter/Space or a click activates a row and calls onSelect, closing every open menu (the component does not track checked state itself, the consumer flips checked/radio values in the items array it passes back in). A second right-click, any left-click outside, Escape, or scrolling/resizing the window all close it. Keep it strictly black and white apart from the danger color.",
  },
  {
    slug: "timeline",
    name: "Timeline",
    description:
      "A vertical timeline with status markers (done, active, pending, error), a connecting line, an alternating layout option, collapsible per-item detail and a scroll-triggered staggered reveal.",
    category: "Display",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Timeline component. Props: items ({ id, title, description?, date?, icon?, status?: \\\"done\\\" | \\\"active\\\" | \\\"pending\\\" | \\\"error\\\", content? }[]), align (\\\"left\\\" | \\\"alternate\\\"), size (sm, md, lg), theme (\\\"dark\\\" | \\\"light\\\"), accentColor (default #F2A841), lineStyle (\\\"solid\\\" | \\\"dashed\\\"), animateOnView, width. Each row has a round marker and, in \\\"left\\\" align, content to its right; in \\\"alternate\\\" align a 3-column grid (content / marker / content) puts even rows on the left (right-aligned text) and odd rows on the right (left-aligned text) around a shared centered line. The marker is filled with accentColor and a check for \\\"done\\\", accentColor with a soft looping pulse ring for \\\"active\\\", coral with an X for \\\"error\\\", a hollow muted ring for \\\"pending\\\", or a plain filled dot when no status is given; a custom icon overrides the glyph. Draw the connecting line by letting the marker column stretch to match its row's tallest sibling via flex/grid default stretch (not items-start), then absolutely position the line from just under the marker to the row's bottom edge extended by the row gap, so it reaches exactly the next marker without any manual height measurement. Each row shows an optional uppercase date, a title, a description, and if item.content is given, a \\\"Show more/less\\\" toggle (chevron rotates 90deg) that expands a padded panel with AnimatePresence height+opacity. When animateOnView is true, each row fades and slides up into place via whileInView with viewport once=true and a small index-based stagger delay (capped). Keep it strictly black and white apart from accentColor and the error/pending colors.",
  },
  {
    slug: "tree-view",
    name: "Tree View",
    description:
      "A hierarchical tree with expand/collapse, tri-state checkboxes for multi-select, single-row selection, guide lines and full keyboard navigation.",
    category: "Display",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) TreeView component. Props: data (TreeNode[], each { id, label, icon?, disabled?, children? }), selectable, selectedId / defaultSelectedId / onSelectedChange (single highlighted row, independent of checkboxes), checkable, checkedIds / defaultCheckedIds / onCheckedChange (string[] of LEAF ids only, a folder's checked/indeterminate state is always derived from how many of its descendant leaves are checked, never stored on its own), expandedIds / defaultExpandedIds / onExpandedChange, showLines, size (sm, md, lg), theme (\\\"dark\\\" | \\\"light\\\"), accentColor (default #F2A841), width. Each row has, in order: an indent rail, a chevron (only for nodes with children, rotating 90deg on expand, its own click stops propagation so it does not also trigger select/check), an optional tri-state checkbox (filled square, checkmark when fully checked, a short dash when only some descendant leaves are), a folder/file icon (folder swaps to an open variant when expanded; a custom icon overrides it), and a truncated label. Clicking a row toggles its checkbox (if checkable) or its expansion (if it has children and is not checkable), and always updates the selected row if selectable. Expanding/collapsing a subtree animates its height with AnimatePresence. When showLines is true, draw literal guide lines: each ancestor level shows a continuing vertical line only if that ancestor still has a later sibling, and the row's own level gets an L-shaped connector (a vertical half down to the row's middle, then a horizontal stub to the icon) that continues straight down if the row itself is not the last child, computed purely from an ancestors-have-more-siblings boolean array threaded through the recursion, no manual height measurement. This is an ARIA tree: role=\\\"tree\\\" on the root, role=\\\"treeitem\\\" on each row with aria-level, aria-expanded, aria-selected and aria-checked (\\\"mixed\\\" for indeterminate) as appropriate, and a roving tabIndex over a flattened list of the currently visible (non-collapsed-away) enabled rows. Keyboard: ArrowUp/Down move focus over the visible rows (wrapping), ArrowRight expands a collapsed folder or moves into its first child if already expanded, ArrowLeft collapses an expanded folder or moves focus to its parent otherwise, Home/End jump to the first/last visible row, Enter/Space toggles the checkbox or expansion and updates selection exactly like a click. Keep it strictly black and white apart from accentColor.",
  },
  {
    slug: "stat-card",
    name: "Stat Card",
    description:
      "A dashboard metric card with an animated count-up value, an auto-derived good/bad trend indicator, and an interactive sharp/smooth sparkline with a hover-and-keyboard crosshair and tooltip.",
    category: "Display",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) StatCard component (a single dashboard metric tile). Props: label, value (number), previousValue (used to derive a percentage delta when delta isn't given directly), delta (percentage, overrides the derived one), deltaLabel (e.g. \"vs last month\"), trend (\"up\" | \"down\" | \"neutral\", overrides the direction the sign of delta would otherwise imply), goodDirection (\"up\" | \"down\", whether an upward trend is the good outcome, e.g. revenue, or the bad one, e.g. error rate), icon, prefix, suffix, formatValue(value) => string, sparkline (number[], a handful of recent values oldest first), sparklineStyle (\"sharp\" | \"smooth\", smooth runs a Catmull-Rom curve through every point, converted to cubic Beziers, rather than approximating them), animateValue, size (sm, md, lg), theme (\"dark\" | \"light\"), accentColor, width. A bordered rounded card's header row holds an optional icon in a softly tinted rounded-square badge (colored with accentColor, defaulting to the trend color) followed inline by the muted label, then a large bold tabular-nums value that counts up from 0 with a Motion spring/tween on mount and re-animates smoothly on value changes (drive it with useMotionValue + animate, mirrored into state via useMotionValueEvent; when animateValue is false, jump the motion value instantly with mv.jump so the same subscription still updates the displayed text without a manual setState call inside an effect), then a plain (no pill/background) trend line: a small up/down/flat arrow plus the absolute percentage, colored mint if the trend direction matches goodDirection, coral if it doesn't, or muted grey with a flat dash for \"neutral\", followed by the optional deltaLabel in a fainter color. If a sparkline array is given, render a glowing gradient area+line chart whose line draws in via an animated pathLength on mount and ends in a small pulsing dot, colored with accentColor or the trend color. The sparkline area is interactive: on mouse move (nearest-point hit testing against the container's bounding rect) or, once it's focused, on ArrowLeft/ArrowRight/Home/End, a dashed crosshair appears at the hovered/focused index together with a small floating tooltip showing that point's formatted value; the pulsing end-of-line dot only shows while nothing is hovered/focused, and re-showing it after a hover ends should not replay the initial mount delay. Give the sparkline container role=\"img\" and an aria-label summarizing the trend (from the first value to the last, plus the peak) when it has more than one point. Keep it strictly black and white apart from the trend/accent colors.",
  },
  {
    slug: "code-block",
    name: "Code Block",
    description:
      "A syntax-highlighted code block with line numbers, per-line highlighting, a filename/language header, a copy button and a collapsible fade-out for long snippets.",
    category: "Display",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) CodeBlock component with a small built-in regex-based syntax highlighter (no external highlighting library). Props: code (string), language (default \\\"text\\\"; javascript/typescript/jsx/tsx/python/bash/json/yaml/go/rust get real highlighting, aliases like js/ts/py/sh normalize to the base language, anything else renders as plain text), filename, showLineNumbers, highlightLines (number[], 1-indexed), wrapLines, copyable, maxHeight, size (sm, md, lg), theme (\\\"dark\\\" | \\\"light\\\"), width. A rounded bordered card has an optional header (filename in a mono font, or the uppercase language name, on the left; a copy button on the right that writes the raw code to the clipboard via navigator.clipboard, wrapped in a try/catch since it can be blocked inside an embedded frame, and swaps its icon and label between a clipboard glyph/\\\"Copy\\\" and a checkmark/\\\"Copied\\\" for about 1.6s via an AnimatePresence crossfade). The body renders one flex row per line: a sticky, unselectable, right-aligned line-number gutter sized to the widest number, then a <code> cell; per line, a small hand-rolled tokenizer finds (in order) a line comment (// or #, language-dependent) to the end of the line, then quoted/backtick strings, then numbers, then a language keyword list, coloring each a distinct token color (comment italic and muted, string mint, number amber, keyword a soft violet) while everything else stays the base text color. A row listed in highlightLines gets a tinted background and a colored left bar (spanning the gutter too). Long code (wrapLines false) scrolls horizontally with the gutter staying stuck to the left via position sticky; wrapLines true wraps instead. If maxHeight is set and the rendered content actually exceeds it, clip the body to that height with a bottom gradient fade and add a \\\"Show more\\\"/\\\"Show less\\\" toggle (chevron rotates 180deg) below it that expands/collapses the clip, and only add that affordance when the content genuinely overflows (measure scrollHeight against maxHeight in an effect). Keep everything else strictly black and white, only the syntax token colors and the accent are exceptions.",
  },
  {
    slug: "description-list",
    name: "Description List",
    description:
      "A semantic term/value list for specs, order summaries or profile details, with stacked, inline and grid layouts, optional icons and a hover-reveal copy button per row.",
    category: "Display",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) DescriptionList component: a semantic <dl> for term/value pairs (specs, an order summary, profile details). Props: items ({ id, term, description (ReactNode), icon?, copyValue?, copyable? }[]), layout (\\\"stacked\\\" | \\\"inline\\\" | \\\"grid\\\"), title, bordered, dividers, columns (for grid, default 2), size (sm, md, lg), theme (\\\"dark\\\" | \\\"light\\\"), accentColor, width. Render a <dl> (optionally wrapped in a bordered rounded card with a title above it) containing one wrapper <div> per item, this is valid HTML5 (a dl may contain div wrappers around dt/dd pairs) and lets each row carry its own border. \\\"stacked\\\" puts a small uppercase muted term above a larger value; \\\"inline\\\" puts the term on the left and right-aligns the value opposite it on the same row; \\\"grid\\\" arranges items into `columns` stacked-style columns via CSS grid and never shows row dividers (only stacked/inline do, controlled by `dividers`, a bottom border on every row but the last). An item's optional icon renders in a small rounded-square chip before its term. When an item has copyValue (or copyable is true and description is a plain string), a small copy button fades in on row hover or keyboard focus-within next to the value, writes the value to the clipboard via navigator.clipboard in a try/catch (it can be blocked inside an embedded frame), and swaps its icon between a clipboard glyph and a checkmark for about 1.4s via an AnimatePresence crossfade; while that confirmation is showing, force the button's fade wrapper visible even if the pointer already left the row, so the checkmark doesn't vanish before the user sees it. Keep it strictly black and white apart from an optional accentColor on the title.",
  },
  {
    slug: "splitter",
    name: "Splitter",
    description:
      "Resizable panels divided by draggable handles, with min/max size constraints, keyboard resizing, double-click reset, and horizontal or vertical layout.",
    category: "Layout",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Splitter component: N resizable panels divided by N-1 draggable handles. Props: panels ({ id, content (ReactNode), defaultSize? (percentage, all panel defaults are normalized to sum to 100), minSize? (default 10), maxSize? (default 90) }[]), direction (\\\"horizontal\\\" | \\\"vertical\\\"), sizes / onSizesChange (controlled percentages array, one per panel), theme (\\\"dark\\\" | \\\"light\\\"), accentColor, height, width. Panels are flex children whose flex-grow is set to their current size value (flex-basis 0%) rather than a literal CSS percentage of the container, that's what lets a handle's own fixed pixel thickness (a constant shared between the handle's sizing and the drag math) come out of the container's space first, with the panels sharing exactly what's left in their proportions, instead of every panel's percentage-of-container width adding up past 100% and overflowing past the handles. Each handle is a thin 1.5px line inside a wider (about 13px) invisible drag/hover hit area; hovering, focusing or dragging it fades in a small rounded knob with three grip dots and recolors the line and knob with accentColor. Dragging (pointer capture, so the drag continues even if the cursor leaves the handle) computes the pointer's movement as a percentage of the container's cross-axis size (minus the total width of all handles) and resizes the two adjacent panels as a pair: growing one shrinks the other by the same amount, each clamped to its own min/max, with any clamped overflow pushed back onto its neighbor rather than lost, so the pair's combined size stays constant. Give each handle role=\\\"separator\\\" with aria-orientation, aria-valuemin/max/now (the size of the panel before it), and keyboard support: the arrow key along the split axis resizes by 2% (10% with Shift), Home/End jump a panel to its min/max, and Enter (or double-clicking the handle) resets that pair back to their original default sizes. Keep it strictly black and white apart from accentColor.",
  },
  {
    slug: "back-to-top",
    name: "Back to Top",
    description:
      "A floating scroll-to-top button that fades in past a threshold, with an optional progress ring showing how far down the page you are.",
    category: "Misc",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) BackToTop component: a floating round button that scrolls its target back to the top. Props: threshold (px scrolled before it appears, default 400), showProgress, smooth, containerRef (a ref to a scrollable element; defaults to the window when omitted), icon, label (default \\\"Back to top\\\", used as aria-label), position (\\\"bottom-right\\\" | \\\"bottom-left\\\" | \\\"bottom-center\\\"), offset (px from the edge), size (sm, md, lg), theme (\\\"dark\\\" | \\\"light\\\"), accentColor, contained (position: absolute within a relative-positioned parent instead of position: fixed to the viewport, for embedding in a demo), className. Track scroll position on the target (window or the given element) with a passive, rAF-throttled scroll listener (and a resize listener, since the scrollable height can change): show the button once scrolled past threshold, and if showProgress is on, compute progress as scrollTop over (scrollHeight minus clientHeight) for that target. The button is a circular bordered card that springs in (scale + fade + slight rise) via AnimatePresence when it becomes visible and springs out the same way when scrolled back above the threshold, lifts slightly on hover and shrinks on press; clicking calls scrollTo({ top: 0, behavior: smooth ? \\\"smooth\\\" : \\\"auto\\\" }) on the target. When showProgress is true, an SVG ring behind the icon (a faint full circle plus an accent-colored arc using strokeDasharray/strokeDashoffset, rotated to start at 12 o'clock, with a lightweight CSS transition rather than a spring since it just needs to track scroll smoothly) fills clockwise as the page is scrolled down. Keep it strictly black and white apart from the accent-colored progress arc.",
  },
  {
    slug: "copy-button",
    name: "Copy Button",
    description:
      "A standalone copy-to-clipboard button with ghost/outline/solid variants, icon-only or labeled modes, a floating tooltip, and animated copied/error states.",
    category: "Misc",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) CopyButton component. Props: value (a string, or a sync/async function returning one, resolved lazily on click), label (omit for an icon-only button), copiedLabel (\\\"Copied\\\"), errorLabel (\\\"Failed to copy\\\"), variant (\\\"ghost\\\" | \\\"outline\\\" | \\\"solid\\\"), size (sm, md, lg), theme (\\\"dark\\\" | \\\"light\\\"), accentColor, resetDelay (ms before it reverts to idle, default 1600), showTooltip (icon-only buttons show a small portal-based tooltip on hover/focus with \\\"Copy\\\", \\\"Copied\\\" or \\\"Failed to copy\\\"), onCopy(value), onError(error), disabled. Clicking resolves the value, calls navigator.clipboard.writeText, and on success springs the icon (clipboard glyph) into a mint checkmark with a brief scale+rotate transition via AnimatePresence, showing copiedLabel as the button's text if a label was given; on failure (the clipboard API can be blocked inside an embedded frame, or the value function can throw/reject) it springs into a coral X and shows errorLabel instead, calling onError. Either state auto-reverts to idle after resetDelay, and repeat clicks are ignored while a state other than idle is showing. Ghost has a transparent background that fills in on hover; outline keeps a border (colored to match the current state); solid is a filled button with inverted text color; all three recolor to mint/coral while showing the copied/error icon. Keep it strictly black and white apart from the copied/error accent colors.",
  },
  {
    slug: "terminal",
    name: "Terminal",
    description:
      "A macOS-style terminal window that types out a scripted sequence of commands, outputs and comments, with a blinking cursor, auto-scroll and optional looping or manual replay.",
    category: "Misc",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Terminal component: a decorative macOS-style terminal window that plays back a scripted sequence. Props: lines ({ id, type: \\\"command\\\" | \\\"output\\\" | \\\"comment\\\", text, typingSpeed?, pauseAfter? }[]), title (window title, default \\\"zsh\\\"), prompt (default \\\"$\\\"), autoPlay, loop, typingSpeed (default ms per character), lineDelay (default pause between lines), startDelay, showControls (the red/yellow/green traffic-light dots), size (sm, md, lg), theme (\\\"dark\\\" | \\\"light\\\"), accentColor, width, height. Drive playback with a sequential setTimeout chain (not setInterval): each \\\"command\\\" line types in character by character at typingSpeed (or its own override) with a blinking block cursor at the caret while it's the active line; \\\"output\\\" lines appear in full at once (dimmed, no prompt); \\\"comment\\\" lines appear in full, italic and muted, prefixed with \\\"# \\\". After each line finishes, wait pauseAfter (or lineDelay, halved for non-command lines) before starting the next. Guard every scheduled callback with a \\\"generation\\\" counter that increments whenever the lines/autoPlay/loop props change or the component unmounts, so stale timers from a previous run can't keep mutating state; store pending timeout ids in a ref and clear them all on cleanup. When loop is true, finishing the last line schedules the whole sequence to restart after a longer pause, call back into the latest play function through a ref (assigned in its own effect after each render) rather than a raw self-reference, since the loop-restart timer closes over the function from deep inside its own timer chain, before that binding would otherwise be fully initialized. When loop is false, finishing shows a small replay icon button in the header that reruns the sequence from the top on click. Auto-scroll the body to the bottom as lines are added (only meaningful once content exceeds the fixed height). Keep everything else strictly black and white; the three traffic-light dots keep their real red/yellow/green since they're recognizable OS chrome, not a semantic accent.",
  },
  {
    slug: "inline-edit",
    name: "Inline Edit",
    description:
      "Click-to-edit text that turns into an auto-sizing input with save/cancel controls, validation, async save support and a shake on error.",
    category: "Misc",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) InlineEdit component: text that looks static until clicked, then turns into an editable field in place. Props: value / defaultValue / onSave(value) => void | Promise<void> (controlled or uncontrolled), onCancel, placeholder, multiline, maxLength, validate(value) => string | null | undefined (return an error message to block saving), showButtons (check/x buttons next to the field), editOnClick (clicking the text itself starts editing; when false, only a dedicated pencil button does, and the row must then be a plain span rather than a button, since an interactive element can't contain another one), size (sm, md, lg), theme (\\\"dark\\\" | \\\"light\\\"), accentColor, emptyText (shown italic/muted when there's no value yet). Idle state is a row with the text (or emptyText) and a pencil icon that fades in on hover/focus; clicking enters edit mode, focusing the input and placing the caret at the end. A single-line edit uses an <input> whose width tracks its own content (measured off an invisible same-font mirror span) rather than stretching to fill its container; a multiline edit uses a <textarea> where Enter inserts a newline and Cmd/Ctrl+Enter saves. Escape always cancels and reverts to the last committed value; blurring the field also attempts to save (skipped while a save is already in flight). On save, run validate first, a failure sets an inline error message below the field and imperatively replays a shake animation via useAnimationControls (not a keyframes array behind a remounting key, since remounting the field to replay the animation would also blow away focus and any text the user was about to fix) without ever touching the input's focus; otherwise call onSave, and if it returns a promise, show a spinner in place of the check icon and disable the field until it settles, showing a caught error inline (and shaking again) on rejection instead of exiting edit mode. Keep it strictly black and white apart from accentColor and the error/success colors.",
  },
  {
    slug: "aspect-ratio",
    name: "Aspect Ratio",
    description:
      "A container that locks its content to a fixed width/height ratio (a preset like video or square, or a custom number), auto-fitting a single image or video child.",
    category: "Layout",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS AspectRatio component (no animation needed, just clsx and tailwind-merge): a container that locks its content to a fixed width/height ratio using the native CSS aspect-ratio property, so images, video embeds or map placeholders never cause layout shift while loading. Props: ratio (a number like 16/9, overrides preset when given), preset (\\\"square\\\" | \\\"video\\\" | \\\"portrait\\\" | \\\"wide\\\" | \\\"golden\\\", mapped to 1, 16/9, 3/4, 21/9 and 1.618, default \\\"video\\\"), children, objectFit (\\\"cover\\\" | \\\"contain\\\" | \\\"fill\\\" | \\\"none\\\"), radius, bordered, theme (\\\"dark\\\" | \\\"light\\\"), width. The root is a relatively positioned, overflow-hidden div with style aspect-ratio set from the resolved ratio; when the single child is exactly an <img> or a <video> element, clone it (React.cloneElement) to add h-full w-full and the matching object-{fit} class (merging with any className it already had) so it fills the box correctly without the caller needing to remember those utility classes themselves, while any other kind of children just render centered as-is. With no children, show a faint placeholder background instead of a transparent hole so the reserved space is visible even before content loads. Keep it strictly black and white.",
  },
  {
    slug: "scroll-area",
    name: "Scroll Area",
    description:
      "A scrollable container with a thin, draggable, auto-hiding custom scrollbar (vertical, horizontal or both) and edge fade masks, replacing the native browser scrollbar.",
    category: "Layout",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) ScrollArea component: a scrollable region with its own thin, styled, draggable scrollbar instead of the browser's native one. Props: children, direction (\\\"vertical\\\" | \\\"horizontal\\\" | \\\"both\\\"), height, width, alwaysVisible (keep the custom scrollbar visible instead of auto-hiding it), showFadeMask, theme (\\\"dark\\\" | \\\"light\\\"), accentColor, size (sm, md, lg, scrollbar thickness), className. The actual scrolling still happens on a real, natively-scrollable, tabIndex=0 div (so wheel, trackpad, touch, momentum and keyboard scrolling all keep working for free and nothing needs to be reimplemented), its native scrollbar is hidden both ways at once, since no single CSS property covers every engine: scrollbarWidth: \\\"none\\\" for Firefox, and a Tailwind arbitrary-variant class targeting the vendor ::-webkit-scrollbar pseudo-element for Chrome/Safari (not an injected <style> tag, which would need a per-instance generated class to avoid leaking a shared selector across multiple ScrollAreas on the page). Track scroll position, size and content size via a scroll listener plus a ResizeObserver and MutationObserver (content can resize or change), and render an absolutely positioned custom thumb whose length is proportional to visible/total content and whose offset matches the scroll fraction, exactly the way a native scrollbar works. The thumb is a real drag handle: pointer down captures the pointer and records the starting pointer position and scroll offset, and pointer move converts pixel movement into a proportional scrollTop/scrollLeft change on the real scrolling div, write these as plain (non-curried) event handlers, since a lint rule flagging ref writes during render can't always see through a curried \\\"(axis) => (event) => ...\\\" handler factory to confirm the *returned* closure only ever runs from a real event. The scrollbar fades in on hover, scroll or drag and fades back out after roughly 900ms of inactivity unless alwaysVisible is set; a soft gradient mask fades the content near each scrollable edge, only shown while there's actually more content in that direction (hidden right at the start/end). Keep it strictly black and white apart from accentColor on the active/dragged thumb.",
  },
  {
    slug: "toolbar",
    name: "Toolbar",
    description:
      "An accessible toolbar of icon buttons, toggles, radio-style toggle groups and separators with roving-focus arrow-key navigation, a sliding hover highlight and animated tooltips.",
    category: "Layout",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Toolbar component following the WAI-ARIA toolbar pattern: a compact row (or column) of icon buttons, toggle buttons and separators, like an editor's formatting bar. Props: items (an array of entries: {type:\"button\", id, label, icon, text, shortcut, disabled, onClick} | {type:\"toggle\", id, label, icon, text, shortcut, disabled, group} | {type:\"separator\"}), value / defaultValue / onValueChange (the ids of currently pressed toggles, controlled or uncontrolled), orientation (\"horizontal\" | \"vertical\"), variant (\"solid\" | \"floating\" | \"ghost\"), size (\"sm\" | \"md\" | \"lg\"), radius, showTooltips, theme (\"dark\" | \"light\"), accentColor, ariaLabel, className. Toggles that share a `group` string behave like a radio set (pressing one un-presses its siblings, and the pressed one can't be toggled off); toggles without a group flip independently. `icon` accepts either the name of a built-in stroke icon (bold, italic, underline, strike, alignLeft, alignCenter, alignRight, link, code, list, undo, redo, image, share, comment, more) or any ReactNode; export a small ToolbarIcon component for the built-ins so the whole thing stays one self-contained file. Accessibility: role=\"toolbar\" with aria-orientation and aria-label, toggles use aria-pressed, separators use role=\"separator\" with the opposite orientation, and the whole toolbar is ONE tab stop using a roving tabindex, ArrowLeft/ArrowRight (ArrowUp/ArrowDown when vertical) move focus with wrap-around, Home/End jump to the ends, disabled items are skipped, and the last focused item is remembered as the tab stop. Implement the arrow keys by querying the enabled [data-toolbar-item] buttons inside the root ref from the keydown handler. Motion: a single shared hover highlight slides between buttons using a motion layoutId made unique per instance with React.useId() (render it only while an item is hovered and not pressed); buttons squish with whileTap scale 0.92 on a spring; pressed toggles tint their background with color-mix(in srgb, accentColor 16%, transparent) and take the accent as text color. Tooltips show the label plus an optional muted shortcut, appearing after ~380ms of hover or instantly on keyboard focus-visible (check e.currentTarget.matches(\":focus-visible\") in onFocus), placed below the item when horizontal and to the right when vertical, with AnimatePresence fade + 4px slide, since Motion owns `transform`, center the tooltip with an absolutely positioned flex wrapper and only animate x/y on the inner motion.div. The bar uses flex-wrap so it never overflows a narrow screen. Keep it black and white apart from accentColor on pressed toggles and the focus ring.",
  },
  {
    slug: "panel",
    name: "Panel",
    description:
      "A surface container with an optional header (icon, title, description, actions), body and footer, with outline, filled and elevated variants and an animated collapse.",
    category: "Layout",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) Panel component: a general-purpose surface container with an optional header, body and footer, like a settings card or dashboard widget. Props: title, description, icon (small leading element shown in a rounded square), actions (ReactNode on the right of the header), children (body), footer, collapsible, defaultCollapsed, collapsed + onCollapsedChange (controlled or uncontrolled), variant (\"outline\" | \"filled\" | \"elevated\"), padding (\"sm\" | \"md\" | \"lg\"), dividers (hairlines between header, body and footer), accentBar (a 2px accent line along the top edge), maxBodyHeight (cap the body and scroll it), radius, theme (\"dark\" | \"light\"), accentColor, width, className. Render it as a <section> with overflow hidden. When collapsible, the title/description area becomes a real <button> with aria-expanded and aria-controls (linked to the body id built from React.useId()), a hover background and a focus-visible ring in accentColor, and a chevron that rotates 180deg on a spring, but the `actions` slot must be a SIBLING of that button, never inside it, so actions stay independently clickable and there are no nested interactive elements. Animate the collapse by rendering the body inside AnimatePresence (initial={false}) as a motion.div going from {height: 0, opacity: 0} to {height: \"auto\", opacity: 1} with a spring on height and a short fade, overflow hidden, and include the footer inside that same collapsing region; the header divider should only draw while the body is open. Use useReducedMotion to make the transition instant. If there are no children or no header, simply omit those regions. Keep it strictly black and white apart from accentColor on the accent bar and focus ring.",
  },
  {
    slug: "your-cart-page",
    name: "Your Cart Page",
    description:
      "A three-step eCommerce flow in one block: a cart with quantity steppers and promo code, a checkout form with an order summary, and an animated order-confirmed screen.",
    category: "eCommerce",
    type: "block",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) YourCartPage block: a three-step eCommerce flow in a single component, 1) cart, 2) checkout form, 3) order confirmation, with a step indicator on top. Props: items ({title, variant, price (text like \"$249.00\"), image}[]), heading, checkoutLabel, payLabel, confirmTitle, confirmBody, orderNumber, shippingAmount, taxRate (0.08 = 8%), currency, promoCodes (string[], each takes 10% off, compared case-insensitively), defaultValues (Partial form values), defaultStep (1 | 2 | 3), animation (\"blur\" | \"slide\" | \"fade\" | \"scale\"), animationDuration, onPay(order), onViewOrder, onContinueShopping, theme (\"dark\" | \"light\"), accentColor, className. Top row: right-aligned \"Step N of 3\" (aria-live) and a 148x8 role=\"progressbar\" track whose accent-colored fill animates its width to N/3. Steps swap inside AnimatePresence mode=\"wait\" keyed by the step; the enter/exit variants per animation are blur = y 40 + blur(12px) in, y -16 + blur(8px) out; slide = y 48 in, y -28 out; fade = opacity; scale = 0.75 in, 0.92 out. Respect useReducedMotion by zeroing durations and skipping initial. Step 1: an h1, then a two-column grid on wide containers (1.35fr list, 320px totals): a bordered list of rows, each with a 64px rounded thumbnail (grey fallback), title, muted variant, a pill quantity stepper (minus / count / plus, aria-labels naming the product, 0-99), the line price and a square remove button with an SVG icon. Removing (quantity 0) hides the row; an empty cart shows a message and disables Checkout. On narrow containers the row becomes thumbnail + text, with the stepper, price and remove button on a second line, do that with a wrapper that uses display: contents on wide containers so all five cells still sit on one grid row. The totals card lists Subtotal, Shipping, an optional \"Discount (10%)\" line, Tax, a divider, a big bold Total, a rounded promo-code input with an Apply text button (a valid code shows a status message in the accent color and edits to the field clear it), and a full-width white pill Checkout button. All amounts are formatted as \"$ 249.00\" (currency, a space, two decimals) and derived from the parsed unit prices, promo, tax rate and shipping. Step 2: an h1 \"Contact\" with Email and Phone fields, an h2 \"Shipping Address\" with Full name, Address, City / State on one row and ZIP, an h2 \"Payment\" with Card number and Expiration / CVC on one row (proper type, name, autocomplete and inputMode attributes, labels wrapping the inputs, rounded-xl fields with a faint fill and an accent focus ring). Beside it a 340px bordered ORDER SUMMARY card: each item with a 48px thumbnail, title, variant, \"Qty: N\" and its price, a divider, smaller Subtotal / Shipping (\"Free\" when 0) / Tax rows, a big Total, the Pay Now button and a centered \"Secure checkout\" caption. Pay calls onPay with the full order (items, subtotal, discount, shipping, tax, total, orderNumber, customer values) and moves to step 3. Step 3: a 76px accent check-in-circle SVG whose circle and tick draw themselves with motion pathLength (0.7s, then 0.5s delayed 0.35s), an h1 confirm title, muted body text, \"Order number <strong>#ORD-48291</strong>.\", a bordered ORDER SUMMARY card with 40px thumbnails and a Total, and two pill buttons: an outlined View Order (onViewOrder) and a white Continue Shopping that calls onContinueShopping and returns to step 1. Do not ship a theme toggle or any demo UI, theme and animation are ordinary props. Use container queries (@container on the root, @[920px]: for the two-column layouts) instead of viewport breakpoints. Palette: dark canvas #0A0A0A with 12% white borders and a #1A1A1A thumbnail fallback, light canvas #FFFFFF; black and white apart from accentColor (default #7CDE6A) on the progress fill, the check icon, the promo message and focus rings.",
  },
  {
    slug: "stat-feature",
    name: "Stat Feature",
    description:
      "A metrics section with a concentric ring chart, a trend caption and count-up stats that enter with a blur, slide, fade or scale animation.",
    category: "Stats",
    type: "block",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) StatFeature block: a metrics section with a centered header, a concentric ring chart on the left and a column of big count-up stats on the right. Props: badge, title, description, rings ({value 0-100, color}[]), chartCaption, chartSubcaption, showTrend, trendText, stats ({number, suffix, label}[]), theme (\"dark\" | \"light\"), animation (\"blur\" | \"slide\" | \"fade\" | \"scale\"), animationDuration (seconds), countDuration (ms), staggerDelay (ms), replayOnReenter, titleSize, descriptionSize, titleFontFamily (default a Georgia serif stack), uiFontFamily (default Helvetica Neue), className. Header: a pill badge (uppercase, 11px, 0.1em tracking, translucent fill and border), a serif h2 at titleSize with -0.03em tracking and a muted description. Chart: an SVG (viewBox 280, role=\"img\" with a <title> and a <desc> that lists every ring's percentage, ids from React.useId()) with one track circle plus one progress circle per ring, each ring 14px thick with a 10px gap, drawn inside a group rotated -90deg so it starts at 12 o'clock, round line caps, and a small filled dot in the center taken from the last ring's color. Animate the progress circles with motion.circle pathLength from 0 to value/100 over 1.4s with delay 0.22s (opacity 0 to 1 together), do not drive it with requestAnimationFrame plus setState. Below the chart a figcaption shows the trend text followed by an aria-hidden arrow and then the caption and subcaption. Entrance: every block (header, chart figure, each stat row) is a motion element that starts hidden and animates to visible once the section is in view, useInView on the root with amount 0.15, once unless replayOnReenter. The hidden/shown states per animation are blur = opacity 0, y 24, blur(10px); slide = opacity 0, y 32; fade = opacity only; scale = opacity 0, scale 0.9, all with ease [0.16, 1, 0.3, 1] and the given duration, staggered at 60ms (header), 220ms (chart) and 380ms + i*staggerDelay (stats). Put key={animation} on the inner content so switching the animation remounts it and replays the entrance. With prefers-reduced-motion (useReducedMotion) skip all of it: initial={false} and show the final numbers immediately. Count-up: a CountUp component that renders the target's zero (\"0\", or \"0.0\" style when the number has decimals), and in an effect calls motion's animate(0, target, {duration, delay, ease: easeOutExpo, onUpdate}) writing el.textContent through a ref, no setState per frame, and returns controls.stop() as cleanup; non-numeric values are shown as is. Stat rows show the number in the serif face at 36px (42px on wide containers) with a smaller suffix next to it and a muted label underneath. Use container queries, not viewport breakpoints: @container on the root and @[720px]: to switch to the two-column 1.1fr/0.9fr grid, larger chart (280px vs 240px), larger type and padding; drive the title and description sizes from CSS variables so mobile sizes can be computed as calc(var(--sf-title)*0.7) with a 28px floor. Do not include a demo toolbar, theme and animation are ordinary props. Palette: dark canvas #0A0A0A with white text at 50-65% for secondary copy, light canvas #FFFFFF with #121212; the ring colors are the only chromatic elements.",
  },
  {
    slug: "product-list",
    name: "Product List",
    description:
      "An eCommerce product listing block with a filter sidebar (live search, Free/Premium tiers, categories) and a responsive photo grid with New and Sale badges.",
    category: "eCommerce",
    type: "block",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) ProductList block: an eCommerce product listing with a filter sidebar on the left and a photo grid of product cards on the right. Props: products ({title, price, compareAtPrice, category, tier (\"free\" | \"premium\"), badge (\"new\" | \"sale\"), image, url}[]), searchPlaceholder, priceLabel, categoriesLabel, allLabel, accentColor, theme (\"dark\" | \"light\"), onProductClick(product), className. Sidebar (a 240px bordered card that is sticky on wide containers): a rounded search box with a magnifier icon that filters by title or category as you type; a PRICE group with two radio-style toggle rows, Free and Premium, each showing its count (clicking the active row clears it; hide the whole group when no product has a tier); a divider; and a CATEGORIES group with an \"All Products\" row plus one row per distinct category, derived from the products with counts. Every row is a button with aria-pressed, and the active row is drawn in accentColor including its count and, for the tier rows, a filled dot. Grid: three columns on wide containers, two on medium, one on narrow, use container queries, not viewport breakpoints (put @container on the root and switch with @[560px]: and @[900px]:; the sidebar/grid split happens at @[900px]:, where the sidebar becomes a fixed 240px column and stacks on top on narrow containers). Each card is an <a role=\"listitem\"> with a 170px image area (object-cover, slowly zooms to 1.04 on hover), an optional pill badge in the top-left (\"New\" filled with accentColor and dark green text; \"Sale\" filled white in dark mode or near-black in light mode), the title, and the price with an optional struck-through compare-at price. Cards fade in and rise 10px with a stagger of 30ms capped at the 8th card, and the hover state brightens the border via a CSS variable (hover:[border-color:var(--pl-hover)]) since inline styles cannot express :hover. When nothing matches, show a dashed empty state with the text \"No products match your filters\" and a Clear filters button that resets the search, tier and category. Palette: dark canvas #0A0A0A, cards rgba(255,255,255,0.03) with a 12% white border, image fallback #161616; light canvas #FFFFFF with the same structure in black alpha. Keep it black and white apart from accentColor and the keyboard focus rings (--tw-ring-color).",
  },
  {
    slug: "product-detail",
    name: "Product Detail",
    description:
      "An eCommerce product page block with a switchable image gallery, color and size pickers, quantity stepper, animated add-to-cart button and Description / Specs / Reviews tabs.",
    category: "eCommerce",
    type: "block",
    free: true,
    prompt:
      "Build a React + Tailwind CSS + Motion (motion/react) ProductDetail block: an eCommerce product page section with a two-column layout (gallery on the left, purchase info on the right) and an information tabs area underneath. Props: breadcrumb (string[]), title, rating (0-5), reviewCount, price, compareAtPrice, description, longDescription, reviewsBody, gallery ({src, alt}[]), colors ({name, color}[]), sizes (string[]), specs ({label, value}[]), defaultColorIndex, defaultSizeIndex, defaultTab (\"description\" | \"specs\" | \"reviews\"), buttonLabel, badge (a small accent-tinted pill with a truck icon shown next to the price, e.g. \"Free shipping\"), onAddToCart(selection: {color, size, quantity}), theme (\"dark\" | \"light\"), accentColor, className. Gallery: a square main image with a soft crossfade when you pick another thumbnail (AnimatePresence mode=\"popLayout\", opacity only, so Motion does not fight Tailwind's hover zoom scale) and a slow 1.04 hover zoom, plus up to four square thumbnail buttons below it (aria-pressed, the active one gets a 1.5px title-colored border and full opacity, the rest sit at 60%). Info column: a breadcrumb <nav> rendered from the array with \"/\" separators and aria-current on the last item, an <h1> title, five SVG stars (filled up to the rounded rating, role=\"img\" with an aria-label) followed by \"(N reviews)\", the price with an optional struck-through compare-at price, the short description, then the pickers. Color swatches are 22px circles in a role=\"radiogroup\"; the selected swatch gets a double ring drawn with box-shadow (a gap in the page background color, then a title-colored ring) and the label above shows \"Color: <name>\". Sizes are pill buttons in a second radiogroup with a filled active pill. Both groups use roving tabindex and Left/Right/Up/Down arrows that select and focus the next option with wrap-around, implement that with one shared keydown helper that reads the sibling [role=\"radio\"] elements from the event's parent. A pill-shaped quantity stepper (minus disabled at 1, max 99, aria-live count) and a full-width pill Add to Cart button with a cart SVG icon (no emoji) and a semibold (600) label. Clicking it calls onAddToCart with the current selection and switches the label to a check icon plus \"Added to cart\" for 1.8 seconds, keep the timeout id in a ref and clear it in an unmount effect, never call setState from an effect. The button also squishes with whileTap scale 0.98. Tabs (Description / Specs / Reviews; hide a tab when its content is empty): role=\"tablist\" with roving tabindex and Left/Right arrow keys, a sliding 2px underline shared between tabs using a motion layoutId built from React.useId(), and the panel content crossfading with AnimatePresence mode=\"wait\". Specs render as a <dl> in two columns on wide containers (label muted, value in the title color, 140px label column). Use container queries instead of viewport breakpoints: put @container on the root <section> and switch layouts with @[900px]: variants (two columns, 42px title, 40px side padding), so it also works inside a narrow preview frame. Palette: dark canvas #0A0A0A, light #FFFFFF, image card #161616 / #F2F2F2, white or #111 primary button. Keep it black and white apart from accentColor on the shipping badge (text plus a color-mix 14% tint background) and the keyboard focus rings (--tw-ring-color).",
  },
  {
    slug: "button",
    name: "Button",
    description:
      "An accessible button with primary, secondary, outline, and ghost variants, a spinning loading state, optional left/right icon, and a focus ring, every color, size, and timing exposed as a prop.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a React + Motion (Framer Motion) + Tailwind CSS button component with a `label` prop for its text, an `onClick` handler, and an HTML `type` (button | submit | reset). Support four visual variants: primary (solid accent background), secondary (solid neutral background), outline (transparent with a colored border), and ghost (transparent, no border, colored text only), all driven by an `accentColor` prop plus separate colors for secondary and text-on-accent. Support a `disabled` state (dimmed, not clickable) and a `loading` state that swaps the leading icon for a spinning ring, sets aria-busy, and disables the button without changing its size. Support an optional icon on the left or right of the label. Animate a subtle scale-up on hover and scale-down on press using Motion, and show a colored focus ring (via boxShadow, tracked with onFocus/onBlur state, not just CSS :focus) for keyboard users. Expose height, horizontal padding, font size, corner radius, icon/label gap, border width, ring color/width, and animation duration as props so every dimension and color can be themed, with sensible defaults derived from the height when not set. Support fullWidth to stretch to 100% of the container.",
  },
  {
    slug: "input",
    name: "Input",
    description:
      "An accessible text input with outline, filled, and underline variants, label/helper/error text, a password show/hide toggle, and a focus ring, every color, size, and timing exposed as a prop.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a controlled/uncontrolled React + Motion (Framer Motion) + Tailwind CSS text input component (value, defaultValue, onChange(value) props) supporting the standard HTML input types (text, email, password, number, search, tel, url). Support three visual variants: outline (full border), filled (tinted background with a bottom border), and underline (bottom border only), driven by a `variant` prop. Support an optional label above the field (with an optional-text suffix, a required-field asterisk, and an info icon with a tooltip, matching a sibling Checkbox component's label row), helper text below the field, and an error state (errorText prop) that overrides the border/ring/helper color with an error color and swaps the helper text for the error message. When type is \"password\", automatically show a trailing eye / eye-off icon button that toggles the input between masked and plain text, unless a custom trailing icon is supplied. Support optional leading and trailing icons otherwise. Show a colored focus ring (via boxShadow, tracked with onFocus/onBlur state, not just CSS :focus) and style the native placeholder color via a CSS custom property so it can be themed too. Expose height, horizontal padding, font size, corner radius, border width, and every color (border, background, text, placeholder, label, helper, required, error, accent, ring) as props, with sensible defaults derived from height when not set. Keep it accessible: label linked via htmlFor/id, aria-invalid when there's an error, and aria-describedby pointing at the helper/error text.",
  },
  {
    slug: "textarea",
    name: "Textarea",
    description:
      "An accessible textarea with outline, filled, and underline variants, label/helper/error text, optional auto-resize and a character counter, and a focus ring, every color, size, and timing exposed as a prop.",
    category: "Form",
    type: "element",
    free: true,
    prompt:
      "Build a controlled/uncontrolled React + Motion (Framer Motion) + Tailwind CSS textarea component (value, defaultValue, onChange(value) props), matching the same design language as a sibling Input component: the same three visual variants (outline with a full border, filled with a tinted background and bottom border, underline with only a bottom border), the same label row (label text, an optional-text suffix, a required-field asterisk, an info icon with a tooltip), the same helper text and error-state handling (an errorText prop that overrides the border/ring/helper color with an error color and replaces the helper text), and the same colored focus ring driven by onFocus/onBlur state via boxShadow rather than CSS :focus, plus a placeholder color themed through a CSS custom property. Add textarea-specific features: a `rows` prop for the default height, an `autoResize` boolean that grows the textarea's height to fit its content as the user types (no scrollbar) instead of a fixed row count, a `maxLength` prop, and a `showCounter` boolean that renders a right-aligned \"12 / 200\" (or just \"12\" without a max) character counter next to the helper/error text. Expose a `resize` prop (none | vertical | both) for when autoResize is off. Expose padding, font size, corner radius, border width, and every color (border, background, text, placeholder, label, helper, required, error, accent, ring) as props. Keep it accessible: label linked via htmlFor/id, aria-invalid when there's an error, and aria-describedby pointing at the helper/error/counter row.",
  },
  {
    slug: "sales-ticket-popup",
    name: "Sales Ticket Popup",
    description:
      "A corner-anchored promo popup shaped like a torn event ticket, with 5 themes, a zigzag badge stub, immediate/delay/scroll triggers, auto-hide, and dismiss-memory.",
    category: "Alert",
    free: true,
  },
  {
    slug: "linen-drag-image",
    name: "Linen Drag Image",
    description:
      "An image sliced into a grid of tiles connected by cloth-like spring physics, drag to warp the fabric, release to let it settle, or click for a rippling flick.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "feature-split-section",
    name: "Feature Split Section",
    description:
      "A theme-aware (paper/glass) marketing section, a fixed photo panel with heading and CTA on one side, a static 2x2 feature grid on the other. Stacks on mobile.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "expand-card-grid",
    name: "Expand Card Grid",
    description:
      "A 2x2 grid of image cards that expand to fill the frame on click, revealing title/description/CTA, with keyboard arrow navigation between cards and swipe-to-close on touch.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "about-founder-section",
    name: "About Founder Section",
    description:
      "A two-column About Us hero, heading, description and CTAs on one side, a founder card with quote, bio paragraphs, and a signature (or script-font fallback) on the other.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "kanban-board",
    name: "Kanban Board",
    description:
      "A drag-and-drop task board with a hand-rolled pointer-based drag engine, velocity tilt, edge autoscroll, ghost drop-position indicator, priority badges, avatar stacks, and light/dark theming.",
    category: "Board",
    free: true,
  },
  {
    slug: "data-table",
    name: "Data Table",
    description:
      "An admin data table with sortable/filterable columns, global search, status tabs, row selection, badge/avatar/actions cell types, pagination, and light/dark/custom theming.",
    category: "Data",
    free: true,
  },
  {
    slug: "line-chart",
    name: "Line Chart",
    description:
      "A multi-series line/area chart, smooth Catmull-Rom curves, a highlighted zone band, a reference line, endpoint value badges, and a hover crosshair with per-series tooltips.",
    category: "Chart",
    free: true,
  },
  {
    slug: "bar-chart",
    name: "Bar Chart",
    description:
      "A stacked bar chart, up to 5 series per bar, a reference line, a peak-value annotation, and a hover tooltip breaking down each bar's segments with a running total.",
    category: "Chart",
    free: true,
  },
  {
    slug: "tearable-reveal",
    name: "Tearable Reveal",
    description:
      "A physically-simulated cloth intro reveal, drag to tear open a torn-paper layer covering an image, with breakable constraints, particle debris, frayed jagged/rounded edges, and optional surface text or logo. Includes Auto Tear and Reset controls.",
    category: "Effect",
    free: true,
  },
  {
    slug: "arc-mood-carousel",
    name: "Arc Mood Carousel",
    description:
      "A physics-driven drag carousel that arranges cards along a 3D arc, with 4 mood presets (Editorial, Luxury, Chaos, Raw) that swap color grading, shadows, film grain, and typography, momentum drag, autoplay, hover glow and parallax.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "story-slider",
    name: "Story Slider",
    description:
      "An Instagram Stories-style slider with 8 canvas-rendered cinematic transitions (fade, slide, wipe, zoom, iris, bars, morph, dissolve), per-slide progress bars, tap/swipe/keyboard navigation, and a thumbnail strip.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "ipad-mockup-carousel",
    name: "iPad Mockup Carousel",
    description:
      "A realistic iPad Pro mockup with an internal video/image carousel, swipe or auto-advance, slide/fade transitions, portrait/landscape orientation, 3D cursor tilt, ambient glow, and a progress bar.",
    category: "Mockup",
    free: false,
  },
  {
    slug: "desktop-mockup-carousel",
    name: "Desktop Mockup Carousel",
    description:
      "A realistic Studio Display-style monitor mockup with an internal video/image carousel, swipe or auto-advance, slide/fade transitions, 3D cursor tilt, ambient glow, and a progress bar.",
    category: "Mockup",
    free: true,
  },
  {
    slug: "scroll-title-gallery",
    name: "Scroll Title Gallery",
    description:
      "A self-scrolling, snap-scroll image gallery with a giant outlined title column that skews with scroll velocity and fills in on the active panel, plus Ken Burns zoom, a progress rail, and nav dots.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "cards-hover-marquee",
    name: "Cards Hover Marquee",
    description:
      "Two auto-scrolling rows of image cards moving in opposite directions, hovering lifts a card and dims its neighbors in a cascading falloff, click opens a detail dialog with tag, description, and CTA.",
    category: "Marquee",
    free: false,
  },
  {
    slug: "cards-gallery-ring",
    name: "Cards Gallery Ring",
    description:
      "A 3D ring of project cards you drag or scroll-wheel to rotate, with parallax tilt, hover-to-preview center panel, an optional custom cursor, and a light/dark theme toggle.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "social-reels-grid",
    name: "Social Reels Grid",
    description:
      "A responsive grid of vertical reels-style video cards, hover or click to play, muted/looped inline with a play/pause and mute chip, creator username below, plus a paper/glass theme toggle.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "tech-stack-section",
    name: "Tech Stack Section",
    description:
      "A numbered tech/integration stack list with a persistent logo badge per row, a left-to-right name reveal on hover, and grid-row accordion descriptions with an outbound link.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "case-study-section",
    name: "Case Study Section",
    description:
      "A numbered portfolio/case-study accordion, expanding an item reveals the project description alongside a row of result metrics, optional media, and an outbound link.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "index-grid-section",
    name: "Index Grid Section",
    description:
      "An editorial table-of-contents grid, hairline-bordered cells fill with an inverted color sweep (or an image/video reveal) on hover, exposing a short description beneath each title.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "liquid-glass-video",
    name: "Liquid Glass Video",
    description:
      "A glassmorphic video player for uploaded files or Vimeo, custom blurred control bar, drag-to-seek, volume slider, speed menu, Picture-in-Picture, and scroll autoplay.",
    category: "Media",
    free: false,
  },
  {
    slug: "aura-cursor",
    name: "Aura Cursor",
    description:
      "A GPU fluid simulation (WebGL Navier-Stokes) that ripples colorful smoke wherever the cursor or a touch moves, with rainbow/palette color modes and always/click/hover triggers.",
    category: "Effect",
    free: false,
  },
  {
    slug: "confetti-show",
    name: "Confetti Show",
    description:
      "A canvas confetti effect with rain, burst, and cannon emission modes, 9 particle shapes, 7 color presets, and auto/click/hover/external triggers.",
    category: "Effect",
    free: false,
  },
  {
    slug: "neural-logic-graph",
    name: "Neural Logic Graph",
    description:
      "An animated node-graph diagram, input and output cards connect to a glowing center hub via smooth bezier paths with flowing particles.",
    category: "Diagram",
    free: false,
  },
  {
    slug: "latency-trace-diagram",
    name: "Latency Trace Diagram",
    description:
      "An animated request-journey diagram, packets travel hop-by-hop between client/server/cache/database/API nodes, with randomized per-hop latency, simulated failures, and a live result readout.",
    category: "Diagram",
    free: false,
  },
  {
    slug: "range-area-chart",
    name: "Range Area Chart",
    description:
      "A min/max envelope chart with a nested core-range band, an actual-to-forecast line split, annotated risk zones, a reference line, and a live endpoint badge.",
    category: "Chart",
    free: true,
  },
  {
    slug: "radar-chart",
    name: "Radar Chart",
    description:
      "A multi-series radar/spider chart with ring gridlines, per-series solid or dashed strokes, optional point markers, and a hover tooltip comparing every series at the highlighted axis.",
    category: "Chart",
    free: true,
  },
  {
    slug: "pie-chart",
    name: "Pie Chart",
    description:
      "A donut-style pie chart with a live center total, click-to-toggle legend, percentage callouts around the ring, and a hover tooltip with ARR, account count, and average contract size.",
    category: "Chart",
    free: true,
  },
  {
    slug: "logo-marquee",
    name: "Logo Marquee",
    description:
      "An infinite scrolling row of client/partner logos with edge fade masks, grayscale-to-color hover reveal, pause-on-hover, and a constant speed regardless of logo count.",
    category: "Logo",
    free: true,
  },
  {
    slug: "liquid-image-effect",
    name: "Liquid Image Effect",
    description:
      "A WebGL-warped image with cursor-driven distortion, 4 shader effects (ripple, melt, bulge, glitch RGB-split), with touch support and adjustable strength/radius/speed.",
    category: "Effect",
    free: false,
  },
  {
    slug: "liquid-text",
    name: "Liquid Text",
    description:
      "Text distorted through an animated SVG noise filter, 5 presets (liquid, melt, blob, ghost, crystal), cursor-proximity intensity, and a click burst ripple.",
    category: "Typography",
    free: true,
  },
  {
    slug: "sticky-scroll-reveal",
    name: "Sticky Scroll Reveal",
    description:
      "A feature section with a sticky preview card and a scrolling text column, the card's content and background swap as each section scrolls into focus. Collapses to a flat stacked list on mobile.",
    category: "Card",
    free: false,
  },
  {
    slug: "word-reveal",
    name: "Word Reveal",
    description:
      "Staggered word or character reveal text, driven by scroll progress, viewport entry, or a manual trigger, 4 animation presets, 3 stagger patterns, and word highlighting.",
    category: "Typography",
    free: true,
  },
  {
    slug: "node-field",
    name: "Node Field",
    description:
      "A WebGL particle constellation background, freely-drifting nodes connected by fading lines when close enough, with cursor repel/attract and touch support.",
    category: "Background",
    free: false,
  },
  {
    slug: "dot-field-grid",
    name: "Dot Field Grid",
    description:
      "A canvas grid of dots (or 6 other shapes) that repel or attract away from the cursor with eased spring motion, an optional edge gradient mask, and touch support.",
    category: "Background",
    free: false,
  },
  {
    slug: "alert-toast",
    name: "Alert Toast",
    description:
      "A polished toast/alert notification, 5 tones, stacked or inline layout, icons, primary/secondary actions, dismiss and auto-dismiss, light/dark theme, plus a showcase mode rendering every variant side by side.",
    category: "Alert",
    type: "element",
    free: true,
    prompt:
      "Build a React + Tailwind CSS toast/alert notification component called AlertToast. Requirements: 5 tones (neutral, info, warning, success, error), each with its own light and dark palette; a `theme` prop (light | dark); a `background` prop (subtle | tinted); a `layout` prop (stacked: title and message above the actions, or inline: content and actions on one row); an optional leading icon (none | info | success | error | custom node); a title and a message; an optional primary button (label, optional external link) and an optional secondary text link/button (label, emphasis style); a dismiss (×) button; and optional auto-dismiss with a configurable duration in ms that also fires onDismiss. Rounded-xl card, 1px border matching the tone, soft shadow, smooth enter/exit animation, accessible (role=\"alert\" or \"status\", aria-label on the dismiss button, visible focus rings). Also provide a `showcase` mode that renders every tone and variant side by side for previewing. Keep it dependency-light and fully typed in TypeScript.",
  },
  {
    slug: "focus-frame",
    name: "Focus Frame",
    description:
      "A video hero frame with a soft blurred vignette mask on the edges, a title/subtitle overlay, and viewport-aware autoplay that pauses the video when scrolled out of view.",
    category: "Card",
    free: false,
  },
  {
    slug: "wave-lines",
    name: "Wave Lines",
    description:
      "A WebGL shader background of flowing Perlin-noise wave lines, adjustable line count/width/blur, direction, gradient colors, a vignette, and mouse-reactive distortion.",
    category: "Background",
    free: false,
  },
  {
    slug: "dot-image-loader",
    name: "Dot Image Loader",
    description:
      "An auto-animating loading screen, a halftone dot rendering of your image is scanned into existence by a glowing lightsaber-style sweep, then oscillates in a loop while a 'Preparing...' label and spinner play below.",
    category: "Gallery",
    free: true,
    hidden: true,
  },
  {
    slug: "product-grid-section",
    name: "Product Grid Section",
    description:
      "A responsive product/portfolio grid section, heading, per-card image with hover zoom and reveal overlay, category/price meta row, optional badge, and a centered CTA button below the grid.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "pixel-grid-reveal",
    name: "Pixel Grid Reveal",
    description:
      "An image reveal built from a grid of solid color cells that dissolve away as the photo zooms down to scale, 4 reveal orderings (random, left-to-right, top-to-bottom, center-out), viewport-triggered, with optional replay on hover.",
    category: "Gallery",
    free: false,
    hidden: true,
  },
  {
    slug: "wave-gallery-page",
    name: "Wave Gallery Page",
    description:
      "A self-scrolling text/image list gallery, scrolling ripples a sinusoidal wave through each title row's spacing while its paired image or video crossfades in centered behind the list, with an optional counter overlay.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "project-index-list",
    name: "Project Index List",
    description:
      "An editorial title/year project list over a shared floating background, hovering a row zoom-settles in that item's image with cursor parallax, while a directional color highlight sweeps in behind the exclusion-blended label.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "scroll-swatch-showcase",
    name: "Scroll Swatch Showcase",
    description:
      "A self-scrolling, pinned swatch/color showcase, a headline and CTA sit above a horizontal filmstrip of slides with interleaved parallax and fading captions, plus clickable thumbnails and tag filters that smooth-scroll to match.",
    category: "Gallery",
    free: false,
  },
//   {
//     slug: "container-scroll-ipad",
//     name: "Container Scroll iPad",
//     description:
//       "A scroll-driven hero — a heading and badge translate and fade while a hand-built photorealistic iPad frame rotates from a tilted angle to flat and scales up as you scroll, in Silver/Space Gray and Landscape/Portrait.",
//     category: "Hero",
//     type: "block",
//     free: false,
//   },
  {
    slug: "process-spotlight",
    name: "Process Spotlight",
    description:
      "A process/steps section with a horizontal tab strip (auto-advancing progress bars, stories-UI style) above a single-step spotlight stage, a giant ghost numeral, title, description, and optional image with a direction-aware transition.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "living-orb-ai",
    name: "Living Orb AI",
    description:
      "A WebGL shader-rendered AI orb with three looks, Aura (soft glowing cloud), Veil (silky woven bands), and Sphere (marbled, lit 3D ball that tracks the pointer), with adjustable colors, glow, speed, and iridescence.",
    category: "AI & Chat",
    free: false,
  },
  {
    slug: "ai-asistant",
    name: "AI Asistant",
    description:
      "A dotted status light with two layouts, Mesh grid and Halo rings, across three animated states (Waiting, Listening, Thinking), in four dot shapes with adjustable colors.",
    category: "AI & Chat",
    free: true,
  },
  {
    slug: "ai-voice-01",
    name: "AI Voice 01",
    description:
      "A voice-assistant pill with a canvas audio-reactive visualizer, idle/listening/speaking states, a glowing edge ring, live word-by-word transcript, optional real microphone input, and custom/silver themes.",
    category: "AI & Chat",
    free: true,
  },
  {
    slug: "ai-voice-02",
    name: "AI Voice 02",
    description:
      "A voice-assistant pill with a canvas audio-reactive waveform, idle/listening/speaking states, a glowing edge ring, live word-by-word transcript, and optional real microphone input.",
    category: "AI & Chat",
    free: false,
  },
  {
    slug: "ai-voice-03",
    name: "AI Voice 03",
    description:
      "A voice-assistant pill with a canvas audio-reactive dot-matrix visualizer, idle/listening/speaking states, a glowing edge ring, live word-by-word transcript, optional real microphone input, and built-in SEO microdata.",
    category: "AI & Chat",
    free: false,
  },
  {
    slug: "ai-voice-04",
    name: "AI Voice 04",
    description:
      "A voice-assistant pill with a canvas audio-reactive 3D particle orb, idle/listening/speaking states, a breathing aura halo, a glowing edge ring, live word-by-word transcript, and optional real microphone input.",
    category: "AI & Chat",
    free: false,
  },
  {
    slug: "ai-voice-05",
    name: "AI Voice 05",
    description:
      "A portrait voice-assistant card with a canvas audio-reactive curve visualizer, a mic button that grows on tap, idle/listening/speaking states, and live word-by-word transcript.",
    category: "AI & Chat",
    free: true,
  },
  {
    slug: "ai-image-loader-01",
    name: "AI Image Loader 01",
    description:
      "An AI image-generation loader, a canvas-drawn particle sphere with a rippling light ring cross-fades into the finished picture, with cycling status messages and a regenerate button.",
    category: "AI & Chat",
    free: false,
  },
  {
    slug: "ai-image-loader-02",
    name: "AI Image Loader 02",
    description:
      "An AI image-generation loader, a canvas-drawn field of light-reactive dots cross-fades into the finished picture with a one-shot sparkle burst, cycling status messages, and a regenerate button.",
    category: "AI & Chat",
    free: false,
  },
  {
    slug: "ai-image-loader-03",
    name: "AI Image Loader 03",
    description:
      "An AI image-generation loader, canvas-drawn rolling topographic lines grow in and a top-to-bottom sweep reveals the finished picture, with cycling status messages and a regenerate button.",
    category: "AI & Chat",
    free: true,
  },
  {
    slug: "ai-image-loader-04",
    name: "AI Image Loader 04",
    description:
      "A four-tile AI image generation grid, each tile sharpens through a mipmap ladder from one reference photo's varied takes, with Vary, Upscale and Grid actions per selected tile, and custom/silver themes.",
    category: "AI & Chat",
    free: false,
  },
  {
    slug: "ai-dynamic-island-01",
    name: "AI Dynamic Island 01",
    description:
      "A Dynamic Island-style AI status pill that morphs between idle, listening, thinking, working (with an unfolding step list) and done states, with a canvas-drawn particle orb and rippling energy curves.",
    category: "AI & Chat",
    free: true,
  },
  {
    slug: "ai-dynamic-island-02",
    name: "AI Dynamic Island 02",
    description:
      "A Dynamic Island-style voice assistant that morphs between idle, listening, thinking and speaking, unfolding into a card with a canvas-drawn particle orb, word-by-word typed questions and answers.",
    category: "AI & Chat",
    free: false,
  },
  {
    slug: "ai-answer-01",
    name: "AI Answer 01",
    description:
      "An AI answer card, thinking, then a word-by-word streamed reply with a canvas particle orb, inline citation badges, source chips, and copy/like/dislike/regenerate actions.",
    category: "AI & Chat",
    free: false,
  },
  {
    slug: "ai-answer-02",
    name: "AI Answer 02",
    description:
      "An AI answer card, thinking, then a word-by-word streamed reply with a canvas-drawn trefoil-knot particle orb, inline citation badges, skeleton shimmer bars, source chips, and custom/silver themes.",
    category: "AI & Chat",
    free: false,
  },
  {
    slug: "ai-answer-03",
    name: "AI Answer 03",
    description:
      "An agent-style AI answer card, a researching/reading/writing step tracker with a progress rail, markdown-style bold and bullet text, clickable inline citations, source cards, follow-up questions, and custom/sunset themes.",
    category: "AI & Chat",
    free: true,
  },
  {
    slug: "ai-chat-prompt",
    name: "AI Chat Prompt",
    description:
      "An AI chat input with @-mention, mode and model dropdowns, and a send button that morphs the whole field into a thinking capsule with an animated particle orb and cycling status text.",
    category: "AI & Chat",
    free: false,
  },
  {
    slug: "ai-chat",
    name: "AI Chat",
    description:
      "A floating chat widget with a particle-orb launcher that morphs into a chat panel, a teaser bubble, an auto-playing sample conversation, typing indicator, and a traveling edge glow.",
    category: "AI & Chat",
    free: false,
  },
  {
    slug: "ai-edit-review",
    name: "AI Edit Review",
    description:
      "An AI text editor that rewrites a selected passage, streams a word-level diff review with accept/reject actions, and morphs a dock through writing, review, and applied states.",
    category: "AI & Chat",
    free: true,
  },
  {
    slug: "ai-chat-panel",
    name: "AI Chat Panel",
    description:
      "A self-contained AI messaging thread with a dotted-orb avatar, a rotating multi-color glow, a canned-reply thinking demo, and a pill-shaped composer with a circular send button.",
    category: "AI & Chat",
    type: "block",
    free: false,
  },
  {
    slug: "fullpage-photos",
    name: "Fullpage Photos",
    description:
      "A fullscreen photo gallery that advances one section at a time on wheel, arrow keys, or a double-tap, with a GSAP-choreographed directional slide and reveal between images.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "video-scroll-story",
    name: "Video Scroll Story",
    description:
      "A self-scrolling, pinned full-bleed video story, each scene crossfades in with its own background color, a staggered word-by-word title reveal, an optional giant ambient scene number, progress dots, a vertical progress bar, and a scroll hint.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "service-list-cursor-preview",
    name: "Service List Cursor Preview",
    description:
      "A masthead-style services list, on desktop, hovering a row shows its image in a panel that eases toward the cursor as it moves; on mobile or keyboard, the row expands inline instead. Dark/light theme toggle and full Service/ItemList microdata.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "premium-bento-grid",
    name: "Premium Bento Grid",
    description:
      "A responsive bento-grid media gallery (2x2, 3x3, or custom asymmetric spans) with image/video slots, optional 3D cursor tilt, hover caption overlay, badges, glassmorphism, staggered entrance animations, and a click-to-open lightbox with keyboard nav.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "video-glow-lightbox",
    name: "Video Glow Lightbox",
    description:
      "A single video card with a pulsing glow-blob frame that morphs into a fullscreen lightbox on click, supports direct URL, YouTube, Vimeo, or uploaded files, a cursor-following watch label, hover preview loop, and a Web Audio sound-reactive glow.",
    category: "Media",
    free: true,
  },
  {
    slug: "process-steps-rail",
    name: "Process Steps Rail",
    description:
      "A numbered process list where each step is a click-to-expand accordion row, connected by a vertical rail that lights up down to the currently open step, with a ghost-reveal title effect and a two-column eyebrow/heading header.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "expanding-panel-gallery",
    name: "Expanding Panel Gallery",
    description:
      "A click-to-expand horizontal speaker/profile gallery, panels grow via flex-grow when active, the photo goes from grayscale to color with cursor parallax, and the name, job title, tag, and CTA stagger in with delayed transitions.",
    category: "Gallery",
    free: false,
    hidden: true,
  },
  {
    slug: "world-map-pro",
    name: "World Map Pro",
    description:
      "An interactive, hand-decoded SVG world map, click or hover any country to reveal a data card with a badge, headline metric, and detail rows, with 5 style presets, an optional legend, and a pre-selected-country mode.",
    category: "Data",
    free: false,
  },
  {
    slug: "feature-grid-mosaic",
    name: "Feature Grid Mosaic",
    description:
      "A theme-aware (paper/glass) 4×8 mosaic feature grid, a centered badge, heading, and subheading above 8 independently configured cells, each either a full-bleed hover-reveal image card or a colored text card with a link.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "glide-carousel",
    name: "Glide Carousel",
    description:
      "A canvas-rendered, drag-to-scroll carousel with a curved wave layout and ambient wind/drift/magnetic card sway, click-to-open lightbox modal, autoplay, and image/video support.",
    category: "Carousel",
    free: true,
  },
  {
    slug: "marquee-hero-section",
    name: "Marquee Hero Section",
    description:
      "A theme-aware (paper/glass) social-proof hero, centered badge, heading, subheading, and CTA button above a two-row infinite photo marquee with faded edges, hover captions, and opposite/same scroll directions.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "review-gallery",
    name: "Review Gallery",
    description:
      "A split-panel review slider, a cross-fading photo strip on one side, and a quote with name, role, dot pagination, thumbnail strip and prev/next navigation on the other.",
    category: "Testimonial",
    free: false,
  },
  {
    slug: "review-showcase",
    name: "Review Showcase",
    description:
      "A three-column review slider, a vertical counter/label rail, a photo with draggable thumbnail strip, and an italic serif pull-quote with name, role and prev/next navigation.",
    category: "Testimonial",
    free: false,
  },
  {
    slug: "testimonial-logos",
    name: "Testimonial Logos",
    description:
      "A compact trust bar, a star rating with a helped-N-teams label above an infinite, edge-masked logo marquee.",
    category: "Testimonial",
    free: true,
  },
  {
    slug: "testimonial-bento",
    name: "Testimonial Bento",
    description:
      "A full testimonial section, heading, description and CTA, an optional trust bar with logo marquee, and a staggered scroll-in grid of glass quote cards with avatar, name and role.",
    category: "Testimonial",
    type: "block",
    free: false,
  },
  {
    slug: "dice-discount-popup",
    name: "Dice Discount Popup",
    description:
      "A gamified discount popup, roll two animated 3D dice for a reward tier (with a doubles bonus), copy the code, and track rolls left across a session. Inline or corner-widget popup with manual, delay or scroll triggers.",
    category: "Alert",
    free: true,
  },
  {
    slug: "scratch-card-popup",
    name: "Scratch Card Popup",
    description:
      "A gamified scratch-to-win popup, drag to scratch a gold-foil canvas off a 3x3 icon grid, match three to win a reward tier with a confetti burst, copy the code, and track attempts left. Inline or corner-widget popup with manual, delay or scroll triggers.",
    category: "Alert",
    free: true,
  },
  {
    slug: "download-section",
    name: "Download Section",
    description:
      "An app-download hero, badge, heading, description, a scroll-in feature list, star rating, App Store / Google Play buttons, and a hand-built iPhone frame with an animated revenue chart card.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "business-hours",
    name: "Business Hours",
    description:
      "A premium opening-hours card, live open/closed status with a pulsing dot, a day-by-day schedule, and a Get Directions link built from an address or custom URL.",
    category: "Widget",
    free: true,
  },
  {
    slug: "feature-showcase",
    name: "Feature Showcase",
    description:
      "A two-column feature section, eyebrow, heading, stat pills and a click-to-expand step accordion on the left, a tabbed image panel with crossfading previews on the right.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "feature-showcase-split",
    name: "Feature Showcase Split",
    description:
      "A symmetric feature spotlight, a centered heading over a three-column layout with icon feature cards on both sides of a portrait image, staggered scroll-in reveal.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "motion-gallery-grid",
    name: "Motion Gallery Grid",
    description:
      "A perfectly aligned image grid with a centered glassmorphism overlay card, heading, subtitle and CTA button, with a staggered blur/slide/fade/scale entrance triggered on scroll into view.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "qr-code-widget",
    name: "QR Code Widget",
    description:
      "A QR-code card, title, description, code image, hint text and an open-link button, inline or as a corner-widget popup with a focus-trapped modal dialog.",
    category: "Widget",
    free: true,
  },
  {
    slug: "phone-gallery",
    name: "Phone Gallery",
    description:
      "A carousel of hand-built iPhone frames in row, stacked or fan layout, with 3D cursor tilt on the active phone, autoplay, dot pagination and arrow controls.",
    category: "Mockup",
    free: false,
  },
  {
    slug: "sticky-phone-scroll",
    name: "Sticky Phone Scroll",
    description:
      "A scroll-driven feature section, a sticky iPhone frame and crossfading stat cards on one side, a heading/description/CTA that swaps per slide on the other, with an animated background color transition and a progress rail.",
    category: "Mockup",
    free: false,
  },
  {
    slug: "hero-scroll-gallery",
    name: "Hero Scroll Gallery",
    description:
      "A cinematic hero, a content panel with an animated ticker, eyebrow, heading and CTAs beside a tilted three-column photo wall that drifts continuously, columns alternating direction and speed.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "carousel-slider",
    name: "Carousel Slider",
    description:
      "A drag-to-swipe multi-slide carousel with adjacent slides peeking on each side, a large rolling slide counter (numbers, roman numerals, or words), per-slide heading/description/button content, and an autoplay progress bar.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "download-section-glass",
    name: "Download Section Glass",
    description:
      "A centered app-download hero, a light/dark theme toggle, glass pill CTA, heading, description, App Store / Google Play buttons with star rating, and a three-phone fan stage with an ambient glow and bottom fade mask.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "feature-showcase-video",
    name: "Feature Showcase Video",
    description:
      "A two-column feature section, eyebrow, heading, stat pills and a step accordion on the left, an accent-colored tabbed media panel on the right that crossfades between images and looping videos.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "google-reviews",
    name: "Google Reviews",
    description:
      "A theme-aware social-proof carousel, a Google mark, aggregate rating and CTA header above a draggable, autoplaying grid of individual review cards.",
    category: "Testimonial",
    free: false,
  },
  {
    slug: "airbnb-reviews",
    name: "Airbnb Reviews",
    description:
      "A guest-review carousel with the Airbnb Bélo mark, aggregate rating header and CTA, above a draggable autoplaying grid of review cards.",
    category: "Testimonial",
    free: true,
  },
  {
    slug: "app-store-reviews",
    name: "App Store Reviews",
    description:
      "An App Store review carousel, Apple mark, aggregate rating and CTA header above a draggable autoplaying grid of review cards.",
    category: "Testimonial",
    free: false,
  },
  {
    slug: "ebay-reviews",
    name: "eBay Reviews",
    description:
      "A seller-feedback carousel with the eBay wordmark, aggregate rating header and CTA, above a draggable autoplaying grid of review cards.",
    category: "Testimonial",
    free: true,
  },
  {
    slug: "etsy-reviews",
    name: "Etsy Reviews",
    description:
      "A shop-review carousel with the Etsy wordmark, aggregate rating header and CTA, above a draggable autoplaying grid of review cards.",
    category: "Testimonial",
    free: true,
  },
  {
    slug: "facebook-reviews",
    name: "Facebook Reviews",
    description:
      "A recommendations carousel with the Facebook mark, aggregate rating header and CTA, above a draggable autoplaying grid of review cards.",
    category: "Testimonial",
    free: false,
  },
  {
    slug: "team-cards-expand",
    name: "Team Cards Expand",
    description:
      "A row of team photo cards that expand on hover to reveal name and role, with cursor parallax on the active photo and a soft cursor-tracking glow.",
    category: "Team",
    free: false,
    hidden: true,
  },
  {
    slug: "timeline-milestones",
    name: "Timeline Milestones",
    description:
      "A two-column header (eyebrow/heading and a side description) above a chronological milestone list, each year expands to reveal a description and optional image, connected by a rail that lights up to the open step.",
    category: "Timeline",
    free: false,
  },
  {
    slug: "blog-article-cards",
    name: "Blog Article Cards",
    description:
      "A theme-aware blog card grid, each card shows a photo with a quarter-circle notch cut into its corner holding a round arrow-link button, plus up to three colored category tags.",
    category: "Blog",
    free: false,
  },
  {
    slug: "hotspot-showcase",
    name: "Hotspot Showcase",
    description:
      "A shoppable image with pulsing hotspot dots, clicking one swaps a side product card with color swatches, a multi-image arrow carousel, sizes, price, and a buy button, with a progress rail to browse between products.",
    category: "Gallery",
    free: false,
    hidden: true,
  },
  {
    slug: "footer-mega",
    name: "Footer Mega",
    description:
      "A dense mega-footer, logo, description and socials on the left, up to four link columns across the middle, and a secondary rounded panel underneath for guides, tools and team links, with a copyright bottom bar.",
    category: "Footer",
    type: "block",
    free: false,
  },
  {
    slug: "image-sidebar-dock",
    name: "Image Sidebar Dock",
    description:
      "A macOS-dock-style vertical nav, labels magnify and shift toward the cursor by proximity, each linked to a crossfading image panel with title, description and tag.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "coin-flip-game",
    name: "Coin Flip Game",
    description:
      "A real 3D CSS coin, click or tap to flip with a physical spin animation, a yes/no question field, flip history dots, and a heads/tails ratio readout.",
    category: "Widget",
    free: true,
  },
  {
    slug: "tic-tac-toe-game",
    name: "Tic Tac Toe Game",
    description:
      "A playable Tic Tac Toe board with a built-in AI opponent, animated piece placement, a drawn winning-line reveal, score tracking, and a confetti burst on a win.",
    category: "Widget",
    free: true,
  },
  {
    slug: "2048-game",
    name: "2048 Game",
    description:
      "A fully playable 2048, arrow-key and swipe controls, spring-animated tile merges, score and best-score tracking, and win/game-over overlays.",
    category: "Widget",
    free: true,
  },
  {
    slug: "snake-game",
    name: "Snake Game",
    description:
      "A canvas-rendered Snake game with three difficulty speeds, keyboard and swipe controls, a directional-eyes snake head, high-score tracking, and ready/game-over overlays.",
    category: "Widget",
    free: true,
  },
  {
    slug: "minesweeper-game",
    name: "Minesweeper Game",
    description:
      "A Minesweeper with four glass themes, three board sizes, flood-fill reveal, right-click flagging, a live mine counter and timer, and an optional popup/widget mode.",
    category: "Widget",
    free: true,
  },
  {
    slug: "memory-match-game",
    name: "Memory Match Game",
    description:
      "A flip-card memory matching game with four glass themes, three difficulty levels, a 3D flip animation, move/score tracking, and an optional popup/widget mode.",
    category: "Widget",
    free: true,
  },
  {
    slug: "pong-game",
    name: "Pong Game",
    description:
      "A canvas Pong against a bot opponent, four glass themes, three difficulty levels, multi-round progression with a speed increase each round, keyboard and pointer paddle control, and an optional popup/widget mode.",
    category: "Widget",
    free: true,
  },
  {
    slug: "dino-runner-game",
    name: "Dino Runner Game",
    description:
      "A canvas endless-runner in the style of the offline dino game, pixel-drawn running dino, procedurally spawned cactus obstacles, three difficulty speeds, tap/space/arrow-up to jump, and a high-score tracker.",
    category: "Widget",
    free: true,
  },
  {
    slug: "space-invaders-game",
    name: "Space Invaders Game",
    description:
      "A canvas Space Invaders, a descending grid of pixel-drawn invaders that shoot back, three difficulty levels, keyboard controls on desktop and on-screen move/fire buttons on mobile, with a win/lose end screen.",
    category: "Widget",
    free: true,
  },
  {
    slug: "glow-jump-widget",
    name: "Glow Jump Widget",
    description:
      "A glowing 4-level platformer, jump between walls, dodge moving lava, and collect coins to finish each level. Renders directly on the page, or as a floating-action-button popup. Keyboard and on-screen touch controls included.",
    category: "Widget",
    free: true,
  },
  {
    slug: "spin-to-win-wheel",
    name: "Spin to Win Wheel",
    description:
      "A gamified discount-capture widget where visitors spin a weighted SVG prize wheel for a reward, with five glass themes, a themed reveal modal and code copy, rendered inline or as a corner-launched popup with manual/delay/scroll triggers.",
    category: "Widget",
    free: true,
  },
  {
    slug: "memory-cards-widget",
    name: "Memory Cards Widget",
    description:
      "A floating-action-button popup that opens a color-matching memory game, 3 difficulty levels, a live timer/move counter, best-score tracking, subtle Web Audio sound effects, and a confetti win screen.",
    category: "Widget",
    free: true,
  },
  {
    slug: "globe-studio",
    name: "Globe Studio",
    description:
      "A draggable, auto-rotating WebGL globe (Three.js) with 6 render styles, realistic, terrain, wireframe, hologram, monochrome, neon, plus glowing city pins with hover cards, animated connection arcs, and a starfield.",
    category: "Widget",
    free: false,
  },
  {
    slug: "matrix-rain-background",
    name: "Matrix Rain Background",
    description:
      "A canvas-based digital rain background with 5 character sets, 5 color modes, 4 fall directions, and a hidden message that periodically flashes across the falling characters.",
    category: "Widget",
    free: false,
  },
  {
    slug: "bubble-cursor",
    name: "Bubble Cursor",
    description:
      "A liquid-glass bubble that follows the pointer across the whole page, rendered with a raymarched WebGL2 metaball trail with fresnel shading and iridescent glints, plus an optional light/dark theme toggle.",
    category: "Widget",
    free: true,
  },
  {
    slug: "cursor-reveal-hero",
    name: "Hover Compare",
    description:
      "A full-bleed WebGL hero where a mouse/touch trail paints a soft mask that reveals a bottom image beneath a top image, with an optional click shockwave and a synthetic wandering cursor that takes over when idle.",
    category: "Widget",
    free: false,
  },
  {
    slug: "glass-showcase-scroll",
    name: "Glass Showcase Scroll",
    description:
      "A scroll-driven 3D glass box (Three.js) that rotates through a set of images with particle-explosion transitions between them, plus an optional gentle float animation.",
    category: "Widget",
    free: true,
    hidden: true,
  },
  {
    slug: "curved-image-carousel",
    name: "Curved Image Carousel",
    description:
      "A draggable, momentum-scrolled image carousel rendered on a curved WebGL (Three.js) plane strip, with a bounce-in drop animation per item and optional grayscale and rounded-corner shading.",
    category: "Widget",
    free: false,
  },
  {
    slug: "orbiting-globe-badges",
    name: "Orbit Globe",
    description:
      "A rotating canvas particle globe (8 render styles) rising from the bottom of its container, surrounded by semicircular orbit rings carrying mirrored badge icons that alternate spin direction per ring.",
    category: "Widget",
    free: false,
  },
  {
    slug: "scroll-word-highlight",
    name: "Scroll Word Highlight",
    description:
      "A vertical snap-scrolling list of words next to a sticky prefix label, using CSS scroll-driven animation to glow, scale, and unblur the word nearest the center.",
    category: "Typography",
    free: false,
  },
  {
    slug: "rotary-card-carousel",
    name: "Rotary Card Carousel",
    description:
      "A 3D fan of image cards that spring-rotate around a shared pivot as you scroll, use arrow keys, or click the prev/next buttons, with the active card brightened and scaled up.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "curved-nav-carousel",
    name: "Curved Nav Carousel",
    description:
      "A featured image or video card synced to a draggable curved strip of thumbnails that arc up and fade out toward the edges, with Desk Dark, Desk Light, Original and custom themes, optional arrows, and keyboard and swipe support.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "accordion-services-list",
    name: "Accordion Services List",
    description:
      "A numbered accordion list of services with a two-column eyebrow/heading/side-description header, left-to-right ghost-reveal titles on hover, and grid-row expand/collapse descriptions.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "review-card-portrait",
    name: "Review Card Portrait",
    description:
      "A portrait-format testimonial card with a crossfading top image strip, counter, thumbnail selector, and an animated quote with name/role, plus prev/next navigation and optional autoplay.",
    category: "Testimonial",
    free: true,
  },
  {
    slug: "social-post-testimonial-wall",
    name: "Testimonial Reviews",
    description:
      "A multi-row, infinite-scrolling testimonial wall of social-post-style cards with name, handle, verified badge, and text, alternating scroll direction per row, edge fade masks, pause-on-hover, and a scroll-triggered reveal.",
    category: "Testimonial",
    type: "block",
    free: false,
  },
  {
    slug: "bento-scroll-zoom-gallery",
    name: "Bento Scroll Zoom Gallery",
    description:
      "A pinned bento-grid media gallery whose 8 image/video cells zoom out from a compact grid to a near-fullscreen mosaic as the user scrolls, with per-cell parallax, shimmer loading placeholders, and a stacked single-column layout on mobile.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "cinematic-stacked-gallery",
    name: "Cinematic Stacked Gallery",
    description:
      "A fullscreen hero gallery where inactive slides collapse into a stacked deck of thumbnails; clicking one crossfades it to full size with Ken Burns zoom, cursor parallax, and a title/description rail with CTA and prev/next controls.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "phone-analytics-mockup",
    name: "Phone Analytics Mockup",
    description:
      "An interactive iPhone mockup playing a swipeable story-style media carousel with an avatar/username/verified-badge overlay, 3D cursor tilt, ambient glow, a dark/light theme, and up to ten optional floating analytics cards (tracking, stats, sparkline, engagement, platform split, notifications, follower growth, revenue) positioned around it.",
    category: "Mockup",
    free: false,
  },
  {
    slug: "diagonal-ticker-strips",
    name: "Diagonal Ticker Strips",
    description:
      "Two diagonally intersecting, infinite-scrolling text strips whose direction arrows flip with page scroll direction, with a left-to-right intro reveal, edge fade masking, and 3 preset two-color themes plus full custom colors.",
    category: "Marquee",
    free: false,
  },
  {
    slug: "kinetic-typography-showcase",
    name: "Kinetic Typography Showcase",
    description:
      "Large-scale animated typography with two switchable themes: rotating 3D ribbons of text wrapped around a cylinder, or a stack of flipping cube towers revealing up to three face labels, both with mouse tilt and glow.",
    category: "Typography",
    free: false,
  },
  {
    slug: "fullscreen-panel-reveal-gallery",
    name: "Fullscreen Panel Reveal Gallery",
    description:
      "A row of panels that expand to fullscreen on click, with a selectable expand/circle/wipe image reveal style, a hover-revealed index number per panel, and staggered heading/description/button content transitions.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "scroll-zoom-mosaic-gallery",
    name: "Scroll Zoom Mosaic Gallery",
    description:
      "A self-contained scroll-driven photo mosaic that starts tiny and rotated, then scales up and spins to rest as its own internal scroll container is scrolled, with mouse parallax tilt, a click-to-expand lightbox, and a light/dark toggle.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "perspective-404-gallery",
    name: "Perspective 404 Gallery",
    description:
      "A cinematic 404 page with columns of infinitely scrolling images tilted into a selectable 3D perspective (deck, lens, strip, orbit, or crane), dark vignette overlays, and a centered headline with a CTA button.",
    category: "Background",
    free: false,
  },
  {
    slug: "scroll-zoom-media-reveal",
    name: "Scroll Zoom Media Reveal",
    description:
      "A self-contained scroll-scrubbed media reveal: a small rounded frame expands to full bleed as its internal scroll container is scrolled, then unveils a glassmorphism caption, an optional count-up stat row, and a scroll indicator.",
    category: "Hero",
    free: false,
  },
  {
    slug: "arc-coverflow-carousel",
    name: "Arc Coverflow Carousel",
    description:
      "A 3D coverflow-style image carousel with a full-size center card flanked symmetrically by scaled, rotated side cards along a convex, concave, or flat arc, with drag/swipe/keyboard navigation, hover parallax, captions, dots, and an optional thumbnail strip.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "instagram-story-viewer",
    name: "Story Viewer",
    description:
      "An Instagram Stories-style viewer with tap/swipe/keyboard navigation, animated per-slide progress bars, a mute toggle for video slides, a pause indicator, an optional CTA link, and a configurable thumbnail strip.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "coverflow-services-hero",
    name: "Coverflow Services Hero",
    description:
      "A split hero with eyebrow/heading/description/button content on one side and a 3D coverflow slide deck on the other, with staggered text reveal, cursor image parallax, drag/keyboard navigation, a light/dark theme, optional autoplay, and per-text uppercase and color controls.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "side-marquee-pricing-cta",
    name: "Side Marquee Pricing CTA",
    description:
      "A centered badge/heading/price/subtitle/CTA banner flanked by slow, seamlessly looping tilted photo columns on both edges, with a paper/glass/custom theme and an auto-calculated discount badge.",
    category: "CTA",
    type: "block",
    free: false,
  },
  {
    slug: "dice-roll-discount-popup",
    name: "Dice Roll Discount Popup",
    description:
      "A gamified discount-capture widget where visitors roll two 3D dice for a reward tier, with a themed reveal modal and code copy, rendered inline or as a corner-launched popup with manual/delay/scroll triggers.",
    category: "Widget",
    free: true,
  },
  {
    slug: "review-marquee-wall",
    name: "Review Marquee Wall",
    description:
      "A multi-row (1-3) flowing wall of review cards with horizontal or vertical flow, per-row speed offsets, an alternating-direction option, edge masking, an optional header, and a hover link-out overlay.",
    category: "Testimonial",
    type: "block",
    free: false,
  },
  {
    slug: "canvas-transition-carousel",
    name: "Canvas Transition Carousel",
    description:
      "A full-bleed image carousel that draws every frame to a canvas, playing a real pixel-level transition per slide change (wipe, curtain, cross-zoom, dissolve, burn, and more), with wheel/touch/keyboard navigation, side dots, and an optional cinema cursor.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "social-proof-video-grid",
    name: "Social Proof Video Grid",
    description:
      "A scattered grid of customer video cards spanning variable columns/rows, showing an avatar/name chip and achievement tags at rest, that expand into a full custom video player (native, YouTube, or Vimeo) with seek, mute, replay, and an auto-hiding glass controls bar.",
    category: "Testimonial",
    type: "block",
    free: false,
    hidden: true,
  },
  {
    slug: "wheel-spin-discount-popup",
    name: "Wheel Spin Discount Popup",
    description:
      "A gamified discount-capture widget where visitors spin a weighted SVG prize wheel for a reward, with a themed reveal modal and code copy, rendered inline or as a corner-launched popup with manual/delay/scroll triggers.",
    category: "Widget",
    free: true,
    // Same component as spin-to-win-wheel apart from a flat background; hidden in favour of that one,
    // and /components/wheel-spin-discount-popup redirects there (next.config.ts).
    hidden: true,
  },
  {
    slug: "error-404-page-section",
    name: "404 Page Section",
    description:
      "A centered \"page not found\" section: a big glitching error code, heading, description and one or two pill buttons. Follows the host site's theme by default (or a fixed dark / light palette with an optional theme toggle) and scales with its own width.",
    category: "Page",
    type: "block",
    free: true,
  },
];

// Everything the site shows. Scripts that decide what gets *distributed* (public registry, public
// mirror) use allComponents so hidden entries are still known to them.
export const components: ComponentMeta[] = allComponents.filter((c) => !c.hidden);

export function getComponent(slug: string) {
  return components.find((c) => c.slug === slug);
}

export const categories = Array.from(new Set(components.map((c) => c.category)));
