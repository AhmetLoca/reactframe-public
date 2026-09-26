"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Inter } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Inter({ subsets: ["latin"], display: "swap" });

const HEADING = "Build what's next. Together.";
const DESCRIPTION = "We're a small team of builders, designers and problem-solvers, working on meaningful products for a more open internet.";
const HERO_IMAGE = "/demo/9.webp";

const VALUES = ["Remote-first", "Async by default", "Ownership", "Craft over speed", "Build for users"];

const LIFE_IMAGES = ["/demo/4.webp", "/demo/2.webp", "/demo/19.webp", "/demo/7.webp", "/demo/3.webp"];

const JOBS = [
  { title: "Senior Frontend Engineer", department: "Engineering", location: "San Francisco, CA", type: "Full-time", url: "#" },
  { title: "Backend Engineer", department: "Engineering", location: "New York, NY", type: "Full-time", url: "#" },
  { title: "DevOps Engineer", department: "Engineering", location: "Remote", type: "Full-time", url: "#" },
  { title: "Full Stack Engineer", department: "Engineering", location: "Berlin, Germany", type: "Full-time", url: "#" },
  { title: "Engineering Manager", department: "Engineering", location: "San Francisco, CA", type: "Full-time", url: "#" },
  { title: "Product Designer", department: "Design", location: "New York, NY", type: "Full-time", url: "#" },
  { title: "Account Executive", department: "Sales", location: "Remote", type: "Full-time", url: "#" },
];

const DEPARTMENTS = ["All", ...Array.from(new Set(JOBS.map((j) => j.department)))];

// Desktop grid placement for the five gallery tiles.
const LIFE_TILE_CLASS = [
  "@[820px]:col-start-1 @[820px]:row-span-2 @[820px]:row-start-1",
  "@[820px]:col-start-2 @[820px]:row-start-1",
  "@[820px]:col-start-2 @[820px]:row-start-2",
  "@[820px]:col-start-3 @[820px]:row-span-2 @[820px]:row-start-1",
  "@[820px]:col-start-4 @[820px]:row-span-2 @[820px]:row-start-1",
];

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: HEADING,
  description: DESCRIPTION,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: JOBS.map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "JobPosting", title: job.title, industry: job.department, employmentType: "FULL_TIME", jobLocation: { "@type": "Place", name: job.location } },
    })),
  },
}).replace(/</g, "\\u003c");

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-white/35";

export default function CareerPage02View() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = React.useState("Engineering");
  const visibleJobs = filter === "All" ? JOBS : JOBS.filter((j) => j.department === filter);
  const marquee = [...VALUES, ...VALUES, ...VALUES];

  return (
    <PreviewViewFrame slug="career-page-02">
      <section aria-labelledby="career-02-heading" className={`${sans.className} @container min-h-screen bg-[#0a0a0a] text-white`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />

        <div className="relative flex min-h-[280px] flex-col justify-end overflow-hidden bg-[#111] px-5 py-7 @[820px]:min-h-[360px] @[820px]:px-[38px] @[820px]:pt-10 @[820px]:pb-9">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMAGE} alt="" fetchPriority="high" className="absolute inset-0 size-full object-cover grayscale" />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.55) 100%)" }} />
          <h1 id="career-02-heading" className="relative z-10 m-0 max-w-[720px] text-[36px] leading-[1.1] font-medium tracking-[-0.035em] text-white @[820px]:text-[48px]">{HEADING}</h1>
          <p className="relative z-10 mt-3 mb-0 max-w-[520px] text-[16px] leading-[1.55] text-white/[0.72]">{DESCRIPTION}</p>
        </div>

        <div className="overflow-hidden border-b border-white/10 pt-3.5 pb-[18px] @[820px]:pt-4 @[820px]:pb-5" aria-label="Our values">
          <motion.div
            className="flex w-max gap-2.5"
            {...(reduce ? {} : { animate: { x: ["0%", "-33.333%"] }, transition: { duration: 28, ease: "linear", repeat: Infinity } })}
          >
            {marquee.map((label, i) => (
              <span key={`${label}-${i}`} className="inline-flex items-center gap-2.5" aria-hidden={i >= VALUES.length ? true : undefined}>
                <span className="rounded-full border border-white/16 px-3 py-1.5 text-[13px] leading-[1.2] whitespace-nowrap text-white/[0.72]">{label}</span>
                <span className="text-white/[0.42]">&middot;</span>
              </span>
            ))}
          </motion.div>
        </div>

        <div className="px-5 pt-6 pb-3 @[820px]:px-[38px] @[820px]:pt-7 @[820px]:pb-4">
          <h2 className="mx-0 mt-0 mb-3.5 text-[28px] leading-[1.2] font-medium tracking-[-0.02em] text-white">Life Here</h2>
          <div className="grid grid-cols-1 auto-rows-[160px] gap-2.5 @[820px]:grid-cols-[1.15fr_1fr_0.72fr_0.72fr] @[820px]:grid-rows-[118px_118px]">
            {LIFE_IMAGES.map((src, i) => (
              <div key={src} className={`overflow-hidden rounded-[10px] bg-[#1a1a1a] ${LIFE_TILE_CLASS[i]}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="block size-full object-cover grayscale" />
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 pt-5 pb-10 @[820px]:px-[38px] @[820px]:pt-6 @[820px]:pb-12">
          <h2 className="mx-0 mt-0 mb-3.5 text-[28px] leading-[1.2] font-medium tracking-[-0.02em] text-white">Open Positions</h2>

          <div role="group" aria-label="Filter positions by department" className="mb-2 flex flex-wrap gap-2">
            {DEPARTMENTS.map((department) => {
              const active = filter === department;
              return (
                <button
                  key={department}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(department)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-[13px] leading-[1.2] transition-colors duration-150 ${focusRing} ${
                    active ? "border-transparent bg-white text-[#111]" : "border-white/16 bg-transparent text-white/[0.72] hover:text-white"
                  }`}
                >
                  {department}
                </button>
              );
            })}
          </div>

          <div role="list" aria-live="polite">
            {visibleJobs.map((job) => (
              <a
                key={job.title}
                href={job.url}
                role="listitem"
                className={`group grid grid-cols-[1fr_auto] items-center gap-3 border-b border-white/10 px-1 py-4 text-inherit no-underline transition-colors duration-200 hover:bg-white/4 @[820px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_24px] ${focusRing}`}
              >
                <span className="text-[16px] leading-[1.3] font-normal tracking-[-0.01em] text-white">{job.title}</span>
                <span className="hidden text-[13px] leading-[1.3] text-white/[0.42] @[820px]:inline">{job.location} &middot; {job.type}</span>
                <span aria-hidden="true" className="justify-self-end text-[16px] leading-[1.3] text-white/[0.42] transition-transform duration-200 group-hover:translate-x-[3px]">&rarr;</span>
                <span className="col-span-2 -mt-2 text-[13px] leading-[1.3] text-white/[0.42] @[820px]:hidden">{job.location} &middot; {job.type}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </PreviewViewFrame>
  );
}
