"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CinematicStackedGalleryItem {
  image: string;
  title: string;
  description: string;
  alt?: string;
}

export interface CinematicStackedGalleryProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  items?: CinematicStackedGalleryItem[];
  kenBurns?: boolean;
  kenBurnsDuration?: number;
  kenBurnsScale?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  depthBlur?: boolean;
  kickerFontFamily?: string;
  titleFontFamily?: string;
  descriptionFontFamily?: string;
  showCta?: boolean;
  ctaLabel?: string;
  ctaLink?: string;
  ctaNewTab?: boolean;
}

const DEFAULT_ITEMS: CinematicStackedGalleryItem[] = [
  {
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&h=900&q=80",
    title: "Whispering Woods",
    description: "Dense canopies filter soft morning light across a quiet trail. The air carries the scent of moss and distant rainfall.",
    alt: "Sunlit forest path",
  },
  {
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&h=900&q=80",
    title: "Alpine Summit",
    description: "Rugged peaks rise above a sea of clouds. Thin air and endless views reward those who climb.",
    alt: "Snow-capped mountain ridge",
  },
  {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&h=900&q=80",
    title: "Coastal Horizon",
    description: "Turquoise water meets white sand under a late afternoon sky. Waves roll in with steady rhythm.",
    alt: "Tropical beach shoreline",
  },
  {
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&h=900&q=80",
    title: "Neon Nights",
    description: "City lights stretch into the distance. Reflections dance on wet streets after a brief shower.",
    alt: "Nighttime city skyline",
  },
  {
    image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1600&h=900&q=80",
    title: "Endless Dunes",
    description: "Golden sand shapes shift with every gust of wind. Silence settles between the ridges.",
    alt: "Desert sand dunes",
  },
  {
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1600&h=900&q=80",
    title: "Celestial Glow",
    description: "Stars scatter across a clear night sky. Distant mountains silhouette against the deep blue.",
    alt: "Starry night over mountains",
  },
];

/**
 * CinematicStackedGallery — a fullscreen hero gallery where inactive slides
 * collapse into a stacked deck of thumbnails; clicking one crossfades it to
 * full size with Ken Burns zoom and cursor parallax.
 */
export function CinematicStackedGallery({
  className,
  items = DEFAULT_ITEMS,
  kenBurns = true,
  kenBurnsDuration = 18,
  kenBurnsScale = 1.08,
  parallax = true,
  parallaxStrength = 18,
  depthBlur = true,
  kickerFontFamily = "system-ui, -apple-system, sans-serif",
  titleFontFamily = "system-ui, -apple-system, sans-serif",
  descriptionFontFamily = "system-ui, -apple-system, sans-serif",
  showCta = true,
  ctaLabel = "Explore",
  ctaLink = "#",
  ctaNewTab = false,
  ...props
}: CinematicStackedGalleryProps) {
  const rawId = React.useId();
  const scopeClass = "csg-" + rawId.replace(/[^a-zA-Z0-9]/g, "");

  const safeItems = items?.length ? items : DEFAULT_ITEMS;
  const total = safeItems.length;

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [thumbOrder, setThumbOrder] = React.useState<number[]>(() => Array.from({ length: Math.max(total - 1, 0) }, (_, i) => i + 1));
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (total < 2) {
      setThumbOrder([]);
      return;
    }
    setThumbOrder(
      Array.from({ length: total - 1 }, (_, i) => (i >= activeIndex ? i + 1 : i)).filter((i) => i !== activeIndex && i < total)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const goTo = React.useCallback(
    (newIndex: number) => {
      if (newIndex === activeIndex || newIndex < 0 || newIndex >= total) return;
      setThumbOrder((prev) => [...prev.filter((idx) => idx !== newIndex), activeIndex]);
      setActiveIndex(newIndex);
    },
    [activeIndex, total]
  );

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (!parallax || !rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMouse({ x, y });
    },
    [parallax]
  );

  const onMouseLeave = React.useCallback(() => setMouse({ x: 0, y: 0 }), []);

  const parallaxX = parallax ? mouse.x * parallaxStrength : 0;
  const parallaxY = parallax ? mouse.y * parallaxStrength : 0;

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(activeIndex + 1 < total ? activeIndex + 1 : 0);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(activeIndex - 1 >= 0 ? activeIndex - 1 : total - 1);
      }
    },
    [goTo, activeIndex, total]
  );

  return (
    <div
      ref={rootRef}
      className={cn(scopeClass, "relative h-full w-full overflow-hidden bg-[#0b0b0f] text-white", className)}
      data-paused={!isVisible}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image gallery"
      tabIndex={0}
      style={{ "--kb-duration": `${kenBurnsDuration}s`, "--kb-scale": kenBurnsScale, "--depth-blur": depthBlur ? "2px" : "0px" } as React.CSSProperties}
      {...props}
    >
      <style>{`
        .${scopeClass} {
          --gs-scale: 0.11;
          --gs-gap: 14px;
          --gs-bottom: 28px;
          --gs-duration: 0.85s;
          --gs-ease: cubic-bezier(0.22, 1, 0.36, 1);
          font-family: system-ui, -apple-system, sans-serif;
        }
        @media (max-width: 640px) {
          .${scopeClass} { --gs-scale: 0.16; --gs-gap: 10px; --gs-bottom: 20px; }
        }
        .${scopeClass} .gs-track { height: 100%; overflow: visible !important; position: relative; }
        .${scopeClass} .gs-item { inset: 0 !important; margin: 0 !important; pointer-events: none !important; position: absolute !important; transform: none !important; width: auto !important; }
        .${scopeClass} .gs-item[data-active="true"] { z-index: 1 !important; }
        .${scopeClass} .gs-item[data-active="false"] { z-index: 10 !important; }
        .${scopeClass} .gs-slide {
          border-radius: 0; inset: 0; overflow: hidden; pointer-events: auto; position: absolute;
          transform: translate(0, 0) scale(1);
          transition: transform var(--gs-duration) var(--gs-ease), border-radius var(--gs-duration) var(--gs-ease), filter 0.35s ease;
          will-change: transform, filter;
        }
        .${scopeClass} .gs-item[data-active="false"] .gs-slide {
          border-radius: 48px;
          filter: brightness(0.62) blur(var(--depth-blur));
          transform: translate(calc(var(--offset) * (var(--gs-scale) * 100vw + var(--gs-gap))), calc((50vh - var(--gs-scale) * 50vh) - var(--gs-bottom))) scale(var(--gs-scale));
        }
        .${scopeClass} .gs-item[data-active="false"] .gs-slide:hover { filter: brightness(1) blur(0); }
        .${scopeClass} .gs-image-wrap { position: absolute; inset: -4%; width: 108%; height: 108%; transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1); will-change: transform; }
        .${scopeClass} .gs-image { display: block; height: 100%; object-fit: cover; width: 100%; transform-origin: center center; }
        .${scopeClass} .gs-item[data-active="true"] .gs-image.gs-kenburns { animation: ${scopeClass}-kenburns var(--kb-duration) ease-in-out infinite alternate; }
        @keyframes ${scopeClass}-kenburns {
          from { transform: scale(1) translate(0%, 0%); }
          to { transform: scale(var(--kb-scale)) translate(-1.2%, -0.8%); }
        }
        .${scopeClass} .gs-thumb-btn { appearance: none; background: none; border: 0; cursor: pointer; inset: 0; padding: 0; position: absolute; }
        .${scopeClass} .gs-rail {
          align-items: flex-start; background: linear-gradient(90deg, rgb(0 0 0 / 60%), transparent);
          display: flex; flex-direction: column; gap: 1.75rem; inset: 0 auto 0 0;
          justify-content: center; max-width: min(520px, 70%); padding: 0 3.5rem 0 3rem; pointer-events: none; position: absolute; z-index: 5;
        }
        @media (max-width: 640px) {
          .${scopeClass} .gs-rail { max-width: 90%; padding: 0 1.5rem; }
        }
        .${scopeClass} .gs-content { animation: ${scopeClass}-content-in 0.65s var(--gs-ease) calc(var(--gs-duration) * 0.35) backwards; display: flex; flex-direction: column; gap: 0.85rem; }
        @keyframes ${scopeClass}-content-in { from { opacity: 0; transform: translateY(22px); } }
        .${scopeClass} .gs-kicker { margin: 0; opacity: 0.7; letter-spacing: 0.06em; font-size: 13px; line-height: 1.3; }
        .${scopeClass} .gs-title { margin: 0; font-size: 40px; line-height: 1.05; }
        .${scopeClass} .gs-description { color: rgb(255 255 255 / 85%); margin: 0; font-size: 16px; line-height: 1.6; }
        .${scopeClass} .gs-controls { display: flex; flex-direction: column; align-items: flex-start; gap: 0.75rem; pointer-events: auto; }
        .${scopeClass} .gs-nav-row { display: flex; gap: 0.75rem; align-items: center; }
        .${scopeClass} .gs-nav {
          align-items: center; appearance: none; backdrop-filter: blur(10px); background: rgb(255 255 255 / 10%);
          border: 1px solid rgb(255 255 255 / 20%); border-radius: 50%; color: #fff; cursor: pointer; display: flex;
          height: 3rem; justify-content: center; transition: background 0.2s, border-color 0.2s, opacity 0.2s, transform 0.15s; width: 3rem;
        }
        .${scopeClass} .gs-nav:hover:not(:disabled) { background: rgb(255 255 255 / 22%); border-color: rgb(255 255 255 / 40%); }
        .${scopeClass} .gs-nav:active:not(:disabled) { transform: scale(0.94); }
        .${scopeClass} .gs-nav:disabled { cursor: default; opacity: 0.35; }
        .${scopeClass} .gs-cta {
          align-items: center; appearance: none; backdrop-filter: blur(10px); background: rgb(255 255 255 / 12%);
          border: 1px solid rgb(255 255 255 / 25%); border-radius: 999px; color: #fff; cursor: pointer; display: inline-flex;
          font-size: 0.9rem; font-weight: 500; gap: 0.4rem; height: 3rem; letter-spacing: 0.02em; padding: 0 1.35rem;
          text-decoration: none; transition: background 0.2s, border-color 0.2s, transform 0.15s; white-space: nowrap;
        }
        .${scopeClass} .gs-cta:hover { background: rgb(255 255 255 / 24%); border-color: rgb(255 255 255 / 45%); }
        .${scopeClass} .gs-cta:active { transform: scale(0.97); }
        .${scopeClass} .gs-sr-only { border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; }
        @media (prefers-reduced-motion: reduce) {
          .${scopeClass} .gs-slide { transition: none; }
          .${scopeClass} .gs-content { animation: none; }
          .${scopeClass} .gs-item[data-active="true"] .gs-image.gs-kenburns { animation: none; }
          .${scopeClass} .gs-image-wrap { transition: none; }
        }
        .${scopeClass}[data-paused="true"] .gs-item[data-active="true"] .gs-image.gs-kenburns { animation-play-state: paused; }
      `}</style>

      <div className="h-full w-full">
        <div className="gs-track">
          {safeItems.map((item, index) => {
            const isActive = index === activeIndex;
            const orderIdx = thumbOrder.indexOf(index);
            const offset = orderIdx === -1 ? 0 : orderIdx - (thumbOrder.length - 1) / 2;

            return (
              <div
                key={index}
                className="gs-item"
                data-active={String(isActive)}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}: ${item.title}`}
              >
                <div className="gs-slide" style={{ "--offset": offset } as React.CSSProperties}>
                  <div className="gs-image-wrap" style={isActive ? { transform: `translate(${parallaxX}px, ${parallaxY}px)` } : undefined}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.alt || item.title}
                      className={`gs-image${isActive && kenBurns ? " gs-kenburns" : ""}`}
                      draggable={false}
                      loading={isActive ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                  {!isActive && (
                    <button type="button" className="gs-thumb-btn" onClick={() => goTo(index)}>
                      <span className="gs-sr-only">Show {item.title}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <ul className="gs-sr-only">
          {safeItems.map((item, index) => (
            <li key={index}>
              <strong>{item.title}</strong>: {item.description}
            </li>
          ))}
        </ul>

        <div className="gs-rail">
          <div className="gs-content" key={activeIndex} aria-live="polite" aria-atomic="true">
            <p className="gs-kicker" style={{ fontFamily: kickerFontFamily }}>
              {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <h2 className="gs-title" style={{ fontFamily: titleFontFamily }}>{safeItems[activeIndex]?.title}</h2>
            <p className="gs-description" style={{ fontFamily: descriptionFontFamily }}>{safeItems[activeIndex]?.description}</p>
          </div>

          <div className="gs-controls">
            {showCta && ctaLabel ? (
              <a className="gs-cta" href={ctaLink || "#"} target={ctaNewTab ? "_blank" : undefined} rel={ctaNewTab ? "noopener noreferrer" : undefined}>
                {ctaLabel}
              </a>
            ) : null}

            <div className="gs-nav-row">
              <button
                type="button"
                className="gs-nav"
                onClick={() => goTo(thumbOrder.length ? thumbOrder[thumbOrder.length - 1] : activeIndex)}
                aria-label="Previous"
                disabled={total < 2}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                className="gs-nav"
                onClick={() => goTo(thumbOrder.length ? thumbOrder[0] : activeIndex)}
                aria-label="Next"
                disabled={total < 2}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CinematicStackedGallery;
