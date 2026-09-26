import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const day = { x: 307, y: 300 };
const week = { x: 390, y: 300 };
const month = { x: 482, y: 300 };

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 3.8,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.7, month],
      [1.0, month],
      [1.5, day],
      [1.8, day],
      [2.2, week],
      [2.6, week],
      [3.0, { x: 700, y: 520 }],
      [3.45, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    // Month -> Day -> back to Week, so the last frame matches the first.
    if (at(0.8) || at(1.6) || at(2.3)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.7)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.5)) await hideCursor(page);
  },
});
