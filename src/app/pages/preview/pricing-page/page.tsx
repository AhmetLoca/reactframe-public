import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/pricing-page" },
  title: "Pricing, Page Preview",
  description: "A pricing page with a serif headline, a monthly and yearly toggle, and three plan cards with a highlighted Pro tier.",
};

export default async function PricingPagePreview() {
  const code = await getPageCode("pricing-page");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Marketing
        <PageAccessBadge slug="pricing-page" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A SaaS pricing page: centered serif headline, a monthly/yearly billing toggle that updates every price (20% off yearly), and three plan cards with a highlighted Most popular tier, feature checklists and calls to action.</p>

      <div className="mt-8">
        <LayoutPreview slug="pricing-page" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
