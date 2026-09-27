import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const like = { x: 384, y: 523 };
const other = { x: 568, y: 523 };

// Tap Like (the count ticks up and the icon fills) and Bookmark, then tap both again so the post
// ends as it started.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, like],
      [1.5, like],
      [1.9, other],
      [2.9, other],
      [3.3, like],
      [3.9, like],
      [4.2, other],
      [4.6, other],
      [5.0, { x: 700, y: 580 }],
      [5.3, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.0) || at(3.4) || at(4.3)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.8)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.35)) await hideCursor(page);
  },
});
