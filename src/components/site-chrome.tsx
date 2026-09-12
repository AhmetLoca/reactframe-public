"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "@/components/smooth-scroll";

// The /preview/[slug] route is an isolated iframe target used by the
// component detail page's device switcher — it needs its own real
// viewport (for sm:/md: breakpoints to respond to the iframe's actual
// width) and none of the site chrome or scroll-jacking.
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

export function SiteChrome({ nav, footer, children }: { nav: React.ReactNode; footer: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  const isPreview = isChromelessPath(pathname);

  if (isPreview) return <>{children}</>;

  return (
    <SmoothScroll>
      {nav}
      <main className="flex-1">{children}</main>
      {footer}
    </SmoothScroll>
  );
}
