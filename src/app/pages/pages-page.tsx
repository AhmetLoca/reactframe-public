"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { HookSidebar, type HookSidebarItem } from "@/components/ui/hook-sidebar";
import { PriceFilter } from "@/components/ui/price-filter";
import { CatalogSearchBox } from "@/components/ui/catalog-search-box";
import { cn } from "@/lib/utils";

const PAGE_GROUPS: { title: string; items: string[] }[] = [
  { title: "Marketing", items: ["Landing Page", "Pricing Page", "About Us", "Contact", "Careers", "Blog Index", "Blog Post", "Case Study", "Coming Soon / Waitlist", "Integrations"] },
  { title: "Auth", items: ["Sign In", "Sign Up", "Forgot Password", "Reset Password", "Onboarding", "Verify Email", "Two-Factor Authentication"] },
  { title: "App / Dashboard", items: ["Dashboard Overview", "Settings", "Profile", "Notifications", "Billing / Invoices", "404 / Error Page", "Empty State", "Team / Workspace Settings", "API Keys"] },
  { title: "Commerce", items: ["Product List", "Product Detail", "Cart", "Checkout", "Order Confirmation", "Order History"] },
  { title: "Content", items: ["Search Results", "FAQ", "Changelog"] },
  { title: "Legal", items: ["Terms of Service", "Privacy Policy", "Cookie Policy", "Accessibility Statement", "Refund Policy"] },
  { title: "Docs / Knowledge Base", items: ["Docs Home", "Doc Article", "API Reference"] },
  { title: "Status / Roadmap", items: ["Status Page", "Roadmap"] },
];

type RealPage = { slug: string; name: string; category: string; free: boolean; thumbnail: string };

// The first real, built page — composed end to end from ReactFrame
// components. Everything else below is still "Coming Soon".
const REAL_PAGES: RealPage[] = [
  { slug: "pricing-page", name: "Pricing Page", category: "Marketing", free: true, thumbnail: "/demo/pages/pricing-page-thumb.webp" },
];

const freeCount = REAL_PAGES.filter((p) => p.free).length;
const premiumCount = REAL_PAGES.length - freeCount;

export function PagesPage() {
  const [activeCategory, setActiveCategory] = React.useState(0);
  const [price, setPrice] = React.useState<"all" | "free" | "premium">("free");
  const [query, setQuery] = React.useState("");

  const items: HookSidebarItem[] = PAGE_GROUPS.map((g) => ({ label: g.title, count: g.items.length }));
  const group = PAGE_GROUPS[activeCategory];
  const totalCount = PAGE_GROUPS.reduce((sum, g) => sum + g.items.length, 0);

  const q = query.trim().toLowerCase();

  const handleSelectCategory = (index: number) => {
    setActiveCategory(index);
    setPrice("all");
  };

  const handleSelectPrice = (next: "free" | "premium") => {
    setPrice((prev) => (prev === next ? "all" : next));
  };

  const heading = price !== "all" ? (price === "free" ? "Free" : "Premium") : group.title;

  const realPriceMatches = React.useMemo(() => {
    if (price === "all") return [];
    return REAL_PAGES.filter((p) => (price === "free" ? p.free : !p.free) && (!q || p.name.toLowerCase().includes(q)));
  }, [price, q]);

  const categoryRealPages = React.useMemo(() => {
    if (price !== "all") return [];
    return REAL_PAGES.filter((p) => p.category === group.title && (!q || p.name.toLowerCase().includes(q)));
  }, [price, q, group]);

  const categoryPlaceholders = React.useMemo(() => {
    if (price !== "all") return [];
    const realNames = new Set(categoryRealPages.map((p) => p.name));
    return group.items.filter((item) => !realNames.has(item) && (!q || item.toLowerCase().includes(q)));
  }, [price, q, group, categoryRealPages]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Pages</h1>
      <p className="mt-3 max-w-xl text-foreground/60">
        {totalCount}
        {" "}
        full, multi-section layouts — a landing page or app screen built from blocks and components.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <CatalogSearchBox value={query} onChange={setQuery} placeholder="Search pages…" />
          <PriceFilter price={price} onSelect={handleSelectPrice} freeCount={freeCount} premiumCount={premiumCount} />
          <HookSidebar label="Categories" items={items} value={price === "all" ? activeCategory : -1} onChange={handleSelectCategory} color="var(--primary)" />
        </aside>

        <main className="min-w-0">
          <h2 className="text-sm font-semibold tracking-wide text-foreground/80">{heading}</h2>

          {price !== "all" ? (
            realPriceMatches.length > 0 ? (
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {realPriceMatches.map((p) => (
                  <PageCard key={p.slug} page={p} />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-foreground/40">Nothing here yet — check back soon.</p>
            )
          ) : categoryRealPages.length > 0 || categoryPlaceholders.length > 0 ? (
            <>
              {categoryRealPages.length > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryRealPages.map((p) => (
                    <PageCard key={p.slug} page={p} />
                  ))}
                </div>
              )}
              {categoryPlaceholders.length > 0 && (
                <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", categoryRealPages.length > 0 && "mt-4")}>
                  {categoryPlaceholders.map((item) => (
                    <div key={item} className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-border bg-card/40 px-4 py-3.5">
                      <span className="font-mono text-sm text-foreground/70">{item}</span>
                      <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-foreground/35 uppercase">Soon</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm text-foreground/40">No matches.</p>
          )}
        </main>
      </div>
    </div>
  );
}

function PageCard({ page }: { page: RealPage }) {
  return (
    <Link
      href={`/pages/preview/${page.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 ease-signature hover:border-foreground/20"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-background/60">
        <span
          className={
            page.free
              ? "pointer-events-none absolute top-2.5 right-2.5 z-10 rounded-full border border-[#00A92A]/50 bg-black/70 px-3 py-0.5 text-[11px] font-bold tracking-wide text-[#00A92A] uppercase shadow-[0_0_14px_rgba(0,169,42,0.3)] backdrop-blur-sm [text-shadow:0_0_8px_rgba(0,169,42,0.65)]"
              : "pointer-events-none absolute top-2.5 right-2.5 z-10 rounded-full bg-foreground px-3 py-0.5 text-[11px] font-bold tracking-wide text-background uppercase shadow-lg"
          }
        >
          {page.free ? "Free" : "Pro"}
        </span>
        <Image
          src={page.thumbnail}
          alt={page.name}
          fill
          sizes="(min-width: 768px) 320px, 90vw"
          className="object-cover object-top transition-transform duration-500 ease-signature group-hover:scale-[1.03]"
        />
      </div>
      <div className="px-4 py-3.5">
        <div className="font-mono text-sm font-semibold">{page.name}</div>
        <div className="mt-1 text-xs text-foreground/40">{page.category}</div>
      </div>
    </Link>
  );
}
