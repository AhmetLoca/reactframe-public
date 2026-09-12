"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CountdownCellShape = "rounded" | "square" | "circle";
export type CountdownAlign = "left" | "center" | "right";
export type CountdownLabelPosition = "top" | "bottom";

export interface CountdownTimerProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  /** ISO date/time to count down to, e.g. "2027-12-31T23:59:00". Takes priority over `duration`. */
  endDate?: string;
  /** Duration in milliseconds to count down from, starting now. Ignored if `endDate` is set. */
  duration?: number;
  showDays?: boolean;
  showHours?: boolean;
  showSeconds?: boolean;
  loop?: boolean;
  expiredText?: string;
  compact?: boolean;
  cellSize?: number;
  cellShape?: CountdownCellShape;
  showLabel?: boolean;
  labelPosition?: CountdownLabelPosition;
  align?: CountdownAlign;
  blinkColon?: boolean;
  fontFamily?: "system" | "mono" | "serif";
}

interface CountdownThemeColors {
  digitColor: string;
  cellBg: string;
  cellBorderColor: string;
  labelColor: string;
  colonColor: string;
}

interface TimeState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calcTime(targetMs: number): TimeState {
  const diff = targetMs - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
}

const INITIAL_TIME: TimeState = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };

function useCountdown(targetMs: number): TimeState {
  // Starts from a fixed placeholder (not calcTime(Date.now())) so the server-rendered
  // markup and the client's first hydration pass always match — Date.now() differs
  // between the two, which would otherwise throw a hydration mismatch.
  const [time, setTime] = React.useState<TimeState>(INITIAL_TIME);
  React.useEffect(() => {
    setTime(calcTime(targetMs));
    const id = setInterval(() => setTime(calcTime(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  return time;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

const COUNTDOWN_FONT_MAP: Record<"system" | "mono" | "serif", string> = {
  system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'SF Mono', 'Fira Code', 'Consolas', 'Courier New', monospace",
  serif: "Georgia, 'Times New Roman', serif",
};

function FlipCell({
  value,
  label,
  cellSize,
  radius,
  showLabel,
  labelPosition,
  colors,
}: {
  value: number;
  label: string;
  cellSize: number;
  radius: number | string;
  showLabel: boolean;
  labelPosition: CountdownLabelPosition;
  colors?: CountdownThemeColors;
}) {
  const digit = pad2(value);
  const digitSize = Math.round(cellSize * 0.43);
  const labelSize = Math.max(8, Math.round(digitSize * 0.52));

  return (
    <div className="relative" style={{ width: cellSize, height: cellSize }}>
      <div
        className={cn("relative flex items-center justify-center overflow-hidden border", !colors && "border-white/10 bg-[#141414]")}
        style={{ width: cellSize, height: cellSize, borderRadius: radius, ...(colors && { borderColor: colors.cellBorderColor, background: colors.cellBg }) }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={digit}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
            className={cn("absolute font-extrabold leading-none tracking-tight tabular-nums", !colors && "text-[#f5f4f1]")}
            style={{ fontSize: digitSize, ...(colors && { color: colors.digitColor }) }}
          >
            {digit}
          </motion.span>
        </AnimatePresence>
      </div>
      {showLabel && (
        <span
          className={cn(
            "absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-bold uppercase tracking-widest",
            !colors && "text-[#f5f4f1]/40",
            labelPosition === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5",
          )}
          style={{ fontSize: labelSize, ...(colors && { color: colors.labelColor }) }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function Colon({ size, blink, cellSize, color }: { size: number; blink: boolean; cellSize: number; color?: string }) {
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    if (!blink) return;
    const id = setInterval(() => setVisible((v) => !v), 1000);
    return () => clearInterval(id);
  }, [blink]);

  return (
    <div className="flex items-center" style={{ height: cellSize }}>
      <span
        className={cn("font-bold leading-none transition-opacity duration-300", !color && "text-[#f5f4f1]/70")}
        style={{ fontSize: size, opacity: blink ? (visible ? 0.7 : 0.18) : 0.7, ...(color && { color }) }}
      >
        :
      </span>
    </div>
  );
}

export function CountdownTimer({
  endDate,
  duration = 3 * 86400000,
  showDays = true,
  showHours = true,
  showSeconds = true,
  loop = false,
  expiredText = "Offer ended!",
  compact = false,
  cellSize = 58,
  cellShape = "rounded",
  showLabel = true,
  labelPosition = "bottom",
  align = "center",
  blinkColon = true,
  fontFamily = "system",
  className,
  style,
  ...props
}: CountdownTimerProps) {
  const [loopKey, setLoopKey] = React.useState(0);
  const loopFired = React.useRef(false);

  const targetMs = React.useMemo(() => {
    if (endDate) {
      const dt = new Date(endDate);
      return Number.isNaN(dt.getTime()) ? Date.now() + duration : dt.getTime();
    }
    return Date.now() + duration;
    // loopKey intentionally forces a fresh target when looping a duration countdown
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate, duration, loopKey]);

  const time = useCountdown(targetMs);

  React.useEffect(() => {
    if (time.expired && loop && !endDate) {
      if (!loopFired.current) {
        loopFired.current = true;
        setLoopKey((k) => k + 1);
      }
    } else {
      loopFired.current = false;
    }
  }, [time.expired, loop, endDate]);

  const radius: number | string =
    cellShape === "circle" ? "50%" : cellShape === "square" ? 4 : Math.round(cellSize * 0.175);
  const justify = align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";
  const gap = Math.round(cellSize * 0.17);
  const colonSize = Math.round(cellSize * 0.53);

  if (time.expired && !loop) {
    return (
      <div className={cn("flex w-full flex-col items-center gap-3", className)} style={{ fontFamily: COUNTDOWN_FONT_MAP[fontFamily], ...style }} {...props}>
        <div className={cn("flex w-full items-center", justify)}>
          <span className="font-bold text-[#f5f4f1]" style={{ fontSize: Math.round(cellSize * 0.43) }}>
            {expiredText}
          </span>
        </div>
      </div>
    );
  }

  if (compact) {
    const numSize = Math.round(cellSize * 0.7);
    const unitSize = Math.round(cellSize * 0.33);
    const sepSize = Math.round(cellSize * 0.6);
    const unitMarginLeft = Math.round(cellSize * 0.05);
    const unitPaddingBottom = Math.round(cellSize * 0.06);
    return (
      <div className={cn("flex w-full flex-col items-center gap-3", className)} style={{ fontFamily: COUNTDOWN_FONT_MAP[fontFamily], ...style }} {...props}>
        <div className={cn("flex w-full items-baseline", justify)}>
          {showDays && time.days > 0 && (
            <>
              <span className="font-extrabold leading-none tracking-tight tabular-nums text-[#f5f4f1]" style={{ fontSize: numSize }}>
                {pad2(time.days)}
              </span>
              {showLabel && <span className="self-end font-bold tracking-wider uppercase text-[#f5f4f1]/50" style={{ fontSize: unitSize, marginLeft: unitMarginLeft, paddingBottom: unitPaddingBottom }}>d</span>}
              <span className="font-bold leading-none text-[#f5f4f1]/45" style={{ fontSize: sepSize, margin: `0 ${Math.round(cellSize * 0.06)}px` }}>:</span>
            </>
          )}
          {showHours && (
            <>
              <span className="font-extrabold leading-none tracking-tight tabular-nums text-[#f5f4f1]" style={{ fontSize: numSize }}>
                {pad2(time.hours)}
              </span>
              {showLabel && <span className="self-end font-bold tracking-wider uppercase text-[#f5f4f1]/50" style={{ fontSize: unitSize, marginLeft: unitMarginLeft, paddingBottom: unitPaddingBottom }}>h</span>}
              <span className="font-bold leading-none text-[#f5f4f1]/45" style={{ fontSize: sepSize, margin: `0 ${Math.round(cellSize * 0.06)}px` }}>:</span>
            </>
          )}
          <span className="font-extrabold leading-none tracking-tight tabular-nums text-[#f5f4f1]" style={{ fontSize: numSize }}>
            {pad2(time.minutes)}
          </span>
          {showLabel && <span className="self-end font-bold tracking-wider uppercase text-[#f5f4f1]/50" style={{ fontSize: unitSize, marginLeft: unitMarginLeft, paddingBottom: unitPaddingBottom }}>m</span>}
          {showSeconds && (
            <>
              <span className="font-bold leading-none text-[#f5f4f1]/45" style={{ fontSize: sepSize, margin: `0 ${Math.round(cellSize * 0.06)}px` }}>:</span>
              <span className="font-extrabold leading-none tracking-tight tabular-nums text-[#f5f4f1]" style={{ fontSize: numSize }}>
                {pad2(time.seconds)}
              </span>
              {showLabel && <span className="self-end font-bold tracking-wider uppercase text-[#f5f4f1]/50" style={{ fontSize: unitSize, marginLeft: unitMarginLeft, paddingBottom: unitPaddingBottom }}>s</span>}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col items-center gap-3", className)} style={{ fontFamily: COUNTDOWN_FONT_MAP[fontFamily], ...style }} {...props}>
    <div className={cn("flex w-full items-center", justify)} style={{ gap }}>
      {showDays && time.days > 0 && (
        <>
          <FlipCell value={time.days} label="days" cellSize={cellSize} radius={radius} showLabel={showLabel} labelPosition={labelPosition} />
          <Colon size={colonSize} blink={blinkColon} cellSize={cellSize} />
        </>
      )}
      {showHours && (
        <>
          <FlipCell value={time.hours} label="hrs" cellSize={cellSize} radius={radius} showLabel={showLabel} labelPosition={labelPosition} />
          <Colon size={colonSize} blink={blinkColon} cellSize={cellSize} />
        </>
      )}
      <FlipCell value={time.minutes} label="min" cellSize={cellSize} radius={radius} showLabel={showLabel} labelPosition={labelPosition} />
      {showSeconds && (
        <>
          <Colon size={colonSize} blink={blinkColon} cellSize={cellSize} />
          <FlipCell value={time.seconds} label="sec" cellSize={cellSize} radius={radius} showLabel={showLabel} labelPosition={labelPosition} />
        </>
      )}
    </div>
    </div>
  );
}
