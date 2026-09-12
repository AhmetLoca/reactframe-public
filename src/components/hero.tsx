import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { components } from "@/lib/catalog-data";
import { DotFieldBackground } from "@/components/dot-field-background";

const STACK = ["React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Motion"];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <DotFieldBackground className="pointer-events-none absolute inset-0 h-full w-full" />

      <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-24 text-center md:pt-32">
        <span className="glass animate-rise inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium">
          {components.length}+ free, open-source components
        </span>

        <h1 className="animate-rise mx-auto mt-6 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight [animation-delay:80ms] md:text-6xl">
          UI library for Design Engineers
        </h1>

        <p className="animate-rise mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-foreground/60 [animation-delay:140ms]">
          Animated components and effects built with React, TypeScript,
          Tailwind CSS and Motion — shipped in shadcn/ui&apos;s registry
          format. Copy, paste, own the code.
        </p>

        <div className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-4 [animation-delay:200ms]">
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity duration-300 ease-signature hover:opacity-80"
          >
            Browse Components
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/templates"
            className="rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors duration-300 ease-signature hover:bg-accent"
          >
            Browse Templates
          </Link>
        </div>

        <div className="animate-rise mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wider text-foreground/35 [animation-delay:260ms]">
          {STACK.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
