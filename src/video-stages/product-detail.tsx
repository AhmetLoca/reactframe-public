"use client";

import { ProductDetail } from "../../registry/new-york/product-detail/product-detail";
import { Stage } from "./stage";

const PRODUCT_DETAIL_GALLERY = [
  { src: "/demo/blocks/product-detail/watch-1.webp", alt: "Minimal Watch, front view" },
  { src: "/demo/blocks/product-detail/watch-2.webp", alt: "Minimal Watch, dial close-up" },
  { src: "/demo/blocks/product-detail/watch-3.webp", alt: "Minimal Watch, upper strap" },
  { src: "/demo/blocks/product-detail/watch-4.webp", alt: "Minimal Watch, lower strap" },
];

const PRODUCT_DETAIL_COLORS = [
  { name: "Black", color: "#2a2a2a" },
  { name: "Silver", color: "#c8c8c8" },
  { name: "Olive", color: "#5b6b58" },
  { name: "Navy", color: "#2c3a6b" },
];

const PRODUCT_DETAIL_SIZES = ["36mm", "38mm", "40mm", "42mm"];
const PRODUCT_DETAIL_SPECS = [
  { label: "Case", value: "Stainless steel, matte black" },
  { label: "Strap", value: "Vegetable-tanned leather" },
  { label: "Movement", value: "Japanese quartz" },
  { label: "SKU", value: "WATCH-MIN-001" },
  { label: "Water resistance", value: "3 ATM (30 m)" },
  { label: "Glass", value: "Scratch-resistant mineral" },
  { label: "Care", value: "Wipe clean, avoid soaking" },
  { label: "Warranty", value: "2 years" },
];

// The registry preview, centred in a full-frame wrapper that scrolls when the block is taller;
// the scene records at 1280x960.
export function ProductDetailStage() {
  return (
    <Stage>
      <div id="video-scroll" className="h-full w-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex min-h-full w-full flex-col justify-center">
          <ProductDetail
            breadcrumb={["Home", "Shop", "Accessories", "Minimal Watch"]}
            title="Minimal Watch"
            rating={5}
            reviewCount={124}
            price="$79.00"
            compareAtPrice="$129.00"
            description="A quiet, matte-black watch with a slim case and a soft leather strap. Designed to disappear on the wrist and go with everything."
            longDescription="A quiet, matte-black watch with a slim case and a soft leather strap. Designed to disappear on the wrist and go with everything, from a desk to a dinner."
            reviewsBody="Customers love the slim profile, the soft strap and how little attention the watch asks for."
            gallery={PRODUCT_DETAIL_GALLERY}
            colors={PRODUCT_DETAIL_COLORS}
            sizes={PRODUCT_DETAIL_SIZES}
            defaultSizeIndex={2}
            specs={PRODUCT_DETAIL_SPECS}
            badge="Free shipping"
          />
        </div>
      </div>
    </Stage>
  );
}
