import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Open SaaS Platform Development, rest on its detail, and fold it away again.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 5.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 640, y: 443 }],
      [1.4, { x: 642, y: 444 }],
      [1.9, { x: 800, y: 520 }],
      [2.4, { x: 802, y: 521 }],
      [2.9, { x: 640, y: 443 }],
      [3.4, { x: 642, y: 444 }],
      [3.9, { x: 1200, y: 945 }],
      [4.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.05) || at(3.05)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.25)) await hideCursor(page);
  },
});
