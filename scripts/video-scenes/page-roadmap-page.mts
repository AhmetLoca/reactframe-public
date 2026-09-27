import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Filter the board to Features, then Fixes, then back to All.
export default defineScene({
  url: "/pages/preview/roadmap-page/view",
  viewport: { width: 1280, height: 960 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 562, y: 233 }],
      [1.2, { x: 564, y: 234 }],
      [2.1, { x: 790, y: 233 }],
      [2.4, { x: 792, y: 234 }],
      [3.3, { x: 481, y: 233 }],
      [3.6, { x: 483, y: 234 }],
      [4.5, { x: 640, y: 600 }],
      [4.8, { x: 642, y: 601 }],
      [5.7, { x: 1200, y: 945 }],
      [6.0, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 6.0) await page.mouse.move(p.x, p.y);
    if (at(1.05) || at(2.25) || at(3.45)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (t > 6.0 && t < 6.06) await hideCursor(page);
  },
});
