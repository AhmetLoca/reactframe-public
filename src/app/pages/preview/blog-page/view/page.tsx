"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Instrument_Serif, Manrope } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Manrope({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

interface Post {
  title: string;
  excerpt?: string;
  category: string;
  date: string;
  iso: string;
  readTime: string;
  image: string;
  url: string;
  featured?: boolean;
}

const HEADING = "Blog";
const DESCRIPTION = "A blog page for ideas and stories.";
const SITE_NAME = "Blog";

const POSTS: Post[] = [
  {
    featured: true,
    title: "Blurred Stride",
    excerpt: "A line of people walking in motion blur, capturing speed, rhythm, and the cost of moving too fast.",
    category: "Featured",
    date: "Apr 28, 2026",
    iso: "2026-04-28",
    readTime: "8 min read",
    image: "/demo/104.webp",
    url: "#",
  },
  { title: "Steady Stroke", category: "Rowing", date: "Apr 21, 2026", iso: "2026-04-21", readTime: "6 min read", image: "/demo/102.webp", url: "#" },
  { title: "Momentum", category: "Cycling", date: "Apr 16, 2026", iso: "2026-04-16", readTime: "7 min read", image: "/demo/108.webp", url: "#" },
  { title: "Controlled Descent", category: "Skiing", date: "Apr 10, 2026", iso: "2026-04-10", readTime: "5 min read", image: "/demo/12.webp", url: "#" },
  { title: "Under the Surface", category: "Swimming", date: "Apr 4, 2026", iso: "2026-04-04", readTime: "6 min read", image: "/demo/11.webp", url: "#" },
  { title: "Finding Cadence", category: "Cycling", date: "Mar 28, 2026", iso: "2026-03-28", readTime: "5 min read", image: "/demo/pages/blog-page/finding-cadence.webp", url: "#" },
  { title: "Strength Under Load", category: "Weightlifting", date: "Mar 20, 2026", iso: "2026-03-20", readTime: "7 min read", image: "/demo/103.webp", url: "#" },
];

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: HEADING,
  description: DESCRIPTION,
  publisher: { "@type": "Organization", name: SITE_NAME },
  blogPost: POSTS.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    datePublished: p.iso,
    articleSection: p.category,
    timeRequired: p.readTime,
  })),
}).replace(/</g, "\\u003c");

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-white/35";

function Meta({ post }: { post: Post }) {
  return (
    <p className="m-0 text-[13px] leading-[1.4] text-white/[0.42]">
      <time dateTime={post.iso}>{post.date}</time>
      {" · "}
      <span>{post.readTime}</span>
    </p>
  );
}

export default function BlogPageView() {
  const reduce = useReducedMotion();
  const featured = POSTS.find((p) => p.featured) ?? POSTS[0];
  const rest = POSTS.filter((p) => p !== featured);

  const enter = (duration: number, delay = 0) =>
    reduce ? { initial: false as const } : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration, delay } };
  const hover = reduce ? undefined : { y: -2 };

  return (
    <PreviewViewFrame slug="blog-page">
      <div className={`${sans.className} @container min-h-screen bg-[#0a0a0a] text-white`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        <section aria-labelledby="blog-heading" className="mx-auto w-full max-w-[1184px] px-5 pt-9 pb-10 @[820px]:px-[30px] @[820px]:pt-8 @[820px]:pb-12">
          <header className="mb-[22px] @[820px]:mb-7">
            <h1 id="blog-heading" className={`${serif.className} m-0 text-[52px] leading-[1.1] font-normal tracking-[-0.03em] text-white @[820px]:text-[56px]`}>
              {HEADING}
            </h1>
            <p className="mt-2 mb-0 text-[16px] leading-[1.5] text-white/55">{DESCRIPTION}</p>
          </header>

          <motion.a
            href={featured.url}
            aria-label={featured.title}
            {...enter(0.4)}
            whileHover={hover}
            className={`mb-4 grid grid-cols-1 overflow-hidden rounded-2xl border border-white/12 bg-white/3 text-inherit no-underline @[820px]:grid-cols-[1.05fr_0.95fr] ${focusRing}`}
          >
            <div className="aspect-[16/10] w-full bg-[#161616] @[820px]:aspect-[1.25]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.image} alt={featured.title} className="block size-full object-cover grayscale" />
            </div>
            <div className="flex flex-col px-5 pt-[22px] pb-6 @[820px]:py-7 @[820px]:pr-6 @[820px]:pl-8">
              <span className="mb-4 self-start rounded-full bg-white px-2.5 py-[5px] text-[11px] leading-[1.2] font-medium tracking-[0.08em] text-[#111] uppercase">{featured.category}</span>
              <h2 className="m-0 text-[30px] leading-[1.15] font-medium tracking-[-0.03em] text-white @[820px]:text-[36px]">{featured.title}</h2>
              {featured.excerpt && <p className="mt-3 mb-0 text-[16px] leading-[1.6] text-white/55">{featured.excerpt}</p>}
              <div className="mt-auto pt-5">
                <Meta post={featured} />
              </div>
            </div>
          </motion.a>

          <div className="grid grid-cols-1 gap-3.5 @[560px]:grid-cols-2 @[820px]:grid-cols-3">
            {rest.map((post, i) => (
              <motion.a
                key={post.title}
                href={post.url}
                aria-label={post.title}
                {...enter(0.35, 0.06 + i * 0.04)}
                whileHover={hover}
                className={`flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/3 text-inherit no-underline ${focusRing}`}
              >
                <div className="h-40 bg-[#161616] @[820px]:h-[168px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image} alt={post.title} loading="lazy" className="block size-full object-cover grayscale" />
                </div>
                <div className="px-4 pt-4 pb-[18px]">
                  <span className="mb-2.5 inline-flex rounded-full bg-white/8 px-2 py-1 text-[11px] leading-[1.2] font-medium tracking-[0.08em] text-white/[0.42] uppercase">{post.category}</span>
                  <h3 className="mx-0 mt-0 mb-3 text-[20px] leading-[1.25] font-medium tracking-[-0.02em] text-white">{post.title}</h3>
                  <Meta post={post} />
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </PreviewViewFrame>
  );
}
