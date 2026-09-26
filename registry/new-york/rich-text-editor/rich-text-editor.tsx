"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RichTextEditorSize = "sm" | "md" | "lg";
export type RichTextTool = "bold" | "italic" | "underline" | "strike" | "h2" | "h3" | "bulletList" | "orderedList" | "quote" | "code" | "link" | "undo" | "redo";

export interface RichTextEditorProps {
  /** HTML string. */
  value?: string;
  defaultValue?: string;
  /** Called with the cleaned HTML and the plain text on every change. */
  onValueChange?: (html: string, text: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  /** Tools shown in the toolbar, in order. */
  tools?: RichTextTool[];
  /** Shows a live word and character count; with maxLength it counts down to the limit. */
  showCount?: boolean;
  /** Soft limit in characters: the counter turns red past it. */
  maxLength?: number;
  minHeight?: number;
  maxHeight?: number;
  size?: RichTextEditorSize;
  theme?: "dark" | "light";
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_TOOLS: RichTextTool[] = ["bold", "italic", "underline", "strike", "h2", "h3", "bulletList", "orderedList", "quote", "code", "link", "undo", "redo"];

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.3)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", divider: "rgba(255,255,255,0.08)", hover: "rgba(255,255,255,0.07)", sel: "#F5F4F1", selText: "#0A0A0A", codeBg: "rgba(255,255,255,0.08)", menuBg: "#0E0E0E", shadow: "0 18px 44px rgba(0,0,0,0.5)", error: "#FF7A6B" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.3)", bg: "#FFFFFF", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", divider: "rgba(10,10,10,0.08)", hover: "rgba(10,10,10,0.05)", sel: "#0A0A0A", selText: "#FFFFFF", codeBg: "rgba(10,10,10,0.06)", menuBg: "#FFFFFF", shadow: "0 14px 36px rgba(0,0,0,0.14)", error: "#E5484D" },
};

const SIZES: Record<RichTextEditorSize, { font: number; radius: number; pad: number; btn: number }> = {
  sm: { font: 13.5, radius: 11, pad: 12, btn: 28 },
  md: { font: 15, radius: 13, pad: 14, btn: 30 },
  lg: { font: 16.5, radius: 15, pad: 16, btn: 34 },
};

// ─── Sanitising ────────────────────────────────────────────────────────────
// Pasted HTML (Word, Google Docs, web pages) and incoming values are reduced to this small set of tags,
// with every attribute dropped except a safe href on links. Always sanitise again on your server.
const ALLOWED = new Set(["P", "BR", "STRONG", "EM", "U", "S", "H2", "H3", "UL", "OL", "LI", "BLOCKQUOTE", "CODE", "A"]);
const RENAME: Record<string, string> = { B: "STRONG", I: "EM", STRIKE: "S", DEL: "S", H1: "H2", H4: "H3", H5: "H3", H6: "H3", DIV: "P", PRE: "P" };
const DROP = new Set(["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "META", "LINK", "TITLE", "NOSCRIPT", "SVG", "MATH", "FORM", "INPUT", "BUTTON", "TEMPLATE"]);

function safeHref(href: string | null) {
  if (!href) return null;
  const h = href.trim();
  return /^(https?:|mailto:|\/|#)/i.test(h) ? h : null;
}

export function sanitizeRichText(html: string): string {
  if (typeof window === "undefined") return html;
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  const walk = (node: Node, into: Node) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        into.appendChild(document.createTextNode(child.textContent ?? ""));
        return;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) return;
      const el = child as Element;
      const tag = RENAME[el.tagName] ?? el.tagName;
      if (DROP.has(el.tagName)) return;
      // Google Docs wraps bold text in <span style="font-weight:700">; keep that as <strong>.
      const style = el.getAttribute("style") ?? "";
      const spanBold = el.tagName === "SPAN" && /font-weight:\s*(bold|[6-9]00)/.test(style);
      const spanItalic = el.tagName === "SPAN" && /font-style:\s*italic/.test(style);
      if (!ALLOWED.has(tag) && !spanBold && !spanItalic) {
        walk(el, into);
        return;
      }
      const out = document.createElement(spanBold ? "strong" : spanItalic ? "em" : tag.toLowerCase());
      if (tag === "A") {
        const href = safeHref(el.getAttribute("href"));
        if (!href) {
          walk(el, into);
          return;
        }
        out.setAttribute("href", href);
        out.setAttribute("rel", "noopener noreferrer nofollow");
        out.setAttribute("target", "_blank");
      }
      walk(el, out);
      // A paragraph can't hold lists, quotes or headings; keep its children and drop the wrapper.
      if (out.tagName === "P" && out.querySelector(":scope > ul, :scope > ol, :scope > blockquote, :scope > h2, :scope > h3, :scope > p")) {
        while (out.firstChild) into.appendChild(out.firstChild);
        return;
      }
      into.appendChild(out);
    });
  };
  const clean = document.createElement("div");
  walk(doc.body, clean);
  return clean.innerHTML;
}

// ─── Icons ─────────────────────────────────────────────────────────────────
function Icon({ name }: { name: RichTextTool }) {
  const common = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "bold":
      return <svg {...common} strokeWidth={2}><path d="M4.5 2.75h4.25a2.6 2.6 0 0 1 0 5.2H4.5zM4.5 7.95h5a2.65 2.65 0 0 1 0 5.3h-5z" /></svg>;
    case "italic":
      return <svg {...common}><path d="M9.5 2.75h-3M9.5 13.25h-3M9 2.75 7 13.25" /></svg>;
    case "underline":
      return <svg {...common}><path d="M4.5 2.5v5a3.5 3.5 0 0 0 7 0v-5M3.5 13.75h9" /></svg>;
    case "strike":
      return <svg {...common}><path d="M2.75 8h10.5M10.9 4.6c-.4-1.1-1.5-1.85-2.9-1.85-1.75 0-2.9.95-2.9 2.2 0 .7.35 1.2.95 1.6M5 11.4c.4 1.1 1.55 1.85 3.05 1.85 1.8 0 2.95-.95 2.95-2.25 0-.45-.15-.85-.4-1.15" /></svg>;
    case "h2":
      return <svg {...common}><path d="M2.5 3.5v9M7.5 3.5v9M2.5 8h5M10 6.4c.3-.9 1-1.4 1.9-1.4 1 0 1.75.7 1.75 1.6 0 1.8-3.65 2.6-3.65 5.9h3.75" /></svg>;
    case "h3":
      return <svg {...common}><path d="M2.5 3.5v9M7.5 3.5v9M2.5 8h5M10.1 5.6c.3-.4.85-.65 1.55-.65 1 0 1.7.55 1.7 1.4s-.7 1.4-1.7 1.4c1.15 0 1.95.6 1.95 1.55 0 .95-.8 1.7-2 1.7-.7 0-1.3-.3-1.6-.8" /></svg>;
    case "bulletList":
      return <svg {...common}><path d="M6.5 4h7M6.5 8h7M6.5 12h7" /><circle cx="3" cy="4" r="0.9" fill="currentColor" stroke="none" /><circle cx="3" cy="8" r="0.9" fill="currentColor" stroke="none" /><circle cx="3" cy="12" r="0.9" fill="currentColor" stroke="none" /></svg>;
    case "orderedList":
      return <svg {...common}><path d="M6.5 4h7M6.5 8h7M6.5 12h7M2.4 2.9l.9-.5v3.1M2.3 7.1c.2-.4.55-.6.95-.6.5 0 .85.3.85.75 0 .8-1.8 1.1-1.8 2.25h1.85" strokeWidth={1.3} /></svg>;
    case "quote":
      return <svg {...common}><path d="M3 4.5h10M6 8h7M6 11.5h7M3 7.5v5" /></svg>;
    case "code":
      return <svg {...common}><path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5" /></svg>;
    case "link":
      return <svg {...common}><path d="M6.75 9.25a2.5 2.5 0 0 0 3.55.1l2-2a2.5 2.5 0 0 0-3.55-3.55l-.7.7M9.25 6.75a2.5 2.5 0 0 0-3.55-.1l-2 2a2.5 2.5 0 0 0 3.55 3.55l.7-.7" /></svg>;
    case "undo":
      return <svg {...common}><path d="M4.5 6.5h5.25a3.25 3.25 0 0 1 0 6.5H7M6.75 3.75 4 6.5l2.75 2.75" /></svg>;
    case "redo":
      return <svg {...common}><path d="M11.5 6.5H6.25a3.25 3.25 0 0 0 0 6.5H9M9.25 3.75 12 6.5 9.25 9.25" /></svg>;
  }
}

const LABELS: Record<RichTextTool, string> = {
  bold: "Bold (⌘B)",
  italic: "Italic (⌘I)",
  underline: "Underline (⌘U)",
  strike: "Strikethrough",
  h2: "Heading",
  h3: "Subheading",
  bulletList: "Bulleted list",
  orderedList: "Numbered list",
  quote: "Quote",
  code: "Inline code",
  link: "Link (⌘K)",
  undo: "Undo (⌘Z)",
  redo: "Redo (⌘⇧Z)",
};

// Where each tool sits in the toolbar groups; a divider goes between groups.
const GROUP: Record<RichTextTool, number> = { bold: 0, italic: 0, underline: 0, strike: 0, h2: 1, h3: 1, bulletList: 2, orderedList: 2, quote: 2, code: 3, link: 3, undo: 4, redo: 4 };

type ActiveState = Partial<Record<RichTextTool, boolean>>;

const exec = (command: string, value?: string) => document.execCommand(command, false, value);

// Inserts HTML at the caret through the Range API. execCommand("insertHTML") would stamp inline
// colours on the new nodes in Chrome, which then ignore the theme.
function insertHtmlAtCaret(html: string) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  range.deleteContents();
  const fragment = range.createContextualFragment(html);
  const last = fragment.lastChild;
  range.insertNode(fragment);
  if (last) {
    const after = document.createRange();
    after.setStartAfter(last);
    after.collapse(true);
    sel.removeAllRanges();
    sel.addRange(after);
  }
}

export function RichTextEditor({
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "Write something…",
  label,
  helperText,
  tools = DEFAULT_TOOLS,
  showCount = true,
  maxLength,
  minHeight = 160,
  maxHeight = 420,
  size = "md",
  theme = "dark",
  width = 560,
  disabled = false,
  className,
}: RichTextEditorProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const editorRef = React.useRef<HTMLDivElement>(null);
  const savedRange = React.useRef<Range | null>(null);
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [active, setActive] = React.useState<ActiveState>({});
  const [empty, setEmpty] = React.useState(!defaultValue && !value);
  const [counts, setCounts] = React.useState({ words: 0, chars: 0 });
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");

  const readCounts = (el: HTMLElement) => {
    const text = el.innerText.replace(/​/g, "").trim();
    setCounts({ words: text ? text.split(/\s+/).length : 0, chars: text.length });
    setEmpty(text.length === 0 && !el.querySelector("li, blockquote, h2, h3"));
    return text;
  };

  // Load the initial (or a changed controlled) value, without fighting the caret while typing.
  React.useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const next = sanitizeRichText(value ?? defaultValue);
    if (el.innerHTML !== next && document.activeElement !== el) {
      el.innerHTML = next;
      readCounts(el);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const emit = () => {
    const el = editorRef.current;
    if (!el) return;
    const text = readCounts(el);
    onValueChange?.(sanitizeRichText(el.innerHTML), text);
  };

  const refreshActive = React.useCallback(() => {
    const el = editorRef.current;
    const sel = window.getSelection();
    if (!el || !sel || !sel.anchorNode || !el.contains(sel.anchorNode)) return;
    const node = sel.anchorNode.nodeType === Node.ELEMENT_NODE ? (sel.anchorNode as Element) : sel.anchorNode.parentElement;
    const block = String(document.queryCommandValue("formatBlock") || "").toLowerCase();
    setActive({
      bold: document.queryCommandState("bold") && block !== "h2" && block !== "h3",
      italic: document.queryCommandState("italic"),
      // Links are underlined by CSS, which the browser reports as underline; don't light it up there.
      underline: document.queryCommandState("underline") && !node?.closest("a"),
      strike: document.queryCommandState("strikeThrough"),
      bulletList: document.queryCommandState("insertUnorderedList"),
      orderedList: document.queryCommandState("insertOrderedList"),
      h2: block === "h2",
      h3: block === "h3",
      quote: block === "blockquote" || Boolean(node?.closest("blockquote")),
      code: Boolean(node?.closest("code")),
      link: Boolean(node?.closest("a")),
    });
  }, []);

  React.useEffect(() => {
    document.addEventListener("selectionchange", refreshActive);
    return () => document.removeEventListener("selectionchange", refreshActive);
  }, [refreshActive]);

  const saveRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount && editorRef.current?.contains(sel.anchorNode)) savedRange.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreRange = () => {
    const sel = window.getSelection();
    editorRef.current?.focus();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const toggleBlock = (tag: "h2" | "h3" | "blockquote") => {
    const current = String(document.queryCommandValue("formatBlock") || "").toLowerCase();
    exec("formatBlock", current === tag ? "p" : tag);
  };

  const toggleCode = () => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const node = sel.anchorNode?.nodeType === Node.ELEMENT_NODE ? (sel.anchorNode as Element) : sel.anchorNode?.parentElement;
    const code = node?.closest("code");
    if (code && editorRef.current?.contains(code)) {
      code.replaceWith(document.createTextNode(code.textContent ?? ""));
      return;
    }
    const text = sel.toString();
    if (!text) return;
    const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    insertHtmlAtCaret(`<code>${escaped}</code>`);
  };

  const openLink = () => {
    saveRange();
    const sel = window.getSelection();
    const node = sel?.anchorNode?.nodeType === Node.ELEMENT_NODE ? (sel.anchorNode as Element) : sel?.anchorNode?.parentElement;
    const existing = node?.closest("a");
    setLinkUrl(existing?.getAttribute("href") ?? "");
    setLinkOpen(true);
  };

  const applyLink = (remove = false) => {
    restoreRange();
    if (remove) exec("unlink");
    else {
      const raw = linkUrl.trim();
      const url = raw && !/^(https?:|mailto:|\/|#)/i.test(raw) ? `https://${raw}` : raw;
      if (url) {
        const sel = window.getSelection();
        if (sel && sel.isCollapsed) insertHtmlAtCaret(`<a href="${url.replace(/"/g, "&quot;")}">${url.replace(/</g, "&lt;")}</a>`);
        else exec("createLink", url);
        editorRef.current?.querySelectorAll("a").forEach((a) => {
          a.setAttribute("rel", "noopener noreferrer nofollow");
          a.setAttribute("target", "_blank");
        });
      }
    }
    setLinkOpen(false);
    emit();
    refreshActive();
  };

  const run = (tool: RichTextTool) => {
    if (disabled) return;
    if (tool === "link") return openLink();
    editorRef.current?.focus();
    switch (tool) {
      case "bold": exec("bold"); break;
      case "italic": exec("italic"); break;
      case "underline": exec("underline"); break;
      case "strike": exec("strikeThrough"); break;
      case "h2": toggleBlock("h2"); break;
      case "h3": toggleBlock("h3"); break;
      case "quote": toggleBlock("blockquote"); break;
      case "bulletList": exec("insertUnorderedList"); break;
      case "orderedList": exec("insertOrderedList"); break;
      case "code": toggleCode(); break;
      case "undo": exec("undo"); break;
      case "redo": exec("redo"); break;
    }
    emit();
    refreshActive();
  };

  // Markdown-style shortcuts at the start of a line: "## ", "### ", "- ", "* ", "1. ", "> ".
  const markdownShortcut = (): boolean => {
    const sel = window.getSelection();
    if (!sel || !sel.isCollapsed || !sel.anchorNode || sel.anchorNode.nodeType !== Node.TEXT_NODE) return false;
    const textNode = sel.anchorNode as Text;
    const before = (textNode.textContent ?? "").slice(0, sel.anchorOffset);
    // Only at the very start of a line: the text from the start of the block up to the caret must be the marker.
    const block = textNode.parentElement?.closest("p, div, h2, h3, li, blockquote") ?? editorRef.current;
    if (!block) return false;
    const prefix = document.createRange();
    prefix.selectNodeContents(block);
    prefix.setEnd(textNode, sel.anchorOffset);
    if (prefix.toString() !== before) return false;
    const map: Record<string, () => void> = {
      "##": () => exec("formatBlock", "h2"),
      "###": () => exec("formatBlock", "h3"),
      "-": () => exec("insertUnorderedList"),
      "*": () => exec("insertUnorderedList"),
      "1.": () => exec("insertOrderedList"),
      ">": () => exec("formatBlock", "blockquote"),
    };
    const action = map[before];
    if (!action) return false;
    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, sel.anchorOffset);
    sel.removeAllRanges();
    sel.addRange(range);
    exec("delete");
    action();
    return true;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openLink();
      return;
    }
    if (e.key === " " && markdownShortcut()) {
      e.preventDefault();
      emit();
      refreshActive();
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    if (html) insertHtmlAtCaret(sanitizeRichText(html));
    else exec("insertText", text);
    emit();
  };

  const borderColor = focused ? p.focus : hovered ? p.borderHover : p.border;
  const over = maxLength !== undefined && counts.chars > maxLength;
  const shownTools = tools.filter((t) => t in LABELS);

  return (
    <div className={cn("relative inline-flex flex-col gap-2", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <label id={`${uid}-label`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font - 0.5 }} onClick={() => editorRef.current?.focus()}>
          {label}
        </label>
      )}

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex flex-col"
        style={{ borderRadius: s.radius, background: p.bg, border: `1px solid ${borderColor}`, boxShadow: focused ? `0 0 0 3px color-mix(in srgb, ${p.focus} 14%, transparent)` : "0 0 0 0 transparent", transition: "border-color 0.18s ease, box-shadow 0.18s ease" }}
      >
        <div role="toolbar" aria-label="Formatting" aria-controls={`${uid}-editor`} className="flex flex-wrap items-center" style={{ gap: 2, padding: 6, borderBottom: `1px solid ${p.divider}` }}>
          {shownTools.map((tool, i) => {
            const on = Boolean(active[tool]);
            const newGroup = i > 0 && GROUP[tool] !== GROUP[shownTools[i - 1]];
            return (
              <React.Fragment key={tool}>
                {newGroup && <span aria-hidden="true" style={{ width: 1, height: s.btn - 12, margin: "0 5px", background: p.divider }} />}
                <button
                  type="button"
                  title={LABELS[tool]}
                  aria-label={LABELS[tool].replace(/ \(.*\)$/, "")}
                  aria-pressed={tool === "undo" || tool === "redo" ? undefined : on}
                  disabled={disabled}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => run(tool)}
                  className="relative flex shrink-0 cursor-pointer items-center justify-center border-none bg-transparent outline-none focus-visible:ring-2"
                  style={{ width: s.btn, height: s.btn, borderRadius: 8, color: on ? p.selText : p.muted, ["--tw-ring-color" as string]: p.focus }}
                  onMouseEnter={(e) => !on && (e.currentTarget.style.background = p.hover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {on && <motion.span className="absolute inset-0" style={{ borderRadius: 8, background: p.sel }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 520, damping: 34 }} />}
                  <span className="relative flex">
                    <Icon name={tool} />
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <AnimatePresence>
          {linkOpen && (
            <motion.div
              className="absolute z-20 flex items-center"
              style={{ top: s.btn + 18, left: 8, right: 8, maxWidth: 420, gap: 6, padding: 6, borderRadius: 11, background: p.menuBg, border: `1px solid ${p.border}`, boxShadow: p.shadow }}
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.14 }}
            >
              <input
                autoFocus
                type="url"
                aria-label="Link URL"
                value={linkUrl}
                placeholder="Paste or type a link"
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyLink();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    setLinkOpen(false);
                    restoreRange();
                  }
                }}
                className="min-w-0 flex-1 border-none bg-transparent px-2 outline-none placeholder:text-[color:var(--rte-placeholder)]"
                style={{ height: 30, color: p.text, fontSize: s.font - 1.5, ["--rte-placeholder" as string]: p.faint }}
              />
              {active.link && (
                <button type="button" onClick={() => applyLink(true)} className="cursor-pointer rounded-md border-none bg-transparent px-2.5 outline-none" style={{ height: 28, color: p.muted, fontSize: s.font - 2 }}>
                  Remove
                </button>
              )}
              <button type="button" onClick={() => applyLink()} className="cursor-pointer rounded-md border-none px-3 font-medium outline-none" style={{ height: 28, background: p.sel, color: p.selText, fontSize: s.font - 2 }}>
                Apply
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          {empty && (
            <div aria-hidden="true" className="pointer-events-none absolute" style={{ top: s.pad, left: s.pad + 2, color: p.faint, fontSize: s.font }}>
              {placeholder}
            </div>
          )}
          <div
            ref={editorRef}
            id={`${uid}-editor`}
            role="textbox"
            aria-multiline="true"
            aria-labelledby={label ? `${uid}-label` : undefined}
            aria-label={label ? undefined : "Rich text editor"}
            aria-describedby={helperText ? `${uid}-help` : undefined}
            contentEditable={!disabled}
            suppressContentEditableWarning
            onInput={emit}
            onKeyDown={onKeyDown}
            onKeyUp={refreshActive}
            onMouseUp={refreshActive}
            onPaste={onPaste}
            onFocus={() => {
              setFocused(true);
              // New lines become <p> (not <div>) in every browser.
              exec("defaultParagraphSeparator", "p");
            }}
            onBlur={() => {
              setFocused(false);
              saveRange();
            }}
            className="rte-content overflow-y-auto outline-none"
            style={{ minHeight, maxHeight, padding: `${s.pad}px ${s.pad + 2}px`, color: p.text, fontSize: s.font, lineHeight: 1.6, ["--rte-muted" as string]: p.muted, ["--rte-code" as string]: p.codeBg, ["--rte-border" as string]: p.border }}
          />
        </div>

        {showCount && (
          <div className="flex items-center justify-end" style={{ gap: 12, padding: `6px ${s.pad}px 8px`, color: over ? p.error : p.faint, fontSize: s.font - 3, fontVariantNumeric: "tabular-nums" }} aria-live="polite">
            <span>{counts.words} words</span>
            <span>{maxLength !== undefined ? `${counts.chars}/${maxLength}` : `${counts.chars} characters`}</span>
          </div>
        )}
      </div>

      {helperText && (
        <span id={`${uid}-help`} style={{ color: p.muted, fontSize: s.font - 2, lineHeight: 1.4 }}>
          {helperText}
        </span>
      )}

      <style>{`
        .rte-content > * + * { margin-top: 0.6em; }
        .rte-content p, .rte-content div { margin: 0; }
        .rte-content h2 { font-size: 1.35em; font-weight: 650; letter-spacing: -0.015em; line-height: 1.3; margin: 0.9em 0 0.3em; }
        .rte-content h3 { font-size: 1.12em; font-weight: 650; line-height: 1.35; margin: 0.8em 0 0.25em; }
        .rte-content h2:first-child, .rte-content h3:first-child { margin-top: 0; }
        .rte-content ul, .rte-content ol { padding-left: 1.4em; margin: 0.4em 0; }
        .rte-content ul { list-style: disc; }
        .rte-content ol { list-style: decimal; }
        .rte-content li + li { margin-top: 0.2em; }
        .rte-content blockquote { margin: 0.6em 0; padding-left: 0.9em; border-left: 2px solid var(--rte-border); color: var(--rte-muted); }
        .rte-content code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.88em; padding: 0.12em 0.35em; border-radius: 5px; background: var(--rte-code); }
        .rte-content a { text-decoration: underline; text-underline-offset: 3px; }
        .rte-content strong, .rte-content b { font-weight: 650; }
      `}</style>
    </div>
  );
}
