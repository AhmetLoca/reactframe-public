"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RGB = [number, number, number];
type Mode = "idle" | "listening" | "thinking" | "working" | "done";
type Status = "auto" | Mode;
type Align = "top" | "center" | "bottom";

export interface AIDynamicIsland01Props {
  status?: Status;
  interactive?: boolean;
  loop?: boolean;
  stageSeconds?: number;
  stepSeconds?: number;
  idleText?: string;
  listeningText?: string;
  thinkingText?: string;
  workingText?: string;
  doneText?: string;
  viewLabel?: string;
  steps?: string[];
  align?: Align;
  shadow?: boolean;
  expandedWidth?: number;
  orbSize?: number;
  particleSize?: number;
  curves?: number;
  curveWidth?: number;
  curveAmp?: number;
  curveColor?: string;
  dotColor?: string;
  accentColor?: string;
  accentAmount?: number;
  font?: React.CSSProperties;
  textColor?: string;
  mutedColor?: string;
  listenColors?: string[];
  thinkColors?: string[];
  doneColors?: string[];
  ringIntensity?: number;
  ringSize?: number;
  ringSpeed?: number;
  background?: string;
  borderColor?: string;
  radius?: number;
  padding?: number;
  gap?: number;
  onStart?: () => void;
  onStop?: () => void;
  onView?: () => void;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const TAU = Math.PI * 2;
const LEAD = 40;
const STOP = 40;
const ROW = 32;
const ICON = 18;
const LIST_TOP = 4;
const LIST_BOTTOM = 14;
const CANVAS = 56;
const POINTS = 240;
const BANDS = 24;
const CURVE_POINTS = 72;
const LEVELS = 6;
const START_ANGLE = 40;
const STATIC_SHIMMER = 72;
const STATIC_TIME = 2.4;
const MODES: Mode[] = ["idle", "listening", "thinking", "working", "done"];
const RUNNING: Mode[] = ["listening", "thinking", "working"];
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const MORPH = "0.62s cubic-bezier(0.3, 1.2, 0.4, 1)";
const FONT_FALLBACK = "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const HAIRLINE = "rgba(255,255,255,0.14)";
const HOVER_ON = "inset 0 0 0 999px rgba(255,255,255,0.06)";
const HOVER_OFF = "inset 0 0 0 999px rgba(255,255,255,0)";
const RING = "0 0 0 2px rgba(255,255,255,0.35)";
const NO_RING = "0 0 0 0 rgba(255,255,255,0)";
const SHEEN =
  "linear-gradient(115deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0) 48%, rgba(255,255,255,0.04) 74%, rgba(255,255,255,0) 100%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0) 60%)";

const DEFAULT_STEPS = ["Searching the web", "Reading 4 sources", "Comparing the results", "Writing the answer"];
const DEFAULT_LISTEN = ["#7CF3FF", "#6EA8FF", "#9B7BFF"];
const DEFAULT_THINK = ["#9B7BFF", "#FF7BD5", "#FFB86B"];
const DEFAULT_DONE = ["#7CFFC4", "#7CF3FF", "#F5F6F8"];

const SR_ONLY: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

type Sizes = {
  label: Record<Mode, number>;
  step: number;
  view: number;
};

type Live = {
  mode: Mode;
  time: number;
  spinT: number;
  spin: number;
  wave: number;
  rot: number;
  level: number;
  curveA: number;
  bands: Float32Array;
  target: Float32Array;
  pal: RGB[];
  angle: number;
  ringSpeed: number;
  orbR: number;
  dot: number;
  curves: number;
  thick: number;
  amp: number;
  core: RGB;
  base: RGB;
  accent: RGB;
  accentAmount: number;
  listen: RGB[];
  think: RGB[];
  done: RGB[];
  still: boolean;
  drawnMode: Mode | null;
};

type Orb = {
  n: number;
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  phi: Float32Array;
  jit: Float32Array;
  sx: Float32Array;
  sy: Float32Array;
  rad: Float32Array;
  lv: Uint8Array;
  hot: Uint8Array;
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function rng(seed: number) {
  let a = Math.floor(seed) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function parseRgb(input: string, fallback: RGB): RGB {
  const s = (input || "").trim();
  if (s.startsWith("#")) {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4)
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    const n = parseInt(h.slice(0, 6), 16);
    if (h.length >= 6 && !Number.isNaN(n)) return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = s.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (m) return [Math.round(+m[1]), Math.round(+m[2]), Math.round(+m[3])];
  return fallback;
}

function mixRgb(a: RGB, b: RGB, t: number): RGB {
  return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)];
}

function cleanList(list: string[] | undefined, fallback: string[]) {
  const out = (list ?? []).filter((s): s is string => typeof s === "string" && s.trim() !== "");
  return out.length ? out : fallback;
}

function sample3(list: RGB[]): RGB[] {
  const n = list.length;
  if (n === 0)
    return [
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255],
    ];
  return [0, 0.5, 1].map((f) => {
    const p = f * (n - 1);
    const i = Math.floor(p);
    return mixRgb(list[i], list[Math.min(n - 1, i + 1)], p - i);
  });
}

function buildGradient(colors: string[], spread: number) {
  const arc = Math.max(0.15, Math.min(1, spread)) * 360;
  const n = colors.length;
  if (n === 0) return "linear-gradient(transparent, transparent)";
  const stops = colors.map((c, i) => {
    const at = n === 1 ? 0.5 : 0.1 + (0.8 * i) / (n - 1);
    return `${c} ${(at * arc).toFixed(1)}deg`;
  });
  return `conic-gradient(from var(--gl-angle, ${START_ANGLE}deg), transparent 0deg, ${stops.join(", ")}, transparent ${arc.toFixed(1)}deg, transparent 360deg)`;
}

function ringStyle(width: number): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    boxSizing: "border-box",
    borderRadius: "inherit",
    padding: width,
    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    maskComposite: "exclude",
  };
}

function makeOrb(n: number): Orb {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const rnd = rng(23);
  const S: Orb = {
    n,
    x: new Float32Array(n),
    y: new Float32Array(n),
    z: new Float32Array(n),
    phi: new Float32Array(n),
    jit: new Float32Array(n),
    sx: new Float32Array(n),
    sy: new Float32Array(n),
    rad: new Float32Array(n),
    lv: new Uint8Array(n),
    hot: new Uint8Array(n),
  };
  for (let i = 0; i < n; i++) {
    const z = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(Math.max(0, 1 - z * z));
    const a = i * golden;
    S.x[i] = r * Math.cos(a);
    S.y[i] = r * Math.sin(a);
    S.z[i] = z;
    S.phi[i] = a;
    S.jit[i] = rnd();
  }
  return S;
}

function projectOrb(S: Orb, spinT: number, t: number, R: number, cx: number, cy: number, dot: number) {
  const tilt = 0.42 + 0.08 * Math.sin(t * 0.45);
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  const twist = 1.6 + 0.3 * Math.sin(t * 0.6);
  for (let i = 0; i < S.n; i++) {
    const z0 = S.z[i];
    const a = spinT * 0.5 + twist * z0;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const x1 = S.x[i] * c - S.y[i] * s;
    const y1 = S.x[i] * s + S.y[i] * c;
    const y2 = y1 * ct - z0 * st;
    const z2 = y1 * st + z0 * ct;
    const d = (z2 + 1) / 2;
    const f = 1 + z2 * 0.1;
    S.sx[i] = cx + x1 * R * f;
    S.sy[i] = cy + y2 * R * f;
    const band = 0.5 + 0.5 * Math.cos(S.phi[i] + z0 * 2.2 - t * 1.1);
    const hi = Math.pow(band, 6) * (0.35 + 0.65 * d);
    const twinkle = 0.85 + 0.15 * Math.sin(t * 2.2 + S.jit[i] * 40);
    const b = clamp01((0.16 + 0.5 * d + 0.6 * hi) * twinkle);
    S.lv[i] = Math.min(LEVELS - 1, Math.floor(b * LEVELS));
    S.rad[i] = dot * (0.42 + 0.5 * d + 0.75 * hi);
    S.hot[i] = hi > 0.6 && d > 0.5 ? 1 : 0;
  }
}

function levelLook(L: Live, k: number) {
  const q = k / (LEVELS - 1);
  const [r, g, b] = mixRgb(L.base, L.accent, clamp01(L.accentAmount * (0.15 + 1.5 * q * q)));
  return { rgb: `${r},${g},${b}`, a: clamp01(0.12 + 0.88 * Math.pow(q, 1.2)) };
}

function simulateBands(t: number, mode: Mode, out: Float32Array) {
  const n = out.length;
  let base = 0.03;
  if (mode === "listening") {
    const x = 0.5 + 0.5 * Math.sin(t * 0.9 + 1.7 * Math.sin(t * 0.37));
    const gate = clamp01((x - 0.35) / 0.3);
    const syll = 0.55 + 0.45 * Math.sin(t * 7.3) * Math.sin(t * 2.1 + 0.6);
    base = 0.14 + 0.86 * gate * gate * (3 - 2 * gate) * syll;
  } else if (mode === "thinking" || mode === "working") {
    const surge = 0.5 + 0.5 * Math.sin(t * 0.8 + 1.7 * Math.sin(t * 0.37));
    const flutter = 0.6 + 0.4 * Math.sin(t * 3.1) * Math.sin(t * 1.3 + 0.6);
    base = (mode === "thinking" ? 0.75 : 0.55) * (0.3 + 0.7 * surge * flutter);
  }
  for (let i = 0; i < n; i++) {
    const f = i / (n - 1);
    const shape = 0.25 + 0.75 * Math.exp(-Math.pow((f - 0.28) / 0.3, 2));
    const v = 0.5 + 0.5 * Math.sin(t * (3.1 + i * 0.53) + i * 1.9) * Math.sin(t * (1.3 + i * 0.21) + i);
    out[i] = clamp01(base * shape * (0.35 + 0.65 * v) * 0.9);
  }
}

const SMOOTH_A = new Float32Array(BANDS);
const SMOOTH_B = new Float32Array(BANDS);

function smoothBands(src: Float32Array): Float32Array {
  const n = src.length;
  for (let i = 0; i < n; i++) SMOOTH_A[i] = 0.25 * src[Math.max(0, i - 1)] + 0.5 * src[i] + 0.25 * src[Math.min(n - 1, i + 1)];
  for (let i = 0; i < n; i++) SMOOTH_B[i] = 0.25 * SMOOTH_A[Math.max(0, i - 1)] + 0.5 * SMOOTH_A[i] + 0.25 * SMOOTH_A[Math.min(n - 1, i + 1)];
  return SMOOTH_B;
}

function curveRadius(
  l: number,
  theta: number,
  bands: Float32Array,
  level: number,
  phase: number,
  rot: number,
  amp: number,
  outer: number,
  inner: number,
) {
  const dir = l % 2 === 0 ? 1 : -1;
  const f = Math.abs(Math.sin((theta + rot * 0.3 * dir) / 2));
  const bf = f * (bands.length - 1);
  const i0 = Math.floor(bf);
  const i1 = Math.min(bands.length - 1, i0 + 1);
  const band = bands[i0] + (bands[i1] - bands[i0]) * (bf - i0);
  const energy = 0.04 + band * 0.96 + level * 0.18;
  const wave = 0.5 + 0.5 * Math.sin((3 + l) * theta + phase * (1.1 + l * 0.5) * dir + l * 1.9);
  const base = inner + 0.03 * l * outer;
  return Math.min(outer * 0.98, base + (outer * 0.98 - base) * 0.5 * energy * wave * amp);
}

function restRadius(orbR: number) {
  return orbR * 1.1 + 3;
}

function updateEnergy(L: Live, dt: number) {
  simulateBands(L.time, L.mode, L.target);
  const n = L.bands.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const tv = L.target[i];
    const cur = L.bands[i];
    L.bands[i] = cur + (tv - cur) * (tv > cur ? Math.min(1, dt * 22) : Math.min(1, dt * 6));
    sum += L.bands[i];
  }
  L.level += (clamp01((sum / n) * 2.4) - L.level) * Math.min(1, dt * 14);
  L.wave += dt * (1 + 1.6 * L.level);
  L.rot += dt * 0.45 * (1 + L.level);
  const spinTo = L.mode === "thinking" ? 1.1 : L.mode === "working" ? 0.9 : L.mode === "listening" ? 0.7 : 0.35;
  L.spin += (spinTo - L.spin) * Math.min(1, dt * 3);
  L.spinT += dt * L.spin;
  const curveTo = RUNNING.indexOf(L.mode) >= 0 ? 1 : 0;
  L.curveA += (curveTo - L.curveA) * Math.min(1, dt * 6);
  const want = sample3(L.mode === "listening" ? L.listen : L.mode === "done" ? L.done : L.think);
  for (let k = 0; k < 3; k++) L.pal[k] = mixRgb(L.pal[k], want[k], Math.min(1, dt * 4));
}

function drawLead(ctx: CanvasRenderingContext2D, w: number, h: number, L: Live, S: Orb) {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const R = L.orbR;
  const [ar, ag, ab] = L.accent;

  const halo = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 1.7);
  halo.addColorStop(0, `rgba(${ar},${ag},${ab},0.10)`);
  halo.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.7, 0, TAU);
  ctx.fill();

  if (L.curveA > 0.01) {
    const outer = (Math.min(w, h) / 2) * 0.98;
    const inner = Math.min(outer * 0.9, restRadius(R));
    const bands = smoothBands(L.bands);
    const [kr, kg, kb] = L.core;
    ctx.globalCompositeOperation = "lighter";
    ctx.lineJoin = "round";
    for (let l = 0; l < L.curves; l++) {
      ctx.beginPath();
      for (let i = 0; i <= CURVE_POINTS; i++) {
        const theta = (i / CURVE_POINTS) * TAU;
        const r = curveRadius(l, theta, bands, L.level, L.wave, L.rot, L.amp, outer, inner);
        const x = cx + Math.sin(theta) * r;
        const y = cy - Math.cos(theta) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      const a = Math.max(0.3, 0.95 - l * 0.22);
      let stroke: string | CanvasGradient = `rgba(${kr},${kg},${kb},${a.toFixed(2)})`;
      if (typeof ctx.createConicGradient === "function") {
        const g = ctx.createConicGradient(L.rot * 0.5 * (l % 2 === 0 ? 1 : -1) - Math.PI / 2, cx, cy);
        const stops: RGB[] = [L.core, L.pal[0], L.pal[1], L.pal[2], L.core];
        stops.forEach((c, k) => {
          const edge = k === 0 || k === stops.length - 1;
          g.addColorStop(k / (stops.length - 1), `rgba(${c[0]},${c[1]},${c[2]},${(edge ? a : a * 0.85).toFixed(2)})`);
        });
        stroke = g;
      }
      ctx.strokeStyle = stroke;
      ctx.globalAlpha = 0.25 * L.curveA;
      ctx.lineWidth = (3.4 - l * 0.5) * L.thick;
      ctx.stroke();
      ctx.globalAlpha = L.curveA;
      ctx.lineWidth = Math.max(0.8, (1.4 - l * 0.2) * L.thick);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  projectOrb(S, L.spinT, L.time, R, cx, cy, L.dot);
  for (let k = 0; k < LEVELS; k++) {
    const look = levelLook(L, k);
    ctx.fillStyle = `rgba(${look.rgb},${look.a.toFixed(3)})`;
    ctx.beginPath();
    for (let i = 0; i < S.n; i++) {
      if (S.lv[i] !== k) continue;
      const r = S.rad[i];
      ctx.moveTo(S.sx[i] + r, S.sy[i]);
      ctx.arc(S.sx[i], S.sy[i], r, 0, TAU);
    }
    ctx.fill();
  }
  ctx.fillStyle = `rgba(${ar},${ag},${ab},0.10)`;
  ctx.beginPath();
  for (let i = 0; i < S.n; i++) {
    if (!S.hot[i]) continue;
    const r = S.rad[i] * 2.6;
    ctx.moveTo(S.sx[i] + r, S.sy[i]);
    ctx.arc(S.sx[i], S.sy[i], r, 0, TAU);
  }
  ctx.fill();
}

function estimate(text: string, px: number) {
  return Math.ceil(text.length * px * 0.56);
}

function geometry(
  mode: Mode,
  sz: Sizes,
  pad: number,
  gap: number,
  minExpanded: number,
  rows: number,
  actions: boolean,
  hasView: boolean,
) {
  const head = LEAD + pad * 2;
  let action = 0;
  if (actions && RUNNING.indexOf(mode) >= 0) action = STOP;
  else if (actions && hasView && mode === "done") action = sz.view;
  let w = pad + LEAD + gap + sz.label[mode] + (action ? gap + action + pad : pad + 12);
  let h = head;
  if (mode === "working") {
    const inset = pad + (LEAD - ICON) / 2;
    w = Math.max(w, inset + ICON + 10 + sz.step + inset, minExpanded);
    h = head + LIST_TOP + rows * ROW + LIST_BOTTOM;
  }
  return { w: Math.ceil(w), h: Math.ceil(h), action };
}

function useFocusVisible() {
  const [focusVisible, setFocusVisible] = React.useState(false);
  return {
    focusVisible,
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      try {
        setFocusVisible(e.currentTarget.matches(":focus-visible"));
      } catch {
        setFocusVisible(true);
      }
    },
    onBlur: () => setFocusVisible(false),
  };
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => undefined;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (typeof mq.addEventListener !== "function") return () => undefined;
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

const StopIcon = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" style={{ display: "block" }}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width={13}
    height={13}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    style={{ display: "block" }}
  >
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

const CheckMark = ({ size, stroke }: { size: number; stroke: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    style={{ display: "block" }}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

type ActionProps = {
  label: string;
  onClick: () => void;
  on: boolean;
  style: React.CSSProperties;
  children: React.ReactNode;
  ariaLabel?: string;
};

function ActionButton({ label, onClick, on, style, children, ariaLabel }: ActionProps) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const focus = useFocusVisible();
  const release = () => setPressed(false);
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      aria-hidden={!on}
      tabIndex={on ? 0 : -1}
      disabled={!on}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      style={{
        ...style,
        position: "absolute",
        margin: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${HAIRLINE}`,
        cursor: on ? "pointer" : "default",
        outline: "none",
        pointerEvents: on ? "auto" : "none",
        opacity: on ? 1 : 0,
        transform: on ? (pressed ? "scale(0.92)" : "scale(1)") : "scale(0.7)",
        boxShadow: `${hover && on ? HOVER_ON : HOVER_OFF}, ${focus.focusVisible ? RING : NO_RING}`,
        transition: `opacity ${on ? "0.4s ease 0.2s" : "0.15s ease"}, transform ${on ? `0.4s ${EASE} 0.2s` : "0.15s ease"}, box-shadow 0.2s ease, background-color 0.25s ease`,
      }}
    >
      {children}
    </button>
  );
}

export function AIDynamicIsland01(props: AIDynamicIsland01Props) {
  const {
    status = "auto",
    interactive = true,
    loop = false,
    stageSeconds = 2.6,
    stepSeconds = 1.7,
    idleText = "Ask AI",
    listeningText = "Listening",
    thinkingText = "Thinking",
    workingText = "Working on it",
    doneText = "Ready",
    viewLabel = "View",
    steps = DEFAULT_STEPS,
    align = "top",
    expandedWidth = 300,
    orbSize = 0.62,
    particleSize = 1,
    curves = 3,
    curveWidth = 1,
    curveAmp = 1,
    curveColor = "#FFFFFF",
    dotColor = "#FFFFFF",
    accentColor = "#9DB8FF",
    accentAmount = 0.35,
    font = { fontSize: 15, lineHeight: 1.2 },
    textColor = "#EDEDED",
    mutedColor = "#6B6B6B",
    listenColors = DEFAULT_LISTEN,
    thinkColors = DEFAULT_THINK,
    doneColors = DEFAULT_DONE,
    ringIntensity = 0.6,
    ringSize = 10,
    ringSpeed = 40,
    background = "#0E0E10",
    borderColor = "rgba(255,255,255,0.09)",
    radius = 28,
    padding = 8,
    gap = 10,
    onStart,
    onStop,
    onView,
    onComplete,
    className,
    style,
  } = props;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const measRef = React.useRef<HTMLDivElement>(null);
  const measEls = React.useRef<Record<string, HTMLSpanElement | null>>({});
  const textEls = React.useRef<(HTMLSpanElement | null)[]>([]);
  const spinEls = React.useRef<(HTMLDivElement | null)[]>([]);
  const ringEls = React.useRef<(HTMLDivElement | null)[]>([]);
  const isVisibleRef = React.useRef(true);
  const runRef = React.useRef(false);
  const stageTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const stepDoneTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = React.useRef(0);
  const prevMode = React.useRef<Mode>(status === "auto" ? "idle" : status);

  const stepList = React.useMemo(() => cleanList(steps, DEFAULT_STEPS).slice(0, 6), [steps]);
  const n = stepList.length;
  const listenList = React.useMemo(() => cleanList(listenColors, DEFAULT_LISTEN), [listenColors]);
  const thinkList = React.useMemo(() => cleanList(thinkColors, DEFAULT_THINK), [thinkColors]);
  const doneList = React.useMemo(() => cleanList(doneColors, DEFAULT_DONE), [doneColors]);
  const listenGradient = React.useMemo(() => buildGradient(listenList, 0.55), [listenList]);
  const thinkGradient = React.useMemo(() => buildGradient(thinkList, 0.55), [thinkList]);
  const doneGradient = React.useMemo(() => buildGradient(doneList, 0.55), [doneList]);
  const listenRgb = React.useMemo(() => listenList.map((c) => parseRgb(c, [124, 243, 255])), [listenList]);
  const thinkRgb = React.useMemo(() => thinkList.map((c) => parseRgb(c, [155, 123, 255])), [thinkList]);
  const doneRgb = React.useMemo(() => doneList.map((c) => parseRgb(c, [124, 255, 196])), [doneList]);
  const coreRgb = React.useMemo(() => parseRgb(curveColor, [255, 255, 255]), [curveColor]);
  const baseRgb = React.useMemo(() => parseRgb(dotColor, [255, 255, 255]), [dotColor]);
  const accentRgb = React.useMemo(() => parseRgb(accentColor, [157, 184, 255]), [accentColor]);
  const orb = React.useMemo(() => makeOrb(POINTS), []);
  const curveCount = Math.max(1, Math.min(4, Math.round(curves)));
  const pad = Math.max(0, padding);
  const gapPx = Math.max(0, gap);
  const hasView = viewLabel.trim() !== "";

  const [flow, setFlow] = React.useState<Mode>(status === "auto" ? "idle" : status);
  const [run, setRun] = React.useState(status === "auto");
  const [stepIdx, setStepIdx] = React.useState(0);
  const [armed, setArmed] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const focus = useFocusVisible();
  const reduce = React.useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);

  const mode: Mode = flow;
  const shownStep = stepIdx;
  const morph = !reduce && armed;
  const running = RUNNING.indexOf(mode) >= 0;
  const idleAction = mode === "idle" && interactive;

  // Prop-driven resets, done during render rather than in an effect: no DOM
  // work is needed, just adjusting local state to match a changed input.
  const [prevStatus, setPrevStatus] = React.useState(status);
  if (prevStatus !== status) {
    setPrevStatus(status);
    setFlow(status === "auto" ? "idle" : status);
    setRun(status === "auto");
  }
  const stepResetKey = `${flow}|${n}|${stepSeconds}`;
  const [prevStepResetKey, setPrevStepResetKey] = React.useState(stepResetKey);
  if (prevStepResetKey !== stepResetKey) {
    setPrevStepResetKey(stepResetKey);
    setStepIdx(0);
  }
  const [prevIdleAction, setPrevIdleAction] = React.useState(idleAction);
  if (prevIdleAction !== idleAction) {
    setPrevIdleAction(idleAction);
    if (!idleAction) focus.onBlur();
  }

  const fontPx = React.useMemo(() => {
    const fs = font && (font as React.CSSProperties).fontSize;
    const v = typeof fs === "number" ? fs : parseFloat(String(fs));
    return Number.isFinite(v) && v > 0 ? v : 15;
  }, [font]);
  const texts: Record<Mode, string> = {
    idle: idleText,
    listening: listeningText,
    thinking: thinkingText,
    working: workingText,
    done: doneText,
  };
  const estSizes = (): Sizes => ({
    label: {
      idle: estimate(idleText, fontPx),
      listening: estimate(listeningText, fontPx),
      thinking: estimate(thinkingText, fontPx),
      working: estimate(workingText, fontPx),
      done: estimate(doneText, fontPx),
    },
    step: Math.max(0, ...stepList.map((s) => estimate(s, fontPx))),
    view: estimate(viewLabel, fontPx) + 16 + 13 + 6 + 16,
  });
  const [sizes, setSizes] = React.useState<Sizes>(estSizes);

  const liveRef = React.useRef<Live>({
    mode,
    time: STATIC_TIME,
    spinT: STATIC_TIME,
    spin: 0.35,
    wave: 0.6,
    rot: 0.8,
    level: 0.3,
    curveA: RUNNING.indexOf(mode) >= 0 ? 1 : 0,
    bands: new Float32Array(BANDS),
    target: new Float32Array(BANDS),
    pal: sample3(thinkRgb),
    angle: START_ANGLE,
    ringSpeed,
    orbR: (LEAD / 2) * orbSize,
    dot: particleSize,
    curves: curveCount,
    thick: curveWidth,
    amp: curveAmp,
    core: coreRgb,
    base: baseRgb,
    accent: accentRgb,
    accentAmount,
    listen: listenRgb,
    think: thinkRgb,
    done: doneRgb,
    still: false,
    drawnMode: null,
  });
  React.useLayoutEffect(() => {
    runRef.current = run;
    const live = liveRef.current;
    live.mode = mode;
    live.ringSpeed = ringSpeed;
    live.orbR = (LEAD / 2) * Math.max(0.3, Math.min(1, orbSize));
    live.dot = particleSize;
    live.curves = curveCount;
    live.thick = curveWidth;
    live.amp = curveAmp;
    live.core = coreRgb;
    live.base = baseRgb;
    live.accent = accentRgb;
    live.accentAmount = accentAmount;
    live.listen = listenRgb;
    live.think = thinkRgb;
    live.done = doneRgb;
    live.still = reduce;
  });

  React.useEffect(() => {
    if (!run) return;
    let next: Mode | null = null;
    if (flow === "idle") next = "listening";
    else if (flow === "listening") next = "thinking";
    else if (flow === "thinking") next = "working";
    else if (flow === "done") next = "idle";
    if (!next) return;
    const to = next;
    if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    stageTimerRef.current = setTimeout(
      () => {
        setFlow(to);
        if (flow === "done" && !(status === "auto" && loop)) setRun(false);
      },
      Math.max(0.6, stageSeconds) * 1000,
    );
    return () => {
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    };
  }, [run, flow, stageSeconds, status, loop]);

  React.useEffect(() => {
    if (flow !== "working") return;
    let i = 0;
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    if (stepDoneTimerRef.current) clearTimeout(stepDoneTimerRef.current);
    stepIntervalRef.current = setInterval(
      () => {
        if (!isVisibleRef.current || i >= n) return;
        i += 1;
        if (i >= n && !runRef.current) {
          if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
          return;
        }
        setStepIdx(i);
        if (i >= n) {
          if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
          stepDoneTimerRef.current = setTimeout(() => setFlow("done"), 700);
        }
      },
      Math.max(0.4, stepSeconds) * 1000,
    );
    return () => {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      if (stepDoneTimerRef.current) clearTimeout(stepDoneTimerRef.current);
    };
  }, [flow, n, stepSeconds]);

  React.useEffect(() => {
    const prev = prevMode.current;
    prevMode.current = mode;
    if (prev === "idle" && RUNNING.indexOf(mode) >= 0) onStart?.();
    else if (RUNNING.indexOf(prev) >= 0 && mode === "idle") onStop?.();
    if (mode === "done" && prev !== "done") onComplete?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const measureKey = `${idleText}|${listeningText}|${thinkingText}|${workingText}|${doneText}|${viewLabel}|${stepList.join("|")}|${JSON.stringify(font)}`;
  React.useEffect(() => {
    const el = measRef.current;
    if (!el) return;
    const w = (k: string) => {
      const node = measEls.current[k];
      return node ? node.offsetWidth + 1 : 0;
    };
    const measure = () => {
      const next: Sizes = {
        label: {
          idle: w("idle"),
          listening: w("listening"),
          thinking: w("thinking"),
          working: w("working"),
          done: w("done"),
        },
        step: Math.max(0, ...stepList.map((_, i) => w(`step${i}`))),
        view: w("view") + 16 + 13 + 6 + 16,
      };
      setSizes((prev) => {
        const same = prev.step === next.step && prev.view === next.view && MODES.every((m) => prev.label[m] === next.label[m]);
        return same ? prev : next;
      });
    };
    measure();
    const arm = requestAnimationFrame(() => setArmed(true));
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver === "function") {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    return () => {
      cancelAnimationFrame(arm);
      if (ro) ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measureKey]);

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;
    if (!root) return;

    let last = performance.now();
    let w = 0;
    let h = 0;

    const fit = () => {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = CANVAS;
      h = CANVAS;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      if (!ctx) return;
      drawLead(ctx, w, h, liveRef.current, orb);
    };
    const updateDom = (L: Live) => {
      const t = L.time;
      const pos = (100 - 100 * ((t / 2.4) % 1)).toFixed(2);
      for (const node of textEls.current) if (node) node.style.backgroundPosition = `${pos}% 50%`;
      const pulse = (0.55 + 0.3 * Math.sin(t * 2.2)).toFixed(3);
      for (const node of ringEls.current) if (node) node.style.opacity = pulse;
      const deg = `rotate(${((t * 300) % 360).toFixed(1)}deg)`;
      for (const node of spinEls.current) if (node) node.style.transform = deg;
    };

    fit();
    if (reduce) root.style.setProperty("--gl-angle", `${START_ANGLE}deg`);

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (isVisibleRef.current) {
        const L = liveRef.current;
        if (L.still) {
          if (L.drawnMode !== L.mode) {
            simulateBands(STATIC_TIME, L.mode, L.target);
            L.bands.set(L.target);
            L.curveA = RUNNING.indexOf(L.mode) >= 0 ? 1 : 0;
            const want = sample3(L.mode === "listening" ? L.listen : L.mode === "done" ? L.done : L.think);
            for (let k = 0; k < 3; k++) L.pal[k] = want[k];
            L.time = STATIC_TIME;
            L.spinT = STATIC_TIME;
            draw();
            updateDom(L);
            L.drawnMode = L.mode;
          }
        } else {
          L.time += dt;
          L.angle = (L.angle + L.ringSpeed * dt) % 360;
          updateEnergy(L, dt);
          root.style.setProperty("--gl-angle", `${L.angle.toFixed(2)}deg`);
          draw();
          updateDom(L);
          L.drawnMode = L.mode;
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rafRef.current);
  }, [reduce, orb]);

  const handleStart = () => {
    if (!interactive) return;
    setRun(true);
    setFlow("listening");
  };
  const handleStop = () => {
    if (!interactive) return;
    setRun(false);
    setFlow("idle");
  };
  const handleView = () => {
    if (!interactive) return;
    onView?.();
    setFlow("idle");
  };
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && running && interactive) {
      e.preventDefault();
      handleStop();
    }
  };

  const typography: React.CSSProperties = {
    fontFamily: FONT_FALLBACK,
    fontWeight: 500,
    lineHeight: 1.2,
    ...font,
    margin: 0,
  };
  const geo = geometry(mode, sizes, pad, gapPx, expandedWidth, n, interactive, hasView);
  const shimmerGradient = `linear-gradient(90deg, ${mutedColor} 0%, ${mutedColor} 32%, ${textColor} 50%, ${mutedColor} 68%, ${mutedColor} 100%)`;
  const softRing = Math.max(2, Math.min(12, ringSize * 0.45));
  const softBlur = ringSize * 0.7;
  const doneAccent = doneList[0];
  const currentStepLabel = stepList[Math.min(shownStep, n - 1)] || "";
  const statusCopy =
    mode === "working"
      ? `AI assistant status: working. ${workingText}. Current step: ${currentStepLabel}.`
      : `AI assistant status: ${mode}. ${texts[mode]}.`;

  const shimmerStyle: React.CSSProperties = {
    ...typography,
    display: "block",
    whiteSpace: "nowrap",
    color: "transparent",
    backgroundImage: shimmerGradient,
    backgroundSize: "300% 100%",
    backgroundPosition: `${STATIC_SHIMMER}% 50%`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
  const plainStyle: React.CSSProperties = {
    ...typography,
    display: "block",
    whiteSpace: "nowrap",
    color: textColor,
  };

  const ringLayer = (idx: number, active: boolean, gradient: string, intensity: number) => (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        pointerEvents: "none",
        opacity: active ? intensity : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      <div
        ref={(el) => {
          ringEls.current[idx] = el;
        }}
        style={{ position: "absolute", inset: 0, borderRadius: "inherit", opacity: 0.6 }}
      >
        <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", filter: `blur(${softBlur}px)` }}>
          <div style={{ ...ringStyle(softRing), background: gradient }} />
        </div>
        <div style={{ ...ringStyle(1.2), background: gradient }} />
      </div>
    </div>
  );

  const labelNode = (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        flex: 1,
        minWidth: 0,
        height: LEAD,
        overflow: "hidden",
        marginRight: geo.action ? gapPx + geo.action : 0,
        transition: morph ? `margin-right ${MORPH}` : "none",
      }}
    >
      {MODES.map((m, i) => {
        const on = m === mode;
        const shimmer = m === "listening" || m === "thinking" || m === "working";
        return (
          <div
            key={m}
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              opacity: on ? 1 : 0,
              transform: `translateY(calc(-50% + ${on ? 0 : 6}px))`,
              transition: on
                ? `opacity 0.4s ease 0.18s, transform 0.4s ${EASE} 0.18s`
                : "opacity 0.16s ease, transform 0.16s ease",
            }}
          >
            <span
              ref={(el) => {
                textEls.current[i] = shimmer ? el : null;
              }}
              style={shimmer ? shimmerStyle : plainStyle}
            >
              {texts[m]}
            </span>
          </div>
        );
      })}
    </div>
  );

  const leadNode = (
    <div style={{ position: "relative", flex: "none", width: LEAD, height: LEAD }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: (LEAD - CANVAS) / 2,
          top: (LEAD - CANVAS) / 2,
          width: CANVAS,
          height: CANVAS,
          opacity: mode === "done" ? 0 : 1,
          transform: mode === "done" ? "scale(0.6)" : "scale(1)",
          transition: `opacity 0.3s ease, transform 0.4s ${EASE}`,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: CANVAS, height: CANVAS, display: "block" }}
          aria-hidden="true"
        />
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 4,
          top: 4,
          width: LEAD - 8,
          height: LEAD - 8,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: doneAccent,
          background: "rgba(255,255,255,0.07)",
          border: `1px solid ${HAIRLINE}`,
          boxShadow: `0 0 14px rgba(${parseRgb(doneAccent, [124, 255, 196]).join(",")},0.28)`,
          opacity: mode === "done" ? 1 : 0,
          transform: mode === "done" ? "scale(1)" : "scale(0.5)",
          transition: `opacity 0.3s ease 0.15s, transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1) 0.15s`,
        }}
      >
        <CheckMark size={18} stroke={2.6} />
      </div>
    </div>
  );

  const stepsNode = (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: LEAD + pad * 2 + LIST_TOP,
        pointerEvents: "none",
      }}
    >
      {stepList.map((text, i) => {
        const on = mode === "working";
        const state = i < shownStep ? "done" : i === shownStep ? "active" : "pending";
        const inset = pad + (LEAD - ICON) / 2;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              height: ROW,
              padding: `0 ${inset}px`,
              boxSizing: "border-box",
              opacity: on ? 1 : 0,
              transform: on ? "translateY(0px)" : "translateY(-8px)",
              transition: on
                ? `opacity 0.4s ease ${(0.22 + i * 0.06).toFixed(2)}s, transform 0.45s ${EASE} ${(0.22 + i * 0.06).toFixed(2)}s`
                : "opacity 0.14s ease, transform 0.14s ease",
            }}
          >
            <div style={{ position: "relative", flex: "none", width: ICON, height: ICON }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: textColor,
                  background: "rgba(255,255,255,0.10)",
                  opacity: state === "done" ? 1 : 0,
                  transform: state === "done" ? "scale(1)" : "scale(0.5)",
                  transition: "opacity 0.25s ease, transform 0.4s cubic-bezier(0.3, 1.4, 0.5, 1)",
                }}
              >
                <CheckMark size={11} stroke={3} />
              </div>

              <div
                ref={(el) => {
                  spinEls.current[i] = el;
                }}
                style={{ position: "absolute", inset: 0, opacity: state === "active" ? 1 : 0, transition: "opacity 0.2s ease" }}
              >
                <svg width={ICON} height={ICON} viewBox="0 0 18 18" aria-hidden="true" focusable="false" style={{ display: "block" }}>
                  <circle cx="9" cy="9" r="7" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.6" />
                  <path d="M9 2a7 7 0 0 1 7 7" fill="none" stroke={textColor} strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: ICON / 2 - 3,
                  top: ICON / 2 - 3,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: mutedColor,
                  opacity: state === "pending" ? 0.55 : 0,
                  transition: "opacity 0.25s ease",
                }}
              />
            </div>
            <span
              ref={(el) => {
                textEls.current[MODES.length + i] = state === "active" ? el : null;
              }}
              style={{
                ...(state === "active" ? shimmerStyle : plainStyle),
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: state === "active" ? "transparent" : mutedColor,
                opacity: state === "pending" ? 0.6 : 1,
                transition: "opacity 0.3s ease",
              }}
            >
              {text}
            </span>
          </div>
        );
      })}
    </div>
  );

  const alignItems = align === "top" ? "flex-start" : align === "bottom" ? "flex-end" : "center";

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="AI assistant dynamic island status"
      onKeyDown={onKey}
      className={cn("relative box-border h-full w-full", className)}
      style={{ ...style, display: "flex", justifyContent: "center", alignItems }}
    >
      <p role="status" aria-live="polite" aria-atomic="true" style={SR_ONLY}>
        {statusCopy}
      </p>

      <div
        ref={measRef}
        aria-hidden="true"
        style={{ position: "absolute", left: 0, top: 0, height: 0, overflow: "hidden", visibility: "hidden", pointerEvents: "none" }}
      >
        {MODES.map((m) => (
          <span
            key={m}
            ref={(el) => {
              measEls.current[m] = el;
            }}
            style={{ ...typography, display: "block", width: "max-content", whiteSpace: "nowrap" }}
          >
            {texts[m]}
          </span>
        ))}
        <span
          ref={(el) => {
            measEls.current.view = el;
          }}
          style={{ ...typography, display: "block", width: "max-content", whiteSpace: "nowrap" }}
        >
          {viewLabel}
        </span>
        {stepList.map((text, i) => (
          <span
            key={i}
            ref={(el) => {
              measEls.current[`step${i}`] = el;
            }}
            style={{ ...typography, display: "block", width: "max-content", whiteSpace: "nowrap" }}
          >
            {text}
          </span>
        ))}
      </div>

      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          setPressed(false);
        }}
        style={{
          position: "relative",
          flex: "none",
          boxSizing: "border-box",
          width: geo.w,
          maxWidth: "100%",
          height: geo.h,
          overflow: "hidden",
          borderRadius: radius,
          background,
          backgroundImage: SHEEN,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          transform: idleAction && pressed ? "scale(0.97)" : idleAction && hover ? "scale(1.03)" : "scale(1)",
          boxShadow: [
            idleAction && hover ? HOVER_ON : HOVER_OFF,
            `inset 0 0 0 1px ${borderColor}`,
            "inset 0 1px 0 rgba(255,255,255,0.12)",
            focus.focusVisible ? RING : NO_RING,
          ].join(", "),
          transition: morph
            ? `width ${MORPH}, height ${MORPH}, transform 0.25s ${EASE}, box-shadow 0.25s ease`
            : `transform 0.25s ${EASE}, box-shadow 0.25s ease`,
        }}
      >
        {ringLayer(0, mode === "listening", listenGradient, ringIntensity)}
        {ringLayer(1, mode === "thinking" || mode === "working", thinkGradient, ringIntensity)}
        {ringLayer(2, mode === "done", doneGradient, ringIntensity * 0.55)}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: LEAD + pad * 2,
            display: "flex",
            alignItems: "center",
            padding: `0 0 0 ${pad}px`,
            gap: gapPx,
            boxSizing: "border-box",
          }}
        >
          {leadNode}
          {labelNode}
          {interactive && (
            <>
              <ActionButton
                label="Stop"
                ariaLabel="Stop AI assistant"
                on={running}
                onClick={handleStop}
                style={{
                  right: pad,
                  top: pad,
                  width: STOP,
                  height: STOP,
                  padding: 0,
                  borderRadius: "50%",
                  background: textColor,
                  color: "#0E0E10",
                }}
              >
                <StopIcon />
              </ActionButton>
              {hasView && (
                <ActionButton
                  label={viewLabel}
                  ariaLabel={`${viewLabel} AI result`}
                  on={mode === "done"}
                  onClick={handleView}
                  style={{
                    right: pad,
                    top: pad + (STOP - 36) / 2,
                    height: 36,
                    padding: "0 16px",
                    gap: 6,
                    borderRadius: 999,
                    background: textColor,
                    color: "#0E0E10",
                    ...typography,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {viewLabel}
                  <ArrowIcon />
                </ActionButton>
              )}
            </>
          )}
        </div>

        {stepsNode}

        {idleAction && (
          <button
            type="button"
            aria-label={idleText}
            onClick={handleStart}
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => setPressed(false)}
            onPointerCancel={() => setPressed(false)}
            onFocus={focus.onFocus}
            onBlur={focus.onBlur}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              margin: 0,
              padding: 0,
              border: "none",
              borderRadius: "inherit",
              background: "transparent",
              cursor: "pointer",
              outline: "none",
            }}
          />
        )}
      </div>
    </div>
  );
}
