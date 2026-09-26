"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Instrument_Serif, Manrope } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Manrope({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

type IconName = "people" | "bulb" | "code" | "star";

const ORG = "Our Company";
const HEADING = "Build the future of design engineering.";
const DESCRIPTION =
  "We’re looking for curious, builder-minded people to help us create tools and experiences that make design and engineering work better together.";

const VALUES: { icon: IconName; title: string; description: string }[] = [
  { icon: "people", title: "Better Together", description: "We move faster and build stronger as a team." },
  { icon: "bulb", title: "Think Deeply", description: "We value thoughtful work, not just quick wins." },
  { icon: "code", title: "Ship Often", description: "Progress comes from iteration, not perfection." },
  { icon: "star", title: "Build for Impact", description: "We create tools that empower more people." },
];

const POSITIONS = [
  { title: "Senior Frontend Engineer", department: "Engineering", location: "San Francisco, CA", url: "#" },
  { title: "Product Designer", department: "Design", location: "New York, NY", url: "#" },
  { title: "Full Stack Engineer", department: "Engineering", location: "Remote", url: "#" },
  { title: "Design Systems Engineer", department: "Engineering", location: "San Francisco, CA", url: "#" },
  { title: "UX Researcher", department: "Design", location: "New York, NY", url: "#" },
  { title: "Backend Engineer", department: "Engineering", location: "Remote", url: "#" },
];

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: HEADING,
  description: DESCRIPTION,
  publisher: { "@type": "Organization", name: ORG },
  mainEntity: {
    "@type": "ItemList",
    name: "Open Positions",
    numberOfItems: POSITIONS.length,
    itemListElement: POSITIONS.map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "JobPosting",
        title: job.title,
        industry: job.department,
        employmentType: "FULL_TIME",
        hiringOrganization: { "@type": "Organization", name: ORG },
        jobLocation: { "@type": "Place", name: job.location },
      },
    })),
  },
}).replace(/</g, "\\u003c");

function ValueIcon({ type }: { type: IconName }) {
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
    focusable: false,
  };
  if (type === "bulb")
    return (
      <svg {...common}>
        <path d="M9 18h6M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.6V16h8v-1.4A7 7 0 0 0 12 2z" />
      </svg>
    );
  if (type === "code")
    return (
      <svg {...common}>
        <path d="M8 8L4 12l4 4M16 8l4 4-4 4" />
      </svg>
    );
  if (type === "star")
    return (
      <svg {...common}>
        <path d="M12 3l2.4 4.9L20 9l-4 3.9.9 5.6L12 16.3 7.1 18.5 8 12.9 4 9l5.6-1.1L12 3z" />
      </svg>
    );
  return (
    <svg {...common}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.4" />
      <path d="M4 19a5 5 0 0 1 10 0M14 19a4 4 0 0 1 6 0" />
    </svg>
  );
}

export default function CareerPage01View() {
  const reduce = useReducedMotion();
  const enter = (y: number, duration: number, delay: number) =>
    reduce ? { initial: false as const } : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration, delay } };

  return (
    <PreviewViewFrame slug="career-page-01">
      <div className={`${sans.className} @container min-h-screen bg-[#0a0a0a] text-white`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        <section aria-labelledby="career-heading" className="mx-auto w-full max-w-[1170px] px-5 py-12 @[800px]:px-12 @[800px]:pt-[63px] @[800px]:pb-[72px]">
          <header className="mb-10 text-center @[800px]:mb-14">
            <p className="m-0 mb-[18px] text-[12px] leading-[1.2] font-medium tracking-[0.16em] text-white/40 uppercase">WE&apos;RE HIRING</p>
            <h1 id="career-heading" className={`${serif.className} mx-auto my-0 max-w-[720px] text-[40px] leading-[1.12] font-normal tracking-[-0.035em] text-white @[800px]:text-[56px]`}>
              {HEADING}
            </h1>
            <p className="mx-auto mt-4 mb-0 max-w-[560px] text-[16px] leading-[1.6] text-white/55">{DESCRIPTION}</p>
          </header>

          <div className="mb-11 @[800px]:mb-14">
            <h2 id="career-values-heading" className="mx-0 mt-0 mb-[18px] text-[28px] leading-[1.2] font-medium tracking-[-0.02em] text-white">Our Values</h2>
            <div role="list" aria-labelledby="career-values-heading" className="grid grid-cols-1 gap-3.5 @[800px]:grid-cols-4">
              {VALUES.map((item, i) => (
                <motion.article
                  key={item.title}
                  role="listitem"
                  {...enter(14, 0.4, i * 0.06)}
                  className="rounded-[14px] border border-white/12 bg-white/2 px-4 py-[18px] @[800px]:px-[18px] @[800px]:py-[22px]"
                >
                  <div className="mb-3.5 text-white/85">
                    <ValueIcon type={item.icon} />
                  </div>
                  <h3 className="mx-0 mt-0 mb-2 text-[16px] leading-[1.3] font-medium tracking-[-0.01em] text-white">{item.title}</h3>
                  <p className="m-0 text-[14px] leading-[1.5] text-white/55">{item.description}</p>
                </motion.article>
              ))}
            </div>
          </div>

          <div>
            <h2 id="career-positions-heading" className="mx-0 mt-0 mb-2 text-[28px] leading-[1.2] font-medium tracking-[-0.02em] text-white">Open Positions</h2>
            <ol aria-labelledby="career-positions-heading" className="m-0 list-none p-0">
              {POSITIONS.map((job, i) => (
                <motion.li key={job.title} {...enter(12, 0.4, 0.08 + i * 0.04)} className="border-b border-white/10 transition-colors duration-200 hover:bg-white/5">
                  <a
                    href={job.url}
                    aria-label={`View ${job.title}, ${job.department}, ${job.location} role`}
                    className="group grid grid-cols-[1fr_auto] items-center gap-3 px-2 py-4 text-inherit no-underline outline-none focus-visible:ring-2 focus-visible:ring-white/35 @[800px]:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_24px] @[800px]:px-3 @[800px]:py-[18px]"
                  >
                    <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                      <span className="text-[16px] leading-[1.3] font-medium tracking-[-0.01em] text-white">{job.title}</span>
                      <span className="rounded-full border border-white/16 px-2 py-[3px] text-[13px] leading-[1.3] whitespace-nowrap text-white/55">{job.department}</span>
                    </div>
                    <span className="hidden text-[13px] leading-[1.3] text-white/40 @[800px]:inline">{job.location}</span>
                    <span aria-hidden="true" className="inline-flex items-center justify-self-end text-white/40 transition-transform duration-200 group-hover:translate-x-[3px]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                        <path d="M5 12h14" />
                        <path d="M13 6l6 6-6 6" />
                      </svg>
                    </span>
                    <span className="col-span-2 -mt-2 pb-1 text-[13px] leading-[1.3] text-white/40 @[800px]:hidden">{job.location}</span>
                  </a>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </PreviewViewFrame>
  );
}
