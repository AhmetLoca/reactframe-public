import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: the badge just steps Pending -> Processing -> Paid and lands back on
// the Paid state the static thumbnail shows.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 3,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    if (at(0.5)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());
  },
});
