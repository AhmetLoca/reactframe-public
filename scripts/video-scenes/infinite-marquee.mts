import { defineScene, stepWebAnimations } from "./_lib.mts";

// The strip just runs. The clip is two items long (295.75px each at 80px/s), so it loops exactly.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 7.394,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
