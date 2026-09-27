import Link from "next/link";
import { DotFieldBackground } from "@/components/dot-field-background";
import { STACK_ICONS } from "@/lib/brand-icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <DotFieldBackground className="pointer-events-none absolute inset-0 h-full w-full" />

      <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-24 text-center md:pt-32">
        <Link
          href="/docs/ai"
          className="glass animate-rise group inline-flex items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-xs font-medium transition-colors duration-300 ease-signature hover:bg-foreground/5"
        >
          <span className="rounded-full bg-gradient-to-r from-[#F2A841] to-[#FF7A45] px-2 py-0.5 text-[11px] font-semibold text-black">New</span>
          Build a site with your AI
          <span aria-hidden className="transition-transform duration-300 ease-signature group-hover:translate-x-0.5">
            &rarr;
          </span>
        </Link>

        <h1 className="animate-rise mx-auto mt-8 [animation-delay:80ms]">
          <span className="block text-[36px] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-foreground sm:text-[48px] md:text-[64px]">
            Creative React <span className="text-foreground/45">Components</span>
          </span>
          <span className="mx-auto mt-5 block max-w-2xl text-lg font-medium tracking-[-0.01em] text-balance text-foreground/80 sm:text-xl md:mt-6 md:text-[22px]">
            Animated components you can copy, prompt, or install.{" "}
            <span className="bg-gradient-to-r from-[#F2A841] to-[#FF7A45] bg-clip-text text-transparent">Faster.</span>
          </span>
        </h1>

        <div className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-4 [animation-delay:200ms]">
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity duration-300 ease-signature hover:opacity-80"
          >
            Browse Components
          </Link>
          {/* HIDDEN-UNTIL-LAUNCH (templates): re-enable together with the /templates section
          <Link
            href="/templates"
            className="rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors duration-300 ease-signature hover:bg-accent"
          >
            Browse Templates
          </Link>
          */}
        </div>

        <ul className="animate-rise mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-foreground [animation-delay:260ms]">
          {STACK_ICONS.map((icon) => (
            <li key={icon.name} className="group relative">
              <span
                tabIndex={0}
                aria-label={icon.name}
                className="flex h-6 w-6 items-center justify-center rounded opacity-80 outline-none transition-[opacity,transform] duration-300 ease-signature focus-visible:ring-2 focus-visible:ring-foreground/40 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:opacity-100 group-focus-within:-translate-y-0.5 group-focus-within:scale-110 group-focus-within:opacity-100"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full" fill={icon.mono ? "currentColor" : icon.color}>
                  <path d={icon.path} />
                  {icon.overlayPath && <path d={icon.overlayPath} fill={icon.overlayColor} />}
                </svg>
              </span>
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background opacity-0 transition-all duration-200 ease-signature group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
              >
                {icon.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
