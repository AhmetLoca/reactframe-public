import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Hold still on the ring so the spinning logos pass under the cursor, growing and showing their
// names. The clip is exactly one logo step long (45s / 8 logos), so the ring lines up with its
// start and only the initials crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.625,
  loopBlend: 0.8,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.9, { x: 790, y: 599 }],
      [1.4, { x: 400, y: 100 }],
      [2.6, { x: 400, y: 100 }],
      [3.0, { x: 600, y: 300 }],
      [4.0, { x: 600, y: 300 }],
      [4.5, { x: 760, y: 599 }],
    ]);
    if (p && t <= 4.5) await page.mouse.move(p.x, p.y);
    if (t > 4.5 && t < 4.56) {
      await page.mouse.move(820, 700);
      await hideCursor(page);
    }
  },
});
