import { components } from "@/lib/catalog-data";

// Curated sets of components that share a design language (a theme system, a structure, a use case), so a
// page built from one kit looks like one designer made it. Consumed by /api/catalog, llms.txt and the AI
// design guide; `sections` tells an agent which slot each component fills. A kit has no price of its own
// yet: its premium members are priced one by one through /api/quote until kit bundles exist.

export interface KitSection {
  /** The slot on a page, e.g. "Header" or "Testimonials". */
  role: string;
  slugs: string[];
}

export interface Kit {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bestFor: string[];
  /** How to keep the kit's members consistent with each other once they're on one page. */
  consistency: string;
  /** Three member slugs whose thumbnails make the kit's cover collage (first one is the large tile). */
  cover: [string, string, string];
  sections: KitSection[];
}

const elementSlugs = components.filter((c) => c.type === "element").map((c) => c.slug);

export const KITS: Kit[] = [
  {
    slug: "paper-glass",
    name: "Paper & Glass",
    tagline: "A complete marketing site in one visual language.",
    description:
      "Navbar to footer, every component here shares the same paper (warm light) and glass (translucent dark) theme system, so switching the whole site between the two looks is one prop per component.",
    bestFor: ["Agencies and studios", "SaaS marketing sites", "Portfolios", "Product launches"],
    consistency: "Set every component's theme to the same value, \"paper\" or \"glass\", and give them all the same accent color.",
    cover: ["feature-grid-mosaic", "navbar-menu", "footer-wordmark"],
    sections: [
      { role: "Header", slugs: ["navbar-menu"] },
      { role: "Hero", slugs: ["marquee-hero-section", "coverflow-services-hero"] },
      { role: "Features", slugs: ["feature-split-section", "feature-grid-mosaic"] },
      { role: "Work / gallery", slugs: ["gallery-reveal", "gallery-lightbox", "tilted-carousel", "diagonal-carousel", "animated-carousel"] },
      { role: "Before / after", slugs: ["compare-slider"] },
      { role: "Pricing", slugs: ["comparison-table"] },
      { role: "Blog", slugs: ["blog-article-cards"] },
      { role: "Footer", slugs: ["footer-wordmark", "footer-mega", "footer-cta", "footer-columns"] },
    ],
  },
  {
    slug: "social-proof",
    name: "Social Proof",
    tagline: "Reviews from the platforms your customers already trust.",
    description:
      "Platform-branded review carousels built on one shared layout (aggregate rating header, review cards, CTA), plus a trust bar and a testimonial section. Every review component ships schema.org Review markup.",
    bestFor: ["Local businesses", "E-commerce and marketplace sellers", "Apps", "Hospitality"],
    consistency:
      "Use the platform the business is really reviewed on, one per page (two at most). Pass reviewSubject so the structured data names the business.",
    cover: ["google-reviews", "airbnb-reviews", "testimonial-logos"],
    sections: [
      { role: "Trust bar", slugs: ["testimonial-logos"] },
      { role: "Platform reviews", slugs: ["google-reviews", "airbnb-reviews", "app-store-reviews", "etsy-reviews", "ebay-reviews", "facebook-reviews"] },
      { role: "Testimonial section", slugs: ["testimonial-bento"] },
    ],
  },
  {
    slug: "ai-product",
    name: "AI Product",
    tagline: "The interface pieces of an AI product, from prompt to answer.",
    description:
      "Prompt inputs, streamed answer cards, voice assistants, image-generation loaders and status indicators that share the same restrained silver-on-dark look.",
    bestFor: ["AI startups", "Chat and assistant products", "AI feature launches", "Demos"],
    consistency: "Stay on dark; use one accent for the orb, waveform and highlights; pick one voice pill and one answer card style.",
    cover: ["living-orb-ai", "ai-chat-prompt", "ai-voice-01"],
    sections: [
      { role: "Hero visual", slugs: ["living-orb-ai", "ai-asistant"] },
      { role: "Prompt input", slugs: ["ai-chat-prompt"] },
      { role: "Answers", slugs: ["ai-answer-01", "ai-answer-02", "ai-answer-03", "ai-edit-review"] },
      { role: "Chat", slugs: ["ai-chat-panel", "ai-chat"] },
      { role: "Voice", slugs: ["ai-voice-01", "ai-voice-02", "ai-voice-03", "ai-voice-04", "ai-voice-05"] },
      { role: "Status", slugs: ["ai-dynamic-island-01", "ai-dynamic-island-02"] },
      { role: "Image generation", slugs: ["ai-image-loader-01", "ai-image-loader-02", "ai-image-loader-03", "ai-image-loader-04"] },
    ],
  },
  {
    slug: "dashboard",
    name: "Dashboard",
    tagline: "An admin or analytics app, entirely free.",
    description: "App navigation, metric cards, five charts from one charting system, a data table and a task board: everything an internal tool or analytics view needs.",
    bestFor: ["Admin panels", "Analytics dashboards", "Internal tools", "SaaS app screens"],
    consistency: "Give every chart the same series colors in the same order, and keep one card radius and padding for charts, stat cards and the table.",
    cover: ["line-chart", "stat-card", "pie-chart"],
    sections: [
      { role: "Navigation", slugs: ["sidebar", "tabs"] },
      { role: "Metrics", slugs: ["stat-card", "meter", "progress-circle-bars", "linear-progress-bars"] },
      { role: "Charts", slugs: ["line-chart", "bar-chart", "range-area-chart", "radar-chart", "pie-chart"] },
      { role: "Data", slugs: ["data-table", "kanban-board"] },
    ],
  },
  {
    slug: "showcase",
    name: "Showcase",
    tagline: "Put the product on a device and in a feed.",
    description: "Device frames and social post mockups for showing an app, a website or a campaign in context.",
    bestFor: ["App launches", "Product pages", "Marketing and social campaigns", "Case studies"],
    consistency: "Use real screenshots at the device's aspect ratio, one device family per section, and matching frame colors.",
    cover: ["phone-mockup", "browser-mockup", "instagram-post-mockup"],
    sections: [
      { role: "Devices", slugs: ["phone-mockup", "browser-mockup", "desktop-mockup-carousel", "ipad-mockup-carousel", "phone-gallery"] },
      { role: "Scroll story", slugs: ["sticky-phone-scroll", "phone-analytics-mockup"] },
      { role: "Social posts", slugs: ["instagram-post-mockup", "x-post-mockup", "linkedin-post-mockup", "tiktok-post-mockup"] },
    ],
  },
  {
    slug: "growth",
    name: "Growth",
    tagline: "Offers, urgency and gamified discounts.",
    description:
      "Announcement bar, countdown and discount popups that share one set of campaign themes (e-commerce, campaign, restaurant, SaaS, event), for sales and lead capture.",
    bestFor: ["E-commerce sales", "Launches and events", "Restaurants", "Lead capture"],
    consistency: "Use at most one popup per page, with the same campaign theme as the banner, and one countdown end date across the page.",
    cover: ["spin-to-win-wheel", "announcement-banner", "countdown-timer"],
    sections: [
      { role: "Announcement", slugs: ["announcement-banner", "countdown-timer"] },
      { role: "Discount popup", slugs: ["spin-to-win-wheel", "scratch-card-popup", "dice-roll-discount-popup", "dice-discount-popup", "sales-ticket-popup"] },
    ],
  },
  {
    slug: "ui-elements",
    name: "UI Elements",
    tagline: "Every form control, feedback state and primitive, free.",
    description: "Buttons, inputs, selects, dialogs, menus, tabs, tooltips and the rest: accessible primitives that share one font, one sizing scale and one accentColor prop.",
    bestFor: ["Any site or app", "Forms and settings pages", "Design systems"],
    consistency: "Pass the same accentColor, theme and size to every element.",
    cover: ["date-picker", "button", "toggle-pro"],
    sections: [{ role: "Elements", slugs: elementSlugs }],
  },
];

export function kitSlugs(kit: Kit): string[] {
  return Array.from(new Set(kit.sections.flatMap((s) => s.slugs)));
}
