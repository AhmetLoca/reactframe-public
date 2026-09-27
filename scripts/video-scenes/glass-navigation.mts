import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const toggle = { x: 692, y: 67 };

// Open the menu, run down the big links, then close it again.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, toggle],
      [1.1, toggle],
      [1.8, { x: 250, y: 167 }],
      [2.3, { x: 250, y: 250 }],
      [2.8, { x: 250, y: 333 }],
      [3.3, { x: 250, y: 415 }],
      [3.9, toggle],
      [4.2, toggle],
      [4.8, { x: 700, y: 590 }],
      [5.1, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(4.05)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.6)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.15)) await hideCursor(page);
  },
});
