"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface AIAgentWaveAvatar {
  image?: string;
  name?: string;
  position?: number;
  offsetY?: number;
  size?: number;
  float?: number;
}

export interface AIAgentWaveProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  color?: string;
  glowColor?: string;
  background?: string;
  level?: number;
  speed?: number;
  size?: number;
  amplitude?: number;
  strands?: number;
  lineWidth?: number;
  glowStrength?: number;
  cornerRadius?: number;
  edgeFade?: number;
  showAvatar?: boolean;
  avatars?: AIAgentWaveAvatar[];
  avatarRing?: boolean;
  showTitle?: boolean;
  title?: string;
  titleSize?: number;
  titleColor?: string;
  titleGlow?: number;
  cursorReactive?: boolean;
  cursorStrength?: number;
  enableStates?: boolean;
  idleLevel?: number;
  listeningLevel?: number;
  speakingLevel?: number;
}

const DEFAULT_AVATARS: AIAgentWaveAvatar[] = [{ position: 50, offsetY: 0, size: 64, float: 8 }];

// Parses hex/rgb()/hsl() without touching the DOM — Framer's Color control
// can hand back any of those, and a DOM-based resolver (e.g. creating an
// element and reading getComputedStyle) would return a different result
// during SSR (no `document`) than during hydration, causing a mismatch.
const rgbCache = new Map<string, [number, number, number]>();

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function resolveRgb(input: string): [number, number, number] {
  const cached = rgbCache.get(input);
  if (cached) return cached;
  let rgb: [number, number, number] = [0, 0, 0];
  const trimmed = input.trim();
  if (trimmed.startsWith("#")) {
    const c = trimmed.slice(1);
    const full = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
    rgb = [parseInt(full.slice(0, 2), 16) || 0, parseInt(full.slice(2, 4), 16) || 0, parseInt(full.slice(4, 6), 16) || 0];
  } else if (trimmed.startsWith("rgb")) {
    const nums = trimmed.match(/-?\d+(\.\d+)?/g);
    if (nums) rgb = [Number(nums[0]), Number(nums[1]), Number(nums[2])];
  } else if (trimmed.startsWith("hsl")) {
    const nums = trimmed.match(/-?\d+(\.\d+)?/g);
    if (nums) rgb = hslToRgb(Number(nums[0]), Number(nums[1]), Number(nums[2]));
  }
  rgbCache.set(input, rgb);
  return rgb;
}

function colorToRgba(input: string, alpha: number): string {
  const [r, g, b] = resolveRgb(input);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function AIAgentWave({
  color = "#3b6cff",
  glowColor = "#7aa2ff",
  background = "#f5f7fb",
  level = 0.55,
  speed = 1,
  size = 1,
  amplitude = 1,
  strands = 3,
  lineWidth = 2.5,
  glowStrength = 1,
  cornerRadius = 24,
  edgeFade = 30,
  showAvatar = false,
  avatars = DEFAULT_AVATARS,
  avatarRing = true,
  showTitle = false,
  title = "AI Agent",
  titleSize = 22,
  titleColor = "#1a1a2e",
  titleGlow = 1,
  cursorReactive = false,
  cursorStrength = 1.2,
  enableStates = false,
  idleLevel = 0.25,
  listeningLevel = 0.6,
  speakingLevel = 0.95,
  className,
  ...props
}: AIAgentWaveProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const mouseRef = React.useRef({ x: 0.5, active: false });
  const [emerged, setEmerged] = React.useState(false);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [agentState, setAgentState] = React.useState(0);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setEmerged(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const effectiveLevel = enableStates ? [idleLevel, listeningLevel, speakingLevel][agentState] : level;

  const stateRef = React.useRef({ level: effectiveLevel, speed, size, amplitude, strands, lineWidth, glowStrength, color, glowColor, cursorReactive, cursorStrength });

  React.useEffect(() => {
    stateRef.current = { level: effectiveLevel, speed, size, amplitude, strands, lineWidth, glowStrength, color, glowColor, cursorReactive, cursorStrength };
  });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const t0 = performance.now();
    let curLevel = stateRef.current.level;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cy = h / 2;
      const s = stateRef.current;
      const t = ((performance.now() - t0) / 1000) * s.speed;

      const idlePulse = 0.5 + 0.5 * Math.sin(t * 0.9);
      const target = Math.min(1, Math.max(0, s.level)) * (0.65 + 0.35 * idlePulse);
      curLevel += (target - curLevel) * 0.08;

      ctx.clearRect(0, 0, w, h);

      const maxAmp = h * 0.34 * s.amplitude * s.size * (0.18 + curLevel);
      const strandCount = Math.max(1, Math.round(s.strands));

      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < strandCount; i++) {
        const phase = (i / strandCount) * Math.PI * 0.9;
        const freq = 1.4 + i * 0.55;
        const ampMul = 1 - i * (0.55 / strandCount);
        const amp = maxAmp * ampMul;

        const mouse = mouseRef.current;
        const cursorActive = s.cursorReactive && mouse.active;

        ctx.beginPath();
        const steps = Math.max(40, Math.floor(w / 4));
        for (let p = 0; p <= steps; p++) {
          const x = (p / steps) * w;
          const nx = p / steps;
          const envelope = Math.sin(Math.PI * nx) ** 0.6;
          const dx = nx - mouse.x;
          const boost = cursorActive ? Math.exp(-(dx * dx) / 0.02) * s.cursorStrength : 0;
          const y = cy + Math.sin(nx * Math.PI * freq * 2 + t * 2.2 + phase) * amp * envelope * (1 + boost);
          if (p === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, colorToRgba(s.color, 0));
        grad.addColorStop(0.5, colorToRgba(s.glowColor, 0.95 - i * 0.18));
        grad.addColorStop(1, colorToRgba(s.color, 0));

        ctx.lineWidth = s.lineWidth * s.size * ampMul;
        ctx.lineCap = "round";
        ctx.shadowColor = colorToRgba(s.glowColor, 0.9);
        ctx.shadowBlur = 18 * s.glowStrength * (0.6 + curLevel);
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={cn("flex w-full h-full flex-col overflow-hidden", className)} style={{ background, borderRadius: cornerRadius }} {...props}>
      {showTitle && (
        <div
          className="shrink-0 text-center"
          style={{
            padding: "18px 16px 0",
            fontSize: titleSize,
            fontWeight: 600,
            letterSpacing: "0.01em",
            color: titleColor,
            textShadow: `0 0 ${8 * titleGlow}px ${colorToRgba(glowColor, 0.85)}, 0 0 ${22 * titleGlow}px ${colorToRgba(glowColor, 0.45)}`,
          }}
        >
          {title}
        </div>
      )}

      <div
        onMouseMove={(e) => {
          if (!cursorReactive) return;
          const rect = e.currentTarget.getBoundingClientRect();
          mouseRef.current = { x: (e.clientX - rect.left) / rect.width, active: true };
        }}
        onMouseLeave={() => {
          mouseRef.current.active = false;
        }}
        onClick={() => {
          if (enableStates) setAgentState((p) => (p + 1) % 3);
        }}
        className="relative flex flex-1 w-full items-center"
        style={{ cursor: enableStates ? "pointer" : "default" }}
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          style={{
            maskImage: `linear-gradient(to right, transparent 0%, black ${edgeFade}%, black ${100 - edgeFade}%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to right, transparent 0%, black ${edgeFade}%, black ${100 - edgeFade}%, transparent 100%)`,
          }}
        />

        {showAvatar && (
          <>
            <style>{`
              @keyframes ai-agent-avatar-float {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(var(--bob, -8px)) scale(1.045); }
              }
              @keyframes ai-agent-avatar-ripple {
                0% { transform: scale(0.85); opacity: 0.55; }
                100% { transform: scale(1.7); opacity: 0; }
              }
            `}</style>
            {avatars.map((avatar, i) => {
              const isHovered = hovered === i;
              const avatarSize = avatar.size ?? 64;
              const avatarPosition = avatar.position ?? 50;
              const avatarOffsetY = avatar.offsetY ?? 0;
              const avatarFloat = avatar.float ?? 8;
              return (
                <div
                  key={i}
                  className="absolute top-1/2"
                  style={{
                    left: `${avatarPosition}%`,
                    width: avatarSize,
                    height: avatarSize,
                    transform: `translate(-50%, calc(-50% + ${avatarOffsetY}px)) scale(${emerged ? 1 : 0})`,
                    opacity: emerged ? 1 : 0,
                    transition: `transform 0.65s ${i * 0.08}s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ${i * 0.08}s ease`,
                  }}
                >
                  <div
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="h-full w-full cursor-pointer"
                    style={{ transform: isHovered ? "scale(1.22) translateY(-4px)" : "scale(1)", transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)" }}
                  >
                    <div
                      className="relative h-full w-full rounded-full"
                      style={
                        {
                          "--bob": `${-avatarFloat}px`,
                          animation: `ai-agent-avatar-float ${(2.4 / speed).toFixed(2)}s ease-in-out infinite`,
                          animationDelay: `${i * 0.15}s`,
                        } as React.CSSProperties
                      }
                    >
                      {isHovered && <div className="absolute -inset-2.5 rounded-full" style={{ border: `1px solid ${glowColor}`, animation: "ai-agent-avatar-ripple 0.9s ease-out infinite" }} />}
                      {avatarRing && (
                        <div
                          className="absolute -inset-2.5 rounded-full transition-[opacity,box-shadow] duration-300"
                          style={{ border: `1px solid ${glowColor}`, opacity: isHovered ? 0.7 : 0.35, boxShadow: `0 0 ${(isHovered ? 40 : 24) * glowStrength}px ${glowColor}` }}
                        />
                      )}
                      <div
                        className="absolute inset-0 rounded-full bg-cover bg-center transition-shadow duration-300"
                        style={{
                          backgroundColor: background,
                          backgroundImage: avatar.image ? `url(${avatar.image})` : `radial-gradient(circle at 35% 30%, ${glowColor}, ${color})`,
                          boxShadow: `0 0 ${(isHovered ? 28 : 16) * glowStrength}px ${colorToRgba(glowColor, isHovered ? 0.8 : 0.55)}, 0 ${isHovered ? 6 : 2}px ${isHovered ? 18 : 10}px rgba(0,0,0,0.12)`,
                        }}
                      />
                    </div>
                  </div>
                  {avatar.name && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap"
                      style={{ marginTop: 8, fontSize: Math.max(11, avatarSize * 0.18), fontWeight: 600, color: titleColor, textShadow: `0 0 ${6 * glowStrength}px ${colorToRgba(glowColor, 0.5)}` }}
                    >
                      {avatar.name}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
