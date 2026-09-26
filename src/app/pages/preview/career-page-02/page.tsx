import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/career-page-02" },
  title: "Career Page 02, Page Preview",
  description: "A careers page with a photo hero, a scrolling values marquee, a life-at-work photo gallery and department-filtered open positions.",
};

export default async function CareerPage02Preview() {
  const code = await getPageCode("career-page-02");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Marketing
        <PageAccessBadge slug="career-page-02" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Career Page 02</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A careers page: black-and-white photo hero with headline, an endlessly scrolling marquee of value pills, a five-photo Life Here gallery, and an open-positions list with working department filters.</p>

      <div className="mt-8">
        <LayoutPreview slug="career-page-02" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
