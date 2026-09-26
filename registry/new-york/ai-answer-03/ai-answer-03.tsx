"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RGB = [number, number, number];
type Phase = "searching" | "writing" | "done";
type Preview = "auto" | Phase;
type Vote = "up" | "down" | null;
type Source = { title: string; domain: string };
type Tok = { text: string; bold: boolean; cite: string | null; punct: string };
type Block = { kind: "p" | "li"; words: Tok[] };
type ThemeName = "custom" | "sunset";

export interface AiAnswer03Props {
  preview?: Preview;
  autoPlay?: boolean;
  loop?: boolean;
  loopDelay?: number;
  stepSeconds?: number;
  wordsPerSecond?: number;
  showQuestion?: boolean;
  question?: string;
  showSteps?: boolean;
  steps?: string[];
  answer?: string;
  showSources?: boolean;
  sources?: Source[];
  showActions?: boolean;
  showFollowUps?: boolean;
  followUps?: string[];
  showTimer?: boolean;
  searchingText?: string;
  writingText?: string;
  doneText?: string;
  lang?: string;
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
  theme?: ThemeName;
  onComplete?: () => void;
  onStop?: () => void;
  onRegenerate?: () => void;
  onCopy?: () => void;
  onFollowUp?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const DOTS = 3;
const START_ANGLE = 40;
const STATIC_SHIMMER = 72;
const TAIL = 6;
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const FONT_FALLBACK = "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const HAIRLINE = "rgba(255,255,255,0.14)";
const HOVER_ON = "inset 0 0 0 999px rgba(255,255,255,0.07)";
const HOVER_OFF = "inset 0 0 0 999px rgba(255,255,255,0)";
const RING = "0 0 0 2px rgba(255,255,255,0.35)";
const NO_RING = "0 0 0 0 rgba(255,255,255,0)";
const CITE = /^\[(\d{1,2})\]([.,;:!?]*)$/;
const WHITE: RGB = [255, 255, 255];

const DEFAULT_QUESTION = "What makes a Framer component feel premium?";
const DEFAULT_STEPS = ["Searching", "Reading sources", "Writing"];
const DEFAULT_ANSWER =
  "Premium UI is mostly **restraint**. The best components stay calm until you touch them.\n- **Quiet surfaces.** Dark glass, hairline borders and a single accent colour [1].\n- **Purposeful motion.** Animate only what needs attention, like a shimmer while the model works [2].\n- **Cheap to run.** Pause off screen, honour reduced motion and clean up every timer [3].";
const DEFAULT_SOURCES: Source[] = [
  { title: "Building performant code components", domain: "framer.com" },
  { title: "prefers-reduced-motion", domain: "developer.mozilla.org" },
  { title: "Optimize animations", domain: "web.dev" },
];
const DEFAULT_FOLLOWUPS = ["Show me an example", "How do I test it?"];
const DEFAULT_GLOW = ["#7CF3FF", "#6EA8FF", "#9B7BFF", "#FF7BD5", "#FFB86B"];
const SUNSET_GLOW = ["#FFB86B", "#FF7BD5", "#9B7BFF"];

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
  energy: number;
  time: number;
  spin: number;
  angle: number;
  ringSpeed: number;
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

function sourceHref(domain: string) {
  const d = domain.trim();
  if (!d) return "";
  if (/^https?:\/\//i.test(d)) return d;
  return `https://${d}`;
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

function parseAnswer(text: string): Block[] {
  const blocks: Block[] = [];
  for (const line of (text || "").split(/\n+/)) {
    let src = line.trim();
    if (!src) continue;
    let kind: Block["kind"] = "p";
    if (/^[-•]\s+/.test(src)) {
      kind = "li";
      src = src.replace(/^[-•]\s+/, "");
    }
    const words: Tok[] = [];
    let bold = false;
    for (const raw of src.split(/\s+/).filter(Boolean)) {
      let t = raw;
      if (t.startsWith("**")) {
        bold = true;
        t = t.slice(2);
      }
      const close = t.match(/\*\*([.,;:!?)"']*)$/);
      const ends = close !== null;
      if (close) t = t.slice(0, t.length - close[0].length) + close[1];
      if (t) {
        const m = t.match(CITE);
        words.push({
          text: t,
          bold,
          cite: m ? m[1] : null,
          punct: m ? m[2] : "",
        });
      }
      if (ends) bold = false;
    }
    if (words.length) blocks.push({ kind, words });
  }
  return blocks;
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

type IconProps = { size?: number; flip?: boolean; children: React.ReactNode };

function Icon({ size = 15, flip = false, children }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "block", transform: flip ? "scaleY(-1)" : "none" }}
    >
      {children}
    </svg>
  );
}

const CopyIcon = () => (
  <Icon>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </Icon>
);
const CheckIcon = ({ size = 15, width = 2 }: { size?: number; width?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ display: "block" }}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const ThumbIcon = ({ flip = false }: { flip?: boolean }) => (
  <Icon flip={flip}>
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
  </Icon>
);
const RefreshIcon = () => (
  <Icon>
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </Icon>
);

const ReplyIcon = () => (
  <Icon size={13}>
    <path d="m15 10 5 5-5 5" />
    <path d="M4 4v7a4 4 0 0 0 4 4h12" />
  </Icon>
);
const StopIcon = () => (
  <svg width={10} height={10} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: "block" }}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
  </svg>
);

function Spark({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <path
        d="M12 1.5c.7 6.1 4.4 9.8 10.5 10.5-6.1.7-9.8 4.4-10.5 10.5-.7-6.1-4.4-9.8-10.5-10.5C7.6 11.3 11.3 7.6 12 1.5Z"
        fill={color}
      />
    </svg>
  );
}

type IconButtonProps = {
  label: string;
  onClick: () => void;
  color: string;
  activeColor: string;
  toggled?: boolean;
  children: React.ReactNode;
};

function IconButton({ label, onClick, color, activeColor, toggled, children }: IconButtonProps) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const focus = useFocusVisible();
  const release = () => setPressed(false);
  const on = toggled === true;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={toggled}
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
        width: 30,
        height: 30,
        flex: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: "1px solid transparent",
        background: on ? "rgba(255,255,255,0.12)" : "transparent",
        color: on || hover ? activeColor : color,
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

type PillButtonProps = {
  label: string;
  onClick: () => void;
  style: React.CSSProperties;
  color: string;
  icon?: React.ReactNode;
};

function PillButton({ label, onClick, style, color, icon }: PillButtonProps) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const focus = useFocusVisible();
  const release = () => setPressed(false);
  return (
    <button
      type="button"
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
        flex: "none",
        maxWidth: "100%",
        height: 30,
        margin: 0,
        padding: "0 13px 0 11px",
        display: "flex",
        alignItems: "center",
        gap: 7,
        borderRadius: 999,
        border: `1px solid ${HAIRLINE}`,
        background: "rgba(255,255,255,0.04)",
        color,
        cursor: "pointer",
        outline: "none",
        whiteSpace: "nowrap",
        transform: pressed ? "scale(0.96)" : "scale(1)",
        boxShadow: `${hover ? HOVER_ON : HOVER_OFF}, ${focus.focusVisible ? RING : NO_RING}`,
        transition: "box-shadow 0.2s ease, transform 0.15s ease",
      }}
    >
      {icon}
      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
    </button>
  );
}

export function AiAnswer03(props: AiAnswer03Props) {
  const {
    preview = "auto",
    autoPlay = true,
    loop = true,
    loopDelay = 3.5,
    stepSeconds = 0.9,
    wordsPerSecond = 12,
    showQuestion = true,
    question = DEFAULT_QUESTION,
    showSteps = true,
    steps = DEFAULT_STEPS,
    answer = DEFAULT_ANSWER,
    showSources = true,
    sources = DEFAULT_SOURCES,
    showActions = true,
    showFollowUps = true,
    followUps = DEFAULT_FOLLOWUPS,
    showTimer = true,
    searchingText = "Researching",
    writingText = "Writing",
    doneText = "Answer",
    lang = "en",
    font = { fontSize: 15, lineHeight: 1.6 },
    textColor = "#EDEDED",
    mutedColor = "#6B6B6B",
    glowColors = DEFAULT_GLOW,
    ringIntensity = 0.45,
    ringSize = 8,
    ringSpeed = 40,
    background = "rgba(255,255,255,0.035)",
    borderColor = "rgba(255,255,255,0.08)",
    radius = 28,
    padding = 22,
    gap = 14,
    theme = "custom",
    onComplete,
    onStop,
    onRegenerate,
    onCopy,
    onFollowUp,
    className,
    style,
  } = props;

  const answerId = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const sparkRef = React.useRef<HTMLDivElement>(null);
  const ringInnerRef = React.useRef<HTMLDivElement>(null);
  const caretRef = React.useRef<HTMLSpanElement>(null);
  const shimmerEls = React.useRef<(HTMLElement | null)[]>([]);
  const dotEls = React.useRef<(HTMLSpanElement | null)[]>([]);
  const pulseEls = React.useRef<(HTMLSpanElement | null)[]>([]);
  const isVisibleRef = React.useRef(true);
  const startRef = React.useRef(0);
  const countRef = React.useRef(0);
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const writeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const clockTimer = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const loopTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = React.useRef(0);
  const prevPhase = React.useRef<Phase>(autoPlay ? "searching" : "done");

  const [phase, setPhase] = React.useState<Phase>(autoPlay ? "searching" : "done");
  const [step, setStep] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [run, setRun] = React.useState(0);
  const [stopped, setStopped] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [vote, setVote] = React.useState<Vote>(null);
  const [secs, setSecs] = React.useState(0);
  const reduce = React.useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);

  const isSunset = theme === "sunset";
  const resolvedText = isSunset ? "#DADADA" : textColor;

  const blocks = React.useMemo(() => parseAnswer(answer), [answer]);
  const flat = React.useMemo(() => blocks.flatMap((b) => b.words), [blocks]);
  const total = flat.length;
  const offsets = React.useMemo(() => {
    const result: number[] = [];
    let n = 0;
    for (const b of blocks) {
      result.push(n);
      n += b.words.length;
    }
    return result;
  }, [blocks]);
  const stepList = React.useMemo(() => cleanList(steps, []), [steps]);
  const nSteps = Math.max(1, stepList.length);
  const sourceList = React.useMemo(
    () => (sources ?? []).filter((s): s is Source => !!s && ((s.title ?? "").trim() !== "" || (s.domain ?? "").trim() !== "")),
    [sources],
  );
  const followList = React.useMemo(() => cleanList(followUps, []), [followUps]);
  const glowList = React.useMemo(() => cleanList(isSunset ? SUNSET_GLOW : glowColors, DEFAULT_GLOW), [isSunset, glowColors]);
  const glowGradient = React.useMemo(() => buildGradient(glowList, 0.55), [glowList]);
  const accent = React.useMemo(() => parseRgb(glowList[0], [255, 184, 107]), [glowList]);
  const accent2 = React.useMemo(() => parseRgb(glowList[1] ?? glowList[0], [255, 123, 213]), [glowList]);
  const textRgb = React.useMemo(() => parseRgb(resolvedText, [218, 218, 218]), [resolvedText]);
  const boldRgb = React.useMemo(() => mixRgb(textRgb, WHITE, 0.6), [textRgb]);
  const dimRgb = React.useMemo(() => mixRgb(parseRgb(mutedColor, [107, 107, 107]), textRgb, 0.55), [mutedColor, textRgb]);
  const dimColor = `rgb(${dimRgb.join(",")})`;
  const railGradient = `linear-gradient(90deg, ${glowList.join(", ")})`;

  const plainAnswer = React.useMemo(
    () =>
      blocks
        .map((b) => (b.kind === "li" ? "- " : "") + b.words.map((w) => (w.cite ? `[${w.cite}]${w.punct}` : w.text)).join(" "))
        .join("\n"),
    [blocks],
  );

  const fixed: Phase | null = preview !== "auto" ? preview : null;
  const shownPhase: Phase = fixed ?? (reduce ? "done" : phase);
  let shownCount = count;
  if (fixed === "searching") shownCount = 0;
  else if (fixed === "writing") shownCount = Math.max(1, Math.round(total * 0.55));
  else if (shownPhase === "done" && !stopped) shownCount = total;
  let shownStep = step;
  if (shownPhase === "done") shownStep = nSteps;
  else if (shownPhase === "writing") shownStep = nSteps - 1;
  else if (fixed === "searching") shownStep = Math.min(nSteps - 1, Math.floor(nSteps / 2));

  const estimate = stepSeconds * (nSteps - 1) + total / Math.max(1, wordsPerSecond);
  const wps = Math.max(1, wordsPerSecond);
  let timerValue = secs;
  if (fixed === "searching") timerValue = stepSeconds * 1.5;
  else if (fixed === "writing") timerValue = stepSeconds * (nSteps - 1) + (total * 0.55) / wps;
  else if (fixed === "done" || reduce) timerValue = estimate;

  let railPct = 100;
  if (shownPhase === "searching") railPct = ((shownStep + 0.45) / nSteps) * 100;
  else if (shownPhase === "writing") railPct = ((nSteps - 1 + (total ? shownCount / total : 1)) / nSteps) * 100;

  const liveRef = React.useRef<Live>({
    phase: shownPhase,
    energy: shownPhase === "done" ? 0.05 : 1,
    time: 0,
    spin: 0,
    angle: START_ANGLE,
    ringSpeed,
  });
  React.useLayoutEffect(() => {
    countRef.current = count;
    liveRef.current.phase = shownPhase;
    liveRef.current.ringSpeed = ringSpeed;
  });

  // Prop/state-driven reset, done during render rather than in an effect: no
  // DOM work is needed here, just adjusting local state to match a changed input.
  const resetKey = `${String(fixed)}|${reduce}|${autoPlay}|${run}`;
  const [prevResetKey, setPrevResetKey] = React.useState(resetKey);
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    if (fixed === null && !reduce) {
      setStopped(false);
      setCount(0);
      setStep(0);
      setVote(null);
      setCopied(false);
      setSecs(0);
      setPhase(!autoPlay && run === 0 ? "done" : "searching");
    }
  }

  React.useEffect(() => {
    if (fixed !== null || reduce) return;
    if (!autoPlay && run === 0) return;
    startRef.current = performance.now();
    const ms = Math.max(0.2, stepSeconds) * 1000;
    let s = 0;
    const advance = () => {
      s += 1;
      if (s >= nSteps - 1) {
        setStep(nSteps - 1);
        setPhase("writing");
        return;
      }
      setStep(s);
      if (stepTimer.current) clearTimeout(stepTimer.current);
      stepTimer.current = setTimeout(advance, ms);
    };
    if (stepTimer.current) clearTimeout(stepTimer.current);
    stepTimer.current = setTimeout(advance, ms);
    return () => {
      if (stepTimer.current) clearTimeout(stepTimer.current);
    };
  }, [fixed, reduce, autoPlay, run, stepSeconds, nSteps]);

  React.useEffect(() => {
    if (fixed !== null || reduce || phase !== "writing" || stopped) return;
    let n = countRef.current;
    const period = 1000 / Math.max(1, wordsPerSecond);
    const stepFn = () => {
      if (!isVisibleRef.current) {
        if (writeTimer.current) clearTimeout(writeTimer.current);
        writeTimer.current = setTimeout(stepFn, 200);
        return;
      }
      n += 1;
      setCount(n);
      if (n >= total) {
        setPhase("done");
        return;
      }
      const w = flat[n - 1].text + flat[n - 1].punct;
      const jitter = 0.7 + 0.6 * Math.abs(Math.sin(n * 12.9898));
      const pause = /[.!?]$/.test(w) ? 4 : /[,;:]$/.test(w) ? 1.5 : jitter;
      if (writeTimer.current) clearTimeout(writeTimer.current);
      writeTimer.current = setTimeout(stepFn, period * pause);
    };
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(stepFn, period);
    return () => {
      if (writeTimer.current) clearTimeout(writeTimer.current);
    };
  }, [fixed, reduce, phase, stopped, wordsPerSecond, total, flat]);

  React.useEffect(() => {
    if (fixed !== null || reduce || phase === "done") return;
    if (clockTimer.current) clearInterval(clockTimer.current);
    clockTimer.current = setInterval(() => {
      if (isVisibleRef.current) setSecs((performance.now() - startRef.current) / 1000);
    }, 100);
    return () => {
      if (clockTimer.current) clearInterval(clockTimer.current);
    };
  }, [fixed, reduce, phase, run]);

  React.useEffect(() => {
    const prev = prevPhase.current;
    prevPhase.current = phase;
    if (fixed !== null || reduce) return;
    if (prev === "writing" && phase === "done") {
      setSecs((performance.now() - startRef.current) / 1000);
      if (stopped) onStop?.();
      else onComplete?.();
    }
  }, [phase, fixed, reduce, stopped, onStop, onComplete]);

  React.useEffect(() => {
    if (fixed !== null || reduce || !autoPlay || !loop) return;
    if (phase !== "done" || stopped) return;
    if (loopTimer.current) clearTimeout(loopTimer.current);
    loopTimer.current = setTimeout(() => setRun((r) => r + 1), Math.max(0.5, loopDelay) * 1000);
    return () => {
      if (loopTimer.current) clearTimeout(loopTimer.current);
    };
  }, [fixed, reduce, autoPlay, loop, phase, stopped, loopDelay]);

  React.useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
      if (stepTimer.current) clearTimeout(stepTimer.current);
      if (writeTimer.current) clearTimeout(writeTimer.current);
      if (clockTimer.current) clearInterval(clockTimer.current);
      if (loopTimer.current) clearTimeout(loopTimer.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  React.useEffect(() => {
    const el = bodyRef.current;
    if (!el || shownPhase !== "writing" || fixed !== null) return;
    if (el.scrollHeight > el.clientHeight) el.scrollTop = el.scrollHeight;
  }, [count, shownPhase, fixed]);

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
    if (!root) return;

    const updateDom = (L: Live) => {
      const t = L.time;
      const pos = (100 - 100 * ((t / 2.4) % 1)).toFixed(2);
      for (const node of shimmerEls.current) if (node) node.style.backgroundPosition = `${pos}% 50%`;
      for (let i = 0; i < dotEls.current.length; i++) {
        const node = dotEls.current[i];
        if (!node) continue;
        const d = i % DOTS;
        node.style.opacity = (0.2 + 0.7 * (0.5 + 0.5 * Math.sin(t * 4.2 - d * 0.9))).toFixed(3);
      }
      const p = (t * 0.9) % 1;
      for (const node of pulseEls.current) {
        if (!node) continue;
        node.style.transform = `scale(${(1 + 0.9 * p).toFixed(3)})`;
        node.style.opacity = (0.45 * (1 - p)).toFixed(3);
      }
      if (ringInnerRef.current) ringInnerRef.current.style.opacity = (0.55 + 0.3 * Math.sin(t * 2.2)).toFixed(3);
      if (caretRef.current) caretRef.current.style.opacity = (0.6 + 0.4 * Math.sin(t * 5)).toFixed(3);
      if (sparkRef.current)
        sparkRef.current.style.transform = `rotate(${L.spin.toFixed(1)}deg) scale(${(1 + 0.14 * L.energy * Math.sin(t * 3)).toFixed(3)})`;
    };

    if (reduce) {
      root.style.setProperty("--gl-angle", `${START_ANGLE}deg`);
      return;
    }

    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (isVisibleRef.current) {
        const L = liveRef.current;
        L.time += dt;
        const target = L.phase === "done" ? 0.05 : 1;
        L.energy += (target - L.energy) * Math.min(1, dt * 3);
        L.spin = (L.spin + dt * (6 + 70 * L.energy)) % 360;
        L.angle = (L.angle + L.ringSpeed * (L.phase === "done" ? 0.5 : 1) * dt) % 360;
        root.style.setProperty("--gl-angle", `${L.angle.toFixed(2)}deg`);
        updateDom(L);
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rafRef.current);
  }, [reduce]);

  const handleStop = () => {
    if (fixed !== null || phase !== "writing") return;
    setStopped(true);
    setPhase("done");
  };
  const handleRegenerate = () => {
    if (fixed !== null) return;
    onRegenerate?.();
    setRun((r) => r + 1);
  };
  const handleCopy = () => {
    const text = blocks
      .map((b) => (b.kind === "li" ? "- " : "") + b.words.map((w) => (w.cite ? `[${w.cite}]${w.punct}` : w.text)).join(" "))
      .join("\n")
      .replace(/\s+([.,;:!?])/g, "$1");
    onCopy?.();
    try {
      const cb = navigator.clipboard;
      if (cb && typeof cb.writeText === "function")
        void cb.writeText(text).then(
          () => {
            setCopied(true);
            if (copyTimer.current) clearTimeout(copyTimer.current);
            copyTimer.current = setTimeout(() => setCopied(false), 1600);
          },
          () => undefined,
        );
    } catch {
      // clipboard can be blocked inside an embedded frame
    }
  };

  const typography: React.CSSProperties = {
    fontFamily: FONT_FALLBACK,
    lineHeight: 1.6,
    ...font,
    margin: 0,
  };
  const chrome: React.CSSProperties = {
    ...typography,
    fontSize: 13,
    lineHeight: 1.2,
    fontWeight: 500,
  };

  const shimmerGradient = `linear-gradient(90deg, ${mutedColor} 0%, ${mutedColor} 32%, ${resolvedText} 50%, ${mutedColor} 68%, ${mutedColor} 100%)`;
  const barGradient =
    "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.05) 35%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.05) 65%, rgba(255,255,255,0.05) 100%)";
  const softRing = Math.max(2, Math.min(18, ringSize * 0.45));
  const softBlur = ringSize * 0.7;
  const ringActive = shownPhase !== "done";
  const statusLine =
    shownPhase === "searching" ? searchingText : shownPhase === "writing" ? writingText : stopped ? "Response stopped" : "Answer ready";
  const accentCss = accent.join(",");
  const accent2Css = accent2.join(",");

  const ringNode = (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
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

  const labelItems = [
    { text: searchingText, dots: true, shimmer: true },
    { text: writingText, dots: true, shimmer: true },
    { text: stopped ? "Stopped" : doneText, dots: false, shimmer: false },
  ];
  const labelIndex = shownPhase === "searching" ? 0 : shownPhase === "writing" ? 1 : 2;

  const labelNode = (
    <div aria-hidden="true" style={{ display: "flex", alignItems: "center", minWidth: 0, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, auto)", minWidth: 0 }}>
        {labelItems.map((item, i) => {
          const on = i === labelIndex;
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
                transition: `opacity 0.45s ease, transform 0.45s ${EASE}`,
              }}
            >
              <span
                ref={(el) => {
                  shimmerEls.current[i] = item.shimmer ? el : null;
                }}
                style={
                  item.shimmer
                    ? {
                        ...chrome,
                        display: "block",
                        minWidth: 0,
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
                        ...chrome,
                        display: "block",
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        color: dimColor,
                      }
                }
              >
                {item.text}
              </span>
              {item.dots && (
                <span style={{ ...chrome, display: "flex", flex: "none", color: resolvedText, marginLeft: 1 }}>
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

  const stepperNode = (
    <div style={{ flex: "none" }}>
      <ol
        aria-label="Research steps"
        style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 6px" }}
      >
        {stepList.map((label, i) => {
          const done = i < shownStep;
          const active = i === shownStep;
          return (
            <li
              key={i}
              aria-current={active ? "step" : undefined}
              style={{
                ...chrome,
                fontWeight: 400,
                display: "flex",
                alignItems: "center",
                gap: 7,
                minWidth: 0,
                padding: "5px 11px 5px 7px",
                borderRadius: 999,
                border: `1px solid ${active ? `rgba(${accentCss},0.35)` : "rgba(255,255,255,0.07)"}`,
                background: active ? `rgba(${accentCss},0.07)` : "rgba(255,255,255,0.03)",
                transition: "border-color 0.4s ease, background-color 0.4s ease",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "relative",
                  flex: "none",
                  width: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  color: `rgb(${accentCss})`,
                  border: done ? "none" : `1px solid ${active ? `rgba(${accentCss},0.6)` : "rgba(255,255,255,0.16)"}`,
                  background: done ? `rgba(${accentCss},0.16)` : "transparent",
                }}
              >
                {done && <CheckIcon size={10} width={3} />}
                {active && (
                  <>
                    <span
                      ref={(el) => {
                        pulseEls.current[i] = el;
                      }}
                      style={{ position: "absolute", inset: -1, borderRadius: "50%", border: `1px solid rgba(${accentCss},0.8)`, opacity: 0.3 }}
                    />
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: `rgb(${accentCss})` }} />
                  </>
                )}
              </span>
              <span
                ref={(el) => {
                  shimmerEls.current[3 + i] = active ? el : null;
                }}
                style={
                  active
                    ? {
                        whiteSpace: "nowrap",
                        color: "transparent",
                        backgroundImage: shimmerGradient,
                        backgroundSize: "300% 100%",
                        backgroundPosition: `${STATIC_SHIMMER}% 50%`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }
                    : { whiteSpace: "nowrap", color: done ? dimColor : mutedColor }
                }
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <div
        aria-hidden="true"
        style={{ position: "relative", height: 2, marginTop: 12, borderRadius: 2, overflow: "hidden", background: "rgba(255,255,255,0.07)" }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${railPct.toFixed(2)}%`,
            borderRadius: 2,
            backgroundImage: railGradient,
            backgroundSize: `${(10000 / Math.max(1, railPct)).toFixed(0)}% 100%`,
            opacity: shownPhase === "done" ? 0.45 : 1,
            transition: "width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease",
          }}
        />
      </div>
    </div>
  );

  const caret = (
    <span
      ref={caretRef}
      aria-hidden="true"
      style={{ display: "inline-block", position: "relative", width: 0, height: "1em", verticalAlign: "text-bottom" }}
    >
      <span
        style={{
          position: "absolute",
          left: 4,
          top: "0.4em",
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: `rgb(${accentCss})`,
          boxShadow: `0 0 8px rgba(${accentCss},0.5)`,
        }}
      />
    </span>
  );

  const partial = stopped && shownPhase === "done";
  const showCaret = shownPhase === "writing";

  const textNode = (
    <div itemProp="text" style={{ ...typography, color: resolvedText }}>
      {blocks.map((b, bi) => {
        const first = offsets[bi];
        const firstLead = shownPhase === "done" ? 99 : shownCount - first;
        const Tag = b.kind === "li" ? "li" : "p";
        const wrapStart = b.kind === "li";
        return (
          <Tag
            key={bi}
            style={{
              ...typography,
              position: "relative",
              color: resolvedText,
              listStyle: wrapStart ? "none" : undefined,
              paddingLeft: wrapStart ? 18 : 0,
              marginTop: bi === 0 ? 0 : wrapStart ? "0.5em" : "0.75em",
            }}
          >
            {wrapStart && !(partial && first >= shownCount) && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 3,
                  top: "0.72em",
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: `rgb(${accentCss})`,
                  opacity: firstLead >= 1 ? 0.9 : 0,
                  transition: "opacity 0.3s ease, color 0.6s ease",
                }}
              />
            )}
            {b.words.map((tok, wi) => {
              const g = first + wi;
              if (partial && g >= shownCount) return null;
              const lead = shownPhase === "done" ? 99 : shownCount - g;
              const base = tok.bold ? boldRgb : textRgb;
              const col = lead >= 99 ? base : mixRgb(accent, base, clamp01((lead - 1) / TAIL));
              return (
                <React.Fragment key={wi}>
                  {showCaret && g === shownCount ? caret : null}
                  <span
                    style={{
                      opacity: lead >= 1 ? 1 : 0,
                      color: `rgb(${col.join(",")})`,
                      fontWeight: tok.bold ? 600 : undefined,
                      transition: "opacity 0.3s ease, color 0.6s ease",
                    }}
                  >
                    {tok.cite ? (
                      <>
                        <sup>
                          <a
                            href={`#${answerId}-source-${tok.cite}`}
                            aria-label={`Source ${tok.cite}`}
                            style={{
                              display: "inline-block",
                              minWidth: "1.35em",
                              padding: "0 0.35em",
                              boxSizing: "border-box",
                              textAlign: "center",
                              fontSize: "0.72em",
                              fontWeight: 500,
                              lineHeight: 1.5,
                              verticalAlign: "0.12em",
                              borderRadius: 999,
                              border: `1px solid rgba(${accent2Css},0.4)`,
                              background: "rgba(255,255,255,0.07)",
                              color: resolvedText,
                              textDecoration: "none",
                            }}
                          >
                            {tok.cite}
                          </a>
                        </sup>
                        {tok.punct}
                      </>
                    ) : (
                      tok.text
                    )}
                  </span>
                  {wi < b.words.length - 1 ? " " : null}
                </React.Fragment>
              );
            })}
          </Tag>
        );
      })}
    </div>
  );

  const skeletonNode = (
    <div
      aria-hidden="true"
      style={{
        ...typography,
        gridArea: "1 / 1",
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "0.65em",
        width: "100%",
        minHeight: "3.2em",
        paddingTop: "0.2em",
        boxSizing: "border-box",
        opacity: shownPhase === "searching" ? 1 : 0,
        transition: "opacity 0.35s ease",
      }}
    >
      {[92, 100, 68].map((width, i) => (
        <div
          key={i}
          ref={(el) => {
            shimmerEls.current[8 + i] = el;
          }}
          style={{
            width: `${width}%`,
            height: "0.7em",
            flex: "none",
            borderRadius: 999,
            backgroundImage: barGradient,
            backgroundSize: "300% 100%",
            backgroundPosition: `${STATIC_SHIMMER}% 50%`,
          }}
        />
      ))}
    </div>
  );

  const cols = Math.max(1, Math.min(3, sourceList.length));
  const sourceCards = sourceList.map((src, i) => {
    const letter = (src.domain || src.title || "?").trim().charAt(0).toUpperCase();
    const tint = i % 2 === 0 ? accentCss : accent2Css;
    const href = sourceHref(src.domain);
    return (
      <a
        key={i}
        id={`${answerId}-source-${i + 1}`}
        role="listitem"
        itemProp="citation"
        itemScope
        itemType="https://schema.org/CreativeWork"
        href={href || undefined}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer nofollow" : undefined}
        style={{
          ...chrome,
          fontWeight: 400,
          display: "flex",
          flexDirection: "column",
          gap: 7,
          minWidth: 0,
          padding: "10px 12px",
          boxSizing: "border-box",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.035)",
          textDecoration: "none",
          color: "inherit",
          opacity: shownPhase === "done" ? 1 : 0,
          transform: shownPhase === "done" ? "translateY(0px)" : "translateY(6px)",
          transition: `opacity 450ms ease ${120 + i * 90}ms, transform 450ms ${EASE} ${120 + i * 90}ms`,
        }}
      >
        <meta itemProp="url" content={href} />
        <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
          <span
            aria-hidden="true"
            style={{
              flex: "none",
              width: 18,
              height: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 600,
              color: `rgb(${tint})`,
              background: `rgba(${tint},0.14)`,
              border: `1px solid rgba(${tint},0.28)`,
            }}
          >
            {letter}
          </span>
          <cite
            itemProp="publisher"
            style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11.5, fontStyle: "normal", color: mutedColor }}
          >
            {src.domain}
          </cite>
          <span style={{ flex: "none", fontSize: 11, color: mutedColor }}>{i + 1}</span>
        </div>
        <div
          itemProp="headline"
          style={{ color: dimColor, lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {src.title}
        </div>
      </a>
    );
  });
  const timerText = `${timerValue.toFixed(1)}s`;
  const stopVisible = shownPhase === "writing";
  const footerReady = shownPhase === "done";

  return (
    <article
      ref={rootRef}
      lang={lang || undefined}
      itemScope
      itemType="https://schema.org/QAPage"
      aria-label="AI answer"
      className={cn("relative box-border h-full w-full overflow-hidden", className)}
      style={{
        ...style,
        display: "flex",
        flexDirection: "column",
        gap,
        padding,
        borderRadius: radius,
        background,
        backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0) 60%)",
        border: `1px solid ${borderColor}`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div itemScope itemType="https://schema.org/Question" itemProp="mainEntity" style={{ display: "contents" }}>
          <span role="status" aria-live="polite" style={SR_ONLY}>
            {statusLine}
          </span>
          <span itemProp="text" style={SR_ONLY}>
            {plainAnswer}
          </span>

          {ringNode}

          <header style={{ position: "relative", flex: "none", height: 28, display: "flex", alignItems: "center", gap: 9 }}>
            <div
              ref={sparkRef}
              aria-hidden="true"
              style={{
                flex: "none",
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                filter: `drop-shadow(0 0 5px rgba(${accentCss},0.35))`,
              }}
            >
              <Spark color={`rgb(${accentCss})`} size={18} />
            </div>
            {labelNode}
            {showTimer && (
              <time
                dateTime={`PT${Math.max(0, timerValue).toFixed(1)}S`}
                aria-label={`Elapsed ${timerText}`}
                style={{ ...chrome, fontSize: 12, fontWeight: 400, flex: "none", color: mutedColor, fontVariantNumeric: "tabular-nums" }}
              >
                {timerText}
              </time>
            )}
            <div style={{ flex: 1 }} />
            {stopVisible && (
              <PillButton label="Stop" onClick={handleStop} style={{ ...chrome, height: 28 }} color={resolvedText} icon={<StopIcon />} />
            )}
          </header>

          {showQuestion && question.trim() !== "" && (
            <h2
              itemProp="name"
              style={{
                ...typography,
                flex: "none",
                fontSize: 20,
                lineHeight: 1.3,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: `rgb(${boldRgb.join(",")})`,
              }}
            >
              {question}
            </h2>
          )}

          {showSteps && stepList.length > 0 && stepperNode}

          <section
            itemScope
            itemType="https://schema.org/Answer"
            itemProp="acceptedAnswer"
            ref={bodyRef}
            aria-busy={shownPhase !== "done"}
            aria-label="Answer"
            style={{
              position: "relative",
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              scrollbarWidth: "none",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              alignContent: "start",
            }}
          >
            <div style={{ gridArea: "1 / 1" }}>{textNode}</div>
            {skeletonNode}
          </section>

          {(showSources || showActions || showFollowUps) && (
            <footer
              inert={footerReady ? undefined : true}
              style={{
                position: "relative",
                flex: "none",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                visibility: footerReady ? "visible" : "hidden",
                opacity: footerReady ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            >
              {showSources && sourceList.length > 0 && (
                <div role="list" aria-label="Sources" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 8 }}>
                  {sourceCards}
                </div>
              )}

              {showActions && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    role="group"
                    aria-label="Answer actions"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      padding: 3,
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <IconButton label={copied ? "Copied" : "Copy answer"} onClick={handleCopy} color={dimColor} activeColor={resolvedText}>
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </IconButton>
                    <IconButton
                      label="Good answer"
                      onClick={() => setVote(vote === "up" ? null : "up")}
                      color={dimColor}
                      activeColor={resolvedText}
                      toggled={vote === "up"}
                    >
                      <ThumbIcon />
                    </IconButton>
                    <IconButton
                      label="Bad answer"
                      onClick={() => setVote(vote === "down" ? null : "down")}
                      color={dimColor}
                      activeColor={resolvedText}
                      toggled={vote === "down"}
                    >
                      <ThumbIcon flip />
                    </IconButton>
                    <IconButton label="Regenerate answer" onClick={handleRegenerate} color={dimColor} activeColor={resolvedText}>
                      <RefreshIcon />
                    </IconButton>
                  </div>
                  <span style={{ ...chrome, fontSize: 12, fontWeight: 400, marginLeft: "auto", color: mutedColor, whiteSpace: "nowrap" }}>
                    {stopped ? "Stopped" : `${sourceList.length} sources`}
                  </span>
                </div>
              )}
              {showFollowUps && followList.length > 0 && (
                <nav aria-label="Follow-up questions" style={{ display: "flex", flexWrap: "wrap", gap: 8, minWidth: 0 }}>
                  {followList.map((text, i) => (
                    <PillButton
                      key={i}
                      label={text}
                      onClick={() => onFollowUp?.()}
                      style={{ ...chrome, fontWeight: 400 }}
                      color={dimColor}
                      icon={<ReplyIcon />}
                    />
                  ))}
                </nav>
              )}
            </footer>
          )}
        </div>
    </article>
  );
}
