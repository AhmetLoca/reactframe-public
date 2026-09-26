"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Token = { text: string; isSpace: boolean; index: number };
export type WordRevealStyle = "words" | "chars";
export type WordRevealAnimPreset = "fade-up" | "blur-in" | "fade-only" | "spring-up";
export type WordRevealTriggerMode = "scroll" | "inview" | "manual";
export type WordRevealAlign = "left" | "center" | "right";
export type WordRevealStaggerMode = "linear" | "center-out" | "random";

function tokenize(text: string, mode: WordRevealStyle): Token[][] {
  const paragraphs = text.split("\n").filter((p) => p.trim().length > 0);

  return paragraphs.map((para) => {
    if (mode === "chars") {
      return para.split("").map((ch, i) => ({ text: ch, isSpace: ch === " ", index: i }));
    }
    const words = para.split(/(\s+)/);
    let idx = 0;
    return words.map((w) => {
      const isSpace = /^\s+$/.test(w);
      const token: Token = { text: w, isSpace, index: idx };
      if (!isSpace) idx++;
      return token;
    });
  });
}

// Deterministic pseudo-random in [0, 1) — a pure function of the index, so
// "random" stagger order is stable across re-renders without needing
// Math.random() (which isn't allowed during render) or cached ref state.
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function getDelay(tokenIndex: number, totalTokens: number, stagger: number, staggerMode: WordRevealStaggerMode): number {
  if (staggerMode === "center-out") {
    const center = (totalTokens - 1) / 2;
    const dist = Math.abs(tokenIndex - center);
    return dist * stagger * 0.001;
  }
  if (staggerMode === "random") {
    return pseudoRandom(tokenIndex) * totalTokens * stagger * 0.001;
  }
  return tokenIndex * stagger * 0.001;
}

const EASINGS: Record<WordRevealAnimPreset, string> = {
  "fade-up": "cubic-bezier(0.16, 1, 0.3, 1)",
  "blur-in": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  "fade-only": "cubic-bezier(0.4, 0, 0.2, 1)",
  "spring-up": "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

const DURATIONS: Record<WordRevealAnimPreset, number> = {
  "fade-up": 0.7,
  "blur-in": 0.6,
  "fade-only": 0.5,
  "spring-up": 0.65,
};

function getHiddenStyle(preset: WordRevealAnimPreset, translateY: number): React.CSSProperties {
  const base: React.CSSProperties = { opacity: 0 };
  if (preset === "fade-up" || preset === "spring-up") {
    base.transform = `translateY(${translateY}px)`;
  }
  if (preset === "blur-in") {
    base.filter = "blur(12px)";
    base.transform = `translateY(${translateY * 0.4}px)`;
  }
  return base;
}

function getVisibleStyle(preset: WordRevealAnimPreset): React.CSSProperties {
  const base: React.CSSProperties = { opacity: 1 };
  if (preset === "fade-up" || preset === "spring-up") {
    base.transform = "translateY(0px)";
  }
  if (preset === "blur-in") {
    base.filter = "blur(0px)";
    base.transform = "translateY(0px)";
  }
  return base;
}

interface TokenSpanProps {
  token: Token;
  visible: boolean;
  delay: number;
  preset: WordRevealAnimPreset;
  translateY: number;
  duration: number;
  color: string;
  highlightWords: string[];
  highlightColor: string;
  easing: string;
}

function TokenSpan({ token, visible, delay, preset, translateY, duration, color, highlightWords, highlightColor, easing }: TokenSpanProps) {
  const isHighlighted = highlightWords.some((w) => w.trim().toLowerCase() === token.text.trim().toLowerCase());

  const style: React.CSSProperties = {
    display: "inline-block",
    willChange: "transform, opacity, filter",
    transition: visible ? `opacity ${duration}s ${easing} ${delay}s, transform ${duration}s ${easing} ${delay}s, filter ${duration}s ${easing} ${delay}s` : "none",
    color: isHighlighted ? highlightColor : color,
    ...(visible ? getVisibleStyle(preset) : getHiddenStyle(preset, translateY)),
  };

  return <span style={style}>{token.text}</span>;
}

export interface WordRevealProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children" | "content" | "translate"> {
  text?: string;
  revealStyle?: WordRevealStyle;
  animPreset?: WordRevealAnimPreset;
  triggerMode?: WordRevealTriggerMode;
  threshold?: number;
  scrollStart?: number;
  scrollEnd?: number;
  stagger?: number;
  staggerMode?: WordRevealStaggerMode;
  translateY?: number;
  durationOverride?: number;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: number;
  letterSpacing?: number;
  color?: string;
  align?: WordRevealAlign;
  highlightWords?: string;
  highlightColor?: string;
  backgroundColor?: string;
  padding?: number;
  manualTrigger?: boolean;
}

export function WordReveal({
  text = "Scroll to reveal each word\none at a time.",
  revealStyle = "words",
  animPreset = "blur-in",
  triggerMode = "scroll",
  threshold = 0.15,
  scrollStart = 0,
  scrollEnd = 100,
  stagger = 60,
  staggerMode = "linear",
  translateY = 24,
  durationOverride = 0,
  fontSize = 48,
  fontWeight = "600",
  fontFamily = "Inter, sans-serif",
  lineHeight = 1.2,
  letterSpacing = -0.5,
  color = "#ffffff",
  align = "center",
  highlightWords = "",
  highlightColor = "#87FFE3",
  backgroundColor = "transparent",
  padding = 0,
  manualTrigger = false,
  className,
  style,
  ...props
}: WordRevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = React.useState(0);
  const [hasTriggered, setHasTriggered] = React.useState(false);

  const paragraphs = tokenize(text, revealStyle);
  const allTokens = paragraphs.flat();
  const meaningfulTokens = allTokens.filter((t) => !t.isSpace);
  const totalMeaningful = meaningfulTokens.length;

  const duration = durationOverride > 0 ? durationOverride : DURATIONS[animPreset];
  const easing = EASINGS[animPreset];
  const parsedHighlights = highlightWords
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);

  const revealAll = React.useCallback(() => {
    setVisibleCount(totalMeaningful);
    setHasTriggered(true);
  }, [totalMeaningful]);

  React.useEffect(() => {
    if (triggerMode !== "inview") return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          revealAll();
        }
      },
      { threshold: Math.max(0, Math.min(1, threshold)) }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerMode, threshold, hasTriggered, revealAll]);

  React.useEffect(() => {
    if (triggerMode !== "scroll") return;
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const startPx = vh * (1 - scrollStart / 100);
      const endPx = vh * (1 - scrollEnd / 100);
      const progress = Math.max(0, Math.min(1, (startPx - rect.top) / (startPx - endPx)));
      const newCount = Math.round(progress * totalMeaningful);
      setVisibleCount(newCount);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerMode, scrollStart, scrollEnd, totalMeaningful]);

  const effectiveVisibleCount = triggerMode === "manual" ? (manualTrigger ? totalMeaningful : 0) : visibleCount;

  let meaningfulIdx = 0;

  return (
    <div
      ref={containerRef}
      className={cn("select-none", className)}
      style={{ backgroundColor, padding, textAlign: align, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, ...style }}
      {...props}
    >
      {paragraphs.map((tokens, pIdx) => (
        <div key={pIdx} className="block" style={{ marginBottom: pIdx < paragraphs.length - 1 ? `${fontSize * 0.5}px` : 0 }}>
          {tokens.map((token, tIdx) => {
            const isMeaningful = !token.isSpace;
            const myIdx = isMeaningful ? meaningfulIdx++ : -1;
            const visible = isMeaningful ? myIdx < effectiveVisibleCount : false;
            const delay = isMeaningful ? getDelay(myIdx, totalMeaningful, stagger, staggerMode) : 0;

            if (token.isSpace) {
              return <span key={tIdx} className="inline-block" style={{ width: "0.28em" }} />;
            }

            return (
              <TokenSpan
                key={tIdx}
                token={token}
                visible={visible}
                delay={delay}
                preset={animPreset}
                translateY={translateY}
                duration={duration}
                color={color}
                highlightWords={parsedHighlights}
                highlightColor={highlightColor}
                easing={easing}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
