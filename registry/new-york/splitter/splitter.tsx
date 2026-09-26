"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Fixed pixel thickness of each handle's hit area, shared between the
 * handle's own sizing and the drag math below — panels only ever get the
 * container's width/height *minus* this many px per handle, so computing
 * a percentage against the raw container size (rather than that reduced
 * span) would make the handle trail behind the cursor while dragging. */
const HANDLE_SIZE = 13;

export type SplitterDirection = "horizontal" | "vertical";

export interface SplitterPanel {
  id: string;
  content: React.ReactNode;
  /** Percentage (0-100). Panel defaults are normalized to sum to 100 if they don't already. */
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

export interface SplitterProps {
  panels: SplitterPanel[];
  direction?: SplitterDirection;
  /** Percentages summing to 100, one per panel. */
  sizes?: number[];
  onSizesChange?: (sizes: number[]) => void;
  theme?: "dark" | "light";
  accentColor?: string;
  height?: number | string;
  width?: number | string;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0E0E0E", border: "rgba(255,255,255,0.09)", handle: "rgba(255,255,255,0.12)", handleHover: "rgba(255,255,255,0.22)", grip: "rgba(245,244,241,0.55)", panelBg: "transparent" },
  light: { bg: "#FFFFFF", border: "rgba(10,10,10,0.1)", handle: "rgba(10,10,10,0.12)", handleHover: "rgba(10,10,10,0.24)", grip: "rgba(10,10,10,0.5)", panelBg: "transparent" },
};

type Palette = (typeof PALETTES)["dark"];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Panels with an explicit defaultSize keep it; panels without one split
 * whatever percentage is left over *those* panels evenly — not a plain
 * "100 / panel count" placeholder folded into the same normalization pass,
 * which would silently shrink an explicit size (e.g. a 25/[unset] pair
 * would land on 33/67 instead of the intended 25/75, since the unset
 * panel's placeholder of 50 gets normalized against the explicit 25 as if
 * both were equally deliberate). A final normalize only kicks in to fix up
 * explicit sizes that don't themselves sum to 100. */
function normalizeSizes(panels: SplitterPanel[]): number[] {
  const explicitSum = panels.reduce((sum, p) => sum + (p.defaultSize ?? 0), 0);
  const unspecifiedCount = panels.filter((p) => p.defaultSize === undefined).length;
  const share = unspecifiedCount > 0 ? Math.max(0, 100 - explicitSum) / unspecifiedCount : 0;
  const raw = panels.map((p) => p.defaultSize ?? share);
  const total = raw.reduce((a, b) => a + b, 0) || 1;
  return raw.map((v) => (v / total) * 100);
}

/** Resize the pair at (index, index+1) by deltaPct, redistributing between
 * just those two and clamping each to its own min/max — the classic
 * two-pane splitter behavior, so a resize never ripples into panels the
 * user isn't dragging next to. */
function resizePair(sizes: number[], panels: SplitterPanel[], index: number, deltaPct: number): number[] {
  const leftMin = panels[index].minSize ?? 10;
  const leftMax = panels[index].maxSize ?? 90;
  const rightMin = panels[index + 1].minSize ?? 10;
  const rightMax = panels[index + 1].maxSize ?? 90;

  let left = sizes[index] + deltaPct;
  let right = sizes[index + 1] - deltaPct;

  if (left < leftMin) {
    right -= leftMin - left;
    left = leftMin;
  } else if (left > leftMax) {
    right += left - leftMax;
    left = leftMax;
  }
  if (right < rightMin) {
    left -= rightMin - right;
    right = rightMin;
  } else if (right > rightMax) {
    left += right - rightMax;
    right = rightMax;
  }
  left = clamp(left, leftMin, leftMax);
  right = clamp(right, rightMin, rightMax);

  const next = [...sizes];
  next[index] = left;
  next[index + 1] = right;
  return next;
}

interface HandleProps {
  direction: SplitterDirection;
  p: Palette;
  accent: string;
  index: number;
  sizes: number[];
  panels: SplitterPanel[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  onResize: (index: number, deltaPct: number) => void;
  onReset: (index: number) => void;
}

function Handle({ direction, p, accent, index, sizes, panels, containerRef, onResize, onReset }: HandleProps) {
  const horizontal = direction === "horizontal";
  const [hovered, setHovered] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const startRef = React.useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = horizontal ? e.clientX : e.clientY;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = (horizontal ? rect.width : rect.height) - HANDLE_SIZE * (panels.length - 1);
    if (total === 0) return;
    const pos = horizontal ? e.clientX : e.clientY;
    const deltaPct = ((pos - startRef.current) / total) * 100;
    startRef.current = pos;
    onResize(index, deltaPct);
  };

  const endDrag = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const forward = horizontal ? "ArrowRight" : "ArrowDown";
    const backward = horizontal ? "ArrowLeft" : "ArrowUp";
    const step = e.shiftKey ? 10 : 2;
    if (e.key === forward) {
      e.preventDefault();
      onResize(index, step);
    } else if (e.key === backward) {
      e.preventDefault();
      onResize(index, -step);
    } else if (e.key === "Home") {
      e.preventDefault();
      onResize(index, -1000);
    } else if (e.key === "End") {
      e.preventDefault();
      onResize(index, 1000);
    } else if (e.key === "Enter") {
      e.preventDefault();
      onReset(index);
    }
  };

  const active = hovered || dragging;
  const min = panels[index].minSize ?? 10;
  const max = panels[index].maxSize ?? 90;

  return (
    <div
      role="separator"
      aria-orientation={horizontal ? "vertical" : "horizontal"}
      aria-label={`Resize ${panels[index].id} and ${panels[index + 1].id}`}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(sizes[index])}
      tabIndex={0}
      className="relative shrink-0 touch-none outline-none"
      style={{
        width: horizontal ? HANDLE_SIZE : "100%",
        height: horizontal ? "100%" : HANDLE_SIZE,
        cursor: horizontal ? "col-resize" : "row-resize",
        zIndex: 2,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onDoubleClick={() => onReset(index)}
      onKeyDown={onKeyDown}
    >
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width: horizontal ? 1.5 : "100%",
          height: horizontal ? "100%" : 1.5,
          background: active ? accent : p.handle,
          transform: "translate(-50%, -50%)",
          transition: "background 0.12s ease",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 flex items-center justify-center rounded-full"
        style={{
          width: horizontal ? 16 : 22,
          height: horizontal ? 22 : 16,
          background: p.bg,
          border: `1px solid ${active ? accent : p.handle}`,
          transform: "translate(-50%, -50%)",
        }}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.7 }}
        transition={{ duration: 0.14 }}
      >
        <div className="flex" style={{ gap: 2, flexDirection: horizontal ? "column" : "row" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="rounded-full" style={{ width: 2.5, height: 2.5, background: active ? accent : p.grip }} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function Splitter({ panels, direction = "horizontal", sizes: sizesProp, onSizesChange, theme = "dark", accentColor = "#F2A841", height = 320, width, className }: SplitterProps) {
  const p = PALETTES[theme];
  const horizontal = direction === "horizontal";
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [internalSizes, setInternalSizes] = React.useState(() => normalizeSizes(panels));
  const isControlled = sizesProp !== undefined;
  const sizes = isControlled ? sizesProp : internalSizes;

  const defaultSizes = React.useMemo(() => normalizeSizes(panels), [panels]);

  const setSizes = (next: number[]) => {
    if (!isControlled) setInternalSizes(next);
    onSizesChange?.(next);
  };

  const handleResize = (index: number, deltaPct: number) => {
    setSizes(resizePair(sizes, panels, index, deltaPct));
  };

  const handleReset = (index: number) => {
    const next = [...sizes];
    next[index] = defaultSizes[index];
    next[index + 1] = defaultSizes[index + 1];
    setSizes(next);
  };

  return (
    <div
      ref={containerRef}
      className={cn("flex overflow-hidden", horizontal ? "flex-row" : "flex-col", className)}
      style={{ width, maxWidth: "100%", height, borderRadius: 14, border: `1px solid ${p.border}`, background: p.bg, fontFamily: "Inter, sans-serif" }}
    >
      {panels.map((panel, i) => (
        <React.Fragment key={panel.id}>
          <div
            className="min-h-0 min-w-0 overflow-auto"
            // Sizes are ratios fed straight into flex-grow (basis 0), not a
            // literal percentage of the container width/height — that lets
            // the fixed-width handles between panels claim their own space
            // first, with panels sharing exactly what's left in these
            // proportions, instead of every panel's percentage-of-container
            // width adding up past 100% and overflowing past the handles.
            style={{ flex: `${sizes[i]} 1 0%` }}
          >
            {panel.content}
          </div>
          {i < panels.length - 1 && (
            <Handle direction={direction} p={p} accent={accentColor} index={i} sizes={sizes} panels={panels} containerRef={containerRef} onResize={handleResize} onReset={handleReset} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
