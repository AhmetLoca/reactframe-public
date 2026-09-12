"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardItem {
  color: string;
  uniqueId: number;
}

type Difficulty = "easy" | "medium" | "hard";
type PopupPosition = "bottom-right" | "bottom-left";

const ALL_COLORS = [
  "#FF2D55",
  "#007AFF",
  "#34C759",
  "#FF9500",
  "#AF52DE",
  "#FFCC00",
  "#5AC8FA",
  "#FF3B30",
  "#30D158",
  "#BF5AF2",
  "#64D2FF",
  "#FF9F0A",
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const playSound = (type: "flip" | "match" | "win") => {
  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "flip") {
      osc.frequency.value = 380;
      gain.gain.value = 0.04;
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } else if (type === "match") {
      osc.frequency.value = 700;
      gain.gain.value = 0.07;
      osc.start();
      osc.frequency.linearRampToValueAtTime(1100, ctx.currentTime + 0.12);
      osc.stop(ctx.currentTime + 0.12);
    } else {
      osc.frequency.value = 500;
      gain.gain.value = 0.09;
      osc.start();
      osc.frequency.linearRampToValueAtTime(1300, ctx.currentTime + 0.35);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {
    // audio unsupported or blocked — silently skip
  }
};

function CardsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="9" height="12" rx="2" transform="rotate(-8 6.5 10)" fill="white" fillOpacity="0.9" />
      <rect x="12" y="6" width="10" height="14" rx="2.5" fill="white" />
    </svg>
  );
}

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: 6 + Math.random() * 6,
            height: 6 + Math.random() * 6,
            background: ALL_COLORS[i % ALL_COLORS.length],
            left: Math.random() * 100 + "%",
            top: -20,
            borderRadius: Math.random() > 0.5 ? "50%" : 2,
            animation: `mcw-confetti-fall ${2 + Math.random() * 2}s linear forwards`,
            animationDelay: Math.random() * 0.5 + "s",
          }}
        />
      ))}
    </div>
  );
}

export interface MemoryCardsWidgetProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  difficulty?: Difficulty;
  position?: PopupPosition;
  defaultOpen?: boolean;
}

export function MemoryCardsWidget({
  className,
  style,
  difficulty: propDifficulty = "medium",
  position = "bottom-right",
  defaultOpen = false,
  ...props
}: MemoryCardsWidgetProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [difficulty, setDifficulty] = React.useState<Difficulty>(propDifficulty);
  const pairCount = difficulty === "easy" ? 6 : difficulty === "hard" ? 12 : 8;

  const [cards, setCards] = React.useState<CardItem[]>([]);
  const [flipped, setFlipped] = React.useState<number[]>([]);
  const [matched, setMatched] = React.useState<string[]>([]);
  const [moves, setMoves] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [bestScore, setBestScore] = React.useState<number | null>(null);

  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const instanceId = React.useId();

  React.useEffect(() => {
    const saved = localStorage.getItem("memory-cards-widget-best");
    if (saved) setBestScore(Number(saved));
  }, []);

  React.useEffect(() => {
    setDifficulty(propDifficulty);
  }, [propDifficulty]);

  const startGame = React.useCallback(() => {
    const selectedColors = ALL_COLORS.slice(0, pairCount);
    const doubled = [...selectedColors, ...selectedColors];
    const shuffled = shuffle(doubled).map((color, index) => ({ color, uniqueId: index }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setIsRunning(false);
    setShowModal(false);
  }, [pairCount]);

  React.useEffect(() => {
    startGame();
  }, [difficulty, startGame]);

  React.useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleCardClick = (uniqueId: number, color: string) => {
    if (flipped.length === 2 || flipped.includes(uniqueId) || matched.includes(color)) return;

    if (!isRunning) setIsRunning(true);
    playSound("flip");

    const newFlipped = [...flipped, uniqueId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const first = cards.find((c) => c.uniqueId === newFlipped[0]);
      const second = cards.find((c) => c.uniqueId === newFlipped[1]);
      if (!first || !second) return;

      if (first.color === second.color) {
        playSound("match");
        setMatched((prev) => [...prev, first.color]);
        setFlipped([]);

        if (matched.length + 1 === pairCount) {
          setIsRunning(false);
          playSound("win");
          setTimeout(() => {
            setShowModal(true);
            if (!bestScore || moves + 1 < bestScore) {
              localStorage.setItem("memory-cards-widget-best", String(moves + 1));
              setBestScore(moves + 1);
            }
          }, 400);
        }
      } else {
        setTimeout(() => setFlipped([]), 600);
      }
    }
  };

  const columns = pairCount <= 6 ? 4 : pairCount <= 8 ? 4 : 6;

  return (
    <div data-mcw={instanceId} className={cn("relative", className)} style={{ width: 340, height: 460, fontFamily: "Inter, system-ui, sans-serif", ...style }} {...props}>
      <style>{`
        [data-mcw="${instanceId}"] * { box-sizing: border-box; }

        [data-mcw="${instanceId}"] .mcw-card:focus-visible {
          outline: 2px solid #5AC8FA;
          outline-offset: 2px;
        }

        [data-mcw="${instanceId}"] .mcw-fab {
          position: absolute;
          bottom: 0;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #FF2D55, #AF52DE);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
          transition: transform 0.2s ease, opacity 0.2s ease;
          z-index: 10;
        }
        [data-mcw="${instanceId}"] .mcw-fab.bottom-right { right: 0; }
        [data-mcw="${instanceId}"] .mcw-fab.bottom-left { left: 0; }
        [data-mcw="${instanceId}"] .mcw-fab:hover { transform: scale(1.06); }
        [data-mcw="${instanceId}"] .mcw-fab.mcw-hidden {
          opacity: 0;
          pointer-events: none;
          transform: scale(0.8);
        }

        [data-mcw="${instanceId}"] .mcw-panel {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          opacity: 0;
          transform: scale(0.85) translateY(12px);
          pointer-events: none;
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease;
          z-index: 20;
          background: #0a0a0a;
          color: white;
          display: flex;
          flex-direction: column;
        }
        [data-mcw="${instanceId}"] .mcw-panel.bottom-right { right: 0; transform-origin: bottom right; }
        [data-mcw="${instanceId}"] .mcw-panel.bottom-left { left: 0; transform-origin: bottom left; }
        [data-mcw="${instanceId}"] .mcw-panel.mcw-open {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: auto;
        }

        [data-mcw="${instanceId}"] .mcw-close-btn {
          background: rgba(255,255,255,0.12);
          border: none;
          color: white;
          width: 26px;
          height: 26px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        [data-mcw="${instanceId}"] .mcw-close-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        [data-mcw="${instanceId}"] .mcw-header {
          flex-shrink: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: rgba(255,255,255,0.06);
          font-size: 13px;
          font-weight: 600;
          gap: 12px;
        }

        [data-mcw="${instanceId}"] .mcw-header-left {
          display: flex;
          gap: 16px;
        }

        [data-mcw="${instanceId}"] .mcw-stat-label {
          opacity: 0.5;
          font-weight: 500;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-right: 2px;
        }

        [data-mcw="${instanceId}"] .mcw-reset-btn {
          background: rgba(255,255,255,0.12);
          border: none;
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 8px;
          cursor: pointer;
        }
        [data-mcw="${instanceId}"] .mcw-reset-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        [data-mcw="${instanceId}"] .mcw-difficulty-select {
          background: rgba(255,255,255,0.12);
          border: none;
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 8px;
          cursor: pointer;
        }
        [data-mcw="${instanceId}"] .mcw-difficulty-select:focus-visible {
          outline: 2px solid #5AC8FA;
          outline-offset: 2px;
        }
        [data-mcw="${instanceId}"] .mcw-difficulty-select option {
          background: #1c1c1e;
          color: white;
        }

        [data-mcw="${instanceId}"] .mcw-game {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: repeat(${columns}, minmax(0, 1fr));
          gap: 8px;
          padding: 10px;
          overflow: hidden;
        }

        [data-mcw="${instanceId}"] .mcw-card {
          min-width: 0;
          min-height: 0;
          perspective: 800px;
          cursor: pointer;
        }

        [data-mcw="${instanceId}"] .mcw-inside {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 12px;
        }

        [data-mcw="${instanceId}"] .mcw-inside.mcw-flipped {
          transform: rotateY(180deg);
        }

        [data-mcw="${instanceId}"] .mcw-inside.mcw-matched {
          animation: mcw-match-pulse 0.4s ease;
        }

        @keyframes mcw-match-pulse {
          0%   { transform: rotateY(180deg) scale(1); }
          50%  { transform: rotateY(180deg) scale(1.06); }
          100% { transform: rotateY(180deg) scale(1); }
        }

        [data-mcw="${instanceId}"] .mcw-front, [data-mcw="${instanceId}"] .mcw-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 12px;
        }

        [data-mcw="${instanceId}"] .mcw-back {
          background: white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.25);
        }

        [data-mcw="${instanceId}"] .mcw-front {
          transform: rotateY(180deg);
        }

        [data-mcw="${instanceId}"] .mcw-modal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.88);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        [data-mcw="${instanceId}"] .mcw-modal {
          background: #1c1c1e;
          padding: 32px 24px;
          border-radius: 18px;
          text-align: center;
          width: 90%;
          max-width: 320px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        [data-mcw="${instanceId}"] .mcw-modal h2 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          background: linear-gradient(90deg, #FF2D55, #AF52DE);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        [data-mcw="${instanceId}"] .mcw-stats {
          margin: 16px 0;
          font-size: 15px;
          opacity: 0.9;
          line-height: 1.5;
        }

        [data-mcw="${instanceId}"] .mcw-restart {
          background: linear-gradient(90deg, #FF2D55, #AF52DE);
          border: none;
          color: white;
          font-weight: 700;
          font-size: 15px;
          padding: 12px 26px;
          border-radius: 11px;
          cursor: pointer;
        }

        @keyframes mcw-confetti-fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <button className={`mcw-fab ${position} ${isOpen ? "mcw-hidden" : ""}`} onClick={() => setIsOpen(true)} aria-label="Open memory game">
        <CardsIcon />
      </button>

      <div className={`mcw-panel ${position} ${isOpen ? "mcw-open" : ""}`}>
        <div className="mcw-header">
          <div className="mcw-header-left">
            <span>
              <span className="mcw-stat-label">Time</span> {time}s
            </span>
            <span>
              <span className="mcw-stat-label">Moves</span> {moves}
            </span>
            <span>
              <span className="mcw-stat-label">Best</span> {bestScore ?? "—"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="mcw-reset-btn" onClick={startGame}>
              Reset
            </button>

            <select className="mcw-difficulty-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <button className="mcw-close-btn" onClick={() => setIsOpen(false)} aria-label="Close memory game">
              ×
            </button>
          </div>
        </div>

        <div className="mcw-game">
          {cards.map((card) => {
            const isFlipped = flipped.includes(card.uniqueId) || matched.includes(card.color);
            return (
              <div
                key={card.uniqueId}
                className="mcw-card"
                role="button"
                tabIndex={0}
                aria-pressed={isFlipped}
                aria-label={isFlipped ? "Memory card, revealed" : "Memory card, hidden"}
                onClick={() => handleCardClick(card.uniqueId, card.color)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(card.uniqueId, card.color);
                  }
                }}
              >
                <div className={`mcw-inside ${isFlipped ? "mcw-flipped" : ""} ${matched.includes(card.color) ? "mcw-matched" : ""}`}>
                  <div className="mcw-back" />
                  <div className="mcw-front" style={{ background: card.color }} />
                </div>
              </div>
            );
          })}
        </div>

        {showModal && (
          <div className="mcw-modal-overlay">
            <Confetti />
            <div className="mcw-modal">
              <h2>You Rock!</h2>
              <div className="mcw-stats">
                <div>{moves} moves</div>
                <div>{time} seconds</div>
                {bestScore === moves && <div style={{ marginTop: 6, color: "#FFD700" }}>New record!</div>}
              </div>
              <button className="mcw-restart" onClick={startGame}>
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
