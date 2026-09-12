"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HookSidebar, type HookSidebarItem } from "@/components/ui/hook-sidebar";
import { PriceFilter } from "@/components/ui/price-filter";
import { CatalogSearchBox } from "@/components/ui/catalog-search-box";
import { CatalogCard } from "@/components/components-catalog";
import { components } from "@/lib/catalog-data";
import { cn } from "@/lib/utils";

const ELEMENT_GROUPS: { title: string; placeholders: string[] }[] = [
  { title: "Form & Input", placeholders: ["Button", "Input", "Textarea", "Radio Button", "Select", "Slider", "Search Bar"] },
  { title: "Feedback & Status", placeholders: ["Tag", "Tooltip", "Skeleton"] },
  { title: "Navigation", placeholders: ["Tabs", "Breadcrumb", "Pagination", "Stepper"] },
  { title: "Overlay", placeholders: ["Modal", "Popover", "Dropdown Menu", "Drawer"] },
  { title: "Data Display", placeholders: ["Avatar", "Avatar Group", "Divider", "Accordion", "Card"] },
  { title: "Misc", placeholders: ["Kbd", "Empty State", "Tag Input"] },
];

// Real, shipped components that are cross-listed here from the main
// catalog (see ComponentMeta.type in catalog-data.ts) — they're still
// /components/[slug] pages, just also relevant as primitives.
const BUILT_SLUGS_BY_GROUP: Record<string, string[]> = {
  "Form & Input": ["animated-checkbox", "toggle-pro"],
  "Feedback & Status": ["badges-kit", "alert-toast", "progress-circle-bars", "linear-progress-bars", "linear-progress", "animated-loader"],
  "Data Display": ["rating-stars"],
};

const builtElements = Object.values(BUILT_SLUGS_BY_GROUP)
  .flat()
  .map((slug) => components.find((c) => c.slug === slug)!)
  .filter(Boolean);

function isPriceFilter(value: string | null): value is "all" | "free" | "premium" {
  return value === "free" || value === "premium";
}

export function ElementsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Category/price live in the URL (not local state) so a "back" link
  // from an element's detail page — which just points here with the same
  // query string attached — lands back on the exact category/price/
  // search the visitor was browsing, not a reset default.
  const categoryParam = searchParams.get("category");
  const categoryIndexFromParam = categoryParam ? ELEMENT_GROUPS.findIndex((g) => g.title === categoryParam) : -1;

  const priceParam = searchParams.get("price");
  const price: "all" | "free" | "premium" = isPriceFilter(priceParam) ? priceParam : categoryParam ? "all" : "free";
  // A category must always be selected whenever price isn't filtering —
  // there's no "All Elements" pseudo-group here — so an invalid/missing
  // category param while price="all" falls back to the first group
  // rather than rendering nothing.
  const activeCategory = price === "all" ? (categoryIndexFromParam >= 0 ? categoryIndexFromParam : 0) : null;

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

  const items: HookSidebarItem[] = ELEMENT_GROUPS.map((g) => ({
    label: g.title,
    count: (BUILT_SLUGS_BY_GROUP[g.title]?.length ?? 0) + g.placeholders.length,
  }));
  const group = activeCategory !== null ? ELEMENT_GROUPS[activeCategory] : null;

  const q = query.trim().toLowerCase();
  const matches = (name: string) => !q || name.toLowerCase().includes(q);

  const freeCount = builtElements.filter((c) => c.free).length;
  const premiumCount = builtElements.length - freeCount;

  const totalPlaceholders = ELEMENT_GROUPS.reduce((sum, g) => sum + g.placeholders.length, 0);

  const handleSelectCategory = (index: number) => {
    updateParams({ category: ELEMENT_GROUPS[index].title, price: null });
  };

  const handleSelectPrice = (next: "free" | "premium") => {
    if (price === next) {
      updateParams({ price: null, category: ELEMENT_GROUPS[0].title });
    } else {
      updateParams({ price: next, category: null });
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    updateParams({ q: value || null });
  };

  let builtVisible: typeof builtElements;
  let placeholderVisible: string[];
  let heading: string;

  if (price !== "all") {
    builtVisible = builtElements.filter((c) => (price === "free" ? c.free : !c.free) && matches(c.name));
    placeholderVisible = [];
    heading = price === "free" ? "Free" : "Premium";
  } else {
    const g = group!;
    builtVisible = (BUILT_SLUGS_BY_GROUP[g.title] ?? [])
      .map((slug) => components.find((c) => c.slug === slug)!)
      .filter((c) => c && matches(c.name));
    placeholderVisible = g.placeholders.filter(matches);
    heading = g.title;
  }

  const returnPath = filterQueryString ? `/elements?${filterQueryString}` : "/elements";

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Elements</h1>
      <p className="mt-3 max-w-xl text-foreground/60">
        {builtElements.length}
        {" "}
        live so far, {totalPlaceholders} more on the way — small UI primitives that components are built from.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <CatalogSearchBox value={query} onChange={handleQueryChange} placeholder="Search elements…" />
          <PriceFilter price={price} onSelect={handleSelectPrice} freeCount={freeCount} premiumCount={premiumCount} />
          <HookSidebar label="Categories" items={items} value={price === "all" ? (activeCategory ?? -1) : -1} onChange={handleSelectCategory} color="var(--primary)" />
        </aside>

        <main className="min-w-0">
          <h2 className="text-sm font-semibold tracking-wide text-foreground/80">{heading}</h2>
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
          {builtVisible.length === 0 && placeholderVisible.length === 0 && <p className="mt-3 text-sm text-foreground/40">No matches.</p>}
        </main>
      </div>
    </div>
  );
}
