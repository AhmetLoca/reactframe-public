"use client";

import { InstagramPostMockup } from "../../registry/new-york/instagram-post-mockup/instagram-post-mockup";
import { Stage } from "./stage";

// The registry preview's post at 400px wide, drawn at 0.82x.
export function InstagramPostMockupStage() {
  return (
    <Stage>
      <div style={{ width: 400, transform: "scale(0.82)" }}>
        <InstagramPostMockup
          media={[
            "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80",
            "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
          ]}
        />
      </div>
    </Stage>
  );
}
