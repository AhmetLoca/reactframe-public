"use client";

import * as React from "react";
import { useScroll } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CardStackItem {
  image?: string;
  tag?: string;
  title?: string;
  description?: string;
  accentColor?: string;
  cardBg?: string;
}

export interface CardStackProps {
  cards?: CardStackItem[];
  heading?: string;
  subheading?: string;
  headingColor?: string;
  background?: string;
  cardWidth?: number;
  cardRadius?: number;
  textColor?: string;
  showDots?: boolean;
  dotColor?: string;
  showCounter?: boolean;
  className?: string;
}

const DEFAULT_CARDS: CardStackItem[] = [
  { tag: "Integrations", title: "Seamless Data Integration", description: "Connect your entire stack in minutes. Sync data from 500+ apps without writing a single line of code.", accentColor: "#2563eb", cardBg: "#ffffff" },
  { tag: "Automation", title: "AI-Powered Workflows", description: "Let our intelligent engine handle repetitive tasks. Define your workflow once and automate forever.", accentColor: "#7c3aed", cardBg: "#ffffff" },
  { tag: "Analytics", title: "Real-time Insights", description: "Actionable data at a glance. Beautiful dashboards built for speed and clarity across your whole team.", accentColor: "#059669", cardBg: "#ffffff" },
  { tag: "Security", title: "Enterprise-Grade Security", description: "End-to-end encryption, MFA and global compliance baked in. Your data stays yours — always.", accentColor: "#d97706", cardBg: "#ffffff" },
];

// Fly direction alternates left/right per card.
const FLY_DIRS = [1, -1, 1, -1, 1, -1, 1, -1];

function getCardStyle(relPos: number, sp: number, cardIdx: number): React.CSSProperties {
  if (relPos < 0) {
    const dir = FLY_DIRS[cardIdx % FLY_DIRS.length];
    return { transform: `translate(${dir * 180}px, -580px) rotate(${dir * 28}deg) scale(0.8)`, opacity: 0, zIndex: 0, pointerEvents: "none" };
  }

  if (relPos === 0) {
    const dir = FLY_DIRS[cardIdx % FLY_DIRS.length];
    const x = sp * dir * 155;
    const y = sp * -520;
    const rotate = sp * dir * 26;
    const scale = 1 - sp * 0.06;
    const opacity = Math.max(0, 1 - sp * 1.9);
    return { transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`, opacity, zIndex: 50, pointerEvents: "none" };
  }

  const depth = relPos - sp;
  const scale = Math.max(0.82, 1 - depth * 0.05);
  const yPeek = depth * 16;
  const brightness = Math.max(0.86, 1 - depth * 0.045);
  const opacity = relPos > 3 ? 0 : 1;

  return { transform: `translate(0px, ${yPeek}px) scale(${scale})`, filter: `brightness(${brightness})`, opacity, zIndex: 50 - relPos, pointerEvents: "none" };
}

export function CardStack({
  cards = DEFAULT_CARDS,
  heading = "",
  subheading = "",
  headingColor = "#111111",
  background = "#ebebf0",
  cardWidth = 520,
  cardRadius = 24,
  textColor = "#111111",
  showDots = true,
  dotColor = "#111111",
  showCounter = true,
  className,
}: CardStackProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [sectionProgress, setSectionProgress] = React.useState(0);

  const safeCards = cards.length > 0 ? cards : DEFAULT_CARDS;
  const n = safeCards.length;

  const [winW, setWinW] = React.useState(1440);
  React.useEffect(() => {
    const update = () => setWinW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile = winW < 768;
  const rCardW = isMobile ? winW - 48 : Math.min(cardWidth, winW - 80);

  const { scrollYProgress } = useScroll({ target: containerRef as React.RefObject<HTMLElement>, offset: ["start start", "end end"] });

  React.useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const raw = v * n;
      const floorRaw = Math.floor(raw);
      const idx = Math.min(floorRaw, n - 1);
      setActiveIndex(idx);
      // Last card never flies away — clamp sp to 0 for last section.
      const sp = idx === n - 1 ? 0 : raw - floorRaw;
      setSectionProgress(sp);
    });
  }, [scrollYProgress, n]);

  const accentZoneH = isMobile ? 148 : 186;
  const contentZoneH = isMobile ? 156 : 178;
  const cardH = accentZoneH + contentZoneH;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)} style={{ height: `${n * 100}vh`, background }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {(heading || subheading) && (
          <div className={cn("text-center", isMobile ? "mb-7" : "mb-9")} style={{ width: rCardW, maxWidth: rCardW }}>
            {heading && (
              <h2 className={cn("m-0 mb-2.5 leading-[1.1] font-bold tracking-[-0.025em]", isMobile ? "text-[26px]" : "text-4xl")} style={{ color: headingColor }}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={cn("m-0 leading-relaxed font-normal", isMobile ? "text-sm" : "text-base")} style={{ color: headingColor, opacity: 0.5 }}>
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className="relative" style={{ width: rCardW, height: cardH }}>
          {safeCards.map((card, i) => {
            const relPos = i - activeIndex;
            if (relPos > 4 || relPos < -1) return null;

            const accent = card.accentColor || "#2563eb";
            const bg = card.cardBg || "#fff";
            const cardStyle = getCardStyle(relPos, sectionProgress, i);

            return (
              <div key={i} className="absolute top-0 left-0 w-full will-change-transform" style={cardStyle}>
                <div
                  className="flex w-full flex-col overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.13),0_4px_16px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]"
                  style={{ height: cardH, borderRadius: cardRadius, background: bg }}
                >
                  <div className="relative shrink-0 overflow-hidden" style={{ height: accentZoneH, background: card.image ? undefined : `linear-gradient(135deg, ${accent}22 0%, ${accent}08 100%)` }}>
                    {card.image ? (
                      <img src={card.image} alt={card.title || ""} className="block h-full w-full object-cover" />
                    ) : (
                      <>
                        <div className="absolute -top-6 -right-6 h-[150px] w-[150px] rounded-full blur-[36px]" style={{ background: accent, opacity: 0.11 }} />
                        <div className="absolute -bottom-3 -left-2 h-[90px] w-[90px] rounded-full blur-[22px]" style={{ background: accent, opacity: 0.07 }} />
                        <div className="absolute bottom-[22px] left-[26px] h-11 w-11 rounded-[13px]" style={{ background: accent, opacity: 0.16 }} />
                        <div className="absolute bottom-[30px] left-[34px] h-7 w-7 rounded-lg" style={{ background: accent, opacity: 0.26 }} />
                      </>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between px-6.5 pt-5 pb-5.5">
                    <div>
                      <div className="mb-3 inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.01em]" style={{ background: `${accent}16`, color: accent }}>
                        {card.tag || "Feature"}
                      </div>
                      <h3 className={cn("mt-0 mb-2 font-bold tracking-[-0.015em]", isMobile ? "text-lg" : "text-xl")} style={{ color: textColor, lineHeight: 1.2 }}>
                        {card.title || `Feature ${i + 1}`}
                      </h3>
                      <p className={cn("m-0 leading-relaxed", isMobile ? "text-[13px]" : "text-sm")} style={{ color: textColor, opacity: 0.55 }}>
                        {card.description || ""}
                      </p>
                    </div>

                    {showCounter && (
                      <div className="mt-2 text-right text-[11px] font-semibold tracking-[0.06em]" style={{ color: textColor, opacity: 0.18 }}>
                        {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showDots && (
          <div className="mt-7 flex items-center gap-2">
            {safeCards.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-[width,opacity] duration-300"
                style={{ width: i === activeIndex ? 24 : 6, background: dotColor, opacity: i === activeIndex ? 1 : 0.22 }}
              />
            ))}
          </div>
        )}

              </div>
    </div>
  );
}
