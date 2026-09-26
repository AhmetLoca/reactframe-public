import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LayoutPreview } from "@/components/layout-preview";
import { getPageCode } from "@/lib/page-code";
import { PageAccessBadge } from "@/components/page-access-badge";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/preview/sign-in-page" },
  title: "Sign In, Page Preview",
  description: "A split-screen sign-in page with a customer quote, social buttons, a password field with show and hide, and a loading state.",
};

export default async function SignInPagePreview() {
  const code = await getPageCode("sign-in-page");
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/pages" className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to pages
      </Link>

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        Auth
        <PageAccessBadge slug="sign-in-page" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Sign In</h1>
      <p className="mt-3 max-w-xl text-foreground/60">A split-screen sign-in page: customer quote on one side, and on the other social sign-in buttons, email and password fields with a show/hide toggle, inline error, and a loading then signed-in state.</p>

      <div className="mt-8">
        <LayoutPreview slug="sign-in-page" basePath="/pages/preview" kind="page" code={code} />
      </div>
    </div>
  );
}
