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
}

// One entry per registry item — grows as components are migrated from the
// Frameze library into shadcn-compatible registry format. Keep in sync with
// registry.json (name/description) and the preview map in
// src/registry-preview/index.tsx.
export const components: ComponentMeta[] = [
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
      "A rotating logo showcase — a tilted 3D orbit or a flat 2D wheel — with hover tooltips, per-logo links, and a center title.",
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
  },
  {
    slug: "badges-kit",
    name: "Badges Kit",
    description:
      "A status badge with 8 tone presets, light/dark variants, 3 sizes, 6 icon styles, and an optional dismiss button.",
    category: "Badge",
    type: "element",
    free: true,
  },
  {
    slug: "rating-stars",
    name: "Rating Stars",
    description:
      "An animated star rating input with half-star precision, keyboard support, a dynamic color range, and an optional progress bar.",
    category: "Form",
    type: "element",
    free: true,
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
      "A 3D tilt card that reacts to the cursor with animated conic-gradient reflections — diamond, holographic or aurora reflex styles.",
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
    category: "Widget",
    free: false,
  },
  {
    slug: "discord-chat-widget",
    name: "Discord Chat Widget",
    description:
      "A Discord-style chat bubble widget with a typing simulation, quick replies, member/online counts, and a launch-invite send flow.",
    category: "Widget",
    free: true,
  },
  {
    slug: "telegram-widget",
    name: "Telegram Widget",
    description:
      "A Telegram-style chat bubble widget with a typing simulation, quick replies, a notification popup, and availability status.",
    category: "Widget",
    free: true,
  },
  {
    slug: "messenger-widget",
    name: "Messenger Widget",
    description:
      "A Facebook Messenger-style chat bubble widget with a typing simulation, quick replies, a notification popup, and availability status.",
    category: "Widget",
    free: true,
  },
  {
    slug: "instagram-widget",
    name: "Instagram Widget",
    description:
      "An Instagram Direct-style chat bubble widget with a story-ring avatar, typing simulation, quick replies, and a notification popup.",
    category: "Widget",
    free: false,
  },
  {
    slug: "x-twitter-widget",
    name: "X (Twitter) Widget",
    description:
      "An X (Twitter)-style DM chat bubble widget with a typing simulation, quick replies, a follows-you badge, availability status, and a notification popup.",
    category: "Widget",
    free: true,
  },
  {
    slug: "footer-premium",
    name: "Footer Premium",
    description:
      "A responsive site footer with a logo, description, social links, multi-column link groups, and a copyright line.",
    category: "Footer",
    type: "block",
    free: true,
  },
  {
    slug: "footer-section",
    name: "Footer Section",
    description:
      "A minimal site footer with up to 4 link columns, a hover-underline link style, paper/glass/custom theming, and a copyright bar.",
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
      "A call-to-action panel — abstract mark, two-tone headline, subtext and pill button — combined with a minimal link footer and copyright bar.",
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
      "A refined split-panel testimonial slider — light/dark, 3 transition effects, a giant decorative quote mark, and autoplay progress.",
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
  },
  {
    slug: "accordion-cards",
    name: "Accordion Cards",
    description:
      "An interactive card accordion — hover to expand, with a cursor-tracked glow, image parallax, and staggered content reveal.",
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
      "A product-style image viewer — a large main frame with prev/next arrows and an image counter, backed by a click-to-jump thumbnail strip and a reset-to-first button.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "gallery-lightbox",
    name: "Gallery Lightbox",
    description:
      "A theme-aware image gallery grid with a fullscreen lightbox — click-to-zoom, arrow-key navigation, Escape to close, and body scroll lock.",
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
    slug: "card-stack",
    name: "Card Stack",
    description:
      "A scroll-driven feature card stack — cards fly away one by one as the user scrolls, revealing the next, with progress dots and a card counter.",
    category: "Card",
    free: true,
  },
  {
    slug: "card-carousel",
    name: "Card Carousel",
    description:
      "A cinematic featured-card carousel — one wide active card with a filmstrip of neighbor slivers, staggered text reveal, hover parallax, autoplay, and touch/keyboard navigation.",
    category: "Card",
    free: false,
  },
  {
    slug: "hover-gallery",
    name: "Hover Gallery",
    description:
      "A 3D coverflow-style image gallery — hovering tilts neighboring images into a perspective fan around the highlighted one, with click-to-expand or a fullscreen lightbox.",
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
    name: "Glass Navigation",
    description:
      "A glassmorphic pill navbar that expands into a full panel of large nav links, a tagline, and social links — with a CTA button, badges, active-page highlight, and auto/light/dark theming.",
    category: "Navbar",
    free: true,
  },
  {
    slug: "header-simple",
    name: "Header Simple",
    description:
      "A responsive site header — centered nav links on desktop, a tablet CTA-only view, and a mobile hamburger dropdown panel — with active-page highlighting and optional sticky positioning.",
    category: "Navbar",
    free: true,
  },
  {
    slug: "navbar-menu",
    name: "Navbar Menu",
    description:
      "A floating pill navbar with spring-animated dropdown menus — simple link lists or product card grids — in paper/glass/custom theming.",
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
      "A blurred, dimmed marquee of scrolling image/video rows fills the background — a sharp iPhone frame in front shows the exact same rows in perfect focus through its screen, with 3D cursor tilt and ambient glow.",
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
    slug: "laptop-mockup",
    name: "Laptop Mockup",
    description:
      "A realistic MacBook Pro frame that auto-fits its container, with 3D cursor tilt, ambient glow, and a video/image player with slide or fade transitions.",
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
      "A 3-column masonry image gallery that skews in response to scroll velocity — the faster you scroll, the more it tilts, settling back with a spring.",
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
      "A scroll-driven radial text carousel — items curve along an invisible circle and rotate into focus as you scroll, with an optional center image, title, and CTA.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "tilted-carousel",
    name: "Tilted Carousel",
    description:
      "A 3D book-flow carousel where cards tilt around the active slide, with paper/glass themes and 3 title alignment styles.",
    category: "Carousel",
    free: false,
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
      "Square cards fan out diagonally into a stacked deck — each inactive card rotates and offsets away from the active one, with paper/glass themes.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "hero-slider-carousel",
    name: "Hero Slider Carousel",
    description:
      "An e-commerce hero slider with split and full-width slide layouts, badges, CTA buttons, Ken Burns effect, ring-progress indicators, and swipe/keyboard navigation.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "circular-links-menu",
    name: "Circular Links Menu",
    description:
      "A fan-out circular navigation menu anchored to any edge — hovering a link crossfades in its background image or color while the label pushes outward.",
    category: "Menu",
    free: false,
  },
  {
    slug: "bento-flip-grid",
    name: "Bento Flip Grid",
    description:
      "A responsive bento-grid gallery — click any tile to flip it and reveal extended copy on the back, with a hover image zoom and adaptive column count.",
    category: "Card",
    free: false,
  },
  {
    slug: "comparison-table",
    name: "Comparison Table",
    description:
      "A theme-aware pricing/feature comparison matrix — plan headers with a highlighted column, category-grouped rows with tooltips, a sticky header, and a stacked card layout on mobile.",
    category: "Table",
    free: false,
  },
  {
    slug: "hover-media-cards",
    name: "Hover Media Cards",
    description:
      "A row of image/video cards that expand on hover to reveal a title, staggered subtitle list, and CTA arrow — with badges, per-card overlay colors, and a tap-to-toggle accordion on mobile.",
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
    free: false,
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
  },
  {
    slug: "linear-progress-bars",
    name: "Linear Progress Bars",
    description:
      "A card of linear progress rows — plain ratio bars, file-upload rows with icons/subtitles/shimmer, milestone ticks, and an inline variant — with scroll-triggered fill animation.",
    category: "Progress",
    type: "element",
    free: true,
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
      "Cycling phrases that decrypt from scrambled characters into readable text — left-to-right, right-to-left, or random reveal order, with a scramble-out transition and blinking cursor.",
    category: "Typography",
    free: false,
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
      "A scroll-driven feature card stack — each card flies away with a rotation/scale as the next one peeks up from behind, self-scrolling within its own container so it can be embedded anywhere.",
    category: "Card",
    free: false,
  },
  {
    slug: "ai-agent-wave",
    name: "AI Agent Wave",
    description:
      "A Siri-style glowing multi-strand waveform line for voice/AI assistant UIs — cursor-reactive boost, idle/listening/speaking state levels, and optional floating avatar bubbles.",
    category: "Background",
    free: true,
  },
  {
    slug: "logo-grid",
    name: "Logo Grid",
    description:
      "A wrapping grid of client/partner logos with scroll-triggered stagger reveal, magnetic cursor-follow hover, grayscale-to-color reveal, and optional name tooltips.",
    category: "Logo",
    free: true,
  },
  {
    slug: "dot-image-slider",
    name: "Dot Image Slider",
    description:
      "A before/after image reveal — a luminance-mapped halftone dot rendering on one side, the real photo on the other, dragged apart by a glowing lightsaber-style divider handle.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "diamond-scroll-gallery",
    name: "Diamond Scroll Gallery",
    description:
      "A rotated grid of diamond-cropped images that drift at different parallax speeds per column as you scroll — self-scrolling within its own container.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "blog-card-horizontal",
    name: "Blog Card Horizontal",
    description:
      "A horizontal article card — image/video media panel, category and read-time badges, tags, author row, and a themed read button. Dark, light, and glass presets.",
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
      "A loading spinner kit with 4 variants — rotating lines, ring, dual counter-rotating ring, and bouncing dots — sharing a common color/size/speed API.",
    category: "Loader",
    type: "element",
    free: true,
  },
  {
    slug: "animated-checkbox",
    name: "Animated Checkbox",
    description:
      "An accessible checkbox with an animated draw-in checkmark, focus ring, and optional label, helper text, required marker, and info tooltip.",
    category: "Form",
    type: "element",
    free: true,
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
      "An image sliced into a grid of tiles connected by cloth-like spring physics — drag to warp the fabric, release to let it settle, or click for a rippling flick.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "feature-split-section",
    name: "Feature Split Section",
    description:
      "A theme-aware (paper/glass) marketing section — a fixed photo panel with heading and CTA on one side, a static 2x2 feature grid on the other. Stacks on mobile.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "expand-card-grid",
    name: "Expand Card Grid",
    description:
      "A 2x2 grid of image cards that expand to fill the frame on click, revealing title/description/CTA — with keyboard arrow navigation between cards and swipe-to-close on touch.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "hero-centered",
    name: "Hero Centered",
    description:
      "A centered hero section — eyebrow badge, heading, subheading, CTA button, and an infinite-scrolling social-proof logo ticker with edge masking.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "about-founder-section",
    name: "About Founder Section",
    description:
      "A two-column About Us hero — heading, description and CTAs on one side, a founder card with quote, bio paragraphs, and a signature (or script-font fallback) on the other.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "kanban-board",
    name: "Kanban Board",
    description:
      "A drag-and-drop task board with a hand-rolled pointer-based drag engine — velocity tilt, edge autoscroll, ghost drop-position indicator, priority badges, avatar stacks, and light/dark theming.",
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
      "A multi-series line/area chart — smooth Catmull-Rom curves, a highlighted zone band, a reference line, endpoint value badges, and a hover crosshair with per-series tooltips.",
    category: "Chart",
    free: true,
  },
  {
    slug: "bar-chart",
    name: "Bar Chart",
    description:
      "A stacked bar chart — up to 5 series per bar, a reference line, a peak-value annotation, and a hover tooltip breaking down each bar's segments with a running total.",
    category: "Chart",
    free: true,
  },
  {
    slug: "tearable-reveal",
    name: "Tearable Reveal",
    description:
      "A physically-simulated cloth intro reveal — drag to tear open a torn-paper layer covering an image, with breakable constraints, particle debris, frayed jagged/rounded edges, and optional surface text or logo. Includes Auto Tear and Reset controls.",
    category: "Effect",
    free: true,
  },
  {
    slug: "arc-mood-carousel",
    name: "Arc Mood Carousel",
    description:
      "A physics-driven drag carousel that arranges cards along a 3D arc, with 4 mood presets (Editorial, Luxury, Chaos, Raw) that swap color grading, shadows, film grain, and typography — momentum drag, autoplay, hover glow and parallax.",
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
      "A realistic iPad Pro mockup with an internal video/image carousel — swipe or auto-advance, slide/fade transitions, portrait/landscape orientation, 3D cursor tilt, ambient glow, and a progress bar.",
    category: "Mockup",
    free: false,
  },
  {
    slug: "desktop-mockup-carousel",
    name: "Desktop Mockup Carousel",
    description:
      "A realistic Studio Display-style monitor mockup with an internal video/image carousel — swipe or auto-advance, slide/fade transitions, 3D cursor tilt, ambient glow, and a progress bar.",
    category: "Mockup",
    free: false,
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
      "Two auto-scrolling rows of image cards moving in opposite directions — hovering lifts a card and dims its neighbors in a cascading falloff, click opens a detail dialog with tag, description, and CTA.",
    category: "Marquee",
    free: false,
  },
  {
    slug: "rotating-gallery",
    name: "Rotating Gallery",
    description:
      "An ambient, continuously auto-rotating 3D carousel of image cards arranged in a circle, with a front-facing title label — no interaction required, driven purely by CSS 3D transforms.",
    category: "Gallery",
    free: true,
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
      "A responsive grid of vertical reels-style video cards — hover or click to play, muted/looped inline with a play/pause and mute chip, creator username below, plus a paper/glass theme toggle.",
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
      "A numbered portfolio/case-study accordion — expanding an item reveals the project description alongside a row of result metrics, optional media, and an outbound link.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "index-grid-section",
    name: "Index Grid Section",
    description:
      "An editorial table-of-contents grid — hairline-bordered cells fill with an inverted color sweep (or an image/video reveal) on hover, exposing a short description beneath each title.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "liquid-glass-video",
    name: "Liquid Glass Video",
    description:
      "A glassmorphic video player for uploaded files or Vimeo — custom blurred control bar, drag-to-seek, volume slider, speed menu, Picture-in-Picture, and scroll autoplay.",
    category: "Media",
    free: false,
  },
  {
    slug: "dropdown-menu-pro",
    name: "Dropdown Menu Pro",
    description:
      "A feature-rich dropdown menu with nested submenus, checkboxes, toggles, progress rows, badges, avatars/headers, keyboard navigation, and 4 placement options.",
    category: "Menu",
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
    slug: "decision-tree-diagram",
    name: "Decision Tree Diagram",
    description:
      "An animated binary decision-tree diagram that auto-cycles through every root-to-leaf path, lighting up nodes and edges step by step until a leaf outcome is reached.",
    category: "Diagram",
    free: false,
  },
  {
    slug: "neural-logic-graph",
    name: "Neural Logic Graph",
    description:
      "An animated node-graph diagram — input and output cards connect to a glowing center hub via smooth bezier paths with flowing particles.",
    category: "Diagram",
    free: false,
  },
  {
    slug: "latency-trace-diagram",
    name: "Latency Trace Diagram",
    description:
      "An animated request-journey diagram — packets travel hop-by-hop between client/server/cache/database/API nodes, with randomized per-hop latency, simulated failures, and a live result readout.",
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
    free: false,
  },
  {
    slug: "liquid-image-effect",
    name: "Liquid Image Effect",
    description:
      "A WebGL-warped image with cursor-driven distortion — 4 shader effects (ripple, melt, bulge, glitch RGB-split), with touch support and adjustable strength/radius/speed.",
    category: "Effect",
    free: false,
  },
  {
    slug: "liquid-text",
    name: "Liquid Text",
    description:
      "Text distorted through an animated SVG noise filter — 5 presets (liquid, melt, blob, ghost, crystal), cursor-proximity intensity, and a click burst ripple.",
    category: "Typography",
    free: false,
  },
  {
    slug: "sticky-scroll-reveal",
    name: "Sticky Scroll Reveal",
    description:
      "A feature section with a sticky preview card and a scrolling text column — the card's content and background swap as each section scrolls into focus. Collapses to a flat stacked list on mobile.",
    category: "Card",
    free: false,
  },
  {
    slug: "word-reveal",
    name: "Word Reveal",
    description:
      "Staggered word or character reveal text, driven by scroll progress, viewport entry, or a manual trigger — 4 animation presets, 3 stagger patterns, and word highlighting.",
    category: "Typography",
    free: false,
  },
  {
    slug: "node-field",
    name: "Node Field",
    description:
      "A WebGL particle constellation background — freely-drifting nodes connected by fading lines when close enough, with cursor repel/attract and touch support.",
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
      "A polished toast/alert notification — 5 tones, stacked or inline layout, icons, primary/secondary actions, dismiss and auto-dismiss, light/dark theme, plus a showcase mode rendering every variant side by side.",
    category: "Alert",
    type: "element",
    free: true,
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
      "A WebGL shader background of flowing Perlin-noise wave lines — adjustable line count/width/blur, direction, gradient colors, a vignette, and mouse-reactive distortion.",
    category: "Background",
    free: false,
  },
  {
    slug: "fluid-wave",
    name: "Fluid Wave",
    description:
      "A WebGL shader background — domain-warped fractal noise flowing like silk, with cursor/touch ripple interaction and 6 color presets (or fully custom colors).",
    category: "Background",
    free: false,
  },
  {
    slug: "dot-image-loader",
    name: "Dot Image Loader",
    description:
      "An auto-animating loading screen — a halftone dot rendering of your image is scanned into existence by a glowing lightsaber-style sweep, then oscillates in a loop while a 'Preparing...' label and spinner play below.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "circular-spinning-text",
    name: "Circular Spinning Text",
    description:
      "Text arranged in a circle that auto-spins or links to scroll progress — optional counter-rotating second ring, hover-to-pause, glow, and a centered content slot for a logo or icon.",
    category: "Typography",
    free: false,
  },
  {
    slug: "image-hotspot",
    name: "Image Hotspot",
    description:
      "A single image annotated with pulsing clickable hotspot dots — clicking one opens a popup card (title, price, description, CTA) that auto-positions itself to stay inside the image bounds.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "product-grid-section",
    name: "Product Grid Section",
    description:
      "A responsive product/portfolio grid section — heading, per-card image with hover zoom and reveal overlay, category/price meta row, optional badge, and a centered CTA button below the grid.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "hero-video-glass",
    name: "Hero Video Glass",
    description:
      "A full-bleed autoplay video hero with a frosted liquid-glass pill navbar, a character-by-character animated two-line heading, staggered fade-in subheading/CTAs, and a glass tag pill.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "pixel-grid-reveal",
    name: "Pixel Grid Reveal",
    description:
      "An image reveal built from a grid of solid color cells that dissolve away as the photo zooms down to scale — 4 reveal orderings (random, left-to-right, top-to-bottom, center-out), viewport-triggered, with optional replay on hover.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "wave-gallery-page",
    name: "Wave Gallery Page",
    description:
      "A self-scrolling text/image list gallery — scrolling ripples a sinusoidal wave through each title row's spacing while its paired image or video crossfades in centered behind the list, with an optional counter overlay.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "project-index-list",
    name: "Project Index List",
    description:
      "An editorial title/year project list over a shared floating background — hovering a row zoom-settles in that item's image with cursor parallax, while a directional color highlight sweeps in behind the exclusion-blended label.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "scroll-swatch-showcase",
    name: "Scroll Swatch Showcase",
    description:
      "A self-scrolling, pinned swatch/color showcase — a headline and CTA sit above a horizontal filmstrip of slides with interleaved parallax and fading captions, plus clickable thumbnails and tag filters that smooth-scroll to match.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "container-scroll-ipad",
    name: "Container Scroll iPad",
    description:
      "A scroll-driven hero — a heading and badge translate and fade while a hand-built photorealistic iPad frame rotates from a tilted angle to flat and scales up as you scroll, in Silver/Space Gray and Landscape/Portrait.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "skewed-page-scroller",
    name: "Skewed Page Scroller",
    description:
      "A full-bleed, one-page-at-a-time scroller — each page splits into two diagonally skewed halves (text panel + image panel) that slide off in opposite directions on wheel, keyboard, swipe, or nav-dot navigation.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "feature-card-illustrated",
    name: "Feature Card Illustrated",
    description:
      "A self-contained feature card with a live mini-illustration (list, code editor, bar chart, chart node, or dashboard node) animating in the background, a title/description, and a solid or outline CTA button.",
    category: "Card",
    free: true,
  },
  {
    slug: "process-spotlight",
    name: "Process Spotlight",
    description:
      "A process/steps section with a horizontal tab strip (auto-advancing progress bars, stories-UI style) above a single-step spotlight stage — a giant ghost numeral, title, description, and optional image with a direction-aware transition.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "ai-assistant-orb",
    name: "AI Assistant Orb",
    description:
      "An animated, canvas-rendered AI assistant orb with 6 themes — Soap Bubble, Cosmic Dark, Holographic, Wave, Plasma Dark, and Liquid Metal — each a unique glowing sphere or Siri-style waveform, with adjustable size, speed, and glow.",
    category: "Background",
    free: false,
  },
  {
    slug: "video-scroll-story",
    name: "Video Scroll Story",
    description:
      "A self-scrolling, pinned full-bleed video story — each scene crossfades in with its own background color, a staggered word-by-word title reveal, an optional giant ambient scene number, progress dots, a vertical progress bar, and a scroll hint.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "service-list-cursor-preview",
    name: "Service List Cursor Preview",
    description:
      "A masthead-style services list — on desktop, hovering a row shows its image in a panel that eases toward the cursor as it moves; on mobile or keyboard, the row expands inline instead. Dark/light theme toggle and full Service/ItemList microdata.",
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
      "A single video card with a pulsing glow-blob frame that morphs into a fullscreen lightbox on click — supports direct URL, YouTube, Vimeo, or uploaded files, a cursor-following watch label, hover preview loop, and a Web Audio sound-reactive glow.",
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
      "A click-to-expand horizontal speaker/profile gallery — panels grow via flex-grow when active, the photo goes from grayscale to color with cursor parallax, and the name, job title, tag, and CTA stagger in with delayed transitions.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "laptop-scroll-reveal",
    name: "Laptop Scroll Reveal",
    description:
      "A scroll-driven hero — a hand-built MacBook frame physically opens its lid as you scroll while the screen content, background color, and a staggered feature title/description crossfade between slides, with progress dots and a vertical progress bar.",
    category: "Hero",
    free: false,
  },
  {
    slug: "world-map-pro",
    name: "World Map Pro",
    description:
      "An interactive, hand-decoded SVG world map — click or hover any country to reveal a data card with a badge, headline metric, and detail rows, with 5 style presets, an optional legend, and a pre-selected-country mode.",
    category: "Data",
    free: false,
  },
  {
    slug: "feature-grid-mosaic",
    name: "Feature Grid Mosaic",
    description:
      "A theme-aware (paper/glass) 4×8 mosaic feature grid — a centered badge, heading, and subheading above 8 independently configured cells, each either a full-bleed hover-reveal image card or a colored text card with a link.",
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
    free: false,
  },
  {
    slug: "marquee-hero-section",
    name: "Marquee Hero Section",
    description:
      "A theme-aware (paper/glass) social-proof hero — centered badge, heading, subheading, and CTA button above a two-row infinite photo marquee with faded edges, hover captions, and opposite/same scroll directions.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "review-gallery",
    name: "Review Gallery",
    description:
      "A split-panel review slider — a cross-fading photo strip on one side, and a quote with name, role, dot pagination, thumbnail strip and prev/next navigation on the other.",
    category: "Testimonial",
    free: false,
  },
  {
    slug: "review-showcase",
    name: "Review Showcase",
    description:
      "A three-column review slider — a vertical counter/label rail, a photo with draggable thumbnail strip, and an italic serif pull-quote with name, role and prev/next navigation.",
    category: "Testimonial",
    free: false,
  },
  {
    slug: "testimonial-logos",
    name: "Testimonial Logos",
    description:
      "A compact trust bar — a star rating with a helped-N-teams label above an infinite, edge-masked logo marquee.",
    category: "Testimonial",
    free: true,
  },
  {
    slug: "testimonial-bento",
    name: "Testimonial Bento",
    description:
      "A full testimonial section — heading, description and CTA, an optional trust bar with logo marquee, and a staggered scroll-in grid of glass quote cards with avatar, name and role.",
    category: "Testimonial",
    type: "block",
    free: false,
  },
  {
    slug: "dice-discount-popup",
    name: "Dice Discount Popup",
    description:
      "A gamified discount popup — roll two animated 3D dice for a reward tier (with a doubles bonus), copy the code, and track rolls left across a session. Inline or corner-widget popup with manual, delay or scroll triggers.",
    category: "Alert",
    free: false,
  },
  {
    slug: "scratch-card-popup",
    name: "Scratch Card Popup",
    description:
      "A gamified scratch-to-win popup — drag to scratch a gold-foil canvas off a 3x3 icon grid, match three to win a reward tier with a confetti burst, copy the code, and track attempts left. Inline or corner-widget popup with manual, delay or scroll triggers.",
    category: "Alert",
    free: false,
  },
  {
    slug: "download-section",
    name: "Download Section",
    description:
      "An app-download hero — badge, heading, description, a scroll-in feature list, star rating, App Store / Google Play buttons, and a hand-built iPhone frame with an animated revenue chart card.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "business-hours",
    name: "Business Hours",
    description:
      "A premium opening-hours card — live open/closed status with a pulsing dot, a day-by-day schedule, and a Get Directions link built from an address or custom URL.",
    category: "Widget",
    free: false,
  },
  {
    slug: "feature-showcase",
    name: "Feature Showcase",
    description:
      "A two-column feature section — eyebrow, heading, stat pills and a click-to-expand step accordion on the left, a tabbed image panel with crossfading previews on the right.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "feature-showcase-split",
    name: "Feature Showcase Split",
    description:
      "A symmetric feature spotlight — a centered heading over a three-column layout with icon feature cards on both sides of a portrait image, staggered scroll-in reveal.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "motion-gallery-grid",
    name: "Motion Gallery Grid",
    description:
      "A perfectly aligned image grid with a centered glassmorphism overlay card — heading, subtitle and CTA button, with a staggered blur/slide/fade/scale entrance triggered on scroll into view.",
    category: "Gallery",
    free: true,
  },
  {
    slug: "qr-code-widget",
    name: "QR Code Widget",
    description:
      "A QR-code card — title, description, code image, hint text and an open-link button, inline or as a corner-widget popup with a focus-trapped modal dialog.",
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
      "A scroll-driven feature section — a sticky iPhone frame and crossfading stat cards on one side, a heading/description/CTA that swaps per slide on the other, with an animated background color transition and a progress rail.",
    category: "Mockup",
    free: false,
  },
  {
    slug: "hero-scroll-gallery",
    name: "Hero Scroll Gallery",
    description:
      "A cinematic hero — a content panel with an animated ticker, eyebrow, heading and CTAs beside a tilted three-column photo wall that drifts continuously, columns alternating direction and speed.",
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
      "A centered app-download hero — a light/dark theme toggle, glass pill CTA, heading, description, App Store / Google Play buttons with star rating, and a three-phone fan stage with an ambient glow and bottom fade mask.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "feature-showcase-video",
    name: "Feature Showcase Video",
    description:
      "A two-column feature section — eyebrow, heading, stat pills and a step accordion on the left, an accent-colored tabbed media panel on the right that crossfades between images and looping videos.",
    category: "Feature",
    type: "block",
    free: false,
  },
  {
    slug: "google-reviews",
    name: "Google Reviews",
    description:
      "A theme-aware social-proof carousel — a Google mark, aggregate rating and CTA header above a draggable, autoplaying grid of individual review cards.",
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
      "An App Store review carousel — Apple mark, aggregate rating and CTA header above a draggable autoplaying grid of review cards.",
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
  },
  {
    slug: "timeline-milestones",
    name: "Timeline Milestones",
    description:
      "A two-column header (eyebrow/heading and a side description) above a chronological milestone list — each year expands to reveal a description and optional image, connected by a rail that lights up to the open step.",
    category: "Timeline",
    free: false,
  },
  {
    slug: "blog-article-cards",
    name: "Blog Article Cards",
    description:
      "A theme-aware blog card grid — each card shows a photo with a quarter-circle notch cut into its corner holding a round arrow-link button, plus up to three colored category tags.",
    category: "Blog",
    free: false,
  },
  {
    slug: "hotspot-showcase",
    name: "Hotspot Showcase",
    description:
      "A shoppable image with pulsing hotspot dots — clicking one swaps a side product card with color swatches, a multi-image arrow carousel, sizes, price, and a buy button, with a progress rail to browse between products.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "footer-mega",
    name: "Footer Mega",
    description:
      "A dense mega-footer — logo, description and socials on the left, up to four link columns across the middle, and a secondary rounded panel underneath for guides, tools and team links, with a copyright bottom bar.",
    category: "Footer",
    type: "block",
    free: false,
  },
  {
    slug: "image-sidebar-dock",
    name: "Image Sidebar Dock",
    description:
      "A macOS-dock-style vertical nav — labels magnify and shift toward the cursor by proximity, each linked to a crossfading image panel with title, description and tag.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "coin-flip-game",
    name: "Coin Flip Game",
    description:
      "A real 3D CSS coin — click or tap to flip with a physical spin animation, a yes/no question field, flip history dots, and a heads/tails ratio readout.",
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
      "A fully playable 2048 — arrow-key and swipe controls, spring-animated tile merges, score and best-score tracking, and win/game-over overlays.",
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
      "A classic Minesweeper with three board sizes, flood-fill reveal, right-click flagging, a live mine counter and timer, and a confetti burst on a win.",
    category: "Widget",
    free: true,
  },
  {
    slug: "memory-match-game",
    name: "Memory Match Game",
    description:
      "A flip-card memory matching game with animal emoji, three difficulty levels, a 3D flip animation, move/score tracking, and a win overlay.",
    category: "Widget",
    free: true,
  },
  {
    slug: "pong-game",
    name: "Pong Game",
    description:
      "A canvas Pong against a bot opponent — three difficulty levels, multi-round progression with a color shift and speed increase each round, keyboard and touch-drag paddle control.",
    category: "Widget",
    free: true,
  },
  {
    slug: "dino-runner-game",
    name: "Dino Runner Game",
    description:
      "A canvas endless-runner in the style of the offline dino game — pixel-drawn running dino, procedurally spawned cactus obstacles, three difficulty speeds, tap/space/arrow-up to jump, and a high-score tracker.",
    category: "Widget",
    free: true,
  },
  {
    slug: "space-invaders-game",
    name: "Space Invaders Game",
    description:
      "A canvas Space Invaders — a descending grid of pixel-drawn invaders that shoot back, three difficulty levels, keyboard controls on desktop and on-screen move/fire buttons on mobile, with a win/lose end screen.",
    category: "Widget",
    free: true,
  },
  {
    slug: "tower-blocks-game",
    name: "Tower Blocks Game",
    description:
      "A dependency-free stack-the-block game rendered on a single canvas with a hand-rolled isometric projection — perfect stacks keep the tower's width, misaligned drops chop the overhang off and it falls away.",
    category: "Widget",
    free: true,
  },
  {
    slug: "maze-runner-game",
    name: "Maze Runner Game",
    description:
      "A procedurally generated recursive-backtracker maze across 10 difficulty levels, with keyboard, swipe, mouse-wheel, device-tilt, and gamepad controls, a live timer, and a speed-based score.",
    category: "Widget",
    free: true,
  },
  {
    slug: "glow-jump-widget",
    name: "Glow Jump Widget",
    description:
      "A floating-action-button popup that opens a glowing 4-level platformer — jump between walls, dodge moving lava, and collect coins to finish each level, keyboard and on-screen touch controls included.",
    category: "Widget",
    free: true,
  },
  {
    slug: "balloon-popper-game",
    name: "Balloon Popper Game",
    description:
      "A mouse-aimed bow-and-arrow balloon-popping mini-game — pop enough balloons within your arrow limit to unlock a coupon code, with a fail/retry screen if you run out.",
    category: "Widget",
    free: true,
  },
  {
    slug: "dart-throw-game",
    name: "Dart Throw Game",
    description:
      "A drag-to-aim, release-to-throw target game with gravity-arced projectiles, ring-based scoring, streak bonuses, a best-score tracker, and a confetti burst on bullseyes.",
    category: "Widget",
    free: true,
  },
  {
    slug: "spin-to-win-wheel",
    name: "Spin to Win Wheel",
    description:
      "A canvas-drawn prize wheel with a single-spin-per-visitor lock (persisted in localStorage), eased spin-down physics, and a reward modal with a copyable coupon code.",
    category: "Widget",
    free: true,
  },
  {
    slug: "memory-cards-widget",
    name: "Memory Cards Widget",
    description:
      "A floating-action-button popup that opens a color-matching memory game — 3 difficulty levels, a live timer/move counter, best-score tracking, subtle Web Audio sound effects, and a confetti win screen.",
    category: "Widget",
    free: true,
  },
  {
    slug: "globe-studio",
    name: "Globe Studio",
    description:
      "A draggable, auto-rotating WebGL globe (Three.js) with 6 render styles — realistic, terrain, wireframe, hologram, monochrome, neon — plus glowing city pins with hover cards, animated connection arcs, and a starfield.",
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
    name: "Cursor Reveal Hero",
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
    slug: "wave-marquee",
    name: "Wave Marquee",
    description:
      "An SVG textPath marquee that tiles text along a curved track — wave, circle, infinity, arch, or line — with an optional gradient glowing ribbon and a second independent layer for a layered scrolling effect.",
    category: "Widget",
    free: true,
  },
  {
    slug: "orbiting-globe-badges",
    name: "Orbiting Globe Badges",
    description:
      "A rotating canvas particle globe (8 render styles) rising from the bottom of its container, surrounded by semicircular orbit rings carrying mirrored badge icons that alternate spin direction per ring.",
    category: "Widget",
    free: false,
  },
  {
    slug: "video-hero-navbar",
    name: "Video Hero Navbar",
    description:
      "A full-bleed looping video hero with a floating liquid-glass navbar, a character-by-character animated two-line heading, and staggered fade-in subheading, buttons, and tag.",
    category: "Hero",
    type: "block",
    free: false,
  },
  {
    slug: "progress-rows-card",
    name: "Progress Rows Card",
    description:
      "A light/dark card of labeled gradient progress bars with dividers between rows, animating to their target width on scroll-into-view or immediately.",
    category: "Progress",
    free: true,
  },
  {
    slug: "circular-title-carousel",
    name: "Circular Title Carousel",
    description:
      "A CSS 3D full-circle ring of images continuously spinning behind a large stroked, drop-shadowed title that stays fixed in front.",
    category: "Carousel",
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
      "A large content card synced to a draggable curved bottom navigation strip of thumbnails that arc up and fade out toward the edges, with keyboard and swipe support.",
    category: "Carousel",
    free: false,
  },
  {
    slug: "phone-stats-showcase",
    name: "Phone Stats Showcase",
    description:
      "An interactive iPhone mockup playing a swipeable story-style media carousel with a username/verified overlay, 3D cursor tilt, ambient glow, and optional floating analytics cards (stat, revenue with sparkline, and top-viewers list).",
    category: "Mockup",
    free: false,
  },
  {
    slug: "feature-media-highlight",
    name: "Feature Media Highlight",
    description:
      "A two-column feature section — a heading and rich-text subtitles with inline bold-highlight markup on one side, a configurable image/video panel on the other, stacking on narrow widths with scroll fade-ins.",
    category: "Feature",
    type: "block",
    free: true,
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
    free: false,
  },
  {
    slug: "social-post-testimonial-wall",
    name: "Social Post Testimonial Wall",
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
      "An interactive iPhone mockup playing a swipeable story-style media carousel with a username overlay, 3D cursor tilt, ambient glow, and up to ten optional floating analytics cards (tracking, stats, sparkline, engagement, platform split, notifications, follower growth, revenue) positioned around it.",
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
    slug: "code-scanner-stream",
    name: "Code Scanner Stream",
    description:
      "An infinite stream of image cards scrolling behind a glowing canvas-drawn scanner bar that reveals a generated source-code view of whichever card it crosses, with 5 color themes and horizontal or vertical orientation.",
    category: "Effect",
    free: false,
  },
  {
    slug: "phone-reel-showcase",
    name: "Phone Reel Showcase",
    description:
      "An iPhone mockup that plays a swipeable, story-style reel of videos and images with tap/drag navigation, a progress bar, 3D cursor tilt, and an ambient glow behind the device.",
    category: "Mockup",
    free: true,
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
    slug: "cinematic-scroll-story",
    name: "Cinematic Scroll Story",
    description:
      "A self-contained scroll-driven product story: a pinned, scroll-scrubbed video backdrop with particles and a sticky nav, a fading hero, a scroll-revealed 3-card grid, and a closing statement that blurs into view.",
    category: "Hero",
    type: "block",
    free: true,
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
    slug: "laptop-reel-showcase",
    name: "Laptop Reel Showcase",
    description:
      "A MacBook mockup that plays a swipeable carousel of videos and images on its screen, with tap/drag navigation, a progress bar, optional 3D cursor tilt, and an ambient glow behind the device.",
    category: "Mockup",
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
    name: "Instagram Story Viewer",
    description:
      "An Instagram Stories-style viewer with tap/swipe/keyboard navigation, animated per-slide progress bars, a mute toggle for video slides, a pause indicator, an optional CTA link, and a configurable thumbnail strip.",
    category: "Gallery",
    free: false,
  },
  {
    slug: "coverflow-services-hero",
    name: "Coverflow Services Hero",
    description:
      "A split hero with eyebrow/heading/description/button content on one side and a 3D coverflow slide deck on the other, with staggered text reveal, cursor image parallax, drag/keyboard navigation, and a light/dark theme toggle.",
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
  },
  {
    slug: "social-post-simulator",
    name: "Social Post Simulator",
    description:
      "A mock social-media post for showcasing content in marketing pages, with four generic app styles: a photo feed card, a micro-blog card, a full-bleed vertical video reel, and a professional career-network card, all with locally simulated like/bookmark/repost interactions.",
    category: "Mockup",
    free: false,
  },
  {
    slug: "wheel-spin-discount-popup",
    name: "Wheel Spin Discount Popup",
    description:
      "A gamified discount-capture widget where visitors spin a weighted SVG prize wheel for a reward, with a themed reveal modal and code copy, rendered inline or as a corner-launched popup with manual/delay/scroll triggers.",
    category: "Widget",
    free: true,
  },
];

export function getComponent(slug: string) {
  return components.find((c) => c.slug === slug);
}

export const categories = Array.from(new Set(components.map((c) => c.category)));
