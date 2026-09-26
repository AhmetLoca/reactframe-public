import { isCheckoutLive, type CheckoutLink } from "@/lib/checkout-links";
import { cn } from "@/lib/utils";

// The Buy button for a one-off purchase. Until an item's Lemon Squeezy product exists its url is still the
// "#" placeholder, so it renders as a disabled "Coming soon" pill instead of a link that goes nowhere.
export function BuyButton({ checkout, size = "md", label, className }: { checkout: CheckoutLink; size?: "sm" | "md" | "lg"; label?: string; className?: string }) {
  const sizing = size === "sm" ? "px-4 py-1.5 text-xs font-semibold" : size === "lg" ? "px-8 py-3.5 text-[15px] font-semibold" : "px-4 py-2 text-sm font-medium";

  if (!isCheckoutLive(checkout)) {
    return (
      <span aria-disabled="true" title="Checkout for this item opens soon" className={cn("shrink-0 cursor-default rounded-full border border-border text-foreground/50", sizing, className)}>
        Coming soon{checkout.price ? ` · ${checkout.price}` : ""}
      </span>
    );
  }

  return (
    <a
      href={checkout.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("shrink-0 rounded-full bg-[#F2A841] text-black transition-opacity hover:opacity-85", sizing, className)}
    >
      {label ?? (checkout.price ? `Buy for ${checkout.price}` : "Buy Now")}
    </a>
  );
}
