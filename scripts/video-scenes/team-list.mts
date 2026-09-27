import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const row2 = { x: 400, y: 414 };
const row1 = { x: 400, y: 214 };

// Open Marcus's row (it expands with his photo and links while Elena's folds), then reopen Elena's
// so the list ends as it began.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, row2],
      [1.1, row2],
      [2.6, { x: 420, y: 150 }],
      [3.2, row1],
      [3.4, row1],
      [4.2, { x: 700, y: 590 }],
      [4.5, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(3.3)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.0)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.55)) await hideCursor(page);
  },
});
