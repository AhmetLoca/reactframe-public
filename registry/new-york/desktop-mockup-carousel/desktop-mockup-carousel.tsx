"use client";

import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// useLayoutEffect logs a warning when it runs server-side (no DOM to act on
// before paint there); fall back to useEffect there and only take the
// synchronous-before-paint behavior in the browser.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export type DesktopMockupFrameColor = "Silver" | "Space Black";
export type DesktopMockupTransition = "Slide" | "Fade";
export type DesktopMockupMediaKey = "V1" | "V2" | "V3" | "I1" | "I2";

export interface DesktopMockupCarouselProps {
  video1?: string;
  video2?: string;
  video3?: string;
  image1?: string;
  image2?: string;
  mediaOrder?: DesktopMockupMediaKey[];
  imageDuration?: number;
  autoplay?: boolean;
  loop?: boolean;
  displayWidth?: number;
  frameColor?: DesktopMockupFrameColor;
  frameShadow?: boolean;
  tilt?: boolean;
  tiltStrength?: number;
  ambientGlow?: boolean;
  glowColor?: string;
  glowIntensity?: number;
  progressBar?: boolean;
  videoTransition?: DesktopMockupTransition;
  background?: string;
  className?: string;
}

interface MediaItem {
  type: "video" | "image";
  src: string;
  alt?: string;
}

const DISPLAY_W = 1600;
const DISPLAY_H = 900;
const STAND_NECK_H = 200;
const STAND_BASE_H = 32;

function getVariants(effect: DesktopMockupTransition, direction: number) {
  if (effect === "Fade")
    return {
      mode: "wait" as const,
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.4, ease: "easeInOut" as const },
    };
  return {
    mode: "sync" as const,
    initial: { x: direction > 0 ? "100%" : "-100%", opacity: 0.6 },
    animate: { x: 0, opacity: 1 },
    exit: { x: direction > 0 ? "-100%" : "100%", opacity: 0.6 },
    transition: { duration: 0.32, ease: [0.32, 0, 0.67, 0] as [number, number, number, number] },
  };
}

interface StudioDisplayFrameProps {
  width: number;
  frameColor: DesktopMockupFrameColor;
  showShadow: boolean;
  glareX: ReturnType<typeof useTransform<number, number>>;
  glareY: ReturnType<typeof useTransform<number, number>>;
  children: React.ReactNode;
}

function StudioDisplayFrame({ width, frameColor, showShadow, glareX, glareY, children }: StudioDisplayFrameProps) {
  const s = width / DISPLAY_W;
  const dH = DISPLAY_H * s;
  const nH = STAND_NECK_H * s;
  const bsH = STAND_BASE_H * s;
  const totH = dH + nH + bsH;

  const silver = frameColor !== "Space Black";

  const bOut = 18 * s;
  const bIn = 12 * s;
  const R = 18 * s;
  const Rs = 8 * s;
  const neckW = 88 * s;
  const baseW = 600 * s;
  const connD = 70 * s;

  const frameGrad = silver
    ? "linear-gradient(168deg, #ececec 0%, #d6d6d6 38%, #cacaca 70%, #b8b8b8 100%)"
    : "linear-gradient(168deg, #3e3e3e 0%, #2e2e2e 40%, #262626 100%)";

  const shadowStr = !showShadow
    ? "none"
    : silver
      ? "0 0 0 1px rgba(0,0,0,0.10), 0 40px 100px rgba(0,0,0,0.15), 0 10px 28px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.92), inset 0 -1px 0 rgba(0,0,0,0.04)"
      : "0 0 0 1px rgba(255,255,255,0.06), 0 40px 100px rgba(0,0,0,0.55), 0 10px 28px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.05)";

  const m = silver ? { l: "#c8c8c8", m: "#d6d6d6", d: "#b2b2b2" } : { l: "#2a2a2a", m: "#343434", d: "#1e1e1e" };

  return (
    <div style={{ width, height: totH, position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 0, left: 0, width, height: dH, zIndex: 2 }}>
        <div style={{ position: "absolute", inset: 0, background: frameGrad, borderRadius: R, boxShadow: shadowStr }} />

        <div style={{ position: "absolute", inset: bOut, background: "#0a0a0a", borderRadius: Rs + 2, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: bIn, background: "#000", borderRadius: Rs, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0 }}>{children}</div>
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 9,
                pointerEvents: "none",
                borderRadius: Rs,
                background: useTransform([glareX, glareY], ([x, y]: number[]) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(255,255,255,0.09) 0%, transparent 62%)`),
              }}
            />
          </div>

          <div style={{ position: "absolute", top: bIn / 2, left: "50%", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 3 * s, pointerEvents: "none" }}>
            <div style={{ width: 5 * s, height: 5 * s, borderRadius: "50%", background: "#1c1c1c", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)" }} />
            <div style={{ width: 2 * s, height: 2 * s, borderRadius: "50%", background: "#222" }} />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: dH,
          left: "50%",
          transform: "translateX(-50%)",
          width: neckW,
          height: nH,
          background: `linear-gradient(90deg, ${m.d} 0%, ${m.m} 50%, ${m.l} 100%)`,
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: dH - connD * 0.3,
          left: "50%",
          transform: "translateX(-50%)",
          width: connD,
          height: connD,
          borderRadius: "50%",
          background: silver ? "radial-gradient(circle at 38% 32%, #e8e8e8, #aaaaaa)" : "radial-gradient(circle at 38% 32%, #3c3c3c, #1e1e1e)",
          boxShadow: silver ? "inset 0 1px 4px rgba(255,255,255,0.6), 0 2px 10px rgba(0,0,0,0.18)" : "inset 0 1px 4px rgba(255,255,255,0.08), 0 2px 10px rgba(0,0,0,0.5)",
          zIndex: 3,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: baseW,
          height: bsH,
          background: `linear-gradient(180deg, ${m.m} 0%, ${m.d} 100%)`,
          borderRadius: `${2 * s}px ${2 * s}px ${8 * s}px ${8 * s}px`,
          boxShadow: showShadow ? `0 4px 20px rgba(0,0,0,${silver ? 0.13 : 0.4}), inset 0 1px 0 rgba(255,255,255,${silver ? 0.5 : 0.06})` : "none",
          zIndex: 1,
        }}
      />
    </div>
  );
}

interface VideoPlayerProps {
  mediaItems: MediaItem[];
  autoplay: boolean;
  loop: boolean;
  progressBar: boolean;
  videoTransition: DesktopMockupTransition;
  imageDuration: number;
  displayWidth: number;
}

function VideoPlayer({ mediaItems, autoplay, loop, progressBar, videoTransition, imageDuration }: VideoPlayerProps) {
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(autoplay);
  const [direction, setDirection] = React.useState(1);
  const [isVisible, setIsVisible] = React.useState(true);
  const progress = useMotionValue(0);
  const progressWidth = useTransform(progress, (v) => `${v * 100}%`);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const startX = React.useRef<number | null>(null);
  const startY = React.useRef<number | null>(null);
  const rafRef = React.useRef<number>(0);
  const elapsedRef = React.useRef(0);

  const current = mediaItems[index];
  const isImage = current?.type === "image";

  const goTo = React.useCallback(
    (next: number) => {
      const wrapped = (next + mediaItems.length) % mediaItems.length;
      setDirection(next > index ? 1 : -1);
      setIndex(wrapped);
      setPlaying(autoplay);
    },
    [index, mediaItems.length, autoplay],
  );

  React.useEffect(() => {
    const t = setTimeout(() => setPlaying(autoplay), 0);
    return () => clearTimeout(t);
  }, [autoplay]);

  React.useEffect(() => {
    progress.set(0);
    elapsedRef.current = 0;
  }, [index, progress]);

  React.useEffect(() => {
    if (!stageRef.current) return;
    const obs = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting));
    obs.observe(stageRef.current);
    return () => obs.disconnect();
  }, [mediaItems.length]);

  React.useEffect(() => {
    if (!current || isImage || !videoRef.current) return;
    if (playing && isVisible) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  }, [playing, index, isImage, isVisible, current]);

  React.useEffect(() => {
    if (!current || !isImage || !isVisible) return;
    cancelAnimationFrame(rafRef.current);
    const duration = imageDuration * 1000;
    const start = Date.now() - elapsedRef.current;
    const tick = () => {
      const elapsed = Date.now() - start;
      elapsedRef.current = elapsed;
      const p = Math.min(elapsed / duration, 1);
      progress.set(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else {
        elapsedRef.current = 0;
        goTo(index + 1);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [index, isImage, isVisible, goTo, progress, imageDuration, current]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null || startY.current === null) return;
    const dx = Math.abs(e.clientX - startX.current);
    const dy = Math.abs(e.clientY - startY.current);
    if (dx > 5 && dx > dy) {
      e.currentTarget.setPointerCapture(e.pointerId);
      startY.current = null;
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const delta = startX.current - e.clientX;
    if (Math.abs(delta) < 8) {
      const rect = e.currentTarget.getBoundingClientRect();
      const isRight = e.clientX - rect.left > rect.width / 2;
      if (mediaItems.length > 1) {
        if (isRight) goTo(index + 1);
        else goTo(index - 1);
      } else setPlaying((p) => !p);
    } else if (delta > 50) goTo(index + 1);
    else if (delta < -50) goTo(index - 1);
    startX.current = null;
    startY.current = null;
  };

  const onPointerCancel = () => {
    startX.current = null;
    startY.current = null;
  };

  if (!current || !current.src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#111]">
        <div className="text-[28px]">🖥️</div>
        <span className="text-xs text-white/40">Add media</span>
      </div>
    );
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (mediaItems.length > 1 && e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (mediaItems.length > 1 && e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    } else if (mediaItems.length <= 1 && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      setPlaying((p) => !p);
    }
  };

  const v = getVariants(videoTransition, direction);

  return (
    <div
      ref={stageRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={mediaItems.length > 1 ? `Media carousel, slide ${index + 1} of ${mediaItems.length}` : "Media player"}
      tabIndex={0}
      className="relative h-full w-full cursor-pointer overflow-hidden bg-black"
      style={{ touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
    >
      <AnimatePresence mode={v.mode} initial={false}>
        <motion.div key={index} initial={v.initial} animate={v.animate} exit={v.exit} transition={v.transition} className="absolute inset-0">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.src} alt={current.alt || ""} className="h-full w-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              src={current.src}
              className="h-full w-full object-cover"
              loop={loop}
              muted
              playsInline
              autoPlay={autoplay}
              onTimeUpdate={(e) => {
                const vid = e.currentTarget;
                if (vid.duration) progress.set(vid.currentTime / vid.duration);
              }}
              onEnded={() => {
                if (!loop) goTo(index + 1);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {progressBar && (
        <div className="pointer-events-none absolute right-[6%] left-[6%] z-[8] h-0.5 rounded-full bg-white/20" style={{ bottom: 28 }}>
          <motion.div className="h-full rounded-full bg-white" style={{ width: progressWidth }} />
        </div>
      )}

      {!playing && (
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50">
            <div style={{ width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "16px solid white", marginLeft: 3 }} />
          </div>
        </motion.div>
      )}

      {mediaItems.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 z-[6] flex -translate-x-1/2 flex-row gap-1.5">
          {mediaItems.map((_, i) => (
            <div
              key={i}
              className="rounded-[3px] transition-all"
              style={{
                height: 4,
                width: i === index ? 20 : 4,
                background: i === index ? "#fff" : "rgba(255,255,255,0.4)",
                // Source's "all 0.25s" has no explicit timing function
                // (CSS default "ease"), not Tailwind's transition-all
                // default of cubic-bezier(0.4,0,0.2,1).
                transitionDuration: "250ms",
                transitionTimingFunction: "ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DesktopMockupCarousel({
  video1 = "",
  video2 = "",
  video3 = "",
  image1 = "",
  image2 = "",
  mediaOrder = ["V1", "V2", "V3", "I1", "I2"],
  imageDuration = 3,
  autoplay = true,
  loop = true,
  displayWidth = 680,
  frameColor = "Silver",
  frameShadow = true,
  tilt = false,
  tiltStrength = 12,
  ambientGlow = false,
  glowColor = "#6060FF",
  glowIntensity = 40,
  progressBar = true,
  videoTransition = "Slide",
  background = "rgba(0,0,0,0)",
  className,
}: DesktopMockupCarouselProps) {
  const srcMap: Record<DesktopMockupMediaKey, MediaItem> = {
    V1: { type: "video", src: video1 },
    V2: { type: "video", src: video2 },
    V3: { type: "video", src: video3 },
    I1: { type: "image", src: image1 },
    I2: { type: "image", src: image2 },
  };
  const mediaItems = mediaOrder.map((k) => srcMap[k]).filter((m): m is MediaItem => Boolean(m && m.src));

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = React.useState(0);
  const [containerH, setContainerH] = React.useState(0);

  // useLayoutEffect (not useEffect) so the container's real size is known
  // before first paint — otherwise the display briefly renders at displayWidth
  // (680px default) and visibly snaps to the fitted size once the effect
  // fires.
  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setContainerW(rect.width);
    setContainerH(rect.height);
    const obs = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width);
      setContainerH(entry.contentRect.height);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const totalAspect = DISPLAY_W / (DISPLAY_H + STAND_NECK_H + STAND_BASE_H);
  const maxByW = containerW > 0 ? Math.max(100, containerW - 32) : displayWidth;
  const maxByH = containerH > 0 ? Math.max(100, (containerH - 32) * totalAspect) : displayWidth;
  const autoMax = Math.floor(Math.min(maxByW, maxByH));
  const effectiveDisplayWidth = containerW > 0 ? Math.min(displayWidth, autoMax) : displayWidth;

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 160, damping: 22 });
  const springRotY = useSpring(rotY, { stiffness: 160, damping: 22 });
  const glareX = useTransform(springRotY, [-tiltStrength, tiltStrength], [20, 80]);
  const glareY = useTransform(springRotX, [-tiltStrength, tiltStrength], [80, 20]);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!tilt || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    rotY.set(dx * tiltStrength);
    rotX.set(-dy * tiltStrength);
  };
  const onMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  return (
    <div ref={containerRef} className={cn("box-border flex h-full w-full flex-col items-center", className)} style={{ background }}>
      <div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="relative flex flex-1 items-center justify-center overflow-hidden" style={{ width: "100%", minHeight: 0, perspective: "1200px" }}>
        {ambientGlow && (
          <div
            className="pointer-events-none absolute z-0 rounded-full"
            style={{ width: effectiveDisplayWidth * 1.2, height: effectiveDisplayWidth * 0.5, background: glowColor, filter: `blur(${effectiveDisplayWidth * 0.25}px)`, opacity: glowIntensity / 100 }}
          />
        )}

        <motion.div style={{ rotateX: tilt ? springRotX : 0, rotateY: tilt ? springRotY : 0, transformStyle: "preserve-3d", zIndex: 1 }}>
          <StudioDisplayFrame width={effectiveDisplayWidth} frameColor={frameColor} showShadow={frameShadow} glareX={glareX} glareY={glareY}>
            <VideoPlayer mediaItems={mediaItems} autoplay={autoplay} loop={loop} progressBar={progressBar} videoTransition={videoTransition} imageDuration={imageDuration} displayWidth={effectiveDisplayWidth} />
          </StudioDisplayFrame>
        </motion.div>
      </div>

      <AnimatePresence>
              </AnimatePresence>
    </div>
  );
}
