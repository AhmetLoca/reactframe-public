"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type GlowCardTextPosition = "top-left" | "top-center" | "top-right" | "center-left" | "center" | "center-right" | "bottom-left" | "bottom-center" | "bottom-right";

export interface GlowCardProps {
  text?: string;
  fontSize?: number;
  textColor?: string;
  textPosition?: GlowCardTextPosition;
  backgroundImage?: string;
  backgroundColor?: string;
  overlayOpacity?: number;
  colors?: string[];
  radius?: number;
  padding?: number;
  glowWidth?: number;
  glowBlur?: number;
  duration?: number;
  className?: string;
}

const DEFAULT_COLORS = ["#FF375F", "#FF8A00", "#FFD60A", "#34C759", "#64D2FF", "#0A84FF", "#BF5AF2"];

export function GlowCard({
  text = "I'm a card with an inner glow",
  fontSize = 28,
  textColor = "#F5F5F7",
  textPosition = "center",
  backgroundImage,
  backgroundColor = "#1C1C1E",
  overlayOpacity = 0.55,
  colors = DEFAULT_COLORS,
  radius = 24,
  padding = 32,
  glowWidth = 28,
  glowBlur = 20,
  duration = 6,
  className,
}: GlowCardProps) {
  const uid = React.useId().replace(/[:]/g, "");
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [vertical, horizontal] = textPosition === "center" ? ["center", "center"] : textPosition.split("-");
  const alignItems = vertical === "top" ? "flex-start" : vertical === "bottom" ? "flex-end" : "center";
  const justifyContent = horizontal === "left" ? "flex-start" : horizontal === "right" ? "flex-end" : "center";
  const textAlign = horizontal === "left" ? "left" : horizontal === "right" ? "right" : "center";

  const stops = colors.length > 0 ? colors : DEFAULT_COLORS;
  const gradientStops = [...stops, stops[0]].join(", ");
  const className_ = `glow-card-${uid}`;

  return (
    <div
      ref={rootRef}
      className={cn("relative isolate flex h-full w-full overflow-hidden", className_, className)}
      style={{ alignItems, justifyContent, borderRadius: radius, padding, backgroundColor }}
    >
      {backgroundImage && (
        <>
          <img src={backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ zIndex: 0 }} />
          <div className="pointer-events-none absolute inset-0" style={{ zIndex: 1, backgroundColor, opacity: overlayOpacity, mixBlendMode: "multiply" }} />
        </>
      )}
      <p
        className="relative m-0"
        style={{ zIndex: 3, textAlign, color: textColor, fontSize, fontWeight: 600, lineHeight: "1.25em", letterSpacing: "-0.01em", textWrap: "balance" }}
      >
        {text}
      </p>
      <style>{`
        @property --glow-angle-${uid} {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes glow-spin-${uid} {
          to { --glow-angle-${uid}: 1turn; }
        }
        .${className_}::before {
          content: '';
          position: absolute;
          z-index: 2;
          inset: -${glowWidth * 0.8}px;
          border: solid ${glowWidth}px;
          border-image: conic-gradient(from var(--glow-angle-${uid}), ${gradientStops}) 1;
          filter: blur(${glowBlur}px);
          animation: glow-spin-${uid} ${duration}s linear infinite;
          animation-play-state: ${isVisible ? "running" : "paused"};
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
