import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// The panel re-centres as it folds, so its header sits lower while collapsed (measured both ways).
const headerOpen = { x: 420, y: 250 };
const headerClosed = { x: 420, y: 297 };

// Fold the panel by its header, then open it again.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.2,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 640, y: 480 }],
      [0.6, headerOpen],
      [0.9, headerOpen],
      [1.5, headerClosed],
      [2.0, headerClosed],
      [2.7, { x: 640, y: 480 }],
      [3.1, { x: 760, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.1)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.5)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.15)) await hideCursor(page);
  },
});
