import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/about-us" },
  title: "About Us, Page Preview",
  description: "An editorial about page with a serif headline, hero image, impact stats and a team grid.",
};

export default async function AboutUsPagePreview() {
  const code = await getPageCode("about-us");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Marketing
        <PageAccessBadge slug="about-us" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">About Us</h1>
      <p className="mt-3 max-w-xl text-foreground/60">An editorial about page for a fictional sustainability company: serif headline, landscape hero, animated impact stats and a responsive team grid.</p>

      <div className="mt-8">
        <LayoutPreview slug="about-us" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
