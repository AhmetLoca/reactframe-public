"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CosmicBackgroundProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  /** Base canvas color behind the stars and rings. */
  backgroundColor?: string;
  /** Color of the cone light and spotlight glow, as "r,g,b". */
  lightColor?: string;
  lightWidth?: number;
  pulseEnabled?: boolean;
  pulseSpeed?: number;
  parallaxStrength?: number;
  noiseStrength?: number;
  rotationSpeed?: number;
  dotBrightness?: number;
  starCount?: number;
  /** Shows the theme-selector pill row without auto-cycling. */
  showThemeSelector?: boolean;
}

const DEMO_THEMES = [
  { name: "Deep Space", bg: "#050c1a" },
  { name: "Void", bg: "#0a0614" },
  { name: "Obsidian", bg: "#080808" },
];
const RINGS = [
  { rp: 0.1, n: 18, dir: 1 as const, spd: 0.0008, ds: 1.8, op: 0.82 },
  { rp: 0.2, n: 34, dir: -1 as const, spd: 0.00055, ds: 1.5, op: 0.6 },
  { rp: 0.32, n: 54, dir: 1 as const, spd: 0.00038, ds: 1.2, op: 0.42 },
  { rp: 0.46, n: 74, dir: -1 as const, spd: 0.00026, ds: 1.0, op: 0.28 },
  { rp: 0.61, n: 98, dir: 1 as const, spd: 0.00017, ds: 0.8, op: 0.18 },
];

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  const f = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
  return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
}

export function CosmicBackground({
  backgroundColor = "#050c1a",
  lightColor = "#bed7ff",
  lightWidth = 54,
  pulseEnabled = true,
  pulseSpeed = 1.0,
  parallaxStrength = 30,
  noiseStrength = 0.04,
  rotationSpeed = 0.4,
  dotBrightness = 0.4,
  starCount = 330,
  showThemeSelector = false,
  className,
  ...props
}: CosmicBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const coneRef = React.useRef<HTMLDivElement>(null);
  const spotRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | undefined>(undefined);
  const mouseRef = React.useRef({ x: 0, y: 0 });
  const smoothRef = React.useRef({ x: 0, y: 0 });
  const filterId = React.useId().replace(/:/g, "");

  const [activeIdx, setActiveIdx] = React.useState(() => {
    const idx = DEMO_THEMES.findIndex((t) => t.bg.toLowerCase() === backgroundColor.toLowerCase());
    return idx >= 0 ? idx : 0;
  });

  const effectiveBg = showThemeSelector ? DEMO_THEMES[activeIdx].bg : backgroundColor;

  const [lr, lg, lb] = hexToRgb(lightColor);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      };
    };
    const onLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let stars: { x: number; y: number; r: number; a: number }[] = [];
    const startTime = performance.now();
    let pausedAt = 0;
    let pausedOffset = 0;

    const setup = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.1 + 0.2,
        a: Math.random() * 0.26 + 0.04,
      }));
    };
    setup();
    const ro = new ResizeObserver(setup);
    ro.observe(canvas);

    const draw = (now: number) => {
      const t = now - startTime - pausedOffset;
      const raw = mouseRef.current;

      const sm = smoothRef.current;
      sm.x += (raw.x - sm.x) * 0.04;
      sm.y += (raw.y - sm.y) * 0.04;
      const ox = sm.x * parallaxStrength;
      const oy = sm.y * parallaxStrength;
      const cx = W / 2 + ox;
      const cy = H / 2 + oy;
      const base = Math.min(W, H) * 0.88;

      ctx.clearRect(0, 0, W, H);

      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x + ox * 0.3, s.y + oy * 0.3, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a * dotBrightness * 1.6})`;
        ctx.fill();
      }

      for (const ring of RINGS) {
        const radius = ring.rp * base;
        const angle = t * ring.spd * rotationSpeed * ring.dir;
        for (let i = 0; i < ring.n; i++) {
          const a = angle + (i / ring.n) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, ring.ds, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${ring.op * dotBrightness})`;
          ctx.fill();
        }
      }

      const pulse = pulseEnabled ? 0.75 + 0.25 * Math.sin(t * pulseSpeed * 0.0008) : 1;
      if (coneRef.current) coneRef.current.style.opacity = String(pulse);
      if (spotRef.current) spotRef.current.style.opacity = String(pulse);

      rafRef.current = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (pausedAt) {
            pausedOffset += performance.now() - pausedAt;
            pausedAt = 0;
          }
          if (!rafRef.current) rafRef.current = requestAnimationFrame(draw);
        } else {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = undefined;
          }
          pausedAt = performance.now();
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      ro.disconnect();
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [rotationSpeed, dotBrightness, starCount, parallaxStrength, pulseEnabled, pulseSpeed]);

  const coneHalfAngle = lightWidth / 2;
  const coneStart = (50 - coneHalfAngle) / 100;
  const coneEnd = (50 + coneHalfAngle) / 100;

  return (
    <div
      ref={containerRef}
      aria-hidden={!showThemeSelector}
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{ backgroundColor: effectiveBg, transition: showThemeSelector ? "background-color 1.2s ease" : undefined }}
      {...props}
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />

      <div
        ref={coneRef}
        className="pointer-events-none absolute left-1/2 top-0 h-[65%] w-[110%] -translate-x-1/2"
        style={{
          background: `conic-gradient(from 270deg at 50% 0%, transparent ${(coneStart * 100).toFixed(1)}%, rgba(${lr},${lg},${lb},0.11) 50%, transparent ${(coneEnd * 100).toFixed(1)}%)`,
        }}
      />

      <div
        ref={spotRef}
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          top: -100,
          width: 560,
          height: 400,
          background: `radial-gradient(ellipse at center, rgba(${lr},${lg},${lb},0.22) 0%, rgba(${lr},${lg},${lb},0.06) 40%, transparent 68%)`,
        }}
      />

      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ opacity: noiseStrength, mixBlendMode: "screen" }}
      >
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves={4} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>

      {showThemeSelector && (
        <div role="group" aria-label="Color theme" className="absolute inset-x-0 top-8 flex justify-center gap-2">
          {DEMO_THEMES.map((theme, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={theme.name}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveIdx(i)}
                className="rounded-full px-5 py-1.5 text-xs font-medium tracking-[0.12em] backdrop-blur-sm transition-colors duration-300 select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white/55"
                style={{
                  border: `1px solid ${isActive ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.10)"}`,
                  backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                  color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)",
                }}
              >
                {theme.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
