"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RGB = [number, number, number];
type Status = "idle" | "listening" | "speaking";
type InputSource = "simulated" | "microphone";

export interface AiVoice05Props {
  status?: Status;
  interactive?: boolean;
  autoFlow?: boolean;
  flowSeconds?: number;
  input?: InputSource;
  sensitivity?: number;
  idleText?: string;
  listeningText?: string;
  speakingText?: string;
  transcript?: boolean;
  phrases?: string[];
  font?: React.CSSProperties;
  textColor?: string;
  mutedColor?: string;
  listenColors?: string[];
  speakColors?: string[];
  ringIntensity?: number;
  ringSize?: number;
  ringSpeed?: number;
  background?: string;
  borderColor?: string;
  radius?: number;
  padding?: number;
  gap?: number;
  curves?: number;
  curveWidth?: number;
  curveAmp?: number;
  curveColor?: string;
  onStart?: () => void;
  onStop?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const TAU = Math.PI * 2;
const BANDS = 32;
const DOTS = 3;
const CONTROL = 44;
const CURVE_POINTS = 96;
const REST_GAP = 3;
const START_ANGLE = 40;
const STATIC_SHIMMER = 72;
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const FONT_FALLBACK = "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const HAIRLINE = "rgba(255,255,255,0.14)";
const HOVER_ON = "inset 0 0 0 999px rgba(255,255,255,0.06)";
const HOVER_OFF = "inset 0 0 0 999px rgba(255,255,255,0)";
const RING = "0 0 0 2px rgba(255,255,255,0.35)";
const NO_RING = "0 0 0 0 rgba(255,255,255,0)";

const DEFAULT_PHRASES = ["What's the weather like today?", "Book a table for two tonight", "Summarize my last meeting"];
const DEFAULT_LISTEN = ["#7CF3FF", "#6EA8FF", "#9B7BFF"];
const DEFAULT_SPEAK = ["#FF7BD5", "#FFB86B", "#F5C84C"];

const SR_ONLY: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

type Mic = {
  stream: MediaStream;
  ctx: AudioContext;
  analyser: AnalyserNode;
  data: ReturnType<typeof makeData>;
};

function makeData(n: number) {
  return new Uint8Array(n);
}

type Live = {
  mode: Status;
  input: InputSource;
  sens: number;
  level: number;
  bands: Float32Array;
  target: Float32Array;
  time: number;
  phase: number;
  rot: number;
  angle: number;
  ringSpeed: number;
  base: RGB;
  accent: RGB;
  vis: VisParams;
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

function cleanList(list: string[] | undefined, fallback: string[]) {
  const out = (list ?? []).filter((s): s is string => typeof s === "string" && s.trim() !== "");
  return out.length ? out : fallback;
}

function simulateBands(t: number, mode: Status, out: Float32Array) {
  const n = out.length;
  let base = 0;
  if (mode === "idle") {
    base = 0.02 + 0.015 * Math.sin(t * 1.3);
  } else if (mode === "listening") {
    const x = 0.5 + 0.5 * Math.sin(t * 0.9 + 1.7 * Math.sin(t * 0.37));
    const gate = clamp01((x - 0.35) / 0.3);
    const syll = 0.55 + 0.45 * Math.sin(t * 7.3) * Math.sin(t * 2.1 + 0.6);
    base = gate * gate * (3 - 2 * gate) * syll;
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

function readMic(mic: Mic, sens: number, out: Float32Array) {
  mic.analyser.getByteFrequencyData(mic.data);
  const n = out.length;
  const bins = mic.data.length;
  const lo = 1;
  const hi = Math.min(bins - 1, 44);
  for (let i = 0; i < n; i++) {
    const a = lo + Math.floor(Math.pow(i / n, 1.5) * (hi - lo));
    const b = Math.max(a + 1, lo + Math.floor(Math.pow((i + 1) / n, 1.5) * (hi - lo)));
    const end = Math.min(b, bins);
    let s = 0;
    for (let j = a; j < end; j++) s += mic.data[j];
    const v = s / Math.max(1, end - a) / 255;
    out[i] = clamp01(Math.pow(v * sens, 1.15));
  }
}

function updateAudio(L: Live, mic: Mic | null, dt: number) {
  const n = L.bands.length;
  if (L.mode === "listening" && L.input === "microphone" && mic) readMic(mic, L.sens, L.target);
  else simulateBands(L.time, L.mode, L.target);
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
}

const SMOOTH_A = new Float32Array(BANDS);
const SMOOTH_B = new Float32Array(BANDS);

function smoothBands(src: Float32Array): Float32Array {
  const n = src.length;
  for (let i = 0; i < n; i++) SMOOTH_A[i] = 0.25 * src[Math.max(0, i - 1)] + 0.5 * src[i] + 0.25 * src[Math.min(n - 1, i + 1)];
  for (let i = 0; i < n; i++) SMOOTH_B[i] = 0.25 * SMOOTH_A[Math.max(0, i - 1)] + 0.5 * SMOOTH_A[i] + 0.25 * SMOOTH_A[Math.min(n - 1, i + 1)];
  return SMOOTH_B;
}

type VisParams = { curves: number; thick: number; amp: number; rgb: RGB };

function innerFrac(R: number) {
  return Math.min(0.85, (CONTROL / 2 + REST_GAP) / Math.max(1, R));
}

function curveRadius(
  l: number,
  theta: number,
  bands: Float32Array,
  level: number,
  phase: number,
  rot: number,
  amp: number,
  R: number,
  inner: number,
  curves: number,
) {
  const t = curves === 1 ? 0.5 : l / (curves - 1);
  const dir = l % 2 === 0 ? 1 : -1;
  const f = Math.abs(Math.sin((theta + rot * 0.6 * dir + l * 0.4) / 2));
  const v = bands[Math.min(bands.length - 1, Math.floor(f * (bands.length - 1)))];
  const e = clamp01(0.65 * v + 0.35 * level);
  const wave = Math.sin(theta * (2.5 + 0.9 * t) + phase * (1.7 + 0.35 * l) + rot * dir) * Math.sin(theta * (1.2 + 0.35 * l) - phase * 0.6);
  const base = inner + 0.06 + t * 0.18;
  const ripple = (0.02 + 0.055 * e) * amp * (0.75 + 0.45 * (1 - t));
  const swell = 0.012 * amp * wave;
  const rFrac = base + ripple + swell;
  return Math.min(0.98, Math.max(inner + 0.015, rFrac)) * R;
}

function visDraw(ctx: CanvasRenderingContext2D, w: number, h: number, L: Live) {
  const vis = L.vis;
  const cx = w / 2;
  const cy = h / 2;
  const R = (Math.min(w, h) / 2) * 0.94;
  const inner = innerFrac(R);
  const bands = smoothBands(L.bands);
  ctx.clearRect(0, 0, w, h);
  const fallback = `rgba(${vis.rgb[0]},${vis.rgb[1]},${vis.rgb[2]},0.92)`;
  let stroke: CanvasGradient | string = fallback;
  if (typeof ctx.createConicGradient === "function") {
    const grad = ctx.createConicGradient(L.rot * 0.8, cx, cy);
    const m0 = mixRgb(vis.rgb, L.accent, 0.15);
    const m1 = mixRgb(vis.rgb, L.accent, 0.72);
    const m2 = mixRgb(vis.rgb, L.accent, 0.25);
    grad.addColorStop(0, `rgb(${m0.join(",")})`);
    grad.addColorStop(0.38, `rgb(${m1.join(",")})`);
    grad.addColorStop(0.74, `rgb(${m2.join(",")})`);
    grad.addColorStop(1, `rgb(${m0.join(",")})`);
    stroke = grad;
  }
  ctx.globalCompositeOperation = "source-over";
  for (let l = 0; l < vis.curves; l++) {
    ctx.beginPath();
    for (let i = 0; i <= CURVE_POINTS; i++) {
      const theta = (i / CURVE_POINTS) * TAU;
      const radius = curveRadius(l, theta, bands, L.level, L.phase, L.rot, vis.amp, R, inner, vis.curves);
      const x = cx + Math.sin(theta) * radius;
      const y = cy - Math.cos(theta) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = stroke;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 1;
    ctx.lineWidth = Math.max(0.4, vis.thick * (1.08 - l * 0.13));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
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

const MicIcon = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ display: "block" }}
  >
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M12 18v3" />
  </svg>
);

const StopIcon = () => (
  <svg width={44} height={44} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: "block" }}>
    <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
  </svg>
);

type RoundButtonProps = {
  label: string;
  pressed: boolean;
  onClick: () => void;
  background: string;
  color: string;
  size?: number;
  children: React.ReactNode;
};

function RoundButton({ label, pressed: ariaPressed, onClick, background, color, size = CONTROL, children }: RoundButtonProps) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const focus = useFocusVisible();
  const release = () => setPressed(false);
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={ariaPressed}
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
        width: size,
        height: size,
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
        transform: pressed ? "scale(0.92)" : "scale(1)",
        boxShadow: `${hover ? HOVER_ON : HOVER_OFF}, ${focus.focusVisible ? RING : NO_RING}`,
        transition: "background-color 0.25s ease, color 0.25s ease, box-shadow 0.2s ease, transform 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

export function AiVoice05(props: AiVoice05Props) {
  const {
    status = "idle",
    interactive = true,
    autoFlow = true,
    flowSeconds = 3.5,
    input = "simulated",
    sensitivity = 1.4,
    idleText = "Tap to speak",
    listeningText = "Listening",
    speakingText = "Speaking",
    transcript = true,
    phrases = DEFAULT_PHRASES,
    font = { fontSize: 16, lineHeight: 1.2 },
    textColor = "#EDEDED",
    mutedColor = "#6B6B6B",
    listenColors = DEFAULT_LISTEN,
    speakColors = DEFAULT_SPEAK,
    background = "rgba(255,255,255,0.035)",
    borderColor = "rgba(255,255,255,0.08)",
    radius = 44,
    padding = 16,
    gap = 10,
    curves = 3,
    curveWidth = 1,
    curveAmp = 1,
    curveColor = "#FFFFFF",
    onStart,
    onStop,
    className,
    style,
  } = props;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const visualRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const textEls = React.useRef<(HTMLSpanElement | null)[]>([]);
  const dotEls = React.useRef<(HTMLSpanElement | null)[]>([]);
  const isVisibleRef = React.useRef(true);
  const micRef = React.useRef<Mic | null>(null);
  const micGen = React.useRef(0);
  const prevMode = React.useRef<Status>(status);
  const flowTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = React.useRef(0);

  const [manual, setManual] = React.useState<Status | null>(null);
  const [typed, setTyped] = React.useState("");
  const mode: Status = manual ?? status;

  const listenList = React.useMemo(() => cleanList(listenColors, DEFAULT_LISTEN), [listenColors]);
  const speakList = React.useMemo(() => cleanList(speakColors, DEFAULT_SPEAK), [speakColors]);
  const phraseList = React.useMemo(() => cleanList(phrases, DEFAULT_PHRASES), [phrases]);
  const listenRgb = React.useMemo(() => parseRgb(listenList[0], [124, 243, 255]), [listenList]);
  const speakRgb = React.useMemo(() => parseRgb(speakList[0], [255, 123, 213]), [speakList]);
  const curveCount = Math.max(1, Math.min(4, Math.round(curves)));
  const visBase = React.useMemo(() => parseRgb(curveColor, [255, 255, 255]), [curveColor]);
  const visParams = React.useMemo<VisParams>(
    () => ({ curves: curveCount, thick: curveWidth, amp: curveAmp, rgb: visBase }),
    [curveCount, curveWidth, curveAmp, visBase],
  );
  const visKey = `${curveCount}-${curveWidth}-${curveAmp}`;
  const accent = mode === "speaking" ? speakRgb : listenRgb;

  const liveRef = React.useRef<Live>({
    mode,
    input,
    sens: sensitivity,
    level: 0,
    bands: new Float32Array(BANDS),
    target: new Float32Array(BANDS),
    time: 0,
    phase: 0,
    rot: 0,
    angle: START_ANGLE,
    ringSpeed: 0,
    base: visBase,
    accent,
    vis: visParams,
  });
  React.useLayoutEffect(() => {
    liveRef.current.mode = mode;
    liveRef.current.input = input;
    liveRef.current.sens = sensitivity;
    liveRef.current.base = visBase;
    liveRef.current.accent = accent;
    liveRef.current.vis = visParams;
  });

  const stopMic = () => {
    micGen.current += 1;
    const m = micRef.current;
    micRef.current = null;
    if (m) {
      m.stream.getTracks().forEach((t) => t.stop());
      m.ctx.close().catch(() => undefined);
    }
  };

  const startMic = async () => {
    stopMic();
    const gen = micGen.current;
    const devices = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
    if (!devices || typeof devices.getUserMedia !== "function") return;
    const Ctor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    let ctx: AudioContext | null = null;
    try {
      ctx = new Ctor();
      const stream = await devices.getUserMedia({ audio: true });
      if (gen !== micGen.current) {
        stream.getTracks().forEach((t) => t.stop());
        ctx.close().catch(() => undefined);
        return;
      }
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.6;
      ctx.createMediaStreamSource(stream).connect(analyser);
      micRef.current = { stream, ctx, analyser, data: makeData(analyser.frequencyBinCount) };
    } catch {
      if (ctx) ctx.close().catch(() => undefined);
    }
  };

  const toggle = () => {
    const next: Status = mode === "idle" ? "listening" : "idle";
    setManual(next);
    if (next === "listening" && input === "microphone") void startMic();
    else stopMic();
  };

  const [prevStatus, setPrevStatus] = React.useState(status);
  if (prevStatus !== status) {
    setPrevStatus(status);
    setManual(null);
  }

  React.useEffect(() => {
    if (!autoFlow || input === "microphone" || manual === null) return;
    if (manual === "idle") return;
    if (flowTimerRef.current) clearTimeout(flowTimerRef.current);
    flowTimerRef.current = setTimeout(() => setManual(manual === "listening" ? "speaking" : "idle"), Math.max(0.5, flowSeconds) * 1000);
    return () => {
      if (flowTimerRef.current) clearTimeout(flowTimerRef.current);
    };
  }, [autoFlow, input, manual, flowSeconds]);

  React.useEffect(() => {
    if (mode !== "listening") stopMic();
    const prev = prevMode.current;
    prevMode.current = mode;
    if (prev === "idle" && mode !== "idle") onStart?.();
    else if (prev !== "idle" && mode === "idle") onStop?.();
  }, [mode, onStart, onStop]);

  React.useEffect(() => {
    return () => stopMic();
  }, []);

  const shouldType = mode === "listening" && transcript;
  const [prevShouldType, setPrevShouldType] = React.useState(shouldType);
  if (prevShouldType !== shouldType) {
    setPrevShouldType(shouldType);
    if (!shouldType) setTyped("");
  }

  React.useEffect(() => {
    if (!shouldType) return;
    let p = 0;
    let w = 0;
    let hold = 0;
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    typeTimerRef.current = setInterval(() => {
      if (!isVisibleRef.current) return;
      const words = phraseList[p % phraseList.length].split(" ");
      if (w < words.length) {
        w += 1;
        setTyped(words.slice(0, w).join(" "));
      } else if (hold < 8) {
        hold += 1;
      } else {
        p += 1;
        w = 0;
        hold = 0;
        setTyped("");
      }
    }, 210);
    return () => {
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    };
  }, [shouldType, phraseList]);

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
    const wrap = visualRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;
    if (!wrap) return;

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
    };
    const draw = () => {
      if (!ctx || w <= 0 || h <= 0) return;
      visDraw(ctx, w, h, liveRef.current);
    };
    const updateDom = (L: Live) => {
      const t = L.time;
      const pos = 100 - 100 * ((t / 2.4) % 1);
      for (const node of textEls.current) if (node) node.style.backgroundPosition = `${pos.toFixed(2)}% 50%`;
      for (let i = 0; i < dotEls.current.length; i++) {
        const node = dotEls.current[i];
        if (!node) continue;
        const d = i % DOTS;
        node.style.opacity = (0.2 + 0.7 * (0.5 + 0.5 * Math.sin(t * 4.2 - d * 0.9))).toFixed(3);
      }
    };

    fit();
    const ro = new ResizeObserver(() => {
      fit();
      draw();
    });
    ro.observe(wrap);

    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const L = liveRef.current;
      simulateBands(1.2, L.mode === "idle" ? "listening" : L.mode, L.bands);
      L.level = 0.3;
      draw();
      return () => ro.disconnect();
    }

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (isVisibleRef.current) {
        const L = liveRef.current;
        L.time += dt;
        updateAudio(L, micRef.current, dt);
        L.phase += dt * (1 + 1.6 * L.level);
        L.rot += dt * 0.45 * (1 + L.level);
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
  }, [visKey]);

  const typography: React.CSSProperties = {
    fontFamily: FONT_FALLBACK,
    lineHeight: 1.2,
    ...font,
    margin: 0,
  };

  const items = [
    { text: idleText, dots: false },
    { text: typed || listeningText, dots: false },
    { text: speakingText, dots: true },
  ];
  const cur = mode === "idle" ? 0 : mode === "listening" ? 1 : 2;
  const shimmerGradient = `linear-gradient(90deg, ${mutedColor} 0%, ${mutedColor} 32%, ${textColor} 50%, ${mutedColor} 68%, ${mutedColor} 100%)`;
  const statusLabel = mode === "idle" ? idleText : mode === "listening" ? typed || listeningText : speakingText;

  const visualNode = (
    <div ref={visualRef} aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
      <canvas ref={canvasRef} style={{ position: "relative", width: "100%", height: "100%", display: "block" }} />
    </div>
  );

  const textNode = (
    <div aria-hidden="true" style={{ display: "flex", alignItems: "center", overflow: "hidden", flex: "none", width: "100%", justifyContent: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", width: "100%", minWidth: 0 }}>
        {items.map((item, i) => {
          const on = i === cur;
          return (
            <div
              key={i}
              style={{
                gridArea: "1 / 1",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                minWidth: 0,
                opacity: on ? 1 : 0,
                transform: on ? "translateY(0px)" : "translateY(6px)",
                transition: `opacity 0.45s ease, transform 0.45s ${EASE}`,
              }}
            >
              <span
                ref={(el) => {
                  textEls.current[i] = el;
                }}
                style={{
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
                }}
              >
                {item.text}
              </span>
              {item.dots && (
                <span style={{ ...typography, display: "flex", flex: "none", color: textColor, marginLeft: 1 }}>
                  {Array.from({ length: DOTS }, (_, d) => (
                    <span
                      key={d}
                      ref={(el) => {
                        dotEls.current[i * DOTS + d] = el;
                      }}
                      style={{ opacity: 0.55 }}
                    >
                      .
                    </span>
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const buttonNode = interactive ? (
    <RoundButton
      label={mode === "idle" ? "Start voice input" : "Stop voice input"}
      pressed={mode !== "idle"}
      onClick={toggle}
      size={mode === "idle" ? 64 : 62}
      background={mode === "idle" ? "rgba(255,255,255,0.08)" : "#F4F4F5"}
      color={mode === "idle" ? textColor : "#111113"}
    >
      {mode === "idle" ? <MicIcon /> : <StopIcon />}
    </RoundButton>
  ) : null;

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Voice assistant"
      aria-busy={mode === "listening"}
      itemScope
      itemType="https://schema.org/SoftwareApplication"
      className={cn("relative flex h-full w-full flex-col items-center justify-center overflow-hidden", className)}
      style={{
        ...style,
        gap,
        boxSizing: "border-box",
        padding,
        borderRadius: radius,
        background,
        border: `1px solid ${borderColor}`,
      }}
    >
      <meta itemProp="name" content="AI Voice Assistant" />
      <meta itemProp="applicationCategory" content="MultimediaApplication" />
      <meta itemProp="description" content="Interactive AI voice assistant interface with idle, listening, and speaking states." />
      <meta itemProp="operatingSystem" content="Web" />
      <h2 style={SR_ONLY}>AI Voice Assistant</h2>
      <p style={SR_ONLY}>Tap the microphone to start voice input. Status updates as the assistant listens and speaks.</p>
      <span role="status" aria-live="polite" style={SR_ONLY}>
        {statusLabel}
      </span>

      <div style={{ position: "relative", flex: 1, minHeight: 0, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {visualNode}
        <div style={{ position: "relative" }}>{buttonNode}</div>
      </div>
      {textNode}
    </div>
  );
}
