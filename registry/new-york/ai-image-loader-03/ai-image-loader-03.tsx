"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RGB = [number, number, number];
type Phase = "generating" | "done";
type Preview = "auto" | Phase;
type ImageSource = { src: string; srcSet?: string; alt?: string };

export interface AiImageLoader03Props {
  preview?: Preview;
  loop?: boolean;
  loopDelay?: number;
  generateSeconds?: number;
  messages?: string[];
  cycleSeconds?: number;
  doneText?: string;
  showResult?: boolean;
  image?: ImageSource;
  scrim?: number;
  lineCount?: number;
  lineWidth?: number;
  amplitude?: number;
  lineColor?: string;
  accentColor?: string;
  accentAmount?: number;
  speed?: number;
  intensity?: number;
  edgeFade?: number;
  font?: React.CSSProperties;
  textColor?: string;
  mutedColor?: string;
  glowColors?: string[];
  ringIntensity?: number;
  ringSize?: number;
  ringSpeed?: number;
  background?: string;
  borderColor?: string;
  radius?: number;
  padding?: number;
  gap?: number;
  ariaLabel?: string;
  onComplete?: () => void;
  onRegenerate?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const START_ANGLE = 40;
const STATIC_SHIMMER = 72;
const RV_MIN = 0;
const SWEEP_IN = 2.4;
const SWEEP_OUT = 1.0;
const FEATHER = 34;
const sweepPct = (p: number) => -FEATHER + (100 + FEATHER) * p;
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const FONT_FALLBACK = "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const HAIRLINE = "rgba(255,255,255,0.14)";
const HOVER_ON = "inset 0 0 0 999px rgba(255,255,255,0.07)";
const HOVER_OFF = "inset 0 0 0 999px rgba(255,255,255,0)";
const RING = "0 0 0 2px rgba(255,255,255,0.35)";
const NO_RING = "0 0 0 0 rgba(255,255,255,0)";

const DEFAULT_MESSAGES = ["Composing the scene", "Finding the light", "Drawing the shapes", "Almost there"];
const DEFAULT_GLOW = ["#7CF3FF", "#6EA8FF", "#9B7BFF"];
const DEFAULT_IMAGE: ImageSource = {
  src: "/demo/ai-image-loader-03.webp",
  alt: "Warm-toned living room with sheer curtains billowing as a woman in a flowing dress walks through a doorway, motion-blurred",
};

const SR_ONLY: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

type Live = {
  phase: Phase;
  hasImage: boolean;
  time: number;
  angle: number;
  rv: number;
  grow: number;
  ringSpeed: number;
  speed: number;
  lines: number;
  lineW: number;
  amp: number;
  intensity: number;
  accentAmount: number;
  base: RGB;
  accent: RGB;
  top: number;
  cardH: number;
  snap: boolean;
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function smooth(v: number) {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
}

function smoother(v: number) {
  const t = clamp01(v);
  return t * t * t * (t * (t * 6 - 15) + 10);
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

function isUsableImageSrc(src?: string) {
  if (typeof src !== "string") return false;
  const s = src.trim();
  if (!s) return false;
  if (s.startsWith("data:")) {
    const comma = s.indexOf(",");
    if (comma < 0) return false;
    const payload = s.slice(comma + 1).replace(/\s/g, "");
    return payload.length > 16 && !payload.includes("/*");
  }
  return true;
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

const PTS = 120;
const MAX_LINES = 64;
const RIDGE = 0.24;
const FIELD_Y = new Float32Array(PTS + 1);
const FIELD_H = new Float32Array(PTS + 1);
const FIELD_MIN = new Float32Array(PTS + 1);

function heightAt(u: number, i: number, n: number, t: number) {
  const v = i / Math.max(1, n - 1);
  const env = smooth(u * 5) * smooth((1 - u) * 5);
  let s = 0;
  for (let k = 0; k < 3; k++) {
    const c = 0.5 + 0.34 * Math.sin(t * (0.23 + 0.09 * k) + k * 2.3 + v * (1.4 + k * 0.6));
    const w = 0.075 + 0.03 * Math.sin(t * 0.4 + k * 1.7 + v * 2);
    const a = 0.55 + 0.45 * Math.sin(t * (0.31 + 0.05 * k) + k * 1.1 + v * 3.1);
    const d = (u - c) / w;
    s += a * Math.exp(-0.5 * d * d);
  }
  const fine = 0.16 * Math.sin(u * 27 + i * 0.9 + t * 1.6) * Math.sin(u * 9 - t * 0.7 + i * 0.3);
  return 0.7 * env * (s * 0.55 + fine * (0.3 + s));
}

function lineGeo(h: number, n: number, amp: number) {
  const maxH = h * 0.22 * amp;
  const top = maxH * 1.05;
  return {
    maxH,
    top,
    spacing: Math.max(2, (h - top - 6) / Math.max(1, n - 1)),
  };
}

function fillLine(i: number, n: number, geo: ReturnType<typeof lineGeo>, t: number, grow: number) {
  const base = geo.top + i * geo.spacing;
  for (let k = 0; k <= PTS; k++) {
    const hh = heightAt(k / PTS, i, n, t);
    FIELD_H[k] = hh;
    FIELD_Y[k] = base - hh * geo.maxH * grow;
  }
}

function lineAlphas(i: number, n: number, intensity: number) {
  const v = n === 1 ? 1 : i / (n - 1);
  return {
    a0: clamp01((0.14 + 0.36 * v) * intensity),
    a1: clamp01((0.45 + 0.5 * v) * intensity),
  };
}
function drawLines(ctx: CanvasRenderingContext2D, w: number, h: number, L: Live) {
  const n = L.lines;
  const geo = lineGeo(h, n, L.amp);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  FIELD_MIN.fill(Infinity);
  const [br, bg, bb] = L.base;
  const [hr, hg, hb] = mixRgb(L.base, L.accent, L.accentAmount);
  for (let i = n - 1; i >= 0; i--) {
    fillLine(i, n, geo, L.time, L.grow);
    const { a0, a1 } = lineAlphas(i, n, L.intensity);
    ctx.lineWidth = L.lineW;
    ctx.strokeStyle = `rgba(${br},${bg},${bb},${a0.toFixed(3)})`;
    ctx.beginPath();
    let pen = false;
    for (let k = 0; k <= PTS; k++) {
      if (FIELD_Y[k] <= FIELD_MIN[k] + 0.01) {
        const x = (k / PTS) * w;
        if (pen) ctx.lineTo(x, FIELD_Y[k]);
        else ctx.moveTo(x, FIELD_Y[k]);
        pen = true;
      } else pen = false;
    }
    ctx.stroke();
    ctx.lineWidth = L.lineW * 1.3;
    ctx.strokeStyle = `rgba(${hr},${hg},${hb},${a1.toFixed(3)})`;
    ctx.beginPath();
    pen = false;
    for (let k = 0; k <= PTS; k++) {
      if (FIELD_H[k] > RIDGE && FIELD_Y[k] <= FIELD_MIN[k] + 0.01) {
        const x = (k / PTS) * w;
        if (pen) ctx.lineTo(x, FIELD_Y[k]);
        else ctx.moveTo(x, FIELD_Y[k]);
        pen = true;
      } else pen = false;
    }
    ctx.stroke();
    for (let k = 0; k <= PTS; k++) if (FIELD_Y[k] < FIELD_MIN[k]) FIELD_MIN[k] = FIELD_Y[k];
  }
  if (L.rv > 0.001 && L.rv < 1) {
    const front = (sweepPct(smoother(L.rv)) / 100) * L.cardH - L.top;
    const span = (FEATHER / 100) * L.cardH;
    ctx.globalCompositeOperation = "destination-out";
    if (front > 0) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, Math.min(h, front));
    }
    const y0 = Math.max(0, front);
    const y1 = Math.min(h, front + span);
    if (y1 > y0) {
      const g = ctx.createLinearGradient(0, front, 0, front + span);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(0.45, "rgba(0,0,0,0.55)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, y0, w, y1 - y0);
    }
    ctx.globalCompositeOperation = "source-over";
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

const RefreshIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    style={{ display: "block" }}
  >
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

type RoundButtonProps = {
  label: string;
  onClick: () => void;
  background: string;
  color: string;
  children: React.ReactNode;
};

function RoundButton({ label, onClick, background, color, children }: RoundButtonProps) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const focus = useFocusVisible();
  const release = () => setPressed(false);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        release();
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
      style={{
        width: 34,
        height: 34,
        flex: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: `1px solid ${HAIRLINE}`,
        background,
        color,
        cursor: "pointer",
        outline: "none",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transform: pressed ? "scale(0.92)" : "scale(1)",
        boxShadow: `${hover ? HOVER_ON : HOVER_OFF}, ${focus.focusVisible ? RING : NO_RING}`,
        transition: "background-color 0.25s ease, color 0.25s ease, box-shadow 0.2s ease, transform 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

export function AiImageLoader03(props: AiImageLoader03Props) {
  const {
    preview = "auto",
    loop = false,
    loopDelay = 3,
    generateSeconds = 5,
    messages = DEFAULT_MESSAGES,
    cycleSeconds = 3.2,
    doneText = "",
    showResult = true,
    image,
    scrim = 0.55,
    lineCount = 36,
    lineWidth = 1,
    amplitude = 1,
    lineColor = "#FFFFFF",
    accentColor = "#9DB8FF",
    accentAmount = 0.2,
    speed = 1.4,
    intensity = 1,
    edgeFade = 20,
    font = { fontSize: 16, lineHeight: 1.3 },
    textColor = "#DADADA",
    mutedColor = "#6B6B6B",
    glowColors = DEFAULT_GLOW,
    ringIntensity = 0.4,
    ringSize = 10,
    ringSpeed = 40,
    background = "rgba(255,255,255,0.035)",
    borderColor = "rgba(255,255,255,0.08)",
    radius = 28,
    padding = 24,
    gap = 18,
    ariaLabel = "AI image generation",
    onComplete,
    onRegenerate,
    className,
    style,
  } = props;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const visualRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const revealRef = React.useRef<HTMLDivElement>(null);
  const pictureRef = React.useRef<HTMLImageElement>(null);
  const ringInnerRef = React.useRef<HTMLDivElement>(null);
  const textEls = React.useRef<(HTMLSpanElement | null)[]>([]);
  const isVisibleRef = React.useRef(true);
  const prevPhase = React.useRef<Phase>("generating");
  const generateTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = React.useRef(0);
  const mountedRef = React.useRef(true);
  const runGenRef = React.useRef(0);

  const configuredImage = image && isUsableImageSrc(image.src) ? image : undefined;
  const source: ImageSource = configuredImage ?? DEFAULT_IMAGE;
  const hasImage = showResult && isUsableImageSrc(source.src);
  const [phase, setPhase] = React.useState<Phase>("generating");
  const [idx, setIdx] = React.useState(0);
  const [run, setRun] = React.useState(0);
  const reduce = React.useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);

  const messageList = React.useMemo(() => cleanList(messages, DEFAULT_MESSAGES), [messages]);
  const glowList = React.useMemo(() => cleanList(glowColors, DEFAULT_GLOW), [glowColors]);
  const glowGradient = React.useMemo(() => buildGradient(glowList, 0.55), [glowList]);
  const baseRgb = React.useMemo(() => parseRgb(lineColor, [255, 255, 255]), [lineColor]);
  const accentRgb = React.useMemo(() => parseRgb(accentColor, [157, 184, 255]), [accentColor]);
  const lineN = Math.max(12, Math.min(MAX_LINES, Math.round(lineCount)));

  const fixed: Phase | null = preview !== "auto" ? preview : null;
  const settled = fixed !== null || reduce;
  const wanted: Phase = fixed ?? (reduce ? (hasImage ? "done" : "generating") : phase);
  const shownPhase: Phase = wanted === "done" && hasImage ? "done" : "generating";

  const liveRef = React.useRef<Live>({
    phase: shownPhase,
    hasImage,
    time: 0,
    angle: START_ANGLE,
    rv: RV_MIN,
    grow: 1,
    ringSpeed,
    speed,
    lines: lineN,
    lineW: lineWidth,
    amp: amplitude,
    intensity,
    accentAmount,
    base: baseRgb,
    accent: accentRgb,
    top: 0,
    cardH: 1,
    snap: false,
  });
  React.useLayoutEffect(() => {
    const live = liveRef.current;
    live.phase = shownPhase;
    live.hasImage = hasImage;
    live.ringSpeed = ringSpeed;
    live.speed = speed;
    live.lines = lineN;
    live.lineW = lineWidth;
    live.amp = amplitude;
    live.intensity = intensity;
    live.accentAmount = accentAmount;
    live.base = baseRgb;
    live.accent = accentRgb;
    live.snap = fixed !== null || reduce;
  });

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const resetKey = `${String(fixed)}|${reduce}|${run}`;
  const [prevResetKey, setPrevResetKey] = React.useState(resetKey);
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    setPhase("generating");
    setIdx(0);
  }

  React.useEffect(() => {
    if (fixed !== null || reduce) return;
    liveRef.current.grow = 0.15;
    if (!hasImage) return;
    if (generateTimerRef.current) clearTimeout(generateTimerRef.current);
    const myGen = ++runGenRef.current;
    generateTimerRef.current = setTimeout(
      () => {
        if (!mountedRef.current || runGenRef.current !== myGen) return;
        setPhase("done");
      },
      Math.max(1, generateSeconds) * 1000,
    );
    return () => {
      if (generateTimerRef.current) clearTimeout(generateTimerRef.current);
    };
  }, [fixed, reduce, hasImage, run, generateSeconds]);

  React.useEffect(() => {
    const prev = prevPhase.current;
    prevPhase.current = phase;
    if (fixed !== null || reduce) return;
    if (prev === "generating" && phase === "done") onComplete?.();
  }, [phase, fixed, reduce, onComplete]);

  React.useEffect(() => {
    if (fixed !== null || reduce || !loop || !hasImage || phase !== "done") return;
    if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    loopTimerRef.current = setTimeout(
      () => {
        if (!mountedRef.current) return;
        setRun((r) => r + 1);
      },
      Math.max(0.5, loopDelay) * 1000,
    );
    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, [fixed, reduce, loop, hasImage, phase, loopDelay]);

  React.useEffect(() => {
    if (reduce || shownPhase !== "generating" || messageList.length < 2) return;
    if (cycleSeconds <= 0) return;
    if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
    cycleTimerRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      if (isVisibleRef.current) setIdx((i) => (i + 1) % messageList.length);
    }, cycleSeconds * 1000);
    return () => {
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
    };
  }, [reduce, shownPhase, messageList.length, cycleSeconds]);

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

  React.useEffect(() => {
    const root = rootRef.current;
    const wrap = visualRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;
    if (!root) return;

    let last = performance.now();
    let w = 0;
    let h = 0;

    const fit = () => {
      if (!wrap || !canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = Math.max(2, Math.round(w * dpr));
      canvas.height = Math.max(2, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      liveRef.current.top = wrap.offsetTop || 0;
      liveRef.current.cardH = Math.max(1, root.clientHeight);
    };

    const draw = () => {
      if (!ctx || w <= 0 || h <= 0) return;
      ctx.clearRect(0, 0, w, h);
      if (liveRef.current.rv < 1) drawLines(ctx, w, h, liveRef.current);
    };

    const updateDom = (L: Live) => {
      const t = L.time;
      const pos = (100 - 100 * ((t / 2.4) % 1)).toFixed(2);
      for (const node of textEls.current) if (node) node.style.backgroundPosition = `${pos}% 50%`;
      if (ringInnerRef.current) ringInnerRef.current.style.opacity = (0.55 + 0.3 * Math.sin(t * 2.2)).toFixed(3);
      const p = smoother(L.rv);
      const reveal = revealRef.current;
      if (reveal) {
        reveal.style.setProperty("--sy", sweepPct(p).toFixed(2));
        reveal.style.visibility = L.rv <= 0.001 ? "hidden" : "visible";
      }
    };

    fit();

    const ro = new ResizeObserver(() => {
      if (!isVisibleRef.current) return;
      fit();
      draw();
    });
    if (wrap) ro.observe(wrap);

    if (reduce) {
      const L = liveRef.current;
      L.time = 3.4;
      L.grow = 1;
      L.rv = L.hasImage ? 1 : RV_MIN;
      root.style.setProperty("--gl-angle", `${START_ANGLE}deg`);
      draw();
      return () => {
        ro.disconnect();
      };
    }

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (isVisibleRef.current) {
        const L = liveRef.current;
        L.time += dt * L.speed;
        L.grow += (1 - L.grow) * Math.min(1, dt * 0.9);
        L.angle = (L.angle + L.ringSpeed * (L.phase === "done" ? 0.5 : 1) * dt) % 360;
        const target = L.phase === "done" && L.hasImage ? 1 : RV_MIN;
        if (L.snap) L.rv = target;
        else if (target > L.rv) L.rv = Math.min(target, L.rv + dt / SWEEP_IN);
        else L.rv = Math.max(target, L.rv - dt / SWEEP_OUT);
        root.style.setProperty("--gl-angle", `${L.angle.toFixed(2)}deg`);
        draw();
        updateDom(L);
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [reduce]);

  const handleRegenerate = () => {
    if (fixed !== null || reduce) return;
    onRegenerate?.();
    setRun((r) => r + 1);
  };

  const typography: React.CSSProperties = {
    fontFamily: FONT_FALLBACK,
    fontWeight: 500,
    lineHeight: 1.3,
    ...font,
    margin: 0,
  };

  const lines = [...messageList, doneText];
  const doneIndex = lines.length - 1;
  const cur = shownPhase === "done" ? doneIndex : idx % messageList.length;
  const shimmerGradient = `linear-gradient(90deg, ${mutedColor} 0%, ${mutedColor} 32%, ${textColor} 50%, ${mutedColor} 68%, ${mutedColor} 100%)`;
  const softRing = Math.max(2, Math.min(18, ringSize * 0.45));
  const softBlur = ringSize * 0.7;
  const ringActive = shownPhase === "generating";
  const statusLine = shownPhase === "done" ? doneText : messageList[idx % messageList.length];
  const alt = source.alt || "Generated image";
  const regionLabel = (ariaLabel || "AI image generation").trim();

  const ringNode = (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 3,
        borderRadius: "inherit",
        pointerEvents: "none",
        opacity: ringActive ? ringIntensity : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      <div ref={ringInnerRef} style={{ position: "absolute", inset: 0, borderRadius: "inherit", opacity: 0.7 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", filter: `blur(${softBlur}px)` }}>
          <div style={{ ...ringStyle(softRing), background: glowGradient }} />
        </div>
        <div style={{ ...ringStyle(1.5), background: glowGradient }} />
      </div>
    </div>
  );

  const maskImage = `linear-gradient(180deg,
        #000 0%,
        #000 calc(var(--sy, -${FEATHER}) * 1% - 8%),
        rgba(0,0,0,0.65) calc(var(--sy, -${FEATHER}) * 1%),
        transparent calc(var(--sy, -${FEATHER}) * 1% + ${FEATHER}%)
    )`;

  const revealNode = hasImage ? (
    <div
      ref={revealRef}
      aria-hidden={shownPhase !== "done"}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        borderRadius: "inherit",
        overflow: "hidden",
        pointerEvents: "none",
        display: settled && shownPhase !== "done" ? "none" : "block",
        visibility: settled ? "visible" : "hidden",
        ...(settled ? {} : { WebkitMaskImage: maskImage, maskImage }),
      }}
    >
      <img
        ref={pictureRef}
        src={source.src}
        srcSet={source.srcSet}
        alt={shownPhase === "done" ? alt : ""}
        decoding="async"
        draggable={false}
        style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(8,8,10,${(0.62 * scrim).toFixed(3)}) 0%, rgba(8,8,10,${(0.22 * scrim).toFixed(3)}) 22%, rgba(8,8,10,0) 42%)`,
        }}
      />
    </div>
  ) : null;

  const labelNode = (
    <div aria-hidden="true" style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", width: "100%", minWidth: 0 }}>
        {lines.map((text, i) => {
          const on = i === cur;
          const shimmer = i !== doneIndex;
          return (
            <div
              key={i}
              style={{
                gridArea: "1 / 1",
                display: "flex",
                alignItems: "baseline",
                minWidth: 0,
                opacity: on ? 1 : 0,
                transform: on ? "translateY(0px)" : "translateY(6px)",
                transition: `opacity 0.6s ease, transform 0.6s ${EASE}`,
              }}
            >
              <span
                ref={(el) => {
                  textEls.current[i] = shimmer ? el : null;
                }}
                style={
                  shimmer
                    ? {
                        ...typography,
                        display: "block",
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "transparent",
                        backgroundImage: shimmerGradient,
                        backgroundSize: "300% 100%",
                        backgroundPosition: `${STATIC_SHIMMER}% 50%`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }
                    : {
                        ...typography,
                        display: "block",
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "#FFFFFF",
                      }
                }
              >
                {text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const fadePct = Math.max(0, Math.min(40, edgeFade));
  const edgeMask = fadePct > 0 ? `linear-gradient(90deg, transparent 0%, #000 ${fadePct}%, #000 ${100 - fadePct}%, transparent 100%)` : undefined;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label={regionLabel}
      aria-busy={shownPhase === "generating"}
      aria-live="polite"
      aria-atomic="true"
      className={cn("relative box-border h-full w-full overflow-hidden", className)}
      style={{
        ...style,
        borderRadius: radius,
        background,
        backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0) 60%)",
        border: `1px solid ${borderColor}`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <h2 style={SR_ONLY}>{regionLabel}</h2>
      <p role="status" style={SR_ONLY}>
        {statusLine}
      </p>

      {revealNode}

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap, boxSizing: "border-box", width: "100%", height: "100%", padding }}>
        <div style={{ flex: "none", minHeight: 34, display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              filter: shownPhase === "done" ? "drop-shadow(0 1px 8px rgba(0,0,0,0.45))" : "none",
            }}
          >
            {labelNode}
          </div>
          {shownPhase === "done" && (
            <RoundButton label="Generate again" onClick={handleRegenerate} background="rgba(20,20,22,0.45)" color={textColor}>
              <RefreshIcon />
            </RoundButton>
          )}
        </div>

        <div
          ref={visualRef}
          aria-hidden="true"
          style={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            width: `calc(100% + ${padding * 2}px)`,
            marginLeft: -padding,
            marginRight: -padding,
          }}
        >
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: edgeMask, maskImage: edgeMask }}>
            <canvas ref={canvasRef} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
          </div>
        </div>
      </div>

      {ringNode}
    </div>
  );
}
