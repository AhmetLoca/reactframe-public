export interface CheckoutLink {
  /** Lemon Squeezy checkout URL for this component's product. */
  url: string;
  /** Shown on the "Buy" button, e.g. "$12" — purely cosmetic, optional. */
  price?: string;
}

// All-Access: every premium component, block and Pro page, plus everything released during the year.
// Swap "#" for the Lemon Squeezy checkout url once the product exists; every All-Access button follows.
export const allAccessCheckout: CheckoutLink = { url: "#", price: "$49" };
export const ALL_ACCESS_REGULAR_PRICE = "$129";

/** True once the item has a real checkout url rather than the "#" placeholder. */
export function isCheckoutLive(checkout: CheckoutLink | undefined): boolean {
  return !!checkout && /^https?:\/\//.test(checkout.url);
}

// Per-component Lemon Squeezy checkout links — the pilot for selling
// components individually rather than as a Premium bundle. A component
// with no entry here still ships fully open (see the `unlocked` fallback
// in /components/[slug]/page.tsx): only components listed here actually
// get gated behind a real "Buy" button, so onboarding a new one is just
// adding its entry once the Lemon Squeezy product is live.
//
// Prices below are confirmed — urls are all "#" placeholders until each
// component's real Lemon Squeezy checkout link is ready. Swap "#" for the
// real URL as each product goes live; nothing else needs to change.
export const checkoutLinks: Record<string, CheckoutLink> = {
// Case Study Section
