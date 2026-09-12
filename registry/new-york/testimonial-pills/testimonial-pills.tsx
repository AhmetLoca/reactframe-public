"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TestimonialPillItem {
  text: string;
  avatar?: string;
}

export interface TestimonialPillPalette {
  bg: string;
  text: string;
}

export interface TestimonialPillsProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  items?: TestimonialPillItem[];
  rowCount?: number;
  rowGap?: number;
  itemGap?: number;
  direction?: "left" | "right";
  alternateDirection?: boolean;
  speed?: number;
  speedVariation?: number;
  pauseOnHover?: boolean;
  scrollReveal?: boolean;
  depthEffect?: boolean;
  depthIntensity?: number;
  hoverEnabled?: boolean;
  hoverScale?: number;
  /** "palette" cycles through `palette`; "solid" uses a single pillBg/pillTextColor for every pill. */
  colorMode?: "palette" | "solid";
  palette?: TestimonialPillPalette[];
  pillBg?: string;
  pillTextColor?: string;
  avatarBg?: string;
  pillHeight?: number;
  pillRadius?: number;
  pillPaddingX?: number;
  fontSize?: number;
  fontWeight?: number;
  shadow?: boolean;
  avatarSize?: number;
  avatarOverlap?: number;
  ringWidth?: number;
  ringColor?: string;
  edgeFade?: boolean;
  fadeWidth?: number;
  spotlight?: boolean;
  spotlightColor?: string;
  spotlightSize?: number;
}

interface PillStyleConfig {
  colorMode: "palette" | "solid";
  palette: TestimonialPillPalette[];
  pillBg: string;
  pillTextColor: string;
  avatarBg: string;
  pillHeight: number;
  pillRadius: number;
  pillPaddingX: number;
  fontSize: number;
  fontWeight: number;
  shadow: boolean;
  avatarSize: number;
  avatarOverlap: number;
  ringWidth: number;
  ringColor: string;
  itemGap: number;
  hoverEnabled: boolean;
  hoverScale: number;
}

const SPEED_PATTERN = [1, 0.85, 1.18, 0.92, 1.1, 0.96];

const AVATARS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=160&h=160&fit=crop&crop=face&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=160&h=160&fit=crop&crop=face&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face&q=80",
  "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=160&h=160&fit=crop&crop=face&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=160&h=160&fit=crop&crop=face&q=80",
];

const DEFAULT_TEXTS = [
  "Very easy to follow",
  "Eye opening",
  "Very insightful",
  "Loved it",
  "Feeling positive",
  "It was useful",
  "Thanks!",
  "Great",
  "So far, so good",
  "Impressed",
  "I'm feeling hopeful",
  "Highly recommend",
  "Super helpful",
  "Worth it",
  "Mind blowing",
  "Couldn't be easier",
];

const DEFAULT_ITEMS: TestimonialPillItem[] = DEFAULT_TEXTS.map((text, i) => ({ text, avatar: AVATARS[i % AVATARS.length] }));

const DEFAULT_PALETTE: TestimonialPillPalette[] = [
  { bg: "#EDE7FC", text: "#3F2E78" },
  { bg: "#DFF7EC", text: "#15803D" },
  { bg: "#FFEDE3", text: "#B45309" },
  { bg: "#E3F0FF", text: "#1D4ED8" },
  { bg: "#FDE7F3", text: "#BE185C" },
];

function getPillColors(cfg: PillStyleConfig, colorIndex: number): TestimonialPillPalette {
  if (cfg.colorMode === "palette" && cfg.palette.length > 0) {
    return cfg.palette[colorIndex % cfg.palette.length];
  }
  return { bg: cfg.pillBg, text: cfg.pillTextColor };
}

function PillBlock({ item, cfg, colorIndex }: { item: TestimonialPillItem; cfg: PillStyleConfig; colorIndex: number }) {
  const colors = getPillColors(cfg, colorIndex);
  const avatarFallbackBg = cfg.colorMode === "palette" ? colors.bg : cfg.avatarBg;

  return (
    <motion.div
      className="flex shrink-0 items-center"
      style={{ marginRight: cfg.itemGap }}
      whileHover={cfg.hoverEnabled ? { scale: cfg.hoverScale, y: -4, zIndex: 5 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
    >
      <div
        className="relative z-[2] box-border shrink-0 overflow-hidden rounded-full"
        style={{
          width: cfg.avatarSize,
          height: cfg.avatarSize,
          marginRight: -cfg.avatarOverlap,
          border: `${cfg.ringWidth}px solid ${cfg.ringColor}`,
          background: avatarFallbackBg,
          boxShadow: cfg.shadow ? "0 6px 16px rgba(17, 12, 46, 0.14)" : "none",
        }}
      >
        {item.avatar ? (
          <img src={item.avatar} alt="" draggable={false} className="pointer-events-none block h-full w-full select-none object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-bold opacity-50" style={{ fontSize: cfg.avatarSize * 0.38, color: colors.text, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            {(item.text || "?").charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div
        className="relative z-[1] box-border flex items-center whitespace-nowrap"
        style={{
          height: cfg.pillHeight,
          borderRadius: cfg.pillRadius,
          background: colors.bg,
          color: colors.text,
          fontSize: cfg.fontSize,
          fontWeight: cfg.fontWeight,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          paddingLeft: cfg.avatarOverlap + cfg.pillPaddingX,
          paddingRight: cfg.pillPaddingX,
          boxShadow: cfg.shadow ? "0 6px 20px rgba(76, 29, 149, 0.08)" : "none",
        }}
      >
        {item.text}
      </div>
    </motion.div>
  );
}

function PillRow({
  items,
  direction,
  speed,
  pauseOnHover,
  cfg,
}: {
  items: TestimonialPillItem[];
  direction: "left" | "right";
  speed: number;
  pauseOnHover: boolean;
  cfg: PillStyleConfig;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => setSetWidth(el.scrollWidth / 2);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const duration = setWidth > 0 ? setWidth / Math.max(speed, 1) : 0;
  const animationName = direction === "left" ? "tp-scroll-left" : "tp-scroll-right";
  const paused = pauseOnHover && hovered;
  const renderedItems = items.length ? [...items, ...items] : [];

  const hoverPad = cfg.hoverEnabled ? Math.ceil((cfg.avatarSize * (cfg.hoverScale - 1)) / 2) + 4 : 0;

  return (
    <div className="w-full overflow-hidden" style={{ padding: `${hoverPad}px 0` }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div
        ref={trackRef}
        className="flex w-max items-center will-change-transform"
        style={{
          animationName: duration > 0 ? animationName : "none",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {renderedItems.map((item, i) => (
          <PillBlock key={i} item={item} cfg={cfg} colorIndex={i % items.length} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialPills({
  items = DEFAULT_ITEMS,
  rowCount = 5,
  rowGap = 18,
  itemGap = 22,
  direction = "left",
  alternateDirection = true,
  speed = 40,
  speedVariation = 0.35,
  pauseOnHover = true,
  scrollReveal = true,
  depthEffect = true,
  depthIntensity = 0.6,
  hoverEnabled = true,
  hoverScale = 1.08,
  colorMode = "palette",
  palette = DEFAULT_PALETTE,
  pillBg = "#EDE7FC",
  pillTextColor = "#3F2E78",
  avatarBg = "#DCD3F7",
  pillHeight = 60,
  pillRadius = 999,
  pillPaddingX = 22,
  fontSize = 17,
  fontWeight = 600,
  shadow = true,
  avatarSize = 68,
  avatarOverlap = 30,
  ringWidth = 3,
  ringColor = "#FFFFFF",
  edgeFade = true,
  fadeWidth = 60,
  spotlight = true,
  spotlightColor = "rgba(255,255,255,0.45)",
  spotlightSize = 420,
  className,
  ...props
}: TestimonialPillsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [revealed, setRevealed] = React.useState(() => !scrollReveal);
  React.useEffect(() => {
    if (!scrollReveal || revealed) return;
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [scrollReveal, revealed]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.5 });
  const spotlightBg = useMotionTemplate`radial-gradient(${spotlightSize}px circle at ${springX}px ${springY}px, ${spotlightColor}, transparent 70%)`;

  const cfg: PillStyleConfig = {
    colorMode,
    palette,
    pillBg,
    pillTextColor,
    avatarBg,
    pillHeight,
    pillRadius,
    pillPaddingX,
    fontSize,
    fontWeight,
    shadow,
    avatarSize,
    avatarOverlap,
    ringWidth,
    ringColor,
    itemGap,
    hoverEnabled,
    hoverScale,
  };

  const rows = React.useMemo(() => {
    const n = items.length;
    if (n === 0) return [];
    const shift = Math.max(1, Math.ceil(n / Math.max(rowCount, 1)));
    return Array.from({ length: Math.max(rowCount, 1) }, (_, i) => {
      const offset = (i * shift) % n;
      return [...items.slice(offset), ...items.slice(0, offset)];
    });
  }, [items, rowCount]);

  const maskImage = edgeFade ? `linear-gradient(to right, transparent 0, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent 100%)` : undefined;
  const centerIndex = (Math.max(rowCount, 1) - 1) / 2;

  return (
    <div className={cn("relative w-full", className)} {...props}>
      <style>{`
        @keyframes tp-scroll-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes tp-scroll-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
      <div
        ref={containerRef}
        onMouseMove={
          spotlight
            ? (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                mouseX.set(e.clientX - rect.left);
                mouseY.set(e.clientY - rect.top);
              }
            : undefined
        }
        className="relative flex w-full flex-col overflow-hidden"
        style={{ gap: rowGap, WebkitMaskImage: maskImage, maskImage }}
      >
        {rows.map((rowItems, i) => {
          const rowDirection: "left" | "right" = alternateDirection ? (i % 2 === 0 ? direction : direction === "left" ? "right" : "left") : direction;
          const mult = 1 + (SPEED_PATTERN[i % SPEED_PATTERN.length] - 1) * speedVariation;
          const depthFactor = depthEffect && centerIndex > 0 ? Math.abs(i - centerIndex) / centerIndex : 0;
          const rowScale = 1 - depthFactor * 0.12 * depthIntensity;
          const rowOpacity = 1 - depthFactor * 0.35 * depthIntensity;
          const rowBlur = depthFactor * 2.5 * depthIntensity;
          const revealX = rowDirection === "left" ? 60 : -60;

          return (
            <motion.div
              key={i}
              style={{ transformOrigin: "center center", scale: rowScale, filter: rowBlur > 0.05 ? `blur(${rowBlur}px)` : undefined }}
              initial={scrollReveal ? { opacity: 0, x: revealX } : false}
              animate={{ opacity: revealed ? rowOpacity : 0, x: revealed ? 0 : revealX }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <PillRow items={rowItems} direction={rowDirection} speed={Math.max(speed * mult, 1)} pauseOnHover={pauseOnHover} cfg={cfg} />
            </motion.div>
          );
        })}

        {spotlight && <motion.div className="pointer-events-none absolute inset-0 z-50" style={{ background: spotlightBg }} />}
      </div>
    </div>
  );
}
