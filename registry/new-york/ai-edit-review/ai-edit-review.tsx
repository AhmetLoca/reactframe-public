"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RGB = [number, number, number];
type Flow = "idle" | "working" | "review" | "applied";
type Status = "auto" | Flow;
type EditAction = { label: string; result: string };
type Op = { kind: "eq" | "del" | "ins"; text: string };

export interface AIEditReviewProps {
  status?: Status;
  interactive?: boolean;
  loop?: boolean;
  holdSeconds?: number;
  workSeconds?: number;
  reviewSeconds?: number;
  before?: string;
  selected?: string;
  after?: string;
  actions?: EditAction[];
  workingText?: string;
  reviewText?: string;
  appliedText?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  description?: string;
  font?: React.CSSProperties;
  textColor?: string;
  mutedColor?: string;
  selectionColor?: string;
  addColor?: string;
  removeColor?: string;
  workColors?: string[];
  reviewColors?: string[];
  doneColors?: string[];
  orbColor?: string;
  particles?: number;
  orbAura?: number;
  ringIntensity?: number;
  ringSize?: number;
  ringSpeed?: number;
  background?: string;
  borderColor?: string;
  radius?: number;
  padding?: number;
  gap?: number;
  onStart?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const TAU = Math.PI * 2;
const BANDS = 32;
const LEAD = 36;
const DOCK_PAD = 8;
const DOCK_H = LEAD + DOCK_PAD * 2;
const DOCK_GAP = 8;
const ORB_SIDE = 150;
const ORB_RATIO = 0.6;
const AURA_GAIN = 0.3;
const WORD_MS = 60;
const MAX_WORDS = 400;
const START_ANGLE = 40;
const STATIC_SHIMMER = 72;
const FLOWS: Flow[] = ["idle", "working", "review", "applied"];
const MORPH = "0.55s cubic-bezier(0.3, 1.2, 0.4, 1)";
const FONT_FALLBACK = "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const HAIRLINE = "rgba(255,255,255,0.14)";
const HOVER_ON = "inset 0 0 0 999px rgba(255,255,255,0.07)";
const HOVER_OFF = "inset 0 0 0 999px rgba(255,255,255,0)";
const RING = "0 0 0 2px rgba(255,255,255,0.35)";
const NO_RING = "0 0 0 0 rgba(255,255,255,0)";
const SHEEN =
  "linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0) 48%, rgba(255,255,255,0.04) 74%, rgba(255,255,255,0) 100%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0) 60%)";

const DEFAULT_BEFORE = "Every team has a story hidden in its numbers. ";
const DEFAULT_SELECTED =
  "We made a new dashboard that is really fast and shows you all of the things you need to know about how your team is doing right now.";
const DEFAULT_AFTER = " Share any view with one click.";
const DEFAULT_ACTIONS: EditAction[] = [
  {
    label: "Improve",
    result: "Our new dashboard is built for speed and shows you exactly how your team is doing, right now.",
  },
  {
    label: "Shorten",
    result: "A fast dashboard that shows how your team is doing.",
  },
  {
    label: "Translate",
    result: "Yeni panelimiz hızlıdır ve ekibinizin şu anki durumunu bir bakışta gösterir.",
  },
];
const DEFAULT_WORK = ["#FF7BD5", "#FFB86B", "#F5C84C"];
const DEFAULT_REVIEW = ["#7CF3FF", "#6EA8FF", "#9B7BFF"];
const DEFAULT_DONE = ["#7CFFC4", "#7CF3FF", "#F5F6F8"];
const DEFAULT_DESCRIPTION =
  "AI text editor that rewrites a selected passage, shows a word-level review, and lets you accept or reject the change.";

const SR_ONLY: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

type Sizes = Record<Flow, number>;

type Live = {
  flow: Flow;
  level: number;
  bands: Float32Array;
  target: Float32Array;
  time: number;
  phase: number;
  rot: number;
  angle: number;
  ringSpeed: number;
  aura: number;
  base: RGB;
  accent: RGB;
  accents: Record<Flow, RGB>;
  vis: VisParams;
  still: boolean;
  drawnFlow: Flow | null;
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
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

function rgba(c: RGB, a: number) {
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

function cleanList(list: string[] | undefined, fallback: string[]) {
  const out = (list ?? []).filter((s): s is string => typeof s === "string" && s.trim() !== "");
  return out.length ? out : fallback;
}

function cleanActions(list: EditAction[] | undefined): EditAction[] {
  const out = (list ?? []).filter(
    (a): a is EditAction => !!a && typeof a.label === "string" && a.label.trim() !== "" && typeof a.result === "string",
  );
  return out.length ? out.slice(0, 5) : DEFAULT_ACTIONS;
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

function diffWords(a: string, b: string): Op[] {
  const A = a.split(/\s+/).filter(Boolean);
  const B = b.split(/\s+/).filter(Boolean);
  if (A.length > MAX_WORDS || B.length > MAX_WORDS)
    return [...A.map((t) => ({ kind: "del" as const, text: t })), ...B.map((t) => ({ kind: "ins" as const, text: t }))];
  const n = A.length;
  const m = B.length;
  const dp: Uint16Array[] = [];
  for (let i = 0; i <= n; i++) dp.push(new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) {
      out.push({ kind: "eq", text: A[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ kind: "del", text: A[i++] });
    } else {
      out.push({ kind: "ins", text: B[j++] });
    }
  }
  while (i < n) out.push({ kind: "del", text: A[i++] });
  while (j < m) out.push({ kind: "ins", text: B[j++] });
  return out;
}

type Sim = "idle" | "listening" | "thinking" | "speaking";

function simulateBands(t: number, sim: Sim, out: Float32Array) {
  const n = out.length;
  let base = 0;
  if (sim === "idle") {
    base = 0.02 + 0.015 * Math.sin(t * 1.3);
  } else if (sim === "listening") {
    const x = 0.5 + 0.5 * Math.sin(t * 0.9 + 1.7 * Math.sin(t * 0.37));
    const gate = clamp01((x - 0.35) / 0.3);
    const syll = 0.55 + 0.45 * Math.sin(t * 7.3) * Math.sin(t * 2.1 + 0.6);
    base = gate * gate * (3 - 2 * gate) * syll;
  } else if (sim === "thinking") {
    base = 0.16 + 0.08 * Math.sin(t * 1.2) + 0.05 * Math.sin(t * 2.9 + 1);
  } else {
    const syll = 0.6 + 0.4 * Math.sin(t * 5.2) * Math.sin(t * 1.6);
    base = (0.85 + 0.15 * Math.sin(t * 1.1)) * syll;
  }
  for (let i = 0; i < n; i++) {
    const f = i / (n - 1);
    const shape = 0.25 + 0.75 * Math.exp(-Math.pow((f - 0.28) / 0.3, 2));
    const v = 0.5 + 0.5 * Math.sin(t * (3.1 + i * 0.53) + i * 1.9) * Math.sin(t * (1.3 + i * 0.21) + i);
    out[i] = clamp01(base * shape * (0.35 + 0.65 * v) * 0.9);
  }
}

function simOf(flow: Flow): Sim {
  return flow === "working" ? "speaking" : flow === "review" ? "thinking" : "idle";
}

function updateAudio(L: Live, dt: number) {
  const n = L.bands.length;
  simulateBands(L.time, simOf(L.flow), L.target);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const tv = L.target[i];
    const cur = L.bands[i];
    const k = tv > cur ? Math.min(1, dt * 22) : Math.min(1, dt * 6);
    L.bands[i] = cur + (tv - cur) * k;
    sum += L.bands[i];
  }
  const lv = clamp01((sum / n) * 2.4);
  L.level += (lv - L.level) * Math.min(1, dt * 14);
  L.phase += dt * (1 + 1.6 * L.level);
  L.rot += dt * 0.45 * (1 + L.level);
  L.accent = mixRgb(L.accent, L.accents[L.flow], Math.min(1, dt * 5));
}

type Particle = { x: number; y: number; z: number; size: number; phase: number };
type VisParams = { pts: Particle[]; rgb: RGB };

const STRIDE = 5;
const MAX_PARTICLES = 1000;
const TILT = 0.3;
const ORB_OUT = new Float32Array(MAX_PARTICLES * STRIDE);
const LX = -0.34;
const LY = -0.58;
const LZ = 0.74;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildParticles(count: number): Particle[] {
  const n = Math.max(40, Math.min(MAX_PARTICLES, Math.round(count)));
  const rnd = rng(97);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const out: Particle[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (2 * (i + 0.5)) / n;
    const rr = Math.sqrt(Math.max(0, 1 - y * y));
    const a = i * golden;
    out.push({
      x: rr * Math.cos(a),
      y,
      z: rr * Math.sin(a),
      size: rnd(),
      phase: rnd(),
    });
  }
  return out;
}

function layoutParticles(pts: Particle[], t: number, rot: number, level: number, out: Float32Array) {
  const yaw = rot * 0.6;
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const ct = Math.cos(TILT);
  const st = Math.sin(TILT);
  const amp = 0.4 + 1.0 * level;
  const base = 0.72 + 0.12 * level;
  const dotScale = Math.min(1.1, Math.sqrt(430 / Math.max(1, pts.length)));
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const a1 = 1.8 * p.x + 1.4 * p.y + t * 1.0;
    const a2 = 2.5 * p.y - 1.8 * p.z - t * 1.3;
    const a3 = 3.2 * p.z + 1.2 * p.x + t * 1.7;
    const wr = 1 + amp * (0.11 * Math.sin(a1) + 0.08 * Math.sin(a2) + 0.06 * Math.sin(a3));
    const c1 = amp * 0.11 * Math.cos(a1);
    const c2 = amp * 0.08 * Math.cos(a2);
    const c3 = amp * 0.06 * Math.cos(a3);
    const gx = 1.8 * c1 + 1.2 * c3;
    const gy = 1.4 * c1 + 2.5 * c2;
    const gz = -1.8 * c2 + 3.2 * c3;
    const gd = gx * p.x + gy * p.y + gz * p.z;
    const bnx = p.x - (gx - gd * p.x) / wr;
    const bny = p.y - (gy - gd * p.y) / wr;
    const bnz = p.z - (gz - gd * p.z) / wr;
    const bnl = Math.hypot(bnx, bny, bnz) || 1;
    const grow = wr * base;
    const lx = p.x * grow;
    const ly = p.y * grow;
    const lz = p.z * grow;
    const x = lx * cy + lz * sy;
    let z = -lx * sy + lz * cy;
    let y = ly;
    const nx = (bnx / bnl) * cy + (bnz / bnl) * sy;
    let nz = -(bnx / bnl) * sy + (bnz / bnl) * cy;
    let ny = bny / bnl;
    let a = y * ct - z * st;
    z = y * st + z * ct;
    y = a;
    a = ny * ct - nz * st;
    nz = ny * st + nz * ct;
    ny = a;

    const persp = 1 / (1 - z * 0.28);
    const d = clamp01((z + 1) / 2);
    const mod = clamp01(0.5 + (wr - 1) / (amp * 0.5));
    const size = 0.35 + 0.65 * mod;
    const lam = Math.max(0, nx * LX + ny * LY + nz * LZ);
    const light = 0.22 + 0.78 * Math.pow(lam, 0.9);
    const rim = nz > 0 ? Math.pow(1 - nz, 3) : 0;
    const tw = 0.9 + 0.1 * Math.sin(t * (1 + p.size * 2) + p.phase * 40);
    const o = i * STRIDE;
    out[o] = x * persp;
    out[o + 1] = y * persp;
    out[o + 2] = (0.95 + 0.25 * p.size) * (0.4 + 0.6 * size) * (0.55 + 0.6 * d) * dotScale * (1 + 0.35 * level);
    out[o + 3] = Math.min(1, light * (0.3 + 0.7 * Math.pow(d, 1.1)) * (0.45 + 0.55 * size) * tw * 1.15 + rim * 0.28 * (0.4 + 0.6 * d));
    out[o + 4] = Math.min(1, rim * 0.9 + level * 0.55);
  }
}

function visDraw(ctx: CanvasRenderingContext2D, w: number, h: number, L: Live) {
  const side = Math.min(w, h);
  const pts = L.vis.pts;
  layoutParticles(pts, L.phase, L.rot, L.level, ORB_OUT);
  const cx = w / 2;
  const cy = h / 2;
  const R = side * 0.38;
  const k = side / 64;
  for (let i = 0; i < pts.length; i++) {
    const o = i * STRIDE;
    const a = ORB_OUT[o + 3];
    const r = ORB_OUT[o + 2] * k;
    if (a < 0.02 || r < 0.15) continue;
    const [cr, cg, cb] = mixRgb(L.vis.rgb, L.accent, ORB_OUT[o + 4] * 0.7);
    ctx.fillStyle = `rgba(${cr},${cg},${cb},${a.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(cx + ORB_OUT[o] * R, cy + ORB_OUT[o + 1] * R, r, 0, TAU);
    ctx.fill();
  }
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

function Icon({ size = 16, children }: { size?: number; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {children}
    </svg>
  );
}

const CheckIcon = () => (
  <Icon size={15}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);
const CloseIcon = () => (
  <Icon size={14}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Icon>
);
const StopIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: "block" }}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
  </svg>
);

type DockButtonProps = {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  live: boolean;
  variant: "ghost" | "soft" | "primary" | "round";
  textStyle: React.CSSProperties;
  textColor: string;
  primary?: boolean;
  icon?: React.ReactNode;
  ariaLabel?: string;
  children?: React.ReactNode;
};

function DockButton({ label, onClick, live, variant, textStyle, textColor, primary, icon, ariaLabel }: DockButtonProps) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const focus = useFocusVisible();
  const release = () => setPressed(false);
  const round = variant === "round";
  const bg = variant === "primary" || round ? textColor : variant === "soft" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.045)";
  const fg = variant === "primary" || round ? "#0E0E10" : textColor;
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? (round ? label : undefined)}
      data-primary={primary ? "true" : undefined}
      disabled={!live}
      tabIndex={live ? 0 : -1}
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
        ...textStyle,
        flex: "none",
        height: LEAD,
        width: round ? LEAD : undefined,
        margin: 0,
        padding: round ? 0 : icon ? "0 16px 0 12px" : "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        borderRadius: 999,
        border: `1px solid ${HAIRLINE}`,
        background: bg,
        color: fg,
        fontWeight: variant === "primary" ? 600 : 500,
        whiteSpace: "nowrap",
        cursor: live ? "pointer" : "default",
        outline: "none",
        transform: pressed && live ? "scale(0.95)" : "scale(1)",
        boxShadow: `${hover && live ? HOVER_ON : HOVER_OFF}, ${focus.focusVisible ? RING : NO_RING}`,
        transition: "background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
      }}
    >
      {icon}
      {!round && label}
    </button>
  );
}

function estimate(text: string, px: number) {
  return Math.ceil(text.length * px * 0.56);
}

type DockActionProps = {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  live: boolean;
  variant: DockButtonProps["variant"];
  textStyle: React.CSSProperties;
  textColor: string;
  extra?: Partial<DockButtonProps>;
};

function DockAction({ label, onClick, live, variant, textStyle, textColor, extra }: DockActionProps) {
  return <DockButton label={label} onClick={onClick} live={live} variant={variant} textStyle={textStyle} textColor={textColor} {...extra} />;
}

export function AIEditReview(props: AIEditReviewProps) {
  const {
    status = "auto",
    interactive = true,
    loop = true,
    holdSeconds = 2.2,
    workSeconds = 2,
    reviewSeconds = 2.6,
    before = DEFAULT_BEFORE,
    selected = DEFAULT_SELECTED,
    after = DEFAULT_AFTER,
    actions = DEFAULT_ACTIONS,
    workingText = "Rewriting",
    reviewText = "Review",
    appliedText = "Applied",
    acceptLabel = "Accept",
    rejectLabel = "Reject",
    description = DEFAULT_DESCRIPTION,
    font = { fontSize: 17, lineHeight: 1.6 },
    textColor = "#EDEDED",
    mutedColor = "#6B6B6B",
    selectionColor = "#9B7BFF",
    addColor = "#7CFFC4",
    removeColor = "#FF7B8A",
    workColors = DEFAULT_WORK,
    reviewColors = DEFAULT_REVIEW,
    doneColors = DEFAULT_DONE,
    orbColor = "#FFFFFF",
    particles = 520,
    orbAura = 0.5,
    ringIntensity = 0.7,
    ringSize = 10,
    ringSpeed = 40,
    background = "#0E0E10",
    borderColor = "rgba(255,255,255,0.09)",
    radius = 28,
    padding = 28,
    gap = 22,
    onStart,
    onAccept,
    onReject,
    className,
    style,
  } = props;

  const rootRef = React.useRef<HTMLElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const haloRef = React.useRef<HTMLDivElement>(null);
  const groupEls = React.useRef<Record<string, HTMLDivElement | null>>({});
  const delEls = React.useRef<(HTMLSpanElement | null)[]>([]);
  const textEls = React.useRef<(HTMLSpanElement | null)[]>([]);
  const ringEls = React.useRef<(HTMLDivElement | null)[]>([]);
  const isVisibleRef = React.useRef(true);
  const prevFlow = React.useRef<Flow>("idle");
  const kbdRef = React.useRef(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = React.useRef(0);

  const reduce = React.useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);

  const actionList = React.useMemo(() => cleanActions(actions), [actions]);
  const workList = React.useMemo(() => cleanList(workColors, DEFAULT_WORK), [workColors]);
  const reviewList = React.useMemo(() => cleanList(reviewColors, DEFAULT_REVIEW), [reviewColors]);
  const doneList = React.useMemo(() => cleanList(doneColors, DEFAULT_DONE), [doneColors]);
  const workGradient = React.useMemo(() => buildGradient(workList, 0.55), [workList]);
  const reviewGradient = React.useMemo(() => buildGradient(reviewList, 0.55), [reviewList]);
  const doneGradient = React.useMemo(() => buildGradient(doneList, 0.55), [doneList]);
  const workRgb = React.useMemo(() => parseRgb(workList[0], [255, 123, 213]), [workList]);
  const reviewRgb = React.useMemo(() => parseRgb(reviewList[0], [124, 243, 255]), [reviewList]);
  const doneRgb = React.useMemo(() => parseRgb(doneList[0], [124, 255, 196]), [doneList]);
  const selRgb = React.useMemo(() => parseRgb(selectionColor, [155, 123, 255]), [selectionColor]);
  const addRgb = React.useMemo(() => parseRgb(addColor, [124, 255, 196]), [addColor]);
  const delRgb = React.useMemo(() => parseRgb(removeColor, [255, 123, 138]), [removeColor]);
  const pts = React.useMemo(() => buildParticles(particles), [particles]);
  const visBase = React.useMemo(() => parseRgb(orbColor, [255, 255, 255]), [orbColor]);
  const visParams = React.useMemo<VisParams>(() => ({ pts, rgb: visBase }), [pts, visBase]);
  const accents: Record<Flow, RGB> = {
    idle: reviewRgb,
    working: workRgb,
    review: reviewRgb,
    applied: doneRgb,
  };

  const [flow, setFlow] = React.useState<Flow>(status === "auto" ? "idle" : status);
  const [run, setRun] = React.useState(status === "auto");
  const [manual, setManual] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [streamed, setStreamed] = React.useState(0);
  const [delW, setDelW] = React.useState<number[]>([]);

  const [prevStatus, setPrevStatus] = React.useState(status);
  if (prevStatus !== status) {
    setPrevStatus(status);
    setFlow(status === "auto" ? "idle" : status);
    setRun(status === "auto");
    setManual(false);
    setActive(0);
  }

  const shownFlow: Flow = flow;
  const current = actionList[Math.min(active, actionList.length - 1)];
  const ops = React.useMemo(() => diffWords(selected, current.result), [selected, current.result]);
  const insCount = ops.filter((o) => o.kind === "ins").length;
  const delCount = ops.filter((o) => o.kind === "del").length;
  const reviewing = shownFlow === "review" || shownFlow === "applied";
  const shownIns = shownFlow === "applied" ? insCount : streamed;

  const [prevReviewKey, setPrevReviewKey] = React.useState<{ flow: Flow; ops: Op[] }>({ flow, ops });
  if (prevReviewKey.flow !== flow || prevReviewKey.ops !== ops) {
    setPrevReviewKey({ flow, ops });
    setStreamed(0);
  }

  const dockPx = 14;
  const estSizes = (): Sizes => ({
    idle: actionList.reduce((s, a) => s + estimate(a.label, dockPx) + 34, 0) + (actionList.length - 1) * 6,
    working: estimate(workingText, dockPx) + 10 + LEAD,
    review:
      estimate(`+${insCount}`, dockPx) +
      8 +
      estimate(`−${delCount}`, dockPx) +
      4 +
      6 +
      (estimate(rejectLabel, dockPx) + 30 + 14 + 6) +
      6 +
      (estimate(acceptLabel, dockPx) + 30 + 15 + 6),
    applied: estimate(appliedText, dockPx) + 4,
  });
  const [sizes, setSizes] = React.useState<Sizes>(estSizes);

  const liveRef = React.useRef<Live>({
    flow: shownFlow,
    level: 0,
    bands: new Float32Array(BANDS),
    target: new Float32Array(BANDS),
    time: 0,
    phase: 0,
    rot: 0,
    angle: START_ANGLE,
    ringSpeed,
    aura: orbAura * AURA_GAIN,
    base: visBase,
    accent: accents[shownFlow],
    accents,
    vis: visParams,
    still: false,
    drawnFlow: null,
  });
  React.useLayoutEffect(() => {
    const live = liveRef.current;
    live.flow = shownFlow;
    live.ringSpeed = ringSpeed;
    live.aura = orbAura * AURA_GAIN;
    live.base = visBase;
    live.accents = accents;
    live.vis = visParams;
    live.still = reduce;
  });

  React.useEffect(() => {
    if (!run) return;
    let ms = 0;
    let go: (() => void) | null = null;
    if (flow === "idle") {
      ms = holdSeconds * 1000;
      go = () => setFlow("working");
    } else if (flow === "working") {
      ms = workSeconds * 1000;
      go = () => setFlow("review");
    } else if (flow === "review" && !manual) {
      ms = insCount * WORD_MS + reviewSeconds * 1000;
      go = () => {
        onAccept?.();
        setFlow("applied");
      };
    } else if (flow === "applied") {
      ms = holdSeconds * 1000 * 0.8;
      go = () => {
        setFlow("idle");
        setManual(false);
        setActive((a) => (a + 1) % actionList.length);
        if (!(status === "auto" && loop)) setRun(false);
      };
    }
    if (!go) return;
    const fn = go;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fn, Math.max(400, ms));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [run, flow, manual, holdSeconds, workSeconds, reviewSeconds, insCount, status, loop, actionList.length, onAccept]);

  React.useEffect(() => {
    const prev = prevFlow.current;
    prevFlow.current = flow;
    if (prev === "idle" && flow === "working") onStart?.();
  }, [flow, onStart]);

  React.useEffect(() => {
    if (!kbdRef.current) return;
    const el = groupEls.current[flow];
    const target = el ? (el.querySelector('[data-primary="true"]:not([disabled])') as HTMLElement | null) : null;
    if (target) target.focus();
  }, [flow]);

  React.useEffect(() => {
    if (flow !== "review") return;
    let n = 0;
    if (streamRef.current) clearInterval(streamRef.current);
    streamRef.current = setInterval(() => {
      if (!isVisibleRef.current || n >= insCount) return;
      n += 1;
      setStreamed(n);
    }, WORD_MS);
    return () => {
      if (streamRef.current) clearInterval(streamRef.current);
    };
  }, [flow, ops, insCount]);

  React.useEffect(() => {
    if (flow !== "review") return;
    setDelW(delEls.current.map((el) => (el ? el.offsetWidth : 0)));
  }, [flow, ops]);

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

  const measureKey = `${actionList.map((a) => a.label).join("|")}|${workingText}|${reviewText}|${appliedText}|${acceptLabel}|${rejectLabel}|${insCount}|${delCount}`;
  const fontKey = JSON.stringify(font);
  React.useEffect(() => {
    const w = (k: Flow) => {
      const node = groupEls.current[k];
      return node ? node.offsetWidth : 0;
    };
    const measure = () => {
      const next: Sizes = {
        idle: w("idle"),
        working: w("working"),
        review: w("review"),
        applied: w("applied"),
      };
      setSizes((prev) => (FLOWS.every((f) => prev[f] === next[f]) ? prev : next));
    };
    measure();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver === "function") {
      ro = new ResizeObserver(measure);
      for (const f of FLOWS) {
        const node = groupEls.current[f];
        if (node) ro.observe(node);
      }
    }
    return () => {
      if (ro) ro.disconnect();
    };
  }, [measureKey, fontKey]);

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;
    if (!root) return;

    let last = performance.now();

    const fit = () => {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(ORB_SIDE * dpr);
      canvas.height = Math.round(ORB_SIDE * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, ORB_SIDE, ORB_SIDE);
      visDraw(ctx, ORB_SIDE, ORB_SIDE, liveRef.current);
    };
    const updateDom = (L: Live) => {
      const t = L.time;
      const pos = (100 - 100 * ((t / 2.4) % 1)).toFixed(2);
      for (const node of textEls.current) if (node) node.style.backgroundPosition = `${pos}% 50%`;
      const ringOpacity = (0.3 + 0.7 * L.level).toFixed(3);
      for (const node of ringEls.current) if (node) node.style.opacity = ringOpacity;
      const halo = haloRef.current;
      if (halo) {
        halo.style.opacity = (L.aura * (0.2 + 0.8 * L.level)).toFixed(3);
        halo.style.transform = `scale(${(0.9 + 0.3 * L.level).toFixed(3)})`;
      }
    };

    fit();
    if (reduce) root.style.setProperty("--gl-angle", `${START_ANGLE}deg`);

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (isVisibleRef.current) {
        const L = liveRef.current;
        if (L.still) {
          if (L.drawnFlow !== L.flow) {
            L.time = 0;
            L.phase = 0;
            L.rot = 0;
            L.level = L.flow === "working" ? 0.4 : 0.05;
            L.accent = L.accents[L.flow];
            draw();
            updateDom(L);
            L.drawnFlow = L.flow;
          }
        } else {
          L.time += dt;
          L.angle = (L.angle + L.ringSpeed * (L.flow === "idle" ? 0.5 : 1) * dt) % 360;
          updateAudio(L, dt);
          root.style.setProperty("--gl-angle", `${L.angle.toFixed(2)}deg`);
          draw();
          updateDom(L);
          L.drawnFlow = L.flow;
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rafRef.current);
  }, [reduce]);

  const fromKeyboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    kbdRef.current = e.detail === 0;
  };
  const handleAction = (i: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    fromKeyboard(e);
    setActive(i);
    setManual(true);
    setRun(true);
    setFlow("working");
  };
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    fromKeyboard(e);
    setManual(false);
    setRun(false);
    setFlow("idle");
  };
  const handleAccept = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    fromKeyboard(e);
    onAccept?.();
    setRun(true);
    setFlow("applied");
  };
  const handleReject = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    fromKeyboard(e);
    onReject?.();
    setManual(false);
    setRun(false);
    setFlow("idle");
  };

  const typography: React.CSSProperties = {
    fontFamily: FONT_FALLBACK,
    lineHeight: 1.6,
    ...font,
    margin: 0,
  };
  const dockText: React.CSSProperties = {
    fontFamily: FONT_FALLBACK,
    ...font,
    fontSize: dockPx,
    lineHeight: 1.2,
    margin: 0,
  };
  const pad = Math.max(0, padding);
  const dockW = Math.ceil(DOCK_PAD + LEAD + DOCK_GAP + sizes[shownFlow] + DOCK_PAD);
  const shimmerGradient = `linear-gradient(90deg, ${mutedColor} 0%, ${mutedColor} 32%, ${textColor} 50%, ${mutedColor} 68%, ${mutedColor} 100%)`;
  const softRing = Math.max(2, Math.min(14, ringSize * 0.45));
  const softBlur = ringSize * 0.7;
  const auraRgb = accents[shownFlow].join(",");
  const live4 = interactive;
  const working = shownFlow === "working";
  const statusLine =
    shownFlow === "idle"
      ? actionList.map((a) => a.label).join(", ")
      : shownFlow === "working"
        ? `${workingText}: ${current.label}`
        : shownFlow === "review"
          ? `${reviewText}: ${insCount} ${insCount === 1 ? "word" : "words"} added, ${delCount} removed`
          : appliedText;

  const shimmerStyle: React.CSSProperties = {
    color: "transparent",
    backgroundImage: shimmerGradient,
    backgroundSize: "300% 100%",
    backgroundPosition: `${STATIC_SHIMMER}% 50%`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const ringLayer = (idx: number, on: boolean, gradient: string, intensity: number) => (
    <div
      key={idx}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 3,
        borderRadius: "inherit",
        pointerEvents: "none",
        opacity: on ? intensity : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      <div
        ref={(el) => {
          ringEls.current[idx] = el;
        }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          opacity: 0.55,
        }}
      >
        <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", filter: `blur(${softBlur}px)` }}>
          <div style={{ ...ringStyle(softRing), background: gradient }} />
        </div>
        <div style={{ ...ringStyle(1.5), background: gradient }} />
      </div>
    </div>
  );

  let insSeen = 0;
  let delSeen = 0;
  const passageWords: React.ReactNode[] = [];
  if (reviewing) {
    ops.forEach((op, i) => {
      if (op.kind === "eq") {
        passageWords.push(<span key={i}>{op.text + " "}</span>);
      } else if (op.kind === "del") {
        const k = delSeen++;
        const gone = shownFlow === "applied";
        const w = delW[k];
        passageWords.push(
          <span
            key={i}
            aria-hidden="true"
            ref={(el) => {
              delEls.current[k] = el;
            }}
            style={{
              display: "inline-block",
              verticalAlign: "bottom",
              whiteSpace: "pre",
              overflow: "hidden",
              maxWidth: gone ? 0 : w ? w : "none",
              opacity: gone ? 0 : 1,
              color: rgba(delRgb, 0.95),
              background: rgba(delRgb, 0.14),
              textDecoration: "line-through",
              textDecorationColor: rgba(delRgb, 0.7),
              borderRadius: 4,
              transition: "max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
            }}
          >
            {op.text + " "}
          </span>,
        );
      } else {
        const k = insSeen++;
        if (k >= shownIns) return;
        const fresh = shownFlow === "review" && k === shownIns - 1 && shownIns < insCount;
        const done = shownFlow === "applied";
        passageWords.push(
          <span
            key={i}
            style={{
              color: done ? textColor : rgba(addRgb, 1),
              background: done ? rgba(addRgb, 0) : rgba(addRgb, 0.14),
              borderRadius: 4,
              opacity: fresh ? 0.45 : 1,
              transition: "opacity 0.25s ease, background-color 0.6s ease, color 0.6s ease",
            }}
          >
            {op.text + " "}
          </span>,
        );
      }
    });
  }
  const highlighted = shownFlow === "idle" || working;
  const passageNode = (
    <span
      ref={(el) => {
        textEls.current[0] = working ? el : null;
      }}
      style={{
        color: textColor,
        backgroundColor: highlighted ? rgba(selRgb, 0.3) : rgba(selRgb, 0),
        borderRadius: 5,
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
        padding: "1px 0",
        transition: "background-color 0.4s ease",
        ...(working ? shimmerStyle : {}),
      }}
    >
      {reviewing ? passageWords : selected}
    </span>
  );

  const group = (f: Flow, content: React.ReactNode) => {
    const on = f === shownFlow;
    return (
      <div
        key={f}
        ref={(el) => {
          groupEls.current[f] = el;
        }}
        data-flow={f}
        aria-hidden={!on}
        style={{
          position: "absolute",
          left: DOCK_PAD + LEAD + DOCK_GAP,
          top: DOCK_PAD,
          height: LEAD,
          width: "max-content",
          display: "flex",
          alignItems: "center",
          gap: 6,
          visibility: on ? "visible" : "hidden",
          opacity: on ? 1 : 0,
          transform: `translateY(${on ? 0 : 6}px)`,
          transition: on
            ? "opacity 0.35s ease 0.18s, transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.18s, visibility 0s linear 0s"
            : "opacity 0.15s ease, transform 0.15s ease, visibility 0s linear 0.16s",
          pointerEvents: on && live4 ? "auto" : "none",
        }}
      >
        {content}
      </div>
    );
  };

  const orbNode = (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: ORB_SIDE,
        height: ORB_SIDE,
        transformOrigin: "0 0",
        transform: `translate(${(DOCK_PAD + LEAD / 2 - (ORB_SIDE * ((LEAD * 0.9) / (ORB_RATIO * ORB_SIDE))) / 2).toFixed(2)}px, ${(DOCK_H / 2 - (ORB_SIDE * ((LEAD * 0.9) / (ORB_RATIO * ORB_SIDE))) / 2).toFixed(2)}px) scale(${((LEAD * 0.9) / (ORB_RATIO * ORB_SIDE)).toFixed(4)})`,
        opacity: shownFlow === "applied" ? 0 : 1,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
      }}
    >
      {orbAura > 0 && (
        <div
          ref={haloRef}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${auraRgb},0.4) 0%, rgba(${auraRgb},0) 62%)`,
            opacity: orbAura * AURA_GAIN * 0.2,
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: ORB_SIDE,
          height: ORB_SIDE,
          display: "block",
        }}
      />
    </div>
  );

  const checkBadge = (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: DOCK_PAD + 3,
        top: DOCK_PAD + 3,
        width: LEAD - 6,
        height: LEAD - 6,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: rgba(doneRgb, 1),
        background: "rgba(255,255,255,0.07)",
        border: `1px solid ${HAIRLINE}`,
        boxShadow: `0 0 14px ${rgba(doneRgb, 0.28)}`,
        opacity: shownFlow === "applied" ? 1 : 0,
        transform: shownFlow === "applied" ? "scale(1)" : "scale(0.5)",
        transition: "opacity 0.3s ease 0.1s, transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1) 0.1s",
      }}
    >
      <CheckIcon />
    </div>
  );

  return (
    <article
      ref={rootRef}
      role="region"
      aria-label="AI text editor"
      className={cn("relative box-border flex h-full w-full flex-col overflow-hidden", className)}
      style={{
        ...style,
        gap,
        padding: pad,
        borderRadius: radius,
        background,
        backgroundImage: SHEEN,
        boxShadow: `inset 0 0 0 1px ${borderColor}, inset 0 1px 0 rgba(255,255,255,0.1)`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <p style={SR_ONLY}>{description}</p>
      <span role="status" aria-live="polite" style={SR_ONLY}>
        {statusLine}
      </span>

      {ringLayer(0, working, workGradient, ringIntensity)}
      {ringLayer(1, shownFlow === "review", reviewGradient, ringIntensity * 0.45)}
      {ringLayer(2, shownFlow === "applied", doneGradient, ringIntensity * 0.6)}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <p style={{ ...typography, color: mutedColor, wordBreak: "break-word" }}>
          {before}
          {passageNode}
          {after}
        </p>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: "none",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: "none",
            width: dockW,
            maxWidth: "100%",
            height: DOCK_H,
            overflow: "hidden",
            borderRadius: 999,
            background: "rgba(255,255,255,0.05)",
            boxShadow: `inset 0 0 0 1px ${HAIRLINE}, inset 0 1px 0 rgba(255,255,255,0.08)`,
            transition: `width ${MORPH}`,
          }}
        >
          {orbNode}
          {checkBadge}

          {group(
            "idle",
            actionList.map((a, i) => (
              <DockAction
                key={`action-${i}`}
                label={a.label}
                onClick={handleAction(i)}
                live={live4 && shownFlow === "idle"}
                variant="ghost"
                textStyle={dockText}
                textColor={textColor}
                extra={{ primary: i === 0 }}
              />
            )),
          )}
          {group(
            "working",
            <>
              <span
                style={{
                  ...dockText,
                  ...shimmerStyle,
                  whiteSpace: "nowrap",
                  marginRight: 4,
                }}
                ref={(el) => {
                  textEls.current[1] = el;
                }}
              >
                {workingText}
              </span>
              <DockAction
                label="Cancel"
                onClick={handleCancel}
                live={live4 && shownFlow === "working"}
                variant="round"
                textStyle={dockText}
                textColor={textColor}
                extra={{ icon: <StopIcon />, primary: true, ariaLabel: "Cancel rewrite" }}
              />
            </>,
          )}
          {group(
            "review",
            <>
              <span
                style={{
                  ...dockText,
                  whiteSpace: "nowrap",
                  marginRight: 4,
                  display: "flex",
                  gap: 8,
                  color: mutedColor,
                }}
                title={reviewText}
              >
                <span style={{ color: rgba(addRgb, 1) }}>{`+${insCount}`}</span>
                <span style={{ color: rgba(delRgb, 1) }}>{`−${delCount}`}</span>
              </span>
              <DockAction
                label={rejectLabel}
                onClick={handleReject}
                live={live4 && shownFlow === "review"}
                variant="soft"
                textStyle={dockText}
                textColor={textColor}
                extra={{ icon: <CloseIcon /> }}
              />
              <DockAction
                label={acceptLabel}
                onClick={handleAccept}
                live={live4 && shownFlow === "review"}
                variant="primary"
                textStyle={dockText}
                textColor={textColor}
                extra={{ icon: <CheckIcon />, primary: true }}
              />
            </>,
          )}
          {group(
            "applied",
            <span
              style={{
                ...dockText,
                whiteSpace: "nowrap",
                color: textColor,
                paddingRight: 4,
              }}
            >
              {appliedText}
            </span>,
          )}
        </div>
      </div>
    </article>
  );
}
