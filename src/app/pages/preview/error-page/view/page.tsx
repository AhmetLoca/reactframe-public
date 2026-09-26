"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Instrument_Serif, Manrope } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Manrope({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

const HEADING = "This page took a wrong turn";
const DESCRIPTION = "The page you're looking for doesn't exist or has moved. Try a search, or head to one of these instead.";

const LINKS = [
  { label: "Home", hint: "Back to the start" },
  { label: "Components", hint: "Browse the library" },
  { label: "Pricing", hint: "Plans and billing" },
  { label: "Support", hint: "Talk to a person" },
];

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "404, Page not found",
  description: DESCRIPTION,
}).replace(/</g, "\\u003c");

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-white/35";

export default function ErrorPageView() {
  const reduce = useReducedMotion();
  const uid = React.useId();
  const [query, setQuery] = React.useState("");
  const [searched, setSearched] = React.useState("");

  return (
    <PreviewViewFrame slug="error-page">
      <div className={`${sans.className} @container relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.09),transparent_60%)]" />

        <section aria-labelledby="error-heading" className="relative mx-auto flex min-h-screen w-full max-w-[720px] flex-col items-center justify-center px-5 py-16 text-center @[700px]:px-10">
          <motion.p
            aria-hidden="true"
            {...(reduce ? { initial: false as const } : { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5 } })}
            className={`${serif.className} m-0 bg-gradient-to-b from-white to-white/10 bg-clip-text text-[120px] leading-[0.95] font-normal tracking-[-0.05em] text-transparent @[700px]:text-[200px]`}
          >
            404
          </motion.p>

          <h1 id="error-heading" className={`${serif.className} mt-2 mb-0 text-[32px] leading-[1.15] font-normal tracking-[-0.03em] text-white @[700px]:text-[44px]`}>{HEADING}</h1>
          <p className="mx-auto mt-3.5 mb-0 max-w-[460px] text-[16px] leading-[1.65] text-white/55">{DESCRIPTION}</p>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              setSearched(query.trim());
            }}
            className="mt-8 flex w-full max-w-[420px] gap-2"
          >
            <label htmlFor={`${uid}-search`} className="sr-only">Search the site</label>
            <input
              id={`${uid}-search`}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the site"
              className={`min-w-0 flex-1 rounded-full border border-white/14 bg-white/[0.03] px-4 py-3 text-[15px] leading-[1.4] text-white placeholder:text-white/30 ${focusRing}`}
            />
            <button type="submit" className={`cursor-pointer rounded-full border-0 bg-white px-5 py-3 text-[15px] leading-none font-semibold text-[#111] transition-opacity duration-150 hover:opacity-85 ${focusRing}`}>Search</button>
          </form>
          <p role="status" className="mt-3 mb-0 min-h-[20px] text-[13px] text-white/45">{searched ? `No results for “${searched}” in this preview.` : ""}</p>

          <nav aria-label="Helpful links" className="mt-6 grid w-full grid-cols-2 gap-3 @[700px]:grid-cols-4">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={`#${link.label.toLowerCase()}`}
                onClick={(e) => e.preventDefault()}
                className={`rounded-[14px] border border-white/12 bg-white/[0.02] px-4 py-3.5 text-left transition-colors duration-150 hover:bg-white/[0.06] ${focusRing}`}
              >
                <span className="block text-[15px] leading-[1.3] font-medium text-white">{link.label}</span>
                <span className="mt-1 block text-[13px] leading-[1.4] text-white/45">{link.hint}</span>
              </a>
            ))}
          </nav>
        </section>
      </div>
    </PreviewViewFrame>
  );
}
