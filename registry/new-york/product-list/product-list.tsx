"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ProductListTier = "free" | "premium";
export type ProductListBadge = "new" | "sale";

export interface ProductListItem {
  title: string;
  price: string;
  compareAtPrice?: string;
  category: string;
  tier?: ProductListTier;
  badge?: ProductListBadge;
  image?: string;
  url?: string;
}

export interface ProductListProps {
  products: ProductListItem[];
  searchPlaceholder?: string;
  priceLabel?: string;
  categoriesLabel?: string;
  allLabel?: string;
  /** Color of the active filter, the radio dots and the "New" badge. */
  accentColor?: string;
  theme?: "dark" | "light";
  onProductClick?: (product: ProductListItem) => void;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0A0A0A", title: "#FFFFFF", muted: "rgba(255,255,255,0.42)", line: "rgba(255,255,255,0.1)", cardBg: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.12)", cardHover: "rgba(255,255,255,0.25)", inputBg: "rgba(255,255,255,0.04)", fallback: "#161616", saleBg: "#FFFFFF", saleText: "#111111", focus: "rgba(255,255,255,0.35)", empty: "rgba(255,255,255,0.7)" },
  light: { bg: "#FFFFFF", title: "#111111", muted: "rgba(0,0,0,0.42)", line: "rgba(0,0,0,0.08)", cardBg: "rgba(0,0,0,0.02)", cardBorder: "rgba(0,0,0,0.1)", cardHover: "rgba(0,0,0,0.25)", inputBg: "rgba(0,0,0,0.03)", fallback: "#ECECEC", saleBg: "#111111", saleText: "#FFFFFF", focus: "rgba(0,0,0,0.28)", empty: "rgba(0,0,0,0.65)" },
};

type Palette = (typeof PALETTES)["dark"];

function FilterRow({ label, count, active, accent, p, radio, onClick }: { label: string; count: number; active: boolean; accent: string; p: Palette; radio?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn("flex w-full cursor-pointer items-center gap-2 rounded-lg border-none bg-transparent text-left text-[14px] leading-[1.3] outline-none focus-visible:ring-2", radio ? "py-1.5" : "py-[7px]")}
      style={{ color: active ? accent : p.title, ["--tw-ring-color" as string]: p.focus }}
    >
      {radio && <span aria-hidden="true" className="size-2.5 rounded-full" style={{ border: `1.5px solid ${active ? accent : p.muted}`, background: active ? accent : "transparent" }} />}
      <span className="flex-1">{label}</span>
      <span style={{ color: active ? accent : p.muted }}>{count}</span>
    </button>
  );
}

// "$48.00" as a schema.org Offer; undefined when the currency symbol isn't one we recognise.
function toOffer(price: string | undefined) {
  const currency = ({ $: "USD", "€": "EUR", "£": "GBP", "₺": "TRY", "¥": "JPY" } as Record<string, string>)[price?.trim()[0] ?? ""];
  const amount = parseFloat(price?.replace(/[^0-9.]/g, "") ?? "");
  return currency && !Number.isNaN(amount) ? { "@type": "Offer", price: amount.toFixed(2), priceCurrency: currency } : undefined;
}

export function ProductList({
  products,
  searchPlaceholder = "Search categories...",
  priceLabel = "PRICE",
  categoriesLabel = "CATEGORIES",
  allLabel = "All Products",
  accentColor = "#7CDE6A",
  theme = "dark",
  onProductClick,
  className,
}: ProductListProps) {
  const p = PALETTES[theme];
  const [query, setQuery] = React.useState("");
  const [tier, setTier] = React.useState<"all" | ProductListTier>("all");
  const [category, setCategory] = React.useState("all");

  const hasTiers = products.some((item) => item.tier);
  const categories = React.useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((item) => map.set(item.category, (map.get(item.category) ?? 0) + 1));
    return Array.from(map.entries());
  }, [products]);

  const freeCount = products.filter((item) => item.tier === "free").length;
  const premiumCount = products.filter((item) => item.tier === "premium").length;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((item) => {
      const matchQuery = !q || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      const matchTier = tier === "all" || item.tier === tier;
      const matchCategory = category === "all" || item.category === category;
      return matchQuery && matchTier && matchCategory;
    });
  }, [products, query, tier, category]);

  const clearFilters = () => {
    setQuery("");
    setTier("all");
    setCategory("all");
  };

  const ring = { ["--tw-ring-color" as string]: p.focus };

  // schema.org ItemList of Products (JSON-LD) for search engines.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: item.title,
        category: item.category,
        ...(item.image ? { image: item.image } : {}),
        ...(item.url ? { url: item.url } : {}),
        ...(toOffer(item.price) ? { offers: toOffer(item.price) } : {}),
      },
    })),
  }).replace(/</g, "\\u003c");

  return (
    <div className={cn("@container w-full", className)} style={{ background: p.bg, color: p.title, fontFamily: "Inter, sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <div className="grid grid-cols-1 gap-[18px] p-4 pb-12 @[900px]:grid-cols-[240px_1fr] @[900px]:p-5 @[900px]:pb-12">
        <aside aria-label="Product filters" className="@[900px]:sticky @[900px]:top-5 @[900px]:self-start">
          <div className="rounded-2xl p-4" style={{ border: `1px solid ${p.cardBorder}` }}>
            <label className="mb-[18px] flex items-center gap-2 rounded-xl px-3 py-2.5 focus-within:ring-2" style={{ background: p.inputBg, border: `1px solid ${p.cardBorder}`, ...ring }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" stroke={p.muted} strokeWidth="1.7" />
                <path d="M16.5 16.5L21 21" stroke={p.muted} strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label="Search products"
                className="w-full border-none bg-transparent text-[13px] leading-[1.3] outline-none"
                style={{ color: p.title }}
              />
            </label>

            {hasTiers && (
              <>
                <div className="mb-2.5 text-[11px] leading-[1.2] font-medium tracking-[0.12em]" style={{ color: p.muted }}>{priceLabel}</div>
                <FilterRow radio label="Free" count={freeCount} active={tier === "free"} accent={accentColor} p={p} onClick={() => setTier(tier === "free" ? "all" : "free")} />
                <FilterRow radio label="Premium" count={premiumCount} active={tier === "premium"} accent={accentColor} p={p} onClick={() => setTier(tier === "premium" ? "all" : "premium")} />
                <div className="my-4 h-px" style={{ background: p.line }} />
              </>
            )}

            <div className="mb-2.5 text-[11px] leading-[1.2] font-medium tracking-[0.12em]" style={{ color: p.muted }}>{categoriesLabel}</div>
            <FilterRow label={allLabel} count={products.length} active={category === "all"} accent={accentColor} p={p} onClick={() => setCategory("all")} />
            {categories.map(([name, count]) => (
              <FilterRow key={name} label={name} count={count} active={category === name} accent={accentColor} p={p} onClick={() => setCategory(category === name ? "all" : name)} />
            ))}
          </div>
        </aside>

        {filtered.length > 0 ? (
          <div role="list" aria-label="Product results" className="grid grid-cols-1 content-start gap-3.5 @[560px]:grid-cols-2 @[900px]:grid-cols-3">
            {filtered.map((item, index) => (
              <motion.a
                key={item.title}
                role="listitem"
                href={item.url}
                aria-label={`${item.title}, ${item.price}`}
                onClick={onProductClick ? () => onProductClick(item) : undefined}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.03 }}
                className="group block overflow-hidden rounded-2xl text-inherit no-underline outline-none transition-colors duration-200 hover:[border-color:var(--pl-hover)] focus-visible:ring-2"
                style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}`, ["--pl-hover" as string]: p.cardHover, ...ring }}
              >
                <article>
                  <div className="relative h-[170px] overflow-hidden" style={{ background: p.fallback }}>
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.title} loading="lazy" className="block size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
                    )}
                    {item.badge && (
                      <span
                        className="absolute top-2.5 left-2.5 rounded-full px-[9px] py-1 text-[11px] leading-[1.2] font-semibold"
                        style={item.badge === "new" ? { background: accentColor, color: "#102010" } : { background: p.saleBg, color: p.saleText }}
                      >
                        {item.badge === "new" ? "New" : "Sale"}
                      </span>
                    )}
                  </div>
                  <div className="px-3.5 pt-3 pb-3.5">
                    <h3 className="m-0 text-[15px] leading-[1.3] font-medium" style={{ color: p.title }}>{item.title}</h3>
                    <div className="mt-1.5 flex gap-2 text-[14px] leading-[1.3]">
                      <span style={{ color: p.title }}>{item.price}</span>
                      {item.compareAtPrice && <span className="line-through" style={{ color: p.muted }}>{item.compareAtPrice}</span>}
                    </div>
                  </div>
                </article>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center" style={{ border: `1px dashed ${p.cardBorder}` }}>
            <p className="m-0 text-[15px] font-medium" style={{ color: p.title }}>No products match your filters</p>
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer rounded-full bg-transparent px-4 py-1.5 text-[13px] outline-none focus-visible:ring-2"
              style={{ border: `1px solid ${p.cardBorder}`, color: p.empty, ...ring }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
