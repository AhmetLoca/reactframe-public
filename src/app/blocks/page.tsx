import { Suspense } from "react";
import type { Metadata } from "next";
import { BlocksPage } from "./blocks-page";

export const metadata: Metadata = {
  title: "Blocks",
  description: "Larger, ready-to-compose sections — marketing, dashboards, eCommerce, authentication, data tables, and AI/chat.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BlocksPage />
    </Suspense>
  );
}
