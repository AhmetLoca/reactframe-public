"use client";

import * as React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { CopyButton } from "@/components/code-toolbar";
import { cn } from "@/lib/utils";

const PACKAGE_MANAGERS = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx",
} as const;

export function InstallCommand({
  slug,
  free,
  checkout,
}: {
  slug: string;
  free: boolean;
  /** Set once this component has a real Lemon Squeezy product — swaps the generic "Get Premium" CTA for a real "Buy" link. */
  checkout?: { url: string; price?: string };
}) {
  const [pm, setPm] = React.useState<keyof typeof PACKAGE_MANAGERS>("npm");
  const [copied, setCopied] = React.useState(false);

  const command = `${PACKAGE_MANAGERS[pm]} shadcn@latest add https://reactframe.com/r/${slug}.json`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied (permissions, insecure context) —
      // fail quietly rather than surface an unhandled rejection.
    }
  }

  if (!free) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3.5">
        <div className="flex items-center gap-2.5 text-sm text-foreground/60">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          {checkout ? "Buy this component to install it." : "You need Premium access to install this component."}
        </div>
        {checkout ? (
          <a
            href={checkout.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-85"
          >
            {checkout.price ? `Buy for ${checkout.price}` : "Buy Now"}
          </a>
        ) : (
          <Link
            href="/premium"
            className="shrink-0 rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-85"
          >
            Get Premium
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-semibold text-foreground">Install</span>
        <CopyButton copied={copied} onCopy={copy} />
      </div>
      <div className="flex items-center gap-1 border-b border-border px-2 pt-2">
        {(Object.keys(PACKAGE_MANAGERS) as (keyof typeof PACKAGE_MANAGERS)[]).map(
          (key) => (
            <button
              key={key}
              onClick={() => setPm(key)}
              className={cn(
                "rounded-t-md px-3 py-1.5 text-xs font-medium transition-colors duration-300 ease-signature",
                pm === key
                  ? "bg-background text-foreground"
                  : "text-foreground/40 hover:text-foreground/70",
              )}
            >
              {key}
            </button>
          ),
        )}
      </div>
      <div className="px-4 py-3">
        <code className="overflow-x-auto whitespace-nowrap font-mono text-[13px] text-foreground/80">
          {command}
        </code>
      </div>
    </div>
  );
}
