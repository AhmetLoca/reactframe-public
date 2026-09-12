"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MSN_BLUE = "#0084FF";
const MSN_PURPLE = "#9333ea";
const MSN_BG =
  "url(\"data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='p' width='32' height='32' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='16' cy='16' r='1' fill='%23d1d5db' opacity='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='400' height='400' fill='%23f0f2f5'/%3E%3Crect width='400' height='400' fill='url(%23p)'/%3E%3C/svg%3E\")";

export type MessengerAvailability = "online" | "away" | "offline";
export type MessengerWidgetPosition = "bottom-right" | "bottom-left";

export interface MessengerQuickReply {
  label: string;
  message: string;
}

export interface MessengerWidgetProps {
  agentName?: string;
  agentStatus?: string;
  agentAvatar?: string;
  pageId: string;
  availability?: MessengerAvailability;
  offlineMessage?: string;
  greeting?: string;
  quickReplies?: MessengerQuickReply[];
  popupMessage?: string;
  accentColor?: string;
  gradientEnd?: string;
  /** Fixed to the viewport corner (typical widget usage). Set false to render inline, e.g. inside a preview card. */
  fixed?: boolean;
  position?: MessengerWidgetPosition;
  notificationCount?: number;
  popupDelay?: number;
  typingDuration?: number;
  autoOpenDelay?: number;
  fontFamily?: string;
}

const STATUS_COLORS: Record<MessengerAvailability, string> = { online: "#31a24c", away: "#f59e0b", offline: "#9ca3af" };
const STATUS_LABELS: Record<MessengerAvailability, string> = { online: "Active now", away: "Away", offline: "Offline" };

function MessengerIcon({ size = 28, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
      <path d="M0 7.76C0 3.301 3.493 0 8 0s8 3.301 8 7.76-3.493 7.76-8 7.76c-.81 0-1.586-.107-2.316-.307a.639.639 0 0 0-.427.03l-1.588.702a.64.64 0 0 1-.898-.566l-.044-1.423a.639.639 0 0 0-.215-.456C.956 12.108 0 10.092 0 7.76zm5.546-1.921-2.37 3.763c-.192.305.163.658.46.445l2.56-1.955a.326.326 0 0 1 .389.006l1.893 1.42a.819.819 0 0 0 1.205-.229l2.37-3.763c.192-.305-.163-.658-.459-.445L9.033 6.08a.326.326 0 0 1-.389-.006L6.75 4.654a.819.819 0 0 0-1.204.229z" />
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

function LikeIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
    </svg>
  );
}

function Avatar({ size, src }: { size: number; src?: string }) {
  return src ? (
    <img src={src} alt="" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <div className="flex shrink-0 items-center justify-center rounded-full bg-white/25" style={{ width: size, height: size, fontSize: size * 0.42 }}>
      🧑‍💼
    </div>
  );
}

function MsgAvatar({ src, isOffline, accentColor, gradientEnd }: { src?: string; isOffline: boolean; accentColor: string; gradientEnd: string }) {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{ background: isOffline ? "#9ca3af" : `linear-gradient(135deg, ${accentColor}, ${gradientEnd})` }}
    >
      {src ? <img src={src} alt="" className="h-7 w-7 object-cover" /> : <span className="text-[13px]">🧑‍💼</span>}
    </div>
  );
}

const DEFAULT_QUICK_REPLIES: MessengerQuickReply[] = [
  { label: "Get started", message: "I'd like to get started" },
  { label: "Learn more", message: "Tell me more about your services" },
  { label: "Talk to us", message: "I'd like to speak with someone" },
];

export function MessengerWidget({
  agentName = "Support Team",
  agentStatus = "Typically replies instantly",
  agentAvatar,
  pageId,
  availability = "online",
  offlineMessage = "We're currently offline. Send us a message and we'll get back to you soon.",
  greeting = "Hi! 👋 Welcome!\n\nHow can we help you today?",
  quickReplies = DEFAULT_QUICK_REPLIES,
  popupMessage = "👋 Hey there! Have a question? We're here to help.",
  accentColor = MSN_BLUE,
  gradientEnd = MSN_PURPLE,
  fixed = true,
  position = "bottom-right",
  notificationCount = 1,
  popupDelay = 4,
  typingDuration = 1.5,
  autoOpenDelay = 0,
  fontFamily = "system-ui, -apple-system, sans-serif",
}: MessengerWidgetProps) {
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
  const isOpenRef = React.useRef(isOpen);

  const isOffline = availability === "offline";
  const isAway = availability === "away";
  const dotColor = STATUS_COLORS[availability];
  const statusText = isOffline ? STATUS_LABELS.offline : isAway ? STATUS_LABELS.away : agentStatus;
  const headerGradient = isOffline ? "linear-gradient(140deg, #6b7280 0%, #4b5563 100%)" : `linear-gradient(140deg, ${accentColor} 0%, ${gradientEnd} 100%)`;

  React.useEffect(() => setShowBadge(notificationCount > 0), [notificationCount]);

  React.useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

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
    if (popupDelay > 0 && !popupDismissed) {
      const t = setTimeout(() => {
        if (!isOpenRef.current) setShowPopup(true);
      }, popupDelay * 1000);
      return () => clearTimeout(t);
    }
  }, [popupDelay, popupDismissed]);

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
  const openMessenger = (msg?: string) => {
    const url = msg ? `https://m.me/${pageId}?text=${encodeURIComponent(msg)}` : `https://m.me/${pageId}`;
    window.open(url, "_blank");
  };
  const handleSend = () => {
    const msg = inputValue.trim();
    if (!msg) return;
    openMessenger(msg);
    setInputValue("");
  };
  const handleQuickReply = (qr: MessengerQuickReply) => {
    setInputValue(qr.message);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const isRight = position !== "bottom-left";
  const chatOrigin = isRight ? "bottom right" : "bottom left";

  return (
    <div
      className={cn(fixed ? "fixed bottom-6 z-[99999]" : "relative", isRight ? "right-6" : "left-6")}
      style={{ fontFamily, ...(fixed ? undefined : { display: "inline-block" }) }}
    >
      {showPopup && !isOpen && (
        <div
          onClick={handleOpen}
          className={cn("absolute bottom-[76px] w-[300px] cursor-pointer overflow-hidden rounded-[20px] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.16),0_4px_16px_rgba(0,0,0,0.08)]", isRight ? "right-0" : "left-0")}
          style={{ animation: "msn-popup-in 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
        >
          <div className="flex items-center gap-2.5 px-3.5 py-3" style={{ background: headerGradient }}>
            <div className="relative shrink-0">
              <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white/40">
                <Avatar size={36} src={agentAvatar} />
              </div>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white" style={{ background: dotColor }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold text-white">{agentName}</div>
              <div className="text-[11px] text-white/82">{statusText}</div>
            </div>
            <button
              aria-label="Dismiss notification"
              onClick={handleDismissPopup}
              className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-white/[0.18] transition-colors hover:bg-white/30"
            >
              <CloseIcon size={13} />
            </button>
          </div>
          <div className="bg-[#f0f2f5] p-3.5">
            <div className="inline-block max-w-full rounded-[0_16px_16px_16px] bg-white px-[13px] py-2.5 text-sm leading-[1.5] text-black shadow-[0_1px_4px_rgba(0,0,0,0.07)]">
              {popupMessage}
            </div>
            <div className={cn("mt-2.5 text-[11.5px] text-[#888]", isRight ? "text-right" : "text-left")}>Tap to reply →</div>
          </div>
        </div>
      )}

      <div
        className={cn("absolute bottom-[76px] w-[360px] overflow-hidden rounded-[20px] bg-white", isRight ? "right-0" : "left-0")}
        style={{
          boxShadow: isOpen ? "0 24px 72px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.1)" : "none",
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
          <div className="relative">
            <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-white/40">
              <Avatar size={44} src={agentAvatar} />
            </div>
            <div className="absolute bottom-px right-px h-3 w-3 rounded-full border-[2.5px] border-white" style={{ background: dotColor }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] leading-[1.2] font-bold tracking-[-0.01em] text-white">{agentName}</div>
            <div className="mt-0.5 flex items-center gap-[5px] text-xs text-white/85">
              {(isOffline || isAway) && (
                <span className="rounded px-1.5 py-px text-[10px] font-bold tracking-[0.04em]" style={{ background: "rgba(255,255,255,0.22)" }}>
                  {STATUS_LABELS[availability].toUpperCase()}
                </span>
              )}
              {statusText}
            </div>
          </div>
          <button
            aria-label="Close chat"
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

        <div className="flex max-h-[320px] min-h-[220px] flex-col gap-2.5 overflow-y-auto px-3.5 py-4" style={{ backgroundImage: MSN_BG, backgroundSize: "cover" }}>
          {showTyping && (
            <div className="flex items-end gap-2">
              <MsgAvatar src={agentAvatar} isOffline={isOffline} accentColor={accentColor} gradientEnd={gradientEnd} />
              <div className="flex items-center gap-[5px] rounded-[4px_18px_18px_18px] bg-white px-4 py-[11px] shadow-[0_1px_4px_rgba(0,0,0,0.08)]" style={{ animation: "msn-msg-in 0.3s ease forwards" }}>
                <span className="h-[7px] w-[7px] animate-[msn-dot_1.2s_ease-in-out_0s_infinite] rounded-full bg-[#bbb]" />
                <span className="h-[7px] w-[7px] animate-[msn-dot_1.2s_ease-in-out_0.2s_infinite] rounded-full bg-[#bbb]" />
                <span className="h-[7px] w-[7px] animate-[msn-dot_1.2s_ease-in-out_0.4s_infinite] rounded-full bg-[#bbb]" />
              </div>
            </div>
          )}

          {greetingVisible && (
            <div className="flex items-end gap-2" style={{ animation: "msn-msg-in 0.38s cubic-bezier(0.34,1.2,0.64,1) forwards" }}>
              <MsgAvatar src={agentAvatar} isOffline={isOffline} accentColor={accentColor} gradientEnd={gradientEnd} />
              <div className="max-w-64">
                <div className="whitespace-pre-line rounded-[4px_18px_18px_18px] bg-white px-3.5 py-2.5 text-sm leading-[1.55] text-black shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
                  {greeting}
                </div>
                <div className="mt-1 flex items-center gap-1 pl-1">
                  <span className="text-[11px] text-[#aaa]">{msgTime}</span>
                  <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full" style={{ background: `linear-gradient(135deg, ${accentColor}, ${gradientEnd})` }}>
                    <svg width={8} height={8} viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {greetingVisible && quickReplies.length > 0 && (
            <div className="mt-1 flex flex-col gap-2" style={{ animation: "msn-msg-in 0.42s cubic-bezier(0.34,1.2,0.64,1) 0.1s both" }}>
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickReply(qr)}
                  className="flex items-center gap-2 rounded-[20px] border-[1.5px] bg-white px-4 py-[9px] text-left text-[13.5px] font-medium shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-200"
                  style={{ borderColor: accentColor, color: accentColor }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${accentColor}, ${gradientEnd})`;
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.transform = "translateX(4px) scale(1.01)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = accentColor;
                    e.currentTarget.style.borderColor = accentColor;
                    e.currentTarget.style.transform = "translateX(0) scale(1)";
                  }}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full opacity-60" style={{ background: "currentColor" }} />
                  {qr.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-[#e4e6e9] bg-white px-3 py-2.5">
          <button
            aria-label="Send thumbs up"
            onClick={() => openMessenger("👍")}
            className="shrink-0 p-0 opacity-60 transition-all hover:scale-[1.2] hover:opacity-100"
          >
            <LikeIcon color={accentColor} size={22} />
          </button>

          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Write a message…"
            aria-label="Type a message"
            className="flex-1 rounded-[22px] border-[1.5px] border-[#e4e6e9] bg-[#f0f2f5] px-3.5 py-2 text-sm text-black outline-none transition-colors"
            onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e6e9")}
          />

          <button
            aria-label="Send message"
            onClick={handleSend}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110"
            style={{
              background: inputValue.trim() ? `linear-gradient(135deg, ${accentColor}, ${gradientEnd})` : "#e4e6e9",
              cursor: inputValue.trim() ? "pointer" : "default",
              boxShadow: inputValue.trim() ? `0 4px 14px ${accentColor}55` : "none",
            }}
          >
            <SendIcon />
          </button>
        </div>

        <div className="border-t border-[#f0f2f5] pt-[5px] pb-[9px] text-center text-[11px] text-[#bbb]">
          Powered by{" "}
          <span
            className="font-bold"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${gradientEnd})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Messenger
          </span>
        </div>
      </div>

      <div className="relative inline-flex">
        <button
          aria-label={isOpen ? "Close chat" : "Open chat"}
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
            className="pointer-events-none absolute inset-0 scale-0 rounded-full bg-white/[0.18]"
            style={{ animation: isOpen ? "msn-ripple 0.4s ease-out forwards" : "none" }}
          />

          {!isOpen && !isOffline && (
            <>
              <div className="pointer-events-none absolute -inset-[5px] animate-[msn-pulse_2.4s_ease-in-out_1.2s_infinite] rounded-full border-2" style={{ borderColor: accentColor }} />
              <div className="pointer-events-none absolute -inset-[11px] animate-[msn-pulse_2.4s_ease-in-out_1.8s_infinite] rounded-full border-[1.5px] opacity-45" style={{ borderColor: gradientEnd }} />
            </>
          )}

          <div className="pointer-events-none absolute transition-all duration-[350ms]" style={{ transform: isOpen ? "rotate(-90deg) scale(0.3)" : "rotate(0deg) scale(1)", opacity: isOpen ? 0 : 1 }}>
            <MessengerIcon size={30} />
          </div>
          <div className="pointer-events-none absolute transition-all duration-[350ms]" style={{ transform: isOpen ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.3)", opacity: isOpen ? 1 : 0 }}>
            <CloseIcon size={22} />
          </div>
        </button>

        {!isOpen && showBadge && notificationCount > 0 && (
          <div
            className="pointer-events-none absolute -right-1 -top-1 z-[1] flex h-5 min-w-5 items-center justify-center rounded-full border-[2.5px] border-white bg-[#ef4444] px-[5px] text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(239,68,68,0.55)]"
            style={{ animation: "msn-badge-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 1.1s both" }}
          >
            {notificationCount > 9 ? "9+" : notificationCount}
          </div>
        )}
      </div>

      <style>{`
        @keyframes msn-pulse { 0% { transform: scale(1); opacity: 0.6; } 70% { transform: scale(1.6); opacity: 0; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes msn-dot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }
        @keyframes msn-msg-in { from { transform: translateY(12px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes msn-popup-in { from { transform: translateY(18px) scale(0.88); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes msn-badge-pop { 0% { transform: scale(0) rotate(-20deg); } 70% { transform: scale(1.25) rotate(5deg); } 100% { transform: scale(1) rotate(0deg); } }
        @keyframes msn-ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
      `}</style>
    </div>
  );
}
