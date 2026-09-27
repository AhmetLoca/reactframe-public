"use client";

import { YourCartPage } from "../../registry/new-york/your-cart-page/your-cart-page";
import { Stage } from "./stage";

const YOUR_CART_ITEMS = [
  { title: "Nova Headphones", variant: "Black / Medium", price: "$249.00", image: "/demo/blocks/your-cart-page/item-1.webp" },
  { title: "Orbit Sneakers", variant: "White / 9 (US)", price: "$129.00", image: "/demo/blocks/your-cart-page/item-2.webp" },
  { title: "Trail Backpack", variant: "Olive / 22L", price: "$89.00", image: "/demo/blocks/your-cart-page/item-3.webp" },
  { title: "Thermo Bottle", variant: "Black / 750ml", price: "$34.00", image: "/demo/blocks/your-cart-page/item-4.webp" },
];

const YOUR_CART_FORM = {
  email: "you@example.com",
  phone: "+1 (555) 123-4567",
  fullName: "Jane Doe",
  address: "123 Market St",
  city: "San Francisco",
  region: "California",
  zip: "94103",
  card: "4242 4242 4242 4242",
  exp: "MM / YY",
  cvc: "123",
};

// The registry preview, centred in a full-frame wrapper that scrolls when the block is taller;
// the scene records at 1280x960.
export function YourCartPageStage() {
  return (
    <Stage>
      <div id="video-scroll" className="h-full w-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex min-h-full w-full flex-col justify-center">
          <YourCartPage items={YOUR_CART_ITEMS} defaultValues={YOUR_CART_FORM} />
        </div>
      </div>
    </Stage>
  );
}
