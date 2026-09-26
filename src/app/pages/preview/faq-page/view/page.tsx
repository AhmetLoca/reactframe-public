"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Instrument_Serif, Manrope } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Manrope({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

const HEADING = "Frequently Asked Questions";
const DESCRIPTION = "Find answers to the most common questions about our product, billing, components, and license.";

const CATEGORIES = ["General", "Billing", "Components", "License"];

const ITEMS = [
  { category: "General", question: "What is Nexora and what does it do?", answer: "Nexora is a product platform for teams that want design and engineering to work together with less friction." },
  { category: "General", question: "How does the free trial work?", answer: "Our free trial gives you full access to all features for 14 days. You can explore the platform, build your first project, and decide if it's right for you, no credit card required." },
  { category: "General", question: "Who is Nexora built for?", answer: "Nexora is built for product teams, design engineers, and studios that need a shared system for shipping interfaces faster without losing craft." },
  { category: "General", question: "Do I need technical experience to get started?", answer: "No. You can start with ready-made components and templates. Technical setup is optional and only needed if you want deeper customization." },
  { category: "General", question: "Is my data secure?", answer: "Yes. We use encrypted transport, access controls, and regular reviews to keep workspace data protected." },
  { category: "Billing", question: "Can I change my plan later?", answer: "Yes. You can upgrade, downgrade, or cancel at any time from billing settings. Changes apply to the next billing cycle." },
  { category: "Billing", question: "What payment methods do you accept?", answer: "We accept major credit cards and common invoicing options for annual plans." },
  { category: "Billing", question: "Do you offer refunds?", answer: "If you cancel within the trial window, you will not be charged. Paid plans follow the refund policy in your license agreement." },
  { category: "Components", question: "How do I update installed components?", answer: "Open your library, check for updates, and sync the latest versions into your project." },
  { category: "License", question: "Can I use the components commercially?", answer: "Commercial use is included with a valid license. Review the license terms for redistribution limits." },
];

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: HEADING,
  description: DESCRIPTION,
  mainEntity: ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
}).replace(/</g, "\\u003c");

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-white/35";

export default function FaqPageView() {
  const reduce = useReducedMotion();
  const uid = React.useId();
  const [category, setCategory] = React.useState(CATEGORIES[0]);
  const [openQuestion, setOpenQuestion] = React.useState<string | null>(null);

  const visible = ITEMS.filter((item) => item.category === category);

  return (
    <PreviewViewFrame slug="faq-page">
      <div className={`${sans.className} @container min-h-screen bg-[#0a0a0a] text-white`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        <section aria-labelledby="faq-heading" className="mx-auto w-full max-w-[900px] px-5 py-12 @[700px]:px-10 @[700px]:pt-[52px] @[700px]:pb-[72px]">
          <header className="mb-7 text-center">
            <h1 id="faq-heading" className={`${serif.className} m-0 text-[36px] leading-[1.15] font-normal tracking-[-0.035em] text-white @[700px]:text-[56px]`}>{HEADING}</h1>
            <p className="mx-auto mt-3.5 mb-0 max-w-[520px] text-[16px] leading-[1.6] text-white/55">{DESCRIPTION}</p>
          </header>

          <div role="group" aria-label="Question categories" className="mb-[26px] flex flex-wrap justify-center gap-2.5">
            {CATEGORIES.map((name) => {
              const active = name === category;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setCategory(name);
                    setOpenQuestion(null);
                  }}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-[14px] leading-[1.2] font-medium transition-colors duration-150 ${focusRing} ${
                    active ? "border-transparent bg-white text-[#111]" : "border-white/14 bg-transparent text-white/70 hover:text-white"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2.5">
            {visible.map((item, i) => {
              const open = openQuestion === item.question;
              const panelId = `${uid}-${i}`;
              return (
                <motion.div
                  key={`${category}-${item.question}`}
                  {...(reduce ? { initial: false as const } : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: i * 0.04 } })}
                  className="overflow-hidden rounded-[14px] border border-white/12 bg-white/2"
                >
                  <h2 className="m-0">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenQuestion(open ? null : item.question)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-4 py-4 text-left @[700px]:px-5 @[700px]:py-[18px] ${focusRing} focus-visible:ring-inset`}
                    >
                      <span className="text-[16px] leading-[1.35] font-normal tracking-[-0.015em] text-white">{item.question}</span>
                      <span aria-hidden="true" className="min-w-4 text-center text-[16px] leading-none text-white/70">{open ? "−" : "+"}</span>
                    </button>
                  </h2>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={panelId}
                        role="region"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.28 }}
                        className="overflow-hidden"
                      >
                        <p className="m-0 max-w-[680px] px-4 pb-4 text-[15px] leading-[1.6] text-white/55 @[700px]:px-5 @[700px]:pb-5">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </PreviewViewFrame>
  );
}
