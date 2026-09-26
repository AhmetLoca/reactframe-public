"use client";

import * as React from "react";
import { MotionConfig, motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Error404Theme = "auto" | "dark" | "light";

export interface Error404PageSectionProps extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  code?: string;
  heading?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  /** Optional second, outlined button (e.g. "Browse components"). */
  secondaryLabel?: string;
  secondaryHref?: string;
  glitch?: boolean;
  /** "auto" follows the host site's --background / --foreground tokens; "dark" / "light" use a fixed palette. */
  theme?: Error404Theme;
  /** Small dark/light switch in the corner. Only shown with a fixed palette (not with theme="auto"). */
  showThemeToggle?: boolean;
  /** Desktop sizes in px. Everything scales down with the section's own width. */
  codeSize?: number;
  headingSize?: number;
  descriptionSize?: number;
}

interface Palette {
  bg: string;
  code: string;
  title: string;
  description: string;
  buttonBg: string;
  buttonText: string;
  outline: string;
  toggleBg: string;
  toggleBorder: string;
  focus: string;
}

const PALETTES: Record<Error404Theme, Palette> = {
  dark: {
    bg: "#0a0a0a",
    code: "rgba(180,180,180,0.72)",
    title: "#ffffff",
    description: "rgba(255,255,255,0.55)",
    buttonBg: "#ffffff",
    buttonText: "#111111",
    outline: "rgba(255,255,255,0.22)",
    toggleBg: "rgba(255,255,255,0.08)",
    toggleBorder: "rgba(255,255,255,0.12)",
    focus: "rgba(255,255,255,0.35)",
  },
  light: {
    bg: "#ffffff",
    code: "rgba(40,40,40,0.55)",
    title: "#111111",
    description: "rgba(0,0,0,0.6)",
    buttonBg: "#111111",
    buttonText: "#ffffff",
    outline: "rgba(0,0,0,0.2)",
    toggleBg: "rgba(0,0,0,0.04)",
    toggleBorder: "rgba(0,0,0,0.08)",
    focus: "rgba(0,0,0,0.28)",
  },
  // Reads the host site's shadcn-style tokens, so it follows the site theme by itself.
  auto: {
    bg: "var(--background, #0a0a0a)",
    code: "color-mix(in srgb, var(--foreground, #ffffff) 55%, transparent)",
    title: "var(--foreground, #ffffff)",
    description: "var(--muted-foreground, rgba(255,255,255,0.55))",
    buttonBg: "var(--foreground, #ffffff)",
    buttonText: "var(--background, #0a0a0a)",
    outline: "color-mix(in srgb, var(--foreground, #ffffff) 22%, transparent)",
    toggleBg: "color-mix(in srgb, var(--foreground, #ffffff) 6%, transparent)",
    toggleBorder: "var(--border, rgba(255,255,255,0.12))",
    focus: "color-mix(in srgb, var(--foreground, #ffffff) 35%, transparent)",
  },
};

export function Error404PageSection({
  code = "404",
  heading = "Page not found",
  description = "The page you're looking for doesn't exist or may have been moved.",
  buttonLabel = "Back to Home",
  buttonHref = "/",
  secondaryLabel,
  secondaryHref = "#",
  glitch = true,
  theme = "auto",
  showThemeToggle = false,
  codeSize = 168,
  headingSize = 36,
  descriptionSize = 15,
  className,
  style,
  ...props
}: Error404PageSectionProps) {
  // The toggle overrides the theme prop until the prop itself changes.
  const [state, setState] = React.useState<{ base: Error404Theme; picked: "dark" | "light" | null }>({ base: theme, picked: null });
  if (state.base !== theme) setState({ base: theme, picked: null });
  const active: Error404Theme = state.picked ?? theme;
  const palette = PALETTES[active];
  const isDark = active === "dark";
  const canToggle = showThemeToggle && active !== "auto";

  const scope = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const headingId = `e404-heading-${scope}`;

  // Everything sizes against the section's own width (container query units), so it also works
  // inside narrow previews and columns, not just on narrow viewports.
  const codeFontSize = `min(${codeSize}px, 36cqw)`;
  const headingFontSize = `clamp(24px, 7.5cqw, ${headingSize}px)`;
  const descriptionFontSize = `clamp(14px, 4cqw, ${descriptionSize}px)`;
  const padding = "clamp(48px, 10cqw, 72px) clamp(20px, 5cqw, 40px)";

  return (
    <MotionConfig reducedMotion="user">
      <section
        role="region"
        aria-labelledby={headingId}
        data-e404={scope}
        className={cn("relative flex min-h-[520px] w-full items-center justify-center overflow-hidden", className)}
        style={{ containerType: "inline-size", background: palette.bg, transition: "background-color 0.25s ease", ...style }}
        {...props}
      >
        {canToggle && (
          <button
            type="button"
            onClick={() => setState({ base: theme, picked: isDark ? "light" : "dark" })}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="absolute top-4 left-4 z-50 flex size-10 cursor-pointer items-center justify-center rounded-xl p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: palette.toggleBg, border: `1px solid ${palette.toggleBorder}`, color: palette.title, outlineColor: palette.focus }}
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}

        <div className="w-full" style={{ padding }}>
          <div className="mx-auto w-full max-w-[720px] text-center">
            <div className="relative inline-block" style={{ marginBottom: "clamp(16px, 4cqw, 24px)" }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="relative font-mono font-bold tabular-nums select-none"
                style={{ color: palette.code, fontSize: codeFontSize, lineHeight: 0.85, letterSpacing: "-0.04em" }}
              >
                <span className="relative z-[2]">{code}</span>
                {glitch && (
                  <>
                    <span aria-hidden="true" className="e404-layer e404-a" style={{ color: palette.code }}>
                      {code}
                    </span>
                    <span aria-hidden="true" className="e404-layer e404-b" style={{ color: palette.code }}>
                      {code}
                    </span>
                  </>
                )}
              </motion.div>
            </div>

            <h1 id={headingId} className="m-0 mb-3 font-semibold" style={{ color: palette.title, fontSize: headingFontSize, lineHeight: 1.2, letterSpacing: "-0.03em" }}>
              {heading}
            </h1>

            {description ? (
              <p className="mx-auto mb-7 max-w-[520px]" style={{ color: palette.description, fontSize: descriptionFontSize, lineHeight: 1.6 }}>
                {description}
              </p>
            ) : null}

            {(buttonLabel || secondaryLabel) && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {buttonLabel ? (
                  <a
                    href={buttonHref || "/"}
                    className="inline-flex items-center justify-center rounded-full px-[22px] py-3 text-sm leading-[1.2] font-medium no-underline transition-[opacity,transform] duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
                    style={{ background: palette.buttonBg, color: palette.buttonText, outlineColor: palette.focus }}
                  >
                    {buttonLabel}
                  </a>
                ) : null}
                {secondaryLabel ? (
                  <a
                    href={secondaryHref || "#"}
                    className="inline-flex items-center justify-center rounded-full border px-[22px] py-3 text-sm leading-[1.2] font-medium no-underline transition-[opacity,transform] duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
                    style={{ borderColor: palette.outline, color: palette.title, outlineColor: palette.focus }}
                  >
                    {secondaryLabel}
                  </a>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <style>{`
          [data-e404="${scope}"] .e404-layer { position: absolute; inset: 0; z-index: 1; pointer-events: none; mix-blend-mode: ${active === "light" || active === "auto" ? "multiply" : "screen"}; }
          ${active === "auto" ? `.dark [data-e404="${scope}"] .e404-layer { mix-blend-mode: screen; }` : ""}
          [data-e404="${scope}"] .e404-a { animation: e404-a-${scope} 2.4s infinite linear alternate-reverse; clip-path: inset(12% 0 58% 0); transform: translate(-3px, 0); opacity: 0.55; filter: blur(0.3px); }
          [data-e404="${scope}"] .e404-b { animation: e404-b-${scope} 1.8s infinite linear alternate-reverse; clip-path: inset(62% 0 8% 0); transform: translate(3px, 0); opacity: 0.45; filter: blur(0.4px); }
          @keyframes e404-a-${scope} { 0% { transform: translate(-4px, -1px); clip-path: inset(8% 0 70% 0); } 20% { transform: translate(5px, 0); clip-path: inset(18% 0 46% 0); } 40% { transform: translate(-6px, 1px); clip-path: inset(2% 0 78% 0); } 60% { transform: translate(3px, -1px); clip-path: inset(28% 0 40% 0); } 80% { transform: translate(-2px, 0); clip-path: inset(12% 0 62% 0); } 100% { transform: translate(4px, 1px); clip-path: inset(22% 0 50% 0); } }
          @keyframes e404-b-${scope} { 0% { transform: translate(4px, 1px); clip-path: inset(68% 0 6% 0); } 25% { transform: translate(-5px, 0); clip-path: inset(54% 0 18% 0); } 50% { transform: translate(6px, -1px); clip-path: inset(72% 0 4% 0); } 75% { transform: translate(-3px, 1px); clip-path: inset(60% 0 12% 0); } 100% { transform: translate(2px, 0); clip-path: inset(66% 0 8% 0); } }
          @media (prefers-reduced-motion: reduce) { [data-e404="${scope}"] .e404-layer { display: none; } }
        `}</style>
      </section>
    </MotionConfig>
  );
}
