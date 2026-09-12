"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Prize {
  label: string;
  code: string;
}

const COLORS = ["#4ade80", "#f87171", "#38bdf8", "#fb923c", "#facc15", "#a78bfa", "#f472b6", "#2dd4bf"];

const PRIZES: Prize[] = [
  { label: "5% off", code: "SAVE5" },
  { label: "10% off", code: "SAVE10" },
  { label: "15% off", code: "SAVE15" },
  { label: "20% off", code: "SAVE20" },
  { label: "25% off", code: "SAVE25" },
  { label: "Free shipping", code: "FREESHIP" },
  { label: "Free gift", code: "FREEGIFT" },
  { label: "Mystery Prize", code: "MYSTERY" },
];

const ARC = Math.PI / 4;

function easeOut(t: number, b: number, c: number, d: number) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

export interface SpinToWinWheelProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  size?: number;
  duration?: number;
}

export function SpinToWinWheel({ className, style, size = 380, duration = 5.2, ...props }: SpinToWinWheelProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [startAngle, setStartAngle] = React.useState(0);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [result, setResult] = React.useState<Prize | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [hasSpun, setHasSpun] = React.useState(false);

  React.useEffect(() => {
    const spun = localStorage.getItem("spin-to-win-has-spun");
    if (spun === "true") setHasSpun(true);
  }, []);

  const drawWheel = React.useCallback(
    (angle = 0) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const center = size / 2;
      const outsideRadius = center * 0.82;
      const textRadius = center * 0.64;
      const insideRadius = center * 0.42;

      ctx.clearRect(0, 0, size, size);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.font = `bold ${Math.max(11, size * 0.038)}px Helvetica, Arial, sans-serif`;

      for (let i = 0; i < 8; i++) {
        const ang = angle + i * ARC;
        ctx.fillStyle = COLORS[i];

        ctx.beginPath();
        ctx.arc(center, center, outsideRadius, ang, ang + ARC, false);
        ctx.arc(center, center, insideRadius, ang + ARC, ang, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.fillStyle = "#1e293b";
        ctx.translate(center + Math.cos(ang + ARC / 2) * textRadius, center + Math.sin(ang + ARC / 2) * textRadius);
        ctx.rotate(ang + ARC / 2 + Math.PI / 2);
        const text = PRIZES[i].label;
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      }

      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.moveTo(center - 8, center - (outsideRadius + 12));
      ctx.lineTo(center + 8, center - (outsideRadius + 12));
      ctx.lineTo(center + 8, center - (outsideRadius - 2));
      ctx.lineTo(center + 14, center - (outsideRadius - 2));
      ctx.lineTo(center, center - (outsideRadius - 20));
      ctx.lineTo(center - 14, center - (outsideRadius - 2));
      ctx.lineTo(center - 8, center - (outsideRadius - 2));
      ctx.closePath();
      ctx.fill();
    },
    [size]
  );

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    drawWheel(startAngle);
  }, [size, startAngle, drawWheel]);

  const spin = () => {
    if (hasSpun || isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const spinAngleStart = 14 + Math.floor(Math.random() * 20);
    let spinTime = 0;
    const spinTimeTotal = duration * 1000 + Math.random() * 800;

    let currentAngle = startAngle;

    const animate = () => {
      spinTime += 30;

      if (spinTime >= spinTimeTotal) {
        const degrees = (currentAngle * 180) / Math.PI + 90;
        const arcd = (ARC * 180) / Math.PI;
        const index = Math.floor((360 - (degrees % 360)) / arcd) % 8;

        setStartAngle(currentAngle);
        setIsSpinning(false);
        setResult(PRIZES[index]);
        setShowModal(true);

        localStorage.setItem("spin-to-win-has-spun", "true");
        setHasSpun(true);
        return;
      }

      const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);

      currentAngle += (spinAngle * Math.PI) / 180;
      setStartAngle(currentAngle);
      drawWheel(currentAngle);

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const copyCode = () => {
    if (result?.code) {
      navigator.clipboard.writeText(result.code);
    }
  };

  return (
    <div
      className={cn("relative flex w-full h-full flex-col items-center justify-center overflow-hidden rounded-[24px] p-5 select-none", className)}
      style={{ background: "linear-gradient(160deg, #faf8ef 0%, #eee4da 100%)", fontFamily: "'Nunito', system-ui, sans-serif", ...style }}
      {...props}
    >
      <h1 className="mb-3 text-[clamp(22px,5.5vw,28px)] font-extrabold tracking-[-0.5px] text-[#776e65]">Spin & Win</h1>

      <div className="relative w-full" style={{ maxWidth: size, aspectRatio: "1 / 1" }}>
        <canvas
          ref={canvasRef}
          onClick={spin}
          className="block h-full w-full rounded-full"
          style={{ cursor: hasSpun || isSpinning ? "not-allowed" : "pointer", boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}
        />
      </div>

      <p className="mt-4 text-center text-sm text-[#8f7a66]">
        {hasSpun ? "You already used your spin" : isSpinning ? "Good luck..." : "Tap the wheel to spin (1 chance)"}
      </p>

      <AnimatePresence>
        {showModal && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center rounded-[24px] p-4"
            style={{ background: "rgba(238, 228, 218, 0.85)" }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-[320px] rounded-[20px] px-6 py-7 text-center"
              style={{ background: "#FFFBF5", boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
            >
              <h3 className="m-0 text-2xl font-extrabold text-[#0f172a]">You won!</h3>

              <p className="my-2 mb-[18px] text-sm leading-[1.4] text-[#64748b]">
                Use your reward code at checkout. <strong className="text-[#0f172a]">{result.label}</strong>
              </p>

              <div className="mb-[18px] flex items-center justify-between rounded-[14px] border-2 border-dashed border-[#f97316] bg-white px-4 py-3">
                <span className="text-lg font-extrabold tracking-[0.05em] text-[#f97316]">{result.code}</span>
                <button onClick={copyCode} className="cursor-pointer border-none bg-transparent p-1 text-lg" title="Copy code">
                  📋
                </button>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full cursor-pointer rounded-[14px] border-none bg-[#0f172a] p-3.5 text-[15px] font-bold text-white"
              >
                Claim reward
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
