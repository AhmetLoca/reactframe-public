"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LogoMarqueeItem {
  image?: string;
  name: string;
  link?: string;
  height?: number;
  imageScale?: number;
}

export interface LogoMarqueeProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  logos?: LogoMarqueeItem[];
  logoHeight?: number;
  gap?: number;
  direction?: "left" | "right";
  speed?: number;
  pauseOnHover?: boolean;
  grayscale?: boolean;
  hoverReveal?: boolean;
  hoverScale?: number;
  edgeFade?: boolean;
  edgeBlur?: boolean;
  fadeWidth?: number;
  transparentBackground?: boolean;
  backgroundColor?: string;
}

const DEFAULT_LOGOS: LogoMarqueeItem[] = [
  { name: "Microsoft" },
  { name: "Apple" },
  { name: "Spotify" },
  { name: "OpenAI" },
  { name: "Google" },
  { name: "Meta" },
  { name: "WhatsApp" },
  { name: "Figma" },
];

export function LogoMarquee({
  logos = DEFAULT_LOGOS,
  logoHeight = 36,
  gap = 64,
  direction = "left",
  speed = 60,
  pauseOnHover = true,
  grayscale = true,
  hoverReveal = true,
  hoverScale = 1.1,
  edgeFade = true,
  edgeBlur = true,
  fadeWidth = 80,
  transparentBackground = true,
  backgroundColor = "#ffffff",
  className,
  ...props
}: LogoMarqueeProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = React.useState(0);
  const [hoveredKey, setHoveredKey] = React.useState<number | null>(null);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setTrackWidth(w);
    });
    ro.observe(el);
    const rect = el.getBoundingClientRect();
    if (rect.width > 0) setTrackWidth(rect.width);
    return () => ro.disconnect();
  }, [logos, logoHeight, gap]);

  const n = logos.length;
  const duration = trackWidth > 0 && speed > 0 ? trackWidth / speed : 20;
  const animName = direction === "left" ? "lmq-left" : "lmq-right";
  const spinning = n > 0 && trackWidth > 0;

  const renderLogo = (logo: LogoMarqueeItem, i: number, copy: number) => {
    const key = `${copy}-${i}`;
    const hoverKey = copy * 1000 + i;
    const isHovered = hoveredKey === hoverKey;
    const itemHeight = logo.height && logo.height > 0 ? logo.height : logoHeight;
    const imageScale = logo.imageScale && logo.imageScale > 0 ? logo.imageScale / 100 : 1;

    const content = (
      <div
        onMouseEnter={() => setHoveredKey(hoverKey)}
        onMouseLeave={() => setHoveredKey(null)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: itemHeight,
          cursor: logo.link ? "pointer" : "default",
          transform: `scale(${isHovered ? hoverScale : 1})`,
          transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), filter 0.3s ease, opacity 0.3s ease",
          filter: grayscale && !(hoverReveal && isHovered) ? "grayscale(1)" : "grayscale(0)",
          opacity: grayscale && !(hoverReveal && isHovered) ? 0.85 : 1,
        }}
      >
        {logo.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo.image}
            alt={logo.name || ""}
            draggable={false}
            style={{
              height: itemHeight * imageScale,
              width: "auto",
              objectFit: "contain",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        ) : (
          <span
            className="text-[#f5f4f1]"
            style={{
              fontSize: itemHeight * 0.5,
              fontWeight: 700,
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {logo.name || "Logo"}
          </span>
        )}
      </div>
    );

    return (
      <div key={key} style={{ flexShrink: 0, marginRight: gap }}>
        {logo.link ? (
          <a href={logo.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    );
  };

  return (
    <div
      className={cn("relative flex min-h-px min-w-px w-full items-center overflow-hidden", className)}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        backgroundColor: transparentBackground ? "transparent" : backgroundColor,
        maskImage: edgeFade ? `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)` : undefined,
        WebkitMaskImage: edgeFade ? `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)` : undefined,
      }}
      {...props}
    >
      <style>{`
        @keyframes lmq-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes lmq-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
      <div
        className="flex shrink-0"
        style={{
          width: "max-content",
          ...(spinning && {
            animation: `${animName} ${duration}s linear infinite ${isPaused ? "paused" : "running"}`,
          }),
        }}
      >
        <div ref={trackRef} className="flex shrink-0">
          {logos.map((logo, i) => renderLogo(logo, i, 0))}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {logos.map((logo, i) => renderLogo(logo, i, 1))}
        </div>
      </div>

      {edgeBlur && (
        <>
          <div
            aria-hidden="true"
            style={{
              pointerEvents: "none",
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              zIndex: 10,
              width: fadeWidth,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              maskImage: "linear-gradient(to right, black, transparent)",
              WebkitMaskImage: "linear-gradient(to right, black, transparent)",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              pointerEvents: "none",
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              zIndex: 10,
              width: fadeWidth,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              maskImage: "linear-gradient(to left, black, transparent)",
              WebkitMaskImage: "linear-gradient(to left, black, transparent)",
            }}
          />
        </>
      )}

      {n === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[13px] text-[#f5f4f1]/30">
          Add logos via the `logos` prop
        </div>
      )}
    </div>
  );
}
