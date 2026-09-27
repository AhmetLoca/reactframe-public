import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const item = (i: number) => ({ x: 80, y: 226 + i * 29 });

// Run the pointer down the dock so the labels swell as it passes, pick the fourth panel, then go
// back up and pick the first again, so the clip ends where it began.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 400, y: 620 }],
      [0.8, item(0)],
      [2.0, item(5)],
      [2.4, item(3)],
      [3.1, item(3)],
      [4.0, item(0)],
      [4.5, item(0)],
      [5.0, { x: 300, y: 560 }],
      [5.3, { x: 380, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(2.6) || at(4.2)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(5.35)) await hideCursor(page);
  },
});
