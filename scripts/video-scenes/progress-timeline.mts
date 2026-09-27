import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Run down the four steps; each lights up as the cursor passes.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.4,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 20 }],
      [0.9, { x: 200, y: 90 }],
      [1.6, { x: 210, y: 230 }],
      [2.3, { x: 200, y: 370 }],
      [3.0, { x: 210, y: 490 }],
      [3.8, { x: 700, y: 590 }],
      [4.1, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 4.15 && t < 4.2) await hideCursor(page);
  },
});
