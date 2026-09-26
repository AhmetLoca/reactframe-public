"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HookSidebar, type HookSidebarItem } from "@/components/ui/hook-sidebar";
import { PriceFilter } from "@/components/ui/price-filter";
import { CatalogSearchBox } from "@/components/ui/catalog-search-box";
import { CategoryHeading, slugifyLabel } from "@/components/ui/category-heading";
import { CatalogCard } from "@/components/components-catalog";
import { components } from "@/lib/catalog-data";
import { BUILT_SLUGS_BY_GROUP, ELEMENT_GROUPS, builtElements } from "@/lib/catalog-order";
import { cn } from "@/lib/utils";


function isPriceFilter(value: string | null): value is "all" | "free" | "premium" {
  return value === "free" || value === "premium";
}

type SearchParamsLike = Pick<URLSearchParams, "get" | "toString">;
const NO_SEARCH_PARAMS: SearchParamsLike = new URLSearchParams();

export function ElementsPage() {
  const searchParams = useSearchParams();
  return <ElementsPageView searchParams={searchParams} />;
}

// The unfiltered view, rendered as the Suspense fallback so the static HTML
// carries the full catalog (and its links) instead of an empty shell;
// the live version above takes over once the URL's filters are readable.
export function ElementsPageFallback() {
  return <ElementsPageView searchParams={NO_SEARCH_PARAMS} />;
}

function ElementsPageView({ searchParams }: { searchParams: SearchParamsLike }) {
  const router = useRouter();
  const pathname = usePathname();

  // Category/price live in the URL (not local state) so a "back" link
  // from an element's detail page — which just points here with the same
  // query string attached — lands back on the exact category/price/
  // search the visitor was browsing, not a reset default.
  const categoryParam = searchParams.get("category");
  const categoryIndexFromParam = categoryParam ? ELEMENT_GROUPS.findIndex((g) => g.title === categoryParam) : -1;

  // No price filter in the URL → category browsing, landing on the first
  // group — not the Free filter, which used to be the fallback whenever
  // neither price nor category was set.
  const priceParam = searchParams.get("price");
  const price: "all" | "free" | "premium" = isPriceFilter(priceParam) ? priceParam : "all";
  // Every group renders at once now (see the price === "all" branch below),
  // so this is only used to highlight the last-clicked sidebar item — it no
  // longer decides what's visible. Index 0 is "All" (the landing state, no
  // category in the URL); the groups follow it, shifted by one.
  const activeCategory = price === "all" ? (categoryIndexFromParam >= 0 ? categoryIndexFromParam + 1 : 0) : -1;

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

  const groupCount = (g: (typeof ELEMENT_GROUPS)[number]) =>
    (BUILT_SLUGS_BY_GROUP[g.title] ?? []).filter((slug) => components.some((c) => c.slug === slug)).length + g.placeholders.length;
  const items: HookSidebarItem[] = [
    { label: "All", count: ELEMENT_GROUPS.reduce((sum, g) => sum + groupCount(g), 0) },
    ...ELEMENT_GROUPS.map((g) => ({ label: g.title, count: groupCount(g) })),
  ];

  const q = query.trim().toLowerCase();
  const matches = (name: string) => !q || name.toLowerCase().includes(q);

  const freeCount = builtElements.filter((c) => c.free).length;
  const premiumCount = builtElements.length - freeCount;

  const totalPlaceholders = ELEMENT_GROUPS.reduce((sum, g) => sum + g.placeholders.length, 0);

  const handleSelectCategory = (index: number) => {
    const g = index === 0 ? ELEMENT_GROUPS[0] : ELEMENT_GROUPS[index - 1];
    updateParams({ category: index === 0 ? null : g.title, price: null });
    document.getElementById(slugifyLabel(g.title))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelectPrice = (next: "free" | "premium") => {
    if (price === next) {
      updateParams({ price: null, category: null });
    } else {
      updateParams({ price: next, category: null });
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    updateParams({ q: value || null });
  };

  // Flat single-heading view, used only for the Free/Premium price filters
  // (cutting across every category doesn't lend itself to sections).
  const flatVisible = price !== "all" ? builtElements.filter((c) => (price === "free" ? c.free : !c.free) && matches(c.name)) : [];
  const flatHeading = price === "free" ? "Free" : "Premium";

  // Sectioned view: every category renders as its own "Title [count]"
  // block, always — no more picking one category to see it. Search still
  // filters within each section, and a section with zero matches drops out.
  const sections = ELEMENT_GROUPS.map((g) => {
    const builtVisible = (BUILT_SLUGS_BY_GROUP[g.title] ?? [])
      .map((slug) => components.find((c) => c.slug === slug)!)
      .filter((c) => c && matches(c.name));
    const placeholderVisible = g.placeholders.filter(matches);
    return { group: g, builtVisible, placeholderVisible };
  }).filter((s) => s.builtVisible.length > 0 || s.placeholderVisible.length > 0);

  const returnPath = filterQueryString ? `/elements?${filterQueryString}` : "/elements";

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Elements</h1>
      <p className="mt-3 max-w-xl text-foreground/60">
        {builtElements.length}
        {" "}
        live so far, {totalPlaceholders} more on the way, small UI primitives that components are built from.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <CatalogSearchBox value={query} onChange={handleQueryChange} placeholder="Search elements…" />
          <PriceFilter price={price} onSelect={handleSelectPrice} freeCount={freeCount} premiumCount={premiumCount} />
          <HookSidebar label="Categories" items={items} value={price === "all" ? activeCategory : -1} onChange={handleSelectCategory} color="var(--primary)" />
        </aside>

        <main className="min-w-0">
          {price !== "all" ? (
            <>
              <h2 className="text-sm font-semibold tracking-wide text-foreground/80">{flatHeading}</h2>
              {flatVisible.length > 0 ? (
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {flatVisible.map((component) => (
                    <CatalogCard key={component.slug} component={component} returnPath={returnPath} />
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-foreground/40">No matches.</p>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-10">
              {sections.map(({ group: g, builtVisible, placeholderVisible }) => (
                <section key={g.title}>
                  <CategoryHeading id={slugifyLabel(g.title)} title={g.title} count={builtVisible.length + placeholderVisible.length} />
                  {builtVisible.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {builtVisible.map((component) => (
                        <CatalogCard key={component.slug} component={component} returnPath={returnPath} />
                      ))}
                    </div>
                  )}
                  {placeholderVisible.length > 0 && (
                    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", builtVisible.length > 0 && "mt-4")}>
                      {placeholderVisible.map((item) => (
                        <div key={item} className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-border bg-card/40 px-4 py-3.5">
                          <span className="font-mono text-sm text-foreground/70">{item}</span>
                          <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-foreground/35 uppercase">Soon</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
              {sections.length === 0 && <p className="text-sm text-foreground/40">No matches.</p>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
