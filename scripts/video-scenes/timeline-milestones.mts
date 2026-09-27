import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const y2024 = { x: 422, y: 356 };
const y2023 = { x: 422, y: 150 };

// Open 2024 (2023 folds away), then reopen 2023 so the list ends as it began.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.8,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, y2024],
      [1.1, y2024],
      [2.4, { x: 430, y: 250 }],
      [2.9, y2023],
      [3.1, y2023],
      [4.2, { x: 700, y: 590 }],
      [4.5, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(3.0)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.0)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.55)) await hideCursor(page);
  },
});
