import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { components } from "@/lib/catalog-data";
import { REAL_PAGES } from "@/lib/pages-data";
import { ALL_ACCESS_REGULAR_PRICE, allAccessCheckout, isCheckoutLive } from "@/lib/checkout-links";
import { BuyButton } from "@/components/buy-button";

export const metadata: Metadata = {
  alternates: { canonical: "/premium" },
  title: "All-Access: Every Premium React Component",
  description:
    "Get every premium ReactFrame component, block and Pro page, plus everything released during the year, for one launch price. React + Tailwind source you own.",
};

const premium = components.filter((c) => !c.free);
const premiumBlocks = premium.filter((c) => c.type === "block").length;
const proPages = REAL_PAGES.filter((p) => !p.free).length;
const freeCount = components.length - premium.length;

const INCLUDED = [
  `All ${premium.length} premium components, including ${premiumBlocks} blocks`,
  `All ${proPages} Pro pages`,
  "Every new premium release for 12 months",
  "Full React + Tailwind source, yours to edit",
  "Install with the shadcn CLI or copy by hand",
  "Commercial use, for yourself or client projects",
];

type Cell = boolean | string;
const COMPARE: { feature: string; free: Cell; single: Cell; all: Cell }[] = [
  { feature: `${freeCount} free components`, free: true, single: true, all: true },
  { feature: `${premium.length} premium components`, free: false, single: "The one you buy", all: true },
  { feature: `${proPages} Pro pages`, free: false, single: "The one you buy", all: true },
  { feature: "New premium releases", free: false, single: false, all: "12 months" },
  { feature: "Commercial use", free: true, single: true, all: true },
  { feature: "Price", free: "$0", single: "$4 – $8 each", all: `${allAccessCheckout.price} once` },
];

const FAQ = [
  {
    q: "What happens after the 12 months?",
    a: "Everything you downloaded during the year stays yours to use forever. Access to new releases and updates stops unless you renew.",
  },
  {
    q: "Is it a subscription?",
    a: "No. It's a single payment that unlocks everything for a year. Nothing renews automatically.",
  },
  {
    q: "Can I use the components in client projects?",
    a: "Yes. The license covers commercial work for yourself or for clients, with no attribution required. See the license page for the full terms.",
  },
  {
    q: "What if I only need one or two components?",
    a: "Every premium component and Pro page is also sold on its own, from $4. All-Access pays off once you want more than a handful.",
  },
  {
    q: "Can I get a refund?",
    a: "Because you get the full source code the moment you buy, purchases are non-refundable. Every component has a live preview and a props reference, so you can check it fits before buying.",
  },
];

function CompareCell({ value }: { value: Cell }) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-[#F2A841]" aria-label="Included" />;
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-foreground/25" aria-label="Not included" />;
  return <span className="text-sm text-foreground/80">{value}</span>;
}

export default function PremiumPage() {
  const live = isCheckoutLive(allAccessCheckout);

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          }),
        }}
      />

      <header className="text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-foreground/50 uppercase">All-Access</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">Every premium component. One price.</h1>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-foreground/60">
          Unlock the whole ReactFrame library, {premium.length} premium components and {proPages} Pro pages, plus everything we ship over the next 12 months.
        </p>
      </header>

      <section className="mx-auto mt-14 max-w-md">
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-card p-8 text-center">
          <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-[#F2A841]/15 blur-3xl" />
          <span className="relative inline-flex rounded-full border border-[#F2A841]/40 bg-[#F2A841]/10 px-3 py-1 text-xs font-semibold text-[#F2A841]">Launch price</span>
          <div className="relative mt-6 flex items-end justify-center gap-3">
            <span className="text-2xl font-medium text-foreground/35 line-through">{ALL_ACCESS_REGULAR_PRICE}</span>
            <span className="text-6xl font-semibold tracking-tight">{allAccessCheckout.price}</span>
          </div>
          <p className="relative mt-2 text-sm text-foreground/55">One payment · 12 months of access · no subscription</p>

          <ul className="relative mt-8 space-y-3 text-left">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F2A841]" />
                {item}
              </li>
            ))}
          </ul>

          <div className="relative mt-9 flex justify-center">
            <BuyButton checkout={allAccessCheckout} size="lg" label={`Get All-Access for ${allAccessCheckout.price}`} className="w-full text-center" />
          </div>
          {!live && (
            <p className="relative mt-4 text-xs text-foreground/45">
              Checkout opens very soon. For early access, email{" "}
              <a href="mailto:support@reactframe.com" className="underline underline-offset-2 hover:text-foreground/70">
                support@reactframe.com
              </a>
              .
            </p>
          )}
        </div>
      </section>

      <section className="mt-24">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Free, single, or everything</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="text-xs font-medium tracking-wide text-foreground/45 uppercase">
                <th className="px-5 py-4 font-medium" />
                <th className="px-5 py-4 text-center font-medium">Free</th>
                <th className="px-5 py-4 text-center font-medium">Single component</th>
                <th className="px-5 py-4 text-center font-medium text-[#F2A841]">All-Access</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row) => (
                <tr key={row.feature} className="border-t border-border">
                  <td className="px-5 py-4 text-sm text-foreground/80">{row.feature}</td>
                  <td className="px-5 py-4 text-center">
                    <CompareCell value={row.free} />
                  </td>
                  <td className="px-5 py-4 text-center">
                    <CompareCell value={row.single} />
                  </td>
                  <td className="bg-[#F2A841]/[0.04] px-5 py-4 text-center">
                    <CompareCell value={row.all} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-3xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Questions</h2>
        <dl className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card px-6">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="py-5">
              <dt className="text-[15px] font-medium">{q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-foreground/65">{a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-center text-sm text-foreground/50">
          Read the full{" "}
          <Link href="/license" className="underline underline-offset-2 hover:text-foreground/80">
            license
          </Link>{" "}
          and{" "}
          <Link href="/refund-policy" className="underline underline-offset-2 hover:text-foreground/80">
            refund policy
          </Link>
          , or{" "}
          <Link href="/components" className="underline underline-offset-2 hover:text-foreground/80">
            browse the components
          </Link>{" "}
          first.
        </p>
      </section>
    </div>
  );
}
