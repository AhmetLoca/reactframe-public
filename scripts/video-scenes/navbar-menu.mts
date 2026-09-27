import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Hover Services, then Products (their dropdowns open), glance into a panel, and leave.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 300, y: 620 }],
      [0.9, { x: 306, y: 72 }],
      [1.9, { x: 310, y: 74 }],
      [2.4, { x: 405, y: 72 }],
      [3.0, { x: 405, y: 74 }],
      [3.6, { x: 420, y: 170 }],
      [4.3, { x: 700, y: 590 }],
      [4.6, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 4.65 && t < 4.7) await hideCursor(page);
  },
});
