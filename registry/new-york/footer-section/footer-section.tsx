"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FooterSectionTheme = "paper" | "glass" | "custom";

export interface FooterSectionLink {
  label: string;
  url: string;
}

export interface FooterSectionColumn {
  title: string;
  links: FooterSectionLink[];
}

export interface FooterSectionCustomColors {
  bg?: string;
  fg?: string;
  headingColor?: string;
  linkColor?: string;
  copyrightColor?: string;
  createdByColor?: string;
}

export interface FooterSectionProps {
  theme?: FooterSectionTheme;
  customColors?: FooterSectionCustomColors;
  columns?: FooterSectionColumn[];
  accentColor?: string;
  hoverUnderline?: boolean;
  copyrightText?: string;
  createdByText?: string;
  createdByUrl?: string;
  className?: string;
}

const DEFAULT_COLUMNS: FooterSectionColumn[] = [
  { title: "Navigate", links: [{ label: "Home", url: "#" }, { label: "About", url: "#" }, { label: "Services", url: "#" }, { label: "Team", url: "#" }] },
  { title: "Resources", links: [{ label: "Case Studies", url: "#" }, { label: "How We Work", url: "#" }, { label: "FAQ", url: "#" }, { label: "News", url: "#" }] },
  { title: "Connect", links: [{ label: "Book a Call", url: "#" }, { label: "Twitter", url: "#" }, { label: "Instagram", url: "#" }] },
  { title: "Legal", links: [{ label: "Privacy Policy", url: "#" }, { label: "Terms of Service", url: "#" }, { label: "Cookie Policy", url: "#" }] },
];

function FooterLinkItem({ link, fg, accentColor, showUnderline }: { link: FooterSectionLink; fg?: string; accentColor: string; showUnderline: boolean }) {
  const [active, setActive] = React.useState(false);
  const color = showUnderline ? fg : active ? accentColor : fg;
  return (
    <a
      href={link.url}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className={cn("relative inline-flex w-fit pb-0.5 text-sm no-underline outline-none", !color && "text-[#f5f4f1]/60")}
      style={{ color, boxShadow: active ? `0 0 0 2px ${accentColor}40` : "none", borderRadius: 2, transition: "color 200ms ease, box-shadow 150ms ease" }}
    >
      {link.label}
      {showUnderline && (
        <span
          className="absolute bottom-0 left-0 h-px w-full origin-left transition-transform duration-300"
          style={{ background: accentColor, transform: active ? "scaleX(1)" : "scaleX(0)", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
        />
      )}
    </a>
  );
}

function CreatedByLink({ text, url, fg }: { text: string; url: string; fg?: string }) {
  const [active, setActive] = React.useState(false);
  return (
    <a
      href={url}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className={cn("text-[13px] no-underline outline-none", !fg && (active ? "text-[#f5f4f1]" : "text-[#f5f4f1]/60"))}
      style={{ color: fg, boxShadow: active ? `0 0 0 2px color-mix(in srgb, currentColor 19%, transparent)` : "none", borderRadius: 2, transition: "color 200ms ease, box-shadow 150ms ease" }}
    >
      {text}
    </a>
  );
}

export function FooterSection({
  theme = "paper",
  customColors,
  columns = DEFAULT_COLUMNS,
  accentColor = "#c44b2b",
  hoverUnderline = true,
  copyrightText = "© 2026 Studio. All rights reserved.",
  createdByText = "Built with ReactFrame",
  createdByUrl = "https://reactframe.com",
  className,
}: FooterSectionProps) {
  const isCustom = theme === "custom";
  const isGlass = theme === "glass";
  const cc = isCustom ? customColors : undefined;

  return (
    <footer
      role="contentinfo"
      className={cn(
        "relative w-full",
        !isCustom && !isGlass && "bg-[#0e0e0e] text-[#f5f4f1]",
        isGlass && "text-[#f5f4f1]",
        className,
      )}
      style={{
        transition: "background-color 600ms cubic-bezier(0.16, 1, 0.3, 1), color 600ms cubic-bezier(0.16, 1, 0.3, 1)",
        ...(isCustom ? { background: customColors?.bg ?? "#1a1a2e", color: customColors?.fg ?? "#ffffff" } : undefined),
        ...(isGlass && {
          backgroundColor: "rgba(14,14,14,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(245,244,241,0.08)",
        }),
      }}
    >
      <div className="mx-auto max-w-[1280px] px-6 py-12 sm:px-12 sm:py-16">
        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:flex sm:justify-between sm:gap-8">
          {columns.map((group, gi) => (
            <div key={gi} className="flex flex-col">
              <h2 className="m-0 mb-[18px] text-[15px] font-semibold tracking-[-0.01em]" style={{ color: cc?.headingColor }}>
                {group.title}
              </h2>
              <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
                {group.links.map((link, li) => (
                  <li key={li}>
                    <FooterLinkItem link={link} fg={cc?.linkColor} accentColor={accentColor} showUnderline={hoverUnderline} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={cn("mt-12 flex flex-col items-start justify-between gap-2 border-t pt-6 sm:mt-14 sm:flex-row sm:items-center sm:gap-0", !isCustom && "border-[#f5f4f1]/8")} style={isCustom ? { borderColor: `${customColors?.fg ?? "#ffffff"}14` } : undefined}>
          <span className={cn("text-[13px]", !cc?.copyrightColor && "text-[#f5f4f1]/45")} style={{ color: cc?.copyrightColor }}>
            {copyrightText}
          </span>
          {createdByText && <CreatedByLink text={createdByText} url={createdByUrl} fg={cc?.createdByColor} />}
        </div>
      </div>

          </footer>
  );
}
