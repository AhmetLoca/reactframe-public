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

export type EbayReviewsThemeMode = "light" | "dark" | "custom";

export interface EbayReviewItem {
  avatar?: string | null;
  name: string;
  date: string;
  rating: number;
  text: string;
}

export interface EbayReviewsFontValue {
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  fontSize?: number | string;
  lineHeight?: number | string;
  letterSpacing?: number | string;
}

const DEFAULT_REVIEWS: EbayReviewItem[] = [
  {
    avatar: null,
    name: "Emma Wilson",
    date: "7 days ago",
    rating: 5,
    text: "Item arrived exactly as described and much faster than expected. Great communication from the seller throughout.",
  },
  {
    avatar: null,
    name: "Grace Miller",
    date: "21 days ago",
    rating: 5,
    text: "I've bought from this seller a few times now and I'm always impressed. Packaging is careful, shipping is fast, and everything matches the listing photos.",
  },
  {
    avatar: null,
    name: "Sofia Martinez",
    date: "21 days ago",
    rating: 5,
    text: "Much better than I expected. Great condition and reasonable price.",
  },
  {
    avatar: null,
    name: "Marcus Lee",
    date: "28 days ago",
    rating: 5,
    text: "Smooth transaction from start to finish. Support was responsive too, cant say enough good things about this seller.",
  },
  {
    avatar: null,
    name: "David Chen",
    date: "1 month ago",
    rating: 5,
    text: "I left with a very positive impression overall. From bidding to delivery, the experience felt smooth, well organized, and easy to follow every step of the way.",
  },
];

// Official eBay wordmark — shown for platform attribution only.
const EbayMark = React.memo(function EbayMark({ size = 22 }: { size?: number }) {
  const uid = React.useId();

  return (
    <svg width={size * (1000 / 401)} height={size} viewBox="0 0 1000 401" fill="none" aria-hidden="true">
      <g clipPath={`url(#clip0_${uid})`}>
        <path
          fill="#FFBC13"
          d="M633.078 212.532C587.64 214.022 559.407 222.221 559.407 252.151C559.407 271.527 574.854 292.533 614.07 292.533C666.647 292.533 694.713 263.874 694.713 216.87L694.716 211.7C676.283 211.7 653.551 211.861 633.078 212.532ZM744.829 274.635C744.829 289.218 745.251 303.613 746.523 316.576H699.909C698.666 305.902 698.212 295.296 698.212 285.009C673.01 315.989 643.035 324.895 601.451 324.895C539.774 324.895 506.75 292.295 506.75 254.588C506.75 199.976 551.666 180.72 629.64 178.934C650.963 178.447 674.914 178.375 694.715 178.375L694.712 173.039C694.712 136.478 671.269 121.445 630.645 121.445C600.486 121.445 578.259 133.926 575.968 155.492H523.317C528.889 101.721 585.383 88.1211 635.057 88.1211C694.565 88.1211 744.829 109.294 744.829 172.236L744.829 274.635Z"
        />
        <path
          fill="#F12C2D"
          d="M199.636 185.865C197.692 138.988 163.857 121.445 127.695 121.445C88.7007 121.445 57.5683 141.178 52.1147 185.865H199.636ZM51.0344 219.19C53.7387 264.674 85.1042 291.574 128.232 291.574C158.112 291.574 184.692 279.399 193.591 252.914H245.276C235.224 306.654 178.122 324.895 128.973 324.895C39.6064 324.895 0 275.678 0 209.306C0 136.241 40.9656 88.1211 129.788 88.1211C200.487 88.1211 252.288 125.12 252.288 205.877V219.19H51.0344Z"
        />
        <path
          fill="#0968F6"
          d="M380.832 290.624C427.405 290.624 459.273 257.102 459.273 206.515C459.273 155.933 427.405 122.406 380.832 122.406C334.522 122.406 302.388 155.933 302.388 206.515C302.388 257.102 334.522 290.624 380.832 290.624ZM252.286 0H302.388L302.383 125.877C326.94 96.6173 360.772 88.1219 394.073 88.1219C449.908 88.1219 511.924 125.799 511.924 207.151C511.924 275.273 462.603 324.895 393.143 324.895C356.786 324.895 322.563 311.853 301.457 286.013C301.457 296.334 300.881 306.736 299.752 316.577H250.58C251.435 300.667 252.286 280.858 252.286 264.83L252.286 0Z"
        />
        <path
          fill="#93C822"
          d="M1000 96.457L845.056 400.751H788.95L833.496 316.255L716.891 96.457H775.517L861.322 268.188L946.885 96.457H1000Z"
        />
      </g>
      <defs>
        <clipPath id={`clip0_${uid}`}>
          <rect width="1000" height="400.751" fill="white" />
        </clipPath>
      </defs>
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

export interface EbayReviewsProps extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  themeMode?: EbayReviewsThemeMode;
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
  reviews?: EbayReviewItem[];
  cardsDesktop?: number;
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  gap?: number;
  sectionGap?: number;
  cardRadius?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingHorizontal?: number;
  titleFont?: EbayReviewsFontValue;
  reviewTextFont?: EbayReviewsFontValue;
  reviewerNameFont?: EbayReviewsFontValue;
  metaFont?: EbayReviewsFontValue;
  ctaFont?: EbayReviewsFontValue;
}

export function EbayReviews({
  themeMode = "dark",
  accentColor = "#0968F6",
  customBackground = "#f6f5fb",
  customSurface = "#ffffff",
  customBorder = "rgba(30,27,75,0.08)",
  customText = "#1e1b4b",
  customTextMuted = "rgba(30,27,75,0.55)",
  badgeTitle = "eBay Reviews",
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
}: EbayReviewsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const isMobile = containerWidth <= MOBILE_BREAKPOINT;
  const isTablet = !isMobile && containerWidth <= TABLET_BREAKPOINT;

  const cardsPerView = isMobile ? 1 : isTablet ? 2 : Math.max(2, Math.min(4, cardsDesktop));

  const reviews: EbayReviewItem[] = React.useMemo(
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
              <EbayMark size={isMobile ? Math.min(logoSize, 20) : logoSize} />
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
