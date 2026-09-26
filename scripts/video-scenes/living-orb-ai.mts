import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Glide across each row so every orb leans toward the pointer (the spheres' highlight follows it),
// then leave. The shaders never repeat, so the clip loops through a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.4,
  loopBlend: 0.8,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.9, { x: 60, y: 640 }],
      [1.3, { x: 150, y: 470 }],
      [2.3, { x: 650, y: 500 }],
      [2.7, { x: 620, y: 300 }],
      [3.6, { x: 150, y: 300 }],
      [4.0, { x: 180, y: 120 }],
      [4.3, { x: 330, y: 90 }],
      [4.6, { x: 420, y: -40 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.62)) await hideCursor(page);
  },
});
