"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PongTheme = "arcade" | "neon" | "tournament" | "classic";
export type PongDifficulty = "easy" | "medium" | "hard";
export type PongTrigger = "manual" | "delay" | "scroll";
export type PongWidgetPosition = "bottom-right" | "bottom-left";

interface ThemeConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  triggerText: string;
  glow: string;
  background: string;
  lightBackground: string;
  courtDark: string;
  courtLight: string;
}

const THEMES: Record<PongTheme, ThemeConfig> = {
  arcade: {
    title: "Pong",
    subtitle: "First to the table wins",
    buttonText: "New Game",
    triggerText: "Play Pong",
    glow: "rgba(255,255,255,0.16)",
    background: "linear-gradient(160deg, #07080b 0%, #101319 100%)",
    lightBackground: "linear-gradient(160deg, #f4f6fa 0%, #dfe6f0 100%)",
    courtDark: "#0c0d11",
    courtLight: "#dce2ea",
  },
  neon: {
    title: "Night Match",
    subtitle: "Keep the rally alive",
    buttonText: "New Match",
    triggerText: "Open Court",
    glow: "rgba(129,140,248,0.22)",
    background: "linear-gradient(160deg, #06050c 0%, #100a1c 100%)",
    lightBackground: "linear-gradient(160deg, #eef2ff 0%, #e0e7ff 100%)",
    courtDark: "#0a0714",
    courtLight: "#dde3ff",
  },
  tournament: {
    title: "Championship",
    subtitle: "Ten rounds. One winner.",
    buttonText: "Restart Bracket",
    triggerText: "Enter Court",
    glow: "rgba(251,191,36,0.20)",
    background: "linear-gradient(160deg, #0c0904 0%, #1a1206 100%)",
    lightBackground: "linear-gradient(160deg, #fff7ed 0%, #fde8cf 100%)",
    courtDark: "#120e08",
    courtLight: "#f3e6d2",
  },
  classic: {
    title: "Table Tennis",
    subtitle: "Arrow keys or drag to play",
    buttonText: "New Game",
    triggerText: "Play a Round",
    glow: "rgba(45,212,191,0.20)",
    background: "linear-gradient(160deg, #04080a 0%, #081619 100%)",
    lightBackground: "linear-gradient(160deg, #ecfeff 0%, #cffafe 100%)",
    courtDark: "#071114",
    courtLight: "#d7f4f6",
  },
};

const DIFFICULTY: Record<PongDifficulty, { botSpeed: number; ballSpeedX: number; ballSpeedY: number; playerSpeed: number; label: string }> = {
  easy: { botSpeed: 4.2, ballSpeedX: 5.5, ballSpeedY: 3.8, playerSpeed: 7.5, label: "Easy" },
  medium: { botSpeed: 5.4, ballSpeedX: 6.8, ballSpeedY: 4.6, playerSpeed: 7.2, label: "Medium" },
  hard: { botSpeed: 6.8, ballSpeedX: 8.2, ballSpeedY: 5.6, playerSpeed: 7.0, label: "Hard" },
};

const ROUNDS = [5, 5, 5, 4, 4, 4, 3, 3, 3, 1];
const COURT_W = 800;
const COURT_H = 500;
const PADDLE_H = 90;

function PaddleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="3.2" height="14" rx="1.4" fill="#fffceb" />
      <circle cx="15.5" cy="12" r="5.2" fill="#ffc93c" />
      <circle cx="15.5" cy="12" r="1.6" fill="#fffceb" />
    </svg>
  );
}

export interface PongGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  theme?: PongTheme;
  lightMode?: boolean;
  accentColor?: string;
  asPopup?: boolean;
  trigger?: PongTrigger;
  delaySeconds?: number;
  widgetPosition?: PongWidgetPosition;
  widgetIcon?: string;
}

export function PongGame({
  theme = "arcade",
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
}: PongGameProps) {
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const gameRootRef = React.useRef<HTMLDivElement>(null);
  const widgetTriggerRef = React.useRef<HTMLButtonElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const delayTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const statusTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const rafRef = React.useRef<number | null>(null);
  const isVisibleRef = React.useRef(true);
  const playerMoveRef = React.useRef(0);
  const paddleTargetRef = React.useRef<number | null>(null);
  const startGameRef = React.useRef<(() => void) | null>(null);
  const wasPopupOpenRef = React.useRef(false);

  const [scoreA, setScoreA] = React.useState(0);
  const [scoreB, setScoreB] = React.useState(0);
  const [round, setRound] = React.useState(1);
  const [status, setStatus] = React.useState("Click the court to start");
  const [difficulty, setDifficulty] = React.useState<PongDifficulty>("medium");
  const [gameKey, setGameKey] = React.useState(0);
  const [isCoarsePointer, setIsCoarsePointer] = React.useState(false);
  const [popupOpen, setPopupOpen] = React.useState(!asPopup);
  const [scrollTriggered, setScrollTriggered] = React.useState(false);
  const [prevAsPopup, setPrevAsPopup] = React.useState(asPopup);

  if (asPopup !== prevAsPopup) {
    setPrevAsPopup(asPopup);
    setPopupOpen(!asPopup);
  }

  const activeTheme = THEMES[theme];
  const widgetOnRight = widgetPosition !== "bottom-left";
  const widgetGlowStrong = activeTheme.glow.replace(/,\s*[\d.]+\)$/, ", 0.85)");
  const resolvedAccent = accentColor || "#ffffff";
  const neededPoints = ROUNDS[round - 1] || 1;

  const mode = lightMode
    ? {
        ink: "#171a21",
        inkSoft: "rgba(23,26,33,0.7)",
        inkMuted: "rgba(23,26,33,0.5)",
        inkFaint: "rgba(23,26,33,0.4)",
        divider: "rgba(23,26,33,0.18)",
        surface: "rgba(255,255,255,0.65)",
        surfaceBorder: "rgba(23,26,33,0.1)",
        cardBorder: "rgba(23,26,33,0.08)",
        overlayBg: "rgba(255,255,255,0.82)",
        chromeBg: "#ffffff",
        chromeBorder: "rgba(23,26,33,0.1)",
        net: "rgba(23,26,33,0.28)",
        paddle: "#171a21",
        focusRing: "0 0 0 2px rgba(23,26,33,0.35)",
      }
    : {
        ink: "#ffffff",
        inkSoft: "rgba(255,255,255,0.7)",
        inkMuted: "rgba(255,255,255,0.45)",
        inkFaint: "rgba(255,255,255,0.4)",
        divider: "rgba(255,255,255,0.3)",
        surface: "rgba(255,255,255,0.06)",
        surfaceBorder: "rgba(255,255,255,0.12)",
        cardBorder: "rgba(255,255,255,0.08)",
        overlayBg: "rgba(4,4,6,0.78)",
        chromeBg: "rgba(10,10,15,0.92)",
        chromeBorder: "rgba(255,255,255,0.16)",
        net: "rgba(255,255,255,0.28)",
        paddle: "#ffffff",
        focusRing: "0 0 0 2px rgba(255,255,255,0.45)",
      };

  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    return () => {
      clearTimeout(delayTimerRef.current);
      clearTimeout(statusTimerRef.current);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: coarse)");
    const apply = () => setIsCoarsePointer(mq.matches);
    apply();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
    return undefined;
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
    if (!gameRootRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(gameRootRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!asPopup) return;
    if (popupOpen) gameRootRef.current?.focus();
    else if (wasPopupOpenRef.current) widgetTriggerRef.current?.focus();
    wasPopupOpenRef.current = popupOpen;
  }, [asPopup, popupOpen, gameKey]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = COURT_W;
    canvas.height = COURT_H;

    const settings = DIFFICULTY[difficulty];
    const court = lightMode ? activeTheme.courtLight : activeTheme.courtDark;
    let running = false;
    let gameOver = false;
    let currentRound = 0;
    let timer = 0;
    let playerTurn: "player" | "bot" | null = null;
    let cancelled = false;

    const player = { x: 40, y: COURT_H / 2 - PADDLE_H / 2, w: 14, h: PADDLE_H, speed: settings.playerSpeed, score: 0 };
    const bot = { x: COURT_W - 54, y: COURT_H / 2 - PADDLE_H / 2, w: 14, h: PADDLE_H, speed: settings.botSpeed, score: 0 };
    const ball = { x: COURT_W / 2, y: COURT_H / 2, size: 14, speedX: settings.ballSpeedX, speedY: settings.ballSpeedY, dirX: 0, dirY: 0 };

    const clampPaddle = (y: number) => {
      if (y < 0) return 0;
      if (y + PADDLE_H > COURT_H) return COURT_H - PADDLE_H;
      return y;
    };

    const resetBall = () => {
      ball.x = COURT_W / 2;
      ball.y = COURT_H / 2;
      ball.dirX = 0;
      ball.dirY = 0;
    };

    const serve = () => {
      const dir = playerTurn === "player" ? 1 : -1;
      ball.dirX = dir;
      ball.dirY = Math.random() > 0.5 ? 1 : -1;
      ball.y = (playerTurn === "player" ? player.y : bot.y) + 45;
      playerTurn = null;
    };

    const levelUp = () => {
      currentRound++;
      setRound(currentRound + 1);
      player.score = 0;
      bot.score = 0;
      setScoreA(0);
      setScoreB(0);
      player.speed += 0.2;
      bot.speed += 0.15;
      ball.speedX += 0.22;
      ball.speedY += 0.18;
    };

    const update = () => {
      if (paddleTargetRef.current !== null) {
        player.y = clampPaddle(paddleTargetRef.current);
        paddleTargetRef.current = null;
      } else {
        player.y = clampPaddle(player.y + playerMoveRef.current * player.speed);
      }

      const target = ball.y - bot.h / 2;
      if (bot.y < target - 3) bot.y += bot.speed;
      else if (bot.y > target + 3) bot.y -= bot.speed;
      bot.y = clampPaddle(bot.y);

      if (ball.dirX !== 0) {
        ball.x += ball.dirX * ball.speedX;
        ball.y += ball.dirY * ball.speedY;
      }

      if (ball.y <= 0 || ball.y + ball.size >= COURT_H) ball.dirY *= -1;

      const hitPaddle = (p: typeof player) => ball.x < p.x + p.w && ball.x + ball.size > p.x && ball.y < p.y + p.h && ball.y + ball.size > p.y;

      if (hitPaddle(player)) {
        ball.dirX = 1;
        ball.x = player.x + player.w;
      }
      if (hitPaddle(bot)) {
        ball.dirX = -1;
        ball.x = bot.x - ball.size;
      }

      if (ball.x + ball.size < 0) {
        bot.score++;
        setScoreB(bot.score);
        playerTurn = "player";
        resetBall();
        timer = performance.now();
      }
      if (ball.x > COURT_W) {
        player.score++;
        setScoreA(player.score);
        playerTurn = "bot";
        resetBall();
        timer = performance.now();
      }

      if (playerTurn && performance.now() - timer > 900) serve();

      const needed = ROUNDS[currentRound] || 1;
      if (player.score >= needed) {
        if (currentRound >= ROUNDS.length - 1) {
          gameOver = true;
          setStatus("You win");
          running = false;
        } else {
          levelUp();
          setStatus(`Round ${currentRound + 1}`);
          clearTimeout(statusTimerRef.current);
          statusTimerRef.current = setTimeout(() => {
            if (!cancelled) setStatus("");
          }, 1100);
        }
      } else if (bot.score >= needed) {
        gameOver = true;
        setStatus("Game over");
        running = false;
      }
    };

    const draw = () => {
      ctx.fillStyle = court;
      ctx.fillRect(0, 0, COURT_W, COURT_H);
      ctx.setLineDash([6, 12]);
      ctx.beginPath();
      ctx.moveTo(COURT_W / 2, 30);
      ctx.lineTo(COURT_W / 2, COURT_H - 30);
      ctx.lineWidth = 4;
      ctx.strokeStyle = mode.net;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = mode.paddle;
      ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.fillRect(bot.x, bot.y, bot.w, bot.h);
      if (ball.dirX !== 0 || !playerTurn) {
        ctx.beginPath();
        ctx.arc(ball.x + ball.size / 2, ball.y + ball.size / 2, ball.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (cancelled || !running || gameOver) return;
      if (isVisibleRef.current) {
        update();
        draw();
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    const startGame = () => {
      if (running || gameOver) return;
      running = true;
      setStatus("");
      playerTurn = "bot";
      timer = performance.now();
      rafRef.current = requestAnimationFrame(loop);
    };

    startGameRef.current = startGame;
    playerMoveRef.current = 0;
    paddleTargetRef.current = null;
    draw();

    return () => {
      cancelled = true;
      running = false;
      startGameRef.current = null;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      clearTimeout(statusTimerRef.current);
    };
  }, [difficulty, gameKey, lightMode, activeTheme, mode.net, mode.paddle]);

  const beginPlay = () => {
    startGameRef.current?.();
  };

  const setPaddleFromClientY = (clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.height <= 0) return;
    const scaleY = COURT_H / rect.height;
    paddleTargetRef.current = (clientY - rect.top) * scaleY - PADDLE_H / 2;
  };

  const onCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && asPopup) {
      setPopupOpen(false);
      return;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === " ") e.preventDefault();
    beginPlay();
    if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") playerMoveRef.current = -1;
    if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") playerMoveRef.current = 1;
  };

  const onCardKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (["w", "W", "s", "S", "ArrowUp", "ArrowDown"].includes(e.key)) playerMoveRef.current = 0;
  };

  const onCourtPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    beginPlay();
    setPaddleFromClientY(e.clientY);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onCourtPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 0 && e.pointerType !== "touch") return;
    setPaddleFromClientY(e.clientY);
  };

  const changeDifficulty = (level: PongDifficulty) => {
    setDifficulty(level);
    setScoreA(0);
    setScoreB(0);
    setRound(1);
    setStatus("Click the court to start");
    setGameKey((k) => k + 1);
  };

  const restart = React.useCallback(() => {
    playerMoveRef.current = 0;
    paddleTargetRef.current = null;
    setScoreA(0);
    setScoreB(0);
    setRound(1);
    setStatus(isCoarsePointer ? "Tap the court to start" : "Click the court to start");
    setGameKey((k) => k + 1);
  }, [isCoarsePointer]);

  const gameCard = (
    <div
      ref={gameRootRef}
      tabIndex={0}
      role="application"
      aria-label={`${activeTheme.title} table tennis game`}
      onKeyDown={onCardKeyDown}
      onKeyUp={onCardKeyUp}
      onPointerDown={() => gameRootRef.current?.focus()}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="relative box-border flex w-full flex-col items-center overflow-hidden rounded-[22px] px-6.5 py-8 font-sans outline-none select-none"
      style={{ background: lightMode ? activeTheme.lightBackground : activeTheme.background, border: `1px solid ${mode.cardBorder}`, boxShadow: focused ? mode.focusRing : "none" }}
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

      <div className="mb-3.5 flex w-full max-w-[340px] gap-2.5" aria-live="polite">
        <div className="flex-1 rounded-[14px] px-3 py-2.5 text-center backdrop-blur-[8px]" style={{ background: mode.surface, border: `1px solid ${mode.surfaceBorder}` }}>
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: mode.inkFaint }}>
            You
          </div>
          <div className="font-serif text-[28px] font-normal" style={{ color: mode.ink }}>
            {scoreA}
          </div>
        </div>
        <div className="flex-1 rounded-[14px] px-3 py-2.5 text-center backdrop-blur-[8px]" style={{ background: mode.surface, border: `1px solid ${mode.surfaceBorder}` }}>
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: mode.inkFaint }}>
            Bot
          </div>
          <div className="font-serif text-[28px] font-normal" style={{ color: mode.ink }}>
            {scoreB}
          </div>
        </div>
      </div>

      <div role="radiogroup" aria-label="Difficulty" className="mb-2.5 flex flex-wrap justify-center gap-2">
        {(["easy", "medium", "hard"] as PongDifficulty[]).map((level) => {
          const on = difficulty === level;
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => changeDifficulty(level)}
              className="cursor-pointer rounded-full px-3.5 py-2 text-[10px] font-bold tracking-[0.12em] uppercase transition-[transform,opacity]"
              style={{ color: on ? "#0a0a0f" : mode.inkSoft, background: on ? resolvedAccent : mode.surface, border: `1px solid ${on ? "transparent" : mode.surfaceBorder}` }}
            >
              {DIFFICULTY[level].label}
            </button>
          );
        })}
      </div>

      <p className="m-0 mb-3.5 text-center text-[10px] font-bold tracking-[0.16em] uppercase" style={{ color: mode.inkMuted }}>
        Round {round} · First to {neededPoints}
      </p>

      <div
        className="relative w-full max-w-[460px] cursor-pointer touch-none overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.08)]"
        style={{ aspectRatio: "16 / 10" }}
        onPointerDown={onCourtPointerDown}
        onPointerMove={onCourtPointerMove}
      >
        <canvas ref={canvasRef} aria-label="Pong court. Left paddle is you, right paddle is the bot." className="block h-full w-full touch-none" style={{ pointerEvents: "none" }} />
        {status ? (
          <div
            className="absolute inset-0 flex cursor-pointer items-center justify-center p-4 backdrop-blur-[6px]"
            style={{ background: mode.overlayBg }}
            onPointerDown={(e) => {
              e.stopPropagation();
              beginPlay();
              gameRootRef.current?.focus();
            }}
          >
            <p role="status" className="m-0 text-center font-serif text-[22px] font-normal" style={{ color: mode.ink }}>
              {status}
            </p>
          </div>
        ) : null}
      </div>

      <motion.button
        type="button"
        onClick={restart}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-4.5 rounded-full border-none px-7.5 py-3.5 text-xs font-bold tracking-[0.1em] text-[#0a0a0f] uppercase"
        style={{ background: resolvedAccent }}
      >
        {activeTheme.buttonText}
      </motion.button>

      <p className="mt-3.5 mb-0 text-center text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: mode.inkFaint }}>
        {isCoarsePointer ? "Drag on the court to move your paddle" : "Click the court, then use W / S or arrow keys"}
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
              <PaddleIcon />
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
              className="relative w-full max-w-[480px]"
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
