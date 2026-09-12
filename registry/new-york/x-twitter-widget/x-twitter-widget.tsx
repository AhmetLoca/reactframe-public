"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const X_BLACK = "#000000";
const X_BLUE = "#1D9BF0";

export type XTwitterWidgetAvailability = "online" | "away" | "offline";
export type XTwitterWidgetPosition = "bottom-right" | "bottom-left";
export type XTwitterWidgetTheme = "light" | "dark";

export interface XTwitterWidgetQuickReply {
  label: string;
  message: string;
}

export interface XTwitterWidgetProps {
  agentName?: string;
  agentHandle?: string;
  agentAvatar?: string;
  followsYou?: boolean;
  availability?: XTwitterWidgetAvailability;
  offlineMessage?: string;
  greeting?: string;
  quickReplies?: XTwitterWidgetQuickReply[];
  popupMessage?: string;
  theme?: XTwitterWidgetTheme;
  accentColor?: string;
  fontFamily?: string;
  agentNameFontSize?: number;
  greetingFontSize?: number;
  quickReplyFontSize?: number;
  inputFontSize?: number;
  widgetBorderRadius?: number;
  buttonBorderRadius?: number;
  /** Fixed to the viewport corner (typical widget usage). Set false to render inline, e.g. inside a preview card. */
  fixed?: boolean;
  position?: XTwitterWidgetPosition;
  notificationCount?: number;
  popupDelay?: number;
  typingDuration?: number;
  autoOpenDelay?: number;
}

const STATUS_COLORS: Record<XTwitterWidgetAvailability, string> = { online: "#00ba7c", away: "#f59e0b", offline: "#536471" };
const STATUS_LABELS: Record<XTwitterWidgetAvailability, string> = { online: "Active", away: "Away", offline: "Offline" };

function XIcon({ size = 26, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SendIcon({ color = "#fff" }: { color?: string }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
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

function AvatarEl({ size, border, src, isDark }: { size: number; border?: string; src?: string; isDark: boolean }) {
  return src ? (
    <img
      src={src}
      alt=""
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size, border: border || "none" }}
    />
  ) : (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: isDark ? "#2f3336" : "#e7e9ea", fontSize: size * 0.42, border: border || "none" }}
    >
      🧑‍💻
    </div>
  );
}

function MsgAvatar({ src, isDark }: { src?: string; isDark: boolean }) {
  return (
    <div
      className="flex h-[30px] w-[30px] shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{ background: isDark ? "#2f3336" : "#e7e9ea" }}
    >
      {src ? <img src={src} alt="" className="h-[30px] w-[30px] object-cover" /> : <XIcon size={14} color={isDark ? "#e7e9ea" : "#536471"} />}
    </div>
  );
}

const DEFAULT_QUICK_REPLIES: XTwitterWidgetQuickReply[] = [
  { label: "📩 Send us a DM", message: "Hi! I'd like to get in touch." },
  { label: "❓ Ask a question", message: "I have a question for you." },
  { label: "💡 Share feedback", message: "I'd like to share some feedback." },
];

export function XTwitterWidget({
  agentName = "Support",
  agentHandle = "yourusername",
  agentAvatar,
  followsYou = false,
  availability = "online",
  offlineMessage = "We're not around right now. DM us and we'll reply soon.",
  greeting = "Hey there! 👋\n\nGot a question? We'd love to help.",
  quickReplies = DEFAULT_QUICK_REPLIES,
  popupMessage = "👋 Hey! Drop us a message — we reply fast.",
  theme = "light",
  accentColor = X_BLUE,
  fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  agentNameFontSize = 15,
  greetingFontSize = 14,
  quickReplyFontSize = 13.5,
  inputFontSize = 14,
  widgetBorderRadius = 18,
  buttonBorderRadius = 22,
  fixed = true,
  position = "bottom-right",
  notificationCount = 1,
  popupDelay = 4,
  typingDuration = 1.5,
  autoOpenDelay = 0,
}: XTwitterWidgetProps) {
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

  const isDark = theme === "dark";
  const bg = isDark ? "#15202B" : "#f7f9f9";
  const textPrimary = isDark ? "#e7e9ea" : "#0f1419";
  const textMuted = isDark ? "#71767b" : "#536471";
  const border = isDark ? "#2f3336" : "#eff3f4";
  const inputBg = isDark ? "#253341" : "#f7f9f9";
  const bubbleBg = isDark ? "#22303C" : "#ffffff";

  const isOffline = availability === "offline";
  const isAway = availability === "away";
  const dotColor = STATUS_COLORS[availability];
  const cleanHandle = agentHandle.replace(/^@/, "");
  const statusText = isOffline ? STATUS_LABELS.offline : isAway ? STATUS_LABELS.away : STATUS_LABELS.online;

  React.useEffect(() => {
    const t = setTimeout(() => setShowBadge(notificationCount > 0), 0);
    return () => clearTimeout(t);
  }, [notificationCount]);

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
        if (!isOpen) setShowPopup(true);
      }, popupDelay * 1000);
      return () => clearTimeout(t);
    }
  }, [popupDelay, popupDismissed, isOpen]);

  React.useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const initTimer = setTimeout(() => {
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
          timeouts.push(
            setTimeout(() => {
              setShowTyping(false);
              setGreetingVisible(true);
            }, typingDuration * 1000)
          );
          timeouts.push(setTimeout(() => inputRef.current?.focus(), 420));
        } else {
          setShowTyping(false);
          setGreetingVisible(true);
          startTimer();
          timeouts.push(setTimeout(() => inputRef.current?.focus(), 420));
        }
      } else {
        setShowTyping(false);
        setGreetingVisible(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 0);

    return () => {
      clearTimeout(initTimer);
      timeouts.forEach(clearTimeout);
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
  const buildXUrl = (msg?: string) =>
    msg ? `https://x.com/intent/tweet?text=${encodeURIComponent(`@${cleanHandle} ${msg}`)}` : `https://x.com/${cleanHandle}`;
  const handleSend = () => {
    const msg = inputValue.trim();
    if (!msg) return;
    window.open(buildXUrl(msg), "_blank", "noopener,noreferrer");
    setInputValue("");
  };
  const handleQuickReply = (qr: XTwitterWidgetQuickReply) => {
    setInputValue(qr.message);
    setTimeout(() => inputRef.current?.focus(), 50);
  };
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  const hasInput = inputValue.trim().length > 0;
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
          className={cn("absolute bottom-[76px] w-[300px] cursor-pointer overflow-hidden border shadow-[0_16px_48px_rgba(0,0,0,0.14),0_4px_16px_rgba(0,0,0,0.08)]", isRight ? "right-0" : "left-0")}
          style={{ borderColor: border, borderRadius: widgetBorderRadius, animation: "xt-popup-in 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
        >
          <div className="flex items-center gap-2.5 px-3.5 py-3" style={{ background: X_BLACK }}>
            <div className="relative shrink-0">
              <AvatarEl size={36} border="2px solid #333" src={agentAvatar} isDark={isDark} />
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-black" style={{ background: dotColor }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white" style={{ fontSize: agentNameFontSize - 2 }}>{agentName}</div>
              <div className="text-[11px] text-[#71767b]">@{cleanHandle}</div>
            </div>
            <button
              onClick={handleDismissPopup}
              aria-label="Dismiss notification"
              className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-white/[0.12]"
              style={{ transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            >
              <CloseIcon size={13} />
            </button>
          </div>
          <div style={{ background: isDark ? "#15202B" : "#f7f9f9", padding: "13px 14px 14px" }}>
            <div
              className="inline-block max-w-full rounded-[4px_18px_18px_18px] leading-relaxed shadow-[0_1px_4px_rgba(0,0,0,0.07)]"
              style={{ background: bubbleBg, color: textPrimary, border: `1px solid ${border}`, fontSize: greetingFontSize, padding: "10px 13px" }}
            >
              {popupMessage}
            </div>
            <div className={cn("mt-2.5 text-[11.5px]", isRight ? "text-right" : "text-left")} style={{ color: textMuted }}>
              Tap to reply on X →
            </div>
          </div>
        </div>
      )}

      <div
        className={cn("absolute bottom-[76px] w-[360px] overflow-hidden border", isRight ? "right-0" : "left-0")}
        style={{
          borderColor: border,
          borderRadius: widgetBorderRadius,
          background: isDark ? "#1E2732" : "#fff",
          boxShadow: isOpen ? (isDark ? "0 24px 72px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)" : "0 24px 72px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.1)") : "none",
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
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ background: X_BLACK }}>
          <div className="relative">
            <AvatarEl size={46} border="2px solid #2f3336" src={agentAvatar} isDark={isDark} />
            <div className="absolute bottom-px right-px h-3 w-3 rounded-full border-[2.5px] border-black" style={{ background: dotColor }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-extrabold leading-tight tracking-tight text-[#e7e9ea]" style={{ fontSize: agentNameFontSize }}>{agentName}</span>
              {followsYou && (
                <span className="rounded px-1.5 py-px text-[10px] font-semibold tracking-wide text-[#71767b]" style={{ background: "#2f3336" }}>
                  FOLLOWS YOU
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[#71767b]" style={{ fontSize: agentNameFontSize - 3 }}>
              <span>@{cleanHandle}</span>
              <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-[#71767b]" />
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dotColor }} />
              <span>{statusText}</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close chat"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08]"
            style={{ transition: "background 0.15s, transform 0.2s" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.18)";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <CloseIcon color="#e7e9ea" />
          </button>
        </div>

        {isOffline && (
          <div className="flex items-start gap-1.5 border-b px-3.5 py-2" style={{ borderColor: isDark ? "#2f3336" : "#fde68a", background: isDark ? "#1a1f23" : "#fef3c7", color: isDark ? "#71767b" : "#92400e", fontSize: greetingFontSize - 1.5 }}>
            <span className="shrink-0 text-sm">🔔</span>
            <span>{offlineMessage}</span>
          </div>
        )}
        {isAway && (
          <div className="flex items-center gap-1.5 border-b px-3.5 py-2" style={{ borderColor: isDark ? "#2f3336" : "#fde68a", background: isDark ? "#1a1f23" : "#fffbeb", color: isDark ? "#71767b" : "#92400e", fontSize: greetingFontSize - 1.5 }}>
            <span className="text-sm">🕐</span>
            <span>Response times may be slower right now.</span>
          </div>
        )}

        <div className="flex max-h-[320px] min-h-[220px] flex-col gap-2.5 overflow-y-auto px-3.5 py-4" style={{ background: bg }}>
          {showTyping && (
            <div className="flex items-end gap-2">
              <MsgAvatar src={agentAvatar} isDark={isDark} />
              <div
                className="flex items-center gap-1.5 rounded-[4px_18px_18px_18px]"
                style={{ background: bubbleBg, border: `1px solid ${border}`, animation: "xt-msg-in 0.3s ease forwards", padding: "11px 16px" }}
              >
                <span className="h-[7px] w-[7px] animate-[xt-dot_1.2s_ease-in-out_0s_infinite] rounded-full" style={{ background: textMuted }} />
                <span className="h-[7px] w-[7px] animate-[xt-dot_1.2s_ease-in-out_0.2s_infinite] rounded-full" style={{ background: textMuted }} />
                <span className="h-[7px] w-[7px] animate-[xt-dot_1.2s_ease-in-out_0.4s_infinite] rounded-full" style={{ background: textMuted }} />
              </div>
            </div>
          )}

          {greetingVisible && (
            <div className="flex items-end gap-2" style={{ animation: "xt-msg-in 0.38s cubic-bezier(0.34,1.2,0.64,1) forwards" }}>
              <MsgAvatar src={agentAvatar} isDark={isDark} />
              <div className="max-w-[256px]">
                <div
                  className="whitespace-pre-line rounded-[4px_18px_18px_18px] px-3.5 py-2.5 leading-relaxed"
                  style={{ background: bubbleBg, border: `1px solid ${border}`, color: textPrimary, fontSize: greetingFontSize }}
                >
                  {greeting}
                </div>
                <div className="mt-1 pl-1 text-[11px]" style={{ color: textMuted }}>
                  {msgTime}
                </div>
              </div>
            </div>
          )}

          {greetingVisible && quickReplies.length > 0 && (
            <div className="mt-1 flex flex-col" style={{ animation: "xt-msg-in 0.42s cubic-bezier(0.34,1.2,0.64,1) 0.1s both", gap: 7 }}>
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickReply(qr)}
                  className="border-[1.5px] text-left font-medium"
                  style={{ borderColor: isDark ? "#2f3336" : "#cfd9de", color: textPrimary, fontSize: quickReplyFontSize, borderRadius: buttonBorderRadius, padding: "9px 16px", transition: "all 0.18s ease" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark ? "#2f3336" : "#f7f9f9";
                    e.currentTarget.style.borderColor = isDark ? "#536471" : "#0f1419";
                    e.currentTarget.style.transform = "translateX(3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = isDark ? "#2f3336" : "#cfd9de";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {qr.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t px-3 py-2.5" style={{ borderColor: border, background: isDark ? "#1E2732" : "#fff" }}>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Start a message"
            aria-label="Type a message"
            className="flex-1 rounded-[24px] border-[1.5px] px-4 py-2.5 outline-none"
            style={{ background: inputBg, color: textPrimary, borderColor: border, fontSize: inputFontSize, fontFamily, transition: "border-color 0.15s" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
            onBlur={(e) => (e.currentTarget.style.borderColor = border)}
          />
          <button
            onClick={handleSend}
            aria-label="Send message"
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border-[1.5px]"
            style={{
              background: hasInput ? X_BLACK : isDark ? "#2f3336" : "#e7e9ea",
              borderColor: hasInput ? X_BLACK : isDark ? "#536471" : "#cfd9de",
              cursor: hasInput ? "pointer" : "default",
              boxShadow: hasInput ? "0 4px 14px rgba(0,0,0,0.25)" : "none",
              transition: "background 0.18s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s",
            }}
            onMouseEnter={(e) => {
              if (hasInput) e.currentTarget.style.transform = "scale(1.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <SendIcon color={hasInput ? "#fff" : textMuted} />
          </button>
        </div>

        <div className="flex items-center justify-center border-t text-[11px]" style={{ borderColor: border, background: isDark ? "#1E2732" : "#fff", color: textMuted, padding: "5px 0 9px", gap: 5 }}>
          <XIcon size={10} color={textMuted} />
          <span>Message us on X</span>
        </div>
      </div>

      <div className="relative inline-flex">
        <button
          onClick={isOpen ? handleClose : handleOpen}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          aria-expanded={isOpen}
          className="relative flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full"
          style={{
            background: isOpen ? "linear-gradient(135deg, #ff6b6b, #ee5a24)" : X_BLACK,
            boxShadow: isOpen ? "0 6px 24px rgba(238,90,36,0.45)" : "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(255,255,255,0.18)",
            transform: isVisible ? "scale(1)" : "scale(0)",
            opacity: isVisible ? 1 : 0,
            transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-full bg-white/[0.15]"
            style={{ transform: "scale(0)", animation: isOpen ? "xt-ripple 0.4s ease-out forwards" : "none" }}
          />
          {!isOpen && (
            <>
              <div className="pointer-events-none absolute -inset-[5px] animate-[xt-pulse_2.4s_ease-in-out_1.2s_infinite] rounded-full border-2 border-white/30" />
              <div className="pointer-events-none absolute -inset-[11px] animate-[xt-pulse_2.4s_ease-in-out_1.8s_infinite] rounded-full border opacity-50" style={{ borderColor: `${accentColor}66` }} />
            </>
          )}
          <div
            className="pointer-events-none absolute"
            style={{ transform: isOpen ? "rotate(-90deg) scale(0.3)" : "rotate(0deg) scale(1)", opacity: isOpen ? 0 : 1, transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease" }}
          >
            <XIcon size={26} color="#fff" />
          </div>
          <div
            className="pointer-events-none absolute"
            style={{ transform: isOpen ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.3)", opacity: isOpen ? 1 : 0, transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease" }}
          >
            <CloseIcon color="#fff" size={22} />
          </div>
        </button>

        {!isOpen && showBadge && notificationCount > 0 && (
          <div
            className="pointer-events-none absolute -right-1 -top-1 z-[1] flex h-5 min-w-5 items-center justify-center rounded-full border-[2.5px] border-white text-[11px] font-bold text-white"
            style={{ background: accentColor, boxShadow: `0 2px 8px ${accentColor}66`, animation: "xt-badge-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 1.1s both", padding: "0 5px" }}
          >
            {notificationCount > 9 ? "9+" : notificationCount}
          </div>
        )}
      </div>

      <style>{`
        @keyframes xt-pulse { 0% { transform: scale(1); opacity: 0.55; } 70% { transform: scale(1.6); opacity: 0; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes xt-ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes xt-badge-pop { 0% { transform: scale(0) rotate(-20deg); } 70% { transform: scale(1.25) rotate(5deg); } 100% { transform: scale(1) rotate(0deg); } }
        @keyframes xt-dot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }
        @keyframes xt-msg-in { from { transform: translateY(12px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes xt-popup-in { from { transform: translateY(18px) scale(0.88); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
