import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/documentation-page" },
  title: "Documentation Page, Page Preview",
  description: "A docs hub with a serif headline, live search, six topic cards and a list of popular articles.",
};

export default async function DocumentationPagePreview() {
  const code = await getPageCode("documentation-page");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Docs / Knowledge Base
        <PageAccessBadge slug="documentation-page" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Documentation Page</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A documentation home: serif headline, a pill search box with a ⌘K shortcut that filters as you type, six icon topic cards, and a popular-articles list with category tags.</p>

      <div className="mt-8">
        <LayoutPreview slug="documentation-page" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
