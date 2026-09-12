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

export interface ProductGridSectionProps {
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

const DEFAULT_CARDS: ProductGridItem[] = [
  { image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", title: "Editorial Look", category: "Agency", price: "$39 USD" },
  { image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80", title: "Studio Set", category: "Portfolio", price: "$49 USD", badgeText: "New" },
  { image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80", title: "Brand Kit", category: "Startup", price: "$29 USD" },
  { image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80", title: "Landing Page", category: "SaaS", price: "$59 USD" },
  { image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80", title: "Photo Suite", category: "Creative", price: "$45 USD" },
  { image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80", title: "Motion Pack", category: "Animation", price: "$69 USD", badgeText: "Popular" },
];

export function ProductGridSection({
  headingText = "Latest Templates",
  headingColor = "#1a1a1a",
  headingFontSize = 32,
  headingFontWeight = 700,
  headingGap = 40,
  cards = DEFAULT_CARDS,
  columns = 3,
  tabletColumns = 2,
  mobileColumns = 1,
  gap = 32,
  imageRadius = 16,
  imageAspect = 1,
  titleColor = "#1a1a1a",
  titleFontSize = 17,
  metaColor = "#6b6b6b",
  metaFontSize = 15,
  badgeBackground = "#1a1a1a",
  badgeTextColor = "#ffffff",
  showOverlay = true,
  overlayText = "View Template →",
  overlayBackground = "rgba(0,0,0,0.45)",
  overlayTextColor = "#ffffff",
  showButton = true,
  buttonText = "Explore All",
  buttonLink,
  buttonTextColor = "#1a1a1a",
  buttonBackground = "#ffffff",
  buttonHoverBackground = "#ececec",
  buttonGap = 20,
  backgroundColor = "#f2f2f2",
  className,
}: ProductGridSectionProps) {
  const [hoveredButton, setHoveredButton] = React.useState(false);
  const gridId = React.useId().replace(/:/g, "");

  return (
    <div className={cn("box-border flex w-full flex-col", className)} style={{ backgroundColor, padding: "60px 80px" }}>
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
              className="relative w-full overflow-hidden bg-white"
              style={{ aspectRatio: String(imageAspect), borderRadius: imageRadius }}
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
            <div style={{ fontSize: titleFontSize, fontWeight: 700, color: titleColor }}>{card.title}</div>
            <div className="flex items-center gap-1.5" style={{ fontSize: metaFontSize, color: metaColor }}>
              <span>{card.category}</span>
              <span>·</span>
              <span>{card.price}</span>
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
