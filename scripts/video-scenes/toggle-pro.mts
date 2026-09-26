import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const toggle = { x: 400, y: 300 };

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 3,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.75, toggle],
      [2.05, toggle],
      [2.45, { x: 700, y: 520 }],
      [2.85, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    // Off, then on again, so the last frame matches the first.
    if (at(0.9) || at(1.6)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.1)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(2.9)) await hideCursor(page);
  },
});
