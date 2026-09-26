"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Instrument_Serif, Manrope } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Manrope({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

const ACCENT = "#DCCB4F";
const HERO_IMAGE = "/demo/9.webp";
const POLAROIDS = ["/demo/6.webp", "/demo/8.webp", "/demo/9.webp", "/demo/10.webp", "/demo/20.webp"];

// Sizes are in px at desktop scale; --s (1 on desktop, 0.5 on narrow containers) scales them.
const POLAROID_LAYOUT = [
  { width: 228, height: 176, overlap: 0, z: 2 },
  { width: 214, height: 168, overlap: -38, z: 4 },
  { width: 236, height: 178, overlap: -34, z: 5 },
  { width: 206, height: 172, overlap: -36, z: 3 },
  { width: 220, height: 164, overlap: -40, z: 1 },
];

const TEAM = [
  { name: "Alva Keller", role: "Founder & Creative Director", image: "/demo/51.webp" },
  { name: "Jonas Reed", role: "Lead Designer", image: "/demo/53.webp" },
  { name: "Maya Chen", role: "Product Designer", image: "/demo/pages/about-us-02/maya-chen.webp" },
  { name: "Leo Martin", role: "Developer", image: "/demo/42.webp" },
  { name: "Sophie Dalton", role: "Content Strategist", image: "/demo/pages/about-us/emile-brooks.webp" },
];

export default function AboutUs02PageView() {
  const reduce = useReducedMotion();

  return (
    <PreviewViewFrame slug="about-us-02">
      <section aria-labelledby="about-02-heading" className={`${sans.className} @container flex min-h-screen flex-col bg-[#0a0a0a] text-white`}>
        <div className="relative min-h-[220px] overflow-hidden bg-[#111] @[820px]:min-h-[252px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMAGE} alt="" fetchPriority="high" className="absolute inset-0 size-full object-cover object-top" />
          <div className="relative z-10 px-5 pt-7 pb-6 @[820px]:px-8 @[820px]:pt-5 @[820px]:pb-8">
            <p className="m-0 mb-2.5 text-[11px] leading-[1.2] font-medium tracking-[0.16em] text-white/70 uppercase">ABOUT US</p>
            <h1 id="about-02-heading" className={`${serif.className} m-0 max-w-[1100px] text-[40px] leading-[0.92] font-normal tracking-[-0.03em] text-white uppercase @[820px]:text-[72px]`}>
              <span className="block">Good design</span>
              <span className="block">
                Builds a brighter <span style={{ color: ACCENT }}>tomorrow.</span>
              </span>
            </h1>
          </div>
        </div>

        <div className="flex min-h-[150px] items-center justify-center overflow-hidden px-2 pt-8 pb-4 @[560px]:min-h-[190px] [--s:0.36] @[560px]:[--s:0.5] @[820px]:min-h-[260px] @[820px]:px-5 @[820px]:pt-12 @[820px]:pb-5 @[820px]:[--s:1]" aria-hidden="true">
          {POLAROIDS.map((src, i) => {
            const l = POLAROID_LAYOUT[i];
            return (
              <motion.div
                key={src}
                {...(reduce ? { initial: false as const } : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: i * 0.05 } })}
                className="relative shrink-0"
                style={{ marginLeft: `calc(var(--s) * ${l.overlap}px)`, zIndex: l.z }}
              >
                <div
                  className="box-border overflow-hidden bg-white"
                  style={{
                    width: `calc(var(--s) * ${l.width}px)`,
                    height: `calc(var(--s) * ${l.height}px)`,
                    border: "calc(var(--s) * 2.5px) solid #fff",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="block size-full object-cover" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 items-center gap-5 px-6 pt-6 pb-3 @[820px]:grid-cols-[0.9fr_1.1fr] @[820px]:gap-10 @[820px]:px-[62px] @[820px]:pt-7">
          <div>
            <div className="mb-1.5 text-[12px] leading-[1.2] font-medium tracking-[0.14em] text-white/45 uppercase">PROJECTS COMPLETED</div>
            <div className="text-[80px] leading-[0.85] font-light tracking-[-0.05em] text-white @[820px]:text-[120px]">150+</div>
          </div>
          <p className="m-0 max-w-[520px] text-[18px] leading-[1.45] font-normal tracking-[-0.02em] text-white/[0.78] @[820px]:text-[22px]">
            We&apos;re a small, independent design studio on a mission to create meaningful brands, digital experiences and campaigns that make <span style={{ color: ACCENT }}>a real difference</span>. We care about people, culture and a more thoughtful, more beautiful internet.
          </p>
        </div>

        <div className="px-5 pt-5 pb-10 @[820px]:px-[39px] @[820px]:pb-6">
          <h2 className="mx-0 mt-0 mb-[22px] text-[13px] leading-[1.2] font-medium tracking-[0.16em] text-white uppercase">THE TEAM</h2>
          <div className="grid grid-cols-2 justify-items-center gap-[18px] @[820px]:grid-cols-5 @[820px]:gap-5">
            {TEAM.map((member) => (
              <article key={member.name} className="text-center">
                <div className="mx-auto mb-3 size-[84px] overflow-hidden rounded-full bg-[#1c1c1c] @[820px]:size-[108px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.image} alt={member.name} loading="lazy" className="size-full object-cover" />
                </div>
                <div className="text-[11px] leading-[1.3] font-medium tracking-[0.08em] text-white uppercase">{member.name}</div>
                <div className="mt-1 text-[12px] leading-[1.3] text-white/45">{member.role}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PreviewViewFrame>
  );
}
