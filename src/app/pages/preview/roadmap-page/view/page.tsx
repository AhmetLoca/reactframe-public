"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Instrument_Serif, Manrope } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Manrope({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

type ItemType = "Feature" | "Improvement" | "Fix";
type ItemStatus = "Planned" | "In Progress" | "Shipped";
type FilterTab = "All" | ItemType;

interface RoadmapItem {
  title: string;
  description: string;
  type: ItemType;
  status: ItemStatus;
  votes?: number;
  date?: string;
}

const HEADING = "Roadmap";
const DESCRIPTION = "A live view of what we're building, what we're working on, and what's already shipped.";

const ITEMS: RoadmapItem[] = [
  { title: "Team workspaces", description: "Let organizations create dedicated workspaces with separate settings, members and billing.", type: "Feature", status: "Planned", votes: 124 },
  { title: "Faster search", description: "Improve search relevance and add fuzzy matching for better results.", type: "Improvement", status: "Planned", votes: 87 },
  { title: "Mobile app", description: "Bring the full experience to iOS and Android with offline support and push notifications.", type: "Feature", status: "Planned", votes: 56 },
  { title: "Fix export edge case", description: "Resolve an issue where exports sometimes fail with large datasets.", type: "Fix", status: "Planned", votes: 42 },
  { title: "API rate limiting", description: "Add rate limiting and better error messages for the public API.", type: "Feature", status: "In Progress", date: "2025-05-30" },
  { title: "Onboarding flow", description: "Simplify the onboarding process and reduce friction for new users.", type: "Improvement", status: "In Progress", date: "2025-05-22" },
  { title: "Notification duplicates", description: "Deduplicate notifications when users have multiple devices.", type: "Fix", status: "In Progress", date: "2025-05-20" },
  { title: "SSO integration", description: "Support for SAML and OAuth to enable enterprise single sign-on.", type: "Feature", status: "Shipped", date: "2025-04-28" },
  { title: "Performance optimizations", description: "Reduce bundle size and improve initial load times across the app.", type: "Improvement", status: "Shipped", date: "2025-04-15" },
  { title: "UI rendering glitch", description: "Fix layout issues in the settings page on mobile viewports.", type: "Fix", status: "Shipped", date: "2025-04-10" },
];

const TABS: { key: FilterTab; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Feature", label: "Features" },
  { key: "Improvement", label: "Improvements" },
  { key: "Fix", label: "Fixes" },
];

const COLUMNS: { key: ItemStatus; id: string }[] = [
  { key: "Planned", id: "roadmap-planned" },
  { key: "In Progress", id: "roadmap-progress" },
  { key: "Shipped", id: "roadmap-shipped" },
];

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: HEADING,
  description: DESCRIPTION,
  itemListOrder: "https://schema.org/ItemListUnordered",
  numberOfItems: ITEMS.length,
  itemListElement: ITEMS.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.title,
    description: item.description,
    additionalProperty: [
      { "@type": "PropertyValue", name: "type", value: item.type },
      { "@type": "PropertyValue", name: "status", value: item.status },
    ],
  })),
}).replace(/</g, "\\u003c");

const BADGE: Record<ItemType, string> = {
  Feature: "border border-transparent bg-[rgba(92,184,122,0.22)] text-[#9bdcad]",
  Improvement: "border border-white/18 bg-transparent text-white/78",
  Fix: "border border-transparent bg-white/8 text-white/72",
};

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-white/35";

export default function RoadmapPageView() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = React.useState<FilterTab>("All");
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const visible = filter === "All" ? ITEMS : ITEMS.filter((item) => item.type === filter);

  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + TABS.length) % TABS.length;
    else return;
    event.preventDefault();
    setFilter(TABS[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <PreviewViewFrame slug="roadmap-page">
      <div className={`${sans.className} @container min-h-screen bg-[#0a0a0a] text-white`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        <section aria-labelledby="roadmap-heading" className="mx-auto w-full max-w-[1236px] px-5 py-12 @[860px]:px-7 @[860px]:pt-[62px] @[860px]:pb-[72px]">
          <header className="mb-6 text-center">
            <h1 id="roadmap-heading" className={`${serif.className} m-0 text-[44px] leading-[1.1] font-normal tracking-[-0.035em] text-white @[860px]:text-[60px]`}>{HEADING}</h1>
            <p className="mx-auto mt-3 mb-0 max-w-[520px] text-[16px] leading-[1.6] text-white/55">{DESCRIPTION}</p>
          </header>

          <div role="tablist" aria-label="Filter roadmap items by type" className="mb-9 flex flex-wrap justify-center gap-2.5">
            {TABS.map((tab, i) => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`roadmap-tab-${tab.key}`}
                  aria-selected={active}
                  aria-controls="roadmap-board"
                  tabIndex={active ? 0 : -1}
                  onClick={() => setFilter(tab.key)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-[14px] leading-[1.2] font-medium transition-colors duration-200 ${focusRing} ${
                    active ? "border-transparent bg-white text-[#111]" : "border-white/14 bg-transparent text-white/70 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div id="roadmap-board" role="tabpanel" aria-labelledby={`roadmap-tab-${filter}`} className="grid grid-cols-1 gap-7 @[860px]:grid-cols-3 @[860px]:gap-0">
            {COLUMNS.map((column, columnIndex) => {
              const columnItems = visible.filter((item) => item.status === column.key);
              return (
                <section key={column.key} aria-labelledby={column.id} className={`@[860px]:px-[18px] ${columnIndex > 0 ? "@[860px]:border-l @[860px]:border-white/10" : ""}`}>
                  <div className="mb-3.5 flex items-center gap-2">
                    <h2 id={column.id} className="m-0 text-[22px] leading-[1.2] font-medium tracking-[-0.02em] text-white">{column.key}</h2>
                    <span aria-label={`${columnItems.length} items`} className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-white/8 px-1.5 text-[11px] leading-[1.3] font-medium tracking-[0.02em] text-white/70">{columnItems.length}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {columnItems.map((item, i) => (
                      <motion.article
                        key={item.title}
                        {...(reduce ? { initial: false as const } : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: i * 0.04 } })}
                        className="relative rounded-[14px] border border-white/12 bg-white/[0.025] px-4 pt-4 pb-[18px]"
                      >
                        <span className={`mb-2.5 inline-flex rounded-full px-2 py-[3px] text-[11px] leading-[1.3] font-medium tracking-[0.02em] ${BADGE[item.type]}`}>{item.type}</span>
                        <h3 className={`mx-0 mt-0 mb-1.5 text-[16px] leading-[1.3] font-medium tracking-[-0.01em] text-white ${column.key === "Planned" ? "pr-[54px]" : ""}`}>{item.title}</h3>
                        <p className={`m-0 text-[14px] leading-[1.5] text-white/55 ${column.key === "Planned" ? "pr-[54px]" : ""}`}>{item.description}</p>

                        {column.key === "Planned" && (
                          <div aria-label={`${item.votes ?? 0} votes`} className="absolute right-3.5 bottom-3.5 inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/6 px-2 py-1 text-[11px] leading-[1.3] font-medium tracking-[0.02em] text-white/70">
                            <span aria-hidden="true">&uarr;</span> {item.votes ?? 0}
                          </div>
                        )}

                        {column.key !== "Planned" && item.date && (
                          <p className="mx-0 mt-3 mb-0 text-[11px] leading-[1.3] font-medium tracking-[0.08em] text-white/70 uppercase">
                            {column.key === "Shipped" ? "Shipped " : "Eta "}
                            <time dateTime={item.date}>{item.date}</time>
                          </p>
                        )}
                      </motion.article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </div>
    </PreviewViewFrame>
  );
}
