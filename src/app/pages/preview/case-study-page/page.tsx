import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/case-study-page" },
  title: "Case Study Page, Page Preview",
  description: "A customer story with a serif headline, headline stats, a pull quote with author, challenge and solution columns, and a closing call to action.",
};

export default async function CaseStudyPagePreview() {
  const code = await getPageCode("case-study-page");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Marketing
        <PageAccessBadge slug="case-study-page" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Case Study Page</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A customer success story: company mark and serif headline, three result stats, an italic pull quote with a blue accent rule and author, challenge and solution columns, and a bordered call-to-action card.</p>

      <div className="mt-8">
        <LayoutPreview slug="case-study-page" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
