import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// The rows drift; resting on a card pauses them, leaving lets them run on. Crossfaded at the seam.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 6.0,
  loopBlend: 0.7,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.9, { x: 900, y: 959 }],
      [1.5, { x: 640, y: 420 }],
      [3.6, { x: 646, y: 424 }],
      [4.3, { x: 900, y: 959 }],
    ]);
    if (p && t <= 4.3) await page.mouse.move(p.x, p.y);
    if (t > 4.3 && t < 4.36) {
      await page.mouse.move(920, 1060);
      await hideCursor(page);
    }
  },
});
