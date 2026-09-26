"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#@~|";

export type TextScrambleRevealMode = "left-to-right" | "right-to-left" | "random";

interface CharState {
  char: string;
  revealed: boolean;
  isSpace: boolean;
}

const DEFAULT_PHRASES = ["The future is already here", "Reality is just a rendering", "Every detail has a purpose"];

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

function buildRevealOrder(target: string, mode: TextScrambleRevealMode): number[] {
  const indices = target
    .split("")
    .map((_, i) => i)
    .filter((i) => target[i] !== " ");
  if (mode === "right-to-left") return [...indices].reverse();
  if (mode === "random") {
    const arr = [...indices];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  return indices;
}

export interface TextScrambleProProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  phrases?: string[];
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  fontColor?: string;
  scrambleColor?: string;
  framesPerChar?: number;
  holdDuration?: number;
  pauseDuration?: number;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
  background?: string;
  padding?: number;
  revealMode?: TextScrambleRevealMode;
  scrollTrigger?: boolean;
  scrambleOut?: boolean;
  loop?: boolean;
  showCursor?: boolean;
  fadeInDuration?: number;
}

export function TextScramblePro({
  phrases = DEFAULT_PHRASES,
  fontSize = 32,
  fontWeight = 400,
  letterSpacing = 0.04,
  fontColor = "#ffffff",
  scrambleColor = "#555555",
  framesPerChar = 10,
  holdDuration = 2200,
  pauseDuration = 400,
  fontFamily = '"Courier New", Courier, monospace',
  textAlign = "center",
  background = "transparent",
  padding = 40,
  revealMode = "left-to-right",
  scrollTrigger = false,
  scrambleOut = true,
  loop = true,
  showCursor = true,
  fadeInDuration = 600,
  className,
  ...props
}: TextScrambleProProps) {
  const [chars, setChars] = React.useState<CharState[]>([]);
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [started, setStarted] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [cursorOn, setCursorOn] = React.useState(true);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [containerWidth, setContainerWidth] = React.useState(0);
  const [scaledFontSize, setScaledFontSize] = React.useState(fontSize);

  const p = React.useRef({ phrases, framesPerChar, holdDuration, pauseDuration, revealMode: revealMode, scrambleOut, loop: loop });
  React.useEffect(() => {
    p.current = { phrases, framesPerChar, holdDuration, pauseDuration, revealMode: revealMode, scrambleOut, loop: loop };
  });

  React.useEffect(() => {
    if (!loop || !done) return;
    const id = setTimeout(() => {
      setDone(false);
      setPhraseIndex(0);
    }, 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerWidth(el.clientWidth));
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  React.useLayoutEffect(() => {
    const measureEl = measureRef.current;
    if (!measureEl || containerWidth === 0) return;
    const available = containerWidth - padding * 2;
    if (available <= 0) return;
    const natural = measureEl.scrollWidth;
    setScaledFontSize(natural > available ? Math.floor(fontSize * (available / natural)) : fontSize);
  }, [containerWidth, fontSize, padding, phrases]);

  React.useEffect(() => {
    if (!showCursor) return;
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, [showCursor]);

  React.useEffect(() => {
    if (!scrollTrigger) {
      const t = setTimeout(() => {
        setVisible(true);
        setStarted(true);
      }, 50);
      return () => clearTimeout(t);
    }
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [scrollTrigger]);

  const clearTimers = React.useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const animatePhrase = React.useCallback((target: string) => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const splitChars = target.split("");
    const len = splitChars.length;
    const revealOrder = buildRevealOrder(target, p.current.revealMode);
    const totalFrames = revealOrder.length * p.current.framesPerChar;

    const revealAt: number[] = new Array(len).fill(Infinity);
    revealOrder.forEach((ci, i) => {
      revealAt[ci] = i * p.current.framesPerChar;
    });

    const advancePhrase = () => {
      setPhraseIndex((prev) => {
        const next = (prev + 1) % p.current.phrases.length;
        if (!p.current.loop && next === 0) {
          setDone(true);
          return prev;
        }
        return next;
      });
    };

    const runScrambleOut = (order: number[]) => {
      const outOrder = [...order].reverse();
      const totalOut = outOrder.length * p.current.framesPerChar;
      const unrevealAt: number[] = new Array(len).fill(Infinity);
      outOrder.forEach((ci, i) => {
        unrevealAt[ci] = i * p.current.framesPerChar;
      });
      let outFrame = 0;
      const tickOut = () => {
        setChars(
          splitChars.map((c, i) => {
            if (c === " ") return { char: " ", revealed: true, isSpace: true };
            if (outFrame >= unrevealAt[i]) return { char: randomChar(), revealed: false, isSpace: false };
            return { char: c, revealed: true, isSpace: false };
          }),
        );
        if (outFrame < totalOut) {
          outFrame++;
          rafRef.current = requestAnimationFrame(tickOut);
        } else {
          advancePhrase();
        }
      };
      rafRef.current = requestAnimationFrame(tickOut);
    };

    let frame = 0;
    const tick = () => {
      setChars(
        splitChars.map((c, i) => {
          if (c === " ") return { char: " ", revealed: true, isSpace: true };
          if (frame >= revealAt[i]) return { char: c, revealed: true, isSpace: false };
          return { char: randomChar(), revealed: false, isSpace: false };
        }),
      );
      if (frame < totalFrames) {
        frame++;
        rafRef.current = requestAnimationFrame(tick);
      } else {
        timeoutRef.current = setTimeout(
          () => {
            if (p.current.scrambleOut) runScrambleOut(revealOrder);
            else advancePhrase();
          },
          p.current.holdDuration,
        );
      }
    };

    timeoutRef.current = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, p.current.pauseDuration);
  }, []);

  React.useEffect(() => {
    if (!started || done) return;
    const target = phrases[phraseIndex] ?? "";
    const id = setTimeout(() => {
      setChars(target.split("").map((c) => ({ char: c === " " ? " " : randomChar(), revealed: false, isSpace: c === " " })));
      animatePhrase(target);
    }, 0);
    return () => {
      clearTimeout(id);
      clearTimers();
    };
  }, [phraseIndex, phrases, animatePhrase, clearTimers, started, done]);

  const justifyMap: Record<string, string> = { left: "flex-start", center: "center", right: "flex-end" };

  return (
    <div
      ref={containerRef}
      className={cn("relative box-border flex w-full h-full items-center overflow-hidden", className)}
      style={{
        background,
        justifyContent: justifyMap[textAlign] ?? "center",
        padding: `0 ${padding}px`,
        opacity: visible ? 1 : 0,
        transition: fadeInDuration > 0 ? `opacity ${fadeInDuration}ms ease` : undefined,
      }}
      {...props}
    >
      <span
        ref={measureRef}
        aria-hidden
        className="absolute pointer-events-none whitespace-nowrap invisible"
        style={{ fontFamily, fontSize, fontWeight, letterSpacing: `${letterSpacing}em` }}
      >
        {phrases.reduce((a, b) => (a.length >= b.length ? a : b), "")}
      </span>

      <span
        className="whitespace-nowrap select-none"
        style={{ fontFamily, fontSize: scaledFontSize, fontWeight, lineHeight: 1.4, letterSpacing: `${letterSpacing}em` }}
      >
        {chars.map((c, i) => (
          <span
            key={i}
            className="inline-block"
            style={{ color: c.isSpace ? "transparent" : c.revealed ? fontColor : scrambleColor, minWidth: c.isSpace ? `${scaledFontSize * 0.4}px` : undefined }}
          >
            {c.char}
          </span>
        ))}
        {showCursor && (
          <span className="ml-0.5 inline-block transition-opacity duration-75" style={{ color: fontColor, opacity: cursorOn ? 1 : 0 }}>
            |
          </span>
        )}
      </span>

    </div>
  );
}
