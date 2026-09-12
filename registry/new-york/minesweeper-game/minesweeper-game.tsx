"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DIFFICULTY_SETTINGS = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

const NUMBER_COLORS = ["", "#0000FF", "#008200", "#FF0000", "#000084", "#840000", "#008284", "#000000", "#808080"];

function Confetti() {
  const particles = React.useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: ["#FF3B30", "#FF9500", "#4A90E2", "#34C759", "#AF52DE"][Math.floor(Math.random() * 5)],
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-2 w-2 rounded-[2px]"
          style={{ left: `${p.x}%`, top: -10, background: p.color }}
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 600, opacity: 0, rotate: 360 }}
          transition={{ duration: 2 + Math.random(), delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export interface MinesweeperGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  difficulty?: "beginner" | "intermediate" | "expert";
  mineColor?: string;
  flagColor?: string;
}

export function MinesweeperGame({ difficulty = "beginner", mineColor = "#FF3B30", flagColor = "#FF9500", className, style, ...props }: MinesweeperGameProps) {
  const { rows, cols, mines } = DIFFICULTY_SETTINGS[difficulty];
  const totalCells = rows * cols;

  const [board, setBoard] = React.useState<number[]>([]);
  const [revealed, setRevealed] = React.useState<boolean[]>([]);
  const [flagged, setFlagged] = React.useState<boolean[]>([]);
  const [gameStatus, setGameStatus] = React.useState<"ready" | "playing" | "won" | "lost">("ready");
  const [time, setTime] = React.useState(0);
  const [minesLeft, setMinesLeft] = React.useState(mines);
  const [firstClick, setFirstClick] = React.useState(true);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const getNeighbors = React.useCallback(
    (index: number) => {
      const r = Math.floor(index / cols);
      const c = index % cols;
      const res: number[] = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) res.push(nr * cols + nc);
        }
      }
      return res;
    },
    [cols, rows],
  );

  const initBoard = React.useCallback(() => {
    setBoard(Array(totalCells).fill(0));
    setRevealed(Array(totalCells).fill(false));
    setFlagged(Array(totalCells).fill(false));
    setGameStatus("ready");
    setTime(0);
    setMinesLeft(mines);
    setFirstClick(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [totalCells, mines]);

  React.useEffect(() => {
    initBoard();
  }, [difficulty, initBoard]);

  const placeMines = (firstIndex: number) => {
    const newBoard = Array(totalCells).fill(0);
    let placed = 0;
    while (placed < mines) {
      const idx = Math.floor(Math.random() * totalCells);
      if (idx !== firstIndex && newBoard[idx] !== -1) {
        newBoard[idx] = -1;
        placed++;
      }
    }
    for (let i = 0; i < totalCells; i++) {
      if (newBoard[i] === -1) continue;
      let count = 0;
      getNeighbors(i).forEach((n) => {
        if (newBoard[n] === -1) count++;
      });
      newBoard[i] = count;
    }
    setBoard(newBoard);
    return newBoard;
  };

  const reveal = (index: number, currentBoard: number[], currentRevealed: boolean[]): boolean[] => {
    if (currentRevealed[index] || flagged[index]) return currentRevealed;
    const newRevealed = [...currentRevealed];
    newRevealed[index] = true;
    if (currentBoard[index] === 0) {
      getNeighbors(index).forEach((n) => {
        if (!newRevealed[n]) {
          const deeper = reveal(n, currentBoard, newRevealed);
          deeper.forEach((v, i) => (newRevealed[i] = v));
        }
      });
    }
    return newRevealed;
  };

  const handleClick = (index: number) => {
    if (gameStatus === "won" || gameStatus === "lost" || flagged[index]) return;

    let currentBoard = board;
    if (firstClick) {
      currentBoard = placeMines(index);
      setFirstClick(false);
      setGameStatus("playing");
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    }

    if (currentBoard[index] === -1) {
      const allRevealed = revealed.map((_, i) => (currentBoard[i] === -1 ? true : revealed[i]));
      allRevealed[index] = true;
      setRevealed(allRevealed);
      setGameStatus("lost");
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const newRevealed = reveal(index, currentBoard, revealed);
    setRevealed(newRevealed);

    const unrevealed = newRevealed.filter((r) => !r).length;
    if (unrevealed === mines) {
      setGameStatus("won");
      if (timerRef.current) clearInterval(timerRef.current);
      setFlagged(currentBoard.map((v) => v === -1));
      setMinesLeft(0);
    }
  };

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    if (gameStatus === "won" || gameStatus === "lost" || revealed[index]) return;
    const newFlagged = [...flagged];
    newFlagged[index] = !newFlagged[index];
    setFlagged(newFlagged);
    setMinesLeft((prev) => (newFlagged[index] ? prev - 1 : prev + 1));
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const getCellContent = (index: number) => {
    if (flagged[index]) return "🚩";
    if (!revealed[index]) return null;
    if (board[index] === -1) return "💣";
    if (board[index] > 0) return board[index];
    return null;
  };

  return (
    <div className={cn("relative box-border flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[24px] p-5 select-none", className)} style={{ background: "linear-gradient(160deg, #f0f4f8 0%, #d9e2ec 100%)", fontFamily: "'Montserrat', system-ui, sans-serif", ...style }} {...props}>
      <div className="mb-4 flex w-full max-w-[420px] items-center justify-between px-2">
        <div className="flex min-w-[70px] items-center justify-center gap-1.5 rounded-[8px] bg-[#222] px-3 py-1.5 font-mono text-[22px] font-bold text-[#ff3b30]">
          <span className="text-xl">🤔</span>
          <span className="tracking-[1px]">{minesLeft.toString().padStart(2, "0")}</span>
        </div>

        <motion.button className="cursor-pointer border-none bg-transparent text-4xl leading-none" onClick={initBoard} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {gameStatus === "won" ? "😎" : gameStatus === "lost" ? "😵" : "🙂"}
        </motion.button>

        <div className="flex min-w-[70px] items-center justify-center rounded-[8px] bg-[#222] px-3 py-1.5 font-mono text-[22px] font-bold text-[#ff3b30]">
          <span className="tracking-[1px]">{formatTime(time)}</span>
        </div>
      </div>

      <div className="grid gap-[3px] rounded-[12px] bg-[#999] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, width: Math.min(cols * 32, 480) }}>
        {Array.from({ length: totalCells }).map((_, i) => {
          const content = getCellContent(i);
          return (
            <motion.div
              key={i}
              className="flex h-7 w-7 items-center justify-center rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] font-bold"
              style={{
                backgroundColor: revealed[i] ? (board[i] === -1 && gameStatus === "lost" ? "#ffcccc" : "#e8e8e8") : "#c0c0c0",
                cursor: revealed[i] || gameStatus === "won" || gameStatus === "lost" ? "default" : "pointer",
              }}
              onClick={() => handleClick(i)}
              onContextMenu={(e) => handleRightClick(e, i)}
              whileHover={!revealed[i] && gameStatus !== "won" && gameStatus !== "lost" ? { scale: 1.05, backgroundColor: "#d0d0d0" } : {}}
              whileTap={!revealed[i] ? { scale: 0.95 } : {}}
            >
              <AnimatePresence>
                {content && (
                  <motion.span
                    key={content}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    style={{ fontSize: board[i] === -1 || flagged[i] ? 16 : 15, fontWeight: 700, color: board[i] > 0 ? NUMBER_COLORS[board[i]] : board[i] === -1 ? mineColor : flagColor }}
                  >
                    {content}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {(gameStatus === "won" || gameStatus === "lost") && (
          <motion.div className="absolute inset-0 z-20 flex items-center justify-center rounded-[24px] bg-black/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.7, y: 20 }} animate={{ scale: 1, y: 0 }} className="rounded-[20px] bg-white px-10 py-7 text-center text-2xl font-extrabold shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
              {gameStatus === "won" ? "🎉 You Win!" : "💥 Boom!"}
              <br />
              <button className="mt-4 cursor-pointer rounded-full border-none bg-[#111] px-7 py-2.5 text-[15px] font-bold text-white" onClick={initBoard}>
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {gameStatus === "won" && <Confetti />}
    </div>
  );
}
