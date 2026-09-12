"use client";

import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LaptopMockupMediaItem {
  type: "video" | "image";
  src: string;
}

export type LaptopMockupFrameColor = "silver" | "space-black";
export type LaptopMockupTransition = "slide" | "fade";

export interface LaptopMockupProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  media?: LaptopMockupMediaItem[];
  imageDuration?: number;
  autoplay?: boolean;
  loop?: boolean;
  laptopWidth?: number;
  frameColor?: LaptopMockupFrameColor;
  frameShadow?: boolean;
  tilt?: boolean;
  tiltStrength?: number;
  ambientGlow?: boolean;
  glowColor?: string;
  glowIntensity?: number;
  progressBar?: boolean;
  videoTransition?: LaptopMockupTransition;
  background?: string;
}

const LID_W = 1440;
const LID_H = 900;
const FOOT_H = 42;
const TOTAL_H = LID_H + FOOT_H;

const DEFAULT_MEDIA: LaptopMockupMediaItem[] = [
  { type: "image", src: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1400&q=80" },
  { type: "image", src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400&q=80" },
  { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
];

function MacBookFrame({
  width,
  frameColor,
  showShadow,
  glareX,
  glareY,
  children,
}: {
  width: number;
  frameColor: LaptopMockupFrameColor;
  showShadow: boolean;
  glareX: MotionValue<number>;
  glareY: MotionValue<number>;
  children: React.ReactNode;
}) {
  const s = width / LID_W;
  const lidH = LID_H * s;
  const ftH = FOOT_H * s;
  const totH = lidH + ftH;

  const silver = frameColor !== "space-black";

  const rimW = 4 * s;
  const bezT = 32 * s;
  const bezS = 18 * s;
  const bezB = 10 * s;
  const notchW = 112 * s;
  const notchH = 22 * s;
  const camD = 8 * s;
  const Ro = 18 * s;
  const Ri = 14 * s;
  const Rs = 5 * s;

  const rimGrad = silver ? "linear-gradient(158deg, #e2e2e2 0%, #c8c8c8 50%, #b4b4b4 100%)" : "linear-gradient(158deg, #3c3c3c 0%, #282828 50%, #1c1c1c 100%)";

  const shadowStr = !showShadow
    ? "none"
    : silver
      ? ["0 0 0 1px rgba(0,0,0,0.13)", "0 30px 80px rgba(0,0,0,0.20)", "0 6px 16px rgba(0,0,0,0.12)", "inset 0 1px 0 rgba(255,255,255,0.90)"].join(", ")
      : ["0 0 0 1px rgba(255,255,255,0.07)", "0 30px 80px rgba(0,0,0,0.70)", "0 6px 16px rgba(0,0,0,0.45)", "inset 0 1px 0 rgba(255,255,255,0.05)"].join(", ");

  const panelBg = "#080808";
  const glareBg = useTransform([glareX, glareY], ([x, y]: number[]) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(255,255,255,0.09) 0%, transparent 60%)`);

  return (
    <div className="relative shrink-0" style={{ width, height: totH }}>
      <div className="absolute top-0 left-0 z-[2]" style={{ width, height: lidH, background: rimGrad, borderRadius: `${Ro}px ${Ro}px 0 0`, boxShadow: shadowStr }}>
        <div className="absolute bottom-0 overflow-hidden" style={{ top: rimW, left: rimW, right: rimW, background: panelBg, borderRadius: `${Ri}px ${Ri}px 0 0` }}>
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{ top: (bezT - camD) / 2, width: camD, height: camD, background: "#1a1a1a", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.95), 0 0 0 1.5px rgba(255,255,255,0.07)", zIndex: 11 }}
          />

          <div className="absolute overflow-hidden" style={{ top: bezT, left: bezS, right: bezS, bottom: bezB, background: "#000", borderRadius: Rs }}>
            <div className="absolute inset-0">{children}</div>

            <motion.div className="pointer-events-none absolute inset-0 z-[9]" style={{ borderRadius: Rs, background: glareBg }} />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10" style={{ width: notchW, height: notchH, background: panelBg, borderRadius: `0 0 ${8 * s}px ${8 * s}px` }} />
          </div>
        </div>
      </div>

      <div
        className="absolute left-0 z-[1] overflow-hidden"
        style={{
          top: lidH,
          width,
          height: ftH,
          background: silver ? "linear-gradient(180deg, #d2d2d2 0%, #c4c4c4 50%, #b8b8b8 100%)" : "linear-gradient(180deg, #2c2c2c 0%, #202020 50%, #181818 100%)",
          borderRadius: `0 0 ${10 * s}px ${10 * s}px`,
          boxShadow: showShadow ? `0 10px 36px rgba(0,0,0,${silver ? 0.18 : 0.58}), inset 0 1px 0 rgba(255,255,255,${silver ? 0.3 : 0.06})` : "none",
        }}
      >
        <div className="absolute top-0 right-0 left-0" style={{ height: 1.5 * s, background: silver ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.55)" }} />

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: 108 * s, height: Math.max(4, 16 * s), background: silver ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.35)", boxShadow: `inset 0 1px 3px rgba(0,0,0,${silver ? 0.1 : 0.3})` }}
        />

        <div className="absolute bottom-0" style={{ left: 18 * s, width: 22 * s, height: 7 * s, borderRadius: `0 0 ${4 * s}px ${4 * s}px`, background: silver ? "rgba(0,0,0,0.26)" : "rgba(0,0,0,0.60)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.25)" }} />
        <div className="absolute bottom-0" style={{ right: 18 * s, width: 22 * s, height: 7 * s, borderRadius: `0 0 ${4 * s}px ${4 * s}px`, background: silver ? "rgba(0,0,0,0.26)" : "rgba(0,0,0,0.60)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.25)" }} />
      </div>
    </div>
  );
}

function getVariants(effect: LaptopMockupTransition, direction: number) {
  if (effect === "fade") {
    return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.4, ease: "easeInOut" as const } };
  }
  return {
    initial: { x: direction > 0 ? "100%" : "-100%", opacity: 0.6 },
    animate: { x: 0, opacity: 1 },
    exit: { x: direction > 0 ? "-100%" : "100%", opacity: 0.6 },
    transition: { duration: 0.32, ease: [0.32, 0, 0.67, 0] as const },
  };
}

function MediaPlayer({
  mediaItems,
  autoplay,
  loop,
  progressBar,
  videoTransition,
  imageDuration,
}: {
  mediaItems: LaptopMockupMediaItem[];
  autoplay: boolean;
  loop: boolean;
  progressBar: boolean;
  videoTransition: LaptopMockupTransition;
  imageDuration: number;
}) {
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(autoplay);
  const [direction, setDirection] = React.useState(1);
  const [progress, setProgress] = React.useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const startX = React.useRef<number | null>(null);
  const rafRef = React.useRef(0);

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
    setProgress(0);
  }, [index]);

  React.useEffect(() => {
    if (!current || isImage || !videoRef.current) return;
    if (playing) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  }, [playing, current, isImage]);

  React.useEffect(() => {
    if (!current || !isImage) return;
    cancelAnimationFrame(rafRef.current);
    const duration = imageDuration * 1000;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else goTo(index + 1);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isImage]);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const delta = startX.current - e.changedTouches[0].clientX;
    if (delta > 50) goTo(index + 1);
    else if (delta < -50) goTo(index - 1);
    startX.current = null;
  };
  const onMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (startX.current === null) return;
    const delta = startX.current - e.clientX;
    if (Math.abs(delta) < 8) {
      const rect = e.currentTarget.getBoundingClientRect();
      const isRight = e.clientX - rect.left > rect.width / 2;
      if (mediaItems.length > 1) {
        if (isRight) goTo(index + 1);
        else goTo(index - 1);
      } else {
        setPlaying((p) => !p);
      }
    } else if (delta > 50) goTo(index + 1);
    else if (delta < -50) goTo(index - 1);
    startX.current = null;
  };

  if (!current || !current.src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#111]">
        <div className="text-[28px]">💻</div>
        <span className="text-xs text-white/40">Add media</span>
      </div>
    );
  }

  const v = getVariants(videoTransition, direction);

  return (
    <div className="h-full w-full cursor-pointer overflow-hidden bg-black" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={index} initial={v.initial} animate={v.animate} exit={v.exit} transition={v.transition} className="absolute inset-0">
          {isImage ? (
            <img src={current.src} alt="" className="h-full w-full object-cover" />
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
                const el = e.currentTarget;
                if (el.duration) setProgress(el.currentTime / el.duration);
              }}
              onEnded={() => {
                if (!loop) goTo(index + 1);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {progressBar && (
        <div className="pointer-events-none absolute right-[6%] bottom-7 left-[6%] z-[8] h-0.5 rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white transition-[width] duration-[250ms] ease-linear" style={{ width: `${progress * 100}%` }} />
        </div>
      )}

      {!playing && (
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50">
            <div className="ml-[3px]" style={{ width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "16px solid white" }} />
          </div>
        </motion.div>
      )}

      {mediaItems.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 z-[6] flex -translate-x-1/2 flex-row gap-1.5">
          {mediaItems.map((_, i) => (
            <div key={i} className="h-1 rounded-[3px] transition-all duration-[250ms] ease-[ease]" style={{ width: i === index ? 20 : 4, background: i === index ? "#fff" : "rgba(255,255,255,0.4)" }} />
          ))}
        </div>
      )}
    </div>
  );
}

export function LaptopMockup({
  media = DEFAULT_MEDIA,
  imageDuration = 3,
  autoplay = true,
  loop = true,
  laptopWidth = 720,
  frameColor = "silver",
  frameShadow = true,
  tilt = false,
  tiltStrength = 12,
  ambientGlow = false,
  glowColor = "#6060FF",
  glowIntensity = 40,
  progressBar = true,
  videoTransition = "slide",
  background = "transparent",
  className,
  style,
  ...props
}: LaptopMockupProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mediaItems = media.filter((m) => m.src);
  const [containerW, setContainerW] = React.useState(0);
  const [containerH, setContainerH] = React.useState(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width);
      setContainerH(entry.contentRect.height);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const totalAspect = LID_W / TOTAL_H;
  const maxByW = containerW > 0 ? Math.max(100, containerW - 32) : laptopWidth;
  const maxByH = containerH > 0 ? Math.max(100, (containerH - 32) * totalAspect) : laptopWidth;
  const autoMax = Math.floor(Math.min(maxByW, maxByH));
  const effectiveWidth = containerW > 0 ? Math.min(laptopWidth, autoMax) : laptopWidth;

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
    <div className={cn("box-border flex h-full w-full flex-col items-center", className)} style={{ background, ...style }} {...props}>
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {ambientGlow && (
          <div
            className="pointer-events-none absolute z-0 rounded-full"
            style={{ width: effectiveWidth * 1.2, height: effectiveWidth * 0.5, background: glowColor, filter: `blur(${effectiveWidth * 0.25}px)`, opacity: glowIntensity / 100 }}
          />
        )}

        <motion.div className="z-[1]" style={{ rotateX: tilt ? springRotX : 0, rotateY: tilt ? springRotY : 0, transformStyle: "preserve-3d" }}>
          <MacBookFrame width={effectiveWidth} frameColor={frameColor} showShadow={frameShadow} glareX={glareX} glareY={glareY}>
            <MediaPlayer mediaItems={mediaItems} autoplay={autoplay} loop={loop} progressBar={progressBar} videoTransition={videoTransition} imageDuration={imageDuration} />
          </MacBookFrame>
        </motion.div>
      </div>

      <AnimatePresence>
              </AnimatePresence>
    </div>
  );
}
