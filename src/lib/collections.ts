import { components, type ComponentMeta } from "@/lib/catalog-data";

// Use-case landing pages (/collections/<slug>): each answers one query people type into a search engine or
// ask an AI assistant ("react ai voice components", "google reviews widget react"), with a direct answer up
// top, advice on choosing, every matching component, and a query-specific FAQ. Members come from explicit
// slugs and/or whole catalog categories, so a new component in a listed category joins automatically.
//
// In `intro`, {count}, {free} and {premium} are replaced with the live numbers when the page renders.

export interface Collection {
  slug: string;
  /** The page's h1: the query, phrased as a heading. */
  title: string;
  /** Shorter label for cards and links. */
  shortTitle: string;
  metaDescription: string;
  intro: string;
  howToChoose: string[];
  faq: { q: string; a: string }[];
  slugs?: string[];
  categories?: string[];
  exclude?: string[];
  /** A kit (src/lib/kits.ts) that pairs well with this collection. */
  kit?: string;
  related: string[];
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "react-ai-voice-components",
    title: "React AI Voice Assistant Components",
    shortTitle: "AI voice assistant",
    metaDescription: "Animated React components for AI voice assistants: audio-reactive voice pills, Dynamic Island style status, AI orbs and listening indicators. Tailwind + Motion, shadcn install.",
    intro:
      "ReactFrame has {count} React components for AI voice interfaces ({free} free): voice pills with audio-reactive visualizers, Dynamic Island style assistants that morph between listening, thinking and speaking, and animated AI orbs. Each has idle, listening and speaking states you set from your own speech or realtime API, and installs with the shadcn CLI.",
    howToChoose: [
      "A compact control that sits in your UI: a voice pill (ai-voice-01 to ai-voice-04), each with a different visualizer (bars, waveform, dot matrix, 3D particles).",
      "A full-screen or card-sized voice mode: ai-voice-05, a portrait card with a large mic button.",
      "System-level status that expands with details: the Dynamic Island style pills.",
      "A hero visual or an 'AI is here' presence rather than a control: living-orb-ai or ai-asistant.",
    ],
    faq: [
      {
        q: "Do these components talk to an AI model?",
        a: "No, they are the interface. Set the status prop (idle, listening, speaking) from your speech or realtime API (OpenAI Realtime, ElevenLabs, Deepgram and so on), and use onStart and onStop to begin and end a session when the user taps.",
      },
      {
        q: "Will the visualizer react to real audio?",
        a: "Yes. The ai-voice pills and card take input=\"microphone\" to follow the user's microphone level (with a sensitivity setting); input=\"simulated\" animates on its own for demos and previews.",
      },
    ],
    slugs: ["ai-voice-01", "ai-voice-02", "ai-voice-03", "ai-voice-04", "ai-voice-05", "ai-dynamic-island-01", "ai-dynamic-island-02", "ai-asistant", "living-orb-ai"],
    kit: "ai-product",
    related: ["react-ai-chat-components", "react-ai-image-generation-loaders", "react-animated-backgrounds"],
  },
  {
    slug: "react-ai-chat-components",
    title: "React AI Chat Components",
    shortTitle: "AI chat",
    metaDescription: "React components for AI chat products: chat widgets, prompt inputs with model pickers, streamed answer cards with citations and an AI edit review. Tailwind + Motion.",
    intro:
      "ReactFrame has {count} React components for AI chat interfaces ({free} free): a floating chat widget, a full chat thread, a prompt input with @-mentions and model selection, answer cards that reveal the reply word by word with source citations, an agent-style research tracker, and an inline AI edit review with accept and reject.",
    howToChoose: [
      "A support or assistant bubble on a marketing site: ai-chat, the floating launcher that opens into a panel.",
      "The main screen of a chat product: ai-chat-panel for the thread and ai-chat-prompt for the input.",
      "Showing an answer (search, RAG, agents): ai-answer-01 or ai-answer-02 for streamed answers, ai-answer-03 when you want visible research steps.",
      "AI writing tools: ai-edit-review for rewrite suggestions shown as a diff.",
    ],
    faq: [
      {
        q: "How do I connect my own model?",
        a: "ai-chat-panel takes the conversation as a messages prop and calls onSend with what the user typed; send that to your model (OpenAI, Anthropic, the Vercel AI SDK and so on) and append the reply. The answer cards take the reply text and reveal it word by word."
      },
      {
        q: "Do they work with the Vercel AI SDK?",
        a: "Yes. They are plain React components driven by props, so map the SDK's messages and status to them and call the SDK from onSend.",
      },
    ],
    slugs: ["ai-chat", "ai-chat-panel", "ai-chat-prompt", "ai-answer-01", "ai-answer-02", "ai-answer-03", "ai-edit-review"],
    kit: "ai-product",
    related: ["react-ai-voice-components", "react-chat-widgets", "react-ai-image-generation-loaders"],
  },
  {
    slug: "react-ai-image-generation-loaders",
    title: "React AI Image Generation Loaders",
    shortTitle: "AI image loaders",
    metaDescription: "Animated React loading states for AI image generation: particle spheres, light fields and topographic reveals that cross-fade into the finished image.",
    intro:
      "ReactFrame has {count} React loaders for AI image generation ({free} free). Instead of a spinner, each one animates while the image is being generated (a particle sphere, a field of light-reactive dots, rolling topographic lines) and then reveals the finished picture.",
    howToChoose: [
      "One image at a time: ai-image-loader-01, 02 or 03, depending on the look you want during generation.",
      "Several variations at once, like Midjourney's grid: ai-image-loader-04.",
    ],
    faq: [
      {
        q: "How do I connect the loader to my generation API?",
        a: "Set preview to \"generating\" while your request runs, then pass the returned image (image.src) and set preview to \"done\"; the component plays the reveal. onComplete fires when it finishes.",
      },
    ],
    slugs: ["ai-image-loader-01", "ai-image-loader-02", "ai-image-loader-03", "ai-image-loader-04"],
    kit: "ai-product",
    related: ["react-ai-chat-components", "react-ai-voice-components", "react-image-gallery-components"],
  },
  {
    slug: "react-testimonial-components",
    title: "React Testimonial Components",
    shortTitle: "Testimonials",
    metaDescription: "React testimonial components and sections: sliders, walls, marquees, video testimonials and bento layouts, with schema.org review markup. Tailwind + Motion.",
    intro:
      "ReactFrame has {count} React testimonial components ({free} free): sliders, infinite-scrolling walls and marquees, spotlight photo testimonials, video testimonial walls and full testimonial sections. The review-style ones emit schema.org Review data for your own testimonials.",
    howToChoose: [
      "Lots of short quotes: a moving wall or marquee (testimonial-wall, review-marquee-wall, social-post-testimonial-wall).",
      "A few strong stories: a slider or spotlight (testimonial-slider, testimonial-spotlight, review-gallery).",
      "Video testimonials: testimonial-video-wall.",
      "A complete section with heading and CTA: testimonial-bento.",
    ],
    faq: [
      {
        q: "Do the testimonials help SEO?",
        a: "Components marked SEO-ready output schema.org Review structured data when you pass your own testimonials; set reviewSubject to the business or product being reviewed.",
      },
    ],
    categories: ["Testimonial"],
    exclude: ["google-reviews", "airbnb-reviews", "app-store-reviews", "ebay-reviews", "etsy-reviews", "facebook-reviews", "testimonial-logos"],
    kit: "social-proof",
    related: ["react-review-widgets", "react-team-sections", "react-feature-sections"],
  },
  {
    slug: "react-review-widgets",
    title: "Google, Airbnb and App Store Review Widgets for React",
    shortTitle: "Review widgets",
    metaDescription: "React review widgets styled after Google, Airbnb, App Store, Etsy, eBay and Facebook reviews, with aggregate rating headers and schema.org markup.",
    intro:
      "ReactFrame has {count} React components for showing customer reviews ({free} free): carousels styled after Google, Airbnb, App Store, Etsy, eBay and Facebook reviews, each with an aggregate rating header, plus a star rating input and a compact trust bar. The platform widgets emit schema.org review data.",
    howToChoose: [
      "Use the platform your customers actually review you on: Google for local businesses, Airbnb for stays, App Store for apps, Etsy or eBay for shops.",
      "A small trust line under a hero or CTA: testimonial-logos.",
      "Collecting a rating in a form: rating-stars.",
    ],
    faq: [
      {
        q: "Do these widgets pull reviews from Google or Airbnb automatically?",
        a: "No, they display the reviews you pass in. Fetch them from the platform's API or paste them in, and keep them up to date; they are styled to match each platform, not official embeds.",
      },
      {
        q: "Can the reviews show star ratings in Google search?",
        a: "The widgets output schema.org Review and AggregateRating markup. Google only shows review stars for eligible content, and reviews a business publishes about itself usually aren't eligible for rich results, but the markup still describes your content to search engines.",
      },
    ],
    slugs: ["google-reviews", "airbnb-reviews", "app-store-reviews", "etsy-reviews", "ebay-reviews", "facebook-reviews", "testimonial-logos", "rating-stars"],
    kit: "social-proof",
    related: ["react-testimonial-components", "react-discount-popups", "react-hero-sections"],
  },
  {
    slug: "react-image-gallery-components",
    title: "React Image Gallery Components",
    shortTitle: "Image galleries",
    metaDescription: "Animated React image gallery components: masonry and bento grids, 3D cylinders and rings, scroll-driven galleries, lightboxes and hover reveals. Tailwind + Motion.",
    intro:
      "ReactFrame has {count} React image gallery components ({free} free), from classic grids with lightboxes to 3D cylinders, scroll-driven zoom galleries, bento layouts and hover-reveal portfolios. Each takes an array of your images and installs with the shadcn CLI.",
    howToChoose: [
      "Portfolios and case studies: gallery-reveal, project-index-list, expand-card-grid.",
      "Photo-heavy brands (restaurants, hotels, fashion): mood-gallery, cinematic-stacked-gallery, premium-bento-grid.",
      "A wow moment on a landing page: cylinder-gallery, cards-gallery-ring, bento-scroll-zoom-gallery.",
      "Simple and fast: motion-gallery-grid or gallery-lightbox.",
    ],
    faq: [
      {
        q: "Do the galleries lazy-load images?",
        a: "They render standard img elements with your URLs, so you can pass optimized sources (or swap in next/image) and add loading=\"lazy\" for images below the fold.",
      },
    ],
    categories: ["Gallery"],
    related: ["react-carousel-components", "react-device-mockups", "react-hero-sections"],
  },
  {
    slug: "react-carousel-components",
    title: "React Carousel Components",
    shortTitle: "Carousels",
    metaDescription: "Animated React carousel components: 3D curved and coverflow carousels, drag-to-swipe sliders, hotspot product carousels and canvas transitions. Tailwind + Motion.",
    intro:
      "ReactFrame has {count} React carousel components ({free} free): 3D curved and coverflow carousels, drag and momentum sliders, a product carousel with clickable hotspots, rotating card fans and canvas-drawn transitions. All of them respond to the arrow keys, and most support touch swiping.",
    howToChoose: [
      "Product or feature highlights: carousel-3d, arc-coverflow-carousel, hotspot-carousel.",
      "Full-bleed hero slides: carousel-slider or canvas-transition-carousel.",
      "Playful card decks: diagonal-carousel, rotary-card-carousel, tilted-carousel.",
    ],
    faq: [
      {
        q: "Are the carousels accessible?",
        a: "They all respond to the arrow keys, and the sliders and coverflows also support touch swiping. Give each slide meaningful alt text, and keep autoplay off or slow for users who prefer reduced motion.",
      },
    ],
    categories: ["Carousel"],
    related: ["react-image-gallery-components", "react-hero-sections", "react-device-mockups"],
  },
  {
    slug: "react-animated-backgrounds",
    title: "Animated Background Components for React",
    shortTitle: "Animated backgrounds",
    metaDescription: "Animated React backgrounds: WebGL wave lines, particle constellations, starfields, film grain gradients, dot grids and digital rain. Tailwind + canvas + WebGL.",
    intro:
      "ReactFrame has {count} animated background components for React ({free} free): WebGL wave lines and particle constellations, canvas starfields and night skies, film-grain gradient blobs, interactive dot grids and digital rain. Place one behind a hero or section and put your content on top.",
    howToChoose: [
      "Calm and premium, works for most brands: noise-background or soft-background.",
      "Tech, AI and developer products: node-field, wave-lines, dot-field-grid.",
      "Night, space or gaming themes: cosmic-background, shooting-stars, matrix-rain-background.",
      "Use one animated background per page and keep text contrast high on top of it.",
    ],
    faq: [
      {
        q: "Do animated backgrounds hurt performance?",
        a: "They run on canvas or WebGL and pause when off screen where possible. Use one per page, load it with next/dynamic (ssr: false) and keep it behind the hero rather than the whole page.",
      },
    ],
    slugs: ["noise-background", "soft-background", "cosmic-background", "shooting-stars", "node-field", "wave-lines", "dot-field-grid", "matrix-rain-background"],
    related: ["react-hero-sections", "react-text-animation-components", "react-ai-voice-components"],
  },
  {
    slug: "react-text-animation-components",
    title: "React Text Animation Components",
    shortTitle: "Text animations",
    metaDescription: "React text animation components: scramble and decrypt effects, scroll-driven word reveals, 3D tilt text, liquid distortion, particle text and kinetic typography.",
    intro:
      "ReactFrame has {count} React text animation components ({free} free): scramble and decrypt effects, word-by-word reveals driven by scroll, 3D tilt and liquid distortion for display type, text made of particles, kinetic typography and infinite text marquees.",
    howToChoose: [
      "Hero headlines: text-scramble-pro, tilt-text or liquid-text.",
      "Storytelling while scrolling: word-reveal or scroll-word-highlight.",
      "Bold brand moments: kinetic-typography-showcase, particle-text.",
      "Running banners: infinite-marquee or diagonal-ticker-strips.",
    ],
    faq: [
      {
        q: "Is animated text still readable by search engines and screen readers?",
        a: "Yes, the text stays in the DOM as real text; the effects animate how it's drawn. Keep the page's h1 as real text rather than a canvas-only effect.",
      },
    ],
    slugs: ["text-scramble-pro", "tilt-text", "liquid-text", "word-reveal", "scroll-word-highlight", "kinetic-typography-showcase", "particle-text", "infinite-marquee", "diagonal-ticker-strips"],
    related: ["react-animated-backgrounds", "react-hero-sections", "react-feature-sections"],
  },
  {
    slug: "react-navbar-components",
    title: "React Navbar and Navigation Components",
    shortTitle: "Navbars and navigation",
    metaDescription: "React navbar and navigation components: responsive headers, pill navbars with dropdowns, full-screen menus, app sidebars, macOS docks and menubars.",
    intro:
      "ReactFrame has {count} React navigation components ({free} free): responsive site headers with mobile menus, floating pill navbars with animated dropdowns, full-screen menus, a collapsible app sidebar, a macOS-style dock and a desktop menubar.",
    howToChoose: [
      "Marketing sites: header-simple (simple and free), glass-navigation or navbar-menu (dropdowns with product cards).",
      "Creative and portfolio sites: flowing-menu.",
      "Apps and dashboards: sidebar, with menubar for desktop-style tools.",
      "Playful app launchers: dock.",
    ],
    faq: [
      {
        q: "Are the navbars responsive?",
        a: "Yes. The site headers switch to a mobile menu at small widths; check each component's preview at the mobile width on its page.",
      },
    ],
    slugs: ["header-simple", "glass-navigation", "navbar-menu", "flowing-menu", "sidebar", "menubar", "dock"],
    related: ["react-footer-components", "react-hero-sections", "react-feature-sections"],
  },
  {
    slug: "react-footer-components",
    title: "React Footer Components",
    shortTitle: "Footers",
    metaDescription: "React footer components and blocks: minimal link-column footers, mega footers, giant wordmark footers and call-to-action footers. Tailwind + Motion.",
    intro:
      "ReactFrame has {count} React footer components ({free} free): minimal footers with link columns, dense mega footers, a footer with a giant brand wordmark, and footers that open with a call to action.",
    howToChoose: [
      "Most sites: footer-section or footer-premium (both free).",
      "Large sites with many links: footer-mega.",
      "Brand-forward sites: footer-wordmark.",
      "Ending on a conversion: footer-cta.",
    ],
    faq: [
      {
        q: "Can I use my own links and logo?",
        a: "Yes, links, columns, social icons and the logo are all props.",
      },
    ],
    categories: ["Footer"],
    kit: "paper-glass",
    related: ["react-navbar-components", "react-hero-sections", "react-feature-sections"],
  },
  {
    slug: "react-hero-sections",
    title: "React Hero Section Components",
    shortTitle: "Hero sections",
    metaDescription: "React hero sections and blocks: marquee heroes, scroll-zoom media reveals, coverflow and gallery heroes, app download heroes and founder intros.",
    intro:
      "ReactFrame has {count} React hero sections ({free} free): social-proof marquee heroes, scroll-driven media reveals, coverflow and gallery heroes, video scroll stories, app download heroes and founder introductions.",
    howToChoose: [
      "SaaS and startups: marquee-hero-section or scroll-zoom-media-reveal.",
      "Agencies and services: coverflow-services-hero.",
      "Apps: download-section or download-section-glass.",
      "Keep one h1 in the hero with your main keyword; several of these render it for you.",
    ],
    faq: [
      {
        q: "Is there a free hero section?",
        a: "The dedicated hero blocks are premium. For a free hero, put your own heading and CTA over a free animated background such as noise-background or cosmic-background.",
      },
    ],
    categories: ["Hero"],
    slugs: ["scroll-zoom-media-reveal", "cursor-reveal-hero"],
    kit: "paper-glass",
    related: ["react-feature-sections", "react-animated-backgrounds", "react-navbar-components"],
  },
  {
    slug: "react-feature-sections",
    title: "React Feature Section Components",
    shortTitle: "Feature sections",
    metaDescription: "React feature sections: mosaic grids, split and video feature showcases, process steps, services lists, tech stack and case study sections.",
    intro:
      "ReactFrame has {count} React feature sections ({free} free): mosaic feature grids, split and video showcases, process and step sections, services lists with cursor previews, tech stack lists and case study accordions.",
    howToChoose: [
      "Product features: feature-grid-mosaic, feature-showcase, feature-showcase-video.",
      "How it works: process-spotlight or process-steps-rail.",
      "Agencies and services: accordion-services-list, service-list-cursor-preview.",
      "Proof of work: case-study-section.",
    ],
    faq: [
      {
        q: "Can I change the number of features?",
        a: "Yes, features are passed as an array; the layouts adapt to the count within each component's supported range.",
      },
    ],
    categories: ["Feature"],
    kit: "paper-glass",
    related: ["react-hero-sections", "react-testimonial-components", "react-device-mockups"],
  },
  {
    slug: "react-device-mockups",
    title: "iPhone, Browser and Social Post Mockups for React",
    shortTitle: "Device mockups",
    metaDescription: "React mockup components: realistic iPhone, iPad, desktop and browser frames, plus Instagram, X, LinkedIn and TikTok post mockups.",
    intro:
      "ReactFrame has {count} React mockup components ({free} free): realistic iPhone, iPad, desktop and browser frames that play your screenshots and videos, scroll-driven phone stories, and Instagram, X, LinkedIn and TikTok post mockups.",
    howToChoose: [
      "Show an app: phone-mockup, phone-gallery or sticky-phone-scroll for a scroll story.",
      "Show a website: browser-mockup or desktop-mockup-carousel.",
      "Show a social campaign: instagram-post-mockup, x-post-mockup, linkedin-post-mockup, tiktok-post-mockup.",
    ],
    faq: [
      {
        q: "Can I put live UI inside a mockup?",
        a: "browser-mockup renders children, so real UI can go inside it. The phone and tablet frames play the images or videos you pass as media.",
      },
    ],
    categories: ["Mockup"],
    kit: "showcase",
    related: ["react-feature-sections", "react-image-gallery-components", "react-hero-sections"],
  },
  {
    slug: "react-chart-components",
    title: "React Chart and Dashboard Components",
    shortTitle: "Charts and dashboards",
    metaDescription: "Free React chart components (line, bar, area range, radar, pie) plus stat cards, meters and progress rings for dashboards. No chart library needed.",
    intro:
      "ReactFrame has {count} React chart and metric components ({free} free): line, bar, range area, radar and pie charts drawn in SVG without a charting library, plus stat cards with count-up numbers, meters and progress rings for dashboards.",
    howToChoose: [
      "Trends over time: line-chart or range-area-chart.",
      "Comparisons: bar-chart or radar-chart.",
      "Share of a whole: pie-chart.",
      "Single numbers: stat-card, meter, progress-circle-bars.",
    ],
    faq: [
      {
        q: "Do I need Recharts or Chart.js?",
        a: "No. The charts are self-contained SVG React components with their own animations; you pass the data as props.",
      },
    ],
    slugs: ["line-chart", "bar-chart", "range-area-chart", "radar-chart", "pie-chart", "stat-card", "stat-feature", "animated-stats", "meter", "progress-circle-bars", "linear-progress-bars", "data-table"],
    kit: "dashboard",
    related: ["react-navbar-components", "react-feature-sections", "react-ai-chat-components"],
  },
  {
    slug: "react-chat-widgets",
    title: "WhatsApp, Telegram and Messenger Chat Widgets for React",
    shortTitle: "Chat widgets",
    metaDescription: "React chat bubble widgets styled after WhatsApp, Telegram, Messenger, Instagram, Discord and X, with typing simulation, quick replies and availability.",
    intro:
      "ReactFrame has {count} React chat bubble widgets ({free} free), styled after WhatsApp, Telegram, Facebook Messenger, Instagram Direct, Discord and X: a floating button that opens a chat preview with a typing simulation and quick replies, then hands the visitor over to your real account.",
    howToChoose: [
      "Use the messenger your customers already use: WhatsApp for most local businesses, Messenger or Instagram for social-first brands, Discord for communities, Telegram for tech audiences.",
    ],
    faq: [
      {
        q: "Do these widgets connect to WhatsApp or Telegram?",
        a: "They hand the visitor over to your real account: the WhatsApp widget takes your phone number and the Telegram widget your username. The greeting, quick replies and typing preview inside the widget are set through props.",
      },
    ],
    categories: ["Social Media Widget"],
    related: ["react-ai-chat-components", "react-discount-popups", "react-review-widgets"],
  },
  {
    slug: "react-discount-popups",
    title: "Spin to Win Wheel and Discount Popups for React",
    shortTitle: "Discount popups",
    metaDescription: "Gamified React discount popups: spin-to-win wheels, scratch cards, dice rolls and ticket popups, plus announcement bars and countdown timers.",
    intro:
      "ReactFrame has {count} React components for offers and lead capture ({free} free): spin-to-win wheels, scratch cards, dice-roll discount popups and a ticket-shaped promo popup, plus an announcement bar and a countdown timer for urgency.",
    howToChoose: [
      "Collect emails with a game: spin-to-win-wheel or wheel-spin-discount-popup, scratch-card-popup, dice-roll-discount-popup.",
      "A simple promo in the corner: sales-ticket-popup.",
      "Site-wide sale messaging: announcement-banner with countdown-timer.",
      "Show one popup per visit at most, and never before the visitor has seen the page.",
    ],
    faq: [
      {
        q: "Can I change the prizes and odds?",
        a: "Yes. Each theme's prize list, with a weight per prize for its odds and the discount code it reveals, lives in the component source you install, so edit it to your own offers. Validate codes on your server before applying a discount.",
      },
    ],
    slugs: ["spin-to-win-wheel", "wheel-spin-discount-popup", "scratch-card-popup", "dice-roll-discount-popup", "dice-discount-popup", "sales-ticket-popup", "announcement-banner", "countdown-timer"],
    kit: "growth",
    related: ["react-review-widgets", "react-chat-widgets", "react-mini-games"],
  },
  {
    slug: "react-mini-games",
    title: "Playable Mini Game Components for React",
    shortTitle: "Mini games",
    metaDescription: "Free playable React games: 2048, Snake, Minesweeper, Pong, Tic Tac Toe, Space Invaders, memory match and a dino runner, with themes and touch controls.",
    intro:
      "ReactFrame has {count} playable mini games for React ({free} free): 2048, Snake, Minesweeper, Pong, Tic Tac Toe with an AI opponent, Space Invaders, a memory match, a dino runner and a coin flip, with themes, difficulty levels, touch controls and score tracking.",
    howToChoose: [
      "404 and error pages: dino-runner-game or snake-game.",
      "Waiting states and loading screens: 2048-game, memory-match-game.",
      "Community or event sites: pong-game, tic-tac-toe-game, space-invaders-game.",
    ],
    faq: [
      {
        q: "Do the games work on phones?",
        a: "Yes, they support swipe or tap controls as well as the keyboard.",
      },
    ],
    slugs: ["2048-game", "snake-game", "minesweeper-game", "pong-game", "tic-tac-toe-game", "space-invaders-game", "memory-match-game", "dino-runner-game", "coin-flip-game", "memory-cards-widget", "glow-jump-widget"],
    related: ["react-discount-popups", "react-animated-backgrounds", "react-text-animation-components"],
  },
  {
    slug: "react-team-sections",
    title: "React Team Section Components",
    shortTitle: "Team sections",
    metaDescription: "React team section components: expandable team lists, bio drawers, profile flip cards, team carousels and photo grids, with schema.org Person markup.",
    intro:
      "ReactFrame has {count} React components for team and about pages ({free} free): numbered lists with expandable bios, a grid that opens full bios in a drawer, profile flip cards, a coverflow team carousel and photo grids. They output schema.org Person data for your team.",
    howToChoose: [
      "Small teams with personality: profile-flip-card or team-cards-expand.",
      "Larger teams: team-drawer or meet-the-team.",
      "Editorial about pages: team-list.",
    ],
    faq: [
      {
        q: "Can I link team members' social profiles?",
        a: "team-drawer and team-list take social links per member, and include them in the structured data as sameAs; the others focus on photo, name and role.",
      },
    ],
    categories: ["Team"],
    related: ["react-testimonial-components", "react-feature-sections", "react-footer-components"],
  },
];

export function collectionMembers(collection: Collection): ComponentMeta[] {
  const fromCategories = components.filter((c) => collection.categories?.includes(c.category));
  const fromSlugs = (collection.slugs ?? []).map((s) => components.find((c) => c.slug === s)).filter((c): c is ComponentMeta => c !== undefined);
  const seen = new Set<string>();
  return [...fromSlugs, ...fromCategories].filter((c) => {
    if (collection.exclude?.includes(c.slug) && !collection.slugs?.includes(c.slug)) return false;
    if (seen.has(c.slug)) return false;
    seen.add(c.slug);
    return true;
  });
}

export function fillCollectionIntro(collection: Collection): string {
  const members = collectionMembers(collection);
  const free = members.filter((c) => c.free).length;
  const freeLabel = free === 0 ? "all premium" : free === members.length ? "all free" : `${free} free`;
  return collection.intro
    .replace("({free} free)", `(${freeLabel})`)
    .replace("{count}", String(members.length))
    .replace("{free}", String(free))
    .replace("{premium}", String(members.length - free));
}

export function collectionsForComponent(slug: string): Collection[] {
  return COLLECTIONS.filter((c) => collectionMembers(c).some((m) => m.slug === slug));
}
