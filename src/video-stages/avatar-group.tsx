"use client";

import { AvatarGroup } from "../../registry/new-york/avatar-group/avatar-group";
import { Stage } from "./stage";

// Initials and colors as in the thumbnail, in its order (colors come from a hash of the name).
const USERS = [
  { name: "Ada Lovelace" },
  { name: "Alan Turing" },
  { name: "Grace Hopper" },
  { name: "Liam Turner" },
  { name: "Katherine Johnson" },
  { name: "Margaret Hamilton" },
];

export function AvatarGroupStage() {
  return (
    <Stage>
      <div style={{ transform: "scale(1.25)" }}>
        <AvatarGroup users={USERS} size="lg" />
      </div>
    </Stage>
  );
}
