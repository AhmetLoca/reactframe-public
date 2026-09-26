"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type MemoryMatchTheme = "night" | "neon" | "gold" | "tide";
export type MemoryMatchDifficulty = "easy" | "medium" | "hard";
export type MemoryMatchTrigger = "manual" | "delay" | "scroll";
export type MemoryMatchWidgetPosition = "bottom-right" | "bottom-left";

interface ThemeConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  triggerText: string;
  glow: string;
  background: string;
  lightBackground: string;
}

const THEMES: Record<MemoryMatchTheme, ThemeConfig> = {
  night: {
    title: "Memory",
    subtitle: "Find the matching marks",
    buttonText: "New Game",
    triggerText: "Play Memory",
    glow: "rgba(255,255,255,0.16)",
    background: "linear-gradient(160deg, #07080b 0%, #101319 100%)",
    lightBackground: "linear-gradient(160deg, #f4f6fa 0%, #dfe6f0 100%)",
  },
  neon: {
    title: "Recall",
    subtitle: "Flip two. Keep the pair.",
    buttonText: "Shuffle",
    triggerText: "Open Memory",
    glow: "rgba(129,140,248,0.22)",
    background: "linear-gradient(160deg, #06050c 0%, #100a1c 100%)",
    lightBackground: "linear-gradient(160deg, #eef2ff 0%, #e0e7ff 100%)",
  },
  gold: {
    title: "Pairs",
    subtitle: "Fewer moves, higher score",
    buttonText: "Deal Again",
    triggerText: "Start Pairs",
    glow: "rgba(251,191,36,0.20)",
    background: "linear-gradient(160deg, #0c0904 0%, #1a1206 100%)",
    lightBackground: "linear-gradient(160deg, #fff7ed 0%, #fde8cf 100%)",
  },
  tide: {
    title: "Match",
    subtitle: "Easy, medium or hard",
    buttonText: "New Board",
    triggerText: "Play Match",
    glow: "rgba(45,212,191,0.20)",
    background: "linear-gradient(160deg, #04080a 0%, #081619 100%)",
    lightBackground: "linear-gradient(160deg, #ecfeff 0%, #cffafe 100%)",
  },
};

const MARKS = [
  { id: "orb", mark: "●" },
  { id: "ring", mark: "○" },
  { id: "plus", mark: "+" },
  { id: "dash", mark: "-" },
  { id: "sq", mark: "■" },
  { id: "dia", mark: "◆" },
  { id: "tri", mark: "▲" },
  { id: "star", mark: "✶" },
];

const DIFFICULTY: Record<MemoryMatchDifficulty, { pairs: number; label: string; columns: number }> = {
  easy: { pairs: 4, label: "Easy", columns: 4 },
  medium: { pairs: 6, label: "Medium", columns: 4 },
  hard: { pairs: 8, label: "Hard", columns: 4 },
};

function MemoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="#ffc93c" strokeWidth="1.6" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="#fffceb" strokeWidth="1.6" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="#fffceb" strokeWidth="1.6" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="#ffc93c" strokeWidth="1.6" />
    </svg>
  );
}

interface Tile {
  id: number;
  markId: string;
  mark: string;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface MemoryMatchGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  theme?: MemoryMatchTheme;
  lightMode?: boolean;
  accentColor?: string;
  asPopup?: boolean;
  trigger?: MemoryMatchTrigger;
  delaySeconds?: number;
  widgetPosition?: MemoryMatchWidgetPosition;
  widgetIcon?: string;
}

export function MemoryMatchGame({
  theme = "night",
  lightMode = false,
  accentColor = "#ffffff",
  asPopup = false,
  trigger = "manual",
  delaySeconds = 4,
  widgetPosition = "bottom-right",
  widgetIcon,
  className,
  style,
  ...props
}: MemoryMatchGameProps) {
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const gameRootRef = React.useRef<HTMLDivElement>(null);
  const widgetTriggerRef = React.useRef<HTMLButtonElement>(null);
  const delayTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const flipTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const winTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wasPopupOpenRef = React.useRef(false);
  const generationRef = React.useRef(0);

  const [difficulty, setDifficulty] = React.useState<MemoryMatchDifficulty>("medium");
  const [tiles, setTiles] = React.useState<Tile[]>([]);
  const [flipped, setFlipped] = React.useState<number[]>([]);
  const [matched, setMatched] = React.useState<number[]>([]);
  const [locked, setLocked] = React.useState(false);
  const [moves, setMoves] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [won, setWon] = React.useState(false);
  const [popupOpen, setPopupOpen] = React.useState(!asPopup);
  const [scrollTriggered, setScrollTriggered] = React.useState(false);
  const [prevAsPopup, setPrevAsPopup] = React.useState(asPopup);
  const [focused, setFocused] = React.useState(false);

  if (asPopup !== prevAsPopup) {
    setPrevAsPopup(asPopup);
    setPopupOpen(!asPopup);
  }

  const activeTheme = THEMES[theme];
  const widgetOnRight = widgetPosition !== "bottom-left";
  const widgetGlowStrong = activeTheme.glow.replace(/,\s*[\d.]+\)$/, ", 0.85)");
  const resolvedAccent = accentColor || "#ffffff";

  const mode = lightMode
    ? {
        ink: "#171a21",
        inkSoft: "rgba(23,26,33,0.7)",
        inkFaint: "rgba(23,26,33,0.4)",
        divider: "rgba(23,26,33,0.18)",
        surface: "rgba(255,255,255,0.65)",
        surfaceBorder: "rgba(23,26,33,0.1)",
        cardBorder: "rgba(23,26,33,0.08)",
        overlayBg: "rgba(255,255,255,0.86)",
        modalBg: "rgba(255,255,255,0.75)",
        modalBorder: "rgba(23,26,33,0.12)",
        chromeBg: "#ffffff",
        chromeBorder: "rgba(23,26,33,0.1)",
        face: "rgba(23,26,33,0.06)",
        faceInk: "#171a21",
        back: "rgba(255,255,255,0.85)",
        focusRing: "0 0 0 2px rgba(23,26,33,0.35)",
      }
    : {
        ink: "#ffffff",
        inkSoft: "rgba(255,255,255,0.7)",
        inkFaint: "rgba(255,255,255,0.4)",
        divider: "rgba(255,255,255,0.3)",
        surface: "rgba(255,255,255,0.06)",
        surfaceBorder: "rgba(255,255,255,0.12)",
        cardBorder: "rgba(255,255,255,0.08)",
        overlayBg: "rgba(4,4,6,0.86)",
        modalBg: "rgba(255,255,255,0.06)",
        modalBorder: "rgba(255,255,255,0.16)",
        chromeBg: "rgba(10,10,15,0.92)",
        chromeBorder: "rgba(255,255,255,0.16)",
        face: "rgba(255,255,255,0.06)",
        faceInk: "rgba(255,255,255,0.55)",
        back: "rgba(255,255,255,0.1)",
        focusRing: "0 0 0 2px rgba(255,255,255,0.45)",
      };

  React.useEffect(() => {
    return () => {
      clearTimeout(delayTimerRef.current);
      clearTimeout(flipTimerRef.current);
      clearTimeout(winTimerRef.current);
    };
  }, []);

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
    if (!asPopup) return;
    if (popupOpen) gameRootRef.current?.focus();
    else if (wasPopupOpenRef.current) widgetTriggerRef.current?.focus();
    wasPopupOpenRef.current = popupOpen;
  }, [asPopup, popupOpen]);

  const createBoard = React.useCallback((level: MemoryMatchDifficulty) => {
    generationRef.current += 1;
    clearTimeout(flipTimerRef.current);
    clearTimeout(winTimerRef.current);
    const pairCount = DIFFICULTY[level].pairs;
    const selected = MARKS.slice(0, pairCount);
    const pairs = shuffle([...selected, ...selected]);
    setTiles(pairs.map((item, index) => ({ id: index, markId: item.id, mark: item.mark })));
    setFlipped([]);
    setMatched([]);
    setLocked(false);
    setMoves(0);
    setScore(0);
    setWon(false);
  }, []);

  React.useEffect(() => {
    createBoard(difficulty);
  }, [difficulty, createBoard]);

  const changeDifficulty = (level: MemoryMatchDifficulty) => {
    setDifficulty(level);
    createBoard(level);
  };

  const handleClick = (tile: Tile) => {
    if (locked) return;
    if (flipped.includes(tile.id) || matched.includes(tile.id)) return;
    if (flipped.length === 2) return;

    const newFlipped = [...flipped, tile.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const first = tiles.find((t) => t.id === newFlipped[0]);
      const second = tiles.find((t) => t.id === newFlipped[1]);
      if (!first || !second) {
        setLocked(false);
        return;
      }
      const gen = generationRef.current;
      if (first.markId === second.markId) {
        clearTimeout(flipTimerRef.current);
        flipTimerRef.current = setTimeout(() => {
          if (gen !== generationRef.current) return;
          setMatched((prev) => [...prev, first.id, second.id]);
          setFlipped([]);
          setLocked(false);
          const points = difficulty === "hard" ? 150 : difficulty === "easy" ? 80 : 100;
          setScore((s) => s + points);
          if (matched.length + 2 === tiles.length) {
            clearTimeout(winTimerRef.current);
            winTimerRef.current = setTimeout(() => {
              if (gen !== generationRef.current) return;
              setWon(true);
            }, 400);
          }
        }, 420);
      } else {
        const delay = difficulty === "hard" ? 700 : 900;
        clearTimeout(flipTimerRef.current);
        flipTimerRef.current = setTimeout(() => {
          if (gen !== generationRef.current) return;
          setFlipped([]);
          setLocked(false);
        }, delay);
      }
    }
  };

  const columns = DIFFICULTY[difficulty].columns;

  const gameCard = (
    <div
      ref={gameRootRef}
      tabIndex={0}
      role="application"
      aria-label={`${activeTheme.title} memory game`}
      onPointerDown={() => gameRootRef.current?.focus()}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="relative box-border flex w-full flex-col items-center overflow-hidden rounded-[22px] px-5.5 py-7 font-sans outline-none select-none"
      style={{ background: lightMode ? activeTheme.lightBackground : activeTheme.background, border: `1px solid ${mode.cardBorder}`, boxShadow: focused ? mode.focusRing : "none" }}
    >
      <header className="mb-3.5 w-full text-center">
        <p className="m-0 mb-1.5 text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: mode.inkFaint }}>
          Browser puzzle
        </p>
        <h2 id={`${uid}-title`} className="m-0 font-serif text-[25px] font-normal tracking-[-0.02em]" style={{ color: mode.ink }}>
          {activeTheme.title}
        </h2>
        <div className="mx-auto my-3 h-px w-8" style={{ background: mode.divider }} />
        <p className="m-0 text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: mode.inkFaint }}>
          {activeTheme.subtitle}
        </p>
      </header>

      <div className="mb-3.5 flex w-full max-w-[380px] gap-2" aria-live="polite">
        {[
          { label: "Score", value: `${score}` },
          { label: "Moves", value: `${moves}` },
          { label: "Level", value: DIFFICULTY[difficulty].label },
        ].map((item) => (
          <div key={item.label} className="min-w-0 flex-1 rounded-[14px] px-2 py-2 text-center backdrop-blur-[8px]" style={{ background: mode.surface, border: `1px solid ${mode.surfaceBorder}` }}>
            <div className="text-[9px] font-bold tracking-[0.16em] uppercase" style={{ color: mode.inkFaint }}>
              {item.label}
            </div>
            <div className="font-serif text-base font-normal" style={{ color: mode.ink }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div role="group" aria-label="Difficulty" className="mb-3.5 flex gap-2">
        {(Object.keys(DIFFICULTY) as MemoryMatchDifficulty[]).map((level) => {
          const on = difficulty === level;
          return (
            <button
              key={level}
              type="button"
              aria-pressed={on}
              onClick={() => changeDifficulty(level)}
              className="min-w-[72px] cursor-pointer rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[0.08em] uppercase transition-colors"
              style={{ background: on ? resolvedAccent : mode.surface, color: on ? "#0a0a0f" : mode.ink, border: `1px solid ${mode.surfaceBorder}` }}
            >
              {DIFFICULTY[level].label}
            </button>
          );
        })}
      </div>

      <motion.button
        type="button"
        onClick={() => createBoard(difficulty)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mb-4 rounded-full border-none px-7.5 py-3.5 text-xs font-bold tracking-[0.1em] text-[#0a0a0f] uppercase"
        style={{ background: resolvedAccent }}
      >
        {activeTheme.buttonText}
      </motion.button>

      <div className="grid w-full gap-2.5" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, maxWidth: difficulty === "hard" ? 380 : 340 }}>
        {tiles.map((tile) => {
          const isFlipped = flipped.includes(tile.id) || matched.includes(tile.id);
          const isMatched = matched.includes(tile.id);
          return (
            <button
              key={tile.id}
              type="button"
              aria-label={isFlipped ? `Mark ${tile.mark}` : "Hidden card"}
              aria-pressed={isFlipped}
              onClick={() => handleClick(tile)}
              className="aspect-square cursor-pointer border-none bg-transparent p-0"
              style={{ perspective: 900 }}
            >
              <div className="h-full w-full transition-[opacity,transform] duration-[350ms] ease-out" style={{ opacity: isMatched ? 0 : 1, transform: isMatched ? "scale(0.6)" : "scale(1)", pointerEvents: isMatched ? "none" : "auto" }}>
                <motion.div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}>
                  <div className="absolute inset-0 flex items-center justify-center rounded-[14px]" style={{ backfaceVisibility: "hidden", background: mode.face, border: `1px solid ${mode.surfaceBorder}` }}>
                    <span className="font-serif text-[22px] font-normal" style={{ color: mode.faceInk }}>
                      ?
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rounded-[14px]" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: mode.back, border: `1px solid ${mode.surfaceBorder}` }}>
                    <span className="text-[22px] leading-none" style={{ color: mode.ink }}>
                      {tile.mark}
                    </span>
                  </div>
                </motion.div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-3.5 mb-0 text-center text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: mode.inkFaint }}>
        {DIFFICULTY[difficulty].pairs} pairs · tap two cards
      </p>

      <AnimatePresence>
        {won && (
          <motion.div
            role="dialog"
            aria-labelledby={`${uid}-win`}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[6px]"
            style={{ background: mode.overlayBg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-[280px] rounded-[18px] px-6 py-7 text-center backdrop-blur-[20px]" style={{ background: mode.modalBg, border: `1px solid ${mode.modalBorder}` }}>
              <h3 id={`${uid}-win`} className="m-0 font-serif text-[22px] font-normal" style={{ color: mode.ink }}>
                You won
              </h3>
              <div className="mx-auto mt-3 mb-3.5 h-px w-7" style={{ background: mode.divider }} />
              <p className="m-0 mb-2 text-[13px]" style={{ color: mode.inkSoft }}>
                {score} points · {moves} moves
              </p>
              <p className="m-0 mb-4 text-[13px]" style={{ color: mode.ink }}>
                {DIFFICULTY[difficulty].label}
              </p>
              <button type="button" onClick={() => createBoard(difficulty)} className="w-full rounded-full border-none px-4 py-3.5 text-xs font-bold tracking-[0.1em] text-[#0a0a0f] uppercase" style={{ background: resolvedAccent }}>
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
              <MemoryIcon />
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
            className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
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
              className="relative w-full max-w-[520px]"
            >
              {gameCard}
              <button
                type="button"
                onClick={() => setPopupOpen(false)}
                aria-label="Close game"
                className="absolute -top-3.5 -right-3.5 z-[100] flex h-8 w-8 items-center justify-center rounded-full border text-[17px] leading-[30px]"
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
