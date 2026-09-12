import { Suspense } from "react";
import type { Metadata } from "next";
import { components } from "@/lib/catalog-data";
import { ComponentsCatalog } from "@/components/components-catalog";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Browse the full ReactFrame component catalog — free, open-source, React + Tailwind + shadcn/ui compatible.",
};

export default function ComponentsPage() {
  const catalogComponents = components.filter((c) => !c.type);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
      <p className="mt-3 max-w-xl text-foreground/60">
        {catalogComponents.length} components and counting. Every component ships as
        plain React + Tailwind CSS — no runtime dependency on ReactFrame itself.
      </p>

      <Suspense fallback={null}>
        <ComponentsCatalog components={catalogComponents} />
      </Suspense>
    </div>
  );
}
