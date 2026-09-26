import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const trigger = { x: 420, y: 300 };
const design = { x: 380, y: 380 };
const engineering = { x: 380, y: 456 };
const product = { x: 380, y: 532 };

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.7, trigger],
      [1.0, trigger],
      [1.4, engineering],
      [1.8, product],
      [2.2, engineering],
      [2.6, design],
      [2.9, design],
      [3.3, { x: 700, y: 520 }],
      [3.7, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    // Open, browse, then pick Design again so the last frame matches the first.
    if (at(0.8) || at(2.75)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.0)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.75)) await hideCursor(page);
  },
});
