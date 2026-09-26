"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Instrument_Serif, Manrope } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Manrope({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

const ACCENT = "#118EB5";
const COMPANY = "SummitWorks";
const HEADING = "How SummitWorks cut deploy time by 80%";
const DESCRIPTION = "The engineering team at SummitWorks reduced deployment time from hours to minutes with Nimble’s platform.";
const PUBLISHED = "2026-01-15";
const QUOTE = "Nimble gave us back hours every week. Our team moves faster, ships with confidence, and spends less time on operational overhead.";
const AUTHOR = { name: "Sarah Chen", role: "Head of Engineering, SummitWorks", image: "/demo/55.webp" };

const STATS = [
  { value: "80%", label: "Deploy time reduction" },
  { value: "3x", label: "More deploys per week" },
  { value: "6 weeks", label: "Time to value" },
];

const CHALLENGE =
  "SummitWorks was growing fast, but their deployment processes couldn’t keep up. Manual steps, inconsistent environments, and frequent rollbacks were slowing down the team and creating risk.";
const SOLUTION =
  "By adopting Nimble, SummitWorks automated their CI/CD pipeline, standardized environments, and introduced self-serve deployments. The result was a faster, more reliable release process with less manual work and fewer production issues.";

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: HEADING,
  description: DESCRIPTION,
  inLanguage: "en",
  articleSection: "Software",
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  about: { "@type": "Organization", name: COMPANY },
  citation: { "@type": "Quotation", text: QUOTE, author: { "@type": "Person", name: AUTHOR.name, jobTitle: AUTHOR.role } },
}).replace(/</g, "\\u003c");

function CompanyMark() {
  return (
    <svg width="18" height="7" viewBox="0 0 28 11" fill={ACCENT} aria-hidden="true">
      <path d="M0 0H9.6L14 7.6L18.4 0H28L26.2 3.4H21.4L16.4 10.4L14 11L11.6 10.4L6.6 3.4H1.8Z" />
    </svg>
  );
}

export default function CaseStudyPageView() {
  const reduce = useReducedMotion();

  return (
    <PreviewViewFrame slug="case-study-page">
      <article aria-labelledby="case-study-heading" className={`${sans.className} @container min-h-screen bg-[#0a0a0a] text-white`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        <div className="mx-auto w-full max-w-[1016px] px-5 pt-14 pb-12 @[760px]:px-12 @[760px]:py-[72px]">
          <header className="mb-7 text-center @[760px]:mb-9">
            <div className="mb-[18px] flex items-center justify-center gap-2">
              <CompanyMark />
              <span className="text-[14px] leading-[1.2] font-medium text-white">{COMPANY}</span>
            </div>
            <h1 id="case-study-heading" className={`${serif.className} mx-auto my-0 max-w-[720px] text-[36px] leading-[1.12] font-normal tracking-[-0.035em] text-white @[760px]:text-[52px]`}>
              {HEADING}
            </h1>
            <p className="mx-auto mt-3.5 mb-0 max-w-[520px] text-[16px] leading-[1.6] text-white/55">{DESCRIPTION}</p>
            <time dateTime={PUBLISHED} className="mt-2.5 block text-[13px] leading-[1.35] text-white/45">{PUBLISHED}</time>
          </header>

          <section aria-labelledby="case-study-results" className="mb-8 grid grid-cols-1 gap-[22px] @[760px]:mb-10 @[760px]:grid-cols-3 @[760px]:gap-6">
            <h2 id="case-study-results" className="sr-only">Results</h2>
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...(reduce ? { initial: false as const } : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: i * 0.06 } })}
                className="text-center"
              >
                <div className="mb-2 text-[40px] leading-none font-medium tracking-[-0.04em] text-white">{stat.value}</div>
                <div className="text-[11px] leading-[1.3] font-medium tracking-[0.12em] text-white/40 uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </section>

          <figure className="m-0 mb-10 border-l-[3px] pl-[18px]" style={{ borderColor: ACCENT }}>
            <blockquote className="m-0 max-w-[760px] text-[20px] leading-[1.35] font-normal tracking-[-0.03em] text-white italic @[760px]:text-[24px]">
              <p className="m-0">{`“${QUOTE}”`}</p>
            </blockquote>
            <figcaption className="mt-[18px] flex items-center gap-3">
              <div className="size-10 shrink-0 overflow-hidden rounded-full bg-white/8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={AUTHOR.image} alt={AUTHOR.name} className="size-full object-cover grayscale" />
              </div>
              <div className="text-[13px] leading-[1.35]">
                <div className="text-white">{AUTHOR.name}</div>
                <div className="text-white/45">{AUTHOR.role}</div>
              </div>
            </figcaption>
          </figure>

          <div className="mb-7 grid grid-cols-1 gap-7 @[760px]:mb-9 @[760px]:grid-cols-2 @[760px]:gap-10">
            <section aria-labelledby="case-study-challenge">
              <h2 id="case-study-challenge" className="mx-0 mt-0 mb-2.5 text-[24px] leading-[1.2] font-medium tracking-[-0.02em] text-white">The Challenge</h2>
              <p className="m-0 text-[15px] leading-[1.65] text-white/55">{CHALLENGE}</p>
            </section>
            <section aria-labelledby="case-study-solution">
              <h2 id="case-study-solution" className="mx-0 mt-0 mb-2.5 text-[24px] leading-[1.2] font-medium tracking-[-0.02em] text-white">The Solution</h2>
              <p className="m-0 text-[15px] leading-[1.65] text-white/55">{SOLUTION}</p>
            </section>
          </div>

          <div className="rounded-2xl border border-white/12 px-5 py-7 text-center @[760px]:px-6 @[760px]:py-9">
            <h3 className="mx-0 mt-0 mb-4 text-[22px] leading-[1.3] font-medium tracking-[-0.02em] text-white">Ready to see similar results?</h3>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-white px-[18px] py-2.5 text-[14px] leading-[1.2] font-medium text-[#111] no-underline outline-none transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Get started
              <span aria-hidden="true">{"→"}</span>
            </a>
          </div>
        </div>
      </article>
    </PreviewViewFrame>
  );
}
