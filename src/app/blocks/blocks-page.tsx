"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HookSidebar, type HookSidebarItem } from "@/components/ui/hook-sidebar";
import { PriceFilter } from "@/components/ui/price-filter";
import { CatalogSearchBox } from "@/components/ui/catalog-search-box";
import { CatalogCard } from "@/components/components-catalog";
import { BLOCK_CATEGORIES, allBlocks, blocksByLabel } from "@/lib/catalog-order";
import { cn } from "@/lib/utils";

const CATEGORIES = BLOCK_CATEGORIES;
const REAL_CATEGORIES = CATEGORIES.slice(1);

// Named "coming soon" tiles for a category, shown alongside its real blocks
// (or on their own, for a category with none shipped yet) — same pattern as
// the Elements and Pages catalogs, so an empty tab reads as a roadmap
// instead of a dead end.
const PLACEHOLDERS_BY_LABEL: Record<string, string[]> = {
  Marketing: [
    "Simple Hero Section",
    "Pricing Cards Section",
    "FAQ Section",
    "Contact Section",
    "Newsletter Signup Section",
    "CTA Banner Section",
    "Logo Cloud / Trusted By",
    "Integrations Grid",
    "Portfolio Grid Block",
  ],
  "Dashboard / Application": [
    "KPI Dashboard Grid",
    "Activity Feed",
    "Recent Orders Table Block",
    "Billing Summary Card",
    "Team Members List Block",
    "Quick Actions Grid",
    "Usage Chart Block",
    "Onboarding Checklist Widget",
    "Multi-step Form Block",
    "Inbox / Message List Block",
    "Workflow Builder Block",
    "Map Block",
    "What's New / In-app Changelog Widget",
    "Referral Widget",
  ],
  eCommerce: ["Product Highlight Block", "Category Grid Block", "Promo Banner Block", "Trust Badges Block", "Related Products Block", "Product Quick View Block", "Checkout Form Block", "Order Summary Block", "Gift Card Block"],
  Authentication: ["Sign In Card", "Sign Up Card", "Social Login Buttons", "OTP / Verification Code Block", "Password Strength Meter", "Forgot Password Card", "Reset Password Card", "Verify Email Card"],
  "Data & Tables": ["Transactions Table Block", "Leaderboard Block", "Invoice List Block", "File Manager Block", "Audit Log Table Block"],
  "AI & Chat": ["AI Search Results Block", "Agent Task Progress Block", "Model Picker Block", "Prompt Library Block"],
};

function isPriceFilter(value: string | null): value is "all" | "free" | "premium" {
  return value === "free" || value === "premium";
}

type SearchParamsLike = Pick<URLSearchParams, "get" | "toString">;
const NO_SEARCH_PARAMS: SearchParamsLike = new URLSearchParams();

export function BlocksPage() {
  const searchParams = useSearchParams();
  return <BlocksPageView searchParams={searchParams} />;
}

// The unfiltered view, rendered as the Suspense fallback so the static HTML
// carries the full catalog (and its links) instead of an empty shell;
// the live version above takes over once the URL's filters are readable.
export function BlocksPageFallback() {
  return <BlocksPageView searchParams={NO_SEARCH_PARAMS} />;
}

function BlocksPageView({ searchParams }: { searchParams: SearchParamsLike }) {
  const router = useRouter();
  const pathname = usePathname();

  // Category/price live in the URL (not local state) so a "back" link
  // from a block's detail page — which just points here with the same
  // query string attached — lands back on the exact category/price/
  // search the visitor was browsing, not a reset default.
  const categoryParam = searchParams.get("category");
  const activeLabel = categoryParam && CATEGORIES.includes(categoryParam) ? categoryParam : CATEGORIES[0];
  const activeCategory = Math.max(0, CATEGORIES.indexOf(activeLabel));

  const priceParam = searchParams.get("price");
  const price: "all" | "free" | "premium" = isPriceFilter(priceParam) ? priceParam : "all";

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
  const matches = (c: (typeof allBlocks)[number]) => !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
  const matchesName = (name: string) => !q || name.toLowerCase().includes(q);

  const freeCount = allBlocks.filter((c) => c.free).length;
  const premiumCount = allBlocks.length - freeCount;

  // "All"'s count is the sum of every other tab (real blocks + named
  // placeholders), because that's exactly what its sectioned view below
  // renders — one section per category, same as each tab shown on its own.
  const totalPlaceholders = REAL_CATEGORIES.reduce((sum, label) => sum + (PLACEHOLDERS_BY_LABEL[label]?.length ?? 0), 0);
  const items: HookSidebarItem[] = CATEGORIES.map((label) => ({
    label,
    count: label === "All" ? allBlocks.length + totalPlaceholders : (blocksByLabel[label]?.length ?? 0) + (PLACEHOLDERS_BY_LABEL[label]?.length ?? 0),
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
  const visible = price !== "all" ? allBlocks.filter((c) => (price === "free" ? c.free : !c.free) && matches(c)) : [];
  // Browsing "All" sections every category (real blocks + its named
  // placeholders); picking one category filters down to just that section —
  // same shape either way, so the sidebar count above always matches what
  // renders here.
  const sections =
    price === "all"
      ? (activeLabel === "All" ? REAL_CATEGORIES : [activeLabel])
          .map((label) => ({
            label,
            real: (blocksByLabel[label] ?? []).filter(matches),
            placeholders: (PLACEHOLDERS_BY_LABEL[label] ?? []).filter(matchesName),
          }))
          .filter((s) => s.real.length > 0 || s.placeholders.length > 0)
      : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Blocks</h1>
      <p className="mt-3 max-w-xl text-foreground/60">
        Larger, ready-to-compose sections, marketing, dashboards, eCommerce, and more, built from the same components in the catalog.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <CatalogSearchBox value={query} onChange={handleQueryChange} placeholder="Search blocks…" />
          <PriceFilter price={price} onSelect={handleSelectPrice} freeCount={freeCount} premiumCount={premiumCount} />
          <HookSidebar label="Categories" items={items} value={price === "all" ? activeCategory : -1} onChange={handleSelectCategory} color="var(--primary)" />
        </aside>

        <main className="min-w-0">
          {price !== "all" ? (
            visible.length > 0 ? (
              <>
                <h2 className="text-sm font-semibold tracking-wide text-foreground/80">{heading}</h2>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {visible.map((component) => (
                    <CatalogCard key={component.slug} component={component} returnPath={filterQueryString ? `/blocks?${filterQueryString}` : "/blocks"} />
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-foreground/40">No matches.</p>
            )
          ) : sections.length > 0 ? (
            <div className="flex flex-col gap-10">
              {sections.map(({ label, real, placeholders }) => (
                <section key={label}>
                  <h2 className="text-sm font-semibold tracking-wide text-foreground/80">{label}</h2>
                  {real.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {real.map((component) => (
                        <CatalogCard key={component.slug} component={component} returnPath={filterQueryString ? `/blocks?${filterQueryString}` : "/blocks"} />
                      ))}
                    </div>
                  )}
                  {placeholders.length > 0 && (
                    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", real.length > 0 && "mt-4")}>
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
