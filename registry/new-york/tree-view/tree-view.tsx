"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TreeViewSize = "sm" | "md" | "lg";

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: TreeNode[];
}

export interface TreeViewProps {
  data: TreeNode[];
  /** Single-row highlight, independent of checkboxes. */
  selectable?: boolean;
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectedChange?: (id: string | null) => void;
  /** Adds tri-state checkboxes for multi-select; checking a folder checks every leaf under it. */
  checkable?: boolean;
  /** The source of truth is leaf ids — a folder's checked/indeterminate state is always derived from its descendants. */
  checkedIds?: string[];
  defaultCheckedIds?: string[];
  onCheckedChange?: (ids: string[]) => void;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  showLines?: boolean;
  size?: TreeViewSize;
  theme?: "dark" | "light";
  accentColor?: string;
  width?: number;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.28)", line: "rgba(255,255,255,0.12)", hover: "rgba(255,255,255,0.06)", active: "rgba(255,255,255,0.09)", border: "rgba(255,255,255,0.14)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.28)", line: "rgba(10,10,10,0.12)", hover: "rgba(10,10,10,0.05)", active: "rgba(10,10,10,0.06)", border: "rgba(10,10,10,0.18)" },
};

const SIZES: Record<TreeViewSize, { rowH: number; font: number; icon: number; indent: number; chevron: number }> = {
  sm: { rowH: 28, font: 12.5, icon: 15, indent: 18, chevron: 12 },
  md: { rowH: 32, font: 13.5, icon: 16, indent: 20, chevron: 13 },
  lg: { rowH: 36, font: 14.5, icon: 18, indent: 22, chevron: 14 },
};

type Palette = (typeof PALETTES)["dark"];
type Size = (typeof SIZES)["md"];

function readableTextOn(hex: string): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#0A0A0A" : "#FFFFFF";
}

function collectLeafIds(node: TreeNode): string[] {
  if (!node.children || node.children.length === 0) return [node.id];
  return node.children.flatMap(collectLeafIds);
}

function checkState(node: TreeNode, checked: Set<string>): "checked" | "indeterminate" | "unchecked" {
  const leaves = collectLeafIds(node);
  const n = leaves.filter((id) => checked.has(id)).length;
  if (n === 0) return "unchecked";
  if (n === leaves.length) return "checked";
  return "indeterminate";
}

function FolderIcon({ size, open }: { size: number; open: boolean }) {
  return open ? (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.8 4.2a1 1 0 0 1 1-1h3l1.2 1.5h6.2a1 1 0 0 1 1 1.1l-.6 6.4a1 1 0 0 1-1 .9H2.7a1 1 0 0 1-1-.9l-.9-7.1V4.2Z" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.8 3.7a1 1 0 0 1 1-1h3l1.2 1.5h6.2a1 1 0 0 1 1 1v6.6a1 1 0 0 1-1 1H2.8a1 1 0 0 1-1-1V3.7Z" />
    </svg>
  );
}

function FileIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 1.8h5.2L12.2 5v9a.9.9 0 0 1-.9.9H4a.9.9 0 0 1-.9-.9V2.7a.9.9 0 0 1 .9-.9Z" />
      <path d="M9.2 1.8V5h3" />
    </svg>
  );
}

function Chevron({ size, open }: { size: number; open: boolean }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.16 }} aria-hidden="true">
      <path d="M6 3.5L10.5 8L6 12.5" />
    </motion.svg>
  );
}

function CheckboxGlyph({ state, s, p, accent }: { state: "checked" | "indeterminate" | "unchecked"; s: Size; p: Palette; accent: string }) {
  const onAccent = readableTextOn(accent);
  const filled = state !== "unchecked";
  return (
    <span className="flex shrink-0 items-center justify-center rounded" style={{ width: s.icon - 2, height: s.icon - 2, background: filled ? accent : "transparent", border: `1.5px solid ${filled ? accent : p.faint}` }}>
      {state === "checked" && (
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2.3 6.3L4.7 8.7L9.7 3.3" stroke={onAccent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {state === "indeterminate" && <span style={{ width: 7, height: 1.6, borderRadius: 1, background: onAccent }} />}
    </span>
  );
}

/** Renders the ancestor guide-line rail to the left of a row: a continuing
 * vertical line per ancestor that still has siblings below it, plus this
 * row's own L-shaped connector. */
function Rail({ ancestorLines, isLast, s, p }: { ancestorLines: boolean[]; isLast: boolean; s: Size; p: Palette }) {
  const half = s.rowH / 2;
  return (
    <div className="flex shrink-0" style={{ height: s.rowH }}>
      {ancestorLines.map((show, i) => (
        <div key={i} className="relative shrink-0" style={{ width: s.indent }}>
          {show && <div className="absolute" style={{ left: s.indent / 2, top: 0, bottom: 0, width: 1, background: p.line }} />}
        </div>
      ))}
      <div className="relative shrink-0" style={{ width: s.indent }}>
        <div className="absolute" style={{ left: s.indent / 2, top: 0, height: half, width: 1, background: p.line }} />
        <div className="absolute" style={{ left: s.indent / 2, top: half, width: s.indent / 2, height: 1, background: p.line }} />
        {!isLast && <div className="absolute" style={{ left: s.indent / 2, top: half, bottom: 0, width: 1, background: p.line }} />}
      </div>
    </div>
  );
}

interface RenderCtx {
  s: Size;
  p: Palette;
  accent: string;
  expanded: Set<string>;
  toggleExpanded: (id: string) => void;
  checkable: boolean;
  checked: Set<string>;
  toggleChecked: (node: TreeNode) => void;
  selectable: boolean;
  selectedId: string | null;
  select: (id: string) => void;
  focusedId: string | null;
  focusRow: (id: string) => void;
  setRowRef: (id: string, el: HTMLDivElement | null) => void;
  showLines: boolean;
}

function NodeRow({ node, depth, ancestorLines, isLast, ctx }: { node: TreeNode; depth: number; ancestorLines: boolean[]; isLast: boolean; ctx: RenderCtx }) {
  const { s, p, accent } = ctx;
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const open = ctx.expanded.has(node.id);
  const isSelected = ctx.selectable && ctx.selectedId === node.id;
  const isFocused = ctx.focusedId === node.id;
  const state = ctx.checkable ? checkState(node, ctx.checked) : "unchecked";

  return (
    <div>
      <div
        ref={(el) => ctx.setRowRef(node.id, el)}
        role="treeitem"
        id={`tv-${node.id}`}
        aria-level={depth + 1}
        aria-expanded={hasChildren ? open : undefined}
        aria-selected={ctx.selectable ? isSelected : undefined}
        aria-checked={ctx.checkable ? (state === "indeterminate" ? "mixed" : state === "checked") : undefined}
        aria-disabled={node.disabled || undefined}
        tabIndex={isFocused ? 0 : -1}
        onClick={() => {
          if (node.disabled) return;
          // Keep keyboard nav picking up from wherever the mouse last
          // interacted: a plain click on a tabIndex={-1} row does not
          // move real DOM focus there by itself (only tabIndex >= 0
          // elements get that for free), so without this an arrow key
          // right after a click would silently resume from the old
          // roving-focus row instead of the one just clicked.
          ctx.focusRow(node.id);
          if (ctx.checkable) ctx.toggleChecked(node);
          else if (hasChildren) ctx.toggleExpanded(node.id);
          if (ctx.selectable) ctx.select(node.id);
        }}
        className="flex cursor-pointer items-center outline-none select-none focus-visible:ring-2"
        style={{ height: s.rowH, borderRadius: 8, background: isSelected ? ctx.p.active : "transparent", color: node.disabled ? p.faint : p.text, fontSize: s.font, fontWeight: isSelected ? 600 : 500, cursor: node.disabled ? "default" : "pointer", opacity: node.disabled ? 0.5 : 1, ["--tw-ring-color" as string]: accent }}
        onMouseEnter={(e) => !isSelected && !node.disabled && (e.currentTarget.style.background = p.hover)}
        onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = "transparent")}
      >
        {ctx.showLines && depth > 0 && <Rail ancestorLines={ancestorLines} isLast={isLast} s={s} p={p} />}
        {(!ctx.showLines || depth === 0) && <span style={{ width: depth * s.indent, flexShrink: 0 }} />}
        <span
          className="flex shrink-0 items-center justify-center"
          style={{ width: s.indent, height: s.rowH, color: p.muted }}
          onClick={(e) => {
            if (!hasChildren) return;
            e.stopPropagation();
            ctx.toggleExpanded(node.id);
          }}
        >
          {hasChildren && <Chevron size={s.chevron} open={open} />}
        </span>
        {ctx.checkable && (
          <span className="mr-1.5 flex shrink-0 items-center justify-center" style={{ width: s.icon, height: s.rowH }}>
            <CheckboxGlyph state={state} s={s} p={p} accent={accent} />
          </span>
        )}
        <span className="mr-1.5 flex shrink-0 items-center justify-center" style={{ width: s.icon, height: s.rowH, color: p.muted }}>
          {node.icon ?? (hasChildren ? <FolderIcon size={s.icon} open={open} /> : <FileIcon size={s.icon} />)}
        </span>
        <span className="min-w-0 flex-1 truncate">{node.label}</span>
      </div>

      {hasChildren && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
              {node.children!.map((child, i) => (
                <NodeRow key={child.id} node={child} depth={depth + 1} ancestorLines={[...ancestorLines, !isLast]} isLast={i === node.children!.length - 1} ctx={ctx} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function flattenVisible(nodes: TreeNode[], expanded: Set<string>): TreeNode[] {
  const out: TreeNode[] = [];
  for (const node of nodes) {
    if (node.disabled) continue;
    out.push(node);
    if (node.children && expanded.has(node.id)) out.push(...flattenVisible(node.children, expanded));
  }
  return out;
}

function parentOf(nodes: TreeNode[], id: string, ancestor: TreeNode | null = null): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return ancestor;
    if (node.children) {
      const found = parentOf(node.children, id, node);
      if (found !== null) return found;
    }
  }
  return null;
}

export function TreeView({
  data,
  selectable = true,
  selectedId,
  defaultSelectedId = null,
  onSelectedChange,
  checkable = false,
  checkedIds,
  defaultCheckedIds = [],
  onCheckedChange,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  showLines = true,
  size = "md",
  theme = "dark",
  accentColor = "#F2A841",
  width = 280,
  className,
}: TreeViewProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const rootRef = React.useRef<HTMLDivElement>(null);
  const rowRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const [internalExpanded, setInternalExpanded] = React.useState(() => new Set(defaultExpandedIds));
  const expanded = React.useMemo(() => (expandedIds !== undefined ? new Set(expandedIds) : internalExpanded), [expandedIds, internalExpanded]);
  const setExpanded = (next: Set<string>) => {
    if (expandedIds === undefined) setInternalExpanded(next);
    onExpandedChange?.(Array.from(next));
  };
  const toggleExpanded = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const [internalChecked, setInternalChecked] = React.useState(() => new Set(defaultCheckedIds));
  const checked = React.useMemo(() => (checkedIds !== undefined ? new Set(checkedIds) : internalChecked), [checkedIds, internalChecked]);
  const setChecked = (next: Set<string>) => {
    if (checkedIds === undefined) setInternalChecked(next);
    onCheckedChange?.(Array.from(next));
  };
  const toggleChecked = (node: TreeNode) => {
    const leaves = collectLeafIds(node);
    const willCheck = checkState(node, checked) !== "checked";
    const next = new Set(checked);
    leaves.forEach((id) => (willCheck ? next.add(id) : next.delete(id)));
    setChecked(next);
  };

  const [internalSelected, setInternalSelected] = React.useState<string | null>(defaultSelectedId);
  const currentSelected = selectedId !== undefined ? selectedId : internalSelected;
  const select = (id: string) => {
    if (selectedId === undefined) setInternalSelected(id);
    onSelectedChange?.(id);
  };

  const visible = React.useMemo(() => flattenVisible(data, expanded), [data, expanded]);
  const [focusedId, setFocusedId] = React.useState<string | null>(visible[0]?.id ?? null);
  // A collapsed ancestor (or a removed node) can take the focused row out of
  // view; land back on the first visible row instead of leaving focus on a
  // hidden one. Adjusting here, during render, avoids the extra
  // render-then-effect-then-render round trip a useEffect would cause.
  const [lastVisible, setLastVisible] = React.useState(visible);
  if (visible !== lastVisible) {
    setLastVisible(visible);
    if (focusedId && !visible.some((n) => n.id === focusedId)) setFocusedId(visible[0]?.id ?? null);
  }

  const focusRow = (id: string) => {
    setFocusedId(id);
    rowRefs.current[id]?.focus({ preventScroll: true });
  };

  const move = (dir: 1 | -1) => {
    if (visible.length === 0) return;
    const i = focusedId ? visible.findIndex((n) => n.id === focusedId) : -1;
    const next = visible[(i + dir + visible.length) % visible.length];
    focusRow(next.id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const node = visible.find((n) => n.id === focusedId);
    if (!node) return;
    const hasChildren = Boolean(node.children && node.children.length > 0);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (hasChildren && !expanded.has(node.id)) toggleExpanded(node.id);
      else if (hasChildren) move(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (hasChildren && expanded.has(node.id)) toggleExpanded(node.id);
      else {
        const parent = parentOf(data, node.id);
        if (parent) focusRow(parent.id);
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      focusRow(visible[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      focusRow(visible[visible.length - 1].id);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (checkable) toggleChecked(node);
      else if (hasChildren) toggleExpanded(node.id);
      if (selectable) select(node.id);
    }
  };

  const ctx: RenderCtx = {
    s,
    p,
    accent: accentColor,
    expanded,
    toggleExpanded,
    checkable,
    checked,
    toggleChecked,
    selectable,
    selectedId: currentSelected,
    select,
    focusedId,
    focusRow,
    setRowRef: (id, el) => {
      rowRefs.current[id] = el;
    },
    showLines,
  };

  return (
    <div
      ref={rootRef}
      role="tree"
      aria-multiselectable={checkable || undefined}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className={cn("outline-none", className)}
      style={{ width, maxWidth: "100%", padding: 6, borderRadius: 14, border: `1px solid ${p.border}`, fontFamily: "Inter, sans-serif" }}
    >
      {data.map((node, i) => (
        <NodeRow key={node.id} node={node} depth={0} ancestorLines={[]} isLast={i === data.length - 1} ctx={ctx} />
      ))}
    </div>
  );
}
