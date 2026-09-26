"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TerminalSize = "sm" | "md" | "lg";
export type TerminalLineType = "command" | "output" | "comment";

export interface TerminalLine {
  id: string;
  type: TerminalLineType;
  text: string;
  /** ms per character while typing this line; only used for "command" lines. */
  typingSpeed?: number;
  /** Extra pause after this line finishes, before the next one starts. */
  pauseAfter?: number;
}

export interface TerminalProps {
  lines: TerminalLine[];
  title?: string;
  prompt?: string;
  autoPlay?: boolean;
  loop?: boolean;
  typingSpeed?: number;
  lineDelay?: number;
  startDelay?: number;
  showControls?: boolean;
  size?: TerminalSize;
  theme?: "dark" | "light";
  accentColor?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0B0B0B", headerBg: "#161616", border: "rgba(255,255,255,0.1)", text: "#F5F4F1", muted: "rgba(245,244,241,0.45)", prompt: "#87FFE3", titleText: "rgba(245,244,241,0.5)", hover: "rgba(255,255,255,0.08)" },
  light: { bg: "#FCFCFC", headerBg: "#EFEFEF", border: "rgba(10,10,10,0.1)", text: "#0A0A0A", muted: "rgba(10,10,10,0.45)", prompt: "#0F9F7F", titleText: "rgba(10,10,10,0.5)", hover: "rgba(10,10,10,0.06)" },
};

const SIZES: Record<TerminalSize, { font: number; lineH: number; pad: number; headerH: number }> = {
  sm: { font: 12, lineH: 20, pad: 14, headerH: 34 },
  md: { font: 13, lineH: 22, pad: 18, headerH: 38 },
  lg: { font: 14.5, lineH: 24, pad: 22, headerH: 42 },
};

type Palette = (typeof PALETTES)["dark"];

interface DisplayLine {
  line: TerminalLine;
  text: string;
  active: boolean;
}

function ReplayIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 8a5 5 0 1 1-1.7-3.75" />
      <path d="M13 2.5V5h-2.5" />
    </svg>
  );
}

function Row({ item, prompt, p }: { item: DisplayLine; prompt: string; p: Palette }) {
  const { line, text, active } = item;
  if (line.type === "output") {
    return (
      <div style={{ color: p.text, opacity: 0.85, whiteSpace: "pre-wrap" }}>
        {text}
        {text.length === 0 && " "}
      </div>
    );
  }
  if (line.type === "comment") {
    return (
      <div style={{ color: p.muted, fontStyle: "italic" }}>
        {"# "}
        {text}
      </div>
    );
  }
  return (
    <div className="flex" style={{ gap: 8 }}>
      <span className="shrink-0 font-semibold" style={{ color: p.prompt }}>
        {prompt}
      </span>
      <span style={{ color: p.text, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {text}
        {active && (
          <motion.span
            aria-hidden="true"
            className="inline-block align-middle"
            style={{ width: "0.55em", height: "1.05em", marginLeft: 1, background: p.text, verticalAlign: "-0.15em" }}
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          />
        )}
      </span>
    </div>
  );
}

export function Terminal({
  lines,
  title = "zsh",
  prompt = "$",
  autoPlay = true,
  loop = true,
  typingSpeed = 32,
  lineDelay = 400,
  startDelay = 500,
  showControls = true,
  size = "md",
  theme = "dark",
  accentColor,
  width,
  height = 280,
  className,
}: TerminalProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const [displayed, setDisplayed] = React.useState<DisplayLine[]>([]);
  const [finished, setFinished] = React.useState(false);
  const genRef = React.useRef(0);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const bodyRef = React.useRef<HTMLDivElement>(null);

  const schedule = React.useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(fn, Math.max(0, delay));
    timers.current.push(t);
    return t;
  }, []);

  const clearTimers = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  // Looping calls back into `play` from deep inside its own timer chain,
  // before the const finishes initializing — going through a ref (resolved
  // when the timer actually fires, not when `play` is defined) sidesteps
  // that self-reference instead of relying on closure-capturing a
  // not-yet-assigned binding.
  const playRef = React.useRef<(gen: number) => void>(() => {});

  const play = React.useCallback(
    (gen: number) => {
      setDisplayed([]);
      setFinished(false);
      let li = 0;

      const startLine = () => {
        if (gen !== genRef.current) return;
        if (li >= lines.length) {
          setFinished(true);
          setDisplayed((prev) => prev.map((d, i) => (i === prev.length - 1 ? { ...d, active: false } : d)));
          if (loop) schedule(() => playRef.current(gen), 1400);
          return;
        }
        const line = lines[li];
        setDisplayed((prev) => [...prev, { line, text: "", active: line.type === "command" }]);

        if (line.type === "command") {
          let ci = 0;
          const typeChar = () => {
            if (gen !== genRef.current) return;
            ci++;
            setDisplayed((prev) => prev.map((d, i) => (i === prev.length - 1 ? { ...d, text: line.text.slice(0, ci) } : d)));
            if (ci < line.text.length) {
              schedule(typeChar, line.typingSpeed ?? typingSpeed);
            } else {
              setDisplayed((prev) => prev.map((d, i) => (i === prev.length - 1 ? { ...d, active: false } : d)));
              li++;
              schedule(startLine, line.pauseAfter ?? lineDelay);
            }
          };
          schedule(typeChar, line.typingSpeed ?? typingSpeed);
        } else {
          setDisplayed((prev) => prev.map((d, i) => (i === prev.length - 1 ? { ...d, text: line.text } : d)));
          li++;
          schedule(startLine, line.pauseAfter ?? lineDelay * 0.6);
        }
      };

      schedule(startLine, startDelay);
    },
    [lines, loop, typingSpeed, lineDelay, startDelay, schedule],
  );
  React.useEffect(() => {
    playRef.current = play;
  }, [play]);

  React.useEffect(() => {
    if (!autoPlay) return;
    genRef.current++;
    const gen = genRef.current;
    play(gen);
    return () => {
      genRef.current = gen + 1;
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, autoPlay, loop]);

  React.useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [displayed]);

  const replay = () => {
    genRef.current++;
    clearTimers();
    play(genRef.current);
  };

  return (
    <div
      className={cn("flex flex-col overflow-hidden", className)}
      style={{ width, maxWidth: "100%", height, borderRadius: 14, background: p.bg, border: `1px solid ${p.border}`, fontFamily: "Inter, sans-serif", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}
    >
      <div className="relative flex shrink-0 items-center justify-center" style={{ height: s.headerH, padding: `0 ${s.pad}px`, background: p.headerBg, borderBottom: `1px solid ${p.border}` }}>
        {showControls && (
          <div className="absolute flex items-center" style={{ left: s.pad, gap: 7 }}>
            <span className="rounded-full" style={{ width: 11, height: 11, background: "#FF5F57" }} />
            <span className="rounded-full" style={{ width: 11, height: 11, background: "#FEBC2E" }} />
            <span className="rounded-full" style={{ width: 11, height: 11, background: "#28C840" }} />
          </div>
        )}
        <span className="truncate font-medium" style={{ color: p.titleText, fontSize: s.font - 1 }}>
          {title}
        </span>
        {!loop && finished && (
          <button
            type="button"
            onClick={replay}
            aria-label="Replay"
            className="absolute flex cursor-pointer items-center justify-center rounded-md border-none bg-transparent outline-none focus-visible:ring-2"
            style={{ right: s.pad - 6, width: 24, height: 24, color: p.titleText, ["--tw-ring-color" as string]: accentColor ?? p.text }}
            onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <ReplayIcon size={s.font} />
          </button>
        )}
      </div>

      <div ref={bodyRef} className="min-h-0 flex-1 overflow-auto" style={{ padding: s.pad, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
        <div className="flex flex-col" style={{ gap: s.lineH * 0.18, fontSize: s.font, lineHeight: `${s.lineH}px` }}>
          {displayed.map((item, i) => (
            <Row key={`${item.line.id}-${i}`} item={item} prompt={prompt} p={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
