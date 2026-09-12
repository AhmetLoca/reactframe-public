"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { HookSidebar, type HookSidebarItem } from "@/components/ui/hook-sidebar";
import { PriceFilter } from "@/components/ui/price-filter";
import { CatalogSearchBox } from "@/components/ui/catalog-search-box";

const TYPES = ["One Page", "eCommerce", "Portfolio & CV", "Blog"];

const INDUSTRIES = [
  "Business",
  "Industrial",
  "Health & Wellness",
  "Events",
  "Education",
  "Communities",
  "Fashion & Style",
  "Beauty & Hair",
  "Design",
  "Photography",
  "Music",
  "Creative Arts",
  "Video",
  "Restaurants & Food",
  "Travel & Tourism",
];

type TemplateItem = {
  slug: string;
  name: string;
  type: string;
  industry: string;
  free: boolean;
  thumbnail: string;
};

// The first real, built template — composed end to end from ReactFrame
// components. Everything else is still "Coming Soon" below.
const TEMPLATES: TemplateItem[] = [
  {
    slug: "health-wellness",
    name: "Bloom Wellness Studio",
    type: "One Page",
    industry: "Health & Wellness",
    free: true,
    thumbnail: "/demo/templates/health-wellness-thumb.webp",
  },
  {
    slug: "business",
    name: "Halstead & Partners",
    type: "One Page",
    industry: "Business",
    free: true,
    thumbnail: "/demo/templates/business-thumb.webp",
  },
];

const freeCount = TEMPLATES.filter((t) => t.free).length;
const premiumCount = TEMPLATES.length - freeCount;

export function TemplatesPage() {
  // Type and Industry are independent, combinable facets (pick a Type
  // AND an Industry at once) — unlike Price, which is a separate,
  // mutually-exclusive "browse by price instead" mode. Selecting either
  // Type or Industry drops Price back to "all"; selecting Price clears
  // both.
  const [activeType, setActiveType] = React.useState<number | null>(null);
  const [activeIndustry, setActiveIndustry] = React.useState<number | null>(null);
  const [price, setPrice] = React.useState<"all" | "free" | "premium">("free");
  const [query, setQuery] = React.useState("");

  const q = query.trim().toLowerCase();

  const handleSelectType = (index: number) => {
    setActiveType((prev) => (prev === index ? null : index));
    setPrice("all");
  };

  const handleSelectIndustry = (index: number) => {
    setActiveIndustry((prev) => (prev === index ? null : index));
    setPrice("all");
  };

  const handleSelectPrice = (next: "free" | "premium") => {
    setPrice((prev) => (prev === next ? "all" : next));
    setActiveType(null);
    setActiveIndustry(null);
  };

  const typeItems: HookSidebarItem[] = TYPES.map((t) => ({ label: t, count: TEMPLATES.filter((tpl) => tpl.type === t).length }));
  const industryItems: HookSidebarItem[] = INDUSTRIES.map((ind) => ({ label: ind, count: TEMPLATES.filter((tpl) => tpl.industry === ind).length }));

  const typeLabel = activeType !== null ? TYPES[activeType] : null;
  const industryLabel = activeIndustry !== null ? INDUSTRIES[activeIndustry] : null;

  const heading =
    price !== "all"
      ? price === "free"
        ? "Free"
        : "Premium"
      : [typeLabel, industryLabel].filter(Boolean).join(" · ") || "All Templates";

  const results = React.useMemo(() => {
    return TEMPLATES.filter((t) => {
      if (typeLabel && t.type !== typeLabel) return false;
      if (industryLabel && t.industry !== industryLabel) return false;
      if (price === "free" && !t.free) return false;
      if (price === "premium" && t.free) return false;
      if (q && !t.name.toLowerCase().includes(q) && !t.industry.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [typeLabel, industryLabel, price, q]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Templates</h1>
      <p className="mt-3 max-w-xl text-foreground/60">
        Complete, themed landing page builds — built end to end from ReactFrame components.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <CatalogSearchBox value={query} onChange={setQuery} placeholder="Search templates…" />
          <PriceFilter price={price} onSelect={handleSelectPrice} freeCount={freeCount} premiumCount={premiumCount} />
          <div className="mb-5">
            <HookSidebar label="Type" items={typeItems} value={price === "all" ? (activeType ?? -1) : -1} onChange={handleSelectType} color="var(--primary)" />
          </div>
          <HookSidebar label="Industry" items={industryItems} value={price === "all" ? (activeIndustry ?? -1) : -1} onChange={handleSelectIndustry} color="var(--primary)" />
        </aside>

        <main className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>

          {results.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {results.map((template) => (
                <TemplateCard key={template.slug} template={template} />
              ))}
            </div>
          ) : (
            <>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium">
                Coming Soon
              </span>
              <p className="mt-3 max-w-md text-sm text-foreground/50">
                We&apos;re still building this section — check back soon.
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function TemplateCard({ template }: { template: TemplateItem }) {
  return (
    <Link
      href={`/templates/preview/${template.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 ease-signature hover:border-foreground/20"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-background/60">
        <span
          className={
            template.free
              ? "pointer-events-none absolute top-2.5 right-2.5 z-10 rounded-full border border-[#00A92A]/50 bg-black/70 px-3 py-0.5 text-[11px] font-bold tracking-wide text-[#00A92A] uppercase shadow-[0_0_14px_rgba(0,169,42,0.3)] backdrop-blur-sm [text-shadow:0_0_8px_rgba(0,169,42,0.65)]"
              : "pointer-events-none absolute top-2.5 right-2.5 z-10 rounded-full bg-foreground px-3 py-0.5 text-[11px] font-bold tracking-wide text-background uppercase shadow-lg"
          }
        >
          {template.free ? "Free" : "Pro"}
        </span>
        <Image
          src={template.thumbnail}
          alt={template.name}
          fill
          sizes="(min-width: 768px) 360px, 90vw"
          className="object-cover object-top transition-transform duration-500 ease-signature group-hover:scale-[1.03]"
        />
      </div>
      <div className="px-4 py-3.5">
        <div className="font-mono text-sm font-semibold">{template.name}</div>
        <div className="mt-1 text-xs text-foreground/40">
          {template.industry} · {template.type}
        </div>
      </div>
    </Link>
  );
}
