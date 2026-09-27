import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Scroll the gallery's own container: the mosaic grows and spins, then scroll back to the top.
// The scroll hint only shows before the first scroll, so the seam is crossfaded.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.6,
  loopBlend: 0.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.7, { x: 820, y: 660 }],
      [1.0, { x: 620, y: 480 }],
      [4.8, { x: 620, y: 480 }],
      [5.3, { x: 780, y: 590 }],
      [5.6, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    for (const s of [1.1, 1.35, 1.6, 1.85, 2.1, 2.35]) if (at(s)) await page.mouse.wheel(0, 300);
    for (const s of [3.3, 3.55, 3.8, 4.05, 4.3, 4.55]) if (at(s)) await page.mouse.wheel(0, -300);
    if (at(5.65)) await hideCursor(page);
  },
});
