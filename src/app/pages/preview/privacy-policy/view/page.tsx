"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Inter } from "next/font/google";
import { PreviewViewFrame } from "@/components/preview-view-frame";

const sans = Inter({ subsets: ["latin"], display: "swap" });

const HEADING = "Privacy Policy";
const DESCRIPTION = "How we collect, use, and protect your information when you use our website and products.";

interface Section {
  title: string;
  body: string;
  bullets?: string[];
}

const SECTIONS: Section[] = [
  {
    title: "Information We Collect",
    body: "We collect the information you give us directly and the information created when you use the Service:",
    bullets: [
      "Account details such as your name, email address, and password.",
      "Billing details handled by our payment provider; we never see your full card number.",
      "Usage data such as pages viewed, features used, and device and browser type.",
      "Messages you send us through support or contact forms.",
    ],
  },
  {
    title: "How We Use Information",
    body: "We use your information to provide and improve the Service, and for no other purpose without your consent:",
    bullets: [
      "To create and manage your account and process your orders.",
      "To respond to support requests and send important service notices.",
      "To understand how the Service is used so we can fix problems and improve it.",
      "To detect and prevent fraud, abuse, and security incidents.",
    ],
  },
  {
    title: "Cookies and Tracking",
    body: "We use a small number of cookies to keep you signed in, remember your preferences, and measure aggregate traffic. You can choose which optional cookies to allow from the cookie banner, and you can clear or block cookies in your browser settings at any time.",
  },
  {
    title: "Sharing and Disclosure",
    body: "We do not sell your personal information. We share it only with service providers that help us run the Service, such as payments, email delivery, and hosting, under agreements that require them to protect it, or when the law requires us to.",
  },
  {
    title: "Data Retention",
    body: "We keep your information for as long as your account is active or as needed to provide the Service. When you delete your account, we remove or anonymize your personal data within a reasonable period, except where we must keep it for legal or accounting reasons.",
  },
  {
    title: "Security",
    body: "We use encrypted connections, access controls, and regular reviews to protect your data. No system is completely secure, so we cannot guarantee absolute security, but we act quickly on any incident and will notify you when required.",
  },
  {
    title: "Your Rights",
    body: "Depending on where you live, you may have the right to:",
    bullets: [
      "Access the personal information we hold about you.",
      "Correct information that is inaccurate or incomplete.",
      "Delete your information or restrict how we use it.",
      "Receive a copy of your data in a portable format.",
    ],
  },
  {
    title: "Children's Privacy",
    body: "The Service is not directed to children under 16, and we do not knowingly collect their personal information. If you believe a child has given us data, contact us and we will delete it.",
  },
  {
    title: "International Transfers",
    body: "Your information may be processed in countries other than your own. Where we transfer it, we use safeguards designed to keep it protected to the standard required where you live.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this policy from time to time. When we make material changes we will update the date on this page and, where appropriate, notify you before they take effect.",
  },
  {
    title: "Contact Us",
    body: "If you have questions about this policy or want to use your rights, contact us through the details provided on our website.",
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

export default function PrivacyPolicyView() {
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
    <PreviewViewFrame slug="privacy-policy">
      <div className={`${sans.className} @container min-h-screen bg-[#0a0a0a] text-white`}>
      <article aria-labelledby="privacy-heading" className="flex min-h-screen flex-col items-start @[860px]:flex-row">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />

        <div className="relative w-full shrink-0 self-stretch @[860px]:w-[246px] @[860px]:border-r @[860px]:border-white/10">
          <nav aria-label="Privacy Policy sections" className="relative z-[8] w-full px-5 pt-[72px] pb-4 @[860px]:sticky @[860px]:top-6 @[860px]:pt-[58px] @[860px]:pr-[18px] @[860px]:pb-8 @[860px]:pl-6">
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
            <h1 id="privacy-heading" className="mx-0 mt-0 mb-3 text-[32px] leading-[1.15] font-medium tracking-[-0.03em] text-white @[860px]:text-[40px]">{HEADING}</h1>
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
