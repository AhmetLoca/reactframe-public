import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/roadmap-page" },
  title: "Roadmap Page, Page Preview",
  description: "A public roadmap board with type filters and Planned, In Progress and Shipped columns.",
};

export default async function RoadmapPagePreview() {
  const code = await getPageCode("roadmap-page");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Status / Roadmap
        <PageAccessBadge slug="roadmap-page" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Roadmap Page</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A product roadmap: serif headline, pill filters for Features, Improvements and Fixes, and a three-column board (Planned with vote counts, In Progress with ETAs, Shipped with dates) whose column counts update as you filter.</p>

      <div className="mt-8">
        <LayoutPreview slug="roadmap-page" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
