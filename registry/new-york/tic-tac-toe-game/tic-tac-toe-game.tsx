"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Cell = "EMPTY" | "CIRCLE" | "CROSS";

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const LINE_COORDS: Record<string, { x1: number; y1: number; x2: number; y2: number }> = {
  "0,1,2": { x1: 15, y1: 55, x2: 315, y2: 55 },
  "3,4,5": { x1: 15, y1: 165, x2: 315, y2: 165 },
  "6,7,8": { x1: 15, y1: 275, x2: 315, y2: 275 },
  "0,3,6": { x1: 55, y1: 15, x2: 55, y2: 315 },
  "1,4,7": { x1: 165, y1: 15, x2: 165, y2: 315 },
  "2,5,8": { x1: 275, y1: 15, x2: 275, y2: 315 },
  "0,4,8": { x1: 20, y1: 20, x2: 310, y2: 310 },
  "2,4,6": { x1: 310, y1: 20, x2: 20, y2: 310 },
};

function checkWinner(board: Cell[]): { winner: Cell | "tie" | null; line: number[] | null } {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] !== "EMPTY" && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  if (board.every((p) => p !== "EMPTY")) return { winner: "tie", line: null };
  return { winner: null, line: null };
}

function Square({ value, onClick, circleColor, crossColor, squareColor, disabled }: { value: Cell; onClick: () => void; circleColor: string; crossColor: string; squareColor: string; disabled: boolean }) {
  return (
    <motion.div
      className="flex cursor-pointer items-center justify-center rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
      style={{ backgroundColor: squareColor }}
      onClick={onClick}
      whileHover={!disabled && value === "EMPTY" ? { scale: 1.04, backgroundColor: "#f8f8f8" } : {}}
      whileTap={!disabled && value === "EMPTY" ? { scale: 0.96 } : {}}
    >
      <AnimatePresence>
        {value === "CIRCLE" && (
          <motion.svg key="circle" width="80" height="80" viewBox="-50 -50 100 100" initial={{ scale: 0, opacity: 0, rotate: -90 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
            <circle cx="0" cy="0" r="36" fill="none" stroke={circleColor} strokeWidth="12" strokeLinecap="round" />
          </motion.svg>
        )}
        {value === "CROSS" && (
          <motion.svg key="cross" width="80" height="80" viewBox="-50 -50 100 100" initial={{ scale: 0, opacity: 0, rotate: 90 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
            <line x1="-32" y1="-32" x2="32" y2="32" stroke={crossColor} strokeWidth="12" strokeLinecap="round" />
            <line x1="-32" y1="32" x2="32" y2="-32" stroke={crossColor} strokeWidth="12" strokeLinecap="round" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Confetti({ colors }: { colors: string[] }) {
  const particles = React.useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 1.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 10,
        rotate: Math.random() * 360,
      })),
    [colors],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-[2px]"
          style={{ left: `${p.x}%`, top: -20, width: p.size, height: p.size * 0.6, backgroundColor: p.color }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ y: 700, opacity: [1, 1, 0], rotate: p.rotate + 720, x: (Math.random() - 0.5) * 200 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export interface TicTacToeGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  circleColor?: string;
  crossColor?: string;
  boardColor?: string;
  squareColor?: string;
  enableAI?: boolean;
}

export function TicTacToeGame({ circleColor = "#FF665C", crossColor = "#EC0B8E", boardColor = "#e0e0e0", squareColor = "#ffffff", enableAI = true, className, style, ...props }: TicTacToeGameProps) {
  const [positions, setPositions] = React.useState<Cell[]>(Array(9).fill("EMPTY"));
  const [player, setPlayer] = React.useState<Cell>("CIRCLE");
  const [winner, setWinner] = React.useState<Cell | "tie" | null>(null);
  const [winningLine, setWinningLine] = React.useState<number[] | null>(null);
  const [scores, setScores] = React.useState({ circle: 0, cross: 0, ties: 0 });
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [isAiThinking, setIsAiThinking] = React.useState(false);

  const getAiMove = (board: Cell[]) => {
    const empty = board.map((v, i) => (v === "EMPTY" ? i : null)).filter((v): v is number => v !== null);
    for (const i of empty) {
      const test = [...board];
      test[i] = "CROSS";
      if (checkWinner(test).winner === "CROSS") return i;
    }
    for (const i of empty) {
      const test = [...board];
      test[i] = "CIRCLE";
      if (checkWinner(test).winner === "CIRCLE") return i;
    }
    if (board[4] === "EMPTY") return 4;
    const corners = [0, 2, 6, 8].filter((i) => board[i] === "EMPTY");
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    return empty[Math.floor(Math.random() * empty.length)];
  };

  const handleWin = (result: { winner: Cell | "tie" | null; line: number[] | null }) => {
    setWinner(result.winner);
    setWinningLine(result.line);
    setShowConfetti(true);
    setScores((prev) => {
      if (result.winner === "CIRCLE") return { ...prev, circle: prev.circle + 1 };
      if (result.winner === "CROSS") return { ...prev, cross: prev.cross + 1 };
      return { ...prev, ties: prev.ties + 1 };
    });
    setTimeout(() => setShowConfetti(false), 3500);
  };

  const takeTurn = (pos: number) => {
    if (positions[pos] !== "EMPTY" || winner || isAiThinking) return;
    const newPositions = [...positions];
    newPositions[pos] = player;
    setPositions(newPositions);

    const result = checkWinner(newPositions);
    if (result.winner) {
      handleWin(result);
      return;
    }

    const nextPlayer: Cell = player === "CIRCLE" ? "CROSS" : "CIRCLE";
    setPlayer(nextPlayer);

    if (enableAI && nextPlayer === "CROSS") {
      setIsAiThinking(true);
      setTimeout(() => {
        const aiPos = getAiMove(newPositions);
        if (aiPos !== undefined) {
          const aiBoard = [...newPositions];
          aiBoard[aiPos] = "CROSS";
          setPositions(aiBoard);
          const aiResult = checkWinner(aiBoard);
          if (aiResult.winner) handleWin(aiResult);
          else setPlayer("CIRCLE");
        }
        setIsAiThinking(false);
      }, 450);
    }
  };

  const reset = () => {
    setPositions(Array(9).fill("EMPTY"));
    setPlayer("CIRCLE");
    setWinner(null);
    setWinningLine(null);
    setShowConfetti(false);
    setIsAiThinking(false);
  };

  const lineCoords = winningLine ? LINE_COORDS[winningLine.join(",")] : null;

  return (
    <div
      className={cn("relative box-border flex w-full flex-col items-center justify-center overflow-hidden rounded-[24px] p-5", className)}
      style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)", fontFamily: "'Montserrat', system-ui, sans-serif", ...style }}
      {...props}
    >
      <div className="mb-3 flex items-center gap-7">
        <div className="flex flex-col items-center gap-0.5" style={{ color: circleColor }}>
          <span className="text-[13px] opacity-70">CIRCLE</span>
          <span className="text-[28px] font-black">{scores.circle}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[13px] opacity-50">TIE</span>
          <span className="text-xl font-bold">{scores.ties}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5" style={{ color: crossColor }}>
          <span className="text-[13px] opacity-70">CROSS</span>
          <span className="text-[28px] font-black">{scores.cross}</span>
        </div>
      </div>

      <div className="mb-4.5 h-6 text-base font-semibold text-[#333]">
        {winner ? (
          <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            {winner === "tie" ? "It's a tie!" : winner === "CIRCLE" ? "Circle wins!" : "Cross wins!"}
          </motion.span>
        ) : isAiThinking ? (
          <span className="opacity-60">AI is thinking...</span>
        ) : (
          <span>
            Turn: <span className="font-black" style={{ color: player === "CIRCLE" ? circleColor : crossColor }}>{player === "CIRCLE" ? "Circle" : "Cross"}</span>
          </span>
        )}
      </div>

      <div className="relative grid grid-cols-3 grid-rows-3 gap-2.5 rounded-[16px] p-2.5" style={{ backgroundColor: boardColor, width: 330, height: 330 }}>
        {positions.map((value, i) => (
          <Square key={i} value={value} onClick={() => takeTurn(i)} circleColor={circleColor} crossColor={crossColor} squareColor={squareColor} disabled={!!winner || isAiThinking} />
        ))}

        <AnimatePresence>
          {lineCoords && (
            <motion.svg className="pointer-events-none absolute inset-0 z-10 h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.55, ease: "easeOut" }}>
              <motion.line x1={lineCoords.x1} y1={lineCoords.y1} x2={lineCoords.x2} y2={lineCoords.y2} stroke={winner === "CIRCLE" ? circleColor : crossColor} strokeWidth="8" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.55 }} />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>

      <motion.button className="mt-5.5 cursor-pointer rounded-full border-none bg-[#111] px-8 py-3 text-[15px] font-bold text-white" style={{ letterSpacing: "0.5px" }} onClick={reset} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        New Game
      </motion.button>

      <AnimatePresence>{showConfetti && <Confetti colors={[circleColor, crossColor, "#FFD700", "#00E5FF"]} />}</AnimatePresence>
    </div>
  );
}
