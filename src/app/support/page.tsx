import type { Metadata } from "next";
import { SupportForm } from "@/components/support-form";
import { components } from "@/lib/catalog-data";

const SUPPORT_EMAIL = "locaahmet@gmail.com";

export const metadata: Metadata = {
  title: "Support",
  description: "Stuck on a ReactFrame component? Email me directly and get a reply as soon as possible.",
};

export default function SupportPage() {
  const items = components.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <main className="mx-auto max-w-3xl px-6 pt-20 pb-24 text-center md:pt-28">
      <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium">Support</span>

      <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">Always here when you need it</h1>

      <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-foreground/60">
        Stuck on a component, found a bug, or just have a question? Email me directly — no ticket system, no bot, just me reading it and getting back
        to you as soon as possible.
      </p>

      <SupportForm items={items} />

      <a
        href={`mailto:${SUPPORT_EMAIL}`}
        className="group mx-auto mt-8 inline-flex items-center gap-2.5 rounded-full border border-border px-5 py-2.5 text-sm text-foreground/60 transition-colors duration-300 ease-signature hover:text-foreground"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
          <path d="M3.5 6.5h17a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 7.5l9 6.5 9-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Prefer email?{" "}
        <span className="font-medium text-foreground underline decoration-foreground/20 underline-offset-4 group-hover:decoration-foreground">
          {SUPPORT_EMAIL}
        </span>
      </a>

      <p className="mx-auto mt-10 max-w-xl text-sm leading-relaxed text-foreground/45">
        Please note: support covers bugs, broken elements, and questions about how a component works. Customisation and custom development requests
        aren&rsquo;t included.
      </p>
    </main>
  );
}
