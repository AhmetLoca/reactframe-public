import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on each feature card, then the call to action.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 7.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 592, y: 470 }],
      [1.4, { x: 594, y: 471 }],
      [1.9, { x: 1056, y: 470 }],
      [2.4, { x: 1058, y: 471 }],
      [2.9, { x: 592, y: 726 }],
      [3.4, { x: 594, y: 727 }],
      [3.9, { x: 1056, y: 726 }],
      [4.4, { x: 1058, y: 727 }],
      [4.9, { x: 166, y: 810 }],
      [5.4, { x: 168, y: 811 }],
      [5.9, { x: 1200, y: 945 }],
      [6.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(6.25)) await hideCursor(page);
  },
});
