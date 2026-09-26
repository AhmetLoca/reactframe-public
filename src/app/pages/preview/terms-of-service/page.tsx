import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/terms-of-service" },
  title: "Terms of Service, Page Preview",
  description: "A terms of service page with a sticky section sidebar that follows your scroll and eleven numbered sections.",
};

export default async function TermsOfServicePreview() {
  const code = await getPageCode("terms-of-service");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Legal
        <PageAccessBadge slug="terms-of-service" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A legal page with a sticky, scroll-aware table of contents on the left and numbered terms sections on the right; clicking a section scrolls to it smoothly and the current section stays highlighted as you read.</p>

      <div className="mt-8">
        <LayoutPreview slug="terms-of-service" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
