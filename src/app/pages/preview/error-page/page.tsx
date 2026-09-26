import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/error-page" },
  title: "404 / Error Page, Page Preview",
  description: "A 404 page with a large gradient number, a search field and quick links back to key pages.",
};

export default async function ErrorPagePreview() {
  const code = await getPageCode("error-page");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        App / Dashboard
        <PageAccessBadge slug="error-page" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">404 / Error Page</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A 404 page: an oversized gradient 404, a friendly headline, a site search field, and four quick links (Home, Components, Pricing, Support).</p>

      <div className="mt-8">
        <LayoutPreview slug="error-page" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
