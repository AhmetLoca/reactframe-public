"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

/** A prompt shown in full with a Copy button, for pasting into an AI assistant. */
export function CopyPromptCard({ prompt, label = "Copy prompt" }: { prompt: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be denied (permissions, insecure context); the text stays selectable.
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-xs font-medium tracking-[0.12em] text-foreground/50 uppercase">Prompt</span>
        <button
          type="button"
          onClick={copy}
          className="flex h-8 items-center gap-2 rounded-lg border border-border px-3 text-sm text-foreground/80 transition-colors duration-300 ease-signature hover:border-foreground/30 hover:text-foreground"
        >
          {copied ? "Copied" : label}
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <p className="px-4 py-3.5 text-[14px] leading-relaxed whitespace-pre-line text-foreground/80 select-all">{prompt}</p>
    </div>
  );
}
