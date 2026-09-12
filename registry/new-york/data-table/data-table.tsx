"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DataTableColumnType = "text" | "number" | "currency" | "badge" | "avatar" | "actions";
export type DataTableAlign = "left" | "center" | "right";
type SortDirection = "asc" | "desc" | null;
export type DataTableTheme = "dark" | "light" | "custom";

export interface DataTableColumn {
  key: string;
  label: string;
  type: DataTableColumnType;
  sortable?: boolean;
  filterable?: boolean;
  align?: DataTableAlign;
  width?: number;
}

export interface DataTableBadgeRule {
  value: string;
  background: string;
  text: string;
  dot?: boolean;
}

export type DataTableActionIcon = "eye" | "refresh" | "edit" | "trash" | "external" | "download" | "check" | "x";

export interface DataTableActionButton {
  icon: DataTableActionIcon;
  label: string;
}

export type DataTableRow = Record<string, string | number | boolean | null>;

export interface DataTableProps {
  data?: DataTableRow[];
  columns?: DataTableColumn[];
  badgeColors?: DataTableBadgeRule[];
  actionButtons?: DataTableActionButton[];

  showTitle?: boolean;
  title?: string;

  showSearch?: boolean;
  searchPlaceholder?: string;

  showStatusTabs?: boolean;
  statusTabsColumn?: string;

  selectable?: boolean;

  showPagination?: boolean;
  rowsPerPage?: number;

  fontSize?: number;
  cellPaddingX?: number;
  cellPaddingY?: number;
  cornerRadius?: number;

  theme?: DataTableTheme;

  backgroundColor?: string;
  borderColor?: string;
  headerTextColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  hoverColor?: string;
  accentColor?: string;
  selectedRowColor?: string;

  className?: string;
}

const DEFAULT_DATA: DataTableRow[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Moderator", status: "Active" },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "User", status: "Active" },
  { id: 6, name: "Diana Prince", email: "diana@example.com", role: "Moderator", status: "Inactive" },
  { id: 7, name: "Ethan Hunt", email: "ethan@example.com", role: "User", status: "Active" },
  { id: 8, name: "Fiona Gallagher", email: "fiona@example.com", role: "Admin", status: "Inactive" },
];

const DEFAULT_COLUMNS: DataTableColumn[] = [
  { key: "id", label: "ID", type: "number", sortable: true, filterable: false, align: "left", width: 60 },
  { key: "name", label: "Name", type: "avatar", sortable: true, filterable: false, align: "left" },
  { key: "email", label: "Email", type: "text", sortable: true, filterable: true, align: "left" },
  { key: "role", label: "Role", type: "badge", sortable: true, filterable: true, align: "left", width: 130 },
  { key: "status", label: "Status", type: "badge", sortable: true, filterable: true, align: "left", width: 110 },
];

const DEFAULT_BADGE_COLORS: DataTableBadgeRule[] = [
  { value: "Active", background: "rgba(34,197,94,0.12)", text: "#22c55e", dot: true },
  { value: "Inactive", background: "rgba(161,161,170,0.16)", text: "#a1a1aa", dot: true },
  { value: "Paused", background: "rgba(245,158,11,0.12)", text: "#f59e0b", dot: true },
  { value: "Stopped", background: "rgba(239,68,68,0.12)", text: "#ef4444", dot: true },
  { value: "Admin", background: "rgba(99,102,241,0.14)", text: "#818cf8", dot: false },
  { value: "Moderator", background: "rgba(168,85,247,0.14)", text: "#c084fc", dot: false },
  { value: "User", background: "rgba(161,161,170,0.16)", text: "#a1a1aa", dot: false },
];

const DEFAULT_ACTION_BUTTONS: DataTableActionButton[] = [
  { icon: "eye", label: "View" },
  { icon: "refresh", label: "Restart" },
];

const AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#3b82f6", "#ef4444"];

const DARK_PALETTE = {
  backgroundColor: "#18181b",
  borderColor: "#27272a",
  headerTextColor: "#a1a1aa",
  textColor: "#e4e4e7",
  mutedTextColor: "#71717a",
  hoverColor: "rgba(255,255,255,0.035)",
  accentColor: "#6366f1",
  selectedRowColor: "rgba(99,102,241,0.08)",
};

const LIGHT_PALETTE = {
  backgroundColor: "#ffffff",
  borderColor: "#e4e4e7",
  headerTextColor: "#71717a",
  textColor: "#18181b",
  mutedTextColor: "#a1a1aa",
  hoverColor: "rgba(0,0,0,0.035)",
  accentColor: "#6366f1",
  selectedRowColor: "rgba(99,102,241,0.06)",
};

function getInitials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function formatCellValue(value: unknown, type: DataTableColumnType): string {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "currency") {
    const num = typeof value === "number" ? value : parseFloat(String(value));
    if (isNaN(num)) return String(value);
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return String(value);
}

function compareValues(a: unknown, b: unknown, type: DataTableColumnType): number {
  if (type === "number" || type === "currency") {
    const an = typeof a === "number" ? a : parseFloat(String(a));
    const bn = typeof b === "number" ? b : parseFloat(String(b));
    const av = isNaN(an) ? -Infinity : an;
    const bv = isNaN(bn) ? -Infinity : bn;
    return av - bv;
  }
  return String(a ?? "").toLowerCase().localeCompare(String(b ?? "").toLowerCase());
}

function SearchIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5.25" stroke={color} strokeWidth="1.5" />
      <line x1="11.1" y1="11.1" x2="14" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ChevronUpIcon({ size = 12, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 10L8 6L12 10" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronDownIcon({ size = 12, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronsUpDownIcon({ size = 12, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4.5 6.5L8 3.5L11.5 6.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 9.5L8 12.5L11.5 9.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronLeftIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8L10 13" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRightIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 3L11 8L6 13" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FilterIcon({ size = 12, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2.5 3.5H13.5L9.5 8.2V12.5L6.5 11V8.2L2.5 3.5Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
function CheckIcon({ size = 10, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2.5 8.5L6 12L13.5 3.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MinusIcon({ size = 10, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8H13" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function XIcon({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function EyeIcon({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2.25" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}
function RefreshIcon({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M13.5 8A5.5 5.5 0 1 1 11.8 4.2" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M13.5 2.5V5.5H10.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function EditIcon({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M11 2L14 5L5.5 13.5L2 14L2.5 10.5L11 2Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
function TrashIcon({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2.5 4H13.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5.5 4V2.5H10.5V4" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M4 4L4.5 13.5H11.5L12 4" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
function ExternalIcon({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6.5 2.5H13.5V9.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 2.5L7 9" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11 8.5V13.5H2.5V5H7.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DownloadIcon({ size = 13, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2V10" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4.5 7L8 10.5L11.5 7" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 13.5H13.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function renderActionIcon(icon: DataTableActionIcon, size: number, color: string) {
  switch (icon) {
    case "eye":
      return <EyeIcon size={size} color={color} />;
    case "refresh":
      return <RefreshIcon size={size} color={color} />;
    case "edit":
      return <EditIcon size={size} color={color} />;
    case "trash":
      return <TrashIcon size={size} color={color} />;
    case "external":
      return <ExternalIcon size={size} color={color} />;
    case "download":
      return <DownloadIcon size={size} color={color} />;
    case "check":
      return <CheckIcon size={size} color={color} />;
    case "x":
      return <XIcon size={size} color={color} />;
  }
}

function TableCheckbox({
  checked,
  indeterminate,
  onChange,
  accentColor,
  borderColor,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  accentColor: string;
  borderColor: string;
}) {
  const active = checked || !!indeterminate;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className="box-border flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded"
      style={{ border: `1.5px solid ${active ? accentColor : borderColor}`, background: active ? accentColor : "transparent", transition: "background 0.15s ease, border-color 0.15s ease" }}
    >
      {checked && <CheckIcon size={10} color="#fff" />}
      {!checked && indeterminate && <MinusIcon size={10} color="#fff" />}
    </div>
  );
}

function FilterPopover({
  options,
  selected,
  onToggle,
  onClear,
  backgroundColor,
  borderColor,
  textColor,
  mutedTextColor,
  hoverColor,
  accentColor,
}: {
  options: { value: string; count: number }[];
  selected: Set<string>;
  onToggle: (value: string) => void;
  onClear: () => void;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  mutedTextColor: string;
  hoverColor: string;
  accentColor: string;
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-[calc(100%_+_6px)] left-0 z-50 min-w-[190px] max-h-60 overflow-y-auto rounded-lg p-1.5 font-normal normal-case"
      style={{ background: backgroundColor, border: `1px solid ${borderColor}`, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
    >
      {options.length === 0 && <div className="p-2 text-xs" style={{ color: mutedTextColor }}>No values</div>}
      {options.map((opt) => {
        const isSelected = selected.has(opt.value);
        return (
          <div
            key={opt.value}
            onClick={() => onToggle(opt.value)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] cursor-pointer"
            style={{ color: textColor }}
            onMouseEnter={(e) => (e.currentTarget.style.background = hoverColor)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <TableCheckbox checked={isSelected} onChange={() => onToggle(opt.value)} accentColor={accentColor} borderColor={borderColor} />
            <span className="flex-1 truncate whitespace-nowrap">{opt.value || "(empty)"}</span>
            <span className="text-[11px]" style={{ color: mutedTextColor }}>
              {opt.count}
            </span>
          </div>
        );
      })}
      {selected.size > 0 && (
        <div onClick={onClear} className="mt-1 px-2 py-1.5 text-center text-xs cursor-pointer" style={{ borderTop: `1px solid ${borderColor}`, color: accentColor }}>
          Clear filter
        </div>
      )}
    </div>
  );
}

export function DataTable({
  data = DEFAULT_DATA,
  columns = DEFAULT_COLUMNS,
  badgeColors = DEFAULT_BADGE_COLORS,
  actionButtons = DEFAULT_ACTION_BUTTONS,

  showTitle = true,
  title = "Users",

  showSearch = true,
  searchPlaceholder = "Search...",

  showStatusTabs = true,
  statusTabsColumn = "status",

  selectable = true,

  showPagination = true,
  rowsPerPage = 5,

  fontSize = 13,
  cellPaddingX = 16,
  cellPaddingY = 12,
  cornerRadius = 12,

  theme = "dark",

  backgroundColor: backgroundColorProp = "#18181b",
  borderColor: borderColorProp = "#27272a",
  headerTextColor: headerTextColorProp = "#a1a1aa",
  textColor: textColorProp = "#e4e4e7",
  mutedTextColor: mutedTextColorProp = "#71717a",
  hoverColor: hoverColorProp = "rgba(255,255,255,0.035)",
  accentColor: accentColorProp = "#6366f1",
  selectedRowColor: selectedRowColorProp = "rgba(99,102,241,0.08)",
  className,
}: DataTableProps) {
  const palette =
    theme === "light"
      ? LIGHT_PALETTE
      : theme === "dark"
        ? DARK_PALETTE
        : {
            backgroundColor: backgroundColorProp,
            borderColor: borderColorProp,
            headerTextColor: headerTextColorProp,
            textColor: textColorProp,
            mutedTextColor: mutedTextColorProp,
            hoverColor: hoverColorProp,
            accentColor: accentColorProp,
            selectedRowColor: selectedRowColorProp,
          };

  const { backgroundColor, borderColor, headerTextColor, textColor, mutedTextColor, hoverColor, accentColor, selectedRowColor } = palette;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(800);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [columnFilters, setColumnFilters] = React.useState<Record<string, Set<string>>>({});
  const [openFilter, setOpenFilter] = React.useState<string | null>(null);
  const [statusTab, setStatusTab] = React.useState<string>("All");
  const [page, setPage] = React.useState(1);
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());
  const [hoveredRow, setHoveredRow] = React.useState<number | null>(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    if (!openFilter) return;
    const handler = () => setOpenFilter(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [openFilter]);

  React.useEffect(() => {
    const id = setTimeout(() => setPage(1), 0);
    return () => clearTimeout(id);
  }, [searchQuery, columnFilters, statusTab]);

  const rows = React.useMemo<(DataTableRow & { __id: number })[]>(() => data.map((row, i) => ({ ...row, __id: i })), [data]);

  const badgeMap = React.useMemo(() => {
    const map = new Map<string, DataTableBadgeRule>();
    badgeColors.forEach((b) => map.set(b.value.toLowerCase(), b));
    return map;
  }, [badgeColors]);

  const statusTabOptions = React.useMemo(() => {
    if (!showStatusTabs) return [];
    const set = new Set<string>();
    rows.forEach((r) => {
      const v = r[statusTabsColumn];
      if (v !== undefined && v !== null && v !== "") set.add(String(v));
    });
    return Array.from(set);
  }, [rows, showStatusTabs, statusTabsColumn]);

  const filteredRows = React.useMemo(() => {
    let result: (DataTableRow & { __id: number })[] = rows;

    if (showStatusTabs && statusTab !== "All") {
      result = result.filter((r) => String(r[statusTabsColumn]) === statusTab);
    }

    Object.entries(columnFilters).forEach(([key, values]) => {
      if (values.size === 0) return;
      result = result.filter((r) => values.has(String(r[key] ?? "")));
    });

    if (showSearch && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((r) => columns.some((c) => String(r[c.key] ?? "").toLowerCase().includes(q)));
    }

    return result;
  }, [rows, showStatusTabs, statusTab, statusTabsColumn, columnFilters, showSearch, searchQuery, columns]);

  const sortedRows = React.useMemo(() => {
    if (!sortKey || !sortDirection) return filteredRows;
    const col = columns.find((c) => c.key === sortKey);
    const type = col?.type ?? "text";
    const sorted = [...filteredRows].sort((a, b) => compareValues(a[sortKey], b[sortKey], type));
    return sortDirection === "asc" ? sorted : sorted.reverse();
  }, [filteredRows, sortKey, sortDirection, columns]);

  const totalRows = sortedRows.length;
  const perPage = showPagination ? Math.max(1, rowsPerPage) : Math.max(1, totalRows || 1);
  const totalPages = Math.max(1, Math.ceil(totalRows / perPage));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * perPage;
  const pageRows = showPagination ? sortedRows.slice(pageStart, pageStart + perPage) : sortedRows;

  const pageIds = pageRows.map((r) => r.__id);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedRows.has(id));
  const someSelected = !allSelected && pageIds.some((id) => selectedRows.has(id));

  const toggleSelectAll = () => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (allSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleSelectRow = (id: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection("asc");
    } else if (sortDirection === "asc") {
      setSortDirection("desc");
    } else if (sortDirection === "desc") {
      setSortKey(null);
      setSortDirection(null);
    } else {
      setSortDirection("asc");
    }
  };

  const toggleFilterValue = (key: string, value: string) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      const set = new Set(next[key] ?? []);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      next[key] = set;
      return next;
    });
  };

  const clearColumnFilter = (key: string) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const getColumnOptions = (key: string) => {
    const counts = new Map<string, number>();
    rows.forEach((r) => {
      const v = String(r[key] ?? "");
      counts.set(v, (counts.get(v) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));
  };

  const compact = containerWidth > 0 && containerWidth < 600;
  const stackFooter = containerWidth > 0 && containerWidth < 480;

  const thStyle: React.CSSProperties = {
    padding: `${cellPaddingY}px ${cellPaddingX}px`,
    textAlign: "left",
    fontSize: Math.max(10, fontSize - 1.5),
    fontWeight: 600,
    color: headerTextColor,
    whiteSpace: "nowrap",
    borderBottom: `1px solid ${borderColor}`,
    position: "relative",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  };

  const tdStyle: React.CSSProperties = { padding: `${cellPaddingY}px ${cellPaddingX}px`, color: textColor, whiteSpace: "nowrap" };

  function renderCell(row: DataTableRow, col: DataTableColumn) {
    const value = row[col.key];

    switch (col.type) {
      case "badge": {
        const str = String(value ?? "");
        const rule = badgeMap.get(str.toLowerCase());
        const bg = rule?.background ?? "rgba(161,161,170,0.16)";
        const fg = rule?.text ?? mutedTextColor;
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-[3px] text-[0.92em] font-semibold whitespace-nowrap" style={{ background: bg, color: fg }}>
            {rule?.dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: fg }} />}
            {str || "—"}
          </span>
        );
      }

      case "avatar": {
        const str = String(value ?? "");
        const idx = hashString(str) % AVATAR_COLORS.length;
        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: AVATAR_COLORS[idx] }}>
              {getInitials(str)}
            </div>
            <span>{str || "—"}</span>
          </div>
        );
      }

      case "actions": {
        return (
          <div className="flex items-center gap-4">
            {actionButtons.map((action, i) => (
              <span
                key={i}
                className="inline-flex cursor-pointer items-center gap-1.5 text-[0.92em] font-medium"
                style={{ color: mutedTextColor }}
                onMouseEnter={(e) => (e.currentTarget.style.color = textColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = mutedTextColor)}
              >
                {renderActionIcon(action.icon, 13, "currentColor")}
                {action.label}
              </span>
            ))}
          </div>
        );
      }

      case "number":
      case "currency":
        return <span>{formatCellValue(value, col.type)}</span>;

      default:
        return <span>{value === null || value === undefined || value === "" ? "—" : String(value)}</span>;
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("box-border flex w-full h-full flex-col overflow-hidden", className)}
      style={{ background: backgroundColor, border: `1px solid ${borderColor}`, borderRadius: cornerRadius, fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", color: textColor }}
    >
      {(showTitle || showSearch || (showStatusTabs && statusTabOptions.length > 0)) && (
        <div
          className={cn("flex items-center justify-between gap-3", compact && "flex-col items-start")}
          style={{ padding: `16px ${cellPaddingX}px`, borderBottom: `1px solid ${borderColor}` }}
        >
          {showTitle && (
            <div className="font-semibold" style={{ fontSize: fontSize + 3 }}>
              {title}
            </div>
          )}

          <div className={cn("flex items-center gap-2.5", compact && "w-full flex-col items-stretch")}>
            {showSearch && (
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-2.5 flex" style={{ color: mutedTextColor }}>
                  <SearchIcon size={14} color={mutedTextColor} />
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn("box-border rounded-lg bg-transparent px-8 py-2 font-[inherit] outline-none", compact ? "w-full" : "w-[230px]")}
                  style={{ border: `1px solid ${borderColor}`, fontSize: Math.max(11, fontSize - 1), color: textColor }}
                />
                {searchQuery && (
                  <span onClick={() => setSearchQuery("")} className="absolute right-2.5 flex cursor-pointer" style={{ color: mutedTextColor }}>
                    <XIcon size={12} color={mutedTextColor} />
                  </span>
                )}
              </div>
            )}

            {showStatusTabs && statusTabOptions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {["All", ...statusTabOptions].map((opt) => {
                  const active = statusTab === opt;
                  return (
                    <div
                      key={opt}
                      onClick={() => setStatusTab(opt)}
                      className="cursor-pointer rounded-md px-3 py-1.5 font-semibold whitespace-nowrap transition-all duration-150"
                      style={{
                        fontSize: Math.max(11, fontSize - 1),
                        background: active ? accentColor : "transparent",
                        color: active ? "#fff" : mutedTextColor,
                        border: `1px solid ${active ? accentColor : borderColor}`,
                        // Explicit "ease" (not Tailwind's transition-all default
                        // of cubic-bezier(0.4,0,0.2,1)) to match the source exactly.
                        transitionTimingFunction: "ease",
                      }}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[480px] border-collapse" style={{ fontSize }}>
          <thead>
            <tr>
              {selectable && (
                <th style={{ ...thStyle, width: 44 }}>
                  <TableCheckbox checked={allSelected} indeterminate={someSelected} onChange={toggleSelectAll} accentColor={accentColor} borderColor={borderColor} />
                </th>
              )}
              {columns.map((col) => {
                const align = col.align ?? "left";
                const filterCount = columnFilters[col.key]?.size ?? 0;
                return (
                  <th key={col.key} style={{ ...thStyle, textAlign: align, width: col.width || undefined, zIndex: openFilter === col.key ? 51 : undefined }}>
                    <div className="inline-flex items-center gap-1.5 select-none" style={{ cursor: col.sortable ? "pointer" : "default" }} onClick={() => col.sortable && handleSort(col.key)}>
                      <span>{col.label}</span>
                      {col.sortable &&
                        (sortKey === col.key ? (
                          sortDirection === "asc" ? (
                            <ChevronUpIcon size={12} color={accentColor} />
                          ) : (
                            <ChevronDownIcon size={12} color={accentColor} />
                          )
                        ) : (
                          <ChevronsUpDownIcon size={12} color={mutedTextColor} />
                        ))}
                      {col.filterable && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenFilter(openFilter === col.key ? null : col.key);
                          }}
                          className="flex rounded p-[3px]"
                          style={{ background: filterCount > 0 ? `${accentColor}29` : "transparent" }}
                        >
                          <FilterIcon size={12} color={filterCount > 0 ? accentColor : mutedTextColor} />
                        </span>
                      )}
                    </div>
                    {openFilter === col.key && (
                      <FilterPopover
                        options={getColumnOptions(col.key)}
                        selected={columnFilters[col.key] ?? new Set()}
                        onToggle={(v) => toggleFilterValue(col.key, v)}
                        onClear={() => clearColumnFilter(col.key)}
                        backgroundColor={backgroundColor}
                        borderColor={borderColor}
                        textColor={textColor}
                        mutedTextColor={mutedTextColor}
                        hoverColor={hoverColor}
                        accentColor={accentColor}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="text-center" style={{ padding: 36, color: mutedTextColor, fontSize }}>
                  No results found.
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                const id = row.__id;
                const isSelected = selectedRows.has(id);
                const isHovered = hoveredRow === id;
                return (
                  <tr
                    key={id}
                    onMouseEnter={() => setHoveredRow(id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ background: isSelected ? selectedRowColor : isHovered ? hoverColor : "transparent", borderTop: `1px solid ${borderColor}`, transition: "background 0.1s ease" }}
                  >
                    {selectable && (
                      <td style={tdStyle}>
                        <TableCheckbox checked={isSelected} onChange={() => toggleSelectRow(id)} accentColor={accentColor} borderColor={borderColor} />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} style={{ ...tdStyle, textAlign: col.align ?? "left" }}>
                        {renderCell(row, col)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div
          className={cn("flex items-center justify-between gap-2.5", stackFooter && "flex-col items-start")}
          style={{ padding: `12px ${cellPaddingX}px`, borderTop: `1px solid ${borderColor}`, fontSize: Math.max(11, fontSize - 1), color: mutedTextColor }}
        >
          <div>
            {totalRows === 0 ? "Showing 0 results" : `Showing ${pageStart + 1} to ${Math.min(pageStart + perPage, totalRows)} of ${totalRows} results`}
            {selectable && selectedRows.size > 0 && (
              <span className="ml-3 font-semibold" style={{ color: textColor }}>
                {selectedRows.size} row{selectedRows.size === 1 ? "" : "s"} selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span onClick={() => currentPage > 1 && setPage(currentPage - 1)} className="flex" style={{ cursor: currentPage <= 1 ? "default" : "pointer", opacity: currentPage <= 1 ? 0.35 : 1 }}>
              <ChevronLeftIcon size={16} color={textColor} />
            </span>
            <span className="font-semibold" style={{ color: textColor }}>
              {currentPage} / {totalPages}
            </span>
            <span onClick={() => currentPage < totalPages && setPage(currentPage + 1)} className="flex" style={{ cursor: currentPage >= totalPages ? "default" : "pointer", opacity: currentPage >= totalPages ? 0.35 : 1 }}>
              <ChevronRightIcon size={16} color={textColor} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
