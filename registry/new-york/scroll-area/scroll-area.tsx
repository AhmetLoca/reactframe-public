"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ScrollAreaDirection = "vertical" | "horizontal" | "both";
export type ScrollAreaSize = "sm" | "md" | "lg";

export interface ScrollAreaProps {
  children: React.ReactNode;
  direction?: ScrollAreaDirection;
  height?: number | string;
  width?: number | string;
  /** Keep the scrollbar visible at all times instead of fading it out when idle. */
  alwaysVisible?: boolean;
  showFadeMask?: boolean;
  theme?: "dark" | "light";
  accentColor?: string;
  size?: ScrollAreaSize;
  className?: string;
}

const PALETTES = {
  dark: { thumb: "rgba(255,255,255,0.28)", thumbHover: "rgba(255,255,255,0.45)", track: "rgba(255,255,255,0.05)", fadeTo: "#080808" },
  light: { thumb: "rgba(10,10,10,0.22)", thumbHover: "rgba(10,10,10,0.4)", track: "rgba(10,10,10,0.04)", fadeTo: "#FFFFFF" },
};

const SIZES: Record<ScrollAreaSize, { thickness: number; margin: number }> = {
  sm: { thickness: 6, margin: 2 },
  md: { thickness: 8, margin: 3 },
  lg: { thickness: 10, margin: 3 },
};

interface Metrics {
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
}

const emptyMetrics: Metrics = { scrollTop: 0, scrollLeft: 0, scrollHeight: 0, scrollWidth: 0, clientHeight: 0, clientWidth: 0 };

export function ScrollArea({
  children,
  direction = "vertical",
  height = 320,
  width,
  alwaysVisible = false,
  showFadeMask = true,
  theme = "dark",
  accentColor,
  size = "md",
  className,
}: ScrollAreaProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const showV = direction === "vertical" || direction === "both";
  const showH = direction === "horizontal" || direction === "both";

  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [m, setM] = React.useState<Metrics>(emptyMetrics);
  const [active, setActive] = React.useState(alwaysVisible);
  const [dragging, setDragging] = React.useState<"v" | "h" | null>(null);
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStart = React.useRef({ pos: 0, scroll: 0 });

  const readMetrics = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    setM({ scrollTop: el.scrollTop, scrollLeft: el.scrollLeft, scrollHeight: el.scrollHeight, scrollWidth: el.scrollWidth, clientHeight: el.clientHeight, clientWidth: el.clientWidth });
  }, []);

  const wake = React.useCallback(() => {
    if (alwaysVisible) return;
    setActive(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setActive(false), 900);
  }, [alwaysVisible]);

  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    readMetrics();
    const onScroll = () => {
      readMetrics();
      wake();
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(readMetrics);
    ro.observe(el);
    const mo = new MutationObserver(readMetrics);
    mo.observe(el, { childList: true, subtree: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      mo.disconnect();
    };
  }, [readMetrics, wake]);

  React.useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  const trackH = m.clientHeight - s.margin * 2;
  const trackW = m.clientWidth - s.margin * 2;
  const maxScrollTop = Math.max(0, m.scrollHeight - m.clientHeight);
  const maxScrollLeft = Math.max(0, m.scrollWidth - m.clientWidth);
  const thumbH = maxScrollTop > 0 ? Math.max(24, (m.clientHeight / m.scrollHeight) * trackH) : 0;
  const thumbW = maxScrollLeft > 0 ? Math.max(24, (m.clientWidth / m.scrollWidth) * trackW) : 0;
  const thumbTop = maxScrollTop > 0 ? (m.scrollTop / maxScrollTop) * (trackH - thumbH) : 0;
  const thumbLeft = maxScrollLeft > 0 ? (m.scrollLeft / maxScrollLeft) * (trackW - thumbW) : 0;

  // Two plain handlers rather than a (axis) => (e) => {...} factory: the
  // lint rule that flags ref writes during render can't see through a
  // curried function to confirm the *returned* closure only ever runs from
  // an event (which it does — startDrag("v") itself runs at render time
  // just to produce the handler, but the handler itself doesn't), so it
  // conservatively flags the ref write anyway.
  const onVPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { pos: e.clientY, scroll: m.scrollTop };
    setDragging("v");
    setActive(true);
  };
  const onHPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { pos: e.clientX, scroll: m.scrollLeft };
    setDragging("h");
    setActive(true);
  };

  const onDragMove = (e: React.PointerEvent) => {
    if (!dragging || !viewportRef.current) return;
    if (dragging === "v") {
      const deltaPx = e.clientY - dragStart.current.pos;
      const range = trackH - thumbH;
      const scrollDelta = range > 0 ? (deltaPx / range) * maxScrollTop : 0;
      viewportRef.current.scrollTop = Math.min(maxScrollTop, Math.max(0, dragStart.current.scroll + scrollDelta));
    } else {
      const deltaPx = e.clientX - dragStart.current.pos;
      const range = trackW - thumbW;
      const scrollDelta = range > 0 ? (deltaPx / range) * maxScrollLeft : 0;
      viewportRef.current.scrollLeft = Math.min(maxScrollLeft, Math.max(0, dragStart.current.scroll + scrollDelta));
    }
  };

  const endDrag = () => {
    setDragging(null);
    wake();
  };

  const visible = alwaysVisible || active || dragging !== null;
  const atTop = m.scrollTop <= 1;
  const atBottom = m.scrollTop >= maxScrollTop - 1;
  const atLeft = m.scrollLeft <= 1;
  const atRight = m.scrollLeft >= maxScrollLeft - 1;

  return (
    // The fade mask is a gradient into a solid color, which only reads as a
    // seamless fade — rather than a visible hard-edged rectangle — when
    // that color actually matches whatever's behind it. Since this
    // component has no way to know an arbitrary parent's background, it
    // owns its own (p.fadeTo) and uses that same value for both, so the
    // two can never drift apart regardless of where it's dropped in.
    <div className={cn("relative", className)} style={{ width, maxWidth: "100%", height, background: p.fadeTo }} onMouseEnter={wake} onMouseMove={wake}>
      <div
        ref={viewportRef}
        tabIndex={0}
        // The native scrollbar is hidden two ways at once because no single
        // property covers every engine: scrollbarWidth is the (standard)
        // Firefox property, and Chrome/Safari only respect the vendor
        // ::-webkit-scrollbar pseudo-element, reached here through
        // Tailwind's arbitrary-variant syntax rather than an injected
        // <style> tag (which would need its own generated class to target
        // safely instead of leaking a shared selector across instances).
        className="h-full w-full outline-none [&::-webkit-scrollbar]:hidden"
        style={{
          overflowY: showV ? "auto" : "hidden",
          overflowX: showH ? "auto" : "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </div>

      {showFadeMask && showV && !atTop && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0" style={{ height: 24, background: `linear-gradient(to bottom, ${p.fadeTo}, transparent)` }} />}
      {showFadeMask && showV && !atBottom && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0" style={{ height: 24, background: `linear-gradient(to top, ${p.fadeTo}, transparent)` }} />}
      {showFadeMask && showH && !atLeft && <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0" style={{ width: 24, background: `linear-gradient(to right, ${p.fadeTo}, transparent)` }} />}
      {showFadeMask && showH && !atRight && <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0" style={{ width: 24, background: `linear-gradient(to left, ${p.fadeTo}, transparent)` }} />}

      {showV && thumbH > 0 && (
        <div className="absolute" style={{ top: s.margin, bottom: s.margin, right: 1, width: s.thickness, borderRadius: s.thickness }}>
          <motion.div
            role="scrollbar"
            aria-orientation="vertical"
            aria-valuenow={maxScrollTop > 0 ? Math.round((m.scrollTop / maxScrollTop) * 100) : 0}
            onPointerDown={onVPointerDown}
            onPointerMove={onDragMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="absolute cursor-pointer touch-none"
            style={{ top: thumbTop, height: thumbH, width: s.thickness, borderRadius: s.thickness, background: dragging === "v" ? (accentColor ?? p.thumbHover) : p.thumb }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          />
        </div>
      )}
      {showH && thumbW > 0 && (
        <div className="absolute" style={{ left: s.margin, right: s.margin, bottom: 1, height: s.thickness, borderRadius: s.thickness }}>
          <motion.div
            role="scrollbar"
            aria-orientation="horizontal"
            aria-valuenow={maxScrollLeft > 0 ? Math.round((m.scrollLeft / maxScrollLeft) * 100) : 0}
            onPointerDown={onHPointerDown}
            onPointerMove={onDragMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="absolute cursor-pointer touch-none"
            style={{ left: thumbLeft, width: thumbW, height: s.thickness, borderRadius: s.thickness, background: dragging === "h" ? (accentColor ?? p.thumbHover) : p.thumb }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          />
        </div>
      )}
    </div>
  );
}
