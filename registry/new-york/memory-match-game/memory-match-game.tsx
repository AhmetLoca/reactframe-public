"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ALL_ANIMALS = [
  { id: "lion", emoji: "🦁" },
  { id: "tiger", emoji: "🐯" },
  { id: "elephant", emoji: "🐘" },
  { id: "panda", emoji: "🐼" },
  { id: "fox", emoji: "🦊" },
  { id: "unicorn", emoji: "🦄" },
  { id: "frog", emoji: "🐸" },
  { id: "owl", emoji: "🦉" },
];

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY: Record<Difficulty, { pairs: number; label: string; columns: number }> = {
  easy: { pairs: 4, label: "Easy", columns: 4 },
  medium: { pairs: 6, label: "Medium", columns: 4 },
  hard: { pairs: 8, label: "Hard", columns: 4 },
};

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Tile {
  id: number;
  animalId: string;
  emoji: string;
}

export interface MemoryMatchGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  accentColor?: string;
}

export function MemoryMatchGame({ accentColor = "#8f7a66", className, style, ...props }: MemoryMatchGameProps) {
  const [difficulty, setDifficulty] = React.useState<Difficulty>("medium");
  const [tiles, setTiles] = React.useState<Tile[]>([]);
  const [flipped, setFlipped] = React.useState<number[]>([]);
  const [matched, setMatched] = React.useState<number[]>([]);
  const [locked, setLocked] = React.useState(false);
  const [moves, setMoves] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [won, setWon] = React.useState(false);

  const createBoard = React.useCallback((level: Difficulty) => {
    const pairCount = DIFFICULTY[level].pairs;
    const selectedAnimals = ALL_ANIMALS.slice(0, pairCount);
    const pairs = shuffle([...selectedAnimals, ...selectedAnimals]);
    setTiles(pairs.map((animal, index) => ({ id: index, animalId: animal.id, emoji: animal.emoji })));
    setFlipped([]);
    setMatched([]);
    setLocked(false);
    setMoves(0);
    setScore(0);
    setWon(false);
  }, []);

  React.useEffect(() => {
    createBoard(difficulty);
  }, [difficulty, createBoard]);

  const changeDifficulty = (level: Difficulty) => setDifficulty(level);

  const handleClick = (tile: Tile) => {
    if (locked || flipped.includes(tile.id) || matched.includes(tile.id)) return;
    if (flipped.length === 2) return;

    const newFlipped = [...flipped, tile.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);

      const first = tiles.find((t) => t.id === newFlipped[0])!;
      const second = tiles.find((t) => t.id === newFlipped[1])!;

      if (first.animalId === second.animalId) {
        setTimeout(() => {
          setMatched((prev) => {
            const next = [...prev, first.id, second.id];
            const points = difficulty === "hard" ? 150 : difficulty === "easy" ? 80 : 100;
            setScore((s) => s + points);
            if (next.length === tiles.length) setTimeout(() => setWon(true), 500);
            return next;
          });
          setFlipped([]);
          setLocked(false);
        }, 500);
      } else {
        const delay = difficulty === "hard" ? 700 : 900;
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, delay);
      }
    }
  };

  const columns = DIFFICULTY[difficulty].columns;

  return (
    <div
      className={cn("relative box-border flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[24px] px-3.5 py-4.5 text-[#776e65] select-none", className)}
      style={{ background: "linear-gradient(160deg, #faf8ef 0%, #eee4da 100%)", fontFamily: "'Nunito', 'Montserrat', system-ui, sans-serif", ...style }}
      {...props}
    >
      <div className="mb-2.5 flex w-full max-w-[380px] items-center justify-between">
        <div className="text-[32px] font-extrabold tracking-[-1px]">Memory</div>
        <div className="flex gap-2">
          <div className="min-w-[64px] rounded-[8px] bg-[#bbada0] px-3 py-1.5 text-center text-white">
            <div className="text-[10px] font-bold tracking-[1px] opacity-85">SCORE</div>
            <div className="text-lg font-extrabold">{score}</div>
          </div>
          <div className="min-w-[64px] rounded-[8px] bg-[#bbada0] px-3 py-1.5 text-center text-white">
            <div className="text-[10px] font-bold tracking-[1px] opacity-85">MOVES</div>
            <div className="text-lg font-extrabold">{moves}</div>
          </div>
        </div>
      </div>

      <div className="mb-3 flex gap-2">
        {(Object.keys(DIFFICULTY) as Difficulty[]).map((level) => (
          <button
            key={level}
            onClick={() => changeDifficulty(level)}
            className="min-w-[70px] cursor-pointer rounded-[8px] border-none px-3.5 py-[7px] text-[13px] font-bold text-white"
            style={{ background: difficulty === level ? accentColor : "#bbada0", opacity: difficulty === level ? 1 : 0.75 }}
          >
            {DIFFICULTY[level].label}
          </button>
        ))}
      </div>

      <motion.button className="mb-4 cursor-pointer rounded-[8px] border-none px-5 py-[9px] text-sm font-bold text-white" style={{ backgroundColor: accentColor }} onClick={() => createBoard(difficulty)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
        New Game
      </motion.button>

      <div className="grid w-full gap-2.5" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, maxWidth: difficulty === "hard" ? 380 : 340 }}>
        {tiles.map((tile) => {
          const isFlipped = flipped.includes(tile.id) || matched.includes(tile.id);
          const isMatched = matched.includes(tile.id);

          return (
            <motion.div key={tile.id} className="aspect-square cursor-pointer" style={{ perspective: 900 }} onClick={() => handleClick(tile)} animate={isMatched ? { scale: 0, opacity: 0, rotateY: 180 } : { scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
              <motion.div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>
                <div className="absolute inset-0 flex items-center justify-center rounded-[12px] border-2 border-[#e8d5a3] bg-[#f5deb3] shadow-[0_4px_10px_rgba(0,0,0,0.08)]" style={{ backfaceVisibility: "hidden" }}>
                  <span className="text-[28px] font-extrabold text-[#93794c]">?</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-[12px] border-2 border-[#e8d5a3] bg-[#fffdf5] shadow-[0_4px_10px_rgba(0,0,0,0.08)]" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <span className="text-4xl leading-none">{tile.emoji}</span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {won && (
          <motion.div className="absolute inset-0 z-50 flex items-center justify-center rounded-[24px]" style={{ background: "rgba(250, 248, 239, 0.92)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} className="rounded-[18px] border-[5px] border-[#50b8f7] bg-white px-10 py-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              <div className="mb-1.5 text-[26px] font-extrabold">YOU WON! 🎉</div>
              <div className="mb-1 text-xl font-bold text-[#8f7a66]">{score} points</div>
              <div className="mb-4.5 text-[13px] opacity-60">
                {moves} moves · {DIFFICULTY[difficulty].label}
              </div>
              <button className="cursor-pointer rounded-[10px] border-none px-6.5 py-[11px] text-sm font-bold text-white" style={{ backgroundColor: accentColor }} onClick={() => createBoard(difficulty)}>
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3.5 text-center text-[13px] opacity-50">{DIFFICULTY[difficulty].pairs} pairs · Find the matching animals</div>
    </div>
  );
}
