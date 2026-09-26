import { Suspense } from "react";
import type { Metadata } from "next";
import { PagesPage, PagesPageFallback } from "./pages-page";

export const metadata: Metadata = {
  alternates: { canonical: "/pages" },
  title: "React Page Templates: Pricing, About, Blog & More",
  description: "Full, multi-section page layouts built by combining blocks and components together.",
};

export default function Page() {
  return (
    <Suspense fallback={<PagesPageFallback />}>
      <PagesPage />
    </Suspense>
  );
}
