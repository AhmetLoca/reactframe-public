import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the clip plays in the phone while the stat card floats beside it; the clip loops on a
// crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  loopBlend: 0.8,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
