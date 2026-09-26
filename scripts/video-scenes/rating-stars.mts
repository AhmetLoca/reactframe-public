import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const y = 300;
const second = { x: 340, y };
const fourHalf = { x: 455, y }; // left half of the fifth star

// Sweep across the stars (hover preview), rate 2, then sweep again and settle back on 4.5 so the last
// frame matches the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.6,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 250, y: 420 }],
      [0.55, { x: 290, y }],
      [1.25, { x: 478, y }],
      [1.7, second],
      [2.1, second],
      [2.9, { x: 478, y }],
      [3.2, fourHalf],
      [3.45, fourHalf],
      [3.8, { x: 560, y: 440 }],
      [4.1, { x: 660, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.8) || at(3.3)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.6)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.15)) await hideCursor(page);
  },
});
