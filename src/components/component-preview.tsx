"use client";

import * as React from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeSurface } from "@/components/code-block";
import { CodeVariantToolbar, CopyButton, type CodeLang, type CodeStyle } from "@/components/code-toolbar";
import { InstallCommand } from "@/components/install-command";
import { cn } from "@/lib/utils";

export interface ComponentCode {
  tsTailwind: string;
  jsTailwind?: string;
  tsCss?: string;
  jsCss?: string;
}

export const DEVICES = {
  desktop: { label: "Desktop", width: "100%" },
  tablet: { label: "Tablet", width: "768px" },
  mobile: { label: "Mobile", width: "375px" },
} as const;

export type Device = keyof typeof DEVICES;

export function DeviceIcon({ device }: { device: Device }) {
  if (device === "desktop") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
        <rect x="2.5" y="4.5" width="19" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 20.5H15M12 16.5V20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (device === "tablet") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
        <rect x="4.5" y="2.5" width="15" height="19" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 18.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
      <rect x="7" y="2.5" width="10" height="19" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 18.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Every device size renders through an <iframe> onto /preview/[slug] rather
// than mounting the component directly in this document. Two independent
// reasons, both because an iframe is its own browsing context:
// 1. sm:/md: utilities inside the previewed component are media queries
//    against the top-level viewport, so a resized <div> in this document
//    never actually triggers them — the iframe's viewport equals its own
//    box, so breakpoints respond for real at tablet/mobile widths.
// 2. This docs site uses Lenis for smooth scrolling, which breaks
//    position: sticky for any element scrolled through it (verified: a
//    plain sticky div stops tracking scroll under Lenis). Components that
//    use scroll-linked sticky sections (e.g. card-stack) would silently
//    misbehave if mounted inline even at "desktop" width. /preview/[slug]
//    opts out of the site's SmoothScroll wrapper, so sticky works there.
// The iframe reports its content height back via postMessage so it can be
// sized without an internal scrollbar — but only up to MAX_HEIGHT. Past
// that it's capped and left to scroll internally (the iframe's default
// behavior), rather than grown to match: an iframe's rendered box IS its
// document's viewport, so growing it to match a very tall component (e.g.
// card-stack's n*100vh scroll-jacked section) would inflate what "100vh"
// means inside it to the whole document instead of one screen, leaving no
// room to actually scroll through the section. Genuinely scroll-jacked
// components (card-stack, skew-scroll-gallery, scroll-card-stack,
// diamond-scroll-gallery, scroll-title-gallery, glass-showcase-scroll)
// stay on this default cap on purpose.
const MAX_HEIGHT = 800;

// Everything else that's simply taller than MAX_HEIGHT at some breakpoint —
// not scroll-jacked, just a naturally long page — gets its own higher cap
// here instead, sized to its real content height (desktop/tablet/mobile,
// whichever is tallest) plus a small buffer, so the preview iframe grows to
// fit instead of showing an internal scrollbar. Measured via a full scan of
// every component's /preview/[slug] route at all three device widths.
const TALL_PREVIEW_HEIGHTS: Record<string, number> = {
  "about-founder-section": 940,
  "ai-agent-wave": 940,
  "ai-assistant-orb": 940,
  "arc-mood-carousel": 940,
  "aura-cursor": 960,
  "bar-chart": 940,
  "blog-article-cards": 1660,
  "blog-card-horizontal": 940,
  "blog-card-vertical": 940,
  "browser-mockup": 940,
  "cards-gallery-ring": 940,
  "case-study-section": 1140,
  "circular-links-menu": 940,
  "circular-spinning-text": 940,
  "compare-slider": 940,
  "data-table": 940,
  "decision-tree-diagram": 940,
  "dot-image-loader": 940,
  "dot-image-slider": 940,
  "download-section-glass": 1280,
  "dropdown-menu-pro": 940,
  "expand-card-grid": 940,
  "expanding-panel-gallery": 940,
  "feature-card-illustrated": 940,
  "feature-grid-mosaic": 3080,
  "feature-showcase": 1620,
  "feature-showcase-video": 1320,
  "feature-split-section": 1800,
  "flowing-menu": 940,
  "fluid-wave": 940,
  "footer-cta": 1100,
  "gallery-expand": 940,
  "gallery-reveal": 940,
  "glass-navigation": 940,
  "glide-carousel": 960,
  "glow-card": 940,
  "hero-centered": 940,
  "hero-scroll-gallery": 1480,
  "hero-slider-carousel": 940,
  "hero-video-glass": 940,
  "image-deck-3d": 960,
  "image-hotspot": 940,
  "index-grid-section": 4300,
  "kanban-board": 940,
  "latency-trace-diagram": 940,
  "line-chart": 940,
  "linear-progress-bars": 940,
  "linen-drag-image": 940,
  "liquid-glass-video": 940,
  "liquid-text": 940,
  "logo-grid": 940,
  "logo-marquee": 940,
  "marquee-hero-section": 1080,
  "neural-logic-graph": 940,
  "orbit-logo-wheel": 940,
  "phone-marquee-showcase": 960,
  "phone-mockup": 940,
  "pie-chart": 940,
  "premium-bento-grid": 940,
  "process-spotlight": 940,
  "product-grid-section": 940,
  "progress-circle-bars": 960,
  "radar-chart": 940,
  "range-area-chart": 940,
  "rotate-carousel": 940,
  "rotating-gallery": 940,
  "service-list-cursor-preview": 1020,
  "skewed-page-scroller": 940,
  "social-proof-video-grid": 1620,
  "social-reels-grid": 940,
  "team-carousel": 940,
  "team-list": 940,
  "tearable-reveal": 1040,
  "tech-stack-section": 940,
  "testimonial-bento": 2680,
  "testimonial-spotlight": 940,
  "testimonial-wall": 940,
  "timeline-milestones": 1320,
  "video-glow-lightbox": 940,
  "wave-gallery-page": 940,
  "word-reveal": 940,
  "world-map-pro": 960,
};

// Unlike TALL_PREVIEW_HEIGHTS (a ceiling that only kicks in once real
// content exceeds it), this forces the preview frame to an exact height
// regardless of what the iframe reports — for components whose natural
// content height reads as "correct" but looks cramped in the frame.
const FIXED_PREVIEW_HEIGHTS: Record<string, number> = {
  "image-deck-3d": 750,
  "team-drawer": 840,
  "toggle-pro": 750,
};

// Placeholder shown blurred behind the paywall on the Code tab for premium
// components — never the real source, just enough shape to read as code.
const PREMIUM_CODE_PLACEHOLDER = `"use client";

import * as React from "react";

export function Component() {
  const [state, setState] = React.useState(false);

  return (
    <div className="relative">
      {/* premium implementation */}
    </div>
  );
}
`;

function DeviceFramePreview({ slug, width }: { slug: string; width: string }) {
  const [height, setHeight] = React.useState(360);
  // Tracks whether the iframe has reported real content dimensions yet —
  // until then the frame sits on the card's plain background and the
  // iframe itself stays invisible, so the ~1s it takes the iframe's own
  // document to load and settle never shows a half-rendered flash. Once it
  // reports in, the iframe eases into view on its own rather than the
  // frame popping straight to the loaded state.
  const [loaded, setLoaded] = React.useState(false);
  const lenis = useLenis();

  // Same stale-cache issue as the catalog's "Load More" (see components-catalog.tsx):
  // this frame can jump from the 360px loading placeholder to a much taller
  // real height once the iframe reports in (some components run well past
  // 1000px), well after Lenis already measured the page. Without this, wheel
  // scroll can get stuck at the old (shorter) boundary even though the page
  // itself is now much taller.
  React.useEffect(() => {
    lenis?.resize();
  }, [lenis, height]);

  React.useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "loca-preview-height" && e.data.slug === slug) {
        const fixed = FIXED_PREVIEW_HEIGHTS[slug];
        const maxHeight = TALL_PREVIEW_HEIGHTS[slug] ?? MAX_HEIGHT;
        setHeight(fixed ?? Math.min(Math.max(200, e.data.height), maxHeight));
        setLoaded(true);
      }
      // The iframe forwards wheel input it can't use itself (its own
      // document is already at its top/bottom edge) — see preview/[slug]
      // for why a cross-document iframe can't just let that scroll the
      // outer page on its own. Feed it through Lenis rather than a raw
      // window.scrollBy so it doesn't desync Lenis's own virtual position.
      if (e.data?.type === "loca-preview-wheel" && e.data.slug === slug && lenis) {
        lenis.scrollTo(lenis.scroll + e.data.deltaY, { immediate: false });
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [slug, lenis]);

  // Reset to the loading state whenever the previewed component itself
  // changes (navigating between two component detail pages reuses this
  // component instance rather than remounting it).
  React.useEffect(() => {
    setHeight(360);
    setLoaded(false);
  }, [slug]);

  return (
    <div
      className="relative transition-[width,height] duration-300 ease-signature"
      style={{ width, height, maxWidth: "100%" }}
    >
      <iframe
        src={`/preview/${slug}`}
        title={`${slug} preview`}
        className={cn(
          "block h-full w-full border-none transition-[opacity,filter,transform] duration-700 ease-signature",
          loaded ? "translate-y-0 opacity-100 blur-none" : "translate-y-1 opacity-0 blur-[2px]",
        )}
      />
    </div>
  );
}

function pickCode(code: ComponentCode, lang: CodeLang, style: CodeStyle): string {
  if (lang === "ts" && style === "tailwind") return code.tsTailwind;
  if (lang === "js" && style === "tailwind") return code.jsTailwind ?? code.tsTailwind;
  if (lang === "ts" && style === "css") return code.tsCss ?? code.tsTailwind;
  return code.jsCss ?? code.tsTailwind;
}

function isVariantAvailable(code: ComponentCode, lang: CodeLang, style: CodeStyle): boolean {
  if (lang === "ts" && style === "tailwind") return true;
  if (lang === "js" && style === "tailwind") return code.jsTailwind != null;
  if (lang === "ts" && style === "css") return code.tsCss != null;
  return code.jsCss != null;
}

function CodeTab({ code }: { code: ComponentCode }) {
  const [lang, setLang] = React.useState<CodeLang>("ts");
  const [style, setStyle] = React.useState<CodeStyle>("tailwind");
  const [copied, setCopied] = React.useState(false);
  const hasVariants = code.jsTailwind != null || code.tsCss != null || code.jsCss != null;
  const activeCode = pickCode(code, lang, style);

  async function copy() {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied (permissions, insecure context) —
      // fail quietly rather than surface an unhandled rejection.
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-semibold text-foreground">Code</span>
        <CopyButton copied={copied} onCopy={copy} />
      </div>
      {hasVariants && (
        <div className="border-t border-border px-4 py-3">
          <CodeVariantToolbar
            lang={lang}
            style={style}
            onLangChange={setLang}
            onStyleChange={setStyle}
            isAvailable={(l, s) => isVariantAvailable(code, l, s)}
          />
        </div>
      )}
      <CodeSurface code={activeCode} bare />
    </div>
  );
}

function UsageCard({ usage }: { usage: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(usage);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied (permissions, insecure context) —
      // fail quietly rather than surface an unhandled rejection.
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-semibold text-foreground">Usage</span>
        <CopyButton copied={copied} onCopy={copy} />
      </div>
      <CodeSurface code={usage} bare />
    </div>
  );
}

export function ComponentPreview({
  slug,
  code,
  usage,
  free,
  checkout,
}: {
  slug: string;
  code: ComponentCode | null;
  usage?: string;
  free: boolean;
  /** Set once this component has a real Lemon Squeezy product — swaps the generic "Get Premium" CTA for a real "Buy" link. */
  checkout?: { url: string; price?: string };
}) {
  const [device, setDevice] = React.useState<Device>("desktop");

  return (
    <Tabs defaultValue="preview" className="w-full gap-4">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DEVICES) as Device[]).map((key) => (
              <button
                key={key}
                onClick={() => setDevice(key)}
                aria-pressed={device === key}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                  device === key
                    ? "bg-primary text-primary-foreground"
                    : "border border-border hover:border-foreground/30",
                )}
              >
                <DeviceIcon device={key} />
                {DEVICES[key].label}
              </button>
            ))}
          </div>
          {checkout && (
            <a
              href={checkout.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              {checkout.price ? `Buy for ${checkout.price}` : "Buy Now"}
            </a>
          )}
        </div>

        <div
          className="overflow-x-auto"
          style={
            device === "desktop"
              ? undefined
              : { backgroundImage: "radial-gradient(rgb(from var(--foreground) r g b / 0.12) 1px, transparent 1px)", backgroundSize: "12px 12px" }
          }
        >
          <DeviceFramePreview slug={slug} width={DEVICES[device].width} />
        </div>
      </TabsContent>
      <TabsContent value="code">
        <div className="mb-4">
          <InstallCommand slug={slug} free={free} checkout={checkout} />
        </div>
        {usage && (
          <div className="mb-4">
            <UsageCard usage={usage} />
          </div>
        )}
        {code !== null ? (
          <CodeTab code={code} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="px-4 py-3">
              <span className="text-sm font-semibold text-foreground">Code</span>
            </div>
            <div className="relative">
              <div aria-hidden className="pointer-events-none opacity-40 blur-sm select-none">
                <CodeSurface code={PREMIUM_CODE_PLACEHOLDER} bare />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 px-6 text-center backdrop-blur-[2px]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
                  <Lock className="h-4 w-4" />
                </div>
                <p className="max-w-xs text-sm text-foreground/70">
                  {checkout ? "This component's source code is available as a one-time purchase." : "This component's source code is Premium-only."}
                </p>
                {checkout ? (
                  <a
                    href={checkout.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-85"
                  >
                    {checkout.price ? `Buy for ${checkout.price}` : "Buy Now"}
                  </a>
                ) : (
                  <Link
                    href="/premium"
                    className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-85"
                  >
                    Get Premium
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
