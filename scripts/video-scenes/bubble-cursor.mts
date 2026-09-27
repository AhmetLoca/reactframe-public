import { defineScene, stepWebAnimations } from "./_lib.mts";

// Sweep the pointer through a figure-eight so the metaball trail stretches, splits and merges,
// then leave the frame so the bubbles fade out and the field is empty again, as it starts.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    if (t >= 0.5 && t < 4.6) {
      const a = ((t - 0.5) / 4.1) * Math.PI * 2 * 1.25;
      const r = Math.min(1, (t - 0.5) / 0.6);
      await page.mouse.move(400 + Math.sin(a) * 250 * r, 300 + Math.sin(a * 2) * 130 * r);
    }
    if (at(4.6)) await page.mouse.move(400, 640);
    if (at(4.65)) await page.evaluate(() => window.dispatchEvent(new PointerEvent("pointerleave")));
  },
});
