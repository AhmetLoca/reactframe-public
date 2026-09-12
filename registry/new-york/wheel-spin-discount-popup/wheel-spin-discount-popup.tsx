"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Reward {
  label: string;
  code: string;
}

interface WheelSegment {
  label: string;
  code: string;
  /** Relative weight for probability (higher = more likely). Default 1. */
  weight?: number;
  color?: string;
}

interface ThemeConfig {
  name: string;
  title: string;
  subtitle: string;
  buttonText: string;
  triggerText: string;
  glow: string;
  background: string;
  segments: WheelSegment[];
}

const SEGMENT_PALETTE = ["#1a1d24", "#252a33", "#1e222b", "#2a303b", "#181b21", "#222831", "#1c2028", "#262c36"];

const THEMES: { [key: string]: ThemeConfig } = {
  ecommerce: {
    name: "E-Commerce",
    title: "Spin for a Discount",
    subtitle: "3 free spins, real savings",
    buttonText: "Spin Wheel",
    triggerText: "Spin for a Discount",
    glow: "rgba(255,255,255,0.16)",
    background: "linear-gradient(160deg, #07080b 0%, #101319 100%)",
    segments: [
      { label: "5% off", code: "SPIN5", weight: 3 },
      { label: "10% off", code: "SPIN10", weight: 3 },
      { label: "15% off", code: "SPIN15", weight: 2 },
      { label: "20% off", code: "SPIN20", weight: 2 },
      { label: "Free Ship", code: "SHIPFREE", weight: 1 },
      { label: "25% off", code: "SPIN25", weight: 1 },
      { label: "Try Again", code: "SPIN-RETRY", weight: 2 },
      { label: "30% off", code: "SPIN30", weight: 1 },
    ],
  },
  campaign: {
    name: "Campaign / Sale",
    title: "Spin Before It's Gone",
    subtitle: "Limited-time drop, spin now",
    buttonText: "Spin for Deal",
    triggerText: "Spin for a Deal",
    glow: "rgba(248,113,113,0.22)",
    background: "linear-gradient(160deg, #0c0505 0%, #1a0808 100%)",
    segments: [
      { label: "10% off", code: "SALE10", weight: 3 },
      { label: "20% off", code: "SALE20", weight: 2 },
      { label: "30% off", code: "SALE30", weight: 2 },
      { label: "40% off", code: "SALE40", weight: 1 },
      { label: "Flash 15%", code: "FLASH15", weight: 2 },
      { label: "50% off", code: "SALE50", weight: 1 },
      { label: "Try Again", code: "SALE-RETRY", weight: 2 },
      { label: "Bundle Deal", code: "BUNDLE", weight: 1 },
    ],
  },
  restaurant: {
    name: "Restaurant / Cafe",
    title: "Today's Lucky Spin",
    subtitle: "Scan, spin, treat yourself",
    buttonText: "Spin for Treat",
    triggerText: "Spin for a Treat",
    glow: "rgba(251,191,36,0.20)",
    background: "linear-gradient(160deg, #0c0904 0%, #1a1206 100%)",
    segments: [
      { label: "Free Coffee", code: "CAFE-COFFEE", weight: 2 },
      { label: "10% off", code: "CAFE10", weight: 3 },
      { label: "Free Dessert", code: "CAFE-DESSERT", weight: 2 },
      { label: "20% off", code: "CAFE20", weight: 2 },
      { label: "Appetizer", code: "CAFE-APP", weight: 1 },
      { label: "Meal On Us", code: "CAFE-FREE", weight: 1 },
      { label: "Try Again", code: "CAFE-RETRY", weight: 2 },
      { label: "Free Drink", code: "CAFE-DRINK", weight: 2 },
    ],
  },
  saas: {
    name: "SaaS / Freemium",
    title: "Spin for a Plan Discount",
    subtitle: "One spin per new account",
    buttonText: "Spin Wheel",
    triggerText: "Spin for a Discount",
    glow: "rgba(129,140,248,0.22)",
    background: "linear-gradient(160deg, #06050c 0%, #100a1c 100%)",
    segments: [
      { label: "10% off", code: "SAAS10", weight: 3 },
      { label: "20% off", code: "SAAS20", weight: 2 },
      { label: "1 Mo Free", code: "SAAS-MONTH", weight: 2 },
      { label: "30% off", code: "SAAS30", weight: 2 },
      { label: "50% off", code: "SAAS50", weight: 1 },
      { label: "3 Mo Free", code: "SAAS-3MO", weight: 1 },
      { label: "Try Again", code: "SAAS-RETRY", weight: 2 },
      { label: "Pro Upgrade", code: "SAAS-PRO", weight: 1 },
    ],
  },
  event: {
    name: "Event / Tickets",
    title: "Spin for an Early Bird Deal",
    subtitle: "Before you check out",
    buttonText: "Spin for Bonus",
    triggerText: "Spin for a Bonus",
    glow: "rgba(45,212,191,0.20)",
    background: "linear-gradient(160deg, #04080a 0%, #081619 100%)",
    segments: [
      { label: "5% off", code: "EVT5", weight: 3 },
      { label: "10% off", code: "EVT10", weight: 3 },
      { label: "Drink Ticket", code: "EVT-DRINK", weight: 2 },
      { label: "15% off", code: "EVT15", weight: 2 },
      { label: "VIP Upgrade", code: "EVT-VIP", weight: 1 },
      { label: "Free +1", code: "EVT-PLUSONE", weight: 1 },
      { label: "Try Again", code: "EVT-RETRY", weight: 2 },
      { label: "Merch Pack", code: "EVT-MERCH", weight: 1 },
    ],
  },
};

function GiftIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className="relative">
      <rect x="3.5" y="10" width="17" height="9.5" rx="1.5" fill="rgba(255,255,255,0.9)" />
      <rect x="2.5" y="7" width="19" height="4" rx="1" fill="rgba(255,255,255,0.9)" />
      <rect x="10.4" y="7" width="3.2" height="12.5" fill="rgba(255,255,255,0.9)" />
      <path
        d="M12 7c-1.6 0-3-1-3.6-2.1C7.6 3.2 8.5 2 9.8 2c1.3 0 2.2 1.4 2.2 3 0-1.6.9-3 2.2-3 1.3 0 2.2 1.2 1.4 2.9C15 6 13.6 7 12 7z"
        fill="rgba(255,255,255,0.9)"
      />
    </svg>
  );
}

/** Pick a segment index using weighted random. */
function pickWeightedIndex(segments: WheelSegment[]): number {
  const weights = segments.map((s) => Math.max(0.01, s.weight ?? 1));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return segments.length - 1;
}

/**
 * Wheel segments are drawn with 0° at the TOP (pointer position). Segment i
 * occupies [i * slice, (i+1) * slice) going clockwise. When the wheel rotates
 * by `rotation` CSS degrees (clockwise positive), the segment under the top
 * pointer is index = floor(((360 - (rotation % 360)) % 360) / slice).
 */
function WheelFace({ segments, accentColor, size }: { segments: WheelSegment[]; accentColor: string; size: number }) {
  const n = segments.length;
  const slice = 360 / n;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const ink = "#ffffff";
  const inkSoft = "rgba(255,255,255,0.55)";
  const stroke = "rgba(255,255,255,0.1)";

  const polar = (deg: number, radius: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const wedgePath = (i: number) => {
    const start = i * slice;
    const end = (i + 1) * slice;
    const p1 = polar(start, r);
    const p2 = polar(end, r);
    const large = slice > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} Z`;
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block rounded-full">
      <circle cx={cx} cy={cy} r={r + 3} fill="#0a0a0f" stroke={accentColor} strokeWidth={3} opacity={0.95} />

      {segments.map((seg, i) => {
        const mid = i * slice + slice / 2;
        const labelPos = polar(mid, r * 0.62);
        const fill = seg.color || SEGMENT_PALETTE[i % SEGMENT_PALETTE.length];
        const textAngle = mid > 90 && mid < 270 ? mid + 180 : mid;

        return (
          <g key={i}>
            <path d={wedgePath(i)} fill={fill} stroke={stroke} strokeWidth={1} />
            <text
              x={labelPos.x}
              y={labelPos.y}
              fill={ink}
              fontSize={n > 8 ? 9 : 11}
              fontWeight={700}
              fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${textAngle}, ${labelPos.x}, ${labelPos.y})`}
              style={{ letterSpacing: "0.04em" }}
            >
              {seg.label.length > 12 ? seg.label.slice(0, 11) + "…" : seg.label}
            </text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={size * 0.09} fill="#0a0a0f" stroke={accentColor} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={size * 0.035} fill={accentColor} />

      {segments.map((_, i) => {
        const a = i * slice;
        const outer = polar(a, r - 2);
        const inner = polar(a, r - 10);
        return <line key={`tick-${i}`} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={inkSoft} strokeWidth={1.5} />;
      })}
    </svg>
  );
}

function Pointer({ accentColor }: { accentColor: string }) {
  return (
    <div className="absolute -top-1.5 left-1/2 z-[5] -translate-x-1/2" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.45))" }} aria-hidden="true">
      <svg width="28" height="36" viewBox="0 0 28 36">
        <path d="M14 34 L2 4 Q14 10 26 4 Z" fill={accentColor} stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
        <circle cx="14" cy="8" r="3.5" fill="#0a0a0f" />
      </svg>
    </div>
  );
}

export interface WheelSpinDiscountPopupProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  accentColor?: string;
  theme?: keyof typeof THEMES;
  asPopup?: boolean;
  /** Only used when asPopup is true — starts the popup open instead of showing the launcher widget. */
  defaultOpen?: boolean;
  trigger?: "manual" | "delay" | "scroll";
  delaySeconds?: number;
  widgetPosition?: "bottom-right" | "bottom-left";
  widgetIcon?: string;
  storageKey?: string;
  freeSpins?: number;
  spinDuration?: number;
}

/**
 * WheelSpinDiscountPopup — a gamified discount-capture widget: spin a
 * weighted prize wheel (SVG segments, "Try Again" outcomes stay eligible for
 * another spin) for a reward, with a themed reveal modal and code copy.
 * Renders inline, or as a corner-launched popup with manual/delay/scroll
 * triggers.
 */
export function WheelSpinDiscountPopup({
  className,
  accentColor = "#ffffff",
  theme = "ecommerce",
  asPopup = false,
  defaultOpen = false,
  trigger = "manual",
  delaySeconds = 4,
  widgetPosition = "bottom-right",
  widgetIcon,
  storageKey = "",
  freeSpins = 3,
  spinDuration = 4.2,
  ...props
}: WheelSpinDiscountPopupProps) {
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const popupCardRef = React.useRef<HTMLDivElement>(null);
  const rewardModalRef = React.useRef<HTMLDivElement>(null);
  const widgetTriggerRef = React.useRef<HTMLButtonElement>(null);
  const widgetContainerRef = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const spinTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const settleTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const copyTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [rotation, setRotation] = React.useState(0);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [currentReward, setCurrentReward] = React.useState<Reward | null>(null);
  const [showPopup, setShowPopup] = React.useState(false);
  const [rewards, setRewards] = React.useState<Reward[]>([]);
  const [spinsLeft, setSpinsLeft] = React.useState(freeSpins);
  const [message, setMessage] = React.useState(`You have ${freeSpins} free spins`);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [lastLabel, setLastLabel] = React.useState<string | null>(null);

  const [popupOpen, setPopupOpen] = React.useState(!asPopup || defaultOpen);
  const [scrollTriggered, setScrollTriggered] = React.useState(false);
  const [widgetHover, setWidgetHover] = React.useState(false);
  const [widgetVisible, setWidgetVisible] = React.useState(true);

  const activeTheme = THEMES[theme] || THEMES.ecommerce;
  const segments = activeTheme.segments;
  const duration = Math.max(2.2, Math.min(8, spinDuration));
  const wheelSize = 280;

  const mode = {
    ink: "#ffffff",
    inkSoft: "rgba(255,255,255,0.7)",
    inkMuted: "rgba(255,255,255,0.45)",
    inkFaint: "rgba(255,255,255,0.4)",
    divider: "rgba(255,255,255,0.3)",
    surface: "rgba(255,255,255,0.06)",
    surfaceBorder: "rgba(255,255,255,0.12)",
    cardBorder: "rgba(255,255,255,0.08)",
    overlayBg: "rgba(4,4,6,0.86)",
    modalBg: "rgba(255,255,255,0.06)",
    modalBorder: "rgba(255,255,255,0.16)",
    codeBoxBg: "rgba(255,255,255,0.04)",
    codeBoxBorder: "rgba(255,255,255,0.3)",
    chromeBg: "rgba(10,10,15,0.92)",
    chromeBorder: "rgba(255,255,255,0.16)",
    iconStroke: "rgba(255,255,255,0.6)",
    wheelGlow: "rgba(0,0,0,0.55)",
  };

  const suffix = storageKey.trim() ? `-${storageKey.trim()}` : "";
  const spinsKey = `spin-spins-left${suffix}`;
  const rewardsKey = `spin-rewards${suffix}`;

  React.useEffect(() => {
    const savedSpins = localStorage.getItem(spinsKey);
    const savedRewards = localStorage.getItem(rewardsKey);
    if (savedSpins !== null) setSpinsLeft(parseInt(savedSpins, 10));
    if (savedRewards) {
      try {
        setRewards(JSON.parse(savedRewards));
      } catch {
        setRewards([]);
      }
    }
    if (savedSpins === "0") setMessage("All spins used");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    return () => {
      clearTimeout(spinTimerRef.current);
      clearTimeout(settleTimerRef.current);
      clearTimeout(copyTimerRef.current);
    };
  }, []);

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
      { threshold: 0.4 }
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [asPopup, trigger, scrollTriggered]);

  React.useEffect(() => {
    if (!asPopup || !widgetContainerRef.current) return;
    const el = widgetContainerRef.current;
    const observer = new IntersectionObserver(([entry]) => setWidgetVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [asPopup]);

  const wasPopupOpenRef = React.useRef(false);
  React.useEffect(() => {
    if (!asPopup) return;
    if (popupOpen) {
      popupCardRef.current?.focus();
    } else if (wasPopupOpenRef.current) {
      widgetTriggerRef.current?.focus();
    }
    wasPopupOpenRef.current = popupOpen;
  }, [asPopup, popupOpen]);

  React.useEffect(() => {
    if (!showPopup) return;
    rewardModalRef.current?.focus();
  }, [showPopup]);

  /** Target CSS rotation so segment `index` lands under the top pointer. */
  const rotationForIndex = (index: number, current: number) => {
    const n = segments.length;
    const midAngle = index * (360 / n) + 360 / n / 2;
    const extraTurns = 4 + Math.floor(Math.random() * 3); // 4-6 extra full turns for drama
    const jitter = (Math.random() - 0.5) * (360 / n) * 0.55; // land off dead-center
    const targetMod = (360 - (midAngle + jitter) + 360) % 360;
    const base = Math.ceil(current / 360) * 360 + extraTurns * 360 + targetMod;
    return base <= current ? base + 360 : base;
  };

  const finishSpin = (index: number, nextSpinsLeft: number, nextRewards: Reward[]) => {
    const seg = segments[index];
    const won: Reward = { label: seg.label, code: seg.code };
    const isRetry = /retry|try again/i.test(seg.label);

    setCurrentReward(won);
    setLastLabel(seg.label);
    setIsSpinning(false);

    if (!isRetry) {
      setRewards(nextRewards);
      localStorage.setItem(rewardsKey, JSON.stringify(nextRewards));
    }

    setSpinsLeft(nextSpinsLeft);
    localStorage.setItem(spinsKey, nextSpinsLeft.toString());
    setMessage(nextSpinsLeft === 0 ? "All spins used" : `${nextSpinsLeft} spin${nextSpinsLeft > 1 ? "s" : ""} left`);
    settleTimerRef.current = setTimeout(() => setShowPopup(true), 450);
  };

  const spinWheel = () => {
    if (spinsLeft <= 0 || isSpinning) return;
    setIsSpinning(true);
    setShowPopup(false);
    setCurrentReward(null);
    setMessage("Spinning...");
    clearTimeout(spinTimerRef.current);
    clearTimeout(settleTimerRef.current);

    const index = pickWeightedIndex(segments);
    const nextRot = rotationForIndex(index, rotation);
    setRotation(nextRot);

    const nextSpinsLeft = spinsLeft - 1;
    const seg = segments[index];
    const isRetry = /retry|try again/i.test(seg.label);
    const nextRewards = isRetry ? rewards : [...rewards, { label: seg.label, code: seg.code }];

    spinTimerRef.current = setTimeout(() => {
      finishSpin(index, nextSpinsLeft, nextRewards);
    }, duration * 1000 + 80);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedCode(null), 1500);
  };

  const widgetOnRight = widgetPosition !== "bottom-left";

  const gameCard = (
    <div
      ref={cardRef}
      className="relative box-border flex w-full min-w-0 flex-col items-center justify-start overflow-hidden px-[26px] py-8 select-none"
      style={{
        background: activeTheme.background,
        border: `1px solid ${mode.cardBorder}`,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        ...(asPopup ? { height: "auto", minHeight: 0, maxHeight: "90vh", overflowY: "auto" } : {}),
      }}
    >
      <div className="relative z-[1] mb-[18px] text-center">
        <h2
          id={`${uid}-title`}
          className="m-0 text-[25px] font-normal leading-[1.15] tracking-[-0.02em]"
          style={{ color: mode.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {activeTheme.title}
        </h2>
        <div className="mx-auto my-3 h-px w-8" style={{ background: mode.divider }} />
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: mode.inkFaint }}>
          {activeTheme.subtitle}
        </div>
      </div>

      <div className="relative z-[1] mb-5 flex items-center justify-center pt-2.5">
        <div
          className="relative rounded-full"
          style={{ padding: 6, boxShadow: `0 0 0 1px ${mode.surfaceBorder}, 0 18px 40px ${mode.wheelGlow}, 0 0 60px ${activeTheme.glow}` }}
        >
          <Pointer accentColor={accentColor} />
          <motion.div
            animate={{ rotate: rotation }}
            transition={isSpinning ? { duration, ease: [0.12, 0.8, 0.08, 1] } : { duration: 0.4, ease: "easeOut" }}
            style={{ width: wheelSize, height: wheelSize, borderRadius: "50%", willChange: "transform" }}
          >
            <WheelFace segments={segments} accentColor={accentColor} size={wheelSize} />
          </motion.div>
        </div>
      </div>

      <div
        className="relative z-[1] mb-2.5 w-full max-w-[260px] rounded-[14px] px-4 py-3 text-center backdrop-blur-[8px]"
        style={{ background: mode.surface, border: `1px solid ${mode.surfaceBorder}` }}
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: mode.inkFaint }}>
          Result
        </div>
        <div className="font-normal" style={{ color: mode.ink, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, marginTop: 2 }} aria-live="polite">
          {lastLabel ?? "—"}
        </div>
      </div>

      <div className="relative z-[1] mb-[18px] text-center text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: mode.inkMuted }} aria-live="polite">
        {message}
      </div>

      <motion.button
        onClick={spinWheel}
        whileHover={{ scale: spinsLeft <= 0 || isSpinning ? 1 : 1.03 }}
        whileTap={{ scale: spinsLeft <= 0 || isSpinning ? 1 : 0.97 }}
        disabled={spinsLeft <= 0 || isSpinning}
        className="relative z-[1] mb-[26px] rounded-[40px] border-none px-[30px] py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0a0a0f]"
        style={{
          background: accentColor,
          opacity: spinsLeft <= 0 || isSpinning ? 0.4 : 1,
          cursor: spinsLeft <= 0 || isSpinning ? "not-allowed" : "pointer",
        }}
      >
        {isSpinning ? "Spinning..." : spinsLeft <= 0 ? "No Spins Left" : `${activeTheme.buttonText} · ${spinsLeft} left`}
      </motion.button>

      {rewards.length > 0 && (
        <div className="relative z-[1] mt-1.5 w-full max-w-[340px]">
          <div className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: mode.inkFaint }}>
            Your Rewards
          </div>
          <div className="flex flex-col gap-2">
            {rewards.map((r, i) => {
              const isCopied = copiedCode === r.code;
              return (
                <div
                  key={`${r.code}-${i}`}
                  className="flex items-center justify-between rounded-[12px] px-4 py-3 backdrop-blur-[8px]"
                  style={{ background: mode.surface, border: `1px solid ${mode.surfaceBorder}` }}
                >
                  <div>
                    <div className="text-sm font-semibold" style={{ color: mode.ink }}>
                      {r.label}
                    </div>
                    <div className="mt-0.5 text-[11px] font-semibold tracking-[0.06em]" style={{ color: mode.inkFaint }}>
                      {r.code}
                    </div>
                  </div>
                  <button
                    onClick={() => copyCode(r.code)}
                    className="flex items-center justify-center rounded-[8px] border-none bg-transparent p-1.5"
                    title="Copy code"
                    aria-label="Copy code"
                  >
                    {isCopied ? (
                      <span style={{ color: mode.ink, fontSize: 14, fontWeight: 700 }}>✓</span>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={mode.iconStroke} strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showPopup && currentReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[6px]"
            style={{ background: mode.overlayBg }}
          >
            <motion.div
              ref={rewardModalRef}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${uid}-reward-title`}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowPopup(false);
              }}
              className="w-full max-w-[300px] px-[26px] py-[30px] text-center backdrop-blur-[20px]"
              style={{ background: mode.modalBg, border: `1px solid ${mode.modalBorder}`, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
            >
              <motion.h3
                id={`${uid}-reward-title`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="m-0 text-2xl font-normal"
                style={{ color: mode.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {/retry|try again/i.test(currentReward.label) ? "Almost!" : "You won"}
              </motion.h3>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="mx-auto my-3 mb-3.5 h-px w-7 origin-center"
                style={{ background: mode.divider }}
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="m-0 mb-[18px] text-[15px]"
                style={{ color: mode.inkSoft }}
              >
                {currentReward.label}
              </motion.p>
              {!/retry|try again/i.test(currentReward.label) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="mb-5 rounded-[10px] border border-dashed p-3"
                  style={{ background: mode.codeBoxBg, borderColor: mode.codeBoxBorder }}
                >
                  <span className="text-base font-bold tracking-[0.06em]" style={{ color: mode.ink }}>
                    {currentReward.code}
                  </span>
                </motion.div>
              )}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                onClick={() => setShowPopup(false)}
                className="w-full cursor-pointer rounded-[40px] border-none px-[13px] py-[13px] text-xs font-bold uppercase tracking-[0.1em] text-[#0a0a0f]"
                style={{ background: accentColor }}
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (!asPopup) {
    return (
      <div ref={rootRef} className={cn("w-full", className)} {...props}>
        {gameCard}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("relative", className)} {...props}>
      <div
        ref={widgetContainerRef}
        className="fixed bottom-6 z-[9998] flex items-center gap-2.5"
        style={{ flexDirection: widgetOnRight ? "row-reverse" : "row", ...(widgetOnRight ? { right: 24 } : { left: 24 }) }}
      >
        <motion.button
          ref={widgetTriggerRef}
          onClick={() => setPopupOpen(true)}
          onHoverStart={() => setWidgetHover(true)}
          onHoverEnd={() => setWidgetHover(false)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label={activeTheme.triggerText}
          className="relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full backdrop-blur-[10px]"
          style={{ background: mode.chromeBg, border: `1px solid ${mode.chromeBorder}`, boxShadow: `0 8px 28px ${activeTheme.glow}, 0 4px 14px rgba(0,0,0,0.5)` }}
        >
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ background: "rgba(255,255,255,0.7)" }}
            animate={!widgetVisible ? undefined : { scale: [1, 1.7, 1.7], opacity: [0.4, 0, 0] }}
            transition={!widgetVisible ? { duration: 0 } : { duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
          {widgetIcon ? <img src={widgetIcon} alt="" className="relative h-7 w-7 rounded-full object-cover" /> : <GiftIcon />}
        </motion.button>

        <AnimatePresence>
          {widgetHover && (
            <motion.div
              initial={{ opacity: 0, x: widgetOnRight ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: widgetOnRight ? 10 : -10 }}
              transition={{ duration: 0.18 }}
              className="whitespace-nowrap rounded-[10px] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] backdrop-blur-[10px]"
              style={{ background: mode.chromeBg, border: `1px solid ${mode.chromeBorder}`, color: mode.ink }}
            >
              {activeTheme.triggerText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {popupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-5 backdrop-blur-[4px]"
            style={{ background: "rgba(0,0,0,0.7)" }}
          >
            <motion.div
              ref={popupCardRef}
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
                className="absolute -right-3.5 -top-3.5 z-[100] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-0 text-[17px] leading-[30px]"
                style={{ background: mode.chromeBg, border: `1px solid ${mode.chromeBorder}`, color: mode.ink, boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }}
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

export default WheelSpinDiscountPopup;
