"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TiltedCarouselSlide {
  src: string;
  title: string;
}

export type TiltedCarouselTitleAlign = "bottom-left" | "bottom-center" | "center";
export type TiltedCarouselTheme = "paper" | "glass";

export interface TiltedCarouselProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  slides?: TiltedCarouselSlide[];
  cardWidth?: number;
  cardBorderRadius?: number;
  tiltAngle?: number;
  theme?: TiltedCarouselTheme;
  titleAlign?: TiltedCarouselTitleAlign;
  titleSize?: number;
  initialIndex?: number;
}

const DEFAULT_SLIDES: TiltedCarouselSlide[] = [
  { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80", title: "mountain ridge" },
  { src: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=500&q=80", title: "night scene" },
  { src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80", title: "yellow wildflowers" },
  { src: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=500&q=80", title: "street scene" },
  { src: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=500&q=80", title: "bicycle shop" },
  { src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&q=80", title: "train window view" },
  { src: "https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?w=500&q=80", title: "train tracks" },
  { src: "https://images.unsplash.com/photo-1555529771-7888783a18d3?w=500&q=80", title: "convenience store" },
  { src: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=500&q=80", title: "city street" },
  { src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&q=80", title: "japanese culture" },
];

const TOKENS = {
  paper: "#f5f5f5",
  ink: "#221e1b",
  inkFaint: "rgba(34,30,27,0.45)",
  glassBg: "rgba(20,18,17,0.88)",
  glassFg: "#ffffff",
  glassFgFaint: "rgba(255,255,255,0.45)",
  glassBorder: "rgba(255,255,255,0.12)",
  glassPillBg: "rgba(255,255,255,0.10)",
  paperPillBg: "#ffffff",
  paperBorder: "rgba(34,30,27,0.10)",
  easeSignature: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export function TiltedCarousel({
  slides = DEFAULT_SLIDES,
  cardWidth = 200,
  cardBorderRadius = 12,
  tiltAngle = 60,
  theme = "paper",
  titleAlign = "bottom-left",
  titleSize = 14,
  initialIndex = 3,
  className,
  style,
  ...props
}: TiltedCarouselProps) {
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

  const cardHeight = cardWidth * (4 / 3);
  const totalWidth = cardWidth * effectiveSlides.length;

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
      <div className="mb-10" style={{ width: cardWidth, overflow: "visible" }}>
        <motion.div
          className="flex"
          style={{ width: totalWidth }}
          animate={{ x: -activeIndex * cardWidth }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
        >
          {effectiveSlides.map((item, i) => {
            const isActive = activeIndex === i;
            return (
              <div key={i} className="shrink-0" style={{ width: cardWidth, perspective: 800 }}>
                <motion.div
                  className="flex flex-col items-center gap-2 [will-change:transform]"
                  style={{ width: cardWidth, height: cardHeight }}
                  animate={{ rotateY: (activeIndex - i) * tiltAngle, scale: isActive ? 1 : 0.85 }}
                  transition={{ type: "spring", bounce: 0.1, duration: 1 }}
                >
                  <div
                    onClick={() => toSlide(i)}
                    className="relative shrink-0 cursor-pointer overflow-hidden"
                    style={{ width: "100%", height: cardHeight, borderRadius: cardBorderRadius }}
                  >
                    <img src={item.src} alt={item.title} className="block h-full w-full object-cover" />

                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          titleAlign === "center"
                            ? "rgba(0,0,0,0.28)"
                            : "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.10) 45%, transparent 100%)",
                        opacity: isActive ? 1 : 0.5,
                        transition: "opacity 400ms ease",
                      }}
                    />

                    <motion.div
                      className="pointer-events-none absolute font-semibold text-white [will-change:opacity,filter]"
                      style={{
                        ...(titleAlign === "center"
                          ? { top: "50%", left: 0, right: 0, textAlign: "center" as const, padding: "0 14px" }
                          : titleAlign === "bottom-center"
                            ? { bottom: 14, left: 0, right: 0, textAlign: "center" as const, padding: "0 14px" }
                            : { bottom: 14, left: 14, right: 14, textAlign: "left" as const }),
                        fontSize: titleSize,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                      }}
                      animate={{
                        opacity: isActive ? 1 : 0.65,
                        filter: isActive ? "blur(0px)" : "blur(0.5px)",
                        y: titleAlign === "center" ? (isActive ? "-50%" : "-44%") : isActive ? 0 : 4,
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {item.title}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
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
          className="flex items-center justify-center rounded-md border-none bg-transparent px-2.5 py-1.5"
          style={{ color: fg, opacity: activeIndex === 0 ? 0.3 : 1, transition: "opacity 200ms ease" }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex items-center justify-center px-1" style={{ gap: 5 }}>
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
          className="flex items-center justify-center rounded-md border-none bg-transparent px-2.5 py-1.5"
          style={{ color: fg, opacity: activeIndex === effectiveSlides.length - 1 ? 0.3 : 1, transition: "opacity 200ms ease" }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

          </div>
  );
}
