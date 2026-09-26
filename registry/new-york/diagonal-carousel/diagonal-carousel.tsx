"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DiagonalCarouselSlide {
  src: string;
  title: string;
}

export type DiagonalCarouselTitleAlign = "bottom-left" | "bottom-center" | "center";
export type DiagonalCarouselTheme = "paper" | "glass";

export interface DiagonalCarouselProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  slides?: DiagonalCarouselSlide[];
  cardSize?: number;
  cardBorderRadius?: number;
  rotateAngle?: number;
  yOffset?: number;
  inactiveScale?: number;
  theme?: DiagonalCarouselTheme;
  titleAlign?: DiagonalCarouselTitleAlign;
  titleSize?: number;
  initialIndex?: number;
}

const DEFAULT_SLIDES: DiagonalCarouselSlide[] = [
  { src: "/demo/1.webp", title: "Quiet living room" },
  { src: "/demo/3.webp", title: "Warm oak kitchen" },
  { src: "/demo/4.webp", title: "Soft linen bedroom" },
  { src: "/demo/5.webp", title: "Sculpted stone bath" },
  { src: "/demo/6.webp", title: "Open plan lounge" },
  { src: "/demo/7.webp", title: "Hidden storage wall" },
  { src: "/demo/8.webp", title: "Garden courtyard light" },
  { src: "/demo/9.webp", title: "Low sofa seating" },
  { src: "/demo/10.webp", title: "Built-in reading nook" },
  { src: "/demo/2.webp", title: "Tonal plaster hallway" },
];

const TOKENS = {
  paper: "#f5f5f5",
  ink: "#221e1b",
  inkFaint: "rgba(34,30,27,0.40)",
  glassBg: "rgba(20,18,17,0.88)",
  glassFg: "#ffffff",
  glassFgFaint: "rgba(255,255,255,0.40)",
  glassBorder: "rgba(255,255,255,0.12)",
  glassPillBg: "rgba(255,255,255,0.10)",
  paperPillBg: "#ffffff",
  paperBorder: "rgba(34,30,27,0.10)",
  easeSignature: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export function DiagonalCarousel({
  slides = DEFAULT_SLIDES,
  cardSize = 280,
  cardBorderRadius = 20,
  rotateAngle = 30,
  yOffset = 50,
  inactiveScale = 0.6,
  theme = "paper",
  titleAlign = "bottom-left",
  titleSize = 14,
  initialIndex = 3,
  className,
  style,
  ...props
}: DiagonalCarouselProps) {
  const effectiveSlides = slides.length > 0 ? slides : DEFAULT_SLIDES;

  const [activeIndex, setActiveIndex] = React.useState(() => Math.min(initialIndex, effectiveSlides.length - 1));

  const toPrev = () => setActiveIndex((prev) => Math.max(0, prev - 1));
  const toNext = () => setActiveIndex((prev) => Math.min(effectiveSlides.length - 1, prev + 1));
  const toSlide = (index: number) => setActiveIndex(index);

  const isGlass = theme === "glass";
  const bg = isGlass ? TOKENS.glassBg : TOKENS.paper;
  const fg = isGlass ? TOKENS.glassFg : TOKENS.ink;
  const fgFaint = isGlass ? TOKENS.glassFgFaint : TOKENS.inkFaint;
  const pillBg = isGlass ? TOKENS.glassPillBg : TOKENS.paperPillBg;
  const pillBorder = isGlass ? TOKENS.glassBorder : TOKENS.paperBorder;

  const totalWidth = cardSize * effectiveSlides.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      toPrev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      toNext();
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn("relative flex h-full w-full flex-col items-center justify-center overflow-hidden select-none outline-none", className)}
      style={{ backgroundColor: bg, color: fg, fontFamily: "'Helvetica Neue', Arial, sans-serif", ...style }}
      {...props}
    >
      <div className="mb-12" style={{ width: cardSize, overflow: "visible" }}>
        <motion.div
          className="flex"
          style={{ width: totalWidth }}
          animate={{ x: -activeIndex * cardSize }}
          transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
        >
          {effectiveSlides.map((item, i) => {
            const isActive = activeIndex === i;
            const delta = i - activeIndex;
            return (
              <motion.div
                key={i}
                onClick={() => !isActive && toSlide(i)}
                className="flex shrink-0 flex-col items-center gap-2.5 [will-change:transform]"
                style={{ width: cardSize, height: cardSize, cursor: isActive ? "default" : "pointer" }}
                animate={{ rotate: delta * rotateAngle, scale: isActive ? 1 : inactiveScale, y: delta * (cardSize * (yOffset / 100)) }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
              >
                <div className="relative h-full w-full shrink-0 overflow-hidden" style={{ borderRadius: cardBorderRadius }}>
                  <img src={item.src} alt={item.title} className="block h-full w-full object-cover" />

                  <div
                    className="pointer-events-none absolute inset-0 transition-opacity duration-[400ms]"
                    // Source's "opacity 400ms ease" uses the CSS default
                    // "ease" — Tailwind's ease-out utility is a different
                    // curve (cubic-bezier(0,0,0.2,1)), not a match.
                    style={{
                      background:
                        titleAlign === "center"
                          ? "rgba(0,0,0,0.28)"
                          : "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.12) 45%, transparent 100%)",
                      opacity: isActive ? 1 : 0.6,
                      transitionTimingFunction: "ease",
                    }}
                  />

                  <div
                    className="pointer-events-none absolute inset-0 bg-black/[0.22] transition-opacity duration-[400ms]"
                    style={{ opacity: isActive ? 0 : 1, transitionTimingFunction: "ease" }}
                  />

                  <motion.div
                    className="pointer-events-none absolute font-semibold text-white [will-change:opacity,filter]"
                    style={{
                      ...(titleAlign === "center"
                        ? { top: "50%", left: 0, right: 0, textAlign: "center" as const, padding: "0 16px" }
                        : titleAlign === "bottom-center"
                          ? { bottom: 16, left: 0, right: 0, textAlign: "center" as const, padding: "0 16px" }
                          : { bottom: 16, left: 16, right: 16, textAlign: "left" as const }),
                      fontSize: titleSize,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                    animate={{
                      opacity: isActive ? 1 : 0.72,
                      filter: isActive ? "blur(0px)" : "blur(0.5px)",
                      y: titleAlign === "center" ? (isActive ? "-50%" : "-44%") : isActive ? 0 : 4,
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {item.title}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div
        className="flex items-center gap-2 rounded-full px-2.5 py-1.5"
        style={{
          backgroundColor: pillBg,
          backdropFilter: isGlass ? "blur(24px) saturate(180%)" : undefined,
          WebkitBackdropFilter: isGlass ? "blur(24px) saturate(180%)" : undefined,
          border: `1px solid ${pillBorder}`,
          boxShadow: isGlass ? "0 4px 24px rgba(0,0,0,0.32)" : "0 1px 4px rgba(34,30,27,0.08)",
        }}
      >
        <button
          onClick={toPrev}
          className="flex items-center justify-center rounded-md border-none bg-transparent px-2.5 py-1.5 transition-opacity duration-200"
          // Source's "opacity 200ms ease" needs an explicit ease override —
          // Tailwind's transition-opacity defaults to a different curve.
          style={{ color: fg, cursor: activeIndex === 0 ? "default" : "pointer", opacity: activeIndex === 0 ? 0.3 : 1, transitionTimingFunction: "ease" }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex items-center gap-1.5 px-1">
          {effectiveSlides.map((_, i) => (
            <div
              key={i}
              onClick={() => toSlide(i)}
              className="h-1.75 shrink-0 cursor-pointer rounded-full"
              style={{
                width: activeIndex === i ? 24 : 7,
                backgroundColor: activeIndex === i ? fg : fgFaint,
                transition: `width 300ms ${TOKENS.easeSignature}, background-color 300ms ease`,
              }}
            />
          ))}
        </div>

        <button
          onClick={toNext}
          className="flex items-center justify-center rounded-md border-none bg-transparent px-2.5 py-1.5 transition-opacity duration-200"
          style={{
            color: fg,
            cursor: activeIndex === effectiveSlides.length - 1 ? "default" : "pointer",
            opacity: activeIndex === effectiveSlides.length - 1 ? 0.3 : 1,
            transitionTimingFunction: "ease",
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

          </div>
  );
}
