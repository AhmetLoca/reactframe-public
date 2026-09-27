import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the glow ring turns on its own, and 6s is exactly one turn, so the clip loops cleanly.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
