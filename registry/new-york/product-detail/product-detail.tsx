"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ProductDetailImage {
  src: string;
  alt?: string;
}

export interface ProductDetailColor {
  name: string;
  color: string;
}

export interface ProductDetailSpec {
  label: string;
  value: string;
}

export interface ProductDetailSelection {
  color: string | undefined;
  size: string | undefined;
  quantity: number;
}

export type ProductDetailTab = "description" | "specs" | "reviews";

export interface ProductDetailProps {
  /** Path segments, last one is the current page: ["Home", "Shop", "Watches"]. */
  breadcrumb?: string[];
  title: string;
  /** 0–5. */
  rating?: number;
  reviewCount?: number;
  price: string;
  compareAtPrice?: string;
  description?: string;
  longDescription?: string;
  reviewsBody?: string;
  gallery: ProductDetailImage[];
  colors?: ProductDetailColor[];
  sizes?: string[];
  specs?: ProductDetailSpec[];
  defaultColorIndex?: number;
  defaultSizeIndex?: number;
  defaultTab?: ProductDetailTab;
  buttonLabel?: string;
  /** Small accent-colored badge next to the price, e.g. "Free shipping". */
  badge?: string;
  onAddToCart?: (selection: ProductDetailSelection) => void;
  theme?: "dark" | "light";
  accentColor?: string;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0A0A0A", title: "#FFFFFF", muted: "rgba(255,255,255,0.45)", body: "rgba(255,255,255,0.62)", line: "rgba(255,255,255,0.12)", card: "#161616", buttonBg: "#FFFFFF", buttonText: "#111111", pillBorder: "rgba(255,255,255,0.16)", hover: "rgba(255,255,255,0.06)" },
  light: { bg: "#FFFFFF", title: "#111111", muted: "rgba(0,0,0,0.45)", body: "rgba(0,0,0,0.62)", line: "rgba(0,0,0,0.1)", card: "#F2F2F2", buttonBg: "#111111", buttonText: "#FFFFFF", pillBorder: "rgba(0,0,0,0.14)", hover: "rgba(0,0,0,0.05)" },
};

const TAB_LABELS: Record<ProductDetailTab, string> = { description: "Description", specs: "Specs", reviews: "Reviews" };
const TAB_ORDER: ProductDetailTab[] = ["description", "specs", "reviews"];

function Star({ filled, color }: { filled: boolean; color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill={filled ? color : "none"} stroke={color} strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3.2l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.5 6.8 19.3l1-5.8L3.5 9.4l5.9-.8L12 3.2z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4h2.4l2.1 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L19.5 8H6.2" />
      <circle cx="9.5" cy="19" r="1.2" />
      <circle cx="16.5" cy="19" r="1.2" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.7" />
      <circle cx="17" cy="17.5" r="1.7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

// Arrow keys move between the options of a radio group and select them.
function moveRadio(e: React.KeyboardEvent<HTMLElement>, index: number, count: number, select: (next: number) => void) {
  let next = index;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % count;
  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index - 1 + count) % count;
  else return;
  e.preventDefault();
  select(next);
  const radios = e.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role="radio"]');
  radios?.[next]?.focus();
}

// "$48.00" as a schema.org Offer; undefined when the currency symbol isn't one we recognise.
function toOffer(price: string | undefined) {
  const currency = ({ $: "USD", "€": "EUR", "£": "GBP", "₺": "TRY", "¥": "JPY" } as Record<string, string>)[price?.trim()[0] ?? ""];
  const amount = parseFloat(price?.replace(/[^0-9.]/g, "") ?? "");
  return currency && !Number.isNaN(amount) ? { "@type": "Offer", price: amount.toFixed(2), priceCurrency: currency } : undefined;
}

export function ProductDetail({
  breadcrumb,
  title,
  rating = 0,
  reviewCount,
  price,
  compareAtPrice,
  description,
  longDescription,
  reviewsBody,
  gallery,
  colors = [],
  sizes = [],
  specs = [],
  defaultColorIndex = 0,
  defaultSizeIndex = 0,
  defaultTab = "specs",
  buttonLabel = "Add to Cart",
  badge,
  onAddToCart,
  theme = "dark",
  accentColor = "#F2A841",
  className,
}: ProductDetailProps) {
  const p = PALETTES[theme];
  const uid = React.useId();
  const [activeImage, setActiveImage] = React.useState(0);
  const [colorIndex, setColorIndex] = React.useState(defaultColorIndex);
  const [sizeIndex, setSizeIndex] = React.useState(defaultSizeIndex);
  const [quantity, setQuantity] = React.useState(1);
  const [tab, setTab] = React.useState<ProductDetailTab>(defaultTab);
  const [added, setAdded] = React.useState(false);
  const addedTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );

  const image = gallery[Math.min(activeImage, gallery.length - 1)];
  const filledStars = Math.round(Math.max(0, Math.min(5, rating)));
  const visibleTabs = TAB_ORDER.filter((key) => (key === "specs" ? specs.length > 0 : key === "description" ? Boolean(longDescription ?? description) : Boolean(reviewsBody)));
  const currentTab = visibleTabs.includes(tab) ? tab : visibleTabs[0];

  const handleAdd = () => {
    onAddToCart?.({ color: colors[colorIndex]?.name, size: sizes[sizeIndex], quantity });
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1800);
  };

  const ring = { ["--tw-ring-color" as string]: accentColor };
  const focus = "outline-none focus-visible:ring-2";

  // schema.org Product markup (JSON-LD) for search engines.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    ...(description ? { description } : {}),
    image: gallery.map((g) => g.src),
    ...(toOffer(price) ? { offers: toOffer(price) } : {}),
    ...(rating > 0 && reviewCount ? { aggregateRating: { "@type": "AggregateRating", ratingValue: rating, reviewCount } } : {}),
  }).replace(/</g, "\\u003c");

  return (
    <section aria-label={title} className={cn("@container w-full", className)} style={{ background: p.bg, fontFamily: "Inter, sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <div className="mx-auto w-full max-w-[1200px] px-[18px] pt-6 pb-10 @[900px]:px-10 @[900px]:pt-8 @[900px]:pb-12">
        <div className="grid grid-cols-1 gap-[22px] @[900px]:grid-cols-2 @[900px]:gap-10">
          <div>
            <div className="group relative mb-3 aspect-square w-full overflow-hidden rounded-2xl" style={{ background: p.card }}>
              <AnimatePresence mode="popLayout" initial={false}>
                {image && (
                  <motion.img
                    key={image.src}
                    src={image.src}
                    alt={image.alt ?? title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 block size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                )}
              </AnimatePresence>
            </div>

            {gallery.length > 1 && (
              <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${Math.min(gallery.length, 4)}, minmax(0, 1fr))` }}>
                {gallery.slice(0, 4).map((item, i) => (
                  <button
                    key={item.src}
                    type="button"
                    aria-label={`Show image ${i + 1} of ${gallery.length}`}
                    aria-pressed={activeImage === i}
                    onClick={() => setActiveImage(i)}
                    className={cn("aspect-square cursor-pointer overflow-hidden rounded-[10px] p-0 transition-opacity duration-200", focus, activeImage === i ? "opacity-100" : "opacity-60 hover:opacity-100")}
                    style={{ background: p.card, border: `1.5px solid ${activeImage === i ? p.title : "transparent"}`, ...ring }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.src} alt="" className="block size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {breadcrumb && breadcrumb.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-2.5 text-[13px] leading-[1.4]" style={{ color: p.muted }}>
                <ol className="m-0 flex list-none flex-wrap items-center p-0">
                  {breadcrumb.map((crumb, i) => (
                    <li key={`${crumb}-${i}`} className="flex items-center" aria-current={i === breadcrumb.length - 1 ? "page" : undefined}>
                      {i > 0 && <span aria-hidden="true" className="mx-1.5">/</span>}
                      <span>{crumb}</span>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <h1 className="m-0 mb-2.5 text-[32px] leading-[1.1] font-semibold tracking-[-0.03em] @[900px]:text-[42px]" style={{ color: p.title }}>
              {title}
            </h1>

            <div className="mb-3.5 flex items-center gap-2">
              <span role="img" aria-label={`Rated ${filledStars} out of 5`} className="inline-flex gap-[3px]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} filled={i < filledStars} color={p.title} />
                ))}
              </span>
              {reviewCount !== undefined && (
                <span className="text-[14px] leading-[1.3] font-medium" style={{ color: p.muted }}>
                  ({reviewCount} reviews)
                </span>
              )}
            </div>

            <div className="mb-3.5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-[32px] leading-[1.1] font-semibold" style={{ color: p.title }}>{price}</span>
              {compareAtPrice && <span className="text-[18px] leading-[1.1] line-through" style={{ color: p.muted }}>{compareAtPrice}</span>}
              {badge && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] leading-[1.2] font-medium"
                  style={{ color: accentColor, background: `color-mix(in srgb, ${accentColor} 14%, transparent)` }}
                >
                  <TruckIcon />
                  {badge}
                </span>
              )}
            </div>

            {description && (
              <p className="m-0 mb-5 max-w-[460px] text-[16px] leading-[1.6]" style={{ color: p.body }}>
                {description}
              </p>
            )}

            {colors.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 text-[13px] leading-[1.3]" style={{ color: p.muted }}>
                  Color: <span style={{ color: p.title }}>{colors[colorIndex]?.name}</span>
                </div>
                <div role="radiogroup" aria-label="Color" className="flex gap-2.5">
                  {colors.map((item, i) => {
                    const active = colorIndex === i;
                    return (
                      <button
                        key={`${item.name}-${i}`}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-label={item.name}
                        tabIndex={active ? 0 : -1}
                        onClick={() => setColorIndex(i)}
                        onKeyDown={(e) => moveRadio(e, i, colors.length, setColorIndex)}
                        className={cn("size-[22px] cursor-pointer rounded-full p-0 transition-shadow duration-150", focus)}
                        style={{ background: item.color, border: "2px solid transparent", boxShadow: active ? `0 0 0 2px ${p.bg}, 0 0 0 3.5px ${p.title}` : "none", ...ring }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 text-[13px] leading-[1.3]" style={{ color: p.muted }}>
                  Size: <span style={{ color: p.title }}>{sizes[sizeIndex]}</span>
                </div>
                <div role="radiogroup" aria-label="Size" className="flex flex-wrap gap-2">
                  {sizes.map((label, i) => {
                    const active = sizeIndex === i;
                    return (
                      <button
                        key={label}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        tabIndex={active ? 0 : -1}
                        onClick={() => setSizeIndex(i)}
                        onKeyDown={(e) => moveRadio(e, i, sizes.length, setSizeIndex)}
                        className={cn("min-w-[46px] cursor-pointer rounded-full px-3 py-2 text-[14px] leading-[1.3] font-medium transition-colors duration-150", focus, !active && "hover:bg-[var(--pd-hover)]")}
                        style={{
                          border: `1px solid ${active ? "transparent" : p.pillBorder}`,
                          background: active ? p.title : "transparent",
                          color: active ? p.bg : p.title,
                          ["--pd-hover" as string]: p.hover,
                          ...ring,
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div role="group" aria-label="Quantity" className="mb-4 inline-flex items-center rounded-full" style={{ border: `1px solid ${p.pillBorder}` }}>
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className={cn("h-[38px] w-[42px] cursor-pointer rounded-full border-none bg-transparent text-[18px] leading-none transition-opacity disabled:cursor-not-allowed disabled:opacity-35", focus)}
                style={{ color: p.title, ...ring }}
              >
                &minus;
              </button>
              <span aria-live="polite" className="min-w-6 text-center text-[14px] leading-[1.3] font-medium" style={{ color: p.title }}>{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                className={cn("h-[38px] w-[42px] cursor-pointer rounded-full border-none bg-transparent text-[18px] leading-none", focus)}
                style={{ color: p.title, ...ring }}
              >
                +
              </button>
            </div>

            <motion.button
              type="button"
              onClick={handleAdd}
              whileTap={{ scale: 0.98 }}
              className={cn("flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border-none px-[18px] py-3.5 text-[14px] leading-[1.3] font-semibold", focus)}
              style={{ background: p.buttonBg, color: p.buttonText, ...ring }}
            >
              <span aria-live="polite" className="inline-flex items-center gap-2.5">
                {added ? <CheckIcon /> : <CartIcon />}
                <span>{added ? "Added to cart" : buttonLabel}</span>
              </span>
            </motion.button>
          </div>
        </div>

        {visibleTabs.length > 0 && (
          <div className="mt-9">
            <div role="tablist" aria-label="Product information" className="flex gap-7" style={{ borderBottom: `1px solid ${p.line}` }}>
              {visibleTabs.map((key) => {
                const active = currentTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    id={`${uid}-tab-${key}`}
                    aria-selected={active}
                    aria-controls={`${uid}-panel`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setTab(key)}
                    onKeyDown={(e) => {
                      const i = visibleTabs.indexOf(key);
                      const next = e.key === "ArrowRight" ? (i + 1) % visibleTabs.length : e.key === "ArrowLeft" ? (i - 1 + visibleTabs.length) % visibleTabs.length : -1;
                      if (next < 0) return;
                      e.preventDefault();
                      setTab(visibleTabs[next]);
                      (e.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role="tab"]')[next])?.focus();
                    }}
                    className={cn("relative cursor-pointer border-none bg-transparent py-2.5 text-[14px] leading-[1.3] font-medium transition-colors duration-150", focus)}
                    style={{ color: active ? p.title : p.muted, ...ring }}
                  >
                    {TAB_LABELS[key]}
                    {active && <motion.span layoutId={`${uid}-tab-line`} className="absolute inset-x-0 -bottom-px h-0.5" style={{ background: p.title }} transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                  </button>
                );
              })}
            </div>

            <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${currentTab}`} className="pt-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={currentTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  {currentTab === "description" && (
                    <p className="m-0 max-w-[680px] text-[16px] leading-[1.6]" style={{ color: p.body }}>{longDescription ?? description}</p>
                  )}
                  {currentTab === "reviews" && (
                    <p className="m-0 max-w-[680px] text-[16px] leading-[1.6]" style={{ color: p.body }}>{reviewsBody}</p>
                  )}
                  {currentTab === "specs" && (
                    <dl className="m-0 grid grid-cols-1 gap-x-12 gap-y-2.5 @[900px]:grid-cols-2">
                      {specs.map((spec) => (
                        <div key={spec.label} className="grid grid-cols-[140px_1fr] gap-4 text-[14px] leading-[1.5]">
                          <dt style={{ color: p.muted }}>{spec.label}</dt>
                          <dd className="m-0" style={{ color: p.title }}>{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
