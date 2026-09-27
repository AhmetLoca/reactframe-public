import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on the sport tiles and a More Information link.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 196, y: 441 }],
      [1.4, { x: 198, y: 442 }],
      [1.9, { x: 492, y: 590 }],
      [2.4, { x: 494, y: 591 }],
      [2.9, { x: 788, y: 441 }],
      [3.4, { x: 790, y: 442 }],
      [3.9, { x: 1084, y: 830 }],
      [4.4, { x: 1086, y: 831 }],
      [4.9, { x: 1200, y: 945 }],
      [5.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.25)) await hideCursor(page);
  },
});
