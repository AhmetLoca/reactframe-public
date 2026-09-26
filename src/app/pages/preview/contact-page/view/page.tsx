"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Instrument_Serif, Manrope } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Manrope({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

const HEADING = "Let's talk";
const DESCRIPTION = "Questions, feedback, or a project in mind? Send us a note and a real person will reply within one business day.";

const DETAILS = [
  { label: "Email", value: "hello@nexora.com" },
  { label: "Office", value: "12 Market Street, Suite 400, Portland, OR" },
  { label: "Hours", value: "Monday to Friday, 9am to 6pm PT" },
];

const TOPICS = ["General question", "Sales", "Support", "Partnership"];

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: HEADING,
  description: DESCRIPTION,
  mainEntity: {
    "@type": "Organization",
    name: "Nexora",
    email: "hello@nexora.com",
    address: { "@type": "PostalAddress", streetAddress: "12 Market Street, Suite 400", addressLocality: "Portland", addressRegion: "OR", addressCountry: "US" },
  },
}).replace(/</g, "\\u003c");

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-white/35";
const fieldClass = `w-full rounded-[12px] border border-white/14 bg-white/[0.03] px-3.5 py-3 text-[15px] leading-[1.4] text-white placeholder:text-white/30 ${focusRing}`;

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPageView() {
  const reduce = useReducedMotion();
  const uid = React.useId();
  const [errors, setErrors] = React.useState<Errors>({});
  const [sent, setSent] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const next: Errors = {};
    if (!name) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Please enter a valid email address.";
    if (message.length < 10) next.message = "Tell us a little more, at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  const errorId = (field: string) => `${uid}-${field}-error`;

  return (
    <PreviewViewFrame slug="contact-page">
      <div className={`${sans.className} @container min-h-screen bg-[#0a0a0a] text-white`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        <section aria-labelledby="contact-heading" className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-10 px-5 py-12 @[860px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] @[860px]:gap-16 @[860px]:px-10 @[860px]:pt-[72px] @[860px]:pb-[96px]">
          <header>
            <h1 id="contact-heading" className={`${serif.className} m-0 text-[42px] leading-[1.08] font-normal tracking-[-0.035em] text-white @[860px]:text-[64px]`}>{HEADING}</h1>
            <p className="mt-4 mb-0 max-w-[420px] text-[16px] leading-[1.65] text-white/55">{DESCRIPTION}</p>
            <dl className="mt-9 mb-0 flex flex-col gap-5">
              {DETAILS.map((item) => (
                <div key={item.label}>
                  <dt className="text-[12px] leading-none font-medium tracking-[0.08em] text-white/40 uppercase">{item.label}</dt>
                  <dd className="m-0 mt-1.5 text-[15px] leading-[1.5] text-white/80">{item.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <div className="rounded-[20px] border border-white/12 bg-white/[0.02] p-5 @[700px]:p-7">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="sent"
                  role="status"
                  {...(reduce ? { initial: false as const } : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.3 } })}
                  className="flex min-h-[340px] flex-col items-center justify-center text-center"
                >
                  <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#111]">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h2 className={`${serif.className} mt-5 mb-0 text-[30px] leading-[1.15] font-normal tracking-[-0.02em]`}>Message sent</h2>
                  <p className="mt-2 mb-0 max-w-[320px] text-[15px] leading-[1.6] text-white/55">Thanks for reaching out. We&apos;ll get back to you within one business day.</p>
                  <button type="button" onClick={() => setSent(false)} className={`mt-6 cursor-pointer rounded-full border border-white/20 bg-transparent px-5 py-2.5 text-[14px] font-medium text-white ${focusRing}`}>
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={onSubmit}
                  {...(reduce ? { initial: false as const } : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } })}
                  className="flex flex-col gap-4"
                >
                  <div className="grid grid-cols-1 gap-4 @[700px]:grid-cols-2">
                    <div>
                      <label htmlFor={`${uid}-name`} className="mb-1.5 block text-[13px] font-medium text-white/70">Name</label>
                      <input id={`${uid}-name`} name="name" autoComplete="name" placeholder="Ada Lovelace" aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? errorId("name") : undefined} className={fieldClass} />
                      {errors.name && <p id={errorId("name")} className="mt-1.5 mb-0 text-[13px] text-[#ff8a8a]">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor={`${uid}-email`} className="mb-1.5 block text-[13px] font-medium text-white/70">Email</label>
                      <input id={`${uid}-email`} name="email" type="email" autoComplete="email" placeholder="ada@example.com" aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? errorId("email") : undefined} className={fieldClass} />
                      {errors.email && <p id={errorId("email")} className="mt-1.5 mb-0 text-[13px] text-[#ff8a8a]">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${uid}-topic`} className="mb-1.5 block text-[13px] font-medium text-white/70">Topic</label>
                    <select id={`${uid}-topic`} name="topic" defaultValue={TOPICS[0]} className={`${fieldClass} appearance-none`}>
                      {TOPICS.map((topic) => (
                        <option key={topic} value={topic} className="bg-[#111] text-white">{topic}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`${uid}-message`} className="mb-1.5 block text-[13px] font-medium text-white/70">Message</label>
                    <textarea id={`${uid}-message`} name="message" rows={5} placeholder="How can we help?" aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? errorId("message") : undefined} className={`${fieldClass} resize-y`} />
                    {errors.message && <p id={errorId("message")} className="mt-1.5 mb-0 text-[13px] text-[#ff8a8a]">{errors.message}</p>}
                  </div>

                  <button type="submit" className={`mt-1 cursor-pointer rounded-full border-0 bg-white px-5 py-3.5 text-[15px] leading-none font-semibold text-[#111] transition-opacity duration-150 hover:opacity-85 ${focusRing}`}>
                    Send message
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </PreviewViewFrame>
  );
}
