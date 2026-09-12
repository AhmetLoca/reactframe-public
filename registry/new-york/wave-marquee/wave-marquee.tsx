"use client";

// An SVG textPath marquee that tiles text along one of several curved
// tracks (wave, circle, infinity, arch, line), optionally with a second
// independent layer for a layered scrolling effect.

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type MarqueeShape = "wave" | "circle" | "infinity" | "arch" | "line";
type MarqueeDirection = "forward" | "reverse";

interface Metrics {
  length: number;
  reps: number;
}

interface Vec2 {
  x: number;
  y: number;
}

const STAGE_W = 1200;
const STAGE_H = 520;
const MID_X = STAGE_W / 2;
const MID_Y = STAGE_H / 2;
const SAFE_GAP = 6;

// Rounded to a fixed precision so the printed path string is identical
// between server and client renders — raw floats from Math.sin/cos can
// differ by a single ULP across runtimes, which otherwise produces a
// (harmless but noisy) hydration mismatch on the `d` attribute.
function r(n: number): number {
  return Math.round(n * 1000) / 1000;
}

// Traces a smooth curve through a set of points with a Catmull-Rom spline,
// converted to cubic bezier segments — every shape below just supplies points.
function traceCurve(points: Vec2[], closed: boolean): string {
  if (points.length < 2) return "";
  const n = points.length;
  const at = (i: number): Vec2 => (closed ? points[((i % n) + n) % n] : points[Math.min(Math.max(i, 0), n - 1)]);

  const commands: string[] = [`M ${r(points[0].x)} ${r(points[0].y)}`];
  const segmentCount = closed ? n : n - 1;

  for (let i = 0; i < segmentCount; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    commands.push(`C ${r(c1x)} ${r(c1y)} ${r(c2x)} ${r(c2y)} ${r(p2.x)} ${r(p2.y)}`);
  }
  if (closed) commands.push("Z");
  return commands.join(" ");
}

function verticalRoom(ribbonWidth: number): number {
  return Math.max(20, MID_Y - Math.max(0, ribbonWidth) / 2 - SAFE_GAP);
}

function waveTrack(curviness: number, ribbonWidth: number): Vec2[] {
  const amplitude = Math.min(Math.max(0, curviness) * 1.05, verticalRoom(ribbonWidth));
  const spanStart = -320;
  const spanEnd = STAGE_W + 320;
  const samples = 28;
  const points: Vec2[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = spanStart + t * (spanEnd - spanStart);
    const phase = t * Math.PI * 6;
    points.push({ x, y: MID_Y - Math.sin(phase) * amplitude });
  }
  return points;
}

function circleTrack(curviness: number, ribbonWidth: number): Vec2[] {
  const radius = Math.min(90 + Math.max(0, curviness) * 0.95, verticalRoom(ribbonWidth));
  const segments = 48;
  const points: Vec2[] = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push({ x: MID_X + Math.cos(angle) * radius, y: MID_Y + Math.sin(angle) * radius });
  }
  return points;
}

function infinityTrack(curviness: number, ribbonWidth: number): Vec2[] {
  const spread = 150 + Math.max(0, curviness) * 1.4;
  const lift = Math.min(60 + Math.max(0, curviness) * 0.95, verticalRoom(ribbonWidth));
  const segments = 64;
  const points: Vec2[] = [];
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const denom = 1 + Math.sin(t) * Math.sin(t);
    points.push({
      x: MID_X + (spread * Math.cos(t)) / denom,
      y: MID_Y + (lift * Math.sin(t) * Math.cos(t)) / denom,
    });
  }
  return points;
}

function archTrack(curviness: number, ribbonWidth: number): Vec2[] {
  const rise = Math.min(120 + Math.max(0, curviness) * 1.1, verticalRoom(ribbonWidth) * 2);
  const left = 120;
  const right = STAGE_W - 120;
  const samples = 16;
  const points: Vec2[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = left + t * (right - left);
    const y = MID_Y + rise / 2 - Math.sin(t * Math.PI) * rise * 1.5;
    points.push({ x, y });
  }
  return points;
}

function lineTrack(): Vec2[] {
  return [
    { x: -320, y: MID_Y },
    { x: STAGE_W + 320, y: MID_Y },
  ];
}

function composeShapePath(shape: MarqueeShape, curviness: number, ribbonWidth: number): string {
  switch (shape) {
    case "circle":
      return traceCurve(circleTrack(curviness, ribbonWidth), true);
    case "infinity":
      return traceCurve(infinityTrack(curviness, ribbonWidth), true);
    case "arch":
      return traceCurve(archTrack(curviness, ribbonWidth), false);
    case "line":
      return traceCurve(lineTrack(), false);
    case "wave":
    default:
      return traceCurve(waveTrack(curviness, ribbonWidth), false);
  }
}

interface MarqueeLayerProps {
  text: string;
  shape: MarqueeShape;
  curviness: number;
  separator: string;
  uppercase: boolean;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  color: string;
  ribbon: boolean;
  ribbonColor: string;
  ribbonColorEnd: string;
  ribbonWidth: number;
  glow: boolean;
  speed: number;
  direction: MarqueeDirection;
  opacity: number;
  isVisible: boolean;
}

function MarqueeLayer({
  text,
  shape,
  curviness,
  separator,
  uppercase,
  fontSize,
  fontWeight,
  letterSpacing,
  color,
  ribbon,
  ribbonColor,
  ribbonColorEnd,
  ribbonWidth,
  glow,
  speed,
  direction,
  opacity,
  isVisible,
}: MarqueeLayerProps) {
  const trackRef = React.useRef<SVGPathElement | null>(null);
  const measureRef = React.useRef<SVGTextElement | null>(null);
  const headRef = React.useRef<SVGTextPathElement | null>(null);
  const tailRef = React.useRef<SVGTextPathElement | null>(null);

  const [metrics, setMetrics] = React.useState<Metrics>({ length: 0, reps: 1 });

  const rawId = React.useId();
  const curveId = `wave-marquee-curve-${rawId.replace(/[:]/g, "")}`;
  const gradientId = `wave-marquee-gradient-${rawId.replace(/[:]/g, "")}`;
  const glowId = `wave-marquee-glow-${rawId.replace(/[:]/g, "")}`;

  const d = React.useMemo(() => composeShapePath(shape, curviness, ribbonWidth), [shape, curviness, ribbonWidth]);

  const textChunk = React.useMemo(() => {
    const base = uppercase ? String(text).toUpperCase() : String(text);
    const gap = separator ? ` ${separator} ` : "   ";
    return `${base}${gap}`;
  }, [text, separator, uppercase]);

  const textStyle = React.useMemo<React.CSSProperties>(
    () => ({ fontSize, fontWeight, letterSpacing }),
    [fontSize, fontWeight, letterSpacing]
  );

  // Measure track length + chunk width so the tiled text loops seamlessly.
  React.useLayoutEffect(() => {
    const trackEl = trackRef.current;
    const measureEl = measureRef.current;
    if (!trackEl || !measureEl) return;

    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      let length = 0;
      let chunkWidth = 0;
      try {
        length = trackEl.getTotalLength();
        chunkWidth = measureEl.getComputedTextLength();
      } catch {
        return;
      }
      if (!length) return;

      const reps = chunkWidth > 0 ? Math.max(1, Math.round(length / chunkWidth)) : 1;
      setMetrics((prev) => (prev.length === length && prev.reps === reps ? prev : { length, reps }));
    };

    measure();
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [d, textChunk, textStyle]);

  // Drive the textPath offsets with a plain RAF loop (no external deps).
  React.useEffect(() => {
    const { length } = metrics;
    const head = headRef.current;
    const tail = tailRef.current;
    if (!head || !tail || !length) return;

    const applyOffset = (offset: number) => {
      const partner = offset >= 0 ? offset - length : offset + length;
      head.setAttribute("startOffset", String(offset));
      tail.setAttribute("startOffset", String(partner));
    };

    applyOffset(0);

    if (speed <= 0) return;

    const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let raf = 0;
    let lastTime = performance.now();
    let traveled = 0;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (isVisible) {
        traveled += dt * speed;
        traveled %= length;
        const signed = direction === "reverse" ? -traveled : traveled;
        applyOffset(signed);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [metrics, speed, direction, isVisible]);

  const tiledText = textChunk.repeat(metrics.reps);
  const fitLen = metrics.length || undefined;
  const glowRadius = Math.max(2, ribbonWidth * 0.18);

  return (
    <g opacity={opacity}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={ribbonColor} />
          <stop offset="100%" stopColor={ribbonColorEnd} />
        </linearGradient>
        {ribbon && glow && (
          <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={glowRadius} result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <path
        ref={trackRef}
        id={curveId}
        d={d}
        fill="none"
        stroke={ribbon ? `url(#${gradientId})` : "none"}
        strokeWidth={ribbon ? ribbonWidth : 0}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={ribbon && glow ? `url(#${glowId})` : undefined}
      />

      <text ref={measureRef} style={{ ...textStyle, visibility: "hidden" }} aria-hidden="true">
        {textChunk}
      </text>

      <text style={{ ...textStyle, userSelect: "none" }} fill={color} dominantBaseline="central" aria-hidden="true">
        <textPath ref={headRef} href={`#${curveId}`} startOffset={0} textLength={fitLen} lengthAdjust="spacing">
          {tiledText}
        </textPath>
      </text>

      <text style={{ ...textStyle, userSelect: "none" }} fill={color} dominantBaseline="central" aria-hidden="true">
        <textPath ref={tailRef} href={`#${curveId}`} startOffset={0} textLength={fitLen} lengthAdjust="spacing">
          {tiledText}
        </textPath>
      </text>
    </g>
  );
}

export interface WaveMarqueeProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  text?: string;
  shape?: MarqueeShape;
  speed?: number;
  direction?: MarqueeDirection;
  separator?: string;
  curviness?: number;
  uppercase?: boolean;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  color?: string;
  ribbon?: boolean;
  ribbonColor?: string;
  ribbonColorEnd?: string;
  ribbonWidth?: number;
  glow?: boolean;
  secondWave?: boolean;
  secondText?: string;
  secondShape?: MarqueeShape;
  secondSpeed?: number;
  secondDirection?: MarqueeDirection;
  secondCurviness?: number;
  secondColor?: string;
  secondRibbon?: boolean;
  secondRibbonColor?: string;
  secondRibbonColorEnd?: string;
  secondRibbonWidth?: number;
  secondGlow?: boolean;
  secondOpacity?: number;
}

export function WaveMarquee({
  className,
  style,
  text = "ReactFrame ✦ Wave Marquee",
  shape = "wave",
  speed = 90,
  direction = "forward",
  separator = "✦",
  curviness = 90,
  uppercase = true,
  fontSize = 46,
  fontWeight = 800,
  letterSpacing = 2,
  color = "#FFFFFF",
  ribbon = true,
  ribbonColor = "#5227FF",
  ribbonColorEnd = "#FF6EC7",
  ribbonWidth = 86,
  glow = true,
  secondWave = false,
  secondText = "ReactFrame ✦ Wave Marquee",
  secondShape = "wave",
  secondSpeed = 60,
  secondDirection = "reverse",
  secondCurviness = 140,
  secondColor = "#A78BFA",
  secondRibbon = true,
  secondRibbonColor = "#A78BFA",
  secondRibbonColorEnd = "#38BDF8",
  secondRibbonWidth = 50,
  secondGlow = true,
  secondOpacity = 0.55,
  ...props
}: WaveMarqueeProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={cn("relative h-full w-full overflow-hidden", className)} style={style} {...props}>
      <svg width="100%" height="100%" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={secondWave ? `${text} — ${secondText}` : text} className="block">
        <MarqueeLayer
          text={text}
          shape={shape}
          curviness={curviness}
          separator={separator}
          uppercase={uppercase}
          fontSize={fontSize}
          fontWeight={fontWeight}
          letterSpacing={letterSpacing}
          color={color}
          ribbon={ribbon}
          ribbonColor={ribbonColor}
          ribbonColorEnd={ribbonColorEnd}
          ribbonWidth={ribbonWidth}
          glow={glow}
          speed={speed}
          direction={direction}
          opacity={1}
          isVisible={isVisible}
        />

        {secondWave && (
          <MarqueeLayer
            text={secondText}
            shape={secondShape}
            curviness={secondCurviness}
            separator={separator}
            uppercase={uppercase}
            fontSize={fontSize}
            fontWeight={fontWeight}
            letterSpacing={letterSpacing}
            color={secondColor}
            ribbon={secondRibbon}
            ribbonColor={secondRibbonColor}
            ribbonColorEnd={secondRibbonColorEnd}
            ribbonWidth={secondRibbonWidth}
            glow={secondGlow}
            speed={secondSpeed}
            direction={secondDirection}
            opacity={secondOpacity}
            isVisible={isVisible}
          />
        )}
      </svg>
    </div>
  );
}
