"use client";

import * as React from "react";
import { animate, motion, useInView, useReducedMotion, type TargetAndTransition } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StatFeatureAnimation = "blur" | "slide" | "fade" | "scale";

export interface StatFeatureRing {
  /** 0–100. */
  value: number;
  color: string;
}

export interface StatFeatureStat {
  /** Counted up from zero; a decimal like "4.8" counts with one decimal, non-numeric text is shown as is. */
  number: string;
  suffix?: string;
  label: string;
}

export interface StatFeatureProps {
  badge?: string;
  title: string;
  description?: string;
  rings?: StatFeatureRing[];
  chartCaption?: string;
  chartSubcaption?: string;
  showTrend?: boolean;
  trendText?: string;
  stats: StatFeatureStat[];
  theme?: "dark" | "light";
  animation?: StatFeatureAnimation;
  /** Seconds each block takes to fade in. */
  animationDuration?: number;
  /** Milliseconds the numbers take to count up. */
  countDuration?: number;
  /** Milliseconds between the stat rows entering. */
  staggerDelay?: number;
  /** Replay the entrance every time the section scrolls back into view. */
  replayOnReenter?: boolean;
  titleSize?: number;
  descriptionSize?: number;
  titleFontFamily?: string;
  uiFontFamily?: string;
  className?: string;
}

const THEMES = {
  dark: { page: "#0A0A0A", badgeBg: "rgba(255,255,255,0.08)", badgeText: "rgba(255,255,255,0.65)", badgeBorder: "rgba(255,255,255,0.1)", title: "#FFFFFF", desc: "rgba(255,255,255,0.5)", statNumber: "#FFFFFF", statLabel: "rgba(255,255,255,0.45)", track: "rgba(255,255,255,0.08)", subcaption: "rgba(255,255,255,0.4)", trend: "rgba(255,255,255,0.65)" },
  light: { page: "#FFFFFF", badgeBg: "rgba(18,18,18,0.05)", badgeText: "rgba(18,18,18,0.55)", badgeBorder: "rgba(18,18,18,0.08)", title: "#121212", desc: "rgba(18,18,18,0.55)", statNumber: "#121212", statLabel: "rgba(18,18,18,0.5)", track: "rgba(18,18,18,0.08)", subcaption: "rgba(18,18,18,0.45)", trend: "rgba(18,18,18,0.65)" },
};

const HIDDEN: Record<StatFeatureAnimation, TargetAndTransition> = {
  blur: { opacity: 0, y: 24, filter: "blur(10px)" },
  slide: { opacity: 0, y: 32 },
  fade: { opacity: 0 },
  scale: { opacity: 0, scale: 0.9 },
};

const SHOWN: Record<StatFeatureAnimation, TargetAndTransition> = {
  blur: { opacity: 1, y: 0, filter: "blur(0px)" },
  slide: { opacity: 1, y: 0 },
  fade: { opacity: 1 },
  scale: { opacity: 1, scale: 1 },
};

const DEFAULT_RINGS: StatFeatureRing[] = [
  { value: 88, color: "#3B82F6" },
  { value: 72, color: "#60A5FA" },
  { value: 55, color: "#93C5FD" },
  { value: 40, color: "#BFDBFE" },
];

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function formatCount(n: number, decimals: number | null) {
  return decimals !== null ? n.toFixed(decimals) : String(Math.round(n));
}

function CountUp({ value, start, delay, duration, reduce, className, style }: { value: string; start: boolean; delay: number; duration: number; reduce: boolean; className?: string; style?: React.CSSProperties }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const target = parseFloat(value);
  const decimals = value.includes(".") ? value.split(".")[1].length : null;
  const numeric = !Number.isNaN(target);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !numeric) return;
    if (reduce) {
      el.textContent = formatCount(target, decimals);
      return;
    }
    if (!start) {
      el.textContent = formatCount(0, decimals);
      return;
    }
    const controls = animate(0, target, {
      duration: duration / 1000,
      delay: delay / 1000,
      ease: easeOutExpo,
      onUpdate: (v) => {
        el.textContent = formatCount(v, decimals);
      },
    });
    return () => controls.stop();
  }, [start, target, decimals, numeric, duration, delay, reduce]);

  return (
    <span ref={ref} className={className} style={style}>
      {numeric ? formatCount(0, decimals) : value}
    </span>
  );
}

function ConcentricChart({ rings, trackColor, show, reduce, label }: { rings: StatFeatureRing[]; trackColor: string; show: boolean; reduce: boolean; label: string }) {
  const uid = React.useId();
  const size = 280;
  const center = size / 2;
  const maxRadius = size / 2 - 12;
  const strokeWidth = 14;
  const gap = 10;
  const summary = rings.map((r, i) => `Ring ${i + 1}: ${r.value}%`).join(". ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-labelledby={`${uid}-t ${uid}-d`} className="block h-auto w-[240px] @[720px]:w-[280px]">
      <title id={`${uid}-t`}>{label || "Performance chart"}</title>
      <desc id={`${uid}-d`}>{summary}</desc>
      {rings.map((ring, i) => {
        const radius = maxRadius - i * (strokeWidth + gap);
        const progress = Math.min(Math.max(ring.value, 0), 100) / 100;
        return (
          <g key={i} transform={`rotate(-90 ${center} ${center})`}>
            <circle cx={center} cy={center} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={ring.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={show || reduce ? { pathLength: progress, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.4, delay: 0.22, ease: [0.33, 1, 0.68, 1] }}
            />
          </g>
        );
      })}
      <circle cx={center} cy={center} r={18} fill={rings[rings.length - 1]?.color ?? "#60A5FA"} opacity={0.9} />
    </svg>
  );
}

export function StatFeature({
  badge,
  title,
  description,
  rings = DEFAULT_RINGS,
  chartCaption,
  chartSubcaption,
  showTrend = true,
  trendText,
  stats,
  theme = "dark",
  animation = "blur",
  animationDuration = 1.5,
  countDuration = 2200,
  staggerDelay = 140,
  replayOnReenter = false,
  titleSize = 44,
  descriptionSize = 16,
  titleFontFamily = "Georgia, 'Times New Roman', serif",
  uiFontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif",
  className,
}: StatFeatureProps) {
  const t = THEMES[theme];
  const uid = React.useId();
  const reduce = useReducedMotion() ?? false;
  const rootRef = React.useRef<HTMLElement>(null);
  const inView = useInView(rootRef, { once: !replayOnReenter, amount: 0.15 });
  const active = inView || reduce;

  const reveal = (delayMs: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: HIDDEN[animation],
          animate: active ? SHOWN[animation] : HIDDEN[animation],
          transition: { duration: animationDuration, ease: [0.16, 1, 0.3, 1] as const, delay: delayMs / 1000 },
        };

  const vars = { ["--sf-title" as string]: `${titleSize}px`, ["--sf-desc" as string]: `${descriptionSize}px` } as React.CSSProperties;

  return (
    <section ref={rootRef} aria-labelledby={`${uid}-title`} className={cn("@container w-full", className)} style={{ background: t.page, fontFamily: uiFontFamily, ...vars }}>
      {/* Remounting on animation change replays the whole entrance with the new style. */}
      <div key={animation} className="flex flex-col items-center gap-10 px-4 py-8 @[720px]:gap-14 @[720px]:px-6 @[720px]:pt-[39px] @[720px]:pb-12">
        <motion.header {...reveal(60)} className="flex max-w-[640px] flex-col items-center gap-3.5 text-center">
          {badge && (
            <p className="m-0 rounded-full px-3.5 py-[5px] text-[11px] leading-[1.3] font-semibold tracking-[0.1em] uppercase" style={{ background: t.badgeBg, border: `1px solid ${t.badgeBorder}`, color: t.badgeText }}>
              {badge}
            </p>
          )}
          <h2
            id={`${uid}-title`}
            className="m-0 leading-[1.15] font-medium tracking-[-0.03em] [font-size:max(28px,calc(var(--sf-title)*0.7))] @[720px]:[font-size:var(--sf-title)]"
            style={{ fontFamily: titleFontFamily, color: t.title }}
          >
            {title}
          </h2>
          {description && (
            <p className="m-0 max-w-[480px] leading-[1.6] [font-size:max(14px,calc(var(--sf-desc)*0.92))] @[720px]:[font-size:var(--sf-desc)]" style={{ color: t.desc }}>
              {description}
            </p>
          )}
        </motion.header>

        <div className="grid w-full max-w-[900px] grid-cols-1 items-center gap-12 @[720px]:grid-cols-[1.1fr_0.9fr] @[720px]:gap-16">
          <motion.figure {...reveal(220)} className="m-0 flex flex-col items-center gap-5">
            <ConcentricChart rings={rings} trackColor={t.track} show={active} reduce={reduce} label={chartCaption ?? title} />
            <figcaption className="text-center">
              {showTrend && trendText && (
                <p className="m-0 text-[14px] leading-[1.4] font-medium" style={{ color: t.trend }}>
                  {trendText} <span aria-hidden="true">{"\u2197"}</span>
                </p>
              )}
              {(chartCaption || chartSubcaption) && (
                <p className="m-0 text-[13px] leading-[1.4]" style={{ color: t.subcaption }}>
                  {[chartCaption, chartSubcaption].filter(Boolean).join(" \u00b7 ")}
                </p>
              )}
            </figcaption>
          </motion.figure>

          <ul className="m-0 flex list-none flex-col gap-9 p-0">
            {stats.map((stat, i) => {
              const delay = 380 + i * staggerDelay;
              return (
                <motion.li key={stat.label} {...reveal(delay)} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline gap-0.5">
                    <CountUp
                      value={stat.number}
                      start={active}
                      delay={delay}
                      duration={countDuration}
                      reduce={reduce}
                      className="text-[36px] leading-none font-medium tracking-[-0.03em] @[720px]:text-[42px]"
                      style={{ fontFamily: titleFontFamily, color: t.statNumber, fontVariantNumeric: "tabular-nums" }}
                    />
                    {stat.suffix && (
                      <span className="text-[22px] leading-none @[720px]:text-[26px]" style={{ fontFamily: titleFontFamily, color: t.statNumber, opacity: 0.85 }}>
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <p className="m-0 text-[15px] leading-[1.4]" style={{ color: t.statLabel }}>{stat.label}</p>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
