"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RewardTier {
  max: number;
  label: string;
  code: string;
}

interface Reward {
  label: string;
  code: string;
}

interface ThemeConfig {
  name: string;
  title: string;
  subtitle: string;
  buttonText: string;
  triggerText: string;
  glow: string;
  background: string;
  rewards: RewardTier[];
  doublesReward: Reward;
}

const THEMES: Record<string, ThemeConfig> = {
  ecommerce: {
    name: "E-Commerce",
    title: "Roll for a Discount",
    subtitle: "3 free rolls, real savings",
    buttonText: "Roll Dice",
    triggerText: "Roll for a Discount",
    glow: "rgba(255,255,255,0.16)",
    background: "linear-gradient(160deg, #07080b 0%, #101319 100%)",
    rewards: [
      { max: 4, label: "5% off", code: "DICE5" },
      { max: 6, label: "10% off", code: "DICE10" },
      { max: 8, label: "15% off", code: "DICE15" },
      { max: 10, label: "20% off", code: "DICE20" },
      { max: 12, label: "25% off", code: "DICE25" },
    ],
    doublesReward: { label: "Free Shipping", code: "DOUBLES" },
  },
  campaign: {
    name: "Campaign / Sale",
    title: "Roll Before It's Gone",
    subtitle: "Limited-time drop, roll now",
    buttonText: "Roll for Deal",
    triggerText: "Roll for a Deal",
    glow: "rgba(248,113,113,0.22)",
    background: "linear-gradient(160deg, #0c0505 0%, #1a0808 100%)",
    rewards: [
      { max: 4, label: "10% off", code: "SALE10" },
      { max: 6, label: "20% off", code: "SALE20" },
      { max: 8, label: "30% off", code: "SALE30" },
      { max: 10, label: "40% off", code: "SALE40" },
      { max: 12, label: "50% off", code: "SALE50" },
    ],
    doublesReward: { label: "Stack Extra 10%", code: "SALEDOUBLE" },
  },
  saas: {
    name: "SaaS / Freemium",
    title: "Roll for a Plan Discount",
    subtitle: "One roll per new account",
    buttonText: "Roll Dice",
    triggerText: "Roll for a Discount",
    glow: "rgba(129,140,248,0.22)",
    background: "linear-gradient(160deg, #06050c 0%, #100a1c 100%)",
    rewards: [
      { max: 4, label: "10% off", code: "SAAS10" },
      { max: 6, label: "20% off", code: "SAAS20" },
      { max: 8, label: "1 Month Free", code: "SAAS-MONTH" },
      { max: 10, label: "30% off", code: "SAAS30" },
      { max: 12, label: "50% off", code: "SAAS50" },
    ],
    doublesReward: { label: "3 Months Free", code: "SAAS-3MO" },
  },
};

const faceRotations: Record<number, { rotateX: number; rotateY: number }> = {
  1: { rotateX: 0, rotateY: 0 },
  2: { rotateX: 0, rotateY: 180 },
  3: { rotateX: 0, rotateY: -90 },
  4: { rotateX: 0, rotateY: 90 },
  5: { rotateX: -90, rotateY: 0 },
  6: { rotateX: 90, rotateY: 0 },
};

const PIP_LAYOUTS: Record<number, number[]> = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};

function Pips({ number }: { number: number }) {
  const active = PIP_LAYOUTS[number] || [];
  return (
    <div className="grid h-[65%] w-[65%] grid-cols-3 grid-rows-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {active.includes(i + 1) && (
            <div
              className="h-[11px] w-[11px] rounded-full"
              style={{ background: "radial-gradient(circle at 32% 28%, #4b4b52 0%, #16161a 55%, #000000 100%)", boxShadow: "inset 0 1px 1.5px rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.5)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function GiftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dice-gift-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe27a" />
          <stop offset="45%" stopColor="#ffc93c" />
          <stop offset="100%" stopColor="#e6a600" />
        </linearGradient>
      </defs>
      <rect x="3.5" y="10" width="17" height="9.5" rx="1.5" fill="url(#dice-gift-gold)" />
      <rect x="2.5" y="7" width="19" height="4" rx="1" fill="url(#dice-gift-gold)" />
      <rect x="10.4" y="7" width="3.2" height="12.5" fill="#fffceb" />
      <path d="M12 7c-1.6 0-3-1-3.6-2.1C7.6 3.2 8.5 2 9.8 2c1.3 0 2.2 1.4 2.2 3 0-1.6.9-3 2.2-3 1.3 0 2.2 1.2 1.4 2.9C15 6 13.6 7 12 7z" fill="#fffceb" />
    </svg>
  );
}

const DICE_FACES = [
  { face: 1, transform: "rotateY(0deg) translateZ(42px) scale(1.08)" },
  { face: 2, transform: "rotateY(180deg) translateZ(42px) scale(1.08)" },
  { face: 3, transform: "rotateY(90deg) translateZ(42px) scale(1.08)" },
  { face: 4, transform: "rotateY(-90deg) translateZ(42px) scale(1.08)" },
  { face: 5, transform: "rotateX(90deg) translateZ(42px) scale(1.08)" },
  { face: 6, transform: "rotateX(-90deg) translateZ(42px) scale(1.08)" },
];

function Dice3D({ value, delay = 0, isRolling }: { value: number; delay?: number; isRolling: boolean }) {
  const final = faceRotations[value];
  return (
    <div style={{ width: 84, height: 84, perspective: 700 }}>
      <motion.div
        animate={
          isRolling
            ? { rotateX: [0, 480, 960, 1440, final.rotateX], rotateY: [0, -360, 720, -1080, final.rotateY], rotateZ: [0, 180, 360, 540, 0], y: [0, -45, -10, 6, 0] }
            : { rotateX: final.rotateX, rotateY: final.rotateY, rotateZ: 0, y: 0 }
        }
        transition={isRolling ? { duration: 1.7, ease: [0.22, 0.8, 0.2, 1], delay } : { duration: 0.45, ease: "easeOut", delay: delay * 0.5 }}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {DICE_FACES.map((item) => (
          <div
            key={item.face}
            className="absolute flex h-[84px] w-[84px] items-center justify-center rounded-[9px] border border-black/5"
            style={{
              background: "linear-gradient(150deg, #ffffff 0%, #f4f5f7 55%, #e3e5e9 100%)",
              backfaceVisibility: "hidden",
              transform: item.transform,
              boxShadow: "inset 0 1.5px 2px rgba(255,255,255,0.9), inset 0 -4px 8px rgba(0,0,0,0.08), 0 10px 22px rgba(0,0,0,0.35)",
            }}
          >
            <Pips number={item.face} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export interface DiceDiscountPopupProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  accentColor?: string;
  theme?: "ecommerce" | "campaign" | "saas";
  asPopup?: boolean;
  trigger?: "manual" | "delay" | "scroll";
  delaySeconds?: number;
  widgetPosition?: "bottom-right" | "bottom-left";
  /** Namespaces the free-rolls/rewards persisted in localStorage — only needed if you place more than one instance on the same page. */
  storageKey?: string;
}

export function DiceDiscountPopup({
  accentColor = "#ffffff",
  theme = "ecommerce",
  asPopup = false,
  trigger = "manual",
  delaySeconds = 4,
  widgetPosition = "bottom-right",
  storageKey = "",
  className,
  style,
  ...props
}: DiceDiscountPopupProps) {
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const popupCardRef = React.useRef<HTMLDivElement>(null);
  const rewardModalRef = React.useRef<HTMLDivElement>(null);
  const widgetTriggerRef = React.useRef<HTMLButtonElement>(null);
  const rollTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const settleTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const copyTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [dice1, setDice1] = React.useState(1);
  const [dice2, setDice2] = React.useState(1);
  const [isRolling, setIsRolling] = React.useState(false);
  const [total, setTotal] = React.useState<number | null>(null);
  const [currentReward, setCurrentReward] = React.useState<Reward | null>(null);
  const [showReward, setShowReward] = React.useState(false);
  const [rewards, setRewards] = React.useState<Reward[]>([]);
  const [rollsLeft, setRollsLeft] = React.useState(3);
  const [message, setMessage] = React.useState("You have 3 free rolls");
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [popupOpen, setPopupOpen] = React.useState(!asPopup);
  const [scrollTriggered, setScrollTriggered] = React.useState(false);

  const activeTheme = THEMES[theme] || THEMES.ecommerce;
  const widgetGlowStrong = activeTheme.glow.replace(/,\s*[\d.]+\)$/, ", 0.85)");

  const suffix = storageKey.trim() ? `-${storageKey.trim()}` : "";
  const rollsKey = `dice-rolls-left${suffix}`;
  const rewardsKey = `dice-rewards${suffix}`;

  // Persist rolls-left/rewards across reloads so refreshing the page can't
  // be used to farm unlimited free rolls.
  React.useEffect(() => {
    const savedRolls = localStorage.getItem(rollsKey);
    const savedRewards = localStorage.getItem(rewardsKey);
    // Restored after mount on purpose: reading storage during render would not match the
    // server-rendered HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedRolls !== null) setRollsLeft(parseInt(savedRolls, 10));
    if (savedRewards) {
      try {
        setRewards(JSON.parse(savedRewards));
      } catch {
        setRewards([]);
      }
    }
    if (savedRolls === "0") setMessage("All rolls used");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => () => {
    clearTimeout(rollTimerRef.current);
    clearTimeout(settleTimerRef.current);
    clearTimeout(copyTimerRef.current);
  }, []);

  // Move focus into the popup dialog when it opens, and back to the widget
  // trigger when it closes — keyboard/screen-reader users shouldn't be left
  // behind on a background page they can't see. Skips the first render so
  // mounting doesn't steal focus.
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

  // Same for the "You won" reward dialog
  React.useEffect(() => {
    if (!showReward) return;
    rewardModalRef.current?.focus();
  }, [showReward]);

  // Follow asPopup changes during render instead of in an effect (no extra render pass).
  const [prevAsPopup, setPrevAsPopup] = React.useState(asPopup);
  if (asPopup !== prevAsPopup) {
    setPrevAsPopup(asPopup);
    setPopupOpen(!asPopup);
  }

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

  const getReward = (sum: number, isDoubles: boolean): Reward => {
    if (isDoubles) return activeTheme.doublesReward;
    const tier = activeTheme.rewards.find((t) => sum <= t.max);
    return tier || activeTheme.rewards[activeTheme.rewards.length - 1];
  };

  const rollDice = () => {
    if (rollsLeft <= 0 || isRolling) return;
    setIsRolling(true);
    setTotal(null);
    setMessage("Rolling...");
    clearTimeout(rollTimerRef.current);
    clearTimeout(settleTimerRef.current);

    rollTimerRef.current = setTimeout(() => {
      const side1 = Math.floor(Math.random() * 6) + 1;
      const side2 = Math.floor(Math.random() * 6) + 1;
      const sum = side1 + side2;
      const won = getReward(sum, side1 === side2);

      setDice1(side1);
      setDice2(side2);
      setTotal(sum);
      setCurrentReward(won);
      setIsRolling(false);

      const newRewards = [...rewards, won];
      const newRollsLeft = rollsLeft - 1;
      setRewards(newRewards);
      setRollsLeft(newRollsLeft);
      localStorage.setItem(rewardsKey, JSON.stringify(newRewards));
      localStorage.setItem(rollsKey, newRollsLeft.toString());
      setMessage(newRollsLeft === 0 ? "All rolls used" : `${newRollsLeft} roll${newRollsLeft > 1 ? "s" : ""} left`);
      settleTimerRef.current = setTimeout(() => setShowReward(true), 600);
    }, 1800);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedCode(null), 1500);
  };

  const gameCard = (
    <div
      className="relative flex w-full flex-col items-center overflow-hidden rounded-[22px] border border-white/8 px-6.5 py-8"
      style={{ background: activeTheme.background, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="relative z-10 mb-5.5 text-center">
        <h2 id={`${uid}-title`} className="m-0 text-[25px] leading-[1.15] font-normal tracking-tight text-white" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
          {activeTheme.title}
        </h2>
        <div className="mx-auto my-3 h-px w-8 bg-white/30" />
        <div className="text-[10px] font-semibold tracking-[0.18em] text-white/40 uppercase">{activeTheme.subtitle}</div>
      </div>

      <div className="relative z-10 mb-5.5 flex justify-center gap-6" style={{ perspective: 800 }} aria-hidden="true">
        <Dice3D value={dice1} delay={0} isRolling={isRolling} />
        <Dice3D value={dice2} delay={0.1} isRolling={isRolling} />
      </div>

      <div className="relative z-10 mb-2.5 w-full max-w-[260px] rounded-[14px] border border-white/12 bg-white/6 px-4 py-3 text-center backdrop-blur-md">
        <div className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Result</div>
        <div className="text-[34px] font-normal text-white" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} aria-live="polite">
          {total !== null ? total : "-"}
        </div>
      </div>

      <div className="relative z-10 mb-4.5 text-center text-xs font-semibold tracking-wide text-white/45 uppercase" aria-live="polite">
        {message}
      </div>

      <motion.button
        onClick={rollDice}
        whileHover={{ scale: rollsLeft <= 0 || isRolling ? 1 : 1.03 }}
        whileTap={{ scale: rollsLeft <= 0 || isRolling ? 1 : 0.97 }}
        disabled={rollsLeft <= 0 || isRolling}
        className="relative z-10 mb-6.5 rounded-full px-7.5 py-3.5 text-xs font-bold tracking-[0.1em] text-[#0a0a0f] uppercase disabled:cursor-not-allowed"
        style={{ background: accentColor, opacity: rollsLeft <= 0 || isRolling ? 0.4 : 1 }}
      >
        {isRolling ? "Rolling..." : rollsLeft <= 0 ? "No Rolls Left" : `${activeTheme.buttonText} · ${rollsLeft} left`}
      </motion.button>

      {rewards.length > 0 && (
        <div className="relative z-10 mt-1.5 w-full max-w-[340px]">
          <div className="mb-3 text-center text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Your Rewards</div>
          <div className="flex flex-col gap-2">
            {rewards.map((r, i) => {
              const isCopied = copiedCode === r.code;
              return (
                <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/6 px-4 py-3 backdrop-blur-md">
                  <div>
                    <div className="text-sm font-semibold text-white">{r.label}</div>
                    <div className="mt-0.5 text-[11px] font-semibold tracking-wide text-white/45">{r.code}</div>
                  </div>
                  <button onClick={() => copyCode(r.code)} className="flex items-center justify-center rounded-lg p-1.5" title="Copy code" aria-label="Copy code">
                    {isCopied ? (
                      <span className="text-sm font-bold text-white">✓</span>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
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
        {showReward && currentReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="absolute inset-0 z-50 flex items-center justify-center rounded-[22px] p-4"
            style={{ background: "rgba(4,4,6,0.86)", backdropFilter: "blur(6px)" }}
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
                if (e.key === "Escape") setShowReward(false);
              }}
              className="w-full max-w-[300px] rounded-[18px] border border-white/16 bg-white/6 px-6.5 py-7.5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
            >
              <motion.h3
                id={`${uid}-reward-title`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="m-0 text-2xl font-normal text-white"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                You won
              </motion.h3>
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.25, duration: 0.4 }} className="mx-auto my-3.5 h-px w-7 bg-white/30" style={{ transformOrigin: "center" }} />
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="mb-4.5 text-[15px] text-white/70">
                {currentReward.label}
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }} className="mb-5 rounded-[10px] border border-dashed border-white/30 bg-white/4 p-3">
                <span className="text-base font-bold tracking-wide text-white">{currentReward.code}</span>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                onClick={() => setShowReward(false)}
                className="w-full cursor-pointer rounded-full py-3.5 text-xs font-bold tracking-[0.1em] text-[#0a0a0f] uppercase"
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
      <div ref={rootRef} className={className} style={style} {...props}>
        {gameCard}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={className} style={style} {...props}>
      <div className={cn("fixed bottom-6 z-[9998] flex items-center", widgetPosition === "bottom-left" ? "left-6" : "right-6")}>
        <motion.button
          ref={widgetTriggerRef}
          onClick={() => setPopupOpen(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          aria-label={activeTheme.triggerText}
          // Keep the icon nearest whichever screen edge the widget is
          // anchored to, with the label extending back toward the page.
          className={cn(
            "flex h-14 items-center gap-3 rounded-full border border-black/8 bg-white py-1.5 backdrop-blur-md",
            widgetPosition === "bottom-left" ? "flex-row-reverse pr-1.5 pl-5" : "pr-5 pl-1.5",
          )}
          style={{ boxShadow: `0 8px 30px ${activeTheme.glow}, 0 4px 16px rgba(0,0,0,0.4)`, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#121212]">
            <GiftIcon />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold tracking-[0.1em] whitespace-nowrap text-black/40 uppercase">{activeTheme.triggerText}</span>
            <motion.span
              className="text-[13px] font-bold tracking-wide whitespace-nowrap text-[#171a21] uppercase"
              animate={{ textShadow: [`0 0 3px ${widgetGlowStrong}`, `0 0 10px ${widgetGlowStrong}`, `0 0 3px ${widgetGlowStrong}`] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Win a Prize
            </motion.span>
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
                className="absolute -top-3.5 -right-3.5 z-[100] flex h-8 w-8 items-center justify-center rounded-full border border-white/16 text-[17px] text-white shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                style={{ background: "rgba(10,10,15,0.95)" }}
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
