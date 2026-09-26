import { components } from "@/lib/catalog-data";
import { REAL_PAGES } from "@/lib/pages-data";
import { ALL_ACCESS_REGULAR_PRICE, allAccessCheckout, checkoutLinks, isCheckoutLive, pageCheckoutLinks, type CheckoutLink } from "@/lib/checkout-links";

// Prices a list of ReactFrame slugs for an AI agent that has built a site from the catalog: free items
// cost nothing, premium components and Pro pages are summed from their checkout prices, and All-Access
// is recommended once it's the cheaper way to get them all. Shared by /api/quote, /api/catalog and the
// MCP server's get_quote tool, so the numbers an agent quotes always match the site's Buy buttons.

const SITE_URL = "https://reactframe.com";

export function priceToCents(price: string | undefined): number {
  const n = parseFloat(price?.replace(/[^0-9.]/g, "") ?? "");
  return Number.isNaN(n) ? 0 : Math.round(n * 100);
}

const formatUsd = (cents: number) => `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;

const liveUrl = (checkout: CheckoutLink | undefined) => (checkout && isCheckoutLive(checkout) ? checkout.url : undefined);

export interface QuoteItem {
  slug: string;
  name: string;
  kind: "component" | "page";
  free: boolean;
  price: string;
  url: string;
  /** Present once the item's Lemon Squeezy checkout is live. */
  checkoutUrl?: string;
  /** Free components only: the shadcn CLI command that installs it. */
  installCommand?: string;
}

export interface Quote {
  currency: "USD";
  items: QuoteItem[];
  unknownSlugs: string[];
  premiumCount: number;
  /** Sum of the premium items bought one by one. */
  premiumTotal: string;
  allAccess: { price: string; regularPrice: string; includes: string; url: string; checkoutUrl?: string };
  recommendation: "free" | "individual" | "all-access";
  summary: string;
}

export function allAccessOffer() {
  return {
    price: allAccessCheckout.price ?? "$49",
    regularPrice: ALL_ACCESS_REGULAR_PRICE,
    includes: "Every premium component, block and Pro page, plus every new premium release for 12 months. One payment, no subscription.",
    url: `${SITE_URL}/premium`,
    ...(liveUrl(allAccessCheckout) ? { checkoutUrl: liveUrl(allAccessCheckout) } : {}),
  };
}

export function componentPrice(slug: string): string | undefined {
  return checkoutLinks[slug]?.price;
}

export function pagePrice(slug: string): string | undefined {
  return pageCheckoutLinks[slug]?.price;
}

export function buildQuote(slugs: string[]): Quote {
  const items: QuoteItem[] = [];
  const unknownSlugs: string[] = [];

  for (const slug of Array.from(new Set(slugs.map((s) => s.trim()).filter(Boolean)))) {
    const component = components.find((c) => c.slug === slug);
    if (component) {
      const checkout = checkoutLinks[slug];
      items.push({
        slug,
        name: component.name,
        kind: "component",
        free: component.free,
        price: component.free ? "$0" : (checkout?.price ?? "Premium"),
        url: `${SITE_URL}/components/${slug}`,
        ...(component.free ? { installCommand: `npx shadcn@latest add ${SITE_URL}/r/${slug}.json` } : {}),
        ...(!component.free && liveUrl(checkout) ? { checkoutUrl: liveUrl(checkout) } : {}),
      });
      continue;
    }
    const page = REAL_PAGES.find((p) => p.slug === slug);
    if (page) {
      const checkout = pageCheckoutLinks[slug];
      items.push({
        slug,
        name: page.name,
        kind: "page",
        free: page.free,
        price: page.free ? "$0" : (checkout?.price ?? "Pro"),
        url: `${SITE_URL}/pages/preview/${slug}`,
        ...(!page.free && liveUrl(checkout) ? { checkoutUrl: liveUrl(checkout) } : {}),
      });
      continue;
    }
    unknownSlugs.push(slug);
  }

  const premium = items.filter((i) => !i.free);
  const totalCents = premium.reduce((sum, i) => sum + priceToCents(i.price), 0);
  const allAccess = allAccessOffer();
  const allAccessCents = priceToCents(allAccess.price);
  const recommendation = premium.length === 0 ? "free" : totalCents >= allAccessCents ? "all-access" : "individual";

  const summary =
    recommendation === "free"
      ? "Everything selected is free: install each item with its installCommand."
      : recommendation === "all-access"
        ? `${premium.length} premium item${premium.length === 1 ? "" : "s"} would cost ${formatUsd(totalCents)} one by one; All-Access is ${allAccess.price} (regularly ${allAccess.regularPrice}) and covers all of them plus 12 months of new releases.`
        : `${premium.length} premium item${premium.length === 1 ? "" : "s"} for ${formatUsd(totalCents)} in total, bought one by one. All-Access (${allAccess.price}) becomes the better deal once the total reaches that.`;

  return {
    currency: "USD",
    items,
    unknownSlugs,
    premiumCount: premium.length,
    premiumTotal: formatUsd(totalCents),
    allAccess,
    recommendation,
    summary,
  };
}
