import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const y = 330;

// Grab the handle, drag it left, then right, then drop it back in the middle.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.6,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 560, y: 480 }],
      [0.6, { x: 400, y }],
      [0.8, { x: 400, y }],
      [1.5, { x: 300, y }],
      [1.7, { x: 300, y }],
      [2.6, { x: 505, y }],
      [2.8, { x: 505, y }],
      [3.3, { x: 400, y }],
      [3.5, { x: 400, y }],
      [3.9, { x: 620, y: 470 }],
      [4.2, { x: 740, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.7)) await page.mouse.down();
    if (at(3.4)) await page.mouse.up();
    if (at(3.6)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.25)) await hideCursor(page);
  },
});
