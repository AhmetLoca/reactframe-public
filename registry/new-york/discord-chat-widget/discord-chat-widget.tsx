"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const D_BLURPLE = "#5865F2";

export type DiscordAvailability = "online" | "idle" | "dnd" | "offline";
export type DiscordWidgetTheme = "dark" | "light";
export type DiscordWidgetPosition = "bottom-right" | "bottom-left";

export interface DiscordQuickReply {
  label: string;
  message: string;
}

export interface DiscordChatWidgetProps {
  serverName?: string;
  serverAvatar?: string;
  channelName?: string;
  memberCount?: string;
  onlineCount?: string;
  agentName?: string;
  inviteCode: string;
  availability?: DiscordAvailability;
  showBoostBadge?: boolean;
  offlineMessage?: string;
  greeting?: string;
  quickReplies?: DiscordQuickReply[];
  popupMessage?: string;
  theme?: DiscordWidgetTheme;
  accentColor?: string;
  fontFamily?: string;
  serverNameFontSize?: number;
  greetingFontSize?: number;
  quickReplyFontSize?: number;
  inputFontSize?: number;
  widgetBorderRadius?: number;
  /** Fixed to the viewport corner (typical widget usage). Set false to render inline, e.g. inside a preview card. */
  fixed?: boolean;
  position?: DiscordWidgetPosition;
  notificationCount?: number;
  popupDelay?: number;
  typingDuration?: number;
  autoOpenDelay?: number;
}

const STATUS_COLORS: Record<DiscordAvailability, string> = {
  online: "#3ba55d",
  idle: "#faa81a",
  dnd: "#ed4245",
  offline: "#747f8d",
};

function DiscordIcon({ size = 26, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
      <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
    </svg>
  );
}

function HashIcon({ size = 13, color = "#8e9297" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}

function CloseIcon({ color = "#b9bbbe", size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
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

function MembersIcon({ color = "#8e9297", size = 12 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

function BoostIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#f47fff">
      <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z" />
    </svg>
  );
}

function ServerIcon({
  size,
  avatarSrc,
  accentColor,
  serverName,
  widgetBorderRadius,
  fontFamily,
}: {
  size: number;
  avatarSrc?: string;
  accentColor: string;
  serverName: string;
  widgetBorderRadius: number;
  fontFamily: string;
}) {
  const radius = widgetBorderRadius > 8 ? "50%" : 10;
  return avatarSrc ? (
    <img src={avatarSrc} alt="" className="shrink-0 object-cover" style={{ width: size, height: size, borderRadius: radius }} />
  ) : (
    <div
      className="flex shrink-0 items-center justify-center font-bold text-white"
      style={{ width: size, height: size, background: accentColor, fontSize: size * 0.4, borderRadius: radius, fontFamily }}
    >
      {serverName.slice(0, 2).toUpperCase()}
    </div>
  );
}

function BotAvatar({ avatarSrc, accentColor }: { avatarSrc?: string; accentColor: string }) {
  return avatarSrc ? (
    <img src={avatarSrc} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
  ) : (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: accentColor }}>
      <DiscordIcon size={18} />
    </div>
  );
}

function StatusDot({ outerSize = 14, dotSize = 10, borderColor, statusColor, isDnd }: { outerSize?: number; dotSize?: number; borderColor: string; statusColor: string; isDnd: boolean }) {
  return (
    <div className="relative shrink-0" style={{ width: outerSize, height: outerSize }}>
      <div className="absolute bottom-0 right-0 rounded-full" style={{ width: dotSize, height: dotSize, background: statusColor, border: `2.5px solid ${borderColor}` }} />
      {isDnd && <div className="absolute rounded-[1px]" style={{ bottom: 3.5, right: 3.5, width: 4, height: 1.5, background: borderColor }} />}
    </div>
  );
}

const DEFAULT_QUICK_REPLIES: DiscordQuickReply[] = [
  { label: "🎮  Join the server", message: "I'd like to join your server!" },
  { label: "❓  Get support", message: "I need some help, please." },
  { label: "💬  General questions", message: "I have a general question." },
];

export function DiscordChatWidget({
  serverName = "My Server",
  serverAvatar,
  channelName = "support",
  memberCount = "1,204",
  onlineCount = "47",
  agentName = "Support Bot",
  inviteCode,
  availability = "online",
  showBoostBadge = false,
  offlineMessage = "We're currently offline. Join the server and leave a message — we'll get back to you!",
  greeting = "Welcome! 👾\n\nNeed help? Our team is here.\nJoin the server or send us a message!",
  quickReplies = DEFAULT_QUICK_REPLIES,
  popupMessage = "👾 Hey! Join our Discord server — we're online and ready to help.",
  theme = "dark",
  accentColor = D_BLURPLE,
  fontFamily = "'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  serverNameFontSize = 15,
  greetingFontSize = 14,
  quickReplyFontSize = 13.5,
  inputFontSize = 14,
  widgetBorderRadius = 8,
  fixed = true,
  position = "bottom-right",
  notificationCount = 1,
  popupDelay = 4,
  typingDuration = 1.5,
  autoOpenDelay = 0,
}: DiscordChatWidgetProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const [showBadge, setShowBadge] = React.useState(notificationCount > 0);
  const [msgTime, setMsgTime] = React.useState("Today at 12:00 AM");
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupDismissed, setPopupDismissed] = React.useState(false);
  const [showTyping, setShowTyping] = React.useState(false);
  const [greetingVisible, setGreetingVisible] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const isDark = theme === "dark";
  const isOffline = availability === "offline";
  const isDnd = availability === "dnd";
  const statusColor = STATUS_COLORS[availability];

  const panelBg = isDark ? "#2f3136" : "#ffffff";
  const headerBg = isDark ? "#202225" : "#f2f3f5";
  const chatBg = isDark ? "#36393f" : "#ffffff";
  const inputAreaBg = isDark ? "#2f3136" : "#f2f3f5";
  const inputBg = isDark ? "#40444b" : "#e3e5e8";
  const bubbleBg = isDark ? "#32353b" : "#f2f3f5";
  const textPrimary = isDark ? "#dcddde" : "#2e3338";
  const textMuted = isDark ? "#72767d" : "#747f8d";
  const textHeader = isDark ? "#ffffff" : "#060607";
  const border = isDark ? "#202225" : "#e3e5e8";
  const hoverBg = isDark ? "rgba(79,84,92,0.16)" : "rgba(0,0,0,0.06)";

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
    if (popupDelay > 0 && !popupDismissed) {
      const t = setTimeout(() => {
        if (!isOpen) setShowPopup(true);
      }, popupDelay * 1000);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupDelay, popupDismissed]);

  React.useEffect(() => {
    if (isOpen) {
      setShowBadge(false);
      setShowPopup(false);

      const now = new Date();
      const hh = now.getHours();
      const mm = now.getMinutes().toString().padStart(2, "0");
      const period = hh >= 12 ? "PM" : "AM";
      const h12 = hh % 12 || 12;
      setMsgTime(`Today at ${h12}:${mm} ${period}`);

      if (typingDuration > 0) {
        setShowTyping(true);
        setGreetingVisible(false);
        const t = setTimeout(() => {
          setShowTyping(false);
          setGreetingVisible(true);
        }, typingDuration * 1000);
        const f = setTimeout(() => inputRef.current?.focus(), 420);
        return () => {
          clearTimeout(t);
          clearTimeout(f);
        };
      }
      setShowTyping(false);
      setGreetingVisible(true);
      const f = setTimeout(() => inputRef.current?.focus(), 420);
      return () => clearTimeout(f);
    }
    setShowTyping(false);
    setGreetingVisible(false);
  }, [isOpen, typingDuration]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleDismissPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(false);
    setPopupDismissed(true);
  };
  const openDiscord = () => {
    const code = inviteCode.replace(/^(https?:\/\/)?(discord\.gg\/|discord\.com\/invite\/)/, "");
    window.open(`https://discord.gg/${code}`, "_blank");
  };
  const handleSend = () => {
    const msg = inputValue.trim();
    if (!msg) return;
    openDiscord();
    setInputValue("");
  };
  const handleQuickReply = (qr: DiscordQuickReply) => {
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
          className={cn("absolute bottom-[76px] w-[300px] cursor-pointer overflow-hidden border", isRight ? "right-0" : "left-0")}
          style={{
            background: panelBg,
            borderColor: border,
            borderRadius: widgetBorderRadius + 4,
            boxShadow: isDark ? "0 16px 48px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.4)" : "0 16px 48px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)",
            animation: "dc-popup-in 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}
        >
          <div className="flex items-center gap-2.5 border-b px-3.5 py-3" style={{ background: headerBg, borderColor: border }}>
            <div className="relative shrink-0">
              <ServerIcon size={36} avatarSrc={serverAvatar} accentColor={accentColor} serverName={serverName} widgetBorderRadius={widgetBorderRadius} fontFamily={fontFamily} />
              <div className="absolute -bottom-0.5 -right-0.5">
                <StatusDot outerSize={14} dotSize={10} borderColor={headerBg} statusColor={statusColor} isDnd={isDnd} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 font-bold" style={{ color: textHeader, fontSize: serverNameFontSize - 2 }}>
                {serverName}
                {showBoostBadge && <BoostIcon size={11} />}
              </div>
              <div className="mt-px flex items-center gap-1 text-[11px]" style={{ color: textMuted }}>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#3ba55d]" />
                {onlineCount} online
                <span className="opacity-50">·</span>
                <MembersIcon color={textMuted} />
                {memberCount}
              </div>
            </div>
            <button
              onClick={handleDismissPopup}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded transition-colors"
              style={{ background: "none", transitionTimingFunction: "ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <CloseIcon size={14} color={textMuted} />
            </button>
          </div>
          <div className="px-3.5 pb-3.5 pt-3" style={{ background: chatBg }}>
            <div className="flex items-start gap-2.5">
              <BotAvatar avatarSrc={serverAvatar} accentColor={accentColor} />
              <div>
                <div className="mb-1 flex items-baseline gap-1.5">
                  <span className="font-semibold" style={{ color: textHeader, fontSize: greetingFontSize }}>{agentName}</span>
                  <span className="rounded px-1 py-px text-[9px] font-bold tracking-wide text-white" style={{ background: accentColor }}>BOT</span>
                </div>
                <div className="inline-block max-w-full rounded-[0_8px_8px_8px] px-3 py-2.5 leading-relaxed" style={{ background: bubbleBg, color: textPrimary, fontSize: greetingFontSize - 0.5 }}>
                  {popupMessage}
                </div>
              </div>
            </div>
            <div className={cn("mt-2.5 text-[11.5px]", isRight ? "text-right" : "text-left")} style={{ color: textMuted }}>
              Click to join server →
            </div>
          </div>
        </div>
      )}

      <div
        className={cn("absolute bottom-[76px] w-[380px] overflow-hidden border", isRight ? "right-0" : "left-0")}
        style={{
          background: panelBg,
          borderColor: border,
          borderRadius: widgetBorderRadius + 4,
          boxShadow: isOpen ? (isDark ? "0 24px 72px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.5)" : "0 24px 72px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.1)") : "none",
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
        <div className="border-b" style={{ background: headerBg, borderColor: border }}>
          <div className="flex items-center gap-2.5 px-4 pb-2.5 pt-3">
            <div className="relative shrink-0">
              <ServerIcon size={42} avatarSrc={serverAvatar} accentColor={accentColor} serverName={serverName} widgetBorderRadius={widgetBorderRadius} fontFamily={fontFamily} />
              <div className="absolute -bottom-0.5 -right-0.5">
                <StatusDot outerSize={16} dotSize={12} borderColor={headerBg} statusColor={statusColor} isDnd={isDnd} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold leading-tight tracking-tight" style={{ color: textHeader, fontSize: serverNameFontSize }}>{serverName}</span>
                {showBoostBadge && <BoostIcon size={13} />}
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3ba55d]" />
                  <span className="text-xs" style={{ color: textMuted }}>{onlineCount} online</span>
                </div>
                <div className="flex items-center gap-1">
                  <MembersIcon color={textMuted} />
                  <span className="text-xs" style={{ color: textMuted }}>{memberCount} members</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded transition-all hover:scale-110"
              style={{ transitionTimingFunction: "ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <CloseIcon color={textMuted} size={17} />
            </button>
          </div>
          <div className="flex items-center gap-1 px-4 pb-2.5">
            <div className="flex items-center gap-1 rounded-2xl py-[3px] pl-[7px] pr-2.5" style={{ background: isDark ? "rgba(79,84,92,0.3)" : "rgba(0,0,0,0.07)" }}>
              <HashIcon color={textMuted} />
              <span className="text-xs font-semibold" style={{ color: textMuted }}>{channelName}</span>
            </div>
          </div>
        </div>

        {isOffline && (
          <div className="flex items-start gap-1.5 border-b px-3.5 py-2.5" style={{ background: isDark ? "#1a1c1f" : "#fef3c7", borderColor: isDark ? "#2f3136" : "#fde68a", color: isDark ? textMuted : "#92400e", fontSize: greetingFontSize - 1.5 }}>
            <span className="shrink-0 text-sm">🔔</span>
            <span>{offlineMessage}</span>
          </div>
        )}
        {isDnd && (
          <div className="flex items-center gap-1.5 border-b px-3.5 py-2" style={{ background: isDark ? "rgba(237,66,69,0.12)" : "#fef2f2", borderColor: isDark ? "rgba(237,66,69,0.2)" : "#fca5a5", color: isDark ? "#f87171" : "#b91c1c", fontSize: greetingFontSize - 1.5 }}>
            <span className="text-[13px]">🔴</span>
            <span>Do Not Disturb — responses may be delayed.</span>
          </div>
        )}

        <div className="flex max-h-[320px] min-h-[220px] flex-col gap-0.5 overflow-y-auto px-4 py-4" style={{ background: chatBg }}>
          {showTyping && (
            <div className="flex items-start gap-3 py-1" style={{ animation: "dc-msg-in 0.28s ease forwards" }}>
              <BotAvatar avatarSrc={serverAvatar} accentColor={accentColor} />
              <div>
                <div className="mb-1 flex items-baseline gap-1.5">
                  <span className="font-semibold" style={{ color: textHeader, fontSize: greetingFontSize }}>{agentName}</span>
                  <span className="rounded px-1 py-px text-[9px] font-bold text-white" style={{ background: accentColor }}>BOT</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-[0_8px_8px_8px] px-3.5 py-2.5" style={{ background: bubbleBg }}>
                  <span className="h-[7px] w-[7px] animate-[dc-dot_1.2s_ease-in-out_0s_infinite] rounded-full" style={{ background: textMuted }} />
                  <span className="h-[7px] w-[7px] animate-[dc-dot_1.2s_ease-in-out_0.2s_infinite] rounded-full" style={{ background: textMuted }} />
                  <span className="h-[7px] w-[7px] animate-[dc-dot_1.2s_ease-in-out_0.4s_infinite] rounded-full" style={{ background: textMuted }} />
                </div>
              </div>
            </div>
          )}

          {greetingVisible && (
            <div className="flex items-start gap-3 py-1" style={{ animation: "dc-msg-in 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards" }}>
              <BotAvatar avatarSrc={serverAvatar} accentColor={accentColor} />
              <div className="flex-1">
                <div className="mb-1 flex items-baseline gap-1.5">
                  <span className="font-semibold" style={{ color: textHeader, fontSize: greetingFontSize }}>{agentName}</span>
                  <span className="rounded px-1 py-px text-[9px] font-bold text-white" style={{ background: accentColor }}>BOT</span>
                  <span className="text-[11px]" style={{ color: textMuted }}>{msgTime}</span>
                </div>
                <p className="whitespace-pre-line leading-relaxed" style={{ color: textPrimary, fontSize: greetingFontSize }}>{greeting}</p>
              </div>
            </div>
          )}

          {greetingVisible && quickReplies.length > 0 && (
            <div className="ml-12 mt-2.5 flex flex-col gap-1.5" style={{ animation: "dc-msg-in 0.38s cubic-bezier(0.34,1.2,0.64,1) 0.08s both" }}>
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickReply(qr)}
                  className="flex items-center gap-2 rounded border-[1.5px] px-3.5 py-2 text-left font-medium transition-all"
                  style={{ borderColor: isDark ? "rgba(79,84,92,0.6)" : "#d4d7dc", color: textPrimary, fontSize: quickReplyFontSize, fontFamily, transitionTimingFunction: "ease" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = hoverBg;
                    e.currentTarget.style.borderColor = isDark ? "rgba(79,84,92,1)" : "#b9bbbe";
                    e.currentTarget.style.color = textHeader;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = isDark ? "rgba(79,84,92,0.6)" : "#d4d7dc";
                    e.currentTarget.style.color = textPrimary;
                  }}
                >
                  {qr.label}
                </button>
              ))}

              <button
                onClick={openDiscord}
                className="mt-1 flex items-center justify-center gap-2 rounded px-3.5 py-2.5 text-center font-bold text-white transition-all"
                style={{ background: accentColor, boxShadow: `0 4px 16px ${accentColor}55`, fontSize: quickReplyFontSize, fontFamily, transitionTimingFunction: "ease" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(1.12)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = `0 6px 20px ${accentColor}77`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 4px 16px ${accentColor}55`;
                }}
              >
                <DiscordIcon size={16} />
                Join Server
              </button>
            </div>
          )}
        </div>

        <div className="border-t px-4 py-3" style={{ background: inputAreaBg, borderColor: border }}>
          <div className="flex items-center gap-2 rounded-lg px-2.5" style={{ background: inputBg }}>
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Message #${channelName}`}
              className="flex-1 border-none bg-transparent py-2.5 outline-none"
              style={{ color: textPrimary, fontSize: inputFontSize, fontFamily }}
            />
            <button
              onClick={handleSend}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded transition-all"
              style={{ background: inputValue.trim() ? accentColor : "transparent", cursor: inputValue.trim() ? "pointer" : "default", transitionTimingFunction: "ease" }}
              onMouseEnter={(e) => {
                if (inputValue.trim()) e.currentTarget.style.transform = "scale(1.12)";
              }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <SendIcon color={inputValue.trim() ? "#fff" : textMuted} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 border-t py-2 text-center text-[11px]" style={{ background: inputAreaBg, borderColor: border, color: textMuted }}>
          <DiscordIcon size={11} color={textMuted} />
          <span>Powered by Discord</span>
        </div>
      </div>

      <div className="relative inline-flex">
        <button
          onClick={isOpen ? handleClose : handleOpen}
          className="relative flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full"
          style={{
            background: isOpen ? "linear-gradient(135deg, #ff6b6b, #ee5a24)" : isOffline ? "linear-gradient(135deg, #4e5058, #36393f)" : `linear-gradient(135deg, ${accentColor}, #7289da)`,
            boxShadow: isOpen ? "0 6px 24px rgba(238,90,36,0.45)" : `0 8px 28px ${accentColor}70`,
            transform: isVisible ? "scale(1)" : "scale(0)",
            opacity: isVisible ? 1 : 0,
            transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease, background 0.4s ease, box-shadow 0.3s ease",
          }}
          // Source drives the hover scale imperatively via the same
          // `transform` property used for the mount pop-in animation — a
          // Tailwind `hover:scale-110` class can't win here since an
          // inline `style.transform` always overrides a stylesheet rule,
          // pseudo-class included.
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-full bg-white/15"
            style={{ transform: "scale(0)", animation: isOpen ? "dc-ripple 0.4s ease-out forwards" : "none" }}
          />
          {!isOpen && !isOffline && (
            <>
              <div className="pointer-events-none absolute -inset-[5px] animate-[dc-pulse_2.4s_ease-in-out_1.2s_infinite] rounded-full border-2" style={{ borderColor: accentColor }} />
              <div className="pointer-events-none absolute -inset-[11px] animate-[dc-pulse_2.4s_ease-in-out_1.8s_infinite] rounded-full border opacity-40" style={{ borderColor: "#7289da" }} />
            </>
          )}
          <div className="pointer-events-none absolute transition-all duration-[350ms]" style={{ transform: isOpen ? "rotate(-90deg) scale(0.3)" : "rotate(0deg) scale(1)", opacity: isOpen ? 0 : 1 }}>
            <DiscordIcon size={28} />
          </div>
          <div className="pointer-events-none absolute transition-all duration-[350ms]" style={{ transform: isOpen ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.3)", opacity: isOpen ? 1 : 0 }}>
            <CloseIcon color="#fff" size={22} />
          </div>
        </button>

        {!isOpen && showBadge && notificationCount > 0 && (
          <div
            className="pointer-events-none absolute -right-1 -top-1 z-[1] flex h-5 min-w-5 items-center justify-center rounded-full border-[2.5px] border-white bg-[#ed4245] px-1.5 text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(237,66,69,0.6)]"
            style={{ animation: "dc-badge-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 1.1s both" }}
          >
            {notificationCount > 9 ? "9+" : notificationCount}
          </div>
        )}
      </div>

      <style>{`
        @keyframes dc-pulse { 0% { transform: scale(1); opacity: 0.55; } 70% { transform: scale(1.6); opacity: 0; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes dc-ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes dc-dot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }
        @keyframes dc-msg-in { from { transform: translateY(10px) scale(0.97); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes dc-popup-in { from { transform: translateY(18px) scale(0.88); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes dc-badge-pop { 0% { transform: scale(0) rotate(-20deg); } 70% { transform: scale(1.25) rotate(5deg); } 100% { transform: scale(1) rotate(0deg); } }
      `}</style>
    </div>
  );
}
