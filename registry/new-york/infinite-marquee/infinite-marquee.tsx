"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type InfiniteMarqueeDirection = "left" | "right";
export type InfiniteMarqueeTextStyle = "solid" | "gradient" | "outline";

export interface InfiniteMarqueeProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  text: string;
  separator?: string;
  speed?: number;
  direction?: InfiniteMarqueeDirection;
  pauseOnHover?: boolean;
  repeatCount?: number;
  fontSize?: number;
  fontWeight?: number | string;
  fontFamily?: string;
  letterSpacing?: number;
  uppercase?: boolean;
  gap?: number;
  separatorGap?: number;
  textStyle?: InfiniteMarqueeTextStyle;
  textColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: number;
  strokeColor?: string;
  strokeWidth?: number;
  separatorColor?: string;
  doubleRow?: boolean;
  rowGap?: number;
  fadeEdges?: boolean;
  fadeWidth?: number;
  backgroundColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
  borderRadius?: number;
}

function MarqueeRow({
  displayText,
  separator,
  items,
  isReverse,
  speed,
  isPaused,
  computedTextStyle,
  sepStyle,
  itemGap,
  separatorGap,
}: {
  displayText: string;
  separator?: string;
  items: number[];
  isReverse: boolean;
  speed: number;
  isPaused: boolean;
  computedTextStyle: React.CSSProperties;
  sepStyle: React.CSSProperties;
  itemGap: number;
  separatorGap: number;
}) {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [duration, setDuration] = React.useState(10);

  React.useLayoutEffect(() => {
    if (!innerRef.current) return;
    const halfWidth = innerRef.current.scrollWidth / 2;
    if (halfWidth > 0) setDuration(halfWidth / speed);
  }, [displayText, separator, itemGap, items.length, speed]);

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={innerRef}
        aria-hidden
        className="im-track inline-flex items-center will-change-transform"
        style={{
          animationName: isReverse ? "im-marquee-rtl" : "im-marquee-ltr",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {[...items, ...items].map((_, idx) => (
          <span key={idx} className="inline-flex items-center whitespace-nowrap" style={{ gap: itemGap }}>
            <span style={computedTextStyle}>{displayText}</span>
            {separator && (
              <span style={{ ...sepStyle, marginRight: separatorGap }}>{separator}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function InfiniteMarquee({
  text,
  separator = "✦",
  speed = 80,
  direction = "left",
  pauseOnHover = false,
  repeatCount = 6,
  fontSize = 48,
  fontWeight = 700,
  fontFamily = "Inter, sans-serif",
  letterSpacing = -1,
  uppercase = true,
  gap = 32,
  separatorGap = 32,
  textStyle = "solid",
  textColor = "#FFFFFF",
  gradientFrom = "#FF6B6B",
  gradientTo = "#4ECDC4",
  gradientAngle = 90,
  strokeColor = "#FFFFFF",
  strokeWidth = 1.5,
  separatorColor = "#FFFFFF",
  doubleRow = false,
  rowGap = 0,
  fadeEdges = false,
  fadeWidth = 100,
  backgroundColor = "#000000",
  paddingTop = 20,
  paddingBottom = 20,
  borderRadius = 0,
  className,
  ...props
}: InfiniteMarqueeProps) {
  const [isPaused, setIsPaused] = React.useState(false);
  const [isInView, setIsInView] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isReverse = direction === "right";
  const displayText = uppercase ? text.toUpperCase() : text;
  const items = React.useMemo(() => Array.from({ length: Math.max(repeatCount, 2) }, (_, i) => i), [repeatCount]);

  const computedTextStyle: React.CSSProperties = React.useMemo(() => {
    const base: React.CSSProperties = { fontSize, fontWeight, fontFamily, letterSpacing, lineHeight: 1 };
    if (textStyle === "gradient") {
      return {
        ...base,
        background: `linear-gradient(${gradientAngle}deg, ${gradientFrom}, ${gradientTo})`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      };
    }
    if (textStyle === "outline") {
      return { ...base, WebkitTextStroke: `${strokeWidth}px ${strokeColor}`, WebkitTextFillColor: "transparent", color: "transparent" };
    }
    return { ...base, color: textColor };
  }, [fontSize, fontWeight, fontFamily, letterSpacing, textColor, textStyle, strokeColor, gradientFrom, gradientTo, gradientAngle, strokeWidth]);

  const sepStyle: React.CSSProperties = React.useMemo(
    () => ({ color: separatorColor, fontSize: fontSize * 0.7, lineHeight: 1, flexShrink: 0, fontFamily }),
    [separatorColor, fontSize, fontFamily],
  );

  const maskImage = fadeEdges
    ? `linear-gradient(to right, transparent 0%, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent 100%)`
    : undefined;

  const rowProps = { displayText, separator, items, speed, isPaused: isPaused || !isInView, computedTextStyle, sepStyle, itemGap: gap, separatorGap };
  const srLabel = `${displayText}${separator ? " " + separator : ""}`;

  return (
    <div ref={containerRef} className={cn("flex w-full flex-col items-center", className)} {...props}>
      <style>{`
        @keyframes im-marquee-ltr { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes im-marquee-rtl { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) {
          .im-track { animation: none !important; }
        }
      `}</style>
      <div
        role="marquee"
        aria-label={srLabel}
        className="box-border flex w-full flex-col overflow-hidden"
        style={{
          backgroundColor: backgroundColor,
          paddingTop,
          paddingBottom,
          borderRadius,
          gap: doubleRow ? rowGap : 0,
          cursor: pauseOnHover ? "pointer" : "default",
          WebkitMaskImage: maskImage,
          maskImage,
        }}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        <span className="sr-only">{srLabel}</span>
        <MarqueeRow {...rowProps} isReverse={isReverse} />
        {doubleRow && <MarqueeRow {...rowProps} isReverse={!isReverse} />}
      </div>

          </div>
  );
}
