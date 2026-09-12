"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TearableRevealFit = "cover" | "contain" | "fill";
export type TearableRevealSurfaceStyle = "smooth" | "textured";
export type TearableRevealEdgeStyle = "jagged" | "rounded" | "both";
export type TearableRevealTextAlign = "left" | "center" | "right";

export interface TearableRevealProps {
  backgroundSrc?: string;
  backgroundAlt?: string;
  backgroundFit?: TearableRevealFit;
  backgroundPositionX?: number;
  backgroundPositionY?: number;
  backgroundColor?: string;
  clothColorStart?: string;
  clothColorEnd?: string;
  clothOpacity?: number;
  columns?: number;
  rows?: number;
  tearThreshold?: number;
  brushRadius?: number;
  gravity?: number;
  ambientSway?: number;
  surfaceStyle?: TearableRevealSurfaceStyle;
  showParticles?: boolean;
  showShadow?: boolean;
  tearEdgeStyle?: TearableRevealEdgeStyle;
  surfaceText?: string;
  surfaceTextSize?: number;
  surfaceTextColor?: string;
  surfaceTextFont?: string;
  surfaceTextWeight?: number;
  surfaceTextAlign?: TearableRevealTextAlign;
  surfaceTextOpacity?: number;
  surfaceLogoSrc?: string;
  surfaceLogoWidth?: number;
  surfaceLogoPositionX?: number;
  surfaceLogoPositionY?: number;
  surfaceLogoOffsetX?: number;
  surfaceLogoOffsetY?: number;
  surfaceLogoOpacity?: number;
  pinTopRow?: boolean;
  showAutoTearButton?: boolean;
  autoTearButtonLabel?: string;
  autoTearDuration?: number;
  autoStartTear?: boolean;
  autoStartDelay?: number;
  showHint?: boolean;
  hintText?: string;
  resetLabel?: string;
  showResetButton?: boolean;
  onFullyTorn?: () => void;
  className?: string;
}

interface ClothPoint {
  x: number;
  y: number;
  ox: number;
  oy: number;
  pinned: boolean;
  anchored: boolean;
  orphanSince: number | null;
}

interface ClothConstraint {
  a: number;
  b: number;
  length: number;
  broken: boolean;
}

interface ClothParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  rotation: number;
  spin: number;
}

interface TearFlash {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  radius: number;
}

const FADE_DURATION = 1.7;
const ORPHAN_FALL_DELAY = 0.4;
const GRAVITY_BOOST = 1.7;
const MAX_PARTICLES = 140;
const PARTICLE_GRAVITY = 620;
// Caps how far a point (or the drag force pulling it) can move in a single
// frame. Without this, a fast swipe or a chain-reaction of breaking
// constraints can fling a point far past its neighbors in one step — for
// that frame the mesh renders as a wildly stretched, tangled web before the
// constraint solver has a chance to catch up.
const MAX_POINT_STEP = 42;

function clampMagnitude(x: number, y: number, max: number): [number, number] {
  const distSq = x * x + y * y;
  if (distSq <= max * max) return [x, y];
  const dist = Math.sqrt(distSq);
  const scale = max / dist;
  return [x * scale, y * scale];
}

const SCISSORS_OPEN_SVG =
  `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><g fill='none' stroke='%23222' stroke-width='2'><circle cx='9' cy='23' r='4'/><circle cx='23' cy='23' r='4'/><path d='M11 20 L26 5 M21 20 L6 5'/></g></svg>`;
const SCISSORS_CLOSED_SVG =
  `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><g fill='none' stroke='%23222' stroke-width='2'><circle cx='9' cy='23' r='4'/><circle cx='23' cy='23' r='4'/><path d='M13 20 L26 8 M18 20 L6 8'/></g></svg>`;

const SCISSORS_OPEN_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(SCISSORS_OPEN_SVG)}") 4 4, crosshair`;
const SCISSORS_CLOSED_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(SCISSORS_CLOSED_SVG)}") 4 4, crosshair`;

function pointFadeAlpha(p: ClothPoint, t: number): number {
  if (p.anchored || p.orphanSince === null) return 1;
  const elapsed = t - p.orphanSince - ORPHAN_FALL_DELAY;
  if (elapsed <= 0) return 1;
  const clamped = Math.max(0, Math.min(1, 1 - elapsed / FADE_DURATION));
  return clamped * clamped;
}

function distToSegmentSq(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-6) {
    const ddx = px - x1;
    const ddy = py - y1;
    return ddx * ddx + ddy * ddy;
  }
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + dx * t;
  const cy = y1 + dy * t;
  const ddx = px - cx;
  const ddy = py - cy;
  return ddx * ddx + ddy * ddy;
}

function cornerTearPoint(progress: number, w: number, h: number): { x: number; y: number } {
  const anchors: Array<[number, number]> = [
    [0, h * 0.05],
    [w * 0.07, h * 0.11],
    [w * 0.14, h * 0.22],
  ];
  const clamped = Math.max(0, Math.min(1, progress));
  const segT = clamped * (anchors.length - 1);
  const idx = Math.min(anchors.length - 2, Math.floor(segT));
  const localT = segT - idx;
  const [ax, ay] = anchors[idx];
  const [bx, by] = anchors[idx + 1];
  return { x: ax + (bx - ax) * localT, y: ay + (by - ay) * localT };
}

function hash2(a: number, b: number): number {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function spawnTearFlash(flashes: TearFlash[], x: number, y: number, radius: number) {
  if (flashes.length >= 30) flashes.shift();
  flashes.push({ x, y, life: 0, maxLife: 0.22, radius });
}

function spawnTearParticles(
  particles: ClothParticle[],
  x: number,
  y: number,
  dirX: number,
  dirY: number,
  seed: number
) {
  if (particles.length >= MAX_PARTICLES) return;
  const count = 2 + Math.floor(hash2(seed, 0.7) * 2);
  for (let i = 0; i < count; i++) {
    if (particles.length >= MAX_PARTICLES) break;
    const angle = Math.atan2(dirY, dirX) + (hash2(seed + i, 1.3) - 0.5) * 2.4;
    const speed = 30 + hash2(seed + i, 2.9) * 70;
    particles.push({
      x: x + (hash2(seed + i, 3.7) - 0.5) * 6,
      y: y + (hash2(seed + i, 4.9) - 0.5) * 6,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 40,
      life: 0,
      maxLife: 0.5 + hash2(seed + i, 5.3) * 0.6,
      size: 2 + hash2(seed + i, 6.1) * 4,
      rotation: hash2(seed + i, 7.2) * Math.PI * 2,
      spin: (hash2(seed + i, 8.4) - 0.5) * 10,
    });
  }
}

function frayEdge(
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  seed: number,
  outwardX: number,
  outwardY: number,
  style: TearableRevealEdgeStyle
): void {
  const dx = bx - ax;
  const dy = by - ay;
  const edgeLen = Math.hypot(dx, dy);
  if (edgeLen < 1) return;

  let nx = -dy / edgeLen;
  let ny = dx / edgeLen;
  if (nx * outwardX + ny * outwardY < 0) {
    nx = -nx;
    ny = -ny;
  }

  const useFrayed = style === "jagged" || (style === "both" && hash2(seed, 99.1) < 0.5);

  if (useFrayed) {
    // Natural cloth fray: a soft irregular wave (no hard corners) plus a
    // couple of loose thread wisps, instead of uniform sharp triangles.
    const segments = edgeLen > 50 ? 7 : edgeLen > 25 ? 5 : 3;
    const step = edgeLen / segments;
    const ux = dx / edgeLen;
    const uy = dy / edgeLen;

    const pts: { x: number; y: number }[] = [{ x: ax, y: ay }];
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const baseX = ax + dx * t;
      const baseY = ay + dy * t;
      const shallow = hash2(seed, i * 3.1 + 1);
      const notch = hash2(seed + 11, i * 5.7 + 2) < 0.25 ? 1.7 : 1;
      const depth = step * (0.12 + shallow * 0.5) * notch;
      const along = (hash2(seed + 3, i * 2.2 + 3) - 0.5) * step * 0.3;
      pts.push({ x: baseX + nx * depth + ux * along, y: baseY + ny * depth + uy * along });
    }
    pts.push({ x: bx, y: by });

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const cur = pts[i];
      const next = pts[i + 1];
      const midX = (cur.x + next.x) / 2;
      const midY = (cur.y + next.y) / 2;
      ctx.quadraticCurveTo(cur.x, cur.y, midX, midY);
    }
    ctx.lineTo(bx, by);
    ctx.closePath();
    ctx.fill();

    const threadCount = edgeLen > 40 ? 2 : 1;
    const prevCap = ctx.lineCap;
    ctx.lineCap = "round";
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = Math.max(0.6, edgeLen * 0.012);
    for (let i = 0; i < threadCount; i++) {
      const t = 0.2 + hash2(seed + 40, i * 7.7 + 1) * 0.6;
      const baseX = ax + dx * t;
      const baseY = ay + dy * t;
      const len = step * (0.4 + hash2(seed + 50, i * 4.1 + 2) * 0.5);
      const wob = (hash2(seed + 60, i * 6.3 + 3) - 0.5) * len * 0.7;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(baseX + nx * len * 0.5 + ux * wob, baseY + ny * len * 0.5 + uy * wob, baseX + nx * len, baseY + ny * len);
      ctx.stroke();
    }
    ctx.lineCap = prevCap;
  } else {
    const bites = edgeLen > 40 ? 3 : 2;
    for (let i = 0; i < bites; i++) {
      const baseT = (i + 0.5) / bites;
      const jitterT = (hash2(seed, i * 7.31 + 1) - 0.5) * 0.4;
      const t = Math.min(0.94, Math.max(0.06, baseT + jitterT));
      const px = ax + dx * t;
      const py = ay + dy * t;
      const jitterR = 0.32 + hash2(seed + 19, i * 3.71 + 2) * 0.3;
      const radius = (edgeLen / bites) * jitterR;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function clampByte(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function parseColorToRgb(input: string): [number, number, number] {
  const s = input.trim();
  if (s.startsWith("#")) {
    let hex = s.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const num = parseInt(hex.slice(0, 6), 16);
    return [clampByte((num >> 16) & 255), clampByte((num >> 8) & 255), clampByte(num & 255)];
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
    return [clampByte(parts[0] ?? 0), clampByte(parts[1] ?? 0), clampByte(parts[2] ?? 0)];
  }
  return [128, 128, 128];
}

export function TearableReveal({
  backgroundSrc,
  backgroundAlt = "",
  backgroundFit = "cover",
  backgroundPositionX = 50,
  backgroundPositionY = 50,
  backgroundColor = "#f4f3f1",
  clothColorStart = "#5a78c8",
  clothColorEnd = "#6eb48c",
  clothOpacity = 0.94,
  columns = 40,
  rows = 27,
  tearThreshold = 1.15,
  brushRadius = 56,
  gravity = 480,
  ambientSway = 4,
  surfaceStyle = "textured",
  showParticles = true,
  showShadow = true,
  tearEdgeStyle = "jagged",
  surfaceText = "",
  surfaceTextSize = 32,
  surfaceTextColor = "#0d0d0d",
  surfaceTextFont = "Helvetica Neue, Arial, sans-serif",
  surfaceTextWeight = 400,
  surfaceTextAlign = "center",
  surfaceTextOpacity = 0.9,
  surfaceLogoSrc,
  surfaceLogoWidth = 28,
  surfaceLogoPositionX = 50,
  surfaceLogoPositionY = 50,
  surfaceLogoOffsetX = 0,
  surfaceLogoOffsetY = 0,
  surfaceLogoOpacity = 0.95,
  pinTopRow = true,
  showAutoTearButton = false,
  autoTearButtonLabel = "Or click this button",
  autoTearDuration = 1.4,
  autoStartTear = false,
  autoStartDelay = 2,
  showHint = true,
  hintText = "Drag — it tears easily",
  resetLabel = "Reset",
  showResetButton = true,
  onFullyTorn,
  className,
}: TearableRevealProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);

  const pointsRef = React.useRef<ClothPoint[]>([]);
  const constraintsRef = React.useRef<ClothConstraint[]>([]);
  const edgeMapRef = React.useRef<Map<string, ClothConstraint>>(new Map());
  const adjacencyRef = React.useRef<number[][]>([]);
  const particlesRef = React.useRef<ClothParticle[]>([]);
  const flashesRef = React.useRef<TearFlash[]>([]);

  const sizeRef = React.useRef({ w: 0, h: 0 });
  const colsRef = React.useRef(columns);
  const rowsRef = React.useRef(rows);
  const timeRef = React.useRef(0);
  const firedFullTearRef = React.useRef(false);

  const mouseRef = React.useRef({ x: 0, y: 0, px: 0, py: 0, down: false });

  const autoTearActiveRef = React.useRef(false);
  const autoTearProgressRef = React.useRef(0);
  const [autoTearActive, setAutoTearActive] = React.useState(false);

  const cornerTearActiveRef = React.useRef(false);
  const cornerTearProgressRef = React.useRef(0);
  const cornerTearPrevRef = React.useRef({ x: 0, y: 0 });

  const [tornFraction, setTornFraction] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const liveTearThreshold = React.useRef(tearThreshold);
  const liveBrushRadius = React.useRef(brushRadius);
  const liveGravity = React.useRef(gravity);
  const liveAmbientSway = React.useRef(ambientSway);
  const livePinTopRow = React.useRef(pinTopRow);
  const liveClothOpacity = React.useRef(clothOpacity);
  const liveSurfaceStyle = React.useRef(surfaceStyle);
  const liveShowParticles = React.useRef(showParticles);
  const liveShowShadow = React.useRef(showShadow);
  const liveTearEdgeStyle = React.useRef(tearEdgeStyle);
  const liveOnFullyTorn = React.useRef(onFullyTorn);
  const liveAutoTearDuration = React.useRef(autoTearDuration);
  const liveClothColorStart = React.useRef(clothColorStart);
  const liveClothColorEnd = React.useRef(clothColorEnd);

  const liveSurfaceText = React.useRef(surfaceText);
  const liveSurfaceTextSize = React.useRef(surfaceTextSize);
  const liveSurfaceTextColor = React.useRef(surfaceTextColor);
  const liveSurfaceTextFont = React.useRef(surfaceTextFont);
  const liveSurfaceTextWeight = React.useRef(surfaceTextWeight);
  const liveSurfaceTextAlign = React.useRef(surfaceTextAlign);
  const liveSurfaceTextOpacity = React.useRef(surfaceTextOpacity);

  const liveSurfaceLogoWidth = React.useRef(surfaceLogoWidth);
  const liveSurfaceLogoPositionX = React.useRef(surfaceLogoPositionX);
  const liveSurfaceLogoPositionY = React.useRef(surfaceLogoPositionY);
  const liveSurfaceLogoOffsetX = React.useRef(surfaceLogoOffsetX);
  const liveSurfaceLogoOffsetY = React.useRef(surfaceLogoOffsetY);
  const liveSurfaceLogoOpacity = React.useRef(surfaceLogoOpacity);

  const logoImageRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    liveClothColorStart.current = clothColorStart;
  }, [clothColorStart]);
  React.useEffect(() => {
    liveClothColorEnd.current = clothColorEnd;
  }, [clothColorEnd]);
  React.useEffect(() => {
    liveTearThreshold.current = tearThreshold;
  }, [tearThreshold]);
  React.useEffect(() => {
    liveBrushRadius.current = brushRadius;
  }, [brushRadius]);
  React.useEffect(() => {
    liveGravity.current = gravity;
  }, [gravity]);
  React.useEffect(() => {
    liveAmbientSway.current = ambientSway;
  }, [ambientSway]);
  React.useEffect(() => {
    livePinTopRow.current = pinTopRow;
  }, [pinTopRow]);
  React.useEffect(() => {
    liveClothOpacity.current = clothOpacity;
  }, [clothOpacity]);
  React.useEffect(() => {
    liveSurfaceStyle.current = surfaceStyle;
  }, [surfaceStyle]);
  React.useEffect(() => {
    liveShowParticles.current = showParticles;
  }, [showParticles]);
  React.useEffect(() => {
    liveShowShadow.current = showShadow;
  }, [showShadow]);
  React.useEffect(() => {
    liveTearEdgeStyle.current = tearEdgeStyle;
  }, [tearEdgeStyle]);
  React.useEffect(() => {
    liveOnFullyTorn.current = onFullyTorn;
  }, [onFullyTorn]);
  React.useEffect(() => {
    liveAutoTearDuration.current = autoTearDuration;
  }, [autoTearDuration]);
  React.useEffect(() => {
    liveSurfaceText.current = surfaceText;
  }, [surfaceText]);
  React.useEffect(() => {
    liveSurfaceTextSize.current = surfaceTextSize;
  }, [surfaceTextSize]);
  React.useEffect(() => {
    liveSurfaceTextColor.current = surfaceTextColor;
  }, [surfaceTextColor]);
  React.useEffect(() => {
    liveSurfaceTextFont.current = surfaceTextFont;
  }, [surfaceTextFont]);
  React.useEffect(() => {
    liveSurfaceTextWeight.current = surfaceTextWeight;
  }, [surfaceTextWeight]);
  React.useEffect(() => {
    liveSurfaceTextAlign.current = surfaceTextAlign;
  }, [surfaceTextAlign]);
  React.useEffect(() => {
    liveSurfaceTextOpacity.current = surfaceTextOpacity;
  }, [surfaceTextOpacity]);
  React.useEffect(() => {
    liveSurfaceLogoWidth.current = surfaceLogoWidth;
  }, [surfaceLogoWidth]);
  React.useEffect(() => {
    liveSurfaceLogoPositionX.current = surfaceLogoPositionX;
  }, [surfaceLogoPositionX]);
  React.useEffect(() => {
    liveSurfaceLogoPositionY.current = surfaceLogoPositionY;
  }, [surfaceLogoPositionY]);
  React.useEffect(() => {
    liveSurfaceLogoOffsetX.current = surfaceLogoOffsetX;
  }, [surfaceLogoOffsetX]);
  React.useEffect(() => {
    liveSurfaceLogoOffsetY.current = surfaceLogoOffsetY;
  }, [surfaceLogoOffsetY]);
  React.useEffect(() => {
    liveSurfaceLogoOpacity.current = surfaceLogoOpacity;
  }, [surfaceLogoOpacity]);

  React.useEffect(() => {
    if (!surfaceLogoSrc) {
      logoImageRef.current = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      logoImageRef.current = img;
    };
    img.src = surfaceLogoSrc;
    return () => {
      img.onload = null;
    };
  }, [surfaceLogoSrc]);

  const buildCloth = React.useCallback(() => {
    const { w, h } = sizeRef.current;
    if (w <= 0 || h <= 0) return;
    const cols = colsRef.current;
    const rows_ = rowsRef.current;
    const spacingX = w / (cols - 1);
    const spacingY = h / (rows_ - 1);
    const points: ClothPoint[] = [];
    for (let y = 0; y < rows_; y++) {
      for (let x = 0; x < cols; x++) {
        const px = x * spacingX;
        const py = y * spacingY;
        points.push({
          x: px,
          y: py,
          ox: px,
          oy: py,
          pinned: livePinTopRow.current && y === 0,
          anchored: true,
          orphanSince: null,
        });
      }
    }

    const idx = (x: number, y: number) => y * cols + x;
    const constraints: ClothConstraint[] = [];
    const edgeMap = new Map<string, ClothConstraint>();
    const adjacency: number[][] = points.map(() => []);

    const addConstraint = (a: number, b: number) => {
      const pa = points[a];
      const pb = points[b];
      const length = Math.hypot(pb.x - pa.x, pb.y - pa.y);
      const c: ClothConstraint = { a, b, length, broken: false };
      constraints.push(c);
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      edgeMap.set(key, c);
      const ci = constraints.length - 1;
      adjacency[a].push(ci);
      adjacency[b].push(ci);
    };

    for (let y = 0; y < rows_; y++) {
      for (let x = 0; x < cols; x++) {
        if (x < cols - 1) addConstraint(idx(x, y), idx(x + 1, y));
        if (y < rows_ - 1) addConstraint(idx(x, y), idx(x, y + 1));
      }
    }

    pointsRef.current = points;
    constraintsRef.current = constraints;
    edgeMapRef.current = edgeMap;
    adjacencyRef.current = adjacency;
    firedFullTearRef.current = false;
    setTornFraction(0);
  }, []);

  const isEdgeBroken = React.useCallback((x1: number, y1: number, x2: number, y2: number) => {
    const cols = colsRef.current;
    const i1 = y1 * cols + x1;
    const i2 = y2 * cols + x2;
    const key = i1 < i2 ? `${i1}_${i2}` : `${i2}_${i1}`;
    const c = edgeMapRef.current.get(key);
    return c ? c.broken : true;
  }, []);

  function updateAnchoring(t: number) {
    const points = pointsRef.current;
    const constraints = constraintsRef.current;
    const adjacency = adjacencyRef.current;

    if (!livePinTopRow.current) {
      for (const p of points) p.anchored = true;
      return;
    }

    const visited = new Uint8Array(points.length);
    const queue: number[] = [];
    for (let i = 0; i < points.length; i++) {
      if (points[i].pinned) {
        visited[i] = 1;
        queue.push(i);
      }
    }
    let qi = 0;
    while (qi < queue.length) {
      const cur = queue[qi++];
      for (const ci of adjacency[cur]) {
        const c = constraints[ci];
        if (c.broken) continue;
        const other = c.a === cur ? c.b : c.a;
        if (!visited[other]) {
          visited[other] = 1;
          queue.push(other);
        }
      }
    }

    for (let i = 0; i < points.length; i++) {
      const wasAnchored = points[i].anchored;
      const anchored = visited[i] === 1;
      points[i].anchored = anchored;
      if (wasAnchored && !anchored && points[i].orphanSince === null) {
        points[i].orphanSince = t;
      }
      if (anchored) {
        points[i].orphanSince = null;
      }
    }
  }

  function simulate(dt: number) {
    {
      const points = pointsRef.current;
      const constraints = constraintsRef.current;
      const { w, h } = sizeRef.current;
      const friction = 0.985;
      const g = liveGravity.current;
      const sway = liveAmbientSway.current;
      const m = mouseRef.current;
      timeRef.current += dt;
      const t = timeRef.current;

      updateAnchoring(t);

      for (const p of points) {
        if (p.pinned) continue;
        const [vx, vy] = clampMagnitude((p.x - p.ox) * friction, (p.y - p.oy) * friction, MAX_POINT_STEP);
        p.ox = p.x;
        p.oy = p.y;
        const gravBoost = p.anchored ? 1 : GRAVITY_BOOST;
        p.x += vx;
        p.y += vy + g * gravBoost * dt * dt;
        if (sway > 0) {
          p.x += Math.sin(t * 0.6 + p.oy * 0.018 + p.ox * 0.01) * sway * dt;
          p.y += Math.cos(t * 0.45 + p.ox * 0.015) * sway * dt * 0.5;
        }
      }

      if (m.down) {
        const radius = liveBrushRadius.current;
        const radiusSq = radius * radius;
        // A fast real-world swipe can jump the pointer many pixels between
        // two rAF frames; clamp the drag force itself so it can't fling
        // points further than the mesh can keep up with.
        const [dragX, dragY] = clampMagnitude((m.x - m.px) * 1.3, (m.y - m.py) * 1.3, MAX_POINT_STEP);
        for (const p of points) {
          if (p.pinned) continue;
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          if (dx * dx + dy * dy < radiusSq) {
            p.x += dragX;
            p.y += dragY;
          }
        }

        const dragDirX = m.x - m.px;
        const dragDirY = m.y - m.py;
        for (const c of constraints) {
          if (c.broken) continue;
          const pa = points[c.a];
          const pb = points[c.b];
          const mx = (pa.x + pb.x) / 2;
          const my = (pa.y + pb.y) / 2;
          const dSq = distToSegmentSq(mx, my, m.px, m.py, m.x, m.y);
          if (dSq < radiusSq) {
            c.broken = true;
            if (liveShowParticles.current) {
              spawnTearParticles(particlesRef.current, mx, my, dragDirX, dragDirY, c.a * 31 + c.b * 17 + t * 1000);
              if (hash2(c.a, c.b + t) < 0.4) {
                spawnTearFlash(flashesRef.current, mx, my, 10 + hash2(c.a + 5, c.b) * 8);
              }
            }
          }
        }
      }

      if (autoTearActiveRef.current) {
        const duration = Math.max(0.2, liveAutoTearDuration.current);
        autoTearProgressRef.current += dt / duration;
        const progress = Math.min(1, autoTearProgressRef.current);
        const frontX = progress * w;
        for (const c of constraints) {
          if (c.broken) continue;
          const pa = points[c.a];
          const pb = points[c.b];
          const mx = (pa.x + pb.x) / 2;
          const my = (pa.y + pb.y) / 2;
          if (mx <= frontX) {
            c.broken = true;
            if (liveShowParticles.current && hash2(c.a, c.b + t) < 0.5) {
              spawnTearParticles(particlesRef.current, mx, my, 1, -0.3, c.a * 31 + c.b * 17 + t * 1000);
              if (hash2(c.a + 3, c.b) < 0.3) {
                spawnTearFlash(flashesRef.current, mx, my, 8 + hash2(c.a + 5, c.b) * 6);
              }
            }
          }
        }
        if (progress >= 1) {
          autoTearActiveRef.current = false;
          setAutoTearActive(false);
        }
      }

      if (cornerTearActiveRef.current) {
        cornerTearProgressRef.current += dt / 0.8;
        const progress = Math.min(1, cornerTearProgressRef.current);
        const target = cornerTearPoint(progress, w, h);
        const prev = cornerTearPrevRef.current;
        const radius = Math.max(18, liveBrushRadius.current * 0.6);
        const radiusSq = radius * radius;
        for (const c of constraints) {
          if (c.broken) continue;
          const pa = points[c.a];
          const pb = points[c.b];
          const mx = (pa.x + pb.x) / 2;
          const my = (pa.y + pb.y) / 2;
          if (distToSegmentSq(mx, my, prev.x, prev.y, target.x, target.y) < radiusSq) {
            c.broken = true;
            if (liveShowParticles.current) {
              spawnTearParticles(particlesRef.current, mx, my, target.x - prev.x, target.y - prev.y, c.a * 31 + c.b * 17 + t * 1000);
              if (hash2(c.a, c.b + t) < 0.4) {
                spawnTearFlash(flashesRef.current, mx, my, 8 + hash2(c.a + 5, c.b) * 6);
              }
            }
          }
        }
        cornerTearPrevRef.current = target;
        if (progress >= 1) cornerTearActiveRef.current = false;
      }

      const threshold = liveTearThreshold.current;
      for (let iter = 0; iter < 6; iter++) {
        for (const c of constraints) {
          if (c.broken) continue;
          const pa = points[c.a];
          const pb = points[c.b];
          const dx = pb.x - pa.x;
          const dy = pb.y - pa.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const diff = (dist - c.length) / dist;

          if (dist > c.length * threshold) {
            c.broken = true;
            const mx = (pa.x + pb.x) / 2;
            const my = (pa.y + pb.y) / 2;
            if (liveShowParticles.current) {
              spawnTearParticles(particlesRef.current, mx, my, dx, dy, c.a * 31 + c.b * 17 + t * 1000);
              if (hash2(c.a, c.b + t) < 0.4) {
                spawnTearFlash(flashesRef.current, mx, my, 10 + hash2(c.a + 5, c.b) * 8);
              }
            }
            continue;
          }

          const offX = dx * 0.5 * diff;
          const offY = dy * 0.5 * diff;
          if (!pa.pinned) {
            pa.x += offX;
            pa.y += offY;
          }
          if (!pb.pinned) {
            pb.x -= offX;
            pb.y -= offY;
          }
        }
      }

      for (const p of points) {
        if (p.x < -60) p.x = -60;
        if (p.x > w + 60) p.x = w + 60;
        if (p.y < -60) p.y = -60;
        if (p.y > h + 300) p.y = h + 300;
      }

      const particles = particlesRef.current;
      let writeIdx = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) continue;
        p.vy += PARTICLE_GRAVITY * dt;
        p.vx *= 0.97;
        p.vy *= 0.99;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.spin * dt;
        particles[writeIdx++] = p;
      }
      particles.length = writeIdx;

      const flashes = flashesRef.current;
      let fWrite = 0;
      for (let i = 0; i < flashes.length; i++) {
        const f = flashes[i];
        f.life += dt;
        if (f.life >= f.maxLife) continue;
        flashes[fWrite++] = f;
      }
      flashes.length = fWrite;
    }
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    const cols = colsRef.current;
    const rows_ = rowsRef.current;
    const cellCols = cols - 1;
    const cellRows = rows_ - 1;
    const points = pointsRef.current;
    const t = timeRef.current;

    ctx.clearRect(0, 0, w, h);

    const cellVisible: boolean[] = new Array(cellCols * cellRows).fill(false);
    const idx = (x: number, y: number) => y * cols + x;

    let totalCount = 0;
    let brokenCount = 0;
    for (let y = 0; y < cellRows; y++) {
      for (let x = 0; x < cellCols; x++) {
        totalCount++;
        const edgesOk =
          !isEdgeBroken(x, y, x + 1, y) &&
          !isEdgeBroken(x, y, x, y + 1) &&
          !isEdgeBroken(x + 1, y, x + 1, y + 1) &&
          !isEdgeBroken(x, y + 1, x + 1, y + 1);
        const p00 = points[idx(x, y)];
        const p10 = points[idx(x + 1, y)];
        const p01 = points[idx(x, y + 1)];
        const p11 = points[idx(x + 1, y + 1)];
        const alphaOk =
          pointFadeAlpha(p00, t) > 0.02 &&
          pointFadeAlpha(p10, t) > 0.02 &&
          pointFadeAlpha(p01, t) > 0.02 &&
          pointFadeAlpha(p11, t) > 0.02;
        const visible = edgesOk && alphaOk;
        cellVisible[y * cellCols + x] = visible;
        if (!visible) brokenCount++;
      }
    }

    const [r1, g1, b1] = parseColorToRgb(liveClothColorStart.current);
    const [r2, g2, b2] = parseColorToRgb(liveClothColorEnd.current);
    const opacity = liveClothOpacity.current;

    if (liveShowShadow.current) {
      ctx.save();
      ctx.fillStyle = "rgba(10,10,12,0.3)";
      for (let y = 0; y < cellRows; y++) {
        for (let x = 0; x < cellCols; x++) {
          if (!cellVisible[y * cellCols + x]) continue;
          const isEdgeCell =
            x === 0 ||
            y === 0 ||
            x === cellCols - 1 ||
            y === cellRows - 1 ||
            !cellVisible[(y - 1) * cellCols + x] ||
            !cellVisible[(y + 1) * cellCols + x] ||
            !cellVisible[y * cellCols + (x - 1)] ||
            !cellVisible[y * cellCols + (x + 1)];
          if (!isEdgeCell) continue;
          const p00 = points[idx(x, y)];
          const p10 = points[idx(x + 1, y)];
          const p01 = points[idx(x, y + 1)];
          const p11 = points[idx(x + 1, y + 1)];
          ctx.beginPath();
          ctx.moveTo(p00.x + 5, p00.y + 9);
          ctx.lineTo(p10.x + 5, p10.y + 9);
          ctx.lineTo(p11.x + 5, p11.y + 9);
          ctx.lineTo(p01.x + 5, p01.y + 9);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // A single continuous gradient (sampled at absolute canvas coordinates)
    // is used for every quad, in both surface styles. This avoids per-cell
    // quantized flat colors, which is what produced a visible "checkerboard"
    // mosaic across the mesh.
    const clothGradient = ctx.createLinearGradient(0, 0, w, h);
    clothGradient.addColorStop(0, `rgb(${r1},${g1},${b1})`);
    clothGradient.addColorStop(1, `rgb(${r2},${g2},${b2})`);

    const smooth = liveSurfaceStyle.current === "smooth";
    // All full-opacity quads are accumulated into one Path2D and filled with
    // a single ctx.fill() call. Filling per-quad (each one slightly
    // overdrawn via `expand` to hide subpixel seams) was compounding alpha
    // at every shared edge, which is what read as a grid.
    const clothPath = new Path2D();
    const foldQuads: { x0: number; y0: number; x1: number; y1: number; x2: number; y2: number; x3: number; y3: number; alpha: number }[] = [];

    for (let y = 0; y < cellRows; y++) {
      for (let x = 0; x < cellCols; x++) {
        if (!cellVisible[y * cellCols + x]) continue;
        const p00 = points[idx(x, y)];
        const p10 = points[idx(x + 1, y)];
        const p01 = points[idx(x, y + 1)];
        const p11 = points[idx(x + 1, y + 1)];

        const a00 = pointFadeAlpha(p00, t);
        const a10 = pointFadeAlpha(p10, t);
        const a01 = pointFadeAlpha(p01, t);
        const a11 = pointFadeAlpha(p11, t);
        const cellAlpha = Math.min(a00, a10, a01, a11);

        const cx = (p00.x + p10.x + p01.x + p11.x) / 4;
        const cy = (p00.y + p10.y + p01.y + p11.y) / 4;
        // Wider overdraw than a per-cell fill can safely use: while
        // swinging/falling, points separate faster than a tight margin can
        // cover, opening gaps that show the backdrop through as flicker.
        // Safe to push higher now that quads are batched into one fill
        // instead of each blending alpha individually.
        const expand = 1.06;
        const ex00x = cx + (p00.x - cx) * expand;
        const ex00y = cy + (p00.y - cy) * expand;
        const ex10x = cx + (p10.x - cx) * expand;
        const ex10y = cy + (p10.y - cy) * expand;
        const ex11x = cx + (p11.x - cx) * expand;
        const ex11y = cy + (p11.y - cy) * expand;
        const ex01x = cx + (p01.x - cx) * expand;
        const ex01y = cy + (p01.y - cy) * expand;

        // Two triangles instead of one 4-point polygon: under heavy
        // deformation (fast swings, sharp folds) a quad's corners can cross
        // over each other into a self-intersecting "bowtie" shape, and
        // canvas's nonzero fill rule punches a hole exactly at that
        // crossing point — the backdrop shows through as a small
        // square/triangle flicker. Three points can never self-intersect,
        // so triangles can't produce that hole no matter how the mesh
        // contorts.
        if (cellAlpha > 0.98) {
          clothPath.moveTo(ex00x, ex00y);
          clothPath.lineTo(ex10x, ex10y);
          clothPath.lineTo(ex01x, ex01y);
          clothPath.closePath();
          clothPath.moveTo(ex10x, ex10y);
          clothPath.lineTo(ex11x, ex11y);
          clothPath.lineTo(ex01x, ex01y);
          clothPath.closePath();
        } else {
          ctx.fillStyle = clothGradient;
          ctx.globalAlpha = opacity * cellAlpha;
          ctx.beginPath();
          ctx.moveTo(ex00x, ex00y);
          ctx.lineTo(ex10x, ex10y);
          ctx.lineTo(ex01x, ex01y);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(ex10x, ex10y);
          ctx.lineTo(ex11x, ex11y);
          ctx.lineTo(ex01x, ex01y);
          ctx.closePath();
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        if (!smooth) {
          const topKey = idx(x, y) < idx(x + 1, y) ? `${idx(x, y)}_${idx(x + 1, y)}` : `${idx(x + 1, y)}_${idx(x, y)}`;
          const leftKey = idx(x, y) < idx(x, y + 1) ? `${idx(x, y)}_${idx(x, y + 1)}` : `${idx(x, y + 1)}_${idx(x, y)}`;
          const topC = edgeMapRef.current.get(topKey);
          const leftC = edgeMapRef.current.get(leftKey);

          let foldShade = 1;
          if (topC && leftC) {
            const curTop = Math.hypot(p10.x - p00.x, p10.y - p00.y);
            const curLeft = Math.hypot(p01.x - p00.x, p01.y - p00.y);
            const stretchTop = curTop / topC.length;
            const stretchLeft = curLeft / leftC.length;
            foldShade = (stretchTop + stretchLeft) / 2;
          }
          const brightness = Math.max(0.62, Math.min(1.35, foldShade));
          const foldDepth = Math.max(0, 0.86 - brightness);
          if (foldDepth > 0.015) {
            foldQuads.push({
              x0: ex00x,
              y0: ex00y,
              x1: ex10x,
              y1: ex10y,
              x2: ex11x,
              y2: ex11y,
              x3: ex01x,
              y3: ex01y,
              alpha: Math.min(0.5, foldDepth * 0.9) * cellAlpha,
            });
          }
        }
      }
    }

    ctx.fillStyle = clothGradient;
    ctx.globalAlpha = opacity;
    ctx.fill(clothPath);
    ctx.globalAlpha = 1;

    // Fold shading is a soft multiply tint over just the creased quads
    // instead of a per-cell stroke, so it reads as fabric draping naturally
    // rather than an outlined mesh.
    if (foldQuads.length) {
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      for (const q of foldQuads) {
        ctx.fillStyle = `rgba(0,0,0,${q.alpha})`;
        ctx.beginPath();
        ctx.moveTo(q.x0, q.y0);
        ctx.lineTo(q.x1, q.y1);
        ctx.lineTo(q.x3, q.y3);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(q.x1, q.y1);
        ctx.lineTo(q.x2, q.y2);
        ctx.lineTo(q.x3, q.y3);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    const edgeStyle = liveTearEdgeStyle.current;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,1)";
    for (let y = 0; y < cellRows; y++) {
      for (let x = 0; x < cellCols; x++) {
        if (!cellVisible[y * cellCols + x]) continue;
        const p00 = points[idx(x, y)];
        const p10 = points[idx(x + 1, y)];
        const p01 = points[idx(x, y + 1)];
        const p11 = points[idx(x + 1, y + 1)];
        const cx = (p00.x + p10.x + p01.x + p11.x) / 4;
        const cy = (p00.y + p10.y + p01.y + p11.y) / 4;

        const leftVisible = x > 0 && cellVisible[y * cellCols + (x - 1)];
        const rightVisible = x < cellCols - 1 && cellVisible[y * cellCols + (x + 1)];
        const topVisible = y > 0 && cellVisible[(y - 1) * cellCols + x];
        const bottomVisible = y < cellRows - 1 && cellVisible[(y + 1) * cellCols + x];

        if (!topVisible) frayEdge(ctx, p00.x, p00.y, p10.x, p10.y, x * 13 + y * 7, cx - (p00.x + p10.x) / 2, cy - (p00.y + p10.y) / 2, edgeStyle);
        if (!bottomVisible) frayEdge(ctx, p01.x, p01.y, p11.x, p11.y, x * 17 + y * 11 + 3, cx - (p01.x + p11.x) / 2, cy - (p01.y + p11.y) / 2, edgeStyle);
        if (!leftVisible) frayEdge(ctx, p00.x, p00.y, p01.x, p01.y, x * 5 + y * 19 + 7, cx - (p00.x + p01.x) / 2, cy - (p00.y + p01.y) / 2, edgeStyle);
        if (!rightVisible) frayEdge(ctx, p10.x, p10.y, p11.x, p11.y, x * 23 + y * 3 + 11, cx - (p10.x + p11.x) / 2, cy - (p10.y + p11.y) / 2, edgeStyle);
      }
    }
    ctx.restore();

    const text = liveSurfaceText.current;
    if (text) {
      ctx.save();
      ctx.beginPath();
      for (let y = 0; y < cellRows; y++) {
        for (let x = 0; x < cellCols; x++) {
          if (!cellVisible[y * cellCols + x]) continue;
          const p00 = points[idx(x, y)];
          const p10 = points[idx(x + 1, y)];
          const p01 = points[idx(x, y + 1)];
          const p11 = points[idx(x + 1, y + 1)];
          ctx.moveTo(p00.x, p00.y);
          ctx.lineTo(p10.x, p10.y);
          ctx.lineTo(p11.x, p11.y);
          ctx.lineTo(p01.x, p01.y);
          ctx.closePath();
        }
      }
      ctx.clip();

      const size = liveSurfaceTextSize.current;
      const weight = liveSurfaceTextWeight.current;
      const font = liveSurfaceTextFont.current;
      const align = liveSurfaceTextAlign.current;
      ctx.font = `${weight} ${size}px ${font}`;
      ctx.fillStyle = liveSurfaceTextColor.current;
      ctx.globalAlpha = liveSurfaceTextOpacity.current;
      ctx.textBaseline = "middle";
      ctx.textAlign = align;

      const lines = text.split("\n");
      const lineHeight = size * 1.2;
      const totalHeight = lineHeight * lines.length;
      const startY = h / 2 - totalHeight / 2 + lineHeight / 2;
      const textX = align === "left" ? w * 0.08 : align === "right" ? w * 0.92 : w / 2;
      lines.forEach((line, i) => {
        ctx.fillText(line, textX, startY + i * lineHeight);
      });
      ctx.restore();
    }

    const logoImg = logoImageRef.current;
    if (logoImg) {
      ctx.save();
      ctx.beginPath();
      for (let y = 0; y < cellRows; y++) {
        for (let x = 0; x < cellCols; x++) {
          if (!cellVisible[y * cellCols + x]) continue;
          const p00 = points[idx(x, y)];
          const p10 = points[idx(x + 1, y)];
          const p01 = points[idx(x, y + 1)];
          const p11 = points[idx(x + 1, y + 1)];
          ctx.moveTo(p00.x, p00.y);
          ctx.lineTo(p10.x, p10.y);
          ctx.lineTo(p11.x, p11.y);
          ctx.lineTo(p01.x, p01.y);
          ctx.closePath();
        }
      }
      ctx.clip();

      const logoW = liveSurfaceLogoWidth.current;
      const aspect = logoImg.naturalHeight / (logoImg.naturalWidth || 1);
      const drawW = (logoW / 100) * w;
      const drawH = drawW * aspect;
      const posX = (w - drawW) * (liveSurfaceLogoPositionX.current / 100) + liveSurfaceLogoOffsetX.current;
      const posY = (h - drawH) * (liveSurfaceLogoPositionY.current / 100) + liveSurfaceLogoOffsetY.current;
      ctx.globalAlpha = liveSurfaceLogoOpacity.current;
      ctx.drawImage(logoImg, posX, posY, drawW, drawH);
      ctx.restore();
    }

    if (liveShowParticles.current) {
      for (const p of particlesRef.current) {
        const lifeFrac = p.life / p.maxLife;
        const fade = Math.max(0, 1 - lifeFrac * lifeFrac);
        if (fade <= 0.02) continue;
        const v = Math.min(1, Math.max(0, p.y / h));
        const rr = Math.round(r1 + (r2 - r1) * v);
        const gg = Math.round(g1 + (g2 - g1) * v);
        const bb = Math.round(b1 + (b2 - b1) * v);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${fade * 0.9})`;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    }

    for (const f of flashesRef.current) {
      const lifeFrac = f.life / f.maxLife;
      const fade = Math.max(0, 1 - lifeFrac) * 0.85;
      if (fade <= 0.02) continue;
      const radius = f.radius * (0.4 + lifeFrac * 0.9);
      ctx.beginPath();
      ctx.arc(f.x, f.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${fade})`;
      ctx.fill();
    }

    const fraction = totalCount > 0 ? brokenCount / totalCount : 0;
    setTornFraction(fraction);
    if (fraction > 0.92 && !firedFullTearRef.current) {
      firedFullTearRef.current = true;
      setIsComplete(true);
      liveOnFullyTorn.current?.();
    }
  }

  function loop() {
    simulate(1 / 60);
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }

  const resizeCanvas = React.useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    sizeRef.current = { w: rect.width, h: rect.height };
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  const resetCloth = React.useCallback(() => {
    resizeCanvas();
    colsRef.current = Math.max(4, Math.round(columns));
    rowsRef.current = Math.max(4, Math.round(rows));
    buildCloth();
    particlesRef.current = [];
    flashesRef.current = [];
    setIsComplete(false);
    autoTearActiveRef.current = false;
    autoTearProgressRef.current = 0;
    setAutoTearActive(false);
    cornerTearActiveRef.current = false;
    cornerTearProgressRef.current = 0;
  }, [buildCloth, columns, resizeCanvas, rows]);

  const startAutoTear = React.useCallback(() => {
    autoTearProgressRef.current = 0;
    autoTearActiveRef.current = true;
    setAutoTearActive(true);
  }, []);

  React.useEffect(() => {
    colsRef.current = Math.max(4, Math.round(columns));
    rowsRef.current = Math.max(4, Math.round(rows));
    resizeCanvas();

    const initTimer = setTimeout(() => {
      buildCloth();
      rafRef.current = requestAnimationFrame(loop);
    }, 0);

    const container = containerRef.current;
    let observer: ResizeObserver | null = null;
    if (container && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        resizeCanvas();
        buildCloth();
      });
      observer.observe(container);
    }

    return () => {
      clearTimeout(initTimer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, rows, pinTopRow]);

  React.useEffect(() => {
    if (!autoStartTear) return;
    const timer = setTimeout(() => {
      cornerTearProgressRef.current = 0;
      cornerTearPrevRef.current = cornerTearPoint(0, sizeRef.current.w, sizeRef.current.h);
      cornerTearActiveRef.current = true;
    }, autoStartDelay * 1000);
    return () => clearTimeout(timer);
  }, [autoStartTear, autoStartDelay]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    mouseRef.current = { x: pos.x, y: pos.y, px: pos.x, py: pos.y, down: true };
    setIsPressed(true);
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    const m = mouseRef.current;
    m.px = m.x;
    m.py = m.y;
    m.x = pos.x;
    m.y = pos.y;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    mouseRef.current.down = false;
    setIsPressed(false);
    (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden", className)}
      style={{ backgroundColor, pointerEvents: isComplete ? "none" : undefined }}
    >
      {backgroundSrc && (
        <img
          src={backgroundSrc}
          alt={backgroundAlt}
          draggable={false}
          className="absolute inset-0 h-full w-full"
          style={{
            objectFit: backgroundFit,
            objectPosition: `${backgroundPositionX}% ${backgroundPositionY}%`,
            userSelect: "none",
          }}
        />
      )}

      {!isComplete && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          style={{ cursor: isPressed ? SCISSORS_CLOSED_CURSOR : SCISSORS_OPEN_CURSOR }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      )}

      {showHint && tornFraction < 0.04 && !isComplete && (
        <div
          className="pointer-events-none absolute bottom-4 left-4 rounded-[8px] px-3 py-1.5 text-[13px]"
          style={{ fontFamily: "Helvetica Neue, sans-serif", color: "#0d0d0d", background: "#f4f3f1" }}
        >
          {hintText}
        </div>
      )}

      {showAutoTearButton && !autoTearActive && !isComplete && (
        <button
          type="button"
          onClick={startAutoTear}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-[22px] py-2.5 text-sm font-semibold"
          style={{ fontFamily: "Helvetica Neue, sans-serif", color: "#f4f3f1", background: "#0d0d0d" }}
        >
          {autoTearButtonLabel}
        </button>
      )}

      {showResetButton && !isComplete && (
        <button
          type="button"
          onClick={resetCloth}
          className="absolute bottom-4 right-4 rounded-[8px] px-3.5 py-1.5 text-[13px]"
          style={{ fontFamily: "Helvetica Neue, sans-serif", color: "#f4f3f1", background: "#0d0d0d" }}
        >
          {resetLabel}
        </button>
      )}
    </div>
  );
}

export default TearableReveal;
