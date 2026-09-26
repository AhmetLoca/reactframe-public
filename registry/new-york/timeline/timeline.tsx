"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TimelineStatus = "done" | "active" | "pending" | "error";
export type TimelineAlign = "left" | "alternate";
export type TimelineSize = "sm" | "md" | "lg";

export interface TimelineItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  date?: string;
  icon?: React.ReactNode;
  status?: TimelineStatus;
  /** Extra detail hidden behind a "Show more" toggle. */
  content?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  align?: TimelineAlign;
  size?: TimelineSize;
  theme?: "dark" | "light";
  accentColor?: string;
  lineStyle?: "solid" | "dashed";
  /** Fade + slide each row in as it scrolls into view, staggered. */
  animateOnView?: boolean;
  width?: number;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.55)", faint: "rgba(245,244,241,0.35)", line: "rgba(255,255,255,0.14)", markerBg: "#0E0E0E", pending: "rgba(255,255,255,0.14)", error: "#FF7A6B", hover: "rgba(255,255,255,0.06)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.55)", faint: "rgba(10,10,10,0.35)", line: "rgba(10,10,10,0.12)", markerBg: "#FFFFFF", pending: "rgba(10,10,10,0.14)", error: "#E5484D", hover: "rgba(10,10,10,0.05)" },
};

const SIZES: Record<TimelineSize, { marker: number; icon: number; font: number; desc: number; date: number; gap: number }> = {
  sm: { marker: 22, icon: 11, font: 13, desc: 12, date: 11, gap: 20 },
  md: { marker: 26, icon: 13, font: 14.5, desc: 13, date: 11.5, gap: 26 },
  lg: { marker: 30, icon: 15, font: 16, desc: 14, date: 12.5, gap: 32 },
};

type Palette = (typeof PALETTES)["dark"];
type Size = (typeof SIZES)["md"];

function readableTextOn(hex: string): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#0A0A0A" : "#FFFFFF";
}

function CheckGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.3 6.3L4.7 8.7L9.7 3.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 3L9 9M9 3L3 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

interface MarkerProps {
  item: TimelineItem;
  s: Size;
  p: Palette;
  accent: string;
}

function Marker({ item, s, p, accent }: MarkerProps) {
  const status = item.status;
  const onAccent = readableTextOn(accent);
  const filled = status === "done" || status === "active" || status === "error";
  const bg = status === "error" ? p.error : status === "pending" ? "transparent" : status ? accent : p.markerBg;
  const border = status === "pending" ? p.pending : status ? "transparent" : p.faint;
  const fg = status === "pending" || !status ? p.muted : onAccent;

  return (
    <span className="relative flex shrink-0 items-center justify-center rounded-full" style={{ width: s.marker, height: s.marker, background: bg, border: `1.5px solid ${border}`, color: fg }}>
      {status === "active" && (
        <motion.span
          aria-hidden="true"
          className="absolute rounded-full"
          style={{ inset: -4, border: `1.5px solid ${accent}` }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {item.icon ? (
        <span className="flex items-center justify-center" style={{ width: s.icon, height: s.icon }}>
          {item.icon}
        </span>
      ) : status === "done" ? (
        <CheckGlyph size={s.icon - 2} color={fg} />
      ) : status === "error" ? (
        <XGlyph size={s.icon - 2} color={fg} />
      ) : filled || !status ? (
        <span className="rounded-full" style={{ width: s.icon * 0.4, height: s.icon * 0.4, background: fg }} />
      ) : null}
    </span>
  );
}

interface RowProps {
  item: TimelineItem;
  s: Size;
  p: Palette;
  accent: string;
  side: "left" | "right";
  align: TimelineAlign;
  showLine: boolean;
  lineStyle: "solid" | "dashed";
  animateOnView: boolean;
  index: number;
}

function Row({ item, s, p, accent, side, align, showLine, lineStyle, animateOnView, index }: RowProps) {
  const [expanded, setExpanded] = React.useState(false);
  const flip = align === "alternate" && side === "right";
  const textAlign = align === "alternate" ? (flip ? "left" : "right") : "left";

  const body = (
    <div className="flex min-w-0 flex-1 flex-col" style={{ gap: 3, textAlign, alignItems: align === "alternate" ? (flip ? "flex-start" : "flex-end") : "stretch" }}>
      {item.date && (
        <span className="font-medium tabular-nums uppercase" style={{ color: p.faint, fontSize: s.date, letterSpacing: "0.05em" }}>
          {item.date}
        </span>
      )}
      <span className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font, lineHeight: 1.4 }}>
        {item.title}
      </span>
      {item.description && (
        <span style={{ color: p.muted, fontSize: s.desc, lineHeight: 1.55 }}>{item.description}</span>
      )}
      {item.content && (
        <>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-1 inline-flex w-fit cursor-pointer items-center border-none bg-transparent p-0 font-semibold outline-none focus-visible:ring-2"
            style={{ gap: 4, color: accent, fontSize: s.desc - 0.5, flexDirection: flip ? "row" : align === "alternate" ? "row-reverse" : "row", ["--tw-ring-color" as string]: accent }}
          >
            <motion.svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.18 }} aria-hidden="true">
              <path d="M6 3.5L10.5 8L6 12.5" />
            </motion.svg>
            {expanded ? "Show less" : "Show more"}
          </button>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} className="w-full overflow-hidden">
                <div style={{ marginTop: 4, padding: 12, borderRadius: 12, background: p.hover, color: p.muted, fontSize: s.desc, lineHeight: 1.55, textAlign: "left" }}>{item.content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );

  // The marker column needs a *real* height to hang the connector line
  // from — relying on flex's default stretch (rather than items-start) so
  // it matches its tallest sibling (the body text), then the line is
  // absolutely positioned within it and extended past its own bottom edge
  // by the row gap, reaching exactly where the next marker starts.
  const markerCol = (
    <div className="relative flex shrink-0 flex-col items-center" style={{ width: s.marker }}>
      <Marker item={item} s={s} p={p} accent={accent} />
      {showLine && (
        <div
          className="absolute left-1/2"
          style={{
            width: lineStyle === "dashed" ? 0 : 1.5,
            top: s.marker + 2,
            bottom: -s.gap,
            borderLeft: lineStyle === "dashed" ? `1.5px dashed ${p.line}` : undefined,
            background: lineStyle === "dashed" ? undefined : p.line,
            transform: "translateX(-50%)",
          }}
        />
      )}
    </div>
  );

  const content =
    align === "alternate" ? (
      <div className="grid w-full" style={{ gridTemplateColumns: `1fr ${s.marker}px 1fr`, columnGap: 20 }}>
        <div style={{ gridColumn: 1 }}>{side === "left" ? body : null}</div>
        <div style={{ gridColumn: 2 }}>{markerCol}</div>
        <div style={{ gridColumn: 3 }}>{side === "right" ? body : null}</div>
      </div>
    ) : (
      <div className="flex w-full" style={{ gap: 16 }}>
        {markerCol}
        <div style={{ paddingTop: (s.marker - s.font * 1.4) / 2 }} className="min-w-0 flex-1">
          {body}
        </div>
      </div>
    );

  if (!animateOnView) return content;

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.4), ease: [0.16, 1, 0.3, 1] }}
    >
      {content}
    </motion.div>
  );
}

export function Timeline({ items, align = "left", size = "md", theme = "dark", accentColor = "#F2A841", lineStyle = "solid", animateOnView = true, width, className }: TimelineProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];

  return (
    <div className={cn("flex flex-col", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif" }} role="list">
      {items.map((item, i) => (
        <div key={item.id} role="listitem" style={{ paddingBottom: i === items.length - 1 ? 0 : s.gap }}>
          <Row item={item} s={s} p={p} accent={accentColor} side={i % 2 === 0 ? "left" : "right"} align={align} showLine={i < items.length - 1} lineStyle={lineStyle} animateOnView={animateOnView} index={i} />
        </div>
      ))}
    </div>
  );
}
