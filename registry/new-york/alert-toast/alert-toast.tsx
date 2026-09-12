"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AlertTone = "neutral" | "info" | "warning" | "success" | "error";
export type AlertIconType = "none" | "info" | "success" | "error" | "custom";
export type AlertLayout = "stacked" | "inline";
export type AlertBackground = "subtle" | "tinted";
export type AlertTheme = "light" | "dark";

export interface AlertContent {
  title?: string;
  description?: string;
  layout?: AlertLayout;
}

export interface AlertAppearance {
  tone?: AlertTone;
  background?: AlertBackground;
  accentBar?: boolean;
  icon?: AlertIconType;
  customIcon?: string;
  theme?: AlertTheme;
  radius?: number;
}

export interface AlertActions {
  showPrimary?: boolean;
  primaryLabel?: string;
  primaryExternal?: boolean;
  showSecondary?: boolean;
  secondaryLabel?: string;
  secondaryEmphasis?: boolean;
}

export interface AlertDismiss {
  dismissible?: boolean;
  autoDismiss?: boolean;
  duration?: number;
}

const TONE_PALETTES: Record<AlertTone, Record<AlertTheme, { tintedBg: string; text: string; accent: string }>> = {
  neutral: {
    light: { tintedBg: "#F4F4F6", text: "#3F3F46", accent: "#71717A" },
    dark: { tintedBg: "#202024", text: "#D4D4D8", accent: "#A1A1AA" },
  },
  info: {
    light: { tintedBg: "#EEF2FF", text: "#4F46E5", accent: "#6366F1" },
    dark: { tintedBg: "#171B33", text: "#A5B4FC", accent: "#818CF8" },
  },
  warning: {
    light: { tintedBg: "#FFF8E6", text: "#B45309", accent: "#F59E0B" },
    dark: { tintedBg: "#2E2410", text: "#FCD34D", accent: "#FBBF24" },
  },
  success: {
    light: { tintedBg: "#EEFBF2", text: "#15803D", accent: "#22C55E" },
    dark: { tintedBg: "#0F2A1C", text: "#6EE7B7", accent: "#34D399" },
  },
  error: {
    light: { tintedBg: "#FDF1F4", text: "#D6336C", accent: "#E8447A" },
    dark: { tintedBg: "#321019", text: "#FB91B5", accent: "#F43F5E" },
  },
};

const SUBTLE: Record<AlertTheme, { bg: string; strong: string; muted: string }> = {
  light: { bg: "#F7F7F8", strong: "#27272A", muted: "#71717A" },
  dark: { bg: "#1C1C1F", strong: "#FAFAFA", muted: "#A1A1AA" },
};

const SURFACE: Record<AlertTheme, { bg: string; border: string; text: string }> = {
  light: { bg: "#FFFFFF", border: "#E4E4E7", text: "#27272A" },
  dark: { bg: "#2A2A2E", border: "#3F3F46", text: "#FAFAFA" },
};

function ToastIcon({ type, customIcon, accent, size }: { type: AlertIconType; customIcon?: string; accent: string; size: number }) {
  if (type === "none") return null;

  if (type === "custom") {
    return (
      <span className="flex shrink-0 items-center justify-center leading-none" style={{ fontSize: size * 0.82, width: size, height: size }}>
        {customIcon}
      </span>
    );
  }

  if (type === "success") {
    return (
      <svg width={size} height={size} viewBox="0 0 22 22" fill="none" className="shrink-0">
        <path d="M5 11.5L9.2 15.5L17 6.5" stroke={accent} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" className="shrink-0">
      <circle cx="11" cy="11" r="11" fill={accent} />
      {type === "info" ? (
        <>
          <circle cx="11" cy="6.5" r="1.25" fill="#fff" />
          <line x1="11" y1="9.75" x2="11" y2="15.5" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="7.2" y1="7.2" x2="14.8" y2="14.8" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
          <line x1="14.8" y1="7.2" x2="7.2" y2="14.8" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function ExternalIcon({ color }: { color: string }) {
  return (
    <svg width={12} height={12} viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M3.5 8.5L8.5 3.5M5 3.5H8.5V7" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon({ color }: { color: string }) {
  return (
    <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
      <path d="M1 1L9 9M9 1L1 9" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

function PrimaryButton({ label, external, surface, onClick }: { label: string; external?: boolean; surface: { bg: string; border: string; text: string }; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-medium whitespace-nowrap"
      style={{ border: `1px solid ${surface.border}`, backgroundColor: surface.bg, color: surface.text, fontFamily: "Inter, sans-serif" }}
    >
      {label}
      {external && <ExternalIcon color={surface.text} />}
    </button>
  );
}

function SecondaryLink({ label, emphasis, accent, muted, onClick }: { label: string; emphasis?: boolean; accent: string; muted: string; onClick?: () => void }) {
  return (
    <span
      onClick={onClick}
      className="shrink-0 cursor-pointer text-[13px] whitespace-nowrap underline decoration-solid underline-offset-2"
      style={{ fontWeight: emphasis ? 700 : 500, color: emphasis ? accent : muted, fontFamily: "Inter, sans-serif" }}
    >
      {label}
    </span>
  );
}

function DismissButton({ onClick, color }: { onClick: () => void; color: string }) {
  return (
    <button onClick={onClick} aria-label="Dismiss" className="flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-md border-none bg-transparent p-0">
      <CloseIcon color={color} />
    </button>
  );
}

export interface AlertToastProps {
  content?: AlertContent;
  appearance?: AlertAppearance;
  actions?: AlertActions;
  dismiss?: AlertDismiss;
  onDismiss?: () => void;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  spacing?: number;
  enterDelay?: number;
  className?: string;
}

export function AlertToast({
  content = { title: "New update available", description: "A new version of the app is ready to install.", layout: "stacked" },
  appearance = { tone: "info", background: "tinted", accentBar: true, icon: "info", customIcon: "🙁", theme: "light", radius: 12 },
  actions = { showPrimary: true, primaryLabel: "Update now", primaryExternal: false, showSecondary: true, secondaryLabel: "Later", secondaryEmphasis: false },
  dismiss = { dismissible: true, autoDismiss: false, duration: 4 },
  onDismiss,
  onPrimaryClick,
  onSecondaryClick,
  spacing = 0,
  enterDelay = 0,
  className,
}: AlertToastProps) {
  const [visible, setVisible] = React.useState(true);

  const theme = appearance.theme ?? "light";
  const tone = TONE_PALETTES[appearance.tone ?? "info"][theme];
  const subtle = SUBTLE[theme];
  const surface = SURFACE[theme];

  const isTinted = (appearance.background ?? "tinted") === "tinted";
  const bg = isTinted ? tone.tintedBg : subtle.bg;
  const titleColor = isTinted ? tone.text : subtle.strong;
  const descColor = isTinted ? tone.text : subtle.muted;
  const closeColor = theme === "light" ? "rgba(24,24,27,0.35)" : "rgba(255,255,255,0.4)";
  const radius = appearance.radius ?? 12;
  const icon = appearance.icon ?? "info";
  const customIcon = appearance.customIcon ?? "🙁";
  const accentBar = appearance.accentBar ?? true;
  const layout = content.layout ?? "stacked";
  const showPrimary = actions.showPrimary ?? true;
  const primaryLabel = actions.primaryLabel ?? "Update now";
  const showSecondary = actions.showSecondary ?? true;
  const secondaryLabel = actions.secondaryLabel ?? "Later";
  const dismissible = dismiss.dismissible ?? true;

  const handleClose = () => {
    setVisible(false);
    onDismiss?.();
  };

  React.useEffect(() => {
    if (!dismiss.autoDismiss) return;
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, Math.max(dismiss.duration ?? 4, 0.5) * 1000);
    return () => clearTimeout(timer);
  }, [dismiss.autoDismiss, dismiss.duration, onDismiss]);

  const hasIcon = icon !== "none";
  const iconSize = 22;
  const iconOffset = hasIcon ? iconSize + 10 : 0;
  const isInline = layout === "inline";

  const descLines = (content.description ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const hasRow2 = !isInline && descLines.length > 0;
  const hasRow3 = showPrimary || (!isInline && showSecondary);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: enterDelay, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.25, ease: "easeInOut" } }}
          className="w-full shrink-0 overflow-hidden"
          style={{ marginBottom: spacing }}
        >
          <div className={cn("relative box-border w-full overflow-hidden", className)} style={{ borderRadius: radius, backgroundColor: bg }}>
            {accentBar && <div className="absolute top-0 bottom-0 left-0 w-[3px]" style={{ backgroundColor: tone.accent }} />}
            <div
              className="box-border flex flex-col px-4 py-3.5"
              style={{ gap: hasRow2 || hasRow3 ? 10 : 0, paddingLeft: accentBar ? 20 : 16, fontFamily: "Inter, sans-serif" }}
            >
              <div className="flex items-center gap-2.5">
                {hasIcon && <ToastIcon type={icon} customIcon={customIcon} accent={tone.accent} size={iconSize} />}
                <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-1.5">
                  {content.title && (
                    <span className="text-sm leading-[1.45] font-semibold" style={{ color: titleColor }}>
                      {content.title}
                    </span>
                  )}
                  {isInline && descLines.length > 0 && (
                    <span className="text-sm leading-[1.45] font-normal" style={{ color: descColor }}>
                      {descLines.join(" ")}
                    </span>
                  )}
                </div>
                {isInline && showSecondary && (
                  <SecondaryLink label={secondaryLabel} emphasis={actions.secondaryEmphasis} accent={tone.accent} muted={subtle.muted} onClick={onSecondaryClick} />
                )}
                {dismissible && <DismissButton onClick={handleClose} color={closeColor} />}
              </div>

              {hasRow2 && (
                <div className="flex flex-col gap-1" style={{ paddingLeft: iconOffset }}>
                  {descLines.map((line, i) => (
                    <span key={i} className="text-[13px] leading-[1.55]" style={{ color: descColor }}>
                      {line}
                    </span>
                  ))}
                </div>
              )}

              {hasRow3 && (
                <div className="flex items-center gap-3.5" style={{ paddingLeft: iconOffset }}>
                  {showPrimary && <PrimaryButton label={primaryLabel} external={actions.primaryExternal} surface={surface} onClick={onPrimaryClick} />}
                  {!isInline && showSecondary && (
                    <SecondaryLink label={secondaryLabel} emphasis={actions.secondaryEmphasis} accent={tone.accent} muted={subtle.muted} onClick={onSecondaryClick} />
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DemoItem {
  content: AlertContent;
  appearance: Omit<AlertAppearance, "theme" | "radius">;
  actions: AlertActions;
  dismiss: AlertDismiss;
}

const NO_ACTIONS: AlertActions = { showPrimary: false, primaryLabel: "", primaryExternal: false, showSecondary: false, secondaryLabel: "", secondaryEmphasis: false };
const NO_DISMISS: AlertDismiss = { dismissible: false, autoDismiss: false, duration: 4 };

const DEMO_ITEMS: DemoItem[] = [
  {
    content: { title: "Custom code is not validated", description: "Incorrect code may impact your website's performance", layout: "stacked" },
    appearance: { tone: "neutral", background: "subtle", accentBar: false, icon: "none" },
    actions: { ...NO_ACTIONS, showPrimary: true, primaryLabel: "Ok, I got it" },
    dismiss: NO_DISMISS,
  },
  {
    content: { title: "The data export you requested is ready!", layout: "stacked" },
    appearance: { tone: "info", background: "subtle", accentBar: true, icon: "info" },
    actions: { ...NO_ACTIONS, showPrimary: true, primaryLabel: "View the data", showSecondary: true, secondaryLabel: "Maybe later" },
    dismiss: { ...NO_DISMISS, dismissible: true },
  },
  {
    content: { title: "You have no credits left!", description: "Upgrade to continue.", layout: "inline" },
    appearance: { tone: "warning", background: "tinted", accentBar: false, icon: "info" },
    actions: { ...NO_ACTIONS, showSecondary: true, secondaryLabel: "Upgrade", secondaryEmphasis: true },
    dismiss: NO_DISMISS,
  },
  {
    content: { title: "Warning", description: "Your password strength is too low", layout: "inline" },
    appearance: { tone: "warning", background: "tinted", accentBar: false, icon: "info" },
    actions: NO_ACTIONS,
    dismiss: { ...NO_DISMISS, dismissible: true },
  },
  {
    content: { title: "Successfully uploaded!", layout: "inline" },
    appearance: { tone: "success", background: "tinted", accentBar: false, icon: "success" },
    actions: NO_ACTIONS,
    dismiss: { ...NO_DISMISS, dismissible: true },
  },
  {
    content: { description: "A new software update is available. See what's new in version 2.0.", layout: "inline" },
    appearance: { tone: "info", background: "tinted", accentBar: true, icon: "info" },
    actions: { ...NO_ACTIONS, showPrimary: true, primaryLabel: "View the changelog", primaryExternal: true },
    dismiss: { ...NO_DISMISS, dismissible: true },
  },
  {
    content: { title: "Did you know?", description: "Here's something you'd like to know.", layout: "inline" },
    appearance: { tone: "info", background: "tinted", accentBar: false, icon: "info" },
    actions: NO_ACTIONS,
    dismiss: { ...NO_DISMISS, dismissible: true },
  },
  {
    content: { title: "There was a problem with your submission", description: "Must include at least 1 number\nMust include at least 2 uppercase letters", layout: "stacked" },
    appearance: { tone: "error", background: "tinted", accentBar: true, icon: "error" },
    actions: NO_ACTIONS,
    dismiss: NO_DISMISS,
  },
  {
    content: { description: "Whoops! Something went wrong", layout: "inline" },
    appearance: { tone: "error", background: "tinted", accentBar: false, icon: "custom", customIcon: "🙁" },
    actions: { ...NO_ACTIONS, showSecondary: true, secondaryLabel: "Send crash report", secondaryEmphasis: true },
    dismiss: NO_DISMISS,
  },
];

export interface AlertToastShowcaseProps {
  radius?: number;
  lightBg?: string;
  darkBg?: string;
  gap?: number;
  outerRadius?: number;
  className?: string;
}

export function AlertToastShowcase({ radius = 12, lightBg = "#FFFFFF", darkBg = "#0A0A0A", gap = 28, outerRadius = 20, className }: AlertToastShowcaseProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setIsMobile(width < 560);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const panels: { theme: AlertTheme; bg: string }[] = [
    { theme: "light", bg: lightBg },
    { theme: "dark", bg: darkBg },
  ];

  return (
    <div ref={containerRef} className={cn("flex h-full w-full overflow-hidden", isMobile ? "flex-col" : "flex-row", className)} style={{ borderRadius: outerRadius }}>
      {panels.map((panel) => (
        <div key={panel.theme} className="box-border flex flex-1 flex-col overflow-auto" style={{ backgroundColor: panel.bg, padding: gap }}>
          {DEMO_ITEMS.map((item, i) => (
            <AlertToast key={i} content={item.content} appearance={{ ...item.appearance, theme: panel.theme, radius }} actions={item.actions} dismiss={item.dismiss} spacing={gap * 0.45} enterDelay={i * 0.04} />
          ))}
        </div>
      ))}
    </div>
  );
}
