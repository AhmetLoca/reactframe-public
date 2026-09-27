import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on a social, a link in each column, and a guide link.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 7.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 61, y: 384 }],
      [1.4, { x: 63, y: 385 }],
      [1.9, { x: 366, y: 272 }],
      [2.4, { x: 368, y: 273 }],
      [2.9, { x: 621, y: 307 }],
      [3.4, { x: 623, y: 308 }],
      [3.9, { x: 875, y: 342 }],
      [4.4, { x: 877, y: 343 }],
      [4.9, { x: 416, y: 554 }],
      [5.4, { x: 418, y: 555 }],
      [5.9, { x: 1200, y: 945 }],
      [6.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(6.25)) await hideCursor(page);
  },
});
