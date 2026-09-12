import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about ReactFrame's components, licensing, and support.",
};

const FAQS: { question: string; answer: React.ReactNode }[] = [
  {
    question: "What's the difference between Free and Premium components?",
    answer:
      "Both are the same quality and get the same fidelity checks — Premium components require unlocking access to the source before you can copy the code. Free ones are ready to install immediately, no unlock step.",
  },
  {
    question: "Do components depend on ReactFrame at runtime?",
    answer:
      "No. Every component ships as plain React and Tailwind CSS — you copy the source into your own project and it's yours from there, with no package to install and no ongoing dependency on this site.",
  },
  {
    question: "Can I use components in commercial or client projects?",
    answer: (
      <>
        Yes — see the{" "}
        <Link href="/license" className="underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground">
          License
        </Link>{" "}
        page for the full terms, but personal and commercial use in your own projects is covered.
      </>
    ),
  },
  {
    question: "Can I customize a component after copying it?",
    answer:
      "Yes, fully. Once it's in your project it's just React and Tailwind — restyle it, extend its props, strip out what you don't need.",
  },
  {
    question: "Do I need a specific framework to use these?",
    answer:
      "Components are built for React with Tailwind CSS and work in any React setup (Next.js, Vite, etc.). Each component page shows the exact code you'll copy, so you can see the dependencies before you commit.",
  },
  {
    question: "Something isn't working the way the docs describe — what do I do?",
    answer: (
      <>
        That&apos;s a{" "}
        <Link href="/support" className="underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground">
          Support
        </Link>{" "}
        question, not a FAQ one — email us directly from that page and we&apos;ll take a look.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Frequently Asked Questions</h1>
      <p className="mt-3 text-foreground/60">Common questions about using ReactFrame&apos;s components.</p>

      <div className="mt-10 divide-y divide-border">
        {FAQS.map((faq) => (
          <div key={faq.question} className="py-6 first:pt-0">
            <h2 className="text-base font-semibold text-foreground">{faq.question}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground/65">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
