import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { components } from "@/lib/catalog-data";

export const metadata: Metadata = {
  title: "Premium",
  description: "ReactFrame Premium — the full component library, coming soon.",
};

export default function PremiumPage() {
  const freeCount = components.filter((c) => c.free).length;
  const premiumCount = components.filter((c) => !c.free).length;

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
        <Lock className="h-5 w-5" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">ReactFrame Premium</h1>
      <p className="mx-auto mt-4 max-w-md text-foreground/60">
        Monthly subscription access to the full premium component library is coming soon. Right now {freeCount} components are free,{" "}
        {premiumCount} are marked Premium-only.
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm text-foreground/40">
        For early access or questions, reach out at{" "}
        <a href="mailto:locaahmet@gmail.com" className="underline underline-offset-2 hover:text-foreground/70">
          locaahmet@gmail.com
        </a>
        .
      </p>
    </div>
  );
}
