"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CoinFlipGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  theme?: "silver" | "gold" | "bronze";
  size?: number;
  headsImage?: string;
  tailsImage?: string;
  defaultQuestion?: string;
}

const THEMES = {
  silver: { main: "#a8a8a8", light: "#d0d0d0", dark: "#6a6a6a", border: "#c0c0c0" },
  gold: { main: "#d4af37", light: "#f5e6a3", dark: "#8b6914", border: "#e8c547" },
  bronze: { main: "#cd7f32", light: "#e8b07a", dark: "#8b4513", border: "#daa06d" },
};

export function CoinFlipGame({
  theme = "silver",
  size = 160,
  headsImage,
  tailsImage,
  defaultQuestion = "Should I order pizza tonight?",
  className,
  style,
  ...props
}: CoinFlipGameProps) {
  const uid = React.useId().replace(/:/g, "");
  const rootRef = React.useRef<HTMLDivElement>(null);
  const coinRef = React.useRef<HTMLDivElement>(null);
  const [flipping, setFlipping] = React.useState(false);
  const [result, setResult] = React.useState<"Heads" | "Tails" | null>(null);
  const [question, setQuestion] = React.useState(defaultQuestion);
  const [history, setHistory] = React.useState<("Heads" | "Tails")[]>([]);

  const t = THEMES[theme];

  const handleFlip = () => {
    if (flipping || !rootRef.current) return;
    setFlipping(true);
    setResult(null);

    if (navigator.vibrate) navigator.vibrate(30);

    const winner = Math.random() > 0.5 ? "720deg" : "900deg";
    coinRef.current?.style.setProperty("--flips", winner);

    const els = rootRef.current.querySelectorAll(".line, .coin");
    els.forEach((el) => el.classList.remove("anim"));
    requestAnimationFrame(() => {
      els.forEach((el) => el.classList.add("anim"));
    });
  };

  const onAnimEnd = () => {
    const flips = coinRef.current?.style.getPropertyValue("--flips");
    const finalResult: "Heads" | "Tails" = flips === "720deg" ? "Heads" : "Tails";
    setFlipping(false);
    setResult(finalResult);
    setHistory((prev) => [finalResult, ...prev].slice(0, 12));

    if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
  };

  const headsCount = history.filter((h) => h === "Heads").length;
  const total = history.length;
  const headsPct = total ? Math.round((headsCount / total) * 100) : 0;
  const tailsPct = total ? 100 - headsPct : 0;

  return (
    <div
      ref={rootRef}
      className={cn("box-border flex w-full min-h-full select-none flex-col items-center justify-start bg-white px-5 pt-6 pb-10 font-sans", className)}
      style={{ ["--main" as string]: t.main, ["--light" as string]: t.light, ["--dark" as string]: t.dark, ["--border" as string]: t.border, ...style } as React.CSSProperties}
      {...props}
    >
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-[#0f172a]">Heads or Tails?</h1>

      <div className="mb-2 w-full max-w-[320px]">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          className="w-full rounded-xl border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-center text-[15px] text-[#1e293b] outline-none"
        />
      </div>

      <div className={`world-${uid}`} style={{ width: size, height: size, margin: "20px 0", position: "relative", display: "grid", placeItems: "center" }}>
        <div className="floor" style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="line" />
          ))}
        </div>

        <div ref={coinRef} className="coin" onClick={handleFlip} onAnimationEnd={onAnimEnd} style={{ width: size, height: size, transformStyle: "preserve-3d", transformOrigin: "50%", cursor: "grab", position: "relative" }}>
          <div className="face heads">
            {headsImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={headsImage} alt="Heads" className="h-full w-full rounded-full object-cover" />
            ) : (
              <div className="fallback-face">
                <div style={{ fontSize: size * 0.28, fontWeight: 800 }}>LIBERTY</div>
                <div style={{ fontSize: size * 0.42, marginTop: 4 }}>H</div>
                <div style={{ fontSize: size * 0.14, marginTop: 6 }}>2026</div>
              </div>
            )}
          </div>
          <div className="face tails">
            {tailsImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tailsImage} alt="Tails" className="h-full w-full rounded-full object-cover" />
            ) : (
              <div className="fallback-face">
                <div style={{ fontSize: size * 0.38 }}>🦅</div>
                <div style={{ fontSize: size * 0.22, fontWeight: 700, marginTop: 4 }}>T</div>
                <div style={{ fontSize: size * 0.14, marginTop: 4 }}>2026</div>
              </div>
            )}
          </div>
          <div className="edge" style={{ transform: `translateX(calc(50% - ${size / 12}px))`, transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="segment" />
            ))}
          </div>
        </div>
      </div>

      <p className="mt-2 mb-5 min-h-[28px] text-[17px] font-medium text-[#64748b]">
        {flipping ? "Flipping..." : result ? (
          <>
            <span className="font-bold text-[#1e293b]">{result}</span>
            <span className="ml-2 opacity-70">→ {result === "Heads" ? "Yes" : "No"}</span>
          </>
        ) : (
          "Tap the coin or flip button"
        )}
      </p>

      <button onClick={handleFlip} disabled={flipping} className="cursor-pointer rounded-full border-none bg-[#0f172a] px-10 py-3.5 text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
        {result || flipping ? "Flip again" : "Flip the coin"}
      </button>

      {history.length > 0 && (
        <div className="mt-7 w-full max-w-[300px] text-center">
          <div className="mb-2.5 flex justify-center gap-2.5 text-[13px] font-semibold text-[#475569]">
            <span>Heads {headsPct}%</span>
            <span className="opacity-40">•</span>
            <span>Tails {tailsPct}%</span>
            <span className="opacity-70">({total} flips)</span>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {history.map((h, i) => (
              <div key={i} className="h-3 w-3 rounded-full shadow-sm" style={{ background: h === "Heads" ? t.main : t.dark }} title={h} />
            ))}
          </div>
        </div>
      )}

      <style>{`
        .coin {
          transform-style: preserve-3d;
          transform-origin: 50%;
          cursor: grab;
          position: relative;
        }
        .coin.anim {
          animation: flip-${uid} 1.05s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .face {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--main);
          border: 10px solid var(--border);
          box-shadow: inset 0 0 0 3px var(--dark), 0 8px 20px rgba(0,0,0,0.25);
          display: grid;
          place-items: center;
          overflow: hidden;
          backface-visibility: hidden;
        }
        .heads { transform: translateZ(${size / 12}px); }
        .tails { transform: translateZ(-${size / 12}px) rotateY(180deg) rotateZ(180deg); }
        .fallback-face {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--dark);
          text-shadow: 1px 1px 0 var(--light);
          height: 100%;
        }
        .edge { transform-style: preserve-3d; backface-visibility: hidden; }
        .segment {
          height: 100%;
          width: ${size / 6}px;
          position: absolute;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        .segment::before, .segment::after {
          content: "";
          display: block;
          height: ${size / 10}px;
          width: 100%;
          position: absolute;
          transform: rotateX(84.375deg);
        }
        .segment::before {
          transform-origin: top center;
          background: repeating-linear-gradient(var(--dark) 0, var(--dark) 25%, var(--main) 25%, var(--main) 50%);
        }
        .segment::after {
          bottom: 0;
          transform-origin: center bottom;
          background: repeating-linear-gradient(var(--main) 0, var(--main) 25%, var(--dark) 25%, var(--dark) 50%);
        }
        ${Array.from({ length: 16 }).map((_, i) => `.segment:nth-child(${i + 1}) { transform: rotateY(90deg) rotateX(${(i + 1) * 11.25}deg); }`).join("\n")}
        .line {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -3px;
          width: 100%;
          height: 6px;
          transform-origin: center left;
          border-radius: 6px;
          background: linear-gradient(90deg, white 20%, transparent 20%);
          background-repeat: no-repeat;
          opacity: 0;
        }
        .line.anim { animation: lines-${uid} 0.6s ease-out forwards; animation-delay: 0.7s; }
        ${Array.from({ length: 12 }).map((_, i) => `.line:nth-child(${i + 1}) { transform: rotate(${(i + 1) * 30}deg) scale(${i % 2 === 0 ? 1.1 : 1}); }`).join("\n")}
        @keyframes flip-${uid} {
          0%   { transform: rotateY(0) rotateX(0deg) scale(1); }
          15%  { transform: rotateY(40deg) rotateX(calc(var(--flips) / 3.2)) scale(1.55); }
          55%  { transform: rotateY(-25deg) rotateX(calc(var(--flips) / 1.4)) scale(1.9); }
          100% { transform: rotateY(0) rotateX(var(--flips)) scale(1); }
        }
        @keyframes lines-${uid} {
          40%  { opacity: 1; background-position: -120px 0; }
          70%  { opacity: 1; background-position: 75px 0; }
          100% { opacity: 1; background-position: 150px 0; }
        }
      `}</style>
    </div>
  );
}
