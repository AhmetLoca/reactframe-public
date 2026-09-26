import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const minus = { x: 315, y: 300 };
const plus = { x: 485, y: 300 };

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.7, plus],
      [1.7, plus],
      [2.1, minus],
      [3.1, minus],
      [3.45, { x: 700, y: 520 }],
      [3.85, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    // 24 -> 27 -> 24, so the last frame matches the first.
    if (at(0.85) || at(1.15) || at(1.45) || at(2.25) || at(2.55) || at(2.85)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.15)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.9)) await hideCursor(page);
  },
});
