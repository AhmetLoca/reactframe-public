"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const btnClass = "cursor-pointer rounded-lg border px-4 py-1.5 text-[13px] font-medium transition-colors";

export type DinoDifficulty = "easy" | "medium" | "hard";
export type DinoTrigger = "manual" | "delay" | "scroll";
export type DinoWidgetPosition = "bottom-right" | "bottom-left";
type GameState = "menu" | "playing" | "gameover";

interface Obstacle {
  x: number;
  width: number;
  height: number;
  passed?: boolean;
}

const SPEED_MAP: Record<DinoDifficulty, number> = { easy: 5, medium: 7, hard: 9.5 };
const CANVAS_H = 320;

function drawDino(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  ctx.fillStyle = "#333";
  ctx.fillRect(x + 8, y + 12, 28, 24);
  ctx.fillRect(x + 28, y + 4, 18, 16);
  ctx.fillStyle = "#fafafa";
  ctx.fillRect(x + 38, y + 8, 4, 4);
  ctx.fillStyle = "#333";
  const legOffset = Math.floor(frame / 6) % 2 === 0 ? 0 : 4;
  ctx.fillRect(x + 10, y + 36, 6, 12 - legOffset);
  ctx.fillRect(x + 24, y + 36, 6, 12 + legOffset - 4);
  ctx.fillRect(x, y + 18, 10, 6);
}

function drawCactus(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = "#2d5a27";
  ctx.fillRect(x + w * 0.3, y, w * 0.4, h);
  ctx.fillRect(x, y + h * 0.3, w * 0.35, w * 0.35);
  ctx.fillRect(x + w * 0.65, y + h * 0.5, w * 0.35, w * 0.3);
}

function DinoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="12" height="8" fill="#fff" />
      <rect x="14" y="6" width="7" height="7" fill="#fff" />
      <rect x="18" y="8" width="2" height="2" fill="#111" />
      <rect x="2" y="12" width="4" height="3" fill="#fff" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export interface DinoRunnerGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  defaultDifficulty?: DinoDifficulty;
  storageKey?: string;
  asPopup?: boolean;
  trigger?: DinoTrigger;
  delaySeconds?: number;
  widgetPosition?: DinoWidgetPosition;
  widgetIcon?: string;
}

export function DinoRunnerGame({
  defaultDifficulty = "medium",
  storageKey = "",
  asPopup = false,
  trigger = "manual",
  delaySeconds = 4,
  widgetPosition = "bottom-right",
  widgetIcon,
  className,
  style,
  ...props
}: DinoRunnerGameProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const focusRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = React.useRef<HTMLDivElement>(null);
  const widgetTriggerRef = React.useRef<HTMLButtonElement>(null);
  const isVisibleRef = React.useRef(true);
  const mountedRef = React.useRef(true);
  const wasPopupOpenRef = React.useRef(false);
  const delayTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const suffix = storageKey.trim() ? `-${storageKey.trim()}` : "";
  const highScoreKey = `dino-highscore${suffix}`;

  const [score, setScore] = React.useState(0);
  const [highScore, setHighScore] = React.useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = localStorage.getItem(highScoreKey);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [gameState, setGameState] = React.useState<GameState>("menu");
  const [difficulty, setDifficulty] = React.useState<DinoDifficulty>(defaultDifficulty);
  const [isVisible, setIsVisible] = React.useState(true);
  const [popupOpen, setPopupOpen] = React.useState(!asPopup);
  const [scrollTriggered, setScrollTriggered] = React.useState(false);
  const [prevAsPopup, setPrevAsPopup] = React.useState(asPopup);

  if (asPopup !== prevAsPopup) {
    setPrevAsPopup(asPopup);
    setPopupOpen(!asPopup);
  }

  const widgetOnRight = widgetPosition !== "bottom-left";

  const gameRef = React.useRef({
    dinoY: 0,
    dinoVY: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    speed: SPEED_MAP[defaultDifficulty],
    frame: 0,
    score: 0,
    animationId: 0,
    groundY: CANVAS_H - 48,
    width: 640,
    height: CANVAS_H,
  });

  const focusGame = React.useCallback(() => {
    focusRef.current?.focus({ preventScroll: true });
  }, []);

  const sizeCanvas = React.useCallback(() => {
    const wrap = canvasWrapRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const g = gameRef.current;
    // Layout width (offsetWidth ignores CSS transforms, so a scaled container can't squash the
    // course), and a backing store at the device pixel ratio so the pixel art stays sharp on
    // high-density screens. The game itself keeps drawing in CSS px.
    const w = Math.max(320, Math.floor(wrap?.offsetWidth || 640));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(CANVAS_H * dpr);
    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.width = w;
    g.height = CANVAS_H;
    g.groundY = CANVAS_H - 48;
    if (!g.isJumping) g.dinoY = g.groundY - 48;
  }, []);

  const paintIdle = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = gameRef.current;
    const w = g.width || 640;
    const h = g.height || CANVAS_H;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, g.groundY + 2);
    ctx.lineTo(w, g.groundY + 2);
    ctx.stroke();
    drawDino(ctx, 60, g.groundY - 48, 0);
    drawCactus(ctx, Math.max(180, w * 0.62), g.groundY - 44, 22, 44);
  }, []);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
    if (asPopup && !popupOpen && wasPopupOpenRef.current) widgetTriggerRef.current?.focus();
    wasPopupOpenRef.current = popupOpen;
  }, [asPopup, popupOpen]);

  React.useEffect(() => {
    if (asPopup && !popupOpen) return;
    let id1 = 0;
    let id2 = 0;
    id1 = requestAnimationFrame(() => {
      sizeCanvas();
      paintIdle();
      focusGame();
      id2 = requestAnimationFrame(() => {
        sizeCanvas();
        if (gameState !== "playing") paintIdle();
        focusGame();
      });
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [popupOpen, asPopup, sizeCanvas, paintIdle, gameState, focusGame]);

  React.useEffect(() => {
    const el = focusRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [popupOpen]);

  React.useEffect(() => {
    const wrap = canvasWrapRef.current;
    if (!wrap) return;
    sizeCanvas();
    paintIdle();
    const ro = new ResizeObserver(() => {
      sizeCanvas();
      if (gameRef.current.animationId === 0 || gameState !== "playing") paintIdle();
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [sizeCanvas, paintIdle, popupOpen, asPopup, gameState]);

  React.useEffect(() => {
    sizeCanvas();
    if (gameState !== "playing" || !isVisible) {
      paintIdle();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const g = gameRef.current;
    g.speed = SPEED_MAP[difficulty];
    g.obstacles = [];
    g.score = 0;
    g.frame = 0;
    g.dinoY = g.groundY - 48;
    g.dinoVY = 0;
    g.isJumping = false;
    setScore(0);

    const spawnObstacle = () => {
      g.obstacles.push({ x: g.width + 20, width: 18 + Math.random() * 12, height: 30 + Math.random() * 25 });
    };
    spawnObstacle();

    const loop = () => {
      if (!mountedRef.current || !isVisibleRef.current) return;
      g.frame++;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, g.width, g.height);
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, g.groundY + 2);
      ctx.lineTo(g.width, g.groundY + 2);
      ctx.stroke();

      if (g.isJumping) {
        g.dinoVY += 0.85;
        g.dinoY += g.dinoVY;
        if (g.dinoY >= g.groundY - 48) {
          g.dinoY = g.groundY - 48;
          g.dinoVY = 0;
          g.isJumping = false;
        }
      }

      drawDino(ctx, 60, g.dinoY, g.frame);

      for (let i = g.obstacles.length - 1; i >= 0; i--) {
        const obs = g.obstacles[i];
        obs.x -= g.speed;
        drawCactus(ctx, obs.x, g.groundY - obs.height, obs.width, obs.height);

        if (60 + 36 > obs.x && 60 < obs.x + obs.width && g.dinoY + 48 > g.groundY - obs.height) {
          setGameState("gameover");
          if (g.score > highScore) {
            setHighScore(g.score);
            try {
              localStorage.setItem(highScoreKey, String(g.score));
            } catch {
              /* ignore */
            }
          }
          return;
        }

        if (obs.x + obs.width < 60 && !obs.passed) {
          obs.passed = true;
          g.score += 1;
          setScore(g.score);
        }
        if (obs.x + obs.width < 0) g.obstacles.splice(i, 1);
      }

      if (g.obstacles.length === 0 || g.obstacles[g.obstacles.length - 1].x < g.width - 280 - Math.random() * 200) spawnObstacle();
      if (g.frame % 400 === 0) g.speed += 0.25;

      g.animationId = requestAnimationFrame(loop);
    };

    g.animationId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(g.animationId);
      g.animationId = 0;
    };
  }, [gameState, difficulty, isVisible, highScore, highScoreKey, sizeCanvas, paintIdle]);

  const jump = React.useCallback(() => {
    if (gameState === "menu") {
      setGameState("playing");
      return;
    }
    if (gameState !== "playing") return;
    const g = gameRef.current;
    if (!g.isJumping) {
      g.isJumping = true;
      g.dinoVY = -14.5;
    }
  }, [gameState]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && asPopup) {
      e.preventDefault();
      setPopupOpen(false);
      return;
    }
    if (e.code === "Space" || e.key === " " || e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
      jump();
    }
    if (e.key === "Enter" && gameState !== "playing") {
      e.preventDefault();
      jump();
    }
  };

  const gameCard = (
    <div
      ref={focusRef}
      role="application"
      aria-label="Dino Runner Game"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onClick={focusGame}
      className="box-border flex w-full flex-col items-center rounded-[22px] bg-[#fafafa] px-4 pt-6 pb-4 font-sans outline-none select-none"
    >
      <header className="mb-4 w-full max-w-[640px] text-center">
        <h2 className="m-0 text-[22px] font-semibold text-[#111]">Dino Runner Game</h2>
        <p className="mt-1.5 text-[13px] text-[#888]">Space / Arrow Up / tap to jump</p>
        <p className="mx-auto mt-2 max-w-[520px] text-[13px] leading-[1.45] text-[#888]">Endless runner. Jump over cacti and beat your high score.</p>
        <div aria-live="polite" className="mt-3 flex justify-center gap-6 text-sm text-[#888]">
          <span>
            Score: <b className="text-[#111]">{score}</b>
          </span>
          <span>
            Best: <b className="text-[#111]">{highScore}</b>
          </span>
        </div>
        <div role="radiogroup" aria-label="Difficulty" className="mt-3.5 flex flex-wrap justify-center gap-2">
          {(["easy", "medium", "hard"] as DinoDifficulty[]).map((level) => {
            const selected = difficulty === level;
            return (
              <button
                key={level}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setDifficulty(level);
                  if (gameState === "playing") setGameState("menu");
                }}
                className={btnClass}
                style={{ background: selected ? "#111" : "white", color: selected ? "white" : "#333", borderColor: selected ? "#111" : "#e0e0e0", transitionTimingFunction: "ease" }}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            );
          })}
        </div>
      </header>

      <div
        ref={canvasWrapRef}
        onPointerDown={(e) => {
          e.preventDefault();
          focusGame();
          jump();
        }}
        className="relative w-full max-w-[900px] shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
        style={{ height: CANVAS_H, minHeight: CANVAS_H }}
      >
        <canvas ref={canvasRef} role="img" aria-label="Dino Runner Game. Press Space to jump." className="block h-[320px] w-full bg-white" />

        {gameState === "menu" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(250,250,250,0.92)] p-4 text-center">
            <div className="mb-2 text-[28px] font-semibold text-[#111]">Ready?</div>
            <div className="mb-5 text-sm text-[#888]">Press Space or tap to start</div>
            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                jump();
              }}
              className={cn(btnClass, "bg-[#111] px-7 py-2.5 text-white")}
              style={{ borderColor: "#111", transitionTimingFunction: "ease" }}
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(250,250,250,0.92)] p-4 text-center">
            <div className="mb-2 text-[28px] font-semibold text-[#111]">Game Over</div>
            <div className="mb-1.5 text-[15px] text-[#888]">Score: {score}</div>
            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                setGameState("playing");
              }}
              className={cn(btnClass, "mt-3 bg-[#111] px-7 py-2.5 text-white")}
              style={{ borderColor: "#111", transitionTimingFunction: "ease" }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-[#aaa]">Space, Arrow Up or tap to jump</p>
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
      {!popupOpen && (
        <div className={cn("flex", widgetOnRight ? "justify-end" : "justify-start")}>
          <motion.button
            ref={widgetTriggerRef}
            type="button"
            onClick={() => {
              setPopupOpen(true);
              setGameState("menu");
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Play Dino"
            className="flex items-center gap-3 rounded-full border border-[rgba(23,26,33,0.08)] bg-white py-1.5 pr-5 pl-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#121212]">
              {widgetIcon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={widgetIcon} alt="" className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <DinoIcon />
              )}
            </span>
            <span className="flex flex-col gap-0.5 text-left">
              <span className="text-[9px] font-bold tracking-[0.1em] whitespace-nowrap text-[rgba(23,26,33,0.4)] uppercase">Mini game</span>
              <span className="text-[13px] font-bold tracking-[0.02em] whitespace-nowrap text-[#171a21] uppercase">Play Dino</span>
            </span>
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {popupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setPopupOpen(false);
            }}
            className="fixed inset-0 z-[10001] flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.72)" }}
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Dino Runner Game"
              onKeyDown={onKeyDown}
              className="relative w-full rounded-[22px]"
              style={{ maxWidth: 640 }}
            >
              <button
                type="button"
                onClick={() => setPopupOpen(false)}
                aria-label="Close"
                className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(0,0,0,0.12)] bg-[#111] p-0 text-white"
              >
                <CloseIcon />
              </button>
              {gameCard}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
