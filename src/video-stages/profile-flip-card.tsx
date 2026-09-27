"use client";

import { ProfileFlipCard } from "../../registry/new-york/profile-flip-card/profile-flip-card";
import { Stage } from "./stage";

// The registry preview's 340x450 card at natural size.
export function ProfileFlipCardStage() {
  return (
    <Stage>
      <div style={{ width: 340, height: 450 }}>
        <ProfileFlipCard src="/demo/32.webp" name="Zara Osei" role="Creative Director" bio="Design is like a perfect strike, you only get one shot to make an impression. I craft brands that move fast, hit hard, and leave something behind." tag="Design" />
      </div>
    </Stage>
  );
}
