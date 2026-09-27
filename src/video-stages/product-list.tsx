"use client";

import { ProductList } from "../../registry/new-york/product-list/product-list";
import { Stage } from "./stage";

const PRODUCT_LIST_ITEMS = [
  { title: "Noise Cancelling Headphones", price: "$199.00", category: "Electronics", tier: "premium" as const, badge: "new" as const, image: "/demo/blocks/product-list/headphones.webp", url: "#" },
  { title: "Minimal Watch", price: "$79.00", compareAtPrice: "$129.00", category: "Accessories", tier: "premium" as const, badge: "sale" as const, image: "/demo/blocks/product-list/watch.webp", url: "#" },
  { title: "Insulated Water Bottle", price: "$39.00", category: "Sports & Outdoors", tier: "premium" as const, badge: "new" as const, image: "/demo/blocks/product-list/bottle.webp", url: "#" },
  { title: "Laptop Stand", price: "$49.00", compareAtPrice: "$89.00", category: "Electronics", tier: "premium" as const, badge: "sale" as const, image: "/demo/blocks/product-list/stand.webp", url: "#" },
  { title: "Everyday Backpack", price: "$89.00", category: "Apparel", tier: "premium" as const, badge: "new" as const, image: "/demo/blocks/product-list/backpack.webp", url: "#" },
  { title: "Wireless Earbuds", price: "$129.00", category: "Electronics", tier: "premium" as const, image: "/demo/blocks/product-list/earbuds.webp", url: "#" },
  { title: "LED Desk Lamp", price: "$59.00", category: "Home & Living", tier: "premium" as const, badge: "new" as const, image: "/demo/blocks/product-list/lamp.webp", url: "#" },
  { title: "Running Shoes", price: "$99.00", compareAtPrice: "$149.00", category: "Sports & Outdoors", tier: "premium" as const, badge: "sale" as const, image: "/demo/blocks/product-list/shoe.webp", url: "#" },
  { title: "Premium Notebook", price: "$24.00", category: "Books", tier: "free" as const, badge: "new" as const, image: "/demo/blocks/product-list/notebook.webp", url: "#" },
];

// The registry preview in a full-frame wrapper, top-aligned so filtering (which shortens the grid)
// does not shift the sidebar; the scene records at 1280x960.
export function ProductListStage() {
  return (
    <Stage>
      <div id="video-scroll" className="h-full w-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <ProductList products={PRODUCT_LIST_ITEMS} />
      </div>
    </Stage>
  );
}
