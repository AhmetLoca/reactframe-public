"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BrowserMockupStyle = "mac" | "windows" | "mobile";
export type BrowserMockupFit = "cover" | "contain";

export interface BrowserMockupProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children" | "style"> {
  browserStyle?: BrowserMockupStyle;
  darkMode?: boolean;
  children?: React.ReactNode;
  media?: string;
  mediaAlt?: string;
  mobileMedia?: string;
  videoUrl?: string;
  autoPlay?: boolean;
  fit?: BrowserMockupFit;
  contentBg?: string;
  url?: string;
  pageTitle?: string;
  tabCount?: number;
  tabTitles?: string[];
  showLock?: boolean;
  borderRadius?: number;
  showShadow?: boolean;
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

function cleanDomain(url: string): string {
  return (url || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
}

const TrafficLights = ({ size = 12 }: { size?: number }) => (
  <div aria-hidden="true" className="flex items-center gap-2">
    <span className="block rounded-full" style={{ width: size, height: size, background: "#ed6a5e" }} />
    <span className="block rounded-full" style={{ width: size, height: size, background: "#f4bf4f" }} />
    <span className="block rounded-full" style={{ width: size, height: size, background: "#61c454" }} />
  </div>
);

const WinControls = ({ c = "rgba(255,255,255,0.75)" }: { c?: string }) => (
  <div aria-hidden="true" className="flex h-full items-center">
    {[
      <svg key="min" width={11} height={11} viewBox="0 0 12 12">
        <line x1="2" y1="6" x2="10" y2="6" stroke={c} strokeWidth="1" />
      </svg>,
      <svg key="max" width={11} height={11} viewBox="0 0 12 12">
        <rect x="2" y="2" width="8" height="8" fill="none" stroke={c} strokeWidth="1" />
      </svg>,
      <svg key="close" width={11} height={11} viewBox="0 0 12 12">
        <line x1="2" y1="2" x2="10" y2="10" stroke={c} strokeWidth="1" />
        <line x1="10" y1="2" x2="2" y2="10" stroke={c} strokeWidth="1" />
      </svg>,
    ].map((icon, i) => (
      <div key={i} className="flex h-[30px] w-9 items-center justify-center">
        {icon}
      </div>
    ))}
  </div>
);

const IconBack = ({ size = 15, c = "rgba(0,0,0,0.5)" }: { size?: number; c?: string }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconForward = ({ size = 15, c = "rgba(0,0,0,0.5)" }: { size?: number; c?: string }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconRefresh = ({ size = 14, c = "rgba(0,0,0,0.5)" }: { size?: number; c?: string }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);
const IconLock = ({ size = 11, c = "rgba(0,0,0,0.55)" }: { size?: number; c?: string }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
const IconStar = ({ size = 13, c = "rgba(0,0,0,0.4)" }: { size?: number; c?: string }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconPlus = ({ size = 13, c = "rgba(255,255,255,0.6)" }: { size?: number; c?: string }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconClose = ({ size = 10, c = "rgba(0,0,0,0.45)" }: { size?: number; c?: string }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round">
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);
const IconMenuDots = ({ c = "rgba(0,0,0,0.55)" }: { c?: string }) => (
  <svg aria-hidden="true" width={15} height={15} viewBox="0 0 24 24" fill={c}>
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);
const IconShare = ({ size = 16, c = "#007aff" }: { size?: number; c?: string }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 6l-4-4-4 4" />
    <line x1="12" y1="2" x2="12" y2="15" />
    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
  </svg>
);
const IconBookOpen = ({ size = 15, c = "#007aff" }: { size?: number; c?: string }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
    <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
  </svg>
);

function Favicon({ domain, size = 14 }: { domain: string; size?: number }) {
  const letter = (domain.replace(/^https?:\/\//, "").replace(/^www\./, "")[0] || "?").toUpperCase();
  let hash = 0;
  for (let i = 0; i < domain.length; i++) hash = (hash * 31 + domain.charCodeAt(i)) % 360;
  return (
    <div aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-[3px]" style={{ width: size, height: size, background: `hsl(${hash}, 55%, 45%)` }}>
      <span className="leading-none font-bold text-white" style={{ fontSize: size * 0.6 }}>
        {letter}
      </span>
    </div>
  );
}

function getChromeTheme(dark: boolean) {
  return dark
    ? {
        titleBar: "#2b2b2e",
        activeTab: "#1c1c1f",
        inactiveTabText: "rgba(255,255,255,0.55)",
        activeTabText: "rgba(255,255,255,0.9)",
        urlBarBg: "#1c1c1f",
        urlPillBg: "#323236",
        urlText: "rgba(255,255,255,0.8)",
        iconStrong: "rgba(255,255,255,0.7)",
        iconWeak: "rgba(255,255,255,0.25)",
        border: "rgba(255,255,255,0.08)",
        frameBorder: "rgba(255,255,255,0.1)",
        chromeBg: "#1c1c1f",
        statusBarText: "#fff",
      }
    : {
        titleBar: "#dee1e6",
        activeTab: "#fff",
        inactiveTabText: "rgba(0,0,0,0.55)",
        activeTabText: "rgba(0,0,0,0.85)",
        urlBarBg: "#fff",
        urlPillBg: "#f1f3f4",
        urlText: "rgba(0,0,0,0.7)",
        iconStrong: "rgba(0,0,0,0.5)",
        iconWeak: "rgba(0,0,0,0.25)",
        border: "rgba(0,0,0,0.08)",
        frameBorder: "rgba(0,0,0,0.08)",
        chromeBg: "#fff",
        statusBarText: "#000",
      };
}

function BrowserContent(p: BrowserMockupProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const videoWrapRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(true);
  const mediaUrl = p.media || p.videoUrl || "";
  const isVideo = !!p.videoUrl || isVideoUrl(mediaUrl);

  React.useEffect(() => {
    if (!videoWrapRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(videoWrapRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!videoRef.current) return;
    if (p.autoPlay === false || !isVisible) videoRef.current.pause();
    else videoRef.current.play().catch(() => {});
  }, [p.autoPlay, isVisible]);

  if (p.children) {
    return (
      <div className="h-full w-full overflow-auto" style={{ background: p.contentBg ?? "#fff" }}>
        {p.children}
      </div>
    );
  }

  if (isVideo && (p.videoUrl || mediaUrl)) {
    return (
      <div ref={videoWrapRef} role="img" aria-label={p.mediaAlt || p.pageTitle || "Page preview video"} className="h-full w-full overflow-hidden bg-black">
        <video ref={videoRef} src={p.videoUrl || mediaUrl} muted loop playsInline aria-hidden="true" tabIndex={-1} className="block h-full w-full" style={{ objectFit: p.fit ?? "cover" }} />
      </div>
    );
  }

  if (mediaUrl) {
    return (
      <div className="h-full w-full overflow-hidden" style={{ background: p.contentBg ?? "#fff" }}>
        <img src={mediaUrl} alt={p.mediaAlt || p.pageTitle || "Page preview"} className="block h-full w-full" style={{ objectFit: p.fit ?? "cover" }} />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center" style={{ background: p.contentBg ?? "#f4f4f5" }}>
      <span className="text-[13px]" style={{ color: "rgba(0,0,0,0.35)" }}>
        Add an image, video, or children
      </span>
    </div>
  );
}

function MacBrowser(p: BrowserMockupProps) {
  const tabCount = Math.max(1, Math.min(5, p.tabCount ?? 1));
  const [activeTab, setActiveTab] = React.useState(0);
  const tabTitles = p.tabTitles && p.tabTitles.length ? p.tabTitles.slice(0, tabCount) : Array.from({ length: tabCount }, (_, i) => (i === 0 ? (p.pageTitle ?? "New Tab") : "New Tab"));

  const url = p.url ?? "yourproduct.com";
  const dark = p.darkMode === true;
  const t = getChromeTheme(dark);

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]"
      style={{ borderRadius: p.borderRadius ?? 10, boxShadow: p.showShadow !== false ? "0 24px 60px -12px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.12)" : "none", border: `1px solid ${t.frameBorder}`, background: t.chromeBg }}
    >
      <div className="flex shrink-0 flex-col" style={{ background: t.titleBar }}>
        <div className="flex h-9 items-center gap-4 px-3">
          <TrafficLights />
          {tabCount > 1 && (
            <div role="tablist" className="flex h-full flex-1 items-end gap-0.5 overflow-hidden">
              {tabTitles.map((title, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={activeTab === i}
                  onClick={() => setActiveTab(i)}
                  className="flex h-7 max-w-40 min-w-0 flex-1 items-center gap-1.5 rounded-t-lg border-0 px-2.5"
                  style={{ background: activeTab === i ? t.activeTab : "transparent" }}
                >
                  <Favicon domain={url} size={12} />
                  <span className="flex-1 overflow-hidden text-left text-xs text-ellipsis whitespace-nowrap" style={{ color: activeTab === i ? t.activeTabText : t.inactiveTabText }}>
                    {title}
                  </span>
                  {activeTab === i && <IconClose size={9} c={t.iconStrong} />}
                </button>
              ))}
              <div className="flex h-[26px] w-[26px] items-center justify-center">
                <IconPlus c={t.iconWeak} />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 px-3 py-1.5" style={{ background: t.urlBarBg, borderBottom: `1px solid ${t.border}` }}>
          <div className="flex shrink-0 gap-1.5">
            <IconBack c={t.iconStrong} />
            <IconForward c={t.iconWeak} />
            <IconRefresh c={t.iconStrong} />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 py-1" style={{ background: t.urlPillBg }}>
            {p.showLock !== false && <IconLock c={t.iconStrong} />}
            <span className="overflow-hidden text-[12.5px] text-ellipsis whitespace-nowrap" style={{ color: t.urlText }}>
              {cleanDomain(url)}
            </span>
          </div>
          <div className="shrink-0">
            <IconStar c={t.iconWeak} />
          </div>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <BrowserContent {...p} />
      </div>
    </div>
  );
}

function WinBrowser(p: BrowserMockupProps) {
  const tabCount = Math.max(1, Math.min(5, p.tabCount ?? 1));
  const [activeTab, setActiveTab] = React.useState(0);
  const tabTitles = p.tabTitles && p.tabTitles.length ? p.tabTitles.slice(0, tabCount) : Array.from({ length: tabCount }, (_, i) => (i === 0 ? (p.pageTitle ?? "New Tab") : "New Tab"));

  const url = p.url ?? "yourproduct.com";
  const dark = p.darkMode === true;
  const t = getChromeTheme(dark);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden" style={{ borderRadius: p.borderRadius ?? 8, boxShadow: p.showShadow !== false ? "0 24px 60px -12px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.12)" : "none", border: `1px solid ${t.frameBorder}`, background: t.chromeBg }}>
      <div className="flex h-9 shrink-0 items-center" style={{ background: t.titleBar }}>
        <div role="tablist" className="flex h-full flex-1 items-end gap-px overflow-hidden pl-2">
          {tabTitles.map((title, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={activeTab === i}
              onClick={() => setActiveTab(i)}
              className="mt-1 flex h-8 max-w-45 min-w-0 flex-1 items-center gap-1.5 rounded-t-lg border-0 px-2.5"
              style={{ background: activeTab === i ? t.activeTab : "transparent" }}
            >
              <Favicon domain={url} size={12} />
              <span className="flex-1 overflow-hidden text-left text-xs text-ellipsis whitespace-nowrap" style={{ color: activeTab === i ? t.activeTabText : t.inactiveTabText }}>
                {title}
              </span>
              {activeTab === i && <IconClose size={9} c={t.iconStrong} />}
            </button>
          ))}
          <div className="mb-0.5 flex h-7 w-7 items-center justify-center">
            <IconPlus c={t.iconWeak} />
          </div>
        </div>
        <WinControls c={t.iconStrong} />
      </div>

      <div className="flex shrink-0 items-center gap-2.5 px-3 py-1.5" style={{ background: t.urlBarBg, borderBottom: `1px solid ${t.border}` }}>
        <div className="flex shrink-0 gap-1.5">
          <IconBack c={t.iconStrong} />
          <IconForward c={t.iconWeak} />
          <IconRefresh c={t.iconStrong} />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full px-3.5 py-1" style={{ background: t.urlPillBg }}>
          {p.showLock !== false && <IconLock c={t.iconStrong} />}
          <span className="overflow-hidden text-[12.5px] text-ellipsis whitespace-nowrap" style={{ color: t.urlText }}>
            {cleanDomain(url)}
          </span>
        </div>
        <IconMenuDots c={t.iconStrong} />
      </div>

      <div className="relative min-h-0 flex-1">
        <BrowserContent {...p} />
      </div>
    </div>
  );
}

function MobileBrowser(p: BrowserMockupProps) {
  const url = p.url ?? "yourproduct.com";
  const dark = p.darkMode === true;
  const t = getChromeTheme(dark);
  const mobileProps: BrowserMockupProps = p.mobileMedia ? { ...p, media: p.mobileMedia } : p;

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]"
      style={{ borderRadius: p.borderRadius ?? 28, boxShadow: p.showShadow !== false ? "0 24px 60px -12px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.12)" : "none", border: `1px solid ${t.frameBorder}`, background: t.chromeBg }}
    >
      <div aria-hidden="true" className="flex shrink-0 items-center justify-between px-4.5 pt-2.5 pb-1">
        <span className="text-[13px] font-semibold" style={{ color: t.statusBarText }}>
          9:41
        </span>
        <div className="flex items-center gap-1">
          <svg width={14} height={10} viewBox="0 0 24 16" fill={t.statusBarText}>
            <rect x="1" y="9" width="3" height="6" />
            <rect x="6" y="6" width="3" height="9" />
            <rect x="11" y="3" width="3" height="12" />
            <rect x="16" y="0" width="3" height="15" />
          </svg>
          <svg width={20} height={11} viewBox="0 0 28 16" fill="none" stroke={t.statusBarText} strokeWidth="1.3">
            <rect x="1" y="1" width="22" height="14" rx="3" />
            <rect x="24" y="6" width="2" height="4" fill={t.statusBarText} stroke="none" />
            <rect x="3" y="3" width="18" height="10" rx="1.5" fill={t.statusBarText} stroke="none" />
          </svg>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <BrowserContent {...mobileProps} />
      </div>

      <div className="shrink-0 px-2.5 py-2" style={{ background: dark ? "rgba(28,28,31,0.95)" : "rgba(248,248,248,0.95)", borderTop: `1px solid ${t.border}` }}>
        <div className="mb-2 flex items-center justify-center gap-1.5 rounded-[10px] px-2.5 py-2" style={{ background: t.urlPillBg }}>
          {p.showLock !== false && <IconLock size={12} c={t.iconStrong} />}
          <span className="overflow-hidden text-[13px] text-ellipsis whitespace-nowrap" style={{ color: t.urlText }}>
            {cleanDomain(url)}
          </span>
          <IconRefresh size={12} c={t.iconStrong} />
        </div>
        <div aria-hidden="true" className="flex items-center justify-between px-1.5">
          <IconBack size={20} c="#007aff" />
          <IconForward size={20} c="rgba(0,122,255,0.3)" />
          <IconShare />
          <IconBookOpen />
          <svg width={18} height={16} viewBox="0 0 24 22" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="9" height="14" rx="1.5" />
            <rect x="13" y="4" width="9" height="14" rx="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function BrowserMockup({ browserStyle = "mac", darkMode = false, className, ...props }: BrowserMockupProps) {
  const frame =
    browserStyle === "windows" ? (
      <WinBrowser {...props} darkMode={darkMode} />
    ) : browserStyle === "mobile" ? (
      <MobileBrowser {...props} darkMode={darkMode} />
    ) : (
      <MacBrowser {...props} darkMode={darkMode} />
    );

  return <div className={cn("h-full w-full", className)}>{frame}</div>;
}
