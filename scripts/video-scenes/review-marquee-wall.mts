import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on a review in each column while they scroll.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 4.4,
  loopBlend: 0.7,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.8, { x: 1320, y: 1040 }],
      [1.3, { x: 500, y: 400 }],
      [1.8, { x: 502, y: 401 }],
      [2.3, { x: 780, y: 600 }],
      [2.8, { x: 782, y: 601 }],
      [3.3, { x: 1200, y: 945 }],
      [3.6, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(3.35)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.65)) await hideCursor(page);
  },
});
