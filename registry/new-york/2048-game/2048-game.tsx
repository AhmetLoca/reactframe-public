"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SIZE = 4;

const TILE_COLORS: Record<number, string> = {
  0: "#cdc1b4",
  2: "#eee4da",
  4: "#ede0c8",
  8: "#f2b179",
  16: "#f59563",
  32: "#f67c5f",
  64: "#f65e3b",
  128: "#edcf72",
  256: "#edcc61",
  512: "#edc850",
  1024: "#edc53f",
  2048: "#edc22e",
  4096: "#3c3a32",
  8192: "#3c3a32",
};

const TEXT_COLORS: Record<number, string> = {
  2: "#776e65",
  4: "#776e65",
  8: "#f9f6f2",
  16: "#f9f6f2",
  32: "#f9f6f2",
  64: "#f9f6f2",
  128: "#f9f6f2",
  256: "#f9f6f2",
  512: "#f9f6f2",
  1024: "#f9f6f2",
  2048: "#f9f6f2",
};

const BEST_SCORE_KEY = "2048-best";

function addRandomTile(b: number[]) {
  const empty: number[] = [];
  b.forEach((v, i) => v === 0 && empty.push(i));
  if (empty.length === 0) return b;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  b[idx] = Math.random() < 0.9 ? 2 : 4;
  return b;
}

function slide(row: number[]) {
  let arr = row.filter((v) => v !== 0);
  let scoreAdd = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      scoreAdd += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter((v) => v !== 0);
  while (arr.length < SIZE) arr.push(0);
  return { row: arr, scoreAdd };
}

function isGameOver(b: number[]) {
  if (b.includes(0)) return false;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = b[r * SIZE + c];
      if (c < SIZE - 1 && v === b[r * SIZE + c + 1]) return false;
      if (r < SIZE - 1 && v === b[(r + 1) * SIZE + c]) return false;
    }
  }
  return true;
}

export interface Game2048Props extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  accentColor?: string;
}

export function Game2048({ accentColor = "#88b1ef", className, style, ...props }: Game2048Props) {
  const [board, setBoard] = React.useState<number[]>([]);
  const [score, setScore] = React.useState(0);
  const [best, setBest] = React.useState(0);
  const [status, setStatus] = React.useState<"playing" | "won" | "lost">("playing");
  const [won, setWon] = React.useState(false);
  const touchStart = React.useRef({ x: 0, y: 0 });
  const boardRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(420);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const boardSize = Math.round(Math.min(360, Math.max(200, containerWidth - 40)));
  const scale = boardSize / 360;

  const init = React.useCallback(() => {
    const empty = Array(SIZE * SIZE).fill(0);
    addRandomTile(empty);
    addRandomTile(empty);
    setBoard(empty);
    setScore(0);
    setStatus("playing");
    setWon(false);
  }, []);

  React.useEffect(() => {
    const savedBest = localStorage.getItem(BEST_SCORE_KEY);
    if (savedBest) setBest(parseInt(savedBest, 10));
    init();
  }, [init]);

  React.useEffect(() => {
    if (best > 0) localStorage.setItem(BEST_SCORE_KEY, best.toString());
  }, [best]);

  const move = React.useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      setBoard((prevBoard) => {
        if (status === "lost" || prevBoard.length === 0) return prevBoard;
        const newBoard = [...prevBoard];
        let moved = false;
        let scoreAdd = 0;

        const get = (r: number, c: number) => newBoard[r * SIZE + c];
        const set = (r: number, c: number, v: number) => (newBoard[r * SIZE + c] = v);

        if (direction === "left" || direction === "right") {
          for (let r = 0; r < SIZE; r++) {
            const row: number[] = [];
            for (let c = 0; c < SIZE; c++) row.push(get(r, c));
            if (direction === "right") row.reverse();
            const result = slide(row);
            if (direction === "right") result.row.reverse();
            for (let c = 0; c < SIZE; c++) {
              if (get(r, c) !== result.row[c]) moved = true;
              set(r, c, result.row[c]);
            }
            scoreAdd += result.scoreAdd;
          }
        } else {
          for (let c = 0; c < SIZE; c++) {
            const col: number[] = [];
            for (let r = 0; r < SIZE; r++) col.push(get(r, c));
            if (direction === "down") col.reverse();
            const result = slide(col);
            if (direction === "down") result.row.reverse();
            for (let r = 0; r < SIZE; r++) {
              if (get(r, c) !== result.row[r]) moved = true;
              set(r, c, result.row[r]);
            }
            scoreAdd += result.scoreAdd;
          }
        }

        if (!moved) return prevBoard;

        addRandomTile(newBoard);
        setScore((s) => {
          const next = s + scoreAdd;
          setBest((b) => (next > b ? next : b));
          return next;
        });
        if (!won && newBoard.includes(2048)) {
          setWon(true);
          setStatus("won");
        }
        if (isGameOver(newBoard)) setStatus("lost");
        return newBoard;
      });
    },
    [status, won],
  );

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const dir = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" }[e.key] as "up" | "down" | "left" | "right";
        move(dir);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [move]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const minSwipe = 30;
    if (Math.abs(deltaX) < minSwipe && Math.abs(deltaY) < minSwipe) return;
    if (Math.abs(deltaX) > Math.abs(deltaY)) move(deltaX > 0 ? "right" : "left");
    else move(deltaY > 0 ? "down" : "up");
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative box-border flex h-full w-full touch-none flex-col items-center justify-center overflow-hidden rounded-3xl font-sans select-none", className)}
      style={{ background: "linear-gradient(160deg, #faf8ef 0%, #eee4da 100%)", padding: Math.round(20 * Math.max(scale, 0.7)), ...style }}
      {...props}
    >
      <div className="mb-3 flex w-full items-center justify-between" style={{ maxWidth: boardSize }}>
        <div className="font-extrabold tracking-tight text-[#776e65]" style={{ fontSize: Math.round(52 * scale) }}>
          2048
        </div>
        <div className="flex gap-2.5">
          <div className="rounded-lg bg-[#bbada0] text-center text-white" style={{ minWidth: Math.round(70 * scale), padding: `${Math.round(8 * scale)}px ${Math.round(16 * scale)}px` }}>
            <div className="font-bold tracking-wide opacity-85" style={{ fontSize: Math.max(9, Math.round(11 * scale)) }}>
              SCORE
            </div>
            <div className="font-extrabold" style={{ fontSize: Math.max(14, Math.round(20 * scale)) }}>
              {score}
            </div>
          </div>
          <div className="rounded-lg bg-[#bbada0] text-center text-white" style={{ minWidth: Math.round(70 * scale), padding: `${Math.round(8 * scale)}px ${Math.round(16 * scale)}px` }}>
            <div className="font-bold tracking-wide opacity-85" style={{ fontSize: Math.max(9, Math.round(11 * scale)) }}>
              BEST
            </div>
            <div className="font-extrabold" style={{ fontSize: Math.max(14, Math.round(20 * scale)) }}>
              {best}
            </div>
          </div>
        </div>
      </div>

      <motion.button
        className="cursor-pointer self-end rounded-lg border-none font-bold text-white"
        style={{ backgroundColor: accentColor, marginBottom: Math.round(18 * scale), fontSize: Math.max(12, Math.round(15 * scale)), padding: `${Math.round(10 * scale)}px ${Math.round(22 * scale)}px` }}
        onClick={init}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        New Game
      </motion.button>

      <div
        ref={boardRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative grid touch-none grid-cols-4 grid-rows-4 rounded-xl bg-[#bbada0]"
        style={{ width: boardSize, height: boardSize, gap: Math.round(10 * scale), padding: Math.round(10 * scale) }}
      >
        {Array.from({ length: SIZE * SIZE }).map((_, i) => (
          <div key={`bg-${i}`} className="rounded-lg bg-[#cdc1b4]" />
        ))}

        <AnimatePresence>
          {board.map((value, i) => {
            if (value === 0) return null;
            const row = Math.floor(i / SIZE);
            const col = i % SIZE;
            return (
              <motion.div
                key={`${i}-${value}`}
                className="z-10 flex items-center justify-center rounded-lg font-extrabold shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
                style={{
                  backgroundColor: TILE_COLORS[value] || "#3c3a32",
                  color: TEXT_COLORS[value] || "#f9f6f2",
                  fontSize: Math.round((value >= 1000 ? 28 : value >= 100 ? 32 : 38) * scale),
                  gridRow: row + 1,
                  gridColumn: col + 1,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                layout
              >
                {value}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(status === "won" || status === "lost") && (
          <motion.div className="absolute inset-0 z-50 flex items-center justify-center rounded-3xl" style={{ background: "rgba(238, 228, 218, 0.85)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} className="text-center text-[#776e65]">
              <div className="mb-2 font-extrabold" style={{ fontSize: Math.round(32 * scale) }}>
                {status === "won" ? "You Win! 🎉" : "Game Over"}
              </div>
              {status === "won" && (
                <button className="mt-3 mr-2.5 cursor-pointer rounded-lg border-none bg-[#8f7a66] px-5 py-2.5 font-bold text-white" onClick={() => setStatus("playing")}>
                  Keep Going
                </button>
              )}
              <button className="mt-3 cursor-pointer rounded-lg border-none bg-[#8f7a66] px-5 py-2.5 font-bold text-white" onClick={init}>
                Try Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3.5 text-center text-[13px] text-[#776e65] opacity-70">Desktop: Arrow keys • Mobile: Swipe</div>
    </div>
  );
}
