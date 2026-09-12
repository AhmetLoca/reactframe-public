"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ExpandCardGridItem {
  src?: string;
  title: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export interface ExpandCardGridProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  items?: ExpandCardGridItem[];
  transitionDuration?: number;
  gap?: number;
  cardRadius?: number;
  overlayRadius?: number;
  cardColor?: string;
  titleSize?: number;
  descriptionSize?: number;
  accentColor?: string;
  showButton?: boolean;
  buttonTextColor?: string;
  buttonBorderColor?: string;
  closeIconColor?: string;
  showIndex?: boolean;
  indexColor?: string;
}

const DEFAULT_ITEMS: ExpandCardGridItem[] = [
  { title: "Section One", buttonText: "Explore Now" },
  { title: "Section Two", buttonText: "Explore Now" },
  { title: "Section Three", buttonText: "Explore Now" },
  { title: "Section Four", buttonText: "Explore Now" },
];

const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
const TONE_OFFSETS = [0, 0.16, -0.12, 0.26, -0.18, 0.08];

export function ExpandCardGrid({
  items = DEFAULT_ITEMS,
  transitionDuration = 0.6,
  gap = 0,
  cardRadius = 0,
  overlayRadius = 0,
  cardColor = "#212121",
  titleSize = 32,
  descriptionSize = 14,
  accentColor = "#ffffff",
  showButton = true,
  buttonTextColor = "rgba(255,255,255,0.55)",
  buttonBorderColor = "rgba(255,255,255,0.35)",
  closeIconColor = "#ffffff",
  showIndex = false,
  indexColor = "rgba(255,255,255,0.5)",
  className,
  ...props
}: ExpandCardGridProps) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sectionRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setIsMobile(entry.contentRect.width <= 700));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const resolvedItems = items.length > 0 ? items : DEFAULT_ITEMS;
  const duration = transitionDuration;

  const openSection = React.useCallback((index: number) => setExpandedIndex(index), []);
  const closeSection = React.useCallback(() => setExpandedIndex(null), []);

  const navigate = React.useCallback(
    (currentIndex: number, direction: 1 | -1) => {
      const total = resolvedItems.length;
      openSection((currentIndex + direction + total) % total);
    },
    [resolvedItems.length, openSection],
  );

  React.useEffect(() => {
    if (expandedIndex !== null) sectionRefs.current[expandedIndex]?.focus();
  }, [expandedIndex]);

  // Reset expansion state if the item count shrinks below the open index
  React.useEffect(() => {
    if (expandedIndex !== null && expandedIndex >= resolvedItems.length) {
      setExpandedIndex(null);
    }
  }, [resolvedItems.length, expandedIndex]);

  const hasExpanded = expandedIndex !== null;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden grid bg-black", className)}
      style={{ gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gridAutoRows: "1fr", gap }}
      {...props}
    >
      {resolvedItems.map((item, index) => {
        const isExpanded = expandedIndex === index;
        const isHidden = hasExpanded && !isExpanded;
        const textDelay = isExpanded ? duration : 0;
        const toneOffset = TONE_OFFSETS[index % TONE_OFFSETS.length];

        return (
          <div
            key={index}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            role="button"
            tabIndex={isHidden ? -1 : 0}
            aria-hidden={isHidden}
            aria-pressed={isExpanded}
            aria-label={isExpanded ? `${item.title}, collapse` : `${item.title}, expand`}
            onClick={() => {
              if (!isExpanded) openSection(index);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (!isExpanded) openSection(index);
                return;
              }
              if (!isExpanded) return;
              if (event.key === "Escape") {
                event.preventDefault();
                closeSection();
              } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                navigate(index, 1);
              } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                navigate(index, -1);
              }
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            onTouchStart={(event) => {
              if (!isExpanded) return;
              const touch = event.touches[0];
              touchStartRef.current = { x: touch.clientX, y: touch.clientY };
            }}
            onTouchEnd={(event) => {
              if (!isExpanded || !touchStartRef.current) return;
              const touch = event.changedTouches[0];
              const dx = touch.clientX - touchStartRef.current.x;
              const dy = touch.clientY - touchStartRef.current.y;
              touchStartRef.current = null;

              const SWIPE_THRESHOLD = 50;
              if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

              if (Math.abs(dx) > Math.abs(dy)) {
                navigate(index, dx < 0 ? 1 : -1);
              } else if (dy > 0) {
                closeSection();
              } else {
                navigate(index, 1);
              }
            }}
            className="w-full h-full overflow-hidden outline-none"
            style={{
              position: isExpanded ? "absolute" : "relative",
              inset: isExpanded ? 0 : undefined,
              zIndex: isExpanded ? 100 : 0,
              cursor: isExpanded ? "auto" : "pointer",
              touchAction: isExpanded ? "none" : "auto",
              background: cardColor,
              borderRadius: cardRadius,
              transform: isHidden ? "scale3d(0, 0, 0)" : "scale3d(1, 1, 1)",
              opacity: isHidden ? 0 : 1,
              willChange: hasExpanded ? "transform, opacity, border-radius" : "auto",
              transitionProperty: "transform, opacity, border-radius",
              transitionDuration: `${duration}s`,
              transitionTimingFunction: EASING,
              boxShadow: focusedIndex === index ? "inset 0 0 0 3px rgba(255,255,255,0.7)" : "none",
            }}
          >
            {item.src && (
              <img
                src={item.src}
                alt=""
                className="pointer-events-none absolute top-0 left-0 block h-full w-full object-cover"
                style={{
                  transform: !isExpanded && hoveredIndex === index ? "scale(1.08)" : "scale(1)",
                  transition: `transform 0.5s ${EASING}`,
                  willChange: hoveredIndex === index ? "transform" : "auto",
                }}
              />
            )}

            <div
              className="pointer-events-none absolute inset-0"
              style={{ borderRadius: overlayRadius, background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.05) 100%), ${toneOffset >= 0 ? `rgba(0,0,0,${toneOffset})` : `rgba(255,255,255,${-toneOffset})`}` }}
            />

            {showIndex && (
              <div className="pointer-events-none absolute top-4 left-4 text-[10px] tracking-[0.2em]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", color: indexColor }}>
                {String(index + 1).padStart(2, "0")}
              </div>
            )}

            <div aria-hidden={!isExpanded} className="absolute right-0 bottom-0 left-0 px-6.5 py-7">
              <div className="mb-2.5 overflow-hidden">
                <h3
                  className="m-0 leading-[1.15] font-medium tracking-[-0.02em] text-white"
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: titleSize,
                    opacity: isExpanded ? 1 : 0,
                    transform: isExpanded ? "translateY(0px)" : "translateY(20px)",
                    transition: isExpanded ? `opacity 0.4s ${textDelay}s cubic-bezier(0.16,1,0.3,1), transform 0.4s ${textDelay}s cubic-bezier(0.16,1,0.3,1)` : "opacity 0.12s 0s ease, transform 0.12s 0s ease",
                  }}
                >
                  {item.title}
                </h3>
              </div>

              <div
                className="mb-2.5 h-px origin-left"
                style={{
                  background: accentColor,
                  opacity: isExpanded ? 0.25 : 0,
                  transform: isExpanded ? "scaleX(1)" : "scaleX(0)",
                  transition: isExpanded ? `opacity 0.1s ${textDelay + 0.08}s ease, transform 0.55s ${textDelay + 0.1}s cubic-bezier(0.4,0,0.2,1)` : "opacity 0.12s 0s ease, transform 0.12s 0s ease",
                }}
              />

              {item.description && (
                <div className="overflow-hidden">
                  <p
                    className="m-0 leading-[1.6] text-white/65"
                    style={{
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontSize: descriptionSize,
                      opacity: isExpanded ? 1 : 0,
                      transform: isExpanded ? "translateY(0px)" : "translateY(14px)",
                      transition: isExpanded ? `opacity 0.4s ${textDelay + 0.1}s cubic-bezier(0.16,1,0.3,1), transform 0.4s ${textDelay + 0.1}s cubic-bezier(0.16,1,0.3,1)` : "opacity 0.12s 0s ease, transform 0.12s 0s ease",
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              )}

              {showButton && item.buttonText && (
                <div className="mt-3.5 inline-block overflow-hidden">
                  <a
                    href={item.buttonHref || undefined}
                    target={item.buttonHref ? "_blank" : undefined}
                    rel={item.buttonHref ? "noopener noreferrer" : undefined}
                    onClick={(event) => event.stopPropagation()}
                    aria-hidden={!isExpanded || !item.buttonHref}
                    tabIndex={isExpanded && item.buttonHref ? 0 : -1}
                    className="inline-flex items-center justify-center rounded-full bg-white/8 px-4.5 py-2 no-underline backdrop-blur-[8px]"
                    style={{
                      border: `1px solid ${buttonBorderColor}`,
                      cursor: item.buttonHref ? "pointer" : "default",
                      pointerEvents: isExpanded && item.buttonHref ? "auto" : "none",
                      opacity: isExpanded ? 1 : 0,
                      transition: isExpanded ? `opacity 0.4s ${textDelay + 0.2}s ease` : "opacity 0.12s 0s ease",
                    }}
                  >
                    <span className="text-[10px] tracking-[0.18em] whitespace-nowrap uppercase" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", color: buttonTextColor }}>
                      {item.buttonText}
                    </span>
                  </a>
                </div>
              )}
            </div>

            <button
              type="button"
              aria-label={`Close ${item.title}`}
              aria-hidden={!isExpanded}
              tabIndex={isExpanded ? 0 : -1}
              onClick={(event) => {
                event.stopPropagation();
                closeSection();
              }}
              className="absolute top-0 right-0 flex h-12 w-12 items-center justify-center border-none bg-transparent text-[28px] leading-none"
              style={{
                color: closeIconColor,
                opacity: isExpanded ? 1 : 0,
                pointerEvents: isExpanded ? "auto" : "none",
                cursor: "pointer",
                transitionProperty: "opacity",
                transitionDuration: isExpanded ? "0.2s" : "0.1s",
                transitionTimingFunction: "linear",
                transitionDelay: isExpanded ? `${duration}s` : "0s",
                willChange: "opacity",
              }}
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
}
