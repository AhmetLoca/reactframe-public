import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor (hovering pauses the columns): four moods at 2s each bring the gallery back to its
// first mood, and the crossfade covers the scroll offset.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 8.0,
  loopBlend: 0.6,
  async frame({ fps, page }) {
    await stepWebAnimations(page, fps);
  },
});
