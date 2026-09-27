import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on the call to action, then glide over the portrait rows. The rows never stop, so the seam
// is crossfaded.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 5.0,
  loopBlend: 0.8,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.8, { x: 1320, y: 1040 }],
      [1.3, { x: 640, y: 435 }],
      [1.4, { x: 642, y: 436 }],
      [1.9, { x: 400, y: 640 }],
      [2.4, { x: 402, y: 641 }],
      [2.9, { x: 900, y: 800 }],
      [3.4, { x: 902, y: 801 }],
      [3.9, { x: 1200, y: 945 }],
      [4.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(3.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.25)) await hideCursor(page);
  },
});
