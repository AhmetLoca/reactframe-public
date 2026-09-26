"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Instrument_Serif, Manrope } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Manrope({ subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", display: "swap" });

const HEADING = "Simple pricing, no surprises";
const DESCRIPTION = "Start free for 14 days. Pick the plan that fits your team and change it whenever you need to.";

type Billing = "monthly" | "yearly";

interface Plan {
  name: string;
  tagline: string;
  monthly: number;
  features: string[];
  cta: string;
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    tagline: "For individuals and side projects.",
    monthly: 12,
    features: ["1 workspace", "Up to 3 projects", "Community support", "Basic analytics"],
    cta: "Start free trial",
  },
  {
    name: "Pro",
    tagline: "For freelancers and growing studios.",
    monthly: 29,
    features: ["Unlimited projects", "Custom domains", "Priority email support", "Advanced analytics", "Version history"],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Team",
    tagline: "For teams that ship together.",
    monthly: 79,
    features: ["Everything in Pro", "Up to 15 seats", "Roles and permissions", "SSO and audit log", "Dedicated onboarding"],
    cta: "Talk to sales",
  },
];

const YEARLY_DISCOUNT = 0.2;

const priceFor = (plan: Plan, billing: Billing) => (billing === "yearly" ? Math.round(plan.monthly * (1 - YEARLY_DISCOUNT)) : plan.monthly);

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Nexora",
  description: DESCRIPTION,
  offers: PLANS.map((plan) => ({
    "@type": "Offer",
    name: plan.name,
    price: String(plan.monthly),
    priceCurrency: "USD",
    description: plan.tagline,
  })),
}).replace(/</g, "\\u003c");

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-white/35";

function Check() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-[3px] shrink-0 text-white/70">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PricingPageView() {
  const reduce = useReducedMotion();
  const [billing, setBilling] = React.useState<Billing>("yearly");

  return (
    <PreviewViewFrame slug="pricing-page">
      <div className={`${sans.className} @container min-h-screen bg-[#0a0a0a] text-white`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
        <section aria-labelledby="pricing-heading" className="mx-auto w-full max-w-[1080px] px-5 py-12 @[700px]:px-10 @[700px]:pt-[60px] @[700px]:pb-[84px]">
          <header className="mb-9 text-center">
            <h1 id="pricing-heading" className={`${serif.className} m-0 text-[38px] leading-[1.12] font-normal tracking-[-0.035em] text-white @[700px]:text-[58px]`}>{HEADING}</h1>
            <p className="mx-auto mt-3.5 mb-0 max-w-[520px] text-[16px] leading-[1.6] text-white/55">{DESCRIPTION}</p>

            <div role="group" aria-label="Billing period" className="mt-7 inline-flex rounded-full border border-white/14 p-1">
              {(["monthly", "yearly"] as const).map((value) => {
                const active = billing === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setBilling(value)}
                    className={`cursor-pointer rounded-full border-0 px-4 py-2 text-[14px] leading-[1.2] font-medium capitalize transition-colors duration-150 ${focusRing} ${
                      active ? "bg-white text-[#111]" : "bg-transparent text-white/65 hover:text-white"
                    }`}
                  >
                    {value}
                    {value === "yearly" && <span className={`ml-2 text-[12px] ${active ? "text-[#111]/60" : "text-white/45"}`}>Save 20%</span>}
                  </button>
                );
              })}
            </div>
          </header>

          <div className="grid grid-cols-1 gap-4 @[860px]:grid-cols-3">
            {PLANS.map((plan, i) => (
              <motion.article
                key={plan.name}
                aria-labelledby={`plan-${plan.name}`}
                {...(reduce ? { initial: false as const } : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: i * 0.06 } })}
                className={`relative flex flex-col rounded-[20px] border p-6 @[700px]:p-7 ${plan.featured ? "border-white/40 bg-white/[0.06]" : "border-white/12 bg-white/[0.02]"}`}
              >
                {plan.featured && (
                  <span className="absolute top-5 right-5 rounded-full bg-white px-2.5 py-1 text-[11px] leading-none font-semibold text-[#111]">Most popular</span>
                )}
                <h2 id={`plan-${plan.name}`} className="m-0 text-[18px] leading-[1.3] font-semibold tracking-[-0.01em] text-white">{plan.name}</h2>
                <p className="mt-1.5 mb-0 text-[14px] leading-[1.5] text-white/50">{plan.tagline}</p>

                <p className="mt-6 mb-0 flex items-baseline gap-1.5">
                  <span className={`${serif.className} text-[52px] leading-none tracking-[-0.03em] text-white`}>${priceFor(plan, billing)}</span>
                  <span className="text-[14px] text-white/45">/ month</span>
                </p>
                <p className="mt-1.5 mb-0 min-h-[20px] text-[13px] text-white/40">{billing === "yearly" ? `Billed $${priceFor(plan, billing) * 12} yearly` : "Billed monthly"}</p>

                <button
                  type="button"
                  className={`mt-6 cursor-pointer rounded-full border px-5 py-3 text-[15px] leading-none font-semibold transition-opacity duration-150 hover:opacity-85 ${focusRing} ${
                    plan.featured ? "border-transparent bg-white text-[#111]" : "border-white/20 bg-transparent text-white"
                  }`}
                >
                  {plan.cta}
                </button>

                <ul className="mt-7 mb-0 flex list-none flex-col gap-3 p-0">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-[14px] leading-[1.5] text-white/70">
                      <Check />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>

          <p className="mt-8 mb-0 text-center text-[14px] leading-[1.6] text-white/45">All plans include a 14-day free trial, no credit card required. Cancel anytime.</p>
        </section>
      </div>
    </PreviewViewFrame>
  );
}
