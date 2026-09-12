"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface FeatureMediaHighlightHeading {
  text: string;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
}

export interface FeatureMediaHighlightSubtitle {
  text: string;
  color?: string;
  highlightColor?: string;
  fontSize?: number;
}

export interface FeatureMediaHighlightMedia {
  type?: "image" | "video";
  image?: string;
  video?: string;
  position?: "right" | "left";
  aspectRatio?: number;
  radius?: number;
  fit?: "cover" | "contain";
  background?: string;
}

export interface FeatureMediaHighlightProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  heading?: FeatureMediaHighlightHeading;
  subtitle1?: FeatureMediaHighlightSubtitle;
  showSubtitle2?: boolean;
  subtitle2?: FeatureMediaHighlightSubtitle;
  contentGap?: number;
  media?: FeatureMediaHighlightMedia;
  sectionGap?: number;
  backgroundColor?: string;
  cardRadius?: number;
  showShadow?: boolean;
  verticalPadding?: number;
  horizontalPadding?: number;
  mobileBreakpoint?: number;
}

/** Renders "plain **highlighted** plain" as styled spans — a tiny inline-bold markup, no markdown lib needed. */
function RichText({ text, color, highlightColor }: { text: string; color?: string; highlightColor?: string }) {
  const parts = (text || "").split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <span key={i} className="font-bold" style={{ color: highlightColor }}>
            {part.slice(2, -2)}
          </span>
        ) : (
          <span key={i} style={{ color }}>
            {part}
          </span>
        )
      )}
    </>
  );
}

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function FeatureMediaHighlight({
  heading = { text: "Low fees,\nno hidden costs", color: "#111111", fontSize: 44, fontWeight: 700 },
  subtitle1 = {
    text: "Trade on US exchanges for **just $1.50** per order.",
    color: "#6b6b6b",
    highlightColor: "#4F46E5",
    fontSize: 17,
  },
  showSubtitle2 = true,
  subtitle2 = {
    text: "Trade locally with zero commission — **no account fees**, no clearing or custody charges.",
    color: "#6b6b6b",
    highlightColor: "#4F46E5",
    fontSize: 17,
  },
  contentGap = 24,
  media = {
    type: "image",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
    position: "right",
    fit: "cover",
    aspectRatio: 1.1,
    radius: 24,
    background: "#eeeeee",
  },
  sectionGap = 64,
  backgroundColor = "#ffffff",
  cardRadius = 0,
  showShadow = false,
  verticalPadding = 72,
  horizontalPadding = 64,
  mobileBreakpoint = 720,
  className,
  style,
  ...props
}: FeatureMediaHighlightProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(1200);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isStacked = width < mobileBreakpoint;
  const mediaFirst = !isStacked && media.position === "left";
  const mediaType = media.type ?? "image";
  const mediaFit = media.fit ?? "cover";

  return (
    <div ref={wrapRef} className={cn("box-border h-full w-full", className)} style={style} {...props}>
      <div
        className="box-border flex h-full w-full items-center"
        style={{
          background: backgroundColor,
          borderRadius: cardRadius,
          padding: `${verticalPadding}px ${horizontalPadding}px`,
          flexDirection: isStacked ? "column" : mediaFirst ? "row-reverse" : "row",
          gap: sectionGap,
          boxShadow: showShadow ? "0 8px 60px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)" : undefined,
          display: "flex",
        }}
      >
        <div className="flex min-w-0 flex-col justify-center" style={{ flex: isStacked ? "none" : "1 1 50%" }}>
          <motion.h2
            {...fadeIn(0)}
            className="m-0 leading-[1.15] tracking-tight whitespace-pre-line"
            style={{ fontWeight: heading.fontWeight, fontSize: heading.fontSize, color: heading.color, letterSpacing: -0.5 }}
          >
            {heading.text}
          </motion.h2>

          <motion.p {...fadeIn(0.08)} className="m-0" style={{ marginTop: contentGap, fontSize: subtitle1.fontSize, lineHeight: 1.6 }}>
            <RichText text={subtitle1.text} color={subtitle1.color} highlightColor={subtitle1.highlightColor} />
          </motion.p>

          {showSubtitle2 && subtitle2.text && (
            <motion.p {...fadeIn(0.16)} className="m-0" style={{ marginTop: contentGap, fontSize: subtitle2.fontSize, lineHeight: 1.6 }}>
              <RichText text={subtitle2.text} color={subtitle2.color} highlightColor={subtitle2.highlightColor} />
            </motion.p>
          )}
        </div>

        <motion.div {...fadeIn(0.12)} className="flex min-w-0" style={{ flex: isStacked ? "none" : "1 1 50%" }}>
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: String(media.aspectRatio ?? 1.1), borderRadius: media.radius ?? 24, background: media.background ?? "#eeeeee" }}
          >
            {mediaType === "video" && media.video ? (
              <video src={media.video} autoPlay loop muted playsInline className="block h-full w-full" style={{ objectFit: mediaFit }} />
            ) : mediaType === "image" && media.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.image} alt="" className="block h-full w-full" style={{ objectFit: mediaFit }} />
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
