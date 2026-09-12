"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type GlareCardReflexMode = "diamond" | "holographic" | "aurora";

export interface GlareCardProps extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
  title?: string;
  subtitle?: string;
  image?: string;
  tiltIntensity?: number;
  reflexMode?: GlareCardReflexMode;
  reflexIntensity?: number;
  spotRadius?: number;
  showText?: boolean;
  borderRadius?: number;
}

const SPRING = { stiffness: 180, damping: 24, mass: 0.6 };

export function GlareCard({
  title = "Glare Card",
  subtitle = "Dynamic tilt motion with animated conic gradient overlays and cinematic reflections.",
  image,
  tiltIntensity = 18,
  reflexMode = "diamond",
  reflexIntensity = 0.75,
  spotRadius = 140,
  showText = true,
  borderRadius = 20,
  className,
  ...props
}: GlareCardProps) {

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const rectRef = React.useRef<DOMRect | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, (v) => -v), SPRING);
  const rotateY = useSpring(rawX, SPRING);
  const scale = useSpring(1, SPRING);

  const conicBg = useMotionValue("none");
  const conicBg2 = useMotionValue("none");
  const starOp = useMotionValue(0);
  const starBg = useMotionValue("none");
  const spotBg = useMotionValue("none");
  const reflexOp = useMotionValue(0);
  const spotOp = useMotionValue(0);
  const glareOp = useMotionValue(0);
  const glareBg = useMotionValue("none");
  const shX = useMotionValue(0);
  const shY = useMotionValue(0);

  const boxShadow = useTransform(
    [shX, shY],
    ([sx, sy]) => `${sx}px ${Number(sy) + 30}px 60px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)`,
  );

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    rectRef.current = el.getBoundingClientRect();
    const observer = new ResizeObserver(() => {
      rectRef.current = el.getBoundingClientRect();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = rectRef.current;
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const nx = (x - cx) / cx;
      const ny = (y - cy) / cy;

      rawX.set(nx * tiltIntensity);
      rawY.set(ny * tiltIntensity * 0.78);

      const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 180;
      const dist = Math.sqrt(nx * nx + ny * ny);
      const intensity = Math.min(dist * 0.7, reflexIntensity);
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      const iv = intensity * reflexIntensity;

      if (reflexMode === "diamond") {
        conicBg.set(
          `conic-gradient(from ${angle - 1}deg at ${px}% ${py}%,rgba(255,255,255,0) 0deg,rgba(255,255,255,${iv * 1.0}) 0.6deg,rgba(255,255,255,${iv * 0.7}) 1.5deg,rgba(255,255,255,0) 4deg,rgba(255,255,255,${iv * 0.15}) 25deg,rgba(255,255,255,0) 48deg,rgba(255,255,255,${iv * 0.8}) 49deg,rgba(255,255,255,${iv * 0.55}) 50.5deg,rgba(255,255,255,0) 53deg,rgba(255,255,255,${iv * 0.1}) 85deg,rgba(255,255,255,0) 118deg,rgba(255,255,255,${iv * 0.65}) 119deg,rgba(255,255,255,${iv * 0.45}) 120.5deg,rgba(255,255,255,0) 123deg,rgba(255,255,255,${iv * 0.08}) 160deg,rgba(255,255,255,0) 178deg,rgba(255,255,255,${iv * 0.55}) 179deg,rgba(255,255,255,${iv * 0.38}) 180.5deg,rgba(255,255,255,0) 183deg,rgba(255,255,255,${iv * 0.07}) 220deg,rgba(255,255,255,0) 248deg,rgba(255,255,255,${iv * 0.45}) 249deg,rgba(255,255,255,${iv * 0.3}) 250.5deg,rgba(255,255,255,0) 253deg,rgba(255,255,255,${iv * 0.05}) 300deg,rgba(255,255,255,0) 358deg,rgba(255,255,255,0) 360deg)`,
        );
        conicBg2.set(
          `conic-gradient(from ${angle + 22}deg at ${px}% ${py}%,rgba(255,255,255,0) 0deg,rgba(255,255,255,${iv * 0.5}) 0.8deg,rgba(255,255,255,${iv * 0.35}) 2deg,rgba(255,255,255,0) 5deg,rgba(255,255,255,0) 68deg,rgba(255,255,255,${iv * 0.4}) 69deg,rgba(255,255,255,${iv * 0.28}) 70.5deg,rgba(255,255,255,0) 73deg,rgba(255,255,255,0) 158deg,rgba(255,255,255,${iv * 0.35}) 159deg,rgba(255,255,255,${iv * 0.22}) 160.5deg,rgba(255,255,255,0) 163deg,rgba(255,255,255,0) 248deg,rgba(255,255,255,${iv * 0.28}) 249deg,rgba(255,255,255,${iv * 0.18}) 250.5deg,rgba(255,255,255,0) 253deg,rgba(255,255,255,0) 360deg)`,
        );
        starOp.set(Math.min(intensity * 1.2, 1) * reflexIntensity);
        starBg.set(
          `conic-gradient(from 0deg at ${px}% ${py}%,rgba(255,255,255,0) 0deg,rgba(255,255,255,0.9) 0.4deg,rgba(255,255,255,0) 1.8deg,rgba(255,255,255,0) 44deg,rgba(255,255,255,0.75) 45deg,rgba(255,255,255,0) 46.5deg,rgba(255,255,255,0) 89deg,rgba(255,255,255,0.80) 90deg,rgba(255,255,255,0) 91.5deg,rgba(255,255,255,0) 134deg,rgba(255,255,255,0.65) 135deg,rgba(255,255,255,0) 136.5deg,rgba(255,255,255,0) 179deg,rgba(255,255,255,0.70) 180deg,rgba(255,255,255,0) 181.5deg,rgba(255,255,255,0) 224deg,rgba(255,255,255,0.60) 225deg,rgba(255,255,255,0) 226.5deg,rgba(255,255,255,0) 269deg,rgba(255,255,255,0.65) 270deg,rgba(255,255,255,0) 271.5deg,rgba(255,255,255,0) 314deg,rgba(255,255,255,0.55) 315deg,rgba(255,255,255,0) 316.5deg,rgba(255,255,255,0) 360deg)`,
        );
      } else if (reflexMode === "holographic") {
        const hue1 = (angle * 1.2) % 360;
        const hue2 = (hue1 + 60) % 360;
        const hue3 = (hue1 + 120) % 360;
        const hue4 = (hue1 + 200) % 360;
        const hue5 = (hue1 + 280) % 360;
        conicBg.set(
          `conic-gradient(from ${angle}deg at ${px}% ${py}%,hsla(${hue1},100%,70%,0) 0deg,hsla(${hue1},100%,70%,${iv * 0.55}) 15deg,hsla(${hue2},100%,65%,${iv * 0.45}) 40deg,hsla(${hue3},100%,70%,${iv * 0.5}) 80deg,hsla(${hue4},100%,65%,${iv * 0.4}) 130deg,hsla(${hue5},100%,70%,${iv * 0.45}) 190deg,hsla(${hue1},100%,65%,${iv * 0.35}) 250deg,hsla(${hue2},100%,70%,${iv * 0.3}) 310deg,hsla(${hue1},100%,70%,0) 360deg)`,
        );
        conicBg2.set(
          `conic-gradient(from ${angle + 40}deg at ${px}% ${py}%,transparent 0deg,rgba(255,255,255,${iv * 0.35}) 1deg,transparent 3deg,transparent 88deg,rgba(255,255,255,${iv * 0.25}) 90deg,transparent 92deg,transparent 178deg,rgba(255,255,255,${iv * 0.3}) 180deg,transparent 182deg,transparent 268deg,rgba(255,255,255,${iv * 0.2}) 270deg,transparent 272deg,transparent 360deg)`,
        );
        starOp.set(0);
      } else {
        const a1 = (angle * 0.8) % 360;
        conicBg.set(
          `conic-gradient(from ${a1}deg at ${px}% ${py}%,rgba(120,40,200,0) 0deg,rgba(120,40,200,${iv * 0.35}) 20deg,rgba(60,180,200,${iv * 0.4}) 60deg,rgba(40,220,140,${iv * 0.35}) 100deg,rgba(80,100,240,${iv * 0.3}) 150deg,rgba(180,60,220,${iv * 0.35}) 210deg,rgba(60,200,180,${iv * 0.3}) 270deg,rgba(40,180,100,${iv * 0.25}) 320deg,rgba(120,40,200,0) 360deg)`,
        );
        conicBg2.set(
          `conic-gradient(from ${(a1 + 30) % 360}deg at ${px}% ${py}%,rgba(255,255,255,0) 0deg,rgba(180,255,220,${iv * 0.2}) 25deg,rgba(140,180,255,${iv * 0.18}) 85deg,rgba(220,140,255,${iv * 0.2}) 155deg,rgba(140,255,200,${iv * 0.15}) 225deg,rgba(200,160,255,${iv * 0.18}) 295deg,rgba(255,255,255,0) 360deg)`,
        );
        starOp.set(0);
      }
      reflexOp.set(1);

      spotBg.set(
        `radial-gradient(circle ${spotRadius}px at ${px}% ${py}%,rgba(255,255,255,${0.55 * intensity + 0.1}) 0%,rgba(255,255,255,${0.35 * intensity}) 8%,rgba(255,255,255,${0.25 * intensity}) 30%,rgba(255,255,255,${0.08 * intensity}) 55%,transparent 75%)`,
      );
      spotOp.set(Math.min(intensity * 2.5, 1));

      const gi = intensity * reflexIntensity;
      glareBg.set(`linear-gradient(${angle + 90}deg, rgba(255,255,255,${gi * 0.45}) 0%, rgba(255,255,255,${gi * 0.2}) 35%, transparent 65%)`);
      glareOp.set(gi * 0.9);

      shX.set(nx * -20);
      shY.set(ny * -20);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tiltIntensity, reflexMode, reflexIntensity, spotRadius],
  );

  const onEnter = React.useCallback(() => scale.set(1.03), [scale]);
  const onLeave = React.useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    scale.set(1);
    reflexOp.set(0);
    spotOp.set(0);
    glareOp.set(0);
    starOp.set(0);
    conicBg.set("none");
    conicBg2.set("none");
    starBg.set("none");
    shX.set(0);
    shY.set(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bgImage = image ? `url(${image})` : "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%)";

  return (
    <div ref={wrapRef} className={cn("relative h-full w-full", className)} style={{ perspective: 1000, perspectiveOrigin: "50% 50%" }} {...props}>
      <motion.div
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="relative h-full w-full cursor-pointer"
        style={{
          borderRadius,
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
          scale,
          boxShadow,
          clipPath: `inset(0 round ${borderRadius}px)`,
          willChange: "transform",
        }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: bgImage, backgroundSize: "cover", backgroundPosition: "center" }} />
        <motion.div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: conicBg, opacity: reflexOp }} />
        <motion.div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: conicBg2, opacity: reflexOp }} />
        <motion.div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: starBg, opacity: starOp }} />
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: spotBg, opacity: spotOp }} />
        <motion.div className="pointer-events-none absolute inset-0 border border-white/15" style={{ background: glareBg, opacity: glareOp }} />
        {showText && (
          <div
            className="absolute inset-0 flex flex-col justify-end p-6"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)" }}
          >
            <h2 className="m-0 mb-1.5 text-[22px] font-medium leading-tight text-white">{title}</h2>
            <p className="m-0 text-[13px] leading-[1.5] text-white/55">{subtitle}</p>
          </div>
        )}
      </motion.div>

          </div>
  );
}
