"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CodeBlockSize = "sm" | "md" | "lg";

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  /** 1-indexed line numbers to tint. */
  highlightLines?: number[];
  wrapLines?: boolean;
  copyable?: boolean;
  maxHeight?: number;
  size?: CodeBlockSize;
  theme?: "dark" | "light";
  width?: number | string;
  className?: string;
}

const PALETTES = {
  dark: {
    bg: "#0E0E0E",
    headerBg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.09)",
    text: "#F5F4F1",
    muted: "rgba(245,244,241,0.5)",
    faint: "rgba(245,244,241,0.28)",
    gutter: "rgba(245,244,241,0.28)",
    highlight: "rgba(245,244,241,0.06)",
    highlightBar: "rgba(245,244,241,0.4)",
    hover: "rgba(255,255,255,0.08)",
    keyword: "#B8A6FF",
    string: "#87FFE3",
    number: "#F2A841",
    comment: "rgba(245,244,241,0.4)",
    fadeTo: "#0E0E0E",
  },
  light: {
    bg: "#FFFFFF",
    headerBg: "rgba(10,10,10,0.02)",
    border: "rgba(10,10,10,0.1)",
    text: "#0A0A0A",
    muted: "rgba(10,10,10,0.5)",
    faint: "rgba(10,10,10,0.3)",
    gutter: "rgba(10,10,10,0.3)",
    highlight: "rgba(10,10,10,0.045)",
    highlightBar: "rgba(10,10,10,0.35)",
    hover: "rgba(10,10,10,0.06)",
    keyword: "#7C5CE0",
    string: "#0F9F7F",
    number: "#B7791F",
    comment: "rgba(10,10,10,0.42)",
    fadeTo: "#FFFFFF",
  },
};

const SIZES: Record<CodeBlockSize, { font: number; lineH: number; pad: number; headerH: number }> = {
  sm: { font: 12, lineH: 19, pad: 12, headerH: 36 },
  md: { font: 13, lineH: 21, pad: 16, headerH: 40 },
  lg: { font: 14.5, lineH: 23, pad: 18, headerH: 44 },
};

type Palette = (typeof PALETTES)["dark"];

const LANG_ALIASES: Record<string, string> = { js: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript", py: "python", sh: "bash", shell: "bash", zsh: "bash", yml: "yaml" };

const KEYWORDS: Record<string, string[]> = {
  javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "do", "class", "extends", "new", "import", "from", "export", "default", "async", "await", "try", "catch", "finally", "throw", "typeof", "instanceof", "in", "of", "switch", "case", "break", "continue", "this", "super", "null", "undefined", "true", "false", "void", "yield", "static", "get", "set"],
  typescript: ["interface", "type", "enum", "implements", "private", "public", "protected", "readonly", "namespace", "declare", "as", "is", "keyof", "infer", "satisfies"],
  python: ["def", "return", "if", "elif", "else", "for", "while", "class", "import", "from", "as", "try", "except", "finally", "raise", "with", "lambda", "yield", "pass", "break", "continue", "in", "is", "not", "and", "or", "None", "True", "False", "self", "async", "await", "global", "nonlocal", "del"],
  bash: ["if", "then", "else", "elif", "fi", "for", "while", "do", "done", "function", "return", "export", "local", "case", "esac", "in", "echo"],
  json: ["true", "false", "null"],
  yaml: ["true", "false", "null"],
  go: ["func", "return", "if", "else", "for", "range", "package", "import", "var", "const", "type", "struct", "interface", "map", "chan", "go", "defer", "select", "switch", "case", "break", "continue", "nil", "true", "false"],
  rust: ["fn", "let", "mut", "return", "if", "else", "for", "while", "loop", "match", "struct", "enum", "impl", "trait", "pub", "use", "mod", "self", "Self", "true", "false", "None", "Some"],
};
KEYWORDS.typescript = [...KEYWORDS.javascript, ...KEYWORDS.typescript];

const COMMENT_PREFIX: Record<string, string> = { python: "#", bash: "#", yaml: "#" };

interface Segment {
  text: string;
  type: "plain" | "comment" | "string" | "number" | "keyword";
}

function tokenizeLine(line: string, lang: string): Segment[] {
  const keywords = KEYWORDS[lang];
  if (!keywords && !COMMENT_PREFIX[lang] && lang !== "javascript" && lang !== "typescript") {
    return [{ text: line, type: "plain" }];
  }
  const commentPrefix = COMMENT_PREFIX[lang] ?? "//";
  const escapedPrefix = commentPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const kwPattern = keywords && keywords.length ? `|\\b(?:${keywords.join("|")})\\b` : "";
  const pattern = new RegExp(`(${escapedPrefix}.*$)|(\`(?:\\\\.|[^\`\\\\])*\`|"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')|(\\b\\d+(?:\\.\\d+)?\\b)${kwPattern}`, "g");

  const segments: Segment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(line))) {
    if (m.index > last) segments.push({ text: line.slice(last, m.index), type: "plain" });
    const type: Segment["type"] = m[1] !== undefined ? "comment" : m[2] !== undefined ? "string" : m[3] !== undefined ? "number" : "keyword";
    segments.push({ text: m[0], type });
    last = m.index + m[0].length;
    if (m[0].length === 0) pattern.lastIndex++;
  }
  if (last < line.length) segments.push({ text: line.slice(last), type: "plain" });
  return segments;
}

function Token({ seg, p }: { seg: Segment; p: Palette }) {
  if (seg.type === "plain") return <>{seg.text}</>;
  const colorMap: Record<Segment["type"], string> = { plain: p.text, comment: p.comment, string: p.string, number: p.number, keyword: p.keyword };
  return <span style={{ color: colorMap[seg.type], fontStyle: seg.type === "comment" ? "italic" : undefined }}>{seg.text}</span>;
}

function CopyIcon({ copied, size }: { copied: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {copied ? <path d="M3.5 8.3L6.3 11.2L12.5 4.5" /> : <><rect x="5.5" y="5.5" width="8" height="8.5" rx="1.5" /><path d="M3.5 10.5A1.5 1.5 0 0 1 2 9V3.5A1.5 1.5 0 0 1 3.5 2H9a1.5 1.5 0 0 1 1.5 1.5" /></>}
    </svg>
  );
}

export function CodeBlock({
  code,
  language = "text",
  filename,
  showLineNumbers = true,
  highlightLines = [],
  wrapLines = false,
  copyable = true,
  maxHeight,
  size = "md",
  theme = "dark",
  width,
  className,
}: CodeBlockProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const lang = LANG_ALIASES[language.toLowerCase()] ?? language.toLowerCase();
  const lines = React.useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);
  const gutterWidth = React.useMemo(() => `${String(lines.length).length}ch`, [lines.length]);
  const highlighted = React.useMemo(() => new Set(highlightLines), [highlightLines]);

  const [copied, setCopied] = React.useState(false);
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  const [expanded, setExpanded] = React.useState(false);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = React.useState(false);
  React.useEffect(() => {
    if (!maxHeight) return;
    const el = bodyRef.current;
    if (el) setOverflows(el.scrollHeight > maxHeight + 4);
  }, [maxHeight, code]);

  const copy = () => {
    try {
      const cb = navigator.clipboard;
      if (cb && typeof cb.writeText === "function") {
        void cb.writeText(code).then(
          () => {
            setCopied(true);
            if (copyTimer.current) clearTimeout(copyTimer.current);
            copyTimer.current = setTimeout(() => setCopied(false), 1600);
          },
          () => undefined,
        );
      }
    } catch {
      // clipboard can be blocked inside an embedded frame
    }
  };

  const capped = Boolean(maxHeight) && !expanded;

  return (
    <div
      className={cn("flex flex-col overflow-hidden", className)}
      style={{ width, maxWidth: "100%", borderRadius: 14, background: p.bg, border: `1px solid ${p.border}`, fontFamily: "Inter, sans-serif" }}
    >
      {(filename || language !== "text" || copyable) && (
        <div className="flex shrink-0 items-center justify-between" style={{ height: s.headerH, padding: `0 ${s.pad}px`, background: p.headerBg, borderBottom: `1px solid ${p.border}` }}>
          <div className="flex min-w-0 items-center" style={{ gap: 8 }}>
            {filename ? (
              <span className="truncate font-medium" style={{ color: p.text, fontSize: s.font, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                {filename}
              </span>
            ) : (
              <span className="font-medium uppercase" style={{ color: p.muted, fontSize: s.font - 2, letterSpacing: "0.06em" }}>
                {language}
              </span>
            )}
          </div>
          {copyable && (
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? "Copied" : "Copy code"}
              className="flex shrink-0 cursor-pointer items-center rounded-md border-none bg-transparent outline-none focus-visible:ring-2"
              style={{ gap: 5, height: 26, padding: "0 8px", color: copied ? p.string : p.muted, fontSize: s.font - 2.5, fontWeight: 500, ["--tw-ring-color" as string]: p.text }}
              onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={String(copied)} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.15 }} className="flex items-center" style={{ gap: 5 }}>
                  <CopyIcon copied={copied} size={s.font} />
                  {copied ? "Copied" : "Copy"}
                </motion.span>
              </AnimatePresence>
            </button>
          )}
        </div>
      )}

      <div className="relative">
        <div
          ref={bodyRef}
          className={cn("overflow-x-auto", capped && "overflow-y-hidden")}
          style={{ maxHeight: capped ? maxHeight : undefined, padding: `${s.pad * 0.6}px 0` }}
        >
          {lines.map((line, i) => {
            const n = i + 1;
            const isHi = highlighted.has(n);
            return (
              <div
                key={i}
                className="flex"
                style={{ minWidth: "100%", width: "fit-content", background: isHi ? p.highlight : "transparent", boxShadow: isHi ? `inset 3px 0 0 0 ${p.highlightBar}` : undefined }}
              >
                {showLineNumbers && (
                  <span className="sticky left-0 shrink-0 select-none text-right tabular-nums" style={{ width: gutterWidth, marginRight: 16, paddingLeft: s.pad, color: p.gutter, fontSize: s.font, lineHeight: `${s.lineH}px`, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", background: isHi ? p.highlight : p.bg }}>
                    {n}
                  </span>
                )}
                <code
                  className={cn(wrapLines ? "whitespace-pre-wrap break-words" : "whitespace-pre")}
                  style={{ paddingRight: s.pad, color: p.text, fontSize: s.font, lineHeight: `${s.lineH}px`, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  {tokenizeLine(line, lang).map((seg, j) => (
                    <Token key={j} seg={seg} p={p} />
                  ))}
                  {line.length === 0 && " "}
                </code>
              </div>
            );
          })}
        </div>

        {capped && overflows && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0" style={{ height: 56, background: `linear-gradient(to bottom, transparent, ${p.fadeTo})` }} />
        )}
      </div>

      {maxHeight && overflows && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex shrink-0 cursor-pointer items-center justify-center border-none outline-none focus-visible:ring-2"
          style={{ height: 34, borderTop: `1px solid ${p.border}`, background: p.headerBg, color: p.muted, fontSize: s.font - 2, fontWeight: 600, gap: 5, ["--tw-ring-color" as string]: p.text }}
          onMouseEnter={(e) => (e.currentTarget.style.color = p.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = p.muted)}
        >
          <motion.svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.18 }} aria-hidden="true">
            <path d="M4 6L8 10L12 6" />
          </motion.svg>
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
