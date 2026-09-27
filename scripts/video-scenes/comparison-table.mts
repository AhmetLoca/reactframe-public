import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Run across the three plans' buttons, then down the Studio column.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, { x: 368, y: 98 }],
      [1.5, { x: 527, y: 97 }],
      [2.1, { x: 686, y: 98 }],
      [2.7, { x: 527, y: 97 }],
      [3.5, { x: 527, y: 420 }],
      [4.2, { x: 700, y: 590 }],
      [4.5, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 4.55 && t < 4.6) await hideCursor(page);
  },
});
