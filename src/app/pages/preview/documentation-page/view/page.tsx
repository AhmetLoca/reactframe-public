"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Instrument_Serif, Manrope } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Manrope({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

type TopicIcon = "rocket" | "layers" | "blocks" | "code" | "book" | "help";

const HEADING = "Documentation";
const DESCRIPTION = "Everything you need to build, ship, and scale with Nova.";

const TOPICS: { title: string; description: string; icon: TopicIcon; url: string }[] = [
  { title: "Getting Started", description: "Set up your project, install dependencies, and get running in minutes.", icon: "rocket", url: "#" },
  { title: "Components", description: "Explore our UI components and learn how to customize them.", icon: "layers", url: "#" },
  { title: "Blocks", description: "Pre-built page sections and layout blocks to speed up your workflow.", icon: "blocks", url: "#" },
  { title: "API", description: "Integrate with our platform using a simple and powerful API.", icon: "code", url: "#" },
  { title: "Guides", description: "Step-by-step tutorials and best practices for common use cases.", icon: "book", url: "#" },
  { title: "FAQ", description: "Find answers to the most common questions about Nova.", icon: "help", url: "#" },
];

const ARTICLES = [
  { title: "Quick start: Set up your project", category: "GETTING STARTED", url: "#" },
  { title: "Use and customize components", category: "COMPONENTS", url: "#" },
  { title: "Build a landing page with blocks", category: "BLOCKS", url: "#" },
  { title: "Authentication with the API", category: "API", url: "#" },
  { title: "Deployment and production checklist", category: "GUIDES", url: "#" },
];

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: HEADING,
  description: DESCRIPTION,
  hasPart: [
    ...TOPICS.map((t) => ({ "@type": "WebPage", name: t.title, description: t.description })),
    ...ARTICLES.map((a) => ({ "@type": "Article", headline: a.title, articleSection: a.category })),
  ],
}).replace(/</g, "\\u003c");

function TopicIconView({ type }: { type: TopicIcon }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (type === "layers")
    return (
      <svg {...common}>
        <path d="M12 3l8 4.5-8 4.5L4 7.5 12 3zM4 12.5L12 17l8-4.5M4 16.5L12 21l8-4.5" />
      </svg>
    );
  if (type === "blocks")
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1.2" />
        <rect x="14" y="3" width="7" height="7" rx="1.2" />
        <rect x="3" y="14" width="7" height="7" rx="1.2" />
        <rect x="14" y="14" width="7" height="7" rx="1.2" />
      </svg>
    );
  if (type === "code")
    return (
      <svg {...common}>
        <path d="M8 8L4 12l4 4M16 8l4 4-4 4" />
      </svg>
    );
  if (type === "book")
    return (
      <svg {...common}>
        <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z" />
        <path d="M6 3v16" />
      </svg>
    );
  if (type === "help")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.6 9.4a2.4 2.4 0 1 1 3.3 2.2c-.7.3-1.1.8-1.1 1.6V14" />
        <circle cx="12" cy="17" r="0.7" fill="currentColor" stroke="none" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M5 19l3.2-8.4L12 5l3.8 5.6L19 19" />
      <path d="M9 14h6" />
    </svg>
  );
}

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-white/35";

export default function DocumentationPageView() {
  const reduce = useReducedMotion();
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const q = query.trim().toLowerCase();
  const topics = React.useMemo(() => (q ? TOPICS.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) : TOPICS), [q]);
  const articles = React.useMemo(() => (q ? ARTICLES.filter((a) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)) : ARTICLES), [q]);

  const enter = (y: number, duration: number, delay: number) =>
    reduce ? { initial: false as const } : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration, delay } };

  return (
    <PreviewViewFrame slug="documentation-page">
      <div className={`${sans.className} @container min-h-screen bg-[#0a0a0a] text-white`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        <section aria-labelledby="docs-heading" className="mx-auto w-full max-w-[1060px] px-5 py-12 @[760px]:px-10 @[760px]:pt-[68px] @[760px]:pb-[72px]">
          <header className="mb-[22px] text-center">
            <h1 id="docs-heading" className={`${serif.className} m-0 text-[48px] leading-[1.1] font-normal tracking-[-0.035em] text-white @[760px]:text-[56px]`}>
              {HEADING}
            </h1>
            <p className="mx-auto mt-3 mb-0 max-w-[520px] text-[16px] leading-[1.6] text-white/55">{DESCRIPTION}</p>
          </header>

          <form role="search" aria-label="Search documentation" onSubmit={(e) => e.preventDefault()} className="relative mx-auto mb-7 w-full max-w-[560px]">
            <label className="flex w-full items-center gap-3 rounded-full border border-white/12 bg-white/4 py-3 pr-3.5 pl-4 focus-within:ring-2 focus-within:ring-white/35">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.7" />
                <path d="M16.5 16.5L21 21" stroke="rgba(255,255,255,0.35)" strokeLinecap="round" strokeWidth="1.7" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation..."
                aria-label="Search documentation"
                aria-describedby="docs-search-status"
                autoComplete="off"
                className="w-full border-none bg-transparent text-[14px] leading-[1.4] text-white outline-none placeholder:text-white/35 [&::-webkit-search-cancel-button]:hidden"
              />
              <span aria-hidden="true" className="rounded-lg border border-white/12 bg-white/6 px-[7px] py-1 text-[11px] leading-[1.2] font-medium tracking-[0.08em] whitespace-nowrap text-white/35">⌘K</span>
            </label>
            <p id="docs-search-status" aria-live="polite" className="sr-only">
              {q ? `${topics.length} topics, ${articles.length} articles` : "Showing all documentation"}
            </p>
          </form>

          {topics.length > 0 ? (
            <div role="list" aria-label="Documentation topics" className="mb-10 grid grid-cols-1 gap-3.5 @[760px]:grid-cols-3">
              {topics.map((topic, i) => (
                <motion.a
                  key={topic.title}
                  href={topic.url}
                  role="listitem"
                  {...enter(12, 0.35, i * 0.04)}
                  className={`block rounded-2xl border border-white/12 bg-white/[0.025] px-5 py-[22px] text-inherit no-underline transition-[background-color,transform] duration-200 hover:-translate-y-[3px] hover:bg-white/5 ${focusRing}`}
                >
                  <div className="mb-[15px] text-white/85">
                    <TopicIconView type={topic.icon} />
                  </div>
                  <h2 className="mx-0 mt-0 mb-2 text-[18px] leading-[1.3] font-normal tracking-[-0.02em] text-white">{topic.title}</h2>
                  <p className="m-0 text-[14px] leading-[1.55] text-white/55">{topic.description}</p>
                </motion.a>
              ))}
            </div>
          ) : (
            <p role="status" className="mb-10 text-[14px] text-white/55">No matching topics.</p>
          )}

          <div>
            <h2 id="popular-articles-heading" className="mx-0 mt-0 mb-2 text-[22px] leading-[1.2] font-medium tracking-[-0.02em] text-white">Popular Articles</h2>
            {articles.length === 0 ? (
              <p role="status" className="text-[14px] text-white/55">No matching articles.</p>
            ) : (
              <div role="list" aria-labelledby="popular-articles-heading">
                {articles.map((article, i) => (
                  <motion.a
                    key={article.title}
                    href={article.url}
                    role="listitem"
                    {...enter(8, 0.3, 0.08 + i * 0.03)}
                    className={`group flex items-center justify-between gap-4 border-b border-white/10 px-0.5 py-4 text-inherit no-underline transition-colors duration-200 hover:bg-white/5 @[760px]:px-1 @[760px]:py-[18px] ${focusRing}`}
                  >
                    <span className="min-w-0 flex-1 text-[15px] leading-[1.4] font-normal tracking-[-0.01em] text-white">{article.title}</span>
                    <span className="inline-flex shrink-0 items-center gap-2.5">
                      <span className="rounded-lg bg-white/7 px-2.5 py-1.5 text-[11px] leading-[1.2] font-medium tracking-[0.08em] whitespace-nowrap text-white/[0.58] uppercase">{article.category}</span>
                      <span aria-hidden="true" className="inline-flex size-7 items-center justify-center text-white/[0.78] transition-[transform,color] duration-200 group-hover:translate-x-[3px] group-hover:text-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M9 5.5L16.5 12L9 18.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </span>
                  </motion.a>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PreviewViewFrame>
  );
}
