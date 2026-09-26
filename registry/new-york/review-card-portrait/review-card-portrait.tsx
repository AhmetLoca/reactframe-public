"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ReviewCardPortraitItem {
  src: string;
  name?: string;
  role?: string;
  quote?: string;
}

export interface ReviewCardPortraitProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  /** Business or product these reviews are about, named in the schema.org Review markup search engines read. */
  reviewSubject?: string;
  reviews?: ReviewCardPortraitItem[];
  theme?: "light" | "dark";
  sectionLabel?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const DEFAULT_REVIEWS: ReviewCardPortraitItem[] = [
  {
    src: "/demo/49.webp",
    name: "Elena Marsh",
    role: "Product Designer",
    quote: "Shipped in weeks, not months.",
  },
  {
    src: "/demo/50.webp",
    name: "Daniel Ruiz",
    role: "Founder, Northwind",
    quote: "Clear from day one.",
  },
  {
    src: "/demo/51.webp",
    name: "Priya Nair",
    role: "Head of Marketing",
    quote: "Conversion jumped fast.",
  },
];

/**
 * ReviewCardPortrait — a portrait-format testimonial card with a
 * crossfading top image strip, thumbnail selector, and animated quote text.
 */
export function ReviewCardPortrait({
  reviewSubject,
  className,
  reviews = DEFAULT_REVIEWS,
  theme = "light",
  sectionLabel = "Reviews",
  autoPlay = false,
  autoPlayInterval = 5,
  ...props
}: ReviewCardPortraitProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const fadeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const safeReviews = (reviews || []).filter((r) => r.src);
  const count = safeReviews.length;

  const [active, setActive] = React.useState(0);
  const [fading, setFading] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [navFocus, setNavFocus] = React.useState<"prev" | "next" | null>(null);
  const [paused, setPaused] = React.useState(false);
  const [hoverPaused, setHoverPaused] = React.useState(false);

  const isDark = theme === "dark";
  const bg = isDark ? "#0a0a0a" : "#ffffff";
  const textPrimary = isDark ? "#ffffff" : "#0a0a0a";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.55)";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const goTo = React.useCallback(
    (idx: number) => {
      if (fading || idx === active) return;
      setFading(true);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = setTimeout(() => {
        setActive(idx);
        setFading(false);
      }, 450);
    },
    [fading, active]
  );
  const prev = React.useCallback(() => goTo((active - 1 + count) % count), [active, count, goTo]);
  const next = React.useCallback(() => goTo((active + 1) % count), [active, count, goTo]);

  React.useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!autoPlay || count < 2 || !isVisible || paused || hoverPaused) return;
    const id = setInterval(next, autoPlayInterval * 1000);
    return () => clearInterval(id);
  }, [autoPlay, autoPlayInterval, next, count, isVisible, paused, hoverPaused]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const f = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    el.addEventListener("keydown", f);
    return () => el.removeEventListener("keydown", f);
  }, [prev, next]);

  if (count === 0) {
    return (
      <div
        ref={containerRef}
        className={cn("relative flex h-full w-full items-center justify-center text-[13px]", className)}
        style={{ background: bg, color: textSecondary }}
        {...props}
      >
        Add reviews →
      </div>
    );
  }
  const r = safeReviews[active];

  // schema.org Review markup (JSON-LD) for search engines, skipped while the placeholder reviews show.
  const reviewsJsonLd = reviews === DEFAULT_REVIEWS
    ? null
    : JSON.stringify({
        "@context": "https://schema.org",
        "@graph": reviews
          .filter((r) => r.quote && r.name)
          .map((r) => ({
            "@type": "Review",
            reviewBody: r.quote,
            author: { "@type": "Person", name: r.name },
            ...(reviewSubject ? { itemReviewed: { "@type": "Organization", name: reviewSubject } } : {}),
          })),
      }).replace(/</g, "\\u003c");

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={sectionLabel || "Reviews"}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={() => setHoverPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHoverPaused(false);
      }}
      className={cn("relative flex h-full w-full flex-col overflow-hidden", className)}
      style={{ background: bg }}
      {...props}
    >
      {reviewsJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: reviewsJsonLd }} />}
      {/* Top image strip */}
      <div className="relative h-[45%] flex-shrink-0 overflow-hidden">
        {safeReviews.map((rv, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{ opacity: i === active ? (fading ? 0 : 1) : 0, transition: "opacity 0.6s ease" }}
          >
            <img
              src={rv.src}
              alt={rv.name ? `${rv.name}${rv.role ? ", " + rv.role : ""}` : "Customer review photo"}
              className="block h-full w-full object-cover"
            />
          </div>
        ))}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, transparent 60%, ${bg} 100%)` }}
        />
        <div
          aria-hidden="true"
          className="absolute right-7 top-6 text-[11px] tracking-widest text-white/50"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
        >
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </div>
        <div
          aria-hidden="true"
          className="absolute left-7 top-6 text-[9px] uppercase tracking-[0.3em] text-white/40"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
        >
          {sectionLabel}
        </div>
        {autoPlay && count > 1 && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play automatic slideshow" : "Pause automatic slideshow"}
            aria-pressed={paused}
            className="absolute bottom-4 right-7 flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-black/35 p-0 backdrop-blur-sm"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="#fff">
              {paused ? (
                <path d="M1 0.5L9 5L1 9.5V0.5Z" />
              ) : (
                <>
                  <rect x="1.5" y="1" width="2.4" height="8" />
                  <rect x="6.1" y="1" width="2.4" height="8" />
                </>
              )}
            </svg>
          </button>
        )}
        {/* Thumbnail strip */}
        <div className="absolute bottom-4 left-7 flex gap-1.5">
          {safeReviews.map((rv, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show review ${i + 1}`}
              aria-current={i === active}
              className="h-10 w-10 overflow-hidden rounded-[8px] border-none bg-transparent p-0"
              style={{
                opacity: i === active ? 1 : 0.35,
                boxShadow: i === active ? "0 0 0 1.5px rgba(255,255,255,0.8)" : "none",
                transition: "opacity 0.3s ease",
              }}
            >
              <img src={rv.src} alt="" className="block h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom text */}
      <div className="flex flex-1 flex-col justify-between px-10 pb-9 pt-8">
        <div role="group" aria-roledescription="slide" aria-label={`Review ${active + 1} of ${count}`} aria-live="polite" aria-atomic="true">
          <div
            key={`q-${active}`}
            style={{
              opacity: fading ? 0 : 1,
              transform: fading ? "translateY(10px)" : "translateY(0)",
              transition: "opacity 0.45s ease, transform 0.45s ease",
            }}
          >
            <p className="mb-1.5 text-[13px] tracking-[0.02em]" style={{ color: textSecondary }}>
              {r.role}
            </p>
            <cite className="mb-5 block text-[15px] font-semibold not-italic tracking-[-0.01em]" style={{ color: textPrimary }}>
              {r.name}
            </cite>
            <blockquote className="m-0 text-[20px] font-normal leading-[1.2] tracking-tight" style={{ color: textPrimary, fontFamily: "Georgia, 'Times New Roman', serif" }}>
              &ldquo;{r.quote}&rdquo;
            </blockquote>
          </div>
        </div>
        {/* Nav */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous review"
            onFocus={() => setNavFocus("prev")}
            onBlur={() => setNavFocus((f) => (f === "prev" ? null : f))}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-transparent outline-none"
            style={{
              border: `1px solid ${border}`,
              boxShadow: navFocus === "prev" ? `0 0 0 2px ${textPrimary}` : "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke={textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next review"
            onFocus={() => setNavFocus("next")}
            onBlur={() => setNavFocus((f) => (f === "next" ? null : f))}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full border-none outline-none"
            style={{
              background: textPrimary,
              boxShadow: navFocus === "next" ? `0 0 0 2px ${border}, 0 0 0 4px ${textPrimary}` : "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2L10 7L5 12" stroke={bg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewCardPortrait;
