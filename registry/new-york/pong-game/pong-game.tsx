"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY: Record<Difficulty, { botSpeed: number; ballSpeedX: number; ballSpeedY: number; playerSpeed: number; label: string }> = {
  easy: { botSpeed: 4.2, ballSpeedX: 5.5, ballSpeedY: 3.8, playerSpeed: 7.5, label: "Easy" },
  medium: { botSpeed: 5.4, ballSpeedX: 6.8, ballSpeedY: 4.6, playerSpeed: 7.2, label: "Medium" },
  hard: { botSpeed: 6.8, ballSpeedX: 8.2, ballSpeedY: 5.6, playerSpeed: 7.0, label: "Hard" },
};

const ROUNDS = [5, 5, 5, 4, 4, 4, 3, 3, 3, 1];
const COLORS = ["#1ABC9C", "#16A085", "#2ECC71", "#27AE60", "#3498DB", "#2980B9", "#9B59B6", "#8E44AD", "#34495E", "#E74C3C", "#C0392B", "#D35400", "#E67E22"];

export interface PongGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  accentColor?: string;
}

export function PongGame({ accentColor = "#8f7a66", className, style, ...props }: PongGameProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [scoreA, setScoreA] = React.useState(0);
  const [scoreB, setScoreB] = React.useState(0);
  const [round, setRound] = React.useState(1);
  const [status, setStatus] = React.useState("Select difficulty & press any key");
  const [difficulty, setDifficulty] = React.useState<Difficulty>("medium");
  const [gameKey, setGameKey] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const WIDTH = 800;
    const HEIGHT = 500;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const settings = DIFFICULTY[difficulty];
    let bgColor = "#2C3E50";
    let availableColors = [...COLORS];
    let running = false;
    let gameOver = false;
    let currentRound = 0;
    let timer = 0;
    let playerTurn: "player" | "bot" | null = null;

    const player = { x: 40, y: HEIGHT / 2 - 50, w: 14, h: 90, speed: settings.playerSpeed, score: 0, move: 0 };
    const bot = { x: WIDTH - 54, y: HEIGHT / 2 - 50, w: 14, h: 90, speed: settings.botSpeed, score: 0 };
    const ball = { x: WIDTH / 2, y: HEIGHT / 2, size: 14, speedX: settings.ballSpeedX, speedY: settings.ballSpeedY, dirX: 0, dirY: 0 };

    const resetBall = () => {
      ball.x = WIDTH / 2;
      ball.y = HEIGHT / 2;
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
      if (availableColors.length) {
        const i = Math.floor(Math.random() * availableColors.length);
        bgColor = availableColors[i];
        availableColors.splice(i, 1);
      }
    };

    const update = () => {
      player.y += player.move * player.speed;
      if (player.y < 0) player.y = 0;
      if (player.y + player.h > HEIGHT) player.y = HEIGHT - player.h;

      const target = ball.y - bot.h / 2;
      if (bot.y < target - 3) bot.y += bot.speed;
      else if (bot.y > target + 3) bot.y -= bot.speed;
      if (bot.y < 0) bot.y = 0;
      if (bot.y + bot.h > HEIGHT) bot.y = HEIGHT - bot.h;

      if (ball.dirX !== 0) {
        ball.x += ball.dirX * ball.speedX;
        ball.y += ball.dirY * ball.speedY;
      }

      if (ball.y <= 0 || ball.y + ball.size >= HEIGHT) ball.dirY *= -1;

      const hitPaddle = (p: { x: number; y: number; w: number; h: number }) => ball.x < p.x + p.w && ball.x + ball.size > p.x && ball.y < p.y + p.h && ball.y + ball.size > p.y;

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
      if (ball.x > WIDTH) {
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
          setStatus("You Win!");
          running = false;
        } else {
          levelUp();
          setStatus(`Round ${currentRound + 1}`);
          setTimeout(() => setStatus(""), 1100);
        }
      } else if (bot.score >= needed) {
        gameOver = true;
        setStatus("Game Over");
        running = false;
      }
    };

    const draw = () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.setLineDash([6, 12]);
      ctx.beginPath();
      ctx.moveTo(WIDTH / 2, 30);
      ctx.lineTo(WIDTH / 2, HEIGHT - 30);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.fillRect(bot.x, bot.y, bot.w, bot.h);
      if (ball.dirX !== 0 || !playerTurn) {
        ctx.beginPath();
        ctx.arc(ball.x + ball.size / 2, ball.y + ball.size / 2, ball.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (!running || gameOver) return;
      update();
      draw();
      requestAnimationFrame(loop);
    };

    const keyDown = (e: KeyboardEvent) => {
      if (!running && !gameOver) {
        running = true;
        setStatus("");
        playerTurn = "bot";
        timer = performance.now();
        requestAnimationFrame(loop);
      }
      if (e.key === "w" || e.key === "ArrowUp") player.move = -1;
      if (e.key === "s" || e.key === "ArrowDown") player.move = 1;
    };
    const keyUp = () => {
      player.move = 0;
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (!running && !gameOver) {
        running = true;
        setStatus("");
        playerTurn = "bot";
        timer = performance.now();
        requestAnimationFrame(loop);
      }
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return;
      const scaleY = HEIGHT / rect.height;
      const touchY = (touch.clientY - rect.top) * scaleY;
      player.y = touchY - player.h / 2;
      if (player.y < 0) player.y = 0;
      if (player.y + player.h > HEIGHT) player.y = HEIGHT - player.h;
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    canvas.addEventListener("touchstart", handleTouch, { passive: false });
    canvas.addEventListener("touchmove", handleTouch, { passive: false });

    draw();

    return () => {
      running = false;
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("touchmove", handleTouch);
    };
  }, [difficulty, gameKey]);

  const changeDifficulty = (level: Difficulty) => {
    setDifficulty(level);
    setScoreA(0);
    setScoreB(0);
    setRound(1);
    setStatus("Select difficulty & press any key");
    setGameKey((k) => k + 1);
  };

  const restart = () => {
    setScoreA(0);
    setScoreB(0);
    setRound(1);
    setStatus(isMobile ? "Tap to start" : "Press any key to start");
    setGameKey((k) => k + 1);
  };

  return (
    <div
      className={cn("box-border flex w-full flex-col items-center justify-center rounded-[24px] px-3 py-4 text-[#776e65] select-none", className)}
      style={{ background: "linear-gradient(160deg, #faf8ef 0%, #eee4da 100%)", fontFamily: "'Nunito', 'Montserrat', system-ui, sans-serif", ...style }}
      {...props}
    >
      <div className="mb-2.5 flex w-full max-w-[480px] items-center justify-between gap-3">
        <div className="text-[clamp(28px,8vw,42px)] font-extrabold tracking-[-1px]">Pong</div>
        <div className="flex gap-2">
          <div className="min-w-[56px] rounded-[8px] bg-[#bbada0] px-3 py-1.5 text-center text-white">
            <div className="text-[10px] font-bold tracking-[1px] opacity-85">YOU</div>
            <div className="text-[clamp(18px,5vw,22px)] font-extrabold">{scoreA}</div>
          </div>
          <div className="min-w-[56px] rounded-[8px] bg-[#bbada0] px-3 py-1.5 text-center text-white">
            <div className="text-[10px] font-bold tracking-[1px] opacity-85">BOT</div>
            <div className="text-[clamp(18px,5vw,22px)] font-extrabold">{scoreB}</div>
          </div>
        </div>
      </div>

      <div className="mb-2.5 flex flex-wrap justify-center gap-2">
        {(Object.keys(DIFFICULTY) as Difficulty[]).map((level) => (
          <button
            key={level}
            onClick={() => changeDifficulty(level)}
            className="min-w-[70px] cursor-pointer rounded-[8px] border-none px-3.5 py-2 text-[13px] font-bold text-white"
            style={{ background: difficulty === level ? accentColor : "#bbada0", opacity: difficulty === level ? 1 : 0.75, transition: "all 0.15s ease" }}
          >
            {DIFFICULTY[level].label}
          </button>
        ))}
      </div>

      <div className="mb-3 text-center text-[13px] font-semibold opacity-60">
        Round {round} · First to {ROUNDS[round - 1] || 1}
      </div>

      <div className="relative w-full max-w-[480px] overflow-hidden rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.12)]" style={{ aspectRatio: "16 / 10" }}>
        <canvas ref={canvasRef} className="block h-full w-full touch-none rounded-[12px]" />
        {status && (
          <div className="absolute inset-0 flex items-center justify-center p-4" style={{ background: "rgba(119, 110, 101, 0.78)" }}>
            <div className="text-center text-[clamp(16px,4.5vw,22px)] font-extrabold text-white">{status}</div>
          </div>
        )}
      </div>

      <motion.button className="mt-4 cursor-pointer rounded-[8px] border-none px-7 py-3 text-[15px] font-bold text-white" style={{ backgroundColor: accentColor }} onClick={restart} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
        New Game
      </motion.button>

      <div className="mt-3 px-2.5 text-center text-[13px] opacity-55">{isMobile ? "Drag your finger to move the paddle" : "W / S or ↑ ↓ to move"}</div>
    </div>
  );
}
