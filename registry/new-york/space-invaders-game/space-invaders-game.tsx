"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Difficulty = "easy" | "medium" | "hard";
export type SpaceInvadersTrigger = "manual" | "delay" | "scroll";
export type SpaceInvadersWidgetPosition = "bottom-right" | "bottom-left";

interface Vec {
  x: number;
  y: number;
}
interface Size {
  width: number;
  height: number;
}

export interface SpaceInvadersGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  lightMode?: boolean;
  accentColor?: string;
  asPopup?: boolean;
  trigger?: SpaceInvadersTrigger;
  delaySeconds?: number;
  widgetPosition?: SpaceInvadersWidgetPosition;
  widgetIcon?: string;
}

export function SpaceInvadersGame({
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
}: SpaceInvadersGameProps) {
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const widgetTriggerRef = React.useRef<HTMLButtonElement>(null);
  const delayTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isVisibleRef = React.useRef(true);
  const wasPopupOpenRef = React.useRef(false);
  const keysRef = React.useRef({ left: false, right: false, space: false });

  const [difficulty, setDifficulty] = React.useState<Difficulty>("medium");
  const [gameKey, setGameKey] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const [popupOpen, setPopupOpen] = React.useState(!asPopup);
  const [scrollTriggered, setScrollTriggered] = React.useState(false);
  const [prevAsPopup, setPrevAsPopup] = React.useState(asPopup);

  if (asPopup !== prevAsPopup) {
    setPrevAsPopup(asPopup);
    setPopupOpen(!asPopup);
  }

  const widgetOnRight = widgetPosition !== "bottom-left";
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
        overlayBg: "rgba(0,0,0,0.45)",
        chromeBg: "#ffffff",
        chromeBorder: "rgba(23,26,33,0.1)",
        pageBg: "linear-gradient(160deg, #f4f6fa 0%, #dfe6f0 100%)",
        canvasBg: "rgba(23,26,33,0.04)",
        endOverlay: "rgba(255,255,255,0.72)",
      }
    : {
        ink: "#ffffff",
        inkSoft: "rgba(255,255,255,0.7)",
        inkFaint: "rgba(255,255,255,0.4)",
        divider: "rgba(255,255,255,0.3)",
        surface: "rgba(255,255,255,0.06)",
        surfaceBorder: "rgba(255,255,255,0.12)",
        cardBorder: "rgba(255,255,255,0.08)",
        overlayBg: "rgba(0,0,0,0.7)",
        chromeBg: "rgba(10,10,15,0.92)",
        chromeBorder: "rgba(255,255,255,0.16)",
        pageBg: "linear-gradient(160deg, #07080b 0%, #101319 100%)",
        canvasBg: "rgba(255,255,255,0.04)",
        endOverlay: "rgba(4,4,6,0.72)",
      };

  const resetGame = React.useCallback(() => setGameKey((k) => k + 1), []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setIsMobile(entry.contentRect.width < 900));
    ro.observe(el);
    return () => ro.disconnect();
  }, [popupOpen]);

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
    if (!rootRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!asPopup) return;
    if (!popupOpen && wasPopupOpenRef.current) widgetTriggerRef.current?.focus();
    wasPopupOpenRef.current = popupOpen;
  }, [asPopup, popupOpen]);

  const onRootKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && asPopup) {
      setPopupOpen(false);
      return;
    }
    if (e.key === "ArrowLeft") {
      keysRef.current.left = true;
      e.preventDefault();
    }
    if (e.key === "ArrowRight") {
      keysRef.current.right = true;
      e.preventDefault();
    }
    if (e.key === " ") {
      keysRef.current.space = true;
      e.preventDefault();
    }
  };

  const onRootKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") keysRef.current.left = false;
    if (e.key === "ArrowRight") keysRef.current.right = false;
    if (e.key === " ") keysRef.current.space = false;
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const host = containerRef.current;
    if (!canvas || !host) return;
    const screen = canvas.getContext("2d");
    if (!screen) return;

    let gameSize = { width: 720, height: 400 };
    let game: Game;
    const invaderSize = 22;
    let invaderAttackRate = 0.995;
    let kills = 0;
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

    const spriteLight = lightMode ? "#171a21" : "#e8e8ea";
    const spriteDark = lightMode ? "#f4f6fa" : "#0a0a0f";
    const playerOuter = lightMode ? "#171a21" : "#f4f5f7";
    const playerInner = lightMode ? "#f4f6fa" : "#0a0a0f";
    const shotPlayer = lightMode ? "#171a21" : "#ffffff";
    const shotEnemy = lightMode ? "#6b7280" : "#9a9aa0";

    function drawClawd(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      const s = size / 8;
      ctx.fillStyle = spriteLight;
      ctx.fillRect(x + s * 1.5, y + s * 2, s * 5, s * 4);
      ctx.fillRect(x + s * 0.2, y + s * 3, s * 1.5, s * 1.8);
      ctx.fillRect(x + s * 6.3, y + s * 3, s * 1.5, s * 1.8);
      ctx.fillRect(x + s * 2, y + s * 1, s * 1.5, s * 1.5);
      ctx.fillRect(x + s * 4.5, y + s * 1, s * 1.5, s * 1.5);
      ctx.fillStyle = spriteDark;
      ctx.fillRect(x + s * 2.5, y + s * 2.8, s * 1.1, s * 1.1);
      ctx.fillRect(x + s * 4.4, y + s * 2.8, s * 1.1, s * 1.1);
    }

    function drawShip(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      const cx = x + size / 2;
      const cy = y + size / 2;
      const r = size / 2 - 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = playerOuter;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = playerInner;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.78, -0.8, 2.6);
      ctx.lineWidth = r * 0.28;
      ctx.strokeStyle = playerOuter;
      ctx.lineCap = "round";
      ctx.stroke();
    }

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
        if (!this.active) return;
        screen!.fillStyle = this.velocity.y < 0 ? shotPlayer : shotEnemy;
        screen!.fillRect(this.coordinates.x, this.coordinates.y, this.size.width, this.size.height);
      }
    }

    function collides(a: { coordinates: Vec; size: Size }, b: { coordinates: Vec; size: Size }) {
      return a.coordinates.x < b.coordinates.x + b.size.width && a.coordinates.x + a.size.width > b.coordinates.x && a.coordinates.y < b.coordinates.y + b.size.height && a.coordinates.y + a.size.height > b.coordinates.y;
    }

    class Invader {
      active = true;
      coordinates: Vec;
      size: Size = { width: invaderSize, height: invaderSize };
      constructor(coordinates: Vec) {
        this.coordinates = coordinates;
      }
      update() {
        if (Math.random() > invaderAttackRate) {
          game.invaderShots.push(new Projectile({ x: this.coordinates.x + this.size.width / 2, y: this.coordinates.y + this.size.height }, { x: 0, y: 2.3 }));
        }
      }
      draw() {
        if (this.active) drawClawd(screen!, this.coordinates.x, this.coordinates.y, invaderSize);
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
      coordinates: Vec = { x: (gameSize.width / 2 - this.size.width / 2) | 0, y: gameSize.height - this.size.height - 16 };
      projectile: Projectile[] = [];
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
          } else if (this.shooterHeat > 9) this.shooterHeat = -5;
        } else this.shooterHeat = -5;
      }
      draw() {
        if (this.active) drawShip(screen!, this.coordinates.x, this.coordinates.y, this.size.width);
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
        screen!.clearRect(0, 0, gameSize.width, gameSize.height);
        if (this.lost || this.won) {
          screen!.fillStyle = mode.endOverlay;
          screen!.fillRect(0, 0, gameSize.width, gameSize.height);
          screen!.font = "400 34px Georgia, 'Times New Roman', serif";
          screen!.textAlign = "center";
          screen!.fillStyle = mode.ink;
          screen!.fillText(this.won ? "You won" : "You lost", gameSize.width / 2, gameSize.height / 2 - 14);
          screen!.font = "600 11px 'Helvetica Neue', Helvetica, Arial, sans-serif";
          screen!.fillStyle = mode.inkFaint;
          screen!.fillText(`POINTS  ${kills}`, gameSize.width / 2, gameSize.height / 2 + 18);
        } else {
          screen!.font = "700 10px 'Helvetica Neue', Helvetica, Arial, sans-serif";
          screen!.textAlign = "right";
          screen!.fillStyle = mode.inkFaint;
          screen!.fillText(`POINTS  ${kills}`, gameSize.width - 16, gameSize.height - 14);
        }
        this.player.draw();
        this.invaders.forEach((i) => i.draw());
        this.invaderShots.forEach((s) => s.draw());
      }
    }

    function initGame() {
      const width = host!.clientWidth || 720;
      if (width > 1000) gameSize = { width: 980, height: 480 };
      else if (width > 700) gameSize = { width: Math.max(320, width - 40), height: 440 };
      else gameSize = { width: Math.max(280, width - 24), height: 360 };
      canvas!.width = gameSize.width;
      canvas!.height = gameSize.height;
      kills = 0;
      game = new Game();
      game.draw();
    }

    let rafId = 0;
    function loop() {
      if (isDestroyed) return;
      if (isVisibleRef.current) {
        game.update();
        game.draw();
      }
      rafId = requestAnimationFrame(loop);
    }

    initGame();
    rafId = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      if (isDestroyed) return;
      initGame();
    });
    ro.observe(host);

    return () => {
      isDestroyed = true;
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [difficulty, gameKey, lightMode, popupOpen, mode.endOverlay, mode.ink, mode.inkFaint]);

  const handleTouch = (type: "left" | "right" | "space", active: boolean) => {
    keysRef.current[type] = active;
  };

  const gameCard = (
    <section
      ref={containerRef}
      aria-labelledby={`${uid}-title`}
      aria-describedby={`${uid}-desc`}
      className="box-border flex w-full flex-col items-center overflow-auto rounded-[22px] px-6.5 py-8 font-sans select-none"
      style={{ background: mode.pageBg, border: `1px solid ${mode.cardBorder}` }}
    >
      <header className="mb-5.5 max-w-[640px] text-center">
        <h2 id={`${uid}-title`} className="m-0 font-serif text-[25px] font-normal tracking-[-0.02em]" style={{ color: mode.ink }}>
          Space404 Game
        </h2>
        <div className="mx-auto my-3 h-px w-8" style={{ background: mode.divider }} />
        <p className="m-0 text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: mode.inkFaint }}>
          Take revenge on the Clawds
        </p>
        <p id={`${uid}-desc`} className="m-0 mt-2.5 text-[13px] leading-[1.5] font-normal" style={{ color: mode.inkSoft }}>
          Play Space404 Game online. Move with arrow keys, shoot with Space. Defeat the Clawd invaders to score points.
        </p>
        <div role="group" aria-label="Difficulty" className="mt-4 flex flex-wrap justify-center gap-2">
          {(["easy", "medium", "hard"] as Difficulty[]).map((level) => {
            const on = difficulty === level;
            return (
              <button
                key={level}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setDifficulty(level);
                  resetGame();
                }}
                className="cursor-pointer rounded-full px-3.5 py-2 text-[10px] font-bold tracking-[0.12em] uppercase"
                style={{ border: `1px solid ${mode.surfaceBorder}`, background: on ? resolvedAccent : mode.surface, color: on ? (lightMode ? "#171a21" : "#0a0a0f") : mode.inkSoft }}
              >
                {level}
              </button>
            );
          })}
          <button
            type="button"
            onClick={resetGame}
            className="cursor-pointer rounded-full px-3.5 py-2 text-[10px] font-bold tracking-[0.12em] uppercase"
            style={{ border: `1px solid ${mode.surfaceBorder}`, background: mode.surface, color: mode.inkSoft }}
          >
            Restart
          </button>
        </div>
      </header>

      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Space404 Game game board. Take revenge on the Clawds"
        className="block max-w-full touch-none rounded-[14px]"
        style={{ background: mode.canvasBg, border: `1px solid ${mode.surfaceBorder}` }}
      />

      {isMobile && (
        <div role="group" aria-label="Touch controls" className="mt-5 flex w-full max-w-[420px] justify-center gap-4">
          <button
            type="button"
            aria-label="Move left"
            onTouchStart={() => handleTouch("left", true)}
            onTouchEnd={() => handleTouch("left", false)}
            onMouseDown={() => handleTouch("left", true)}
            onMouseUp={() => handleTouch("left", false)}
            onMouseLeave={() => handleTouch("left", false)}
            className="flex h-16 w-16 touch-manipulation items-center justify-center rounded-2xl text-[22px] select-none"
            style={{ border: `1px solid ${mode.surfaceBorder}`, background: mode.surface, color: mode.ink }}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Fire"
            onTouchStart={() => handleTouch("space", true)}
            onTouchEnd={() => handleTouch("space", false)}
            onMouseDown={() => handleTouch("space", true)}
            onMouseUp={() => handleTouch("space", false)}
            onMouseLeave={() => handleTouch("space", false)}
            className="flex h-[76px] w-[76px] touch-manipulation items-center justify-center rounded-full border-none text-[11px] font-bold tracking-[0.12em] uppercase select-none"
            style={{ background: resolvedAccent, color: lightMode ? "#171a21" : "#0a0a0f" }}
          >
            Fire
          </button>
          <button
            type="button"
            aria-label="Move right"
            onTouchStart={() => handleTouch("right", true)}
            onTouchEnd={() => handleTouch("right", false)}
            onMouseDown={() => handleTouch("right", true)}
            onMouseUp={() => handleTouch("right", false)}
            onMouseLeave={() => handleTouch("right", false)}
            className="flex h-16 w-16 touch-manipulation items-center justify-center rounded-2xl text-[22px] select-none"
            style={{ border: `1px solid ${mode.surfaceBorder}`, background: mode.surface, color: mode.ink }}
          >
            →
          </button>
        </div>
      )}
    </section>
  );

  if (!asPopup) {
    return (
      <div ref={rootRef} tabIndex={0} onKeyDown={onRootKeyDown} onKeyUp={onRootKeyUp} className={cn("w-full outline-none", className)} style={style} {...props}>
        {gameCard}
      </div>
    );
  }

  return (
    <div ref={rootRef} tabIndex={0} onKeyDown={onRootKeyDown} onKeyUp={onRootKeyUp} className={cn("relative w-full outline-none", className)} style={style} {...props}>
      <div className={cn("flex", widgetOnRight ? "justify-end" : "justify-start")}>
        <motion.button
          ref={widgetTriggerRef}
          type="button"
          onClick={() => setPopupOpen(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Open Space404 Game"
          className="flex items-center gap-3 rounded-full border border-[rgba(23,26,33,0.08)] bg-white py-1.5 pr-5 pl-1.5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#121212] text-lg text-white">
            {widgetIcon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={widgetIcon} alt="" className="h-6 w-6 rounded-full object-cover" />
            ) : (
              "▣"
            )}
          </span>
          <span className="flex flex-col gap-0.5 text-left">
            <span className="text-[9px] font-bold tracking-[0.1em] whitespace-nowrap text-[rgba(23,26,33,0.4)] uppercase">Space404 Game</span>
            <span className="text-[13px] font-bold tracking-[0.02em] whitespace-nowrap text-[#171a21] uppercase">Play Now</span>
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
            style={{ background: mode.overlayBg }}
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${uid}-title`}
              className="relative w-full"
              style={{ maxWidth: 980 }}
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
