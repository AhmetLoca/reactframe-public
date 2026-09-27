import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on the features either side of the portrait.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 300, y: 360 }],
      [1.4, { x: 302, y: 361 }],
      [1.9, { x: 980, y: 360 }],
      [2.4, { x: 982, y: 361 }],
      [2.9, { x: 300, y: 560 }],
      [3.4, { x: 302, y: 561 }],
      [3.9, { x: 980, y: 560 }],
      [4.4, { x: 982, y: 561 }],
      [4.9, { x: 1200, y: 945 }],
      [5.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.25)) await hideCursor(page);
  },
});
