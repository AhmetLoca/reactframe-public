"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ThemeMode = "light" | "dark";
type IllustrationKind = "list" | "code" | "loader" | "chartNode" | "dashboardNode" | "none";
type ButtonStyle = "solid" | "outline";
type BackgroundPattern = "dots" | "grid" | "diagonal" | "cross" | "none";

export interface FeatureCardIllustratedProps {
  title?: string;
  description?: string;
  button?: string;
  illustration?: IllustrationKind;
  link?: string;
  theme?: ThemeMode;
  accentColor?: string;
  buttonStyle?: ButtonStyle;
  backgroundPattern?: BackgroundPattern;
  patternOpacity?: number;
  radius?: number;
  className?: string;
}

interface ThemePalette {
  cardBg: string;
  border: string;
  text: string;
  muted: string;
  mutedBg: string;
  dot: string;
  shadow: string;
  windowBg: string;
  windowHeader: string;
}

const PALETTE: Record<ThemeMode, ThemePalette> = {
  light: {
    cardBg: "#FFFFFF",
    border: "#E4E4E7",
    text: "#18181B",
    muted: "#A1A1AA",
    mutedBg: "#F4F4F5",
    dot: "#E4E4E7",
    shadow: "0 10px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
    windowBg: "#FFFFFF",
    windowHeader: "#F4F4F5",
  },
  dark: {
    cardBg: "#18181B",
    border: "#27272A",
    text: "#FAFAFA",
    muted: "#71717A",
    mutedBg: "#27272A",
    dot: "#2E2E33",
    shadow: "0 10px 24px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3)",
    windowBg: "#27272A",
    windowHeader: "#1F1F23",
  },
};

function PatternBg({ pattern, color, opacity }: { pattern: BackgroundPattern; color: string; opacity: number }) {
  if (pattern === "none") return null;

  if (pattern === "dots") {
    return (
      <div
        className="absolute inset-0"
        style={{ opacity, backgroundImage: `radial-gradient(circle, ${color} 1.2px, transparent 1.2px)`, backgroundSize: "16px 16px", backgroundPosition: "12px 12px" }}
      />
    );
  }

  if (pattern === "grid") {
    return (
      <div
        className="absolute inset-0"
        style={{
          opacity,
          backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />
    );
  }

  if (pattern === "diagonal") {
    return (
      <div
        className="absolute inset-0"
        style={{ opacity, backgroundImage: `repeating-linear-gradient(45deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 12px)` }}
      />
    );
  }

  const crossSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><path d='M8 5V11M5 8H11' stroke='${color}' stroke-width='1' stroke-linecap='round'/></svg>`;
  return <div className="absolute inset-0" style={{ opacity, backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(crossSvg)}")`, backgroundSize: "16px 16px" }} />;
}

function CursorArrow({ color, style }: { color: string; style?: React.CSSProperties }) {
  return (
    <motion.svg
      width={18}
      height={18}
      viewBox="0 0 20 20"
      fill="none"
      className="absolute"
      style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.18))", ...style }}
      animate={{ x: [0, 6, 0], y: [0, -6, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    >
      <path d="M2 1.5L17.5 8L9.7 10.4L7.2 18L2 1.5Z" fill={color} stroke="#FFFFFF" strokeWidth={1} strokeLinejoin="round" />
    </motion.svg>
  );
}

function BarsIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="8" width="3" height="6" rx="1" fill={color} />
      <rect x="6.5" y="4" width="3" height="10" rx="1" fill={color} />
      <rect x="11" y="6" width="3" height="8" rx="1" fill={color} />
    </svg>
  );
}

function GridIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1.2" fill={color} />
      <rect x="9" y="2" width="5" height="5" rx="1.2" fill={color} />
      <rect x="2" y="9" width="5" height="5" rx="1.2" fill={color} />
      <rect x="9" y="9" width="5" height="5" rx="1.2" fill={color} />
    </svg>
  );
}

function CardButton({ label, variant, palette, accent }: { label: string; variant: ButtonStyle; palette: ThemePalette; accent: string }) {
  const isSolid = variant === "solid";
  return (
    <span
      className="inline-flex h-[34px] items-center rounded-lg px-4 text-[13px] font-semibold whitespace-nowrap tracking-[-0.01em]"
      style={{ border: `1px solid ${isSolid ? accent : palette.border}`, backgroundColor: isSolid ? accent : "transparent", color: isSolid ? "#FFFFFF" : palette.text }}
    >
      {label}
    </span>
  );
}

interface IllustrationCommonProps {
  palette: ThemePalette;
  accent: string;
  pattern: BackgroundPattern;
  patternOpacity: number;
}

function ListIllustration({ palette, accent, pattern, patternOpacity }: IllustrationCommonProps) {
  const rows: { active: boolean; width: string }[] = [
    { active: false, width: "68%" },
    { active: true, width: "52%" },
    { active: false, width: "64%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <PatternBg pattern={pattern} color={palette.dot} opacity={patternOpacity} />
      <div className="absolute top-1/2 flex w-[168px] -translate-y-1/2 flex-col gap-2.5" style={{ right: -18 }}>
        {rows.map((row, i) => {
          const iconStyle: React.CSSProperties = {
            width: 16,
            height: 16,
            borderRadius: 4,
            backgroundColor: row.active ? "#F4F0FF" : palette.mutedBg,
            color: row.active ? accent : palette.muted,
          };

          return (
            <div
              key={i}
              className="box-border flex h-[30px] items-center gap-2 rounded-lg px-2.5"
              style={{ marginLeft: i === 1 ? 22 : 0, backgroundColor: palette.cardBg, border: `1px solid ${palette.border}`, boxShadow: palette.shadow }}
            >
              {row.active ? (
                <motion.span
                  className="flex flex-shrink-0 items-center justify-center text-[10px]"
                  style={iconStyle}
                  animate={{ opacity: [1, 0.55, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ▤
                </motion.span>
              ) : (
                <span className="flex flex-shrink-0 items-center justify-center text-[10px]" style={iconStyle}>
                  ▤
                </span>
              )}
              <span className="h-1.5 rounded-[3px]" style={{ backgroundColor: palette.mutedBg, width: row.width }} />
            </div>
          );
        })}
      </div>
      <CursorArrow color={accent} style={{ right: 62, top: "44%" }} />
    </div>
  );
}

function CodeIllustration({ palette, accent, pattern, patternOpacity }: IllustrationCommonProps) {
  const lines: { width: string; color: string }[] = [
    { width: "70%", color: palette.mutedBg },
    { width: "45%", color: palette.mutedBg },
    { width: "32%", color: accent },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <PatternBg pattern={pattern} color={palette.dot} opacity={patternOpacity} />
      <div
        className="absolute top-1/2 box-border w-[190px] -translate-y-1/2 overflow-hidden rounded-[10px]"
        style={{ right: -22, transform: "translateY(-50%) rotate(2deg)", backgroundColor: palette.windowBg, border: `1px solid ${palette.border}`, boxShadow: palette.shadow }}
      >
        <div className="flex items-center gap-1.5 px-2.5 py-2" style={{ backgroundColor: palette.windowHeader, borderBottom: `1px solid ${palette.border}` }}>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#28C840" }} />
        </div>
        <div className="flex flex-col gap-2 px-3.5 py-3">
          {lines.map((line, i) =>
            i === lines.length - 1 ? (
              <motion.span
                key={i}
                className="h-1.5 rounded-[3px]"
                style={{ backgroundColor: line.color }}
                animate={{ width: ["18%", "38%", "18%"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : (
              <span key={i} className="h-1.5 rounded-[3px]" style={{ backgroundColor: line.color, width: line.width }} />
            )
          )}
        </div>
      </div>
      <CursorArrow color="#FB7185" style={{ right: 6, bottom: 16 }} />
    </div>
  );
}

function LoaderIllustration({ palette, accent, pattern, patternOpacity }: IllustrationCommonProps) {
  const bars: number[] = [10, 18, 26, 16, 22];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <PatternBg pattern={pattern} color={palette.dot} opacity={patternOpacity} />
      <div
        className="absolute top-1/2 box-border flex w-[168px] -translate-y-1/2 flex-col gap-3.5 rounded-xl p-3.5"
        style={{ right: 20, backgroundColor: palette.cardBg, border: `1px solid ${palette.border}`, boxShadow: palette.shadow }}
      >
        <div className="flex items-center gap-2">
          <span className="h-[1.5px] flex-1 rounded-[1px]" style={{ backgroundColor: palette.border }} />
        </div>
        <div className="flex h-8 items-end gap-1.5">
          {bars.map((h, i) => (
            <span key={i} className="flex-1 rounded-[3px]" style={{ height: h, backgroundColor: i === bars.length - 1 ? accent : palette.mutedBg }} />
          ))}
        </div>
      </div>
      <CursorArrow color="#34D399" style={{ right: 0, bottom: 26 }} />
    </div>
  );
}

function ChartNodeIllustration({ palette, accent, pattern, patternOpacity }: IllustrationCommonProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <PatternBg pattern={pattern} color={palette.dot} opacity={patternOpacity} />
      <div
        className="absolute box-border flex w-[168px] flex-col gap-2 rounded-[10px] p-3"
        style={{ right: 20, top: 24, backgroundColor: palette.cardBg, border: `1px solid ${palette.border}`, boxShadow: palette.shadow }}
      >
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase" style={{ color: palette.muted, fontFamily: "Inter, sans-serif" }}>
          Chart 001
        </span>
        <div className="flex items-center gap-2">
          <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[7px]" style={{ backgroundColor: "#FEF3C7" }}>
            <BarsIcon color="#D97706" />
          </span>
          <span className="h-1.5 flex-1 rounded-[3px]" style={{ backgroundColor: palette.mutedBg }} />
        </div>
      </div>
      <motion.div
        className="absolute h-[26px] w-px"
        style={{ right: 100, top: 102, borderLeft: `1.5px dashed ${palette.border}` }}
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute flex h-6 w-6 items-center justify-center rounded-full text-sm"
        style={{ right: 88, top: 126, border: `1.5px solid ${palette.border}`, backgroundColor: palette.cardBg, color: palette.muted }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ color: accent }}>+</span>
      </motion.div>
    </div>
  );
}

function DashboardNodeIllustration({ palette, accent, pattern, patternOpacity }: IllustrationCommonProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <PatternBg pattern={pattern} color={palette.dot} opacity={patternOpacity} />
      <div
        className="absolute box-border flex w-[168px] flex-col gap-2 rounded-[10px] p-3"
        style={{ right: 20, top: 24, backgroundColor: palette.cardBg, border: `1px solid ${palette.border}`, boxShadow: palette.shadow }}
      >
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase" style={{ color: palette.muted, fontFamily: "Inter, sans-serif" }}>
          Dashboard 01
        </span>
        <div className="flex items-center gap-2">
          <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[7px]" style={{ backgroundColor: "#F4F0FF" }}>
            <GridIcon color={accent} />
          </span>
          <span className="h-1.5 flex-1 rounded-[3px]" style={{ backgroundColor: palette.mutedBg }} />
        </div>
      </div>
      <div className="absolute box-border h-4 w-4 rounded-full" style={{ right: 96, top: 12, border: `1.5px solid ${palette.border}`, backgroundColor: palette.cardBg }} />
      <motion.div
        className="absolute h-[26px] w-px"
        style={{ right: 100, top: 102, borderLeft: `1.5px dashed ${palette.border}` }}
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute flex h-6 w-6 items-center justify-center rounded-full text-sm"
        style={{ right: 88, top: 126, border: `1.5px solid ${palette.border}`, backgroundColor: palette.cardBg }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ color: accent }}>+</span>
      </motion.div>
    </div>
  );
}

function Illustration({ kind, ...rest }: { kind: IllustrationKind } & IllustrationCommonProps) {
  switch (kind) {
    case "list":
      return <ListIllustration {...rest} />;
    case "code":
      return <CodeIllustration {...rest} />;
    case "loader":
      return <LoaderIllustration {...rest} />;
    case "chartNode":
      return <ChartNodeIllustration {...rest} />;
    case "dashboardNode":
      return <DashboardNodeIllustration {...rest} />;
    default:
      return null;
  }
}

export function FeatureCardIllustrated({
  title = "Explore",
  description = "Browse and build charts off existing explores",
  button = "Start exploring",
  illustration = "list",
  link,
  theme = "light",
  accentColor = "#7C3AED",
  buttonStyle = "outline",
  backgroundPattern = "dots",
  patternOpacity = 0.5,
  radius = 16,
  className,
}: FeatureCardIllustratedProps) {
  const palette = PALETTE[theme];

  const cardClassName = cn("relative box-border flex h-full w-full flex-col justify-between overflow-hidden p-6 no-underline", className);
  const cardStyle: React.CSSProperties = { borderRadius: radius, backgroundColor: palette.cardBg, border: `1px solid ${palette.border}`, fontFamily: "Inter, sans-serif", color: "inherit" };

  const content = (
    <>
      <Illustration kind={illustration} palette={palette} accent={accentColor} pattern={backgroundPattern} patternOpacity={patternOpacity} />
      <div className="relative z-[1] flex max-w-[58%] flex-col gap-2">
        <h3 className="m-0 text-lg leading-[1.3] font-bold tracking-[-0.01em]" style={{ color: palette.text }}>
          {title}
        </h3>
        <p className="m-0 text-[13.5px] leading-[1.55]" style={{ color: palette.muted }}>
          {description}
        </p>
      </div>
      <div className="relative z-[1]">
        <CardButton label={button} variant={buttonStyle} palette={palette} accent={accentColor} />
      </div>
    </>
  );

  if (link) {
    return (
      <a href={link} className={cardClassName} style={cardStyle}>
        {content}
      </a>
    );
  }

  return (
    <div className={cardClassName} style={cardStyle}>
      {content}
    </div>
  );
}
