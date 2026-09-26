import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const button = { x: 404, y: 300 };

// Hover in, click Copy (it flips to its copied state and resets on its own timer), and leave.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.0,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 560, y: 470 }],
      [0.8, button],
      [1.6, button],
      [2.1, { x: 600, y: 470 }],
      [2.5, { x: 740, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.7)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(2.55)) await hideCursor(page);
  },
});
