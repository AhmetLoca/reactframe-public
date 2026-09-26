"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type MinesweeperTheme = "night" | "neon" | "gold" | "tide";
export type MinesweeperDifficulty = "beginner" | "intermediate" | "expert";
export type MinesweeperTrigger = "manual" | "delay" | "scroll";
export type MinesweeperWidgetPosition = "bottom-right" | "bottom-left";
type GameStatus = "ready" | "playing" | "won" | "lost";

interface ThemeConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  triggerText: string;
  glow: string;
  background: string;
  lightBackground: string;
}

const THEMES: Record<MinesweeperTheme, ThemeConfig> = {
  night: {
    title: "Mines",
    subtitle: "Clear the field. Flag the rest.",
    buttonText: "New Field",
    triggerText: "Play Mines",
    glow: "rgba(255,255,255,0.16)",
    background: "linear-gradient(160deg, #07080b 0%, #101319 100%)",
    lightBackground: "linear-gradient(160deg, #f4f6fa 0%, #dfe6f0 100%)",
  },
  neon: {
    title: "Sweep",
    subtitle: "First click is always safe",
    buttonText: "Reset Grid",
    triggerText: "Open Sweep",
    glow: "rgba(129,140,248,0.22)",
    background: "linear-gradient(160deg, #06050c 0%, #100a1c 100%)",
    lightBackground: "linear-gradient(160deg, #eef2ff 0%, #e0e7ff 100%)",
  },
  gold: {
    title: "Field",
    subtitle: "Beginner to expert",
    buttonText: "New Board",
    triggerText: "Start Field",
    glow: "rgba(251,191,36,0.20)",
    background: "linear-gradient(160deg, #0c0904 0%, #1a1206 100%)",
    lightBackground: "linear-gradient(160deg, #fff7ed 0%, #fde8cf 100%)",
  },
  tide: {
    title: "Clear",
    subtitle: "Left open · right flag",
    buttonText: "Replay",
    triggerText: "Play Clear",
    glow: "rgba(45,212,191,0.20)",
    background: "linear-gradient(160deg, #04080a 0%, #081619 100%)",
    lightBackground: "linear-gradient(160deg, #ecfeff 0%, #cffafe 100%)",
  },
};

const SETTINGS: Record<MinesweeperDifficulty, { rows: number; cols: number; mines: number; label: string }> = {
  beginner: { rows: 9, cols: 9, mines: 10, label: "Beginner" },
  intermediate: { rows: 16, cols: 16, mines: 40, label: "Medium" },
  expert: { rows: 16, cols: 30, mines: 99, label: "Expert" },
};

function MineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="#ffc93c" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="#fffceb" strokeWidth="1.6" />
    </svg>
  );
}

export interface MinesweeperGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  theme?: MinesweeperTheme;
  lightMode?: boolean;
  accentColor?: string;
  difficulty?: MinesweeperDifficulty;
  asPopup?: boolean;
  trigger?: MinesweeperTrigger;
  delaySeconds?: number;
  widgetPosition?: MinesweeperWidgetPosition;
  widgetIcon?: string;
}

export function MinesweeperGame({
  theme = "night",
  lightMode = false,
  accentColor = "#ffffff",
  difficulty: difficultyProp = "beginner",
  asPopup = false,
  trigger = "manual",
  delaySeconds = 4,
  widgetPosition = "bottom-right",
  widgetIcon,
  className,
  style,
  ...props
}: MinesweeperGameProps) {
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const gameRootRef = React.useRef<HTMLDivElement>(null);
  const widgetTriggerRef = React.useRef<HTMLButtonElement>(null);
  const gridHostRef = React.useRef<HTMLDivElement>(null);
  const delayTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const isVisibleRef = React.useRef(true);
  const wasPopupOpenRef = React.useRef(false);

  const [difficulty, setDifficulty] = React.useState<MinesweeperDifficulty>(difficultyProp);
  const [board, setBoard] = React.useState<number[]>([]);
  const [revealed, setRevealed] = React.useState<boolean[]>([]);
  const [flagged, setFlagged] = React.useState<boolean[]>([]);
  const [gameStatus, setGameStatus] = React.useState<GameStatus>("ready");
  const [time, setTime] = React.useState(0);
  const [minesLeft, setMinesLeft] = React.useState(SETTINGS[difficultyProp].mines);
  const [firstClick, setFirstClick] = React.useState(true);
  const [popupOpen, setPopupOpen] = React.useState(!asPopup);
  const [scrollTriggered, setScrollTriggered] = React.useState(false);
  const [prevAsPopup, setPrevAsPopup] = React.useState(asPopup);
  const [boardScale, setBoardScale] = React.useState(1);
  const [focused, setFocused] = React.useState(false);

  if (asPopup !== prevAsPopup) {
    setPrevAsPopup(asPopup);
    setPopupOpen(!asPopup);
  }

  const config = SETTINGS[difficulty] || SETTINGS.beginner;
  const { rows, cols, mines } = config;
  const totalCells = rows * cols;
  const cellSize = difficulty === "expert" ? 14 : difficulty === "intermediate" ? 17 : 22;
  const cardMax = difficulty === "expert" ? 560 : difficulty === "intermediate" ? 500 : 420;
  const activeTheme = THEMES[theme];
  const widgetOnRight = widgetPosition !== "bottom-left";
  const widgetGlowStrong = activeTheme.glow.replace(/,\s*[\d.]+\)$/, ", 0.85)");
  const resolvedAccent = accentColor || "#ffffff";
  const gridGap = 3;
  const gridPad = 16;
  const gridW = cols * cellSize + (cols - 1) * gridGap + gridPad;
  const gridH = rows * cellSize + (rows - 1) * gridGap + gridPad;

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
        cell: "rgba(23,26,33,0.06)",
        cellOpen: "rgba(23,26,33,0.03)",
        cellBoom: "rgba(23,26,33,0.12)",
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
        cell: "rgba(255,255,255,0.08)",
        cellOpen: "rgba(255,255,255,0.03)",
        cellBoom: "rgba(255,255,255,0.16)",
        focusRing: "0 0 0 2px rgba(255,255,255,0.45)",
      };

  const numberColors = lightMode
    ? ["", "#1d4ed8", "#15803d", "#b91c1c", "#1e3a8a", "#7f1d1d", "#0f766e", "#111", "#6b7280"]
    : ["", "#93c5fd", "#86efac", "#fca5a5", "#bfdbfe", "#fecaca", "#5eead4", "#fff", "#9ca3af"];

  React.useEffect(() => {
    return () => {
      clearTimeout(delayTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
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
    const el = gridHostRef.current;
    if (!el) return;
    const apply = (w: number) => {
      const next = w <= 0 ? 1 : Math.min(1, w / gridW);
      setBoardScale(next);
    };
    apply(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => apply(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [gridW, popupOpen, asPopup]);

  React.useEffect(() => {
    if (!asPopup) return;
    if (popupOpen) gameRootRef.current?.focus();
    else if (wasPopupOpenRef.current) widgetTriggerRef.current?.focus();
    wasPopupOpenRef.current = popupOpen;
  }, [asPopup, popupOpen]);

  const initBoard = React.useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setBoard(Array(totalCells).fill(0));
    setRevealed(Array(totalCells).fill(false));
    setFlagged(Array(totalCells).fill(false));
    setGameStatus("ready");
    setTime(0);
    setMinesLeft(mines);
    setFirstClick(true);
  }, [totalCells, mines]);

  React.useEffect(() => {
    initBoard();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [difficulty, initBoard]);

  const getNeighbors = (index: number) => {
    const r = Math.floor(index / cols);
    const c = index % cols;
    const res: number[] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) res.push(nr * cols + nc);
      }
    }
    return res;
  };

  const placeMines = (firstIndex: number) => {
    const newBoard = Array(totalCells).fill(0);
    let placed = 0;
    while (placed < mines) {
      const idx = Math.floor(Math.random() * totalCells);
      if (idx !== firstIndex && newBoard[idx] !== -1) {
        newBoard[idx] = -1;
        placed++;
      }
    }
    for (let i = 0; i < totalCells; i++) {
      if (newBoard[i] === -1) continue;
      let count = 0;
      getNeighbors(i).forEach((n) => {
        if (newBoard[n] === -1) count++;
      });
      newBoard[i] = count;
    }
    setBoard(newBoard);
    return newBoard;
  };

  const revealCells = (index: number, currentBoard: number[], currentRevealed: boolean[], currentFlagged: boolean[]): boolean[] => {
    if (currentRevealed[index] || currentFlagged[index]) return currentRevealed;
    const next = [...currentRevealed];
    next[index] = true;
    if (currentBoard[index] === 0) {
      getNeighbors(index).forEach((n) => {
        if (!next[n]) {
          const deeper = revealCells(n, currentBoard, next, currentFlagged);
          deeper.forEach((v, i) => {
            next[i] = v;
          });
        }
      });
    }
    return next;
  };

  const handleClick = (index: number) => {
    if (gameStatus === "won" || gameStatus === "lost" || flagged[index]) return;
    let currentBoard = board;
    if (firstClick) {
      currentBoard = placeMines(index);
      setFirstClick(false);
      setGameStatus("playing");
      timerRef.current = setInterval(() => {
        if (!isVisibleRef.current) return;
        setTime((t) => t + 1);
      }, 1000);
    }
    if (currentBoard[index] === -1) {
      const allRevealed = revealed.map((_, i) => (currentBoard[i] === -1 ? true : revealed[i]));
      allRevealed[index] = true;
      setRevealed(allRevealed);
      setGameStatus("lost");
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    const newRevealed = revealCells(index, currentBoard, revealed, flagged);
    setRevealed(newRevealed);
    const unrevealed = newRevealed.filter((r) => !r).length;
    if (unrevealed === mines) {
      setGameStatus("won");
      if (timerRef.current) clearInterval(timerRef.current);
      setFlagged(currentBoard.map((v) => v === -1));
      setMinesLeft(0);
    }
  };

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    if (gameStatus === "won" || gameStatus === "lost" || revealed[index]) return;
    const next = [...flagged];
    next[index] = !next[index];
    setFlagged(next);
    setMinesLeft((prev) => (next[index] ? prev - 1 : prev + 1));
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const gameCard = (
    <div
      ref={gameRootRef}
      tabIndex={0}
      role="application"
      aria-label={`${activeTheme.title} minesweeper`}
      onPointerDown={() => gameRootRef.current?.focus()}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="relative box-border flex w-full flex-col items-center overflow-hidden rounded-[22px] font-sans outline-none select-none"
      style={{
        background: lightMode ? activeTheme.lightBackground : activeTheme.background,
        border: `1px solid ${mode.cardBorder}`,
        boxShadow: focused ? mode.focusRing : "none",
        maxWidth: cardMax,
        padding: difficulty === "beginner" ? "28px 22px" : "20px 16px",
        ...(asPopup ? { maxHeight: `calc(100vh - 56px)`, overflow: "hidden" } : {}),
      }}
    >
      <header className="mb-3 w-full text-center">
        <p className="m-0 mb-1.5 text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: mode.inkFaint }}>
          Browser puzzle
        </p>
        <h2 id={`${uid}-title`} className="m-0 font-serif text-[25px] font-normal tracking-[-0.02em]" style={{ color: mode.ink }}>
          {activeTheme.title}
        </h2>
        <div className="mx-auto my-2.5 h-px w-8" style={{ background: mode.divider }} />
        <p className="m-0 text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: mode.inkFaint }}>
          {activeTheme.subtitle}
        </p>
      </header>

      <div className="mb-3 flex w-full max-w-[380px] gap-2" aria-live="polite">
        {[
          { label: "Mines", value: minesLeft.toString().padStart(2, "0") },
          { label: "Time", value: formatTime(time) },
          { label: "Level", value: config.label },
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

      <div role="group" aria-label="Difficulty" className="mb-3 flex flex-wrap justify-center gap-2">
        {(Object.keys(SETTINGS) as MinesweeperDifficulty[]).map((level) => {
          const on = difficulty === level;
          return (
            <button
              key={level}
              type="button"
              aria-pressed={on}
              onClick={() => setDifficulty(level)}
              className="min-w-[72px] cursor-pointer rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[0.08em] uppercase transition-colors"
              style={{ background: on ? resolvedAccent : mode.surface, color: on ? "#0a0a0f" : mode.ink, border: `1px solid ${mode.surfaceBorder}` }}
            >
              {SETTINGS[level].label}
            </button>
          );
        })}
      </div>

      <motion.button
        type="button"
        onClick={initBoard}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mb-3.5 rounded-full border-none px-7 py-3 text-xs font-bold tracking-[0.1em] text-[#0a0a0f] uppercase"
        style={{ background: resolvedAccent }}
      >
        {activeTheme.buttonText}
      </motion.button>

      <div ref={gridHostRef} className="w-full overflow-hidden" style={{ maxWidth: cardMax }}>
        <div className="flex justify-center" style={{ height: gridH * boardScale }}>
          <div
            className="grid w-max gap-[3px] rounded-[14px] p-2"
            style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`, border: `1px solid ${mode.surfaceBorder}`, transform: `scale(${boardScale})`, transformOrigin: "top center" }}
          >
            {Array.from({ length: totalCells }).map((_, i) => {
              const isOpen = revealed[i];
              const isMine = board[i] === -1;
              const boom = isOpen && isMine && gameStatus === "lost";
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={flagged[i] ? "Flagged" : isOpen ? (isMine ? "Mine" : board[i] > 0 ? `${board[i]} adjacent` : "Empty") : "Hidden cell"}
                  onClick={() => handleClick(i)}
                  onContextMenu={(e) => handleRightClick(e, i)}
                  disabled={gameStatus === "won" || gameStatus === "lost"}
                  className="cursor-pointer rounded-[4px] border-none p-0 font-bold transition-colors"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    lineHeight: `${cellSize}px`,
                    fontSize: cellSize > 16 ? 11 : 9,
                    background: boom ? mode.cellBoom : isOpen ? mode.cellOpen : mode.cell,
                    color: board[i] > 0 && isOpen ? numberColors[board[i]] : mode.ink,
                  }}
                >
                  {flagged[i] && !isOpen ? "▴" : isOpen && isMine ? "●" : isOpen && board[i] > 0 ? board[i] : ""}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <p className="mt-3 mb-0 text-center text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: mode.inkFaint }}>
        Click to open · hold to flag
      </p>

      <AnimatePresence>
        {(gameStatus === "won" || gameStatus === "lost") && (
          <motion.div
            role="dialog"
            aria-labelledby={`${uid}-end`}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[6px]"
            style={{ background: mode.overlayBg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-[280px] rounded-[18px] px-6 py-7 text-center backdrop-blur-[20px]" style={{ background: mode.modalBg, border: `1px solid ${mode.modalBorder}` }}>
              <h3 id={`${uid}-end`} className="m-0 font-serif text-[22px] font-normal" style={{ color: mode.ink }}>
                {gameStatus === "won" ? "Field cleared" : "Mine hit"}
              </h3>
              <div className="mx-auto mt-3 mb-3.5 h-px w-7" style={{ background: mode.divider }} />
              <p className="m-0 mb-2 text-[13px]" style={{ color: mode.inkSoft }}>
                {formatTime(time)} · {config.label}
              </p>
              <button type="button" onClick={initBoard} className="w-full rounded-full border-none px-4 py-3.5 text-xs font-bold tracking-[0.1em] text-[#0a0a0f] uppercase" style={{ background: resolvedAccent }}>
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
              <MineIcon />
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
              className="relative w-full"
              style={{ maxWidth: cardMax }}
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
