"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Difficulty = "easy" | "medium" | "hard";

interface Vec {
  x: number;
  y: number;
}
interface Size {
  width: number;
  height: number;
}

function drawInvader(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size / 8;
  ctx.fillStyle = "#6b46c1";
  ctx.fillRect(x + s * 1.5, y + s * 2, s * 5, s * 4);
  ctx.fillRect(x + s * 0.2, y + s * 3, s * 1.5, s * 1.8);
  ctx.fillRect(x + s * 6.3, y + s * 3, s * 1.5, s * 1.8);
  ctx.fillRect(x + s * 2, y + s * 1, s * 1.5, s * 1.5);
  ctx.fillRect(x + s * 4.5, y + s * 1, s * 1.5, s * 1.5);
  ctx.fillStyle = "#111";
  ctx.fillRect(x + s * 2.5, y + s * 2.8, s * 1.1, s * 1.1);
  ctx.fillRect(x + s * 4.4, y + s * 2.8, s * 1.1, s * 1.1);
}

function drawShip(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2 - 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#111";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = "#fafafa";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.78, -0.8, 2.6);
  ctx.lineWidth = r * 0.28;
  ctx.strokeStyle = "#111";
  ctx.lineCap = "round";
  ctx.stroke();
}

const btnClass = "cursor-pointer rounded-[8px] border border-[#e0e0e0] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#333]";
const keyClass = "rounded bg-[#111] px-[7px] py-0.5 text-xs font-medium text-white";

export interface SpaceInvadersGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {}

export function SpaceInvadersGame({ className, style, ...props }: SpaceInvadersGameProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [difficulty, setDifficulty] = React.useState<Difficulty>("medium");
  const [gameKey, setGameKey] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const keysRef = React.useRef({ left: false, right: false, space: false });

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900 || "ontouchstart" in window);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const screen = canvas.getContext("2d");
    if (!screen) return;

    let gameSize = { width: 900, height: 500 };
    let invaderSize = 22;
    let invaderAttackRate = 0.995;
    let kills = 0;
    let animationId = 0;
    let isDestroyed = false;
    let playerSpeed = 2.6;
    let shotSpeed = 7;

    if (difficulty === "easy") {
      invaderAttackRate = 0.998;
      playerSpeed = 3.4;
      shotSpeed = 8.5;
    } else if (difficulty === "hard") {
      invaderAttackRate = 0.982;
      playerSpeed = 2.1;
      shotSpeed = 6;
    }

    const blocks = [
      [3, 4, 8, 9, 10, 15, 16],
      [2, 4, 7, 11, 14, 16],
      [1, 4, 7, 11, 13, 16],
      [1, 2, 3, 4, 5, 7, 11, 13, 14, 15, 16, 17],
      [4, 7, 11, 16],
      [4, 8, 9, 10, 16],
    ];

    class Projectile {
      active = true;
      coordinates: Vec;
      size: Size = { width: 3, height: 5 };
      velocity: Vec;
      constructor(coordinates: Vec, velocity: Vec) {
        this.coordinates = coordinates;
        this.velocity = velocity;
      }
      update() {
        this.coordinates.x += this.velocity.x;
        this.coordinates.y += this.velocity.y;
        if (this.coordinates.y > gameSize.height || this.coordinates.y < 0) this.active = false;
      }
      draw() {
        if (!this.active || !screen) return;
        screen.fillStyle = this.velocity.y < 0 ? "#111" : "#6b46c1";
        screen.fillRect(this.coordinates.x, this.coordinates.y, this.size.width, this.size.height);
      }
    }

    function collides(a: { coordinates: Vec; size: Size }, b: { coordinates: Vec; size: Size }) {
      return a.coordinates.x < b.coordinates.x + b.size.width && a.coordinates.x + a.size.width > b.coordinates.x && a.coordinates.y < b.coordinates.y + b.size.height && a.coordinates.y + a.size.height > b.coordinates.y;
    }

    class Invader {
      active = true;
      coordinates: Vec;
      size: Size;
      constructor(coordinates: Vec) {
        this.coordinates = coordinates;
        this.size = { width: invaderSize, height: invaderSize };
      }
      update() {
        if (Math.random() > invaderAttackRate) {
          game.invaderShots.push(new Projectile({ x: this.coordinates.x + this.size.width / 2, y: this.coordinates.y + this.size.height }, { x: 0, y: 2.3 }));
        }
      }
      draw() {
        if (this.active && screen) drawInvader(screen, this.coordinates.x, this.coordinates.y, invaderSize);
      }
      destroy() {
        this.active = false;
        kills += 1;
      }
    }

    class Player {
      active = true;
      size: Size = { width: 28, height: 28 };
      shooterHeat = -5;
      coordinates: Vec;
      projectile: Projectile[] = [];
      constructor() {
        this.coordinates = { x: (gameSize.width / 2 - this.size.width / 2) | 0, y: gameSize.height - this.size.height - 16 };
      }
      update() {
        this.projectile.forEach((p) => p.update());
        this.projectile = this.projectile.filter((p) => p.active);
        if (!this.active) return;

        if (keysRef.current.left && this.coordinates.x > 0) this.coordinates.x -= playerSpeed;
        if (keysRef.current.right && this.coordinates.x < gameSize.width - this.size.width) this.coordinates.x += playerSpeed;

        if (keysRef.current.space) {
          this.shooterHeat += 1;
          if (this.shooterHeat < 0) {
            this.projectile.push(new Projectile({ x: this.coordinates.x + this.size.width / 2 - 1.5, y: this.coordinates.y - 4 }, { x: 0, y: -shotSpeed }));
          } else if (this.shooterHeat > 9) {
            this.shooterHeat = -5;
          }
        } else {
          this.shooterHeat = -5;
        }
      }
      draw() {
        if (this.active && screen) drawShip(screen, this.coordinates.x, this.coordinates.y, this.size.width);
        this.projectile.forEach((p) => p.draw());
      }
      destroy() {
        this.active = false;
        game.lost = true;
      }
    }

    function createInvaders() {
      const invaders: Invader[] = [];
      const mult = gameSize.width > 700 ? 1 : 0.9;
      const totalWidth = 18 * invaderSize * mult;
      const offsetX = (gameSize.width - totalWidth) / 2;
      for (let row = 0; row < blocks.length; row++) {
        for (const col of blocks[row]) {
          invaders.push(new Invader({ x: offsetX + col * invaderSize * mult, y: 30 + row * invaderSize * 1.3 }));
        }
      }
      return invaders;
    }

    class Game {
      lost = false;
      won = false;
      player = new Player();
      invaders = createInvaders();
      invaderShots: Projectile[] = [];

      update() {
        if (!this.lost && !this.won) {
          this.player.projectile.forEach((p) => {
            this.invaders.forEach((inv) => {
              if (collides(p, inv)) {
                inv.destroy();
                p.active = false;
              }
            });
          });
          this.invaderShots.forEach((s) => {
            if (collides(s, this.player)) this.player.destroy();
          });
          this.invaders.forEach((inv) => inv.update());
        }
        this.player.update();
        this.invaderShots.forEach((s) => s.update());
        this.invaders = this.invaders.filter((i) => i.active);
        this.invaderShots = this.invaderShots.filter((s) => s.active);
        if (this.invaders.length === 0) this.won = true;
      }

      draw() {
        if (!screen) return;
        screen.clearRect(0, 0, gameSize.width, gameSize.height);
        if (this.lost || this.won) {
          screen.fillStyle = "rgba(0,0,0,0.04)";
          screen.fillRect(0, 0, gameSize.width, gameSize.height);
          screen.font = "600 40px Inter, system-ui, sans-serif";
          screen.textAlign = "center";
          screen.fillStyle = "#111";
          screen.fillText(this.won ? "You won!" : "You lost", gameSize.width / 2, gameSize.height / 2 - 10);
          screen.font = "400 16px Inter, system-ui, sans-serif";
          screen.fillStyle = "#666";
          screen.fillText(`Points: ${kills}`, gameSize.width / 2, gameSize.height / 2 + 26);
        } else {
          screen.font = "500 13px Inter, system-ui, sans-serif";
          screen.textAlign = "right";
          screen.fillStyle = "#888";
          screen.fillText(`Points: ${kills}`, gameSize.width - 16, gameSize.height - 14);
        }
        this.player.draw();
        this.invaders.forEach((i) => i.draw());
        this.invaderShots.forEach((s) => s.draw());
      }
    }

    let game = new Game();

    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keysRef.current.left = true;
      if (e.key === "ArrowRight") keysRef.current.right = true;
      if (e.code === "Space") keysRef.current.space = true;
      if (["ArrowLeft", "ArrowRight", "Space"].includes(e.code) || e.key.startsWith("Arrow")) e.preventDefault();
    };
    const keyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keysRef.current.left = false;
      if (e.key === "ArrowRight") keysRef.current.right = false;
      if (e.code === "Space") keysRef.current.space = false;
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    function initGame() {
      const width = containerRef.current?.clientWidth || 900;
      const height = Math.min(window.innerHeight * 0.55, 520);
      if (width > 1000) gameSize = { width: 980, height: 480 };
      else if (width > 700) gameSize = { width: width - 40, height: 440 };
      else gameSize = { width: width - 24, height: Math.max(340, height) };
      canvas!.width = gameSize.width;
      canvas!.height = gameSize.height;
      kills = 0;
      game = new Game();
      game.draw();
    }

    function loop() {
      if (isDestroyed) return;
      game.update();
      game.draw();
      animationId = requestAnimationFrame(loop);
    }

    initGame();
    loop();

    const handleResize = () => {
      initGame();
      cancelAnimationFrame(animationId);
      loop();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [difficulty, gameKey]);

  const handleTouch = (type: "left" | "right" | "space", active: boolean) => {
    keysRef.current[type] = active;
  };

  return (
    <div
      ref={containerRef}
      className={cn("flex w-full flex-col items-center justify-center bg-[#fafafa] py-6 select-none", className)}
      style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", ...style }}
      {...props}
    >
      <div className="mb-3.5 max-w-[640px] px-3 text-center">
        <p className="m-0 text-[15px] font-medium text-[#333]">A wave of invaders is descending. Defend the line.</p>
        <p className="mt-1.5 text-[13px] text-[#888]">
          {isMobile ? (
            "Use the buttons below"
          ) : (
            <>
              <span className={keyClass}>Space</span> shoot &nbsp;
              <span className={keyClass}>←</span> <span className={keyClass}>→</span> move
            </>
          )}
        </p>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {(["easy", "medium", "hard"] as const).map((level) => (
            <button
              key={level}
              onClick={() => {
                setDifficulty(level);
                setGameKey((k) => k + 1);
              }}
              className={btnClass}
              style={{ background: difficulty === level ? "#111" : "white", color: difficulty === level ? "white" : "#333", borderColor: difficulty === level ? "#111" : "#e0e0e0" }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
          <button onClick={() => setGameKey((k) => k + 1)} className={btnClass}>
            Restart
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="block max-w-full touch-none rounded-[14px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]" />

      {isMobile && (
        <div className="mt-5 flex w-full max-w-[420px] items-center justify-center gap-4 pb-3">
          <button onTouchStart={() => handleTouch("left", true)} onTouchEnd={() => handleTouch("left", false)} onMouseDown={() => handleTouch("left", true)} onMouseUp={() => handleTouch("left", false)} onMouseLeave={() => handleTouch("left", false)} className="flex h-16 w-16 touch-manipulation items-center justify-center rounded-[16px] border border-[#e0e0e0] bg-white text-2xl font-semibold text-[#111] shadow-[0_2px_8px_rgba(0,0,0,0.06)] select-none">
            ←
          </button>
          <button onTouchStart={() => handleTouch("space", true)} onTouchEnd={() => handleTouch("space", false)} onMouseDown={() => handleTouch("space", true)} onMouseUp={() => handleTouch("space", false)} onMouseLeave={() => handleTouch("space", false)} className="flex h-[76px] w-[76px] touch-manipulation items-center justify-center rounded-full bg-[#111] text-[15px] font-semibold text-white select-none">
            FIRE
          </button>
          <button onTouchStart={() => handleTouch("right", true)} onTouchEnd={() => handleTouch("right", false)} onMouseDown={() => handleTouch("right", true)} onMouseUp={() => handleTouch("right", false)} onMouseLeave={() => handleTouch("right", false)} className="flex h-16 w-16 touch-manipulation items-center justify-center rounded-[16px] border border-[#e0e0e0] bg-white text-2xl font-semibold text-[#111] shadow-[0_2px_8px_rgba(0,0,0,0.06)] select-none">
            →
          </button>
        </div>
      )}
    </div>
  );
}
