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
type ThemeName = "custom" | "silver";

export interface AiVoice01Props {
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
  theme?: ThemeName;
  onStart?: () => void;
  onStop?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const TAU = Math.PI * 2;
const BANDS = 32;
const DOTS = 3;
const CONTROL = 44;
const START_ANGLE = 40;
const STATIC_SHIMMER = 72;
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const FONT_FALLBACK = "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const HAIRLINE = "rgba(255,255,255,0.14)";
const HOVER_ON = "inset 0 0 0 999px rgba(255,255,255,0.06)";
const HOVER_OFF = "inset 0 0 0 999px rgba(255,255,255,0)";
const RING = "0 0 0 2px rgba(255,255,255,0.35)";
const NO_RING = "0 0 0 0 rgba(255,255,255,0)";
const SILVER_EDGE =
  "linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.12) 38%, rgba(255,255,255,0.06) 62%, rgba(255,255,255,0.5))";
const SILVER_SHEEN =
  "linear-gradient(115deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 28%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.05) 72%, rgba(255,255,255,0) 100%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0) 60%)";
const MIC_FALLBACK = "Microphone unavailable";

const DEFAULT_PHRASES = ["What's the weather like today?", "Book a table for two tonight", "Summarize my last meeting"];
const DEFAULT_LISTEN = ["#7CF3FF", "#6EA8FF", "#9B7BFF"];
const DEFAULT_SPEAK = ["#FF7BD5", "#FFB86B", "#F5C84C"];
const SILVER_GLOW = ["#FFFFFF", "#E4E7EB", "#A7AEB8", "#F5F6F8", "#8E959F"];
const SILVER_SPEAK = ["#F5F6F8", "#D9DCE1", "#A7AEB8", "#FFFFFF", "#8E959F"];

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
  aura: number;
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

function cleanList(list: string[] | undefined, fallback: string[]) {
  const out = (list ?? []).filter((s): s is string => typeof s === "string" && s.trim() !== "");
  return out.length ? out : fallback;
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

const CURVE_POINTS = 96;
const REST_GAP = 3;

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
) {
  const dir = l % 2 === 0 ? 1 : -1;
  const f = Math.abs(Math.sin((theta + rot * 0.3 * dir) / 2));
  const bf = f * (bands.length - 1);
  const i0 = Math.floor(bf);
  const i1 = Math.min(bands.length - 1, i0 + 1);
  const band = bands[i0] + (bands[i1] - bands[i0]) * (bf - i0);
  const energy = 0.04 + band * 0.96 + level * 0.18;
  const wave = 0.5 + 0.5 * Math.sin((3 + l) * theta + phase * (1.1 + l * 0.5) * dir + l * 1.9);
  const base = inner + 0.03 * l;
  return R * Math.min(0.98, base + (0.98 - base) * 0.5 * energy * wave * amp);
}

function visDraw(ctx: CanvasRenderingContext2D, w: number, h: number, L: Live) {
  const { curves, thick, amp, rgb } = L.vis;
  const [ar, ag, ab] = L.accent;
  const [br, bg, bb] = rgb;
  const cx = w / 2;
  const cy = h / 2;
  const R = (Math.min(w, h) / 2) * 0.98;
  const inner = innerFrac(R);
  const bands = smoothBands(L.bands);
  ctx.globalCompositeOperation = "lighter";
  ctx.lineJoin = "round";
  for (let l = 0; l < curves; l++) {
    ctx.beginPath();
    for (let i = 0; i <= CURVE_POINTS; i++) {
      const theta = (i / CURVE_POINTS) * TAU;
      const r = curveRadius(l, theta, bands, L.level, L.phase, L.rot, amp, R, inner);
      const x = cx + Math.sin(theta) * r;
      const y = cy - Math.cos(theta) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    const a = Math.max(0.3, 0.95 - l * 0.22);
    let stroke: string | CanvasGradient = `rgba(${ar},${ag},${ab},${a.toFixed(2)})`;
    if (typeof ctx.createConicGradient === "function") {
      const g = ctx.createConicGradient(L.rot * 0.5 * (l % 2 === 0 ? 1 : -1) - Math.PI / 2, cx, cy);
      g.addColorStop(0, `rgba(${br},${bg},${bb},${a.toFixed(2)})`);
      g.addColorStop(0.35, `rgba(${ar},${ag},${ab},${(a * 0.9).toFixed(2)})`);
      g.addColorStop(0.65, `rgba(${ar},${ag},${ab},${(a * 0.35).toFixed(2)})`);
      g.addColorStop(1, `rgba(${br},${bg},${bb},${a.toFixed(2)})`);
      stroke = g;
    }
    ctx.strokeStyle = stroke;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = (5 - l * 0.8) * thick;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = Math.max(1, (2.2 - l * 0.4) * thick);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
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
    focusable="false"
    style={{ display: "block" }}
  >
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M12 18v3" />
  </svg>
);
const StopIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" style={{ display: "block" }}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
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

function RoundButton({ label, pressed: isOn, onClick, background, color, size = CONTROL, children }: RoundButtonProps) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const focus = useFocusVisible();
  const release = () => setPressed(false);
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isOn}
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

export function AiVoice01(props: AiVoice01Props) {
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
    ringIntensity = 0.7,
    ringSize = 10,
    ringSpeed = 40,
    background = "rgba(255,255,255,0.035)",
    borderColor = "rgba(255,255,255,0.08)",
    radius = 999,
    padding = 10,
    gap = 12,
    curves = 3,
    curveWidth = 1,
    curveAmp = 1,
    curveColor = "#FFFFFF",
    theme = "custom",
    onStart,
    onStop,
    className,
    style,
  } = props;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const visualRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const ringListenRef = React.useRef<HTMLDivElement>(null);
  const ringSpeakRef = React.useRef<HTMLDivElement>(null);
  const textEls = React.useRef<(HTMLSpanElement | null)[]>([]);
  const dotEls = React.useRef<(HTMLSpanElement | null)[]>([]);
  const isVisibleRef = React.useRef(true);
  const micRef = React.useRef<Mic | null>(null);
  const micGen = React.useRef(0);
  const flowTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = React.useRef(0);
  const prevMode = React.useRef<Status>(status);

  const [manual, setManual] = React.useState<Status | null>(null);
  const [typed, setTyped] = React.useState("");
  const [micError, setMicError] = React.useState("");
  const mode: Status = manual ?? status;

  const isSilver = theme === "silver";

  const resolvedText = isSilver ? "#E4E6EA" : textColor;
  const resolvedMuted = isSilver ? "#6F747B" : mutedColor;
  const resolvedBg = isSilver ? "#1B1C1E" : background;
  const resolvedBorder = isSilver ? "rgba(255,255,255,0.08)" : borderColor;
  const resolvedCurve = isSilver ? "#F2F4F7" : curveColor;
  const idleBtnBg = isSilver ? "#2A2C2F" : "rgba(255,255,255,0.08)";
  const stopBtnFg = isSilver ? "#141414" : "#0E0E10";

  const listenList = React.useMemo(() => cleanList(isSilver ? SILVER_GLOW : listenColors, DEFAULT_LISTEN), [isSilver, listenColors]);
  const speakList = React.useMemo(() => cleanList(isSilver ? SILVER_SPEAK : speakColors, DEFAULT_SPEAK), [isSilver, speakColors]);
  const phraseList = React.useMemo(() => cleanList(phrases, DEFAULT_PHRASES), [phrases]);
  const listenGradient = React.useMemo(() => buildGradient(listenList, 0.55), [listenList]);
  const speakGradient = React.useMemo(() => buildGradient(speakList, 0.55), [speakList]);
  const listenRgb = React.useMemo(() => parseRgb(listenList[0], [124, 243, 255]), [listenList]);
  const speakRgb = React.useMemo(() => parseRgb(speakList[0], [255, 123, 213]), [speakList]);
  const curveCount = Math.max(1, Math.min(4, Math.round(curves)));
  const visBase = React.useMemo(() => parseRgb(resolvedCurve, [255, 255, 255]), [resolvedCurve]);
  const visParams = React.useMemo<VisParams>(
    () => ({ curves: curveCount, thick: curveWidth, amp: curveAmp, rgb: visBase }),
    [curveCount, curveWidth, curveAmp, visBase],
  );
  const visKey = `${curveCount}`;
  const accent = mode === "speaking" ? speakRgb : listenRgb;
  const liveInput: InputSource = input === "microphone" && !micError ? "microphone" : "simulated";

  const liveRef = React.useRef<Live>({
    mode,
    input: liveInput,
    sens: sensitivity,
    level: 0,
    bands: new Float32Array(BANDS),
    target: new Float32Array(BANDS),
    time: 0,
    phase: 0,
    rot: 0,
    angle: START_ANGLE,
    ringSpeed,
    aura: 0,
    base: visBase,
    accent,
    vis: visParams,
  });
  React.useLayoutEffect(() => {
    liveRef.current.mode = mode;
    liveRef.current.input = liveInput;
    liveRef.current.sens = sensitivity;
    liveRef.current.ringSpeed = ringSpeed;
    liveRef.current.aura = 0;
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
    setMicError("");
    const gen = micGen.current;
    const devices = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
    if (!devices || typeof devices.getUserMedia !== "function") {
      setMicError(MIC_FALLBACK);
      return;
    }
    const Ctor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) {
      setMicError(MIC_FALLBACK);
      return;
    }
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
      setMicError("");
    } catch {
      if (ctx) ctx.close().catch(() => undefined);
      if (gen === micGen.current) setMicError(MIC_FALLBACK);
    }
  };

  const toggle = () => {
    const next: Status = mode === "idle" ? "listening" : "idle";
    setManual(next);
    if (next === "idle") {
      setMicError("");
      stopMic();
      return;
    }
    if (input === "microphone") void startMic();
    else stopMic();
  };

  const [prevExternal, setPrevExternal] = React.useState({ status, input });
  if (prevExternal.status !== status || prevExternal.input !== input) {
    setPrevExternal({ status, input });
    setManual(null);
    setMicError("");
  }

  React.useEffect(() => {
    if (!autoFlow || input === "microphone" || manual === null) return;
    if (manual === "idle") return;
    if (flowTimerRef.current) clearTimeout(flowTimerRef.current);
    flowTimerRef.current = setTimeout(
      () => {
        setManual(manual === "listening" ? "speaking" : "idle");
      },
      Math.max(0.5, flowSeconds) * 1000,
    );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  React.useEffect(() => {
    return () => {
      stopMic();
      if (flowTimerRef.current) clearTimeout(flowTimerRef.current);
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const shouldType = mode === "listening" && transcript && !micError;
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
    const root = rootRef.current;
    const wrap = visualRef.current;
    const canvas = canvasRef.current;
    if (!root || !wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let last = performance.now();

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = Math.max(2, Math.round(w * dpr));
      canvas.height = Math.max(2, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      if (w <= 0 || h <= 0) return;
      ctx.clearRect(0, 0, w, h);
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
      const ringOpacity = (0.3 + 0.7 * L.level).toFixed(3);
      if (ringListenRef.current) ringListenRef.current.style.opacity = ringOpacity;
      if (ringSpeakRef.current) ringSpeakRef.current.style.opacity = ringOpacity;
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
      root.style.setProperty("--gl-angle", `${START_ANGLE}deg`);
      draw();
      return () => ro.disconnect();
    }

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (isVisibleRef.current) {
        const L = liveRef.current;
        L.time += dt;
        L.angle = (L.angle + L.ringSpeed * (L.mode === "idle" ? 0.5 : 1) * dt) % 360;
        updateAudio(L, micRef.current, dt);
        L.phase += dt * (1 + 1.6 * L.level);
        L.rot += dt * 0.45 * (1 + L.level);
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
  }, [visKey]);

  const typography: React.CSSProperties = {
    fontFamily: FONT_FALLBACK,
    lineHeight: 1.2,
    ...font,
    margin: 0,
  };

  const listenLabel = micError ? MIC_FALLBACK : typed || listeningText;
  const items = [
    { text: idleText, dots: false },
    { text: listenLabel, dots: false },
    { text: speakingText, dots: true },
  ];
  const cur = mode === "idle" ? 0 : mode === "listening" ? 1 : 2;
  const liveLabel = mode === "idle" ? idleText : mode === "listening" ? listenLabel : speakingText;
  const shimmerGradient = `linear-gradient(90deg, ${resolvedMuted} 0%, ${resolvedMuted} 32%, ${resolvedText} 50%, ${resolvedMuted} 68%, ${resolvedMuted} 100%)`;
  const softRing = Math.max(2, Math.min(18, ringSize * 0.45));
  const softBlur = ringSize * 0.7;

  const ringLayer = (active: boolean, gradient: string, ref: { current: HTMLDivElement | null }) => (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        pointerEvents: "none",
        opacity: active ? ringIntensity : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <div ref={ref} style={{ position: "absolute", inset: 0, borderRadius: "inherit", opacity: 0.55 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", filter: `blur(${softBlur}px)` }}>
          <div style={{ ...ringStyle(softRing), background: gradient }} />
        </div>
        <div style={{ ...ringStyle(1.5), background: gradient }} />
      </div>
    </div>
  );

  const visualNode = (
    <div ref={visualRef} aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
      <canvas ref={canvasRef} style={{ position: "relative", width: "100%", height: "100%", display: "block" }} />
    </div>
  );

  const textNode = (
    <div style={{ display: "flex", alignItems: "center", overflow: "hidden", flex: 1, minWidth: 0 }}>
      <p style={{ ...typography, ...SR_ONLY, color: resolvedText, WebkitTextFillColor: resolvedText }}>Voice assistant. {liveLabel}</p>
      <div aria-hidden="true" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", width: "100%", minWidth: 0 }}>
        {items.map((item, i) => {
          const on = i === cur;
          return (
            <div
              key={i}
              style={{
                gridArea: "1 / 1",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "flex-start",
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
                <span style={{ ...typography, display: "flex", flex: "none", color: resolvedText, marginLeft: 1 }}>
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
      size={44}
      background={mode === "idle" ? idleBtnBg : resolvedText}
      color={mode === "idle" ? resolvedText : stopBtnFg}
    >
      {mode === "idle" ? <MicIcon /> : <StopIcon />}
    </RoundButton>
  ) : null;

  return (
    <div className={cn("relative flex h-full w-full flex-col overflow-hidden", className)} style={style}>
      <div
        ref={rootRef}
        role="region"
        aria-label="Voice assistant"
        aria-busy={mode !== "idle"}
        style={{
          position: "relative",
          display: "flex",
          gap,
          boxSizing: "border-box",
          width: "100%",
          flex: 1,
          minHeight: 0,
          padding,
          overflow: "hidden",
          borderRadius: radius,
          background: resolvedBg,
          backgroundImage: isSilver ? SILVER_SHEEN : "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0) 60%)",
          border: `1px solid ${resolvedBorder}`,
          boxShadow: isSilver ? "inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.22)" : undefined,
          backdropFilter: isSilver ? "none" : "blur(14px)",
          WebkitBackdropFilter: isSilver ? "none" : "blur(14px)",
          alignItems: "center",
        }}
      >
        <span role="status" aria-live="polite" aria-atomic="true" style={SR_ONLY}>
          {liveLabel}
        </span>

        {ringLayer(mode === "listening", listenGradient, ringListenRef)}
        {ringLayer(mode === "speaking", speakGradient, ringSpeakRef)}
        {isSilver && <div aria-hidden="true" style={{ ...ringStyle(1), background: SILVER_EDGE, opacity: 0.85, pointerEvents: "none" }} />}

        <div style={{ position: "relative", flex: "none", height: "100%", aspectRatio: "1 / 1" }}>
          {visualNode}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{buttonNode}</div>
        </div>
        {textNode}
      </div>
    </div>
  );
}
