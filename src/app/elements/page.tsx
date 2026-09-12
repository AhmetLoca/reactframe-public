import { Suspense } from "react";
import type { Metadata } from "next";
import { ElementsPage } from "./elements-page";

export const metadata: Metadata = {
  title: "Elements",
  description: "Small UI primitives — buttons, badges, inputs, and other building blocks that components are built from.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ElementsPage />
    </Suspense>
  );
}
