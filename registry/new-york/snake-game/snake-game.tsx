"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

const GRID_SIZE = 15;

const btnClass = "cursor-pointer rounded-[8px] border px-3.5 py-[7px] text-[13px] font-medium";

export interface SnakeGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {}

export function SnakeGame({ className, style, ...props }: SnakeGameProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [score, setScore] = React.useState(0);
  const [highScore, setHighScore] = React.useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem("snake-highscore");
    return saved ? Number(saved) : 0;
  });
  const [gameState, setGameState] = React.useState<"ready" | "playing" | "gameover">("ready");
  const [difficulty, setDifficulty] = React.useState<"easy" | "medium" | "hard">("medium");

  const snakeRef = React.useRef<Point[]>([{ x: 7, y: 7 }]);
  const directionRef = React.useRef<Direction>("RIGHT");
  const nextDirectionRef = React.useRef<Direction>("RIGHT");
  const foodRef = React.useRef<Point>({ x: 3, y: 3 });
  const cellSizeRef = React.useRef(24);
  const speedRef = React.useRef(120);
  const lastTimeRef = React.useRef(0);
  const animationRef = React.useRef(0);
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    if (difficulty === "easy") speedRef.current = 160;
    else if (difficulty === "medium") speedRef.current = 110;
    else speedRef.current = 70;
  }, [difficulty]);

  const placeFood = (snake: Point[]) => {
    let newFood: Point;
    do {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    } while (snake.some((s) => s.x === newFood.x && s.y === newFood.y));
    foodRef.current = newFood;
  };

  const resetGame = () => {
    snakeRef.current = [{ x: 7, y: 7 }];
    directionRef.current = "RIGHT";
    nextDirectionRef.current = "RIGHT";
    placeFood(snakeRef.current);
    setScore(0);
    setGameState("ready");
  };

  const startGame = () => {
    if (gameState === "gameover") resetGame();
    setGameState("playing");
  };

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = cellSizeRef.current;
    const w = GRID_SIZE * size;
    const h = GRID_SIZE * size;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
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
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.roundRect(food.x * size + 3, food.y * size + 3, size - 6, size - 6, 6);
    ctx.fill();

    const snake = snakeRef.current;
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? "#111111" : "#333333";
      ctx.beginPath();
      ctx.roundRect(segment.x * size + 2, segment.y * size + 2, size - 4, size - 4, isHead ? 8 : 5);
      ctx.fill();

      if (isHead) {
        ctx.fillStyle = "#ffffff";
        const eyeSize = 3;
        let eye1 = { x: 0, y: 0 };
        let eye2 = { x: 0, y: 0 };
        if (directionRef.current === "RIGHT") {
          eye1 = { x: segment.x * size + size - 9, y: segment.y * size + 7 };
          eye2 = { x: segment.x * size + size - 9, y: segment.y * size + size - 10 };
        } else if (directionRef.current === "LEFT") {
          eye1 = { x: segment.x * size + 6, y: segment.y * size + 7 };
          eye2 = { x: segment.x * size + 6, y: segment.y * size + size - 10 };
        } else if (directionRef.current === "UP") {
          eye1 = { x: segment.x * size + 7, y: segment.y * size + 6 };
          eye2 = { x: segment.x * size + size - 10, y: segment.y * size + 6 };
        } else {
          eye1 = { x: segment.x * size + 7, y: segment.y * size + size - 9 };
          eye2 = { x: segment.x * size + size - 10, y: segment.y * size + size - 9 };
        }
        ctx.beginPath();
        ctx.arc(eye1.x, eye1.y, eyeSize, 0, Math.PI * 2);
        ctx.arc(eye2.x, eye2.y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const containerW = containerRef.current?.clientWidth || 400;
      const maxSize = Math.min(containerW - 32, 420);
      const size = Math.floor(maxSize / GRID_SIZE);
      cellSizeRef.current = size;
      canvas.width = GRID_SIZE * size;
      canvas.height = GRID_SIZE * size;
      draw();
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = (time: number) => {
      if (gameState !== "playing") {
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

        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || snake.some((s) => s.x === head.x && s.y === head.y)) {
          setGameState("gameover");
          setScore((s) => {
            setHighScore((h) => {
              if (s > h) {
                localStorage.setItem("snake-highscore", String(s));
                return s;
              }
              return h;
            });
            return s;
          });
          animationRef.current = requestAnimationFrame(tick);
          return;
        }

        snake.unshift(head);
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
          setScore((s) => s + 1);
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
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [gameState, draw]);

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " "].includes(key)) e.preventDefault();

      if (gameState === "ready" || gameState === "gameover") {
        if (key === " " || key.startsWith("arrow") || ["w", "a", "s", "d"].includes(key)) startGame();
        return;
      }
      const dir = directionRef.current;
      if ((key === "arrowup" || key === "w") && dir !== "DOWN") nextDirectionRef.current = "UP";
      else if ((key === "arrowdown" || key === "s") && dir !== "UP") nextDirectionRef.current = "DOWN";
      else if ((key === "arrowleft" || key === "a") && dir !== "RIGHT") nextDirectionRef.current = "LEFT";
      else if ((key === "arrowright" || key === "d") && dir !== "LEFT") nextDirectionRef.current = "RIGHT";
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState]);

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
      return;
    }
    if (gameState !== "playing") {
      startGame();
      return;
    }
    const dir = directionRef.current;
    if (absDx > absDy) {
      if (dx > 0 && dir !== "LEFT") nextDirectionRef.current = "RIGHT";
      else if (dx < 0 && dir !== "RIGHT") nextDirectionRef.current = "LEFT";
    } else {
      if (dy > 0 && dir !== "UP") nextDirectionRef.current = "DOWN";
      else if (dy < 0 && dir !== "DOWN") nextDirectionRef.current = "UP";
    }
    touchStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className={cn("flex w-full flex-col items-center justify-center bg-[#fafafa] py-6 select-none", className)}
      style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", ...style }}
      {...props}
    >
      <div className="mb-4 w-full max-w-[420px] px-4 text-center">
        <h1 className="m-0 text-[22px] font-semibold tracking-[-0.02em] text-[#111]">Snake</h1>
        <div className="mt-3 flex justify-center gap-7 text-sm text-[#666]">
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
                if (gameState === "playing") {
                  setGameState("ready");
                  resetGame();
                }
              }}
              className={btnClass}
              style={{
                background: difficulty === level ? "#111" : "white",
                color: difficulty === level ? "white" : "#333",
                borderColor: difficulty === level ? "#111" : "#e5e5e5",
                transition: "all 0.15s ease",
              }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[16px] border border-[#f0f0f0] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <canvas ref={canvasRef} className="block max-w-full touch-none" />

        {gameState === "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(250,250,250,0.92)] text-center backdrop-blur-sm">
            <div className="mb-1.5 text-xl font-semibold">Ready?</div>
            <div className="mb-4.5 text-[13px] text-[#888]">Arrow keys / Swipe / Tap to start</div>
            <button onClick={startGame} className={cn(btnClass, "bg-[#111] px-6.5 py-2.5 text-white")} style={{ transition: "all 0.15s ease" }}>
              Start Game
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(250,250,250,0.92)] text-center backdrop-blur-sm">
            <div className="mb-1.5 text-xl font-semibold">Game Over</div>
            <div className="mb-1 text-sm text-[#666]">Score: {score}</div>
            <button onClick={startGame} className={cn(btnClass, "mt-3.5 bg-[#111] px-6.5 py-2.5 text-white")} style={{ transition: "all 0.15s ease" }}>
              Play Again
            </button>
          </div>
        )}
      </div>

      <p className="mt-3.5 text-center text-xs text-[#aaa]">Use arrow keys or swipe to move</p>
    </div>
  );
}
