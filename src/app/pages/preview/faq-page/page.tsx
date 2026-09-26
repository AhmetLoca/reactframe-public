import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/faq-page" },
  title: "FAQ Page, Page Preview",
  description: "A FAQ page with a serif headline, category tabs and an accordion of questions and answers.",
};

export default async function FaqPagePreview() {
  const code = await getPageCode("faq-page");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Content
        <PageAccessBadge slug="faq-page" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">FAQ Page</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A frequently-asked-questions page: centered serif headline, pill category tabs (General, Billing, Components, License) and a smooth one-at-a-time accordion with plus/minus toggles.</p>

      <div className="mt-8">
        <LayoutPreview slug="faq-page" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
