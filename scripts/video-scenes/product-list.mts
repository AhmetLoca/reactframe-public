import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on two products, filter to Electronics, then back to All Products.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 769, y: 141 }],
      [1.4, { x: 771, y: 142 }],
      [1.9, { x: 437, y: 397 }],
      [2.4, { x: 439, y: 398 }],
      [2.9, { x: 140, y: 282 }],
      [3.4, { x: 142, y: 283 }],
      [3.9, { x: 140, y: 250 }],
      [4.4, { x: 142, y: 251 }],
      [4.9, { x: 1200, y: 945 }],
      [5.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(3.05) || at(4.05)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.25)) await hideCursor(page);
  },
});
