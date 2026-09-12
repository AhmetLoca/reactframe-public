"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LevelConfig {
  id: number;
  name: string;
  mazeWidth: number;
  mazeHeight: number;
}

const LEVEL_CONFIGS: LevelConfig[] = [
  { id: 1, name: "1. Very Easy", mazeWidth: 140, mazeHeight: 100 },
  { id: 2, name: "2. Easy", mazeWidth: 180, mazeHeight: 120 },
  { id: 3, name: "3. Medium-Easy", mazeWidth: 220, mazeHeight: 140 },
  { id: 4, name: "4. Medium", mazeWidth: 260, mazeHeight: 160 },
  { id: 5, name: "5. Medium-Hard", mazeWidth: 300, mazeHeight: 180 },
  { id: 6, name: "6. Hard", mazeWidth: 320, mazeHeight: 200 },
  { id: 7, name: "7. Very Hard", mazeWidth: 360, mazeHeight: 220 },
  { id: 8, name: "8. Extreme", mazeWidth: 380, mazeHeight: 240 },
  { id: 9, name: "9. Legendary", mazeWidth: 400, mazeHeight: 260 },
  { id: 10, name: "10. No Way", mazeWidth: 420, mazeHeight: 280 },
];

type DirKey = "u" | "d" | "l" | "r";

interface GridCell {
  u: number;
  d: number;
  l: number;
  r: number;
  v: number;
}

const MOD_DIR: Record<DirKey, { x: number; y: number; o: DirKey }> = {
  u: { y: -1, x: 0, o: "d" },
  d: { y: 1, x: 0, o: "u" },
  l: { y: 0, x: -1, o: "r" },
  r: { y: 0, x: 1, o: "l" },
};

const DIRS: DirKey[] = ["u", "d", "l", "r"];

const btnStyle = (color: string): React.CSSProperties => ({
  width: 60,
  height: 60,
  border: `2px ${color} solid`,
  borderRadius: 8,
  alignSelf: "center",
  justifySelf: "center",
  cursor: "pointer",
  display: "grid",
  background: "transparent",
  padding: 0,
  outline: "none",
  WebkitAppearance: "none",
  WebkitTapHighlightColor: "transparent",
});

const chevronStyle: React.CSSProperties = {
  height: 20,
  width: 20,
  alignSelf: "center",
  justifySelf: "center",
  color: "#fff",
  fontSize: 20,
  lineHeight: "20px",
  textAlign: "center",
};

const overlayBtnStyle: React.CSSProperties = {
  padding: "12px 22px",
  borderRadius: 10,
  border: "none",
  background: "#fff",
  color: "#111",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

export interface MazeRunnerGameProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  background?: string;
  barrierColor?: string;
  buttonColor?: string;
  emojiStart?: string;
}

export function MazeRunnerGame({
  className,
  style,
  background = "#222222",
  barrierColor = "#ffffff",
  buttonColor = "#ffffff",
  emojiStart = "🥺",
  ...props
}: MazeRunnerGameProps) {
  const [level, setLevel] = React.useState(1);
  const [isWon, setIsWon] = React.useState(false);
  const [emoji, setEmoji] = React.useState(emojiStart);
  const [homeEmoji, setHomeEmoji] = React.useState("🏠");

  const [time, setTime] = React.useState(0);
  const [totalScore, setTotalScore] = React.useState(0);
  const [levelScore, setLevelScore] = React.useState(0);
  const [finalTime, setFinalTime] = React.useState(0);

  const config = LEVEL_CONFIGS[level - 1];
  const mazeWidth = config.mazeWidth;
  const mazeHeight = config.mazeHeight;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const mazeRef = React.useRef<HTMLDivElement>(null);
  const thingieRef = React.useRef<HTMLDivElement>(null);
  const homeRef = React.useRef<HTMLDivElement>(null);

  const buRef = React.useRef<HTMLButtonElement>(null);
  const bdRef = React.useRef<HTMLButtonElement>(null);
  const blRef = React.useRef<HTMLButtonElement>(null);
  const brRef = React.useRef<HTMLButtonElement>(null);

  const step = 20;
  const size = 20;
  const bwidth = 2;

  const nogoX = React.useRef<number[]>([]);
  const nogoX2 = React.useRef<number[]>([]);
  const nogoY = React.useRef<number[]>([]);
  const nogoY2 = React.useRef<number[]>([]);
  const maxl = React.useRef(0);
  const prevl = React.useRef(0);
  const firstMove = React.useRef(true);
  const allowTilt = React.useRef(true);
  const lastUD = React.useRef(0);
  const lastLR = React.useRef(0);
  const lasttouchpY = React.useRef(0);
  const lasttouchpX = React.useRef(0);
  const lastscrollpY = React.useRef(0);
  const lastscrollpX = React.useRef(0);

  const timerStart = React.useRef<number | null>(null);
  const timerInterval = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const hasMoved = React.useRef(false);

  const mThreshold = 15;
  const sThreshold = 15;
  const scThreshold = 20;

  const gp = React.useRef<(Gamepad | undefined)[]>([]);
  const allowU = React.useRef(true);
  const allowD = React.useRef(true);
  const allowL = React.useRef(true);
  const allowR = React.useRef(true);
  const allowAU = React.useRef(true);
  const allowAD = React.useRef(true);
  const allowAL = React.useRef(true);
  const allowAR = React.useRef(true);

  const grid = React.useRef<GridCell[][]>([]);

  const startTimer = () => {
    if (hasMoved.current || isWon) return;
    hasMoved.current = true;
    timerStart.current = Date.now();
    timerInterval.current = setInterval(() => {
      const elapsed = (Date.now() - (timerStart.current ?? Date.now())) / 1000;
      setTime(elapsed);
    }, 50);
  };

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const calculateScore = (elapsed: number, lvl: number) => {
    const base = 4000 + lvl * 400;
    const timePenalty = Math.floor(elapsed * 80);
    return Math.max(200, base - timePenalty);
  };

  const limShuffle = <T,>(array: T[], s: number): T[] => {
    const con = array.slice(0, s);
    const ran = array.slice(s);
    for (let i = ran.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ran[i], ran[j]] = [ran[j], ran[i]];
    }
    return con.concat(ran);
  };

  const confSideEl = (el: HTMLDivElement) => {
    el.className = "barrier";
    el.style.width = bwidth + "px";
    el.style.background = barrierColor;
    el.style.position = "absolute";
  };

  const genSides = React.useCallback(() => {
    if (!mazeRef.current || !thingieRef.current || !homeRef.current) return;

    const existing = mazeRef.current.querySelectorAll(".barrier");
    existing.forEach((el) => el.remove());

    nogoX.current = [];
    nogoX2.current = [];
    nogoY.current = [];
    nogoY2.current = [];

    const max = mazeHeight / step;
    const l1 = Math.floor(Math.random() * max) * step;
    const l2 = mazeHeight - step - l1;

    const lb1 = document.createElement("div");
    lb1.style.top = step + "px";
    lb1.style.left = step + "px";
    lb1.style.height = l1 + "px";

    const lb2 = document.createElement("div");
    lb2.style.top = l1 + step * 2 + "px";
    lb2.style.left = step + "px";
    lb2.style.height = l2 + "px";

    const rb1 = document.createElement("div");
    rb1.style.top = step + "px";
    rb1.style.left = mazeWidth + step + "px";
    rb1.style.height = l2 + "px";

    const rb2 = document.createElement("div");
    rb2.style.top = l2 + step * 2 + "px";
    rb2.style.left = mazeWidth + step + "px";
    rb2.style.height = l1 + "px";

    nogoX.current.push(0, mazeWidth + 2 * step, 0, 0, mazeWidth + step, mazeWidth + step);
    nogoX2.current.push(bwidth, mazeWidth + 2 * step + bwidth, step, step, mazeWidth + 2 * step, mazeWidth + 2 * step);
    nogoY.current.push(l1 + step, l2 + step, l1 + step, l1 + 2 * step, l2 + step, l2 + 2 * step);
    nogoY2.current.push(l1 + 2 * step, l2 + 2 * step, l1 + step + bwidth, l1 + 2 * step + bwidth, l2 + step + bwidth, l2 + 2 * step + bwidth);

    thingieRef.current.style.top = l1 + step + "px";
    thingieRef.current.style.left = "0px";
    homeRef.current.style.top = l2 + step + "px";
    homeRef.current.style.left = mazeWidth + step + "px";
    [lb1, lb2, rb1, rb2].forEach((el) => {
      confSideEl(el);
      mazeRef.current?.appendChild(el);
    });

    const top = document.createElement("div");
    top.className = "barrier";
    top.style.cssText = `position:absolute;top:20px;left:20px;width:${mazeWidth}px;height:2px;background:${barrierColor};`;
    mazeRef.current.appendChild(top);

    const bottom = document.createElement("div");
    bottom.className = "barrier";
    bottom.style.cssText = `position:absolute;top:${mazeHeight + 20}px;left:20px;width:${mazeWidth + 2}px;height:2px;background:${barrierColor};`;
    mazeRef.current.appendChild(bottom);
  }, [mazeWidth, mazeHeight, barrierColor]);

  const genMaze = (cx: number, cy: number, s: number, mx: number, my: number) => {
    const d = limShuffle(DIRS, s);
    for (let i = 0; i < d.length; i++) {
      const nx = cx + MOD_DIR[d[i]].x;
      const ny = cy + MOD_DIR[d[i]].y;
      grid.current[cy][cx].v = 1;

      if (nx >= 0 && nx < mx && ny >= 0 && ny < my && grid.current[ny][nx].v === 0) {
        grid.current[cy][cx][d[i]] = 1;
        grid.current[ny][nx][MOD_DIR[d[i]].o] = 1;
        genMaze(nx, ny, i, mx, my);
      }
    }
  };

  const drawLines = (x: number, y: number, l: number, _r: number, _u: number, d: number, _mx: number, my: number) => {
    if (!mazeRef.current) return;
    const top = (y + 1) * step;
    const left = (x + 1) * step;

    if (l === 0 && x > 0) {
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;left:${left}px;height:${step}px;top:${top}px;width:${bwidth}px;background:${barrierColor};`;
      el.className = "barrier";
      mazeRef.current.appendChild(el);
    }

    if (d === 0 && y < my - 1) {
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;left:${left}px;height:${bwidth}px;top:${top + step}px;width:${step + bwidth}px;background:${barrierColor};`;
      el.className = "barrier";
      mazeRef.current.appendChild(el);
    }
  };

  const drawMaze = (mx: number, my: number) => {
    for (let x = 0; x < mx; x++) {
      for (let y = 0; y < my; y++) {
        const cell = grid.current[y][x];
        drawLines(x, y, cell.l, cell.r, cell.u, cell.d, mx, my);
      }
    }
  };

  const checkXboundry = (dir: "l" | "r") => {
    if (!thingieRef.current) return false;
    const x = thingieRef.current.offsetLeft;
    const y = thingieRef.current.offsetTop;
    const ok: number[] = [];
    const len = Math.max(nogoX.current.length, nogoX2.current.length, nogoY.current.length, nogoY2.current.length);

    for (let i = 0; i < len; i++) {
      let check = 0;
      if (y < nogoY.current[i] || y > nogoY2.current[i] - size) check = 1;
      if (dir === "r" && (x < nogoX.current[i] - size || x > nogoX2.current[i] - size)) check = 1;
      if (dir === "l" && (x < nogoX.current[i] || x > nogoX2.current[i])) check = 1;
      ok.push(check);
    }
    return ok.every((e) => e > 0);
  };

  const checkYboundry = (dir: "u" | "d") => {
    if (!thingieRef.current) return false;
    const x = thingieRef.current.offsetLeft;
    const y = thingieRef.current.offsetTop;
    const ok: number[] = [];
    const len = Math.max(nogoX.current.length, nogoX2.current.length, nogoY.current.length, nogoY2.current.length);

    for (let i = 0; i < len; i++) {
      let check = 0;
      if (x < nogoX.current[i] || x > nogoX2.current[i] - size) check = 1;
      if (dir === "u" && (y < nogoY.current[i] || y > nogoY2.current[i])) check = 1;
      if (dir === "d" && (y < nogoY.current[i] - size || y > nogoY2.current[i] - size)) check = 1;
      ok.push(check);
    }
    return ok.every((e) => e > 0);
  };

  const animKeys = (key: HTMLButtonElement | null) => {
    if (!key) return;
    const id = key.id;
    if (id === "bu") {
      key.style.border = `3px ${buttonColor} solid`;
      key.style.borderTop = `1px ${buttonColor} solid`;
      key.style.borderBottom = `4px ${buttonColor} solid`;
      key.style.transform = "translateY(-2px)";
    }
    if (id === "bd") {
      key.style.border = `3px ${buttonColor} solid`;
      key.style.borderBottom = `1px ${buttonColor} solid`;
      key.style.borderTop = `4px ${buttonColor} solid`;
      key.style.transform = "translateY(2px)";
    }
    if (id === "bl") {
      key.style.border = `3px ${buttonColor} solid`;
      key.style.borderLeft = `1px ${buttonColor} solid`;
      key.style.borderRight = `4px ${buttonColor} solid`;
      key.style.transform = "translateX(-2px)";
    }
    if (id === "br") {
      key.style.border = `3px ${buttonColor} solid`;
      key.style.borderRight = `1px ${buttonColor} solid`;
      key.style.borderLeft = `4px ${buttonColor} solid`;
      key.style.transform = "translateX(2px)";
    }
    setTimeout(() => {
      key.style.border = `2px ${buttonColor} solid`;
      key.style.transform = "translate(0,0)";
    }, 150);
  };

  const updateEmo = (lr: boolean) => {
    if (!thingieRef.current || !homeRef.current) return;
    const left = thingieRef.current.offsetLeft;
    const top = thingieRef.current.offsetTop;
    const homeTop = homeRef.current.offsetTop;

    if (lr) {
      if (left < maxl.current) setEmoji("🙄");
      if (left < maxl.current - 2 * step) setEmoji("😒");
      if (left < maxl.current - 4 * step) setEmoji("😣");
      if (left < maxl.current - 6 * step) setEmoji("🤬");
      if (left > prevl.current) setEmoji("😐");
      if (left >= maxl.current) {
        setEmoji(left > mazeWidth * 0.6 ? "😀" : "🙂");
        maxl.current = left;
      }
      if (left === 0) setEmoji("😢");

      if (left > mazeWidth - step && top === homeTop) {
        setEmoji("🤗");
        setHomeEmoji("🏠");
      }
      if (left > mazeWidth) {
        setEmoji("");
        setHomeEmoji("🥳");

        stopTimer();
        const elapsed = time;
        setFinalTime(elapsed);
        const score = calculateScore(elapsed, level);
        setLevelScore(score);
        setTotalScore((prev) => prev + score);
        setIsWon(true);
      }
      prevl.current = left;
    } else {
      if (left > mazeWidth - step && top === homeTop) setEmoji("🤗");
      else if (left > mazeWidth - step) setEmoji("🙄");
    }
  };

  const up = React.useCallback(() => {
    if (isWon) return;
    startTimer();
    animKeys(buRef.current);
    if (checkYboundry("u") && thingieRef.current) {
      thingieRef.current.style.top = thingieRef.current.offsetTop - step + "px";
      updateEmo(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWon, mazeWidth, time]);

  const down = React.useCallback(() => {
    if (isWon) return;
    startTimer();
    animKeys(bdRef.current);
    if (checkYboundry("d") && thingieRef.current) {
      thingieRef.current.style.top = thingieRef.current.offsetTop + step + "px";
      updateEmo(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWon, mazeWidth, time]);

  const left = React.useCallback(() => {
    if (isWon) return;
    startTimer();
    animKeys(blRef.current);
    if (checkXboundry("l") && thingieRef.current) {
      thingieRef.current.style.left = thingieRef.current.offsetLeft - step + "px";
    }
    updateEmo(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWon, mazeWidth, time]);

  const right = React.useCallback(() => {
    if (isWon) return;
    startTimer();
    animKeys(brRef.current);
    if (checkXboundry("r") && thingieRef.current) {
      thingieRef.current.style.left = thingieRef.current.offsetLeft + step + "px";
    }
    updateEmo(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWon, mazeWidth, time]);

  const generateLevel = React.useCallback(() => {
    if (!mazeRef.current) return;

    stopTimer();
    hasMoved.current = false;
    setTime(0);
    setFinalTime(0);
    setLevelScore(0);

    const mx = mazeWidth / step;
    const my = mazeHeight / step;

    grid.current = [];
    for (let i = 0; i < my; i++) {
      const sg: GridCell[] = [];
      for (let a = 0; a < mx; a++) {
        sg.push({ u: 0, d: 0, l: 0, r: 0, v: 0 });
      }
      grid.current.push(sg);
    }

    genSides();
    genMaze(0, 0, 0, mx, my);
    drawMaze(mx, my);

    const barriers = mazeRef.current.getElementsByClassName("barrier");
    for (let b = 0; b < barriers.length; b++) {
      const el = barriers[b] as HTMLElement;
      nogoX.current.push(el.offsetLeft);
      nogoX2.current.push(el.offsetLeft + el.clientWidth);
      nogoY.current.push(el.offsetTop);
      nogoY2.current.push(el.offsetTop + el.clientHeight);
    }

    maxl.current = 0;
    prevl.current = 0;
    setEmoji(emojiStart);
    setHomeEmoji("🏠");
    setIsWon(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mazeWidth, mazeHeight, barrierColor, emojiStart, genSides]);

  React.useEffect(() => {
    generateLevel();
    return () => stopTimer();
  }, [level, generateLevel]);

  React.useEffect(() => {
    const keys = (e: KeyboardEvent) => {
      if (isWon) return;
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          up();
          break;
        case "ArrowDown":
        case "KeyS":
          down();
          break;
        case "ArrowLeft":
        case "KeyA":
          left();
          break;
        case "ArrowRight":
        case "KeyD":
          right();
          break;
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, [up, down, left, right, isWon]);

  React.useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (isWon) return;
      if (e.beta == null || e.gamma == null) return;
      if (firstMove.current) {
        lastUD.current = e.beta;
        lastLR.current = e.gamma;
        firstMove.current = false;
      }
      if (allowTilt.current) {
        if (e.beta < lastUD.current - mThreshold) {
          up();
          allowTilt.current = false;
          setTimeout(() => (allowTilt.current = true), 200);
        }
        if (e.beta > lastUD.current + mThreshold) {
          down();
          allowTilt.current = false;
          setTimeout(() => (allowTilt.current = true), 200);
        }
        if (e.gamma < lastLR.current - mThreshold) {
          left();
          allowTilt.current = false;
          setTimeout(() => (allowTilt.current = true), 200);
        }
        if (e.gamma > lastLR.current + mThreshold) {
          right();
          allowTilt.current = false;
          setTimeout(() => (allowTilt.current = true), 200);
        }
      }
    };
    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [up, down, left, right, isWon]);

  React.useEffect(() => {
    const cont = containerRef.current;
    if (!cont) return;

    const onTouchStart = (e: TouchEvent) => {
      lasttouchpY.current = e.changedTouches[0].pageY;
      lasttouchpX.current = e.changedTouches[0].pageX;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isWon) return;
      e.preventDefault();
      const diffY = e.changedTouches[0].pageY - lasttouchpY.current;
      const diffX = e.changedTouches[0].pageX - lasttouchpX.current;

      if (diffY > sThreshold) {
        down();
        lasttouchpY.current = e.changedTouches[0].pageY;
      } else if (diffY < -sThreshold) {
        up();
        lasttouchpY.current = e.changedTouches[0].pageY;
      }
      if (diffX > sThreshold) {
        right();
        lasttouchpX.current = e.changedTouches[0].pageX;
      } else if (diffX < -sThreshold) {
        left();
        lasttouchpX.current = e.changedTouches[0].pageX;
      }
    };

    cont.addEventListener("touchstart", onTouchStart, { passive: true });
    cont.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      cont.removeEventListener("touchstart", onTouchStart);
      cont.removeEventListener("touchmove", onTouchMove);
    };
  }, [up, down, left, right, isWon]);

  React.useEffect(() => {
    const cont = containerRef.current;
    if (!cont) return;

    const onWheel = (e: WheelEvent) => {
      if (isWon) return;
      lastscrollpY.current += e.deltaY;
      if (lastscrollpY.current > 0 && e.deltaY < 0) lastscrollpY.current = 0;
      if (lastscrollpY.current < 0 && e.deltaY > 0) lastscrollpY.current = 0;

      if (lastscrollpY.current > scThreshold) {
        up();
        lastscrollpY.current = 0;
      }
      if (lastscrollpY.current < -scThreshold) {
        down();
        lastscrollpY.current = 0;
      }

      lastscrollpX.current += e.deltaX;
      if (lastscrollpX.current > 0 && e.deltaX < 0) lastscrollpX.current = 0;
      if (lastscrollpX.current < 0 && e.deltaX > 0) lastscrollpX.current = 0;

      if (lastscrollpX.current > scThreshold) {
        left();
        lastscrollpX.current = 0;
      }
      if (lastscrollpX.current < -scThreshold) {
        right();
        lastscrollpX.current = 0;
      }
    };

    cont.addEventListener("wheel", onWheel, { passive: true });
    return () => cont.removeEventListener("wheel", onWheel);
  }, [up, down, left, right, isWon]);

  React.useEffect(() => {
    const haveEvents = "ongamepadconnected" in window;
    let rafId: number;

    const gpTimer = (adir: DirKey) => {
      if (adir === "u") allowU.current = false;
      if (adir === "d") allowD.current = false;
      if (adir === "l") allowL.current = false;
      if (adir === "r") allowR.current = false;
      setTimeout(() => {
        allowU.current = true;
        allowD.current = true;
        allowL.current = true;
        allowR.current = true;
      }, 200);
    };

    const gpATimer = (adir: DirKey) => {
      if (adir === "u") allowAU.current = false;
      if (adir === "d") allowAD.current = false;
      if (adir === "l") allowAL.current = false;
      if (adir === "r") allowAR.current = false;
      setTimeout(() => {
        allowAU.current = true;
        allowAD.current = true;
        allowAL.current = true;
        allowAR.current = true;
      }, 200);
    };

    const updateStatus = () => {
      const pad = gp.current[0];
      if (!pad || isWon) {
        rafId = requestAnimationFrame(updateStatus);
        return;
      }

      if (pad.buttons[12]?.pressed && allowU.current) {
        up();
        gpTimer("u");
      }
      if (!pad.buttons[12]?.pressed) allowU.current = true;
      if (pad.buttons[13]?.pressed && allowD.current) {
        down();
        gpTimer("d");
      }
      if (!pad.buttons[13]?.pressed) allowD.current = true;
      if (pad.buttons[14]?.pressed && allowL.current) {
        left();
        gpTimer("l");
      }
      if (!pad.buttons[14]?.pressed) allowL.current = true;
      if (pad.buttons[15]?.pressed && allowR.current) {
        right();
        gpTimer("r");
      }
      if (!pad.buttons[15]?.pressed) allowR.current = true;

      if ((pad.axes[1] < -0.8 || pad.axes[3] < -0.8) && allowAU.current) {
        up();
        gpATimer("u");
      }
      if ((pad.axes[1] > 0.8 || pad.axes[3] > 0.8) && allowAD.current) {
        down();
        gpATimer("d");
      }
      if ((pad.axes[0] < -0.8 || pad.axes[2] < -0.8) && allowAL.current) {
        left();
        gpATimer("l");
      }
      if ((pad.axes[0] > 0.8 || pad.axes[2] > 0.8) && allowAR.current) {
        right();
        gpATimer("r");
      }

      rafId = requestAnimationFrame(updateStatus);
    };

    const connectGamepad = (e: GamepadEvent) => {
      gp.current[0] = e.gamepad;
      rafId = requestAnimationFrame(updateStatus);
    };
    const disconnectGamepad = () => {
      gp.current = [];
    };

    window.addEventListener("gamepadconnected", connectGamepad);
    window.addEventListener("gamepaddisconnected", disconnectGamepad);

    let scanInterval: ReturnType<typeof setInterval> | undefined;
    if (!haveEvents) {
      scanInterval = setInterval(() => {
        const pads = navigator.getGamepads?.() || [];
        if (pads[0] && !gp.current[0]) {
          gp.current[0] = pads[0] ?? undefined;
          rafId = requestAnimationFrame(updateStatus);
        }
      }, 500);
    }

    return () => {
      window.removeEventListener("gamepadconnected", connectGamepad);
      window.removeEventListener("gamepaddisconnected", disconnectGamepad);
      if (rafId) cancelAnimationFrame(rafId);
      if (scanInterval) clearInterval(scanInterval);
    };
  }, [up, down, left, right, isWon]);

  const formatTime = (t: number) => t.toFixed(1) + "s";

  return (
    <div
      ref={containerRef}
      className={cn("relative flex w-full h-full flex-col overflow-hidden select-none", className)}
      style={{ background, touchAction: "none", fontFamily: "system-ui, -apple-system, sans-serif", ...style }}
      {...props}
    >
      <div
        className="flex items-center justify-between border-b px-4 py-2.5 text-sm font-semibold text-white"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <div>{config.name}</div>
        <div className="flex gap-4">
          <div>⏱ {formatTime(time)}</div>
          <div>🏆 {totalScore}</div>
        </div>
      </div>

      <div className="relative flex-1">
        <div
          ref={mazeRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: mazeWidth + 40, height: mazeHeight + 40 }}
        >
          <div ref={thingieRef} className="absolute h-5 w-5 rounded-full">
            <div className="absolute top-1 left-px text-[15px] leading-[15px]">{emoji}</div>
          </div>

          <div ref={homeRef} className="absolute h-5 w-5 rounded-full">
            <div className="absolute top-1 left-px text-[15px] leading-[15px]">{homeEmoji}</div>
          </div>
        </div>
      </div>

      <div className="grid h-[150px] place-items-center">
        <div className="grid h-[140px] w-[210px] grid-cols-3 grid-rows-2">
          <button
            ref={buRef}
            id="bu"
            onClick={() => {
              up();
              firstMove.current = true;
            }}
            style={{ ...btnStyle(buttonColor), gridColumnStart: 2 }}
          >
            <div style={chevronStyle}>↑</div>
          </button>
          <button
            ref={bdRef}
            id="bd"
            onClick={() => {
              down();
              firstMove.current = true;
            }}
            style={{ ...btnStyle(buttonColor), gridColumnStart: 2, gridRowStart: 2 }}
          >
            <div style={chevronStyle}>↓</div>
          </button>
          <button
            ref={blRef}
            id="bl"
            onClick={() => {
              left();
              firstMove.current = true;
            }}
            style={{ ...btnStyle(buttonColor), gridColumnStart: 1, gridRowStart: 2 }}
          >
            <div style={chevronStyle}>←</div>
          </button>
          <button
            ref={brRef}
            id="br"
            onClick={() => {
              right();
              firstMove.current = true;
            }}
            style={{ ...btnStyle(buttonColor), gridColumnStart: 3, gridRowStart: 2 }}
          >
            <div style={chevronStyle}>→</div>
          </button>
        </div>
      </div>

      {isWon && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 p-5" style={{ background: "rgba(0,0,0,0.82)" }}>
          <div className="text-5xl">🥳</div>
          <div className="text-center text-[22px] font-bold text-white">{level === 10 ? "Congrats! You finished all levels!" : "Level complete!"}</div>

          <div className="mt-1 text-[15px] text-[#aaa]">
            Time: <span className="font-semibold text-white">{formatTime(finalTime)}</span>
          </div>
          <div className="text-[15px] text-[#aaa]">
            Level score: <span className="font-semibold text-[#4ade80]">+{levelScore}</span>
          </div>
          <div className="mt-1 text-lg font-bold text-white">Total score: {totalScore}</div>

          <div className="mt-4 flex gap-3">
            {level < 10 && (
              <button onClick={() => setLevel((l) => l + 1)} style={overlayBtnStyle}>
                Next Level →
              </button>
            )}
            <button
              onClick={() => {
                if (level === 10) {
                  setLevel(1);
                  setTotalScore(0);
                } else {
                  generateLevel();
                }
              }}
              style={{ ...overlayBtnStyle, background: "#444", color: "#fff" }}
            >
              {level === 10 ? "Back to Start" : "Play Again"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
