"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TG_BLUE = "#2AABEE";
const TG_DEEP = "#1a8fc2";
const TG_BG =
  "url(\"data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='p' width='28' height='28' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='14' cy='14' r='0.9' fill='%23c8dff0' opacity='0.55'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='400' height='400' fill='%23eef5fb'/%3E%3Crect width='400' height='400' fill='url(%23p)'/%3E%3C/svg%3E\")";

export type TelegramAvailability = "online" | "away" | "offline";
export type TelegramWidgetPosition = "bottom-right" | "bottom-left";

export interface TelegramQuickReply {
  emoji: string;
  label: string;
  message: string;
}

export interface TelegramWidgetProps {
  agentName?: string;
  agentStatus?: string;
  agentAvatar?: string;
  username: string;
  showVerified?: boolean;
  availability?: TelegramAvailability;
  offlineMessage?: string;
  greeting?: string;
  quickReplies?: TelegramQuickReply[];
  popupMessage?: string;
  accentColor?: string;
  gradientEnd?: string;
  /** Fixed to the viewport corner (typical widget usage). Set false to render inline, e.g. inside a preview card. */
  fixed?: boolean;
  position?: TelegramWidgetPosition;
  notificationCount?: number;
  popupDelay?: number;
  typingDuration?: number;
  autoOpenDelay?: number;
}

const STATUS_COLORS: Record<TelegramAvailability, string> = { online: "#4ade80", away: "#f59e0b", offline: "#9ca3af" };
const STATUS_LABELS: Record<TelegramAvailability, string> = { online: "online", away: "away", offline: "offline" };

function TelegramIcon({ size = 28, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
    </svg>
  );
}

function SendIcon({ color = "#fff" }: { color?: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon({ color = "#fff", size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

function SeenIcon({ color }: { color: string }) {
  return (
    <svg width={16} height={11} viewBox="0 0 16 11" fill="none">
      <path d="M1 5.5L4.5 9L10 3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 5.5L9.5 9L15 3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VerifiedIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="rgba(255,255,255,0.92)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Avatar({ size, src, accentColor, gradientEnd }: { size: number; src?: string; accentColor: string; gradientEnd: string }) {
  return src ? (
    <img src={src} alt="" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${accentColor}, ${gradientEnd})`, fontSize: size * 0.42 }}
    >
      ✈️
    </div>
  );
}

function MsgAvatar({ src, accentColor, gradientEnd }: { src?: string; accentColor: string; gradientEnd: string }) {
  return (
    <div
      className="flex h-[30px] w-[30px] shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{ background: `linear-gradient(135deg, ${accentColor}, ${gradientEnd})` }}
    >
      {src ? <img src={src} alt="" className="h-[30px] w-[30px] object-cover" /> : <TelegramIcon size={16} />}
    </div>
  );
}

const DEFAULT_QUICK_REPLIES: TelegramQuickReply[] = [
  { emoji: "💬", label: "Start a chat", message: "Hi! I'd like to chat with you." },
  { emoji: "❓", label: "Ask a question", message: "I have a question for you." },
  { emoji: "📋", label: "Get information", message: "I'd like some information." },
];

export function TelegramWidget({
  agentName = "Support",
  agentStatus = "usually replies in minutes",
  agentAvatar,
  username,
  showVerified = false,
  availability = "online",
  offlineMessage = "We're offline right now. Write to us and we'll reply as soon as we're back.",
  greeting = "Hello! ✈️\n\nHow can we assist you today?",
  quickReplies = DEFAULT_QUICK_REPLIES,
  popupMessage = "✈️ Hey! Got questions? We reply fast — message us now.",
  accentColor = TG_BLUE,
  gradientEnd = TG_DEEP,
  fixed = true,
  position = "bottom-right",
  notificationCount = 1,
  popupDelay = 4,
  typingDuration = 1.5,
  autoOpenDelay = 0,
}: TelegramWidgetProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const [showBadge, setShowBadge] = React.useState(notificationCount > 0);
  const [msgTime, setMsgTime] = React.useState("00:00");
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupDismissed, setPopupDismissed] = React.useState(false);
  const [showTyping, setShowTyping] = React.useState(false);
  const [greetingVisible, setGreetingVisible] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = React.useRef(0);

  const isOffline = availability === "offline";
  const isAway = availability === "away";
  const dotColor = STATUS_COLORS[availability];
  const statusText = isOffline ? STATUS_LABELS.offline : isAway ? STATUS_LABELS.away : agentStatus;
  const headerGradient = isOffline ? "linear-gradient(140deg, #6b7280 0%, #4b5563 100%)" : `linear-gradient(140deg, ${accentColor} 0%, ${gradientEnd} 100%)`;
  const cleanUsername = username.replace(/^@/, "");

  React.useEffect(() => setShowBadge(notificationCount > 0), [notificationCount]);

  React.useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (autoOpenDelay > 0) {
      const t = setTimeout(() => setIsOpen(true), autoOpenDelay * 1000);
      return () => clearTimeout(t);
    }
  }, [autoOpenDelay]);

  React.useEffect(() => {
    if (popupDelay > 0 && !popupDismissed && !isOpen) {
      const t = setTimeout(() => setShowPopup(true), popupDelay * 1000);
      return () => clearTimeout(t);
    }
  }, [popupDelay, popupDismissed, isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      setShowBadge(false);
      setShowPopup(false);
      secondsRef.current = 0;
      const startTimer = () => {
        timerRef.current = setInterval(() => {
          secondsRef.current += 1;
          const m = Math.floor(secondsRef.current / 60).toString().padStart(2, "0");
          const s = (secondsRef.current % 60).toString().padStart(2, "0");
          setMsgTime(`${m}:${s}`);
        }, 1000);
      };
      if (typingDuration > 0) {
        setShowTyping(true);
        setGreetingVisible(false);
        startTimer();
        const t = setTimeout(() => {
          setShowTyping(false);
          setGreetingVisible(true);
        }, typingDuration * 1000);
        const f = setTimeout(() => inputRef.current?.focus(), 420);
        return () => {
          clearTimeout(t);
          clearTimeout(f);
          if (timerRef.current) clearInterval(timerRef.current);
        };
      }
      setShowTyping(false);
      setGreetingVisible(true);
      startTimer();
      const f = setTimeout(() => inputRef.current?.focus(), 420);
      return () => {
        clearTimeout(f);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
    setShowTyping(false);
    setGreetingVisible(false);
    if (timerRef.current) clearInterval(timerRef.current);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, typingDuration]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleDismissPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(false);
    setPopupDismissed(true);
  };
  const openTelegram = (msg?: string) => {
    const base = `https://t.me/${cleanUsername}`;
    window.open(msg ? `${base}?text=${encodeURIComponent(msg)}` : base, "_blank");
  };
  const handleSend = () => {
    const msg = inputValue.trim();
    if (!msg) return;
    openTelegram(msg);
    setInputValue("");
  };
  const handleQuickReply = (qr: TelegramQuickReply) => {
    setInputValue(qr.message);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const isRight = position !== "bottom-left";
  const chatOrigin = isRight ? "bottom right" : "bottom left";

  return (
    <div
      className={cn(fixed ? "fixed bottom-6 z-[9999]" : "relative", isRight ? "right-6" : "left-6")}
      style={{ fontFamily: "system-ui, -apple-system, sans-serif", ...(fixed ? undefined : { display: "inline-block" }) }}
    >
      {showPopup && !isOpen && (
        <div
          onClick={handleOpen}
          className={cn("absolute bottom-[76px] w-[300px] cursor-pointer overflow-hidden rounded-[18px] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.15),0_4px_16px_rgba(0,0,0,0.08)]", isRight ? "right-0" : "left-0")}
          style={{ animation: "tg-popup-in 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
        >
          <div className="flex items-center gap-2.5 px-3.5 py-3" style={{ background: headerGradient }}>
            <div className="relative shrink-0">
              <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white/40">
                <Avatar size={36} src={agentAvatar} accentColor={accentColor} gradientEnd={gradientEnd} />
              </div>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white" style={{ background: dotColor }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-white">
                {agentName}
                {showVerified && <VerifiedIcon size={12} />}
              </div>
              <div className="text-[11px] text-white/80">@{cleanUsername}</div>
            </div>
            <button
              onClick={handleDismissPopup}
              className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-white/[0.18] transition-colors hover:bg-white/[0.32]"
            >
              <CloseIcon size={13} />
            </button>
          </div>
          <div className="px-3.5 pt-[13px] pb-3.5" style={{ backgroundImage: TG_BG, backgroundSize: "cover" }}>
            <div className="inline-block max-w-full rounded-[4px_16px_16px_16px] bg-white px-[13px] py-2.5 text-sm leading-relaxed text-black shadow-[0_1px_4px_rgba(0,0,0,0.07)]">
              {popupMessage}
            </div>
            <div className={cn("mt-2.5 text-[11.5px] text-[#888]", isRight ? "text-right" : "text-left")}>Tap to open Telegram →</div>
          </div>
        </div>
      )}

      <div
        className={cn("absolute bottom-[76px] w-[360px] overflow-hidden rounded-[18px] bg-white", isRight ? "right-0" : "left-0")}
        style={{
          boxShadow: isOpen ? "0 24px 72px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.1)" : "none",
          transformOrigin: chatOrigin,
          transform: isOpen ? "scale(1) translateY(0px)" : "scale(0.72) translateY(24px)",
          opacity: isOpen ? 1 : 0,
          filter: isOpen ? "blur(0px)" : "blur(6px)",
          pointerEvents: isOpen ? "all" : "none",
          transition: isOpen
            ? "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.28s ease, filter 0.28s ease, box-shadow 0.3s ease"
            : "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease, filter 0.22s ease",
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ background: headerGradient }}>
          <div className="relative shrink-0">
            <div className="h-[46px] w-[46px] overflow-hidden rounded-full border-[2.5px] border-white/45">
              <Avatar size={46} src={agentAvatar} accentColor={accentColor} gradientEnd={gradientEnd} />
            </div>
            <div className="absolute bottom-px right-px h-3 w-3 rounded-full border-[2.5px] border-white" style={{ background: dotColor }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[15px] font-bold leading-[1.2] tracking-[-0.01em] text-white">
              {agentName}
              {showVerified && <VerifiedIcon size={15} />}
            </div>
            <div className="mt-0.5 flex items-center gap-[5px] text-xs text-white/82">
              {(isOffline || isAway) && (
                <span className="rounded px-1.5 py-px text-[10px] font-bold tracking-[0.04em]" style={{ background: "rgba(255,255,255,0.22)" }}>
                  {STATUS_LABELS[availability].toUpperCase()}
                </span>
              )}
              <span>@{cleanUsername} · {statusText}</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.18] transition-all hover:scale-110 hover:bg-white/30"
          >
            <CloseIcon />
          </button>
        </div>

        {isOffline && (
          <div className="flex items-start gap-[7px] border-b border-[#fde68a] bg-[#fef3c7] px-3.5 py-[9px] text-[12.5px] text-[#92400e]">
            <span className="shrink-0 text-sm">🔔</span>
            <span>{offlineMessage}</span>
          </div>
        )}
        {isAway && (
          <div className="flex items-center gap-[7px] border-b border-[#fde68a] bg-[#fffbeb] px-3.5 py-[9px] text-[12.5px] text-[#92400e]">
            <span className="text-sm">🕐</span>
            <span>Response times may be a bit slower right now.</span>
          </div>
        )}

        <div className="flex max-h-[320px] min-h-[220px] flex-col gap-2.5 overflow-y-auto px-3.5 py-4" style={{ backgroundImage: TG_BG, backgroundSize: "cover" }}>
          {showTyping && (
            <div className="flex items-end gap-2">
              <MsgAvatar src={agentAvatar} accentColor={accentColor} gradientEnd={gradientEnd} />
              <div className="flex items-center gap-[5px] rounded-[4px_18px_18px_18px] bg-white px-4 py-[11px] shadow-[0_1px_5px_rgba(0,0,0,0.08)]" style={{ animation: "tg-msg-in 0.3s ease forwards" }}>
                <span className="h-[7px] w-[7px] animate-[tg-dot_1.2s_ease-in-out_0s_infinite] rounded-full bg-[#bbb]" />
                <span className="h-[7px] w-[7px] animate-[tg-dot_1.2s_ease-in-out_0.2s_infinite] rounded-full bg-[#bbb]" />
                <span className="h-[7px] w-[7px] animate-[tg-dot_1.2s_ease-in-out_0.4s_infinite] rounded-full bg-[#bbb]" />
              </div>
            </div>
          )}

          {greetingVisible && (
            <div className="flex items-end gap-2" style={{ animation: "tg-msg-in 0.38s cubic-bezier(0.34,1.2,0.64,1) forwards" }}>
              <MsgAvatar src={agentAvatar} accentColor={accentColor} gradientEnd={gradientEnd} />
              <div className="max-w-[258px]">
                <div className="whitespace-pre-line rounded-[4px_18px_18px_18px] bg-white px-3.5 py-2.5 text-sm leading-relaxed text-black shadow-[0_1px_5px_rgba(0,0,0,0.08)]">
                  {greeting}
                </div>
                <div className="mt-1 flex items-center gap-1 pl-1">
                  <span className="text-[11px] text-[#aaa]">{msgTime}</span>
                  <SeenIcon color={accentColor} />
                </div>
              </div>
            </div>
          )}

          {greetingVisible && quickReplies.length > 0 && (
            <div className="mt-1 flex flex-col gap-[7px]" style={{ animation: "tg-msg-in 0.42s cubic-bezier(0.34,1.2,0.64,1) 0.1s both" }}>
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickReply(qr)}
                  className="flex items-center gap-2.5 rounded-[22px] bg-white px-4 py-[9px] text-left text-[13.5px] font-medium text-[#222] shadow-[0_1px_4px_rgba(0,0,0,0.07)] transition-all duration-200"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${accentColor}, ${gradientEnd})`;
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.transform = "translateX(4px) scale(1.01)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#222";
                    e.currentTarget.style.transform = "translateX(0) scale(1)";
                    e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.07)";
                  }}
                >
                  <span className="shrink-0 text-[15.5px]">{qr.emoji}</span>
                  {qr.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-[#eef2f7] bg-white px-3 py-2.5">
          <div className="shrink-0 cursor-default select-none text-[22px] transition-transform hover:scale-[1.2]">😊</div>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Write a message..."
            className="flex-1 rounded-[22px] border-[1.5px] border-[#eef2f7] bg-[#f7fafd] px-3.5 py-2 text-sm text-black outline-none transition-colors focus:bg-white"
            onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#eef2f7")}
          />
          <button
            onClick={handleSend}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full transition-transform"
            style={{
              background: inputValue.trim() ? `linear-gradient(135deg, ${accentColor}, ${gradientEnd})` : "#e4e9ef",
              cursor: inputValue.trim() ? "pointer" : "default",
              boxShadow: inputValue.trim() ? `0 4px 14px ${accentColor}55` : "none",
            }}
            onMouseEnter={(e) => {
              if (inputValue.trim()) e.currentTarget.style.transform = "scale(1.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <SendIcon />
          </button>
        </div>

        <div className="border-t border-[#f2f5f9] pt-[5px] pb-[9px] text-center text-[11px] text-[#bbb]">
          Open in{" "}
          <span
            className="font-bold"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${gradientEnd})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Telegram
          </span>
        </div>
      </div>

      <div className="relative inline-flex">
        <button
          onClick={isOpen ? handleClose : handleOpen}
          className="relative flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full transition-transform hover:scale-110"
          style={{
            background: isOpen ? "linear-gradient(135deg, #ff6b6b, #ee5a24)" : isOffline ? "linear-gradient(135deg, #6b7280, #4b5563)" : `linear-gradient(135deg, ${accentColor}, ${gradientEnd})`,
            boxShadow: isOpen ? "0 6px 24px rgba(238,90,36,0.45)" : isOffline ? "0 6px 24px rgba(107,114,128,0.4)" : `0 8px 28px ${accentColor}70`,
            transform: isVisible ? "scale(1)" : "scale(0)",
            opacity: isVisible ? 1 : 0,
            transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease, background 0.4s ease, box-shadow 0.3s ease",
          }}
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-full bg-white/[0.18]"
            style={{ transform: "scale(0)", animation: isOpen ? "tg-ripple 0.4s ease-out forwards" : "none" }}
          />

          {!isOpen && !isOffline && (
            <>
              <div className="pointer-events-none absolute -inset-[5px] animate-[tg-pulse_2.4s_ease-in-out_1.2s_infinite] rounded-full border-2" style={{ borderColor: accentColor }} />
              <div className="pointer-events-none absolute -inset-[11px] animate-[tg-pulse_2.4s_ease-in-out_1.8s_infinite] rounded-full border-[1.5px] opacity-40" style={{ borderColor: gradientEnd }} />
            </>
          )}
          <div className="pointer-events-none absolute transition-all duration-[350ms]" style={{ transform: isOpen ? "rotate(-90deg) scale(0.3)" : "rotate(0deg) scale(1)", opacity: isOpen ? 0 : 1 }}>
            <TelegramIcon size={30} />
          </div>
          <div className="pointer-events-none absolute transition-all duration-[350ms]" style={{ transform: isOpen ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.3)", opacity: isOpen ? 1 : 0 }}>
            <CloseIcon size={22} />
          </div>
        </button>

        {!isOpen && showBadge && notificationCount > 0 && (
          <div
            className="pointer-events-none absolute -right-1 -top-1 z-[1] flex h-5 min-w-5 items-center justify-center rounded-full border-[2.5px] border-white bg-[#ef4444] px-1.5 text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(239,68,68,0.55)]"
            style={{ animation: "tg-badge-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 1.1s both" }}
          >
            {notificationCount > 9 ? "9+" : notificationCount}
          </div>
        )}
      </div>

      <style>{`
        @keyframes tg-pulse { 0% { transform: scale(1); opacity: 0.6; } 70% { transform: scale(1.6); opacity: 0; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes tg-ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes tg-dot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }
        @keyframes tg-msg-in { from { transform: translateY(12px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes tg-popup-in { from { transform: translateY(18px) scale(0.88); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes tg-badge-pop { 0% { transform: scale(0) rotate(-20deg); } 70% { transform: scale(1.25) rotate(5deg); } 100% { transform: scale(1) rotate(0deg); } }
      `}</style>
    </div>
  );
}
