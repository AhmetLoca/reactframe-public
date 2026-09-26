"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SIZE = 4;

export type Game2048Theme = "classic" | "neon" | "gold" | "night";
export type Game2048Trigger = "manual" | "delay" | "scroll";
export type Game2048WidgetPosition = "bottom-right" | "bottom-left";
type MoveDirection = "up" | "down" | "left" | "right";

interface ThemeConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  triggerText: string;
  glow: string;
  background: string;
  lightBackground: string;
}

const THEMES: Record<Game2048Theme, ThemeConfig> = {
  classic: {
    title: "2048",
    subtitle: "Slide tiles. Reach 2048.",
    buttonText: "New Game",
    triggerText: "Play 2048",
    glow: "rgba(255,255,255,0.16)",
    background: "linear-gradient(160deg, #07080b 0%, #101319 100%)",
    lightBackground: "linear-gradient(160deg, #f4f6fa 0%, #dfe6f0 100%)",
  },
  neon: {
    title: "Merge Lab",
    subtitle: "Keep the board alive",
    buttonText: "Reset Board",
    triggerText: "Open 2048",
    glow: "rgba(129,140,248,0.22)",
    background: "linear-gradient(160deg, #06050c 0%, #100a1c 100%)",
    lightBackground: "linear-gradient(160deg, #eef2ff 0%, #e0e7ff 100%)",
  },
  gold: {
    title: "High Score",
    subtitle: "Beat your best run",
    buttonText: "New Run",
    triggerText: "Play a Round",
    glow: "rgba(251,191,36,0.20)",
    background: "linear-gradient(160deg, #0c0904 0%, #1a1206 100%)",
    lightBackground: "linear-gradient(160deg, #fff7ed 0%, #fde8cf 100%)",
  },
  night: {
    title: "Quiet Board",
    subtitle: "Arrows or swipe to move",
    buttonText: "New Game",
    triggerText: "Start 2048",
    glow: "rgba(45,212,191,0.20)",
    background: "linear-gradient(160deg, #04080a 0%, #081619 100%)",
    lightBackground: "linear-gradient(160deg, #ecfeff 0%, #cffafe 100%)",
  },
};

const TILE_DARK: Record<number, string> = {
  2: "rgba(255,255,255,0.08)",
  4: "rgba(255,255,255,0.12)",
  8: "rgba(255,255,255,0.18)",
  16: "rgba(255,255,255,0.24)",
  32: "rgba(255,255,255,0.32)",
  64: "rgba(255,255,255,0.40)",
  128: "rgba(255,255,255,0.52)",
  256: "rgba(255,255,255,0.64)",
  512: "rgba(255,255,255,0.74)",
  1024: "rgba(255,255,255,0.86)",
  2048: "#ffffff",
  4096: "#ffffff",
  8192: "#ffffff",
};

const TILE_LIGHT: Record<number, string> = {
  2: "rgba(23,26,33,0.06)",
  4: "rgba(23,26,33,0.10)",
  8: "rgba(23,26,33,0.16)",
  16: "rgba(23,26,33,0.22)",
  32: "rgba(23,26,33,0.30)",
  64: "rgba(23,26,33,0.38)",
  128: "rgba(23,26,33,0.50)",
  256: "rgba(23,26,33,0.62)",
  512: "rgba(23,26,33,0.74)",
  1024: "#171a21",
  2048: "#171a21",
  4096: "#171a21",
  8192: "#171a21",
};

function GiftGridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1.5" fill="#fffceb" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" fill="#ffc93c" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" fill="#ffc93c" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" fill="#fffceb" />
    </svg>
  );
}

function addRandomTile(b: number[]) {
  const empty: number[] = [];
  b.forEach((v, i) => v === 0 && empty.push(i));
  if (empty.length === 0) return b;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  b[idx] = Math.random() < 0.9 ? 2 : 4;
  return b;
}

function slide(row: number[]) {
  let arr = row.filter((v) => v !== 0);
  let scoreAdd = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      scoreAdd += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter((v) => v !== 0);
  while (arr.length < SIZE) arr.push(0);
  return { row: arr, scoreAdd };
}

function isGameOver(b: number[]) {
  if (b.includes(0)) return false;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = b[r * SIZE + c];
      if (c < SIZE - 1 && v === b[r * SIZE + c + 1]) return false;
      if (r < SIZE - 1 && v === b[(r + 1) * SIZE + c]) return false;
    }
  }
  return true;
}

export interface Game2048Props extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  theme?: Game2048Theme;
  lightMode?: boolean;
  accentColor?: string;
  asPopup?: boolean;
  trigger?: Game2048Trigger;
  delaySeconds?: number;
  widgetPosition?: Game2048WidgetPosition;
  widgetIcon?: string;
  storageKey?: string;
}

export function Game2048({
  theme = "classic",
  lightMode = false,
  accentColor = "#ffffff",
  asPopup = false,
  trigger = "manual",
  delaySeconds = 4,
  widgetPosition = "bottom-right",
  widgetIcon,
  storageKey = "",
  className,
  style,
  ...props
}: Game2048Props) {
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const gameRootRef = React.useRef<HTMLDivElement>(null);
  const widgetTriggerRef = React.useRef<HTMLButtonElement>(null);
  const delayTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wasPopupOpenRef = React.useRef(false);
  const touchStart = React.useRef({ x: 0, y: 0 });

  const suffix = storageKey.trim() ? `-${storageKey.trim()}` : "";
  const bestKey = `2048-best${suffix}`;

  const [board, setBoard] = React.useState<number[]>([]);
  const [score, setScore] = React.useState(0);
  const [best, setBest] = React.useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = localStorage.getItem(bestKey);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [status, setStatus] = React.useState<"playing" | "won" | "lost">("playing");
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
        boardBg: "rgba(23,26,33,0.06)",
        cellBg: "rgba(23,26,33,0.06)",
        tileInkHigh: "#ffffff",
        tileInkLow: "#171a21",
        focusRing: "0 0 0 2px rgba(23,26,33,0.35)",
      }
    : {
        ink: "#ffffff",
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
        boardBg: "rgba(255,255,255,0.04)",
        cellBg: "rgba(255,255,255,0.05)",
        tileInkHigh: "#0a0a0f",
        tileInkLow: "#ffffff",
        focusRing: "0 0 0 2px rgba(255,255,255,0.45)",
      };

  const tilePalette = lightMode ? TILE_LIGHT : TILE_DARK;

  const init = React.useCallback(() => {
    const empty = Array(SIZE * SIZE).fill(0);
    addRandomTile(empty);
    addRandomTile(empty);
    setBoard(empty);
    setScore(0);
    setStatus("playing");
    setWon(false);
  }, []);

  React.useEffect(() => {
    init();
  }, [init]);

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
    if (!asPopup) return;
    if (popupOpen) gameRootRef.current?.focus();
    else if (wasPopupOpenRef.current) widgetTriggerRef.current?.focus();
    wasPopupOpenRef.current = popupOpen;
  }, [asPopup, popupOpen]);

  const move = React.useCallback(
    (direction: MoveDirection) => {
      setBoard((prevBoard) => {
        if (status === "lost" || prevBoard.length === 0) return prevBoard;
        const newBoard = [...prevBoard];
        let moved = false;
        let scoreAdd = 0;

        const get = (r: number, c: number) => newBoard[r * SIZE + c];
        const set = (r: number, c: number, v: number) => (newBoard[r * SIZE + c] = v);

        if (direction === "left" || direction === "right") {
          for (let r = 0; r < SIZE; r++) {
            const row: number[] = [];
            for (let c = 0; c < SIZE; c++) row.push(get(r, c));
            if (direction === "right") row.reverse();
            const result = slide(row);
            if (direction === "right") result.row.reverse();
            for (let c = 0; c < SIZE; c++) {
              if (get(r, c) !== result.row[c]) moved = true;
              set(r, c, result.row[c]);
            }
            scoreAdd += result.scoreAdd;
          }
        } else {
          for (let c = 0; c < SIZE; c++) {
            const col: number[] = [];
            for (let r = 0; r < SIZE; r++) col.push(get(r, c));
            if (direction === "down") col.reverse();
            const result = slide(col);
            if (direction === "down") result.row.reverse();
            for (let r = 0; r < SIZE; r++) {
              if (get(r, c) !== result.row[r]) moved = true;
              set(r, c, result.row[r]);
            }
            scoreAdd += result.scoreAdd;
          }
        }

        if (!moved) return prevBoard;

        addRandomTile(newBoard);
        setScore((s) => {
          const next = s + scoreAdd;
          setBest((b) => {
            const nextBest = next > b ? next : b;
            if (nextBest > b) {
              try {
                localStorage.setItem(bestKey, nextBest.toString());
              } catch {
                /* ignore */
              }
            }
            return nextBest;
          });
          return next;
        });
        if (!won && newBoard.includes(2048)) {
          setWon(true);
          setStatus("won");
        }
        if (isGameOver(newBoard)) setStatus("lost");
        return newBoard;
      });
    },
    [status, won, bestKey],
  );

  const onCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && asPopup) {
      setPopupOpen(false);
      return;
    }
    const map: Record<string, MoveDirection> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      W: "up",
      s: "down",
      S: "down",
      a: "left",
      A: "left",
      d: "right",
      D: "right",
    };
    const dir = map[e.key];
    if (!dir) return;
    e.preventDefault();
    move(dir);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    touchStart.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const deltaX = e.clientX - touchStart.current.x;
    const deltaY = e.clientY - touchStart.current.y;
    if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) return;
    if (Math.abs(deltaX) > Math.abs(deltaY)) move(deltaX > 0 ? "right" : "left");
    else move(deltaY > 0 ? "down" : "up");
  };

  const gameCard = (
    <div
      ref={gameRootRef}
      tabIndex={0}
      role="application"
      aria-label={`${activeTheme.title} number puzzle`}
      onKeyDown={onCardKeyDown}
      onPointerDown={() => gameRootRef.current?.focus()}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="relative box-border flex w-full touch-none flex-col items-center overflow-hidden rounded-[22px] px-6.5 py-8 font-sans outline-none select-none"
      style={{
        background: lightMode ? activeTheme.lightBackground : activeTheme.background,
        border: `1px solid ${mode.cardBorder}`,
        boxShadow: focused ? mode.focusRing : "none",
        ...(asPopup ? { maxHeight: "calc(100vh - 48px)", overflowY: "auto" } : {}),
      }}
    >
      <header className="mb-4.5 w-full text-center">
        <h2 id={`${uid}-title`} className="m-0 font-serif text-[25px] font-normal tracking-[-0.02em]" style={{ color: mode.ink }}>
          {activeTheme.title}
        </h2>
        <div className="mx-auto my-3 h-px w-8" style={{ background: mode.divider }} />
        <p className="m-0 text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: mode.inkFaint }}>
          {activeTheme.subtitle}
        </p>
      </header>

      <div className="mb-4 flex w-full max-w-[340px] gap-2.5" aria-live="polite">
        {[
          { label: "Score", value: score },
          { label: "Best", value: best },
        ].map((item) => (
          <div key={item.label} className="flex-1 rounded-[14px] px-3 py-2.5 text-center backdrop-blur-[8px]" style={{ background: mode.surface, border: `1px solid ${mode.surfaceBorder}` }}>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: mode.inkFaint }}>
              {item.label}
            </div>
            <div className="font-serif text-[28px] font-normal" style={{ color: mode.ink }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <motion.button
        type="button"
        onClick={init}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mb-4.5 rounded-full border-none px-7.5 py-3.5 text-xs font-bold tracking-[0.1em] text-[#0a0a0f] uppercase"
        style={{ background: resolvedAccent }}
      >
        {activeTheme.buttonText}
      </motion.button>

      <div
        className="relative grid w-full max-w-[340px] touch-none grid-cols-4 grid-rows-4 gap-2 rounded-[14px] p-2.5"
        style={{ aspectRatio: "1 / 1", background: mode.boardBg, border: `1px solid ${mode.surfaceBorder}` }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {Array.from({ length: SIZE * SIZE }).map((_, i) => (
          <div key={`bg-${i}`} className="rounded-[10px]" style={{ background: mode.cellBg }} />
        ))}

        <AnimatePresence>
          {board.map((value, i) => {
            if (value === 0) return null;
            const row = Math.floor(i / SIZE);
            const col = i % SIZE;
            const high = value >= 128;
            return (
              <motion.div
                key={`${i}-${value}`}
                className="z-10 flex items-center justify-center rounded-[10px] font-bold"
                style={{
                  backgroundColor: tilePalette[value] || resolvedAccent,
                  color: high ? mode.tileInkHigh : mode.tileInkLow,
                  fontSize: value >= 1000 ? 22 : value >= 100 ? 26 : 30,
                  gridRow: row + 1,
                  gridColumn: col + 1,
                }}
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                layout
              >
                {value}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(status === "won" || status === "lost") && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center rounded-[22px] p-4 backdrop-blur-[6px]"
            style={{ background: mode.overlayBg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-[260px] rounded-[18px] px-6 py-7 text-center backdrop-blur-[20px]"
              style={{ background: mode.modalBg, border: `1px solid ${mode.modalBorder}` }}
            >
              <h3 className="m-0 font-serif text-2xl font-normal" style={{ color: mode.ink }}>
                {status === "won" ? "You won" : "Game over"}
              </h3>
              <div className="mx-auto mt-3 mb-4 h-px w-7" style={{ background: mode.divider }} />
              {status === "won" && (
                <button
                  type="button"
                  onClick={() => setStatus("playing")}
                  className="mb-2 w-full rounded-full border-none px-4 py-3.5 text-xs font-bold tracking-[0.1em] text-[#0a0a0f] uppercase"
                  style={{ background: resolvedAccent }}
                >
                  Keep Going
                </button>
              )}
              <button type="button" onClick={init} className="w-full rounded-full border-none px-4 py-3.5 text-xs font-bold tracking-[0.1em] text-[#0a0a0f] uppercase" style={{ background: resolvedAccent }}>
                Try Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-3.5 mb-0 text-center text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: mode.inkFaint }}>
        Arrow keys or swipe the board
      </p>
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
              <GiftGridIcon />
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
              className="relative w-full max-w-[420px]"
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
