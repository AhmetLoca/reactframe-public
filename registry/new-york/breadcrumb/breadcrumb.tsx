"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export type BreadcrumbSeparator = "chevron" | "slash" | "dot" | "arrow";
export type BreadcrumbSize = "sm" | "md" | "lg";

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  separator?: BreadcrumbSeparator | React.ReactNode;
  maxItems?: number;
  showHomeIcon?: boolean;
  size?: BreadcrumbSize;
  theme?: "dark" | "light";
  accentColor?: string;
  className?: string;
}

const DEFAULT_ITEMS: BreadcrumbItem[] = [
  { label: "Home", href: "#" },
  { label: "Components", href: "#" },
  { label: "Elements", href: "#" },
  { label: "Navigation", href: "#" },
  { label: "Breadcrumb" },
];

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", sep: "rgba(245,244,241,0.28)", hover: "rgba(255,255,255,0.07)", menu: "#0E0E0E" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", sep: "rgba(10,10,10,0.28)", hover: "rgba(10,10,10,0.06)", menu: "#FFFFFF" },
};

const SIZES: Record<BreadcrumbSize, { font: number; padX: number; padY: number; gap: number; icon: number }> = {
  sm: { font: 12.5, padX: 6, padY: 3, gap: 4, icon: 13 },
  md: { font: 14, padX: 8, padY: 4, gap: 6, icon: 15 },
  lg: { font: 16, padX: 10, padY: 5, gap: 8, icon: 17 },
};

function HomeIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 7.2L8 2.5l5.5 4.7" />
      <path d="M3.8 6.4V13h8.4V6.4" />
    </svg>
  );
}

function Separator({ kind, size, color }: { kind: BreadcrumbSeparator | React.ReactNode; size: number; color: string }) {
  if (kind === "chevron") {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 3.5L10.5 8L6 12.5" />
      </svg>
    );
  }
  if (kind === "arrow") {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 8h9.5M9 4.5L12.5 8L9 11.5" />
      </svg>
    );
  }
  if (kind === "slash") {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <path d="M10.5 2.5L5.5 13.5" />
      </svg>
    );
  }
  if (kind === "dot") {
    return <span style={{ width: 4, height: 4, borderRadius: "50%", background: color, display: "block" }} />;
  }
  return <span style={{ color }}>{kind}</span>;
}

export function Breadcrumb({ items = DEFAULT_ITEMS, separator = "chevron", maxItems, showHomeIcon = false, size = "md", theme = "dark", accentColor = "#F2A841", className }: BreadcrumbProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const [expanded, setExpanded] = React.useState(false);
  const collapsed = maxItems !== undefined && maxItems >= 2 && items.length > maxItems && !expanded;

  type Entry = { kind: "item"; item: BreadcrumbItem; index: number } | { kind: "ellipsis" };
  const entries: Entry[] = collapsed
    ? [
        { kind: "item", item: items[0], index: 0 },
        { kind: "ellipsis" },
        ...items.slice(items.length - (maxItems! - 1)).map((item, i): Entry => ({ kind: "item", item, index: items.length - (maxItems! - 1) + i })),
      ]
    : items.map((item, index): Entry => ({ kind: "item", item, index }));

  const linkStyle = (current: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: s.gap,
    padding: `${s.padY}px ${s.padX}px`,
    borderRadius: 8,
    fontSize: s.font,
    fontWeight: current ? 600 : 500,
    color: current ? p.text : p.muted,
    transition: "background 0.15s ease, color 0.15s ease",
  });

  // schema.org BreadcrumbList (JSON-LD) so search engines can show the trail, skipped while the placeholder items show.
  const jsonLd = items === DEFAULT_ITEMS
    ? null
    : JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.label, ...(item.href ? { item: item.href } : {}) })),
      }).replace(/</g, "\\u003c");

  return (
    <nav aria-label="Breadcrumb" className={cn("inline-block max-w-full", className)} style={{ fontFamily: "Inter, sans-serif" }}>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <ol className="m-0 flex list-none flex-wrap items-center p-0" style={{ gap: s.gap }}>
        <AnimatePresence initial={false} mode="popLayout">
          {entries.map((entry, i) => {
            const isLast = i === entries.length - 1;
            const key = entry.kind === "ellipsis" ? "ellipsis" : `${entry.item.label}-${entry.index}`;
            let node: React.ReactNode;
            if (entry.kind === "ellipsis") {
              node = (
                <button
                  type="button"
                  aria-label="Show hidden pages"
                  onClick={() => setExpanded(true)}
                  className="cursor-pointer border-none bg-transparent outline-none focus-visible:ring-2"
                  style={{ ...linkStyle(false), ["--tw-ring-color" as string]: accentColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <svg width={s.icon} height={s.icon} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <circle cx="3.5" cy="8" r="1.3" />
                    <circle cx="8" cy="8" r="1.3" />
                    <circle cx="12.5" cy="8" r="1.3" />
                  </svg>
                </button>
              );
            } else {
              const { item, index } = entry;
              const icon = item.icon ?? (showHomeIcon && index === 0 ? <HomeIcon size={s.icon} /> : null);
              const inner = (
                <>
                  {icon}
                  <span>{item.label}</span>
                </>
              );
              if (isLast) {
                node = (
                  <span aria-current="page" style={linkStyle(true)}>
                    {inner}
                  </span>
                );
              } else {
                const common = {
                  className: "cursor-pointer border-none bg-transparent no-underline outline-none focus-visible:ring-2",
                  style: { ...linkStyle(false), ["--tw-ring-color" as string]: accentColor } as React.CSSProperties,
                  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.background = p.hover;
                    e.currentTarget.style.color = accentColor;
                  },
                  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = p.muted;
                  },
                };
                node = item.href ? (
                  <a href={item.href} onClick={item.onClick} {...common}>
                    {inner}
                  </a>
                ) : (
                  <button type="button" onClick={item.onClick} {...common}>
                    {inner}
                  </button>
                );
              }
            }
            return (
              <motion.li key={key} layout className="flex items-center" style={{ gap: s.gap }} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}>
                {node}
                {!isLast && (
                  <span aria-hidden="true" className="flex items-center justify-center" style={{ width: s.icon, height: s.icon }}>
                    <Separator kind={separator} size={s.icon} color={p.sep} />
                  </span>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </nav>
  );
}
