import { Suspense } from "react";
import type { Metadata } from "next";
import { ElementsPage, ElementsPageFallback } from "./elements-page";

export const metadata: Metadata = {
  alternates: { canonical: "/elements" },
  title: "React UI Elements: Buttons, Inputs, Selects & More",
  description: "Small UI primitives, buttons, badges, inputs, and other building blocks that components are built from.",
};

export default function Page() {
  return (
    <Suspense fallback={<ElementsPageFallback />}>
      <ElementsPage />
    </Suspense>
  );
}
