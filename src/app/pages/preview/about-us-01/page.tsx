import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/about-us-01" },
  title: "About Us 01, Page Preview",
  description: "An about page with a founded-year mark, serif manifesto, full-bleed photo strip, timeline and overlapping team avatars.",
};

export default async function AboutUs01PagePreview() {
  const code = await getPageCode("about-us-01");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Marketing
        <PageAccessBadge slug="about-us-01" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">About Us 01</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A studio about page: oversized founded-year mark beside a serif manifesto, a full-bleed strip of color photos, an animated milestone timeline and a stack of overlapping team avatars.</p>

      <div className="mt-8">
        <LayoutPreview slug="about-us-01" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
