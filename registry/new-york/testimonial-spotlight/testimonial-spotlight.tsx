"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TestimonialSpotlightItem {
  image: string;
  name: string;
  role?: string;
  quote: string;
  rating?: number;
}

export type TestimonialSpotlightTransition = "crossfade" | "slide" | "iris";

export interface TestimonialSpotlightProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  reviews?: TestimonialSpotlightItem[];
  sectionLabel?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  overlayStrength?: number;
  transitionType?: TestimonialSpotlightTransition;
  showQuotePrefix?: boolean;
  showCounter?: boolean;
  showRating?: boolean;
  starColor?: string;
  borderRadius?: number;
}

const STAR_INDICES = [0, 1, 2, 3, 4];

const DEFAULT_REVIEWS: TestimonialSpotlightItem[] = [
  {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    name: "James Harrington",
    role: "Founder, Vertex Studio",
    quote: "They work at full speed without losing form. Watching our vision come to life this fast, with this much precision, was something I didn't expect.",
    rating: 5,
  },
  {
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&q=80",
    name: "Elena Marsh",
    role: "Head of Product, Drift Labs",
    quote: "Steady, silent, unstoppable. Not a word wasted, not a move without purpose, just clean momentum toward the finish.",
    rating: 5,
  },
  {
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&q=80",
    name: "David Kolbe",
    role: "Creative Director, Altitude Brand",
    quote: "They carved through every challenge like it wasn't there. Sharp instincts, decisive execution, they made it look effortless.",
    rating: 5,
  },
];

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = React.useState(900);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

export function TestimonialSpotlight({
  reviews = DEFAULT_REVIEWS,
  sectionLabel = "Reviews",
  autoPlay = false,
  autoPlayInterval = 4,
  overlayStrength = 0.55,
  transitionType = "crossfade",
  showQuotePrefix = true,
  showCounter = true,
  showRating = true,
  starColor = "#FFD700",
  borderRadius = 0,
  className,
  ...props
}: TestimonialSpotlightProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const isMobile = containerWidth <= 768;
  const count = reviews.length;

  const [active, setActive] = React.useState(0);
  const [transitioning, setTransitioning] = React.useState(false);
  const [transDir, setTransDir] = React.useState<1 | -1>(1);
  const [outgoing, setOutgoing] = React.useState<number | null>(null);
  const [incoming, setIncoming] = React.useState<number | null>(null);
  const [slideReady, setSlideReady] = React.useState(false);
  const slideRafRef = React.useRef<number>(0);
  const slideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const DURATION = transitionType === "crossfade" ? 700 : transitionType === "slide" ? 500 : 600;

  React.useLayoutEffect(() => {
    if (!transitioning || slideReady || outgoing === null || incoming === null) return;
    slideRafRef.current = requestAnimationFrame(() => {
      setActive(incoming);
      setSlideReady(true);
      slideTimerRef.current = setTimeout(() => {
        setOutgoing(null);
        setIncoming(null);
        setSlideReady(false);
        setTransitioning(false);
      }, DURATION);
    });
    return () => {
      cancelAnimationFrame(slideRafRef.current);
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    };
  }, [transitioning, slideReady, outgoing, incoming, DURATION]);

  const goTo = React.useCallback(
    (idx: number, dir?: 1 | -1) => {
      if (transitioning || idx === active) return;
      const direction = dir ?? (idx > active ? 1 : -1);
      setTransDir(direction);
      setTransitioning(true);
      if (transitionType === "slide") {
        setOutgoing(active);
        setIncoming(idx);
        setSlideReady(false);
      } else {
        fadeTimerRef.current = setTimeout(() => {
          setActive(idx);
          setTransitioning(false);
        }, DURATION);
      }
    },
    [transitioning, active, DURATION, transitionType],
  );

  const prev = React.useCallback(() => goTo((active - 1 + count) % count, -1), [active, count, goTo]);
  const next = React.useCallback(() => goTo((active + 1) % count, 1), [active, count, goTo]);

  React.useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (!autoPlay || count < 2) return;
    const id = setInterval(next, autoPlayInterval * 1000);
    return () => clearInterval(id);
  }, [autoPlay, autoPlayInterval, next, count]);

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    },
    [prev, next],
  );

  const touchStartX = React.useRef(0);
  const touchStartY = React.useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else prev();
  };

  const review = reviews[Math.min(active, count - 1)];
  const padH = isMobile ? 20 : 40;
  const padBottom = isMobile ? 20 : 44;
  const topPad = isMobile ? 20 : 28;
  const quoteSize = isMobile ? 22 : 38;
  const thumbnailSize = isMobile ? 40 : 36;

  const getLayerStyle = (i: number): React.CSSProperties => {
    const isActive = i === active;

    if (transitionType === "slide") {
      if (!transitioning) {
        return { position: "absolute", inset: 0, transform: isActive ? "translateX(0%)" : "translateX(100%)", opacity: isActive ? 1 : 0, transition: "none" };
      }
      if (!slideReady) {
        if (i === outgoing) return { position: "absolute", inset: 0, transform: "translateX(0%)", opacity: 1, transition: "none" };
        if (i === incoming) return { position: "absolute", inset: 0, transform: `translateX(${transDir * 100}%)`, opacity: 1, transition: "none" };
        return { position: "absolute", inset: 0, opacity: 0, transition: "none" };
      }
      if (i === outgoing) return { position: "absolute", inset: 0, transform: `translateX(${-transDir * 100}%)`, opacity: 1, transition: `transform ${DURATION}ms cubic-bezier(0.77,0,0.175,1)` };
      if (isActive) return { position: "absolute", inset: 0, transform: "translateX(0%)", opacity: 1, transition: `transform ${DURATION}ms cubic-bezier(0.77,0,0.175,1)` };
      return { position: "absolute", inset: 0, opacity: 0, transition: "none" };
    }

    if (transitionType === "iris") {
      return {
        position: "absolute",
        inset: 0,
        opacity: isActive ? 1 : 0,
        clipPath: isActive ? (transitioning ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)") : "circle(150% at 50% 50%)",
        transition: isActive ? `clip-path ${DURATION}ms cubic-bezier(0.4,0,0.2,1), opacity 0ms` : "opacity 0ms",
      };
    }

    return { position: "absolute", inset: 0, opacity: isActive ? (transitioning ? 0 : 1) : 0, transition: `opacity ${DURATION}ms ease` };
  };

  if (count === 0) return null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={cn("relative flex h-full w-full flex-col overflow-hidden bg-[#0a0a0a] outline-none", className)}
      style={{ borderRadius }}
      {...props}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {reviews.map((r, i) => (
          <div key={i} style={getLayerStyle(i)}>
            <img src={r.image} alt="" className="block h-full w-full object-cover" />
          </div>
        ))}

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,${overlayStrength * 0.4}) 0%, transparent 30%, transparent 45%, rgba(0,0,0,${overlayStrength * 0.7}) 70%, rgba(0,0,0,${overlayStrength + 0.2}) 100%)`,
          }}
        />

        <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between" style={{ padding: `${topPad}px ${padH}px` }}>
          <span className="uppercase text-white/50" style={{ fontSize: isMobile ? 11 : 12, letterSpacing: "0.35em", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            {sectionLabel}
          </span>
          {showCounter && (
            <span className="text-white/40 tabular-nums" style={{ fontSize: isMobile ? 10 : 11, letterSpacing: "0.1em", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              {String(active + 1).padStart(2, "0")} — {String(count).padStart(2, "0")}
            </span>
          )}
        </div>

        <div className="absolute z-10 flex gap-1.5" style={{ top: isMobile ? 56 : 72, left: padH, right: padH }}>
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to review ${i + 1}`}
              onClick={() => goTo(i)}
              className="h-px flex-1 cursor-pointer border-0 p-0 transition-colors duration-[400ms]"
              style={{ background: i === active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)" }}
            />
          ))}
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-10 flex flex-col" style={{ padding: `0 ${padH}px ${padBottom}px` }}>
          {showRating && (
            <div
              key={`stars-${active}`}
              className="flex gap-1"
              style={{ marginBottom: isMobile ? 8 : 12, opacity: transitioning ? 0 : 1, transform: transitioning ? "translateY(8px)" : "translateY(0)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
            >
              {STAR_INDICES.map((s) => (
                <svg key={s} width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5L9.545 5.91L14.196 6.09L10.554 8.84L11.804 13.34L8 10.79L4.196 13.34L5.446 8.84L1.804 6.09L6.455 5.91L8 1.5Z" fill={s < (review.rating ?? 0) ? starColor : "rgba(255,255,255,0.2)"} />
                </svg>
              ))}
            </div>
          )}

          <div
            key={`meta-${active}`}
            className="flex flex-wrap items-baseline gap-3"
            style={{ marginBottom: isMobile ? 12 : 20, opacity: transitioning ? 0 : 1, transform: transitioning ? "translateY(8px)" : "translateY(0)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
          >
            <span className="font-semibold text-white" style={{ fontSize: isMobile ? 12 : 14, letterSpacing: "0.02em", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              {review.name}
            </span>
            {review.role && (
              <>
                <span className="text-[11px] text-white/25">—</span>
                <span className="text-white/50" style={{ fontSize: isMobile ? 10 : 14, letterSpacing: "0.05em", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                  {review.role}
                </span>
              </>
            )}
          </div>

          <div
            key={`quote-${active}`}
            className="tracking-tight text-white"
            style={{
              fontSize: quoteSize,
              maxWidth: isMobile ? "100%" : "72%",
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "translateY(12px)" : "translateY(0)",
              lineHeight: 1.2,
              fontFamily: "'Georgia', serif",
              transition: "opacity 0.5s 0.05s ease, transform 0.5s 0.05s ease",
            }}
          >
            {showQuotePrefix ? `"${review.quote}"` : review.quote}
          </div>

          <div className={cn("mt-8 flex items-center", isMobile && "mt-4 flex-col items-start")} style={{ gap: isMobile ? 12 : 8 }}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={prev}
                className="flex shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20"
                style={{ width: isMobile ? 38 : 44, height: isMobile ? 38 : 44, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", transition: "background 0.2s ease" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7L9 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={next}
                className="flex shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/90 hover:bg-white"
                style={{ width: isMobile ? 38 : 44, height: isMobile ? 38 : 44, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", transition: "background 0.2s ease" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2L10 7L5 12" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="scrollbar-none flex gap-1.5 overflow-x-auto" style={{ marginLeft: isMobile ? 0 : 12 }}>
              {reviews.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Preview review ${i + 1}`}
                  onClick={() => goTo(i)}
                  className="shrink-0 overflow-hidden rounded-lg border-0 p-0"
                  style={{
                    width: thumbnailSize,
                    height: thumbnailSize,
                    opacity: i === active ? 1 : 0.35,
                    boxShadow: i === active ? "inset 0 0 0 1.5px rgba(255,255,255,0.85)" : "none",
                    transition: "opacity 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <img src={r.image} alt="" className="block h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
