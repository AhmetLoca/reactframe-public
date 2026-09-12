"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Phase = "idle" | "playing" | "success" | "fail";

interface Balloon {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  radius: number;
  popped: boolean;
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const COLORS = ["#ff6b9d", "#6b5bff", "#00d4ff", "#ff9f43", "#a55eea", "#26de81"];

export interface BalloonPopperGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  targetHits?: number;
  maxArrows?: number;
  balloonCount?: number;
  couponCode?: string;
  couponText?: string;
}

export function BalloonPopperGame({
  className,
  style,
  targetHits = 4,
  maxArrows = 5,
  balloonCount = 8,
  couponCode = "BALLOON20",
  couponText = "20% OFF Coupon",
  ...props
}: BalloonPopperGameProps) {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [hits, setHits] = React.useState(0);
  const [arrowsLeft, setArrowsLeft] = React.useState(maxArrows);
  const [balloons, setBalloons] = React.useState<Balloon[]>([]);
  const [projectiles, setProjectiles] = React.useState<Projectile[]>([]);
  const [aimAngle, setAimAngle] = React.useState(-Math.PI / 2);
  const [showCoupon, setShowCoupon] = React.useState(false);

  const areaRef = React.useRef<HTMLDivElement>(null);
  const animRef = React.useRef<number>(0);
  const lastTime = React.useRef(0);

  const startGame = () => {
    setHits(0);
    setArrowsLeft(maxArrows);
    setProjectiles([]);
    setShowCoupon(false);
    setPhase("playing");

    const newBalloons: Balloon[] = Array.from({ length: balloonCount }).map((_, i) => ({
      id: Date.now() + i,
      x: 10 + Math.random() * 80,
      y: -20 - Math.random() * 50,
      speed: 0.16 + Math.random() * 0.25,
      color: COLORS[i % COLORS.length],
      radius: 26 + Math.random() * 10,
      popped: false,
    }));
    setBalloons(newBalloons);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (phase !== "playing" || !areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height - 40;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const angle = Math.atan2(my - cy, mx - cx);
    setAimAngle(angle);
  };

  const handleClick = () => {
    if (phase !== "playing" || arrowsLeft <= 0) return;

    setArrowsLeft((prev) => prev - 1);

    const speed = 15;
    const newArrow: Projectile = {
      id: Date.now(),
      x: 50,
      y: 92,
      vx: Math.cos(aimAngle) * speed * 0.7,
      vy: Math.sin(aimAngle) * speed * 0.7,
    };
    setProjectiles((prev) => [...prev, newArrow]);
  };

  const update = React.useCallback(
    (time: number) => {
      if (phase !== "playing") return;

      const dt = Math.min((time - lastTime.current) / 16, 2);
      lastTime.current = time;

      setBalloons((prev) => {
        const updated = prev.map((b) => (b.popped ? b : { ...b, y: b.y + b.speed * dt })).filter((b) => b.y < 115);

        const remaining = updated.filter((b) => !b.popped);
        if (remaining.length === 0 && hits < targetHits) {
          setTimeout(() => setPhase("fail"), 600);
        }
        return updated;
      });

      setProjectiles((prev) => {
        const remaining: Projectile[] = [];
        const hitIds = new Set<number>();

        prev.forEach((p) => {
          const nx = p.x + p.vx * 0.08 * dt;
          const ny = p.y + p.vy * 0.08 * dt;

          balloons.forEach((b) => {
            if (b.popped || hitIds.has(b.id)) return;
            const dx = (nx - b.x) * 4.2;
            const dy = (ny - b.y) * 4.2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < b.radius / 5.5) {
              hitIds.add(b.id);
            }
          });

          if (nx > -15 && nx < 115 && ny > -15 && ny < 115) {
            remaining.push({ ...p, x: nx, y: ny });
          }
        });

        if (hitIds.size > 0) {
          setBalloons((bs) => bs.map((b) => (hitIds.has(b.id) ? { ...b, popped: true } : b)));
          setHits((h) => {
            const newHits = h + hitIds.size;
            if (newHits >= targetHits) {
              setTimeout(() => {
                setPhase("success");
                setShowCoupon(true);
              }, 450);
            }
            return newHits;
          });
        }

        return remaining;
      });

      if (arrowsLeft <= 0 && projectiles.length === 0 && hits < targetHits) {
        setTimeout(() => setPhase("fail"), 900);
      }

      animRef.current = requestAnimationFrame(update);
    },
    [phase, balloons, arrowsLeft, hits, projectiles.length, targetHits]
  );

  React.useEffect(() => {
    if (phase === "playing") {
      lastTime.current = performance.now();
      animRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [phase, update]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setBalloons((prev) => prev.filter((b) => !b.popped));
    }, 550);
    return () => clearTimeout(t);
  }, [hits]);

  return (
    <div
      ref={areaRef}
      className={cn("relative w-full h-full overflow-hidden select-none", className)}
      style={{ background: "#f4f6fb", ...style }}
      {...props}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {phase === "idle" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="cursor-pointer rounded-full border-none px-12 py-[18px] text-xl font-semibold text-white"
            style={{ background: "#c2185b", boxShadow: "0 8px 24px rgba(194,24,91,0.35)" }}
          >
            Pop the balloons
          </motion.button>
        </div>
      )}

      {phase === "playing" && (
        <>
          <div
            className="absolute top-4 right-4 left-4 z-20 flex items-center gap-3 rounded-2xl bg-white px-[18px] py-3"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <div className="flex-1">
              <div className="text-[15px] font-bold">Balloon Popper</div>
              <div className="mt-0.5 text-xs text-[#666]">
                Shoot {targetHits} balloons to unlock a coupon. {hits}/{targetHits} hit • {arrowsLeft} arrows left
              </div>
            </div>
            <div className="h-1.5 w-[90px] overflow-hidden rounded-sm bg-[#e0e0e0]">
              <div className="h-full transition-[width] duration-300" style={{ width: `${(hits / targetHits) * 100}%`, background: "#c2185b" }} />
            </div>
            <button onClick={() => setPhase("idle")} className="cursor-pointer border-none bg-transparent text-2xl text-[#999]">
              ×
            </button>
          </div>

          <AnimatePresence>
            {balloons.map((b) =>
              !b.popped ? (
                <motion.div
                  key={b.id}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.8, opacity: 0, transition: { duration: 0.35 } }}
                  className="absolute z-[5] rounded-full"
                  style={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: b.radius,
                    height: b.radius,
                    background: `radial-gradient(circle at 30% 28%, #ffffff88, transparent 55%), ${b.color}`,
                    boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="absolute -bottom-5 left-1/2 h-5 w-0.5 -translate-x-1/2 bg-[#999]" />
                </motion.div>
              ) : null
            )}
          </AnimatePresence>

          {projectiles.map((p) => (
            <div
              key={p.id}
              className="absolute z-10 h-[30px] w-1 rounded-sm"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                background: "#c2185b",
                transform: `translate(-50%, -50%) rotate(${(aimAngle * 180) / Math.PI + 90}deg)`,
              }}
            />
          ))}

          <div className="absolute bottom-7 left-1/2 z-[15] -translate-x-1/2">
            <div
              className="absolute h-[130px] w-[130px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(194,24,91,0.18) 0%, transparent 70%)", top: -45, left: -41 }}
            />
            <svg
              width="52"
              height="52"
              viewBox="0 0 24 24"
              style={{ transform: `rotate(${(aimAngle * 180) / Math.PI + 90}deg)`, transition: "transform 0.04s linear" }}
            >
              <path d="M12 2C8 2 4 6 4 12c0 4 2 7 5 9l3-3 3 3c3-2 5-5 5-9 0-6-4-10-8-10z" fill="none" stroke="#c2185b" strokeWidth="2.2" />
              <line x1="12" y1="12" x2="12" y2="22" stroke="#c2185b" strokeWidth="2.2" />
            </svg>
          </div>
        </>
      )}

      {phase === "success" && showCoupon && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-[6px]" style={{ background: "rgba(0,0,0,0.45)" }}>
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 18 }}
            className="relative w-[90%] max-w-[340px] rounded-3xl bg-white px-8 py-9 text-center"
            style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}
          >
            <div className="mb-2 text-5xl">🎉</div>
            <h2 className="mt-0 mb-1.5 text-2xl font-bold">Congratulations!</h2>
            <p className="mt-0 mb-7 text-[15px] text-[#666]">You successfully popped {targetHits} balloons!</p>

            <div className="relative mb-7 overflow-hidden rounded-2xl px-5 py-[22px] text-white" style={{ background: "linear-gradient(135deg, #c2185b, #e91e63)" }}>
              <div className="mb-1.5 text-[13px] opacity-90">{couponText}</div>
              <div className="font-mono text-[28px] font-extrabold tracking-[2px]">{couponCode}</div>
              <div className="mt-2 text-xs opacity-85">Copy & use</div>

              <div className="absolute -top-5 -right-5 h-[60px] w-[60px] rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
              <div className="absolute -bottom-2.5 -left-2.5 h-10 w-10 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(couponCode);
                setPhase("idle");
              }}
              className="w-full cursor-pointer rounded-full border-none px-10 py-3.5 text-base font-semibold text-white"
              style={{ background: "#c2185b" }}
            >
              Copy Coupon & Close
            </button>
          </motion.div>
        </div>
      )}

      {phase === "fail" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.92)" }}>
          <div className="max-w-[360px] rounded-[20px] bg-white px-9 py-7 text-center" style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}>
            <h2 className="mt-0 mb-2 text-[22px]">Almost there</h2>
            <p className="mt-0 mb-6 leading-normal text-[#666]">The balloons got away. Try again and aim for {targetHits} hits!</p>
            <button onClick={startGame} className="w-full cursor-pointer rounded-full border-none px-10 py-3.5 text-base font-semibold text-white" style={{ background: "#c2185b" }}>
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
