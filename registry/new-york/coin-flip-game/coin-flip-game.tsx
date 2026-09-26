"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CoinFlipTheme = "night" | "neon" | "gold" | "tide";
export type CoinFlipTrigger = "manual" | "delay" | "scroll";
export type CoinFlipWidgetPosition = "bottom-right" | "bottom-left";

interface ThemeConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  triggerText: string;
  glow: string;
  background: string;
  lightBackground: string;
  metal: string;
  metalLight: string;
  metalDark: string;
  metalEdge: string;
}

const THEMES: Record<CoinFlipTheme, ThemeConfig> = {
  night: {
    title: "Flip",
    subtitle: "Ask. Toss. Decide.",
    buttonText: "Flip the coin",
    triggerText: "Flip a coin",
    glow: "rgba(255,255,255,0.16)",
    background: "linear-gradient(160deg, #07080b 0%, #101319 100%)",
    lightBackground: "linear-gradient(160deg, #f4f6fa 0%, #dfe6f0 100%)",
    metal: "#b8b8b8",
    metalLight: "#e8e8e8",
    metalDark: "#6a6a6a",
    metalEdge: "#d0d0d0",
  },
  neon: {
    title: "Toss",
    subtitle: "Heads yes. Tails no.",
    buttonText: "Toss again",
    triggerText: "Open Flip",
    glow: "rgba(129,140,248,0.22)",
    background: "linear-gradient(160deg, #06050c 0%, #100a1c 100%)",
    lightBackground: "linear-gradient(160deg, #eef2ff 0%, #e0e7ff 100%)",
    metal: "#9aa4c8",
    metalLight: "#d7def7",
    metalDark: "#4b556f",
    metalEdge: "#c5ccef",
  },
  gold: {
    title: "Coin",
    subtitle: "One question. One toss.",
    buttonText: "Flip again",
    triggerText: "Toss Coin",
    glow: "rgba(251,191,36,0.20)",
    background: "linear-gradient(160deg, #0c0904 0%, #1a1206 100%)",
    lightBackground: "linear-gradient(160deg, #fff7ed 0%, #fde8cf 100%)",
    metal: "#d4af37",
    metalLight: "#f5e6a3",
    metalDark: "#8b6914",
    metalEdge: "#e8c547",
  },
  tide: {
    title: "Call",
    subtitle: "Keep a short toss history",
    buttonText: "Flip now",
    triggerText: "Play Call",
    glow: "rgba(45,212,191,0.20)",
    background: "linear-gradient(160deg, #04080a 0%, #081619 100%)",
    lightBackground: "linear-gradient(160deg, #ecfeff 0%, #cffafe 100%)",
    metal: "#cd7f32",
    metalLight: "#e8b07a",
    metalDark: "#8b4513",
    metalEdge: "#daa06d",
  },
};

function CoinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="#ffc93c" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" fill="#fffceb" />
    </svg>
  );
}

export interface CoinFlipGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  theme?: CoinFlipTheme;
  lightMode?: boolean;
  accentColor?: string;
  size?: number;
  headsImage?: string;
  tailsImage?: string;
  defaultQuestion?: string;
  asPopup?: boolean;
  trigger?: CoinFlipTrigger;
  delaySeconds?: number;
  widgetPosition?: CoinFlipWidgetPosition;
  widgetIcon?: string;
}

export function CoinFlipGame({
  theme = "night",
  lightMode = false,
  accentColor = "#ffffff",
  size = 160,
  headsImage,
  tailsImage,
  defaultQuestion = "Should I ship this today?",
  asPopup = false,
  trigger = "manual",
  delaySeconds = 4,
  widgetPosition = "bottom-right",
  widgetIcon,
  className,
  style,
  ...props
}: CoinFlipGameProps) {
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const gameRootRef = React.useRef<HTMLDivElement>(null);
  const widgetTriggerRef = React.useRef<HTMLButtonElement>(null);
  const delayTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wasPopupOpenRef = React.useRef(false);

  const [flipping, setFlipping] = React.useState(false);
  const [result, setResult] = React.useState<"Heads" | "Tails" | null>(null);
  const [question, setQuestion] = React.useState(defaultQuestion);
  const [history, setHistory] = React.useState<("Heads" | "Tails")[]>([]);
  const [rot, setRot] = React.useState(0);
  const [popupOpen, setPopupOpen] = React.useState(!asPopup);
  const [scrollTriggered, setScrollTriggered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [prevAsPopup, setPrevAsPopup] = React.useState(asPopup);

  if (asPopup !== prevAsPopup) {
    setPrevAsPopup(asPopup);
    setPopupOpen(!asPopup);
  }

  const activeTheme = THEMES[theme];
  const coinSize = Math.max(120, Math.min(200, size));
  const depth = coinSize / 12;
  const widgetOnRight = widgetPosition !== "bottom-left";
  const widgetGlowStrong = activeTheme.glow.replace(/,\s*[\d.]+\)$/, ", 0.85)");

  const mode = lightMode
    ? {
        ink: "#171a21",
        inkSoft: "rgba(23,26,33,0.7)",
        inkFaint: "rgba(23,26,33,0.4)",
        divider: "rgba(23,26,33,0.18)",
        surfaceBorder: "rgba(23,26,33,0.1)",
        cardBorder: "rgba(23,26,33,0.08)",
        chromeBg: "#ffffff",
        chromeBorder: "rgba(23,26,33,0.1)",
        inputBg: "rgba(255,255,255,0.7)",
        focusRing: "0 0 0 2px rgba(23,26,33,0.35)",
      }
    : {
        ink: "#ffffff",
        inkSoft: "rgba(255,255,255,0.7)",
        inkFaint: "rgba(255,255,255,0.4)",
        divider: "rgba(255,255,255,0.3)",
        surfaceBorder: "rgba(255,255,255,0.12)",
        cardBorder: "rgba(255,255,255,0.08)",
        chromeBg: "rgba(10,10,15,0.92)",
        chromeBorder: "rgba(255,255,255,0.16)",
        inputBg: "rgba(255,255,255,0.06)",
        focusRing: "0 0 0 2px rgba(255,255,255,0.45)",
      };

  React.useEffect(() => () => clearTimeout(delayTimerRef.current), []);

  React.useEffect(() => {
    if (!asPopup || trigger !== "delay") return;
    clearTimeout(delayTimerRef.current);
    delayTimerRef.current = setTimeout(() => setPopupOpen(true), delaySeconds * 1000);
    return () => clearTimeout(delayTimerRef.current);
  }, [asPopup, trigger, delaySeconds]);

  React.useEffect(() => {
    if (!asPopup || trigger !== "scroll" || !rootRef.current) return;
    const el = rootRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !scrollTriggered) {
          setScrollTriggered(true);
          setPopupOpen(true);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [asPopup, trigger, scrollTriggered]);

  React.useEffect(() => {
    if (!asPopup || popupOpen) gameRootRef.current?.focus();
    else if (wasPopupOpenRef.current) widgetTriggerRef.current?.focus();
    wasPopupOpenRef.current = popupOpen;
  }, [asPopup, popupOpen]);

  const handleFlip = () => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);
    const extra = Math.random() > 0.5 ? 720 : 900;
    setRot((r) => r + extra);
  };

  const onFlipComplete = () => {
    if (!flipping) return;
    const turns = Math.round(rot / 180);
    const finalResult: "Heads" | "Tails" = turns % 2 === 0 ? "Heads" : "Tails";
    setFlipping(false);
    setResult(finalResult);
    setHistory((prev) => [finalResult, ...prev].slice(0, 12));
  };

  const resolvedAccent = accentColor || "#ffffff";
  const headsCount = history.filter((h) => h === "Heads").length;
  const total = history.length;
  const headsPct = total ? Math.round((headsCount / total) * 100) : 0;
  const tailsPct = total ? 100 - headsPct : 0;

  const coinFace = (facing: "heads" | "tails", image: string | undefined, label: string) => (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full"
      style={{
        transform: facing === "heads" ? `translateZ(${depth}px)` : `translateZ(-${depth}px) rotateX(180deg)`,
        backfaceVisibility: "hidden",
        border: `8px solid ${activeTheme.metalEdge}`,
        boxShadow: `inset 0 0 0 2px ${activeTheme.metalDark}`,
        background: `radial-gradient(circle at 30% 28%, ${activeTheme.metalLight}, ${activeTheme.metal} 55%, ${activeTheme.metalDark})`,
      }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={label} className="h-full w-full object-cover" />
      ) : (
        <span className="font-serif text-[54px] font-normal" style={{ color: activeTheme.metalDark }}>
          {label[0]}
        </span>
      )}
    </div>
  );

  const gameCard = (
    <div
      ref={gameRootRef}
      tabIndex={0}
      role="application"
      aria-label={`${activeTheme.title} coin flip`}
      onPointerDown={() => gameRootRef.current?.focus()}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="relative box-border flex w-full flex-col items-center overflow-hidden rounded-[22px] px-5.5 py-7 font-sans outline-none select-none"
      style={{ background: lightMode ? activeTheme.lightBackground : activeTheme.background, border: `1px solid ${mode.cardBorder}`, boxShadow: focused ? mode.focusRing : "none" }}
    >
      <header className="mb-3.5 w-full text-center">
        <p className="m-0 mb-1.5 text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: mode.inkFaint }}>
          Browser tool
        </p>
        <h2 id={`${uid}-title`} className="m-0 font-serif text-[25px] font-normal tracking-[-0.02em]" style={{ color: mode.ink }}>
          {activeTheme.title}
        </h2>
        <div className="mx-auto my-3 h-px w-8" style={{ background: mode.divider }} />
        <p className="m-0 text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: mode.inkFaint }}>
          {activeTheme.subtitle}
        </p>
      </header>

      <label htmlFor={`${uid}-q`} className="mb-1.5 text-[9px] font-bold tracking-[0.16em] uppercase" style={{ color: mode.inkFaint }}>
        Question
      </label>
      <input
        id={`${uid}-q`}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type a yes or no question"
        className="box-border w-full max-w-[320px] rounded-[14px] px-4 py-3 text-center text-sm outline-none"
        style={{ background: mode.inputBg, border: `1px solid ${mode.surfaceBorder}`, color: mode.ink }}
      />

      <button
        type="button"
        aria-label="Flip the coin"
        onClick={handleFlip}
        disabled={flipping}
        className="my-4.5 border-none bg-transparent p-0"
        style={{ width: coinSize, height: coinSize, cursor: flipping ? "default" : "pointer", perspective: 900 }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateX: rot }}
          transition={{ duration: 1.05, ease: [0.2, 0.8, 0.2, 1] }}
          onAnimationComplete={onFlipComplete}
        >
          {coinFace("heads", headsImage, "Heads")}
          {coinFace("tails", tailsImage, "Tails")}
        </motion.div>
      </button>

      <p className="m-0 mb-4 min-h-[20px] text-xs font-semibold tracking-[0.12em] uppercase" style={{ color: mode.inkSoft }} aria-live="polite">
        {flipping ? "Flipping" : result ? `${result} · ${result === "Heads" ? "Yes" : "No"}` : "Tap the coin"}
      </p>

      <motion.button
        type="button"
        onClick={handleFlip}
        disabled={flipping}
        whileHover={flipping ? undefined : { scale: 1.03 }}
        whileTap={flipping ? undefined : { scale: 0.97 }}
        className="mb-2 rounded-full border-none px-7.5 py-3.5 text-xs font-bold tracking-[0.1em] text-[#0a0a0f] uppercase"
        style={{ background: resolvedAccent, opacity: flipping ? 0.6 : 1 }}
      >
        {result || flipping ? "Flip again" : activeTheme.buttonText}
      </motion.button>

      {history.length > 0 && (
        <div className="mt-5 w-full max-w-[300px] text-center">
          <p className="m-0 mb-2.5 text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: mode.inkFaint }}>
            Heads {headsPct}% · Tails {tailsPct}% · {total}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {history.map((h, i) => (
              <div key={i} title={h} className="h-2.5 w-2.5 rounded-full" style={{ background: h === "Heads" ? activeTheme.metal : activeTheme.metalDark }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (!asPopup) {
    return (
      <div ref={rootRef} className={cn("w-full", className)} style={style} {...props}>
        {gameCard}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("relative w-full", className)} style={style} {...props}>
      <div className={cn("flex", widgetOnRight ? "justify-end" : "justify-start")}>
        <motion.button
          ref={widgetTriggerRef}
          type="button"
          onClick={() => setPopupOpen(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          aria-label={activeTheme.triggerText}
          className="flex items-center gap-3 rounded-full border-none bg-white py-1.5 pr-5 pl-1.5"
          style={{ boxShadow: `0 8px 30px ${activeTheme.glow}, 0 4px 16px rgba(0,0,0,0.4)` }}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border" style={{ background: "#121212", borderColor: "rgba(255,255,255,0.1)" }}>
            {widgetIcon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={widgetIcon} alt="" className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <CoinIcon />
            )}
          </span>
          <span className="flex flex-col gap-0.5 text-left">
            <span className="text-[9px] font-bold tracking-[0.1em] whitespace-nowrap uppercase" style={{ color: "rgba(23,26,33,0.4)" }}>
              {activeTheme.triggerText}
            </span>
            <motion.span
              className="text-[13px] font-bold tracking-[0.02em] whitespace-nowrap text-[#171a21] uppercase"
              animate={{ textShadow: [`0 0 3px ${widgetGlowStrong}`, `0 0 10px ${widgetGlowStrong}`, `0 0 3px ${widgetGlowStrong}`] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Play Now
            </motion.span>
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {popupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setPopupOpen(false);
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${uid}-title`}
              onKeyDown={(e) => {
                if (e.key === "Escape") setPopupOpen(false);
              }}
              className="relative w-full max-w-[480px]"
            >
              {gameCard}
              <button
                type="button"
                onClick={() => setPopupOpen(false)}
                aria-label="Close flip"
                className="absolute -top-3.5 -right-3.5 flex h-8 w-8 items-center justify-center rounded-full border text-[17px] leading-[30px]"
                style={{ background: mode.chromeBg, borderColor: mode.chromeBorder, color: mode.ink }}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
