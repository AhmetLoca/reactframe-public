"use client";

import Link from "next/link";

// Curated thumbnails for the flanking gallery columns — no per-item
// metadata needed, just enough visual variety that no column reads as
// a single repeated shape.
const GALLERY_COLUMNS: string[][] = [
  ["image-deck-3d", "glare-card", "cosmic-background", "gallery-lightbox"],
  ["shooting-stars", "world-map-arc", "hero-slider-carousel", "mood-gallery"],
  ["ipad-mockup-carousel", "story-slider", "cylinder-gallery", "desktop-mockup-carousel"],
  ["liquid-image-effect", "particle-text", "wave-gallery-page", "cards-gallery-ring"],
];

function GalleryTile({ slug }: { slug: string }) {
  return (
    <div className="aspect-[0.85] w-full shrink-0 overflow-hidden rounded-2xl bg-foreground/[0.06]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/thumbnails/${slug}.webp`} alt="" className="h-full w-full object-cover" />
    </div>
  );
}

function GalleryColumn({ items, duration, direction }: { items: string[]; duration: number; direction: "up" | "down" }) {
  return (
    <div className="h-full w-[170px] shrink-0 overflow-hidden">
      <div className={`flex flex-col gap-3 ${direction === "up" ? "animate-marquee-up" : "animate-marquee-down"}`} style={{ animationDuration: `${duration}s` }}>
        {[...items, ...items].map((slug, i) => (
          <GalleryTile key={i} slug={slug} />
        ))}
      </div>
    </div>
  );
}

function GallerySide({ columns, align, rotation }: { columns: [string[], string[]]; align: "left" | "right"; rotation: number }) {
  return (
    <div
      className={`pointer-events-none absolute -inset-y-16 hidden gap-3 lg:flex ${align === "left" ? "left-0 flex-row" : "right-0 flex-row-reverse"}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: align === "left" ? "left center" : "right center",
        maskImage: `linear-gradient(to ${align === "left" ? "right" : "left"}, black 0%, black 55%, transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to ${align === "left" ? "right" : "left"}, black 0%, black 55%, transparent 100%)`,
      }}
    >
      <GalleryColumn items={columns[0]} duration={38} direction="up" />
      <GalleryColumn items={columns[1]} duration={44} direction="down" />
    </div>
  );
}

export function AllAccessPricing() {
  return (
    <section id="pricing" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative w-full overflow-hidden rounded-[32px] border border-border bg-foreground/[0.02] px-6 py-14 text-center sm:px-10">
          <GallerySide columns={[GALLERY_COLUMNS[0], GALLERY_COLUMNS[1]]} align="left" rotation={-4} />
          <GallerySide columns={[GALLERY_COLUMNS[2], GALLERY_COLUMNS[3]]} align="right" rotation={4} />

          <div className="relative z-10 mx-auto max-w-md">
            <p className="font-mono text-xs tracking-[0.2em] text-foreground/50 uppercase">Best Offer</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">All-Access</h2>

            <p className="mt-6 text-sm text-foreground/60">
              All current components.
              <br />
              All future updates, included.
            </p>

            <Link
              href="/premium"
              className="mt-10 inline-block rounded-full bg-foreground px-10 py-3 text-sm font-medium text-background transition-opacity duration-300 ease-signature hover:opacity-80"
            >
              Get All-Access
            </Link>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-foreground/50">
          Prefer to buy one at a time? Every component is also sold individually from the library above.
        </p>
      </div>
    </section>
  );
}
