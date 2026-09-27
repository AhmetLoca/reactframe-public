"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { sortCategories } from "@/lib/catalog-order";
import { SchemaBadge } from "@/components/schema-badge";
import type { ComponentMeta } from "@/lib/catalog-data";
import { checkoutLinks } from "@/lib/checkout-links";
import { ComponentCardMedia } from "@/components/component-card-media";
import { HookSidebar, type HookSidebarItem } from "@/components/ui/hook-sidebar";
import { PriceFilter } from "@/components/ui/price-filter";
import { CatalogSearchBox } from "@/components/ui/catalog-search-box";
import { CategoryHeading, slugifyLabel } from "@/components/ui/category-heading";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 24;

function isPriceFilter(value: string | null): value is "all" | "free" | "premium" {
  return value === "free" || value === "premium";
}

type SearchParamsLike = Pick<URLSearchParams, "get" | "toString">;
const NO_SEARCH_PARAMS: SearchParamsLike = new URLSearchParams();

export function ComponentsCatalog({ components }: { components: ComponentMeta[] }) {
  const searchParams = useSearchParams();
  return <ComponentsCatalogView components={components} searchParams={searchParams} />;
}

// The unfiltered view, rendered as the Suspense fallback so the static HTML
// carries the full catalog (and its links) instead of an empty shell;
// the live version above takes over once the URL's filters are readable.
export function ComponentsCatalogFallback({ components }: { components: ComponentMeta[] }) {
  return <ComponentsCatalogView components={components} searchParams={NO_SEARCH_PARAMS} />;
}

function ComponentsCatalogView({ searchParams, components }: { searchParams: SearchParamsLike; components: ComponentMeta[] }) {
  const categories = React.useMemo(() => sortCategories(components), [components]);

  const categoryItems: HookSidebarItem[] = React.useMemo(
    () => [{ label: "All", count: components.length }, ...categories.map(([category, count]) => ({ label: category, count }))],
    [components.length, categories],
  );

  const router = useRouter();
  const pathname = usePathname();

  // Category/price/page-size are derived straight from the URL — not
  // buffered into their own useState — so there's a single source of
  // truth. Navigating into a component's detail page and back (via the
  // browser's back button, or the in-page "Back to components" link) can
  // never show a stale filter for a beat before "correcting" to the real
  // one, because there's no separate local copy that needs re-syncing.
  const categoryParam = searchParams.get("category");
  const active = categoryParam ?? "All";
  const activeCategoryIndex = Math.max(
    0,
    categoryItems.findIndex((item) => (typeof item === "string" ? item : item.label) === active),
  );
  const priceParam = searchParams.get("price");
  // "All" categories, no price filter, is the default landing state — Free
  // is no longer auto-selected; visitors pick a price filter themselves.
  const price: "all" | "free" | "premium" = isPriceFilter(priceParam) ? priceParam : "all";
  const visibleCount = (() => {
    const n = Number(searchParams.get("count"));
    return Number.isFinite(n) && n >= PAGE_SIZE ? n : PAGE_SIZE;
  })();

  // The search box is the one exception: it needs to feel instantly
  // responsive while typing, so it keeps local state — resynced whenever
  // the URL's `q` changes out from under it (e.g. browser back/forward).
  const [query, setQuery] = React.useState(() => searchParams.get("q") ?? "");
  React.useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const filterQueryString = searchParams.toString();

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

  const freeCount = React.useMemo(() => components.filter((c) => c.free).length, [components]);
  const premiumCount = components.length - freeCount;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return components.filter((c) => {
      if (active !== "All" && c.category !== active) return false;
      if (price === "free" && !c.free) return false;
      if (price === "premium" && c.free) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [components, active, price, query]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;

  // Browsing "All" groups the catalog into "Category [count]" sections
  // instead of one flat, uncategorized grid — picking a specific category
  // still falls back to the flat, paginated list above.
  const groupedSections = React.useMemo(() => {
    if (active !== "All") return null;
    const q = query.trim().toLowerCase();
    return categories
      .map(([category]) => {
        const items = components.filter((c) => {
          if (c.category !== category) return false;
          if (price === "free" && !c.free) return false;
          if (price === "premium" && c.free) return false;
          if (q && !c.name.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false;
          return true;
        });
        return { category, items };
      })
      .filter((s) => s.items.length > 0);
  }, [components, active, price, query, categories]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Price and Categories are mutually exclusive in the UI: picking one
  // clears the other, so at most one sidebar button is ever highlighted
  // at a time — two active-looking filters at once reads as confusing,
  // not as "combined."
  const handleSelectCategory = (category: string) => {
    updateParams({ category: category === "All" ? null : category, price: null, count: null });
    scrollToTop();
  };

  const handleSelectPrice = (next: "all" | "free" | "premium") => {
    const actual = price === next ? "all" : next;
    updateParams({ price: actual === "all" ? null : actual, category: null, count: null });
    scrollToTop();
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    updateParams({ q: value || null, count: null });
  };

  const handleLoadMore = () => {
    updateParams({ count: String(visibleCount + PAGE_SIZE) });
  };

  return (
    <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-start">
      <nav className="shrink-0 md:sticky md:top-24 md:w-56">
        <CatalogSearchBox value={query} onChange={handleQueryChange} placeholder="Search components…" />

        <PriceFilter price={price} onSelect={handleSelectPrice} freeCount={freeCount} premiumCount={premiumCount} />

        <HookSidebar
          label="Categories"
          items={categoryItems}
          value={activeCategoryIndex}
          onChange={(index) => {
            const item = categoryItems[index];
            handleSelectCategory(typeof item === "string" ? item : item.label);
          }}
          color="var(--primary)"
        />
      </nav>

      <div className="min-w-0 flex-1">
        {groupedSections ? (
          <div className="flex flex-col gap-10">
            {groupedSections.map(({ category, items }) => (
              <section key={category}>
                <CategoryHeading id={slugifyLabel(category)} title={category} count={items.length} />
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((component) => (
                    <CatalogCard key={component.slug} component={component} filterQueryString={filterQueryString} />
                  ))}
                </div>
              </section>
            ))}
            {groupedSections.length === 0 && <p className="text-sm text-foreground/40">No matches.</p>}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((component) => (
                <CatalogCard key={component.slug} component={component} filterQueryString={filterQueryString} />
              ))}
            </div>

            {remaining > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors duration-300 ease-signature hover:border-foreground/30 hover:bg-accent"
                >
                  Load More ({remaining} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function CatalogCard({
  component,
  filterQueryString = "",
  returnPath,
  mediaClassName = "h-[168px]",
}: {
  component: ComponentMeta;
  filterQueryString?: string;
  /** Set when this card is rendered outside /components (e.g. "/blocks", "/elements") — cross-listed components still link to /components/[slug], but "back" from there should return here, not to /components. */
  returnPath?: string;
  /** Sizes the media box. Dense grids use the default fixed height; roomier grids (the homepage's
   * three columns) pass `aspect-[4/3]` so the 4:3 thumbnail shows uncropped. */
  mediaClassName?: string;
}) {
  // Owns hover state itself (rather than each ComponentCardMedia tracking
  // its own mouseenter/mouseleave) because the click-through overlay <Link>
  // below sits above the media in z-order and would otherwise swallow the
  // hover before it ever reaches the video.
  const [hovering, setHovering] = React.useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 ease-signature hover:border-foreground/20"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/*
        Overlay Link, not a wrapping one: some previews (footers,
        navbar-menu) render real <a> tags of their own, and an <a>
        nested inside another <a> is invalid HTML that breaks
        hydration. A sibling overlay keeps the card clickable
        without nesting.
      */}
      <Link
        href={
          returnPath
            ? `/components/${component.slug}?returnTo=${encodeURIComponent(returnPath)}`
            : filterQueryString
              ? `/components/${component.slug}?from=${encodeURIComponent(filterQueryString)}`
              : `/components/${component.slug}`
        }
        className="absolute inset-0 z-10"
        aria-label={component.name}
      />
      <div className={cn("relative m-3 overflow-hidden rounded-xl bg-background/60", mediaClassName)}>
        {/* {component.free ? (
          <span className="pointer-events-none absolute top-2.5 right-2.5 z-20 rounded-full border border-[#00A92A]/50 bg-black/70 px-3 py-0.5 text-[11px] font-bold tracking-wide text-[#00A92A] uppercase shadow-[0_0_14px_rgba(0,169,42,0.3)] backdrop-blur-sm [text-shadow:0_0_8px_rgba(0,169,42,0.65)]">
            Free
          </span>
        ) : (
          <span className="pointer-events-none absolute top-2.5 right-2.5 z-20 rounded-full bg-foreground px-3 py-0.5 text-[11px] font-bold tracking-wide text-background uppercase shadow-lg">
            Pro
          </span>
        )} */}
        <ComponentCardMedia slug={component.slug} hovering={hovering} previewWrapperClassName="p-4" />
        <SchemaBadge slug={component.slug} className="pointer-events-none absolute top-2.5 left-2.5 z-20 border border-[#60A5FA]/30 bg-black/65 text-white/85 backdrop-blur-sm [&>svg]:text-[#7DB5FF]" />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 pt-1 pb-4">
        <div className="truncate font-mono text-sm font-semibold">{component.name}</div>
        <div className={cn("shrink-0 text-sm font-semibold", component.free ? "text-[#00A92A]" : "text-foreground/60")}>
          {component.free ? "Free" : (checkoutLinks[component.slug]?.price ?? "Pro")}
        </div>
      </div>
    </div>
  );
}
