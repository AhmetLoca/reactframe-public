"use client";

import { usePathname } from "next/navigation";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";

// The /preview/[slug] route is an isolated iframe target used by the
// component detail page's device switcher — it needs its own real
// viewport (for sm:/md: breakpoints to respond to the iframe's actual
// width) and none of the site chrome.
//
// /templates/preview/[slug]/view and /pages/preview/[slug]/view are the
// same idea one level up: the isolated iframe target for a full template
// or page, embedded inside LayoutPreview's device frame — it stays
// chromeless so what's shown inside that frame is only the template
// itself. The wrapper page one level up (/templates/preview/[slug],
// /pages/preview/[slug]) is a normal catalog detail page — same shell as
// /components/[slug] — so it keeps the site nav/footer.
export function isChromelessPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname.startsWith("/preview/")) return true;
  if (pathname.startsWith("/templates/preview/") && pathname.endsWith("/view")) return true;
  if (pathname.startsWith("/pages/preview/") && pathname.endsWith("/view")) return true;
  return false;
}

// The whole site uses plain native scroll — no smooth-scroll library.
// (It used to run everything through Lenis; that broke position: sticky
// tracking for scroll-jacked components rendered live inline, and fought
// with wheel-forwarding from catalog-card previews and preview iframes,
// causing scroll to visibly stall partway down the page. Native scroll
// has none of those failure modes.)
export function SiteChrome({ nav, footer, children }: { nav: React.ReactNode; footer: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  const isPreview = isChromelessPath(pathname);

  if (isPreview) return <>{children}</>;

  return (
    <>
      {nav}
      <main className="flex-1">{children}</main>
      {footer}
      <ScrollToTopButton />
    </>
  );
}
