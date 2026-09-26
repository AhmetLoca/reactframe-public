"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ProductGridItem {
  image?: string;
  title: string;
  category: string;
  price: string;
  link?: string;
  badgeText?: string;
}

export type ProductGridTheme = "light" | "dark";

export interface ProductGridSectionProps {
  theme?: ProductGridTheme;
  headingText?: string;
  headingColor?: string;
  headingFontSize?: number;
  headingFontWeight?: number;
  headingGap?: number;
  cards?: ProductGridItem[];
  columns?: number;
  tabletColumns?: number;
  mobileColumns?: number;
  gap?: number;
  imageRadius?: number;
  imageAspect?: number;
  cardBorderColor?: string;
  titleColor?: string;
  titleFontSize?: number;
  metaColor?: string;
  metaFontSize?: number;
  badgeBackground?: string;
  badgeTextColor?: string;
  showOverlay?: boolean;
  overlayText?: string;
  overlayBackground?: string;
  overlayTextColor?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  buttonTextColor?: string;
  buttonBackground?: string;
  buttonHoverBackground?: string;
  buttonGap?: number;
  backgroundColor?: string;
  className?: string;
}

const THEMES = {
  light: {
    backgroundColor: "#f5f5f5",
    headingColor: "#1a1a1a",
    titleColor: "#1a1a1a",
    metaColor: "#6b6b6b",
    cardBorderColor: "rgba(0,0,0,0.08)",
    imageBackground: "#ffffff",
    badgeBackground: "#1a1a1a",
    badgeTextColor: "#ffffff",
    buttonTextColor: "#1a1a1a",
    buttonBackground: "#ffffff",
    buttonHoverBackground: "#ececec",
  },
  dark: {
    backgroundColor: "#080808",
    headingColor: "#f5f4f1",
    titleColor: "#f5f4f1",
    metaColor: "rgba(245,244,241,0.6)",
    cardBorderColor: "rgba(255,255,255,0.1)",
    imageBackground: "#141414",
    badgeBackground: "#f5f4f1",
    badgeTextColor: "#0a0a0a",
    buttonTextColor: "#0a0a0a",
    buttonBackground: "#f5f4f1",
    buttonHoverBackground: "#dcdad6",
  },
} as const;

const DEFAULT_CARDS: ProductGridItem[] = [
  { image: "/demo/running-shoes.webp", title: "Running Shoes", category: "Agency", price: "$99.00" },
  { image: "/demo/wireless-earbuds.webp", title: "Wireless Earbuds", category: "Portfolio", price: "$129.00", badgeText: "New" },
  { image: "/demo/notebook.webp", title: "Premium Notebook", category: "Startup", price: "$24.00" },
  { image: "/demo/minimal-watch.webp", title: "Minimal Watch", category: "SaaS", price: "$59.00" },
  { image: "/demo/laptop-stand.webp", title: "Laptop Stand", category: "Creative", price: "$49.00" },
  { image: "/demo/insulated-water-bottle.webp", title: "Insulated Water Bottle", category: "Animation", price: "$39.00", badgeText: "Popular" },
];

// "$48.00" as a schema.org Offer; undefined when the currency symbol isn't one we recognise.
function toOffer(price: string | undefined) {
  const currency = ({ $: "USD", "€": "EUR", "£": "GBP", "₺": "TRY", "¥": "JPY" } as Record<string, string>)[price?.trim()[0] ?? ""];
  const amount = parseFloat(price?.replace(/[^0-9.]/g, "") ?? "");
  return currency && !Number.isNaN(amount) ? { "@type": "Offer", price: amount.toFixed(2), priceCurrency: currency } : undefined;
}

export function ProductGridSection({
  theme = "dark",
  headingText = "Latest Templates",
  headingColor,
  headingFontSize = 32,
  headingFontWeight = 700,
  headingGap = 40,
  cards = DEFAULT_CARDS,
  columns = 3,
  tabletColumns = 2,
  mobileColumns = 1,
  gap = 32,
  imageRadius = 16,
  imageAspect = 1344 / 752,
  cardBorderColor,
  titleColor,
  titleFontSize = 17,
  metaColor,
  metaFontSize = 15,
  badgeBackground,
  badgeTextColor,
  showOverlay = true,
  overlayText = "View Template →",
  overlayBackground = "rgba(0,0,0,0.45)",
  overlayTextColor = "#ffffff",
  showButton = true,
  buttonText = "Explore All",
  buttonLink,
  buttonTextColor,
  buttonBackground,
  buttonHoverBackground,
  buttonGap = 20,
  backgroundColor,
  className,
}: ProductGridSectionProps) {
  const palette = THEMES[theme];
  headingColor ??= palette.headingColor;
  titleColor ??= palette.titleColor;
  metaColor ??= palette.metaColor;
  cardBorderColor ??= palette.cardBorderColor;
  badgeBackground ??= palette.badgeBackground;
  badgeTextColor ??= palette.badgeTextColor;
  buttonTextColor ??= palette.buttonTextColor;
  buttonBackground ??= palette.buttonBackground;
  buttonHoverBackground ??= palette.buttonHoverBackground;
  backgroundColor ??= palette.backgroundColor;
  const [hoveredButton, setHoveredButton] = React.useState(false);
  const gridId = React.useId().replace(/:/g, "");

  // schema.org ItemList of Products (JSON-LD) for search engines, skipped while the placeholder cards show.
  const jsonLd = cards === DEFAULT_CARDS
    ? null
    : JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: cards.map((card, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: card.title,
            category: card.category,
            ...(card.image ? { image: card.image } : {}),
            ...(card.link ? { url: card.link } : {}),
            ...(toOffer(card.price) ? { offers: toOffer(card.price) } : {}),
          },
        })),
      }).replace(/</g, "\\u003c");

  return (
    <div className={cn("box-border flex w-full flex-col", className)} style={{ backgroundColor, padding: "60px 80px" }}>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <style>{`
        .pgs-card-image-${gridId} { transition: transform 0.35s ease; }
        .pgs-card-${gridId}:hover .pgs-card-image-${gridId} { transform: scale(1.04); }
        .pgs-overlay-${gridId} { opacity: 0; transition: opacity 0.3s ease; }
        .pgs-card-${gridId}:hover .pgs-overlay-${gridId} { opacity: 1; }
        .pgs-overlay-text-${gridId} { transform: translateY(8px); transition: transform 0.3s ease; }
        .pgs-card-${gridId}:hover .pgs-overlay-text-${gridId} { transform: translateY(0); }
        .pgs-grid-${gridId} { display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: ${gap}px; width: 100%; }
        @media (max-width: 900px) {
          .pgs-grid-${gridId} { grid-template-columns: repeat(${tabletColumns}, 1fr); }
        }
        @media (max-width: 600px) {
          .pgs-grid-${gridId} { grid-template-columns: repeat(${mobileColumns}, 1fr); }
        }
      `}</style>

      <div style={{ fontWeight: headingFontWeight, fontSize: headingFontSize, color: headingColor, marginBottom: headingGap }}>
        {headingText}
      </div>

      <div className={`pgs-grid-${gridId}`}>
        {cards.map((card, i) => (
          <motion.a
            key={i}
            href={card.link || undefined}
            className={cn(`pgs-card-${gridId}`, "flex flex-col gap-3 no-underline")}
            style={{ color: "inherit" }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ backgroundColor: palette.imageBackground, aspectRatio: String(imageAspect), borderRadius: imageRadius, border: `1px solid ${cardBorderColor}` }}
            >
              {card.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.image}
                  alt={card.title}
                  className={cn(`pgs-card-image-${gridId}`, "block h-full w-full object-cover")}
                />
              )}
              {card.badgeText && (
                <div
                  className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ backgroundColor: badgeBackground, color: badgeTextColor }}
                >
                  {card.badgeText}
                </div>
              )}
              {showOverlay && (
                <div
                  className={cn(`pgs-overlay-${gridId}`, "absolute inset-0 flex items-end p-4")}
                  style={{ background: overlayBackground }}
                >
                  <span className={`pgs-overlay-text-${gridId}`} style={{ fontSize: 14, fontWeight: 600, color: overlayTextColor }}>
                    {overlayText}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div style={{ fontSize: titleFontSize, fontWeight: 700, color: titleColor }}>{card.title}</div>
              <div className="flex items-center gap-1.5" style={{ fontSize: metaFontSize, color: metaColor }}>
                <span>{card.price}</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {showButton && (
        <a
          href={buttonLink || undefined}
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}
          className="self-center rounded-full px-8 py-4 text-base font-semibold no-underline"
          style={{
            marginTop: buttonGap,
            backgroundColor: hoveredButton ? buttonHoverBackground : buttonBackground,
            color: buttonTextColor,
            transition: "background-color 0.2s ease",
          }}
        >
          {buttonText}
        </a>
      )}
    </div>
  );
}
