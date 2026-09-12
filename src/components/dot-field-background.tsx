import { cn } from "@/lib/utils";

export function DotFieldBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_60%,transparent_100%)]",
        className,
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgb(from var(--ink) r g b / 0.18) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />
  );
}
