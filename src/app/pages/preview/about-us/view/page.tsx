"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Instrument_Serif, Manrope } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Manrope({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

const ORG = "Verdant";
const LABEL = "OUR STORY";
const HEADING = "We’re building a greener future for a healthier planet.";
const STORY =
  "By creating sustainable solutions and smarter technology, we help reduce environmental impact and build a cleaner, brighter tomorrow.";
const HERO_IMAGE = "/demo/pages/about-us/hero.webp";

const STATS = [
  { value: "4", label: "Years of impact" },
  { value: "120+", label: "Trees planted" },
  { value: "250K+", label: "Liters of water saved" },
];

const TEAM = [
  { name: "Alex Rivera", role: "Founder & CEO", image: "/demo/pages/about-us/alex-rivera.webp" },
  { name: "Jordan Lee", role: "Co-Founder & CTO", image: "/demo/51.webp" },
  { name: "Morgan Chen", role: "Head of Product", image: "/demo/pages/about-us/morgan-chen.webp" },
  { name: "Emile Brooks", role: "Head of Design", image: "/demo/pages/about-us/emile-brooks.webp" },
  { name: "Casey Patel", role: "Manager", image: "/demo/42.webp" },
  { name: "Riley Kim", role: "Marketing Lead", image: "/demo/50.webp" },
];

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: HEADING,
  headline: HEADING,
  description: STORY,
  about: ORG,
  primaryImageOfPage: HERO_IMAGE,
  mainEntity: {
    "@type": "Organization",
    name: ORG,
    description: STORY,
    member: TEAM.map((m) => ({ "@type": "Person", name: m.name, jobTitle: m.role, image: m.image })),
  },
}).replace(/</g, "\\u003c");

const eyebrow = "m-0 mb-[18px] text-[12px] leading-[1.2] font-medium tracking-[0.14em] text-white/40 uppercase";

export default function AboutUsPageView() {
  const reduce = useReducedMotion();
  const enter = (y: number, duration: number, delay: number) =>
    reduce
      ? { initial: false as const }
      : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration, delay } };

  return (
    <PreviewViewFrame slug="about-us">
      <div className={`${sans.className} @container min-h-screen bg-[#0a0a0a] text-white`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        <section aria-labelledby="about-us-heading" className="mx-auto flex w-full max-w-[1184px] justify-center px-5 py-12 @[700px]:px-8 @[700px]:pt-10 @[700px]:pb-10">
          <div className="w-full max-w-[1120px]">
            <p className={eyebrow}>{LABEL}</p>

            <h1 id="about-us-heading" className={`${serif.className} m-0 max-w-full text-[44px] leading-[1.12] font-normal tracking-[-0.04em] text-white @[700px]:max-w-[720px] @[700px]:text-[72px]`}>
              {HEADING}
            </h1>

            <motion.div
              {...enter(18, 0.5, 0.08)}
              className="mt-6 h-[202px] w-full overflow-hidden rounded-2xl bg-[#1a1a1a] @[700px]:mt-8 @[700px]:h-[280px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO_IMAGE} alt="Rolling green hills with wildflowers and a large tree" decoding="async" fetchPriority="high" className="block size-full object-cover" />
            </motion.div>

            <div className="mt-7 grid grid-cols-1 items-start gap-8 @[700px]:mt-10 @[700px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @[700px]:gap-12">
              <p className="m-0 max-w-[520px] text-[15px] leading-[1.65] text-white/55">{STORY}</p>

              <ul aria-label={`${ORG} statistics`} className="m-0 grid list-none grid-cols-3 gap-5 p-0 @[700px]:gap-6">
                {STATS.map((stat, i) => (
                  <motion.li key={stat.label} {...enter(12, 0.4, 0.12 + i * 0.06)} className="text-left @[700px]:text-center">
                    <div className="mb-2 text-[40px] leading-none font-light tracking-[-0.04em] text-white max-[420px]:text-[32px]">{stat.value}</div>
                    <div className="text-[11px] leading-[1.3] font-medium tracking-[0.12em] text-white/40 uppercase">{stat.label}</div>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="mt-12 @[700px]:mt-16">
              <p className={eyebrow}>THE TEAM</p>

              <ul aria-label={`${ORG} team`} className="m-0 grid list-none grid-cols-2 gap-4 p-0 @[700px]:grid-cols-3 @[700px]:gap-[18px] @[900px]:grid-cols-6">
                {TEAM.map((member, i) => (
                  <motion.li key={member.name} {...enter(16, 0.45, 0.08 + i * 0.05)} className="min-w-0">
                    <motion.div
                      whileHover={reduce ? undefined : { y: -3 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="aspect-[1/1.08] w-full overflow-hidden rounded-xl bg-[#1a1a1a]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={member.image} alt={`${member.name}, ${member.role}`} width={180} height={194} loading="lazy" decoding="async" className="block size-full object-cover" />
                    </motion.div>
                    <h2 className="mt-2.5 mb-1 text-[11px] leading-[1.3] font-normal tracking-[0.04em] text-white uppercase">{member.name}</h2>
                    <p className="m-0 text-[10px] leading-[1.3] tracking-[0.06em] text-white/40 uppercase">{member.role}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </PreviewViewFrame>
  );
}
