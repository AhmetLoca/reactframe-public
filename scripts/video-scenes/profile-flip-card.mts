import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const card = { x: 410, y: 310 };

// Hover (the photo blurs), click to flip to the bio, click again to flip back, then leave.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, card],
      [1.4, card],
      [3.2, { x: 395, y: 330 }],
      [3.6, { x: 395, y: 330 }],
      [4.2, { x: 700, y: 590 }],
      [4.5, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.3) || at(3.4)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.0)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.55)) await hideCursor(page);
  },
});
