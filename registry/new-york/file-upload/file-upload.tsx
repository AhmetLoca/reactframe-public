"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FileUploadSize = "sm" | "md" | "lg";
export type FileStatus = "ready" | "uploading" | "done" | "error";

export interface UploadItem {
  id: string;
  file: File;
  status: FileStatus;
  progress: number;
  error?: string;
  rejected?: boolean;
  previewUrl?: string;
}

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  upload?: (file: File, onProgress: (percent: number) => void) => Promise<void>;
  onFilesChange?: (files: File[]) => void;
  title?: string;
  description?: string;
  label?: string;
  size?: FileUploadSize;
  theme?: "dark" | "light";
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.28)", zone: "rgba(255,255,255,0.03)", zoneActive: "rgba(255,255,255,0.08)", dash: "rgba(255,255,255,0.2)", dashActive: "rgba(245,244,241,0.85)", card: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)", hover: "rgba(255,255,255,0.08)", chip: "rgba(255,255,255,0.08)", bar: "rgba(255,255,255,0.1)", fill: "#F5F4F1", focus: "rgba(245,244,241,0.85)", error: "#FF7A6B" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.28)", zone: "#FFFFFF", zoneActive: "rgba(10,10,10,0.05)", dash: "rgba(10,10,10,0.25)", dashActive: "rgba(10,10,10,0.85)", card: "#FFFFFF", border: "rgba(10,10,10,0.12)", hover: "rgba(10,10,10,0.06)", chip: "rgba(10,10,10,0.06)", bar: "rgba(10,10,10,0.1)", fill: "#0A0A0A", focus: "rgba(10,10,10,0.85)", error: "#E5484D" },
};

const SIZES: Record<FileUploadSize, { font: number; pad: number; radius: number; icon: number; thumb: number }> = {
  sm: { font: 13, pad: 22, radius: 14, icon: 38, thumb: 34 },
  md: { font: 14.5, pad: 32, radius: 18, icon: 46, thumb: 40 },
  lg: { font: 16, pad: 44, radius: 22, icon: 56, thumb: 48 },
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let n = bytes / 1024;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n >= 10 || i === 0 ? Math.round(n) : n.toFixed(1)} ${units[i]}`;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const rules = accept.split(",").map((r) => r.trim().toLowerCase()).filter(Boolean);
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((r) => (r.startsWith(".") ? name.endsWith(r) : r.endsWith("/*") ? type.startsWith(r.slice(0, -1)) : type === r));
}

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(i + 1, i + 5).toUpperCase() : "FILE";
}

let counter = 0;

export function FileUpload({
  accept,
  multiple = true,
  maxSize,
  maxFiles,
  upload,
  onFilesChange,
  title,
  description,
  label,
  size = "md",
  theme = "dark",
  width = 420,
  disabled = false,
  className,
}: FileUploadProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dragDepth = React.useRef(0);
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const itemsRef = React.useRef<UploadItem[]>([]);

  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  React.useEffect(
    () => () => {
      itemsRef.current.forEach((i) => i.previewUrl && URL.revokeObjectURL(i.previewUrl));
    },
    [],
  );

  const emit = (list: UploadItem[]) => onFilesChange?.(list.filter((i) => i.status !== "error").map((i) => i.file));

  const patch = (id: string, change: Partial<UploadItem>) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...change } : i)));

  const runUpload = async (item: UploadItem) => {
    if (!upload) return;
    patch(item.id, { status: "uploading", progress: 0, error: undefined });
    try {
      await upload(item.file, (percent) => patch(item.id, { progress: Math.max(0, Math.min(100, percent)) }));
      patch(item.id, { status: "done", progress: 100 });
    } catch (err) {
      patch(item.id, { status: "error", error: err instanceof Error ? err.message : "Upload failed" });
    }
  };

  const addFiles = (incoming: File[]) => {
    if (disabled || incoming.length === 0) return;
    const current = multiple ? items : [];
    const room = maxFiles ? Math.max(0, maxFiles - current.filter((i) => i.status !== "error").length) : Infinity;
    let accepted = 0;
    const created: UploadItem[] = [];
    for (const file of multiple ? incoming : incoming.slice(0, 1)) {
      let error: string | undefined;
      if (!matchesAccept(file, accept)) error = "File type not allowed";
      else if (maxSize && file.size > maxSize) error = `Larger than ${formatBytes(maxSize)}`;
      else if (accepted >= room) error = `Limit of ${maxFiles} files reached`;
      if (!error) accepted++;
      created.push({
        id: `${uid}-${++counter}`,
        file,
        status: error ? "error" : "ready",
        progress: 0,
        error,
        rejected: Boolean(error),
        previewUrl: !error && file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      });
    }
    if (!multiple) current.forEach((i) => i.previewUrl && URL.revokeObjectURL(i.previewUrl));
    const next = [...current, ...created];
    setItems(next);
    emit(next);
    created.filter((i) => i.status === "ready").forEach(runUpload);
  };

  const remove = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    emit(next);
  };

  const openPicker = () => !disabled && inputRef.current?.click();

  const active = dragging && !disabled;

  return (
    <div className={cn("inline-flex flex-col gap-2", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <span id={`${uid}-label`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
          {label}
        </span>
      )}

      <motion.div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-labelledby={label ? `${uid}-label` : undefined}
        aria-label={label ? undefined : "Upload files"}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onDragEnter={(e) => {
          e.preventDefault();
          dragDepth.current++;
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          addFiles(Array.from(e.dataTransfer.files));
        }}
        animate={{ scale: active ? 1.015 : 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="flex flex-col items-center text-center outline-none focus-visible:ring-2"
        style={{ gap: 12, padding: `${s.pad}px 20px`, borderRadius: s.radius, border: `1.5px dashed ${active ? p.dashActive : hovered ? p.dashActive : p.dash}`, background: active ? p.zoneActive : p.zone, cursor: disabled ? "default" : "pointer", transition: "border-color 0.18s ease, background 0.18s ease", ["--tw-ring-color" as string]: p.focus }}
      >
        <motion.span
          animate={{ y: active ? -5 : 0, scale: active ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className="flex items-center justify-center rounded-full"
          style={{ width: s.icon, height: s.icon, background: p.chip, color: p.text }}
        >
          <svg width={s.icon * 0.46} height={s.icon * 0.46} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13V3.5M6 7l4-4 4 4M3.5 13v2a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-2" />
          </svg>
        </motion.span>
        <div className="flex flex-col" style={{ gap: 4 }}>
          <span className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font + 1 }}>
            {title ?? (active ? "Drop to upload" : multiple ? "Drop files here or click to browse" : "Drop a file here or click to browse")}
          </span>
          <span style={{ color: p.muted, fontSize: s.font - 1.5 }}>
            {description ?? [accept ? accept.split(",").map((a) => a.trim().replace(/^.*\//, "").replace(".", "").toUpperCase()).join(", ") : "Any file type", maxSize ? `up to ${formatBytes(maxSize)}` : null, maxFiles && multiple ? `max ${maxFiles} files` : null].filter(Boolean).join(" · ")}
          </span>
        </div>
        <input
          ref={inputRef}
          type="file"
          hidden
          tabIndex={-1}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            addFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </motion.div>

      <ul className="m-0 flex list-none flex-col p-0" style={{ gap: 8 }} aria-live="polite">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const isImg = Boolean(item.previewUrl);
            const err = item.status === "error";
            return (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.14 } }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="flex items-center"
                style={{ gap: 12, padding: 10, borderRadius: s.radius - 4, background: p.card, border: `1px solid ${err ? p.error : p.border}` }}
              >
                <span className="relative flex shrink-0 items-center justify-center overflow-hidden font-bold" style={{ width: s.thumb, height: s.thumb, borderRadius: s.radius - 8, background: p.chip, color: p.muted, fontSize: 10, letterSpacing: "0.04em" }}>
                  {isImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.previewUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    extOf(item.file.name)
                  )}
                </span>
                <div className="flex min-w-0 flex-1 flex-col" style={{ gap: 5 }}>
                  <div className="flex items-baseline justify-between" style={{ gap: 8 }}>
                    <span className="truncate font-semibold" style={{ color: p.text, fontSize: s.font - 0.5 }}>
                      {item.file.name}
                    </span>
                    <span className="shrink-0 tabular-nums" style={{ color: err ? p.error : p.muted, fontSize: s.font - 2.5 }}>
                      {err ? item.error : item.status === "uploading" ? `${Math.round(item.progress)}%` : item.status === "done" ? "Uploaded" : formatBytes(item.file.size)}
                    </span>
                  </div>
                  {(item.status === "uploading" || item.status === "done") && (
                    <div className="h-1 overflow-hidden rounded-full" style={{ background: p.bar }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(item.progress)} aria-label={`Uploading ${item.file.name}`}>
                      <motion.div className="h-full rounded-full" style={{ background: p.fill }} initial={false} animate={{ width: `${item.progress}%` }} transition={{ ease: "easeOut", duration: 0.2 }} />
                    </div>
                  )}
                </div>
                {err && upload && !item.rejected && (
                  <button type="button" aria-label={`Retry ${item.file.name}`} onClick={() => runUpload(item)} className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent outline-none focus-visible:ring-2" style={{ width: 28, height: 28, color: p.muted, ["--tw-ring-color" as string]: p.focus }} onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M13 8a5 5 0 1 1-1.5-3.5M13 2.5V5h-2.5" />
                    </svg>
                  </button>
                )}
                <button type="button" aria-label={`Remove ${item.file.name}`} onClick={() => remove(item.id)} className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent outline-none focus-visible:ring-2" style={{ width: 28, height: 28, color: p.muted, ["--tw-ring-color" as string]: p.focus }} onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
