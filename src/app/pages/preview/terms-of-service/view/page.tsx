"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Inter } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Inter({ subsets: ["latin"], display: "swap" });

const HEADING = "Terms of Service";
const DESCRIPTION = "Please read these Terms of Service carefully before using the Service.";

interface Section {
  title: string;
  body: string;
  bullets?: string[];
}

const SECTIONS: Section[] = [
  {
    title: "Acceptance of Terms",
    body: 'By accessing or using our website, products, or services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not access or use the Service.',
  },
  {
    title: "Use License",
    body: "We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your personal or commercial purposes, in accordance with these Terms. You may not copy, modify, distribute, sell, or lease any part of the Service without our prior written consent.",
  },
  {
    title: "User Accounts",
    body: "To access certain features, you must create an account. You are responsible for maintaining the security of your account and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use or security breach.",
  },
  {
    title: "Payment Terms",
    body: "If you purchase a paid plan, you agree to pay all fees in accordance with the pricing and billing terms in effect at the time of your purchase. Payments are non-refundable except as explicitly stated in these Terms or as required by law.",
  },
  {
    title: "Intellectual Property",
    body: "All content, trademarks, logos, and other intellectual property rights in the Service are owned by us or our licensors. You are granted no ownership rights in or to the Service or its content, except as expressly stated in these Terms.",
  },
  {
    title: "Prohibited Conduct",
    body: "You agree not to engage in any of the following prohibited activities:",
    bullets: [
      "Use the Service for any unlawful purpose or in violation of applicable laws.",
      "Attempt to gain unauthorized access to our systems or other users' data.",
      "Interfere with or disrupt the integrity or performance of the Service.",
      "Distribute malware, spam, or other harmful code.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: "To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.",
  },
  {
    title: "Termination",
    body: "We may suspend or terminate access to the Service at any time if you violate these Terms or if we discontinue the Service.",
  },
  {
    title: "Governing Law",
    body: "These Terms are governed by applicable law, without regard to conflict of law principles.",
  },
  {
    title: "Changes to These Terms",
    body: "We may update these Terms from time to time. Continued use of the Service after changes become effective constitutes acceptance of the revised Terms.",
  },
  {
    title: "Contact Information",
    body: "If you have questions about these Terms, contact us through the details provided on our website.",
  },
];

const IDS = SECTIONS.map((s, i) => s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `section-${i + 1}`);

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: HEADING,
  description: DESCRIPTION,
  hasPart: SECTIONS.map((s) => ({ "@type": "WebPageElement", name: s.title, text: s.body })),
}).replace(/</g, "\\u003c");

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-white/35";

export default function TermsOfServiceView() {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const sectionRefs = React.useRef<(HTMLElement | null)[]>([]);
  const clicking = React.useRef(false);
  const clickTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const nodes = sectionRefs.current.filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        if (clicking.current) return;
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const index = nodes.indexOf(visible[0].target as HTMLElement);
          if (index >= 0) setActiveIndex(index);
        }
      },
      { root: null, threshold: 0.2, rootMargin: "-80px 0px -55% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  React.useEffect(
    () => () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
    },
    [],
  );

  const select = (index: number) => {
    setActiveIndex(index);
    clicking.current = true;
    sectionRefs.current[index]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clicking.current = false;
    }, 700);
  };

  return (
    <PreviewViewFrame slug="terms-of-service">
      <div className={`${sans.className} @container min-h-screen bg-[#0a0a0a] text-white`}>
      <article aria-labelledby="terms-heading" className="flex min-h-screen flex-col items-start @[860px]:flex-row">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />

        <div className="relative w-full shrink-0 self-stretch @[860px]:w-[246px] @[860px]:border-r @[860px]:border-white/10">
          <nav aria-label="Terms of Service sections" className="relative z-[8] w-full px-5 pt-[72px] pb-4 @[860px]:sticky @[860px]:top-6 @[860px]:pt-[58px] @[860px]:pr-[18px] @[860px]:pb-8 @[860px]:pl-6">
            {SECTIONS.map((section, i) => {
              const active = i === activeIndex;
              return (
                <button
                  key={section.title}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  aria-controls={IDS[i]}
                  onClick={() => select(i)}
                  className={`block w-full cursor-pointer rounded-md border-none bg-transparent py-2 pr-2 pl-[5px] text-left text-[14px] leading-[1.4] transition-colors duration-200 ${focusRing} ${active ? "text-white" : "text-white/42 hover:text-white/70"}`}
                >
                  {i + 1}. {section.title}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="min-w-0 flex-1 px-5 pt-6 pb-20 @[860px]:pt-[43px] @[860px]:pr-12 @[860px]:pb-[120px] @[860px]:pl-10">
          <header className="mb-7">
            <h1 id="terms-heading" className="mx-0 mt-0 mb-3 text-[32px] leading-[1.15] font-medium tracking-[-0.03em] text-white @[860px]:text-[40px]">{HEADING}</h1>
            <p className="m-0 max-w-[760px] text-[15px] leading-[1.65] text-white/[0.58]">{DESCRIPTION}</p>
          </header>

          {SECTIONS.map((section, i) => (
            <motion.section
              key={section.title}
              id={IDS[i]}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              aria-labelledby={`${IDS[i]}-title`}
              {...(reduce ? { initial: false as const } : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: i * 0.03 } })}
              className="mb-9 scroll-mt-8"
            >
              <h2 id={`${IDS[i]}-title`} className="mx-0 mt-0 mb-2 text-[20px] leading-[1.3] font-medium tracking-[-0.02em] text-white">
                {i + 1}. {section.title}
              </h2>
              <p className="m-0 max-w-[760px] text-[15px] leading-[1.65] text-white/[0.58]">{section.body}</p>
              {section.bullets && (
                <ul className="mx-0 mt-2.5 mb-0 max-w-[760px] pl-[18px] text-[15px] leading-[1.65] text-white/[0.58]">
                  {section.bullets.map((line) => (
                    <li key={line} className="mb-1.5">{line}</li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </div>
      </article>
      </div>
    </PreviewViewFrame>
  );
}
