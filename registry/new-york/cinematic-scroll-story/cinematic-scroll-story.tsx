"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavLinkItem {
  label: string;
  href: string;
}

interface CardItem {
  title: string;
  description: string;
}

interface SocialLinkItem {
  platform: "github" | "x" | "discord";
  href: string;
}

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
    </svg>
  );
}

function DiscordIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<SocialLinkItem["platform"], (size: number) => React.ReactElement> = {
  github: (size) => <GithubIcon size={size} />,
  x: (size) => <XIcon size={size} />,
  discord: (size) => <DiscordIcon size={size} />,
};

const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { label: "Guides", href: "#" },
  { label: "Journal", href: "#" },
];

const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  { platform: "github", href: "#" },
  { platform: "x", href: "#" },
  { platform: "discord", href: "#" },
];

const DEFAULT_CARDS: CardItem[] = [
  {
    title: "Explore the Story",
    description:
      "A composable scroll experience that merges cinematic video with depth and motion, crafted to feel robust yet effortless to read.",
  },
  {
    title: "Unlock the Depth",
    description:
      "The web is growing increasingly dimensional. This section anchors a pinned backdrop while your message scrolls naturally on top.",
  },
  {
    title: "Connect Everything",
    description:
      "Pair footage, copy, and a closing statement into one continuous reveal — no extra code, just drop in your own video and words.",
  },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

function clampedLerp(value: number, inputRange: number[], outputRange: number[]): number {
  if (value <= inputRange[0]) return outputRange[0];
  const last = inputRange.length - 1;
  if (value >= inputRange[last]) return outputRange[last];
  for (let i = 0; i < last; i++) {
    const a = inputRange[i];
    const b = inputRange[i + 1];
    if (value >= a && value <= b) {
      const t = b === a ? 0 : (value - a) / (b - a);
      return outputRange[i] + t * (outputRange[i + 1] - outputRange[i]);
    }
  }
  return outputRange[last];
}

function createParticles(width: number, height: number, density: number): Particle[] {
  const count = Math.floor((width * height) / density);
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
    });
  }
  return particles;
}

export interface CinematicScrollStoryProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  /** Height of the visible scroll viewport, in px. */
  containerHeight?: number;
  videoSrc?: string;
  posterImage?: string;
  backgroundColor?: string;
  accentColor?: string;
  overlayOpacity?: number;
  /** Multiplier controlling how much scroll distance the pinned stage occupies. */
  scrollLength?: number;
  logoText?: string;
  navLinks?: NavLinkItem[];
  socialLinks?: SocialLinkItem[];
  subtitle?: string;
  headingPrefix?: string;
  headingHighlight?: string;
  headingSuffix?: string;
  codeText?: string;
  ctaText?: string;
  ctaLink?: string;
  cards?: CardItem[];
  enableParticles?: boolean;
  particleColor?: string;
  particleDensity?: number;
  section3Label?: string;
  section3Heading?: string;
  section3BackgroundColor?: string;
}

/**
 * CinematicScrollStory — a scroll-driven "3D product story" section: a
 * pinned video + particle backdrop with a hero, a sticky nav, a
 * scroll-revealed feature card grid, and a closing statement that fades in
 * on view. Self-contained: drives its own internal scroll container rather
 * than the page, so the effect works fully inside a bounded preview.
 */
export function CinematicScrollStory({
  className,
  containerHeight = 640,
  videoSrc = "https://www.w3schools.com/html/mov_bbb.mp4",
  posterImage,
  backgroundColor = "#0a0a0a",
  accentColor = "#2c5c88",
  overlayOpacity = 55,
  scrollLength = 1,
  logoText = "veldara",
  navLinks = DEFAULT_NAV_LINKS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  subtitle = "Our Purpose:",
  headingPrefix = "Instantly craft immersive",
  headingHighlight = "3D worlds",
  headingSuffix = "on the web.",
  codeText = "npm i @veldara/core",
  ctaText = "Get Started",
  ctaLink = "#",
  cards = DEFAULT_CARDS,
  enableParticles = true,
  particleColor = "#ffffff",
  particleDensity = 5,
  section3Label = "Presenting",
  section3Heading = "Veldara 8",
  section3BackgroundColor = "#010101",
  ...props
}: CinematicScrollStoryProps) {
  const safeCards = cards && cards.length > 0 ? cards : DEFAULT_CARDS;

  const [isMobile, setIsMobile] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const update = () => setIsMobile(el.clientWidth < 480);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Layout in px, scaled by containerHeight and scrollLength
  const heroH = containerHeight;
  const spacerH = 1.3 * scrollLength * containerHeight;
  const cardsH = 1.8 * scrollLength * containerHeight;
  const spacer2H = 0.9 * scrollLength * containerHeight;
  const stageH = heroH + spacerH + cardsH + spacer2H;
  const section3H = containerHeight;

  const cardsStartFrac = (heroH + spacerH) / stageH;
  const cardsEndFrac = (heroH + spacerH + cardsH) / stageH;
  const heroFadeEndFrac = (heroH * 0.45) / stageH;

  const stageRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress: stageProgress } = useScroll({
    container: scrollContainerRef,
    target: stageRef,
    offset: ["start start", "end end"],
  });

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const durationRef = React.useRef(0);
  useMotionValueEvent(stageProgress, "change", (v) => {
    const video = videoRef.current;
    const duration = durationRef.current;
    if (!video || !duration) return;
    const target = v * duration;
    if (Math.abs(video.currentTime - target) > 0.08) {
      video.currentTime = target;
    }
  });

  // Function-form transformers (rather than array input/output ranges) keep these on
  // motion's plain rAF-driven path. Array ranges opt into native ScrollTimeline
  // acceleration for `container`-scoped useScroll targets, which mis-composes narrow
  // sub-ranges (the value dips toward the target then drifts back to the start value
  // instead of staying clamped) as of motion 12.42.
  const heroOpacity = useTransform(stageProgress, (v) => clampedLerp(v, [0, heroFadeEndFrac], [1, 0]));

  const cardsOpacity = useTransform(stageProgress, (v) =>
    clampedLerp(
      v,
      [Math.max(0, cardsStartFrac - 0.04), cardsStartFrac, cardsEndFrac, Math.min(1, cardsEndFrac + 0.06)],
      [0, 1, 1, 0]
    )
  );
  const cardsRevealProgress = useTransform(stageProgress, (v) => clampedLerp(v, [cardsStartFrac, cardsEndFrac], [0, 1]));
  const cardsRevealPct = useTransform(cardsRevealProgress, (v) => v * 130);
  const cardsMaskDirection = isMobile ? "bottom" : "right";
  const cardsMask = useMotionTemplate`linear-gradient(to ${cardsMaskDirection}, black ${cardsRevealPct}%, transparent ${cardsRevealPct}%)`;

  const particlesCanvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (!enableParticles) return;
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const density = Math.max(1, particleDensity) * 2000;
    let particles: Particle[] = [];
    let raf = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : 800;
      const h = parent ? parent.clientHeight : 600;
      canvas.width = w;
      canvas.height = h;
      particles = createParticles(w, h, density);
    };

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [enableParticles, particleColor, particleDensity]);

  return (
    <div
      ref={scrollContainerRef}
      className={cn("relative w-full overflow-y-auto overflow-x-hidden", className)}
      style={{ height: containerHeight, background: backgroundColor }}
      {...props}
    >
      <div ref={stageRef} style={{ position: "relative", height: stageH }}>
        <div style={{ position: "sticky", top: 0, height: containerHeight, overflow: "hidden" }}>
          <div className="absolute inset-0 bg-[#0a0a0a]">
            {videoSrc ? (
              <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                poster={posterImage || undefined}
                className="block h-full w-full object-cover"
                onLoadedMetadata={(e) => {
                  durationRef.current = e.currentTarget.duration || 0;
                }}
              >
                <source src={videoSrc} />
              </video>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[13px] tracking-wide text-white/20">Add a scroll video</div>
            )}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {enableParticles && <canvas ref={particlesCanvasRef} className="pointer-events-none absolute inset-0 z-[3] h-full w-full" />}

          <nav
            className={cn(
              "absolute inset-x-0 top-0 z-50 flex items-center justify-between",
              isMobile ? "px-6 py-4" : "px-10 py-5"
            )}
          >
            <div className="flex items-center gap-8">
              <span className="text-xl font-bold tracking-tight text-white">{logoText}</span>
              {!isMobile && (
                <div className="flex items-center gap-6">
                  {navLinks.map((link, i) => (
                    <a key={i} href={link.href} className="text-sm text-gray-300 no-underline">
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-gray-300">
              {socialLinks.map((social, i) => (
                <a key={i} href={social.href} className="flex text-inherit">
                  {SOCIAL_ICONS[social.platform](isMobile ? 18 : 20)}
                </a>
              ))}
            </div>
          </nav>

          <motion.div style={{ opacity: heroOpacity }} className="relative z-10 flex h-full flex-col">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div
              className={cn(
                "relative z-[1] flex flex-1 flex-col items-center justify-end text-center",
                isMobile ? "px-6 pb-20" : "px-6 pb-24"
              )}
            >
              <p className="mb-4 text-sm tracking-wide text-gray-400">{subtitle}</p>
              <h1
                className={cn("m-0 max-w-3xl font-semibold leading-[1.15] text-white", isMobile ? "text-2xl" : "text-[clamp(1.5rem,5vw,3.75rem)]")}
              >
                {headingPrefix}{" "}
                <span className="relative inline-block">
                  <span className="absolute bottom-1 left-0 h-2.5 w-full rounded-sm" style={{ background: accentColor }} />
                  <span className="relative">{headingHighlight}</span>
                </span>{" "}
                {headingSuffix}
              </h1>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                {codeText && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-700/50 bg-[#1a1a1a] px-8 py-3.5">
                    <span className="font-mono text-sm" style={{ color: accentColor }}>
                      &gt;
                    </span>
                    <code className="font-mono text-sm text-gray-200">{codeText}</code>
                  </div>
                )}
                {ctaText && (
                  <a
                    href={ctaLink}
                    className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm font-medium text-white no-underline"
                    style={{ background: accentColor }}
                  >
                    {ctaText} <span>&rarr;</span>
                  </a>
                )}
              </div>
            </div>
            <div className="relative z-10 flex justify-center pb-8">
              <motion.svg
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="#6b7280"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </motion.svg>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: cardsOpacity }}
            className={cn("pointer-events-none absolute inset-x-0 bottom-0 z-[4]", isMobile ? "px-4 py-6" : "px-10 py-8")}
          >
            <motion.div
              style={{
                WebkitMaskImage: cardsMask,
                maskImage: cardsMask,
              }}
              className={cn("mx-auto grid max-w-6xl", isMobile ? "grid-cols-1 gap-6" : "grid-cols-3 gap-10")}
            >
              {safeCards.map((card, i) => (
                <div key={i}>
                  <h3 className="mb-4 text-2xl font-bold text-white">{card.title}</h3>
                  <p className="m-0 text-sm leading-relaxed text-gray-300">{card.description}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <section
        style={{ height: section3H, background: section3BackgroundColor }}
        className={cn("relative flex items-end justify-center", isMobile ? "px-6 pb-20" : "px-10 pb-32")}
      >
        <motion.div
          initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <p className="mb-3 text-base text-gray-300">{section3Label}</p>
          <h2 className={cn("m-0 font-bold text-white", isMobile ? "text-3xl" : "text-[clamp(1.875rem,6vw,4.5rem)]")}>{section3Heading}</h2>
        </motion.div>
      </section>
    </div>
  );
}

export default CinematicScrollStory;
