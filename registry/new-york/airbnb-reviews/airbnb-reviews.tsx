"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TOKENS = {
  ink: "#0d0d0d",
  glassBorderSoft: "rgba(255,255,255,0.12)",
  uiFontFamily: "'Helvetica Neue', Arial, sans-serif",
  gapDefault: 20,
} as const;

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 980;

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = React.useState(9999);
  React.useEffect(() => {
    if (!ref.current) return;
    let rafId = 0;
    const ro = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setWidth(entry.contentRect.width));
    });
    ro.observe(ref.current);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [ref]);
  return width;
}

const AVATAR_PALETTE = ["#3c7a63", "#64748b", "#8b5cf6", "#c026d3", "#0ea5e9", "#d97706"];

export type AirbnbReviewsThemeMode = "light" | "dark" | "custom";

export interface AirbnbReviewItem {
  avatar?: string | null;
  name: string;
  date: string;
  rating: number;
  text: string;
}

export interface AirbnbReviewsFontValue {
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  fontSize?: number | string;
  lineHeight?: number | string;
  letterSpacing?: number | string;
}

const DEFAULT_REVIEWS: AirbnbReviewItem[] = [
  {
    avatar: null,
    name: "Emma Wilson",
    date: "7 days ago",
    rating: 5,
    text: "The place was even better than the photos. Spotless, well stocked, and the host checked in at just the right moments without ever being intrusive.",
  },
  {
    avatar: null,
    name: "Grace Miller",
    date: "21 days ago",
    rating: 5,
    text: "Loved the location, walkable to everything we wanted to see. Check-in was seamless and the host left great local recommendations.",
  },
  {
    avatar: null,
    name: "Sofia Martinez",
    date: "21 days ago",
    rating: 5,
    text: "Cozy, clean and exactly as described. Would absolutely stay here again on our next trip.",
  },
  {
    avatar: null,
    name: "Marcus Lee",
    date: "28 days ago",
    rating: 5,
    text: "Host was incredibly responsive and made sure we had everything we needed. The space felt like a real home, not just a rental.",
  },
  {
    avatar: null,
    name: "David Chen",
    date: "1 month ago",
    rating: 5,
    text: "One of the best stays we've had. Comfortable beds, a great kitchen, and a quiet street that made it easy to relax after long days out.",
  },
];

// Official Airbnb wordmark — shown for platform attribution only.
const AirbnbMark = React.memo(function AirbnbMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size * (320.1 / 99.9)} height={size} viewBox="0 0 320.1 99.9" fill="none" aria-hidden="true">
      <path
        fill="#FF385C"
        d="M168.7,25.1c0,3.6-2.9,6.5-6.5,6.5s-6.5-2.9-6.5-6.5s2.8-6.5,6.5-6.5C165.9,18.7,168.7,21.6,168.7,25.1z
	 M141.9,38.2c0,0.6,0,1.6,0,1.6s-3.1-4-9.7-4c-10.9,0-19.4,8.3-19.4,19.8c0,11.4,8.4,19.8,19.4,19.8c6.7,0,9.7-4.1,9.7-4.1v1.7
	c0,0.8,0.6,1.4,1.4,1.4h8.1V36.8c0,0-7.4,0-8.1,0C142.5,36.8,141.9,37.5,141.9,38.2z M141.9,62.3c-1.5,2.2-4.5,4.1-8.1,4.1
	c-6.4,0-11.3-4-11.3-10.8s4.9-10.8,11.3-10.8c3.5,0,6.7,2,8.1,4.1V62.3z M157.4,36.8h9.6v37.6h-9.6V36.8z M300.8,35.8
	c-6.6,0-9.7,4-9.7,4V18.7h-9.6v55.7c0,0,7.4,0,8.1,0c0.8,0,1.4-0.7,1.4-1.4v-1.7l0,0c0,0,3.1,4.1,9.7,4.1c10.9,0,19.4-8.4,19.4-19.8
	C320.1,44.2,311.6,35.8,300.8,35.8z M299.2,66.3c-3.7,0-6.6-1.9-8.1-4.1V48.8c1.5-2,4.7-4.1,8.1-4.1c6.4,0,11.3,4,11.3,10.8
	S305.6,66.3,299.2,66.3z M276.5,52.1v22.4h-9.6V53.2c0-6.2-2-8.7-7.4-8.7c-2.9,0-5.9,1.5-7.8,3.7v26.2h-9.6V36.8h7.6
	c0.8,0,1.4,0.7,1.4,1.4v1.6c2.8-2.9,6.5-4,10.2-4c4.2,0,7.7,1.2,10.5,3.6C275.2,42.2,276.5,45.8,276.5,52.1z M218.8,35.8
	c-6.6,0-9.7,4-9.7,4V18.7h-9.6v55.7c0,0,7.4,0,8.1,0c0.8,0,1.4-0.7,1.4-1.4v-1.7l0,0c0,0,3.1,4.1,9.7,4.1c10.9,0,19.4-8.4,19.4-19.8
	C238.2,44.2,229.7,35.8,218.8,35.8z M217.2,66.3c-3.7,0-6.6-1.9-8.1-4.1V48.8c1.5-2,4.7-4.1,8.1-4.1c6.4,0,11.3,4,11.3,10.8
	S223.6,66.3,217.2,66.3z M191.2,35.8c2.9,0,4.4,0.5,4.4,0.5v8.9c0,0-8-2.7-13,3v26.3h-9.6V36.8c0,0,7.4,0,8.1,0
	c0.8,0,1.4,0.7,1.4,1.4v1.6C184.3,37.7,188.2,35.8,191.2,35.8z M91.5,71c-0.5-1.2-1-2.5-1.5-3.6c-0.8-1.8-1.6-3.5-2.3-5.1l-0.1-0.1
	c-6.9-15-14.3-30.2-22.1-45.2l-0.3-0.6c-0.8-1.5-1.6-3.1-2.4-4.7c-1-1.8-2-3.7-3.6-5.5C56,2.2,51.4,0,46.5,0c-5,0-9.5,2.2-12.8,6
	c-1.5,1.8-2.6,3.7-3.6,5.5c-0.8,1.6-1.6,3.2-2.4,4.7l-0.3,0.6C19.7,31.8,12.2,47,5.3,62l-0.1,0.2c-0.7,1.6-1.5,3.3-2.3,5.1
	c-0.5,1.1-1,2.3-1.5,3.6c-1.3,3.7-1.7,7.2-1.2,10.8c1.1,7.5,6.1,13.8,13,16.6c2.6,1.1,5.3,1.6,8.1,1.6c0.8,0,1.8-0.1,2.6-0.2
	c3.3-0.4,6.7-1.5,10-3.4c4.1-2.3,8-5.6,12.4-10.4c4.4,4.8,8.4,8.1,12.4,10.4c3.3,1.9,6.7,3,10,3.4c0.8,0.1,1.8,0.2,2.6,0.2
	c2.8,0,5.6-0.5,8.1-1.6c7-2.8,11.9-9.2,13-16.6C93.2,78.2,92.8,74.7,91.5,71z M46.4,76.2c-5.4-6.8-8.9-13.2-10.1-18.6
	c-0.5-2.3-0.6-4.3-0.3-6.1c0.2-1.6,0.8-3,1.6-4.2c1.9-2.7,5.1-4.4,8.8-4.4c3.7,0,7,1.6,8.8,4.4c0.8,1.2,1.4,2.6,1.6,4.2
	c0.3,1.8,0.2,3.9-0.3,6.1C55.3,62.9,51.8,69.3,46.4,76.2z M86.3,80.9c-0.7,5.2-4.2,9.7-9.1,11.7c-2.4,1-5,1.3-7.6,1
	c-2.5-0.3-5-1.1-7.6-2.6c-3.6-2-7.2-5.1-11.4-9.7c6.6-8.1,10.6-15.5,12.1-22.1c0.7-3.1,0.8-5.9,0.5-8.5c-0.4-2.5-1.3-4.8-2.7-6.8
	c-3.1-4.5-8.3-7.1-14.1-7.1s-11,2.7-14.1,7.1c-1.4,2-2.3,4.3-2.7,6.8c-0.4,2.6-0.3,5.5,0.5,8.5c1.5,6.6,5.6,14.1,12.1,22.2
	c-4.1,4.6-7.8,7.7-11.4,9.7c-2.6,1.5-5.1,2.3-7.6,2.6c-2.7,0.3-5.3-0.1-7.6-1c-4.9-2-8.4-6.5-9.1-11.7c-0.3-2.5-0.1-5,0.9-7.8
	c0.3-1,0.8-2,1.3-3.2c0.7-1.6,1.5-3.3,2.3-5l0.1-0.2c6.9-14.9,14.3-30.1,22-44.9l0.3-0.6c0.8-1.5,1.6-3.1,2.4-4.6
	c0.8-1.6,1.7-3.1,2.8-4.4c2.1-2.4,4.9-3.7,8-3.7c3.1,0,5.9,1.3,8,3.7c1.1,1.3,2,2.8,2.8,4.4c0.8,1.5,1.6,3.1,2.4,4.6l0.3,0.6
	C67.7,34.8,75.1,50,82,64.9L82,65c0.8,1.6,1.5,3.4,2.3,5c0.5,1.2,1,2.2,1.3,3.2C86.4,75.8,86.7,78.3,86.3,80.9z"
      />
    </svg>
  );
});

function clampRating(r: number) {
  return Math.max(0, Math.min(5, r));
}

const STAR_PATH = "M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.7 5.9 21l1.5-6.8L2.2 9.5l6.9-.7L12 2.5z";

const StarRow = React.memo(function StarRow({
  rating,
  size = 14,
  filledColor = "#f5b800",
  emptyColor = "rgba(0,0,0,0.15)",
}: {
  rating: number;
  size?: number;
  filledColor?: string;
  emptyColor?: string;
}) {
  const uid = React.useId();

  const clamped = clampRating(rating);
  const fullStars = Math.floor(clamped);
  const fraction = clamped - fullStars;

  return (
    <div role="img" aria-label={`Rated ${clamped.toFixed(1)} out of 5 stars`} className="flex gap-0.5 leading-none">
      {Array.from({ length: 5 }).map((_, i) => {
        let fill: string;
        if (i < fullStars) fill = filledColor;
        else if (i === fullStars && fraction > 0) fill = `url(#${uid}-${i})`;
        else fill = emptyColor;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            {i === fullStars && fraction > 0 && (
              <defs>
                <linearGradient id={`${uid}-${i}`}>
                  <stop offset={`${fraction * 100}%`} stopColor={filledColor} />
                  <stop offset={`${fraction * 100}%`} stopColor={emptyColor} />
                </linearGradient>
              </defs>
            )}
            <path d={STAR_PATH} fill={fill} />
          </svg>
        );
      })}
    </div>
  );
});

function Avatar({ src, name, color, size = 44 }: { src?: string | null; name: string; color: string; size?: number }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name ? `${name}'s avatar` : ""} className="block shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
    );
  }
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.4, fontFamily: TOKENS.uiFontFamily }}
    >
      {initial}
    </div>
  );
}

export interface AirbnbReviewsProps extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  themeMode?: AirbnbReviewsThemeMode;
  accentColor?: string;
  customBackground?: string;
  customSurface?: string;
  customBorder?: string;
  customText?: string;
  customTextMuted?: string;
  badgeTitle?: string;
  overallRating?: number;
  reviewCount?: number;
  showHeader?: boolean;
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
  showArrows?: boolean;
  logoSize?: number;
  reviews?: AirbnbReviewItem[];
  cardsDesktop?: number;
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  gap?: number;
  sectionGap?: number;
  cardRadius?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingHorizontal?: number;
  titleFont?: AirbnbReviewsFontValue;
  reviewTextFont?: AirbnbReviewsFontValue;
  reviewerNameFont?: AirbnbReviewsFontValue;
  metaFont?: AirbnbReviewsFontValue;
  ctaFont?: AirbnbReviewsFontValue;
}

export function AirbnbReviews({
  themeMode = "dark",
  accentColor = "#FF385C",
  customBackground = "#f6f5fb",
  customSurface = "#ffffff",
  customBorder = "rgba(30,27,75,0.08)",
  customText = "#1e1b4b",
  customTextMuted = "rgba(30,27,75,0.55)",
  badgeTitle = "Airbnb Reviews",
  overallRating = 4.3,
  reviewCount = 191,
  showHeader = true,
  showCTA = true,
  ctaText = "Share your feedback",
  ctaLink = "",
  showArrows = true,
  logoSize = 22,
  reviews: reviewsProp = DEFAULT_REVIEWS,
  cardsDesktop = 3,
  autoPlay = true,
  autoPlaySpeed = 5,
  gap = TOKENS.gapDefault,
  sectionGap = 16,
  cardRadius = 20,
  paddingTop = 56,
  paddingBottom = 56,
  paddingHorizontal = 24,
  titleFont,
  reviewTextFont,
  reviewerNameFont,
  metaFont,
  ctaFont,
  className,
  style,
  ...props
}: AirbnbReviewsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const isMobile = containerWidth <= MOBILE_BREAKPOINT;
  const isTablet = !isMobile && containerWidth <= TABLET_BREAKPOINT;

  const cardsPerView = isMobile ? 1 : isTablet ? 2 : Math.max(2, Math.min(4, cardsDesktop));

  const reviews: AirbnbReviewItem[] = React.useMemo(
    () => (reviewsProp ?? []).map((r) => ({ avatar: r.avatar ?? null, name: r.name ?? "", date: r.date ?? "", rating: r.rating ?? 5, text: r.text ?? "" })),
    [reviewsProp],
  );

  const totalPages = Math.max(1, Math.ceil(reviews.length / cardsPerView));
  const [page, setPage] = React.useState(0);
  React.useEffect(() => {
    if (page > totalPages - 1) setPage(0);
  }, [totalPages, page]);

  const [isHovering, setIsHovering] = React.useState(false);
  const [drag, setDrag] = React.useState<{ startX: number; deltaX: number } | null>(null);
  const dragRef = React.useRef<{ startX: number; deltaX: number } | null>(null);

  const isLight = themeMode === "light";
  const isCustom = themeMode === "custom";
  const useLightChrome = themeMode !== "dark";
  const starEmptyColor = isCustom ? "rgba(128,128,128,0.35)" : isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.25)";

  const bg = isCustom ? customBackground : isLight ? "#f5f5f5" : TOKENS.ink;
  const headerBg = isCustom ? customSurface : isLight ? "#ffffff" : "rgba(255,255,255,0.05)";
  const cardBg = isCustom ? customSurface : isLight ? "#ffffff" : "rgba(255,255,255,0.05)";
  const cardBorder = isCustom ? customBorder : isLight ? "rgba(30,27,75,0.06)" : TOKENS.glassBorderSoft;
  const fg = isCustom ? customText : isLight ? "#1e1b4b" : "#ffffff";
  const fgSubtle = isCustom ? customTextMuted : isLight ? "rgba(30,27,75,0.55)" : "rgba(255,255,255,0.55)";
  const navBg = isCustom ? customSurface : isLight ? "#ffffff" : "rgba(255,255,255,0.08)";
  const navBorder = isCustom ? customBorder : isLight ? "rgba(30,27,75,0.1)" : TOKENS.glassBorderSoft;

  const titleStyle: React.CSSProperties = React.useMemo(
    () => ({ fontFamily: TOKENS.uiFontFamily, fontWeight: 700, letterSpacing: "-0.01em", color: fg, margin: 0, ...titleFont, fontSize: titleFont?.fontSize ?? (isMobile ? 20 : 24) }),
    [titleFont, fg, isMobile],
  );

  const reviewTextStyle: React.CSSProperties = React.useMemo(
    () => ({ fontFamily: TOKENS.uiFontFamily, fontWeight: 400, lineHeight: 1.6, color: fg, ...reviewTextFont, fontSize: reviewTextFont?.fontSize ?? 14.5 }),
    [reviewTextFont, fg],
  );

  const reviewTextMinHeight = React.useMemo(() => {
    const fontSize = parseFloat(String(reviewTextStyle.fontSize)) || 14.5;
    const lineHeightRaw = reviewTextStyle.lineHeight;
    const lineHeight = typeof lineHeightRaw === "number" ? lineHeightRaw : parseFloat(String(lineHeightRaw)) || 1.6;
    return fontSize * lineHeight * 4;
  }, [reviewTextStyle]);

  const reviewerNameStyle: React.CSSProperties = React.useMemo(
    () => ({ fontFamily: TOKENS.uiFontFamily, fontWeight: 600, color: fg, ...reviewerNameFont, fontSize: reviewerNameFont?.fontSize ?? 14, lineHeight: reviewerNameFont?.lineHeight ?? 1.4 }),
    [reviewerNameFont, fg],
  );

  const metaStyle: React.CSSProperties = React.useMemo(
    () => ({ fontFamily: TOKENS.uiFontFamily, fontWeight: 400, color: fgSubtle, ...metaFont, fontSize: metaFont?.fontSize ?? 13 }),
    [metaFont, fgSubtle],
  );

  const ctaStyle: React.CSSProperties = React.useMemo(() => ({ fontFamily: TOKENS.uiFontFamily, fontWeight: 600, color: "#ffffff", ...ctaFont, fontSize: ctaFont?.fontSize ?? 14 }), [ctaFont]);

  const goTo = React.useCallback((next: number) => setPage(((next % totalPages) + totalPages) % totalPages), [totalPages]);

  // Autoplay — paused on hover/drag.
  React.useEffect(() => {
    if (!autoPlay || isHovering || drag || totalPages <= 1) return;
    const id = setInterval(() => setPage((p) => (p + 1) % totalPages), Math.max(2, autoPlaySpeed) * 1000);
    return () => clearInterval(id);
  }, [autoPlay, isHovering, drag, totalPages, autoPlaySpeed]);

  // Drag-to-swipe — uses Pointer Capture on the track itself so move/up
  // events keep firing even outside its bounds, with no window listeners.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const next = { startX: e.clientX, deltaX: 0 };
    dragRef.current = next;
    setDrag(next);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const next = { startX: d.startX, deltaX: e.clientX - d.startX };
    dragRef.current = next;
    setDrag(next);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (d && containerWidth > 0) {
      const threshold = containerWidth * 0.12;
      if (d.deltaX < -threshold) goTo(page + 1);
      else if (d.deltaX > threshold) goTo(page - 1);
    }
    dragRef.current = null;
    setDrag(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const dragPercent = drag && containerWidth > 0 ? (drag.deltaX / containerWidth) * 100 : 0;
  const translate = -(page * 100) + dragPercent;

  // Pushes the arrows further out over the card edges when there's room in
  // the side padding, but never far enough to overflow the section.
  const arrowOffset = -Math.min(16, Math.max(paddingHorizontal - 4, 0));

  return (
    <section
      ref={containerRef}
      aria-label={badgeTitle || "Customer reviews"}
      itemScope
      itemType="https://schema.org/Organization"
      className={cn("relative box-border flex w-full flex-col", className)}
      style={{
        background: bg,
        paddingTop: isMobile ? Math.max(paddingTop - 16, 24) : paddingTop,
        paddingBottom: isMobile ? Math.max(paddingBottom - 16, 24) : paddingBottom,
        paddingLeft: isMobile ? 16 : paddingHorizontal,
        paddingRight: isMobile ? 16 : paddingHorizontal,
        fontFamily: TOKENS.uiFontFamily,
        gap: isMobile ? Math.max(sectionGap - 8, 12) : sectionGap,
        ...style,
      }}
      {...props}
    >
      {showHeader && (
        <div
          className="box-border flex flex-col items-start justify-between gap-4"
          style={{ flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", background: headerBg, borderRadius: cardRadius, padding: isMobile ? "20px 20px" : "24px 28px" }}
        >
          <div>
            <div className="mb-2.5 flex items-center gap-2.5">
              <AirbnbMark size={isMobile ? Math.min(logoSize, 20) : logoSize} />
              <h2 style={titleStyle} itemProp="name">
                {badgeTitle}
              </h2>
            </div>
            <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating" className="flex items-center gap-2.5">
              <span itemProp="ratingValue" className="text-xl font-bold" style={{ color: fg }}>
                {overallRating.toFixed(1)}
              </span>
              <StarRow rating={overallRating} size={18} emptyColor={starEmptyColor} />
              <span style={metaStyle}>{reviewCount.toLocaleString()} reviews</span>
              <meta itemProp="reviewCount" content={String(reviewCount)} />
              <meta itemProp="bestRating" content="5" />
            </div>
          </div>

          {showCTA &&
            ctaText &&
            (ctaLink ? (
              <a
                href={ctaLink}
                className="box-border inline-flex cursor-pointer items-center justify-center rounded-full whitespace-nowrap no-underline"
                style={{ width: isMobile ? "100%" : "auto", padding: "12px 24px", background: accentColor, flexShrink: 0, ...ctaStyle }}
              >
                {ctaText}
              </a>
            ) : (
              <button
                type="button"
                className="box-border inline-flex cursor-pointer items-center justify-center rounded-full border-none whitespace-nowrap"
                style={{ width: isMobile ? "100%" : "auto", padding: "12px 24px", background: accentColor, flexShrink: 0, ...ctaStyle }}
              >
                {ctaText}
              </button>
            ))}
        </div>
      )}

      <div className="relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        <div className="overflow-hidden">
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="flex touch-pan-y"
            style={{ width: `${totalPages * 100}%`, transform: `translateX(${translate / totalPages}%)`, transition: drag ? "none" : "transform 0.45s cubic-bezier(0.22,1,0.36,1)", cursor: drag ? "grabbing" : "grab" }}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div key={pageIndex} className="box-border grid shrink-0 items-stretch" style={{ width: `${100 / totalPages}%`, gridTemplateColumns: `repeat(${cardsPerView}, 1fr)`, gap }}>
                {reviews.slice(pageIndex * cardsPerView, pageIndex * cardsPerView + cardsPerView).map((review, i) => {
                  const idx = pageIndex * cardsPerView + i;
                  return (
                    <article
                      key={idx}
                      aria-label={`Review by ${review.name || "Anonymous"}`}
                      itemProp="review"
                      itemScope
                      itemType="https://schema.org/Review"
                      className="box-border flex h-full flex-col"
                      style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: cardRadius, padding: isMobile ? 20 : 24, minHeight: 200 }}
                    >
                      <span itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                        <StarRow rating={review.rating} size={15} emptyColor={starEmptyColor} />
                        <meta itemProp="ratingValue" content={String(review.rating)} />
                        <meta itemProp="bestRating" content="5" />
                      </span>
                      <p itemProp="reviewBody" className="mb-0 line-clamp-4" style={{ ...reviewTextStyle, marginTop: 14, minHeight: reviewTextMinHeight }}>
                        {review.text}
                      </p>
                      <div className="flex items-center gap-3 border-t" style={{ marginTop: 18, paddingTop: 16, borderColor: cardBorder }}>
                        <Avatar src={review.avatar} name={review.name} color={AVATAR_PALETTE[idx % AVATAR_PALETTE.length]} />
                        <div itemProp="author" itemScope itemType="https://schema.org/Person" className="min-w-0">
                          <div itemProp="name" className="truncate" style={reviewerNameStyle}>
                            {review.name}
                          </div>
                          <div className="mt-1" style={metaStyle}>
                            {review.date}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {totalPages > 1 && showArrows && !isMobile && (
          <>
            <button
              type="button"
              aria-label="Previous reviews"
              onClick={() => goTo(page - 1)}
              className="absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full"
              style={{ left: arrowOffset, background: navBg, border: `1px solid ${navBorder}`, boxShadow: useLightChrome ? "0 2px 10px rgba(30,27,75,0.08)" : "none" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next reviews"
              onClick={() => goTo(page + 1)}
              className="absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full"
              style={{ right: arrowOffset, background: navBg, border: `1px solid ${navBorder}`, boxShadow: useLightChrome ? "0 2px 10px rgba(30,27,75,0.08)" : "none" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to page ${i + 1}`}
              aria-current={i === page ? "true" : undefined}
              onClick={() => goTo(i)}
              className="block h-2 rounded-full border-none p-0 transition-all duration-300"
              style={{ width: i === page ? 20 : 8, background: i === page ? accentColor : cardBorder }}
            />
          ))}
        </div>
      )}

    </section>
  );
}
