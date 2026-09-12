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

export type EtsyReviewsThemeMode = "light" | "dark" | "custom";

export interface EtsyReviewItem {
  avatar?: string | null;
  name: string;
  date: string;
  rating: number;
  text: string;
}

export interface EtsyReviewsFontValue {
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  fontSize?: number | string;
  lineHeight?: number | string;
  letterSpacing?: number | string;
}

const DEFAULT_REVIEWS: EtsyReviewItem[] = [
  {
    avatar: null,
    name: "Emma Wilson",
    date: "7 days ago",
    rating: 5,
    text: "Beautiful piece, exactly as pictured! Shipping was fast and the packaging was so thoughtful. Highly recommend this shop!",
  },
  {
    avatar: null,
    name: "Grace Miller",
    date: "21 days ago",
    rating: 5,
    text: "I've ordered from this shop a few times now and I'm always impressed. The quality is consistently excellent, the seller communicates quickly, and every order feels handmade with care.",
  },
  {
    avatar: null,
    name: "Sofia Martinez",
    date: "21 days ago",
    rating: 5,
    text: "Much better than I expected. Great craftsmanship and reasonable prices.",
  },
  {
    avatar: null,
    name: "Marcus Lee",
    date: "28 days ago",
    rating: 5,
    text: "Lovely item from start to finish. Customer service was great too, cant say enough good things about this seller.",
  },
  {
    avatar: null,
    name: "David Chen",
    date: "1 month ago",
    rating: 5,
    text: "I left with a very positive impression overall. From ordering to delivery, the experience felt smooth, well organized, and easy to follow every step of the way.",
  },
];

// Official Etsy wordmark — shown for platform attribution only.
function EtsyMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size * 2} height={size} viewBox="0 0 48 24" fill="none" aria-hidden="true">
      <path
        fill="#F45800"
        d="M6.54681 3.125V9.133C6.54681 9.133 8.66381 9.133 9.79681 9.047C10.6878 8.891 10.8518 8.805 11.0158 7.914L11.3438 6.609H12.3128L12.1488 9.461L12.2348 12.383H11.2578L11.0158 11.242C10.7738 10.43 10.4458 10.265 9.79681 10.187C8.98481 10.101 6.54681 10.101 6.54681 10.101V15.14C6.54681 16.109 7.03881 16.523 8.17181 16.523H11.5858C12.6408 16.523 13.6948 16.437 14.3518 14.898L15.2348 12.945H16.0548C15.9688 13.351 15.5628 16.929 15.4848 17.734C15.4848 17.734 12.3988 17.656 11.1018 17.656H5.24981L1.75781 17.734V16.851L2.89081 16.601C3.71081 16.437 3.95281 16.195 3.95281 15.546C3.95281 15.546 4.03881 13.351 4.03881 9.694C4.03881 6.046 3.95281 3.85 3.95281 3.85C3.95281 3.123 3.71081 2.959 2.89081 2.795L1.75781 2.555V1.664L5.17181 1.734H11.6718C12.9688 1.734 15.1558 1.5 15.1558 1.5C15.1558 1.5 15.0778 2.875 14.9918 6.125H14.1008L13.7728 4.984C13.4528 3.523 12.9678 2.796 12.0698 2.796H6.96081C6.54681 2.797 6.54681 2.875 6.54681 3.125ZM19.7028 3.766H20.6798V7.18L24.0158 7.016L23.8518 8.563L20.6018 8.313V14.329C20.6018 16.032 21.1718 16.688 22.1488 16.688C23.0318 16.688 23.6878 16.196 23.9298 15.79L24.4138 16.36C23.9298 17.493 22.5548 18.063 21.2498 18.063C19.6328 18.063 18.3198 17.094 18.3198 15.227V8.398H16.3818V7.586C18.0078 7.422 19.2188 6.445 19.7028 3.766ZM26.6948 14.242L27.3428 15.789C27.5848 16.437 28.1548 17.094 29.4518 17.094C30.8348 17.094 31.4048 16.36 31.4048 15.469C31.4048 12.703 25.9598 13.516 25.9598 9.781C25.9598 7.672 27.6628 6.687 29.8578 6.687C30.8348 6.687 32.2958 6.851 33.0298 7.179C32.8658 7.991 32.7798 9.046 32.7798 9.859L31.9748 9.937L31.4048 8.312C31.2408 7.914 30.5848 7.585 29.7798 7.585C28.8028 7.585 27.8268 7.991 27.8268 9.046C27.8268 11.562 33.4358 10.999 33.4358 14.734C33.4358 16.851 31.5688 17.984 29.2878 17.984C27.5848 17.984 25.8738 17.328 25.8738 17.328C26.0378 16.359 25.9598 15.305 25.8738 14.242H26.6948ZM33.0308 22.039C33.2728 21.148 33.4368 20.016 33.6008 18.953L34.4918 18.875L34.8198 20.578C34.8978 20.984 35.1398 21.312 35.7888 21.312C36.8438 21.312 38.2268 20.664 39.5308 18.39C38.9528 17.007 37.2498 12.546 35.7028 9.132C35.2968 8.234 35.2188 8.155 34.6558 7.991L34.2418 7.835V7.015L36.6868 7.101L39.6868 6.937V7.75L38.9528 7.914C38.3828 7.992 38.1478 8.312 38.1478 8.641C38.1478 8.727 38.1478 8.805 38.2258 8.969C38.3818 9.461 39.6868 13.11 40.6638 15.547C41.4688 13.844 43.0158 10.024 43.2578 9.375C43.3438 9.047 43.4218 8.969 43.4218 8.727C43.4218 8.313 43.1798 8.071 42.6168 7.915L42.0388 7.75V6.938L44.3198 7.016L46.4288 6.938V7.75L46.0228 8.07C45.2108 8.398 45.1248 8.476 44.8038 9.132L41.2338 17.491C39.1168 22.288 36.9218 22.694 35.3818 22.694C34.4058 22.695 33.6718 22.445 33.0308 22.039Z"
      />
    </svg>
  );
}

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

export interface EtsyReviewsProps extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  themeMode?: EtsyReviewsThemeMode;
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
  reviews?: EtsyReviewItem[];
  cardsDesktop?: number;
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  gap?: number;
  sectionGap?: number;
  cardRadius?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingHorizontal?: number;
  titleFont?: EtsyReviewsFontValue;
  reviewTextFont?: EtsyReviewsFontValue;
  reviewerNameFont?: EtsyReviewsFontValue;
  metaFont?: EtsyReviewsFontValue;
  ctaFont?: EtsyReviewsFontValue;
}

export function EtsyReviews({
  themeMode = "dark",
  accentColor = "#F45800",
  customBackground = "#f6f5fb",
  customSurface = "#ffffff",
  customBorder = "rgba(30,27,75,0.08)",
  customText = "#1e1b4b",
  customTextMuted = "rgba(30,27,75,0.55)",
  badgeTitle = "Etsy Reviews",
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
}: EtsyReviewsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const isMobile = containerWidth <= MOBILE_BREAKPOINT;
  const isTablet = !isMobile && containerWidth <= TABLET_BREAKPOINT;

  const cardsPerView = isMobile ? 1 : isTablet ? 2 : Math.max(2, Math.min(4, cardsDesktop));

  const reviews: EtsyReviewItem[] = React.useMemo(
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
              <EtsyMark size={isMobile ? Math.min(logoSize, 20) : logoSize} />
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
