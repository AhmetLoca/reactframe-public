"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RatingStarsSize = "xs" | "sm" | "md" | "lg" | "xl" | "custom";
export type RatingStarsLabelStyle = "score" | "fraction" | "percent" | "label";
export type RatingStarsLabelPosition = "right" | "left" | "top" | "bottom";
export type RatingStarsAnimStyle = "instant" | "wave";

export interface RatingStarsProps {
  defaultValue?: number;
  value?: number;
  onRatingChange?: (value: number) => void;
  maxStars?: number;
  readOnly?: boolean;
  allowHalf?: boolean;
  sizePreset?: RatingStarsSize;
  starSize?: number;
  gap?: number;
  fillColor?: string;
  emptyColor?: string;
  strokeWidth?: number;
  colorRange?: boolean;
  colorLow?: string;
  colorMid?: string;
  colorHigh?: string;
  showGlow?: boolean;
  glowSize?: number;
  labelPosition?: RatingStarsLabelPosition;
  showLabel?: boolean;
  labelStyle?: RatingStarsLabelStyle;
  showReviewCount?: boolean;
  reviewCount?: number;
  fontSize?: number;
  textColor?: string;
  showBar?: boolean;
  barHeight?: number;
  barRadius?: number;
  barTrackColor?: string;
  animated?: boolean;
  animStyle?: RatingStarsAnimStyle;
  className?: string;
}

const SIZE_MAP: Record<Exclude<RatingStarsSize, "custom">, number> = { xs: 20, sm: 28, md: 40, lg: 56, xl: 72 };

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "").padEnd(6, "0");
  return [parseInt(h.slice(0, 2), 16) || 0, parseInt(h.slice(2, 4), 16) || 0, parseInt(h.slice(4, 6), 16) || 0];
}

function lerpColor(a: string, b: string, t: number): string {
  try {
    const [ar, ag, ab] = hexToRgb(a);
    const [br, bg, bb] = hexToRgb(b);
    return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)})`;
  } catch {
    return a;
  }
}

function getRangeColor(ratio: number, low: string, mid: string, high: string): string {
  const t = Math.max(0, Math.min(1, ratio));
  return t <= 0.5 ? lerpColor(low, mid, t * 2) : lerpColor(mid, high, (t - 0.5) * 2);
}

function StarIcon({
  filled,
  half,
  size,
  fillColor,
  emptyColor,
  strokeWidth,
  glowSize,
}: {
  filled: boolean;
  half: boolean;
  size: number;
  fillColor: string;
  emptyColor: string;
  strokeWidth: number;
  glowSize: number;
}) {
  const id = React.useId();
  const path = "M12 2.5l2.83 5.73 6.32.92-4.57 4.45 1.08 6.28L12 16.9l-5.66 2.98 1.08-6.28L2.85 9.15l6.32-.92L12 2.5z";
  const glow = glowSize > 0 && (filled || half) ? `drop-shadow(0 0 ${glowSize}px ${fillColor})` : undefined;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ filter: glow, display: "block" }}>
      {half && (
        <defs>
          <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor={fillColor} />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d={path}
        fill={filled ? fillColor : half ? `url(#${id})` : "transparent"}
        stroke={filled || half ? fillColor : emptyColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Burst({ active, color, size }: { active: boolean; color: string; size: number }) {
  const count = 8;
  const radius = size * 0.9;
  return (
    <AnimatePresence>
      {active &&
        Array.from({ length: count }).map((_, i) => {
          const angle = (i / count) * 360;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          return (
            <motion.div
              key={i}
              className="pointer-events-none absolute top-1/2 left-1/2 rounded-full"
              style={{ width: size * 0.12, height: size * 0.12, backgroundColor: color, marginTop: -(size * 0.06), marginLeft: -(size * 0.06) }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x, y, opacity: 0, scale: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          );
        })}
    </AnimatePresence>
  );
}

function Star({
  index,
  value,
  hoverValue,
  allowHalf,
  size,
  fillColor,
  emptyColor,
  strokeWidth,
  glowSize,
  onHover,
  onLeave,
  onClick,
  animate: shouldAnimate,
  waveDelay,
}: {
  index: number;
  value: number;
  hoverValue: number | null;
  allowHalf: boolean;
  size: number;
  fillColor: string;
  emptyColor: string;
  strokeWidth: number;
  glowSize: number;
  onHover: (v: number) => void;
  onLeave: () => void;
  onClick: (v: number) => void;
  animate: boolean;
  waveDelay: number;
}) {
  const [burst, setBurst] = React.useState(false);
  const active = hoverValue !== null ? hoverValue : value;
  const isFilled = active >= index + 1;
  const isHalf = allowHalf && !isFilled && active >= index + 0.5;

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!allowHalf) {
        onHover(index + 1);
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      onHover(e.clientX - rect.left < rect.width / 2 ? index + 0.5 : index + 1);
    },
    [index, allowHalf, onHover],
  );

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      let v = index + 1;
      if (allowHalf) {
        const rect = e.currentTarget.getBoundingClientRect();
        v = e.clientX - rect.left < rect.width / 2 ? index + 0.5 : index + 1;
      }
      onClick(v);
      if (shouldAnimate) {
        setBurst(true);
        setTimeout(() => setBurst(false), 600);
      }
    },
    [index, allowHalf, onClick, shouldAnimate],
  );

  const starValue = index + 1;

  return (
    <div
      role="radio"
      aria-label={`${starValue} ${starValue === 1 ? "star" : "stars"}`}
      aria-checked={isFilled}
      tabIndex={-1}
      className="relative inline-flex cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
      <motion.div
        animate={shouldAnimate && isFilled ? "filled" : "idle"}
        whileHover={shouldAnimate ? "hovered" : undefined}
        whileTap={shouldAnimate ? "tapped" : undefined}
        variants={{
          idle: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 400, damping: 15 } },
          filled: { scale: [1, 1.18, 1], rotate: [0, -10, 10, 0], transition: { duration: 0.4, ease: "easeOut", delay: waveDelay } },
          hovered: { scale: 1.2, transition: { type: "spring", stiffness: 500, damping: 20 } },
          tapped: { scale: 0.9, transition: { type: "spring", stiffness: 500, damping: 20 } },
        }}
        className="inline-flex"
      >
        <StarIcon filled={isFilled} half={isHalf} size={size} fillColor={fillColor} emptyColor={emptyColor} strokeWidth={strokeWidth} glowSize={glowSize} />
      </motion.div>
      {shouldAnimate && <Burst active={burst} color={fillColor} size={size} />}
    </div>
  );
}

function RatingLabel({
  value,
  max,
  showCount,
  reviewCount,
  fontSize,
  textColor,
  labelStyle,
}: {
  value: number;
  max: number;
  showCount: boolean;
  reviewCount: number;
  fontSize: number;
  textColor: string;
  labelStyle: RatingStarsLabelStyle;
}) {
  const labels = ["Terrible", "Poor", "Fair", "Good", "Excellent"];
  const labelIndex = Math.min(Math.ceil(value) - 1, max - 1);
  let text = "";
  if (labelStyle === "score") text = value.toFixed(1);
  else if (labelStyle === "fraction") text = `${value.toFixed(1)} / ${max}`;
  else if (labelStyle === "percent") text = `${Math.round((value / max) * 100)}%`;
  else text = value > 0 ? labels[Math.min(labelIndex, labels.length - 1)] : "—";

  return (
    <div className="flex select-none items-center gap-1.5" style={{ fontSize, color: textColor }}>
      <span className="font-bold">{text}</span>
      {showCount && <span className="opacity-50">({reviewCount.toLocaleString()})</span>}
    </div>
  );
}

function RatingBar({ value, max, fillColor, trackColor, height, radius, animated }: { value: number; max: number; fillColor: string; trackColor: string; height: number; radius: number; animated: boolean }) {
  const pct = Math.min(Math.max(value / max, 0), 1) * 100;
  return (
    <div className="w-full overflow-hidden" style={{ height, borderRadius: radius, backgroundColor: trackColor }}>
      <motion.div
        style={{ height: "100%", backgroundColor: fillColor, borderRadius: radius }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={animated ? { duration: 0.6, ease: "easeOut" } : { duration: 0 }}
      />
    </div>
  );
}

export function RatingStars({
  defaultValue = 3,
  value: controlledValue,
  onRatingChange,
  maxStars = 5,
  readOnly = false,
  allowHalf = true,
  sizePreset = "md",
  starSize = 40,
  gap = 8,
  fillColor = "#F5C518",
  emptyColor = "#9CA3AF",
  strokeWidth = 1.5,
  colorRange = false,
  colorLow = "#EF4444",
  colorMid = "#F5C518",
  colorHigh = "#22C55E",
  showGlow = false,
  glowSize = 8,
  labelPosition = "right",
  showLabel = true,
  labelStyle = "score",
  showReviewCount = false,
  reviewCount = 1284,
  fontSize = 16,
  textColor = "currentColor",
  showBar = false,
  barHeight = 6,
  barRadius = 999,
  barTrackColor = "rgba(128,128,128,0.2)",
  animated = true,
  animStyle = "instant",
  className,
}: RatingStarsProps) {
  const resolvedSize = sizePreset === "custom" ? starSize : SIZE_MAP[sizePreset];
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const handleClick = React.useCallback(
    (v: number) => {
      if (readOnly) return;
      if (!isControlled) setInternalValue(v);
      onRatingChange?.(v);
    },
    [readOnly, isControlled, onRatingChange],
  );

  const handleLeave = React.useCallback(() => setHoverValue(null), []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (readOnly) return;
      const step = allowHalf ? 0.5 : 1;
      let next = value;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        next = Math.min(value + step, maxStars);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        next = Math.max(value - step, 0);
      } else if (e.key === "Home") {
        e.preventDefault();
        next = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        next = maxStars;
      } else {
        return;
      }
      if (!isControlled) setInternalValue(next);
      onRatingChange?.(next);
    },
    [readOnly, allowHalf, value, maxStars, isControlled, onRatingChange],
  );

  const activeValue = hoverValue !== null ? hoverValue : value;
  const activeFill = colorRange ? getRangeColor(activeValue / maxStars, colorLow, colorMid, colorHigh) : fillColor;
  const isVertical = labelPosition === "top" || labelPosition === "bottom";

  const starsRow = (
    <div
      role="slider"
      aria-label="Star rating"
      aria-valuemin={0}
      aria-valuemax={maxStars}
      aria-valuenow={value}
      aria-valuetext={`${value} out of ${maxStars} stars`}
      aria-readonly={readOnly || undefined}
      tabIndex={readOnly ? -1 : 0}
      onKeyDown={handleKeyDown}
      className="flex flex-row items-center outline-none"
      style={{ gap }}
    >
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          index={i}
          value={value}
          hoverValue={readOnly ? null : hoverValue}
          allowHalf={allowHalf}
          size={resolvedSize}
          fillColor={activeFill}
          emptyColor={emptyColor}
          strokeWidth={strokeWidth}
          glowSize={(showGlow ? glowSize : 0)}
          onHover={readOnly ? () => {} : setHoverValue}
          onLeave={readOnly ? () => {} : handleLeave}
          onClick={handleClick}
          animate={animated && !readOnly}
          waveDelay={animated && animStyle === "wave" ? i * 0.07 : 0}
        />
      ))}
    </div>
  );

  const label = (
    <RatingLabel value={value} max={maxStars} showCount={showReviewCount} reviewCount={reviewCount} fontSize={fontSize} textColor={textColor} labelStyle={labelStyle} />
  );

  const bar = <RatingBar value={value} max={maxStars} fillColor={activeFill} trackColor={barTrackColor} height={barHeight} radius={barRadius} animated={animated} />;

  const ratingUI = (
    <div className={cn("flex items-center", isVertical ? "flex-col items-start" : "flex-row", showBar ? "w-full" : "w-fit", className)} style={{ gap: isVertical ? gap * 0.6 : gap }}>
      {showLabel && (labelPosition === "top" || labelPosition === "left") && label}
      <div className="flex flex-col" style={{ gap: gap * 0.5, flex: showBar ? 1 : "0 0 auto" }}>
        {starsRow}
        {showBar && bar}
      </div>
      {showLabel && (labelPosition === "right" || labelPosition === "bottom") && label}
    </div>
  );

  return ratingUI;
}
