"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const btnClass = "cursor-pointer rounded-lg border px-4 py-1.5 text-[13px] font-medium transition-colors";

interface Obstacle {
  x: number;
  width: number;
  height: number;
  passed?: boolean;
}

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

export interface DinoRunnerGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {}

export function DinoRunnerGame({ className, style, ...props }: DinoRunnerGameProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [score, setScore] = React.useState(0);
  const [highScore, setHighScore] = React.useState(0);
  const [gameState, setGameState] = React.useState<"menu" | "playing" | "gameover">("menu");
  const [difficulty, setDifficulty] = React.useState<"easy" | "medium" | "hard">("medium");

  const gameRef = React.useRef({
    dinoY: 0,
    dinoVY: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    speed: 6,
    frame: 0,
    score: 0,
    animationId: 0,
    groundY: 0,
    width: 800,
    height: 400,
  });

  React.useEffect(() => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const g = gameRef.current;
    if (difficulty === "easy") g.speed = 5;
    else if (difficulty === "medium") g.speed = 7;
    else g.speed = 9.5;

    const resize = () => {
      const w = containerRef.current?.clientWidth || 800;
      g.width = Math.min(w - 32, 900);
      g.height = Math.min(window.innerHeight * 0.5, 420);
      canvas.width = g.width;
      canvas.height = g.height;
      g.groundY = g.height - 60;
      g.dinoY = g.groundY - 48;
    };
    resize();

    g.obstacles = [];
    g.score = 0;
    g.frame = 0;
    g.dinoY = g.groundY - 48;
    g.dinoVY = 0;
    g.isJumping = false;
    setScore(0);

    const spawnObstacle = () => {
      const height = 30 + Math.random() * 25;
      g.obstacles.push({ x: g.width + 20, width: 18 + Math.random() * 12, height });
    };
    spawnObstacle();

    const loop = () => {
      g.frame++;
      ctx.clearRect(0, 0, g.width, g.height);
      ctx.fillStyle = "#fafafa";
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
          setHighScore((h) => {
            if (g.score > h) {
              localStorage.setItem("dino-highscore", g.score.toString());
              return g.score;
            }
            return h;
          });
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
    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(g.animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [gameState, difficulty]);

  React.useEffect(() => {
    const saved = localStorage.getItem("dino-highscore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const jump = () => {
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
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState]);

  return (
    <div ref={containerRef} className={cn("flex h-full w-full flex-col items-center justify-center bg-[#fafafa] py-6 font-sans select-none", className)} style={style} {...props}>
      <div className="mb-4 w-full max-w-[640px] px-4 text-center">
        <h1 className="m-0 text-[22px] font-semibold text-[#111]">CSS Dino</h1>
        <p className="mt-1.5 text-[13px] text-[#888]">Space / Tap to jump</p>

        <div className="mt-3 flex justify-center gap-6 text-sm text-[#555]">
          <span>
            Score: <b className="text-[#111]">{score}</b>
          </span>
          <span>
            Best: <b className="text-[#111]">{highScore}</b>
          </span>
        </div>

        <div className="mt-3.5 flex flex-wrap justify-center gap-2">
          {(["easy", "medium", "hard"] as const).map((level) => (
            <button
              key={level}
              onClick={() => {
                setDifficulty(level);
                if (gameState === "playing") setGameState("menu");
              }}
              className={btnClass}
              // Source's "all 0.15s ease" needs an explicit ease override —
              // Tailwind's transition-colors defaults to a different curve.
              style={{ background: difficulty === level ? "#111" : "white", color: difficulty === level ? "white" : "#333", borderColor: difficulty === level ? "#111" : "#e0e0e0", transitionTimingFunction: "ease" }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div onClick={jump} onTouchStart={(e) => { e.preventDefault(); jump(); }} className="relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <canvas ref={canvasRef} className="block max-w-full" />

        {gameState === "menu" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(250,250,250,0.92)] text-center">
            <div className="mb-2 text-[28px] font-semibold text-[#111]">Ready?</div>
            <div className="mb-5 text-sm text-[#666]">Tap or press Space to start</div>
            <button
              onClick={jump}
              className={cn(btnClass, "bg-[#111] px-7 py-2.5 text-white")}
              // borderColor matches the background so the button reads as
              // borderless — the site's global `border-border` reset would
              // otherwise tint the border a visible neutral gray.
              style={{ borderColor: "#111", transitionTimingFunction: "ease" }}
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(250,250,250,0.92)] text-center">
            <div className="mb-2 text-[28px] font-semibold text-[#111]">Game Over</div>
            <div className="mb-1.5 text-[15px] text-[#666]">Score: {score}</div>
            <button
              onClick={() => setGameState("playing")}
              className={cn(btnClass, "mt-3 bg-[#111] px-7 py-2.5 text-white")}
              style={{ borderColor: "#111", transitionTimingFunction: "ease" }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-[#aaa]">Tap anywhere to jump</p>
    </div>
  );
}
