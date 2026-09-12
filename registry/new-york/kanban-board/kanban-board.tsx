"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Engine constants (do not change — load-bearing geometry/timing values) ──
const DRAG_LIFT_SCALE = 1.04;
const DRAG_TILT_MAX = 6;
const DRAG_TILT_VELOCITY_DIV = 28;
const DRAG_SHADOW_LIFT = 22;
const GHOST_FADE_DURATION = 0.22;
const REORDER_SHIFT_DURATION = 0.28;
const AUTOSCROLL_EDGE = 64;
const AUTOSCROLL_SPEED = 11;
const TILT_DECAY = 0.85;
const AVATAR_STACK_OVERLAP = 10;

export type KanbanPriority = "urgent" | "high" | "medium" | "low";

const PRIORITY_COLOR: Record<KanbanPriority, string> = {
  urgent: "#d44c3a",
  high: "#c98a3f",
  medium: "#6f7fbf",
  low: "#9a9a96",
};

const PRIORITY_LABEL: Record<KanbanPriority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export interface KanbanCard {
  id: string;
  title: string;
  tag?: string;
  tagColor?: string;
  note?: string;
  priority?: KanbanPriority;
  avatars?: string[];
  columnId: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  accentColor: string;
}

interface DragState {
  cardId: string | null;
  fromColumn: string | null;
  overColumn: string | null;
  overIndex: number | null;
  pointerX: number;
  pointerY: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  vx: number;
  tilt: number;
}

export interface KanbanBoardProps {
  columns?: KanbanColumn[];
  cards?: KanbanCard[];
  boardTitle?: string;
  boardSubtitle?: string;
  backgroundColor?: string;
  inkColor?: string;
  mutedColor?: string;
  surfaceColor?: string;
  darkBackgroundColor?: string;
  darkInkColor?: string;
  darkMutedColor?: string;
  darkSurfaceColor?: string;
  defaultTheme?: "light" | "dark";
  showThemeToggle?: boolean;
  showCounts?: boolean;
  className?: string;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

const DEFAULT_COLUMNS: KanbanColumn[] = [
  { id: "backlog", title: "Backlog", accentColor: "#9a9a96" },
  { id: "progress", title: "In Progress", accentColor: "#c98a3f" },
  { id: "review", title: "Review", accentColor: "#6f7fbf" },
  { id: "done", title: "Done", accentColor: "#5fa874" },
];

const DEFAULT_CARDS: KanbanCard[] = [
  { id: "c1", title: "Define onboarding flow", tag: "Design", tagColor: "#c98a3f", priority: "high", columnId: "backlog" },
  { id: "c2", title: "Audit component library", tag: "Design", tagColor: "#c98a3f", priority: "low", columnId: "backlog" },
  { id: "c3", title: "Draft pricing page copy", tag: "Content", tagColor: "#6f7fbf", priority: "medium", columnId: "backlog" },
  { id: "c4", title: "Build settings panel", tag: "Engineering", tagColor: "#5fa874", priority: "urgent", columnId: "progress" },
  { id: "c5", title: "Migrate auth to new provider", tag: "Engineering", tagColor: "#5fa874", priority: "high", columnId: "progress" },
  { id: "c6", title: "Usability test — checkout", tag: "Research", tagColor: "#bf6f8f", priority: "medium", columnId: "review" },
  { id: "c7", title: "Q3 roadmap deck", tag: "Strategy", tagColor: "#9a9a96", priority: "low", columnId: "review" },
  { id: "c8", title: "Launch waitlist landing page", tag: "Marketing", tagColor: "#c9603f", priority: "medium", columnId: "done" },
  { id: "c9", title: "Set up analytics events", tag: "Engineering", tagColor: "#5fa874", priority: "high", columnId: "done" },
];

export function KanbanBoard({
  columns,
  cards: cardsProp,
  boardTitle = "Product Roadmap",
  boardSubtitle = "Drag cards across columns to update status",
  backgroundColor: lightBg = "#f4f3f1",
  inkColor: lightInk = "#0d0d0d",
  mutedColor: lightMuted = "#8a8a86",
  surfaceColor: lightSurface = "#ffffff",
  darkBackgroundColor = "#0d0d0d",
  darkInkColor = "#f4f3f1",
  darkMutedColor = "#9a9a96",
  darkSurfaceColor = "#1c1c1a",
  defaultTheme = "dark",
  showThemeToggle = true,
  showCounts = true,
  className,
}: KanbanBoardProps) {
  const [theme, setTheme] = React.useState<"light" | "dark">(defaultTheme);
  const backgroundColor = theme === "dark" ? darkBackgroundColor : lightBg;
  const inkColor = theme === "dark" ? darkInkColor : lightInk;
  const mutedColor = theme === "dark" ? darkMutedColor : lightMuted;
  const surfaceColor = theme === "dark" ? darkSurfaceColor : lightSurface;

  const toggleTheme = React.useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  const cols = React.useMemo(() => (columns && columns.length ? columns : DEFAULT_COLUMNS), [columns]);
  const initialCards = React.useMemo(() => (cardsProp && cardsProp.length ? cardsProp : DEFAULT_CARDS), [cardsProp]);

  const [cardList, setCardList] = React.useState<KanbanCard[]>(initialCards);
  React.useEffect(() => {
    const id = setTimeout(() => setCardList(initialCards), 0);
    return () => clearTimeout(id);
  }, [initialCards]);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(1200);

  React.useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const updateWidth = (nextWidth: number) => {
      React.startTransition(() => setContainerWidth(nextWidth));
    };

    updateWidth(el.getBoundingClientRect().width || 1200);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      updateWidth(entry.contentRect.width || 1200);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const deviceMode = React.useMemo<"desktop" | "tablet" | "phone">(() => {
    if (containerWidth < 810) return "phone";
    if (containerWidth < 1200) return "tablet";
    return "desktop";
  }, [containerWidth]);

  const cardsByColumn = React.useMemo(() => {
    const map: Record<string, KanbanCard[]> = {};
    for (const col of cols) map[col.id] = [];
    for (const card of cardList) {
      if (!map[card.columnId]) map[card.columnId] = [];
      map[card.columnId].push(card);
    }
    return map;
  }, [cardList, cols]);

  const boardRef = React.useRef<HTMLDivElement>(null);
  const dragLayerRef = React.useRef<HTMLDivElement>(null);
  const columnRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const cardElRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const dragRef = React.useRef<DragState>({
    cardId: null,
    fromColumn: null,
    overColumn: null,
    overIndex: null,
    pointerX: 0,
    pointerY: 0,
    offsetX: 0,
    offsetY: 0,
    width: 0,
    height: 0,
    vx: 0,
    tilt: 0,
  });
  const [dragCardId, setDragCardId] = React.useState<string | null>(null);
  const [dropTarget, setDropTarget] = React.useState<{ columnId: string; index: number } | null>(null);
  const [dragWidth, setDragWidth] = React.useState(0);
  const lastMoveRef = React.useRef({ x: 0, t: 0 });
  const rafRef = React.useRef(0);

  const colsRef = React.useRef(cols);
  const cardsByColumnRef = React.useRef(cardsByColumn);
  React.useEffect(() => {
    colsRef.current = cols;
    cardsByColumnRef.current = cardsByColumn;
  });

  const rectCacheRef = React.useRef<{ cols: Record<string, DOMRect>; cards: Record<string, DOMRect>; board: DOMRect | null }>({ cols: {}, cards: {}, board: null });

  const toggleBtnRef = React.useRef<HTMLButtonElement>(null);

  const renderDragLayer = React.useCallback(() => {
    const layer = dragLayerRef.current;
    const d = dragRef.current;
    if (!layer || !d.cardId) return;
    const x = d.pointerX - d.offsetX;
    const y = d.pointerY - d.offsetY;
    layer.style.transform = `translate3d(${x}px, ${y}px, 0px) rotate(${d.tilt}deg) scale(${DRAG_LIFT_SCALE})`;
  }, []);

  const findDropTarget = React.useCallback(
    (clientX: number, clientY: number) => {
      const cache = rectCacheRef.current;
      for (const col of cols) {
        const rect = cache.cols[col.id];
        if (!rect) continue;
        if (clientX >= rect.left && clientX <= rect.right) {
          const list = cardsByColumn[col.id] || [];
          let index = list.length;
          for (let i = 0; i < list.length; i++) {
            const cardRect = cache.cards[list[i].id];
            if (!cardRect) continue;
            const mid = cardRect.top + cardRect.height / 2;
            if (clientY < mid) {
              index = i;
              break;
            }
          }
          return { columnId: col.id, index };
        }
      }
      return null;
    },
    [cols, cardsByColumn],
  );

  const startDrag = React.useCallback((e: React.PointerEvent, card: KanbanCard) => {
    const cardEl = cardElRefs.current[card.id];
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();

    const colCache: Record<string, DOMRect> = {};
    const cardCache: Record<string, DOMRect> = {};
    for (const col of colsRef.current) {
      const el = columnRefs.current[col.id];
      if (el) colCache[col.id] = el.getBoundingClientRect();
    }
    for (const cards of Object.values(cardsByColumnRef.current)) {
      for (const c of cards) {
        const el = cardElRefs.current[c.id];
        if (el) cardCache[c.id] = el.getBoundingClientRect();
      }
    }
    rectCacheRef.current = { cols: colCache, cards: cardCache, board: boardRef.current?.getBoundingClientRect() ?? null };

    dragRef.current = {
      cardId: card.id,
      fromColumn: card.columnId,
      overColumn: card.columnId,
      overIndex: null,
      pointerX: e.clientX,
      pointerY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      vx: 0,
      tilt: 0,
    };
    lastMoveRef.current.x = e.clientX;
    lastMoveRef.current.t = performance.now();
    setDragWidth(rect.width);
    setDragCardId(card.id);
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    if (!dragCardId) return;

    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      const now = performance.now();
      const dt = Math.max(now - lastMoveRef.current.t, 1);
      const dx = e.clientX - lastMoveRef.current.x;
      d.vx = (dx / dt) * 16;
      lastMoveRef.current.x = e.clientX;
      lastMoveRef.current.t = now;
      d.pointerX = e.clientX;
      d.pointerY = e.clientY;
      const targetTilt = clamp(d.vx / DRAG_TILT_VELOCITY_DIV, -DRAG_TILT_MAX, DRAG_TILT_MAX);
      d.tilt = d.tilt + (targetTilt - d.tilt) * (1 - TILT_DECAY);

      const board = boardRef.current;
      const boardRect = rectCacheRef.current.board;
      if (board && boardRect) {
        if (e.clientX > boardRect.right - AUTOSCROLL_EDGE) board.scrollLeft += AUTOSCROLL_SPEED;
        else if (e.clientX < boardRect.left + AUTOSCROLL_EDGE) board.scrollLeft -= AUTOSCROLL_SPEED;
      }

      const target = findDropTarget(e.clientX, e.clientY);
      if (target) {
        d.overColumn = target.columnId;
        d.overIndex = target.index;
        setDropTarget((prev) => (prev && prev.columnId === target.columnId && prev.index === target.index ? prev : target));
      }
    };

    const onUp = () => {
      const d = dragRef.current;
      const cardId = d.cardId;
      const targetCol = d.overColumn;
      const targetIndex = d.overIndex;

      if (cardId && targetCol != null && targetIndex != null) {
        setCardList((prev) => {
          const without = prev.filter((c) => c.id !== cardId);
          const moving = prev.find((c) => c.id === cardId);
          if (!moving) return prev;
          const updated = { ...moving, columnId: targetCol };
          const targetColCards = without.filter((c) => c.columnId === targetCol);
          const others = without.filter((c) => c.columnId !== targetCol);
          const insertAt = clamp(targetIndex, 0, targetColCards.length);
          targetColCards.splice(insertAt, 0, updated);
          const result: KanbanCard[] = [];
          for (const col of cols) {
            if (col.id === targetCol) result.push(...targetColCards);
            else result.push(...others.filter((c) => c.columnId === col.id));
          }
          return result;
        });
      }

      dragRef.current = { cardId: null, fromColumn: null, overColumn: null, overIndex: null, pointerX: 0, pointerY: 0, offsetX: 0, offsetY: 0, width: 0, height: 0, vx: 0, tilt: 0 };
      setDragCardId(null);
      setDropTarget(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragCardId, findDropTarget, cols]);

  React.useEffect(() => {
    if (!dragCardId) return;
    const tick = () => {
      renderDragLayer();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dragCardId, renderDragLayer]);

  const draggedCard = dragCardId ? cardList.find((c) => c.id === dragCardId) : null;

  return (
    <div
      ref={rootRef}
      className={cn("relative flex w-full h-full min-h-[520px] flex-col overflow-hidden transition-colors duration-400", className)}
      style={{ background: backgroundColor, color: inkColor, fontFamily: '"Helvetica Neue","Inter",-apple-system,BlinkMacSystemFont,Arial,sans-serif', userSelect: dragCardId ? "none" : "auto" }}
    >
      <div className="flex shrink-0 items-start justify-between" style={{ padding: deviceMode === "phone" ? "1em 1em 0.8em" : deviceMode === "tablet" ? "1.4em 1.6em 1em" : "2em 2.4em 1.4em" }}>
        <div>
          <h2
            className="m-0 font-medium tracking-[-0.01em]"
            style={{ fontSize: deviceMode === "phone" ? "clamp(19px, 6vw, 24px)" : deviceMode === "tablet" ? "clamp(20px, 2.2vw, 26px)" : "clamp(22px, 2.4vw, 30px)" }}
          >
            {boardTitle}
          </h2>
          <p className="mt-1.5 mb-0 text-[13px]" style={{ color: mutedColor }}>
            {boardSubtitle}
          </p>
        </div>
        {showThemeToggle && (
          <button
            ref={toggleBtnRef}
            type="button"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            onMouseEnter={() => {
              if (toggleBtnRef.current) toggleBtnRef.current.style.background = "rgba(128,128,128,0.14)";
            }}
            onMouseLeave={() => {
              if (toggleBtnRef.current) toggleBtnRef.current.style.background = "transparent";
            }}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border bg-transparent p-0 cursor-pointer"
            style={{ borderColor: inkColor, color: inkColor }}
          >
            <span className="relative block h-4 w-4">
              <span
                className="absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{ opacity: theme === "light" ? 1 : 0, transform: theme === "light" ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.4)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                  <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M12 1v2" />
                    <path d="M12 21v2" />
                    <path d="M4.22 4.22l1.42 1.42" />
                    <path d="M18.36 18.36l1.42 1.42" />
                    <path d="M1 12h2" />
                    <path d="M21 12h2" />
                    <path d="M4.22 19.78l1.42-1.42" />
                    <path d="M18.36 5.64l1.42-1.42" />
                  </g>
                </svg>
              </span>
              <span
                className="absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{ opacity: theme === "dark" ? 1 : 0, transform: theme === "dark" ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.4)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>

      <div
        ref={boardRef}
        className="flex flex-1"
        style={{
          flexDirection: deviceMode === "phone" ? "column" : "row",
          gap: deviceMode === "phone" ? 10 : deviceMode === "tablet" ? 12 : 20,
          padding: deviceMode === "phone" ? "0 1em 1.5em" : deviceMode === "tablet" ? "0 1em 1.5em" : "0 2.4em 2em",
          overflowX: deviceMode === "phone" ? "hidden" : "auto",
          overflowY: deviceMode === "phone" ? "auto" : "hidden",
        }}
      >
        {cols.map((col) => {
          const list = cardsByColumn[col.id] || [];
          const isOverThisCol = dropTarget?.columnId === col.id;
          return (
            <div
              key={col.id}
              ref={(el) => {
                columnRefs.current[col.id] = el;
              }}
              className="flex flex-col rounded-[14px] transition-colors duration-200"
              style={{
                flex: deviceMode === "phone" ? "0 0 auto" : "1 1 0",
                width: deviceMode === "phone" ? "100%" : undefined,
                background: isOverThisCol ? `${col.accentColor}0d` : "transparent",
                minHeight: deviceMode === "phone" ? "auto" : "100%",
              }}
            >
              <div className="flex items-center gap-2" style={{ padding: "0.4em 0.6em 0.9em" }}>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: col.accentColor }} />
                <span className="text-[13px] font-semibold tracking-[0.01em]">{col.title}</span>
                {showCounts && (
                  <span className="ml-0.5 text-xs" style={{ color: mutedColor }}>
                    {list.length}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2.5" style={{ padding: "0 0.4em 0.4em" }}>
                {list.map((card, idx) => {
                  const isDragging = dragCardId === card.id;
                  const showGhostBefore = isOverThisCol && dropTarget?.index === idx && dragCardId !== card.id;
                  return (
                    <div key={card.id} style={{ display: "contents" }}>
                      {showGhostBefore && <div className="h-[58px] shrink-0 rounded-[10px] border-2 border-dashed opacity-55" style={{ borderColor: col.accentColor }} />}
                      <div
                        ref={(el) => {
                          cardElRefs.current[card.id] = el;
                        }}
                        onPointerDown={(e) => startDrag(e, card)}
                        onMouseEnter={() => {
                          const el = cardElRefs.current[card.id];
                          if (el && !dragRef.current.cardId) el.style.boxShadow = "0 4px 14px -6px rgba(0,0,0,0.18)";
                        }}
                        onMouseLeave={() => {
                          const el = cardElRefs.current[card.id];
                          if (el) el.style.boxShadow = "0 1px 2px rgba(0,0,0,0.06)";
                        }}
                        className="rounded-[10px]"
                        style={{
                          background: surfaceColor,
                          padding: "0.85em 0.95em",
                          cursor: dragCardId === card.id ? "grabbing" : "grab",
                          opacity: isDragging ? 0 : 1,
                          transition: `opacity ${GHOST_FADE_DURATION}s ease, transform ${REORDER_SHIFT_DURATION}s ease, box-shadow 0.2s ease`,
                          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                          touchAction: "none",
                        }}
                      >
                        {(card.tag || card.priority) && (
                          <div className="mb-2.5 flex items-center justify-between">
                            {card.tag ? (
                              <span
                                className="inline-block rounded-full text-[10.5px] font-semibold tracking-[0.04em] uppercase"
                                style={{ color: card.tagColor || col.accentColor, background: `${card.tagColor || col.accentColor}1a`, padding: "0.2em 0.55em" }}
                              >
                                {card.tag}
                              </span>
                            ) : (
                              <span />
                            )}
                            {card.priority && (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-[0.03em]" style={{ color: PRIORITY_COLOR[card.priority] }}>
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: PRIORITY_COLOR[card.priority] }} />
                                {PRIORITY_LABEL[card.priority]}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="m-0 text-[13.5px] leading-[1.4] font-medium" style={{ color: inkColor }}>
                          {card.title}
                        </p>
                        {card.note && (
                          <p className="mt-1.5 mb-0 text-xs leading-[1.4]" style={{ color: mutedColor }}>
                            {card.note}
                          </p>
                        )}
                        {card.avatars && card.avatars.length > 0 && (
                          <div className="mt-2.5 flex">
                            {card.avatars.slice(0, 4).map((src, i) => (
                              <div
                                key={i}
                                className="h-[22px] w-[22px] shrink-0 overflow-hidden rounded-full border-2"
                                style={{ marginLeft: i === 0 ? 0 : -AVATAR_STACK_OVERLAP, borderColor: surfaceColor, background: src ? undefined : mutedColor }}
                              >
                                {src && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={src} alt="" className="h-full w-full object-cover" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {isOverThisCol && dropTarget?.index === list.length && <div className="h-[58px] shrink-0 rounded-[10px] border-2 border-dashed opacity-55" style={{ borderColor: col.accentColor }} />}
                {list.length === 0 && !isOverThisCol && (
                  <div className="rounded-[10px] border border-dashed text-center text-xs" style={{ padding: "1.2em 0.5em", color: mutedColor, borderColor: `${mutedColor}55` }}>
                    No cards
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {draggedCard && (
        <div ref={dragLayerRef} className="pointer-events-none fixed top-0 left-0 z-[9999]" style={{ width: dragWidth || 290 - 16, willChange: "transform" }}>
          <div className="rounded-[10px]" style={{ background: surfaceColor, padding: "0.85em 0.95em", boxShadow: `0 ${DRAG_SHADOW_LIFT}px 40px -16px rgba(0,0,0,0.35)` }}>
            {(draggedCard.tag || draggedCard.priority) && (
              <div className="mb-2.5 flex items-center justify-between">
                {draggedCard.tag ? (
                  <span
                    className="inline-block rounded-full text-[10.5px] font-semibold tracking-[0.04em] uppercase"
                    style={{ color: draggedCard.tagColor, background: `${draggedCard.tagColor}1a`, padding: "0.2em 0.55em" }}
                  >
                    {draggedCard.tag}
                  </span>
                ) : (
                  <span />
                )}
                {draggedCard.priority && (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-[0.03em]" style={{ color: PRIORITY_COLOR[draggedCard.priority] }}>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: PRIORITY_COLOR[draggedCard.priority] }} />
                    {PRIORITY_LABEL[draggedCard.priority]}
                  </span>
                )}
              </div>
            )}
            <p className="m-0 text-[13.5px] leading-[1.4] font-medium" style={{ color: inkColor }}>
              {draggedCard.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
