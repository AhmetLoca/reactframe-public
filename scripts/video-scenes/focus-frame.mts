import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the background video plays behind the blurred frame; the clip loops on a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  loopBlend: 0.8,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
