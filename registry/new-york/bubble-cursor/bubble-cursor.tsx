"use client";

// A liquid-glass bubble that follows the pointer, rendered with a
// raymarched metaball trail in WebGL2 (fresnel shading + iridescent glints).
//
// This tracks the pointer across the whole page (not just its own wrapper),
// which is the point of a custom cursor effect, so it intentionally listens
// on `window` and is fully cleaned up on unmount.

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MAX_TRAIL = 20;

const VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
void main () {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uResolution;
uniform float uTime;
uniform int uCount;
uniform vec2 uTrail[${MAX_TRAIL}];
uniform float uBaseRadius;
uniform float uBlend;
uniform float uShine;
uniform float uRim;
uniform float uIridescence;
uniform float uIntensity;
uniform vec3 uTint;
uniform float uTintStrength;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;

const float EPS = 1e-4;
const int ITR = 16;

float rnd3D (vec3 p) {
  return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
}

float noise3D (vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);

  float a000 = rnd3D(i);
  float a100 = rnd3D(i + vec3(1.0, 0.0, 0.0));
  float a010 = rnd3D(i + vec3(0.0, 1.0, 0.0));
  float a110 = rnd3D(i + vec3(1.0, 1.0, 0.0));
  float a001 = rnd3D(i + vec3(0.0, 0.0, 1.0));
  float a101 = rnd3D(i + vec3(1.0, 0.0, 1.0));
  float a011 = rnd3D(i + vec3(0.0, 1.0, 1.0));
  float a111 = rnd3D(i + vec3(1.0, 1.0, 1.0));

  vec3 u = f * f * (3.0 - 2.0 * f);

  float k0 = a000;
  float k1 = a100 - a000;
  float k2 = a010 - a000;
  float k3 = a001 - a000;
  float k4 = a000 - a100 - a010 + a110;
  float k5 = a000 - a010 - a001 + a011;
  float k6 = a000 - a100 - a001 + a101;
  float k7 = -a000 + a100 + a010 - a110 + a001 - a101 - a011 + a111;

  return k0 + k1 * u.x + k2 * u.y + k3 * u.z + k4 * u.x * u.y +
    k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z;
}

float smoothMin (float d1, float d2, float k) {
  float h = exp(-k * d1) + exp(-k * d2);
  return -log(max(h, 1e-12)) / k;
}

float map (vec3 p) {
  float radius = uBaseRadius * float(uCount);
  float d = 1e5;
  for (int i = 0; i < ${MAX_TRAIL}; i++) {
    if (i >= uCount) break;
    float sphere = length(p - vec3(uTrail[i], 0.0)) -
      (radius - uBaseRadius * float(i));
    d = smoothMin(d, sphere, uBlend);
  }
  return d;
}

vec3 generateNormal (vec3 p) {
  return normalize(vec3(
    map(p + vec3(EPS, 0.0, 0.0)) - map(p + vec3(-EPS, 0.0, 0.0)),
    map(p + vec3(0.0, EPS, 0.0)) - map(p + vec3(0.0, -EPS, 0.0)),
    map(p + vec3(0.0, 0.0, EPS)) - map(p + vec3(0.0, 0.0, -EPS))));
}

vec3 dropletColor (vec3 normal, vec3 rayDir) {
  vec3 reflectDir = reflect(rayDir, normal);
  float noisePosTime = noise3D(reflectDir * 2.0 + uTime);
  float noiseNegTime = noise3D(reflectDir * 2.0 - uTime);
  vec3 color0 = uColorA * noisePosTime;
  vec3 color1 = uColorB * noiseNegTime;
  return (color0 + color1) * uIntensity;
}

void main () {
  vec2 frag = gl_FragCoord.xy;
  float minRes = min(uResolution.x, uResolution.y);
  vec2 p = (frag * 2.0 - uResolution) / minRes;

  vec3 ray = vec3(p, 1.0);
  vec3 rayDir = vec3(0.0, 0.0, -1.0);
  float dist = 0.0;

  for (int i = 0; i < ITR; ++i) {
    dist = map(ray);
    ray += rayDir * dist;
    if (dist < EPS || dist > 8.0) break;
  }

  float cov = 1.0 - smoothstep(0.0, 3.0 / minRes, dist);
  if (!(cov > 0.001)) {
    outColor = vec4(0.0);
    return;
  }

  vec3 n = generateNormal(ray);
  vec3 glints = pow(max(dropletColor(n, rayDir), 0.0), vec3(7.0));
  vec3 L = normalize(vec3(-0.5, 0.7, 0.6));
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 60.0);

  float edge = pow(1.0 - clamp(n.z, 0.0, 1.0), 1.5);
  vec3 filmTint = mix(vec3(0.9), uTint, clamp(uTintStrength, 0.0, 1.0));
  float fade = cov * clamp(uOpacity, 0.0, 1.0);
  vec3 light = glints * uIridescence * 0.65 + vec3(spec * uShine * 1.5) +
    filmTint * (0.55 * max(uRim, 0.4) * edge + 0.03);
  float a = fade * clamp(0.08 + 0.4 * edge, 0.0, 1.0);
  outColor = vec4(light * fade, a);
}`;

function parseColor(color: string): [number, number, number] {
  if (!color) return [1, 1, 1];
  const rgbaMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbaMatch) {
    return [Number(rgbaMatch[1]) / 255, Number(rgbaMatch[2]) / 255, Number(rgbaMatch[3]) / 255];
  }
  let hex = color.trim().replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  if (hex.length >= 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return [r / 255, g / 255, b / 255];
    }
  }
  return [1, 1, 1];
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export interface BubbleCursorProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  size?: number;
  trailLength?: number;
  followSpeed?: number;
  blend?: number;
  speed?: number;
  shine?: number;
  rim?: number;
  iridescence?: number;
  intensity?: number;
  tint?: string;
  tintStrength?: number;
  colorA?: string;
  colorB?: string;
  opacity?: number;
  zIndex?: number;
  hideOnTouch?: boolean;
  showThemeToggle?: boolean;
}

const THEME_STORAGE_KEY = "bubble-cursor-theme";

const SunIcon = () => (
  <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="1.5" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22.5" />
      <line x1="1.5" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22.5" y2="12" />
      <line x1="4.5" y1="4.5" x2="6.2" y2="6.2" />
      <line x1="17.8" y1="17.8" x2="19.5" y2="19.5" />
      <line x1="4.5" y1="19.5" x2="6.2" y2="17.8" />
      <line x1="17.8" y1="6.2" x2="19.5" y2="4.5" />
    </g>
  </svg>
);

const MoonIcon = () => (
  <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M20.5 14.5A9 9 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" fill="currentColor" />
  </svg>
);

export function BubbleCursor({
  className,
  style,
  size = 30,
  trailLength = 16,
  followSpeed = 0.5,
  blend = 14,
  speed = 2,
  shine = 0.25,
  rim = 0.5,
  iridescence = 1,
  intensity = 0.9,
  tint = "rgba(255, 250, 240, 1)",
  tintStrength = 0,
  colorA = "rgba(214, 165, 74, 1)",
  colorB = "rgba(140, 90, 40, 1)",
  opacity = 1,
  zIndex = 9999,
  hideOnTouch = true,
  showThemeToggle = true,
  ...props
}: BubbleCursorProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [supportsHover, setSupportsHover] = React.useState(true);
  const [isDark, setIsDark] = React.useState(false);
  const [themeChosen, setThemeChosen] = React.useState(false);
  const scopeId = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  const optionsRef = React.useRef({
    size,
    trailLength,
    followSpeed,
    blend,
    speed,
    shine,
    rim,
    iridescence,
    intensity,
    tint,
    tintStrength,
    colorA,
    colorB,
    opacity,
  });
  optionsRef.current = {
    size,
    trailLength,
    followSpeed,
    blend,
    speed,
    shine,
    rim,
    iridescence,
    intensity,
    tint,
    tintStrength,
    colorA,
    colorB,
    opacity,
  };
  const startRef = React.useRef<() => void>(() => {});

  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setSupportsHover(mq.matches);
    const onChange = () => setSupportsHover(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    if (!showThemeToggle) return;
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      setIsDark(stored === "dark");
      setThemeChosen(true);
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, [showThemeToggle]);

  React.useEffect(() => {
    startRef.current();
  }, [colorA, colorB, tint]);

  function toggleTheme() {
    setThemeChosen(true);
    setIsDark((prev) => {
      const next = !prev;
      window.localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
      return next;
    });
  }

  React.useEffect(() => {
    if (hideOnTouch && !supportsHover) return;

    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true,
    });
    if (!gl || gl.isContextLost()) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const uniforms: Record<string, WebGLUniformLocation> = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(program, i);
      if (!info) continue;
      const location = gl.getUniformLocation(program, info.name);
      if (location) uniforms[info.name] = location;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // The canvas box is driven directly from window.innerWidth/innerHeight
    // (not "100%"/"100vw" styles) so it always matches the coordinate space
    // that pointer events (clientX/clientY) are reported in — mobile browsers
    // resolve vw/vh against a viewport that can drift from innerWidth/Height
    // while the address bar hides/shows.
    function syncSize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = window.innerWidth;
      const cssHeight = window.innerHeight;
      const width = Math.max(1, Math.round(cssWidth * dpr));
      const height = Math.max(1, Math.round(cssHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
    }
    syncSize();

    const trailX = new Float32Array(MAX_TRAIL);
    const trailY = new Float32Array(MAX_TRAIL);
    const trailData = new Float32Array(MAX_TRAIL * 2);
    let headX = window.innerWidth / 2;
    let headY = window.innerHeight / 2;
    let targetX = headX;
    let targetY = headY;
    trailX.fill(headX);
    trailY.fill(headY);
    let presence = 0;
    let presenceTarget = 0;
    let hasPointer = false;
    let time = 0;

    // This canvas is a fixed, full-viewport overlay, so Page Visibility (not
    // an IntersectionObserver on the tiny wrapper anchor) is the correct
    // signal for pausing the render loop.
    let isVisible = document.visibilityState === "visible";
    function onVisibilityChange() {
      isVisible = document.visibilityState === "visible";
      if (isVisible) start();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    function onMotionChange() {
      reducedMotion = motionQuery.matches;
      start();
    }
    motionQuery.addEventListener("change", onMotionChange);

    function activeCount(): number {
      const t = optionsRef.current.trailLength;
      return Math.min(Math.max(Math.round(t), 2), MAX_TRAIL);
    }

    function render() {
      if (!gl || !canvas) return;
      const opts = optionsRef.current;
      const dpr = canvas.width / Math.max(window.innerWidth, 1);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.disable(gl.SCISSOR_TEST);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (presence <= 0.004) return;

      const count = activeCount();
      const minRes = Math.min(canvas.width, canvas.height);
      const headRadius = Math.max(opts.size, 4) * dpr * presence;
      const baseRadius = (headRadius * 2) / (minRes * count);
      const blendAmount = Math.max(opts.blend, 0.5);

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (let i = 0; i < count; i++) {
        const dx = trailX[i] * dpr;
        const dy = canvas.height - trailY[i] * dpr;
        trailData[i * 2] = (dx * 2 - canvas.width) / minRes;
        trailData[i * 2 + 1] = (dy * 2 - canvas.height) / minRes;
        minX = Math.min(minX, dx);
        maxX = Math.max(maxX, dx);
        minY = Math.min(minY, dy);
        maxY = Math.max(maxY, dy);
      }

      const pad = headRadius + ((Math.log(count + 1) / blendAmount) * minRes) / 2 + 32 * dpr;
      const sx = Math.max(0, Math.floor(minX - pad));
      const sy = Math.max(0, Math.floor(minY - pad));
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(sx, sy, Math.min(canvas.width - sx, Math.ceil(maxX - minX + pad * 2)), Math.min(canvas.height - sy, Math.ceil(maxY - minY + pad * 2)));

      const colorA01 = parseColor(opts.colorA);
      const colorB01 = parseColor(opts.colorB);
      const tint01 = parseColor(opts.tint);

      gl.useProgram(program);
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.uTime, time);
      gl.uniform1i(uniforms.uCount, count);
      gl.uniform2fv(uniforms["uTrail[0]"], trailData);
      gl.uniform1f(uniforms.uBaseRadius, baseRadius);
      gl.uniform1f(uniforms.uBlend, blendAmount);
      gl.uniform1f(uniforms.uShine, Math.max(opts.shine, 0));
      gl.uniform1f(uniforms.uRim, Math.min(Math.max(opts.rim, 0), 2));
      gl.uniform1f(uniforms.uIridescence, Math.max(opts.iridescence, 0));
      gl.uniform1f(uniforms.uIntensity, Math.max(opts.intensity, 0));
      gl.uniform3f(uniforms.uTint, tint01[0], tint01[1], tint01[2]);
      gl.uniform1f(uniforms.uTintStrength, Math.min(Math.max(opts.tintStrength, 0), 1));
      gl.uniform3f(uniforms.uColorA, colorA01[0], colorA01[1], colorA01[2]);
      gl.uniform3f(uniforms.uColorB, colorB01[0], colorB01[1], colorB01[2]);
      gl.uniform1f(uniforms.uOpacity, Math.min(Math.max(opts.opacity, 0), 1));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.disable(gl.SCISSOR_TEST);
    }

    let raf = 0;
    let lastTime = performance.now();
    let destroyed = false;
    let running = false;

    function frame(now: number) {
      if (destroyed) return;
      if (!isVisible) {
        running = false;
        return;
      }
      const opts = optionsRef.current;
      const delta = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      if (!reducedMotion) time += delta * Math.max(opts.speed, 0);

      const follow = Math.min(Math.max(opts.followSpeed, 0.02), 1);
      const kHead = reducedMotion || follow >= 1 ? 1 : 1 - Math.exp(-delta * (3 + follow * 30));
      const kScale = reducedMotion ? 1 : 1 - Math.exp(-delta * 10);

      headX += (targetX - headX) * kHead;
      headY += (targetY - headY) * kHead;
      for (let i = MAX_TRAIL - 1; i > 0; i--) {
        trailX[i] = trailX[i - 1];
        trailY[i] = trailY[i - 1];
      }
      trailX[0] = headX;
      trailY[0] = headY;

      let moved = Math.abs(targetX - headX) + Math.abs(targetY - headY);
      for (let i = 1; i < MAX_TRAIL; i++) {
        moved = Math.max(moved, Math.abs(trailX[i] - trailX[i - 1]) + Math.abs(trailY[i] - trailY[i - 1]));
      }
      presence += (presenceTarget - presence) * kScale;

      render();

      const settled = reducedMotion ? moved < 0.1 && Math.abs(presenceTarget - presence) < 0.002 : presence < 0.004 && presenceTarget === 0;
      if (settled) {
        presence = presenceTarget;
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (destroyed || running || !isVisible) return;
      running = true;
      lastTime = performance.now();
      raf = requestAnimationFrame(frame);
    }
    startRef.current = start;

    function onPointerMove(event: PointerEvent) {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!hasPointer) {
        headX = targetX;
        headY = targetY;
        trailX.fill(targetX);
        trailY.fill(targetY);
        hasPointer = true;
      }
      presenceTarget = 1;
      start();
    }
    function onPointerLeave() {
      presenceTarget = 0;
      hasPointer = false;
      start();
    }
    function onResize() {
      syncSize();
      start();
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(quad);
    };
  }, [hideOnTouch, supportsHover]);

  return (
    <div ref={wrapperRef} className={cn("relative h-full min-h-[4px] w-full min-w-[4px]", className)} style={style} {...props}>
      {showThemeToggle && themeChosen ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0"
          style={{ zIndex, background: isDark ? "rgba(6, 7, 10, 0.42)" : "rgba(255, 255, 255, 0.9)" }}
        />
      ) : null}
      {!hideOnTouch || supportsHover ? (
        <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 h-full w-full" style={{ zIndex }} />
      ) : null}
      {showThemeToggle ? (
        <>
          <style>{`
            .bc-theme-btn-${scopeId} { transition: filter 0.15s ease, transform 0.15s ease; }
            .bc-theme-btn-${scopeId}:hover { filter: brightness(1.15); }
            .bc-theme-btn-${scopeId}:active { transform: scale(0.94); }
          `}</style>
          <button
            type="button"
            className={cn("bc-theme-btn-" + scopeId, "fixed left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border p-0 shadow-[0_2px_12px_rgba(0,0,0,0.15)] backdrop-blur-[10px]")}
            onClick={toggleTheme}
            aria-pressed={isDark}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            style={{
              zIndex: zIndex + 1,
              borderColor: "rgba(255, 255, 255, 0.25)",
              background: isDark ? "rgba(20, 20, 24, 0.6)" : "rgba(255, 255, 255, 0.6)",
              color: isDark ? "#f5f5f5" : "#1a1a1a",
            }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </>
      ) : null}
    </div>
  );
}
