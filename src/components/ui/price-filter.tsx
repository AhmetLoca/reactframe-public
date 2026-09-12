"use client";

import { cn } from "@/lib/utils";

export function PriceFilter({
  price,
  onSelect,
  freeCount,
  premiumCount,
}: {
  price: "all" | "free" | "premium";
  onSelect: (price: "free" | "premium") => void;
  freeCount: number;
  premiumCount: number;
}) {
  return (
    <div className="mb-5">
      <div className="mb-2 px-3 text-[11px] font-medium tracking-wider text-foreground/35 uppercase">Price</div>
      <ul className="flex flex-wrap gap-1.5 md:flex-col md:gap-0.5">
        <li>
          <button
            type="button"
            onClick={() => onSelect("free")}
            className={cn(
              "flex w-full items-center justify-between rounded-full px-3 py-1.5 text-left text-sm font-medium transition-colors duration-200 ease-signature md:rounded-lg",
              price === "free" ? "bg-[#00A92A] text-white" : "text-[#00A92A] hover:bg-[#00A92A]/10",
            )}
          >
            Free
            <span className={cn("text-xs", price === "free" ? "text-white/70" : "text-[#00A92A]/55")}>{freeCount}</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => onSelect("premium")}
            className={cn(
              "flex w-full items-center justify-between rounded-full px-3 py-1.5 text-left text-sm transition-colors duration-200 ease-signature md:rounded-lg",
              price === "premium" ? "bg-foreground text-background" : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground",
            )}
          >
            Premium
            <span className={cn("text-xs", price === "premium" ? "text-background/60" : "text-foreground/35")}>{premiumCount}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
