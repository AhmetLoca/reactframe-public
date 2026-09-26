"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useMotionValue, type MotionValue } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TOKENS = {
  paper: "#f4f3f1",
  ink: "#0d0d0d",
  glassBorderSoft: "rgba(255,255,255,0.12)",
  uiFontFamily: "'Helvetica Neue', Arial, sans-serif",
} as const;

const IPAD_W = 1194;
const IPAD_H = 834;

interface IPadFrameProps {
  width: number;
  frameColor: string;
  orientation: string;
  showShadow: boolean;
  glareX: MotionValue<number>;
  glareY: MotionValue<number>;
  children?: React.ReactNode;
}

function IPadFrame({ width, frameColor, orientation, showShadow, glareX, glareY, children }: IPadFrameProps) {
  const isLand = orientation !== "Portrait";
  const baseW = isLand ? IPAD_W : IPAD_H;
  const baseH = isLand ? IPAD_H : IPAD_W;
  const s = width / baseW;
  const height = baseH * s;
  const silver = frameColor !== "Space Gray";

  const frameGrad = silver
    ? "linear-gradient(158deg, #e2e2e2 0%, #c4c4c4 40%, #d0d0d0 70%, #b2b2b2 100%)"
    : "linear-gradient(158deg, #484848 0%, #343434 40%, #3c3c3c 70%, #262626 100%)";

  const outerShadow = !showShadow
    ? "none"
    : silver
      ? [
          "0 0 0 1px rgba(255,255,255,0.72)",
          "0 32px 80px rgba(0,0,0,0.24)",
          "0 8px 20px rgba(0,0,0,0.13)",
          "inset 0 1px 0 rgba(255,255,255,0.94)",
          "inset 0 -1px 0 rgba(0,0,0,0.05)",
        ].join(", ")
      : ["0 0 0 1px rgba(255,255,255,0.07)", "0 32px 80px rgba(0,0,0,0.64)", "0 8px 20px rgba(0,0,0,0.42)", "inset 0 1px 0 rgba(255,255,255,0.06)"].join(", ");

  const btnT = silver ? "linear-gradient(180deg, #b2b2b2, #cccccc)" : "linear-gradient(180deg, #2a2a2a, #404040)";
  const btnS = silver ? "linear-gradient(90deg, #b2b2b2, #cccccc)" : "linear-gradient(90deg, #2a2a2a, #404040)";

  const R = 22 * s;
  const Ri = 17 * s;
  const Rs = 13 * s;

  const glareBackground = useTransform([glareX, glareY], ([x, y]) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(255,255,255,0.10) 0%, transparent 65%)`);

  return (
    <div style={{ width, height, position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: frameGrad, borderRadius: R, boxShadow: outerShadow }} />

      {isLand ? (
        <>
          <div style={{ position: "absolute", top: -3.5 * s, right: 78 * s, width: 58 * s, height: 4 * s, background: btnT, borderRadius: "3px 3px 0 0", boxShadow: "0 -2px 5px rgba(0,0,0,0.18)" }} />
          <div style={{ position: "absolute", right: -3.5 * s, top: 100 * s, width: 4 * s, height: 52 * s, background: btnS, borderRadius: "0 3px 3px 0", boxShadow: "2px 0 5px rgba(0,0,0,0.18)" }} />
          <div style={{ position: "absolute", right: -3.5 * s, top: 164 * s, width: 4 * s, height: 52 * s, background: btnS, borderRadius: "0 3px 3px 0", boxShadow: "2px 0 5px rgba(0,0,0,0.18)" }} />
        </>
      ) : (
        <>
          <div style={{ position: "absolute", top: -3.5 * s, right: 78 * s, width: 58 * s, height: 4 * s, background: btnT, borderRadius: "3px 3px 0 0", boxShadow: "0 -2px 5px rgba(0,0,0,0.18)" }} />
          <div style={{ position: "absolute", top: -3.5 * s, right: 160 * s, width: 50 * s, height: 4 * s, background: btnT, borderRadius: "3px 3px 0 0", boxShadow: "0 -2px 5px rgba(0,0,0,0.18)" }} />
          <div style={{ position: "absolute", top: -3.5 * s, right: 220 * s, width: 50 * s, height: 4 * s, background: btnT, borderRadius: "3px 3px 0 0", boxShadow: "0 -2px 5px rgba(0,0,0,0.18)" }} />
        </>
      )}

      <div style={{ position: "absolute", inset: 0, borderRadius: R, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 5 * s, background: "#0a0a0a", borderRadius: Ri }} />

        <div style={{ position: "absolute", inset: 9 * s, background: "#000", borderRadius: Rs, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            {children ?? (
              <div className="flex h-full w-full items-center justify-center text-[0.85rem] tracking-[0.08em] text-white/20" style={{ fontFamily: TOKENS.uiFontFamily }}>
                Your content goes here
              </div>
            )}
          </div>
          <motion.div className="pointer-events-none absolute inset-0 z-[9]" style={{ borderRadius: Rs, background: glareBackground }} />
        </div>

        {isLand ? (
          <div className="pointer-events-none absolute top-[7px] left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center" style={{ gap: 4 * s }}>
            <div style={{ width: 6 * s, height: 6 * s, borderRadius: "50%", background: "#161616", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)" }} />
            <div style={{ width: 3 * s, height: 3 * s, borderRadius: "50%", background: "#1e1e1e" }} />
          </div>
        ) : (
          <div className="pointer-events-none absolute top-1/2 right-1 flex -translate-y-1/2 flex-col items-center" style={{ gap: 4 * s }}>
            <div style={{ width: 6 * s, height: 6 * s, borderRadius: "50%", background: "#161616", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)" }} />
            <div style={{ width: 3 * s, height: 3 * s, borderRadius: "50%", background: "#1e1e1e" }} />
          </div>
        )}
      </div>
    </div>
  );
}

function ScrollHeader({ translate, children }: { translate: MotionValue<number>; children: React.ReactNode }) {
  return (
    <motion.div className="mx-auto mb-10 max-w-[72rem] text-center" style={{ translateY: translate }}>
      {children}
    </motion.div>
  );
}

function ScrollCard({
  rotate,
  scale,
  frameColor,
  orientation,
  showShadow,
  ipadWidth,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  frameColor: string;
  orientation: string;
  showShadow: boolean;
  ipadWidth: number;
  children?: React.ReactNode;
}) {
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  return (
    <motion.div
      className="-mt-4 flex items-center justify-center"
      style={{ rotateX: rotate, scale, willChange: "transform", transformStyle: "preserve-3d" }}
    >
      <IPadFrame width={ipadWidth} frameColor={frameColor} orientation={orientation} showShadow={showShadow} glareX={glareX} glareY={glareY}>
        {children}
      </IPadFrame>
    </motion.div>
  );
}

export interface ContainerScrollIpadProps {
  themeMode?: "paper" | "glass";
  badge?: string;
  badgeSize?: number;
  heading?: string;
  headingSize?: number;
  headingFontWeight?: number;
  headingFontFamily?: string;
  subheading?: string;
  subheadingSize?: number;
  badgeHeadingGap?: number;
  headingSubheadingGap?: number;
  containerHeight?: number;
  frameColor?: "Silver" | "Space Gray";
  orientation?: "Landscape" | "Portrait";
  frameShadow?: boolean;
  ipadWidth?: number;
  image?: string;
  className?: string;
}

export function ContainerScrollIpad({
  themeMode = "glass",
  badge = "Features",
  badgeSize = 12,
  heading = "Unleash the power of\nScroll Animations",
  headingSize = 48,
  headingFontWeight = 700,
  headingFontFamily = TOKENS.uiFontFamily,
  subheading = "From the pitch to the trail, get the metrics built for how you move.",
  subheadingSize = 16,
  badgeHeadingGap = 20,
  headingSubheadingGap = 14,
  containerHeight = 700,
  frameColor = "Silver",
  orientation = "Landscape",
  frameShadow = true,
  ipadWidth = 640,
  image,
  className,
}: ContainerScrollIpadProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef, target: trackRef, offset: ["start start", "end end"] });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile((containerRef.current?.clientWidth ?? window.innerWidth) <= 500);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scaleDimensions = isMobile ? [0.7, 0.9] : [1.05, 1];
  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const isPaper = themeMode === "paper";
  const bg = isPaper ? TOKENS.paper : TOKENS.ink;
  const fg = isPaper ? TOKENS.ink : "#ffffff";
  const fgMuted = isPaper ? "rgba(13,13,13,0.55)" : "rgba(255,255,255,0.55)";
  const badgeBg = isPaper ? "rgba(13,13,13,0.04)" : "rgba(255,255,255,0.06)";
  const badgeBorder = isPaper ? "rgba(13,13,13,0.1)" : TOKENS.glassBorderSoft;

  const titleNode = (
    <div>
      {badge && (
        <span
          className="mb-1 inline-block rounded-[40px] border px-4 py-1.5 tracking-[0.04em]"
          style={{ fontSize: badgeSize, color: fgMuted, background: badgeBg, borderColor: badgeBorder, marginBottom: badgeHeadingGap, fontFamily: TOKENS.uiFontFamily }}
        >
          {badge}
        </span>
      )}
      {heading && (
        <h2
          className="m-0 leading-[1.15] tracking-[-0.02em] whitespace-pre-line"
          style={{
            fontFamily: headingFontFamily,
            fontSize: isMobile ? Math.max(24, headingSize * 0.68) : headingSize,
            fontWeight: headingFontWeight,
            color: fg,
            marginBottom: subheading ? headingSubheadingGap : 0,
          }}
        >
          {heading}
        </h2>
      )}
      {subheading && (
        <p className="m-0 leading-[1.6]" style={{ fontSize: isMobile ? Math.max(12, subheadingSize * 0.875) : subheadingSize, color: fgMuted, fontFamily: TOKENS.uiFontFamily }}>
          {subheading}
        </p>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-y-auto p-2", className)}
      style={{ height: containerHeight, background: bg, transition: "background 600ms cubic-bezier(0.16,1,0.3,1)" }}
    >
      <div ref={trackRef} className="relative w-full" style={{ willChange: "transform", perspective: 1000, paddingTop: "10rem", paddingBottom: "10rem", height: containerHeight * 1.6 }}>
        <ScrollHeader translate={translate}>{titleNode}</ScrollHeader>
        <ScrollCard
          rotate={rotate}
          scale={scale}
          frameColor={frameColor}
          orientation={orientation}
          showShadow={frameShadow}
          ipadWidth={isMobile ? Math.min(ipadWidth, 320) : ipadWidth}
        >
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="block h-full w-full object-cover" />
          )}
        </ScrollCard>
      </div>
    </div>
  );
}
