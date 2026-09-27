import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on both calls to action, then over the moving gallery.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  loopBlend: 0.8,
  duration: 5.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.8, { x: 1320, y: 1040 }],
      [1.3, { x: 105, y: 591 }],
      [1.4, { x: 107, y: 592 }],
      [1.9, { x: 237, y: 591 }],
      [2.4, { x: 239, y: 592 }],
      [2.9, { x: 900, y: 480 }],
      [3.4, { x: 902, y: 481 }],
      [3.9, { x: 1200, y: 945 }],
      [4.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(3.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.25)) await hideCursor(page);
  },
});
