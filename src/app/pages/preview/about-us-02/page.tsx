import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/about-us-02" },
  title: "About Us 02, Page Preview",
  description: "An about page with an uppercase serif hero, tilted overlapping polaroids, a big stat with a story, and a round-avatar team row.",
};

export default async function AboutUs02PagePreview() {
  const code = await getPageCode("about-us-02");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Marketing
        <PageAccessBadge slug="about-us-02" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">About Us 02</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A design-studio about page: photo hero with an uppercase serif headline and accent word, five tilted white-framed polaroids, a 150+ stat beside the studio story, and a team of round avatars.</p>

      <div className="mt-8">
        <LayoutPreview slug="about-us-02" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
