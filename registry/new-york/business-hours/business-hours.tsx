"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BusinessHoursDay {
  day: string;
  hours: string;
}

export interface BusinessHoursProps extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  title?: string;
  subtitle?: string;
  headerTitle?: string;
  days?: BusinessHoursDay[];
  /** IANA time zone of the business, e.g. "Europe/Istanbul", so "Open now" is right for visitors anywhere. Defaults to the visitor's clock. */
  timeZone?: string;
  showStatus?: boolean;
  openText?: string;
  closedText?: string;
  theme?: "dark" | "light";
  showThemeToggle?: boolean;
  address?: string;
  phone?: string;
  directionsUrl?: string;
  showDirectionsButton?: boolean;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  backgroundVideo?: string;
  borderRadius?: number;
  titleFont?: React.CSSProperties;
  uiFont?: React.CSSProperties;
}

const DEFAULT_DAYS: BusinessHoursDay[] = [
  { day: "Monday", hours: "09:00 AM - 05:00 PM" },
  { day: "Tuesday", hours: "09:00 AM - 05:00 PM" },
  { day: "Wednesday", hours: "09:00 AM - 05:00 PM" },
  { day: "Thursday", hours: "09:00 AM - 05:00 PM" },
  { day: "Friday", hours: "09:00 AM - 05:00 PM" },
  { day: "Saturday", hours: "09:00 AM - 05:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

function parseTimeToMinutes(value: string): number | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10) % 12;
  const minutes = parseInt(match[2], 10);
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + minutes;
}

function getOpenRange(hours: string): [number, number] | null {
  if (hours.toLowerCase().includes("closed")) return null;
  const [openPart, closePart] = hours.split(" - ");
  if (!openPart || !closePart) return null;
  const start = parseTimeToMinutes(openPart);
  const end = parseTimeToMinutes(closePart);
  if (start === null || end === null) return null;
  return [start, end];
}

function minutesTo24Hour(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Weekday index (0 = Sunday) and minutes past midnight, in `timeZone` or the visitor's own clock. */
function clockNow(timeZone?: string): { day: number; minutes: number } {
  const now = new Date();
  if (!timeZone) return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes() };
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday")), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function BusinessHours({
  title = "Visit Our Office",
  subtitle = "Drop by our workspace for a meeting, a tour, or just to say hello. Check today's status before you head over.",
  headerTitle = "Office Hours",
  days = DEFAULT_DAYS,
  timeZone,
  showStatus = true,
  openText = "Open Now",
  closedText = "Closed",
  theme = "dark",
  showThemeToggle = true,
  address = "",
  phone = "",
  directionsUrl = "",
  showDirectionsButton = true,
  backgroundImage,
  backgroundImageAlt = "",
  backgroundVideo,
  borderRadius = 20,
  titleFont,
  uiFont,
  className,
  style,
  ...props
}: BusinessHoursProps) {
  const [liveTheme, setLiveTheme] = React.useState<"dark" | "light">(theme);
  React.useEffect(() => {
    setLiveTheme(theme);
  }, [theme]);
  const isDark = liveTheme === "dark";
  const hasMedia = Boolean(backgroundImage || backgroundVideo);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const toggleTheme = () => setLiveTheme((t) => (t === "dark" ? "light" : "dark"));

  // Computed only on the client, after mount — "now" differs between the
  // server-render pass and hydration, so deriving open/closed during render
  // would risk a hydration mismatch.
  const [isOpenNow, setIsOpenNow] = React.useState(false);
  const [pulseOn, setPulseOn] = React.useState(false);

  React.useEffect(() => {
    const compute = () => {
      const now = clockNow(timeZone);
      const todayEntry = days.find((d) => d.day === DAY_NAMES[now.day]);
      const range = todayEntry ? getOpenRange(todayEntry.hours) : null;
      if (!range) {
        setIsOpenNow(false);
        return;
      }
      const nowMinutes = now.minutes;
      setIsOpenNow(range[1] > range[0] ? nowMinutes >= range[0] && nowMinutes < range[1] : nowMinutes >= range[0] || nowMinutes < range[1]);
    };
    compute();
    const id = setInterval(compute, 60000);
    return () => clearInterval(id);
  }, [days, timeZone]);

  React.useEffect(() => {
    const id = setInterval(() => setPulseOn((p) => !p), 1000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    if (!backgroundVideo) return;
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [backgroundVideo]);

  const directionsHref = directionsUrl || (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "");

  // JSON-LD (schema.org LocalBusiness — opening hours must be 24h "HH:MM" per spec)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: title,
    description: subtitle,
    ...(address && { address }),
    ...(phone && { telephone: phone }),
    ...(backgroundImage && { image: backgroundImage }),
    openingHoursSpecification: days
      .map((d) => ({ day: d.day, range: getOpenRange(d.hours) }))
      .filter((d): d is { day: string; range: [number, number] } => d.range !== null)
      .map((d) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: d.day,
        opens: minutesTo24Hour(d.range[0]),
        closes: minutesTo24Hour(d.range[1]),
      })),
  };

  const colors = {
    pageBg: isDark ? "#080808" : "#ffffff",
    overlay: isDark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.7)",
    cardBg: isDark ? "rgba(24,24,24,0.9)" : "#ffffff",
    cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    headerBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
    headerBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    title: isDark ? "#ffffff" : "#111111",
    subtitle: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
    day: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)",
    hours: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.85)",
    hoursClosed: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.6)",
    rowAlt: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.015)",
    rowBorder: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    toggleBg: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
    toggleBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
    toggleIcon: isDark ? "#ffffff" : "#111111",
    statusOpenDot: "#3ddc84",
    statusOpenText: isDark ? "#78ffb4" : "#166534",
    statusClosedDot: isDark ? "#ff7878" : "#d14343",
    statusClosedText: isDark ? "#ff9494" : "#d14343",
    directionsBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)",
    directionsBorder: isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.1)",
    directionsText: isDark ? "#ffffff" : "#111111",
  };

  return (
    <section
      role="region"
      aria-label={`${title}, opening hours`}
      className={cn("relative box-border flex w-full flex-col items-center justify-center overflow-hidden px-10 py-10", className)}
      style={{ background: hasMedia ? (isDark ? "#0a0a0a" : "#f5f5f5") : colors.pageBg, transition: "background 0.4s ease", ...style }}
      {...props}
    >
      {hasMedia && (
        <div className="absolute inset-0 z-0">
          {backgroundVideo ? (
            <video ref={videoRef} muted loop playsInline poster={backgroundImage} aria-hidden="true" className="block h-full w-full object-cover">
              <source src={backgroundVideo} />
            </video>
          ) : (
            backgroundImage && <img src={backgroundImage} alt={backgroundImageAlt} className="block h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 transition-colors duration-500" style={{ background: colors.overlay }} />
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {showThemeToggle && (
        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={isDark}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="absolute top-5 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-xl border p-0 backdrop-blur-md transition-all duration-300 outline-none focus-visible:ring-2"
          style={{ background: colors.toggleBg, borderColor: colors.toggleBorder }}
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="4" stroke={colors.toggleIcon} strokeWidth="1.8" />
              <path
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                stroke={colors.toggleIcon}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5z" stroke={colors.toggleIcon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      )}

      <div className="relative z-[2] flex w-full flex-col items-center">
        <header className="mb-10 max-w-[480px] text-center">
          <h2 className="mt-0 mb-3.5 text-[32px] leading-[1.2] tracking-tight" style={{ color: colors.title, transition: "color 0.4s ease", ...titleFont }}>
            {title}
          </h2>
          <p className="mx-auto mt-0 mb-0 max-w-[360px] text-sm leading-relaxed" style={{ color: colors.subtitle, transition: "color 0.4s ease", ...uiFont, fontSize: uiFont?.fontSize ?? 14 }}>
            {subtitle}
          </p>
        </header>

        <div
          className="w-full max-w-[360px] overflow-hidden border transition-all duration-300"
          style={{
            background: colors.cardBg,
            borderColor: colors.cardBorder,
            borderRadius,
            backdropFilter: isDark ? "blur(20px)" : "none",
            boxShadow: isDark ? "0 25px 50px -12px rgba(0,0,0,0.55)" : "0 20px 40px -12px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-center justify-between border-b px-6 py-4.5" style={{ background: colors.headerBg, borderColor: colors.headerBorder }}>
            <h3 className="m-0 text-lg" style={{ color: colors.title, transition: "color 0.4s ease", ...titleFont, fontSize: 18 }}>
              {headerTitle}
            </h3>

            {showStatus && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase"
                style={{ color: isOpenNow ? colors.statusOpenText : colors.statusClosedText, ...uiFont, fontSize: 11 }}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full transition-shadow duration-1000"
                  style={{
                    background: isOpenNow ? colors.statusOpenDot : colors.statusClosedDot,
                    boxShadow: isOpenNow && pulseOn ? "0 0 0 5px rgba(61,220,132,0.25)" : "0 0 8px rgba(0,0,0,0)",
                  }}
                />
                {isOpenNow ? openText : closedText}
              </div>
            )}
          </div>

          <dl className="m-0 p-0">
            {days.map((item, i) => {
              const isClosed = item.hours.toLowerCase().includes("closed");
              return (
                <div
                  key={item.day}
                  className="flex items-center justify-between gap-3 px-6 py-4"
                  style={{ background: i % 2 === 0 ? colors.rowAlt : "transparent", borderBottom: i < days.length - 1 ? `1px solid ${colors.rowBorder}` : "none" }}
                >
                  <dt className="m-0 shrink-0 text-sm font-normal" style={{ color: colors.day, transition: "color 0.4s ease", ...uiFont, fontSize: uiFont?.fontSize ?? 14 }}>
                    {item.day}
                  </dt>
                  <dd
                    className="m-0 min-w-0 flex-1 text-right text-sm tabular-nums"
                    style={{ color: isClosed ? colors.hoursClosed : colors.hours, transition: "color 0.4s ease", ...uiFont, fontSize: uiFont?.fontSize ?? 14 }}
                  >
                    {item.hours}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        {showDirectionsButton && directionsHref && (
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={address ? `Get directions to ${address} (opens in new tab)` : "Get directions (opens in new tab)"}
            className="mt-5 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm no-underline backdrop-blur-md transition-colors"
            style={{ background: colors.directionsBg, borderColor: colors.directionsBorder, color: colors.directionsText, ...uiFont, fontSize: uiFont?.fontSize ?? 14 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 21s-7-6.13-7-11a7 7 0 1 1 14 0c0 4.87-7 11-7 11z" stroke={colors.directionsText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="2.5" stroke={colors.directionsText} strokeWidth="1.8" />
            </svg>
            Get Directions
          </a>
        )}
      </div>
    </section>
  );
}
