import { Suspense } from "react";
import type { Metadata } from "next";
import { BlocksPage, BlocksPageFallback } from "./blocks-page";

export const metadata: Metadata = {
  alternates: { canonical: "/blocks" },
  title: "React Blocks: Hero, Pricing, Dashboard & AI Chat Sections",
  description: "Larger, ready-to-compose sections, marketing, dashboards, eCommerce, authentication, data tables, and AI/chat.",
};

export default function Page() {
  return (
    <Suspense fallback={<BlocksPageFallback />}>
      <BlocksPage />
    </Suspense>
  );
}
