"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Manrope, Instrument_Serif } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Manrope({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

const YEAR_MARK = "'19";
const FOUNDED = "FOUNDED IN 2019";
const HEADING = "We design interiors that feel as good as they look.";
const DESCRIPTION =
  "We are an interior architecture studio shaping calm, considered spaces for homes, hospitality, and workplaces. Our process blends material honesty, light, and proportion to create rooms that age beautifully and feel deeply lived-in.";

const GALLERY = ["/demo/5.webp", "/demo/6.webp", "/demo/9.webp", "/demo/20.webp"];

const TIMELINE = [
  { year: "2019", title: "The Beginning", body: "We founded Nimbus with a simple idea: better tools for a more thoughtful internet." },
  { year: "2022", title: "Our First Product", body: "We launched our flagship platform, and began working with early customers." },
  { year: "2025", title: "Scaling Our Impact", body: "We grew our team, expanded our product suite, and reached 100K+ active users." },
  { year: "2026", title: "What’s Next", body: "We’re building what’s next more products, more people, and a bigger impact." },
];

const TEAM = [
  { name: "Alex Rivera", image: "/demo/51.webp" },
  { name: "Ji Sun", image: "/demo/42.webp" },
  { name: "Sam Okafor", image: "/demo/53.webp" },
  { name: "Emile Blake", image: "/demo/55.webp" },
  { name: "Daniel Kellen", image: "/demo/pages/about-us/alex-rivera.webp" },
];

export default function AboutUs01PageView() {
  const reduce = useReducedMotion();

  return (
    <PreviewViewFrame slug="about-us-01">
      <section aria-labelledby="about-01-heading" className={`${sans.className} @container flex min-h-screen flex-col bg-[#0a0a0a] text-white`}>
        <div className="grid grid-cols-1 border-b border-white/10 @[800px]:min-h-[280px] @[800px]:grid-cols-[0.336fr_0.664fr]">
          <div className="flex flex-col justify-end px-6 pt-16 pb-7 @[800px]:border-r @[800px]:border-white/10 @[800px]:px-[26px] @[800px]:pt-12 @[800px]:pb-9">
            <div className="mb-[18px] text-[96px] leading-[0.8] font-normal tracking-[-0.06em] text-white @[800px]:text-[140px]">{YEAR_MARK}</div>
            <div className="text-[12px] leading-[1.2] font-medium tracking-[0.14em] text-white/40 uppercase">{FOUNDED}</div>
          </div>

          <div className="flex flex-col justify-end px-6 pt-2 pb-8 @[800px]:px-12 @[800px]:pt-10 @[800px]:pb-9">
            <h1 id="about-01-heading" className={`${serif.className} m-0 max-w-[640px] text-[36px] leading-[1.15] font-normal tracking-[-0.035em] text-white @[800px]:text-[44px]`}>
              {HEADING}
            </h1>
            <p className="mt-4 mb-0 max-w-[560px] text-[16px] leading-[1.6] text-white/55">{DESCRIPTION}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 @[800px]:grid-cols-[1.04fr_1.39fr_1.39fr_1fr]">
          {GALLERY.map((src, i) => (
            <div key={src} className="h-[140px] overflow-hidden bg-[#1a1a1a] @[800px]:h-[257px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading={i < 2 ? "eager" : "lazy"} className="block size-full object-cover" />
            </div>
          ))}
        </div>

        <div className="flex justify-center px-6 py-9 @[800px]:px-20 @[800px]:pt-12 @[800px]:pb-8">
          <ol className="m-0 w-full max-w-[732px] list-none p-0">
            {TIMELINE.map((item, i) => (
              <motion.li
                key={item.year}
                {...(reduce ? { initial: false as const } : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: i * 0.06 } })}
                className="grid grid-cols-[16px_56px_1fr] items-start gap-3 @[800px]:grid-cols-[16px_72px_1fr] @[800px]:gap-[18px]"
              >
                <div className="flex min-h-[73px] flex-col items-center" aria-hidden="true">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-white" />
                  {i < TIMELINE.length - 1 && <span className="mt-1 w-px flex-1 bg-white/[0.18]" />}
                </div>
                <div className="pt-0.5 text-[14px] leading-[1.3] font-normal text-white">{item.year}</div>
                <div className="pb-[22px]">
                  <h2 className="mx-0 mt-0 mb-1 text-[16px] leading-[1.3] font-medium tracking-[-0.01em] text-white">{item.title}</h2>
                  <p className="m-0 text-[14px] leading-[1.55] text-white/55">{item.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col items-center px-6 pt-2 pb-10 @[800px]:px-10 @[800px]:pb-12">
          <div className="flex justify-center pl-[18px]">
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                title={member.name}
                className="relative -ml-[18px] size-16 overflow-hidden rounded-full border-[3px] border-[#0a0a0a] bg-[#222] @[800px]:size-[84px]"
                style={{ zIndex: TEAM.length - i }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={member.image} alt={member.name} loading="lazy" className="size-full object-cover" />
              </div>
            ))}
          </div>
          <p className="mt-3.5 mb-0 text-center text-[11px] leading-[1.4] font-medium tracking-[0.08em] text-white/40 uppercase">{TEAM.map((m) => m.name).join(" · ")}</p>
        </div>
      </section>
    </PreviewViewFrame>
  );
}
