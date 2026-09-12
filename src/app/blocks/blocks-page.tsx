"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HookSidebar, type HookSidebarItem } from "@/components/ui/hook-sidebar";
import { PriceFilter } from "@/components/ui/price-filter";
import { CatalogSearchBox } from "@/components/ui/catalog-search-box";
import { CatalogCard } from "@/components/components-catalog";
import { components } from "@/lib/catalog-data";

const CATEGORIES = ["All Blocks", "Marketing", "Dashboard / Application", "eCommerce", "Authentication", "Data & Tables", "AI & Chat"];

// Real, shipped components cross-listed here from the main catalog (see
// ComponentMeta.type in catalog-data.ts) — every built block so far is a
// marketing-page section (Hero/Feature/Footer/Testimonial/Team/CTA), so
// the other categories stay empty placeholders until something ships there.
const marketingBlocks = components.filter((c) => c.type === "block");

function isPriceFilter(value: string | null): value is "all" | "free" | "premium" {
  return value === "free" || value === "premium";
}

export function BlocksPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Category/price live in the URL (not local state) so a "back" link
  // from a block's detail page — which just points here with the same
  // query string attached — lands back on the exact category/price/
  // search the visitor was browsing, not a reset default.
  const categoryParam = searchParams.get("category");
  const activeLabel = categoryParam && CATEGORIES.includes(categoryParam) ? categoryParam : CATEGORIES[0];
  const activeCategory = Math.max(0, CATEGORIES.indexOf(activeLabel));

  const priceParam = searchParams.get("price");
  const price: "all" | "free" | "premium" = isPriceFilter(priceParam) ? priceParam : categoryParam ? "all" : "free";

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

  const q = query.trim().toLowerCase();
  const matches = (c: (typeof marketingBlocks)[number]) => !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);

  const freeCount = marketingBlocks.filter((c) => c.free).length;
  const premiumCount = marketingBlocks.length - freeCount;

  const items: HookSidebarItem[] = CATEGORIES.map((label) => ({
    label,
    count: label === "All Blocks" || label === "Marketing" ? marketingBlocks.length : 0,
  }));

  const handleSelectCategory = (index: number) => {
    const label = CATEGORIES[index];
    updateParams({ category: label === CATEGORIES[0] ? null : label, price: null });
  };

  const handleSelectPrice = (next: "free" | "premium") => {
    const actual = price === next ? "all" : next;
    updateParams({ price: actual === "all" ? null : actual, category: null });
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    updateParams({ q: value || null });
  };

  const heading = price !== "all" ? (price === "free" ? "Free" : "Premium") : activeLabel;
  const visible =
    price !== "all"
      ? marketingBlocks.filter((c) => (price === "free" ? c.free : !c.free) && matches(c))
      : activeLabel === "All Blocks" || activeLabel === "Marketing"
        ? marketingBlocks.filter(matches)
        : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Blocks</h1>
      <p className="mt-3 max-w-xl text-foreground/60">
        Larger, ready-to-compose sections — marketing, dashboards, eCommerce, and more — built from the same components in the catalog.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <CatalogSearchBox value={query} onChange={handleQueryChange} placeholder="Search blocks…" />
          <PriceFilter price={price} onSelect={handleSelectPrice} freeCount={freeCount} premiumCount={premiumCount} />
          <HookSidebar label="Categories" items={items} value={price === "all" ? activeCategory : -1} onChange={handleSelectCategory} color="var(--primary)" />
        </aside>

        <main className="min-w-0">
          {visible.length > 0 ? (
            <>
              <h2 className="text-sm font-semibold tracking-wide text-foreground/80">{heading}</h2>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((component) => (
                  <CatalogCard key={component.slug} component={component} returnPath={filterQueryString ? `/blocks?${filterQueryString}` : "/blocks"} />
                ))}
              </div>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium">Coming Soon</span>
              <h2 className="mt-5 text-xl font-semibold tracking-tight">{heading}</h2>
              <p className="mt-3 max-w-md text-sm text-foreground/50">
                We&apos;re still building this section — check back soon. In the meantime, every component in the catalog already ships as
                plain React and Tailwind, ready to compose into your own blocks.
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
