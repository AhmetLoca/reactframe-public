"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BackToTopPosition = "bottom-right" | "bottom-left" | "bottom-center";
export type BackToTopSize = "sm" | "md" | "lg";

export interface BackToTopProps {
  /** Scroll distance (px) before the button appears. */
  threshold?: number;
  showProgress?: boolean;
  smooth?: boolean;
  /** Scrollable element to track/scroll; defaults to the window. */
  containerRef?: React.RefObject<HTMLElement | null>;
  icon?: React.ReactNode;
  label?: string;
  position?: BackToTopPosition;
  offset?: number;
  size?: BackToTopSize;
  theme?: "dark" | "light";
  accentColor?: string;
  /** Positions absolutely within a relative-positioned parent instead of fixed to the viewport — for demos. */
  contained?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0E0E0E", border: "rgba(255,255,255,0.1)", text: "#F5F4F1", track: "rgba(255,255,255,0.12)", shadow: "0 12px 32px rgba(0,0,0,0.45)" },
  light: { bg: "#FFFFFF", border: "rgba(10,10,10,0.1)", text: "#0A0A0A", track: "rgba(10,10,10,0.12)", shadow: "0 12px 32px rgba(0,0,0,0.16)" },
};

const SIZES: Record<BackToTopSize, { box: number; icon: number; stroke: number }> = {
  sm: { box: 38, icon: 15, stroke: 2 },
  md: { box: 44, icon: 17, stroke: 2.5 },
  lg: { box: 50, icon: 19, stroke: 3 },
};

function ArrowUpIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 13V3M3.5 7.5L8 3L12.5 7.5" />
    </svg>
  );
}

function getScrollTop(el: HTMLElement | Window) {
  return el === window ? window.scrollY : (el as HTMLElement).scrollTop;
}

function getScrollableHeight(el: HTMLElement | Window) {
  if (el === window) return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const node = el as HTMLElement;
  return Math.max(1, node.scrollHeight - node.clientHeight);
}

export function BackToTop({
  threshold = 400,
  showProgress = true,
  smooth = true,
  containerRef,
  icon,
  label = "Back to top",
  position = "bottom-right",
  offset = 24,
  size = "md",
  theme = "dark",
  accentColor = "#F2A841",
  contained = false,
  className,
}: BackToTopProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const [visible, setVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  // Only meaningful when `contained`: position: absolute inside a
  // scrollable container is relative to that container's full (tall)
  // content box, not the slice of it currently on screen — so a plain
  // `bottom: offset` would pin the button near the bottom of the *content*,
  // leaving it scrolled out of view the rest of the time. Tracking the
  // scroll position lets us compute a `top` that keeps it in the visible
  // corner instead, the way `position: fixed` does for free against the
  // real viewport.
  const [containedTop, setContainedTop] = React.useState<number | null>(null);
  const ticking = React.useRef(false);

  React.useEffect(() => {
    const target: HTMLElement | Window = containerRef?.current ?? window;

    const measure = () => {
      const top = getScrollTop(target);
      setVisible(top > threshold);
      if (showProgress) setProgress(Math.min(1, top / getScrollableHeight(target)));
      if (contained && target instanceof HTMLElement) {
        setContainedTop(top + target.clientHeight - offset - s.box);
      }
      ticking.current = false;
    };
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(measure);
    };

    measure();
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef, threshold, showProgress, contained, offset, s.box]);

  const scrollToTop = () => {
    const target = containerRef?.current ?? window;
    target.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  };

  const posStyle: React.CSSProperties = {
    bottom: contained && containedTop !== null ? undefined : offset,
    top: contained && containedTop !== null ? containedTop : undefined,
    left: position === "bottom-left" ? offset : position === "bottom-center" ? "50%" : undefined,
    right: position === "bottom-right" ? offset : undefined,
    transform: position === "bottom-center" ? "translateX(-50%)" : undefined,
  };

  const r = (s.box - s.stroke * 2) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label={label}
          className={cn(contained ? "absolute" : "fixed", "z-[9997] flex cursor-pointer items-center justify-center rounded-full border-none outline-none focus-visible:ring-2", className)}
          style={{ ...posStyle, width: s.box, height: s.box, background: p.bg, border: `1px solid ${p.border}`, boxShadow: p.shadow, color: p.text, ["--tw-ring-color" as string]: accentColor }}
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
        >
          {showProgress && (
            <svg width={s.box} height={s.box} viewBox={`0 0 ${s.box} ${s.box}`} className="absolute inset-0" aria-hidden="true">
              <circle cx={s.box / 2} cy={s.box / 2} r={r} fill="none" stroke={p.track} strokeWidth={s.stroke} />
              <circle
                cx={s.box / 2}
                cy={s.box / 2}
                r={r}
                fill="none"
                stroke={accentColor}
                strokeWidth={s.stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                transform={`rotate(-90 ${s.box / 2} ${s.box / 2})`}
                style={{ transition: "stroke-dashoffset 0.1s linear" }}
              />
            </svg>
          )}
          <span className="relative flex items-center justify-center">{icon ?? <ArrowUpIcon size={s.icon} />}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
