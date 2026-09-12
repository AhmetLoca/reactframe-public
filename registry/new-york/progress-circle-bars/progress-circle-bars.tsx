"use client";

import * as React from "react";
import { motion, useInView, type Transition } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SIZE_PRESETS: Record<string, { circleSize: number; strokeWidth: number }> = {
  "2xl": { circleSize: 200, strokeWidth: 20 },
  xl: { circleSize: 160, strokeWidth: 16 },
  lg: { circleSize: 120, strokeWidth: 12 },
  md: { circleSize: 90, strokeWidth: 10 },
  sm: { circleSize: 64, strokeWidth: 8 },
  xs: { circleSize: 44, strokeWidth: 6 },
  "2xs": { circleSize: 32, strokeWidth: 4 },
};

export type ProgressCircleSizePreset = keyof typeof SIZE_PRESETS | "custom";
export type ProgressCircleArcStyle = "ring" | "gauge" | "dashes";
export type ProgressCircleValueStyle = "center" | "badge" | "none";

export interface ProgressCircleBarsProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children" | "content"> {
  sizePreset?: ProgressCircleSizePreset;
  arcStyle?: ProgressCircleArcStyle;
  circleSize?: number;
  strokeWidth?: number;
  dashCount?: number;
  showCenterLabel?: boolean;

  label?: string;
  percentage?: number;
  showLabel?: boolean;

  valueStyle?: ProgressCircleValueStyle;
  countUp?: boolean;
  prefix?: string;
  suffix?: string;
  badgeBg?: string;
  badgeTextColor?: string;

  colorStart?: string;
  colorEnd?: string;

  thresholdsEnabled?: boolean;
  thresholdLowMax?: number;
  thresholdLowColor?: string;
  thresholdMidMax?: number;
  thresholdMidColor?: string;
  thresholdHighColor?: string;

  trackColor?: string;
  trackBorderWidth?: number;
  trackBorderColor?: string;

  labelColor?: string;
  labelSize?: number;
  labelFontFamily?: string;
  percentageColor?: string;
  percentageSize?: number;
  percentageFontFamily?: string;
  spacing?: number;

  scrollReveal?: boolean;
  duration?: number;
  delay?: number;
  completionPulse?: boolean;

  comparisonEnabled?: boolean;
  comparisonValue?: number;
  comparisonColor?: string;
  comparisonStrokeScale?: number;
}

export function ProgressCircleBars({
  sizePreset = "lg",
  arcStyle = "ring",
  circleSize = 120,
  strokeWidth = 12,
  dashCount = 60,
  showCenterLabel = true,

  label = "Circle",
  percentage = 75,
  showLabel = true,

  valueStyle = "center",
  countUp = true,
  prefix = "",
  suffix = "%",
  badgeBg = "#111111",
  badgeTextColor = "#ffffff",

  colorStart = "#7c3aed",
  colorEnd = "#3b82f6",

  thresholdsEnabled = false,
  thresholdLowMax = 40,
  thresholdLowColor = "#ef4444",
  thresholdMidMax = 70,
  thresholdMidColor = "#f59e0b",
  thresholdHighColor = "#10b981",

  trackColor = "#f0f0f8",
  trackBorderWidth = 0,
  trackBorderColor = "#e5e7eb",

  labelColor = "#111111",
  labelSize = 11,
  labelFontFamily = "Inter, sans-serif",
  percentageColor = "#111111",
  percentageSize = 24,
  percentageFontFamily = "Inter, sans-serif",
  spacing = 10,

  scrollReveal = true,
  duration = 1.4,
  delay = 0.1,
  completionPulse = true,

  comparisonEnabled = false,
  comparisonValue = 90,
  comparisonColor = "#d1d5db",
  comparisonStrokeScale = 0.45,

  className,
  ...props
}: ProgressCircleBarsProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [animated, setAnimated] = React.useState(false);
  const [displayValue, setDisplayValue] = React.useState(0);
  const [animFillPct, setAnimFillPct] = React.useState(0);
  const [pulseKey, setPulseKey] = React.useState(0);
  const didInitialAnim = React.useRef(false);
  const gradId = `cpb-arc-grad-${React.useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const clampedPct = Math.min(100, Math.max(0, percentage));
  const isComplete = clampedPct === 100;
  const shouldAnimate = scrollReveal ? isInView : true;

  React.useEffect(() => {
    if (!shouldAnimate || animated) return;
    const timer = setTimeout(() => setAnimated(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [shouldAnimate, animated, delay]);

  React.useEffect(() => {
    if (!animated) return;
    didInitialAnim.current = false;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      const t = frame / totalFrames;
      const eased = 1 - Math.pow(1 - t, 3);
      const animPct = Math.round(eased * clampedPct);
      setDisplayValue(countUp ? animPct : clampedPct);
      setAnimFillPct(eased * clampedPct);
      if (frame >= totalFrames) {
        didInitialAnim.current = true;
        clearInterval(id);
      }
    }, 1000 / 60);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated]);

  React.useEffect(() => {
    if (!animated || !didInitialAnim.current) return;
    setDisplayValue(clampedPct);
    setAnimFillPct(clampedPct);
  }, [clampedPct, animated]);

  React.useEffect(() => {
    if (animated && isComplete && completionPulse) {
      const t = setTimeout(() => setPulseKey((k) => k + 1), duration * 1000 + 100);
      return () => clearTimeout(t);
    }
  }, [animated, isComplete, completionPulse, duration]);

  let activeFillStart = colorStart;
  let activeFillEnd = colorEnd;
  if (thresholdsEnabled) {
    const color = clampedPct < thresholdLowMax ? thresholdLowColor : clampedPct < thresholdMidMax ? thresholdMidColor : thresholdHighColor;
    activeFillStart = color;
    activeFillEnd = color;
  }

  const ease = [0.25, 0.46, 0.45, 0.94] as const;
  const transition: Transition = { duration, ease };

  const isCustomSize = sizePreset === "custom";
  const presetVals = !isCustomSize ? SIZE_PRESETS[sizePreset] : null;
  const svgSize = presetVals ? presetVals.circleSize : circleSize;
  const sw = presetVals ? presetVals.strokeWidth : strokeWidth;
  const r = (svgSize - sw) / 2;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const circumference = 2 * Math.PI * r;
  const isGauge = arcStyle === "gauge";
  const isDashes = arcStyle === "dashes";

  const ringOffset = animated ? circumference * (1 - clampedPct / 100) : circumference;
  const gaugeFillLength = animated ? circumference * 0.75 * (clampedPct / 100) : 0;

  const showCenterValue = valueStyle === "center";
  const showBadge = valueStyle === "badge";

  const gaugeProps = isGauge
    ? {
        strokeDasharray: `${circumference * 0.75} ${circumference * 0.25}`,
        transform: `rotate(135, ${cx}, ${cy})`,
      }
    : {};

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${label}: ${Math.round(clampedPct)}%`}
      className={cn("inline-flex flex-col items-center box-border", className)}
      style={{ gap: spacing }}
      {...props}
    >
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} aria-hidden="true" style={{ overflow: "visible", display: "block" }}>
          <defs>
            <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="0" y1={cy} x2={svgSize} y2={cy}>
              <stop offset="0%" stopColor={activeFillStart} />
              <stop offset="100%" stopColor={activeFillEnd} />
            </linearGradient>
          </defs>

          {trackBorderWidth > 0 && !isDashes && (
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackBorderColor} strokeWidth={sw + trackBorderWidth * 2} strokeLinecap="round" {...gaugeProps} />
          )}

          {!isDashes && <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={sw} strokeLinecap="round" {...gaugeProps} />}

          {!isGauge && !isDashes && (
            <motion.circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={activeFillStart !== activeFillEnd ? `url(#${gradId})` : activeFillStart}
              strokeWidth={sw}
              strokeLinecap="round"
              strokeDasharray={circumference}
              transform={`rotate(-90, ${cx}, ${cy})`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: ringOffset }}
              transition={transition}
            />
          )}

          {isGauge && !isDashes && (
            <motion.circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={activeFillStart !== activeFillEnd ? `url(#${gradId})` : activeFillStart}
              strokeWidth={sw}
              strokeLinecap="round"
              transform={`rotate(135, ${cx}, ${cy})`}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${gaugeFillLength} ${circumference}` }}
              transition={transition}
            />
          )}

          {comparisonEnabled && !isDashes && !isGauge && (
            <motion.circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={comparisonColor}
              strokeWidth={sw * comparisonStrokeScale}
              strokeLinecap="round"
              strokeDasharray={circumference}
              transform={`rotate(-90, ${cx}, ${cy})`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: animated ? circumference * (1 - comparisonValue / 100) : circumference }}
              transition={{ duration: duration * 0.8, ease }}
            />
          )}

          {comparisonEnabled && !isDashes && isGauge && (
            <motion.circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={comparisonColor}
              strokeWidth={sw * comparisonStrokeScale}
              strokeLinecap="round"
              transform={`rotate(135, ${cx}, ${cy})`}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${animated ? circumference * 0.75 * (comparisonValue / 100) : 0} ${circumference}` }}
              transition={{ duration: duration * 0.8, ease }}
            />
          )}

          {isDashes &&
            (() => {
              const count = dashCount;
              const stepAngle = 360 / count;
              const filledCount = animated ? Math.round((animFillPct / 100) * count) : 0;
              const compCount = comparisonEnabled ? Math.round((comparisonValue / 100) * count) : 0;
              const dashWidth = Math.max(2, sw * 0.28);
              const dashFilledH = sw;
              const dashTrackH = sw * 0.4;
              const dashCompH = sw * 0.75;
              const outerY = cy - r - sw / 2;

              return (
                <>
                  {comparisonEnabled &&
                    Array.from({ length: count }, (_, i) => {
                      if (i < filledCount || i >= compCount) return null;
                      return (
                        <rect
                          key={`c${i}`}
                          x={cx - dashWidth / 2}
                          y={outerY}
                          width={dashWidth}
                          height={dashCompH}
                          rx={dashWidth / 2}
                          fill={comparisonColor}
                          opacity={0.65}
                          transform={`rotate(${stepAngle * i}, ${cx}, ${cy})`}
                        />
                      );
                    })}
                  {Array.from({ length: count }, (_, i) => {
                    const isFilled = i < filledCount;
                    const h = isFilled ? dashFilledH : dashTrackH;
                    return (
                      <rect
                        key={i}
                        x={cx - dashWidth / 2}
                        y={outerY}
                        width={dashWidth}
                        height={h}
                        rx={dashWidth / 2}
                        fill={isFilled ? (activeFillStart !== activeFillEnd ? `url(#${gradId})` : activeFillStart) : trackColor}
                        opacity={isFilled ? 1 : 0.55}
                        transform={`rotate(${stepAngle * i}, ${cx}, ${cy})`}
                      />
                    );
                  })}
                </>
              );
            })()}
        </svg>

        {(showCenterValue || showCenterLabel) && (
          <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 pointer-events-none">
            {showCenterValue && (
              <span
                style={{
                  color: percentageColor,
                  fontSize: percentageSize,
                  fontFamily: percentageFontFamily,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {prefix}
                {displayValue}
                {suffix}
              </span>
            )}
            {showCenterLabel && (
              <span style={{ color: labelColor, fontSize: labelSize, fontFamily: labelFontFamily, fontWeight: 500, lineHeight: 1.2, opacity: 0.55 }}>{label}</span>
            )}
          </div>
        )}

        {completionPulse && isComplete && pulseKey > 0 && (
          <motion.div
            key={pulseKey}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: `${Math.max(2, sw * 0.4)}px solid ${activeFillEnd}` }}
            initial={{ opacity: 0.75, scale: 1 }}
            animate={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </div>

      {showBadge && (
        <motion.div
          aria-hidden="true"
          className="flex flex-col items-center pointer-events-none -mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: animated ? 1 : 0 }}
          transition={transition}
        >
          <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: `6px solid ${badgeBg}` }} />
          <div
            style={{
              backgroundColor: badgeBg,
              color: badgeTextColor,
              padding: "3px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontFamily: percentageFontFamily,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.02em",
              boxShadow: "0 2px 10px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)",
              whiteSpace: "nowrap",
              lineHeight: 1.6,
            }}
          >
            {prefix}
            {displayValue}
            {suffix}
          </div>
        </motion.div>
      )}

      {showLabel && !showCenterLabel && (
        <span style={{ color: labelColor, fontSize: labelSize, fontFamily: labelFontFamily, fontWeight: 500, lineHeight: 1.2, letterSpacing: "-0.01em" }}>{label}</span>
      )}
    </div>
  );
}
