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
  lightBackground: string;
  rewards: RewardTier[];
  doublesReward: Reward;
}

const THEMES: { [key: string]: ThemeConfig } = {
  ecommerce: {
    name: "E-Commerce",
    title: "Roll for a Discount",
    subtitle: "3 free rolls, real savings",
    buttonText: "Roll Dice",
    triggerText: "Roll for a Discount",
    glow: "rgba(255,255,255,0.16)",
    background: "linear-gradient(160deg, #07080b 0%, #101319 100%)",
    lightBackground: "linear-gradient(160deg, #f4f6fa 0%, #dfe6f0 100%)",
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
    lightBackground: "linear-gradient(160deg, #fff1f0 0%, #fecdd3 100%)",
    rewards: [
      { max: 4, label: "10% off", code: "SALE10" },
      { max: 6, label: "20% off", code: "SALE20" },
      { max: 8, label: "30% off", code: "SALE30" },
      { max: 10, label: "40% off", code: "SALE40" },
      { max: 12, label: "50% off", code: "SALE50" },
    ],
    doublesReward: { label: "Stack Extra 10%", code: "SALEDOUBLE" },
  },
  restaurant: {
    name: "Restaurant / Cafe",
    title: "Today's Lucky Roll",
    subtitle: "Scan, roll, treat yourself",
    buttonText: "Roll for Treat",
    triggerText: "Roll for a Treat",
    glow: "rgba(251,191,36,0.20)",
    background: "linear-gradient(160deg, #0c0904 0%, #1a1206 100%)",
    lightBackground: "linear-gradient(160deg, #fff7ed 0%, #fde8cf 100%)",
    rewards: [
      { max: 4, label: "Free Coffee", code: "CAFE-COFFEE" },
      { max: 6, label: "10% off Bill", code: "CAFE10" },
      { max: 8, label: "Free Dessert", code: "CAFE-DESSERT" },
      { max: 10, label: "20% off Bill", code: "CAFE20" },
      { max: 12, label: "Free Appetizer", code: "CAFE-APP" },
    ],
    doublesReward: { label: "Meal On Us", code: "CAFE-FREE" },
  },
  saas: {
    name: "SaaS / Freemium",
    title: "Roll for a Plan Discount",
    subtitle: "One roll per new account",
    buttonText: "Roll Dice",
    triggerText: "Roll for a Discount",
    glow: "rgba(129,140,248,0.22)",
    background: "linear-gradient(160deg, #06050c 0%, #100a1c 100%)",
    lightBackground: "linear-gradient(160deg, #eef2ff 0%, #e0e7ff 100%)",
    rewards: [
      { max: 4, label: "10% off", code: "SAAS10" },
      { max: 6, label: "20% off", code: "SAAS20" },
      { max: 8, label: "1 Month Free", code: "SAAS-MONTH" },
      { max: 10, label: "30% off", code: "SAAS30" },
      { max: 12, label: "50% off", code: "SAAS50" },
    ],
    doublesReward: { label: "3 Months Free", code: "SAAS-3MO" },
  },
  event: {
    name: "Event / Tickets",
    title: "Roll for an Early Bird Deal",
    subtitle: "Before you check out",
    buttonText: "Roll for Bonus",
    triggerText: "Roll for a Bonus",
    glow: "rgba(45,212,191,0.20)",
    background: "linear-gradient(160deg, #04080a 0%, #081619 100%)",
    lightBackground: "linear-gradient(160deg, #ecfeff 0%, #cffafe 100%)",
    rewards: [
      { max: 4, label: "5% off", code: "EVT5" },
      { max: 6, label: "10% off", code: "EVT10" },
      { max: 8, label: "Free Drink Ticket", code: "EVT-DRINK" },
      { max: 10, label: "15% off", code: "EVT15" },
      { max: 12, label: "VIP Upgrade", code: "EVT-VIP" },
    ],
    doublesReward: { label: "Free +1 Ticket", code: "EVT-PLUSONE" },
  },
};

const faceRotations: { [key: number]: { rotateX: number; rotateY: number } } = {
  1: { rotateX: 0, rotateY: 0 },
  2: { rotateX: 0, rotateY: 180 },
  3: { rotateX: 0, rotateY: -90 },
  4: { rotateX: 0, rotateY: 90 },
  5: { rotateX: -90, rotateY: 0 },
  6: { rotateX: 90, rotateY: 0 },
};

const PIP_LAYOUTS: { [key: number]: number[] } = {
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
              style={{
                background: "radial-gradient(circle at 32% 28%, #4b4b52 0%, #16161a 55%, #000000 100%)",
                boxShadow: "inset 0 1px 1.5px rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.5)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function GiftIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className="relative">
      <rect x="3.5" y="10" width="17" height="9.5" rx="1.5" fill="#0a0a0f" />
      <rect x="2.5" y="7" width="19" height="4" rx="1" fill="#0a0a0f" />
      <rect x="10.4" y="7" width="3.2" height="12.5" fill="rgba(255,255,255,0.9)" />
      <path
        d="M12 7c-1.6 0-3-1-3.6-2.1C7.6 3.2 8.5 2 9.8 2c1.3 0 2.2 1.4 2.2 3 0-1.6.9-3 2.2-3 1.3 0 2.2 1.2 1.4 2.9C15 6 13.6 7 12 7z"
        fill="rgba(255,255,255,0.9)"
      />
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
            ? {
                rotateX: [0, 480, 960, 1440, final.rotateX],
                rotateY: [0, -360, 720, -1080, final.rotateY],
                rotateZ: [0, 180, 360, 540, 0],
                y: [0, -45, -10, 6, 0],
              }
            : { rotateX: final.rotateX, rotateY: final.rotateY, rotateZ: 0, y: 0 }
        }
        transition={isRolling ? { duration: 1.7, ease: [0.22, 0.8, 0.2, 1], delay } : { duration: 0.45, ease: "easeOut", delay: delay * 0.5 }}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {DICE_FACES.map((item) => (
          <div
            key={item.face}
            className="absolute flex items-center justify-center rounded-[9px] border border-black/5"
            style={{
              width: 84,
              height: 84,
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

export interface DiceRollDiscountPopupProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  accentColor?: string;
  theme?: keyof typeof THEMES;
  lightMode?: boolean;
  asPopup?: boolean;
  /** Only used when asPopup is true — starts the popup open instead of showing the launcher widget. */
  defaultOpen?: boolean;
  trigger?: "manual" | "delay" | "scroll";
  delaySeconds?: number;
  widgetPosition?: "bottom-right" | "bottom-left";
  widgetIcon?: string;
  freeRolls?: number;
  storageKey?: string;
}

/**
 * DiceRollDiscountPopup — a gamified discount-capture widget: roll two dice
 * (3D, CSS-transform based) for a reward tier, with a themed reward reveal
 * modal and code copy. Renders inline, or as a corner-launched popup with
 * manual / delay / scroll-into-view triggers.
 */
export function DiceRollDiscountPopup({
  className,
  accentColor = "#ffffff",
  theme = "ecommerce",
  lightMode = false,
  asPopup = false,
  defaultOpen = false,
  trigger = "manual",
  delaySeconds = 4,
  widgetPosition = "bottom-right",
  widgetIcon,
  freeRolls = 3,
  storageKey = "",
  ...props
}: DiceRollDiscountPopupProps) {
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const popupCardRef = React.useRef<HTMLDivElement>(null);
  const rewardModalRef = React.useRef<HTMLDivElement>(null);
  const widgetTriggerRef = React.useRef<HTMLButtonElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const rollTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const settleTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const copyTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [dice1, setDice1] = React.useState(1);
  const [dice2, setDice2] = React.useState(1);
  const [isRolling, setIsRolling] = React.useState(false);
  const [total, setTotal] = React.useState<number | null>(null);
  const [currentReward, setCurrentReward] = React.useState<Reward | null>(null);
  const [showPopup, setShowPopup] = React.useState(false);
  const [rewards, setRewards] = React.useState<Reward[]>([]);
  const [rollsLeft, setRollsLeft] = React.useState(freeRolls);
  const [message, setMessage] = React.useState(`You have ${freeRolls} free roll${freeRolls === 1 ? "" : "s"}`);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const [popupOpen, setPopupOpen] = React.useState(!asPopup || defaultOpen);
  const [scrollTriggered, setScrollTriggered] = React.useState(false);
  const [widgetHover, setWidgetHover] = React.useState(false);
  const [widgetVisible, setWidgetVisible] = React.useState(true);

  const activeTheme = THEMES[theme] || THEMES.ecommerce;
  const widgetContainerRef = React.useRef<HTMLDivElement>(null);

  const mode = lightMode
    ? {
        ink: "#171a21",
        inkSoft: "rgba(23,26,33,0.7)",
        inkMuted: "rgba(23,26,33,0.5)",
        inkFaint: "rgba(23,26,33,0.4)",
        divider: "rgba(23,26,33,0.18)",
        surface: "rgba(255,255,255,0.65)",
        surfaceBorder: "rgba(23,26,33,0.1)",
        cardBorder: "rgba(23,26,33,0.08)",
        overlayBg: "rgba(255,255,255,0.9)",
        modalBg: "rgba(255,255,255,0.75)",
        modalBorder: "rgba(23,26,33,0.12)",
        codeBoxBg: "rgba(23,26,33,0.03)",
        codeBoxBorder: "rgba(23,26,33,0.25)",
        chromeBg: "#ffffff",
        chromeBorder: "rgba(23,26,33,0.1)",
        iconStroke: "rgba(23,26,33,0.55)",
      }
    : {
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
      };

  const suffix = storageKey.trim() ? `-${storageKey.trim()}` : "";
  const rollsKey = `dice-rolls-left${suffix}`;
  const rewardsKey = `dice-rewards${suffix}`;

  React.useEffect(() => {
    const savedRolls = localStorage.getItem(rollsKey);
    const savedRewards = localStorage.getItem(rewardsKey);
    if (savedRolls !== null) setRollsLeft(parseInt(savedRolls, 10));
    if (savedRewards) setRewards(JSON.parse(savedRewards));
    if (savedRolls === "0") setMessage("All rolls used");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    return () => {
      clearTimeout(rollTimerRef.current);
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

  const getReward = React.useCallback(
    (sum: number, isDoubles: boolean): Reward => {
      if (isDoubles) return activeTheme.doublesReward;
      const tier = activeTheme.rewards.find((t) => sum <= t.max);
      return tier || activeTheme.rewards[activeTheme.rewards.length - 1];
    },
    [activeTheme]
  );

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
      const isDoubles = side1 === side2;
      const won = getReward(sum, isDoubles);

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

      settleTimerRef.current = setTimeout(() => setShowPopup(true), 600);
    }, 1800);
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
      className="relative box-border flex w-full min-w-0 flex-col items-center justify-start overflow-hidden rounded-[22px] px-[26px] py-8 font-sans select-none"
      style={{
        background: lightMode ? activeTheme.lightBackground : activeTheme.background,
        border: `1px solid ${mode.cardBorder}`,
        ...(asPopup ? { height: "auto", minHeight: 0, maxHeight: "90vh", overflowY: "auto" } : {}),
      }}
    >
      <div className="relative z-[1] mb-[22px] text-center">
        <h2 id={`${uid}-title`} className="m-0 font-serif text-[25px] font-normal leading-[1.15] tracking-[-0.02em]" style={{ color: mode.ink }}>
          {activeTheme.title}
        </h2>
        <div className="mx-auto my-3 h-px w-8" style={{ background: mode.divider }} />
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: mode.inkFaint }}>
          {activeTheme.subtitle}
        </div>
      </div>

      <div className="relative z-[1] mb-[22px] flex justify-center gap-6" style={{ perspective: 800 }} aria-hidden="true">
        <Dice3D value={dice1} delay={0} isRolling={isRolling} />
        <Dice3D value={dice2} delay={0.1} isRolling={isRolling} />
      </div>

      <div
        className="relative z-[1] mb-2.5 w-full max-w-[260px] rounded-[14px] px-4 py-3 text-center backdrop-blur-[8px]"
        style={{ background: mode.surface, border: `1px solid ${mode.surfaceBorder}` }}
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: mode.inkFaint }}>
          Result
        </div>
        <div className="font-serif text-[34px] font-normal" style={{ color: mode.ink }} aria-live="polite">
          {total !== null ? total : "—"}
        </div>
      </div>

      <div className="relative z-[1] mb-[18px] text-center text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: mode.inkMuted }} aria-live="polite">
        {message}
      </div>

      <motion.button
        onClick={rollDice}
        whileHover={{ scale: rollsLeft <= 0 || isRolling ? 1 : 1.03 }}
        whileTap={{ scale: rollsLeft <= 0 || isRolling ? 1 : 0.97 }}
        disabled={rollsLeft <= 0 || isRolling}
        className="relative z-[1] mb-[26px] rounded-[40px] border-none px-[30px] py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-[#0a0a0f]"
        style={{
          background: accentColor,
          opacity: rollsLeft <= 0 || isRolling ? 0.4 : 1,
          cursor: rollsLeft <= 0 || isRolling ? "not-allowed" : "pointer",
        }}
      >
        {isRolling ? "Rolling..." : rollsLeft <= 0 ? "No Rolls Left" : `${activeTheme.buttonText} · ${rollsLeft} left`}
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
                  key={i}
                  className="flex items-center justify-between rounded-xl px-4 py-3 backdrop-blur-[8px]"
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
                    className="flex items-center justify-center rounded-lg border-none bg-transparent p-1.5"
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
            className="absolute inset-0 z-50 flex items-center justify-center rounded-[22px] p-4 backdrop-blur-[6px]"
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
              className="w-full max-w-[300px] rounded-[18px] px-[26px] py-[30px] text-center backdrop-blur-[20px]"
              style={{ background: mode.modalBg, border: `1px solid ${mode.modalBorder}`, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
            >
              <motion.h3
                id={`${uid}-reward-title`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="m-0 font-serif text-2xl font-normal"
                style={{ color: mode.ink }}
              >
                You won
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
        className="absolute bottom-6 z-[30] flex items-center gap-2.5"
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
          {widgetIcon ? (
            <img src={widgetIcon} alt="" className="relative h-7 w-7 rounded-full object-cover" />
          ) : (
            <GiftIcon />
          )}
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
            className="absolute inset-0 z-40 flex items-center justify-center p-5 backdrop-blur-[4px]"
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

export default DiceRollDiscountPopup;
