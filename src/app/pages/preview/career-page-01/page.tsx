import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/career-page-01" },
  title: "Career Page 01, Page Preview",
  description: "A hiring page with a serif headline, four value cards and a list of open positions.",
};

export default async function CareerPage01Preview() {
  const code = await getPageCode("career-page-01");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Marketing
        <PageAccessBadge slug="career-page-01" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Career Page 01</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A careers page: centered serif hiring headline, a row of icon value cards, and a hover-highlighted list of open positions with department tags, locations and arrows.</p>

      <div className="mt-8">
        <LayoutPreview slug="career-page-01" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
