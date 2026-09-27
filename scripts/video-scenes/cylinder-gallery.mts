import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the cylinder turns on its own, and 8s is exactly one full turn at the stage's speed.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 8.0,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
