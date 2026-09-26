import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/privacy-policy" },
  title: "Privacy Policy, Page Preview",
  description: "A privacy policy page with a sticky section sidebar that follows your scroll and eleven numbered sections.",
};

export default async function PrivacyPolicyPreview() {
  const code = await getPageCode("privacy-policy");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Legal
        <PageAccessBadge slug="privacy-policy" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A privacy policy page: a sticky section sidebar that highlights as you scroll, and eleven numbered sections covering data collection, use, cookies, retention, security and your rights.</p>

      <div className="mt-8">
        <LayoutPreview slug="privacy-policy" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
