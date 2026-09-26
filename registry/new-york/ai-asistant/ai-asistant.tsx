"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AIAsistantState = "waiting" | "listening" | "thinking";
export type AIAsistantTheme = "mesh" | "halo";
export type AIAsistantShape = "circle" | "square" | "diamond" | "ring";

export interface AIAsistantProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  size?: number;
  state?: AIAsistantState;
  theme?: AIAsistantTheme;
  shape?: AIAsistantShape;
  colorA?: string;
  colorB?: string;
  dots?: number;
}

const STATE_LABEL: Record<AIAsistantState, string> = {
  waiting: "Waiting",
  listening: "Listening",
  thinking: "Thinking",
};

const THEME_LABEL: Record<AIAsistantTheme, string> = {
  mesh: "Mesh",
  halo: "Halo",
};

const TAU = Math.PI * 2;
const SEO_TEXT = "AI Asistant is a dotted status light for AI chat products. Mesh and Halo themes, with Waiting, Listening and Thinking states.";

const SR_ONLY_STYLE: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
};

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  if (h.length !== 6 || Number.isNaN(n)) return [153, 94, 36];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixHex(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const k = Math.min(1, Math.max(0, t));
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * k)},${Math.round(A[1] + (B[1] - A[1]) * k)},${Math.round(A[2] + (B[2] - A[2]) * k)})`;
}

function hash(ix: number, iy: number) {
  const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rad: number) {
  const r = Math.min(rad, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawShape(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, shape: AIAsistantShape, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (shape === "circle") {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.fill();
  } else if (shape === "square") {
    const s = r * 1.55;
    roundRect(ctx, -s / 2, -s / 2, s, s, s * 0.34);
    ctx.fill();
  } else if (shape === "diamond") {
    const q = r * 1.15;
    ctx.beginPath();
    ctx.moveTo(0, -q * 1.15);
    ctx.quadraticCurveTo(q * 0.22, -q * 0.22, q, 0);
    ctx.quadraticCurveTo(q * 0.22, q * 0.22, 0, q * 1.15);
    ctx.quadraticCurveTo(-q * 0.22, q * 0.22, -q, 0);
    ctx.quadraticCurveTo(-q * 0.22, -q * 0.22, 0, -q * 1.15);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.92, 0, TAU);
    ctx.lineWidth = Math.max(1.4, r * 0.38);
    ctx.stroke();
  }
  ctx.restore();
}

type Dot = { x: number; y: number; s: number; tone: number };

function layout(theme: AIAsistantTheme, state: AIAsistantState, grid: number, t: number): Dot[] {
  const dots: Dot[] = [];
  const half = (grid - 1) / 2;
  const listen = state === "listening" ? 1 : 0;
  const think = state === "thinking" ? 1 : 0;
  const wait = state === "waiting" ? 1 : 0;

  if (theme === "halo") {
    const rings = Math.max(3, Math.round(grid / 3));
    const pulse = 1 + wait * 0.045 * Math.sin(t * 1.1);
    for (let ring = 0; ring < rings; ring++) {
      const radius = (0.18 + (ring / Math.max(1, rings - 1)) * 0.78) * pulse;
      const count = 6 + ring * 4;
      const dir = ring % 2 === 0 ? 1 : -1;
      const spin = wait ? 0 : t * (0.18 + think * 0.28 + listen * 0.12) * dir;
      const listenPulse = listen * 0.05 * Math.sin(t * 2.4 - ring * 0.8);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * TAU + spin;
        const sweep = think ? 0.5 + 0.5 * Math.sin(a * 2 + t * 1.6) : ring / Math.max(1, rings - 1);
        dots.push({
          x: Math.cos(a) * radius * (1 + listenPulse),
          y: Math.sin(a) * radius * (1 + listenPulse),
          s: 0.72 - ring * 0.06 + listen * 0.08,
          tone: sweep,
        });
      }
    }
    return dots;
  }

  for (let iy = 0; iy < grid; iy++) {
    for (let ix = 0; ix < grid; ix++) {
      const stagger = iy % 2 === 1 ? 0.5 : 0;
      const nx = (ix + stagger - half) / half;
      const ny = (iy - half) / half;
      const d = Math.hypot(nx, ny);
      if (d > 1.12) continue;

      const breathe = 1 + wait * 0.04 * Math.sin(t * 1.1 + d * 2);
      const ripple = listen * 0.07 * Math.sin(d * 7 - t * 2.8);
      const hop = think * 0.06 * Math.sin(hash(ix, iy) * TAU + t * 2.4);

      let tone = 0.5 + nx * 0.42;
      if (think) {
        const band = 0.5 + 0.5 * Math.sin(nx * 3.2 + ny * 1.4 + t * 1.8);
        tone = 0.08 + 0.84 * band;
      } else if (listen) {
        tone = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(d * 5 - t * 2.2));
      }

      dots.push({
        x: nx * (breathe + ripple),
        y: ny * (breathe + ripple),
        s: 0.5 + 0.5 * Math.exp(-d * d * 0.9) + hop,
        tone,
      });
    }
  }
  return dots;
}

/**
 * AIAsistant — a dotted status light with two layouts (Mesh grid, Halo
 * rings) across three animated states (Waiting, Listening, Thinking), in
 * four dot shapes. Pauses its render loop while off-screen and respects
 * prefers-reduced-motion.
 */
export function AIAsistant({
  className,
  style,
  size = 0,
  state = "waiting",
  theme = "mesh",
  shape = "square",
  colorA = "#995E24",
  colorB = "#221307",
  dots = 13,
  ...props
}: AIAsistantProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const isVisibleRef = React.useRef(true);
  const rafRef = React.useRef(0);

  const useFixed = typeof size === "number" && size > 0;

  const liveRef = React.useRef({ state, theme, shape, a: colorA, b: colorB, dots });
  React.useEffect(() => {
    liveRef.current = { state, theme, shape, a: colorA, b: colorB, dots };
  }, [state, theme, shape, colorA, colorB, dots]);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let last = performance.now();
    let time = 0;
    let side = 240;

    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(2, Math.round(stage.clientWidth * dpr));
      const h = Math.max(2, Math.round(stage.clientHeight * dpr));
      const buffer = Math.min(w, h);
      if (canvas.width !== buffer || canvas.height !== buffer) {
        canvas.width = buffer;
        canvas.height = buffer;
      }
      side = buffer / dpr;
      ctx.setTransform(buffer / side, 0, 0, buffer / side, 0, 0);
    };

    const draw = (t: number) => {
      const L = liveRef.current;
      const grid = Math.max(6, Math.round(L.dots));
      const list = layout(L.theme, L.state, grid, t);
      const radius = side * 0.42;
      const center = side / 2;
      const base = (side * 0.72) / grid;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.clearRect(0, 0, side, side);
      for (const p of list) {
        const r = base * 0.4 * p.s;
        if (r * dpr < 0.45) continue;
        drawShape(ctx, center + p.x * radius, center + p.y * radius, r, L.shape, mixHex(L.a, L.b, Math.min(1, Math.max(0, p.tone))));
      }
    };

    fit();
    const ro = new ResizeObserver(() => fit());
    ro.observe(stage);

    if (reduce) {
      draw(0);
      return () => ro.disconnect();
    }

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      if (isVisibleRef.current) draw(time);
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={`AI Asistant, ${THEME_LABEL[theme]}, ${STATE_LABEL[state]}`}
      className={cn("relative", className)}
      style={{
        width: "100%",
        height: "100%",
        overflow: "visible",
        ...style,
        ...(useFixed ? { width: size, height: size } : null),
      }}
      {...props}
    >
      <span style={SR_ONLY_STYLE}>{SEO_TEXT}</span>

      <div ref={stageRef} style={{ position: "absolute", inset: 0, overflow: "hidden", background: "transparent" }}>
        <canvas ref={canvasRef} aria-hidden="true" style={{ width: "100%", height: "100%", display: "block" }} />
      </div>
    </div>
  );
}

export default AIAsistant;
