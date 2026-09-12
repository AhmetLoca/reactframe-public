"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  text: string;
  points: number;
}

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alive: boolean;
  points?: number;
}

const TARGET = { x: 720, y: 220 };

const RINGS = [
  { r: 28, points: 50, color: "#ef4444" },
  { r: 55, points: 30, color: "#f97316" },
  { r: 85, points: 20, color: "#eab308" },
  { r: 120, points: 10, color: "#3b82f6" },
];

function Confetti({ color }: { color: string }) {
  const parts = React.useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: 55 + Math.random() * 30,
        c: [color, "#ef4444", "#fff", "#eab308"][i % 4],
        s: 5 + Math.random() * 6,
        d: Math.random() * 0.25,
      })),
    [color]
  );
  return (
    <div className="pointer-events-none absolute inset-0">
      {parts.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.x}%`, top: "40%", width: p.s, height: p.s, background: p.c }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ y: -150 - Math.random() * 80, x: (Math.random() - 0.5) * 120, opacity: 0, scale: 1, rotate: Math.random() * 300 }}
          transition={{ duration: 1.2, delay: p.d }}
        />
      ))}
    </div>
  );
}

export interface DartThrowGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  accentColor?: string;
}

export function DartThrowGame({ className, style, accentColor = "#22c55e", ...props }: DartThrowGameProps) {
  const [score, setScore] = React.useState(0);
  const [best, setBest] = React.useState(0);
  const [ballsLeft, setBallsLeft] = React.useState(8);
  const [streak, setStreak] = React.useState(0);
  const [message, setMessage] = React.useState<Message | null>(null);
  const [gameOver, setGameOver] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const [isAiming, setIsAiming] = React.useState(false);
  const [aimAngle, setAimAngle] = React.useState(0);
  const [power, setPower] = React.useState(0);

  const [flying, setFlying] = React.useState<Ball[]>([]);
  const [landed, setLanded] = React.useState<Ball[]>([]);

  const svgRef = React.useRef<SVGSVGElement>(null);
  const animId = React.useRef<number>(0);

  React.useEffect(() => {
    const saved = localStorage.getItem("dart-throw-best");
    if (saved) setBest(parseInt(saved));
    return () => cancelAnimationFrame(animId.current);
  }, []);

  const getPoint = (e: React.PointerEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    return pt.matrixTransform(ctm.inverse());
  };

  const aim = React.useCallback((e: React.PointerEvent) => {
    const p = getPoint(e);
    p.x = Math.min(p.x, 170);
    p.y = Math.max(20, Math.min(p.y, 400));

    const dx = p.x - 140;
    const dy = p.y - 220;
    const angle = Math.atan2(dy, dx);
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 140);

    setAimAngle(angle);
    setPower(Math.min(dist / 140, 1));
  }, []);

  const startAim = (e: React.PointerEvent) => {
    if (gameOver || ballsLeft <= 0 || flying.length > 0) return;
    e.preventDefault();
    setIsAiming(true);
    aim(e);
  };

  const release = () => {
    if (!isAiming || power < 0.1) {
      setIsAiming(false);
      setPower(0);
      return;
    }

    setIsAiming(false);
    setBallsLeft((b) => b - 1);

    const flightAngle = aimAngle + Math.PI;
    const speed = 14 + power * 32;

    const id = Date.now();
    const ball: Ball = {
      id,
      x: 140,
      y: 220,
      vx: Math.cos(flightAngle) * speed,
      vy: Math.sin(flightAngle) * speed * 1.15,
      r: 14,
      alive: true,
    };

    setFlying([ball]);
    setPower(0);

    const gravity = 0.21;

    const tick = () => {
      if (!ball.alive) return;

      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vy += gravity;

      if (ball.x > TARGET.x - 140) {
        const dist = Math.hypot(ball.x - TARGET.x, ball.y - TARGET.y);

        let points = 0;
        let ringName = "MISS";

        if (dist <= RINGS[0].r) {
          points = 50;
          ringName = "BULLSEYE";
        } else if (dist <= RINGS[1].r) {
          points = 30;
          ringName = "30";
        } else if (dist <= RINGS[2].r) {
          points = 20;
          ringName = "20";
        } else if (dist <= RINGS[3].r) {
          points = 10;
          ringName = "10";
        }

        ball.alive = false;
        setFlying([]);
        setLanded((prev) => [...prev, { ...ball, points }]);

        if (points > 0) {
          const bonus = streak * 3;
          const total = points + bonus;
          setMessage({ text: ringName, points: total });
          setScore((s) => {
            const ns = s + total;
            if (ns > best) {
              setBest(ns);
              localStorage.setItem("dart-throw-best", ns.toString());
            }
            return ns;
          });
          setStreak((st) => st + 1);

          if (points === 50) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
          }
        } else {
          setMessage({ text: "MISS", points: 0 });
          setStreak(0);
        }

        setTimeout(() => setMessage(null), 1300);

        setTimeout(() => {
          setBallsLeft((left) => {
            if (left <= 0) setGameOver(true);
            return left;
          });
        }, 400);
        return;
      }

      if (ball.x > 1100 || ball.y > 560) {
        ball.alive = false;
        setFlying([]);
        setMessage({ text: "MISS", points: 0 });
        setStreak(0);
        setTimeout(() => setMessage(null), 1200);
        setTimeout(() => {
          setBallsLeft((left) => {
            if (left <= 0) setGameOver(true);
            return left;
          });
        }, 400);
        return;
      }

      setFlying([{ ...ball }]);
      animId.current = requestAnimationFrame(tick);
    };

    animId.current = requestAnimationFrame(tick);
  };

  const reset = () => {
    setScore(0);
    setBallsLeft(8);
    setStreak(0);
    setLanded([]);
    setFlying([]);
    setMessage(null);
    setGameOver(false);
    setIsAiming(false);
    setPower(0);
  };

  return (
    <div
      className={cn("relative flex w-full h-full flex-col overflow-hidden rounded-[20px] text-white select-none", className)}
      style={{ background: "#0f0f0f", fontFamily: "system-ui, -apple-system, sans-serif", ...style }}
      {...props}
    >
      <div className="flex items-center justify-between px-[22px] pt-[18px] pb-2.5">
        <div>
          <div className="text-[36px] leading-none font-extrabold">{score}</div>
          <div className="mt-[3px] text-xs tracking-[0.5px] opacity-40">BEST {best}</div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="flex gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[9px] w-[9px] rounded-full" style={{ opacity: i < ballsLeft ? 1 : 0.15, background: accentColor }} />
            ))}
          </div>
          {streak > 1 && <div className="text-[15px] font-bold opacity-70">x{streak}</div>}
        </div>
      </div>

      <div className="relative mx-3.5 mb-3.5 flex-1 overflow-hidden rounded-2xl" style={{ background: "#161616" }}>
        <svg
          ref={svgRef}
          viewBox="0 0 1000 400"
          className="block h-full w-full cursor-crosshair"
          style={{ touchAction: "none" }}
          onPointerDown={startAim}
          onPointerMove={(e) => isAiming && aim(e)}
          onPointerUp={release}
          onPointerLeave={() => isAiming && release()}
        >
          {RINGS.slice()
            .reverse()
            .map((ring, i) => (
              <circle key={i} cx={TARGET.x} cy={TARGET.y} r={ring.r} fill={ring.color} stroke="#111" strokeWidth="3" />
            ))}

          <text x={TARGET.x} y={TARGET.y + 6} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800">
            50
          </text>
          <text x={TARGET.x} y={TARGET.y - 38} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">
            30
          </text>
          <text x={TARGET.x} y={TARGET.y - 68} textAnchor="middle" fill="#111" fontSize="13" fontWeight="700">
            20
          </text>
          <text x={TARGET.x} y={TARGET.y - 100} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">
            10
          </text>

          <rect x="90" y="300" width="100" height="12" rx="6" fill="#333" />

          {isAiming && (
            <>
              <line
                x1="140"
                y1="220"
                x2={140 + Math.cos(aimAngle) * power * 120}
                y2={220 + Math.sin(aimAngle) * power * 120}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <circle cx={140 + Math.cos(aimAngle) * power * 95} cy={220 + Math.sin(aimAngle) * power * 95} r="14" fill={accentColor} opacity="0.7" />
            </>
          )}

          {!isAiming && flying.length === 0 && ballsLeft > 0 && !gameOver && <circle cx="140" cy="220" r="14" fill={accentColor} />}

          {flying.map((b) => (
            <circle key={b.id} cx={b.x} cy={b.y} r={b.r} fill={accentColor} />
          ))}

          {landed.map((b) => (
            <circle key={b.id} cx={b.x} cy={b.y} r={12} fill={accentColor} opacity="0.85" />
          ))}
        </svg>

        {isAiming && (
          <div className="absolute bottom-4 left-5 h-1 w-[110px] overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.12)" }}>
            <div className="h-full rounded-full" style={{ width: `${power * 100}%`, background: accentColor }} />
          </div>
        )}

        <AnimatePresence>
          {message && (
            <motion.div
              className="pointer-events-none absolute top-[28%] left-1/2 -translate-x-1/2 text-[26px] font-extrabold tracking-[1px]"
              initial={{ opacity: 0, y: 20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {message.text}
              {message.points > 0 && <span className="ml-2.5 opacity-70">+{message.points}</span>}
            </motion.div>
          )}
        </AnimatePresence>

        {showConfetti && <Confetti color={accentColor} />}
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.75)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-[20px] px-[50px] py-10 text-center" style={{ background: "#1c1c1c" }}>
              <div className="text-lg opacity-60">Final Score</div>
              <div className="my-2 mb-5 text-5xl font-black">{score}</div>
              <button className="cursor-pointer rounded-xl border-none bg-white px-8 py-3.5 text-[15px] font-bold text-[#111]" onClick={reset}>
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
