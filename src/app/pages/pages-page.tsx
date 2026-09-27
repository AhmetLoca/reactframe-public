"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HookSidebar, type HookSidebarItem } from "@/components/ui/hook-sidebar";
import { PriceFilter } from "@/components/ui/price-filter";
import { CatalogSearchBox } from "@/components/ui/catalog-search-box";
import { CategoryHeading, slugifyLabel } from "@/components/ui/category-heading";
import { cn } from "@/lib/utils";
import { hasThumbnailVideo } from "@/lib/thumbnails";
import { PAGE_GROUPS, REAL_PAGES, type RealPage } from "@/lib/pages-data";
import { pageCheckoutLinks } from "@/lib/checkout-links";

export { PAGE_GROUPS };

const freeCount = REAL_PAGES.filter((p) => p.free).length;
const premiumCount = REAL_PAGES.length - freeCount;

function isPriceFilter(value: string | null): value is "all" | "free" | "premium" {
  return value === "free" || value === "premium";
}

type SearchParamsLike = Pick<URLSearchParams, "get" | "toString">;
const NO_SEARCH_PARAMS: SearchParamsLike = new URLSearchParams();

export function PagesPage() {
  const searchParams = useSearchParams();
  return <PagesPageView searchParams={searchParams} />;
}

// The unfiltered view, rendered as the Suspense fallback so the static HTML
// carries the full catalog (and its links) instead of an empty shell;
// the live version above takes over once the URL's filters are readable.
export function PagesPageFallback() {
  return <PagesPageView searchParams={NO_SEARCH_PARAMS} />;
}

function PagesPageView({ searchParams }: { searchParams: SearchParamsLike }) {
  const router = useRouter();
  const pathname = usePathname();

  // Category/price live in the URL (not local state) so a link straight
  // into a category — from the header search, or a "back" link from a
  // page's detail view — lands on the exact category/price the visitor
  // was pointed at, not a reset default.
  const categoryParam = searchParams.get("category");
  // Index 0 of the sidebar is "All" (the landing state, no category in the
  // URL); the groups follow it, shifted by one.
  const groupIndex = PAGE_GROUPS.findIndex((g) => g.title === categoryParam);
  const activeCategory = groupIndex + 1;

  const priceParam = searchParams.get("price");
  const price: "all" | "free" | "premium" = isPriceFilter(priceParam) ? priceParam : "all";

  const [query, setQuery] = React.useState("");

  const updateParams = React.useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null) params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // Real pages plus the "Soon" placeholders that aren't built yet, same as the section headings.
  const groupCount = (g: (typeof PAGE_GROUPS)[number]) => {
    const real = REAL_PAGES.filter((p) => p.category === g.title);
    const realNames = new Set(real.map((p) => p.name));
    return real.length + g.items.filter((item) => !realNames.has(item)).length;
  };
  const totalCount = PAGE_GROUPS.reduce((sum, g) => sum + groupCount(g), 0);
  const items: HookSidebarItem[] = [{ label: "All", count: totalCount }, ...PAGE_GROUPS.map((g) => ({ label: g.title, count: groupCount(g) }))];
  // null = "All": every group renders as its own section.
  const group = groupIndex >= 0 ? PAGE_GROUPS[groupIndex] : null;

  const q = query.trim().toLowerCase();

  const handleSelectCategory = (index: number) => {
    updateParams({ category: index === 0 ? null : PAGE_GROUPS[index - 1].title, price: null });
  };

  const handleSelectPrice = (next: "free" | "premium") => {
    const actual = price === next ? "all" : next;
    updateParams({ price: actual === "all" ? null : actual, category: null });
  };

  const heading = price !== "all" ? (price === "free" ? "Free" : "Premium") : (group?.title ?? null);

  const realPriceMatches = React.useMemo(() => {
    if (price === "all") return [];
    return REAL_PAGES.filter((p) => (price === "free" ? p.free : !p.free) && (!q || p.name.toLowerCase().includes(q)));
  }, [price, q]);

  const sections = React.useMemo(() => {
    if (price !== "all") return [];
    return (group ? [group] : PAGE_GROUPS)
      .map((g) => {
        const real = REAL_PAGES.filter((p) => p.category === g.title && (!q || p.name.toLowerCase().includes(q)));
        const realNames = new Set(real.map((p) => p.name));
        const placeholders = g.items.filter((item) => !realNames.has(item) && (!q || item.toLowerCase().includes(q)));
        return { group: g, real, placeholders };
      })
      .filter((sec) => sec.real.length > 0 || sec.placeholders.length > 0);
  }, [price, q, group]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Pages</h1>
      <p className="mt-3 max-w-xl text-foreground/60">
        {totalCount}
        {" "}
        full, multi-section layouts, a landing page or app screen built from blocks and components.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <CatalogSearchBox value={query} onChange={setQuery} placeholder="Search pages…" />
          <PriceFilter price={price} onSelect={handleSelectPrice} freeCount={freeCount} premiumCount={premiumCount} />
          <HookSidebar label="Categories" items={items} value={price === "all" ? activeCategory : -1} onChange={handleSelectCategory} color="var(--primary)" />
        </aside>

        <main className="min-w-0">
          {heading && <h2 className="text-sm font-semibold tracking-wide text-foreground/80">{heading}</h2>}

          {price !== "all" ? (
            realPriceMatches.length > 0 ? (
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {realPriceMatches.map((p) => (
                  <PageCard key={p.slug} page={p} />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-foreground/40">Nothing here yet, check back soon.</p>
            )
          ) : sections.length > 0 ? (
            <div className="flex flex-col gap-10">
              {sections.map(({ group: g, real, placeholders }) => (
                <section key={g.title}>
                  {!group && <CategoryHeading id={slugifyLabel(g.title)} title={g.title} count={real.length + placeholders.length} />}
                  {real.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {real.map((p) => (
                        <PageCard key={p.slug} page={p} />
                      ))}
                    </div>
                  )}
                  {placeholders.length > 0 && (
                    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", real.length > 0 ? "mt-4" : "mt-3")}>
                      {placeholders.map((item) => (
                        <div key={item} className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-border bg-card/40 px-4 py-3.5">
                          <span className="font-mono text-sm text-foreground/70">{item}</span>
                          <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-foreground/35 uppercase">Soon</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-foreground/40">No matches.</p>
          )}
        </main>
      </div>
    </div>
  );
}

function PageCard({ page }: { page: RealPage }) {
  // Hover clip recorded by scripts/record-video.mts (scene page-<slug>) into public/thumbnails/;
  // like the component cards, it only loads metadata until the card is hovered.
  const videoSlug = `page-${page.slug}`;
  const hasVideo = hasThumbnailVideo(videoSlug);
  const [hovering, setHovering] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (hovering) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [hovering]);

  return (
    <Link
      href={`/pages/preview/${page.slug}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 ease-signature hover:border-foreground/20"
    >
      <div className="relative m-3 h-[168px] overflow-hidden rounded-xl bg-background/60">
        <Image
          src={page.thumbnail}
          alt={page.name}
          fill
          sizes="(min-width: 768px) 320px, 90vw"
          className={cn("object-cover object-top", !hasVideo && "transition-transform duration-500 ease-signature group-hover:scale-[1.03]")}
        />
        {hasVideo && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-200",
              hovering ? "opacity-100" : "opacity-0",
            )}
          >
            <source src={`/thumbnails/${videoSlug}.mp4`} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 px-4 pt-1 pb-4">
        <div className="truncate font-mono text-sm font-semibold">{page.name}</div>
        <div className={cn("shrink-0 text-sm font-semibold", page.free ? "text-[#00A92A]" : "text-foreground/60")}>
          {page.free ? "Free" : (pageCheckoutLinks[page.slug]?.price ?? "Pro")}
        </div>
      </div>
    </Link>
  );
}
