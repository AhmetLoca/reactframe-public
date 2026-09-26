"use client";

import * as React from "react";
import { motion, AnimatePresence, useAnimationControls } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// useLayoutEffect logs a warning when it runs server-side (no DOM to
// measure before paint there); fall back to useEffect there and only
// take the synchronous-before-paint measurement in the browser.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export type InlineEditSize = "sm" | "md" | "lg";

export interface InlineEditProps {
  value?: string;
  defaultValue?: string;
  onSave?: (value: string) => void | Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  /** Return an error message to block saving, or null/undefined when the value is valid. */
  validate?: (value: string) => string | null | undefined;
  showButtons?: boolean;
  editOnClick?: boolean;
  size?: InlineEditSize;
  theme?: "dark" | "light";
  accentColor?: string;
  emptyText?: string;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.45)", border: "rgba(255,255,255,0.14)", hover: "rgba(255,255,255,0.06)", inputBg: "rgba(255,255,255,0.05)", error: "#FF7A6B", success: "#87FFE3" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.4)", border: "rgba(10,10,10,0.18)", hover: "rgba(10,10,10,0.05)", inputBg: "#FFFFFF", error: "#E5484D", success: "#0F9F7F" },
};

const SIZES: Record<InlineEditSize, { font: number; padY: number; padX: number; radius: number; icon: number }> = {
  sm: { font: 13, padY: 4, padX: 7, radius: 7, icon: 13 },
  md: { font: 14.5, padY: 5, padX: 8, radius: 8, icon: 14 },
  lg: { font: 16.5, padY: 6, padX: 9, radius: 9, icon: 16 },
};

function PencilIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11.3 2.3a1.5 1.5 0 0 1 2.1 2.1L5 12.8l-3 .9.9-3 8.4-8.4Z" />
    </svg>
  );
}

function CheckIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8.4L6.2 11.5L13 4.3" />
    </svg>
  );
}

function XIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M4 4L12 12M12 4L4 12" />
    </svg>
  );
}

function Spinner({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: "inline-edit-spin 0.7s linear infinite" }} aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" strokeOpacity="0.25" strokeWidth="2.5" stroke="currentColor" />
      <path d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5" strokeWidth="2.5" strokeLinecap="round" stroke="currentColor" />
      <style>{"@keyframes inline-edit-spin { to { transform: rotate(360deg); } }"}</style>
    </svg>
  );
}

export function InlineEdit({
  value,
  defaultValue = "",
  onSave,
  onCancel,
  placeholder = "Click to edit",
  multiline = false,
  maxLength,
  validate,
  showButtons = true,
  editOnClick = true,
  size = "md",
  theme = "dark",
  accentColor = "#F2A841",
  emptyText = "Click to add a value",
  className,
}: InlineEditProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const committed = isControlled ? value : internal;

  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(committed);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  // Imperative rather than a shake-count-driven `animate` prop + `key`:
  // remounting the wrapper via key to force the keyframes to replay would
  // also remount the input/textarea inside it, stealing focus right when
  // the user needs to keep typing to fix a validation error.
  const shakeControls = useAnimationControls();
  const shake = () => void shakeControls.start({ x: [0, -6, 6, -4, 4, -2, 2, 0], transition: { duration: 0.4 } });
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = React.useState<number | null>(null);

  const startEdit = () => {
    setDraft(committed);
    setError(null);
    setEditing(true);
  };

  React.useEffect(() => {
    if (!editing) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    const len = el.value.length;
    el.setSelectionRange?.(len, len);
  }, [editing]);

  useIsomorphicLayoutEffect(() => {
    if (!editing || multiline) return;
    const m = measureRef.current;
    if (m) setInputWidth(Math.ceil(m.getBoundingClientRect().width) + 4);
  }, [draft, editing, multiline, placeholder]);

  const cancel = () => {
    setEditing(false);
    setError(null);
    setDraft(committed);
    onCancel?.();
  };

  const save = async () => {
    const problem = validate?.(draft);
    if (problem) {
      setError(problem);
      shake();
      return;
    }
    if (draft === committed) {
      setEditing(false);
      return;
    }
    try {
      const result = onSave?.(draft);
      if (result && typeof (result as Promise<void>).then === "function") {
        setSaving(true);
        await result;
      }
      if (!isControlled) setInternal(draft);
      setSaving(false);
      setEditing(false);
      setError(null);
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error ? err.message : "Couldn't save that value.");
      shake();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    } else if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void save();
    }
  };

  const inputStyle: React.CSSProperties = {
    font: "inherit",
    fontSize: s.font,
    color: p.text,
    background: p.inputBg,
    border: `1px solid ${error ? p.error : accentColor}`,
    borderRadius: s.radius,
    padding: `${s.padY}px ${s.padX}px`,
    outline: "none",
    minWidth: 40,
    maxWidth: "100%",
  };

  if (editing) {
    return (
      <motion.div
        className={cn("inline-flex flex-col", className)}
        style={{ gap: 5, fontFamily: "Inter, sans-serif" }}
        animate={shakeControls}
      >
        <div className="flex items-start" style={{ gap: 6 }}>
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={draft}
              maxLength={maxLength}
              onChange={(e) => {
                setDraft(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={onKeyDown}
              onBlur={() => !saving && void save()}
              disabled={saving}
              rows={3}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${uid}-error` : undefined}
              className="w-full resize-y"
              style={inputStyle}
            />
          ) : (
            <>
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                value={draft}
                maxLength={maxLength}
                placeholder={placeholder}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={onKeyDown}
                onBlur={() => !saving && void save()}
                disabled={saving}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${uid}-error` : undefined}
                style={{ ...inputStyle, width: inputWidth ?? undefined }}
              />
              <span ref={measureRef} aria-hidden="true" style={{ position: "fixed", top: -9999, left: -9999, whiteSpace: "pre", fontSize: s.font, padding: `0 ${s.padX}px`, visibility: "hidden" }}>
                {draft || placeholder}
              </span>
            </>
          )}
          {showButtons && (
            <div className="flex shrink-0 items-center" style={{ gap: 4, paddingTop: multiline ? 2 : 0 }}>
              <button
                type="button"
                aria-label="Save"
                disabled={saving}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => void save()}
                className="flex cursor-pointer items-center justify-center rounded-md border-none outline-none focus-visible:ring-2 disabled:cursor-default"
                style={{ width: s.font + 14, height: s.font + 14, background: p.hover, color: saving ? p.muted : p.success, ["--tw-ring-color" as string]: accentColor }}
              >
                {saving ? <Spinner size={s.icon - 1} /> : <CheckIcon size={s.icon} />}
              </button>
              <button
                type="button"
                aria-label="Cancel"
                disabled={saving}
                onMouseDown={(e) => e.preventDefault()}
                onClick={cancel}
                className="flex cursor-pointer items-center justify-center rounded-md border-none outline-none focus-visible:ring-2 disabled:cursor-default"
                style={{ width: s.font + 14, height: s.font + 14, background: p.hover, color: p.muted, ["--tw-ring-color" as string]: accentColor }}
              >
                <XIcon size={s.icon} />
              </button>
            </div>
          )}
        </div>
        <AnimatePresence initial={false}>
          {error && (
            <motion.span
              id={`${uid}-error`}
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
              style={{ color: p.error, fontSize: s.font - 2.5 }}
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  const isEmpty = committed.length === 0;
  const pencil = (
    <span className="flex shrink-0 items-center justify-center opacity-0 transition-opacity duration-150 group-hover/inline-edit:opacity-100 group-focus-visible/inline-edit:opacity-100" style={{ color: p.muted }}>
      <PencilIcon size={s.icon - 2} />
    </span>
  );
  const sharedStyle: React.CSSProperties = { gap: 6, padding: `${s.padY}px ${s.padX}px`, margin: `0 -${s.padX}px`, borderRadius: s.radius, fontSize: s.font, color: isEmpty ? p.muted : p.text, fontFamily: "Inter, sans-serif", fontStyle: isEmpty ? "italic" : undefined };
  const hoverHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.background = p.hover),
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.background = "transparent"),
  };

  // A pencil icon that's the *only* way to start editing is a real nested
  // <button>, so the whole row has to be a plain (non-interactive) <span>
  // instead of a <button> itself — an interactive element can't contain
  // another one without breaking HTML/ARIA nesting rules.
  if (!editOnClick) {
    return (
      <span className={cn("group/inline-edit inline-flex max-w-full items-center", className)} style={sharedStyle} {...hoverHandlers}>
        <span className="min-w-0 truncate whitespace-pre-wrap">{isEmpty ? emptyText : committed}</span>
        <button
          type="button"
          aria-label="Edit"
          onClick={startEdit}
          className="border-none bg-transparent p-0 outline-none focus-visible:ring-2"
          style={{ ["--tw-ring-color" as string]: accentColor }}
        >
          {pencil}
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      className={cn("group/inline-edit inline-flex max-w-full cursor-pointer items-center border-none bg-transparent text-left outline-none focus-visible:ring-2", className)}
      style={{ ...sharedStyle, ["--tw-ring-color" as string]: accentColor }}
      {...hoverHandlers}
    >
      <span className="min-w-0 truncate whitespace-pre-wrap">{isEmpty ? emptyText : committed}</span>
      {pencil}
    </button>
  );
}
