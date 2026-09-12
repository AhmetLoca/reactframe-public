"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FooterPlatform = "x" | "youtube" | "instagram" | "linkedin" | "tiktok" | "facebook" | "discord" | "github";

export interface FooterSocialLink {
  platform: FooterPlatform;
  url: string;
}

export interface FooterColumnLink {
  label: string;
  url: string;
}

export interface FooterColumn {
  title: string;
  links: FooterColumnLink[];
}

export interface FooterPremiumProps extends Omit<React.ComponentPropsWithoutRef<"footer">, "children"> {
  backgroundColor?: string;
  textColor?: string;
  mutedColor?: string;
  accentColor?: string;
  logoImage?: string;
  logoUrl?: string;
  logoLabel?: string;
  /** Shows a circular "Framer Partner"-style SVG seal next to the logo. */
  showBadge?: boolean;
  badgeColorStart?: string;
  badgeColorEnd?: string;
  badgeTopText?: string;
  badgeBottomText?: string;
  /** Shows a pill link (e.g. "Official Partner") below the logo row. */
  showPill?: boolean;
  pillText?: string;
  pillUrl?: string;
  description?: string;
  socials?: FooterSocialLink[];
  columns?: FooterColumn[];
  copyrightText?: string;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
}

// Coordinates are rounded to a fixed precision: Math.cos/Math.sin aren't
// guaranteed bit-identical across JS engines, so an unrounded value can
// render a different last digit between the server (Node) and client
// (browser) and trip a hydration mismatch on this SSR'd path string.
function polarPoint(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: +(cx + r * Math.cos(rad)).toFixed(3), y: +(cy + r * Math.sin(rad)).toFixed(3) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const p1 = polarPoint(cx, cy, r, startDeg);
  const p2 = polarPoint(cx, cy, r, endDeg);
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y}`;
}

function scallopPath(cx: number, cy: number, baseR: number, amplitude: number, bumps: number) {
  const samples = bumps * 8;
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * 360;
    const r = baseR + amplitude * Math.cos((bumps * t * Math.PI) / 180);
    const { x, y } = polarPoint(cx, cy, r, t);
    d += i === 0 ? `M ${x} ${y} ` : `L ${x} ${y} `;
  }
  return d + "Z";
}

function FlashIcon({ size = 14, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13.2 2 4.6 13.4h6.1l-1.9 8.6L19.4 10.6h-6.1z" fill={color} />
    </svg>
  );
}

function PartnerBadge({ size, colorStart, colorEnd, topText, bottomText }: { size: number; colorStart: string; colorEnd: string; topText: string; bottomText: string }) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.46;
  const amplitude = size * 0.035;
  const innerRingR = size * 0.37;
  const coreR = size * 0.27;
  const textR = size * 0.395;

  const sealD = React.useMemo(() => scallopPath(cx, cy, outerR, amplitude, 22), [cx, cy, outerR, amplitude]);
  const topArcD = React.useMemo(() => arcPath(cx, cy, textR, 198, 342), [cx, cy, textR]);
  const bottomArcD = React.useMemo(() => arcPath(cx, cy, textR, 18, 162), [cx, cy, textR]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 overflow-visible">
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorStart} />
          <stop offset="100%" stopColor={colorEnd} />
        </linearGradient>
        <path id={`${id}-top`} d={topArcD} />
        <path id={`${id}-bottom`} d={bottomArcD} />
      </defs>

      <path d={sealD} fill={`url(#${id}-grad)`} />
      <circle cx={cx} cy={cy} r={innerRingR} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={Math.max(1, size * 0.012)} />
      <circle cx={cx} cy={cy} r={coreR} fill={`url(#${id}-grad)`} stroke="rgba(255,255,255,0.9)" strokeWidth={Math.max(1, size * 0.012)} />

      <text fill="#fff" fontSize={size * 0.085} fontWeight={700} letterSpacing={size * 0.012}>
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
          {topText}
        </textPath>
      </text>
      <text fill="#fff" fontSize={size * 0.085} fontWeight={700} letterSpacing={size * 0.012}>
        <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle">
          {bottomText}
        </textPath>
      </text>

      <g transform={`translate(${cx}, ${cy})`}>
        <g transform={`translate(${-size * 0.065}, ${-size * 0.075}) scale(${size * 0.0075})`}>
          <path d="M13.2 2 4.6 13.4h6.1l-1.9 8.6L19.4 10.6h-6.1z" fill="#fff" />
        </g>
      </g>
    </svg>
  );
}

function SocialIcon({ platform, size = 15 }: { platform: FooterPlatform; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor" };
  switch (platform) {
    case "x":
      return (
        <svg {...common}>
          <path d="M4 3h3.6l4 5.4L16.1 3H19l-6 7.1L19.5 21h-3.6l-4.3-5.8L6.2 21H3.3l6.4-7.5L4 3z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M21.6 7.6c-.2-1-1-1.8-2-2C17.9 5.2 12 5.2 12 5.2s-5.9 0-7.6.4c-1 .2-1.8 1-2 2C2 9.3 2 12 2 12s0 2.7.4 4.4c.2 1 1 1.8 2 2 1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4c1-.2 1.8-1 2-2 .4-1.7.4-4.4.4-4.4s0-2.7-.4-4.4zM10 15.5v-7l6 3.5-6 3.5z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8zm4 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.4 6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M5 3.5A1.8 1.8 0 1 0 5 7a1.8 1.8 0 0 0 0-3.5zM3.4 9h3.2v11.5H3.4V9zM9.7 9h3.1v1.6h.05c.43-.8 1.5-1.65 3.05-1.65 3.27 0 3.87 2.15 3.87 4.95v6.6h-3.2v-5.85c0-1.4-.02-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1v5.95H9.7V9z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M14 2h2.7c.2 1.6 1.4 3 3.3 3.3v2.8a6 6 0 0 1-3.3-1v6.8a5.2 5.2 0 1 1-5.2-5.2c.2 0 .4 0 .6.03v2.8a2.4 2.4 0 1 0 1.7 2.3V2z" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M13.5 21v-7.2h2.4l.4-2.8h-2.8V9.1c0-.8.2-1.3 1.4-1.3h1.5V5.3c-.3 0-1.1-.1-2.1-.1-2.2 0-3.6 1.3-3.6 3.7v2.1H8.3v2.8h2.4V21h2.8z" />
        </svg>
      );
    case "discord":
      return (
        <svg {...common}>
          <path d="M18.9 6.2A15.7 15.7 0 0 0 15.1 5l-.2.4c1.3.4 2.4.9 3.5 1.6a12 12 0 0 0-12.8 0c1.1-.7 2.3-1.2 3.5-1.6L8.9 5a15.7 15.7 0 0 0-3.8 1.2C2.9 9.8 2.3 13.3 2.5 16.7a12.5 12.5 0 0 0 3.9 2c.3-.4.6-.9.8-1.4-.5-.2-.9-.4-1.3-.6.1-.1.2-.2.3-.3 2.5 1.2 5.2 1.2 7.7 0 .1.1.2.2.3.3-.4.2-.8.4-1.3.6.2.5.5 1 .8 1.4a12.5 12.5 0 0 0 3.9-2c.2-3.9-.7-7.3-2.7-10.5zM9.5 14.3c-.8 0-1.4-.7-1.4-1.6 0-.9.6-1.6 1.4-1.6.8 0 1.4.7 1.4 1.6 0 .9-.6 1.6-1.4 1.6zm5 0c-.8 0-1.4-.7-1.4-1.6 0-.9.6-1.6 1.4-1.6.8 0 1.4.7 1.4 1.6 0 .9-.6 1.6-1.4 1.6z" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.3-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.6 0 0 .9-.3 2.7 1a9.5 9.5 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .6 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
        </svg>
      );
  }
}

const DEFAULT_SOCIALS: FooterSocialLink[] = [
  { platform: "x", url: "https://x.com" },
  { platform: "youtube", url: "https://youtube.com" },
  { platform: "github", url: "https://github.com" },
];

const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Product", links: [{ label: "Components", url: "#" }, { label: "Templates", url: "#" }, { label: "Pricing", url: "#" }] },
  { title: "Resources", links: [{ label: "Docs", url: "#" }, { label: "Blog", url: "#" }, { label: "Support", url: "#" }] },
  { title: "Legal", links: [{ label: "Privacy Policy", url: "#" }, { label: "Terms", url: "#" }] },
];

export function FooterPremium({
  backgroundColor = "#000000",
  textColor = "#ffffff",
  mutedColor = "rgba(255,255,255,0.55)",
  accentColor = "#7C5CFF",
  logoImage,
  logoUrl = "#",
  logoLabel = "Loca",
  showBadge = false,
  badgeColorStart = "#8A6CFF",
  badgeColorEnd = "#5B3DEB",
  badgeTopText = "FRAMER",
  badgeBottomText = "PARTNER",
  showPill = false,
  pillText = "Official Framer Creator",
  pillUrl = "#",
  description = "Premium, shadcn-compatible components for your next project.",
  socials = DEFAULT_SOCIALS,
  columns = DEFAULT_COLUMNS,
  copyrightText = `Copyright ${new Date().getFullYear()}. All rights reserved.`,
  paddingTop = 64,
  paddingRight = 64,
  paddingBottom = 48,
  paddingLeft = 64,
  className,
  style,
  ...props
}: FooterPremiumProps) {
  return (
    <footer
      className={cn("w-full", className)}
      style={{ background: backgroundColor, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif", ...style }}
      {...props}
    >
      <div
        className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-10 md:flex-row md:gap-6"
        style={{ paddingTop, paddingRight, paddingBottom, paddingLeft }}
      >
        <div className="flex max-w-[360px] shrink-0 flex-col items-start">
          <div className="flex items-center gap-3">
            <a href={logoUrl} className="inline-flex items-center gap-2">
              {logoImage ? (
                <img src={logoImage} alt={logoLabel} draggable={false} className="block h-8 w-auto select-none" />
              ) : (
                <span className="text-lg font-bold" style={{ color: textColor }}>
                  {logoLabel}
                </span>
              )}
            </a>

            {showBadge && <PartnerBadge size={56} colorStart={badgeColorStart} colorEnd={badgeColorEnd} topText={badgeTopText} bottomText={badgeBottomText} />}
          </div>

          {showPill && (
            <a
              href={pillUrl}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.04] px-4 py-2 text-[13px] font-semibold whitespace-nowrap no-underline"
              style={{ color: textColor }}
            >
              <FlashIcon size={13} color={accentColor} />
              {pillText}
            </a>
          )}

          {description && (
            <p className="mt-5 max-w-[280px] text-sm leading-[1.6]" style={{ color: mutedColor }}>
              {description}
            </p>
          )}

          {socials.length > 0 && (
            <div className="mt-[18px] flex gap-2.5">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-white/[0.06] transition-colors hover:bg-white/[0.12]"
                  style={{ color: textColor }}
                >
                  <SocialIcon platform={s.platform} />
                </a>
              ))}
            </div>
          )}

          {copyrightText && (
            <p className="mt-[22px] text-[13px]" style={{ color: mutedColor }}>
              {copyrightText}
            </p>
          )}
        </div>

        <div className="flex flex-col flex-wrap gap-7 sm:flex-row sm:gap-14">
          {columns.map((col, ci) => (
            <div key={ci} className="min-w-[120px]">
              {col.title && (
                <p className="m-0 text-[15px] font-bold" style={{ color: textColor }}>
                  {col.title}
                </p>
              )}
              <div className="mt-[18px] flex flex-col gap-3.5">
                {col.links.map((l, li) => (
                  <a key={li} href={l.url} className="text-sm no-underline transition-colors hover:opacity-80" style={{ color: mutedColor }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
