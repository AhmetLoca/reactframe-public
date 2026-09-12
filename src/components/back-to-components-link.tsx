"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const linkClassName =
  "mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground";

// Elements and Blocks cross-list real components (see ComponentMeta.type
// in catalog-data.ts) — those cards still link to the same
// /components/[slug] page, but "back" from there should return to
// wherever the visitor actually came from, not always /components.
const RETURN_LABELS: Record<string, string> = {
  "/blocks": "Back to blocks",
  "/elements": "Back to elements",
};

function BackToComponentsLinkInner() {
  // Preserves whichever category/price/search filter the visitor was
  // browsing on /components — set via the `from` query param by the
  // catalog's card links — so this link (unlike the browser's own back
  // button, which already round-trips through the synced URL) also
  // returns to the same filtered view instead of resetting to "All".
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const from = searchParams.get("from");
  const href = returnTo ? returnTo : from ? `/components?${decodeURIComponent(from)}` : "/components";
  // returnTo can carry its own query string (e.g. "/blocks?category=Marketing",
  // so the origin category/price/search round-trips too) — match the label
  // against just the path portion.
  const label = (returnTo && RETURN_LABELS[returnTo.split("?")[0]]) || "Back to components";

  return (
    <Link href={href} className={linkClassName}>
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  );
}

// Isolated in its own Suspense boundary so reading the search params here
// doesn't force the whole (otherwise statically-prerenderable) component
// detail page into dynamic rendering — only this small link CSRs.
export function BackToComponentsLink() {
  return (
    <Suspense
      fallback={
        <Link href="/components" className={linkClassName}>
          <ArrowLeft className="size-4" />
          Back to components
        </Link>
      }
    >
      <BackToComponentsLinkInner />
    </Suspense>
  );
}
