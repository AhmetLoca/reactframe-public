"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const uiFontFamily = "'Helvetica Neue', Arial, sans-serif";
const serifFontFamily = "Georgia, 'Times New Roman', serif";
const easeSignature = "cubic-bezier(0.16, 1, 0.3, 1)";
const easeDivider = "cubic-bezier(0.4, 0, 0.2, 1)";

function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = React.useState({ width: 390, height: 700 });
  React.useEffect(() => {
    if (!ref.current) return;
    let rafId: number | null = null;
    let latest = size;
    const ro = new ResizeObserver(([entry]) => {
      latest = { width: entry.contentRect.width, height: entry.contentRect.height };
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setSize(latest);
      });
    });
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return size;
}

function withOpacity(color: string, alpha: number): string {
  if (color.startsWith("#")) {
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return `rgba(255,255,255,${alpha})`;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(color: string): RGB {
  if (color.startsWith("#")) {
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
  }
  return { r: 51, g: 51, b: 68 };
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

type Axis = "x" | "z";
type Dim = "w" | "d";

interface ShapeBlock {
  x: number;
  z: number;
  w: number;
  d: number;
  baseY: number;
  color: RGB;
}

interface TowerBlock extends ShapeBlock {
  index: number;
}

interface ActiveBlock extends TowerBlock {
  axis: Axis;
  dir: number;
  speed: number;
}

interface FallingPiece extends ShapeBlock {
  vy: number;
  life: number;
  driftAxis: Axis;
  driftDir: number;
  driftSpeed: number;
}

type GameState = "ready" | "playing" | "ended" | "resetting";

interface ResetAnim {
  startTime: number;
  blocks: TowerBlock[];
}

const BLOCK_HEIGHT = 2;
const BASE_SIZE = 10;
const MOVE_AMOUNT = 12;
const GRAVITY = 70;
const FALL_LIFE = 1.1;
const RESET_STAGGER = 0.02;
const RESET_DURATION = 0.5;

type Perspective = "topDown" | "classic" | "dramatic";

const PERSPECTIVE_PRESETS: Record<Perspective, { angle: number; heightScale: number }> = {
  topDown: { angle: Math.PI / 4.6, heightScale: 0.62 },
  classic: { angle: Math.PI / 6, heightScale: 1 },
  dramatic: { angle: Math.PI / 8, heightScale: 1.15 },
};

function makeBaseBlock(color: RGB): TowerBlock {
  return { index: 0, x: -BASE_SIZE / 2, z: -BASE_SIZE / 2, w: BASE_SIZE, d: BASE_SIZE, baseY: 0, color };
}

function colorForIndex(index: number, offset: number): RGB {
  const t = index + offset;
  return {
    r: Math.sin(0.3 * t) * 55 + 200,
    g: Math.sin(0.3 * t + 2) * 55 + 200,
    b: Math.sin(0.3 * t + 4) * 55 + 200,
  };
}

function rgbCss(c: RGB): string {
  return `rgb(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)})`;
}

function darkenCss(c: RGB, factor: number): string {
  return `rgb(${Math.round(c.r * factor)},${Math.round(c.g * factor)},${Math.round(c.b * factor)})`;
}

function makeNextBlock(prev: TowerBlock, baseSpeed: number, speedIncrement: number, maxSpeed: number, color: RGB): ActiveBlock {
  const index = prev.index + 1;
  const axis: Axis = index % 2 === 1 ? "x" : "z";
  const speed = Math.min(baseSpeed + (index - 1) * speedIncrement, maxSpeed);
  const startCoord = Math.random() > 0.5 ? MOVE_AMOUNT : -MOVE_AMOUNT;
  const dir = startCoord > 0 ? -speed : speed;
  const block: ActiveBlock = { index, x: prev.x, z: prev.z, w: prev.w, d: prev.d, baseY: index * BLOCK_HEIGHT, color, axis, dir, speed };
  block[axis] = startCoord;
  return block;
}

interface ProjectOpts {
  unit: number;
  centerX: number;
  centerY: number;
  camY: number;
  isoCos: number;
  isoSin: number;
  heightScale: number;
}

function project(x: number, y: number, z: number, opts: ProjectOpts): [number, number] {
  const sx = opts.centerX + (x - z) * opts.unit * opts.isoCos;
  const sy = opts.centerY + (x + z) * opts.unit * opts.isoSin - (y - opts.camY) * opts.unit * opts.heightScale;
  return [sx, sy];
}

function fillPoly(ctx: CanvasRenderingContext2D, pts: [number, number][], style: string) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fillStyle = style;
  ctx.fill();
}

function drawShape(ctx: CanvasRenderingContext2D, shape: ShapeBlock, opts: ProjectOpts, alpha: number, scale: number) {
  if (shape.w <= 0 || shape.d <= 0 || alpha <= 0) return;
  const cx = shape.x + shape.w / 2;
  const cz = shape.z + shape.d / 2;
  const w = shape.w * scale;
  const d = shape.d * scale;
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const z0 = cz - d / 2;
  const z1 = cz + d / 2;
  const yTop = shape.baseY + BLOCK_HEIGHT;
  const yBot = shape.baseY;

  const top: [number, number][] = [project(x0, yTop, z0, opts), project(x1, yTop, z0, opts), project(x1, yTop, z1, opts), project(x0, yTop, z1, opts)];
  const right: [number, number][] = [project(x1, yTop, z0, opts), project(x1, yTop, z1, opts), project(x1, yBot, z1, opts), project(x1, yBot, z0, opts)];
  const front: [number, number][] = [project(x0, yTop, z1, opts), project(x1, yTop, z1, opts), project(x1, yBot, z1, opts), project(x0, yBot, z1, opts)];

  ctx.globalAlpha = alpha;
  fillPoly(ctx, top, rgbCss(shape.color));
  fillPoly(ctx, right, darkenCss(shape.color, 0.62));
  fillPoly(ctx, front, darkenCss(shape.color, 0.8));
  ctx.globalAlpha = 1;
}

export interface TowerBlocksGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  perspective?: Perspective;
  bgColor?: string;
  textColor?: string;
  baseBlockColor?: string;
  rainbowBlocks?: boolean;
  blockColor?: string;
  perfectTolerance?: number;
  baseSpeed?: number;
  speedIncrement?: number;
  maxSpeed?: number;
  hideInstructionsAfter?: number;
  showInstructions?: boolean;
  instructionsText?: string;
  gameOverTitle?: string;
  gameOverSubtitle?: string;
  restartHint?: string;
  startButtonLabel?: string;
}

export function TowerBlocksGame({
  className,
  style,
  perspective = "topDown",
  bgColor = "#0a0a12",
  textColor = "#ffffff",
  baseBlockColor = "#ffffff",
  rainbowBlocks = true,
  blockColor = "#5C8DFF",
  perfectTolerance = 0.3,
  baseSpeed = 6,
  speedIncrement = 0.35,
  maxSpeed = 42,
  hideInstructionsAfter = 4,
  showInstructions = true,
  instructionsText = "Click or press space to place the block",
  gameOverTitle = "Game Over",
  gameOverSubtitle = "You did great, you're the best.",
  restartHint = "Click or press space to play again",
  startButtonLabel = "Start",
  ...props
}: TowerBlocksGameProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { width, height } = useContainerSize(containerRef);

  const [gameState, setGameState] = React.useState<GameState>("ready");
  const [score, setScore] = React.useState(0);

  const stackRef = React.useRef<TowerBlock[]>([makeBaseBlock(hexToRgb(baseBlockColor))]);
  const activeRef = React.useRef<ActiveBlock | null>(null);
  const choppedRef = React.useRef<FallingPiece[]>([]);
  const colorOffsetRef = React.useRef(Math.round(Math.random() * 100));
  const cameraRef = React.useRef({ current: 0, target: 0 });
  const resetAnimRef = React.useRef<ResetAnim | null>(null);
  const lastTimeRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const resetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameStateRef = React.useRef<GameState>("ready");
  gameStateRef.current = gameState;

  const liveRef = React.useRef({
    rainbowBlocks,
    blockRgb: hexToRgb(blockColor),
    perfectTolerance,
    baseSpeed,
    speedIncrement,
    maxSpeed,
    bgColor,
    perspective: PERSPECTIVE_PRESETS[perspective],
  });
  liveRef.current = {
    rainbowBlocks,
    blockRgb: hexToRgb(blockColor),
    perfectTolerance,
    baseSpeed,
    speedIncrement,
    maxSpeed,
    bgColor,
    perspective: PERSPECTIVE_PRESETS[perspective],
  };

  const nextColor = React.useCallback((index: number): RGB => {
    const live = liveRef.current;
    return live.rainbowBlocks ? colorForIndex(index, colorOffsetRef.current) : live.blockRgb;
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [width, height]);

  const draw = React.useCallback(
    (nowSeconds: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const unit = Math.min(width, height) / 30;
      const preset = liveRef.current.perspective;
      const opts: ProjectOpts = {
        unit,
        centerX: width / 2,
        centerY: height * 0.6,
        camY: cameraRef.current.current,
        isoCos: Math.cos(preset.angle),
        isoSin: Math.sin(preset.angle),
        heightScale: preset.heightScale,
      };

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = liveRef.current.bgColor;
      ctx.fillRect(0, 0, width, height);

      const glowRadius = Math.max(width, height) * 0.65;
      const glow = ctx.createRadialGradient(opts.centerX, height * 0.38, 0, opts.centerX, height * 0.38, glowRadius);
      glow.addColorStop(0, "rgba(255,255,255,0.07)");
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const resetAnim = resetAnimRef.current;
      const stack = stackRef.current;
      for (let i = 0; i < stack.length; i++) {
        let alpha = 1;
        let scale = 1;
        if (resetAnim && i > 0) {
          const idxFromTop = stack.length - i;
          const delay = idxFromTop * RESET_STAGGER;
          const t = clamp((nowSeconds - resetAnim.startTime - delay) / RESET_DURATION, 0, 1);
          scale = 1 - t;
          alpha = 1 - t;
        }
        drawShape(ctx, stack[i], opts, alpha, scale);
      }

      const active = activeRef.current;
      if (active) drawShape(ctx, active, opts, 1, 1);

      const chopped = choppedRef.current;
      for (let i = 0; i < chopped.length; i++) {
        drawShape(ctx, chopped[i], opts, clamp(chopped[i].life / FALL_LIFE, 0, 1), 1);
      }
    },
    [width, height]
  );

  const tick = React.useCallback(
    (now: number) => {
      const last = lastTimeRef.current ?? now;
      const dt = Math.min((now - last) / 1000, 0.05);
      lastTimeRef.current = now;
      const nowSeconds = now / 1000;

      const active = activeRef.current;
      if (active && gameStateRef.current === "playing") {
        active[active.axis] += active.dir * dt;
        const val = active[active.axis];
        if (val > MOVE_AMOUNT) {
          active[active.axis] = MOVE_AMOUNT;
          active.dir = -Math.abs(active.speed);
        } else if (val < -MOVE_AMOUNT) {
          active[active.axis] = -MOVE_AMOUNT;
          active.dir = Math.abs(active.speed);
        }
      }

      const chopped = choppedRef.current;
      for (let i = chopped.length - 1; i >= 0; i--) {
        const piece = chopped[i];
        piece.vy += GRAVITY * dt;
        piece.baseY -= piece.vy * dt;
        piece[piece.driftAxis] += piece.driftDir * piece.driftSpeed * dt;
        piece.life -= dt;
        if (piece.life <= 0) chopped.splice(i, 1);
      }

      const cam = cameraRef.current;
      cam.current += (cam.target - cam.current) * Math.min(1, dt * 6);

      if (resetAnimRef.current) {
        const elapsed = nowSeconds - resetAnimRef.current.startTime;
        const totalStack = resetAnimRef.current.blocks.length;
        const totalDuration = totalStack * RESET_STAGGER + RESET_DURATION;
        if (elapsed >= totalDuration) {
          resetAnimRef.current = null;
          const base = stackRef.current[0];
          stackRef.current = [base];
          colorOffsetRef.current = Math.round(Math.random() * 100);
          cam.current = 0;
          cam.target = 0;
          setScore(0);
          const live = liveRef.current;
          activeRef.current = makeNextBlock(base, live.baseSpeed, live.speedIncrement, live.maxSpeed, nextColor(1));
          setGameState("playing");
        }
      }

      draw(nowSeconds);
    },
    [draw, nextColor]
  );

  const startLoop = React.useCallback(() => {
    if (rafRef.current !== null) return;
    const step = (t: number) => {
      rafRef.current = requestAnimationFrame(step);
      tick(t);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [tick]);

  const stopLoop = React.useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startLoop();
        else stopLoop();
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stopLoop();
    };
  }, [startLoop, stopLoop]);

  React.useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const startGame = React.useCallback(() => {
    const live = liveRef.current;
    setScore(0);
    activeRef.current = makeNextBlock(
      stackRef.current[stackRef.current.length - 1],
      live.baseSpeed,
      live.speedIncrement,
      live.maxSpeed,
      nextColor(stackRef.current.length)
    );
    cameraRef.current.target = activeRef.current.baseY;
    setGameState("playing");
  }, [nextColor]);

  const restartGame = React.useCallback(() => {
    setGameState("resetting");
    resetAnimRef.current = { startTime: (lastTimeRef.current ?? performance.now()) / 1000, blocks: stackRef.current.slice(1) };
    activeRef.current = null;
    cameraRef.current.target = 0;
  }, []);

  const placeBlock = React.useCallback(() => {
    const active = activeRef.current;
    const stack = stackRef.current;
    if (!active || stack.length === 0) return;
    const target = stack[stack.length - 1];
    const axis = active.axis;
    const dim: Dim = axis === "x" ? "w" : "d";
    const tolerance = liveRef.current.perfectTolerance;
    const overlap = target[dim] - Math.abs(active[axis] - target[axis]);

    if (target[dim] - overlap < tolerance) {
      const placed: TowerBlock = { index: active.index, x: target.x, z: target.z, w: target.w, d: target.d, baseY: active.baseY, color: active.color };
      stack.push(placed);
    } else if (overlap > 0) {
      const choppedSize = active[dim] - overlap;
      const placed: TowerBlock = { index: active.index, x: active.x, z: active.z, w: active.w, d: active.d, baseY: active.baseY, color: active.color };
      const fallenPiece: FallingPiece = {
        x: active.x,
        z: active.z,
        w: active.w,
        d: active.d,
        baseY: active.baseY,
        color: active.color,
        vy: 0,
        life: FALL_LIFE,
        driftAxis: axis,
        driftDir: active[axis] < target[axis] ? -1 : 1,
        driftSpeed: Math.abs(active.speed) * 1.4,
      };
      placed[dim] = overlap;
      fallenPiece[dim] = choppedSize;
      if (active[axis] < target[axis]) {
        placed[axis] = target[axis];
        fallenPiece[axis] = active[axis];
      } else {
        placed[axis] = active[axis];
        fallenPiece[axis] = active[axis] + overlap;
      }
      stack.push(placed);
      choppedRef.current.push(fallenPiece);
    } else {
      choppedRef.current.push({
        x: active.x,
        z: active.z,
        w: active.w,
        d: active.d,
        baseY: active.baseY,
        color: active.color,
        vy: 0,
        life: FALL_LIFE,
        driftAxis: axis,
        driftDir: active[axis] < target[axis] ? -1 : 1,
        driftSpeed: Math.abs(active.speed) * 1.4,
      });
      activeRef.current = null;
      setGameState("ended");
      return;
    }

    const placedCount = stack.length - 1;
    setScore(placedCount);
    const live = liveRef.current;
    activeRef.current = makeNextBlock(stack[stack.length - 1], live.baseSpeed, live.speedIncrement, live.maxSpeed, nextColor(stack.length));
    cameraRef.current.target = activeRef.current.baseY;
  }, [nextColor]);

  const handleAction = React.useCallback(() => {
    if (gameState === "ready") startGame();
    else if (gameState === "playing") placeBlock();
    else if (gameState === "ended") restartGame();
  }, [gameState, startGame, placeBlock, restartGame]);

  const instructionsHidden = score >= hideInstructionsAfter;
  const instanceId = React.useId();

  const ariaLabel =
    gameState === "ready" ? `${startButtonLabel} — Tower Blocks` : gameState === "playing" ? "Place block" : gameState === "ended" ? restartHint : "Resetting";

  return (
    <div
      ref={containerRef}
      data-twb={instanceId}
      className={cn("relative w-full h-full min-h-[300px] overflow-hidden", className)}
      style={{ background: bgColor, fontFamily: uiFontFamily, ...style }}
      {...props}
    >
      <style>{`
        [data-twb="${instanceId}"] .twb-surface:focus-visible {
          outline: 2px solid ${textColor};
          outline-offset: -4px;
        }
      `}</style>

      <button
        type="button"
        className="twb-surface"
        aria-label={ariaLabel}
        onClick={handleAction}
        style={{ all: "unset", boxSizing: "border-box", position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "pointer" }}
      >
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, display: "block" }} />

        <div
          aria-hidden="true"
          className="absolute top-5 w-full text-center"
          style={{
            color: textColor,
            transform: gameState === "ready" ? "translateY(-200px) scale(1)" : gameState === "ended" ? "translateY(6vh) scale(1.4)" : "translateY(0px) scale(1)",
            transition: `transform 0.5s ${easeSignature}`,
          }}
        >
          <div style={{ fontFamily: uiFontFamily, fontWeight: 700, fontSize: 90, textShadow: "0 0 24px rgba(255,255,255,0.25)" }}>{score}</div>
        </div>

        {showInstructions && (
          <div
            aria-hidden="true"
            className="absolute left-0 flex w-full justify-center"
            style={{
              top: "14vh",
              opacity: gameState === "playing" && !instructionsHidden ? 1 : 0,
              transition: `opacity 0.5s ${easeSignature}`,
            }}
          >
            <span
              className="rounded-[40px] border px-[18px] py-2 uppercase tracking-[0.15em] backdrop-blur-[8px]"
              style={{
                fontFamily: uiFontFamily,
                fontSize: 11,
                color: withOpacity(textColor, 0.65),
                background: withOpacity(textColor, 0.08),
                borderColor: withOpacity(textColor, 0.2),
              }}
            >
              {instructionsText}
            </span>
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute top-0 left-0 flex h-full w-full items-end justify-center pb-[18%]"
          style={{
            opacity: gameState === "ready" ? 1 : 0,
            transform: gameState === "ready" ? "translateY(0)" : "translateY(-50px)",
            transition: `opacity 0.5s ${easeSignature}, transform 0.5s ${easeSignature}`,
            pointerEvents: "none",
          }}
        >
          <div
            className="rounded-[40px] border px-[38px] py-3.5 uppercase tracking-[0.18em] backdrop-blur-[8px]"
            style={{
              fontFamily: uiFontFamily,
              fontSize: 20,
              letterSpacing: "0.18em",
              color: textColor,
              background: withOpacity(textColor, 0.08),
              borderColor: withOpacity(textColor, 0.2),
            }}
          >
            {startButtonLabel}
          </div>
        </div>

        <div aria-hidden="true" className="absolute top-0 left-0 flex h-[85%] w-full flex-col items-center justify-center gap-3.5" style={{ pointerEvents: "none" }}>
          <h2
            className="m-0"
            style={{
              fontFamily: serifFontFamily,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              fontSize: 34,
              color: textColor,
              opacity: gameState === "ended" ? 1 : 0,
              transform: gameState === "ended" ? "translateY(0)" : "translateY(-50px)",
              transition: `opacity 0.5s ${easeSignature}, transform 0.5s ${easeSignature}`,
            }}
          >
            {gameOverTitle}
          </h2>
          <div
            className="h-px w-10"
            style={{
              background: textColor,
              opacity: gameState === "ended" ? 0.3 : 0,
              transform: gameState === "ended" ? "scaleX(1)" : "scaleX(0)",
              transition: `opacity 0.4s ${easeDivider} 0.15s, transform 0.5s ${easeDivider} 0.15s`,
            }}
          />
          <p
            className="m-0"
            style={{
              fontFamily: uiFontFamily,
              lineHeight: 1.5,
              fontSize: 15,
              color: withOpacity(textColor, 0.65),
              opacity: gameState === "ended" ? 1 : 0,
              transform: gameState === "ended" ? "translateY(0)" : "translateY(-50px)",
              transition: `opacity 0.5s ${easeSignature} 0.25s, transform 0.5s ${easeSignature} 0.25s`,
            }}
          >
            {gameOverSubtitle}
          </p>
          <p
            className="m-0"
            style={{
              fontFamily: uiFontFamily,
              lineHeight: 1.5,
              fontSize: 15,
              color: withOpacity(textColor, 0.4),
              opacity: gameState === "ended" ? 1 : 0,
              transform: gameState === "ended" ? "translateY(0)" : "translateY(-50px)",
              transition: `opacity 0.5s ${easeSignature} 0.4s, transform 0.5s ${easeSignature} 0.4s`,
            }}
          >
            {restartHint}
          </p>
        </div>
      </button>
    </div>
  );
}
