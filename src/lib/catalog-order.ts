import { components, type ComponentMeta } from "@/lib/catalog-data";

// The order each catalog listing shows its items in. Shared by the listing pages (client) and the
// previous/next links on detail pages (server), so "next" is always the card that sits after this one.

// ---- Elements ------------------------------------------------------------------------------------

export const ELEMENT_GROUPS: { title: string; placeholders: string[] }[] = [
  { title: "Form & Input", placeholders: ["Checkbox Group", "Rich Text Editor", "Signature Pad", "Image Cropper"] },
  { title: "Feedback & Status", placeholders: ["Toast Stack", "Notification Center", "Status Dot", "Inline Validation Message"] },
  { title: "Navigation", placeholders: ["Dropdown Menu", "Mega Menu", "Mobile Tab Bar", "Table of Contents", "Scrollspy Anchor Links", "Language Switcher"] },
  { title: "Overlay", placeholders: ["Bottom Sheet", "Lightbox", "Cookie Consent Banner", "Product Tour"] },
  { title: "Data Display", placeholders: ["Calendar", "Basic Carousel", "Sparkline Stat", "Checklist"] },
  { title: "Layout", placeholders: ["Masonry Grid", "Bento Grid", "Sticky Header", "Section Container"] },
  { title: "Misc", placeholders: ["Theme Toggle", "Share Buttons", "Social Links", "Scroll Progress Bar"] },
];

// Real, shipped components that are cross-listed here from the main
// catalog (see ComponentMeta.type in catalog-data.ts) — they're still
// /components/[slug] pages, just also relevant as primitives.
export const BUILT_SLUGS_BY_GROUP: Record<string, string[]> = {
  "Form & Input": ["button", "input", "textarea", "form-field", "animated-checkbox", "radio-button", "select", "slider", "search-bar", "combobox", "multi-select", "date-picker", "time-picker", "input-otp", "number-input", "password-input", "phone-input", "credit-card-input", "currency-input", "segmented-control", "color-picker", "file-upload", "toggle-pro"],
  "Feedback & Status": ["badges-kit", "alert-toast", "progress-circle-bars", "linear-progress-bars", "linear-progress", "animated-loader", "tag", "tooltip", "skeleton", "callout", "meter"],
  Navigation: ["tabs", "breadcrumb", "pagination", "stepper", "command-palette", "menubar", "sidebar", "dock"],
  Overlay: ["modal", "popover", "drawer", "confirm-dialog", "hover-card", "context-menu"],
  "Data Display": ["rating-stars", "avatar", "avatar-group", "divider", "accordion", "card", "timeline", "tree-view", "stat-card", "code-block", "description-list"],
  Layout: ["splitter", "aspect-ratio", "scroll-area", "toolbar", "panel"],
  Misc: ["kbd", "empty-state", "tag-input", "back-to-top", "copy-button", "terminal", "inline-edit"],
};

export const builtElements: ComponentMeta[] = ELEMENT_GROUPS.flatMap((g) => BUILT_SLUGS_BY_GROUP[g.title] ?? [])
  .map((slug) => components.find((c) => c.slug === slug))
  .filter((c): c is ComponentMeta => Boolean(c));

// ---- Blocks --------------------------------------------------------------------------------------

export const BLOCK_CATEGORIES = ["All", "Marketing", "Dashboard / Application", "eCommerce", "Authentication", "Data & Tables", "AI & Chat"];

export const allBlocks = components.filter((c) => c.type === "block");

// Everything that isn't one of the other five tabs' own catalog category
// falls into Marketing (Footer/Testimonial/Hero/Feature/Team/Stats/CTA/Page
// blocks don't carry a "Marketing" category of their own).
const NON_MARKETING_LABELS = ["eCommerce", "Authentication", "Data & Tables", "AI & Chat", "Dashboard / Application"];

export const blocksByLabel: Record<string, ComponentMeta[]> = {
  All: allBlocks,
  Marketing: allBlocks.filter((c) => !NON_MARKETING_LABELS.includes(c.category)),
  eCommerce: allBlocks.filter((c) => c.category === "eCommerce"),
  Authentication: allBlocks.filter((c) => c.category === "Authentication"),
  "Data & Tables": allBlocks.filter((c) => c.category === "Data & Tables"),
  "AI & Chat": allBlocks.filter((c) => c.category === "AI & Chat"),
  "Dashboard / Application": allBlocks.filter((c) => c.category === "Dashboard / Application"),
};

// ---- Components ----------------------------------------------------------------------------------

export const catalogComponents = components.filter((c) => !c.type);

// "AI & Chat" is pinned first regardless of count — everything else still
// sorts by count desc, then alphabetically.
export function sortCategories(list: ComponentMeta[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const c of list) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
  return Array.from(counts.entries()).sort((a, b) => {
    if (a[0] === "AI & Chat") return -1;
    if (b[0] === "AI & Chat") return 1;
    return b[1] - a[1] || a[0].localeCompare(b[0]);
  });
}

// ---- Previous / next -----------------------------------------------------------------------------

const ORDERS = {
  element: builtElements,
  block: BLOCK_CATEGORIES.slice(1).flatMap((label) => blocksByLabel[label] ?? []),
  component: sortCategories(catalogComponents).flatMap(([category]) => catalogComponents.filter((c) => c.category === category)),
};

export const SEQUENCE_LABELS = { element: "Elements", block: "Blocks", component: "Components" } as const;

// Where a slug sits in the listing it belongs to, wrapping around at both ends.
export function getSequence(slug: string) {
  const kind: keyof typeof ORDERS = builtElements.some((c) => c.slug === slug) ? "element" : components.find((c) => c.slug === slug)?.type === "block" ? "block" : "component";
  const list = ORDERS[kind];
  const at = list.findIndex((c) => c.slug === slug);
  if (at < 0 || list.length < 2) return null;
  return {
    kind,
    position: at + 1,
    total: list.length,
    prev: list[(at - 1 + list.length) % list.length],
    next: list[(at + 1) % list.length],
  };
}
