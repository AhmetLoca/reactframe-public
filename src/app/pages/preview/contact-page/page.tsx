import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/contact-page" },
  title: "Contact, Page Preview",
  description: "A contact page with a serif headline, company details and a validated message form with a success state.",
};

export default async function ContactPagePreview() {
  const code = await getPageCode("contact-page");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Marketing
        <PageAccessBadge slug="contact-page" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A contact page: serif headline with email, office and hours on the left, and a form (name, email, topic, message) with inline validation and a sent confirmation on the right.</p>

      <div className="mt-8">
        <LayoutPreview slug="contact-page" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
