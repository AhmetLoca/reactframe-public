"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LogoGridItem {
  image?: string;
  name: string;
  link?: string;
  size?: number;
  imageScale?: number;
}

export type LogoGridShape = "circle" | "rounded" | "square" | "none";

export interface LogoGridProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  logos?: LogoGridItem[];
  logoSize?: number;
  gap?: number;
  scrollReveal?: boolean;
  staggerDelay?: number;
  revealDistance?: number;
  enableMagnetic?: boolean;
  magnetRadius?: number;
  magnetStrength?: number;
  hoverScale?: number;
  logoShape?: LogoGridShape;
  logoBackground?: string;
  logoPadding?: number;
  logoBorder?: boolean;
  logoBorderColor?: string;
  logoBorderWidth?: number;
  logoShadow?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowY?: number;
  grayscale?: boolean;
  hoverReveal?: boolean;
  showTooltips?: boolean;
  tooltipBackground?: string;
  tooltipTextColor?: string;
  tooltipFontSize?: number;
  tooltipFontFamily?: string;
  tooltipRadius?: number;
  tooltipOffset?: number;
  transparentBackground?: boolean;
  backgroundColor?: string;
}

const DEFAULT_LOGOS: LogoGridItem[] = [
  { name: "Microsoft" },
  { name: "Apple" },
  { name: "Spotify" },
  { name: "OpenAI" },
  { name: "Google" },
  { name: "Meta" },
  { name: "WhatsApp" },
  { name: "Figma" },
  { name: "Netflix" },
  { name: "Slack" },
];

export function LogoGrid({
  logos = DEFAULT_LOGOS,
  logoSize = 96,
  gap = 24,
  scrollReveal = true,
  staggerDelay = 60,
  revealDistance = 24,
  enableMagnetic = true,
  magnetRadius = 140,
  magnetStrength = 40,
  hoverScale = 1.12,
  logoShape = "rounded",
  logoBackground = "#ffffff",
  logoPadding = 18,
  logoBorder = false,
  logoBorderColor = "rgba(0,0,0,0.08)",
  logoBorderWidth = 1,
  logoShadow = true,
  shadowColor = "rgba(0,0,0,0.14)",
  shadowBlur = 20,
  shadowY = 8,
  grayscale = false,
  hoverReveal = true,
  showTooltips = true,
  tooltipBackground = "#1a1a1a",
  tooltipTextColor = "#ffffff",
  tooltipFontSize = 12,
  tooltipFontFamily = "Inter, -apple-system, sans-serif",
  tooltipRadius = 6,
  tooltipOffset = 14,
  transparentBackground = true,
  backgroundColor = "#ffffff",
  className,
  ...props
}: LogoGridProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const revealRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const magneticRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = React.useRef({ x: 0, y: 0, active: false });

  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [revealed, setRevealed] = React.useState<Set<number>>(() => (scrollReveal ? new Set() : new Set(logos.map((_, i) => i))));

  const n = logos.length;

  React.useEffect(() => {
    if (!scrollReveal) {
      const id = setTimeout(() => setRevealed(new Set(logos.map((_, i) => i))), 0);
      return () => clearTimeout(id);
    }
    const resetId = setTimeout(() => setRevealed(new Set()), 0);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number(entry.target.getAttribute("data-idx"));
          setRevealed((prev) => {
            if (prev.has(idx)) return prev;
            const next = new Set(prev);
            next.add(idx);
            return next;
          });
        });
      },
      { threshold: 0.15 },
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => {
      clearTimeout(resetId);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollReveal, n]);

  React.useEffect(() => {
    if (!enableMagnetic || n === 0) return;
    let raf = 0;
    const tick = () => {
      const { x: mx, y: my, active } = mouseRef.current;
      const strength = (magnetStrength / 100) * 0.5;
      for (let i = 0; i < n; i++) {
        const el = magneticRefs.current[i];
        if (!el) continue;
        if (!active) {
          el.style.transform = "translate(0px, 0px) scale(1)";
          continue;
        }
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < magnetRadius) {
          const factor = 1 - dist / magnetRadius;
          const scaleAmt = 1 + factor * (hoverScale - 1);
          el.style.transform = `translate(${dx * factor * strength}px, ${dy * factor * strength}px) scale(${scaleAmt})`;
        } else {
          el.style.transform = "translate(0px, 0px) scale(1)";
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enableMagnetic, n, magnetRadius, magnetStrength, hoverScale]);

  const radiusFor = (shape: LogoGridShape, itemSize: number) => (shape === "circle" ? "50%" : shape === "rounded" ? itemSize * 0.22 : 0);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-wrap content-center items-center justify-center min-w-px min-h-px w-full h-full", className)}
      style={{ gap, backgroundColor: transparentBackground ? "transparent" : backgroundColor }}
      onMouseMove={(e) => {
        mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      }}
      onMouseLeave={() => {
        mouseRef.current.active = false;
        setHoveredIndex(null);
      }}
      {...props}
    >
      {logos.map((logo, i) => {
        const itemSize = logo.size && logo.size > 0 ? logo.size : logoSize;
        const imageScale = logo.imageScale && logo.imageScale > 0 ? logo.imageScale / 100 : 1;
        const isHovered = hoveredIndex === i;
        const isRevealed = revealed.has(i);
        const delay = Math.min(i, 24) * staggerDelay;

        const logoBox = (
          <div
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative flex items-center justify-center box-border"
            style={{
              width: itemSize,
              height: itemSize,
              borderRadius: radiusFor(logoShape, itemSize),
              background: logoShape === "none" ? "transparent" : logoBackground,
              border: logoBorder ? `${logoBorderWidth}px solid ${logoBorderColor}` : "none",
              boxShadow: logoShadow ? `0 ${shadowY}px ${shadowBlur}px ${shadowColor}` : "none",
              cursor: logo.link ? "pointer" : "default",
              transform: !enableMagnetic && isHovered ? `scale(${hoverScale})` : undefined,
              filter: grayscale && !(hoverReveal && isHovered) ? "grayscale(1)" : "grayscale(0)",
              opacity: grayscale && !(hoverReveal && isHovered) ? 0.6 : 1,
              transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, filter 0.3s ease, opacity 0.3s ease",
            }}
          >
            {logo.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.image}
                alt={logo.name || ""}
                draggable={false}
                className="pointer-events-none object-contain select-none"
                style={{ width: `calc(100% - ${logoPadding * 2}px)`, height: `calc(100% - ${logoPadding * 2}px)`, transform: `scale(${imageScale})` }}
              />
            ) : (
              <span className="pointer-events-none font-bold text-black/25 select-none" style={{ fontSize: itemSize * 0.32, fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                {(logo.name || "?").charAt(0)}
              </span>
            )}

            {showTooltips && logo.name && (
              <div
                className="pointer-events-none absolute left-1/2 z-10 font-semibold whitespace-nowrap shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition-[opacity,transform] duration-200"
                style={{
                  bottom: `calc(100% + ${tooltipOffset}px)`,
                  padding: "6px 12px",
                  borderRadius: tooltipRadius,
                  background: tooltipBackground,
                  color: tooltipTextColor,
                  fontSize: tooltipFontSize,
                  fontFamily: tooltipFontFamily,
                  opacity: isHovered ? 1 : 0,
                  transform: `translateX(-50%) translateY(${isHovered ? 0 : 6}px)`,
                }}
              >
                {logo.name}
                <div className="absolute top-full left-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rotate-45" style={{ background: tooltipBackground }} />
              </div>
            )}
          </div>
        );

        return (
          <div
            key={i}
            data-idx={i}
            ref={(el) => {
              revealRefs.current[i] = el;
            }}
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? "translateY(0px)" : `translateY(${revealDistance}px)`,
              transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
            }}
          >
            <div
              ref={(el) => {
                magneticRefs.current[i] = el;
              }}
              style={{ willChange: enableMagnetic ? "transform" : undefined }}
            >
              {logo.link ? (
                <a href={logo.link} target="_blank" rel="noopener noreferrer" className="block no-underline">
                  {logoBox}
                </a>
              ) : (
                logoBox
              )}
            </div>
          </div>
        );
      })}

      {n === 0 && <div className="text-[13px] whitespace-nowrap text-[#f5f4f1]/30">Add logos via the `logos` prop</div>}
    </div>
  );
}
