"use client";

import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MediaItem {
  type: "video" | "image";
  src: string;
}

const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1526178613658-3f1622045557?auto=format&fit=crop&w=800&q=80",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=800&q=80",
  },
];

// ─── iPhone frame ─────────────────────────────────────────────────────────
interface IPhoneFrameProps {
  width: number;
  frameColor: "titanium" | "black";
  glareX: MotionValue<number>;
  glareY: MotionValue<number>;
  children: React.ReactNode;
}

const IPhoneFrame = React.memo(function IPhoneFrame({ width, frameColor, glareX, glareY, children }: IPhoneFrameProps) {
  const scale = width / 393;
  const h = 852;

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]: number[]) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`
  );

  const isBlack = frameColor === "black";
  const frameGrad = isBlack
    ? "linear-gradient(175deg, #2a2a2a 0%, #1a1a1a 40%, #0d0d0d 100%)"
    : "linear-gradient(175deg, #d0d0d0 0%, #b8b8b8 30%, #c8c8c8 60%, #a8a8a8 100%)";
  const btnGrad = isBlack ? "linear-gradient(90deg, #1a1a1a, #2e2e2e)" : "linear-gradient(90deg, #b0b0b0, #d0d0d0)";
  const btnR = isBlack ? "linear-gradient(270deg, #1a1a1a, #2e2e2e)" : "linear-gradient(270deg, #b0b0b0, #d0d0d0)";
  const outerShadow = isBlack
    ? [
        "0 0 0 1px rgba(255,255,255,0.08)",
        "0 28px 70px rgba(0,0,0,0.6)",
        "0 8px 24px rgba(0,0,0,0.4)",
        "inset 0 1px 0 rgba(255,255,255,0.06)",
      ].join(", ")
    : [
        "0 0 0 1px rgba(255,255,255,0.6)",
        "0 28px 70px rgba(0,0,0,0.35)",
        "0 8px 24px rgba(0,0,0,0.2)",
        "inset 0 1px 0 rgba(255,255,255,0.8)",
        "inset 0 -1px 0 rgba(0,0,0,0.1)",
      ].join(", ");

  return (
    <div style={{ width, height: h * scale, position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: frameGrad, borderRadius: 56 * scale, boxShadow: outerShadow }} />

      <div
        style={{
          position: "absolute",
          left: -4 * scale,
          top: 100 * scale,
          width: 5 * scale,
          height: 36 * scale,
          background: btnGrad,
          borderRadius: "4px 0 0 4px",
          boxShadow: "-2px 0 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -4 * scale,
          top: 158 * scale,
          width: 5 * scale,
          height: 72 * scale,
          background: btnGrad,
          borderRadius: "4px 0 0 4px",
          boxShadow: "-2px 0 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -4 * scale,
          top: 246 * scale,
          width: 5 * scale,
          height: 72 * scale,
          background: btnGrad,
          borderRadius: "4px 0 0 4px",
          boxShadow: "-2px 0 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -4 * scale,
          top: 180 * scale,
          width: 5 * scale,
          height: 90 * scale,
          background: btnR,
          borderRadius: "0 4px 4px 0",
          boxShadow: "2px 0 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      />

      <div style={{ position: "absolute", inset: 6 * scale, background: "#0a0a0a", borderRadius: 51 * scale }} />

      <div style={{ position: "absolute", inset: 10 * scale, background: "#000", borderRadius: 47 * scale, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>{children}</div>

        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 9,
            pointerEvents: "none",
            borderRadius: 47 * scale,
            background: glareBackground,
          }}
        />
      </div>
    </div>
  );
});

function getVariants(effect: "slide" | "fade", direction: number) {
  if (effect === "fade") {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.4, ease: "easeInOut" as const },
    };
  }
  return {
    initial: { y: direction > 0 ? "100%" : "-100%", opacity: 0.6 },
    animate: { y: 0, opacity: 1 },
    exit: { y: direction > 0 ? "-100%" : "100%", opacity: 0.6 },
    transition: { duration: 0.32, ease: [0.32, 0, 0.67, 0] as const },
  };
}

// ─── Video/image player ────────────────────────────────────────────────────
interface ReelPlayerProps {
  mediaItems: MediaItem[];
  autoplay: boolean;
  loop: boolean;
  progressBar: boolean;
  transition: "slide" | "fade";
  imageDuration: number;
}

const ReelPlayer = React.memo(function ReelPlayer({ mediaItems, autoplay, loop, progressBar, transition, imageDuration }: ReelPlayerProps) {
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(autoplay);
  const [direction, setDirection] = React.useState(1);
  const [progress, setProgress] = React.useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const startY = React.useRef<number | null>(null);
  const rafRef = React.useRef<number>(0);

  const current = mediaItems[index];
  const isImage = current?.type === "image";

  const goTo = React.useCallback(
    (next: number) => {
      const wrapped = (next + mediaItems.length) % mediaItems.length;
      setDirection(next > index ? 1 : -1);
      setIndex(wrapped);
      setPlaying(autoplay);
    },
    [index, mediaItems.length, autoplay]
  );

  React.useEffect(() => {
    setProgress(0);
  }, [index]);

  React.useEffect(() => {
    if (!current || isImage || !videoRef.current) return;
    if (playing) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  }, [playing, index, isImage, current]);

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
  }, [index, isImage, imageDuration, goTo, current]);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startY.current === null) return;
    const delta = startY.current - e.changedTouches[0].clientY;
    if (delta > 50) goTo(index + 1);
    else if (delta < -50) goTo(index - 1);
    startY.current = null;
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    startY.current = e.clientY;
  };
  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (startY.current === null) return;
    const delta = startY.current - e.clientY;
    if (Math.abs(delta) < 8) {
      const rect = e.currentTarget.getBoundingClientRect();
      const isRight = e.clientX - rect.left > rect.width / 2;
      if (mediaItems.length > 1) {
        isRight ? goTo(index + 1) : goTo(index - 1);
      } else {
        setPlaying((p) => !p);
      }
    } else if (delta > 50) goTo(index + 1);
    else if (delta < -50) goTo(index - 1);
    startY.current = null;
  };

  if (!current || !current.src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#111]">
        <div className="text-[28px]">🎬</div>
        <span className="text-xs text-white/40">Add media</span>
      </div>
    );
  }

  const v = getVariants(transition, direction);

  return (
    <div className="relative h-full w-full cursor-pointer overflow-hidden bg-black" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
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
                const vid = e.currentTarget;
                if (vid.duration) setProgress(vid.currentTime / vid.duration);
              }}
              onEnded={() => {
                if (!loop) goTo(index + 1);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {progressBar && (
        <div className="pointer-events-none absolute bottom-7 left-[8%] right-[8%] z-[8] h-0.5 rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white transition-[width] duration-[250ms] ease-linear" style={{ width: `${progress * 100}%` }} />
        </div>
      )}

      {!playing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50">
            <div
              className="ml-[3px]"
              style={{ width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "16px solid white" }}
            />
          </div>
        </motion.div>
      )}

      {mediaItems.length > 1 && (
        <div className="absolute right-2.5 top-1/2 z-[6] flex -translate-y-1/2 flex-col gap-1.5">
          {mediaItems.map((_, i) => (
            <div key={i} className={cn("w-1 rounded-[3px] transition-all duration-[250ms]", i === index ? "h-5 bg-white" : "h-1 bg-white/40")} />
          ))}
        </div>
      )}
    </div>
  );
});

export interface PhoneReelShowcaseProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  mediaItems?: MediaItem[];
  imageDuration?: number;
  autoplay?: boolean;
  loop?: boolean;
  phoneWidth?: number;
  frameColor?: "titanium" | "black";
  tilt?: boolean;
  tiltStrength?: number;
  ambientGlow?: boolean;
  glowColor?: string;
  glowIntensity?: number;
  progressBar?: boolean;
  transition?: "slide" | "fade";
}

/**
 * PhoneReelShowcase — an iPhone mockup that plays a swipeable, story-style
 * reel of videos and images, with 3D cursor tilt and an ambient glow behind
 * the device.
 */
export function PhoneReelShowcase({
  className,
  mediaItems = DEFAULT_MEDIA_ITEMS,
  imageDuration = 3,
  autoplay = true,
  loop = true,
  phoneWidth = 280,
  frameColor = "titanium",
  tilt = true,
  tiltStrength = 18,
  ambientGlow = true,
  glowColor = "#6060ff",
  glowIntensity = 50,
  progressBar = true,
  transition = "slide",
  ...props
}: PhoneReelShowcaseProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const safeMedia = mediaItems.filter((m) => m.src);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 160, damping: 22 });
  const springRotY = useSpring(rotY, { stiffness: 160, damping: 22 });

  const glareX = useTransform(springRotY, [-tiltStrength, tiltStrength], [20, 80]);
  const glareY = useTransform(springRotX, [-tiltStrength, tiltStrength], [80, 20]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    <div ref={containerRef} className={cn("flex h-full w-full flex-col items-center", className)} {...props}>
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative flex min-h-0 w-full flex-1 items-center justify-center"
        style={{ perspective: "900px" }}
      >
        {ambientGlow && (
          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: phoneWidth * 1.4,
              height: phoneWidth * 0.7,
              background: glowColor,
              filter: `blur(${phoneWidth * 0.28}px)`,
              opacity: glowIntensity / 100,
            }}
          />
        )}

        <motion.div
          style={{
            rotateX: tilt ? springRotX : 0,
            rotateY: tilt ? springRotY : 0,
            transformStyle: "preserve-3d",
          }}
          className="z-[1]"
        >
          <IPhoneFrame width={phoneWidth} frameColor={frameColor} glareX={glareX} glareY={glareY}>
            <ReelPlayer mediaItems={safeMedia} autoplay={autoplay} loop={loop} progressBar={progressBar} transition={transition} imageDuration={imageDuration} />
          </IPhoneFrame>
        </motion.div>
      </div>
    </div>
  );
}

export default PhoneReelShowcase;
