import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const toggle = { x: 49, y: 49 };

// Hover across the three articles, then switch to the glass theme and back.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 100, y: 620 }],
      [0.9, { x: 150, y: 280 }],
      [1.5, { x: 400, y: 280 }],
      [2.1, { x: 650, y: 280 }],
      [2.7, { x: 300, y: 150 }],
      [3.1, toggle],
      [4.6, toggle],
      [5.2, { x: 300, y: 590 }],
      [5.5, { x: 300, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(3.3) || at(4.4)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(5.0)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.55)) await hideCursor(page);
  },
});
