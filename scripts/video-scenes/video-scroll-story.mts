import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Scroll through the story: each step crossfades to the next clip and its copy; then back to the top.
// The clips keep playing, so the seam is crossfaded.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 7.0,
  loopBlend: 0.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.7, { x: 1320, y: 1040 }],
      [1.0, { x: 900, y: 700 }],
      [5.3, { x: 900, y: 700 }],
      [5.8, { x: 1200, y: 945 }],
      [6.1, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    for (const s of [1.1, 1.9, 2.8]) if (at(s)) await page.mouse.wheel(0, 960);
    for (const s of [4.0, 4.3, 4.6]) if (at(s)) await page.mouse.wheel(0, -960);
    if (at(6.15)) await hideCursor(page);
  },
});
