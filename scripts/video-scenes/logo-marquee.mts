import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on the strip: it pauses and the logo under the cursor lights up, then move along to another.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.4,
  loopBlend: 0.6,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.7, { x: 300, y: 620 }],
      [1.2, { x: 290, y: 300 }],
      [2.4, { x: 290, y: 300 }],
      [3.0, { x: 520, y: 300 }],
      [3.8, { x: 520, y: 300 }],
      [4.3, { x: 560, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 4.35 && t < 4.4) await hideCursor(page);
  },
});
