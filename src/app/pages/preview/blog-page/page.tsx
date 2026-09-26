import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/blog-page" },
  title: "Blog Page, Page Preview",
  description: "A blog page with a serif headline, a featured post and a responsive grid of article cards.",
};

export default async function BlogPagePreview() {
  const code = await getPageCode("blog-page");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Marketing
        <PageAccessBadge slug="blog-page" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Blog Page</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A blog page for ideas and stories: serif headline, a large featured post with a badge, and a responsive grid of black-and-white article cards with category, date and read time.</p>

      <div className="mt-8">
        <LayoutPreview slug="blog-page" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
