"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };
type GameState = "ready" | "playing" | "gameover";
export type SnakeDifficulty = "easy" | "medium" | "hard";
export type SnakeTheme = "classic" | "violet" | "retro";
export type SnakeTrigger = "manual" | "delay" | "scroll";
export type SnakeWidgetPosition = "bottom-right" | "bottom-left";

interface ThemeConfig {
  title: string;
  subtitle: string;
  triggerText: string;
  cardBackground: string;
  boardBackground: string;
  gridColor: string;
  snakeHead: string;
  snakeBody: string;
  foodColor: string;
  accentColor: string;
  glow: string;
}

const THEMES: Record<SnakeTheme, ThemeConfig> = {
  classic: {
    title: "Snake",
    subtitle: "Eat, grow, don't crash",
    triggerText: "Play Snake",
    cardBackground: "linear-gradient(160deg, #f4f6fa 0%, #e8edf4 100%)",
    boardBackground: "#ffffff",
    gridColor: "#ececec",
    snakeHead: "#111111",
    snakeBody: "#333333",
    foodColor: "#ef4444",
    accentColor: "#111111",
    glow: "rgba(17,17,17,0.12)",
  },
  violet: {
    title: "Violet Snake",
    subtitle: "Soft arcade high score hunt",
    triggerText: "Play Violet Snake",
    cardBackground: "linear-gradient(160deg, #eef2ff 0%, #e0e7ff 100%)",
    boardBackground: "#ffffff",
    gridColor: "#e4e7fb",
    snakeHead: "#4338ca",
    snakeBody: "#6366f1",
    foodColor: "#db2777",
    accentColor: "#4f46e5",
    glow: "rgba(79,70,229,0.18)",
  },
  retro: {
    title: "Pixel Snake",
    subtitle: "Old-school high score hunt",
    triggerText: "Play Pixel Snake",
    cardBackground: "linear-gradient(160deg, #fff7ed 0%, #fde8cf 100%)",
    boardBackground: "#fffdf8",
    gridColor: "#f3e6d4",
    snakeHead: "#3f6212",
    snakeBody: "#65a30d",
    foodColor: "#ea580c",
    accentColor: "#3f6212",
    glow: "rgba(63,98,18,0.16)",
  },
};

const GAME_KEYS = ["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " "];

export interface SnakeGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  theme?: SnakeTheme;
  asPopup?: boolean;
  trigger?: SnakeTrigger;
  delaySeconds?: number;
  widgetPosition?: SnakeWidgetPosition;
  defaultDifficulty?: SnakeDifficulty;
  gridSize?: number;
  storageKey?: string;
}

export function SnakeGame({
  theme = "classic",
  asPopup = false,
  trigger = "manual",
  delaySeconds = 4,
  widgetPosition = "bottom-right",
  defaultDifficulty = "medium",
  gridSize = 15,
  storageKey = "",
  className,
  style,
  ...props
}: SnakeGameProps) {
  const uid = React.useId();
  const titleId = `${uid}-title`;
  const hintId = `${uid}-hint`;
  const statusId = `${uid}-status`;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const gameRootRef = React.useRef<HTMLDivElement>(null);
  const popupCardRef = React.useRef<HTMLDivElement>(null);
  const widgetTriggerRef = React.useRef<HTMLButtonElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const boardWrapRef = React.useRef<HTMLDivElement>(null);
  const isVisibleRef = React.useRef(true);
  const wasPopupOpenRef = React.useRef(false);
  const delayTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [popupOpen, setPopupOpen] = React.useState(!asPopup);
  const [scrollTriggered, setScrollTriggered] = React.useState(false);
  const [prevAsPopup, setPrevAsPopup] = React.useState(asPopup);

  if (asPopup !== prevAsPopup) {
    setPrevAsPopup(asPopup);
    setPopupOpen(!asPopup);
  }

  const activeTheme = THEMES[theme];
  const widgetOnRight = widgetPosition !== "bottom-left";
  const suffix = storageKey.trim() ? `-${storageKey.trim()}` : "";
  const highScoreKey = `snake-highscore${suffix}`;
  const cells = Math.max(8, Math.min(24, gridSize));

  const [score, setScore] = React.useState(0);
  const [highScore, setHighScore] = React.useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = localStorage.getItem(highScoreKey);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [gameState, setGameState] = React.useState<GameState>("ready");
  const [difficulty, setDifficulty] = React.useState<SnakeDifficulty>(defaultDifficulty);

  const snakeRef = React.useRef<Point[]>([{ x: Math.floor(cells / 2), y: Math.floor(cells / 2) }]);
  const directionRef = React.useRef<Direction>("RIGHT");
  const nextDirectionRef = React.useRef<Direction>("RIGHT");
  const foodRef = React.useRef<Point>({ x: 3, y: 3 });
  const cellSizeRef = React.useRef(24);
  const speedRef = React.useRef(110);
  const lastTimeRef = React.useRef(0);
  const animationRef = React.useRef(0);
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const scoreRef = React.useRef(0);
  const highScoreRef = React.useRef(highScore);
  const gameStateRef = React.useRef<GameState>("ready");

  React.useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  React.useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);
  React.useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  React.useEffect(() => {
    if (difficulty === "easy") speedRef.current = 160;
    else if (difficulty === "medium") speedRef.current = 110;
    else speedRef.current = 70;
  }, [difficulty]);

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
    isVisibleRef.current = true;
    const el = gameRootRef.current ?? boardWrapRef.current ?? rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [popupOpen, asPopup]);

  React.useEffect(() => {
    if (asPopup && popupOpen) {
      const focusTimer = setTimeout(() => gameRootRef.current?.focus(), 30);
      const body = document.body;
      const html = document.documentElement;
      const prevBodyOverflow = body.style.overflow;
      const prevHtmlOverflow = html.style.overflow;
      const prevBodyPad = body.style.paddingRight;
      const scrollbar = window.innerWidth - html.clientWidth;
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

      return () => {
        clearTimeout(focusTimer);
        body.style.overflow = prevBodyOverflow;
        html.style.overflow = prevHtmlOverflow;
        body.style.paddingRight = prevBodyPad;
      };
    }

    if (asPopup && !popupOpen && wasPopupOpenRef.current) {
      widgetTriggerRef.current?.focus();
    }
    wasPopupOpenRef.current = popupOpen;
  }, [asPopup, popupOpen]);

  const placeFood = (snake: Point[]) => {
    let newFood: Point;
    do {
      newFood = { x: Math.floor(Math.random() * cells), y: Math.floor(Math.random() * cells) };
    } while (snake.some((s) => s.x === newFood.x && s.y === newFood.y));
    foodRef.current = newFood;
  };

  const resetGame = React.useCallback(() => {
    const mid = Math.floor(cells / 2);
    snakeRef.current = [{ x: mid, y: mid }];
    directionRef.current = "RIGHT";
    nextDirectionRef.current = "RIGHT";
    placeFood(snakeRef.current);
    scoreRef.current = 0;
    setScore(0);
    setGameState("ready");
    gameStateRef.current = "ready";
  }, [cells]);

  const startGame = React.useCallback(() => {
    if (gameStateRef.current === "gameover") resetGame();
    setGameState("playing");
    gameStateRef.current = "playing";
    isVisibleRef.current = true;
    gameRootRef.current?.focus();
  }, [resetGame]);

  const endGame = React.useCallback(() => {
    setGameState("gameover");
    gameStateRef.current = "gameover";
    const current = scoreRef.current;
    if (current > highScoreRef.current) {
      highScoreRef.current = current;
      setHighScore(current);
      try {
        localStorage.setItem(highScoreKey, String(current));
      } catch {
        /* ignore */
      }
    }
  }, [highScoreKey]);

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = cellSizeRef.current;
    const w = cells * size;
    const h = cells * size;

    ctx.fillStyle = activeTheme.boardBackground;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = activeTheme.gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= cells; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(w, i * size);
      ctx.stroke();
    }

    const food = foodRef.current;
    ctx.fillStyle = activeTheme.foodColor;
    ctx.beginPath();
    ctx.roundRect(food.x * size + 3, food.y * size + 3, size - 6, size - 6, 6);
    ctx.fill();

    snakeRef.current.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? activeTheme.snakeHead : activeTheme.snakeBody;
      ctx.beginPath();
      ctx.roundRect(segment.x * size + 2, segment.y * size + 2, size - 4, size - 4, isHead ? 8 : 5);
      ctx.fill();

      if (isHead) {
        ctx.fillStyle = "#ffffff";
        const eyeSize = Math.max(2, size * 0.12);
        let eye1 = { x: 0, y: 0 };
        let eye2 = { x: 0, y: 0 };
        if (directionRef.current === "RIGHT") {
          eye1 = { x: segment.x * size + size - size * 0.36, y: segment.y * size + size * 0.28 };
          eye2 = { x: segment.x * size + size - size * 0.36, y: segment.y * size + size - size * 0.4 };
        } else if (directionRef.current === "LEFT") {
          eye1 = { x: segment.x * size + size * 0.24, y: segment.y * size + size * 0.28 };
          eye2 = { x: segment.x * size + size * 0.24, y: segment.y * size + size - size * 0.4 };
        } else if (directionRef.current === "UP") {
          eye1 = { x: segment.x * size + size * 0.28, y: segment.y * size + size * 0.24 };
          eye2 = { x: segment.x * size + size - size * 0.4, y: segment.y * size + size * 0.24 };
        } else {
          eye1 = { x: segment.x * size + size * 0.28, y: segment.y * size + size - size * 0.36 };
          eye2 = { x: segment.x * size + size - size * 0.4, y: segment.y * size + size - size * 0.36 };
        }
        ctx.beginPath();
        ctx.arc(eye1.x, eye1.y, eyeSize, 0, Math.PI * 2);
        ctx.arc(eye2.x, eye2.y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [activeTheme, cells]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const applySize = () => {
      const containerW = boardWrapRef.current?.clientWidth || 320;
      const maxSize = Math.min(containerW, 340);
      const size = Math.max(8, Math.floor(maxSize / cells));
      cellSizeRef.current = size;
      canvas.width = cells * size;
      canvas.height = cells * size;
      draw();
    };
    applySize();
    const target = boardWrapRef.current;
    if (!target) return;
    const ro = new ResizeObserver(() => applySize());
    ro.observe(target);
    return () => ro.disconnect();
  }, [cells, draw, popupOpen]);

  React.useEffect(() => {
    const tick = (time: number) => {
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(tick);
        return;
      }
      if (gameStateRef.current !== "playing") {
        draw();
        animationRef.current = requestAnimationFrame(tick);
        return;
      }
      if (time - lastTimeRef.current > speedRef.current) {
        lastTimeRef.current = time;
        directionRef.current = nextDirectionRef.current;
        const snake = [...snakeRef.current];
        const head = { ...snake[0] };
        if (directionRef.current === "UP") head.y -= 1;
        if (directionRef.current === "DOWN") head.y += 1;
        if (directionRef.current === "LEFT") head.x -= 1;
        if (directionRef.current === "RIGHT") head.x += 1;
        if (head.x < 0 || head.x >= cells || head.y < 0 || head.y >= cells || snake.some((s) => s.x === head.x && s.y === head.y)) {
          endGame();
          animationRef.current = requestAnimationFrame(tick);
          return;
        }
        snake.unshift(head);
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
          const next = scoreRef.current + 1;
          scoreRef.current = next;
          setScore(next);
          placeFood(snake);
        } else {
          snake.pop();
        }
        snakeRef.current = snake;
      }
      draw();
      animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationRef.current);
  }, [cells, draw, endGame, popupOpen]);

  const applyDirection = (next: Direction) => {
    const dir = directionRef.current;
    if (next === "UP" && dir !== "DOWN") nextDirectionRef.current = "UP";
    if (next === "DOWN" && dir !== "UP") nextDirectionRef.current = "DOWN";
    if (next === "LEFT" && dir !== "RIGHT") nextDirectionRef.current = "LEFT";
    if (next === "RIGHT" && dir !== "LEFT") nextDirectionRef.current = "RIGHT";
  };

  const handleGameKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key.toLowerCase();

    if (key === "escape" && asPopup) {
      e.preventDefault();
      setPopupOpen(false);
      return;
    }

    if (GAME_KEYS.includes(key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (gameStateRef.current !== "playing") {
      if (key === " " || key.startsWith("arrow") || ["w", "a", "s", "d"].includes(key)) startGame();
      return;
    }

    if (key === "arrowup" || key === "w") applyDirection("UP");
    else if (key === "arrowdown" || key === "s") applyDirection("DOWN");
    else if (key === "arrowleft" || key === "a") applyDirection("LEFT");
    else if (key === "arrowright" || key === "d") applyDirection("RIGHT");
  };

  const trapFocus = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !popupCardRef.current) return;
    const nodes = popupCardRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const list = Array.from(nodes).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
    if (list.length === 0) {
      e.preventDefault();
      gameRootRef.current?.focus();
      return;
    }
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 30) {
      if (gameState !== "playing") startGame();
      touchStartRef.current = null;
      return;
    }
    if (gameState !== "playing") {
      startGame();
      touchStartRef.current = null;
      return;
    }
    if (absDx > absDy) applyDirection(dx > 0 ? "RIGHT" : "LEFT");
    else applyDirection(dy > 0 ? "DOWN" : "UP");
    touchStartRef.current = null;
  };

  const statusText =
    gameState === "playing"
      ? `Playing. Score ${score}.`
      : gameState === "gameover"
        ? `Game over. Score ${score}. Press Space or Start to play again.`
        : "Ready. Press arrow keys, WASD, or Start to play.";

  const gameCard = (
    <div
      ref={gameRootRef}
      tabIndex={0}
      role="application"
      aria-labelledby={titleId}
      aria-describedby={`${hintId} ${statusId}`}
      onKeyDown={handleGameKeyDown}
      onClick={() => gameRootRef.current?.focus()}
      className="box-border flex w-full flex-col items-center overflow-hidden rounded-[22px] border border-[rgba(23,26,33,0.08)] px-4.5 pt-7 pb-4 font-sans text-[#111111] outline-none select-none"
      style={{ background: activeTheme.cardBackground }}
    >
      <div className="mb-3.5 w-full text-center">
        <h2 id={titleId} className="m-0 font-serif text-2xl font-normal text-[#111111]">
          {activeTheme.title}
        </h2>
        <div className="mx-auto my-2.5 h-px w-8 bg-[rgba(17,17,17,0.18)]" />
        <p className="m-0 text-[10px] font-semibold tracking-[0.16em] text-[#888888] uppercase">{activeTheme.subtitle}</p>
        <div className="mt-3 flex justify-center gap-6 text-[13px] text-[#666666]" aria-hidden="true">
          <span>
            Score <b>{score}</b>
          </span>
          <span>
            Best <b>{highScore}</b>
          </span>
        </div>
        <div id={statusId} role="status" aria-live="polite" className="sr-only">
          {statusText} Best {highScore}.
        </div>
        <div role="radiogroup" aria-label="Difficulty" className="mt-3.5 flex flex-wrap justify-center gap-2">
          {(["easy", "medium", "hard"] as const).map((level) => {
            const on = difficulty === level;
            return (
              <button
                key={level}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  setDifficulty(level);
                  if (gameState === "playing") resetGame();
                  gameRootRef.current?.focus();
                }}
                className="cursor-pointer rounded-[8px] border px-3 py-1.5 text-xs font-semibold capitalize transition-colors"
                style={{ background: on ? activeTheme.accentColor : "#ffffff", color: on ? "#ffffff" : "#111111", borderColor: on ? activeTheme.accentColor : "#e5e5e5" }}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={boardWrapRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="relative w-full max-w-[340px] overflow-hidden rounded-2xl">
        <canvas ref={canvasRef} role="img" aria-label={`${activeTheme.title} board. Score ${score}. Best ${highScore}.`} className="block h-auto w-full touch-none" />
        {gameState !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ background: "rgba(250,250,250,0.92)" }}>
            <div className="mb-1.5 text-xl font-semibold text-[#111111]">{gameState === "gameover" ? "Game Over" : "Ready?"}</div>
            <div className="mb-4 text-[13px] text-[#888888]">{gameState === "gameover" ? `Score ${score}` : "Arrow keys, WASD, or swipe"}</div>
            <button type="button" onClick={startGame} className="cursor-pointer rounded-lg border-none px-5.5 py-2.5 text-[13px] font-semibold text-white transition-transform" style={{ background: activeTheme.accentColor }}>
              {gameState === "gameover" ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}
      </div>
      <p id={hintId} className="mt-3 text-center text-xs text-[#999999]">
        Use arrow keys or WASD to move. Escape closes the widget.
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
          aria-haspopup="dialog"
          aria-expanded={popupOpen}
          aria-controls={`${uid}-dialog`}
          aria-label={activeTheme.triggerText}
          className="box-border flex max-w-full items-center gap-3 rounded-full border border-[rgba(23,26,33,0.08)] bg-white py-1.5 pr-4.5 pl-1.5"
          style={{ boxShadow: `0 8px 30px ${activeTheme.glow}, 0 4px 16px rgba(0,0,0,0.12)` }}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#121212]" aria-hidden="true">
            <span className="block h-2 w-2 shrink-0 rounded-full bg-white" />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5 text-left">
            <span className="text-[9px] font-bold tracking-[0.1em] whitespace-nowrap text-[rgba(23,26,33,0.4)] uppercase">{activeTheme.triggerText}</span>
            <span className="text-[13px] font-bold text-[#171a21] uppercase">Play now</span>
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {popupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => {
              if (e.target === e.currentTarget) e.preventDefault();
            }}
            className="fixed inset-0 z-[9999] box-border flex items-center justify-center overscroll-none p-6"
            style={{ background: "rgba(0,0,0,0.55)", touchAction: "none" }}
          >
            <motion.div
              id={`${uid}-dialog`}
              ref={popupCardRef}
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={hintId}
              tabIndex={-1}
              onKeyDown={(e) => {
                trapFocus(e);
                handleGameKeyDown(e);
              }}
              className="relative box-border w-full max-w-[400px] overflow-auto overscroll-contain rounded-[22px] outline-none"
              style={{ maxHeight: "min(640px, calc(100dvh - 48px))" }}
            >
              <button
                type="button"
                onClick={() => setPopupOpen(false)}
                aria-label="Close snake game"
                className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(23,26,33,0.12)] bg-white p-0 text-[#111111]"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
                  <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              {gameCard}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
