"use client";

import * as React from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export type CodeLang = "ts" | "js";
export type CodeStyle = "tailwind" | "css";

function TsIcon() {
  return <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] bg-[#3178c6] text-[9px] font-bold text-white">TS</span>;
}

function JsIcon() {
  return <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] bg-[#f0db4f] text-[9px] font-bold text-black">JS</span>;
}

function CssIcon() {
  return <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] bg-[#2965f1] text-[7px] font-bold text-white">CSS</span>;
}

function TailwindIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#38bdf8]" fill="currentColor">
      <path d="M12 6c-2.667 0-4.333 1.333-5 4 1-1.333 2.167-1.833 3.5-1.5.761.19 1.305.742 1.906 1.352C13.387 10.831 14.522 12 17 12c2.667 0 4.333-1.333 5-4-1 1.333-2.167 1.833-3.5 1.5-.761-.19-1.305-.742-1.906-1.352C15.613 7.169 14.478 6 12 6ZM7 12c-2.667 0-4.333 1.333-5 4 1-1.333 2.167-1.833 3.5-1.5.761.19 1.305.742 1.906 1.352C8.387 16.831 9.522 18 12 18c2.667 0 4.333-1.333 5-4-1 1.333-2.167 1.833-3.5 1.5-.761-.19-1.305-.742-1.906-1.352C10.613 13.169 9.478 12 7 12Z" />
    </svg>
  );
}

const LANG_LABEL: Record<CodeLang, string> = { ts: "TypeScript", js: "JavaScript" };
const STYLE_LABEL: Record<CodeStyle, string> = { tailwind: "Tailwind", css: "CSS" };

function LangIcon({ lang }: { lang: CodeLang }) {
  return lang === "ts" ? <TsIcon /> : <JsIcon />;
}

function StyleIcon({ style }: { style: CodeStyle }) {
  return style === "css" ? <CssIcon /> : <TailwindIcon />;
}

function Dropdown<T extends string>({
  value,
  options,
  onChange,
  renderOption,
}: {
  value: T;
  options: { value: T; disabled?: boolean }[];
  onChange: (v: T) => void;
  renderOption: (v: T) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground/80 transition-colors duration-300 ease-signature hover:border-foreground/30"
      >
        {renderOption(value)}
        <ChevronDown className={cn("h-3.5 w-3.5 text-foreground/40 transition-transform duration-300 ease-signature", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-20 mt-1.5 w-40 rounded-xl border border-border bg-card p-1.5 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={opt.disabled}
              onClick={() => {
                if (opt.disabled) return;
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-300 ease-signature",
                opt.disabled ? "cursor-not-allowed text-foreground/30" : "text-foreground/80 hover:bg-foreground/5",
              )}
            >
              {renderOption(opt.value)}
              {value === opt.value && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CodeVariantToolbar({
  lang,
  style,
  onLangChange,
  onStyleChange,
  isAvailable,
}: {
  lang: CodeLang;
  style: CodeStyle;
  onLangChange: (lang: CodeLang) => void;
  onStyleChange: (style: CodeStyle) => void;
  isAvailable: (lang: CodeLang, style: CodeStyle) => boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Dropdown<CodeLang>
        value={lang}
        options={(["ts", "js"] as CodeLang[]).map((v) => ({ value: v, disabled: !isAvailable(v, style) }))}
        onChange={onLangChange}
        renderOption={(v) => (
          <>
            <LangIcon lang={v} />
            {LANG_LABEL[v]}
          </>
        )}
      />
      <Dropdown<CodeStyle>
        value={style}
        options={(["css", "tailwind"] as CodeStyle[]).map((v) => ({ value: v, disabled: !isAvailable(lang, v) }))}
        onChange={onStyleChange}
        renderOption={(v) => (
          <>
            <StyleIcon style={v} />
            {STYLE_LABEL[v]}
          </>
        )}
      />
    </div>
  );
}

/** Shared "Copy" button + "Copied!" tooltip, used in every card header (Install, Usage, Code). */
export function CopyButton({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy"
        className="flex h-8 shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground/80 transition-colors duration-300 ease-signature hover:border-foreground/30 hover:text-foreground"
      >
        Copy
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <div
        role="status"
        className={cn(
          "pointer-events-none absolute top-full left-1/2 z-30 mt-2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs font-medium whitespace-nowrap text-background transition-all duration-200 ease-signature",
          copied ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        )}
      >
        Copied!
        <div className="absolute bottom-full left-1/2 -mb-px h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-foreground" />
      </div>
    </div>
  );
}
