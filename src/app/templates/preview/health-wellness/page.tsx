import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";

export const metadata: Metadata = {
  title: "Bloom Wellness Studio — Template Preview",
  description: "A Health & Wellness landing page template, composed entirely from ReactFrame components.",
};

export default function HealthWellnessTemplatePreview() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/templates" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to templates
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Health &amp; Wellness · One Page
        <span className="rounded-full border border-[#00A92A]/50 bg-black/70 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#00A92A] normal-case shadow-[0_0_10px_rgba(0,169,42,0.3)] backdrop-blur-sm [text-shadow:0_0_6px_rgba(0,169,42,0.65)]">
          Free
        </span>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Bloom Wellness Studio</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A Health &amp; Wellness landing page template, composed entirely from ReactFrame components.</p>

      <div className="mt-8">
        <LayoutPreview slug="health-wellness" basePath="/templates/preview" kind="template" />
      </div>
    </div>
  );
}
