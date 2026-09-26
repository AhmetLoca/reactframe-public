"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Prize {
  title: string;
  description: string;
  code: string;
}

interface ScratchTheme {
  name: string;
  title: string;
  subtitle: string;
  triggerText: string;
  primary: string;
  accent: string;
  prizes: Prize[];
}

const THEMES: Record<string, ScratchTheme> = {
  ecommerce: {
    name: "E-Commerce",
    title: "Unlock Your Reward",
    subtitle: "Scratch the foil and match three identical items",
    triggerText: "Scratch & Win",
    primary: "linear-gradient(160deg, #dbeafe 0%, #bfdbfe 100%)",
    accent: "#0f172a",
    prizes: [
      { title: "Congratulations", description: "You unlocked 50% off", code: "GOLD50" },
      { title: "Nice!", description: "Free shipping unlocked", code: "SHIPFREE" },
      { title: "Lucky you", description: "Mystery gift added", code: "GIFT25" },
    ],
  },
  campaign: {
    name: "Campaign / Sale",
    title: "Scratch Before It's Gone",
    subtitle: "Limited-time drop, scratch now",
    triggerText: "Scratch for a Deal",
    primary: "linear-gradient(160deg, #fff1f0 0%, #fecdd3 100%)",
    accent: "#dc2626",
    prizes: [
      { title: "You got it!", description: "20% off your order", code: "SALE20" },
      { title: "Boom!", description: "30% off your order", code: "SALE30" },
      { title: "Jackpot", description: "40% off your order", code: "SALE40" },
    ],
  },
  restaurant: {
    name: "Restaurant / Cafe",
    title: "Today's Lucky Scratch",
    subtitle: "Scratch, reveal, treat yourself",
    triggerText: "Scratch for a Treat",
    primary: "linear-gradient(160deg, #fff7ed 0%, #fde8cf 100%)",
    accent: "#b45309",
    prizes: [
      { title: "Cheers!", description: "Free coffee on us", code: "CAFE-COFFEE" },
      { title: "Sweet!", description: "Free dessert with any meal", code: "CAFE-DESSERT" },
      { title: "Treat unlocked", description: "15% off your bill", code: "CAFE15" },
    ],
  },
  saas: {
    name: "SaaS / Freemium",
    title: "Scratch for a Plan Discount",
    subtitle: "One scratch per new account",
    triggerText: "Scratch & Save",
    primary: "linear-gradient(160deg, #eef2ff 0%, #e0e7ff 100%)",
    accent: "#4f46e5",
    prizes: [
      { title: "Nice start", description: "10% off your first plan", code: "SAAS10" },
      { title: "Great pick", description: "1 month free", code: "SAAS-MONTH" },
      { title: "Top tier", description: "30% off your first plan", code: "SAAS30" },
    ],
  },
  event: {
    name: "Event / Tickets",
    title: "Scratch for an Early Bird Deal",
    subtitle: "Before you check out",
    triggerText: "Scratch for a Bonus",
    primary: "linear-gradient(160deg, #ecfeff 0%, #cffafe 100%)",
    accent: "#0891b2",
    prizes: [
      { title: "Nice!", description: "5% off your ticket", code: "EVT5" },
      { title: "Sweet", description: "Free drink ticket", code: "EVT-DRINK" },
      { title: "VIP", description: "VIP seating upgrade", code: "EVT-VIP" },
    ],
  },
};

const svgDataUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;
const ICON_CROWN = svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#D4AF37" d="M2 8l4 3 6-7 6 7 4-3-2 10H4L2 8zM4 20h16v2H4z"/></svg>`);
const ICON_DIAMOND = svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#60A5FA" d="M6 3h12l4 6-10 12L2 9z"/></svg>`);
const ICON_GIFT = svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="12" fill="#34D399"/><rect x="3" y="6" width="18" height="4" fill="#10B981"/><rect x="10.5" y="6" width="3" height="15" fill="#ffffff"/></svg>`);
const ICON_STAR = svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#F472B6" d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l7.1-1.01z"/></svg>`);
const ICON_HEXAGON = svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="#A78BFA" stroke-width="2" d="M12 2l8 4.5v11L12 22l-8-4.5v-11z"/></svg>`);
const ICON_COIN = svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#FBBF24"/><circle cx="12" cy="12" r="9" fill="none" stroke="#D97706" stroke-width="1.5"/><text x="12" y="16" font-size="10" text-anchor="middle" fill="#92400E" font-family="Arial">$</text></svg>`);
const ICON_HEART = svgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#F87171" d="M12 21s-8-5.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-8 11-8 11z"/></svg>`);

const DEFAULT_IMAGES = [ICON_CROWN, ICON_CROWN, ICON_CROWN, ICON_DIAMOND, ICON_GIFT, ICON_STAR, ICON_HEXAGON, ICON_COIN, ICON_HEART];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function GiftIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="scratch-gift-ribbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect x="3.5" y="10" width="17" height="9.5" rx="1.5" fill="#ffffff" />
      <rect x="2.5" y="7" width="19" height="4" rx="1" fill="#ffffff" />
      <rect x="10.4" y="7" width="3.2" height="12.5" fill="url(#scratch-gift-ribbon)" />
      <path d="M12 7c-1.6 0-3-1-3.6-2.1C7.6 3.2 8.5 2 9.8 2c1.3 0 2.2 1.4 2.2 3 0-1.6.9-3 2.2-3 1.3 0 2.2 1.2 1.4 2.9C15 6 13.6 7 12 7z" fill="url(#scratch-gift-ribbon)" />
    </svg>
  );
}

function ScratchConfetti({ colors, onDone }: { colors: string[]; onDone: () => void }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const onDoneRef = React.useRef(onDone);
  onDoneRef.current = onDone;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = parent.clientWidth || 300;
    const h = parent.clientHeight || 300;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    interface P {
      x: number;
      y: number;
      vx: number;
      vy: number;
      rot: number;
      vRot: number;
      size: number;
      color: string;
      alpha: number;
    }

    const count = w < 420 ? 60 : 100;
    const particles: P[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      return {
        x: w / 2,
        y: h * 0.32,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.3,
        size: 5 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
      };
    });

    const duration = 2200;
    const start = performance.now();
    let rafId: number;

    const animate = (t: number) => {
      const elapsed = t - start;
      const cw = parent.clientWidth || w;
      const ch = parent.clientHeight || h;
      ctx.clearRect(0, 0, cw, ch);

      let anyAlive = false;
      for (const p of particles) {
        p.vy += 0.14;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        if (elapsed > duration * 0.55) p.alpha -= 0.025;
        if (p.alpha > 0.01 && p.y < ch + 40) {
          anyAlive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      }

      if (elapsed < duration && anyAlive) rafId = requestAnimationFrame(animate);
      else onDoneRef.current();
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [colors]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />;
}

const BRUSH_SIZE = 60;

function drawFoil(canvas: HTMLCanvasElement, size: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = size;
  canvas.height = size;

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#6b4409");
  gradient.addColorStop(0.18, "#a9761a");
  gradient.addColorStop(0.4, "#e7bb52");
  gradient.addColorStop(0.5, "#f2cd80");
  gradient.addColorStop(0.6, "#e2af42");
  gradient.addColorStop(0.82, "#9c6c14");
  gradient.addColorStop(1, "#5e3b07");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  for (let i = 0; i < 260; i++) {
    const y = Math.random() * size;
    const len = size * (0.3 + Math.random() * 0.7);
    const x = Math.random() * size - len / 2;
    ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
    ctx.lineWidth = Math.random() * 1.1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y + (Math.random() - 0.5) * 6);
    ctx.stroke();
  }
  ctx.restore();

  const vignette = ctx.createRadialGradient(size / 2, size / 2, size * 0.32, size / 2, size / 2, size * 0.72);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(50,30,4,0.28)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, size, size);

  const drawSpacedText = (text: string, cx: number, cy: number, font: string, trackingPx: number) => {
    ctx.font = font;
    const chars = text.split("");
    const widths = chars.map((c) => ctx.measureText(c).width);
    const totalWidth = widths.reduce((a, b) => a + b, 0) + trackingPx * (chars.length - 1);
    let x = cx - totalWidth / 2;
    ctx.textAlign = "left";
    chars.forEach((c, i) => {
      ctx.fillText(c, x, cy);
      x += widths[i] + trackingPx;
    });
  };

  const scratchFont = `800 15px Arial, sans-serif`;
  const andFont = `italic 400 20px Georgia, serif`;
  const centerY = size / 2;
  const lineGap = 7;
  const lines = [
    { text: "SCRATCH", y: centerY - 20 - lineGap, font: scratchFont, tracking: 1.5 },
    { text: "and", y: centerY, font: andFont, tracking: 0 },
    { text: "WIN!", y: centerY + 20 + lineGap, font: scratchFont, tracking: 1.5 },
  ];
  ctx.textBaseline = "middle";
  lines.forEach(({ text, y, font, tracking }) => {
    ctx.fillStyle = "rgba(40,25,2,0.35)";
    drawSpacedText(text, size / 2 + 1, y + 1, font, tracking);
  });
  lines.forEach(({ text, y, font, tracking }) => {
    ctx.fillStyle = "rgba(255,250,230,0.92)";
    drawSpacedText(text, size / 2, y, font, tracking);
  });
}

export interface ScratchCardPopupProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  theme?: "ecommerce" | "campaign" | "restaurant" | "saas" | "event";
  asPopup?: boolean;
  trigger?: "manual" | "delay" | "scroll";
  delaySeconds?: number;
  widgetPosition?: "bottom-right" | "bottom-left";
  freeAttempts?: number;
}

export function ScratchCardPopup({
  theme = "ecommerce",
  asPopup = false,
  trigger = "manual",
  delaySeconds = 4,
  widgetPosition = "bottom-right",
  freeAttempts = 3,
  className,
  style,
  ...props
}: ScratchCardPopupProps) {
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const isDrawing = React.useRef(false);
  const lastPoint = React.useRef<{ x: number; y: number } | null>(null);
  const copyTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [popupOpen, setPopupOpen] = React.useState(!asPopup);
  const [scrollTriggered, setScrollTriggered] = React.useState(false);
  const [roundId, setRoundId] = React.useState(0);
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [scratchProgress, setScratchProgress] = React.useState(0);
  const [awardedPrize, setAwardedPrize] = React.useState<Prize | null>(null);
  const [attemptsLeft, setAttemptsLeft] = React.useState(freeAttempts);
  const [rewards, setRewards] = React.useState<Prize[]>([]);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const activeTheme = THEMES[theme] || THEMES.ecommerce;
  const cardSize = asPopup ? 300 : 270;
  const cardRadius = 30;
  const itemRadius = 24;

  // Shuffled only after mount — shuffling during render would make the
  // server-rendered order (Math.random() has no seed) mismatch the client's,
  // triggering a hydration error.
  const [displayItems, setDisplayItems] = React.useState(DEFAULT_IMAGES);
  React.useEffect(() => {
    setDisplayItems(shuffle(DEFAULT_IMAGES));
  }, [roundId]);
  const matchedIndices = React.useMemo(() => {
    const counts: Record<string, number> = {};
    const indices: Record<string, number[]> = {};
    displayItems.forEach((src, idx) => {
      counts[src] = (counts[src] || 0) + 1;
      (indices[src] ||= []).push(idx);
    });
    for (const [key, count] of Object.entries(counts)) {
      if (count >= 3) return indices[key];
    }
    return null;
  }, [displayItems]);
  const isWon = isRevealed && matchedIndices !== null;

  React.useEffect(() => () => clearTimeout(copyTimerRef.current), []);
  React.useEffect(() => setPopupOpen(!asPopup), [asPopup]);

  React.useEffect(() => {
    if (!asPopup || trigger !== "delay") return;
    const t = setTimeout(() => setPopupOpen(true), delaySeconds * 1000);
    return () => clearTimeout(t);
  }, [asPopup, trigger, delaySeconds]);

  React.useEffect(() => {
    if (!asPopup || trigger !== "scroll" || !rootRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !scrollTriggered) {
          setScrollTriggered(true);
          setPopupOpen(true);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [asPopup, trigger, scrollTriggered]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    drawFoil(canvas, cardSize);
  }, [isRevealed, roundId, cardSize]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const isTouch = "touches" in e;
    const clientX = isTouch ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = isTouch ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const getFilledPercentage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return 0;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let transparent = 0;
    const step = 32;
    for (let i = 3; i < data.length; i += 4 * step) {
      if (data[i] < 40) transparent++;
    }
    return Math.round((transparent / (data.length / 4 / step)) * 100);
  };

  const completeReveal = () => {
    if (isRevealed || attemptsLeft <= 0) return;
    setIsRevealed(true);
    setScratchProgress(100);
    if (matchedIndices === null) return;

    const lastCode = rewards[rewards.length - 1]?.code;
    const pool = activeTheme.prizes.length > 1 ? activeTheme.prizes.filter((p) => p.code !== lastCode) : activeTheme.prizes;
    const prize = pool[Math.floor(Math.random() * pool.length)];
    setRewards((r) => [...r, prize]);
    setAttemptsLeft((n) => n - 1);
    setAwardedPrize(prize);
    setShowConfetti(true);
  };

  const scratchAgain = () => {
    if (attemptsLeft <= 0) return;
    setIsRevealed(false);
    setScratchProgress(0);
    setAwardedPrize(null);
    setShowConfetti(false);
    setRoundId((id) => id + 1);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (attemptsLeft <= 0) return;
    isDrawing.current = true;
    lastPoint.current = getPos(e);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !lastPoint.current || attemptsLeft <= 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const current = getPos(e);
    const dist = Math.hypot(current.x - lastPoint.current.x, current.y - lastPoint.current.y);
    const angle = Math.atan2(current.x - lastPoint.current.x, current.y - lastPoint.current.y);

    ctx.globalCompositeOperation = "destination-out";
    for (let i = 0; i < dist; i += 2.5) {
      const x = lastPoint.current.x + Math.sin(angle) * i;
      const y = lastPoint.current.y + Math.cos(angle) * i;
      ctx.beginPath();
      ctx.arc(x, y, BRUSH_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPoint.current = current;
    const percent = getFilledPercentage();
    setScratchProgress(percent);
    if (percent >= 42) completeReveal();
  };

  const handleEnd = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  const copyRewardCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedCode((c) => (c === code ? null : c)), 1500);
  };

  const confettiColors = [activeTheme.accent, "#f59e0b", "#22c55e", "#0f172a", activeTheme.accent];

  const gameCard = (
    <div className={cn("relative box-border flex w-full flex-col items-center overflow-hidden rounded-[36px]", asPopup ? "p-7" : "p-4")} style={{ background: activeTheme.primary, color: "#0f172a", fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
      <div className="pointer-events-none absolute top-[-60px] left-1/2 -translate-x-1/2" style={{ width: cardSize * 1.2, height: cardSize * 1.2, background: `radial-gradient(circle, ${activeTheme.accent}18 0%, transparent 70%)` }} />

      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <ScratchConfetti colors={confettiColors} onDone={() => setShowConfetti(false)} />
        </div>
      )}

      <div className={cn("w-full text-center", asPopup ? "mb-5.5" : "mb-4")}>
        <h2 id={`${uid}-title`} className="m-0 text-[23px] font-semibold tracking-tight">
          {activeTheme.title}
        </h2>
        <p className="mt-1.5 text-sm leading-snug" style={{ color: "rgba(15,23,42,0.55)" }}>
          {activeTheme.subtitle}
        </p>
        <div className="mt-2.5 inline-block rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: `${activeTheme.accent}12`, color: activeTheme.accent }}>
          {attemptsLeft > 0 ? `${attemptsLeft} scratch${attemptsLeft > 1 ? "es" : ""} left` : "No scratches left"}
        </div>
      </div>

      <div className="relative shrink-0 overflow-hidden rounded-[30px] bg-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]" style={{ width: cardSize, height: cardSize }}>
        <div className="absolute inset-0 grid grid-cols-3 gap-1.5 p-3.5">
          {displayItems.map((src, i) => {
            const isMatch = isWon && matchedIndices !== null && matchedIndices.includes(i);
            return (
              <div
                key={i}
                className="flex items-center justify-center rounded-xl"
                style={{
                  background: isMatch ? `${activeTheme.accent}15` : "rgba(15,23,42,0.03)",
                  borderRadius: itemRadius,
                  border: isMatch ? `1.5px solid ${activeTheme.accent}` : "1px solid rgba(15,23,42,0.06)",
                  boxShadow: isMatch ? `0 0 16px ${activeTheme.accent}30` : "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-[58%] w-[58%] object-contain" />
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {!isRevealed && (
            <motion.canvas
              ref={canvasRef}
              aria-hidden="true"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 h-full w-full rounded-[24px]"
              style={{ cursor: "crosshair", touchAction: "none" }}
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
            />
          )}
        </AnimatePresence>
      </div>

      {!isRevealed && (
        <div className={asPopup ? "mt-4.5" : "mt-3.5"} style={{ width: cardSize }}>
          <div role="progressbar" aria-valuenow={scratchProgress} aria-valuemin={0} aria-valuemax={100} className="h-[3px] overflow-hidden rounded-full" style={{ background: "rgba(15,23,42,0.1)" }}>
            <motion.div className="h-full rounded-full" style={{ background: activeTheme.accent }} animate={{ width: `${scratchProgress}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px]" style={{ color: "rgba(15,23,42,0.55)" }}>
            <span>Scratch progress</span>
            <span>{scratchProgress}%</span>
          </div>
        </div>
      )}

      {!isRevealed && attemptsLeft > 0 && (
        <button onClick={completeReveal} className="mt-3 cursor-pointer border-none bg-transparent text-xs underline" style={{ color: "rgba(15,23,42,0.55)" }}>
          Reveal instantly
        </button>
      )}

      <AnimatePresence>
        {isRevealed && isWon && awardedPrize && (
          <motion.div role="status" aria-live="polite" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4.5 w-full rounded-3xl border border-black/8 bg-white p-5 text-center shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)]" style={{ maxWidth: cardSize + 10 }}>
            <div className="mb-1 text-[11px] tracking-wide uppercase" style={{ color: activeTheme.accent }}>
              {awardedPrize.title}
            </div>
            <div className="mb-3.5 text-sm" style={{ color: "rgba(15,23,42,0.55)" }}>
              {awardedPrize.description}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 rounded-[10px] py-2.5 text-[15px] font-semibold" style={{ background: `${activeTheme.accent}12`, border: `1px solid ${activeTheme.accent}44`, color: activeTheme.accent }}>
                {awardedPrize.code}
              </div>
              <button onClick={() => copyRewardCode(awardedPrize.code)} className="cursor-pointer rounded-[10px] border-none px-3.5 text-[13px] font-semibold text-white" style={{ background: activeTheme.accent }}>
                {copiedCode === awardedPrize.code ? "Copied" : "Copy"}
              </button>
            </div>
            {attemptsLeft > 0 && (
              <button onClick={scratchAgain} className="mt-3 w-full cursor-pointer rounded-[10px] py-2.5 text-[13px] font-semibold" style={{ border: `1px solid ${activeTheme.accent}33`, color: activeTheme.accent }}>
                Scratch Again ({attemptsLeft} left)
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {rewards.length > 0 && (
        <div className="mt-4.5 w-full" style={{ maxWidth: cardSize + 10 }}>
          <div className="mb-2.5 text-center text-xs font-bold" style={{ color: "rgba(15,23,42,0.55)" }}>
            Your Rewards
          </div>
          <div className="flex flex-col gap-2">
            {rewards.map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-2.5 rounded-xl border border-black/8 bg-white px-3.5 py-2.5">
                <div>
                  <div className="text-[13px] font-bold">{r.description}</div>
                  <div className="mt-0.5 text-xs font-semibold" style={{ color: activeTheme.accent }}>
                    {r.code}
                  </div>
                </div>
                <button onClick={() => copyRewardCode(r.code)} className="shrink-0 cursor-pointer rounded-lg border-none px-2.5 py-1.5 text-[11px] font-semibold" style={{ background: `${activeTheme.accent}12`, color: activeTheme.accent }}>
                  {copiedCode === r.code ? "Copied" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (!asPopup) {
    return (
      <div ref={rootRef} className={className} style={style} {...props}>
        {gameCard}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={className} style={style} {...props}>
      <div className={cn("fixed bottom-6 z-[9998] flex items-center", widgetPosition === "bottom-left" ? "left-6" : "right-6")}>
        <motion.button
          onClick={() => setPopupOpen(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          aria-label={activeTheme.triggerText}
          className="flex h-14 items-center gap-3 rounded-full border border-black/8 bg-white py-1.5 pr-5 pl-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: activeTheme.primary }}>
            <GiftIcon />
          </span>
          <span className="text-[13px] font-bold whitespace-nowrap uppercase" style={{ color: activeTheme.accent }}>
            {activeTheme.triggerText}
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {popupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${uid}-title`}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") setPopupOpen(false);
              }}
              className="relative w-full max-w-[420px]"
              style={{ maxHeight: "90vh" }}
            >
              {gameCard}
              <button
                onClick={() => setPopupOpen(false)}
                aria-label="Close"
                className="absolute -top-3.5 -right-3.5 z-[100] flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-[17px] text-black shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
