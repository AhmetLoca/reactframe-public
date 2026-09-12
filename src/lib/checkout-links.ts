export interface CheckoutLink {
  /** Lemon Squeezy checkout URL for this component's product. */
  url: string;
  /** Shown on the "Buy" button, e.g. "$12" — purely cosmetic, optional. */
  price?: string;
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
